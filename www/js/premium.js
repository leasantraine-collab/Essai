/* Carnet IFSI — ce qui est réservé aux abonnés, et la page « Réservé aux abonnés ».
   Les contenus réservés (cours détaillés, « comprendre en images »…) ne sont pas dans la version gratuite : leurs fiches
   publiées sont marquées _l (voir scripts/premium.js) et s'ouvrent seulement avec la clé d'un abonnement (PREM.on).
   Ici : les fonctions réservées (outils, stage, entraînement) et l'affichage des verrous. Pendant la phase de lancement,
   ou pour un abonné, PREM.on est vrai et rien n'est verrouillé. */
const PR={
 outils:["reperes","projet","notes","chrono"],  /* outils gratuits */
 cartesJour:10,                                  /* cartes de révision gratuites par jour */
 partielQ:10,                                    /* partiel blanc gratuit : 10 questions */
 calculsNiv:1,                                   /* niveaux de calculs gratuits */
 services:2,                                     /* guides de lieux de stage gratuits (les premiers) */
 schemasParGroupe:1                              /* schémas à compléter gratuits par spécialité */
};
const premOn=()=>!!(typeof PREM!=="undefined"&&PREM.on);
const premLocked=r=>!!(r&&r._l);
const premToolOk=id=>premOn()||PR.outils.includes(id);
const PR_LOCK='<svg class="pr-lock" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2.2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/></svg>';
const prTag=()=>`<span class="tag pr-tag">${PR_LOCK}Abonnés</span>`;
/* Cartes faites aujourd'hui (toutes séances confondues) */
const premCardsToday=()=>{try{const L=store.get("srsLog",{}),t=srsDayN();return (L[t]||[0])[0];}catch(e){return 0;}};
const premCardsLeft=()=>premOn()?Infinity:Math.max(0,PR.cartesJour-premCardsToday());

/* Encadré « Réservé aux abonnés » : quoi, pourquoi, comment débloquer */
function premWall(o={}){
 const t=o.title||"Réservé aux abonnés";
 return `<section class="pr-wall" aria-label="${esc(t)}"><span class="pr-ic">${PR_LOCK}</span>
  <span class="eyebrow">Réservé aux abonnés</span><h2>${esc(t)}</h2>
  ${o.text?`<p>${o.text}</p>`:""}${o.teaser||""}
  <div class="pr-btns"><a class="btn block" href="#compte">${AC_ON()&&acHasSession()?"J'ai un code d'accès":"Débloquer avec un abonnement"}</a>
  ${o.free?(o.free.act?`<button class="link" data-act="${o.free.act}" data-k="${o.free.k}">${esc(o.free.l)}</button>`:`<a class="link" href="${o.free[0]}">${esc(o.free[1])}</a>`):""}</div></section>`;}

/* Pages entières réservées : renvoie la page « réservé » ou null */
function premGuard(r){
 if(premOn())return null;
 const page=(title,text,teaser,free)=>`<div class="stack-lg">${backBtn("Retour")}${premWall({title,text,teaser,free})}</div>`;
 if(r.v==="cours"){const c=COURS.find(x=>x.id===r.arg);
  if(c&&premLocked(c))return page(c.titre,`Ce cours complet de ${esc(c.duree||"")} fait partie de l'abonnement.`,
   `<div class="pr-teaser"><b>Au programme</b><ol>${(c.chap||[]).map(ch=>`<li>${esc((ch.h||"").replace(/\*\*/g,""))}</li>`).join("")}</ol></div>`,
   ["#reviser/cours","Voir les cours ouverts gratuitement"]);}
 if(r.v==="outil"){const id=(r.arg||"").split("/")[0],t=TOOLS.find(x=>x.id===id);
  if(t&&!premToolOk(id))return page(t.n,esc(t.d)+".",
   "",["#outils","Outils gratuits : repères et normes, projet de soins, bloc-notes, chrono"]);}
 if(r.v==="carnet")return page("Carnet de suivi de stage","Journal de bord, soins réalisés, objectifs, bilans, feuille d'heures et carnet personnalisé à imprimer.","",["#stages","Retour au stage"]);
 if(r.v==="feuille")return page("Feuilles de travail","Recueil de données, projet de soins, planification et analyse de pratique, avec leurs exemples rédigés. L'assistant « projet de soins guidé » reste gratuit.","",["#outil/projet","Ouvrir le projet de soins guidé"]);
 if(r.v==="a4"){const [k,id]=(r.arg||"").split("/").map(decodeURIComponent);const rec=premRec(k,id);
  if(!rec||premLocked(rec))return page("Version A4","Les fiches d'une page, à lire ou à imprimer, font partie de l'abonnement (sauf pour les contenus d'essai).");}
 return null;
}
/* Fiche d'un contenu à partir de sa clé (p pathologie, s soin, m médicament, c cours, f fiche) */
function premRec(k,id){
 if(k==="p")return PATHOS.find(x=>x.i===id);if(k==="s")return typeof SOBY!=="undefined"&&SOBY[id];if(k==="m")return typeof MDBY!=="undefined"&&MDBY[id];
 if(k==="c")return COURS.find(x=>x.id===id);if(k==="f")return FICHES.find(x=>x.id===id)||{};return null;}

/* Cours détaillé d'une pathologie, d'un soin ou d'une classe, dans sa page */
function premCoursWall(kind,act){
 return premWall({title:`Le cours détaillé ${kind}`,text:"La fiche récap reste gratuite. Le cours complet (mécanisme expliqué, images, examens, traitements, rôle infirmier, mises en situation) fait partie de l'abonnement.",
  free:{act,k:"recap",l:"Revenir à la fiche récap"}});}
/* Carte d'accès à une partie réservée (page Stages, accueil…) */
const premMini=(t,sub,href)=>`<a class="cd-card cn-entry pr-locked" href="${href}"><span class="cd-ic">${PR_LOCK}</span><span><b>${esc(t)}</b><small>${esc(sub)}</small>${prTag()}</span><svg class="chev" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></a>`;
/* Schémas à compléter : le premier de chaque spécialité est ouvert */
function premExoOk(e){if(premOn())return true;const L=PEXOS.filter(x=>x.spe[0]===e.spe[0]);return L.indexOf(e)<PR.schemasParGroupe;}
