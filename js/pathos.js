/* Carnet IFSI — encyclopédie des pathologies : vues par spécialité, fiche récap et cours détaillé,
   schémas d'organes (zone atteinte en couleur), quiz générés et schémas à compléter. Chargé après render.js, avant app.js. */
const SPE=Object.fromEntries(SPES.map(([id,nom,c,u])=>[id,{id,nom,c,u}]));
const PBY=Object.fromEntries(PATHOS.map(p=>[p.i,p]));
const progOf=s=>(PROGRAMME[s]||"").split("|").filter(Boolean);
/* Une pathologie peut figurer dans plusieurs spécialités : son nom (n) ou un de ses autres noms (nn) suffit. */
const PNAME={};PATHOS.forEach(p=>[p.n,...(p.nn||[])].forEach(x=>{if(!PNAME[x])PNAME[x]=p;}));
const pathosOf=s=>{const l=progOf(s).map(n=>PNAME[n]).filter(Boolean);PATHOS.forEach(p=>{if(p.s===s&&!l.includes(p))l.push(p);});return [...new Set(l)];};
const PROG_ALL=[...new Set(SPES.flatMap(([s])=>progOf(s)))];
const pxSpeQ=s=>{const ids=new Set(pathosOf(s).map(p=>p.i));return QUIZ.map((q,i)=>i).filter(i=>ids.has(QUIZ[i].pid));};
const pxDone=()=>store.get("pxdone",[]);
const SPE_ICO={cardio:"heart",pneumo:"lungs",neuro:"brain",rhumato:"bone",pedia:"baby",ophtalmo:"eye",nephro:"kidney",hemato:"drop",infectio:"thermo",endoc:"gland",nutri:"scale",urg:"alert",onco:"tube",geria:"face",psy:"brain",gastro:"gut",chir:"tube"};

/* ---------- Vues ---------- */
const pmd=s=>md(String(s||""));
function pxCard(){
 const cov=PROG_ALL.filter(n=>PNAME[n]).length;
 return `<a class="px-card" href="#pathos"><span class="px-card-ic">${ICO.heart}</span><span><b>Pathologies par spécialité</b><small>${cov} pathologies rédigées sur ${PROG_ALL.length} · fiche récap, cours détaillé, schéma, quiz</small></span>${chev}</a>`;
}
function vPathos(arg){
 if(arg&&SPE[arg])return vSpe(arg);
 const tot=PROG_ALL.length,cov=PROG_ALL.filter(n=>PNAME[n]).length,done=pxDone().filter(id=>PBY[id]).length;
 return `<div class="stack-lg">${backBtn("Réviser")}
  ${vh("Réviser","Pathologies par spécialité",`${cov} pathologies rédigées sur ${tot} au programme, ${done} étudiée${done>1?"s":""}. Chacune a une fiche récap, un cours détaillé avec schéma et des questions.`)}
  <button class="search-pill" data-act="nav" data-h="recherche">${IC.search}Rechercher une pathologie…</button>
  <div class="px-spes">${SPES.map(([s,nom,c])=>{const n=pathosOf(s).length,t=progOf(s).length;return `<a class="px-spe${n?"":" off"}" href="#pathos/${s}" style="--c:${c}"><span class="px-dot"></span><b>${esc(nom)}</b><small>${n?`${n} / ${t} rédigées`:`${t} au programme · bientôt`}</small>${n?`<span class="px-bar"><i style="width:${Math.min(100,Math.round(n/t*100))}%"></i></span>`:""}</a>`}).join("")}</div>
  <a class="list" href="#entrainer/schemas"><span class="li"><span class="ic">${IC.bolt}</span><span><span class="t">Schémas à compléter et à remettre dans l'ordre</span><span class="s">Dans S'entraîner › Schémas</span></span>${chev}</span></a></div>`;
}
function vSpe(s){
 const S=SPE[s],list=progOf(s),q=fold(state.pxq||""),byName={...PNAME},dn=pxDone();
 const extra=PATHOS.filter(p=>p.s===s&&!list.some(n=>PNAME[n]===p)).map(p=>p.n);
 const rows=[...list,...extra].filter(n=>!q||fold(n).includes(q));
 const nq=pxSpeQ(s).length,exos=PEXOS.filter(e=>e.spe.includes(s));
 return `<div class="stack-lg"><a class="back" href="#pathos">${IC.back}Spécialités</a>
  ${vh("Pathologies",esc(S.nom),`${pathosOf(s).length} pathologies rédigées sur ${list.length}${pathosOf(s).length?`, ${pathosOf(s).filter(p=>dn.includes(p.i)).length} étudiée(s)`:""}.`)}
  ${nq||exos.length?`<div class="px-tools">${nq?`<button class="btn" data-act="px-quiz" data-k="${s}">${IC.bolt}Quiz ${esc(S.nom)} · ${nq} questions</button>`:""}${exos.map(e=>`<a class="btn ghost" href="#entrainer/schemas" data-act="px-exo" data-k="${e.id}">${e.steps?"À remettre dans l'ordre":"Schéma à compléter"} : ${esc(e.titre.charAt(0).toLowerCase()+e.titre.slice(1))}</a>`).join("")}</div>`:""}
  <label class="search-field">${IC.search}<input id="pxq" type="search" placeholder="Filtrer les pathologies" value="${esc(state.pxq||"")}" autocomplete="off" aria-label="Filtrer"></label>
  <div class="list" id="px-list" style="--c:${S.c}">${rows.map(n=>{const p=byName[n];return p?`<a class="li" href="#patho/${p.i}"><span class="bar"></span><span><span class="t">${esc(n)}</span><span class="s">${esc(plainTxt(p.d).slice(0,96))}${plainTxt(p.d).length>96?"…":""}</span></span><span class="end">${dn.includes(p.i)?'<span class="tag done">Étudiée</span>':""}${chev}</span></a>`:`<div class="li px-soon"><span class="bar"></span><span><span class="t">${esc(n)}</span><span class="s">Bientôt</span></span></div>`}).join("")||`<div class="empty">Aucune pathologie ne correspond.</div>`}</div></div>`;
}
const plainTxt=h=>String(h||"").replace(/<[^>]+>/g," ").replace(/\*\*|==/g,"").replace(/\s+/g," ").trim();
const pList=(a,cls="fv-list")=>a&&a.length?`<div class="fv-panel"><ul class="${cls}">${a.map(x=>`<li>${pmd(x)}</li>`).join("")}</ul></div>`:"";
function vPatho(id){
 const p=PBY[id];if(!p)return notFound();
 const S=SPE[p.s],mode=state.pxMode||"recap",done=pxDone().includes(id);
 const links=(p.f||[]).map(x=>{const f=FICHES.find(y=>y.id===x),c=f?null:COURS.find(y=>y.id===x&&!y.pro),it=f||c;return it?`<a class="chip" href="#${f?"fiche":"cours"}/${x}">${esc(it.titre)}</a>`:"";}).join("");
 const qs=QUIZ.filter(q=>q.pid===id),same=PATHOS.filter(x=>x.s===p.s),k=same.indexOf(p),next=same[k+1];
 const secs=[["Définition",`<p class="fv-lead">${pmd(p.d)}</p>`],
  ["Comprendre le mécanisme",`${(p.m||"").split("\n").map(x=>`<p class="cv-p">${pmd(x)}</p>`).join("")}${p.a?`<div class="cv-box cv-ana"><span class="cv-lab">${SVG.bulb}Pour comprendre</span><p>${pmd(p.a)}</p></div>`:""}${p.z?pmFig(p.z,"En couleur : la zone concernée."):""}`],
  ["Causes et facteurs de risque",pList(p.c)],
  ["Signes cliniques",`${pList(p.sg)}${p.al&&p.al.length?`<div class="cv-box cv-trap"><span class="cv-lab">${SVG.warn}Signes de gravité : alerter</span><ul>${p.al.map(x=>`<li>${pmd(x)}</li>`).join("")}</ul></div>`:""}`],
  ["Examens",p.ex&&p.ex.length?`<div class="fv-panel"><div class="fv-tbl">${p.ex.map(x=>`<div><span>${pmd(x[0])}</span><span>${pmd(x[1])}</span></div>`).join("")}</div></div>`:""],
  ["Complications",pList(p.co)],
  ["Traitements",pList(p.tt)],
  ["Rôle infirmier",p.ri&&p.ri.length?`<ul class="fv-checks">${p.ri.map(x=>`<li>${SVG.check}<span>${pmd(x)}</span></li>`).join("")}</ul>`:""]].filter(x=>x[1]);
 const hero=`<div class="fv-progress" aria-hidden="true"><i id="fv-bar"></i></div><header class="fv-hero"><div class="fv-top"><button class="fv-back" data-act="back">${SVG.back}${esc(S.nom)}</button>${done?'<span class="fv-done-badge">Étudiée</span>':""}</div>
  <span class="fv-kicker">Pathologie · ${esc(S.nom)}</span><h1>${esc(p.n)}</h1><div class="fv-ico" aria-hidden="true">${ICO[SPE_ICO[p.s]]||ICO.heart}</div>
  <div class="fv-meta"><span>Fiche récap + cours</span><span>${secs.length} parties</span>${qs.length?`<span>${qs.length} questions</span>`:""}</div></header>`;
 const seg=`<div class="seg px-seg" role="group" aria-label="Mode de lecture"><button data-act="px-mode" data-k="recap" aria-pressed="${mode==="recap"}">Fiche récap</button><button data-act="px-mode" data-k="cours" aria-pressed="${mode==="cours"}">Cours détaillé</button></div>`;
 let body,toc="";
 if(mode==="recap"){
  body=`<div class="px-recap">
   <div class="px-r def"><span class="cv-lab">${SVG.info}Définition</span><p>${pmd(p.d)}</p></div>
   ${p.z?pmFig(p.z):""}
   <div class="px-grid">
    <div class="px-r"><span class="cv-lab">Causes</span><ul>${(p.c||[]).slice(0,5).map(x=>`<li>${pmd(x)}</li>`).join("")}</ul></div>
    <div class="px-r"><span class="cv-lab">Signes</span><ul>${(p.sg||[]).slice(0,6).map(x=>`<li>${pmd(x)}</li>`).join("")}</ul></div>
    <div class="px-r"><span class="cv-lab">Examens</span><ul>${(p.ex||[]).slice(0,4).map(x=>`<li>${pmd(x[0])}</li>`).join("")}</ul></div>
    <div class="px-r"><span class="cv-lab">Complications</span><ul>${(p.co||[]).slice(0,4).map(x=>`<li>${pmd(x)}</li>`).join("")}</ul></div>
    <div class="px-r"><span class="cv-lab">Traitement</span><ul>${(p.tt||[]).slice(0,4).map(x=>`<li>${pmd(x)}</li>`).join("")}</ul></div>
   </div>
   ${p.al&&p.al.length?`<div class="px-r alert"><span class="cv-lab">${SVG.warn}Alerter si</span><ul>${p.al.map(x=>`<li>${pmd(x)}</li>`).join("")}</ul></div>`:""}
   <div class="px-r role"><span class="cv-lab">${SVG.check}Rôle infirmier</span><ul>${(p.ri||[]).slice(0,6).map(x=>`<li>${pmd(x)}</li>`).join("")}</ul></div>
   ${p.r?`<div class="fv-key"><h3>${SVG.bulb}À retenir</h3><p>${pmd(p.r)}</p></div>`:""}
   <button class="btn block" data-act="px-mode" data-k="cours">Lire le cours détaillé</button></div>`;
 }else{
  toc=`<nav class="fv-toc" aria-label="Parties du cours">${secs.map((s,i)=>`<a href="#patho" data-sec="p-${i+1}"><b>${i+1}</b>${esc(s[0])}</a>`).join("")}</nav>`;
  body=secs.map((s,i)=>`<section class="fv-sec" id="p-${i+1}"><div class="fv-sh"><span class="fv-num">${String(i+1).padStart(2,"0")}</span><h2>${s[0]}</h2></div>${s[1]}</section>`).join("")+
   (p.r?`<div class="fv-key"><h3>${SVG.bulb}À retenir</h3><p>${pmd(p.r)}</p></div>`:"")+
   (qs.length?`<div class="cv-verif"><span class="cv-lab">${SVG.check}Vérifier ses connaissances</span>${qs.slice(0,3).map(q=>`<details><summary>${esc(q.q.length>150?q.q.slice(0,150)+"…":q.q)}</summary><p>${esc(q.o[q.a])}</p></details>`).join("")}</div>`:"");
 }
 return `<article class="fv px" style="--c:${S.c}">${hero}${toc}<div class="fv-body"><div class="px-head">${seg}</div>${body}
  ${links?`<section class="stack-sm"><h3 class="cn-g">Pour aller plus loin dans l'appli</h3><div class="chips wrapchips">${links}</div></section>`:""}
  <div class="fv-end"><h3>${done?"Pathologie étudiée":"Vous avez terminé"}</h3><p class="muted">Marquez-la comme étudiée, puis testez-vous.</p>
   <div class="row2"><button class="btn ${done?"ghost":"ok"}" data-act="px-done" data-k="${id}">${done?"Retirer des étudiées":"J'ai étudié cette pathologie"}</button>${qs.length?`<button class="btn ghost" data-act="px-qp" data-k="${id}">${IC.bolt}Me tester · ${qs.length}</button>`:""}</div>
   ${next?`<a class="card cat fv-next" style="--c:${S.c}" href="#patho/${next.i}"><span class="eyebrow">Pathologie suivante</span><h3>${esc(next.n)}</h3></a>`:""}</div></div></article>`;
}

/* ---------- Quiz générés ---------- */
const pxRand=seed=>{let h=0;for(const ch of seed)h=(h*31+ch.charCodeAt(0))|0;return ()=>{h=(h*1103515245+12345)&0x7fffffff;return h/0x7fffffff;};};
function pxShuffle(a,r){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const pxRe=s=>s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
function pxNames(p){const ab=(p.n.match(/\(([^)]+)\)/)||[])[1],base=p.n.replace(/\s*\([^)]*\)/,"").trim();return [p.n,base,ab].filter(x=>x&&x.length>1).sort((a,b)=>b.length-a.length);}
/* Retire le nom de la pathologie de son propre texte pour ne pas souffler la réponse. */
function pxMask(txt,p){let t=plainTxt(txt);pxNames(p).forEach(nm=>{t=t.replace(new RegExp(`(^|[^\\p{L}])${pxRe(nm)}(?=[^\\p{L}]|$)`,"giu"),"$1cette maladie");});return t;}
function pxMakeQuiz(){
 PATHOS.forEach(p=>{const pool=PATHOS.filter(x=>x.s===p.s&&x.i!==p.i),r=pxRand(p.i);if(pool.length<3)return;
  const mk=(q,good,bads,e)=>{bads=[...new Set(bads)].filter(b=>b&&b!==good);if(bads.length<3)return;const opts=pxShuffle([good,...bads.slice(0,3)],r);const o=norm(Q("patho",SPE[p.s].u,q,opts,opts.indexOf(good),e));o.spe=p.s;o.pid=p.i;QUIZ.push(o);};
  const others=pxShuffle(pool,r),m1=x=>x.m.split("\n")[0];
  mk(`À quelle pathologie correspond cette définition : « ${pxMask(p.d.replace(/^\*\*[^*]+\*\*\s*:\s*/,""),p)} »`,p.n,others.map(x=>x.n),`${p.n} : ${plainTxt(p.d)}`);
  if(p.m)mk(`${p.n} : quel mécanisme est en cause ?`,pxMask(m1(p),p),pxShuffle(pool.filter(x=>x.m),r).map(x=>pxMask(m1(x),x)),plainTxt(m1(p)));
  if(p.r)mk(`${p.n} : quelle est l'idée essentielle à retenir ?`,pxMask(p.r,p),pxShuffle(pool.filter(x=>x.r),r).map(x=>pxMask(x.r,x)),plainTxt(p.r));
  const M=p.z&&PMAPS[p.z[0]];
  if(M&&p.zq!==0){const good=M.zones[p.z[1]],bads=pxShuffle(Object.keys(M.zones).filter(k=>!p.z.includes(k)),r).map(k=>M.zones[k]);
   mk(`${p.n} : quelle structure est principalement atteinte ?`,good,bads,`${p.n} touche surtout : ${p.z.slice(1).map(k=>M.zones[k]).join(", ")}.`);}
 });
}

/* ---------- Schémas à compléter / à remettre dans l'ordre ---------- */
const PEXOS=[
 {id:"coeur",map:"coeur",spe:["cardio"],titre:"Le cœur",keys:["od","vd","og","vg","aorte","ap","veines"]},
 {id:"sang",spe:["cardio"],titre:"Le trajet du sang",q:"Remettez dans l'ordre le trajet du sang, en partant des veines caves.",steps:["Veines caves","Oreillette droite","Ventricule droit","Artère pulmonaire","Poumons : le sang se charge en oxygène","Veines pulmonaires","Oreillette gauche","Ventricule gauche","Aorte, puis tout le corps"]},
 {id:"elec",spe:["cardio"],titre:"La conduction électrique du cœur",q:"Remettez dans l'ordre le trajet de l'influx électrique.",steps:["Nœud sinusal (le chef d'orchestre)","Contraction des oreillettes","Nœud auriculo-ventriculaire (le filtre)","Faisceau de His","Branches droite et gauche","Réseau de Purkinje","Contraction des ventricules"]},
 {id:"survie",spe:["cardio"],titre:"La chaîne de survie",q:"Remettez dans l'ordre les maillons de la chaîne de survie face à un arrêt cardiaque.",steps:["Reconnaître l'arrêt et alerter","Massage cardiaque immédiat","Défibrillation précoce","Réanimation spécialisée","Soins après la reprise"]},
 {id:"jambe",map:"jambe",spe:["cardio"],titre:"Les vaisseaux de la jambe",keys:["aorte","arteres","veinesp","veiness","mollet"]},
 {id:"embolie",spe:["cardio","pneumo"],titre:"De la phlébite à l'embolie",q:"Remettez dans l'ordre le trajet du caillot.",steps:["Caillot dans une veine profonde du mollet","Le caillot se détache","Remontée par la veine cave inférieure","Traversée de l'oreillette puis du ventricule droits","Blocage dans une artère pulmonaire"]},
 {id:"poumons",map:"poumons",spe:["pneumo"],titre:"L'appareil respiratoire",keys:["larynx","trachee","bronches","poumons","alveoles","diaphragme"]},
 {id:"air",spe:["pneumo"],titre:"Le trajet de l'air",q:"Remettez dans l'ordre le trajet de l'air inspiré.",steps:["Nez et bouche","Pharynx","Larynx","Trachée","Bronches","Bronchioles","Alvéoles : échanges avec le sang"]},
 {id:"crise",spe:["pneumo"],titre:"La crise d'asthme",q:"Remettez dans l'ordre les étapes d'une crise d'asthme.",steps:["Contact avec un déclencheur (allergène, virus, froid)","Contraction du muscle des bronches et gonflement de la muqueuse","Sécrétion de mucus épais","L'air sort difficilement : sifflements à l'expiration","Le bronchodilatateur relâche le muscle : l'air passe à nouveau"]},
 {id:"cerveau",map:"cerveau",spe:["neuro"],titre:"Le système nerveux central",keys:["frontal","parietal","temporal","occipital","cervelet","tronc","moelle"]},
 {id:"avc",spe:["neuro"],titre:"La prise en charge d'un AVC",q:"Remettez dans l'ordre la prise en charge d'un AVC.",steps:["Reconnaître les signes : visage, bras, parole","Appeler le 15 et noter l'heure de début","Transport vers une unité neurovasculaire","IRM ou scanner en urgence","Thrombolyse et/ou thrombectomie si possible","Rééducation et prévention de la récidive"]},
 {id:"crise-tc",spe:["neuro"],titre:"Une crise tonico-clonique",q:"Remettez dans l'ordre les phases d'une crise tonico-clonique.",steps:["Perte de connaissance brutale et chute","Phase tonique : raidissement, apnée, cyanose","Phase clonique : secousses des membres","Phase de récupération : respiration bruyante, relâchement","Réveil progressif avec confusion et amnésie"]},
 {id:"digestif",map:"digestif",spe:["gastro"],titre:"L'appareil digestif",keys:["oesophage","estomac","foie","vesicule","pancreas","grele","colon","rectum"]},
 {id:"aliments",spe:["gastro"],titre:"Le trajet des aliments",q:"Remettez dans l'ordre le trajet des aliments.",steps:["Bouche : mastication et salive","Pharynx puis œsophage","Estomac : brassage et acide","Duodénum : arrivée de la bile et des enzymes du pancréas","Intestin grêle : absorption des nutriments","Côlon : absorption de l'eau","Rectum puis anus : évacuation"]},
 {id:"glandes",map:"glandes",spe:["endoc"],titre:"Les glandes endocrines",keys:["hypophyse","thyroide","parathyroides","surrenales","pancreas","gonades"]},
 {id:"glycemie",spe:["endoc"],titre:"La régulation de la glycémie",q:"Remettez dans l'ordre ce qui se passe après un repas.",steps:["Repas : la glycémie monte","Le pancréas libère de l'insuline","Le glucose entre dans les cellules","La glycémie redescend","L'excédent est stocké dans le foie et les muscles"]},
 {id:"resucrage",spe:["endoc"],titre:"Le resucrage d'une hypoglycémie",q:"Remettez dans l'ordre la conduite à tenir chez un patient conscient.",steps:["Reconnaître les signes : sueurs, tremblements, faim","Contrôler la glycémie capillaire","Donner 15 g de sucre rapide","Recontrôler la glycémie 15 minutes après","Donner une collation de sucres lents"]},
 {id:"squelette",map:"squelette",spe:["endoc"],titre:"Le squelette et les articulations",keys:["rachis","epaule","poignet","mains","bassin","hanche","genou","pied"]},
 {id:"rein",map:"rein",spe:["nephro"],titre:"L'appareil urinaire",keys:["reins","surrenales","ureteres","vessie","uretre","prostate"]},
 {id:"urine",spe:["nephro"],titre:"La fabrication de l'urine",q:"Remettez dans l'ordre le trajet du sang à l'urine.",steps:["Le sang arrive au rein par l'artère rénale","Filtration dans les glomérules","Ajustement dans les tubules (eau, sel, potassium)","L'urine se collecte dans le bassinet","Elle descend par l'uretère","Stockage dans la vessie","Évacuation par l'urètre"]}
];
const pxExpected=(E,i)=>E.map?E.keys[i]:String(i);
const pxLabel=(E,v)=>E.map?PMAPS[E.map].zones[v]:E.steps[+v];
function vSchemas(){
 const id=state.exo||PEXOS[0].id,E=PEXOS.find(e=>e.id===id)||PEXOS[0],M=E.map&&PMAPS[E.map];
 const st=state.exoAns&&state.exoAns.id===E.id?state.exoAns:(state.exoAns={id:E.id,a:{},done:false});
 const n=E.map?E.keys.length:E.steps.length,vals=E.map?E.keys:E.steps.map((s,i)=>String(i)),opts=pxShuffle(vals,pxRand(E.id+"opt"));
 const ok=i=>st.a[i]===pxExpected(E,i),score=[...Array(n).keys()].filter(ok).length,allOk=score===n;
 const rows=[...Array(n).keys()].map(i=>{const r=st.done?ok(i):null;
  return `<label class="px-ex ${r===true?"good":r===false?"wrong":""}"><span class="px-n">${i+1}</span><select data-px="${i}" ${st.done?"disabled":""} aria-label="${E.map?"Structure n° ":"Étape "}${i+1}"><option value="">Choisir…</option>${opts.map(o=>`<option value="${o}" ${st.a[i]===o?"selected":""}>${esc(pxLabel(E,o))}</option>`).join("")}</select>${r===false?`<small>Réponse : ${esc(pxLabel(E,pxExpected(E,i)))}</small>`:""}</label>`}).join("");
 const correction=E.map?`<figure class="sch-fig" style="cursor:default"><div class="sch-head"><span class="sch-kick">Correction</span><strong>${esc(M.titre)}</strong></div>${M.draw([])}</figure>`
  :`<ol class="px-order">${E.steps.map(s=>`<li>${esc(s)}</li>`).join("")}</ol>`;
 const groups=SPES.filter(([g])=>PEXOS.some(e=>e.spe[0]===g)).map(([g,l])=>[g,l]);
 return `<div class="stack-sm">${groups.map(([g,l])=>`<span class="eyebrow">${l}</span><div class="chips wrapchips" role="group" aria-label="${l}">${PEXOS.filter(e=>e.spe[0]===g).map(e=>`<button class="chip" data-act="px-exo" data-k="${e.id}" aria-pressed="${e.id===E.id}">${e.steps?"↕ ":""}${esc(e.titre)}</button>`).join("")}</div>`).join("")}</div>
  <div class="calc-card"><div class="row"><span class="eyebrow">${E.map?"Schéma à compléter":"À remettre dans l'ordre"} · ${esc(E.titre)}</span>${st.done?`<span class="muted" style="font-size:.85rem">${score} / ${n}</span>`:""}</div>
   <p class="muted">${E.map?"Associez chaque numéro du schéma à la bonne structure, puis vérifiez.":esc(E.q)}</p>
   ${E.map?`<figure class="sch-fig" style="cursor:default">${M.draw(st.done?E.keys.filter((k,i)=>!ok(i)):[],E.keys)}</figure>`:""}
   <div class="px-exo">${rows}</div>
   ${st.done?`<div class="feedback ${allOk?"ok":"ko"}"><b>${allOk?"Parfait !":`${score} bonne${score>1?"s":""} réponse${score>1?"s":""} sur ${n}`}</b><span>${allOk?"Vous maîtrisez ce schéma.":E.map?"Les zones en couleur sur le schéma sont celles à revoir.":"Relisez l'ordre correct ci-dessous."}</span></div>
    ${correction}<button class="btn block" data-act="px-exo-reset">Recommencer</button>`:`<button class="btn block" data-act="px-exo-check">Vérifier</button>`}</div>`;
}
/* Bloc ajouté à l'accueil du quiz : quiz par spécialité et schémas. */
function pxQuizBlock(){
 const sp=SPES.filter(([s])=>pxSpeQ(s).length);if(!sp.length)return "";
 return `<section class="stack-sm"><div class="section-title"><h2>Pathologies par spécialité</h2><a href="#pathos">Les cours</a></div>
  <div class="chips wrapchips">${sp.map(([s,nom,c])=>`<button class="chip" style="--c:${c}" data-act="px-quiz" data-k="${s}"><i></i>${esc(nom)} · ${pxSpeQ(s).length}</button>`).join("")}</div>
  <a class="list" href="#entrainer/schemas"><span class="li"><span class="ic acc">${IC.bolt}</span><span><span class="t">Schémas à compléter</span><span class="s">${PEXOS.length} exercices : schémas d'organes et étapes à remettre dans l'ordre</span></span>${chev}</span></a></section>`;
}

/* ---------- Actions ---------- */
function pathoAct(b,a){const k=b.dataset.k;
 if(a==="px-mode"){state.pxMode=k;render();const t=document.querySelector(".px-head");if(t)t.scrollIntoView();return;}
 if(a==="px-quiz"){launchQuiz(pxSpeQ(k).sort(()=>Math.random()-.5).slice(0,20),"Quiz "+SPE[k].nom);return;}
 if(a==="px-qp"){launchQuiz(QUIZ.map((q,i)=>i).filter(i=>QUIZ[i].pid===k),"Quiz · "+PBY[k].n);return;}
 if(a==="px-done"){let d=pxDone();const on=!d.includes(k);d=on?[...d,k]:d.filter(x=>x!==k);store.set("pxdone",d);haptic();if(on)toast("Pathologie marquée comme étudiée");render();return;}
 if(a==="px-exo"){state.exo=k;state.exoAns=null;state.train="schemas";if(route().v==="entrainer")render();return;}
 if(a==="px-exo-check"){const E=PEXOS.find(e=>e.id===state.exoAns.id);if(Object.keys(state.exoAns.a).filter(i=>state.exoAns.a[i]).length<(E.map?E.keys.length:E.steps.length)){toast("Complétez toutes les cases");return;}state.exoAns.done=true;haptic();render();return;}
 if(a==="px-exo-reset"){state.exoAns=null;render();return;}
}
function pathoInput(t){
 if(t.id==="pxq"){state.pxq=t.value;const tmp=document.createElement("div");tmp.innerHTML=vSpe(route().arg);const nl=tmp.querySelector("#px-list"),ol=document.getElementById("px-list");if(nl&&ol)ol.innerHTML=nl.innerHTML;return true;}
 if(t.dataset.px!=null&&state.exoAns){state.exoAns.a[+t.dataset.px]=t.value;return true;}
 return false;
}
function pxIdx(){return PATHOS.map(p=>({t:"p",it:{id:p.i,titre:p.n,cat:"patho",theme:SPE[p.s].nom},txt:plainTxt([(p.nn||[]).join(" "),p.d,p.m,(p.c||[]).join(" "),(p.sg||[]).join(" "),(p.tt||[]).join(" "),(p.ri||[]).join(" "),p.r].join(" "))}));}
pxMakeQuiz();
