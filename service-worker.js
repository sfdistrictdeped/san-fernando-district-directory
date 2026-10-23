const CACHE_NAME = 'sfd-one-directory-v1.0-autobook-path-fix';
const CACHE_PREFIX = 'sfd-one-directory-';
const APP_SCOPE = '/san-fernando-district-onedirectory/';
const APP_SHELL = [
  APP_SCOPE,
  APP_SCOPE + 'index.html',
  APP_SCOPE + 'district-favicon.png',
  APP_SCOPE + 'manifest.json',
  APP_SCOPE + 'icons/icon-192.png',
  APP_SCOPE + 'icons/icon-512.png',
  APP_SCOPE + 'autotarp-logo.png',
  APP_SCOPE + 'autobook-logo.png',
  APP_SCOPE + 'sdo-masbate-logo.png',
  APP_SCOPE + 'region-v-logo.png',
  APP_SCOPE + 'sf-district-logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(APP_SCOPE)) return;

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
      const response = await fetch(request);
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      }
      return response;
    } catch (error) {
      if (request.mode === 'navigate') {
        return (await caches.match(APP_SCOPE + 'index.html')) || Response.error();
      }
      return Response.error();
    }
  })());
});
