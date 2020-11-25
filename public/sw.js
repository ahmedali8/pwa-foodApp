const staticCahceName = 'site-static-v7';
const dynamicCacheName = 'site-dynamic-v8';
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
  'https://fonts.gstatic.com/s/materialicons/v67/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
  '/pages/fallback.html',
];

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

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
  e.waitUntil(
    caches.keys().then((keys) => {
      // console.log(keys);
      return Promise.all(
        keys
          .filter((key) => key !== staticCahceName && key !== dynamicCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});

// fetch events
self.addEventListener('fetch', (e) => {
  // console.log('fetch event', e);
  if (e.request.url.indexOf('firestore.googleapis.com') === -1) {
    e.respondWith(
      caches
        .match(e.request)
        .then((cacheRes) => {
          return (
            cacheRes ||
            fetch(e.request).then((fetchRes) => {
              return caches.open(dynamicCacheName).then((cache) => {
                cache.put(e.request.url, fetchRes.clone());
                limitCacheSize(dynamicCacheName, 15);
                return fetchRes;
              });
            })
          );
        })
        .catch(() => {
          if (e.request.url.indexOf('.html') > -1) {
            return caches.match('/pages/fallback.html');
          }
        })
    );
  }
});
