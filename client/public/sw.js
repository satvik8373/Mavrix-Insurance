// Mavrix Insurance Service Worker
console.log('SW: Service Worker loaded');

self.addEventListener('install', function(event) {
  console.log('SW: Installing...');
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('SW: Activating...');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
  // Pass through all requests
});