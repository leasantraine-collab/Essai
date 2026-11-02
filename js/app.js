/* Carnet IFSI — coque de l'application : navigation, vues, progression, réglages, intégration native. */
const app=document.getElementById("app");
const Cap=window.Capacitor,isNative=!!(Cap&&Cap.isNativePlatform&&Cap.isNativePlatform());
const plug=n=>isNative&&Cap.Plugins?Cap.Plugins[n]:null;
const haptic=(style="LIGHT")=>{try{const h=plug("Haptics");h&&h.impact({style})}catch(e){}};

/* ---------- Icônes ---------- */
const I=d=>`<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const IC={
 chev:I('<path d="M9 6l6 6-6 6"/>'),
 back:I('<path d="M15 6l-6 6 6 6"/>'),
 search:I('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>'),
 gear:I('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
 star:I('<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>'),
 bolt:I('<path d="M13 3L5 13.5h6L10 21l8-10.5h-6z"/>'),
 redo:I('<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4h4"/>'),
 play:I('<path d="M7 5l12 7-12 7z"/>'),
 book:I('<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5V5.5M20 18v3H6.5"/>'),
 sheet:I('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>'),
 flask:I('<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3"/><path d="M7.5 15h9"/>'),
 cap:I('<path d="M12 4L2 9l10 5 10-5z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5"/>'),
 cal:I('<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>'),
 plus:I('<path d="M12 5v14M5 12h14"/>'),
 x:I('<path d="M6 6l12 12M18 6L6 18"/>'),
 check:I('<path d="M5 12.5l4.5 4.5L19 7.5"/>')
};
const CAT_IC={
 thera:I('<rect x="3" y="8.5" width="18" height="7" rx="3.5" transform="rotate(-35 12 12)"/><path d="M9.4 8.3l5.2 7.4"/>'),
 patho:I('<path d="M3 12h4l2-5 4 10 2-5h6"/>'),
 soins:I('<path d="M18 2l4 4M15 5l4 4M17 7l-9.5 9.5-3 .5.5-3L14.5 4.5M7 13l4 4M3 21l3-3"/>'),
 voca:I('<path d="M4 18L8.5 6 13 18M5.6 14h5.8M15 12.5c.6-1.2 1.6-1.8 3-1.8 1.8 0 3 1 3 3V18M21 15.5c-2.8-.4-6 .1-6 1.6 0 1.8 3.5 1.8 6-.6"/>'),
 stage:I('<path d="M6 3v6a6 6 0 0 0 12 0V3"/><circle cx="18" cy="17" r="3"/><path d="M12 15v1a5 5 0 0 0 6 4"/>'),
 methode:I('<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/>'),
 calcul:I('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>'),
 quiz:I('<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5v.01"/>'),
 exam:I('<path d="M4 4v16h16"/><path d="M7 14l3-3 3 2 5-6"/>'),
 role:I('<path d="M12 3v18M5 7h14M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0zM8 21h8"/>'),
 anat:I('<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 3c0 5.4-7.5 10-7.5 10z"/>'),
 situ:I('<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3"/>'),
 tfe:I('<path d="M5 3h9l5 5v13H5z"/><path d="M14 3v5h5"/><path d="M8.5 14l2.5 2.5 4.5-5"/>')
};
const catIc=id=>`<span class="ic" style="--c:${CAT[id].c}">${CAT_IC[id]||IC.sheet}</span>`;

const APP_VERSION="1.34 · 2 novembre 2026";

/* ---------- État ---------- */
let state={fiche:null,cours:null,filter:"all",calcType:"gravite",ex:null,quiz:null,quizCat:"all",
  ueRef:store.get("ueRef","2026"),sem:store.get("sem",1),ue:null};
const stats=()=>store.get("stats",{exOk:0,exTot:0,quizBest:null});

/* ---------- Données dérivées ---------- */
const FULL_COURS=COURS.filter(c=>c.chap);
const favs=()=>store.get("favs",[]);
const isFav=k=>favs().includes(k);
const wrongs=()=>store.get("wrong",[]);
const totalItems=FICHES.length+FULL_COURS.length;
const doneItems=()=>reviewed().filter(id=>FICHES.some(f=>f.id===id)).length+studied().filter(id=>FULL_COURS.some(c=>c.id===id)).length;
const plural=(n,w)=>`${n} ${w}${n>1?"s":""}`;
function toast(t){let el=document.querySelector(".toast");if(!el){el=document.createElement("div");el.className="toast";el.setAttribute("role","status");document.body.appendChild(el);}
 el.textContent=t;el.classList.add("on");clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove("on"),1600);}
const ring=(pct,size=96)=>{const r=40,C=2*Math.PI*r;return `<div class="ring" style="width:${size}px;height:${size}px"><svg viewBox="0 0 100 100"><circle class="tr" cx="50" cy="50" r="${r}"/><circle class="pg" cx="50" cy="50" r="${r}" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-pct/100)}"/></svg><b>${pct}<small>%</small></b></div>`;};
const vh=(eyebrow,title,lead,right="")=>`<header class="vh"><div class="vh-row"><div class="stack-sm" style="gap:4px"><span class="eyebrow">${eyebrow}</span><h1>${title}</h1></div>${right}</div>${lead?`<p class="lead">${lead}</p>`:""}</header>`;
const backBtn=(label)=>`<button class="back" data-act="back">${IC.back}${esc(label)}</button>`;

/* ---------- État et réglages ---------- */
Object.assign(state,{rev:store.get("rev","fiches"),train:"quiz",favOnly:false,q:""});
const settings=()=>store.get("settings",{theme:"auto",size:"m"});
const mq=matchMedia("(prefers-color-scheme: dark)");
function applyTheme(){
 const s=settings(),dark=s.theme==="dark"||(s.theme==="auto"&&mq.matches);
 document.documentElement.dataset.theme=dark?"dark":"light";
 document.documentElement.dataset.size=s.size;
 const m=document.querySelector('meta[name="theme-color"]');m&&m.setAttribute("content",dark?"#0D1417":"#F6F4EF");
 try{const sb=plug("StatusBar");if(sb){sb.setStyle({style:dark?"DARK":"LIGHT"});}}catch(e){}
}
mq.addEventListener&&mq.addEventListener("change",applyTheme);
applyTheme();

/* ---------- Routage ---------- */
const ROOTS=["accueil","reviser","entrainer","stages","programme"];
const PARENT={outil:"outils",outils:"accueil",med:"reviser",soin:"reviser",patho:"pathos",pathos:"reviser",feuille:"stages",carnet:"stages",fiche:"reviser",cours:"reviser",ue:"programme",recherche:"accueil",reglages:"accueil"};
function route(){const [v,...rest]=decodeURIComponent(location.hash.slice(1)).split("/");return {v:VIEWS[v]?v:"accueil",arg:rest.join("/")};}
function nav(h){if(location.hash==="#"+h)render(true);else location.hash=h;}
let depth=0;
function goBack(){const r=route();if(depth>0){history.back();}else{location.replace("#"+(PARENT[r.v]||"accueil"));}}
window.addEventListener("hashchange",()=>{render(true);});

/* ---------- Comptes à rebours (partiels, stage) ---------- */
const exams=()=>store.get("exams",[]);
const stageInfo=()=>store.get("stage",{});
const at=(d,h)=>{if(!d)return null;const t=new Date(d+"T"+(h||"08:00"));return isNaN(t)?null:t.getTime();};
const DAY=864e5;
const fmtDay=ts=>new Date(ts).toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"});
const fmtFull=ts=>fmtDay(ts)+" à "+new Date(ts).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});
const fmtShort=ts=>new Date(ts).toLocaleDateString("fr-FR",{day:"numeric",month:"short"});
function cdInner(ts){const m=Math.max(0,Math.floor((ts-Date.now())/6e4)),j=Math.floor(m/1440),h=Math.floor(m%1440/60),mn=m%60,p=n=>String(n).padStart(2,"0");
 return `<span><b>${j}</b><small>jour${j>1?"s":""}</small></span><span><b>${p(h)}</b><small>heure${h>1?"s":""}</small></span><span><b>${p(mn)}</b><small>min</small></span>`;}
const cdBox=ts=>`<div class="cd" data-cd="${ts}" role="timer">${cdInner(ts)}</div>`;
const day0=ts=>{const d=new Date(ts);d.setHours(0,0,0,0);return d.getTime();};
const jMoins=ts=>{const d=Math.round((day0(ts)-day0(Date.now()))/DAY);return d<=0?"aujourd'hui":"J-"+d;};
let cdTick=false;
setInterval(()=>{const els=document.querySelectorAll("[data-cd]");if(!els.length)return;
 let past=false;els.forEach(el=>{const ts=+el.dataset.cd;if(ts<=Date.now())past=true;else el.innerHTML=cdInner(ts);});
 if(past&&!cdTick&&!document.activeElement.matches("input,textarea,select")){cdTick=true;render();cdTick=false;}},15000);

function examCard(){
 const now=Date.now(),list=exams().map(e=>({...e,ts:at(e.date,e.heure)})).filter(e=>e.ts).sort((a,b)=>a.ts-b.ts),up=list.filter(e=>e.ts>now);
 if(state.examEdit) return `<section class="cd-card"><div class="cd-top"><span class="eyebrow">Mes partiels</span><button class="link" data-act="exam-done">Terminé</button></div>
  ${list.length?`<div class="list">${list.map(e=>`<div class="li cd-li"><span><span class="t">${esc(e.nom)}</span><span class="s">${esc(fmtFull(e.ts))}${e.ts<now?" · passé":" · "+jMoins(e.ts)}</span></span><button class="del" data-act="exam-del" data-id="${esc(e.id)}" aria-label="Supprimer ${esc(e.nom)}">${IC.x}</button></div>`).join("")}</div>`:`<p class="muted">Ajoutez chaque partiel avec sa date : le plus proche s'affiche sur l'accueil.</p>`}
  <form id="exam-form" class="cd-form"><label for="ex-nom">Intitulé<input id="ex-nom" required maxlength="80" placeholder="Ex. Partiels S1, UE 2.11 Pharmacologie" autocomplete="off"></label>
   <div class="cd-row"><label for="ex-date">Date<input id="ex-date" type="date" required></label><label for="ex-heure">Heure<input id="ex-heure" type="time" value="08:00"></label></div>
   <button class="btn block" type="submit">${IC.plus}Ajouter ce partiel</button></form></section>`;
 if(!up.length) return `<button class="cd-card cd-empty" data-act="exam-edit"><span class="cd-ic">${IC.cal}</span><span><b>${list.length?"Plus de partiels à venir":"Compte à rebours des partiels"}</b><small>${list.length?"Ajoutez les dates de la prochaine session":"Ajoutez la date de vos prochains partiels"}</small></span>${IC.plus}</button>`;
 const n=up[0];
 return `<section class="cd-card"><div class="cd-top"><span class="eyebrow">Prochains partiels · ${jMoins(n.ts)}</span><button class="link" data-act="exam-edit">Modifier</button></div>
  <h2>${esc(n.nom)}</h2>${cdBox(n.ts)}<p class="cd-date">${IC.cal}${esc(fmtFull(n.ts))}</p>
  ${up.length>1?`<ul class="cd-next">${up.slice(1,4).map(e=>`<li><span>${esc(e.nom)}</span><span>${esc(fmtShort(e.ts))} · ${jMoins(e.ts)}</span></li>`).join("")}</ul>`:""}</section>`;
}

const STAGE_TYPES=["Soins de courte durée","Santé mentale et psychiatrie","Soins de longue durée et SMR","Soins sur des lieux de vie"];
function stageCountdown(){
 const s=stageInfo(),start=at(s.debut,s.arrivee||"07:00"),end=s.fin?at(s.fin,"23:59"):null,now=Date.now(),title=s.service?esc(s.service):"Mon prochain stage";
 if(!start) return `<section class="cd-card cd-stage" id="stage-cd"><span class="eyebrow">Compte à rebours</span><h2>${title}</h2><p class="muted">Renseignez la date de début ci-dessous pour lancer le compte à rebours.</p></section>`;
 if(now<start) return `<section class="cd-card cd-stage" id="stage-cd"><span class="eyebrow">Début du stage · ${jMoins(start)}</span><h2>${title}</h2>${cdBox(start)}<p class="cd-date">${IC.cal}${esc(fmtFull(start))}${end?` · jusqu'au ${esc(fmtShort(end))}`:""}</p></section>`;
 if(end&&now>end) return `<section class="cd-card cd-stage" id="stage-cd"><span class="eyebrow">Stage terminé</span><h2>${title}</h2><p class="muted">Pensez à compléter votre portfolio et à <a class="link" href="#carnet/imprimer">imprimer votre carnet de suivi</a>. Quand vous connaissez votre prochain stage, effacez ces informations et le carnet pour repartir de zéro.</p><button class="btn ghost block" data-act="stage-new">Préparer un nouveau stage</button></section>`;
 const tot=end?Math.max(1,Math.round((day0(end)-day0(start))/DAY)+1):null,jour=Math.round((day0(now)-day0(start))/DAY)+1;
 return `<section class="cd-card cd-stage" id="stage-cd"><span class="eyebrow">Stage en cours${tot?` · jour ${Math.min(jour,tot)} sur ${tot}`:""}</span><h2>${title}</h2>
  ${tot?`<div class="progress"><i style="width:${Math.min(100,jour/tot*100)}%"></i></div>`:""}${end?`<p class="muted">Fin du stage dans</p>${cdBox(end)}`:`<p class="muted">Ajoutez la date de fin pour suivre l'avancée du stage.</p>`}</section>`;
}
function stageForm(){
 const s=stageInfo(),f=(k,label,attrs="")=>`<label for="sf-${k}">${label}<input id="sf-${k}" data-sf="${k}" value="${esc(s[k]||"")}" ${attrs}></label>`,
  t=(k,label,ph)=>`<label for="sf-${k}">${label}<textarea id="sf-${k}" data-sf="${k}" rows="3" placeholder="${ph}">${esc(s[k]||"")}</textarea></label>`;
 return `<section class="stack-sm"><div class="section-title"><h2>Infos du stage</h2><span class="muted" id="sf-saved">Enregistré sur cet appareil</span></div>
  <div class="cd-form sheet-body">
   ${f("service","Service et établissement",'placeholder="Ex. Cardiologie, CH de Valence" maxlength="100" autocomplete="off"')}
   <label for="sf-lieu">Lieu de stage (guide)<select id="sf-lieu" data-cn="lieu"><option value="">Choisir le service…</option>${STAGES.map(x=>`<option ${x.nom===s.lieu?"selected":""}>${esc(x.nom)}</option>`).join("")}</select></label>
   <label for="sf-type">Type de stage<select id="sf-type" data-sf="type"><option value="">Choisir</option>${STAGE_TYPES.map(x=>`<option ${s.type===x?"selected":""}>${x}</option>`).join("")}</select></label>
   <div class="cd-row">${f("debut","Début",'type="date"')}${f("fin","Fin",'type="date"')}</div>
   <div class="cd-row">${f("arrivee","Arrivée le 1er jour",'type="time"')}${f("horaires","Horaires",'placeholder="Ex. 6h45-14h15" maxlength="60"')}</div>
   ${f("adresse","Adresse, lieu de rendez-vous",'placeholder="Bâtiment, étage, accueil" maxlength="140"')}
   <div class="cd-row">${f("tuteur","Tuteur ou tutrice",'placeholder="Nom" maxlength="60" autocomplete="off"')}${f("cadre","Cadre de santé",'placeholder="Nom" maxlength="60" autocomplete="off"')}</div>
   <div class="cd-row">${f("tel","Téléphone du service",'type="tel" placeholder="04 00 00 00 00" maxlength="30"')}<label for="sf-sem">Semestre<select id="sf-sem" data-sf="sem"><option value="">–</option>${[1,2,3,4,5,6].map(n=>`<option ${s.sem==="S"+n?"selected":""}>S${n}</option>`).join("")}</select></label></div>
   ${t("tenue","Tenue et matériel à prévoir","Tenues fournies ? Chaussures, montre, stylos, carnet…")}
   ${t("objectifs","Mes objectifs de stage","Ex. réaliser une prise en charge globale de 2 patients")}
   ${t("notes","Notes","Pathologies fréquentes du service, vocabulaire, questions à poser…")}
  </div></section>`;
}

/* ---------- Accueil ---------- */
function vAccueil(){
 const s=stats(),pct=totalItems?Math.round(doneItems()/totalItems*100):0,h=new Date().getHours();
 const date=new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"});
 const last=store.get("last",null);let resume="";
 if(last){const it=last.t==="f"?FICHES.find(x=>x.id===last.id):COURS.find(x=>x.id===last.id);
  if(it)resume=`<section class="stack-sm"><div class="section-title"><h2>Reprendre</h2></div>
   <a class="card resume" href="#${last.t==="f"?"fiche":"cours"}/${it.id}" style="--c:${CAT[it.cat].c}"><span class="ic">${CAT_IC[it.cat]}</span><span><span class="eyebrow">${last.t==="f"?"Fiche":"Cours"} · ${esc(CAT[it.cat].nom)}</span><h3>${esc(it.titre)}</h3></span><svg class="chev" viewBox="0 0 24 24" style="width:16px;height:16px;stroke:var(--line-2);fill:none;stroke-width:2.2"><path d="M9 6l6 6-6 6"/></svg></a></section>`;}
 const nW=wrongs().length;
 return `<div class="stack-lg">
  <header class="vh-row"><div class="hello"><span class="date">${esc(date)}</span><h1>${h<5||h>=18?"Bonsoir":"Bonjour"}</h1></div>
   <button class="icon-btn" data-act="nav" data-h="reglages" aria-label="Réglages">${IC.gear}</button></header>
  ${examCard()}
  <button class="search-pill" data-act="nav" data-h="recherche">${IC.search}Rechercher une fiche, un cours, une notion…</button>
  <section class="dash">${ring(pct)}
   <div class="dash-txt"><span class="k">Ma progression</span><h2>${doneItems()} sur ${totalItems} contenus révisés</h2>
    <div class="dash-stats"><span><b>${s.exTot?Math.round(s.exOk/s.exTot*100)+"%":"–"}</b>calculs justes</span><span><b>${s.quizBest==null?"–":s.quizBest}</b>meilleur quiz</span></div></div></section>
  ${resume}
  <section class="stack-sm"><div class="section-title"><h2>S'entraîner</h2></div>
   <div class="quick">
    <button class="qa" data-act="quiz-quick"><span class="ic">${IC.bolt}</span><b>Quiz express</b><small>10 questions au hasard</small></button>
    <button class="qa" data-act="nav" data-h="entrainer/calculs"><span class="ic acc">${IC.flask}</span><b>Calcul de dose</b><small>Énoncés illimités</small></button>
    <button class="qa" data-act="quiz-wrong" ${nW?"":"disabled style='opacity:.55'"}><span class="ic acc">${IC.redo}</span><b>Mes erreurs</b><small>${nW?plural(nW,"question")+" à revoir":"Aucune pour l'instant"}</small></button>
    <button class="qa" data-act="favs"><span class="ic">${IC.star}</span><b>Favoris</b><small>${plural(favs().length,"élément")}</small></button>
   </div></section>
  <section class="stack-sm"><div class="section-title"><h2>Boîte à outils</h2><a href="#outils">Tout voir</a></div>
   <div class="ot-mini">${["planning","pansement","tfe","calculs"].map(id=>{const t=TOOLS.find(x=>x.id===id);return `<a href="#outil/${id}"><span class="ic tb-ic" style="--c:${t.c}">${OT_IC[id]}</span>${esc(t.s)}</a>`;}).join("")}</div></section>
  <section class="stack-sm"><div class="section-title"><h2>Réviser par thème</h2><a href="#reviser">Tout voir</a></div>
   <div class="cats">${CATS.map(c=>{const n=FICHES.filter(f=>f.cat===c.id).length+FULL_COURS.filter(x=>x.cat===c.id).length;
    const sub=c.id==="stage"?"Préparation":c.id==="calcul"?"Exercices illimités":c.id==="quiz"?QUIZ.length+" questions":c.id==="patho"?PATHOS.length+" pathologies par spécialité":(c.id==="soins"||c.id==="exam")&&soCatN(c.id)?`${soCatN(c.id)} fiches ${c.id==="exam"?"de surveillance":"de soins"} + ${plural(n,"contenu")}`:c.id==="thera"&&mdN()?`${mdN()} classes thérapeutiques + ${plural(n,"contenu")}`:plural(n,"contenu");
    return `<button class="cat-row" style="--c:${c.c}" data-act="go-cat" data-k="${c.id}"><span class="sw">${CAT_IC[c.id].replace('<svg','<svg style="width:18px;height:18px;stroke:#1A252A;fill:none;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round"')}</span><span><b>${esc(c.nom)}</b><small>${sub}</small></span></button>`}).join("")}</div></section>
  <a href="#programme" class="list"><span class="li"><span class="ic">${IC.cap.replace("<svg",'<svg style="stroke:var(--brand)"')}</span><span><span class="t">Suivre le programme par UE</span><span class="s">Référentiels 2026 et 2009, semestres 1 à 6</span></span><svg class="chev" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></span></a>
  <p class="disclaimer">Contenus pédagogiques. Vérifiez toujours avec vos cours et les protocoles de votre établissement.</p></div>`;
}

/* ---------- Réviser ---------- */
const chev='<svg class="chev" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>';
function itemRow(it,t){
 const done=t==="f"?reviewed().includes(it.id):studied().includes(it.id),fav=isFav(t+":"+it.id);
 const soon=t==="c"&&it.pro;
 const tag=soon?'<span class="tag soon">À venir</span>':done?`<span class="tag done">${t==="f"?"Révisée":"Étudié"}</span>`:t==="f"&&it.pages?'<span class="tag full">Complète</span>':t==="c"&&it.chap?`<span class="tag">${esc(it.duree)}</span>`:"";
 const sub=t==="f"?esc(it.theme):it.chap?`${it.chap.length} chapitres`:soon?"Contenu en préparation":`${it.sections.length} parties · ${esc(it.duree)}`;
 return `<${soon?"div":"a"} class="li" ${soon?"":`href="#${t==="f"?"fiche":"cours"}/${it.id}"`} style="--c:${CAT[it.cat].c}${soon?";opacity:.6;cursor:default":""}"><span class="bar"></span><span><span class="t">${fav?`<span style="color:var(--gold)">★</span> `:""}${esc(it.titre)}</span><span class="s">${sub}</span></span><span class="end">${tag}${soon?"":chev}</span></${soon?"div":"a"}>`;
}
function vReviser(arg){
 if(arg==="fiches"||arg==="cours"){state.rev=arg;store.set("rev",arg);}
 const isF=state.rev==="fiches",t=isF?"f":"c",all=isF?FICHES:COURS;
 const items=state.favOnly?all.filter(i=>isFav(t+":"+i.id)):all;
 /* Les fiches et cours complets de pathologie sont rangés dans le Programme (par UE) ; ici, Pathologies = les 528 pathologies par spécialité
    (les favoris restent visibles en mode Favoris). */
 const present=CATS.filter(c=>c.id==="patho"||all.some(i=>i.cat===c.id));
 if(state.filter!=="all"&&!present.some(c=>c.id===state.filter))state.filter="all";
 const cats=CATS.filter(c=>(state.filter==="all"||state.filter===c.id)&&(c.id==="patho"&&!state.favOnly||items.some(i=>i.cat===c.id)));
 const nDone=isF?reviewed().filter(id=>FICHES.some(f=>f.id===id)).length:studied().filter(id=>FULL_COURS.some(c=>c.id===id)).length;
 const pxv=state.filter==="patho"&&!state.favOnly,pxd=pxv?pxDone().filter(id=>PBY[id]).length:0;
 const sov=(state.filter==="soins"||state.filter==="exam")&&!state.favOnly&&soCatN(state.filter)>0,son=sov?soCatN(state.filter):0;
 const mdv=state.filter==="thera"&&!state.favOnly&&mdN()>0;
 const desc=mdv?(isF?`${mdN()} grandes fiches de classes thérapeutiques classées par spécialité : l'essentiel de chaque classe en une page.`:`Une fiche complète par classe : mécanisme en schéma, médicaments (DCI et noms commerciaux), effets indésirables, interactions, surveillances, éducation, conduite à tenir et quiz.`):sov?(isF?`${son} fiches ${state.filter==="exam"?"de surveillance et d'examens":"de soins"} classées par catégorie : l'essentiel de chaque soin en une page.`:`Un cours détaillé par soin : indications, matériel illustré, réalisation pas à pas, surveillance, traçabilité et mise en situation.`):pxv?(isF?`Les ${PATHOS.length} pathologies du programme classées par spécialité : l'essentiel de chacune en une page. ${pxd} étudiée${pxd>1?"s":""}.`:`Un cours détaillé pour chacune des ${PATHOS.length} pathologies : mécanisme en images, signes, examens, traitements, rôle infirmier.`)
  :isF?`L'essentiel en une page, à relire avant un partiel ou le matin d'un stage. ${nDone} / ${FICHES.length} révisées.`:`Comprendre, pas seulement retenir. ${nDone} / ${FULL_COURS.length} cours étudiés.`;
 return `<div class="stack-lg">${vh("Réviser",isF?"Fiches récap":"Cours détaillés",desc,
   `<button class="icon-btn" data-act="nav" data-h="recherche" aria-label="Rechercher">${IC.search}</button>`)}
  ${pxv||sov||mdv?"":pxCard()}
  <div class="seg" role="group" aria-label="Type de contenu"><button data-act="rev" data-k="fiches" aria-pressed="${isF}">Fiches · ${pxv?pxRevN(true):sov?son:mdv?mdN():FICHES.length}</button><button data-act="rev" data-k="cours" aria-pressed="${!isF}">Cours · ${pxv?pxRevN(false):sov?son:mdv?mdN():FULL_COURS.length}</button></div>
  <div class="chips" role="group" aria-label="Filtrer">
   <button class="chip" data-act="fav-only" aria-pressed="${state.favOnly}">★ Favoris</button>
   <button class="chip" data-act="filter" data-k="all" aria-pressed="${state.filter==="all"}">Tout</button>
   ${present.map(c=>`<button class="chip" style="--c:${c.c}" data-act="filter" data-k="${c.id}" aria-pressed="${state.filter===c.id}"><i></i>${esc(c.nom)}</button>`).join("")}</div>
  ${pxv?pxRev(isF):sov?soRev(state.filter,isF):mdv?mdRev(isF):cats.length?cats.map(c=>{const head=n=>`<div class="cat-head" style="--c:${c.c}"><span class="dot"></span><h2>${esc(c.nom)}</h2><span class="muted" style="margin-left:auto">${n}</span></div>`;
   if(c.id==="patho"&&!state.favOnly)return `<section class="stack-sm">${head(PATHOS.length)}<div class="list"><a class="li px-entry" role="button" tabindex="0" data-act="px-go" style="--c:${c.c}"><span class="bar"></span><span><span class="t">Toutes les pathologies par spécialité</span><span class="s">${PATHOS.length} ${isF?"fiches récap":"cours détaillés"} · cardio, pneumo, neuro…</span></span><span class="end">${chev}</span></a></div></section>`;
   const l=items.filter(i=>i.cat===c.id).sort((a,b)=>(b.pages||b.chap?1:0)-(a.pages||a.chap?1:0)||(a.pro?1:0)-(b.pro?1:0));
   return `<section class="stack-sm">${head(l.length)}<div class="list">${(c.id==="soins"||c.id==="exam")&&!state.favOnly&&soCatN(c.id)?soEntry(c,isF):""}${c.id==="thera"&&!state.favOnly&&mdN()?mdEntry(isF):""}${l.map(i=>itemRow(i,t)).join("")}</div></section>`}).join("")
   :`<div class="empty">${state.favOnly?"Aucun favori ici. Touchez l'étoile en haut d'une fiche ou d'un cours pour l'ajouter.":"Pas encore de contenu dans cette catégorie."}</div>`}
 </div>`;
}

/* ---------- Lecture ---------- */
const favBtn=k=>`<button class="fav-btn" data-act="fav" data-k="${k}" aria-pressed="${isFav(k)}" aria-label="${isFav(k)?"Retirer des favoris":"Ajouter aux favoris"}">${IC.star}</button>`;
function withFav(html,k){return html.replace(/(<div class="fv-top">)(<button class="fv-back"[^]*?<\/button>)([^]*?)(<\/div>)/,(m,a,b,c,d)=>`${a}${b}<span class="fv-acts">${c}${favBtn(k)}</span>${d}`);}
function vFiche(id){
 const f=FICHES.find(x=>x.id===id);if(!f)return notFound();
 store.set("last",{t:"f",id});state.fiche=id;
 if(f.pages)return withFav(fvRender(f),"f:"+id).replace(`${SVG.back}Fiches</button>`,`${SVG.back}Retour</button>`);
 const cat=CAT[f.cat],done=reviewed().includes(id);
 return `<article class="sheet" style="--c:${cat.c}">
  <header class="sheet-hero"><div class="fv-top"><button class="fv-back" data-act="back">${SVG.back}Retour</button><span class="fv-acts">${done?'<span class="fv-done-badge">Révisée</span>':""}${favBtn("f:"+id)}</span></div>
   <span class="fv-kicker">${esc(cat.nom)} · ${esc(f.theme)}</span><h1>${esc(f.titre)}</h1>
   <div class="fv-meta">${(f.ue&&f.ue[state.ueRef]||[]).map(u=>`<span class="m">UE ${esc(u)}</span>`).join("")}</div></header>
  <div class="sheet-body">${f.body}</div>
  <div class="fv-end"><h3>${done?"Fiche révisée":"Fiche terminée ?"}</h3><p class="muted">Marquez-la pour suivre votre progression.</p>
   <div class="row2"><button class="btn ${done?"ghost":"ok"}" data-act="fv-done" data-id="${id}">${done?"Retirer des révisées":"J'ai révisé cette fiche"}</button>
   ${QUIZ.some(q=>q.cat===f.cat)?`<button class="btn ghost" data-act="fv-quiz" data-k="${f.cat}">Quiz ${esc(cat.nom)}</button>`:""}</div></div></article>`;
}
function vCoursView(id){
 const c=COURS.find(x=>x.id===id);if(!c||c.pro)return notFound();
 store.set("last",{t:"c",id});state.cours=id;
 if(c.chap)return withFav(cvRender(c),"c:"+id).replace(`${SVG.back}Cours</button>`,`${SVG.back}Retour</button>`);
 const cat=CAT[c.cat];
 return `<article class="sheet" style="--c:${cat.c}">
  <header class="sheet-hero"><div class="fv-top"><button class="fv-back" data-act="back">${SVG.back}Retour</button><span class="fv-acts">${favBtn("c:"+id)}</span></div>
   <span class="fv-kicker">Cours · ${esc(cat.nom)}</span><h1>${esc(c.titre)}</h1>
   <div class="fv-meta"><span>≈ ${esc(c.duree)}</span>${(c.ue&&c.ue[state.ueRef]||[]).map(u=>`<span class="m">UE ${esc(u)}</span>`).join("")}</div></header>
  ${c.sections.map((s,i)=>`<section class="sheet-body"><div class="fv-sh"><span class="fv-num">${String(i+1).padStart(2,"0")}</span><h2>${esc(s[0])}</h2></div><p>${esc(s[1])}</p>${s[2]?schFig(s[2].k,s[2].cap):""}</section>`).join("")}
  ${QUIZ.some(q=>q.cat===c.cat)?`<button class="btn block" data-act="fv-quiz" data-k="${c.cat}">Vérifier mes connaissances</button>`:""}</article>`;
}
const notFound=()=>`<div class="stack-lg">${backBtn("Retour")}<div class="empty">Ce contenu est introuvable.</div></div>`;

/* ---------- S'entraîner : quiz ---------- */
function startQuiz(list,label){state.quiz={order:list.slice().sort(()=>Math.random()-.5),src:list.slice(),i:0,score:0,answered:null,label};}
const quizIdx=f=>QUIZ.map((q,i)=>i).filter(i=>f(QUIZ[i]));
function vQuizHome(){
 const present=CATS.filter(c=>QUIZ.some(q=>q.cat===c.id)),nW=wrongs().length;
 const n=state.quizCat==="all"?QUIZ.length:QUIZ.filter(q=>q.cat===state.quizCat).length;
 return `<div class="q-modes">
   <button class="qa" data-act="quiz-quick" style="flex-direction:row;align-items:center"><span class="ic">${IC.bolt}</span><span style="flex:1"><b>Quiz express</b><br><small>10 questions tirées au hasard</small></span>${chev}</button>
   <button class="qa" data-act="quiz-wrong" style="flex-direction:row;align-items:center${nW?"":";opacity:.55"}" ${nW?"":"disabled"}><span class="ic acc">${IC.redo}</span><span style="flex:1"><b>Revoir mes erreurs</b><br><small>${nW?plural(nW,"question")+" ratée"+(nW>1?"s":""):"Les questions ratées apparaîtront ici"}</small></span>${chev}</button>
  </div>
  <section class="stack-sm"><div class="section-title"><h2>Par catégorie</h2></div>
   <div class="chips wrapchips" role="group" aria-label="Catégorie du quiz">
    <button class="chip" data-act="quiz-cat" data-k="all" aria-pressed="${state.quizCat==="all"}">Tout mélanger</button>
    ${present.map(c=>`<button class="chip" style="--c:${c.c}" data-act="quiz-cat" data-k="${c.id}" aria-pressed="${state.quizCat===c.id}"><i></i>${esc(c.nom)}</button>`).join("")}</div>
   <button class="btn block" data-act="quiz-start">${IC.play}Commencer · ${plural(n,"question")}</button></section>
  ${pxQuizBlock()}`;
}
function vQuizRun(){
 const z=state.quiz;
 if(z.i>=z.order.length){const pct=Math.round(z.score/z.order.length*100);
  return `<div class="stack-lg"><div class="q-top"><span class="eyebrow">${esc(z.label||"Quiz")}</span><button class="q-close" data-act="quiz-reset">Fermer</button></div>
   <div class="score-hero">${ring(pct,140)}<h1>${z.score} / ${z.order.length}</h1>
   <p class="lead">${pct>=85?"Excellent, vous maîtrisez cette partie.":pct>=60?"Bien. Relisez les fiches sur vos erreurs.":"Reprenez les fiches récap, puis retentez."}</p></div>
   <div class="btn-row"><button class="btn" data-act="quiz-again">Recommencer</button><button class="btn ghost" data-act="quiz-reset">Autre quiz</button></div></div>`;}
 const q=QUIZ[z.order[z.i]],L="ABCDEF";
 return `<div class="stack-lg"><div class="stack-sm"><div class="q-top"><span class="eyebrow">Question ${z.i+1} sur ${z.order.length}</span><button class="q-close" data-act="quiz-reset">Quitter</button></div>
  <div class="progress"><i style="width:${(z.i+(z.answered!=null?1:0))/z.order.length*100}%"></i></div></div>
  <div class="q-card"><div>${sticker(q.cat)}</div><h2>${esc(q.q)}</h2>
  <div class="stack-sm">${q.o.map((o,k)=>{let c="";if(z.answered!=null){if(k===q.a)c="good";else if(k===z.answered)c="wrong";}
   return `<button class="opt ${c}" data-act="quiz-ans" data-k="${k}" ${z.answered!=null?"disabled":""}><span class="l">${L[k]}</span><span>${esc(o)}</span></button>`}).join("")}</div>
  ${z.answered!=null?`<div class="feedback ${z.answered===q.a?"ok":"ko"}"><b>${z.answered===q.a?"Bonne réponse":"Pas tout à fait"}</b><span>${esc(q.e)}</span></div>`:""}</div>
  ${z.answered!=null?`<button class="btn block" data-act="quiz-next">${z.i+1<z.order.length?"Question suivante":"Voir mon score"}</button>`:""}</div>`;
}

/* ---------- S'entraîner : calculs ---------- */
function vCalc(){
 if(!state.ex)state.ex={...GEN[state.calcType].make(),done:null,val:""};
 const e=state.ex,s=stats();
 return `<div class="chips" role="group" aria-label="Type d'exercice">${Object.entries(GEN).map(([k,g])=>`<button class="chip" data-act="calc-type" data-k="${k}" aria-pressed="${k===state.calcType}">${g.label}</button>`).join("")}</div>
  <div class="calc-card"><div class="row"><span class="eyebrow">Énoncé · ${esc(GEN[state.calcType].label)}</span><span class="muted" style="font-size:.8rem">${s.exOk} / ${s.exTot} justes</span></div>
   <div class="presc">${e.presc}</div><h3>${e.q}</h3>
   <form class="answer" id="calc-form"><input id="calc-in" inputmode="decimal" enterkeyhint="done" autocomplete="off" placeholder="Votre réponse" value="${esc(e.val)}" ${e.done?"disabled":""} aria-label="Votre réponse"><span class="unit">${e.unit}</span>${e.done?"":`<button class="btn" type="submit">Vérifier</button>`}</form>
   ${e.done?`<div class="feedback ${e.done==="ok"?"ok":"ko"}"><b>${e.done==="ok"?"Juste !":"Réponse attendue : "+fr(e.ans)+" "+e.unit}</b><ol class="steps">${e.steps.map(s=>`<li>${s}</li>`).join("")}</ol></div>
    <button class="btn block" data-act="calc-new">Nouvel exercice</button>`:`<button class="back" data-act="calc-show">Voir la correction</button>`}
  </div>
  <a class="list" href="#reviser/fiches" data-act="go-cat" data-k="calcul-fiches"><span class="li"><span class="ic" style="--c:${CAT.calcul.c}">${CAT_IC.calcul}</span><span><span class="t">Revoir les formules</span><span class="s">Fiches Calculs et dosages</span></span>${chev}</span></a>
  <p class="disclaimer">En pratique, un calcul de dose se fait toujours en double vérification.</p>`;
}
function vEntrainer(arg){
 if(arg==="quiz"||arg==="calculs"||arg==="schemas")state.train=arg;
 if(state.train==="quiz"&&state.quiz)return vQuizRun();
 const T=state.train==="schemas"?"schemas":state.train==="quiz"?"quiz":"calculs";
 const H={quiz:["Quiz",`${QUIZ.length} questions, chaque réponse est expliquée.`],calculs:["Calculs de dose","Un nouvel énoncé à chaque fois, avec la correction détaillée."],schemas:["Schémas à compléter","Placez les structures sur les schémas et remettez les étapes dans l'ordre."]}[T];
 return `<div class="stack-lg">${vh("S'entraîner",H[0],H[1])}
  <div class="seg three" role="group" aria-label="Type d'entraînement"><button data-act="train" data-k="quiz" aria-pressed="${T==="quiz"}">Quiz</button><button data-act="train" data-k="calculs" aria-pressed="${T==="calculs"}">Calculs</button><button data-act="train" data-k="schemas" aria-pressed="${T==="schemas"}">Schémas</button></div>
  ${T==="quiz"?vQuizHome():T==="schemas"?vSchemas():vCalc()}</div>`;
}

/* ---------- Stages ---------- */
function vStages(){
 const done=store.get("check",[]);
 return `<div class="stack-lg">${vh("Stages","Arriver préparé·e dans chaque service",`Compte à rebours, infos pratiques, check-list, posture et repères pour ${STAGES.length} services.`)}
  ${stageCountdown()}
  ${carnetCard()}
  ${feuillesCard()}
  ${stageForm()}
  <section class="stack-sm"><div class="section-title"><h2>Avant le premier jour</h2><span class="muted">${done.length} / ${CHECKLIST.length}</span></div>
   <div class="progress"><i style="width:${done.length/CHECKLIST.length*100}%"></i></div>
   <div class="list" style="padding:4px 14px">${CHECKLIST.map((c,i)=>`<label class="chk"><input type="checkbox" data-act="check" data-i="${i}" ${done.includes(i)?"checked":""}><span>${esc(c)}</span></label>`).join("")}</div></section>
  <section class="stack-sm"><h2>Posture professionnelle</h2><div class="sheet-body"><ul class="fv-list" style="--c:${CAT.stage.c}">${POSTURE.map(p=>`<li>${esc(p)}</li>`).join("")}</ul></div></section>
  <section class="stack-sm"><h2>Objectifs selon le semestre</h2><div class="sheet-body"><div class="fv-tbl">${OBJECTIFS.map(o=>{const [a,b]=o.split(" : ");return `<div><span>${esc(a)}</span><span>${esc(b)}</span></div>`}).join("")}</div><span class="muted">Repères indicatifs : vos objectifs se construisent avec votre formateur et votre tuteur.</span></div></section>
  ${FICHES.some(f=>f.cat==="stage"&&!f.id.startsWith("guide-"))?`<section class="stack-sm"><h2>Fiches méthode</h2><div class="list">${FICHES.filter(f=>f.cat==="stage"&&!f.id.startsWith("guide-")).map(f=>itemRow(f,"f")).join("")}</div></section>`:""}
  <section class="stack-sm"><div class="section-title"><h2>Par lieu de stage</h2><span class="muted">${STAGES.length} services</span></div>
   <p class="muted">Pour chaque service : ce qu'il faut réviser, les soins que vous rencontrerez, des objectifs prêts à reprendre dans votre portfolio et les erreurs fréquentes.</p>
   ${STAGES.map(svcCard).join("")}</section></div>`;
}
const COMP={1:"Évaluer une situation clinique et établir un diagnostic infirmier",2:"Concevoir et conduire un projet de soins infirmiers",3:"Accompagner une personne dans la réalisation de ses soins quotidiens",4:"Mettre en œuvre des actions à visée diagnostique et thérapeutique",5:"Initier et mettre en œuvre des soins éducatifs et préventifs",6:"Communiquer et conduire une relation dans un contexte de soins",7:"Analyser la qualité des soins et améliorer sa pratique professionnelle",8:"Rechercher et traiter des données professionnelles et scientifiques",9:"Organiser et coordonner des interventions soignantes",10:"Informer et former des professionnels et des personnes en formation"};
const objText=t=>"• "+t.replace(/\*\*/g,"");
function svcCard(sv,i){
 const mine=stageInfo().objectifs||"",with09=state.ueRef==="2009";
 const blk=(lab,cls,items)=>items&&items.length?`<div class="svc-blk ${cls}"><span class="svc-lab">${lab}</span><ul class="svc-list">${items.map(x=>`<li>${md(x)}</li>`).join("")}</ul></div>`:"";
 const links=(sv.fiches||[]).map(id=>{const f=FICHES.find(x=>x.id===id),c=f?null:COURS.find(x=>x.id===id&&!x.pro);const it=f||c;return it?`<a class="chip" href="#${f?"fiche":"cours"}/${id}">${esc(it.titre)}</a>`:"";}).join("");
 const isMine=stageInfo().lieu===sv.nom;
 return `<details class="svc" ${isMine?"open":""}><summary><span class="svc-t">${esc(sv.nom)}${isMine?'<span class="svc-mine">Mon stage</span>':""}</span></summary><div class="det-body">
  ${sv.intro?`<p class="svc-intro">${md(sv.intro)}</p>`:""}
  ${blk("Pathologies à connaître","t-patho",sv.patho)}
  ${blk("Thérapeutiques à connaître","t-thera",sv.thera)}
  ${blk("Soins rencontrés","t-soins",sv.soins)}
  ${sv.obj&&sv.obj.length?`<div class="svc-blk t-obj"><span class="svc-lab">Objectifs de stage possibles</span><ul class="svc-obj">${sv.obj.map((o,j)=>{const on=mine.includes(objText(o[1]));
    return `<li>${with09?`<span class="comp" title="${esc(COMP[o[0]])}">C${o[0]}</span>`:""}<span>${md(o[1])}</span><button class="del add" data-act="obj-add" data-s="${i}" data-i="${j}" aria-pressed="${on}" aria-label="${on?"Déjà dans mes objectifs":"Ajouter à mes objectifs de stage"}">${on?IC.check:IC.plus}</button></li>`}).join("")}</ul>
   <small class="muted">Touchez + pour ajouter l'objectif à « Mes objectifs de stage » ci-dessus. ${with09?"C1 à C10 : compétences du référentiel 2009.":"À relier aux compétences de votre portfolio."} Reformulez-les avec votre tuteur.</small></div>`:""}
  ${links?`<div class="svc-blk t-fiches"><span class="svc-lab">À réviser dans l'appli</span><div class="chips wrapchips">${links}</div></div>`:""}
  ${sv.pieges&&sv.pieges.length?`<div class="callout warn"><span class="eyebrow">Erreurs fréquentes</span><ul class="clean">${sv.pieges.map(x=>`<li>${md(x)}</li>`).join("")}</ul></div>`:""}
  ${isMine?`<a class="btn ghost" href="#carnet">Ouvrir mon carnet de suivi</a>`:`<button class="btn ghost" data-act="cn-lieu-set" data-k="${esc(sv.nom)}">C'est mon lieu de stage</button>`}
 </div></details>`;
}

/* ---------- Programme (UE) ---------- */
/* Les fiches et cours complets de pathologie sont rangés par UE dans le Programme ; la catégorie Pathologies de Réviser
   regroupe les 528 pathologies par spécialité. */
const PROC_UE=["2.3","2.4","2.5","2.6","2.7","2.8","2.9"];
const procOf=it=>{const l=(it.ue&&it.ue["2009"]||[]).filter(c=>PROC_UE.includes(c));return l.length?l:["2.7"];};
/* Regroupe des contenus de pathologie par processus (UE 2.3 à 2.9 du référentiel 2009) ; all=false : processus principal seulement. */
function procGroups(list,all){const g={};list.forEach(it=>(all?procOf(it):procOf(it).slice(0,1)).forEach(c=>{(g[c]=g[c]||[]).push(it);}));
 return UE["2009"].list.filter(u=>g[u[0]]).map(u=>[u[0],u[1],g[u[0]]]);}
/* Programme : fiches et cours complets de pathologie rangés par UE (2009 : UE 2.3 à 2.9 ; 2026 : UE B.1 par processus). */
function ueProcBlock(){const r=state.ueRef,open=state.uePg||{};
 const items=[...COURS.filter(c=>c.cat==="patho"&&!c.pro),...FICHES.filter(f=>f.cat==="patho")];
 return `<section class="stack-sm"><div class="section-title"><h2>Pathologies par UE</h2></div>
  <p class="muted ue-note">Les fiches et cours complets de pathologie, rangés dans leur unité d'enseignement${r==="2009"?"":" (UE B.1, classés par processus)"}. Les ${PATHOS.length} pathologies par spécialité sont dans Réviser.</p>
  ${procGroups(items,r==="2009").map(([code,lab,its])=>{const ue=r==="2009"?code:"B.1",u=UE[r].list.find(x=>x[0]===ue),k=r+code;
   const c=its.filter(i=>!FICHES.includes(i)),f=its.filter(i=>FICHES.includes(i));
   return `<details class="ue-pg"${open[k]?" open":""}><summary data-act="ue-pg" data-k="${k}"><span class="code">UE ${esc(ue)}</span><span><b>${esc(lab)}</b><small>${[r==="2009"&&u?u[3].map(x=>"S"+x).join(", "):"",c.length?c.length+" cours":"",f.length?plural(f.length,"fiche"):""].filter(Boolean).map(esc).join(" · ")}</small></span></summary>
    <div class="list">${c.map(i=>itemRow(i,"c")).join("")}${f.map(i=>itemRow(i,"f")).join("")}</div></details>`;}).join("")}</section>`;}
/* Page d'une UE : contenus regroupés par thème, pathologies par processus quand l'UE en contient beaucoup. */
function ueSections(list,t,code){
 const pat=list.filter(i=>i.cat==="patho"),sub=!PROC_UE.includes(code)&&pat.length>8,groups=[];
 CATS.forEach(c=>{const l=list.filter(i=>i.cat===c.id);if(!l.length)return;
  if(c.id==="patho"&&sub)procGroups(l,false).forEach(([pc,lab,its])=>groups.push(["Pathologies · "+lab,c.c,its]));else groups.push([c.nom,c.c,l]);});
 if(groups.length<2||list.length<8)return `<div class="list">${list.map(i=>itemRow(i,t)).join("")}</div>`;
 return groups.map(([n,c,l])=>`<div class="ue-sub"><div class="ue-sub-h" style="--c:${c}"><span class="dot"></span><span>${esc(n)}</span><span class="muted">${l.length}</span></div><div class="list">${l.map(i=>itemRow(i,t)).join("")}</div></div>`).join("");
}
function vProgramme(){
 const R=UE[state.ueRef],list=R.list.filter(u=>u[3].includes(state.sem));
 return `<div class="stack-lg">${vh("Programme","Réviser dans l'ordre des cours")}
  <div class="seg" role="group" aria-label="Votre année">${Object.entries(UE).map(([k,v])=>`<button data-act="ue-ref" data-k="${k}" aria-pressed="${state.ueRef===k}">${v.label}<br><small style="font-weight:400;opacity:.8">${v.sub}</small></button>`).join("")}</div>
  <p class="muted">${esc(R.note)}</p>
  <div class="chips" role="group" aria-label="Semestre">${[1,2,3,4,5,6].map(s=>`<button class="chip" data-act="sem" data-k="${s}" aria-pressed="${state.sem===s}">Semestre ${s}</button>`).join("")}</div>
  <div class="list">${list.map(u=>{const L=ueContent(u[0],state.ueRef),sm=ueSummary(L);
   return `<a class="li ue-li" href="#ue/${encodeURIComponent(u[0])}"><span class="code">${u[0]}</span><span><span class="t">${esc(u[1])}</span><span class="s">${sm||"Contenus à venir"}</span></span>${chev}</a>`}).join("")}</div>
  ${ueProcBlock()}</div>`;
}
function vUE(code){
 const R=UE[state.ueRef],u=R.list.find(x=>x[0]===code);if(!u)return notFound();
 const L=ueContent(u[0],state.ueRef),sm=ueSummary(L);
 return `<div class="stack-lg">${backBtn("Programme")}
  <header class="vh"><span class="eyebrow">UE ${u[0]} · ${esc(R.groups[u[2]])}</span><h1>${esc(u[1])}</h1><p class="muted">Enseignée en ${u[3].map(s=>"S"+s).join(", ")} · ${esc(R.sub)}</p>${sm?`<p class="ue-sum">${esc(sm)}</p>`:""}</header>
  ${L.q.length?`<button class="btn block" data-act="ue-quiz" data-k="${esc(u[0])}">${IC.play}Quiz de cette UE · ${plural(L.q.length,"question")}</button>`:""}
  ${ueBody(u[0],state.ueRef)}
  ${!sm?`<div class="empty">Les contenus de cette UE arrivent bientôt.</div>`:""}</div>`;
}

/* ---------- Recherche ---------- */
const fold=s=>[...String(s)].map(c=>c.normalize("NFD")[0]).join("").toLowerCase();
const plain=h=>String(h).replace(/<[^>]+>/g," ").replace(/\*\*|==/g,"").replace(/&nbsp;/g," ").replace(/\s+/g," ").trim();
let IDX=null;
function textOf(v){if(v==null)return "";if(typeof v==="string")return v;if(Array.isArray(v))return v.map(textOf).join(" ");if(typeof v==="object")return Object.entries(v).filter(([k])=>!["t","k","tone","ico","n","one","two","light","wave","blue"].includes(k)).map(([,x])=>textOf(x)).join(" ");return "";}
function buildIdx(){
 IDX=[...pxIdx(),...soIdx(),...mdIdx(),...FICHES.map(f=>({t:"f",it:f,txt:plain(f.body||textOf(f.pages))})),...COURS.filter(c=>!c.pro).map(c=>({t:"c",it:c,txt:plain(c.chap?textOf(c.chap)+" "+textOf(c.ess):textOf(c.sections))}))];
 IDX.forEach(e=>{e.ft=fold(e.it.titre);e.fm=fold(e.it.theme||"")+" "+fold(CAT[e.it.cat].nom);e.fx=fold(e.txt);});
}
function hl(s,q){const f=fold(s),i=f.indexOf(q);if(i<0)return esc(s);return esc(s.slice(0,i))+`<mark class="hl">${esc(s.slice(i,i+q.length))}</mark>`+esc(s.slice(i+q.length));}
function results(raw){
 const q=fold(raw.trim());if(q.length<2)return "";
 if(!IDX)buildIdx();
 const r=[];IDX.forEach(e=>{let sc=0;if(e.ft.includes(q))sc=e.ft.startsWith(q)?100:80;else if(e.fm.includes(q))sc=40;else if(e.fx.includes(q))sc=10+Math.min(9,e.fx.split(q).length);if(sc)r.push({e,sc});});
 r.sort((a,b)=>b.sc-a.sc);
 if(!r.length)return `<div class="empty">Aucun résultat pour « ${esc(raw)} ».</div>`;
 return `<p class="muted">${plural(r.length,"résultat")}</p><div class="list">${r.slice(0,60).map(({e})=>{
  let snip=esc(e.t==="f"?e.it.theme:e.t==="p"?"Pathologie · "+e.it.theme:e.t==="m"?"Classe thérapeutique · "+e.it.theme:e.t==="s"?"Soin · "+e.it.theme:"Cours · "+CAT[e.it.cat].nom);
  if(!e.ft.includes(q)){const i=e.fx.indexOf(q);if(i>=0){const a=Math.max(0,i-40),s=e.txt.slice(a,i+q.length+60);snip=(a?"…":"")+hl(s,q)+"…";}}
  return `<a class="li" href="#${e.t==="f"?"fiche":e.t==="p"?"patho":e.t==="s"?"soin":e.t==="m"?"med":"cours"}/${e.it.id}" style="--c:${CAT[e.it.cat].c}"><span class="bar"></span><span><span class="t">${hl(e.it.titre,q)}</span><span class="s">${snip}</span></span>${chev}</a>`}).join("")}</div>`;
}
function vRecherche(){
 return `<div class="stack">${backBtn("Retour")}<div class="search-bar"><label class="search-field">${IC.search}<input id="q" type="search" enterkeyhint="search" placeholder="Rechercher dans ${FICHES.length+FULL_COURS.length} contenus" value="${esc(state.q)}" autocomplete="off" aria-label="Rechercher"></label></div>
  <div id="res" class="stack-sm">${state.q?results(state.q):`<div class="stack-sm"><span class="eyebrow">Suggestions</span><div class="chips wrapchips">${["Insuline","AVK","Glasgow","Escarre","Diabète","Perfusion","Secret professionnel","Douleur"].map(s=>`<button class="chip" data-act="suggest" data-k="${s}">${s}</button>`).join("")}</div></div>`}</div></div>`;
}

/* ---------- Réglages ---------- */
function vReglages(){
 const s=settings(),seg=(name,opts)=>`<div class="seg ${opts.length===3?"three":""}">${opts.map(([k,l])=>`<button data-act="set" data-n="${name}" data-k="${k}" aria-pressed="${s[name]===k}">${l}</button>`).join("")}</div>`;
 return `<div class="stack-lg">${backBtn("Accueil")}${vh("Réglages","Préférences")}
  <div class="set-group"><span class="eyebrow">Affichage</span><div class="list">
   <div class="set-row"><span>Thème</span>${seg("theme",[["auto","Auto"],["light","Clair"],["dark","Sombre"]])}</div>
   <div class="set-row"><span>Taille du texte</span>${seg("size",[["m","Normale"],["l","Grande"]])}</div></div></div>
  <div class="set-group"><span class="eyebrow">Formation</span><div class="list">
   <div class="set-row"><span>Référentiel</span><div class="seg">${Object.entries(UE).map(([k,v])=>`<button data-act="ue-ref" data-k="${k}" aria-pressed="${state.ueRef===k}">${v.sub.replace("Référentiel ","")}</button>`).join("")}</div></div>
   <div class="set-row"><span>Semestre en cours</span><span class="muted">S${state.sem} · modifiable dans Programme</span></div></div></div>
  <div class="set-group"><span class="eyebrow">Données</span><div class="list">
   <button class="li" data-act="backup" style="grid-template-columns:minmax(0,1fr)"><span><span class="t" style="color:var(--brand)">Sauvegarder mes données</span><span class="s">Partiels, stage, carnet de suivi, progression : un fichier à garder dans Fichiers ou iCloud</span></span></button>
   <label class="li" for="restore-file" style="grid-template-columns:minmax(0,1fr)"><span><span class="t" style="color:var(--brand)">Restaurer une sauvegarde</span><span class="s">Remplace les données actuelles de cet appareil</span></span></label><input type="file" id="restore-file" class="sr-only" accept="application/json,.json">
   <button class="li" data-act="reset" style="grid-template-columns:minmax(0,1fr)"><span class="t danger">Réinitialiser ma progression</span></button></div>
   <p class="muted" style="padding:0 4px">Votre progression reste sur cet appareil, rien n'est envoyé en ligne.</p></div>
  <div class="set-group"><span class="eyebrow">À propos</span><div class="list"><div class="set-row"><span>Carnet IFSI</span><span class="muted">Version ${APP_VERSION}</span></div>
   ${!isNative?`<button class="li" data-act="force-update" style="grid-template-columns:minmax(0,1fr)"><span class="t" style="color:var(--brand)">Rechercher une mise à jour</span></button>`:""}
   <div class="set-row" style="display:block"><span class="muted">${FICHES.length} fiches, ${FULL_COURS.length} cours complets, ${QUIZ.length} questions, ${Object.keys(GEN).length} types de calculs et ${Object.keys(SCH).length} schémas. Contenus pédagogiques : vérifiez toujours avec vos cours et les protocoles de votre établissement.</span></div></div></div></div>`;
}

/* ---------- Rendu ---------- */
const VIEWS={outils:vOutils,outil:vOutil,med:vMed,soin:vSoin,pathos:vPathos,patho:vPatho,feuille:vFeuille,carnet:vCarnet,accueil:vAccueil,reviser:vReviser,fiche:vFiche,cours:vCoursView,entrainer:vEntrainer,stages:vStages,programme:vProgramme,ue:vUE,recherche:vRecherche,reglages:vReglages};
const TAB={med:"reviser",soin:"reviser",pathos:"reviser",patho:"reviser",feuille:"stages",carnet:"stages",fiche:"reviser",cours:"reviser",ue:"programme",recherche:"accueil",reglages:"accueil"};
let lastKey=null;
const SCROLL={};
function render(top){
 const r=route(),key=r.v+"/"+r.arg,moved=top&&key!==lastKey;
 if(moved&&lastKey)SCROLL[lastKey]=window.scrollY;
 if(moved)depth=ROOTS.includes(r.v)||lastKey===null?0:depth+1;
 app.innerHTML=VIEWS[r.v](r.arg);
 const tab=TAB[r.v]||r.v;
 document.querySelectorAll("nav.tabs a").forEach(a=>a.dataset.v===tab?a.setAttribute("aria-current","page"):a.removeAttribute("aria-current"));
 /* Retour d'une fiche, d'un cours ou d'une pathologie vers la liste Réviser : on retrouve la position dans la liste. */
 if(moved)window.scrollTo(0,["reviser","programme","ue"].includes(r.v)&&/^(patho|soin|med|fiche|cours)\//.test(lastKey||"")&&SCROLL[key]!=null?SCROLL[key]:0);
 lastKey=key;
 fvBind();pxBind();tbSync(r);
 if(r.v==="recherche"){const q=document.getElementById("q");if(q&&top&&!state.q)setTimeout(()=>q.focus(),60);}
}

/* ---------- Actions ---------- */
function checkCalc(show){
 const e=state.ex,inp=document.getElementById("calc-in");
 const raw=(inp?inp.value:"").trim().replace(",",".");e.val=inp?inp.value:"";
 if(!show&&(raw===""||isNaN(Number(raw)))){inp.focus();inp.placeholder="Entrez un nombre";return;}
 e.done=show?"ko":(Math.abs(Number(raw)-e.ans)<=e.tol+1e-9?"ok":"ko");
 haptic(e.done==="ok"?"LIGHT":"MEDIUM");
 const s=stats();s.exTot++;if(e.done==="ok")s.exOk++;store.set("stats",s);render();
}
function launchQuiz(list,label){if(!list.length){toast("Aucune question disponible");return;}startQuiz(list,label);state.train="quiz";nav("entrainer/quiz");}
app.addEventListener("submit",ev=>{if(ev.target.id==="calc-form"){ev.preventDefault();checkCalc(false);}
 else if(ev.target.id.startsWith("cn-")){ev.preventDefault();carnetSubmit(ev.target);}
 else if(ev.target.id.startsWith("pl-")){ev.preventDefault();plSubmit(ev.target);}
 else if(ev.target.id.startsWith("ot-")){ev.preventDefault();outilSubmit(ev.target);}
 else if(ev.target.id==="exam-form"){ev.preventDefault();const nom=document.getElementById("ex-nom").value.trim(),date=document.getElementById("ex-date").value,heure=document.getElementById("ex-heure").value||"08:00";
  if(!nom||!date){toast("Indiquez un intitulé et une date");return;}
  store.set("exams",[...exams(),{id:Date.now().toString(36),nom,date,heure}]);haptic();toast("Partiel ajouté");render();setTimeout(()=>{const i=document.getElementById("ex-nom");i&&i.focus()},0);}});
function saveStageField(t){const s=stageInfo();s[t.dataset.sf]=t.value;store.set("stage",s);
 if(["debut","fin","arrivee","service"].includes(t.dataset.sf)){const c=document.getElementById("stage-cd");if(c)c.outerHTML=stageCountdown();}
 const m=document.getElementById("sf-saved");if(m){m.textContent="Enregistré ✓";clearTimeout(saveStageField.t);saveStageField.t=setTimeout(()=>{m.textContent="Enregistré sur cet appareil"},1500);}}
app.addEventListener("input",ev=>{const t=ev.target;if(t.id==="q"){state.q=t.value;document.getElementById("res").innerHTML=results(state.q)||"";}
 else if(t.dataset.sf)saveStageField(t);
 else if(t.dataset.cn)carnetInput(t);
 else if(t.dataset.fs)feuilleInput(t);
 else if(t.dataset.ot!=null)outilInput(t);
 else pathoInput(t);});
app.addEventListener("click",ev=>{
 const b=ev.target.closest("[data-act]");if(!b)return;
 const a=b.dataset.act,k=b.dataset.k,id=b.dataset.id;
 if(a.startsWith("ot-")){outilAct(b,a);return;}
 if(a.startsWith("cn-")){carnetAct(b,a);return;}
 if(a.startsWith("fs-")){feuilleAct(b,a);return;}
 if(a.startsWith("px-")){pathoAct(b,a);return;}
 if(a.startsWith("so-")){soAct(b,a);return;}
 if(a.startsWith("md-")){mdAct(b,a);return;}
 if(a==="nav"){nav(b.dataset.h);}
 else if(a==="back"||a==="fiche-back"||a==="cours-back"){goBack();}
 else if(a==="go-cat"){ev.preventDefault();
  if(k==="stage")nav("stages");else if(k==="tfe"){state.filter="tfe";state.favOnly=false;nav("reviser/cours");}else if(k==="patho"){state.filter="patho";state.favOnly=false;nav("reviser");}else if(k==="calcul")nav("entrainer/calculs");else if(k==="quiz")nav("entrainer/quiz");
  else if(k==="calcul-fiches"){state.filter="calcul";state.favOnly=false;nav("reviser/fiches");}
  else{state.filter=k;state.favOnly=false;nav("reviser/"+(FICHES.some(f=>f.cat===k)?"fiches":"cours"));}}
 else if(a==="rev"){state.rev=k;store.set("rev",k);location.replace("#reviser/"+k);}
 else if(a==="filter"){state.filter=k;render();}
 else if(a==="fav-only"){state.favOnly=!state.favOnly;render();}
 else if(a==="favs"){state.favOnly=true;state.filter="all";nav("reviser/"+(favs().some(f=>f.startsWith("c:"))&&!favs().some(f=>f.startsWith("f:"))?"cours":"fiches"));}
 else if(a==="fav"){let f=favs();const on=!f.includes(k);f=on?[...f,k]:f.filter(x=>x!==k);store.set("favs",f);haptic();
  b.setAttribute("aria-pressed",on);b.setAttribute("aria-label",on?"Retirer des favoris":"Ajouter aux favoris");toast(on?"Ajouté aux favoris":"Retiré des favoris");}
 else if(a==="fiche"){nav("fiche/"+id);}
 else if(a==="cours"){nav("cours/"+id);}
 else if(a==="fv-done"){let r=reviewed();const on=!r.includes(id);r=on?[...r,id]:r.filter(x=>x!==id);store.set("reviewed",r);haptic();if(on)toast("Fiche marquée comme révisée");render();}
 else if(a==="cv-done"){let r=studied();const on=!r.includes(id);r=on?[...r,id]:r.filter(x=>x!==id);store.set("studied",r);haptic();if(on)toast("Cours marqué comme étudié");render();}
 else if(a==="fv-quiz"){launchQuiz(quizIdx(q=>q.cat===k),"Quiz "+CAT[k].nom);}
 else if(a==="train"){state.train=k;location.replace("#entrainer/"+k);}
 else if(a==="calc-type"){state.calcType=k;state.ex=null;render();}
 else if(a==="calc-new"){state.ex=null;render();setTimeout(()=>{const i=document.getElementById("calc-in");i&&i.focus()},0);}
 else if(a==="calc-show")checkCalc(true);
 else if(a==="quiz-cat"){state.quizCat=k;render();}
 else if(a==="quiz-start"){launchQuiz(quizIdx(q=>state.quizCat==="all"||q.cat===state.quizCat),state.quizCat==="all"?"Toutes catégories":"Quiz "+CAT[state.quizCat].nom);}
 else if(a==="quiz-quick"){launchQuiz(QUIZ.map((q,i)=>i).sort(()=>Math.random()-.5).slice(0,10),"Quiz express");}
 else if(a==="quiz-wrong"){const w=wrongs();launchQuiz(quizIdx(q=>w.includes(q.q)),"Mes erreurs");}
 else if(a==="quiz-again"){startQuiz(state.quiz.src,state.quiz.label);render(true);}
 else if(a==="quiz-reset"){state.quiz=null;render(true);}
 else if(a==="quiz-ans"){const z=state.quiz,n=+k,q=QUIZ[z.order[z.i]];if(z.answered!=null)return;z.answered=n;
  let w=wrongs();if(n===q.a){z.score++;w=w.filter(x=>x!==q.q);haptic("LIGHT");}else{if(!w.includes(q.q))w.push(q.q);haptic("HEAVY");}store.set("wrong",w);render();}
 else if(a==="quiz-next"){const z=state.quiz;z.i++;z.answered=null;
  if(z.i>=z.order.length){const s=stats();if(s.quizBest==null||z.score>s.quizBest){s.quizBest=z.score;store.set("stats",s);}}
  render();window.scrollTo(0,0);}
 else if(a==="ue-pg"){const o=state.uePg||(state.uePg={});o[k]=!b.parentElement.open;if(o[k]&&b.parentElement.classList.contains("ue-grp")){ev.preventDefault();const y=window.scrollY;render();window.scrollTo(0,y);}}
 else if(a==="ue-ref"){state.ueRef=k;store.set("ueRef",k);render();}
 else if(a==="sem"){state.sem=+k;store.set("sem",+k);render();}
 else if(a==="ue-quiz"){const r=state.ueRef;launchQuiz(quizIdx(q=>(q.ue[r]||[]).includes(k)),"Quiz UE "+k);}
 else if(a==="suggest"){state.q=k;render();}
 else if(a==="set"){const s=settings();s[b.dataset.n]=k;store.set("settings",s);applyTheme();render();}
 else if(a==="obj-add"){const sv=STAGES[+b.dataset.s],o=sv&&sv.obj[+b.dataset.i];if(!o)return;const st=stageInfo(),line=objText(o[1]);
  if((st.objectifs||"").includes(line)){toast("Déjà dans vos objectifs");return;}
  st.objectifs=(st.objectifs?st.objectifs.replace(/\s+$/,"")+"\n":"")+line;store.set("stage",st);
  const ta=document.getElementById("sf-objectifs");if(ta)ta.value=st.objectifs;
  b.setAttribute("aria-pressed","true");b.setAttribute("aria-label","Déjà dans mes objectifs");b.innerHTML=IC.check;haptic();toast("Ajouté à mes objectifs de stage");if(route().v==="carnet")render();}
 else if(a==="backup"){backupData();}
 else if(a==="force-update"){b.querySelector(".t").textContent="Mise à jour en cours…";forceUpdate();}
 else if(a==="exam-edit"){state.examEdit=true;render();}
 else if(a==="exam-done"){state.examEdit=false;render();}
 else if(a==="exam-del"){store.set("exams",exams().filter(e=>e.id!==id));haptic();toast("Partiel supprimé");render();}
 else if(a==="stage-new"){if(!b.dataset.armed){b.dataset.armed="1";b.textContent="Toucher à nouveau pour tout effacer";setTimeout(()=>{if(b.isConnected){delete b.dataset.armed;b.textContent="Préparer un nouveau stage";}},4000);return;}
  try{["stage","check","carnet"].forEach(x=>localStorage.removeItem("ifsi_"+x))}catch(e){}haptic("MEDIUM");toast("Prêt pour le prochain stage");render();}
 else if(a==="reset"){const t=b.querySelector(".t");
  if(!b.dataset.armed){b.dataset.armed="1";t.textContent="Toucher à nouveau pour tout effacer";setTimeout(()=>{if(b.isConnected){delete b.dataset.armed;t.textContent="Réinitialiser ma progression";}},4000);return;}
  ["reviewed","studied","stats","wrong","favs","check","last","pxdone"].forEach(x=>{try{localStorage.removeItem("ifsi_"+x)}catch(e){}});haptic("MEDIUM");toast("Progression réinitialisée");render();}
});
app.addEventListener("change",ev=>{
 const t=ev.target;if(t.id==="restore-file"){if(t.files&&t.files[0])restoreData(t.files[0]);t.value="";return;}if(t.dataset.sf){saveStageField(t);return;}if(t.dataset.cn){carnetInput(t);return;}if(t.dataset.fs){feuilleInput(t);return;}if(t.dataset.px!=null||t.id==="pxspe"||t.id==="sosec"||t.id==="mdsec"){pathoInput(t);return;}if(t.dataset.act!=="check")return;
 let d=store.get("check",[]);const i=+t.dataset.i;
 d=t.checked?[...new Set([...d,i])]:d.filter(x=>x!==i);store.set("check",d);haptic();render();
});

/* ---------- Natif ---------- */
if(isNative){
 try{const A=plug("App");A&&A.addListener("backButton",()=>{
  if(tbOpen){tbToggle(false);return;}
  if(document.querySelector(".zoom")){document.querySelector(".zoom").remove();return;}
  const r=route();if(r.v==="entrainer"&&state.quiz){state.quiz=null;render(true);return;}
  if(r.v==="accueil")A.exitApp();else if(ROOTS.includes(r.v))location.replace("#accueil");else goBack();});}catch(e){}
}
if(!isNative&&"serviceWorker" in navigator&&location.protocol==="https:"){
 const sw=navigator.serviceWorker,hadController=!!sw.controller;let reloading=false;
 sw.register("sw.js",{updateViaCache:"none"}).then(reg=>{
  const check=()=>{if(document.visibilityState==="visible")reg.update().catch(()=>{});};
  document.addEventListener("visibilitychange",check);setInterval(check,30*60*1000);}).catch(()=>{});
 sw.addEventListener("controllerchange",()=>{if(!hadController||reloading)return;
  if(document.activeElement&&document.activeElement.matches("input,textarea,select"))return;reloading=true;location.reload();});
}
async function backupData(){
 const data={app:"carnet-ifsi",version:APP_VERSION,date:new Date().toISOString(),donnees:{}};
 try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith("ifsi_"))data.donnees[k]=localStorage.getItem(k);}}catch(e){}
 const name=`carnet-ifsi-sauvegarde-${todayISO()}.json`,blob=new Blob([JSON.stringify(data)],{type:"application/json"});
 try{const file=new File([blob],name,{type:"application/json"});if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:"Sauvegarde Carnet IFSI"});toast("Sauvegarde enregistrée");return;}}
 catch(e){if(e&&e.name==="AbortError")return;}
 try{const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1500);toast("Sauvegarde téléchargée");}
 catch(e){toast("Sauvegarde impossible sur cet appareil");}
}
function restoreData(file){
 const r=new FileReader();
 r.onload=()=>{try{const d=JSON.parse(r.result);if(!d||d.app!=="carnet-ifsi"||!d.donnees||typeof d.donnees!=="object")throw 0;
  let n=0;Object.entries(d.donnees).forEach(([k,v])=>{if(k.startsWith("ifsi_")&&typeof v==="string"){localStorage.setItem(k,v);n++;}});
  state.ueRef=store.get("ueRef","2026");state.sem=store.get("sem",1);applyTheme();toast(n?"Données restaurées":"Sauvegarde vide");render();}
  catch(e){toast("Ce fichier n'est pas une sauvegarde Carnet IFSI");}};
 r.onerror=()=>toast("Lecture du fichier impossible");r.readAsText(file);
}
async function forceUpdate(){
 try{if("caches" in window){const k=await caches.keys();await Promise.all(k.map(x=>caches.delete(x)));}
  if(navigator.serviceWorker){const regs=await navigator.serviceWorker.getRegistrations();await Promise.all(regs.map(r=>r.update().catch(()=>{})));}}catch(e){}
 location.reload();
}
tbInit();
render(true);
try{const sp=plug("SplashScreen");sp&&setTimeout(()=>sp.hide(),120);}catch(e){}
