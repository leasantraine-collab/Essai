/* Carnet IFSI — schémas des lésions : ophtalmologie et ORL (39 pathologies). */
const lzOF=(id,o)=>lzZF(id,Object.assign({left:()=>lzOrg("oeil",o.zones||[],-8,22,.62),pt:lzMpF(...(o.opt||[222,50])).map((v,i)=>i?v+4:v),bg:"#FBF3EC"},o));
const lzEF2=(id,o)=>lzZF(id,Object.assign({left:()=>lzOrg("orl",o.zones||[],-8,18,.62),pt:lzMpF(...(o.ept||[262,88])),bg:"#FBF1EF"},o));
/* fond d'œil (vu à l'ophtalmoscope) : papille, vaisseaux, macula ; options : drusen, hemo, exu, ma, neo, pale (OACR), vein (OVR), cup, swell, detach */
function lzFundus(o={}){let s=lzC(248,96,62,o.pale?"#F1D6C8":"#E8875A","none")+lzC(248,96,62,"url(#lzfg)","none");
 s=`<defs><radialGradient id="lzfg" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#F4A774" stop-opacity="${o.pale?0:.6}"/><stop offset="1" stop-color="#B9472E" stop-opacity="${o.pale?.15:.55}"/></radialGradient></defs>`+s;
 const D=[214,92],v=(d,c,w)=>lzP(d,"none",c,w);
 const art=o.pale?1.2:2,vw=o.vein?4.2:2.8,vc=o.vein?"#6E1F1A":"#9E2E24";
 s+=v(`M${D[0]} ${D[1]} C230 70 262 56 300 50 M${D[0]} ${D[1]} C232 112 262 132 300 142 M${D[0]} ${D[1]} C220 62 210 48 206 36 M${D[0]} ${D[1]} C222 124 214 140 208 154`,"#D8473A",art)
  +v(`M${D[0]} ${D[1]-4} C234 62 270 46 304 44 M${D[0]} ${D[1]+4} C236 120 268 140 304 150 M${D[0]-4} ${D[1]} C214 58 204 46 200 40`,vc,vw);
 if(o.vein)s+=v("M230 70 c6 -4 8 2 14 -2 c6 -4 8 2 14 -2 M236 118 c6 4 8 -2 14 2 c6 4 8 -2 14 2","none",vc,4);
 s+=lzC(D[0],D[1],o.swell?15:12,o.swell?"#F6D7A0":"#F7E3A8","#E0B860",1)+(o.cup?lzC(D[0],D[1],o.cup,"#FFF6DA","none"):lzC(D[0],D[1],4,"#FFF6DA","none"));
 if(o.swell)s+=lzC(D[0],D[1],18,"none","rgba(247,227,168,.7)",4);
 s+=lzC(266,98,10,o.pale?"#C8372D":"#A9472E",o.pale?"none":"none")+lzC(266,98,3,o.pale?"#8E1A14":"#7A2C1C","none");
 if(o.drusen)s+=lzDots(250,82,34,32,18,4,(x,y,R)=>lzC(x,y,1.6+R()*1.6,"#F6E3A1","#C9A24E",.4));
 if(o.atro)s+=lzC(266,98,16,"#F0C9A6","#C98E6C",1);
 if(o.neo)s+=lzP("M256 92 q4 -6 8 0 q4 6 8 0 M258 104 q4 4 8 0","none","#E83A2A",1.2);
 if(o.hemo)s+=lzDots(220,50,80,90,o.hemo,5,(x,y,R)=>o.flame?lzE(x,y,5,2,"#8E1A14","none",1,R()*180):lzC(x,y,2+R()*2.4,"#8E1A14","none"));
 if(o.ma)s+=lzDots(226,60,70,74,16,7,(x,y)=>lzC(x,y,1.2,"#C8102E","none"));
 if(o.exu)s+=lzDots(240,80,46,40,12,9,(x,y)=>lzC(x,y,1.8,"#F6E58A","#C9A24E",.4));
 if(o.detach)s+=lzP("M252 34 C262 70 296 84 310 86 L310 34 Z","rgba(220,225,230,.85)","#9AA3AB",1.2)+lzP("M268 50 l6 4 l-2 6","none","#56626E",1.6);
 return s;}
/* segment antérieur en coupe (cornée, chambre, iris, cristallin) : o.closed (angle fermé), o.lens (cataracte), o.cells (uvéite), o.hypopyon, o.hyphema, o.ulcer, o.fb (corps étranger) */
function lzAnt(o={}){let s=lzR(186,34,124,124,0,"#FBF6EE","none")+lzP("M206 40 C188 70 188 122 206 152","none","#CFE6EE",o.ulcer?10:8)+lzP("M206 40 C188 70 188 122 206 152","none","#9CC0D2",1)
  +lzE(o.closed?232:240,96,o.closed?14:18,42,"#EAF5FC","none");
 s+=lzP(o.closed?"M214 52 C226 60 236 74 240 86 M214 140 C226 132 236 118 240 106":"M226 50 C236 60 244 74 248 86 M226 142 C236 132 244 118 248 106","none","url(#rg-iris)",7);
 s+=lzE(270,96,22,32,o.lens?"#D9D4CC":"url(#rg-lens)",o.lens?"#9AA3AB":"#B9CCD8",1.2)+(o.lens?lzDots(256,72,28,48,16,4,(x,y)=>lzC(x,y,2.4,"rgba(255,255,255,.8)","none")):"");
 if(o.closed)s+=lzC(212,54,7,"none",LC.acc,1.6,";stroke-dasharray:2 2")+lzC(212,138,7,"none",LC.acc,1.6,";stroke-dasharray:2 2");
 if(o.cells)s+=lzDots(212,62,22,70,10,4,(x,y)=>lzC(x,y,1.8,"#F4F1E8","#8E7BB8",.6));
 if(o.hypopyon)s+=lzP("M200 130 C206 140 214 146 222 148 L222 130 Z","#F2E6C4","#C9A24E",1);
 if(o.hyphema)s+=lzP("M196 122 C200 138 210 148 224 152 L226 122 Z","#B23A30","#7E1A14",1);
 if(o.ulcer)s+=lzP("M194 84 C190 92 190 102 194 110","none","#6FD08C",5)+lzC(196,96,6,"rgba(255,255,255,.75)","none");
 if(o.fb)s+=lzP("M192 92 l5 -3 l2 5 l-4 3 Z","#56626E","#2E3640",.8)+lzC(196,94,6,"none","rgba(232,80,60,.6)",2);
 return s;}
/* ============ Œil ============ */
lzOF("cataracte",{t:"Le cristallin devient opaque",sub:"Cataracte : la lentille de l'œil s'opacifie avec l'âge (diabète, corticoïdes, soleil) ; la vue se voile",zones:["cristallin"],opt:[136,124],
 inner:()=>lzAnt({lens:1}),zt:["Cristallin blanchâtre :","la lumière passe mal"],
 extra:()=>lzLL(200,"Vue floue, éblouissement,\ncouleurs ternes",1)+lzLL(232,"Opération simple : implant\nartificiel",0),pill:"Après opération : collyres, ne pas frotter l'œil",
 cap:"Chirurgie ambulatoire (remplacement par un implant) ; après : collyres antibiotiques et anti-inflammatoires, coque la nuit, éviter de frotter, signaler douleur ou baisse de vue."});
lzOF("glaucome-aigu",{t:"L'humeur aqueuse ne s'évacue plus : la pression explose",sub:"Glaucome aigu par fermeture de l'angle : l'iris bouche la sortie du liquide de l'œil ; urgence",zones:["chambre","iris"],opt:[114,108],
 inner:()=>lzAnt({closed:1}),zt:["Angle fermé par l'iris","(cercles rouges)"],
 extra:()=>lzLL(200,"Œil rouge très douloureux, vision\nfloue, halos, vomissements",1)+lzLL(232,"Pupille en demi-dilatation,\nœil dur",0),pill:"Urgence : risque de cécité en quelques heures",
 cap:"Urgence ophtalmologique : traitement pour baisser la pression (collyres, acétazolamide, mannitol), puis iridotomie au laser ; éviter les médicaments qui dilatent la pupille chez les personnes à risque."});
lzOF("glaucome-chronique",{t:"La pression de l'œil abîme lentement le nerf optique",sub:"Glaucome chronique : la tension oculaire détruit les fibres du nerf ; le champ visuel se rétrécit sans douleur",zones:["nerf","chambre"],opt:[282,121],
 inner:()=>lzFundus({cup:9}),zt:["Papille creusée","(excavation) : fibres perdues"],
 extra:()=>lzLL(200,"Aucun symptôme au début ;\nvision en tunnel à la fin",1)+lzLL(232,"Dépistage après 40 ans\n(tension oculaire)",0),pill:"Collyres tous les jours, à vie",
 cap:"Collyres hypotonisants quotidiens (bonne technique d'instillation, compression du point lacrymal), laser ou chirurgie ; les fibres perdues ne repoussent pas : observance essentielle."});
lzOF("dmla",{t:"Le centre de la rétine s'abîme avec l'âge",sub:"DMLA : la macula (vision fine) se dégrade ; forme sèche (atrophie) ou humide (néovaisseaux qui saignent)",zones:["macula","retine"],opt:[245,98],
 inner:()=>lzFundus({drusen:1,neo:1,hemo:3}),zt:["Drusen (jaunes), néovaisseaux","dans la macula"],
 extra:()=>lzLL(200,"Tache centrale, lignes\ndéformées (grille d'Amsler)",1)+lzLL(232,"Vision périphérique conservée",0),pill:"Lignes tordues : consulter vite",
 cap:"Forme humide : injections intravitréennes répétées ; arrêt du tabac, protection solaire ; aides visuelles (loupes, éclairage) et accompagnement basse vision."});
lzOF("retinopathie-diabetique",{t:"Le diabète abîme les petits vaisseaux de la rétine",sub:"Rétinopathie diabétique : microanévrismes, hémorragies, exsudats, puis néovaisseaux fragiles",zones:["retine","vaisseaux"],opt:[218,160],
 inner:()=>lzFundus({ma:1,hemo:8,exu:1,neo:1}),zt:["Points rouges, taches","jaunes, néovaisseaux"],
 extra:()=>lzLL(200,"Longtemps sans symptôme",1)+lzLL(232,"Fond d'œil ou rétinographie\nchaque année",0),pill:"Équilibrer glycémie et tension",
 cap:"Dépistage annuel, équilibre du diabète et de la tension, laser ou injections selon le stade ; prudence lors d'une amélioration rapide de la glycémie (surveillance)."});
lzOF("decollement-retine",{t:"La rétine se décolle de la paroi de l'œil",sub:"Décollement de rétine : une déchirure laisse passer le liquide sous la rétine, qui se soulève",zones:["retine","vitre"],opt:[222,50],
 inner:()=>lzR(186,34,124,124,0,"#EEF3F6","none")+lzP("M200 34 C250 50 290 80 310 120","none","#B9472E",10)+lzP("M210 40 C246 70 268 94 292 132","none","#E8875A",4)+lzP("M210 40 C230 46 264 70 300 110","rgba(156,205,235,.6)","none")+lzP("M244 66 l8 6","none","#56626E",2.4),
 zt:["Rétine soulevée,","liquide en dessous"],
 extra:()=>lzLL(200,"Éclairs, mouches volantes,\nvoile qui avance",1)+lzLL(232,"Myopie forte, traumatisme,\nopération de cataracte",0),pill:"Voile dans le champ visuel : urgence",
 cap:"Urgence chirurgicale (laser, cryothérapie, chirurgie) ; positionnement de la tête après l'opération selon la prescription (gaz dans l'œil : pas d'avion)."});
lzOF("conjonctivite",{t:"La fine membrane qui couvre l'œil s'enflamme",sub:"Conjonctivite : virale (très contagieuse), bactérienne (pus) ou allergique (démangeaisons)",zones:["conjonctive","paupieres"],opt:[128,50],
 inner:()=>lzR(186,34,124,124,0,"#FBEAE6","none")+[[200,60],[220,90],[210,128],[260,52],[270,140]].map(([a,b])=>lzP(`M${a} ${b} c10 -6 20 6 30 0 c10 -6 18 4 26 -2`,"none","#D8473A",2.2)).join("")+lzDots(206,70,90,60,8,5,lzCoc)+lzDots(206,70,90,60,4,7,(x,y)=>lzWbc(x,y,3.4))+lzDots(230,60,60,60,5,9,(x,y)=>lzVirus(x,y,2.6)),
 zt:["Vaisseaux dilatés,","germes et sécrétions"],
 extra:()=>lzLL(200,"Œil rouge, sensation de sable,\nlarmes, paupières collées",1)+lzLL(232,"Vision normale, pas de douleur\nvraie",0),pill:"Lavage des mains, linge personnel",
 cap:"Lavages au sérum physiologique, collyres selon la cause ; hygiène stricte (mains, serviettes, pas de partage) ; douleur ou baisse de vision : ce n'est pas une simple conjonctivite."});
lzOF("keratite",{t:"La cornée est abîmée ou infectée",sub:"Kératite : ulcère de la cornée (lentilles, traumatisme, herpès) ; douleur et peur de la lumière",zones:["cornee"],opt:[101,96],
 inner:()=>lzAnt({ulcer:1}),zt:["Ulcère cornéen coloré en vert","par la fluorescéine"],
 extra:()=>lzLL(200,"Douleur, photophobie,\nœil rouge, larmes",1)+lzLL(232,"Porteurs de lentilles :\nretirer et consulter",0),pill:"Pas de corticoïdes sans avis ophtalmologique",
 cap:"Examen à la fluorescéine, prélèvement si abcès, collyres antibiotiques ou antiviraux fréquents ; arrêt des lentilles ; éducation à l'hygiène des lentilles."});
lzOF("uveite",{t:"L'intérieur de l'œil s'enflamme",sub:"Uvéite : inflammation de l'iris et du corps ciliaire (spondylarthrite, sarcoïdose, infection)",zones:["iris","chambre"],opt:[123,82],
 inner:()=>lzAnt({cells:1,hypopyon:1}),zt:["Cellules inflammatoires dans","la chambre, dépôt de pus"],
 extra:()=>lzLL(200,"Œil rouge douloureux,\nphotophobie, vision floue",1)+lzLL(232,"Rechercher une maladie\ngénérale",0),pill:"Collyres corticoïdes et dilatateurs sur prescription",
 cap:"Collyres corticoïdes et mydriatiques, bilan de la cause ; surveillance de la pression oculaire sous corticoïdes ; récidives fréquentes."});
lzOF("oacr",{t:"L'artère de la rétine se bouche",sub:"Occlusion de l'artère centrale de la rétine : un embole prive la rétine de sang ; « AVC de l'œil »",zones:["vaisseaux","retine"],opt:[218,160],
 inner:()=>lzFundus({pale:1})+lzC(222,80,3,"#F7E3A8","#C9A24E",1),zt:["Rétine pâle, macula","rouge cerise"],
 extra:()=>lzLL(200,"Perte brutale et indolore\nde la vision d'un œil",1)+lzLL(232,"Même bilan qu'un AVC",0),pill:"Urgence : appeler le 15 (filière AVC)",
 cap:"Urgence : prise en charge en filière neurovasculaire (bilan cardiovasculaire, carotides), recherche d'une maladie de Horton chez la personne âgée."});
lzOF("ovr",{t:"Une veine de la rétine se bouche",sub:"Occlusion veineuse rétinienne : le sang stagne, les veines se dilatent et saignent ; HTA, diabète, glaucome",zones:["vaisseaux","retine"],opt:[218,160],
 inner:()=>lzFundus({vein:1,hemo:18,flame:1}),zt:["Veines dilatées, hémorragies","en flammèches"],
 extra:()=>lzLL(200,"Baisse de vision brutale,\nplutôt au réveil",1)+lzLL(232,"Contrôler tension, diabète,\nlipides",0),pill:"Bilan cardiovasculaire ; injections si œdème",
 cap:"Bilan des facteurs de risque (HTA, diabète, glaucome) ; injections intravitréennes en cas d'œdème maculaire, laser en cas de néovaisseaux."});
lzOF("hemorragie-retinienne",{t:"Du sang s'épanche dans la rétine",sub:"Hémorragie rétinienne : HTA sévère, diabète, troubles de la coagulation, traumatisme, occlusion veineuse",zones:["retine"],opt:[222,50],
 inner:()=>lzFundus({hemo:12}),zt:["Taches de sang","sur la rétine"],
 extra:()=>lzLL(200,"Baisse de vision ou tache\nselon l'endroit",1)+lzLL(232,"Rechercher la cause",0),pill:"Contrôler la tension et la coagulation",
 cap:"Examen du fond d'œil, bilan tensionnel, glycémie, bilan d'hémostase ; chez le nourrisson, penser au bébé secoué."});
lzOF("traumatisme-oculaire",{t:"Un choc blesse l'œil",sub:"Traumatisme oculaire : contusion (sang dans la chambre), plaie du globe, brûlure chimique",zones:["cornee","chambre"],opt:[114,108],
 inner:()=>lzAnt({hyphema:1}),zt:["Sang dans la chambre","antérieure (hyphéma)"],
 extra:()=>lzLL(200,"Douleur, baisse de vision,\nsang visible dans l'œil",1)+lzLL(232,"Plaie : ne pas appuyer,\nne rien retirer",0),pill:"Produit chimique : rincer 15 minutes à l'eau",
 cap:"Brûlure chimique : lavage abondant immédiat ; plaie ou corps planté : coque rigide sans appui, à jeun, urgence ophtalmologique ; contusion : repos, tête surélevée."});
lzOF("corps-etranger-cornee",{t:"Une poussière s'incruste dans la cornée",sub:"Corps étranger cornéen : meulage, bricolage sans lunettes, vent ; douleur et larmes",zones:["cornee"],opt:[101,96],
 inner:()=>lzAnt({fb:1}),zt:["Particule incrustée","dans la cornée"],
 extra:()=>lzLL(200,"Sensation de grain, larmes,\nœil rouge",1)+lzLL(232,"Métal : risque de rouille\net d'infection",0),pill:"Ne pas frotter ; lunettes de protection",
 cap:"Lavage au sérum physiologique, retrait par l'ophtalmologiste (anesthésie locale), collyre antibiotique ; prévention par lunettes de protection."});
lzOF("neuropathie-optique",{t:"Le nerf optique est abîmé",sub:"Neuropathie optique : inflammation (sclérose en plaques), manque de sang, toxique ou compression",zones:["nerf"],opt:[282,121],
 inner:()=>lzFundus({swell:1}),zt:["Papille gonflée,","bords flous"],
 extra:()=>lzLL(200,"Baisse de vision, couleurs\ndélavées, douleur aux mouvements",1)+lzLL(232,"IRM cérébrale et orbitaire",0),pill:"Baisse de vision brutale : urgence",
 cap:"Bilan en urgence (IRM, champ visuel), corticoïdes selon la cause ; rechercher une sclérose en plaques ou une maladie de Horton."});
/* ============ Oreille ============ */
/* oreille en coupe : conduit externe (droite), tympan, oreille moyenne (osselets), trompe, cochlée (gauche)
   o : ext (otite externe), pus (otite moyenne), fluid (séreuse), mast (mastoïde), hair (cellules ciliées abîmées), hydrops (Ménière), waves */
function lzEar(o={}){let s=lzR(186,34,124,124,0,"#F3E6DC","none");
 s+=lzP("M268 84 L310 76 L310 112 L268 106 Z",o.ext?"#F09A86":"#F6D3BB","#B98868",1)+lzP("M270 90 L310 86 L310 102 L270 100 Z",o.ext?"#F7D9B8":"#FBEBDD","none");
 if(o.ext)s+=lzDots(276,88,30,12,6,4,lzBact)+lzDots(276,88,30,12,4,6,(x,y)=>lzC(x,y,2,"#E8D27A","none"));
 s+=lzE(266,95,4,o.pus?16:14,o.pus?"#E8574A":"#F2D7C8",o.pus?"#9E2219":"#B98868",1.2);
 s+=lzE(242,94,22,26,o.pus?"#EFD98A":o.fluid?"#D6EAF5":"#FFFFFF","#C9B88E",1.2)+(o.fluid?lzDots(226,74,30,30,5,4,(x,y)=>lzC(x,y,2.6,"#FFFFFF","#8DB3C9",.6)):"")+(o.pus?lzDots(226,76,30,30,8,5,lzCoc):"");
 s+=lzP("M260 90 L248 86 L240 96 L232 92","none","url(#rg-bone)",3.4)+lzP("M236 118 C232 132 224 146 214 158","none",o.fluid||o.pus?"#C9675A":"#E9C5B8",6)+(o.fluid||o.pus?lzP("M232 128 l6 4 M222 146 l6 4","none",LC.acc,1.6):"");
 s+=lzP("M214 96 C204 96 198 88 202 80 C206 72 218 74 218 84 C218 92 210 94 208 88","none",o.hair?"#C9B8A6":"#E8B04A",o.hydrops?6:4)+lzP("M214 70 C206 56 214 44 224 50 C230 54 226 64 220 66","none","#E8B04A",o.hydrops?5:3);
 if(o.hydrops)s+=lzC(210,86,16,"rgba(156,205,235,.35)","#3D8CC0",1,";stroke-dasharray:3 2");
 if(o.hair)s+=lzP("M196 108 h8 m4 0 h8","none","#C9B8A6",1.2)+lzS(200,124,"cellules\nabîmées","start","st-acc");
 if(o.mast)s+=lzDots(250,124,48,28,9,4,(x,y)=>lzC(x,y,5,o.mastPus?"#EFD98A":"#FFFFFF","#C9B88E",.8))+(o.mastPus?lzDots(250,124,48,28,8,7,lzCoc):"");
 if(o.waves)s+=[0,1,2].map(i=>lzP(`M${300-i*8} 70 q-6 26 0 52`,"none","#3D8CC0",1.4,";opacity:.7")).join("");
 return s;}
lzEF2("otite-externe",{t:"Le conduit de l'oreille s'infecte",sub:"Otite externe : eau, coton-tige, eczéma ; la peau du conduit gonfle et s'infecte (« otite du baigneur »)",zones:["oreille_ext"],ept:[298,94],
 inner:()=>lzEar({ext:1}),zt:["Conduit rouge et gonflé,","écoulement"],
 extra:()=>lzLL(200,"Douleur vive en tirant\nl'oreille ou en mâchant",1)+lzLL(232,"Pas de bain pendant le traitement",0),pill:"Gouttes auriculaires ; pas de coton-tige",
 cap:"Gouttes antibiotiques et anti-inflammatoires, antalgiques, protéger de l'eau ; ne pas introduire d'objet dans le conduit."});
lzEF2("oma",{t:"Du pus s'accumule derrière le tympan",sub:"Otite moyenne aiguë : souvent après un rhume chez l'enfant ; la trompe se bouche, les germes se multiplient",zones:["tympan"],ept:[262,88],
 inner:()=>lzEar({pus:1}),zt:["Tympan rouge et bombé,","pus dans l'oreille moyenne"],
 extra:()=>lzLL(200,"Douleur, fièvre, enfant qui\npleure, se touche l'oreille",1)+lzLL(232,"Parfois écoulement si le\ntympan se perce",0),pill:"Antalgiques ; antibiotiques selon l'âge",
 cap:"Paracétamol, lavages de nez, antibiotiques selon l'âge et la sévérité ; surveiller fièvre persistante, gonflement derrière l'oreille (mastoïdite)."});
lzEF2("otite-sereuse",{t:"Du liquide stagne derrière le tympan",sub:"Otite séreuse : la trompe d'Eustache fonctionne mal ; le liquide gêne la transmission du son",zones:["tympan"],ept:[262,88],
 inner:()=>lzEar({fluid:1}),zt:["Liquide et bulles","derrière le tympan"],
 extra:()=>lzLL(200,"Baisse d'audition,\nsans douleur ni fièvre",1)+lzLL(232,"Enfant : retard de langage\nsi elle dure",0),pill:"Surveiller l'audition ; aérateurs si persistante",
 cap:"Lavages de nez, surveillance ; pose d'aérateurs transtympaniques (yoyos) si persistante avec baisse d'audition ; protéger de l'eau selon consigne."});
lzEF2("mastoidite",{t:"L'infection gagne l'os derrière l'oreille",sub:"Mastoïdite : complication d'une otite moyenne ; les cellules de l'os mastoïde se remplissent de pus",zones:["mastoide"],ept:[278,126],
 inner:()=>lzEar({pus:1,mast:1,mastPus:1}),zt:["Cellules mastoïdiennes","remplies de pus"],
 extra:()=>lzLL(200,"Gonflement rouge derrière l'oreille,\noreille décollée, fièvre",1)+lzLL(232,"Risque de méningite",0),pill:"Urgence : antibiotiques IV",
 cap:"Hospitalisation, antibiotiques intraveineux, scanner, parfois chirurgie ; surveiller les signes neurologiques (méningite, thrombophlébite)."});
lzEF2("surdite",{t:"Le son n'est plus transmis ou n'est plus perçu",sub:"Surdité : de transmission (conduit, tympan, osselets) ou de perception (cochlée, nerf auditif)",zones:["oreille_int","tympan"],ept:[244,96],
 inner:()=>lzEar({hair:1,waves:1}),zt:["Cellules ciliées de la","cochlée abîmées"],
 extra:()=>lzLL(200,"Bruit, âge, médicaments,\nbouchon, otite",0)+lzLL(232,"Surdité brutale : urgence",1),pill:"Parler face à la personne, articuler sans crier",
 cap:"Audiogramme, appareillage auditif, implant cochléaire si surdité profonde ; communication adaptée (face à face, lumière sur le visage, phrases courtes) ; protéger du bruit."});
lzEF2("acouphenes",{t:"L'oreille entend un bruit qui n'existe pas",sub:"Acouphènes : sifflements ou bourdonnements souvent liés à une atteinte de la cochlée (bruit, âge)",zones:["oreille_int"],ept:[244,96],
 inner:()=>lzEar({hair:1})+[0,1,2].map(i=>lzP(`M${204-i*6} 66 q-4 14 0 28`,"none",LC.acc,1.4)).join(""),zt:["Cochlée abîmée :","signal parasite"],
 extra:()=>lzLL(200,"Sifflement, bourdonnement,\nsurtout dans le calme",1)+lzLL(232,"Retentissement : sommeil,\nanxiété",0),pill:"Protéger ses oreilles du bruit",
 cap:"Bilan ORL (audition), prise en charge de l'audition, thérapies d'habituation, gestion du stress et du sommeil ; acouphène pulsatile d'un seul côté : bilan vasculaire."});
lzEF2("meniere",{t:"Trop de liquide gonfle l'oreille interne",sub:"Maladie de Ménière : excès d'endolymphe dans la cochlée et les canaux de l'équilibre",zones:["oreille_int"],ept:[244,96],
 inner:()=>lzEar({hydrops:1}),zt:["Oreille interne gonflée","(hydrops)"],
 extra:()=>lzLL(200,"Crises de vertige rotatoire,\nacouphène, oreille pleine",1)+lzLL(232,"Baisse d'audition qui fluctue",0),pill:"Crise : allonger au calme, risque de chute",
 cap:"En crise : repos dans le noir, antivertigineux, antiémétiques, prévention des chutes ; traitement de fond, régime pauvre en sel, gestion du stress."});
lzEF2("presbyacousie",{t:"L'oreille interne vieillit",sub:"Presbyacousie : perte progressive des cellules ciliées de la cochlée, d'abord pour les sons aigus",zones:["oreille_int"],ept:[244,96],
 inner:()=>lzEar({hair:1,waves:1}),zt:["Moins de cellules","ciliées dans la cochlée"],
 extra:()=>lzLL(200,"Comprend mal dans le bruit,\nmonte le son de la télévision",1)+lzLL(232,"Isolement, risque cognitif",0),pill:"Appareillage auditif : ne pas attendre",
 cap:"Audiogramme, appareillage (aide au réglage, entretien, piles), communication adaptée ; l'appareillage limite l'isolement et le déclin cognitif."});
/* ============ Nez et sinus ============ */
/* sinus maxillaire en coupe : o.pus, o.thick (muqueuse épaisse, polypes), o.allergy (pollens, mastocytes), o.bleed (épistaxis) */
function lzSinus(o={}){let s=lzR(186,34,124,124,0,"url(#rg-bone)","none");
 s+=lzP("M200 50 C200 44 206 40 214 40 L282 40 C292 40 298 46 298 56 L298 130 C298 142 290 150 280 150 L214 150 C204 150 200 142 200 132 Z",o.pus?"#EFD98A":"#EEF7FC","#E9A79D",o.thick?9:3);
 if(o.thick)s+=lzDots(208,46,84,20,5,4,(x,y)=>lzE(x,y+6,9,7,"#F2B7A4","#C98A7E",1));
 if(o.pus)s+=lzDots(210,60,80,80,14,5,lzCoc)+lzDots(210,60,80,80,6,7,(x,y)=>lzWbc(x,y,3.6))+lzP("M200 70 C194 74 190 80 186 82","none","#C8372D",6)+lzP("M190 70 l8 12 M198 70 l-8 12","none",LC.acc,1.6);
 else s+=lzArr(186,80,204,76,{c:"#3D8CC0",w:1.6});
 return s;}
const lzMucosa=(o={})=>lzR(186,34,124,124,0,"#EEF7FC","none")+lzP(`M186 ${o.swell?54:70} C220 ${o.swell?40:60} 260 ${o.swell?60:74} 310 ${o.swell?46:64} L310 158 L186 158 Z`,o.red?"#E8857A":"#F2B7A4","#C98A7E",1.4)
 +lzDots(196,o.swell?50:66,110,10,8,4,(x,y)=>lzP(`M${x} ${y} q2 6 0 10`,"none","#F6F0D8",2.4))+(o.allergy?lzDots(196,40,110,14,8,6,(x,y)=>lzC(x,y,2.6,"#F2C94C","#B98B14",.6)+lzP(`M${x-2} ${y} h4 M${x} ${y-2} v4`,"none","#B98B14",.6))+lzDots(200,96,100,40,4,3,(x,y)=>lzE(x,y,6,4.6,"#F3D9E9","#9C5C86",1)+lzDots(x-4,y-3,8,6,5,x,(a,b)=>lzC(a,b,.9,"#9C5C86","none"))):"")
 +(o.bleed?lzP("M226 74 c6 -4 10 2 16 -2 c6 -4 10 2 16 -2","none","#C8102E",2.2)+lzDots(234,78,30,60,10,5,(x,y,R)=>lzRbc(x,y,3.6,R()*180)):"");
lzEF2("sinusite-aigue",{t:"Le sinus se remplit de pus",sub:"Sinusite aiguë : après un rhume, l'orifice du sinus se bouche ; douleur de la face",zones:["sinus","nez"],ept:[100,44],
 inner:()=>lzSinus({pus:1}),zt:["Sinus plein de pus,","orifice bouché"],
 extra:()=>lzLL(200,"Douleur sous l'œil qui augmente\ntête penchée, nez bouché",1)+lzLL(232,"Œil gonflé : urgence",0),pill:"Lavages de nez ; antibiotiques si bactérienne",
 cap:"Lavages au sérum physiologique, antalgiques, antibiotiques si critères de sinusite bactérienne ; œdème de la paupière ou troubles visuels : urgence (sinusite compliquée)."});
lzEF2("sinusite-chronique",{t:"La muqueuse des sinus reste épaissie",sub:"Sinusite chronique : inflammation de plus de 12 semaines, parfois polypes, allergie, asthme",zones:["sinus","nez"],ept:[100,44],
 inner:()=>lzSinus({thick:1}),zt:["Muqueuse épaisse,","polypes"],
 extra:()=>lzLL(200,"Nez bouché, écoulement,\nperte de l'odorat",1)+lzLL(232,"Asthme associé fréquent",0),pill:"Lavages quotidiens, corticoïdes nasaux",
 cap:"Lavages de nez, corticoïdes par voie nasale, traitement de l'allergie ; chirurgie des sinus si échec."});
lzEF2("rhinite-allergique",{t:"Le nez réagit aux pollens ou aux acariens",sub:"Rhinite allergique : les mastocytes de la muqueuse libèrent de l'histamine au contact de l'allergène",zones:["nez","sinus"],ept:[108,84],
 inner:()=>lzMucosa({swell:1,allergy:1}),zt:["Allergènes (jaunes),","mastocytes, muqueuse gonflée"],
 extra:()=>lzLL(200,"Éternuements, nez qui coule clair,\ndémangeaisons, yeux qui pleurent",1)+lzLL(232,"Saisonnière ou toute l'année",0),pill:"Éviction de l'allergène, antihistaminiques",
 cap:"Antihistaminiques, corticoïdes nasaux, lavages ; éviction (pollens : fenêtres fermées, douche le soir ; acariens : literie) ; désensibilisation possible."});
lzEF2("rhinite-chronique",{t:"La muqueuse du nez reste enflammée",sub:"Rhinite chronique : irritants (tabac, pollution), abus de gouttes vasoconstrictrices, allergie",zones:["nez"],ept:[108,84],
 inner:()=>lzMucosa({swell:1,red:1}),zt:["Muqueuse épaissie","et congestionnée"],
 extra:()=>lzLL(200,"Nez bouché en permanence,\nécoulement, ronflement",1)+lzLL(232,"Gouttes vasoconstrictrices :\npas plus de 5 jours",0),pill:"Lavages, éviter les irritants",
 cap:"Lavages, arrêt des vasoconstricteurs, corticoïdes nasaux, arrêt du tabac ; bilan allergologique."});
lzEF2("epistaxis",{t:"Une petite veine du nez saigne",sub:"Épistaxis : le plus souvent la tache vasculaire à l'avant de la cloison ; HTA, anticoagulants, grattage",zones:["nez"],ept:[108,84],
 inner:()=>lzMucosa({bleed:1}),zt:["Tache vasculaire","de la cloison qui saigne"],
 extra:()=>lzLL(200,"Tête penchée en avant,\ncompression 10 minutes",1)+lzLL(232,"Ne pas pencher la tête en arrière",0),pill:"Mouche, tête en avant, comprimer 10 min",
 cap:"Moucher les caillots, tête penchée en avant, compression bidigitale 10 minutes ; prendre la tension ; méchage si persistance ; abondante ou sous anticoagulant : avis médical."});
/* ============ Gorge et bouche ============ */
/* gorge vue de face : luette, amygdales ; o.red, o.spots (points blancs), o.k (tumeur), o.fol (follicules) */
function lzThroat(o={}){let s=lzR(186,34,124,124,0,"#5A1F1C","none")+lzP("M190 34 C200 70 220 78 248 78 C276 78 296 70 306 34 Z","#E9A79D","none")+lzP("M186 158 C206 120 224 114 248 114 C272 114 290 120 310 158 Z","#E07A6C","none");
 s+=lzP("M240 78 C240 92 244 98 248 98 C252 98 256 92 256 78 Z",o.red?"#E8574A":"#E9A79D","#B85A4E",1);
 s+=lzE(o.k?212:214,104,16,24,o.red||o.k?"#E8574A":"#E9A79D","#B85A4E",1.2)+lzE(282,104,16,24,o.red?"#E8574A":"#E9A79D","#B85A4E",1.2);
 s+=lzR(226,82,44,48,0,o.red?"#C8473D":"#B85A4E","none",0,";opacity:.65");
 if(o.spots)s+=lzDots(204,88,20,32,6,4,(x,y)=>lzE(x,y,3,2.2,"#FFFDF0","#E0D8B0",.5))+lzDots(272,88,20,32,6,6,(x,y)=>lzE(x,y,3,2.2,"#FFFDF0","#E0D8B0",.5));
 if(o.fol)s+=lzDots(232,88,32,36,8,5,(x,y)=>lzC(x,y,2.4,"#F08A7E","#C8372D",.6));
 if(o.k)s+=lzP("M200 90 C206 84 220 88 222 98 C226 108 220 120 210 120 C200 118 196 104 200 90 Z","#8E6A8F","#5A3D5C",1.2);
 if(o.aph)s+=[[214,64],[278,58],[248,136]].map(([a,b])=>lzE(a,b,6,4,"#FFFDF0","#C8372D",1.6)).join("");
 return s;}
lzEF2("angine-virale",{t:"Un virus enflamme les amygdales",sub:"Angine virale : la plus fréquente (80 % chez l'adulte) ; ne relève pas des antibiotiques",zones:["amygdales","bouche"],ept:[146,120],
 inner:()=>lzThroat({red:1}),zt:["Amygdales et gorge","rouges"],
 extra:()=>lzLL(200,"Mal à la gorge, fièvre, rhume,\ntoux associés",1)+lzLL(232,"Test rapide (TDR) négatif",0),pill:"Antalgiques ; pas d'antibiotique",
 cap:"Paracétamol, boissons fraîches, repos ; TDR pour distinguer d'une angine à streptocoque ; consulter si gêne pour avaler la salive ou respirer."});
lzEF2("angine-bacterienne",{t:"Le streptocoque infecte les amygdales",sub:"Angine bactérienne (streptocoque A) : surtout de 5 à 15 ans ; risque de complications si non traitée",zones:["amygdales","bouche"],ept:[146,120],
 inner:()=>lzThroat({red:1,spots:1}),zt:["Amygdales rouges avec","points blancs (pus)"],
 extra:()=>lzLL(200,"Fièvre élevée, douleur à avaler,\nganglions, pas de toux",1)+lzLL(232,"TDR positif",0),pill:"TDR positif : antibiotique (amoxicilline) 6 jours",
 cap:"Amoxicilline pendant 6 jours, antalgiques ; surveiller trismus, voix étouffée (phlegmon de l'amygdale) ; éviction scolaire jusqu'à 24 h d'antibiotique."});
lzEF2("amygdalite",{t:"Les amygdales s'infectent à répétition",sub:"Amygdalite : inflammation des amygdales, aiguë ou récidivante ; amygdales grosses et cryptiques",zones:["amygdales"],ept:[146,120],
 inner:()=>lzThroat({red:1,spots:1}),zt:["Amygdales gonflées","et infectées"],
 extra:()=>lzLL(200,"Angines répétées, ronflement,\napnées chez l'enfant",1)+lzLL(232,"Amygdalectomie selon\nla fréquence",0),pill:"Après amygdalectomie : surveiller le saignement",
 cap:"Traitement de chaque épisode ; amygdalectomie si récidives fréquentes ou apnées ; après l'opération : surveiller déglutitions répétées (saignement), alimentation froide et molle."});
lzEF2("pharyngite",{t:"Le fond de la gorge s'enflamme",sub:"Pharyngite : souvent virale, associée à un rhume ; parfois irritants (tabac, reflux)",zones:["bouche","amygdales"],ept:[112,124],
 inner:()=>lzThroat({fol:1}),zt:["Paroi du pharynx rouge,","follicules"],
 extra:()=>lzLL(200,"Gorge qui gratte, douleur\nà avaler, toux sèche",1)+lzLL(232,"Guérit en quelques jours",0),pill:"Boissons, antalgiques, humidifier l'air",
 cap:"Traitement symptomatique ; arrêt du tabac ; consulter si fièvre élevée persistante ou difficulté à respirer."});
lzEF2("epiglottite",{t:"L'épiglotte gonfle et bouche le larynx",sub:"Épiglottite : infection bactérienne rapide ; risque d'asphyxie ; urgence vitale",zones:["larynx"],ept:[152,178],
 inner:()=>lzR(186,34,124,124,0,"#FBEFEA","none")+lzP("M240 34 L240 158 M280 34 L280 158","none","#E9A79D",14)+lzP("M234 60 C230 76 250 96 266 96 C274 94 272 80 262 66 Z","#D9473C","#8E2219",1.4)+lzP("M248 100 V158","none","#EEF7FC",8)+lzArr(300,48,264,90,{c:"#3D8CC0",w:1.6})+lzP("M262 96 l8 8 M270 96 l-8 8","none",LC.acc,2),
 zt:["Épiglotte rouge et gonflée","qui ferme le passage de l'air"],
 extra:()=>lzLL(200,"Fièvre, bave, voix étouffée,\nassis penché en avant",1)+lzLL(232,"Ne jamais allonger,\nne pas examiner la gorge",0),pill:"Urgence : laisser assis, appeler le 15",
 cap:"Laisser la personne assise, calme, ne pas examiner la gorge à l'abaisse-langue ; oxygène, transfert médicalisé pour sécuriser les voies aériennes, antibiotiques IV. Rare grâce au vaccin Hib."});
lzEF2("cancer-larynx",{t:"Une tumeur se développe sur les cordes vocales",sub:"Cancer du larynx : tabac et alcool ; la voix change tôt quand il touche les cordes vocales",zones:["larynx"],ept:[152,178],
 inner:()=>lzR(186,34,124,124,0,"#5A1F1C","none")+lzP("M248 40 C226 60 214 100 222 148 L274 148 C282 100 270 60 248 40 Z","#E9A79D","none")+lzP("M248 52 L230 140 M248 52 L266 140","none","#F6F0E8",6)+lzP("M232 92 C228 104 228 116 232 124 C240 122 244 108 240 96 Z","#8E6A8F","#5A3D5C",1.2),
 zt:["Tumeur sur une","corde vocale"],
 extra:()=>lzLL(200,"Voix rauque plus de 3 semaines,\ngêne pour avaler",1)+lzLL(232,"Tabac + alcool",0),pill:"Voix rauque persistante : consulter un ORL",
 cap:"Chirurgie, radiothérapie, chimiothérapie ; trachéotomie ou laryngectomie : soins de canule, communication alternative, accompagnement ; arrêt du tabac et de l'alcool."});
lzEF2("cancer-pharynx",{t:"Une tumeur se développe dans la gorge",sub:"Cancer du pharynx : tabac, alcool, HPV (amygdales) ; souvent révélé par un ganglion du cou",zones:["amygdales","bouche"],ept:[146,120],
 inner:()=>lzThroat({k:1}),zt:["Tumeur de l'amygdale"],
 extra:()=>lzLL(200,"Douleur d'oreille, gêne à avaler,\nganglion dur du cou",1)+lzLL(232,"Tabac, alcool, HPV",0),pill:"Hygiène buccale et nutrition pendant le traitement",
 cap:"Radio-chimiothérapie ou chirurgie ; soins de bouche (mucite), nutrition (sonde ou gastrostomie si besoin), prévention des caries après radiothérapie."});
lzEF2("cancer-bouche",{t:"Une plaie de la bouche ne guérit pas",sub:"Cancer de la cavité buccale : langue, plancher, gencives ; tabac et alcool",zones:["bouche"],ept:[112,124],
 inner:()=>lzR(186,34,124,124,0,"#5A1F1C","none")+lzP("M196 158 C196 96 220 70 248 70 C276 70 300 96 300 158 Z","#E8857A","#B85A4E",1.2)+lzP("M248 80 V150","none","#C8473D",1.4)+lzP("M262 100 C272 96 282 104 280 116 C278 126 266 128 260 120 C254 112 254 104 262 100 Z","#F2E6E0","#8E2A22",1.6)+lzC(268,112,6,"#C8372D","none"),
 zt:["Ulcération dure","sur le bord de la langue"],
 extra:()=>lzLL(200,"Plaie, tache blanche ou rouge\nplus de 15 jours",1)+lzLL(232,"Examiner la bouche des fumeurs",0),pill:"Lésion de la bouche > 15 jours : avis",
 cap:"Biopsie, chirurgie, radiothérapie ; soins de bouche, alimentation adaptée, rééducation de la parole et de la déglutition ; arrêt tabac-alcool."});
/* ============ Glandes salivaires, bouche (infection, immunologie) ============ */
const lzParotid=(o={})=>lzR(186,34,124,124,0,"#FBEFEA","none")+lzP("M206 56 C226 40 274 40 290 62 C304 84 298 120 276 138 C256 152 222 146 210 124 C200 104 196 72 206 56 Z",o.swell?"#F2B7A4":"#F6D3BB","#C98A7E",1.6)
 +lzDots(214,56,76,80,o.swell?14:18,4,(x,y)=>lzC(x,y,5,"#FBE7DD","#D69B84",.8))+lzP("M206 100 C190 104 186 108 186 112","none","#D69B84",3)
 +(o.virus?lzDots(214,56,76,80,10,6,(x,y)=>lzVirus(x,y,2.4)):"")+(o.lymph?lzDots(214,56,76,80,24,6,(x,y)=>lzLymph(x,y,3.6)):"");
lzEF2("oreillons",{t:"Le virus fait gonfler les glandes salivaires",sub:"Oreillons : virus ourlien ; parotides gonflées devant l'oreille, parfois atteinte des testicules ou méninges",zones:["oreille_ext"],ept:[278,126],
 inner:()=>lzParotid({swell:1,virus:1}),zt:["Parotide gonflée","par le virus"],
 extra:()=>lzLL(200,"Joues gonflées devant les oreilles,\ndouleur à mâcher, fièvre",1)+lzLL(232,"Orchite, méningite, surdité",0),pill:"Vaccin ROR ; éviction jusqu'à 9 jours",
 cap:"Traitement symptomatique (antalgiques, alimentation liquide) ; vaccination ROR (2 doses) ; surveiller douleur testiculaire, maux de tête et raideur de nuque."});
lzEF2("gougerot",{t:"Les défenses détruisent les glandes des larmes et de la salive",sub:"Syndrome de Gougerot-Sjögren : maladie auto-immune ; les lymphocytes envahissent les glandes",zones:["bouche"],ept:[112,124],
 inner:()=>lzParotid({lymph:1}),zt:["Lymphocytes qui infiltrent","la glande salivaire"],
 extra:()=>lzLL(200,"Bouche sèche, yeux secs\n(sable dans les yeux)",1)+lzLL(232,"Fatigue, douleurs articulaires",0),pill:"Larmes artificielles, hydratation, soins dentaires",
 cap:"Substituts de larmes et de salive, boire souvent, hygiène dentaire renforcée (caries), suivi régulier (risque de lymphome)."});
lzEF2("behcet",{t:"Des aphtes reviennent sans cesse",sub:"Maladie de Behçet : inflammation des vaisseaux (vascularite) ; aphtes buccaux et génitaux, atteinte des yeux",zones:["bouche"],ept:[112,124],
 inner:()=>lzThroat({aph:1}),zt:["Aphtes : petites ulcérations","entourées de rouge"],
 extra:()=>lzLL(200,"Aphtes douloureux répétés,\nlésions génitales, uvéite",1)+lzLL(232,"Thromboses possibles",0),pill:"Œil rouge douloureux : consulter vite",
 cap:"Colchicine, traitements locaux des aphtes, immunosuppresseurs selon l'atteinte ; surveillance ophtalmologique, vasculaire et neurologique."});
