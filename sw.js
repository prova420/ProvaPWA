const CACHE_NAME = 'magazzino-v2';
const ASSETS_TO_CACHE = [
  './',                   // Pagina principale
  './index.html',         // File HTML principale
  './manifest.json',      // Manifest
  './icons/icon-192.png', // Percorsi corretti delle icone
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aperta');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch(error => {
        console.error('Errore cache.addAll:', error);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
