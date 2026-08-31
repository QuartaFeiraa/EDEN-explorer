(() => {
  'use strict';
  const URL='https://zycpeiyztqysjqejtour.supabase.co';
  const KEY='sb_publishable_heHXvAxo36EvgHg_8_XOXQ_rRxE5t5H';
  if(!window.supabase) return;
  const sb=window.supabase.createClient(URL,KEY);
  const state={user:null,goal:null,contest:null,userConcurso:null,materias:[],topicos:[],tasks:[],ready:false};
  const qs=(s,r=document)=>r.querySelector(s), qsa=(s,r=document)=>[...r.querySelectorAll(s)];
  const escapeHTML=(s='')=>String(s).replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[m]));
  const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
  const addDays=(iso,n)=>{const d=new Date(`${iso}T12:00:00`);d.setDate(d.getDate()+n);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
  const formatMinutes=m=>{m=Math.max(0,Math.round(Number(m)||0));const h=Math.floor(m/60),min=m%60;return h?`${h}h${min?String(min).padStart(2,'0'):''}`:`${min}min`};
  const daysUntil=iso=>{if(!iso)return null;const d=new Date(`${iso}T12:00:00`);const n=new Date();n.setHours(0,0,0,0);return Math.ceil((d-n)/86400000)};
  function toast(msg){let el=qs('.rumo-toast');if(!el){el=document.createElement('div');el.className='rumo-toast';document.body.appendChild(el)}el.textContent=msg;el.classList.add('show');clearTimeout(el._timer);el._timer=setTimeout(()=>el.classList.remove('show'),2700)}
  function emit(name,detail={}){document.dispatchEvent(new CustomEvent(`rumo:${name}`,{detail}))}

  const templates={
    fiscal:[
      ['Português',1.15,['Interpretação de texto','Classes de palavras','Concordância e regência','Crase e pontuação','Reescrita e coesão']],
      ['Raciocínio Lógico',1.05,['Proposições e conectivos','Equivalências','Porcentagem e razão','Probabilidade e análise combinatória','Problemas lógicos']],
      ['Direito Constitucional',1.1,['Direitos e garantias fundamentais','Administração Pública','Organização do Estado','Poderes da República','Controle de constitucionalidade']],
      ['Direito Administrativo',1.1,['Princípios administrativos','Atos administrativos','Poderes administrativos','Agentes públicos','Licitações e contratos']],
      ['Direito Tributário',1.35,['Sistema Tributário Nacional','Competência tributária','Obrigação tributária','Crédito tributário','Impostos']],
      ['Contabilidade',1.5,['Patrimônio e contas','Escrituração','Demonstrações contábeis','Análise das demonstrações','Contabilidade avançada']],
      ['Tecnologia da Informação',.85,['Segurança da informação','Redes','Banco de dados','Planilhas','Conceitos de dados e IA']]
    ],
    seguranca:[
      ['Português',1.2,['Interpretação de texto','Gramática aplicada','Concordância e regência','Crase','Reescrita']],
      ['Raciocínio Lógico',.9,['Proposições','Equivalências','Porcentagem','Probabilidade','Problemas']],
      ['Informática',.85,['Sistemas operacionais','Internet e navegadores','Redes','Segurança da informação','Pacote Office']],
      ['Direito Constitucional',1.15,['Direitos fundamentais','Segurança pública','Administração Pública','Organização do Estado','Poderes']],
      ['Direito Administrativo',1.05,['Princípios','Atos administrativos','Poderes administrativos','Agentes públicos','Responsabilidade do Estado']],
      ['Direito Penal',1.35,['Aplicação da lei penal','Teoria do crime','Crimes contra a pessoa','Crimes contra o patrimônio','Crimes contra a Administração']],
      ['Processo Penal',1.25,['Inquérito policial','Ação penal','Provas','Prisões e medidas cautelares','Procedimentos']],
      ['Legislação Especial',1.25,['Leis penais especiais','Direitos humanos','Legislação institucional','Abuso de autoridade','Temas do edital']]
    ],
    tribunais:[
      ['Português',1.35,['Interpretação de texto','Reescrita','Concordância e regência','Crase','Pontuação']],
      ['Raciocínio Lógico',.85,['Proposições','Porcentagem','Probabilidade','Sequências','Problemas']],
      ['Informática',.75,['Sistemas operacionais','Office','Internet','Segurança','Ferramentas colaborativas']],
      ['Direito Constitucional',1.2,['Direitos fundamentais','Organização do Estado','Poder Judiciário','Administração Pública','Controle constitucional']],
      ['Direito Administrativo',1.2,['Princípios','Atos','Poderes','Agentes públicos','Licitações']],
      ['Legislação',1.15,['Regimento interno','Normas institucionais','Ética no serviço público','Acessibilidade','Proteção de dados']]
    ],
    administrativa:[
      ['Português',1.3,['Interpretação','Gramática aplicada','Concordância e regência','Crase e pontuação','Redação oficial']],
      ['Raciocínio Lógico',1.0,['Proposições','Porcentagem','Razão e proporção','Estatística básica','Problemas']],
      ['Informática',1.05,['Windows e arquivos','Office','Internet','Segurança da informação','Nuvem e colaboração']],
      ['Direito Administrativo',1.15,['Princípios','Atos administrativos','Poderes','Agentes públicos','Licitações']],
      ['Direito Constitucional',.95,['Direitos fundamentais','Administração Pública','Organização do Estado','Poderes','Controle']],
      ['Administração Pública',1.05,['Gestão pública','Processos','Atendimento','Arquivologia','Ética']]
    ],
    educacao:[
      ['Português',1.1,['Interpretação','Gramática aplicada','Coesão e coerência','Reescrita','Redação']],
      ['Legislação Educacional',1.35,['LDB','PNE','Diretrizes curriculares','Inclusão e diversidade','Legislação local']],
      ['Conhecimentos Pedagógicos',1.45,['Didática','Avaliação','Currículo','Planejamento','Teorias da aprendizagem']],
      ['Informática',.7,['Ferramentas digitais','Office','Internet','Segurança','Tecnologia educacional']],
      ['Conhecimentos Específicos',1.5,['Fundamentos da área','Conteúdo programático','Metodologia','Aplicações','Questões da banca']]
    ],
    saude:[
      ['Português',.85,['Interpretação','Gramática','Coesão','Pontuação','Reescrita']],
      ['SUS e Saúde Pública',1.35,['Princípios do SUS','Leis 8.080 e 8.142','Políticas públicas','Vigilância em saúde','Humanização']],
      ['Informática',.6,['Office','Internet','Segurança','Sistemas','Dados']],
      ['Ética e Legislação',1.0,['Ética profissional','Legislação da profissão','Segurança do paciente','Direitos do usuário','Normas locais']],
      ['Conhecimentos Específicos',1.6,['Fundamentos técnicos','Protocolos','Procedimentos','Casos práticos','Questões da banca']]
    ],
    vestibular:[
      ['Linguagens',1.2,['Interpretação de texto','Gramática e linguagem','Literatura','Artes e comunicação','Inglês ou Espanhol']],
      ['Matemática',1.4,['Aritmética e porcentagem','Álgebra','Geometria','Funções','Probabilidade e estatística']],
      ['Redação',1.45,['Estrutura dissertativa','Tese','Argumentação','Repertório','Coesão e proposta']],
      ['Ciências Humanas',1.05,['História','Geografia','Filosofia','Sociologia','Atualidades']],
      ['Ciências da Natureza',1.25,['Biologia','Química','Física','Interdisciplinaridade','Questões contextualizadas']]
    ],
    geral:[
      ['Português',1.3,['Interpretação de texto','Gramática aplicada','Concordância e regência','Crase e pontuação','Reescrita']],
      ['Raciocínio Lógico',1.0,['Proposições','Porcentagem','Razão e proporção','Probabilidade','Problemas']],
      ['Informática',.95,['Sistemas operacionais','Office','Internet','Redes','Segurança da informação']],
      ['Direito Administrativo',1.05,['Princípios','Atos administrativos','Poderes','Agentes públicos','Licitações']],
      ['Direito Constitucional',1.0,['Direitos fundamentais','Administração Pública','Organização do Estado','Poderes','Controle']]
    ]
  };

  function templateKey(goal,contest){const t=`${goal?.objective_name||''} ${goal?.cargo||''} ${contest?.area||''}`.toLowerCase();if(/enem|vestibular|fuvest|unesp|unicamp/.test(t))return'vestibular';if(/sefaz|fiscal|auditor|receita|tribut/.test(t))return'fiscal';if(/polícia|policia|segurança|seguranca|\bpf\b|\bprf\b|delegado|perícia|pericia/.test(t))return'seguranca';if(/tribunal|trt|trf|\btj\b|\btre\b|tse|judici/.test(t))return'tribunais';if(/educa|professor|seduc|pedagog/.test(t))return'educacao';if(/saúde|saude|enferm|médic|medic|ses[a-z]?\b|cofen/.test(t))return'saude';if(/administra|prefeitura|transpetro|inb|detran/.test(t))return'administrativa';return'geral'}

  async function getUser(){const {data}=await sb.auth.getSession();state.user=data.session?.user||null;return state.user}
  async function loadGoal(){if(!state.user){try{state.goal=JSON.parse(localStorage.getItem('rumo-guest-goal')||'null')}catch(_){state.goal=null}return state.goal}const {data}=await sb.from('user_goals').select('*').eq('user_id',state.user.id).eq('active',true).order('created_at',{ascending:false}).limit(1).maybeSingle();state.goal=data||null;return state.goal}
  async function attachContest(){state.contest=null;if(!state.goal)return null;if(state.goal.concurso_id){const {data}=await sb.from('concursos').select('*').eq('id',state.goal.concurso_id).maybeSingle();state.contest=data||null;return state.contest}const {data}=await sb.from('concursos').select('*').ilike('nome',state.goal.objective_name).limit(1);if(data?.[0]){state.contest=data[0];if(state.user){await sb.from('user_goals').update({concurso_id:data[0].id}).eq('id',state.goal.id);state.goal.concurso_id=data[0].id}return state.contest}return null}
  async function ensureUserConcurso(){if(!state.user||!state.goal)return null;let {data}=await sb.from('user_concursos').select('*').eq('user_id',state.user.id).eq('principal',true).order('criado_em',{ascending:false}).limit(1).maybeSingle();if(data){const patch={cargo:state.goal.cargo||data.cargo,prova_data:state.goal.prova_data||data.prova_data};if(state.goal.concurso_id!==undefined)patch.concurso_id=state.goal.concurso_id||null;await sb.from('user_concursos').update(patch).eq('id',data.id);state.userConcurso={...data,...patch};return state.userConcurso}const ins={user_id:state.user.id,concurso_id:state.goal.concurso_id||null,cargo:state.goal.cargo||null,prova_data:state.goal.prova_data||null,principal:true};const res=await sb.from('user_concursos').insert(ins).select().single();state.userConcurso=res.data||null;return state.userConcurso}
  async function loadStructure(){if(!state.userConcurso){state.materias=[];state.topicos=[];return}let {data:mats}=await sb.from('materias').select('*').eq('user_concurso_id',state.userConcurso.id).order('peso',{ascending:false});if(!mats?.length){const tpl=templates[templateKey(state.goal,state.contest)];const rows=tpl.map(([nome,peso])=>({user_concurso_id:state.userConcurso.id,nome,peso,prioridade:peso>=1.3?'alta':peso>=1.05?'media':'baixa'}));const created=await sb.from('materias').insert(rows).select();mats=created.data||[];for(const mat of mats){const def=tpl.find(x=>x[0]===mat.nome);const topics=(def?.[2]||[]).map(nome=>({materia_id:mat.id,nome}));if(topics.length)await sb.from('topicos').insert(topics)}}state.materias=mats||[];if(state.materias.length){const ids=state.materias.map(x=>x.id);const {data:tops}=await sb.from('topicos').select('*').in('materia_id',ids).order('criado_em');state.topicos=tops||[]}else state.topicos=[]}
  async function refreshStructure(){if(!state.userConcurso)return;const {data:mats}=await sb.from('materias').select('*').eq('user_concurso_id',state.userConcurso.id).order('peso',{ascending:false});state.materias=mats||[];if(state.materias.length){const {data:tops}=await sb.from('topicos').select('*').in('materia_id',state.materias.map(x=>x.id)).order('criado_em');state.topicos=tops||[]}else state.topicos=[];emit('structure',{state})}

  async function sync(){await getUser();await loadGoal();await attachContest();if(state.user&&state.goal){await ensureUserConcurso();await loadStructure()}state.ready=true;emit('context',{state});return state}

  const RUMO=window.RUMO={sb,state,qs,qsa,escapeHTML,today,addDays,formatMinutes,daysUntil,toast,emit,templates,templateKey,sync,refreshStructure};
  sb.auth.onAuthStateChange(()=>setTimeout(sync,60));
  window.addEventListener('focus',()=>{if(state.user)sync()});
  setTimeout(sync,1250);
})();