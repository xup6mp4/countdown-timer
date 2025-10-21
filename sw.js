// sw.js — 倒數計時器的簡易離線快取設定
const CACHE_NAME = 'countdown-cache-v1';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest'
  // 若你有圖示檔案，也可加進來：
  // './icons/icon-192.png',
  // './icons/icon-512.png'
];

// 安裝階段：快取核心檔案
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

// 啟用階段：刪除舊版快取
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

// 取得階段：網頁優先策略（HTML 先試網路，其他先試快取）
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.mode === 'navigate') {
    // HTML 頁面：優先抓新版本，若失敗再用快取
    event.respondWith(
      fetch(req).then(r => {
        const copy = r.clone();
        caches.open(CACHE_NAME).then(c => c.put('./index.html', copy));
        return r;
      }).catch(() => caches.match('./index.html'))
    );
  } else {
    // 其他資源：快取優先
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(r => {
        const copy = r.clone();
        caches.open(CACHE_NAME).then(c => c.put(req, copy));
        return r;
      }))
    );
  }
});
