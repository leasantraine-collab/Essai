/* Carnet IFSI — cache hors-ligne pour la version web installable (PWA). */
const V="carnet-ifsi-v1";
const FILES=["./","index.html","manifest.webmanifest","css/content.css","css/app.css","js/data.js","js/render.js","js/app.js",
 "fonts/inter-latin-wght-normal.woff2","fonts/inter-latin-ext-wght-normal.woff2","fonts/inter-latin-wght-italic.woff2",
 "fonts/source-serif-4-latin-wght-normal.woff2","fonts/source-serif-4-latin-ext-wght-normal.woff2","fonts/jetbrains-mono-latin-wght-normal.woff2",
 "icons/icon.svg","icons/icon-192.png","icons/icon-512.png","icons/apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;
 e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put(e.request,c));return res;})));});
