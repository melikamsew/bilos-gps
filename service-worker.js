const CACHE_NAME = "gps-events-cache-v1";
const urlsToCache = [
  "index.html",
  "result.html",
  "bilos.png",
  "manifest.json",
  "service-worker.js",
  "icons/bilos-800.png",
  "icons/icon-512.png"
];

// Install: cache all needed files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activate: clean up old caches if cache name changed
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

// Fetch: serve from cache, fallback to network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
