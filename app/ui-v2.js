(() => {
  'use strict';

  const titles={
    hoje:'Visão de hoje',
    concursos:'Radar de concursos',
    meu:'Meu concurso',
    revisoes:'Revisões',
    essenciais:'Essenciais',
    ia:'Assistente IA'
  };

  const context=document.querySelector('#top-context-title');
  const dock=[...document.querySelectorAll('[data-dock-tab]')];

  function setActive(id){
    if(context)context.textContent=titles[id]||'RUMO';
    document.querySelectorAll('.sidebar .nav').forEach(n=>{
      const active=n.dataset.tab===id;
      if(active)n.setAttribute('aria-current','page');else n.removeAttribute('aria-current');
    });
    dock.forEach(b=>{
      const active=b.dataset.dockTab===id;
      b.classList.toggle('active',active);
      if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');
    });
  }

  dock.forEach(btn=>btn.addEventListener('click',()=>{
    const id=btn.dataset.dockTab;
    if(window.RUMO_SHELL?.switchTab)window.RUMO_SHELL.switchTab(id);
    else document.querySelector(`.sidebar .nav[data-tab="${id}"]`)?.click();
  }));

  document.querySelector('[data-dock-menu]')?.addEventListener('click',()=>{
    const sidebar=document.querySelector('.sidebar');
    sidebar?.classList.add('open');
    requestAnimationFrame(()=>sidebar?.querySelector('.nav.active')?.focus({preventScroll:true}));
  });

  document.addEventListener('rumo:tab',e=>setActive(e.detail?.id));
  setActive(document.querySelector('.page.active')?.id||'hoje');
})();
