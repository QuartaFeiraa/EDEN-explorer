const SUPABASE_URL='https://zycpeiyztqysjqejtour.supabase.co';
const SUPABASE_KEY='sb_publishable_heHXvAxo36EvgHg_8_XOXQ_rRxE5t5H';

const fallback=[
{id:1,nome:'SEFAZ DF 2026',orgao:'Secretaria de Economia do DF',area:'Fiscal',status:'banca_definida',banca:'Cebraspe',vagas:'265',remuneracao:'R$ 19 mil a R$ 26 mil',uf:'DF'},
{id:2,nome:'PC RJ Delegado 2026',orgao:'Polícia Civil do Rio de Janeiro',area:'Segurança',status:'edital_iminente',banca:'Cesgranrio',vagas:'85',remuneracao:'Até R$ 26 mil',uf:'RJ'},
{id:3,nome:'TRT 8 2026',orgao:'Tribunal Regional do Trabalho da 8ª Região',area:'Tribunais',status:'banca_definida',banca:'FCC',vagas:'A definir',remuneracao:'R$ 9 mil a R$ 16 mil',uf:'PA/AP'}
];

const study=[
['Direito Administrativo','Atos administrativos',40],
['Português','Interpretação de texto',35],
['Informática','Redes e TCP/IP',30],
['Revisão inteligente','12 erros recentes',30]
];

const courses=[
{id:'informatica',title:'Informática Essencial',icon:'⌨',category:'trabalho',days:7,min:20,color:'#4f70ff',desc:'Computador, arquivos, internet, e-mail, nuvem e rotina digital sem complicação.',modules:['Seu computador sem mistério','Arquivos e pastas','Internet e navegadores','E-mail e nuvem','Atalhos que economizam tempo','Segurança básica','Desafio final']},
{id:'excel',title:'Excel Essencial',icon:'▦',category:'trabalho',days:7,min:22,color:'#21b37f',desc:'Planilhas, fórmulas, filtros, tabelas e gráficos para situações reais de trabalho.',modules:['Primeira planilha','Organização e formatação','SOMA, MÉDIA e porcentagem','SE e funções úteis','Filtros e tabelas','Gráficos claros','Projeto prático']},
{id:'word',title:'Word Essencial',icon:'W',category:'trabalho',days:5,min:18,color:'#3c79e6',desc:'Documentos profissionais, currículo, formatação, tabelas e exportação para PDF.',modules:['Interface e atalhos','Formatação profissional','Currículo e documentos','Tabelas e imagens','PDF e projeto final']},
{id:'ia',title:'IA para Estudo e Trabalho',icon:'✦',category:'trabalho',days:7,min:18,color:'#7b59ff',desc:'Use IA para pesquisar, aprender, escrever, organizar e revisar sem depender dela cegamente.',modules:['O que a IA faz bem','Perguntas melhores','Pesquisa e verificação','Estudo com IA','Textos e e-mails','Organização e produtividade','Uso responsável']},
{id:'portugues',title:'Português para Provas',icon:'A',category:'provas',days:10,min:25,color:'#f26b8c',desc:'Interpretação, gramática e pontos que mais derrubam candidatos em provas.',modules:['Interpretação de texto','Classes de palavras','Concordância','Regência','Crase','Pontuação','Reescrita','Coesão','Questões comentadas','Revisão final']},
{id:'logica',title:'Raciocínio Lógico',icon:'∴',category:'provas',days:10,min:25,color:'#f3a637',desc:'Proposições, porcentagem, sequências e lógica com uma abordagem visual e gradual.',modules:['Fundamentos','Proposições','Conectivos','Equivalências','Porcentagem','Razão e proporção','Sequências','Problemas','Questões','Revisão']},
{id:'matematica',title:'Matemática Fundamental',icon:'∑',category:'provas',days:12,min:25,color:'#f0bf3e',desc:'A base que sustenta concursos e vestibulares, reconstruída sem pular etapas.',modules:['Operações','Frações','Decimais','Porcentagem','Razão','Regra de três','Equações','Geometria básica','Estatística básica','Problemas','Questões','Revisão']},
{id:'redacao',title:'Redação',icon:'✎',category:'provas',days:10,min:25,color:'#e55f78',desc:'Estrutura, argumentação, repertório e revisão para escrever com mais segurança.',modules:['Estrutura da redação','Tese','Parágrafos','Argumentação','Repertório','Coesão','Conclusão','Erros comuns','Prática guiada','Redação final']},
{id:'ingles',title:'Inglês Essencial',icon:'EN',category:'idiomas',days:14,min:20,color:'#17a8d7',desc:'Leitura e comunicação básica com foco em situações úteis e compreensão real.',modules:['Começando do zero','Frases úteis','Rotina','Trabalho e estudo','Leitura básica','Perguntas','Vocabulário essencial','Tempos básicos','Compreensão','Situações reais','Revisão 1','Prática','Revisão 2','Desafio final']},
{id:'espanhol',title:'Espanhol Essencial',icon:'ES',category:'idiomas',days:14,min:20,color:'#ec6a4d',desc:'Compreensão e comunicação básica para estudo, trabalho e provas.',modules:['Primeiros contatos','Frases úteis','Vocabulário','Rotina','Leitura','Perguntas','Falsos cognatos','Verbos básicos','Compreensão','Situações reais','Revisão 1','Prática','Revisão 2','Desafio final']},
{id:'seguranca',title:'Segurança Digital',icon:'⌾',category:'trabalho',days:5,min:15,color:'#4b91d8',desc:'Golpes, phishing, senhas, autenticação e hábitos digitais que todo mundo deveria conhecer.',modules:['Golpes mais comuns','Senhas fortes','Autenticação em duas etapas','Phishing e links','Checklist de segurança']},
{id:'comunicacao',title:'Comunicação Profissional',icon:'◌',category:'trabalho',days:5,min:18,color:'#8b65d9',desc:'E-mails, mensagens, clareza, postura e escrita para ambientes profissionais.',modules:['Clareza e objetivo','E-mails profissionais','Mensagens e atendimento','Comunicação em equipe','Desafio final']}
];

let contests=[...fallback];
let done=new Set(JSON.parse(localStorage.getItem('rumo-study-done')||'[]'));
let courseState=JSON.parse(localStorage.getItem('rumo-course-state')||'{}');
let contestStatus='all';
let contestQuery='';

function statusLabel(s){return ({edital_iminente:'Edital iminente',banca_definida:'Banca definida',previsto:'Previsto'})[s]||'Previsto'}
function contestHTML(c){return `<article class="contest"><div class="contest-top"><span class="status ${c.status||''}">${statusLabel(c.status)}</span><span class="meta-state">${c.uf||'BR'}</span></div><h3>${c.nome}</h3><p>${c.orgao}</p><div class="meta"><span>${c.banca||'Banca a definir'}</span><span>${c.vagas||'A definir'} vagas</span></div><b class="salary">${c.remuneracao||'Remuneração a definir'}</b></article>`}
function getFilteredContests(){return contests.filter(c=>{const hay=`${c.nome} ${c.orgao} ${c.area||''} ${c.uf||''}`.toLowerCase();return hay.includes(contestQuery)&&(contestStatus==='all'||c.status===contestStatus)})}
function renderContests(){const list=getFilteredContests();document.querySelector('#featured').innerHTML=contests.slice(0,4).map(contestHTML).join('');document.querySelector('#all-contests').innerHTML=list.map(contestHTML).join('')||'<div class="note">Nenhum concurso encontrado com esses filtros.</div>'}

function renderStudy(){const box=document.querySelector('#study-list');box.innerHTML=study.map((s,i)=>`<button class="study ${done.has(i)?'done':''}" data-study="${i}"><div class="num">${done.has(i)?'✓':i+1}</div><div><b>${s[0]}</b><span>${s[1]}</span></div><div class="time">${s[2]} min</div></button>`).join('');document.querySelector('.progress').textContent=Math.round(done.size/study.length*100)+'%';document.querySelectorAll('[data-study]').forEach(b=>b.onclick=()=>{const i=+b.dataset.study;done.has(i)?done.delete(i):done.add(i);localStorage.setItem('rumo-study-done',JSON.stringify([...done]));renderStudy()})}

function switchTab(id){document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.id===id));document.querySelectorAll('.nav').forEach(n=>n.classList.toggle('active',n.dataset.tab===id));document.querySelector('.sidebar').classList.remove('open');window.scrollTo({top:0,behavior:'smooth'})}
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>switchTab(b.dataset.tab));
document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>switchTab(b.dataset.go));
document.querySelector('#menu').onclick=()=>document.querySelector('.sidebar').classList.toggle('open');

function setTheme(theme){document.documentElement.dataset.theme=theme;localStorage.setItem('rumo-theme',theme);document.querySelector('#theme-icon').textContent=theme==='dark'?'☀':'☾';document.querySelector('meta[name="theme-color"]').setAttribute('content',theme==='dark'?'#161a1b':'#f4f6fb')}
const savedTheme=localStorage.getItem('rumo-theme')||'dark';setTheme(savedTheme);
document.querySelector('#theme-toggle').onclick=()=>setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');

const aiModal=document.querySelector('#modal');
document.querySelector('#open-ai').onclick=()=>aiModal.classList.add('open');
document.querySelector('#close-ai').onclick=()=>aiModal.classList.remove('open');
aiModal.onclick=e=>{if(e.target===aiModal)aiModal.classList.remove('open')};

const upgradeModal=document.querySelector('#upgrade-modal');
document.querySelector('#upgrade-btn').onclick=()=>upgradeModal.classList.add('open');
document.querySelector('#close-upgrade').onclick=()=>upgradeModal.classList.remove('open');
upgradeModal.onclick=e=>{if(e.target===upgradeModal)upgradeModal.classList.remove('open')};
document.querySelectorAll('.price-card').forEach(card=>card.onclick=()=>{document.querySelectorAll('.price-card').forEach(x=>x.classList.remove('selected'));card.classList.add('selected')});

function courseHTML(c){const progress=courseState[c.id]?.progress||0;return `<article class="course" data-course="${c.id}" style="--course-accent:${c.color}"><div class="course-top"><div class="course-icon">${c.icon}</div><span class="course-tag">GRÁTIS</span></div><h3>${c.title}</h3><p>${c.desc}</p><div class="course-info"><span>${c.days} dias</span><span>${c.min} min/dia</span></div>${progress?`<div class="course-progress"><div class="line"><i style="width:${progress}%"></i></div><small>${progress}% concluído</small></div>`:''}</article>`}
function renderCourses(category='all'){const list=category==='all'?courses:courses.filter(c=>c.category===category);document.querySelector('#course-grid').innerHTML=list.map(courseHTML).join('');document.querySelectorAll('[data-course]').forEach(card=>card.onclick=()=>openCourse(card.dataset.course))}

const courseModal=document.querySelector('#course-modal');
function openCourse(id){const c=courses.find(x=>x.id===id);if(!c)return;const progress=courseState[id]?.progress||0;document.querySelector('#course-modal-content').innerHTML=`<div class="course-modal-icon" style="color:${c.color};background:color-mix(in srgb,${c.color} 13%,var(--surface))">${c.icon}</div><h2>${c.title}</h2><p>${c.desc}</p><div class="module-list">${c.modules.slice(0,7).map((m,i)=>`<div class="module"><span class="module-num">${String(i+1).padStart(2,'0')}</span><div><b>${m}</b><span>${i===0?'15–25 min · aula + prática':'Etapa da trilha'}</span></div></div>`).join('')}</div><button class="primary full" id="start-course">${progress?'Continuar curso':'Começar trilha grátis'}</button><p class="note">Nesta v1, o botão salva seu início e libera a estrutura da trilha. As aulas e recomendações entram na próxima etapa.</p>`;courseModal.classList.add('open');document.querySelector('#start-course').onclick=()=>{courseState[id]={progress:Math.max(progress,8),started:true};localStorage.setItem('rumo-course-state',JSON.stringify(courseState));courseModal.classList.remove('open');renderCourses(document.querySelector('.course-filter.active')?.dataset.courseFilter||'all')}}
document.querySelector('#close-course').onclick=()=>courseModal.classList.remove('open');
courseModal.onclick=e=>{if(e.target===courseModal)courseModal.classList.remove('open')};
document.querySelectorAll('.course-filter').forEach(b=>b.onclick=()=>{document.querySelectorAll('.course-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderCourses(b.dataset.courseFilter)});

const search=document.querySelector('#search');
search.addEventListener('input',e=>{contestQuery=e.target.value.toLowerCase();renderContests()});
document.querySelector('#contest-filter').addEventListener('change',e=>{contestStatus=e.target.value;renderContests()});

document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.querySelectorAll('.modal.open').forEach(m=>m.classList.remove('open'));document.querySelector('.sidebar').classList.remove('open')}});

renderStudy();renderContests();renderCourses();
fetch(`${SUPABASE_URL}/rest/v1/concursos?select=*&order=destaque.desc,atualizado_em.desc&limit=50`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}}).then(r=>r.ok?r.json():Promise.reject()).then(d=>{if(Array.isArray(d)&&d.length){contests=d;renderContests()}}).catch(()=>{});

// Load the account/onboarding layer without introducing a build step.
(() => {
  const css=document.createElement('link');css.rel='stylesheet';css.href='./v2.css?v=2';document.head.appendChild(css);
  const sdk=document.createElement('script');sdk.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';sdk.onload=()=>{const app=document.createElement('script');app.src='./app-v2.js?v=2';document.body.appendChild(app)};document.body.appendChild(sdk);
})();
