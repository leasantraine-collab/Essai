/* Carnet IFSI — feuilles de travail de stage : recueil de données, projet de soins, analyse de pratique, planification de la journée.
   Chaque feuille se remplit dans l'appli (plusieurs exemplaires) et s'imprime remplie ou vierge. Chargé après carnet.js et avant app.js. */
const HEND_AIDE=["FR, SpO₂, dyspnée, toux, oxygène, tabac","Appétit, régime, texture, poids, déglutition, hydratation","Urines, selles, continence, sonde, transit","Mobilité, aides techniques, risque de chute","Sommeil, somnifères, fatigue","Autonomie pour l'habillage","Température, frissons","Toilette, état cutané, plaies, risque d'escarre","Douleur, conscience, orientation, allergies","Langue, audition, vision, émotions, relations","Religion, valeurs, souhaits","Rôle social, travail, estime de soi","Loisirs, activités possibles","Connaissance de la maladie et du traitement, besoins éducatifs"];
const SHEETS={
 recueil:{titre:"Recueil de données",desc:"Toutes les informations utiles sur un patient, organisées selon les 14 besoins de Virginia Henderson.",guide:"guide-recueil",tk:["chambre","initiales"],sections:[
  {h:"Identification",f:[{k:"chambre",l:"Chambre",t:"text",half:1},{k:"initiales",l:"Initiales",t:"text",half:1},{k:"age",l:"Âge",t:"text",half:1},{k:"sexe",l:"Sexe",t:"select",o:["","F","M","Autre"],half:1},{k:"entree",l:"Date d'entrée",t:"date",half:1},{k:"date",l:"Date du recueil",t:"date",half:1},{k:"sources",l:"Sources des données",t:"text",ph:"Patient, dossier, famille, équipe, transmissions"}]},
  {h:"Motif et histoire",f:[{k:"motif",l:"Motif d'hospitalisation",t:"textarea",r:2},{k:"diag",l:"Diagnostic médical",t:"text"},{k:"histoire",l:"Histoire de la maladie actuelle",t:"textarea"}]},
  {h:"Antécédents et traitements",f:[{k:"atcdm",l:"Antécédents médicaux",t:"textarea",r:2},{k:"atcdc",l:"Antécédents chirurgicaux",t:"textarea",r:2},{k:"allergies",l:"Allergies",t:"text"},{k:"ttth",l:"Traitement habituel",t:"textarea",r:2}]},
  {h:"Mode de vie",f:[{k:"entourage",l:"Entourage, personne de confiance, personne à prévenir",t:"textarea",r:2},{k:"domicile",l:"Lieu de vie, aides en place, accessibilité",t:"textarea",r:2},{k:"profession",l:"Profession, activités",t:"text"},{k:"habitudes",l:"Habitudes de vie (tabac, alcool, activité physique)",t:"text"}]},
  {h:"Les 14 besoins fondamentaux (V. Henderson)",f:HENDERSON.map((b,i)=>({k:"b"+(i+1),l:(i+1)+". "+b,t:"textarea",r:2,ph:HEND_AIDE[i]}))},
  {h:"Paramètres, examens, traitements",f:[{k:"constantes",l:"Constantes à l'entrée (TA, FC, FR, SpO₂, T°, douleur, poids, taille)",t:"textarea",r:2},{k:"examens",l:"Examens et résultats importants",t:"textarea",r:2},{k:"tttc",l:"Traitements en cours",t:"textarea",r:3}]},
  {h:"Synthèse",f:[{k:"ressources",l:"Ressources et capacités du patient",t:"textarea",r:2},{k:"problemes",l:"Problèmes identifiés (besoins perturbés, risques)",t:"textarea",r:3},{k:"attentes",l:"Attentes et projet du patient",t:"textarea",r:2}]}]},
 projet:{titre:"Projet de soins",desc:"Problèmes, objectifs, actions et évaluation pour un patient, construits à partir du recueil.",guide:"guide-projet",tk:["chambre","initiales"],sections:[
  {h:"Patient",f:[{k:"chambre",l:"Chambre",t:"text",half:1},{k:"initiales",l:"Initiales",t:"text",half:1},{k:"date",l:"Date",t:"date",half:1},{k:"age",l:"Âge",t:"text",half:1},{k:"contexte",l:"Synthèse de la situation (qui, pourquoi, ce qui compte)",t:"textarea",r:3}]},
  {h:"Problèmes, objectifs, actions, évaluation",g:{k:"pb",label:"Problème",add:"Ajouter un problème",vide:3,f:[{k:"type",l:"Type de problème",t:"select",o:["Diagnostic infirmier réel","Diagnostic infirmier de risque","Problème en collaboration"]},{k:"probleme",l:"Problème formulé (problème lié à… se manifestant par…)",t:"textarea",r:2},{k:"objectif",l:"Objectif (Le patient… mesurable, daté)",t:"textarea",r:2},{k:"actions",l:"Actions infirmières (rôle propre et sur prescription, horaires)",t:"textarea",r:4},{k:"evaluation",l:"Évaluation (date, résultat, réajustement)",t:"textarea",r:2}]}},
  {h:"Projet de vie et sortie",f:[{k:"vie",l:"Projet de vie, souhaits du patient",t:"textarea",r:2},{k:"sortie",l:"Préparation de la sortie (aides, éducation, liens avec la ville)",t:"textarea",r:2}]}]},
 analyse:{titre:"Analyse de pratique",desc:"Prendre du recul sur une situation vécue en stage, de la description à ce que vous en retenez.",guide:"guide-analyse",tk:["titre"],sections:[
  {h:"La situation",f:[{k:"titre",l:"Titre de la situation",t:"text",ph:"Ex. Refus de soin lors d'une toilette"},{k:"date",l:"Date",t:"date",half:1},{k:"lieu",l:"Lieu, moment",t:"text",half:1},{k:"acteurs",l:"Personnes présentes (sans nom)",t:"text"},{k:"description",l:"Description : les faits, dans l'ordre, au « je »",t:"textarea",r:6}]},
  {h:"Mon vécu et mon questionnement",f:[{k:"ressenti",l:"Ce que j'ai ressenti sur le moment",t:"textarea",r:2},{k:"questions",l:"Ce qui m'a questionné·e, surpris·e ou mis·e en difficulté",t:"textarea",r:3},{k:"question",l:"Ma question centrale (problématique)",t:"textarea",r:2}]},
  {h:"Analyse",f:[{k:"concepts",l:"Concepts mobilisés (bientraitance, consentement, douleur…)",t:"textarea",r:2},{k:"liens",l:"Liens avec mes cours, la législation, les recommandations, mes lectures",t:"textarea",r:4},{k:"points",l:"Points de vue des différents acteurs (patient, proches, équipe)",t:"textarea",r:3}]},
  {h:"Perspectives",f:[{k:"autrement",l:"Ce que j'aurais pu faire autrement",t:"textarea",r:3},{k:"retiens",l:"Ce que j'en retiens pour ma pratique future",t:"textarea",r:3},{k:"refs",l:"Références bibliographiques",t:"textarea",r:2}]}]},
 planif:{titre:"Planification de ma journée",desc:"Une feuille de route : vos patients, ce que vous devez faire et à quelle heure, ce qu'il faut transmettre.",guide:"guide-planif",tk:["date","poste"],sections:[
  {h:"Ma journée",f:[{k:"date",l:"Date",t:"date",half:1},{k:"poste",l:"Poste",t:"select",o:["Matin","Après-midi","Journée (12 h)","Nuit"],half:1},{k:"horaires",l:"Horaires",t:"text",half:1,ph:"6h45-14h15"},{k:"secteur",l:"Secteur, chambres",t:"text",half:1},{k:"referent",l:"Infirmier ou tuteur référent du jour",t:"text"}]},
  {h:"Mes patients",g:{k:"patients",label:"Patient",add:"Ajouter un patient",vide:4,f:[{k:"chambre",l:"Chambre",t:"text",half:1},{k:"initiales",l:"Initiales",t:"text",half:1},{k:"age",l:"Âge",t:"text",half:1},{k:"isolement",l:"Isolement",t:"select",o:["","Aucun","Contact","Gouttelettes","Air","Protecteur"],half:1},{k:"motif",l:"Motif, jour d'hospitalisation",t:"text",ph:"Ex. J1 colectomie"},{k:"atcd",l:"Antécédents importants, allergies",t:"text"},{k:"autonomie",l:"Autonomie, mobilité, risque de chute",t:"text"},{k:"alim",l:"Alimentation (régime, texture, à jeun), hydratation",t:"text"},{k:"dispositifs",l:"Dispositifs (VVP, sonde, O₂, drains…) et date de pose",t:"text"},{k:"surv",l:"Surveillances et fréquence (constantes, glycémies, douleur…)",t:"textarea",r:2},{k:"ttt",l:"Traitements et horaires",t:"textarea",r:2},{k:"soins",l:"Soins techniques prévus",t:"textarea",r:2},{k:"examens",l:"Examens, rendez-vous, entrée ou sortie",t:"text"},{k:"vigilance",l:"Points de vigilance",t:"textarea",r:2}]}},
  {h:"Mon planning heure par heure",planning:1},
  {h:"À transmettre en fin de poste",f:[{k:"transmissions",l:"Transmissions, soins non réalisés, points de vigilance",t:"textarea",r:4}]}]}
};
const SHEET_ORDER=["planif","recueil","projet","analyse"];
const TRAMES={
 "Matin":[["06:45","Transmissions orales de l'équipe de nuit"],["07:10","Lire dossiers et prescriptions, compléter ma feuille"],["07:30","Tour : constantes, douleur, glycémies à jeun"],["07:45","Bilans sanguins à jeun"],["08:00","Petit-déjeuner, traitements du matin"],["09:00","Toilettes, soins d'hygiène, prévention des escarres"],["10:30","Soins techniques, pansements"],["11:30","Glycémies avant repas, surveillances"],["12:00","Repas, traitements du midi"],["13:00","Transmissions écrites ciblées"],["13:45","Transmissions orales à l'équipe d'après-midi"]],
 "Après-midi":[["13:45","Transmissions orales de l'équipe du matin"],["14:10","Lire dossiers et prescriptions, compléter ma feuille"],["14:30","Tour : douleur, installation, sécurité"],["15:00","Soins techniques, pansements, entrées et sorties"],["16:00","Constantes, collation, hydratation"],["17:30","Glycémies avant repas"],["18:00","Repas, traitements du soir"],["19:30","Installation pour la nuit, change, changements de position"],["20:30","Transmissions écrites ciblées"],["21:00","Transmissions orales à l'équipe de nuit"]],
 "Journée (12 h)":[["07:00","Transmissions orales de l'équipe de nuit"],["07:20","Lire dossiers et prescriptions, compléter ma feuille"],["07:30","Tour : constantes, douleur, glycémies à jeun"],["08:00","Petit-déjeuner, traitements du matin"],["09:00","Toilettes, soins d'hygiène"],["10:30","Soins techniques, pansements"],["11:30","Glycémies avant repas"],["12:00","Repas, traitements du midi"],["14:00","Tour : douleur, constantes, installation"],["15:00","Soins techniques, entrées et sorties"],["17:30","Glycémies avant repas"],["18:00","Repas, traitements du soir"],["18:30","Transmissions écrites ciblées"],["19:00","Transmissions orales à l'équipe de nuit"]],
 "Nuit":[["21:00","Transmissions orales de l'équipe d'après-midi"],["21:30","Tour : installation, traitements du coucher, douleur"],["23:00","Tour de surveillance"],["00:00","Traitements, perfusions, changements de position"],["02:00","Tour de surveillance"],["04:00","Tour, changements de position"],["05:30","Bilans sanguins, constantes, glycémies"],["06:30","Transmissions écrites ciblées"],["06:45","Transmissions orales à l'équipe du matin"]]
};

const feuilles=()=>Object.assign({recueil:[],projet:[],analyse:[],planif:[]},store.get("feuilles",{}));
const saveFeuilles=f=>store.set("feuilles",f);
const fsInst=(type,id)=>(feuilles()[type]||[]).find(x=>x.id===id);
function fsTitle(type,inst){const d=inst.data||{},S=SHEETS[type];
 if(type==="planif")return `${d.poste||"Journée"} du ${d.date?fmtISO(d.date):"…"}`;
 if(type==="analyse")return d.titre||"Analyse sans titre";
 const who=[d.chambre?"Ch. "+d.chambre:"",d.initiales||""].filter(Boolean).join(" · ");return who||S.titre+" sans patient";}
const fsPatLabel=(p,i)=>[p.chambre?"Ch. "+p.chambre:"",p.initiales||""].filter(Boolean).join(" ")||"Patient "+(i+1);

/* ---------- Champs ---------- */
function fsField(f,path,val){
 const id="fs-"+path.replace(/\|/g,"-"),ph=f.ph?` placeholder="${esc(f.ph)}"`:"";
 if(f.t==="textarea")return `<label for="${id}">${esc(f.l)}<textarea id="${id}" data-fs="${path}" rows="${f.r||3}"${ph}>${esc(val||"")}</textarea></label>`;
 if(f.t==="select")return `<label for="${id}">${esc(f.l)}<select id="${id}" data-fs="${path}">${f.o.map(o=>`<option ${o===(val||"")?"selected":""} value="${esc(o)}">${esc(o||"–")}</option>`).join("")}</select></label>`;
 return `<label for="${id}">${esc(f.l)}<input id="${id}" data-fs="${path}" type="${f.t}" value="${esc(val||"")}"${ph} ${f.t==="text"?'autocomplete="off"':""}></label>`;
}
function fsFields(fields,base,data){
 let h="",row=[];const flush=()=>{if(row.length){h+=row.length>1?`<div class="cd-row">${row.join("")}</div>`:row[0];row=[];}};
 fields.forEach(f=>{const html=fsField(f,base+"|"+f.k,data[f.k]);if(f.half){row.push(html);if(row.length===2)flush();}else{flush();h+=html;}});flush();return h;
}
function fsPlanning(type,inst){
 const d=inst.data,pats=d.patients||[],tasks=(d.taches||[]).slice().sort((a,b)=>(a.heure||"99").localeCompare(b.heure||"99"));
 const opts=v=>`<option value="" ${!v?"selected":""}>Tous / général</option>`+pats.map((p,i)=>{const l=fsPatLabel(p,i);return `<option ${v===l?"selected":""}>${esc(l)}</option>`}).join("");
 const done=tasks.filter(t=>t.fait).length;
 return `<div class="cn-help"><p>Ajoutez la trame de votre poste, puis complétez avec les soins de chaque patient : traitements, glycémies, pansements, examens. Cochez au fur et à mesure.</p>
  <div class="chips wrapchips">${Object.keys(TRAMES).map(k=>`<button class="chip" data-act="fs-trame" data-k="${type}" data-id="${inst.id}" data-t="${esc(k)}">${IC.plus.replace("<svg",'<svg style="width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2.4"')} Trame ${esc(k.toLowerCase())}</button>`).join("")}</div></div>
 ${tasks.length?`<div class="cn-kpi"><span><b id="fs-done">${done}/${tasks.length}</b>tâches faites</span></div><div class="list fs-tasks">${tasks.map(t=>{const p=`${type}|${inst.id}|taches|${t.id}`;return `<div class="fs-task ${t.fait?"done":""}">
   <input type="time" data-fs="${p}|heure" value="${esc(t.heure||"")}" aria-label="Heure">
   <select data-fs="${p}|patient" aria-label="Patient">${opts(t.patient||"")}</select>
   <label class="fs-ok"><input type="checkbox" data-fs="${p}|fait" ${t.fait?"checked":""}><span class="sr-only">Fait</span></label>
   <input type="text" class="fs-t" data-fs="${p}|tache" value="${esc(t.tache||"")}" placeholder="Soin ou tâche" aria-label="Tâche" autocomplete="off">
   <button class="del" data-act="fs-gdel" data-k="taches" data-type="${type}" data-id="${inst.id}" data-item="${t.id}" aria-label="Supprimer la tâche">${IC.x}</button></div>`}).join("")}</div>`:`<div class="empty">Aucune tâche pour l'instant. Commencez par une trame ou ajoutez une tâche.</div>`}
 <button class="btn ghost block" data-act="fs-gadd" data-k="taches" data-type="${type}" data-id="${inst.id}">${IC.plus}Ajouter une tâche</button>`;
}
function fsEditor(type,inst){
 const S=SHEETS[type],d=inst.data||{},base=`${type}|${inst.id}`;
 const secs=S.sections.map(sec=>{let body;
  if(sec.planning)body=fsPlanning(type,inst);
  else if(sec.g){const g=sec.g,items=d[g.k]||[];
   body=items.map((it,i)=>`<details class="cn-item" ${state.fsOpen===it.id||items.length===1?"open":""}><summary><span><span class="cn-sum-t">${esc(g.label)} ${i+1}${type==="planif"?" · "+esc(fsPatLabel(it,i)):it.probleme?" · "+esc(it.probleme.slice(0,50)):""}</span></span></summary><div class="det-body cd-form">${fsFields(g.f,`${base}|${g.k}|${it.id}`,it)}
     <button class="link danger" data-act="fs-gdel" data-k="${g.k}" data-type="${type}" data-id="${inst.id}" data-item="${it.id}">Supprimer</button></div></details>`).join("")+
    `<button class="btn ghost block" data-act="fs-gadd" data-k="${g.k}" data-type="${type}" data-id="${inst.id}">${IC.plus}${esc(g.add)}</button>`;}
  else body=`<div class="sheet-body cd-form">${fsFields(sec.f,base,d)}</div>`;
  return `<section class="stack-sm"><h3 class="cn-g">${esc(sec.h)}</h3>${body}</section>`;}).join("");
 return `<div class="stack-lg"><a class="back" href="#feuille/${type}">${IC.back}${esc(S.titre)}</a>
  ${vh("Feuille de travail",esc(fsTitle(type,inst)),`<a class="link" href="#fiche/${S.guide}">Mode d'emploi de cette feuille</a>`)}
  <div class="section-title"><span class="muted" id="fs-saved">Enregistré sur cet appareil</span></div>
  ${secs}
  <div class="btn-row"><button class="btn" data-act="fs-print" data-k="${type}" data-id="${inst.id}">${IC.sheet}Imprimer cette feuille</button><button class="btn ghost" data-act="fs-print" data-k="${type}">Imprimer une feuille vierge</button></div>
  <button class="link danger" data-act="fs-del" data-k="${type}" data-id="${inst.id}">Supprimer cette feuille</button>
  <p class="disclaimer">Données de santé : initiales seulement. Une feuille imprimée reste dans le service et se détruit en fin de stage.</p></div>`;
}
function fsList(type){
 const S=SHEETS[type],list=(feuilles()[type]||[]).slice().sort((a,b)=>(b.updated||b.created||"").localeCompare(a.updated||a.created||""));
 return `<div class="stack-lg">${backBtn("Stages")}${vh("Feuille de travail",esc(S.titre),esc(S.desc))}
  <div class="btn-row"><button class="btn" data-act="fs-new" data-k="${type}">${IC.plus}Nouvelle feuille</button><button class="btn ghost" data-act="fs-print" data-k="${type}">${IC.sheet}Imprimer vierge</button></div>
  <a class="cd-card cn-entry" href="#fiche/${S.guide}"><span class="cd-ic">${IC.book}</span><span><b>Mode d'emploi</b><small>Comment utiliser et remplir cette feuille, avec un exemple</small></span><svg class="chev" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></a>
  <section class="stack-sm"><div class="section-title"><h2>Mes feuilles</h2><span class="muted">${list.length}</span></div>
  ${list.length?`<div class="list">${list.map(x=>`<a class="li" href="#feuille/${type}/${x.id}"><span class="bar" style="--c:${CAT.stage.c}"></span><span><span class="t">${esc(fsTitle(type,x))}</span><span class="s">Modifiée le ${esc(fmtShort(at(x.updated||x.created,"12:00")))}</span></span><svg class="chev" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></a>`).join("")}</div>`:`<div class="empty">Aucune feuille. Créez-en une pour la remplir ici, ou imprimez une feuille vierge à remplir à la main.</div>`}</section></div>`;
}
function vFeuille(arg){
 const [type,id]=(arg||"").split("/");if(!SHEETS[type])return notFound();
 if(id){const inst=fsInst(type,id);return inst?fsEditor(type,inst):notFound();}
 return fsList(type);
}
function feuillesCard(){
 const F=feuilles(),ic={planif:IC.cal,recueil:IC.sheet,projet:IC.flask,analyse:IC.book};
 return `<section class="stack-sm"><div class="section-title"><h2>Feuilles de travail</h2></div>
  <p class="muted">À remplir dans l'appli ou à imprimer, chacune avec son mode d'emploi.</p>
  <div class="fs-grid">${SHEET_ORDER.map(t=>{const S=SHEETS[t],n=(F[t]||[]).length;return `<div class="fs-card"><a class="fs-main" href="#feuille/${t}"><span class="cd-ic">${ic[t]}</span><b>${esc(S.titre)}</b><small>${esc(S.desc)}</small>${n?`<span class="tag">${plural(n,"feuille")}</span>`:""}</a>
   <div class="fs-links"><a href="#fiche/${S.guide}">Mode d'emploi</a><button data-act="fs-print" data-k="${t}">Imprimer vierge</button></div></div>`}).join("")}</div></section>`;
}

/* ---------- Saisie et actions ---------- */
function feuilleInput(t){
 const parts=t.dataset.fs.split("|"),[type,id]=parts,F=feuilles(),inst=(F[type]||[]).find(x=>x.id===id);if(!inst)return;
 const v=t.type==="checkbox"?t.checked:t.value;inst.data=inst.data||{};
 if(parts.length===3)inst.data[parts[2]]=v;
 else{const arr=inst.data[parts[2]]=inst.data[parts[2]]||[],it=arr.find(x=>x.id===parts[3]);if(!it)return;it[parts[4]]=v;}
 inst.updated=todayISO();saveFeuilles(F);
 if(t.type==="checkbox"){const row=t.closest(".fs-task");row&&row.classList.toggle("done",v);const k=document.getElementById("fs-done");if(k){const all=document.querySelectorAll(".fs-task .fs-ok input");k.textContent=[...all].filter(x=>x.checked).length+"/"+all.length;}haptic();}
 const m=document.getElementById("fs-saved");if(m){m.textContent="Enregistré ✓";clearTimeout(feuilleInput.t);feuilleInput.t=setTimeout(()=>{m.textContent="Enregistré sur cet appareil"},1400);}
}
function feuilleAct(b,a){
 const F=feuilles(),type=b.dataset.type||b.dataset.k,id=b.dataset.id,inst=id?(F[type]||[]).find(x=>x.id===id):null;
 if(a==="fs-new"){const it={id:cnId(),created:todayISO(),updated:todayISO(),data:{date:todayISO()}};
  if(type==="planif"){const s=stageInfo();it.data.poste="Matin";it.data.horaires=s.horaires||"";it.data.patients=[{id:cnId()}];}
  if(type==="projet")it.data.pb=[{id:cnId()}];
  F[type].push(it);saveFeuilles(F);haptic();nav("feuille/"+type+"/"+it.id);return;}
 if(a==="fs-del"){if(!b.dataset.armed){b.dataset.armed="1";b.textContent="Toucher à nouveau pour supprimer la feuille";setTimeout(()=>{if(b.isConnected){delete b.dataset.armed;b.textContent="Supprimer cette feuille";}},3500);return;}
  F[type]=F[type].filter(x=>x.id!==id);saveFeuilles(F);toast("Feuille supprimée");location.replace("#feuille/"+type);return;}
 if(a==="fs-gadd"&&inst){const k=b.dataset.k,it={id:cnId()};(inst.data[k]=inst.data[k]||[]).push(it);inst.updated=todayISO();saveFeuilles(F);state.fsOpen=it.id;render();
  setTimeout(()=>{const el=document.querySelector(`[data-fs^="${type}|${id}|${k}|${it.id}"]`);if(el){el.scrollIntoView({block:"center"});if(k==="taches")el.focus();}},50);return;}
 if(a==="fs-gdel"&&inst){const k=b.dataset.k,item=b.dataset.item;
  if(k!=="taches"&&!b.dataset.armed){b.dataset.armed="1";b.textContent="Toucher à nouveau pour supprimer";setTimeout(()=>{if(b.isConnected){delete b.dataset.armed;b.textContent="Supprimer";}},3500);return;}
  inst.data[k]=(inst.data[k]||[]).filter(x=>x.id!==item);saveFeuilles(F);haptic();render();return;}
 if(a==="fs-trame"&&inst){const tr=TRAMES[b.dataset.t]||[],ex=(inst.data.taches||[]).map(x=>x.heure+x.tache);
  inst.data.taches=inst.data.taches||[];tr.forEach(([h,t])=>{if(!ex.includes(h+t))inst.data.taches.push({id:cnId(),heure:h,tache:t,patient:"",fait:false});});
  if(!inst.data.poste||inst.data.poste==="Matin")inst.data.poste=b.dataset.t;saveFeuilles(F);haptic();toast("Trame ajoutée : adaptez-la au service");render();return;}
 if(a==="fs-print"){printHTML(fsPrintDoc(type,inst));return;}
}

/* ---------- Impression ---------- */
function fsPrintFields(fields,data,blank){
 return `<table class="pt">${fields.map(f=>{const v=blank?"":data[f.k];return `<tr><th>${esc(f.l)}${blank&&f.ph?`<br><small>${esc(f.ph)}</small>`:""}</th><td${blank?` style="height:${Math.max(1,f.r||1)*7}mm"`:""}>${v===true?"☑":v===false?"☐":pe(v)}</td></tr>`}).join("")}</table>`;
}
function fsPrintDoc(type,inst){
 const S=SHEETS[type],blank=!inst,d=blank?{}:(inst.data||{}),title=blank?S.titre:S.titre+" · "+fsTitle(type,inst);
 if(type==="planif")return fsPrintPlanif(inst);
 let h=`<section class="pp"><h1>${esc(title)}</h1><p class="psub">Carnet IFSI · initiales seulement, document à garder dans le service</p>`;
 S.sections.forEach(sec=>{h+=`<h2>${esc(sec.h)}</h2>`;
  if(sec.g){const items=blank?Array.from({length:sec.g.vide||2},()=>({})):(d[sec.g.k]||[]);items.forEach((it,i)=>{h+=`<div class="pj"><p><b>${esc(sec.g.label)} ${i+1}</b></p>${fsPrintFields(sec.g.f,it,blank)}</div>`;});}
  else h+=fsPrintFields(sec.f,d,blank);});
 return h+`</section>`;
}
function fsPrintPlanif(inst){
 const blank=!inst,d=blank?{}:(inst.data||{}),pats=blank?[{},{},{},{}]:(d.patients&&d.patients.length?d.patients:[{}]);
 const F=SHEETS.planif.sections[1].g.f;
 const cols=[];for(let i=0;i<pats.length;i+=4)cols.push(pats.slice(i,i+4));
 let h=`<section class="pp"><h1>Planification de ma journée${blank?"":" · "+esc(fsTitle("planif",inst))}</h1>
  <table class="pt"><tr><th>Date</th><td>${blank?"":esc(d.date?fmtISO(d.date):"")}</td><th>Poste, horaires</th><td>${blank?"":esc([d.poste,d.horaires].filter(Boolean).join(" · "))}</td></tr><tr><th>Secteur</th><td>${blank?"":esc(d.secteur||"")}</td><th>Référent du jour</th><td>${blank?"":esc(d.referent||"")}</td></tr></table>`;
 cols.forEach(group=>{h+=`<table class="pt pg fs-pt"><tr><th style="width:22%">Patient</th>${group.map((p,i)=>`<th>${blank?"Ch. …… Initiales ……":esc(fsPatLabel(p,i))}</th>`).join("")}</tr>
  ${F.filter(f=>!["chambre","initiales"].includes(f.k)).map(f=>`<tr><th>${esc(f.l.split(" (")[0])}</th>${group.map(p=>`<td>${blank?"":pe(p[f.k])}</td>`).join("")}</tr>`).join("")}</table>`;});
 h+=`</section><section class="pp"><h1>Mon planning heure par heure</h1>`;
 if(blank){const hours=[6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21];
  h+=`<table class="pt pg fs-grid-p"><tr><th style="width:16mm">Heure</th><th>Patient 1</th><th>Patient 2</th><th>Patient 3</th><th>Patient 4</th><th style="width:9mm">✓</th></tr>${hours.map(x=>`<tr><th style="white-space:nowrap">${x} h</th><td></td><td></td><td></td><td></td><td></td></tr>`).join("")}</table>`;}
 else{const tasks=(d.taches||[]).slice().sort((a,b)=>(a.heure||"99").localeCompare(b.heure||"99"));
  h+=`<table class="pt pg"><tr><th style="width:16mm">Heure</th><th style="width:28%">Patient</th><th>Soin ou tâche</th><th style="width:9mm">✓</th></tr>${tasks.length?tasks.map(t=>`<tr><td>${esc(t.heure||"")}</td><td>${esc(t.patient||"Tous")}</td><td>${esc(t.tache||"")}</td><td>${t.fait?"☑":"☐"}</td></tr>`).join(""):""}${"<tr><td></td><td></td><td></td><td></td></tr>".repeat(4)}</table>`;}
 h+=`<h2>À transmettre en fin de poste</h2>${blank||!d.transmissions?lines(5):`<p>${pe(d.transmissions)}</p>`}
  <p class="psub">Priorités : 1. urgences et dégradation · 2. soins à heure fixe · 3. douleur, sécurité · 4. soins prévus · 5. confort, éducation. Tout soin réalisé est tracé dans le dossier. Feuille détruite en fin de poste.</p></section>`;
 return h;
}
function printHTML(html){
 let doc=document.getElementById("print-doc");if(doc)doc.remove();
 doc=document.createElement("div");doc.id="print-doc";doc.className="pdoc print-doc";doc.innerHTML=html;document.body.appendChild(doc);
 document.body.classList.add("printing");
 const done=()=>{document.body.classList.remove("printing");const x=document.getElementById("print-doc");x&&x.remove();};
 window.addEventListener("afterprint",done,{once:true});
 setTimeout(()=>{try{window.print();}catch(e){toast("Impression indisponible ici : ouvrez l'appli dans Safari");done();}},60);
}
