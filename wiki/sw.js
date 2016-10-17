// After the registration of the sw when the index.html is loaded...
// We write out the eventlistener and corresponding action for the sw here


var CACHE_NAME = '834-site-cache-v1';
var urlsToCache = [
  './',
  'logo.jpg',
  './style.css',
  './main.js',
  '/masonry.pkgd.min.js',
  '/tabletop.js',
  '/UniSem07Timetable.json',
  '/FlipClock/compiled/flipclock.min.js',
  '/conf/app.js',
  '/conf/auth0-variables.js',
  '/Teachers/BIUSTeacher.jpg',
  '/Teachers/KVSTeacher.jpg',
  '/Teachers/KADTeacher.jpg',
  '/Teachers/BZhDTeacher1.jpg',
  '/Teachers/placeholder.jpg',
  '/cdn/jquery.js',
  '/cdn/bootstrapmin.js',
  '/cdn/bootstrap.min.css',
  '/cdn/auth0lock.min.js',
];

// Event listener of what to do when the sw is first registered to the site
// here we add all the list of items we want to cache itnto the cache
self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Event listener for what to do when a push notification is received
self.addEventListener('push', function(event) {
  event.waitUntil(
    self.registration.showNotification('Got Push?', {
      body: 'Push Message received'
   }));
});


// Event listener for what to do when the sw encouter a fetch, 
// this is quite important to make right, since it's just not enough
// to have a list of items in your cache, you should have a fn set up
// to track the request items from your site and make sure that we look at
// the request and serve the file needed by the request from the cache if there
// or do something else otherwise. That's why the two most important events
// in a sw are fetch and install.
self.addEventListener('fetch', function(event) {
  if (event.request.url == 'https://dragon-server.appspot.com/') {
    return;
  }
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});