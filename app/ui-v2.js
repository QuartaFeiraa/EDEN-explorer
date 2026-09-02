(() => {
  'use strict';

  const ensureCss=(href,version='1')=>{
    if(document.querySelector(`link[href^="${href}"]`))return;
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href=`${href}?v=${version}`;
    document.head.appendChild(link);
  };

  ensureCss('./eden-brand-exact.css','1');
  ensureCss('./navigation-refine-v1.css','1');

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
      if(active)n.setAttribute('aria-current','page');
      else n.removeAttribute('aria-current');
    });
  }

  document.addEventListener('rumo:tab',e=>setActive(e.detail?.id));
  setActive(document.querySelector('.page.active')?.id||'hoje');
})();
