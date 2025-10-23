// sw.js
const CACHE = 'countdown-timer-v3';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) =>
      cache.addAll([
        './',
        './index.html',
        './manifest.webmanifest?v=3',
        './icons/icon-180.png',
        './icons/icon-192.png',
        './icons/icon-512.png',
      ])
    )
  );
  self.skipWaiting(); // 立刻切換到新 SW
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim(); // 立刻接管現有頁面
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
});
