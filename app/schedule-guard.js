(() => {
  'use strict';

  let fixing=false,lastKey='';
  const R=()=>window.RUMO;

  function validStudyDays(goal){
    const values=Array.isArray(goal?.study_days)?goal.study_days.map(Number).filter(x=>Number.isInteger(x)&&x>=0&&x<=6):[];
    return values.length?[...new Set(values)]:[1,2,3,4,5];
  }

  function nextAllowed(from,allowed){
    let d=from;
    for(let i=1;i<=7;i++){
      d=R().addDays(d,1);
      if(allowed.includes(new Date(`${d}T12:00:00`).getDay()))return d;
    }
    return R().addDays(from,1);
  }

  async function guard(){
    const r=R(),s=r?.state;
    if(!r||fixing||!s?.user||!s.goal)return;
    const allowed=validStudyDays(s.goal),today=r.today(),day=new Date(`${today}T12:00:00`).getDay();
    if(allowed.includes(day))return;
    const tasks=(s.tasks||[]).filter(x=>!x.concluida&&x.id);
    if(!tasks.length)return;
    const key=`${s.user.id}:${today}:${tasks.map(x=>x.id).sort().join(',')}`;
    if(key===lastKey)return;

    fixing=true;
    const target=nextAllowed(today,allowed),ids=tasks.map(x=>x.id);
    try{
      const {error}=await r.sb.from('plano_tarefas').update({data:target}).eq('user_id',s.user.id).in('id',ids);
      if(error){
        console.warn('RUMO schedule guard failed',error.code||error.message);
        r.toast('Não consegui mover as tarefas do dia livre agora.');
        return;
      }
      lastKey=key;
      await window.RUMO_ENGINE?.loadTasks();
      r.toast(`Hoje é dia livre. Pendências movidas para ${new Date(`${target}T12:00:00`).toLocaleDateString('pt-BR',{weekday:'long'})}.`);
    }finally{
      fixing=false;
    }
  }

  document.addEventListener('rumo:tasks',()=>setTimeout(guard,60));
  document.addEventListener('rumo:context',()=>setTimeout(guard,400));
})();
