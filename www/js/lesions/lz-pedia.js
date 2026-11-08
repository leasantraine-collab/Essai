/* Carnet IFSI — schémas des lésions : pédiatrie, oncologie et gériatrie (33 pathologies). */
const lzMpN2=(x,y)=>[lzN(-6+x*.6),lzN(20+y*.6)];
const lzNF2=(id,o)=>lzZF(id,Object.assign({left:()=>lzOrg("cerveau",o.zones||[],-6,20,.6),pt:lzMpN2(...(o.npt||[100,86])),bg:"#F5EEF6"},o));
const lzPF2=(id,o)=>lzZF(id,Object.assign({left:()=>lzOrg("poumons",o.zones||[],-10,22,.62),pt:lzMpP(...(o.ppt||[104,152])),bg:"#FBEAE6"},o));
/* tube digestif en coupe longitudinale dans la loupe */
const lzGut=(y,d,c="url(#rg-intest)",o={})=>lzP(`M186 ${y} H310`,"none","#C98E6C",d+3)+lzP(`M186 ${y} H310`,"none",c,d)+lzP(`M186 ${y} H310`,"none",o.lum||"#FBF2DC",Math.max(2,d-10));
/* ============ Pédiatrie ============ */
lzEF2("rhinopharyngite",{t:"Un virus enflamme le nez et la gorge",sub:"Rhinopharyngite : l'infection la plus fréquente du jeune enfant ; virale, elle guérit seule en 7 à 10 jours",zones:["nez","sinus"],ept:[108,84],
 inner:()=>lzMucosa({swell:1,red:1})+lzDots(200,40,100,20,7,4,(x,y)=>lzVirus(x,y,2.6)),zt:["Muqueuse gonflée, mucus,","virus"],
 extra:()=>lzLL(200,"Nez qui coule, fièvre modérée,\ntoux, gêne pour téter",1)+lzLL(232,"Lavages de nez avant les biberons",0),pill:"Lavages de nez ; pas d'antibiotique",
 cap:"Lavages au sérum physiologique, mouchage, paracétamol si fièvre mal tolérée, fractionner les repas ; consulter si gêne respiratoire, otite, fièvre au-delà de 3 jours ou nourrisson de moins de 3 mois."});
lzIF("deshydratation-enfant",{t:"L'enfant perd plus d'eau qu'il n'en reçoit",sub:"Déshydratation aiguë : gastro-entérite surtout ; le nourrisson est très vulnérable (75 % d'eau)",zones:["sang","urinaire"],
 inner:()=>lzArtL(186,74,124,34,6,{rbc:3,seed:4})+[[220,138],[268,138]].map(([a,b])=>lzE(a,b,14,9,"#F3D9E9","#9C5C86",1)+lzE(a,b,8,5,"#E7C3DA","none")).join("")+lzDots(206,44,90,20,5,4,(x,y)=>lzP(`M${x} ${y} q2 4 0 6 q-2 -2 0 -6`,"#9CCDEB","#3D8CC0",.6)),
 zt:["Vaisseaux et cellules","qui manquent d'eau"],
 extra:()=>lzLL(200,"Perte de poids, fontanelle creusée,\nyeux cernés, pli cutané, urines rares",1)+lzLL(232,"Somnolence, marbrures : urgence",0),pill:"Soluté de réhydratation orale par petites gorgées",
 cap:"SRO en petites quantités fréquentes, pesée, surveillance des selles, vomissements, diurèse, conscience ; perte de poids > 10 % ou troubles de conscience : hospitalisation (perfusion)."});
lzNF2("convulsions-febriles",{t:"La fièvre déclenche une décharge dans le cerveau",sub:"Convulsions fébriles : entre 6 mois et 5 ans, lors d'une montée de fièvre ; le plus souvent bénignes",zones:["frontal","parietal"],npt:[160,90],
 inner:()=>lzR(186,34,124,124,0,"#F5EEF6","none")+lzNeuron(222,96,1.2)+lzNeuron(276,110,1)+lzP("M246 50 l-10 22 h10 l-8 22","none","#F2B705",3)+lzR(282,44,10,52,5,"#FFFFFF","#56626E",1)+lzC(287,100,7,"#C8372D","#56626E",1)+lzR(285,54,4,44,2,"#C8372D","none"),
 zt:["Montée de fièvre :","décharge des neurones"],
 extra:()=>lzLL(200,"Raideur puis secousses, moins\nde 15 min, récupération",1)+lzLL(232,"Rechercher une méningite\nsi doute",0),pill:"PLS, protéger la tête, noter la durée",
 cap:"Pendant la crise : protéger des chocs, PLS, ne rien mettre dans la bouche, noter la durée ; crise > 5 min : traitement prescrit (midazolam buccal), appel du 15 ; rassurer les parents."});
lzDF("rgo-nourrisson",{t:"Le lait remonte dans l'œsophage",sub:"Reflux du nourrisson : le sphincter entre œsophage et estomac est encore immature ; régresse vers 12 à 18 mois",zones:["oesophage","estomac"],dpt:[166,34],
 inner:()=>lzR(186,34,124,124,0,"#FFF6E8","none")+lzP("M236 34 V96","none","#E9A79D",20)+lzP("M236 34 V96","none","#FBF2DC",10)+lzP("M226 96 C210 110 214 150 250 152 C290 154 304 120 290 96 C278 80 250 84 246 96 Z","url(#rg-stomach)","#C98E6C",1.2)+lzP("M228 110 C240 108 270 108 290 112 L292 140 C270 148 236 148 224 138 Z","#FFFDF0","none")
  +lzArr(236,104,236,52,{c:"#B98B14",w:2.4})+lzC(236,96,8,"none",LC.acc,1.4,";stroke-dasharray:2 2"),
 zt:["Sphincter immature :","le lait remonte"],
 extra:()=>lzLL(200,"Régurgitations sans gêne :\nnormal, bébé qui grossit",0)+lzLL(232,"Pleurs, refus du biberon,\ncassure de poids : consulter",1),pill:"Couché sur le dos ; épaissir le lait si besoin",
 cap:"Rassurer, fractionner les repas, épaissir le lait sur avis, ne pas surélever ni coucher sur le ventre (risque de mort subite) ; traitement seulement si œsophagite."});
lzDF("stenose-pylore",{t:"Le muscle du pylore s'épaissit et ferme la sortie de l'estomac",sub:"Sténose du pylore : nourrisson de 3 à 6 semaines, garçon surtout ; vomissements en jet",zones:["estomac"],dpt:[208,92],
 inner:()=>lzR(186,34,124,124,0,"#FFF6E8","none")+lzP("M186 70 C210 60 230 66 240 80 L240 116 C230 130 210 136 186 128 Z","url(#rg-stomach)","#C98E6C",1.2)+lzE(266,98,28,20,"#E8A99C","#A8695E",1.6)+lzP("M240 98 H310","none","#FBF2DC",2)+lzP("M296 98 H310","none","url(#rg-intest)",12),
 zt:["Olive pylorique : muscle","épais, passage minuscule"],
 extra:()=>lzLL(200,"Vomissements en jet après\nchaque biberon, bébé affamé",1)+lzLL(232,"Déshydratation, perte de poids",0),pill:"Chirurgie (pylorotomie) après réhydratation",
 cap:"Échographie ; réhydratation et correction des troubles ioniques avant l'opération ; pylorotomie, reprise rapide de l'alimentation."});
lzDF("iia",{t:"Un segment d'intestin rentre dans le suivant",sub:"Invagination intestinale aiguë : nourrisson de 2 mois à 2 ans ; l'intestin se télescope comme une longue-vue",zones:["grele","colon"],dpt:[104,214],
 inner:()=>lzR(186,34,124,124,0,"#FFF6E8","none")+lzP("M186 98 H240","none","url(#rg-intest)",22)+lzP("M236 98 H310","none","url(#rg-colon)",40)+lzP("M236 98 H286","none","#C9675A",22)+lzP("M236 98 H286","none","#FBF2DC",8)+lzE(286,98,6,11,"#C9675A","#8E3A30",1)+lzP("M240 78 C260 72 278 72 290 78 M240 118 C260 124 278 124 290 118","none","#7E1A14",1.4,";stroke-dasharray:3 2"),
 zt:["Boudin : l'intestin","pénètre dans le côlon"],
 extra:()=>lzLL(200,"Crises de pleurs avec pâleur,\nrefus du biberon, vomissements",1)+lzLL(232,"Sang dans les selles\n(gelée de groseille)",0),pill:"Urgence : échographie, lavement de désinvagination",
 cap:"Échographie en urgence, désinvagination par lavement sous contrôle, chirurgie si échec ; surveillance de la récidive, de la douleur et de l'état général."});
lzDF("hirschsprung",{t:"Une partie du côlon n'a pas de nerfs et ne pousse pas",sub:"Maladie de Hirschsprung : absence de cellules nerveuses dans le dernier segment du côlon ; occlusion",zones:["colon","rectum"],dpt:[166,224],
 inner:()=>lzR(186,34,124,124,0,"#FFF6E8","none")+lzP("M186 98 C220 98 238 98 252 98","none","url(#rg-colon)",54)+lzP("M186 98 C220 98 238 98 252 98","none","#B98A5A",36)+lzP("M252 98 H310","none","url(#rg-colon)",16)+lzP("M252 98 H310","none","#FBF2DC",4)
  +lzDots(196,70,50,8,5,4,(x,y)=>lzNeuron(x,y,.35))+lzP("M260 80 l8 8 M268 80 l-8 8","none",LC.acc,1.6),
 zt:["Segment sans nerfs (étroit),","côlon dilaté au-dessus"],
 extra:()=>lzLL(200,"Retard d'émission du méconium,\nconstipation, ventre gonflé",1)+lzLL(232,"Biopsie rectale",0),pill:"Chirurgie : retrait du segment malade",
 cap:"Nursing (sonde rectale), surveillance de l'entérocolite (fièvre, diarrhée), chirurgie d'abaissement ; suivi du transit."});
lzDF("atresie-oesophage",{t:"L'œsophage s'arrête en cul-de-sac",sub:"Atrésie de l'œsophage : malformation ; le bébé ne peut pas avaler, souvent avec une fistule vers la trachée",zones:["oesophage"],dpt:[166,34],
 inner:()=>lzR(186,34,124,124,0,"#FFF6E8","none")+lzP("M276 34 V158","none","#DCE6EC",16)+[...Array(10)].map((_,i)=>lzP(`M268 ${40+i*12} h16`,"none","#B7C7D2",2)).join("")
  +lzP("M232 34 V80","none","#E9A79D",20)+lzP("M232 34 V80","none","#FBF2DC",10)+lzE(232,82,10,6,"#E9A79D","none")+lzP("M232 112 V158","none","#E9A79D",18)+lzP("M232 112 V158","none","#FBF2DC",8)+lzP("M236 114 C250 110 260 106 270 100","none","#E9A79D",6),
 zt:["Cul-de-sac en haut, fistule","du bas vers la trachée"],
 extra:()=>lzLL(200,"Salive abondante, toux et cyanose\nà la tétée",1)+lzLL(232,"Test : sonde qui bute",0),pill:"Rien par la bouche ; aspiration du cul-de-sac",
 cap:"Ne pas alimenter, proclive, aspiration continue du cul-de-sac ; chirurgie néonatale ; après : surveillance des sténoses et du reflux."});
lzZF("ictere-neonatal",{t:"La bilirubine s'accumule chez le nouveau-né",sub:"Ictère néonatal : globules rouges en excès qui se détruisent et foie encore immature ; le plus souvent bénin",pt:[102,80],bg:"#FFF8DC",
 left:()=>lzOrg("digestif",["foie"],-8,18,.62),
 inner:()=>lzArtL(186,46,124,56,6,{rbc:0,plasma:"#FBEFB8"})+lzDots(196,56,108,36,6,4,(x,y)=>lzRbc(x,y,5,0))+lzDots(196,56,108,36,7,8,lzSchisto)+lzDots(196,56,108,36,22,6,(x,y)=>lzC(x,y,1.6,"#E8B30C","none"))
  +lzP("M200 116 C226 106 270 108 296 120 C300 140 280 152 248 152 C214 152 196 140 200 116 Z","url(#rg-liver)","#5A1F17",1)+lzS(248,140,"foie immature","middle"),
 zt:["Bilirubine (jaune) que le foie","n'élimine pas assez vite"],
 extra:()=>lzLL(200,"Peau et yeux jaunes après 24 h,\nbébé qui tète bien",0)+lzLL(232,"Ictère < 24 h, bébé mou :\nalerte",1),pill:"Photothérapie : yeux protégés, hydratation",
 cap:"Mesure transcutanée ou sanguine de la bilirubine ; photothérapie (lunettes, retournements, température, hydratation, tétées fréquentes) ; ictère précoce ou intense : risque neurologique (ictère nucléaire)."});
lzPF2("detresse-neonatale",{t:"Les alvéoles du nouveau-né s'affaissent",sub:"Détresse respiratoire : prématuré (manque de surfactant), inhalation de liquide, infection",zones:["alveoles"],ppt:[268,176],
 inner:()=>lzR(186,34,124,124,0,"#FBEAE6","none")+[[220,70],[270,66],[300,104],[230,120],[278,130]].map(([a,b],i)=>i%2?lzAlv(a,b,16,"air",i+2):lzE(a,b,16,5,"#F6D0C8","#E7A39A",1.6)).join(""),
 zt:["Sans surfactant, les alvéoles","se collent (aplaties)"],
 extra:()=>lzLL(200,"Tirage, battement des ailes du nez,\ngeignement, cyanose",1)+lzLL(232,"Score de Silverman",0),pill:"Surfactant, ventilation, oxygène surveillé",
 cap:"Prévention par corticoïdes anténatals, surfactant intratrachéal, CPAP, oxygène à dose contrôlée (rétinopathie) ; surveillance SpO2, FR, signes de lutte, température."});
lzZF("prematurite",{t:"Les organes du bébé ne sont pas encore prêts",sub:"Prématurité : naissance avant 37 SA ; plus elle est précoce, plus les organes sont immatures",pt:[200,108],bg:"#FBEFEA",
 left:()=>lzOrg("grossesse",["foetus"],-8,18,.62),
 inner:()=>[["poumons",218,62],["cerveau",278,62],["intestin",206,104],["chaleur",290,104],["yeux",232,142],["infections",270,142]].map(([t,a,b])=>lzC(a,b,17,"#EAF5FC","#3D8CC0",1.2)+lzS(a,b+3,t,"middle","st-b")).join("")+lzE(248,100,10,13,"url(#rg-fetus)","#C99A78",1),
 zt:["Chaque organe","immature est fragile"],
 extra:()=>lzLL(200,"Détresse respiratoire, hémorragie\ncérébrale, entérocolite",1)+lzLL(232,"Hypothermie, hypoglycémie,\ninfections",0),pill:"Couveuse, peau à peau, lait maternel",
 cap:"Prise en charge en néonatologie : incubateur, soins de développement (lumière, bruit, positionnement), peau à peau, lait maternel, prévention des infections ; accompagnement des parents."});
lz("retard-croissance",{t:"La courbe de croissance décroche",sub:"Retard de croissance : taille ou poids qui s'éloignent de la courbe habituelle de l'enfant",h:262,ins:false,
 cap:"Reporter poids et taille sur les courbes du carnet de santé à chaque visite ; une cassure de la courbe fait rechercher une cause (alimentation, maladie digestive, hormonale, psychosociale).",
 draw:()=>{let s=lzR(30,30,240,170,8,"#FBFBF8","#D3DCE4",1)+[0,1,2,3,4,5].map(i=>lzP(`M${30+i*48} 30 V200`,"none","#EEF2F5",1)).join("");
  [[.9,"#E1EBF3"],[.6,"#C9DCEC"],[.3,"#E1EBF3"]].forEach(([k,c])=>{s+=lzP(`M30 ${lzN(190-k*30)} C110 ${lzN(140-k*60)} 190 ${lzN(110-k*70)} 270 ${lzN(96-k*70)}`,"none","#9CC0E4",1.4);});
  s+=lzP("M30 172 C80 140 120 120 150 108 C180 104 210 112 270 120","none",LC.acc,3)+lzC(150,108,5,LC.acc,"none")+lzS(150,214,"âge","middle")+lzS(22,120,"taille","end")
   +lzLR(80,"Courbes normales\n(couloirs)",0,248,40)+lzLR(140,"Cassure de la\ncourbe : alerte",1,180,110)+lzPill(160,250,"Mesurer et reporter à chaque consultation",LC.acc);
  return s;}});
lzNF2("tsa",{t:"Le cerveau se développe et communique autrement",sub:"Trouble du spectre de l'autisme : différences du développement des réseaux du cerveau (communication, interactions, intérêts)",zones:["frontal","temporal"],npt:[140,140],
 inner:()=>lzR(186,34,124,124,0,"#F5EEF6","none")+[[214,64],[254,54],[290,76],[222,112],[268,104],[244,142],[294,130]].map(([a,b])=>lzC(a,b,7,"#C9A9D6","#8A63B8",1)).join("")+lzP("M214 64 L254 54 L290 76 M222 112 L268 104 L294 130 M254 54 L268 104","none","#8A63B8",1.6)+lzP("M214 64 L222 112 M244 142 L268 104","none","#8A63B8",1,";stroke-dasharray:3 3"),
 zt:["Connexions organisées","différemment"],
 extra:()=>lzLL(200,"Communication sociale, intérêts\nrestreints, sensibilité sensorielle",1)+lzLL(232,"Repérage précoce, pas de cause\nliée à l'éducation",0),pill:"Prévoir, calmer, communiquer simplement",
 cap:"Diagnostic pluridisciplinaire, interventions précoces (éducatives, orthophonie, psychomotricité) ; à l'hôpital : préparer les soins, pictogrammes, limiter le bruit et les attentes, s'appuyer sur les parents."});
lzNF2("tdah",{t:"Le cerveau régule moins bien l'attention et l'impulsivité",sub:"TDAH : trouble du neurodéveloppement ; les circuits frontaux de contrôle (dopamine) fonctionnent différemment",zones:["frontal"],npt:[100,86],
 inner:()=>lzR(186,34,124,124,0,"#F5EEF6","none")+lzNeuron(220,90,1.2)+lzNeuron(276,104,1.2,{dopa:4})+lzDots(244,82,22,22,4,5,(x,y)=>lzC(x,y,1.6,"#F2B705","none")),
 zt:["Moins de dopamine","dans les circuits de contrôle"],
 extra:()=>lzLL(200,"Inattention, agitation,\nimpulsivité",1)+lzLL(232,"Retentissement scolaire,\nfamilial, estime de soi",0),pill:"Consignes courtes, une à la fois",
 cap:"Prise en charge psychoéducative, aménagements scolaires, parfois méthylphénidate (suivi poids, tension, sommeil, appétit) ; valoriser l'enfant."});
lzNF2("paralysie-cerebrale",{t:"Une lésion du cerveau en développement touche la motricité",sub:"Paralysie cérébrale : lésion avant, pendant ou peu après la naissance (prématurité, manque d'oxygène) ; non évolutive",zones:["frontal","parietal"],npt:[160,100],
 inner:()=>lzR(186,34,124,124,0,"#F5EEF6","none")+lzP("M200 96 C200 56 230 40 248 40 C266 40 296 56 296 96 C296 136 266 152 248 152 C230 152 200 136 200 96 Z","url(#rg-brain)","#C9A49A",1.2)+lzE(232,96,8,18,"#DCEBF3","#8DB3C9",1)+lzE(264,96,8,18,"#DCEBF3","#8DB3C9",1)+lzDots(222,74,52,44,10,4,(x,y)=>lzC(x,y,2.8,"#F4F1E8","#9AA3AB",.6)),
 zt:["Lésions de la substance","blanche autour des ventricules"],
 extra:()=>lzLL(200,"Raideur (spasticité), troubles\nde la posture et du mouvement",1)+lzLL(232,"Parfois épilepsie, troubles\nvisuels ou de la déglutition",0),pill:"Rééducation, appareillage, prévention des douleurs",
 cap:"Kinésithérapie, appareillage, traitement de la spasticité, surveillance de la déglutition (fausses routes), installation et prévention des escarres et des douleurs."});
/* ============ Oncologie ============ */
lzRF("cancer-prostate",{t:"Une tumeur se développe dans la prostate",sub:"Cancer de la prostate : le plus fréquent chez l'homme ; souvent lent, découvert par le PSA ou le toucher rectal",zones:["prostate"],pt:[174,212],
 inner:()=>lzBladder(248,84,{prost:1.2})+lzC(262,122,8,"#8E6A8F","#5A3D5C",1),zt:["Nodule dur dans","la prostate"],
 extra:()=>lzLL(196,"Souvent sans symptôme ;\nmétastases osseuses possibles",1),pill:"Après prostatectomie : rééducation périnéale",
 cap:"Surveillance active, chirurgie, radiothérapie, hormonothérapie ; effets : incontinence, troubles érectiles, bouffées de chaleur ; accompagnement de la sexualité."});
lzGF("cancer-foie",{t:"Une tumeur naît dans le foie malade",sub:"Carcinome hépatocellulaire : survient presque toujours sur une cirrhose (alcool, hépatites B et C)",zones:["foie"],pt:[108,80],
 inner:()=>lzR(186,34,124,124,0,"url(#rg-liver)","none")+lzDots(194,40,112,112,14,5,(x,y)=>lzC(x,y,7,"#C9775F","#7A3A2C",.8))+lzP("M230 74 C248 62 276 70 280 92 C284 116 262 128 244 124 C222 120 214 92 230 74 Z","#E8D8A0","#8E6A3E",1.4)+lzDots(234,80,40,36,6,4,(x,y)=>lzC(x,y,3,"#C9A24E","none")),
 zt:["Nodule tumoral","dans un foie cirrhotique"],
 extra:()=>lzLL(196,"Dépistage : échographie tous\nles 6 mois si cirrhose",1),pill:"Cirrhose : échographie tous les 6 mois",
 cap:"Chirurgie, destruction locale, chimio-embolisation, transplantation ou thérapies ciblées selon le stade ; surveiller ascite, ictère, encéphalopathie, saignements."});
lzGF("cancer-voies-biliaires",{t:"Une tumeur bouche les canaux de la bile",sub:"Cholangiocarcinome : la bile ne s'écoule plus vers l'intestin ; ictère sans douleur",zones:["vesicule","foie"],pt:[132,106],
 inner:()=>lzR(186,34,124,124,0,"#FFF6E8","none")+lzP("M200 50 C230 70 244 90 248 110 M300 50 C270 70 254 90 248 110","none","#7BA05B",10)+lzP("M248 110 V158","none","#7BA05B",8)+lzE(248,112,12,10,"#8E6A8F","#5A3D5C",1.2)+lzP("M200 50 C230 70 244 90 248 110 M300 50 C270 70 254 90 248 110","none","#C9E0A8",4),
 zt:["Tumeur qui obstrue","le canal biliaire"],
 extra:()=>lzLL(196,"Ictère, urines foncées, selles\ndécolorées, démangeaisons",1),pill:"Prothèse biliaire pour lever l'obstacle",
 cap:"Drainage biliaire (prothèse par endoscopie), chirurgie si possible, chimiothérapie ; soins du prurit, nutrition, surveillance de l'angiocholite (fièvre, frissons)."});
lzSF("cancer-os",{t:"Une tumeur maligne naît dans l'os",sub:"Ostéosarcome : adolescent et adulte jeune, souvent près du genou ; douleur qui réveille la nuit",zones:["genou","epaule"],spt:[178,198],
 inner:()=>lzR(186,34,124,124,0,"#F6E3DA","none")+lzP("M228 34 L228 104 C228 124 236 136 248 136 C260 136 268 124 268 104 L268 34 Z","url(#rg-bone)","#C9B88E",1.2)+lzP("M226 70 C206 74 200 100 214 118 C226 128 240 120 244 104 C244 90 238 74 226 70 Z","#8E6A8F","#5A3D5C",1.2)+lzP("M216 76 l-10 -6 M210 92 l-12 0 M214 110 l-10 6","none","#5A3D5C",1.4),
 zt:["Tumeur qui détruit l'os","et sort dans les tissus"],
 extra:()=>lzLL(200,"Douleur nocturne, gonflement,\nfracture possible",1)+lzLL(232,"Chimiothérapie + chirurgie",0),pill:"Douleur osseuse persistante d'un jeune : imagerie",
 cap:"Chimiothérapie puis chirurgie conservatrice (prothèse) ou amputation ; soutien psychologique de l'adolescent et de la famille, préservation de la fertilité."});
lzSF("metastases-osseuses",{t:"Le cancer essaime dans les os",sub:"Métastases osseuses : sein, prostate, poumon, rein, thyroïde ; douleurs, fractures, compression de la moelle",zones:["rachis","bassin"],spt:[160,88],
 inner:()=>lzSpine({})+lzE(222,56,14,10,"#8E6A8F","#5A3D5C",1.2)+lzE(230,128,12,9,"#8E6A8F","#5A3D5C",1.2)+lzC(266,58,8,"none",LC.acc,1.6,";stroke-dasharray:3 2"),
 zt:["Lésions dans les vertèbres","qui fragilisent l'os"],
 extra:()=>lzLL(200,"Douleur, hypercalcémie,\nfracture pathologique",1)+lzLL(232,"Faiblesse des jambes, troubles\nurinaires : compression",0),pill:"Déficit des jambes : urgence (compression médullaire)",
 cap:"Antalgiques (dont radiothérapie antalgique), bisphosphonates, prévention des fractures, surveillance neurologique et de la calcémie ; mobilisation prudente."});
lzNF2("metastases-cerebrales",{t:"Le cancer essaime dans le cerveau",sub:"Métastases cérébrales : poumon, sein, mélanome, rein ; lésions entourées d'œdème",zones:["frontal","parietal"],npt:[160,90],
 inner:()=>lzR(186,34,124,124,0,"url(#rg-brain)","none")+[[226,70],[276,112]].map(([a,b])=>lzC(a,b,22,"rgba(156,205,235,.45)","none")+lzC(a,b,12,"#8E6A8F","#5A3D5C",1.2)).join(""),
 zt:["Nodules tumoraux entourés","d'œdème (bleu)"],
 extra:()=>lzLL(200,"Maux de tête, crises d'épilepsie,\ndéficit, troubles du comportement",1)+lzLL(232,"Signes d'HTIC : alerte",0),pill:"Corticoïdes contre l'œdème ; surveiller la conscience",
 cap:"Corticoïdes, antiépileptiques si crises, radiothérapie ou chirurgie ; surveiller conscience, céphalées, vomissements, glycémie sous corticoïdes ; sécurité (chutes)."});
lzGF("metastases-hepatiques",{t:"Le cancer essaime dans le foie",sub:"Métastases hépatiques : surtout côlon, pancréas, sein, poumon ; plusieurs nodules dans le foie",zones:["foie"],pt:[108,80],
 inner:()=>lzR(186,34,124,124,0,"url(#rg-liver)","none")+[[218,64,12],[262,58,9],[290,96,14],[230,112,16],[272,138,10]].map(([a,b,r])=>lzC(a,b,r,"#E8D8C0","#8E6A3E",1.2)+lzC(a,b,r*.35,"#C9A87E","none")).join(""),
 zt:["Plusieurs nodules","dans le foie"],
 extra:()=>lzLL(196,"Souvent découvertes au bilan ;\nictère, ascite si nombreuses",1),pill:"Chirurgie possible si peu nombreuses",
 cap:"Chimiothérapie, chirurgie ou destruction locale selon le nombre ; surveillance de la fonction hépatique, de la douleur, de l'état nutritionnel."});
lzRF("lyse-tumorale",{t:"Les cellules tumorales éclatent et libèrent leur contenu",sub:"Syndrome de lyse tumorale : au début d'une chimiothérapie (leucémies, lymphomes) ; potassium, phosphore et acide urique montent",zones:["reins"],pt:[80,92],
 inner:()=>lzR(186,34,124,124,0,"#F5EEF6","none")+[[214,60],[254,52],[292,70]].map(([a,b])=>lzC(a,b,12,"#E6DFF3","#6A55A0",1,";stroke-dasharray:3 2")+lzDots(a-10,b+8,20,20,6,a,(x,y)=>lzC(x,y,1.6,"#E8893A","none"))).join("")
  +lzP("M200 128 C230 116 270 116 300 128","none","#E9B8A8",14)+lzDots(220,118,60,14,10,4,(x,y,R)=>lzP(`M${lzN(x)} ${lzN(y)} l${lzN(4+R()*3)} ${lzN(-2-R()*2)}`,"none","#F4F1E8",2))+lzS(248,96,"K+   P   acide urique","middle","st-b"),
 zt:["Contenu des cellules qui","bouche les tubules du rein"],
 extra:()=>lzLL(204,"Hyperkaliémie, insuffisance rénale,\ntroubles du rythme",1),pill:"Hydratation, rasburicase, bilan biologique répété",
 cap:"Prévention : hyperhydratation, hypo-uricémiants, surveillance de la diurèse, du poids, de la kaliémie, du phosphore et de la créatinine plusieurs fois par jour au début du traitement."});
lzZF("syndrome-cave-superieur",{t:"Une tumeur écrase la veine cave supérieure",sub:"Syndrome cave supérieur : cancer du poumon ou lymphome du médiastin ; le sang de la tête et des bras ne redescend plus",pt:[111,36],bg:"#EEF1FA",
 left:()=>lzOrg("coeur",["veines"],-8,14,.62),
 inner:()=>lzR(186,34,124,124,0,"#EEF1FA","none")+lzP("M236 34 V158","none",LC.veinD,28)+lzP("M236 34 V158","none","#7486C9",22)+lzP("M236 96 l0 0","none","none",1)+lzE(268,96,30,26,"#8E6A8F","#5A3D5C",1.4)+lzP("M236 80 C246 90 246 102 236 112","none","#EEF1FA",18)+lzArr(236,40,236,74,{c:LC.veinD,w:1.6}),
 zt:["Veine comprimée :","le sang stagne en haut"],
 extra:()=>lzLL(200,"Visage gonflé et rouge, cou\nélargi, veines visibles",1)+lzLL(232,"Pas de perfusion aux bras ;\nposition demi-assise",0),pill:"Demi-assis ; perfusions au membre inférieur",
 cap:"Position demi-assise, oxygène, corticoïdes, pose de stent veineux, traitement de la tumeur ; éviter les ponctions et perfusions aux membres supérieurs."});
/* ============ Gériatrie ============ */
lzNF2("confusion-aigue",{t:"Le cerveau fragile décompense brutalement",sub:"Syndrome confusionnel : chez la personne âgée, une cause souvent simple (infection, médicament, globe, fécalome)",zones:["frontal"],npt:[100,86],
 inner:()=>lzR(186,34,124,124,0,"#F5EEF6","none")+lzC(248,96,16,"url(#rg-brain)","#C9A49A",1)+[["infection",214,54],["médicament",284,56],["globe",204,104],["fécalome",292,104],["douleur",222,144],["eau",274,144]].map(([t,a,b])=>lzC(a,b,15,"#FBE3DE","#C8372D",1)+lzS(a,b+3,t,"middle","st-b")).join(""),
 zt:["Rechercher la ou les causes","autour du cerveau fragile"],
 extra:()=>lzLL(200,"Début brutal, attention perturbée,\nfluctue, agitation ou somnolence",1)+lzLL(232,"Différent de la démence\n(installation lente)",0),pill:"Chercher la cause ; rassurer, lumière, lunettes",
 cap:"Rechercher : infection, déshydratation, rétention urinaire, fécalome, douleur, médicaments ; environnement rassurant, orientation, appareils auditifs et lunettes, éviter la contention."});
lzZF("sarcopenie",{t:"Les muscles fondent avec l'âge",sub:"Sarcopénie : perte de masse et de force musculaires ; chutes, perte d'autonomie",pt:[110,170],bg:"#FDF3EE",
 left:()=>lzOrg("squelette",["hanche","genou"],-8,14,.62),
 inner:()=>lzR(186,34,124,124,0,"#F5DCD6","none")+[0,1,2,3,4,5].map(i=>lzR(192,44+i*18,i%2?70:112,12,6,"#C9675A","#8E3A30",.8)).join("")+lzDots(266,62,40,80,8,4,(x,y)=>lzE(x,y,9,6,"#FDEDB9","#D6B25E",.8)),
 zt:["Fibres musculaires moins","nombreuses, graisse"],
 extra:()=>lzLL(200,"Lenteur de marche, faiblesse,\ndifficulté à se lever",1)+lzLL(232,"Test : lever de chaise, force\nde préhension",0),pill:"Activité physique et protéines",
 cap:"Exercice de renforcement adapté, apports protéiques suffisants, vitamine D ; prévention des chutes et de l'alitement prolongé."});
lzSilFig("chutes",{t:"Plusieurs fragilités s'additionnent et font tomber",sub:"Chutes à répétition : causes liées à la personne, aux médicaments et à l'environnement",
 shade:"",extra:[[84,30,6],[84,96,9],[70,190,8],[100,190,8]].map(([a,b,r])=>lzC(a,b,r,"rgba(200,55,45,.35)","#C8372D",1.2)).join("")+lzP("M30 228 H160","none","#9AA3AB",2),
 labels:lzLR(30,"Vue, vertiges,\nconfusion",1,90,30)+lzLR(84,"Médicaments :\nsomnifères, TA",1,94,96)+lzLR(140,"Muscles faibles,\npieds douloureux",0,100,170)+lzLR(196,"Tapis, éclairage,\nchaussures",0,104,226),
 pill:"Évaluer, adapter le domicile, apprendre à se relever",
 cap:"Évaluation multifactorielle (marche, vue, médicaments, tension debout, pieds), activité physique, aménagement du domicile, téléassistance ; rechercher une fracture après chaque chute."});
lzPF2("pneumopathie-inhalation",{t:"Les aliments passent dans les bronches",sub:"Pneumopathie d'inhalation : troubles de la déglutition (AVC, démence, Parkinson) ; souvent à droite",zones:["bronches"],ppt:[188,96],
 inner:()=>lzR(186,34,124,124,0,"#FBEAE6","none")+lzBr(248,96,40,{})+lzDots(230,80,36,30,7,4,(x,y)=>lzE(x,y,4,3,"#E8C98A","#A8902A",.6))+lzDots(214,64,70,70,10,7,lzBact),
 zt:["Débris alimentaires et","bactéries dans la bronche"],
 extra:()=>lzLL(200,"Toux au repas, fièvre,\nencombrement",1)+lzLL(232,"Repas assis, textures adaptées",0),pill:"Position assise pour manger, tête légèrement fléchie",
 cap:"Dépistage des troubles de la déglutition (test à l'eau), textures adaptées, eau gélifiée, position assise, surveillance pendant et après le repas, soins de bouche ; antibiotiques si infection."});
lzZF("incontinence-fecale",{t:"Le sphincter ne retient plus les selles",sub:"Incontinence fécale : sphincter abîmé (accouchement, chirurgie), fécalome, troubles neurologiques, diarrhée",pt:[166,224],bg:"#FFF6E8",
 left:()=>lzOrg("digestif",["rectum"],-8,18,.62),
 inner:()=>lzAnal(""),zt:["Muscles du sphincter","affaiblis"],
 extra:()=>lzLL(200,"Rechercher un fécalome\n(fausse diarrhée)",1)+lzLL(232,"Protéger la peau, préserver\nla dignité",0),pill:"Rechercher la cause ; soins de peau",
 cap:"Toucher rectal (fécalome), régulation du transit, présentation régulière aux toilettes, rééducation ; soins de peau (dermite), protections adaptées, respect de la pudeur."});
LZ["denutrition-ag"]=Object.assign({},LZ["cachexie"],{t:"La personne âgée fond sans qu'on le voie",sub:"Dénutrition : apports insuffisants (appétit, dents, isolement, maladie) ; muscles et défenses s'effondrent"});
