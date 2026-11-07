/* Carnet IFSI — schémas des lésions : pour chaque pathologie, un dessin de ce qui se passe réellement
   (la lésion, le mécanisme, l'endroit précis), avec l'organe en contexte et une loupe sur le détail.
   Il remplace le schéma d'organe générique (« Où ça se passe ») quand il existe.
   Les dessins sont répartis par spécialité dans js/lesions/lz-*.js. Chargé après schemas-real.js, avant pathos.js. */
const LZ={};
const lz=(id,o)=>{LZ[id]=o;};
const lzN=v=>Math.round(v*10)/10;
const lzRnd=seed=>{let s=(seed>>>0)||1;return ()=>(s=(Math.imul(s,1664525)+1013904223)>>>0)/4294967296;};
/* Palette (couleurs anatomiques fixes, lisibles en clair comme en sombre) */
const LC={adv:"#F0DCCB",med:"#D9806F",intima:"#F4C2B8",plasma:"#F8D3CB",blood:"#E0503F",bloodD:"#9E2219",vein:"#5B70B8",veinL:"#D3DBF2",veinD:"#34468A",
 clot:"#6E1A16",clotL:"#9B2C24",fat:"#F2C94C",fatD:"#B98B14",calc:"#F4F1E8",fluid:"#9CCDEB",fluidD:"#3D8CC0",air:"#EEF7FC",inflam:"#F08A5D",inflamL:"#FAD2BF",
 necro:"#4E2622",ischem:"#B9A6A2",bact:"#3E8E4A",bactL:"#A9D9A8",pus:"#E8D27A",nerve:"#E8C34C",bone:"#F3EBD7",boneD:"#C9B88E",cart:"#CFE6EE",cartD:"#7FAEC0",
 skin:"#F6D3BB",skinD:"#D69C79",derm:"#F2BFA9",hypo:"#FBE7A9",muscle:"#C9675A",muscleD:"#8E3A30",mucosa:"#F2A79D",mucosaD:"#C9675E",o2:"#E8574A",co2:"#6F7FC4",
 elec:"#F2B705",elecD:"#B07F00",ok:"#2C7451",acc:"#C8372D",ink:"#1C2733",grey:"#9AA3AB",greyL:"#E6E9EC",white:"#FFFFFF"};
/* ---------- Éléments de dessin ---------- */
const lzP=(d,f,s,w=1,ex="")=>`<path d="${d}" style="fill:${f||"none"};stroke:${s||"none"};stroke-width:${w};stroke-linejoin:round;stroke-linecap:round${ex}"/>`;
const lzC=(x,y,r,f,s,w=1,ex="")=>`<circle cx="${lzN(x)}" cy="${lzN(y)}" r="${lzN(r)}" style="fill:${f||"none"};stroke:${s||"none"};stroke-width:${w}${ex}"/>`;
const lzE=(x,y,rx,ry,f,s,w=1,rot=0,ex="")=>`<ellipse cx="${lzN(x)}" cy="${lzN(y)}" rx="${lzN(rx)}" ry="${lzN(ry)}"${rot?` transform="rotate(${rot} ${lzN(x)} ${lzN(y)})"`:""} style="fill:${f||"none"};stroke:${s||"none"};stroke-width:${w}${ex}"/>`;
const lzR=(x,y,w,h,rx,f,s,sw=1,ex="")=>`<rect x="${lzN(x)}" y="${lzN(y)}" width="${lzN(w)}" height="${lzN(h)}" rx="${rx}" style="fill:${f||"none"};stroke:${s||"none"};stroke-width:${sw}${ex}"/>`;
/* globule rouge (disque biconcave vu de biais) */
const lzRbc=(x,y,r=4.2,a=0,o=1)=>`<g transform="translate(${lzN(x)} ${lzN(y)}) rotate(${Math.round(a)})"${o<1?` opacity="${o}"`:""}><ellipse rx="${r}" ry="${lzN(r*.62)}" style="fill:${LC.blood};stroke:${LC.bloodD};stroke-width:.6"/><ellipse rx="${lzN(r*.45)}" ry="${lzN(r*.24)}" style="fill:#F28A7C;opacity:.85"/></g>`;
const lzRbcs=(x,y,w,h,n,seed=7,r=4,a)=>{const R=lzRnd(seed);let s="";for(let i=0;i<n;i++)s+=lzRbc(x+R()*w,y+R()*h,r*(.85+R()*.3),a==null?R()*180:a+R()*30-15);return s;};
/* petits points (bactéries, cellules, cristaux) répartis au hasard mais toujours au même endroit */
const lzDots=(x,y,w,h,n,seed,fn)=>{const R=lzRnd(seed);let s="";for(let i=0;i<n;i++)s+=fn(x+R()*w,y+R()*h,R);return s;};
const lzBact=(x,y,R)=>{const a=Math.round(R()*180);return `<rect x="${lzN(x-3)}" y="${lzN(y-1.4)}" width="6" height="2.8" rx="1.4" transform="rotate(${a} ${lzN(x)} ${lzN(y)})" style="fill:${LC.bact};stroke:#225A2B;stroke-width:.4"/>`;};
const lzCoc=(x,y)=>`<circle cx="${lzN(x)}" cy="${lzN(y)}" r="1.9" style="fill:${LC.bact};stroke:#225A2B;stroke-width:.4"/>`;
const lzWbc=(x,y,r=4.5)=>`<circle cx="${lzN(x)}" cy="${lzN(y)}" r="${r}" style="fill:#EEE9F7;stroke:#8E7BB8;stroke-width:.8"/><path d="M${lzN(x-r*.45)} ${lzN(y)} q${lzN(r*.3)} ${lzN(-r*.55)} ${lzN(r*.6)} 0 q${lzN(r*.3)} ${lzN(r*.55)} ${lzN(r*.4)} ${lzN(-r*.1)}" style="fill:none;stroke:#7A5FAE;stroke-width:1.4;stroke-linecap:round"/>`;
/* flèches droite et courbe */
function lzArr(x1,y1,x2,y2,o={}){const c=o.c||"#1E5A6D",w=o.w||2,a=Math.atan2(y2-y1,x2-x1),L=o.hl||5+w*1.8,bx=x2-L*.75*Math.cos(a),by=y2-L*.75*Math.sin(a),op=o.op?`;opacity:${o.op}`:"";
 return `<path d="M${lzN(x1)} ${lzN(y1)} L${lzN(bx)} ${lzN(by)}" style="fill:none;stroke:${c};stroke-width:${w};stroke-linecap:round${o.dash?";stroke-dasharray:"+o.dash:""}${op}"/><path d="M${lzN(x2)} ${lzN(y2)} L${lzN(x2-L*Math.cos(a-.45))} ${lzN(y2-L*Math.sin(a-.45))} L${lzN(x2-L*Math.cos(a+.45))} ${lzN(y2-L*Math.sin(a+.45))} Z" style="fill:${c}${op}"/>`;}
function lzQ(x0,y0,cx,cy,x1,y1,o={}){const c=o.c||"#1E5A6D",w=o.w||2,a=Math.atan2(y1-cy,x1-cx),L=o.hl||5+w*1.8,bx=x1-L*.75*Math.cos(a),by=y1-L*.75*Math.sin(a),op=o.op?`;opacity:${o.op}`:"";
 return `<path d="M${x0} ${y0} Q${cx} ${cy} ${lzN(bx)} ${lzN(by)}" style="fill:none;stroke:${c};stroke-width:${w};stroke-linecap:round${o.dash?";stroke-dasharray:"+o.dash:""}${op}"/><path d="M${x1} ${y1} L${lzN(x1-L*Math.cos(a-.45))} ${lzN(y1-L*Math.sin(a-.45))} L${lzN(x1-L*Math.cos(a+.45))} ${lzN(y1-L*Math.sin(a+.45))} Z" style="fill:${c}${op}"/>`;}
/* textes : libellé simple, petit texte, étiquette avec trait de rappel (LB), pastille */
const lzT=(x,y,t,cls="st-sub",a="start")=>tx(x,y,t,cls,a);
const lzS=(x,y,t,a="start",cls="st-sub")=>`<text x="${x}" y="${y}" class="${cls}" text-anchor="${a}" style="font-size:9.5px">${t.split("\n").map((l,i)=>`<tspan x="${x}" dy="${i?11:0}">${esc(l)}</tspan>`).join("")}</text>`;
const lzL=(x,y,t,on,a,px,py)=>LB(x,y,t,on,a||"start",px,py);
function lzPill(x,y,t,c=LC.acc,a="middle"){const w=t.length*5.7+14,x0=a==="middle"?x-w/2:a==="end"?x-w:x;
 return `<rect x="${lzN(x0)}" y="${y-11}" width="${lzN(w)}" height="16" rx="8" style="fill:${c}"/><text x="${lzN(x0+w/2)}" y="${y+1}" text-anchor="middle" style="fill:#fff;font-size:9.5px;font-weight:700">${esc(t)}</text>`;}
/* encadré de panneau (comparaison avant / après) */
const lzBox=(x,y,w,h,title,on)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" style="fill:var(--fx-bg);stroke:var(--fx-line);stroke-width:1"/>`+(title?`<text x="${x+w/2}" y="${y+15}" text-anchor="middle" class="${on?"st-acc st-b":"st-b"}" style="font-size:10.5px">${esc(title)}</text>`:"");
/* ---------- Parois de vaisseaux ---------- */
/* artère en coupe longitudinale horizontale : bande supérieure et inférieure (adventice, média, intima), lumière avec sang */
function lzArtL(x,y,L,D,t,o={}){const ad=Math.max(1.4,t*.22),it=Math.max(1.1,t*.16),lum=D-2*t;
 const band=(yy,flip)=>{const a=flip?[yy+t-ad,yy+it,yy]:[yy,yy+ad,yy+t-it];
  return lzR(x,a[0],L,ad,0,o.adv||LC.adv,"none")+lzR(x,flip?yy+it:yy+ad,L,t-ad-it,0,o.med||LC.med,"none")+lzR(x,a[2],L,it,0,LC.intima,"none");};
 return lzR(x,y+t,L,lum,0,o.plasma||LC.plasma,"none")+(o.rbc===0?"":lzRbcs(x+4,y+t+3,L-8,Math.max(2,lum-6),o.rbc||Math.round(L*lum/260),o.seed||3,Math.min(4.2,lum/4.5),o.flowA))+band(y,false)+band(y+D-t,true)
  +lzP(`M${x} ${y} H${x+L} M${x} ${y+D} H${x+L}`,"none","rgba(90,40,35,.45)",.8);}
/* artère en coupe transversale */
function lzArtX(cx,cy,R,t,o={}){const ad=Math.max(1.5,t*.2),it=Math.max(1.1,t*.15);
 return lzC(cx,cy,R,o.adv||LC.adv,"rgba(90,40,35,.45)",.8)+lzC(cx,cy,R-ad,o.med||LC.med,"none")+lzC(cx,cy,R-t+it,LC.intima,"none")+lzC(cx,cy,R-t,o.plasma||LC.plasma,"none")
  +(o.rbc===0?"":lzRbcs(cx-(R-t)*.6,cy-(R-t)*.6,(R-t)*1.2,(R-t)*1.2,o.rbc||5,o.seed||5,Math.min(4,(R-t)/3.2)));}
/* ---------- Organe en contexte et loupe ---------- */
function lzBase(map,zones){const M=PMAPS[map];if(!M)return {inner:"",H:220};const s=M.draw(zones||[],[]),m=s.match(/viewBox="0 0 320 ([\d.]+)"/);return {inner:svIn(s),H:m?+m[1]:220};}
const lzOrg=(map,zones,x,y,sc)=>`<g transform="translate(${x} ${y}) scale(${sc})">${lzBase(map,zones).inner}</g>`;
/* loupe : petit cercle sur l'organe (px,py), grand cercle (cx,cy,R) contenant le détail, découpé proprement */
function lzZoom(id,px,py,cx,cy,R,inner,o={}){const d=Math.hypot(cx-px,cy-py)||1,ux=(cx-px)/d,uy=(cy-py)/d,r=o.r||7;
 const t1=[px-uy*r,py+ux*r],t2=[px+uy*r,py-ux*r],T1=[cx-uy*R,cy+ux*R],T2=[cx+uy*R,cy-ux*R];
 return `<defs><clipPath id="lzc-${id}"><circle cx="${cx}" cy="${cy}" r="${R-1}"/></clipPath></defs>`+
  lzP(`M${lzN(t1[0])} ${lzN(t1[1])} L${lzN(T1[0])} ${lzN(T1[1])} M${lzN(t2[0])} ${lzN(t2[1])} L${lzN(T2[0])} ${lzN(T2[1])}`,"none","var(--fx-sub)",.8,";stroke-dasharray:3 3;opacity:.7")+
  lzC(px,py,r,"rgba(255,224,102,.25)","#F08C00",1.6)+lzC(cx,cy,R,o.bg||"#FFFDFB","var(--fx-sub)",1.2)+`<g clip-path="url(#lzc-${id})">${inner}</g>`+lzC(cx,cy,R,"none","var(--fx-sub)",1.2);}
/* médaillon « Où ? » : l'organe en petit, zone surlignée */
function lzInset(z,x,y,s){const B=lzBase(z[0],z.slice(1)),w=320*s+10,h=B.H*s+20;
 return `<g class="lz-inset"><rect x="${x}" y="${y}" width="${lzN(w)}" height="${lzN(h)}" rx="10" style="fill:var(--surface);stroke:var(--fx-line);stroke-width:1"/><text x="${x+8}" y="${y+12}" class="st-sub st-b" style="font-size:8.5px;letter-spacing:.06em">OÙ ?</text><g transform="translate(${x+5} ${y+15}) scale(${s})">${B.inner}</g></g>`;}
/* ---------- Tracé ECG ---------- */
/* motifs : complexe normal, onde P, QRS large, dents de scie, fibrillation, ligne plate */
function lzEcg(x,y,w,h,type){
 const grid=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" style="fill:#FFF5F3;stroke:#F2C9C2;stroke-width:1"/>`+[...Array(Math.floor(w/10))].map((_,i)=>`<path d="M${x+i*10+10} ${y} V${y+h}" style="stroke:#F7D9D3;stroke-width:.6"/>`).join("")+[...Array(Math.floor(h/10))].map((_,i)=>`<path d="M${x} ${y+i*10+10} H${x+w}" style="stroke:#F7D9D3;stroke-width:.6"/>`).join("");
 const b=y+h*.62,A=h*.5;let d=`M${x+4} ${b}`,cx=x+4;const go=dx=>{cx+=dx;};
 const P=()=>{d+=` q4 ${-A*.18} 8 0`;go(8);},flat=n=>{d+=` h${n}`;go(n);},Q=(k=1)=>{d+=` l2 ${A*.12} l3 ${-A*.95*k} l3 ${A*1.1*k} l2 ${-A*.27*k}`;go(10);},T=()=>{d+=` q6 ${-A*.3} 12 0`;go(12);},
  W=()=>{d+=` l5 ${-A*.95} l7 ${A*1.25} l5 ${-A*.3}`;go(17);},saw=()=>{d+=` l7 ${-A*.28} l3 ${A*.28}`;go(10);},fib=R=>{const k=3+R()*3;go(k);d+=` L${lzN(cx)} ${lzN(b+(R()-.5)*A*.22)}`;};
 const R=lzRnd(11),end=x+w-6;
 if(type==="sinus"||type==="brady"){const gap=type==="brady"?62:20;while(cx<end-50){flat(6);P();flat(6);Q();flat(8);T();flat(gap);}}
 else if(type==="fa"){while(cx<end-30){for(let i=0;i<3+Math.floor(R()*4);i++)fib(R);Q();flat(4);T();}}
 else if(type==="flutter"){while(cx<end-30){saw();saw();saw();Q();}}
 else if(type==="tsv"){while(cx<end-26){flat(3);Q();flat(2);T();flat(2);}}
 else if(type==="tv"){while(cx<end-24){W();flat(1);d+=` q4 ${A*.35} 8 0`;go(8);}}
 else if(type==="fv"){while(cx<end){const k=3+R()*3;go(k);d+=` L${lzN(cx)} ${lzN(b-A*.45+(R()-.5)*A*1.3)}`;}}
 else if(type==="bav"){let i=0;while(cx<end-40){flat(5);P();if(i%2===0){flat(8);W();flat(5);}else flat(26);i++;}}
 else if(type==="plat"){d+=` H${end}`;}
 const cid=`lze-${type}-${x}-${y}`;return grid+`<defs><clipPath id="${cid}"><rect x="${x+1}" y="${y+1}" width="${w-2}" height="${h-2}" rx="5"/></clipPath></defs><path d="${d}" clip-path="url(#${cid})" style="fill:none;stroke:#C8372D;stroke-width:1.6;stroke-linejoin:round;stroke-linecap:round"/>`;}
/* ---------- Figure ---------- */
function lzFig(p,cap){const o=LZ[p.i];if(!o)return "";let body;try{body=o.draw(p);}catch(e){return p.z?pmFig(p.z,cap):"";}
 const z=o.z||p.z,ins=o.ins===false||!z||!PMAPS[z[0]]?"":lzInset(z,o.ix==null?226:o.ix,o.iy==null?4:o.iy,o.is||.27);
 return `<figure class="sch-fig lz-fig"><div class="sch-head"><span class="sch-kick">Ce qui se passe</span><strong>${esc(o.t)}</strong>${o.sub?`<small>${esc(o.sub)}</small>`:""}</div>${sv(o.h||240,body+ins,o.t)}
  ${o.leg?`<ul class="lz-leg">${o.leg.map(([c,l])=>`<li><i style="background:${c}"></i>${esc(l)}</li>`).join("")}</ul>`:""}${o.cap?`<figcaption>${md(o.cap)}</figcaption>`:""}</figure>`;}
/* schéma de la pathologie si dessiné, sinon schéma de l'organe */
const pxSchema=(p,cap)=>LZ[p.i]?lzFig(p,cap):p.z?pmFig(p.z,cap):"";
/* ---------- Cœur en coupe (4 cavités), réutilisable ----------
   Coordonnées propres centrées sur 0,0 (≈150 × 160), placées par translate/scale.
   o : vg, vd, og, od = taille de la cavité (1 = normale, <1 paroi épaisse, >1 cavité dilatée) ; cond = voies de conduction ;
       vx = vaisseaux (par défaut oui) ; pale = ventricule à griser ; ex = dessin superposé dans les mêmes coordonnées. */
const LZH={od:[-34,-30],og:[34,-31],vd:[-32,16],vg:[33,18]};
function lzHeart(cx,cy,s,o={}){
 const cav=(k,d,f)=>{const [x,y]=LZH[k],r=o[k]||1;return `<path d="${d}" transform="translate(${x} ${y}) scale(${r}) translate(${-x} ${-y})" style="fill:${o.pale===k?"#D9CFCB":f};stroke:rgba(90,40,35,.5);stroke-width:.9"/>`;};
 const vx=o.vx===false?"":lzP("M-44 -44 L-44 -92","none",LC.veinD,12)+lzP("M-44 -44 L-44 -92","none",LC.vein,9.5)+
  lzP("M-6 -50 C-10 -78 -40 -84 -50 -68","none",LC.veinD,11)+lzP("M-6 -50 C-10 -78 -40 -84 -50 -68","none","#7486C9",8.5)+
  lzP("M8 -50 C8 -86 56 -92 62 -62","none",LC.bloodD,13)+lzP("M8 -50 C8 -86 56 -92 62 -62","none","#D8473A",10.5)+
  lzP("M56 -36 L86 -42 M56 -26 L86 -20","none",LC.bloodD,7)+lzP("M56 -36 L86 -42 M56 -26 L86 -20","none","#E06A5C",5);
 const cond=o.cond?lzP("M-46 -44 C-34 -40 -18 -30 -7 -13 M-7 -13 L-1 -2 L0 30 M0 2 C6 20 10 40 14 60 M0 2 C-5 20 -10 38 -18 52","none",o.condC||LC.elec,o.condW||2.2,";opacity:.95")+
  lzC(-46,-44,4.5,o.sinus||LC.elec,LC.elecD,1)+lzC(-7,-13,3.6,o.av||LC.elec,LC.elecD,1):"";
 return `<g transform="translate(${cx} ${cy}) scale(${s})">${vx}
  <path d="M0 76 C-34 56 -74 20 -74 -16 C-74 -50 -48 -66 -24 -62 C-12 -60 -4 -54 0 -48 C4 -54 12 -60 24 -62 C48 -66 74 -50 74 -16 C74 20 34 56 0 76 Z" style="fill:url(#rg-myo);stroke:rgba(90,30,25,.55);stroke-width:1.1"/>
  ${cav("od","M-58 -30 C-58 -46 -46 -48 -34 -48 C-20 -48 -10 -44 -10 -30 C-10 -18 -20 -14 -34 -14 C-48 -14 -58 -18 -58 -30 Z","#CBD5F2")}
  ${cav("og","M10 -31 C10 -45 22 -48 34 -48 C48 -48 58 -44 58 -31 C58 -19 48 -15 34 -15 C20 -15 10 -19 10 -31 Z","#F7CBC3")}
  ${cav("vd","M-8 -6 C-8 22 -12 44 -20 52 C-40 40 -58 16 -60 -6 Z","#CBD5F2")}
  ${cav("vg","M8 -6 C8 24 10 46 16 58 C40 42 58 16 60 -6 Z","#F7CBC3")}
  ${o.valves===false?"":lzP("M-56 -10 L-38 -4 M-12 -10 L-28 -4 M12 -10 L28 -4 M56 -10 L38 -4","none","#FFF6F2",2.2)}
  ${cond}${o.ex||""}</g>`;}
/* Poumons simplifiés (coordonnées propres, ≈150 × 120) */
function lzLungs(cx,cy,s,o={}){const L="M-12 -52 C-38 -50 -62 -16 -62 32 C-62 50 -48 54 -34 50 C-22 46 -14 42 -10 30 Z",R="M12 -52 C38 -50 62 -16 62 32 C62 50 48 54 34 50 C22 46 14 42 10 30 Z";
 return `<g transform="translate(${cx} ${cy}) scale(${s})">${lzP("M0 -78 L0 -40 M0 -40 L-18 -20 M0 -40 L18 -20","none","#C9B9B3",7)}${lzP("M0 -78 L0 -40 M0 -40 L-18 -20 M0 -40 L18 -20","none","#F2ECE8",4.5)}
  <path d="${L}" style="fill:url(#rg-lung);stroke:rgba(120,50,45,.45);stroke-width:1"/><path d="${R}" style="fill:url(#rg-lung);stroke:rgba(120,50,45,.45);stroke-width:1"/>${o.ex||""}</g>`;}
/* Silhouette humaine debout (hauteur ≈150, pieds en y+150) */
const LZ_BODY="M-5 10 L-21 19 Q-27 22 -28 31 L-31 77 L-25 78 L-21 36 L-18 44 L-17 84 L-15 148 L-4 148 L-1 92 L1 92 L4 148 L15 148 L17 84 L18 44 L21 36 L25 78 L31 77 L28 31 Q27 22 21 19 L5 10 Z";
const lzBody=(x,y,s,o={})=>`<g transform="translate(${x} ${y}) scale(${s})${o.rot?` rotate(${o.rot})`:""}"><circle cx="0" cy="0" r="11" style="fill:${o.skin||LC.skin};stroke:${LC.skinD};stroke-width:1"/><path d="${LZ_BODY}" style="fill:${o.skin||LC.skin};stroke:${LC.skinD};stroke-width:1"/>${o.ex||""}</g>`;
/* Étiquettes de bord : à gauche (texte depuis x=6, trait vers la droite), à droite (texte jusqu'à x=314, trait vers la gauche) */
const lzLL=(y,t,on,px,py)=>LB(6,y,t,on,"start",px,py);
const lzLR=(y,t,on,px,py)=>LB(314,y,t,on,"end",px,py);
/* globule rouge veineux (plus sombre) */
const lzRbcV=(x,y,r=4,a=0)=>`<g transform="translate(${lzN(x)} ${lzN(y)}) rotate(${Math.round(a)})"><ellipse rx="${r}" ry="${lzN(r*.62)}" style="fill:#A8423C;stroke:#6E1F1A;stroke-width:.6"/><ellipse rx="${lzN(r*.45)}" ry="${lzN(r*.24)}" style="fill:#C9706A;opacity:.8"/></g>`;
/* veine verticale avec valvules (ys : hauteurs des valvules ; open : valvules qui ne ferment plus) */
function lzVeinV(x,y,L,D,o={}){const ys=o.valves||[],gap=o.open?D*.22:0,R=lzRnd(o.seed||4);
 let s=lzR(x,y,D,L,0,LC.vein,LC.veinD,1)+lzR(x+3,y,D-6,L,0,o.lum||LC.veinL,"none");
 for(let i=0;i<(o.rbc==null?Math.round(L*D/240):o.rbc);i++)s+=lzRbcV(x+5+R()*(D-10),y+4+R()*(L-8),Math.min(3.6,D/6),R()*180);
 ys.forEach(v=>{s+=lzP(`M${x+3} ${v} Q${lzN(x+D*.28)} ${v-3} ${lzN(x+D/2-gap)} ${v-13} M${x+D-3} ${v} Q${lzN(x+D*.72)} ${v-3} ${lzN(x+D/2+gap)} ${v-13}`,"none","#8DA0DA",2.4);});
 return s;}
/* alvéole pulmonaire : air, liquide (eau), pus, détruite (emphysème) ; capillaires autour */
function lzAlv(cx,cy,r,mode="air",seed=3){const R=lzRnd(seed),cap=[...Array(6)].map((_,i)=>{const a=i*Math.PI/3+R()*.4;return lzP(`M${lzN(cx+Math.cos(a)*(r+1))} ${lzN(cy+Math.sin(a)*(r+1))} q${lzN(Math.cos(a+1.2)*6)} ${lzN(Math.sin(a+1.2)*6)} ${lzN(Math.cos(a+.6)*9)} ${lzN(Math.sin(a+.6)*9)}`,"none","#D8473A",1.6);}).join("");
 let inner="";
 if(mode==="eau")inner=`<path d="M${cx-r} ${cy+r*.05} q${r*.35} ${-r*.18} ${r*.7} 0 t${r*.7} 0 t${r*.6} 0 L${cx+r} ${cy+r} L${cx-r} ${cy+r} Z" style="fill:${LC.fluid};opacity:.9"/>`;
 if(mode==="plein")inner=lzC(cx,cy,r-1.5,LC.fluid,"none",0,";opacity:.85");
 if(mode==="pus")inner=lzC(cx,cy,r-1.5,"#F6E7B0","none")+lzDots(cx-r*.6,cy-r*.6,r*1.2,r*1.2,4,seed,(x,y)=>lzWbc(x,y,3.2))+lzDots(cx-r*.6,cy-r*.5,r*1.2,r*1.1,6,seed+3,lzCoc);
 return cap+`<defs><clipPath id="lza-${seed}-${Math.round(cx)}-${Math.round(cy)}"><circle cx="${cx}" cy="${cy}" r="${r-1.2}"/></clipPath></defs>`+lzC(cx,cy,r,mode==="detruit"?"#FBEDEA":LC.air,"#E7A39A",mode==="detruit"?1:1.8)+`<g clip-path="url(#lza-${seed}-${Math.round(cx)}-${Math.round(cy)})">${inner}</g>`;}
/* contour fermé lissé passant près des points (courbes de Bézier entre milieux) */
function lzSmooth(pts){const n=pts.length,m=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];let s=m(pts[n-1],pts[0]),d=`M${lzN(s[0])} ${lzN(s[1])}`;
 for(let i=0;i<n;i++){const p=pts[i],q=m(p,pts[(i+1)%n]);d+=` Q${lzN(p[0])} ${lzN(p[1])} ${lzN(q[0])} ${lzN(q[1])}`;}return d+" Z";}
