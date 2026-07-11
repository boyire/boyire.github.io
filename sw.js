const CACHE_PREFIX = 'project-lab-';
const CACHE_VERSION = 'project-lab-20260710-v1';
const PRECACHE = `${CACHE_VERSION}-precache`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const PRECACHE_URLS = [
  '/',
  '/offline.html',
  '/css/bootstrap.min.css',
  '/css/hux-blog.min.css',
  '/css/portfolio.css',
  '/css/syntax.css',
  '/js/jquery.min.js',
  '/js/bootstrap.min.js',
  '/js/hux-blog.min.js',
  '/js/portfolio-effects.js',
  '/pwa/manifest.json'
];

const isNavigationRequest = (request) => request.mode === 'navigate';
const isCacheable = (response) => response && response.ok && response.type === 'basic';

const cacheResponse = async (cacheName, request, response) => {
  if (isCacheable(response)) {
    const cache = await caches.open(cacheName);
    await cache.put(request, response.clone());
  }
  return response;
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
        .then((keys) => Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX) && key !== PRECACHE && key !== RUNTIME_CACHE)
            .map((key) => caches.delete(key))
        ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  if (new URL(event.request.url).origin !== self.location.origin) return;

  if (isNavigationRequest(event.request)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => cacheResponse(RUNTIME_CACHE, event.request, response))
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match('/offline.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => (
      cached || fetch(event.request).then((response) => cacheResponse(RUNTIME_CACHE, event.request, response))
    ))
  );
});
