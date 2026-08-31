(() => {
  'use strict';
  const RELEASE='8-fix';
  const loaded=new Map();
  const addCss=href=>{if(document.querySelector(`link[href^="${href}"]`))return;const l=document.createElement('link');l.rel='stylesheet';l.href=`${href}?v=${RELEASE}`;document.head.appendChild(l)};
  const loadScript=src=>{if(loaded.has(src))return loaded.get(src);const p=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=`${src}?v=${RELEASE}`;s.async=true;s.onload=()=>resolve(s);s.onerror=()=>reject(new Error(`Falha ao carregar ${src}`));document.body.appendChild(s)});loaded.set(src,p);return p};

  addCss('./v2.css');
  addCss('./core-v1.css');
  addCss('./radar-v3.css');

  async function boot(){
    try{
      await window.RUMO_SDK_READY;
      await loadScript('./app/core-v2.js');
      await Promise.all([
        loadScript('./app/account.js'),
        loadScript('./app/engine-v2.js'),
        loadScript('./app/schedule-guard.js'),
        loadScript('./app/session.js'),
        loadScript('./app/reviews.js'),
        loadScript('./app/assistant.js'),
        loadScript('./app/edital.js')
      ]);

      document.documentElement.dataset.rumoVersion=RELEASE;
      document.documentElement.dataset.rumoBoot='ready';
      document.dispatchEvent(new CustomEvent('rumo:booted'));

      const timeout=new Promise((_,reject)=>setTimeout(()=>reject(new Error('Sincronização excedeu 8s')),8000));
      Promise.race([window.RUMO.sync(true),timeout])
        .then(()=>{document.documentElement.dataset.rumoData='ready'})
        .catch(err=>{console.warn('RUMO data sync degraded',err);document.documentElement.dataset.rumoData='degraded'});
    }catch(err){
      console.error('RUMO boot failed',err);
      document.documentElement.dataset.rumoBoot='error';
    }
  }

  Promise.resolve(window.RUMO_CONTESTS_READY).finally(()=>loadScript('./app/radar.js').catch(()=>{}));

  // Essenciais is truly lazy. It must never consume the dashboard's main
  // thread unless the user actually enters the course area.
  let coursesReady=null;
  const loadCourses=()=>coursesReady||(coursesReady=loadScript('./app/courses.js'));
  document.addEventListener('rumo:tab',e=>{if(e.detail?.id==='essenciais')loadCourses().catch(()=>{})});
  document.addEventListener('click',e=>{const card=e.target.closest?.('#course-grid [data-course]');if(card&&!window.RUMO_COURSES){e.preventDefault();e.stopImmediatePropagation();loadCourses().then(()=>window.RUMO_COURSES?.open(card.dataset.course)).catch(()=>{})}},true);

  const idle=window.requestIdleCallback||((fn)=>setTimeout(fn,1200));
  idle(()=>loadScript('./app/billing.js').catch(()=>{}),{timeout:3500});
  boot();
})();