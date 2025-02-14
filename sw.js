const CACHE_NAME = 'global-clock-v2'; // Increment version
const ASSETS_TO_CACHE = [
    '/digital-world-clock/',
    '/digital-world-clock/index.html',
    '/digital-world-clock/styles.css',
    '/digital-world-clock/script.js',
    '/digital-world-clock/offline.html',
    '/digital-world-clock/favicon.ico',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap'
];
const DEBUG = true;

// Helper function for logging
function swLog(message, ...args) {
    if (DEBUG) {
        console.log(`[Service Worker] ${message}`, ...args);
    }
}

self.addEventListener('install', (event) => {
    swLog('Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                swLog('Caching app shell...');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
    // Force activation
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    swLog('Activating...');
    event.waitUntil(
        Promise.all([
            // Clear old caches
            caches.keys().then(keys => Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        swLog('Removing old cache:', key);
                        return caches.delete(key);
                    }
                })
            )),
            // Take control of all pages immediately
            self.clients.claim()
        ])
    );
});

self.addEventListener('fetch', (event) => {
    swLog('Fetch event for:', event.request.url);
    
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        swLog('Skipping non-GET request:', event.request.method);
        return;
    }

    event.respondWith(
        (async () => {
            try {
                // Try the cache first
                const cachedResponse = await caches.match(event.request);
                if (cachedResponse) {
                    swLog('Serving from cache:', event.request.url);
                    return cachedResponse;
                }

                // If not in cache, try the network
                swLog('Fetching from network:', event.request.url);
                const networkResponse = await fetch(event.request);
                
                // Cache the network response for future
                const cache = await caches.open(CACHE_NAME);
                cache.put(event.request, networkResponse.clone());
                
                return networkResponse;
            } catch (error) {
                swLog('Fetch failed:', error);
                // Return offline page for navigation requests
                if (event.request.mode === 'navigate') {
                    const offlineResponse = await caches.match('offline.html');
                    if (offlineResponse) {
                        return offlineResponse;
                    }
                }
                throw error;
            }
        })()
    );
});