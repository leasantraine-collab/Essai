/* Carnet IFSI — rendu des fiches, cours et schémas SVG. */
/* ---------- Rendu des fiches détaillées ---------- */
const md=s=>esc(s).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/==(.+?)==/g,'<span class="acc">$1</span>');
const SVG={
 check:'<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
 warn:'<svg viewBox="0 0 24 24"><path d="M12 3.5L2.5 20h19z"/><path d="M12 10v4.5M12 17.3v.01"/></svg>',
 info:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.7v.01"/></svg>',
 redo:'<svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4h4"/></svg>',
 heart:'<svg viewBox="0 0 24 24"><path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 3c0 5.4-7.5 10-7.5 10z"/><path d="M6 12h3l1.5-2.5 2 4.5 1.5-2h4"/></svg>',
 arrow:'<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
};
/* Icônes de couverture : trait blanc + accent */
const ICO={
 heart:`<svg viewBox="0 0 100 100"><path d="M50 84S12 62 12 36a19 19 0 0 1 38-6 19 19 0 0 1 38 6c0 26-38 48-38 48z" stroke="#fff"/><path d="M4 48h28l6-10 8 22 8-30 6 18h36" stroke="#E0866C"/></svg>`,
 gauge:`<svg viewBox="0 0 100 100"><circle cx="40" cy="42" r="30" stroke="#fff"/><path d="M40 42l14-14" stroke="#E0866C"/><circle cx="40" cy="42" r="3" fill="#E0866C" stroke="#E0866C"/><path d="M40 16v6M18 42h6M56 42h6M22 25l4 4" stroke="#A9BCD0"/><path d="M40 72c4 10 18 8 26 6" stroke="#fff"/><ellipse cx="78" cy="76" rx="12" ry="9" stroke="#fff"/></svg>`,
 lungs:`<svg viewBox="0 0 100 100"><path d="M50 12v34M50 40c-6 4-12 6-16 4" stroke="#E0866C"/><path d="M50 40c6 4 12 6 16 4" stroke="#E0866C"/><path d="M36 30C20 34 12 56 14 76c1 8 10 10 18 6l10-6V46c0-8-2-16-6-16zM64 30c16 4 24 26 22 46-1 8-10 10-18 6l-10-6V46c0-8 2-16 6-16z" stroke="#fff"/></svg>`,
 drop:`<svg viewBox="0 0 100 100"><path d="M50 10C38 30 24 44 24 62a26 26 0 0 0 52 0c0-18-14-32-26-52z" stroke="#fff"/><path d="M38 64a12 12 0 0 0 12 12" stroke="#E0866C"/></svg>`,
 thermo:`<svg viewBox="0 0 100 100"><path d="M42 58V18a8 8 0 0 1 16 0v40a16 16 0 1 1-16 0z" stroke="#fff"/><path d="M50 30v40" stroke="#E0866C"/><circle cx="50" cy="72" r="6" fill="#E0866C" stroke="#E0866C"/><path d="M66 22h10M66 34h10M66 46h10" stroke="#A9BCD0"/></svg>`,
 finger:`<svg viewBox="0 0 100 100"><rect x="22" y="34" width="56" height="32" rx="12" stroke="#fff"/><path d="M8 50h20" stroke="#fff"/><path d="M38 50h8l4-8 6 16 4-8h8" stroke="#E0866C"/></svg>`,
 flask:`<svg viewBox="0 0 100 100"><path d="M38 10h24M42 10v24L20 78a8 8 0 0 0 7 12h46a8 8 0 0 0 7-12L58 34V10" stroke="#fff"/><path d="M28 66h44" stroke="#E0866C"/></svg>`,
 face:`<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="36" stroke="#fff"/><path d="M36 42v2M64 42v2" stroke="#fff"/><path d="M36 70c8-8 20-8 28 0" stroke="#E0866C"/></svg>`,
 eye:`<svg viewBox="0 0 100 100"><path d="M8 50s16-26 42-26 42 26 42 26-16 26-42 26S8 50 8 50z" stroke="#fff"/><circle cx="50" cy="50" r="12" stroke="#E0866C"/><circle cx="50" cy="50" r="3" fill="#E0866C" stroke="#E0866C"/></svg>`,
 tube:`<svg viewBox="0 0 100 100"><path d="M40 8h20M44 8v68a6 6 0 0 0 12 0V8" stroke="#fff"/><path d="M44 48h12v28a6 6 0 0 1-12 0z" fill="#E0866C" stroke="#E0866C"/><path d="M70 30h14M70 44h14M70 58h14" stroke="#A9BCD0"/></svg>`,
 alert:`<svg viewBox="0 0 100 100"><path d="M50 12L8 86h84z" stroke="#fff"/><path d="M50 40v22M50 72v1" stroke="#E0866C"/></svg>`,
 scale:`<svg viewBox="0 0 100 100"><rect x="16" y="20" width="68" height="64" rx="14" stroke="#fff"/><path d="M34 44a18 18 0 0 1 32 0" stroke="#fff"/><path d="M50 46l8-10" stroke="#E0866C"/></svg>`,
 bladder:`<svg viewBox="0 0 100 100"><path d="M30 10c0 16 6 22 6 22M70 10c0 16-6 22-6 22" stroke="#A9BCD0"/><path d="M30 34h40c6 0 10 6 10 14 0 18-14 30-30 30S20 66 20 48c0-8 4-14 10-14z" stroke="#fff"/><path d="M50 78v14" stroke="#E0866C"/><path d="M32 54h36" stroke="#E0866C"/></svg>`
};
const head=s=>s.h?`<div class="fx-h">${s.n?`<span class="fx-n">${s.n}</span>`:""}<h3>${md(s.h)}</h3></div>${s.sub?`<p class="fx-subh">${md(s.sub)}</p>`:""}`:"";
const WAVE=`<svg class="fx-wave" viewBox="0 0 300 46" preserveAspectRatio="none"><path d="M0 30h40l5-9 6 20 6-26 5 15h56l5-9 6 20 6-26 5 15h56l5-9 6 20 6-26 5 15h43"/></svg>`;
function fxSection(s){
 switch(s.t){
  case "def": return `<section class="stack-sm">${head(s)}<p class="fx-lead">${md(s.txt)}</p>${s.wave?WAVE:""}</section>`;
  case "text": return `<section class="stack-sm">${head(s)}${s.ps.map(p=>`<p>${md(p)}</p>`).join("")}</section>`;
  case "duo": return `${s.h?`<section class="stack-sm">${head(s)}`:""}<div class="fx-duo">${s.items.map(i=>`<div class="fx-card"><span class="fx-tag t-${i.tone||"coral"}">${esc(i.tag)}</span><span>${md(i.txt)}</span>${i.sub?`<small>${md(i.sub)}</small>`:""}</div>`).join("")}</div>${s.h?"</section>":""}`;
  case "valeurs": return `<div class="fx-card">${head(s)}<div>${s.rows.map(r=>`<div class="fx-row"><i class="bar t-${r[3]}"></i><div><b class="lab t-${r[3]}">${esc(r[0])}</b><span class="desc">${md(r[1])}</span></div><span class="val">${md(r[2])}</span></div>`).join("")}</div>${s.note?`<div class="fx-note">${md(s.note)}</div>`:""}</div>`;
  case "big": return `<div class="fx-card">${head(s)}<div class="fx-big"><div><b class="c-coral">${esc(s.a)}</b><small class="c-coral">${esc(s.la)}</small></div><span class="sl">/</span><div><b class="c-blue">${esc(s.b)}</b><small class="c-blue">${esc(s.lb)}</small></div><span class="u">${esc(s.unit)}</span></div>${s.note?`<div class="fx-note">${md(s.note)}</div>`:""}</div>`;
  case "etapes": return `<div class="fx-card ${s.light?"":"fx-dark"}">${head(s)}<ol class="fx-steps">${s.items.map(i=>`<li><span>${md(i)}</span></li>`).join("")}</ol></div>`;
  case "signes": return `<div class="fx-card"><div class="fx-sig-head"><span class="fx-sig-ico">${SVG[s.ico||"heart"]}</span><div><span class="e">${s.n?s.n+" · ":""}${esc(s.e||"À rechercher")}</span><div class="fx-h"><h3>${md(s.h)}</h3></div></div></div><ul class="fx-dots ${s.one?"one":""}">${s.items.map(i=>`<li>${md(i)}</li>`).join("")}</ul></div>`;
  case "trace": return `<div class="fx-card">${head(s)}<ul class="fx-checks">${s.items.map(i=>`<li>${SVG.check}<span>${md(i)}</span></li>`).join("")}</ul>${s.note?`<span class="muted">${md(s.note)}</span>`:""}</div>`;
  case "liste": return `<div class="fx-card">${head(s)}<ul class="fx-dots ${s.two?"":"one"}">${s.items.map(i=>`<li>${md(i)}</li>`).join("")}</ul></div>`;
  case "cols": return `<div class="fx-card">${head(s)}<div class="fx-cols">${s.cols.map(c=>`<div><h4 class="lab t-${c.tone||"blue"}" style="color:var(--fx-${c.tone==="coral"?"coral":c.tone==="green"?"green":c.tone==="amber"?"amber-ink":"blue"})">${esc(c.h)}</h4><ul class="fx-dots one">${c.items.map(i=>`<li>${md(i)}</li>`).join("")}</ul></div>`).join("")}</div></div>`;
  case "table": return `<div class="fx-card">${head(s)}<div class="fx-tbl">${s.rows.map(r=>`<span>${md(r[0])}</span><span>${md(r[1])}</span>`).join("")}</div>${s.note?`<div class="fx-note">${md(s.note)}</div>`:""}</div>`;
  case "schema": return `<section class="stack-sm">${head(s)}${schFig(s.k,s.cap)}</section>`;
  case "info": return `<div class="fx-info ${s.blue?"blue":""}">${SVG[s.ico||"info"]}<span>${md(s.txt)}</span></div>`;
  case "retenir": return `<div class="fx-warn"><h3>${SVG.warn}${esc(s.h||"À retenir")}</h3><p>${md(s.txt)}</p></div>`;
 }
 return "";
}
function fxRender(f){
 const cat=CAT[f.cat],N=f.pages.length+1;
 const chips=f.pages.flat().filter(s=>s.n&&s.h).map(s=>`<div class="fx-chip"><b>${esc(s.n)}</b>${esc(s.chip||s.h.replace(/\*\*|==/g,""))}</div>`).join("");
 const cover=`<article class="fx-page fx-cover" aria-label="Couverture">
  <div class="fx-icon" aria-hidden="true">${ICO[f.icon]||ICO.heart}</div>
  <span class="fx-eyebrow" style="--c:${cat.c}"><i></i>${esc(cat.nom)}</span>
  <h1>${esc(f.titre)}</h1>
  <div class="fx-chips">${chips}</div>
  <span class="fx-swipe">Glissez pour lire la fiche ${SVG.arrow}</span></article>`;
 const pages=f.pages.map((p,i)=>`<article class="fx-page" aria-label="Page ${i+2} sur ${N}">
  <div class="fx-head"><span class="k">${esc(cat.nom)}</span><h2>${esc(f.titre)} <span>· ${i+2}/${N}</span></h2></div>
  ${p.map(fxSection).join("")}</article>`).join("");
 return `<div class="fx"><div class="fx-track" id="fx-track" tabindex="0" aria-label="Pages de la fiche">${cover}${pages}</div>
  <div class="fx-nav"><div class="fx-pips" id="fx-pips">${Array.from({length:N},(_,i)=>`<i class="${i?"":"on"}"></i>`).join("")}</div>
  <div class="fx-arrows"><button id="fx-prev" disabled aria-label="Page précédente">←</button><button id="fx-next" aria-label="Page suivante">Suivant →</button></div></div></div>`;
}
function fxBind(){
 const t=document.getElementById("fx-track");if(!t)return;
 const pips=[...document.querySelectorAll("#fx-pips i")],prev=document.getElementById("fx-prev"),next=document.getElementById("fx-next");
 const idx=()=>Math.round(t.scrollLeft/(t.clientWidth+12));
 const upd=()=>{const i=idx();pips.forEach((p,k)=>p.classList.toggle("on",k===i));prev.disabled=i===0;next.disabled=i>=pips.length-1;next.textContent=i>=pips.length-1?"Fin":"Suivant →";};
 const go=d=>{const i=Math.max(0,Math.min(pips.length-1,idx()+d));t.scrollTo({left:i*(t.clientWidth+12),behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});};
 t.addEventListener("scroll",()=>requestAnimationFrame(upd),{passive:true});
 prev.onclick=()=>go(-1);next.onclick=()=>go(1);
 t.addEventListener("keydown",e=>{if(e.key==="ArrowRight")go(1);if(e.key==="ArrowLeft")go(-1);});
 upd();
}


/* ---------- Schémas dessinés (SVG, couleurs du thème) ---------- */
const sv=(h,body,label)=>`<svg class="sch" viewBox="0 0 320 ${h}" role="img" aria-label="${esc(label)}">${body}</svg>`;
const tx=(x,y,s,c="",a="start")=>`<text x="${x}" y="${y}" class="${c}" text-anchor="${a}">${s.split("\n").map((l,i)=>`<tspan x="${x}" dy="${i?13:0}">${esc(l)}</tspan>`).join("")}</text>`;
const bx=(x,y,w,h,l,c="f-box")=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" class="${c}"/>`+tx(x+w/2,y+h/2-(l.split("\n").length-1)*6.5+4,l,c==="f-box"?"st-b":"st-b st-dark","middle");
const ar=(x1,y1,x2,y2,c="s-ln")=>{const a=Math.atan2(y2-y1,x2-x1),L=7;const p=(d)=>`${x2-L*Math.cos(a+d)},${y2-L*Math.sin(a+d)}`;
 return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${c}"/><polygon points="${x2},${y2} ${p(.45)} ${p(-.45)}" class="${c==="s-acc"?"f-acc":"f-sub"}"/>`;};
const dash=(x1,y1,x2,y2,c="s-ln")=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${c}" stroke-dasharray="5 4"/>`;
const SCH={
 adme:()=>sv(260,
  bx(8,40,92,40,"Prise orale")+ar(100,60,114,60)+bx(116,40,92,40,"Tube digestif\nAbsorption","f-blue")+ar(208,60,222,60)+bx(224,40,90,40,"Sang\nDistribution","f-green")+
  tx(269,14,"Voie IV : directement","st-sub","middle")+tx(269,27,"dans le sang","st-sub","middle")+ar(269,30,269,40,"s-acc")+
  ar(162,80,162,128)+tx(168,124,"1er passage","st-acc")+
  ar(240,80,90,128)+ar(269,80,269,128)+
  bx(8,130,108,40,"Organes cibles\nEffet")+bx(124,130,80,40,"Foie\nMétabolisme","f-amber")+bx(214,130,100,40,"Rein\nÉlimination","f-coral")+
  ar(164,170,164,198)+tx(164,214,"Bile, selles","st-sub","middle")+ar(264,170,264,198)+tx(264,214,"Urines","st-sub","middle")+
  tx(160,232,"Voie orale : une partie est transformée par le foie\navant d'atteindre le sang (effet de 1er passage)","st-sub","middle"),
  "Trajet d'un médicament : absorption, distribution, métabolisme par le foie, élimination par le rein"),
 fenetre:()=>sv(210,
  `<rect x="40" y="52" width="270" height="66" class="f-green" opacity=".35"/>`+
  `<line x1="40" y1="180" x2="312" y2="180" class="s-ln"/><line x1="40" y1="180" x2="40" y2="20" class="s-ln"/>`+
  dash(40,52,312,52,"s-acc")+tx(310,46,"Seuil toxique","st-acc","end")+
  dash(40,118,312,118,"s-blue")+tx(310,132,"Seuil d'efficacité","st-blue","end")+
  tx(176,90,"Zone thérapeutique","st-green st-b","middle")+
  `<path d="M42 178 C 66 50, 96 56, 130 88 S 230 150, 300 160" class="s-acc"/>`+
  `<circle cx="88" cy="74" r="4" class="f-acc"/>`+tx(82,72,"Pic","st-b","end")+
  `<circle cx="300" cy="160" r="4" class="f-acc"/>`+tx(296,174,"Résiduel","st-b","end")+
  tx(176,198,"Temps après l'administration","st-sub","middle")+`<text x="14" y="100" class="st-sub" transform="rotate(-90 14 100)" text-anchor="middle">Concentration</text>`,
  "Courbe de concentration avec seuil d'efficacité, seuil toxique et zone thérapeutique"),
 paliers:()=>sv(200,
  `<rect x="20" y="130" width="90" height="50" rx="6" class="f-green"/><rect x="115" y="90" width="90" height="90" rx="6" class="f-amber"/><rect x="210" y="45" width="95" height="135" rx="6" class="f-coral"/>`+
  tx(65,150,"Palier 1","st-b st-dark","middle")+tx(65,165,"paracétamol, AINS","st-dark","middle")+
  tx(160,110,"Palier 2","st-b st-dark","middle")+tx(160,125,"opioïdes faibles","st-dark","middle")+tx(160,140,"tramadol, codéine","st-dark","middle")+
  tx(257,65,"Palier 3","st-b st-dark","middle")+tx(257,80,"opioïdes forts","st-dark","middle")+tx(257,95,"morphine,","st-dark","middle")+tx(257,108,"oxycodone","st-dark","middle")+
  ar(20,115,190,30,"s-acc")+tx(30,40,"Intensité de la douleur","st-acc st-b")+tx(160,196,"On monte d'un palier si la douleur persiste","st-sub","middle"),
  "Les trois paliers de l'OMS"),
 eva:()=>sv(110,
  `<defs><linearGradient id="g-eva" x1="0" x2="1"><stop offset="0" stop-color="#9CC7B5"/><stop offset=".5" stop-color="#F2C27B"/><stop offset="1" stop-color="#E0937A"/></linearGradient></defs>`+
  `<rect x="20" y="30" width="280" height="22" rx="11" fill="url(#g-eva)"/>`+
  Array.from({length:11},(_,i)=>`<line x1="${20+i*28}" y1="56" x2="${20+i*28}" y2="62" class="s-ln"/>`+tx(20+i*28,76,String(i),"st-b","middle")).join("")+
  tx(20,18,"Pas de douleur","st-sub")+tx(300,18,"Douleur maximale","st-sub","end")+tx(160,100,"Traitement souvent indiqué à partir de 4/10, selon protocole","st-sub","middle"),
  "Échelle de 0 à 10"),
 inr:()=>sv(130,
  `<rect x="20" y="40" width="70" height="26" class="f-blue"/><rect x="90" y="40" width="70" height="26" class="f-green"/><rect x="160" y="40" width="140" height="26" class="f-coral"/>`+
  [1,2,3,4,5].map((v,i)=>`<line x1="${20+i*70}" y1="66" x2="${20+i*70}" y2="74" class="s-ln"/>`+tx(20+i*70,88,String(v),"st-b","middle")).join("")+
  tx(55,30,"Caillot","st-blue","middle")+tx(125,30,"Cible 2–3","st-green st-b","middle")+tx(230,30,"Risque hémorragique","st-acc","middle")+
  tx(160,110,"Valve mécanique : cible souvent plus haute (2,5–3,5)","st-sub","middle")+tx(160,124,"INR","st-sub","middle"),
  "Échelle de l'INR sous AVK"),
 insuline:()=>{const X=h=>36+h*11.25;const bump=t=>`<path d="M${X(t)} 160 C ${X(t)+8} 70, ${X(t)+16} 70, ${X(t)+32} 160" class="s-acc"/>`;
  return sv(215,`<line x1="36" y1="160" x2="308" y2="160" class="s-ln"/><line x1="36" y1="160" x2="36" y2="30" class="s-ln"/>`+
  `<path d="M36 140 C 60 136, 280 136, 306 140" class="s-blue"/>`+tx(42,112,"Lente :\nfond sur 24 h","st-blue")+
  bump(8)+bump(12)+bump(19)+tx(X(13.5),60,"Rapides : couvrent chaque repas","st-acc","middle")+
  [0,6,12,18,24].map(h=>tx(X(h),176,h+" h","st-sub","middle")).join("")+
  [[8,"Matin"],[12,"Midi"],[19,"Soir"]].map(([h,l])=>`<circle cx="${X(h)}" cy="160" r="3.5" class="f-sub"/>`+tx(X(h),196,l,"st-b","middle")).join("")+
  `<text x="14" y="100" class="st-sub" transform="rotate(-90 14 100)" text-anchor="middle">Effet</text>`,"Profil d'action des insulines rapides et lentes sur 24 heures");},
 sites:()=>sv(280,
  `<circle cx="110" cy="30" r="18" class="s-body"/>`+`<line x1="110" y1="48" x2="110" y2="56" class="s-body" stroke-width="10"/>`+
  `<rect x="78" y="56" width="64" height="104" rx="18" class="s-body"/>`+
  `<line x1="80" y1="66" x2="56" y2="150" class="s-body" stroke-width="16"/><line x1="140" y1="66" x2="164" y2="150" class="s-body" stroke-width="16"/>`+
  `<line x1="96" y1="160" x2="92" y2="255" class="s-body" stroke-width="20"/><line x1="124" y1="160" x2="128" y2="255" class="s-body" stroke-width="20"/>`+
  `<ellipse cx="110" cy="128" rx="24" ry="17" class="f-coral" opacity=".9"/>`+
  `<ellipse cx="68" cy="100" rx="9" ry="20" class="f-blue"/><ellipse cx="152" cy="100" rx="9" ry="20" class="f-blue"/>`+
  `<ellipse cx="93" cy="195" rx="10" ry="22" class="f-amber"/><ellipse cx="127" cy="195" rx="10" ry="22" class="f-amber"/>`+
  dash(160,100,196,70)+tx(200,66,"Bras (face externe)","st-b")+tx(200,80,"absorption intermédiaire","st-sub")+
  dash(134,128,196,128)+tx(200,124,"Abdomen","st-b")+tx(200,138,"absorption la plus rapide","st-sub")+
  dash(137,195,196,195)+tx(200,191,"Cuisses","st-b")+tx(200,205,"absorption plus lente","st-sub")+
  tx(200,236,"Fesses : possible aussi","st-sub")+tx(200,252,"Changer de point\nà chaque fois","st-acc st-b"),
  "Sites d'injection sous-cutanée de l'insuline"),
 nephron:()=>sv(240,
  `<circle cx="46" cy="52" r="20" class="f-soft s-ln"/>`+tx(46,92,"Glomérule","st-b","middle")+tx(46,105,"filtration","st-sub","middle")+
  `<path d="M66 52 C 80 40, 90 66, 104 52 S 122 44, 126 58 L 140 196 C 142 214, 168 214, 170 196 L 182 70 C 186 54, 196 66, 202 54 S 212 46, 216 54" class="s-tube"/>`+
  `<path d="M222 40 L 222 218" class="s-tube"/>`+ar(222,200,222,226)+tx(230,236,"Urines","st-sub")+
  tx(96,30,"Tube proximal","st-sub","middle")+tx(210,36,"Tube distal","st-sub","middle")+tx(155,230,"Anse de Henle","st-sub","middle")+
  `<circle cx="175" cy="160" r="6" class="f-acc"/>`+tx(128,164,"Furosémide","st-acc st-b","end")+
  `<circle cx="208" cy="52" r="6" class="f-amber"/>`+tx(312,84,"Thiazidiques","st-amber st-b","end")+dash(212,58,262,76)+
  `<circle cx="222" cy="140" r="6" class="f-blue"/>`+tx(232,144,"Spironolactone","st-blue st-b"),
  "Néphron et sites d'action des diurétiques"),
 nadir:()=>{const X=d=>40+d*9.4;return sv(220,`<line x1="40" y1="170" x2="310" y2="170" class="s-ln"/><line x1="40" y1="170" x2="40" y2="24" class="s-ln"/>`+
  dash(40,52,310,52,"s-green")+tx(308,46,"Taux normal","st-green","end")+
  dash(40,140,310,140,"s-acc")+tx(308,156,"Neutropénie sévère","st-acc","end")+
  `<path d="M${X(0)} 52 C ${X(5)} 52, ${X(7)} 158, ${X(10)} 158 S ${X(17)} 52, ${X(22)} 52 L ${X(28)} 52" class="s-blue"/>`+
  `<circle cx="${X(10)}" cy="158" r="4.5" class="f-acc"/>`+tx(X(10),115,"Nadir","st-acc st-b","middle")+tx(X(10),128,"vers J7–J14","st-acc","middle")+
  [0,7,14,21,28].map(d=>tx(X(d),186,"J"+d,"st-sub","middle")).join("")+
  ar(X(0),16,X(0),40,"s-acc")+tx(X(0)+6,18,"Cure","st-b")+ar(X(21),16,X(21),40,"s-acc")+tx(X(21)+6,18,"Cure suivante","st-b")+
  tx(175,208,"Globules blancs (neutrophiles) après une cure","st-sub","middle"),"Courbe des neutrophiles après chimiothérapie avec le nadir");},
 pac:()=>sv(220,
  `<rect x="0" y="70" width="320" height="150" class="f-soft"/>`+`<line x1="0" y1="70" x2="320" y2="70" class="s-skin"/>`+tx(8,62,"Peau","st-sub")+
  `<rect x="96" y="88" width="78" height="44" rx="10" class="f-box"/><ellipse cx="135" cy="90" rx="26" ry="5" class="f-blue"/>`+tx(135,150,"Boîtier sous la peau","st-b","middle")+tx(135,163,"avec son septum","st-sub","middle")+
  `<path d="M120 22 L 150 22 L 150 34 L 140 34 L 140 82 L 136 92 L 132 82 L 132 34 L 120 34 Z" class="f-acc"/>`+tx(160,26,"Aiguille de Huber","st-acc st-b")+tx(160,40,"(coudée, non traumatique)","st-sub")+
  `<path d="M174 112 C 220 112, 250 110, 288 92" class="s-tube" stroke-width="5"/>`+tx(210,128,"Cathéter","st-b")+
  `<rect x="284" y="74" width="26" height="146" rx="12" class="f-blue" opacity=".7"/>`+tx(297,62,"Veine","st-b","middle")+
  tx(140,200,"Extrémité du cathéter :\nveine cave supérieure","st-sub","middle"),
  "Chambre implantable : boîtier sous la peau, aiguille de Huber et cathéter dans la veine")
};
const SCH_T={
 adme:["Le parcours du médicament dans le corps","Absorption, distribution, métabolisme, élimination"],
 fenetre:["La fenêtre thérapeutique","Concentration du médicament dans le sang au cours du temps"],
 paliers:["Les trois paliers antalgiques de l'OMS","Du moins puissant au plus puissant"],
 eva:["L'échelle numérique de la douleur","De 0 (aucune douleur) à 10 (douleur maximale)"],
 inr:["L'INR sous AVK","Zone cible et risques de part et d'autre"],
 insuline:["Le profil d'action des insulines","Insuline lente et insulines rapides sur 24 heures"],
 sites:["Les sites d'injection sous-cutanée","Où injecter l'insuline ou une HBPM"],
 nephron:["Le néphron et les diurétiques","Où agit chaque famille de diurétiques dans le rein"],
 nadir:["Le nadir après une chimiothérapie","Évolution des globules blancs entre deux cures"],
 pac:["La chambre implantable","Vue en coupe sous la peau"],
 coeur:["La circulation dans le cœur","Cœur droit, cœur gauche et sens du sang"],
 artere:["De l'artère saine à l'infarctus","Coupe d'une artère coronaire"],
 bronche:["La bronche dans l'asthme et la BPCO","Coupe d'une bronche dans trois situations"],
 avc:["Les deux types d'AVC","Ischémique (caillot) ou hémorragique (saignement)"],
 pouls:["Les sites de prise du pouls","Sur une silhouette de face"],
 brassard:["Mesurer la tension artérielle","Position du patient et du brassard"],
 oxymetre:["L'oxymètre de pouls","Mesure de la saturation au doigt"],
 urines:["La couleur des urines","Ce que l'aspect peut signaler"],
 pupilles:["Les pupilles","Taille, symétrie et signification"],
 tubes:["L'ordre de prélèvement des tubes","Du premier au dernier tube à remplir"],
 circuit:["Le circuit du médicament","De la prescription à la surveillance"],
 visages:["L'échelle des visages","Auto-évaluation de la douleur chez l'enfant"],
 thrombose:["De la phlébite à l'embolie pulmonaire","Trajet d'un caillot depuis le mollet"],
 fistule:["La fistule artério-veineuse","Accès pour l'hémodialyse, au bras"],
 abcd:["L'évaluation ABCD","Ordre de priorité face à une détresse vitale"],
 peau:["La profondeur des brûlures","Couches de la peau et degrés de brûlure"],
 wallace:["La règle des 9 de Wallace","Estimer la surface brûlée chez l'adulte"],
 platre:["Surveiller un membre plâtré","Ce qu'on vérifie sur les doigts"],
 occlusion:["L'occlusion intestinale","L'intestin de part et d'autre de l'obstacle"],
 cycle:["La démarche de soins","Un cycle en cinq étapes"],
 chaine:["La chaîne de transmission des infections","Six maillons : en rompre un suffit"],
 perfuseur:["Le perfuseur par gravité","Les éléments pour régler un débit en gouttes"],
 alveole:["Les échanges gazeux","Entre l'alvéole pulmonaire et le capillaire sanguin"]
};
const schFig=(k,cap)=>{if(!SCH[k])return "";const t=SCH_T[k];
 return `<figure class="sch-fig">${t?`<header class="sch-head"><span class="sch-kick">Schéma</span><strong>${esc(t[0])}</strong>${t[1]?`<small>${esc(t[1])}</small>`:""}</header>`:""}${SCH[k]()}${cap?`<figcaption>${md(cap)}</figcaption>`:""}</figure>`;};


Object.assign(SCH,{
 coeur:()=>sv(300,
  bx(110,8,100,34,"Poumons","f-soft")+bx(110,260,100,34,"Organes","f-soft")+
  `<rect x="60" y="80" width="90" height="62" rx="10" class="f-blue"/><rect x="60" y="148" width="90" height="78" rx="10" class="f-blue"/>`+
  `<rect x="170" y="80" width="90" height="62" rx="10" class="f-coral"/><rect x="170" y="148" width="90" height="78" rx="10" class="f-coral"/>`+
  tx(105,108,"Oreillette\ndroite","st-b st-dark","middle")+tx(105,182,"Ventricule\ndroit","st-b st-dark","middle")+
  tx(215,108,"Oreillette\ngauche","st-b st-dark","middle")+tx(215,182,"Ventricule\ngauche","st-b st-dark","middle")+
  tx(105,72,"CŒUR DROIT","st-blue st-b","middle")+tx(215,72,"CŒUR GAUCHE","st-acc st-b","middle")+
  `<path d="M150 205 L160 205 L160 50" class="s-blue"/>`+ar(160,60,160,44,"s-blue")+
  `<path d="M212 26 C 244 26, 248 52, 236 72" class="s-acc"/>`+ar(238,66,234,78,"s-acc")+
  `<path d="M260 205 C 300 205, 300 277, 222 277" class="s-acc"/>`+ar(230,277,212,277,"s-acc")+tx(306,248,"Aorte","st-sub","end")+
  `<path d="M108 277 C 22 277, 22 111, 52 111" class="s-blue"/>`+ar(46,111,60,111,"s-blue")+tx(8,200,"Veines\ncaves","st-sub")
  ,"Circulation dans le cœur droit et le cœur gauche"),
 artere:()=>{const c=(x,lbl,sub,inner)=>`<circle cx="${x}" cy="70" r="38" class="f-coral"/><circle cx="${x}" cy="70" r="28" class="f-soft"/>${inner}`+tx(x,130,lbl,"st-b","middle")+tx(x,144,sub,"st-sub","middle");
  return sv(165,
  c(55,"Artère saine","circulation libre",`<circle cx="55" cy="70" r="26" class="f-acc" opacity=".55"/>`)+
  c(160,"Plaque","rétrécie : angor",`<path d="M132 70 A28 28 0 0 1 188 70 Z" class="f-amber"/><path d="M140 70 A20 14 0 0 0 180 70 Z" class="f-acc" opacity=".55"/>`)+
  c(265,"Plaque + caillot","bouchée : infarctus",`<path d="M237 70 A28 28 0 0 1 293 70 Z" class="f-amber"/><path d="M240 72 A25 22 0 0 0 290 72 Z" class="f-sub" opacity=".8"/>`),
  "Coupe d'une artère saine, rétrécie par une plaque, puis bouchée par un caillot");},
 bronche:()=>{const ring=(x,wall,lumen)=>`<circle cx="${x}" cy="72" r="${wall}" class="f-coral" opacity=".75"/><circle cx="${x}" cy="72" r="${lumen}" class="f-soft"/>`;
  return sv(175,
  ring(55,36,26)+tx(55,132,"Bronche normale","st-b","middle")+tx(55,146,"paroi fine","st-sub","middle")+
  ring(160,40,14)+`<circle cx="160" cy="72" r="40" class="s-acc" fill="none" stroke-dasharray="3 3"/><ellipse cx="166" cy="76" rx="6" ry="4" class="f-amber"/>`+tx(160,132,"Asthme (crise)","st-b","middle")+tx(160,146,"bronche resserrée","st-sub","middle")+tx(160,160,"réversible","st-green","middle")+
  ring(265,40,18)+`<ellipse cx="258" cy="70" rx="9" ry="6" class="f-amber"/><ellipse cx="272" cy="78" rx="6" ry="4" class="f-amber"/>`+tx(265,132,"BPCO","st-b","middle")+tx(265,146,"paroi épaisse","st-sub","middle")+tx(265,160,"permanente","st-acc","middle")+
  `<ellipse cx="292" cy="18" rx="6" ry="4" class="f-amber"/>`+tx(284,22,"mucus","st-sub","end"),
  "Coupe d'une bronche normale, en crise d'asthme et dans la BPCO");},
 avc:()=>{const brain=x=>`<ellipse cx="${x}" cy="70" rx="62" ry="48" class="f-soft s-ln"/><path d="M${x} 24 C ${x-6} 50, ${x+6} 80, ${x} 116" class="s-ln"/>`;
  return sv(185,
  brain(80)+`<path d="M40 120 C 50 96, 66 82, 92 70 S 112 58, 120 48" class="s-tube" stroke-width="6"/><circle cx="92" cy="70" r="7" class="f-sub"/><ellipse cx="108" cy="54" rx="22" ry="16" class="f-blue" opacity=".75"/>`+
  tx(80,140,"AVC ischémique","st-b","middle")+tx(80,154,"un caillot bouche l'artère","st-sub","middle")+tx(80,168,"≈ 80 % des cas","st-blue st-b","middle")+
  brain(240)+`<path d="M200 120 C 210 96, 226 82, 252 70 S 272 58, 280 48" class="s-tube" stroke-width="6"/><circle cx="262" cy="62" r="18" class="f-acc" opacity=".85"/>`+
  tx(240,140,"AVC hémorragique","st-b","middle")+tx(240,154,"une artère se rompt et saigne","st-sub","middle")+tx(240,168,"≈ 20 % des cas","st-acc st-b","middle")+
  tx(160,12,"Seule l'imagerie (scanner, IRM) permet de les distinguer","st-sub","middle"),
  "AVC ischémique et AVC hémorragique");}
});


/* ---------- Schémas, série 3 ---------- */
const body=(cx)=>`<circle cx="${cx}" cy="30" r="17" class="s-body"/><line x1="${cx}" y1="47" x2="${cx}" y2="56" class="s-body" stroke-width="10"/>`+
 `<rect x="${cx-32}" y="56" width="64" height="104" rx="18" class="s-body"/>`+
 `<line x1="${cx-30}" y1="66" x2="${cx-54}" y2="150" class="s-body" stroke-width="15"/><line x1="${cx+30}" y1="66" x2="${cx+54}" y2="150" class="s-body" stroke-width="15"/>`+
 `<line x1="${cx-14}" y1="160" x2="${cx-18}" y2="262" class="s-body" stroke-width="19"/><line x1="${cx+14}" y1="160" x2="${cx+18}" y2="262" class="s-body" stroke-width="19"/>`+
 `<ellipse cx="${cx-22}" cy="266" rx="12" ry="5" class="s-body"/><ellipse cx="${cx+22}" cy="266" rx="12" ry="5" class="s-body"/>`;
const pt=(x,y)=>`<circle cx="${x}" cy="${y}" r="5.5" class="f-acc"/><circle cx="${x}" cy="${y}" r="9" class="s-acc" stroke-width="1.5" opacity=".5"/>`;
const eye=(x,pr,lbl,sub,pr2)=>`<path d="M${x-34} 50 Q ${x} 18, ${x+34} 50 Q ${x} 82, ${x-34} 50 Z" class="f-box"/><circle cx="${x}" cy="50" r="17" class="f-blue"/><circle cx="${x}" cy="50" r="${pr}" fill="#1C2733"/>`+tx(x,100,lbl,"st-b","middle")+tx(x,114,sub,"st-sub","middle");
Object.assign(SCH,{
 pouls:()=>sv(290,body(160)+
  pt(160,52)+dash(150,52,70,40)+tx(66,36,"Carotidien","st-b","end")+tx(66,49,"urgence","st-sub","end")+
  pt(140,104)+dash(134,104,70,92)+tx(66,90,"Huméral","st-b","end")+tx(66,103,"pli du coude","st-sub","end")+
  pt(110,146)+dash(104,146,70,146)+tx(66,144,"Radial","st-b","end")+tx(66,157,"routine","st-sub","end")+
  pt(180,82)+dash(186,82,236,62)+tx(240,58,"Apical","st-b")+tx(240,71,"pointe du cœur","st-sub")+
  pt(172,168)+dash(178,168,236,150)+tx(240,146,"Fémoral","st-b")+tx(240,159,"pli de l'aine","st-sub")+
  pt(182,262)+dash(188,260,236,238)+tx(240,234,"Pédieux","st-b")+tx(240,247,"dessus du pied","st-sub"),
  "Les sites de prise du pouls sur une silhouette"),
 brassard:()=>sv(200,
  `<rect x="0" y="122" width="320" height="10" rx="4" class="f-soft"/><line x1="40" y1="132" x2="40" y2="196" class="s-ln"/><line x1="280" y1="132" x2="280" y2="196" class="s-ln"/>`+tx(160,160,"bras posé sur un support","st-sub","middle")+
  `<line x1="30" y1="110" x2="270" y2="110" class="s-body" stroke-width="22"/><circle cx="282" cy="108" r="13" class="s-body"/>`+
  dash(10,110,316,110,"s-acc")+tx(316,90,"hauteur du cœur","st-acc st-b","end")+
  `<rect x="70" y="92" width="76" height="36" rx="9" class="f-amber"/>`+tx(108,114,"brassard","st-b st-dark","middle")+
  `<path d="M108 92 C 108 60, 130 52, 152 52" class="s-ln" stroke-width="2.5"/><circle cx="172" cy="46" r="20" class="f-box"/><path d="M172 46 l9 -10" class="s-acc"/>`+tx(200,34,"tensiomètre","st-sub")+
  tx(108,146,"2 cm au-dessus du pli du coude","st-sub","middle")+tx(12,30,"Patient assis, dos appuyé,","st-sub")+tx(12,44,"jambes décroisées, sans parler","st-sub"),
  "Mesure de la tension : brassard sur le bras soutenu à hauteur du cœur"),
 oxymetre:()=>sv(170,
  `<path d="M10 92 L 190 92 C 230 92, 236 60, 210 56 L 10 56 Z" class="s-body" fill-opacity="1"/><path d="M196 58 C 206 60, 214 66, 214 74" class="s-ln"/>`+
  `<rect x="150" y="34" width="84" height="22" rx="8" class="f-blue"/><rect x="150" y="92" width="84" height="22" rx="8" class="f-blue"/>`+
  `<line x1="176" y1="58" x2="176" y2="90" class="s-acc" stroke-dasharray="3 3"/><line x1="192" y1="58" x2="192" y2="90" class="s-acc" stroke-dasharray="3 3"/>`+
  tx(130,24,"Le capteur fait passer une lumière à travers le doigt","st-sub","middle")+
  `<rect x="226" y="118" width="88" height="46" rx="8" class="f-box"/>`+tx(240,146,"98 %","st-b")+`<path d="M276 146 l6 0 3 -8 4 14 3 -6 8 0" class="s-acc" stroke-width="2"/>`+
  tx(12,124,"Doigt propre et chaud","st-b")+tx(12,138,"sans vernis","st-sub")+tx(12,154,"Courbe de pouls régulière = valeur fiable","st-acc"),
  "Oxymètre de pouls sur un doigt"),
 urines:()=>{const jar=(x,col,l,s,dots)=>`<path d="M${x-18} 30 h36 v60 a10 10 0 0 1 -10 10 h-16 a10 10 0 0 1 -10 -10 z" fill="${col}" class="s-ln"/><rect x="${x-20}" y="22" width="40" height="9" rx="3" class="f-sub"/>${dots?`<circle cx="${x-6}" cy="62" r="2.5" fill="#fff"/><circle cx="${x+5}" cy="74" r="2" fill="#fff"/><circle cx="${x-2}" cy="86" r="2.5" fill="#fff"/>`:""}`+tx(x,120,l,"st-b","middle")+tx(x,134,s,"st-sub","middle");
  return sv(150,jar(32,"#F5EDB8","Clair","normal")+jar(95,"#EBC55A","Foncé","peu d'eau")+jar(158,"#C9873A","Ambré","déshydraté")+jar(221,"#C8574A","Rouge","sang ?")+jar(284,"#D9C97E","Trouble","infection ?",true),"Couleurs des urines et leur signification");},
 pupilles:()=>sv(130,eye(38,6,"Normale","réactive")+eye(112,2.5,"Myosis","petite")+eye(186,13,"Mydriase","dilatée")+
  `<path d="M232 50 Q 250 34, 268 50 Q 250 66, 232 50 Z" class="f-box"/><circle cx="250" cy="50" r="9" class="f-blue"/><circle cx="250" cy="50" r="2.5" fill="#1C2733"/>`+
  `<path d="M274 50 Q 292 34, 310 50 Q 292 66, 274 50 Z" class="f-box"/><circle cx="292" cy="50" r="9" class="f-blue"/><circle cx="292" cy="50" r="7" fill="#1C2733"/>`+
  tx(271,100,"Anisocorie","st-acc st-b","middle")+tx(271,114,"inégales : alerte","st-acc","middle"),
  "Taille des pupilles : normale, myosis, mydriase, anisocorie"),
 tubes:()=>{const t=(x,cap,n,l)=>`<rect x="${x-9}" y="34" width="18" height="70" rx="9" class="f-box"/><rect x="${x-11}" y="24" width="22" height="14" rx="4" fill="${cap}"/>`+tx(x,18,String(n),"st-b","middle")+tx(x,122,l,"st-sub","middle");
  return sv(150,`<path d="M18 40 h28 v58 a8 8 0 0 1 -8 8 h-12 a8 8 0 0 1 -8 -8 z" class="f-box"/><rect x="20" y="28" width="24" height="12" rx="3" fill="#6E8BA8"/><rect x="50" y="40" width="20" height="58" rx="7" class="f-box"/><rect x="51" y="28" width="18" height="12" rx="3" fill="#9C6EA8"/>`+tx(44,18,"1","st-b","middle")+tx(44,122,"Hémocultures","st-sub","middle")+
   t(102,"#5B9BD5",2,"Citrate")+t(146,"#D9534F",3,"Sec")+t(190,"#5CA86A",4,"Héparine")+t(234,"#8E5BB5",5,"EDTA")+t(278,"#9AA3AB",6,"Fluorure")+
   tx(160,142,"Coagulation · Biochimie · Biochimie · NFS · Glycémie","st-sub","middle"),"Ordre de prélèvement des tubes");},
 circuit:()=>sv(230,
  bx(110,8,100,40,"Prescription\nmédecin","f-blue")+bx(214,92,100,40,"Dispensation\npharmacien","f-green")+bx(110,178,100,40,"Administration\ninfirmier","f-amber")+bx(6,92,100,40,"Surveillance\ninfirmier","f-coral")+
  `<path d="M212 34 C 250 40, 262 60, 264 88" class="s-ln"/>`+ar(264,80,264,90)+
  `<path d="M264 134 C 262 164, 248 190, 214 198" class="s-ln"/>`+ar(222,196,212,198)+
  `<path d="M108 198 C 70 192, 58 166, 56 136" class="s-ln"/>`+ar(56,144,56,134)+
  `<path d="M56 90 C 58 60, 72 38, 108 30" class="s-ln"/>`+ar(100,32,110,30)+
  tx(160,108,"L'infirmier est","st-sub","middle")+tx(160,122,"le dernier verrou","st-acc st-b","middle")+tx(16,78,"réévaluation","st-sub"),
  "Le circuit du médicament"),
 visages:()=>{const f=(x,mouth,col,n)=>`<circle cx="${x}" cy="48" r="22" fill="${col}"/><circle cx="${x-8}" cy="42" r="2.6" fill="#1C2733"/><circle cx="${x+8}" cy="42" r="2.6" fill="#1C2733"/><path d="${mouth}" stroke="#1C2733" stroke-width="2.4" fill="none" stroke-linecap="round"/>`+tx(x,90,String(n),"st-b","middle");
  const xs=[30,82,134,186,238,290],c=["#9CC7B5","#B9CFA0","#E3D08A","#F2C27B","#E9A98A","#E0937A"];
  const m=[x=>`M${x-9} 54 Q ${x} 64, ${x+9} 54`,x=>`M${x-9} 56 Q ${x} 62, ${x+9} 56`,x=>`M${x-9} 58 L ${x+9} 58`,x=>`M${x-9} 60 Q ${x} 55, ${x+9} 60`,x=>`M${x-9} 62 Q ${x} 52, ${x+9} 62`,x=>`M${x-9} 64 Q ${x} 50, ${x+9} 64`];
  return sv(120,xs.map((x,i)=>f(x,m[i](x),c[i],i*2)).join("")+tx(30,110,"Pas mal","st-sub","middle")+tx(290,110,"Très mal","st-sub","middle"),"Échelle de visages de 0 à 10");},
 thrombose:()=>sv(260,
  `<path d="M120 30 C 96 30, 86 58, 92 90 C 98 120, 112 120, 112 120" class="f-blue" opacity=".6"/><path d="M200 30 C 224 30, 234 58, 228 90 C 222 120, 208 120, 208 120" class="f-blue" opacity=".6"/>`+tx(160,20,"Poumons","st-b","middle")+
  `<path d="M70 150 L 66 240 L 98 240 L 100 150 Z" class="s-body"/><path d="M84 150 L 82 236" class="s-tube" stroke-width="5"/>`+
  `<ellipse cx="83" cy="206" rx="7" ry="14" fill="#7A2E24"/>`+tx(100,214,"Caillot dans une veine","st-b")+tx(100,228,"du mollet : phlébite","st-sub")+
  `<path d="M84 190 C 84 150, 130 150, 150 120 S 150 90, 120 92" class="s-acc" stroke-dasharray="5 5"/>`+`<circle cx="122" cy="92" r="5" fill="#7A2E24"/>`+
  tx(160,150,"Un fragment migre","st-acc st-b")+tx(160,164,"vers les poumons :","st-acc")+tx(160,178,"embolie pulmonaire","st-acc st-b"),
  "Du caillot du mollet à l'embolie pulmonaire"),
 fistule:()=>sv(190,
  `<path d="M10 70 L 260 56 C 296 54, 312 70, 312 92 C 312 114, 296 128, 260 126 L 10 116 Z" class="s-body"/>`+
  `<path d="M14 100 C 90 98, 150 96, 196 92" class="s-acc" stroke-width="5"/><path d="M14 82 C 90 80, 150 80, 196 90" class="s-blue" stroke-width="7"/>`+
  `<circle cx="196" cy="91" r="9" class="f-amber"/>`+tx(206,30,"Fistule : artère reliée","st-b")+tx(206,44,"à une veine","st-sub")+dash(198,82,212,48)+
  tx(14,140,"Veine (grossit, sert à la dialyse)","st-blue st-b")+tx(14,156,"Artère","st-acc st-b")+
  tx(14,178,"Ce bras : ni tension, ni prise de sang, ni perfusion","st-acc st-b")+tx(230,108,"frémissement","st-sub")+tx(230,122,"à vérifier","st-sub"),
  "Fistule artério-veineuse au bras"),
 abcd:()=>{const r=(y,l,t,s,c)=>`<rect x="10" y="${y}" width="300" height="44" rx="12" class="f-box"/><rect x="10" y="${y}" width="52" height="44" rx="12" class="${c}"/>`+tx(36,y+28,l,"st-b st-dark","middle")+tx(74,y+19,t,"st-b")+tx(74,y+33,s,"st-sub");
  return sv(220,r(6,"A","Voies aériennes","libres ? corps étranger, langue, vomi","f-coral")+r(58,"B","Respiration","FR, SpO₂, tirage, cyanose","f-amber")+r(110,"C","Circulation","pouls, tension, marbrures, saignement","f-blue")+r(162,"D","Neurologique","conscience, Glasgow, pupilles, glycémie","f-green"),"Évaluation ABCD");}
});

/* Placement des schémas dans les fiches détaillées */
const ADD_SCH={
 fc:[["05",{t:"schema",k:"pouls",cap:"Le pouls **radial** en routine, le **carotidien** en urgence, le **pédieux** pour vérifier la circulation d'une jambe."}]],
 ta:[["05",{t:"schema",k:"brassard"}]],
 spo2:[["03",{t:"schema",k:"oxymetre"}]],
 diurese:[["03",{t:"schema",k:"urines",cap:"Une urine claire est rassurante. Foncée, rouge ou trouble : on observe, on note et on signale."}]],
 glasgow:[["06",{t:"schema",k:"pupilles",cap:"Des pupilles **inégales** chez un patient qui s'aggrave : alerte immédiate."}]],
 bio:[["06",{t:"schema",k:"tubes",cap:"Couleurs de bouchons les plus courantes : elles peuvent varier selon le fabricant."}]],
 "5b":[["01",{t:"schema",k:"circuit"}]],
 douleur:[["02",{t:"schema",k:"eva"}],["02",{t:"schema",k:"visages",cap:"Échelle de visages : l'enfant montre le visage qui correspond à ce qu'il ressent."}]],
 "tvp-ep":[["03",{t:"schema",k:"thrombose"}]],
 irc:[["06",{t:"schema",k:"fistule"}]],
 detresse:[["01",{t:"schema",k:"abcd",cap:"On évalue toujours dans cet ordre : une voie aérienne bouchée tue avant tout le reste."}]]
};
Object.entries(ADD_SCH).forEach(([id,list])=>{const f=FICHES.find(x=>x.id===id);if(!f||!f.pages)return;
 list.forEach(([n,sec])=>{for(const p of f.pages){const i=p.findIndex(s=>s.n===n);if(i>=0){let j=i+1;while(j<p.length&&!p[j].n&&p[j].t==="schema")j++;p.splice(j,0,sec);break;}}});});



/* ---------- Schémas, série 4 ---------- */
Object.assign(SCH,{
 peau:()=>sv(232,
  `<rect x="10" y="30" width="190" height="18" fill="#F3D9C6"/><rect x="10" y="48" width="190" height="74" fill="#EDB9A6"/><rect x="10" y="122" width="190" height="64" fill="#F6E3A1"/><rect x="10" y="186" width="190" height="30" fill="#D98C7A"/>`+
  `<path d="M70 30 L 74 140" stroke="#5A3A2A" stroke-width="2"/><ellipse cx="74" cy="142" rx="6" ry="9" fill="#C77B62"/><path d="M140 60 C 150 90, 130 110, 150 150" stroke="#B4513A" stroke-width="2" fill="none"/>`+
  tx(16,43,"Épiderme","st-b st-dark")+tx(16,64,"Derme","st-b st-dark")+tx(16,138,"Hypoderme (graisse)","st-b st-dark")+tx(16,205,"Muscle","st-b st-dark")+
  `<rect x="218" y="30" width="14" height="18" rx="4" class="f-amber"/><rect x="244" y="30" width="14" height="40" rx="4" class="f-coral"/><rect x="270" y="30" width="14" height="92" rx="4" class="f-acc"/><rect x="296" y="30" width="14" height="160" rx="4" fill="#7A2E24"/>`+
  tx(225,212,"1er","st-b","middle")+tx(251,212,"2e S","st-b","middle")+tx(277,212,"2e P","st-b","middle")+tx(303,212,"3e","st-b","middle")+
  tx(318,226,"S : superficiel · P : profond","st-sub","end")+
  tx(160,18,"Plus la brûlure est profonde, moins elle fait mal","st-sub","middle"),
  "Couches de la peau et profondeur des brûlures selon le degré"),
 wallace:()=>sv(290,body(210)+
  tx(210,34,"9 %","st-b","middle")+tx(210,104,"18 %","st-b","middle")+tx(210,118,"avant","st-sub","middle")+
  tx(146,112,"9 %","st-b","end")+tx(274,112,"9 %","st-b")+tx(168,220,"18 %","st-b","end")+tx(252,220,"18 %","st-b")+
  tx(10,26,"Tête et cou : 9 %","st-sub")+tx(10,40,"Chaque bras : 9 %","st-sub")+tx(10,54,"Tronc : 18 % avant","st-sub")+tx(10,68,"+ 18 % arrière","st-sub")+tx(10,82,"Chaque jambe : 18 %","st-sub")+tx(10,96,"Périnée : 1 %","st-sub")+
  tx(10,250,"Paume du patient ≈ 1 %","st-acc st-b")+tx(10,264,"pour les petites surfaces","st-sub"),
  "Règle des 9 de Wallace chez l'adulte"),
 platre:()=>sv(220,
  `<rect x="20" y="86" width="170" height="52" rx="16" fill="#E9E4DA" stroke="#B9B2A4" stroke-width="2"/>`+tx(105,117,"plâtre","st-dark st-b","middle")+
  `<rect x="186" y="84" width="50" height="56" rx="16" class="s-body"/>`+[0,1,2,3].map(i=>`<rect x="234" y="${86+i*13}" width="${34-i*2}" height="10" rx="5" class="s-body"/>`).join("")+`<rect x="206" y="72" width="26" height="12" rx="6" class="s-body" transform="rotate(-25 219 78)"/>`+
  pt(262,112)+
  tx(10,24,"À vérifier sur les doigts, plusieurs fois par jour :","st-b")+
  tx(10,44,"Couleur : rosés, pas pâles ni bleus","st-sub")+tx(10,58,"Chaleur : chauds","st-sub")+
  tx(10,166,"Mobilité : le patient bouge les doigts","st-sub")+tx(10,180,"Sensibilité : pas de fourmillements","st-sub")+tx(10,194,"Œdème : pas de gonflement qui augmente","st-sub")+
  tx(10,214,"Douleur qui augmente = urgence (syndrome des loges)","st-acc st-b"),
  "Surveillance des extrémités sous un plâtre"),
 occlusion:()=>sv(190,
  `<path d="M40 92 C 60 92, 80 92, 150 92" stroke="var(--fx-coral-bar)" stroke-width="58" fill="none" stroke-linecap="round"/>`+
  `<path d="M28 92 L 146 92 L 146 118 L 28 118 Z" class="f-blue" opacity=".55"/><path d="M28 92 h118" class="s-blue"/>`+
  `<rect x="150" y="70" width="18" height="44" rx="6" class="f-sub"/>`+
  `<path d="M168 92 C 210 92, 250 92, 306 92" stroke="var(--fx-coral-bar)" stroke-width="16" fill="none" stroke-linecap="round"/>`+
  tx(80,80,"gaz","st-b st-dark","middle")+tx(80,112,"liquide","st-b st-dark","middle")+
  tx(80,148,"En amont : intestin dilaté","st-b","middle")+tx(80,162,"gaz et liquide s'accumulent","st-sub","middle")+
  tx(159,58,"Obstacle","st-acc st-b","middle")+
  tx(240,120,"En aval : vide","st-b","middle")+tx(240,134,"arrêt des matières","st-sub","middle")+tx(240,148,"et des gaz","st-sub","middle")+
  tx(160,184,"Vomissements, ventre gonflé, douleurs, plus rien ne passe","st-sub","middle"),
  "Occlusion intestinale : intestin dilaté en amont de l'obstacle")
});


/* ---------- Schémas, série 5 ---------- */
const ringSch=(pts,labels,cls,w,h,center,label,H)=>{
 const P=pts;let o="";
 P.forEach((a,i)=>{const b=P[(i+1)%P.length],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,m=Math.min(Math.abs(ux)>1e-6?(w/2)/Math.abs(ux):1e9,Math.abs(uy)>1e-6?(h/2)/Math.abs(uy):1e9)+7;
  o+=ar(a[0]+ux*m,a[1]+uy*m,b[0]-ux*m,b[1]-uy*m,"s-acc");});
 P.forEach((p,i)=>{o+=bx(p[0]-w/2,p[1]-h/2,w,h,labels[i],cls[i]);});
 o+=tx(160,center[0][1],center[0][0],"st-b","middle")+tx(160,center[1][1],center[1][0],"st-sub","middle");
 return sv(H,o,label);};
Object.assign(SCH,{
 cycle:()=>ringSch([[160,28],[262,100],[222,214],[98,214],[58,100]],["Recueil\nde données","Analyse,\ndiagnostics","Objectifs","Actions","Évaluation"],["f-blue","f-coral","f-amber","f-green","f-blue"],104,40,[["Le patient",124],["au centre de la démarche",140]],"Le cycle de la démarche de soins",240),
 chaine:()=>ringSch([[160,26],[250,78],[250,178],[160,230],[70,178],[70,78]],["Agent\ninfectieux","Réservoir","Porte\nde sortie","Transmission\n(mains ++)","Porte\nd'entrée","Hôte\nréceptif"],["f-coral","f-amber","f-amber","f-coral","f-blue","f-blue"],102,40,[["Briser un maillon",124],["stoppe l'infection",140]],"La chaîne de transmission des infections",256),
 perfuseur:()=>sv(250,
  `<path d="M70 4 v8" class="s-ln"/><rect x="40" y="12" width="60" height="82" rx="12" class="f-blue" opacity=".55"/><rect x="40" y="12" width="60" height="82" rx="12" class="s-ln"/>`+tx(70,58,"500 mL","st-b","middle")+
  `<line x1="70" y1="94" x2="70" y2="112" class="s-ln" stroke-width="3"/><rect x="56" y="112" width="28" height="50" rx="9" class="f-box"/>`+
  `<circle cx="70" cy="126" r="4" class="f-blue"/><circle cx="70" cy="142" r="4" class="f-blue"/><rect x="60" y="150" width="20" height="9" rx="3" class="f-blue" opacity=".6"/>`+
  `<line x1="70" y1="162" x2="70" y2="232" class="s-ln" stroke-width="3"/><rect x="58" y="184" width="24" height="26" rx="5" class="f-amber"/><circle cx="70" cy="197" r="6" class="f-box"/>`+ar(70,224,70,244,"s-acc")+
  dash(102,50,136,50)+tx(140,46,"Poche","st-b")+tx(140,60,"volume à passer (mL)","st-sub")+
  dash(86,134,136,124)+tx(140,120,"Chambre compte-gouttes","st-b")+tx(140,134,"on compte les gouttes","st-sub")+tx(140,148,"pendant 1 minute","st-sub")+
  dash(84,197,136,192)+tx(140,188,"Molette (régulateur)","st-b")+tx(140,202,"règle le débit","st-sub")+
  tx(140,230,"Standard : 20 gouttes = 1 mL","st-acc st-b")+tx(140,244,"Précision : 60 gouttes = 1 mL","st-sub"),
  "Perfuseur par gravité : poche, chambre compte-gouttes, molette"),
 alveole:()=>sv(210,
  `<path d="M160 0 v34" class="s-tube" stroke-width="22"/><circle cx="160" cy="84" r="54" class="f-soft"/><circle cx="160" cy="84" r="54" class="s-ln"/>`+tx(160,62,"Alvéole","st-b","middle")+tx(160,76,"(air inspiré)","st-sub","middle")+
  `<path d="M30 170 C 90 140, 230 140, 290 170" stroke="var(--fx-coral-bar)" stroke-width="20" fill="none" stroke-linecap="round"/>`+tx(160,196,"Capillaire sanguin","st-b","middle")+
  ar(136,92,136,146,"s-blue")+tx(124,116,"O₂","st-blue st-b","end")+tx(124,130,"vers le sang","st-blue","end")+
  ar(184,146,184,94,"s-acc")+tx(196,116,"CO₂","st-acc st-b")+tx(196,130,"rejeté","st-acc")+
  tx(8,24,"Paroi très fine :","st-b")+tx(8,38,"les gaz passent","st-sub")+tx(8,52,"par diffusion","st-sub"),
  "Échanges gazeux entre l'alvéole et le capillaire sanguin")
});

/* ---------- Fiche native : rendu ---------- */
SVG.bulb='<svg viewBox="0 0 24 24"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/></svg>';
SVG.back='<svg viewBox="0 0 24 24" style="width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2.4"><path d="M15 6l-6 6 6 6"/></svg>';
const TONE={blue:"var(--fx-blue)",green:"var(--fx-green)",coral:"var(--fx-coral)",amber:"var(--fx-amber-ink)"};
const reviewed=()=>store.get("reviewed",[]);
function fvBlock(s){
 switch(s.t){
  case "def": return `<p class="fv-lead">${md(s.txt)}</p>${s.wave?`<svg class="fv-wave" viewBox="0 0 300 40" preserveAspectRatio="none" aria-hidden="true"><path d="M0 26h40l5-9 6 20 6-26 5 15h56l5-9 6 20 6-26 5 15h56l5-9 6 20 6-26 5 15h43"/></svg>`:""}`;
  case "text": return s.ps.map(p=>`<p>${md(p)}</p>`).join("");
  case "duo": return `<div class="fv-duo">${s.items.map(i=>`<div class="tc-${i.tone||"coral"}"><span class="k">${esc(i.tag)}</span><span>${md(i.txt)}</span>${i.sub?`<small>${md(i.sub)}</small>`:""}</div>`).join("")}</div>`;
  case "valeurs": return `<div class="fv-panel"><div class="fv-gauge" aria-hidden="true"><div class="bar">${s.rows.map(r=>`<i class="g-${r[3]}"></i>`).join("")}</div><div class="lbl">${s.rows.map(r=>`<span>${md(r[2])}</span>`).join("")}</div></div>
    <div class="fv-vals">${s.rows.map(r=>`<div class="fv-val"><i class="d g-${r[3]}"></i><div><b style="color:${TONE[r[3]]}">${esc(r[0])}</b><small>${md(r[1])}</small></div><span class="v">${md(r[2])}</span></div>`).join("")}</div>
    ${s.note?`<div class="fv-note">${SVG.info}<span>${md(s.note)}</span></div>`:""}</div>`;
  case "big": return `<div class="fv-panel"><div class="fv-big"><div><b class="c-coral">${esc(s.a)}</b><small class="c-coral">${esc(s.la)}</small></div><span class="sl">/</span><div><b class="c-blue">${esc(s.b)}</b><small class="c-blue">${esc(s.lb)}</small></div><span class="u">${esc(s.unit)}</span></div>${s.note?`<div class="fv-note">${SVG.info}<span>${md(s.note)}</span></div>`:""}</div>`;
  case "etapes": return `<div class="fv-panel"><ol class="fv-steps">${s.items.map(i=>`<li>${md(i)}</li>`).join("")}</ol></div>`;
  case "signes": return `<ul class="fv-chips ${/urgence|alerte/i.test(s.e||"")?"alert":""}">${s.items.map(i=>`<li>${md(i)}</li>`).join("")}</ul>`;
  case "trace": return `<ul class="fv-checks">${s.items.map(i=>`<li>${SVG.check}<span>${md(i)}</span></li>`).join("")}</ul>${s.note?`<p class="fv-sub" style="margin:0">${md(s.note)}</p>`:""}`;
  case "liste": return `<div class="fv-panel"><ul class="fv-list">${s.items.map(i=>`<li>${md(i)}</li>`).join("")}</ul></div>`;
  case "cols": return `<div class="fv-duo">${s.cols.map(c=>`<div class="tc-${c.tone||"blue"}"><span class="k">${esc(c.h)}</span><ul>${c.items.map(i=>`<li>${md(i)}</li>`).join("")}</ul></div>`).join("")}</div>`;
  case "table": return `<div class="fv-panel"><div class="fv-tbl">${s.rows.map(r=>`<div><span>${md(r[0])}</span><span>${md(r[1])}</span></div>`).join("")}</div>${s.note?`<div class="fv-note">${SVG.info}<span>${md(s.note)}</span></div>`:""}</div>`;
  case "schema": return schFig(s.k,s.cap);
  case "info": return `<div class="fv-tip"><span class="i">${SVG[s.ico||"info"]}</span><span>${md(s.txt)}</span></div>`;
  case "retenir": return `<div class="fv-key"><h3>${SVG.bulb}${esc(s.h||"À retenir")}</h3><p>${md(s.txt)}</p></div>`;
 }
 return "";
}
function fvRender(f){
 const cat=CAT[f.cat],all=f.pages.flat(),groups=[];
 all.forEach(s=>{if(s.n&&s.h||!groups.length)groups.push({s,blocks:[s]});else groups[groups.length-1].blocks.push(s);});
 const nSec=groups.filter(g=>g.s.n).length,mins=Math.max(3,Math.round(JSON.stringify(f.pages).length/900));
 const done=reviewed().includes(f.id);
 const same=FICHES.filter(x=>x.cat===f.cat&&x.pages),k=same.findIndex(x=>x.id===f.id),next=same[k+1];
 const toc=groups.filter(g=>g.s.n).map(g=>`<a href="#fiches" data-sec="s-${g.s.n}"><b>${esc(g.s.n)}</b>${esc(g.s.chip||g.s.h.replace(/\*\*|==/g,""))}</a>`).join("");
 const body=groups.map(g=>`<section class="fv-sec" ${g.s.n?`id="s-${g.s.n}"`:""}>
   ${g.s.n?`<div class="fv-sh"><span class="fv-num">${esc(g.s.n)}</span><h2>${md(g.s.h)}</h2></div>${g.s.sub?`<p class="fv-sub">${md(g.s.sub)}</p>`:""}`:""}
   ${g.blocks.map(fvBlock).join("")}</section>`).join("");
 return `<article class="fv" style="--c:${cat.c}">
  <div class="fv-progress" aria-hidden="true"><i id="fv-bar"></i></div>
  <header class="fv-hero">
   <div class="fv-top"><button class="fv-back" data-act="fiche-back">${SVG.back}Fiches</button>${done?'<span class="fv-done-badge">Révisée</span>':""}</div>
   <span class="fv-kicker">${esc(cat.nom)} · ${esc(f.theme)}</span>
   <h1>${esc(f.titre)}</h1>
   <div class="fv-ico" aria-hidden="true">${ICO[f.icon]||ICO.heart}</div>
   <div class="fv-meta"><span>${nSec} sections</span><span>≈ ${mins} min</span>${(f.ue&&f.ue[state.ueRef]||[]).map(u=>`<span class="m">UE ${esc(u)}</span>`).join("")}</div>
  </header>
  <nav class="fv-toc" aria-label="Sommaire de la fiche">${toc}</nav>
  <div class="fv-body">${body}
   <div class="fv-end">
    <h3>${done?"Fiche révisée":"Vous avez terminé la fiche"}</h3>
    <p class="muted">Marquez-la comme révisée pour suivre votre progression, puis testez-vous.</p>
    <div class="row2"><button class="btn ${done?"ghost":"ok"}" data-act="fv-done" data-id="${f.id}">${done?"Retirer des révisées":"J'ai révisé cette fiche"}</button>
    ${QUIZ.some(q=>q.cat===f.cat)?`<button class="btn ghost" data-act="fv-quiz" data-k="${f.cat}">Quiz ${esc(cat.nom)}</button>`:""}</div>
    ${next?`<button class="card cat fv-next" style="--c:${cat.c}" data-act="fiche" data-id="${next.id}"><span class="eyebrow">Fiche suivante</span><h3>${esc(next.titre)}</h3></button>`:""}
   </div>
  </div></article>`;
}
let fvOff=null;
function fvBind(){
 if(fvOff){fvOff();fvOff=null;}
 const art=document.querySelector(".fv");if(!art)return;
 const bar=document.getElementById("fv-bar"),links=[...document.querySelectorAll(".fv-toc a")],secs=links.map(a=>document.getElementById(a.dataset.sec));
 const onScroll=()=>{const h=document.documentElement,max=h.scrollHeight-h.clientHeight;bar.style.width=(max>0?Math.min(100,h.scrollTop/max*100):0)+"%";
  let cur=0;secs.forEach((s,i)=>{if(s&&s.getBoundingClientRect().top<140)cur=i;});
  links.forEach((a,i)=>a.classList.toggle("on",i===cur));
  const on=links[cur];if(on&&on.parentNode){const p=on.parentNode;const l=on.offsetLeft-p.clientWidth/2+on.clientWidth/2;if(Math.abs(p.scrollLeft-l)>40)p.scrollTo({left:l});}};
 window.addEventListener("scroll",onScroll,{passive:true});onScroll();
 links.forEach((a,i)=>a.addEventListener("click",e=>{e.preventDefault();secs[i]&&secs[i].scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});}));
 fvOff=()=>window.removeEventListener("scroll",onScroll);
}
document.addEventListener("click",e=>{
 const z=document.querySelector(".zoom");if(z){z.remove();return;}
 const fig=e.target.closest(".fv .sch-fig");if(!fig)return;
 const o=document.createElement("div");o.className="zoom";o.setAttribute("role","dialog");o.setAttribute("aria-label","Schéma agrandi");o.innerHTML=fig.outerHTML;document.body.appendChild(o);
});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){const z=document.querySelector(".zoom");z&&z.remove();}});



/* ---------- Schémas, série 6 ---------- */
Object.assign(SCH,{
 survie:()=>{const L=[["1","Reconnaître\net alerter","f-coral"],["2","Masser\ntout de suite","f-amber"],["3","Défibriller\nau plus tôt","f-blue"],["4","Soins\navancés","f-green"]];
  return sv(150,L.map(([n,l,c],i)=>{const x=8+i*78;return `<rect x="${x}" y="30" width="70" height="80" rx="35" class="${c}"/>`+tx(x+35,56,n,"st-b st-dark","middle")+tx(x+35,80,l,"st-dark","middle")+(i<3?`<rect x="${x+64}" y="62" width="20" height="16" rx="8" class="f-sub" opacity=".5"/>`:"");}).join("")+
  tx(160,18,"Un maillon absent et la chaîne se rompt","st-sub","middle")+tx(160,130,"Sans massage : environ 10 % de chances","st-acc st-b","middle")+tx(160,143,"de survie en moins par minute","st-acc st-b","middle"),"Les quatre maillons de la chaîne de survie");},
 angles:()=>{const layer=`<rect x="10" y="40" width="300" height="16" fill="#F3D9C6"/><rect x="10" y="56" width="300" height="40" fill="#EDB9A6"/><rect x="10" y="96" width="300" height="46" fill="#F6E3A1"/><rect x="10" y="142" width="300" height="56" fill="#D98C7A"/>`;
  const nd=(x,ang,len,lbl,deg,ly=12)=>{const r=ang*Math.PI/180,x2=x+Math.cos(r)*len,y2=40+Math.sin(r)*len,x1=x-Math.cos(r)*16,y1=40-Math.sin(r)*16;
   return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#2D3D51" stroke-width="3" stroke-linecap="round"/><circle cx="${x2}" cy="${y2}" r="3" fill="#B4513A"/>`+tx(x-8,ly,lbl+" "+deg,"st-b","middle");};
  return sv(230,layer+`<ellipse cx="278" cy="64" rx="24" ry="7" fill="#B4513A" opacity=".75"/>`+
   nd(96,12,40,"ID","10–15°",12)+nd(150,45,62,"SC","45°",26)+nd(204,90,124,"IM","90°",12)+nd(240,25,44,"IV","≈ 25°",26)+
   tx(14,52,"Épiderme","st-dark")+tx(14,82,"Derme","st-dark")+tx(14,124,"Hypoderme","st-dark")+tx(14,176,"Muscle","st-dark")+tx(304,84,"veine","st-dark","end")+
   tx(160,218,"SC : 90° possible avec une aiguille courte ou un pli épais","st-sub","middle"),"Angles et profondeur des quatre voies d'injection");}
});
Object.assign(SCH_T,{
 survie:["La chaîne de survie","Les quatre gestes qui sauvent lors d'un arrêt cardiaque"],
 angles:["Les angles d'injection","Profondeur atteinte selon la voie : ID, SC, IM, IV"]
});

/* ---------- Cours complets : rendu ---------- */
SVG.say='<svg viewBox="0 0 24 24"><path d="M4 5h16v11H10l-5 4v-4H4z"/></svg>';
SVG.case='<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3v3h6V3M9 11h6M9 15h4"/></svg>';
SVG.target='<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.5"/></svg>';
const studied=()=>store.get("studied",[]);
function cvBlock(s){
 switch(s.t){
  case "p": return s.ps.map(p=>`<p class="cv-p">${md(p)}</p>`).join("");
  case "analogie": return `<div class="cv-box cv-ana"><span class="cv-lab">${SVG.bulb}Pour comprendre</span><p>${md(s.txt)}</p></div>`;
  case "expliquer": return `<div class="cv-box cv-say"><span class="cv-lab">${SVG.say}Savoir l'expliquer${s.qui?" · "+esc(s.qui):""}</span><blockquote>${md(s.txt)}</blockquote></div>`;
  case "exemple": return `<div class="cv-box cv-ex"><span class="cv-lab">${SVG.case}Exemple${s.h?" · "+esc(s.h):""}</span>${s.ps.map(p=>`<p>${md(p)}</p>`).join("")}</div>`;
  case "pieges": return `<div class="cv-box cv-trap"><span class="cv-lab">${SVG.warn}Erreurs fréquentes</span><ul>${s.items.map(i=>`<li>${md(i)}</li>`).join("")}</ul></div>`;
  case "verif": return `<div class="cv-verif"><span class="cv-lab">${SVG.check}Vérifier ses connaissances</span>${s.items.map(([q,a])=>`<details><summary>${md(q)}</summary><p>${md(a)}</p></details>`).join("")}</div>`;
  case "map": return amFig(s);
 case "calc": return `<div class="cv-calc"><span class="cv-lab">${SVG.case}${esc(s.h||"Calcul pas à pas")}</span><p>${md(s.q)}</p><ol>${s.steps.map(x=>`<li>${md(x)}</li>`).join("")}</ol><p class="cv-res">${md(s.r)}</p></div>`;
 }
 return fvBlock(s);
}
function cvRender(c){
 const cat=CAT[c.cat],done=studied().includes(c.id),list=COURS.filter(x=>x.chap),k=list.findIndex(x=>x.id===c.id),next=c.cat==="tfe"?list.slice(k+1).find(x=>x.cat==="tfe"):list[k+1];
 const num=i=>String(i+1).padStart(2,"0");
 const toc=c.chap.map((ch,i)=>`<a href="#cours" data-sec="c-${i+1}"><b>${num(i)}</b>${esc(ch.chip||ch.h)}</a>`).join("");
 const body=c.chap.map((ch,i)=>`<section class="fv-sec" id="c-${i+1}"><div class="fv-sh"><span class="fv-num">${num(i)}</span><h2>${md(ch.h)}</h2></div>${ch.b.map(cvBlock).join("")}</section>`).join("");
 return `<article class="fv cv" style="--c:${cat.c}">
  <div class="fv-progress" aria-hidden="true"><i id="fv-bar"></i></div>
  <header class="fv-hero">
   <div class="fv-top"><button class="fv-back" data-act="cours-back">${SVG.back}Cours</button>${done?'<span class="fv-done-badge">Étudié</span>':""}</div>
   <span class="fv-kicker">Cours complet · ${esc(cat.nom)}</span>
   <h1>${esc(c.titre)}</h1>
   <div class="fv-ico" aria-hidden="true">${ICO[c.icon]||ICO.heart}</div>
   <div class="fv-meta"><span>${c.chap.length} chapitres</span><span>≈ ${esc(c.duree)}</span>${(c.ue&&c.ue[state.ueRef]||[]).map(u=>`<span class="m">UE ${esc(u)}</span>`).join("")}</div>
  </header>
  <section class="cv-obj"><span class="cv-lab">${SVG.target}À la fin de ce cours, vous saurez</span><ul class="fv-checks">${c.obj.map(o=>`<li>${SVG.check}<span>${md(o)}</span></li>`).join("")}</ul></section>
  ${a4Cta("c",c.id,"L'essentiel du cours en une page, à revoir ou à imprimer")}
  <nav class="fv-toc" aria-label="Chapitres du cours">${toc}</nav>
  <div class="fv-body">${body}
   <div class="fv-key"><h3>${SVG.bulb}L'essentiel du cours</h3><ul>${c.ess.map(e=>`<li>${md(e)}</li>`).join("")}</ul></div>
   <div class="fv-end">
    <h3>${done?"Cours étudié":"Vous avez terminé le cours"}</h3>
    <p class="muted">Relisez l'essentiel, répondez aux questions de chaque chapitre sans regarder, puis passez au quiz.</p>
    <div class="row2"><button class="btn ${done?"ghost":"ok"}" data-act="cv-done" data-id="${c.id}">${done?"Retirer des cours étudiés":"J'ai étudié ce cours"}</button>
    ${QUIZ.some(q=>q.cat===c.cat)?`<button class="btn ghost" data-act="fv-quiz" data-k="${c.cat}">Quiz ${esc(cat.nom)}</button>`:""}</div>
    ${next?`<button class="card cat fv-next" style="--c:${CAT[next.cat].c}" data-act="cours" data-id="${next.id}"><span class="eyebrow">${c.cat==="tfe"?"Étape suivante":"Cours suivant"}</span><h3>${esc(next.titre)}</h3></button>`:""}
   </div>
  </div></article>`;
}
