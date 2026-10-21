const CACHE_NAME = "autotarp-shell-v1-2-2";
const CACHE_PREFIX = "autotarp-shell-";
const APP_SHELL = ["./", "./index.html", "./AutoTarp.html", "./manifest.json", "./assets/autotarp-logo.png", "./assets/icon-192.png", "./assets/icon-512.png", "./assets/san-fernando-district-logo.png"];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cached = await caches.match(event.request);
    if (cached) return cached;
    try {
      const response = await fetch(event.request);
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      }
      return response;
    } catch (error) {
      if (event.request.mode === "navigate") return (await caches.match("./index.html")) || (await caches.match("./"));
      throw error;
    }
  })());
});
