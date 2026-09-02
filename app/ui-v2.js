(() => {
  'use strict';

  if(!document.querySelector('link[href^="./eden-brand-exact.css"]')){
    const brandCss=document.createElement('link');
    brandCss.rel='stylesheet';
    brandCss.href='./eden-brand-exact.css?v=1';
    document.head.appendChild(brandCss);
  }

  const titles={
    hoje:'Visão de hoje',
    concursos:'Radar de concursos',
    meu:'Meu concurso',
    revisoes:'Revisões',
    essenciais:'Essenciais',
    ia:'Assistente IA'
  };

  const context=document.querySelector('#top-context-title');
  function setActive(id){
    if(context)context.textContent=titles[id]||'RUMO';
    document.querySelectorAll('.sidebar .nav').forEach(n=>{
      const active=n.dataset.tab===id;
      if(active)n.setAttribute('aria-current','page');else n.removeAttribute('aria-current');
    });
  }

  document.addEventListener('rumo:tab',e=>setActive(e.detail?.id));
  setActive(document.querySelector('.page.active')?.id||'hoje');
})();
