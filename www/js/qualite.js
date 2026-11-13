/* Carnet IFSI — confiance et cadre.
   · Bas de chaque fiche, cours, pathologie, soin et médicament : date de mise à jour, références officielles pour vérifier,
     statut de relecture professionnelle, signalement d'une erreur (et mode relecteur pour les infirmiers qui relisent).
   · Pages : qualité des contenus, usage pédagogique, conditions d'utilisation, confidentialité, mentions légales.
   · Avertissement « outil pédagogique » sur les calculs et les scores, message d'accueil au premier lancement.
   Chargé après programme.js et outils.js, avant app.js. */

/* ---------- À compléter avant la mise en vente (voir docs/relecture/README.md) ---------- */
const QUAL={
 editeur:"",          /* nom et prénom, ou raison sociale et forme juridique de l'éditeur */
 adresse:"",          /* adresse postale de l'éditeur */
 contact:"",          /* adresse e-mail de contact : les signalements d'erreur y sont envoyés */
 directeur:"",        /* directeur ou directrice de la publication */
 siret:"",            /* numéro SIRET si l'activité est déclarée */
 relecteurs:[],       /* {nom:"…", titre:"Infirmier·e diplômé·e d'État", exercice:"Cardiologie, CHU de …", domaines:"Pharmacologie, soins techniques"} */
 relu:{}              /* clé du contenu ("f:id", "c:id", "p:id", "s:id", "m:id") → {par:"Nom ou initiales", le:"2026-12-01"} */
};
const QUAL_CGU_V="2026-11";   /* version des conditions d'utilisation (change → nouveau message d'accueil) */

/* ---------- Références officielles pour vérifier ---------- */
const QREF={
 has:["Haute Autorité de santé (HAS) : recommandations de bonne pratique","https://www.has-sante.fr"],
 bdpm:["Base de données publique des médicaments : RCP et notices","https://base-donnees-publique.medicaments.gouv.fr"],
 ansm:["ANSM : informations de sécurité sur les médicaments","https://ansm.sante.fr"],
 actes:["Code de la santé publique, articles R4311-1 à R4311-15 : actes professionnels infirmiers","https://www.legifrance.gouv.fr"],
 deonto:["Code de la santé publique, articles R4312-1 et suivants : déontologie des infirmiers","https://www.legifrance.gouv.fr"],
 ref:["Référentiel de formation en soins infirmiers en vigueur pour votre promotion","https://www.legifrance.gouv.fr"],
 sf2h:["SF2H : précautions standard et recommandations d'hygiène","https://www.sf2h.net"],
 spf:["Santé publique France : données et prévention","https://www.santepubliquefrance.fr"],
 vacc:["Calendrier des vaccinations et recommandations vaccinales, mis à jour chaque année par le ministère chargé de la santé","https://sante.gouv.fr"],
 rcp:["Réanimation cardio-pulmonaire : recommandations de l'ERC et du Conseil français de réanimation cardio-pulmonaire","https://www.cfrc.fr"],
 afgsu:["AFGSU : arrêté du 30 décembre 2014 modifié relatif à l'attestation de formation aux gestes et soins d'urgence","https://www.legifrance.gouv.fr"],
 spilf:["SPILF : recommandations d'infectiologie","https://www.infectiologie.com"],
 inca:["Institut national du cancer (INCa)","https://www.e-cancer.fr"],
 sfap:["SFAP : soins palliatifs et accompagnement","https://www.sfap.org"],
 legi:["Légifrance : textes de loi en vigueur","https://www.legifrance.gouv.fr"],
 local:["Protocoles de votre établissement, prescription médicale et cours de votre IFSI",""]
};
const QREF_CAT={thera:["bdpm","ansm","has"],patho:["has","spf"],soins:["sf2h","has","actes"],voca:[],stage:["actes","deonto","ref"],methode:["ref"],tfe:["ref","legi"],
 calcul:["bdpm"],quiz:[],exam:["has"],role:["actes","deonto","legi"],anat:[],situ:["has","actes"]};
const QREF_SPE={infectio:["spilf","has","spf"],onco:["inca","has"],pallia:["sfap","has","legi"],urg:["rcp","afgsu","has"],pedia:["has","vacc"],immuno:["has","vacc"],psy:["has","legi"],geria:["has"]};
const QREF_SO={hyg:["sf2h","has","actes"],asep:["sf2h","has","actes"],pans:["sf2h","has","actes"],drain:["sf2h","actes"],uri:["sf2h","has","actes"],prel:["sf2h","has","actes"],perf:["sf2h","bdpm","actes"],
 med:["bdpm","ansm","actes"],urg:["rcp","afgsu","actes"],vacc:["vacc","actes"],transf:["ansm","has","actes"],pallia:["sfap","has","actes"],onco:["inca","actes"],qual:["has","legi"],rel:["has","deonto"]};
function qRefs(it){let L;
 if(it.kind==="m")L=["bdpm","ansm","has",...(["atb","avir"].includes(it.o.s)?["spilf"]:it.o.s==="onco"?["inca"]:[])];
 else if(it.kind==="s")L=QREF_SO[it.o.s]||["has","actes"];
 else if(it.kind==="p")L=QREF_SPE[it.o.s]||["has"];
 else L=QREF_CAT[it.o.cat]||["has"];
 return [...new Set([...L,"local"])].map(k=>QREF[k]);}

/* ---------- Contenus : clé, titre, date de mise à jour, UE ---------- */
const MAJ=(()=>{const o={};if(typeof MAJ_D!=="undefined")Object.entries(MAJ_D).forEach(([d,l])=>l.split(" ").forEach(k=>{o[k]=d;}));return o;})();
const CT_ROUTE={fiche:"f",cours:"c",patho:"p",soin:"s",med:"m"};
function ctItem(kind,id){
 const o=kind==="f"?FICHES.find(x=>x.id===id):kind==="c"?COURS.find(x=>x.id===id):kind==="p"?(typeof PATHOS!=="undefined"&&PATHOS.find(x=>x.i===id)):kind==="s"?(typeof SOINS!=="undefined"&&SOINS.find(x=>x.i===id)):kind==="m"?(typeof MEDS!=="undefined"&&MEDS.find(x=>x.i===id)):null;
 if(!o)return null;
 const ue=kind==="f"||kind==="c"?o.ue:kind==="s"?(typeof UE_SO!=="undefined"&&UE_SO[o.s]):kind==="m"?(typeof UE_MD!=="undefined"&&UE_MD[o.s]):(typeof UE_SP!=="undefined"&&UE_SP[o.s]);
 return {kind,id,key:kind+":"+id,o,titre:o.titre||o.n||id,ue:ue||{"2009":[],"2026":[]},maj:MAJ[kind+":"+id]||""};}
const qMonth=d=>d?new Date(d+"T12:00").toLocaleDateString("fr-FR",{month:"long",year:"numeric"}):"";
const qDate=d=>d?new Date(d+"T12:00").toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"}):"";
const QIC={shield:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.3-7.5 9.5-4.3-1.2-7.5-4.9-7.5-9.5V6z"/><path d="M8.8 12l2.2 2.2 4.4-4.4"/></svg>',
 flag:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 21V4M5 4h11l-2 4 2 4H5"/></svg>',
 book:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M8 7h8M8 11h6"/></svg>',
 info:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/></svg>',
 ext:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>'};

/* ---------- Bas de contenu ---------- */
const qRelecteur=()=>Object.assign({on:false,nom:""},store.get("relecteur",{}));
const qRelectures=()=>store.get("relectures",{});
function ctFoot(r){
 const kind=CT_ROUTE[r.v];if(!kind)return "";const id=(r.arg||"").split("/")[0],it=ctItem(kind,id);if(!it)return "";
 const rv=QUAL.relu[it.key],R=qRelecteur(),mine=qRelectures()[it.key],open=state.qSig===it.key;
 const refs=qRefs(it).map(([l,u])=>`<li>${u?`<a href="${u}" target="_blank" rel="noopener noreferrer">${esc(l)}${QIC.ext}</a>`:esc(l)}</li>`).join("");
 const form=open?`<form id="q-sig-form" class="cd-form q-form" data-k="${esc(it.key)}" autocomplete="off">
   <label for="q-sig-ty">${R.on?"Votre relecture":"Type de signalement"}<select id="q-sig-ty">${(R.on?["Correction à apporter","Information à mettre à jour","Formulation à améliorer","Remarque"]:["Erreur ou information inexacte","Information à mettre à jour","Formulation peu claire","Faute d'orthographe","Autre"]).map(x=>`<option>${x}</option>`).join("")}</select></label>
   <label for="q-sig-tx">Ce qu'il faut corriger<textarea id="q-sig-tx" rows="4" required maxlength="1500" placeholder="Ex. la dose maximale indiquée ne correspond plus au RCP ; source : …"></textarea></label>
   <small class="ot-hint">N'indiquez aucune donnée permettant d'identifier un patient.</small>
   <div class="btn-row"><button class="btn" type="submit">${R.on?"Enregistrer ma relecture":"Envoyer le signalement"}</button><button class="link" type="button" data-act="q-sig-cancel">Annuler</button></div></form>`:"";
 const cta=typeof srsCta==="function"?srsCta(it):"";
 return `<section class="q-foot" aria-label="Qualité de ce contenu">${cta}
  <div class="q-box">
   <div class="q-row"><span class="q-ic${rv?" ok":""}">${QIC.shield}</span><span><b>${it.maj?`Mis à jour en ${esc(qMonth(it.maj))}`:"Contenu pédagogique"}</b>
    <small>${rv?`Relu par ${esc(rv.par)}${rv.le?` le ${esc(qDate(rv.le))}`:""}`:"Relecture professionnelle : en attente"} · <a href="#legal/qualite">Comment sont faits les contenus</a></small></span></div>
   <details class="q-refs"><summary>${QIC.book}Références pour vérifier et approfondir</summary><ul>${refs}</ul>
    <p class="ot-hint">Ces sources officielles permettent de vérifier et d'approfondir ce contenu. En pratique, la prescription et les protocoles de votre établissement priment.</p></details>
   ${R.on&&mine?`<p class="q-mine ${mine.ok?"ok":"ko"}">${mine.ok?"Vous avez validé ce contenu":"Vous avez demandé une correction"} le ${esc(qDate(mine.d))}${mine.note?` : ${esc(mine.note)}`:""}</p>`:""}
   <div class="q-acts">${R.on?`<button class="btn ghost" data-act="q-rel-ok" data-k="${esc(it.key)}">${SVG.check}Relu, conforme</button><button class="link" data-act="q-sig" data-k="${esc(it.key)}">${QIC.flag}À corriger</button>`
    :`<button class="link" data-act="q-sig" data-k="${esc(it.key)}">${QIC.flag}Signaler une erreur</button>`}</div>
   ${form}</div></section>`;
}

/* ---------- Signalements et relectures ---------- */
const qSigs=()=>store.get("signalements",[]);
async function qShare(title,text){
 try{if(navigator.share){await navigator.share({title,text});return true;}}catch(e){if(e&&e.name==="AbortError")return false;}
 try{await navigator.clipboard.writeText(text);toast("Texte copié : collez-le dans un e-mail");return true;}catch(e){}
 toast("Partage impossible sur cet appareil");return false;}
const qMail=(subject,body)=>{if(!/@/.test(QUAL.contact))return false;location.href=`mailto:${QUAL.contact}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;return true;};
function qSigText(s){return `Signalement Carnet IFSI\nContenu : ${s.t} (${s.k})\nType : ${s.ty}\nDate : ${qDate(s.d)} · version ${s.v}\n\n${s.tx}`;}
function qSubmit(f){
 const k=f.dataset.k,it=ctItem(...k.split(/:(.*)/s).slice(0,2)),ty=document.getElementById("q-sig-ty").value,tx=document.getElementById("q-sig-tx").value.trim();
 if(!tx){toast("Décrivez ce qu'il faut corriger");return;}
 const R=qRelecteur();
 if(R.on){const L=qRelectures();L[k]={ok:false,ty,note:tx,d:todayISO(),par:R.nom,t:it?it.titre:k};store.set("relectures",L);state.qSig=null;haptic();toast("Relecture enregistrée");render();return;}
 const s={id:Date.now().toString(36),k,t:it?it.titre:k,ty,tx,d:todayISO(),v:APP_VERSION};
 store.set("signalements",[s,...qSigs()].slice(0,200));state.qSig=null;haptic();render();
 if(qMail("Signalement : "+s.t,qSigText(s)))toast("Signalement prêt dans votre messagerie");
 else qShare("Signalement Carnet IFSI",qSigText(s)).then(ok=>{if(!ok)toast("Signalement enregistré");});
}
function qRelExport(){
 const L=Object.entries(qRelectures()),R=qRelecteur();if(!L.length){toast("Aucune relecture enregistrée");return;}
 const rows=[["cle","titre","statut","type","remarque","date","relecteur"],...L.map(([k,v])=>[k,v.t||"",v.ok?"conforme":"à corriger",v.ty||"",v.note||"",v.d,v.par||R.nom])];
 const csv="﻿"+rows.map(r=>r.map(x=>{x=String(x);return /[";\n]/.test(x)?'"'+x.replace(/"/g,'""')+'"':x;}).join(";")).join("\n")+"\n";
 dlFile(`relectures-carnet-ifsi-${(R.nom||"relecteur").toLowerCase().replace(/[^a-z0-9]+/g,"-")}-${todayISO()}.csv`,"text/csv",csv);}
function qAct(b,a){const k=b.dataset.k;
 if(a==="q-sig"){state.qSig=state.qSig===k?null:k;render();setTimeout(()=>{const t=document.getElementById("q-sig-tx");if(t){t.focus({preventScroll:true});t.scrollIntoView({block:"center"});}},40);}
 else if(a==="q-sig-cancel"){state.qSig=null;render();}
 else if(a==="q-rel-ok"){const R=qRelecteur(),L=qRelectures(),[kd,id]=k.split(/:(.*)/s),it=ctItem(kd,id);L[k]={ok:true,d:todayISO(),par:R.nom,t:it?it.titre:k};store.set("relectures",L);haptic();toast("Contenu validé");render();}
 else if(a==="q-welcome-ok"){store.set("bienvenue",QUAL_CGU_V);haptic();render();}
 else if(a==="q-rel-mode"){const R=qRelecteur();R.on=!!b.checked;if(R.on&&!R.nom){R.nom=(document.getElementById("q-rel-nom")||{}).value||"";}store.set("relecteur",R);render();}
 else if(a==="q-rel-export")qRelExport();
 else if(a==="q-rel-clear"){if(!b.dataset.armed){b.dataset.armed="1";b.textContent="Toucher à nouveau pour effacer";setTimeout(()=>{if(b.isConnected){delete b.dataset.armed;b.textContent="Effacer mes relectures";}},3500);return;}store.set("relectures",{});toast("Relectures effacées");render();}
 else if(a==="q-sig-share"){const L=qSigs();if(!L.length)return;const txt=L.map(qSigText).join("\n\n———\n\n");if(!qMail("Signalements Carnet IFSI",txt))qShare("Signalements Carnet IFSI",txt);}
 else if(a==="q-sig-clear"){store.set("signalements",[]);toast("Liste effacée");render();}
}
function qInput(t){if(t.id==="q-rel-nom"){const R=qRelecteur();R.nom=t.value.slice(0,60);store.set("relecteur",R);}}

/* ---------- Avertissements ---------- */
const qPedago=(txt)=>`<p class="q-pedago">${QIC.info}<span><b>Outil pédagogique.</b> ${txt||"Pour s'entraîner et réviser : ne l'utilisez pas pour préparer ou administrer un traitement réel. En pratique, la prescription, le protocole du service et la double vérification font foi."} <a href="#legal/pedagogie">En savoir plus</a></span></p>`;
function qWelcome(){if(store.get("bienvenue","")===QUAL_CGU_V)return "";
 return `<section class="nt-ask q-welcome"><span class="nt-ic">${QIC.shield}</span><div><b>Bienvenue dans Carnet IFSI</b><small>Un outil pour réviser et préparer vos stages. Il ne remplace ni vos cours et vos formateurs, ni les protocoles des établissements, ni la prescription médicale. Vos données restent sur votre appareil.</small>
  <div class="nt-btns"><button class="btn" data-act="q-welcome-ok">J'ai compris</button><span class="q-links"><a class="link" href="#legal/cgu">Conditions d'utilisation</a><a class="link" href="#legal/confidentialite">Confidentialité</a></span></div></div></section>`;}

/* ---------- Pages ---------- */
const QP=(h,body)=>`<section class="stack-sm"><h2>${h}</h2><div class="sheet-body q-legal">${body}</div></section>`;
const qTodo=v=>v?esc(v):`<span class="q-todo">à compléter par l'éditeur</span>`;
const LEGAL={
 qualite:["Qualité des contenus","Comment les contenus sont rédigés, vérifiés et corrigés.",()=>{
  const nRelu=Object.keys(QUAL.relu).length,tot=Object.keys(MAJ).length||FICHES.length+COURS.length,R=qRelecteur(),L=Object.entries(qRelectures()),S=qSigs();
  return QP("Comment sont faits les contenus",`<p>Les fiches, cours, pathologies, soins et médicaments sont rédigés à visée pédagogique, à partir du référentiel de formation en soins infirmiers et des recommandations officielles (HAS, ANSM, SF2H, Code de la santé publique…). Chaque contenu affiche la date de sa dernière mise à jour et les références qui permettent de le vérifier.</p>
   <p>Les recommandations évoluent : en cas de différence, la prescription médicale, les protocoles de votre établissement et l'enseignement de votre IFSI priment.</p>`)
  +QP("Relecture professionnelle",`${QUAL.relecteurs.length?`<p>Les contenus sont relus par des professionnels de santé. Chaque contenu relu porte la mention « Relu par… » avec la date.</p><ul class="clean q-ul">${QUAL.relecteurs.map(p=>`<li><b>${esc(p.nom)}</b>${p.titre?`, ${esc(p.titre)}`:""}${p.exercice?` · ${esc(p.exercice)}`:""}${p.domaines?`<small>Relit : ${esc(p.domaines)}</small>`:""}</li>`).join("")}</ul>`
   :`<p>La relecture des contenus par des infirmiers et des formateurs est en cours de mise en place. Les contenus relus porteront la mention « Relu par… » avec la date de relecture.</p>`}
   <p class="muted">${nRelu} contenu${nRelu>1?"s":""} relu${nRelu>1?"s":""} sur ${tot}.</p>`)
  +QP("Signaler une erreur",`<p>En bas de chaque contenu, le lien « Signaler une erreur » prépare un message${/@/.test(QUAL.contact)?" envoyé à l'équipe de Carnet IFSI":" à partager avec l'éditeur"}. Les signalements sont vérifiés et le contenu est corrigé dans une prochaine mise à jour.</p>
   ${S.length?`<div class="q-list">${S.slice(0,6).map(s=>`<div class="q-li"><b>${esc(s.t)}</b><small>${esc(s.ty)} · ${esc(qDate(s.d))}</small><span>${esc(s.tx.length>140?s.tx.slice(0,140)+"…":s.tx)}</span></div>`).join("")}</div>
    <div class="btn-row"><button class="btn ghost" data-act="q-sig-share">Envoyer mes ${plural(S.length,"signalement")}</button><button class="link" data-act="q-sig-clear">Effacer la liste</button></div>`:`<p class="muted">Vous n'avez encore rien signalé.</p>`}`)
  +QP("Mode relecteur",`<p>Pour les infirmiers et formateurs qui relisent les contenus : en bas de chaque contenu apparaissent « Relu, conforme » et « À corriger ». Vos relectures restent sur cet appareil jusqu'à ce que vous les envoyiez.</p>
   <label for="q-rel-nom">Votre nom et votre fonction<input id="q-rel-nom" data-q="nom" maxlength="60" value="${esc(R.nom)}" placeholder="Ex. Camille Martin, IDE en cardiologie"></label>
   <label class="nt-row q-sw"><span><b>Activer le mode relecteur</b><small>${L.length?`${plural(L.length,"contenu")} relu${L.length>1?"s":""} : ${L.filter(x=>x[1].ok).length} conforme${L.filter(x=>x[1].ok).length>1?"s":""}, ${L.filter(x=>!x[1].ok).length} à corriger`:"Aucune relecture pour l'instant"}</small></span><input type="checkbox" role="switch" class="nt-sw" data-act="q-rel-mode" ${R.on?"checked":""}></label>
   ${L.length?`<div class="btn-row"><button class="btn ghost" data-act="q-rel-export">Exporter mes relectures (tableur)</button><button class="link danger" data-act="q-rel-clear">Effacer mes relectures</button></div>`:""}`);}],
 pedagogie:["Usage pédagogique","Ce que Carnet IFSI est, et ce qu'il n'est pas.",()=>QP("Un outil pour apprendre",`<p>Carnet IFSI est un outil de révision et d'organisation destiné aux étudiants en soins infirmiers. Il aide à comprendre, mémoriser et s'entraîner.</p>
   <p><b>Ce n'est pas un dispositif médical</b> ni un outil d'aide à la décision clinique. Les calculs de doses, les scores cliniques, les valeurs de référence et les orientations (choix du pansement, par exemple) servent à s'exercer : ils ne doivent pas être utilisés pour préparer, prescrire ou administrer un traitement à un patient.</p>`)
   +QP("En stage et en pratique",`<ul class="clean q-ul"><li>La <b>prescription médicale</b> et les <b>protocoles de l'établissement</b> priment toujours sur le contenu de l'appli.</li><li>Un calcul de dose se fait sur la prescription, avec le matériel du service, et se vérifie <b>en double contrôle</b>.</li><li>Les valeurs normales sont celles du <b>laboratoire</b> qui rend le résultat.</li><li>Au moindre doute, demandez à votre tuteur, à l'infirmier référent ou au médecin.</li><li>Ne saisissez jamais de nom de patient : <b>initiales seulement</b>, dans le respect du secret professionnel.</li></ul>`)],
 cgu:["Conditions d'utilisation",`Version de ${qMonth(QUAL_CGU_V+"-01")}.`,()=>[
   ["1. Objet","Les présentes conditions encadrent l'utilisation de l'application et du site Carnet IFSI (ci-après « l'appli »), outil de révision et d'organisation destiné aux étudiants en soins infirmiers. Utiliser l'appli vaut acceptation de ces conditions."],
   ["2. Accès","L'appli est accessible sur le web et sur les boutiques d'applications. Une partie des contenus et des fonctions est gratuite, sans compte. Le reste est réservé aux abonnés : il faut alors un compte (adresse e-mail et mot de passe) et un abonnement en cours."],
   ["2 bis. Compte et abonnement","Le compte est personnel : gardez votre mot de passe pour vous. L'abonnement s'active avec un code d'accès, qui ajoute à votre compte la durée indiquée lors de sa remise ; il n'est pas renouvelé automatiquement et prend fin à la date affichée dans Réglages › Mon compte. Un code s'utilise une seule fois par compte. Les conditions de vente d'un code (prix, rétractation, remboursement) sont précisées par le vendeur au moment de l'achat. Vous pouvez supprimer votre compte à tout moment depuis Réglages › Mon compte : l'abonnement restant est alors perdu. L'éditeur peut suspendre un compte en cas de partage des accès ou d'usage frauduleux."],
   ["3. Usage pédagogique","L'appli est un support d'apprentissage. Elle n'est pas un dispositif médical et ne remplace ni la formation dispensée par l'IFSI, ni la prescription médicale, ni les protocoles des établissements, ni le jugement clinique. Les calculs, scores et orientations proposés servent à s'entraîner et ne doivent pas servir à soigner un patient."],
   ["4. Contenus","Les contenus sont rédigés avec soin à partir de sources officielles et mis à jour régulièrement ; ils peuvent néanmoins comporter des erreurs ou ne plus refléter les dernières recommandations. Chaque contenu peut être signalé depuis son lien « Signaler une erreur ». L'éditeur peut modifier, compléter ou retirer des contenus à tout moment."],
   ["5. Vos données","Ce que vous saisissez (carnet de stage, feuilles, notes, planning…) est enregistré sur votre appareil et relève de votre responsabilité. Vous vous engagez à ne saisir aucune donnée permettant d'identifier un patient, dans le respect du secret professionnel (article L1110-4 du Code de la santé publique). Pensez à faire des sauvegardes (Réglages › Sauvegarder mes données)."],
   ["6. Propriété intellectuelle","Les textes, schémas, illustrations, animations et l'organisation des contenus sont protégés. Vous pouvez les consulter et les imprimer pour votre usage personnel de révision ; toute reproduction ou diffusion, notamment commerciale, est interdite sans autorisation de l'éditeur. Les noms commerciaux de médicaments et de dispositifs cités à titre d'exemple appartiennent à leurs titulaires."],
   ["7. Responsabilité","L'éditeur met tout en œuvre pour proposer des contenus exacts et une appli disponible, sans pouvoir le garantir. Sa responsabilité ne saurait être engagée en cas d'utilisation de l'appli contraire à son usage pédagogique, d'erreur dans un contenu ou de perte de données enregistrées sur l'appareil."],
   ["8. Évolution","Ces conditions peuvent évoluer ; la nouvelle version s'applique dès sa mise en ligne et un message vous en informe au lancement suivant."],
   ["9. Droit applicable","Ces conditions sont régies par le droit français. Pour toute question : "+(QUAL.contact||"voir les mentions légales")+"."]].map(([h,t])=>QP(h,`<p>${esc(t)}</p>`)).join("")],
 confidentialite:["Confidentialité","Vos données de révision restent sur votre appareil.",()=>[
   ["Ce que l'appli enregistre",`<p>Votre progression, vos favoris, vos cartes de révision et résultats, votre planning, vos partiels, votre stage, votre carnet de suivi, vos feuilles de travail, vos notes et vos réglages sont enregistrés <b>uniquement sur votre appareil</b> (stockage local du navigateur ou de l'application) : ils ne sont jamais envoyés à l'éditeur, avec ou sans compte.</p>`],
   ["Si vous créez un compte",`<p>Le compte ne sert qu'à l'abonnement. Sont conservés : votre <b>adresse e-mail</b>, votre <b>mot de passe</b> (sous forme chiffrée, illisible par l'éditeur), la <b>date de fin de votre abonnement</b> et les <b>codes d'accès</b> utilisés, avec leur date. Finalité : vous identifier et vous donner accès aux contenus réservés (exécution du contrat). Ces données sont hébergées par le service Supabase, sous-traitant de l'éditeur, sur des serveurs situés dans l'Union européenne. Elles sont gardées tant que le compte existe et effacées dès sa suppression (Réglages › Mon compte › Supprimer mon compte). Les e-mails envoyés (code de confirmation, mot de passe oublié) ne contiennent aucune publicité.</p>`],
   ["Pas de publicité ni de suivi",`<p>L'appli n'affiche pas de publicité et n'utilise aucun traceur ni outil de mesure d'audience.</p>`],
   ["Notifications",`<p>Les rappels sont calculés et programmés sur votre appareil à partir de vos données ; ils peuvent être désactivés à tout moment (Réglages › Notifications).</p>`],
   ["Sauvegardes, exports et signalements",`<p>Une sauvegarde, un export (PDF, agenda) ou un signalement d'erreur n'est créé qu'à votre demande. Vous choisissez où l'enregistrer ou à qui l'envoyer ; un signalement ne contient que le texte que vous avez saisi.</p>`],
   ["Services tiers",`<p>Les vidéos de référence que vous ajoutez (YouTube en mode confidentialité renforcée, Vimeo, Dailymotion) ne se chargent que lorsque vous les touchez et relèvent alors de la politique de confidentialité de ces services, comme les sites externes ouverts depuis l'appli (PubMed, HAS…). La version web est hébergée par GitHub Pages, qui peut enregistrer des données techniques de connexion (adresse IP) pour la sécurité de son service.</p>`],
   ["Données de santé",`<p>N'enregistrez jamais le nom d'un patient ni une information qui permettrait de l'identifier : utilisez les initiales seulement.</p>`],
   ["Effacer vos données et vos droits",`<p>Vous pouvez tout effacer à tout moment : Réglages › Réinitialiser ma progression, effacement des données du site dans le navigateur, ou suppression de l'application. Si vous avez un compte, supprimez-le depuis Réglages › Mon compte : l'adresse e-mail et l'abonnement sont alors effacés. Vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité de ces données. Pour toute question : ${qTodo(QUAL.contact)}. Vous pouvez aussi saisir la CNIL (cnil.fr).</p>`]].map(([h,t])=>QP(h,t)).join("")],
 mentions:["Mentions légales","Avertissement, éditeur, hébergement et crédits.",()=>QP("Avertissement",`<p><b>Carnet IFSI est un outil de révision et d'organisation. Ses contenus ne remplacent pas :</b></p>
   <ul class="clean q-ul"><li>les <b>cours</b>, les enseignements et les consignes de votre <b>IFSI</b> et de vos formateurs ;</li><li>les <b>textes officiels</b> de la formation (référentiels, arrêtés) ni les modalités d'évaluation fixées par votre institut ;</li><li>la <b>prescription médicale</b>, les <b>protocoles et procédures</b> des établissements, les recommandations des autorités de santé (HAS, ANSM…) ni les notices et résumés des caractéristiques des médicaments ;</li><li>l'<b>encadrement</b> par vos tuteurs, les infirmiers et les médecins, ni votre <b>jugement clinique</b> ;</li><li>la <b>formation AFGSU</b>, qui seule délivre l'attestation.</li></ul>
   <p>L'appli n'est pas un dispositif médical : ses calculs, scores, valeurs de référence et orientations servent à s'entraîner et ne doivent jamais servir à soigner un patient. Malgré le soin apporté, un contenu peut comporter une erreur ou ne plus être à jour : <b>vérifiez toujours avec vos cours</b> et, en stage, avec les professionnels qui vous encadrent.</p>
   <p>Carnet IFSI est un outil indépendant : il n'est rattaché à aucun IFSI, université ou ministère, et ses contenus ne constituent pas une publication officielle. Voir aussi l'<a href="#legal/pedagogie">usage pédagogique</a> et les <a href="#legal/cgu">conditions d'utilisation</a>.</p>`)
   +QP("Éditeur",`<dl class="q-dl"><dt>Éditeur</dt><dd>${qTodo(QUAL.editeur)}</dd><dt>Adresse</dt><dd>${qTodo(QUAL.adresse)}</dd>${QUAL.siret?`<dt>SIRET</dt><dd>${esc(QUAL.siret)}</dd>`:""}<dt>Contact</dt><dd>${qTodo(QUAL.contact)}</dd><dt>Directeur ou directrice de la publication</dt><dd>${qTodo(QUAL.directeur)}</dd></dl>`)
   +QP("Hébergement",`<p>Version web : GitHub Pages, service de GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis.</p><p>Applications : distribuées par l'App Store (Apple) et Google Play (Google).</p><p>Comptes et abonnements : service Supabase (supabase.com), serveurs situés dans l'Union européenne.</p>`)
   +QP("Crédits",`<p>Polices Inter, Source Serif 4 et JetBrains Mono (licence SIL Open Font License). Application construite avec Capacitor (licence MIT). Bibliothèques supabase-js (licence MIT), tweetnacl (domaine public) et fflate (licence MIT). Schémas, illustrations et animations : Carnet IFSI.</p>`)
   +QP("Propriété intellectuelle",`<p>L'ensemble des contenus de l'appli est protégé par le droit d'auteur. Voir les <a href="#legal/cgu">conditions d'utilisation</a>.</p>`)]
};
function vLegal(arg){const k=LEGAL[arg]?arg:"qualite",[t,lead,body]=LEGAL[k];
 return `<div class="stack-lg">${backBtn("Réglages")}${vh("Confiance et cadre",esc(t),esc(lead))}${body()}
  <nav class="chips wrapchips" aria-label="Autres pages">${Object.entries(LEGAL).filter(([x])=>x!==k).map(([x,v])=>`<a class="chip" href="#legal/${x}">${esc(v[0])}</a>`).join("")}</nav></div>`;}
/* Groupe de l'écran Réglages */
function qSetRows(){const row=(k,ic,s)=>`<a class="li" href="#legal/${k}"><span class="ic tb-ic" style="--c:#2C7451">${ic}</span><span><span class="t">${esc(LEGAL[k][0])}</span><span class="s">${esc(s)}</span></span>${chev}</a>`;
 return `<div class="set-group"><span class="eyebrow">Confiance et cadre</span><div class="list">${row("qualite",QIC.shield,"Sources, relecture, signaler une erreur")}${row("pedagogie",QIC.info,"Un outil pour apprendre, pas pour soigner")}${row("cgu",QIC.book,"Conditions d'utilisation")}${row("confidentialite",QIC.shield,"Vos données restent sur votre appareil")}${row("mentions",QIC.book,"Éditeur, hébergement, crédits")}</div></div>`;}
