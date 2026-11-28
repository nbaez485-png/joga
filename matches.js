(()=> {
const $m=id=>document.getElementById(id);
const list=$m('match-list');
let cached=[],sheet=null;
const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const today=()=>{const d=new Date(),y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return y+'-'+m+'-'+day};
const dateFmt=d=>new Date(d+'T12:00:00').toLocaleDateString('es-AR',{weekday:'short',day:'numeric',month:'short'});
const timeFmt=t=>(t||'').slice(0,5);\nconst isUpcoming=m=>m.match_date>today()||(m.match_date===today()&&timeFmt(m.start_time)>new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false}));
const modName=m=>m.modality==='otro'?m.custom_modality:m.modality; 
const ageLabel=m=>m.min_age&&m.max_age?'Edad '+m.min_age+'–'+m.max_age:m.min_age?'Edad '+m.min_age+'+':m.max_age?'Hasta '+m.max_age+' años':'Todas las edades (13+)'; 
const friendlyError=e=>{const msg=String(e?.message||e||'');const map=[[/age_below_match_limit/i,'No cumplís la edad mínima de este partido.'],[/age_above_match_limit/i,'Superás la edad máxima permitida.'],[/birth_date_required/i,'Completá tu fecha de nacimiento en tu perfil.'],[/match_full/i,'El partido está completo.'],[/already_participating/i,'Ya estás anotado en este partido.'],[/private_match_requires_invitation/i,'Este partido es privado y requiere invitación.'],[/match_not_joinable|match_expired/i,'Este partido ya no acepta jugadores.'],[/auth_required/i,'Iniciá sesión para continuar.'],[/invalid_age_range/i,'El rango de edades no es válido.'],[/match_must_be_future/i,'Elegí una fecha y hora futuras.'],[/organizer_must_cancel_or_transfer/i,'Como organizador, tenés que cancelar o transferir el partido.'],[/not_participating/i,'No figurás como participante de este partido.']];for(const [rx,text] of map)if(rx.test(msg))return text;return msg||'Revisá los datos e intentá nuevamente.'};
const closeSheet=()=>{if(sheet){sheet.classList.remove('on');sheet.remove();sheet=null}};
function ensureSheet(){if(sheet)return sheet;sheet=document.createElement('div');sheet.className='match-sheet';sheet.id='match-sheet';$m('app').append(sheet);return sheet}
function notice(t){if(typeof toast==='function')toast(t);else alert(t)}
async function loadMatches(){
 if(!sb||!S){list.innerHTML='<p class="empty">Iniciá sesión para ver los partidos.</p>';return}
 list.innerHTML='<p class="empty">Buscando pichangas…</p>';
 try{
  const {data,error}=await sb.from('matches').select('id,organizer_id,title,modality,custom_modality,match_date,start_time,area,venue_name,venue_type,max_players,cost_per_player,level_hint,description,is_private,allow_waitlist,status,min_age,max_age,organizer_is_minor').in('status',['open','full']).gte('match_date',today()).order('match_date').order('start_time').limit(30);
  if(error)throw error;
  cached=(data||[]).filter(isUpcoming);
  if(!cached.length){list.innerHTML='<p class="empty">Todavía no hay partidos. ¡Podés crear el primero!</p>';return}
  const ids=[...new Set(cached.map(m=>m.organizer_id))];
  const [{data:people},{data:parts}]=await Promise.all([
   sb.from('profiles').select('id,display_name,username').in('id',ids),
   sb.from('match_participants').select('match_id,user_id,participant_status').in('match_id',cached.map(m=>m.id)).in('participant_status',['organizer','joined','waitlisted'])
  ]);
  const pmap=Object.fromEntries((people||[]).map(p=>[p.id,p]));
  const counts={},waits={},own={};(parts||[]).forEach(p=>{if(p.participant_status==='waitlisted')waits[p.match_id]=(waits[p.match_id]||0)+1;else counts[p.match_id]=(counts[p.match_id]||0)+1;if(p.user_id===S.user.id)own[p.match_id]=p.participant_status});
  list.innerHTML=cached.map(m=>{
   const host=pmap[m.organizer_id]||{},count=counts[m.id]||0,stat=own[m.id];
   const age=ageLabel(m);
   return '<article class="match-card"><div class="match-head"><div><h3>'+escapeHtml(m.title)+'</h3><div class="match-meta">'+escapeHtml(modName(m))+' · '+escapeHtml(dateFmt(m.match_date))+' · '+escapeHtml(timeFmt(m.start_time))+'</div></div><span class="match-badge">'+(m.status==='full'?'Completo':'Abierto')+'</span></div><div class="match-meta">📍 '+escapeHtml(m.area)+(m.venue_name?' · '+escapeHtml(m.venue_name):'')+'<br>👤 '+escapeHtml(host.display_name||host.username||'Organizador')+' · '+count+'/'+m.max_players+' jugadores'+(waits[m.id]?' · '+waits[m.id]+' en espera':'')+'<br>💰 '+(Number(m.cost_per_player)===0?'Gratis':'$'+Number(m.cost_per_player).toLocaleString('es-AR'))+' por jugador</div><div class="match-badges">'+(m.organizer_is_minor?'<span class="match-badge minor">Organizador menor de edad</span>':'')+(m.is_private?'<span class="match-badge">Privado</span>':'')+'<span class="match-badge">'+escapeHtml(age)+'</span>'+(m.allow_waitlist?'<span class="match-badge">Lista de espera</span>':'')+'</div><div class="match-actions"><button data-detail="'+m.id+'">Ver partido</button>'+(stat==='joined'?'<button class="secondary" data-leave="'+m.id+'">Bajarme</button>':stat==='waitlisted'?'<button class="secondary" data-leave="'+m.id+'">Salir de espera</button>':m.organizer_id===S.user.id?'<button class="secondary" data-cancel="'+m.id+'">Cancelar partido</button>':'')+'</div></article>'
  }).join('');
 }catch(e){console.error('JOGA matches',e);list.innerHTML='<p class="empty">No pudimos cargar los partidos. '+escapeHtml(e.message||'')+'</p>'}
}
function createForm(){
 const s=ensureSheet();s.innerHTML='<button class="close" type="button" data-close>← Volver</button><h2>Crear pichanga</h2><p class="info">Organizar está permitido para cualquier edad. Tu fecha de nacimiento no se publica.</p><form id="match-form"><label>Nombre del partido</label><input name="title" required maxlength="80" placeholder="Ej. Fútbol del sábado"><label>Modalidad</label><select name="modality"><option>5v5</option><option>3v3</option><option>4v4</option><option>6v6</option><option>7v7</option><option>8v8</option><option>9v9</option><option>11v11</option><option value="otro">Otra</option></select><label>Si elegís otra, especificá</label><input name="custom" maxlength="40"><div class="row2"><div><label>Fecha</label><input type="date" name="date" required min="'+today()+'"></div><div><label>Hora</label><input type="time" name="time" required></div></div><label>Zona / barrio</label><input name="area" required maxlength="100" placeholder="Ej. Garuhapé centro"><label>Nombre del lugar (opcional)</label><input name="venue" maxlength="100" placeholder="Cancha / plaza"><label>Tipo de cancha</label><input name="venue_type" maxlength="60" placeholder="Sintético, cemento, tierra…"><div class="row2"><div><label>Cantidad máxima</label><input type="number" name="max" min="4" max="44" value="10" required></div><div><label>Precio por jugador</label><input type="number" name="cost" min="0" step="100" value="0"></div></div><div class="row2"><div><label>Edad mínima (opcional)</label><input type="number" name="min_age" min="13" max="99" placeholder="Sin límite"></div><div><label>Edad máxima (opcional)</label><input type="number" name="max_age" min="13" max="99" placeholder="Sin límite"></div></div><label>Descripción</label><textarea name="desc" maxlength="1200" placeholder="Detalles, reglas, qué llevar…"></textarea><label>Dirección exacta (privada)</label><input name="address" maxlength="250" placeholder="Se comparte solo con participantes"><label>Notas para llegar (privadas)</label><textarea name="notes" maxlength="500"></textarea><p class="info">Los partidos privados y las invitaciones se habilitarán en una próxima etapa.</p><label><input type="checkbox" name="waitlist" checked> Permitir lista de espera</label><p class="err" id="merr"></p><button class="btn" type="submit">Publicar partido</button></form>';
 s.classList.add('on');s.querySelector('[data-close]').onclick=closeSheet;
 s.querySelector('#match-form').onsubmit=async e=>{
  e.preventDefault();const f=e.currentTarget,fd=new FormData(f),err=s.querySelector('#merr'),submit=f.querySelector('button[type=submit]');submit.disabled=true;err.textContent='';
  const v=k=>String(fd.get(k)||'').trim(),min=v('min_age')?Number(v('min_age')):null,max=v('max_age')?Number(v('max_age')):null;
  if(min!==null&&max!==null&&min>max){err.textContent='La edad mínima no puede ser mayor a la máxima.';submit.disabled=false;return}
  try{
   const {data,error}=await sb.rpc('create_match',{p_title:v('title'),p_modality:v('modality'),p_custom_modality:v('custom')||null,p_match_date:v('date'),p_start_time:v('time'),p_area:v('area'),p_venue_name:v('venue')||null,p_venue_type:v('venue_type')||null,p_max_players:Number(v('max')),p_cost_per_player:Number(v('cost')||0),p_level_hint:null,p_description:v('desc'),p_is_private:false,p_allow_waitlist:fd.has('waitlist'),p_exact_address:v('address')||null,p_location_notes:v('notes')||null,p_min_age:min,p_max_age:max});
   if(error)throw error;closeSheet();notice('¡Partido publicado!');await loadMatches();await showDetails(data)
  }catch(x){err.textContent='No se pudo publicar: '+friendlyError(x);console.error(x)}finally{submit.disabled=false}
 };
}
async function showDetails(id){
 const m=cached.find(x=>x.id===id);if(!m)return;
 const s=ensureSheet();s.innerHTML='<button class="close" data-close>← Volver</button><h2>'+escapeHtml(m.title)+'</h2><p class="info">Cargando detalles…</p>';s.classList.add('on');s.querySelector('[data-close]').onclick=closeSheet;
 try{
  const [{data:participants},{data:privateLoc}]=await Promise.all([
   sb.from('match_participants').select('user_id,participant_status').eq('match_id',id).in('participant_status',['organizer','joined','waitlisted']),
   sb.from('match_private_location').select('exact_address,location_notes').eq('match_id',id).maybeSingle()
  ]);
  const rows=participants||[],status=rows.find(x=>x.user_id===S.user.id)?.participant_status,organizer=m.organizer_id===S.user.id,count=rows.filter(x=>['organizer','joined'].includes(x.participant_status)).length,waitCount=rows.filter(x=>x.participant_status==='waitlisted').length;
  const names=[];if(rows.length){const ids=[...new Set(rows.map(x=>x.user_id))];const {data:ps}=await sb.from('profiles').select('id,display_name,username').in('id',ids);const pm=Object.fromEntries((ps||[]).map(p=>[p.id,p]));rows.forEach(r=>{const p=pm[r.user_id];if(p)names.push((p.display_name||p.username)+' · '+r.participant_status)})}
  let buttons=organizer?'<button data-cancel="'+id+'">Cancelar partido</button>':status==='joined'||status==='waitlisted'?'<button class="secondary" data-leave="'+id+'">Salir del partido</button>':m.status==='open'?'<button data-join="'+id+'">Sumarme</button>':'<span class="match-badge">Completo</span>';
  const location=privateLoc&&privateLoc.exact_address?'<p class="info"><b>Dirección privada:</b> '+escapeHtml(privateLoc.exact_address)+(privateLoc.location_notes?'<br>'+escapeHtml(privateLoc.location_notes):'')+'</p>':'';
  s.innerHTML='<button class="close" data-close>← Volver</button><h2>'+escapeHtml(m.title)+'</h2><div class="match-meta">'+escapeHtml(modName(m))+' · '+escapeHtml(dateFmt(m.match_date))+' · '+escapeHtml(timeFmt(m.start_time))+'<br>Zona: '+escapeHtml(m.area)+(m.venue_name?' · '+escapeHtml(m.venue_name):'')+'<br>Precio: '+(Number(m.cost_per_player)===0?'Gratis':'$'+Number(m.cost_per_player).toLocaleString('es-AR'))+'<br>'+count+'/'+m.max_players+' confirmados'+(waitCount?' · '+waitCount+' en espera':'')+(m.organizer_is_minor?'<br><span class="match-badge minor">Organizador menor de edad</span>':'')+(m.min_age||m.max_age?'<br>'+escapeHtml(ageLabel(m)):'')+'</div><p>'+escapeHtml(m.description||'Sin descripción adicional.')+'</p>'+location+'<h3>Participantes</h3><p class="info">'+escapeHtml(names.join('\n'))+'</p><div class="match-actions">'+buttons+'</div>';
  s.querySelector('[data-close]').onclick=closeSheet;
 }catch(x){s.innerHTML='<button class="close" data-close>← Volver</button><p class="err">No pudimos mostrar los detalles: '+escapeHtml(x.message)+'</p>';s.querySelector('[data-close]').onclick=closeSheet}
}
async function act(name,id){try{const {data,error}=await sb.rpc(name,{p_match_id:id});if(error)throw error;notice(name==='join_match'?(data==='waitlisted'?'Entraste a la lista de espera.':'¡Ya estás anotado!'):name==='leave_match'?(data==='left_waitlist'?'Saliste de la lista de espera.':data==='left_and_promoted'?'Te bajaste y se liberó el lugar para alguien de la espera.':'Te bajaste del partido.'): 'Partido cancelado.');closeSheet();await loadMatches()}catch(e){notice('No se pudo completar: '+friendlyError(e))}}
document.addEventListener('click',e=>{
 const t=e.target.closest('[data-detail],[data-join],[data-leave],[data-cancel]');
 if(!t)return;
 if(t.dataset.detail)showDetails(t.dataset.detail);
 if(t.dataset.join)act('join_match',t.dataset.join);
 if(t.dataset.leave)act('leave_match',t.dataset.leave);
 if(t.dataset.cancel){if(confirm('¿Cancelar este partido?'))act('cancel_match',t.dataset.cancel)}
});
$m('match-create').addEventListener('click',()=>{if(!S){openAuth('f-login');return}createForm()});
// expose a refresh hook after successful sign-in
window.jogaMatchesRefresh=loadMatches;
if(S)loadMatches();
if(sb)sb.auth.onAuthStateChange(()=>setTimeout(()=>{if(S)loadMatches()},50));
setInterval(()=>{if(S)loadMatches()},90000);
})();
