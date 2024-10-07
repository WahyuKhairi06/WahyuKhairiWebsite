const cache_name = 'v1';
const cache_assets = [
    'index.html',
    'contact.html',
    'about.html',
    'offline.html',
    'apps.js', 
    'style.css',

];

// Install event
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installed');
    event.waitUntil(
        caches.open(cache_name)
            .then((cache) => {
                console.log('Service Worker: Caching Files');
                return cache.addAll(cache_assets);
            })
            .catch((error) => {
                console.error('Error caching assets:', error);
            }) 
    );
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');
    event.waitUntil(
        caches.keys().then(
            (cacheNames) => {
                return Promise.all(
                    cacheNames.map(
                        (cache) => {
                            if (cache !== cache_name) {
                                console.log('Service Worker: Clearing Old Cache');
                                return caches.delete(cache);
                            }
                        }
                    )
                );
            }
        )
    );
});

// Fetch event
self.addEventListener('fetch', (event) => {
    console.log('Service Worker: Fetching', event.request.url);
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return the cached response if available
            if (response) {
                return response;
            }
            // Fetch the request if not cached
            return fetch(event.request).catch(() => {
                // If the request is for a HTML page, return offline.html
                if (event.request.headers.get('accept').includes('text/html')) {
                    return caches.match('offline.html');
                }
            });
        })
    );
});