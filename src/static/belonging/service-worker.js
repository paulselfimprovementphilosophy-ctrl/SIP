const CACHE='sip-book-of-belonging-v1-4-title-size-color-sipsite';
const CORE=[
  "./",
  "./index.html",
  "./assets/css/styles.css?v=1.4.0",
  "./assets/js/app.js?v=1.4.0",
  "./assets/data/campaigns.json",
  "./manifest.webmanifest?v=1.4.0",
  "./assets/img/sip-logo.png",
  "./assets/img/icon-192.png",
  "./assets/img/icon-512.png",
  "./assets/img/first-date.webp",
  "./assets/img/baby-shower.webp",
  "./assets/img/executive-social.webp",
  "./assets/img/family-reunion.webp",
  "./assets/img/girls-night.webp",
  "./assets/img/graduate-celebration.webp",
  "./assets/img/doctors-after-hours.webp",
  "./assets/img/friday-no-hangover.webp",
  "./assets/img/promotion-dinner.webp"
];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)))});
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==CACHE)await caches.delete(k);await self.clients.claim()})()));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith((async()=>{const c=await caches.open(CACHE);try{const r=await fetch(e.request,{cache:'no-store'});if(r&&r.ok)c.put(e.request,r.clone());return r}catch{return(await c.match(e.request))||(e.request.mode==='navigate'?c.match('./index.html'):Response.error())}})())});