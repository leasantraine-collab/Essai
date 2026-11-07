/* Carnet IFSI — schémas des lésions : pneumologie (31 pathologies). */
/* point du schéma « poumons » réaliste, placé en (-10,22) à l'échelle .62 */
const lzMpP=(x,y)=>[lzN(-10+x*.62),lzN(22+y*.62)];
/* bronche en coupe : o.lum (taille de la lumière), o.mus (épaisseur du muscle), o.red (paroi inflammatoire), o.mucus, o.pus, o.tumor, o.wavy, o.thick */
function lzBr(cx,cy,R,o={}){const lum=(o.lum||.6)*R,R2=lzRnd(o.seed||5);
 const cart=[0,1,2,3].map(i=>{const a0=i*Math.PI/2+.35,a1=a0+1.05,r=R*.98;return lzP(`M${lzN(cx+Math.cos(a0)*r)} ${lzN(cy+Math.sin(a0)*r)} A${r} ${r} 0 0 1 ${lzN(cx+Math.cos(a1)*r)} ${lzN(cy+Math.sin(a1)*r)}`,"none",LC.cart,R*.16)+lzP(`M${lzN(cx+Math.cos(a0)*r)} ${lzN(cy+Math.sin(a0)*r)} A${r} ${r} 0 0 1 ${lzN(cx+Math.cos(a1)*r)} ${lzN(cy+Math.sin(a1)*r)}`,"none",LC.cartD,.8);}).join("");
 const wall=lzC(cx,cy,R*.92,o.red?"#E9877A":(o.thick?"#E3A99E":LC.mucosa),"rgba(120,45,40,.45)",.8);
 const mus=`<circle cx="${cx}" cy="${cy}" r="${lzN(R*.76)}" style="fill:none;stroke:${LC.muscle};stroke-width:${lzN((o.mus||.07)*R)};opacity:.9"/>`;
 let lumen;if(o.wavy){const n=8;let d="";for(let i=0;i<=n*2;i++){const a=i*Math.PI/n,r=i%2?lum*.62:lum;d+=(i?"L":"M")+lzN(cx+Math.cos(a)*r)+" "+lzN(cy+Math.sin(a)*r)+" ";}lumen=lzP(d+"Z",LC.air,"#D58A80",1);}
 else lumen=lzC(cx,cy,lum,LC.air,"#D58A80",1);
 const mucus=o.mucus?lzDots(cx-lum*.6,cy-lum*.5,lum*1.2,lum*1.1,o.mucus,o.seed||5,(x,y,R)=>lzE(x,y,lum*.22,lum*.16,o.pus?"#D9D27A":"#F3EBC8",o.pus?"#9A9330":"#C9BE8E",.7,R()*180)):"";
 const tumor=o.tumor?lzP(`M${lzN(cx-R*.9)} ${lzN(cy-R*.3)} C${lzN(cx-R*.2)} ${lzN(cy-R*.55)} ${lzN(cx+lum*.3)} ${lzN(cy-lum*.1)} ${lzN(cx-R*.05)} ${lzN(cy+R*.35)} C${lzN(cx-R*.4)} ${lzN(cy+R*.8)} ${lzN(cx-R*.95)} ${lzN(cy+R*.4)} Z`,"#8E6A8F","#5A3D5C",1):"";
 return cart+wall+mus+lumen+mucus+tumor;}
/* grappe d'alvéoles autour d'une bronchiole : mode commun ou liste par alvéole */
function lzAlvC(cx,cy,mode,o={}){const P=[[-20,-16],[20,-16],[-27,10],[0,22],[27,10],[0,-28]],r=o.r||14;
 const m=i=>Array.isArray(mode)?mode[i%mode.length]:mode;
 let s=lzP(`M${cx} ${cy+46} L${cx} ${cy+4}`,"none","#E7A39A",6)+lzP(`M${cx} ${cy+46} L${cx} ${cy+4}`,"none",LC.air,3.6);
 if(m(0)==="detruit")return s+lzP(`M${cx-34} ${cy-6} C${cx-40} ${cy-38} ${cx+2} ${cy-48} ${cx+16} ${cy-34} C${cx+44} ${cy-40} ${cx+48} ${cy+4} ${cx+30} ${cy+20} C${cx+18} ${cy+40} ${cx-24} ${cy+38} ${cx-34} ${cy-6} Z`,"#FBEDEA","#E7A39A",1)+lzP(`M${cx-10} ${cy-30} L${cx-6} ${cy-12} M${cx+20} ${cy-24} L${cx+12} ${cy-8}`,"none","#E7A39A",.8);
 P.forEach(([dx,dy],i)=>{const mm=m(i);if(mm==="aplati")s+=lzE(cx+dx,cy+dy,r,r*.35,"#E9B8B0","#C98C83",1.2);else s+=lzAlv(cx+dx,cy+dy,r,mm,(o.seed||3)+i)+(o.thick?lzC(cx+dx,cy+dy,r,"none","#B88A7A",o.thick):"");});
 return s;}
const lzVirus=(x,y,r=6,c="#8A63B8")=>`<g>${[...Array(10)].map((_,i)=>{const a=i*Math.PI/5;return lzP(`M${lzN(x+Math.cos(a)*r)} ${lzN(y+Math.sin(a)*r)} L${lzN(x+Math.cos(a)*(r+3.4))} ${lzN(y+Math.sin(a)*(r+3.4))}`,"none",c,1.2)+lzC(x+Math.cos(a)*(r+3.8),y+Math.sin(a)*(r+3.8),1.3,c,"none");}).join("")}${lzC(x,y,r,"#D9C8EE",c,1.2)}</g>`;
/* poumons réalistes + loupe à droite (zones surlignées, point sur l'organe en coordonnées du schéma réaliste) */
const lzPF=(id,o)=>lz(id,{t:o.t,sub:o.sub,h:o.h||262,ins:false,cap:o.cap,
 draw:()=>{const [px,py]=lzMpP(...o.pt);return lzOrg("poumons",o.zones||[],-10,22,.62)+(o.over||"")+lzZoom(id,px,py,248,96,62,(o.bg?`<rect x="186" y="34" width="124" height="124" style="fill:${o.bg}"/>`:"")+o.inner())
  +(o.zt?lzS(248,176,o.zt[0],"middle","st-acc")+lzS(248,187,o.zt[1]||"","middle","st-acc"):"")+(o.extra?o.extra():"")+(o.pill?lzPill(160,(o.h||262)-12,o.pill,LC.acc):"");}});
/* ============ Bronches ============ */
lzPF("asthme",{t:"Les bronches se resserrent, gonflent et s'encombrent",sub:"Le muscle de la bronche se contracte, la paroi enflamme et le mucus bouche la lumière",zones:["bronches"],pt:[188,96],bg:"#F6E3DE",
 inner:()=>lzBr(248,96,54,{lum:.42,mus:.16,red:1,wavy:1,mucus:4,seed:7}),zt:["Spasme, inflammation et mucus :","l'air passe mal (sifflements)"],
 extra:()=>lzBr(164,206,15,{seed:2})+lzS(164,234,"bronche\nnormale","middle")+lzLL(188,"Déclenché par : allergènes,\nvirus, effort, froid, tabac",0),pill:"Crise grave : parole difficile, urgence",
 cap:"Le traitement de fond calme l'**inflammation** (corticoïde inhalé) ; le traitement de crise **ouvre la bronche** (bronchodilatateur). Vérifier la technique d'inhalation."});
lzPF("bpco",{t:"Les bronches s'abîment et les alvéoles se détruisent",sub:"Le tabac enflamme les bronches (bronchite chronique) et détruit les alvéoles (emphysème) : l'air reste piégé",zones:["bronches","alveoles"],pt:[188,96],bg:"#F6E3DE",
 inner:()=>lzBr(222,86,30,{lum:.4,thick:1,mus:.12,mucus:3,seed:4})+lzAlvC(270,112,"detruit"),zt:["Bronche épaissie + alvéoles","détruites : l'air ne sort plus"],
 extra:()=>lzLL(196,"Cause principale :\nle tabac (90 %)",1)+lzLL(232,"Essoufflement, toux,\ncrachats le matin",0),pill:"Arrêt du tabac : le seul traitement qui freine",
 cap:"Maladie chronique et progressive. Surveiller les **exacerbations** (crachats plus abondants ou purulents, essoufflement accru) ; vaccinations grippe et pneumocoque, réhabilitation respiratoire."});
lzPF("emphyseme",{t:"Les cloisons entre les alvéoles se détruisent",sub:"Les petites alvéoles fusionnent en grandes poches : moins de surface d'échange, l'air reste piégé",zones:["alveoles"],pt:[268,176],bg:"#FBF1EF",
 inner:()=>lzAlvC(222,100,"air",{r:11})+lzAlvC(274,96,"detruit"),zt:["Alvéoles normales / alvéoles","détruites en grosses poches"],
 extra:()=>lzLL(206,"Thorax distendu,\nessoufflement, souvent\nfumeur",0),
 cap:"Les échanges d'oxygène diminuent ; le patient expire lèvres pincées pour mieux vider ses poumons. Oxygène sur prescription seulement : risque d'hypercapnie."});
lzPF("bronchite-aigue",{t:"La paroi des bronches s'enflamme",sub:"Le plus souvent un virus : la muqueuse gonfle et produit du mucus, d'où la toux",zones:["bronches","trachee"],pt:[188,96],bg:"#F6E3DE",
 inner:()=>lzBr(248,96,54,{lum:.52,red:1,mucus:3,seed:3})+lzVirus(226,70,5)+lzVirus(270,118,5),zt:["Muqueuse enflammée et mucus :","toux, parfois fièvre"],
 extra:()=>lzBr(164,206,15,{seed:2})+lzS(164,234,"bronche\nnormale","middle")+lzLL(186,"Guérit seule en\n2 à 3 semaines",0),
 cap:"Virale dans la grande majorité des cas : **pas d'antibiotique**. Hydratation, repos, antipyrétique si fièvre ; consulter si essoufflement ou fièvre prolongée."});
lzPF("bronchite-chronique",{t:"Les bronches produisent trop de mucus en permanence",sub:"Toux et crachats au moins 3 mois par an, 2 années de suite : la paroi s'épaissit",zones:["bronches"],pt:[188,96],bg:"#F6E3DE",
 inner:()=>lzBr(248,96,54,{lum:.44,thick:1,mus:.12,mucus:6,seed:9})+lzDots(204,58,90,10,5,3,(x,y)=>lzE(x,y,5,3,"#F3EBC8","#C9BE8E",.6)),zt:["Paroi épaissie, glandes à mucus","plus nombreuses"],
 extra:()=>lzBr(164,206,15,{seed:2})+lzS(164,234,"bronche\nnormale","middle")+lzLL(186,"Le plus souvent\nle tabac",1),
 cap:"Première étape de la BPCO. L'**arrêt du tabac** stoppe l'évolution ; kinésithérapie respiratoire pour drainer les crachats."});
lzPF("bronchiolite",{t:"Les petites bronches du nourrisson se bouchent",sub:"Un virus (souvent le VRS) enflamme les bronchioles : mucus et débris les obstruent",zones:["bronches"],pt:[188,96],bg:"#F6E3DE",
 inner:()=>lzBr(232,92,34,{lum:.34,red:1,mucus:4,seed:6})+lzVirus(270,62,5)+lzAlvC(274,128,["air","aplati","air","aplati"],{r:9}),zt:["Bronchiole bouchée :","l'air passe mal"],
 extra:()=>lzLL(196,"Nourrisson : toux,\nsifflements, difficultés\nà téter",0),pill:"Signes de lutte, refus de boire : consulter",
 cap:"Mouchage du nez au sérum physiologique, fractionnement des repas, couchage sur le dos. Surveiller la **fréquence respiratoire**, les signes de lutte et l'alimentation."});
lzPF("mucoviscidose",{t:"Un mucus trop épais bouche les bronches",sub:"Maladie génétique : le mucus, trop collant, encombre les bronches et favorise les infections",zones:["bronches"],pt:[188,96],bg:"#F6E3DE",
 inner:()=>lzBr(248,96,54,{lum:.55,red:1,seed:4})+lzC(248,96,26,"#D9D27A","#9A9330",1)+lzDots(232,80,30,30,7,8,lzBact),zt:["Mucus épais et collant :","infections à répétition"],
 extra:()=>lzLL(196,"Touche aussi le pancréas,\nl'intestin, la sueur (salée)",0),
 cap:"**Kinésithérapie respiratoire** quotidienne, aérosols, antibiotiques, enzymes pancréatiques et alimentation enrichie. Hygiène stricte pour éviter les germes (Pseudomonas)."});
lzPF("ddb",{t:"Les bronches se dilatent et ne se vident plus",sub:"Dilatation des bronches : leur paroi abîmée laisse stagner des sécrétions qui s'infectent",zones:["bronches"],pt:[188,96],bg:"#F6E3DE",
 inner:()=>lzBr(248,96,54,{lum:.8,mus:.04,seed:3})+lzP("M210 116 Q248 128 286 116 Q280 136 248 138 Q216 136 210 116 Z","#D9D27A","#9A9330",1)+lzDots(222,118,50,14,6,5,lzBact),zt:["Bronche dilatée,","pleine de sécrétions infectées"],
 extra:()=>lzBr(164,206,15,{seed:2})+lzS(164,234,"bronche\nnormale","middle")+lzLL(186,"Toux et crachats\nabondants chaque jour",0),
 cap:"Drainage bronchique quotidien (kinésithérapie, positions), traitement rapide des surinfections, vaccinations."});
/* ============ Alvéoles ============ */
lzPF("pneumonie-com",{t:"Les alvéoles d'un lobe se remplissent de pus",sub:"Une bactérie (souvent le pneumocoque) infecte le poumon : le lobe devient « plein »",zones:[],pt:[104,152],over:`<ellipse cx="54" cy="122" rx="20" ry="22" style="fill:#D9B45A;opacity:.55"/>`,bg:"#FBF1EF",
 inner:()=>lzAlvC(248,96,"pus"),zt:["Alvéoles pleines de pus :","l'oxygène ne passe plus"],
 extra:()=>lzLL(196,"Fièvre élevée, frissons,\ntoux, douleur thoracique",0)+lzLL(234,"Lobe atteint",1,46,128),
 cap:"Antibiothérapie rapide. Surveiller **température, FR, SpO₂, conscience** ; chez la personne âgée, la confusion peut être le premier signe."});
lzPF("pneumonie-noso",{t:"Une infection du poumon acquise à l'hôpital",sub:"Après 48 h d'hospitalisation, souvent chez le patient ventilé ou alité : germes plus résistants",zones:[],pt:[104,152],over:`<ellipse cx="50" cy="128" rx="20" ry="18" style="fill:#D9B45A;opacity:.5"/><ellipse cx="128" cy="124" rx="16" ry="14" style="fill:#D9B45A;opacity:.45"/>`,bg:"#FBF1EF",
 inner:()=>lzAlvC(248,96,["pus","pus","eau","pus","pus","eau"]),zt:["Alvéoles infectées par des","germes hospitaliers"],
 extra:()=>lzLL(196,"Facteurs : ventilation,\nalitement, fausses routes",0),
 cap:"Prévention : **position demi-assise**, hygiène bucco-dentaire, aspirations aseptiques, mobilisation précoce, hygiène des mains."});
lzPF("bronchopneumonie",{t:"Des foyers d'infection autour des bronches",sub:"L'infection part des bronches et touche des zones dispersées des deux poumons",zones:["bronches","alveoles"],pt:[188,96],over:lzDots(36,94,100,50,9,5,(x,y)=>lzC(x,y,5,"#D9B45A","none",0,";opacity:.6")),bg:"#FBF1EF",
 inner:()=>lzBr(218,80,22,{lum:.5,red:1,mucus:2,seed:3})+lzAlvC(268,112,["pus","air","pus","eau","air","pus"],{r:11}),zt:["Bronche enflammée et","alvéoles voisines infectées"],
 extra:()=>lzLL(196,"Souvent chez la personne\nâgée ou fragile",0),
 cap:"Plus fréquente chez le sujet âgé, alité ou après une fausse route. Kinésithérapie, antibiotiques, hydratation, surveillance de la respiration."});
lzPF("tuberculose-p",{t:"Le bacille de Koch creuse une caverne dans le poumon",sub:"Transmis par la toux, il forme un foyer qui se nécrose et se vide : la caverne",zones:[],pt:[104,152],over:`<ellipse cx="50" cy="70" rx="13" ry="11" style="fill:#F3EBC8;stroke:#B9A060;stroke-width:1.4"/>`,bg:"#FBF1EF",
 inner:()=>lzP("M214 96 C210 64 246 52 268 66 C292 80 290 120 262 132 C238 142 216 126 214 96 Z","#F3EBC8","#B9A060",1.6)+lzP("M226 98 C226 76 252 70 264 82 C276 96 268 118 250 120 C236 122 226 112 226 98 Z","#FFFBEF","#D9C792",1)
  +lzDots(226,70,60,60,16,9,(x,y,R)=>`<rect x="${lzN(x-3)}" y="${lzN(y-.9)}" width="6" height="1.8" rx=".9" transform="rotate(${Math.round(R()*180)} ${lzN(x)} ${lzN(y)})" style="fill:#C8372D"/>`),zt:["Caverne (lésion nécrosée)","pleine de bacilles"],
 over2:"",extra:()=>lzLL(196,"Toux > 3 semaines, sueurs\nnocturnes, amaigrissement",0)+lzLL(226,"Foyer au sommet\ndu poumon",1,44,70),pill:"Isolement « air » : masque FFP2",
 cap:"Traitement de **6 mois** minimum, à prendre sans interruption. Isolement respiratoire tant que le patient est contagieux ; dépistage de l'entourage."});
lzPF("cancer-bp",{t:"Une tumeur se développe dans la bronche ou le poumon",sub:"Des cellules anormales prolifèrent, rétrécissent la bronche et peuvent envahir les tissus voisins",zones:["bronches"],pt:[188,96],over:`<circle cx="112" cy="94" r="7" style="fill:#8E6A8F;stroke:#5A3D5C;stroke-width:1"/>`,bg:"#F6E3DE",
 inner:()=>lzBr(248,96,54,{lum:.55,tumor:1,seed:5}),zt:["Tumeur qui bourgeonne","dans la bronche"],
 extra:()=>lzLL(196,"Toux qui change, crachats\nsanglants, amaigrissement",0)+lzLL(236,"Facteur n° 1 : le tabac",1),
 cap:"Toute toux persistante ou crachat de sang chez un fumeur doit faire consulter. Accompagnement : douleur, essoufflement, nutrition, soutien psychologique."});
lzPF("fibrose-pulm",{t:"Le tissu du poumon se transforme en cicatrice",sub:"Les parois des alvéoles s'épaississent et se rigidifient : l'oxygène traverse mal",zones:["alveoles"],pt:[268,176],bg:"#FBF1EF",
 inner:()=>lzAlvC(248,96,"air",{thick:4.5,r:13})+lzDots(212,60,72,72,8,3,(x,y)=>lzP(`M${lzN(x)} ${lzN(y)} l6 3 l-2 5`,"none","#B88A7A",1.6)),zt:["Parois des alvéoles épaissies","par la fibrose (cicatrice)"],
 extra:()=>lzLL(196,"Essoufflement progressif,\ntoux sèche, crépitants",0),
 cap:"Évolution lente vers l'insuffisance respiratoire. Oxygénothérapie, réhabilitation, traitements antifibrosants ; éviter les infections (vaccins)."});
lzPF("sdra",{t:"Les alvéoles des deux poumons se remplissent de liquide",sub:"Une agression grave (infection, choc, inhalation) rend les capillaires perméables : œdème lésionnel",zones:["alveoles","vaisseaux"],pt:[268,176],over:lzDots(36,86,104,60,12,6,(x,y)=>lzC(x,y,5,LC.fluid,"none",0,";opacity:.55")),bg:"#FBF1EF",
 inner:()=>lzAlvC(248,96,["plein","eau","plein","plein","eau","plein"])+lzDots(212,60,72,72,6,4,(x,y)=>lzWbc(x,y,3.6)),zt:["Alvéoles inondées et","inflammation intense"],
 extra:()=>lzLL(196,"Hypoxie sévère malgré\nl'oxygène",1),pill:"Réanimation : ventilation protectrice, décubitus ventral",
 cap:"Le cœur n'est pas en cause (contrairement à l'OAP cardiogénique). Prise en charge en réanimation ; surveillance de la SpO₂ et des gaz du sang."});
lzPF("atelectasie",{t:"Une partie du poumon s'affaisse",sub:"La bronche est bouchée (mucus, corps étranger, tumeur) : l'air en aval est résorbé et les alvéoles s'aplatissent",zones:["alveoles","bronches"],pt:[188,96],over:`<ellipse cx="128" cy="132" rx="16" ry="12" style="fill:#B9A6A2;opacity:.6"/>`,bg:"#FBF1EF",
 inner:()=>lzP("M200 96 L240 96","none","#E7A39A",14)+lzP("M200 96 L240 96","none",LC.air,9)+lzE(232,96,7,5,"#F3EBC8","#C9BE8E",1)+lzAlvC(270,96,"aplati",{r:13}),zt:["Bronche bouchée : alvéoles","affaissées, sans air"],
 extra:()=>lzLL(196,"Fréquent après une chirurgie,\nchez le patient alité",0),
 cap:"Prévention post-opératoire : **lever précoce**, spirométrie incitative, kinésithérapie, analgésie suffisante pour pouvoir respirer profondément et tousser."});
lzPF("covid",{t:"Le virus infecte les cellules des voies respiratoires et des alvéoles",sub:"Dans les formes graves, l'inflammation remplit les alvéoles et gêne l'oxygénation",zones:["alveoles"],pt:[268,176],bg:"#FBF1EF",
 inner:()=>lzAlvC(248,104,["eau","air","eau","plein","air","eau"])+lzVirus(214,60,6)+lzVirus(282,58,6)+lzVirus(248,48,5),zt:["Virus et inflammation :","alvéoles qui se remplissent"],
 extra:()=>lzLL(196,"Fièvre, toux, fatigue, perte\nde l'odorat ; essoufflement\ndans les formes graves",0),
 cap:"Surveiller la **SpO₂** (hypoxémie parfois silencieuse) et la fréquence respiratoire. Précautions gouttelettes et contact ; vaccination des personnes à risque."});
lzPF("grippe",{t:"Le virus de la grippe infecte la muqueuse respiratoire",sub:"Il détruit les cellules qui tapissent la trachée et les bronches : fièvre brutale, courbatures, toux",zones:["trachee","bronches"],pt:[160,52],bg:"#F6E3DE",
 inner:()=>[...Array(7)].map((_,i)=>lzR(192+i*17,96,15,40,4,i===2||i===4?"#E9B3A9":"#F2A79D","#C9675E",.8)+(i===2||i===4?"":[0,1,2,3].map(k=>lzP(`M${196+i*17+k*3.5} 96 l0 -8`,"none","#C9675E",1)).join(""))).join("")+lzR(186,136,130,30,0,"#E9877A","none")
  +lzVirus(222,70,6)+lzVirus(262,62,6)+lzVirus(292,76,5),zt:["Virus qui détruisent les cellules","ciliées de la muqueuse"],
 extra:()=>lzLL(196,"Début brutal : fièvre,\ncourbatures, toux",0),pill:"Vaccin chaque automne",
 cap:"Transmission par gouttelettes : masque, hygiène des mains. Risque de complications chez la personne âgée, la femme enceinte, l'insuffisant cardiaque ou respiratoire."});
lzPF("coqueluche",{t:"Une bactérie paralyse les cils des voies respiratoires",sub:"La toxine abîme la muqueuse : quintes de toux épuisantes, avec reprise inspiratoire sifflante",zones:["trachee","bronches"],pt:[160,52],bg:"#F6E3DE",
 inner:()=>[...Array(7)].map((_,i)=>lzR(192+i*17,96,15,40,4,"#F2A79D","#C9675E",.8)+[0,1,2,3].map(k=>lzP(`M${196+i*17+k*3.5} 96 q2 -4 5 -4`,"none","#C9675E",1)).join("")).join("")+lzR(186,136,130,30,0,"#E9877A","none")
  +lzP("M190 86 Q248 72 310 86 L310 94 L190 94 Z","#F3EBC8","#C9BE8E",.8)+lzDots(196,74,110,14,12,4,lzBact),zt:["Bactéries et mucus : les cils","ne balaient plus"],
 extra:()=>lzLL(196,"Grave chez le nourrisson :\napnées, cyanose",1),pill:"Vaccination : protéger les nourrissons",
 cap:"Très contagieuse. Isolement respiratoire, antibiotique pour le malade et l'entourage proche ; rappels vaccinaux des adultes en contact avec des nourrissons."});
lzPF("laryngite",{t:"Le larynx gonfle sous les cordes vocales",sub:"Chez l'enfant, un virus fait enfler la muqueuse sous la glotte : le passage de l'air rétrécit",zones:["larynx","trachee"],pt:[160,20],bg:"#F6E3DE",
 inner:()=>lzC(248,96,54,"#F2A79D","#C9675E",1)+lzP("M248 52 C278 60 292 86 288 112 C276 132 220 132 208 112 C204 86 218 60 248 52 Z","#E9877A","none")+lzE(248,96,12,22,LC.air,"#C9675E",1)+lzP("M236 74 L248 96 L260 74","none","#FFF6F2",3),zt:["Muqueuse gonflée :","l'air passe par un orifice étroit"],
 extra:()=>lzLL(196,"Toux « aboyante », voix\nrauque, bruit inspiratoire",0),pill:"Tirage, agitation, salive qui coule : urgence",
 cap:"Souvent la nuit, chez l'enfant de 6 mois à 3 ans. Rester calme, air frais, corticoïde sur prescription. L'**épiglottite** (salive qui coule, enfant assis penché) est une urgence vitale."});
/* ============ Plèvre et thorax ============ */
function lzThorax(o={}){const ribs=[0,1,2,3,4].map(i=>lzP(`M${40} ${62+i*26} Q160 ${44+i*26} 280 ${62+i*26}`,"none","#E7DCC8",5)).join("");
 const L="M150 46 C110 44 70 70 64 120 C60 160 66 196 90 202 C116 206 140 196 150 180 Z",R="M170 46 C210 44 250 70 256 120 C260 160 254 196 230 202 C204 206 180 196 170 180 Z";
 const sideL=o.side==="g"?o.lung:"",sideR=o.side==="d"?o.lung:"";
 return lzP("M36 40 C26 100 26 170 44 214 L276 214 C294 170 294 100 284 40 C240 26 80 26 36 40 Z","#FBF5EE","#D8C9B4",1.4)+ribs
  +(o.space||"")+`<g>${o.side==="g"&&o.collapse?`<path d="${L}" transform="translate(150 120) scale(${o.collapse}) translate(-150 -120)" style="fill:url(#rg-lung);stroke:rgba(120,50,45,.45);stroke-width:1"/>`:`<path d="${L}" style="fill:url(#rg-lung);stroke:rgba(120,50,45,.45);stroke-width:1"/>`}
  <path d="${R}" style="fill:url(#rg-lung);stroke:rgba(120,50,45,.45);stroke-width:1"/></g>`+lzP("M160 14 L160 58 M160 58 L140 76 M160 58 L180 76","none","#C9B9B3",8)+lzP("M160 14 L160 58 M160 58 L140 76 M160 58 L180 76","none","#F2ECE8",5)
  +lzP("M44 214 Q100 186 160 206 Q220 186 276 214","none","#C9675A",4)+(o.ex||"");}
const lzPleura=(id,o)=>lz(id,{t:o.t,sub:o.sub,h:o.h||256,ins:false,cap:o.cap,draw:()=>lzThorax(o.th())+(o.labels||"")+(o.pill?lzPill(160,244,o.pill,LC.acc):"")});
lzPleura("pneumothorax",{t:"De l'air entre le poumon et la paroi : le poumon s'affaisse",sub:"Une brèche de la plèvre laisse entrer l'air dans la cavité pleurale",
 th:()=>({side:"g",collapse:.62,space:lzP("M150 46 C110 44 70 70 64 120 C60 160 66 196 90 202 C116 206 140 196 150 180 Z",LC.air,"#9CC3D8",1.4,";stroke-dasharray:4 3"),ex:lzS(84,92,"air","middle","st-blue")+lzS(76,160,"air","middle","st-blue")}),
 labels:lzLL(24,"Poumon affaissé",1,120,118)+lzLR(24,"Poumon sain",0,226,100),pill:"Douleur brutale + essoufflement : urgence",
 cap:"Le patient jeune et longiligne ou le fumeur sont plus exposés. Selon la taille : surveillance, exsufflation ou **drain thoracique** (surveiller bullage, oscillation, aspiration)."});
lzPleura("epanchement-pleural",{t:"Du liquide s'accumule entre le poumon et la paroi",sub:"Le liquide comprime le poumon par en bas : moins de place pour respirer",
 th:()=>({space:lzP("M62 140 Q100 150 150 136 L150 200 C120 210 70 210 60 196 Z",LC.fluid,LC.fluidD,1,";opacity:.85"),ex:lzP("M62 140 Q100 150 150 136","none",LC.fluidD,1.6)}),
 labels:lzS(104,186,"liquide","middle","st-blue")+lzLL(18,"Épanchement",1,80,150)+lzLR(18,"Causes : insuffisance cardiaque,\ninfection, cancer, embolie",0),pill:"Ponction pleurale : analyser le liquide",
 cap:"Matité à la percussion, diminution du murmure vésiculaire. La **ponction pleurale** soulage et permet d'analyser le liquide (transsudat ou exsudat)."});
lzPleura("pleuresie",{t:"La plèvre s'enflamme et du liquide se forme",sub:"Souvent infectieuse : douleur à l'inspiration profonde, parfois fièvre",
 th:()=>({space:lzP("M62 150 Q100 160 150 146 L150 200 C120 210 70 210 60 196 Z","#EEE3A8","#B9A060",1,";opacity:.9"),ex:lzP("M150 46 C110 44 70 70 64 120 C60 160 66 196 90 202","none",LC.acc,3)}),
 labels:lzLL(18,"Plèvre enflammée",1,70,90)+lzS(104,190,"liquide","middle","st-amber"),pill:"Douleur thoracique qui augmente à l'inspiration",
 cap:"Ponction pour identifier la cause, antibiotiques si infection ; un empyème (pus) nécessite un **drainage**."});
lzPleura("hemothorax",{t:"Du sang s'accumule autour du poumon",sub:"Après un traumatisme du thorax ou une plaie d'un vaisseau : risque d'hémorragie grave",
 th:()=>({space:lzP("M62 136 Q100 146 150 132 L150 200 C120 210 70 210 60 196 Z","#B5372D","#7A1F1A",1,";opacity:.9"),ex:lzP("M52 70 L82 96","none","#5A4A3A",2.4,";stroke-dasharray:3 2")}),
 labels:`<text x="104" y="184" text-anchor="middle" style="fill:#fff;font-size:10px;font-weight:700">sang</text>`+lzLL(18,"Côte cassée",0,70,84),pill:"Choc hémorragique possible : urgence",
 cap:"Surveiller **TA, FC, SpO₂, douleur** et la quantité de sang recueillie par le drain thoracique ; au-delà d'un certain débit, une chirurgie est discutée."});
/* ============ Insuffisances et circulation pulmonaire ============ */
lzPF("ira-resp",{t:"Les poumons n'apportent plus assez d'oxygène au sang",sub:"Insuffisance respiratoire aiguë : l'oxygène manque, le gaz carbonique peut s'accumuler",zones:["alveoles","diaphragme"],pt:[268,176],bg:"#FBF1EF",
 inner:()=>lzAlv(248,92,42,"eau",8)+lzArr(222,62,236,78,{c:LC.o2,w:1.6,hl:5,op:.5})+lzArr(274,108,290,126,{c:LC.co2,w:2.4,hl:6})+lzS(212,58,"O₂","middle","st-acc")+lzS(270,138,"CO₂","middle","st-blue"),zt:["Moins d'O₂ dans le sang,","CO₂ qui s'accumule"],
 extra:()=>lzLL(196,"Signes : FR > 25, tirage,\nsueurs, cyanose, confusion",1),pill:"SpO₂ < 90 % : urgence",
 cap:"Installer **demi-assis**, oxygène selon la prescription, surveillance rapprochée (SpO₂, FR, conscience, gaz du sang). Rechercher la cause : pneumonie, OAP, asthme, BPCO…"});
lzPF("irc-resp",{t:"Les poumons abîmés oxygènent mal le sang, en permanence",sub:"Insuffisance respiratoire chronique : souvent l'aboutissement d'une BPCO",zones:["bronches","alveoles"],pt:[268,176],bg:"#FBF1EF",
 inner:()=>lzAlvC(248,100,"detruit")+lzArr(214,58,230,72,{c:LC.o2,w:1.4,hl:5,op:.5})+lzS(206,54,"O₂","middle","st-acc"),zt:["Surface d'échange réduite :","oxygène insuffisant"],
 extra:()=>lzLL(196,"Oxygène à domicile plus\nde 15 heures par jour",0),pill:"Pas de flamme près de l'oxygène",
 cap:"Oxygénothérapie de longue durée, ventilation non invasive parfois. Éducation : débit prescrit à respecter, pas de tabac ni de flamme, signes d'aggravation."});
lz("htap",{t:"La pression monte dans les artères des poumons",sub:"Les petites artères pulmonaires s'épaississent : le ventricule droit force pour y pousser le sang",h:246,ins:false,
 draw:()=>lzHeart(84,128,.7,{vd:.62})+lzArtX(236,82,46,20,{adv:"#E6E0F0",med:"#7486C9",plasma:"#E6EAF7",rbc:3,seed:4})+lzArtX(272,192,20,4,{adv:"#E6E0F0",med:"#7486C9",plasma:"#E6EAF7",rbc:3,seed:2})
  +lzS(236,142,"Artère pulmonaire épaissie,","middle","st-acc")+lzS(236,153,"lumière rétrécie","middle","st-acc")+lzS(272,224,"artère normale","middle")
  +lzLL(232,"Ventricule droit épaissi,\npuis qui s'épuise",1,62,150),
 cap:"Essoufflement d'effort, fatigue, malaises. Évolue vers l'**insuffisance cardiaque droite** (œdèmes, veines du cou gonflées). Traitements vasodilatateurs spécifiques."});
lzPF("sarcoidose",{t:"De petits amas de cellules inflammatoires se forment",sub:"Des granulomes apparaissent dans les poumons et les ganglions du médiastin, parfois ailleurs",zones:["vaisseaux"],pt:[136,114],over:lzDots(40,80,96,60,14,7,(x,y)=>lzC(x,y,2.6,"#C9A45A","#8A6A2A",.6))+lzC(80,86,6,"#B9A6CF","#6A5A8A",1)+lzC(98,90,6,"#B9A6CF","#6A5A8A",1),bg:"#FBF1EF",
 inner:()=>lzAlvC(248,100,"air",{r:12})+[[226,76],[270,86],[246,124]].map(([x,y])=>lzC(x,y,11,"#E7D3A0","#A88A40",1)+lzDots(x-7,y-7,14,14,4,x,(a,b)=>lzWbc(a,b,2.6))).join(""),zt:["Granulomes entre","les alvéoles"],
 extra:()=>lzLL(196,"Gros ganglions près des\nbronches, toux, fatigue",0),
 cap:"Évolution souvent favorable spontanément ; corticoïdes si atteinte importante. Surveiller aussi les yeux, la peau, le cœur et le calcium."});
/* ============ Sommeil et commande respiratoire ============ */
lz("saos",{t:"La gorge se ferme pendant le sommeil",sub:"Les muscles se relâchent, la langue et le voile du palais reculent : l'air ne passe plus",h:250,ins:false,
 draw:()=>lzOrg("orl",["amygdales","bouche"],-10,8,.8)+lzP("M98 106 C112 96 126 102 128 118 C128 130 116 136 104 132","#E39083","#B4574B",1.2)+lzP("M120 110 L132 118","none",LC.acc,3)
  +lzArr(150,110,128,118,{c:LC.acc,w:2.2})+lzLR(70,"Langue et voile\ndu palais qui\nobstruent la gorge",1,132,116)
  +lzLR(150,"Pauses respiratoires,\nronflements, micro-\néveils toute la nuit",0)+lzPill(160,236,"Somnolence le jour : risque d'accident",LC.acc),
 cap:"Facteurs : surpoids, alcool, somnifères, âge. Traitement : **pression positive continue** (PPC) la nuit, perte de poids, orthèse d'avancée mandibulaire."});
lz("apnees-centrales",{t:"Le cerveau oublie de commander la respiration",sub:"Le centre respiratoire du tronc cérébral n'envoie plus le signal : le diaphragme ne se contracte pas",h:246,ins:false,
 draw:()=>lzOrg("cerveau",["tronc"],-6,4,.5)+lzLungs(214,150,.62)+lzP("M168 214 Q214 194 260 214","none","#C9675A",4)
  +lzP("M96 96 C130 120 160 170 196 196","none",LC.elec,2.4,";stroke-dasharray:6 5")+lzP("M138 136 L152 150 M152 136 L138 150","none",LC.acc,3.2)
  +lzLL(150,"Tronc cérébral :\nle signal s'arrête",1,90,92)+lzLR(32,"Pas de mouvement\nrespiratoire",1,214,96)+lzLL(232,"Causes : insuffisance cardiaque,\nAVC, morphiniques, altitude",0),
 cap:"À la différence de l'apnée obstructive, il n'y a pas d'effort respiratoire. Traitement de la cause, ventilation adaptée ; prudence avec les sédatifs."});
/* même schéma que l'OAP cardiogénique */
LZ["oedeme-pulm"]=Object.assign({},LZ.oap);
