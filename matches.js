(()=> {
const $m=id=>document.getElementById(id);
const list=$m('match-list');
let cached=[],sheet=null,loadSeq=0,activeSearch='',deepMatchId=new URLSearchParams(location.search).get('match');
const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const argentinaParts=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Argentina/Buenos_Aires',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date()).reduce((o,p)=>(o[p.type]=p.value,o),{});
const today=()=>{const p=argentinaParts();return p.year+'-'+p.month+'-'+p.day};
const nowArgentina=()=>{const p=argentinaParts();return p.hour+':'+p.minute};
const dateFmt=d=>new Date(d+'T12:00:00').toLocaleDateString('es-AR',{weekday:'short',day:'numeric',month:'short'});
const timeFmt=t=>(t||'').slice(0,5); 
const isUpcoming=m=>m.match_date>today()||(m.match_date===today()&&timeFmt(m.start_time)>nowArgentina());
const modName=m=>m.modality==='otro'?m.custom_modality:m.modality; 
const ageLabel=m=>m.min_age&&m.max_age?'Edad '+m.min_age+'–'+m.max_age:m.min_age?'Edad '+m.min_age+'+':m.max_age?'Hasta '+m.max_age+' años':'Todas las edades (13+)'; 
const friendlyError=e=>{const msg=String(e?.message||e||'');const map=[[/age_below_match_limit/i,'No cumplís la edad mínima de este partido.'],[/cancel_not_allowed/i,'Solo quien organiza puede cancelar este partido.'],[/match_not_found/i,'No encontramos este partido.'],[/matches_title_check/i,'El título debe tener entre 3 y 80 caracteres.'],[/matches_area_check/i,'Ingresá una localidad y provincia válidas.'],[/matches_max_players_check/i,'La cantidad de jugadores debe estar entre 4 y 44.'],[/matches_cost_per_player_check/i,'El precio por jugador no puede ser negativo.'],[/age_above_match_limit/i,'Superás la edad máxima permitida.'],[/birth_date_required/i,'Completá tu fecha de nacimiento en tu perfil.'],[/match_full/i,'El partido está completo.'],[/already_participating/i,'Ya estás anotado en este partido.'],[/private_match_requires_invitation/i,'Este partido es privado y requiere invitación.'],[/match_not_joinable|match_expired/i,'Este partido ya no acepta jugadores.'],[/auth_required/i,'Iniciá sesión para continuar.'],[/invalid_age_range/i,'El rango de edades no es válido.'],[/private_match_unavailable/i,'Los partidos privados todavía no están habilitados.'],[/custom_modality_required/i,'Especificá la modalidad elegida.'],[/invalid_modality/i,'Elegí una modalidad válida.'],[/match_must_be_future/i,'Elegí una fecha y hora futuras.'],[/organizer_must_cancel_or_transfer/i,'Como organizador, tenés que cancelar o transferir el partido.'],[/not_participating/i,'No figurás como participante de este partido.']];for(const [rx,text] of map)if(rx.test(msg))return text;return msg||'Revisá los datos e intentá nuevamente.'};
const closeSheet=()=>{if(sheet){sheet.classList.remove('on');sheet.remove();sheet=null}};
function ensureSheet(){if(sheet)return sheet;sheet=document.createElement('div');sheet.className='match-sheet';sheet.id='match-sheet';$m('app').append(sheet);return sheet}
function notice(t){if(typeof toast==='function')toast(t);else alert(t)}
function filterMatchCards(){
 const q=($m('match-search')?.value||'').trim().toLocaleLowerCase('es-AR').replace(/[^\p{L}\p{N}\s-]/gu,' ').replace(/\s+/g,' ').trim();
 const modality=$m('match-modality-filter')?.value||'',cost=$m('match-cost-filter')?.value||'',dateMode=$m('match-date-filter')?.value||'';
 const todayStr=today(),todayUTC=Date.parse(todayStr+'T00:00:00Z'),weekEnd=todayUTC+6*86400000;
 const todayDow=new Date(todayStr+'T12:00:00Z').getUTCDay(),friOffset=(5-todayDow+7)%7,weekendStart=todayUTC+(todayDow===5||todayDow===6||todayDow===0?0:friOffset)*86400000,weekendDays=todayDow===5?2:todayDow===6?1:todayDow===0?0:2,weekendEnd=weekendStart+weekendDays*86400000;
 let found=0;
 list.querySelectorAll('.match-card').forEach(card=>{
  const text=card.textContent.toLocaleLowerCase('es-AR'),mod=card.dataset.modality||'',price=card.dataset.cost||'',date=card.dataset.date||'';
  const dateUTC=Date.parse(date+'T00:00:00Z');
  const okText=!q||text.includes(q),okMod=!modality||mod===modality,okCost=!cost||(cost==='free'?price==='0':price!=='0');
  const okDate=!dateMode||(dateMode==='today'?date===todayStr:dateMode==='7days'?dateUTC>=todayUTC&&dateUTC<=weekEnd:dateMode==='weekend'?dateUTC>=weekendStart&&dateUTC<=weekendEnd:true);
  const ok=okText&&okMod&&okCost&&okDate;card.hidden=!ok;if(ok)found++;
 });
 let empty=list.querySelector('.match-filter-empty');
 const hasFilters=!!q||!!modality||!!cost||!!dateMode;
 if(hasFilters&&found===0&&list.querySelectorAll('.match-card').length>0){if(!empty){empty.remove()}empty=document.createElement('div');empty.className='empty match-filter-empty';empty.innerHTML='No encontramos partidos con esos filtros.<br><button type="button" class="btn match-empty-create" onclick="document.getElementById(\'match-create\')?.click()">Crear una pichanga</button>';list.append(empty)}else if(empty)empty.remove()
}
async function loadMatches(searchText=activeSearch){
 activeSearch=String(searchText||'').trim();searchText=activeSearch;
 const seq=++loadSeq;
 if(!sb||!S){list.innerHTML='<p class="empty">Iniciá sesión para ver los partidos.</p>';return}
 list.innerHTML='<p class="empty">Buscando pichangas…</p>';
 try{
  let query=sb.from('matches').select('id,organizer_id,title,modality,custom_modality,match_date,start_time,area,venue_name,venue_type,max_players,cost_per_player,level_hint,description,is_private,allow_waitlist,status,min_age,max_age,organizer_is_minor').in('status',['open','full']).gte('match_date',today()).order('match_date').order('start_time');
  if(searchText)query=query.or('title.ilike.%'+searchText+'%,area.ilike.%'+searchText+'%,modality.ilike.%'+searchText+'%,custom_modality.ilike.%'+searchText+'%,venue_name.ilike.%'+searchText+'%');
  const {data,error}=await query.limit(100);
  if(error)throw error;
  if(seq!==loadSeq)return;
  cached=(data||[]).filter(isUpcoming);
  if(!cached.length){list.innerHTML='<p class="empty">'+(searchText?'No encontramos partidos con esa búsqueda.':'Todavía no hay partidos. ¡Podés crear el primero!')+'</p>';return}
  const ids=[...new Set(cached.map(m=>m.organizer_id))];
  const [peopleResult,partsResult]=await Promise.all([
   sb.from('profiles').select('id,display_name,username').in('id',ids),
   sb.from('match_participants').select('match_id,user_id,participant_status').in('match_id',cached.map(m=>m.id)).in('participant_status',['organizer','joined','waitlisted'])
  ]);
  if(seq!==loadSeq)return;
  if(peopleResult.error)throw peopleResult.error;
  if(partsResult.error)throw partsResult.error;
  const people=peopleResult.data||[],parts=partsResult.data||[];
  const pmap=Object.fromEntries(people.map(p=>[p.id,p]));
  const counts={},waits={},own={};parts.forEach(p=>{if(p.participant_status==='waitlisted')waits[p.match_id]=(waits[p.match_id]||0)+1;else counts[p.match_id]=(counts[p.match_id]||0)+1;if(p.user_id===S.user.id)own[p.match_id]=p.participant_status});
  list.innerHTML=cached.map(m=>{
   const host=pmap[m.organizer_id]||{},count=counts[m.id]||0,stat=own[m.id];
   const age=ageLabel(m);
   return '<article class="match-card" data-modality="'+escapeHtml(m.modality||'')+'" data-cost="'+Number(m.cost_per_player||0)+'" data-date="'+escapeHtml(m.match_date)+'"><div class="match-head"><div><h3>'+escapeHtml(m.title)+'</h3><div class="match-meta">'+escapeHtml(modName(m))+' · '+escapeHtml(dateFmt(m.match_date))+' · '+escapeHtml(timeFmt(m.start_time))+'</div></div><span class="match-badge">'+(m.status==='full'?'Completo':'Abierto')+'</span></div><div class="match-meta">📍 '+escapeHtml(m.area)+(m.venue_name?' · '+escapeHtml(m.venue_name):'')+'<br>👤 '+escapeHtml(host.display_name||host.username||'Organizador')+' · '+count+'/'+m.max_players+' jugadores'+(waits[m.id]?' · '+waits[m.id]+' en espera':'')+'<br>💰 '+(Number(m.cost_per_player)===0?'Gratis':'$'+Number(m.cost_per_player).toLocaleString('es-AR'))+' por jugador</div><div class="match-badges">'+(m.organizer_is_minor?'<span class="match-badge minor">Organizador menor de edad</span>':'')+(m.is_private?'<span class="match-badge">Privado</span>':'')+'<span class="match-badge">'+escapeHtml(age)+'</span>'+(m.allow_waitlist?'<span class="match-badge">Lista de espera</span>':'')+'</div><div class="match-actions"><button data-detail="'+m.id+'">Ver partido</button>'+(stat==='joined'?'<button class="secondary" data-leave="'+m.id+'">Bajarme</button>':stat==='waitlisted'?'<button class="secondary" data-leave="'+m.id+'">Salir de espera</button>':m.organizer_id===S.user.id?'<button class="secondary" data-cancel="'+m.id+'">Cancelar partido</button>':'')+'</div></article>'
  }).join('');filterMatchCards();
  if(deepMatchId){const target=deepMatchId;deepMatchId=null;history.replaceState(null,'',location.pathname+location.hash);if(cached.some(x=>x.id===target))showDetails(target);else notice('Ese partido ya no está disponible para sumarte.')}
 }catch(e){if(seq!==loadSeq)return;console.error('JOGA matches',e);list.innerHTML='<p class="empty">No pudimos cargar los partidos. Revisá tu conexión e intentá de nuevo.</p>'}
}
function createForm(){
 const s=ensureSheet();s.innerHTML='<button class="close" type="button" data-close>← Volver</button><h2>Crear pichanga</h2><p class="info">Organizar está permitido para cualquier edad. Tu fecha de nacimiento no se publica.</p><form id="match-form"><label>Nombre del partido</label><input name="title" required maxlength="80" placeholder="Ej. Fútbol del sábado"><label>Modalidad</label><select name="modality"><option>5v5</option><option>3v3</option><option>4v4</option><option>6v6</option><option>7v7</option><option>8v8</option><option>9v9</option><option>11v11</option><option value="otro">Otra</option></select><label>Si elegís otra, especificá</label><input name="custom" maxlength="40"><div class="row2"><div><label>Fecha</label><input type="date" name="date" required min="'+today()+'"></div><div><label>Hora</label><input type="time" name="time" required></div></div><label>Localidad / ciudad</label><input name="city" required maxlength="65" placeholder="Ej. Garuhapé"><label>Provincia</label><select name="province" required><option value="" selected disabled>Elegí una provincia</option><option>Buenos Aires</option><option>Catamarca</option><option>Chaco</option><option>Chubut</option><option>Ciudad Autónoma de Buenos Aires</option><option>Córdoba</option><option>Corrientes</option><option>Entre Ríos</option><option>Formosa</option><option>Jujuy</option><option>La Pampa</option><option>La Rioja</option><option>Mendoza</option><option>Misiones</option><option>Neuquén</option><option>Río Negro</option><option>Salta</option><option>San Juan</option><option>San Luis</option><option>Santa Cruz</option><option>Santa Fe</option><option>Santiago del Estero</option><option>Tierra del Fuego</option><option>Tucumán</option></select><p class="info">JOGA está abierta a partidos de todo el país. Indicá tu localidad y provincia.</p><label>Nombre del lugar (opcional)</label><input name="venue" maxlength="100" placeholder="Cancha / plaza"><label>Tipo de cancha</label><input name="venue_type" maxlength="60" placeholder="Sintético, cemento, tierra…"><div class="row2"><div><label>Cantidad máxima</label><input type="number" name="max" min="4" max="44" value="10" required></div><div><label>Precio por jugador</label><input type="number" name="cost" min="0" step="100" value="0"></div></div><div class="row2"><div><label>Edad mínima (opcional)</label><input type="number" name="min_age" min="13" max="99" placeholder="Sin límite"></div><div><label>Edad máxima (opcional)</label><input type="number" name="max_age" min="13" max="99" placeholder="Sin límite"></div></div><label>Descripción</label><textarea name="desc" maxlength="1200" placeholder="Detalles, reglas, qué llevar…"></textarea><label>Dirección exacta (privada)</label><input name="address" maxlength="250" placeholder="Se comparte solo con participantes"><label>Notas para llegar (privadas)</label><textarea name="notes" maxlength="500"></textarea><p class="info">Los partidos privados y las invitaciones se habilitarán en una próxima etapa.</p><label><input type="checkbox" name="waitlist" checked> Permitir lista de espera</label><p class="err" id="merr"></p><button class="btn" type="submit">Publicar partido</button></form>';
 s.classList.add('on');s.querySelector('[data-close]').onclick=closeSheet;
 const form=s.querySelector('#match-form'),modality=form.elements.modality,custom=form.elements.custom,customLabel=custom.previousElementSibling;
 const syncCustomModality=()=>{const needs=modality.value==='otro';custom.required=needs;custom.hidden=!needs;customLabel.hidden=!needs;};
 modality.addEventListener('change',syncCustomModality);syncCustomModality();
 form.onsubmit=async e=>{
  e.preventDefault();const f=e.currentTarget,fd=new FormData(f),err=s.querySelector('#merr'),submit=f.querySelector('button[type=submit]');submit.disabled=true;err.textContent='';
  const v=k=>String(fd.get(k)||'').trim(),min=v('min_age')?Number(v('min_age')):null,max=v('max_age')?Number(v('max_age')):null;
  if(v('modality')==='otro'&&!v('custom')){err.textContent='Especificá la modalidad del partido.';submit.disabled=false;return}
  if(min!==null&&min<13||max!==null&&max<13){err.textContent='Los límites de edad deben ser de 13 años o más.';submit.disabled=false;return}
  if(min!==null&&max!==null&&min>max){err.textContent='La edad mínima no puede ser mayor a la máxima.';submit.disabled=false;return}
  if(v('date')<today()||(v('date')===today()&&v('time')<=nowArgentina())){err.textContent='Elegí una fecha y hora futuras. El partido no puede empezar en el pasado.';submit.disabled=false;return}
  try{
   const {data,error}=await sb.rpc('create_match',{p_title:v('title'),p_modality:v('modality'),p_custom_modality:v('custom')||null,p_match_date:v('date'),p_start_time:v('time'),p_area:v('city')+', '+v('province'),p_venue_name:v('venue')||null,p_venue_type:v('venue_type')||null,p_max_players:Number(v('max')),p_cost_per_player:Number(v('cost')||0),p_level_hint:null,p_description:v('desc'),p_is_private:false,p_allow_waitlist:fd.has('waitlist'),p_exact_address:v('address')||null,p_location_notes:v('notes')||null,p_min_age:min,p_max_age:max});
   if(error)throw error;closeSheet();notice('¡Partido publicado!');await loadMatches();await showDetails(data)
  }catch(x){err.textContent='No se pudo publicar: '+friendlyError(x);console.error(x)}finally{submit.disabled=false}
 };
}
async function shareMatch(id){
 const m=cached.find(x=>x.id===id);if(!m)return;
 const url=new URL(location.origin+location.pathname);url.searchParams.set('match',id);
 const text='Sumate a esta pichanga en JOGA: '+(m.title||'Partido')+' · '+(m.area||'');
 try{if(navigator.share){await navigator.share({title:'JOGA · '+(m.title||'Partido'),text,url:url.toString()});return}
  if(navigator.clipboard&&navigator.clipboard.writeText){await navigator.clipboard.writeText(url.toString());notice('Link del partido copiado.');return}
  window.prompt('Copiá el link del partido:',url.toString());
 }catch(e){if(e&&e.name!=='AbortError')notice('No pudimos compartir el link.');}
}
async function showDetails(id){
 const m=cached.find(x=>x.id===id);if(!m)return;
 const s=ensureSheet();s.innerHTML='<button class="close" data-close>← Volver</button><h2>'+escapeHtml(m.title)+'</h2><p class="info">Cargando detalles…</p>';s.classList.add('on');s.querySelector('[data-close]').onclick=closeSheet;
 try{
  const [participantsResult,locationResult]=await Promise.all([
   sb.from('match_participants').select('user_id,participant_status').eq('match_id',id).in('participant_status',['organizer','joined','waitlisted']),
   sb.from('match_private_location').select('exact_address,location_notes').eq('match_id',id).maybeSingle()
  ]);
  if(participantsResult.error)throw participantsResult.error;
  if(locationResult.error)throw locationResult.error;
  const participants=participantsResult.data,privateLoc=locationResult.data;
  const rows=participants||[],status=rows.find(x=>x.user_id===S.user.id)?.participant_status,organizer=m.organizer_id===S.user.id,count=rows.filter(x=>['organizer','joined'].includes(x.participant_status)).length,waitCount=rows.filter(x=>x.participant_status==='waitlisted').length;
  const names=[];if(rows.length){const ids=[...new Set(rows.map(x=>x.user_id))];const {data:ps,error:profileError}=await sb.from('profiles').select('id,display_name,username').in('id',ids);if(profileError)throw profileError;const pm=Object.fromEntries((ps||[]).map(p=>[p.id,p]));rows.forEach(r=>{const p=pm[r.user_id];if(p)names.push((p.display_name||p.username)+' · '+r.participant_status)})}
  let buttons=organizer?'<button data-cancel="'+id+'">Cancelar partido</button>':status==='joined'||status==='waitlisted'?'<button class="secondary" data-leave="'+id+'">Salir del partido</button>':(m.status==='open'||(m.status==='full'&&m.allow_waitlist))?'<button data-join="'+id+'">'+(m.status==='full'?'Entrar a la lista de espera':'Sumarme')+'</button>':'<span class="match-badge">Completo</span>';
  const location=privateLoc&&privateLoc.exact_address?'<p class="info"><b>Dirección privada:</b> '+escapeHtml(privateLoc.exact_address)+(privateLoc.location_notes?'<br>'+escapeHtml(privateLoc.location_notes):'')+'</p>':'';
  s.innerHTML='<button class="close" data-close>← Volver</button><h2>'+escapeHtml(m.title)+'</h2><div class="match-meta">'+escapeHtml(modName(m))+' · '+escapeHtml(dateFmt(m.match_date))+' · '+escapeHtml(timeFmt(m.start_time))+'<br>Zona: '+escapeHtml(m.area)+(m.venue_name?' · '+escapeHtml(m.venue_name):'')+'<br>Precio: '+(Number(m.cost_per_player)===0?'Gratis':'$'+Number(m.cost_per_player).toLocaleString('es-AR'))+'<br>'+count+'/'+m.max_players+' confirmados'+(waitCount?' · '+waitCount+' en espera':'')+(m.organizer_is_minor?'<br><span class="match-badge minor">Organizador menor de edad</span>':'')+(m.min_age||m.max_age?'<br>'+escapeHtml(ageLabel(m)):'')+'</div><p>'+escapeHtml(m.description||'Sin descripción adicional.')+'</p>'+location+'<h3>Participantes</h3><p class="info">'+escapeHtml(names.join('\n'))+'</p><div class="match-actions">'+buttons+'<button class="secondary" data-share="'+id+'">Compartir</button></div>';
  s.querySelector('[data-close]').onclick=closeSheet;
 }catch(x){s.innerHTML='<button class="close" data-close>← Volver</button><p class="err">No pudimos mostrar los detalles: '+escapeHtml(x.message)+'</p>';s.querySelector('[data-close]').onclick=closeSheet}
}
async function act(name,id){try{const {data,error}=await sb.rpc(name,{p_match_id:id});if(error)throw error;notice(name==='join_match'?(data==='waitlisted'?'Entraste a la lista de espera.':'¡Ya estás anotado!'):name==='leave_match'?(data==='left_waitlist'?'Saliste de la lista de espera.':data==='left_and_promoted'?'Te bajaste y se liberó el lugar para alguien de la espera.':'Te bajaste del partido.'): 'Partido cancelado.');closeSheet();await loadMatches()}catch(e){notice('No se pudo completar: '+friendlyError(e))}}
document.addEventListener('click',e=>{
 const t=e.target.closest('[data-detail],[data-join],[data-leave],[data-cancel],[data-share]');
 if(!t)return;
 if(t.dataset.detail)showDetails(t.dataset.detail);
 if(t.dataset.join)act('join_match',t.dataset.join);
 if(t.dataset.leave)act('leave_match',t.dataset.leave);
 if(t.dataset.cancel){if(confirm('¿Cancelar este partido?'))act('cancel_match',t.dataset.cancel)}
 if(t.dataset.share)shareMatch(t.dataset.share);
});
let searchTimer;
$m('match-search')?.addEventListener('input',()=>{filterMatchCards();clearTimeout(searchTimer);const q=$m('match-search').value.trim().toLocaleLowerCase('es-AR').replace(/[^\p{L}\p{N}\s-]/gu,' ').replace(/\s+/g,' ').trim();searchTimer=setTimeout(()=>loadMatches(q),350)});
$m('match-modality-filter')?.addEventListener('change',filterMatchCards);$m('match-cost-filter')?.addEventListener('change',filterMatchCards);$m('match-date-filter')?.addEventListener('change',filterMatchCards);
const clearBtn=$m('match-filter-clear');const syncClear=()=>{if(clearBtn)clearBtn.hidden=!($m('match-search').value.trim()||$m('match-modality-filter').value||$m('match-cost-filter').value||$m('match-date-filter').value)};['match-search','match-modality-filter','match-cost-filter','match-date-filter'].forEach(id=>$m(id)?.addEventListener('input',syncClear));['match-modality-filter','match-cost-filter','match-date-filter'].forEach(id=>$m(id)?.addEventListener('change',syncClear));clearBtn?.addEventListener('click',()=>{$m('match-search').value='';$m('match-modality-filter').value='';$m('match-cost-filter').value='';$m('match-date-filter').value='';syncClear();loadMatches('')});
$m('match-create').addEventListener('click',()=>{if(!S){openAuth('f-login');return}createForm()});
// expose a refresh hook after successful sign-in
window.jogaMatchesRefresh=loadMatches;
if(S)loadMatches();
if(sb)sb.auth.onAuthStateChange(()=>setTimeout(()=>{if(S)loadMatches()},50));
setInterval(()=>{if(S)loadMatches()},90000);
})();
