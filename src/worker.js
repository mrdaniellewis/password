/* eslint-env serviceworker */
/* eslint no-restricted-globals: "off" */

const cacheName = 'cache-1';

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    await cache.add('/');
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    await cache.add('https://cdn.polyfill.io/v2/polyfill.min.js');
  })());
});

self.addEventListener('fetch', (event) => {
  event.respondWith((async () => {
    const result = await caches.match(event.request.url);
    if (result) {
      Promise.resolve().then(async () => {
        const cache = await caches.open(cacheName);
        cache.add(event.request.url);
      });
    }
    return result || fetch(event.request.url);
  })());
});
