(() => {
  'use strict';
  const RELEASE='11-prod';
  const loaded=new Map();
  const addCss=href=>{if(document.querySelector(`link[href^="${href}"]`))return;const l=document.createElement('link');l.rel='stylesheet';l.href=`${href}?v=${RELEASE}`;document.head.appendChild(l)};
  const loadScript=src=>{if(loaded.has(src))return loaded.get(src);const p=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=`${src}?v=${RELEASE}`;s.async=true;s.onload=()=>resolve(s);s.onerror=()=>reject(new Error(`Falha ao carregar ${src}`));document.body.appendChild(s)});loaded.set(src,p);return p};

  addCss('./v2.css');
  addCss('./core-v1.css');
  addCss('./radar-v3.css');
  addCss('./product-v1.css');
  addCss('./integrations-v1.css');
  addCss('./content-v1.css');
  addCss('./navigation-v3.css');

  async function boot(){
    try{
      document.documentElement.dataset.rumoBoot='loading';
      document.documentElement.dataset.rumoData='loading';
      await window.RUMO_SDK_READY;
      await loadScript('./app/core-v2.js');
      await loadScript('./app/ui-v3.js');

      await Promise.all([
        loadScript('./app/account.js'),
        loadScript('./app/engine-v2.js'),
        loadScript('./app/schedule-guard.js'),
        loadScript('./app/session.js'),
        loadScript('./app/reviews.js')
      ]);

      document.documentElement.dataset.rumoVersion=RELEASE;
      document.documentElement.dataset.rumoBoot='ready';
      document.dispatchEvent(new CustomEvent('rumo:booted'));

      Promise.allSettled([
        loadScript('./app/analytics-v1.js'),
        loadScript('./app/assistant.js'),
        loadScript('./app/edital.js'),
        loadScript('./app/account-extras-v3.js'),
        loadScript('./app/account-privacy-v1.js'),
        loadScript('./app/history-v1.js'),
        loadScript('./app/product-v1.js'),
        loadScript('./app/integrations-v1.js'),
        loadScript('./app/billing-v2.js'),
        loadScript('./app/push-v1.js')
      ]).then(results=>{
        const failed=results.filter(x=>x.status==='rejected');
        if(failed.length)console.warn('RUMO optional modules degraded',failed.map(x=>x.reason));
      });

      const timeout=new Promise((_,reject)=>setTimeout(()=>reject(new Error('Sincronização excedeu 8s')),8000));
      Promise.race([window.RUMO.sync(true),timeout])
        .then(()=>{document.documentElement.dataset.rumoData='ready';document.dispatchEvent(new CustomEvent('rumo:data-ready'))})
        .catch(err=>{console.warn('RUMO data sync degraded',err);document.documentElement.dataset.rumoData='degraded';document.dispatchEvent(new CustomEvent('rumo:data-degraded'))});
    }catch(err){
      console.error('RUMO boot failed',err);
      document.documentElement.dataset.rumoBoot='error';
      document.documentElement.dataset.rumoData='degraded';
    }
  }

  Promise.resolve(window.RUMO_CONTESTS_READY)
    .catch(()=>[])
    .finally(()=>loadScript('./app/radar-v2.js').catch(err=>console.warn('Radar indisponível',err)));

  let contentReady=null;
  const loadContent=()=>contentReady||(contentReady=loadScript('./app/content-v1.js'));
  const closeCourse=()=>document.querySelector('#course-modal')?.classList.remove('open');
  document.querySelector('#close-course')?.addEventListener('click',closeCourse);
  document.querySelector('#course-modal')?.addEventListener('click',e=>{if(e.target?.id==='course-modal')closeCourse()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.querySelector('#course-modal.open'))closeCourse()});
  document.addEventListener('rumo:tab',e=>{if(e.detail?.id==='essenciais')loadContent().catch(()=>{})});
  document.addEventListener('click',e=>{const card=e.target.closest?.('#course-grid [data-course]');if(card&&!window.RUMO_CONTENT){e.preventDefault();e.stopImmediatePropagation();loadContent().then(()=>window.RUMO_CONTENT?.open(card.dataset.course)).catch(()=>{})}},true);

  boot();
})();
