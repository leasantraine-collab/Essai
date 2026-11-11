/* Carnet IFSI — classement automatique des contenus dans les UE du Programme.
   Chaque contenu (cours, fiche, soin, classe thérapeutique, pathologie, question de partiel) est rangé d'après ses codes UE ;
   s'il n'en a que pour un référentiel, l'autre est déduit par correspondance ; s'il n'en a aucun, sa catégorie donne une UE par défaut.
   Tout contenu ajouté plus tard est donc classé sans intervention. Chargé après meds.js, avant app.js. */
const ueSplit=u=>{const [x,y]=String(u||"").split("|");return {"2009":(x||"").trim().split(/\s+/).filter(Boolean),"2026":(y||"").trim().split(/\s+/).filter(Boolean)};};
/* Correspondances entre référentiels (utilisées seulement quand un des deux manque). */
const UE_09_26={"1.1":["B.2"],"1.2":["C.1"],"1.3":["A.2"],"2.1":["B.1"],"2.2":["B.1"],"2.3":["B.1","B.2"],"2.4":["B.1"],"2.5":["B.1"],"2.6":["B.1"],"2.7":["B.1"],"2.8":["B.1"],"2.9":["B.1"],
 "2.10":["B.1","B.4"],"2.11":["B.1","B.3"],"3.1":["A.1"],"3.2":["A.1"],"3.3":["D.2"],"3.4":["E.1"],"3.5":["D.3"],"4.1":["B.3"],"4.2":["D.1"],"4.3":["B.3"],"4.4":["B.3"],"4.5":["B.4"],
 "4.6":["C.1"],"4.7":["B.3"],"4.8":["B.4"],"5.1":["B.3"],"5.2":["A.1"],"5.3":["D.1"],"5.4":["D.3"],"5.5":["D.2"],"5.6":["E.1"],"5.7":["E.3"],"6.1":["E.3"],"6.2":["E.2"]};
const UE_26_09={"A.1":["3.1"],"A.2":["1.3"],"B.1":["2.2"],"B.2":["1.1"],"B.3":["4.4"],"B.4":["4.5"],"C.1":["1.2","4.6"],"C.2":["1.2"],"D.1":["4.2"],"D.2":["3.3"],"D.3":["3.5"],"D.4":["3.3"],"E.1":["3.4"],"E.2":["6.2"],"E.3":["6.1"]};
const CAT_UE={thera:"2.11|B.1 B.3",patho:"2.7|B.1",soins:"4.4|B.3",voca:"2.2|B.1",stage:"5.2|A.1",methode:"6.1|E.3",calcul:"2.11 4.4|B.3",quiz:"3.1|A.1",exam:"4.4|B.3",role:"1.3|A.2",anat:"2.2|B.1",situ:"3.1|A.1",tfe:"3.4 5.6|E.1"};
const UE_VALID={"2009":new Set(UE["2009"].list.map(u=>u[0])),"2026":new Set(UE["2026"].list.map(u=>u[0]))};
/* Complète les codes UE d'un objet {2009:[…],2026:[…]} : codes inconnus retirés, référentiel manquant déduit. */
function ueFill(ue,cat){
 const o={"2009":(ue&&ue["2009"]||[]).filter(c=>UE_VALID["2009"].has(c)),"2026":(ue&&ue["2026"]||[]).filter(c=>UE_VALID["2026"].has(c))};
 if(!o["2009"].length&&!o["2026"].length&&cat&&CAT_UE[cat]){const d=ueSplit(CAT_UE[cat]);o["2009"]=d["2009"];o["2026"]=d["2026"];}
 if(!o["2026"].length)o["2026"]=[...new Set(o["2009"].flatMap(c=>UE_09_26[c]||[]))];
 if(!o["2009"].length)o["2009"]=[...new Set(o["2026"].flatMap(c=>UE_26_09[c]||[]))];
 return o;}
/* Classement de tous les contenus au chargement (cours, fiches, quiz). */
[...COURS,...FICHES].forEach(it=>{it.ue=ueFill(it.ue||(it.u?ueSplit(it.u):null),it.cat);});
QUIZ.forEach(q=>{q.ue=ueFill(q.ue,q.cat);});
/* UE des familles de contenus rangés par catégorie (soins, classes thérapeutiques, spécialités). */
const UE_SO={},UE_MD={},UE_SP={};
SO_SECS.forEach(s=>{UE_SO[s[0]]=ueFill(ueSplit(s[3]),s[2]);});
MD_SECS.forEach(s=>{UE_MD[s[0]]=ueFill(ueSplit(s[2]),"thera");});
SPES.forEach(s=>{UE_SP[s[0]]=ueFill(ueSplit(s[3]),"patho");});
/* Tout ce qui concerne une UE dans un référentiel. */
const UE_CACHE={};
function ueContent(code,r){const key=r+"|"+code;if(UE_CACHE[key])return UE_CACHE[key];
 const has=it=>(it.ue&&it.ue[r]||[]).includes(code);
 const cours=COURS.filter(c=>has(c)&&!c.pro);
 const so=SO_SECS.map(s=>s[0]).filter(s=>UE_SO[s][r].includes(code)).map(s=>[s,soSecFiches(s)]).filter(x=>x[1].length);
 const md=MD_SECS.map(s=>s[0]).filter(s=>UE_MD[s][r].includes(code)).map(s=>[s,mdSecMeds(s)]).filter(x=>x[1].length);
 const px=SPES.map(s=>s[0]).filter(s=>UE_SP[s][r].includes(code)).map(s=>[s,pxSpeList(s)]).filter(x=>x[1].length);
 const uniq=(groups,id)=>new Set(groups.flatMap(g=>g[1].map(id))).size;
 return UE_CACHE[key]={full:cours.filter(c=>c.chap),autres:cours.filter(c=>!c.chap),f:FICHES.filter(has),so,md,px,q:QUIZ.filter(has),
  nSo:uniq(so,o=>o.i),nMd:uniq(md,o=>o.i),nPx:uniq(px,x=>x[1].i)};}
/* Résumé d'une UE pour la liste du Programme. */
function ueSummary(L){const p=[];
 if(L.full.length)p.push(plural(L.full.length,"cours complet").replace("cours completss","cours complets"));
 if(L.autres.length)p.push(plural(L.autres.length,"autre cours").replace("autre courss","autres cours"));
 if(L.f.length)p.push(plural(L.f.length,"fiche"));
 if(L.nSo)p.push(L.nSo+" soin"+(L.nSo>1?"s":""));
 if(L.nMd)p.push(L.nMd+" médicament"+(L.nMd>1?"s":""));
 if(L.nPx)p.push(L.nPx+" pathologie"+(L.nPx>1?"s":""));
 return p.join(" · ");}
/* Bloc repliable d'un groupe de contenus dans la page d'une UE. */
const ueGroup=(k,c,title,n,rows)=>{const open=(state.uePg||{})[k];
 return `<details class="ue-pg ue-grp"${open?" open":""} style="--c:${c}"><summary data-act="ue-pg" data-k="${k}"><span class="dot"></span><span><b>${esc(title)}</b></span><span class="muted">${n}</span></summary><div class="list">${open?rows():""}</div></details>`;};
/* Contenus d'une UE : cours complets en tête, puis soins, médicaments, pathologies, fiches. */
function ueBody(code,r){const L=ueContent(code,r),dS=soDone(),dM=mdDone(),dP=pxDone(),k=r+code;
 const sec=(t,sub,h)=>h?`<section class="stack-sm"><div class="section-title"><h2>${t}</h2></div>${sub?`<p class="muted ue-note">${sub}</p>`:""}${h}</section>`:"";
 return (["4.3","B.3"].includes(code)?afBanner():"")+sec("Cours complets",L.full.length?"Cours détaillés en chapitres, avec schémas, exemples, pièges et questions de vérification.":"",L.full.length?ueSections(L.full,"c",code):"")+
  sec("Autres cours","",L.autres.length?`<div class="list">${L.autres.map(i=>itemRow(i,"c")).join("")}</div>`:"")+
  sec("Soins et techniques",L.nSo?`${L.nSo} soins, chacun avec fiche récap et cours détaillé.`:"",L.so.map(([s,l])=>ueGroup(k+"so"+s,SO_COL(s),SO_SEC[s].nom,l.length,()=>l.map(o=>soRow(o,false,dS)).join(""))).join(""))+
  sec("Médicaments",L.nMd?`${L.nMd} grandes fiches de classes thérapeutiques.`:"",L.md.map(([s,l])=>ueGroup(k+"md"+s,MD_COL(s),MD_SEC[s].nom,l.length,()=>l.map(o=>mdRow(o,false,dM)).join(""))).join(""))+
  sec("Pathologies",L.nPx?`${L.nPx} pathologies, classées par spécialité.`:"",L.px.map(([s,l])=>ueGroup(k+"px"+s,SPE[s].c,SPE[s].nom,l.length,()=>l.map(x=>pxRow(x,false,dP)).join(""))).join(""))+
  sec("Fiches","",L.f.length?ueSections(L.f,"f",code):"");}
