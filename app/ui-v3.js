(() => {
  'use strict';

  const titles={hoje:'Visão de hoje',concursos:'Radar de concursos',meu:'Meu concurso',revisoes:'Revisões',essenciais:'Essenciais',ia:'Assistente IA'};
  const icons={
    hoje:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 11.2 12 4l8.5 7.2"/><path d="M6 10v10h12V10"/><path d="M9.5 20v-5.8h5V20"/></svg>',
    concursos:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="3"/><path d="M12 2.5v2M21.5 12h-2M12 21.5v-2M2.5 12h2"/></svg>',
    meu:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.5h8l4 4V20.5H6z"/><path d="M14 3.5v4h4M9 12h6M9 16h5"/></svg>',
    revisoes:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6.5v5h-5"/><path d="M19.2 11.5a7.4 7.4 0 1 1-2.2-5"/><path d="M12 8.2V12l2.4 1.5"/></svg>',
    essenciais:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 5.5A3.5 3.5 0 0 1 8 2h4v18H8a3.5 3.5 0 0 0-3.5 3z"/><path d="M19.5 5.5A3.5 3.5 0 0 0 16 2h-4v18h4a3.5 3.5 0 0 1 3.5 3z"/></svg>',
    ia:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6.5" width="16" height="12" rx="4"/><path d="M9 11h.01M15 11h.01M9 15h6M12 6.5V3.8M10.5 3.8h3"/></svg>'
  };

  const context=document.querySelector('#top-context-title');

  function upgradeIcons(){
    document.querySelectorAll('.sidebar .nav[data-tab]').forEach(btn=>{
      const target=btn.querySelector('.nav-icon');
      if(target&&icons[btn.dataset.tab])target.innerHTML=icons[btn.dataset.tab];
    });
  }

  function setActive(id){
    if(context)context.textContent=titles[id]||'RUMO';
    document.querySelectorAll('.sidebar .nav').forEach(n=>{
      const active=n.dataset.tab===id;
      n.classList.toggle('active',active);
      if(active)n.setAttribute('aria-current','page');else n.removeAttribute('aria-current');
    });
  }

  function setupMobileDrawer(){
    if(document.querySelector('.rumo-sidebar-backdrop-v3'))return;
    const backdrop=document.createElement('div');
    backdrop.className='rumo-sidebar-backdrop-v3';
    backdrop.setAttribute('aria-hidden','true');
    document.body.appendChild(backdrop);
    const sidebar=document.querySelector('.sidebar');
    const menu=document.querySelector('#menu');
    const sync=()=>{
      const open=sidebar?.classList.contains('open');
      backdrop.classList.toggle('open',!!open);
      backdrop.setAttribute('aria-hidden',open?'false':'true');
      menu?.setAttribute('aria-expanded',open?'true':'false');
    };
    menu?.setAttribute('aria-controls','rumo-sidebar');
    menu?.setAttribute('aria-expanded','false');
    sidebar?.setAttribute('id','rumo-sidebar');
    menu?.addEventListener('click',()=>requestAnimationFrame(sync));
    backdrop.addEventListener('click',()=>{sidebar?.classList.remove('open');sync()});
    document.querySelectorAll('.sidebar .nav').forEach(btn=>btn.addEventListener('click',()=>requestAnimationFrame(sync)));
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&sidebar?.classList.contains('open')){sidebar.classList.remove('open');sync()}});
  }

  upgradeIcons();
  setupMobileDrawer();
  document.addEventListener('rumo:tab',e=>setActive(e.detail?.id));
  setActive(document.querySelector('.page.active')?.id||'hoje');
})();
