self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('countdown-timer-v1').then((cache) => {
      return cache.addAll([
        './',
        './index.html',
        './manifest.webmanifest',
        './icons/icon-180.png',
        './icons/icon-192.png',
        './icons/icon-512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
