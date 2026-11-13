#!/usr/bin/env node
/* Carnet IFSI — sépare les contenus gratuits et les contenus réservés aux abonnés.

   Les sources des contenus réservés sont dans contenus/ (hors du site publié) ; leur ordre de chargement
   est dans contenus/ordre.txt. Le script :
   1. charge tous les contenus dans une machine virtuelle, comme le ferait l'appli ;
   2. écrit dans www/js/contenus/ la version gratuite : fiches récap complètes, titres et sommaires de tous les
      cours, et un échantillon complet (un contenu par spécialité ou catégorie) ;
   3. écrit www/premium/pack.js : le reste, compressé (fflate) puis chiffré (tweetnacl secretbox) ; l'appli ne l'ouvre qu'avec la clé ;
   4. met à jour la liste des scripts de www/index.html et du service worker ;
   5. vérifie qu'une fois le paquet ouvert, les données sont identiques à celles des sources.

   Clé (32 octets en base64) :
     node scripts/premium.js --ouvert          phase de lancement : clé aléatoire écrite dans l'appli, tout est ouvert
     node scripts/premium.js --cle-fichier F    clé lue dans le fichier F (jamais dans le dépôt)
     PREMIUM_KEY=... node scripts/premium.js    clé lue dans la variable d'environnement
*/
const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');
const nacl=require('tweetnacl'),fflate=require('fflate');
const ROOT=path.join(__dirname,'..'),WWW=path.join(ROOT,'www'),SRC=path.join(ROOT,'contenus');
const args=process.argv.slice(2);

/* ---------- Clé ---------- */
let key,open=false;
if(args.includes('--ouvert')){key=crypto.randomBytes(32);open=true;}
else if(args.includes('--cle-fichier')){key=Buffer.from(fs.readFileSync(args[args.indexOf('--cle-fichier')+1],'utf8').trim(),'base64');}
else if(process.env.PREMIUM_KEY){key=Buffer.from(process.env.PREMIUM_KEY.trim(),'base64');}
else{console.error('Clé manquante : --ouvert, --cle-fichier F ou PREMIUM_KEY.');process.exit(1);}
if(key.length!==32){console.error('La clé doit faire 32 octets (base64).');process.exit(1);}
const kid=crypto.createHash('sha256').update(key).digest('hex').slice(0,12);

/* ---------- Chargement dans une machine virtuelle ---------- */
const ORDER=fs.readFileSync(path.join(SRC,'ordre.txt'),'utf8').split('\n').map(l=>l.trim()).filter(l=>l&&!l.startsWith('#'))
 .map(l=>{const [w,f]=l.split(':');return {w,f,file:w==='src'?path.join(SRC,f):path.join(WWW,f)};});
const mkctx=()=>{const c={console:{warn(){},log(){},error(){}},Date,Math,JSON,
 localStorage:{getItem:()=>null,setItem(){},removeItem(){}},location:{hash:''},navigator:{},matchMedia:()=>({matches:false})};
 c.window=c;vm.createContext(c);return c;};
const run=(c,code,name)=>vm.runInContext(code,c,{filename:name});
const G=(c,n)=>run(c,`typeof ${n}==="undefined"?undefined:${n}`,'get');
const ARR=['COURS','PATHOS','SOINS','MEDS','FICHES','QUIZ','FX','STAGES'];

/* 1. État complet, à partir des sources */
const full=mkctx();const contrib={};
const FREE_ARR=['FICHES','QUIZ','FX','STAGES'];
for(const e of ORDER){
 const before={},snap={};ARR.forEach(t=>{const a=G(full,t);before[t]=a?a.slice():null;if(a&&FREE_ARR.includes(t))snap[t]=a.map(x=>JSON.stringify(x));});const pk=new Set(Object.keys(G(full,'PIMG')||{}));
 run(full,fs.readFileSync(e.file,'utf8'),e.f);
 if(e.w!=='src')continue;
 const C=contrib[e.f]={};
 ARR.forEach(t=>{const a=G(full,t);if(!a)return;const b=before[t]||[],bs=new Set(b);const add=a.filter(x=>!bs.has(x)),rem=b.filter(x=>!a.includes(x));
  /* Fiches gratuites modifiées par une source (catégorie, contenu…) : on reproduit la modification à l'identique */
  if(FREE_ARR.includes(t)&&snap[t]){const mut=[];b.forEach((x,i)=>{if(a[i]===x){const j=JSON.stringify(x);if(j!==snap[t][i])mut.push([i,j]);}});if(mut.length)(C.MUT=C.MUT||[]).push([t,mut]);}
  if(!add.length&&!rem.length)return;
  if(t==='COURS'){C.COURS=true;return;}
  if(rem.length||a.indexOf(add[0])!==a.length-add.length)throw new Error(`${e.f} : ajout non final dans ${t}`);
  C[t]=FREE_ARR.includes(t)?add.map(x=>JSON.stringify(x)):add;});
 const P=G(full,'PIMG');if(P){const nk=Object.keys(P).filter(k=>!pk.has(k));if(nk.length)C.PIMG=nk;}
}
const S={};['COURS','PATHOS','SOINS','MEDS','FICHES','QUIZ','FX','STAGES','PIMG','SPES','SO_SECS','MD_SECS'].forEach(n=>S[n]=G(full,n));
const J=x=>JSON.parse(JSON.stringify(x));
/* Les fiches réservées doivent être de simples données (pas de fonction) */
const hasFn=(v,seen=new Set())=>{if(typeof v==='function')return true;if(!v||typeof v!=='object'||seen.has(v))return false;seen.add(v);return Object.values(v).some(x=>hasFn(x,seen));};
['COURS','PATHOS','SOINS','MEDS'].forEach(t=>S[t].forEach(r=>{if(hasFn(r))throw new Error(`${t} ${r.id||r.i} contient une fonction`);}));
if(hasFn(S.PIMG))throw new Error('PIMG contient une fonction');

/* ---------- Échantillon gratuit : un contenu complet par spécialité, section ou catégorie ---------- */
const firstBy=(L,k)=>{const m=new Map();L.forEach(r=>{if(!m.has(r[k]))m.set(r[k],r);});return new Set([...m.values()]);};
const sample={PATHOS:firstBy(S.PATHOS,'s'),SOINS:firstBy(S.SOINS,'s'),MEDS:firstBy(S.MEDS,'s'),COURS:firstBy(S.COURS.filter(c=>c.chap&&!c.pro),'cat')};

/* ---------- Version gratuite d'une fiche ---------- */
const blank=v=>Array.isArray(v)?[]:typeof v==='string'?'':v&&typeof v==='object'?null:v;
const strip=(r,keep)=>{const o={};for(const [k,v] of Object.entries(r)){if(v===undefined)continue;
 o[k]=k in keep?(keep[k]===true?J(v):Array.isArray(v)?J(v.slice(0,keep[k])):J(v)):blank(v);}o._l=1;return o;};
const KEEP={
 /* Fiche récap d'une pathologie : définition, alertes et l'essentiel de chaque rubrique */
 PATHOS:{i:true,s:true,n:true,zq:true,d:true,al:true,f:true,c:5,sg:6,ex:4,co:4,tt:4,ri:6},
 /* Fiche récap d'un soin : définition, matériel, étapes, surveillance, risques, erreurs, traçabilité */
 SOINS:{n:true,i:true,s:true,st:true,nn:true,f:true,d:1,mat:true,et:true,surv:5,ri:4,err:3,tr:3},
 /* Fiche récap d'une classe : la classe, mécanisme, médicaments, indications, effets graves, surveillance, CI, l'essentiel */
 MEDS:{n:true,i:true,s:true,nn:true,f:true,sch:true,d:1,ma:1,m:true,ind:4,eg:4,ef:4,sc:3,sb:2,ci:3,r:true}
};
const stubCours=c=>{const o={};for(const [k,v] of Object.entries(c)){if(v===undefined)continue;
 if(k==='chap')o.chap=(v||[]).map(ch=>({h:ch.h,chip:ch.chip}));
 else if(['id','cat','titre','duree','u','ue','icon','obj','pro','theme'].includes(k))o[k]=J(v);
 else o[k]=blank(v);}o._l=1;return o;};

const free={},pack={c:{},p:{},s:{},m:{},im:{}};
S.COURS.forEach(c=>{if(sample.COURS.has(c)||!c.chap){free[c.id]=J(c);}else{pack.c[c.id]=J(c);}});
const freeRec=(t,r)=>{if(sample[t].has(r))return J(r);pack[{PATHOS:'p',SOINS:'s',MEDS:'m'}[t]][r.i]=J(r);return strip(r,KEEP[t]);};
const sampleP=new Set([...sample.PATHOS].map(p=>p.i));
Object.keys(S.PIMG).forEach(k=>{if(!sampleP.has(k))pack.im[k]=J(S.PIMG[k]);});pack.imk=Object.keys(S.PIMG);

/* ---------- Écriture des fichiers gratuits ---------- */
const OUT=path.join(WWW,'js','contenus');
const HEAD=f=>`/* Carnet IFSI — ${f} : version publiée, générée par scripts/premium.js à partir de contenus/${f}.\n   Ne pas modifier : modifier la source, puis relancer le script. */\n`;
const js=x=>JSON.stringify(x);
const written=[];
const lastCours=Math.max(...ORDER.map((e,i)=>e.w==='src'&&contrib[e.f].COURS?i:-1));
const newOrder=[];
ORDER.forEach((e,i)=>{
 if(e.w==='www'){newOrder.push(e.f);}
 else{
  const C=contrib[e.f],parts=[];
  if(C.PATHOS)parts.push(`PA(\n${C.PATHOS.map(r=>js(freeRec('PATHOS',r))).join(',\n')}\n);`);
  if(C.SOINS)parts.push(`SOJ([\n${C.SOINS.map(r=>js(freeRec('SOINS',r))).join(',\n')}\n]);`);
  if(C.MEDS)parts.push(`MDJ([\n${C.MEDS.map(r=>js(freeRec('MEDS',r))).join(',\n')}\n]);`);
  if(C.PIMG){const ks=C.PIMG.filter(k=>sampleP.has(k));if(ks.length)parts.push(`IM(${js(Object.fromEntries(ks.map(k=>[k,S.PIMG[k]])))});`);}
  (C.MUT||[]).forEach(([t,L])=>L.forEach(([i,j])=>parts.push(`${t}[${i}]=${j};`)));
  FREE_ARR.forEach(t=>{if(C[t])parts.push(`${t}.push(\n${C[t].join(',\n')}\n);`);});
  if(parts.length){fs.writeFileSync(path.join(OUT,e.f),HEAD(e.f)+parts.join('\n')+'\n');newOrder.push('js/contenus/'+e.f);written.push(e.f);}
 }
 if(i===lastCours){
  const L=S.COURS.map(c=>free[c.id]||stubCours(c));
  fs.writeFileSync(path.join(OUT,'cours.js'),`/* Carnet IFSI — cours : version publiée, générée par scripts/premium.js à partir de contenus/ (cours-data.js, ue-c*, anat-c*, tfe-c*…).\n   Ne pas modifier : modifier les sources, puis relancer le script. */\nCOURS.push(\n${L.map(js).join(',\n')}\n);\n`);
  newOrder.push('js/contenus/cours.js');written.push('cours.js');
 }
});
/* Fichiers générés auparavant et devenus inutiles */
const keepNames=new Set(newOrder.map(f=>path.basename(f)));
ORDER.filter(e=>e.w==='src').forEach(e=>{const p=path.join(OUT,e.f);if(!keepNames.has(e.f)&&fs.existsSync(p))fs.unlinkSync(p);});

/* ---------- Paquet chiffré ---------- */
const plain=Buffer.from(fflate.zlibSync(new Uint8Array(Buffer.from(JSON.stringify(pack),'utf8')),{level:9}));
const nonce=crypto.randomBytes(24);
const box=nacl.secretbox(new Uint8Array(plain),new Uint8Array(nonce),new Uint8Array(key));
fs.mkdirSync(path.join(WWW,'premium'),{recursive:true});
fs.writeFileSync(path.join(WWW,'premium','pack.js'),`/* Carnet IFSI — contenus réservés aux abonnés, chiffrés (généré par scripts/premium.js). */\nvar PREM_KID=${js(kid)},PREM_PACK=${js(Buffer.concat([nonce,Buffer.from(box)]).toString('base64'))};\n`);
fs.writeFileSync(path.join(WWW,'js','premium-cle.js'),`/* Carnet IFSI — généré par scripts/premium.js.\n   Phase de lancement : la clé est fournie à tous (tout est ouvert). Sinon null : la clé vient du compte abonné. */\nvar PREM_OPEN=${open?js(key.toString('base64')):'null'},PREM_KID_APP=${js(kid)};\n`);

/* ---------- index.html et service worker ---------- */
const idx=path.join(WWW,'index.html');let html=fs.readFileSync(idx,'utf8');
const a=html.indexOf('<script src="js/data.js"></script>'),bTag='<script src="js/contenus/maj.js"></script>',b=html.indexOf(bTag);
if(a<0||b<0)throw new Error('index.html : bornes des contenus introuvables');
const tags=newOrder.map(f=>`<script src="${f}"></script>`);
tags.push('<script src="js/premium-cle.js"></script>','<script src="js/premium-boot.js"></script>');
html=html.slice(0,a)+tags.join('\n')+html.slice(b+bTag.length).replace(/\n<script src="js\/premium-cle\.js"><\/script>\n<script src="js\/premium-boot\.js"><\/script>/,'');
fs.writeFileSync(idx,html);
const swp=path.join(WWW,'sw.js');let sw=fs.readFileSync(swp,'utf8');
const all=[...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m=>m[1]);
sw=sw.replace(/\/\* SCRIPTS:début \*\/[\s\S]*?\/\* SCRIPTS:fin \*\//,`/* SCRIPTS:début */\n${all.map(s=>` "${s}",`).join('\n')}\n /* SCRIPTS:fin */`);
fs.writeFileSync(swp,sw);

/* ---------- Vérification ---------- */
const check=(withKey)=>{const c=mkctx();
 for(const f of newOrder)run(c,fs.readFileSync(path.join(WWW,f),'utf8'),f);
 if(withKey){const raw=Buffer.from(fs.readFileSync(path.join(WWW,'premium','pack.js'),'utf8').match(/PREM_PACK="([^"]+)"/)[1],'base64');
  const o=nacl.secretbox.open(new Uint8Array(raw.slice(24)),new Uint8Array(raw.slice(0,24)),new Uint8Array(key));if(!o)throw new Error('déchiffrement impossible');
  c.__P=JSON.parse(Buffer.from(fflate.unzlibSync(o)).toString('utf8'));
  run(c,fs.readFileSync(path.join(WWW,'js','premium-apply-core.js'),'utf8')+'\npremMerge(__P);','apply');}
 return c;};
const lock=check(false),unl=check(true);
const eq=(t,c)=>JSON.stringify(G(c,t))===JSON.stringify(S[t]);
const bad=['COURS','PATHOS','SOINS','MEDS','FICHES','QUIZ','FX','STAGES','PIMG'].filter(t=>!eq(t,unl));
['SOBY','MDBY'].forEach(t=>{const m=G(unl,t),a=G(unl,t==='SOBY'?'SOINS':'MEDS');if(Object.keys(m).length!==a.length||a.some(r=>m[r.i]!==r))bad.push(t);});
const nl=t=>G(lock,t).filter(r=>r._l).length;
const kb=f=>Math.round(fs.statSync(path.join(WWW,f)).size/1024);
console.log(`Clé ${kid}${open?' (phase ouverte)':''}`);
console.log(`Gratuit complet : ${sample.PATHOS.size} pathologies, ${sample.SOINS.size} soins, ${sample.MEDS.size} classes, ${sample.COURS.size} cours`);
console.log(`Réservé : ${nl('PATHOS')} pathologies, ${nl('SOINS')} soins, ${nl('MEDS')} classes, ${nl('COURS')} cours, ${Object.keys(pack.im).length} « comprendre en images »`);
console.log(`Fichiers générés : ${written.length} ; paquet ${kb('premium/pack.js')} Ko`);
if(bad.length){console.error('ÉCART après ouverture du paquet :',bad.join(', '));process.exit(2);}
console.log('Vérification : données identiques aux sources une fois le paquet ouvert.');
