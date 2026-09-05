(() => {
  'use strict';

  const DAY_MS=86400000;

  function isoDay(value){
    if(!value)return null;
    const d=new Date(value);
    if(Number.isNaN(d.getTime()))return null;
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  function daysBetween(from,to){
    if(!from||!to)return null;
    const a=new Date(`${from}T12:00:00`),b=new Date(`${to}T12:00:00`);
    if(Number.isNaN(a.getTime())||Number.isNaN(b.getTime()))return null;
    return Math.round((b-a)/DAY_MS);
  }

  function errorRate(topic){
    const correct=Math.max(0,Number(topic?.acertos)||0);
    const errors=Math.max(0,Number(topic?.erros)||0);
    const total=correct+errors;
    return total?errors/total:0;
  }

  function baseScore(topic,date,materia){
    const weight=Math.max(.25,Math.min(3,Number(materia?.peso)||1));
    let score=weight*100+errorRate(topic)*60;
    const status=String(topic?.status||'nao_iniciado');
    if(status==='nao_iniciado')score+=24;
    if(topic?.proxima_revisao&&String(topic.proxima_revisao).slice(0,10)<=date)score+=72;
    return score;
  }

  function recencyPenalty(topic,date){
    const last=isoDay(topic?.ultima_revisao);
    const delta=daysBetween(last,date);
    if(delta===null||delta<0)return 0;
    if(delta===0)return 54;
    if(delta===1)return 40;
    if(delta===2)return 24;
    if(delta<=4)return 10;
    return 0;
  }

  function modeScore(topic,date,mode){
    const attempts=(Number(topic?.acertos)||0)+(Number(topic?.erros)||0);
    const due=Boolean(topic?.proxima_revisao&&String(topic.proxima_revisao).slice(0,10)<=date);
    const status=String(topic?.status||'nao_iniciado');
    let score=0;
    if(mode==='estudo')score+=status==='nao_iniciado'?34:0;
    if(mode==='questoes')score+=attempts>0||status!=='nao_iniciado'?28:-18;
    if(mode==='revisao')score+=due?80:-20;
    if(!due&&mode!=='revisao')score-=recencyPenalty(topic,date);
    return score;
  }

  function candidatePool(topics,date,mode,usedTopicIds){
    let list=(topics||[]).filter(t=>t?.id&&!usedTopicIds.has(t.id));
    if(mode==='revisao'){
      const due=list.filter(t=>t.proxima_revisao&&String(t.proxima_revisao).slice(0,10)<=date);
      if(due.length)list=due;
    }else if(mode==='questoes'){
      const practiced=list.filter(t=>t.status!=='nao_iniciado'||(Number(t.acertos)||0)+(Number(t.erros)||0)>0);
      if(practiced.length)list=practiced;
    }else if(mode==='estudo'){
      const fresh=list.filter(t=>String(t.status||'nao_iniciado')==='nao_iniciado');
      if(fresh.length)list=fresh;
    }
    return list;
  }

  function chooseTopic({topics,date,mode,usedTopicIds=new Set(),usedMateriaIds=new Set(),plannedCounts=new Map(),materiaById=()=>null}){
    const list=candidatePool(topics,date,mode,usedTopicIds);
    if(!list.length)return null;
    return [...list].sort((a,b)=>{
      const score=t=>baseScore(t,date,materiaById(t.materia_id))
        +modeScore(t,date,mode)
        -(plannedCounts.get(t.id)||0)*55
        -(usedMateriaIds.has(t.materia_id)?16:0);
      const diff=score(b)-score(a);
      if(Math.abs(diff)>.0001)return diff;
      return String(a.nome||a.id).localeCompare(String(b.nome||b.id),'pt-BR');
    })[0]||null;
  }

  function seedPlannedCounts(tasks=[]){
    const counts=new Map();
    for(const task of tasks){
      if(!task?.topico_id)continue;
      counts.set(task.topico_id,(counts.get(task.topico_id)||0)+1);
    }
    return counts;
  }

  window.RUMO_PLANNER={chooseTopic,seedPlannedCounts,baseScore,errorRate};
})();
