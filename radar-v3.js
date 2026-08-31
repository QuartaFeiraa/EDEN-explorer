(() => {
  const URL='https://zycpeiyztqysjqejtour.supabase.co';
  const KEY='sb_publishable_heHXvAxo36EvgHg_8_XOXQ_rRxE5t5H';
  let rows=[];

  const statusText={edital_iminente:'Edital iminente',banca_definida:'Banca definida',previsto:'Previsto'};
  const areaText={Fiscal:'fiscal',Segurança:'segurança pública',Tribunais:'tribunais',Administrativa:'administrativa',Saúde:'saúde',Educação:'educação',Jurídica:'jurídica',Infraestrutura:'infraestrutura',Diversas:'diversas áreas'};

  function esc(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
  function summary(c){
    const area=areaText[c.area]||String(c.area||'diversas áreas').toLowerCase();
    const stage=c.edital_previsto||statusText[c.status]||'Seleção em acompanhamento';
    const level=c.escolaridade&&c.escolaridade!=='A definir'?` para candidatos de nível ${c.escolaridade.toLowerCase()}`:'';
    const vacancies=c.vagas&&c.vagas!=='A definir'?` A previsão atual indica ${c.vagas} vagas ou oportunidades em cadastro.`:'';
    return `${c.nome} é uma oportunidade da área ${area}${level}. ${stage}.${vacancies}`;
  }
  function updated(v){if(!v)return'Atualização não informada';const d=new Date(v);if(Number.isNaN(d.getTime()))return'Atualização não informada';return `Atualizado em ${d.toLocaleDateString('pt-BR',{day:'2-digit',month:'short',year:'numeric'})}`}

  function injectModal(){
    if(document.querySelector('#contest-detail-modal'))return;
    document.body.insertAdjacentHTML('beforeend',`<div id="contest-detail-modal" class="modal"><div class="modal-card contest-detail-shell"><button class="close" id="contest-detail-close">×</button><div id="contest-detail-content"></div></div></div>`);
    const modal=document.querySelector('#contest-detail-modal');
    document.querySelector('#contest-detail-close').onclick=()=>modal.classList.remove('open');
    modal.onclick=e=>{if(e.target===modal)modal.classList.remove('open')};
  }

  function findByTitle(title){return rows.find(x=>String(x.nome).trim()===String(title).trim())}
  function decorate(){
    document.querySelectorAll('.contest').forEach(card=>{
      if(card.dataset.radarV3)return;
      const title=card.querySelector('h3')?.textContent?.trim();
      const c=findByTitle(title);if(!c)return;
      card.dataset.radarV3='1';card.dataset.contestSlug=c.slug||'';
      const old=card.querySelector('p');
      if(old){old.classList.add('contest-org');old.insertAdjacentHTML('afterend',`<p class="contest-summary">${esc(summary(c))}</p>`)}
      const footer=document.createElement('div');footer.className='contest-actions';footer.innerHTML=`<button type="button" class="contest-more">Ver detalhes</button><span>${esc(updated(c.atualizado_em))}</span>`;card.appendChild(footer);
      card.querySelector('.contest-more').onclick=e=>{e.stopPropagation();openDetail(c)};
      card.addEventListener('click',e=>{if(!e.target.closest('button,a'))openDetail(c)});
    });
  }

  function openDetail(c){
    injectModal();
    const modal=document.querySelector('#contest-detail-modal');const box=document.querySelector('#contest-detail-content');
    box.innerHTML=`
      <div class="contest-detail-top"><div><span class="status ${esc(c.status||'')}">${esc(statusText[c.status]||'Em acompanhamento')}</span><h2>${esc(c.nome)}</h2><p class="contest-detail-org">${esc(c.orgao||'')}</p></div><div class="contest-detail-state">${esc(c.uf||'BR')}</div></div>
      <p class="contest-detail-summary">${esc(summary(c))}</p>
      <div class="contest-detail-grid">
        <div><span>Situação</span><b>${esc(c.edital_previsto||statusText[c.status]||'Acompanhar')}</b></div>
        <div><span>Banca</span><b>${esc(c.banca||'A definir')}</b></div>
        <div><span>Vagas</span><b>${esc(c.vagas||'A definir')}</b></div>
        <div><span>Escolaridade</span><b>${esc(c.escolaridade||'A definir')}</b></div>
        <div class="wide"><span>Remuneração</span><b>${esc(c.remuneracao||'A definir')}</b></div>
        <div><span>Área</span><b>${esc(c.area||'Diversas')}</b></div>
      </div>
      <div class="contest-detail-note"><b>O que observar agora</b><p>${c.status==='edital_iminente'?'O edital está próximo ou em fase avançada. Vale acompanhar a publicação oficial e já organizar uma base de estudos.':c.status==='banca_definida'?'Com a banca definida, já é possível estudar o estilo de cobrança da organizadora enquanto o edital é finalizado.':'A oportunidade ainda está em acompanhamento. Use os dados como sinal de planejamento, não como cronograma definitivo.'}</p></div>
      <div class="contest-detail-footer"><span>${esc(updated(c.atualizado_em))}</span>${c.fonte_url?'<button type="button" id="contest-source-btn">Abrir fonte acompanhada ↗</button>':''}</div>
      <p class="contest-detail-disclaimer">Informações de acompanhamento. Datas, vagas, requisitos e remuneração devem ser confirmados no edital e nos canais oficiais do órgão.</p>`;
    const source=document.querySelector('#contest-source-btn');if(source)source.onclick=()=>window.open(c.fonte_url,'_blank','noopener,noreferrer');
    modal.classList.add('open');
  }

  async function load(){
    try{const r=await fetch(`${URL}/rest/v1/concursos?select=*&order=destaque.desc,atualizado_em.desc&limit=80`,{headers:{apikey:KEY,Authorization:`Bearer ${KEY}`}});if(r.ok)rows=await r.json()}catch(_){ }
    injectModal();decorate();
    const target=document.querySelector('#featured')?.parentElement||document.body;
    const observer=new MutationObserver(()=>decorate());observer.observe(target,{childList:true,subtree:true});
    const all=document.querySelector('#all-contests');if(all)observer.observe(all,{childList:true,subtree:true});
  }
  load();
})();