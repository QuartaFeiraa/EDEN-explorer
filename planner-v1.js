(() => {
  const URL='https://zycpeiyztqysjqejtour.supabase.co';
  const KEY='sb_publishable_heHXvAxo36EvgHg_8_XOXQ_rRxE5t5H';
  const sb=window.supabase?.createClient(URL,KEY);
  const qs=(s,r=document)=>r.querySelector(s);
  const qsa=(s,r=document)=>[...r.querySelectorAll(s)];
  let lastSignature='';

  async function getGoal(){
    try{
      if(sb){const {data:{session}}=await sb.auth.getSession();if(session?.user){const {data}=await sb.from('user_goals').select('*').eq('user_id',session.user.id).eq('active',true).order('created_at',{ascending:false}).limit(1).maybeSingle();if(data)return data}}
    }catch(_){ }
    try{return JSON.parse(localStorage.getItem('rumo-guest-goal')||'null')}catch(_){return null}
  }

  function subjectsFor(goal){
    const text=`${goal.objective_name||''} ${goal.cargo||''}`.toLowerCase();
    if(/enem|vestibular|fuvest|unesp|unicamp/.test(text)) return [
      ['Português','Interpretação e linguagem'],['Matemática','Fundamentos + problemas'],['Redação','Argumentação e estrutura'],['Revisão inteligente','Pontos fracos da semana']
    ];
    if(/sefaz|fiscal|auditor|receita/.test(text)) return [
      ['Contabilidade','Base + questões'],['Direito Tributário','Conceitos essenciais'],['Português','Interpretação de texto'],['Raciocínio Lógico','Questões graduais']
    ];
    if(/polícia|policia|pf\b|prf|pc\b|segurança|seguranca/.test(text)) return [
      ['Português','Interpretação e gramática'],['Direito Constitucional','Direitos e garantias'],['Direito Administrativo','Atos e princípios'],['Raciocínio Lógico','Questões + revisão']
    ];
    if(/trt|trf|tribunal|tj\b|tre\b|tse\b/.test(text)) return [
      ['Português','Interpretação e reescrita'],['Direito Administrativo','Princípios e atos'],['Direito Constitucional','Organização e direitos'],['Raciocínio Lógico','Questões de base']
    ];
    return [['Português','Interpretação de texto'],['Raciocínio Lógico','Fundamentos + questões'],['Informática','Conceitos essenciais'],['Direito Administrativo','Princípios e atos']];
  }

  function planFor(goal){
    const days=Math.max(1,(goal.study_days||[1,2,3,4,5]).length);
    const daily=Math.max(45,Math.min(210,Math.round((Number(goal.weekly_hours)||10)*60/days)));
    const weights=goal.level==='avancado'?[.2,.3,.3,.2]:goal.level==='intermediario'?[.25,.28,.27,.2]:[.3,.28,.24,.18];
    const subjects=subjectsFor(goal);
    let used=0;
    return subjects.map((s,i)=>{let min=i===subjects.length-1?daily-used:Math.max(15,Math.round(daily*weights[i]/5)*5);used+=min;return [...s,min]});
  }

  function keyFor(goal){return `rumo-plan-${goal.id||goal.objective_name}-${new Date().toISOString().slice(0,10)}`}
  function renderPlan(goal){
    const box=qs('#study-list');if(!box)return;
    const plan=planFor(goal);const done=new Set(JSON.parse(localStorage.getItem(keyFor(goal))||'[]'));
    box.innerHTML=plan.map((s,i)=>`<button class="study ${done.has(i)?'done':''}" data-study="p${i}"><div class="num">${done.has(i)?'✓':i+1}</div><div><b>${s[0]}</b><span>${s[1]}</span></div><div class="time">${s[2]} min</div></button>`).join('');
    const total=plan.reduce((a,x)=>a+x[2],0);const title=qs('.focus-card h2');if(title)title.textContent=`${Math.floor(total/60)?Math.floor(total/60)+'h':''}${total%60?String(total%60).padStart(2,'0'):''} de estudo hoje`;
    const progress=qs('.focus-card .progress');if(progress)progress.textContent=Math.round(done.size/plan.length*100)+'%';
    qsa('#study-list .study').forEach((b,i)=>b.onclick=()=>{done.has(i)?done.delete(i):done.add(i);localStorage.setItem(keyFor(goal),JSON.stringify([...done]));renderPlan(goal)});
  }

  function renderGoalPage(goal){
    const grid=qs('#meu .setup-grid');if(!grid)return;const left=goal.prova_data?Math.ceil((new Date(goal.prova_data+'T12:00:00')-new Date().setHours(0,0,0,0))/86400000):null;const labels=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
    grid.innerHTML=`<article class="goal-panel main-goal"><span>OBJETIVO ATUAL</span><h3>${escapeHTML(goal.objective_name||'Meu objetivo')}</h3><p>${goal.cargo?escapeHTML(goal.cargo):'Foco definido pelo seu plano'}</p><div class="goal-kpis"><div><b>${left===null?'—':Math.max(0,left)}</b><span>dias até a prova</span></div><div><b>${Number(goal.weekly_hours||10).toLocaleString('pt-BR')}h</b><span>por semana</span></div><div><b>${(goal.study_days||[]).length}</b><span>dias de estudo</span></div></div></article><article class="goal-panel"><span>ROTINA</span><h3>${(goal.study_days||[]).map(x=>labels[x]).join(' · ')}</h3><p>O RUMO distribui sua carga entre esses dias e recalcula quando você perde uma sessão.</p><button class="secondary goal-adjust">Ajustar rotina</button></article><article class="goal-panel"><span>FASE ATUAL</span><h3>${goal.level==='avancado'?'Aprimoramento':goal.level==='intermediario'?'Consolidação':'Construção de base'}</h3><p>${goal.level==='avancado'?'Mais questões, revisão e diagnóstico.':goal.level==='intermediario'?'Equilíbrio entre teoria, questões e revisão.':'Mais base antes de aumentar a carga de questões.'}</p><button class="secondary goal-adjust">Reconfigurar</button></article>`;
    qsa('.goal-adjust').forEach(b=>b.onclick=()=>qs('#personalize-btn')?.click());
  }
  function escapeHTML(s=''){return String(s).replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[m]))}

  async function sync(){const goal=await getGoal();if(!goal)return;const sig=JSON.stringify([goal.id,goal.objective_name,goal.weekly_hours,goal.study_days,goal.level,goal.prova_data]);if(sig===lastSignature)return;lastSignature=sig;renderPlan(goal);renderGoalPage(goal)}
  setTimeout(sync,900);
  const strip=qs('.objective-strip');if(strip)new MutationObserver(()=>setTimeout(sync,100)).observe(strip,{attributes:true,childList:true,subtree:true});
  window.addEventListener('focus',sync);
})();
