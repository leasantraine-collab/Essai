/* Carnet IFSI — schémas des lésions : gynécologie, obstétrique et infections sexuellement transmissibles (31 pathologies). */
const lzMpF=(x,y)=>[lzN(-8+x*.62),lzN(18+y*.62)];
const lzFF=(id,o)=>lzZF(id,Object.assign({left:()=>lzOrg(o.map||"femme",o.zones||[],-8,18,.62),pt:lzMpF(...(o.fpt||[160,98])),bg:"#FBEFEA"},o));
/* ovaire en coupe : o.pcos (nombreux petits follicules), o.cyst, o.endo (kyste chocolat), o.k (tumeur), o.none (ménopause) */
function lzOvary(o={}){let s=lzE(248,98,52,36,"url(#rg-ovary)","#A97B60",1.4);
 if(o.none)return s+lzDots(214,76,68,44,6,4,(x,y)=>lzC(x,y,2,"#E8D2C2","#C99D84",.5))+lzP("M214 96 q10 -6 20 0 t20 0 t20 0","none","#C99D84",1);
 if(o.pcos)return s+[...Array(14)].map((_,i)=>{const a=i*Math.PI/7;return lzC(248+Math.cos(a)*40,98+Math.sin(a)*25,6.4,"#FBF2DC","#C99D84",.9);}).join("")+lzE(248,98,30,18,"#E8C2B0","none")+lzE(248,98,52,36,"none","#8E5A44",3);
 if(o.cyst)return s+lzC(256,94,30,"#E6F1F8","#8DB3C9",1.6)+lzDots(206,80,20,30,3,4,(x,y)=>lzC(x,y,3.4,"#FBF2DC","#C99D84",.7));
 if(o.endo)return s+lzC(252,96,26,"#6E2A22","#3E1410",1.4)+lzE(244,88,8,5,"rgba(255,255,255,.18)","none");
 if(o.k)return s+lzP("M222 84 C230 66 262 64 276 80 C290 92 286 118 270 126 C252 136 226 126 220 110 C214 100 216 92 222 84 Z","#8E6A8F","#5A3D5C",1.4)+lzDots(232,80,40,40,8,5,(x,y)=>lzC(x,y,4,"#E6F1F8","#8DB3C9",.7))+lzDots(196,130,110,24,10,3,(x,y)=>lzC(x,y,2.2,"#8E6A8F","none"));
 return s+[[226,90,7],[248,82,5],[270,96,9],[240,110,4]].map(([x,y,r])=>lzC(x,y,r,"#FBF2DC","#C99D84",.8)).join("");}
/* paroi de l'utérus : séreuse, myomètre (muscle), endomètre ; o.fib (fibrome), o.adeno, o.k (cancer), o.thick */
function lzUtWall(o={}){let s=lzR(186,34,124,124,0,"#F3C6BC","none")+lzR(186,34,124,10,0,"#F6DCD2","none");
 s+=[0,1,2,3,4,5].map(i=>lzP(`M186 ${52+i*12} C220 ${48+i*12} 270 ${56+i*12} 310 ${50+i*12}`,"none","rgba(150,70,60,.25)",1.6)).join("");
 const ey=o.thick?110:126;s+=lzP(`M186 ${ey} C220 ${ey-6} 270 ${ey+4} 310 ${ey-2} L310 158 L186 158 Z`,o.k?"#B23A30":"#C9473D","none");
 s+=lzDots(190,ey+4,116,20,10,4,(x,y)=>lzE(x,y,2.4,4,"#F2A79D","none"));
 if(o.fib)s+=lzC(o.fx||248,o.fy||84,30,"#F2D8CF","#A8695E",1.6)+[0,1,2,3].map(i=>lzC(o.fx||248,o.fy||84,8+i*5.5,"none","rgba(168,105,94,.45)",1)).join("");
 if(o.adeno)s+=lzDots(196,56,104,56,12,6,(x,y)=>lzE(x,y,5,3.6,"#C9473D","#8E241C",.8));
 if(o.k)s+=lzP("M200 118 C210 98 226 112 236 96 C248 106 256 90 268 100 C280 92 290 110 300 104 L300 130 L200 130 Z","#8E2A22","#5A1410",1)+lzDots(206,98,90,26,10,7,(x,y)=>lzC(x,y,2.4,"#5A1410","none"));
 return s;}
/* col utérin : épithélium en couches ; o.dys (cellules anormales), o.k (invasion), o.virus, o.bact, o.chlam */
function lzCervix(o={}){let s=lzR(186,34,124,124,0,"#F6DCD6","none")+lzR(186,104,124,54,0,"#F2BFA9","none");
 for(let r=0;r<5;r++)for(let i=0;i<9;i++){const x=192+i*14+(r%2?7:0),y=58+r*10,bad=o.dys&&i>2&&i<8&&r>=(o.k?0:2);
  s+=lzE(x,y,7,4.6,bad?"#E3C2E8":"#FBE7DD",bad?"#8A5C9C":"#D9A588",.7)+lzC(x,y,bad?2.6:1.3,bad?"#6A3D7C":"#B27A5C","none");}
 s+=lzP("M186 104 H310","none","#C98E6C",1.4);
 if(o.k)s+=lzP("M226 104 C224 120 232 134 240 146 C244 132 250 124 258 140 C262 124 266 114 266 104 Z","#C9A3D6","#6A3D7C",1);
 if(o.virus)s+=lzDots(196,40,104,14,7,3,(x,y)=>lzVirus(x,y,2.6,"#2E7556"));
 if(o.bact)s+=lzDots(196,38,104,18,12,4,(x,y)=>lzC(x,y,1.6,"#3E8E4A","none")+lzC(x+3,y,1.6,"#3E8E4A","none"))+lzDots(196,40,104,16,4,6,(x,y)=>lzWbc(x,y,3.6));
 if(o.chlam)s+=[[220,68],[262,78]].map(([a,b])=>lzC(a,b,4,"#BFE3B4","#3E8E4A",.8)+lzDots(a-3,b-3,6,6,5,a,(x,y)=>lzC(x,y,.8,"#3E8E4A","none"))).join("");
 return s;}
/* sein de profil : lobules, canaux, mamelon ; o.k (tumeur), o.red (inflammation), o.abs (abcès), o.node (ganglion) */
function lzBreast(o={}){let s=lzR(186,34,124,124,0,"#FBF3EC","none")+lzP("M190 34 L190 158","none","#C9675A",10)+lzP("M196 40 C250 40 300 70 300 98 C300 126 250 154 196 154 Z","url(#rg-breast)","#B98868",1.2);
 if(o.red)s+=lzP("M220 60 C260 58 296 80 298 98 C296 118 262 136 222 134 Z","rgba(232,80,60,.35)","none");
 s+=[[220,62],[214,88],[218,114],[222,138]].map(([x,y])=>lzP(`M${x} ${y} C${x+30} ${y} 270 ${(y+98)/2} 296 98`,"none","#D69B84",1.6)+lzC(x,y,6,"#F2B7A4","#C27A68",.8)).join("")+lzC(300,98,4,"#C27A68","none");
 if(o.k)s+=lzP("M246 72 l6 8 l10 -4 l-4 10 l8 6 l-10 2 l0 10 l-8 -6 l-8 6 l0 -10 l-10 -2 l8 -6 l-4 -10 l10 4 Z","#8E6A8F","#5A3D5C",1.2);
 if(o.abs)s+=lzE(256,108,20,14,"#E8D27A","#B83A2E",3)+lzDots(242,100,28,16,6,4,(x,y)=>lzWbc(x,y,3));
 if(o.bact)s+=lzDots(270,90,26,16,8,5,lzCoc)+lzP("M300 92 l-4 4 l4 4","none","#C8372D",1.2);
 return s;}
/* trompe : o.pus, o.geu (sac embryonnaire), o.rupt */
function lzTube(o={}){let s=lzR(186,34,124,124,0,"#FBEFEA","none")+lzP("M186 96 C220 84 260 108 310 92","none","#B5675C",o.pus?40:30)+lzP("M186 96 C220 84 260 108 310 92","none",o.pus?"#F2B7A4":"#F0B8AE",o.pus?36:26)+lzP("M186 96 C220 84 260 108 310 92","none",o.pus?"#E8D27A":"#FBE7DD",o.pus?14:6);
 if(o.pus)s+=lzDots(196,88,110,14,10,5,lzCoc)+lzDots(196,86,110,16,5,7,(x,y)=>lzWbc(x,y,3.4))+lzP("M186 96 C220 84 260 108 310 92","none","#C8372D",1,";stroke-dasharray:4 4");
 if(o.geu)s+=lzC(252,98,22,"#F3D9D2","#A8695E",1.4)+lzC(252,98,15,"#EAF5FC","#8DB3C9",1)+lzE(250,100,5,7,"url(#rg-fetus)","#C99A78",.8)+(o.rupt?lzP("M266 112 l12 14 l-6 4 l10 10","none",LC.acc,2.2)+lzDots(262,120,40,30,10,4,(x,y)=>lzRbc(x,y,3.4,0)):"");
 return s;}
/* placenta collé à la paroi : villosités, artères spiralées ; o.narrow, o.hrp, o.split */
function lzPlac(o={}){let s=lzR(186,34,124,124,0,"#EAF5FC","none")+lzR(186,34,124,30,0,"#E6A69C","none")+[0,1,2].map(i=>lzP(`M186 ${40+i*8} H310`,"none","rgba(150,70,60,.25)",1.4)).join("");
 s+=lzP("M186 64 C210 70 240 62 270 68 C290 72 300 66 310 64 L310 118 C280 124 220 122 186 116 Z","url(#rg-placenta)","#80302A",1.2);
 s+=[200,226,252,278,300].map(x=>lzP(`M${x} 112 c-4 -8 4 -14 0 -22 c-4 -8 4 -12 0 -18`,"none","#E59A8D",3)).join("");
 s+=[214,262].map(x=>lzP(`M${x} 34 c6 8 -6 14 0 22 c6 8 -4 8 0 14`,"none",LC.blood,o.narrow?2:6)).join("")+(o.narrow?[214,262].map(x=>lzC(x,56,6,"none",LC.acc,1.2,";stroke-dasharray:2 2")).join(""):"");
 if(o.hrp)s+=lzP("M220 64 C230 76 262 78 276 66 C266 60 232 60 220 64 Z","#6E1A16","#3A0E0B",1)+lzP("M214 66 C226 86 266 88 282 68","none","#6E1A16",4);
 s+=lzP("M186 130 C220 136 270 134 310 130","none","#9CCDEB",2)+lzS(248,144,"liquide","middle");
 return s;}
/* col en fin de grossesse : o.open (dilaté), o.short, o.leak (liquide qui s'écoule), o.prev (placenta devant le col) */
function lzColG(o={}){let s=lzR(186,34,124,124,0,"#FBEFEA","none")+lzP("M196 34 C196 80 220 96 230 120 L230 158 M300 34 C300 80 276 96 266 120 L266 158","none","url(#rg-uterus)",18);
 s+=lzP("M206 34 C210 70 240 80 248 86 C256 80 286 70 290 34 Z","#EAF5FC","#8DB3C9",1)+lzE(248,48,20,12,"url(#rg-fetus)","#C99A78",1);
 const g=o.open?14:o.short?6:2;s+=lzP(`M${248-g} 104 L${248-g} 158 M${248+g} 104 L${248+g} 158`,"none","#8E4A43",1.4);
 if(o.leak)s+=lzDots(242,110,12,46,7,4,(x,y)=>lzP(`M${x} ${y} q2 4 0 6 q-2 -2 0 -6`,"#9CCDEB","#3D8CC0",.6))+lzP("M240 88 l4 6 l4 -6 l4 6","none",LC.acc,1.6);
 if(o.prev)s+=lzP("M212 82 C230 96 266 96 284 82 C276 106 262 112 248 112 C234 112 220 106 212 82 Z","url(#rg-placenta)","#80302A",1.2);
 if(o.blood)s+=lzDots(240,112,16,44,7,5,(x,y,R)=>lzRbc(x,y,3.4,R()*180));
 return s;}
/* ============ Gynécologie ============ */
lzFF("endometriose",{t:"Du tissu de l'utérus pousse en dehors de l'utérus",sub:"Endométriose : des îlots d'endomètre se fixent sur les ovaires, le péritoine, et saignent à chaque cycle",zones:["ovaires","trompes"],fpt:[90,110],
 inner:()=>lzOvary({endo:1})+lzDots(196,126,110,24,8,5,(x,y)=>lzC(x,y,3.4,"#6E2A22","#3E1410",.6))+lzP("M200 60 C220 70 230 50 250 60","none","#E9C5B8",2.4),zt:["Kyste « chocolat » de l'ovaire,","lésions sur le péritoine"],
 extra:()=>lzLL(200,"Règles très douloureuses,\ndouleur pendant les rapports",1)+lzLL(232,"Infertilité possible ;\ndiagnostic souvent tardif",0),pill:"Des règles qui empêchent de vivre : consulter",
 cap:"Antalgiques, traitement hormonal (pilule en continu, progestatifs), chirurgie des lésions ; écoute, prise en charge de la douleur chronique, accompagnement si désir de grossesse."});
lzFF("adenomyose",{t:"L'endomètre s'infiltre dans le muscle de l'utérus",sub:"Adénomyose : des glandes de l'endomètre se logent dans le myomètre, qui s'épaissit et saigne",zones:["uterus","endometre"],fpt:[186,100],
 inner:()=>lzUtWall({adeno:1}),zt:["Îlots d'endomètre (rouge)","dans le muscle"],
 extra:()=>lzLL(200,"Règles abondantes et\ndouloureuses, utérus gros",1)+lzLL(232,"Souvent après 40 ans",0),pill:"Rechercher une anémie (règles abondantes)",
 cap:"Traitement hormonal, stérilet hormonal, antalgiques ; parfois hystérectomie ; dépister et traiter la carence en fer."});
lzFF("sopk",{t:"Les follicules de l'ovaire ne mûrissent pas",sub:"Syndrome des ovaires polykystiques : beaucoup de petits follicules arrêtés, pas d'ovulation, excès d'hormones mâles",zones:["ovaires"],fpt:[90,110],
 inner:()=>lzOvary({pcos:1}),zt:["Nombreux petits follicules","en couronne, pas d'ovulation"],
 extra:()=>lzLL(200,"Cycles irréguliers, acné,\npilosité, prise de poids",1)+lzLL(232,"Difficulté à avoir un enfant,\nrisque de diabète",0),pill:"Activité physique et équilibre alimentaire",
 cap:"Contraception hormonale si pas de désir de grossesse, induction de l'ovulation sinon ; perte de poids si surpoids ; dépistage du diabète et des troubles lipidiques."});
lzFF("fibrome",{t:"Une boule de muscle se développe dans l'utérus",sub:"Fibrome (myome) : tumeur bénigne du muscle utérin, très fréquente, hormonodépendante",zones:["uterus"],fpt:[186,100],
 inner:()=>lzUtWall({fib:1}),zt:["Fibrome : nodule ferme","enroulé dans le muscle"],
 extra:()=>lzLL(200,"Règles abondantes, pesanteur,\nenvie fréquente d'uriner",1)+lzLL(232,"Souvent sans symptôme",0),pill:"Surveiller l'anémie ; régresse à la ménopause",
 cap:"Simple surveillance si pas de gêne ; traitement hormonal, embolisation, myomectomie ou hystérectomie selon les symptômes et le désir de grossesse."});
lzFF("kyste-ovarien",{t:"Une poche de liquide se forme sur l'ovaire",sub:"Kyste ovarien : souvent fonctionnel (lié au cycle) et régresse seul ; risque de torsion ou de rupture",zones:["ovaires"],fpt:[90,110],
 inner:()=>lzOvary({cyst:1}),zt:["Kyste rempli de liquide"],
 extra:()=>lzLL(200,"Douleur pelvienne brutale :\npenser à une torsion",1)+lzLL(232,"Échographie de contrôle",0),pill:"Douleur brutale + vomissements : urgence",
 cap:"Échographie, surveillance à distance ; chirurgie si kyste persistant, suspect ou compliqué (torsion : urgence pour sauver l'ovaire)."});
lzFF("cancer-col",{t:"Le virus HPV transforme les cellules du col",sub:"Cancer du col de l'utérus : lésions précancéreuses pendant des années avant l'invasion ; dépistage efficace",zones:["col"],fpt:[160,156],
 inner:()=>lzCervix({dys:1,k:1,virus:1}),zt:["Cellules anormales qui","franchissent la membrane"],
 extra:()=>lzLL(200,"Saignements après les rapports,\npertes anormales",1)+lzLL(232,"Frottis / test HPV de 25 à 65 ans\n+ vaccination HPV",0),pill:"Dépistage régulier + vaccin HPV",
 cap:"Prévention : vaccination HPV (filles et garçons dès 11 ans), dépistage par frottis ou test HPV ; traitement des lésions précancéreuses (conisation) ; chirurgie, radio-chimiothérapie si cancer."});
lzFF("cancer-endometre",{t:"La muqueuse de l'utérus devient cancéreuse",sub:"Cancer de l'endomètre : surtout après la ménopause ; obésité, diabète, œstrogènes favorisent",zones:["endometre"],fpt:[160,98],
 inner:()=>lzUtWall({k:1,thick:1}),zt:["Endomètre épaissi,","irrégulier, qui saigne"],
 extra:()=>lzLL(200,"Saignement après la ménopause :\ntoujours consulter",1)+lzLL(232,"Échographie, biopsie",0),pill:"Tout saignement après la ménopause doit être exploré",
 cap:"Hystérectomie avec annexes, parfois radiothérapie ; diagnostic souvent précoce grâce aux saignements ; accompagnement de la sexualité et de l'image corporelle."});
lzFF("cancer-ovaire",{t:"Une tumeur de l'ovaire se développe en silence",sub:"Cancer de l'ovaire : découvert souvent tard, quand il s'est déjà étendu au péritoine (ascite)",zones:["ovaires"],fpt:[90,110],
 inner:()=>lzOvary({k:1}),zt:["Tumeur solide et kystique,","nodules sur le péritoine"],
 extra:()=>lzLL(200,"Ventre qui gonfle (ascite),\nballonnements, fatigue",1)+lzLL(232,"Mutation BRCA : risque\nfamilial",0),pill:"Ballonnements persistants après 50 ans : consulter",
 cap:"Chirurgie complète et chimiothérapie, thérapies ciblées ; ponctions d'ascite (surveillance tension, douleur) ; consultation d'oncogénétique si antécédents familiaux."});
lzFF("cancer-sein",{t:"Des cellules des canaux ou des lobules deviennent cancéreuses",sub:"Cancer du sein : le plus fréquent chez la femme ; nodule, rétraction du mamelon, ganglion de l'aisselle",zones:["sein"],fpt:[56,188],
 inner:()=>lzBreast({k:1}),zt:["Tumeur irrégulière","dans un lobule ou un canal"],
 extra:()=>lzLL(200,"Nodule dur, peau en peau d'orange,\nmamelon rétracté, écoulement",1)+lzLL(232,"Mammographie tous les 2 ans\nde 50 à 74 ans",0),pill:"Palper ses seins ; dépistage organisé",
 cap:"Chirurgie (tumorectomie ou mastectomie, ganglion sentinelle), radiothérapie, chimiothérapie, hormonothérapie ; après curage : pas de prise de sang ni de tension sur le bras opéré, prévention du lymphœdème."});
lzFF("mastite",{t:"Le sein s'enflamme pendant l'allaitement",sub:"Mastite : lait qui stagne (engorgement), parfois infecté par une crevasse du mamelon (staphylocoque)",zones:["sein"],fpt:[56,188],
 inner:()=>lzBreast({red:1,bact:1}),zt:["Zone rouge et gonflée","autour des canaux"],
 extra:()=>lzLL(200,"Sein rouge, chaud, douloureux,\nfièvre, courbatures",1)+lzLL(232,"Continuer d'allaiter\nou de tirer le lait",0),pill:"Vider le sein souvent : ne pas arrêter l'allaitement",
 cap:"Tétées fréquentes ou tire-lait, positions variées, chaleur avant et froid après, antalgiques ; antibiotiques compatibles avec l'allaitement si infection ; soigner les crevasses."});
lzFF("abces-mammaire",{t:"Une poche de pus se forme dans le sein",sub:"Abcès mammaire : complication d'une mastite mal drainée ; masse douloureuse et fluctuante",zones:["sein"],fpt:[56,188],
 inner:()=>lzBreast({red:1,abs:1}),zt:["Collection de pus","dans le sein"],
 extra:()=>lzLL(200,"Masse douloureuse, rouge,\nfièvre qui persiste",1)+lzLL(232,"Échographie, ponction",0),pill:"Ponction ou drainage + antibiotiques",
 cap:"Ponction échoguidée ou drainage, antibiotiques ; l'allaitement peut souvent continuer du côté sain (et parfois du côté atteint) ; soins du pansement."});
lzFF("salpingite",{t:"L'infection remonte jusqu'aux trompes",sub:"Salpingite : chlamydia ou gonocoque remontent du col ; risque de stérilité et de grossesse extra-utérine",zones:["trompes"],fpt:[104,60],
 inner:()=>lzTube({pus:1}),zt:["Trompe gonflée,","remplie de pus"],
 extra:()=>lzLL(200,"Douleur du bas-ventre, fièvre,\npertes, douleur aux rapports",1)+lzLL(232,"Traiter aussi le partenaire",0),pill:"Antibiotiques + préservatif + dépistage du partenaire",
 cap:"Antibiotiques adaptés (prélèvements), repos, antalgiques, dépistage des autres IST ; traitement du ou des partenaires ; prévention par le préservatif."});
lzFF("geu",{t:"L'œuf s'implante dans la trompe",sub:"Grossesse extra-utérine : la trompe ne peut pas contenir la grossesse et risque de se rompre",zones:["trompes"],fpt:[104,60],
 inner:()=>lzTube({geu:1,rupt:1}),zt:["Grossesse dans la trompe,","rupture et saignement"],
 extra:()=>lzLL(200,"Retard de règles, saignements,\ndouleur d'un côté",1)+lzLL(232,"Malaise, épaule douloureuse :\nhémorragie interne",0),pill:"Douleur + retard de règles : bêta-hCG et échographie",
 cap:"Dosage de bêta-hCG, échographie ; méthotrexate ou chirurgie (cœlioscopie) ; rupture : urgence vitale (choc hémorragique). Soutien psychologique."});
lzFF("infections-genitales",{t:"Des germes infectent le vagin ou le col",sub:"Infections génitales : vaginite, cervicite ; IST, déséquilibre de la flore ou mycose",zones:["vagin","col"],fpt:[160,180],
 inner:()=>lzCervix({bact:1}),zt:["Germes et globules blancs","sur la muqueuse"],
 extra:()=>lzLL(200,"Pertes anormales, brûlures,\ndémangeaisons, douleurs",1)+lzLL(232,"Prélèvement avant traitement",0),pill:"Préservatif ; dépister les IST",
 cap:"Prélèvement vaginal, traitement selon le germe, traitement du partenaire si IST ; hygiène intime douce (pas de douches vaginales)."});
lzFF("vaginose",{t:"Les bonnes bactéries du vagin sont remplacées",sub:"Vaginose bactérienne : les lactobacilles disparaissent, d'autres bactéries (Gardnerella) prolifèrent",zones:["vagin"],fpt:[160,202],
 inner:()=>lzR(186,34,124,124,0,"#FBE7DD","none")+[[214,70],[262,66],[236,112],[284,110]].map(([a,b])=>lzE(a,b,18,12,"#F6D3C4","#C98E6C",1)+lzC(a,b,3,"#B27A5C","none")+lzDots(a-14,b-9,28,18,16,a,(x,y)=>lzC(x,y,1,"#3E8E4A","none"))).join("")+lzDots(196,40,110,110,30,8,(x,y)=>lzC(x,y,1.2,"#3E8E4A","none")),
 zt:["Cellules couvertes de bactéries","(clue cells)"],
 extra:()=>lzLL(200,"Pertes grisâtres, odeur\nde poisson",1)+lzLL(232,"Pas une IST ; récidives\nfréquentes",0),pill:"Éviter les douches vaginales",
 cap:"Métronidazole ; à traiter pendant la grossesse (risque d'accouchement prématuré) ; hygiène intime douce, savon adapté."});
lzFF("candidose-vv",{t:"Une levure prolifère sur la muqueuse",sub:"Candidose vulvovaginale : Candida, favorisée par antibiotiques, grossesse, diabète, humidité",zones:["vagin"],fpt:[160,202],
 inner:()=>lzR(186,34,124,124,0,"#F6CFC4","none")+lzR(186,104,124,54,0,"#F2B3A2","none")+lzDots(196,52,108,44,10,5,(x,y)=>lzE(x,y,4,3,"#F4F1E8","#9AA3AB",.7))+lzDots(196,50,108,50,10,7,(x,y,R)=>lzP(`M${x} ${y} q6 -2 12 1 q5 2 10 -1`,"none","#9AA3AB",1.4))+lzR(186,34,124,16,0,"rgba(255,255,255,.85)","none"),
 zt:["Levures et filaments,","pertes blanches"],
 extra:()=>lzLL(200,"Démangeaisons, brûlures,\npertes blanches épaisses",1)+lzLL(232,"Pas une IST",0),pill:"Ovule ou crème antifongique ; sous-vêtements coton",
 cap:"Antifongique local (ovule, crème) ; rechercher un diabète si récidives ; éviter la macération, les savons agressifs."});
lzFF("menopause",{t:"Les ovaires cessent de fonctionner",sub:"Ménopause : arrêt des règles depuis 12 mois, chute des œstrogènes, vers 50 ans",zones:["ovaires"],fpt:[90,110],
 inner:()=>lzOvary({none:1}),zt:["Ovaire sans follicule,","plus d'œstrogènes"],
 extra:()=>lzLL(200,"Bouffées de chaleur, sueurs,\nsécheresse vaginale, humeur",1)+lzLL(232,"Os plus fragiles, risque\ncardiovasculaire",0),pill:"Activité physique, calcium, vitamine D",
 cap:"Traitement hormonal si symptômes gênants (après bilan), lubrifiants, prévention de l'ostéoporose et du risque cardiovasculaire ; dépistages (mammographie, frottis)."});
/* plancher pelvien de profil (prolapsus) */
const lzPelvis=(o={})=>{const d=o.drop||0;return lzP("M30 130 C30 116 44 108 54 114 C62 120 60 136 48 140 C38 142 30 138 30 130 Z","url(#rg-bone)","#C9B88E",1)
 +lzP("M168 24 C182 50 184 90 172 124 C168 134 162 140 156 144","none","url(#rg-bone)",12)+lzC(66,92,20,"url(#rg-bladder)","#C99A78",1)
 +lzP(`M96 ${60+d} C118 ${54+d} 134 ${70+d} 128 ${90+d} C124 ${104+d} 116 ${110+d} 112 ${118+d} L102 ${118+d} C96 ${108+d} 86 ${96+d} 88 ${80+d} C90 ${68+d} 92 ${62+d} 96 ${60+d} Z`,"url(#rg-uterus)","#8E4A43",1)
 +lzP(`M106 ${118+d} C102 ${136+d/2} 94 150 86 166`,"none","url(#rg-mucosa)",12)+lzP("M150 40 C150 90 150 130 132 168","none","url(#rg-colon)",14)
 +lzP(`M52 142 C80 ${158+d*.6} 120 ${160+d*.6} 156 146`,"none",o.weak?"#E0A69C":"#C9675A",o.weak?3:7);};
lzZF("prolapsus",{t:"Les organes du petit bassin descendent",sub:"Prolapsus génital : le plancher pelvien affaibli (accouchements, âge, efforts) laisse descendre utérus, vessie ou rectum",pt:[104,150],bg:"#FBEFEA",
 left:()=>lzPelvis({drop:34,weak:1}),
 inner:()=>lzR(186,34,124,124,0,"#F6DCD6","none")+[0,1,2,3,4].map(i=>lzP(`M186 ${70+i*12} C230 ${80+i*12} 270 ${80+i*12} 310 ${70+i*12}`,"none",i%2?"#E0A69C":"#EDBEB4",5)).join("")+lzP("M240 70 l8 60","none","#FBEFEA",10),
 zt:["Muscles du plancher","distendus"],
 extra:()=>lzLL(200,"Boule dans le vagin,\npesanteur en fin de journée",1)+lzLL(232,"Fuites urinaires, constipation",0),pill:"Rééducation du périnée ; pessaire ou chirurgie",
 cap:"Rééducation périnéale, pessaire, chirurgie selon la gêne ; éviter port de charges lourdes et constipation ; prévention par rééducation après l'accouchement."});
lzZF("iue",{t:"L'urine s'échappe lors d'un effort",sub:"Incontinence urinaire d'effort : le sphincter et le plancher pelvien ne résistent plus à la pression (toux, rire, sport)",pt:[90,128],bg:"#FBEFEA",
 left:()=>lzPelvis({weak:1})+lzArr(20,40,56,80,{c:"#56626E",w:2})+lzS(14,30,"toux, effort","start"),
 inner:()=>lzR(186,34,124,124,0,"#FBEFEA","none")+lzP("M206 40 C206 96 230 104 240 112 L256 112 C266 104 290 96 290 40 Z","url(#rg-bladder)","#C99A78",1.2)+lzP("M214 44 C214 90 234 98 244 104 L252 104 C262 98 282 90 282 44 Z","#FBF2C8","none")
  +lzP("M248 112 V158","none","#C99A78",12)+lzP("M248 112 V158","none","#FBF2C8",5)+lzP("M228 128 C240 132 256 132 268 128","none","#E0A69C",3)+lzDots(244,140,8,16,3,4,(x,y)=>lzP(`M${x} ${y} q2 4 0 6 q-2 -2 0 -6`,"#F2D46E","#B98B14",.6))+lzArr(248,30,248,60,{c:"#56626E",w:2}),
 zt:["Pression : le sphincter","laisse fuir l'urine"],
 extra:()=>lzLL(200,"Fuites en toussant, en riant,\nen portant",1)+lzLL(232,"Après accouchement, ménopause",0),pill:"Rééducation périnéale en premier",
 cap:"Rééducation du périnée (kinésithérapeute, sage-femme), perte de poids, traitement de la toux chronique ; protections adaptées, chirurgie (bandelette) si échec."});
/* ============ Grossesse ============ */
const lzGF2=(id,o)=>lzFF(id,Object.assign({map:"grossesse"},o));
const lzMpG2=(x,y)=>lzMpF(x,y);
lzGF2("fausse-couche",{t:"La grossesse s'arrête et l'œuf se décolle",sub:"Fausse couche spontanée : souvent au 1er trimestre, le plus souvent due à une anomalie de l'embryon",zones:["uterus","foetus"],fpt:[165,212],
 inner:()=>lzColG({open:1,blood:1}),zt:["Saignement, col","qui s'ouvre"],
 extra:()=>lzLL(200,"Saignements, douleurs\ncomme des règles",1)+lzLL(232,"Ce n'est pas la faute\nde la femme",0),pill:"Soutien psychologique ; Rhésus négatif : anti-D",
 cap:"Échographie, surveillance des saignements ; expulsion naturelle, médicamenteuse ou aspiration ; injection d'anti-D si Rhésus négatif ; accompagner le deuil périnatal."});
lzGF2("map",{t:"Le col se raccourcit et s'ouvre trop tôt",sub:"Menace d'accouchement prématuré : contractions et modification du col avant 37 SA",zones:["col","uterus"],fpt:[165,212],
 inner:()=>lzColG({short:1})+lzArr(206,44,222,60,{c:LC.acc,w:1.6})+lzArr(290,44,274,60,{c:LC.acc,w:1.6}),zt:["Contractions, col court","(échographie < 25 mm)"],
 extra:()=>lzLL(200,"Contractions régulières,\nventre qui durcit",1)+lzLL(232,"Infection urinaire, grossesse\nmultiple, stress",0),pill:"Repos, tocolyse, corticoïdes pour les poumons du bébé",
 cap:"Tocolytiques, corticoïdes pour la maturation pulmonaire (avant 34 SA), sulfate de magnésium avant 32 SA (neuroprotection), recherche d'infection ; surveillance du col et du rythme cardiaque fœtal."});
lzGF2("preeclampsie",{t:"Le placenta est mal irrigué et la tension monte",sub:"Prééclampsie : HTA ≥ 140/90 et protéines dans les urines après 20 SA ; les artères du placenta restent étroites",zones:["placenta"],fpt:[110,58],
 inner:()=>lzPlac({narrow:1}),zt:["Artères spiralées étroites :","placenta qui souffre"],
 extra:()=>lzLL(200,"Maux de tête, mouches devant\nles yeux, barre épigastrique",1)+lzLL(232,"Œdèmes brutaux, prise de poids",0),pill:"Signes de gravité : urgence obstétricale",
 cap:"Surveillance tension, protéinurie, bilan (plaquettes, transaminases : HELLP), croissance du bébé ; antihypertenseurs, sulfate de magnésium ; la seule guérison est l'accouchement."});
lzGF2("eclampsie",{t:"La prééclampsie provoque des convulsions",sub:"Éclampsie : crise convulsive généralisée chez une femme enceinte ou juste accouchée ; urgence vitale",zones:["placenta"],fpt:[110,58],
 inner:()=>lzR(186,34,124,124,0,"#F5EEF6","none")+lzNeuron(226,88,1.2)+lzNeuron(272,110,1.2)+lzP("M248 44 l-10 22 h10 l-8 22","none","#F2B705",3)+lzP("M292 54 l-8 16 h8 l-6 16","none","#F2B705",2.4),
 zt:["Décharge électrique","dans le cerveau"],
 extra:()=>lzLL(200,"Convulsions, puis coma possible",1)+lzLL(232,"Précédée de céphalées,\ntroubles visuels",0),pill:"Position latérale, oxygène, sulfate de magnésium",
 cap:"Protéger des chocs, PLS, oxygène, sulfate de magnésium (surveiller réflexes, fréquence respiratoire, diurèse ; gluconate de calcium prêt), contrôle de la tension, extraction fœtale."});
lzGF2("hpp",{t:"Après l'accouchement, l'utérus ne se contracte pas",sub:"Hémorragie du post-partum : > 500 mL de sang dans les 24 h ; l'atonie utérine est la cause principale",zones:["uterus","placenta"],fpt:[238,76],
 inner:()=>lzR(186,34,124,124,0,"#F3C6BC","none")+[0,1,2,3,4].map(i=>lzP(`M186 ${48+i*22} C230 ${40+i*22} 270 ${56+i*22} 310 ${46+i*22}`,"none","#E3A69C",7)).join("")+[[214,60],[262,82],[236,108],[288,124]].map(([a,b])=>lzC(a,b,6,LC.blood,"#8E241C",1)+lzArr(a,b+6,a,b+24,{c:LC.blood,w:1.6})).join(""),
 zt:["Muscle relâché : les vaisseaux","restent ouverts et saignent"],
 extra:()=>lzLL(200,"Saignement abondant, utérus\nmou, pouls rapide",1)+lzLL(232,"Massage de l'utérus,\nsac de recueil gradué",0),pill:"Alerter, masser l'utérus, ocytocine, voie veineuse",
 cap:"Surveillance 2 h en salle de naissance (globe utérin, saignements, pouls, tension) ; massage utérin, ocytocine, révision utérine, remplissage, transfusion ; procédure d'alerte de l'équipe."});
lzGF2("placenta-praevia",{t:"Le placenta est inséré trop bas, devant le col",sub:"Placenta prævia : il recouvre tout ou partie du col ; saignements indolores au 3e trimestre",zones:["placenta","col"],fpt:[165,212],
 inner:()=>lzColG({prev:1,blood:1}),zt:["Placenta devant le col :","saigne quand le col bouge"],
 extra:()=>lzLL(200,"Saignement rouge, indolore,\nutérus souple",1)+lzLL(232,"Pas de toucher vaginal",0),pill:"Pas de toucher vaginal ; césarienne programmée",
 cap:"Hospitalisation si saignement, repos, surveillance ; échographie pour localiser ; césarienne si prævia recouvrant ; corticoïdes si risque de naissance prématurée."});
lzGF2("hrp",{t:"Un hématome décolle le placenta",sub:"Hématome rétroplacentaire : décollement prématuré du placenta, privant le bébé d'oxygène ; urgence",zones:["placenta","uterus"],fpt:[110,58],
 inner:()=>lzPlac({hrp:1}),zt:["Hématome entre placenta","et paroi de l'utérus"],
 extra:()=>lzLL(200,"Douleur brutale, ventre dur\n« de bois », saignement noir",1)+lzLL(232,"HTA, prééclampsie, choc,\ncocaïne, tabac",0),pill:"Urgence : extraction, risque de CIVD",
 cap:"Urgence obstétricale : voie veineuse, bilan (CIVD), extraction rapide si bébé vivant, surveillance hémodynamique, transfusion."});
lzGF2("rpm",{t:"La poche des eaux se rompt avant le travail",sub:"Rupture prématurée des membranes : écoulement de liquide amniotique ; risque d'infection qui remonte",zones:["liquide"],fpt:[165,212],
 inner:()=>lzColG({leak:1})+lzDots(244,120,10,30,6,5,lzCoc),zt:["Liquide qui s'écoule,","germes qui remontent"],
 extra:()=>lzLL(200,"Écoulement clair continu,\nlinge mouillé",1)+lzLL(232,"Surveiller température,\ncouleur du liquide",0),pill:"Fièvre ou liquide teinté : prévenir",
 cap:"Confirmer la rupture, prélèvement vaginal, antibiotiques selon le terme, corticoïdes si prématuré ; surveiller température, rythme cardiaque fœtal, aspect du liquide."});
/* ============ Infections sexuellement transmissibles ============ */
lzFF("gonococcie",{t:"Le gonocoque infecte l'urètre et le col",sub:"Gonococcie (chaude-pisse) : IST bactérienne, écoulement purulent chez l'homme, souvent silencieuse chez la femme",zones:["col","vagin"],fpt:[160,156],
 inner:()=>lzCervix({bact:1})+lzDots(204,44,90,10,6,9,(x,y)=>lzE(x,y,1.8,1.4,"#3E8E4A","none")+lzE(x+3.4,y,1.8,1.4,"#3E8E4A","none")),zt:["Diplocoques et pus","sur la muqueuse"],
 extra:()=>lzLL(200,"Brûlures en urinant,\nécoulement purulent",1)+lzLL(232,"Risque de salpingite\net de stérilité",0),pill:"Traiter les partenaires ; dépister les autres IST",
 cap:"Prélèvement (PCR), antibiotique injectable (ceftriaxone), dépistage des autres IST (VIH, syphilis, chlamydia), traitement des partenaires, préservatif."});
lzFF("chlamydiose",{t:"Une bactérie se cache dans les cellules du col",sub:"Chlamydiose : IST la plus fréquente chez les jeunes, souvent sans symptôme ; peut abîmer les trompes",zones:["col","trompes"],fpt:[160,156],
 inner:()=>lzCervix({chlam:1}),zt:["Bactéries à l'intérieur","des cellules (vert)"],
 extra:()=>lzLL(200,"Souvent aucun signe :\ndépistage des moins de 25 ans",1)+lzLL(232,"Stérilité, GEU, douleurs\npelviennes chroniques",0),pill:"Dépistage simple par PCR (urine, auto-prélèvement)",
 cap:"Azithromycine ou doxycycline, traitement des partenaires, abstinence ou préservatif pendant le traitement, contrôle ; dépistage gratuit en CeGIDD."});
lzFF("syphilis",{t:"Le tréponème entre par une plaie indolore",sub:"Syphilis : chancre indolore puis éruption, puis atteinte possible du cerveau et du cœur des années après",zones:["col","vagin"],fpt:[160,202],
 inner:()=>lzR(186,34,124,124,0,"#F6DCD6","none")+lzR(186,96,124,62,0,"#F2BFA9","none")+lzP("M212 96 C222 118 274 118 284 96 Z","#E8A096","#B83A2E",1.6)+lzDots(216,98,64,14,10,4,(x,y)=>lzP(`M${x} ${y} q1.5 -3 3 0 t3 0 t3 0 t3 0`,"none","#3E8E4A",1.1))+lzDots(206,120,90,30,8,6,(x,y)=>lzLymph(x,y,4)),
 zt:["Chancre : ulcération","propre, indolore"],
 extra:()=>lzLL(200,"Chancre indolore, puis éruption\n(paumes, plantes)",1)+lzLL(232,"Sérologie ; grossesse :\ndépistage obligatoire",0),pill:"Pénicilline injectable ; traiter les partenaires",
 cap:"Benzathine-pénicilline intramusculaire, suivi sérologique, dépistage des partenaires et des autres IST ; dépistage systématique en début de grossesse (syphilis congénitale)."});
lzFF("hpv",{t:"Le papillomavirus infecte la peau et les muqueuses",sub:"Infection à HPV : très fréquente ; souvent éliminée seule, elle peut donner des verrues génitales ou des lésions du col",zones:["col"],fpt:[160,156],
 inner:()=>lzCervix({dys:1,virus:1}),zt:["Virus dans l'épithélium,","cellules modifiées"],
 extra:()=>lzLL(200,"Condylomes (verrues),\nlésions précancéreuses",1)+lzLL(232,"Vaccination de 11 à 19 ans,\nfilles et garçons",0),pill:"Vaccin HPV + dépistage du col",
 cap:"Pas de traitement du virus : on traite les lésions (condylomes, lésions du col) ; préservatif (protection partielle), vaccination, dépistage par frottis ou test HPV."});
