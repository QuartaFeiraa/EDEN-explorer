(() => {
  'use strict';
  const loaded=new Map();
  const addCss=href=>{if(document.querySelector(`link[href^="${href}"]`))return;const l=document.createElement('link');l.rel='stylesheet';l.href=`${href}?v=2`;document.head.appendChild(l)};
  const loadScript=src=>{if(loaded.has(src))return loaded.get(src);const p=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=`${src}?v=2`;s.async=true;s.onload=()=>resolve(s);s.onerror=reject;document.body.appendChild(s)});loaded.set(src,p);return p};
  addCss('./v2.css');addCss('./core-v1.css');addCss('./radar-v3.css');

  async function boot(){
    try{
      await window.RUMO_SDK_READY;
      await loadScript('./app/core.js');
      // Critical features download in parallel instead of a ten-file waterfall.
      await Promise.all([
        loadScript('./app/account.js'),
        loadScript('./app/engine.js'),
        loadScript('./app/schedule-guard.js'),
        loadScript('./app/session.js'),
        loadScript('./app/reviews.js'),
        loadScript('./app/assistant.js'),
        loadScript('./app/edital.js')
      ]);
      await window.RUMO.sync();
      document.documentElement.dataset.rumoVersion='2-fast';
      document.dispatchEvent(new CustomEvent('rumo:booted'));
    }catch(err){console.error('RUMO boot failed',err);document.documentElement.dataset.rumoBoot='error'}
  }

  // Radar waits for the single contest request already started by script.js.
  Promise.resolve(window.RUMO_CONTESTS_READY).finally(()=>loadScript('./radar-v3.js').catch(()=>{}));

  let coursesReady=null;
  const loadCourses=()=>coursesReady||(coursesReady=loadScript('./app/courses.js'));
  document.addEventListener('rumo:tab',e=>{if(e.detail?.id==='essenciais')loadCourses().catch(()=>{})});
  document.addEventListener('click',e=>{const card=e.target.closest?.('#course-grid [data-course]');if(card&&!window.RUMO_COURSES){e.preventDefault();e.stopImmediatePropagation();loadCourses().then(()=>window.RUMO_COURSES?.open(card.dataset.course)).catch(()=>{})}},true);

  const idle=window.requestIdleCallback||((fn)=>setTimeout(fn,1200));
  idle(()=>{loadCourses().catch(()=>{});loadScript('./app/billing.js').catch(()=>{})},{timeout:3500});
  boot();
})();