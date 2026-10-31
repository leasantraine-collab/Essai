/* Carnet IFSI — service worker de la version web installable (PWA).
   Réseau d'abord : en ligne, l'appli charge toujours la dernière version publiée ;
   hors ligne, elle se sert de la copie gardée en cache. */
const V="carnet-ifsi-v16";
const FILES=[
 "./",
 "index.html",
 "manifest.webmanifest",
 "css/app.css",
 "css/content.css",
 "js/app.js",
 "js/carnet.js",
 "js/feuilles.js",
 "js/contenus/guides-stage.js",
 "js/data.js",
 "js/render.js",
 "js/contenus/anatomie.js",
 "js/contenus/complements.js",
 "js/contenus/icones.js",
 "js/contenus/pathologies-1.js",
 "js/contenus/pathologies-2.js",
 "js/contenus/quiz-cas.js",
 "js/contenus/sciences-humaines.js",
 "js/contenus/soins-cours.js",
 "js/contenus/soins-fiches.js",
 "js/contenus/stages.js",
 "js/contenus/therapeutiques.js",
 "fonts/inter-latin-ext-wght-normal.woff2",
 "fonts/inter-latin-wght-italic.woff2",
 "fonts/inter-latin-wght-normal.woff2",
 "fonts/jetbrains-mono-latin-wght-normal.woff2",
 "fonts/source-serif-4-latin-ext-wght-normal.woff2",
 "fonts/source-serif-4-latin-wght-normal.woff2",
 "icons/apple-touch-icon.png",
 "icons/icon-192.png",
 "icons/icon-512.png",
 "icons/icon-maskable-512.png",
 "icons/icon.svg"
];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(FILES.map(f=>c.add(new Request(f,{cache:"reload"})).catch(()=>{})))).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET"||new URL(r.url).origin!==location.origin)return;
 e.respondWith(fetch(r,{cache:"no-cache"}).then(res=>{if(res.ok){const c=res.clone();caches.open(V).then(x=>x.put(r,c));}return res;})
  .catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||(r.mode==="navigate"?caches.match("index.html"):Response.error()))));});
