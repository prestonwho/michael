const CACHE_NAME = 'st-michael-v1';

// List of all the exact files the app needs to run completely offline
const URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  './opening.mp3',
  './1.mp3',
  './2.mp3',
  './3.mp3',
  './4.mp3',
  './5.mp3',
  './6.mp3',
  './7.mp3',
  './8.mp3',
  './9.mp3',
  './0.mp3'
];

// 1. When the app loads for the first time, download everything to local storage
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and saving files to local storage');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
  self.skipWaiting();
});

// 2. When the app asks for a file (like an MP3), serve it from the local hard drive, NOT the internet
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // If the file is in local storage, return it immediately
        if (response) {
          return response;
        }
        // Otherwise, fetch from the internet just in case
        return fetch(event.request);
      })
  );
});

// 3. Clean up old caches if we ever update the version number
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
