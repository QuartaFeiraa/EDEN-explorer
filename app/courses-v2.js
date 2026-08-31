(() => {
  'use strict';
  const R=()=>window.RUMO;
  const catalog={
    informatica:{title:'Informática Essencial',lessons:[
      ['Seu computador sem mistério','O sistema operacional organiza arquivos, programas, dispositivos e sua interação com a máquina. Para trabalhar bem, domine janelas, área de trabalho, pesquisa, configurações e atalhos básicos.','Abra o Explorador de Arquivos, crie uma pasta chamada RUMO, crie duas subpastas e mova um arquivo entre elas.'],
      ['Arquivos, pastas e formatos','A extensão ajuda a identificar o formato do arquivo. PDF, DOCX, XLSX, JPG e ZIP têm usos diferentes. Copiar cria outra versão; mover altera o local. A Lixeira não substitui backup.','Identifique a extensão de cinco arquivos no seu computador e explique o que cada formato costuma armazenar.'],
      ['Internet, navegador e pesquisa','Navegador é o programa usado para acessar páginas; mecanismo de busca é o serviço que encontra conteúdo. URL, domínio, HTTPS, abas, downloads e favoritos aparecem tanto no trabalho quanto em provas.','Faça uma busca usando aspas para uma expressão exata e outra usando site:gov.br. Compare os resultados.'],
      ['E-mail, nuvem e colaboração','E-mail profissional pede assunto claro, mensagem objetiva e cuidado com anexos. Nuvem permite armazenar e sincronizar arquivos, mas sincronização não é sinônimo de backup.','Escreva um e-mail de três linhas pedindo confirmação de recebimento de um documento.'],
      ['Segurança digital básica','Senhas únicas, autenticação em dois fatores, atualizações e desconfiança de links inesperados reduzem riscos. Phishing tenta induzir você a entregar informação ou executar uma ação.','Revise três contas importantes e confirme se usam senha única e autenticação em dois fatores.'],
      ['Atalhos que economizam tempo','Ctrl+C/V/X copiam, colam e recortam; Ctrl+Z desfaz; Ctrl+F busca; Alt+Tab alterna janelas; Win+Shift+S captura uma área da tela no Windows.','Durante 10 minutos, tente copiar, colar, buscar e alternar janelas sem usar o mouse.']
    ]},
    excel:{title:'Excel Essencial',lessons:[
      ['Planilha, célula e referência','Uma planilha organiza dados em linhas e colunas. Cada célula possui um endereço, como A1. Fórmulas começam com = e podem usar valores ou referências.','Crie uma tabela com Produto, Quantidade e Preço para cinco itens.'],
      ['SOMA, MÉDIA e porcentagem','=SOMA(A1:A5) agrega valores; =MÉDIA(A1:A5) calcula a média. Para calcular 15% de B2, use =B2*15%.','Calcule total, média de preços e um desconto de 10% para sua tabela.'],
      ['Função SE','SE testa uma condição: =SE(B2>=7;"Aprovado";"Revisar"). Pense em condição, resultado verdadeiro e resultado falso.','Crie uma coluna Status que mostre “Meta atingida” quando a quantidade for 10 ou mais.'],
      ['Filtros e tabelas','Filtros escondem temporariamente linhas que não atendem a um critério. Transformar uma base em Tabela facilita leitura, expansão e fórmulas.','Filtre sua tabela para mostrar apenas itens acima de determinado preço.'],
      ['Gráficos que comunicam','Barras funcionam bem para comparar categorias; linhas, para evolução no tempo; pizza só faz sentido para poucas partes de um total.','Crie um gráfico de barras com os preços dos itens e dê um título que explique a comparação.'],
      ['PROCX e busca de dados','PROCX procura um valor em uma coluna e retorna o correspondente de outra. A lógica é: o que procurar, onde procurar e o que devolver.','Faça uma tabela de códigos e preços e use PROCX para retornar o preço a partir do código.']
    ]},
    portugues:{title:'Português para Provas',lessons:[
      ['Interpretação antes da gramática','Leia o comando antes de julgar alternativas. Diferencie informação explícita, inferência permitida e opinião não sustentada pelo texto.','Pegue uma notícia curta e escreva em uma frase a tese principal e em outra uma inferência possível.'],
      ['Concordância','Na concordância verbal, o verbo se relaciona com o núcleo do sujeito. Expressões longas entre sujeito e verbo são usadas para provocar distração.','Encontre o núcleo do sujeito em cinco frases antes de escolher a forma verbal.'],
      ['Regência','Regência trata da relação entre um termo e seus complementos, inclusive a preposição exigida. Verbos como assistir, preferir, obedecer e visar aparecem muito em provas.','Monte uma frase correta com “assistir” no sentido de ver e outra com “obedecer”.'],
      ['Crase','Crase geralmente surge quando a preposição a encontra o artigo feminino a. O teste do masculino ajuda: “vou ao local” sugere “vou à escola”.','Explique por que há ou não há crase em “entreguei o documento à diretora” e “comecei a estudar”.'],
      ['Pontuação e sentido','Vírgula não representa simplesmente uma pausa da fala. Ela organiza estruturas sintáticas e pode mudar relações de sentido.','Reescreva três frases retirando vírgulas desnecessárias e explique a mudança.'],
      ['Reescrita e coesão','Em reescrita, a banca testa correção e preservação de sentido. Observe pronomes, conectivos, tempos verbais e relações de causa, oposição ou conclusão.','Substitua um conectivo de conclusão por outro equivalente em um parágrafo curto.']
    ]},
    logica:{title:'Raciocínio Lógico',lessons:[
      ['Proposições','Proposição é uma sentença declarativa que pode ser verdadeira ou falsa. Perguntas, ordens e frases abertas não são proposições no sentido clássico usado em provas.','Classifique cinco frases do cotidiano em proposição ou não proposição.'],
      ['Conectivos','Na conjunção “p e q”, as duas precisam ser verdadeiras. Na disjunção “p ou q”, basta pelo menos uma. A condicional só é falsa quando p é verdadeira e q é falsa.','Construa uma tabela-verdade simples para p e q usando “e” e “ou”.'],
      ['Negação','A negação de “todos” vira “existe pelo menos um que não”; a de “existe” vira “nenhum”. Em conectivos, as leis de De Morgan ajudam a trocar e/ou corretamente.','Negue a frase “Todos os candidatos estudam Português”.'],
      ['Porcentagem e razão','Aumentar 20% é multiplicar por 1,20; reduzir 20%, por 0,80. Razão compara grandezas e proporção iguala duas razões.','Calcule o preço após aumento de 15% de um item de R$ 200 sem usar regra de três.'],
      ['Sequências e padrões','Antes de buscar fórmula sofisticada, teste diferenças, multiplicações, alternância e agrupamentos.','Descubra os dois próximos termos de 2, 5, 4, 10, 6, 15... e explique o padrão.'],
      ['Problemas lógicos','Traduza o texto para relações menores. Identifique dados, objetivo e restrições. Tabelas simples evitam manter todas as condições na memória.','Resolva um problema de ordem usando uma tabela antes de tentar mentalmente.']
    ]},
    matematica:{title:'Matemática Fundamental',lessons:[
      ['Operações e prioridade','Parênteses vêm antes de potências; multiplicação e divisão antes de adição e subtração. Com mesma prioridade, siga da esquerda para a direita.','Resolva 8 + 2 × (5 − 1) e explique cada etapa.'],
      ['Frações e decimais','Frações representam partes de uma unidade ou razões. Decimais e porcentagens são outras formas de representar a mesma ideia.','Transforme 3/4 em decimal e porcentagem.'],
      ['Regra de três com sentido','Antes da conta, pergunte se as grandezas crescem juntas ou em sentidos opostos. A regra de três organiza proporcionalidade.','Se 4 cadernos custam R$ 28, calcule o preço de 7 mantendo o mesmo valor unitário.'],
      ['Equações','Resolver uma equação é encontrar o valor que torna a igualdade verdadeira. Faça a mesma operação nos dois lados para preservar o equilíbrio.','Resolva 3x + 5 = 20 e substitua o resultado para verificar.'],
      ['Geometria básica','Perímetro mede o contorno; área mede a superfície. Retângulo: base × altura. Triângulo: base × altura ÷ 2.','Calcule área e perímetro de um retângulo de 8 m por 5 m.'],
      ['Estatística básica','Média soma valores e divide pela quantidade; mediana é o valor central após ordenar; moda é o valor mais frequente.','Calcule média, mediana e moda de 4, 5, 5, 6, 20.']
    ]},
    redacao:{title:'Redação',lessons:[
      ['Entender o tema','Antes de escrever, delimite exatamente o problema. Transforme o tema em uma pergunta e responda em uma frase.','Escolha um tema atual e escreva uma resposta de uma frase que possa virar sua tese.'],
      ['Tese clara','A tese organiza o texto. Ela precisa orientar os argumentos que virão e ser específica o bastante para não virar uma introdução genérica.','Escreva duas teses diferentes para o mesmo tema e compare qual é mais específica.'],
      ['Parágrafo argumentativo','Um bom parágrafo possui ideia central, desenvolvimento e relação com a tese. Exemplo ou repertório só ajuda quando é explicado.','Escreva um parágrafo com tópico frasal + explicação + exemplo.'],
      ['Coesão','Conectivos indicam relações de adição, oposição, causa, consequência e conclusão. Varie com naturalidade.','Reescreva um parágrafo usando dois conectivos sem repetir o mesmo.'],
      ['Conclusão','A conclusão fecha o raciocínio. No ENEM, a proposta de intervenção deve dialogar com o problema e respeitar direitos humanos.','Crie uma conclusão que retome a tese sem copiar a introdução.'],
      ['Revisão final','Revise em camadas: primeiro sentido, depois gramática, depois repetição e clareza. Isso funciona melhor do que tentar observar tudo de uma vez.','Revise um texto seu usando essas três passagens separadas.']
    ]}
  };
  let cloud=new Map(),cloudLoadedFor=null;
  function localState(){try{return JSON.parse(localStorage.getItem('rumo-lessons-v2')||'{}')}catch(_){return{}}}
  function saveLocal(v){localStorage.setItem('rumo-lessons-v2',JSON.stringify(v))}
  function stateFor(id){
    const local=localState()[id]||{},remote=cloud.get(id)||{};
    const done=[...new Set([...(Array.isArray(remote.done_lessons)?remote.done_lessons:[]),...(Array.isArray(local.done)?local.done:[])].map(Number).filter(Number.isInteger))].sort((a,b)=>a-b);
    return {done,last:Math.max(Number(remote.last_lesson)||0,Number(local.last)||0)};
  }
  function progress(id){const c=catalog[id];if(!c)return 0;return Math.round(stateFor(id).done.length/c.lessons.length*100)}
  async function loadCloud(){
    const r=R(),uid=r?.state.user?.id||null;if(!uid){cloud.clear();cloudLoadedFor=null;return}
    if(cloudLoadedFor===uid)return;
    const {data}=await r.sb.from('course_progress').select('course_id,progress,done_lessons,last_lesson').eq('user_id',uid);
    cloud=new Map((data||[]).map(x=>[x.course_id,x]));cloudLoadedFor=uid;
  }
  async function persist(id,last){
    const r=R(),s=stateFor(id),data=localState();data[id]={done:s.done,last};saveLocal(data);
    if(r.state.user){
      const pct=Math.round(s.done.length/catalog[id].lessons.length*100);
      const {error}=await r.sb.from('course_progress').upsert({user_id:r.state.user.id,course_id:id,progress:pct,done_lessons:s.done,last_lesson:last,updated_at:new Date().toISOString()},{onConflict:'user_id,course_id'});
      if(!error)cloud.set(id,{course_id:id,progress:pct,done_lessons:s.done,last_lesson:last});
    }
    decorate();
  }
  function decorate(){
    const r=R(),grid=r?.qs('#course-grid');if(!grid)return;
    r.qsa('[data-course]',grid).forEach(card=>{
      const id=card.dataset.course,ready=!!catalog[id],badge=card.querySelector('.course-tag');
      card.classList.toggle('course-coming',!ready);
      if(badge){badge.textContent=ready?'GRÁTIS · PRONTO':'EM BREVE';badge.style.color=ready?'':'var(--muted)'}
      const pct=ready?progress(id):0;let wrap=card.querySelector('.course-progress');
      if(pct){if(!wrap){wrap=document.createElement('div');wrap.className='course-progress';wrap.innerHTML='<div class="line"><i></i></div><small></small>';card.appendChild(wrap)}wrap.querySelector('i').style.width=`${pct}%`;wrap.querySelector('small').textContent=`${pct}% concluído`}else wrap?.remove();
    });
  }
  function renderLesson(id,index){
    const r=R(),c=catalog[id],lesson=c?.lessons[index],host=r.qs('#course-modal-content');if(!c||!lesson||!host)return;
    const done=new Set(stateFor(id).done);
    host.querySelectorAll('.lesson-btn').forEach((b,i)=>{b.classList.toggle('active',i===index);b.classList.toggle('done',done.has(i))});
    const body=host.querySelector('.lesson-content');
    body.innerHTML=`<div class="eyebrow">AULA ${index+1} DE ${c.lessons.length}</div><h3>${r.escapeHTML(lesson[0])}</h3><p class="lesson-lead">Leia, pratique e conclua. O objetivo é terminar algo útil, não acumular horas.</p><p>${r.escapeHTML(lesson[1])}</p><div class="lesson-box"><b>Faça agora</b><p>${r.escapeHTML(lesson[2])}</p></div><button class="primary lesson-complete" id="lesson-complete-v2">${done.has(index)?'✓ Aula concluída':'Concluir esta aula'}</button>`;
    body.querySelector('#lesson-complete-v2').onclick=async()=>{const data=localState(),current=stateFor(id);current.done=[...new Set([...current.done,index])].sort((a,b)=>a-b);data[id]={done:current.done,last:Math.min(c.lessons.length-1,index+1)};saveLocal(data);await persist(id,Math.min(c.lessons.length-1,index+1));renderLesson(id,index<c.lessons.length-1?index+1:index);if(index===c.lessons.length-1)r.toast('Trilha concluída. Você terminou este Essencial.')};
  }
  async function open(id){
    const r=R(),modal=r.qs('#course-modal'),host=r.qs('#course-modal-content');if(!modal||!host)return;
    await loadCloud();const c=catalog[id];
    if(!c){host.innerHTML='<div class="eyebrow">ESSENCIAIS</div><h2>Trilha em preparação</h2><p>Este curso ainda não está completo. O RUMO mostra “em breve” em vez de fingir que existe conteúdo pronto.</p><div class="data-empty"><b>Prioridade da v1</b>Informática, Excel, Português, Raciocínio Lógico, Matemática e Redação já possuem trilhas completas.</div>';modal.classList.add('open');return}
    const s=stateFor(id),done=new Set(s.done);
    host.innerHTML=`<div class="eyebrow">ESSENCIAIS · GRATUITO</div><h2>${r.escapeHTML(c.title)}</h2><p>${c.lessons.length} aulas curtas · ${progress(id)}% concluído · progresso sincronizado quando você está logado.</p><div class="course-workspace"><aside class="lesson-nav"><h4>Trilha</h4>${c.lessons.map((l,i)=>`<button class="lesson-btn ${done.has(i)?'done':''}" data-lesson-index="${i}"><span class="lesson-number">${done.has(i)?'✓':i+1}</span><b>${r.escapeHTML(l[0])}</b></button>`).join('')}</aside><section class="lesson-content"></section></div>`;
    modal.classList.add('open');host.querySelectorAll('[data-lesson-index]').forEach(b=>b.onclick=()=>renderLesson(id,+b.dataset.lessonIndex));renderLesson(id,Math.min(c.lessons.length-1,s.last||s.done.length||0));
  }
  function bind(){
    const r=R();r.qs('#close-course')?.addEventListener('click',()=>r.qs('#course-modal')?.classList.remove('open'));
    r.qs('#course-modal')?.addEventListener('click',e=>{if(e.target.id==='course-modal')e.currentTarget.classList.remove('open')});
    document.addEventListener('click',e=>{const card=e.target.closest?.('#course-grid [data-course]');if(!card)return;e.preventDefault();e.stopImmediatePropagation();open(card.dataset.course)},true);
    document.addEventListener('rumo:courses-render',decorate);
    document.addEventListener('rumo:context',async()=>{cloudLoadedFor=null;await loadCloud();decorate()});
  }
  bind();loadCloud().finally(decorate);
  window.RUMO_COURSES={open,catalog,progress,decorate};
})();