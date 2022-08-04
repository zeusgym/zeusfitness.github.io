// console.log('service worker inside sw.js');
const cacheName = 'v1-online';
const offlineCache = 'v1-offline';
const assets = [
	'/',
	'index.html',
	'js/app.js',
	'js/main.js',
	'js/materialize.min.js',
	'css/styles.css',
	'css/materialize.min.css',
	'icons/72x72.png',
	'https://fonts.googleapis.com/icon?family=Material+Icons',
	'https://fonts.gstatic.com/s/materialicons/v135/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2',
	'pages/default.html'
];

//  cache size limit function
const limitCacheSize = (name, size) => {
	caches.open(name).then(cache => {
		cache.keys().then(keys => {
			if (keys.length > size){
				cache.delete(keys[0]).then(limitCacheSize(name,size));
			}
		})
	})
};

// Call install Event, install service worker
self.addEventListener('install', evt => {
	console.log('service worker: installed');
	evt.waitUntil(
		caches
		.open(cacheName)
		.then(cache => {
			console.log('service worker: caching files');
			cache.addAll(assets);
		})
		.then(() => self.skipWaiting())
	);
});

// Call activate event
self.addEventListener('activate', evt => {
	console.log('service worker has benn activated');
	evt.waitUntil(
		caches.keys()
		.then(keys => {
			console.log(keys);
			return Promise.all(keys
				.filter(key => key !== cacheName)
				.map(key => caches.delete())
				)
		})
	);
});

// Call Fetch event
self.addEventListener('fetch', evt => {
	console.log('service worker: fetching files');
	if (!(evt.request.url.indexOf('http') === 0)) return;
	if(evt.request.url.indexOf('firestore.googleapis.com') === -1) {
		evt.respondWith(
			caches
				.match(evt.request)
				.then(cacheRes => {
					return cacheRes || 
					fetch(evt.request)
						.then(fetchRes => {
							return caches.open(offlineCache).then(cache => {
							cache.put(evt.request.url, fetchRes.clone());
							limitCacheSize(offlineCache, 15);
							return fetchRes;
					});
				});
			}).catch(() => {
					if (evt.request.url.indexOf('.html') > -1) {
						return caches.match('pages/default.html');
					}
			})
		);
	}		
});