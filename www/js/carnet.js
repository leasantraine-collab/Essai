/* Carnet IFSI — carnet de suivi de stage : journal de bord, soins réalisés, objectifs, bilans, situations, heures, impression.
   Chargé avant app.js : les fonctions utilisent ses éléments (store, state, IC, render…) au moment de l'appel. */
const CN_SOINS=[
 ["Confort et hygiène",["Toilette complète au lit","Aide à la toilette au lavabo ou à la douche","Réfection de lit occupé","Installation et mobilisation, transferts","Prévention des escarres (évaluation, changements de position)","Soins de bouche","Aide au repas, surveillance des fausses routes","Aide à l'élimination (bassin, change, accompagnement)"]],
 ["Surveillance",["Prise des constantes (TA, FC, FR, SpO₂, T°)","Évaluation de la douleur avec une échelle","Glycémie capillaire","Réalisation d'un ECG","Bilan entrées-sorties, diurèse","Surveillance neurologique (Glasgow, pupilles)","Pesée, surveillance nutritionnelle"]],
 ["Soins techniques",["Injection sous-cutanée","Injection intramusculaire","Injection intraveineuse directe","Prélèvement veineux","Hémocultures","Pose de voie veineuse périphérique","Préparation et pose d'une perfusion","Gestion d'un pousse-seringue électrique","Pansement simple","Pansement complexe ou de plaie chronique","Ablation de fils ou d'agrafes","Sondage urinaire","Pose ou surveillance de sonde nasogastrique","Oxygénothérapie, aérosol","Aspiration trachéale ou bronchique","Utilisation d'une chambre implantable","Transfusion sanguine (avec IDE)","Surveillance de drains, redons"]],
 ["Médicaments",["Calcul de dose","Préparation des traitements (règle des 5B)","Administration per os","Administration de stupéfiants (avec traçabilité)","Surveillance des effets des traitements"]],
 ["Relation, éducation, organisation",["Accueil et entrée d'un patient","Entretien infirmier, recueil de données","Séance d'éducation thérapeutique","Transmissions écrites (ciblées)","Transmissions orales","Participation à la visite médicale","Préparation d'une sortie","Prise en charge globale de plusieurs patients","Accompagnement d'un patient en fin de vie"]]
];
const CN_RESSENTI=["Difficile","Mitigé","Correct","Bien","Très bien"];
const CN_STATUTS=[["todo","À travailler"],["cours","En cours"],["ok","Atteint"]];
const CN_SECS=[["journal","Journal"],["service","Mon service"],["soins","Soins réalisés"],["objectifs","Objectifs"],["competences","Compétences"],["bilans","Bilans"],["situations","Situations"],["heures","Heures"],["imprimer","Imprimer"]];
const HENDERSON=["Respirer","Boire et manger","Éliminer","Se mouvoir, maintenir une bonne posture","Dormir, se reposer","Se vêtir et se dévêtir","Maintenir la température du corps","Être propre, protéger ses téguments","Éviter les dangers","Communiquer","Agir selon ses croyances et valeurs","S'occuper en vue de se réaliser","Se divertir, se recréer","Apprendre"];

const carnet=()=>Object.assign({journal:[],soins:{},soinsPerso:[],obj:{},bilans:{mi:{},fin:{}},situations:[],questions:[],heures:[],svc:{},meds:[],lexique:[],comp:{},semaines:[]},store.get("carnet",{}));
const COMP_LEVELS=["–","Non pratiquée","À améliorer","En cours d'acquisition","Acquise"];
const saveCarnet=c=>store.set("carnet",c);
const cnId=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,5);
const cnHash=t=>{let h=0;for(const ch of t)h=(h*31+ch.charCodeAt(0))|0;return "o"+(h>>>0).toString(36);};
const todayISO=()=>{const d=new Date();d.setMinutes(d.getMinutes()-d.getTimezoneOffset());return d.toISOString().slice(0,10);};
const fmtISO=d=>d?new Date(d+"T12:00").toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"}):"Sans date";
const cnObjectifs=()=>(stageInfo().objectifs||"").split("\n").map(l=>l.replace(/^[\s•\-–*]+/,"").trim()).filter(Boolean);
const cnSvc=()=>{const l=stageInfo().lieu;return l?STAGES.find(s=>s.nom===l)||null:null;};
const plainMd=t=>String(t).replace(/\*\*/g,"");
const cnAllSoins=c=>{const sv=cnSvc();return [...(sv?[["Soins du service · "+sv.nom,sv.soins.map(plainMd)]]:[]),...CN_SOINS,...(c.soinsPerso.length?[["Autres soins",c.soinsPerso]]:[])];};
const cnMinutes=h=>{if(!h.debut||!h.fin)return 0;const [a,b]=h.debut.split(":").map(Number),[x,y]=h.fin.split(":").map(Number);let m=(x*60+y)-(a*60+b);if(m<0)m+=1440;return Math.max(0,m-(+h.pause||0));};
const fmtH=m=>`${Math.floor(m/60)} h ${String(m%60).padStart(2,"0")}`;
function cnStats(c){
 const soinsSeul=Object.values(c.soins).filter(v=>v.seul>0).length,actes=Object.values(c.soins).reduce((n,v)=>n+(v.obs||0)+(v.aide||0)+(v.seul||0),0);
 const objs=cnObjectifs(),atteints=objs.filter(o=>(c.obj[cnHash(o)]||{}).statut==="ok").length;
 const pres=c.heures.filter(h=>h.type!=="Absence"),minutes=pres.reduce((n,h)=>n+cnMinutes(h),0),abs=c.heures.filter(h=>h.type==="Absence").length;
 return {jours:c.journal.length,soinsSeul,actes,objs:objs.length,atteints,minutes,abs};
}

/* ---------- Champs génériques enregistrés à la saisie ---------- */
const cnField=(path,label,val,type="textarea",extra="")=>{const id="cn-"+path.replace(/\|/g,"-");
 if(type==="textarea")return `<label for="${id}">${label}<textarea id="${id}" data-cn="${path}" rows="3" ${extra}>${esc(val||"")}</textarea></label>`;
 return `<label for="${id}">${label}<input id="${id}" data-cn="${path}" type="${type}" value="${esc(val||"")}" ${extra}></label>`;};
const cnSelect=(path,label,val,opts)=>{const id="cn-"+path.replace(/\|/g,"-");return `<label for="${id}">${label}<select id="${id}" data-cn="${path}">${opts.map(o=>`<option ${o===val?"selected":""}>${esc(o)}</option>`).join("")}</select></label>`;};
function carnetInput(t){
 if(t.dataset.cn==="lieu"){const s=stageInfo();s.lieu=t.value;store.set("stage",s);haptic();toast(t.value?"Carnet personnalisé : "+t.value:"Lieu de stage retiré");render();return;}
 const c=carnet(),[list,id,field]=t.dataset.cn.split("|"),v=t.value;
 if(list==="bilans"){c.bilans[id]=c.bilans[id]||{};c.bilans[id][field]=v;}
 else if(list==="obj"||list==="comp"){c[list][id]=c[list][id]||{};c[list][id][field]=v;}
 else{const it=(c[list]||[]).find(x=>x.id===id);if(!it)return;it[field]=v;}
 saveCarnet(c);
 if(list==="heures"){const row=t.closest(".cn-h");if(row){const it=c.heures.find(x=>x.id===id);const d=row.querySelector(".cn-dur");if(d)d.textContent=it.type==="Absence"?"Absence":fmtH(cnMinutes(it));}const tot=document.getElementById("cn-htot");if(tot)tot.innerHTML=cnHeuresTotal(c);}
 if(field==="titre"||field==="date"||field==="moment"){const s=t.closest("details");const sum=s&&s.querySelector(".cn-sum-t");if(sum){const it=(c[list]||[]).find(x=>x.id===id);if(it)sum.textContent=list==="journal"?`${fmtISO(it.date)} · ${it.moment||"Journée"}`:list==="semaines"?`Semaine du ${fmtISO(it.date)}`:(it.titre||"Situation sans titre");}}
 const m=document.getElementById("cn-saved");if(m){m.textContent="Enregistré ✓";clearTimeout(carnetInput.t);carnetInput.t=setTimeout(()=>{m.textContent="Enregistré sur cet appareil"},1400);}
}

/* ---------- Sections ---------- */
function cnJournal(c){
 const list=c.journal.slice().sort((a,b)=>(b.date||"").localeCompare(a.date||""));
 return `<button class="btn block" data-act="cn-add" data-k="journal">${IC.plus}Ajouter une journée</button>
 ${list.length?list.map(j=>`<details class="cn-item" ${state.cnOpen===j.id?"open":""}><summary><span><span class="cn-sum-t">${esc(fmtISO(j.date))} · ${esc(j.moment||"Journée")}</span>${j.ressenti?`<small class="tag">${esc(j.ressenti)}</small>`:""}</span></summary>
  <div class="det-body cd-form">
   <div class="cd-row">${cnField(`journal|${j.id}|date`,"Date",j.date,"date")}${cnSelect(`journal|${j.id}|moment`,"Horaire",j.moment||"Journée",["Matin","Après-midi","Journée","Nuit"])}</div>
   ${cnField(`journal|${j.id}|patients`,"Patients pris en charge (sans nom : initiales, âge, motif)",j.patients,"textarea",'placeholder="Ex. Mme D., 82 ans, insuffisance cardiaque"')}
   ${cnField(`journal|${j.id}|activites`,"Soins et activités réalisés",j.activites,"textarea",'placeholder="Toilettes, constantes, pansement de Mme D., transmissions…"')}
   ${cnField(`journal|${j.id}|appris`,"Ce que j'ai appris",j.appris)}
   ${cnField(`journal|${j.id}|difficultes`,"Difficultés rencontrées",j.difficultes)}
   ${cnField(`journal|${j.id}|recherches`,"À revoir ou à rechercher ce soir",j.recherches,"textarea",'placeholder="Pathologie, médicament, protocole…"')}
   ${cnSelect(`journal|${j.id}|ressenti`,"Mon ressenti de la journée",j.ressenti||"",["",...CN_RESSENTI])}
   <button class="link danger" data-act="cn-del" data-k="journal" data-id="${j.id}">Supprimer cette journée</button>
  </div></details>`).join(""):`<div class="empty">Notez chaque jour en quelques minutes ce que vous avez fait, appris et ce qui vous a posé question. C'est la base de vos bilans et de votre portfolio.</div>`}`;
}
function cnSoins(c){
 const S=cnStats(c);
 return `<div class="cn-help"><p>À chaque fois que vous réalisez un soin, touchez <b>+</b> sous <b>Observé</b>, <b>Avec aide</b> ou <b>Seul·e</b>. Le <b>−</b> corrige une erreur. Vous voyez ainsi votre progression d'un coup d'œil, et vous avez des exemples précis pour vos bilans.</p></div>
 <div class="cn-kpi"><span><b data-kpi="soinsSeul">${S.soinsSeul}</b>soins réalisés seul·e</span><span><b data-kpi="actes">${S.actes}</b>actes notés</span></div>
 ${cnAllSoins(c).map(([g,items])=>`<section class="stack-sm"><h3 class="cn-g">${esc(g)}</h3><div class="list">${items.map(n=>{const k=cnHash(n),v=c.soins[k]||{};
   return `<div class="cn-soin ${v.seul?"acq":""}"><span class="t">${esc(n)}</span><span class="cn-cnt">${[["obs","Observé"],["aide","Avec aide"],["seul","Seul·e"]].map(([f,l])=>`<span class="cn-step" data-f="${f}"><small>${l}</small><span class="cn-ctl"><button data-act="cn-count" data-k="${k}" data-f="${f}" data-d="-1" aria-label="${esc(n)} : retirer 1 à ${l}" ${v[f]?"":"disabled"}>−</button><b aria-live="polite">${v[f]||0}</b><button data-act="cn-count" data-k="${k}" data-f="${f}" data-d="1" aria-label="${esc(n)} : ajouter 1 à ${l}">+</button></span></span>`).join("")}</span></div>`}).join("")}</div></section>`).join("")}
 <form id="cn-soin-form" class="cd-form cn-inline"><label for="cn-soin-new">Ajouter un soin propre à ce service<input id="cn-soin-new" maxlength="80" placeholder="Ex. Soins de trachéotomie" autocomplete="off"></label><button class="btn" type="submit">${IC.plus}Ajouter</button></form>`;
}
function cnObjectifsSec(c){
 const objs=cnObjectifs();
 return `<div class="cn-help"><p>Vos objectifs viennent de « Mes objectifs de stage ». Faites le point chaque semaine, puis avec votre tuteur au bilan.</p><a class="link" href="#stages">Trouver des objectifs dans le guide des lieux de stage</a></div>
 ${objs.length?`<div class="stack-sm">${objs.map(o=>{const k=cnHash(o),v=c.obj[k]||{};return `<div class="cn-obj sheet-body"><p class="t">${esc(o)}</p>
  <div class="seg three" role="group" aria-label="Avancée">${CN_STATUTS.map(([s,l])=>`<button data-act="cn-statut" data-k="${k}" data-f="${s}" aria-pressed="${(v.statut||"todo")===s}">${l}</button>`).join("")}</div>
  <div class="cd-form">${cnField(`obj|${k}|note`,"Actions menées, exemples, remarques du tuteur",v.note)}</div></div>`}).join("")}</div>`:`<div class="empty">Aucun objectif pour l'instant. Ajoutez-en ci-dessous ou depuis le guide des lieux de stage.</div>`}
 ${(()=>{const sv=cnSvc();if(!sv)return "";const i=STAGES.indexOf(sv),mine=stageInfo().objectifs||"";
  return `<section class="stack-sm"><h3 class="cn-g">Objectifs proposés · ${esc(sv.nom)}</h3><ul class="svc-obj">${sv.obj.map((o,j)=>{const on=mine.includes(objText(o[1]));return `<li>${state.ueRef==="2009"?`<span class="comp" title="${esc(COMP[o[0]])}">C${o[0]}</span>`:""}<span>${md(o[1])}</span><button class="del add" data-act="obj-add" data-s="${i}" data-i="${j}" aria-pressed="${on}" aria-label="${on?"Déjà dans mes objectifs":"Ajouter à mes objectifs"}">${on?IC.check:IC.plus}</button></li>`}).join("")}</ul></section>`;})()}
 <form id="cn-obj-form" class="cd-form cn-inline"><label for="cn-obj-new">Nouvel objectif<input id="cn-obj-new" maxlength="160" placeholder="Ex. Réaliser une prise en charge globale de 3 patients" autocomplete="off"></label><button class="btn" type="submit">${IC.plus}Ajouter</button></form>`;
}
function cnService(c){
 const sv=cnSvc();
 if(!sv)return `<div class="empty">Choisissez votre lieu de stage en haut du carnet : vous retrouverez ici les pathologies et traitements du service à cocher au fil du stage.</div>${cnMemo(c)}`;
 const chk=(lab,items)=>`<section class="stack-sm"><h3 class="cn-g">${lab}</h3><div class="list">${items.map(x=>{const k=cnHash(plainMd(x)),v=c.svc[k]||{};
   return `<div class="cn-svc-row"><span class="t">${md(x)}</span><span class="cn-tog">${[["vu","Rencontré"],["revu","Révisé"]].map(([f,l])=>`<button class="chip" data-act="cn-svc" data-k="${k}" data-f="${f}" aria-pressed="${!!v[f]}">${l}</button>`).join("")}</span></div>`}).join("")}</div></section>`;
 const links=(sv.fiches||[]).map(id=>{const f=FICHES.find(x=>x.id===id),co=f?null:COURS.find(x=>x.id===id&&!x.pro),it=f||co;return it?`<a class="chip" href="#${f?"fiche":"cours"}/${id}">${esc(it.titre)}</a>`:"";}).join("");
 const all=[...sv.patho,...sv.thera].map(x=>c.svc[cnHash(plainMd(x))]||{}),vu=all.filter(v=>v.vu).length,revu=all.filter(v=>v.revu).length;
 return `<div class="cn-help"><p>Touchez <b>Rencontré</b> quand vous voyez la pathologie ou le traitement en stage, puis <b>Révisé</b> une fois la fiche relue. Le soir, révisez en priorité ce que vous avez rencontré dans la journée.</p></div>
 <div class="cn-kpi"><span><b data-kpi="svcVu">${vu}/${all.length}</b>rencontrés</span><span><b data-kpi="svcRevu">${revu}/${all.length}</b>révisés</span></div>
 ${chk("Pathologies du service",sv.patho)}${chk("Thérapeutiques du service",sv.thera)}
 ${links?`<section class="stack-sm"><h3 class="cn-g">Fiches à réviser dans l'appli</h3><div class="chips wrapchips">${links}</div></section>`:""}
 ${cnMemo(c)}`;
}
function cnMemo(c){
 const del=(k,id)=>`<button class="link danger" data-act="cn-del" data-k="${k}" data-id="${id}">Supprimer</button>`;
 return `<section class="stack-sm"><h3 class="cn-g">Mon mémo · médicaments rencontrés</h3>
  ${c.meds.map(m=>`<div class="sheet-body cd-form cn-memo">${cnField(`meds|${m.id}|nom`,"Médicament (DCI ou nom commercial)",m.nom,"text",'maxlength="80" autocomplete="off"')}${cnField(`meds|${m.id}|classe`,"Classe et indication",m.classe,"text",'maxlength="120"')}${cnField(`meds|${m.id}|surv`,"Surveillance, points de vigilance",m.surv,"textarea",'rows="2"')}${del("meds",m.id)}</div>`).join("")}
  <button class="btn ghost block" data-act="cn-add" data-k="meds">${IC.plus}Ajouter un médicament</button></section>
 <section class="stack-sm"><h3 class="cn-g">Mon mémo · sigles et vocabulaire du service</h3>
  ${c.lexique.map(l=>`<div class="sheet-body cd-form cn-memo"><div class="cd-row">${cnField(`lexique|${l.id}|terme`,"Terme ou sigle",l.terme,"text",'maxlength="40" autocomplete="off"')}${cnField(`lexique|${l.id}|def`,"Signification",l.def,"text",'maxlength="140"')}</div>${del("lexique",l.id)}</div>`).join("")}
  <button class="btn ghost block" data-act="cn-add" data-k="lexique">${IC.plus}Ajouter un terme</button></section>`;
}
function cnComp(c){
 const fin=Object.values(c.comp),acq=fin.filter(v=>v.fin==="Acquise").length,cours=fin.filter(v=>v.fin==="En cours d'acquisition").length;
 return `<div class="cn-help"><p>Auto-évaluez chaque compétence avant le bilan de mi-stage, puis avant celui de fin de stage, avec un exemple concret qui le montre. Comparez ensuite avec l'évaluation de votre tuteur.</p>${state.ueRef==="2026"?`<p class="muted">Grille des 10 compétences du référentiel 2009. Si votre portfolio utilise une autre grille, servez-vous de celle-ci pour préparer l'échange avec votre tuteur.</p>`:""}</div>
 <div class="cn-kpi"><span><b>${acq}/10</b>acquises en fin de stage</span><span><b>${cours}</b>en cours d'acquisition</span></div>
 <div class="stack-sm">${Object.entries(COMP).map(([n,t])=>{const v=c.comp[n]||{};return `<div class="sheet-body cd-form cn-comp"><p class="t"><span class="comp">C${n}</span> ${esc(t)}</p>
  <div class="cd-row">${cnSelect(`comp|${n}|mi`,"Mi-stage",v.mi||"–",COMP_LEVELS)}${cnSelect(`comp|${n}|fin`,"Fin de stage",v.fin||"–",COMP_LEVELS)}</div>
  ${cnField(`comp|${n}|ex`,"Situations, exemples qui le montrent",v.ex,"textarea",'rows="2"')}</div>`}).join("")}</div>`;
}
function cnSemaines(c){
 const weeks=c.semaines.slice().sort((a,b)=>(b.date||"").localeCompare(a.date||""));
 return `<section class="stack-sm"><h3 class="cn-g">Points d'étape de la semaine</h3><p class="muted">Chaque fin de semaine, cinq minutes pour faire le point : c'est ce qui rend les bilans faciles.</p>
  ${weeks.map(w=>`<details class="cn-item" ${state.cnOpen===w.id?"open":""}><summary><span><span class="cn-sum-t">Semaine du ${esc(fmtISO(w.date))}</span></span></summary><div class="det-body cd-form">
   ${cnField(`semaines|${w.id}|date`,"Semaine du",w.date,"date")}${cnField(`semaines|${w.id}|progres`,"Ce qui a progressé cette semaine",w.progres)}${cnField(`semaines|${w.id}|travail`,"Ce que je travaille la semaine prochaine",w.travail)}${cnField(`semaines|${w.id}|tuteur`,"Retour du tuteur ou de l'équipe",w.tuteur)}
   <button class="link danger" data-act="cn-del" data-k="semaines" data-id="${w.id}">Supprimer ce point</button></div></details>`).join("")}
  <button class="btn ghost block" data-act="cn-add" data-k="semaines">${IC.plus}Faire le point de la semaine</button></section>`;
}
function cnBilans(c){
 const S=cnStats(c),objs=cnObjectifs(),top=cnAllSoins(c).flatMap(([,i])=>i).filter(n=>(c.soins[cnHash(n)]||{}).seul>0);
 const block=(k,titre)=>{const b=c.bilans[k]||{};return `<section class="sheet-body cd-form"><h3>${titre}</h3>
  ${cnField(`bilans|${k}|date`,"Date du bilan",b.date,"date")}
  ${cnField(`bilans|${k}|forts`,"Mes points forts",b.forts)}
  ${cnField(`bilans|${k}|ameliorer`,"Mes axes d'amélioration",b.ameliorer)}
  ${cnField(`bilans|${k}|suite`,k==="mi"?"Objectifs pour la deuxième partie du stage":"Objectifs pour le prochain stage",b.suite)}
  ${cnField(`bilans|${k}|tuteur`,"Remarques du tuteur et de l'équipe",b.tuteur)}</section>`;};
 return `<div class="sheet-body cn-prep"><h3>Préparer mon bilan</h3>
  <div class="cn-kpi"><span><b>${S.jours}</b>jours notés</span><span><b>${S.soinsSeul}</b>soins faits seul·e</span><span><b>${S.atteints}/${S.objs}</b>objectifs atteints</span></div>
  ${(()=>{const v=Object.values(c.comp),a=v.filter(x=>x.mi==="Acquise"||x.fin==="Acquise").length;return v.length?`<p class="muted">Compétences auto-évaluées : ${v.filter(x=>(x.fin||x.mi)&&(x.fin||x.mi)!=="–").length}/10, dont ${a} acquise${a>1?"s":""}.</p>`:`<p class="muted">Pensez à remplir l'onglet Compétences avant le bilan.</p>`;})()}
  ${top.length?`<p class="muted">Soins déjà réalisés seul·e : ${top.slice(0,12).map(esc).join(", ")}${top.length>12?"…":""}</p>`:""}
  ${objs.length?`<ul class="clean">${objs.map(o=>{const st=(c.obj[cnHash(o)]||{}).statut||"todo";return `<li>${esc(o)} <span class="tag ${st==="ok"?"done":""}">${CN_STATUTS.find(x=>x[0]===st)[1]}</span></li>`}).join("")}</ul>`:""}
  <p class="muted">Avant le bilan : relisez votre journal, choisissez 2 ou 3 situations concrètes qui montrent vos progrès, et préparez vos questions.</p></div>
 ${block("mi","Bilan de mi-stage")}${block("fin","Bilan de fin de stage")}`;
}
function cnSituations(c){
 const list=c.situations.slice().sort((a,b)=>(b.date||"").localeCompare(a.date||""));
 return `<div class="cn-help"><p>Notez à chaud les situations qui vous ont marqué·e ou questionné·e. Elles serviront à vos analyses de situation et à votre portfolio. Ne notez jamais le nom d'un patient.</p></div>
 <button class="btn block" data-act="cn-add" data-k="situations">${IC.plus}Ajouter une situation</button>
 ${list.map(s=>`<details class="cn-item" ${state.cnOpen===s.id?"open":""}><summary><span><span class="cn-sum-t">${esc(s.titre||"Situation sans titre")}</span>${s.date?`<small class="muted">${esc(fmtShort(at(s.date,"12:00")))}</small>`:""}</span></summary>
  <div class="det-body cd-form">
   <div class="cd-row">${cnField(`situations|${s.id}|titre`,"Titre",s.titre,"text",'maxlength="80" placeholder="Ex. Refus de soin d\'une patiente"')}${cnField(`situations|${s.id}|date`,"Date",s.date,"date")}</div>
   ${cnField(`situations|${s.id}|description`,"Que s'est-il passé ? (contexte, acteurs, faits)",s.description)}
   ${cnField(`situations|${s.id}|questionnement`,"Qu'est-ce qui m'a questionné·e ? Qu'ai-je ressenti ?",s.questionnement)}
   ${cnField(`situations|${s.id}|liens`,"Liens avec mes cours, recherches, textes de loi",s.liens)}
   ${cnField(`situations|${s.id}|retenu`,"Ce que j'en retiens pour ma pratique",s.retenu)}
   <button class="link danger" data-act="cn-del" data-k="situations" data-id="${s.id}">Supprimer cette situation</button>
  </div></details>`).join("")}
 <section class="stack-sm"><h3 class="cn-g">Questions à poser ou à rechercher</h3>
  ${c.questions.length?`<div class="list" style="padding:4px 14px">${c.questions.map(q=>`<div class="chk cn-q"><input type="checkbox" id="cnq-${q.id}" data-act="cn-qdone" data-id="${q.id}" ${q.done?"checked":""}><label for="cnq-${q.id}" class="${q.done?"done":""}">${esc(q.txt)}</label><button class="del" data-act="cn-del" data-k="questions" data-id="${q.id}" aria-label="Supprimer">${IC.x}</button></div>`).join("")}</div>`:""}
  <form id="cn-q-form" class="cd-form cn-inline"><label for="cn-q-new">Nouvelle question<input id="cn-q-new" maxlength="160" placeholder="Ex. Pourquoi ce patient a-t-il deux anticoagulants ?" autocomplete="off"></label><button class="btn" type="submit">${IC.plus}Ajouter</button></form></section>`;
}
const cnHeuresTotal=c=>{const S=cnStats(c);return `<span><b>${fmtH(S.minutes)}</b>effectuées</span><span><b>${c.heures.filter(h=>h.type!=="Absence").length}</b>jours de présence</span><span><b>${S.abs}</b>absence${S.abs>1?"s":""}</span>`;};
function cnHeures(c){
 const list=c.heures.slice().sort((a,b)=>(b.date||"").localeCompare(a.date||""));
 return `<div class="cn-help"><p>Les heures de stage sont comptées : notez vos horaires réels et vos absences, à récupérer selon les règles de votre IFSI.</p></div>
 <div class="cn-kpi" id="cn-htot">${cnHeuresTotal(c)}</div>
 <button class="btn block" data-act="cn-add" data-k="heures">${IC.plus}Ajouter une journée</button>
 ${list.length?`<div class="stack-sm">${list.map(h=>`<div class="cn-h sheet-body cd-form"><div class="cn-h-top"><b>${esc(fmtISO(h.date))}</b><span class="cn-dur">${h.type==="Absence"?"Absence":fmtH(cnMinutes(h))}</span></div>
  <div class="cd-row">${cnField(`heures|${h.id}|date`,"Date",h.date,"date")}${cnSelect(`heures|${h.id}|type`,"Type",h.type||"Présence",["Présence","Absence","Récupération"])}</div>
  <div class="cn-row3">${cnField(`heures|${h.id}|debut`,"Début",h.debut,"time")}${cnField(`heures|${h.id}|fin`,"Fin",h.fin,"time")}${cnField(`heures|${h.id}|pause`,"Pause (min)",h.pause,"number",'min="0" step="5" inputmode="numeric"')}</div>
  <button class="link danger" data-act="cn-del" data-k="heures" data-id="${h.id}">Supprimer</button></div>`).join("")}</div>`:""}`;
}
function cnImprimer(){
 const card=(k,titre,txt)=>`<div class="sheet-body cn-print"><h3>${titre}</h3><p class="muted">${txt}</p><button class="btn" data-act="cn-print" data-k="${k}">${IC.sheet}Imprimer</button></div>`;
 return `${card("rempli",cnSvc()?"Mon carnet · "+esc(cnSvc().nom):"Mon carnet rempli","Infos du stage, objectifs et avancée, journal de bord, soins réalisés, situations, questions, bilans et feuille d'heures, avec un emplacement pour les signatures.")}
 ${card("vierge",cnSvc()?"Carnet vierge · "+esc(cnSvc().nom):"Un carnet vierge",cnSvc()?"La même structure à remplir à la main, avec les soins, objectifs et repères de ce service : pratique dans la poche de sa tenue.":"La même structure à remplir à la main : pratique pour garder un carnet papier dans la poche de sa tenue.")}
 <div class="sheet-body cn-print"><h3>Sauvegarder mon carnet</h3><p class="muted">Vos données restent sur cet iPad. Gardez une copie dans Fichiers ou iCloud : elle permet de tout récupérer si vous supprimez l'appli ou changez d'appareil.</p><button class="btn ghost" data-act="backup">Sauvegarder mes données</button></div>
 ${card("patient","Des fiches patient","Une fiche de recueil de données par patient : identité, constantes, traitements, 14 besoins de Virginia Henderson, planification et transmissions.")}
 <p class="muted">Sur iPad, le bouton ouvre la fenêtre d'impression. Vous pouvez imprimer ou enregistrer en PDF (bouton Partager de l'aperçu). Si rien ne s'ouvre, ouvrez l'appli dans Safari et utilisez Partager → Imprimer. Ne notez pas de nom de patient sur un document qui sort du service.</p>`;
}

function cnLieuCard(){
 const sv=cnSvc(),lieu=stageInfo().lieu||"";
 const sel=`<label for="cn-lieu-sel" class="cn-lieu-pick"><span class="eyebrow">Mon lieu de stage</span><select id="cn-lieu-sel" data-cn="lieu"><option value="">Choisir le service…</option>${STAGES.map(x=>`<option ${x.nom===lieu?"selected":""}>${esc(x.nom)}</option>`).join("")}</select></label>`;
 if(!sv)return `<section class="cd-card cn-lieu cd-form">${sel}<p class="muted">Choisissez le service parmi les ${STAGES.length} lieux du guide : le carnet ajoute ses soins au suivi, vous propose ses objectifs et prépare un carnet personnalisé à imprimer.</p></section>`;
 return `<section class="cd-card cn-lieu cd-form">${sel}<p class="svc-intro">${md(sv.intro||"")}</p>
  <p class="muted">${plural(sv.soins.length,"soin")} du service ajouté${sv.soins.length>1?"s":""} au suivi · ${plural(sv.obj.length,"objectif")} proposé${sv.obj.length>1?"s":""} · ${plural(sv.patho.length,"pathologie")} à connaître</p></section>`;
}
function cnApercu(){
 const sv=cnSvc();
 return `<div class="stack-lg">${backBtn("Carnet de suivi")}
  ${vh("Mon carnet",sv?"Carnet de suivi · "+esc(sv.nom):"Carnet de suivi de stage",sv?"Votre carnet complet, personnalisé pour ce lieu de stage. Il se met à jour à chaque saisie.":"Choisissez votre lieu de stage dans le carnet pour le personnaliser.")}
  <div class="btn-row"><button class="btn" data-act="cn-print" data-k="rempli">${IC.sheet}Imprimer mon carnet</button><button class="btn ghost" data-act="cn-print" data-k="vierge">Imprimer la version vierge</button></div>
  <div class="pdoc paper">${cnPrintDoc("rempli")}</div>
  <button class="btn ghost block" data-act="back">Retour au carnet</button></div>`;
}

/* ---------- Vue ---------- */
function vCarnet(arg){
 if(arg==="apercu")return cnApercu();
 const sec=CN_SECS.some(s=>s[0]===arg)?arg:"journal",c=carnet(),S=cnStats(c),st=stageInfo();
 const body={journal:cnJournal,service:cnService,competences:cnComp,soins:cnSoins,objectifs:cnObjectifsSec,bilans:c=>cnBilans(c)+cnSemaines(c),situations:cnSituations,heures:cnHeures,imprimer:cnImprimer}[sec](c);
 return `<div class="stack-lg">${backBtn("Stages")}
  ${vh("Stage","Carnet de suivi de stage",st.service?esc(st.service)+(st.debut?" · du "+esc(fmtShort(at(st.debut,"12:00")))+(st.fin?" au "+esc(fmtShort(at(st.fin,"12:00"))):""):""):"Renseignez le service et les dates dans les infos du stage.")}
  ${cnLieuCard()}
  <div class="cn-kpi cn-top"><span><b>${S.jours}</b>jours notés</span><span><b data-kpi="soinsSeul">${S.soinsSeul}</b>soins seul·e</span><span><b>${S.atteints}/${S.objs}</b>objectifs</span><span><b>${Math.floor(S.minutes/60)} h</b>de stage</span></div>
  <div class="chips cn-tabs" role="tablist" aria-label="Sections du carnet">${CN_SECS.map(([k,l])=>`<button class="chip" role="tab" data-act="cn-sec" data-k="${k}" aria-pressed="${k===sec}">${l}</button>`).join("")}</div>
  <div class="section-title"><h2>${CN_SECS.find(s=>s[0]===sec)[1]}</h2>${sec!=="imprimer"?`<span class="muted" id="cn-saved">Enregistré sur cet appareil</span>`:""}</div>
  <div class="stack">${body}</div>
  <a class="btn block cn-final" href="#carnet/apercu">${IC.sheet}Voir mon carnet de suivi${cnSvc()?" · "+esc(cnSvc().nom):" personnalisé"}</a></div>`;
}
function carnetCard(){
 const c=carnet(),S=cnStats(c);
 return `<a class="cd-card cn-entry" href="#carnet"><span class="cd-ic">${IC.sheet}</span><span><b>Carnet de suivi de stage</b><small>${stageInfo().lieu?esc(stageInfo().lieu)+" · ":""}${S.jours||S.actes?`${S.jours} jour${S.jours>1?"s":""} notés · ${S.soinsSeul} soins faits seul·e · ${S.atteints}/${S.objs} objectifs`:"Journal de bord, soins réalisés, objectifs, bilans, heures. À remplir ou à imprimer."}</small></span><svg class="chev" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></a>`;
}

/* ---------- Actions ---------- */
function cnFocusTabs(){const t=document.querySelector(".cn-tabs");if(!t)return;const y=t.getBoundingClientRect().top+window.scrollY-8;window.scrollTo(0,Math.max(0,y));
 const on=t.querySelector('[aria-pressed="true"]');if(on)t.scrollTo({left:Math.max(0,on.offsetLeft-t.clientWidth/2+on.clientWidth/2)});}
function carnetAct(b,a){
 const c=carnet(),k=b.dataset.k,id=b.dataset.id;
 if(a==="cn-sec"){location.replace("#carnet/"+k);setTimeout(cnFocusTabs,40);return;}
 if(a==="cn-add"){const it={id:cnId(),date:todayISO()};
  if(k==="heures"){const s=stageInfo();it.type="Présence";it.debut=s.arrivee||"";it.pause="";}
  c[k].push(it);saveCarnet(c);state.cnOpen=it.id;haptic();render();
  setTimeout(()=>{const el=document.querySelector(`[data-cn^="${k}|${it.id}"]`);el&&el.scrollIntoView({block:"center"});},50);return;}
 if(a==="cn-del"){if(!b.dataset.armed){b.dataset.armed="1";const t=b.innerHTML;b.textContent="Toucher à nouveau pour supprimer";setTimeout(()=>{if(b.isConnected){delete b.dataset.armed;b.innerHTML=t;}},3500);return;}
  c[k]=c[k].filter(x=>x.id!==id);saveCarnet(c);haptic("MEDIUM");toast("Supprimé");render();return;}
 if(a==="cn-count"){const f=b.dataset.f,v=c.soins[k]||{obs:0,aide:0,seul:0};v[f]=Math.max(0,(v[f]||0)+(+b.dataset.d||1));c.soins[k]=v;saveCarnet(c);haptic();
  const st=b.closest(".cn-step");st.querySelector("b").textContent=v[f];st.querySelector('[data-d="-1"]').disabled=!v[f];b.closest(".cn-soin").classList.toggle("acq",v.seul>0);
  const S=cnStats(c);document.querySelectorAll("[data-kpi]").forEach(el=>{if(S[el.dataset.kpi]!=null)el.textContent=S[el.dataset.kpi];});return;}
 if(a==="cn-statut"){c.obj[k]=c.obj[k]||{};c.obj[k].statut=b.dataset.f;saveCarnet(c);haptic();if(b.dataset.f==="ok")toast("Objectif atteint, bravo");render();return;}
 if(a==="cn-qdone"){const q=c.questions.find(x=>x.id===id);if(q){q.done=b.checked;saveCarnet(c);const l=b.parentNode.querySelector("label");l&&l.classList.toggle("done",q.done);}return;}
 if(a==="cn-print"){cnPrint(k);return;}
 if(a==="cn-svc"){const v=c.svc[k]||{};v[b.dataset.f]=!v[b.dataset.f];c.svc[k]=v;saveCarnet(c);haptic();b.setAttribute("aria-pressed",v[b.dataset.f]);
  const sv=cnSvc();if(sv){const all=[...sv.patho,...sv.thera].map(x=>c.svc[cnHash(plainMd(x))]||{});const e1=document.querySelector('[data-kpi="svcVu"]'),e2=document.querySelector('[data-kpi="svcRevu"]');
   if(e1)e1.textContent=all.filter(x=>x.vu).length+"/"+all.length;if(e2)e2.textContent=all.filter(x=>x.revu).length+"/"+all.length;}return;}
 if(a==="cn-lieu-set"){const s=stageInfo();s.lieu=k;store.set("stage",s);haptic();toast("Lieu de stage : "+k);render();return;}
}
function carnetSubmit(f){
 const c=carnet();
 if(f.id==="cn-soin-form"){const v=document.getElementById("cn-soin-new").value.trim();if(!v)return;if(!cnAllSoins(c).flatMap(([,i])=>i).includes(v)){c.soinsPerso.push(v);saveCarnet(c);}toast("Soin ajouté");render();}
 else if(f.id==="cn-obj-form"){const v=document.getElementById("cn-obj-new").value.trim();if(!v)return;const s=stageInfo();s.objectifs=(s.objectifs?s.objectifs.replace(/\s+$/,"")+"\n":"")+"• "+v;store.set("stage",s);toast("Objectif ajouté");render();}
 else if(f.id==="cn-q-form"){const v=document.getElementById("cn-q-new").value.trim();if(!v)return;c.questions.push({id:cnId(),txt:v,done:false});saveCarnet(c);render();setTimeout(()=>{const i=document.getElementById("cn-q-new");i&&i.focus()},0);}
}

/* ---------- Impression ---------- */
const pe=s=>esc(s||"").replace(/\n/g,"<br>");
const lines=n=>`<div class="pl">${"<i></i>".repeat(n)}</div>`;
function cnPrintInfos(blank){
 const s=blank?{}:stageInfo(),row=(l,v,k)=>`<tr><th>${l}</th><td>${blank&&!k?"":pe(v)}</td></tr>`;
 return `<table class="pt">${row("Étudiant·e","")}${row("Lieu de stage",(cnSvc()||{}).nom,true)}${row("Service, établissement",s.service)}${row("Type de stage",s.type)}${row("Semestre",s.sem)}${row("Dates",s.debut?`du ${fmtISO(s.debut)}${s.fin?" au "+fmtISO(s.fin):""}`:"")}${row("Horaires",s.horaires)}${row("Lieu de rendez-vous",s.adresse)}${row("Tuteur ou tutrice",s.tuteur)}${row("Cadre de santé",s.cadre)}${row("Téléphone du service",s.tel)}</table>`;
}
function cnSvcPage(sv,c,blank){
 const L=(t,a,ck)=>a&&a.length?`<div><h3>${t}</h3><ul>${a.map(x=>{let m="";if(ck){const v=blank?{}:(c.svc[cnHash(plainMd(x))]||{});m=` <span class="pck">${v.vu?"☑":"☐"} rencontré ${v.revu?"☑":"☐"} révisé</span>`;}return `<li>${md(x)}${m}</li>`;}).join("")}</ul></div>`:"";
 const fiches=(sv.fiches||[]).map(id=>{const it=FICHES.find(x=>x.id===id)||COURS.find(x=>x.id===id&&!x.pro);return it?esc(it.titre):"";}).filter(Boolean);
 return `<section class="pp"><h1>Mon service · ${esc(sv.nom)}</h1><p class="psub">${md(sv.intro||"")}</p>
  <div class="psvc">${L("Pathologies à connaître",sv.patho,1)}${L("Thérapeutiques à connaître",sv.thera,1)}${L("Soins rencontrés",sv.soins)}${fiches.length?`<div><h3>À réviser dans Carnet IFSI</h3><ul>${fiches.map(f=>`<li>${f}</li>`).join("")}</ul></div>`:""}
  ${sv.pieges&&sv.pieges.length?`<div class="pwarn"><h3>Erreurs fréquentes dans ce service</h3><ul>${sv.pieges.map(x=>`<li>${md(x)}</li>`).join("")}</ul></div>`:""}</div></section>`;
}
function cnPrintDoc(kind){
 const c=carnet(),st=stageInfo(),soins=cnAllSoins(c),sv=cnSvc();
 if(kind==="patient")return `<section class="pp"><h1>Fiche patient · recueil de données</h1>
  <table class="pt"><tr><th>Chambre</th><td></td><th>Initiales, âge</th><td></td></tr><tr><th>Date d'entrée</th><td></td><th>Motif d'hospitalisation</th><td></td></tr><tr><th>Antécédents</th><td colspan="3"></td></tr><tr><th>Allergies</th><td colspan="3"></td></tr><tr><th>Mode de vie, entourage</th><td colspan="3"></td></tr></table>
  <h2>Constantes</h2><table class="pt pg"><tr><th>Heure</th>${"<td></td>".repeat(6)}</tr>${["TA","FC","FR","SpO₂","T°","Douleur","Glycémie","Diurèse"].map(x=>`<tr><th>${x}</th>${"<td></td>".repeat(6)}</tr>`).join("")}</table>
  <h2>Traitements</h2><table class="pt pg"><tr><th>Médicament, dose, voie</th><th>8 h</th><th>12 h</th><th>18 h</th><th>22 h</th><th>Surveillance</th></tr>${"<tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>".repeat(6)}</table>
  <h2>Les 14 besoins (V. Henderson)</h2><table class="pt ph">${HENDERSON.map((h,i)=>`<tr><th>${i+1}. ${h}</th><td></td></tr>`).join("")}</table>
  <h2>Soins à réaliser</h2><table class="pt pg"><tr><th>Heure</th><th>Soin</th><th>Fait</th></tr>${"<tr><td></td><td></td><td></td></tr>".repeat(6)}</table>
  <h2>Transmissions ciblées</h2><table class="pt pg"><tr><th>Cible</th><th>Données</th><th>Actions</th><th>Résultats</th></tr>${"<tr><td></td><td></td><td></td><td></td></tr>".repeat(4)}</table></section>`;
 const blank=kind==="vierge",objs=blank?[]:cnObjectifs(),S=cnStats(c);
 let h=`<section class="pp"><h1>Carnet de suivi de stage${sv?" · "+esc(sv.nom):""}</h1><p class="psub">Carnet IFSI${!blank&&st.service?" · "+esc(st.service):""}</p>${cnPrintInfos(blank)}
  <h2>Mes objectifs de stage</h2><table class="pt pg"><tr><th>Objectif</th><th style="width:22%">Avancée</th><th style="width:34%">Exemples, remarques</th></tr>
  ${blank?(sv?sv.obj.map(o=>`<tr><td>${esc(plainMd(o[1]))}</td><td class="pst">☐ À travailler<br>☐ En cours<br>☐ Atteint</td><td></td></tr>`).join(""):"")+"<tr><td></td><td></td><td></td></tr>".repeat(sv?2:7):objs.length?objs.map(o=>{const v=c.obj[cnHash(o)]||{};return `<tr><td>${pe(o)}</td><td>${CN_STATUTS.find(x=>x[0]===(v.statut||"todo"))[1]}</td><td>${pe(v.note)}</td></tr>`}).join(""):"<tr><td colspan=3>Aucun objectif saisi</td></tr>"}</table>
  ${blank?"":`<p class="psub">Bilan chiffré : ${plural(S.jours,"jour")} noté${S.jours>1?"s":""} · ${plural(S.soinsSeul,"soin")} réalisé${S.soinsSeul>1?"s":""} seul·e · ${S.atteints} objectif${S.atteints>1?"s":""} atteint${S.atteints>1?"s":""} sur ${S.objs} · ${fmtH(S.minutes)} de présence · ${plural(S.abs,"absence")}</p>`}</section>`;
 if(sv)h+=cnSvcPage(sv,c,blank);
 h+=`<section class="pp"><h1>Mon mémo du service</h1><h2>Médicaments rencontrés</h2><table class="pt pg"><tr><th>Médicament</th><th>Classe, indication</th><th>Surveillance</th></tr>${blank||!c.meds.length?"<tr><td></td><td></td><td></td></tr>".repeat(blank?9:3):c.meds.map(m=>`<tr><td>${pe(m.nom)}</td><td>${pe(m.classe)}</td><td>${pe(m.surv)}</td></tr>`).join("")}</table>
  <h2>Sigles et vocabulaire</h2><table class="pt pg"><tr><th style="width:30%">Terme</th><th>Signification</th></tr>${blank||!c.lexique.length?"<tr><td></td><td></td></tr>".repeat(blank?9:3):c.lexique.map(l=>`<tr><td>${pe(l.terme)}</td><td>${pe(l.def)}</td></tr>`).join("")}</table></section>`;
 h+=`<section class="pp"><h1>Journal de bord</h1>`;
 if(blank)h+=Array.from({length:4},()=>`<div class="pj"><p><b>Date :</b> ................................ <b>Horaire :</b> .....................</p><p><b>Patients pris en charge</b></p>${lines(2)}<p><b>Soins et activités réalisés</b></p>${lines(3)}<p><b>Ce que j'ai appris</b></p>${lines(2)}<p><b>Difficultés, questions</b></p>${lines(2)}</div>`).join("");
 else{const L=c.journal.slice().sort((a,b)=>(a.date||"").localeCompare(b.date||""));h+=L.length?L.map(j=>`<div class="pj"><p><b>${esc(fmtISO(j.date))} · ${esc(j.moment||"Journée")}</b>${j.ressenti?` · ressenti : ${esc(j.ressenti)}`:""}</p>${[["Patients","patients"],["Soins et activités","activites"],["Appris","appris"],["Difficultés","difficultes"],["À rechercher","recherches"]].filter(([,f])=>j[f]).map(([l,f])=>`<p><i>${l} :</i> ${pe(j[f])}</p>`).join("")}</div>`).join(""):"<p>Aucune journée notée.</p>";}
 h+=`</section><section class="pp"><h1>Suivi des soins réalisés</h1><table class="pt pg ps"><tr><th>Soin</th><th>Observé</th><th>Avec aide</th><th>Seul·e</th></tr>
  ${soins.map(([g,items])=>`<tr class="pgr"><td colspan="4">${esc(g)}</td></tr>${items.map(n=>{const v=c.soins[cnHash(n)]||{};return `<tr><td>${esc(n)}</td>${["obs","aide","seul"].map(f=>`<td class="pc">${blank?"":(v[f]||"")}</td>`).join("")}</tr>`}).join("")}`).join("")}</table></section>`;
 h+=`<section class="pp"><h1>Situations et questions</h1>`;
 if(blank)h+=Array.from({length:2},()=>`<div class="pj"><p><b>Situation :</b> ........................................................ <b>Date :</b> ..............</p><p><b>Que s'est-il passé ?</b></p>${lines(4)}<p><b>Ce qui m'a questionné·e</b></p>${lines(3)}<p><b>Liens avec la théorie</b></p>${lines(2)}<p><b>Ce que j'en retiens</b></p>${lines(2)}</div>`).join("")+`<h2>Questions à poser ou à rechercher</h2>${lines(6)}`;
 else h+=(c.situations.length?c.situations.map(s=>`<div class="pj"><p><b>${esc(s.titre||"Situation")}</b>${s.date?" · "+esc(fmtISO(s.date)):""}</p>${[["Description","description"],["Questionnement","questionnement"],["Liens théoriques","liens"],["Ce que j'en retiens","retenu"]].filter(([,f])=>s[f]).map(([l,f])=>`<p><i>${l} :</i> ${pe(s[f])}</p>`).join("")}</div>`).join(""):"<p>Aucune situation notée.</p>")+(c.questions.length?`<h2>Questions</h2><ul>${c.questions.map(q=>`<li>${q.done?"☑":"☐"} ${esc(q.txt)}</li>`).join("")}</ul>`:"");
 h+=`</section><section class="pp"><h1>Auto-évaluation des compétences</h1><table class="pt pg"><tr><th style="width:44%">Compétence</th><th>Mi-stage</th><th>Fin de stage</th><th style="width:30%">Exemples</th></tr>${Object.entries(COMP).map(([n,t])=>{const v=blank?{}:(c.comp[n]||{}),lv=x=>x&&x!=="–"?esc(x):"";return `<tr><td><b>C${n}</b> ${esc(t)}</td><td>${lv(v.mi)}</td><td>${lv(v.fin)}</td><td>${pe(v.ex)}</td></tr>`}).join("")}</table>${blank?`<p class="psub">Niveaux : non pratiquée · à améliorer · en cours d'acquisition · acquise</p>`:""}`;
 h+=`</section><section class="pp"><h1>Points d'étape de la semaine</h1>${blank?Array.from({length:4},(_,i)=>`<div class="pj"><p><b>Semaine ${i+1} · du</b> ........................</p><p><b>Ce qui a progressé</b></p>${lines(2)}<p><b>Ce que je travaille la semaine prochaine</b></p>${lines(2)}</div>`).join(""):(c.semaines.length?c.semaines.slice().sort((a,b)=>(a.date||"").localeCompare(b.date||"")).map(w=>`<div class="pj"><p><b>Semaine du ${esc(fmtISO(w.date))}</b></p>${[["Ce qui a progressé","progres"],["À travailler ensuite","travail"],["Retour du tuteur","tuteur"]].filter(([,f])=>w[f]).map(([l,f])=>`<p><i>${l} :</i> ${pe(w[f])}</p>`).join("")}</div>`).join(""):"<p>Aucun point d'étape noté.</p>")}`;
 h+=`</section><section class="pp"><h1>Bilans</h1>${[["mi","Bilan de mi-stage"],["fin","Bilan de fin de stage"]].map(([k,t])=>{const b=blank?{}:(c.bilans[k]||{});return `<h2>${t}${b.date?" · "+esc(fmtISO(b.date)):""}</h2>${[["Points forts","forts"],["Axes d'amélioration","ameliorer"],[k==="mi"?"Objectifs pour la suite du stage":"Objectifs pour le prochain stage","suite"],["Remarques du tuteur","tuteur"]].map(([l,f])=>`<p><b>${l}</b></p>${b[f]?`<p>${pe(b[f])}</p>`:lines(3)}`).join("")}`}).join("")}</section>`;
 const H=blank?[]:c.heures.slice().sort((a,b)=>(a.date||"").localeCompare(b.date||""));
 h+=`<section class="pp"><h1>Feuille d'heures</h1><table class="pt pg"><tr><th>Date</th><th>Type</th><th>Début</th><th>Fin</th><th>Pause</th><th>Durée</th><th>Visa</th></tr>
  ${blank?"<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>".repeat(25):H.map(x=>`<tr><td>${esc(fmtShort(at(x.date,"12:00")))}</td><td>${esc(x.type||"Présence")}</td><td>${esc(x.debut||"")}</td><td>${esc(x.fin||"")}</td><td>${x.pause?esc(x.pause)+" min":""}</td><td>${x.type==="Absence"?"":fmtH(cnMinutes(x))}</td><td></td></tr>`).join("")+`<tr><th colspan="5">Total</th><th>${fmtH(S.minutes)}</th><td></td></tr>`}</table>
  <div class="psign"><div><b>Signature de l'étudiant·e</b></div><div><b>Signature du tuteur ou de la tutrice</b></div></div></section>`;
 return h;
}
function cnPrint(kind){
 let doc=document.getElementById("print-doc");if(doc)doc.remove();
 doc=document.createElement("div");doc.id="print-doc";doc.className="pdoc print-doc";doc.innerHTML=cnPrintDoc(kind);document.body.appendChild(doc);
 document.body.classList.add("printing");
 const done=()=>{document.body.classList.remove("printing");const d=document.getElementById("print-doc");d&&d.remove();};
 window.addEventListener("afterprint",done,{once:true});
 setTimeout(()=>{try{window.print();}catch(e){toast("Impression indisponible ici : ouvrez l'appli dans Safari");done();}},60);
}
