/* Carnet IFSI — historique des stages : archivage du stage terminé (automatique quelques jours après la date de fin,
   ou à la demande), parcours de stage (semaines, types de stage) et consultation des stages archivés avec leur
   carnet de suivi. Chargé après carnet.js et avant app.js. */
const SH_GRACE=7;
const stagesHist=()=>store.get("stagesHist",[]);
const shSave=l=>store.set("stagesHist",l);
const SH_CARNET0=()=>({journal:[],soins:{},soinsPerso:[],obj:{},bilans:{mi:{},fin:{}},situations:[],questions:[],heures:[],svc:{},meds:[],lexique:[],comp:{},semaines:[]});
function shHasContent(){
 const s=stageInfo(),c=store.get("carnet",null);
 return !!(s.service||s.lieu||s.debut||s.objectifs||(c&&((c.journal||[]).length||Object.keys(c.soins||{}).length||(c.heures||[]).length||(c.situations||[]).length)));
}
/* Lit les données d'un stage archivé avec les fonctions du carnet (qui lisent le stage et le carnet courants). */
function shWith(rec,fn){const g=store.get;store.get=function(k,d){return k==="stage"?rec.stage:k==="carnet"?Object.assign(SH_CARNET0(),rec.carnet||{}):k==="check"?(rec.check||[]):g.call(store,k,d);};
 try{return fn();}finally{store.get=g;}}
function shArchive(auto){
 if(!shHasContent())return null;
 const s=Object.assign({},stageInfo());delete s.noAuto;
 const rec={id:Date.now().toString(36)+Math.random().toString(36).slice(2,5),archived:new Date().toISOString(),auto:!!auto,stage:s,carnet:store.get("carnet",{}),check:store.get("check",[])};
 shSave([rec,...stagesHist()]);
 try{["stage","check","carnet","sac"].forEach(x=>localStorage.removeItem("ifsi_"+x));}catch(e){}
 return rec;
}
function shAutoArchive(){
 const s=stageInfo();if(!s.fin||s.noAuto)return null;
 if(todayISO()>addDays(s.fin,SH_GRACE)&&shHasContent()){const r=shArchive(true);if(r)state.shJust=r.id;return r;}
 return null;
}
const shTitle=r=>r.stage.service||r.stage.lieu||"Stage sans nom";
const shDay=d=>parseD(d).toLocaleDateString("fr-FR",{day:"numeric",month:"short",year:"numeric"});
const shDates=r=>{const s=r.stage;return s.debut&&s.fin?`du ${shDay(s.debut)} au ${shDay(s.fin)}`:s.debut?`depuis le ${shDay(s.debut)}`:"";};
const shWeeks=r=>{const s=r.stage;if(!s.debut||!s.fin||s.fin<s.debut)return 0;return Math.round(((parseD(s.fin)-parseD(s.debut))/864e5+1)/7*2)/2;};
const fmtWeeks=w=>String(w).replace(".",",");
const shSorted=()=>stagesHist().slice().sort((a,b)=>((b.stage.debut||b.archived)>(a.stage.debut||a.archived)?1:-1));

/* ---------- Page Stages : parcours et liste ---------- */
function shParcours(){
 const L=shSorted(),weeks=L.reduce((n,r)=>n+shWeeks(r),0),types=STAGE_TYPES.map(t=>[t,L.filter(r=>r.stage.type===t).length]);
 const just=state.shJust&&L.find(r=>r.id===state.shJust),f=state.shForm||{};
 const opt=(arr,cur)=>arr.map(x=>`<option ${x===cur?"selected":""}>${esc(x)}</option>`).join("");
 return `<section class="stack-sm" id="sh-parcours"><div class="section-title"><h2>Mon parcours de stage</h2><span class="muted">${plural(L.length,"stage")} archivé${L.length>1?"s":""}</span></div>
  ${just?`<div class="callout sh-just"><b>Stage archivé.</b> « ${esc(shTitle(just))} » a été rangé dans votre historique avec son carnet de suivi. <a class="link" href="#stage-hist/${just.id}">Le consulter</a></div>`:""}
  ${L.length?`<div class="sheet-body sh-sum"><div class="cn-kpi"><span><b>${L.length}</b>stage${L.length>1?"s":""}</span><span><b>${fmtWeeks(weeks)}</b>semaine${weeks>1?"s":""}</span><span><b>${types.filter(t=>t[1]).length}/4</b>types de stage</span></div>
    <div class="sh-types">${types.map(([t,n])=>`<span class="sh-type${n?" ok":""}">${n?"✓":"○"} ${esc(t)}${n>1?` · ${n}`:""}</span>`).join("")}</div>
    <small class="ot-hint">Repère : le référentiel de 2009 prévoit 60 semaines de stage sur les trois ans, réparties dans les quatre types de stage.</small></div>
   <div class="list">${L.map(r=>`<a class="li" href="#stage-hist/${r.id}" style="--c:${CAT.stage.c}"><span class="bar"></span><span><span class="t">${esc(shTitle(r))}</span><span class="s">${[r.stage.sem,r.stage.type,shDates(r),shWeeks(r)?fmtWeeks(shWeeks(r))+" sem.":""].filter(Boolean).map(esc).join(" · ")}</span></span><span class="end">${chev}</span></a>`).join("")}</div>`
   :`<p class="muted">Vos stages terminés apparaîtront ici avec leur carnet de suivi. Un stage est archivé automatiquement ${SH_GRACE} jours après sa date de fin (le temps de finir vos bilans), ou dès que vous le décidez.</p>`}
  <details class="ot-det sh-add"${state.shAddOpen?" open":""}><summary>Ajouter un stage déjà réalisé</summary>
   <form id="sh-add-form" class="cd-form" autocomplete="off">
    <label for="sh-f-service">Service et établissement<input id="sh-f-service" maxlength="100" required placeholder="Ex. Pneumologie, CH de Lyon" value="${esc(f.service||"")}"></label>
    <div class="cd-row"><label for="sh-f-type">Type de stage<select id="sh-f-type"><option value="">Choisir</option>${opt(STAGE_TYPES,f.type)}</select></label><label for="sh-f-sem">Semestre<select id="sh-f-sem"><option value="">–</option>${opt(["S1","S2","S3","S4","S5","S6"],f.sem)}</select></label></div>
    <div class="cd-row"><label for="sh-f-debut">Début<input id="sh-f-debut" type="date" required value="${esc(f.debut||"")}"></label><label for="sh-f-fin">Fin<input id="sh-f-fin" type="date" required value="${esc(f.fin||"")}"></label></div>
    <label for="sh-f-tuteur">Tuteur ou tutrice<input id="sh-f-tuteur" maxlength="60" value="${esc(f.tuteur||"")}"></label>
    <label for="sh-f-notes">Ce que je retiens de ce stage<textarea id="sh-f-notes" rows="3" placeholder="Soins réalisés, points forts, axes d'amélioration…">${esc(f.notes||"")}</textarea></label>
    <button class="btn block" type="submit">${IC.plus}Ajouter à mon historique</button></form></details>
 </section>`;
}

/* ---------- Fiche d'un stage archivé ---------- */
function vStageHist(arg){
 const [id,sub]=(arg||"").split("/"),rec=stagesHist().find(r=>r.id===id);
 if(!rec)return `<div class="stack-lg">${backBtn("Stages")}<div class="empty">Ce stage n'existe plus dans l'historique.</div></div>`;
 if(sub==="carnet")return `<div class="stack-lg">${backBtn("Ce stage")}
  ${vh("Historique des stages","Carnet de suivi archivé",esc(shTitle(rec))+(shDates(rec)?" · "+esc(shDates(rec)):""))}
  <div class="btn-row"><button class="btn" data-act="sh-print" data-id="${rec.id}">${IC.sheet}Imprimer ce carnet</button></div>
  <div class="pdoc paper">${shWith(rec,()=>cnPrintDoc("rempli"))}</div></div>`;
 const s=rec.stage,c=Object.assign(SH_CARNET0(),rec.carnet||{}),S=shWith(rec,()=>cnStats(c)),objs=shWith(rec,()=>cnObjectifs());
 const rows=[["Lieu (guide)",s.lieu],["Type de stage",s.type],["Semestre",s.sem],["Dates",shDates(rec)],["Durée",shWeeks(rec)?fmtWeeks(shWeeks(rec))+" semaine"+(shWeeks(rec)>1?"s":""):""],["Horaires",s.horaires],["Tuteur ou tutrice",s.tuteur],["Cadre de santé",s.cadre],["Téléphone du service",s.tel],["Adresse",s.adresse]].filter(r=>r[1]);
 const bil=(k,t)=>{const b=c.bilans[k]||{},it=[["Points forts",b.forts],["Axes d'amélioration",b.ameliorer],[k==="mi"?"Objectifs pour la suite du stage":"Objectifs pour le prochain stage",b.suite],["Remarques du tuteur",b.tuteur]].filter(x=>x[1]);
  return it.length?`<section class="sheet-body sh-bil"><h3>${t}${b.date?` · ${esc(shDay(b.date))}`:""}</h3>${it.map(([l,v])=>`<div><span class="ot-hint">${l}</span><p>${esc(v).replace(/\n/g,"<br>")}</p></div>`).join("")}</section>`:"";};
 const comp=Object.entries(c.comp||{}).filter(([,v])=>v&&(v.fin||v.mi)&&(v.fin||v.mi)!=="–");
 const reopenLabel=shHasContent()?"Rouvrir comme stage actuel (le stage actuel sera archivé)":"Rouvrir comme stage actuel";
 return `<div class="stack-lg">${backBtn("Stages")}
  ${vh("Historique des stages",esc(shTitle(rec)),[s.sem,s.type,shDates(rec)].filter(Boolean).map(esc).join(" · ")||"Stage archivé")}
  ${rec.manual?"":`<div class="cn-kpi"><span><b>${S.jours}</b>jours notés</span><span><b>${S.soinsSeul}</b>soins seul·e</span><span><b>${S.atteints}/${S.objs}</b>objectifs</span><span><b>${Math.floor(S.minutes/60)} h</b>de stage</span></div>`}
  ${rows.length?`<section class="sheet-body"><h3>Infos du stage</h3><div class="fv-tbl">${rows.map(([a,b])=>`<div><span>${esc(a)}</span><span>${esc(b)}</span></div>`).join("")}</div></section>`:""}
  ${objs.length?`<section class="sheet-body"><h3>Objectifs de stage</h3><ul class="clean sh-objs">${objs.map(o=>{const st=(c.obj[cnHash(o)]||{}).statut||"todo";return `<li><span>${esc(o)}</span><span class="tag ${st==="ok"?"done":""}">${CN_STATUTS.find(x=>x[0]===st)[1]}</span></li>`;}).join("")}</ul></section>`:""}
  ${bil("fin","Bilan de fin de stage")}${bil("mi","Bilan de mi-stage")}
  ${comp.length?`<section class="sheet-body"><h3>Compétences auto-évaluées</h3><div class="fv-tbl">${comp.map(([k,v])=>`<div><span>${esc(COMP&&COMP[k]?"C"+k+" · "+COMP[k]:"Compétence "+k)}</span><span>${esc(v.fin||v.mi)}</span></div>`).join("")}</div></section>`:""}
  ${c.situations.length?`<section class="sheet-body"><h3>Situations notées · ${c.situations.length}</h3><ul class="clean pa-ul">${c.situations.map(x=>`<li>${esc(x.titre||"Situation sans titre")}${x.date?` <span class="muted">· ${esc(shDay(x.date))}</span>`:""}</li>`).join("")}</ul></section>`:""}
  ${s.notes?`<section class="sheet-body"><h3>Notes</h3><p>${esc(s.notes).replace(/\n/g,"<br>")}</p></section>`:""}
  <div class="stack-sm">${rec.manual?"":`<a class="btn block" href="#stage-hist/${rec.id}/carnet">${IC.sheet}Voir le carnet de suivi complet</a>
   <button class="btn ghost block" data-act="sh-print" data-id="${rec.id}">Imprimer ce carnet</button>`}
   <button class="btn ghost block" data-act="sh-reopen" data-id="${rec.id}">${reopenLabel}</button>
   <button class="link danger" data-act="sh-del" data-id="${rec.id}">Supprimer de l'historique</button></div>
  <p class="disclaimer">${rec.manual?"Ajouté":"Archivé"} le ${esc(new Date(rec.archived).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"}))}${rec.auto?" automatiquement":""}. L'historique est inclus dans la sauvegarde des Réglages.</p></div>`;
}

/* ---------- Actions ---------- */
function histAct(b,a){
 if(a.startsWith("sh-sac")){sacAct(b,a);return;}
 const id=b.dataset.id,rec=id&&stagesHist().find(r=>r.id===id);
 if(a==="sh-archive"){const r=shArchive(false);if(!r){toast("Aucun stage à archiver");return;}state.shJust=r.id;haptic("MEDIUM");toast("Stage archivé dans l'historique");render();
  setTimeout(()=>{const el=document.getElementById("sh-parcours");el&&el.scrollIntoView({block:"start"});},60);}
 else if(a==="sh-print"&&rec){shWith(rec,()=>cnPrint("rempli"));}
 else if(a==="sh-reopen"&&rec){
  if(shHasContent()&&!b.dataset.armed){b.dataset.armed="1";const t=b.textContent;b.textContent="Toucher à nouveau pour confirmer";setTimeout(()=>{if(b.isConnected){delete b.dataset.armed;b.textContent=t;}},4000);return;}
  if(shHasContent())shArchive(false);
  store.set("stage",Object.assign({},rec.stage,{noAuto:true}));store.set("carnet",rec.carnet||{});store.set("check",rec.check||[]);
  shSave(stagesHist().filter(r=>r.id!==id));state.shJust=null;haptic("MEDIUM");toast("Stage rouvert");location.replace("#stages");}
 else if(a==="sh-del"&&rec){
  if(!b.dataset.armed){b.dataset.armed="1";b.textContent="Toucher à nouveau pour supprimer définitivement";setTimeout(()=>{if(b.isConnected){delete b.dataset.armed;b.textContent="Supprimer de l'historique";}},4000);return;}
  shSave(stagesHist().filter(r=>r.id!==id));if(state.shJust===id)state.shJust=null;haptic("MEDIUM");toast("Stage supprimé de l'historique");location.replace("#stages");}
}
function histSubmit(f){
 const g=k=>(document.getElementById("sh-f-"+k)||{}).value||"",st={service:g("service").trim(),type:g("type"),sem:g("sem"),debut:g("debut"),fin:g("fin"),tuteur:g("tuteur").trim(),notes:g("notes").trim()};
 if(!st.service||!st.debut||!st.fin){toast("Indiquez le service et les dates");return;}
 if(st.fin<st.debut){toast("La date de fin est avant le début");return;}
 shSave([{id:Date.now().toString(36)+Math.random().toString(36).slice(2,5),archived:new Date().toISOString(),manual:true,stage:st,carnet:{},check:[]},...stagesHist()]);
 state.shForm=null;state.shAddOpen=false;haptic();toast("Stage ajouté à l'historique");render();
 setTimeout(()=>{const el=document.getElementById("sh-parcours");el&&el.scrollIntoView({block:"start"});},60);
}
/* Rappel, dans le formulaire du nouveau stage, des objectifs fixés au bilan de fin du stage précédent. */
function shLastGoals(){
 const r=shSorted().find(x=>x.carnet&&x.carnet.bilans&&x.carnet.bilans.fin&&(x.carnet.bilans.fin.suite||"").trim());
 return r?`<div class="callout sh-goals"><b>Objectifs fixés à la fin de votre stage précédent</b> (${esc(shTitle(r))}) :<br>${esc(r.carnet.bilans.fin.suite.trim()).replace(/\n/g,"<br>")}</div>`:"";
}

/* ---------- Mon sac de stage : check-list des affaires à préparer ---------- */
const SAC=[
 ["Tenue",["Tenues professionnelles (si elles ne sont pas fournies)","Chaussures fermées, lavables, antidérapantes","Élastiques ou pinces à cheveux","Chaussettes de rechange"]],
 ["Dans la poche",["Montre à trotteuse, accrochée à la tunique","Stylo 4 couleurs et stylo de secours","Petit carnet de poche","Badge ou carte d'étudiant","Petits ciseaux, stéthoscope (selon le service)"]],
 ["Documents",["Convention de stage signée","Portfolio et feuilles d'évaluation","Feuille de présence ou d'horaires","Objectifs de stage écrits","Carnet de vaccination à jour","Attestation AFGSU (si demandée)"]],
 ["Pratique",["Cadenas pour le casier","Repas, gourde et encas","Sac pour ramener la tenue","Trajet repéré (transports, parking)","Téléphone chargé"]],
 ["Avant de partir",["Bijoux, bagues et montre-bracelet retirés","Ongles courts, sans vernis","Réveil réglé la veille"]]];
const sacN=()=>SAC.reduce((n,[,l])=>n+l.length,0);
const sacDone=()=>store.get("sac",[]).filter(k=>SAC.some(([g,l],gi)=>l.some((_,i)=>k===gi+"-"+i)));
function sacSection(){
 const done=sacDone(),n=sacN(),k=done.length;
 return `<section class="stack-sm" id="sac"><div class="section-title"><h2>Mon sac de stage</h2><span class="muted" id="sac-n">${k} / ${n}</span></div>
  <div class="progress"><i id="sac-bar" style="width:${v1s(k/n*100)}%"></i></div>
  <details class="ot-det sac"${state.sacOpen?" open":""}><summary>Cocher les affaires à préparer</summary>
   ${SAC.map(([g,l],gi)=>`<h3 class="sac-g">${esc(g)}</h3><div class="list" style="padding:4px 14px">${l.map((it,i)=>{const key=gi+"-"+i;return `<label class="chk"><input type="checkbox" data-act="sh-sac" data-k="${key}" ${done.includes(key)?"checked":""}><span>${esc(it)}</span></label>`;}).join("")}</div>`).join("")}
   <div class="btn-row sac-btns"><button class="btn ghost" data-act="sh-sac-print">${IC.sheet}Imprimer la liste</button><button class="link" data-act="sh-sac-reset">Tout décocher</button></div></details>
  <a class="list" href="#fiche/preparer-stage"><span class="li"><span class="ic tb-ic" style="--c:#9A7A2E">${IC.sheet}</span><span><span class="t">Fiche : préparer son stage efficacement</span><span class="s">Calendrier, appel au service, affaires, objectifs, premier jour</span></span>${chev}</span></a></section>`;
}
const v1s=n=>Math.round(n*10)/10;
function sacAct(b,a){
 if(a==="sh-sac"){let d=sacDone();const k=b.dataset.k;d=b.checked?[...new Set([...d,k])]:d.filter(x=>x!==k);store.set("sac",d);haptic();state.sacOpen=true;
  const n=sacN(),el=document.getElementById("sac-n"),bar=document.getElementById("sac-bar");if(el)el.textContent=`${d.length} / ${n}`;if(bar)bar.style.width=v1s(d.length/n*100)+"%";
  if(d.length===n)toast("Sac prêt pour le stage");}
 else if(a==="sh-sac-reset"){if(!b.dataset.armed){b.dataset.armed="1";b.textContent="Toucher à nouveau pour tout décocher";setTimeout(()=>{if(b.isConnected){delete b.dataset.armed;b.textContent="Tout décocher";}},4000);return;}
  store.set("sac",[]);state.sacOpen=true;haptic();toast("Liste remise à zéro");render();}
 else if(a==="sh-sac-print"){const done=sacDone(),s=stageInfo();
  let doc=document.getElementById("print-doc");if(doc)doc.remove();doc=document.createElement("div");doc.id="print-doc";doc.className="print-doc sac-doc";
  doc.innerHTML=`<h1>Mon sac de stage</h1><p class="sac-sub">${esc(s.service||"Stage")}${s.debut?` · à partir du ${esc(parseD(s.debut).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"}))}`:""}</p>
   <div class="sac-cols">${SAC.map(([g,l],gi)=>`<section><h2>${esc(g)}</h2><ul>${l.map((it,i)=>`<li><i class="${done.includes(gi+"-"+i)?"on":""}"></i>${esc(it)}</li>`).join("")}</ul></section>`).join("")}</div>
   <p class="sac-f">Carnet IFSI · rien aux mains ni aux poignets, cheveux attachés, arriver 10 minutes avant.</p>`;
  document.body.appendChild(doc);document.body.classList.add("printing");
  const done2=()=>{document.body.classList.remove("printing");const d=document.getElementById("print-doc");d&&d.remove();};
  window.addEventListener("afterprint",done2,{once:true});
  setTimeout(()=>{try{window.print();}catch(e){toast("Impression indisponible ici");done2();}},60);}
}
