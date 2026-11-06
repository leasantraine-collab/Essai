/* Carnet IFSI — fiches visuelles d'une page (A4), générées pour chaque cours, pathologie, fiche de soin et classe de
   médicaments à partir de leur contenu : l'essentiel, les points clés par partie, pièges, repères chiffrés, schéma et
   auto-test. À l'écran, la fiche s'adapte au téléphone ; à l'impression, elle est ajustée pour tenir sur une page A4.
   Chargé avant app.js. */
const A4_W=696,A4_H=998,A4_MAXL=13,A4_MINL=-7,A4_FIT={};
const A4_FS=[1,1,1,1,1,1,1,.95,.95,.91,.88,.85,.82,.78];
const A4_IC={
 star:'<svg viewBox="0 0 24 24"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>',
 target:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/></svg>',
 warn:'<svg viewBox="0 0 24 24"><path d="M12 3.5L2.5 20h19z"/><path d="M12 10v4.5M12 17.4v.1"/></svg>',
 hash:'<svg viewBox="0 0 24 24"><path d="M9 3.5L7 20.5M17 3.5l-2 17M4 9h16.5M3.5 15H20"/></svg>',
 list:'<svg viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/></svg>',
 steps:'<svg viewBox="0 0 24 24"><path d="M4 19h5v-5h5V9h5V4"/></svg>',
 eye:'<svg viewBox="0 0 24 24"><path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
 pill:'<svg viewBox="0 0 24 24"><rect x="3" y="8.5" width="18" height="7" rx="3.5" transform="rotate(-35 12 12)"/><path d="M9.2 7.9l5.6 8.2"/></svg>',
 flask:'<svg viewBox="0 0 24 24"><path d="M9 3h6M10 3v6l-5.5 9.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3"/><path d="M7.5 15h9"/></svg>',
 heart:'<svg viewBox="0 0 24 24"><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z"/></svg>',
 book:'<svg viewBox="0 0 24 24"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5V5.5"/></svg>',
 bulb:'<svg viewBox="0 0 24 24"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/></svg>',
 box:'<svg viewBox="0 0 24 24"><path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5z"/><path d="M3.5 7.5L12 12l8.5-4.5M12 12v9"/></svg>',
 shield:'<svg viewBox="0 0 24 24"><path d="M12 3l7.5 3v6c0 4.5-3.2 7.8-7.5 9-4.3-1.2-7.5-4.5-7.5-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',
 chat:'<svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z"/></svg>',
 pen:'<svg viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/></svg>',
 test:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.6 9.3a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.2-2.4 3.8"/><circle cx="12" cy="17.2" r=".6"/></svg>',
 print:'<svg viewBox="0 0 24 24"><path d="M7 9V3.5h10V9"/><rect x="3.5" y="9" width="17" height="8" rx="2"/><path d="M7 14h10v6.5H7z"/></svg>',
 grid:'<svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></svg>'
};

/* ---------- Outils de texte ---------- */
const a4Plain=s=>String(s||"").replace(/\s+/g," ").trim();
/* Raccourcit sans couper au milieu d'une idée : fin de phrase, point-virgule ou virgule, sinon dernier mot entier. */
function a4B(s,max){
 s=a4Plain(s);if(s.length<=max)return s;
 const cut=s.slice(0,max),at=(t,min)=>{const k=cut.lastIndexOf(t);return k>=max*min?k:-1;};
 let k=-1;for(const m of cut.matchAll(/(\S+)[.!?](?=\s+[A-ZÀ-Ý«(])/g)){if(!/^(ex|cf|etc|dr|m|mme|vs|env|p|min|max|n°)$/i.test(m[1].replace(/[^\wÀ-ÿ°]/g,""))&&m.index+m[0].length>=max*.42)k=m.index+m[0].length;}
 if(k<0)k=at(" ; ",.42);if(k<0)k=at(" : ",.7);if(k<0)k=at(", ",.6);
 let out=k>=0?cut.slice(0,k).replace(/[\s;:,.]+$/,""):cut.replace(/\s+\S*$/,"").replace(/[\s;:,(]+$/,"")+"…";
 if((out.match(/\*\*/g)||[]).length%2)out=out.replace(/\*\*(?![\s\S]*\*\*)/,"");
 if((out.match(/==/g)||[]).length%2)out=out.replace(/==(?![\s\S]*==)/,"");
 const o=(out.match(/\(/g)||[]).length,c=(out.match(/\)/g)||[]).length;
 if(o>c){const p=out.lastIndexOf("(");out=p>max*.4?out.slice(0,p).replace(/\s+$/,"")+(out.endsWith("…")?"…":""):out+")";}
 const q=(out.match(/«/g)||[]).length,r=(out.match(/»/g)||[]).length;if(q>r)out+=" »";
 return out;
}
const a4Sent=s=>a4Plain(s).split(/(?<=[.!?])\s+(?=[A-ZÀ-Ý«])/).filter(Boolean);
const a4NoB=s=>String(s||"").replace(/\*\*/g,"");
const a4Ue=u=>{const [a,b]=String(u||"").split("|");return ((state.ueRef==="2009"?a:(b||a))||"").trim().split(/\s+/).filter(Boolean);};
/* Questions utilisables sur une fiche : courtes, sans renvoi à une image. */
const a4QOk=(q,o,a)=>q&&a4Plain(q).length<=170&&!/image|schéma|planche|ci-dessus|ci-contre|\bfilm\b/i.test(q)&&(!o||o.every(x=>String(x).length<=110))&&a!=null;
/* Répartit les éléments de plusieurs listes à tour de rôle (une idée par partie avant de reprendre). */
function a4Mix(lists){const out=[],L=lists.map(l=>l.slice());let more=true;while(more){more=false;L.forEach(l=>{if(l.length){out.push(l.shift());more=true;}});}return out;}

/* ---------- Modèles de fiche ---------- */
function a4Course(c){
 const cat=CAT[c.cat]||{nom:"Cours",c:"#B9D4EE"};
 const first=c.chap[0]&&c.chap[0].b.find(b=>(b.t==="p"||b.t==="text")&&b.ps&&b.ps[0]);
 const lab=s=>a4NoB(s);
 const pts=ch=>{const out=[],add=x=>{x=a4Plain(x);if(x&&out.length<5&&!out.includes(x))out.push(x);};
  const r=ch.b.find(b=>b.t==="retenir");if(r)add(r.txt);
  for(const b of ch.b){if(out.length>=5)break;
   if(["liste","etapes","trace","signes"].includes(b.t))(b.items||[]).forEach(add);
   else if(b.t==="cols")(b.cols||[]).forEach(x=>add(`**${lab(x.h)}** : ${(x.items||[]).map(lab).join(", ")}`));
   else if(b.t==="duo")(b.items||[]).forEach(x=>add(`**${lab(x.tag)}** : ${x.txt}`));
   else if(b.t==="table")(b.rows||[]).forEach(x=>add(`**${lab(x[0])}** : ${x[1]}`));
   else if(b.t==="valeurs")(b.rows||[]).forEach(x=>add(`**${lab(x[0])}** : ${x[2]}`));}
  if(!out.length){const p=ch.b.find(b=>(b.t==="p"||b.t==="text")&&b.ps);if(p)add(a4Sent(p.ps[0])[0]);}
  return out;};
 const nums=[];
 c.chap.forEach(ch=>ch.b.forEach(b=>{if(b.t==="valeurs")(b.rows||[]).forEach(r=>nums.push([r[0],r[2]]));}));
 if(nums.length<3)c.chap.forEach(ch=>ch.b.forEach(b=>{if(b.t==="table")(b.rows||[]).forEach(r=>{if(/\d/.test(r[1])&&a4NoB(r[1]).length<=80&&a4NoB(r[0]).length<=42)nums.push([r[0],r[1]]);});}));
 const shown=c.chap.flatMap(ch=>pts(ch).slice(0,3)).map(a4NoB).join("\n");
 const seen=new Set(),num=nums.filter(r=>{const k=a4NoB(r[0]);if(seen.has(k)||shown.includes(k+" :"))return false;seen.add(k);return true;});
 const sb=c.chap.flatMap(ch=>ch.b).find(b=>(b.t==="schema"&&typeof SCH!=="undefined"&&SCH[b.k])||(b.t==="map"&&typeof amFig==="function"));
 const boxes=[{t:"L'essentiel",ic:"star",tone:"key",type:"ess",items:c.ess,n:8,min:5,max:150},
  {t:"Je dois savoir",ic:"target",type:"know",items:c.obj,n:5,min:2,max:110,drop:4},
  ...c.chap.map((ch,i)=>({t:a4NoB(ch.chip||ch.h),num:i+1,type:"list",items:pts(ch),n:3,min:1,max:118})).filter(b=>b.items.length)];
 if(sb)boxes.push({t:sb.t==="schema"&&typeof SCH_T!=="undefined"&&SCH_T[sb.k]?SCH_T[sb.k][0]:(sb.cap?a4B(sb.cap,50):"Schéma"),ic:"eye",type:"sch",html:()=>sb.t==="schema"?schFig(sb.k):amFig(Object.assign({},sb,{cap:""})),drop:9});
 if(num.length>=2)boxes.push({t:"Repères à connaître",ic:"hash",type:"rows",items:num,n:5,min:3,max:72,drop:6});
 const pieg=a4Mix(c.chap.map(ch=>ch.b.filter(b=>b.t==="pieges").flatMap(b=>b.items||[])));
 if(pieg.length)boxes.push({t:"Pièges à éviter",ic:"warn",tone:"warn",type:"list",items:pieg,n:4,min:2,max:110});
 const tests=a4Mix(c.chap.map(ch=>ch.b.filter(b=>b.t==="verif").flatMap(b=>b.items||[]))).filter(x=>a4QOk(x[0],null,x[1])).map(x=>[x[0],x[1]]);
 return {kind:"c",id:c.id,title:c.titre,kicker:`Fiche de révision · ${cat.nom}`,sub:first?a4Sent(first.ps[0])[0]:"",color:cat.c,
  icon:(typeof ICO!=="undefined"&&ICO[c.icon])||CAT_IC[c.cat]||"",ue:(c.ue&&c.ue[state.ueRef])||[],boxes,tests,link:`#cours/${c.id}`,linkT:"Lire le cours complet"};
}
function a4Patho(p){
 const S=SPE[p.s]||{nom:"Pathologie",c:"#EDC4C7"},L=a=>(a||[]).filter(Boolean);
 const boxes=[];
 if(p.r)boxes.push({t:"À retenir",ic:"star",tone:"key",type:"ess",items:a4Sent(p.r),n:5,min:2,max:150});
 if(p.m)boxes.push({t:"Le mécanisme",ic:"bulb",type:"text",items:[String(p.m).split("\n")[0]],n:1,min:1,max:300});
 if(p.a)boxes.push({t:"Pour comprendre",ic:"chat",tone:"info",type:"text",items:[p.a],n:1,min:1,max:200,drop:5});
 if(p.z&&typeof pmFig==="function"&&typeof PMAPS!=="undefined"&&PMAPS[p.z[0]]){const M=PMAPS[p.z[0]],zn=p.z.slice(1).map(k=>M.zones[k]).filter(Boolean);
  boxes.push({t:`Où ça se passe : ${M.titre}${zn.length?" · "+zn.join(", "):""}`,ic:"eye",type:"sch",html:()=>pmFig(p.z),drop:8});}
 if(L(p.c).length)boxes.push({t:"Causes et facteurs de risque",ic:"list",type:"list",items:L(p.c),n:4,min:2,max:105});
 if(L(p.sg).length)boxes.push({t:"Signes cliniques",ic:"eye",type:"list",items:L(p.sg),n:5,min:3,max:105});
 if(L(p.al).length)boxes.push({t:"Signes d'alerte",ic:"warn",tone:"warn",type:"list",items:L(p.al),n:3,min:1,max:120});
 if(L(p.ex).length)boxes.push({t:"Examens",ic:"flask",type:"rows",items:L(p.ex).map(x=>[x[0],x[1]]),n:4,min:2,max:70,drop:9});
 if(L(p.co).length)boxes.push({t:"Complications",ic:"warn",type:"list",items:L(p.co),n:4,min:2,max:95});
 if(L(p.tt).length)boxes.push({t:"Traitements",ic:"pill",type:"list",items:L(p.tt),n:4,min:2,max:115});
 if(L(p.ri).length)boxes.push({t:"Rôle infirmier",ic:"heart",tone:"ok",type:"list",items:L(p.ri),n:5,min:3,max:115});
 const tests=QUIZ.filter(q=>q.pid===p.i&&a4QOk(q.q,q.o,q.a)).map(q=>[q.q,q.o[q.a]]);
 return {kind:"p",id:p.i,title:p.n,kicker:`Pathologie · ${S.nom}`,sub:p.d,color:S.c,icon:(typeof ICO!=="undefined"&&ICO[SPE_ICO[p.s]])||CAT_IC.patho,
  ue:a4Ue(S.u),boxes,tests,link:`#patho/${p.i}`,linkT:"Lire la fiche complète"};
}
function a4Soin(o){
 const S=SO_SEC[o.s]||{nom:"Soins",cat:"soins"},boxes=[];
 if(o.et.length)boxes.push({t:"Les étapes clés",ic:"steps",tone:"key",type:"steps",items:o.et,n:9,min:5,max:105});
 if(o.ind.length)boxes.push({t:"Indications",ic:"target",type:"list",items:o.ind,n:3,min:1,max:100});
 if(o.ci.length)boxes.push({t:"Contre-indications et précautions",ic:"warn",type:"list",items:o.ci,n:3,min:1,max:105});
 if(o.mat.length)boxes.push({t:"Matériel",ic:"box",type:"chips",items:o.mat,n:10,min:5,max:42});
 if(o.surv.length)boxes.push({t:"Surveillance",ic:"eye",tone:"ok",type:"list",items:o.surv,n:4,min:2,max:110});
 if(o.ri.length)boxes.push({t:"Risques et complications",ic:"warn",type:"list",items:o.ri,n:3,min:1,max:95,drop:7});
 if(o.err.length)boxes.push({t:"Erreurs à éviter",ic:"warn",tone:"warn",type:"list",items:o.err,n:3,min:1,max:105});
 if(o.tr.length)boxes.push({t:"Traçabilité",ic:"pen",type:"list",items:o.tr,n:3,min:1,max:90,drop:6});
 if(o.r.length)boxes.push({t:"Cadre",ic:"shield",type:"list",items:o.r,n:2,min:1,max:130,drop:4});
 if(o.edu.length)boxes.push({t:"Éducation du patient",ic:"chat",type:"list",items:o.edu,n:2,min:1,max:105,drop:3});
 const tests=[...(o.cas&&o.cas.q?[o.cas]:[]),...o.q].filter(q=>a4QOk(q.q,q.o,q.a)&&q.o[q.a]).map(q=>[q.q,q.o[q.a]]);
 return {kind:"s",id:o.i,title:o.n,kicker:`Fiche de soin · ${S.nom}`,sub:o.d[0]||"",color:typeof SO_COL==="function"?SO_COL(o.s):CAT.soins.c,icon:CAT_IC[S.cat]||CAT_IC.soins,
  ue:a4Ue(S.u),boxes,tests,link:`#soin/${o.i}`,linkT:"Lire la fiche complète"};
}
function a4Med(o){
 const S=MD_SEC[o.s]||{nom:"Thérapeutiques"},boxes=[];
 if(o.r&&o.r.length)boxes.push({t:"À retenir",ic:"star",tone:"key",type:"ess",items:o.r,n:5,min:3,max:150});
 if(o.ma&&o.ma.length)boxes.push({t:"Mécanisme d'action",ic:"bulb",type:"text",items:[o.ma[0]],n:1,min:1,max:260});
 if(typeof mdHasSch==="function"&&mdHasSch(o))boxes.push({t:o.sch&&typeof SCH_T!=="undefined"&&SCH_T[o.sch.k]?SCH_T[o.sch.k][0]:"Le mécanisme en schéma",ic:"eye",type:"sch",html:()=>mdSch(o),drop:7});
 if(o.m&&o.m.length)boxes.push({t:"Molécules (noms commerciaux)",ic:"pill",type:"chips",items:o.m.map(x=>a4NoB(x.dci)+(x.br?` · ${x.br.split(",")[0].trim()}`:"")),n:8,min:4,max:44});
 if(o.ind&&o.ind.length)boxes.push({t:"Indications",ic:"target",type:"list",items:o.ind,n:4,min:2,max:100});
 if(o.ci&&o.ci.length)boxes.push({t:"Contre-indications",ic:"warn",type:"list",items:o.ci,n:3,min:1,max:105});
 if(o.v&&o.v.length)boxes.push({t:"Posologie et repères",ic:"hash",type:"list",items:o.v,n:2,min:1,max:130,drop:8});
 if(o.ef&&o.ef.length)boxes.push({t:"Effets indésirables",ic:"list",type:"list",items:o.ef,n:4,min:2,max:100});
 if(o.eg&&o.eg.length)boxes.push({t:"Effets graves : alerter",ic:"warn",tone:"warn",type:"list",items:o.eg,n:2,min:1,max:120});
 if(o.it&&o.it.length)boxes.push({t:"Interactions",ic:"warn",type:"list",items:o.it,n:2,min:1,max:110,drop:5});
 const surv=[...(o.sc||[]),...(o.sb||[])];
 if(surv.length)boxes.push({t:"Surveillance",ic:"eye",tone:"ok",type:"list",items:surv,n:4,min:2,max:105});
 if(o.edu&&o.edu.length)boxes.push({t:"Éducation du patient",ic:"chat",type:"list",items:o.edu,n:3,min:1,max:100,drop:6});
 if(o.err&&o.err.length)boxes.push({t:"Erreurs à éviter",ic:"warn",tone:"warn",type:"list",items:o.err,n:3,min:1,max:100,drop:9});
 const tests=(o.q||[]).filter(q=>a4QOk(q.q,q.o,q.a)&&q.o[q.a]).map(q=>[q.q,q.o[q.a]]);
 return {kind:"m",id:o.i,title:o.n,kicker:`Thérapeutiques · ${S.nom}`,sub:(o.d||[])[0]||"",color:typeof MD_COL==="function"?MD_COL(o.s):"#CFE3C3",
  icon:(typeof ICO!=="undefined"&&ICO[S.ico])||CAT_IC.thera,ue:a4Ue(S.u),boxes,tests,link:`#med/${o.i}`,linkT:"Lire la fiche complète"};
}
function a4Sheet(kind,id){
 try{
  if(kind==="c"){const c=COURS.find(x=>x.id===id&&x.chap);return c?a4Course(c):null;}
  if(kind==="p"){const p=PBY[id];return p?a4Patho(p):null;}
  if(kind==="s"){const o=SOBY[id];return o?a4Soin(o):null;}
  if(kind==="m"){const o=MDBY[id];return o?a4Med(o):null;}
 }catch(e){console.warn("Fiche A4",kind,id,e);}
 return null;
}

/* ---------- Rendu ---------- */
const a4Fs=L=>L<0?1+Math.min(-L,4)*.055:A4_FS[Math.min(L,A4_FS.length-1)];
const a4Lim=(b,L)=>Math.max(b.min||1,(b.n||99)-Math.floor(L/2));
const a4Gone=(b,L)=>b.drop!=null&&L>=b.drop;
function a4Box(b,L,print,o){
 if(print&&a4Gone(b,L)&&!(o&&o.keep))return "";
 const shrink=L>=9?.85:L<0?1.12:1,n=print?((o&&o.n)||a4Lim(b,L)):(b.n||99),mx=Math.round((b.max||120)*shrink);
 const items=(b.items||[]).slice(0,n),head=`<h2>${b.num?`<span class="a4-n">${b.num}</span>`:A4_IC[b.ic]||""}<span>${esc(b.t)}</span></h2>`;
 let body="";
 if(b.type==="ess")body=`<ol class="a4-ess">${items.map(x=>`<li>${md(a4B(x,mx))}</li>`).join("")}</ol>`;
 else if(b.type==="know")body=`<ul class="a4-know">${items.map(x=>`<li>${md(a4B(x,mx))}</li>`).join("")}</ul>`;
 else if(b.type==="steps")body=`<ol class="a4-steps">${items.map(x=>`<li>${md(a4B(x,mx))}</li>`).join("")}</ol>`;
 else if(b.type==="chips")body=`<div class="a4-chips">${items.map(x=>`<span>${md(a4B(x,mx))}</span>`).join("")}</div>`;
 else if(b.type==="rows")body=`<dl class="a4-rows">${items.map(x=>`<div><dt>${md(a4B(a4NoB(x[0]),40))}</dt><dd>${md(a4B(x[1],mx))}</dd></div>`).join("")}</dl>`;
 else if(b.type==="text")body=items.map(x=>`<p>${md(a4B(x,mx))}</p>`).join("");
 else if(b.type==="sch"){let h="";try{h=b.html();}catch(e){h="";}if(!h)return "";body=`<div class="a4-sch${print&&L>=4?" sm":""}">${h}</div>`;}
 else body=`<ul class="a4-ul">${items.map(x=>`<li>${md(a4B(x,mx))}</li>`).join("")}</ul>`;
 return `<section class="a4-b${b.tone?" a4-"+b.tone:""}${b.type==="sch"?" a4-bsch":""}">${head}${body}</section>`;
}
function a4Html(S,L,mode,ov){
 ov=ov||[];
 const print=mode==="print",fs=print?a4Fs(L):1;
 const nt=print?Math.max(2,4-Math.floor(L/4)):4,tests=S.tests.slice(0,nt),mq=L>=9?130:175;
 const ue=S.ue.length?`UE ${S.ue.join(" · ")}`:"";
 const testHtml=tests.length?(print
  ?`<section class="a4-test"><h2>${A4_IC.test}<span>Je me teste</span></h2><div class="a4-tq"><ol>${tests.map(t=>`<li>${md(a4B(t[0],mq))}</li>`).join("")}</ol>
    <div class="a4-ans" aria-label="Réponses"><b>Réponses</b><ol>${tests.map(t=>`<li>${md(a4B(t[1],mq))}</li>`).join("")}</ol></div></div></section>`
  :`<section class="a4-test"><h2>${A4_IC.test}<span>Je me teste</span></h2><ol class="a4-tl">${tests.map(t=>`<li><span>${md(a4B(t[0],150))}</span><details><summary>Voir la réponse</summary><p>${md(a4B(t[1],200))}</p></details></li>`).join("")}</ol></section>`):"";
 return `<article class="a4s ${print?"a4-print":"a4-screen"}" style="--c:${S.color};--fs:${fs}">
  <header class="a4-h"><span class="a4-ic" aria-hidden="true">${S.icon||A4_IC.book}</span>
   <div class="a4-ht"><span class="a4-k">${esc(S.kicker)}${ue?` · ${esc(ue)}`:""}</span><h1>${esc(S.title)}</h1>${S.sub?`<p class="a4-sub">${md(a4B(S.sub,print&&L>=6?150:210))}</p>`:""}</div>
   ${print?`<div class="a4-rev" aria-hidden="true"><b>Révisé</b><span><i></i>J+1</span><span><i></i>J+7</span><span><i></i>J+30</span></div>`:""}</header>
  <div class="a4-cols">${S.boxes.map((b,i)=>a4Box(b,L,print,ov[i])).join("")}</div>
  ${testHtml}
  <footer class="a4-f"><span>Carnet IFSI · fiche de révision</span><span>Contenu pédagogique : vérifiez avec vos cours et les protocoles de votre établissement.</span></footer>
 </article>`;
}
/* Cherche le niveau de détail le plus riche qui tient sur une page A4, puis rajoute un à un les éléments retirés
   au dernier palier tant que la page tient encore (la page est ainsi remplie sans déborder). */
function a4Fit(S){
 const key=S.kind+"/"+S.id+"/"+state.ueRef;if(A4_FIT[key])return A4_FIT[key];
 const m=document.createElement("div");m.className="a4-measure";m.setAttribute("aria-hidden","true");document.body.appendChild(m);
 const fits=(L,ov)=>{m.innerHTML=a4Html(S,L,"print",ov);const pg=m.firstElementChild;return !pg||pg.scrollHeight<=A4_H;};
 let L=A4_MINL;for(;L<A4_MAXL;L++)if(fits(L,[]))break;
 const ov=[];
 if(L>A4_MINL){const P=L-1;
  S.boxes.forEach((b,i)=>{if(b.type==="sch"&&a4Gone(b,L)&&!a4Gone(b,P)){ov[i]={keep:true};if(!fits(L,ov))delete ov[i];return;}
   if(a4Gone(b,L)&&!a4Gone(b,P)){ov[i]={keep:true,n:a4Lim(b,L)};if(!fits(L,ov)){delete ov[i];return;}}
   if(a4Gone(b,L)&&!ov[i])return;
   for(let n=a4Lim(b,P);n>a4Lim(b,L);n--){const keep=ov[i]&&ov[i].keep;ov[i]={n,keep};if(fits(L,ov))return;}
   if(ov[i]&&ov[i].keep)ov[i]={keep:true,n:a4Lim(b,L)};else delete ov[i];});}
 m.remove();return A4_FIT[key]={L,ov};
}
function a4Print(S){
 const F=a4Fit(S);let doc=document.getElementById("print-doc");if(doc)doc.remove();
 doc=document.createElement("div");doc.id="print-doc";doc.className="print-doc a4-doc";doc.innerHTML=a4Html(S,F.L,"print",F.ov);document.body.appendChild(doc);
 document.body.classList.add("printing");
 const done=()=>{document.body.classList.remove("printing");const d=document.getElementById("print-doc");d&&d.remove();};
 window.addEventListener("afterprint",done,{once:true});
 setTimeout(()=>{try{window.print();}catch(e){toast("Impression indisponible ici : ouvrez l'appli dans Safari ou Chrome");done();}},60);
}
/* Mise à l'échelle de l'aperçu A4 sur l'écran. */
function a4Scale(){const w=document.getElementById("a4-prev");if(!w)return;const pg=w.querySelector(".a4s");if(!pg)return;
 const s=Math.min(1,(w.clientWidth-36)/A4_W);pg.style.transform=`translate(18px,18px) scale(${s})`;w.style.height=Math.ceil(pg.offsetHeight*s+36)+"px";}
window.addEventListener("resize",()=>{clearTimeout(a4Scale.t);a4Scale.t=setTimeout(a4Scale,120);});

/* ---------- Vue « Fiche visuelle » ---------- */
const A4_KIND={c:"Cours",p:"Pathologie",s:"Soin",m:"Thérapeutiques"};
function vA4(arg){
 const [k,...r]=(arg||"").split("/"),id=r.join("/"),S=a4Sheet(k,id);
 if(!S)return notFound();
 const prev=state.a4Mode==="a4";
 if(prev)setTimeout(a4Scale,0);
 return `<div class="stack-lg a4-view">${backBtn("Retour")}
  <div class="a4-bar"><div class="seg a4-seg" role="group" aria-label="Affichage"><button data-act="a4-mode" data-k="fiche" aria-pressed="${!prev}">Fiche</button><button data-act="a4-mode" data-k="a4" aria-pressed="${prev}">Aperçu A4</button></div>
   <button class="btn a4-pbtn" data-act="a4-print" data-k="${k}" data-id="${esc(id)}">${A4_IC.print}<span>Imprimer</span></button></div>
  ${prev?`<div class="a4-prev" id="a4-prev">${(F=>a4Html(S,F.L,"print",F.ov))(a4Fit(S))}</div><p class="ot-hint">Aperçu de la page imprimée : le niveau de détail est ajusté pour tenir sur une feuille A4. À l'impression, choisissez « Enregistrer en PDF » pour garder la fiche.</p>`:a4Html(S,0,"screen")}
  <div class="list"><a class="li" href="${S.link}"><span class="ic tb-ic" style="--c:#2A5D85">${IC.book}</span><span><span class="t">${esc(S.linkT)}</span><span class="s">${esc(S.title)}</span></span>${chev}</a></div>
  <p class="disclaimer">Fiche générée à partir du contenu de l'appli, pour réviser vite. Elle ne remplace ni vos cours ni les protocoles de votre établissement.</p></div>`;
}
function a4Act(b,a){
 if(a==="a4-mode"){state.a4Mode=b.dataset.k;render();}
 else if(a==="a4-print"){const S=a4Sheet(b.dataset.k,b.dataset.id);if(S)a4Print(S);}
}
/* Bouton d'accès depuis un cours ou une fiche récap. */
const a4Cta=(k,id,sub)=>`<a class="a4-cta" href="#a4/${k}/${encodeURIComponent(id)}"><span class="a4-cta-ic">${A4_IC.grid}</span><span><b>Fiche visuelle · 1 page A4</b><small>${esc(sub||"L'essentiel pour réviser vite, à lire ou à imprimer")}</small></span>${A4_IC.print}</a>`;
/* Liste des fiches visuelles des cours d'une catégorie (Réviser › Fiches). */
const a4List=(L,col)=>L.length?`<div class="list a4-list"><div class="a4-lh">${A4_IC.grid}<span>Fiches visuelles des cours · 1 page A4</span></div>${L.map(x=>`<a class="li" href="#a4/c/${x.id}" style="--c:${col}"><span class="bar"></span><span><span class="t">${esc(x.titre)}</span><span class="s">L'essentiel du cours en une page, à imprimer</span></span><span class="end"><span class="tag a4-tag">A4</span>${chev}</span></a>`).join("")}</div>`:"";
