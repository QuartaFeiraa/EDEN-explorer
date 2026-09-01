const STATIC_CACHE='eden-rumo-static-v1';
const STATIC_FILES=['./favicon.svg','./manifest.webmanifest'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(STATIC_CACHE).then(cache=>cache.addAll(STATIC_FILES)).catch(()=>{}).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==STATIC_CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});

self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin)return;
  // Never cache HTML/JS/CSS: during beta the newest release must always win.
  if(req.mode==='navigate'||/\.(?:js|css|html)$/.test(url.pathname))return;
  if(STATIC_FILES.some(x=>url.pathname.endsWith(x.replace('./','/')))){
    event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(res=>{const copy=res.clone();caches.open(STATIC_CACHE).then(c=>c.put(req,copy));return res})));
  }
});

self.addEventListener('notificationclick',event=>{
  event.notification.close();
  event.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(clients=>{
    const open=clients.find(c=>'focus'in c);
    return open?open.focus():self.clients.openWindow('./');
  }));
});
