/* Carnet IFSI — accueil personnalisable : catalogue de widgets, disposition enregistrée sur l'appareil (ordre, taille,
   réglages de chaque widget, prénom), rendu de l'accueil et page « Personnaliser l'accueil » (ajout, retrait,
   glisser-déposer ou flèches, grand ou petit format). Chargé après outils.js et stages-hist.js, avant app.js. */
const HW_DEFAULT=["recherche","partiels","urgences","progression","reprendre","question","entrainer","raccourcis","stage","themes","semestre"];
const HW_SC_DEFAULT=["o-planning","o-pansement","o-tfe","o-calculs"];
const HW_SC_MAX=12;
const HW_GROUPS=[["rev","Réviser"],["train","S'entraîner"],["stage","Stage"],["orga","Organisation"],["outils","Outils pratiques"]];
const HW_ICS={
 grid:'<svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.6"/><path d="M17 13.5v7M13.5 17h7"/></svg>',
 handle:'<svg viewBox="0 0 24 24"><circle cx="9" cy="6" r="1.4"/><circle cx="15" cy="6" r="1.4"/><circle cx="9" cy="12" r="1.4"/><circle cx="15" cy="12" r="1.4"/><circle cx="9" cy="18" r="1.4"/><circle cx="15" cy="18" r="1.4"/></svg>',
 up:'<svg viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
 down:'<svg viewBox="0 0 24 24"><path d="M12 5v14M6 13l6 6 6-6"/></svg>',
 minus:'<svg viewBox="0 0 24 24"><path d="M6 12h12"/></svg>',
 dice:'<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3.5"/><circle cx="9" cy="9" r="1.2"/><circle cx="15" cy="15" r="1.2"/><circle cx="15" cy="9" r="1.2"/><circle cx="9" cy="15" r="1.2"/></svg>',
 drop:'<svg viewBox="0 0 24 24"><path d="M12 3s6 6.6 6 11a6 6 0 0 1-12 0c0-4.4 6-11 6-11z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/></svg>',
 bulb:'<svg viewBox="0 0 24 24"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/></svg>',
 help:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.6 9.3a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.8"/><circle cx="12" cy="17.2" r=".6"/></svg>',
 grow:'<svg viewBox="0 0 24 24"><path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>',
 shrink:'<svg viewBox="0 0 24 24"><path d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7"/></svg>',
 route:'<svg viewBox="0 0 24 24"><circle cx="6" cy="19" r="2.2"/><circle cx="18" cy="5" r="2.2"/><path d="M8.2 19H15a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h6.8"/></svg>'
};

/* ---------- Disposition enregistrée ---------- */
function hwGet(){hwCat();const h=store.get("home",null);
 if(h&&Array.isArray(h.w))return {name:h.name||"",w:h.w.filter(x=>x&&HW[x.id])};
 return {name:(h&&h.name)||"",w:HW_DEFAULT.map(id=>({id}))};}
const hwSet=h=>store.set("home",h);
const hwSec=(title,right,body,cls="")=>`<section class="stack-sm ${cls}"><div class="section-title"><h2>${title}</h2>${right||""}</div>${body}</section>`;
const hwTile=(o)=>`<${o.h?"a":"button"} class="hw-tile" ${o.h?`href="${o.h}"`:`type="button" data-act="${o.act}"${o.k!=null?` data-k="${esc(o.k)}"`:""}`} style="--c:${o.c||"var(--brand)"}"><span class="hw-tile-ic tb-ic">${o.ic}</span>${o.big!=null?`<b class="hw-big">${o.big}</b>`:""}<span class="hw-lab">${o.lab}</span></${o.h?"a":"button"}>`;
const hwSeed=s=>{let h=2166136261;for(const ch of s){h^=ch.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;};
const hwIc=(svg,c)=>`<span class="ic tb-ic" style="--c:${c}">${svg}</span>`;

/* ---------- Raccourcis ---------- */
function hwShortcuts(){
 const L=[];
 TOOLS.forEach(t=>L.push({id:"o-"+t.id,g:"Outils",n:t.s,ic:OT_IC[t.id],c:t.c,h:"#outil/"+t.id}));
 const cat=(id,n)=>({id:"c-"+id,g:"Réviser",n,ic:CAT_IC[id],c:"#4C6B7D",act:"go-cat",k:id});
 L.push({id:"p-fiches",g:"Réviser",n:"Fiches",ic:IC.sheet,c:"#2A5D85",h:"#reviser/fiches"},{id:"p-cours",g:"Réviser",n:"Cours",ic:IC.book,c:"#2A5D85",h:"#reviser/cours"},
  cat("patho","Pathologies"),cat("soins","Soins"),cat("thera","Médicaments"),cat("anat","Anatomie"),cat("exam","Examens"),cat("voca","Vocabulaire"),cat("role","Rôle infirmier"),cat("tfe","Mémoire"),
  {id:"p-quiz",g:"S'entraîner",n:"Quiz",ic:IC.bolt,c:"#B55E3A",h:"#entrainer/quiz"},{id:"p-express",g:"S'entraîner",n:"Quiz express",ic:IC.bolt,c:"#B55E3A",act:"quiz-quick"},
  {id:"p-erreurs",g:"S'entraîner",n:"Mes erreurs",ic:IC.redo,c:"#B03E30",act:"quiz-wrong"},{id:"p-calc",g:"S'entraîner",n:"Exercices de calcul",ic:IC.flask,c:"#2C7451",h:"#entrainer/calculs"},
  {id:"p-schemas",g:"S'entraîner",n:"Schémas",ic:CAT_IC.anat,c:"#6E5196",h:"#entrainer/schemas"},
  {id:"p-stages",g:"Stage",n:"Stages",ic:CAT_IC.stage,c:"#9A7A2E",h:"#stages"},{id:"p-carnet",g:"Stage",n:"Carnet de suivi",ic:IC.sheet,c:"#9A7A2E",h:"#carnet"},
  {id:"p-journal",g:"Stage",n:"Noter ma journée",ic:IC.cal,c:"#9A7A2E",h:"#carnet/journal"},{id:"p-soinsfaits",g:"Stage",n:"Soins réalisés",ic:IC.check,c:"#9A7A2E",h:"#carnet/soins"},
  {id:"p-programme",g:"Autres",n:"Programme",ic:IC.cap,c:"#2A5D85",h:"#programme"},{id:"p-favoris",g:"Autres",n:"Favoris",ic:IC.star,c:"#9A7A2E",act:"favs"},
  {id:"p-recherche",g:"Autres",n:"Rechercher",ic:IC.search,c:"#5C6B7A",h:"#recherche"},{id:"p-reglages",g:"Autres",n:"Réglages",ic:IC.gear,c:"#5C6B7A",h:"#reglages"});
 return L.filter(x=>x.ic);
}
let HW_SC_CACHE=null;const hwSC=()=>HW_SC_CACHE||(HW_SC_CACHE=hwShortcuts());
const hwScItem=s=>{const inner=`<span class="ic tb-ic" style="--c:${s.c}">${s.ic}</span>${esc(s.n)}`;
 return s.h?`<a href="${s.h}">${inner}</a>`:`<button type="button" data-act="${s.act}"${s.k?` data-k="${s.k}"`:""}>${inner}</button>`;};

/* ---------- Données utilitaires ---------- */
const hwPct=()=>totalItems?Math.round(doneItems()/totalItems*100):0;
function hwStage(){
 const s=stageInfo(),start=at(s.debut,s.arrivee||"07:00"),end=s.fin?at(s.fin,"23:59"):null,now=Date.now();
 if(!start)return {k:"none",s};
 if(now<start)return {k:"before",s,start,end};
 if(end&&now>end)return {k:"after",s,start,end};
 const tot=end?Math.max(1,Math.round((day0(end)-day0(start))/DAY)+1):null,jour=Math.round((day0(now)-day0(start))/DAY)+1;
 return {k:"during",s,start,end,tot,jour:tot?Math.min(jour,tot):jour};
}
function hwToday(){const d=todayISO();return [...agLate(d),...[...agenda().filter(e=>e.d===d),...agAuto(d,d)].sort((a,b)=>(a.h||"").localeCompare(b.h||""))];}
/* Questions courtes uniquement : les options très longues (questions générées des pathologies) restent pour le quiz. */
const hwQShort=q=>q&&q.o&&q.o.length>=2&&q.o.every(o=>String(o).length<=95)&&String(q.q).length<=190&&!/image|schéma|planche|ci-dessus|ci-contre/i.test(q.q);
function hwQPool(w){const all=QUIZ.map((q,i)=>i).filter(i=>hwQShort(QUIZ[i])),L=all.filter(i=>!w.cat||QUIZ[i].cat===w.cat);return L.length?L:all;}
function hwQIndex(w){
 const d=todayISO(),key=w.cat||"",st=store.get("hwq",{}),pool=hwQPool(w);
 if(st.d===d&&st.k===key&&QUIZ[st.i])return st;
 const ns={d,k:key,i:pool[hwSeed(d+key)%pool.length],pick:null};store.set("hwq",ns);return ns;
}
const HW_NSRC=[["f","Fiches"],["c","Cours"],["p","Pathologies"],["s","Soins"],["m","Médicaments"]];
function hwNotionPool(w){
 const src=w.src&&w.src.length?w.src:HW_NSRC.map(x=>x[0]),out=[];
 const txt=s=>String(s||"").replace(/\*\*/g,"").replace(/\s+/g," ").trim();
 if(src.includes("f"))FICHES.filter(f=>!f.pro&&f.cat!=="quiz").forEach(f=>out.push({t:"Fiche",n:f.titre,s:f.theme,h:"#fiche/"+f.id,c:(CAT[f.cat]||{}).c||"#B9D4EE",ic:CAT_IC[f.cat]||IC.sheet}));
 if(src.includes("c"))COURS.filter(c=>c.chap).forEach(c=>out.push({t:"Cours",n:c.titre,s:c.duree?"Cours · "+c.duree:"",h:"#cours/"+c.id,c:(CAT[c.cat]||{}).c||"#B9D4EE",ic:CAT_IC[c.cat]||IC.book}));
 if(src.includes("p"))PATHOS.forEach(p=>out.push({t:"Pathologie",n:p.n,s:txt(p.d),h:"#patho/"+p.i,c:(SPE[p.s]||{}).c||"#EDC4C7",ic:CAT_IC.patho}));
 if(src.includes("s"))SOINS.forEach(o=>out.push({t:"Soin",n:o.n,s:txt(o.d),h:"#soin/"+o.i,c:"#B9D4EE",ic:CAT_IC.soins}));
 if(src.includes("m"))MEDS.forEach(o=>out.push({t:"Médicaments",n:o.n,s:txt(o.d),h:"#med/"+o.i,c:"#CFE3C3",ic:CAT_IC.thera}));
 return out;
}

/* ---------- Catalogue (construit au premier usage : les icônes IC et CAT_IC sont définies par app.js) ---------- */
const HW={};
function hwCat(){if(hwCat.ok)return HW;hwCat.ok=1;Object.assign(HW,{
 recherche:{n:"Barre de recherche",d:"Trouver une fiche, un cours ou une notion",g:"orga",ic:IC.search,c:"#5C6B7A",
  r:()=>`<button class="search-pill" data-act="nav" data-h="recherche">${IC.search}Rechercher une fiche, un cours, une notion…</button>`},
 partiels:{n:"Mes partiels",d:"Compte à rebours jusqu'aux prochains partiels",g:"orga",ic:IC.cal,c:"#B55E3A",sz:1,
  r:()=>examCard(),
  s:()=>{const now=Date.now(),n=exams().map(e=>({...e,ts:at(e.date,e.heure)})).filter(e=>e.ts&&e.ts>now).sort((a,b)=>a.ts-b.ts)[0];
   return n?hwTile({act:"exam-edit",ic:IC.cal,c:"#B55E3A",big:esc(jMoins(n.ts)),lab:esc(n.nom)}):hwTile({act:"exam-edit",ic:IC.cal,c:"#B55E3A",big:"+",lab:"Ajouter mes partiels"});}},
 stage:{n:"Mon stage",d:"Compte à rebours, jour de stage et accès au carnet",g:"stage",ic:CAT_IC.stage,c:"#9A7A2E",sz:1,
  r:()=>{const S=hwStage(),act=[];
   if(S.k==="none")return hwSec("Mon stage",`<a href="#stages">Renseigner</a>`,`<a class="list" href="#stages"><span class="li"><span class="ic tb-ic" style="--c:#9A7A2E">${CAT_IC.stage}</span><span><span class="t">Préparer mon prochain stage</span><span class="s">Dates, service, tuteur, objectifs : le compte à rebours démarre tout seul</span></span>${chev}</span></a>`);
   if(S.k==="during")act.push(`<a class="btn" href="#carnet/journal">${IC.cal}Noter ma journée</a>`);
   act.push(`<a class="btn ghost" href="#carnet">${IC.sheet}Carnet de suivi</a>`);
   if(S.k==="before"){const n=store.get("check",[]).length;act.push(`<a class="btn ghost" href="#stages">Check-list ${n}/${CHECKLIST.length}</a>`);}
   return `<div class="stack-sm">${stageCountdown().replace('id="stage-cd"','')}<div class="hw-acts">${act.join("")}</div></div>`;},
  s:()=>{const S=hwStage(),sv=S.s.service?esc(S.s.service):"";
   if(S.k==="none")return hwTile({h:"#stages",ic:CAT_IC.stage,c:"#9A7A2E",big:"–",lab:"Mon stage : à renseigner"});
   if(S.k==="before")return hwTile({h:"#stages",ic:CAT_IC.stage,c:"#9A7A2E",big:esc(jMoins(S.start)),lab:`avant le stage${sv?" · "+sv:""}`});
   if(S.k==="after")return hwTile({h:"#stages",ic:CAT_IC.stage,c:"#9A7A2E",big:"Fini",lab:`Stage terminé${sv?" · "+sv:""}`});
   return hwTile({h:"#carnet/journal",ic:CAT_IC.stage,c:"#9A7A2E",big:`J${S.jour}${S.tot?`<small>/${S.tot}</small>`:""}`,lab:`de stage${sv?" · "+sv:""}`});}},
 urgences:{n:"Urgences AFGSU",d:"Fiches réflexes : arrêt cardiaque, étouffement, hémorragie…",g:"outils",ic:OT_IC.urgences,c:"#C8372D",sz:1,
  r:()=>afHome(),s:()=>hwTile({h:"#outil/urgences",ic:OT_IC.urgences,c:"#C8372D",big:"AFGSU",lab:`${AF.length} fiches réflexes d'urgence`})},
 progression:{n:"Ma progression",d:"Contenus révisés, calculs justes, meilleur quiz",g:"rev",ic:IC.check,c:"#2C7451",sz:1,
  r:()=>{const s=stats();return `<section class="dash">${ring(hwPct())}
   <div class="dash-txt"><span class="k">Ma progression</span><h2>${doneItems()} sur ${totalItems} contenus révisés</h2>
    <div class="dash-stats"><span><b>${s.exTot?Math.round(s.exOk/s.exTot*100)+"%":"–"}</b>calculs justes</span><span><b>${s.quizBest==null?"–":s.quizBest}</b>meilleur quiz</span></div></div></section>`;},
  s:()=>`<a class="hw-tile hw-prog" href="#reviser" style="--c:#2C7451">${ring(hwPct(),58)}<span class="hw-lab">${doneItems()} sur ${totalItems} contenus révisés</span></a>`},
 reprendre:{n:"Reprendre",d:"Le dernier cours ou la dernière fiche ouverte",g:"rev",ic:IC.play,c:"#2A5D85",sz:1,
  it:()=>{const last=store.get("last",null);if(!last)return null;const it=last.t==="f"?FICHES.find(x=>x.id===last.id):COURS.find(x=>x.id===last.id);return it?{it,t:last.t}:null;},
  r:()=>{const L=HW.reprendre.it();if(!L)return "";const {it,t}=L;
   return hwSec("Reprendre","",`<a class="card resume" href="#${t==="f"?"fiche":"cours"}/${it.id}" style="--c:${CAT[it.cat].c}"><span class="ic">${CAT_IC[it.cat]}</span><span><span class="eyebrow">${t==="f"?"Fiche":"Cours"} · ${esc(CAT[it.cat].nom)}</span><h3>${esc(it.titre)}</h3></span>${chev}</a>`);},
  s:()=>{const L=HW.reprendre.it();if(!L)return "";const {it,t}=L;return hwTile({h:`#${t==="f"?"fiche":"cours"}/${it.id}`,ic:CAT_IC[it.cat],c:"#2A5D85",lab:`<span class="hw-k">Reprendre</span><b class="hw-tt">${esc(it.titre)}</b>`});}},
 question:{n:"Question du jour",d:"Une question de quiz chaque jour, avec la correction",g:"train",ic:HW_ICS.help,c:"#B55E3A",cfg:1,
  r:(w,i)=>{const st=hwQIndex(w),q=QUIZ[st.i];if(!q)return "";const done=st.pick!=null,ok=done&&st.pick===q.a,L="ABCDE";
   return hwSec("Question du jour",`<button data-act="hw-q-next" data-i="${i}">Une autre</button>`,`<div class="sheet-body hw-q"><span class="eyebrow" style="color:var(--accent)">${esc((CAT[q.cat]||{nom:"Quiz"}).nom)}</span><p class="hw-q-t">${esc(q.q)}</p>
    <div class="stack-sm">${q.o.map((o,k)=>`<button class="opt ${done?(k===q.a?"good":k===st.pick?"wrong":""):""}" data-act="hw-q" data-i="${i}" data-k="${k}" ${done?"disabled":""}><span class="l">${L[k]}</span><span>${esc(o)}</span></button>`).join("")}</div>
    ${done?`<div class="callout hw-q-e ${ok?"ok":"ko"}"><b>${ok?"Bonne réponse !":"Pas tout à fait."}</b> ${esc(q.e||"")}${ok?"":` <span class="muted">La question est ajoutée à « Mes erreurs ».</span>`}</div>`:""}</div>`);},
  cfg:(w,i)=>{const cats=CATS.filter(c=>QUIZ.some(q=>q.cat===c.id));
   return `<label class="hw-cfg-l" for="hw-qcat-${i}">Thème des questions<select id="hw-qcat-${i}" data-hw="qcat" data-i="${i}"><option value="">Tous les thèmes</option>${cats.map(c=>`<option value="${c.id}" ${w.cat===c.id?"selected":""}>${esc(c.nom)}</option>`).join("")}</select></label>`;}},
 notion:{n:"À découvrir aujourd'hui",d:"Une fiche, un cours, une pathologie, un soin ou un médicament au hasard chaque jour",g:"rev",ic:HW_ICS.bulb,c:"#9A7A2E",cfg:1,
  r:(w,i)=>{const P=hwNotionPool(w);if(!P.length)return "";const o=P[(hwSeed(todayISO()+(w.src||[]).join(""))+(state.hwN||0)*7919)%P.length];
   return hwSec("À découvrir aujourd'hui",`<button data-act="hw-n-next">Une autre</button>`,`<a class="card hw-notion" href="${o.h}" style="--c:${o.c}"><span class="hw-n-top"><span class="ic">${o.ic}</span><span class="eyebrow">${esc(o.t)}</span></span><h3>${esc(o.n)}</h3>${o.s?`<p class="muted">${esc(o.s.length>170?o.s.slice(0,167).replace(/\s+\S*$/,"")+"…":o.s)}</p>`:""}<span class="hw-more">Lire${chev}</span></a>`);},
  cfg:(w,i)=>{const src=w.src&&w.src.length?w.src:HW_NSRC.map(x=>x[0]);
   return `<span class="hw-cfg-h">Piocher dans</span><div class="chips wrapchips">${HW_NSRC.map(([k,l])=>`<button class="chip" data-act="hw-nsrc" data-i="${i}" data-k="${k}" aria-pressed="${src.includes(k)}">${l}</button>`).join("")}</div>`;}},
 entrainer:{n:"S'entraîner",d:"Quiz express, calcul de dose, erreurs et favoris",g:"train",ic:IC.bolt,c:"#B55E3A",sz:1,
  r:()=>{const nW=wrongs().length;return hwSec("S'entraîner","",`<div class="quick">
    <button class="qa" data-act="quiz-quick"><span class="ic">${IC.bolt}</span><b>Quiz express</b><small>10 questions au hasard</small></button>
    <button class="qa" data-act="nav" data-h="entrainer/calculs"><span class="ic acc">${IC.flask}</span><b>Calcul de dose</b><small>Énoncés illimités</small></button>
    <button class="qa" data-act="quiz-wrong" ${nW?"":"disabled style='opacity:.55'"}><span class="ic acc">${IC.redo}</span><b>Mes erreurs</b><small>${nW?plural(nW,"question")+" à revoir":"Aucune pour l'instant"}</small></button>
    <button class="qa" data-act="favs"><span class="ic">${IC.star}</span><b>Favoris</b><small>${plural(favs().length,"élément")}</small></button></div>`);},
  s:()=>hwTile({act:"quiz-quick",ic:IC.bolt,c:"#B55E3A",big:"Quiz",lab:"10 questions express au hasard"})},
 raccourcis:{n:"Raccourcis",d:"Vos outils et pages préférés, à choisir",g:"outils",ic:HW_ICS.grid,c:"#2A5D85",cfg:1,multi:1,
  r:(w,i)=>{const ids=w.sc||HW_SC_DEFAULT,L=ids.map(id=>hwSC().find(s=>s.id===id)).filter(Boolean);
   return hwSec(esc(w.t||"Raccourcis"),`<button data-act="hw-edit" data-i="${i}">Modifier</button>`,L.length?`<div class="ot-mini hw-sc">${L.map(hwScItem).join("")}</div>`:`<p class="muted">Aucun raccourci : touchez « Modifier » pour en choisir.</p>`);},
  cfg:(w,i)=>{const ids=w.sc||HW_SC_DEFAULT,A=hwSC(),groups=[...new Set(A.map(s=>s.g))];
   return `<label class="hw-cfg-l" for="hw-t-${i}">Titre du widget<input id="hw-t-${i}" data-hw="title" data-i="${i}" maxlength="30" placeholder="Raccourcis" value="${esc(w.t||"")}"></label>
    <span class="hw-cfg-h">Choisissez jusqu'à ${HW_SC_MAX} raccourcis · ${ids.length}/${HW_SC_MAX}</span>
    ${groups.map(g=>`<span class="hw-cfg-g">${esc(g)}</span><div class="chips wrapchips">${A.filter(s=>s.g===g).map(s=>`<button class="chip" data-act="hw-sc" data-i="${i}" data-k="${s.id}" aria-pressed="${ids.includes(s.id)}">${esc(s.n)}</button>`).join("")}</div>`).join("")}`;}},
 themes:{n:"Réviser par thème",d:"Toutes les catégories de fiches et de cours",g:"rev",ic:IC.book,c:"#2A5D85",
  r:()=>hwSec("Réviser par thème",`<a href="#reviser">Tout voir</a>`,`<div class="cats">${CATS.map(c=>{const n=FICHES.filter(f=>f.cat===c.id).length+FULL_COURS.filter(x=>x.cat===c.id).length;
    const sub=c.id==="stage"?"Préparation":c.id==="calcul"?"Exercices illimités":c.id==="quiz"?QUIZ.length+" questions":c.id==="patho"?PATHOS.length+" pathologies par spécialité":(c.id==="soins"||c.id==="exam")&&soCatN(c.id)?`${soCatN(c.id)} fiches ${c.id==="exam"?"de surveillance":"de soins"} + ${plural(n,"contenu")}`:c.id==="thera"&&mdN()?`${mdN()} classes thérapeutiques + ${plural(n,"contenu")}`:plural(n,"contenu");
    return `<button class="cat-row" style="--c:${c.c}" data-act="go-cat" data-k="${c.id}"><span class="sw">${CAT_IC[c.id].replace('<svg','<svg style="width:18px;height:18px;stroke:#1A252A;fill:none;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round"')}</span><span><b>${esc(c.nom)}</b><small>${sub}</small></span></button>`}).join("")}</div>`)},
 semestre:{n:"Mon semestre",d:"Les UE de votre semestre, en un geste",g:"rev",ic:IC.cap,c:"#2A5D85",
  r:()=>{const R=UE[state.ueRef]||UE["2026"],L=R.list.filter(u=>u[3].includes(state.sem));
   return hwSec(`Mon semestre`,`<a href="#programme">Programme</a>`,`<div class="chips hw-sem" role="group" aria-label="Semestre">${[1,2,3,4,5,6].map(s=>`<button class="chip" data-act="sem" data-k="${s}" aria-pressed="${state.sem===s}">S${s}</button>`).join("")}</div>
    ${L.length?`<div class="list">${L.map(u=>`<a class="li" href="#ue/${encodeURIComponent(u[0])}"><span class="hw-ue">${esc(u[0])}</span><span><span class="t">${esc(u[1])}</span></span>${chev}</a>`).join("")}</div>`:`<p class="muted">Aucune UE pour ce semestre.</p>`}
    <small class="ot-hint">${esc(R.sub||"Référentiel "+state.ueRef)} (${esc(R.label||"")}) · changez de référentiel dans Programme.</small>`);}},
 pathos:{n:"Pathologies",d:"Les spécialités en un geste et une pathologie au hasard",g:"rev",ic:CAT_IC.patho,c:"#C25B6A",sz:1,cfg:1,
  r:(w,i)=>{const spes=(w.spe&&w.spe.length?w.spe:SPES.map(x=>x[0])).filter(s=>SPE[s]),done=pxDone().length;
   return hwSec("Pathologies",`<button data-act="hw-px-rand">${HW_ICS.dice.replace("<svg",'<svg class="hw-inl"')} Au hasard</button>`,`<div class="hw-spes">${spes.map(s=>`<a href="#pathos/${s}" class="hw-spe" style="--c:${SPE[s].c}"><span class="sw">${(typeof ICO!=="undefined"&&ICO[SPE_ICO[s]])||""}</span>${esc(SPE[s].nom)}</a>`).join("")}</div>
    <div class="hw-px-p"><div class="progress"><i style="width:${PATHOS.length?done/PATHOS.length*100:0}%"></i></div><small class="muted">${done} sur ${PATHOS.length} pathologies revues</small></div>`);},
  s:()=>hwTile({act:"hw-px-rand",ic:CAT_IC.patho,c:"#C25B6A",big:`${pxDone().length}<small>/${PATHOS.length}</small>`,lab:"pathologies revues · toucher pour une au hasard"}),
  cfg:(w,i)=>{const sel=w.spe||[];return `<span class="hw-cfg-h">Spécialités affichées ${sel.length?`· ${sel.length}`:"· toutes"}</span><div class="chips wrapchips">${SPES.map(([s,n])=>`<button class="chip" data-act="hw-spe" data-i="${i}" data-k="${s}" aria-pressed="${sel.includes(s)}">${esc(n)}</button>`).join("")}</div><small class="ot-hint">Sans sélection, toutes les spécialités sont affichées.</small>`;}},
 planning:{n:"Aujourd'hui",d:"Le programme du jour issu de votre planning",g:"orga",ic:IC.cal,c:"#2A5D85",sz:1,
  r:()=>{const L=hwToday(),dm=addDays(todayISO(),1),nD=agenda().filter(e=>e.d===dm).length+agAuto(dm,dm).length;
   return hwSec("Aujourd'hui",`<a href="#outil/planning">Planning</a>`,`<div class="sheet-body hw-ag">${L.length?`<div class="ag-items">${L.map(agRow).join("")}</div>`:`<p class="muted">Rien de prévu aujourd'hui.</p>`}
    <div class="hw-ag-f"><small class="muted">Demain : ${nD?plural(nD,"événement"):"rien de prévu"}</small><button class="link" data-act="hw-ag-add">${IC.plus.replace("<svg",'<svg class="hw-inl"')} Ajouter</button></div></div>`);},
  s:()=>{const L=hwToday().filter(e=>!e.done);return hwTile({h:"#outil/planning",ic:IC.cal,c:"#2A5D85",big:L.length,lab:L.length?"à faire aujourd'hui":"rien de prévu aujourd'hui"});}},
 favoris:{n:"Mes favoris",d:"Vos fiches et cours marqués d'une étoile",g:"rev",ic:IC.star,c:"#9A7A2E",sz:1,
  r:()=>{const L=favs().slice().reverse().map(k=>{const [t,id]=k.split(":");const it=t==="f"?FICHES.find(x=>x.id===id):t==="c"?COURS.find(x=>x.id===id):null;return it?[it,t]:null;}).filter(Boolean);
   return hwSec("Mes favoris",L.length?`<button data-act="favs">Tout voir</button>`:"",L.length?`<div class="list">${L.slice(0,5).map(([it,t])=>itemRow(it,t)).join("")}</div>`:`<p class="muted">Touchez l'étoile d'une fiche ou d'un cours pour le retrouver ici.</p>`);},
  s:()=>hwTile({act:"favs",ic:IC.star,c:"#9A7A2E",big:favs().length,lab:favs().length>1?"favoris":"favori"})},
 notes:{n:"Bloc-notes",d:"Vos dernières notes et une note rapide",g:"orga",ic:OT_IC.notes,c:"#5C6B7A",sz:1,
  r:()=>{const L=notesL().sort((a,b)=>b.u-a.u).slice(0,3);
   return hwSec("Bloc-notes",`<a href="#outil/notes">Toutes</a>`,`<div class="stack-sm">${L.length?`<div class="list">${L.map(x=>`<button type="button" class="li" data-act="hw-note" data-id="${esc(x.id)}"><span class="ic tb-ic" style="--c:#5C6B7A">${OT_IC.notes}</span><span><span class="t">${esc(x.t||"Sans titre")}</span><span class="s">${esc((x.x||"").replace(/\s+/g," ").slice(0,70)||"Note vide")}</span></span>${chev}</button>`).join("")}</div>`:""}
    <button class="btn ghost block" data-act="hw-note-new">${IC.plus}Nouvelle note</button></div>`);},
  s:()=>{const n=notesL().length;return hwTile({h:"#outil/notes",ic:OT_IC.notes,c:"#5C6B7A",big:n,lab:n>1?"notes":"note"});}},
 reperes:{n:"Valeurs normales",d:"Constantes, NFS, ionogramme, gaz du sang… à choisir",g:"outils",ic:OT_IC.reperes,c:"#B03E30",cfg:1,multi:1,
  r:(w,i)=>{const b=RP[w.b||0]||RP[0];return hwSec(esc(b[0]),`<a href="#outil/reperes">Tous les repères</a>`,`<div class="list rp">${b[1].map(([a,v])=>`<div class="rp-r"><span>${esc(a)}</span><b>${esc(v)}</b></div>`).join("")}</div>`);},
  cfg:(w,i)=>`<label class="hw-cfg-l" for="hw-rp-${i}">Repères affichés<select id="hw-rp-${i}" data-hw="rp" data-i="${i}">${RP.map(([h],k)=>`<option value="${k}" ${(w.b||0)===k?"selected":""}>${esc(h)}</option>`).join("")}</select></label>`},
 debit:{n:"Calcul de débit",d:"Débit d'une perfusion en mL/h et en gouttes/min",g:"outils",ic:HW_ICS.drop,c:"#2C7451",
  r:()=>{const v=state.hwDeb||{};return hwSec("Calcul de débit",`<a href="#outil/calculs">Autres calculs</a>`,`<div class="sheet-body cd-form hw-deb">
   <div class="cd-row"><label for="hw-dv">Volume (mL)<input id="hw-dv" data-hw="deb" data-k="v" type="number" inputmode="decimal" min="0" value="${esc(v.v||"")}" placeholder="500"></label><label for="hw-dh">Durée (h)<input id="hw-dh" data-hw="deb" data-k="h" type="number" inputmode="decimal" min="0" step="0.25" value="${esc(v.h||"")}" placeholder="8"></label></div>
   <label for="hw-dg">Perfuseur<select id="hw-dg" data-hw="deb" data-k="g"><option value="20" ${v.g!=="60"?"selected":""}>Standard · 20 gouttes/mL</option><option value="60" ${v.g==="60"?"selected":""}>Pédiatrique · 60 gouttes/mL</option></select></label>
   <div class="hw-deb-out" id="hw-deb-out" aria-live="polite">${hwDebOut()}</div></div>`);}},
 parcours:{n:"Mon parcours de stage",d:"Stages archivés, semaines faites, types de stage validés",g:"stage",ic:HW_ICS.route,c:"#9A7A2E",sz:1,
  r:()=>{const L=stagesHist(),weeks=L.reduce((n,r)=>n+shWeeks(r),0),types=STAGE_TYPES.map(t=>[t,L.some(r=>r.stage.type===t)]);
   return hwSec("Mon parcours de stage",`<a href="#stages">Détails</a>`,L.length?`<div class="sheet-body sh-sum"><div class="cn-kpi"><span><b>${L.length}</b>stage${L.length>1?"s":""}</span><span><b>${fmtWeeks(weeks)}</b>semaine${weeks>1?"s":""}</span><span><b>${types.filter(t=>t[1]).length}/4</b>types</span></div>
    <div class="sh-types">${types.map(([t,ok])=>`<span class="sh-type${ok?" ok":""}">${ok?"✓":"○"} ${esc(t)}</span>`).join("")}</div></div>`:`<p class="muted">Vos stages terminés s'afficheront ici, avec leurs semaines et leurs types.</p>`);},
  s:()=>{const L=stagesHist(),w=L.reduce((n,r)=>n+shWeeks(r),0);return hwTile({h:"#stages",ic:HW_ICS.route,c:"#9A7A2E",big:L.length,lab:L.length?`${L.length>1?"stages faits":"stage fait"} · ${fmtWeeks(w)} sem.`:"Mon parcours : aucun stage archivé"});}},
 tfe:{n:"Mon mémoire",d:"Avancement du TFE et prochaine étape",g:"orga",ic:OT_IC.tfe,c:"#6E5196",sz:1,
  r:()=>{const T=tfe(),done=TFE_STEPS.filter((_,i)=>T.steps[i]).length,next=TFE_STEPS.findIndex((_,i)=>!T.steps[i]),pct=Math.round(done/TFE_STEPS.length*100);
   const dl=T.rendu?Math.round((parseD(T.rendu)-parseD(todayISO()))/864e5):null;
   return hwSec("Mon mémoire",`<a href="#outil/tfe">Ouvrir</a>`,`<a class="sheet-body hw-tfe" href="#outil/tfe">${ring(pct,64)}<span><b>${done} étape${done>1?"s":""} sur ${TFE_STEPS.length}</b><small class="muted">${next<0?"Toutes les étapes sont faites, bravo !":"Prochaine : "+esc(TFE_STEPS[next][0])}</small>${dl!=null&&dl>=0?`<small class="hw-k">Rendu dans ${plural(dl,"jour")}</small>`:""}</span></a>`);},
  s:()=>{const T=tfe(),done=TFE_STEPS.filter((_,i)=>T.steps[i]).length;return hwTile({h:"#outil/tfe",ic:OT_IC.tfe,c:"#6E5196",big:`${done}<small>/${TFE_STEPS.length}</small>`,lab:"étapes du mémoire"});}}});return HW;}
function hwDebOut(){const v=state.hwDeb||{},V=parseFloat(String(v.v||"").replace(",",".")),H=parseFloat(String(v.h||"").replace(",",".")),g=+(v.g||20);
 if(!(V>0&&H>0))return `<span class="muted">Indiquez le volume et la durée.</span>`;
 const mlh=V/H,gm=V*g/(H*60),f=(x,d)=>x.toLocaleString("fr-FR",{maximumFractionDigits:d});
 return `<span><b>${f(mlh,1)}</b> mL/h</span><span><b>${f(Math.round(gm),0)}</b> gouttes/min</span><small class="muted">${f(V,0)} mL × ${g} gouttes ÷ (${f(H,2)} h × 60 min) = ${f(gm,1)}, arrondi à ${Math.round(gm)}. À vérifier avec la prescription.</small>`;}

/* ---------- Rendu de l'accueil ---------- */
/* Une grille unique : les widgets en grand format occupent toute la largeur, les petits une case. En mode édition,
   chaque widget porte des pastilles (retirer, taille, réglages) et se déplace en le maintenant puis en le glissant. */
function hwHome(edit){
 const h=hwGet(),out=[];
 h.w.forEach((w,i)=>{const d=HW[w.id];let x="",sz=w.sz==="S"&&d.s&&!(w.id==="partiels"&&state.examEdit)?"S":"L";
  try{x=sz==="S"?d.s(w,i):d.r(w,i);}catch(e){console.warn("Widget",w.id,e);x="";}
  if(!x&&!edit)return;
  if(!x)x=`<div class="hw-stub">${hwIc(d.ic,d.c)}<span><b>${esc(d.n)}</b><small>Rien à afficher pour l'instant : ce widget apparaîtra dès qu'il aura du contenu.</small></span></div>`;
  const nm=esc(w.id==="raccourcis"&&w.t?w.t:d.n);
  const badges=edit?`<button type="button" class="hw-x" data-act="hw-del" data-i="${i}" aria-label="Retirer ${nm}">${HW_ICS.minus}</button><span class="hw-badges">${d.s?`<button type="button" data-act="hw-sz" data-i="${i}" data-k="${sz==="S"?"L":"S"}" aria-label="${sz==="S"?"Agrandir":"Réduire"} ${nm}">${sz==="S"?HW_ICS.grow:HW_ICS.shrink}</button>`:""}${d.cfg?`<button type="button" data-act="hw-edit" data-i="${i}" aria-label="Régler ${nm}">${IC.gear}</button>`:""}</span>`:"";
  out.push(`<div class="hw-w hw-${sz}${state.hwNew===i?" hw-new":""}" data-i="${i}" data-n="${nm}">${badges}<div class="hw-body"${edit?" inert":""}>${x}</div></div>`);});
 state.hwNew=null;
 return out.length?`<div class="hw-grid${edit?" hw-editing":""}" id="hw-grid">${out.join("")}</div>`:"";
}
function hwPage(){
 const edit=!!state.hwEdit,hr=new Date().getHours(),nm=hwGet().name;
 const date=new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"});
 const body=hwHome(edit);
 if(edit)setTimeout(()=>document.querySelectorAll(".hw-editing .hw-L .hw-body").forEach(b=>{if(b.scrollHeight>210)b.classList.add("hw-cut");}),0);
 const avail=Object.entries(HW).filter(([id,d])=>d.multi||!hwGet().w.some(w=>w.id===id));
 return `<div class="stack-lg">
  <header class="vh-row"><div class="hello"><span class="date">${esc(date)}</span><h1>${hr<5||hr>=18?"Bonsoir":"Bonjour"}${nm?` <span class="hello-nm">${esc(nm)}</span>`:""}</h1></div>
   <div class="hello-act"><button class="icon-btn" data-act="${edit?"hw-done":"hw-editmode"}" aria-label="${edit?"Terminer la modification":"Modifier l'accueil"}" aria-pressed="${edit}">${HW_ICS.grid}</button><button class="icon-btn" data-act="nav" data-h="reglages" aria-label="Réglages">${IC.gear}</button></div></header>
  ${edit?"":ntAsk("home")}
  ${edit?`<div class="hw-editbar" role="toolbar" aria-label="Modifier l'accueil"><span class="hw-eb-t"><b>Modifier l'accueil</b><small>Maintenez un widget puis glissez-le où vous voulez</small></span>
   <button type="button" class="btn ghost hw-eb-add" data-act="hw-sheet">${IC.plus}<span>Ajouter</span></button><button type="button" class="btn hw-eb-ok" data-act="hw-done">Terminé</button></div>`:""}
  ${body||`<div class="empty">Votre accueil est vide. ${edit?"Touchez « Ajouter » pour choisir vos widgets.":"Ajoutez les widgets qui vous servent : partiels, stage, question du jour, raccourcis…"}</div>`}
  ${edit?`<div class="stack-sm"><button class="btn block" data-act="hw-done">Terminé</button><a class="btn ghost block" href="#perso">Prénom et réglages détaillés</a></div>`
   :`<div class="stack-sm hw-foot"><button class="btn ghost block hw-perso-btn" data-act="hw-editmode">${HW_ICS.grid}Modifier l'accueil</button><small class="muted">Astuce : maintenez le doigt sur un widget pour le déplacer directement.</small></div>`}
  <p class="disclaimer">Contenus pédagogiques. Vérifiez toujours avec vos cours et les protocoles de votre établissement.</p></div>
  ${edit&&state.hwSheet?`<div class="hw-sheet-bg" data-act="hw-sheet-close"></div><div class="hw-sheet" role="dialog" aria-modal="true" aria-label="Ajouter un widget">
   <div class="hw-sheet-h"><b>Ajouter un widget</b><button type="button" class="icon-btn" data-act="hw-sheet-close" aria-label="Fermer">${IC.x}</button></div>
   <div class="hw-sheet-b">${avail.length?HW_GROUPS.map(([g,gn])=>{const L=avail.filter(([,d])=>d.g===g);return L.length?`<h3 class="hw-g">${gn}</h3><div class="list">${L.map(([id,d])=>`<button type="button" class="li hw-add" data-act="hw-add" data-k="${id}" data-pos="top">${hwIc(d.ic,d.c)}<span><span class="t">${esc(d.n)}</span><span class="s">${esc(d.d)}</span></span><span class="end hw-plus">${IC.plus}</span></button>`).join("")}</div>`:"";}).join(""):`<p class="muted">Tous les widgets sont déjà sur votre accueil.</p>`}</div></div>`:""}`;
}

/* ---------- Page « Personnaliser l'accueil » ---------- */
function vPerso(){
 const h=hwGet(),act=h.w,G=HW_GROUPS;
 const row=(w,i)=>{const d=HW[w.id],open=state.hwCfg===i;
  return `<div class="hw-row${open?" open":""}" data-i="${i}"><div class="hw-row-top">
   <button type="button" class="hw-handle" aria-label="Glisser pour déplacer ${esc(d.n)}">${HW_ICS.handle}</button>
   ${hwIc(d.ic,d.c)}<span class="hw-tx"><b>${esc(w.t&&w.id==="raccourcis"?w.t:d.n)}</b><small>${esc(d.d)}</small></span>
   <span class="hw-btns"><button type="button" data-act="hw-up" data-i="${i}" aria-label="Monter ${esc(d.n)}" ${i?"":"disabled"}>${HW_ICS.up}</button><button type="button" data-act="hw-down" data-i="${i}" aria-label="Descendre ${esc(d.n)}" ${i<act.length-1?"":"disabled"}>${HW_ICS.down}</button><button type="button" class="hw-rm" data-act="hw-del" data-i="${i}" aria-label="Retirer ${esc(d.n)}">${HW_ICS.minus}</button></span></div>
   ${d.s||d.cfg?`<div class="hw-row-opt">${d.s?`<div class="seg hw-sz" role="group" aria-label="Taille"><button type="button" data-act="hw-sz" data-i="${i}" data-k="L" aria-pressed="${w.sz!=="S"}">Grand</button><button type="button" data-act="hw-sz" data-i="${i}" data-k="S" aria-pressed="${w.sz==="S"}">Petit</button></div>`:""}
    ${d.cfg?`<button type="button" class="link" data-act="hw-cfg" data-i="${i}" aria-expanded="${open}">${open?"Fermer les réglages":"Réglages"}</button>`:""}</div>`:""}
   ${open&&d.cfg?`<div class="hw-cfg cd-form">${d.cfg(w,i)}</div>`:""}</div>`;};
 const avail=Object.entries(HW).filter(([id,d])=>d.multi||!act.some(w=>w.id===id));
 return `<div class="stack-lg">${backBtn("Accueil")}
  ${vh("Accueil","Personnaliser l'accueil","Choisissez vos widgets, leur ordre et leur taille. Glissez la poignée ou utilisez les flèches. Les widgets en petit format se rangent côte à côte.")}
  <section class="sheet-body cd-form"><label for="hw-name">Votre prénom, pour le message d'accueil<input id="hw-name" data-hw="name" maxlength="30" autocomplete="given-name" placeholder="Facultatif" value="${esc(h.name)}"></label></section>
  <section class="stack-sm"><div class="section-title"><h2>Mes widgets</h2><span class="muted">${plural(act.length,"widget")}</span></div>
   ${act.length?`<div class="hw-list" id="hw-list">${act.map(row).join("")}</div>`:`<p class="muted">Votre accueil est vide : ajoutez des widgets ci-dessous.</p>`}</section>
  <section class="stack-sm"><div class="section-title"><h2>Ajouter un widget</h2></div>
   ${G.map(([g,gn])=>{const L=avail.filter(([,d])=>d.g===g);return L.length?`<h3 class="hw-g">${gn}</h3><div class="list">${L.map(([id,d])=>`<button type="button" class="li hw-add" data-act="hw-add" data-k="${id}">${hwIc(d.ic,d.c)}<span><span class="t">${esc(d.n)}</span><span class="s">${esc(d.d)}${d.s?" · grand ou petit format":""}</span></span><span class="end hw-plus">${IC.plus}</span></button>`).join("")}</div>`:"";}).join("")}
   ${avail.length?"":`<p class="muted">Tous les widgets sont déjà sur votre accueil.</p>`}</section>
  <div class="stack-sm"><a class="btn block" href="#accueil">Voir mon accueil</a><button type="button" class="link danger" data-act="hw-reset">Revenir à l'accueil d'origine</button></div>
  <p class="disclaimer">La disposition est enregistrée sur cet appareil et incluse dans la sauvegarde des Réglages.</p></div>`;
}

/* ---------- Actions ---------- */
function hwMut(fn){const h=hwGet();fn(h);hwSet(h);}
function hwAct(b,a){
 hwCat();
 const i=+b.dataset.i,k=b.dataset.k;
 if(a==="hw-up"||a==="hw-down"){const j=a==="hw-up"?i-1:i+1;hwMut(h=>{if(j<0||j>=h.w.length)return;[h.w[i],h.w[j]]=[h.w[j],h.w[i]];});
  if(state.hwCfg===i)state.hwCfg=j;else if(state.hwCfg===j)state.hwCfg=i;haptic();render();
  setTimeout(()=>{const r=document.querySelector(`.hw-row[data-i="${j}"] [data-act="${a}"]`)||document.querySelector(`.hw-row[data-i="${j}"] .hw-handle`);r&&r.focus({preventScroll:false});},30);}
 else if(a==="hw-del"){let n="";hwMut(h=>{n=HW[h.w[i].id].n;h.w.splice(i,1);});state.hwCfg=null;haptic();toast(`« ${n} » retiré de l'accueil`);render();}
 else if(a==="hw-add"&&HW[k]&&b.dataset.pos==="top"){hwMut(h=>{h.w.unshift({id:k});});state.hwSheet=false;state.hwNew=0;haptic();toast(`« ${HW[k].n} » ajouté en haut de l'accueil`);render();window.scrollTo({top:0,behavior:"smooth"});}
 else if(a==="hw-editmode"){state.hwEdit=true;state.hwSheet=false;haptic();render();}
 else if(a==="hw-done"){state.hwEdit=false;state.hwSheet=false;haptic();render();}
 else if(a==="hw-sheet"){state.hwSheet=true;render();setTimeout(()=>{const x=document.querySelector(".hw-sheet .icon-btn");x&&x.focus({preventScroll:true});},30);}
 else if(a==="hw-sheet-close"){state.hwSheet=false;render();}
 else if(a==="hw-add"&&HW[k]){hwMut(h=>{h.w.push({id:k});});state.hwCfg=HW[k].cfg?hwGet().w.length-1:null;haptic();toast(`« ${HW[k].n} » ajouté en bas de l'accueil`);render();
  setTimeout(()=>{const l=document.querySelectorAll(".hw-row");const r=l[l.length-1];r&&r.scrollIntoView({block:"center"});},40);}
 else if(a==="hw-sz"){hwMut(h=>{h.w[i].sz=k==="S"?"S":undefined;});render();}
 else if(a==="hw-cfg"){state.hwCfg=state.hwCfg===i?null:i;render();}
 else if(a==="hw-edit"){state.hwCfg=i;nav("perso");setTimeout(()=>{const r=document.querySelector(`.hw-row[data-i="${i}"]`);r&&r.scrollIntoView({block:"start"});},60);}
 else if(a==="hw-sc"){let full=false;hwMut(h=>{const w=h.w[i],L=(w.sc||HW_SC_DEFAULT).slice();const p=L.indexOf(k);if(p>=0)L.splice(p,1);else if(L.length>=HW_SC_MAX)full=true;else L.push(k);w.sc=L;});
  if(full)toast(`${HW_SC_MAX} raccourcis au maximum`);else haptic();render();}
 else if(a==="hw-spe"){hwMut(h=>{const w=h.w[i],L=(w.spe||[]).slice(),p=L.indexOf(k);if(p>=0)L.splice(p,1);else L.push(k);w.spe=L.length?L:undefined;});haptic();render();}
 else if(a==="hw-nsrc"){hwMut(h=>{const w=h.w[i],L=(w.src&&w.src.length?w.src:HW_NSRC.map(x=>x[0])).slice(),p=L.indexOf(k);if(p>=0){if(L.length>1)L.splice(p,1);}else L.push(k);w.src=L.length===HW_NSRC.length?undefined:L;});haptic();render();}
 else if(a==="hw-reset"){if(!b.dataset.armed){b.dataset.armed="1";b.textContent="Toucher à nouveau pour rétablir l'accueil d'origine";setTimeout(()=>{if(b.isConnected){delete b.dataset.armed;b.textContent="Revenir à l'accueil d'origine";}},4000);return;}
  const name=hwGet().name;store.set("home",name?{name}:null);try{if(!name)localStorage.removeItem("ifsi_home");}catch(e){}state.hwCfg=null;haptic("MEDIUM");toast("Accueil d'origine rétabli");render();}
 else if(a==="hw-q"){const st=store.get("hwq",{});if(st.pick!=null)return;const q=QUIZ[st.i];if(!q)return;st.pick=+k;store.set("hwq",st);
  if(+k===q.a)haptic();else{haptic("MEDIUM");store.set("wrong",[...new Set([...wrongs(),q.q])]);}render();}
 else if(a==="hw-q-next"){const w=hwGet().w[i]||{},pool=hwQPool(w),st=store.get("hwq",{});let n=st.i;if(pool.length>1)while(n===st.i)n=pool[Math.floor(Math.random()*pool.length)];
  store.set("hwq",{d:todayISO(),k:w.cat||"",i:n,pick:null});render();}
 else if(a==="hw-n-next"){state.hwN=(state.hwN||0)+1;render();}
 else if(a==="hw-px-rand"){const p=PATHOS[Math.floor(Math.random()*PATHOS.length)];if(p)nav("patho/"+p.i);}
 else if(a==="hw-note"){state.noteId=b.dataset.id;nav("outil/notes");}
 else if(a==="hw-note-new"){const n={id:otId(),t:"",x:"",u:Date.now()};store.set("notes",[n,...notesL()]);state.noteId=n.id;nav("outil/notes");setTimeout(()=>{const x=document.getElementById("note-t");x&&x.focus();},80);}
 else if(a==="hw-ag-add"){state.agForm=true;state.agGen=false;state.agDay=todayISO();nav("outil/planning");setTimeout(()=>{const x=document.getElementById("ag-t");x&&x.focus();},80);}
}
function hwInput(t){
 hwCat();
 const k=t.dataset.hw,i=+t.dataset.i;
 if(k==="name"){hwMut(h=>{h.name=t.value.trim().slice(0,30);});}
 else if(k==="title"){hwMut(h=>{if(h.w[i])h.w[i].t=t.value.trim().slice(0,30)||undefined;});const b=document.querySelector(`.hw-row[data-i="${i}"] .hw-tx b`);if(b)b.textContent=t.value.trim()||HW.raccourcis.n;}
 else if(k==="rp"){hwMut(h=>{if(h.w[i])h.w[i].b=+t.value;});}
 else if(k==="qcat"){hwMut(h=>{if(h.w[i])h.w[i].cat=t.value||undefined;});}
 else if(k==="deb"){state.hwDeb=Object.assign({},state.hwDeb,{[t.dataset.k]:t.value});const o=document.getElementById("hw-deb-out");if(o)o.innerHTML=hwDebOut();}
}

/* ---------- Glisser-déposer (poignée) ---------- */
let hwDrag=null;
function hwDragTarget(y){
 const rows=[...document.querySelectorAll(".hw-row")].filter(r=>r!==hwDrag.row);let idx=rows.length;
 for(let k=0;k<rows.length;k++){const r=rows[k].getBoundingClientRect();if(y<r.top+r.height/2){idx=k;break;}}
 rows.forEach((r,k)=>{r.classList.toggle("drop-before",k===idx);r.classList.toggle("drop-after",idx===rows.length&&k===rows.length-1);});
 return idx;
}
function hwDragTick(){if(!hwDrag)return;const y=hwDrag.y,H=window.innerHeight,top=80,bot=H-(document.querySelector("nav.tabs")||{offsetHeight:90}).offsetHeight-40;
 const v=y<top?-Math.min(18,(top-y)/3):y>bot?Math.min(18,(y-bot)/3):0;if(v)window.scrollBy(0,v);
 hwDrag.row.style.transform=`translateY(${y-hwDrag.y0+window.scrollY-hwDrag.s0}px)`;hwDrag.idx=hwDragTarget(y);hwDrag.raf=requestAnimationFrame(hwDragTick);}
document.addEventListener("pointerdown",e=>{const hd=e.target.closest(".hw-handle");if(!hd||hwDrag)return;const row=hd.closest(".hw-row");if(!row)return;
 e.preventDefault();try{hd.setPointerCapture(e.pointerId);}catch(x){}
 hwDrag={row,hd,pid:e.pointerId,y0:e.clientY,y:e.clientY,s0:window.scrollY,from:+row.dataset.i,idx:+row.dataset.i};row.classList.add("dragging");document.body.classList.add("hw-dragging");haptic();hwDrag.raf=requestAnimationFrame(hwDragTick);});
document.addEventListener("pointermove",e=>{if(hwDrag&&e.pointerId===hwDrag.pid){e.preventDefault();hwDrag.y=e.clientY;}},{passive:false});
function hwDragEnd(e){if(!hwDrag||(e&&e.pointerId!==hwDrag.pid))return;const D=hwDrag;hwDrag=null;cancelAnimationFrame(D.raf);document.body.classList.remove("hw-dragging");
 const to=D.idx,from=D.from;
 if(e&&e.type!=="pointercancel"&&to!==from&&to!=null){hwMut(h=>{const [w]=h.w.splice(from,1);h.w.splice(to,0,w);});state.hwCfg=null;haptic();}
 render();}
document.addEventListener("pointerup",hwDragEnd);document.addEventListener("pointercancel",hwDragEnd);

/* ---------- Glisser-déposer directement sur l'accueil ----------
   Hors édition : appui long (0,45 s) sur un widget pour l'attraper (l'accueil passe en mode édition).
   En édition : appui court (0,17 s) au doigt, ou glisser à la souris. Les autres widgets s'écartent en direct,
   la page défile toute seule près des bords. */
let hwP=null,hwD=null,hwNoClick=0;
const hwDist=(a,b,c,d)=>Math.hypot(a-c,b-d);
document.addEventListener("pointerdown",e=>{
 if(hwD||hwP||(e.pointerType==="mouse"&&e.button!==0))return;
 const w=e.target.closest("#hw-grid > .hw-w");if(!w||e.target.closest(".hw-x,.hw-badges,input,select,textarea,[contenteditable]"))return;
 const edit=!!w.closest(".hw-editing"),mouseEdit=edit&&e.pointerType==="mouse";
 hwP={w,pid:e.pointerId,x:e.clientX,y:e.clientY,x0:e.clientX,y0:e.clientY,edit,mouseEdit,t:mouseEdit?null:setTimeout(hwPick,edit?170:450)};
});
document.addEventListener("pointermove",e=>{
 if(hwD&&e.pointerId===hwD.pid){hwD.x=e.clientX;hwD.y=e.clientY;hwD.dirty=true;e.preventDefault();return;}
 if(!hwP||e.pointerId!==hwP.pid)return;hwP.x=e.clientX;hwP.y=e.clientY;
 const d=hwDist(hwP.x0,hwP.y0,e.clientX,e.clientY);
 if(hwP.mouseEdit){if(d>4)hwPick();}else if(d>9){clearTimeout(hwP.t);hwP=null;}
},{passive:false});
document.addEventListener("touchmove",e=>{if(hwD)e.preventDefault();},{passive:false});
document.addEventListener("contextmenu",e=>{if(hwD||hwP||e.target.closest(".hw-editing"))e.preventDefault();});
document.addEventListener("click",e=>{if(Date.now()<hwNoClick){e.preventDefault();e.stopPropagation();hwNoClick=0;}},true);
function hwRelease(e){
 if(hwP&&e.pointerId===hwP.pid){clearTimeout(hwP.t);hwP=null;}
 if(hwD&&e.pointerId===hwD.pid)hwDrop();
}
document.addEventListener("pointerup",hwRelease);document.addEventListener("pointercancel",hwRelease);
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&state.hwEdit&&route().v==="accueil"){if(state.hwSheet)state.hwSheet=false;else state.hwEdit=false;render();}});
function hwPick(){
 const P=hwP;if(!P)return;clearTimeout(P.t);hwP=null;
 let el=P.w;const grid=el.parentElement;if(!grid||!el.isConnected)return;
 if(!P.edit){grid.classList.add("hw-editing");document.querySelectorAll("#hw-grid .hw-L .hw-body").forEach(b=>{if(b.scrollHeight>210)b.classList.add("hw-cut");});}
 const r=el.getBoundingClientRect(),ox=Math.max(12,Math.min(P.x-r.left,r.width-12)),oy=Math.max(12,Math.min(P.y-r.top,r.height-12));
 const ph=document.createElement("div");ph.className="hw-ph "+(el.classList.contains("hw-S")?"hw-S":"hw-L");ph.style.height=r.height+"px";ph.setAttribute("aria-hidden","true");
 grid.insertBefore(ph,el);
 Object.assign(el.style,{position:"fixed",left:(P.x-ox)+"px",top:(P.y-oy)+"px",width:r.width+"px",height:r.height+"px",margin:"0"});
 el.classList.add("hw-lift");
 try{el.setPointerCapture(P.pid);}catch(x){}
 hwD={el,grid,ph,pid:P.pid,ox,oy,x:P.x,y:P.y,dirty:true,last:0,edit:P.edit};
 document.body.classList.add("hw-dragging");haptic("MEDIUM");
 hwD.raf=requestAnimationFrame(hwTick);
}
function hwTick(){
 const D=hwD;if(!D)return;
 D.el.style.left=(D.x-D.ox)+"px";D.el.style.top=(D.y-D.oy)+"px";
 const H=window.innerHeight,nav=(document.querySelector("nav.tabs")||{offsetHeight:80}).offsetHeight,top=110,bot=H-nav-60;
 const v=D.y<top?-Math.min(22,(top-D.y)/4+3):D.y>bot?Math.min(22,(D.y-bot)/4+3):0;
 if(v){const s0=window.scrollY;window.scrollBy(0,v);if(window.scrollY!==s0)D.dirty=true;}
 if(D.dirty&&performance.now()-D.last>90){D.dirty=false;hwPlace();}
 D.raf=requestAnimationFrame(hwTick);
}
function hwPlace(){
 const D=hwD,kids=()=>[...D.grid.children].filter(c=>c!==D.el);
 const prevOf=n=>{let p=n?n.previousElementSibling:D.grid.lastElementChild;while(p===D.el)p=p.previousElementSibling;return p;};
 const nextOf=n=>{let p=n.nextElementSibling;while(p===D.el)p=p.nextElementSibling;return p;};
 const hit=document.elementFromPoint(D.x,D.y),t=hit&&hit.closest("#hw-grid > .hw-w, #hw-grid > .hw-ph");
 let ref;
 if(!t){const K=kids();if(!K.length)return;const a=K[0].getBoundingClientRect(),z=K[K.length-1].getBoundingClientRect();
  if(D.y>z.bottom)ref=null;else if(D.y<a.top)ref=K[0];else return;}
 else{if(t===D.ph)return;const r=t.getBoundingClientRect(),side=t.classList.contains("hw-S")&&D.el.classList.contains("hw-S")&&D.y>r.top&&D.y<r.bottom;
  const before=side?D.x<r.left+r.width/2:D.y<r.top+r.height/2;ref=before?t:nextOf(t);}
 if(ref===D.ph||prevOf(ref)===D.ph)return;
 const K=kids(),first=new Map(K.map(k=>[k,k.getBoundingClientRect()]));
 D.grid.insertBefore(D.ph,ref);
 K.forEach(k=>{if(k===D.ph)return;const a=first.get(k),b=k.getBoundingClientRect(),dx=a.left-b.left,dy=a.top-b.top;
  if(Math.abs(dx)>.5||Math.abs(dy)>.5){k.style.transition="none";k.style.translate=`${dx}px ${dy}px`;k.getBoundingClientRect();
   requestAnimationFrame(()=>{k.style.transition="translate .2s cubic-bezier(.2,.7,.3,1)";k.style.translate="0px 0px";});}});
 D.last=performance.now();haptic();
}
function hwDrop(){
 const D=hwD;if(!D)return;hwD=null;cancelAnimationFrame(D.raf);
 D.grid.insertBefore(D.el,D.ph);D.ph.remove();D.el.removeAttribute("style");D.el.classList.remove("hw-lift");
 document.body.classList.remove("hw-dragging");
 const vis=[...D.grid.querySelectorAll(":scope > .hw-w")].map(x=>+x.dataset.i);
 hwMut(h=>{const old=h.w.slice(),on=new Set(vis);let k=0;h.w=old.map((w,i)=>on.has(i)?old[vis[k++]]:w);});
 state.hwEdit=true;hwNoClick=Date.now()+500;render();
}
