/* Carnet IFSI — illustrations réalistes pour l'outil « Choix du pansement » : aspect du fond de plaie, quantité
   d'exsudat, particularités et types de plaies. Dessins vectoriels texturés (filtres SVG), pas des photographies.
   Chargé avant outils.js. */
const PA_SVG_NS="http://www.w3.org/2000/svg";
function paDefs(){
 if(document.getElementById("pa-defs"))return;
 const s=document.createElementNS(PA_SVG_NS,"svg");s.id="pa-defs";s.setAttribute("aria-hidden","true");s.setAttribute("focusable","false");
 s.style.cssText="position:absolute;width:0;height:0;overflow:hidden;pointer-events:none";
 s.innerHTML=`<defs>
  <radialGradient id="pa-skin" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="#EBC2A4"/><stop offset=".7" stop-color="#DDAA88"/><stop offset="1" stop-color="#C98F6E"/></radialGradient>
  <radialGradient id="pa-skin-pale" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="#EDD3C3"/><stop offset=".75" stop-color="#E2C0AC"/><stop offset="1" stop-color="#CFA791"/></radialGradient>
  <radialGradient id="pa-ery" cx="50%" cy="50%" r="50%"><stop offset=".45" stop-color="#C9473B" stop-opacity=".75"/><stop offset=".8" stop-color="#D2655A" stop-opacity=".35"/><stop offset="1" stop-color="#D2655A" stop-opacity="0"/></radialGradient>
  <radialGradient id="pa-rim" cx="50%" cy="50%" r="50%"><stop offset=".6" stop-color="#C8665C" stop-opacity="0"/><stop offset=".85" stop-color="#C8665C" stop-opacity=".45"/><stop offset="1" stop-color="#C8665C" stop-opacity="0"/></radialGradient>
  <radialGradient id="pa-crater" cx="50%" cy="52%" r="55%"><stop offset="0" stop-color="#3A0E0C"/><stop offset=".45" stop-color="#6E1B17"/><stop offset=".8" stop-color="#A82B25"/><stop offset="1" stop-color="#C23A31"/></radialGradient>
  <radialGradient id="pa-gloss" cx="35%" cy="30%" r="60%"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".5" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  <filter id="pa-pores" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 .42  0 0 0 0 .24  0 0 0 0 .16  .9 0 0 0 -.36"/></filter>
  <filter id="pa-gran" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".3" numOctaves="2" seed="4" result="n"/>
   <feDiffuseLighting in="n" surfaceScale="2.4" diffuseConstant="1.3" lighting-color="#fff" result="d"><feDistantLight azimuth="225" elevation="64"/></feDiffuseLighting>
   <feComposite in="SourceGraphic" in2="d" operator="arithmetic" k1="1.05" result="c"/>
   <feSpecularLighting in="n" surfaceScale="2.4" specularConstant=".9" specularExponent="24" lighting-color="#fff" result="s"><feDistantLight azimuth="225" elevation="48"/></feSpecularLighting>
   <feComposite in="s" in2="SourceAlpha" operator="in" result="s2"/><feComposite in="c" in2="s2" operator="arithmetic" k2="1" k3=".6" result="o"/><feComposite in="o" in2="SourceAlpha" operator="in"/></filter>
  <filter id="pa-slough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".07 .13" numOctaves="4" seed="11" result="n"/>
   <feDiffuseLighting in="n" surfaceScale="2" diffuseConstant="1.25" lighting-color="#fff" result="d"><feDistantLight azimuth="210" elevation="62"/></feDiffuseLighting>
   <feComposite in="SourceGraphic" in2="d" operator="arithmetic" k1="1.08" result="c"/>
   <feSpecularLighting in="n" surfaceScale="3" specularConstant=".55" specularExponent="18" lighting-color="#fff" result="s"><feDistantLight azimuth="210" elevation="45"/></feSpecularLighting>
   <feComposite in="s" in2="SourceAlpha" operator="in" result="s2"/><feComposite in="c" in2="s2" operator="arithmetic" k2="1" k3=".35" result="o"/><feComposite in="o" in2="SourceAlpha" operator="in"/></filter>
  <filter id="pa-crust" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".13" numOctaves="4" seed="21" result="n"/>
   <feDiffuseLighting in="n" surfaceScale="2.6" diffuseConstant="1.25" lighting-color="#fff" result="d"><feDistantLight azimuth="230" elevation="58"/></feDiffuseLighting>
   <feComposite in="SourceGraphic" in2="d" operator="arithmetic" k1="1.2" result="c"/>
   <feSpecularLighting in="n" surfaceScale="2.6" specularConstant=".25" specularExponent="14" lighting-color="#fff" result="s"><feDistantLight azimuth="230" elevation="50"/></feSpecularLighting>
   <feComposite in="s" in2="SourceAlpha" operator="in" result="s2"/><feComposite in="c" in2="s2" operator="arithmetic" k2="1" k3=".2" result="o"/><feComposite in="o" in2="SourceAlpha" operator="in"/></filter>
  <filter id="pa-epi" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".12" numOctaves="2" seed="5" result="n"/>
   <feDiffuseLighting in="n" surfaceScale=".9" diffuseConstant="1.12" lighting-color="#fff" result="d"><feDistantLight azimuth="225" elevation="60"/></feDiffuseLighting>
   <feComposite in="SourceGraphic" in2="d" operator="arithmetic" k1="1.05" result="c"/>
   <feSpecularLighting in="n" surfaceScale="1.2" specularConstant=".8" specularExponent="30" lighting-color="#fff" result="s"><feDistantLight azimuth="225" elevation="45"/></feSpecularLighting>
   <feComposite in="s" in2="SourceAlpha" operator="in" result="s2"/><feComposite in="c" in2="s2" operator="arithmetic" k2="1" k3=".5" result="o"/><feComposite in="o" in2="SourceAlpha" operator="in"/></filter>
  <filter id="pa-weave" x="0" y="0" width="100%" height="100%"><feTurbulence type="turbulence" baseFrequency=".9 .9" numOctaves="1" seed="2" result="n"/><feColorMatrix in="n" values="0 0 0 0 .55  0 0 0 0 .55  0 0 0 0 .5  .7 0 0 0 -.25"/></filter>
  <filter id="pa-soft"><feGaussianBlur stdDeviation="2.2"/></filter>
  <filter id="pa-soft4"><feGaussianBlur stdDeviation="4"/></filter>
  <pattern id="pa-gauze" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#FBFAF6"/><path d="M0 3h6M3 0v6" stroke="#E4E0D6" stroke-width="1"/></pattern>
 </defs>`;
 (document.body||document.documentElement).appendChild(s);
}
/* Contour irrégulier et doux (Catmull-Rom → Bézier), déterministe selon la graine. */
function paBlob(cx,cy,rx,ry,seed,irr=.14,n=11){
 let s=seed*9301+49297;const r=()=>{s=(s*16807)%2147483647;return s/2147483647;};
 const pts=[...Array(n)].map((_,i)=>{const a=i/n*Math.PI*2,k=1+(r()-.5)*2*irr;return [cx+Math.cos(a)*rx*k,cy+Math.sin(a)*ry*k];});
 let d=`M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
 for(let i=0;i<n;i++){const p0=pts[(i-1+n)%n],p1=pts[i],p2=pts[(i+1)%n],p3=pts[(i+2)%n];
  const c1=[p1[0]+(p2[0]-p0[0])/6,p1[1]+(p2[1]-p0[1])/6],c2=[p2[0]-(p3[0]-p1[0])/6,p2[1]-(p3[1]-p1[1])/6];
  d+=`C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;}
 return d+"Z";
}
const paSkin=(pale)=>`<rect width="160" height="120" fill="url(#pa-skin${pale?"-pale":""})"/><rect width="160" height="120" filter="url(#pa-pores)"/>`;
const paSvg=(body,label)=>`<svg class="pa-svg" viewBox="0 0 160 120" role="img" aria-label="${label}" preserveAspectRatio="xMidYMid slice">${body}</svg>`;
/* Dots de granulation et éclats de brillance */
function paSpecks(cx,cy,rx,ry,n,seed,col,rad){let s=seed*7919+13;const r=()=>{s=(s*16807)%2147483647;return s/2147483647;};let h="";
 for(let i=0;i<n;i++){const a=r()*Math.PI*2,d=Math.sqrt(r());h+=`<circle cx="${(cx+Math.cos(a)*rx*d).toFixed(1)}" cy="${(cy+Math.sin(a)*ry*d).toFixed(1)}" r="${(rad*(.6+r()*.8)).toFixed(2)}" fill="${col}"/>`;}return h;}

const PA_IMG={
 /* ---------- Aspect du fond de plaie ---------- */
 noir:()=>{const w=paBlob(80,60,50,37,3,.12);
  return paSvg(`${paSkin()}<ellipse cx="80" cy="60" rx="62" ry="48" fill="url(#pa-rim)"/>
   <path d="${paBlob(80,60,53,40,3,.12)}" fill="#9C4A3E" opacity=".9"/>
   <path d="${w}" fill="#2A1A14" filter="url(#pa-crust)"/>
   <g fill="none" stroke="#0E0805" stroke-width="1.3" stroke-linecap="round" opacity=".85"><path d="M48 52l14 6 9-5 12 9 15-4 10 7"/><path d="M62 58l-4 14M83 62l3 15M98 58l6-13M72 47l-6-9"/></g>
   <g fill="none" stroke="#5B3B2C" stroke-width=".7" opacity=".7"><path d="M49 53l14 6 9-5 12 9 15-4 10 7"/></g>`,"Nécrose noire et sèche");},
 jaune:()=>{const w=paBlob(80,60,52,38,8,.13);
  return paSvg(`${paSkin()}<ellipse cx="80" cy="60" rx="64" ry="49" fill="url(#pa-rim)"/>
   <path d="${paBlob(80,60,54,40,8,.13)}" fill="#B4554A"/>
   <path d="${w}" fill="#D9BE5E" filter="url(#pa-slough)"/>
   <g filter="url(#pa-gran)">${[[60,52,7,5,1],[96,48,6,4,2],[88,72,8,5,3],[70,70,5,4,4],[104,64,4,3,5]].map(([x,y,a,b,k])=>`<path d="${paBlob(x,y,a,b,k,.3,8)}" fill="#BE3B33"/>`).join("")}</g>
   <ellipse cx="68" cy="50" rx="22" ry="12" fill="url(#pa-gloss)"/>`,"Fibrine jaune");},
 rouge:()=>{const w=paBlob(80,60,50,37,5,.12);
  return paSvg(`${paSkin()}<ellipse cx="80" cy="60" rx="62" ry="47" fill="url(#pa-rim)"/>
   <path d="${paBlob(80,60,52,39,5,.12)}" fill="#E7A3A0"/>
   <path d="${w}" fill="#C2302C" filter="url(#pa-gran)"/>
   <g filter="url(#pa-gran)" opacity=".9">${paSpecks(80,60,40,28,26,9,"#D23C35",3.2)}</g>
   <ellipse cx="70" cy="50" rx="24" ry="13" fill="url(#pa-gloss)"/>`,"Bourgeonnement rouge");},
 rose:()=>{return paSvg(`${paSkin()}
   <path d="${paBlob(80,60,50,36,12,.12)}" fill="#F2B7B6" filter="url(#pa-epi)"/>
   <path d="${paBlob(80,60,44,30,12,.12)}" fill="#EFA4A6" filter="url(#pa-epi)"/>
   <path d="${paBlob(82,61,20,13,6,.2)}" fill="#C9403A" filter="url(#pa-gran)"/>
   <path d="${paBlob(80,60,50,36,12,.12)}" fill="none" stroke="#F8DCD8" stroke-width="2.5" opacity=".9"/>
   <ellipse cx="68" cy="50" rx="26" ry="13" fill="url(#pa-gloss)"/>`,"Épidermisation rose");},
 /* ---------- Exsudat : compresse retirée ---------- */
 ...Object.fromEntries([["sec",0],["faible",.22],["modere",.55],["abondant",1]].map(([k,f])=>[k,()=>{
  const st=f?`<path d="${paBlob(80,60,10+46*f,8+34*f,k.length,.18)}" fill="#D8B860" opacity="${.35+.25*f}" filter="url(#pa-soft)"/><path d="${paBlob(80,60,5+28*f,4+20*f,k.length+3,.2)}" fill="#C9A443" opacity="${.3+.3*f}" filter="url(#pa-soft)"/>`:"";
  const over=f===1?`<path d="M30 92c-4 6-2 11 2 11s6-5 2-11z" fill="#D8B860" opacity=".75"/><path d="M128 30c-3 5-1 9 2 9s5-4 2-9z" fill="#D8B860" opacity=".7"/>`:"";
  return paSvg(`<rect width="160" height="120" fill="#7E8C93"/><rect width="160" height="120" filter="url(#pa-pores)" opacity=".6"/>
   <g transform="rotate(-4 80 60)"><rect x="26" y="16" width="108" height="88" rx="3" fill="url(#pa-gauze)"/><rect x="26" y="16" width="108" height="88" rx="3" filter="url(#pa-weave)" opacity=".5"/>${st}<rect x="26" y="16" width="108" height="88" rx="3" fill="none" stroke="#D9D4C7"/></g>${over}`,
   {sec:"Compresse sèche",faible:"Compresse peu tachée",modere:"Compresse à moitié tachée",abondant:"Compresse saturée qui déborde"}[k]);}])),
 /* ---------- Particularités ---------- */
 inf:()=>paSvg(`${paSkin()}<ellipse cx="80" cy="60" rx="78" ry="58" fill="url(#pa-ery)" filter="url(#pa-soft4)"/>
   <ellipse cx="80" cy="60" rx="60" ry="45" fill="#C7463C" opacity=".35" filter="url(#pa-soft4)"/>
   <path d="${paBlob(80,60,36,27,14,.14)}" fill="#A92C27" filter="url(#pa-gran)"/>
   <g filter="url(#pa-slough)">${[[72,54,7,4,1],[88,60,6,5,2],[80,68,8,4,3],[66,64,4,3,4],[92,50,4,3,5]].map(([x,y,a,b,k])=>`<path d="${paBlob(x,y,a,b,k,.3,8)}" fill="#D9D06A"/>`).join("")}</g><ellipse cx="80" cy="60" rx="20" ry="12" fill="url(#pa-gloss)"/>
   <path d="${paBlob(80,60,74,55,2,.1)}" fill="none" stroke="#7A1E18" stroke-width="1.2" stroke-dasharray="4 3" opacity=".8"/>
   <ellipse cx="72" cy="52" rx="16" ry="8" fill="url(#pa-gloss)"/>`,"Plaie infectée : rougeur qui s'étend, pus"),
 sang:()=>paSvg(`${paSkin()}<ellipse cx="80" cy="60" rx="60" ry="46" fill="url(#pa-rim)"/>
   <path d="${paBlob(80,58,44,32,6,.12)}" fill="#C2302C" filter="url(#pa-gran)"/>
   <path d="${paBlob(86,64,26,16,9,.2)}" fill="#8E0F12"/><path d="${paBlob(86,64,26,16,9,.2)}" fill="url(#pa-gloss)"/>
   <path d="M98 76c3 8 4 14 4 20 0 5-6 6-7 1-1-6 1-13 3-21z" fill="#900F12"/><ellipse cx="99" cy="97" rx="3" ry="2.4" fill="#900F12"/>
   <path d="M96 79c1 5 1 9 0 12" stroke="#fff" stroke-opacity=".45" stroke-width="1" fill="none"/>`,"Plaie qui saigne"),
 cav:()=>paSvg(`${paSkin()}<ellipse cx="80" cy="60" rx="60" ry="46" fill="url(#pa-rim)"/>
   <path d="${paBlob(80,60,44,33,17,.1)}" fill="#E6A49F"/>
   <path d="${paBlob(80,61,40,29,17,.1)}" fill="url(#pa-crater)"/>
   <path d="${paBlob(80,61,40,29,17,.1)}" fill="#7A1C18" filter="url(#pa-gran)" opacity=".45"/>
   <path d="${paBlob(80,60,56,42,4,.12)}" fill="none" stroke="#1F2A30" stroke-width="1.4" stroke-dasharray="4 3"/>
   <path d="M126 22L94 52" stroke="#9AA6AD" stroke-width="3" stroke-linecap="round"/><path d="M126 22L94 52" stroke="#E8EEF1" stroke-width="1" stroke-linecap="round"/>`,"Plaie creuse avec décollement"),
 odeur:()=>paSvg(`<rect width="160" height="120" fill="#E9E4D8"/><rect width="160" height="120" filter="url(#pa-pores)" opacity=".5"/>
   <g fill="none" stroke="#7B8A3A" stroke-width="3.5" stroke-linecap="round" opacity=".85"><path d="M54 92c-10-12 10-18 0-30s10-18 0-30"/><path d="M80 96c-10-12 10-18 0-30s10-18 0-30"/><path d="M106 92c-10-12 10-18 0-30s10-18 0-30"/></g>`,"Mauvaise odeur"),
 peau:()=>paSvg(`${paSkin()}
   <path d="${paBlob(80,60,58,44,21,.12)}" fill="#EDE3D6" opacity=".88" filter="url(#pa-soft)"/><path d="${paBlob(80,60,54,40,21,.12)}" fill="#F1E9DF" filter="url(#pa-epi)" opacity=".8"/>
   <g fill="none" stroke="#CDBBA8" stroke-width="1.2" stroke-linecap="round">${[...Array(14)].map((_,i)=>{const a=i/14*Math.PI*2,x=80+Math.cos(a)*49,y=60+Math.sin(a)*36;return `<path d="M${(x-4).toFixed(1)} ${(y-2).toFixed(1)}q4 3 8 0"/>`;}).join("")}</g>
   <path d="${paBlob(80,60,36,26,9,.12)}" fill="#C2302C" filter="url(#pa-gran)"/><ellipse cx="72" cy="52" rx="15" ry="7" fill="url(#pa-gloss)"/>`,"Peau autour blanchâtre et macérée"),
 /* ---------- Types de plaies ---------- */
 chir:()=>paSvg(`${paSkin()}<path d="M20 64C55 56 105 66 140 56" stroke="#9E4A40" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M20 64C55 56 105 66 140 56" stroke="#5E2621" stroke-width="1" fill="none"/>
   <g stroke="#A9B4BA" stroke-width="2.2" fill="none">${[30,46,62,78,94,110,126].map((x,i)=>{const y=63-(x-20)*(-.02)-(i%2)*1.5-(x>90?3:0);return `<rect x="${x-3.5}" y="${(y-8).toFixed(1)}" width="7" height="16" rx="2"/>`;}).join("")}</g>
   <g stroke="#fff" stroke-width=".8" stroke-opacity=".7" fill="none">${[30,46,62,78,94,110,126].map((x,i)=>{const y=63-(x-20)*(-.02)-(i%2)*1.5-(x>90?3:0);return `<path d="M${x-2.5} ${(y-8.6).toFixed(1)}h5"/>`;}).join("")}</g>`,"Plaie chirurgicale agrafée"),
 trauma:()=>paSvg(`${paSkin()}<path d="${paBlob(78,62,48,20,31,.22,14)}" fill="#D9786C" filter="url(#pa-epi)"/>
   <g stroke="#A8302A" stroke-width="1.4" stroke-linecap="round" opacity=".9">${[...Array(16)].map((_,i)=>{const x=38+i*5,y=55+(i%3)*5;return `<path d="M${x} ${y}l6 ${3+(i%2)*3}"/>`;}).join("")}</g>
   ${paSpecks(78,62,36,12,10,8,"#6B5A4E",1.1)}`,"Plaie traumatique : dermabrasion"),
 escarre:()=>paSvg(`<rect width="160" height="120" fill="#C98F6E"/><path d="M0 120V40C30 18 60 12 80 12s50 6 80 28v80z" fill="url(#pa-skin)"/><path d="M80 12V120" stroke="#B57B5D" stroke-width="2" opacity=".6"/>
   <ellipse cx="80" cy="70" rx="36" ry="28" fill="url(#pa-rim)"/><path d="${paBlob(80,70,24,18,3,.14)}" fill="#C2302C" filter="url(#pa-gran)"/><path d="${paBlob(78,68,12,8,5,.2)}" fill="#D9BE5E" filter="url(#pa-slough)"/>`,"Escarre du sacrum"),
 veineux:()=>paSvg(`<rect width="160" height="120" fill="#EDE6DB"/><path d="M48 0h56c2 30 4 60 10 82 6 16 22 22 30 38H30c8-18 14-30 16-50 2-22 0-46 2-70z" fill="url(#pa-skin)"/>
   <path d="M40 70c10-6 34-8 54 0 8 4 14 12 16 22-24-6-50-6-74 0 0-10 2-16 4-22z" fill="#8C5A3A" opacity=".45" filter="url(#pa-soft)"/>
   <path d="${paBlob(66,86,20,11,7,.25,12)}" fill="#C8443C" filter="url(#pa-gran)"/><path d="${paBlob(62,85,8,5,3,.3)}" fill="#D9BE5E" filter="url(#pa-slough)"/>
   <ellipse cx="66" cy="86" rx="26" ry="15" fill="none" stroke="#E7C4A8" stroke-width="1.5" opacity=".7"/>`,"Ulcère veineux de la cheville"),
 arteriel:()=>paSvg(`<rect width="160" height="120" fill="#E8EDF0"/><path d="M14 104c4-26 18-40 44-46 22-5 40-4 62-14 12-6 24-4 28 4 4 9-2 18-12 22-14 6-26 14-36 28-8 10-20 14-40 14H24c-8 0-11-3-10-8z" fill="url(#pa-skin-pale)"/>
   ${[[118,44,9],[132,46,7],[141,52,6]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#E2C0AC" stroke="#CFA791"/>`).join("")}
   <circle cx="86" cy="66" r="10" fill="#B07E6A"/><circle cx="86" cy="66" r="7.5" fill="#6B3A30" filter="url(#pa-crust)"/><circle cx="86" cy="66" r="10" fill="none" stroke="#8C5547" stroke-width="1.2"/>`,"Ulcère artériel du pied"),
 diab:()=>paSvg(`<rect width="160" height="120" fill="#E8EDF0"/><g transform="translate(6 2)"><path d="M58 112c-14-2-20-16-18-34 2-22 2-40 8-54 6-14 26-18 38-12 12 6 16 22 14 40-2 14 4 24 6 36 2 16-14 26-28 26z" fill="url(#pa-skin)"/>
   ${[[52,16,7],[64,10,6],[76,9,5.5],[88,12,5],[98,18,4.5]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#E2B193" stroke="#C98F6E"/>`).join("")}
   <circle cx="64" cy="40" r="13" fill="#EBD9B8"/><circle cx="64" cy="40" r="7" fill="#B83A33" filter="url(#pa-gran)"/></g>`,"Pied diabétique : mal perforant plantaire"),
 brulure:()=>paSvg(`${paSkin()}<path d="${paBlob(80,62,56,38,13,.16)}" fill="#E06A5C" opacity=".75" filter="url(#pa-soft)"/>
   <path d="${paBlob(84,58,30,20,4,.12)}" fill="#F4E6D6" opacity=".92"/><path d="${paBlob(84,58,30,20,4,.12)}" fill="url(#pa-gloss)"/><path d="${paBlob(84,58,30,20,4,.12)}" fill="none" stroke="#E7C8B0" stroke-width="1.5"/>
   <path d="${paBlob(54,72,12,8,8,.2)}" fill="#F0D9C6" opacity=".9"/><ellipse cx="78" cy="52" rx="12" ry="6" fill="#fff" opacity=".55"/>`,"Brûlure superficielle avec phlyctène"),
 tumorale:()=>paSvg(`${paSkin()}<ellipse cx="80" cy="60" rx="58" ry="44" fill="url(#pa-rim)"/>
   <path d="${paBlob(80,60,40,30,23,.2,14)}" fill="#B8423C" filter="url(#pa-gran)"/>
   <g filter="url(#pa-gran)">${paSpecks(80,60,26,18,9,6,"#C9564D",6)}</g>
   <path d="${paBlob(92,66,9,6,2,.3)}" fill="#E1CF8A" filter="url(#pa-slough)"/>`,"Plaie tumorale bourgeonnante")
};
/* Images de synthèse réalistes (rendu 3D : relief, humidité, lumière) dans img/pansement ; le dessin vectoriel reste en secours si l'image ne charge pas */
const PA_PHOTO=new Set("noir jaune rouge rose sec faible modere abondant inf sang cav odeur peau chir trauma escarre veineux arteriel diab brulure tumorale".split(" "));
const paImg=k=>{const v=PA_IMG[k]?PA_IMG[k]():"";if(!PA_PHOTO.has(k))return v;
 return `<span class="pa-real">${v}<img src="img/pansement/${k}.webp" alt="" loading="lazy" decoding="async" width="600" height="450" onerror="this.remove()"></span>`;};
