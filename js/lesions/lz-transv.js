/* Carnet IFSI — schémas des lésions : symptômes transversaux, soins palliatifs et psychiatrie (52 fiches). */
/* ---------- secteurs hydriques : cellules, interstitium, plasma ----------
   o.cell (taille des cellules : 1 normale), o.inter (niveau de liquide interstitiel 0..1), o.plasma (largeur du vaisseau), o.na (nombre de Na+ dehors) */
function lzWaterFig(id,o){lz(id,{t:o.t,sub:o.sub,h:276,ins:false,cap:o.cap,draw:()=>{
 const box=(x,w,t)=>lzR(x,40,w,150,10,"var(--fx-bg)","var(--fx-line)",1)+lzS(x+w/2,206,t,"middle","st-b");
 let s=box(10,128,"Dans les cellules\n(2/3 de l'eau)")+box(146,84,"Entre les cellules\n(interstitium)")+box(238,72,"Dans le sang\n(plasma)");
 const k=o.cell||1;[[44,80],[104,80],[44,146],[104,146]].forEach(([a,b])=>{s+=lzE(a,b,24*k,24*k,"#F3D9E9","#9C5C86",1.2)+lzC(a,b,7*Math.min(k,1.1),"#C9A3C4","none");});
 const lv=o.inter==null?.5:o.inter;s+=lzR(150,40+150*(1-lv),76,150*lv-4,8,"rgba(156,205,235,.6)","none")+lzDots(154,44+150*(1-lv),66,150*lv-12,o.na||6,4,(x,y)=>lzC(x,y,2.2,"#F2C94C","#B98B14",.5));
 const pw=o.plasma||40;s+=lzR(274-pw/2,46,pw,138,pw/2,LC.plasma,"#C9675E",1.4)+lzDots(274-pw/2+4,54,pw-8,124,Math.round(pw/5),5,(x,y,R)=>lzRbc(x,y,4,R()*180));
 (o.arrows||[]).forEach(([x1,y1,x2,y2])=>{s+=lzArr(x1,y1,x2,y2,{c:LC.fluidD,w:2.2});});
 return s+(o.extra||"")+lzPill(160,264,o.pill,LC.acc);}});}
lzWaterFig("dec",{t:"L'eau et le sel manquent hors des cellules",sub:"Déshydratation extracellulaire : pertes digestives, urinaires (diurétiques), sueurs, brûlures ; le volume de sang baisse",inter:.18,plasma:22,na:3,arrows:[[188,150,188,184],[274,40,274,30]],
 extra:lzS(160,238,"Pli cutané, hypotension, tachycardie, oligurie, poids qui baisse","middle","st-acc"),pill:"Réhydrater (sérum salé), peser, surveiller la diurèse",
 cap:"Perte d'eau et de sel : hématocrite et protides augmentés ; réhydratation orale ou perfusion de sérum salé isotonique ; surveiller poids, tension, pouls, diurèse."});
lzWaterFig("dic",{t:"Les cellules perdent leur eau",sub:"Déshydratation intracellulaire : manque d'eau (soif non satisfaite, personne âgée) ; le sodium monte et attire l'eau hors des cellules",cell:.72,inter:.45,na:14,arrows:[[84,112,140,112]],
 extra:lzS(160,238,"Soif intense, muqueuses sèches, fièvre, confusion ; Na+ > 145 mmol/L","middle","st-acc"),pill:"Faire boire ; eau ou soluté glucosé sur prescription",
 cap:"Apports d'eau (boissons, eau gélifiée, soluté glucosé) corrigés progressivement ; personnes âgées : proposer à boire régulièrement, la soif est diminuée."});
lzWaterFig("hyperhydratation",{t:"L'eau et le sel s'accumulent hors des cellules",sub:"Hyperhydratation extracellulaire : insuffisance cardiaque, rénale, cirrhose, apports excessifs ; œdèmes",inter:.88,plasma:58,na:14,arrows:[[274,120,236,120]],
 extra:lzS(160,238,"Œdèmes (godet), prise de poids, HTA, œdème pulmonaire","middle","st-acc"),pill:"Restriction sodée, diurétiques, pesée quotidienne",
 cap:"Peser chaque jour à la même heure, bilan entrées-sorties, restriction en sel, diurétiques sur prescription ; surveiller la respiration (œdème pulmonaire)."});
lzWaterFig("hyponatremie",{t:"Trop d'eau par rapport au sel : les cellules gonflent",sub:"Hyponatrémie : Na+ < 135 mmol/L ; diurétiques, potomanie, SIADH, insuffisance cardiaque ; le cerveau gonfle",cell:1.22,inter:.5,na:2,arrows:[[140,112,96,112]],
 extra:lzS(160,238,"Nausées, céphalées, confusion, convulsions si chute rapide","middle","st-acc"),pill:"Corriger lentement (risque neurologique)",
 cap:"Restriction hydrique ou apports de sel selon la cause ; correction lente et surveillée (myélinolyse si trop rapide) ; surveiller conscience et natrémie."});
lzWaterFig("hypernatremie",{t:"Trop de sel par rapport à l'eau : les cellules se rétractent",sub:"Hypernatrémie : Na+ > 145 mmol/L ; manque d'eau surtout (personne âgée, nourrisson, fièvre)",cell:.72,inter:.42,na:16,arrows:[[84,112,140,112]],
 extra:lzS(160,238,"Soif, somnolence, confusion, coma ; neurones rétractés","middle","st-acc"),pill:"Apports d'eau progressifs",
 cap:"Réhydratation progressive (eau, glucosé) ; correction trop rapide : œdème cérébral ; prévenir par une hydratation régulière des personnes dépendantes."});
/* ---------- potassium et ECG ---------- */
function lzKFig(id,o){lz(id,{t:o.t,sub:o.sub,h:270,ins:false,cap:o.cap,draw:()=>{
 const strip=(y,kind,lab)=>{let s=lzR(10,y,300,58,6,"#FFF5F3","#F2C9C2",1)+[...Array(29)].map((_,i)=>lzP(`M${20+i*10} ${y} V${y+58}`,"none","#F7D9D3",.6)).join("");const b=y+38;let d=`M14 ${b}`,x=14;
  while(x<236){const P=` q4 -5 8 0`,T=kind==="hyper"?` l7 -26 l7 26`:kind==="hypo"?` q8 -3 16 0 q5 -6 10 0`:` q7 -10 14 0`,Q=kind==="hyper"?` l3 4 l5 -22 l6 30 l4 -12`:` l2 3 l3 -26 l3 30 l2 -7`;d+=` h6${P} h6${Q} h6${T} h${kind==="hypo"?12:18}`;x+=kind==="hyper"?6+8+6+18+6+14+18:6+8+6+10+6+(kind==="hypo"?26:14)+(kind==="hypo"?12:18);}
  return s+`<path d="${d}" style="fill:none;stroke:#C8372D;stroke-width:1.5;stroke-linejoin:round"/>`+lzS(16,y+12,lab,"start","st-b");};
 let s=strip(36,"normal","Normal")+strip(110,o.kind,o.lab);
 s+=lzR(10,184,300,46,8,"var(--fx-bg)","var(--fx-line)",1)+lzP("M10 207 H310","none","#C98E6C",3)+lzS(16,198,"sang","start")+lzS(16,224,"cellule","start")
  +lzDots(60,188,240,14,o.kind==="hyper"?18:3,4,(x,y)=>lzC(x,y,2.6,"#7FC48F","#2E7556",.5))+lzDots(60,212,240,14,16,6,(x,y)=>lzC(x,y,2.6,"#7FC48F","#2E7556",.5));
 return s+(o.extra||"")+lzPill(160,258,o.pill,LC.acc);}});}
lzKFig("hypokaliemie",{t:"Le potassium manque : muscles et cœur faiblissent",sub:"Hypokaliémie : K+ < 3,5 mmol/L ; diurétiques, vomissements, diarrhée, laxatifs",kind:"hypo",lab:"Hypokaliémie : onde T aplatie, onde U",
 extra:lzS(310,178,"crampes, faiblesse, constipation, troubles du rythme","end","st-acc"),pill:"Potassium : jamais en IV direct, toujours dilué",
 cap:"Supplémentation orale ou intraveineuse lente et diluée (débit limité, voie sûre), surveillance ECG et kaliémie ; aliments riches en potassium (bananes, fruits secs)."});
lzKFig("hyperkaliemie",{t:"Trop de potassium : le cœur peut s'arrêter",sub:"Hyperkaliémie : K+ > 5 mmol/L ; insuffisance rénale, IEC, spironolactone, lyse cellulaire",kind:"hyper",lab:"Hyperkaliémie : T pointues, QRS larges",
 extra:lzS(310,178,"faiblesse, paresthésies, bradycardie, arrêt cardiaque","end","st-acc"),pill:"Signes ECG : scope, calcium, insuline-glucose",
 cap:"Vérifier l'absence d'hémolyse du prélèvement ; ECG ; gluconate de calcium (protège le cœur), insuline + glucose, résines, dialyse selon gravité ; arrêter les apports et médicaments en cause."});
/* ---------- malaises ---------- */
const lzVagus=(dim)=>lzP("M84 34 C88 60 92 80 90 104","none","#E8C34C",3)+lzP("M84 34 C88 60 92 80 90 104","none","#FFF3C8",1.2)+lzC(92,104,9,"rgba(200,55,45,.35)","#C8372D",1.2)+(dim?lzC(84,40,14,"rgba(120,120,130,.45)","none"):"");
lzSilFig("malaise-vagal",{t:"Le nerf vague freine trop fort le cœur",sub:"Malaise vagal : douleur, émotion, chaleur, station debout ; le cœur ralentit et les vaisseaux se dilatent",
 shade:"",extra:lzVagus(1)+lzP("M150 90 l0 0","none","none",1),
 labels:lzLR(40,"Cerveau moins\nirrigué : voile noir",1,98,40)+lzLR(84,"Nerf vague :\ncœur ralenti",1,90,70)+lzLR(130,"Pâleur, sueurs,\nnausées",0)+lzLR(176,"Reprise rapide\nune fois allongé",0),
 pill:"Allonger, jambes surélevées, surveiller pouls et TA",
 cap:"Allonger jambes surélevées, desserrer, aérer, surveiller pouls, tension, glycémie ; rechercher le facteur déclenchant (prise de sang, douleur) ; prévenir les chutes."});
lzSilFig("syncope",{t:"Le cerveau manque brièvement de sang : perte de connaissance",sub:"Syncope : perte de connaissance brève avec retour rapide ; vagale, orthostatique ou cardiaque (la plus grave)",
 shade:"",extra:lzVagus(1)+lzC(84,40,16,"none","#56626E",1.4,";stroke-dasharray:3 3"),
 labels:lzLR(40,"Cerveau privé de\nsang quelques s",1,100,40)+lzLR(96,"Cause cardiaque ?\nECG systématique",1,92,104)+lzLR(150,"Chute : rechercher\nun traumatisme",0)+lzLR(196,"Lever progressif\n(orthostatique)",0),
 pill:"ECG, constantes couché-debout, glycémie",
 cap:"Mettre en sécurité, PLS si inconscient, constantes, ECG, glycémie, tension couché puis debout ; syncope à l'effort ou avec palpitations : cause cardiaque à rechercher en urgence."});
lzSilFig("lipothymie",{t:"Le malaise s'annonce sans perte de connaissance",sub:"Lipothymie : sensation de malaise imminent (voile noir, jambes molles, sueurs) sans perte de connaissance",
 shade:"",extra:lzVagus(0)+lzC(84,40,14,"rgba(120,120,130,.25)","none"),
 labels:lzLR(40,"Voile noir,\nbourdonnements",1,98,40)+lzLR(96,"Pâleur, sueurs,\njambes molles",0)+lzLR(150,"S'allonger dès\nles premiers signes",1),
 pill:"S'asseoir ou s'allonger tout de suite",
 cap:"Allonger, surélever les jambes, surveiller pouls, tension, glycémie ; rechercher hypotension orthostatique, hypoglycémie, déshydratation, médicaments."});
/* ---------- fièvre, inflammation ---------- */
lz("fievre-prolongee",{t:"La fièvre dure plus de 3 semaines",sub:"Fièvre prolongée : infection cachée (endocardite, tuberculose, abcès), cancer, maladie inflammatoire, médicament",h:262,ins:false,
 cap:"Courbe de température, examen clinique répété, hémocultures, bilan ciblé (imagerie, sérologies) ; hydratation, confort, surveillance de l'état général et du poids.",
 draw:()=>{let s=lzR(30,30,260,150,8,"#FBFBF8","#D3DCE4",1)+lzP("M30 96 H290","none","#C8372D",1,";stroke-dasharray:4 3")+lzS(292,92,"38 °C","end","st-acc");
  let d="M30 120";for(let i=0;i<26;i++)d+=` L${30+(i+1)*10} ${lzN(i%2?78+Math.sin(i)*6:104+Math.cos(i)*5)}`;
  return s+lzP(d,"none","#C8372D",2)+lzS(160,196,"jours (plus de 3 semaines)","middle")+[["infection",54],["cancer",134],["inflammation",214]].map(([t,x])=>lzR(x-34,210,72,22,8,"#FBE3DE","#C8372D",1)+lzS(x+2,225,t,"middle","st-b")).join("")+lzPill(160,250,"Courbe de température et recherche de la cause",LC.acc);}});
lzBF("syndrome-inflammatoire",{t:"Les défenses s'activent et le foie fabrique la CRP",sub:"Syndrome inflammatoire : CRP, vitesse de sédimentation, fibrinogène et globules blancs augmentent",
 cells:b=>lzFill(b.x,b.y,b.w,b.h,12,4,(x,y,R)=>lzRbcN(x,y,R))+lzNeut(70,80,8)+lzNeut(150,110,8)+lzDots(b.x,b.y,b.w,b.h,14,6,lzCyto)+lzDots(b.x,b.y,b.w,b.h,18,8,(x,y)=>lzC(x,y,2.2,"#F2C94C","#B98B14",.5)),
 bottomT:"Signaux de l'inflammation :",bottom:()=>lzS(14,196,"globules blancs → messagers (orange) → foie → CRP (jaune) ;\nfièvre, fatigue, perte d'appétit","start"),
 lab:[[114,"CRP (jaune)\ndu foie",1,120,80],[160,"Globules blancs\nactivés",0,70,80]],
 pill:"CRP élevée : rechercher la cause (infection ?)",
 cap:"Marqueur non spécifique : infection, maladie auto-immune, cancer, après chirurgie ; interpréter avec la clinique et suivre son évolution."});
LZ["hyperthermie"]=Object.assign({},LZ["coup-chaleur"],{t:"La température monte au-delà de ce que le corps contrôle",sub:"Hyperthermie : chaleur extérieure, effort, médicaments ; contrairement à la fièvre, le thermostat n'est pas déréglé"});
LZ["hemorragie"]=Object.assign({},LZ["hemorragie-massive"],{t:"Le sang sort des vaisseaux",sub:"Hémorragie : extériorisée ou interne ; la gravité dépend du volume et de la vitesse"});
lzBF("anemie",{t:"Il manque des globules rouges pour transporter l'oxygène",sub:"Anémie : hémoglobine < 12 g/dL (femme), < 13 g/dL (homme) ; perte, défaut de fabrication ou destruction",
 cells:b=>lzFill(b.x,b.y,b.w,b.h,9,4,(x,y,R)=>lzRbcN(x,y,R)),
 bottomT:"Trois grands mécanismes :",bottom:()=>lzIcon(44,186,"perte\n(saignement)",lzDrop(0,0))+lzIcon(120,186,"fabrication\n(fer, B12, moelle)",lzC(0,0,9,"#F6EEDA","#C9B88E",1))+lzIcon(196,186,"destruction\n(hémolyse)",lzSchisto(0,0,null)),
 lab:[[114,"Moins de\nglobules rouges",1,110,80],[156,"Pâleur, fatigue,\nessoufflement",0]],
 pill:"Rechercher la cause ; transfusion si mal tolérée",
 cap:"Signes : pâleur, fatigue, essoufflement, tachycardie, vertiges ; transfusion selon tolérance et taux ; surveiller les signes de tolérance (cœur, conscience)."});
/* ---------- peau, œdèmes, ganglions ---------- */
lzSK("prurit",{t:"Des fibres nerveuses de la peau envoient le signal « ça gratte »",sub:"Prurit : peau sèche, allergie, eczéma, gale, maladie du foie, du rein, du sang ; le grattage entretient le cycle",foll:false,
 ex:()=>lzP("M10 112 C40 108 60 96 80 82 M80 82 l4 -10 M80 82 l8 -6 M140 112 C150 100 160 90 168 80 M168 80 l-4 -10 M168 80 l8 -4","none","#C9A31F",2.2)+lzDots(60,80,120,30,10,5,(x,y)=>lzC(x,y,1.2,"#B5578C","none"))+lzP("M84 74 l-6 -6 M88 70 l-2 -8","none","#F2B705",1.6),
 over:()=>[60,74,88].map(x=>lzP(`M${x} 44 l14 10`,"none","#C8372D",1.6)).join(""),
 labT:LB(10,22,"Lésions de grattage",0,"start",70,50),
 lab:[[114,"Fibres nerveuses\nstimulées",1,120,96],[156,"Histamine et\nautres médiateurs",0,100,90]],
 where:[[-26,46,4.5],[14,36,4.5],[-6,64,4.5],[10,100,4.5]],whereT:"localisé ou diffus",pill:"Émollients, ongles courts, eau tiède",
 cap:"Hydratation de la peau, vêtements en coton, éviter l'eau chaude, ongles courts ; rechercher la cause (bilan hépatique, rénal, sanguin, gale) ; antihistaminiques selon la cause."});
lzSK("oedemes",{t:"Le liquide sort des vaisseaux et gonfle les tissus",sub:"Œdèmes : pression veineuse élevée (cœur, veines), manque de protéines, inflammation, lymphe bloquée",bump:[{x:104,w:190,h:12}],dc:"#F5D5C8",hc:"#F2EEDA",foll:false,
 ex:g=>lzDots(20,90,170,110,60,5,(x,y,R)=>lzC(x,y,1.6+R(),"#BFE0F4","#7FB2D3",.5))+[60,110,160].map(x=>lzArr(x,134,x,118,{c:LC.fluidD,w:1.4})).join(""),
 over:()=>lzE(104,48,10,4,"rgba(150,120,110,.4)","none")+lzP("M104 18 C102 30 102 38 104 44","none","#D69C79",10)+lzS(124,26,"le doigt laisse un godet","start"),
 lab:[[114,"Liquide entre\nles cellules",1,120,150],[156,"Vaisseaux qui\nlaissent fuir",0,110,134]],
 where:[[-9.5,138,5],[9.5,138,5],[0,80,4]],whereT:"chevilles, sacrum",pill:"Pesée, surélévation des jambes, contention",
 cap:"Rechercher la cause (cœur, rein, foie, veines, dénutrition) ; peser chaque jour, surélever les jambes, contention si veineux, soins de peau ; œdème d'un seul mollet douloureux : penser phlébite."});
lzSK("adenopathies",{t:"Un ganglion lymphatique augmente de volume",sub:"Adénopathie : réaction à une infection voisine, ou maladie du sang, cancer ; ganglion > 1 cm",h:244,
 custom:()=>lzNode(lzDots(42,46,160,104,40,7,(x,y)=>lzLymph(x,y,4))+lzDots(60,60,120,80,8,4,lzCoc),[[-5,10,4],[5,10,4],[-16,30,4],[16,30,4],[-8,86,4],[8,86,4]],"adeno"),
 lab:[[114,"Lymphocytes qui\nse multiplient",1,150,100],[170,"Dur, fixé, indolore,\n> 2 cm : avis",0,196,108]],
 pill:"Noter taille, consistance, douleur, durée",
 cap:"Examiner les autres aires ganglionnaires, la rate, rechercher une porte d'entrée infectieuse ; ganglion persistant, dur, sans cause : bilan (prise de sang, imagerie, biopsie)."});
/* ---------- neurologie transversale ---------- */
const lzBrainLat=(o={})=>lzR(186,34,124,124,0,"#F5EEF6","none")+lzP("M200 104 C196 66 226 44 258 46 C292 48 308 76 302 104 C298 124 282 132 266 128 C254 140 232 140 222 128 C206 130 202 118 200 104 Z","url(#rg-brain)","#C9A49A",1.2)+lzP("M236 50 C244 70 246 90 240 112 M214 104 C236 100 262 106 282 120","none","#C9A49A",1.2)+(o.ex||"");
lzNF2("aphasie",{t:"Les zones du langage sont lésées",sub:"Aphasie : trouble du langage après une lésion de l'hémisphère gauche (AVC le plus souvent)",zones:["frontal","temporal"],npt:[100,110],
 inner:()=>lzBrainLat({ex:lzC(230,94,11,"rgba(200,55,45,.5)","#C8372D",1.2)+lzC(268,108,11,"rgba(91,112,184,.5)","#3D6E9E",1.2)+lzS(230,78,"Broca","middle","st-b")+lzS(272,92,"Wernicke","middle","st-b")}),
 zt:["Broca : produire les mots ;","Wernicke : les comprendre"],
 extra:()=>lzLL(200,"Manque du mot, mots déformés,\ncompréhension parfois atteinte",1)+lzLL(232,"L'intelligence est préservée",0),pill:"Phrases courtes, oui/non, pictogrammes, patience",
 cap:"Communication adaptée (questions fermées, gestes, pictogrammes, laisser le temps), orthophonie précoce ; ne pas parler à la place de la personne ni la traiter comme un enfant."});
lzNF2("dysarthrie",{t:"La commande des muscles de la parole est perturbée",sub:"Dysarthrie : parole mal articulée par atteinte du tronc cérébral, du cervelet ou des nerfs ; le langage est intact",zones:["tronc","cervelet"],npt:[200,170],
 inner:()=>lzR(186,34,124,124,0,"#F5EEF6","none")+lzP("M200 120 C214 96 246 90 270 100 C296 112 300 140 286 152 L206 152 Z","#F2B7A4","#C27A68",1.2)+lzP("M214 128 C236 116 262 118 282 132","none","#E8857A",12)+lzP("M240 40 C244 70 240 96 236 118","none","#E8C34C",3)+lzP("M236 70 l8 8 M244 70 l-8 8","none",LC.acc,1.6),
 zt:["Commande des muscles","de la parole perturbée"],
 extra:()=>lzLL(200,"Voix pâteuse, lente, mal\narticulée",1)+lzLL(232,"Vérifier la déglutition\n(fausses routes)",0),pill:"Tester la déglutition avant de faire manger",
 cap:"Laisser le temps, faire répéter, proposer l'écrit ; orthophonie ; dépister les troubles de la déglutition associés."});
lzSilFig("hemiplegie",{t:"Une moitié du corps ne bouge plus",sub:"Hémiplégie : lésion du cerveau du côté opposé (AVC) ; la voie motrice croise la ligne médiane",
 shade:lzR(24,10,60,240,0,"rgba(91,112,184,.35)","none"),extra:lzC(92,38,6,"rgba(200,55,45,.6)","#C8372D",1.2)+lzQ(92,44,88,70,64,84,{c:LC.acc,w:1.6}),
 labels:lzLR(40,"Lésion du cerveau\ngauche (AVC)",1,98,38)+lzLR(96,"Paralysie du\ncôté droit",1,56,100)+lzLR(152,"Risques : chute,\népaule douloureuse",0)+lzLR(204,"Installer côté\nparalysé protégé",0),
 pill:"Positionner, protéger l'épaule, prévenir les escarres",
 cap:"Installation (coussins, épaule soutenue), mobilisations, prévention des escarres, des fausses routes, de la phlébite ; aborder la personne du côté atteint pour stimuler ; rééducation précoce."});
lzSilFig("hemiparesie",{t:"Une moitié du corps a perdu de la force",sub:"Hémiparésie : déficit moteur partiel d'un côté du corps (AVC, tumeur, traumatisme)",
 shade:lzR(24,10,60,240,0,"rgba(91,112,184,.18)","none"),extra:lzC(92,38,5,"rgba(200,55,45,.5)","#C8372D",1.2)+lzQ(92,44,88,70,64,84,{c:LC.acc,w:1.4,dash:"3 3"}),
 labels:lzLR(40,"Lésion du côté\nopposé",1,98,38)+lzLR(96,"Force diminuée,\nmaladresse",1,56,100)+lzLR(152,"Évaluer : bras\ntendus, Mingazzini",0),
 pill:"Déficit brutal : AVC jusqu'à preuve du contraire (15)",
 cap:"Apparition brutale : alerte AVC (heure de début, appel du 15) ; évaluation de la force, aides techniques, prévention des chutes, rééducation."});
lzZF("troubles-equilibre",{t:"Le cerveau reçoit mal les informations d'équilibre",sub:"Troubles de l'équilibre : l'équilibre combine la vue, l'oreille interne et la sensibilité des pieds, intégrés par le cervelet",pt:[132,120],bg:"#F5EEF6",
 left:()=>lzOrg("cerveau",["cervelet","tronc"],-6,20,.6),
 inner:()=>[["yeux",222,66],["oreille\ninterne",274,66],["pieds",248,140]].map(([t,a,b])=>lzC(a,b,18,"#EAF5FC","#3D8CC0",1.2)+lzS(a,b+(t.includes("\n")?-2:3),t,"middle","st-b")).join("")+lzC(248,100,16,"url(#rg-brain)","#C9A49A",1)+lzS(248,103,"cervelet","middle","st-b")+lzArr(232,80,240,88,{c:"#3D8CC0",w:1.4})+lzArr(264,80,256,88,{c:"#3D8CC0",w:1.4})+lzArr(248,124,248,118,{c:"#3D8CC0",w:1.4}),
 zt:["Trois sources d'information","intégrées par le cervelet"],
 extra:()=>lzLL(200,"Vertiges, instabilité, chutes",1)+lzLL(232,"Médicaments, vue, oreille,\nneuropathie, cervelet",0),pill:"Prévenir les chutes, lever progressif",
 cap:"Rechercher la cause (vestibulaire, cérébelleuse, sensitive, visuelle, médicamenteuse) ; aides techniques, éclairage, kinésithérapie vestibulaire ou de l'équilibre."});
lzSilFig("troubles-marche",{t:"Plusieurs systèmes doivent fonctionner pour marcher",sub:"Troubles de la marche : douleur, faiblesse musculaire, atteinte neurologique, peur de tomber",
 shade:"",extra:[[84,36,7],[84,110,8],[72,170,7],[96,170,7],[72,222,6],[96,222,6]].map(([a,b,r])=>lzC(a,b,r,"rgba(200,55,45,.3)","#C8372D",1.2)).join(""),
 labels:lzLR(36,"Cerveau : AVC,\nParkinson",1,92,36)+lzLR(96,"Moelle, nerfs :\nneuropathie",0,92,110)+lzLR(156,"Articulations,\nmuscles : arthrose",1,104,170)+lzLR(212,"Pieds : douleur,\nchaussage",0,104,222),
 pill:"Observer la marche, adapter les aides",
 cap:"Observer la marche (vitesse, polygone, demi-tour), rechercher douleurs et médicaments ; kinésithérapie, aides techniques (canne, déambulateur), chaussage adapté."});
lzNF2("troubles-memoire",{t:"L'hippocampe enregistre mal les souvenirs",sub:"Troubles de la mémoire : vieillissement, dépression, médicaments, carences ou maladie d'Alzheimer",zones:["temporal"],npt:[140,140],
 inner:()=>lzR(186,34,124,124,0,"#F5EEF6","none")+lzP("M206 120 C214 90 246 76 268 86 C286 94 290 116 276 126 C264 134 250 124 252 112 C254 102 266 104 266 112","none","#C9A9D6",14)+lzP("M206 120 C214 90 246 76 268 86 C286 94 290 116 276 126 C264 134 250 124 252 112 C254 102 266 104 266 112","none","#8A63B8",1.2)+lzNeuron(226,62,.8,{fade:1})+lzNeuron(280,58,.8),
 zt:["Hippocampe : la porte","d'entrée des souvenirs"],
 extra:()=>lzLL(200,"Oublis récents, questions\nrépétées, objets égarés",1)+lzLL(232,"Rechercher une cause curable",0),pill:"Repères, routines, calendrier, aide-mémoire",
 cap:"Évaluation (MMSE, tests), bilan (B12, thyroïde, imagerie), réévaluation des médicaments ; repères temporels, routines, aides-mémoire, soutien des aidants."});
lzSilFig("troubles-sensibilite",{t:"Le message sensitif est interrompu sur son trajet",sub:"Troubles de la sensibilité : nerf (neuropathie, diabète), moelle ou cerveau ; fourmillements, engourdissement",
 shade:lzR(30,150,110,100,0,"rgba(242,201,76,.25)","none"),extra:lzP("M72 222 C74 190 78 160 82 120 C84 90 84 60 84 36","none","#E8C34C",2.4)+lzP("M80 150 l6 6 M86 150 l-6 6","none",LC.acc,1.8),
 labels:lzLR(30,"Cerveau : perçoit\nla sensation",0,84,36)+lzLR(90,"Moelle : transmet\nle message",0,84,110)+lzLR(150,"Nerf abîmé\n(diabète, alcool)",1,82,154)+lzLR(200,"Pieds insensibles :\nrisque de plaie",1,74,222),
 pill:"Pieds insensibles : examiner tous les jours",
 cap:"Évaluer (tact, chaud-froid, vibration), protéger les zones insensibles (brûlures, plaies), surveiller les pieds, vérifier la température de l'eau du bain."});
/* ---------- douleur (soins palliatifs) ---------- */
const lzPainPath=(o={})=>lzP("M58 150 C70 140 78 120 82 110 C84 90 84 60 84 36","none",o.c||"#E8C34C",2.6)+lzP("M58 150 l-4 -6 l8 2 l-2 -8","none","#F2B705",2)+lzC(84,36,10,o.amp?"rgba(232,80,60,.35)":"rgba(242,201,76,.25)",o.amp?"#C8372D":"#B98B14",1.2);
lzSilFig("douleur-aigue",{t:"Un message d'alarme part de la lésion vers le cerveau",sub:"Douleur aiguë : signal utile d'une lésion (traumatisme, chirurgie) ; nerf, moelle, puis cerveau qui la ressent",
 shade:"",extra:lzPainPath({}),
 labels:lzLR(36,"Cerveau : ressent,\névalue, émotion",1,94,36)+lzLR(100,"Moelle : relais\n(et frein possible)",0,84,100)+lzLR(156,"Récepteurs de la\ndouleur (lésion)",1,58,150),
 pill:"Évaluer (EN, EVA, échelles adaptées) et réévaluer",
 cap:"Évaluer intensité, localisation, type, retentissement ; antalgiques selon les paliers et la prescription, moyens non médicamenteux (froid, installation) ; réévaluer après chaque traitement."});
lzSilFig("douleur-chronique",{t:"La douleur persiste et le système s'emballe",sub:"Douleur chronique : plus de 3 mois ; le système nerveux se sensibilise, retentissement sur le sommeil, l'humeur, la vie",
 shade:"",extra:lzPainPath({amp:1,c:"#E8893A"})+lzP("M96 30 q10 -8 18 0 q-8 6 -18 0 M96 44 q10 8 18 0","none","#C8372D",1.4),
 labels:lzLR(36,"Cerveau sensibilisé :\nla douleur s'amplifie",1,94,36)+lzLR(100,"Émotions, sommeil,\nanxiété liés",0)+lzLR(156,"Lésion parfois\nguérie",0,58,150),
 pill:"Prise en charge globale, pas seulement médicamenteuse",
 cap:"Évaluation multidimensionnelle, antalgiques adaptés, activité physique, approches psychocorporelles, thérapies cognitives ; objectifs réalistes partagés avec la personne."});
lzSilFig("douleur-neuropathique",{t:"Le nerf lui-même est abîmé et envoie de faux signaux",sub:"Douleur neuropathique : zona, diabète, chimiothérapie, amputation, sciatique ; brûlures, décharges électriques",
 shade:"",extra:lzP("M58 150 C70 140 78 120 82 110 C84 90 84 60 84 36","none","#E8C34C",2.6)+lzP("M66 140 l6 4 M70 136 l6 4","none",LC.acc,1.6)+[[62,128],[74,118]].map(([a,b])=>lzP(`M${a} ${b} l-5 8 h6 l-5 8`,"none","#F2B705",1.6)).join(""),
 labels:lzLR(56,"Brûlures, décharges,\nfourmillements",1,70,120)+lzLR(120,"Nerf lésé :\nsignaux anormaux",1,68,138)+lzLR(184,"Questionnaire DN4",0),
 pill:"Traitements spécifiques ; dépister par le DN4",
 cap:"Dépistage par le DN4 ; traitements spécifiques (certains antiépileptiques et antidépresseurs), neurostimulation, soins locaux ; évaluer l'impact sur le sommeil et l'humeur."});
lzPF2("dyspnee",{t:"Respirer devient un effort pénible",sub:"Dyspnée : sensation de manque d'air ; poumons, cœur, anémie, anxiété ; fréquente en fin de vie",zones:["poumons","plevre"],ppt:[268,176],
 inner:()=>lzR(186,34,124,124,0,"#FBEAE6","none")+[[220,72],[266,66],[298,100],[230,122],[276,130]].map(([a,b],i)=>lzAlv(a,b,18,i%2?"eau":"air",i+4)).join(""),zt:["Moins d'alvéoles disponibles","pour les échanges"],
 extra:()=>lzLL(200,"Respiration rapide, tirage,\nangoisse, parole difficile",1)+lzLL(232,"Évaluer : FR, SpO2, échelle\nde Borg ou EVA",0),pill:"Position demi-assise, air frais, présence rassurante",
 cap:"Traiter la cause si possible ; position, ventilateur ou fenêtre, oxygène si hypoxie, morphine à faible dose et anxiolytiques sur prescription en soins palliatifs ; rester présent."});
lzPF2("encombrement",{t:"Les sécrétions s'accumulent dans les bronches",sub:"Encombrement bronchique : toux inefficace (faiblesse, fin de vie, troubles de la déglutition)",zones:["bronches","trachee"],ppt:[188,96],
 inner:()=>lzR(186,34,124,124,0,"#FBEAE6","none")+lzBr(248,96,44,{})+lzP("M226 100 C230 84 248 80 262 90 C272 98 268 116 252 118 C236 120 224 112 226 100 Z","#F2E6C4","#C9A24E",1.2),
 zt:["Bronche obstruée","par les sécrétions"],
 extra:()=>lzLL(200,"Respiration bruyante (râles),\ntoux faible",1)+lzLL(232,"Fin de vie : souvent plus gênant\npour l'entourage",0),pill:"Sur le côté, moins de perfusions, soins de bouche",
 cap:"Installation en décubitus latéral, soins de bouche, réduction des apports hydriques artificiels, anticholinergiques sur prescription ; aspiration seulement si utile (inconfortable)."});
lzNF2("nausees-vomissements",{t:"Plusieurs signaux activent le centre du vomissement",sub:"Nausées et vomissements : médicaments (opioïdes, chimiothérapie), occlusion, HTIC, anxiété, mouvement",zones:["tronc"],npt:[180,176],
 inner:()=>lzR(186,34,124,124,0,"#F5EEF6","none")+lzC(248,98,16,"#E8C34C","#B98B14",1.2)+lzS(248,101,"centre","middle","st-b")+[["estomac",216,56],["médicaments",284,60],["oreille",212,140],["émotions",286,140]].map(([t,a,b])=>lzC(a,b,17,"#FBE3DE","#C8372D",1)+lzS(a,b+3,t,"middle","st-b")+lzArr(a+(a<248?12:-12),b+(b<98?10:-10),a+(a<248?20:-20),b+(b<98?20:-20),{c:"#C8372D",w:1.2})).join(""),
 zt:["Le centre du vomissement","reçoit plusieurs alarmes"],
 extra:()=>lzLL(200,"Rechercher : occlusion, fécalome,\nmédicaments, HTIC",1)+lzLL(232,"Antiémétique selon la cause",0),pill:"Bouche propre, petits repas, éviter les odeurs fortes",
 cap:"Identifier la cause (dont constipation sous opioïdes), antiémétiques adaptés, petits repas froids, soins de bouche, position demi-assise ; surveiller l'hydratation."});
LZ["ic-terminale"]=Object.assign({},LZ["icg"],{t:"Le cœur ne parvient plus à pomper malgré les traitements",sub:"Insuffisance cardiaque terminale : essoufflement au moindre effort, œdèmes, fatigue ; priorité au confort"});
LZ["ir-terminale"]=Object.assign({},LZ["irc-resp"],{t:"Les poumons ne suffisent plus, même au repos",sub:"Insuffisance respiratoire terminale : dyspnée permanente, oxygène ; soulager l'essoufflement et l'angoisse"});
LZ["ih-terminale"]=Object.assign({},LZ["insuffisance-hepatique"],{t:"Le foie ne fait presque plus son travail",sub:"Insuffisance hépatique terminale : ictère, ascite, saignements, encéphalopathie ; soins de confort"});
LZ["sla-evoluee"]=Object.assign({},LZ["sla"],{t:"Les neurones moteurs disparaissent jusqu'à la respiration",sub:"SLA évoluée : paralysie étendue, troubles de la déglutition et de la respiration ; communication à préserver"});
LZ["demence-avancee"]=Object.assign({},LZ["alzheimer-n"],{t:"Le cerveau a perdu une grande partie de ses neurones",sub:"Démence avancée : dépendance totale, troubles de la déglutition ; soins de confort et communication non verbale"});
LZ["neurodegen-evoluee"]=Object.assign({},LZ["parkinson-n"],{t:"La maladie neurodégénérative atteint un stade avancé",sub:"Maladie neurodégénérative évoluée : chutes, fausses routes, douleurs, dépendance ; adapter les soins au confort"});
/* ============ Psychiatrie (mécanismes simplifiés) ============ */
/* synapse : bouton présynaptique, fente, récepteurs ; o.n (neurotransmetteurs), o.c (couleur), o.block (molécules sur les récepteurs) */
function lzSyn(o={}){let s=lzR(186,34,124,124,0,"#F5EEF6","none")+lzP("M206 34 L206 70 C206 92 290 92 290 70 L290 34 Z","#E3D6EE","#8A63B8",1.4)+lzDots(214,40,68,32,6,4,(x,y)=>lzC(x,y,6,"#FFFFFF","#8A63B8",.8)+lzDots(x-3,y-3,6,6,3,x,(a,b)=>lzC(a,b,1.2,o.c||"#F2B705","none")));
 s+=lzP("M196 120 C220 112 276 112 300 120 L300 158 L196 158 Z","#E3D6EE","#8A63B8",1.4)+[214,238,262,286].map(x=>lzP(`M${x-5} ${lzN(118-(x-248)*(x-248)/1500)} v-6 h10 v6`,"none","#5A3D8C",1.8)).join("");
 s+=lzDots(206,92,88,18,o.n==null?14:o.n,6,(x,y)=>lzC(x,y,2,o.c||"#F2B705","none"));
 if(o.block)s+=[214,238,262,286].map(x=>lzR(x-4,104,8,6,2,o.block,"#56626E",.6)).join("");
 return s;}
lzNF2("edc",{t:"Les messagers chimiques de l'humeur circulent moins bien",sub:"Épisode dépressif : maladie fréquente qui touche l'humeur, le plaisir, le sommeil, la pensée ; elle se soigne",zones:["frontal"],npt:[100,86],
 inner:()=>lzSyn({n:4}),zt:["Moins de sérotonine entre","les neurones (modèle simplifié)"],
 extra:()=>lzLL(200,"Tristesse, perte de plaisir, fatigue,\nsommeil, idées de mort",1)+lzLL(232,"Une maladie, pas une faiblesse",0),pill:"Toujours évaluer le risque suicidaire",
 cap:"Écoute, évaluation du risque suicidaire, psychothérapie, antidépresseurs (délai d'action de 2 à 4 semaines, surveillance du risque en début de traitement), suivi régulier."});
lz("bipolaire-1",{t:"L'humeur oscille entre deux pôles",sub:"Trouble bipolaire : alternance d'épisodes maniaques (élation, peu de sommeil) et dépressifs, avec des périodes stables",h:262,ins:false,
 cap:"Régulateur de l'humeur (lithium : lithémie, hydratation, signes de surdosage), psychoéducation, régularité du sommeil, repérage des signes précoces de rechute.",
 draw:()=>{let s=lzR(30,40,260,150,8,"#FBFBF8","#D3DCE4",1)+lzR(30,96,260,38,0,"rgba(127,196,143,.18)","none")+lzP("M30 115 H290","none","#9AA3AB",1,";stroke-dasharray:4 3");
  s+=lzP("M30 115 C50 115 60 60 80 56 C100 52 110 112 130 115 C150 118 160 170 180 172 C200 174 210 118 230 115 C250 112 270 112 290 115","none","#8A63B8",3);
  return s+lzS(84,48,"manie","middle","st-acc st-b")+lzS(180,186,"dépression","middle","st-acc st-b")+lzS(286,110,"stable","end")+lzS(160,208,"temps (mois, années)","middle")+lzPill(160,250,"Régularité du sommeil ; repérer les signes de rechute",LC.acc);}});
lzNF2("schizophrenie",{t:"La perception de la réalité est perturbée",sub:"Schizophrénie : hallucinations, idées délirantes, désorganisation, repli ; excès de dopamine dans certains circuits",zones:["frontal","temporal"],npt:[140,140],
 inner:()=>lzSyn({n:30,c:"#E8893A"}),zt:["Trop de dopamine dans","certains circuits"],
 extra:()=>lzLL(200,"Symptômes positifs (voix, délire)\net négatifs (retrait, apathie)",1)+lzLL(232,"Antipsychotiques : bloquent\nles récepteurs",0),pill:"Alliance thérapeutique, surveiller les traitements",
 cap:"Antipsychotiques (surveiller poids, glycémie, mouvements anormaux, constipation), réhabilitation psychosociale, éducation thérapeutique, lien avec les familles ; lutter contre la stigmatisation."});
const lzAmyg=(o={})=>lzBrainLat({ex:lzC(250,112,10,o.on?"rgba(232,80,60,.7)":"rgba(242,201,76,.5)",o.on?"#C8372D":"#B98B14",1.4)+(o.on?[0,1,2].map(i=>lzC(250,112,16+i*7,"none","#C8372D",1,";opacity:"+(.6-i*.18))).join(""):"")+lzS(250,140,"amygdale","middle","st-b")});
lzNF2("tag",{t:"Le système d'alarme du cerveau reste allumé",sub:"Trouble anxieux généralisé : inquiétudes excessives et permanentes, tension, sommeil perturbé",zones:["temporal"],npt:[140,140],
 inner:()=>lzAmyg({on:1}),zt:["L'amygdale (alarme) réagit","trop et trop souvent"],
 extra:()=>lzLL(200,"Inquiétude difficile à contrôler,\ntension musculaire, irritabilité",1)+lzLL(232,"Plus de 6 mois",0),pill:"Psychothérapie (TCC), relaxation",
 cap:"Thérapies cognitivo-comportementales, techniques de relaxation et de respiration, activité physique, antidépresseurs si besoin ; limiter caféine et alcool, éviter les benzodiazépines au long cours."});
lzNF2("trouble-panique",{t:"L'alarme se déclenche brutalement sans danger réel",sub:"Trouble panique : attaques de panique répétées et peur d'en refaire ; les signes physiques sont réels",zones:["temporal"],npt:[140,140],
 inner:()=>lzAmyg({on:1})+lzArr(266,100,296,72,{c:LC.acc,w:1.6})+lzS(298,64,"cœur","end","st-acc"),zt:["Alarme → cœur qui s'accélère,","souffle court, peur de mourir"],
 extra:()=>lzLL(200,"Palpitations, étouffement, sueurs,\nvertiges, peur de mourir",1)+lzLL(232,"Éliminer une cause organique",0),pill:"Rester calme, respiration lente guidée",
 cap:"Pendant la crise : présence calme, respiration lente, environnement apaisant ; éliminer une cause cardiaque ou respiratoire ; TCC et traitement de fond."});
lz("toc",{t:"Une boucle obsession-compulsion s'auto-entretient",sub:"Trouble obsessionnel compulsif : pensées intrusives angoissantes et rituels pour les neutraliser",h:262,ins:false,
 cap:"Thérapie cognitivo-comportementale (exposition avec prévention de la réponse), antidépresseurs ; ne pas participer aux rituels ni les interdire brutalement ; soutenir sans juger.",
 draw:()=>{const C=[[160,60,"obsession"],[250,130,"angoisse"],[160,200,"compulsion\n(rituel)"],[70,130,"soulagement\nbref"]];
  let s=C.map(([x,y,t])=>lzC(x,y,32,"#F3D9E9","#9C5C86",1.4)+lzS(x,y+(t.includes("\n")?-2:3),t,"middle","st-b")).join("");
  s+=lzQ(190,74,236,84,244,100,{c:"#9C5C86",w:2})+lzQ(240,160,220,190,192,198,{c:"#9C5C86",w:2})+lzQ(128,196,90,186,78,162,{c:"#9C5C86",w:2})+lzQ(80,100,90,70,128,62,{c:"#9C5C86",w:2});
  return s+lzPill(160,250,"Ne pas renforcer les rituels, soutenir la thérapie",LC.acc);}});
lzNF2("espt",{t:"Le souvenir traumatique reste « en alerte »",sub:"État de stress post-traumatique : après un événement violent ; reviviscences, évitement, hypervigilance",zones:["temporal"],npt:[140,140],
 inner:()=>lzAmyg({on:1})+lzP("M226 120 C230 108 246 104 252 118","none","#8A63B8",5),zt:["Alarme hyperactive, mémoire","du trauma mal « classée »"],
 extra:()=>lzLL(200,"Cauchemars, flash-back,\névitement, sursauts",1)+lzLL(232,"Soignants exposés aussi",0),pill:"Écoute, sécurité, orienter vers un soin spécialisé",
 cap:"Psychothérapies spécifiques (EMDR, TCC centrées sur le trauma), traitement des troubles du sommeil ; repérage chez les soignants après un événement difficile (débriefing)."});
lzSilFig("anorexie",{t:"Le corps est privé d'énergie et tous les organes s'adaptent",sub:"Anorexie mentale : restriction alimentaire, peur de grossir, perception du corps altérée ; complications graves",
 shade:"",extra:[[84,36,6],[84,90,8],[84,120,8],[66,190,6]].map(([a,b,r])=>lzC(a,b,r,"rgba(200,55,45,.3)","#C8372D",1.2)).join(""),
 labels:lzLR(36,"Pensées centrées sur\nle poids, l'image",1,92,36)+lzLR(90,"Cœur lent, hypotension,\nhypokaliémie",1,92,90)+lzLR(140,"Arrêt des règles,\nos fragiles",0,92,120)+lzLR(196,"Risque de\nrenutrition",0),
 pill:"Pesée régulière ; surveiller ionogramme et cœur",
 cap:"Prise en charge pluridisciplinaire (somatique, nutritionnelle, psychologique, famille) ; renutrition progressive (phosphore, potassium), contrat de soins, alliance thérapeutique."});
lzGF("alcool",{t:"L'alcool abîme le foie, le cerveau et bien d'autres organes",sub:"Trouble de l'usage de l'alcool : dépendance physique et psychique ; stéatose, hépatite, cirrhose, cancers",zones:["foie"],pt:[108,80],
 inner:()=>lzR(186,34,124,124,0,"#F3D6CB","none")+lzDots(194,40,112,112,24,5,(x,y)=>lzE(x,y,8,7,"#E9B49F","#B9584A",.6)+lzC(x,y,1.8,"#7A2C1C","none"))+lzDots(196,42,108,108,16,9,(x,y)=>lzC(x,y,4,"#FDEDB9","#D6B25E",.6)),
 zt:["Cellules du foie chargées","de graisse (stéatose)"],
 extra:()=>lzLL(196,"Repérage : questionnaire AUDIT,\nsans jugement",1),pill:"Repérer, informer, accompagner sans juger",
 cap:"Repérage précoce et intervention brève, accompagnement en addictologie, prévention du sevrage (vitamine B1) ; surveiller les complications hépatiques, neurologiques, nutritionnelles."});
lzPF2("tabac",{t:"La fumée détruit les cils des bronches et les alvéoles",sub:"Addiction au tabac : la nicotine crée la dépendance ; goudrons et monoxyde abîment poumons et vaisseaux",zones:["bronches"],ppt:[188,96],
 inner:()=>lzR(186,34,124,124,0,"#FBEAE6","none")+lzR(186,96,124,62,0,LC.mucosa,"none")+[...Array(14)].map((_,i)=>lzP(`M${192+i*8} 96 l${i%3?0:2} -${i<6?3:10}`,"none","#C9675E",1.6)).join("")+lzDots(196,50,108,44,30,5,(x,y)=>lzC(x,y,1.8,"#5A4636","none"))+lzR(186,88,60,8,0,"rgba(90,70,54,.5)","none"),
 zt:["Cils détruits, goudrons","déposés sur la muqueuse"],
 extra:()=>lzLL(200,"BPCO, cancers, infarctus, AVC,\nartérite",1)+lzLL(232,"Substituts nicotiniques :\ndoses suffisantes",0),pill:"Proposer l'arrêt à chaque occasion",
 cap:"Conseil minimal, substituts nicotiniques (patch + forme orale) à dose adaptée, accompagnement (tabacologue, Tabac info service) ; bénéfices dès les premières semaines."});
lzNF2("opioides",{t:"Les opioïdes se fixent sur les récepteurs du cerveau",sub:"Trouble de l'usage des opioïdes : héroïne, médicaments ; dépendance, tolérance, risque de surdose (arrêt respiratoire)",zones:["tronc"],npt:[180,176],
 inner:()=>lzSyn({n:6,block:"#E8893A"}),zt:["Opioïdes (orange) sur les","récepteurs : respiration freinée"],
 extra:()=>lzLL(200,"Surdose : myosis, somnolence,\nrespiration lente",1)+lzLL(232,"Naloxone : antidote",0),pill:"Surdose : naloxone, ventiler, appeler le 15",
 cap:"Traitements de substitution (méthadone, buprénorphine), réduction des risques (matériel stérile, naloxone en kit), accompagnement en addictologie sans jugement."});
lzNF2("substances",{t:"Les drogues détournent le circuit de la récompense",sub:"Troubles liés aux substances : la dopamine libérée en excès renforce l'envie de recommencer",zones:["frontal"],npt:[100,86],
 inner:()=>lzSyn({n:34,c:"#E8893A"}),zt:["Afflux de dopamine :","le cerveau « en redemande »"],
 extra:()=>lzLL(200,"Envie irrépressible (craving),\nperte de contrôle",1)+lzLL(232,"Une maladie qui se soigne",0),pill:"Accueil sans jugement, réduction des risques",
 cap:"Repérage, accompagnement en addictologie (CSAPA), réduction des risques, prise en charge des comorbidités psychiatriques et somatiques."});
const lzSeesaw=(id,o)=>lz(id,{t:o.t,sub:o.sub,h:262,ins:false,cap:o.cap,draw:()=>{
 let s=`<g transform="rotate(14 160 120)">`+lzR(50,116,220,6,3,"#56626E","none")+lzR(40,88,80,28,8,"#DCEAF6","#3D6E9E",1.2)+lzS(80,106,"frein (GABA)","middle","st-b")+lzR(200,88,80,28,8,"#FBE3DE","#C8372D",1.2)+lzS(240,106,"accélérateur","middle","st-b")+`</g>`+lzP("M160 122 L146 150 L174 150 Z","#9AA3AB","none");
 return s+lzS(160,40,o.top,"middle","st-acc st-b")+lzS(160,176,o.bot,"middle")+lzPill(160,250,o.pill,LC.acc);}});
lzSeesaw("sevrage-alcool",{t:"Sans alcool, le cerveau s'emballe",sub:"Sevrage alcoolique : l'alcool freinait le cerveau ; à l'arrêt, l'excitation domine (6 à 24 h après le dernier verre)",
 top:"Le frein habituel disparaît : le cerveau est en surrégime",bot:"Tremblements, sueurs, agitation, tachycardie ;\nrisque de convulsions et de delirium tremens",
 pill:"Cushman, benzodiazépines, vitamine B1, hydratation",
 cap:"Surveillance (score de Cushman), benzodiazépines selon protocole, vitamine B1 avant tout apport glucosé, hydratation, environnement calme et éclairé ; prévenir convulsions et delirium tremens."});
lzSeesaw("sevrage-bzd",{t:"Arrêter brutalement les benzodiazépines déséquilibre le cerveau",sub:"Sevrage aux benzodiazépines : anxiété rebond, insomnie, parfois convulsions ; d'où une diminution très progressive",
 top:"Le frein médicamenteux est retiré trop vite",bot:"Anxiété, insomnie, irritabilité, tremblements ;\nconvulsions si arrêt brutal",
 pill:"Diminution progressive sur plusieurs semaines",
 cap:"Ne jamais arrêter brutalement après un usage prolongé ; plan de décroissance progressive, soutien, alternatives non médicamenteuses pour l'anxiété et le sommeil."});
/* ---------- variantes proches ---------- */
const lzAlias=(id,src,t,sub)=>{if(LZ[src])LZ[id]=Object.assign({},LZ[src],{t,sub});};
lzAlias("depression-chronique","edc","L'humeur reste basse pendant des années","Dépression chronique (dysthymie) : symptômes moins intenses mais durables, au moins 2 ans");
lzAlias("bipolaire-2","bipolaire-1","L'humeur oscille, avec des phases hautes plus modérées","Trouble bipolaire de type II : épisodes dépressifs et hypomaniaques (sans manie franche)");
lzAlias("schizoaffectif","schizophrenie","Symptômes psychotiques et troubles de l'humeur associés","Trouble schizoaffectif : épisodes de type schizophrénique et épisodes dépressifs ou maniaques");
lzAlias("phobies","tag","L'alarme se déclenche face à un objet ou une situation précise","Phobie spécifique : peur intense et évitement (animaux, hauteur, sang, piqûres…)");
lzAlias("anxiete-sociale","tag","L'alarme se déclenche dans le regard des autres","Anxiété sociale : peur intense d'être jugé, évitement des situations sociales");
lzAlias("tca","anorexie","L'alimentation devient le centre d'une souffrance","Troubles du comportement alimentaire : anorexie, boulimie, hyperphagie ; retentissement sur tout le corps");
lzAlias("confusion-terminale","confusion-aigue","En fin de vie, le cerveau décompense","Confusion terminale : causes à rechercher si possible (douleur, globe, médicaments) ; priorité au confort");
lzAlias("aeg","cachexie","Fatigue, perte d'appétit et amaigrissement s'associent","Altération de l'état général : asthénie, anorexie, amaigrissement ; signe d'alerte à explorer");
lzAlias("anorexie-pallia","cachexie","L'appétit disparaît et le corps s'épuise","Anorexie en soins palliatifs : liée à la maladie et aux traitements ; adapter les repas au plaisir");
lzAlias("deshydratation-ag","dec","La personne âgée se déshydrate vite","Déshydratation du sujet âgé : soif diminuée, dépendance pour boire, diurétiques, fièvre, chaleur");
