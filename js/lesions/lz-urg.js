/* Carnet IFSI — schémas des lésions : urgences, réanimation et chirurgie (30 pathologies). */
const lzMpD=(x,y)=>lzMpF(x,y);
const lzDF=(id,o)=>lzZF(id,Object.assign({left:()=>lzOrg("digestif",o.zones||[],-8,18,.62),pt:lzMpD(...(o.dpt||[160,168])),bg:"#FFF6E8"},o));
/* ============ États de choc et hémorragies ============ */
lzIF("choc-hypovolemique",{t:"Il n'y a plus assez de sang dans les vaisseaux",sub:"Choc hypovolémique : hémorragie, déshydratation, brûlures ; le cœur pompe vite mais à vide",zones:["sang","coeur"],
 inner:()=>lzArtL(186,74,124,34,6,{rbc:3,seed:4})+lzP("M186 62 C220 70 270 70 310 62 M186 120 C220 112 270 112 310 120","none","#9AA3AB",1,";stroke-dasharray:3 3")+lzArr(200,91,236,91,{c:"#1E5A6D",w:2})+lzS(248,134,"presque vide","middle"),
 zt:["Volume sanguin effondré :","organes sans oxygène"],
 extra:()=>lzLL(200,"Pouls rapide et filant, TA basse,\npâleur, marbrures, soif",1)+lzLL(232,"Oligurie, confusion,\ntemps de recoloration > 3 s",0),pill:"Allonger, jambes surélevées, 2 voies veineuses, 15",
 cap:"Arrêter le saignement, remplissage (cristalloïdes), transfusion, oxygène, réchauffer ; surveiller pouls, tension, diurèse, conscience, lactates ; l'indice de choc (FC/PAS) > 1 alerte."});
lzIF("hemorragie-massive",{t:"Le sang s'échappe plus vite que le corps ne compense",sub:"Hémorragie massive : plaie vasculaire, traumatisme, rupture d'organe ; risque de choc et de troubles de coagulation",zones:["sang"],cpt:[130,172],
 inner:()=>lzArtL(186,70,124,44,7,{rbc:8,seed:6})+lzR(236,108,24,10,0,"#FBF1EF","none")+lzDots(226,118,44,40,16,5,(x,y,R)=>lzRbc(x,y,4.4,R()*180))+lzArr(248,112,248,150,{c:LC.blood,w:2.4}),
 zt:["Brèche dans un vaisseau :","le sang jaillit"],
 extra:()=>lzLL(200,"Compression directe, garrot\nsi membre et échec",1)+lzLL(232,"Triade létale : hypothermie,\nacidose, coagulopathie",0),pill:"Comprimer fort et sans relâcher",
 cap:"Compression manuelle ou pansement compressif, garrot noté avec l'heure, alerte (15), voies veineuses, transfusion massive selon protocole, réchauffement, acide tranexamique sur prescription."});
lzIF("anaphylaxie",{t:"Une allergie emballe tout l'organisme",sub:"Anaphylaxie : les mastocytes libèrent massivement histamine et médiateurs ; vaisseaux dilatés, bronches serrées",zones:["peau","poumons"],
 inner:()=>lzArtL(186,40,124,50,6,{rbc:4,seed:3})+lzArr(220,92,220,106,{c:LC.fluidD,w:1.4})+lzArr(270,92,270,106,{c:LC.fluidD,w:1.4})+lzE(222,128,13,10,"#F3D9E9","#9C5C86",1)+lzDots(210,118,30,22,14,6,(x,y)=>lzC(x,y,1.1,"#B5578C","none"))
  +lzC(278,128,18,"#F2B7A4","#C27A68",3)+lzC(278,128,5,"#EEF7FC","#C27A68",1),
 zt:["Histamine : vaisseaux qui fuient,","bronche rétrécie"],
 extra:()=>lzLL(200,"Urticaire, gonflement, sifflement,\nmalaise, chute de tension",1)+lzLL(232,"Aliment, médicament, piqûre,\nlatex",0),pill:"Adrénaline IM à la cuisse sans attendre",
 cap:"Arrêter l'exposition, adrénaline intramusculaire (face externe de la cuisse), appel du 15, position adaptée (allongé jambes surélevées, assis si gêne respiratoire), oxygène, remplissage ; surveillance 6 à 24 h (réaction biphasique)."});
lzZF("choc-obstructif",{t:"Un obstacle empêche le cœur de se remplir ou de se vider",sub:"Choc obstructif : tamponnade (liquide autour du cœur), embolie pulmonaire massive, pneumothorax compressif",pt:[156,150],bg:"#FBF1EF",
 left:()=>lzOrg("coeur",["pericarde"],-8,14,.62),
 inner:()=>lzC(248,100,58,"#9CCDEB","#3D8CC0",1.4)+lzHeart(248,104,.52,{vx:false})+lzC(248,100,58,"none","#C9B8A6",3)+[[200,62],[296,62],[200,140],[296,140]].map(([a,b])=>lzArr(a,b,a+(a<248?12:-12),b+(b<100?12:-12),{c:"#3D8CC0",w:1.8})).join(""),
 zt:["Liquide dans le péricarde :","le cœur est comprimé"],
 extra:()=>lzLL(200,"Turgescence des jugulaires,\nTA basse, bruits du cœur assourdis",1)+lzLL(232,"Traiter l'obstacle : ponction,\nthrombolyse, exsufflation",0),pill:"Urgence : lever l'obstacle",
 cap:"Tamponnade : ponction péricardique ; embolie massive : thrombolyse ; pneumothorax compressif : exsufflation puis drain ; oxygène, surveillance scopée."});
/* ============ Traumatismes ============ */
lzSilFig("polytraumatisme",{t:"Plusieurs lésions graves en même temps",sub:"Polytraumatisme : au moins une lésion menace la vie (accident de la route, chute de hauteur)",
 shade:"",extra:[[84,40,7],[84,96,10],[84,132,10],[70,170,7],[100,200,7]].map(([a,b,r])=>lzC(a,b,r,"rgba(200,55,45,.4)","#C8372D",1.4)).join("")+lzR(80,48,8,108,3,"rgba(242,201,76,.35)","#B98B14",1,";stroke-dasharray:3 2"),
 labels:lzLR(40,"Tête : conscience,\npupilles (Glasgow)",1,92,40)+lzLR(84,"Thorax : respiration,\nhémothorax",1,94,96)+lzLR(128,"Abdomen, bassin :\nhémorragie cachée",1,94,132)+lzLR(172,"Rachis : immobiliser\ntant que non exclu",0,88,150)+lzLR(208,"Fractures des\nmembres",0,104,200),
 pill:"ABCDE, rachis immobilisé, lutter contre le froid",
 cap:"Bilan ABCDE, contrôle des hémorragies, immobilisation en axe (collier, matelas coquille), oxygène, voies veineuses, réchauffement ; surveillance répétée (conscience, constantes, douleur)."});
lzZF("trauma-thoracique",{t:"Le choc casse les côtes et touche le poumon",sub:"Traumatisme thoracique : fractures de côtes, volet costal, pneumothorax, hémothorax, contusion pulmonaire",pt:[78,112],bg:"#FBEAE6",
 left:()=>lzOrg("poumons",["plevre","poumons"],-10,22,.62),
 inner:()=>lzR(186,34,124,124,0,"#FBEAE6","none")+[56,84,112,140].map(y=>lzP(`M186 ${y} C230 ${y-6} 270 ${y-6} 310 ${y}`,"none","url(#rg-bone)",9)).join("")+lzP("M240 78 l6 6 l-4 4 l6 4","none","#5E3B2A",2)
  +lzP("M206 120 C230 112 270 112 300 124 L300 158 L206 158 Z",LC.blood,"#8E241C",1,";opacity:.7")+lzP("M200 40 C220 60 222 90 214 112","none","#EEF7FC",14),
 zt:["Côte fracturée, air et sang","dans la plèvre"],
 extra:()=>lzLL(200,"Douleur, respiration difficile,\nasymétrie du thorax",1)+lzLL(232,"SpO2, FR, auscultation,\nemphysème sous la peau",0),pill:"Position demi-assise, oxygène, analgésie",
 cap:"Oxygène, analgésie efficace (pour pouvoir respirer et tousser), radio ou scanner, drain thoracique si épanchement ; surveiller la détresse respiratoire et le choc."});
lzDF("trauma-abdominal",{t:"Un organe plein se rompt et saigne dans le ventre",sub:"Traumatisme abdominal : rate et foie saignent ; l'intestin peut se perforer ; l'hémorragie peut être cachée",zones:["foie","peritoine"],dpt:[108,80],
 inner:()=>lzR(186,34,124,124,0,"#FFF6E8","none")+lzP("M200 50 C240 36 296 46 300 88 C302 120 270 132 236 124 C206 116 196 84 200 50 Z","url(#rg-liver)","#5A1F17",1.2)+lzP("M248 52 l-6 18 l10 10 l-8 22","none","#2A0E0B",2.2)+lzDots(200,120,104,34,22,5,(x,y,R)=>lzRbc(x,y,3.6,R()*180)),
 zt:["Foie (ou rate) déchiré,","sang dans le ventre"],
 extra:()=>lzLL(200,"Douleur, ventre dur, épaule\ngauche douloureuse (rate)",1)+lzLL(232,"Pouls qui accélère : alerte",0),pill:"À jeun ; surveiller pouls, TA, douleur",
 cap:"Bilan (échographie FAST, scanner), surveillance hémodynamique rapprochée, à jeun, voie veineuse ; chirurgie ou embolisation si le saignement continue."});
/* ============ Intoxications, environnement ============ */
lzZF("intox-medicamenteuse",{t:"Un médicament en excès déprime le cerveau",sub:"Intoxication médicamenteuse : benzodiazépines, opioïdes, paracétamol, antidépresseurs… souvent volontaire",pt:[180,176],bg:"#F5EEF6",
 left:()=>lzOrg("cerveau",["tronc"],-6,20,.6),
 inner:()=>lzR(186,34,124,124,0,"#F5EEF6","none")+lzNeuron(216,70,1.1,{fade:1})+lzNeuron(262,118,1.1,{fade:1})+lzDots(196,44,108,104,26,5,(x,y)=>lzR(x-3,y-1.6,6,3.2,1.6,"#F2C94C","#B98B14",.5)),
 zt:["Molécules en excès :","neurones ralentis"],
 extra:()=>lzLL(200,"Somnolence, coma, respiration\nlente, pupilles selon le produit",1)+lzLL(232,"Rechercher l'heure, la dose,\nles emballages",0),pill:"Surveiller conscience et respiration",
 cap:"Bilan (Glasgow, FR, SpO2, glycémie, ECG), PLS si inconscient, antidotes (naloxone, flumazénil, N-acétylcystéine), centre antipoison ; évaluation psychiatrique systématique si geste volontaire."});
lzBF("intox-co",{t:"Le monoxyde de carbone prend la place de l'oxygène",sub:"Intoxication au CO : gaz invisible et inodore (chauffage, braséro) ; il se fixe 200 fois plus fort que l'oxygène sur l'hémoglobine",
 cells:b=>lzFill(b.x,b.y,b.w,b.h,16,5,(x,y,R)=>lzRbc(x,y,6.8,R()*180)+lzC(x,y,1.8,R()<.7?"#2E3640":"#E8574A","none")),
 normIn:()=>lzFill(250,22,66,60,7,3,(x,y,R)=>lzRbcN(x,y,R,6)+lzC(x,y,1.6,"#E8574A","none")),
 bottomT:"Signes :",bottom:()=>lzS(14,190,"maux de tête, vertiges, nausées, plusieurs personnes du foyer ;\npuis confusion, coma ; SpO2 faussement normale","start"),
 lab:[[114,"CO (noir) fixé\nsur l'hémoglobine",1,110,80],[160,"Les organes\nmanquent d'O2",0]],
 pill:"Aérer, évacuer, oxygène à fort débit",
 cap:"Soustraire de l'atmosphère, oxygène au masque haute concentration, dosage du CO dans le sang ou l'air expiré, caisson hyperbare si grossesse ou signes graves ; détecteurs de CO à domicile."});
lzZF("noyade",{t:"L'eau envahit les alvéoles",sub:"Noyade : l'inhalation d'eau empêche les échanges gazeux ; hypoxie, puis arrêt cardiaque",pt:[156,150],bg:"#EAF5FC",
 left:()=>lzOrg("poumons",["alveoles"],-10,22,.62),
 inner:()=>lzR(186,34,124,124,0,"#FBEAE6","none")+[[220,72],[266,66],[298,100],[230,122],[276,130]].map(([a,b],i)=>lzAlv(a,b,19,i%2?"plein":"eau",i+5)).join(""),
 zt:["Alvéoles remplies d'eau :","plus d'échange d'oxygène"],
 extra:()=>lzLL(200,"Toux, mousse, détresse\nrespiratoire, puis arrêt",1)+lzLL(232,"Risque de détresse retardée :\nsurveiller 24 h",0),pill:"Insufflations d'abord, puis RCP",
 cap:"Sortir de l'eau en sécurité, 5 insufflations puis RCP si arrêt, oxygène, réchauffer ; hospitaliser pour surveillance respiratoire même si l'état paraît bon."});
lzSilFig("hypothermie",{t:"Le corps perd plus de chaleur qu'il n'en produit",sub:"Hypothermie : température centrale < 35 °C ; le cœur ralentit et devient instable",
 shade:lzR(30,30,110,220,0,"rgba(91,112,184,.3)","none"),
 extra:lzR(150,40,14,110,7,"#FFFFFF","#56626E",1.2)+lzC(157,152,10,"#5B70B8","#56626E",1.2)+lzR(154,106,6,44,3,"#5B70B8","none")+lzS(170,110,"< 35 °C","start","st-acc st-b"),
 labels:lzLR(170,"Frissons, puis\nconfusion, coma",1)+lzLR(206,"Bradycardie,\ntroubles du rythme",1),
 pill:"Réchauffer progressivement, manipuler doucement",
 cap:"Mettre à l'abri, retirer les vêtements mouillés, couverture, réchauffement progressif, monitorage ; mobilisations douces (risque de fibrillation ventriculaire) ; personnes âgées et alcoolisées à risque."});
lzSilFig("coup-chaleur",{t:"Le corps n'arrive plus à évacuer la chaleur",sub:"Coup de chaleur : température > 40 °C avec troubles neurologiques ; effort par forte chaleur ou canicule",
 shade:lzR(30,30,110,220,0,"rgba(232,80,60,.3)","none"),
 extra:lzR(150,40,14,110,7,"#FFFFFF","#56626E",1.2)+lzC(157,152,10,"#C8372D","#56626E",1.2)+lzR(154,48,6,102,3,"#C8372D","none")+lzS(170,56,"> 40 °C","start","st-acc st-b"),
 labels:lzLR(128,"Peau chaude, sèche\nou en sueur",0)+lzLR(164,"Confusion,\nconvulsions, coma",1)+lzLR(200,"Personne âgée,\nsportif, enfant",0),
 pill:"Refroidir vite : déshabiller, mouiller, ventiler",
 cap:"Mettre à l'ombre, refroidir (linges mouillés, ventilation, glace aux plis), hydratation si conscient, appel du 15 ; prévention lors des canicules : hydrater, rafraîchir, surveiller les personnes fragiles."});
/* ============ Équilibre acido-basique ============ */
const lzABFig=(id,o)=>lz(id,{t:o.t,sub:o.sub,h:270,ins:false,cap:o.cap,
 draw:()=>{const px=x=>lzN(30+(x-6.9)/(7.7-6.9)*260),tilt=o.tilt||0;
  let s=lzR(30,40,260,16,8,"url(#lzph)","none")+`<defs><linearGradient id="lzph" x1="0" x2="1"><stop offset="0" stop-color="#E8574A"/><stop offset=".55" stop-color="#7FC48F"/><stop offset="1" stop-color="#5B70B8"/></linearGradient></defs>`
   +lzR(px(7.35),36,px(7.45)-px(7.35),24,3,"none","#2E7556",2)+[6.9,7.1,7.35,7.45,7.6].map(v=>lzS(px(v),74,String(v).replace(".",","),"middle")).join("")
   +lzP(`M${px(o.ph)} 30 l-6 -10 h12 Z`,"#1C2733","none")+lzS(px(o.ph),16,"pH "+String(o.ph).replace(".",","),"middle","st-acc st-b")+lzS(30,30,"acide","start")+lzS(290,30,"basique","end");
  s+=`<g transform="rotate(${tilt} 160 150)">`+lzR(60,146,200,6,3,"#56626E","none")+lzR(56,120,64,26,8,"#FBE3DE","#C8372D",1.2)+lzS(88,137,"CO2","middle","st-b")+lzR(200,120,64,26,8,"#DCEAF6","#3D6E9E",1.2)+lzS(232,137,"HCO3-","middle","st-b")+`</g>`+lzP("M160 152 L148 176 L172 176 Z","#9AA3AB","none");
  s+=lzS(88,196,"acide : réglé\npar les poumons","middle")+lzS(232,196,"base : réglée\npar les reins","middle");
  return s+o.extra+lzPill(160,258,o.pill,LC.acc);}});
lzABFig("acidose-metabolique",{t:"Le sang devient acide : les bicarbonates baissent",sub:"Acidose métabolique : acides en excès (acidocétose, lactates, insuffisance rénale) ou perte de bicarbonates (diarrhée)",ph:7.2,tilt:-10,
 extra:lzS(160,232,"Compensation : respiration rapide et profonde (Kussmaul)\npour rejeter du CO2","middle","st-acc"),pill:"Traiter la cause ; surveiller potassium",
 cap:"Gaz du sang : pH < 7,35, HCO3- bas, PaCO2 basse si compensation ; traiter la cause (insuline, remplissage, dialyse) ; bicarbonates selon prescription ; surveiller kaliémie et conscience."});
lzABFig("alcalose-metabolique",{t:"Le sang devient basique : les bicarbonates montent",sub:"Alcalose métabolique : vomissements répétés, aspiration gastrique, diurétiques, hypokaliémie",ph:7.55,tilt:10,
 extra:lzS(160,232,"Compensation : respiration ralentie pour garder du CO2","middle","st-acc"),pill:"Corriger hydratation, potassium et chlore",
 cap:"Gaz du sang : pH > 7,45, HCO3- élevé ; réhydratation (sérum salé), correction de la kaliémie, arrêt des diurétiques selon prescription ; surveiller crampes, troubles du rythme."});
lzABFig("acidose-respiratoire",{t:"Les poumons n'éliminent plus assez de CO2",sub:"Acidose respiratoire : hypoventilation (BPCO décompensée, sédation, épuisement, atteinte neuromusculaire)",ph:7.25,tilt:-10,
 extra:lzS(160,232,"Le CO2 s'accumule (PaCO2 > 45 mmHg) ;\nles reins retiennent des bicarbonates (lentement)","middle","st-acc"),pill:"Somnolence + sueurs : alerter (hypercapnie)",
 cap:"Signes : céphalées, somnolence, sueurs, flapping ; oxygène prudent chez le BPCO (objectif 88-92 %), ventilation non invasive, traitement de la cause (antidote si sédatifs)."});
lzABFig("alcalose-respiratoire",{t:"On respire trop et le CO2 chute",sub:"Alcalose respiratoire : hyperventilation (anxiété, douleur, fièvre, embolie pulmonaire, altitude)",ph:7.52,tilt:10,
 extra:lzS(160,232,"PaCO2 basse : fourmillements des lèvres et des doigts,\nvertiges, crampes","middle","st-acc"),pill:"Rassurer, respirer lentement, chercher la cause",
 cap:"Rechercher une cause organique (embolie, hypoxie, sepsis) avant de conclure à l'anxiété ; respiration lente guidée, réassurance, traitement de la cause."});
lzIF("dmv",{t:"Plusieurs organes lâchent les uns après les autres",sub:"Défaillance multiviscérale : sepsis, choc ou traumatisme grave ; poumons, reins, cœur, foie, coagulation, cerveau",zones:["poumons","coeur","urinaire"],cpt:[156,112],
 inner:()=>lzR(186,34,124,124,0,"#FBF1EF","none")+[["poumons",218,62],["cœur",278,62],["reins",206,104],["foie",290,104],["cerveau",248,96],["sang",248,140]].map(([t,a,b])=>lzC(a,b,17,"#FBE3DE","#C8372D",1.2)+lzS(a,b+3,t,"middle","st-b")).join("")+lzP("M210 120 l8 8 M218 120 l-8 8 M282 120 l8 8 M290 120 l-8 8","none",LC.acc,1.8),
 zt:["Chaque organe défaillant","aggrave les autres"],
 extra:()=>lzLL(200,"Score SOFA : respiration, coagulation,\nfoie, cœur, cerveau, reins",1)+lzLL(232,"Suppléances : ventilation,\ndialyse, noradrénaline",0),pill:"Réanimation : surveillance continue de chaque organe",
 cap:"Prise en charge en réanimation : suppléances d'organes, traitement de la cause, prévention des complications (escarres, infections, thromboses) ; accompagnement des proches."});
/* ============ Chirurgie viscérale ============ */
/* paroi abdominale en coupe dans la loupe : peau, graisse, muscles ; o.hole (orifice), o.sac (anse dans le sac), o.strang, o.stoma, o.uro, o.fist */
function lzAbWall(o={}){let s=lzR(186,34,124,124,0,"#FFF6E8","none")+lzR(186,88,124,10,0,LC.skin,"#D69C79",.8)+lzR(186,98,124,18,0,LC.hypo,"none")+lzR(186,116,124,14,0,LC.muscle,"none")+lzR(186,130,124,4,0,"#F4F1E8","none")+lzR(186,134,124,24,0,"#FBEFEA","none");
 if(o.hole){const hx=o.hx||236,hw=o.hw||24,cx=hx+hw/2;
  s+=lzP(`M${hx-26} 99 C${hx-26} 44 ${hx+hw+26} 44 ${hx+hw+26} 99 Z`,LC.hypo,"none")+lzP(`M${hx-30} 93 C${hx-30} 36 ${hx+hw+30} 36 ${hx+hw+30} 93`,"none",LC.skin,10)+lzP(`M${hx-35} 88 C${hx-35} 31 ${hx+hw+35} 31 ${hx+hw+35} 88`,"none","#D69C79",.8)
   +lzR(hx,114,hw,22,0,LC.hypo,"none");
  if(o.sac)s+=lzP(`M${hx-4} 136 C${hx-14} 100 ${hx-8} 60 ${cx} 58 C${hx+hw+8} 60 ${hx+hw+14} 100 ${hx+hw+4} 136`,"#F5E6D8","#C98E6C",1.2)
   +lzP(`M${hx+1} 156 C${hx-2} 116 ${hx+2} 76 ${cx} 74 C${hx+hw-2} 76 ${hx+hw+2} 116 ${hx+hw-1} 156`,"none",o.strang?"#7E1A14":"url(#rg-intest)",12)
   +(o.strang?lzP(`M${hx-6} 112 l8 8 M${hx+hw+6} 112 l-8 8`,"none",LC.acc,2):"");}
 if(o.stoma)s+=lzR(234,88,28,46,0,"#FFF6E8","none")+lzP("M232 158 C232 130 236 100 236 80 M264 158 C264 130 260 100 260 80","none",o.uro?"url(#rg-intest)":"url(#rg-colon)",8)+lzE(248,82,18,7,"#E8857A","#B85A4E",1.2)+lzE(248,82,8,3,"#B23A30","none")
  +lzP("M214 66 C214 44 282 44 282 66 L282 80 L214 80 Z","rgba(220,230,236,.85)","#9AA3AB",1)+lzR(218,78,60,6,3,"#C9B8A6","none")+(o.uro?lzDots(232,50,32,22,6,4,(x,y)=>lzP(`M${x} ${y} q2 4 0 6 q-2 -2 0 -6`,"#F2D46E","#B98B14",.6)):lzE(248,58,12,6,"#B98A5A","none"));
 if(o.fist)s+=lzE(248,148,40,10,"url(#rg-intest)","#C98E6C",1)+lzP("M248 140 C252 120 246 104 252 88","none","#E8D27A",5)+lzDots(244,70,16,16,4,5,(x,y)=>lzP(`M${x} ${y} q2 4 0 6 q-2 -2 0 -6`,"#C9B860","#8E7A20",.6));
 return s;}
const lzHernF=(id,o)=>lzDF(id,Object.assign({inner:()=>lzAbWall(Object.assign({hole:1,sac:1},o.w||{}))},o));
lzHernF("hernie-inguinale",{t:"L'intestin passe par un orifice de l'aine",sub:"Hernie inguinale : le péritoine et une anse intestinale sortent par le canal inguinal ; plus fréquente chez l'homme",zones:["peritoine","grele"],dpt:[118,226],
 zt:["Sac herniaire contenant","une anse intestinale"],
 extra:()=>lzLL(200,"Boule à l'aine qui sort à l'effort\net rentre en position couchée",1)+lzLL(232,"Douloureuse, dure, qui ne rentre\nplus : étranglement",0),pill:"Hernie qui ne rentre plus et fait mal : urgence",
 cap:"Chirurgie programmée (souvent avec plaque) ; étranglement : urgence chirurgicale (risque de nécrose de l'intestin) ; après l'opération : pas de port de charges lourdes quelques semaines."});
lzHernF("hernie-crurale",{t:"Une hernie passe sous l'arcade de la cuisse",sub:"Hernie crurale : plus fréquente chez la femme âgée ; s'étrangle facilement",zones:["peritoine"],dpt:[130,230],w:{hw:16,strang:1},
 zt:["Orifice étroit :","l'anse se coince (étranglement)"],
 extra:()=>lzLL(200,"Petite boule au pli de l'aine,\nsouvent découverte compliquée",1)+lzLL(232,"Vomissements, arrêt des gaz :\nocclusion",0),pill:"Chirurgie rapide : risque d'étranglement élevé",
 cap:"Opération recommandée même sans symptôme ; signes d'étranglement (douleur, vomissements, arrêt des matières et des gaz) : urgence chirurgicale."});
lzHernF("hernie-ombilicale",{t:"L'intestin ou la graisse sortent par le nombril",sub:"Hernie ombilicale : fréquente chez le nourrisson (souvent régresse), chez l'adulte obèse, la femme enceinte, la cirrhose",zones:["peritoine"],dpt:[160,150],w:{hw:20},
 zt:["Sac qui passe par","l'orifice ombilical"],
 extra:()=>lzLL(200,"Nombril qui gonfle à l'effort\nou en pleurant",1)+lzLL(232,"Nourrisson : surveillance",0),pill:"Étranglement : douleur et boule dure",
 cap:"Chez l'enfant : surveillance (fermeture spontanée avant 4-5 ans le plus souvent) ; chez l'adulte : chirurgie si gêne ou risque de complication."});
lzHernF("eventration",{t:"La paroi cède sur une ancienne cicatrice",sub:"Éventration : la cicatrice d'une opération se relâche ; les viscères poussent sous la peau",zones:["peritoine"],dpt:[160,130],w:{hx:220,hw:56,big:1},
 zt:["Muscles écartés","sous la cicatrice"],
 extra:()=>lzLL(200,"Voussure qui grossit\nà la toux et debout",1)+lzLL(232,"Obésité, infection de la plaie,\ntoux, tabac",0),pill:"Ceinture, pas d'effort après la chirurgie",
 cap:"Ceinture de contention, perte de poids, arrêt du tabac ; réparation chirurgicale avec prothèse ; après une laparotomie, éviter port de charges et efforts de toux sans maintien du ventre."});
lzDF("bariatrique",{t:"On réduit l'estomac pour limiter les quantités",sub:"Chirurgie bariatrique : sleeve (estomac en tube) ou bypass (court-circuit) dans l'obésité sévère",zones:["estomac","grele"],dpt:[208,92],
 inner:()=>lzR(186,34,124,124,0,"#FFF6E8","none")+lzP("M232 40 C226 70 270 76 290 100 C304 120 290 150 256 150 C220 150 204 120 212 96 C218 80 226 60 232 40 Z","none","#C98E6C",1.4,";stroke-dasharray:4 3")+lzP("M232 40 C230 70 236 90 228 110 C222 126 230 146 246 150","none","url(#rg-stomach)",18)+lzP("M232 40 C230 70 236 90 228 110 C222 126 230 146 246 150","none","#C98E6C",1),
 zt:["Sleeve : il reste un tube,","le reste est retiré (pointillés)"],
 extra:()=>lzLL(200,"Petites quantités, manger lentement,\nboire en dehors des repas",1)+lzLL(232,"Vitamines à vie, suivi",0),pill:"Supplémentation et suivi nutritionnel à vie",
 cap:"Après l'opération : surveiller fuite (fièvre, tachycardie, douleur), vomissements ; alimentation fractionnée progressive, carences (B12, fer, vitamine D), soutien psychologique, suivi à vie."});
lzDF("stomie-digestive",{t:"L'intestin est abouché à la peau",sub:"Stomie digestive : colostomie ou iléostomie, temporaire ou définitive ; les selles sont recueillies dans une poche",zones:["colon","grele"],dpt:[236,168],
 inner:()=>lzAbWall({stoma:1}),zt:["Stomie rose et humide,","poche collée autour"],
 extra:()=>lzLL(200,"Normal : rose, humide, indolore",1)+lzLL(232,"Alerte : noire, rétractée,\npeau irritée, pas de selles",0),pill:"Découpe de la poche à la taille exacte",
 cap:"Surveiller couleur et aspect de la stomie, peau péristomiale, quantité des selles (iléostomie : risque de déshydratation) ; éducation à l'appareillage, alimentation, image de soi."});
lzZF("stomie-urinaire",{t:"Les urines sortent par une stomie",sub:"Stomie urinaire (Bricker) : les uretères sont branchés sur un segment d'intestin abouché à la peau",pt:[126,150],bg:"#FBF2C8",
 left:()=>lzOrg("rein",["ureteres","vessie"],-8,18,.62),
 inner:()=>lzAbWall({stoma:1,uro:1}),zt:["Urines recueillies en continu","(poche à robinet)"],
 extra:()=>lzLL(200,"Urines avec du mucus : normal",0)+lzLL(232,"Fièvre, urines troubles :\ninfection",1),pill:"Poche de nuit reliée au robinet",
 cap:"Surveiller la diurèse, l'aspect des urines, la peau, la stomie ; boire suffisamment ; changer l'appareillage à intervalle régulier ; éducation et accompagnement."});
lzSK("iso",{t:"La plaie opératoire s'infecte",sub:"Infection du site opératoire : dans les 30 jours (1 an si prothèse) ; superficielle, profonde ou d'organe",dc:"#F2AC98",tf:"#F2A697",foll:false,
 cut:{x0:96,x1:104,d:150,r:.3,bed:"#E8D27A",film:"none"},
 ex:()=>lzE(100,128,30,16,"#EFD98A","#B83A2E",2)+lzDots(80,118,40,20,10,5,lzCoc)+lzDots(84,118,32,18,4,7,(x,y)=>lzWbc(x,y,3.2)),
 over:()=>[70,86,114,130].map(X=>lzP(`M${X} 52 q${X<100?16:-16} -8 ${X<100?30-((X-70)*2):-(30-((130-X)*2))} 0`,"none","#2E3640",1.4)).join(""),
 labT:LB(10,22,"Cicatrice rouge, chaude,\nqui coule (pus)",1,"start",100,52),
 lab:[[114,"Pus sous\nla cicatrice",1,110,128],[156,"Bactéries de la\npeau, du tube\ndigestif",0,90,120]],
 pill:"Prévention : douche, asepsie, antibioprophylaxie",
 cap:"Surveiller la cicatrice, la température, la douleur ; prélèvement, soins locaux, reprise chirurgicale si collection ; prévention : préparation cutanée, dépilation tondeuse, asepsie des pansements."});
lzIF("hemorragie-postop",{t:"Un vaisseau saigne après l'opération",sub:"Hémorragie postopératoire : ligature qui lâche, trouble de la coagulation ; extériorisée (drain, pansement) ou interne",zones:["sang"],cpt:[156,112],
 inner:()=>lzArtL(186,64,124,40,6,{rbc:6,seed:3})+lzR(240,62,14,44,2,"#C9CED4","#56626E",1)+lzR(264,62,14,44,2,"#FBF1EF","none")+lzDots(256,104,40,46,14,5,(x,y,R)=>lzRbc(x,y,4,R()*180))+lzS(247,58,"clip","middle"),
 zt:["Clip ou ligature lâché :","le sang s'écoule"],
 extra:()=>lzLL(200,"Pansement saturé, drain qui\nramène du sang, pouls rapide",1)+lzLL(232,"Pâleur, TA qui baisse,\nagitation",0),pill:"Alerter le chirurgien ; surveiller pouls et TA",
 cap:"Surveillance postopératoire : pansement, drains (quantité, aspect), pouls, tension, conscience, coloration ; alerte rapide, voies veineuses, bilan, transfusion ou reprise chirurgicale."});
lzSK("hematome-postop",{t:"Le sang s'accumule sous la cicatrice",sub:"Hématome postopératoire : collection de sang dans les tissus, favorisée par les anticoagulants",foll:false,
 ex:()=>lzE(104,150,52,16,"#6E1A16","#3A0E0B",1.2)+lzE(96,146,20,6,"rgba(255,255,255,.12)","none"),
 over:()=>lzP("M70 52 h60","none","#2E3640",1.4)+[76,92,108,124].map(X=>lzP(`M${X} 48 v8`,"none","#2E3640",1.4)).join("")+lzE(100,52,40,4,"rgba(110,60,140,.35)","none"),
 labT:LB(10,22,"Gonflement tendu,\npeau violacée",1,"start",100,50),
 lab:[[114,"Sang collecté\ndans l'hypoderme",1,120,150],[160,"Risque :\ncompression,\ninfection",0]],
 pill:"Cou opéré + gonflement : urgence (compression)",
 cap:"Surveiller volume, douleur, tension de la peau, pansement ; glace selon prescription ; évacuation chirurgicale si important ; hématome cervical après chirurgie du cou : risque d'asphyxie, alerte immédiate."});
lzSK("desunion",{t:"Les bords de la cicatrice s'écartent",sub:"Désunion de cicatrice : infection, tension, dénutrition, obésité, diabète ; parfois éviscération",foll:false,dc:"#F2AC98",
 cut:{x0:78,x1:128,d:140,r:.18,bed:"#C9473D",film:"#E8D27A"},
 over:()=>lzP("M70 46 l14 10 M134 46 l-14 10","none","#2E3640",1.4)+lzP("M84 56 l4 4 M120 56 l-4 4","none",LC.acc,1.4),
 labT:LB(10,22,"Fils lâchés, plaie\nqui s'ouvre",1,"start",104,50),
 lab:[[114,"Plaie ouverte,\nqui suinte",1,104,120],[160,"Éviscération :\nurgence",0]],
 pill:"Éviscération : compresses humides stériles, 15",
 cap:"Couvrir de compresses stériles humides en cas d'éviscération, à jeun, alerter ; sinon cicatrisation dirigée (pansements, parfois TPN), nutrition, équilibre du diabète."});
lzDF("fistule-digestive",{t:"Le tube digestif communique avec la peau",sub:"Fistule digestive : après une chirurgie (lâchage de suture), une maladie de Crohn ou une infection",zones:["grele","colon"],dpt:[160,168],
 inner:()=>lzAbWall({fist:1}),zt:["Trajet de l'intestin","jusqu'à la peau"],
 extra:()=>lzLL(200,"Liquide digestif sur la peau :\nbrûlures, déshydratation",1)+lzLL(232,"Bilan entrées/sorties",0),pill:"Protéger la peau ; mesurer les pertes",
 cap:"Appareillage adapté pour recueillir et mesurer, protection cutanée, compensation hydroélectrolytique, nutrition (parfois parentérale) ; reprise chirurgicale selon le cas."});
lzDF("ileus-postop",{t:"L'intestin s'endort après l'opération",sub:"Iléus postopératoire : l'intestin ne se contracte plus (manipulation, morphiniques, douleur, potassium bas)",zones:["grele","colon"],dpt:[160,168],
 inner:()=>lzR(186,34,124,124,0,"#FFF6E8","none")+[[220,66],[276,72],[230,124],[284,128]].map(([a,b])=>lzC(a,b,26,"url(#rg-intest)","#C98E6C",1.2)+lzP(`M${a-22} ${b+4} H${a+22}`,"none","#9CCDEB",2)+lzP(`M${a-22} ${b+4} C${a-18} ${b+24} ${a+18} ${b+24} ${a+22} ${b+4} Z`,"rgba(156,205,235,.6)","none")).join(""),
 zt:["Anses distendues,","air et liquide"],
 extra:()=>lzLL(200,"Ventre gonflé, pas de gaz,\nnausées, vomissements",1)+lzLL(232,"Lever précoce, mâcher,\nlimiter les morphiniques",0),pill:"Mobilisation précoce, réalimentation progressive",
 cap:"Lever et marche précoces, réalimentation précoce selon protocole (RAAC), correction de la kaliémie, épargne morphinique, sonde gastrique si vomissements ; surveiller la reprise du transit."});
