const CACHE_NAME = 'magazzino-v4';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icona-192.png',
  './icona-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aperta:', CACHE_NAME);
        return Promise.all(
          ASSETS_TO_CACHE.map(url => {
            return fetch(new Request(url, { cache: 'reload', mode: 'no-cors' }))
              .then(response => {
                if (!response.ok) throw new Error(`Failed to load ${url}`);
                return cache.put(url, response);
              })
              .catch(err => {
                console.warn('Non cached:', url, err);
              });
          })
        );
      })
      .catch(err => console.error('Install failed:', err))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      );
    })
  );
});
