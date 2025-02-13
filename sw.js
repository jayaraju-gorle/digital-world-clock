const CACHE_NAME = 'global-clock-v1';
const ASSETS_TO_CACHE = [
    '/digital-world-clock/',
    '/digital-world-clock/index.html',
    '/digital-world-clock/styles.css',
    '/digital-world-clock/script.js',
    '/digital-world-clock/offline.html', // Ensure this is included
    'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap'
];

// Install Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cache opened');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .catch((error) => {
                console.error('Cache addAll failed: ', error);
            })
    );
});

// Fetch Event: Serve cached assets or fetch from network
self.addEventListener('fetch', (event) => {
    console.log('Fetching: ', event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    console.log('Serving from cache: ', event.request.url);
                    return response;
                }
                console.log('Fetching from network: ', event.request.url);
                return fetch(event.request)
                    .catch(() => {
                        console.log('Offline: Serving offline.html');
                        return caches.match('/digital-world-clock/offline.html');
                    });
            })
    );
});

// Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (!cacheWhitelist.includes(cacheName)) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
    );
});