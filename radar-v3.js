(() => {
  'use strict';
  const URL='https://zycpeiyztqysjqejtour.supabase.co';
  const KEY='sb_publishable_heHXvAxo36EvgHg_8_XOXQ_rRxE5t5H';
  let rows=[];
  const statusText={previsto:'Previsto',banca_definida:'Banca definida',edital_iminente:'Edital iminente',edital_publicado:'Edital publicado',inscricoes_abertas:'Inscrições abertas',prova_marcada:'Prova marcada',encerrado:'Encerrado'};
  const areaText={Fiscal:'fiscal',Segurança:'segurança pública',Tribunais:'tribunais',Administrativa:'administrativa',Saúde:'saúde',Educação:'educação',Jurídica:'jurídica',Infraestrutura:'infraestrutura',Diversas:'diversas áreas'};
  const esc=(v='')=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  function summary(c){
    if(c.resumo)return c.resumo;
    const area=areaText[c.area]||String(c.area||'diversas áreas').toLowerCase();
    const stage=c.edital_previsto||statusText[c.status]||'Seleção em acompanhamento';
    const level=c.escolaridade&&c.escolaridade!=='A definir'?` para candidatos de nível ${c.escolaridade.toLowerCase()}`:'';
    const vacancies=c.vagas&&c.vagas!=='A definir'?` A informação atual indica ${c.vagas} vagas ou oportunidades em cadastro.`:'';
    return `${c.nome} é uma oportunidade da área ${area}${level}. ${stage}.${vacancies}`;
  }
  function updated(v){
    if(!v)return'Atualização não informada';
    const d=new Date(v);if(Number.isNaN(d.getTime()))return'Atualização não informada';
    return `Atualizado em ${d.toLocaleDateString('pt-BR',{day:'2-digit',month:'short',year:'numeric'})}`;
  }
  function date(v){if(!v)return'A definir';return new Date(`${v}T12:00:00`).toLocaleDateString('pt-BR',{day:'2-digit',month:'short',year:'numeric'})}
  function injectModal(){
    if(document.querySelector('#contest-detail-modal'))return;
    document.body.insertAdjacentHTML('beforeend','<div id="contest-detail-modal" class="modal"><div class="modal-card contest-detail-shell"><button class="close" id="contest-detail-close">×</button><div id="contest-detail-content"></div></div></div>');
    const modal=document.querySelector('#contest-detail-modal');
    document.querySelector('#contest-detail-close').onclick=()=>modal.classList.remove('open');
    modal.onclick=e=>{if(e.target===modal)modal.classList.remove('open')};
  }
  function findByTitle(title){return rows.find(x=>String(x.nome).trim()===String(title).trim())}
  function applyStatus(card,c){
    const badge=card.querySelector('.status');if(!badge)return;
    badge.className=`status ${c.status||''}`;
    badge.textContent=statusText[c.status]||'Em acompanhamento';
  }
  function decorate(){
    document.querySelectorAll('.contest').forEach(card=>{
      const title=card.querySelector('h3')?.textContent?.trim(),c=findByTitle(title);if(!c)return;
      applyStatus(card,c);
      if(card.dataset.radarV3)return;
      card.dataset.radarV3='1';card.dataset.contestSlug=c.slug||'';
      const old=card.querySelector('p');
      if(old){old.classList.add('contest-org');old.insertAdjacentHTML('afterend',`<p class="contest-summary">${esc(summary(c))}</p>`)}
      const footer=document.createElement('div');footer.className='contest-actions';footer.innerHTML=`<button type="button" class="contest-more">Ver detalhes</button><span>${esc(updated(c.atualizado_em))}</span>`;card.appendChild(footer);
      card.querySelector('.contest-more').onclick=e=>{e.stopPropagation();openDetail(c)};
      card.addEventListener('click',e=>{if(!e.target.closest('button,a'))openDetail(c)});
    });
  }
  function detailCell(label,value,wide=false){return value?`<div${wide?' class="wide"':''}><span>${esc(label)}</span><b>${esc(value)}</b></div>`:''}
  function watchText(c){
    if(c.status==='inscricoes_abertas')return'As inscrições já estão abertas. Confira prazo, taxa, requisitos e cidade de prova no edital antes de concluir a candidatura.';
    if(c.status==='edital_publicado')return'O edital já foi publicado. A preparação deve partir do conteúdo programático e do cronograma oficiais.';
    if(c.status==='prova_marcada')return'A prova já tem data. Priorize conteúdo de maior peso, questões da banca e revisões do que você já estudou.';
    if(c.status==='edital_iminente')return'O edital está próximo ou em fase avançada. Vale acompanhar a publicação oficial e preparar a base reaproveitável desde já.';
    if(c.status==='banca_definida')return'Com a banca definida, já é possível estudar o estilo de cobrança da organizadora enquanto o edital é finalizado.';
    if(c.status==='encerrado')return'As inscrições ou a etapa principal já foram encerradas. Use este registro apenas para acompanhamento do certame.';
    return'A oportunidade ainda é previsão. Use os dados como sinal de planejamento e espere confirmação oficial antes de tomar decisões de inscrição.';
  }
  function openDetail(c){
    injectModal();
    const modal=document.querySelector('#contest-detail-modal'),box=document.querySelector('#contest-detail-content');
    const source=c.fonte_oficial_url||c.fonte_url,sourceName=c.fonte_oficial_url?'Fonte oficial':(c.fonte_nome||'Fonte acompanhada');
    box.innerHTML=`<div class="contest-detail-top"><div><span class="status ${esc(c.status||'')}">${esc(statusText[c.status]||'Em acompanhamento')}</span><h2>${esc(c.nome)}</h2><p class="contest-detail-org">${esc(c.orgao||'')}</p></div><div class="contest-detail-state">${esc(c.uf||'BR')}</div></div><p class="contest-detail-summary">${esc(summary(c))}</p><div class="contest-detail-grid">${detailCell('Situação',c.edital_previsto||statusText[c.status]||'Acompanhar')}${detailCell('Banca',c.banca||'A definir')}${detailCell('Vagas',c.vagas||'A definir')}${detailCell('Escolaridade',c.escolaridade||'A definir')}${detailCell('Remuneração',c.remuneracao||'A definir',true)}${detailCell('Área',c.area||'Diversas')}${c.cargos?detailCell('Cargos',c.cargos,true):''}${c.requisitos?detailCell('Requisitos',c.requisitos,true):''}${c.inscricoes_fim?detailCell('Fim das inscrições',date(c.inscricoes_fim)):''}${c.prova_data?detailCell('Prova',date(c.prova_data)):''}</div><div class="contest-detail-note"><b>O que observar agora</b><p>${esc(watchText(c))}</p></div><div class="contest-detail-footer"><span>${esc(updated(c.atualizado_em))}</span>${source?`<button type="button" id="contest-source-btn">${esc(sourceName)} ↗</button>`:''}</div><p class="contest-detail-disclaimer">O Radar organiza informações públicas. Datas, vagas, requisitos e remuneração devem ser confirmados no edital e nos canais oficiais.</p>`;
    const btn=document.querySelector('#contest-source-btn');if(btn)btn.onclick=()=>window.open(source,'_blank','noopener,noreferrer');
    modal.classList.add('open');
  }
  async function load(){
    try{const r=await fetch(`${URL}/rest/v1/concursos?select=*&order=destaque.desc,atualizado_em.desc&limit=100`,{headers:{apikey:KEY,Authorization:`Bearer ${KEY}`}});if(r.ok)rows=await r.json()}catch(_){ }
    injectModal();decorate();
    const root=document.querySelector('main')||document.body;
    new MutationObserver(decorate).observe(root,{childList:true,subtree:true});
  }
  load();
})();