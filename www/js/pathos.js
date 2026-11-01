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
const SPE_ICO={cardio:"heart",pneumo:"lungs",neuro:"brain",rhumato:"bone",pedia:"baby",ophtalmo:"eye",nephro:"kidney",hemato:"drop",infectio:"thermo",dermato:"peau",endoc:"gland",nutri:"scale",urg:"alert",onco:"tube",geria:"face",psy:"brain",gyneco:"baby",orl:"face",pallia:"face",transv:"gauge",immuno:"drop",gastro:"gut",chir:"tube"};

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
/* ---------- Comprendre en images : histoire, correspondances, film du mécanisme ---------- */
const PXPIC={
 virus:'<circle cx="12" cy="12" r="5"/><path d="M12 2.5v4M12 17.5v4M2.5 12h4M17.5 12h4M5.3 5.3l2.8 2.8M15.9 15.9l2.8 2.8M18.7 5.3l-2.8 2.8M8.1 15.9l-2.8 2.8"/>',
 bact:'<rect x="3.5" y="8" width="13" height="8" rx="4"/><path d="M16.5 11c2 0 2.2-2 4-2M16.5 13c2 0 2.2 2 4 2M8 11h.01M11.5 13h.01"/>',
 caillot:'<path d="M2.5 7h19M2.5 17h19"/><circle cx="10" cy="12" r="2.6"/><circle cx="14.2" cy="11.2" r="2"/><circle cx="13.5" cy="14" r="1.6"/>',
 tumeur:'<circle cx="9" cy="10" r="4.2"/><circle cx="15.6" cy="9.4" r="3"/><circle cx="13.2" cy="16.2" r="3.4"/><path d="M9 10h.01M15.6 9.4h.01M13.2 16.2h.01"/>',
 cellule:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3"/>',
 adn:'<path d="M7 3c0 6 10 6 10 12s-10 3-10 6M17 3c0 6-10 6-10 12s10 3 10 6M8.5 6.5h7M8.5 17.5h7M10 12h4"/>',
 bebe:'<circle cx="12" cy="9" r="5"/><path d="M10.2 8.6h.01M13.8 8.6h.01M10.4 11.2c1 .8 2.2.8 3.2 0M6.5 21c.5-3.5 2.7-5.5 5.5-5.5s5 2 5.5 5.5"/>',
 thermo:'<path d="M10 4a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0z"/><path d="M12 8.5v7.5"/>',
 bouclier:'<path d="M12 3l7.5 3v5.5c0 4.5-3.2 8-7.5 9.5-4.3-1.5-7.5-5-7.5-9.5V6z"/><path d="M8.8 12l2.2 2.2 4.2-4.4"/>',
 hormone:'<rect x="3.5" y="6" width="17" height="12" rx="2"/><path d="M4 7l8 6 8-6"/>',
 sucre:'<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>',
 sang:'<path d="M12 3c3.5 4.5 6 7.7 6 10.5a6 6 0 0 1-12 0C6 10.7 8.5 7.5 12 3z"/>',
 feu:'<path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-3.8 2.5-5 .3 1.8 1.2 2.8 2.5 3 0-3-.3-5.5 0-8z"/>',
 eclair:'<path d="M13 2.5L5 13.5h6l-1 8 8-11h-6z"/>',
 bouche:'<path d="M2.5 6.5c5 0 6 3.5 9.5 3.5s4.5-3.5 9.5-3.5M2.5 17.5c5 0 6-3.5 9.5-3.5s4.5 3.5 9.5 3.5"/><path d="M11 12h2"/>',
 eau:'<path d="M3 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/>',
 coeur:'<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10C19.5 15.4 12 20 12 20z"/>',
 poumon:'<path d="M12 3.5v8.5M12 12c-1.2-1-2.2-1.2-3.2-.8M12 12c1.2-1 2.2-1.2 3.2-.8"/><path d="M8.5 7.5C6 8 4 12 4 16.5c0 2 1.5 3 3.5 2.5S10 17 10 15v-5c0-1.5-.5-2.7-1.5-2.5zM15.5 7.5C18 8 20 12 20 16.5c0 2-1.5 3-3.5 2.5S14 17 14 15v-5c0-1.5.5-2.7 1.5-2.5z"/>',
 cerveau:'<path d="M11.5 5.5a3 3 0 0 0-5.5 1.3A3 3 0 0 0 4 12a3 3 0 0 0 2 4.8 3 3 0 0 0 5.5 1.2zM12.5 5.5a3 3 0 0 1 5.5 1.3A3 3 0 0 1 20 12a3 3 0 0 1-2 4.8 3 3 0 0 1-5.5 1.2z"/>',
 os:'<path d="M7.5 5a2 2 0 0 0-3 2.5 2 2 0 0 0 2 3l7.5 7.5a2 2 0 0 0 3 2 2 2 0 0 0 2.5-3 2 2 0 0 0-3-2L9 7.5a2 2 0 0 0-1.5-2.5z"/>',
 rein:'<path d="M10 5C6 4 3.5 8 4 12.5S7.5 20 10.5 19c2-.7 1.5-3 .5-4.5s-1-4 .5-5.5S12.5 5.8 10 5z"/><path d="M12 12h3.5c1.5 0 2 1.5 2 3v4.5"/>',
 peau:'<path d="M3 8h18M3 13h18M3 18h18"/><path d="M8 8v5M15 13v5M12 3.5c0 1.5 0 3 0 4.5"/>',
 oeil:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
 oreille:'<path d="M7.5 9a4.5 4.5 0 1 1 8.2 2.6c-1.5 1.8-2.7 2.6-2.7 4.6a2.5 2.5 0 0 1-5 0"/><path d="M10.2 9.8a1.8 1.8 0 1 1 3 1.3"/>',
 ventre:'<path d="M9 3v4.5c0 2-4 2.2-4 7 0 4 3 6.5 7 6.5s7-2.2 7-5.2-3-4-5-3-1.8 3.2.4 3"/>',
 pilule:'<path d="M5.2 13.8l8.6-8.6a3.9 3.9 0 0 1 5.5 5.5l-8.6 8.6a3.9 3.9 0 0 1-5.5-5.5zM9.5 9.5l5 5"/>',
 alerte:'<path d="M12 3.5L2.5 20h19z"/><path d="M12 10v4.5M12 17.3v.01"/>',
 plus:'<path d="M12 19.5V5M6 11l6-6 6 6"/>',
 moins:'<path d="M12 4.5V19M6 13l6 6 6-6"/>',
 muscle:'<path d="M4 15c2-6 6-9 10-9 3 0 5 2 5 4.5S17 15 14 15c-2 0-3-1-3-2.5"/><path d="M4 15c3 2.5 9 3.5 15 1"/>',
 vaisseau:'<path d="M3 8c4-2 6 2 9 0s5-2 9 0M3 16c4-2 6 2 9 0s5-2 9 0"/><path d="M9 12h5M12 10l2 2-2 2"/>',
 soin:'<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M12 8v8M8 12h8"/>',
 ok:'<circle cx="12" cy="12" r="8.5"/><path d="M8 12.3l2.8 2.8L16.2 9.5"/>',
 esprit:'<path d="M7 16.5a5 5 0 0 1-1.5-9.5 5.5 5.5 0 0 1 10.3-1.6A4.5 4.5 0 1 1 17 14.5c-.6 0-1.2-.1-1.7-.3A4.8 4.8 0 0 1 7 16.5z"/><circle cx="7.5" cy="19.5" r="1.2"/><circle cx="4.5" cy="21.5" r=".6"/>',
 nuit:'<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/>',
 muet:'<path d="M6 16V11a6 6 0 0 1 9.5-4.9M18 10.5V16l1.5 2H5.5M10 20.5a2 2 0 0 0 4 0M3.5 3.5l17 17"/>',
 film:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18M3 15h18M7.5 5v4M12 5v4M16.5 5v4M7.5 15v4M12 15v4M16.5 15v4"/>',
 dot:'<circle cx="12" cy="12" r="3.5"/>'};
const PXW="(?:^|[^a-zœ])";
const PXPIC_RE=[["virus","virus|viral"],["bact","bacteri|microbe|germe|infect|pus(?:[^a-z]|$)|abces"],["caillot","caillot|thromb|embol"],["tumeur","cancer|tumeur|metasta|maligne"],
 ["adn",PXW+"genet|heredit|"+PXW+"gene(?:[^a-z]|$)|chromosom"],["bebe","fœtus|foetus|bebe|nouveau-ne|nourrisson|grossesse|placenta|accouch"],["thermo","fievre|temperature|frisson"],
 ["bouclier","anticorps|immunit|defense|globules blancs|lymphocyte|auto-immun"],["hormone","hormone|insuline|thyro|cortisol|messager|adrenaline"],["sucre","sucre|glucose|glycem"],
 ["sang","saign|hemorrag|"+PXW+"sang(?:[^a-z]|$)|sanguin|hemoglobin|globules rouges|anemi"],["feu","inflamm|irrit|brul|enflamm"],["eclair","douleur|douloureu|decharge|convuls|electri|"+PXW+"nerf|myeline|influx|"+PXW+"racine"],
 ["bouche","bouch|obstru|retreci|etroit|bloqu|comprim|ecras|coince"],["eau","œdem|oedem|liquide|"+PXW+"eau(?:[^a-z]|$)|gonfle|ascite|epanchement|urine|hydrat"],["coeur","cœur|coeur|cardiaque|pompe|"+PXW+"valve|ventricul|oreillette|palpitation"],
 ["poumon","poumon|respir|oxygen|alveol|bronch|essouffl|"+PXW+"air(?:[^a-z]|$)|mucus|"+PXW+"cils|crachat|"+PXW+"toux|expector"],["cerveau","cerveau|cerebr|neurone|conscience|memoire"],["os",PXW+"os(?:[^a-z]|$)|osseu|fractur|articul|cartilag"],
 ["rein",PXW+"rein|renal|filtr"],["peau","peau|cutane|plaie|cicatri"],["oeil","œil|oeil|vision|retine|cristallin"],["oreille","oreille|audition|auditi|tympan"],
 ["ventre","intestin|estomac|digest|selles|foie|bile"],["muscle","muscle|musculaire|paralys|faiblesse|boiter|crampe|raideur|contracture"],["muet","silenc|aucun symptome|sans symptome|inapercu|longtemps peu"],["ok","guerison|guerit|regress|disparai|rentre dans l|cede"],["esprit","angoiss|anxi|panique|"+PXW+"peur|stress|emotion|triste|honte|culpabil|humeur|desespoir|delire|hallucin|obsession|pensee|repli"],["nuit","sommeil|fatigue|somnol|insomni|"+PXW+"nuit"],["pilule","medicament|toxique|alcool|tabac|drogue"],["soin","chirurgi|operat|remplac|greffe|dialyse|antibiot|antivir|traitement|ponction|drainage|lavement|sondage|stent|thrombolys|thrombectom|angioplast|transfus|vaccin|perfusion|reeducation|kine|injection|implant|laser|pyloromyotom|exerese|ablation|prothese|resucr|refroidi|rechauff|massage|defibrill|surveillance|bilan|corset|platre|anticoagul|insuline injectee"],["alerte","mort|necros|meurt|danger|urgence|choc|arret|deces|grave"],
 ["vaisseau","arter|vaisseau|"+PXW+"veine|capillaire|aorte|atherome|plaque|cholesterol|valvule"],["plus","augment|monte|exces|trop(?:[^a-z]|$)|accumul|grossit"],["moins","baisse|diminu|manque|chute|insuffisan|perte"],["cellule","cellule"]].map(([k,r])=>[new RegExp(r),k]);
const pxStep=t=>String(t).replace(/^[a-z]+\|/,"");
function pxPicKey(t){const m=String(t).match(/^([a-z]+)\|/);if(m&&PXPIC[m[1]])return m[1];const f=fold(plainTxt(t));for(const [re,k] of PXPIC_RE)if(re.test(f))return k;return "dot";}
const pxPicSvg=k=>`<svg viewBox="0 0 24 24" aria-hidden="true">${PXPIC[k]||PXPIC.dot}</svg>`;
function pxFilm(steps,mini){const n=steps.length;
 return `<ol class="px-film${mini?" mini":""}">${steps.map((s,i)=>`<li style="--k:${n>1?Math.round(i/(n-1)*85):0}%"><span class="px-pic">${pxPicSvg(pxPicKey(s))}</span><span class="px-st">${mini?"":`<small>${i===0?"Point de départ":i===n-1?"Résultat":"Étape "+(i+1)}</small>`}<span>${pmd(pxStep(s))}</span></span></li>`).join("")}</ol>`;}
/* Le slogan (p.a) n'est affiché que si l'histoire ne le reprend pas déjà dans sa première phrase. */
function pxTagDup(a,h){const w=t=>new Set(fold(plainTxt(t)).split(/[^a-zœ]+/).filter(x=>x.length>3));const A=w(a),H=w(String(h).split(/[.:!?]\s/)[0]+" "+String(h).split("\n")[0]);if(!A.size)return true;let n=0;A.forEach(x=>{if(H.has(x))n++;});return n/A.size>=.5;}
function pxImages(p){const I=PIMG[p.i];if(!I)return "";
 return `${I.h?`<div class="px-story"><span class="cv-lab">${SVG.bulb}Imaginez…</span>${p.a&&!pxTagDup(p.a,I.h)?`<p class="px-tag">${pmd(p.a)}</p>`:""}${I.h.split("\n").map(x=>`<p>${pmd(x)}</p>`).join("")}</div>`:""}
 ${I.hc&&I.hc.length?`<div class="px-corr" role="table" aria-label="Correspondances entre l'image et le corps"><div class="px-corr-h" role="row"><span role="columnheader">Dans l'image</span><span></span><span role="columnheader">Dans le corps</span></div>${I.hc.map(([a,b])=>`<div role="row"><span role="cell">${pmd(a)}</span><i aria-hidden="true">→</i><span role="cell">${pmd(b)}</span></div>`).join("")}</div>`:""}
 ${I.hs&&I.hs.length?`<div class="px-filmbox"><span class="cv-lab">${pxPicSvg("film")}Le film de la maladie</span>${pxFilm(I.hs)}</div>`:""}`;}
function pxFilmEx(p){const I=PIMG[p.i];if(!I||!I.hs||I.hs.length<3)return "";const n=I.hs.length,opts=pxShuffle([...Array(n).keys()],pxRand(p.i+"film"));
 return `<div class="cv-verif px-fex" id="pf-box"><span class="cv-lab">${pxPicSvg("film")}Remettre le film dans l'ordre</span><p class="muted">Sans remonter dans le cours, retrouvez l'ordre des étapes du mécanisme.</p>
  <div class="px-exo">${[...Array(n).keys()].map(i=>`<label class="px-ex"><span class="px-n">${i+1}</span><select data-pf="${i}" aria-label="Étape ${i+1}"><option value="">Choisir…</option>${opts.map(o=>`<option value="${o}">${esc(plainTxt(pxStep(I.hs[o])))}</option>`).join("")}</select></label>`).join("")}</div>
  <div class="pf-fb"></div><button class="btn block" data-act="px-film-check" data-k="${p.i}">Vérifier</button></div>`;}
function vPatho(id){
 const p=PBY[id];if(!p)return notFound();
 const S=SPE[p.s],mode=state.pxMode||"recap",done=pxDone().includes(id);
 const links=(p.f||[]).map(x=>{const f=FICHES.find(y=>y.id===x),c=f?null:COURS.find(y=>y.id===x&&!y.pro),it=f||c;return it?`<a class="chip" href="#${f?"fiche":"cours"}/${x}">${esc(it.titre)}</a>`:"";}).join("");
 const qs=QUIZ.filter(q=>q.pid===id),same=PATHOS.filter(x=>x.s===p.s),k=same.indexOf(p),next=same[k+1];
 const secs=[["Définition",`<p class="fv-lead">${pmd(p.d)}</p>`],
  ...(PIMG[p.i]?[["Comprendre en images",pxImages(p)]]:[]),
  [PIMG[p.i]?"Le mécanisme expliqué":"Comprendre le mécanisme",`${(p.m||"").split("\n").map(x=>`<p class="cv-p">${pmd(x)}</p>`).join("")}${p.a&&!PIMG[p.i]?`<div class="cv-box cv-ana"><span class="cv-lab">${SVG.bulb}Pour comprendre</span><p>${pmd(p.a)}</p></div>`:""}${p.z?pmFig(p.z,"Hachurée en jaune : la zone concernée."):""}`],
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
   ${PIMG[p.i]&&PIMG[p.i].hs?`<div class="px-r film"><span class="cv-lab">${pxPicSvg("film")}Le mécanisme en un coup d'œil</span>${pxFilm(PIMG[p.i].hs,true)}</div>`:""}
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
   pxFilmEx(p)+
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
 PATHOS.forEach(p=>{let pool=PATHOS.filter(x=>x.s===p.s&&x.i!==p.i);const r=pxRand(p.i);
  if(pool.length<3)pool=[...new Map([...pool,...pathosOf(p.s)].map(x=>[x.i,x])).values()].filter(x=>x.i!==p.i);if(pool.length<3)return;
  const mk=(q,good,bads,e)=>{bads=[...new Set(bads)].filter(b=>b&&b!==good);if(bads.length<3)return;const opts=pxShuffle([good,...bads.slice(0,3)],r);const o=norm(Q("patho",SPE[p.s].u,q,opts,opts.indexOf(good),e));o.spe=p.s;o.pid=p.i;QUIZ.push(o);};
  const others=pxShuffle(pool,r),m1=x=>x.m.split("\n")[0];
  mk(`À quelle pathologie correspond cette définition : « ${pxMask(p.d.replace(/^\*\*[^*]+\*\*\s*:\s*/,""),p)} »`,p.n,others.map(x=>x.n),`${p.n} : ${plainTxt(p.d)}`);
  if(p.m)mk(`${p.n} : quel mécanisme est en cause ?`,pxMask(m1(p),p),pxShuffle(pool.filter(x=>x.m),r).map(x=>pxMask(m1(x),x)),plainTxt(m1(p)));
  if(p.r)mk(`${p.n} : quelle est l'idée essentielle à retenir ?`,pxMask(p.r,p),pxShuffle(pool.filter(x=>x.r),r).map(x=>pxMask(x.r,x)),plainTxt(p.r));
  const I=PIMG[p.i];
  if(I&&I.hc&&I.hc.length>=4){const k=Math.floor(r()*I.hc.length),row=I.hc[k];mk(`Dans l'image qui explique « ${p.n} », que représente « ${plainTxt(row[0])} » ?`,plainTxt(row[1]),pxShuffle(I.hc.filter((x,j)=>j!==k).map(x=>plainTxt(x[1])),r),`Dans l'image, ${plainTxt(row[0])} correspond à : ${plainTxt(row[1])}.`);}
  if(I&&I.hs&&I.hs.length>=5){const st=I.hs.map(x=>plainTxt(pxStep(x))),k=Math.floor(r()*(st.length-1));mk(`${p.n} : dans le film de la maladie, quelle étape vient juste après « ${st[k]} » ?`,st[k+1],pxShuffle(st.filter((x,j)=>j!==k&&j!==k+1),r),`L'ordre : ${st.join(" → ")}.`);}
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
 {id:"squelette",map:"squelette",spe:["rhumato","endoc"],titre:"Le squelette et les articulations",keys:["rachis","epaule","poignet","mains","bassin","hanche","genou","pied"]},
 {id:"rein",map:"rein",spe:["nephro"],titre:"L'appareil urinaire",keys:["reins","surrenales","ureteres","vessie","uretre","prostate"]},
 {id:"urine",spe:["nephro"],titre:"La fabrication de l'urine",q:"Remettez dans l'ordre le trajet du sang à l'urine.",steps:["Le sang arrive au rein par l'artère rénale","Filtration dans les glomérules","Ajustement dans les tubules (eau, sel, potassium)","L'urine se collecte dans le bassinet","Elle descend par l'uretère","Stockage dans la vessie","Évacuation par l'urètre"]},
 {id:"cellules",map:"sang",spe:["hemato"],titre:"Le sang et ses usines",keys:["moelle","gr","gb","plaquettes","ganglions","rate"]},
 {id:"hemostase",spe:["hemato"],titre:"L'arrêt d'un saignement",q:"Remettez dans l'ordre les étapes de l'hémostase.",steps:["Lésion du vaisseau","Contraction réflexe du vaisseau","Les plaquettes adhèrent et forment un clou","La coagulation construit un réseau de fibrine","Le caillot solide ferme la brèche","La fibrinolyse dissout le caillot une fois la paroi réparée"]},
 {id:"transfusion",spe:["hemato"],titre:"Les étapes d'une transfusion",q:"Remettez dans l'ordre les étapes de la transfusion d'un concentré de globules rouges.",steps:["Vérifier la prescription et l'identité du patient","Contrôler la concordance entre documents et poches","Réaliser le contrôle ultime au lit du patient","Débuter lentement en restant auprès du patient","Surveiller pendant et après la transfusion","Assurer la traçabilité"]},
 {id:"corps",map:"corps",spe:["infectio"],titre:"Les portes d'entrée des infections",keys:["tete","orl","poumons","coeur","abdomen","urinaire","articulations"]},
 {id:"chaine",spe:["infectio"],titre:"La chaîne de transmission",q:"Remettez dans l'ordre les maillons de la chaîne de transmission d'une infection.",steps:["Un agent infectieux (bactérie, virus, champignon, parasite)","Un réservoir (personne, animal, environnement)","Une porte de sortie (toux, selles, sang…)","Un mode de transmission (mains, contact, gouttelettes, air)","Une porte d'entrée (muqueuse, plaie, cathéter)","Un hôte réceptif"]},
 {id:"sha",spe:["infectio"],titre:"La friction hydro-alcoolique",q:"Remettez dans l'ordre les étapes de la friction des mains.",steps:["Paume contre paume","Paume sur le dos de l'autre main, doigts entrelacés","Paume contre paume, doigts entrelacés","Dos des doigts contre la paume opposée","Friction en rotation des pouces","Friction en rotation du bout des doigts dans la paume"]},
 {id:"consolidation",spe:["rhumato"],titre:"La consolidation d'une fracture",q:"Remettez dans l'ordre les étapes de la consolidation osseuse.",steps:["Fracture et hématome","Phase inflammatoire","Cal mou (tissu fibreux et cartilage)","Cal dur (os nouveau)","Remodelage de l'os"]},
 {id:"peau",map:"peau",spe:["dermato"],titre:"La peau en coupe",keys:["epiderme","derme","hypoderme","follicule","sudoripare","vaisseaux"]},
 {id:"escarre-st",spe:["dermato"],titre:"Les stades de l'escarre",q:"Remettez dans l'ordre les stades de l'escarre, du moins grave au plus grave.",steps:["Rougeur qui ne blanchit pas à la pression","Phlyctène ou abrasion de l'épiderme","Perte de peau jusqu'à l'hypoderme","Atteinte des muscles, des tendons ou de l'os"]},
 {id:"cicatrisation",spe:["dermato"],titre:"La cicatrisation d'une plaie",q:"Remettez dans l'ordre les phases de la cicatrisation.",steps:["Détersion : élimination des tissus morts","Bourgeonnement : tissu rouge qui comble la plaie","Épidermisation : la peau recouvre la plaie","Maturation de la cicatrice"]},
 {id:"femme",map:"femme",spe:["gyneco"],titre:"L'appareil génital féminin",keys:["uterus","endometre","col","vagin","trompes","ovaires"]},
 {id:"grossesse-map",map:"grossesse",spe:["gyneco"],titre:"L'utérus pendant la grossesse",keys:["uterus","placenta","foetus","cordon","liquide","col"]},
 {id:"cycle",spe:["gyneco"],titre:"Le cycle menstruel",q:"Remettez dans l'ordre les étapes du cycle menstruel.",steps:["Règles : élimination de l'endomètre","Un follicule mûrit dans l'ovaire","Ovulation vers le 14e jour","L'endomètre s'épaissit pour accueillir un embryon","Sans fécondation, les hormones chutent et les règles reviennent"]},
 {id:"hpp",spe:["gyneco"],titre:"Une hémorragie du post-partum",q:"Remettez dans l'ordre la prise en charge d'une hémorragie après l'accouchement.",steps:["Reconnaître un saignement de plus de 500 mL","Appeler à l'aide et noter l'heure","Masser l'utérus et vider la vessie","Révision utérine et injection d'ocytocine","Remplissage, transfusion et traitements de 2e ligne si le saignement persiste"]},
 {id:"developpement",spe:["pedia"],titre:"Les étapes du développement moteur",q:"Remettez dans l'ordre les acquisitions du jeune enfant.",steps:["Tient sa tête (vers 3 mois)","Tient assis sans appui (vers 6-8 mois)","Se déplace à quatre pattes (vers 9 mois)","Marche seul (vers 12-18 mois)","Court et monte les escaliers (vers 2 ans)"]},
 {id:"lavage-nez",spe:["pedia"],titre:"Le lavage de nez du nourrisson",q:"Remettez dans l'ordre les étapes du lavage de nez.",steps:["Se laver les mains, préparer les dosettes de sérum physiologique","Allonger le bébé sur le côté, tête maintenue","Introduire la dosette dans la narine du dessus et presser","Asseoir le bébé et essuyer","Recommencer de l'autre côté"]},
 {id:"lever3t",spe:["geria"],titre:"Le lever en trois temps",q:"Remettez dans l'ordre le lever d'une personne âgée à risque de chute.",steps:["Allongé : respirer, bouger les pieds","S'asseoir au bord du lit, jambes pendantes","Attendre une minute en position assise","Se lever avec un appui et rester debout un instant avant de marcher"]},
 {id:"crise-suic",spe:["psy"],titre:"La crise suicidaire",q:"Remettez dans l'ordre l'évolution d'une crise suicidaire.",steps:["Vulnérabilité, facteurs de risque","Événement déclencheur","Désespoir, idées de mort","Idées suicidaires de plus en plus précises","Scénario établi : risque de passage à l'acte"]},
 {id:"oeil",map:"oeil",spe:["ophtalmo"],titre:"L'œil en coupe",keys:["cornee","iris","cristallin","vitre","retine","macula","nerf"]},
 {id:"lumiere",spe:["ophtalmo"],titre:"Le trajet de la lumière",q:"Remettez dans l'ordre le trajet de la lumière dans l'œil.",steps:["Cornée","Humeur aqueuse","Pupille, au centre de l'iris","Cristallin","Vitré","Rétine, puis nerf optique vers le cerveau"]},
 {id:"orl",map:"orl",spe:["orl"],titre:"La sphère ORL",keys:["sinus","nez","bouche","amygdales","larynx","oreille_ext","tympan","oreille_int"]},
 {id:"son",spe:["orl"],titre:"Le trajet du son",q:"Remettez dans l'ordre le trajet du son jusqu'au cerveau.",steps:["Pavillon de l'oreille","Conduit auditif externe","Tympan","Osselets de l'oreille moyenne","Cochlée (oreille interne)","Nerf auditif vers le cerveau"]},
 {id:"periop",spe:["chir"],titre:"Le parcours opératoire",q:"Remettez dans l'ordre le parcours d'un patient opéré.",steps:["Consultation d'anesthésie et information","Préparation : jeûne, douche antiseptique, check-list","Bloc opératoire et anesthésie","Salle de surveillance post-interventionnelle","Retour dans le service : surveillance, antalgie, lever précoce"]},
 {id:"abcde",spe:["urg"],titre:"L'évaluation ABCDE",q:"Remettez dans l'ordre l'évaluation d'un patient grave.",steps:["A : voies aériennes libres ?","B : respiration (FR, SpO2)","C : circulation (TA, FC, marbrures, saignement)","D : neurologique (Glasgow, pupilles, glycémie)","E : exposition (examen complet, température)"]},
 {id:"choc",spe:["urg"],titre:"Face à un patient en choc",q:"Remettez dans l'ordre les premières actions face à un patient en état de choc.",steps:["Reconnaître les signes : tachycardie, hypotension, marbrures","Alerter et allonger, jambes surélevées si choc hypovolémique","Oxygène et scope","Deux voies veineuses et bilan sanguin","Traitement prescrit : remplissage, adrénaline si anaphylaxie","Surveillance rapprochée et traçabilité"]},
 {id:"parcours-cancer",spe:["onco"],titre:"Le parcours en cancérologie",q:"Remettez dans l'ordre les étapes du parcours d'un patient atteint de cancer.",steps:["Symptôme ou dépistage","Examens et biopsie : diagnostic","Bilan d'extension","Réunion de concertation pluridisciplinaire (RCP)","Dispositif d'annonce et plan personnalisé de soins","Traitements : chirurgie, chimiothérapie, radiothérapie","Surveillance et après-cancer"]},
 {id:"immunite",spe:["immuno"],titre:"La réponse immunitaire",q:"Remettez dans l'ordre les étapes de la réponse immunitaire face à un microbe.",steps:["Entrée du microbe","Repérage par les cellules sentinelles","Alerte et activation des lymphocytes","Production d'anticorps","Élimination du microbe","Mémoire immunitaire (principe du vaccin)"]},
 {id:"denutrition",spe:["nutri","geria"],titre:"Prendre en charge une dénutrition",q:"Remettez dans l'ordre la prise en charge nutritionnelle, de la plus simple à la plus lourde.",steps:["Peser et calculer l'IMC","Dépister (MNA) et relever les ingesta","Enrichir l'alimentation et fractionner","Compléments nutritionnels oraux","Nutrition entérale par sonde","Nutrition parentérale (veineuse)"]},
 {id:"douleur-demarche",spe:["pallia"],titre:"La démarche face à une douleur",q:"Remettez dans l'ordre la démarche infirmière face à une douleur.",steps:["Évaluer avec une échelle adaptée","Rechercher la cause et le type de douleur","Administrer l'antalgique prescrit et les moyens non médicamenteux","Réévaluer après le délai d'action","Tracer et transmettre"]},
 {id:"paliers",spe:["pallia"],titre:"Les antalgiques par paliers",q:"Remettez dans l'ordre les antalgiques, du plus faible au plus fort.",steps:["Paracétamol","AINS (ibuprofène)","Opioïdes faibles : tramadol, codéine","Opioïdes forts : morphine, oxycodone"]},
 {id:"malaise",spe:["transv"],titre:"Face à un malaise",q:"Remettez dans l'ordre la conduite à tenir face à un patient qui fait un malaise.",steps:["Mettre en sécurité et allonger","Évaluer la conscience et la respiration","Prendre pouls, tension, SpO2","Glycémie capillaire","ECG et appel du médecin","Surveiller, rassurer et tracer"]},
 {id:"systemes",map:"corps",spe:["transv"],titre:"Les grands systèmes du corps",keys:["tete","poumons","coeur","abdomen","urinaire","sang","peau"]},
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
 if(a==="px-film-check"){const box=document.getElementById("pf-box"),I=PIMG[k];if(!box||!I)return;const sel=[...box.querySelectorAll("select")];
  if(sel.some(x=>!x.value)){toast("Complétez toutes les étapes");return;}
  let sc=0;sel.forEach((x,i)=>{const ok=+x.value===i,l=x.closest(".px-ex");if(ok)sc++;l.classList.add(ok?"good":"wrong");x.disabled=true;if(!ok)l.insertAdjacentHTML("beforeend",`<small>Réponse : ${esc(plainTxt(pxStep(I.hs[i])))}</small>`);});
  const n=sel.length;box.querySelector(".pf-fb").innerHTML=`<div class="feedback ${sc===n?"ok":"ko"}"><b>${sc===n?"Parfait !":`${sc} bonne${sc>1?"s":""} réponse${sc>1?"s":""} sur ${n}`}</b><span>${sc===n?"Vous avez compris l'enchaînement du mécanisme.":"Relisez le film de la maladie, puis recommencez."}</span></div>`;
  b.textContent="Recommencer";b.dataset.act="px-film-reset";haptic();return;}
 if(a==="px-film-reset"){render();return;}
}
function pathoInput(t){
 if(t.id==="pxq"){state.pxq=t.value;const tmp=document.createElement("div");tmp.innerHTML=vSpe(route().arg);const nl=tmp.querySelector("#px-list"),ol=document.getElementById("px-list");if(nl&&ol)ol.innerHTML=nl.innerHTML;return true;}
 if(t.dataset.px!=null&&state.exoAns){state.exoAns.a[+t.dataset.px]=t.value;return true;}
 if(t.dataset.pf!=null)return true;
 return false;
}
function pxIdx(){return PATHOS.map(p=>({t:"p",it:{id:p.i,titre:p.n,cat:"patho",theme:SPE[p.s].nom},txt:plainTxt([(p.nn||[]).join(" "),p.d,p.m,PIMG[p.i]&&PIMG[p.i].h,(p.c||[]).join(" "),(p.sg||[]).join(" "),(p.tt||[]).join(" "),(p.ri||[]).join(" "),p.r].join(" "))}));}
pxMakeQuiz();
