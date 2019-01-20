/* eslint-env serviceworker */
/* eslint no-restricted-globals: "off" */

const cacheName = 'password-cache-1';
const cacheDomains = [self.location.origin, 'https://cdn.polyfill.io'];

self.addEventListener('fetch', (event) => {
  if (!cacheDomains.includes(new URL(event.request.url).origin)) {
    return;
  }
  event.respondWith((async () => {
    const result = await caches.match(event.request.url);
    Promise.resolve().then(async () => {
      const cache = await caches.open(cacheName);
      cache.add(event.request.url);
    });
    return result || fetch(event.request.url);
  })());
});
