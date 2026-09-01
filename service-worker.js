const STATIC_CACHE='eden-rumo-static-v2';
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
  // Never cache HTML/JS/CSS: the newest tested release must always win.
  if(req.mode==='navigate'||/\.(?:js|css|html)$/.test(url.pathname))return;
  if(STATIC_FILES.some(x=>url.pathname.endsWith(x.replace('./','/')))){
    event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(res=>{const copy=res.clone();caches.open(STATIC_CACHE).then(c=>c.put(req,copy));return res})));
  }
});

self.addEventListener('push',event=>{
  let data={};
  try{data=event.data?.json?.()||{}}catch(_){data={body:event.data?.text?.()||''}}
  const title=data.title||'RUMO';
  const options={
    body:data.body||'Seu próximo passo de estudo está pronto.',
    icon:'./favicon.svg',
    badge:'./favicon.svg',
    tag:data.tag||'rumo-reminder',
    renotify:false,
    data:{url:data.url||'./'}
  };
  event.waitUntil(self.registration.showNotification(title,options));
});

self.addEventListener('notificationclick',event=>{
  event.notification.close();
  const target=new URL(event.notification?.data?.url||'./',self.location.origin).href;
  event.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(async clients=>{
    const same=clients.find(c=>c.url.startsWith(self.location.origin));
    if(same){if('navigate'in same)await same.navigate(target);return same.focus()}
    return self.clients.openWindow(target);
  }));
});
