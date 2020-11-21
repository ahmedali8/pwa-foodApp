// install service worker
self.addEventListener('install', (e) => {
  console.log('service worker is installed');
});

// activate event
self.addEventListener('activate', (e) => {
  console.log('service worker has been activated');
});
