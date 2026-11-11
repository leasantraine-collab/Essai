/* Carnet IFSI — notifications et rappels.
   Ce qui est rappelé : événements et tâches du planning, partiels, stage (7 jours avant, veille, mi-stage, fin,
   journal du soir), mémoire (rendu, soutenance), résumé du jour et fin du minuteur.
   · Appli Android / iPhone : notifications locales programmées sur le téléphone ; elles arrivent appli fermée.
   · Web : notifications du navigateur quand l'appli est ouverte ou en arrière-plan, rattrapage à la réouverture
     et réveil périodique du service worker quand le navigateur le permet (Chrome Android, appli installée).
   Les rappels sont recalculés à chaque changement (planning, partiels, stage, mémoire, réglages).
   Chargé après outils.js, avant fiche-a4.js et app.js (qui appelle ntInit). */
const NT_DEF={on:false,ag:true,tache:true,lead:30,ex:true,st:true,jr:false,tfe:true,dig:true,daily:false,digH:"07:30",eveH:"19:00",tim:true};
const ntCfg=()=>Object.assign({},NT_DEF,store.get("notif",{}));
const ntSetCfg=p=>store.set("notif",Object.assign(store.get("notif",{}),p));
const NT_MAX=60,NT_TIM=7,NT_TEST=9,NT_CACHE="carnet-ifsi-rappels",NT_DAYS=35,NT_KEYS=["agenda","exams","stage","tfe","notif"];
const NT_IC={bell:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/></svg>',
 off:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 5.6A6 6 0 0 1 18 11v4M6 11v5.5l-1.5 2H17"/><path d="M10 20.5a2 2 0 0 0 4 0M3.5 3.5l17 17"/></svg>'};
const NT={ready:false,perm:null,exact:null,wt:null};
const NT_LEADS=[[0,"À l'heure"],[5,"5 min avant"],[10,"10 min avant"],[15,"15 min avant"],[30,"30 min avant"],[60,"1 h avant"],[120,"2 h avant"]];

/* ---------- Petits utilitaires ---------- */
const ntHM=(s,d)=>{const m=String(s||"").match(/^(\d{1,2}):(\d{2})/);return m&&+m[1]<24&&+m[2]<60?m[1].padStart(2,"0")+":"+m[2]:d;};
const ntMin=s=>{const [h,m]=String(s).split(":").map(Number);return (h||0)*60+(m||0);};
const ntH=s=>{const [h,m]=String(s).split(":");return `${+h} h${m&&m!=="00"?" "+m:""}`;};
const ntDay=iso=>parseD(iso).toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"});
const ntLeadTxt=m=>{m=+m;return m===-1?"aucun rappel":m===0?"à l'heure":m>=1440?"la veille":m>=60?`${m/60} h avant`:`${m} min avant`;};
const ntId=k=>{let h=2166136261;for(let i=0;i<k.length;i++){h^=k.charCodeAt(i);h=Math.imul(h,16777619);}return 100+((h>>>0)%2000000000);};
const ntAndroid=()=>isNative&&Cap.getPlatform&&Cap.getPlatform()==="android";
const ntWebOk=()=>!isNative&&typeof Notification!=="undefined"&&window.isSecureContext;
const ntIOSWeb=()=>!isNative&&(/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1));
const ntPermNow=()=>NT.perm||(isNative?"default":ntWebOk()?Notification.permission:"unsupported");
const ntOn=()=>ntCfg().on&&ntPermNow()==="granted";
function ntWhen(ts){const d=new Date(ts),t=todayISO(),iso=isoD(d),hm=d.toTimeString().slice(0,5);
 return `${iso===t?"Aujourd'hui":iso===addDays(t,1)?"Demain":d.toLocaleDateString("fr-FR",{weekday:"short",day:"numeric",month:"short"})} · ${ntH(hm)}`;}

/* ---------- Calcul des rappels à venir ----------
   Chaque rappel : k (clé stable), at (heure d'envoi), t (titre), b (texte), r (route ouverte au toucher),
   ev (au-delà, un rappel manqué n'est plus montré ; au moins 15 min après l'envoi), lt (titre s'il est montré en retard). */
function ntPlan(now){
 now=now||Date.now();const C=ntCfg(),today=todayISO(),lim=now+NT_DAYS*DAY,out=[];
 const digH=ntHM(C.digH,"07:30"),eveH=ntHM(C.eveH,"19:00");
 const add=(k,ts,t,b,r,ev,lt)=>{if(ts&&ts>now&&ts<=lim)out.push({k,at:ts,t,b:String(b).slice(0,240),r:r||"accueil",ev:ev||ts+4*36e5,lt:lt||""});};
 const A=(typeof agenda==="function"?agenda():[]).filter(e=>e&&e.d),X=exams(),s=stageInfo(),T=typeof tfe==="function"?tfe():{};
 /* 1. Planning : rappel avant chaque événement avec une heure ; à la journée, dans le résumé du jour (ou le matin même) */
 A.forEach(e=>{if(e.done||e.d<addDays(today,-1))return;const task=e.ty==="À faire";if(task?!C.tache:!C.ag)return;
  const rp=e.rp==null||e.rp===""?null:+e.rp;if(rp===-1)return;const lab=task?"À faire":e.ty||"Événement",r="outil/planning";
  if(e.h){const t0=at(e.d,e.h);if(!t0)return;const lead=rp==null?+C.lead||0:rp,ts=t0-lead*6e4;
   const when=lead===0?`à ${ntH(e.h)}`:lead>=1440?`demain à ${ntH(e.h)}`:lead>=60?`dans ${lead/60} h`:`dans ${lead} min`;
   add(`ag:${e.id}:${ts}`,ts,`${lab} ${when}`,lead===0?e.t:`${e.t} · ${ntH(e.h)}`,r,t0,`${lab} à ${ntH(e.h)}`);}
  else if(rp!=null&&rp>=1440)add(`ag:${e.id}:v:${e.d}`,at(addDays(e.d,-1),eveH),`Demain · ${lab}`,e.t,r,at(e.d,"23:59"));
  else if(rp!=null||!C.dig)add(`ag:${e.id}:j:${e.d}`,at(e.d,digH),`Aujourd'hui · ${lab}`,e.t,r,at(e.d,"23:59"));});
 /* 2. Partiels : 7 jours avant, la veille au soir, 1 h avant */
 if(C.ex)X.forEach(x=>{const h=ntHM(x.heure,"08:00"),t0=at(x.date,h);if(!t0)return;const n=x.nom||"Partiel";
  add(`ex7:${x.id}:${x.date}`,at(addDays(x.date,-7),digH),"Partiel dans 7 jours",`${n} · ${ntDay(x.date)} à ${ntH(h)}. C'est le bon moment pour vos révisions espacées.`,"outil/planning",t0);
  add(`ex1:${x.id}:${t0}`,at(addDays(x.date,-1),eveH),"Partiel demain",`${n} à ${ntH(h)}. Préparez convocation, carte d'étudiant et stylos, puis dormez bien.`,"accueil",t0);
  add(`ex0:${x.id}:${t0}`,t0-36e5,"Partiel dans 1 h",`${n} à ${ntH(h)}. Bon courage !`,"accueil",t0,`Partiel à ${ntH(h)}`);});
 /* 3. Stage : 7 jours avant, la veille, mi-stage, 2 jours avant la fin, journal du soir */
 if(C.st&&s.debut){const sv=s.service||"Votre stage",arr=ntHM(s.arrivee,""),t0=at(s.debut,arr||"07:00");
  add(`st7:${s.debut}`,at(addDays(s.debut,-7),digH),"Stage dans 7 jours",`${sv}. Préparez vos objectifs et votre sac de stage.`,"stages",t0);
  add(`st1:${s.debut}`,at(addDays(s.debut,-1),eveH),"Premier jour de stage demain",`${sv}${arr?`, arrivée à ${ntH(arr)}`:""}${s.adresse?` · ${s.adresse}`:""}. Vérifiez votre sac : tenues, badge, carnet de stage, montre à trotteuse.`,"stages",t0);
  if(s.fin&&s.fin>s.debut){const D=Math.round((parseD(s.fin)-parseD(s.debut))/DAY);
   if(D>=9)add(`stm:${s.debut}:${s.fin}`,at(addDays(s.debut,Math.floor(D/2)),digH),"C'est la mi-stage","Pensez à demander votre bilan de mi-stage à votre tuteur ou tutrice.","carnet/bilans");
   if(D>=4)add(`stf:${s.fin}`,at(addDays(s.fin,-2),digH),"Fin de stage dans 2 jours","Faites remplir votre feuille d'évaluation et complétez votre portfolio.","carnet/bilans");}
  if(C.jr){const end=s.fin&&s.fin>=s.debut?s.fin:s.debut,stop=addDays(today,NT_DAYS);
   for(let d=s.debut>today?s.debut:today;d<=end&&d<=stop;d=addDays(d,1))add(`jr:${d}`,at(d,eveH),"Journal de stage","Deux minutes pour noter votre journée : soins réalisés, ce que vous avez appris, vos questions.","carnet/journal",at(d,"23:59"));}}
 /* 4. Mémoire : rendu (30 jours, 7 jours, la veille) et soutenance (7 jours, la veille) */
 if(C.tfe){if(T.rendu){add(`tf30:${T.rendu}`,at(addDays(T.rendu,-30),digH),"Rendu du mémoire dans 30 jours","Analyse, discussion, relecture : faites le point sur votre rétroplanning.","outil/tfe");
   add(`tf7:${T.rendu}`,at(addDays(T.rendu,-7),digH),"Rendu du mémoire dans 7 jours","Dernière relecture : normes APA, sommaire, annexes, résumé et mots-clés.","outil/tfe");
   add(`tf1:${T.rendu}`,at(addDays(T.rendu,-1),eveH),"Rendu du mémoire demain","Vérifiez le format demandé par l'IFSI et gardez une copie de sauvegarde.","outil/tfe",at(T.rendu,"23:59"));}
  if(T.sout){add(`so7:${T.sout}`,at(addDays(T.sout,-7),digH),"Soutenance dans 7 jours","Entraînez-vous à voix haute : une dizaine de minutes de présentation, puis les questions du jury.","outil/tfe");
   add(`so1:${T.sout}`,at(addDays(T.sout,-1),eveH),"Soutenance demain","Diaporama prêt, mémoire annoté, tenue choisie : vous connaissez votre sujet mieux que personne.","outil/tfe",at(T.sout,"23:59"));}}
 /* 5. Résumé du jour, chaque matin sur 14 jours */
 if(C.dig)for(let i=0;i<14;i++){const d=addDays(today,i),ts=at(d,digH);if(!ts||ts<=now)continue;
  const ev=A.filter(e=>e.d===d&&!e.done&&e.rp!==-1&&(e.ty==="À faire"?C.tache:C.ag)).sort((a,b)=>(a.h||"").localeCompare(b.h||""));
  const ex=C.ex?X.filter(x=>x.date===d):[],stg=C.st&&s.debut===d;
  const late=C.tache?A.filter(e=>e.ty==="À faire"&&!e.done&&e.d<d&&e.d>=addDays(d,-30)).length:0;
  const nx=C.ex?X.filter(x=>x.date>d&&x.date<=addDays(d,7)).sort((a,b)=>a.date<b.date?-1:1)[0]:null;
  const parts=[],rev=ev.filter(e=>e.ty==="Révision"),oth=ev.filter(e=>e.ty!=="Révision");
  ex.forEach(x=>parts.push(`Partiel : ${x.nom} à ${ntH(ntHM(x.heure,"08:00"))}`));
  if(stg)parts.push(`Premier jour de stage${s.service?" · "+s.service:""}`);
  oth.slice(0,3).forEach(e=>parts.push(`${e.ty==="À faire"?"Tâche : ":""}${e.h?ntH(e.h)+" ":""}${e.t}`));
  if(oth.length>3)parts.push(`et ${plural(oth.length-3,"autre événement")}`);
  if(rev.length)parts.push(rev.length===1?`Révision : ${rev[0].t}`:`${rev.length} séances de révision`);
  if(late)parts.push(`${plural(late,"tâche")} en retard`);
  if(nx){const j=Math.round((parseD(nx.date)-parseD(d))/DAY);parts.push(`${nx.nom} dans ${plural(j,"jour")}`);}
  const n=ev.length+ex.length+(stg?1:0);
  if(parts.length)add(`dig:${d}`,ts,n?`Au programme : ${plural(n,"événement")}`:"Votre journée",parts.join(" · "),n||late?"outil/planning":"accueil",ts+5*36e5);
  else if(C.daily)add(`dly:${d}`,ts,"Un petit moment de révision ?","Rien de prévu aujourd'hui : quelques cartes pour garder le rythme.","entrainer/cartes",ts+12*36e5);}
 out.sort((a,b)=>a.at-b.at);
 const seen=new Set(),U=out.filter(x=>!seen.has(x.k)&&seen.add(x.k));
 if(U.length<=NT_MAX)return U;
 /* Au-delà de 60 rappels (limite de l'iPhone), on garde les plus proches et on invite à rouvrir l'appli. */
 const L=U.slice(0,NT_MAX-1),last=L[L.length-1].at;
 L.push({k:"more:"+last,at:last+6e4,t:"Carnet IFSI",b:"Ouvrez l'appli pour programmer vos prochains rappels.",r:"notifs",ev:last+DAY,lt:""});return L;
}

/* ---------- Programmation ---------- */
function ntSoon(){if(!NT.ready)return;clearTimeout(ntSoon.t);ntSoon.t=setTimeout(ntSync,400);}
async function ntSync(){if(!NT.ready)return;try{const plan=ntPlan();if(isNative)await ntNativeSync(plan);else await ntWebRun(plan);}catch(e){}}
/* Appli native : on ne reprogramme que ce qui a changé (les notifications déjà programmées et identiques restent). */
const ntNativeN=(id,x)=>({id,title:x.t,body:x.b,largeBody:x.b,schedule:{at:new Date(x.at),allowWhileIdle:true},channelId:"rappels",extra:{r:x.r}});
async function ntNativeSync(plan){
 const LN=plug("LocalNotifications");if(!LN)return;
 const want=new Map((ntOn()?plan:[]).map(x=>[ntId(x.k),x])),sig=store.get("ntsched",{}),h=x=>x.at+"|"+x.t+"|"+x.b+"|"+x.r;
 let pend=[];try{const p=await LN.getPending();pend=((p&&p.notifications)||[]).map(n=>+n.id);}catch(e){}
 const cancel=pend.filter(id=>id!==NT_TIM&&id!==NT_TEST&&(!want.has(id)||sig[id]!==h(want.get(id))));
 const sched=[...want].filter(([id,x])=>!pend.includes(id)||sig[id]!==h(x));
 if(cancel.length)try{await LN.cancel({notifications:cancel.map(id=>({id}))});}catch(e){}
 if(sched.length)await LN.schedule({notifications:sched.map(([id,x])=>ntNativeN(id,x))});
 const ns={};want.forEach((x,id)=>{ns[id]=h(x);});store.set("ntsched",ns);
}
/* Web : les rappels à venir sont rangés dans le cache (lisible par le service worker). À chaque passage, ceux qui
   sont arrivés à échéance et pas encore montrés sont affichés ; un minuteur réveille la page pour le suivant. */
const ntURL=n=>new URL("__rappels/"+n,location.href.replace(/[#?].*$/,"")).href;
async function ntRead(c,n,d){try{const r=await c.match(ntURL(n));return r?await r.json():d;}catch(e){return d;}}
async function ntWrite(c,n,v){try{await c.put(ntURL(n),new Response(JSON.stringify(v),{headers:{"Content-Type":"application/json"}}));}catch(e){}}
async function ntWebRun(plan){
 clearTimeout(NT.wt);const on=ntOn()&&ntWebOk(),now=Date.now();let c=null;
 try{c="caches" in window?await caches.open(NT_CACHE):null;}catch(e){}
 if(c){const old=await ntRead(c,"plan.json",[]),shown=await ntRead(c,"shown.json",{});
  if(on)for(const x of old)if(x.at<=now+1e3&&now<Math.max(x.ev||0,x.at+15*6e4)&&!shown[x.k]){shown[x.k]=now;await ntShow(x,now-x.at>5*6e4);}
  Object.keys(shown).forEach(k=>{if(shown[k]<now-4*DAY)delete shown[k];});
  await ntWrite(c,"shown.json",shown);await ntWrite(c,"plan.json",on?plan:[]);}
 if(on&&c&&plan.length){const nx=plan[0].at-now;if(nx<26*36e5)NT.wt=setTimeout(ntSync,Math.max(1e3,nx+800));}
}
async function ntShow(x,late){
 const t=late&&x.lt?x.lt:x.t,o={body:x.b,tag:x.k,icon:"icons/icon-192.png",badge:"icons/badge-96.png",lang:"fr",data:{r:x.r},timestamp:x.at||Date.now()};
 try{const reg=navigator.serviceWorker&&await navigator.serviceWorker.getRegistration();if(reg){await reg.showNotification(t,o);return true;}}catch(e){}
 try{const n=new Notification(t,o);n.onclick=()=>{try{window.focus();}catch(e){}nav(x.r);n.close();};return true;}catch(e){return false;}
}
async function ntPeriodic(on){
 try{const reg=navigator.serviceWorker&&await navigator.serviceWorker.getRegistration();if(!reg||!("periodicSync" in reg))return;
  if(!on){await reg.periodicSync.unregister("carnet-rappels");return;}
  const st=await navigator.permissions.query({name:"periodic-background-sync"});if(st.state==="granted")await reg.periodicSync.register("carnet-rappels",{minInterval:3*36e5});}catch(e){}
}
/* Fin du minuteur des outils : programmée à part (elle doit survivre à la fermeture de l'appli). */
function ntTimer(end,total){
 const C=ntCfg(),ok=end&&C.tim&&ntOn(),lab=total?`Minuteur de ${total<6e4?Math.round(total/1e3)+" s":total%36e5===0?total/36e5+" h":Math.round(total/6e4)+" min"} terminé`:"Minuteur terminé";
 if(isNative){const LN=plug("LocalNotifications");if(!LN)return;
  (async()=>{try{await LN.cancel({notifications:[{id:NT_TIM}]});}catch(e){}
   if(ok)try{await LN.schedule({notifications:[{id:NT_TIM,title:lab,body:"Le temps est écoulé.",schedule:{at:new Date(end),allowWhileIdle:true},channelId:"minuteur",extra:{r:"outil/chrono"}}]});}catch(e){}})();return;}
 clearTimeout(ntTimer.t);
 if(ok)ntTimer.t=setTimeout(()=>{if(document.visibilityState!=="visible")ntShow({k:"tim:"+end,t:lab,b:"Le temps est écoulé.",r:"outil/chrono",at:end});},Math.max(0,end-Date.now()));
}

/* ---------- Autorisation ---------- */
async function ntPerm(){
 let p="unsupported";
 if(isNative){const LN=plug("LocalNotifications");
  if(LN){try{const r=await LN.checkPermissions();p=r.display==="granted"?"granted":r.display==="denied"?"denied":"default";}catch(e){}
   if(ntAndroid()&&LN.checkExactNotificationSetting)try{const r=await LN.checkExactNotificationSetting();NT.exact=r&&r.exact_alarm;}catch(e){}}}
 else if(ntWebOk())p=Notification.permission;
 const ch=p!==NT.perm;NT.perm=p;if(ch&&route().v==="notifs")render();return p;
}
async function ntEnable(){
 let p="default";
 if(isNative){const LN=plug("LocalNotifications");if(!LN){toast("Notifications indisponibles sur cet appareil");return;}
  try{const r=await LN.requestPermissions();p=r.display==="granted"?"granted":r.display==="denied"?"denied":"default";}catch(e){p="denied";}}
 else{if(!ntWebOk()){toast("Notifications non disponibles ici");return;}
  try{const q=Notification.requestPermission();p=q&&q.then?await q:Notification.permission;}catch(e){p=Notification.permission;}}
 NT.perm=p;
 if(p==="granted"){ntSetCfg({on:true});haptic();toast("Rappels activés");ntPeriodic(true);}
 else toast(p==="denied"?"Notifications refusées : modifiables dans les réglages du téléphone":"Autorisation non accordée");
 render();
}
async function ntTest(){
 if(isNative){const LN=plug("LocalNotifications");
  try{await LN.schedule({notifications:[{id:NT_TEST,title:"Carnet IFSI",body:"Test réussi : vos rappels s'afficheront comme ceci.",schedule:{at:new Date(Date.now()+2500),allowWhileIdle:true},channelId:"rappels",extra:{r:"notifs"}}]});toast("Notification de test dans quelques secondes");}
  catch(e){toast("La notification de test n'a pas pu être programmée");}return;}
 toast(await ntShow({k:"test",t:"Carnet IFSI",b:"Test réussi : vos rappels s'afficheront comme ceci.",r:"notifs",at:Date.now()})?"Notification de test envoyée":"La notification de test n'a pas pu s'afficher");
}
async function ntInit(){
 if(isNative){const LN=plug("LocalNotifications");
  if(LN){if(ntAndroid()&&LN.createChannel)try{
    await LN.createChannel({id:"rappels",name:"Rappels",description:"Planning, tâches, partiels, stage et mémoire",importance:4,visibility:1,vibration:true});
    await LN.createChannel({id:"minuteur",name:"Minuteur",description:"Fin du minuteur des outils",importance:5,visibility:1,vibration:true});}catch(e){}
   try{LN.addListener("localNotificationActionPerformed",a=>{const r=a&&a.notification&&a.notification.extra&&a.notification.extra.r;if(r)setTimeout(()=>nav(r),60);});}catch(e){}}
  try{const A=plug("App");A&&A.addListener("resume",()=>{ntPerm().then(ntSoon);});}catch(e){}}
 else{document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")ntPerm().then(ntSoon);});
  if(navigator.serviceWorker)navigator.serviceWorker.addEventListener("message",ev=>{const d=ev.data||{};if(d.t==="nt-open"&&d.r)nav(d.r);});}
 setInterval(ntSoon,15*6e4);
 await ntPerm();NT.ready=true;ntSync();
}
/* Toute modification du planning, des partiels, du stage, du mémoire ou des réglages reprogramme les rappels. */
{const set0=store.set;store.set=function(k,v){set0.call(store,k,v);if(NT_KEYS.includes(k))ntSoon();};}

/* ---------- Écran Réglages › Notifications ---------- */
function ntUpList(){const L=ntPlan().slice(0,8);
 return L.length?L.map(x=>`<div class="nt-up-i"><span class="nt-when">${esc(ntWhen(x.at))}</span><span><b>${esc(x.t)}</b><small>${esc(x.b)}</small></span></div>`).join("")
  :`<p class="muted">Aucun rappel à venir. Ajoutez des événements au planning, vos partiels, les dates de stage ou du mémoire.</p>`;}
function vNotifs(){
 const C=ntCfg(),P=ntPermNow(),on=C.on&&P==="granted",n=on?ntPlan().length:0;
 const sw=(k,label,desc,dis)=>`<label class="nt-row${dis?" dis":""}"><span><b>${label}</b>${desc?`<small>${desc}</small>`:""}</span><input type="checkbox" role="switch" class="nt-sw" data-act="nt-set" data-n="${k}" ${C[k]?"checked":""} ${dis?"disabled":""}></label>`;
 const tm=(k,label)=>`<label class="nt-row" for="nt-${k}"><span><b>${label}</b></span><input id="nt-${k}" type="time" class="nt-time" data-nt="${k}" value="${esc(ntHM(C[k],NT_DEF[k]))}"></label>`;
 let card;
 if(on)card=`<section class="nt-card on"><span class="nt-ic">${NT_IC.bell}</span><div><b>Notifications activées</b><small>${n?`${plural(n,"rappel")} programmé${n>1?"s":""}${isNative?" sur ce téléphone":""}`:"Aucun rappel à venir pour l'instant"}</small>
  <div class="nt-btns"><button class="btn ghost" data-act="nt-test">Envoyer un test</button><button class="link danger" data-act="nt-off">Désactiver</button></div></div></section>`;
 else if(P==="denied")card=`<section class="nt-card warn"><span class="nt-ic">${NT_IC.off}</span><div><b>Notifications bloquées</b><small>${isNative?"Autorisez-les dans les réglages du téléphone : Réglages › Notifications › Carnet IFSI (ou Applications › Carnet IFSI › Notifications), puis revenez ici.":"Autorisez-les pour ce site dans les réglages du navigateur (icône à gauche de l'adresse, ou Réglages › Notifications), puis revenez ici."}</small>
  <div class="nt-btns"><button class="btn ghost" data-act="nt-enable">Réessayer</button></div></div></section>`;
 else if(P==="unsupported")card=`<section class="nt-card"><span class="nt-ic">${NT_IC.off}</span><div><b>Notifications indisponibles ici</b><small>${ntIOSWeb()?"Sur iPhone et iPad, ajoutez d'abord Carnet IFSI à l'écran d'accueil (bouton Partager, puis « Sur l'écran d'accueil »), ouvrez-le depuis son icône, puis revenez ici.":"Ce navigateur n'autorise pas les notifications pour cette page. Vous pouvez exporter votre planning vers l'agenda du téléphone, alarmes comprises."}</small></div></section>`;
 else card=`<section class="nt-card"><span class="nt-ic">${NT_IC.bell}</span><div><b>Être prévenu·e à temps</b><small>Un rappel avant vos cours, vos révisions et vos tâches, la veille des partiels, avant le stage et le rendu du mémoire. Vous choisissez ce que vous recevez.</small>
  <div class="nt-btns"><button class="btn" data-act="nt-enable">${NT_IC.bell}Activer les notifications</button></div></div></section>`;
 const exact=on&&ntAndroid()&&NT.exact&&NT.exact!=="granted"?`<div class="nt-row"><span><b>Heure exacte</b><small>Sans cette autorisation, Android peut retarder un rappel de quelques minutes.</small></span><button class="btn ghost" data-act="nt-exact">Autoriser</button></div>`:"";
 return `<div class="stack-lg">${backBtn("Réglages")}${vh("Réglages","Notifications","Choisissez les rappels que vous recevez : planning, tâches, partiels, stage, mémoire et minuteur.")}
  ${card}
  <div class="set-group"><span class="eyebrow">Ce qui est rappelé</span><div class="list nt-list">
   ${sw("ag","Planning","Cours, révisions, mémoire et perso. Les événements à la journée sont dans le résumé du jour.")}
   <label class="nt-row nt-sub${C.ag||C.tache?"":" dis"}" for="nt-lead"><span><b>Délai du rappel</b><small>Pour les événements et les tâches avec une heure. Modifiable pour chaque événement.</small></span><select id="nt-lead" data-nt="lead">${NT_LEADS.map(([m,l])=>`<option value="${m}" ${+C.lead===m?"selected":""}>${l}</option>`).join("")}</select></label>
   ${sw("tache","Tâches à faire","À l'heure prévue, et les tâches en retard dans le résumé du jour.")}
   ${sw("ex","Partiels","7 jours avant, la veille au soir et 1 h avant.")}
   ${sw("st","Stage","7 jours avant, la veille du premier jour, à mi-stage et 2 jours avant la fin.")}
   ${sw("jr","Journal de stage","Chaque soir de stage, pour noter votre journée dans le carnet de suivi.",!C.st)}
   ${sw("tfe","Mémoire (TFE)","Rendu : 30 jours, 7 jours et la veille. Soutenance : 7 jours et la veille.")}
   ${sw("tim","Fin du minuteur","Outils › Chrono, même quand l'appli est en arrière-plan.")}</div></div>
  <div class="set-group"><span class="eyebrow">Quand</span><div class="list nt-list">
   ${sw("dig","Résumé du jour","Chaque matin : vos événements, les tâches en retard et le prochain partiel.")}
   ${tm("digH","Heure du résumé et des rappels du matin")}
   ${sw("daily","Même les jours sans rien de prévu","Une invitation à réviser quelques minutes.",!C.dig)}
   ${tm("eveH","Heure des rappels de la veille")}
   ${exact}</div></div>
  <section class="stack-sm"><div class="section-title"><h2>${on?"Prochains rappels":"Aperçu des prochains rappels"}</h2></div>
   <div class="sheet-body nt-up" id="nt-up">${ntUpList()}</div>
   ${on?"":`<p class="ot-hint">Ces rappels seront envoyés une fois les notifications activées.</p>`}</section>
  <div class="callout"><b>${isNative?"Rappels programmés sur le téléphone":"Sur le web"}</b><p>${isNative?"Les rappels arrivent même quand l'appli est fermée. Ils sont programmés jusqu'à 60 à l'avance : ouvrez l'appli de temps en temps pour programmer les suivants.":"Le navigateur ne peut pas réveiller une page web à heure fixe : les rappels arrivent quand Carnet IFSI est ouvert ou en arrière-plan, et ceux que vous avez manqués s'affichent à la réouverture. Pour être prévenu·e appli fermée, utilisez l'appli Android ou iPhone, ou exportez votre planning vers l'agenda du téléphone : les alarmes sont incluses."}</p></div>
  <button class="btn ghost block" data-act="ot-ag-ics">${OT_IC.planning}Exporter mon planning vers l'agenda (avec alarmes)</button>
  <p class="disclaimer">Les rappels sont calculés sur cet appareil à partir de vos données ; rien n'est envoyé en ligne.</p></div>`;
}
/* Invitation discrète à activer les rappels, là où ils servent (accueil, planning, stage). */
function ntAsk(ctx){
 const P=ntPermNow();if(ntCfg().on||P==="denied"||P==="unsupported")return "";
 const t=store.get("ntask",0);if(t&&Date.now()-t<21*DAY)return "";if(!ntPlan().length)return "";
 const txt={home:"Recevez un rappel avant vos cours, vos tâches, vos partiels et votre stage.",planning:"Recevez un rappel avant chaque événement et chaque tâche de votre planning.",stage:"Recevez un rappel une semaine avant, la veille du premier jour, à mi-stage et avant la fin du stage."}[ctx]||"";
 return `<section class="nt-ask"><span class="nt-ic">${NT_IC.bell}</span><div><b>Être prévenu·e à temps</b><small>${txt}</small>
  <div class="nt-btns"><button class="btn" data-act="nt-enable">Activer les rappels</button><a class="link" href="#notifs">Choisir</a><button class="link" data-act="nt-later">Plus tard</button></div></div></section>`;
}
function ntAct(b,a){
 if(a==="nt-enable")ntEnable();
 else if(a==="nt-off"){ntSetCfg({on:false});ntTimer(null);ntPeriodic(false);haptic();toast("Rappels désactivés");render();}
 else if(a==="nt-later"){store.set("ntask",Date.now());toast("D'accord : activables dans Réglages › Notifications");render();}
 else if(a==="nt-set"){ntSetCfg({[b.dataset.n]:!!b.checked});haptic();const y=window.scrollY;render();window.scrollTo(0,y);}
 else if(a==="nt-test")ntTest();
 else if(a==="nt-exact"){const LN=plug("LocalNotifications");if(LN&&LN.changeExactNotificationSetting)LN.changeExactNotificationSetting().then(()=>ntPerm()).catch(()=>{});}
}
function ntInput(t){const k=t.dataset.nt;let v=t.value;
 if(k==="lead")v=+v;else{v=ntHM(v,"");if(!v)return;}
 ntSetCfg({[k]:v});const el=document.getElementById("nt-up");if(el)el.innerHTML=ntUpList();}
/* Ligne de l'écran Réglages */
function ntSetRow(){const C=ntCfg(),P=ntPermNow(),on=C.on&&P==="granted";
 return `<a class="li" href="#notifs"><span class="ic tb-ic" style="--c:#2A5D85">${on?NT_IC.bell:NT_IC.off}</span><span><span class="t">Notifications</span><span class="s">${on?"Activées · planning, tâches, partiels, stage, mémoire":P==="denied"?"Bloquées dans les réglages de l'appareil":"Désactivées · touchez pour choisir vos rappels"}</span></span>${chev}</a>`;}
