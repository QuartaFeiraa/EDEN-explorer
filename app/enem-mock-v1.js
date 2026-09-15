(() => {
  'use strict';
  const api=window.RUMO_ENEM;if(!api)return;
  const {data,q,qa,sb,state,escapeHTML,pct}=api;
  let run=null;
  const guestKey='rumo-enem-guest-stats';
  const shuffle=list=>[...list].sort(()=>Math.random()-.5);
  const opts=raw=>Array.isArray(raw)?raw:[];
  function setup(){
    const root=q('#enem-mock-root');if(!root||run)return;
    root.innerHTML=`<div class="rumo-mock-setup"><div><small>BLOCO RÁPIDO</small><h2>Monte um simulado agora.</h2><p>Sem correção durante a prova. O diagnóstico aparece apenas no final.</p></div><div class="rumo-mock-controls"><label>Questões<select id="enem-mock-size"><option value="4">4 questões</option><option value="8" selected>8 questões</option><option value="12">12 questões</option></select></label><label>Área<select id="enem-mock-area"><option value="">Todas</option>${data.areas.filter(a=>a.id!=='enem-redacao').map(a=>`<option value="${escapeHTML(a.id)}">${escapeHTML(a.short_name||a.name)}</option>`).join('')}</select></label><button class="primary" id="enem-start-mock">Iniciar simulado</button></div></div>`;
    q('#enem-start-mock').onclick=start;
  }
  async function fetchQuestions(area,size){
    let req=sb.from('question_bank').select('id,area_id,topic_id,prompt,options,difficulty').eq('track_id','enem').eq('active',true).eq('verified',true).limit(100);if(area)req=req.eq('area_id',area);
    const res=await req;if(res.error)throw res.error;return shuffle(res.data||[]).slice(0,size)
  }
  async function start(){
    const root=q('#enem-mock-root'),size=Math.max(4,Math.min(12,Number(q('#enem-mock-size')?.value)||8)),area=q('#enem-mock-area')?.value||'';
    root.innerHTML='<div class="rumo-state"><b>Preparando simulado…</b><span>Selecionando questões sem exibir gabarito.</span></div>';
    try{const questions=await fetchQuestions(area,size);if(questions.length<4)throw new Error('insufficient questions');run={questions,index:0,answers:{},startedAt:Date.now()};render()}catch(err){console.warn('Mock setup failed',err);run=null;root.innerHTML='<div class="rumo-state error"><b>Base insuficiente para este filtro.</b><span>Escolha outra área ou use o bloco misto.</span><button class="secondary" id="mock-back">Voltar</button></div>';q('#mock-back').onclick=setup}
  }
  function render(){
    const root=q('#enem-mock-root'),item=run?.questions[run.index];if(!root||!item)return;const selected=run.answers[item.id],area=data.areas.find(a=>a.id===item.area_id);
    root.innerHTML=`<article class="rumo-mock"><div class="rumo-mock-top"><div><small>SIMULADO EM ANDAMENTO</small><b>${run.index+1} de ${run.questions.length}</b></div><button class="text-link" id="enem-abort-mock">Sair</button></div><div class="rumo-mock-progress"><i style="width:${Math.round((run.index+1)/run.questions.length*100)}%"></i></div><div class="rumo-question-meta"><span>${escapeHTML(area?.short_name||'ENEM')}</span></div><h2>${escapeHTML(item.prompt)}</h2><div class="rumo-options">${opts(item.options).map((o,i)=>{const key=String(o?.key||String.fromCharCode(65+i)).toUpperCase();return `<button data-mock-answer="${escapeHTML(key)}" class="${selected===key?'selected':''}"><b>${escapeHTML(key)}</b><span>${escapeHTML(o?.text??o)}</span></button>`}).join('')}</div><div class="rumo-mock-nav"><button class="secondary" id="mock-prev" ${run.index===0?'disabled':''}>← Anterior</button><span>${Object.keys(run.answers).length}/${run.questions.length} respondidas</span>${run.index===run.questions.length-1?'<button class="primary" id="mock-finish">Finalizar</button>':'<button class="primary" id="mock-next">Próxima →</button>'}</div></article>`;
    qa('[data-mock-answer]',root).forEach(b=>b.onclick=()=>{run.answers[item.id]=b.dataset.mockAnswer;render()});q('#mock-prev')?.addEventListener('click',()=>{run.index--;render()});q('#mock-next')?.addEventListener('click',()=>{run.index++;render()});q('#mock-finish')?.addEventListener('click',finish);q('#enem-abort-mock').onclick=()=>{run=null;setup()}
  }
  async function finish(){
    const root=q('#enem-mock-root'),current=run;if(!root||!current)return;root.innerHTML='<div class="rumo-state"><b>Corrigindo simulado…</b><span>Consolidando seu diagnóstico.</span></div>';
    try{
      const answered=current.questions.filter(item=>current.answers[item.id]);
      const results=await Promise.all(answered.map(async item=>{const res=await sb.rpc('rumo_check_answer',{p_question_id:item.id,p_selected_answer:current.answers[item.id],p_elapsed_seconds:null});if(res.error)throw res.error;return{item,result:res.data?.[0]}}));
      const correct=results.filter(x=>x.result?.is_correct).length,total=current.questions.length;
      if(!state.user){const local=JSON.parse(localStorage.getItem(guestKey)||'{"attempts":0,"correct":0}');local.attempts=(Number(local.attempts)||0)+answered.length;local.correct=(Number(local.correct)||0)+correct;localStorage.setItem(guestKey,JSON.stringify(local))}
      data.stats.attempts+=answered.length;data.stats.correct+=correct;api.loadStats().catch(()=>{});
      const byArea={};for(const x of results){const id=x.item.area_id;byArea[id]??={total:0,correct:0};byArea[id].total++;if(x.result?.is_correct)byArea[id].correct++}
      run=null;
      root.innerHTML=`<div class="rumo-mock-result"><small>RESULTADO</small><div class="rumo-score"><b>${correct}/${total}</b><span>${pct(correct,total)}% de acerto</span></div><div class="rumo-result-areas">${Object.entries(byArea).map(([id,s])=>`<div><span>${escapeHTML(data.areas.find(a=>a.id===id)?.short_name||id)}</span><b>${s.correct}/${s.total}</b></div>`).join('')}</div><p>${pct(correct,total)>=70?'Boa base. Use os erros para definir a próxima revisão.':'O resultado já mostra onde concentrar sua próxima rodada de estudos.'}</p><button class="primary" id="mock-again">Novo simulado</button></div>`;q('#mock-again').onclick=setup;
    }catch(err){console.warn('Mock correction failed',err);run=null;root.innerHTML='<div class="rumo-state error"><b>Não consegui concluir a correção.</b><span>Nenhum resultado parcial será mostrado como definitivo.</span><button class="secondary" id="mock-retry-home">Voltar</button></div>';q('#mock-retry-home').onclick=setup}
  }
  document.addEventListener('rumo:enem-ready',setup);document.addEventListener('rumo:tab',e=>{if(e.detail?.id==='simulados'&&!run)setup()});if(data.areas?.length)setup();
  window.RUMO_ENEM_MOCK={setup,start};
})();