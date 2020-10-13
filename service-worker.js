const CACHE_NAME = 'bae-cache';
const RESOURCES = [
    "public/images/finger.png",
    "public/images/fire.png",
    "public/images/flower.png",
    "public/images/heart.png",
    "public/images/lightning.png",
    "public/images/poop.png",
    "public/icons/favicon.ico",
    "public/icons/icon-192x192.png",
    "public/icons/icon-512x512.png",
    "index.html",
    "/",
    "manifest.json"
];

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheName) {
            return caches.delete(cacheName);
        }).then(function (_) {
            return caches.open(CACHE_NAME);
        }).then(function (cache) {
            return cache.addAll(RESOURCES);
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});