'use strict';

const CACHE_PREFIX='rumo-static-';
const CACHE_NAME=`${CACHE_PREFIX}v1`;
const PRECACHE=[
  './','./index.html','./manifest.webmanifest','./favicon.svg',
  './styles.css','./v2.css','./core-v1.css','./radar-v3.css','./product-v1.css',
  './script.js','./app/bootstrap.js','./app/core-v2.js','./app/security-normalize-v1.js','./app/account.js',
  './app/engine-v2.js','./app/schedule-guard.js','./app/session.js','./app/reviews.js',
  './app/assistant.js','./app/edital.js','./app/account-extras-v2.js','./app/history-v1.js',
  './app/product-v1.js','./app/data-rights-v1.js','./app/radar-v2.js','./app/courses-v2.js',
  './app/pwa-v1.js'
];
const STATIC_DESTINATIONS=new Set(['script','style','image','font','manifest']);

async function putIfCacheable(cache,request,response){
  if(response&&response.ok&&response.type!=='opaque'){
    await cache.put(request,response.clone()).catch(()=>{});
  }
  return response;
}

async function cached(cache,request){
  return cache.match(request,{ignoreSearch:true});
}

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE_NAME);
    await Promise.allSettled(PRECACHE.map(async path=>{
      const request=new Request(path,{cache:'reload'});
      const response=await fetch(request);
      if(response.ok)await cache.put(request,response);
    }));
  })());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const names=await caches.keys();
    await Promise.all(names.filter(name=>name.startsWith(CACHE_PREFIX)&&name!==CACHE_NAME).map(name=>caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  if(url.pathname.startsWith('/api/'))return;

  if(request.mode==='navigate'){
    event.respondWith((async()=>{
      const cache=await caches.open(CACHE_NAME);
      try{
        const response=await fetch(request);
        return await putIfCacheable(cache,request,response);
      }catch(_){
        return (await cached(cache,request))||(await cache.match('./index.html'))||(await cache.match('./'))||Response.error();
      }
    })());
    return;
  }

  if(!STATIC_DESTINATIONS.has(request.destination)&&!url.pathname.endsWith('.webmanifest'))return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE_NAME);
    try{
      const response=await fetch(request);
      return await putIfCacheable(cache,request,response);
    }catch(_){
      return (await cached(cache,request))||Response.error();
    }
  })());
});
