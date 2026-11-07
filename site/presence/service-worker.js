const CACHE = 'sip-book-of-presence-v6-5-flipbook-repair-sipsite';
const CORE = [
  './',
  './index.html',
  './assets/css/styles.css?v=6.5.0',
  './assets/js/app.js?v=6.5.0',
  './assets/img/sip-logo.png',
  './assets/img/promotion-ambient.jpg',
  './assets/img/girls-night-ambient.jpg',
  './assets/img/family-ambient.jpg',
  './assets/data/menu.json',
  './assets/img/01-presence.webp',
  './assets/img/02-clarity.webp',
  './assets/img/03-legacy.webp',
  './assets/img/04-renaissance.webp',
  './assets/img/05-the-sovereign.webp',
  './assets/img/06-midnight-gold.webp',
  './assets/img/07-quiet-authority.webp',
  './assets/img/08-afterglow.webp',
  './assets/img/09-grounded.webp',
  './assets/img/10-provision.webp',
  './assets/img/11-green-wisdom.webp',
  './assets/img/12-roots-and-reason.webp',
  './assets/img/13-first-light.webp',
  './assets/img/14-jubilee.webp',
  './assets/img/15-golden-hour.webp',
  './assets/img/16-celebration.webp',
  './assets/img/17-restore.webp',
  './assets/img/18-focus.webp',
  './assets/img/19-balance.webp',
  './assets/img/20-renewal.webp',
  './assets/img/21-velvet.webp',
  './assets/img/22-cocoa-ceremony.webp',
  './assets/img/23-harvest-moon.webp',
  './assets/img/24-sunday-best.webp',
  './manifest.webmanifest?v=6.5.0'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  try {
    const fresh = await fetch(request, { cache: 'no-store' });
    if (fresh && fresh.ok) cache.put(request, fresh.clone());
    return fresh;
  } catch (_) {
    return (await cache.match(request)) || (request.mode === 'navigate' ? cache.match('./index.html') : Response.error());
  }
}

async function imageCache(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  const update = fetch(request).then(response => {
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => null);
  return cached || update || Response.error();
}

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (event.request.destination === 'image') {
    event.respondWith(imageCache(event.request));
    return;
  }
  event.respondWith(networkFirst(event.request));
});
