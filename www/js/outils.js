/* Carnet IFSI — boîte à outils : barre d'outils à droite (dock sur grand écran, onglet et tiroir sur téléphone)
   et outils pratiques : planning, choix du pansement, aide au TFE, calculs, scores, chrono, transmissions,
   repères et bloc-notes. Chargé après feuilles.js et avant app.js (qui appelle tbInit et déclare les vues). */
const OI=d=>`<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const OT_IC={
 box:OI('<path d="M3 9h18v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M8 9V6.5A2.5 2.5 0 0 1 10.5 4h3A2.5 2.5 0 0 1 16 6.5V9"/><path d="M3 13.5h18M10 13.5v2h4v-2"/>'),
 planning:OI('<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4M7.5 14h3M7.5 17h6"/>'),
 pansement:OI('<g transform="rotate(-40 12 12)"><rect x="2" y="8.5" width="20" height="7" rx="3.5"/><rect x="9" y="8.5" width="6" height="7"/></g>'),
 tfe:OI('<path d="M5 3h9l5 5v13H5z"/><path d="M14 3v5h5M8.5 12.5h7M8.5 16.5h4.5"/>'),
 calculs:OI('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>'),
 scores:OI('<path d="M3.5 16.5a8.5 8.5 0 1 1 17 0"/><path d="M12 16.5l4.5-5.5"/><circle cx="12" cy="16.5" r="1.3"/>'),
 chrono:OI('<circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4l2.5 2M9.5 2.5h5M18.5 6.5l1.5-1.5"/>'),
 transmissions:OI('<path d="M4 4.5h16V15H10l-5 4v-4H4z"/><path d="M8 8.5h8M8 11.5h5"/>'),
 reperes:OI('<path d="M4 4v16h16"/><path d="M8 16v-5M12 16V7M16 16v-8"/>'),
 notes:OI('<path d="M4 20h4L19.5 8.5l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>'),
 urgences:OI('<path d="M12 20.5s-8-4.9-8-10.6A4.4 4.4 0 0 1 12 7.2a4.4 4.4 0 0 1 8 2.7c0 5.7-8 10.6-8 10.6z"/><path d="M6.5 12.5h3l1.3-2.6 1.9 5 1.3-2.4h3.5"/>'),
 projet:OI('<path d="M7 4h10a2 2 0 0 1 2 2v14H5V6a2 2 0 0 1 2-2z"/><path d="M9 4.5V3h6v1.5"/><path d="M8.5 10.5l1.5 1.5 2.5-3M8.5 16l1.5 1.5 2.5-3M14.5 11h2M14.5 16.5h2"/>'),
 copy:OI('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>')
};
const TOOLS=[
 {id:"urgences",n:"Urgences (AFGSU)",s:"Urgences",c:"#C8372D",d:"Fiches réflexes : arrêt cardiaque, étouffement, hémorragie, malaises, traumatismes, situations exceptionnelles",lead:"Les fiches réflexes du programme de l'AFGSU niveau 2, pour réagir vite : urgences vitales, urgences potentielles, risques collectifs."},
 {id:"planning",n:"Planning",s:"Planning",c:"#2A5D85",d:"Agenda de la semaine, plan de révisions automatique, export vers l'agenda du téléphone",lead:"Organisez vos cours, révisions, partiels et stages. Le plan de révisions répartit les séances jusqu'à l'évaluation."},
 {id:"projet",n:"Projet de soins guidé",s:"Projet",c:"#2A6F5E",d:"Problèmes proposés selon la situation, formulation, objectifs, actions, évaluation, puis feuille prête à imprimer",lead:"Décrivez la situation du patient : l'outil propose des problèmes justifiés, vous aide à les formuler, vérifie votre projet et remplit la feuille « Projet de soins »."},
 {id:"pansement",n:"Choix du pansement",s:"Pansement",c:"#B55E3A",d:"Quelques questions sur la plaie pour orienter vers la bonne classe de pansement",lead:"Décrivez la plaie : l'outil propose une classe de pansement, la fréquence de réfection et les points de vigilance."},
 {id:"tfe",n:"Aide au TFE",s:"TFE",c:"#6E5196",d:"Étapes du mémoire, question de départ, équation de recherche, références APA, rétroplanning",lead:"Avancez pas à pas dans votre travail de fin d'études. Tout est enregistré sur cet appareil."},
 {id:"calculs",n:"Calculs de soins",s:"Calculs",c:"#2C7451",d:"Débits, doses au poids, volumes à prélever, concentrations, conversions",lead:"Résultat et étapes de calcul détaillées. En pratique, tout calcul se fait en double vérification."},
 {id:"scores",n:"Scores cliniques",s:"Scores",c:"#9A7A2E",d:"Glasgow, NEWS2, Braden, Algoplus, IMC, clairance de la créatinine",lead:"Calculez un score et son interprétation. Les seuils peuvent varier selon les protocoles de votre établissement."},
 {id:"chrono",n:"Chrono et compteur",s:"Chrono",c:"#1E5A6D",d:"Compter une fréquence respiratoire ou cardiaque, minuteur, chronomètre",lead:"Touchez l'écran à chaque respiration ou battement : la fréquence par minute est calculée pour vous."},
 {id:"transmissions",n:"Transmissions",s:"Transmettre",c:"#87591A",d:"Rédiger une transmission ciblée (DAR) ou préparer une alerte SAED",lead:"Structurez une transmission écrite ou un appel au médecin, puis copiez le texte."},
 {id:"reperes",n:"Repères et normes",s:"Repères",c:"#B03E30",d:"Constantes, biologie, gaz du sang, hémostase, valeurs de l'enfant, conversions",lead:"Les valeurs usuelles à portée de main. Les normes exactes sont celles du laboratoire qui rend le résultat."},
 {id:"notes",n:"Bloc-notes",s:"Notes",c:"#5C6B7A",d:"Notes rapides enregistrées sur cet appareil",lead:"Idées, questions pour le tuteur, choses à revoir. Ne notez jamais de nom de patient."}
];

/* ---------- Barre d'outils ---------- */
let tbOpen=false,tbLast=null;
function tbInit(){
 const rail=document.createElement("aside");rail.className="tb-rail";rail.setAttribute("aria-label","Boîte à outils");
 rail.innerHTML=`<a class="tb-head" href="#outils" title="Tous les outils">${OT_IC.box}<span>Outils</span></a>`+TOOLS.map(t=>`<a href="#outil/${t.id}" data-tool="${t.id}" title="${esc(t.n)}">${OT_IC[t.id]}<span>${esc(t.s)}</span></a>`).join("");
 const tab=document.createElement("button");tab.type="button";tab.className="tb-tab";tab.setAttribute("aria-label","Ouvrir la boîte à outils");tab.setAttribute("aria-expanded","false");tab.innerHTML=`${OT_IC.box}<span>Outils</span>`;
 const back=document.createElement("div");back.className="tb-back";
 const dr=document.createElement("div");dr.className="tb-drawer";dr.setAttribute("role","dialog");dr.setAttribute("aria-modal","true");dr.setAttribute("aria-label","Boîte à outils");dr.setAttribute("aria-hidden","true");
 dr.innerHTML=`<div class="tb-dh"><div><span class="eyebrow">Boîte à outils</span><h2>Mes outils</h2></div><button class="icon-btn" type="button" data-tb="close" aria-label="Fermer">${IC.x}</button></div>
  <nav class="list tb-list" aria-label="Outils">${TOOLS.map(t=>`<a class="li" href="#outil/${t.id}" data-tool="${t.id}"><span class="ic tb-ic" style="--c:${t.c}">${OT_IC[t.id]}</span><span><span class="t">${esc(t.n)}</span><span class="s">${esc(t.d)}</span></span>${chev}</a>`).join("")}</nav>
  <a class="btn ghost block" href="#outils">Voir la page des outils</a>`;
 document.body.append(rail,tab,back,dr);
 tab.addEventListener("click",()=>tbToggle(true));
 back.addEventListener("click",()=>tbToggle(false));
 dr.addEventListener("click",e=>{if(e.target.closest("[data-tb=close]"))tbToggle(false);else if(e.target.closest("a"))tbToggle(false,true);});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&tbOpen)tbToggle(false);});
 let lastY=window.scrollY;
 window.addEventListener("scroll",()=>{const y=window.scrollY,d=y-lastY;if(Math.abs(d)<6)return;document.body.classList.toggle("tb-scroll",d>0&&y>80);lastY=y;
  clearTimeout(tbInit.t);tbInit.t=setTimeout(()=>document.body.classList.remove("tb-scroll"),1600);},{passive:true});
 document.addEventListener("focusin",e=>{const t=e.target;document.body.classList.toggle("tb-typing",!!(t&&t.matches&&t.matches("input:not([type=checkbox]):not([type=radio]),textarea,select")&&!t.closest(".tb-drawer")));});
 document.addEventListener("focusout",()=>setTimeout(()=>{const a=document.activeElement;if(!a||!a.matches||!a.matches("input:not([type=checkbox]):not([type=radio]),textarea,select"))document.body.classList.remove("tb-typing");},0));
}
function tbToggle(on,nav){
 tbOpen=on;document.body.classList.toggle("tb-on",on);
 const tab=document.querySelector(".tb-tab"),dr=document.querySelector(".tb-drawer");if(!tab||!dr)return;
 tab.setAttribute("aria-expanded",String(on));dr.setAttribute("aria-hidden",String(!on));
 if(on){tbLast=document.activeElement;haptic();setTimeout(()=>{const f=dr.querySelector(".tb-list a");f&&f.focus({preventScroll:true});},80);}
 else if(!nav&&tbLast&&tbLast.focus)tbLast.focus({preventScroll:true});
}
function tbSync(r){
 const cur=r.v==="outil"?(r.arg||"").split("/")[0]:"";
 document.querySelectorAll(".tb-rail a[data-tool],.tb-drawer a[data-tool]").forEach(a=>a.dataset.tool===cur?a.setAttribute("aria-current","page"):a.removeAttribute("aria-current"));
 const h=document.querySelector(".tb-rail .tb-head");if(h){r.v==="outils"?h.setAttribute("aria-current","page"):h.removeAttribute("aria-current");}
 document.body.classList.toggle("tb-off",r.v==="perso"||(r.v==="accueil"&&!!state.hwEdit));
}

/* ---------- Vues ---------- */
function vOutils(){
 return `<div class="stack-lg">${vh("Boîte à outils","Mes outils","Des outils pratiques pour les cours, les stages et le mémoire. Tout ce que vous saisissez reste sur cet appareil.")}
  <div class="ot-grid">${TOOLS.map(t=>`<a class="qa ot-tile" href="#outil/${t.id}"><span class="ic tb-ic" style="--c:${t.c}">${OT_IC[t.id]}</span><b>${esc(t.n)}</b><small>${esc(t.d)}</small></a>`).join("")}</div>
  <p class="disclaimer">Outils d'aide à la réflexion et à l'organisation : ils ne remplacent ni la prescription, ni les protocoles du service, ni la double vérification.</p></div>`;
}
function vOutil(arg){
 const [id,...rest]=(arg||"").split("/"),t=TOOLS.find(x=>x.id===id);if(!t)return vOutils();
 if(id==="urgences"&&rest.length&&rest[0])return `<div class="stack-lg ot ot-urgences">${otUrgences(rest.join("/"))}</div>`;
 return `<div class="stack-lg ot ot-${id}">${backBtn("Outils")}${vh("Boîte à outils",esc(t.n),esc(t.lead))}${OT_VIEWS[id](rest.join("/"))}</div>`;
}

/* ---------- Utilitaires ---------- */
const num=v=>{if(v==null)return NaN;const s=String(v).trim().replace(",",".");return s===""?NaN:Number(s);};
const fmtN=(x,d=2)=>Number.isFinite(x)?String(Number(x.toFixed(d))).replace(".",","):"–";
const isoD=d=>{const x=new Date(d.getTime());x.setMinutes(x.getMinutes()-x.getTimezoneOffset());return x.toISOString().slice(0,10);};
const parseD=s=>{const [y,m,d]=String(s).split("-").map(Number);return new Date(y,m-1,d);};
const addDays=(s,n)=>{const d=parseD(s);d.setDate(d.getDate()+n);return isoD(d);};
const mondayOf=s=>{const d=parseD(s);d.setDate(d.getDate()-((d.getDay()+6)%7));return isoD(d);};
const otId=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const stripTags=s=>String(s).replace(/<[^>]+>/g,"");
async function otCopy(text){
 try{await navigator.clipboard.writeText(text);toast("Copié");return;}catch(e){}
 try{const ta=document.createElement("textarea");ta.value=text;ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.select();document.execCommand("copy");ta.remove();toast("Copié");}catch(e){toast("Copie impossible : sélectionnez le texte");}
}
/* Enregistrer ou partager un fichier (texte ou octets). Appli native : fichier écrit dans le cache puis feuille de partage
   (e-mail, Drive, Fichiers…) ; web : partage du navigateur ou téléchargement. */
const u8B64=u=>{let s="";for(let i=0;i<u.length;i+=32768)s+=String.fromCharCode.apply(null,u.subarray(i,i+32768));return btoa(s);};
async function dlFile(name,type,text){
 if(typeof isNative!=="undefined"&&isNative){const Fs=plug("Filesystem"),Sh=plug("Share");
  if(Fs&&Sh){try{const r=await Fs.writeFile({path:name,data:u8B64(typeof text==="string"?new TextEncoder().encode(text):text),directory:"CACHE"});
    await Sh.share({title:name,files:[r.uri],dialogTitle:"Enregistrer ou envoyer"});}catch(e){if(!/cancel/i.test(String(e&&(e.message||e))))toast("Partage impossible sur cet appareil");}return;}}
 const blob=new Blob([text],{type});
 try{const f=new File([blob],name,{type});if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:name});return;}}
 catch(e){if(e&&e.name==="AbortError")return;}
 try{const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1500);toast("Fichier téléchargé");}
 catch(e){toast("Export impossible sur cet appareil");}
}
const otField=(id,label,input,hint)=>`<label for="${id}">${label}${input}${hint?`<small class="ot-hint">${hint}</small>`:""}</label>`;
const otSeg=(act,cur,opts,label)=>`<div class="seg ot-seg" role="group" aria-label="${esc(label)}" style="grid-template-columns:repeat(${opts.length},1fr)">${opts.map(([k,l])=>`<button type="button" data-act="${act}" data-k="${k}" aria-pressed="${k===cur}">${l}</button>`).join("")}</div>`;

/* =====================================================================
   1. PLANNING
   ===================================================================== */
const AG_TYPES={"Cours":"#2A5D85","Révision":"#2C7451","À faire":"#C25B6A","Partiel":"#B55E3A","Stage":"#9A7A2E","TFE":"#6E5196","Perso":"#5C6B7A"};
const agenda=()=>store.get("agenda",[]);
const agSave=a=>store.set("agenda",a);
const agPlans=()=>store.get("agendaPlans",[]);
function agAuto(from,to){
 const out=[];
 exams().forEach(e=>{if(e.date>=from&&e.date<=to)out.push({auto:1,d:e.date,h:e.heure||"",t:e.nom,ty:"Partiel"});});
 const s=stageInfo();
 if(s.debut){const end=s.fin&&s.fin>=s.debut?s.fin:s.debut;for(let d=from;d<=to;d=addDays(d,1))if(d>=s.debut&&d<=end)out.push({auto:1,d,h:"",t:"Stage"+(s.service?" · "+s.service:""),ty:"Stage"});}
 return out;
}
function agRow(e){
 return `<div class="ag-it${e.done?" done":""}" style="--c:${AG_TYPES[e.ty]||"#5C6B7A"}">${e.auto?`<span class="ag-dot" aria-hidden="true"></span>`:`<input type="checkbox" class="ag-chk" data-act="ot-ag-done" data-id="${esc(e.id)}" ${e.done?"checked":""} aria-label="Marquer comme fait : ${esc(e.t)}">`}
  <span class="ag-h">${e.late?esc(fmtShort(at(e.d))):e.h?esc(e.h):"Journée"}</span><span class="ag-t">${esc(e.t)}<small>${esc(e.ty)}${e.auto?" · automatique":""}${e.late?" · en retard":""}${!e.auto&&e.rp!=null&&e.rp!==""?` · ${+e.rp===-1?"sans rappel":"rappel "+ntLeadTxt(e.rp)}`:""}</small></span>
  ${e.auto?"":`<button class="del" data-act="ot-ag-del" data-id="${esc(e.id)}" aria-label="Supprimer ${esc(e.t)}">${IC.x}</button>`}</div>`;
}
/* Tâches « À faire » non cochées des 30 derniers jours */
const agLate=d=>agenda().filter(e=>e.ty==="À faire"&&!e.done&&e.d<d&&e.d>=addDays(d,-30)).sort((a,b)=>a.d<b.d?-1:1).map(e=>({...e,late:1}));
function otPlanning(){
 const today=todayISO(),w0=state.agWeek||mondayOf(today),days=[...Array(7)].map((_,i)=>addDays(w0,i)),w6=days[6];
 const late=agLate(today);
 const all=[...agenda().filter(e=>e.d>=w0&&e.d<=w6),...agAuto(w0,w6)];
 const rev=all.filter(e=>e.ty==="Révision"),revDone=rev.filter(e=>e.done).length;
 const dl=(s,o)=>parseD(s).toLocaleDateString("fr-FR",o);
 const up=exams().filter(e=>e.date>today).sort((a,b)=>a.date<b.date?-1:1);
 const ueList=(UE[state.ueRef]||UE["2026"]).list.filter(u=>u[3].includes(state.sem));
 const plans=agPlans();
 const form=state.agForm?`<form id="ot-ag-form" class="cd-form sheet-body" autocomplete="off">
   <div class="section-title"><h2>Nouvel événement</h2><button type="button" class="link" data-act="ot-ag-cancel">Annuler</button></div>
   ${otField("ag-t","Intitulé",`<input id="ag-t" required maxlength="90" placeholder="Ex. Cours UE 2.11, réviser les anticoagulants">`)}
   <div class="cd-row">${otField("ag-d","Date",`<input id="ag-d" type="date" required value="${esc(state.agDay||today)}">`)}${otField("ag-h","Heure",`<input id="ag-h" type="time">`)}</div>
   <div class="cd-row">${otField("ag-ty","Type",`<select id="ag-ty">${Object.keys(AG_TYPES).map(k=>`<option ${k===(state.agTy||"Révision")?"selected":""}>${k}</option>`).join("")}</select>`)}
    ${otField("ag-rep","Répéter",`<select id="ag-rep"><option value="0">Non</option><option value="4">Chaque semaine, 4 semaines</option><option value="8">Chaque semaine, 8 semaines</option><option value="12">Chaque semaine, 12 semaines</option></select>`)}</div>
   ${otField("ag-rp","Rappel",`<select id="ag-rp"><option value="">Par défaut (${esc(ntLeadTxt(ntCfg().lead))}, ou le matin même s'il n'y a pas d'heure)</option>${[[0,"À l'heure de l'événement"],[15,"15 min avant"],[30,"30 min avant"],[60,"1 h avant"],[120,"2 h avant"],[1440,"La veille"],[-1,"Aucun rappel"]].map(([m,l])=>`<option value="${m}">${l}</option>`).join("")}</select>`,ntOn()?"":`Les rappels arrivent une fois les <a href="#notifs">notifications activées</a>.`)}
   <small class="ot-hint">Un événement de type Partiel est aussi ajouté au compte à rebours de l'accueil, avec ses propres rappels. Une tâche « À faire » non cochée reste affichée en retard jusqu'à ce qu'elle soit faite.</small>
   <button class="btn block" type="submit">${IC.plus}Ajouter</button></form>`:"";
 const gen=state.agGen?`<form id="ot-ag-genf" class="cd-form sheet-body" autocomplete="off">
   <div class="section-title"><h2>Plan de révisions</h2><button type="button" class="link" data-act="ot-ag-gen">Fermer</button></div>
   <p class="muted">Pour chaque thème, l'outil place une première lecture puis des révisions espacées (le lendemain, 3 jours et 7 jours après) et une dernière révision juste avant l'évaluation : c'est la répétition espacée.</p>
   ${up.length?`<div class="chips wrapchips">${up.slice(0,6).map(e=>`<button type="button" class="chip" data-act="ot-ag-genex" data-k="${esc(e.date)}" data-n="${esc(e.nom)}">${esc(e.nom)} · ${esc(fmtShort(at(e.date,e.heure)))}</button>`).join("")}</div>`:""}
   <div class="cd-row">${otField("gen-n","Évaluation",`<input id="gen-n" maxlength="60" value="${up[0]?esc(up[0].nom):""}" placeholder="Ex. Partiels S3">`)}${otField("gen-d","Date",`<input id="gen-d" type="date" required value="${up[0]?esc(up[0].date):""}">`)}</div>
   ${otField("gen-t","Thèmes à réviser, un par ligne",`<textarea id="gen-t" rows="5" placeholder="UE 2.11 Pharmacologie&#10;UE 2.8 Processus obstructifs"></textarea>`)}
   ${ueList.length?`<div class="stack-sm"><span class="ot-hint">Ajouter une UE du semestre ${state.sem} (${state.ueRef==="2009"?"référentiel 2009":"référentiel 2026"}) :</span><div class="chips wrapchips">${ueList.map(u=>`<button type="button" class="chip" data-act="ot-ag-ue" data-k="UE ${esc(u[0])} ${esc(u[1].length>34?u[1].slice(0,32).replace(/[\s,;:]+\S*$/,"")+"…":u[1])}">UE ${esc(u[0])}</button>`).join("")}</div></div>`:""}
   <div class="cd-row">${otField("gen-p","Séances par jour",`<select id="gen-p"><option>1</option><option selected>2</option><option>3</option></select>`)}${otField("gen-h","Heure de la 1re séance",`<input id="gen-h" type="time" value="18:00">`)}</div>
   <label class="chk"><input id="gen-sun" type="checkbox" checked><span>Pas de révision le dimanche</span></label>
   <button class="btn block" type="submit">Créer mon plan</button>
   ${plans.length?`<div class="stack-sm"><span class="ot-hint">Plans créés :</span>${plans.map(p=>`<div class="ot-line"><span>${esc(p.nom)} · ${esc(fmtShort(at(p.date)))} · ${plural(p.n,"séance")}</span><button type="button" class="link danger" data-act="ot-ag-plandel" data-id="${esc(p.id)}">Supprimer</button></div>`).join("")}</div>`:""}
  </form>`:"";
 return `${ntAsk("planning")}<div class="ag-nav"><button class="icon-btn" data-act="ot-ag-week" data-k="-1" aria-label="Semaine précédente">${IC.back}</button>
   <div class="ag-wk"><b>Du ${esc(dl(w0,{day:"numeric",month:"long"}))} au ${esc(dl(w6,{day:"numeric",month:"long"}))}</b><small>${rev.length?`${revDone} sur ${rev.length} révisions faites`:all.length?plural(all.length,"événement"):"Semaine libre"}</small></div>
   <button class="icon-btn" data-act="ot-ag-week" data-k="1" aria-label="Semaine suivante">${IC.chev}</button></div>
  <div class="chips wrapchips"><button class="chip" data-act="ot-ag-week" data-k="0" ${w0===mondayOf(today)?'aria-pressed="true"':""}>Cette semaine</button><button class="chip" data-act="ot-ag-new" data-k="${today}">＋ Événement</button><button class="chip" data-act="ot-ag-new" data-k="${today}" data-ty="À faire">＋ Tâche</button><button class="chip" data-act="ot-ag-gen" aria-pressed="${!!state.agGen}">Plan de révisions</button><button class="chip" data-act="ot-ag-ics">Exporter vers mon agenda</button><a class="chip nt-chip" href="#notifs" aria-label="Rappels ${ntOn()?"activés":"désactivés"}">${ntOn()?NT_IC.bell:NT_IC.off}Rappels${ntOn()?"":" désactivés"}</a></div>
  ${form}${gen}
  ${late.length?`<section class="ag-day ag-late" aria-label="Tâches en retard"><div class="ag-dh"><b>En retard</b><span class="muted">${plural(late.length,"tâche")} à faire</span></div><div class="ag-items">${late.map(agRow).join("")}</div></section>`:""}
  <div class="ag-days">${days.map(d=>{const items=all.filter(e=>e.d===d).sort((a,b)=>(a.h||"00:00")<(b.h||"00:00")?-1:1);
   return `<section class="ag-day${d===today?" today":""}" aria-label="${esc(dl(d,{weekday:"long",day:"numeric",month:"long"}))}"><div class="ag-dh"><b>${esc(dl(d,{weekday:"long"}))}</b><span class="muted">${esc(dl(d,{day:"numeric",month:"short"}))}</span>${d===today?`<span class="tag">Aujourd'hui</span>`:""}
    <button class="ag-add" data-act="ot-ag-new" data-k="${d}" aria-label="Ajouter un événement le ${esc(dl(d,{weekday:"long",day:"numeric",month:"long"}))}">${IC.plus}</button></div>
    ${items.length?`<div class="ag-items">${items.map(agRow).join("")}</div>`:`<p class="ag-empty">Rien de prévu</p>`}</section>`;}).join("")}</div>
  <div class="ag-leg">${Object.entries(AG_TYPES).map(([k,c])=>`<span style="--c:${c}"><i></i>${k}</span>`).join("")}</div>
  <a class="list" href="#feuille/planif"><span class="li"><span class="ic tb-ic" style="--c:#1E5A6D">${OT_IC.chrono}</span><span><span class="t">Planifier ma journée de stage</span><span class="s">Feuille de route heure par heure pour vos patients</span></span>${chev}</span></a>
  <p class="disclaimer">Les partiels de l'accueil et les dates de stage apparaissent automatiquement. L'export crée un fichier .ics à ouvrir dans l'agenda du téléphone, avec les alarmes de vos rappels.</p>`;
}
/* Répartit les séances : première lecture sur la première moitié de la période, révisions à J+1, J+3, J+7, dernière révision avant l'évaluation. */
function agPlan(exam,topics,perDay,noSun,today){
 const days=[];for(let d=addDays(today,1);d<exam;d=addDays(d,1)){if(noSun&&parseD(d).getDay()===0)continue;days.push(d);}
 const D=days.length;if(D<2||!topics.length)return {days,out:[],lost:[],D};
 const load=new Array(D).fill(0),out=[],lost=[];
 const place=(idx,tp,lab)=>{idx=Math.max(0,Math.min(idx,D-1));
  for(let j=idx;j<D;j++)if(load[j]<perDay){out.push({di:j,slot:load[j]++,tp,lab});return j;}
  for(let j=idx-1;j>=0;j--)if(load[j]<perDay){out.push({di:j,slot:load[j]++,tp,lab});return j;}
  lost.push(tp+" · "+lab);return -1;};
 const n=topics.length,span=Math.max(1,Math.ceil(D/2));
 topics.forEach((tp,i)=>{const a=place(Math.floor(i*span/n),tp,"1re lecture");if(a<0)return;let prev=a;
  [[1,"révision 1"],[3,"révision 2"],[7,"révision 3"]].forEach(([o,lab])=>{const t=a+o;if(t<D-2&&t>prev){const r=place(t,tp,lab);if(r>prev)prev=r;}});
  if(prev<D-1)place(Math.max(prev+1,D-2+(i%2)),tp,"dernière révision");});
 return {days,out,lost,D};
}
function agGenerate(){
 const g=id=>document.getElementById(id);
 const date=g("gen-d").value,nom=g("gen-n").value.trim()||"Évaluation",topics=g("gen-t").value.split("\n").map(x=>x.trim()).filter(Boolean),perDay=+g("gen-p").value||2,h0=g("gen-h").value||"18:00",noSun=g("gen-sun").checked,today=todayISO();
 if(!date||date<=today){toast("Choisissez une date d'évaluation à venir");return;}
 if(!topics.length){toast("Ajoutez au moins un thème");g("gen-t").focus();return;}
 const r=agPlan(date,topics,perDay,noSun,today);
 if(r.D<2){toast("L'évaluation est trop proche pour un plan");return;}
 const pid=otId(),[hh,mm]=h0.split(":").map(Number);
 const ev=r.out.map(o=>{const m=hh*60+(mm||0)+o.slot*75;return {id:otId(),d:r.days[o.di],h:String(Math.floor(m/60)%24).padStart(2,"0")+":"+String(m%60).padStart(2,"0"),t:o.tp+" · "+o.lab,ty:"Révision",gen:pid};});
 agSave([...agenda(),...ev]);store.set("agendaPlans",[...agPlans(),{id:pid,nom,date,n:ev.length}]);
 state.agGen=false;state.agWeek=mondayOf(ev.length?ev.map(e=>e.d).sort()[0]:today);haptic();
 toast(`${plural(ev.length,"séance")} ajoutée${ev.length>1?"s":""}${r.lost.length?` · ${r.lost.length} non placée${r.lost.length>1?"s":""}`:""}`);render();
 if(r.lost.length)setTimeout(()=>toast("Augmentez le nombre de séances par jour pour tout placer"),1800);
}
/* Export .ics : planning, partiels, stage et mémoire, avec des alarmes calquées sur les réglages des rappels
   (l'agenda du téléphone prévient même quand l'appli est fermée). */
function agICS(){
 const C=ntCfg(),dm=ntMin(ntHM(C.digH,"07:30")),em=ntMin(ntHM(C.eveH,"19:00")),s=stageInfo(),T=tfe();
 const ev=[...agenda().map(e=>({...e,src:"ag"})),...exams().map(e=>({id:"ex"+e.id,d:e.date,h:ntHM(e.heure,"08:00"),t:e.nom,ty:"Partiel",src:"ex"}))].filter(e=>e.d);
 if(s.debut)ev.push({id:"stage-"+s.debut,d:s.debut,h:"",fin:s.fin&&s.fin>=s.debut?s.fin:"",t:"Stage"+(s.service?" · "+s.service:""),ty:"Stage",src:"st"});
 if(T.rendu)ev.push({id:"tfe-rendu-"+T.rendu,d:T.rendu,h:"",t:"Rendu du mémoire",ty:"TFE",src:"tfe"});
 if(T.sout)ev.push({id:"tfe-sout-"+T.sout,d:T.sout,h:"",t:"Soutenance du mémoire",ty:"TFE",src:"tfe"});
 if(!ev.length){toast("Aucun événement à exporter");return;}
 const p=n=>String(n).padStart(2,"0"),now=new Date(),stamp=`${now.getUTCFullYear()}${p(now.getUTCMonth()+1)}${p(now.getUTCDate())}T${p(now.getUTCHours())}${p(now.getUTCMinutes())}${p(now.getUTCSeconds())}Z`;
 const ei=s=>String(s).replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\r?\n/g,"\\n");
 /* Décalage en minutes par rapport au début de l'événement (minuit pour un événement à la journée) → durée iCalendar */
 const dur=m=>{const sg=m<0?"-":"";m=Math.abs(Math.round(m));const D=Math.floor(m/1440),H=Math.floor(m%1440/60),M=m%60;return `${sg}P${D?D+"D":""}${H||M||!D?"T":""}${H?H+"H":""}${M?M+"M":""}${!D&&!H&&!M?"0S":""}`;};
 const alarms=e=>{if(e.done)return [];const xm=e.h?ntMin(e.h):0;
  if(e.src==="ag"){if(e.ty==="À faire"?!C.tache:!C.ag)return [];const rp=e.rp==null||e.rp===""?null:+e.rp;if(rp===-1)return [];
   if(e.h)return [-(rp==null?+C.lead||0:rp)];return [rp!=null&&rp>=1440?em-1440:dm];}
  if(e.src==="ex")return C.ex?[-(7*1440+xm-dm),-(1440+xm-em),-60]:[];
  if(e.src==="st")return C.st?[dm-7*1440,em-1440]:[];
  if(e.src==="tfe")return C.tfe?(e.id.startsWith("tfe-rendu")?[dm-30*1440,dm-7*1440,em-1440]:[dm-7*1440,em-1440]):[];
  return [];};
 const L=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Carnet IFSI//Planning//FR","CALSCALE:GREGORIAN","X-WR-CALNAME:Carnet IFSI"];
 ev.forEach(e=>{const d=e.d.replace(/-/g,""),sum=(e.ty==="Révision"||e.ty==="Cours"||e.ty==="Perso"||e.src==="st"||e.src==="tfe"?"":e.ty+" · ")+e.t;
  L.push("BEGIN:VEVENT","UID:"+e.id+"@carnet-ifsi","DTSTAMP:"+stamp);
  if(e.h)L.push("DTSTART:"+d+"T"+e.h.replace(":","")+"00","DURATION:"+(e.ty==="Partiel"?"PT2H":"PT1H"));
  else L.push("DTSTART;VALUE=DATE:"+d,"DTEND;VALUE=DATE:"+addDays(e.fin||e.d,1).replace(/-/g,""));
  L.push("SUMMARY:"+ei(sum),"CATEGORIES:"+ei(e.ty));
  [...new Set(alarms(e))].forEach(m=>L.push("BEGIN:VALARM","ACTION:DISPLAY","DESCRIPTION:"+ei(sum),"TRIGGER:"+dur(m),"END:VALARM"));
  L.push("END:VEVENT");});
 L.push("END:VCALENDAR");
 dlFile("carnet-ifsi-planning.ics","text/calendar",L.join("\r\n")+"\r\n");
}
function agAdd(f){
 const g=id=>document.getElementById(id),t=g("ag-t").value.trim(),d=g("ag-d").value,h=g("ag-h").value,ty=g("ag-ty").value,rep=+g("ag-rep").value||0,rp=g("ag-rp")?g("ag-rp").value:"";
 if(!t||!d){toast("Indiquez un intitulé et une date");return;}
 if(ty==="Partiel"){store.set("exams",[...exams(),{id:Date.now().toString(36),nom:t,date:d,heure:h||"08:00"}]);}
 else{const n=Math.max(1,rep),list=[];for(let i=0;i<n;i++)list.push({id:otId(),d:addDays(d,7*i),h,t,ty,...(rp!==""?{rp:+rp}:{})});agSave([...agenda(),...list]);}
 state.agForm=false;state.agTy=null;state.agWeek=mondayOf(d);haptic();toast(rep>1?`${rep} événements ajoutés`:ty==="À faire"?"Tâche ajoutée":"Événement ajouté");render();
}

/* =====================================================================
   2. CHOIX DU PANSEMENT
   ===================================================================== */
const PA_Q=[
 ["type","Type de plaie",[["chir","Chirurgicale"],["trauma","Traumatique"],["escarre","Escarre"],["veineux","Ulcère veineux"],["arteriel","Ulcère artériel"],["diab","Pied diabétique"],["brulure","Brûlure superficielle"],["tumorale","Plaie tumorale"]]],
 ["coul","Couleur dominante du fond de la plaie",[["noir","Noire : nécrose","#2B2B2B"],["jaune","Jaune : fibrine","#D9B44A"],["rouge","Rouge : bourgeonnement","#C8372D"],["rose","Rose : épidermisation","#E79BA6"]]],
 ["exs","Exsudat (écoulement)",[["sec","Sec"],["faible","Faible"],["modere","Modéré"],["abondant","Abondant"]]],
 ["inf","Signes d'infection locale ?",[["non","Non"],["oui","Oui"]],"Rougeur qui s'étend, chaleur, œdème, pus, odeur, douleur qui augmente"],
 ["sang","La plaie saigne-t-elle ?",[["non","Non"],["oui","Oui"]]],
 ["cav","Plaie creuse ou avec décollement ?",[["non","Non"],["oui","Oui"]]],
 ["odeur","Mauvaise odeur ?",[["non","Non"],["oui","Oui"]]],
 ["peau","Peau autour fragile ou macérée ?",[["non","Non"],["oui","Oui"]]]
];
/* [nom, rôle, fréquence de réfection, exemples de noms commerciaux (France, liste non exhaustive)] */
const PA_P={
 hydrogel:["Hydrogel","réhydrate et ramollit la nécrose ou la fibrine pour faciliter la détersion","tous les 1 à 3 jours","Purilon®, Intrasite Gel®, Duoderm Hydrogel®, Hydrosorb® (plaque)"],
 alginate:["Alginate","très absorbant et hémostatique ; se mèche dans les cavités","tous les jours ou tous les 2 jours, selon la saturation","Algostéril®, Urgosorb®, Melgisorb Plus®, Biatain Alginate®, Kaltostat®"],
 hydrofibre:["Hydrofibre","très absorbante, gélifie au contact de l'exsudat","tous les 1 à 3 jours, selon la saturation","Aquacel Extra®, Aquacel Ribbon® (mèche), Exufiber®, UrgoClean® (fibres poly-absorbantes)"],
 mousse:["Hydrocellulaire (mousse)","absorbe un exsudat modéré à abondant, protège le bourgeonnement","tous les 2 à 4 jours, jusqu'à 7 jours selon la saturation","Mepilex®, Mepilex Border®, Allevyn®, Biatain®, Aquacel Foam®, UrgoTul Absorb®"],
 mousseFine:["Hydrocellulaire fin","absorption faible à modérée, protection","tous les 3 à 7 jours","Mepilex Lite®, Mepilex Border Lite®, Allevyn Thin®, Biatain Silicone Lite®"],
 hydrocol:["Hydrocolloïde","maintient un milieu humide sur une plaie peu exsudative ; occlusif","tous les 3 à 7 jours, quand la bulle approche du bord","Comfeel Plus®, Duoderm E®, Algoplaque®, Hydrocoll®"],
 hydrocolMince:["Hydrocolloïde mince","protège l'épidermisation","tous les 3 à 7 jours","Comfeel Plus Transparent®, Duoderm Extra Mince®, Algoplaque Film®"],
 hyal:["Acide hyaluronique","favorise le bourgeonnement et l'épidermisation des plaies superficielles et des brûlures superficielles","tous les jours ou tous les 2 jours","Ialuset® compresses, Ialuset® crème (avec une interface ou une compresse)"],
 nosf:["Matrice anti-protéases (TLC-NOSF)","accélère la cicatrisation des ulcères de jambe et du pied diabétique non infectés","tous les 2 à 4 jours, selon la saturation","UrgoStart®, UrgoStart Plus®, UrgoStart Plus Border®"],
 interface:["Interface (maille, tulle siliconé)","non adhérente : protège le bourgeon et la peau fragile","tous les 2 à 4 jours, selon le pansement secondaire","Urgotul®, Adaptic Touch®, Mepitel One®, Physiotulle® ; tulle vaseliné type Jelonet® (adhère davantage)"],
 film:["Film transparent","protection, surveillance visuelle, pansement secondaire","jusqu'à 7 jours","Tegaderm®, Opsite Flexigrid®, Hydrofilm®, Mepore Film®"],
 postop:["Pansement post-opératoire","pansement sec adhésif ou film absorbant : protège la cicatrice et laisse surveiller","laisser 24 à 48 heures sans y toucher, puis selon le protocole","Cosmopor E®, Mepore®, Opsite Post-Op®, Mepilex Border Post-Op®, Aquacel Surgical®"],
 argent:["Pansement à l'argent","antibactérien local en cas d'infection ou de forte colonisation ; durée limitée","selon la saturation ; réévaluer son intérêt après 2 semaines au plus","Aquacel Ag+ Extra®, UrgoTul Ag®, Mepilex Ag®, Biatain Ag®, Acticoat®, Melgisorb Ag®"],
 charbon:["Pansement au charbon","absorbe les odeurs","selon le pansement primaire","Actisorb® (charbon et argent), Carboflex®, Askina Carbosorb®"],
 compresse:["Compresses stériles","pansement secondaire simple","selon le pansement primaire","compresses stériles non tissées, maintenues par un film ou une bande (Mepore®, Cosmopor®)"],
 sec:["Compresse sèche ou interface","garder la nécrose sèche et protégée","selon la prescription","compresses stériles sèches, ou interface type Urgotul® / Adaptic Touch®"]
};
function paReco(a){
 const P=new Set(),S=new Set(),alert=[],todo=[],avoid=[];
 const hi=a.exs==="modere"||a.exs==="abondant",isch=a.type==="arteriel"||a.type==="diab";
 if(a.coul==="noir"){
  if(isch){P.add("sec");alert.push("Nécrose sur une plaie ischémique ou un pied diabétique : pas de détersion ni d'hydrogel sans avis médical (risque d'aggravation et d'infection).");}
  else if(hi){P.add("alginate");P.add("hydrofibre");S.add("mousse");todo.push("Détersion mécanique progressive de la nécrose ramollie, après antalgie, sans faire saigner.");}
  else{P.add("hydrogel");S.add("film");todo.push("Détersion mécanique progressive une fois la nécrose ramollie par l'hydrogel.");}}
 else if(a.coul==="jaune"){if(hi){P.add("alginate");P.add("hydrofibre");S.add("mousse");}else{P.add("hydrogel");S.add("film");}todo.push("Détersion mécanique de la fibrine à chaque réfection si possible, sans faire saigner.");}
 else if(a.coul==="rouge"){if(a.exs==="abondant"){P.add("alginate");P.add("hydrofibre");S.add("mousse");}else if(a.exs==="modere")P.add("mousse");else{P.add("hydrocol");P.add("interface");P.add("hyal");}
  if((a.type==="veineux"||a.type==="diab")&&a.exs!=="abondant")P.add("nosf");}
 else if(a.coul==="rose"){if(hi)P.add("mousseFine");else{P.add("hydrocolMince");P.add("film");P.add("interface");P.add("hyal");}}
 if(a.type==="brulure"&&(a.coul==="rouge"||a.coul==="rose")){P.add("interface");if(!hi)P.add("hyal");}
 if(a.type==="chir"&&(a.coul==="rouge"||a.coul==="rose")&&a.exs!=="abondant"&&a.cav!=="oui"){const keep=[...P].filter(k=>k!=="hyal");P.clear();P.add("postop");keep.forEach(k=>P.add(k));}
 if(a.inf==="oui"){["hydrocol","hydrocolMince","film","hyal","nosf","postop"].forEach(k=>{P.delete(k);S.delete(k);});
  if(!P.has("sec")){P.add("argent");if(!P.size||(P.size===1))P.add("interface");}
  avoid.push("Les pansements occlusifs (hydrocolloïde, film) sur une plaie infectée.");
  alert.push("Signes d'infection : prévenir le médecin (traitement général si fièvre ou infection qui s'étend). Prélèvement seulement sur prescription. Réfection quotidienne au début pour surveiller.");}
 if(a.sang==="oui"){P.add("alginate");alert.push("Saignement : comprimer ; s'il est abondant ou persistant, avis médical.");}
 if(a.cav==="oui"){if(!P.has("alginate")&&!P.has("hydrofibre"))P.add("hydrofibre");P.delete("hydrocol");todo.push("Mécher la cavité avec un alginate ou une hydrofibre en mèche, sans tasser ; mesurer la profondeur et les décollements.");}
 if(a.odeur==="oui")S.add("charbon");
 if(a.peau==="oui"){todo.push("Protéger la peau autour de la plaie (film protecteur cutané en spray ou lingette) ; préférer des pansements siliconés peu adhésifs.");if(hi)todo.push("Peau macérée : choisir un pansement plus absorbant ou rapprocher les réfections.");avoid.push("Les adhésifs forts et les sparadraps sur une peau fragile.");}
 if(a.exs==="abondant"&&(a.cav==="oui"||["escarre","veineux","chir"].includes(a.type)))todo.push("Plaie très exsudative ou complexe : la thérapie par pression négative peut être discutée avec le médecin.");
 if(a.type==="diab"){["hydrocol","hydrocolMince"].forEach(k=>P.delete(k));avoid.push("Les hydrocolloïdes et pansements occlusifs sur un pied diabétique.");}
 if(a.type==="arteriel")avoid.push("La compression et la détersion agressive sans avis vasculaire.");
 if(!S.size&&[...P].some(k=>["hydrogel","alginate","hydrofibre","argent"].includes(k)))S.add("compresse");
 const C={chir:"Plaie opératoire : sans complication, pansement sec stérile ou film laissé 24 à 48 heures, surveillance de l'infection du site opératoire. Le protocole du chirurgien prime.",
  trauma:"Plaie traumatique : nettoyer à l'eau et au savon ou au sérum physiologique, rechercher un corps étranger, vérifier la vaccination antitétanique.",
  escarre:"Escarre : supprimer l'appui (changements de position, support adapté, décharge des talons), corriger la dénutrition, évaluer le risque avec l'échelle de Braden.",
  veineux:"Ulcère veineux : la compression veineuse est le traitement de fond, après mesure de l'IPS ; surélever les jambes, encourager la marche.",
  arteriel:"Ulcère artériel : avis vasculaire pour une revascularisation, pas de compression, antalgie avant le soin (plaie très douloureuse).",
  diab:"Pied diabétique : décharge stricte, avis spécialisé rapide (infection vite grave), équilibre glycémique, chaussage adapté.",
  brulure:"Brûlure : refroidir immédiatement (eau à environ 15 °C pendant 15 minutes), évaluer surface et profondeur ; avis médical si elle est étendue, profonde ou touche visage, mains, périnée, chez l'enfant ou la personne âgée.",
  tumorale:"Plaie tumorale : objectif de confort (odeur, saignement, exsudat, douleur) ; pansements non adhérents, éviter les adhésifs, antalgie avant le soin."};
 return {P:[...P],S:[...S].filter(k=>!P.has(k)),alert,todo,avoid,cause:C[a.type]||""};
}
function otPansement(){
 const a=state.pa||(state.pa={inf:"non",sang:"non",cav:"non",odeur:"non",peau:"non"});
 paDefs();
 const D={type:{chir:"incision, agrafes ou fils",trauma:"écorchure, coupure, morsure",escarre:"sur un appui osseux",veineux:"cheville, peau brune autour",arteriel:"pied ou orteils, très douloureux",diab:"sous le pied, peu douloureux",brulure:"rougeur, cloque (phlyctène)",tumorale:"masse qui bourgeonne, saigne"},
  coul:{noir:"Tissu mort, noir ou brun, sec et dur (ramolli s'il est humide)",jaune:"Dépôt jaune, plus ou moins adhérent, parfois filamenteux",rouge:"Tissu rouge vif, granuleux, humide, qui saigne au contact",rose:"Nouvelle peau rose nacrée qui avance depuis les bords"},
  exs:{sec:"Compresse sèche, plaie mate",faible:"Tache sur moins d'un quart de la compresse",modere:"Tache sur un quart à trois quarts",abondant:"Compresse saturée, fuite, peau macérée"}};
 const card=(act,k,v,label,desc,on)=>`<button type="button" class="pa-card" data-act="${act}" data-k="${k}"${v?` data-v="${v}"`:""} aria-pressed="${on}"><span class="pa-pic" aria-hidden="true">${paImg(v||k)}</span><span class="pa-cap"><b>${label}</b>${desc?`<small>${desc}</small>`:""}</span></button>`;
 const q=PA_Q.slice(0,3).map(([k,l,opts])=>`<div class="pa-q"><h3>${l}</h3>${k==="coul"?`<small class="ot-hint">Si la plaie a plusieurs couleurs, choisissez le tissu à traiter en priorité : le noir avant le jaune, le jaune avant le rouge.</small>`:k==="exs"?`<small class="ot-hint">Regardez le pansement retiré : la surface tachée donne la quantité d'exsudat.</small>`:""}
  <div class="pa-cards ${k==="type"?"three":"two"}" role="group" aria-label="${esc(l)}">${opts.map(([v,t])=>card("ot-pa",k,v,t,D[k][v],a[k]===v)).join("")}</div></div>`).join("")
  +`<div class="pa-q pa-flags"><h3>Particularités, si présentes</h3><small class="ot-hint">Plusieurs choix possibles.</small>
  <div class="pa-cards three" role="group" aria-label="Particularités">${[["inf","Signes d'infection","rougeur qui s'étend (plus de 2 cm), chaleur, pus, douleur qui augmente"],["sang","Saignement","spontané ou au moindre contact"],["cav","Creuse, décollement","profondeur, berges décollées à explorer au stylet stérile"],["odeur","Mauvaise odeur","persistante après le nettoyage"],["peau","Peau fragile ou macérée","blanchâtre, ramollie, fripée, ou très fine"]].map(([k,t,d])=>card("ot-pa-flag",k,"",t,d,a[k]==="oui")).join("")}</div></div>
  <p class="ot-hint pa-note">Illustrations dessinées pour aider à reconnaître chaque aspect : la réalité varie selon la peau, la localisation et l'éclairage. Évaluez toujours après nettoyage, sous une bonne lumière.</p>`;
 let res=`<div class="callout"><b>Choisissez au moins la couleur du fond et l'exsudat</b> pour obtenir une orientation.</div>`;
 if(a.coul&&a.exs){const r=paReco(a),card=k=>`<div class="pa-p"><b>${PA_P[k][0]}</b><small>${PA_P[k][1]}</small>${PA_P[k][3]?`<span class="pa-ex"><span class="pa-ex-l">Exemples</span>${PA_P[k][3].split(/, | ; /).map(x=>`<i>${esc(x)}</i>`).join("")}</span>`:""}<span class="pa-f">Réfection : ${PA_P[k][2]}</span></div>`;
  res=`<section class="sheet-body pa-res" aria-live="polite"><span class="eyebrow">Orientation</span>
   <div class="stack-sm"><h3>Pansement primaire, au contact de la plaie</h3>${r.P.map(card).join("")}</div>
   ${r.S.length?`<div class="stack-sm"><h3>Pansement secondaire ou associé</h3>${r.S.map(card).join("")}</div>`:""}
   ${r.alert.length?`<div class="callout warn"><b>Points de vigilance</b><ul class="clean">${r.alert.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>`:""}
   ${r.cause?`<div class="callout"><b>Traiter la cause</b><p>${esc(r.cause)}</p></div>`:""}
   ${r.todo.length?`<div class="stack-sm"><h3>Pendant le soin</h3><ul class="clean pa-ul">${r.todo.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>`:""}
   ${r.avoid.length?`<div class="stack-sm"><h3>À éviter</h3><ul class="clean pa-ul">${r.avoid.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>`:""}
   <div class="stack-sm"><h3>Toujours</h3><ul class="clean pa-ul"><li>Nettoyer au sérum physiologique (ou à l'eau du robinet pour une plaie chronique) ; pas d'antiseptique systématique sur une plaie chronique.</li><li>Évaluer et tracer à chaque réfection : dimensions, couleur, exsudat, berges, douleur, photo datée.</li><li>Prévenir la douleur : antalgique avant le soin si besoin.</li><li>Réévaluer le choix quand l'aspect de la plaie change.</li></ul></div>
   <p class="ot-hint">Noms commerciaux cités à titre d'exemples, sans préférence ni liste exhaustive : chaque établissement a son propre référencement. Vérifiez la classe du pansement sur l'emballage.</p>
   <p class="ot-hint">Les infirmiers peuvent prescrire certains pansements (dispositifs médicaux), sauf indication contraire du médecin. Le choix final suit la prescription, le protocole du service ou l'avis de l'infirmier référent plaies et cicatrisation.</p>
  </section>`;}
 return `<div class="stack-lg">${q}<button type="button" class="link" data-act="ot-pa-reset">Recommencer</button>${res}
  <div class="list"><a class="li" href="#cours/plaies-c"><span class="ic tb-ic" style="--c:#B55E3A">${OT_IC.pansement}</span><span><span class="t">Cours : plaies et cicatrisation</span><span class="s">Phases, évaluation, classes de pansements</span></span>${chev}</a>
   <a class="li" href="#cours/escarres-c"><span class="ic tb-ic" style="--c:#B55E3A">${OT_IC.pansement}</span><span><span class="t">Cours : prévenir et soigner les escarres</span><span class="s">Braden, prévention, stades</span></span>${chev}</a></div></div>`;
}

/* =====================================================================
   3. AIDE AU TFE
   ===================================================================== */
const TFE_STEPS=[
 ["Choisir une situation d'appel","Une situation vécue en stage qui vous a étonné·e ou questionné·e, décrite de façon factuelle et anonyme.","tfe-appel"],
 ["Formuler la question de départ","Claire (une seule idée), ouverte, faisable, pertinente pour la profession.","tfe-question"],
 ["Recherche documentaire","Mots-clés en français et en anglais, bases de données, fiches de lecture avec les références complètes.","tfe-documentation"],
 ["Entretiens exploratoires","Rencontrer deux ou trois professionnels pour confronter le thème au terrain.","tfe-exploratoire"],
 ["Cadre conceptuel","Définir les concepts clés avec des auteurs de référence et les articuler.","tfe-cadre"],
 ["Problématique et question de recherche","Ce qui fait problème entre théorie et terrain, puis la question (ou l'hypothèse) retenue.","tfe-problematique"],
 ["Outil d'enquête","Guide d'entretien ou questionnaire testé ; autorisations demandées ; consentement et anonymat prévus.","tfe-outil"],
 ["Enquête et retranscription","Entretiens réalisés, enregistrés avec accord, retranscrits et anonymisés.","tfe-enquete"],
 ["Analyse et discussion","Grille d'analyse par thèmes, confrontation aux auteurs, limites de l'étude.","tfe-analyse"],
 ["Rédaction et mise en forme","Introduction, conclusion, sommaire automatique, bibliographie normée, annexes, résumé en anglais.","tfe-redaction"],
 ["Relecture et dépôt","Orthographe, respect des consignes de l'IFSI, sources citées, dépôt dans les délais.","tfe-relecture"],
 ["Préparer la soutenance","Diaporama sobre, une dizaine de minutes, questions probables du jury.","tfe-soutenance"]
];
const TFE_SUJET=[["appel","Situation d'appel","Décrivez les faits : où, quand, qui (sans nom), ce qui s'est passé, ce qui vous a interpellé·e."],["theme","Thème","Ex. le refus de soin chez la personne âgée"],["qd","Question de départ","Ex. En quoi la relation soignant-soigné influence-t-elle…"],["concepts","Concepts clés et auteurs","Ex. relation de soin (Hesbeen), consentement, autonomie"],["qr","Question de recherche ou hypothèse",""],["journal","Carnet de bord","Idées, lectures, contacts, rendez-vous avec la guidance"]];
const TFE_MILES=[[.1,"Question de départ validée"],[.25,"Recherche documentaire et entretiens exploratoires"],[.45,"Cadre conceptuel et problématique"],[.55,"Outil d'enquête prêt et testé"],[.7,"Enquête terminée et retranscrite"],[.85,"Analyse et discussion rédigées"],[.95,"Rédaction terminée, relecture"],[1,"Dépôt du mémoire"]];
const tfe=()=>Object.assign({steps:[],s:{},eq:[{fr:"",en:""},{fr:"",en:""},{fr:"",en:""}],refs:[],rendu:"",sout:""},store.get("tfe",{}));
const tfeSave=t=>store.set("tfe",t);
function qdCheck(q){
 q=(q||"").trim();if(!q)return "";
 const out=[],w=q.split(/\s+/).length,nq=(q.match(/\?/g)||[]).length;
 if(/^(est-ce|faut-il|peut-on|doit-on|y a-t-il|a-t-on|les? \S+ (sont|ont|peuvent|doivent)-?)/i.test(q)||/\best-ce que\b/i.test(q))out.push(["ko","Question fermée (réponse oui ou non) : préférez « Comment… », « En quoi… », « Dans quelle mesure… »."]);
 else if(/^(comment|en quoi|dans quelle mesure|de quelle(s)? mani[eè]re|quel(le)?s? |pourquoi|quelle place|qu'est-ce qui)/i.test(q))out.push(["ok","Question ouverte."]);
 if(nq===0)out.push(["ko","Terminez par un point d'interrogation."]);
 if(nq>1)out.push(["ko","Plusieurs questions : gardez-en une seule."]);
 if(w>35)out.push(["ko",`${w} mots : un peu long, visez une seule idée en une vingtaine de mots.`]);
 else if(w<6)out.push(["ko","Très courte : précisez le contexte (qui, quelle situation de soin)."]);
 else out.push(["ok",`${w} mots : longueur raisonnable.`]);
 if(/pourquoi (les|des) (soignants|infirmi\w+|aides?-soignant\w*)|ne respectent pas|maltrait/i.test(q))out.push(["ko","Attention à une formulation qui juge l'équipe : interrogez la situation plutôt que les personnes."]);
 return out.map(([c,t])=>`<li class="${c}">${esc(t)}</li>`).join("");
}
const eqTerm=t=>/\s/.test(t)?`"${t}"`:t;
function eqBuild(eq,lang){
 const op=lang==="fr"?[" OU "," ET "]:[" OR "," AND "];
 const groups=eq.map(c=>(c[lang]||"").split(",").map(x=>x.trim()).filter(Boolean)).filter(g=>g.length).map(g=>g.length>1?"("+g.map(eqTerm).join(op[0])+")":eqTerm(g[0]));
 return groups.join(op[1]);
}
function apaAuthors(s){
 const a=String(s||"").split(/\n|;/).map(x=>x.trim()).filter(Boolean);
 if(!a.length)return "";if(a.length===1)return a[0];if(a.length===2)return a[0]+", & "+a[1];
 if(a.length<=20)return a.slice(0,-1).join(", ")+", & "+a[a.length-1];return a.slice(0,19).join(", ")+", … "+a[a.length-1];
}
function apaFormat(r){
 const e=x=>esc((x||"").trim()),A=apaAuthors(r.aut),an=(r.an||"").trim()||"s. d.",dot=s=>/[.?!]$/.test(s)?s:s+".";
 const head=A?`${esc(dot(A))} (${esc(an)}).`:"";
 let h="";
 if(r.type==="livre")h=`${head} <i>${e(r.tit)}</i>${r.ed?` (${e(r.ed)} éd.)`:""}. ${r.edi?esc(dot(r.edi.trim())):""}`;
 else if(r.type==="article")h=`${head} ${r.tit?esc(dot(r.tit.trim())):""} <i>${e(r.rev)}</i>${r.vol?`, <i>${e(r.vol)}</i>`:""}${r.num?`(${e(r.num)})`:""}${r.pag?`, ${e(r.pag)}`:""}.${r.url?" "+e(r.url):""}`;
 else if(r.type==="web")h=`${head} <i>${e(r.tit)}</i>. ${r.site?esc(dot(r.site.trim()))+" ":""}${e(r.url)}`;
 else h=`${r.tit?esc(dot(r.tit.trim())):""} (${esc(an)}). <i>Journal officiel de la République française</i>.${r.url?" "+e(r.url):""}`;
 return h.replace(/\s+/g," ").replace(/\s+\./g,".").trim();
}
const APA_F={livre:[["aut","Auteur(s), un par ligne","Nom, I."],["an","Année",""],["tit","Titre de l'ouvrage",""],["ed","Édition (si pas la 1re)","2e"],["edi","Éditeur","Elsevier Masson"]],
 article:[["aut","Auteur(s), un par ligne","Nom, I."],["an","Année",""],["tit","Titre de l'article",""],["rev","Nom de la revue","Soins"],["vol","Volume",""],["num","Numéro",""],["pag","Pages","25-28"],["url","DOI ou lien","https://doi.org/…"]],
 web:[["aut","Auteur ou organisme","Haute Autorité de santé"],["an","Année",""],["tit","Titre de la page",""],["site","Nom du site",""],["url","Adresse (URL)","https://…"]],
 loi:[["tit","Intitulé complet du texte","Loi n° 2016-87 du 2 février 2016 créant de nouveaux droits…"],["an","Année",""],["url","Lien Légifrance","https://www.legifrance.gouv.fr/…"]]};
function otTfe(){
 const T=tfe(),done=TFE_STEPS.filter((_,i)=>T.steps[i]).length,pct=Math.round(done/TFE_STEPS.length*100),today=todayISO();
 const apa=state.apa||(state.apa={type:"livre"});
 const refs=[...T.refs].sort((a,b)=>stripTags(a.h).localeCompare(stripTags(b.h),"fr"));
 const eqFR=eqBuild(T.eq,"fr"),eqEN=eqBuild(T.eq,"en");
 let plan="";
 if(T.rendu){const jr=Math.round((parseD(T.rendu)-parseD(today))/864e5);
  if(jr<=0)plan=`<p class="muted">La date de rendu est passée ou c'est aujourd'hui.</p>`;
  else{const miles=TFE_MILES.map(([p,l])=>[addDays(today,Math.round(jr*p)),l]);
   plan=`<p class="ot-big">J-${jr} <small>avant le rendu</small></p>${jr<21?`<div class="callout warn">Moins de trois semaines : concentrez-vous sur l'analyse, la rédaction et la relecture.</div>`:""}
    <ol class="tfe-miles">${miles.map(([d,l])=>`<li><span>${esc(parseD(d).toLocaleDateString("fr-FR",{day:"numeric",month:"short"}))}</span>${esc(l)}</li>`).join("")}</ol>
    <button type="button" class="btn ghost block" data-act="ot-tfe-plan">${OT_IC.planning}Ajouter ces étapes à mon planning</button>`;}}
 return `<section class="sheet-body"><div class="tfe-top">${ring(pct,84)}<div><span class="eyebrow">Mon avancement</span><h2>${done} étape${done>1?"s":""} sur ${TFE_STEPS.length}</h2><p class="muted">Cochez chaque étape terminée.</p></div></div>
   <ol class="tfe-steps">${TFE_STEPS.map(([t,d,c],i)=>`<li class="${T.steps[i]?"ok":""}"><label class="chk"><input type="checkbox" data-act="ot-tfe-step" data-i="${i}" ${T.steps[i]?"checked":""}><span><b>${i+1}. ${esc(t)}</b><small>${esc(d)}${c?` <a href="#cours/${c}">Cours de l'étape</a>`:""}</small></span></label></li>`).join("")}</ol></section>
  <section class="stack-sm"><div class="section-title"><h2>Mon sujet</h2><span class="muted" id="tfe-saved">Enregistré sur cet appareil</span></div>
   <div class="cd-form sheet-body">${TFE_SUJET.map(([k,l,ph])=>otField("tfe-"+k,l,`<textarea id="tfe-${k}" data-ot="tfe.${k}" rows="${k==="appel"||k==="journal"?4:2}" placeholder="${esc(ph)}">${esc(T.s[k]||"")}</textarea>`)+(k==="qd"?`<ul class="clean qd-check" id="qd-check" aria-live="polite">${qdCheck(T.s.qd)}</ul>`:"")).join("")}
    <details class="ot-det"><summary>Les critères d'une bonne question de départ</summary><ul class="clean pa-ul"><li><b>Claire</b> : une seule idée, sans jargon ni termes ambigus.</li><li><b>Ouverte</b> : on ne connaît pas la réponse, pas de oui/non.</li><li><b>Faisable</b> : en temps et en accès au terrain pour un étudiant.</li><li><b>Pertinente</b> : utile pour la pratique infirmière, sans jugement des personnes.</li></ul></details></div></section>
  <section class="stack-sm"><div class="section-title"><h2>Équation de recherche</h2></div>
   <div class="cd-form sheet-body"><p class="muted">Pour chaque concept, notez des synonymes séparés par des virgules, en français et en anglais (aidez-vous du thésaurus MeSH sur HeTOP).</p>
    ${T.eq.map((c,i)=>`<div class="cd-row">${otField(`eq-fr-${i}`,`Concept ${i+1} (français)`,`<input id="eq-fr-${i}" data-ot="eq.${i}.fr" value="${esc(c.fr)}" placeholder="${["personne âgée, sujet âgé","refus de soins","relation soignant-soigné"][i]}">`)}${otField(`eq-en-${i}`,`Concept ${i+1} (anglais)`,`<input id="eq-en-${i}" data-ot="eq.${i}.en" value="${esc(c.en)}" placeholder="${["aged, elderly","treatment refusal","nurse-patient relations"][i]}">`)}</div>`).join("")}
    <div id="eq-out">${eqOut(eqFR,eqEN)}</div></div></section>
  <section class="stack-sm"><div class="section-title"><h2>Références bibliographiques (APA)</h2></div>
   <div class="cd-form sheet-body">${otSeg("ot-apa-type",apa.type,[["livre","Ouvrage"],["article","Article"],["web","Site web"],["loi","Texte de loi"]],"Type de document")}
    ${APA_F[apa.type].map(([k,l,ph])=>otField("apa-"+k,l,k==="aut"?`<textarea id="apa-${k}" data-ot="apa.${k}" rows="2" placeholder="${esc(ph)}">${esc(apa[k]||"")}</textarea>`:`<input id="apa-${k}" data-ot="apa.${k}" value="${esc(apa[k]||"")}" placeholder="${esc(ph)}">`)).join("")}
    <div class="eq-box" id="apa-prev" aria-live="polite">${apaFormat(apa)||"<span class='muted'>Aperçu de la référence</span>"}</div>
    <button type="button" class="btn block" data-act="ot-apa-add">${IC.plus}Ajouter à ma bibliographie</button>
    ${refs.length?`<div class="stack-sm"><div class="section-title"><h3>Ma bibliographie · ${refs.length}</h3><button type="button" class="link" data-act="ot-apa-copy">Tout copier</button></div><ol class="clean apa-list">${refs.map(r=>`<li><span>${r.h}</span><button type="button" class="del" data-act="ot-apa-del" data-id="${esc(r.id)}" aria-label="Supprimer la référence">${IC.x}</button></li>`).join("")}</ol></div>`:""}</div></section>
  <section class="stack-sm"><div class="section-title"><h2>Rétroplanning</h2></div>
   <div class="cd-form sheet-body"><div class="cd-row">${otField("tfe-rendu","Date de rendu du mémoire",`<input id="tfe-rendu" type="date" data-ot="tfe.rendu" value="${esc(T.rendu)}">`)}${otField("tfe-sout","Date de soutenance",`<input id="tfe-sout" type="date" data-ot="tfe.sout" value="${esc(T.sout)}">`)}</div>
    <div id="tfe-plan">${plan||`<p class="muted">Indiquez la date de rendu pour obtenir des échéances intermédiaires.</p>`}</div></div></section>
  <div class="list"><a class="li" href="#cours/tfe-0"><span class="ic tb-ic" style="--c:#6E5196">${OT_IC.tfe}</span><span><span class="t">Cours : le mémoire de A à Z</span><span class="s">Attendus, calendrier, évaluation, les 12 étapes</span></span>${chev}</a>
   <button type="button" class="li" data-act="go-cat" data-k="tfe"><span class="ic tb-ic" style="--c:#6E5196">${OT_IC.tfe}</span><span><span class="t">Tous les cours du mémoire</span><span class="s">Un cours détaillé par étape, quiz du mémoire</span></span>${chev}</button></div>`;
}
function eqOut(fr,en){
 if(!fr&&!en)return `<p class="muted">L'équation apparaît ici quand vous remplissez au moins un concept.</p>`;
 const q=encodeURIComponent(en||fr);
 return `${fr?`<div class="stack-sm"><span class="ot-hint">En français (Cairn, LiSSa, catalogues)</span><div class="eq-box">${esc(fr)}</div><button type="button" class="link" data-act="ot-copy" data-k="${esc(fr)}">Copier</button></div>`:""}
  ${en?`<div class="stack-sm"><span class="ot-hint">En anglais (PubMed, CINAHL)</span><div class="eq-box">${esc(en)}</div><button type="button" class="link" data-act="ot-copy" data-k="${esc(en)}">Copier</button></div>`:""}
  <div class="chips wrapchips"><a class="chip" href="https://pubmed.ncbi.nlm.nih.gov/?term=${q}" target="_blank" rel="noopener">PubMed</a><a class="chip" href="https://scholar.google.fr/scholar?q=${q}" target="_blank" rel="noopener">Google Scholar</a><a class="chip" href="https://www.cairn.info" target="_blank" rel="noopener">Cairn</a><a class="chip" href="https://www.lissa.fr" target="_blank" rel="noopener">LiSSa</a><a class="chip" href="https://www.has-sante.fr" target="_blank" rel="noopener">HAS</a><a class="chip" href="https://www.hetop.eu/hetop/" target="_blank" rel="noopener">HeTOP (MeSH)</a></div>`;
}

/* =====================================================================
   4. CALCULS DE SOINS
   ===================================================================== */
const CX=[
 {id:"gtt",t:"Débit en gouttes par minute",f:[["v","Volume à perfuser","mL"],["h","Durée : heures","h"],["m","et minutes","min"],["g","Perfuseur","",[["20","Standard : 20 gouttes/mL"],["60","Microgouttes : 60 gouttes/mL"],["15","Transfuseur : 15 gouttes/mL"]]]],
  run:x=>{const t=(x.h||0)*60+(x.m||0),g=x.g||20;if(!(x.v>0)||!(t>0))return null;const d=x.v*g/t,mlh=x.v/t*60;
   return {r:`≈ <b>${Math.round(d)} gouttes/min</b> · ${fmtN(mlh,1)} mL/h`,s:[`Durée totale = ${fmtN(t)} min`,`Nombre de gouttes = ${fmtN(x.v)} mL × ${g} gouttes/mL = ${fmtN(x.v*g)} gouttes`,`Débit = ${fmtN(x.v*g)} ÷ ${fmtN(t)} min = ${fmtN(d,1)} gouttes/min, arrondi à ${Math.round(d)}`,`Soit ${fmtN(x.v)} mL ÷ ${fmtN(t/60,2)} h = ${fmtN(mlh,1)} mL/h`]};}},
 {id:"pse",t:"Pousse-seringue : vitesse en mL/h",f:[["dose","Dose prescrite","mg/h"],["q","Quantité de produit dans la seringue","mg"],["v","Volume total de la seringue","mL"]],
  run:x=>{if(!(x.dose>0)||!(x.q>0)||!(x.v>0))return null;const c=x.q/x.v,r=x.dose/c;
   return {r:`<b>${fmtN(r,1)} mL/h</b>`,s:[`Concentration = ${fmtN(x.q)} mg ÷ ${fmtN(x.v)} mL = ${fmtN(c,3)} mg/mL`,`Vitesse = ${fmtN(x.dose)} mg/h ÷ ${fmtN(c,3)} mg/mL = ${fmtN(r,2)} mL/h`]};}},
 {id:"vol",t:"Débit d'une perfusion en mL/h",f:[["v","Volume à perfuser","mL"],["h","Durée : heures","h"],["m","et minutes","min"]],
  run:x=>{const t=(x.h||0)+(x.m||0)/60;if(!(x.v>0)||!(t>0))return null;return {r:`<b>${fmtN(x.v/t,1)} mL/h</b>`,s:[`Durée = ${fmtN(t,2)} h`,`Débit = ${fmtN(x.v)} mL ÷ ${fmtN(t,2)} h = ${fmtN(x.v/t,2)} mL/h`]};}},
 {id:"poids",t:"Dose au poids",f:[["p","Posologie","mg/kg/jour"],["kg","Poids","kg"],["n","Nombre de prises par jour",""],["max","Dose maximale par jour (facultatif)","mg"]],
  run:x=>{if(!(x.p>0)||!(x.kg>0))return null;const dj=x.p*x.kg,n=x.n>0?x.n:1,dp=dj/n,over=x.max>0&&dj>x.max;
   return {r:`<b>${fmtN(dj)} mg/jour</b>${n>1?` · ${fmtN(dp)} mg par prise`:""}${over?`<span class="cx-warn">Dépasse la dose maximale de ${fmtN(x.max)} mg/jour : vérifier la prescription</span>`:""}`,s:[`Dose journalière = ${fmtN(x.p)} mg/kg/jour × ${fmtN(x.kg)} kg = ${fmtN(dj)} mg/jour`,...(n>1?[`Dose par prise = ${fmtN(dj)} ÷ ${n} prises = ${fmtN(dp)} mg`]:[])]};}},
 {id:"prel",t:"Volume à prélever",f:[["d","Dose prescrite","mg"],["q","La présentation contient","mg"],["v","dans un volume de","mL"]],
  run:x=>{if(!(x.d>0)||!(x.q>0)||!(x.v>0))return null;const r=x.d*x.v/x.q;return {r:`<b>${fmtN(r)} mL</b> à prélever${x.d>x.q?`<span class="cx-warn">Plus d'une ampoule ou d'un flacon nécessaire</span>`:""}`,s:[`Produit en croix : ${fmtN(x.q)} mg → ${fmtN(x.v)} mL ; ${fmtN(x.d)} mg → ? mL`,`Volume = ${fmtN(x.d)} × ${fmtN(x.v)} ÷ ${fmtN(x.q)} = ${fmtN(r)} mL`]};}},
 {id:"conc",t:"Concentration d'une solution",f:[["q","Quantité de produit","mg"],["v","Volume de la solution","mL"]],
  run:x=>{if(!(x.q>0)||!(x.v>0))return null;const c=x.q/x.v,p=x.q/1000/x.v*100;return {r:`<b>${fmtN(c,3)} mg/mL</b> · ${fmtN(p,3)} %`,s:[`Concentration = ${fmtN(x.q)} mg ÷ ${fmtN(x.v)} mL = ${fmtN(c,3)} mg/mL`,`En pourcentage : ${fmtN(x.q/1000,3)} g pour ${fmtN(x.v)} mL, soit ${fmtN(p,3)} g pour 100 mL = ${fmtN(p,3)} %`]};}},
 {id:"pct",t:"Pourcentage : quantité de produit",f:[["p","Solution à","%"],["v","Volume","mL"]],
  run:x=>{if(!(x.p>0)||!(x.v>0))return null;const g=x.p/100*x.v;return {r:`<b>${fmtN(g,2)} g</b> soit ${fmtN(g*1000,0)} mg`,s:[`${fmtN(x.p)} % = ${fmtN(x.p)} g pour 100 mL`,`Pour ${fmtN(x.v)} mL : ${fmtN(x.p)} × ${fmtN(x.v)} ÷ 100 = ${fmtN(g,2)} g`]};}},
 {id:"conv",t:"Conversion d'unités",f:[["x","Valeur",""],["from","De","",[["kg","kg"],["g","g"],["mg","mg"],["µg","µg"],["L","L"],["dL","dL"],["cL","cL"],["mL","mL"]]],["to","Vers","",[["mg","mg"],["g","g"],["kg","kg"],["µg","µg"],["mL","mL"],["L","L"],["dL","dL"],["cL","cL"]]]],
  run:x=>{const M={kg:1e9,g:1e6,mg:1e3,"µg":1},V={L:1000,dL:100,cL:10,mL:1};const f=x.from||"kg",t=x.to||"mg";if(!Number.isFinite(x.x))return null;
   const fam=M[f]?M:V;if(!fam[t])return {r:`<span class="cx-warn">On ne convertit pas une masse en volume</span>`,s:[]};const r=x.x*fam[f]/fam[t];
   return {r:`<b>${fmtN(r,6)} ${t}</b>`,s:[`1 ${f} = ${fmtN(fam[f]/fam[t],6)} ${t}`,`${fmtN(x.x,6)} ${f} × ${fmtN(fam[f]/fam[t],6)} = ${fmtN(r,6)} ${t}`]};}}
];
function cxRes(c){const v=(state.cx&&state.cx[c.id])||{},x={};c.f.forEach(([k,,,opts])=>{x[k]=opts?(v[k]!=null?(isNaN(+v[k])?v[k]:+v[k]):(isNaN(+opts[0][0])?opts[0][0]:+opts[0][0])):num(v[k]);});
 const r=c.run(x);if(!r)return `<p class="muted">Remplissez les champs pour obtenir le résultat.</p>`;
 return `<div class="cx-out">${r.r}</div>${r.s.length?`<ol class="steps">${r.s.map(s=>`<li>${s}</li>`).join("")}</ol>`:""}`;}
function otCalculs(){
 const cur=state.cxSel||"gtt",c=CX.find(x=>x.id===cur)||CX[0],v=(state.cx&&state.cx[c.id])||{};
 return `${qPedago()}<div class="chips wrapchips" role="group" aria-label="Type de calcul">${CX.map(x=>`<button type="button" class="chip" data-act="ot-cx" data-k="${x.id}" aria-pressed="${x.id===c.id}">${x.t}</button>`).join("")}</div>
  <section class="cd-form sheet-body"><h2>${c.t}</h2>
   ${c.f.map(([k,l,u,opts])=>otField(`cx-${k}`,l,opts?`<select id="cx-${k}" data-ot="cx.${c.id}.${k}">${opts.map(([ov,ol])=>`<option value="${ov}" ${String(v[k]||"")===ov?"selected":""}>${ol}</option>`).join("")}</select>`:`<span class="cx-in"><input id="cx-${k}" data-ot="cx.${c.id}.${k}" inputmode="decimal" value="${esc(v[k]||"")}" autocomplete="off">${u?`<em>${u}</em>`:""}</span>`)).join("")}
   <div class="cx-res" id="cx-res" aria-live="polite">${cxRes(c)}</div>
   <button type="button" class="link" data-act="ot-cx-clear">Effacer</button></section>
  <a class="list" href="#entrainer/calculs"><span class="li"><span class="ic tb-ic" style="--c:#2C7451">${OT_IC.calculs}</span><span><span class="t">S'entraîner aux calculs de dose</span><span class="s">Énoncés illimités avec correction</span></span>${chev}</span></a>
  <p class="disclaimer">Outil d'aide : toute préparation se vérifie à deux et suit la prescription. Arrondis à adapter au matériel.</p>`;
}

/* =====================================================================
   5. SCORES CLINIQUES
   ===================================================================== */
const GCS=[["y","Ouverture des yeux",[[4,"Spontanée"],[3,"À la demande ou au bruit"],[2,"À la douleur"],[1,"Aucune"]]],["v","Réponse verbale",[[5,"Orientée"],[4,"Confuse"],[3,"Mots inappropriés"],[2,"Sons incompréhensibles"],[1,"Aucune"]]],["m","Réponse motrice",[[6,"Obéit aux ordres"],[5,"Localise la douleur"],[4,"Évitement, retrait"],[3,"Flexion anormale (décortication)"],[2,"Extension (décérébration)"],[1,"Aucune"]]]];
const BRADEN=[["per","Perception sensorielle",[[1,"Complètement limitée"],[2,"Très limitée"],[3,"Légèrement limitée"],[4,"Aucune atteinte"]]],["hum","Humidité de la peau",[[1,"Constamment humide"],[2,"Très humide"],[3,"Parfois humide"],[4,"Rarement humide"]]],["act","Activité",[[1,"Alité"],[2,"Confiné au fauteuil"],[3,"Marche parfois"],[4,"Marche fréquemment"]]],["mob","Mobilité",[[1,"Complètement immobile"],[2,"Très limitée"],[3,"Légèrement limitée"],[4,"Aucune limitation"]]],["nut","Nutrition",[[1,"Très pauvre"],[2,"Probablement inadéquate"],[3,"Adéquate"],[4,"Excellente"]]],["fri","Friction et cisaillement",[[1,"Problème"],[2,"Problème potentiel"],[3,"Pas de problème apparent"]]]];
const ALGO=[["Visage","froncement des sourcils, grimaces, crispation, mâchoires serrées, visage figé"],["Regard","inattentif, fixe, lointain ou suppliant, pleurs, yeux fermés"],["Plaintes","« aïe », « ouille », « j'ai mal », gémissements, cris"],["Corps","retrait ou protection d'une zone, refus de mobilisation, attitudes figées"],["Comportements","agitation ou agressivité, agrippement"]];
function news2(x){
 const b=(v,rules)=>{for(const [test,p] of rules)if(test(v))return p;return 0;};
 const fr=b(x.fr,[[v=>v<=8,3],[v=>v<=11,1],[v=>v<=20,0],[v=>v<=24,2],[()=>true,3]]);
 const o2=x.o2==="oui";
 const sp=x.ech==="2"?(o2?b(x.sp,[[v=>v<=83,3],[v=>v<=85,2],[v=>v<=87,1],[v=>v<=92,0],[v=>v<=94,1],[v=>v<=96,2],[()=>true,3]]):b(x.sp,[[v=>v<=83,3],[v=>v<=85,2],[v=>v<=87,1],[()=>true,0]]))
  :b(x.sp,[[v=>v<=91,3],[v=>v<=93,2],[v=>v<=95,1],[()=>true,0]]);
 const ox=o2?2:0;
 const pas=b(x.pas,[[v=>v<=90,3],[v=>v<=100,2],[v=>v<=110,1],[v=>v<=219,0],[()=>true,3]]);
 const fc=b(x.fc,[[v=>v<=40,3],[v=>v<=50,1],[v=>v<=90,0],[v=>v<=110,1],[v=>v<=130,2],[()=>true,3]]);
 const cs=x.cs==="A"?0:3;
 const t=b(x.t,[[v=>v<=35,3],[v=>v<=36,1],[v=>v<=38,0],[v=>v<=39,1],[()=>true,2]]);
 const parts=[["Fréquence respiratoire",fr],["Saturation",sp],["Oxygène",ox],["Pression systolique",pas],["Pouls",fc],["Conscience",cs],["Température",t]];
 return {tot:fr+sp+ox+pas+fc+cs+t,parts,three:parts.some(p=>p[1]===3)};
}
function scoreBlock(id){
 const s=state.sc||(state.sc={}),v=s[id]||(s[id]={});
 const sel=(k,l,opts)=>otField(`sc-${id}-${k}`,l,`<select id="sc-${id}-${k}" data-ot="sc.${id}.${k}"><option value="">Choisir…</option>${opts.map(([n,t])=>`<option value="${n}" ${String(v[k])===String(n)?"selected":""}>${n} · ${t}</option>`).join("")}</select>`);
 const inp=(k,l,u,ph)=>otField(`sc-${id}-${k}`,l,`<span class="cx-in"><input id="sc-${id}-${k}" data-ot="sc.${id}.${k}" inputmode="decimal" value="${esc(v[k]||"")}" placeholder="${ph||""}" autocomplete="off">${u?`<em>${u}</em>`:""}</span>`);
 if(id==="gcs")return GCS.map(([k,l,o])=>sel(k,l,o)).join("");
 if(id==="braden")return BRADEN.map(([k,l,o])=>sel(k,l,o)).join("");
 if(id==="algo")return ALGO.map(([l,d],i)=>`<label class="chk"><input type="checkbox" data-ot="sc.algo.i${i}" ${v["i"+i]?"checked":""}><span><b>${l}</b><small class="ot-hint">${d}</small></span></label>`).join("");
 if(id==="news")return `<div class="cd-row">${inp("fr","Fréquence respiratoire","/min","16")}${inp("sp","Saturation SpO₂","%","96")}</div>
  <div class="cd-row">${otField("sc-news-o2","Oxygène",`<select id="sc-news-o2" data-ot="sc.news.o2"><option value="non" ${v.o2!=="oui"?"selected":""}>Air ambiant</option><option value="oui" ${v.o2==="oui"?"selected":""}>Sous oxygène</option></select>`)}${otField("sc-news-ech","Échelle de saturation",`<select id="sc-news-ech" data-ot="sc.news.ech"><option value="1" ${v.ech!=="2"?"selected":""}>Échelle 1</option><option value="2" ${v.ech==="2"?"selected":""}>Échelle 2 (88-92 %)</option></select>`)}</div>
  <div class="cd-row">${inp("pas","Pression systolique","mmHg","120")}${inp("fc","Pouls","/min","80")}</div>
  <div class="cd-row">${otField("sc-news-cs","Conscience",`<select id="sc-news-cs" data-ot="sc.news.cs"><option value="">Choisir…</option><option value="A" ${v.cs==="A"?"selected":""}>Alerte</option><option value="C" ${v.cs==="C"?"selected":""}>Confusion nouvelle</option><option value="V" ${v.cs==="V"?"selected":""}>Réagit à la voix</option><option value="P" ${v.cs==="P"?"selected":""}>Réagit à la douleur</option><option value="U" ${v.cs==="U"?"selected":""}>Ne réagit pas</option></select>`)}${inp("t","Température","°C","37")}</div>`;
 if(id==="imc")return `<div class="cd-row">${inp("kg","Poids","kg","65")}${inp("cm","Taille","cm","168")}</div><label class="chk"><input type="checkbox" data-ot="sc.imc.age" ${v.age?"checked":""}><span>Personne de 70 ans ou plus</span></label>`;
 if(id==="cg")return `<div class="cd-row">${inp("age","Âge","ans","75")}${inp("kg","Poids","kg","60")}</div><div class="cd-row">${inp("cr","Créatininémie","µmol/L","90")}${otField("sc-cg-sx","Sexe",`<select id="sc-cg-sx" data-ot="sc.cg.sx"><option value="F" ${v.sx!=="H"?"selected":""}>Femme</option><option value="H" ${v.sx==="H"?"selected":""}>Homme</option></select>`)}</div>`;
 return "";
}
function scoreRes(id){
 const v=(state.sc&&state.sc[id])||{},lv=(c,t)=>`<div class="sc-res ${c}">${t}</div>`;
 if(id==="gcs"){if(!v.y||!v.v||!v.m)return lv("","Choisissez les trois réponses.");const t=+v.y + +v.v + +v.m;
  return lv(t<=8?"bad":t<=12?"mid":t<15?"mid":"ok",`<b class="sc-tot">${t}<small>/15</small></b><span>Y${v.y} V${v.v} M${v.m} · ${t===15?"Conscience normale":t>=13?"Trouble léger de la conscience":t>=9?"Trouble modéré : surveillance rapprochée, alerter":"Coma : protéger les voies aériennes (PLS si la personne respire), appel médical urgent"}</span>`);}
 if(id==="braden"){const ks=BRADEN.map(b=>b[0]);if(ks.some(k=>!v[k]))return lv("","Choisissez les six items.");const t=ks.reduce((s,k)=>s+ +v[k],0);
  return lv(t<=12?"bad":t<=18?"mid":"ok",`<b class="sc-tot">${t}<small>/23</small></b><span>${t<=9?"Risque très élevé":t<=12?"Risque élevé":t<=14?"Risque modéré":t<=18?"Risque faible":"Pas de risque particulier"} d'escarre${t<=18?" : mettre en place la prévention (changements de position, support adapté, nutrition, soins de peau) et réévaluer":"; réévaluer à chaque changement d'état"}.</span>`);}
 if(id==="algo"){const t=ALGO.filter((_,i)=>v["i"+i]).length;
  return lv(t>=2?"bad":"ok",`<b class="sc-tot">${t}<small>/5</small></b><span>${t>=2?"Douleur probable : traiter (antalgique selon prescription ou protocole) et réévaluer.":"Score inférieur à 2 : douleur peu probable, mais rester attentif et réévaluer."}</span>`);}
 if(id==="news"){const x={fr:num(v.fr),sp:num(v.sp),pas:num(v.pas),fc:num(v.fc),t:num(v.t),cs:v.cs,o2:v.o2||"non",ech:v.ech||"1"};
  if([x.fr,x.sp,x.pas,x.fc,x.t].some(n=>!Number.isFinite(n))||!x.cs)return lv("","Renseignez tous les paramètres.");
  const r=news2(x),t=r.tot;
  const txt=t>=7?"Score élevé : urgence, appel immédiat du médecin ou de l'équipe d'urgence, surveillance continue.":t>=5?"Score moyen : avis médical urgent, surveillance au moins toutes les heures.":r.three?"Un paramètre à 3 : avis médical rapide, surveillance au moins toutes les heures.":t>=1?"Score faible : informer l'infirmier responsable, surveillance au moins toutes les 4 à 6 heures.":"Surveillance habituelle (au moins toutes les 12 heures).";
  return lv(t>=5||r.three?"bad":t>=1?"mid":"ok",`<b class="sc-tot">${t}</b><span>${txt}</span><ul class="clean sc-parts">${r.parts.map(([l,p])=>`<li><span>${l}</span><b>${p}</b></li>`).join("")}</ul>`);}
 if(id==="imc"){const kg=num(v.kg),cm=num(v.cm);if(!(kg>0)||!(cm>0))return lv("","Renseignez le poids et la taille.");const m=cm/100,i=kg/(m*m);
  let t,c="ok";if(v.age){t=i<20?"Inférieur à 20 : critère de dénutrition sévère après 70 ans":i<22?"Inférieur à 22 : critère de dénutrition après 70 ans":i<30?"Corpulence habituelle pour l'âge":"Obésité";c=i<22?"bad":i>=30?"mid":"ok";}
  else{t=i<18.5?"Maigreur (critère de dénutrition si moins de 18,5)":i<25?"Corpulence normale":i<30?"Surpoids":i<35?"Obésité modérée":i<40?"Obésité sévère":"Obésité massive";c=i<18.5||i>=35?"bad":i>=25?"mid":"ok";}
  return lv(c,`<b class="sc-tot">${fmtN(i,1)}<small> kg/m²</small></b><span>${t}. Calcul : ${fmtN(kg)} ÷ (${fmtN(m,2)} × ${fmtN(m,2)}).</span>`);}
 if(id==="cg"){const a=num(v.age),kg=num(v.kg),cr=num(v.cr);if(!(a>0)||!(kg>0)||!(cr>0))return lv("","Renseignez l'âge, le poids et la créatininémie.");
  const k=v.sx==="H"?1.23:1.04,c=(140-a)*kg*k/cr;
  return lv(c<30?"bad":c<60?"mid":"ok",`<b class="sc-tot">${fmtN(c,0)}<small> mL/min</small></b><span>${c<30?"Insuffisance rénale sévère":c<60?"Insuffisance rénale modérée":c<90?"Fonction rénale légèrement diminuée":"Fonction rénale normale"} (estimation de Cockcroft et Gault). Calcul : (140 − ${fmtN(a)}) × ${fmtN(kg)} × ${k===1.23?"1,23":"1,04"} ÷ ${fmtN(cr)}. Le laboratoire rend aussi le DFG (CKD-EPI) ; les adaptations de doses suivent le RCP du médicament.</span>`);}
 return "";
}
const SC_LIST=[["gcs","Glasgow"],["news","NEWS2"],["braden","Braden"],["algo","Algoplus"],["imc","IMC"],["cg","Clairance"]];
const SC_INFO={gcs:"Évalue la conscience : yeux (1-4), verbal (1-5), moteur (1-6). Toujours noter le détail, par exemple Y3 V4 M6.",news:"Score d'alerte précoce de la dégradation chez l'adulte (hors grossesse). Utilisez l'échelle 2 seulement si une cible de saturation de 88-92 % est prescrite.",braden:"Évalue le risque d'escarre, à l'admission puis à chaque changement d'état. Plus le score est bas, plus le risque est élevé.",algo:"Échelle comportementale de la douleur aiguë de la personne âgée qui communique difficilement. Une case cochée par domaine présent.",imc:"Indice de masse corporelle = poids ÷ taille². Les seuils de dénutrition diffèrent après 70 ans.",cg:"Estimation de la clairance de la créatinine (Cockcroft et Gault), utilisée pour adapter certains médicaments."};
function otScores(){
 const cur=state.scSel||"gcs";
 return `<div class="chips wrapchips" role="group" aria-label="Score">${SC_LIST.map(([k,l])=>`<button type="button" class="chip" data-act="ot-sc" data-k="${k}" aria-pressed="${k===cur}">${l}</button>`).join("")}</div>
  <section class="cd-form sheet-body"><h2>${SC_LIST.find(x=>x[0]===cur)[1]}</h2><p class="muted">${SC_INFO[cur]}</p>${scoreBlock(cur)}<div id="sc-res" aria-live="polite">${scoreRes(cur)}</div><button type="button" class="link" data-act="ot-sc-clear">Effacer</button></section>
  ${qPedago("Les scores servent à s'entraîner à les calculer et à les interpréter. En stage, utilisez les grilles du service ; ils ne remplacent jamais le jugement clinique : au moindre doute, alertez.")}`;
}

/* =====================================================================
   6. CHRONO ET COMPTEUR
   ===================================================================== */
const CH={cnt:{dur:30,kind:"FR",run:false,taps:0,end:0,res:null},tim:{left:300000,total:300000,run:false,end:0},sw:{run:false,start:0,acc:0},iv:null};
const mmss=ms=>{ms=Math.max(0,ms);const s=Math.ceil(ms/1000);return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0");};
const swFmt=ms=>{const t=Math.floor(ms/100),d=t%10,s=Math.floor(t/10)%60,m=Math.floor(t/600);return String(m).padStart(2,"0")+":"+String(s).padStart(2,"0")+","+d;};
function chBeep(){try{navigator.vibrate&&navigator.vibrate([300,120,300]);}catch(e){}
 try{const A=window.AudioContext||window.webkitAudioContext;if(!A)return;const ac=new A();[0,.35,.7].forEach(t=>{const o=ac.createOscillator(),g=ac.createGain();o.frequency.value=880;o.connect(g);g.connect(ac.destination);g.gain.setValueAtTime(.0001,ac.currentTime+t);g.gain.exponentialRampToValueAtTime(.3,ac.currentTime+t+.02);g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+t+.25);o.start(ac.currentTime+t);o.stop(ac.currentTime+t+.3);});setTimeout(()=>ac.close&&ac.close(),1500);}catch(e){}}
function chTick(){
 const now=Date.now(),c=CH.cnt,tm=CH.tim,sw=CH.sw;let any=false;
 if(c.run){any=true;const left=c.end-now;const el=document.getElementById("cnt-left");if(el)el.textContent=Math.max(0,Math.ceil(left/1000))+" s";
  if(left<=0){c.run=false;c.res={taps:c.taps,dur:c.dur,kind:c.kind};haptic("MEDIUM");chBeep();if(chOnPage())render();}}
 if(tm.run){any=true;tm.left=tm.end-now;const el=document.getElementById("tim-show");if(el)el.textContent=mmss(tm.left);
  if(tm.left<=0){tm.run=false;tm.left=0;chBeep();toast("Minuteur terminé");if(chOnPage())render();}}
 if(sw.run){any=true;const el=document.getElementById("sw-show");if(el)el.textContent=swFmt(sw.acc+now-sw.start);}
 if(!any){clearInterval(CH.iv);CH.iv=null;}
}
const chOnPage=()=>{const r=route();return r.v==="outil"&&r.arg.split("/")[0]==="chrono";};
const chStart=()=>{if(!CH.iv)CH.iv=setInterval(chTick,100);};
const CNT_N={FR:["Fréquence respiratoire","respiration",[12,20],"Adulte : 12 à 20 par minute (nourrisson 30 à 40)"],FC:["Fréquence cardiaque","battement",[60,100],"Adulte : 60 à 100 par minute (nourrisson 100 à 150)"]};
function otChrono(){
 const c=CH.cnt,tm=CH.tim,sw=CH.sw,N=CNT_N[c.kind];
 let cres="";if(c.res){const pm=Math.round(c.res.taps*60/c.res.dur),NN=CNT_N[c.res.kind],ok=pm>=NN[2][0]&&pm<=NN[2][1];
  cres=`<div class="sc-res ${ok?"ok":"mid"}"><b class="sc-tot">${pm}<small> /min</small></b><span>${c.res.taps} ${NN[1]}${c.res.taps>1?"s":""} en ${c.res.dur} s × ${60/c.res.dur} · ${NN[3]}${ok?"":" : valeur en dehors des repères de l'adulte, à interpréter selon le contexte"}.</span></div>`;}
 return `<section class="sheet-body cnt"><h2>Compter une fréquence</h2>
   ${otSeg("ot-ch-kind",c.kind,[["FR","Respirations"],["FC","Pouls"]],"Que comptez-vous ?")}
   ${otSeg("ot-ch-dur",String(c.dur),[["15","15 s"],["30","30 s"],["60","60 s"]],"Durée du comptage")}
   <button type="button" class="cnt-btn${c.run?" run":""}" data-act="${c.run?"ot-ch-tap":"ot-ch-go"}" aria-live="polite">${c.run?`<span><b id="cnt-taps">${c.taps}</b><small>Touchez à chaque ${N[1]}</small><small id="cnt-left">${Math.ceil((c.end-Date.now())/1000)} s</small></span>`:`<span><b>Démarrer</b><small>puis touchez à chaque ${N[1]}</small></span>`}</button>
   ${c.run?`<button type="button" class="link" data-act="ot-ch-stop">Arrêter</button>`:""}${cres}
   <p class="ot-hint">Pour la fréquence respiratoire, comptez sans prévenir le patient (en gardant les doigts au poignet comme pour le pouls). Si le rythme est irrégulier, comptez sur 60 secondes.</p></section>
  <section class="sheet-body"><h2>Minuteur</h2><div class="big-time" id="tim-show" role="timer">${mmss(tm.left)}</div>
   <div class="chips wrapchips" role="group" aria-label="Durées">${[[.5,"30 s"],[1,"1 min"],[5,"5 min"],[15,"15 min"],[30,"30 min"],[60,"1 h"]].map(([m,l])=>`<button type="button" class="chip" data-act="ot-tim-set" data-k="${m}" aria-pressed="${tm.total===m*60000}">${l}</button>`).join("")}</div>
   <div class="ot-btns"><button type="button" class="btn" data-act="ot-tim-go">${tm.run?"Pause":tm.left<tm.total&&tm.left>0?"Reprendre":"Démarrer"}</button><button type="button" class="btn ghost" data-act="ot-tim-reset">Remettre à zéro</button></div>
   <p class="ot-hint">Exemples : 30 s de friction hydroalcoolique ; 15 min pour refroidir une brûlure ; 1 h de pose d'une crème anesthésiante. ${ntOn()&&ntCfg().tim?"Une notification vous prévient aussi si l'appli est en arrière-plan.":`Gardez l'appli ouverte pour l'alarme, ou <a href="#notifs">activez les notifications</a>.`}</p></section>
  <section class="sheet-body"><h2>Chronomètre</h2><div class="big-time" id="sw-show" role="timer">${swFmt(sw.acc+(sw.run?Date.now()-sw.start:0))}</div>
   <div class="ot-btns"><button type="button" class="btn" data-act="ot-sw-go">${sw.run?"Pause":"Démarrer"}</button><button type="button" class="btn ghost" data-act="ot-sw-reset">Remettre à zéro</button></div></section>`;
}

/* =====================================================================
   7. TRANSMISSIONS
   ===================================================================== */
const TX_F={dar:[["cible","Cible","Le sujet de préoccupation : douleur, anxiété, chute, hyperthermie…"],["d","Données","Ce que vous observez, mesurez et ce que dit le patient (entre guillemets)"],["a","Actions","Ce qui a été fait, par qui, à quelle heure"],["r","Résultats","L'effet des actions, évalué (souvent à l'équipe suivante)"]],
 saed:[["s","Situation","Qui vous êtes, quel patient, quel problème maintenant"],["a","Antécédents","Contexte utile : âge, motif d'hospitalisation, intervention, traitements, allergies"],["e","Évaluation","Ce que vous observez et mesurez, et ce que vous en pensez"],["dm","Demande","Ce que vous attendez : venir voir le patient, une prescription, dans quel délai"]]};
const TX_CIBLES=["Douleur","Anxiété","Hyperthermie","Chute","Refus de soin","Hypoglycémie","Dyspnée","Constipation","Nausées","Plaie","Agitation","Sortie"];
const txd=()=>Object.assign({mode:"dar",dar:{},saed:{}},store.get("txd",{}));
function txText(T){
 const m=T.mode,v=T[m]||{},L=TX_F[m];
 if(m==="dar")return `${v.cible?"Cible : "+v.cible:"Cible : …"}\nD : ${v.d||"…"}\nA : ${v.a||"…"}\nR : ${v.r||"…"}`;
 return L.map(([k,l])=>`${l[0]} (${l}) : ${v[k]||"…"}`).join("\n");
}
function otTransmissions(){
 const T=txd(),m=T.mode,v=T[m]||{};
 return `${otSeg("ot-tx-mode",m,[["dar","Transmission ciblée (DAR)"],["saed","Alerte SAED"]],"Type")}
  <section class="cd-form sheet-body">${m==="dar"?`<div class="chips wrapchips" role="group" aria-label="Cibles fréquentes">${TX_CIBLES.map(c=>`<button type="button" class="chip" data-act="ot-tx-cible" data-k="${c}">${c}</button>`).join("")}</div>`:""}
   ${TX_F[m].map(([k,l,ph])=>otField(`tx-${k}`,l,k==="cible"?`<input id="tx-${k}" data-ot="tx.${k}" value="${esc(v[k]||"")}" placeholder="${esc(ph)}" maxlength="80">`:`<textarea id="tx-${k}" data-ot="tx.${k}" rows="3" placeholder="${esc(ph)}">${esc(v[k]||"")}</textarea>`)).join("")}
   <div class="stack-sm"><span class="ot-hint">Aperçu</span><pre class="eq-box tx-prev" id="tx-prev">${esc(txText(T))}</pre></div>
   <div class="ot-btns"><button type="button" class="btn" data-act="ot-tx-copy">${OT_IC.copy}Copier</button><button type="button" class="btn ghost" data-act="ot-tx-clear">Effacer</button></div></section>
  <div class="callout">${m==="dar"?"Écrivez des faits datés et précis, les propos du patient entre guillemets, sans jugement. Le résultat s'évalue souvent plus tard : notez l'heure.":"Avant d'appeler : ayez le dossier sous les yeux, les dernières constantes et les traitements. Après l'appel, reformulez la consigne et tracez-la."} N'utilisez que les initiales du patient.</div>
  <a class="list" href="#cours/transmissions"><span class="li"><span class="ic tb-ic" style="--c:#87591A">${OT_IC.transmissions}</span><span><span class="t">Cours : les transmissions et le dossier de soins</span><span class="s">Règles d'écriture, relève, continuité</span></span>${chev}</span></a>`;
}

/* =====================================================================
   8. REPÈRES ET NORMES
   ===================================================================== */
const RP=[
 ["Constantes de l'adulte",[["Fréquence cardiaque","60 – 100 /min"],["Pression artérielle","≈ 120/80 mmHg ; HTA ≥ 140/90 ; hypotension si systolique < 90"],["Fréquence respiratoire","12 – 20 /min"],["Saturation SpO₂","≥ 95 % (88 – 92 % si cible prescrite chez l'insuffisant respiratoire)"],["Température","36,5 – 37,5 °C ; fièvre ≥ 38 °C"],["Glycémie capillaire à jeun","0,70 – 1,10 g/L ; hypoglycémie < 0,70 g/L"],["Diurèse","≥ 0,5 mL/kg/h, environ 1 à 1,5 L par 24 h"],["Temps de recoloration cutanée","< 3 secondes"],["Score de Glasgow","15 (conscience normale) ; ≤ 8 = coma"]]],
 ["Enfant",[["Fréquence cardiaque","nouveau-né 120 – 160 ; nourrisson 100 – 150 ; enfant 70 – 120 /min"],["Fréquence respiratoire","nouveau-né 40 – 60 ; nourrisson 30 – 40 ; enfant 20 – 30 /min"],["Poids","≈ 3,3 kg à la naissance, doublé vers 5 mois, triplé à 1 an"],["Besoins hydriques","≈ 150 mL/kg/j avant 6 mois ; puis 100 mL/kg pour les 10 premiers kg, 50 mL/kg pour les 10 suivants, 20 mL/kg au-delà"],["Fièvre","≥ 38 °C ; avant 3 mois = consultation urgente"]]],
 ["Hématologie (NFS)",[["Hémoglobine","femme 12 – 16 g/dL ; homme 13 – 17 g/dL"],["Hématocrite","femme ≈ 37 – 47 % ; homme ≈ 40 – 52 %"],["Globules blancs","4 – 10 G/L"],["Polynucléaires neutrophiles","1,5 – 7 G/L ; < 0,5 G/L = neutropénie sévère"],["Plaquettes","150 – 400 G/L"]]],
 ["Biochimie",[["Sodium (natrémie)","135 – 145 mmol/L"],["Potassium (kaliémie)","3,5 – 5 mmol/L"],["Chlore","98 – 107 mmol/L"],["Calcium","2,20 – 2,60 mmol/L"],["Créatinine","femme ≈ 45 – 90 ; homme ≈ 60 – 110 µmol/L"],["Urée","2,5 – 7,5 mmol/L"],["CRP","< 5 mg/L"],["Albumine","35 – 50 g/L"],["Protides totaux","60 – 80 g/L"],["HbA1c","< 6 % sans diabète ; objectif souvent ≤ 7 % chez le diabétique"],["Lactates","< 2 mmol/L"]]],
 ["Hémostase",[["TP (taux de prothrombine)","70 – 100 %"],["INR","≈ 1 sans traitement ; 2 – 3 sous AVK (2,5 – 3,5 pour certaines valves mécaniques)"],["TCA (ratio malade/témoin)","< 1,2"],["Fibrinogène","2 – 4 g/L"]]],
 ["Gaz du sang artériel",[["pH","7,38 – 7,42 (acidose < 7,35 ; alcalose > 7,45)"],["PaO₂","80 – 100 mmHg"],["PaCO₂","35 – 45 mmHg"],["Bicarbonates (HCO₃⁻)","22 – 26 mmol/L"],["SaO₂","95 – 100 %"]]],
 ["Conversions utiles",[["Masses","1 g = 1 000 mg ; 1 mg = 1 000 µg"],["Volumes","1 L = 1 000 mL ; 1 mL ≈ 20 gouttes (perfuseur standard)"],["Pourcentage","x % = x g pour 100 mL (G5 % = 5 g de glucose pour 100 mL)"],["Glycémie","g/L × 5,55 = mmol/L"],["Cuillères","café ≈ 5 mL ; soupe ≈ 15 mL"],["Paquets-années","nombre de paquets par jour × nombre d'années de tabagisme"]]]
];
function rpHTML(q){
 const n=s=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),Q=n(q||"");
 const blocks=RP.map(([h,rows])=>{const r=Q?rows.filter(([a,b])=>n(a+" "+b+" "+h).includes(Q)):rows;return r.length?`<section class="stack-sm"><h2 class="rp-h">${esc(h)}</h2><div class="list rp">${r.map(([a,b])=>`<div class="rp-r"><span>${esc(a)}</span><b>${esc(b)}</b></div>`).join("")}</div></section>`:"";}).join("");
 return blocks||`<p class="muted">Aucun repère ne correspond à « ${esc(q)} ».</p>`;
}
function otReperes(){
 return `<div class="search-field"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><input id="rp-q" type="search" data-ot="rp" placeholder="Rechercher : potassium, INR, enfant…" value="${esc(state.rpq||"")}" autocomplete="off" aria-label="Rechercher un repère"></div>
  <div id="rp-out" class="stack-lg">${rpHTML(state.rpq)}</div>
  <p class="disclaimer">Valeurs usuelles indicatives chez l'adulte sauf mention contraire. Les normes varient selon les laboratoires, l'âge et le contexte : référez-vous au compte rendu et au médecin.</p>`;
}

/* =====================================================================
   9. BLOC-NOTES
   ===================================================================== */
const notesL=()=>store.get("notes",[]);
function otNotes(){
 const L=notesL().sort((a,b)=>b.u-a.u),cur=state.noteId&&L.find(x=>x.id===state.noteId);
 if(cur)return `<section class="cd-form sheet-body"><div class="section-title"><button type="button" class="link" data-act="ot-note-close">${IC.back.replace("<svg",'<svg style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2.2;vertical-align:-2px"')} Toutes les notes</button><span class="muted" id="note-saved">Enregistré</span></div>
   ${otField("note-t","Titre",`<input id="note-t" data-ot="note.t" value="${esc(cur.t||"")}" maxlength="80" placeholder="Ex. Questions pour ma tutrice">`)}
   ${otField("note-x","Note",`<textarea id="note-x" data-ot="note.x" rows="12" placeholder="Écrivez ici…">${esc(cur.x||"")}</textarea>`)}
   <button type="button" class="link danger" data-act="ot-note-del" data-id="${esc(cur.id)}">Supprimer cette note</button></section>`;
 return `<button type="button" class="btn block" data-act="ot-note-new">${IC.plus}Nouvelle note</button>
  ${L.length?`<div class="list">${L.map(x=>`<button type="button" class="li" data-act="ot-note-open" data-id="${esc(x.id)}"><span class="ic tb-ic" style="--c:#5C6B7A">${OT_IC.notes}</span><span><span class="t">${esc(x.t||"Sans titre")}</span><span class="s">${esc((x.x||"").slice(0,90)||"Note vide")} · ${esc(new Date(x.u).toLocaleDateString("fr-FR",{day:"numeric",month:"short"}))}</span></span>${chev}</button>`).join("")}</div>`:`<p class="muted">Aucune note pour l'instant.</p>`}
  <p class="disclaimer">Les notes restent sur cet appareil et sont incluses dans la sauvegarde (Réglages). Aucune donnée permettant d'identifier un patient.</p>`;
}

const OT_VIEWS={projet:a=>otProjet(a),urgences:otUrgences,planning:otPlanning,pansement:otPansement,tfe:otTfe,calculs:otCalculs,scores:otScores,chrono:otChrono,transmissions:otTransmissions,reperes:otReperes,notes:otNotes};

/* ---------- Événements ---------- */
function outilAct(b,a){
 const k=b.dataset.k,id=b.dataset.id;
 if(a==="ot-copy"){otCopy(k||"");return;}
 if(a==="ot-af-quiz"){launchQuiz(QUIZ.map((q,i)=>q.af?i:-1).filter(i=>i>=0),"Quiz urgences AFGSU");return;}
 /* Planning */
 if(a==="ot-ag-week"){state.agWeek=k==="0"?mondayOf(todayISO()):addDays(state.agWeek||mondayOf(todayISO()),7*(+k));render();}
 else if(a==="ot-ag-new"){state.agForm=true;state.agGen=false;state.agDay=k||todayISO();state.agTy=b.dataset.ty||null;render();setTimeout(()=>{const i=document.getElementById("ag-t");if(i){i.focus({preventScroll:true});i.scrollIntoView({block:"center"});}},40);}
 else if(a==="ot-ag-cancel"){state.agForm=false;state.agTy=null;render();}
 else if(a==="ot-ag-gen"){state.agGen=!state.agGen;state.agForm=false;render();if(state.agGen)setTimeout(()=>{const f=document.getElementById("ot-ag-genf");f&&f.scrollIntoView({block:"start"});},40);}
 else if(a==="ot-ag-genex"){const d=document.getElementById("gen-d"),n=document.getElementById("gen-n");if(d)d.value=k;if(n)n.value=b.dataset.n||"";}
 else if(a==="ot-ag-ue"){const t=document.getElementById("gen-t");if(t&&!t.value.split("\n").includes(k)){t.value=(t.value.replace(/\s+$/,"")?t.value.replace(/\s+$/,"")+"\n":"")+k;}haptic();}
 else if(a==="ot-ag-done"){const L=agenda(),e=L.find(x=>x.id===id);if(e){e.done=!e.done;agSave(L);haptic();if(e.done&&e.ty==="Révision")toast("Séance faite");else if(e.done&&e.ty==="À faire")toast("Tâche faite");render();}}
 else if(a==="ot-ag-del"){agSave(agenda().filter(x=>x.id!==id));haptic();toast("Événement supprimé");render();}
 else if(a==="ot-ag-plandel"){agSave(agenda().filter(x=>x.gen!==id));store.set("agendaPlans",agPlans().filter(p=>p.id!==id));toast("Plan supprimé");render();}
 else if(a==="ot-ag-ics")agICS();
 /* Pansement */
 else if(a==="ot-pa"){const p=state.pa||(state.pa={});p[k]=p[k]===b.dataset.v&&["type","coul","exs"].includes(k)?undefined:b.dataset.v;haptic();const y=window.scrollY;render();window.scrollTo(0,y);}
 else if(a==="ot-pa-flag"){const p=state.pa||(state.pa={});p[k]=p[k]==="oui"?"non":"oui";haptic();const y=window.scrollY;render();window.scrollTo(0,y);}
 else if(a==="ot-pa-reset"){state.pa=null;render();}
 /* TFE */
 else if(a==="ot-tfe-step"){const T=tfe();T.steps[+b.dataset.i]=b.checked;tfeSave(T);haptic();const y=window.scrollY;render();window.scrollTo(0,y);}
 else if(a==="ot-apa-type"){state.apa=Object.assign(state.apa||{},{type:k});const y=window.scrollY;render();window.scrollTo(0,y);}
 else if(a==="ot-apa-add"){const r=state.apa||{};if(!(r.tit||"").trim()){toast("Indiquez au moins le titre");return;}
  const T=tfe();T.refs.push({id:otId(),h:apaFormat(r)});tfeSave(T);state.apa={type:r.type};haptic();toast("Référence ajoutée");const y=window.scrollY;render();window.scrollTo(0,y);}
 else if(a==="ot-apa-del"){const T=tfe();T.refs=T.refs.filter(x=>x.id!==id);tfeSave(T);const y=window.scrollY;render();window.scrollTo(0,y);}
 else if(a==="ot-apa-copy"){const T=tfe();otCopy([...T.refs].map(r=>stripTags(r.h).replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"')).sort((x,y)=>x.localeCompare(y,"fr")).join("\n"));}
 else if(a==="ot-tfe-plan"){const T=tfe(),today=todayISO();if(!T.rendu)return;const jr=Math.round((parseD(T.rendu)-parseD(today))/864e5);if(jr<=0)return;
  const ev=TFE_MILES.map(([p,l])=>({id:otId(),d:addDays(today,Math.round(jr*p)),h:"",t:"TFE · "+l,ty:"TFE",gen:"tfe"}));
  if(T.sout&&T.sout>today)ev.push({id:otId(),d:T.sout,h:"",t:"TFE · Soutenance",ty:"TFE",gen:"tfe"});
  agSave([...agenda().filter(x=>x.gen!=="tfe"),...ev]);haptic();toast("Échéances ajoutées au planning");}
 /* Calculs */
 else if(a==="ot-cx"){state.cxSel=k;render();}
 else if(a==="ot-cx-clear"){const c=state.cxSel||"gtt";if(state.cx)state.cx[c]={};render();}
 /* Scores */
 else if(a==="ot-sc"){state.scSel=k;render();}
 else if(a==="ot-sc-clear"){const c=state.scSel||"gcs";if(state.sc)state.sc[c]={};render();}
 /* Chrono */
 else if(a==="ot-ch-kind"){if(!CH.cnt.run){CH.cnt.kind=k;CH.cnt.res=null;render();}}
 else if(a==="ot-ch-dur"){if(!CH.cnt.run){CH.cnt.dur=+k;CH.cnt.res=null;render();}}
 else if(a==="ot-ch-go"){const c=CH.cnt;c.run=true;c.taps=0;c.res=null;c.end=Date.now()+c.dur*1000;haptic("MEDIUM");chStart();render();}
 else if(a==="ot-ch-tap"){const c=CH.cnt;if(!c.run)return;c.taps++;haptic();const el=document.getElementById("cnt-taps");if(el)el.textContent=c.taps;}
 else if(a==="ot-ch-stop"){CH.cnt.run=false;CH.cnt.res=null;render();}
 else if(a==="ot-tim-set"){const t=CH.tim;t.run=false;t.total=t.left=+k*60000;ntTimer(null);render();}
 else if(a==="ot-tim-go"){const t=CH.tim;if(t.run){t.run=false;t.left=t.end-Date.now();}else{if(t.left<=0)t.left=t.total;t.run=true;t.end=Date.now()+t.left;chStart();}ntTimer(t.run?t.end:null,t.total);haptic();render();}
 else if(a==="ot-tim-reset"){const t=CH.tim;t.run=false;t.left=t.total;ntTimer(null);render();}
 else if(a==="ot-sw-go"){const s=CH.sw;if(s.run){s.acc+=Date.now()-s.start;s.run=false;}else{s.start=Date.now();s.run=true;chStart();}haptic();render();}
 else if(a==="ot-sw-reset"){CH.sw={run:false,start:0,acc:0};render();}
 /* Transmissions */
 else if(a==="ot-tx-mode"){const T=txd();T.mode=k;store.set("txd",T);render();}
 else if(a==="ot-tx-cible"){const T=txd();T.dar.cible=k;store.set("txd",T);const i=document.getElementById("tx-cible");if(i)i.value=k;const p=document.getElementById("tx-prev");if(p)p.textContent=txText(T);haptic();}
 else if(a==="ot-tx-copy"){otCopy(txText(txd()));}
 else if(a==="ot-tx-clear"){const T=txd();T[T.mode]={};store.set("txd",T);render();}
 /* Notes */
 else if(a==="ot-note-new"){const n={id:otId(),t:"",x:"",u:Date.now()};store.set("notes",[n,...notesL()]);state.noteId=n.id;render();setTimeout(()=>{const i=document.getElementById("note-t");i&&i.focus();},40);}
 else if(a==="ot-note-open"){state.noteId=id;render();}
 else if(a==="ot-note-close"){const L=notesL().filter(x=>(x.t||"").trim()||(x.x||"").trim());store.set("notes",L);state.noteId=null;render();}
 else if(a==="ot-note-del"){if(!b.dataset.armed){b.dataset.armed="1";b.textContent="Toucher à nouveau pour supprimer";setTimeout(()=>{if(b.isConnected){delete b.dataset.armed;b.textContent="Supprimer cette note";}},4000);return;}
  store.set("notes",notesL().filter(x=>x.id!==id));state.noteId=null;haptic("MEDIUM");toast("Note supprimée");render();}
}
function outilInput(t){
 const p=t.dataset.ot.split("."),val=t.type==="checkbox"?t.checked:t.value;
 if(p[0]==="tfe"){const T=tfe();if(p[1]==="rendu"||p[1]==="sout"){T[p[1]]=val;tfeSave(T);if(t.type==="date"){const y=window.scrollY;render();window.scrollTo(0,y);}return;}
  T.s[p[1]]=val;tfeSave(T);if(p[1]==="qd"){const c=document.getElementById("qd-check");if(c)c.innerHTML=qdCheck(val);}
  const m=document.getElementById("tfe-saved");if(m){m.textContent="Enregistré ✓";clearTimeout(outilInput.t);outilInput.t=setTimeout(()=>{m.textContent="Enregistré sur cet appareil"},1400);}return;}
 if(p[0]==="eq"){const T=tfe();T.eq[+p[1]][p[2]]=val;tfeSave(T);const o=document.getElementById("eq-out");if(o)o.innerHTML=eqOut(eqBuild(T.eq,"fr"),eqBuild(T.eq,"en"));return;}
 if(p[0]==="apa"){const r=state.apa||(state.apa={type:"livre"});r[p[1]]=val;const o=document.getElementById("apa-prev");if(o)o.innerHTML=apaFormat(r)||"<span class='muted'>Aperçu de la référence</span>";return;}
 if(p[0]==="cx"){const c=state.cx||(state.cx={});(c[p[1]]||(c[p[1]]={}))[p[2]]=val;const o=document.getElementById("cx-res"),cx=CX.find(x=>x.id===p[1]);if(o&&cx)o.innerHTML=cxRes(cx);return;}
 if(p[0]==="sc"){const s=state.sc||(state.sc={});(s[p[1]]||(s[p[1]]={}))[p[2]]=val;const o=document.getElementById("sc-res");if(o)o.innerHTML=scoreRes(p[1]);return;}
 if(p[0]==="tx"){const T=txd();T[T.mode][p[1]]=val;store.set("txd",T);const o=document.getElementById("tx-prev");if(o)o.textContent=txText(T);return;}
 if(p[0]==="af"){const s=afStore();s[p[1]]=val;store.set("afgsu",s);if(p[1]==="date"){const y=window.scrollY;render();window.scrollTo(0,y);}return;}
 if(p[0]==="rp"){state.rpq=val;const o=document.getElementById("rp-out");if(o)o.innerHTML=rpHTML(val);return;}
 if(p[0]==="note"){const L=notesL(),n=L.find(x=>x.id===state.noteId);if(!n)return;n[p[1]]=val;n.u=Date.now();store.set("notes",L);
  const m=document.getElementById("note-saved");if(m){m.textContent="Enregistré ✓";clearTimeout(outilInput.n);outilInput.n=setTimeout(()=>{m.textContent="Enregistré"},1200);}return;}
}
function outilSubmit(f){if(f.id==="ot-ag-form")agAdd(f);else if(f.id==="ot-ag-genf")agGenerate();}
