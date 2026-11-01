/* Carnet IFSI — schémas réalistes pour les cours d'anatomie et physiologie (cellule, neurone, os, articulation, muscle, ECG,
   axe hypothalamo-hypophysaire, appareil génital masculin, cycle menstruel, villosité, lymphatique, oreille, hémostase,
   ventilation, circulation) et bloc « map » (planche d'organes légendée) pour les cours. Chargé après schemas-real.js. */
/* Planche d'organes dans un cours : zones mises en évidence et légende. */
function amFig(s){const m=PMAPS[s.m];if(!m)return "";const z=s.z||[];
 return `<figure class="sch-fig"><div class="sch-head"><span class="sch-kick">Schéma anatomique</span><strong>${esc(s.h||m.titre)}</strong>${z.length?`<small>${z.map(k=>m.zones[k]).filter(Boolean).map(esc).join(" · ")}</small>`:""}</div>${m.draw(z)}${s.cap?`<figcaption>${md(s.cap)}</figcaption>`:""}</figure>`;}
const AG=(id,a,b,r)=>r?`<radialGradient id="${id}" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient>`:`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
const AT=(x,y,t,cls,a)=>tx(x,y,t,cls||"st-sub",a);
Object.assign(SCH,{
 cellule:()=>{const mito=(x,y,r)=>`<g transform="translate(${x} ${y}) rotate(${r})"><ellipse rx="17" ry="8.5" style="fill:#F0A988;stroke:#B8613F;stroke-width:1.1"/><path d="M-12 0 c3 -6 5 6 8 0 s5 -6 8 0 s5 6 8 0" style="fill:none;stroke:#B8613F;stroke-width:1"/></g>`;
  const rib=(pts)=>pts.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.4" style="fill:#5C4A3A"/>`).join("");
  return sv(250,`<defs>${AG("ce-cy","#FBF1E7","#F1D9C4",1)+AG("ce-no","#D7C8EC","#9C84C8",1)}</defs>
   <ellipse cx="108" cy="112" rx="98" ry="82" style="fill:url(#ce-cy);stroke:#C99A82;stroke-width:3.2"/><ellipse cx="108" cy="112" rx="94.5" ry="78.5" style="fill:none;stroke:#E6C3AC;stroke-width:1"/>
   ${fl("M56 76 C44 98 44 126 58 148 M64 72 C52 96 52 128 66 152 M48 84 C38 104 38 122 50 142","#C98C7A",2.2)}${rib([[45,92],[42,110],[46,128],[52,98],[50,118],[56,138],[60,86],[58,104],[60,124],[66,146]])}
   <circle cx="100" cy="110" r="32" style="fill:none;stroke:#7A62A8;stroke-width:1.2;stroke-dasharray:4 2"/><circle cx="100" cy="110" r="29.5" style="fill:url(#ce-no);stroke:#7A62A8;stroke-width:1.2"/>
   ${fl("M84 100 c6 4 10 -4 16 2 M90 124 c6 -6 12 4 18 -2 M112 118 c4 -6 -2 -10 4 -14","#7C64AA",1.1)}<circle cx="108" cy="104" r="8.5" style="fill:#6E5196"/>
   ${fl("M150 128 q16 -9 32 0 M148 136 q18 -10 36 0 M150 144 q16 -9 32 0 M154 152 q12 -7 24 0","#D98C5F",3.6)}<circle cx="188" cy="128" r="3" style="fill:#F2C29E;stroke:#D98C5F"/><circle cx="190" cy="148" r="3.4" style="fill:#F2C29E;stroke:#D98C5F"/>
   ${mito(166,70,-18)}${mito(58,172,28)}${mito(134,178,8)}
   <circle cx="186" cy="104" r="6.5" style="fill:#E8C34C;stroke:#A9831B;stroke-width:1"/><circle cx="74" cy="56" r="5.5" style="fill:#E8C34C;stroke:#A9831B;stroke-width:1"/>
   ${fl("M110 160 c8 5 14 -5 22 0 s14 5 22 0","#C98C7A",2.2)}
   <circle cx="203" cy="138" r="5" style="fill:#FBF1E7;stroke:#C99A82;stroke-width:1.4"/>
   ${LL(172,48,210,30)}${AT(214,26,"Membrane\nplasmique","st-b")}${LL(180,68,210,64)}${AT(214,60,"Mitochondrie\n(énergie, ATP)","st-b")}
   ${LL(192,104,210,99)}${AT(214,102,"Lysosome","st-b")}${LL(131,112,210,124)}${AT(214,121,"Noyau (ADN)\net nucléole","st-b")}
   ${LL(184,140,210,152)}${AT(214,152,"Appareil\nde Golgi","st-b")}${LL(150,162,210,184)}${AT(214,184,"Réticulum\nendoplasmique","st-b")}
   ${LL(150,192,210,214)}${AT(214,216,"Cytoplasme","st-b")}${LL(44,110,22,226)}${AT(6,240,"Ribosomes (fabriquent les protéines)","st-b")}`,"Schéma d'une cellule et de ses organites");},
 neurone:()=>{const my=x=>`<rect x="${x}" y="88" width="30" height="14" rx="7" style="fill:url(#ne-my);stroke:#C9A24E;stroke-width:1"/>`;
  return sv(228,`<defs>${AG("ne-so","#F6D2C4","#D9917A",1)+AG("ne-my","#FBF0CF","#EBCF84")}</defs>
   ${fl("M44 88 L20 64 M20 64 L8 58 M20 64 L16 48 M40 84 L30 52 M30 52 L22 40 M30 52 L38 38 M46 104 L22 124 M22 124 L8 128 M22 124 L18 142 M52 108 L44 140 M44 140 L34 152 M44 140 L54 154","#C77A63",3)}
   <path d="M38 96 C34 80 48 72 60 76 C72 72 84 82 82 95 C84 108 72 118 60 115 C46 118 34 110 38 96 Z" style="fill:url(#ne-so);stroke:#A9604A;stroke-width:1.2"/><circle cx="58" cy="95" r="9" style="fill:#9C84C8;stroke:#7A62A8"/><circle cx="60" cy="93" r="3" style="fill:#5D4689"/>
   <path d="M82 95 L268 95" style="stroke:#C77A63;stroke-width:4;fill:none"/>${[96,132,168,204].map(my).join("")}
   ${fl("M268 95 L286 78 M268 95 L292 95 M268 95 L286 112","#C77A63",3)}${[[288,77],[295,95],[288,113]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5" style="fill:#E9A27A;stroke:#A9604A"/>`).join("")}
   ${AR("M100 76 L230 76","#B4513A",1.8)}${AT(165,70,"sens de l'influx nerveux","st-acc","middle")}
   ${LL(24,46,12,24)}${AT(4,18,"Dendrites (reçoivent)","st-b")}${LL(58,116,30,182)}${AT(4,194,"Corps cellulaire\net noyau","st-b")}
   ${LL(112,102,104,122)}${AT(104,134,"Gaine de\nmyéline","st-b","middle")}${LL(165,99,166,122)}${AT(166,134,"Nœud de\nRanvier","st-b","middle")}${LL(250,95,224,122)}${AT(220,134,"Axone","st-b","middle")}
   ${LL(292,108,300,122)}${AT(316,134,"Terminaisons","st-b","end")}
   <rect x="150" y="170" width="166" height="52" rx="8" style="fill:var(--surface);stroke:var(--line);stroke-width:1"/>
   <path d="M160 180 C176 174 196 174 210 182 L210 208 C196 216 176 216 160 210 Z" style="fill:#F2C2A8;stroke:#A9604A;stroke-width:1"/>
   ${[[176,190],[186,198],[194,188],[178,204],[198,202]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3.6" style="fill:#FFF3D6;stroke:#C9A24E"/>`).join("")}${[[214,192],[218,198],[215,204]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.4" style="fill:#C9A24E"/>`).join("")}
   <path d="M224 178 L224 214" style="stroke:#A9604A;stroke-width:3"/>${[184,194,204].map(y=>`<rect x="224" y="${y}" width="5" height="6" rx="1" style="fill:#3E7CC4"/>`).join("")}
   ${AT(236,186,"vésicules,","st-sub")}${AT(236,197,"fente,","st-sub")}${AT(236,208,"récepteurs","st-sub")}${AT(155,164,"Synapse (zoom)","st-b")}`,"Le neurone et la synapse");},
 os:()=>sv(244,`<defs>${AG("os-sp","#F4E6CC","#E2CB9E",1)}</defs>
   <path d="M70 20 C56 20 46 34 50 50 C53 62 62 68 72 72 L72 172 C60 176 52 186 52 198 C52 214 66 224 90 224 C114 224 128 214 128 198 C128 186 120 176 108 172 L108 72 C118 68 127 62 130 50 C134 34 124 20 110 20 C100 20 96 26 90 26 C84 26 80 20 70 20 Z" style="fill:url(#rg-bone);stroke:#B79A6E;stroke-width:1.4"/>
   <path d="M76 30 C64 30 58 40 60 50 C62 58 70 64 78 66 L102 66 C110 64 118 58 120 50 C122 40 116 30 104 30 C98 30 94 34 90 34 C86 34 82 30 76 30 Z" style="fill:url(#os-sp)"/>
   ${fl("M66 44 l10 8 M72 38 l8 12 M84 36 l2 14 M96 38 l-2 14 M106 40 l-6 12 M114 46 l-10 8 M70 56 l12 -4 M110 56 l-12 -4 M80 58 l20 0","#C9A86E",1)}
   <path d="M64 196 C64 186 72 180 80 178 L100 178 C108 180 116 186 116 196 C116 208 106 214 90 214 C74 214 64 208 64 196 Z" style="fill:url(#os-sp)"/>${fl("M70 196 l12 -8 M80 204 l8 -14 M96 204 l-4 -14 M108 198 l-12 -8 M74 206 l32 0","#C9A86E",1)}
   <rect x="80" y="74" width="20" height="96" rx="6" style="fill:#F2D27A;stroke:#C9A24E;stroke-width:1"/>
   <path d="M60 32 C70 20 84 22 90 26 C96 22 110 20 120 32" style="fill:none;stroke:#BFD8E6;stroke-width:5;stroke-linecap:round"/><path d="M56 206 C66 222 114 222 124 206" style="fill:none;stroke:#BFD8E6;stroke-width:5;stroke-linecap:round"/>
   ${fl("M60 66 L120 66 M62 176 L118 176","#8E7A5A",1.4,";stroke-dasharray:3 2")}<path d="M69 76 L69 170 M111 76 L111 170" style="stroke:#C8372D;stroke-width:1.2;opacity:.7"/>
   ${art("M40 120 L72 118 L84 118",1.8,false)}
   ${LL(116,30,160,24)}${AT(164,27,"Cartilage articulaire","st-b")}${LL(108,46,160,48)}${AT(164,46,"Épiphyse : os spongieux\n(moelle rouge, globules)","st-b")}
   ${LL(116,66,160,78)}${AT(164,81,"Cartilage de croissance\n(ligne épiphysaire adulte)","st-b")}${LL(104,110,160,114)}${AT(164,112,"Diaphyse : os compact\nautour de la cavité","st-b")}
   ${LL(96,140,160,148)}${AT(164,146,"Cavité médullaire\n(moelle jaune, graisse)","st-b")}${LL(111,160,160,180)}${AT(164,182,"Périoste (enveloppe :\ncroissance, réparation)","st-b")}
   ${LL(46,120,30,150)}${AT(6,160,"Artère\nnourricière","st-b")}`,"Structure d'un os long"),
 articulation:()=>{const T=(x,y)=>[+(x*.8-36).toFixed(1),+(y*.8+14).toFixed(1)],L=(x,y,lx,ly)=>{const [px,py]=T(x,y);return LL(px,py,lx,ly);};
  return sv(214,`<g transform="translate(-36 14) scale(.8)">
   <path d="M90 10 L230 10 L226 70 C226 92 206 104 186 100 C176 98 168 92 160 92 C152 92 144 98 134 100 C114 104 94 92 94 70 Z" style="fill:url(#rg-bone);stroke:#B79A6E;stroke-width:1.6"/>
   <path d="M95 72 C97 92 116 100 134 97 C146 95 152 89 160 89 C168 89 174 95 186 97 C204 100 223 92 225 72" style="fill:none;stroke:#BFD8E6;stroke-width:7;stroke-linecap:round"/>
   <path d="M96 128 C110 124 140 124 160 126 C180 124 210 124 224 128 L228 210 L92 210 Z" style="fill:url(#rg-bone);stroke:#B79A6E;stroke-width:1.6"/><path d="M98 130 C116 126 140 126 160 128 C180 126 204 126 222 130" style="fill:none;stroke:#BFD8E6;stroke-width:7;stroke-linecap:round"/>
   <path d="M104 104 C108 114 116 118 128 120 L150 120 C142 114 134 110 120 108 Z M216 104 C212 114 204 118 192 120 L170 120 C178 114 186 110 200 108 Z" style="fill:#E7EDF2;stroke:#9EB4C4;stroke-width:1"/>
   <path d="M100 82 C88 96 88 124 100 136 L220 136 C232 124 232 96 220 82" style="fill:#D7ECF7;fill-opacity:.6;stroke:none"/>
   <path d="M96 60 C80 80 80 140 96 150 M224 60 C240 80 240 140 224 150" style="fill:none;stroke:#C9A88E;stroke-width:6;stroke-linecap:round"/><path d="M101 68 C88 88 88 132 101 142 M219 68 C232 88 232 132 219 142" style="fill:none;stroke:#E79A9A;stroke-width:2"/>
   <path d="M78 40 C70 90 72 140 82 180 M242 40 C250 90 248 140 238 180" style="fill:none;stroke:#E8E2D6;stroke-width:7;stroke-linecap:round"/>${fl("M78 40 C70 90 72 140 82 180 M242 40 C250 90 248 140 238 180","#B8AE9F",1.2)}</g>
   ${L(206,96,186,26)}${AT(190,26,"Cartilage articulaire\n(lisse, sans vaisseaux)","st-b")}${L(170,112,186,70)}${AT(190,70,"Liquide synovial\n(lubrifie, nourrit)","st-b")}
   ${L(206,116,186,108)}${AT(190,111,"Ménisque","st-b")}${L(236,104,186,140)}${AT(190,140,"Capsule et\nmembrane synoviale","st-b")}${L(246,150,186,180)}${AT(190,180,"Ligament (relie\nles os entre eux)","st-b")}
   ${AT(98,10,"Os (fémur)","st-b","middle")}${AT(98,210,"Os (tibia)","st-b","middle")}`,"Une articulation mobile (synoviale)");},
 muscle:()=>{const sar=(x,y,w,lab)=>{const a=[];for(let i=0;i<5;i++){const yy=y+6+i*7;a.push(`<path d="M${x} ${yy} L${x+w*0.42} ${yy} M${x+w} ${yy} L${x+w*0.58} ${yy}" style="stroke:#C8574A;stroke-width:1.4"/>`);if(i<4)a.push(`<path d="M${x+w*0.22} ${yy+3.5} L${x+w*0.78} ${yy+3.5}" style="stroke:#5A3A8C;stroke-width:3"/>`);}
   return `<path d="M${x} ${y} L${x} ${y+40} M${x+w} ${y} L${x+w} ${y+40}" style="stroke:#2E4079;stroke-width:2"/>${a.join("")}${AT(x+w/2,y+54,lab,"st-sub","middle")}`;};
  return sv(220,`
   <path d="M14 60 L40 60 C60 34 120 30 150 44 C160 50 160 70 150 76 C120 90 60 86 40 60" style="fill:url(#rg-muscle);stroke:#8E3A30;stroke-width:1.2"/><path d="M4 56 L40 58 L40 62 L4 64 Z M150 56 L176 54 L176 66 L150 64 Z" style="fill:#EDE4D2;stroke:#B8AE9F"/>
   ${fl("M50 60 C80 46 120 44 148 52 M52 62 C84 70 120 72 148 68","#7A2A22",.8)}
   <circle cx="214" cy="60" r="28" style="fill:#F2D2C8;stroke:#B5675C;stroke-width:1.2"/>${[[202,50],[216,46],[228,54],[206,64],[220,66],[212,76],[228,70],[198,72]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5.4" style="fill:url(#rg-muscle);stroke:#8E3A30;stroke-width:.6"/>`).join("")}
   <rect x="262" y="40" width="50" height="40" rx="6" style="fill:url(#rg-muscle);stroke:#8E3A30;stroke-width:1"/>${fl("M266 48 h42 M266 56 h42 M266 64 h42 M266 72 h42","#F6C2B6",1.2)}
   ${AR("M170 60 L184 60","#5C6B7A",1.6)}${AR("M244 60 L258 60","#5C6B7A",1.6)}
   ${AT(90,104,"Muscle et tendons","st-b","middle")}${AT(214,104,"Faisceaux","st-b","middle")}${AT(288,104,"Fibre","st-b","middle")}
   ${sar(40,130,110,"Sarcomère relâché")}${sar(196,130,80,"Sarcomère contracté")}${AR("M158 150 L188 150","#B4513A",1.8)}
   ${AT(96,124,"actine (fine) · myosine (épaisse)","st-sub","middle")}${AT(160,200,"L'actine glisse sur la myosine (calcium et ATP) :","st-acc","middle")}${AT(160,212,"le sarcomère, donc le muscle, raccourcit","st-acc","middle")}`,"Du muscle au sarcomère : comment le muscle se contracte");},
 ecg:()=>{const grid=[];for(let x=10;x<=310;x+=10)grid.push(`M${x} 20 V120`);for(let y=20;y<=120;y+=10)grid.push(`M10 ${y} H310`);
  const beat=x=>`M${x} 90 L${x+14} 90 C${x+18} 90 ${x+20} 80 ${x+26} 80 C${x+32} 80 ${x+34} 90 ${x+38} 90 L${x+48} 90 L${x+52} 96 L${x+58} 34 L${x+64} 104 L${x+68} 90 L${x+82} 90 C${x+90} 90 ${x+94} 72 ${x+104} 72 C${x+114} 72 ${x+118} 90 ${x+126} 90 L${x+150} 90`;
  return sv(210,`<rect x="10" y="20" width="300" height="100" style="fill:#FFF5F3;stroke:#F2C6C0"/><path d="${grid.join(" ")}" style="stroke:#F7D6D1;stroke-width:.6"/>
   <path d="${beat(10)} ${beat(160).replace(/^M/,"L")}" style="fill:none;stroke:#1C2733;stroke-width:1.8;stroke-linejoin:round"/>
   ${AT(36,74,"P","st-b st-dark","middle")}${AT(68,30,"R","st-b st-dark","middle")}${AT(60,114,"Q","st-dark","middle")}${AT(76,114,"S","st-dark","middle")}${AT(114,66,"T","st-b st-dark","middle")}
   <path d="M24 128 L56 128" style="stroke:#3E7CC4;stroke-width:1.8"/>${AT(40,140,"PR","st-blue st-b","middle")}<path d="M62 128 L136 128" style="stroke:#B4513A;stroke-width:1.8"/>${AT(99,140,"QT","st-acc st-b","middle")}
   ${AT(10,160,"P : les oreillettes se contractent (dépolarisation)","st-sub")}${AT(10,174,"QRS : les ventricules se contractent (dépolarisation)","st-sub")}${AT(10,188,"T : les ventricules se relâchent (repolarisation)","st-sub")}${AT(10,202,"1 grand carreau = 0,2 s ; 5 grands carreaux = 1 seconde","st-sub")}
   ${AT(160,14,"Un battement cardiaque sur l'ECG","st-b","middle")}`,"Les ondes de l'électrocardiogramme");},
 hypophyse:()=>sv(272,`<g transform="translate(4 4) scale(.78)">
   <path d="M20 96 C14 50 54 18 106 16 C146 14 176 36 182 70 C186 92 176 108 160 112 C150 114 140 112 132 116 C124 120 118 128 106 130 C80 134 52 126 34 116 C26 110 22 104 20 96 Z" style="fill:url(#rg-brain);stroke:#9A6E66;stroke-width:1.4"/>
   ${fl("M60 40 C70 54 64 70 76 82 M100 26 C104 44 96 58 108 70 M140 34 C138 52 150 62 146 80 M40 84 C56 80 66 92 82 88","#B9857A",1.6)}
   <ellipse cx="112" cy="110" rx="16" ry="9" style="fill:#E6A9A0;stroke:#9A6E66;stroke-width:1.2"/><path d="M110 118 L112 134" style="stroke:#9A6E66;stroke-width:3.5"/>
   <path d="M100 136 C100 128 124 128 124 136 C124 146 116 150 112 150 C106 150 100 146 100 136 Z" style="fill:url(#rg-gland);stroke:#9A6E66;stroke-width:1.2"/><path d="M112 130 L112 150" style="stroke:#9A6E66;stroke-width:1"/></g>
   ${LL(104,90,160,54)}${AT(164,46,"Hypothalamus","st-b")}${AT(164,58,"le chef d'orchestre","st-sub")}${LL(102,112,160,92)}${AT(164,86,"Hypophyse","st-b")}${AT(164,98,"sous l'hypothalamus,","st-sub")}${AT(164,110,"commande les glandes","st-sub")}
   ${AR("M92 124 L92 150","#2E7D4F",1.6)}${[["Thyroïde","TSH → T3, T4 (métabolisme)"],["Surrénales","ACTH → cortisol (stress)"],["Ovaires, testicules","FSH, LH (fertilité)"],["Croissance, sein","GH, prolactine"],["Rein, utérus","ADH (eau), ocytocine"]].map(([g,h],i)=>`${AR(`M30 ${166+i*15} L44 ${166+i*15}`,"#2E7D4F",1.3)}${AT(50,170+i*15,g,"st-b")}${AT(164,170+i*15,h,"st-sub")}`).join("")}
   ${AT(160,254,"Rétrocontrôle : les hormones produites freinent","st-acc","middle")}${AT(160,266,"l'hypothalamus et l'hypophyse quand il y en a assez","st-acc","middle")}`,"L'axe hypothalamo-hypophysaire"),
 homme:()=>sv(236,`
   <path d="M210 10 C238 30 248 70 246 110 C244 150 236 176 226 196" style="fill:none;stroke:url(#rg-colon);stroke-width:22;stroke-linecap:round"/>
   <path d="M118 30 C150 18 190 30 194 64 C198 96 178 114 150 116 C122 118 98 104 96 76 C94 52 102 38 118 30 Z" style="fill:url(#rg-bladder);stroke:#A87F86;stroke-width:1.2"/>
   <path d="M196 70 C214 66 220 86 210 98 C202 106 192 100 192 90 Z" style="fill:url(#rg-gland);stroke:#A08260;stroke-width:1"/>
   <path d="M124 118 C122 132 132 144 148 144 C164 144 174 132 172 118 C162 122 134 122 124 118 Z" style="fill:url(#rg-gland);stroke:#A08260;stroke-width:1.2"/>
   <path d="M58 92 C70 84 82 96 84 108 C86 120 78 128 70 124" style="fill:url(#rg-bone);stroke:#B79A6E;stroke-width:1.2"/>
   <path d="M148 120 L146 156 C144 170 128 176 112 176 L44 176" style="fill:none;stroke:#E9B49E;stroke-width:16;stroke-linecap:round"/><path d="M148 120 L146 156 C144 170 128 176 112 176 L44 176" style="fill:none;stroke:#D97E6A;stroke-width:3"/>
   <path d="M118 180 C110 196 116 222 138 224 C160 226 168 204 160 188 C154 178 128 176 118 180 Z" style="fill:#EBC1A8;stroke:#B98868;stroke-width:1"/>
   <ellipse cx="140" cy="204" rx="14" ry="17" style="fill:url(#rg-ovary);stroke:#A87F86;stroke-width:1.2"/><path d="M152 192 C162 196 162 214 152 218" style="fill:none;stroke:#C29A8E;stroke-width:5;stroke-linecap:round"/>
   ${vs("M156 190 C176 176 186 150 186 120 C186 98 198 88 202 84",2.6,"#E2C9A8","#A88B66",false)}
   ${LL(120,60,80,40)}${AT(4,36,"Vessie","st-b")}${LL(204,84,250,60)}${AT(316,56,"Vésicule\nséminale","st-b","end")}${LL(150,140,250,128)}${AT(316,126,"Prostate","st-b","end")}
   ${LL(186,130,250,94)}${AT(316,92,"Canal déférent","st-b","end")}${LL(160,204,250,172)}${AT(316,170,"Épididyme","st-b","end")}${LL(144,216,250,212)}${AT(316,210,"Testicule\n(spermatozoïdes,\ntestostérone)","st-b","end")}
   ${LL(80,176,60,200)}${AT(4,212,"Urètre (urine\net sperme)","st-b")}${LL(72,108,40,120)}${AT(4,118,"Pubis","st-b")}${AT(250,30,"Rectum","st-b")}`,"L'appareil génital masculin"),
 menstru:()=>{const X=d=>30+(d-1)*10;const curve=pts=>pts.map(([d,v],i)=>(i?"L":"M")+X(d)+" "+v).join(" ");
  return sv(236,`<path d="M30 112 H300 M30 20 V112" style="stroke:var(--fx-sub);stroke-width:1"/>
   ${[1,7,14,21,28].map(d=>AT(X(d),124,"J"+d,"st-sub","middle")).join("")}<path d="M${X(14)} 22 V112" style="stroke:#B4513A;stroke-dasharray:3 3;stroke-width:1"/>${AT(X(14),16,"Ovulation","st-acc st-b","middle")}
   <path d="${curve([[1,96],[5,88],[10,86],[13,60],[14,34],[15,62],[18,96],[28,100]])}" style="fill:none;stroke:#D9A23A;stroke-width:2.2"/>
   <path d="${curve([[1,92],[5,84],[9,90],[13,82],[14,74],[16,90],[28,96]])}" style="fill:none;stroke:#3E7CC4;stroke-width:2"/>
   <path d="${curve([[1,100],[6,92],[11,62],[13,48],[15,84],[20,68],[24,74],[28,98]])}" style="fill:none;stroke:#D96C8A;stroke-width:2.2"/>
   <path d="${curve([[1,106],[13,106],[16,96],[21,54],[25,80],[28,104]])}" style="fill:none;stroke:#2E7D4F;stroke-width:2.2"/>
   ${AT(166,36,"LH","st-amber st-b")}${AT(52,80,"FSH","st-blue st-b")}${AT(70,50,"Œstrogènes","st-b")}${AT(232,46,"Progestérone","st-green st-b")}
   <path d="M30 150 L${X(5)} 166 L${X(14)} 150 L${X(21)} 136 L${X(28)} 136 L300 166 L300 180 L30 180 Z" style="fill:url(#rg-uterus);stroke:#A15A6A;stroke-width:1"/>
   <path d="M30 150 L${X(5)} 166" style="stroke:#C8372D;stroke-width:4"/>${AT(30,196,"Endomètre","st-b")}
   ${AT(X(3),214,"Règles","st-acc st-b","middle")}${AT(X(9.5),214,"Phase folliculaire","st-sub","middle")}${AT(X(22),214,"Phase lutéale","st-sub","middle")}
   ${AT(X(9.5),228,"le follicule mûrit","st-sub","middle")}${AT(X(22),228,"le corps jaune agit","st-sub","middle")}`,"Le cycle menstruel : hormones et endomètre");},
 villosite:()=>{const vil=(x,big)=>{const w=big?44:22,h=big?120:80,y=170-h;return `<path d="M${x-w/2} 170 L${x-w/2} ${y+w/2} A${w/2} ${w/2} 0 0 1 ${x+w/2} ${y+w/2} L${x+w/2} 170 Z" style="fill:url(#rg-mucosa);stroke:#B5675C;stroke-width:1.2"/>`;};
  return sv(214,`<rect x="8" y="170" width="190" height="28" style="fill:url(#rg-muscle);stroke:#8E3A30;stroke-width:1"/>
   ${vil(24)}${vil(52)}${vil(150)}${vil(178)}${vil(100,true)}
   ${art("M88 168 L88 74 C88 60 112 60 112 74",2,false)}${vein("M112 74 L112 168",2,false)}${fl("M88 90 L112 96 M88 110 L112 116 M88 130 L112 136 M88 150 L112 154","#C8574A",.9)}
   <path d="M100 166 L100 76" style="stroke:#EBD58A;stroke-width:5;stroke-linecap:round"/>
   <rect x="232" y="22" width="80" height="62" rx="8" style="fill:var(--surface);stroke:var(--line)"/>${[0,1,2].map(i=>`<rect x="${242+i*22}" y="42" width="18" height="36" rx="3" style="fill:#F2C2B6;stroke:#B5675C"/><path d="M${244+i*22} 42 v-8 M${248+i*22} 42 v-8 M${252+i*22} 42 v-8 M${256+i*22} 42 v-8" style="stroke:#B5675C;stroke-width:1.4"/>`).join("")}
   ${AT(270,16,"Entérocytes","st-b","middle")}${AT(272,96,"microvillosités","st-sub","middle")}
   ${LL(116,52,200,120)}${AT(204,124,"Villosité","st-b")}${LL(88,100,200,144)}${AT(204,148,"Capillaires :","st-b")}${AT(204,160,"sucres, acides aminés","st-sub")}
   ${LL(100,130,200,178)}${AT(204,182,"Vaisseau chylifère :","st-b")}${AT(204,194,"graisses","st-sub")}${AT(102,212,"Paroi musculaire de l'intestin","st-sub","middle")}`,"Les villosités de l'intestin grêle : la surface d'absorption");},
 lymph:()=>{const S=1.18,X=110,Y=6,P=(x,y)=>HP(X,Y,S,x,y);const nd=(x,y)=>`<ellipse cx="${x}" cy="${y}" rx="3.4" ry="2.4" style="fill:#7FB98A;stroke:#2E7D4F;stroke-width:.8"/>`;
  const inner=`${fl("M160 46 L160 110 M150 34 L146 50 M170 34 L174 50 M160 70 L132 62 L120 96 M160 70 L188 62 L200 96 M160 110 L146 150 L142 200 M160 110 L174 150 L178 200","#5FA36B",1.1)}
   ${[[148,40],[152,46],[168,40],[172,46],[126,64],[130,70],[190,64],[194,70],[152,72],[166,78],[156,90],[146,150],[150,156],[174,150],[170,156]].map(([x,y])=>nd(x,y)).join("")}
   <ellipse cx="160" cy="62" rx="8" ry="6" style="fill:url(#rg-gland);stroke:#A08260;stroke-width:.8"/><ellipse cx="180" cy="102" rx="9" ry="5" transform="rotate(-25 180 102)" style="fill:url(#rg-spleen);stroke:#7A3A3A;stroke-width:.8"/>`;
  const L=(x,y,t,lx,ly,a)=>{const [px,py]=P(x,y);return LL(a==="end"?lx+4:lx-4,ly-3,px,py)+AT(lx,ly,t,"st-b",a);};
  return sv(290,HB(X,Y,S,inner)+L(150,42,"Ganglions cervicaux",206,30)+L(160,62,"Thymus (maturation\ndes lymphocytes T)",206,64)+L(188,64,"Ganglions axillaires",206,104)+L(182,102,"Rate (filtre le sang)",206,136)+
   L(160,100,"Canal thoracique",206,166)+L(148,152,"Ganglions inguinaux",206,200)+AT(206,236,"Vaisseaux\nlymphatiques : la\nlymphe rejoint les\nveines du cou","st-sub"),"Le système lymphatique");},
 oreille:()=>sv(228,`<rect x="96" y="20" width="220" height="170" rx="16" style="fill:url(#rg-bone);opacity:.55"/>
   <path d="M40 40 C14 50 10 100 30 130 C40 146 56 150 62 138 C68 126 58 118 60 104 C62 92 74 88 76 74 C78 58 60 34 40 40 Z" style="fill:url(#rg-skin);stroke:#B98868;stroke-width:1.2"/>
   <path d="M66 96 L146 100" style="stroke:#3A2A20;stroke-width:12;stroke-linecap:round;opacity:.15"/><path d="M66 96 C90 92 120 98 146 100" style="fill:none;stroke:#E9C3AB;stroke-width:10;stroke-linecap:round"/>
   <path d="M148 84 C152 92 152 108 148 116" style="fill:none;stroke:#C98A7A;stroke-width:3"/>
   <path d="M152 92 l10 -6 l6 4 M168 90 l8 8 l8 -2 M184 96 l6 8" style="fill:none;stroke:#D9C49A;stroke-width:4;stroke-linecap:round"/>
   <path d="M234 108 m-18 0 a18 18 0 1 1 36 0 a13 13 0 1 1 -26 0 a8 8 0 1 1 16 0 a4 4 0 1 1 -8 0" style="fill:none;stroke:#C9A86E;stroke-width:5;stroke-linecap:round"/>
   <path d="M198 82 C194 56 214 50 222 70 M206 84 C210 58 236 60 230 84 M200 92 C178 82 186 62 204 72" style="fill:none;stroke:#C9A86E;stroke-width:4;stroke-linecap:round"/>
   ${nerf("M252 108 C270 104 286 98 306 96",3,false)}${vs("M160 116 C170 140 186 160 200 186",5,"#E9C3AB","#B98868",false)}
   ${AT(40,12,"Externe","st-acc st-b","middle")}${AT(150,12,"Moyenne","st-acc st-b","middle")}${AT(262,12,"Interne","st-acc st-b","middle")}
   ${LL(30,70,14,58)}${AT(4,52,"Pavillon","st-b")}${LL(104,96,96,58)}${AT(96,52,"Conduit auditif","st-b","middle")}${LL(149,88,150,38)}${AT(150,32,"Tympan","st-b","middle")}
   ${LL(172,96,160,138)}${AT(150,152,"Osselets : marteau,","st-b","middle")}${AT(150,164,"enclume, étrier","st-b","middle")}${LL(214,66,236,44)}${AT(316,32,"Canaux semi-circulaires","st-b","end")}${AT(316,44,"(équilibre)","st-sub","end")}
   ${LL(240,122,272,160)}${AT(316,172,"Cochlée (audition)","st-b","end")}${AT(316,86,"Nerf auditif","st-b","end")}${LL(180,156,100,206)}${AT(4,208,"Trompe d'Eustache","st-b")}${AT(4,220,"(vers la gorge)","st-sub")}`,"L'oreille en coupe : audition et équilibre"),
 hemostase:()=>{const ves=(x,narrow)=>`<path d="M${x} ${narrow?70:62} C${x+30} ${narrow?74:62} ${x+60} ${narrow?74:62} ${x+90} ${narrow?70:62} L${x+90} 110 C${x+60} ${narrow?106:110} ${x+30} ${narrow?106:110} ${x} 110 Z" style="fill:url(#rg-blood);stroke:#8B1E17;stroke-width:1.2"/>
   <path d="M${x} ${narrow?62:54} C${x+30} ${narrow?66:54} ${x+60} ${narrow?66:54} ${x+90} ${narrow?62:54}" style="fill:none;stroke:#E2A79C;stroke-width:7"/>`;
  const rbc=(x,y)=>`<ellipse cx="${x}" cy="${y}" rx="4.4" ry="3" style="fill:#E0574A;stroke:#8E1F17;stroke-width:.5"/>`;const pl=(x,y)=>`<circle cx="${x}" cy="${y}" r="2.6" style="fill:#F2CF5B;stroke:#A9831B;stroke-width:.5"/>`;
  return sv(214,`${ves(10,true)}${ves(116,false)}${ves(222,false)}
   ${[[30,90],[50,96],[70,88]].map(([x,y])=>rbc(x,y)).join("")}<path d="M50 66 C46 50 54 42 50 30" style="fill:none;stroke:#C8372D;stroke-width:3;stroke-dasharray:2 3"/>
   ${[[146,96],[176,92]].map(([x,y])=>rbc(x,y)).join("")}${[[158,58],[162,54],[166,58],[160,62],[154,55],[168,62],[163,48],[157,49]].map(([x,y])=>pl(x,y)).join("")}
   ${fl("M252 44 L280 70 M256 70 L284 44 M248 56 L288 58 M262 40 L270 74 M276 40 L262 74","#E8D69A",1.1)}${[[262,52],[274,60],[268,48],[280,54]].map(([x,y])=>rbc(x,y)).join("")}${[[258,62],[284,62]].map(([x,y])=>pl(x,y)).join("")}
   ${AT(55,138,"1. Le vaisseau","st-b","middle")}${AT(55,150,"se contracte","st-b","middle")}${AT(55,164,"(vasoconstriction)","st-sub","middle")}
   ${AT(161,138,"2. Les plaquettes","st-b","middle")}${AT(161,150,"bouchent la brèche","st-b","middle")}${AT(161,164,"(clou plaquettaire)","st-sub","middle")}
   ${AT(267,138,"3. La fibrine","st-b","middle")}${AT(267,150,"solidifie le caillot","st-b","middle")}${AT(267,164,"(coagulation)","st-sub","middle")}
   ${AR("M100 86 L112 86","#5C6B7A",1.4)}${AR("M206 86 L218 86","#5C6B7A",1.4)}${AT(160,198,"Puis la fibrinolyse dissout le caillot quand la paroi est réparée","st-acc","middle")}${AT(160,16,"Brèche dans la paroi du vaisseau","st-sub","middle")}`,"Les trois temps de l'hémostase");},
 ventilation:()=>{const th=(x,insp)=>{const d=insp?118:100;return `<path d="M${x+8} 30 C${x+4} 70 ${x+4} 120 ${x+14} 150 L${x+136} 150 C${x+146} 120 ${x+146} 70 ${x+142} 30" style="fill:none;stroke:#C9B48E;stroke-width:2.2"/>
   ${[46,64,82,100,118].map(y=>`<path d="M${x+12} ${insp?y-4:y} C${x+40} ${insp?y-10:y+6} ${x+110} ${insp?y-10:y+6} ${x+138} ${insp?y-4:y}" style="fill:none;stroke:#DCCBA8;stroke-width:3;opacity:.8"/>`).join("")}
   <path d="M${x+68} 40 C${x+44} 40 ${x+28} 70 ${x+26} ${d+4} C${x+40} ${d+10} ${x+60} ${d+10} ${x+70} ${d+4} Z" style="fill:url(#rg-lung);stroke:#B5675C;stroke-width:1"/><path d="M${x+82} 40 C${x+106} 40 ${x+122} 70 ${x+124} ${d+4} C${x+110} ${d+10} ${x+90} ${d+10} ${x+80} ${d+4} Z" style="fill:url(#rg-lung);stroke:#B5675C;stroke-width:1"/>
   <path d="M${x+75} 14 L${x+75} 42" style="stroke:#DCEAF0;stroke-width:6"/><path d="M${x+14} ${d+12} C${x+40} ${insp?d+16:d-18} ${x+110} ${insp?d+16:d-18} ${x+136} ${d+12}" style="fill:none;stroke:url(#rg-muscle);stroke-width:7;stroke-linecap:round"/>`;};
  return sv(228,`${th(6,true)}${th(166,false)}${AR("M81 4 L81 30","#3E7CC4",2)}${AR("M241 30 L241 4","#B4513A",2)}
   ${AR("M60 142 L60 158","#5C6B7A",1.6)}${AR("M220 118 L220 104","#5C6B7A",1.6)}
   ${AT(81,180,"Inspiration (active)","st-b","middle")}${AT(81,194,"le diaphragme descend,","st-sub","middle")}${AT(81,206,"les côtes montent :","st-sub","middle")}${AT(81,218,"l'air entre","st-sub","middle")}
   ${AT(241,180,"Expiration (passive)","st-b","middle")}${AT(241,194,"le diaphragme remonte,","st-sub","middle")}${AT(241,206,"les poumons se vident :","st-sub","middle")}${AT(241,218,"l'air sort","st-sub","middle")}`,"La ventilation : inspiration et expiration");},
 circulation:()=>{const N=(x,y,n)=>`<circle cx="${x}" cy="${y}" r="7.5" style="fill:var(--surface);stroke:var(--fx-sub);stroke-width:1"/>${AT(x,y+3.6,String(n),"st-b","middle")}`;
  return sv(292,`
   <path d="M128 16 C108 16 100 38 102 56 L152 56 C150 36 146 16 128 16 Z M192 16 C212 16 220 38 218 56 L168 56 C170 36 174 16 192 16 Z" style="fill:url(#rg-lung);stroke:#B5675C;stroke-width:1"/>${AT(160,72,"Poumons","st-b","middle")}
   <path d="M112 96 C112 86 160 86 160 98 L160 160 C138 160 112 146 112 128 Z" style="fill:url(#rg-bloodB);stroke:#2E4079;stroke-width:1.2"/><path d="M160 98 C160 86 208 86 208 96 L208 128 C208 146 182 160 160 160 Z" style="fill:url(#rg-bloodR);stroke:#8B1E17;stroke-width:1.2"/>
   ${AT(136,118,"Cœur","st-b st-dark","middle")}${AT(136,130,"droit","st-b st-dark","middle")}${AT(184,118,"Cœur","st-b st-dark","middle")}${AT(184,130,"gauche","st-b st-dark","middle")}
   <rect x="100" y="198" width="120" height="34" rx="10" style="fill:url(#rg-gray);stroke:#B8AE9F"/>${AT(160,212,"Organes et tissus","st-b st-dark","middle")}${AT(160,225,"(capillaires)","st-dark","middle")}
   ${AR("M124 92 C110 80 108 70 114 60","#2E5AAC",2.4)}${AR("M206 60 C212 70 210 80 196 92","#C8372D",2.4)}
   ${AR("M208 132 C262 140 266 192 224 212","#C8372D",2.4)}${AR("M96 214 C56 194 60 140 110 128","#2E5AAC",2.4)}
   ${N(102,76,1)}${N(218,76,2)}${N(258,172,3)}${N(64,172,4)}
   ${AT(4,96,"Petite","st-b")}${AT(4,108,"circulation","st-b")}${AT(4,206,"Grande","st-b")}${AT(4,218,"circulation","st-b")}
   ${AT(10,250,"1  Artère pulmonaire : sang pauvre en O₂ vers les poumons","st-blue")}${AT(10,263,"2  Veines pulmonaires : sang oxygéné vers le cœur gauche","st-acc")}
   ${AT(10,276,"3  Aorte puis artères : sang oxygéné vers les organes","st-acc")}${AT(10,289,"4  Veines caves : sang pauvre en O₂ vers le cœur droit","st-blue")}`,"La petite et la grande circulation");},
 compartiments:()=>{const N=(x,y,n)=>`<circle cx="${x}" cy="${y}" r="7.5" style="fill:var(--surface);stroke:var(--fx-sub);stroke-width:1"/>${AT(x,y+3.6,String(n),"st-b","middle")}`;
  const cel=(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r}" style="fill:#EADFF6;stroke:#9C84C8;stroke-width:1"/><circle cx="${x+2}" cy="${y-1}" r="${r*.32}" style="fill:#B9A5DD"/>`;
  const rbc=(x,y)=>`<ellipse cx="${x}" cy="${y}" rx="6" ry="3.6" style="fill:url(#rg-blood);stroke:#8E1F17;stroke-width:.5"/>`;
  return sv(274,`${AT(160,14,"Eau totale ≈ 60 % du poids du corps","st-b","middle")}${AT(160,27,"soit ≈ 42 L chez un adulte de 70 kg","st-sub","middle")}
   <rect x="10" y="38" width="196" height="90" rx="10" style="fill:#F4EEFB;stroke:#9C84C8;stroke-width:1.2"/>${cel(32,58,11)}${cel(184,58,10)}${cel(30,108,10)}${cel(186,110,11)}
   <rect x="206" y="38" width="76" height="90" style="fill:#E4F1F8;stroke:#7FAFCB;stroke-width:1.2"/><rect x="282" y="38" width="28" height="90" rx="6" style="fill:#F7D6D1;stroke:#C8372D;stroke-width:1.2"/>
   ${rbc(296,54)}${rbc(296,112)}<path d="M206 40 L206 126" style="stroke:#7A62A8;stroke-width:2.4;stroke-dasharray:5 3"/><path d="M282 40 L282 126" style="stroke:#C8372D;stroke-width:2.4;stroke-dasharray:5 3"/>
   ${AT(108,72,"Secteur intracellulaire","st-b st-dark","middle")}${AT(108,86,"40 % du poids · 28 L","st-dark","middle")}${AT(108,102,"riche en K⁺","st-b st-dark","middle")}
   ${AT(244,72,"Interstitiel","st-b st-dark","middle")}${AT(244,86,"15 % · 10,5 L","st-dark","middle")}${AT(244,102,"riche en Na⁺","st-b st-dark","middle")}
   ${N(206,38,1)}${N(282,38,2)}${N(296,83,3)}
   ${fl("M12 134 L12 140 L204 140 L204 134","#9C84C8",1.4)}${fl("M208 134 L208 140 L308 140 L308 134","#7FAFCB",1.4)}
   ${AT(108,155,"Intracellulaire : 2/3 de l'eau","st-b","middle")}${AT(258,155,"Extracellulaire : 1/3","st-b","middle")}${AT(258,168,"(interstitiel + plasma)","st-sub","middle")}
   ${AT(8,190,"1  Membrane des cellules : laisse passer l'eau,","st-b")}${AT(22,203,"les ions sont triés par la pompe Na⁺/K⁺","st-sub")}
   ${AT(8,220,"2  Paroi des capillaires : eau et ions passent,","st-b")}${AT(22,233,"les protéines (albumine) restent dans le plasma","st-sub")}
   ${AT(8,250,"3  Plasma : 5 % du poids, ≈ 3,5 L (sang ≈ 5 L)","st-b")}${AT(160,270,"L'eau va toujours vers le secteur le plus concentré","st-acc","middle")}`,"Les compartiments liquidiens de l'organisme");},
 ph:()=>{const X=v=>+(20+(v-6.8)*280).toFixed(1);
  const box=(x,c,t)=>`<rect x="${x}" y="116" width="148" height="110" rx="9" style="fill:var(--surface);stroke:${c};stroke-width:1.4"/>`;
  return sv(266,`${AT(160,14,"Valeurs compatibles avec la vie : pH 6,8 à 7,8","st-sub","middle")}
   ${AT(97,38,"ACIDOSE","st-b st-acc","middle")}${AT(188,38,"Normal","st-b st-green","middle")}${AT(251,38,"ALCALOSE","st-b st-blue","middle")}
   <rect x="20" y="46" width="${X(7.35)-20}" height="24" rx="6" style="fill:#F4C3B5;stroke:#C8553D;stroke-width:1"/><rect x="${X(7.45)}" y="46" width="${300-X(7.45)}" height="24" rx="6" style="fill:#C5D9F1;stroke:#2E5AAC;stroke-width:1"/>
   <rect x="${X(7.35)}" y="44" width="${X(7.45)-X(7.35)}" height="28" rx="3" style="fill:#BFE3C8;stroke:#2E7D4F;stroke-width:1.4"/><path d="M${X(7.4)-5} 40 L${X(7.4)+5} 40 L${X(7.4)} 46 Z" style="fill:#2E7D4F"/>
   ${AR("M60 58 L34 58","#C8372D",1.6)}${AR("M240 58 L292 58","#2E5AAC",1.6)}
   ${[6.8,7,7.2,7.35,7.45,7.6,7.8].map(v=>`<path d="M${X(v)} 72 L${X(v)} 78" style="stroke:var(--fx-sub);stroke-width:1"/>${AT(X(v),90,String(v).replace(".",",").replace(/^7$/,"7,0"),"st-sub","middle")}`).join("")}
   ${AT(160,106,"pH normal du sang artériel : 7,35 à 7,45","st-b","middle")}
   ${box(8,"#C8553D")}${box(164,"#2E5AAC")}
   ${AT(16,134,"Acidose (pH < 7,35)","st-b st-acc")}${AT(16,151,"Respiratoire : CO₂ ↑","st-b")}${AT(16,164,"hypoventilation (BPCO,","st-sub")}${AT(16,177,"sédation, opioïdes)","st-sub")}
   ${AT(16,194,"Métabolique : HCO₃⁻ ↓","st-b")}${AT(16,207,"acidocétose, diarrhée,","st-sub")}${AT(16,220,"insuffisance rénale","st-sub")}
   ${AT(172,134,"Alcalose (pH > 7,45)","st-b st-blue")}${AT(172,151,"Respiratoire : CO₂ ↓","st-b")}${AT(172,164,"hyperventilation","st-sub")}${AT(172,177,"(anxiété, douleur)","st-sub")}
   ${AT(172,194,"Métabolique : HCO₃⁻ ↑","st-b")}${AT(172,207,"vomissements,","st-sub")}${AT(172,220,"diurétiques","st-sub")}
   ${AT(160,246,"Les poumons corrigent le CO₂ (en minutes)","st-b","middle")}${AT(160,259,"et les reins corrigent les bicarbonates (en jours)","st-sub","middle")}`,"L'échelle du pH sanguin, acidose et alcalose");},
 immun:()=>{const P1="M50 168 C68 168 78 166 90 150 C100 136 110 133 122 137 C140 144 160 155 188 158",P2="M190 158 C197 156 201 120 211 82 C219 58 229 52 241 56 C263 64 285 80 305 90";
  const tri=(x,c)=>`<path d="M${x-5} 180 L${x+5} 180 L${x} 172 Z" style="fill:${c}"/>`;
  return sv(226,`${AT(30,22,"Taux d'anticorps","st-sub")}<path d="M30 28 L30 170 L308 170" style="fill:none;stroke:var(--fx-sub);stroke-width:1.2"/>${AT(308,186,"Temps","st-sub","end")}
   <path d="${P1} L188 170 L50 170 Z" style="fill:#6FA3D8;opacity:.22"/><path d="${P2} L305 170 L190 170 Z" style="fill:#2E7D4F;opacity:.18"/>
   ${fl(P1,"#2E5AAC",2.4)}${fl(P2,"#2E7D4F",2.6)}${fl("M190 32 L190 158","#8A97A6",1,";stroke-dasharray:3 3")}
   ${AT(122,100,"Réponse primaire","st-b st-blue","middle")}${AT(122,112,"lente, faible","st-sub","middle")}
   ${AT(258,28,"Réponse secondaire","st-b st-green","middle")}${AT(258,40,"rapide, forte, durable","st-sub","middle")}
   ${tri(50,"#2E5AAC")}${tri(190,"#2E7D4F")}${AT(50,194,"1er contact","st-b","middle")}${AT(50,206,"(vaccin, infection)","st-sub","middle")}
   ${AT(190,194,"2e contact","st-b","middle")}${AT(190,206,"(rappel, vrai microbe)","st-sub","middle")}
   ${AT(40,120,"délai :","st-sub")}${AT(40,132,"1 à 2 sem.","st-sub")}${fl("M52 142 L86 142 M52 138 L52 146 M86 138 L86 146","#5C6B7A",1.1)}
   ${AT(160,224,"Les cellules mémoire expliquent l'efficacité des rappels","st-acc","middle")}`,"Réponse immunitaire primaire et secondaire");},
 cicatrisation:()=>{const pan=(x,y,t,sub,bot,k)=>{const cx=x+74,y0=y+30;
   const skin=`<rect x="${x+4}" y="${y0}" width="140" height="10" style="fill:#E9C9A3;stroke:#C29A73;stroke-width:.8"/><rect x="${x+4}" y="${y0+10}" width="140" height="34" style="fill:#F2C9BC;stroke:#D9A291;stroke-width:.8"/><rect x="${x+4}" y="${y0+44}" width="140" height="12" style="fill:#F6E2A8;stroke:#D8C07A;stroke-width:.8"/>`;
   const hole=`M${cx-24} ${y0} C${cx-18} ${y0+34} ${cx+18} ${y0+34} ${cx+24} ${y0} Z`;let w="";
   if(k===1)w=`<path d="${hole}" style="fill:#A3241C;stroke:#7E1A14;stroke-width:1"/>${[[cx-10,y0+6],[cx+6,y0+10],[cx-2,y0+18],[cx+12,y0+4],[cx-14,y0+14]].map(([a,b])=>`<circle cx="${a}" cy="${b}" r="2.2" style="fill:#F2CF5B;stroke:#A9831B;stroke-width:.4"/>`).join("")}`;
   if(k===2)w=`<ellipse cx="${cx}" cy="${y0+14}" rx="46" ry="20" style="fill:#E0574A;opacity:.22"/><path d="${hole}" style="fill:#B8463C;stroke:#7E1A14;stroke-width:1"/>${[[cx-12,y0+8],[cx+4,y0+6],[cx+14,y0+12],[cx-4,y0+16],[cx+6,y0+22],[cx-16,y0+3],[cx-30,y0+20],[cx+32,y0+22]].map(([a,b])=>`<circle cx="${a}" cy="${b}" r="2.8" style="fill:#C9B8E8;stroke:#6E5196;stroke-width:.7"/>`).join("")}`;
   if(k===3)w=`<path d="${hole}" style="fill:#D9473B;stroke:#9E2A20;stroke-width:1"/>${[-14,-5,4,13].map((d,i)=>`<circle cx="${cx+d}" cy="${y0+4+(i%2)*2}" r="5" style="fill:#EC6A5C;stroke:#B8352A;stroke-width:.6"/>`).join("")}${[-9,0,9].map(d=>`<circle cx="${cx+d}" cy="${y0+14}" r="4.6" style="fill:#E65A4D;stroke:#B8352A;stroke-width:.6"/>`).join("")}${fl(`M${cx-30} ${y0+2} L${cx-20} ${y0+3} M${cx+30} ${y0+2} L${cx+20} ${y0+3}`,"#F4A7B5",3)}`;
   if(k===4)w=`<path d="M${cx-22} ${y0+11} C${cx-12} ${y0+26} ${cx+12} ${y0+26} ${cx+22} ${y0+11} Z" style="fill:#F8E6DE;stroke:#E2BFB2;stroke-width:.8"/><rect x="${cx-24}" y="${y0}" width="48" height="10" style="fill:#F3C6CF;stroke:#D89AA6;stroke-width:.8"/>`;
   return `<rect x="${x}" y="${y}" width="148" height="112" rx="9" style="fill:var(--surface);stroke:var(--fx-line,#D8D2C8);stroke-width:1"/>${AT(x+8,y+14,t,"st-b")}${AT(x+8,y+26,sub,"st-sub")}${skin}${w}${AT(cx,y+104,bot,"st-sub","middle")}`;};
  return sv(262,`${pan(8,4,"1. Hémostase","premières minutes","caillot et plaquettes",1)}${pan(164,4,"2. Inflammation","J1 à J4 : détersion","rougeur, chaleur, œdème",2)}
   ${pan(8,124,"3. Bourgeonnement","J4 à J21 environ","tissu rouge vif, fragile",3)}${pan(164,124,"4. Épidermisation","l'épiderme se referme","tissu rose, puis cicatrice",4)}
   ${AT(160,254,"Puis maturation : la cicatrice se renforce pendant 1 à 2 ans","st-acc","middle")}`,"Les phases de la cicatrisation d'une plaie");}
});
Object.assign(SCH_T,{
 cellule:["La cellule","Les organites et leur rôle"],neurone:["Le neurone et la synapse","Comment l'influx nerveux circule"],os:["Un os long","Structure et moelle osseuse"],
 articulation:["Une articulation mobile","Cartilage, liquide synovial, capsule, ligaments"],muscle:["La contraction musculaire","Du muscle au sarcomère"],ecg:["L'électrocardiogramme","Les ondes P, QRS et T"],
 hypophyse:["L'axe hypothalamo-hypophysaire","Le chef d'orchestre des hormones"],homme:["L'appareil génital masculin","Coupe de profil"],menstru:["Le cycle menstruel","Hormones et endomètre sur 28 jours"],
 villosite:["Les villosités intestinales","La surface d'absorption de l'intestin grêle"],lymph:["Le système lymphatique","Ganglions, rate, thymus, vaisseaux"],oreille:["L'oreille","Oreille externe, moyenne et interne"],
 hemostase:["L'hémostase","Comment un saignement s'arrête"],ventilation:["La ventilation","Inspiration et expiration"],circulation:["La double circulation","Petite et grande circulation"],
 compartiments:["Les compartiments liquidiens","Où se trouve l'eau du corps"],ph:["Le pH sanguin","Acidose, alcalose et zone normale"],
 immun:["La mémoire immunitaire","Réponse primaire et réponse secondaire"],cicatrisation:["La cicatrisation","Les étapes de la réparation d'une plaie"]
});
