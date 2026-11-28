const SB_URL='https://quiwqzxjltpyhcyccnsy.supabase.co',SB_KEY='sb_publishable_rtOGQipNhAERm5RPAw09uA_J8RMcpgB';
const boot=location.hash+location.search;
const $=id=>document.getElementById(id);
const legends=[
 {n:'Primer paso',s:'Ambición',q:'«No naciste para mirar cómo otros hacen historia.»',by:'',cr:'',t:'#c8e68b'},
 {n:'Creé',s:'Orígenes',q:'«Mientras haya una pelota, siempre habrá una razón para creer.»',by:'',cr:'',t:'#ffb347'},
 {n:'Dejalo todo',s:'Determinación',q:'«Jugá cada partido como si fuera el que te va a cambiar la vida.»',by:'',cr:'',t:'#ff7a45'},
 {n:'Seguí',s:'Resistencia',q:'«No viniste hasta acá para dejar de creer ahora.»',by:'',cr:'',t:'#74b9e8'},
 {n:'Recordá',s:'Disciplina',q:'«Cuando todo te diga que pares, recordá por qué empezaste.»',by:'',cr:'',t:'#7be0a0'},
 {n:'Lo mejor',s:'Futuro',q:'«Tu historia todavía no llegó a la mejor parte.»',by:'',cr:'',t:'#c8e68b'}
];
const ball=(x,y,r)=>`<g transform="translate(${x} ${y})"><circle r="${r}" fill="#f2f3ef"/><path d="M0 ${-r*.38}l${r*.36} ${r*.27}-${r*.14} ${r*.43}h-${r*.44}l-${r*.14}-${r*.43}z" fill="#101110"/><path d="M0 ${-r*.38}V${-r}M${r*.36} ${-r*.11}L${r*.95} ${-r*.31}M${r*.22} ${r*.32}L${r*.58} ${r*.8}M-${r*.22} ${r*.32}L-${r*.58} ${r*.8}M-${r*.36} ${-r*.11}L-${r*.95} ${-r*.31}" stroke="#101110" stroke-width="${r*.05}" fill="none"/><circle r="${r}" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="2"/></g>`;
const man=(x,y,k,r=0,extra='')=>`<g transform="translate(${x} ${y}) rotate(${r}) scale(${k})" fill="#080a07"><circle cy="-70" r="13"/><path d="M-16 -54h32l8 52-12 4-6 62h-12l-4-48-4 48h-12l-6-62-12-4z"/>${extra}</g>`;
const sit=(x,y,k)=>`<g transform="translate(${x} ${y}) scale(${k})" fill="#080a07"><circle cx="8" cy="-36" r="13"/><path d="M-30 0c0-34 12-48 28-48s26 14 26 48z"/><path d="M-34 0h66v12h-66z"/></g>`;
const lights=()=>[70,150,250,330].map(x=>`<path d="M${x} 0l-34 330h68z" fill="#fff" opacity=".07"/><rect x="${x-18}" y="10" width="36" height="12" rx="3" fill="#fff" opacity=".55"/>`).join('');
const arch='M105 470V250c0-72 42-112 95-112s95 40 95 112v220z';
const scene=(l,i)=>{
 const c=l.t;
 const sc=[
  `<path d="M0 470V200C0 80 120 20 200 20s200 60 200 180v270z" fill="#07080a"/><path d="${arch}" fill="${c}" opacity=".85"/><path d="${arch}" fill="url(#w${i})"/>`+man(200,368,1.6),
  `<circle cx="270" cy="250" r="92" fill="${c}" opacity=".9"/><rect y="330" width="400" height="140" fill="#17120a"/><path d="M55 330V245M150 330V245M55 245h95" stroke="#ece6d3" stroke-width="5" fill="none"/>`+ball(245,376,26)+man(305,336,.75),
  `<g stroke="#fff" stroke-opacity=".12" stroke-width="3">${Array.from({length:9},(_,k)=>`<path d="M-20 ${40+k*46}L420 ${k*46}"/>`).join('')}</g>`+[[300,372,9],[322,346,6],[282,392,7],[335,380,5],[262,400,6]].map(m=>`<circle cx="${m[0]}" cy="${m[1]}" r="${m[2]}" fill="#6a5238"/>`).join('')+ball(270,310,48)+man(130,372,1.5,14),
  [60,120,180,240,300,360].map(x=>`<circle cx="${x}" cy="240" r="5" fill="#fff" opacity=".7"/>`).join('')+`<rect y="262" width="400" height="208" fill="#0c100b"/><path d="M0 330h400" stroke="${c}" stroke-opacity=".35" stroke-width="3"/>`+sit(150,410,2.2)+ball(300,420,26),
  lights()+`<rect y="330" width="400" height="140" fill="#0c100b"/><path d="M110 440Q200 330 215 322" stroke="${c}" stroke-width="3" stroke-dasharray="8 8" fill="none"/>`+ball(220,320,30)+man(110,432,.9),
  lights()+`<rect x="30" y="250" width="340" height="64" fill="${c}" opacity=".7"/><rect y="310" width="400" height="160" fill="#07080a"/>`+man(200,450,1.5,0,'<circle cx="-24" cy="-22" r="10" fill="#f2f3ef"/>')
 ][i];
 return `<div class="ph"><svg viewBox="0 0 400 470" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="g${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c}" stop-opacity=".42"/><stop offset="1" stop-color="#101110"/></linearGradient><radialGradient id="w${i}" cx=".5" cy=".3" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect width="400" height="470" fill="url(#g${i})"/>${sc}</svg><img src="fotos/0${i+1}.jpg" alt="" onerror="this.remove()"></div>`};
$('phs').innerHTML=legends.map(scene).join('');
$('dots').innerHTML=legends.map((l,i)=>`<button aria-label="${l.n}" onclick="show(${i})"></button>`).join('');
let cur=0,tm;
function show(i){
 cur=(i+legends.length)%legends.length;const l=legends[cur];
 document.querySelectorAll('.ph').forEach((p,k)=>p.classList.toggle('on',k===cur));
 document.querySelectorAll('#dots button').forEach((d,k)=>d.classList.toggle('on',k===cur));
 const t=document.querySelectorAll('#sub,#nm,#q,#by');t.forEach(e=>e.style.opacity=0);
 setTimeout(()=>{$('sub').textContent=l.s;$('nm').textContent=l.n;$('q').textContent=l.q;$('by').textContent=l.by;$('cr').textContent=l.cr;t.forEach(e=>{e.style.transition='opacity .4s';e.style.opacity=1})},180);
 clearTimeout(tm);tm=setTimeout(()=>show(cur+1),6500);
}
let x0=null;const h=$('hero');
h.addEventListener('touchstart',e=>x0=e.touches[0].clientX,{passive:true});
h.addEventListener('touchend',e=>{if(x0===null)return;const d=e.changedTouches[0].clientX-x0;if(Math.abs(d)>40)show(cur+(d<0?1:-1));x0=null});

$('alogo').src=document.querySelector('.logo img').src;
const REDIR=location.origin+location.pathname;
const sb=window.supabase?window.supabase.createClient(SB_URL,SB_KEY):null;
let P=null,S=null,recovering=/type=recovery/.test(boot),entering=false,enteringUserId=null;
let tt;function toast(m,ms){const t=$('toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),ms||3200)}
const msg=e=>{const m=(e&&(e.message||e.error_description))||'';
 if(/over_email_send_rate_limit|rate limit/i.test(m)||(e&&e.status===429))return 'Se enviaron demasiados mails. Probá de nuevo en un rato.';
 if(/Invalid login credentials/i.test(m))return 'Email o contraseña incorrectos.';
 if(/Email not confirmed/i.test(m))return 'Todavía no confirmaste tu email. Revisá tu bandeja de entrada.';
 if(/already registered/i.test(m))return 'Ese email ya está registrado.';
 if(/saving new user/i.test(m))return 'No pudimos crear la cuenta. Revisá que el usuario esté libre y sea válido, y que cumplas la edad mínima.';
 if(/username_change_limit/.test(m))return 'Solo podés cambiar el usuario una vez cada 30 días.';
 if(/username_reserved/.test(m))return 'Ese nombre de usuario no está permitido.';
 if(e&&(e.code==='23505'||/duplicate key/i.test(m)))return 'Ese usuario ya está en uso.';
 if(/should be at least|weak/i.test(m))return 'La contraseña es muy débil. Usá al menos 8 caracteres.';
 if(/Failed to fetch|NetworkError|network/i.test(m))return 'No hay conexión. Revisá tu internet.';
 return 'Algo salió mal. Probá de nuevo.'};
const forms=[...document.querySelectorAll('.af')];
function showForm(id){forms.forEach(f=>f.classList.toggle('on',f.id===id));const f=$(id).querySelector('.err');if(f){f.textContent='';f.classList.remove('ok')}$('auth').scrollTo(0,0)}
function openAuth(id){$('auth').classList.add('on');showForm(id)}
document.querySelectorAll('[data-go]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();showForm(a.dataset.go)}));
const setErr=(f,t,ok)=>{const e=f.querySelector('.err');e.textContent=t;e.classList.toggle('ok',!!ok)};
const busy=(f,on)=>f.querySelectorAll('button').forEach(b=>b.disabled=on);
function bind(id,fn){const f=$(id);f.addEventListener('submit',async e=>{e.preventDefault();if(!sb){setErr(f,'No se pudo cargar la conexión. Revisá tu internet y recargá.');return}setErr(f,'');busy(f,true);try{await fn(f)}catch(x){setErr(f,msg(x))}busy(f,false)})}
const argentinaTodayParts=()=>new Intl.DateTimeFormat('en-US',{timeZone:'America/Argentina/Buenos_Aires',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).reduce((o,p)=>(o[p.type]=p.value,o),{});
const age=d=>{
 const [y,m,day]=String(d||'').split('-').map(Number);
 const check=new Date(Date.UTC(y,m-1,day));
 if(!Number.isInteger(y)||!Number.isInteger(m)||!Number.isInteger(day)||check.getUTCFullYear()!==y||check.getUTCMonth()!==m-1||check.getUTCDate()!==day)return -1;
 const t=argentinaTodayParts();let a=Number(t.year)-y;
 if(Number(t.month)<m||(Number(t.month)===m&&Number(t.day)<day))a--;
 return a
};
const birthLimit=argentinaTodayParts();$('r-bd').min='1900-01-01';$('r-bd').max=String(Number(birthLimit.year)-13).padStart(4,'0')+'-'+birthLimit.month+'-'+birthLimit.day;
let lastEmail='';
bind('f-login',async f=>{const email=$('l-em').value.trim(),password=$('l-pw').value;if(!email||!password)return setErr(f,'Completá email y contraseña.');
 const{error}=await sb.auth.signInWithPassword({email,password});if(error){lastEmail=email;throw error}});
bind('f-reg',async f=>{const email=$('r-em').value.trim(),password=$('r-pw').value,un=$('r-un').value.trim().toLowerCase(),dn=$('r-dn').value.trim(),bd=$('r-bd').value;
 if(!/^\S+@\S+\.\S+$/.test(email))return setErr(f,'Ingresá un email válido.');
 if(password.length<8)return setErr(f,'La contraseña debe tener al menos 8 caracteres.');
 if(!/^[a-z0-9_]{3,20}$/.test(un))return setErr(f,'El usuario debe tener de 3 a 20 caracteres: minúsculas, números o guion bajo.');
 if(dn.length<1||dn.length>40)return setErr(f,'Escribí tu nombre visible (hasta 40 caracteres).');
 if(!bd)return setErr(f,'Ingresá tu fecha de nacimiento.');
 if(age(bd)<13)return setErr(f,'Tenés que tener al menos 13 años para usar JOGA.');
 const{data,error}=await sb.auth.signUp({email,password,options:{emailRedirectTo:REDIR,data:{username:un,display_name:dn,birth_date:bd}}});
 if(error)throw error;
 if(data.user&&data.user.identities&&data.user.identities.length===0)return setErr(f,'Ese email ya está registrado. Probá entrar.');
 if(!data.session){lastEmail=email;$('n-txt').textContent='Te mandamos un mail a '+email+'. Ojo: lo envía Supabase, el servicio que usamos para las cuentas de JOGA, así que va a decir “Supabase” y no “JOGA”. Buscalo también en spam. Tocá el link para confirmar y después entrá.';showForm('f-notice')}});
bind('f-notice',async f=>{if(!lastEmail)return showForm('f-login');const{error}=await sb.auth.resend({type:'signup',email:lastEmail,options:{emailRedirectTo:REDIR}});if(error)throw error;setErr(f,'Listo, te lo reenviamos.',1)});
bind('f-forgot',async f=>{const email=$('f-em').value.trim();if(!email)return setErr(f,'Ingresá tu email.');
 const{error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:REDIR});if(error)throw error;setErr(f,'Si ese email tiene cuenta, te mandamos el link. Lo envía Supabase, nuestro servicio de cuentas, así que va a decir “Supabase”. Buscalo también en spam.',1)});
bind('f-reset',async f=>{const a=$('x-pw').value,b=$('x-pw2').value;if(a.length<8)return setErr(f,'Usá al menos 8 caracteres.');if(a!==b)return setErr(f,'Las contraseñas no coinciden.');
 const{error}=await sb.auth.updateUser({password:a});if(error)throw error;recovering=false;toast('Contraseña actualizada.');const{data}=await sb.auth.getSession();if(data.session)enter(data.session)});
const safeText=x=>String(x||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const homeDate=d=>new Intl.DateTimeFormat('es-AR',{timeZone:'America/Argentina/Buenos_Aires',weekday:'short',day:'numeric',month:'short'}).format(new Date(d+'T12:00:00-03:00'));
const homeTips=[['Levantá la cabeza','Antes de recibir, mirá dónde están tus compañeros. Un segundo de anticipación te cambia la jugada.'],['Jugá simple','Un pase rápido puede romper más líneas que diez gambetas.'],['Hablá en la cancha','Avisá, pedí la pelota y alentá. La comunicación también juega.'],['Perdés y volvés','La primera reacción después de perder la pelota importa: recuperá posición y ayudá.'],['Perfil abierto','Orientá el cuerpo antes de recibir para tener más opciones de pase.'],['Compartí la cancha','Un buen partido se disfruta más cuando todos participan.']];
const tipParts=new Intl.DateTimeFormat('en-US',{timeZone:'America/Argentina/Buenos_Aires',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).reduce((o,p)=>(o[p.type]=p.value,o),{});const tipKey=tipParts.year+tipParts.month+tipParts.day;const todayTip=homeTips[Number(tipKey)%homeTips.length];if($('home-tip-text')){$('home-tip-title').textContent=todayTip[0];$('home-tip-text').textContent=todayTip[1]}
const initial=p=>(p.display_name||'?').trim().charAt(0).toUpperCase();
const avUrl=p=>p.avatar_path?sb.storage.from('avatars').getPublicUrl(p.avatar_path).data.publicUrl+'?v='+encodeURIComponent(p.updated_at):'';
const one=x=>Array.isArray(x)?x[0]:x;
function setAv(el,p){const u=avUrl(p);el.style.backgroundImage=u?'url("'+u+'")':'';el.textContent=u?'':initial(p)}
function withTimeout(task,ms,label){
 return new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>reject(new Error((label||'La operación')+' tardó demasiado.')),ms);
  Promise.resolve(task).then(value=>{clearTimeout(timer);resolve(value)},error=>{clearTimeout(timer);reject(error)});
 });
}
function createFallbackProfile(session){
 const user=session&&session.user?session.user:{},meta=user.user_metadata||{};
 const email=String(user.email||''),emailName=(email.split('@')[0]||'').replace(/[^a-z0-9_]/gi,'').slice(0,20);
 return {id:user.id,username:String(meta.username||emailName||'jugador').toLowerCase(),display_name:String(meta.display_name||emailName||'Jugador JOGA'),avatar_path:null,updated_at:null,visibility:'public',d:{},plan:'free',_profileFallback:true};
}
function setProfileStatus(message,retry=false){
 const box=$('profile-load-state'),copy=$('profile-load-message'),button=$('profile-retry');
 if(!box||!copy||!button)return;
 copy.textContent=message||'';box.hidden=!message;button.hidden=!retry;
}
async function loadProfile(){
 if(!sb||!S||!S.user||!S.user.id)throw new Error('No hay una sesión activa.');
 const userId=S.user.id;
 const result=await withTimeout(sb.from('profiles').select('*').eq('id',userId).maybeSingle(),12000,'La carga de tu ficha');
 if(result.error)throw result.error;
 if(!result.data)throw new Error('No encontramos tu ficha de jugador.');
 if(!S||S.user.id!==userId)throw new Error('La sesión cambió durante la carga.');
 P={...result.data,d:{},plan:'free',_profileFallback:false};
 return P;
}
async function loadProfileExtras(userId){
 const isCurrent=()=>!!(S&&S.user&&S.user.id===userId&&P&&P.id===userId);
 const [detailsResult,protectedResult]=await Promise.allSettled([
  withTimeout(sb.from('profile_details').select('*').eq('id',userId).maybeSingle(),7000,'Los datos de jugador'),
  withTimeout(sb.from('profile_protected').select('plan').eq('id',userId).maybeSingle(),7000,'El plan de cuenta')
 ]);
 if(!isCurrent())return;
 if(detailsResult.status==='fulfilled'&&!detailsResult.value.error)P.d=detailsResult.value.data||{};
 else console.warn('JOGA profile details unavailable',detailsResult.status==='rejected'?detailsResult.reason:detailsResult.value.error);
 if(protectedResult.status==='fulfilled'&&!protectedResult.value.error)P.plan=(protectedResult.value.data||{}).plan||'free';
 else console.warn('JOGA plan unavailable',protectedResult.status==='rejected'?protectedResult.reason:protectedResult.value.error);
 if(!isCurrent())return;
 try{render()}catch(error){console.error('JOGA profile refresh failed',error)}
 const [cosmeticsResult,statsResult]=await Promise.allSettled([
  withTimeout(loadCosmetics(userId),10000,'La personalización'),
  withTimeout(loadPlayerStats(userId),10000,'Las estadísticas')
 ]);
 if(!isCurrent())return;
 if(cosmeticsResult.status==='fulfilled'){
  try{renderCosmetics()}catch(error){console.error('JOGA cosmetics render failed',error)}
 }else{
  console.warn('JOGA cosmetics unavailable',cosmeticsResult.reason);
  COS={catalog:[],inventory:[],equipped:{},creator:false};
  const note=$('cosmetic-note');if(note)note.textContent='La personalización no está disponible. Tu ficha sigue funcionando.';
 }
 if(statsResult.status==='rejected'){
  console.warn('JOGA stats unavailable',statsResult.reason);
  ['stat-created','stat-joined','stat-upcoming','home-stat-created','home-stat-joined','home-stat-upcoming'].forEach(id=>{const el=$(id);if(el)el.textContent='—'});
  const nextEl=$('home-next-match-content');
  if(nextEl)nextEl.innerHTML='<h3>Actividad no disponible.</h3><p>Tu ficha está lista, pero no pudimos actualizar las estadísticas.</p><button class="home-next-match-btn" type="button" onclick="tab(&quot;play&quot;)">Ir a jugar <span>→</span></button>';
 }
}
let RANK_SPRITE_DATA='';const RING_FRAME_DATA={};function ringSrc(key){return RING_FRAME_DATA[key]||RANK_SPRITE_DATA;}
async function buildRingFrames(){
 const atlas=new Image();
 atlas.src=RANK_SPRITE_DATA;
 await atlas.decode();
 if(atlas.naturalWidth!==384||atlas.naturalHeight!==384)throw new Error('Unexpected ring atlas size '+atlas.naturalWidth+'x'+atlas.naturalHeight);
 const keys=['bronze_ring','silver_ring','gold_ring','platinum_ring','diamond_ring','elite_ring','creator_ring','epic_ring','legendary_ring'];
 const cell=128,pad=16,size=cell+pad*2;
 for(let i=0;i<keys.length;i++){
  const x=(i%3)*cell,y=Math.floor(i/3)*cell,canvas=document.createElement('canvas');
  canvas.width=size;canvas.height=size;
  const ctx=canvas.getContext('2d');
  ctx.clearRect(0,0,size,size);
  ctx.imageSmoothingEnabled=true;
  ctx.imageSmoothingQuality='high';
  ctx.drawImage(atlas,x,y,cell,cell,pad,pad,cell,cell);
  RING_FRAME_DATA[keys[i]]=canvas.toDataURL('image/png');
 }
}
 let COS={catalog:[],inventory:[],equipped:{},creator:false};
async function loadCosmetics(userId=S&&S.user&&S.user.id){
 const [cat,inv,equ,cre,sprite1,sprite2,sprite3,sprite4]=await Promise.all([
 sb.from('cosmetic_catalog').select('item_key,slot,display_name,rarity,animated,css_class,active').eq('active',true),
 sb.from('cosmetic_inventory').select('item_key').eq('user_id',userId),
 sb.from('cosmetic_equipped').select('slot,item_key').eq('user_id',userId),
 sb.from('creator_entitlements').select('entitlement').eq('user_id',userId).eq('entitlement','creator'),
 fetch('assets/rings/rank_atlas_part1.b64?v=20261128-8').then(r=>{if(!r.ok)throw new Error('Rank atlas 1 missing '+r.status);return r.text()}),
 fetch('assets/rings/rank_atlas_part2.b64?v=20261128-8').then(r=>{if(!r.ok)throw new Error('Rank atlas 2 missing '+r.status);return r.text()}),
 fetch('assets/rings/rank_atlas_part3.b64?v=20261128-8').then(r=>{if(!r.ok)throw new Error('Rank atlas 3 missing '+r.status);return r.text()}),
 fetch('assets/rings/rank_atlas_part4.b64?v=20261128-8').then(r=>{if(!r.ok)throw new Error('Rank atlas 4 missing '+r.status);return r.text()})
 ]);
 for(const r of [cat,inv,equ,cre])if(r.error)throw r.error;
 RANK_SPRITE_DATA='data:image/png;base64,'+[sprite1,sprite2,sprite3,sprite4].join('').trim();
 await buildRingFrames();
 if(!S||S.user.id!==userId)return;COS.catalog=cat.data||[];COS.inventory=(inv.data||[]).map(x=>x.item_key);COS.equipped=Object.fromEntries((equ.data||[]).map(x=>[x.slot,x.item_key]));COS.creator=(cre.data||[]).length>0;
}
async function loadPlayerStats(userId=S&&S.user&&S.user.id){
 const parts=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Argentina/Buenos_Aires',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date()).reduce((o,p)=>(o[p.type]=p.value,o),{});
 const now=parts(),today=now.year+'-'+now.month+'-'+now.day,nowTime=now.hour+':'+now.minute;
 const [created,participations]=await Promise.all([
  sb.from('matches').select('id',{count:'exact',head:true}).eq('organizer_id',userId).neq('status','cancelled'),
  sb.from('match_participants').select('match_id,participant_status').eq('user_id',userId).in('participant_status',['joined','organizer'])
 ]);
 if(created.error)throw created.error;if(participations.error)throw participations.error;
 const ids=[...new Set((participations.data||[]).map(x=>x.match_id))];
 let upcoming=0,next=null;
 if(ids.length){
  const{data,error}=await sb.from('matches').select('id,title,area,match_date,start_time,status,modality,venue_name').in('id',ids).gte('match_date',today).in('status',['open','full']).order('match_date').order('start_time');
  if(error)throw error;
  const future=(data||[]).filter(m=>m.match_date>today||(m.match_date===today&&(m.start_time||'').slice(0,5)>nowTime));
  upcoming=future.length;next=future[0]||null;
 }
 if(!S||S.user.id!==userId)return;
 const nextEl=$('home-next-match-content');
 if(nextEl){nextEl.innerHTML=next?'<h3>'+safeText(next.title||'Partido')+'</h3><p>'+safeText(next.area||'')+' · '+safeText(homeDate(next.match_date))+' · '+safeText(String(next.start_time||'').slice(0,5))+'</p><button class="home-next-match-btn" type="button" onclick="tab(\'play\')">Ver partidos <span>→</span></button>':'<h3>Sin partidos por ahora.</h3><p>La próxima pichanga que te anotes aparece acá.</p><button class="home-next-match-btn" type="button" onclick="tab(\'play\')">Buscar partido <span>→</span></button>'}

 $('stat-created').textContent=created.count??0;$('stat-joined').textContent=ids.length;$('stat-upcoming').textContent=upcoming;
 $('home-stat-created').textContent=created.count??0;$('home-stat-joined').textContent=ids.length;$('home-stat-upcoming').textContent=upcoming;
}


let playerSearchSeq=0,playerSearchTimer;
const playerClean=s=>String(s||'').toLocaleLowerCase('es-AR').replace(/[^\p{L}\p{N}\s_-]/gu,' ').replace(/\s+/g,' ').trim();
async function loadPlayers(term=''){
 const el=$('players-results');if(!el)return;
 if(!S){el.innerHTML='<p class="empty">Iniciá sesión para explorar jugadores.</p>';return}
 const q=playerClean(term),seq=++playerSearchSeq;
 el.innerHTML='<p class="empty">Buscando jugadores…</p>';
 try{
  let query=sb.from('profiles').select('id,username,display_name,avatar_path,updated_at,visibility').eq('visibility','public').neq('id',S.user.id).order('username').limit(30);
  if(q)query=query.or('username.ilike.%'+q+'%,display_name.ilike.%'+q+'%');
  const{data,error}=await query;if(error)throw error;if(seq!==playerSearchSeq)return;
  const people=data||[];
  if(!people.length){el.innerHTML='<p class="empty">'+(q?'No encontramos jugadores con esa búsqueda.':'Todavía no hay otros perfiles públicos.')+'</p>';return}
  const detailsResult=await sb.from('profile_details').select('id,favorite_position,favorite_club').in('id',people.map(x=>x.id));
  if(detailsResult.error)throw detailsResult.error;if(seq!==playerSearchSeq)return;
  const details=Object.fromEntries((detailsResult.data||[]).map(x=>[x.id,x]));
  el.innerHTML=people.map(p=>{
   const d=details[p.id]||{},avatar=avUrl(p),firstLetter=initial(p);
   return '<article class="player-card"><div class="player-avatar"><span>'+safeText(firstLetter)+'</span>'+(avatar?'<img src="'+safeText(avatar)+'" alt="" loading="lazy" onerror="this.remove()">':'')+'</div><div class="player-card-info"><b>'+safeText(p.display_name||p.username)+'</b><span>@'+safeText(p.username)+'</span><small>'+safeText([d.favorite_position,d.favorite_club].filter(Boolean).join(' · ')||'Jugador JOGA')+'</small></div><span class="player-public">PÚBLICO</span></article>'
  }).join('');
 }catch(e){if(seq!==playerSearchSeq)return;console.error('JOGA players',e);el.innerHTML='<p class="empty">No pudimos cargar jugadores. Revisá tu conexión.</p>'}
}
window.jogaPlayersRefresh=loadPlayers;
$('players-search')?.addEventListener('input',()=>{clearTimeout(playerSearchTimer);playerSearchTimer=setTimeout(()=>loadPlayers($('players-search').value),250)});
function openCosmeticPreview(item){
 const modal=$('cosmetic-preview');if(!modal)return;
 const owned=COS.creator||COS.inventory.includes(item.item_key);
 const art=$('preview-ring-art'),banner=$('preview-banner'),name=$('preview-cosmetic-name'),desc=$('preview-cosmetic-desc'),btn=$('preview-equip');
 const profileName=$('preview-profile-name'),profileUser=$('preview-profile-user'),avatar=$('preview-profile-avatar-inner');
 const equippedRing=COS.catalog.find(x=>x.item_key===COS.equipped.ring);
 const equippedBanner=COS.catalog.find(x=>x.item_key===COS.equipped.banner);
 const ring=item.slot==='ring'?item:equippedRing;
 const bannerItem=item.slot==='banner'?item:equippedBanner;
 art.hidden=!ring;
 art.style.setProperty('background-image',ring?'url("'+ringSrc(ring.item_key)+'")':'','important');
 art.className='ring-art '+(ring?ring.css_class:'ring-none');
 banner.style.setProperty('background-image','url("assets/banners/'+(bannerItem?bannerItem.item_key:'starter_banner')+'.svg?v=20261128-8")','important');
 if(P){
  profileName.textContent=P.display_name||'Jugador JOGA';
  profileUser.textContent='@'+(P.username||'jugador');
  const image=avUrl(P);
  avatar.style.backgroundImage=image?'url("'+image+'")':'';
  avatar.textContent=image?'':initial(P);
 }else{profileName.textContent='Jugador JOGA';profileUser.textContent='@jugador';avatar.textContent='J';}
 name.textContent=item.display_name;
 desc.textContent=item.slot==='banner'
  ? 'Vista previa del banner en tu perfil, con tu aro y tu foto.'
  : (item.animated?'Vista previa animada del aro alrededor de tu foto.':'Vista previa del aro de rango en tu perfil.');
 const current=item.slot==='ring'?COS.equipped.ring:COS.equipped.banner;
 btn.textContent=current===item.item_key?'Ya está equipado':owned?'Equipar en mi perfil':'Todavía bloqueado';
 btn.disabled=!owned||current===item.item_key;
 btn.onclick=async()=>{const ok=await equipCosmetic(item.item_key);if(ok)modal.hidden=true;};
 modal.hidden=false;
}
document.addEventListener('click',e=>{if(e.target.closest('[data-preview-close]'))$('cosmetic-preview').hidden=true});

function renderCosmetics(){
 const rankKeys=['bronze_ring','silver_ring','gold_ring','platinum_ring','diamond_ring'];
 const exclusiveKeys=['elite_ring','creator_ring','epic_ring','legendary_ring'];
 const ringOrder=[...rankKeys,...exclusiveKeys];
 const rings=COS.catalog.filter(x=>ringOrder.includes(x.item_key));
 const banners=COS.catalog.filter(x=>x.slot==='banner');
 const rankGrid=$('ring-ranks-grid'),effectGrid=$('ring-effects-grid'),exclusiveGrid=$('ring-exclusive-grid');
 if(!rankGrid||!effectGrid||!exclusiveGrid)return;
 [rankGrid,effectGrid,exclusiveGrid].forEach(g=>{if(g)g.innerHTML=''});
 rings.sort((a,b)=>ringOrder.indexOf(a.item_key)-ringOrder.indexOf(b.item_key));
 for(const item of rings){
 const owned=COS.creator||COS.inventory.includes(item.item_key),equipped=COS.equipped.ring===item.item_key;
 const card=document.createElement('button');card.type='button';card.className='cosmetic-card'+(equipped?' equipped':'')+(owned?' owned':' locked');
 card.disabled=false;
 card.innerHTML='<div class="cosmetic-demo '+item.css_class+'"><div class="cosmetic-ring-stage"><div class="ring-art '+item.css_class+'" aria-hidden="true"></div></div><div class="cosmetic-avatar">J</div></div><h3></h3><small></small><span class="cosmetic-status"></span>';const demo=card.querySelector('.cosmetic-demo'),stage=card.querySelector('.cosmetic-ring-stage'),art=card.querySelector('.ring-art'),avatar=card.querySelector('.cosmetic-avatar');[['position','relative'],['width','128px'],['height','128px'],['margin','8px auto 12px'],['overflow','visible'],['display','block']].forEach(([k,v])=>demo.style.setProperty(k,v,'important'));[['position','absolute'],['inset','-22px'],['overflow','visible'],['pointer-events','none']].forEach(([k,v])=>stage.style.setProperty(k,v,'important'));[['position','absolute'],['left','50%'],['top','50%'],['width','128px'],['height','128px'],['transform','translate(-50%,-50%)'],['background-size','contain'],['background-position','center'],['background-repeat','no-repeat'],['z-index','1']].forEach(([k,v])=>art.style.setProperty(k,v,'important'));[['position','absolute'],['inset','auto'],['left','50%'],['top','50%'],['transform','translate(-50%,-50%)'],['width','64px'],['height','64px'],['min-width','64px'],['margin','0'],['padding','0'],['box-sizing','border-box'],['display','grid'],['place-items','center'],['font-size','26px'],['line-height','1'],['text-align','center'],['z-index','2'],['border-radius','50%'],['overflow','hidden']].forEach(([k,v])=>avatar.style.setProperty(k,v,'important'));art.style.setProperty('background-image','url("'+ringSrc(item.item_key)+'")','important');
 card.querySelector('h3').textContent=item.display_name;
 card.querySelector('small').textContent=item.animated?'Animado':'Estático';
 card.querySelector('.cosmetic-status').textContent=equipped?'Equipado':owned?'Vista previa · equipar':'Bloqueado · ver';
 card.addEventListener('click',()=>openCosmeticPreview(item));
 const target=rankKeys.includes(item.item_key)?rankGrid:exclusiveGrid;
 if(target)target.append(card)
 }
 
 const bg=$('banner-grid');if(bg){bg.innerHTML='';for(const item of banners){const owned=COS.creator||COS.inventory.includes(item.item_key),equipped=COS.equipped.banner===item.item_key;const card=document.createElement('button');card.type='button';card.className='cosmetic-card'+(equipped?' equipped':'')+(owned?' owned':' locked');card.innerHTML='<div class="banner-demo '+item.css_class+'"></div><h3></h3><small></small><span class="cosmetic-status"></span>';card.querySelector('.banner-demo').style.setProperty('background-image','url("assets/banners/'+item.item_key+'.svg?v=20261128-8")','important');card.querySelector('h3').textContent=item.display_name;card.querySelector('small').textContent=item.animated?'Animado':'Estático';card.querySelector('.cosmetic-status').textContent=equipped?'Equipado':owned?'Vista previa · equipar':'Bloqueado · ver';card.addEventListener('click',()=>openCosmeticPreview(item));bg.append(card)}}
 if(effectGrid){effectGrid.hidden=true;if(effectGrid.previousElementSibling)effectGrid.previousElementSibling.hidden=true;}
 if(exclusiveGrid){exclusiveGrid.hidden=false;if(exclusiveGrid.previousElementSibling)exclusiveGrid.previousElementSibling.hidden=false;}
 const bannerGrid=$('banner-grid');if(bannerGrid){bannerGrid.hidden=false;if(bannerGrid.previousElementSibling)bannerGrid.previousElementSibling.hidden=false;}
 $('cosmetic-note').textContent='Rangos estáticos de JOGA. Los efectos animados y exclusivos se agregarán más adelante.';
 const wrap=$('profile-home-av').parentElement;
 const ring=COS.catalog.find(x=>x.item_key===COS.equipped.ring);const banner=COS.catalog.find(x=>x.item_key===COS.equipped.banner);
 wrap.className='profile-avatar-wrap'+(ring?' '+ring.css_class:'');const ringArt=$('profile-ring-art');ringArt.style.setProperty('background-image',ring?'url("'+ringSrc(ring.item_key)+'")':'','important');ringArt.className='ring-art '+(ring?ring.css_class:'ring-none');ringArt.hidden=!ring;const bannerEl=$('profile-banner');bannerEl.className='profile-banner '+(banner?banner.css_class:'banner-default');bannerEl.style.setProperty('background-image','url("assets/banners/'+(banner?banner.item_key:'starter_banner')+'.svg?v=20261128-8")','important');
 $('creator-badge').hidden=!COS.creator;
}
async function equipCosmetic(key){
 const b=await sb.rpc('equip_cosmetic',{p_item_key:key});
 if(b.error){toast('No se pudo equipar: '+msg(b.error));return false}
 await loadCosmetics();renderCosmetics();render();toast('Cosmético equipado.');return true;
}

const PLAN={free:'Free',elite:'Elite',premium:'Elite'};
function render(){
 if(!P)return;
 const displayName=P.display_name||'Jugador JOGA',username=P.username||'jugador',details=P.d||{},planName=PLAN[P.plan]||'Free';
 $('loc').textContent='@'+username;
 $('profile-home-name').textContent=displayName;
 $('profile-home-user').textContent='@'+username;
 $('profile-home-code').textContent='JOGA / @'+username;
 $('profile-home-position').textContent=details.favorite_position||'Sin definir';
 $('profile-home-club').textContent=details.favorite_club||'Sin definir';
 $('profile-home-bio').textContent=details.bio||'Todavía no agregaste una presentación. Editá tu perfil para contar cómo jugás.';
 $('profile-home-plan').textContent='Plan '+planName;
 setAv($('profile-home-av'),P);
 $('settings-email').textContent=(S&&S.user&&S.user.email)||'';
 setAv($('pav'),P);
 $('ph2').textContent=displayName;
 $('pchips').innerHTML='<span class="chip"></span>';
 $('pchips').firstChild.textContent='@'+username;
 $('p-dn').value=displayName;
 $('p-un').value=username;
 $('p-pos').value=details.favorite_position||'';
 $('p-club').value=details.favorite_club||'';
 $('p-bio').value=details.bio||'';
 $('bioc').textContent=$('p-bio').value.length+' de 300';
 setVis(P.visibility||'public');
 $('plan').textContent='Plan '+planName;
 $('pmail').textContent='Sesión iniciada con '+((S&&S.user&&S.user.email)||'');
 const sel=$('p-pos');
 if(details.favorite_position&&![...sel.options].some(o=>o.value===details.favorite_position)){
  sel.add(new Option(details.favorite_position,details.favorite_position));sel.value=details.favorite_position;
 }
}
async function retryProfile(){
 if(!S||!S.user)return openAuth('f-login');
 const userId=S.user.id,button=$('profile-retry');if(button)button.disabled=true;
 setProfileStatus('Actualizando tu ficha…',false);
 try{
  await loadProfile();if(!S||S.user.id!==userId)return;
  render();setProfileStatus('');
  void loadProfileExtras(userId).catch(error=>console.error('JOGA profile retry extras',error));
 }catch(error){
  console.error('JOGA profile retry failed',error);
  setProfileStatus('Todavía no pudimos cargar tu ficha. Revisá tu conexión y probá otra vez.',true);
 }finally{if(button)button.disabled=false}
}
$('profile-retry').addEventListener('click',retryProfile);
window.jogaRetryProfile=retryProfile;
let vis='public';function setVis(v){vis=v;document.querySelectorAll('#vis button').forEach(b=>b.classList.toggle('on',b.dataset.v===v))}
$('vis').addEventListener('click',e=>{if(e.target.dataset.v)setVis(e.target.dataset.v)});
$('p-bio').addEventListener('input',()=>$('bioc').textContent=$('p-bio').value.length+' de 300');
async function enter(session){
 if(!session||!session.user||!session.user.id)return;
 const userId=session.user.id;
 if(entering&&enteringUserId===userId)return;
 if(P&&S&&S.user&&S.user.id===userId&&!P._profileFallback){S=session;return}
 entering=true;enteringUserId=userId;S=session;P=createFallbackProfile(session);
 setProfileStatus('Cargando tu ficha de jugador…',false);
 $('auth').classList.remove('on');tab('home');
 try{render()}catch(initialError){console.error('JOGA initial profile render',initialError);setProfileStatus('Tu cuenta está activa, pero el perfil tuvo un error visual. Probá reintentar.',true)}
 try{
  await loadProfile();
  if(!S||S.user.id!==userId)return;
  render();setProfileStatus('');
  void loadProfileExtras(userId).catch(error=>console.error('JOGA profile extras',error));
  const ca=session.user.email_confirmed_at;
  if(/type=signup/.test(boot)||(ca&&Date.now()-new Date(ca)<300000&&/access_token|[?&]code=/.test(boot))){
   toast('Email confirmado. ¡Bienvenido a JOGA!',7000);history.replaceState(null,'',location.pathname);
  }
 }catch(error){
  console.error('JOGA profile load failed',error);
  if(S&&S.user.id===userId){
   setProfileStatus('No pudimos actualizar tu ficha desde el servidor. Mostramos los datos básicos de tu cuenta. Podés volver a intentar.',true);
   $('auth').classList.remove('on');tab('home');
   try{render()}catch(renderError){console.error('JOGA fallback render',renderError)}
  }
 }finally{if(enteringUserId===userId){entering=false;enteringUserId=null}}
}
function leave(){stopCommunityChat();P=null;S=null;entering=false;enteringUserId=null;setProfileStatus('');document.querySelectorAll('.auth input').forEach(i=>i.value='');openAuth('f-login')}

/* Community chat — public room for signed-in JOGA players */
let communityChatChannel=null,communityChatMessages=[],communityChatSending=false,lastCommunityMessageAt=0;
function communityChatStatus(label,online=false){
 const el=$('community-chat-status');if(!el)return;
 el.textContent=label;el.classList.toggle('online',!!online);
}
function renderCommunityChat(){
 const list=$('community-chat-messages');if(!list)return;
 list.innerHTML='';
 if(!communityChatMessages.length){
  const empty=document.createElement('div');empty.className='chat-empty';
  const mark=document.createElement('span');mark.className='chat-empty-ball';mark.textContent='◉';
  const title=document.createElement('b');title.textContent='La cancha está abierta.';
  const copy=document.createElement('p');copy.textContent='Sé el primero en saludar y arrancar la charla.';
  empty.append(mark,title,copy);list.append(empty);return;
 }
 const fragment=document.createDocumentFragment();
 communityChatMessages.forEach(m=>{
  const row=document.createElement('article');row.className='chat-message'+(S&&m.sender_id===S.user.id?' mine':'');
  const meta=document.createElement('div');meta.className='chat-message-meta';
  const user=document.createElement('b');user.textContent='@'+String(m.sender_username||'jugador').replace(/^@/,'');
  const stamp=document.createElement('time'),date=new Date(m.created_at);
  stamp.textContent=Number.isNaN(date.getTime())?'':date.toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'});
  meta.append(user,stamp);
  const body=document.createElement('p');body.textContent=m.body||'';
  row.append(meta,body);fragment.append(row);
 });
 list.append(fragment);list.scrollTop=list.scrollHeight;
}
function mergeCommunityChatMessages(rows){
 const byId=new Map(communityChatMessages.map(m=>[m.id,m]));
 (rows||[]).forEach(m=>{if(m&&m.id)byId.set(m.id,m)});
 communityChatMessages=[...byId.values()].sort((a,b)=>new Date(a.created_at)-new Date(b.created_at)).slice(-60);
 renderCommunityChat();
}
function stopCommunityChat(){
 if(communityChatChannel&&sb)sb.removeChannel(communityChatChannel);
 communityChatChannel=null;communityChatMessages=[];
}
function showCommunityChatError(error){
 const list=$('community-chat-messages');if(!list)return;
 list.innerHTML='';
 const card=document.createElement('div');card.className='chat-empty chat-setup-message';
 const title=document.createElement('b'),copy=document.createElement('p');
 const detail=String(error&&(error.message||error.details||error.code)||error||'');
 if(/community_messages|PGRST205|42P01|relation .* does not exist/i.test(detail)){
  title.textContent='El chat está preparado, falta activarlo.';
  copy.textContent='Todavía no está creada la tabla de mensajes en Supabase. La configuración está en supabase/community_chat_setup.sql.';
  communityChatStatus('CONFIGURACIÓN PENDIENTE');
 }else{
  title.textContent='No pudimos cargar los mensajes.';
  copy.textContent='Revisá tu conexión e intentá de nuevo.';
  communityChatStatus('SIN CONEXIÓN');
 }
 card.append(title,copy);list.append(card);
}
async function loadCommunityChat(){
 const list=$('community-chat-messages');if(!list)return;
 if(!sb){communityChatStatus('SIN CONEXIÓN');return}
 if(!S||!P){communityChatStatus('INICIÁ SESIÓN');return}
 communityChatStatus('CARGANDO');
 if(!communityChatChannel){
  communityChatChannel=sb.channel('joga-community-chat')
   .on('postgres_changes',{event:'INSERT',schema:'public',table:'community_messages'},payload=>mergeCommunityChatMessages([payload.new]))
   .subscribe(status=>{
    if(status==='SUBSCRIBED')communityChatStatus('EN VIVO',true);
    else if(status==='CHANNEL_ERROR'||status==='TIMED_OUT')communityChatStatus('REINTENTANDO');
    else if(status==='CLOSED')communityChatStatus('DESCONECTADO');
   });
 }
 try{
  const{data,error}=await sb.from('community_messages').select('id,sender_id,sender_username,body,created_at').order('created_at',{ascending:false}).limit(60);
  if(error)throw error;
  mergeCommunityChatMessages((data||[]).reverse());
 }catch(error){console.error('JOGA community chat',error);showCommunityChatError(error)}
}
const communityChatForm=$('community-chat-form');
if(communityChatForm)communityChatForm.addEventListener('submit',async e=>{
 e.preventDefault();
 const input=$('community-chat-input'),button=$('community-chat-send');
 if(!S||!P){toast('Iniciá sesión para escribir en la comunidad.');return}
 const body=input.value.trim();
 if(!body)return;
 if(body.length>500){toast('El mensaje no puede superar los 500 caracteres.');return}
 if(communityChatSending)return;
 if(Date.now()-lastCommunityMessageAt<1200){toast('Esperá un segundo antes de enviar otro mensaje.');return}
 communityChatSending=true;button.disabled=true;
 try{
  const{error}=await sb.from('community_messages').insert({sender_id:S.user.id,sender_username:P.username,body});
  if(error)throw error;
  lastCommunityMessageAt=Date.now();input.value='';$('community-chat-count').textContent='0 / 500';
  await loadCommunityChat();
 }catch(error){console.error('JOGA send community message',error);toast(/community_messages|PGRST205|42P01|does not exist/i.test(String(error.message||error))?'El chat todavía no está activado en la base de pruebas.':'No se pudo enviar el mensaje. Revisá la conexión e intentá otra vez.')}
 finally{communityChatSending=false;button.disabled=false}
});
const communityChatInput=$('community-chat-input');
if(communityChatInput)communityChatInput.addEventListener('input',()=>{$('community-chat-count').textContent=communityChatInput.value.length+' / 500'});
window.jogaCommunityRefresh=loadCommunityChat;

$('pf').addEventListener('submit',async e=>{e.preventDefault();const er=$('perr');er.textContent='';er.classList.remove('ok');
 const dn=$('p-dn').value.trim(),un=$('p-un').value.trim().toLowerCase();
 if(dn.length<1||dn.length>40){er.textContent='El nombre visible debe tener entre 1 y 40 caracteres.';return}
 if(!/^[a-z0-9_]{3,20}$/.test(un)){er.textContent='El usuario debe tener de 3 a 20 caracteres: minúsculas, números o guion bajo.';return}
 $('psave').disabled=true;
 try{const up={};if(dn!==P.display_name)up.display_name=dn;if(un!==P.username)up.username=un;if(vis!==P.visibility)up.visibility=vis;
  if(Object.keys(up).length){const{error}=await sb.from('profiles').update(up).eq('id',S.user.id);if(error)throw error}
  const det={favorite_position:$('p-pos').value||null,favorite_club:$('p-club').value.trim()||null,bio:$('p-bio').value.trim()||null};
  const{error:e2}=await sb.from('profile_details').update(det).eq('id',S.user.id);if(e2)throw e2;
  await loadProfile();render();toast('Perfil guardado.')}
 catch(x){er.textContent=msg(x)}
 $('psave').disabled=false});
$('settings-signout').addEventListener('click',()=>sb.auth.signOut());
$('phbtn').addEventListener('click',()=>$('pfile').click());
async function square(file){
 const buf=await file.arrayBuffer(),blob=new Blob([buf],{type:file.type});
 let src=null,w=0,h=0;
 if(window.createImageBitmap){try{src=await createImageBitmap(blob);w=src.width;h=src.height}catch(e){src=null}}
 if(!src){const url=URL.createObjectURL(blob);try{src=await new Promise((r,j)=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>j(new Error('el navegador no pudo abrir la imagen'));i.src=url});w=src.naturalWidth;h=src.naturalHeight}finally{URL.revokeObjectURL(url)}}
 const side=Math.min(w,h),sz=Math.min(512,side),c=document.createElement('canvas');c.width=c.height=sz;
 c.getContext('2d').drawImage(src,(w-side)/2,(h-side)/2,side,side,0,0,sz,sz);
 let o=await new Promise(r=>c.toBlob(r,'image/webp',.85));if(!o||o.type!=='image/webp')o=await new Promise(r=>c.toBlob(r,'image/png'));
 if(!o)throw new Error('no se pudo convertir la imagen');return o}
const why=x=>' ('+((x&&(x.message||x.name))||String(x))+')';
$('pfile').addEventListener('change',async ev=>{const f=ev.target.files[0];if(!f)return;const er=$('perr');er.textContent='';er.classList.remove('ok');
 if(!['image/jpeg','image/png','image/webp'].includes(f.type)){ev.target.value='';er.textContent='La foto debe ser JPG, PNG o WebP.';return}
 if(f.size>15*1024*1024){ev.target.value='';er.textContent='La foto es demasiado grande (máximo 15 MB).';return}
 $('phbtn').disabled=true;let step=0;
 try{const b=await square(f);if(b.size>2*1024*1024)throw new Error('la foto sigue pesando más de 2 MB');
  step=1;const ext=b.type==='image/png'?'png':'webp',path=S.user.id+'/avatar.'+ext,old=P.avatar_path;
  const{error}=await sb.storage.from('avatars').upload(path,b,{upsert:true,contentType:b.type});if(error)throw error;
  step=2;const{error:e2}=await sb.from('profiles').update({avatar_path:path}).eq('id',S.user.id);if(e2)throw e2;
  if(old&&old!==path)await sb.storage.from('avatars').remove([old]);
  await loadProfile();render();toast('Foto actualizada.')}
 catch(x){console.error('foto',step,x);er.textContent=['No se pudo leer o preparar la foto','No se pudo subir la foto','No se pudo guardar la foto en tu perfil'][step]+why(x)+'.'}
 finally{$('phbtn').disabled=false;ev.target.value=''}});
function tab(t){if(t==='edit'&&P)setAv($('pav'),P);document.querySelectorAll('.dock .t').forEach(b=>b.classList.toggle('on',b.dataset.t===t));
 ['home','play','explore','academy','community','players','me','edit','customize','settings'].forEach(v=>{const el=$('v-'+v);if(el)el.classList.toggle('on',t===v)});
 if(t==='me'){if(P){try{render()}catch(profileRenderError){console.error('JOGA Mi ID render',profileRenderError);setProfileStatus('No pudimos mostrar todos los datos de tu ficha. Probá actualizarla.',true)}}else if(S)setProfileStatus('Estamos cargando tu ficha de jugador…',false)}
 if(t==='players'&&window.jogaPlayersRefresh)window.jogaPlayersRefresh();
 if(t==='play'&&window.jogaMatchesRefresh)window.jogaMatchesRefresh();
 if(t==='community'&&window.jogaCommunityRefresh)window.jogaCommunityRefresh();
 $('main').scrollTo({top:0,behavior:'smooth'})}
show(0);
if(/error_description=/.test(boot)){const m=decodeURIComponent((boot.match(/error_description=([^&]+)/)||[])[1]||'').replace(/\+/g,' ');
 setTimeout(()=>{openAuth('f-login');setErr($('f-login'),/expired|invalid/i.test(m)?'El link venció o ya se usó. Pedí uno nuevo.':'No se pudo completar la acción. Probá de nuevo.')},50)}
if(sb){sb.auth.onAuthStateChange((ev,session)=>{setTimeout(()=>{
  if(ev==='PASSWORD_RECOVERY'){recovering=true;openAuth('f-reset');return}
  if(session&&!recovering)enter(session);else if(!session&&ev==='SIGNED_OUT')leave()},0)});
 sb.auth.getSession().then(({data})=>{if(data.session)enter(data.session);else if(!/error_description=|type=recovery/.test(boot))openAuth('f-login')}).catch(error=>{console.error('JOGA session restore failed',error);openAuth('f-login');setErr($('f-login'),'No pudimos recuperar tu sesión. Volvé a entrar.')})}
else{openAuth('f-login');setErr($('f-login'),'No se pudo cargar la conexión. Revisá tu internet y recargá.')}
if('serviceWorker' in navigator){addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}))}
