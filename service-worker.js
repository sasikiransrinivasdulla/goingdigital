self.addEventListener('install', () => {
  // Activate the service worker immediately
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  self.clients.claim();
});

// Optional: respond with normal fetch (no caching)
self.addEventListener('fetch', (event) => {
  // Just let all requests go to the network
  return;
});
