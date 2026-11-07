#!/usr/bin/env node
/* Carnet IFSI — métadonnées des contenus, à relancer après une modification des contenus :
     node scripts/contenus-meta.js
   1. www/js/contenus/maj.js : date de dernière modification de chaque contenu (d'après l'historique git
      du fichier qui le définit), affichée en bas de chaque fiche.
   2. docs/relecture/liste-contenus.csv : la liste de tous les contenus à faire relire, avec une priorité
      (1 = sécurité du patient : médicaments, calculs, urgences, transfusion, perfusions). */
const fs=require("fs"),vm=require("vm"),path=require("path"),{execSync}=require("child_process");
const ROOT=path.join(__dirname,".."),WWW=path.join(ROOT,"www");
const ctx={localStorage:{getItem:()=>null,setItem(){}},document:{addEventListener(){},getElementById(){return null}},window:{addEventListener(){}},navigator:{},matchMedia:()=>({matches:false}),console};
vm.createContext(ctx);
const html=fs.readFileSync(path.join(WWW,"index.html"),"utf8");
const files=[...html.matchAll(/src="(js\/[^"]+)"/g)].map(m=>m[1]).filter(f=>f.startsWith("js/contenus/")||/js\/(data|render)\.js$/.test(f));
const LISTS={f:["FICHES","id","titre"],c:["COURS","id","titre"],p:["PATHOS","i","n"],s:["SOINS","i","n"],m:["MEDS","i","n"]};
const owner={},seen={};
const snap=()=>{const out={};for(const [k,[arr,idk]] of Object.entries(LISTS)){let A;try{A=vm.runInContext(`typeof ${arr}!=="undefined"?${arr}:null`,ctx);}catch(e){A=null;}out[k]=A?A.map(x=>[x[idk],x]):[];}return out;};
for(const f of files){
 vm.runInContext(fs.readFileSync(path.join(WWW,f),"utf8").replace(/^const /gm,"var ").replace(/^let /gm,"var "),ctx,{filename:f});
 const S=snap();
 for(const [k,list] of Object.entries(S))for(const [id,obj] of list){const key=k+":"+id;if(seen[key]!==obj){seen[key]=obj;owner[key]=f;}}
}
const dateOf={};
for(const f of new Set(Object.values(owner))){let d="";try{d=execSync(`git log -1 --format=%cs -- "www/${f}"`,{cwd:ROOT}).toString().trim();}catch(e){}dateOf[f]=d||new Date().toISOString().slice(0,10);}
const byDate={};for(const [key,f] of Object.entries(owner))(byDate[dateOf[f]]=byDate[dateOf[f]]||[]).push(key);
const js=`/* Généré par scripts/contenus-meta.js — ne pas modifier à la main.
   Date de dernière modification de chaque contenu (f fiche, c cours, p pathologie, s soin, m médicament). */
const MAJ_D=${JSON.stringify(Object.fromEntries(Object.entries(byDate).sort().map(([d,l])=>[d,l.sort().join(" ")])),null,0).replace(/","/g,'",\n"')};
`;
fs.writeFileSync(path.join(WWW,"js/contenus/maj.js"),js);
/* Liste de relecture */
const S=snap(),rows=[["priorite","type","cle","titre","categorie","ue_2009","ue_2026","fichier","relu_par","date_relecture","remarques"]];
const TY={f:"fiche",c:"cours",p:"pathologie",s:"soin",m:"médicament"};
const prio=(k,o)=>{if(k==="m")return 1;if(k==="s")return ["med","perf","transf","urg","prel","diab"].includes(o.s)?1:2;if(k==="p")return o.s==="urg"?1:2;
 const cat=o.cat;if(cat==="calcul"||cat==="thera")return 1;if(["soins","patho","exam","situ"].includes(cat))return 2;return 3;};
for(const [k,list] of Object.entries(S))for(const [id,o] of list){const key=k+":"+id,ue=o.ue||{};
 rows.push([prio(k,o),TY[k],key,o[LISTS[k][2]]||"",o.cat||o.s||"",(ue["2009"]||[]).join(" "),(ue["2026"]||[]).join(" "),owner[key]||"","","",""]);}
rows.splice(1,rows.length,...rows.slice(1).sort((a,b)=>a[0]-b[0]||a[1].localeCompare(b[1])||String(a[3]).localeCompare(String(b[3]),"fr")));
const csv="﻿"+rows.map(r=>r.map(v=>{v=String(v);return /[";\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v;}).join(";")).join("\n")+"\n";
fs.mkdirSync(path.join(ROOT,"docs/relecture"),{recursive:true});
fs.writeFileSync(path.join(ROOT,"docs/relecture/liste-contenus.csv"),csv);
const n=rows.length-1,p1=rows.filter(r=>r[0]===1).length;
console.log(`maj.js : ${Object.keys(owner).length} contenus, ${Object.keys(byDate).length} dates · liste de relecture : ${n} contenus dont ${p1} en priorité 1`);
