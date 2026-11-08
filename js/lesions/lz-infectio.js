/* Carnet IFSI — schémas des lésions : maladies infectieuses et immunitaires (29 pathologies).
   Base : la silhouette (où agit le germe) et une loupe sur le germe dans le tissu. */
const lzMpC=(x,y)=>[lzN(-8+x*.62),lzN(14+y*.62)];
const lzIF=(id,o)=>lzZF(id,Object.assign({left:()=>lzOrg("corps",o.zones||[],-8,14,.62)+(o.mosq?lzMosq(150,36):""),pt:lzMpC(...(o.cpt||[210,118])),bg:"#FBF1EF"},o));
const lzMosq=(x,y)=>lzE(x,y,9,3,"#56626E","#2E3640",.8)+lzC(x+10,y-1,3,"#2E3640","none")+lzP(`M${x+12} ${y} l8 4`,"none","#2E3640",1)+lzE(x-2,y-6,7,3,"rgba(200,220,240,.8)","#9AA3AB",.6,-20)+lzE(x+2,y-6,7,3,"rgba(200,220,240,.8)","#9AA3AB",.6,20)
 +[-6,0,6].map(d=>lzP(`M${x+d} ${y+2} l${d/2-3} 8 M${x+d} ${y+2} l${d/2+3} 8`,"none","#2E3640",.7)).join("")+lzP(`M${x-8} ${y} h-4 m0 0 l-1 0`,"none","#C9B8A6",2,";stroke-dasharray:1 1");
/* vaisseau dans la loupe avec germes */
const lzVesB=(n,fn,o={})=>lzArtL(186,o.y||58,124,o.d||64,7,{rbc:o.rbc==null?6:o.rbc,seed:5,plasma:o.plasma})+lzDots(194,(o.y||58)+12,108,(o.d||64)-24,n,o.seed||6,fn);
const lzCyto=(x,y)=>[0,1,2,3,4,5].map(i=>{const a=i*Math.PI/3;return lzP(`M${x} ${y} l${lzN(Math.cos(a)*3.4)} ${lzN(Math.sin(a)*3.4)}`,"none","#E8893A",1.2);}).join("");
const lzDiplo=(x,y,R)=>{const a=R?R()*180:0;return `<g transform="rotate(${Math.round(a)} ${lzN(x)} ${lzN(y)})">${lzE(x-2,y,2.2,1.8,"#3E8E4A","#225A2B",.4)+lzE(x+2.4,y,2.2,1.8,"#3E8E4A","#225A2B",.4)}</g>`;};
const lzSpiro=(x,y,R)=>{const a=R?Math.round(R()*180):0;return `<path d="M${lzN(x-8)} ${lzN(y)} q1.6 -3 3.2 0 t3.2 0 t3.2 0 t3.2 0 t3.2 0" transform="rotate(${a} ${lzN(x)} ${lzN(y)})" style="fill:none;stroke:#3E8E4A;stroke-width:1.3"/>`;};
const lzPseudo=(x,y,R)=>lzBact(x,y,R)+lzP(`M${lzN(x+3)} ${lzN(y)} q3 -3 6 0 t5 0`,"none","#225A2B",.7);
const lzHypha=(x,y,R)=>{const a=R?R()*Math.PI*2:0,c=Math.cos(a),s=Math.sin(a);return lzP(`M${lzN(x)} ${lzN(y)} l${lzN(c*12)} ${lzN(s*12)} M${lzN(x+c*6)} ${lzN(y+s*6)} l${lzN(Math.cos(a+.8)*8)} ${lzN(Math.sin(a+.8)*8)} M${lzN(x+c*12)} ${lzN(y+s*12)} l${lzN(Math.cos(a-.8)*7)} ${lzN(Math.sin(a-.8)*7)}`,"none","#5E8240",1.6);};
/* ============ Sepsis et infections du sang ============ */
lzIF("sepsis-i",{t:"L'infection déborde dans tout l'organisme",sub:"Sepsis : la réaction de défense, débordée, abîme les vaisseaux et les organes ; dysfonction d'organe",zones:["sang"],
 inner:()=>lzVesB(10,lzBact)+lzDots(194,70,108,40,4,9,(x,y)=>lzWbc(x,y,4))+lzDots(194,70,108,40,8,3,lzCyto)+lzArr(230,124,230,146,{c:LC.fluidD,w:1.4})+lzArr(270,124,270,146,{c:LC.fluidD,w:1.4}),
 zt:["Bactéries, globules blancs,","signaux d'alarme (orange)"],
 extra:()=>lzLL(200,"Fièvre ou hypothermie, pouls rapide,\nrespiration rapide, confusion",1)+lzLL(232,"qSOFA : FR ≥ 22, PAS ≤ 100,\nconfusion",0),pill:"Hémocultures puis antibiotiques dans l'heure",
 cap:"Hémocultures, lactates, antibiotiques le plus tôt possible, remplissage vasculaire ; surveillance rapprochée (pression artérielle, diurèse, conscience, SpO2) ; rechercher et traiter la source."});
lzIF("choc-septique",{t:"Les vaisseaux se dilatent et la pression s'effondre",sub:"Choc septique : sepsis avec hypotension persistante malgré le remplissage ; besoin de noradrénaline",zones:["sang","coeur"],
 inner:()=>lzVesB(10,lzBact,{y:44,d:92,rbc:4})+lzDots(194,60,108,60,6,3,lzCyto)+[[214,140],[250,140],[286,140]].map(([a,b])=>lzArr(a,b-6,a,b+12,{c:LC.fluidD,w:1.4})).join("")+lzArr(196,90,212,90,{c:"#1E5A6D",w:2})+lzArr(300,90,284,90,{c:"#1E5A6D",w:2}),
 zt:["Vaisseaux dilatés et poreux :","la pression chute"],
 extra:()=>lzLL(200,"PAM < 65 mmHg, lactates > 2,\nmarbrures, oligurie",1)+lzLL(232,"Réanimation : noradrénaline",0),pill:"Remplissage, noradrénaline, antibiotiques",
 cap:"Remplissage, vasopresseurs sur voie centrale, antibiotiques, contrôle de la source ; surveillance continue (pression artérielle invasive, diurèse horaire, lactates, marbrures)."});
lzIF("bacteriemie",{t:"Des bactéries circulent dans le sang",sub:"Bactériémie : passage de bactéries dans le sang (cathéter, infection urinaire, soins dentaires…)",zones:["sang"],
 inner:()=>lzVesB(14,lzBact),zt:["Bactéries emportées","par le sang"],
 extra:()=>lzLL(200,"Frissons, fièvre, parfois\nsans symptôme",1)+lzLL(232,"Hémocultures au pic\nde fièvre ou frissons",0),pill:"Hémocultures avant tout antibiotique",
 cap:"Hémocultures (2 à 3 paires, asepsie rigoureuse), recherche de la porte d'entrée, retrait d'un cathéter suspect, antibiotiques adaptés ; risque d'endocardite et de localisations secondaires."});
const lzCath=(bio)=>lzArtL(186,70,124,56,6,{rbc:4,seed:3})+lzP("M186 46 L250 92","none","#E6EEF4",8)+lzP("M186 46 L250 92","none","#9AA3AB",1.2)+lzP("M250 92 L300 98","none","#E6EEF4",6)+lzP("M250 92 L300 98","none","#9AA3AB",1)
 +(bio?lzP("M216 66 L254 92 L300 96","none","rgba(110,170,90,.55)",10)+lzDots(214,62,86,34,16,5,lzBact):"");
lzIF("ias",{t:"Une infection acquise à l'occasion d'un soin",sub:"Infection associée aux soins : cathéter, sonde urinaire, ventilation, plaie opératoire ; germes souvent résistants",zones:["urinaire","poumons","sang"],cpt:[210,118],
 inner:()=>lzCath(1),zt:["Biofilm de bactéries","sur un cathéter"],
 extra:()=>lzLL(200,"Apparaît > 48 h après l'admission",1)+lzLL(232,"Mains, asepsie, retrait\ndes dispositifs inutiles",0),pill:"Hygiène des mains : le premier geste de prévention",
 cap:"Friction hydroalcoolique, précautions standard et complémentaires, asepsie des gestes invasifs, réévaluation quotidienne des cathéters et sondes, traçabilité ; déclaration selon la procédure."});
lzIF("nosocomiale",{t:"L'infection est contractée à l'hôpital",sub:"Infection nosocomiale : absente à l'admission, survient après 48 h (30 jours après une chirurgie)",zones:["urinaire","poumons","sang"],cpt:[176,134],
 inner:()=>lzBladder(248,96,{bact:1})+lzP("M248 126 V158","none","#C9B88E",4)+lzP("M248 126 V158","none","#FBF6E8",2),zt:["Sonde urinaire","colonisée"],
 extra:()=>lzLL(200,"Urinaires, pneumopathies,\nsite opératoire, cathéters",1)+lzLL(232,"Germes multirésistants (BMR)",0),pill:"Précautions standard pour chaque patient",
 cap:"Hygiène des mains, gestion des excreta, asepsie, isolement selon le germe, limitation de la durée des dispositifs ; surveillance épidémiologique par l'équipe d'hygiène."});
lzIF("cdiff",{t:"Une bactérie détruit la paroi du côlon",sub:"Clostridioides difficile : profite d'un traitement antibiotique qui a détruit la flore ; diarrhées, colite",zones:["abdomen"],cpt:[156,112],
 inner:()=>lzR(186,34,124,124,0,"#FFF6E8","none")+lzR(186,96,124,62,0,LC.mucosa,"none")+lzR(186,116,124,42,0,"#F7DCD2","none")+[[206,94],[238,92],[272,94],[298,92]].map(([a,b])=>lzE(a,b,13,6,"#F2E2A8","#C9A24E",1)).join("")+lzDots(196,56,108,30,12,5,lzBact)+lzDots(196,60,108,24,6,8,(x,y)=>lzC(x,y,1.8,"#8E6A8F","none")),
 zt:["Fausses membranes jaunes,","toxines (violet)"],
 extra:()=>lzLL(200,"Diarrhée abondante après\nantibiotiques, fièvre",1)+lzLL(232,"Spores résistantes à la\nsolution hydroalcoolique",0),pill:"Lavage des mains au savon + eau de Javel",
 cap:"Précautions contact (chambre seule, tablier, gants), lavage des mains au savon puis friction, désinfection à l'eau de Javel ; arrêt de l'antibiotique en cause, traitement spécifique, réhydratation."});
/* ============ Bactéries ============ */
lzIF("staph",{t:"Le staphylocoque doré forme des abcès",sub:"Staphylocoque doré : vit sur la peau et dans le nez ; abcès, infections de plaies, d'os, de cathéters, du cœur",zones:["peau","os","coeur"],cpt:[103,122],
 inner:()=>lzR(186,34,124,124,0,"#F6DCD6","none")+lzE(248,96,40,30,"#EFD98A","#B83A2E",3)+lzDots(214,72,68,48,10,4,(x,y)=>lzStaph(x,y))+lzDots(214,72,68,48,5,7,(x,y)=>lzWbc(x,y,3.4)),
 zt:["Amas « en grappe »","dans du pus"],
 extra:()=>lzLL(200,"Furoncle, plaie infectée,\nostéite, endocardite",1)+lzLL(232,"SARM : résistant à la\nméticilline",0),pill:"Hygiène des mains ; précautions contact si SARM",
 cap:"Drainage des abcès, antibiotiques selon l'antibiogramme ; SARM : précautions complémentaires contact, décolonisation selon protocole."});
lzIF("strepto",{t:"Le streptocoque forme des chaînettes",sub:"Streptocoque A : angine, scarlatine, érysipèle, infections graves (fasciite) ; complications rhumatismales",zones:["orl","peau"],cpt:[168,32],
 inner:()=>lzR(186,34,124,124,0,"#F6DCD6","none")+lzR(186,96,124,62,0,"#E8857A","none")+lzDots(196,46,104,90,12,5,(x,y,R)=>lzStrep(x,y,R()*180))+lzDots(196,100,104,40,4,7,(x,y)=>lzWbc(x,y,3.6)),
 zt:["Coques en chaînettes","sur la muqueuse"],
 extra:()=>lzLL(200,"Angine, érysipèle, scarlatine",1)+lzLL(232,"Rhumatisme articulaire,\natteinte rénale si non traité",0),pill:"Amoxicilline : traitement complet",
 cap:"Antibiotique (amoxicilline), traitement jusqu'au bout pour prévenir les complications ; formes invasives : urgence, isolement gouttelettes au début."});
lzIF("ecoli",{t:"E. coli s'accroche à la paroi de la vessie",sub:"Escherichia coli : bactérie du tube digestif, première cause d'infection urinaire ; parfois sepsis",zones:["urinaire","abdomen"],cpt:[176,134],
 inner:()=>lzR(186,34,124,124,0,"#FBF2C8","none")+lzR(186,110,124,48,0,"#F0A89A","none")+[...Array(9)].map((_,i)=>lzE(194+i*14,110,6,4,"#F6C3B6","#C9675E",.7)).join("")+lzDots(196,92,108,16,12,5,(x,y,R)=>lzBact(x,y,R)+lzP(`M${x} ${y+1} v4`,"none","#225A2B",.6)),
 zt:["Bacilles qui adhèrent","aux cellules de la vessie"],
 extra:()=>lzLL(200,"Cystite, pyélonéphrite,\nméningite du nouveau-né",1)+lzLL(232,"Souches productrices de\nBLSE : résistantes",0),pill:"ECBU avant antibiotique",
 cap:"ECBU, antibiotique adapté à l'antibiogramme ; BLSE : précautions contact ; prévention : hydratation, hygiène intime d'avant en arrière."});
lzIF("pseudomonas",{t:"Le bacille pyocyanique colonise les milieux humides",sub:"Pseudomonas aeruginosa : plaies, poumons (ventilation, mucoviscidose), sondes ; naturellement très résistant",zones:["poumons","peau"],cpt:[139,72],
 inner:()=>lzR(186,34,124,124,0,"#EAF2E6","none")+lzP("M196 120 C220 100 270 104 300 120 L300 150 L196 150 Z","rgba(90,170,110,.45)","#3E8E4A",1)+lzDots(200,60,100,80,16,5,lzPseudo),
 zt:["Bacilles mobiles,","pus verdâtre, biofilm"],
 extra:()=>lzLL(200,"Pus bleu-vert, odeur sucrée,\npneumopathie sous ventilation",1)+lzLL(232,"Eau des robinets, siphons",0),pill:"Entretien des points d'eau ; asepsie",
 cap:"Antibiotiques actifs selon l'antibiogramme (souvent associés) ; prévention : entretien des siphons, eau filtrée en secteur à risque, soins d'aspiration aseptiques."});
lzIF("enterocoque",{t:"L'entérocoque s'installe sur les voies urinaires ou une valve",sub:"Entérocoque : bactérie de l'intestin ; infections urinaires, endocardites ; certains sont résistants (ERV)",zones:["urinaire","coeur"],cpt:[168,84],
 inner:()=>lzR(186,34,124,124,0,"#FBEFEA","none")+lzP("M200 60 C230 70 260 70 300 58 L300 74 C262 88 230 88 200 76 Z","#F4E8E4","#B9A6A2",1.2)+lzE(250,82,16,9,"#E8D2A8","#B9952E",1)+lzDots(238,76,24,12,8,4,(x,y,R)=>lzDiplo(x,y,R))+lzVesB(8,(x,y,R)=>lzDiplo(x,y,R),{y:100,d:50,rbc:3}),
 zt:["Végétation sur une valve,","bactéries en paires"],
 extra:()=>lzLL(200,"Infection urinaire, endocardite\n(souffle, fièvre prolongée)",1)+lzLL(232,"ERV : précautions renforcées",0),pill:"ERV : dépistage des contacts",
 cap:"Antibiotiques adaptés ; entérocoque résistant à la vancomycine : précautions complémentaires renforcées, personnel dédié, dépistage des patients contacts."});
lzIF("meningocoque",{t:"Le méningocoque envahit le sang et les méninges",sub:"Infection à méningocoque : méningite et purpura fulminans ; l'évolution peut être fatale en quelques heures",zones:["tete","sang"],cpt:[160,16],
 inner:()=>lzVesB(14,(x,y,R)=>lzDiplo(x,y,R),{y:44,d:60})+lzDots(196,116,104,32,14,4,(x,y,R)=>lzC(x,y,2+R()*3,"#8E1A14","none")),zt:["Diplocoques dans le sang,","purpura (taches violettes)"],
 extra:()=>lzLL(200,"Fièvre, raideur de nuque,\ntaches qui ne s'effacent pas",1)+lzLL(232,"Purpura fulminans : antibiotique\ninjecté avant le transport",0),pill:"Purpura + fièvre : antibiotique immédiat, 15",
 cap:"Ceftriaxone dès la suspicion de purpura fulminans, appel du 15, isolement gouttelettes 24 h après le début du traitement, antibioprophylaxie des contacts proches, déclaration obligatoire ; vaccination."});
lzIF("pneumocoque",{t:"Le pneumocoque remplit les alvéoles de pus",sub:"Pneumocoque : première cause de pneumonie, aussi méningite et otite ; risque chez l'âgé, sans rate, immunodéprimé",zones:["poumons","tete"],cpt:[139,72],
 inner:()=>lzR(186,34,124,124,0,"#FBEAE6","none")+[[220,72],[262,66],[296,92],[232,118],[276,126]].map(([a,b],i)=>lzAlv(a,b,19,i%2?"pus":"air",i+2)).join("")+lzDots(208,56,90,90,8,3,(x,y,R)=>lzC(x,y,4.4,"rgba(255,255,255,.5)","#9AA3AB",.6)+lzDiplo(x,y,R)),
 zt:["Alvéoles pleines de pus,","diplocoques encapsulés"],
 extra:()=>lzLL(200,"Fièvre brutale, frissons,\ntoux, douleur thoracique",1)+lzLL(232,"Vaccin recommandé après 65 ans\net chez les personnes à risque",0),pill:"Vaccination antipneumococcique",
 cap:"Antibiotique (amoxicilline), oxygène selon la SpO2, hydratation, kinésithérapie ; vaccination des personnes à risque (âge, asplénie, BPCO, diabète, immunodépression)."});
lzIF("leptospirose",{t:"Une bactérie en spirale entre par la peau",sub:"Leptospirose : urine de rongeurs dans l'eau douce ; atteinte du foie, des reins, hémorragies",zones:["sang","urinaire"],cpt:[103,122],
 inner:()=>lzVesB(12,lzSpiro),zt:["Leptospires (spirales)","dans le sang"],
 extra:()=>lzLL(200,"Fièvre brutale, douleurs musculaires,\nyeux rouges, puis ictère",1)+lzLL(232,"Égoutiers, pêcheurs, baignade\nen eau douce",0),pill:"Protéger les plaies du contact avec l'eau douce",
 cap:"Antibiotiques précoces, surveillance rénale et hépatique ; prévention : gants, bottes, couvrir les plaies, vaccination pour certains métiers."});
/* ============ Virus et parasites ============ */
lzIF("vih",{t:"Le VIH détruit les lymphocytes qui coordonnent les défenses",sub:"VIH : le virus entre dans les lymphocytes T CD4 et s'y multiplie ; sans traitement, le stade sida survient",zones:["sang"],
 inner:()=>lzR(186,34,124,124,0,"#F5EEF8","none")+lzC(240,104,30,"#E7EEFA","#7B8FC0",1.4)+lzC(244,104,20,"#5E6FB0","none")+lzDots(206,48,96,26,6,4,(x,y)=>lzVirus(x,y,3.4,"#C8372D"))+[[268,84],[272,96],[266,122]].map(([a,b])=>lzVirus(a,b,2.6,"#C8372D")).join("")+lzC(290,134,9,"#E5E1DC","#B5ADA5",1,";stroke-dasharray:2 1.5"),
 zt:["Virus qui sort d'un lymphocyte","CD4 et le détruit"],
 extra:()=>lzLL(200,"Charge virale indétectable =\nvirus non transmis (I = I)",1)+lzLL(232,"Transmission : sexuelle, sang,\nmère-enfant",0),pill:"Dépistage ; traitement à vie très efficace",
 cap:"Trithérapie antirétrovirale quotidienne (observance), suivi CD4 et charge virale ; prévention : préservatif, PrEP, traitement post-exposition dans les 48 h après un AES."});
lzIF("rougeole",{t:"Un virus très contagieux provoque une éruption",sub:"Rougeole : transmission par l'air ; fièvre, toux, yeux rouges, puis éruption qui descend de la tête aux pieds",zones:["peau","poumons"],cpt:[103,122],
 inner:()=>lzR(186,34,124,124,0,"#F6D3BB","none")+lzDots(196,44,108,108,22,5,(x,y,R)=>lzE(x,y,5+R()*4,4+R()*3,"rgba(220,70,60,.55)","none"))+lzDots(200,50,100,100,8,8,(x,y)=>lzVirus(x,y,2.4)),
 zt:["Éruption de taches","rouges qui confluent"],
 extra:()=>lzLL(200,"Fièvre élevée, catarrhe,\nsignes de Koplik dans la bouche",1)+lzLL(232,"Pneumonie, encéphalite",0),pill:"Vaccin ROR : 2 doses",
 cap:"Isolement aérien (masque FFP2), éviction ; vaccination ROR à 12 et 16-18 mois ; déclaration obligatoire ; vérifier les contacts fragiles (nourrissons, femmes enceintes, immunodéprimés)."});
lzIF("rubeole",{t:"Un virus bénin, dangereux pour le fœtus",sub:"Rubéole : éruption discrète, ganglions ; pendant la grossesse, malformations graves du bébé",zones:["peau"],cpt:[160,148],
 inner:()=>lzR(186,34,124,124,0,"#EAF5FC","none")+lzC(248,104,40,"#D9EEF9","#8DB3C9",1.2)+lzE(248,110,16,24,"url(#rg-fetus)","#C99A78",1)+lzDots(206,42,90,30,8,4,(x,y)=>lzVirus(x,y,2.6)),
 zt:["Le virus traverse","le placenta"],
 extra:()=>lzLL(200,"Éruption pâle, ganglions\nderrière la nuque",1)+lzLL(232,"Grossesse : sérologie,\nvaccin avant",0),pill:"Vacciner avant la grossesse (ROR)",
 cap:"Pas de traitement spécifique ; vérifier l'immunité des femmes en âge de procréer, vacciner en dehors de la grossesse ; éviter le contact avec les femmes enceintes."});
lzIF("scarlatine",{t:"La toxine du streptocoque colore la peau",sub:"Scarlatine : angine à streptocoque + éruption rouge en « peau de chagrin » et langue framboisée",zones:["orl","peau"],cpt:[168,32],
 inner:()=>lzR(186,34,124,124,0,"#5A1F1C","none")+lzP("M200 158 C200 96 222 70 248 70 C274 70 296 96 296 158 Z","#E8574A","#B23A30",1.2)+lzDots(210,80,76,74,40,5,(x,y)=>lzC(x,y,1.6,"#FFE5E0","none")),
 zt:["Langue framboisée"],
 extra:()=>lzLL(200,"Angine, fièvre, éruption\nrugueuse des plis",1)+lzLL(232,"Desquamation des mains\net des pieds ensuite",0),pill:"Antibiotique ; éviction 24 h",
 cap:"Amoxicilline, antalgiques ; éviction scolaire jusqu'à 24 h après le début des antibiotiques ; surveiller les urines (complication rénale)."});
const lzRing=(x,y)=>lzRbc(x,y,6.4,0)+lzC(x,y,2.2,"none","#5A2C6E",1.1)+lzC(x+1.6,y-1.4,.9,"#5A2C6E","none");
lzIF("paludisme",{t:"Un parasite détruit les globules rouges",sub:"Paludisme : Plasmodium transmis par le moustique anophèle ; passe par le foie puis éclate les globules rouges",zones:["sang"],mosq:1,
 inner:()=>lzArtL(186,58,124,64,7,{rbc:0})+lzDots(196,72,96,36,7,4,(x,y)=>lzRing(x,y))+lzDots(196,70,100,40,5,7,(x,y)=>lzRbc(x,y,5.4,0))+lzDots(270,74,30,30,6,3,(x,y)=>lzC(x,y,1.6,"#5A2C6E","none")),
 zt:["Parasites en anneau dans","les globules rouges"],
 extra:()=>lzLL(200,"Fièvre au retour d'une zone\nd'endémie = paludisme",1)+lzLL(232,"P. falciparum : accès grave,\nneurologique",0),pill:"Fièvre au retour de voyage : frottis en urgence",
 cap:"Frottis-goutte épaisse en urgence, antipaludéens ; formes graves en réanimation ; prévention : répulsifs, moustiquaires, chimioprophylaxie selon la zone."});
lzIF("dengue",{t:"Un virus transmis par le moustique tigre",sub:"Dengue : fièvre, douleurs ; dans les formes graves, les vaisseaux fuient et les plaquettes chutent",zones:["sang"],mosq:1,
 inner:()=>lzVesB(8,(x,y)=>lzVirus(x,y,2.6),{rbc:5})+[[220,128],[262,128]].map(([a,b])=>lzArr(a,b-4,a,b+16,{c:LC.fluidD,w:1.4})).join("")+lzPlt(230,84)+lzPlt(280,96),
 zt:["Virus, peu de plaquettes,","fuite de plasma"],
 extra:()=>lzLL(200,"Fièvre, maux de tête, douleurs\nmusculaires et articulaires",1)+lzLL(232,"Saignements, douleurs du ventre :\nforme sévère",0),pill:"Paracétamol seulement : pas d'aspirine ni d'AINS",
 cap:"Hydratation, paracétamol (pas d'AINS ni d'aspirine : risque hémorragique), surveillance des plaquettes et de l'hématocrite ; lutte contre les gîtes larvaires, répulsifs."});
lzIF("chikungunya",{t:"Un virus qui fait très mal aux articulations",sub:"Chikungunya : transmis par le moustique tigre ; fièvre et douleurs articulaires parfois durables",zones:["articulations"],cpt:[184,190],mosq:1,
 inner:()=>lzJoint({fluid:1,red:1,ex:lzDots(206,90,84,30,8,5,(x,y)=>lzVirus(x,y,2.4))}),zt:["Articulation inflammée","par le virus"],
 extra:()=>lzLL(200,"Fièvre brutale, douleurs des\npoignets, chevilles, doigts",1)+lzLL(232,"Douleurs pendant des mois\nparfois",0),pill:"Antalgiques ; se protéger des piqûres",
 cap:"Paracétamol, repos, puis anti-inflammatoires après exclusion de la dengue ; kinésithérapie si douleurs chroniques ; protection contre les moustiques."});
lzIF("tetanos",{t:"Une toxine bloque le relâchement des muscles",sub:"Tétanos : la bactérie entre par une plaie souillée ; sa toxine empêche les muscles de se relâcher",zones:["tete"],cpt:[160,16],
 inner:()=>lzR(186,34,124,124,0,"#F5EEF6","none")+lzNeuron(220,70,1.1)+lzP("M258 70 C270 76 278 86 284 98","none","#8A63B8",2)+lzR(270,104,36,40,6,"#D9584C","#8E2A22",1)+lzP("M274 112 h28 M274 122 h28 M274 132 h28","none","#8E2A22",1.4)+lzDots(232,96,30,30,10,4,(x,y)=>lzC(x,y,2,"#8E6A8F","none"))+lzP("M236 92 l10 10 M246 92 l-10 10","none",LC.acc,2),
 zt:["La toxine bloque le frein :","muscles contractés"],
 extra:()=>lzLL(200,"Mâchoire bloquée (trismus),\ncontractures, spasmes",1)+lzLL(232,"Plaie souillée : vérifier\nla vaccination",0),pill:"Rappel DTP tous les 20 ans (adulte)",
 cap:"Prévention : vaccination et rappels, sérum et vaccin après une plaie à risque chez une personne mal vaccinée ; le tétanos déclaré se traite en réanimation (calme, sédation)."});
lzIF("rage",{t:"Le virus remonte les nerfs jusqu'au cerveau",sub:"Rage : transmise par morsure ou léchage d'un animal ; une fois les signes apparus, elle est mortelle",zones:["tete"],cpt:[103,122],
 inner:()=>lzR(186,34,124,124,0,"#F5EEF6","none")+lzP("M196 150 C230 130 250 90 290 50","none","#E8C34C",4)+lzP("M196 150 C230 130 250 90 290 50","none","#FFF3C8",1.4)+[[214,138],[236,118],[254,96],[274,70]].map(([a,b])=>lzP(`M${a-3} ${b+2} q3 -6 6 0 v3 h-6 Z`,"#8A63B8","#5A3D8C",.6)).join("")+lzArr(262,82,286,56,{c:"#8A63B8",w:1.6})+lzS(296,48,"cerveau","end"),
 zt:["Virus en « balle »","qui remonte le nerf"],
 extra:()=>lzLL(200,"Morsure : laver 15 min à l'eau\net au savon",1)+lzLL(232,"Consultation antirabique\nen urgence",0),pill:"Vaccination après exposition, sans attendre",
 cap:"Lavage prolongé de la plaie, désinfection, consultation en centre antirabique (vaccination ± immunoglobulines) ; surveillance de l'animal si possible."});
lzIF("candidose",{t:"Une levure prolifère sur les muqueuses",sub:"Candidose : Candida profite des antibiotiques, du diabète, de l'immunodépression ; muguet buccal",zones:["orl","peau"],cpt:[168,32],
 inner:()=>lzR(186,34,124,124,0,"#5A1F1C","none")+lzP("M200 158 C200 96 222 70 248 70 C274 70 296 96 296 158 Z","#E8857A","#B85A4E",1.2)+lzDots(210,80,76,70,12,5,(x,y,R)=>lzE(x,y,6+R()*4,4+R()*2,"#FFFDF4","#D6D0BC",.6)),
 zt:["Plaques blanches","sur la langue (muguet)"],
 extra:()=>lzLL(200,"Plaques blanches qui se\ndétachent, brûlures",1)+lzLL(232,"Nourrisson, personne âgée,\ncorticoïdes inhalés",0),pill:"Soins de bouche ; rincer après corticoïdes inhalés",
 cap:"Antifongique local (bains de bouche) ou oral ; soins de bouche réguliers ; rinçage de la bouche après corticoïdes inhalés ; nettoyer les prothèses dentaires."});
lzIF("aspergillose",{t:"Un champignon envahit le poumon",sub:"Aspergillose : spores inhalées ; dangereuse chez les personnes très immunodéprimées (greffe, leucémie)",zones:["poumons"],cpt:[139,72],
 inner:()=>lzR(186,34,124,124,0,"#FBEAE6","none")+[[218,64],[282,70],[226,128],[286,126]].map(([a,b],i)=>lzAlv(a,b,18,"air",i+3)).join("")+lzC(250,98,22,"#C9D8B4","#5E8240",1.4)+lzDots(234,82,32,32,10,5,lzHypha),
 zt:["Filaments ramifiés","du champignon"],
 extra:()=>lzLL(200,"Fièvre résistante aux antibiotiques\nchez un patient neutropénique",1)+lzLL(232,"Travaux : risque de spores",0),pill:"Chambre protégée (air filtré) en hématologie",
 cap:"Antifongiques ; prévention : chambres à air filtré, protection lors des travaux, pas de plantes ni de fleurs dans la chambre des patients à risque."});
/* ============ Immunologie ============ */
lzIF("dip",{t:"Les défenses naissent incomplètes",sub:"Déficits immunitaires primitifs : maladies génétiques ; anticorps ou lymphocytes manquent dès l'enfance",zones:["sang"],
 inner:()=>lzVesB(10,lzBact,{rbc:6})+lzLymph(220,86,6)+lzDots(196,70,104,40,3,4,(x,y)=>lzY(x,y,"#2F5FB8")),zt:["Peu de lymphocytes et","d'anticorps face aux microbes"],
 extra:()=>lzLL(200,"Infections répétées, graves,\ninhabituelles",1)+lzLL(232,"Enfant : retard de croissance",0),pill:"Prévenir les infections ; pas de vaccins vivants",
 cap:"Immunoglobulines en perfusion ou sous-cutanées, antibiotiques préventifs, greffe de moelle pour certains ; pas de vaccins vivants ; éducation aux signes d'infection."});
lzIF("dia",{t:"Les défenses s'affaiblissent au cours de la vie",sub:"Déficits immunitaires acquis : VIH, chimiothérapie, corticoïdes, immunosuppresseurs, dénutrition, âge",zones:["sang"],
 inner:()=>lzVesB(10,lzBact,{rbc:6})+lzNeut(230,90,7)+lzC(270,104,6,"#E5E1DC","#B5ADA5",1,";stroke-dasharray:2 1.5"),zt:["Globules blancs rares ou","inefficaces"],
 extra:()=>lzLL(200,"Infections opportunistes,\nfièvre parfois seul signe",1)+lzLL(232,"Corticoïdes, chimio, greffe,\nVIH, dénutrition",0),pill:"Fièvre chez un immunodéprimé = urgence",
 cap:"Hygiène des mains, alimentation adaptée, vaccinations (vaccins vivants contre-indiqués selon le cas), surveillance de la température, isolement protecteur si neutropénie."});
lzSK("sclerodermie",{t:"La peau et les organes durcissent",sub:"Sclérodermie systémique : excès de collagène (fibrose) et petits vaisseaux abîmés (syndrome de Raynaud)",dc:"#F1D5C8",vess:false,foll:false,
 ex:g=>[0,1,2,3,4,5,6].map(i=>lzP(`M10 ${84+i*9} H198`,"none","#FFFFFF",3.4)).join("")+lzP("M10 132 H198","none",LC.bloodD,2.4)+lzP("M10 132 H198","none",LC.blood,1)+lzC(100,132,4,"none",LC.acc,1.4),
 labT:LB(10,20,"Peau épaisse, tendue,\ndoigts boudinés",1,"start",90,50),
 lab:[[114,"Collagène\nen excès",1,120,100],[160,"Petits vaisseaux\nrétrécis",0,100,132]],
 where:[[-28,80,5],[28,80,5],[0,4,5],[0,40,4]],whereT:"mains, visage",pill:"Protéger les mains du froid",
 cap:"Syndrome de Raynaud (doigts blancs puis bleus au froid), ulcères digitaux, reflux, atteinte des poumons et des reins ; gants, arrêt du tabac, soins des ulcères, kinésithérapie, surveillance de la tension."});
lzBF("vascularites",{t:"La paroi des vaisseaux s'enflamme",sub:"Vascularites : maladie de Horton, granulomatose… ; les globules blancs attaquent la paroi, qui s'épaissit ou se bouche",norm:false,
 cells:b=>lzFill(b.x,b.y,b.w,b.h,10,4,(x,y,R)=>lzRbcN(x,y,R)),
 wall:()=>lzR(10,36,206,12,0,"rgba(232,80,60,.45)","none")+lzR(10,136,206,12,0,"rgba(232,80,60,.45)","none")+lzDots(14,36,200,12,10,5,(x,y)=>lzWbc(x,y,3.4))+lzDots(14,136,200,12,10,7,(x,y)=>lzWbc(x,y,3.4)),
 bottomT:"Exemple : maladie de Horton (après 50 ans)",bottom:()=>lzS(14,196,"maux de tête, artère temporale douloureuse,\ndouleur en mâchant, risque de cécité","start"),
 lab:[[60,"Globules blancs\ndans la paroi",1,120,40],[110,"Paroi épaissie :\nle sang passe mal",1,180,140],[160,"Organes privés de\nsang (œil, rein…)",0]],
 pill:"Horton : corticoïdes sans attendre (risque de cécité)",
 cap:"Corticoïdes à forte dose puis décroissance lente (surveiller glycémie, tension, os, humeur), immunosuppresseurs selon la maladie ; bilan des organes atteints."});
