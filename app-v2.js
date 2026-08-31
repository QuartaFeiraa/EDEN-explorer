(() => {
  const URL='https://zycpeiyztqysjqejtour.supabase.co';
  const KEY='sb_publishable_heHXvAxo36EvgHg_8_XOXQ_rRxE5t5H';
  if(!window.supabase) return;
  const db=window.supabase.createClient(URL,KEY);
  let currentUser=null;
  let currentGoal=null;
  let onboardingStep=1;
  let onboardingData={study_days:[1,2,3,4,5],level:'iniciante',weekly_hours:10};
  let lastCourseId=null;

  const qs=(s,r=document)=>r.querySelector(s);
  const qsa=(s,r=document)=>[...r.querySelectorAll(s)];
  const escapeHTML=(s='')=>String(s).replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[m]));

  function toast(msg){let el=qs('.rumo-toast');if(!el){el=document.createElement('div');el.className='rumo-toast';document.body.appendChild(el)}el.textContent=msg;el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),2600)}
  function initials(value='R'){return value.trim().split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase()||'R'}
  function formatDate(date){if(!date)return'A definir';return new Date(date+'T12:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'short',year:'numeric'})}
  function daysUntil(date){if(!date)return null;const now=new Date();now.setHours(0,0,0,0);const d=new Date(date+'T12:00:00');return Math.ceil((d-now)/86400000)}

  function injectUI(){
    const top=qs('.top-actions');
    if(top&&!qs('#account-btn')){
      const btn=document.createElement('button');btn.id='account-btn';btn.className='account-btn';btn.innerHTML='<span class="account-dot"></span><span id="account-label">Entrar</span>';top.insertBefore(btn,qs('.user'));
    }
    const strip=qs('.objective-strip');
    if(strip&&!qs('#personalize-btn')){
      const btn=document.createElement('button');btn.id='personalize-btn';btn.className='personalize-btn';btn.textContent='Personalizar meu RUMO';strip.appendChild(btn);
    }
    if(!qs('#auth-v2')) document.body.insertAdjacentHTML('beforeend',authMarkup()+onboardingMarkup()+accountMarkup());
    bindInjected();
    updateTodayDate();
  }

  function authMarkup(){return `<div id="auth-v2" class="modal"><div class="modal-card auth-shell"><button class="close" data-close="auth-v2">×</button><div class="auth-brand"><div class="auth-brand-mark">R</div><div><strong>RUMO</strong><span>Seu progresso, em qualquer dispositivo.</span></div></div><h2>Entre no seu RUMO</h2><p>Crie uma conta grátis para salvar objetivo, rotina e evolução.</p><div class="auth-tabs"><button class="auth-tab active" data-auth-mode="login">Entrar</button><button class="auth-tab" data-auth-mode="signup">Criar conta</button></div><form id="auth-form" class="form-grid"><div class="field signup-only" hidden><label>Seu nome</label><input id="auth-name" autocomplete="name" placeholder="Como quer ser chamado?"></div><div class="field"><label>E-mail</label><input id="auth-email" type="email" autocomplete="email" required placeholder="voce@email.com"></div><div class="field"><label>Senha</label><input id="auth-password" type="password" autocomplete="current-password" required minlength="6" placeholder="Mínimo de 6 caracteres"></div><div id="auth-message" class="form-message"></div><button class="primary auth-submit" type="submit">Entrar</button></form><p class="note">Durante o beta, sua conta e seus dados ficam no Supabase. Você também pode continuar testando sem conta.</p></div></div>`}

  function onboardingMarkup(){return `<div id="onboarding-v2" class="modal"><div class="modal-card onboarding-shell"><button class="close" data-close="onboarding-v2">×</button><div class="eyebrow">CONFIGURAÇÃO INICIAL</div><h2>Monte seu RUMO em menos de 1 minuto.</h2><div class="onboarding-progress"><i class="active"></i><i></i><i></i></div><div class="onboarding-step active" data-step="1"><h3>Qual é o seu objetivo?</h3><p>Você pode escolher um concurso do radar ou escrever seu objetivo manualmente.</p><div class="form-grid"><div class="field"><label>Concurso / objetivo</label><input id="goal-objective" list="goal-options" placeholder="Ex.: Polícia Federal — Agente"><datalist id="goal-options"></datalist></div><div class="field"><label>Cargo ou foco</label><input id="goal-role" placeholder="Ex.: Agente, Analista, ENEM..."></div><div class="field"><label>Data da prova</label><input id="goal-date" type="date"></div></div></div><div class="onboarding-step" data-step="2"><h3>Quanto tempo cabe na sua vida?</h3><p>O plano deve respeitar sua rotina, não competir com ela.</p><div class="form-grid two"><div class="field"><label>Horas por semana</label><input id="goal-hours" type="number" min="1" max="80" step="0.5" value="10"></div><div class="field"><label>Seu nível atual</label><select id="goal-level"><option value="iniciante">Estou começando</option><option value="intermediario">Já tenho uma base</option><option value="avancado">Já estudo há bastante tempo</option></select></div></div><div class="field" style="margin-top:16px"><label>Dias disponíveis</label><div class="days-grid">${[['D',0],['S',1],['T',2],['Q',3],['Q',4],['S',5],['S',6]].map(([d,n])=>`<button type="button" class="day-chip ${[1,2,3,4,5].includes(n)?'selected':''}" data-day="${n}">${d}</button>`).join('')}</div></div></div><div class="onboarding-step" data-step="3"><h3>Pronto. O resto é com o RUMO.</h3><p>Vamos usar seu objetivo e tempo disponível para substituir os números de demonstração por uma preparação que é realmente sua.</p><div class="choice-grid"><button type="button" class="choice selected" data-plan-style="equilibrado"><b>Equilibrado</b><span>Conteúdo, questões e revisão.</span></button><button type="button" class="choice" data-plan-style="questoes"><b>Mais questões</b><span>Para quem já possui base.</span></button><button type="button" class="choice" data-plan-style="base"><b>Construir base</b><span>Mais tempo para teoria.</span></button></div></div><div class="onboarding-actions"><button type="button" class="soft-btn" id="onboarding-back">Voltar</button><div class="right"><button type="button" class="soft-btn" data-close="onboarding-v2">Agora não</button><button type="button" class="primary" id="onboarding-next">Continuar</button></div></div></div></div>`}

  function accountMarkup(){return `<div id="account-v2" class="modal"><div class="modal-card account-shell"><button class="close" data-close="account-v2">×</button><div class="eyebrow">MINHA CONTA</div><h2>Seu espaço no RUMO</h2><div class="account-summary"><div class="account-avatar" id="account-avatar">R</div><div><b id="account-name">Usuário</b><span id="account-email"></span></div></div><div class="account-actions"><button id="account-config">⚙ Ajustar meu objetivo e rotina</button><button id="account-sync">↻ Atualizar meus dados</button><button id="account-logout" class="danger">Sair da conta</button></div></div></div>`}

  function bindInjected(){
    qsa('[data-close]').forEach(b=>b.onclick=()=>qs('#'+b.dataset.close)?.classList.remove('open'));
    qsa('#auth-v2,#onboarding-v2,#account-v2').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('open')}));
    qs('#account-btn').onclick=()=>currentUser?openAccount():qs('#auth-v2').classList.add('open');
    qs('.user').onclick=()=>currentUser&&openAccount();
    qs('#personalize-btn').onclick=()=>openOnboarding();
    const routineBtn=qs('#meu .setup-card:nth-child(3) .secondary');if(routineBtn)routineBtn.onclick=openOnboarding;
    qsa('[data-auth-mode]').forEach(b=>b.onclick=()=>setAuthMode(b.dataset.authMode));
    qs('#auth-form').onsubmit=handleAuth;
    qsa('.day-chip').forEach(b=>b.onclick=()=>{b.classList.toggle('selected');onboardingData.study_days=qsa('.day-chip.selected').map(x=>+x.dataset.day)});
    qsa('[data-plan-style]').forEach(b=>b.onclick=()=>{qsa('[data-plan-style]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');onboardingData.plan_style=b.dataset.planStyle});
    qs('#onboarding-back').onclick=()=>goOnboarding(Math.max(1,onboardingStep-1));
    qs('#onboarding-next').onclick=nextOnboarding;
    qs('#account-config').onclick=()=>{qs('#account-v2').classList.remove('open');openOnboarding(currentGoal)};
    qs('#account-sync').onclick=async()=>{await loadUserData();toast('Dados atualizados')};
    qs('#account-logout').onclick=async()=>{await db.auth.signOut();qs('#account-v2').classList.remove('open');toast('Você saiu da conta')};
    document.addEventListener('click',trackStudyCompletion,true);
    document.addEventListener('click',e=>{const c=e.target.closest('[data-course]');if(c)lastCourseId=c.dataset.course;if(e.target.id==='start-course'&&currentUser&&lastCourseId)setTimeout(()=>syncCourseProgress(lastCourseId),50)},true);
  }

  function setAuthMode(mode){
    qsa('[data-auth-mode]').forEach(x=>x.classList.toggle('active',x.dataset.authMode===mode));
    qsa('.signup-only').forEach(x=>x.hidden=mode!=='signup');
    qs('#auth-form').dataset.mode=mode;qs('#auth-form .auth-submit').textContent=mode==='signup'?'Criar conta grátis':'Entrar';qs('#auth-password').autocomplete=mode==='signup'?'new-password':'current-password';qs('#auth-message').textContent='';
  }

  async function handleAuth(e){
    e.preventDefault();const form=e.currentTarget;const mode=form.dataset.mode||'login';const email=qs('#auth-email').value.trim();const password=qs('#auth-password').value;const name=qs('#auth-name').value.trim();const msg=qs('#auth-message');msg.className='form-message';msg.textContent='Aguarde...';
    try{
      let result;if(mode==='signup') result=await db.auth.signUp({email,password,options:{data:{display_name:name||email.split('@')[0]}}});else result=await db.auth.signInWithPassword({email,password});
      if(result.error) throw result.error;
      if(mode==='signup'&&!result.data.session){msg.className='form-message success';msg.textContent='Conta criada. Confira seu e-mail para confirmar o cadastro.';return}
      msg.className='form-message success';msg.textContent='Pronto! Entrando no seu RUMO...';setTimeout(()=>qs('#auth-v2').classList.remove('open'),350);
    }catch(err){msg.className='form-message error';msg.textContent=translateAuthError(err.message)}
  }
  function translateAuthError(m=''){if(/invalid login/i.test(m))return'E-mail ou senha incorretos.';if(/already registered/i.test(m))return'Esse e-mail já possui conta.';if(/password/i.test(m)&&/6/i.test(m))return'A senha precisa ter pelo menos 6 caracteres.';return m||'Não foi possível entrar agora.'}

  function openAccount(){const email=currentUser?.email||'';const name=currentUser?.user_metadata?.display_name||email.split('@')[0]||'Usuário';qs('#account-name').textContent=name;qs('#account-email').textContent=email;qs('#account-avatar').textContent=initials(name);qs('#account-v2').classList.add('open')}

  async function openOnboarding(goal=null){
    onboardingStep=1;onboardingData={study_days:goal?.study_days||[1,2,3,4,5],level:goal?.level||'iniciante',weekly_hours:goal?.weekly_hours||10};
    qs('#goal-objective').value=goal?.objective_name||'';qs('#goal-role').value=goal?.cargo||'';qs('#goal-date').value=goal?.prova_data||'';qs('#goal-hours').value=goal?.weekly_hours||10;qs('#goal-level').value=goal?.level||'iniciante';qsa('.day-chip').forEach(x=>x.classList.toggle('selected',onboardingData.study_days.includes(+x.dataset.day)));goOnboarding(1);qs('#onboarding-v2').classList.add('open');await populateGoalOptions();
  }
  function goOnboarding(step){onboardingStep=step;qsa('.onboarding-step').forEach(x=>x.classList.toggle('active',+x.dataset.step===step));qsa('.onboarding-progress i').forEach((x,i)=>x.classList.toggle('active',i<step));qs('#onboarding-back').style.visibility=step===1?'hidden':'visible';qs('#onboarding-next').textContent=step===3?'Criar meu RUMO':'Continuar'}
  async function nextOnboarding(){
    if(onboardingStep===1){const objective=qs('#goal-objective').value.trim();if(!objective){toast('Digite seu concurso ou objetivo');return}onboardingData.objective_name=objective;onboardingData.cargo=qs('#goal-role').value.trim();onboardingData.prova_data=qs('#goal-date').value||null;goOnboarding(2);return}
    if(onboardingStep===2){onboardingData.weekly_hours=Math.max(1,Math.min(80,+qs('#goal-hours').value||10));onboardingData.level=qs('#goal-level').value;onboardingData.study_days=qsa('.day-chip.selected').map(x=>+x.dataset.day);if(!onboardingData.study_days.length){toast('Escolha pelo menos um dia para estudar');return}goOnboarding(3);return}
    await saveGoal(onboardingData);
  }

  async function populateGoalOptions(){
    try{const {data}=await db.from('concursos').select('nome,orgao').order('destaque',{ascending:false}).limit(30);if(data)qs('#goal-options').innerHTML=data.map(x=>`<option value="${escapeHTML(x.nome)}">${escapeHTML(x.orgao)}</option>`).join('')}catch(_){ }
  }

  async function saveGoal(data){
    if(currentUser){
      try{
        await db.from('user_goals').update({active:false}).eq('user_id',currentUser.id).eq('active',true);
        const {data:rows,error}=await db.from('user_goals').insert({user_id:currentUser.id,objective_name:data.objective_name,cargo:data.cargo||null,prova_data:data.prova_data||null,weekly_hours:data.weekly_hours,study_days:data.study_days,level:data.level,active:true}).select().single();if(error)throw error;currentGoal=rows;
      }catch(err){toast('Não consegui salvar no servidor. Tente novamente.');return}
    }else{
      currentGoal={...data,id:'guest',active:true};localStorage.setItem('rumo-guest-goal',JSON.stringify(currentGoal));
    }
    qs('#onboarding-v2').classList.remove('open');applyGoal(currentGoal);await loadStats();toast('Seu RUMO foi criado ✦');
  }

  function applyGoal(goal){
    if(!goal)return;const strip=qs('.objective-strip');strip?.classList.add('personalized');const divs=qsa('.objective-strip>div');if(divs[0])divs[0].querySelector('b').textContent=goal.objective_name||'Meu objetivo';if(divs[1]){const b=divs[1].querySelector('b');const left=daysUntil(goal.prova_data);b.textContent=left===null?'A definir':left<0?'Prova realizada':left===0?'É hoje!':`${left} dias`;b.title=formatDate(goal.prova_data)}if(divs[2]){divs[2].querySelector('small').textContent='RITMO PLANEJADO';divs[2].querySelector('b').textContent=`${Number(goal.weekly_hours||10).toLocaleString('pt-BR')}h/sem`}
    const p=qs('.hero-home p');if(p)p.textContent=`Seu objetivo é ${goal.objective_name}. Hoje o RUMO prioriza o próximo passo possível dentro da sua rotina.`;
    const btn=qs('#personalize-btn');if(btn)btn.textContent='Ajustar plano';
    updateGoalDays(goal);
  }
  function updateGoalDays(goal){const existing=qs('.goal-days');if(existing)existing.remove();const target=qs('.objective-strip>div:first-child');if(!target)return;const labels=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];const line=document.createElement('span');line.className='goal-days';line.textContent='Estuda: '+(goal.study_days||[]).map(x=>labels[x]).join(' · ');target.appendChild(line)}

  async function loadUserData(){
    if(!currentUser){const guest=JSON.parse(localStorage.getItem('rumo-guest-goal')||'null');currentGoal=guest;if(guest)applyGoal(guest);return}
    const {data:goal}=await db.from('user_goals').select('*').eq('user_id',currentUser.id).eq('active',true).order('created_at',{ascending:false}).limit(1).maybeSingle();currentGoal=goal||null;if(goal)applyGoal(goal);else setTimeout(()=>openOnboarding(),450);await loadStats();
  }

  async function loadStats(){
    if(!currentUser){return}
    const start=new Date();start.setDate(start.getDate()-6);start.setHours(0,0,0,0);
    const {data:sessions}=await db.from('study_sessions').select('*').eq('user_id',currentUser.id).gte('studied_at',start.toISOString()).order('studied_at',{ascending:true});
    const list=sessions||[];const total=list.reduce((a,s)=>a+s.minutes,0);const q=list.reduce((a,s)=>a+(s.questions||0),0);const correct=list.reduce((a,s)=>a+(s.correct_answers||0),0);const days=new Set(list.map(s=>new Date(s.studied_at).toDateString())).size;
    const stats=qsa('.activity-card .mini-stats>div');if(stats[0])stats[0].querySelector('b').textContent=formatMinutes(total);if(stats[1])stats[1].querySelector('b').textContent=days?formatMinutes(Math.round(total/days)):'0h';if(stats[2])stats[2].querySelector('b').textContent=String(days);
    const weekGoal=(Number(currentGoal?.weekly_hours)||10)*60;const hours=qs('.week-card .hours');if(hours)hours.innerHTML=`${formatMinutes(total)} <span>/ ${Number(currentGoal?.weekly_hours||10).toLocaleString('pt-BR')}h</span>`;const goalBar=qs('.week-card .goal-bar i');if(goalBar)goalBar.style.width=Math.min(100,Math.round(total/weekGoal*100))+'%';
    const donut=qs('.performance-card .donut b');if(donut)donut.textContent=q?Math.round(correct/q*100)+'%':'—';const perfMetrics=qsa('.performance-card .metric b');if(perfMetrics[0])perfMetrics[0].textContent=String(q);if(perfMetrics[1])perfMetrics[1].textContent=list.length?`${list.length} sessões`:'Comece hoje';
    renderRealChart(list);markRealData();
  }
  function formatMinutes(m){if(!m)return'0h';const h=Math.floor(m/60),min=m%60;return h?`${h}h${min?String(min).padStart(2,'0'):''}`:`${min}min`}
  function renderRealChart(list){const map=new Map();for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);map.set(d.toDateString(),0)}list.forEach(s=>{const k=new Date(s.studied_at).toDateString();if(map.has(k))map.set(k,map.get(k)+s.minutes)});const max=Math.max(...map.values(),30);qsa('.activity-chart .bar-day').forEach((el,i)=>{const val=[...map.values()][i]||0;el.querySelector('i').style.setProperty('--h',Math.max(10,Math.round(val/max*100))+'%');el.title=`${val} min`})}
  function markRealData(){const head=qs('.activity-card small');if(head&&!qs('.real-data-pill',head.parentElement)){const s=document.createElement('span');s.className='real-data-pill';s.textContent='SEUS DADOS';head.parentElement.appendChild(s)}}

  async function trackStudyCompletion(e){
    const btn=e.target.closest('[data-study]');if(!btn||!currentUser)return;setTimeout(async()=>{if(!btn.classList.contains('done'))return;const key=`${new Date().toISOString().slice(0,10)}-${btn.dataset.study}`;const saved=JSON.parse(localStorage.getItem('rumo-saved-sessions')||'[]');if(saved.includes(key))return;const subject=btn.querySelector('b')?.textContent||'Estudo';const topic=btn.querySelector('span')?.textContent||'';const minutes=parseInt(btn.querySelector('.time')?.textContent)||20;const {error}=await db.from('study_sessions').insert({user_id:currentUser.id,goal_id:currentGoal?.id==='guest'?null:currentGoal?.id||null,subject,topic,minutes});if(!error){saved.push(key);localStorage.setItem('rumo-saved-sessions',JSON.stringify(saved.slice(-100)));await loadStats();toast(`${subject} salvo no seu progresso`)}} ,120)
  }
  async function syncCourseProgress(id){if(!currentUser)return;await db.from('course_progress').upsert({user_id:currentUser.id,course_id:id,progress:8,updated_at:new Date().toISOString()},{onConflict:'user_id,course_id'})}

  function updateTodayDate(){const e=qs('.hero-home .eyebrow');if(!e)return;const now=new Date();const str=now.toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'}).toUpperCase();const dot=e.querySelector('.pulse-dot');e.textContent='';if(dot)e.appendChild(dot);else{const d=document.createElement('span');d.className='pulse-dot';e.appendChild(d)}e.append(' '+str)}

  function updateAccountUI(user){currentUser=user||null;const btn=qs('#account-btn');const avatar=qs('.user');if(!btn||!avatar)return;if(user){const name=user.user_metadata?.display_name||user.email?.split('@')[0]||'Usuário';qs('#account-label').textContent=name.split(' ')[0];avatar.textContent=initials(name);avatar.classList.add('is-live');avatar.classList.remove('is-hidden')}else{qs('#account-label').textContent='Entrar';avatar.textContent='R';avatar.classList.remove('is-live');avatar.classList.add('is-hidden')}}

  injectUI();setAuthMode('login');
  db.auth.getSession().then(({data})=>{updateAccountUI(data.session?.user||null);if(data.session?.user)loadUserData();else loadUserData()});
  db.auth.onAuthStateChange((_event,session)=>{updateAccountUI(session?.user||null);if(session?.user){loadUserData();if(qs('#auth-v2').classList.contains('open'))qs('#auth-v2').classList.remove('open')}else{currentGoal=JSON.parse(localStorage.getItem('rumo-guest-goal')||'null');if(currentGoal)applyGoal(currentGoal)}});
})();
