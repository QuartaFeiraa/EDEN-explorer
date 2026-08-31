(() => {
  'use strict';
  let active=null,timer=null,seconds=0,running=false;
  const R=()=>window.RUMO;
  const matBy=id=>R().state.materias.find(x=>x.id===id);
  const topBy=id=>R().state.topicos.find(x=>x.id===id);
  const html=s=>R().escapeHTML(s||'').replace(/\n/g,'<br>');

  const knowledge=[
    [/crase/i,'Crase é a fusão de duas vogais “a”: normalmente a preposição exigida por um termo + o artigo feminino. Um teste útil é trocar a palavra feminina por uma masculina: se surgir “ao”, geralmente haverá crase no feminino. Ex.: “Vou ao mercado” → “Vou à escola”.'],
    [/atos? administrativos?/i,'Atos administrativos são manifestações da Administração que produzem efeitos jurídicos. Para provas, separe elementos, atributos e formas de desfazimento, como anulação e revogação.'],
    [/interpreta[cç][aã]o/i,'Interpretação de texto em prova exige separar o que o texto afirma do que apenas parece plausível. Leia o comando, localize a ideia central e teste cada alternativa contra evidências do próprio texto.'],
    [/proposi[cç][oõ]es|conectivos/i,'Em lógica, uma proposição pode ser classificada como verdadeira ou falsa. “E” exige as duas verdadeiras; “ou” normalmente aceita pelo menos uma; “se... então” só é falsa quando o antecedente é verdadeiro e o consequente é falso.'],
    [/porcentagem/i,'Porcentagem é uma razão com base 100. 15% = 0,15. Para aumentar um valor em 15%, multiplique por 1,15; para reduzir 15%, por 0,85.'],
    [/seguran[cç]a da informa[cç][aã]o/i,'Segurança da informação costuma ser organizada por confidencialidade, integridade e disponibilidade. Diferencie autenticação, autorização, criptografia, backup e engenharia social.'],
    [/licita[cç][oõ]es/i,'Em licitações, organize o estudo da Lei 14.133/2021 por princípios, modalidades, fases, critérios de julgamento, contratação direta e responsabilidades, sempre conferindo o texto legal atualizado.'],
    [/direitos? fundamentais/i,'Em direitos fundamentais, observe titularidade, aplicabilidade, restrições e colisões entre direitos. Questões costumam explorar exceções e interpretação do texto constitucional.'],
    [/excel|planilha/i,'Em Excel, pense em três camadas: dados bem organizados, fórmulas que transformam esses dados e recursos de análise. SOMA agrega valores, MÉDIA calcula média e SE cria uma condição.']
  ];
  function explain(subject,topic){
    const text=`${subject||''} ${topic||''}`;
    const found=knowledge.find(([re])=>re.test(text));
    if(found)return found[1];
    return `Para estudar “${topic||subject||'este assunto'}” com eficiência, responda três perguntas: qual é a ideia central, quais conceitos costumam ser confundidos e como isso aparece em uma questão. Faça uma leitura curta, tente explicar sem consultar e termine com questões.`;
  }
  function resourceUrl(kind,subject,topic){
    const q=encodeURIComponent(`${subject||''} ${topic||''}`.trim());
    if(kind==='video')return `https://www.youtube.com/results?search_query=${q}+aula+concurso`;
    if(kind==='playlist')return `https://www.youtube.com/results?search_query=${q}+playlist+curso`;
    if(kind==='material')return `https://www.google.com/search?q=${q}+material+gratuito+pdf`;
    if(kind==='questoes')return `https://www.google.com/search?q=${q}+questões+concurso`;
    return '#';
  }

  function inject(){
    const r=R();
    if(r.qs('#study-session-v1'))return;
    document.body.insertAdjacentHTML('beforeend',`<div id="study-session-v1" class="modal"><div class="modal-card session-shell"><button class="close" id="close-session-v1">×</button><header class="session-header"><div><div class="eyebrow" id="session-type-v1">SESSÃO DE ESTUDO</div><h2 id="session-title-v1">Estudo</h2><p id="session-topic-v1"></p><div class="session-meta"><span id="session-time-meta-v1">30 min</span><span id="session-source-meta-v1">RUMO</span></div></div></header><div class="session-body"><main class="session-main"><div id="manual-fields-v1" class="form-grid two" hidden style="margin-bottom:20px"><div class="field"><label>Matéria</label><input id="manual-subject-v1" placeholder="Ex.: Português"></div><div class="field"><label>Assunto</label><input id="manual-topic-v1" placeholder="Ex.: Crase"></div></div><div class="study-steps"><button class="study-step active" data-session-step="learn">1 · Aprender</button><button class="study-step" data-session-step="practice">2 · Praticar</button><button class="study-step" data-session-step="review">3 · Revisar</button></div><section class="study-panel active" data-session-panel="learn"><h3>Escolha a melhor forma de entrar no assunto.</h3><p>O RUMO não te prende a uma única fonte. Use a alternativa que combina melhor com seu momento.</p><div class="learning-options"><button class="resource-btn" data-resource="video"><span class="resource-icon">▶</span><b>Videoaula</b><span>Buscar uma aula pública no YouTube.</span></button><button class="resource-btn" data-resource="playlist"><span class="resource-icon">▤</span><b>Playlist</b><span>Buscar uma sequência pública de aulas.</span></button><button class="resource-btn" data-resource="material"><span class="resource-icon">▧</span><b>Leitura</b><span>Buscar material gratuito e leitura complementar.</span></button><button class="resource-btn" id="explain-rumo-v1"><span class="resource-icon">✦</span><b>Explicar no RUMO</b><span>Receber uma explicação curta antes de praticar.</span></button></div><div class="explanation-box" id="explanation-v1" hidden></div></section><section class="study-panel" data-session-panel="practice"><h3>Transforme leitura em recuperação ativa.</h3><p>Registre as questões que fez. O desempenho alimenta prioridade e revisão.</p><div class="learning-options" style="margin-bottom:15px"><button class="resource-btn" data-resource="questoes"><span class="resource-icon">?</span><b>Buscar questões</b><span>Encontrar exercícios relacionados na web.</span></button><button class="resource-btn" id="practice-tip-v1"><span class="resource-icon">✓</span><b>Prática sem consulta</b><span>Tente resolver antes de olhar a resposta.</span></button></div><div class="practice-grid"><div class="field"><label>Questões feitas</label><input id="session-questions-v1" type="number" min="0" value="0"></div><div class="field"><label>Acertos</label><input id="session-correct-v1" type="number" min="0" value="0"></div></div><div class="explanation-box" id="practice-tip-box-v1" hidden>Comece com poucas questões e corrija com atenção. O ganho vem de descobrir <strong>por que</strong> você acertou ou errou.</div></section><section class="study-panel" data-session-panel="review"><h3>Feche a sessão deixando uma pista para o futuro.</h3><p>Antes de encerrar, tente recuperar a ideia principal sem olhar suas anotações.</p><div class="review-actions"><button class="review-action">Expliquei o assunto sem consultar</button><button class="review-action">Fiz um resumo curto</button><button class="review-action">Revisei pelos meus erros</button></div><div class="explanation-box">Dica: diga em uma frase qual foi a ideia mais importante da sessão.</div></section></main><aside class="session-side"><div class="session-timer"><div><div class="timer-label">CRONÔMETRO</div><div class="timer-value" id="timer-v1">00:00</div></div><div class="timer-controls"><button id="timer-toggle-v1">Iniciar</button><button id="timer-reset-v1">Zerar</button></div></div><h4>Duração registrada</h4><div class="field"><input id="session-minutes-v1" type="number" min="1" max="600" value="30"></div><h4>Anotações</h4><textarea class="session-notes" id="session-notes-v1" placeholder="O que ficou difícil? O que precisa voltar?"></textarea><button class="primary complete-session" id="complete-session-v1">Concluir sessão</button><button class="error-inline-btn" id="session-error-v1">+ Registrar um erro</button></aside></div></div></div>`);
    bind();
  }
  function refreshManualIdentity(){
    if(!active?.manual)return;
    const r=R();
    active.subject=r.qs('#manual-subject-v1').value.trim();
    active.topic=r.qs('#manual-topic-v1').value.trim();
    r.qs('#session-title-v1').textContent=active.subject||'Estudo livre';
    r.qs('#session-topic-v1').textContent=active.topic||'Assunto não informado';
  }
  function bind(){
    const r=R();
    r.qs('#close-session-v1').onclick=close;
    r.qs('#study-session-v1').onclick=e=>{if(e.target.id==='study-session-v1')close()};
    r.qsa('[data-session-step]').forEach(b=>b.onclick=()=>{
      r.qsa('[data-session-step]').forEach(x=>x.classList.toggle('active',x===b));
      r.qsa('[data-session-panel]').forEach(x=>x.classList.toggle('active',x.dataset.sessionPanel===b.dataset.sessionStep));
    });
    r.qsa('[data-resource]').forEach(b=>b.onclick=()=>{
      refreshManualIdentity();
      if(!active)return;
      window.open(resourceUrl(b.dataset.resource,active.subject,active.topic),'_blank','noopener');
    });
    r.qs('#explain-rumo-v1').onclick=()=>{
      refreshManualIdentity();
      const box=r.qs('#explanation-v1');
      box.innerHTML=html(explain(active?.subject,active?.topic));
      box.hidden=false;
    };
    r.qs('#practice-tip-v1').onclick=()=>r.qs('#practice-tip-box-v1').hidden=false;
    r.qs('#timer-toggle-v1').onclick=toggleTimer;
    r.qs('#timer-reset-v1').onclick=resetTimer;
    r.qs('#complete-session-v1').onclick=complete;
    r.qs('#session-error-v1').onclick=()=>{
      refreshManualIdentity();
      r.emit('open-error',{materia_id:active?.materia_id,topico_id:active?.topico_id,subject:active?.subject,topic:active?.topic});
    };
    r.qs('#manual-subject-v1').addEventListener('input',refreshManualIdentity);
    r.qs('#manual-topic-v1').addEventListener('input',refreshManualIdentity);
  }
  function open(task=null,manual=false){
    inject();
    const r=R(),mat=task?matBy(task.materia_id):null,top=task?topBy(task.topico_id):null;
    active={task_id:task?.id||null,materia_id:task?.materia_id||null,topico_id:task?.topico_id||null,subject:mat?.nome||'',topic:top?.nome||'',minutes:task?.minutos||30,type:task?.tipo||'estudo',manual};
    const manualFields=r.qs('#manual-fields-v1');
    manualFields.hidden=!manual;
    if(manual){
      r.qs('#manual-subject-v1').value='';
      r.qs('#manual-topic-v1').value='';
    }
    r.qs('#session-type-v1').textContent=manual?'REGISTRO LIVRE':({estudo:'APRENDER',questoes:'PRATICAR',revisao:'REVISAR'})[active.type]||'SESSÃO DE ESTUDO';
    r.qs('#session-title-v1').textContent=manual?'O que você estudou?':active.subject||'Estudo';
    r.qs('#session-topic-v1').textContent=manual?'Registre também estudos feitos fora do RUMO.':active.topic||'Sessão livre';
    r.qs('#session-time-meta-v1').textContent=`${active.minutes} min planejados`;
    r.qs('#session-source-meta-v1').textContent=manual?'Estudo externo ou livre':'Plano RUMO';
    r.qs('#session-minutes-v1').value=active.minutes;
    r.qs('#session-questions-v1').value=0;
    r.qs('#session-correct-v1').value=0;
    r.qs('#session-notes-v1').value='';
    r.qs('#explanation-v1').hidden=true;
    r.qs('#practice-tip-box-v1').hidden=true;
    r.qs('#study-session-v1').classList.add('open');
    resetTimer();
    if(manual)setTimeout(()=>r.qs('#manual-subject-v1')?.focus(),80);
  }
  function close(){
    R().qs('#study-session-v1')?.classList.remove('open');
    if(timer)clearInterval(timer);
    timer=null;running=false;
  }
  function paintTimer(){
    const m=Math.floor(seconds/60),s=seconds%60;
    R().qs('#timer-v1').textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }
  function toggleTimer(){
    const b=R().qs('#timer-toggle-v1');
    if(running){clearInterval(timer);timer=null;running=false;b.textContent='Continuar';return}
    running=true;b.textContent='Pausar';
    timer=setInterval(()=>{seconds++;paintTimer();if(seconds%60===0)R().qs('#session-minutes-v1').value=Math.max(1,Math.round(seconds/60))},1000);
  }
  function resetTimer(){
    if(timer)clearInterval(timer);
    timer=null;running=false;seconds=0;paintTimer();
    const b=R().qs('#timer-toggle-v1');if(b)b.textContent='Iniciar';
  }
  async function updateTopicStats(questions,correct){
    if(!active?.topico_id)return;
    const r=R(),topic=topBy(active.topico_id);if(!topic)return;
    const acertos=(topic.acertos||0)+correct,erros=(topic.erros||0)+Math.max(0,questions-correct),total=acertos+erros,rate=total?acertos/total:0;
    let status=topic.status==='dominado'?'dominado':'estudando';
    if(total>=10&&rate>=.8)status='dominado';
    let interval=2;
    if(questions){const sessionRate=correct/Math.max(1,questions);interval=sessionRate<.6?1:sessionRate<.8?3:sessionRate<.9?7:14}
    else if(active.type==='revisao')interval=5;
    const next=new Date();next.setDate(next.getDate()+interval);
    await r.sb.from('topicos').update({acertos,erros,status,ultima_revisao:new Date().toISOString(),proxima_revisao:next.toISOString()}).eq('id',active.topico_id);
    const mat=matBy(active.materia_id);
    if(mat){
      const tops=r.state.topicos.filter(x=>x.materia_id===mat.id).map(x=>x.id===active.topico_id?{...x,acertos,erros,status}:x);
      const pct=tops.length?Math.round(tops.filter(x=>x.status==='dominado').length/tops.length*100):0;
      await r.sb.from('materias').update({progresso:pct}).eq('id',mat.id);
    }
  }
  async function complete(){
    const r=R(),s=r.state;
    if(!active||!s.user){r.toast('Entre na sua conta para salvar seu progresso.');return}
    refreshManualIdentity();
    if(active.manual&&!active.subject){r.toast('Informe a matéria estudada.');return}
    const minutes=Math.max(1,Math.min(600,+r.qs('#session-minutes-v1').value||active.minutes));
    const questions=Math.max(0,+r.qs('#session-questions-v1').value||0);
    const correct=Math.max(0,Math.min(questions,+r.qs('#session-correct-v1').value||0));
    const notes=r.qs('#session-notes-v1').value.trim()||null;
    const btn=r.qs('#complete-session-v1');btn.disabled=true;btn.textContent='Salvando...';
    try{
      const {error}=await r.sb.from('sessoes_estudo').insert({user_id:s.user.id,materia_id:active.materia_id,topico_id:active.topico_id,minutos:minutes,questoes:questions,acertos:correct,notas:notes});
      if(error)throw error;
      await r.sb.from('study_sessions').insert({user_id:s.user.id,goal_id:s.goal?.id||null,subject:active.subject||'Estudo',topic:active.topic||null,minutes,questions,correct_answers:correct,source:active.manual?'externo':'rumo'});
      if(active.task_id)await r.sb.from('plano_tarefas').update({concluida:true,concluida_em:new Date().toISOString()}).eq('id',active.task_id);
      await updateTopicStats(questions,correct);
      close();r.toast('Sessão concluída e progresso atualizado');r.emit('session-saved',{active,minutes,questions,correct});
    }catch(_){r.toast('Não foi possível salvar a sessão agora.')}
    finally{btn.disabled=false;btn.textContent='Concluir sessão'}
  }

  document.addEventListener('rumo:open-session',e=>open(e.detail.task,false));
  document.addEventListener('rumo:open-manual-session',()=>open(null,true));
  setTimeout(inject,1850);
  window.RUMO_SESSION={open,explain};
})();