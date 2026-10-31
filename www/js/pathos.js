/* Carnet IFSI — encyclopédie des pathologies : vues par spécialité, fiche récap et cours détaillé,
   schémas d'organes (zone atteinte en couleur), quiz générés et schémas à compléter. Chargé après render.js, avant app.js. */
const SPE=Object.fromEntries(SPES.map(([id,nom,c,u])=>[id,{id,nom,c,u}]));
const PBY=Object.fromEntries(PATHOS.map(p=>[p.i,p]));
const pathosOf=s=>PATHOS.filter(p=>p.s===s);
const progOf=s=>(PROGRAMME[s]||"").split("|").filter(Boolean);
const pxDone=()=>store.get("pxdone",[]);
const SPE_ICO={cardio:"heart",pneumo:"lungs",neuro:"brain",rhumato:"bone",pedia:"baby",ophtalmo:"eye",nephro:"bladder",hemato:"drop",infectio:"thermo",endoc:"scale",nutri:"scale",urg:"alert",onco:"tube",geria:"face",psy:"brain",gastro:"flask",chir:"tube"};

/* ---------- Schémas d'organes ---------- */
const PM_LAB=(x,y,t,on,a="start")=>tx(x,y,t,on?"st-acc st-b":"st-sub",a);
const pmCls=(on,kind)=>kind==="s"?(on?"s-acc":"s-ln"):(on?"f-coral":"f-soft");
const PMAPS={
 coeur:{titre:"Le cœur",zones:{od:"Oreillette droite",og:"Oreillette gauche",vd:"Ventricule droit",vg:"Ventricule gauche",aorte:"Aorte",ap:"Artère pulmonaire",valves:"Valves",coronaires:"Artères coronaires",pericarde:"Péricarde",myocarde:"Muscle cardiaque (myocarde)",conduction:"Système électrique",veines:"Veines caves"},
  pts:{od:[128,100],og:[192,100],vd:[128,152],vg:[192,156],aorte:[232,46],ap:[80,58],valves:[190,125],coronaires:[226,128],pericarde:[262,150],myocarde:[160,196],conduction:[118,90],veines:[98,34]},
  draw(h,num){const on=k=>h.includes(k),lb=!num;
   return sv(232,
    `<path d="M160 214 C 62 166, 52 98, 92 70 C 118 52, 148 58, 160 80 C 172 58, 202 52, 228 70 C 268 98, 258 166, 160 214 Z" class="${on("pericarde")?"s-acc":"s-ln"}" stroke-dasharray="5 4" fill="none" transform="translate(160 132) scale(1.1) translate(-160 -132)"/>`+
    `<path d="M160 206 C 70 160, 60 98, 96 74 C 120 58, 148 64, 160 84 C 172 64, 200 58, 224 74 C 260 98, 250 160, 160 206 Z" class="${on("myocarde")?"f-coral":"f-box"}"/>`+
    `<path d="M112 92 L 96 36" class="${pmCls(on("veines"),"s")}" stroke-width="7" stroke-linecap="round" fill="none"/>`+
    `<path d="M132 84 C 126 52, 100 44, 84 56" class="${pmCls(on("ap"),"s")}" stroke-width="8" stroke-linecap="round" fill="none"/>`+
    `<path d="M190 84 C 190 38, 244 30, 252 66" class="${pmCls(on("aorte"),"s")}" stroke-width="9" stroke-linecap="round" fill="none"/>`+
    `<rect x="106" y="86" width="46" height="34" rx="10" class="${pmCls(on("od"))}"/><rect x="168" y="86" width="46" height="34" rx="10" class="${pmCls(on("og"))}"/>`+
    `<rect x="106" y="128" width="46" height="46" rx="12" class="${pmCls(on("vd"))}"/><rect x="168" y="128" width="48" height="56" rx="14" class="${pmCls(on("vg"))}"/>`+
    `<path d="M112 124 H 146 M174 124 H 210 M184 82 H 198 M126 82 H 140" class="${on("valves")?"s-acc":"s-ln"}" stroke-width="3"/>`+
    `<path d="M196 88 C 238 104, 240 152, 210 188 M146 92 C 106 110, 104 150, 126 182" class="${on("coronaires")?"s-acc":"s-ln"}" fill="none" stroke-width="${on("coronaires")?3:1.5}"/>`+
    `<circle cx="118" cy="92" r="4.5" class="${on("conduction")?"f-acc":"f-sub"}"/><circle cx="160" cy="124" r="4" class="${on("conduction")?"f-acc":"f-sub"}"/><path d="M160 128 V 184" class="${on("conduction")?"s-acc":"s-ln"}" stroke-dasharray="${on("conduction")?"0":"3 3"}"/>`+
    (lb?PM_LAB(4,104,"Oreillette\ndroite",on("od"))+PM_LAB(316,104,"Oreillette\ngauche",on("og"),"end")+PM_LAB(4,156,"Ventricule\ndroit",on("vd"))+PM_LAB(316,162,"Ventricule\ngauche",on("vg"),"end")+PM_LAB(258,58,"Aorte",on("aorte"))+PM_LAB(40,48,"Artère\npulmonaire",on("ap"))+PM_LAB(104,24,"Veine cave",on("veines"))
     +(on("coronaires")?PM_LAB(232,206,"Coronaires",1):"")+(on("pericarde")?PM_LAB(270,214,"Péricarde",1,"end"):"")+(on("conduction")?PM_LAB(60,80,"Nœud sinusal",1):"")+(on("valves")?PM_LAB(160,226,"Valves",1,"middle"):"")+(on("myocarde")&&!on("valves")?PM_LAB(160,226,"Myocarde",1,"middle"):""):"")+
    (num?pmNums(this,num):""),"Schéma du cœur");}},
 poumons:{titre:"L'appareil respiratoire",zones:{larynx:"Larynx",trachee:"Trachée",bronches:"Bronches",poumons:"Poumons (tissu pulmonaire)",alveoles:"Alvéoles",plevre:"Plèvre",diaphragme:"Diaphragme",vaisseaux:"Vaisseaux pulmonaires"},
  pts:{larynx:[160,22],trachee:[160,56],bronches:[184,92],poumons:[100,140],alveoles:[218,168],plevre:[262,120],diaphragme:[160,212],vaisseaux:[140,116]},
  draw(h,num){const on=k=>h.includes(k),lb=!num;
   return sv(226,
    `<path d="M138 82 C 92 88, 64 142, 72 200 C 96 212, 132 206, 146 194 L 146 96 Z" class="${on("plevre")?"s-acc":"s-ln"}" fill="none" stroke-dasharray="5 4" transform="translate(110 145) scale(1.07) translate(-110 -145)"/>`+
    `<path d="M182 82 C 228 88, 256 142, 248 200 C 224 212, 188 206, 174 194 L 174 96 Z" class="${on("plevre")?"s-acc":"s-ln"}" fill="none" stroke-dasharray="5 4" transform="translate(210 145) scale(1.07) translate(-210 -145)"/>`+
    `<path d="M138 82 C 92 88, 64 142, 72 200 C 96 212, 132 206, 146 194 L 146 96 Z" class="${pmCls(on("poumons"))}"/><path d="M182 82 C 228 88, 256 142, 248 200 C 224 212, 188 206, 174 194 L 174 96 Z" class="${pmCls(on("poumons"))}"/>`+
    `<rect x="150" y="14" width="20" height="16" rx="6" class="${pmCls(on("larynx"))}"/><rect x="154" y="30" width="12" height="44" rx="5" class="${pmCls(on("trachee"))}"/>`+
    `<path d="M160 74 L 128 104 L 112 132 M160 74 L 192 104 L 208 132 M128 104 L 120 150 M192 104 L 200 150" class="${on("bronches")?"s-acc":"s-ln"}" stroke-width="${on("bronches")?4:3}" fill="none" stroke-linecap="round"/>`+
    `<path d="M160 104 C 140 112, 118 118, 96 120 M160 104 C 180 112, 202 118, 224 120" class="${on("vaisseaux")?"s-acc":"s-blue"}" fill="none" stroke-width="${on("vaisseaux")?3:1.5}"/>`+
    [[206,166],[216,160],[226,166],[211,176],[222,176],[100,170],[90,164],[96,180]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5" class="${on("alveoles")?"f-acc":"f-soft"}" stroke="currentColor" stroke-opacity=".2"/>`).join("")+
    `<path d="M64 210 C 120 192, 200 192, 256 210" class="${on("diaphragme")?"s-acc":"s-ln"}" stroke-width="${on("diaphragme")?3.5:2}" fill="none"/>`+
    (lb?PM_LAB(178,24,"Larynx",on("larynx"))+PM_LAB(176,52,"Trachée",on("trachee"))+PM_LAB(214,96,"Bronches",on("bronches"))+PM_LAB(4,120,"Poumon\ndroit",on("poumons"))+PM_LAB(316,96,"Poumon\ngauche",on("poumons"),"end")+PM_LAB(316,196,"Alvéoles",on("alveoles"),"end")+PM_LAB(160,224,"Diaphragme",on("diaphragme"),"middle")
     +(on("plevre")?PM_LAB(4,212,"Plèvre",1):"")+(on("vaisseaux")?PM_LAB(4,150,"Vaisseaux",1):""):"")+
    (num?pmNums(this,num):""),"Schéma de l'appareil respiratoire");}},
 jambe:{titre:"Les vaisseaux de la jambe",zones:{aorte:"Aorte abdominale",arteres:"Artères de la jambe",veinesp:"Veines profondes",veiness:"Veines superficielles (saphène)",mollet:"Mollet",pied:"Pied"},
  pts:{aorte:[160,18],arteres:[140,96],veinesp:[176,120],veiness:[198,150],mollet:[214,176],pied:[186,214]},
  draw(h,num){const on=k=>h.includes(k),lb=!num;
   return sv(230,
    `<path d="M128 26 C 122 70, 126 120, 134 160 C 138 186, 140 200, 138 212 L 196 218 C 196 210, 180 204, 178 196 C 186 160, 196 120, 194 70 L 192 26 Z" class="f-box"/>`+
    `<ellipse cx="180" cy="168" rx="22" ry="26" class="${on("mollet")?"f-coral":"f-soft"}" opacity=".85"/>`+
    `<path d="M138 210 L 198 218 L 206 226 L 136 222 Z" class="${pmCls(on("pied"))}"/>`+
    `<path d="M156 8 V 30 C 150 80, 146 130, 150 200" class="${on("arteres")?"s-acc":"s-ln"}" stroke-width="${on("arteres")?4:2.5}" fill="none" stroke-linecap="round"/>`+
    `<path d="M156 8 V 28" class="${on("aorte")?"s-acc":"s-ln"}" stroke-width="7" stroke-linecap="round"/>`+
    `<path d="M168 30 C 166 80, 164 130, 166 200" class="${on("veinesp")?"s-acc":"s-blue"}" stroke-width="${on("veinesp")?4:2.5}" fill="none" stroke-linecap="round"/>`+
    `<path d="M186 30 C 192 90, 200 130, 192 200" class="${on("veiness")?"s-acc":"s-blue"}" stroke-width="${on("veiness")?3.5:1.8}" fill="none" stroke-dasharray="${on("veiness")?"0":"4 3"}"/>`+
    (lb?PM_LAB(170,14,"Aorte",on("aorte"))+PM_LAB(4,96,"Artère\nfémorale",on("arteres"))+PM_LAB(4,150,"Veines\nprofondes",on("veinesp"))+PM_LAB(316,96,"Veine\nsaphène",on("veiness"),"end")+PM_LAB(316,170,"Mollet",on("mollet"),"end")+PM_LAB(220,224,"Pied",on("pied")):"")+
    (num?pmNums(this,num):""),"Schéma des vaisseaux de la jambe");}}
};
function pmNums(map,keys){return keys.map((k,i)=>{const [x,y]=map.pts[k]||[0,0];return `<circle cx="${x}" cy="${y}" r="9" class="f-acc"/><text x="${x}" y="${y+4}" text-anchor="middle" style="fill:#fff;font-weight:700;font-size:11px">${i+1}</text>`;}).join("");}
function pmFig(z,cap){const m=PMAPS[z[0]];if(!m)return "";const zs=z.slice(1);
 return `<figure class="sch-fig"><div class="sch-head"><span class="sch-kick">Où ça se passe</span><strong>${esc(m.titre)}</strong><small>${zs.map(k=>m.zones[k]).filter(Boolean).map(esc).join(" · ")}</small></div>${m.draw(zs)}${cap?`<figcaption>${md(cap)}</figcaption>`:""}</figure>`;}

/* ---------- Vues ---------- */
const pmd=s=>md(String(s||""));
function pxCard(){
 const tot=SPES.reduce((n,[s])=>n+progOf(s).length,0);
 return `<a class="px-card" href="#pathos"><span class="px-card-ic">${ICO.heart}</span><span><b>Pathologies par spécialité</b><small>${PATHOS.length} cours rédigés sur ${tot} · fiche récap, cours détaillé, schéma, quiz</small></span>${chev}</a>`;
}
function vPathos(arg){
 if(arg&&SPE[arg])return vSpe(arg);
 const tot=SPES.reduce((n,[s])=>n+progOf(s).length,0),done=pxDone().filter(id=>PBY[id]).length;
 return `<div class="stack-lg">${backBtn("Réviser")}
  ${vh("Réviser","Pathologies par spécialité",`${PATHOS.length} pathologies rédigées sur ${tot} au programme, ${done} étudiée${done>1?"s":""}. Chacune a une fiche récap, un cours détaillé avec schéma et des questions.`)}
  <button class="search-pill" data-act="nav" data-h="recherche">${IC.search}Rechercher une pathologie…</button>
  <div class="px-spes">${SPES.map(([s,nom,c])=>{const n=pathosOf(s).length,t=progOf(s).length;return `<a class="px-spe${n?"":" off"}" href="#pathos/${s}" style="--c:${c}"><span class="px-dot"></span><b>${esc(nom)}</b><small>${n?`${n} / ${t} rédigées`:`${t} au programme · bientôt`}</small>${n?`<span class="px-bar"><i style="width:${Math.round(n/t*100)}%"></i></span>`:""}</a>`}).join("")}</div>
  <a class="list" href="#entrainer/schemas"><span class="li"><span class="ic">${IC.bolt}</span><span><span class="t">Schémas à compléter et à remettre dans l'ordre</span><span class="s">Dans S'entraîner › Schémas</span></span>${chev}</span></a></div>`;
}
function vSpe(s){
 const S=SPE[s],list=progOf(s),q=fold(state.pxq||""),byName=Object.fromEntries(pathosOf(s).map(p=>[p.n,p])),dn=pxDone();
 const extra=pathosOf(s).filter(p=>!list.includes(p.n)).map(p=>p.n);
 const rows=[...list,...extra].filter(n=>!q||fold(n).includes(q));
 const nq=QUIZ.filter(x=>x.spe===s).length,exos=PEXOS.filter(e=>e.spe.includes(s));
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
 const qs=QUIZ.filter(q=>q.pid===id),same=pathosOf(p.s),k=same.indexOf(p),next=same[k+1];
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
 {id:"crise",spe:["pneumo"],titre:"La crise d'asthme",q:"Remettez dans l'ordre les étapes d'une crise d'asthme.",steps:["Contact avec un déclencheur (allergène, virus, froid)","Contraction du muscle des bronches et gonflement de la muqueuse","Sécrétion de mucus épais","L'air sort difficilement : sifflements à l'expiration","Le bronchodilatateur relâche le muscle : l'air passe à nouveau"]}
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
 const groups=[["cardio","Cardiologie"],["pneumo","Pneumologie"]];
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
 const sp=SPES.filter(([s])=>QUIZ.some(q=>q.spe===s));if(!sp.length)return "";
 return `<section class="stack-sm"><div class="section-title"><h2>Pathologies par spécialité</h2><a href="#pathos">Les cours</a></div>
  <div class="chips wrapchips">${sp.map(([s,nom,c])=>`<button class="chip" style="--c:${c}" data-act="px-quiz" data-k="${s}"><i></i>${esc(nom)} · ${QUIZ.filter(q=>q.spe===s).length}</button>`).join("")}</div>
  <a class="list" href="#entrainer/schemas"><span class="li"><span class="ic acc">${IC.bolt}</span><span><span class="t">Schémas à compléter</span><span class="s">${PEXOS.length} exercices : schémas d'organes et étapes à remettre dans l'ordre</span></span>${chev}</span></a></section>`;
}

/* ---------- Actions ---------- */
function pathoAct(b,a){const k=b.dataset.k;
 if(a==="px-mode"){state.pxMode=k;render();const t=document.querySelector(".px-head");if(t)t.scrollIntoView();return;}
 if(a==="px-quiz"){launchQuiz(QUIZ.map((q,i)=>i).filter(i=>QUIZ[i].spe===k).sort(()=>Math.random()-.5).slice(0,20),"Quiz "+SPE[k].nom);return;}
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
function pxIdx(){return PATHOS.map(p=>({t:"p",it:{id:p.i,titre:p.n,cat:"patho",theme:SPE[p.s].nom},txt:plainTxt([p.d,p.m,(p.c||[]).join(" "),(p.sg||[]).join(" "),(p.tt||[]).join(" "),(p.ri||[]).join(" "),p.r].join(" "))}));}
pxMakeQuiz();
