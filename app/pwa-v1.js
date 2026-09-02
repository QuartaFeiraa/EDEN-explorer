(() => {
  'use strict';
  const root=document.documentElement;

  function secureContextForPwa(){
    return location.protocol==='https:'||['localhost','127.0.0.1','::1'].includes(location.hostname);
  }

  async function register(){
    if(!('serviceWorker' in navigator)||!secureContextForPwa()){
      root.dataset.rumoPwa='unsupported';
      return null;
    }
    try{
      root.dataset.rumoPwa='registering';
      const registration=await navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'});
      root.dataset.rumoPwa='ready';
      return registration;
    }catch(error){
      root.dataset.rumoPwa='degraded';
      console.warn('RUMO PWA indisponível',error?.message||error);
      return null;
    }
  }

  const ready=document.readyState==='complete'?register():new Promise(resolve=>{
    addEventListener('load',()=>register().then(resolve),{once:true});
  });
  window.RUMO_PWA={ready,register};
})();
