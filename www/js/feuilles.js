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
/* ---------- Planification rapide ---------- */
const PL_POSTES={"Matin":{h:[6,7,8,9,10,11,12,13,14],start:6,repas:["08:00","12:00"]},"Après-midi":{h:[13,14,15,16,17,18,19,20,21],start:13,repas:["18:00"]},"Journée (12 h)":{h:[7,8,9,10,11,12,13,14,15,16,17,18,19],start:7,repas:["08:00","12:00","18:00"]},"Nuit":{h:[21,22,23,0,1,2,3,4,5,6,7],start:21,repas:["22:00"]}};
const PL_SOINS=[
 ["Surveillance",["Constantes","Glycémie capillaire","Évaluation de la douleur","Diurèse, bilan entrées-sorties","Poids","Surveillance neurologique","Surveillance du pansement","Surveillance de la perfusion"]],
 ["Médicaments",["Traitements per os","Injection SC (HBPM)","Insuline","Antibiotique IV","Antalgique","Poser ou changer la perfusion","Aérosol","Oxygène"]],
 ["Soins",["Toilette","Aide au repas","Pansement","Prise de sang","Hémocultures","ECG","Changement de position","Soins de bouche","Lever, mobilisation","Sonde urinaire","Retrait VVP ou redon"]],
 ["Organisation",["Transmissions écrites","Transmissions orales","Préparer départ bloc ou examen","Entrée d'un patient","Sortie d'un patient","Signaler au médecin","Préparer le matériel","Éducation du patient"]]
];
const PL_TOURS=[["Tour de constantes","Constantes"],["Tour des traitements","Traitements"],["Tour glycémies","Glycémie capillaire"],["Tour douleur","Évaluation de la douleur"],["Changements de position","Changement de position"],["Tour de sécurité","Tour de sécurité (installation, sonnette, barrières)"]];
const PL_REP=[["1","1 fois"],["2","Toutes les 2 h"],["4","Toutes les 4 h"],["6","Toutes les 6 h"],["repas","Aux repas"]];
const plPoste=d=>PL_POSTES[d.poste]||PL_POSTES["Matin"];
const plMin=t=>{const [h,m]=(t||"").split(":").map(Number);return isNaN(h)?null:h*60+(m||0);};
const plKey=(t,d)=>{const m=plMin(t);return m==null?99999:(m-plPoste(d).start*60+1440)%1440;};
const plHM=m=>String(Math.floor(m/60)%24).padStart(2,"0")+":"+String(m%60).padStart(2,"0");
function plState(d){
 const P=plPoste(d);state.pl=state.pl||{pat:"",m:"00",rep:"1",filter:"all"};
 if(state.pl.h==null||!P.h.includes(state.pl.h)){const now=new Date().getHours();state.pl.h=P.h.find(x=>x===((now+1)%24))!=null?(now+1)%24:P.h.includes(now)?now:P.h[0];}
 return state.pl;
}
function plTimes(d,st){
 const P=plPoste(d),t0=st.h*60+(+st.m);
 if(st.rep==="repas")return P.repas.slice();
 if(st.rep==="1")return [plHM(t0)];
 const step=+st.rep*60,end=(P.h[P.h.length-1]-P.start+24)%24*60+30,out=[];
 for(let k=(t0-P.start*60+1440)%1440;k<=end;k+=step)out.push(plHM(P.start*60+k));
 return out;
}
function plAddTasks(inst,label,pats,times){
 const d=inst.data;d.taches=d.taches||[];let n=0;
 pats.forEach(p=>times.forEach(h=>{if(!d.taches.some(t=>t.heure===h&&(t.patient||"")===p&&t.tache===label)){d.taches.push({id:cnId(),heure:h,patient:p,tache:label,fait:false});n++;}}));
 return n;
}
function plAddHTML(inst){
 const d=inst.data,st=plState(d),P=plPoste(d),pats=(d.patients||[]).map(fsPatLabel);
 const chip=(act,v,on,l)=>`<button class="chip" data-act="${act}" data-type="planif" data-id="${inst.id}" data-v="${esc(v)}" aria-pressed="${on}">${l}</button>`;
 return `<div class="pl-row"><span class="pl-lab">Pour</span><div class="chips">${chip("fs-plpat","",st.pat==="","Tous")}${pats.map(p=>chip("fs-plpat",p,st.pat===p,esc(p))).join("")}</div></div>
  <div class="pl-row"><span class="pl-lab">À</span><div class="chips">${P.h.map(h=>chip("fs-plh",h,st.h===h,h+" h")).join("")}</div></div>
  <div class="pl-row"><span class="pl-lab"></span><div class="chips">${["00","15","30","45"].map(m=>chip("fs-plm",m,st.m===m,st.h+" h "+m)).join("")}</div></div>
  <div class="pl-row"><span class="pl-lab">Répéter</span><div class="chips">${PL_REP.map(([v,l])=>chip("fs-plrep",v,st.rep===v,l)).join("")}</div></div>
  <p class="pl-sum">Touchez un soin : il s'ajoute ${st.rep==="repas"?"aux repas ("+P.repas.join(", ")+")":st.rep==="1"?"à "+plHM(st.h*60+(+st.m)):"de "+plHM(st.h*60+(+st.m))+" toutes les "+st.rep+" h"} pour ${st.pat?esc(st.pat):"tous"}.</p>
  ${PL_SOINS.map(([g,items])=>`<div class="pl-g"><span class="pl-gl">${g}</span><div class="pl-btns">${items.map(x=>`<button class="pl-btn" data-act="fs-pladd" data-type="planif" data-id="${inst.id}" data-v="${esc(x)}">${esc(x)}</button>`).join("")}</div></div>`).join("")}
  <form id="pl-free" class="pl-free" data-id="${inst.id}"><input id="pl-free-in" placeholder="Autre soin…" maxlength="80" autocomplete="off" aria-label="Autre soin"><button class="btn" type="submit">${IC.plus}Ajouter</button></form>
  <div class="pl-g"><span class="pl-gl">Tours pour ${pats.length?"chaque patient":"tout le secteur"} à ${plHM(st.h*60+(+st.m))}</span><div class="pl-btns">${PL_TOURS.map(([l,t])=>`<button class="pl-btn tour" data-act="fs-pltour" data-type="planif" data-id="${inst.id}" data-v="${esc(t)}">${esc(l)}</button>`).join("")}</div></div>
  <button class="link" data-act="fs-trame" data-k="planif" data-id="${inst.id}" data-t="${esc(d.poste||"Matin")}">Ajouter la trame type du poste (${esc((d.poste||"Matin").toLowerCase())})</button>`;
}
function plListHTML(inst){
 const d=inst.data,st=plState(d),all=(d.taches||[]).slice().sort((a,b)=>plKey(a.heure,d)-plKey(b.heure,d)||(b.prio?1:0)-(a.prio?1:0)||(a.patient||"").localeCompare(b.patient||""));
 const pats=[...new Set(all.map(t=>t.patient||""))];
 let list=all;if(st.filter==="todo")list=all.filter(t=>!t.fait);else if(st.filter!=="all")list=all.filter(t=>(t.patient||"")===st.filter);
 const isToday=d.date===todayISO(),nowK=plKey(plHM(new Date().getHours()*60+new Date().getMinutes()),d),done=all.filter(t=>t.fait).length;
 const groups=new Map();list.forEach(t=>{const h=(t.heure||"--").slice(0,2);if(!groups.has(h))groups.set(h,[]);groups.get(h).push(t);});
 const fchip=(v,l)=>`<button class="chip" data-act="fs-plfilter" data-type="planif" data-id="${inst.id}" data-v="${esc(v)}" aria-pressed="${st.filter===v}">${l}</button>`;
 return `<div class="pl-head"><div class="progress"><i style="width:${all.length?done/all.length*100:0}%"></i></div><span><b>${done}/${all.length}</b> faits</span></div>
  ${all.length?`<p class="muted fs-hint">Touchez un soin pour le cocher. Glissez-le vers la gauche pour le modifier, le rendre prioritaire ou le supprimer.</p><div class="chips">${fchip("all","Tout")}${fchip("todo","À faire")}${pats.filter(Boolean).map(p=>fchip(p,esc(p))).join("")}</div>`:""}
  ${list.length?[...groups].map(([h,ts])=>`<div class="pl-hour"><span class="pl-h">${h==="--"?"Sans heure":(+h)+" h"}</span><div class="pl-items">${ts.map(t=>{const late=isToday&&!t.fait&&plKey(t.heure,d)<nowK;
   const at=`data-type="planif" data-id="${inst.id}" data-item="${t.id}"`,pth=`planif|${inst.id}|taches|${t.id}`;
   if(state.plEdit===t.id)return `<div class="pl-item pl-edit cd-form"><div class="cd-row"><label>Heure<input type="time" data-fs="${pth}|heure" value="${esc(t.heure||"")}"></label><label>Patient<select data-fs="${pth}|patient"><option value="" ${!t.patient?"selected":""}>Tous / général</option>${(d.patients||[]).map((p,i)=>{const l=fsPatLabel(p,i);return `<option ${t.patient===l?"selected":""}>${esc(l)}</option>`}).join("")}</select></label></div>
    <label>Soin<input type="text" data-fs="${pth}|tache" value="${esc(t.tache||"")}" autocomplete="off"></label><button class="btn" data-act="fs-pl-editdone" ${at}>${IC.check}Terminé</button></div>`;
   return `<div class="sw pl-sw ${t.prio?"prio":""}">${swActs([["sw-edit","fs-pl-edit",at,IC.sheet,"Modifier"],["sw-ord","fs-pl-prio",at,"<b>!</b>",t.prio?"Normal":"Prioritaire"],["sw-del","fs-pldel",at,IC.x,"Supprimer"]])}<div class="sw-main pl-item ${t.fait?"done":""} ${late?"late":""}"><button class="pl-tog" data-act="fs-pltoggle" ${at} aria-pressed="${!!t.fait}"><span class="pl-box">${t.fait?IC.check:""}</span><span class="pl-txt"><span class="pl-meta">${esc(t.heure||"")}${t.patient?` · <b>${esc(t.patient)}</b>`:""}${t.prio?' · <strong>prioritaire</strong>':""}${late?' · <em>en retard</em>':""}</span><span class="pl-name">${esc(t.tache||"")}</span></span></button></div></div>`}).join("")}</div></div>`).join("")
   :`<div class="empty">${all.length?"Rien à afficher avec ce filtre.":"Votre planning est vide. Choisissez un patient et une heure, puis touchez les soins à faire ci-dessus."}</div>`}`;
}
function plRefresh(inst,what){
 const a=document.getElementById("pl-add"),l=document.getElementById("pl-list");
 if(a&&(what==="add"||what==="all"))a.innerHTML=plAddHTML(inst);
 if(l&&(what==="list"||what==="all"))l.innerHTML=plListHTML(inst);
 const n=document.getElementById("pl-n");if(n)n.textContent=(inst.data.taches||[]).length;
}
function plEditor(inst){
 const d=inst.data,base=`planif|${inst.id}`,S=SHEETS.planif,pats=d.patients||[];
 return `<div class="stack-lg"><a class="back" href="#feuille/planif">${IC.back}${esc(S.titre)}</a>
  ${vh("Feuille de travail",esc(fsTitle("planif",inst)),`<a class="link" href="#fiche/${S.guide}">Mode d'emploi de cette feuille</a>`)}
  <div class="sheet-body cd-form"><div class="cd-row">${fsField({k:"date",l:"Date",t:"date"},base+"|date",d.date)}${fsField({k:"poste",l:"Poste",t:"select",o:Object.keys(PL_POSTES)},base+"|poste",d.poste||"Matin")}</div></div>
  <section class="stack-sm"><div class="section-title"><h2>Mes patients</h2><span class="muted" id="fs-saved">Enregistré sur cet appareil</span></div>
   <form id="pl-pat" class="pl-pat" data-id="${inst.id}"><input id="pl-ch" placeholder="Chambre" maxlength="8" inputmode="numeric" autocomplete="off" aria-label="Chambre"><input id="pl-in" placeholder="Initiales" maxlength="12" autocomplete="off" aria-label="Initiales"><button class="btn" type="submit">${IC.plus}Ajouter</button></form>
   ${grpList("planif",inst,S.sections[1].g,base,(p,i)=>esc(fsPatLabel(p,i)),p=>p.motif?esc(p.motif):"Touchez pour compléter ses infos (facultatif)")}</section>
  ${(()=>{const st=plState(d),n=(d.taches||[]).length;if(!st.view)st.view=n?"plan":"add";return `<div class="seg pl-seg" role="tablist"><button data-act="fs-plview" data-type="planif" data-id="${inst.id}" data-v="plan" aria-pressed="${st.view==="plan"}">Mon planning · <span id="pl-n">${n}</span></button><button data-act="fs-plview" data-type="planif" data-id="${inst.id}" data-v="add" aria-pressed="${st.view==="add"}">${IC.plus.replace("<svg",'<svg style="width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2.4;vertical-align:-2px"')} Ajouter des soins</button></div>
  <div id="pl-addwrap" ${st.view!=="add"?"hidden":""}><div class="sheet-body pl-add" id="pl-add">${plAddHTML(inst)}</div></div>
  <div id="pl-planwrap" ${st.view!=="plan"?"hidden":""}><div id="pl-list" class="stack-sm">${plListHTML(inst)}</div><button class="btn ghost block pl-goadd" data-act="fs-plview" data-type="planif" data-id="${inst.id}" data-v="add">${IC.plus}Ajouter des soins</button></div>`;})()}
  <section class="stack-sm"><h2>À transmettre en fin de poste</h2><div class="sheet-body cd-form">${fsField({k:"transmissions",l:"Transmissions, soins non réalisés, points de vigilance",t:"textarea",r:4},base+"|transmissions",d.transmissions)}</div></section>
  <div class="btn-row"><button class="btn" data-act="fs-print" data-k="planif" data-id="${inst.id}">${IC.sheet}Imprimer ma feuille</button><button class="btn ghost" data-act="fs-print" data-k="planif">Imprimer une feuille vierge</button></div>
  <button class="link danger" data-act="fs-del" data-k="planif" data-id="${inst.id}">Supprimer cette feuille</button>
  <p class="disclaimer">Initiales seulement. Chaque soin réalisé est aussi tracé dans le dossier du patient.</p></div>`;
}
function plSubmit(f){
 const F=feuilles(),inst=(F.planif||[]).find(x=>x.id===f.dataset.id);if(!inst)return;const d=inst.data;
 if(f.id==="pl-pat"){const ch=document.getElementById("pl-ch").value.trim(),ini=document.getElementById("pl-in").value.trim();if(!ch&&!ini){toast("Indiquez la chambre ou les initiales");return;}
  d.patients=(d.patients||[]).filter(p=>p.chambre||p.initiales);d.patients.push({id:cnId(),chambre:ch,initiales:ini});inst.updated=todayISO();saveFeuilles(F);
  state.pl=state.pl||{};state.pl.pat=fsPatLabel(d.patients[d.patients.length-1],d.patients.length-1);haptic();render();setTimeout(()=>{const i=document.getElementById("pl-ch");i&&i.focus();},40);}
 else if(f.id==="pl-free"){const v=document.getElementById("pl-free-in").value.trim();if(!v)return;const st=plState(d),n=plAddTasks(inst,v,[st.pat],plTimes(d,st));inst.updated=todayISO();saveFeuilles(F);haptic();
  toast(n?`Ajouté : ${v}`:"Déjà dans le planning");document.getElementById("pl-free-in").value="";plRefresh(inst,"list");}
}

function grpList(type,inst,g,base,labelFn,subFn){
 const d=inst.data,items=d[g.k]||[],re=state.grpRe===inst.id+"|"+g.k;
 const at=it=>`data-type="${type}" data-id="${inst.id}" data-k="${g.k}" data-item="${it.id}"`;
 const rows=items.map((it,i)=>{const lab=labelFn(it,i),sub=subFn(it,i);
  if(re)return `<div class="li fs-re"><span class="fs-rank">${i+1}</span><span><span class="t">${lab}</span>${sub?`<span class="s">${sub}</span>`:""}</span><span class="fs-arrows"><button class="del" data-act="fs-g-move" ${at(it)} data-d="-1" ${i?"":"disabled"} aria-label="Monter">↑</button><button class="del" data-act="fs-g-move" ${at(it)} data-d="1" ${i<items.length-1?"":"disabled"} aria-label="Descendre">↓</button></span></div>`;
  const open=state.fsOpen===it.id||(items.length===1&&state.fsOpen!=="none:"+it.id);
  return `<div class="grp"><div class="sw grp-sw">${swActs([["sw-edit","fs-g-edit",at(it),IC.sheet,"Modifier"],["sw-ord","fs-g-ord",at(it),"<b>↑↓</b>","Hiérarchiser"],["sw-del","fs-g-del",at(it),IC.x,"Supprimer"]])}
   <button class="sw-main grp-head" data-act="fs-g-toggle" ${at(it)} aria-expanded="${open}"><span class="grp-n">${i+1}</span><span class="grp-txt"><span class="t">${lab}</span>${sub?`<span class="s">${sub}</span>`:""}</span><svg class="chev" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button></div>
   <div class="grp-body cd-form" ${open?"":"hidden"}>${fsFields(g.f,`${base}|${g.k}|${it.id}`,it)}</div></div>`;}).join("");
 const head=re?`<div class="section-title"><span class="muted fs-hint">Classez avec les flèches : le n° 1 est le plus prioritaire.</span><button class="btn" data-act="fs-g-ord-done" data-type="${type}" data-id="${inst.id}" data-k="${g.k}">Terminé</button></div>`
  :items.length?`<p class="muted fs-hint">Touchez pour ouvrir. Glissez vers la gauche pour modifier, hiérarchiser ou supprimer.</p>`:"";
 return `${head}${items.length?`<div class="list grp-list">${rows}</div>`:""}`;
}
function fsEditor(type,inst){
 if(type==="planif")return plEditor(inst);
 const S=SHEETS[type],d=inst.data||{},base=`${type}|${inst.id}`;
 const secs=S.sections.map(sec=>{let body;
  if(sec.g){const g=sec.g,items=d[g.k]||[];
   body=grpList(type,inst,g,base,(it,i)=>it.probleme?esc(it.probleme.length>70?it.probleme.slice(0,70)+"…":it.probleme):`${esc(g.label)} à formuler`,it=>it.type?esc(it.type):"")+
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
function fsSorted(type){
 const list=(feuilles()[type]||[]).slice();
 return list.some(x=>x.ord!=null)?list.sort((a,b)=>(a.ord??-1e9)-(b.ord??-1e9)):list.sort((a,b)=>(b.updated||b.created||"").localeCompare(a.updated||a.created||""));
}
function fsList(type){
 const S=SHEETS[type],list=fsSorted(type),re=state.fsReorder===type;
 const row=(x,i)=>{const t=esc(fsTitle(type,x)),sub=`Modifiée le ${esc(fmtShort(at(x.updated||x.created,"12:00")))}`;
  if(re)return `<div class="li fs-re"><span class="fs-rank">${i+1}</span><span><span class="t">${t}</span><span class="s">${sub}</span></span><span class="fs-arrows"><button class="del" data-act="fs-ord" data-k="${type}" data-id="${x.id}" data-d="-1" aria-label="Monter ${t}" ${i?"":"disabled"}>↑</button><button class="del" data-act="fs-ord" data-k="${type}" data-id="${x.id}" data-d="1" aria-label="Descendre ${t}" ${i<list.length-1?"":"disabled"}>↓</button></span></div>`;
  return `<div class="sw" data-sw="${x.id}"><div class="sw-acts">
    <button class="sw-b sw-edit" data-act="fs-sw-edit" data-k="${type}" data-id="${x.id}" tabindex="-1">${IC.sheet}<span>Modifier</span></button>
    <button class="sw-b sw-ord" data-act="fs-sw-ord" data-k="${type}" data-id="${x.id}" tabindex="-1"><b>↑↓</b><span>Hiérarchiser</span></button>
    <button class="sw-b sw-del" data-act="fs-sw-del" data-k="${type}" data-id="${x.id}" tabindex="-1">${IC.x}<span>Supprimer</span></button></div>
   <a class="li sw-main" href="#feuille/${type}/${x.id}" draggable="false"><span class="bar" style="--c:${CAT.stage.c}"></span><span><span class="t">${t}</span><span class="s">${sub}</span></span><svg class="chev" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></a></div>`;};
 return `<div class="stack-lg">${backBtn("Stages")}${vh("Feuille de travail",esc(S.titre),esc(S.desc))}
  <div class="btn-row"><button class="btn" data-act="fs-new" data-k="${type}">${IC.plus}Nouvelle feuille</button><button class="btn ghost" data-act="fs-print" data-k="${type}">${IC.sheet}Imprimer vierge</button></div>
  <a class="cd-card cn-entry" href="#fiche/${S.guide}"><span class="cd-ic">${IC.book}</span><span><b>Mode d'emploi</b><small>Comment utiliser et remplir cette feuille, avec un exemple</small></span><svg class="chev" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></a>
  <section class="stack-sm"><div class="section-title"><h2>Mes feuilles</h2>${re?`<button class="btn" data-act="fs-ord-done" data-k="${type}">Terminé</button>`:`<span class="muted">${list.length}</span>`}</div>
  ${list.length?`<p class="muted fs-hint">${re?"Utilisez les flèches pour classer vos feuilles par ordre d'importance.":"Glissez une feuille vers la gauche pour la modifier, la hiérarchiser ou la supprimer."}</p><div class="list fs-list">${list.map(row).join("")}</div>`:`<div class="empty">Aucune feuille. Créez-en une pour la remplir ici, ou imprimez une feuille vierge à remplir à la main.</div>`}</section></div>`;
}
/* ---------- Glisser vers la gauche ---------- */
const SW_W=246;let swDrag=null,swBlockClick=false;
const swW=r=>{const a=r.querySelector(".sw-acts");return a&&a.offsetWidth||SW_W;};
const swActs=btns=>`<div class="sw-acts" style="width:${btns.length*82}px;grid-template-columns:repeat(${btns.length},1fr)">${btns.map(([cls,act,attrs,ico,l])=>`<button class="sw-b ${cls}" data-act="${act}" ${attrs} tabindex="-1">${ico}<span>${l}</span></button>`).join("")}</div>`;
const swClose=(except)=>document.querySelectorAll(".sw.open").forEach(r=>{if(r!==except){r.classList.remove("open");const m=r.querySelector(".sw-main");m.style.transform="";r.querySelectorAll(".sw-b").forEach(x=>x.tabIndex=-1);const d=r.querySelector(".sw-del");if(d&&d.dataset.armed){delete d.dataset.armed;d.querySelector("span").textContent="Supprimer";}}});
const swOpen=r=>{swClose(r);r.classList.add("open");r.querySelector(".sw-main").style.transform=`translateX(${-swW(r)}px)`;r.querySelectorAll(".sw-b").forEach(x=>x.tabIndex=0);};
document.addEventListener("pointerdown",e=>{const m=e.target.closest(".sw-main");
 if(!m){if(!e.target.closest(".sw-acts"))swClose();return;}
 const r=m.closest(".sw");const W=swW(r);swDrag={r,m,W,x0:e.clientX,y0:e.clientY,base:r.classList.contains("open")?-W:0,dir:null,id:e.pointerId,x:0};});
document.addEventListener("pointermove",e=>{const d=swDrag;if(!d||e.pointerId!==d.id)return;const dx=e.clientX-d.x0,dy=e.clientY-d.y0;
 if(!d.dir){if(Math.abs(dx)>8&&Math.abs(dx)>Math.abs(dy)){d.dir="h";try{d.m.setPointerCapture(d.id)}catch(_){}d.r.classList.add("drag");swClose(d.r);}else if(Math.abs(dy)>8){swDrag=null;return;}else return;}
 d.x=Math.max(-d.W-40,Math.min(0,d.base+dx));d.m.style.transform=`translateX(${d.x}px)`;e.preventDefault();},{passive:false});
const swEnd=e=>{const d=swDrag;swDrag=null;if(!d||d.dir!=="h"){if(d&&document.querySelector(".sw.open")&&!d.r.classList.contains("open")){swClose();swBlockClick=true;}else if(d&&d.r.classList.contains("open")){swClose();swBlockClick=true;}return;}
 d.r.classList.remove("drag");swBlockClick=true;if(d.x<-d.W/2)swOpen(d.r);else swClose();};
document.addEventListener("pointerup",()=>{if(swBlockClick)setTimeout(()=>{swBlockClick=false;},400);},true);
document.addEventListener("pointerup",swEnd);document.addEventListener("dragstart",e=>{if(e.target.closest&&e.target.closest(".sw-main"))e.preventDefault();});document.addEventListener("pointercancel",e=>{const d=swDrag;swDrag=null;if(d){d.r.classList.remove("drag");d.m.style.transform=d.r.classList.contains("open")?`translateX(${-swW(d.r)}px)`:"";}});
document.addEventListener("click",e=>{if(swBlockClick&&e.target.closest(".sw-main")){e.preventDefault();e.stopPropagation();}swBlockClick=false;},true);
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
 if(type==="planif"&&parts.length===3&&(parts[2]==="poste"||parts[2]==="date")){state.pl&&(state.pl.h=null);render();return;}
 if(t.type==="checkbox"){const row=t.closest(".fs-task");row&&row.classList.toggle("done",v);const k=document.getElementById("fs-done");if(k){const all=document.querySelectorAll(".fs-task .fs-ok input");k.textContent=[...all].filter(x=>x.checked).length+"/"+all.length;}haptic();}
 const m=document.getElementById("fs-saved");if(m){m.textContent="Enregistré ✓";clearTimeout(feuilleInput.t);feuilleInput.t=setTimeout(()=>{m.textContent="Enregistré sur cet appareil"},1400);}
}
function feuilleAct(b,a){
 const F=feuilles(),type=b.dataset.type||b.dataset.k,id=b.dataset.id,inst=id?(F[type]||[]).find(x=>x.id===id):null;
 if(a==="fs-sw-edit"){nav("feuille/"+type+"/"+id);return;}
 if(inst&&a.startsWith("fs-g-")){const k=b.dataset.k,item=b.dataset.item,arr=inst.data[k]=inst.data[k]||[];
  if(a==="fs-g-toggle"||a==="fs-g-edit"){const g=b.closest(".grp"),body=g&&g.querySelector(".grp-body"),open=a==="fs-g-edit"?true:body&&body.hidden;
   if(body){body.hidden=!open;g.querySelector(".grp-head").setAttribute("aria-expanded",open);}state.fsOpen=open?item:"none:"+item;swClose();
   if(open&&body){const f=body.querySelector("input,textarea,select");if(a==="fs-g-edit"&&f)setTimeout(()=>f.focus(),60);}return;}
  if(a==="fs-g-ord"){state.grpRe=inst.id+"|"+k;render();return;}
  if(a==="fs-g-ord-done"){state.grpRe=null;render();return;}
  if(a==="fs-g-move"){const i=arr.findIndex(x=>x.id===item),j=i+(+b.dataset.d);if(i>=0&&j>=0&&j<arr.length){[arr[i],arr[j]]=[arr[j],arr[i]];inst.updated=todayISO();saveFeuilles(F);haptic();}render();return;}
  if(a==="fs-g-del"){const sp=b.querySelector("span");if(!b.dataset.armed){b.dataset.armed="1";sp.textContent="Confirmer";haptic("MEDIUM");setTimeout(()=>{if(b.isConnected&&b.dataset.armed){delete b.dataset.armed;sp.textContent="Supprimer";}},3500);return;}
   const it=arr.find(x=>x.id===item);inst.data[k]=arr.filter(x=>x.id!==item);
   if(type==="planif"&&k==="patients"&&it){const lab=fsPatLabel(it,arr.indexOf(it));inst.data.taches=(inst.data.taches||[]).filter(t=>t.patient!==lab);}
   inst.updated=todayISO();saveFeuilles(F);haptic("MEDIUM");toast(type==="planif"&&k==="patients"?"Patient et ses soins supprimés":"Supprimé");render();return;}
 }
 if(a==="fs-sw-ord"||a==="fs-ord"||a==="fs-ord-done"){
  if(a==="fs-ord-done"){state.fsReorder=null;render();return;}
  const list=fsSorted(type);list.forEach((x,i)=>{const it=F[type].find(y=>y.id===x.id);if(it)it.ord=i;});
  if(a==="fs-ord"){const i=list.findIndex(x=>x.id===id),j=i+(+b.dataset.d);if(j>=0&&j<list.length){const A=F[type].find(y=>y.id===list[i].id),B=F[type].find(y=>y.id===list[j].id);[A.ord,B.ord]=[B.ord,A.ord];haptic();}}
  saveFeuilles(F);state.fsReorder=type;render();return;}
 if(a==="fs-sw-del"){const sp=b.querySelector("span");if(!b.dataset.armed){b.dataset.armed="1";sp.textContent="Confirmer";haptic("MEDIUM");setTimeout(()=>{if(b.isConnected&&b.dataset.armed){delete b.dataset.armed;sp.textContent="Supprimer";}},3500);return;}
  const r=b.closest(".sw");F[type]=F[type].filter(x=>x.id!==id);saveFeuilles(F);haptic("MEDIUM");toast("Feuille supprimée");
  if(r){r.style.height=r.offsetHeight+"px";requestAnimationFrame(()=>{r.classList.add("gone");r.style.height="0px";});setTimeout(render,260);}else render();return;}
 if(a==="fs-new"){const it={id:cnId(),created:todayISO(),updated:todayISO(),data:{date:todayISO()}};
  if(type==="planif"){const s=stageInfo(),hh=new Date().getHours();if(hh>=19){const t=new Date();t.setDate(t.getDate()+1);t.setMinutes(t.getMinutes()-t.getTimezoneOffset());it.data.date=t.toISOString().slice(0,10);}it.data.poste=hh>=12&&hh<19?"Après-midi":"Matin";it.data.horaires=s.horaires||"";it.data.patients=[];state.pl=null;}
  if(type==="projet")it.data.pb=[{id:cnId()}];
  if(F[type].some(x=>x.ord!=null))it.ord=Math.min(...F[type].map(x=>x.ord??0))-1;
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
  if(!inst.data.poste)inst.data.poste=b.dataset.t;saveFeuilles(F);haptic();toast("Trame ajoutée : adaptez-la au service");if(document.getElementById("pl-list"))plRefresh(inst,"list");else render();return;}
 if(a==="fs-print"){printHTML(fsPrintDoc(type,inst));return;}
 if(type==="planif"&&inst){const d=inst.data,st=plState(d),v=b.dataset.v;
  if(a==="fs-plpat"){st.pat=v;plRefresh(inst,"add");return;}
  if(a==="fs-plh"){st.h=+v;plRefresh(inst,"add");return;}
  if(a==="fs-plm"){st.m=v;plRefresh(inst,"add");return;}
  if(a==="fs-plrep"){st.rep=v;plRefresh(inst,"add");return;}
  if(a==="fs-plfilter"){st.filter=v;plRefresh(inst,"list");return;}
  if(a==="fs-plview"){st.view=v;const aw=document.getElementById("pl-addwrap"),pw=document.getElementById("pl-planwrap");if(aw)aw.hidden=v!=="add";if(pw)pw.hidden=v!=="plan";
   document.querySelectorAll(".pl-seg button").forEach(x=>x.setAttribute("aria-pressed",x.dataset.v===v));const sg=document.querySelector(".pl-seg");if(sg){const y=sg.getBoundingClientRect().top+window.scrollY-8;if(window.scrollY>y||v==="plan")window.scrollTo(0,Math.max(0,y));}return;}
  if(a==="fs-pladd"||a==="fs-pltour"){const pats=a==="fs-pltour"?((d.patients||[]).filter(p=>p.chambre||p.initiales).map(fsPatLabel)):[st.pat];
   const times=a==="fs-pltour"?[plHM(st.h*60+(+st.m))]:plTimes(d,st),n=plAddTasks(inst,v,pats.length?pats:[""],times);inst.updated=todayISO();saveFeuilles(F);haptic();
   toast(n?`${v} · ${n>1?n+" ajouts":"ajouté à "+times[0]}`:"Déjà dans le planning");b.classList.add("ok");setTimeout(()=>b.classList.remove("ok"),500);plRefresh(inst,"list");return;}
  if(a==="fs-pltoggle"){const t=(d.taches||[]).find(x=>x.id===b.dataset.item);if(!t)return;t.fait=!t.fait;inst.updated=todayISO();saveFeuilles(F);haptic(t.fait?"LIGHT":"MEDIUM");plRefresh(inst,"list");return;}
  if(a==="fs-pl-edit"){state.plEdit=b.dataset.item;plRefresh(inst,"list");setTimeout(()=>{const x=document.querySelector(".pl-edit input[type=text]");x&&x.focus();},60);return;}
  if(a==="fs-pl-editdone"){state.plEdit=null;plRefresh(inst,"list");return;}
  if(a==="fs-pl-prio"){const t=(d.taches||[]).find(x=>x.id===b.dataset.item);if(!t)return;t.prio=!t.prio;saveFeuilles(F);haptic();toast(t.prio?"Soin prioritaire":"Priorité retirée");plRefresh(inst,"list");return;}
  if(a==="fs-pldel"){d.taches=(d.taches||[]).filter(x=>x.id!==b.dataset.item);saveFeuilles(F);haptic();plRefresh(inst,"list");return;}
 }
}

/* ---------- Impression ---------- */
function fsPrintFields(fields,data,blank){
 return `<table class="pt">${fields.map(f=>{const v=blank?"":data[f.k];return `<tr><th>${esc(f.l)}${blank&&f.ph?`<br><small>${esc(f.ph)}</small>`:""}</th><td${blank?` style="height:${Math.max(1,f.r||1)*7}mm"`:""}>${v===true?"☑":v===false?"☐":pe(v)}</td></tr>`}).join("")}</table>`;
}
function fsPrintDoc(type,inst){
 const S=SHEETS[type],blank=!inst,d=blank?{}:(inst.data||{}),title=blank?S.titre:S.titre+" · "+fsTitle(type,inst);
 if(type==="planif")return fsPrintPlanif(inst);
 if(type==="projet")return fsPrintProjet(inst);
 let h=`<section class="pp"><h1>${esc(title)}</h1><p class="psub">Carnet IFSI · initiales seulement, document à garder dans le service</p>`;
 S.sections.forEach(sec=>{h+=`<h2>${esc(sec.h)}</h2>`;
  if(sec.g){const items=blank?Array.from({length:sec.g.vide||2},()=>({})):(d[sec.g.k]||[]);items.forEach((it,i)=>{h+=`<div class="pj"><p><b>${esc(sec.g.label)} ${i+1}</b></p>${fsPrintFields(sec.g.f,it,blank)}</div>`;});}
  else h+=fsPrintFields(sec.f,d,blank);});
 return h+`</section>`;
}
function fsPrintProjet(inst){
 const blank=!inst,d=blank?{}:(inst.data||{}),pbs=blank?Array.from({length:5},()=>({})):(d.pb||[]).filter(x=>x.probleme||x.objectif||x.actions||x.evaluation);
 const who=blank?"Chambre ……  Initiales ……………  Âge ……  Date ……………":[d.chambre?"Ch. "+d.chambre:"",d.initiales||"",d.age?d.age+" ans":"",d.date?fmtISO(d.date):""].filter(Boolean).map(esc).join(" · ");
 let h=`<section class="pp pcompact pprojet ${blank?"blank-pj":""}"><div class="pc-head"><b>Projet de soins</b><span>${who}</span></div>
  <table class="pt pc pctx"><tr><th class="pc-l">Synthèse de la situation</th><td${blank?' style="height:16mm"':""}>${blank?"":pe(d.contexte)}</td></tr></table>
  <table class="pt pc ppj"><thead><tr><th style="width:27%">Problème</th><th style="width:21%">Objectif</th><th style="width:30%">Actions infirmières</th><th style="width:22%">Évaluation, résultats</th></tr></thead><tbody>
  ${pbs.length?pbs.map((x,i)=>`<tr><td><span class="ppn">${i+1}</span>${blank?`<small>☐ réel ☐ risque ☐ collaboration</small>`:pe(x.probleme)}${!blank&&x.type?`<br><small>${esc(x.type)}</small>`:""}</td><td>${blank?"":pe(x.objectif)}</td><td>${blank?"":pe(x.actions)}</td><td>${blank?"":pe(x.evaluation)}</td></tr>`).join(""):`<tr><td colspan="4">Aucun problème saisi.</td></tr>`}</tbody></table>
  <table class="pt pc pctx"><tr><th class="pc-l">Projet de vie, souhaits</th><td${blank?' style="height:10mm"':""}>${blank?"":pe(d.vie)}</td></tr><tr><th class="pc-l">Préparation de la sortie</th><td${blank?' style="height:10mm"':""}>${blank?"":pe(d.sortie)}</td></tr></table>
  <p class="psub">Problèmes classés par priorité (n° 1 le plus prioritaire). Types : diagnostic infirmier réel (problème lié à… se manifestant par…), de risque (risque de… lié à…), problème en collaboration. Objectif : « Le patient… », mesurable et daté.</p></section>`;
 return h;
}
function fsPrintPlanif(inst){
 const blank=!inst,d=blank?{}:(inst.data||{});
 const pats=blank?[{},{},{},{}]:(d.patients||[]).filter(p=>p.chambre||p.initiales);
 const labels=pats.map((p,i)=>fsPatLabel(p,i));
 const short={motif:"Motif",atcd:"ATCD, allergies",autonomie:"Autonomie",alim:"Alimentation",dispositifs:"Dispositifs",surv:"Surveillances",ttt:"Traitements",soins:"Soins prévus",examens:"Examens, RDV",vigilance:"Vigilance"};
 const F=SHEETS.planif.sections[1].g.f.filter(f=>short[f.k]);
 let h=`<section class="pp pcompact"><div class="pc-head"><b>Planification${blank?"":" · "+esc(fsTitle("planif",inst))}</b><span>${blank?"Date ……………… Poste ……………… Secteur ……………… Référent ………………":esc([d.horaires,d.secteur?"Secteur "+d.secteur:"",d.referent?"Référent "+d.referent:""].filter(Boolean).join(" · "))}</span></div>`;
 /* Patients : seules les rubriques remplies */
 if(pats.length){const rows=blank?[{k:"_",l:"Âge, isolement"},...F]:F.filter(f=>pats.some(p=>p[f.k]));
  for(let i=0;i<pats.length;i+=4){const g=pats.slice(i,i+4).map((p,j)=>[p,i+j]);
   h+=`<table class="pt pc ${blank?"pcb":""}"><tr><th class="pc-l">Patient</th>${g.map(([p,k])=>{const sub=blank?"":[p.age?p.age+" ans":"",p.isolement&&p.isolement!=="Aucun"?"isolement "+p.isolement.toLowerCase():""].filter(Boolean).join(" · ");
    return `<th>${blank?"Ch. ……  ………":esc(labels[k])}${sub?`<br><small>${esc(sub)}</small>`:""}</th>`}).join("")}</tr>
    ${rows.length?rows.map(f=>`<tr><th class="pc-l">${esc(short[f.k]||f.l)}</th>${g.map(([p])=>`<td>${blank?"":pe(p[f.k])}</td>`).join("")}</tr>`).join(""):""}</table>`;}}
 /* Planning en grille : heures × patients */
 h+=`<h2>Planning</h2>`;
 if(blank){const hours=[6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21];
  h+=`<table class="pt pc pgrid pcb"><tr><th class="pc-h">Heure</th><th>Patient 1</th><th>Patient 2</th><th>Patient 3</th><th>Patient 4</th></tr>${hours.map(x=>`<tr><th class="pc-h">${x} h</th><td></td><td></td><td></td><td></td></tr>`).join("")}</table>`;}
 else{const tasks=(d.taches||[]).slice().sort((a,b)=>plKey(a.heure,d)-plKey(b.heure,d));
  if(!tasks.length)h+=`<p class="psub">Aucun soin planifié.</p>`;
  else{const cols=[...(tasks.some(t=>!t.patient)?[""]:[]),...labels.filter(l=>tasks.some(t=>t.patient===l)),...[...new Set(tasks.map(t=>t.patient).filter(p=>p&&!labels.includes(p)))]];
   const hours=[];tasks.forEach(t=>{const k=(t.heure||"--").slice(0,2);if(!hours.includes(k))hours.push(k);});
   const cell=(hh,c)=>tasks.filter(t=>(t.heure||"--").slice(0,2)===hh&&(t.patient||"")===c).map(t=>{const mn=(t.heure||"").slice(3);return `<span class="pc-t ${t.fait?"ok":""}">${t.fait?"☑":"☐"} ${mn&&mn!=="00"?`<i>${hh}h${mn}</i> `:""}${esc(t.tache||"")}</span>`}).join("");
   if(cols.length<=5)h+=`<table class="pt pc pgrid"><tr><th class="pc-h">Heure</th>${cols.map(c=>`<th>${c?esc(c):"Tous"}</th>`).join("")}</tr>${hours.map(hh=>`<tr><th class="pc-h">${hh==="--"?"–":(+hh)+" h"}</th>${cols.map(c=>`<td>${cell(hh,c)}</td>`).join("")}</tr>`).join("")}</table>`;
   else h+=`<div class="pc-list">${tasks.map(t=>`<span class="pc-t ${t.fait?"ok":""}">${t.fait?"☑":"☐"} <i>${esc(t.heure||"")}</i> <b>${esc(t.patient||"Tous")}</b> ${esc(t.tache||"")}</span>`).join("")}</div>`;}}
 h+=`<h2>À transmettre</h2>${blank||!d.transmissions?`<div class="pc-box"></div>`:`<p>${pe(d.transmissions)}</p>`}
  <p class="psub">Priorités : urgences · heure fixe · douleur, sécurité · soins prévus · confort. Tout soin réalisé est tracé dans le dossier. Feuille détruite en fin de poste.</p></section>`;
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
