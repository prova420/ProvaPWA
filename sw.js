const CACHE_VERSION = 'v8-' + new Date().toISOString().split('T')[0];
const CACHE_NAME = `magazzino-${CACHE_VERSION}`;
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icona-192.png',
  './icona-512.png',
  './css/all.min.css',
  './webfonts/fa-solid-900.woff2'
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
  // Gestione speciale per dispositivi mobile
  if (event.request.url.includes('magazzinoprova.netlify.app') || 
      event.request.url.startsWith('https://magazzinoprova.netlify.app')) {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  } else {
    // Per altre richieste, passa direttamente alla rete
    event.respondWith(fetch(event.request));
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME && cache.startsWith('magazzino-')) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
