const V='joga-v68',F=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','logo.png','style.css?v=20261128-39','app.js?v=20261128-39','matches.js?v=20261128-39','assets/rings/bronze_ring.svg','assets/rings/silver_ring.svg','assets/rings/gold_ring.svg','assets/rings/diamond_ring.svg','assets/rings/fire_ring.svg','assets/rings/electric_ring.svg','assets/rings/rainbow_ring.svg','assets/rings/neon_ring.svg','assets/rings/elite_ring.svg','assets/rings/creator_ring.svg','assets/rings/rank_atlas_part1.b64?v=20261128-8','assets/rings/rank_atlas_part2.b64?v=20261128-8','assets/rings/rank_atlas_part3.b64?v=20261128-8','assets/rings/rank_atlas_part4.b64?v=20261128-8','assets/banners/starter_banner.svg','assets/banners/elite_banner.svg','assets/banners/creator_banner.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(F)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
 const fallback=async()=>{
  const cached=await caches.match(e.request,{ignoreSearch:true});
  if(cached)return cached;
  if(e.request.mode==='navigate')return caches.match('./');
  return new Response('Sin conexión y recurso no disponible en caché.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
 };
 e.respondWith(fetch(e.request).then(r=>{
  if(r.ok){const c=r.clone();caches.open(V).then(x=>x.put(e.request,c));return r}
  return fallback().then(cached=>cached||r);
 }).catch(fallback));
});