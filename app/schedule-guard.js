(() => {
  'use strict';
  let fixing=false,lastKey='';
  const R=()=>window.RUMO;
  function nextAllowed(from,allowed){let d=from;for(let i=1;i<=7;i++){d=R().addDays(d,1);if(allowed.includes(new Date(`${d}T12:00:00`).getDay()))return d}return R().addDays(from,1)}
  async function guard(){const r=R(),s=r?.state;if(!r||fixing||!s?.user||!s.goal)return;const allowed=s.goal.study_days?.length?s.goal.study_days:[1,2,3,4,5],today=r.today(),dow=new Date(`${today}T12:00:00`).getDay();if(allowed.includes(dow))return;const tasks=(s.tasks||[]).filter(x=>!x.concluida);if(!tasks.length)return;const key=`${today}:${tasks.map(x=>x.id).sort().join(',')}`;if(key===lastKey)return;lastKey=key;fixing=true;const target=nextAllowed(today,allowed);for(const t of tasks)await r.sb.from('plano_tarefas').update({data:target}).eq('id',t.id);fixing=false;await window.RUMO_ENGINE?.loadTasks();r.toast(`Hoje é dia livre. Pendências movidas para ${new Date(`${target}T12:00:00`).toLocaleDateString('pt-BR',{weekday:'long'})}.`)}
  document.addEventListener('rumo:tasks',()=>setTimeout(guard,60));document.addEventListener('rumo:context',()=>setTimeout(guard,400));
})();