// sw.js — 倒數計時器的離線快取設定
const CACHE_NAME = 'countdown-cache-v1';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-180.png'
];

// 安裝階段：快取核心檔案
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)));
  self.skipWaiting();
});

// 啟用階段：清除舊快取
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

// 抓取階段：HTML 採用網路優先、其他資源採用快取優先
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(r => {
          const copy = r.clone();
          caches.open(CACHE_NAME).then(c => c.put('./index.html', copy));
          return r;
        })
        .catch(() => caches.match('./index.html'))
    );
  } else {
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(r => {
        const copy = r.clone();
        caches.open(CACHE_NAME).then(c => c.put(req, copy));
        return r;
      }))
    );
  }
});
