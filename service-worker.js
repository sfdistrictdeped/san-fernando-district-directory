/*
 * SFD OneDirectory service worker
 * Standalone PWA identity: /san-fernando-district-directory/
 * Cache is deliberately app-specific and scoped to this app's GitHub Pages path.
 */
const APP_SCOPE_PATH = new URL(self.registration.scope).pathname;
const CACHE_PREFIX = "sfd-one-directory-";
const CACHE_NAME = "sfd-one-directory-v1.0-identity-fix";

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./district-favicon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./autotarp-logo.png",
  "./sdo-masbate-logo.png",
  "./region-v-logo.png",
  "./sf-district-logo.png"
];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Install should fail visibly if a required app-shell file is missing.
    await cache.addAll(APP_SHELL);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
        .map(key => caches.delete(key))
    );
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const requestURL = new URL(request.url);
  if (requestURL.origin !== self.location.origin) return;

  // Do not intercept other GitHub Pages projects on the same origin.
  if (!requestURL.pathname.startsWith(APP_SCOPE_PATH)) return;

  // Keep navigation requests and static resources available offline.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;

    try {
      const response = await fetch(request);
      if (response && response.ok) {
        cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    } catch (error) {
      if (request.mode === "navigate") {
        return (await cache.match("./index.html")) || (await cache.match("./"));
      }
      throw error;
    }
  })());
});
