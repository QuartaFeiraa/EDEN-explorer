(() => {
  'use strict';

  const titles={hoje:'Visão de hoje',concursos:'Radar de concursos',meu:'Meu concurso',revisoes:'Revisões',essenciais:'Essenciais',ia:'Assistente IA'};
  const icons={
    hoje:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10.8 12 4l8 6.8"/><path d="M6.5 9.8V20h11V9.8"/><path d="M9.5 20v-5.5h5V20"/></svg>',
    concursos:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="3"/><path d="M12 2.5v2M21.5 12h-2M12 21.5v-2M2.5 12h2"/></svg>',
    meu:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3.5" width="14" height="17" rx="2.5"/><path d="M9 3.5h6v3H9zM8.5 11.5l2 2 4.5-4.5M8.5 17h7"/></svg>',
    revisoes:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 7v5h-5"/><path d="M19.2 12a7.2 7.2 0 1 1-2.1-5.1"/><path d="M12 8.5V12l2.2 1.4"/></svg>',
    essenciais:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2c.7 3 2.3 4.6 5.3 5.3-3 .7-4.6 2.3-5.3 5.3-.7-3-2.3-4.6-5.3-5.3 3-.7 4.6-2.3 5.3-5.3Z"/><path d="M18.2 14.3c.4 1.8 1.4 2.8 3.2 3.2-1.8.4-2.8 1.4-3.2 3.2-.4-1.8-1.4-2.8-3.2-3.2 1.8-.4 2.8-1.4 3.2-3.2Z"/></svg>',
    ia:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6.5" width="16" height="12" rx="4"/><path d="M9 11h.01M15 11h.01M9 15h6M12 6.5V3.8M10.5 3.8h3"/></svg>',
    more:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="5" width="4.5" height="4.5" rx="1.2"/><rect x="14.5" y="5" width="4.5" height="4.5" rx="1.2"/><rect x="5" y="14.5" width="4.5" height="4.5" rx="1.2"/><rect x="14.5" y="14.5" width="4.5" height="4.5" rx="1.2"/></svg>',
    pro:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.2 4.7L19 9.9l-3.5 3.6.8 5.1L12 16.2l-4.3 2.4.8-5.1L5 9.9l4.8-2.2L12 3Z"/></svg>'
  };

  const context=document.querySelector('#top-context-title');
  const dock=[...document.querySelectorAll('[data-dock-tab]')];

  function upgradeIcons(){
    document.querySelectorAll('.sidebar .nav[data-tab]').forEach(btn=>{
      const target=btn.querySelector('.nav-icon');
      if(target&&icons[btn.dataset.tab])target.innerHTML=icons[btn.dataset.tab];
    });
    dock.forEach(btn=>{if(icons[btn.dataset.dockTab])btn.querySelector('svg')?.replaceWith(svgNode(icons[btn.dataset.dockTab]));});
    const more=document.querySelector('[data-dock-menu]');
    if(more){
      const old=more.querySelector('svg');
      if(old)old.replaceWith(svgNode(icons.more));
    }
  }
  function svgNode(markup){const t=document.createElement('template');t.innerHTML=markup.trim();return t.content.firstElementChild}

  function setActive(id){
    if(context)context.textContent=titles[id]||'RUMO';
    document.querySelectorAll('.sidebar .nav').forEach(n=>{
      const active=n.dataset.tab===id;n.classList.toggle('active',active);
      if(active)n.setAttribute('aria-current','page');else n.removeAttribute('aria-current');
    });
    dock.forEach(b=>{
      const active=b.dataset.dockTab===id;b.classList.toggle('active',active);
      if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');
    });
  }

  function switchTab(id){
    if(window.RUMO_SHELL?.switchTab)window.RUMO_SHELL.switchTab(id);
    else document.querySelector(`.sidebar .nav[data-tab="${id}"]`)?.click();
  }

  dock.forEach(btn=>btn.addEventListener('click',()=>switchTab(btn.dataset.dockTab)));

  function injectMoreSheet(){
    if(document.querySelector('#rumo-more-sheet'))return;
    document.body.insertAdjacentHTML('beforeend',`
      <div class="rumo-more-backdrop" id="rumo-more-backdrop" aria-hidden="true"></div>
      <section class="rumo-more-sheet" id="rumo-more-sheet" aria-label="Mais opções" aria-hidden="true">
        <div class="rumo-more-title"><span>Mais no RUMO</span><span>⋯</span></div>
        <div class="rumo-more-grid">
          <button class="rumo-more-action" data-more-tab="essenciais">${icons.essenciais}<span>Essenciais</span></button>
          <button class="rumo-more-action" data-more-tab="ia">${icons.ia}<span>Assistente IA</span></button>
          <button class="rumo-more-action rumo-more-pro" data-more-pro>${icons.pro}<span>Conhecer o RUMO Pro</span></button>
        </div>
        <div class="rumo-more-meta">
          <div class="rumo-more-brand"><img src="./eden-mark.svg" alt=""><span>eden</span></div>
          <div class="rumo-more-links"><a href="./privacidade.html">Privacidade</a><a href="./termos.html">Termos</a></div>
        </div>
      </section>`);
    const sheet=document.querySelector('#rumo-more-sheet'),backdrop=document.querySelector('#rumo-more-backdrop');
    const open=()=>{sheet.classList.add('open');backdrop.classList.add('open');sheet.setAttribute('aria-hidden','false');backdrop.setAttribute('aria-hidden','false')};
    const close=()=>{sheet.classList.remove('open');backdrop.classList.remove('open');sheet.setAttribute('aria-hidden','true');backdrop.setAttribute('aria-hidden','true')};
    const oldMore=document.querySelector('[data-dock-menu]');
    if(oldMore){const replacement=oldMore.cloneNode(true);oldMore.replaceWith(replacement);replacement.addEventListener('click',open)}
    backdrop.addEventListener('click',close);
    sheet.querySelectorAll('[data-more-tab]').forEach(b=>b.addEventListener('click',()=>{close();switchTab(b.dataset.moreTab)}));
    sheet.querySelector('[data-more-pro]')?.addEventListener('click',()=>{close();document.querySelector('#upgrade-btn')?.click()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  }

  upgradeIcons();
  injectMoreSheet();
  document.addEventListener('rumo:tab',e=>setActive(e.detail?.id));
  setActive(document.querySelector('.page.active')?.id||'hoje');
})();
