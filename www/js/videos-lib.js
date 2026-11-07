/* Carnet IFSI — vidéos animées des gestes techniques : moteur d'animation (images calculées en fonction du temps,
   ce qui permet pause, retour et avance), lecteur (lecture, étapes, barre de progression, vitesse, plein écran,
   sous-titres) et bibliothèque de dessins réutilisables. Les scénarios sont dans videos-soins.js.
   Chargé après outils.js et soins.js, avant app.js. */
const VID={};
const VD_W=480,VD_H=300;
/* ---------- Temps et interpolation ---------- */
const vC=u=>u<0?0:u>1?1:u;
const vE=u=>u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;
const vS=(t,a,b)=>vE(vC((t-a)/(b-a)));
const vL=(a,b,u)=>a+(b-a)*u;
const vK=(t,k)=>{if(t<=k[0][0])return k[0][1];for(let i=1;i<k.length;i++)if(t<=k[i][0]){const u=vE((t-k[i-1][0])/((k[i][0]-k[i-1][0])||1)),a=k[i-1][1],b=k[i][1];return Array.isArray(a)?a.map((x,j)=>vL(x,b[j],u)):vL(a,b,u);}return k[k.length-1][1];};
const vO=(t,per,amp=1)=>Math.sin(t*2*Math.PI/per)*amp;
const v1=n=>Math.round(n*10)/10;
const vG=(x,y,r,s,c)=>`<g transform="translate(${v1(x)} ${v1(y)})${r?` rotate(${v1(r)})`:""}${s!=null&&s!==1?` scale(${Math.round(s*1000)/1000})`:""}">${c}</g>`;
const vOp=(o,c)=>o>=.999?c:o<=.001?"":`<g opacity="${Math.round(o*100)/100}">${c}</g>`;

/* ---------- Palette ---------- */
const VC={ink:"#24323A",sub:"#5F6B72",line:"#C9C3B6",skin:"#EBC2A4",skinL:"#C4917A",skinD:"#DDAA8C",glove:"#9CC3EE",gloveL:"#5D88BF",
 blood:"#B3261E",vein:"#6F8FC8",metal:"#AEB8C2",metalL:"#6F7B86",plast:"#FFFFFF",plastL:"#93A0AC",liq:"#CFE8F7",acc:"#C0563B",ok:"#2C7451",
 warn:"#B03E30",gauze:"#FBFAF6",bg1:"#F6F1E8",bg2:"#ECE4D6",yellow:"#F2C94C",sterile:"#5BA7D8"};
const VD_DEFS=`<defs>
 <linearGradient id="vd-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${VC.bg1}"/><stop offset="1" stop-color="${VC.bg2}"/></linearGradient>
 <linearGradient id="vd-skin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2D0B6"/><stop offset=".55" stop-color="${VC.skin}"/><stop offset="1" stop-color="#D9A585"/></linearGradient>
 <linearGradient id="vd-glove" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C2DBF6"/><stop offset="1" stop-color="#86B1E3"/></linearGradient>
 <linearGradient id="vd-metal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E3E8EC"/><stop offset="1" stop-color="#9AA5AF"/></linearGradient>
 <radialGradient id="vd-bolus"><stop offset="0" stop-color="#7FC1EA" stop-opacity=".95"/><stop offset="1" stop-color="#7FC1EA" stop-opacity="0"/></radialGradient>
 <radialGradient id="vd-glow"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".9"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient>
 <radialGradient id="vd-red"><stop offset="0" stop-color="#E2564B" stop-opacity=".55"/><stop offset="1" stop-color="#E2564B" stop-opacity="0"/></radialGradient>
 <filter id="vd-sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="2.2" flood-color="#3A2A1A" flood-opacity=".18"/></filter>
</defs>`;
const vBg=(tone)=>`<rect width="${VD_W}" height="${VD_H}" fill="url(#vd-bg)"/>${tone==="table"?`<rect y="232" width="${VD_W}" height="68" fill="#E2D7C4"/><path d="M0 232H480" stroke="#D2C4AC"/>`:""}`;

/* ---------- Textes, étiquettes, pictos ---------- */
const vEsc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
function vT(x,y,txt,o={}){const L=String(txt).split("\n"),s=o.s||12,lh=s*1.2;
 return `<text x="${v1(x)}" y="${v1(y)}" text-anchor="${o.a||"middle"}" font-size="${s}" font-weight="${o.w||600}" fill="${o.f||VC.ink}"${o.it?' font-style="italic"':""}>${L.map((l,i)=>`<tspan x="${v1(x)}" dy="${i?lh:0}">${vEsc(l)}</tspan>`).join("")}</text>`;}
function vTag(x,y,txt,o={}){const s=o.s||11,w=o.w||Math.round(String(txt).length*s*.56+16),h=s+10,bg=o.bg||"#FFFFFF",fg=o.f||VC.ink;x=Math.max(w/2+6,Math.min(VD_W-w/2-6,x));
 return `<g filter="url(#vd-sh)"><rect x="${v1(x-w/2)}" y="${v1(y-h/2)}" width="${w}" height="${h}" rx="${h/2}" fill="${bg}" stroke="${o.st||"none"}"/></g>${vT(x,y+s*.36,txt,{s,f:fg,w:o.fw||700})}`;}
function vAr(x1,y1,x2,y2,o={}){const c=o.c||VC.acc,w=o.w||2.4,a=Math.atan2(y2-y1,x2-x1),h=o.h||8;
 const p=(da)=>`${v1(x2-h*Math.cos(a+da))} ${v1(y2-h*Math.sin(a+da))}`;
 return `<path d="M${v1(x1)} ${v1(y1)}L${v1(x2)} ${v1(y2)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" fill="none"${o.dash?' stroke-dasharray="4 4"':""}/><path d="M${p(.5)}L${v1(x2)} ${v1(y2)}L${p(-.5)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;}
function vCheck(x,y,u,r=15){if(u<=0)return "";return `<g opacity="${v1(Math.min(1,u*2))}"><circle cx="${x}" cy="${y}" r="${r}" fill="${VC.ok}"/><path d="M${x-r*.45} ${y}l${r*.32} ${r*.32} ${r*.6}-${r*.62}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${v1(1-vC(u*1.4-.3))}" stroke="#fff" stroke-width="${r*.22}" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;}
function vNo(x,y,u,r=15){if(u<=0)return "";return `<g opacity="${v1(Math.min(1,u*2))}"><circle cx="${x}" cy="${y}" r="${r}" fill="${VC.warn}"/><path d="M${x-r*.4} ${y-r*.4}l${r*.8} ${r*.8}M${x+r*.4} ${y-r*.4}l-${r*.8} ${r*.8}" stroke="#fff" stroke-width="${r*.2}" stroke-linecap="round"/></g>`;}
function vStrike(x,y,w,u){return u>0?`<path d="M${x-w/2} ${y+w/2}L${v1(x-w/2+w*u)} ${v1(y+w/2-w*u)}" stroke="${VC.warn}" stroke-width="5" stroke-linecap="round"/>`:"";}
function vTimer(x,y,u,txt,o={}){const r=o.r||22,C=2*Math.PI*r;
 return `<g filter="url(#vd-sh)"><circle cx="${x}" cy="${y}" r="${r+6}" fill="#fff"/></g><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#E6DED0" stroke-width="5"/><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${o.c||VC.acc}" stroke-width="5" stroke-dasharray="${v1(C*vC(u))} ${v1(C)}" transform="rotate(-90 ${x} ${y})" stroke-linecap="round"/>${vT(x,y+4.5,txt,{s:o.s||12,w:800})}`;}
function vPanel(x,y,w,h,c,o={}){return `<g filter="url(#vd-sh)"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r||14}" fill="${o.bg||"#FFFFFF"}" stroke="${o.st||"#E4DCCD"}"/></g>${c||""}`;}
function vZoom(x,y,r,c,o={}){const id="vz"+Math.round(x)+"_"+Math.round(y);
 return `<defs><clipPath id="${id}"><circle cx="${x}" cy="${y}" r="${r}"/></clipPath></defs><g filter="url(#vd-sh)"><circle cx="${x}" cy="${y}" r="${r+4}" fill="#fff"/></g><g clip-path="url(#${id})"><circle cx="${x}" cy="${y}" r="${r}" fill="${o.bg||"#FBF8F2"}"/>${c}</g><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${o.st||VC.acc}" stroke-width="2.5"/>`;}
/* Document (prescription, fiche, étiquette) avec lignes cochées progressivement. */
function vDoc(x,y,o={}){const lines=o.lines||[],w=Math.max(o.w||150,Math.max(0,...lines.map(l=>String(l).length))*6.2+50,String(o.title||"").length*7+30),u=o.u==null?1:o.u,h=o.h||(36+lines.length*22);
 return vPanel(x,y,w,h,`${o.title?vT(x+12,y+21,o.title,{a:"start",s:12,w:800}):""}<path d="M${x+12} ${y+30}H${x+w-12}" stroke="#E6DED0"/>${lines.map((l,i)=>{const yy=y+48+i*22,on=vC(u*lines.length-i);
  return `${vCheck(x+20,yy-4,on,8)}${on<=0?`<circle cx="${x+20}" cy="${yy-4}" r="7" fill="none" stroke="#CFC6B6" stroke-width="1.6"/>`:""}${vT(x+34,yy,l,{a:"start",s:11,w:600,f:VC.ink})}`;}).join("")}`,{r:10});}
/* Bulle de dialogue. */
function vBubble(x,y,txt,o={}){const s=o.s||11.5,L=String(txt).split("\n"),w=o.w||Math.max(...L.map(l=>l.length))*s*.55+22,h=L.length*s*1.25+14,tl=o.tail||"left";
 const tx=tl==="left"?x+14:tl==="right"?x+w-14:x+w/2;
 return `<g filter="url(#vd-sh)"><rect x="${x}" y="${y}" width="${v1(w)}" height="${v1(h)}" rx="12" fill="#fff"/><path d="M${tx-7} ${y+h-1}L${tx-(tl==="right"?-10:10)} ${y+h+12}L${tx+7} ${y+h-1}Z" fill="#fff"/></g>${vT(x+w/2,y+s+5,txt,{s,w:600})}`;}

/* ---------- Corps et mains ---------- */
/* Avant-bras horizontal, coude à gauche, main à droite. y = axe. swell : veines gonflées (garrot). */
function aArm(o={}){const y=o.y==null?170:o.y,dy=y-170,sw=o.swell||0;
 const vc=sw>0?`rgb(${v1(vL(150,90,sw))},${v1(vL(172,120,sw))},${v1(vL(214,196,sw))})`:"#9DB2D8",vw=vL(3.2,6.2,sw),vo=vL(.55,.92,sw);
 const arm=`<path d="M-40 ${128+dy}C40 125 ${120} 129 ${200} ${135+dy}S300 ${143+dy} 334 ${147+dy}L334 ${193+dy}C300 ${196+dy} 250 ${200+dy} 200 ${204+dy}S60 ${212+dy} -40 ${215+dy}Z" fill="url(#vd-skin)" stroke="${VC.skinL}" stroke-width="1.4"/>`;
 const hand=`<path d="M332 ${146+dy}C350 ${140+dy} 380 ${142+dy} 412 ${148+dy}L420 ${190+dy}C392 ${198+dy} 356 ${199+dy} 332 ${194+dy}Z" fill="url(#vd-skin)" stroke="${VC.skinL}" stroke-width="1.4"/>
  ${[150,161,172,183].map((fy,i)=>`<rect x="404" y="${fy+dy-1}" width="${54-i*4}" height="11.5" rx="5.7" fill="url(#vd-skin)" stroke="${VC.skinL}" stroke-width="1.2"/>`).join("")}
  <g transform="translate(352 ${142+dy}) rotate(-24)"><rect x="0" y="-6" width="46" height="13" rx="6.5" fill="url(#vd-skin)" stroke="${VC.skinL}" stroke-width="1.2"/></g>`;
 const veins=`<g fill="none" stroke="${vc}" stroke-width="${v1(vw)}" stroke-linecap="round" opacity="${v1(vo)}"><path d="M-40 ${160+dy}C30 ${158+dy} 70 ${152+dy} 112 ${156+dy}S220 ${168+dy} 334 ${164+dy}"/><path d="M112 ${156+dy}C150 ${146+dy} 200 ${145+dy} 262 ${150+dy}" stroke-width="${v1(vw*.8)}"/><path d="M40 ${186+dy}C90 ${184+dy} 150 ${190+dy} 230 ${186+dy}" stroke-width="${v1(vw*.7)}"/></g>`;
 const crease=`<path d="M86 ${146+dy}Q100 ${154+dy} 116 ${146+dy}" fill="none" stroke="${VC.skinL}" stroke-width="1.2" opacity=".6"/>`;
 return arm+hand+(o.noVein?"":veins)+crease;}
/* Main gantée qui pince (bout des doigts à l'origine, poignet vers +x). */
function aHand(x,y,r=0,o={}){const g=o.bare?"url(#vd-skin)":"url(#vd-glove)",l=o.bare?VC.skinL:VC.gloveL;
 return vG(x,y,r,o.s||1,`<path d="M70 -26L118 -34L124 10L74 14Z" fill="#FFFFFF" stroke="#C9CED3" stroke-width="1.2"/>
  <path d="M-1 -2C6 -12 20 -18 34 -23L62 -26C74 -24 78 -11 73 2L66 13C52 21 26 17 9 10C3 7 -2 4 -1 -2Z" fill="${g}" stroke="${l}" stroke-width="1.4"/>
  <path d="M2 5C11 12 24 15 34 13" fill="none" stroke="${l}" stroke-width="1.2"/><path d="M10 -11C24 -14 40 -17 54 -18M16 -4C30 -6 44 -8 58 -9" fill="none" stroke="${l}" stroke-width="1" opacity=".6"/>`);}
/* Main ouverte, paume vers le haut (pour recevoir le produit). */
function aPalm(x,y,r=0,o={}){const g=o.glove?"url(#vd-glove)":"url(#vd-skin)",l=o.glove?VC.gloveL:VC.skinL;
 return vG(x,y,r,o.s||1,`<path d="M-30 30C-34 8 -30 -12 -24 -40C-22 -48 -12 -48 -12 -40L-10 -14L-8 -52C-7 -61 4 -61 4 -52L5 -16L8 -56C9 -65 20 -64 20 -55L19 -14L24 -46C26 -54 36 -52 35 -44L30 -4C38 -16 48 -22 54 -16C58 -12 52 -2 44 8C34 22 24 34 6 40C-10 44 -26 42 -30 30Z" fill="${g}" stroke="${l}" stroke-width="1.5"/>`);}
/* Silhouette humaine simplifiée (face ou dos), points mis en évidence. */
function aBody(x,y,o={}){const s=o.s||1,skin="url(#vd-skin)",st=VC.skinL,cl=o.cloth||"#DCE6EE";
 const body=`<circle cx="0" cy="-118" r="19" fill="${skin}" stroke="${st}" stroke-width="1.4"/><path d="M-9 -100L-8 -92H8L9 -100" fill="${skin}" stroke="${st}"/>
  <path d="M-34 -90C-20 -96 20 -96 34 -90L40 -20C30 -14 -30 -14 -40 -20Z" fill="${cl}" stroke="#AFC1CF" stroke-width="1.4"/>
  <path d="M-34 -88C-46 -80 -50 -50 -52 -18L-44 -16C-40 -44 -36 -62 -30 -70" fill="${skin}" stroke="${st}" stroke-width="1.4"/><path d="M34 -88C46 -80 50 -50 52 -18L44 -16C40 -44 36 -62 30 -70" fill="${skin}" stroke="${st}" stroke-width="1.4"/>
  <path d="M-38 -20H38L36 6L24 100H6L1 22H-1L-6 100H-24L-36 6Z" fill="${o.legs||"#BFD0DE"}" stroke="#9FB2C2" stroke-width="1.4"/>`;
 const pts=(o.pts||[]).map(p=>`<g opacity="${v1(p.u==null?1:p.u)}"><circle cx="${p.x}" cy="${p.y}" r="${p.r||9}" fill="${p.c||VC.acc}" opacity=".28"/><circle cx="${p.x}" cy="${p.y}" r="${(p.r||9)*.45}" fill="${p.c||VC.acc}"/></g>`).join("");
 return vG(x,y,0,s,body+(o.extra||"")+pts);}

/* ---------- Matériel ---------- */
/* Seringue : pointe à l'origine, corps vers +x. fill : position du piston (0 = vide, 1 = pleine). */
function aSyringe(x,y,r,o={}){const L=o.len||72,nl=o.nl==null?30:o.nl,f=vC(o.fill==null?.7:o.fill),b0=nl+8,st=b0+L*f,lc=o.liq||VC.liq;
 return vG(x,y,r,o.s||1,`${nl?`<path d="M0 0H${nl}" stroke="#8794A0" stroke-width="2.6"/><path d="M0 0L5 -1.6" stroke="#5E6A75" stroke-width="1.2"/>`:""}
  <rect x="${nl}" y="-4.5" width="9" height="9" rx="1.5" fill="${o.hub||"#E8E2D4"}" stroke="#A69F90"/>
  <rect x="${b0}" y="-9" width="${L}" height="18" rx="3" fill="#FFFFFF" fill-opacity=".85" stroke="${VC.plastL}" stroke-width="1.3"/>
  <rect x="${b0+1}" y="-7.5" width="${v1(Math.max(0,L*f-1))}" height="15" fill="${lc}"/>
  ${[.2,.4,.6,.8].map(g=>`<path d="M${v1(b0+L*g)} -9v5" stroke="#9AA6B1" stroke-width=".9"/>`).join("")}
  ${o.bubble?`<circle cx="${v1(b0+L*f-5)}" cy="-3" r="3" fill="#fff" stroke="#9AA6B1" stroke-width=".8"/>`:""}
  <rect x="${v1(st)}" y="-8" width="5" height="16" fill="#3E474F"/><rect x="${v1(st+5)}" y="-2.2" width="${L+4}" height="4.4" fill="#D9DEE3" stroke="#AEB6BE" stroke-width=".6"/>
  <rect x="${v1(st+L+9)}" y="-11" width="4.5" height="22" rx="1.5" fill="#D9DEE3" stroke="#9AA6B1"/>
  <rect x="${b0+L-2}" y="-15" width="4" height="30" rx="1.5" fill="#E9EDF0" stroke="#9AA6B1"/>${o.label?`<rect x="${b0+10}" y="-8" width="${L*.45}" height="9" rx="1" fill="#FFF6C9" stroke="#C9A227" stroke-width=".7"/>`:""}`);}
/* Corps de pompe (prélèvement sous vide), pointe à l'origine ; tube : {cap, fill, in (0-1)} */
function aHolder(x,y,r,o={}){const nl=o.nl==null?26:o.nl,t=o.tube;
 const tube=t?`<g transform="translate(${v1(nl+30+30*(1-vC(t.in==null?1:t.in)))} 0)"><rect x="12" y="-8" width="70" height="16" rx="7" fill="#FFFFFF" fill-opacity=".85" stroke="#9AA6B1"/><rect x="14" y="-6" width="${v1(64*vC(t.fill||0))}" height="12" rx="5" fill="${VC.blood}"/><rect x="0" y="-10" width="16" height="20" rx="3" fill="${t.cap}" stroke="rgba(0,0,0,.25)"/></g>`:"";
 return vG(x,y,r,o.s||1,`<path d="M0 0H${nl+10}" stroke="#8794A0" stroke-width="2.6"/><rect x="${nl}" y="-5" width="10" height="10" rx="2" fill="#F1C24B" stroke="#B48A1E"/>
  ${tube}<rect x="${nl+8}" y="-12" width="58" height="24" rx="4" fill="#F4F7F9" fill-opacity=".55" stroke="#8D9BA7" stroke-width="1.3"/><rect x="${nl+62}" y="-17" width="5" height="34" rx="2" fill="#E6EBEF" stroke="#8D9BA7"/>`);}
/* Tube de prélèvement vertical : bouchon en haut. */
function aTube(x,y,o={}){const h=o.h||70,f=vC(o.fill||0);
 return vG(x,y,o.r||0,o.s||1,`<rect x="-8" y="0" width="16" height="${h}" rx="7" fill="#FFFFFF" fill-opacity=".85" stroke="#9AA6B1" stroke-width="1.2"/><rect x="-6" y="${v1(h-2-(h-6)*f)}" width="12" height="${v1((h-6)*f)}" rx="5" fill="${o.liq||VC.blood}"/><rect x="-10" y="-14" width="20" height="16" rx="3" fill="${o.cap}" stroke="rgba(0,0,0,.25)"/>${o.label?`<rect x="-6.5" y="16" width="13" height="26" rx="1.5" fill="#FFFFFF" stroke="#C9C3B6" stroke-width=".8"/><path d="M-4 22h8M-4 27h8M-4 32h5" stroke="#9AA6B1" stroke-width="1"/>`:""}`);}
function aGarrot(x,y,h,o={}){const sq=o.tight||0;
 return `<rect x="${x-8}" y="${y-h/2-4}" width="16" height="${h+8}" rx="5" fill="#4C8C7B" stroke="#2F6456" stroke-width="1.2"/>${[0,1,2].map(i=>`<path d="M${x-8} ${v1(y-h/2+8+i*((h-16)/2))}h16" stroke="#3A7465" stroke-width="1" opacity=".7"/>`).join("")}<rect x="${x-12}" y="${y-h/2-16}" width="24" height="15" rx="4" fill="#2F3A45"/><rect x="${x-6}" y="${y-h/2-13}" width="12" height="4" rx="2" fill="#7B8792"/>${sq?`<path d="M${x-16} ${y-h/2+2}l-6 -4M${x+16} ${y-h/2+2}l6 -4M${x-16} ${y+h/2-2}l-6 4M${x+16} ${y+h/2-2}l6 4" stroke="${VC.acc}" stroke-width="2" stroke-linecap="round" opacity="${v1(sq)}"/>`:""}`;}
function aGauze(x,y,r=0,o={}){const s=o.size||34,c=o.wet?`<rect x="${-s/2+3}" y="${-s/2+3}" width="${s-6}" height="${s-6}" rx="3" fill="${o.wet}" opacity=".45"/>`:"";
 return vG(x,y,r,o.s||1,`<rect x="${-s/2}" y="${-s/2}" width="${s}" height="${s}" rx="3" fill="${VC.gauze}" stroke="#CFC8BA" stroke-width="1.1"/>${c}${[1,2,3].map(i=>`<path d="M${v1(-s/2+i*s/4)} ${-s/2+2}V${s/2-2}M${-s/2+2} ${v1(-s/2+i*s/4)}H${s/2-2}" stroke="#E2DCCF" stroke-width=".8"/>`).join("")}`);}
function aCollector(x,y,o={}){const op=o.open==null?1:o.open;
 return vG(x,y,0,o.s||1,`<g filter="url(#vd-sh)"><path d="M-30 -24H30L26 34H-26Z" fill="${VC.yellow}" stroke="#B48A1E" stroke-width="1.4"/></g><rect x="-33" y="-34" width="66" height="12" rx="3" fill="#E2B33A" stroke="#B48A1E"/><rect x="${v1(-10-op*0)}" y="-32" width="20" height="5" rx="2" fill="${op>.5?"#3E474F":"#C9A02F"}"/>
  <path d="M-12 -4l12 -12 12 12M-6 0h12" stroke="#7A5A0A" stroke-width="1.6" fill="none" stroke-linecap="round"/>${vT(0,22,"DASRI",{s:9,w:800,f:"#7A5A0A"})}`);}
function aBottle(x,y,o={}){return vG(x,y,o.r||0,o.s||1,`<rect x="-14" y="-30" width="28" height="60" rx="10" fill="${o.c||"#F4F7F9"}" fill-opacity=".9" stroke="#8D9BA7" stroke-width="1.3"/><rect x="-8" y="-44" width="16" height="16" rx="3" fill="${o.cap||"#3E8E7E"}"/>${o.label?vT(0,4,o.label,{s:8,w:800,f:VC.ink}):""}${o.fill?`<rect x="-11" y="${v1(27-40*o.fill)}" width="22" height="${v1(40*o.fill)}" rx="5" fill="${o.liq||VC.blood}" opacity=".85"/>`:""}`);}
/* Cathéter veineux périphérique : pointe à l'origine. adv : avancée du cathéter sur l'aiguille ; out : retrait du mandrin ; flash : reflux. */
function aCath(x,y,r,o={}){const col=o.col||"#E9A3B4",adv=vC(o.adv||0),out=vC(o.out||0),fl=vC(o.flash||0);
 const nOff=out*120,cTip=-adv*20;
 const needle=`<g transform="translate(${v1(nOff)} 0)"><path d="M0 0H90" stroke="#8794A0" stroke-width="2.4"/><path d="M0 0L5 -1.8" stroke="#5E6A75"/><rect x="80" y="-6" width="18" height="12" rx="2" fill="#F4F7F9" fill-opacity=".7" stroke="#9AA6B1"/><rect x="82" y="-4" width="${v1(14*fl)}" height="8" fill="${VC.blood}"/><rect x="98" y="-7" width="28" height="14" rx="3" fill="#EEF1F4" stroke="#9AA6B1"/><path d="M104 -7v14M110 -7v14M116 -7v14" stroke="#C9D0D6"/></g>`;
 const cath=`<g transform="translate(${v1(cTip)} 0)"><path d="M5 -1.8H66V1.8H5Z" fill="#FFFFFF" fill-opacity=".8" stroke="#B9C2CA" stroke-width=".7"/><path d="M66 -5L80 -6V6L66 5Z" fill="${col}" stroke="rgba(0,0,0,.25)"/><path d="M70 -6L66 -16H78L76 -6M70 6L66 16H78L76 6" fill="${col}" stroke="rgba(0,0,0,.2)"/></g>`;
 return vG(x,y,r,o.s||1,(out<1?needle:"")+cath);}
/* Poche de perfusion (crochet en haut), level 0-1. */
function aBag(x,y,o={}){const lv=vC(o.level==null?.85:o.level),c=o.liq||VC.liq;
 return vG(x,y,0,o.s||1,`<path d="M0 -12V0" stroke="#7B8792" stroke-width="2"/><circle cx="0" cy="-14" r="4" fill="none" stroke="#7B8792" stroke-width="2"/>
  <g filter="url(#vd-sh)"><path d="M-30 4H30C34 4 36 8 36 12V82C36 92 26 100 12 102H-12C-26 100 -36 92 -36 82V12C-36 8 -34 4 -30 4Z" fill="#FFFFFF" fill-opacity=".9" stroke="#9AA6B1" stroke-width="1.3"/></g>
  <path d="M-33 ${v1(98-84*lv)}H33V82C33 90 24 97 12 99H-12C-24 97 -33 90 -33 82Z" fill="${c}" opacity=".9"/>
  <rect x="-24" y="18" width="48" height="26" rx="3" fill="#FFFFFF" stroke="#C9C3B6" stroke-width=".8"/>${vT(0,30,o.label||"NaCl 0,9 %",{s:7.5,w:800})}${vT(0,40,o.vol||"500 mL",{s:7,w:600,f:VC.sub})}
  ${o.tag?`<rect x="-24" y="48" width="48" height="16" rx="2" fill="#FFF6C9" stroke="#C9A227" stroke-width=".8"/>${vT(0,59,o.tag,{s:6.5,w:700})}`:""}
  <rect x="-8" y="100" width="7" height="12" rx="2" fill="#EEF1F4" stroke="#9AA6B1"/><rect x="2" y="100" width="7" height="9" rx="2" fill="#5BA7D8" stroke="#3E7FAE"/>`);}
/* Chambre compte-gouttes : level 0-1, ph : phase de la goutte (0-1, null = pas de goutte). */
function aChamber(x,y,o={}){const lv=vC(o.level||0),ph=o.ph;
 const drop=ph==null?"":`<ellipse cx="0" cy="${v1(-20+34*ph)}" rx="2.6" ry="3.4" fill="#8CC4E8" opacity="${v1(ph<.92?1:0)}"/>`;
 return vG(x,y,0,o.s||1,`<rect x="-5" y="-30" width="10" height="8" rx="2" fill="#EEF1F4" stroke="#9AA6B1"/><rect x="-11" y="-22" width="22" height="46" rx="6" fill="#FFFFFF" fill-opacity=".85" stroke="#9AA6B1" stroke-width="1.2"/><rect x="-9" y="${v1(22-30*lv)}" width="18" height="${v1(30*lv)}" rx="4" fill="${o.liq||VC.liq}"/>${drop}<rect x="-4" y="24" width="8" height="6" rx="1.5" fill="#EEF1F4" stroke="#9AA6B1"/>`);}
/* Tubulure le long d'un chemin, remplie sur une fraction 'flow'. */
function aLine(d,o={}){const f=vC(o.flow==null?1:o.flow);
 return `<path d="${d}" fill="none" stroke="#DCE3E8" stroke-width="5" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>${f>0?`<path d="${d}" pathLength="1" stroke-dasharray="${v1(f*1000)/1000} 1" fill="none" stroke="${o.liq||"#8CC4E8"}" stroke-width="3" stroke-linecap="round"/>`:""}`;}
function aRoller(x,y,o={}){const op=vC(o.open||0);return vG(x,y,o.r||0,1,`<rect x="-10" y="-16" width="20" height="32" rx="4" fill="#FFFFFF" stroke="#8D9BA7" stroke-width="1.2"/><circle cx="${v1(-2+4*op)}" cy="${v1(8-16*op)}" r="6" fill="#5BA7D8" stroke="#3E7FAE"/>`);}
/* Pousse-seringue électrique. */
function aPSE(x,y,o={}){const p=vC(o.push||0),f=vC(o.fill==null?.8:o.fill);
 return vG(x,y,0,o.s||1,`<g filter="url(#vd-sh)"><rect x="-110" y="-10" width="220" height="74" rx="10" fill="#EEF1F4" stroke="#AEB8C2" stroke-width="1.3"/></g>
  <rect x="-96" y="10" width="88" height="40" rx="5" fill="#16323B"/>${vT(-52,28,o.l1||"",{s:11,w:800,f:"#9FF0C4"})}${vT(-52,43,o.l2||"",{s:8.5,w:600,f:"#9FF0C4"})}
  <circle cx="20" cy="30" r="9" fill="${o.run?"#2C7451":"#C9D0D6"}"/>${vT(20,33.5,"▶",{s:9,f:"#fff"})}<circle cx="46" cy="30" r="9" fill="#C9D0D6"/>${vT(46,33.5,"II",{s:8,f:"#fff"})}<circle cx="72" cy="30" r="9" fill="#C9D0D6"/>${vT(72,33.5,"OK",{s:6.5,f:"#fff"})}
  ${o.syr===false?"":vG(-96,-24,0,1,`<rect x="0" y="-9" width="150" height="18" rx="4" fill="#FFFFFF" fill-opacity=".85" stroke="#93A0AC" stroke-width="1.2"/><rect x="2" y="-7" width="${v1(146*f*(1-p*.6))}" height="14" fill="${o.liq||VC.liq}"/>${o.label?`<rect x="30" y="-7" width="54" height="9" fill="#FFF6C9" stroke="#C9A227" stroke-width=".6"/>`:""}<rect x="${v1(146*f*(1-p*.6))}" y="-8" width="4" height="16" fill="#3E474F"/><rect x="${v1(150*f*(1-p*.6)+4)}" y="-2" width="60" height="4" fill="#D9DEE3"/><rect x="${v1(150*f*(1-p*.6)+60)}" y="-14" width="14" height="28" rx="3" fill="#7B8792"/><rect x="146" y="-14" width="5" height="28" rx="1.5" fill="#E9EDF0" stroke="#9AA6B1"/>`)}`);}
/* Lecteur de glycémie. */
function aMeter(x,y,o={}){return vG(x,y,o.r||0,o.s||1,`<g filter="url(#vd-sh)"><rect x="-34" y="-52" width="68" height="104" rx="16" fill="#3E4A55"/></g><rect x="-24" y="-40" width="48" height="36" rx="5" fill="#CFE9D8"/>${vT(0,-16,o.v||"",{s:o.vs||13,w:800,f:"#14322A"})}${vT(0,-6,o.u||"",{s:6.5,w:700,f:"#14322A"})}<circle cx="-11" cy="18" r="7" fill="#5E6B77"/><circle cx="11" cy="18" r="7" fill="#5E6B77"/>${o.strip?`<rect x="-6" y="48" width="12" height="${o.strip}" rx="2" fill="#F4F7F9" stroke="#9AA6B1"/><rect x="-3" y="${48+o.strip-8}" width="6" height="6" rx="1" fill="#E0B13D"/>`:""}`);}
/* Doigt vu de face (pulpe vers le spectateur), bout en haut. */
function aFinger(x,y,o={}){return vG(x,y,o.r||0,o.s||1,`<path d="M-22 120V-20C-22 -46 22 -46 22 -20V120Z" fill="url(#vd-skin)" stroke="${VC.skinL}" stroke-width="1.5"/><path d="M-12 30Q0 36 12 30M-12 40Q0 46 12 40" fill="none" stroke="${VC.skinL}" opacity=".5"/><path d="M-10 -32C-4 -38 4 -38 10 -32" fill="none" stroke="${VC.skinL}" opacity=".4"/>`);}
function aDrop(x,y,r){return r>0?`<path d="M${x} ${v1(y-r*1.5)}C${v1(x+r*.6)} ${v1(y-r*.6)} ${v1(x+r)} ${v1(y-r*.1)} ${v1(x+r)} ${y}A${r} ${r} 0 0 1 ${v1(x-r)} ${y}C${v1(x-r)} ${v1(y-r*.1)} ${v1(x-r*.6)} ${v1(y-r*.6)} ${x} ${v1(y-r*1.5)}Z" fill="${VC.blood}"/><circle cx="${v1(x-r*.35)}" cy="${v1(y-r*.2)}" r="${v1(r*.22)}" fill="#fff" opacity=".55"/>`:"";}
function aLancet(x,y,r,o={}){return vG(x,y,r,o.s||1,`<rect x="0" y="-9" width="58" height="18" rx="8" fill="#5BA7D8" stroke="#3E7FAE"/><rect x="-6" y="-5" width="8" height="10" rx="2" fill="#E9EDF0" stroke="#9AA6B1"/><circle cx="40" cy="0" r="4" fill="#E9EDF0"/>`);}
/* Flacon à bouchon (poudre ou solution) et ampoule. */
function aVial(x,y,o={}){const pw=o.powder==null?0:o.powder,lq=vC(o.liq||0);
 return vG(x,y,o.r||0,o.s||1,`<rect x="-20" y="-14" width="40" height="54" rx="8" fill="#FFFFFF" fill-opacity=".85" stroke="#8D9BA7" stroke-width="1.3"/>${lq?`<rect x="-17" y="${v1(37-46*lq)}" width="34" height="${v1(46*lq)}" rx="6" fill="${o.lc||VC.liq}"/>`:""}${pw?`<path d="M-17 37V${v1(37-12*pw)}Q0 ${v1(28-12*pw)} 17 ${v1(37-12*pw)}V37Z" fill="#FFFFFF" stroke="#D8D2C6" opacity="${v1(pw)}"/>`:""}
  <rect x="-12" y="-24" width="24" height="12" rx="2" fill="#B8C2CB" stroke="#7B8792"/><rect x="-9" y="-30" width="18" height="7" rx="2" fill="${o.cap||"#C0563B"}"/>${o.label?`<rect x="-17" y="4" width="34" height="16" rx="2" fill="#FFFFFF" stroke="#C9C3B6" stroke-width=".7"/>${vT(0,15,o.label,{s:6.5,w:800})}`:""}`);}
function aAmpoule(x,y,o={}){const br=vC(o.broken||0);
 return vG(x,y,o.r||0,o.s||1,`<path d="M-12 60V0C-12 -8 -5 -10 -5 -18V-22C-5 -26 5 -26 5 -22V-18C5 -10 12 -8 12 0V60C12 66 -12 66 -12 60Z" fill="#FFFFFF" fill-opacity=".8" stroke="#8D9BA7" stroke-width="1.2"/><rect x="-10" y="14" width="20" height="44" rx="4" fill="${VC.liq}"/>
  <g transform="translate(${v1(br*14)} ${v1(-br*18)}) rotate(${v1(br*35)})"><path d="M-5 -22C-6 -34 -9 -38 -9 -46C-9 -54 9 -54 9 -46C9 -38 6 -34 5 -22Z" fill="#FFFFFF" fill-opacity=".8" stroke="#8D9BA7" stroke-width="1.2"/></g><circle cx="0" cy="-22" r="1.6" fill="${VC.acc}"/>`);}
/* Coupe de peau : épiderme, derme, hypoderme, muscle. fold : pli cutané (0-1) ; bump : papule. */
function aSkin(o={}){const x0=o.x==null?30:o.x,y0=o.y==null?118:o.y,w=o.w||420,cx=o.cx==null?x0+w/2:o.cx,fold=o.fold||0,bump=o.bump||0;
 const off=x=>-(fold*58*Math.exp(-Math.pow((x-cx)/62,2)))-(bump*9*Math.exp(-Math.pow((x-(o.bx==null?cx:o.bx))/18,2)));
 const ln=(d,k)=>{let s="";for(let x=x0;x<=x0+w;x+=10){const y=y0+d+off(x)*k;s+=(x===x0?"M":"L")+x+" "+v1(y);}return s;};
 const band=(d1,k1,d2,k2,fill)=>{let a=ln(d1,k1),b="";for(let x=x0+w;x>=x0;x-=10)b+="L"+x+" "+v1(y0+d2+off(x)*k2);return `<path d="${a}${b}Z" fill="${fill}"/>`;};
 const H=o.h||172,lab=o.lab!==false;
 const fat=[...Array(16)].map((_,i)=>{const fx=x0+18+i*(w-30)/15,fy=y0+52+((i%2)*10)+off(fx)*.6;return `<ellipse cx="${v1(fx)}" cy="${v1(fy)}" rx="11" ry="8" fill="#FBECB8" stroke="#E9D38D" stroke-width=".8"/>`;}).join("");
 const mus=[...Array(12)].map((_,i)=>`<path d="M${x0+i*36} ${y0+96}l26 ${H-100}" stroke="#C57469" stroke-width="1" opacity=".45"/>`).join("");
 const vein=o.vein?`<rect x="${x0}" y="${y0+o.vein}" width="${w}" height="16" rx="8" fill="#7C8FC9" stroke="#55689F" stroke-width="1"/><rect x="${x0}" y="${y0+o.vein+4}" width="${w}" height="8" rx="4" fill="#9E3A3A" opacity=".55"/>`:"";
 const art=o.artery?`<rect x="${x0}" y="${y0+o.artery}" width="${w}" height="14" rx="7" fill="#D9584F" stroke="#A3352E" stroke-width="1"/>`:"";
 return `${band(H,0,86,.25,"#D98C7E")}${mus}${band(86,.25,30,.85,"#F7E6A8")}${fat}${band(30,.85,9,1,"#EEBBA2")}${band(9,1,0,1,"#F4D4BF")}${vein}${art}
  <path d="${ln(0,1)}" fill="none" stroke="${VC.skinL}" stroke-width="1.4"/>
  ${lab?`${vT(x0+8,y0+7,"Épiderme",{a:"start",s:8,w:700,f:"#8A5A44"})}${vT(x0+8,y0+23,"Derme",{a:"start",s:8.5,w:700,f:"#8A5A44"})}${vT(x0+8,y0+56,"Hypoderme",{a:"start",s:8.5,w:700,f:"#8A6A14"})}${vT(x0+8,y0+122,"Muscle",{a:"start",s:8.5,w:700,f:"#7E2F28"})}`:""}`;}
const vSkinY=(o,x,depth)=>{const y0=o.y==null?118:o.y,cx=o.cx==null?(o.x==null?30:o.x)+(o.w||420)/2:o.cx;return y0+depth-((o.fold||0)*58*Math.exp(-Math.pow((x-cx)/62,2)))*(depth<9?1:depth<30?.85:.6);};
function aBolus(x,y,r,o={}){return r>0?`<ellipse cx="${v1(x)}" cy="${v1(y)}" rx="${v1(r*(o.k||1.3))}" ry="${v1(r)}" fill="url(#${o.g||"vd-bolus"})"/>`:"";}
/* Plaie suturée (fils ou agrafes) vue de dessus. */
function aScar(x,y,o={}){const n=o.n||6,w=o.w||220,gone=o.gone||[],sp=w/(n+1);
 return `<path d="M${x-w/2} ${y}C${x-w/4} ${y-3} ${x+w/4} ${y+3} ${x+w/2} ${y}" stroke="#B86E62" stroke-width="3" fill="none" stroke-linecap="round"/>${[...Array(n)].map((_,i)=>{const sx=x-w/2+sp*(i+1),g=vC(gone[i]||0);if(g>=1)return "";
  return `<g opacity="${v1(1-g)}" transform="translate(0 ${v1(-g*30)})">${o.staples?`<path d="M${v1(sx-9)} ${y+8}V${y-6}H${v1(sx+9)}V${y+8}" fill="none" stroke="#8D99A4" stroke-width="3" stroke-linejoin="round"/>`:`<path d="M${v1(sx)} ${y-14}V${y+14}" stroke="#2F3A45" stroke-width="2"/><circle cx="${v1(sx)}" cy="${y-15}" r="3" fill="#2F3A45"/><path d="M${v1(sx)} ${y-15}l7 -6M${v1(sx)} ${y-15}l-6 -7" stroke="#2F3A45" stroke-width="1.5"/>`}</g>`;}).join("")}`;}
function aForceps(x,y,r,o={}){const op=o.open||0;return vG(x,y,r,o.s||1,`<path d="M0 0L80 ${v1(-6-op*4)}L84 ${v1(-2-op*4)}L4 1Z" fill="url(#vd-metal)" stroke="#6F7B86" stroke-width=".8"/><path d="M0 0L80 ${v1(6+op*4)}L84 ${v1(2+op*4)}L4 -1Z" fill="url(#vd-metal)" stroke="#6F7B86" stroke-width=".8"/>`);}
function aScissors(x,y,r,o={}){const c=o.cut||0,a=12-10*c;return vG(x,y,r,o.s||1,`<g transform="rotate(${-a})"><path d="M0 0L60 -3L60 3Z" fill="url(#vd-metal)" stroke="#6F7B86" stroke-width=".8"/><circle cx="74" cy="-8" r="9" fill="none" stroke="#3E474F" stroke-width="3"/></g><g transform="rotate(${a})"><path d="M0 0L60 -3L60 3Z" fill="url(#vd-metal)" stroke="#6F7B86" stroke-width=".8"/><circle cx="74" cy="8" r="9" fill="none" stroke="#3E474F" stroke-width="3"/></g><circle cx="44" cy="0" r="2.5" fill="#3E474F"/>`);}
/* Tête de profil (regard vers la gauche) avec fosses nasales, pharynx, œsophage et trachée schématiques. */
function aHead(x,y,o={}){const s=o.s||1,cut=o.cut!==false;
 const face=`<path d="M40 -92C8 -96 -18 -80 -28 -56C-32 -46 -30 -38 -36 -30C-40 -24 -46 -18 -42 -14C-38 -10 -34 -10 -34 -4C-36 0 -34 4 -30 6C-34 10 -32 16 -26 18C-24 26 -20 34 -8 36C6 38 14 46 16 70L70 70C64 48 70 30 76 12C86 -20 82 -60 60 -82C54 -88 48 -91 40 -92Z" fill="url(#vd-skin)" stroke="${VC.skinL}" stroke-width="1.6"/>
  <path d="M-34 -30C-38 -32 -42 -34 -42 -38" stroke="${VC.skinL}" fill="none"/><circle cx="-10" cy="-44" r="3" fill="#3E474F"/><path d="M-18 -52C-14 -56 -6 -56 -2 -54" stroke="#6B4A3A" stroke-width="2" fill="none"/>
  <path d="M30 -46C44 -50 50 -38 46 -28C44 -20 36 -18 32 -22" fill="#E7B597" stroke="${VC.skinL}" stroke-width="1.3"/><path d="M-30 6C-24 8 -18 8 -14 6" stroke="#B55E52" stroke-width="2" fill="none"/>`;
 const inner=cut?`<path d="M-32 -22C-20 -24 0 -24 16 -22C26 -20 30 -12 30 -2" fill="none" stroke="#C97C6E" stroke-width="7" stroke-linecap="round" opacity=".55"/><path d="M30 -2C32 12 30 26 30 70" fill="none" stroke="#C97C6E" stroke-width="8" opacity=".5"/><path d="M18 6C18 22 16 40 16 70" fill="none" stroke="#9FC2D9" stroke-width="7" opacity=".7"/>${o.labels?`${vT(-50,-30,"narine",{a:"end",s:8,w:700,f:VC.sub})}${vT(36,84,"œsophage",{a:"start",s:8,w:700,f:"#A2564A"})}${vT(12,84,"trachée",{a:"end",s:8,w:700,f:"#4F7FA0"})}`:""}`:"";
 return vG(x,y,0,s,face+inner+(o.extra||""));}
/* Thorax de face (repères ECG, RCP, DAE). */
function aTorso(x,y,o={}){const s=o.s||1;
 return vG(x,y,0,s,`<path d="M-86 -100C-60 -112 60 -112 86 -100C100 -60 104 0 96 80H-96C-104 0 -100 -60 -86 -100Z" fill="url(#vd-skin)" stroke="${VC.skinL}" stroke-width="1.6"/><path d="M-16 -112C-10 -118 10 -118 16 -112" stroke="${VC.skinL}" fill="none"/>
  <path d="M0 -96V-6" stroke="#D3A083" stroke-width="5" stroke-linecap="round"/><path d="M-8 -6L0 4L8 -6" fill="#D3A083"/>${[-74,-56,-38,-20].map((yy,i)=>`<path d="M-8 ${yy}C-30 ${yy-4+i*2} -60 ${yy+2+i*3} -84 ${yy+12+i*4}M8 ${yy}C30 ${yy-4+i*2} 60 ${yy+2+i*3} 84 ${yy+12+i*4}" stroke="#D9A88C" stroke-width="1.4" fill="none" opacity=".7"/>`).join("")}
  <circle cx="-44" cy="-50" r="3" fill="#C98A72"/><circle cx="44" cy="-50" r="3" fill="#C98A72"/>${o.extra||""}`);}
/* Schéma vessie et urètre. */
function aBladder(x,y,o={}){const ur=vC(o.urine==null?.6:o.urine);return vG(x,y,0,o.s||1,`<path d="M-70 -10C-70 -70 70 -70 70 -10C70 30 30 44 8 48H-8C-30 44 -70 30 -70 -10Z" fill="#F3D9CF" stroke="#C58F7E" stroke-width="2"/><path d="M-60 ${v1(44-60*ur)}H60V-10C60 26 26 38 8 40H-8C-26 38 -60 26 -60 -10Z" fill="#F4E27A" opacity=".55"/>
  <path d="M-8 46V150H8V46" fill="#F3D9CF" stroke="#C58F7E" stroke-width="2"/>${vT(-84,-40,"Vessie",{a:"end",s:10,w:700,f:"#8A5A44"})}${vT(-20,120,"Urètre",{a:"end",s:10,w:700,f:"#8A5A44"})}${vT(0,168,"Méat",{s:9,w:700,f:VC.sub})}`);}

/* ---------- Lecteur ---------- */
const VD_P={};let vdRaf=0,vdLast=0;
const vdTot=V=>V.s.reduce((n,s)=>n+s.d,0);
function vdAt(V,t){let a=0;for(let i=0;i<V.s.length;i++){if(t<a+V.s[i].d||i===V.s.length-1)return [i,Math.min(V.s[i].d,Math.max(0,t-a)),a];a+=V.s[i].d;}return [0,0,0];}
function vdFrame(V,t){const [i,lt]=vdAt(V,t);let c="";try{c=V.s[i].f(lt,V.s[i].d);}catch(e){console.warn("Vidéo",e);}return VD_DEFS+c;}
const vdFmt=s=>{s=Math.max(0,Math.round(s));return Math.floor(s/60)+":"+String(s%60).padStart(2,"0");};
const VD_IC={play:'<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',pause:'<svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',
 prev:'<svg viewBox="0 0 24 24"><path d="M6 5v14M18 6l-9 6 9 6z"/></svg>',next:'<svg viewBox="0 0 24 24"><path d="M18 5v14M6 6l9 6-9 6z"/></svg>',
 full:'<svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',exit:'<svg viewBox="0 0 24 24"><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/></svg>',
 replay:'<svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.5-5.8"/><path d="M4 4v4h4"/></svg>',film:'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M10 9.5v5l4.5-2.5z"/></svg>'};
function vdHtml(id,o={}){const V=VID[id];if(!V)return "";const tot=vdTot(V),k=V.poster==null?Math.min(1,V.s.length-1):V.poster,t0=V.s.slice(0,k).reduce((n,s)=>n+s.d,0)+V.s[k].d*.75;
 let acc=0;const marks=V.s.map(s=>{const m=acc/tot*100;acc+=s.d;return m;});
 return `<section class="vd" id="vd-${id}" data-vid="${id}" aria-label="Vidéo animée : ${esc(V.t)}">
  ${o.head===false?"":`<div class="vd-head">${VD_IC.film}<span><b>Le soin en vidéo</b><small>${V.s.length} étapes · ${vdFmt(tot)}</small></span></div>`}
  <div class="vd-stage" data-act="vd-toggle" data-k="${id}"><svg class="vd-svg" viewBox="0 0 ${VD_W} ${VD_H}" role="img" aria-label="Animation : ${esc(V.t)}">${vdFrame(V,t0)}</svg>
   <button class="vd-big" data-act="vd-toggle" data-k="${id}" aria-label="Lire la vidéo">${VD_IC.play}</button>
   <span class="vd-step" aria-hidden="true"></span></div>
  <p class="vd-cap" aria-live="polite"><span class="vd-n">${V.s.length} étapes</span><span class="vd-ct">${esc(V.intro||"Touchez lecture : chaque étape du soin est animée et sous-titrée.")}</span></p>
  <div class="vd-ctl">
   <button class="vd-b vd-pp" data-act="vd-toggle" data-k="${id}" aria-label="Lecture">${VD_IC.play}</button>
   <button class="vd-b" data-act="vd-prev" data-k="${id}" aria-label="Étape précédente">${VD_IC.prev}</button>
   <div class="vd-bar"><div class="vd-marks">${marks.map((m,i)=>`<i style="left:${v1(m)}%" data-act="vd-go" data-k="${id}" data-i="${i}"></i>`).join("")}</div><input type="range" class="vd-range" min="0" max="${Math.round(tot*10)}" value="0" step="1" data-vd="${id}" aria-label="Position dans la vidéo"></div>
   <button class="vd-b" data-act="vd-next" data-k="${id}" aria-label="Étape suivante">${VD_IC.next}</button>
   <span class="vd-time">0:00 / ${vdFmt(tot)}</span>
   <button class="vd-b vd-sp" data-act="vd-speed" data-k="${id}" aria-label="Vitesse">1×</button>
   <button class="vd-b vd-fs" data-act="vd-full" data-k="${id}" aria-label="Plein écran">${VD_IC.full}</button></div>
  ${o.steps===false?"":`<ol class="vd-steps">${V.s.map((s,i)=>`<li><button data-act="vd-go" data-k="${id}" data-i="${i}"><span>${i+1}</span>${esc(s.c)}</button></li>`).join("")}</ol>`}
 </section>`;}
function vdState(id){const el=document.getElementById("vd-"+id);if(!el)return null;let P=VD_P[id];
 if(!P||P.el!==el){P=VD_P[id]={id,el,V:VID[id],t:0,play:false,speed:1,step:-1,cap:null};P.tot=vdTot(P.V);}return P;}
function vdDraw(P){const V=P.V,[i,lt]=vdAt(V,P.t),svg=P.el.querySelector(".vd-svg");if(!svg)return;
 svg.innerHTML=vdFrame(V,P.t);
 if(i!==P.step){P.step=i;const cap=P.el.querySelector(".vd-cap");if(cap)cap.innerHTML=`<span class="vd-n">Étape ${i+1}/${V.s.length}</span><span class="vd-ct">${esc(V.s[i].c)}</span>`;
  const st=P.el.querySelector(".vd-step");if(st)st.textContent=`${i+1}/${V.s.length}`;
  P.el.querySelectorAll(".vd-steps li").forEach((li,k)=>li.classList.toggle("on",k===i));P.el.querySelectorAll(".vd-marks i").forEach((m,k)=>m.classList.toggle("on",k<=i));}
 const r=P.el.querySelector(".vd-range");if(r&&document.activeElement!==r)r.value=Math.round(P.t*10);
 const tm=P.el.querySelector(".vd-time");if(tm)tm.textContent=`${vdFmt(P.t)} / ${vdFmt(P.tot)}`;}
function vdUi(P){P.el.classList.toggle("playing",P.play);P.el.classList.toggle("ended",!P.play&&P.t>=P.tot-.01);
 const ic=P.play?VD_IC.pause:P.t>=P.tot-.01?VD_IC.replay:VD_IC.play;P.el.querySelectorAll(".vd-pp,.vd-big").forEach(b=>{b.innerHTML=ic;b.setAttribute("aria-label",P.play?"Pause":P.t>=P.tot-.01?"Revoir":"Lecture");});}
function vdLoop(ts){vdRaf=0;const dt=vdLast?Math.min(.1,(ts-vdLast)/1000):0;vdLast=ts;let any=false;
 Object.values(VD_P).forEach(P=>{if(!P.play)return;if(!P.el.isConnected){P.play=false;return;}any=true;P.t+=dt*P.speed;if(P.t>=P.tot){P.t=P.tot;P.play=false;vdUi(P);}vdDraw(P);});
 if(any)vdRaf=requestAnimationFrame(vdLoop);else vdLast=0;}
const vdKick=()=>{if(!vdRaf){vdLast=0;vdRaf=requestAnimationFrame(vdLoop);}};
function vdSeek(P,t){P.t=Math.max(0,Math.min(P.tot,t));vdDraw(P);vdUi(P);}
function vdStepStart(P,i){return P.V.s.slice(0,Math.max(0,i)).reduce((n,s)=>n+s.d,0);}
function vdAct(b,a){const P=vdState(b.dataset.k);if(!P)return;
 if(a==="vd-toggle"){if(P.play)P.play=false;else{Object.values(VD_P).forEach(Q=>{if(Q!==P&&Q.play){Q.play=false;vdUi(Q);}});if(P.t>=P.tot-.01)P.t=0;P.play=true;P.el.classList.add("started");vdKick();}vdDraw(P);vdUi(P);}
 else if(a==="vd-prev"){const [i,lt]=vdAt(P.V,P.t);vdSeek(P,vdStepStart(P,lt<.8?i-1:i));}
 else if(a==="vd-next"){const [i]=vdAt(P.V,P.t);if(i<P.V.s.length-1)vdSeek(P,vdStepStart(P,i+1));}
 else if(a==="vd-go"){P.el.classList.add("started");vdSeek(P,vdStepStart(P,+b.dataset.i)+.01);if(!P.play){P.play=true;vdKick();vdUi(P);}}
 else if(a==="vd-speed"){P.speed=P.speed===1?.5:P.speed===.5?1.5:1;b.textContent=(P.speed===.5?"0,5":P.speed===1.5?"1,5":"1")+"×";}
 else if(a==="vd-full")vdFull(P,!P.el.classList.contains("vd-full"));
}
/* Plein écran : le lecteur est déplacé au niveau de la page (un parent animé fausserait la position fixe), puis remis en place. */
function vdFull(P,on){const el=P.el;
 if(on){if(!P.ph){P.ph=document.createComment("vd");el.parentNode.insertBefore(P.ph,el);}document.body.appendChild(el);}
 else if(P.ph){if(P.ph.parentNode)P.ph.parentNode.insertBefore(el,P.ph),P.ph.remove();else el.remove();P.ph=null;}
 el.classList.toggle("vd-full",on);document.body.classList.toggle("vd-lock",on);
 const fb=el.querySelector(".vd-fs");if(fb){fb.innerHTML=on?VD_IC.exit:VD_IC.full;fb.setAttribute("aria-label",on?"Quitter le plein écran":"Plein écran");}}
window.addEventListener("hashchange",()=>{Object.values(VD_P).forEach(P=>{if(P.el.classList.contains("vd-full")){P.play=false;vdFull(P,false);}});});
function vdInput(t){const P=vdState(t.dataset.vd);if(!P)return;P.el.classList.add("started");P.t=Math.max(0,Math.min(P.tot,(+t.value)/10));vdDraw(P);vdUi(P);}
document.addEventListener("keydown",e=>{if(e.key!=="Escape")return;Object.values(VD_P).forEach(P=>{if(P.el.classList.contains("vd-full"))vdFull(P,false);});});
/* Image fixe d'une vidéo (vignette de la galerie). */
function vdPoster(id){const V=VID[id];if(!V)return "";const k=V.poster==null?Math.min(1,V.s.length-1):V.poster,t0=V.s.slice(0,k).reduce((n,s)=>n+s.d,0)+V.s[k].d*.75;
 return `<svg class="vd-thumb" viewBox="0 0 ${VD_W} ${VD_H}" aria-hidden="true">${vdFrame(V,t0)}</svg>`;}

/* ---------- Galerie (boîte à outils) ---------- */
const vdIds=()=>Object.keys(VID).filter(id=>typeof SOBY==="undefined"||SOBY[id]);
const vdCount=()=>vdIds().length;
function vdCard(id){const V=VID[id];return `<a class="vdg-c" href="#outil/videos/${id}"><span class="vdg-p">${vdPoster(id)}<i>${VD_IC.play}</i></span><b>${esc(V.t)}</b><small>${V.s.length} étapes · ${vdFmt(vdTot(V))}</small></a>`;}
function otVideos(arg){
 if(arg&&VID[arg]){const o=typeof SOBY!=="undefined"&&SOBY[arg],others=vdIds().filter(x=>x!==arg&&o&&SOBY[x]&&SOBY[x].s===o.s).slice(0,4);
  return `${vdHtml(arg,{head:false})}
   ${o?`<div class="list"><a class="li" href="#soin/${arg}" data-act="so-open" data-k="recap"><span class="ic tb-ic" style="--c:#2E7D8C">${IC.sheet}</span><span><span class="t">Fiche du soin</span><span class="s">${esc(o.n)} : indications, matériel, surveillance, erreurs à éviter</span></span>${chev}</a></div>`:""}
   ${others.length?`<section class="stack-sm"><h2>Dans la même catégorie</h2><div class="vdg">${others.map(vdCard).join("")}</div></section>`:""}
   <p class="disclaimer">Animations pédagogiques simplifiées. Le geste s'apprend en salle de simulation et en stage, selon les protocoles de l'établissement.</p>`;}
 const ids=vdIds(),secs=typeof SO_SECS!=="undefined"?SO_SECS.map(s=>s[0]).filter(s=>ids.some(id=>SOBY[id].s===s)):[];
 return `<p class="muted">${ids.length} gestes techniques. Dans chaque vidéo, touchez une étape pour y aller directement.</p>
  ${typeof rvList==="function"?rvList():""}
  ${secs.map(s=>`<section class="stack-sm"><div class="section-title"><h2>${esc(SO_SEC[s].nom)}</h2><span class="muted">${ids.filter(id=>SOBY[id].s===s).length}</span></div><div class="vdg">${ids.filter(id=>SOBY[id].s===s).map(vdCard).join("")}</div></section>`).join("")}
  <p class="disclaimer">Animations pédagogiques simplifiées. Le geste s'apprend en salle de simulation et en stage, selon les protocoles de l'établissement.</p>`;
}
const vdEntry=()=>`<a class="vd-entry" href="#outil/videos"><span class="vd-entry-ic">${VD_IC.film}</span><span><b>Vidéos des gestes techniques</b><small>${vdCount()} soins animés pas à pas : prise de sang, VVP, perfusion, injections…</small></span>${chev}</a>`;
if(typeof TOOLS!=="undefined"&&!TOOLS.some(t=>t.id==="videos")){
 TOOLS.splice(1,0,{id:"videos",n:"Vidéos des soins",s:"Vidéos",c:"#2E7D8C",d:"Les gestes techniques animés pas à pas : prise de sang, cathéter, perfusion, injections, sondes…",lead:"Chaque geste est animé étape par étape, avec sous-titres. Lecture, pause, retour à une étape, vitesse et plein écran."});
 OT_IC.videos=OI('<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M10 9.5v5l4.5-2.5z"/>');
 OT_VIEWS.videos=otVideos;
}
/* En plein écran, le lecteur est hors de #app : ses boutons et son curseur sont écoutés ici. */
document.addEventListener("click",e=>{const b=e.target.closest(".vd-full [data-act]");if(!b)return;const A=document.getElementById("app");if(A&&A.contains(b))return;vdAct(b,b.dataset.act);});
document.addEventListener("input",e=>{const t=e.target;if(t.dataset&&t.dataset.vd!=null&&t.closest(".vd-full")){const A=document.getElementById("app");if(!A||!A.contains(t))vdInput(t);}});
