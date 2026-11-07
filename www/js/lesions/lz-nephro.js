/* Carnet IFSI — schémas des lésions : néphrologie et urologie (25 pathologies). */
const lzMpR=(x,y)=>[lzN(-8+x*.62),lzN(18+y*.62)];
const lzRF=(id,o)=>lz(id,{t:o.t,sub:o.sub,h:o.h||262,ins:false,cap:o.cap,
 draw:()=>{const [px,py]=lzMpR(...o.pt);return lzOrg("rein",o.zones||[],-8,18,.62)+(o.over||"")+lzZoom(id,px,py,248,96,62,`<rect x="186" y="34" width="124" height="124" style="fill:${o.bg||"#FBF1EF"}"/>`+o.inner())
  +(o.zt?lzS(248,176,o.zt[0],"middle","st-acc")+lzS(248,187,o.zt[1]||"","middle","st-acc"):"")+(o.extra?o.extra():"")+(o.pill?lzPill(160,(o.h||262)-12,o.pill,LC.acc):"");}});
/* néphron : glomérule (pelote de capillaires dans sa capsule) et tubule ; o.leak (globules/protéines qui passent), o.red, o.scar, o.thick */
function lzNephron(o={}){const cx=222,cy=84;
 let s=lzC(cx,cy,30,"#FBE9E2","#C98C83",1.6)+lzP(`M${cx+26} ${cy+14} C${cx+50} ${cy+30} ${cx+40} ${cy+60} ${cx+70} ${cy+64} C${cx+92} ${cy+66} ${cx+86} ${cy+40} ${cx+90} ${cy+20}`,"none",o.scar?"#C9B9B3":"#E9B8A8",12)+lzP(`M${cx+26} ${cy+14} C${cx+50} ${cy+30} ${cx+40} ${cy+60} ${cx+70} ${cy+64} C${cx+92} ${cy+66} ${cx+86} ${cy+40} ${cx+90} ${cy+20}`,"none","#FFF4D8",6);
 const loops=[...Array(7)].map((_,i)=>{const a=i*Math.PI*2/7;return lzC(cx+Math.cos(a)*12,cy+Math.sin(a)*12,9,o.red?"#E9877A":"#E05A4C","#9E2219",o.thick?3.2:1.2);}).join("");
 s+=lzP(`M${cx-50} ${cy-26} L${cx-18} ${cy-8}`,"none",LC.bloodD,7)+lzP(`M${cx-50} ${cy-26} L${cx-18} ${cy-8}`,"none","#E05A4C",5)+(o.scar?lzC(cx,cy,22,"#D9CFCB","#A89A92",1.4):loops);
 if(o.leak)s+=lzDots(cx+38,cy+28,44,30,o.leak,6,(x,y,R)=>R()<.5?lzRbc(x,y,3):lzC(x,y,2.4,"#F2C94C","#B98B14",.6));
 if(o.prot)s+=lzDots(cx+34,cy+26,50,36,o.prot,8,(x,y)=>lzC(x,y,2.2,"#F2C94C","#B98B14",.6));
 return s+(o.ex||"");}
/* rein en coupe : cortex, pyramides, bassinet ; o.stone, o.dil (dilatation), o.cysts, o.tumor, o.pus, o.small */
function lzKidney(cx,cy,s=1,o={}){const k=o.small?.78:1;
 const out=`M${cx-34*k} ${cy-50*k} C${cx-70*k} ${cy-46*k} ${cx-72*k} ${cy+46*k} ${cx-30*k} ${cy+52*k} C${cx-6*k} ${cy+56*k} ${cx+8*k} ${cy+34*k} ${cx+4*k} ${cy+14*k} C${cx} ${cy+6*k} ${cx} ${cy-6*k} ${cx+4*k} ${cy-14*k} C${cx+8*k} ${cy-36*k} ${cx-6*k} ${cy-54*k} ${cx-34*k} ${cy-50*k} Z`;
 let d=lzP(out,o.small?"#B98A7E":"url(#rg-kidney)","rgba(80,30,25,.55)",1.2);
 const pyr=[[-42,-28],[-52,0],[-42,28],[-24,-40],[-24,40]].map(([dx,dy])=>lzP(`M${cx+dx*k} ${cy+dy*k} l${12*k} ${-6*k} l${4*k} ${10*k} Z`,"#9B3A30","none",0,";opacity:.6")).join("");
 const dil=o.dil||1;d+=pyr+lzP(`M${cx-22*k} ${cy-18*k*dil} C${cx-30*k} ${cy-4*k} ${cx-30*k} ${cy+6*k} ${cx-22*k} ${cy+18*k*dil} L${cx+2*k} ${cy+6*k} L${cx+2*k} ${cy-6*k} Z`,"#F7EFD0","#B9A870",1)
  +lzP(`M${cx+2*k} ${cy} C${cx+14*k} ${cy+6*k} ${cx+20*k} ${cy+26*k} ${cx+22*k} ${cy+70*k}`,"none","#B9A870",7*(o.uDil||1))+lzP(`M${cx+2*k} ${cy} C${cx+14*k} ${cy+6*k} ${cx+20*k} ${cy+26*k} ${cx+22*k} ${cy+70*k}`,"none","#F7EFD0",4.6*(o.uDil||1));
 if(o.cysts)d+=lzDots(cx-60*k,cy-44*k,56*k,88*k,o.cysts,5,(x,y,R)=>lzC(x,y,(4+R()*6)*k,"#DCEBF3","#8DB3C9",1));
 if(o.tumor)d+=lzC(cx-44*k,cy-26*k,14*k,"#8E6A8F","#5A3D5C",1.2);
 if(o.pus)d+=lzDots(cx-60*k,cy-40*k,50*k,80*k,8,4,(x,y)=>lzC(x,y,3,"#E8D27A","#A8902A",.6))+lzDots(cx-50*k,cy-30*k,50*k,60*k,10,6,lzBact);
 if(o.stone)d+=lzStone(o.stone[0],o.stone[1],o.stone[2]||6,lzRnd(4));
 return d;}
/* vessie (vue de face) : o.big (globe), o.red, o.tumor, o.prost (adénome), o.bact */
function lzBladder(cx,cy,o={}){const r=o.big?1.45:1;
 let d=lzP(`M${cx-40*r} ${cy-22*r} C${cx-44*r} ${cy-58*r} ${cx+44*r} ${cy-58*r} ${cx+40*r} ${cy-22*r} C${cx+38*r} ${cy+12} ${cx+14} ${cy+28} ${cx} ${cy+30} C${cx-14} ${cy+28} ${cx-38*r} ${cy+12} ${cx-40*r} ${cy-22*r} Z`,o.red?"#F0A89A":"#F5D8BE",o.red?LC.acc:"#C99A78",o.red?2.4:1.4)
  +lzP(`M${cx-34*r} ${cy-10*r} C${cx-30*r} ${cy-42*r} ${cx+30*r} ${cy-42*r} ${cx+34*r} ${cy-10*r} C${cx+30*r} ${cy+10} ${cx+10} ${cy+20} ${cx} ${cy+22} C${cx-10} ${cy+20} ${cx-30*r} ${cy+10} ${cx-34*r} ${cy-10*r} Z`,"#FBF2C8","none");
 d+=lzP(`M${cx} ${cy+30} L${cx} ${cy+70}`,"none","#C99A78",8)+lzP(`M${cx} ${cy+30} L${cx} ${cy+70}`,"none","#FBF2C8",4);
 if(o.prost)d+=lzE(cx,cy+38,o.prost*22,o.prost*14,"#D9A79D","#A56A60",1.4)+lzP(`M${cx} ${cy+28} L${cx} ${cy+52}`,"none","#FBF2C8",o.prost>1.2?1.2:3);
 if(o.tumor)d+=lzP(`M${cx+10} ${cy-30} C${cx+14} ${cy-44} ${cx+30} ${cy-44} ${cx+32} ${cy-30} Z`,"#8E6A8F","#5A3D5C",1);
 if(o.bact)d+=lzDots(cx-26,cy-30,52,44,12,5,lzBact)+lzDots(cx-4,cy+36,8,30,4,7,lzBact);
 return d;}
/* ============ Reins ============ */
lzRF("ira",{t:"Les reins s'arrêtent brutalement de filtrer",sub:"Insuffisance rénale aiguë : manque de sang (déshydratation, choc), toxique ou obstacle sur les voies urinaires",zones:["reins"],pt:[80,92],
 inner:()=>lzNephron({ex:lzDots(270,110,30,30,6,3,(x,y)=>lzP(`M${x} ${y} l6 6 M${x+6} ${y} l-6 6`,"none",LC.acc,1.6))}),zt:["Néphrons qui ne filtrent","plus : les déchets restent"],
 extra:()=>lzLL(196,"Urines rares, potassium\net créatinine qui montent",1),pill:"Hyperkaliémie : risque cardiaque",
 cap:"Surveiller la **diurèse**, le poids, la kaliémie, la créatinine ; corriger la cause (réhydratation, arrêt des médicaments toxiques, lever l'obstacle). Souvent réversible."});
lzRF("irc",{t:"Les reins perdent peu à peu leurs unités de filtration",sub:"Insuffisance rénale chronique : diabète et HTA détruisent les néphrons au fil des années",zones:["reins"],pt:[80,92],
 inner:()=>lzNephron({scar:1}),zt:["Néphrons détruits et","remplacés par du tissu cicatriciel"],
 extra:()=>lzLL(196,"Fatigue, anémie, HTA,\nœdèmes ; souvent silencieuse",0),pill:"Préserver les veines du bras (future fistule)",
 cap:"Protéger les reins : contrôle de la tension et du diabète, éviter les AINS et les produits néphrotoxiques, adapter les doses. Préparer si besoin la dialyse ou la greffe."});
LZ["mrc"]=Object.assign({},LZ["irc"],{t:"La maladie rénale chronique détruit lentement les néphrons",sub:"Elle évolue en stades, du rein abîmé à l'insuffisance rénale terminale"});
lzRF("irt",{t:"Les reins ne filtrent presque plus : il faut les remplacer",sub:"Insuffisance rénale terminale : moins de 15 % de fonction, la dialyse ou la greffe deviennent nécessaires",zones:["reins"],pt:[80,92],
 inner:()=>lzKidney(250,100,1,{small:1})+lzS(250,58,"rein petit, cicatriciel","middle"),zt:["Rein rétréci,","qui ne filtre plus"],
 extra:()=>lzLL(196,"Hémodialyse, dialyse\npéritonéale ou greffe",0),pill:"Fistule : pas de tension ni de prise de sang sur ce bras",
 cap:"Restriction hydrique et potassique selon la prescription, surveillance du poids entre deux séances, soins de la fistule (thrill), accompagnement au quotidien."});
lzRF("glomerulonephrite",{t:"Les filtres des reins sont enflammés",sub:"Les glomérules, abîmés par une réaction immunitaire, laissent passer du sang et des protéines",zones:["reins"],pt:[80,92],
 inner:()=>lzNephron({red:1,leak:12}),zt:["Glomérule enflammé :","sang et protéines dans l'urine"],
 extra:()=>lzLL(196,"Urines foncées (sang),\nœdèmes, HTA",0),
 cap:"Analyse d'urine (protéinurie, hématurie), surveillance de la tension, de la fonction rénale et du poids ; traitement selon la cause (corticoïdes, immunosuppresseurs)."});
lzRF("nephrotique",{t:"Le filtre du rein laisse fuir les protéines",sub:"Syndrome néphrotique : une grande quantité d'albumine passe dans les urines, l'eau sort des vaisseaux",zones:["reins"],pt:[80,92],
 inner:()=>lzNephron({prot:18}),zt:["L'albumine (jaune) traverse","le filtre et part dans l'urine"],
 extra:()=>lzLL(196,"Œdèmes importants,\nurines mousseuses",1),pill:"Risque de thrombose : prévention",
 cap:"Surveiller le **poids**, les œdèmes, la diurèse ; régime pauvre en sel ; risque d'infections et de phlébite."});
lzRF("nephropathie-diab",{t:"Le diabète abîme les filtres des reins",sub:"L'excès de sucre épaissit les petits vaisseaux du glomérule : protéines dans l'urine, puis insuffisance rénale",zones:["reins","vaisseaux"],pt:[80,92],
 inner:()=>lzNephron({thick:1,prot:8}),zt:["Capillaires épaissis,","fuite de protéines"],
 extra:()=>lzLL(196,"Dépistage : albumine dans\nles urines chaque année",0),
 cap:"Équilibre du diabète et de la tension (IEC, ARA II), arrêt du tabac, éviter les produits néphrotoxiques ; surveillance de la fonction rénale."});
lzRF("pna",{t:"L'infection remonte jusqu'au rein",sub:"Pyélonéphrite : des bactéries de la vessie remontent par l'uretère et infectent le rein",zones:["reins","ureteres"],pt:[80,92],
 inner:()=>lzKidney(256,98,1,{pus:1})+lzArr(280,160,270,120,{c:LC.acc,w:2}),zt:["Bactéries et pus","dans le rein"],
 extra:()=>lzLL(196,"Fièvre, frissons, douleur\nlombaire d'un côté",1),pill:"ECBU avant les antibiotiques",
 cap:"ECBU puis antibiotiques, hydratation, surveillance de la température et des signes de choc septique ; échographie pour éliminer un obstacle."});
LZ["iu-haute"]=Object.assign({},LZ["pna"],{t:"Infection urinaire haute : le rein est atteint",sub:"Les bactéries ont remonté jusqu'au rein : fièvre et douleur lombaire"});
lzRF("lithiase-renale",{t:"Des calculs se forment dans le rein",sub:"Les sels de l'urine cristallisent quand l'urine est trop concentrée",zones:["reins"],pt:[80,92],
 inner:()=>lzKidney(256,98,1,{stone:[238,98,7]})+lzStone(226,72,5,lzRnd(6)),zt:["Calculs dans les cavités","du rein"],
 extra:()=>lzLL(196,"Boire 2 litres par jour\npour prévenir",0),
 cap:"Souvent sans symptôme tant que le calcul reste dans le rein. Analyse du calcul pour adapter la prévention (boissons, alimentation)."});
lzRF("colique-nephretique",{t:"Un calcul bloque l'uretère : le rein se distend",sub:"L'urine ne s'écoule plus, la pression monte dans le rein : douleur très violente",zones:["ureteres","reins"],pt:[126,150],
 inner:()=>lzKidney(252,86,.95,{dil:1.5,uDil:1.4,stone:[272,140,6]}),zt:["Calcul coincé dans l'uretère,","rein dilaté au-dessus"],
 extra:()=>lzLL(196,"Douleur lombaire brutale\nqui irradie vers le bas,\nagitation",1),pill:"Fièvre + colique : urgence (drainage)",
 cap:"Antalgiques (anti-inflammatoires sur prescription), **filtrer les urines** pour récupérer le calcul. Fièvre ou rein unique : urgence urologique."});
lzRF("hydronephrose",{t:"Le rein se dilate parce que l'urine ne s'écoule plus",sub:"Un obstacle en aval (calcul, prostate, tumeur) fait refluer l'urine dans les cavités du rein",zones:["reins","ureteres"],pt:[80,92],
 inner:()=>lzKidney(256,98,1,{dil:2,uDil:1.6}),zt:["Cavités du rein dilatées","(pleines d'urine)"],
 extra:()=>lzLL(196,"Risque : infection,\nperte de fonction du rein",0),
 cap:"Traitement : lever l'obstacle (sonde JJ, néphrostomie, chirurgie). Surveiller la diurèse et la fièvre."});
lzRF("polykystose",{t:"Des kystes envahissent les deux reins",sub:"Maladie génétique : les kystes grossissent et détruisent peu à peu le tissu du rein",zones:["reins"],pt:[80,92],
 inner:()=>lzKidney(256,98,1.05,{cysts:16}),zt:["Kystes remplis de liquide"],
 extra:()=>lzLL(196,"HTA, douleurs, sang dans\nles urines, insuffisance\nrénale progressive",0),
 cap:"Contrôle de la tension, hydratation, surveillance de la fonction rénale ; dépistage familial. Évolution vers la dialyse à l'âge adulte fréquente."});
lzRF("cancer-rein",{t:"Une tumeur se développe dans le rein",sub:"Souvent découverte par hasard à l'échographie ; favorisée par le tabac, l'obésité, l'HTA",zones:["reins"],pt:[80,92],
 inner:()=>lzKidney(256,98,1,{tumor:1}),zt:["Tumeur dans le rein"],
 extra:()=>lzLL(196,"Sang dans les urines,\ndouleur du flanc",0),
 cap:"Traitement le plus souvent chirurgical (néphrectomie partielle ou totale). Surveillance de la fonction rénale après l'intervention."});
lzRF("anurie",{t:"Les reins ne produisent plus d'urine",sub:"Moins de 100 mL par 24 h : arrêt de la filtration ou obstacle complet à l'écoulement",zones:["reins","ureteres"],pt:[80,92],
 inner:()=>lzKidney(256,98,1,{})+lzP("M270 140 l12 12 M282 140 l-12 12","none",LC.acc,3),zt:["Plus d'urine produite","ou qui s'écoule"],
 extra:()=>lzLL(196,"Vérifier d'abord : globe\nvésical ? sonde bouchée ?",1),pill:"Urgence : potassium, œdème pulmonaire",
 cap:"Toujours éliminer une **rétention** (globe, sonde bouchée) avant de conclure à une anurie. Bilan sanguin urgent (kaliémie, créatinine)."});
lzRF("oligurie",{t:"Les reins produisent trop peu d'urine",sub:"Moins de 500 mL par 24 h (0,5 mL/kg/h) : signe d'alerte de souffrance rénale ou de manque de sang",zones:["reins"],pt:[80,92],
 inner:()=>lzKidney(256,98,1,{})+lzDots(272,138,8,20,3,4,(x,y)=>lzC(x,y,2.2,"#F2C94C","none")),zt:["Peu d'urine, concentrée"],
 extra:()=>lzLL(196,"Causes : déshydratation,\nhémorragie, choc, sepsis",0),
 cap:"Surveillance horaire de la diurèse si besoin, recherche de déshydratation, remplissage sur prescription ; alerter si la diurèse reste basse."});
/* ============ Vessie, prostate, urètre ============ */
lzRF("cystite",{t:"La vessie est infectée par des bactéries",sub:"Les bactéries remontent par l'urètre (plus court chez la femme) et enflamment la paroi de la vessie",zones:["vessie","uretre"],pt:[160,180],
 inner:()=>lzBladder(248,96,{red:1,bact:1})+lzArr(266,160,252,134,{c:LC.acc,w:1.8}),zt:["Paroi enflammée,","bactéries dans l'urine"],
 extra:()=>lzLL(196,"Brûlures, envies fréquentes,\nurines troubles",0),pill:"Fièvre ou douleur lombaire : pyélonéphrite",
 cap:"Bandelette urinaire, boire abondamment, uriner après les rapports, ne pas se retenir. Antibiotique selon le protocole."});
LZ["iu-basse"]=Object.assign({},LZ["cystite"],{t:"Infection urinaire basse : la vessie est atteinte",sub:"Pas de fièvre : l'infection reste dans la vessie et l'urètre"});
lzRF("cancer-vessie",{t:"Une tumeur se développe dans la paroi de la vessie",sub:"Le tabac est le premier facteur de risque : sang dans les urines souvent sans douleur",zones:["vessie"],pt:[160,180],
 inner:()=>lzBladder(248,96,{tumor:1}),zt:["Tumeur sur la paroi"],
 extra:()=>lzLL(196,"Sang dans les urines\nsans douleur",1),
 cap:"Toute hématurie doit être explorée. Traitements : résection endoscopique, instillations, cystectomie avec dérivation urinaire (stomie)."});
lzRF("rau",{t:"La vessie pleine ne se vide plus",sub:"Rétention aiguë d'urine : un obstacle (prostate) ou une vessie qui ne se contracte plus",zones:["vessie","prostate"],pt:[160,180],
 inner:()=>lzBladder(248,104,{big:1,prost:1.3}),zt:["Vessie distendue :","le globe vésical"],
 extra:()=>lzLL(196,"Douleur, envie pressante\nsans pouvoir uriner",1),pill:"Sondage sur prescription : vider lentement",
 cap:"Bladder scan, sondage évacuateur ; vider par paliers si le volume est important (risque d'hématurie a vacuo selon les protocoles). Rechercher la cause."});
lzRF("hbp",{t:"La prostate grossit et comprime l'urètre",sub:"Adénome de la prostate : avec l'âge, la glande grossit et gêne la sortie de l'urine",zones:["prostate","vessie"],pt:[174,212],
 inner:()=>lzBladder(248,84,{prost:1.5}),zt:["Prostate augmentée qui","rétrécit l'urètre"],
 extra:()=>lzLL(196,"Jet faible, envies la nuit,\nvidange incomplète",0),pill:"Risque de rétention aiguë",
 cap:"Traitements médicaux ou chirurgie (résection endoscopique). Surveiller la vidange (résidu post-mictionnel) et les infections."});
lzRF("prostatite",{t:"La prostate est infectée",sub:"Infection bactérienne de la prostate : fièvre et troubles urinaires chez l'homme",zones:["prostate"],pt:[174,212],
 inner:()=>lzBladder(248,84,{prost:1.15})+lzE(248,122,25,16,"none",LC.acc,2.4)+lzDots(230,112,36,20,10,5,lzBact),zt:["Prostate enflammée","et infectée"],
 extra:()=>lzLL(196,"Fièvre, brûlures,\ndouleur périnéale",1),
 cap:"ECBU, hémocultures si fièvre élevée, antibiotiques prolongés (souvent 2 à 3 semaines). Pas de massage prostatique."});
lzRF("incontinence",{t:"L'urine s'échappe sans pouvoir être retenue",sub:"Muscles du périnée affaiblis (effort) ou vessie trop active (urgence), parfois les deux",zones:["vessie","uretre"],pt:[160,180],
 inner:()=>lzBladder(248,88,{})+lzP("M226 136 Q248 146 270 136","none",LC.muscle,5,";opacity:.5;stroke-dasharray:4 3")+lzDots(246,160,6,10,3,5,(x,y)=>lzC(x,y,2.4,"#F2C94C","none")),zt:["Sphincter et périnée","qui retiennent mal"],
 extra:()=>lzLL(196,"À l'effort (toux, rire) ou\npar envies pressantes",0),
 cap:"Rééducation périnéale, mictions programmées, protections adaptées, soins de peau ; ne pas réduire les boissons. Respecter la dignité du patient."});
lzRF("vessie-neuro",{t:"Les nerfs ne commandent plus bien la vessie",sub:"Lésion de la moelle, SEP, diabète : la vessie se vide mal ou se contracte de façon incontrôlée",zones:["vessie"],pt:[160,180],
 inner:()=>lzBladder(248,96,{big:1})+lzP("M200 40 C220 60 226 70 230 78","none",LC.nerveD,4)+lzP("M200 40 C220 60 226 70 230 78","none",LC.nerve,2.6)+lzP("M212 52 l8 8 M220 52 l-8 8","none",LC.acc,2.4),zt:["Commande nerveuse","interrompue"],
 extra:()=>lzLL(196,"Rétention ou fuites,\ninfections fréquentes",0),
 cap:"Autosondages intermittents propres selon la prescription, surveillance des infections et de la fonction rénale."});
lzRF("hematurie",{t:"Du sang passe dans les urines",sub:"Il peut venir du rein, des uretères, de la vessie ou de la prostate : la cause est à rechercher",zones:["vessie","reins"],pt:[160,180],
 inner:()=>lzBladder(248,96,{})+lzRbcs(222,64,52,40,14,5,3.4),zt:["Globules rouges","dans l'urine"],
 extra:()=>lzLL(196,"Infection, calcul, tumeur,\nanticoagulant...",0),pill:"Caillots, rétention : alerter",
 cap:"Toujours explorer une hématurie. Surveiller la couleur des urines, la présence de caillots, la tolérance (pâleur, tension) ; lavage vésical sur prescription."});
