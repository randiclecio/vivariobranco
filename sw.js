const CACHE_NAME = 'my-app-v1';
const CACHE_DATA_NAME = 'my-data-v1';
var urlsToCache = [
	'https://vivariobranco.com.br/',
	'https://vivariobranco.com.br/site/css/agenda.css',
	'https://vivariobranco.com.br/site/css/estilo.css',
	'https://vivariobranco.com.br/site/css/galeria.css',
	'https://vivariobranco.com.br/site/css/midler.css',
	'https://vivariobranco.com.br/site/css/slider.css',
	'https://vivariobranco.com.br/site/css/topo.css',
	'https://vivariobranco.com.br/site/css/materialize.min.css',
	'https://vivariobranco.com.br/site/css/owl.carousel.min.css',
	'https://vivariobranco.com.br/site/js/jquery.min.js',
	'https://vivariobranco.com.br/site/js/materialize.min.js',
	'https://vivariobranco.com.br/site/js/owl.carousel.min.js',
	'https://vivariobranco.com.br/files/site/esporte.png',
	'https://vivariobranco.com.br/files/site/cultura.png',
	'https://vivariobranco.com.br/files/site/comida.png'
]

self.addEventListener('install', e => {
	//console.log('Service Worker instalado', e);	
	return e.waitUntil(
		self.caches.open(CACHE_NAME)
		.then( cache => {
			return cache.addAll(urlsToCache);
		})
	)
})

self.addEventListener('activate', e => {
	//console.log('Service Worker ativado', e);
	const cacheWhiteList = [CACHE_NAME, CACHE_DATA_NAME]
	return e.waitUntil(
		self.caches.keys()
		.then( cacheNames => {
			return Promise.all(
				cacheNames.map( cacheName => {
					if(cacheWhiteList.indexOf(cacheName) === -1){
						return self.caches.delete(cacheName)
					}
				})
			)
		}).then(() => {
			return self.clients.claim()
		})
	)
})

self.addEventListener('fetch', e => {
	//console.log('Ferch Event: ', e);

	var dataUrl = 'https://vivariobranco.com.br';

	if(e.request.url.indexOf(dataUrl) === -1){
		e.respondWith(
			self.caches.match(e.request)
			.then(response => {
				return response || self.fetch(e.request);
			})
		)
	}else{
		e.respondWith(
			self.fetch(e.request)
			.then(response => {
				return self.caches.open(CACHE_DATA_NAME)
				.then(cache => {
					cache.put(e.request.url, response.clone());
					return response;
				});
			}).catch(error => {
				return self.caches.match(e.request);
			})
		)
	}
})