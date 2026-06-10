const CACHE_VERSION = 'project-lab-20260610-v2';
const PRECACHE = `${CACHE_VERSION}-precache`;
const HOSTNAME_WHITELIST = [self.location.hostname];

const withCacheBust = (request) => {
  const url = new URL(request.url);
  url.protocol = self.location.protocol;
  url.search += `${url.search ? '&' : '?'}cache-bust=${Date.now()}`;
  return url.href;
};

const isNavigationRequest = (request) => (
  request.mode === 'navigate' ||
  (request.method === 'GET' && (request.headers.get('accept') || '').includes('text/html'))
);

const endsWithExtension = (request) => (
  Boolean(new URL(request.url).pathname.match(/\.\w+$/))
);

const shouldRedirect = (request) => (
  isNavigationRequest(request) &&
  new URL(request.url).pathname.substr(-1) !== '/' &&
  !endsWithExtension(request)
);

const getRedirectUrl = (request) => {
  const url = new URL(request.url);
  url.pathname += '/';
  return url.href;
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then((cache) => cache.add('/offline.html'))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const hostname = new URL(event.request.url).hostname;
  if (!HOSTNAME_WHITELIST.includes(hostname)) return;

  if (shouldRedirect(event.request)) {
    event.respondWith(Response.redirect(getRedirectUrl(event.request)));
    return;
  }

  if (isNavigationRequest(event.request)) {
    event.respondWith(
      fetch(withCacheBust(event.request), { cache: 'no-store' })
        .catch(() => caches.match('/offline.html'))
    );
    return;
  }

  event.respondWith(
    fetch(withCacheBust(event.request), { cache: 'no-store' })
      .catch(() => caches.match(event.request))
  );
});
