/* Carnet IFSI — schémas des lésions : hématologie (23 pathologies).
   Base : le sang vu dans un vaisseau ouvert, comparé à un sang normal, et la moelle osseuse qui fabrique les cellules. */
const LZB={x:14,y:47,w:198,h:88};
/* répartition régulière mais un peu irrégulière de n éléments dans un rectangle */
function lzFill(x,y,w,h,n,seed,fn){const R=lzRnd(seed),c=Math.max(1,Math.round(Math.sqrt(n*w/h))),r=Math.ceil(n/c);let s="";
 for(let k=0;k<n;k++){const i=k%c,j=Math.floor(k/c);s+=fn(x+(i+.5)*w/c+(R()-.5)*w/c*.6,y+(j+.5)*h/r+(R()-.5)*h/r*.6,R);}return s;}
/* cellules du sang */
const lzRbcN=(x,y,R,r=6.8)=>lzRbc(x,y,r,R?R()*180:0);
const lzRbcPale=(x,y,R,r=4.2)=>`<g transform="translate(${lzN(x)} ${lzN(y)}) rotate(${Math.round(R?R()*180:0)})"><ellipse rx="${r}" ry="${lzN(r*.66)}" style="fill:#F2ADA2;stroke:#C9675E;stroke-width:.6"/><ellipse rx="${lzN(r*.6)}" ry="${lzN(r*.36)}" style="fill:#FBE6E1"/></g>`;
const lzSickle=(x,y,R)=>`<path d="M-11 1.2 Q0 -11 11 1.2 Q0 -4.2 -11 1.2 Z" transform="translate(${lzN(x)} ${lzN(y)}) rotate(${Math.round(R?R()*180:0)})" style="fill:#C8372D;stroke:#7E1A14;stroke-width:.7"/>`;
const lzTargetC=(x,y,R,r=4.8)=>`<g transform="translate(${lzN(x)} ${lzN(y)}) rotate(${Math.round(R?R()*180:0)})"><ellipse rx="${r}" ry="${lzN(r*.7)}" style="fill:#F2ADA2;stroke:#C9675E;stroke-width:.6"/><ellipse rx="${lzN(r*.62)}" ry="${lzN(r*.42)}" style="fill:#FBE6E1"/><ellipse rx="${lzN(r*.26)}" ry="${lzN(r*.2)}" style="fill:#D9594C"/></g>`;
const lzSchisto=(x,y,R)=>`<path d="M-4 -2 L3 -4 L5 2 L-1 1 Z" transform="translate(${lzN(x)} ${lzN(y)}) rotate(${Math.round(R?R()*180:0)})" style="fill:#D9473C;stroke:#8E2219;stroke-width:.5"/>`;
const lzSphero=(x,y)=>lzC(x,y,4.6,"#C42E25","#7E1A14",.6);
const lzNeut=(x,y,r=7.2,lobes=3)=>lzC(x,y,r,"#F3EEF9","#8E7BB8",.9)+[...Array(lobes)].map((_,i)=>{const a=-2.4+i*4.8/(lobes-1||1);return lzC(x+Math.cos(a)*r*.38,y+Math.sin(a)*r*.3,r*(lobes>4?.2:.28),"#7A5FAE","none");}).join("")+lzP(`M${lzN(x-r*.36)} ${lzN(y)} Q${lzN(x)} ${lzN(y-r*.3)} ${lzN(x+r*.36)} ${lzN(y)}`,"none","#7A5FAE",1.1);
const lzLymph=(x,y,r=6)=>lzC(x,y,r,"#E7EEFA","#7B8FC0",.8)+lzC(x+r*.1,y,r*.76,"#5E6FB0","none");
const lzBlast=(x,y,r=8.4)=>lzC(x,y,r,"#E6DFF3","#6A55A0",.9)+lzC(x+r*.08,y+r*.05,r*.8,"#8F7AC4","none")+lzC(x-r*.15,y-r*.2,r*.17,"#D7CDEE","none")+lzC(x+r*.28,y+r*.18,r*.13,"#D7CDEE","none");
const lzPlasmo=(x,y,r=7.4)=>lzE(x,y,r*1.15,r*.85,"#DCE5F5","#6E80B8",.9)+lzC(x+r*.45,y,r*.48,"#4F5E9E","none")+[0,1,2,3,4].map(i=>lzC(x+r*.45+Math.cos(i*1.26)*r*.28,y+Math.sin(i*1.26)*r*.28,r*.09,"#C7D0EA","none")).join("");
const lzPlt=(x,y,R)=>{const a=R?R()*6:0;return `<path d="M${lzN(x-3.4)} ${lzN(y-.5)} Q${lzN(x-1.3)} ${lzN(y-3.4)} ${lzN(x+3.1)} ${lzN(y-1.8)} Q${lzN(x+3.9)} ${lzN(y+2.1)} ${lzN(x)} ${lzN(y+2.6)} Q${lzN(x-3.6)} ${lzN(y+2.1)} ${lzN(x-3.4)} ${lzN(y-.5)} Z" transform="rotate(${Math.round(a*30)} ${lzN(x)} ${lzN(y)})" style="fill:#C3A2DE;stroke:#7A5FAE;stroke-width:.6"/>`;};
const lzFib=(x1,y1,x2,y2)=>lzP(`M${x1} ${y1} L${x2} ${y2}`,"none","#C9A24E",2.2)+lzP(`M${x1} ${y1} L${x2} ${y2}`,"none","#F6E7AE",1.1);
const lzReed=(x,y)=>lzC(x,y,13,"#F1E6F4","#8A5C9C",1)+lzE(x-4.6,y,4.8,6.4,"#9C6AAE","none")+lzE(x+4.6,y,4.8,6.4,"#9C6AAE","none")+lzC(x-4.6,y-1,1.8,"#5A2C6E","none")+lzC(x+4.6,y-1,1.8,"#5A2C6E","none");
/* sang normal (médaillon de comparaison) */
const lzNormBlood=()=>lzFill(250,22,66,60,7,3,(x,y,R)=>lzRbcN(x,y,R,6))+lzNeut(270,62,7)+[[300,40],[294,70],[262,36]].map(([a,b])=>lzPlt(a,b)).join("");
function lzMed(inner,t){return `<defs><clipPath id="lzm-${t}"><circle cx="283" cy="52" r="31"/></clipPath></defs>`+lzC(283,52,32,LC.plasma,"var(--fx-sub)",1.2)+`<g clip-path="url(#lzm-${t})">${inner}</g>`+lzS(283,98,"sang normal","middle");}
/* moelle osseuse : bande d'os spongieux avec cellules ; kind normal, vide, blastes, plasmo, dys, plein */
function lzMarrow(x,y,w,h,kind="normal",seed=5){const R=lzRnd(seed);let s=lzR(x,y,w,h,6,"#F3DCD0","#C9B88E",1.2)+lzR(x,y,w,6,3,"url(#rg-bone)","none")+lzR(x,y+h-6,w,6,3,"url(#rg-bone)","none");
 const ix=x+4,iy=y+8,iw=w-8,ih=h-16;
 const tra=[0,1,2,3].map(i=>lzP(`M${x+30+i*48} ${y+6} C${x+40+i*48} ${y+h*.4} ${x+20+i*48} ${y+h*.6} ${x+34+i*48} ${y+h-6}`,"none","url(#rg-bone)",4.5)).join("");
 if(kind==="vide")return s+tra+lzFill(ix,iy,iw,ih,22,seed,(a,b)=>lzC(a,b,5.4,"#FFFDF4","#E1D3A6",.7))+lzFill(ix,iy,iw,ih,3,seed+2,(a,b)=>lzC(a,b,2.6,"#D9594C","none"));
 if(kind==="blastes")return s+tra+lzFill(ix,iy,iw,ih,28,seed,(a,b)=>lzBlast(a,b,5.6));
 if(kind==="plasmo")return s+tra+lzFill(ix,iy,iw,ih,22,seed,(a,b)=>lzPlasmo(a,b,5))+lzFill(ix,iy,iw,ih,5,seed+4,(a,b)=>lzC(a,b,2.5,"#D9594C","none"));
 if(kind==="dys")return s+tra+lzFill(ix,iy,iw,ih,24,seed,(a,b,Rr)=>Rr()<.35?lzBlast(a,b,5):Rr()<.6?lzE(a,b,4.6,3.2,"#E3A096","#A5473D",.7,Rr()*90)+lzC(a+1,b,1.6,"#7A3A35","none")+lzC(a-1.8,b+.8,1.2,"#7A3A35","none"):lzC(a,b,4.2,"#E7DDF2","#8E7BB8",.7)+lzC(a,b,2.4,"#7A5FAE","none"));
 const n=kind==="plein"?36:24;
 return s+tra+lzFill(ix,iy,iw,ih,n,seed,(a,b,Rr)=>{const k=Rr();return k<.42?lzC(a,b,3.4,"#D9594C","#9E2219",.5)+lzC(a,b,1.4,"#7A2A25","none"):k<.8?lzC(a,b,3.8,"#EDE5F6","#8E7BB8",.6)+lzC(a,b,2,"#7A5FAE","none"):k<.9?lzC(a,b,6,"#E4D6F0","#7A5FAE",.8)+lzC(a-1.6,b,1.8,"#7A5FAE","none")+lzC(a+1.8,b+.6,1.8,"#7A5FAE","none"):lzC(a,b,5,"#FFFDF4","#E1D3A6",.6);});}
/* modèle : vaisseau ouvert (cellules) + médaillon normal + bandeau du bas */
const lzBF=(id,o)=>lz(id,{t:o.t,sub:o.sub,h:o.h||262,ins:false,cap:o.cap,leg:o.leg,sk:1,
 draw:()=>{const H=o.h||262,{x,y,w,h}=LZB;
  return lzArtL(10,36,206,112,9,{rbc:0,plasma:o.plasma})+`<defs><clipPath id="lzb-${id}"><rect x="${x-3}" y="${y-2}" width="${w+5}" height="${h+4}"/></clipPath></defs><g clip-path="url(#lzb-${id})">${o.cells(LZB)}</g>`
   +(o.wall?o.wall():"")+(o.norm===false?"":lzMed(o.normIn?o.normIn():lzNormBlood(),id))
   +(o.bottomT?lzS(14,o.wall?180:160,o.bottomT,"start","st-sub st-b"):"")+(o.bottom?o.bottom():"")+(o.lab||[]).map(a=>lzLR(...a)).join("")+(o.labT||"")+(o.pill?lzPill(160,H-10,o.pill,o.pc||LC.acc):"");}});
/* petits pictogrammes du bandeau du bas */
const lzIcon=(x,y,t,svg)=>`<g transform="translate(${x} ${y})">${svg}</g>`+lzS(x,y+30,t,"middle");
const lzDrop=(x,y,c=LC.blood)=>lzP(`M${x} ${y-9} C${x+6} ${y-2} ${x+7} ${y+3} ${x} ${y+7} C${x-7} ${y+3} ${x-6} ${y-2} ${x} ${y-9} Z`,c,"#7E1A14",.8);
const lzSpleen=(x,y,s=1,c="url(#rg-spleen)")=>lzP(`M${x-24*s} ${y-6*s} C${x-22*s} ${y-22*s} ${x+12*s} ${y-26*s} ${x+24*s} ${y-12*s} C${x+32*s} ${y} ${x+22*s} ${y+18*s} ${x+4*s} ${y+20*s} C${x-6*s} ${y+21*s} ${x-4*s} ${y+8*s} ${x-14*s} ${y+8*s} C${x-24*s} ${y+8*s} ${x-26*s} ${y+2*s} ${x-24*s} ${y-6*s} Z`,c,"#5A2333",1);
/* brèche dans la paroi inférieure, sang qui sort */
const lzBreach=(x0=100,x1=124,spill=1)=>lzR(x0,137,x1-x0,13,0,"var(--surface)","none")+lzP(`M${x0} 139 l4 4 l-4 4 M${x1} 139 l-4 4 l4 4`,"none","rgba(90,40,35,.6)",1)+(spill?lzDots(x0-6,150,x1-x0+12,16,8,4,(a,b,R)=>lzRbc(a,b,4,R()*180)):"");
/* ============ Anémies ============ */
lzBF("anemie-fer",{t:"Sans fer, les globules rouges sont petits et pâles",sub:"Anémie ferriprive : le fer manque pour fabriquer l'hémoglobine, le sang transporte moins d'oxygène",
 cells:b=>lzFill(b.x,b.y,b.w,b.h,15,4,(x,y,R)=>lzRbcPale(x,y,R,4.8)),
 bottomT:"Pourquoi le fer manque :",bottom:()=>lzIcon(44,184,"saignement\n(règles, tube\ndigestif)",lzDrop(0,0))+lzIcon(120,184,"apports\nfaibles",lzC(0,0,9,"#F3E2C4","#B98B14",1)+lzP("M-5 -1 h10 M-4 3 h8","none","#B98B14",1.2))+lzIcon(196,184,"besoins accrus\n(grossesse)",lzC(0,-2,9,"#F6D3BB","#D69C79",1)+lzC(0,-2,4,"#F2A79D","none")),
 lab:[[114,"Globules rouges\npetits et pâles",1,110,84],[150,"Moins nombreux :\nmoins d'oxygène",0,160,110]],
 pill:"Toujours rechercher un saignement",
 cap:"Fatigue, pâleur, essoufflement, ongles cassants. Fer par voie orale (à jeun, avec de la vitamine C, selles noires) ou intraveineux ; aliments riches en fer (viande, abats, légumineuses)."});
lzBF("anemie-b12",{t:"Sans vitamine B12, les globules rouges sont trop gros",sub:"Anémie de Biermer ou carence en B12 : la moelle fabrique des globules géants mais peu nombreux",
 cells:b=>lzFill(b.x,b.y,b.w,b.h,8,5,(x,y,R)=>lzRbcN(x,y,R,10))+lzNeut(110,92,10,6),
 bottomT:"La B12 est absorbée grâce à l'estomac :",bottom:()=>lzP("M30 178 C40 168 64 168 70 180 C76 194 60 210 40 206 C26 202 22 188 30 178 Z","url(#rg-stomach)","#C98E6C",1)+lzS(50,222,"estomac :\nfacteur intrinsèque","middle")
  +lzArr(80,192,130,192,{c:"#1E5A6D",w:1.6})+lzP("M140 186 C150 176 168 180 172 190 C176 200 190 202 196 192","none","url(#rg-intest)",9)+lzS(168,222,"iléon :\nabsorption","middle"),
 lab:[[114,"Globules rouges\ngros, rares",1,60,72],[150,"Neutrophile\nhypersegmenté",0,116,92]],
 pill:"Atteinte des nerfs possible : traiter vite",
 cap:"Fatigue, glossite, fourmillements, troubles de la marche ou de la mémoire. Injections de vitamine B12 (à vie si maladie de Biermer) ; vigilance chez la personne âgée, végétalienne ou opérée de l'estomac."});
lzBF("anemie-folates",{t:"Sans folates, les globules rouges sont trop gros",sub:"Carence en vitamine B9 : la division des cellules de la moelle ralentit, les globules sont gros et rares",
 cells:b=>lzFill(b.x,b.y,b.w,b.h,9,7,(x,y,R)=>lzRbcN(x,y,R,10)),
 bottomT:"Causes fréquentes :",bottom:()=>lzIcon(46,190,"alcool",lzP("M-5 -9 h10 l-1 6 q-4 4 -4 10 v4 h-1 v-4 q0 -6 -4 -10 Z","#F6E7AE","#B98B14",1))+lzIcon(116,190,"dénutrition",lzC(0,0,9,"#FFF","#9AA3AB",1.2)+lzP("M-4 0 h8","none","#9AA3AB",1.4))+lzIcon(186,190,"grossesse,\nmédicaments",lzC(0,-2,9,"#F6D3BB","#D69C79",1)+lzC(0,-2,4,"#F2A79D","none")),
 lab:[[114,"Globules rouges\ngros (macrocytes)",1,70,80],[160,"Moins nombreux",0,150,110]],
 pill:"Acide folique avant et pendant la grossesse",
 cap:"Supplémentation en acide folique (prévient aussi les malformations du tube neural) ; alimentation riche en légumes verts ; rechercher une carence en B12 associée."});
lzBF("anemie-hemolytique",{t:"Les globules rouges sont détruits trop tôt",sub:"Anémie hémolytique : anticorps, valve, médicament ou maladie du globule les font éclater avant 120 jours",
 cells:b=>lzFill(b.x,b.y,b.w,b.h,12,6,(x,y,R)=>R()<.5?lzRbcN(x,y,R,6.6)+lzY(x+6,y-6):lzSphero(x,y))+lzDots(b.x,b.y,b.w,b.h,10,9,lzSchisto)+lzDots(b.x,b.y,b.w,b.h,14,3,(x,y)=>lzC(x,y,1.5,"#E8C34C","none")),
 bottomT:"Dans la rate, les globules abîmés sont détruits :",bottom:()=>lzSpleen(60,194,1.1)+lzDots(40,180,40,24,6,4,lzSchisto)+lzArr(96,194,140,194,{c:"#B98B14",w:1.8})+lzS(146,190,"bilirubine :\nictère, urines\nfoncées","start"),
 lab:[[114,"Anticorps sur\nles globules",1,116,82],[150,"Fragments et\nsphérocytes",0,150,110]],
 pill:"Anémie + ictère : penser à l'hémolyse",
 cap:"Bilan : haptoglobine effondrée, bilirubine libre et LDH élevées, réticulocytes augmentés, test de Coombs. Traiter la cause ; transfusion si mal tolérée ; acide folique."});
lzBF("aplasie",{t:"La moelle ne fabrique presque plus de cellules",sub:"Aplasie médullaire : globules rouges, blancs et plaquettes manquent tous en même temps",
 cells:b=>lzRbcN(50,70,null)+lzRbcN(150,108,null)+lzRbcN(184,66,null)+lzPlt(100,96),
 bottomT:"Dans la moelle :",bottom:()=>lzMarrow(14,166,198,56,"vide"),
 lab:[[114,"Peu de globules\nrouges, blancs,\nde plaquettes",1,110,90],[184,"Moelle vide,\nremplacée par\nde la graisse",1,150,194]],
 pill:"Fièvre = urgence ; isolement protecteur",
 cap:"Risque d'infections graves (neutropénie), de saignements (thrombopénie) et anémie. Transfusions, prévention des infections, greffe de moelle ou immunosuppresseurs ; souvent après chimiothérapie."});
lzBF("drepanocytose",{t:"Les globules rouges prennent une forme de faucille",sub:"Drépanocytose : une hémoglobine anormale (S) rigidifie les globules quand l'oxygène manque",
 cells:b=>lzFill(b.x,b.y,b.w,b.h,14,8,(x,y,R)=>R()<.65?lzSickle(x,y,R):lzRbcN(x,y,R)),
 bottomT:"Ils bouchent les petits vaisseaux :",bottom:()=>lzP("M14 186 C60 186 90 180 120 186 S180 192 212 188","none","#E9A79D",22)+lzP("M14 186 C60 186 90 180 120 186 S180 192 212 188","none",LC.plasma,16)
  +[[40,186],[54,184],[66,183],[78,182],[90,182],[100,183]].map(([a,b])=>lzSickle(a,b,lzRnd(a))).join("")+lzP("M118 178 v18","none",LC.acc,2.4)+lzS(124,214,"en aval : plus d'oxygène,\ndouleur, infarctus","start"),
 lab:[[114,"Globules en\nfaucille, rigides",1,100,84],[150,"Se cassent vite :\nanémie",0,150,110]],
 pill:"Crise : hydrater, réchauffer, calmer la douleur",
 cap:"Éviter froid, déshydratation, effort intense, altitude ; crises vaso-occlusives très douloureuses (antalgiques puissants), risque infectieux (rate), syndrome thoracique aigu. Hydroxyurée, transfusions."});
lzBF("thalassemie",{t:"L'hémoglobine est mal fabriquée",sub:"Thalassémie : une des chaînes de l'hémoglobine manque ; globules petits, pâles, en forme de cible",
 cells:b=>lzFill(b.x,b.y,b.w,b.h,18,9,(x,y,R)=>R()<.6?lzTargetC(x,y,R,5.6):lzRbcPale(x,y,R,4.8)),
 bottomT:"Hémoglobine : 4 chaînes, une sorte manque",bottom:()=>[[50,190,"#D9594C"],[74,190,"#D9594C"],[50,212,"#9C8CC9"],[74,212,"#FFF"]].map(([a,b,c])=>lzC(a,b,10,c,c==="#FFF"?LC.acc:"#7E1A14",1.2,c==="#FFF"?";stroke-dasharray:3 2":"")).join("")+lzS(96,196,"chaînes en déséquilibre :\nglobules fragiles,\nanémie dès l'enfance","start"),
 lab:[[114,"Globules petits,\nen cible",1,100,84],[154,"Fragiles :\nanémie",0,150,110]],
 pill:"Transfusions : surveiller la surcharge en fer",
 cap:"Formes mineures sans traitement ; formes majeures : transfusions régulières et chélation du fer, greffe possible. Ne pas confondre avec une carence en fer (ne pas donner de fer sans preuve)."});
lzBF("polyglobulie",{t:"Trop de globules rouges rendent le sang épais",sub:"Polyglobulie : la moelle s'emballe (maladie de Vaquez) ou répond à un manque d'oxygène (tabac, BPCO)",
 cells:b=>lzFill(b.x,b.y,b.w,b.h,40,3,(x,y,R)=>lzRbcN(x,y,R,6.6)),
 bottomT:"Dans la moelle :",bottom:()=>lzMarrow(14,166,198,56,"plein"),
 lab:[[114,"Trop de\nglobules rouges",1,110,90],[158,"Sang épais :\nthrombose",1,160,120],[198,"Moelle trop\nactive",0,150,194]],
 pill:"Saignées si besoin ; surveiller les signes de thrombose",
 cap:"Signes : visage rouge, maux de tête, vertiges, prurit à l'eau chaude. Saignées pour baisser l'hématocrite, aspirine, traitement de la cause (arrêt du tabac, oxygène)."});
/* ============ Leucémies, lymphomes, myélome ============ */
lzBF("leucemie-aigue",{t:"Des cellules jeunes envahissent la moelle et le sang",sub:"Leucémie aiguë : des blastes se multiplient sans mûrir et prennent la place des cellules normales",
 cells:b=>lzFill(b.x,b.y,b.w,b.h,14,4,(x,y)=>lzBlast(x,y,9.6))+lzRbcN(60,62,null)+lzRbcN(172,118,null),
 bottomT:"Dans la moelle :",bottom:()=>lzMarrow(14,166,198,56,"blastes"),
 lab:[[114,"Blastes : ne\nmûrissent pas",1,110,92],[160,"Manque de\nglobules rouges,\nplaquettes…",0,150,110],[204,"Moelle envahie",1,170,196]],
 pill:"Fièvre ou saignement : urgence",
 cap:"Chimiothérapie intensive en service spécialisé, cathéter central, isolement protecteur pendant l'aplasie, transfusions, surveillance de la fièvre, de la bouche, des saignements ; soutien psychologique."});
lzBF("leucemie-chronique",{t:"Trop de globules blancs matures s'accumulent",sub:"Leucémie chronique (lymphoïde ou myéloïde) : évolution lente, souvent découverte sur une prise de sang",
 cells:b=>lzFill(b.x,b.y,b.w,b.h,30,6,(x,y,R)=>R()<.7?lzLymph(x,y,6.6):lzRbcN(x,y,R)),
 bottomT:"La rate et les ganglions peuvent grossir :",bottom:()=>lzSpleen(60,194,1.2)+lzS(100,192,"rate augmentée,\nganglions,\nfatigue","start"),
 lab:[[114,"Beaucoup de\nglobules blancs",1,100,80],[158,"Mal efficaces :\ninfections",0,140,110]],
 pill:"Prévenir les infections (vaccins, hygiène)",
 cap:"Souvent simple surveillance au début ; traitements ciblés selon le type. Surveiller les infections, la fatigue, la taille de la rate et des ganglions."});
/* ganglion lymphatique en coupe */
const LZND="M30 96 C30 52 78 34 128 38 C180 42 210 72 204 108 C198 140 160 158 118 156 C100 155 98 132 84 134 C66 136 56 158 40 146 C28 136 30 118 30 96 Z";
const lzNode=(fill,where,id)=>lzP(LZND,"#F2E3EC","#A57A92",1.6)+`<defs><clipPath id="lzn-${id}"><path d="${LZND}"/></clipPath></defs><g clip-path="url(#lzn-${id})">`
 +[[66,66],[106,56],[150,62],[184,86],[58,110]].map(([a,b])=>lzC(a,b,15,"rgba(150,120,190,.18)","rgba(120,90,160,.35)",.8)).join("")+fill+"</g>"+lzP(LZND,"none","#A57A92",1.6)
 +lzP("M14 60 C24 66 30 72 34 80 M100 20 C104 28 104 34 104 40 M220 70 C212 76 208 82 204 90","none","#C9B8D6",3)+(where?lzWhere(where):"");
lzSK("hodgkin",{t:"Un ganglion grossit à cause de cellules anormales",sub:"Lymphome de Hodgkin : quelques grandes cellules de Reed-Sternberg entourées de nombreux lymphocytes",h:244,
 custom:()=>lzNode(lzDots(46,48,150,96,60,5,(x,y)=>lzC(x,y,2.6,"#6C7FC0","none"))+[[96,96],[150,110],[128,74]].map(([a,b])=>lzReed(a,b)).join("")+lzP("M60 130 C90 116 120 128 170 122","none","rgba(165,122,146,.55)",3),
  [[-5,10,4],[5,10,4],[0,30,5]],"hodgkin"),
 lab:[[114,"Ganglion gonflé,\nindolore",1,196,108],[150,"Cellule de\nReed-Sternberg",1,150,110],[190,"Fièvre, sueurs la\nnuit, perte de poids",0]],
 pill:"Bonnes chances de guérison avec le traitement",
 cap:"Adulte jeune le plus souvent ; ganglion du cou ou du médiastin ; chimiothérapie ± radiothérapie ; surveiller la fièvre, la peau en zone irradiée, la fertilité (préservation)."});
lzSK("lnh",{t:"Des lymphocytes anormaux remplissent le ganglion",sub:"Lymphome non hodgkinien : une famille de cancers des lymphocytes, ganglions, rate ou autres organes",h:244,
 custom:()=>lzNode(lzDots(42,46,160,104,70,7,(x,y)=>lzLymph(x,y,4.4)),[[-5,10,4],[5,10,4],[-16,30,4],[16,30,4],[-8,86,4],[8,86,4],[11,56,5]],"lnh"),
 lab:[[114,"Lymphocytes\nanormaux, tous\nidentiques",1,150,100],[170,"Ganglions,\nrate, autres\norganes",0,196,108]],
 pill:"Surveiller fièvre, infections, effets des traitements",
 cap:"Formes lentes ou agressives ; chimiothérapie et immunothérapie (anticorps), parfois greffe ; prévention du syndrome de lyse au début du traitement (hydratation, surveillance biologique)."});
lzSK("myelome",{t:"Des plasmocytes envahissent la moelle et trouent l'os",sub:"Myélome multiple : un clone de plasmocytes produit un même anticorps en excès et détruit l'os",h:250,
 custom:()=>lzMarrow(10,36,206,104,"plasmo",7)+[[60,36],[140,36],[100,134],[176,134]].map(([a,b])=>lzE(a,b+3,12,6,"var(--surface)","#C9B88E",1)).join("")
  +lzArtL(10,160,206,52,6,{rbc:0})+lzDots(20,172,186,28,16,4,(a,b)=>lzY(a,b,"#4F5E9E"))+[[40,186],[49,186],[58,186]].map(([a,b])=>lzRbc(a,b,4.4,0)).join(""),
 lab:[[24,"Os troué :\ndouleurs,\nfractures",1,140,39],[96,"Plasmocytes\nqui prolifèrent",1,120,90],[150,"Moelle envahie :\nanémie",0,90,70],[192,"Le même anticorps\nen excès (pic)",1,120,186]],
 norm:false,pill:"Douleurs osseuses, calcium, reins : surveiller",
 cap:"Signes « CRAB » : hypercalcémie, atteinte rénale, anémie, lésions osseuses. Hydratation, éviter les produits de contraste iodés, prudence lors des mobilisations (fractures), traitement de la douleur."});
lzSK("smd",{t:"La moelle fabrique des cellules mal formées",sub:"Syndrome myélodysplasique : les cellules sortent abîmées ou meurent avant de passer dans le sang",h:250,
 custom:()=>lzMarrow(10,36,206,104,"dys",9)+lzArtL(10,160,206,52,6,{rbc:0})+lzRbcN(50,186,null,5)+lzRbcPale(120,184,null,5)+lzRbcN(180,188,null,8),
 lab:[[30,"Moelle riche mais\ncellules anormales",1,110,90],[110,"Cellules jeunes\n(blastes)",0,60,80],[192,"Peu de cellules\ndans le sang",1,120,184]],
 norm:false,pill:"Peut évoluer vers une leucémie aiguë",
 cap:"Surtout après 70 ans ; anémie souvent dépendante des transfusions (surveiller la surcharge en fer) ; risque infectieux et hémorragique ; traitements selon le risque d'évolution."});
/* ============ Plaquettes, globules blancs, coagulation ============ */
lzBF("thrombopenie",{t:"Il manque des plaquettes pour boucher les brèches",sub:"Thrombopénie : moins de 150 000 plaquettes/mm³ ; sous 20 000, risque de saignement spontané",
 cells:b=>lzFill(b.x,b.y,b.w,b.h,20,4,(x,y,R)=>lzRbcN(x,y,R))+lzPlt(80,70)+lzPlt(170,110),wall:()=>lzBreach(100,124),
 bottomT:"Signes :",bottom:()=>lzS(14,200,"purpura, ecchymoses, saignement des gencives, du nez, des règles","start"),
 lab:[[114,"Très peu de\nplaquettes",1,80,70],[160,"Le sang sort\nplus facilement",1,112,156]],
 pill:"Pas d'injection intramusculaire, pas d'aspirine",
 cap:"Brosse à dents souple, rasoir électrique, éviter les chocs ; surveiller purpura, hématomes, sang dans les urines ou les selles ; transfusion de plaquettes si besoin."});
lzBF("thrombocytose",{t:"Trop de plaquettes favorisent les caillots",sub:"Thrombocytose : réactionnelle (inflammation, carence en fer, après splénectomie) ou maladie de la moelle",
 cells:b=>lzFill(b.x,b.y,b.w,b.h,16,4,(x,y,R)=>lzRbcN(x,y,R))+lzFill(b.x,b.y,b.w,b.h,40,8,(x,y,R)=>lzPlt(x,y,R))+lzDots(150,112,40,18,9,3,(x,y,R)=>lzPlt(x,y,R)),
 bottomT:"Dans la moelle :",bottom:()=>lzMarrow(14,166,198,56,"normal",11)+[[60,190],[120,184],[170,200]].map(([a,b])=>lzC(a,b,7,"#E4D6F0","#7A5FAE",.9)+lzC(a-2,b,2,"#7A5FAE","none")+lzC(a+2,b+1,2,"#7A5FAE","none")).join(""),
 lab:[[114,"Plaquettes en\nexcès",1,100,70],[150,"Elles s'agrègent :\nthrombose",1,170,118],[198,"Mégacaryocytes\ntrès actifs",0,120,184]],
 pill:"Surveiller les signes de phlébite ou d'AVC",
 cap:"Rechercher la cause ; antiagrégant ou traitement réduisant la production si maladie de la moelle ; hydratation, mobilisation, prévention des thromboses."});
lzBF("neutropenie",{t:"Il manque les globules blancs qui tuent les bactéries",sub:"Neutropénie : moins de 1 500 neutrophiles/mm³ ; sous 500, risque d'infection grave",
 cells:b=>lzFill(b.x,b.y,b.w,b.h,18,5,(x,y,R)=>lzRbcN(x,y,R))+lzNeut(70,92,7)+lzDots(110,60,90,64,16,7,lzBact),
 normIn:()=>lzNormBlood()+lzNeut(296,36,6.4)+lzNeut(262,72,6.4),
 bottomT:"Causes fréquentes :",bottom:()=>lzS(14,200,"chimiothérapie, certains médicaments, maladie de la moelle","start"),
 lab:[[114,"Un seul\nneutrophile",1,70,92],[156,"Les bactéries\nne sont plus\ncombattues",1,160,90]],
 pill:"Fièvre = urgence : appeler, hémocultures",
 cap:"Isolement protecteur, hygiène des mains renforcée, alimentation adaptée, surveillance de la température ; la fièvre peut être le seul signe d'infection. Antibiotiques en urgence si fièvre."});
lzBF("hemophilie",{t:"Le caillot ne se solidifie pas",sub:"Hémophilie A ou B : un facteur de coagulation (VIII ou IX) manque, le filet de fibrine ne se forme pas",
 cells:b=>lzFill(b.x,b.y,b.w,b.h,16,4,(x,y,R)=>lzRbcN(x,y,R))+lzDots(96,118,30,16,10,3,(x,y,R)=>lzPlt(x,y,R)),wall:()=>lzBreach(100,124),
 bottomT:"Dans les articulations :",bottom:()=>lzP("M170 186 C170 200 176 214 170 238 M208 186 C208 200 202 214 208 238","none","url(#rg-bone)",14)+lzE(189,212,15,11,"rgba(224,80,63,.55)","#9E2219",1)+lzS(16,204,"genoux, chevilles, coudes :\nhémarthrose douloureuse","start"),
 lab:[[114,"Les plaquettes\nbouchent mal",0,110,128],[150,"Pas de filet de\nfibrine : le sang\ncontinue de couler",1,112,158]],
 pill:"Pas d'injection IM, pas d'aspirine ni d'AINS",
 cap:"Injections du facteur manquant (préventives ou à la demande), glace et immobilisation lors d'un saignement articulaire, carte d'hémophile ; maladie génétique liée à l'X (garçons surtout)."});
lzBF("willebrand",{t:"Les plaquettes n'arrivent pas à s'accrocher",sub:"Maladie de Willebrand : le facteur qui colle les plaquettes à la paroi abîmée manque ou fonctionne mal",
 cells:b=>lzFill(b.x,b.y,b.w,b.h,16,4,(x,y,R)=>lzRbcN(x,y,R))+lzDots(60,90,120,30,12,5,(x,y,R)=>lzPlt(x,y,R)),wall:()=>lzBreach(100,124)+lzP("M104 136 l4 -10 M118 136 l-3 -12","none",LC.acc,1.4,";stroke-dasharray:2 2"),
 bottomT:"Signes :",bottom:()=>lzS(14,198,"saignements de nez, des gencives, règles abondantes,\nsaignement prolongé après une extraction dentaire","start"),
 lab:[[114,"Les plaquettes\nne collent pas",1,110,110],[156,"Saignement\nqui dure",1,112,158]],
 pill:"Pas d'aspirine ni d'AINS",
 cap:"Maladie hémorragique héréditaire la plus fréquente ; desmopressine ou concentrés de facteur avant un geste ; prévenir avant toute chirurgie ou soins dentaires."});
lzBF("pti",{t:"Les plaquettes sont détruites par des anticorps",sub:"Purpura thrombopénique immunologique : l'organisme fabrique des anticorps contre ses propres plaquettes",
 cells:b=>lzFill(b.x,b.y,b.w,b.h,18,4,(x,y,R)=>lzRbcN(x,y,R))+[[70,70],[150,104],[118,62]].map(([a,b])=>lzPlt(a,b)+lzY(a+4,b-4)+lzY(a-4,b+5)).join(""),
 bottomT:"La rate élimine les plaquettes marquées :",bottom:()=>lzSpleen(60,194,1.1)+lzDots(44,184,32,20,5,4,(x,y,R)=>lzPlt(x,y,R))+lzS(100,190,"purpura, saignement\ndu nez, des gencives","start"),
 lab:[[114,"Anticorps sur\nles plaquettes",1,118,62],[156,"Très peu de\nplaquettes",0,150,104]],
 pill:"Surveiller le purpura et tout saignement",
 cap:"Corticoïdes, immunoglobulines si saignement ou plaquettes très basses ; chez l'enfant souvent après une virose et guérit seul. Éviter AINS, aspirine, injections IM, sports de contact."});
lzBF("civd",{t:"Des caillots se forment partout et épuisent la coagulation",sub:"CIVD : sepsis, accouchement, cancer ou polytraumatisme activent la coagulation dans tous les petits vaisseaux",
 cells:b=>lzFill(b.x,b.y,b.w,b.h,14,4,(x,y,R)=>lzRbcN(x,y,R))+[[50,70],[120,96],[176,66]].map(([a,b])=>lzFib(a-14,b-10,a+14,b+8)+lzFib(a-12,b+10,a+12,b-8)+lzDots(a-8,b-6,16,12,4,a,(x,y,R)=>lzPlt(x,y,R))).join(""),
 wall:()=>lzBreach(140,160),
 bottomT:"Deux dangers en même temps :",bottom:()=>lzS(14,190,"caillots : organes privés de sang\n(reins, poumons, peau)","start")+lzS(14,216,"saignements : plaquettes et facteurs\nconsommés (points de ponction, gencives)","start"),
 lab:[[114,"Petits caillots\ndans les\nvaisseaux",1,120,96],[166,"Saignement\nen même temps",1,150,158]],
 pill:"Urgence : traiter la cause et surveiller",
 cap:"Plaquettes et fibrinogène bas, TP allongé, D-dimères élevés. Traitement de la cause, transfusions (plasma, plaquettes) selon prescription, surveillance des saignements et des organes."});
lzBF("syndrome-hemorragique",{t:"Le sang sort des vaisseaux et ne s'arrête pas",sub:"Syndrome hémorragique : manque de plaquettes, de facteurs de coagulation, ou vaisseaux fragiles",
 cells:b=>lzFill(b.x,b.y,b.w,b.h,18,5,(x,y,R)=>lzRbcN(x,y,R))+lzPlt(70,64),wall:()=>lzBreach(96,128),
 bottomT:"Signes à repérer :",bottom:()=>lzS(14,200,"purpura, hématomes, saignement de nez ou des gencives,\nsang dans les urines, les selles, les vomissements","start"),
 lab:[[114,"Plaquettes ou\nfacteurs\ninsuffisants",1,70,64],[166,"Brèche qui\nsaigne",1,112,156]],
 pill:"Évaluer : pouls, tension, coloration, hémoglobine",
 cap:"Rechercher la cause (anticoagulants, thrombopénie, hémophilie, insuffisance hépatique) ; compression, surveillance hémodynamique, bilan d'hémostase, transfusion si besoin."});
lzBF("syndrome-thrombotique",{t:"Un caillot bouche le vaisseau",sub:"Thrombose : stase du sang, paroi abîmée et sang trop coagulable (triade de Virchow)",
 cells:b=>lzFill(b.x,b.y,40,b.h,5,4,(x,y,R)=>lzRbcN(x,y,R))+lzP("M70 45 C56 62 62 84 68 96 C58 110 60 126 72 137 L150 137 C162 124 160 108 152 96 C162 82 160 60 148 45 Z",LC.clotL,LC.clot,1.2)+lzDots(76,52,72,80,26,6,(x,y,R)=>lzRbc(x,y,4.4,R()*180))
  +[[78,60,140,120],[82,110,146,64],[90,50,120,134],[130,52,96,132]].map(([a,b,c,d])=>lzFib(a,b,c,d)).join("")+lzDots(80,56,66,74,10,3,(x,y,R)=>lzPlt(x,y,R))+lzArr(20,92,52,92,{c:"#1E5A6D",w:1.8})+lzP("M160 70 h44 M160 92 h44 M160 114 h44","none","#1E5A6D",1,";stroke-dasharray:3 4"),
 bottomT:"Les 3 causes (triade de Virchow) :",bottom:()=>lzS(14,190,"stase : immobilité, plâtre, voyage","start")+lzS(14,204,"paroi abîmée : chirurgie, cathéter","start")+lzS(14,218,"sang trop coagulable : cancer, pilule, grossesse","start"),
 lab:[[114,"Caillot :\nfibrine, globules,\nplaquettes",1,112,92],[170,"Après le caillot,\nle sang ne passe\nplus",0,180,92]],
 pill:"Prévention : lever précoce, anticoagulant, bas",
 cap:"Phlébite, embolie pulmonaire, infarctus ou AVC selon le vaisseau. Anticoagulants (surveillance des saignements, des plaquettes), mobilisation précoce, contention."});
