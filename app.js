const SB_URL='https://quiwqzxjltpyhcyccnsy.supabase.co',SB_KEY='sb_publishable_rtOGQipNhAERm5RPAw09uA_J8RMcpgB';
const boot=location.hash+location.search;
const $=id=>document.getElementById(id);
const legends=[
 {n:'Primer paso',s:'Ambición',q:'«No naciste para mirar cómo otros hacen historia.»',by:'',cr:'',t:'#c9ff1f'},
 {n:'Creé',s:'Orígenes',q:'«Mientras haya una pelota, siempre habrá una razón para creer.»',by:'',cr:'',t:'#ffb347'},
 {n:'Dejalo todo',s:'Determinación',q:'«Jugá cada partido como si fuera el que te va a cambiar la vida.»',by:'',cr:'',t:'#ff7a45'},
 {n:'Seguí',s:'Resistencia',q:'«No viniste hasta acá para dejar de creer ahora.»',by:'',cr:'',t:'#74b9e8'},
 {n:'Recordá',s:'Disciplina',q:'«Cuando todo te diga que pares, recordá por qué empezaste.»',by:'',cr:'',t:'#7be0a0'},
 {n:'Lo mejor',s:'Futuro',q:'«Tu historia todavía no llegó a la mejor parte.»',by:'',cr:'',t:'#c9ff1f'}
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
let P=null,S=null,recovering=/type=recovery/.test(boot),entering=false;
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
const initial=p=>(p.display_name||'?').trim().charAt(0).toUpperCase();
const avUrl=p=>p.avatar_path?sb.storage.from('avatars').getPublicUrl(p.avatar_path).data.publicUrl+'?v='+encodeURIComponent(p.updated_at):'';
const one=x=>Array.isArray(x)?x[0]:x;
function setAv(el,p){const u=avUrl(p);el.style.backgroundImage=u?'url("'+u+'")':'';el.textContent=u?'':initial(p)}
async function loadProfile(){const{data,error}=await sb.from('profiles').select('*, profile_details(*), profile_protected(plan)').eq('id',S.user.id).single();if(error)throw error;P=data;P.d=one(data.profile_details)||{};P.plan=(one(data.profile_protected)||{}).plan||'free';await Promise.all([loadCosmetics(),loadPlayerStats()])}
let COS={catalog:[],inventory:[],equipped:{},creator:false};
async function loadCosmetics(){
 const [cat,inv,equ,cre]=await Promise.all([
 sb.from('cosmetic_catalog').select('item_key,slot,display_name,rarity,animated,css_class,active').eq('active',true),
 sb.from('cosmetic_inventory').select('item_key').eq('user_id',S.user.id),
 sb.from('cosmetic_equipped').select('slot,item_key').eq('user_id',S.user.id),
 sb.from('creator_entitlements').select('entitlement').eq('user_id',S.user.id).eq('entitlement','creator')
 ]);
 for(const r of [cat,inv,equ,cre])if(r.error)throw r.error;
 COS.catalog=cat.data||[];COS.inventory=(inv.data||[]).map(x=>x.item_key);COS.equipped=Object.fromEntries((equ.data||[]).map(x=>[x.slot,x.item_key]));COS.creator=(cre.data||[]).length>0;
}
async function loadPlayerStats(){
 const today=new Date().toLocaleDateString('en-CA',{timeZone:'America/Argentina/Buenos_Aires'});
 const [created,participations]=await Promise.all([
 sb.from('matches').select('id',{count:'exact',head:true}).eq('organizer_id',S.user.id).neq('status','cancelled'),
 sb.from('match_participants').select('match_id,participant_status').eq('user_id',S.user.id).in('participant_status',['joined','organizer'])
 ]);
 if(created.error)throw created.error;if(participations.error)throw participations.error;
 const ids=[...new Set((participations.data||[]).map(x=>x.match_id))];
 let upcoming=0;if(ids.length){const{data,error}=await sb.from('matches').select('id,match_date,status').in('id',ids).gte('match_date',today).in('status',['open','full']);if(error)throw error;upcoming=(data||[]).length}
 $('stat-created').textContent=created.count??0;$('stat-joined').textContent=ids.length;$('stat-upcoming').textContent=upcoming;
}

function renderCosmetics(){
 const grid=$('cosmetic-grid');if(!grid)return;
 const rings=COS.catalog.filter(x=>x.slot==='ring');const banners=COS.catalog.filter(x=>x.slot==='banner');
 grid.innerHTML='';
 for(const item of rings){
 const owned=COS.creator||COS.inventory.includes(item.item_key),equipped=COS.equipped.ring===item.item_key;
 const card=document.createElement('button');card.type='button';card.className='cosmetic-card'+(equipped?' equipped':'')+(owned?' owned':' locked');
 card.disabled=!owned;
 card.innerHTML='<div class="cosmetic-demo '+item.css_class+'"><div class="cosmetic-avatar">J</div></div><h3></h3><small></small><span class="cosmetic-status"></span>';
 card.querySelector('h3').textContent=item.display_name;
 card.querySelector('small').textContent=item.animated?'Animado':'Estático';
 card.querySelector('.cosmetic-status').textContent=equipped?'Equipado':owned?'Tocar para equipar':'Bloqueado';
 if(owned&&!equipped)card.addEventListener('click',()=>equipCosmetic(item.item_key));
 grid.append(card)
 }
 
 const bg=$('banner-grid');if(bg){bg.innerHTML='';for(const item of banners){const owned=COS.creator||COS.inventory.includes(item.item_key),equipped=COS.equipped.banner===item.item_key;const card=document.createElement('button');card.type='button';card.className='cosmetic-card'+(equipped?' equipped':'')+(owned?' owned':' locked');card.disabled=!owned;card.innerHTML='<div class="banner-demo '+item.css_class+'"></div><h3></h3><small></small><span class="cosmetic-status"></span>';card.querySelector('h3').textContent=item.display_name;card.querySelector('small').textContent=item.animated?'Animado':'Estático';card.querySelector('.cosmetic-status').textContent=equipped?'Equipado':owned?'Tocar para equipar':'Bloqueado';if(owned&&!equipped)card.addEventListener('click',()=>equipCosmetic(item.item_key));bg.append(card)}}
 $('cosmetic-note').textContent=COS.creator?'Cuenta Creador: todos los cosméticos actuales y futuros disponibles.': 'Los cosméticos bloqueados se desbloquearán con logros, eventos o planes. Por ahora tenés el aro inicial.';
 const wrap=$('profile-home-av').parentElement;
 const ring=COS.catalog.find(x=>x.item_key===COS.equipped.ring);const banner=COS.catalog.find(x=>x.item_key===COS.equipped.banner);
 wrap.className='profile-avatar-wrap '+(ring?ring.css_class:'ring-default');const bannerEl=$('profile-banner');bannerEl.className='profile-banner '+(banner?banner.css_class:'banner-default');
 $('creator-badge').hidden=!COS.creator;
}
async function equipCosmetic(key){
 const b=await sb.rpc('equip_cosmetic',{p_item_key:key});
 if(b.error){toast('No se pudo equipar: '+msg(b.error));return}
 await loadCosmetics();renderCosmetics();render();toast('Cosmético equipado.');
}

const PLAN={free:'Free',elite:'Elite',premium:'Elite'};
function render(){if(!P)return;
 $('loc').textContent='@'+P.username;
 $('profile-home-name').textContent=P.display_name;$('profile-home-user').textContent='@'+P.username;$('profile-home-plan').textContent='Plan '+PLAN[P.plan];setAv($('profile-home-av'),P);$('settings-email').textContent=S.user.email;renderCosmetics();
 $('wc').innerHTML='<div class="av" id="wav"></div><div><b></b><span class="u"></span><span class="chip pl"></span><span class="chip"></span></div>';
 const w=$('wc');w.querySelector('b').textContent='Hola, '+P.display_name;w.querySelector('.u').textContent='@'+P.username;
 const c=w.querySelectorAll('.chip');c[0].textContent='Plan '+PLAN[P.plan];c[1].textContent=P.visibility==='public'?'Perfil público':'Perfil privado';setAv($('wav'),P);
 setAv($('pav'),P);$('ph2').textContent=P.display_name;
 $('pchips').innerHTML='<span class="chip"></span>';$('pchips').firstChild.textContent='@'+P.username;
 $('p-dn').value=P.display_name;$('p-un').value=P.username;$('p-pos').value=P.d.favorite_position||'';$('p-club').value=P.d.favorite_club||'';$('p-bio').value=P.d.bio||'';
 $('bioc').textContent=$('p-bio').value.length+' de 300';
 setVis(P.visibility);$('plan').textContent='Plan '+PLAN[P.plan];$('pmail').textContent='Sesión iniciada con '+S.user.email;
 const sel=$('p-pos');if(P.d.favorite_position&&![...sel.options].some(o=>o.value===P.d.favorite_position)){sel.add(new Option(P.d.favorite_position,P.d.favorite_position));sel.value=P.d.favorite_position}}
let vis='public';function setVis(v){vis=v;document.querySelectorAll('#vis button').forEach(b=>b.classList.toggle('on',b.dataset.v===v))}
$('vis').addEventListener('click',e=>{if(e.target.dataset.v)setVis(e.target.dataset.v)});
$('p-bio').addEventListener('input',()=>$('bioc').textContent=$('p-bio').value.length+' de 300');
async function enter(session){if(P&&S&&S.user.id===session.user.id){S=session;return}if(entering)return;entering=true;S=session;
 try{await loadProfile();render();$('auth').classList.remove('on');tab('home');
  const ca=session.user.email_confirmed_at;if(/type=signup/.test(boot)||(ca&&Date.now()-new Date(ca)<300000&&/access_token|[?&]code=/.test(boot))){toast('Email confirmado. ¡Bienvenido a JOGA!',7000);history.replaceState(null,'',location.pathname)}}
 catch(e){toast('No pudimos cargar tu perfil. '+msg(e));openAuth('f-login')}
 entering=false}
function leave(){P=null;S=null;document.querySelectorAll('.auth input').forEach(i=>i.value='');openAuth('f-login')}
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
$('pout').addEventListener('click',()=>sb.auth.signOut());$('settings-signout').addEventListener('click',()=>sb.auth.signOut());
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
const other={play:['Jugar','Encontrá una pichanga o armá la tuya.'],street:['La calle','Publicaciones y comunidad llegan en una etapa posterior.']};
function tab(t){document.querySelectorAll('.dock .t').forEach(b=>b.classList.toggle('on',b.dataset.t===t));
 const home=t==='home'||t==='play';$('v-home').classList.toggle('on',home);['me','edit','customize','settings'].forEach(v=>{const el=$('v-'+v);if(el)el.classList.toggle('on',t===v)});$('v-other').classList.toggle('on',t==='street');
 if(t==='play'){setTimeout(()=>{const el=document.querySelector('#v-home .sec');if(el)el.scrollIntoView({behavior:'smooth',block:'start'});if(window.jogaMatchesRefresh)window.jogaMatchesRefresh()},80)}
 if(other[t]){$('oT').textContent=other[t][0];$('oP').textContent=other[t][1]}if(t!=='play')$('main').scrollTo({top:0})}
show(0);
if(/error_description=/.test(boot)){const m=decodeURIComponent((boot.match(/error_description=([^&]+)/)||[])[1]||'').replace(/\+/g,' ');
 setTimeout(()=>{openAuth('f-login');setErr($('f-login'),/expired|invalid/i.test(m)?'El link venció o ya se usó. Pedí uno nuevo.':'No se pudo completar la acción. Probá de nuevo.')},50)}
if(sb){sb.auth.onAuthStateChange((ev,session)=>{setTimeout(()=>{
  if(ev==='PASSWORD_RECOVERY'){recovering=true;openAuth('f-reset');return}
  if(session&&!recovering)enter(session);else if(!session&&ev==='SIGNED_OUT')leave()},0)});
 sb.auth.getSession().then(({data})=>{if(!data.session&&!/error_description=|type=recovery/.test(boot))openAuth('f-login')})}
else{openAuth('f-login');setErr($('f-login'),'No se pudo cargar la conexión. Revisá tu internet y recargá.')}
if('serviceWorker' in navigator){addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}))}
