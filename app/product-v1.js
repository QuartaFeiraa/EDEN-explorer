(() => {
  'use strict';
  const R=()=>window.RUMO;
  function dateLabel(){const d=new Date(),text=d.toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'}).toUpperCase();const e=document.querySelector('.hero-home .eyebrow');if(e)e.innerHTML=`<span class="pulse-dot"></span> ${text}`}
  function injectStatus(){if(document.querySelector('#rumo-connection-v1'))return;const el=document.createElement('div');el.id='rumo-connection-v1';el.className='rumo-connection-v1';el.hidden=true;document.querySelector('.top-actions')?.prepend(el)}
  function connection(){injectStatus();const el=document.querySelector('#rumo-connection-v1');if(!el)return;const data=document.documentElement.dataset.rumoData;if(!navigator.onLine){el.hidden=false;el.textContent='Offline';el.className='rumo-connection-v1 warn'}else if(data==='degraded'){el.hidden=false;el.textContent='Dados atrasados';el.className='rumo-connection-v1 warn'}else{el.hidden=true;el.textContent='';el.className='rumo-connection-v1'}}
  function labels(){const perf=document.querySelectorAll('.performance-card .metric');if(perf[1]){const s=perf[1].querySelector('span');if(s)s.textContent='Sessões nos últimos 7 dias'}const trend=document.querySelector('.activity-card .trend');if(trend){trend.textContent=R()?.state.user?'7 DIAS':'PRÉVIA';trend.classList.remove('positive')}const weekMetrics=document.querySelectorAll('.week-card .metric');if(weekMetrics[0])weekMetrics[0].querySelector('span').textContent='Plano concluído';if(weekMetrics[1])weekMetrics[1].querySelector('span').textContent='Revisões em dia'}
  async function derived(){
    const r=R();labels();const metrics=r.qsa('.week-card .metric b');if(!r.state.user){metrics.forEach(x=>x.textContent='—');return}
    const start=new Date();start.setDate(start.getDate()-6);start.setHours(0,0,0,0);const today=r.today();
    const [tasksRes]=await Promise.all([r.sb.from('plano_tarefas').select('concluida,data').eq('user_id',r.state.user.id).gte('data',start.toISOString().slice(0,10)).lte('data',today)]);
    const tasks=tasksRes.data||[],completion=tasks.length?Math.round(tasks.filter(x=>x.concluida).length/tasks.length*100):0;
    const topics=r.state.topicos||[],due=topics.filter(t=>t.proxima_revisao&&String(t.proxima_revisao).slice(0,10)<=today).length,reviewPct=topics.length?Math.max(0,Math.round((topics.length-due)/topics.length*100)):100;
    if(metrics[0])metrics[0].textContent=tasks.length?`${completion}%`:'—';if(metrics[1])metrics[1].textContent=topics.length?`${reviewPct}%`:'—';
    const title=r.qs('.week-card h2');if(title)title.textContent=completion>=75?'Você está no ritmo.':completion>=40?'Ainda dá para fechar bem a semana.':'Vamos recuperar o ritmo sem exagerar.';
  }
  function markBeta(){document.documentElement.dataset.rumoProduct='beta-v1'}
  dateLabel();labels();connection();markBeta();
  addEventListener('online',connection);addEventListener('offline',connection);
  document.addEventListener('rumo:context',derived);document.addEventListener('rumo:session-saved',derived);document.addEventListener('rumo:booted',()=>{connection();derived()});
  const dataObserver=new MutationObserver(connection);dataObserver.observe(document.documentElement,{attributes:true,attributeFilter:['data-rumo-data']});
})();