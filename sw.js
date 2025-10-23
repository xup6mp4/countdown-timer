// sw.js  v4 強制更新版
const CACHE = 'countdown-timer-v4';
const ASSETS = [
  './',
  './index.html?v=4',
  './manifest.webmanifest?v=4',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting(); // 立刻啟用新 SW
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim(); // 立刻接管開啟中的頁面
});
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request, { ignoreSearch: false }).then((resp) => resp || fetch(e.request))
  );
});
