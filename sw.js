// sw.js
const CACHE_NAME = 'global-clock-v2';
const BASE_PATH = '/digital-world-clock';

// Add BASE_PATH to all assets except external URLs
const ASSETS_TO_CACHE = [
    `${BASE_PATH}/`,
    `${BASE_PATH}/index.html`,
    `${BASE_PATH}/styles.css`,
    `${BASE_PATH}/script.js`,
    `${BASE_PATH}/offline.html`,
    `${BASE_PATH}/favicon.ico`,
    'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap'
];

// Helper function to check if a URL is from our own origin
function isOurOrigin(url) {
    return url.startsWith(self.location.origin);
}

self.addEventListener('install', (event) => {
    console.log('[SW] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Caching app shell');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    console.log('[SW] Activating...');
    event.waitUntil(
        Promise.all([
            caches.keys().then(keys => Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        console.log('[SW] Removing old cache:', key);
                        return caches.delete(key);
                    }
                })
            )),
            self.clients.claim()
        ])
    );
});

self.addEventListener('fetch', (event) => {
    console.log('[SW] Fetch:', event.request.url);

    // Handle only GET requests
    if (event.request.method !== 'GET') return;

    event.respondWith(
        (async () => {
            try {
                // Try to get from cache first
                const cache = await caches.open(CACHE_NAME);
                const cachedResponse = await cache.match(event.request);
                
                if (cachedResponse) {
                    console.log('[SW] Serving from cache:', event.request.url);
                    return cachedResponse;
                }

                // If not in cache, try network
                try {
                    const networkResponse = await fetch(event.request);
                    
                    // Cache successful responses from our origin
                    if (networkResponse.ok && isOurOrigin(event.request.url)) {
                        console.log('[SW] Caching new resource:', event.request.url);
                        cache.put(event.request, networkResponse.clone());
                    }
                    
                    return networkResponse;
                } catch (fetchError) {
                    console.log('[SW] Fetch failed, serving offline page');
                    
                    // For navigation requests (HTML pages), serve the offline page
                    if (event.request.mode === 'navigate') {
                        const offlineResponse = await cache.match(`${BASE_PATH}/offline.html`);
                        if (offlineResponse) {
                            return offlineResponse;
                        }
                    }
                    
                    throw fetchError;
                }
            } catch (error) {
                console.error('[SW] Error:', error);
                throw error;
            }
        })()
    );
});