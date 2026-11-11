/* Carnet IFSI — grandes fiches des classes thérapeutiques : fiche récap et cours détaillé en 13 parties, cartes,
   et vue Réviser › Thérapeutiques (menu déroulant des catégories). Chargé après soins.js, avant app.js. */
const mdK=soK;
const mdDone=()=>store.get("mddone",[]);
const MD_COL=s=>`hsl(${(MD_SEC[s].n*53+95)%360} 42% 74%)`;
const mdSecMeds=s=>MEDS.filter(o=>o.s===s);
const mdSecs=()=>MD_SECS.map(x=>x[0]).filter(s=>mdSecMeds(s).length);
const mdN=()=>MEDS.length;
const mdBr=o=>o.m.map(x=>x.dci).filter(Boolean);
/* Schéma : un schéma de la bibliothèque SCH ou une planche anatomique (PMAPS) */
const mdHasSch=o=>!!(o.sch&&(SCH[o.sch.k]||(typeof PMAPS!=="undefined"&&PMAPS[o.sch.k])));
const mdSch=o=>!mdHasSch(o)?"":SCH[o.sch.k]?schFig(o.sch.k,o.sch.cap):amFig({m:o.sch.k,cap:o.sch.cap});

/* ---------- Blocs de la fiche ---------- */
const mdDrugs=a=>a.length?`<div class="fv-panel md-drugs">${a.map(x=>`<div><b>${pmd(x.dci)}</b>${x.br?`<span class="md-br">${esc(x.br)}</span>`:""}${x.pr?`<small>${pmd(x.pr)}</small>`:""}</div>`).join("")}</div>`:"";
const mdChips=a=>`<div class="md-chips">${a.slice(0,8).map(x=>`<span><b>${esc(plainTxt(x.dci))}</b>${x.br?` ${esc(x.br.split(",")[0].trim())}`:""}</span>`).join("")}</div>`;
const mdCols=(h1,a1,t1,h2,a2,t2)=>a1.length&&a2.length?fvBlock({t:"cols",cols:[{h:h1,tone:t1,items:a1},{h:h2,tone:t2,items:a2}]}):soList(a1.length?a1:a2);
const MD_PUB=/^(personne âgée|sujet âgé|enfant|nourrisson|nouveau-né|grossesse|allaitement|insuffisance|femme|homme|sportif|conducteur|obèse|obésité|dénutri)/i;
function mdPrec(a){if(!a.length)return "";return `<div class="fv-panel"><div class="fv-tbl so-tbl md-prec">${a.map(x=>{const m=String(x).match(/^([^:]{2,40}?)\s*:\s*(.+)$/);return m?`<div><span>${esc(m[1])}</span><span>${pmd(m[2])}</span></div>`:`<div><span></span><span>${pmd(x)}</span></div>`;}).join("")}</div></div>`;}
const mdKey=(a,err)=>(a.length?`<div class="fv-key md-key"><h3>${SVG.bulb}À retenir pour les partiels et les stages</h3><ul>${a.map(x=>`<li>${pmd(x)}</li>`).join("")}</ul></div>`:"")+
 (err.length?`<div class="cv-box cv-trap"><span class="cv-lab">${SVG.warn}Erreurs fréquentes</span><ul>${err.map(x=>`<li>${pmd(x)}</li>`).join("")}</ul></div>`:"");
function mdLinks(o){return o.f.map(x=>{
 if(x.startsWith("s:")){const s=SOBY[x.slice(2)];return s?`<a class="chip" href="#soin/${s.i}">${esc(s.n)}</a>`:"";}
 if(x.startsWith("p:")){const p=typeof PBY!=="undefined"&&PBY[x.slice(2)];return p?`<a class="chip" href="#patho/${x.slice(2)}">${esc(p.n||p.titre||x.slice(2))}</a>`:"";}
 if(x.startsWith("m:")){const m=MDBY[x.slice(2)];return m?`<a class="chip" href="#med/${m.i}">${esc(m.n)}</a>`:"";}
 const it=ctLink(x);return it?`<a class="chip" href="#${it.h}">${esc(it.t)}</a>`:"";}).filter((v,i,a)=>v&&a.indexOf(v)===i).join("");}

function vMed(id){
 const o=MDBY[id];if(!o)return notFound();
 const S=MD_SEC[o.s],C=CAT.thera,mode=state.mdMode||"recap",done=mdDone().includes(id);
 const list=mdSecMeds(o.s),k=list.indexOf(o),next=list[k+1],col=MD_COL(o.s),links=mdLinks(o);
 const secs=[
  ["Présentation de la classe",o.d.map((x,i)=>`<p class="${i?"cv-p":"fv-lead"}">${pmd(x)}</p>`).join("")],
  ["Mécanisme d'action",o.ma.map(x=>`<p class="cv-p">${pmd(x)}</p>`).join("")+mdSch(o)],
  ["Principaux médicaments",mdDrugs(o.m)+(o.m.length?`<p class="muted md-note">DCI en gras, puis exemples de noms commerciaux. Toujours vérifier la DCI sur la prescription et l'emballage.</p>`:"")],
  ["Indications thérapeutiques",soList(o.ind)],
  ["Contre-indications et précautions",soList(o.ci)],
  ["Effets indésirables",mdCols("Fréquents",o.ef,"amber","Graves : alerter",o.eg,"coral")],
  ["Interactions médicamenteuses",soList(o.it)],
  ["Voies et modalités d'administration",soList(o.v)],
  ["Surveillances infirmières",mdCols("Cliniques",o.sc,"blue","Biologiques",o.sb,"green")],
  ["Précautions spécifiques",mdPrec(o.p)],
  ["Éducation du patient",soList(o.edu)],
  ["Conduite à tenir devant un effet indésirable ou un incident",o.cat.length?fvBlock({t:"etapes",items:o.cat}):""],
  ["Points essentiels à retenir",mdKey(o.r,o.err)]
 ].filter(x=>x[1]);
 const hero=`<div class="fv-progress" aria-hidden="true"><i id="fv-bar"></i></div><header class="fv-hero"><div class="fv-top"><button class="fv-back" data-act="back">${SVG.back}Retour</button>${done?'<span class="fv-done-badge">Étudiée</span>':""}</div>
  <span class="fv-kicker">${esc(C.nom)} · ${esc(S.nom)}</span><h1>${esc(o.n)}</h1><div class="fv-ico" aria-hidden="true">${ICO[S.ico]||ICO.flask}</div>
  <div class="fv-meta"><span>${plural(o.m.length,"médicament")}</span>${mdHasSch(o)?"<span>Schéma</span>":""}${(n=>n?`<span>${plural(n,"carte")}</span>`:"")(srsOfKey("m:"+id).length)}</div></header>`;
 const seg=`<div class="seg px-seg" role="group" aria-label="Mode de lecture"><button data-act="md-mode" data-k="recap" aria-pressed="${mode==="recap"}">Fiche récap</button><button data-act="md-mode" data-k="cours" aria-pressed="${mode==="cours"}">Cours détaillé</button></div>`;
 let body,toc="";
 if(mode==="recap"){
  const box=(t,a,n)=>a.length?`<div class="px-r"><span class="cv-lab">${t}</span><ul>${a.slice(0,n).map(x=>`<li>${pmd(x)}</li>`).join("")}</ul></div>`:"";
  body=`<div class="px-recap">
   ${a4Cta("m",o.i,"Cette classe en une page : à lire ou à imprimer")}
   <div class="px-r def"><span class="cv-lab">${SVG.info}La classe</span><p>${pmd(o.d[0]||"")}</p></div>
   ${o.ma.length?`<div class="px-r"><span class="cv-lab">Mécanisme</span><p>${pmd(o.ma[0])}</p></div>`:""}
   ${o.m.length?`<div class="px-r"><span class="cv-lab">Principaux médicaments</span>${mdChips(o.m)}</div>`:""}
   <div class="px-grid">${box("Indications",o.ind,4)}${box("Effets indésirables graves",o.eg.length?o.eg:o.ef,4)}${box("Surveillance",[...o.sc.slice(0,3),...o.sb.slice(0,2)],5)}${box("Contre-indications",o.ci,3)}</div>
   ${o.r.length?`<div class="px-r md-r"><span class="cv-lab">${SVG.bulb}L'essentiel</span><ul>${o.r.map(x=>`<li>${pmd(x)}</li>`).join("")}</ul></div>`:""}
   <button class="btn block" data-act="md-mode" data-k="cours">Lire le cours détaillé</button></div>`;
 }else{
  const all=secs;
  toc=`<nav class="fv-toc" aria-label="Parties de la fiche">${all.map((s,i)=>`<a href="#med" data-sec="s-${i+1}"><b>${i+1}</b>${esc(s[0])}</a>`).join("")}</nav>`;
  body=secs.map((s,i)=>`<section class="fv-sec" id="s-${i+1}"><div class="fv-sh"><span class="fv-num">${String(i+1).padStart(2,"0")}</span><h2>${s[0]}</h2></div>${s[1]}</section>`).join("");
 }
 return `<article class="fv px so md" style="--c:${col}">${hero}${toc}<div class="fv-body"><div class="px-head">${seg}</div>${body}
  ${links?`<section class="stack-sm"><h3 class="cn-g">Pour aller plus loin dans l'appli</h3><div class="chips wrapchips">${links}</div></section>`:""}
  <div class="fv-end"><h3>${done?"Fiche étudiée":"Vous avez terminé"}</h3><p class="muted">Marquez-la comme étudiée, puis testez-vous avec les cartes, juste en dessous.</p>
   <div class="row2"><button class="btn ${done?"ghost":"ok"}" data-act="md-done" data-k="${id}">${done?"Retirer des étudiées":"J'ai étudié cette fiche"}</button></div>
   ${next?`<a class="card cat fv-next" style="--c:${col}" href="#med/${next.i}" data-act="md-open" data-k="${mode}"><span class="eyebrow">Fiche suivante</span><h3>${esc(next.n)}</h3></a>`:""}</div></div></article>`;
}

/* ---------- Réviser › Thérapeutiques ---------- */
const mdSecCur=()=>{const s=state.mdSec||store.get("mdsec","all");return mdSecs().includes(s)?s:"all";};
const mdRow=(o,isF,dn)=>`<a class="li" href="#med/${o.i}" data-act="md-open" data-k="${isF?"recap":"cours"}"><span class="bar"></span><span><span class="t">${esc(o.n)}</span><span class="s">${esc(isF?pxCut(o.d[0]||""):pxCut(mdBr(o).map(plainTxt).join(", "),90))}</span></span><span class="end">${dn.includes(o.i)?'<span class="tag done">Étudiée</span>':""}${chev}</span></a>`;
const mdMatch=(o,q)=>!q||mdK(o.n).includes(q)||o.nn.some(x=>mdK(x).includes(q))||o.m.some(x=>mdK(plainTxt(x.dci)+" "+x.br).includes(q));
function mdRevList(isF){const s=mdSecCur(),q=mdK(state.mdq||""),dn=mdDone();let h="";
 (s==="all"?mdSecs():[s]).forEach(sec=>{const S=MD_SEC[sec],l=mdSecMeds(sec).filter(o=>mdMatch(o,q));
  if(l.length)h+=pxSec(MD_COL(sec),s==="all"?esc(S.nom):(isF?"Fiches récap":"Cours détaillés"),l.length,l.map(o=>mdRow(o,isF,dn)).join(""));});
 return h||`<div class="empty">Aucune classe ni aucun médicament ne correspond à « ${esc(state.mdq)} ».</div>`;}
function mdRev(isF){
 const s=mdSecCur(),S=s==="all"?null:MD_SEC[s],n=S?mdSecMeds(s).length:mdN(),dn=mdDone();
 const tools=S?(()=>{const ids=new Set(mdSecMeds(s).map(o=>o.i)),nq=srsKeysCards([...ids].map(i=>"m:"+i)).length,d=[...ids].filter(i=>dn.includes(i)).length;
   return nq||d?`<div class="px-spebtns">${nq?`<button class="btn sm" data-act="md-sec-cards" data-k="${s}">${SRS_IC.cards}Cartes · ${nq}</button>`:""}${d?`<span class="muted px-spedone">${d} étudiée${d>1?"s":""}</span>`:""}</div>`:"";})():"";

 return `<span class="eyebrow px-revlab" id="px-top">Spécialité</span>
  <div class="px-revbar"><label class="px-sel" style="--c:${S?MD_COL(s):"var(--brand)"}"><span class="dot"></span><b>${esc(S?S.nom:"Toutes les spécialités")}</b><small>${n}</small><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
   <select id="mdsec" aria-label="Choisir une spécialité"><option value="all"${s==="all"?" selected":""}>Toutes les spécialités (${mdN()})</option>${mdSecs().map(id=>`<option value="${id}"${s===id?" selected":""}>${esc(MD_SEC[id].nom)} (${mdSecMeds(id).length})</option>`).join("")}</select></label></div>
  ${tools}
  <label class="search-field">${IC.search}<input id="mdq" type="search" placeholder="Classe ou médicament (DCI, nom commercial)" value="${esc(state.mdq||"")}" autocomplete="off" aria-label="Filtrer les classes thérapeutiques"></label>
  <div class="stack-lg" id="md-list">${mdRevList(isF)}</div>`;
}
const mdEntry=isF=>`<a class="li px-entry" role="button" tabindex="0" data-act="md-go" style="--c:${CAT.thera.c}"><span class="bar"></span><span><span class="t">Toutes les classes thérapeutiques par spécialité</span><span class="s">${mdN()} ${isF?"fiches récap":"cours détaillés"} · mécanisme, médicaments, effets indésirables, surveillance, cartes</span></span><span class="end">${chev}</span></a>`;

/* ---------- Recherche et questions (partiels blancs) ---------- */
function mdIdx(){return MEDS.map(o=>({t:"m",it:{id:o.i,titre:o.n,cat:"thera",theme:MD_SEC[o.s].nom},txt:plainTxt([o.nn.join(" "),o.m.map(x=>x.dci+" "+x.br).join(" "),o.d.join(" "),o.ma.join(" "),o.ind.join(" "),o.ef.join(" "),o.eg.join(" "),o.sc.join(" ")].join(" "))}));}
function mdMakeQuiz(){MEDS.forEach(o=>{const S=MD_SEC[o.s],add=(q,opts,a,e)=>{if(opts.length<3)return;const x=norm(Q("thera",S.u,q,opts,a,e));x.mid=o.i;QUIZ.push(x);};
 o.q.forEach(q=>add(`${o.n} : ${plainTxt(q.q)}`,q.o.map(plainTxt),q.a,plainTxt(q.e)));});}
mdMakeQuiz();

/* ---------- Actions ---------- */
function mdAct(b,a){const k=b.dataset.k;
 if(a==="md-open"){state.mdMode=k;return;}
 if(a==="md-go"){nav("reviser/meds");return;}
 if(a==="md-mode"){state.mdMode=k;render();const t=document.querySelector(".px-head");if(t)t.scrollIntoView();return;}
 if(a==="md-done"){let d=mdDone();const on=!d.includes(k);d=on?[...d,k]:d.filter(x=>x!==k);store.set("mddone",d);haptic();if(on)toast("Fiche marquée comme étudiée");render();return;}
 if(a==="md-sec-cards"){srsKeysGo(mdSecMeds(k).map(o=>"m:"+o.i),MD_SEC[k].nom);return;}
}
function mdInput(t){
 if(t.id==="mdsec"){if(mdSecCur()!==t.value){state.mdSec=t.value;store.set("mdsec",t.value);render();pxBind(true);}return true;}
 if(t.id==="mdq"){state.mdq=t.value;const ol=document.getElementById("md-list");if(ol)ol.innerHTML=mdRevList(state.rev==="fiches");return true;}
 return false;
}
