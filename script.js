const SUPABASE_URL='https://zycpeiyztqysjqejtour.supabase.co';
const SUPABASE_KEY='sb_publishable_heHXvAxo36EvgHg_8_XOXQ_rRxE5t5H';
const SUPABASE_JS_VERSION='2.112.4';

window.RUMO_SDK_READY=window.supabase?Promise.resolve(window.supabase):new Promise((resolve,reject)=>{
  const s=document.createElement('script');
  s.src=`https://cdn.jsdelivr.net/npm/@supabase/supabase-js@${SUPABASE_JS_VERSION}`;
  s.async=true;
  s.crossOrigin='anonymous';
  s.onload=()=>resolve(window.supabase);
  s.onerror=()=>reject(new Error('Falha ao carregar o SDK do Supabase'));
  document.head.appendChild(s);
});

const fallback=[
{id:1,nome:'SEFAZ DF 2026',orgao:'Secretaria de Economia do DF',area:'Fiscal',status:'banca_definida',banca:'Cebraspe',vagas:'265',remuneracao:'R$ 19 mil a R$ 26 mil',uf:'DF'},
{id:2,nome:'PC RJ Delegado 2026',orgao:'Polícia Civil do Rio de Janeiro',area:'Segurança',status:'edital_iminente',banca:'A definir',vagas:'85',remuneracao:'Até R$ 26 mil',uf:'RJ'},
{id:3,nome:'TRT 8 2026',orgao:'Tribunal Regional do Trabalho da 8ª Região',area:'Tribunais',status:'banca_definida',banca:'A definir',vagas:'A definir',remuneracao:'A definir',uf:'PA/AP'}
];
const study=[['Direito Administrativo','Atos administrativos',40],['Português','Interpretação de texto',35],['Informática','Redes e TCP/IP',30],['Revisão inteligente','12 erros recentes',30]];
const courses=[
{id:'informatica',title:'Informática Essencial',icon:'⌨',category:'trabalho',days:7,min:20,color:'#4f70ff',desc:'Computador, arquivos, internet, e-mail, nuvem e rotina digital sem complicação.'},
{id:'excel',title:'Excel Essencial',icon:'▦',category:'trabalho',days:7,min:22,color:'#21b37f',desc:'Planilhas, fórmulas, filtros, tabelas e gráficos para situações reais de trabalho.'},
{id:'word',title:'Word Essencial',icon:'W',category:'trabalho',days:5,min:18,color:'#3c79e6',desc:'Documentos profissionais, currículo, formatação, tabelas e exportação para PDF.'},
{id:'ia',title:'IA para Estudo e Trabalho',icon:'✦',category:'trabalho',days:7,min:18,color:'#7b59ff',desc:'Use IA para pesquisar, aprender, escrever, organizar e revisar com senso crítico.'},
{id:'portugues',title:'Português para Provas',icon:'A',category:'provas',days:10,min:25,color:'#f26b8c',desc:'Interpretação, gramática e pontos que mais derrubam candidatos em provas.'},
{id:'logica',title:'Raciocínio Lógico',icon:'∴',category:'provas',days:10,min:25,color:'#f3a637',desc:'Proposições, porcentagem, sequências e lógica com abordagem gradual.'},
{id:'matematica',title:'Matemática Fundamental',icon:'∑',category:'provas',days:12,min:25,color:'#f0bf3e',desc:'A base que sustenta concursos e vestibulares, reconstruída sem pular etapas.'},
{id:'redacao',title:'Redação',icon:'✎',category:'provas',days:10,min:25,color:'#e55f78',desc:'Estrutura, argumentação, repertório e revisão para escrever com mais segurança.'},
{id:'ingles',title:'Inglês Essencial',icon:'EN',category:'idiomas',days:14,min:20,color:'#17a8d7',desc:'Leitura e comunicação básica com foco em situações úteis.'},
{id:'espanhol',title:'Espanhol Essencial',icon:'ES',category:'idiomas',days:14,min:20,color:'#ec6a4d',desc:'Compreensão e comunicação básica para estudo, trabalho e provas.'},
{id:'seguranca',title:'Segurança Digital',icon:'⌾',category:'trabalho',days:5,min:15,color:'#4b91d8',desc:'Golpes, phishing, senhas, autenticação e hábitos digitais importantes.'},
{id:'comunicacao',title:'Comunicação Profissional',icon:'◌',category:'trabalho',days:5,min:18,color:'#8b65d9',desc:'E-mails, mensagens, clareza, postura e escrita para ambientes profissionais.'}
];
const ALLOWED_CONTEST_STATUS=new Set(['edital_iminente','banca_definida','previsto','edital_publicado','inscricoes_abertas','prova_marcada','encerrado']);
const escapeHTML=value=>String(value??'').replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
const safeJSON=(raw,fallbackValue)=>{try{return JSON.parse(raw)}catch{return fallbackValue}};
let contests=[...fallback],contestStatus='all',contestQuery='';
let courseState=safeJSON(localStorage.getItem('rumo-course-state')||'{}',{});

function statusLabel(s){return ({edital_iminente:'Edital iminente',banca_definida:'Banca definida',previsto:'Previsto',edital_publicado:'Edital publicado',inscricoes_abertas:'Inscrições abertas',prova_marcada:'Prova marcada',encerrado:'Encerrado'})[s]||'Em acompanhamento'}
function contestHTML(c){
  const status=ALLOWED_CONTEST_STATUS.has(c?.status)?c.status:'';
  const uf=escapeHTML(c?.uf||'BR');
  const nome=escapeHTML(c?.nome||'Concurso');
  const orgao=escapeHTML(c?.orgao||'Órgão a definir');
  const banca=escapeHTML(c?.banca||'Banca a definir');
  const vagas=escapeHTML(c?.vagas||'A definir');
  const remuneracao=escapeHTML(c?.remuneracao||'Remuneração a definir');
  return `<article class="contest"><div class="contest-top"><span class="status ${status}">${escapeHTML(statusLabel(status))}</span><span class="meta-state">${uf}</span></div><h3>${nome}</h3><p>${orgao}</p><div class="meta"><span>${banca}</span><span>${vagas} vagas</span></div><b class="salary">${remuneracao}</b></article>`;
}
function filtered(){return contests.filter(c=>`${c.nome} ${c.orgao} ${c.area||''} ${c.uf||''}`.toLowerCase().includes(contestQuery)&&(contestStatus==='all'||c.status===contestStatus))}
function renderContests(){
  document.querySelector('#featured').innerHTML=contests.slice(0,4).map(contestHTML).join('');
  document.querySelector('#all-contests').innerHTML=filtered().map(contestHTML).join('')||'<div class="note">Nenhum concurso encontrado com esses filtros.</div>';
  document.dispatchEvent(new CustomEvent('rumo:contest-render'));
}
function renderStudy(){const box=document.querySelector('#study-list');box.innerHTML=study.map((s,i)=>`<div class="study"><div class="num">${i+1}</div><div><b>${s[0]}</b><span>${s[1]}</span></div><div class="time">${s[2]} min</div></div>`).join('')}
function courseHTML(c){const p=courseState[c.id]?.progress||0;return `<article class="course" data-course="${c.id}" style="--course-accent:${c.color}"><div class="course-top"><div class="course-icon">${c.icon}</div><span class="course-tag">GRÁTIS</span></div><h3>${c.title}</h3><p>${c.desc}</p><div class="course-info"><span>${c.days} dias</span><span>${c.min} min/dia</span></div>${p?`<div class="course-progress"><div class="line"><i style="width:${p}%"></i></div><small>${p}% concluído</small></div>`:''}</article>`}
function renderCourses(category='all'){
  const list=category==='all'?courses:courses.filter(c=>c.category===category);
  document.querySelector('#course-grid').innerHTML=list.map(courseHTML).join('');
  document.dispatchEvent(new CustomEvent('rumo:courses-render'));
}
function switchTab(id){document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.id===id));document.querySelectorAll('.nav').forEach(n=>n.classList.toggle('active',n.dataset.tab===id));document.querySelector('.sidebar').classList.remove('open');window.scrollTo({top:0,behavior:'auto'});document.dispatchEvent(new CustomEvent('rumo:tab',{detail:{id}}))}

document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>switchTab(b.dataset.tab));
document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>switchTab(b.dataset.go));
document.querySelector('#menu').onclick=()=>document.querySelector('.sidebar').classList.toggle('open');
function setTheme(theme){document.documentElement.dataset.theme=theme;localStorage.setItem('rumo-theme',theme);document.querySelector('#theme-icon').textContent=theme==='dark'?'☀':'☾';document.querySelector('meta[name="theme-color"]').setAttribute('content',theme==='dark'?'#161a1b':'#f4f6fb')}
setTheme(localStorage.getItem('rumo-theme')||'dark');document.querySelector('#theme-toggle').onclick=()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');
const aiModal=document.querySelector('#modal');document.querySelector('#open-ai').onclick=()=>aiModal.classList.add('open');document.querySelector('#close-ai').onclick=()=>aiModal.classList.remove('open');aiModal.onclick=e=>{if(e.target===aiModal)aiModal.classList.remove('open')};
const upgradeModal=document.querySelector('#upgrade-modal');document.querySelector('#upgrade-btn').onclick=()=>upgradeModal.classList.add('open');document.querySelector('#close-upgrade').onclick=()=>upgradeModal.classList.remove('open');upgradeModal.onclick=e=>{if(e.target===upgradeModal)upgradeModal.classList.remove('open')};document.querySelectorAll('.price-card').forEach(card=>card.onclick=()=>{document.querySelectorAll('.price-card').forEach(x=>x.classList.remove('selected'));card.classList.add('selected')});
document.querySelectorAll('.course-filter').forEach(b=>b.onclick=()=>{document.querySelectorAll('.course-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderCourses(b.dataset.courseFilter)});
document.querySelector('#search').addEventListener('input',e=>{contestQuery=e.target.value.toLowerCase();renderContests()});document.querySelector('#contest-filter').addEventListener('change',e=>{contestStatus=e.target.value;renderContests()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.querySelectorAll('.modal.open').forEach(m=>m.classList.remove('open'));document.querySelector('.sidebar').classList.remove('open')}});

renderStudy();renderContests();renderCourses();

window.RUMO_CONTESTS_READY=fetch(`${SUPABASE_URL}/rest/v1/concursos?select=*&order=destaque.desc,atualizado_em.desc&limit=80`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}})
  .then(r=>r.ok?r.json():Promise.reject(new Error('radar')))
  .then(data=>{if(Array.isArray(data)&&data.length)contests=data;window.RUMO_CONTESTS=contests;renderContests();document.dispatchEvent(new CustomEvent('rumo:contests',{detail:{contests}}));return contests})
  .catch(()=>{window.RUMO_CONTESTS=contests;return contests});

window.RUMO_SHELL={switchTab,renderContests,renderCourses,get contests(){return contests}};