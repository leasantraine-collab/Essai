/* Carnet IFSI — partiels blancs, épreuves de calculs de doses et statistiques par UE.
   · Partiel blanc : par UE ou par semestre, chronométré, noté sur 20, correction détaillée, points faibles, historique.
   · Calculs : 4 niveaux progressifs (débloqués à 9/10), puis l'épreuve blanche de 10 calculs en 30 minutes.
   · Progression : réussite par UE, par compétence (référentiel 2009) ou par domaine (référentiel 2026).
   Chargé après srs.js, avant app.js. */
const EX_IC={exam:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 12h7M9 16h5"/></svg>',
 clock:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9.5 2.5h5"/></svg>',
 flag:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 21V4M5 4h11l-2 4 2 4H5"/></svg>',
 chart:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4v16h16"/><path d="M8 16v-5M12 16V7M16 16v-8"/></svg>',
 lock:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>'};
const exNum=s=>{const v=parseFloat(String(s||"").replace(/\s/g,"").replace(",","."));return isNaN(v)?null:v;};
const exNote=(ok,n)=>n?Math.round(ok/n*40)/2:0;
const exFmtN=x=>String(x).replace(".",",");
const exMmss=ms=>{ms=Math.max(0,ms);const s=Math.ceil(ms/1000);return `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;};

/* ---------- Résultats par UE (cartes, calculs, partiels ; les réponses des anciens quiz restent comptées) ---------- */
const EX_CALC_UE=()=>typeof ueFill==="function"?ueFill(ueSplit(CAT_UE.calcul),"calcul"):{"2009":["2.11","4.4"],"2026":["B.3"]};
function exRecord(src,ref,ok,ue){
 const S=store.get("exUE",{"2009":{},"2026":{}});
 ["2009","2026"].forEach(r=>{S[r]=S[r]||{};[...new Set((ue&&ue[r])||[])].forEach(c=>{const v=S[r][c]||[0,0,null];v[0]++;if(ok)v[1]++;v[2]=v[2]==null?(ok?1:0):Math.round((v[2]*.9+(ok?.1:0))*1000)/1000;S[r][c]=v;});});
 store.set("exUE",S);const T=store.get("exSrc",{}),t=T[src]||[0,0];t[0]++;if(ok)t[1]++;T[src]=t;store.set("exSrc",T);}

/* ---------- Partiels blancs ---------- */
const PB_DEF={scope:"",n:20,sec:60,calc:true};
const pbCfg=()=>{const C=Object.assign({},PB_DEF,state.pbCfg||store.get("pbCfg",{}));if(!premOn()&&C.n>PR.partielQ)C.n=PR.partielQ;return C;};
const pbHist=()=>store.get("pblancs",[]);
const exUEs=()=>(UE[state.ueRef]||UE["2026"]).list;
function pbPool(scope){const r=state.ueRef,codes=scope.startsWith("sem:")?exUEs().filter(u=>u[3].includes(+scope.slice(4))).map(u=>u[0]):[scope];
 const by={};QUIZ.forEach((q,i)=>{const c=(q.ue&&q.ue[r]||[]).find(x=>codes.includes(x));if(c)(by[c]=by[c]||[]).push(i);});return {codes,by};}
const pbCount=scope=>Object.values(pbPool(scope).by).reduce((n,l)=>n+l.length,0);
const pbHasCalc=codes=>codes.some(c=>(EX_CALC_UE()[state.ueRef]||[]).includes(c));
function pbScopeLabel(scope){if(scope.startsWith("sem:"))return `Semestre ${scope.slice(4)}`;const u=exUEs().find(x=>x[0]===scope);return u?`UE ${u[0]} · ${u[1]}`:scope;}
function pbStart(){
 const C=pbCfg();if(!C.scope){toast("Choisissez une UE ou un semestre");return;}
 const P=pbPool(C.scope),groups=Object.values(P.by).map(l=>l.slice().sort(()=>Math.random()-.5)),tot=groups.reduce((n,l)=>n+l.length,0);
 if(tot<10){toast("Pas assez de questions pour ce choix");return;}
 const nCalc=C.calc&&pbHasCalc(P.codes)?Math.min(5,Math.round(C.n/8)):0,nQ=Math.min(C.n-nCalc,tot),items=[];
 for(let k=0;items.length<nQ;k++){const g=groups[k%groups.length];if(g.length)items.push({t:"q",i:g.pop()});else if(groups.every(x=>!x.length))break;}
 const types=Object.keys(GEN);for(let k=0;k<nCalc;k++)items.splice(Math.floor(Math.random()*(items.length+1)),0,{t:"c",g:types[k%types.length],e:GEN[types[(k*3+Math.floor(Math.random()*types.length))%types.length]].make()});
 state.pb={label:pbScopeLabel(C.scope),scope:C.scope,items,ans:items.map(()=>null),flag:items.map(()=>false),i:0,start:Date.now(),end:C.sec?Date.now()+C.sec*1000*items.length:null,res:null,grid:false};
 store.set("pbCfg",C);exTimer();state.train="partiels";location.hash="entrainer/partiels";render(true);}
function pbCorrect(z){
 const r=state.ueRef,rows=z.items.map((it,k)=>{const a=z.ans[k];
  if(it.t==="q"){const q=QUIZ[it.i];return {ok:a===q.a,q,a,ue:q.ue,cat:q.cat};}
  const v=exNum(a);return {ok:v!=null&&Math.abs(v-it.e.ans)<=it.e.tol+1e-9,e:it.e,a,ue:EX_CALC_UE(),cat:"calcul"};});
 const ok=rows.filter(x=>x.ok).length,byUE={},byCat={};
 rows.forEach(x=>{(x.ue&&x.ue[r]||[]).slice(0,1).forEach(c=>{const v=byUE[c]=byUE[c]||[0,0];v[0]++;if(x.ok)v[1]++;});const v=byCat[x.cat]=byCat[x.cat]||[0,0];v[0]++;if(x.ok)v[1]++;});
 return {rows,ok,n:rows.length,note:exNote(ok,rows.length),dur:Date.now()-z.start,byUE,byCat};}
function pbSubmit(){
 const z=state.pb;if(!z||z.res)return;clearInterval(EX_T.iv);
 const R=z.res=pbCorrect(z);let w=wrongs();
 R.rows.forEach(x=>{if(x.q){if(x.ok)w=w.filter(y=>y!==x.q.q);else if(!w.includes(x.q.q))w.push(x.q.q);}exRecord("partiel",x.q?x.q.q:"calc",x.ok,x.ue);});
 store.set("wrong",w);
 store.set("pblancs",[{d:todayISO(),l:z.label,scope:z.scope,n:R.n,ok:R.ok,note:R.note,dur:Math.round(R.dur/1000),ue:R.byUE},...pbHist()].slice(0,40));
 haptic("MEDIUM");window.scrollTo(0,0);render();}
function vPbRun(){
 const z=state.pb;if(z.res)return vPbRes();
 const it=z.items[z.i],L="ABCDEF",left=z.end?z.end-Date.now():null,nA=z.ans.filter(x=>x!=null&&x!=="").length;
 let body;
 if(it.t==="q"){const q=QUIZ[it.i];body=`<h2>${esc(q.q)}</h2><div class="stack-sm" role="radiogroup" aria-label="Réponses">${q.o.map((o,k)=>`<button class="opt pb-opt" role="radio" aria-checked="${z.ans[z.i]===k}" data-act="pb-ans" data-k="${k}"><span class="l">${L[k]}</span><span>${esc(o)}</span></button>`).join("")}</div>`;}
 else body=`<span class="eyebrow">Calcul de dose</span><div class="presc">${it.e.presc}</div><h2>${it.e.q}</h2><div class="answer"><input id="pb-in" data-pb="in" inputmode="decimal" autocomplete="off" placeholder="Votre réponse" value="${esc(z.ans[z.i]||"")}" aria-label="Votre réponse"><span class="unit">${it.e.unit}</span></div>`;
 const grid=z.items.map((_,k)=>`<button class="pb-dot${z.ans[k]!=null&&z.ans[k]!==""?" on":""}${z.flag[k]?" fl":""}${k===z.i?" cur":""}" data-act="pb-go" data-k="${k}" aria-label="Question ${k+1}${z.flag[k]?", marquée":""}">${k+1}</button>`).join("");
 return `<div class="stack-lg pb-run"><div class="stack-sm"><div class="q-top"><span class="eyebrow">${esc(z.label)}</span><button class="q-close" data-act="pb-quit">Quitter</button></div>
  <div class="pb-bar"><span>Question <b>${z.i+1}</b> sur ${z.items.length} · ${nA} répondue${nA>1?"s":""}</span>${left!=null?`<span class="pb-time${left<12e4?" low":""}" id="pb-time" role="timer">${EX_IC.clock}${exMmss(left)}</span>`:""}</div>
  <div class="progress"><i style="width:${nA/z.items.length*100}%"></i></div></div>
  <div class="q-card">${body}</div>
  <div class="pb-nav"><button class="btn ghost" data-act="pb-go" data-k="${z.i-1}" ${z.i?"":"disabled"}>${IC.back}Précédente</button><button class="btn ghost pb-flag${z.flag[z.i]?" on":""}" data-act="pb-flag" aria-pressed="${z.flag[z.i]}">${EX_IC.flag}${z.flag[z.i]?"Marquée":"Marquer"}</button>
   ${z.i<z.items.length-1?`<button class="btn" data-act="pb-go" data-k="${z.i+1}">Suivante${chev}</button>`:`<button class="btn" data-act="pb-submit">Rendre ma copie</button>`}</div>
  <details class="ot-det pb-grid-d"${z.grid?" open":""}><summary>Toutes les questions</summary><div class="pb-grid">${grid}</div><p class="ot-hint">En couleur : répondue. Encadrée : marquée pour y revenir.</p></details>
  ${z.i<z.items.length-1?`<button class="link" data-act="pb-submit">Rendre ma copie maintenant</button>`:""}</div>`;}
function vPbRes(){
 const z=state.pb,R=z.res,pct=Math.round(R.ok/R.n*100),r=state.ueRef,min=Math.round(R.dur/6e4);
 const ueRows=Object.entries(R.byUE).sort((a,b)=>a[1][1]/a[1][0]-b[1][1]/b[1][0]).map(([c,[n,ok]])=>{const u=exUEs().find(x=>x[0]===c);return `<div class="pb-ue"><span><b>UE ${esc(c)}</b><small>${esc(u?u[1]:"")}</small></span><span class="pb-ue-bar"><i style="width:${ok/n*100}%;--c:${ok/n>=.75?"var(--ok)":ok/n>=.5?"#C59B4E":"var(--bad)"}"></i></span><b>${ok}/${n}</b></div>`;}).join("");
 const catRows=Object.entries(R.byCat).filter(([,v])=>v[0]-v[1]>0).sort((a,b)=>(b[1][0]-b[1][1])-(a[1][0]-a[1][1])).slice(0,5).map(([c,[n,ok]])=>`<li><b>${esc(c==="calcul"?"Calculs de doses":CAT[c]?CAT[c].nom:c)}</b> : ${n-ok} erreur${n-ok>1?"s":""} sur ${n}</li>`).join("");
 const L="ABCDEF",wrong=R.rows.map((x,k)=>[x,k]).filter(([x])=>!x.ok);
 const corr=wrong.map(([x,k])=>x.q?`<details class="ot-det pb-cor"><summary><span class="pb-n">${k+1}</span>${esc(x.q.q)}</summary><div class="stack-sm"><p class="pb-you ko">Votre réponse : ${x.a==null?"sans réponse":`${L[x.a]}. ${esc(x.q.o[x.a])}`}</p><p class="pb-you ok">Bonne réponse : ${L[x.q.a]}. ${esc(x.q.o[x.q.a])}</p><p class="muted">${esc(x.q.e)}</p></div></details>`
  :`<details class="ot-det pb-cor"><summary><span class="pb-n">${k+1}</span>Calcul · ${x.e.q}</summary><div class="stack-sm"><div class="presc">${x.e.presc}</div><p class="pb-you ko">Votre réponse : ${x.a?esc(x.a)+" "+x.e.unit:"sans réponse"}</p><p class="pb-you ok">Réponse attendue : ${exFmtN(x.e.ans)} ${x.e.unit}</p><ol class="steps">${x.e.steps.map(s=>`<li>${s}</li>`).join("")}</ol></div></details>`).join("");
 const weakUE=Object.entries(R.byUE).filter(([,v])=>v[1]/v[0]<.75).map(([c])=>c);
 return `<div class="stack-lg"><div class="q-top"><span class="eyebrow">${esc(z.label)} · résultat</span><button class="q-close" data-act="pb-quit">Fermer</button></div>
  <div class="score-hero">${ring(pct,140)}<h1>${exFmtN(R.note)} / 20</h1><p class="lead">${R.ok} bonne${R.ok>1?"s":""} réponse${R.ok>1?"s":""} sur ${R.n} en ${plural(Math.max(1,min),"minute")}. ${R.note>=16?"Excellent : ce partiel est maîtrisé.":R.note>=10?"Moyenne atteinte : consolidez les UE en dessous de 75 %.":"Sous la moyenne : reprenez les cours des UE les plus faibles, puis refaites un partiel."}</p></div>
  ${ueRows?`<section class="stack-sm"><h2>Par UE</h2><div class="sheet-body pb-ues">${ueRows}</div></section>`:""}
  ${catRows?`<section class="stack-sm"><h2>Vos points faibles</h2><div class="sheet-body"><ul class="clean pa-ul">${catRows}</ul>
   <div class="btn-row">${weakUE.length?`<button class="btn" data-act="pb-cards" data-k="${esc(weakUE.join(","))}">${SRS_IC.cards}Réviser ces UE en cartes</button>`:""}${wrong.some(([x])=>x.q)?`<button class="btn ghost" data-act="mc-from-pb">Mettre mes erreurs en cartes</button>`:""}</div></div></section>`:""}
  ${corr?`<section class="stack-sm"><div class="section-title"><h2>Correction</h2><span class="muted">${plural(wrong.length,"erreur")}</span></div>${corr}</section>`:`<div class="callout"><b>Sans faute !</b> Toutes vos réponses sont justes.</div>`}
  <div class="btn-row"><button class="btn" data-act="pb-again">Nouveau partiel blanc</button><button class="btn ghost" data-act="pb-quit">Terminer</button></div></div>`;}
function vPbHome(){
 const C=pbCfg(),sem=state.sem||1,L=exUEs(),H=pbHist();
 const semUE=L.filter(u=>u[3].includes(sem)),other=L.filter(u=>!u[3].includes(sem));
 const chip=(scope,lab)=>{const n=pbCount(scope);return `<button class="chip" data-act="pb-scope" data-k="${esc(scope)}" aria-pressed="${C.scope===scope}" ${n<10?"disabled":""}>${esc(lab)}<span class="pb-cnt">${n}</span></button>`;};
 const n=C.scope?pbCount(C.scope):0,P=C.scope?pbPool(C.scope):null,withCalc=P&&pbHasCalc(P.codes);
 const avg=H.length?H.slice(0,5).reduce((s,x)=>s+x.note,0)/Math.min(5,H.length):null;
 return `<div class="stack-lg">
  <section class="sheet-body pb-setup"><span class="eyebrow">Partiel blanc</span><h2>Dans les conditions de l'examen</h2><p class="muted">Des questions tirées au hasard, un temps limité, aucune correction avant la fin : puis votre note, la correction détaillée et vos points faibles.</p>
   <div class="stack-sm"><h3>1. Sur quoi ?</h3><div class="chips wrapchips">${chip("sem:"+sem,`Tout le semestre ${sem}`)}${semUE.map(u=>chip(u[0],`UE ${u[0]}`)).join("")}</div>
    <details class="ot-det"><summary>Autres UE et semestres</summary><div class="chips wrapchips">${[1,2,3,4,5,6].filter(s=>s!==sem).map(s=>chip("sem:"+s,`Semestre ${s}`)).join("")}${other.map(u=>chip(u[0],`UE ${u[0]}`)).join("")}</div></details>
    ${C.scope?`<p class="ot-hint">${esc(pbScopeLabel(C.scope))} · ${plural(n,"question")} disponibles${withCalc?", calculs de doses compris":""}.</p>`:""}</div>
   <div class="stack-sm"><h3>2. Combien de questions ?</h3>${otSeg("pb-n",String(C.n),[["10","10"],...["20","30","40"].map(x=>[x,premOn()?x:x+" "+PR_LOCK])],"Nombre de questions")}${premOn()?"":`<small class="ot-hint">Version gratuite : partiels de 10 questions. De 20 à 40 questions avec l'abonnement.</small>`}</div>
   <div class="stack-sm"><h3>3. Combien de temps ?</h3>${otSeg("pb-sec",String(C.sec),[["45","45 s"],["60","1 min"],["90","1 min 30"],["0","Libre"]],"Temps par question")}<small class="ot-hint">Temps par question${C.sec?` : ${exMmss(C.sec*1000*C.n)} au total`:" : sans chronomètre"}.</small></div>
   ${withCalc?`<label class="chk"><input type="checkbox" data-act="pb-calc" ${C.calc?"checked":""}><span>Inclure des calculs de doses</span></label>`:""}
   <button class="btn block" data-act="pb-start" ${C.scope&&n>=10?"":"disabled"}>${EX_IC.clock}Commencer le partiel blanc</button></section>
  ${H.length?`<section class="stack-sm"><div class="section-title"><h2>Mes partiels blancs</h2><span class="muted">moyenne récente ${exFmtN(Math.round(avg*10)/10)} / 20</span></div>
   <div class="list">${H.slice(0,8).map(x=>`<div class="li" style="grid-template-columns:minmax(0,1fr) auto"><span><span class="t">${esc(x.l)}</span><span class="s">${esc(fmtShort(at(x.d)))} · ${x.ok}/${x.n} · ${plural(Math.max(1,Math.round(x.dur/60)),"min")}</span></span><b class="pb-note ${x.note>=10?"ok":"ko"}">${exFmtN(x.note)}</b></div>`).join("")}</div></section>`:""}
  <a class="cd-card cn-entry" href="#progression"><span class="cd-ic">${EX_IC.chart}</span><span><b>Ma progression par UE</b><small>Réussite par UE et par ${state.ueRef==="2009"?"compétence":"domaine"}, points forts et à revoir</small></span>${chev}</a></div>`;}

/* ---------- Calculs : niveaux et épreuve ---------- */
const CX_LV=[["Volumes et concentrations","Volume à prélever, pourcentages, dilutions",["prelever","pourcent","dilution"]],["Débits de perfusion","Gouttes par minute, mL/h, durée, perfuseur de précision",["gravite","mlh","duree","micro"]],
 ["Doses au poids","Doses pédiatriques, mg/kg/h",["pedia","mgkgh"]],["Pousse-seringue et insuline","Vitesse au pousse-seringue, insuline au PSE",["pse","insuline"]]].map(([n,d,t])=>[n,d,t.filter(x=>GEN[x])]).filter(x=>x[2].length);
const cxLv=()=>store.get("calcLv",{});
const cxRule=()=>store.get("calcRule","0");
const cxExams=()=>store.get("calcExam",[]);
const cxOk=(e,a)=>{const v=exNum(a);return v!=null&&Math.abs(v-e.ans)<=e.tol+1e-9;};
function cxStart(mode,lv){
 let types;if(mode==="lv")types=CX_LV[lv][2];else types=CX_LV.flatMap(x=>x[2]);
 const items=[];for(let k=0;k<10;k++){const t=mode==="lv"?types[Math.floor(Math.random()*types.length)]:CX_LV[k%CX_LV.length][2][Math.floor(Math.random()*CX_LV[k%CX_LV.length][2].length)];items.push({t,e:GEN[t].make()});}
 if(mode==="exam")items.sort(()=>Math.random()-.5);
 state.cxs={mode,lv,items,ans:items.map(()=>""),chk:items.map(()=>false),i:0,start:Date.now(),end:mode==="exam"?Date.now()+30*6e4:null,res:null};
 if(mode==="exam")exTimer();window.scrollTo(0,0);render();setTimeout(()=>{const i=document.getElementById("cx-in");i&&i.focus({preventScroll:true});},60);}
function cxSubmit(){
 const z=state.cxs;if(!z||z.res)return;clearInterval(EX_T.iv);
 const ok=z.items.filter((it,k)=>cxOk(it.e,z.ans[k])).length,n=z.items.length,dur=Math.round((Date.now()-z.start)/1000);
 z.items.forEach((it,k)=>{if(z.mode==="exam"||!z.chk[k])exRecord("calc",it.t,cxOk(it.e,z.ans[k]),EX_CALC_UE());});
 if(z.mode==="lv"){const L=cxLv(),v=L[z.lv]||{best:0,pass:false};v.best=Math.max(v.best,ok);if(ok>=9)v.pass=true;L[z.lv]=v;store.set("calcLv",L);}
 const rule=cxRule(),pass=rule==="0"?ok===n:ok>=8;
 if(z.mode==="exam")store.set("calcExam",[{d:todayISO(),ok,n,dur,pass,rule},...cxExams()].slice(0,30));
 const s=stats();s.exTot+=n;s.exOk+=ok;store.set("stats",s);
 z.res={ok,n,dur,pass};haptic("MEDIUM");window.scrollTo(0,0);render();}
function vCxRun(){
 const z=state.cxs,exam=z.mode==="exam";
 if(z.res){const R=z.res,title=exam?(R.pass?"Épreuve réussie":"Épreuve non validée"):`Niveau ${z.lv+1} · ${R.ok}/${R.n}`;
  const rows=z.items.map((it,k)=>{const ok=cxOk(it.e,z.ans[k]);return `<details class="ot-det pb-cor ${ok?"good":""}"${ok?"":" open"}><summary><span class="pb-n ${ok?"ok":"ko"}">${k+1}</span>${esc(GEN[it.t].label)} · ${ok?"juste":"à revoir"}</summary><div class="stack-sm"><div class="presc">${it.e.presc}</div><p>${it.e.q}</p><p class="pb-you ${ok?"ok":"ko"}">Votre réponse : ${z.ans[k]?esc(z.ans[k])+" "+it.e.unit:"sans réponse"}</p>${ok?"":`<p class="pb-you ok">Réponse attendue : ${exFmtN(it.e.ans)} ${it.e.unit}</p>`}<ol class="steps">${it.e.steps.map(s=>`<li>${s}</li>`).join("")}</ol></div></details>`;}).join("");
  const next=!exam&&R.ok>=9&&z.lv<CX_LV.length-1;
  return `<div class="stack-lg"><div class="q-top"><span class="eyebrow">${exam?"Épreuve de calculs":"Calculs · "+esc(CX_LV[z.lv][0])}</span><button class="q-close" data-act="cx-quit">Fermer</button></div>
   <div class="score-hero">${ring(Math.round(R.ok/R.n*100),140)}<h1>${title}</h1><p class="lead">${R.ok} calcul${R.ok>1?"s":""} juste${R.ok>1?"s":""} sur ${R.n} en ${exMmss(R.dur*1000)}. ${exam?(R.pass?"Bravo : vous êtes prêt·e pour l'épreuve.":cxRule()==="0"?"L'épreuve se valide sans aucune erreur : reprenez les calculs faux, puis retentez.":"Il faut au moins 8 calculs justes : entraînez-vous par niveau, puis retentez."):R.ok>=9?(next?"Niveau validé : le suivant est débloqué.":"Niveau validé."):"Il faut 9 bonnes réponses sur 10 pour valider ce niveau."}</p></div>
   <section class="stack-sm"><h2>Correction</h2>${rows}</section>
   <div class="btn-row">${next?`<button class="btn" data-act="cx-lv" data-k="${z.lv+1}">Niveau ${z.lv+2}</button>`:""}<button class="btn ${next?"ghost":""}" data-act="${exam?"cx-exam":"cx-lv"}" data-k="${z.lv}">${exam?"Nouvelle épreuve":"Recommencer ce niveau"}</button><button class="btn ghost" data-act="cx-quit">Terminer</button></div></div>`;}
 const it=z.items[z.i],left=z.end?z.end-Date.now():null,chk=z.chk[z.i],ok=chk&&cxOk(it.e,z.ans[z.i]),nA=z.ans.filter(Boolean).length;
 return `<div class="stack-lg"><div class="stack-sm"><div class="q-top"><span class="eyebrow">${exam?"Épreuve · 10 calculs en 30 min":"Niveau "+(z.lv+1)+" · "+esc(CX_LV[z.lv][0])}</span><button class="q-close" data-act="cx-quit">Quitter</button></div>
  <div class="pb-bar"><span>Calcul <b>${z.i+1}</b> sur ${z.items.length}${exam?` · ${nA} répondu${nA>1?"s":""}`:""}</span>${left!=null?`<span class="pb-time${left<3e5?" low":""}" id="pb-time" role="timer">${EX_IC.clock}${exMmss(left)}</span>`:""}</div>
  <div class="progress"><i style="width:${(exam?nA:z.i+(chk?1:0))/z.items.length*100}%"></i></div></div>
  <div class="calc-card"><span class="eyebrow">${esc(GEN[it.t].label)}</span><div class="presc">${it.e.presc}</div><h3>${it.e.q}</h3>
   <form class="answer" id="cx-form"><input id="cx-in" data-cx="in" inputmode="decimal" enterkeyhint="done" autocomplete="off" placeholder="Votre réponse" value="${esc(z.ans[z.i])}" ${chk?"disabled":""} aria-label="Votre réponse"><span class="unit">${it.e.unit}</span>${exam||chk?"":`<button class="btn" type="submit">Vérifier</button>`}</form>
   ${chk?`<div class="feedback ${ok?"ok":"ko"}"><b>${ok?"Juste !":"Réponse attendue : "+exFmtN(it.e.ans)+" "+it.e.unit}</b><ol class="steps">${it.e.steps.map(s=>`<li>${s}</li>`).join("")}</ol></div>`:""}</div>
  <div class="pb-nav">${exam?`<button class="btn ghost" data-act="cx-go" data-k="${z.i-1}" ${z.i?"":"disabled"}>${IC.back}Précédent</button>`:""}
   ${z.i<z.items.length-1?(exam||chk?`<button class="btn" data-act="cx-go" data-k="${z.i+1}">Suivant${chev}</button>`:""):(exam||chk?`<button class="btn" data-act="cx-submit">${exam?"Rendre ma copie":"Voir mon résultat"}</button>`:"")}</div>
  ${exam?`<div class="pb-grid">${z.items.map((_,k)=>`<button class="pb-dot${z.ans[k]?" on":""}${k===z.i?" cur":""}" data-act="cx-go" data-k="${k}" aria-label="Calcul ${k+1}">${k+1}</button>`).join("")}</div>`:""}</div>`;}
function cxHome(){
 const L=cxLv(),H=cxExams(),rule=cxRule(),best=H.length?Math.max(...H.map(x=>x.ok)):null,passed=H.some(x=>x.pass);
 return `<section class="stack-sm"><div class="section-title"><h2>Progresser pas à pas</h2><span class="muted">${CX_LV.filter((_,i)=>L[i]&&L[i].pass).length} / ${CX_LV.length} niveaux</span></div>
  <div class="cx-lvs">${CX_LV.map(([n,d],i)=>{const v=L[i]||{},pl=!premOn()&&i>=PR.calculsNiv,open=!pl&&(i===0||(L[i-1]&&L[i-1].pass)||v.best);return `<button class="cx-lv${v.pass?" ok":""}${pl?" pr-locked":""}" data-act="cx-lv" data-k="${i}" ${open||pl?"":"disabled"}><span class="cx-n">${v.pass&&!pl?SVG.check:open?i+1:pl?PR_LOCK:EX_IC.lock}</span><span><b>Niveau ${i+1} · ${esc(n)}${pl?" "+prTag():""}</b><small>${esc(d)}${v.best?` · meilleur score ${v.best}/10`:""}</small></span></button>`;}).join("")}</div>
  <p class="ot-hint">10 calculs par niveau, correction après chaque réponse. 9 bonnes réponses débloquent le niveau suivant.</p></section>
  <section class="cd-card cx-exam"><div class="cd-top"><span class="eyebrow">Épreuve blanche</span>${passed?`<span class="tag done">Déjà réussie</span>`:""}</div><h2>10 calculs en 30 minutes</h2>
   <p class="muted">Tous les niveaux mélangés, sans correction avant la fin. ${rule==="0"?"Validée sans aucune erreur, comme dans de nombreux IFSI.":"Validée à partir de 8 calculs justes."}${best!=null?` Meilleur résultat : ${best}/10.`:""}</p>
   ${otSeg("cx-rule",rule,[["0","Zéro faute"],["8","8 sur 10"]],"Règle de validation")}
   <button class="btn block" data-act="cx-exam">${premOn()?EX_IC.clock:PR_LOCK}${premOn()?"Commencer l'épreuve":"Réservé aux abonnés"}</button></section>
  <div class="section-title"><h2>Entraînement libre</h2></div>`;}

/* ---------- Chronomètre commun ---------- */
const EX_T={iv:null};
function exTimer(){clearInterval(EX_T.iv);EX_T.iv=setInterval(()=>{const z=state.pb&&!state.pb.res&&state.pb.end?state.pb:state.cxs&&!state.cxs.res&&state.cxs.end?state.cxs:null;
 if(!z){clearInterval(EX_T.iv);return;}const left=z.end-Date.now(),el=document.getElementById("pb-time");
 if(el){el.lastChild.textContent=exMmss(left);el.classList.toggle("low",left<(z===state.pb?12e4:3e5));}
 if(left<=0){toast("Temps écoulé : copie rendue");if(z===state.pb)pbSubmit();else cxSubmit();}},1000);}

/* ---------- Progression par UE ---------- */
const COMP_UE={1:["3.1","5.2","2.3"],2:["3.2","5.3"],3:["4.1","2.10","5.1"],4:["4.3","4.4","4.7","2.11","2.1","2.2","2.4","2.5","2.6","2.7","2.8","2.9","5.5"],5:["1.2","4.6","5.4"],6:["1.1","4.2","5.3"],7:["1.3","4.5","4.8","5.6"],8:["3.4","6.1","6.2","5.6"],9:["3.3","5.5"],10:["3.5","5.4"]};
function exCoverage(code){const r=state.ueRef;if(typeof ueContent!=="function")return [0,0];const C=ueContent(code,r);
 const S={c:new Set(studied()),f:new Set(reviewed()),s:new Set(soDone()),m:new Set(mdDone()),p:new Set(pxDone())};
 const ids=(g,f)=>[...new Set(g.flatMap(x=>x[1].map(f)))];
 const all=[...[...C.full,...C.autres].map(c=>S.c.has(c.id)),...C.f.map(f=>S.f.has(f.id)),...ids(C.so,o=>o.i).map(i=>S.s.has(i)),...ids(C.md,o=>o.i).map(i=>S.m.has(i)),...ids(C.px,x=>x[1].i).map(i=>S.p.has(i))];
 return [all.filter(Boolean).length,all.length];}
function vProgression(){
 const r=state.ueRef,R=UE[r]||UE["2026"],S=(store.get("exUE",{})[r])||{},T=store.get("exSrc",{}),sem=state.sem||1;
 const rows=R.list.map(u=>{const v=S[u[0]]||[0,0,null],[d,t]=exCoverage(u[0]);return {u,n:v[0],ok:v[1],ema:v[2],d,t};});
 const lev=x=>x.n<8?["new","Pas assez de réponses"]:x.ema>=.8?["ok","Solide"]:x.ema>=.6?["mid","En progrès"]:["ko","À revoir"];
 const ranked=rows.filter(x=>x.n>=8).sort((a,b)=>a.ema-b.ema),weak=ranked.filter(x=>x.ema<.7).slice(0,3),strong=ranked.slice().reverse().filter(x=>x.ema>=.75).slice(0,3);
 const row=x=>{const [c,l]=lev(x);return `<div class="pg-ue"><a class="pg-ue-h" href="#ue/${encodeURIComponent(x.u[0])}"><b>UE ${esc(x.u[0])}</b><span>${esc(x.u[1])}</span></a>
  <div class="pg-bars"><span class="pg-lab">Réussite</span><span class="pb-ue-bar"><i style="width:${x.n?Math.round((x.ema||0)*100):0}%;--c:${c==="ok"?"var(--ok)":c==="mid"?"#C59B4E":c==="ko"?"var(--bad)":"var(--line-2)"}"></i></span><b>${x.n?Math.round(x.ema*100)+" %":"–"}</b>
   <span class="pg-lab">Contenus vus</span><span class="pb-ue-bar"><i style="width:${x.t?x.d/x.t*100:0}%;--c:var(--brand)"></i></span><b>${x.d}/${x.t}</b></div>
  <div class="pg-foot"><span class="pg-tag ${c}">${l}</span><span class="muted">${plural(x.n,"réponse")}</span></div></div>`;};
 const act=x=>`<div class="pg-act"><span><b>UE ${esc(x.u[0])}</b> ${esc(x.u[1])} · ${Math.round(x.ema*100)} %</span><span class="pg-btns"><button class="chip" data-act="pg-cards" data-k="${esc(x.u[0])}">${SRS_IC.cards}Cartes</button><button class="chip" data-act="pg-pb" data-k="${esc(x.u[0])}">${EX_IC.clock}Partiel</button></span></div>`;
 let grp="";
 if(r==="2009")grp=Object.entries(COMP).map(([n,t])=>{const L=(COMP_UE[n]||[]).map(c=>S[c]).filter(v=>v&&v[0]);const N=L.reduce((s,v)=>s+v[0],0),E=N?L.reduce((s,v)=>s+v[2]*v[0],0)/N:null;
  return `<div class="pg-comp"><span><b>C${n}</b> ${esc(t)}</span><span class="pb-ue-bar"><i style="width:${E==null?0:Math.round(E*100)}%;--c:${E==null?"var(--line-2)":E>=.8?"var(--ok)":E>=.6?"#C59B4E":"var(--bad)"}"></i></span><b>${E==null?"–":Math.round(E*100)+" %"}</b></div>`;}).join("");
 else grp=Object.entries(R.groups||{}).map(([g,t])=>{const L=R.list.filter(u=>u[2]===g).map(u=>S[u[0]]).filter(v=>v&&v[0]);const N=L.reduce((s,v)=>s+v[0],0),E=N?L.reduce((s,v)=>s+v[2]*v[0],0)/N:null;
  return `<div class="pg-comp"><span><b>${esc(g)}</b> ${esc(t)}</span><span class="pb-ue-bar"><i style="width:${E==null?0:Math.round(E*100)}%;--c:${E==null?"var(--line-2)":E>=.8?"var(--ok)":E>=.6?"#C59B4E":"var(--bad)"}"></i></span><b>${E==null?"–":Math.round(E*100)+" %"}</b></div>`;}).join("");
 const src=(k,l)=>{const v=T[k];return `<span><b>${v?Math.round(v[1]/v[0]*100)+" %":"–"}</b>${l}${v?` · ${v[0]}`:""}</span>`;};
 const semRows=rows.filter(x=>x.u[3].includes(sem)),otherRows=rows.filter(x=>!x.u[3].includes(sem));
 return `<div class="stack-lg">${backBtn("S'entraîner")}${vh("Progression","Ma progression par UE",`${esc(R.sub)} · réussite calculée sur vos réponses aux cartes, partiels blancs et calculs, en donnant plus de poids aux plus récentes.`)}
  <div class="srs-kpi pg-kpi">${src("card","cartes")}${src("partiel","partiels")}${src("calc","calculs")}</div>
  ${weak.length?`<section class="stack-sm"><h2>À revoir en priorité</h2><div class="sheet-body pg-acts">${weak.map(act).join("")}</div></section>`:""}
  ${strong.length?`<section class="stack-sm"><h2>Vos points forts</h2><div class="sheet-body pg-acts">${strong.map(x=>`<div class="pg-act"><span><b>UE ${esc(x.u[0])}</b> ${esc(x.u[1])} · ${Math.round(x.ema*100)} %</span></div>`).join("")}</div></section>`:""}
  ${!ranked.length?`<div class="callout"><b>Encore peu de réponses</b><p>Faites une séance de cartes, un partiel blanc ou quelques calculs : vos résultats par UE apparaîtront ici.</p></div>`:""}
  <section class="stack-sm"><h2>${r==="2009"?"Par compétence":"Par domaine"}</h2><div class="sheet-body pg-comps">${grp}</div>${r==="2009"?`<p class="ot-hint">Repère indicatif : chaque compétence regroupe les UE qui y contribuent le plus.</p>`:""}</section>
  <section class="stack-sm"><h2>UE du semestre ${sem}</h2>${semRows.map(row).join("")||`<p class="muted">Aucune UE.</p>`}</section>
  <details class="ot-det"><summary>Les autres UE</summary><div class="stack-sm">${otherRows.map(row).join("")}</div></details></div>`;}

/* ---------- Actions ---------- */
function exAct(b,a){const k=b.dataset.k;
 if(a==="pb-scope"){const C=pbCfg();C.scope=k;state.pbCfg=C;render();}
 else if(a==="pb-n"){if(!premOn()&&+k>PR.partielQ){toast("Partiels de 20 à 40 questions : réservés aux abonnés");return;}const C=pbCfg();C.n=+k;state.pbCfg=C;render();}
 else if(a==="pb-sec"){const C=pbCfg();C.sec=+k;state.pbCfg=C;render();}
 else if(a==="pb-calc"){const C=pbCfg();C.calc=!!b.checked;state.pbCfg=C;}
 else if(a==="pb-start")pbStart();
 else if(a==="pb-ans"){const z=state.pb;if(!z||z.res)return;z.ans[z.i]=+k;haptic();render();}
 else if(a==="pb-go"){const z=state.pb;if(!z)return;const n=+k;if(n<0||n>=z.items.length)return;z.i=n;z.grid=!!b.closest(".pb-grid");render();window.scrollTo(0,0);}
 else if(a==="pb-flag"){const z=state.pb;z.flag[z.i]=!z.flag[z.i];render();}
 else if(a==="pb-submit"){const z=state.pb,miss=z.ans.filter(x=>x==null||x==="").length;
  if(miss&&!b.dataset.armed){b.dataset.armed="1";b.textContent=`${plural(miss,"question")} sans réponse : toucher pour rendre`;setTimeout(()=>{if(b.isConnected){delete b.dataset.armed;b.textContent="Rendre ma copie";}},4000);return;}pbSubmit();}
 else if(a==="pb-quit"){if(state.pb&&!state.pb.res&&!b.dataset.armed){b.dataset.armed="1";b.textContent="Toucher pour abandonner";setTimeout(()=>{if(b.isConnected){delete b.dataset.armed;b.textContent="Quitter";}},3000);return;}clearInterval(EX_T.iv);state.pb=null;render(true);}
 else if(a==="pb-again"){state.pb=null;render(true);}
 else if(a==="pb-cards"){const S=srsSet();k.split(",").forEach(c=>{if(!S.decks.includes("ue:"+c))S.decks.push("ue:"+c);});store.set("srsSet",S);srsStart(srsSelCards(),"Révision des UE à revoir");}
 else if((a==="cx-lv"&&!premOn()&&+k>=PR.calculsNiv)||(a==="cx-exam"&&!premOn())){toast("Réservé aux abonnés : niveaux 2 à 4 et épreuve blanche");location.hash="compte";}
 else if(a==="cx-lv")cxStart("lv",+k);
 else if(a==="cx-exam")cxStart("exam");
 else if(a==="cx-rule"){store.set("calcRule",k);render();}
 else if(a==="cx-go"){const z=state.cxs;if(!z)return;const n=+k;if(n<0||n>=z.items.length)return;z.i=n;render();setTimeout(()=>{const i=document.getElementById("cx-in");i&&!i.disabled&&i.focus({preventScroll:true});},40);}
 else if(a==="cx-submit")cxSubmit();
 else if(a==="cx-quit"){if(state.cxs&&!state.cxs.res&&state.cxs.mode==="exam"&&!b.dataset.armed){b.dataset.armed="1";b.textContent="Toucher pour abandonner";setTimeout(()=>{if(b.isConnected){delete b.dataset.armed;b.textContent="Quitter";}},3000);return;}clearInterval(EX_T.iv);state.cxs=null;render(true);}
 else if(a==="pg-cards"){const S=srsSet();if(!S.decks.includes("ue:"+k))S.decks.push("ue:"+k);store.set("srsSet",S);srsDeckGo("ue:"+k,"UE "+k);}
 else if(a==="pg-pb"){const C=pbCfg();C.scope=k;state.pbCfg=C;store.set("pbCfg",C);state.train="partiels";location.hash="entrainer/partiels";}
}
function exInput(t){
 if(t.dataset.pb==="in"&&state.pb){state.pb.ans[state.pb.i]=t.value;const n=state.pb.ans.filter(x=>x!=null&&x!=="").length;const el=document.querySelector(".pb-bar span");if(el)el.innerHTML=`Question <b>${state.pb.i+1}</b> sur ${state.pb.items.length} · ${n} répondue${n>1?"s":""}`;}
 else if(t.dataset.cx==="in"&&state.cxs){state.cxs.ans[state.cxs.i]=t.value;}}
function cxFormSubmit(){const z=state.cxs;if(!z||z.res)return;
 if(z.mode==="exam"){if(z.i<z.items.length-1){z.i++;render();setTimeout(()=>{const i=document.getElementById("cx-in");i&&i.focus({preventScroll:true});},40);}return;}
 if(!z.ans[z.i]||exNum(z.ans[z.i])==null){const i=document.getElementById("cx-in");if(i){i.focus();i.placeholder="Entrez un nombre";}return;}
 z.chk[z.i]=true;const it=z.items[z.i],ok=cxOk(it.e,z.ans[z.i]);exRecord("calc",it.t,ok,EX_CALC_UE());haptic(ok?"LIGHT":"MEDIUM");render();}
