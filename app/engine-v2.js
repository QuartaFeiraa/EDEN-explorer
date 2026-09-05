(() => {
  'use strict';

  const R=()=>window.RUMO;
  const matBy=id=>R().state.materias.find(x=>x.id===id);
  const topBy=id=>R().state.topicos.find(x=>x.id===id);
  const dow=iso=>new Date(`${iso}T12:00:00`).getDay();
  let booting=null;
  let planning=null;
  let pendingForce=false;

  function dates(start,count,allowed){
    const out=[];let d=start,i=0;
    while(out.length<count&&i<40){
      if(allowed.includes(dow(d)))out.push(d);
      d=R().addDays(d,1);i++;
    }
    return out;
  }

  function allocation(total){
    if(total<=60){
      const a=Math.round(total*.58);
      return [['estudo',a],['questoes',total-a]];
    }
    if(total<=120){
      const a=Math.round(total*.44),b=Math.round(total*.34);
      return [['estudo',a],['questoes',b],['revisao',total-a-b]];
    }
    const a=Math.round(total*.4),b=Math.round(total*.35);
    return [['estudo',a],['questoes',b],['revisao',total-a-b]];
  }

  function studyDays(goal){
    const days=Array.isArray(goal?.study_days)?goal.study_days.map(Number).filter(x=>Number.isInteger(x)&&x>=0&&x<=6):[];
    return days.length?[...new Set(days)]:[1,2,3,4,5];
  }

  function dailyMinutes(goal,allowed){
    const weekly=Math.max(.5,Math.min(60,Number(goal?.weekly_hours)||10));
    return Math.max(30,Math.min(300,Math.round(weekly*60/Math.max(1,allowed.length))));
  }

  async function loadTasks(){
    const r=R(),s=r.state;
    if(!s.user){s.tasks=[];renderGuest();return}
    const {data,error}=await r.sb.from('plano_tarefas').select('*').eq('user_id',s.user.id).eq('data',r.today()).order('criado_em');
    if(error){console.warn('RUMO tasks unavailable',error.code||error.message);s.tasks=[];renderToday();return}
    s.tasks=data||[];
    renderToday();
    r.emit('tasks',{tasks:s.tasks});
  }

  async function carryOver(){
    const r=R(),s=r.state,today=r.today(),allowed=studyDays(s.goal);
    if(!allowed.includes(dow(today)))return;
    const [{data:old,error:oldError},{count,error:countError}]=await Promise.all([
      r.sb.from('plano_tarefas').select('*').eq('user_id',s.user.id).lt('data',today).eq('concluida',false).order('data').limit(3),
      r.sb.from('plano_tarefas').select('id',{count:'exact',head:true}).eq('user_id',s.user.id).eq('data',today).eq('concluida',false)
    ]);
    if(oldError||countError){console.warn('RUMO carry-over degraded',oldError?.code||countError?.code||'unknown');return}
    const free=Math.max(0,3-(count||0));
    const ids=(old||[]).slice(0,free).map(t=>t.id).filter(Boolean);
    if(!ids.length)return;
    const {error}=await r.sb.from('plano_tarefas').update({data:today}).eq('user_id',s.user.id).in('id',ids);
    if(error)console.warn('RUMO carry-over update failed',error.code||error.message);
  }

  async function buildPlan(force=false){
    const r=R(),s=r.state,planner=window.RUMO_PLANNER;
    if(!s.user||!s.goal||!s.userConcurso||!s.materias.length||!planner)return loadTasks();
    const start=r.today(),end=r.addDays(start,20),allowed=studyDays(s.goal),daily=dailyMinutes(s.goal,allowed);

    if(force){
      const {error}=await r.sb.from('plano_tarefas').delete().eq('user_id',s.user.id).gte('data',start).eq('concluida',false);
      if(error){console.warn('RUMO plan reset failed',error.code||error.message);r.toast('Não consegui recalcular o plano agora.');return loadTasks()}
    }

    const {data:existing,error:existingError}=await r.sb.from('plano_tarefas')
      .select('id,data,topico_id,tipo,concluida')
      .eq('user_id',s.user.id)
      .gte('data',start)
      .lte('data',end);
    if(existingError){console.warn('RUMO plan read failed',existingError.code||existingError.message);return loadTasks()}

    const existingRows=existing||[];
    const has=new Set(existingRows.map(x=>x.data));
    const plannedCounts=planner.seedPlannedCounts(existingRows.filter(x=>!x.concluida));
    const rows=[];

    for(const date of dates(start,12,allowed)){
      if(has.has(date))continue;
      const usedTopicIds=new Set(),usedMateriaIds=new Set();
      for(const [type,raw] of allocation(daily)){
        const topic=planner.chooseTopic({
          topics:s.topicos,
          date,
          mode:type,
          usedTopicIds,
          usedMateriaIds,
          plannedCounts,
          materiaById:matBy
        });
        if(!topic)continue;
        usedTopicIds.add(topic.id);
        usedMateriaIds.add(topic.materia_id);
        plannedCounts.set(topic.id,(plannedCounts.get(topic.id)||0)+1);
        const materia=matBy(topic.materia_id);
        rows.push({
          user_id:s.user.id,
          user_concurso_id:s.userConcurso.id,
          materia_id:materia?.id||null,
          topico_id:topic.id,
          titulo:`${materia?.nome||'Estudo'} — ${topic.nome}`,
          tipo:type,
          data:date,
          minutos:Math.max(15,Math.round(raw/5)*5)
        });
      }
    }

    if(rows.length){
      const {error}=await r.sb.from('plano_tarefas').upsert(rows,{onConflict:'user_id,data,topico_id,tipo',ignoreDuplicates:true});
      if(error){console.warn('RUMO plan write failed',error.code||error.message);r.toast('O plano não pôde ser atualizado agora.');return loadTasks()}
    }
    await carryOver();
    await loadTasks();
  }

  function ensurePlan(force=false){
    pendingForce=pendingForce||force;
    if(planning)return planning;
    planning=(async()=>{
      do{
        const runForce=pendingForce;
        pendingForce=false;
        await buildPlan(runForce);
      }while(pendingForce);
    })().finally(()=>{planning=null});
    return planning;
  }

  function renderGuest(){
    const r=R(),box=r.qs('#study-list'),g=r.state.goal;
    if(!box||!g)return;
    const tpl=r.templates[r.templateKey(g,null)].slice(0,3),mins=Math.max(45,Math.round((Number(g.weekly_hours)||8)*60/Math.max(1,studyDays(g).length)));
    box.innerHTML=tpl.map((x,i)=>`<div class="study rumo-task"><div class="num">${i+1}</div><div><b>${r.escapeHTML(x[0])}</b><span>${r.escapeHTML(x[2][0])}</span></div><div class="time">${Math.max(15,Math.round(mins/tpl.length/5)*5)} min</div></div>`).join('');
    const h=r.qs('.focus-card h2');if(h)h.textContent=`${r.formatMinutes(mins)} de estudo hoje`;
  }

  const typeLabel=t=>({estudo:'Aprender',questoes:'Praticar',revisao:'Revisar',simulado:'Simulado'})[t]||'Estudar';

  function renderToday(){
    const r=R(),s=r.state,box=r.qs('#study-list'),tasks=s.tasks||[];
    if(!box)return;
    const done=tasks.filter(t=>t.concluida).length,total=tasks.reduce((a,t)=>a+(Number(t.minutos)||0),0);
    box.innerHTML=tasks.length?tasks.map((t,i)=>{
      const m=matBy(t.materia_id),tp=topBy(t.topico_id);
      return `<button class="study rumo-task ${t.concluida?'done':''}" data-task-id="${t.id}"><div class="num">${t.concluida?'✓':i+1}</div><div class="task-copy"><b>${r.escapeHTML(m?.nome||'Estudo')}</b><span>${r.escapeHTML(tp?.nome||t.titulo)}</span><span class="task-type">${typeLabel(t.tipo)}</span></div><div class="task-open"><div class="time">${Math.max(0,Number(t.minutos)||0)} min</div><span class="task-arrow">›</span></div></button>`;
    }).join(''):'<div class="data-empty"><b>Nada pendente agora.</b>Seu plano está limpo para hoje.</div>';
    const h=r.qs('.focus-card h2'),p=r.qs('.focus-card .progress');
    if(h)h.textContent=`${r.formatMinutes(total)} de estudo hoje`;
    if(p)p.textContent=tasks.length?`${Math.round(done/tasks.length*100)}%`:'0%';
    r.qsa('[data-task-id]',box).forEach(b=>b.onclick=()=>{const t=tasks.find(x=>x.id===b.dataset.taskId);if(t)r.emit('open-session',{task:t})});
    ensureLog();
  }

  function ensureLog(){
    const r=R(),head=r.qs('.focus-card .card-heading');
    if(!head||r.qs('#log-study-v1'))return;
    const wrap=document.createElement('div');wrap.className='focus-actions-v1';
    const old=head.querySelector('.progress');if(old)wrap.appendChild(old);
    const b=document.createElement('button');b.id='log-study-v1';b.className='log-study-v1';b.textContent='+ Registrar estudo';b.onclick=()=>r.emit('open-manual-session',{});
    wrap.appendChild(b);head.appendChild(wrap);
  }

  async function analytics(){
    const r=R(),s=r.state;if(!s.user)return;
    const start=new Date();start.setDate(start.getDate()-6);start.setHours(0,0,0,0);
    const {data,error}=await r.sb.from('sessoes_estudo').select('minutos,questoes,acertos,estudado_em').eq('user_id',s.user.id).gte('estudado_em',start.toISOString()).order('estudado_em');
    if(error){console.warn('RUMO analytics unavailable',error.code||error.message);return}
    const list=data||[],days=[];
    for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);days.push({k:d.toDateString(),m:0})}
    for(const x of list){const d=days.find(y=>y.k===new Date(x.estudado_em).toDateString());if(d)d.m+=Number(x.minutos)||0}
    const max=Math.max(30,...days.map(x=>x.m));
    r.qsa('.activity-chart .bar-day').forEach((el,i)=>{el.querySelector('i')?.style.setProperty('--h',`${Math.max(8,Math.round(days[i].m/max*100))}%`);el.title=`${days[i].m} min`});
    const total=list.reduce((a,x)=>a+(Number(x.minutos)||0),0),active=days.filter(x=>x.m>0).length,q=list.reduce((a,x)=>a+(Number(x.questoes)||0),0),correct=list.reduce((a,x)=>a+(Number(x.acertos)||0),0),accuracy=q?Math.round(correct/q*100):0,mini=r.qsa('.activity-card .mini-stats>div');
    if(mini[0])mini[0].querySelector('b').textContent=r.formatMinutes(total);
    if(mini[1])mini[1].querySelector('b').textContent=active?r.formatMinutes(Math.round(total/active)):'0h';
    if(mini[2])mini[2].querySelector('b').textContent=active;
    const donut=r.qs('.performance-card .donut');if(donut){donut.style.background=`conic-gradient(var(--accent) 0 ${accuracy}%,var(--surface-3) ${accuracy}% 100%)`;donut.querySelector('b').textContent=q?`${accuracy}%`:'—'}
    const met=r.qsa('.performance-card .metric b');if(met[0])met[0].textContent=q;if(met[1])met[1].textContent=list.length?`${list.length} sessões`:'Sem dados ainda';
    const goalMin=(Number(s.goal?.weekly_hours)||10)*60,hours=r.qs('.week-card .hours');if(hours)hours.innerHTML=`${r.formatMinutes(total)} <span>/ ${Number(s.goal?.weekly_hours||10).toLocaleString('pt-BR')}h</span>`;
    const bar=r.qs('.week-card .goal-bar i');if(bar)bar.style.width=`${Math.min(100,Math.round(total/Math.max(1,goalMin)*100))}%`;
  }

  async function objective(){
    const r=R(),s=r.state;if(!s.goal)return;
    const divs=r.qsa('.objective-strip>div');
    if(divs[0])divs[0].querySelector('b').textContent=s.goal.objective_name;
    const left=r.daysUntil(s.goal.prova_data);
    if(divs[1])divs[1].querySelector('b').textContent=left===null?'A definir':left===0?'É hoje!':left>0?`${left} dias`:'Realizada';
    if(divs[2]){divs[2].querySelector('small').textContent='RITMO PLANEJADO';divs[2].querySelector('b').textContent=`${Number(s.goal.weekly_hours||10).toLocaleString('pt-BR')}h/sem`}
    const hero=r.qs('.hero-home p');if(hero)hero.textContent=`Seu foco é ${s.goal.objective_name}. O RUMO ajusta o próximo passo ao seu ritmo real.`;
  }

  async function goalPage(){
    const r=R(),s=r.state,grid=r.qs('#meu .setup-grid');if(!grid||!s.goal)return;
    let latest=null;
    if(s.user){
      const {data,error}=await r.sb.from('edital_imports').select('file_name,subjects_found,created_at').eq('user_id',s.user.id).order('created_at',{ascending:false}).limit(1).maybeSingle();
      if(!error)latest=data||null;
    }
    const left=r.daysUntil(s.goal.prova_data),safePriority=window.RUMO_SECURITY_NORMALIZE?.safePriority||(()=> 'media');
    grid.className='goal-dashboard';
    grid.innerHTML=`<article class="goal-main-card"><div class="eyebrow">OBJETIVO ATUAL</div><h2>${r.escapeHTML(s.goal.objective_name)}</h2><p>${s.goal.cargo?r.escapeHTML(s.goal.cargo):'Preparação personalizada'} · ${latest?`Edital importado · ${Math.max(0,Number(latest.subjects_found)||0)} matérias`:'Plano-base RUMO'}</p><div class="goal-kpis-v1"><div><b>${left===null?'—':Math.max(0,left)}</b><span>dias até a prova</span></div><div><b>${Number(s.goal.weekly_hours||10).toLocaleString('pt-BR')}h</b><span>por semana</span></div><div><b>${studyDays(s.goal).length}</b><span>dias de estudo</span></div></div><button class="secondary" id="goal-adjust-v1" style="margin-top:16px">Ajustar objetivo e rotina</button></article><article class="goal-side-card"><div class="eyebrow">EDITAL INTELIGENTE</div><h3>Transforme o PDF em plano.</h3><p>O arquivo é lido no seu navegador e convertido em matérias e tópicos.</p><label class="edital-drop"><input id="edital-file-v1" type="file" accept="application/pdf"><b>Selecionar edital em PDF</b><span>PDFs com texto selecionável funcionam melhor.</span></label><div class="edital-status" id="edital-status-v1">${latest?`Último: ${r.escapeHTML(latest.file_name)}`:'Nenhum edital importado ainda.'}</div><button class="secondary" id="regenerate-plan-v1" style="width:100%;margin-top:12px">Recalcular próximos dias</button></article><article class="subjects-card"><div class="eyebrow">MAPA DO CONTEÚDO</div><h3>Matérias e domínio</h3><div class="subjects-list">${s.materias.map(m=>{const ts=s.topicos.filter(t=>t.materia_id===m.id),pct=ts.length?Math.round(ts.filter(t=>t.status==='dominado').length/ts.length*100):Math.max(0,Math.min(100,Number(m.progresso)||0)),priority=safePriority(m.prioridade);return`<div class="subject-row"><div><b>${r.escapeHTML(m.nome)}</b><small>${ts.length} tópicos</small></div><div class="subject-bar"><i style="width:${pct}%"></i></div><b>${pct}%</b><span class="priority-pill ${priority}">${priority}</span></div>`}).join('')}</div></article>`;
    r.qs('#goal-adjust-v1')?.addEventListener('click',()=>r.qs('#personalize-btn')?.click());
    r.qs('#regenerate-plan-v1')?.addEventListener('click',async()=>{r.toast('Recalculando...');await ensurePlan(true);r.toast('Plano atualizado')});
    r.emit('goal-page',{latest});
  }

  async function boot(){
    if(booting)return booting;
    const r=R();if(!r?.state.ready)return;
    booting=Promise.all([ensurePlan(),analytics(),objective()]).finally(()=>{booting=null});
    return booting;
  }

  document.addEventListener('rumo:context',boot);
  document.addEventListener('rumo:structure',()=>{if(document.querySelector('#meu.page.active'))goalPage()});
  document.addEventListener('rumo:tab',e=>{if(e.detail?.id==='meu')goalPage()});
  document.addEventListener('rumo:session-saved',async()=>{await R().refreshStructure();await Promise.all([loadTasks(),analytics(),objective()]);if(document.querySelector('#meu.page.active'))goalPage()});
  document.addEventListener('rumo:plan-refresh',()=>ensurePlan(true));

  window.RUMO_ENGINE={ensurePlan,loadTasks,renderAnalytics:analytics,renderGoalPage:goalPage};
})();
