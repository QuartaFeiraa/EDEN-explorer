(() => {
  'use strict';
  const R=()=>window.RUMO;
  let rows=[],watch=new Set(),watchLoaded=false;
  const statusText={previsto:'Previsto',banca_definida:'Banca definida',edital_iminente:'Edital iminente',edital_publicado:'Edital publicado',inscricoes_abertas:'Inscrições abertas',prova_marcada:'Prova marcada',encerrado:'Encerrado'};
  const esc=(v='')=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const safeStatus=v=>Object.prototype.hasOwnProperty.call(statusText,v)?v:'';
  const fmtDate=v=>v?new Date(`${String(v).slice(0,10)}T12:00:00`).toLocaleDateString('pt-BR',{day:'2-digit',month:'short',year:'numeric'}):'A definir';
  const sourceOf=c=>{const raw=String(c?.fonte_oficial_url||c?.fonte_url||'').trim();if(!raw)return'';try{const url=new URL(raw);return url.protocol==='https:'||url.protocol==='http:'?url.href:''}catch{return''}};
  function summary(c){
    if(c.resumo)return c.resumo;
    const area=c.area?`na área ${String(c.area).toLowerCase()}`:'em acompanhamento';
    const level=c.escolaridade&&c.escolaridade!=='A definir'?` Exige ${String(c.escolaridade).toLowerCase()}.`:'';
    return `${c.nome} é uma oportunidade ${area}.${level} ${c.edital_previsto||statusText[c.status]||'Acompanhe as atualizações oficiais.'}`;
  }
  function updated(v){const d=v?new Date(v):null;return d&&!Number.isNaN(d.getTime())?`Atualizado em ${d.toLocaleDateString('pt-BR',{day:'2-digit',month:'short',year:'numeric'})}`:'Atualização não informada'}
  function note(c){
    if(c.status==='inscricoes_abertas')return'As inscrições estão abertas. Confira prazo, taxa e requisitos no edital oficial.';
    if(c.status==='edital_publicado')return'O edital já foi publicado. Use o conteúdo programático e o cronograma oficiais como referência principal.';
    if(c.status==='prova_marcada')return'A prova já tem data. Priorize matérias de maior peso, questões da banca e revisões.';
    if(c.status==='banca_definida')return'Com a banca definida, já é possível estudar o estilo de cobrança da organizadora.';
    if(c.status==='edital_iminente')return'O edital está próximo. Prepare a base reaproveitável e acompanhe a publicação oficial.';
    return'A oportunidade ainda é previsão. Planeje com cautela e espere confirmação oficial antes de decisões de inscrição.';
  }
  function cell(label,value,wide=false){return value?`<div${wide?' class="wide"':''}><span>${esc(label)}</span><b>${esc(value)}</b></div>`:''}
  function inject(){
    if(document.querySelector('#contest-detail-modal'))return;
    document.body.insertAdjacentHTML('beforeend',`<div id="contest-detail-modal" class="modal"><div class="modal-card contest-detail-shell"><button class="close" id="contest-detail-close">×</button><div id="contest-detail-content"></div></div></div>`);
    const modal=document.querySelector('#contest-detail-modal');
    document.querySelector('#contest-detail-close').onclick=()=>modal.classList.remove('open');
    modal.onclick=e=>{if(e.target===modal)modal.classList.remove('open')};
  }
  function ensureFilterOptions(){
    const select=document.querySelector('#contest-filter');
    if(!select||select.dataset.v2)return;
    select.dataset.v2='1';
    const wanted=[['inscricoes_abertas','Inscrições abertas'],['edital_publicado','Edital publicado'],['prova_marcada','Prova marcada']];
    for(const [value,label] of wanted)if(!select.querySelector(`option[value="${value}"]`)){const o=document.createElement('option');o.value=value;o.textContent=label;select.appendChild(o)}
  }
  async function loadWatch(){
    const r=R();
    if(watchLoaded)return watch;
    watchLoaded=true;
    watch.clear();
    if(!r?.state.user)return watch;
    const {data,error}=await r.sb.from('contest_watchlist').select('concurso_id').eq('user_id',r.state.user.id);
    if(!error)for(const x of data||[])watch.add(String(x.concurso_id));
    return watch;
  }
  async function toggleWatch(c,button){
    const r=R();
    if(!r.state.user){r.toast('Entre na sua conta para acompanhar concursos.');r.qs('#account-btn')?.click();return}
    button.disabled=true;
    const key=String(c.id),following=watch.has(key);
    const q=following?r.sb.from('contest_watchlist').delete().eq('user_id',r.state.user.id).eq('concurso_id',c.id):r.sb.from('contest_watchlist').insert({user_id:r.state.user.id,concurso_id:c.id});
    const {error}=await q;
    button.disabled=false;
    if(error){r.toast('Não consegui atualizar agora.');return}
    following?watch.delete(key):watch.add(key);
    button.textContent=following?'☆ Acompanhar':'★ Acompanhando';
    r.toast(following?'Concurso removido dos acompanhados.':'Você agora acompanha este concurso.');
  }
  async function setGoal(c){
    const r=R(),current=r.state.goal;
    if(!r.state.user){
      const goal={id:'guest',active:true,concurso_id:c.id,objective_name:c.nome,cargo:'',prova_data:c.prova_data||null,weekly_hours:Number(current?.weekly_hours)||8,study_days:current?.study_days?.length?current.study_days:[1,2,3,4,5],level:current?.level||'iniciante'};
      localStorage.setItem('rumo-guest-goal',JSON.stringify(goal));
      await r.sync(true);
      r.toast(`${c.nome} definido como objetivo.`);
      window.RUMO_SHELL?.switchTab('meu');
      return;
    }
    const hours=Number(current?.weekly_hours)||10,days=current?.study_days?.length?current.study_days:[1,2,3,4,5],level=current?.level||'iniciante';
    await r.sb.from('user_goals').update({active:false}).eq('user_id',r.state.user.id).eq('active',true);
    const {error}=await r.sb.from('user_goals').insert({user_id:r.state.user.id,concurso_id:c.id,objective_name:c.nome,cargo:current?.cargo||null,prova_data:c.prova_data||current?.prova_data||null,weekly_hours:hours,study_days:days,level,active:true});
    if(error){r.toast('Não consegui definir o objetivo agora.');return}
    await r.sync(true);
    r.emit('plan-refresh',{});
    r.toast(`${c.nome} virou seu objetivo principal.`);
    window.RUMO_SHELL?.switchTab('meu');
  }
  async function open(c){
    inject();
    await loadWatch();
    const modal=document.querySelector('#contest-detail-modal'),box=document.querySelector('#contest-detail-content'),source=sourceOf(c),following=watch.has(String(c.id)),status=safeStatus(c.status);
    box.innerHTML=`<div class="contest-detail-top"><div><span class="status ${status}">${esc(statusText[status]||'Em acompanhamento')}</span><h2>${esc(c.nome)}</h2><p class="contest-detail-org">${esc(c.orgao||'')}</p></div><div class="contest-detail-state">${esc(c.uf||'BR')}</div></div><p class="contest-detail-summary">${esc(summary(c))}</p><div class="contest-detail-grid">${cell('Situação',c.edital_previsto||statusText[status])}${cell('Banca',c.banca||'A definir')}${cell('Vagas',c.vagas||'A definir')}${cell('Escolaridade',c.escolaridade||'A definir')}${cell('Remuneração',c.remuneracao||'A definir',true)}${cell('Área',c.area||'Diversas')}${cell('Cargos',c.cargos,true)}${cell('Requisitos',c.requisitos,true)}${c.inscricoes_fim?cell('Fim das inscrições',fmtDate(c.inscricoes_fim)):''}${c.prova_data?cell('Prova',fmtDate(c.prova_data)):''}</div><div class="contest-detail-note"><b>O que observar agora</b><p>${esc(note(c))}</p></div><div class="contest-detail-actions-v2"><button class="primary" id="contest-goal-v2">Usar como meu objetivo</button><button class="secondary" id="contest-watch-v2">${following?'★ Acompanhando':'☆ Acompanhar'}</button></div><div class="contest-detail-footer"><span>${esc(updated(c.atualizado_em))}</span>${source?'<button type="button" id="contest-source-btn">Abrir fonte ↗</button>':''}</div><p class="contest-detail-disclaimer">Confirme datas, vagas, requisitos e remuneração no edital e nos canais oficiais.</p>`;
    box.querySelector('#contest-goal-v2').onclick=()=>setGoal(c);
    box.querySelector('#contest-watch-v2').onclick=e=>toggleWatch(c,e.currentTarget);
    const sourceBtn=box.querySelector('#contest-source-btn');if(sourceBtn)sourceBtn.onclick=()=>window.open(source,'_blank','noopener,noreferrer');
    modal.classList.add('open');
  }
  function decorate(){
    const current=window.RUMO_CONTESTS||rows;
    if(Array.isArray(current)&&current.length)rows=current;
    for(const card of document.querySelectorAll('.contest')){
      if(card.dataset.radarV2==='1')continue;
      const title=card.querySelector('h3')?.textContent?.trim(),c=rows.find(x=>String(x.nome).trim()===title);
      if(!c)continue;
      card.dataset.radarV2='1';
      const badge=card.querySelector('.status');if(badge){const status=safeStatus(c.status);badge.className=`status ${status}`;badge.textContent=statusText[status]||'Em acompanhamento'}
      const org=card.querySelector('p');
      if(org&&!card.querySelector('.contest-summary')){org.classList.add('contest-org');org.insertAdjacentHTML('afterend',`<p class="contest-summary">${esc(summary(c))}</p>`)}
      const footer=document.createElement('div');footer.className='contest-actions';footer.innerHTML=`<button type="button" class="contest-more">Ver detalhes</button><span>${esc(updated(c.atualizado_em))}</span>`;card.appendChild(footer);
      footer.querySelector('button').onclick=e=>{e.stopPropagation();open(c)};
      card.onclick=e=>{if(!e.target.closest('button,a'))open(c)};
    }
  }
  async function boot(){
    rows=await Promise.resolve(window.RUMO_CONTESTS_READY||window.RUMO_CONTESTS||[]).catch(()=>window.RUMO_CONTESTS||[]);
    if(!Array.isArray(rows))rows=[];
    inject();ensureFilterOptions();decorate();
  }
  document.addEventListener('rumo:contest-render',decorate);
  document.addEventListener('rumo:contests',e=>{if(Array.isArray(e.detail?.contests))rows=e.detail.contests;decorate()});
  document.addEventListener('rumo:context',()=>{watchLoaded=false;watch.clear()});
  boot();
  window.RUMO_RADAR={open,decorate,loadWatch};
})();