(() => {
  'use strict';
  const R=()=>window.RUMO;
  function inject(){
    const r=R();
    if(!r.qs('#history-v1'))document.body.insertAdjacentHTML('beforeend',`<div id="history-v1" class="modal"><div class="modal-card history-shell-v1"><button class="close" id="history-close-v1">×</button><div class="eyebrow">SEU HISTÓRICO</div><h2>O que você realmente estudou.</h2><p class="history-intro-v1">Tempo, questões e sessões ficam aqui para você enxergar consistência sem depender de memória.</p><div id="history-summary-v1" class="history-summary-v1"></div><div id="history-list-v1" class="history-list-v1"></div></div></div>`);
    let b=r.qs('#history-open-v1');
    if(!b){b=document.createElement('button');b.id='history-open-v1';b.className='history-open-v1';b.type='button';b.textContent='Histórico';const top=r.qs('.top-actions');if(top)top.insertBefore(b,top.querySelector('.user')||null)}
    b.onclick=open;
    r.qs('#history-close-v1').onclick=()=>r.qs('#history-v1').classList.remove('open');
    r.qs('#history-v1').onclick=e=>{if(e.target.id==='history-v1')e.currentTarget.classList.remove('open')};
  }
  const matBy=id=>R().state.materias.find(x=>x.id===id),topBy=id=>R().state.topicos.find(x=>x.id===id);
  async function open(){
    inject();const r=R(),modal=r.qs('#history-v1'),list=r.qs('#history-list-v1'),summary=r.qs('#history-summary-v1');modal.classList.add('open');
    if(!r.state.user){summary.innerHTML='<div><b>—</b><span>histórico na nuvem</span></div>';list.innerHTML='<div class="data-empty"><b>Entre para manter seu histórico em qualquer aparelho.</b>O modo visitante continua útil, mas o histórico completo é salvo na conta.</div>';return}
    list.innerHTML='<div class="data-empty">Carregando suas sessões...</div>';
    const since=new Date();since.setDate(since.getDate()-30);
    const {data,error}=await r.sb.from('sessoes_estudo').select('*').eq('user_id',r.state.user.id).gte('estudado_em',since.toISOString()).order('estudado_em',{ascending:false}).limit(60);
    if(error){list.innerHTML='<div class="data-empty"><b>Não consegui carregar agora.</b>Tente novamente em alguns instantes.</div>';return}
    const rows=data||[],weekStart=new Date();weekStart.setDate(weekStart.getDate()-6);weekStart.setHours(0,0,0,0);const week=rows.filter(x=>new Date(x.estudado_em)>=weekStart),minutes=week.reduce((a,x)=>a+(x.minutos||0),0),questions=week.reduce((a,x)=>a+(x.questoes||0),0),correct=week.reduce((a,x)=>a+(x.acertos||0),0),accuracy=questions?Math.round(correct/questions*100):0;
    summary.innerHTML=`<div><b>${r.formatMinutes(minutes)}</b><span>últimos 7 dias</span></div><div><b>${questions}</b><span>questões</span></div><div><b>${questions?accuracy+'%':'—'}</b><span>acertos</span></div><div><b>${week.length}</b><span>sessões</span></div>`;
    if(!rows.length){list.innerHTML='<div class="data-empty"><b>Seu histórico começa na primeira sessão.</b>Abra uma tarefa de Hoje ou use “Registrar estudo”.</div>';return}
    list.innerHTML=rows.map(x=>{const m=matBy(x.materia_id),t=topBy(x.topico_id),date=new Date(x.estudado_em),q=x.questoes||0,a=x.acertos||0;return`<article class="history-row-v1"><div><b>${r.escapeHTML(m?.nome||'Estudo livre')}</b><span>${r.escapeHTML(t?.nome||x.notas?.slice(0,70)||'Sessão registrada')}</span></div><div class="history-row-meta-v1"><b>${r.formatMinutes(x.minutos||0)}</b>${q?`<span>${a}/${q} acertos</span>`:''}<span>${date.toLocaleDateString('pt-BR',{day:'2-digit',month:'short'})}</span></div></article>`}).join('');
  }
  inject();document.addEventListener('rumo:session-saved',()=>{if(R().qs('#history-v1')?.classList.contains('open'))open()});
  window.RUMO_HISTORY={open};
})();