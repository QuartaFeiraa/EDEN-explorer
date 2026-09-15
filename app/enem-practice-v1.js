(() => {
  'use strict';
  const api=window.RUMO_ENEM;if(!api)return;
  const {data,q,qa,sb,state,escapeHTML,shell}=api;
  let questions=[],index=0,startedAt=0;
  const guestKey='rumo-enem-guest-stats';
  const shuffle=list=>[...list].sort(()=>Math.random()-.5);
  const options=raw=>Array.isArray(raw)?raw:[];

  function areaName(id){return data.areas.find(a=>a.id===id)?.short_name||'ENEM'}
  function topicName(id){return data.topics.find(t=>t.id===id)?.name||''}
  function renderFilters(areaId=''){
    const area=q('#enem-area-filter'),topic=q('#enem-topic-filter');if(!area||!topic)return;
    const current=areaId||area.value;
    area.innerHTML='<option value="">Todas as áreas</option>'+data.areas.filter(a=>a.id!=='enem-redacao').map(a=>`<option value="${escapeHTML(a.id)}">${escapeHTML(a.short_name||a.name)}</option>`).join('');
    if([...area.options].some(o=>o.value===current))area.value=current;
    const rows=area.value?data.topics.filter(t=>t.area_id===area.value):[];
    topic.innerHTML='<option value="">Todos os assuntos</option>'+rows.map(t=>`<option value="${escapeHTML(t.id)}">${escapeHTML(t.name)}</option>`).join('');
    topic.disabled=!area.value||!rows.length;
  }
  async function load(){
    const stage=q('#enem-question-stage');if(!stage)return;
    stage.innerHTML='<div class="rumo-state"><b>Carregando questões…</b><span>Montando uma sequência curta para você.</span></div>';
    try{
      const area=q('#enem-area-filter')?.value||'',topic=q('#enem-topic-filter')?.value||'';
      let req=sb.from('question_bank').select('id,area_id,topic_id,prompt,options,difficulty,tags').eq('track_id','enem').eq('active',true).eq('verified',true).limit(100);
      if(area)req=req.eq('area_id',area);if(topic)req=req.eq('topic_id',topic);
      const res=await req;if(res.error)throw res.error;
      questions=shuffle(res.data||[]);index=0;renderQuestion();
    }catch(err){console.warn('ENEM questions unavailable',err);stage.innerHTML='<div class="rumo-state error"><b>Questões indisponíveis agora.</b><span>O restante do RUMO continua funcionando. Tente novamente em instantes.</span></div>'}
  }
  function renderQuestion(){
    const stage=q('#enem-question-stage');if(!stage)return;const item=questions[index];
    if(!item){stage.innerHTML='<div class="rumo-state"><b>Nenhuma questão neste filtro.</b><span>Escolha outra área ou assunto.</span></div>';return}
    startedAt=Date.now();
    stage.innerHTML=`<article class="rumo-question"><div class="rumo-question-meta"><span>${escapeHTML(areaName(item.area_id))}</span>${item.topic_id?`<span>${escapeHTML(topicName(item.topic_id))}</span>`:''}<span>Dificuldade ${Math.max(1,Math.min(5,Number(item.difficulty)||1))}/5</span><span>${index+1}/${questions.length}</span></div><h2>${escapeHTML(item.prompt)}</h2><div class="rumo-options">${options(item.options).map((o,i)=>{const key=String(o?.key||String.fromCharCode(65+i)).toUpperCase();return `<button data-enem-answer="${escapeHTML(key)}"><b>${escapeHTML(key)}</b><span>${escapeHTML(o?.text??o)}</span></button>`}).join('')}</div><div id="enem-feedback"></div></article>`;
    qa('[data-enem-answer]',stage).forEach(b=>b.onclick=()=>answer(item,b.dataset.enemAnswer));
  }
  async function answer(item,selected){
    const buttons=qa('[data-enem-answer]',q('#enem-question-stage'));buttons.forEach(b=>b.disabled=true);
    const feedback=q('#enem-feedback');if(feedback)feedback.innerHTML='<div class="rumo-feedback pending">Corrigindo…</div>';
    try{
      const elapsed=Math.min(21600,Math.max(0,Math.round((Date.now()-startedAt)/1000)));
      const res=await sb.functions.invoke('check-enem-answer',{body:{question_id:item.id,selected_answer:selected,elapsed_seconds:elapsed}});if(res.error)throw res.error;
      const result=res.data;if(!result||typeof result.is_correct!=='boolean')throw new Error('empty correction');
      const correct=result.is_correct;
      buttons.forEach(b=>{if(b.dataset.enemAnswer===result.correct_answer)b.classList.add('correct');else if(b.dataset.enemAnswer===selected&&!correct)b.classList.add('wrong')});
      if(!state.user){const local=JSON.parse(localStorage.getItem(guestKey)||'{"attempts":0,"correct":0}');local.attempts=(Number(local.attempts)||0)+1;if(correct)local.correct=(Number(local.correct)||0)+1;localStorage.setItem(guestKey,JSON.stringify(local))}
      api.bump(correct);
      if(feedback)feedback.innerHTML=`<div class="rumo-feedback ${correct?'success':'failure'}"><b>${correct?'Acertou.':'Ainda não.'}</b><span>${escapeHTML(result.explanation||'')}</span><button class="secondary" id="enem-next-question">Próxima questão →</button></div>`;
      q('#enem-next-question')?.addEventListener('click',()=>{index=(index+1)%questions.length;renderQuestion()});
    }catch(err){console.warn('ENEM correction failed',err);buttons.forEach(b=>b.disabled=false);if(feedback)feedback.innerHTML='<div class="rumo-feedback failure"><b>Não consegui corrigir agora.</b><span>A resposta não foi registrada.</span></div>'}
  }
  function bind(){
    const area=q('#enem-area-filter'),topic=q('#enem-topic-filter'),fresh=q('#enem-new-list');if(!area||!topic||!fresh)return;
    area.onchange=()=>{renderFilters(area.value);load()};topic.onchange=load;fresh.onclick=load;
  }
  function ready(areaId=''){renderFilters(areaId);bind();if(areaId)load()}
  document.addEventListener('rumo:enem-ready',()=>ready());
  document.addEventListener('rumo:enem-area',e=>ready(e.detail?.areaId||''));
  document.addEventListener('rumo:tab',e=>{if(e.detail?.id==='questoes'&&!questions.length)load()});
  if(data.areas?.length)ready();
  window.RUMO_ENEM_PRACTICE={load};
})();