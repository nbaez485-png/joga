const fs=require('node:fs');
const html=fs.readFileSync('index.html','utf8');
const app=fs.readFileSync('app.js','utf8');
const matches=fs.readFileSync('matches.js','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const css=fs.readFileSync('style.css','utf8');
const checks=[];
function check(name,fn){try{fn();checks.push({name,ok:true})}catch(e){checks.push({name,ok:false,error:e.message})}}
function assert(v,msg){if(!v)throw new Error(msg)}
check('JavaScript syntax: app.js',()=>new Function(app));
check('JavaScript syntax: matches.js',()=>new Function(matches));
check('JavaScript syntax: sw.js',()=>new Function(sw));
check('HTML has no duplicate IDs',()=>{const ids=[...html.matchAll(/\bid=["']([^"']+)["']/g)].map(m=>m[1]);const d=ids.filter((id,i)=>ids.indexOf(id)!==i);assert(!d.length,'Duplicate IDs: '+d.join(', '))});
check('Literal DOM IDs referenced in JS exist',()=>{const refs=[...app.matchAll(/\$\(['"]([^'"]+)['"]\)/g),...matches.matchAll(/\$m\(['"]([^'"]+)['"]\)/g)].map(m=>m[1]);const ids=new Set([...html.matchAll(/\bid=["']([^"']+)["']/g)].map(m=>m[1]));const missing=[...new Set(refs.filter(id=>!ids.has(id)))];assert(!missing.length,'Missing IDs: '+missing.join(', '))});
check('Navigation targets have corresponding views',()=>{const tabs=[...html.matchAll(/data-t=["']([^"']+)["']/g)].map(m=>m[1]);for(const t of tabs)assert(html.includes('id="v-'+t+'"'),'Missing view for '+t);assert(tabs.length===4,'Expected 4 main tabs, found '+tabs.length)});
check('Player discovery UI and search wiring',()=>{assert(html.includes('id=\"v-players\"'),'Missing players view');assert(html.includes('id=\"players-search\"'),'Missing player search input');assert(app.includes('window.jogaPlayersRefresh=loadPlayers'),'Players refresh hook missing');assert(app.includes("eq('visibility','public')"),'Public profile filter missing')});
check('Player card initials avoid variable shadowing',()=>{assert(app.includes('firstLetter=initial(p)'),'Player initials variable missing');assert(!app.includes('initial=initial(p)'),'Initials shadowing regression')});
check('Private-profile RLS migration included',()=>{const migration=fs.readFileSync('supabase/migrations/20261128091908_restrict_private_profile_visibility.sql','utf8');assert(migration.includes('visibility = \'public\''),'Missing public visibility condition');assert(migration.includes('auth.uid()'),'Missing self condition');assert(migration.includes('private.can_view_match'),'Missing match-context access')});
check('Home dashboard widgets present',()=>['home-next-match-content','home-stat-created','home-stat-joined','home-stat-upcoming','home-tip-text'].forEach(id=>assert(html.includes('id="'+id+'"'),'Missing home widget '+id)));
check('Search sanitizer uses Unicode-aware regex',()=>{assert(/replace\(\/\[\^\\p\{L\}\\p\{N\}\\s-\]\/gu/.test(matches),'Search filter sanitizer is escaped incorrectly');const sanitize=s=>s.replace(/[^\p{L}\p{N}\s-]/gu,' ').replace(/\s+/g,' ').trim();assert(sanitize('Garuhapé 5v5 cancha')==='Garuhapé 5v5 cancha','Spanish accents or letters stripped');assert(sanitize('Núñez / fútbol')==='Núñez fútbol','punctuation cleanup failed')});
check('Match create and discovery controls present',()=>['match-search','match-modality-filter','match-cost-filter','match-date-filter','match-list','match-create'].forEach(id=>assert(html.includes('id="'+id+'"'),'Missing match control '+id)));
check('Bottom dock has centered create action',()=>{const dock=html.slice(html.indexOf('<nav class="dock"'),html.indexOf('</nav>',html.indexOf('<nav class="dock"')));assert(dock.indexOf('create-dock')>0&&dock.indexOf('create-dock')<dock.indexOf('data-t="explore"'),'Create button should be third in nav');assert(css.includes('.dock .create-dock{grid-column:3;'),'Create action must occupy center grid slot')});
check('Avatar rings use independent centered layers',()=>{assert(html.includes('profile-ring-stage'),'Profile ring stage missing');assert(html.includes('cosmetic-ring-stage'),'Cosmetic ring stage missing');assert(css.includes('left:50%;top:50%;')&&css.includes('background-size:contain'),'Centered contain rule missing');assert(!css.slice(css.lastIndexOf('/* Avatar rings — clean layer system')).includes('.cosmetic-card{overflow:hidden'),'Ring card clipping regression')});
check('Cache version matches static app/css versioning',()=>{const v=sw.match(/const V='([^']+)'/);assert(v,'Missing cache version');assert(html.includes('app.js?v=20261128-25'),'App script cache-bust missing');assert(html.includes('style.css?v=20261128-25'),'CSS cache-bust missing');assert(v[1]==='joga-v57','Unexpected SW version '+v[1]);assert(sw.includes("'app.js'")&&sw.includes("'style.css'"),'SW asset list missing core assets')});
check('Public match sharing and deep links wired',()=>{assert(matches.includes('data-share'),'Missing share action');assert(matches.includes("searchParams.set('match',id)"),'Missing share URL');assert(matches.includes('deepMatchId'),'Missing match deep-link handling')});
check('Home avoids duplicate find/create buttons',()=>assert(!html.includes('class="home-actions"'),'Duplicate home action section should stay removed'));
check('Home styles are included',()=>['.home-next-match','.home-activity-grid','.home-explore','.home-tip','.home-explore','.explore-grid','.x-preview','.academy-course-grid','.community-feed'].forEach(s=>assert(css.includes(s),'Missing home style '+s)));
console.log(checks.map(c=>(c.ok?'PASS':'FAIL')+' '+c.name+(c.error?' — '+c.error:'')).join('\n'));
if(checks.some(c=>!c.ok))process.exitCode=1;
