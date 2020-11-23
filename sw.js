const staticCahceName = 'site-static';
const assets = [
  '/',
  '/index.html',
  '/js/app.js',
  '/js/ui.js',
  '/js/materialize.min.js',
  '/css/styles.css',
  '/css/materialize.min.css',
  '/img/dish.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
];

// install service worker
self.addEventListener('install', (e) => {
  // console.log('service worker is installed');
  e.waitUntil(
    // setting assets to cache
    caches.open(staticCahceName).then((cache) => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener('activate', (e) => {
  // console.log('service worker has been activated');
});

// fetch events
self.addEventListener('fetch', (e) => {
  // console.log('fetch event', e);
});
