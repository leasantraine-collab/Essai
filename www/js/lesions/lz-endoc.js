/* Carnet IFSI — schémas des lésions : endocrinologie, métabolisme et nutrition (33 pathologies). */
const lzMpE=(x,y)=>[lzN(-8+x*.62),lzN(18+y*.62)];
/* modèle générique : dessin à gauche (organe en contexte), loupe à droite sur le détail */
const lzZF=(id,o)=>lz(id,{t:o.t,sub:o.sub,h:o.h||278,ins:false,cap:o.cap,leg:o.leg,
 draw:()=>{const [px,py]=o.pt,H=o.h||278;return o.left()+(o.over?o.over():"")+lzZoom(id,px,py,248,96,62,`<rect x="186" y="34" width="124" height="124" style="fill:${o.bg||"#FBF1EF"}"/>`+o.inner())
  +(o.zt?lzS(248,176,o.zt[0],"middle","st-acc")+lzS(248,187,o.zt[1]||"","middle","st-acc"):"")+(o.extra?o.extra():"")+(o.pill?lzPill(160,H-12,o.pill,LC.acc):"");}});
const lzEF=(id,o)=>lzZF(id,Object.assign({left:()=>lzOrg("glandes",o.zones||[],-8,18,.62),pt:lzMpE(...(o.ept||[178,150]))},o));
/* glucose (hexagone), insuline (clé bleue) */
const lzGlu=(x,y,s=1)=>`<path d="${[...Array(6)].map((_,i)=>{const a=i*Math.PI/3;return `${i?"L":"M"}${lzN(x+Math.cos(a)*3.4*s)} ${lzN(y+Math.sin(a)*3.4*s)}`;}).join(" ")} Z" style="fill:#F2C94C;stroke:#A87A0C;stroke-width:.8"/>`;
const lzIns=(x,y)=>`<path d="M${lzN(x-2.8)} ${lzN(y)} L${lzN(x)} ${lzN(y-2.8)} L${lzN(x+2.8)} ${lzN(y)} L${lzN(x)} ${lzN(y+2.8)} Z" style="fill:#5B8DEF;stroke:#2F5FB8;stroke-width:.7"/>`;
const lzKet=(x,y)=>lzC(x,y,3,"#E8574A","#8E2219",.7)+`<text x="${lzN(x)}" y="${lzN(y+2.2)}" text-anchor="middle" style="font-size:5px;font-weight:700;fill:#fff">H+</text>`;
/* cellule (muscle, graisse) : récepteurs à insuline et canaux à glucose sur la membrane */
function lzCellIns(o={}){const C=[248,172],r=78;let s=lzC(C[0],C[1],r,"#FBE3CF","#C98E6C",3.4)+lzS(248,150,"cellule","middle");
 const at=a=>[C[0]+r*Math.cos(a),C[1]+r*Math.sin(a)];
 [-2.25,-1.95,-1.65,-1.35,-1.05,-0.8].forEach((a,i)=>{const [x,y]=at(a),nx=Math.cos(a),ny=Math.sin(a);
  if(i%2===0){const tx=x+nx*9,ty=y+ny*9;s+=lzP(`M${lzN(x)} ${lzN(y)} L${lzN(tx)} ${lzN(ty)} M${lzN(tx-ny*4)} ${lzN(ty+nx*4)} l${lzN(nx*4)} ${lzN(ny*4)} M${lzN(tx+ny*4)} ${lzN(ty-nx*4)} l${lzN(nx*4)} ${lzN(ny*4)}`,"none",o.resist?"#9AA3AB":"#2E7556",2);
   if(o.ins&&i/2<o.ins)s+=lzIns(tx+nx*3,ty+ny*3);}
  else{s+=lzP(`M${lzN(x-ny*4)} ${lzN(y+nx*4)} l${lzN(nx*6)} ${lzN(ny*6)} M${lzN(x+ny*4)} ${lzN(y-nx*4)} l${lzN(nx*6)} ${lzN(ny*6)}`,"none",o.open?"#B98B14":"#9AA3AB",3);
   s+=o.open?lzArr(x+nx*16,y+ny*16,x-nx*14,y-ny*14,{c:"#B98B14",w:1.4,hl:5}):lzP(`M${lzN(x+nx*4-3)} ${lzN(y+ny*4-3)} l6 6 M${lzN(x+nx*4+3)} ${lzN(y+ny*4-3)} l-6 6`,"none",LC.acc,1.6);}});
 return s+lzDots(196,40,104,40,o.gOut||4,3,(x,y)=>lzGlu(x,y))+lzDots(214,122,64,16,o.gIn||0,5,(x,y)=>lzGlu(x,y));}
/* îlot de Langerhans : cellules bêta (insuline) ; o.kill (lymphocytes qui détruisent), o.tired (peu de grains) */
function lzIslet(o={}){const R=lzRnd(4);let s=lzC(248,96,46,"#F5DCC4","#D8A86A",1)+lzC(248,96,34,"#E9F2DF","#8DB57E",1.2);
 for(let i=0;i<13;i++){const a=i*2.4,rr=i===0?0:9+Math.sqrt(i)*6.5,x=248+Math.cos(a)*rr,y=96+Math.sin(a)*rr,dead=o.kill&&R()<.6;
  s+=lzC(x,y,6.4,dead?"#E5E1DC":"#C9E4BA",dead?"#B5ADA5":"#5E9E52",.9,dead?";stroke-dasharray:2 1.5":"")+lzC(x,y,2.2,dead?"#C9C1B8":"#4C7F43","none");
  if(!dead&&!o.none)s+=lzDots(x-4,y-4,8,8,o.tired?1:3,i+2,(a,b)=>lzC(a,b,.9,"#2F5FB8","none"));}
 if(o.kill)s+=lzDots(214,62,68,68,8,9,(x,y)=>lzLymph(x,y,5));
 return s;}
/* vaisseau en coupe longitudinale contenant du glucose */
const lzVesG=(n,extra="")=>lzArtL(186,58,124,64,7,{rbc:4,seed:5})+lzDots(192,68,112,44,n,6,(x,y)=>lzGlu(x,y,1.1))+extra;
/* ============ Diabètes et glycémie ============ */
lzEF("dt1",{t:"Le pancréas ne fabrique plus d'insuline",sub:"Diabète de type 1 : le système immunitaire détruit les cellules bêta des îlots de Langerhans",zones:["pancreas"],
 inner:()=>lzIslet({kill:1}),zt:["Lymphocytes qui détruisent","les cellules à insuline"],
 extra:()=>lzLL(200,"Sans insuline, le sucre\nne rentre plus dans les cellules",0)+lzLL(232,"Enfant, adulte jeune ;\nsoif, urines, amaigrissement",1),pill:"Insuline à vie, plusieurs fois par jour",
 cap:"Insuline (stylo ou pompe), autosurveillance glycémique, adaptation des doses à l'alimentation et à l'activité ; risque d'**acidocétose** si l'insuline manque, d'hypoglycémie si elle est en excès."});
lzEF("dt2",{t:"L'insuline est là mais les cellules y répondent mal",sub:"Diabète de type 2 : résistance à l'insuline (surpoids, sédentarité) puis épuisement progressif du pancréas",zones:["pancreas"],
 inner:()=>lzCellIns({ins:3,resist:1,gOut:12,gIn:1}),bg:"#FDF3EE",zt:["L'insuline ne fait plus","entrer le sucre"],
 extra:()=>lzLL(200,"Souvent silencieux pendant\ndes années",0)+lzLL(232,"Complications : yeux, reins,\nnerfs, cœur, pieds",1),pill:"Bouger et bien manger : le 1er traitement",
 cap:"Mesures hygiéno-diététiques, metformine puis autres traitements, insuline si besoin ; HbA1c tous les 3 mois ; dépistage des complications (fond d'œil, rein, pieds, cœur)."});
lzEF("diabete-gesta",{t:"Les hormones de la grossesse freinent l'insuline",sub:"Diabète gestationnel : le placenta produit des hormones qui rendent la mère résistante à l'insuline",zones:["pancreas","gonades"],
 inner:()=>lzCellIns({ins:3,resist:1,gOut:9,gIn:1})+lzDots(196,40,104,30,5,7,(x,y)=>lzC(x,y,2.6,"#C35B51","#80302A",.6)),bg:"#FDF3EE",zt:["Hormones du placenta (rouge) :","l'insuline agit moins bien"],
 extra:()=>lzLL(200,"Dépisté entre 24 et 28 SA\n(HGPO)",0)+lzLL(232,"Gros bébé, hypoglycémie\nnéonatale, risque futur de DT2",1),pill:"Glycémies capillaires et alimentation adaptée",
 cap:"Autosurveillance glycémique, conseils diététiques, activité physique, insuline si les objectifs ne sont pas atteints ; disparaît après l'accouchement mais dépistage du diabète ensuite."});
lzZF("hypoglycemie",{t:"Le cerveau manque de sucre",sub:"Hypoglycémie : glycémie < 0,70 g/L (diabétique traité) ; excès d'insuline, repas sauté, effort, alcool",pt:[86,80],
 left:()=>lzOrg("cerveau",[],-6,20,.6),
 inner:()=>lzVesG(1)+lzNeuron(230,140,1,{fade:1})+lzNeuron(272,140,1),zt:["Très peu de glucose :","les neurones s'éteignent"],
 extra:()=>lzLL(200,"Sueurs, tremblements, faim,\npâleur, palpitations",0)+lzLL(232,"Puis confusion, malaise,\nconvulsions, coma",1),pill:"Conscient : 15 g de sucre ; sinon glucagon et 15",
 cap:"Contrôler la glycémie capillaire ; resucrage (3 morceaux de sucre ou un jus), recontrôler à 15 min, puis collation ; rechercher la cause et adapter le traitement."});
lzZF("hyperglycemie",{t:"Trop de sucre reste dans le sang",sub:"Hyperglycémie : glycémie > 1,26 g/L à jeun ; le rein laisse passer le sucre et l'eau dans les urines",pt:[80,92],
 left:()=>lzOrg("rein",["reins"],-8,18,.62),
 inner:()=>lzVesG(22),zt:["Sang chargé en glucose","(> 1,26 g/L à jeun)"],
 extra:()=>lzLL(200,"Soif, urines abondantes,\nfatigue, vision floue",1)+lzLL(232,"Sucre dans les urines\n(glycosurie)",0),pill:"Contrôler glycémie, cétones et hydratation",
 cap:"Rechercher la cause (oubli de traitement, infection, corticoïdes, repas) ; surveiller cétonémie ou cétonurie, hydratation ; adapter le traitement selon le protocole."});
lzZF("acidocetose",{t:"Sans insuline, les graisses brûlent et le sang devient acide",sub:"Acidocétose diabétique : le corps fabrique des corps cétoniques acides ; urgence vitale",pt:[86,112],
 left:()=>lzOrg("poumons",[],-10,22,.62),
 inner:()=>lzVesG(12)+lzDots(196,64,108,52,12,8,(x,y)=>lzKet(x,y)),zt:["Glucose + corps cétoniques","acides (H+) : pH < 7,30"],
 extra:()=>lzLL(200,"Respiration rapide et profonde\n(Kussmaul), haleine d'acétone",1)+lzLL(232,"Vomissements, douleurs\nabdominales, déshydratation",0),pill:"Urgence : insuline IV, réhydratation, potassium",
 cap:"Insuline intraveineuse à la seringue électrique, réhydratation, apport de potassium (surveillance de la kaliémie), surveillance horaire de la glycémie et de la cétonémie, de la conscience."});
lzZF("hyperosmolaire",{t:"Le sucre très élevé assèche les cellules",sub:"Syndrome hyperosmolaire : glycémie très haute sans cétose, déshydratation majeure, personne âgée souvent",pt:[86,80],
 left:()=>lzOrg("cerveau",[],-6,20,.6),
 inner:()=>lzVesG(30)+[[216,140],[262,142]].map(([a,b])=>lzE(a,b,16,10,"#F3D9E9","#9C5C86",1)+lzE(a,b,10,6,"#E7C3DA","none")+lzArr(a,b-12,a,b-24,{c:LC.fluidD,w:1.4})).join(""),zt:["Glucose très élevé : l'eau","sort des cellules"],
 extra:()=>lzLL(200,"Glycémie > 6 g/L,\nsoif, confusion, coma",1)+lzLL(232,"Déshydratation profonde,\nrisque de thrombose",0),pill:"Urgence : réhydratation prudente et insuline",
 cap:"Réhydratation progressive (risque d'œdème cérébral si trop rapide), insuline, potassium, prévention des thromboses et des escarres ; surveiller la conscience et la diurèse."});
/* ============ Thyroïde ============ */
/* cou de face : larynx, trachée, thyroïde ; o.big (goitre), o.nod [[x,y,r]], o.k (cancer), o.small, o.red, o.para (parathyroïdes) */
function lzNeck(o={}){const k=o.big||1,col=o.red?"#D9584C":o.small?"#C98A80":"url(#rg-thyroid)";
 let s=lzP("M50 6 C50 30 52 56 54 78 C40 100 16 110 4 128 L4 170 L188 170 L188 128 C176 110 152 100 138 78 C140 56 142 30 142 6 Z","url(#rg-skin)","#B98868",1)+lzP("M50 6 Q96 30 142 6","none","#B98868",1.2)
  +lzP("M80 34 L112 34 L108 58 Q96 66 84 58 Z","#EBDCC9","#B9A58A",1)+lzR(86,66,20,100,6,"#EEE6DA","#B9A58A",1)+[...Array(9)].map((_,i)=>lzP(`M87 ${74+i*10} h18`,"none","#C9B89E",1.6)).join("");
 const L=(cx,cy)=>`<ellipse cx="${cx}" cy="${cy}" rx="${lzN(15*k*(o.small?.75:1))}" ry="${lzN(25*k*(o.small?.8:1))}" style="fill:${col};stroke:#7E2C25;stroke-width:1"/>`;
 s+=L(76-(k-1)*12,106)+L(116+(k-1)*12,106)+lzR(84,104,24,12,5,col,"#7E2C25",.8);
 if(o.para)s+=[[66,92],[86,90],[106,90],[126,92],[66,124],[126,124]].slice(0,4).map(([a,b],i)=>lzE(i%2?126:66,i<2?90:124,4.2,3.4,"#F2D06B","#B98B14",.9)).join("");
 if(o.nod)s+=o.nod.map(([a,b,r])=>lzC(a,b,r,"#E59A8D","#8E2A22",1.2)).join("");
 if(o.k)s+=lzP("M110 96 C120 90 132 96 130 108 C134 116 124 124 116 120 C108 124 102 112 106 106 Z","#8E6A8F","#5A3D5C",1.2)+lzP("M130 106 l8 -4 M128 116 l8 4","none","#5A3D5C",1.4);
 return s;}
/* follicules thyroïdiens dans la loupe : normal, hypo (cellules aplaties), hyper (hautes, colloïde festonnée), hashi (lymphocytes), cancer */
function lzFoll(kind="normal"){let s="";const P=[[214,62],[250,52],[286,66],[226,98],[266,96],[300,104],[212,134],[250,132],[288,138]];
 P.forEach(([x,y],i)=>{const r=14,broken=kind==="hashi"&&i%3===0,cell=kind==="hypo"?1.8:kind==="hyper"?5.6:3.4;
  if(kind==="cancer"&&i>3)return;
  s+=lzC(x,y,r+cell,broken?"#E8DAD6":"#E7A296",broken?"#B5ADA5":"#A5473D",.8,broken?";stroke-dasharray:3 2":"")+lzC(x,y,r,kind==="hyper"?"#F7D9B8":"#F2BF8E",kind==="hyper"?"#C98E6C":"none",kind==="hyper"?1.2:0,kind==="hyper"?";stroke-dasharray:2 2":"");
  if(kind==="hyper")s+=lzDots(x+r,y-6,10,12,3,i+3,(a,b)=>lzC(a,b,1.6,"#E8893A","none"));});
 if(kind==="hashi")s+=lzDots(196,40,110,110,26,6,(x,y)=>lzLymph(x,y,4));
 if(kind==="cancer")s+=lzDots(204,110,96,44,26,7,(x,y,R)=>lzC(x,y,4.6,"#C9B3E6","#6A55A0",.7)+lzC(x+.6,y,2.6,"#5A3D8C","none"))+lzP("M196 108 C230 96 270 112 310 100","none","#5A3D5C",2,";stroke-dasharray:4 3");
 return s;}
const lzTF=(id,o)=>lzZF(id,Object.assign({left:()=>lzNeck(o.neck||{}),pt:o.pt||[76,106],bg:"#F8E6DA"},o));
lzTF("hypothyroidie",{t:"La thyroïde ne fabrique pas assez d'hormones",sub:"Hypothyroïdie : tout le corps ralentit (cœur, digestion, pensée, température)",neck:{small:1},
 inner:()=>lzFoll("hypo"),zt:["Cellules aplaties,","peu d'hormones T3-T4"],
 extra:()=>lzLL(200,"Fatigue, frilosité, prise de poids,\nconstipation, peau sèche",0)+lzLL(232,"TSH élevée, T4 basse",1),pill:"Lévothyroxine à jeun, tous les jours, à vie",
 cap:"Lévothyroxine le matin à jeun, à distance du fer et du calcium ; contrôle de la TSH 6 à 8 semaines après chaque changement de dose ; prudence chez le cardiaque (augmenter progressivement)."});
lzTF("hyperthyroidie",{t:"La thyroïde fabrique trop d'hormones",sub:"Hyperthyroïdie : tout s'accélère (cœur, digestion, nervosité), amaigrissement",neck:{big:1.1},
 inner:()=>lzFoll("hyper"),zt:["Cellules très actives :","beaucoup d'hormones"],
 extra:()=>lzLL(200,"Tachycardie, tremblements, sueurs,\nperte de poids, diarrhée",1)+lzLL(232,"TSH effondrée, T4 élevée",0),pill:"Surveiller pouls, poids, tolérance des traitements",
 cap:"Bêtabloquant pour les symptômes, antithyroïdiens de synthèse (surveiller les globules blancs : fièvre ou angine = NFS en urgence), iode radioactif ou chirurgie selon la cause."});
lzTF("basedow",{t:"Des anticorps stimulent la thyroïde en permanence",sub:"Maladie de Basedow : maladie auto-immune, cause la plus fréquente d'hyperthyroïdie ; atteinte des yeux possible",neck:{big:1.2,red:1},
 inner:()=>lzFoll("hyper")+lzDots(198,40,104,110,12,4,(x,y)=>lzY(x,y,"#5B8DEF")),zt:["Anticorps (bleus) qui","imitent la TSH"],
 extra:()=>lzLL(200,"Goitre, tachycardie,\nyeux saillants (exophtalmie)",1)+lzLL(232,"Femme jeune le plus souvent",0),pill:"Antithyroïdiens : fièvre ou angine = NFS en urgence",
 cap:"Antithyroïdiens de synthèse, bêtabloquant, parfois iode radioactif ou chirurgie ; protéger les yeux (larmes artificielles, lunettes), arrêt du tabac qui aggrave l'atteinte oculaire."});
lzTF("hashimoto",{t:"Les défenses détruisent peu à peu la thyroïde",sub:"Thyroïdite de Hashimoto : des lymphocytes infiltrent la glande, qui finit par ne plus produire assez",neck:{big:1.1},
 inner:()=>lzFoll("hashi"),zt:["Lymphocytes qui envahissent","et détruisent les follicules"],
 extra:()=>lzLL(200,"Thyroïde ferme, parfois\nun peu grosse",0)+lzLL(232,"Évolue vers l'hypothyroïdie",1),pill:"Contrôle régulier de la TSH",
 cap:"Cause la plus fréquente d'hypothyroïdie ; anticorps anti-TPO ; lévothyroxine quand la TSH monte ; associée à d'autres maladies auto-immunes."});
lzTF("nodules-thyroide",{t:"Une boule se forme dans la thyroïde",sub:"Nodule thyroïdien : très fréquent, le plus souvent bénin ; parfois sécrétant ou cancéreux",neck:{nod:[[118,98,9]]},pt:[118,98],
 inner:()=>lzFoll("normal")+lzC(258,98,40,"rgba(240,190,180,.85)","#8E2A22",2)+lzDots(226,68,64,60,12,5,(x,y)=>lzC(x,y,6,"#F2BF8E","#A5473D",.8)),zt:["Nodule entouré","d'une capsule"],
 extra:()=>lzLL(200,"Découvert à la palpation\nou à l'échographie",0)+lzLL(232,"Bilan : TSH, échographie,\nponction si besoin",1),pill:"La plupart des nodules sont bénins",
 cap:"Échographie (score de risque), ponction à l'aiguille fine selon la taille et l'aspect ; scintigraphie si TSH basse (nodule « chaud ») ; chirurgie si suspect ou gênant."});
lzTF("cancer-thyroide",{t:"Des cellules thyroïdiennes deviennent cancéreuses",sub:"Cancer de la thyroïde : souvent un nodule qui grossit ; le plus fréquent (papillaire) a un très bon pronostic",neck:{k:1},pt:[118,106],
 inner:()=>lzFoll("cancer"),zt:["Cellules anormales qui","franchissent la capsule"],
 extra:()=>lzLL(200,"Nodule dur, ganglion du cou,\nvoix rauque parfois",1)+lzLL(232,"Après chirurgie : hormones\nà vie, calcium surveillé",0),pill:"Après thyroïdectomie : surveiller calcium et voix",
 cap:"Thyroïdectomie (surveillance : hématome du cou, voix, hypocalcémie avec fourmillements), iode radioactif selon le cas, lévothyroxine ; suivi par thyroglobuline et échographie."});
lzTF("goitre",{t:"La thyroïde grossit",sub:"Goitre : augmentation de volume de la thyroïde, avec un fonctionnement normal, ralenti ou accéléré",neck:{big:1.45,nod:[[60,96,7],[130,116,6]]},pt:[64,108],
 inner:()=>lzFoll("normal")+lzC(290,140,12,"#F2BF8E","#A5473D",1),zt:["Follicules plus nombreux","et plus gros"],
 extra:()=>lzLL(200,"Cou gonflé ; gêne pour avaler\nou respirer s'il comprime",1)+lzLL(232,"Carence en iode, Basedow,\nnodules, thyroïdite",0),pill:"Surveiller une compression (voix, respiration)",
 cap:"Bilan : TSH, échographie ; traitement selon la cause (iode, traitement d'une hyper- ou hypothyroïdie, chirurgie si compression ou suspicion de cancer)."});
/* ============ Surrénales ============ */
/* surrénale en coupe dans la loupe : 3 couches du cortex + médullaire ; o.gone (cortex détruit), o.big (couche fasciculée épaisse), o.ad (adénome de la glomérulée), o.pheo */
function lzAdr(o={}){let s=lzP("M200 140 C196 92 220 50 248 46 C276 50 300 92 296 140 Z","#F2D06B","#B98B14",1.2);
 const layer=(d,c)=>lzP(d,c,"rgba(120,80,20,.35)",.6);
 s+=layer("M206 138 C204 96 224 58 248 54 C272 58 292 96 290 138 Z",o.gone?"#E5E1DC":"#F5DD8C")+layer("M214 136 C212 100 228 66 248 62 C268 66 284 100 282 136 Z",o.gone?"#DCD6CF":o.big?"#F2C14E":"#F2CD6B")
  +layer(`M${o.big?230:224} 134 C${o.big?228:222} 108 ${o.big?238:234} 80 248 ${o.big?82:76} C${o.big?258:262} 80 ${o.big?268:274} 108 ${o.big?266:272} 134 Z`,o.gone?"#D3CBC2":"#E8B04A")
  +layer("M234 132 C234 112 240 94 248 92 C256 94 262 112 262 132 Z",o.pheo?"#8E6A8F":"#B9584A");
 if(o.gone)s+=lzDots(206,60,84,76,10,4,(x,y)=>lzLymph(x,y,4));
 if(o.ad)s+=lzC(216,96,12,"#F6E3A1","#B98B14",1.4);
 if(o.pheo)s+=lzDots(232,96,32,36,10,3,(x,y)=>lzC(x,y,1.6,"#E8574A","none"));
 return s;}
const lzAF=(id,o)=>lzEF(id,Object.assign({zones:["surrenales"],ept:[132,113],bg:"#FBF3E4"},o));
lzAF("addison",{t:"Les surrénales ne fabriquent plus assez de cortisol",sub:"Insuffisance surrénalienne (Addison) : le cortex est détruit, souvent par une maladie auto-immune",
 inner:()=>lzAdr({gone:1}),zt:["Cortex détruit : manque de","cortisol et d'aldostérone"],
 extra:()=>lzLL(200,"Fatigue, hypotension, perte de poids,\npeau bronzée, envie de sel",0)+lzLL(232,"Risque de crise aiguë :\ndéshydratation, choc",1),pill:"Hydrocortisone : jamais d'arrêt, doubler si fièvre",
 cap:"Hydrocortisone et fludrocortisone à vie ; carte d'insuffisant surrénalien, kit d'injection ; en cas de stress (fièvre, vomissements, chirurgie) les doses sont augmentées : la crise est une urgence."});
lzAF("cushing",{t:"Trop de cortisol transforme le corps",sub:"Syndrome de Cushing : excès de cortisol (médicaments corticoïdes, tumeur de l'hypophyse ou de la surrénale)",zones:["surrenales","hypophyse"],
 inner:()=>lzAdr({big:1}),zt:["Couche fasciculée qui","produit trop de cortisol"],
 extra:()=>lzLL(200,"Visage arrondi, bosse de bison,\nventre gros, vergetures pourpres",1)+lzLL(232,"Diabète, HTA, ostéoporose,\nfragilité de la peau",0),pill:"Corticoïdes : jamais d'arrêt brutal",
 cap:"Le plus souvent dû aux corticoïdes : surveiller glycémie, tension, poids, peau, humeur ; prévention de l'ostéoporose ; arrêt toujours progressif. Sinon traiter la tumeur."});
lzAF("hyperaldosteronisme",{t:"Trop d'aldostérone retient le sel et chasse le potassium",sub:"Hyperaldostéronisme : un adénome ou une hyperplasie des surrénales sécrète trop d'aldostérone",
 inner:()=>lzAdr({ad:1}),zt:["Adénome de la couche","glomérulée"],
 extra:()=>lzLL(200,"HTA difficile à traiter",1)+lzLL(232,"Potassium bas : crampes,\nfaiblesse, troubles du rythme",0),pill:"Surveiller tension et kaliémie",
 cap:"Penser à cette cause devant une HTA résistante ou avec hypokaliémie ; spironolactone ou chirurgie de l'adénome ; surveillance de la kaliémie et de la tension."});
lzAF("pheochromocytome",{t:"Une tumeur libère de l'adrénaline par à-coups",sub:"Phéochromocytome : tumeur de la médullosurrénale qui sécrète adrénaline et noradrénaline",
 inner:()=>lzAdr({pheo:1}),zt:["Tumeur de la médullaire :","décharges d'adrénaline"],
 extra:()=>lzLL(200,"Crises : maux de tête, sueurs,\npalpitations, HTA très élevée",1)+lzLL(232,"Dosage des métanéphrines",0),pill:"Crise hypertensive : urgence",
 cap:"Chirurgie après préparation par alphabloquants (risque de crise pendant l'opération) ; surveillance tensionnelle rapprochée et de la glycémie après l'ablation."});
/* ============ Parathyroïdes et calcium ============ */
/* circuit du calcium : os, sang, rein, intestin */
function lzCaLoop(o={}){const box=(x,y,t,c)=>lzR(x-27,y-12,54,24,9,c,"rgba(90,60,30,.35)",1)+lzS(x,y+3.5,t,"middle","st-b");
 let s=box(248,56,"os","#F6EEDA")+box(248,136,"sang",LC.plasma)+box(216,96,"intestin","#F7D4C3")+box(282,96,"rein","#E9B8A8");
 const up=o.dir===1,a=(x1,y1,x2,y2,w)=>lzArr(x1,y1,x2,y2,{c:o.c||"#1E5A6D",w:w||2});
 s+=up?a(248,69,248,122,3.6)+a(224,109,238,123,1.6)+a(274,109,258,123,1.6):a(248,122,248,70,1.6)+a(238,123,224,109,1.6)+a(258,123,274,109,1.6);
 return s+lzDots(232,140,32,4,o.ca||5,4,(x,y)=>lzC(x,y,1.6,"#F4F1E8","#8E8A7E",.6));}
lzTF("hyperparathyroidie",{t:"Une parathyroïde fabrique trop de PTH",sub:"Hyperparathyroïdie : la PTH sort le calcium des os ; le calcium du sang monte",neck:{para:1,nod:[[126,124,6]]},pt:[126,124],bg:"#F5F1EA",
 inner:()=>lzCaLoop({dir:1,ca:9}),zt:["La PTH vide les os","de leur calcium"],
 extra:()=>lzLL(200,"Fatigue, soif, calculs rénaux,\nos fragiles, constipation",0)+lzLL(232,"Calcium et PTH élevés",1),pill:"Boire beaucoup ; surveiller la calcémie",
 cap:"Le plus souvent un adénome d'une seule glande : ablation chirurgicale ; hydratation, surveillance de la calcémie et de la fonction rénale ; prévention de l'ostéoporose."});
lzTF("hypoparathyroidie",{t:"Il manque de PTH : le calcium du sang baisse",sub:"Hypoparathyroïdie : le plus souvent après une chirurgie de la thyroïde (glandes abîmées ou retirées)",neck:{para:1},pt:[66,90],bg:"#F5F1EA",
 inner:()=>lzCaLoop({dir:0,ca:2,c:"#9AA3AB"}),zt:["Moins de calcium libéré","dans le sang"],
 extra:()=>lzLL(200,"Fourmillements autour de la bouche,\ncrampes, spasmes des mains",1)+lzLL(232,"Signes de Chvostek, Trousseau",0),pill:"Après thyroïdectomie : surveiller la calcémie",
 cap:"Calcium et vitamine D active sur prescription ; hypocalcémie aiguë (tétanie, laryngospasme) : calcium intraveineux en urgence ; surveillance ECG."});
lzZF("hypercalcemie",{t:"Trop de calcium dans le sang",sub:"Hypercalcémie : hyperparathyroïdie ou cancer (métastases osseuses) le plus souvent",pt:[86,80],bg:"#F5F1EA",
 left:()=>lzOrg("squelette",["rachis","bassin"],-8,14,.62),
 inner:()=>lzCaLoop({dir:1,ca:10}),zt:["Les os libèrent trop","de calcium"],
 extra:()=>lzLL(200,"Soif, urines abondantes, nausées,\nconstipation, confusion",0)+lzLL(232,"Risque de trouble du rythme\net d'insuffisance rénale",1),pill:"Hydrater et surveiller l'ECG",
 cap:"Réhydratation intraveineuse, bisphosphonates selon la cause, arrêt des apports de calcium et de vitamine D ; surveillance de la conscience, de la diurèse, de l'ECG (QT court)."});
lzZF("hypocalcemie",{t:"Pas assez de calcium : les nerfs s'emballent",sub:"Hypocalcémie : hypoparathyroïdie, carence en vitamine D, insuffisance rénale, pancréatite",pt:[96,96],bg:"#F5F1EA",
 left:()=>lzBody(96,24,1.02),
 inner:()=>lzCaLoop({dir:0,ca:2,c:"#9AA3AB"}),zt:["Peu de calcium","dans le sang"],
 over:()=>lzP("M64 100 q-4 6 -2 12 M128 100 q4 6 2 12","none",LC.acc,2.4)+lzC(96,29,4,"none",LC.acc,1.6),
 extra:()=>lzLL(200,"Fourmillements, crampes,\nmains en « main d'accoucheur »",1)+lzLL(232,"Risque : laryngospasme,\nconvulsions, troubles du rythme",0),pill:"Tétanie : calcium IV sur prescription, ECG",
 cap:"Corriger selon la cause (calcium, vitamine D, magnésium) ; surveiller ECG (QT long) et signes neuromusculaires ; perfusion de calcium sur voie sûre (veinotoxique)."});
/* ============ Poids, lipides, os ============ */
const lzAdipo=(x,y,r)=>lzC(x,y,r,"#FDEDB9","#D6B25E",1)+lzC(x+r*.55,y+r*.45,r*.18,"#C9A24E","none");
lzZF("obesite",{t:"Les cellules graisseuses gonflent et s'enflamment",sub:"Obésité : IMC ≥ 30 ; la graisse du ventre (viscérale) est la plus dangereuse pour le cœur et le métabolisme",pt:[96,87],bg:"#FFF8E6",
 left:()=>`<g transform="translate(96 24) scale(1.02)"><circle cx="0" cy="0" r="11" style="fill:${LC.skin};stroke:${LC.skinD};stroke-width:1"/><path d="M-5 10 L-26 19 Q-34 26 -36 40 L-38 76 L-31 78 L-28 44 L-26 84 L-18 148 L-5 148 L-1 96 L1 96 L5 148 L18 148 L26 84 L28 44 L31 78 L38 76 L36 40 Q34 26 26 19 L5 10 Z" style="fill:${LC.skin};stroke:${LC.skinD};stroke-width:1"/><ellipse cx="0" cy="62" rx="20" ry="18" style="fill:rgba(242,201,76,.55);stroke:#B98B14;stroke-width:1"/></g>`,
 inner:()=>[[218,70,14],[252,64,18],[288,76,14],[230,110,20],[274,114,18],[212,144,12],[252,146,14],[296,142,12]].map(([a,b,r])=>lzAdipo(a,b,r)).join("")+lzDots(200,50,100,100,6,5,(x,y)=>lzWbc(x,y,3.4)),zt:["Adipocytes énormes,","inflammation"],
 extra:()=>lzLL(200,"Graisse autour des organes\ndu ventre (tour de taille)",1)+lzLL(232,"Diabète, HTA, apnées du sommeil,\narthrose, cancers",0),pill:"Une maladie chronique : accompagner sans juger",
 cap:"Prise en charge globale : alimentation, activité physique, sommeil, soutien psychologique, traitements médicamenteux ou chirurgie bariatrique selon les cas ; matériel adapté (brassard, lit, fauteuil)."});
lzZF("syndrome-metabolique",{t:"Plusieurs facteurs de risque s'additionnent",sub:"Syndrome métabolique : tour de taille élevé + au moins deux anomalies (tension, glycémie, triglycérides, HDL)",pt:[96,96],bg:"#FDF3EE",
 left:()=>lzBody(96,24,1.02,{ex:lzE(0,58,19,14,"rgba(242,201,76,.6)","#B98B14",1)}),
 inner:()=>[["tour de|taille",248,56],["tension",288,86],["glycémie",272,132],["triglycé-|rides",224,132],["HDL|bas",208,86]].map(([t,a,b])=>lzC(a,b,19,"#FBE3DE","#C8372D",1.2)+`<text x="${a}" y="${b+(t.includes("|")?-1:3)}" text-anchor="middle" class="st-b" style="font-size:7.6px">${t.split("|").map((l,i)=>`<tspan x="${a}" dy="${i?9:0}">${esc(l)}</tspan>`).join("")}</text>`).join("")+lzC(248,96,10,"#C8372D","none")+`<text x="248" y="100" text-anchor="middle" style="fill:#fff;font-weight:800;font-size:11px">!</text>`,
 zt:["Au moins 3 critères","sur 5"],
 extra:()=>lzLL(200,"Risque d'infarctus, d'AVC\net de diabète multiplié",1)+lzLL(232,"Tour de taille : > 94 cm (H),\n> 80 cm (F)",0),pill:"Activité physique et alimentation agissent sur tout",
 cap:"Dépister chaque composante (tension, glycémie, bilan lipidique, tour de taille) ; éducation à la santé, arrêt du tabac ; traitements selon chaque anomalie."});
const lzLDL=(x,y)=>lzC(x,y,3.4,"#F2C94C","#B98B14",.8)+lzC(x,y,1.4,"#FFF5CC","none");
const lzLipArt=(n,plaque=1)=>lzArtL(186,46,124,100,12,{rbc:4,seed:5})+lzDots(196,64,108,58,n,6,(x,y)=>lzLDL(x,y))+(plaque?lzP("M206 134 C222 108 266 108 290 134 Z",LC.fat,LC.fatD,1)+lzDots(214,118,66,14,7,3,(x,y)=>lzC(x,y,2,"#E8B33C","none"))+lzArr(240,96,244,116,{c:"#B98B14",w:1.4}):"");
lzZF("dyslipidemie",{t:"Trop de graisses dans le sang se déposent dans les artères",sub:"Dyslipidémie : LDL-cholestérol ou triglycérides trop élevés, HDL trop bas ; facteur de risque d'athérome",pt:[150,100],
 left:()=>lzOrg("coeur",["coronaires","aorte"],-8,14,.62),
 inner:()=>lzLipArt(16),zt:["Le LDL (jaune) entre dans la","paroi et forme une plaque"],
 extra:()=>lzLL(200,"Aucun symptôme : découverte\nsur un bilan lipidique",0)+lzLL(232,"Risque d'infarctus, d'AVC,\nd'artérite des jambes",1),pill:"Bilan lipidique à jeun ; statines si besoin",
 cap:"Alimentation (moins de graisses saturées, plus de fibres), activité physique, arrêt du tabac ; statines (surveiller douleurs musculaires et transaminases) ; objectifs selon le risque cardiovasculaire."});
lzZF("hypercholesterolemie",{t:"Le LDL-cholestérol s'accumule dans la paroi des artères",sub:"Hypercholestérolémie : alimentation, hérédité (familiale), diabète, hypothyroïdie",pt:[150,100],
 left:()=>lzOrg("coeur",["coronaires","aorte"],-8,14,.62),
 inner:()=>lzLipArt(24),zt:["Plaque d'athérome qui","rétrécit l'artère"],
 extra:()=>lzLL(200,"Parfois dépôts sur la peau,\nles tendons, autour des yeux",0)+lzLL(232,"Forme familiale : infarctus\njeune dans la famille",1),pill:"Statines : ne pas arrêter sans avis",
 cap:"Mesures diététiques et activité physique ; statines, ézétimibe ou autres selon l'objectif de LDL ; dépistage des apparentés en cas de forme familiale."});
lzZF("hypertriglyceridemie",{t:"Le sang se charge de triglycérides",sub:"Hypertriglycéridémie : alcool, sucres, diabète déséquilibré, obésité ; au-delà de 10 g/L, risque de pancréatite",pt:[102,111],
 left:()=>lzOrg("digestif",["pancreas","foie"],-8,18,.62),
 inner:()=>lzArtL(186,46,124,100,12,{rbc:4,seed:5,plasma:"#FBEFD8"})+lzDots(196,62,108,66,30,8,(x,y,R)=>lzC(x,y,2+R()*2.4,"#FFF6D6","#D6B25E",.6)),zt:["Sang « laiteux », chargé","de gouttelettes de graisse"],
 extra:()=>lzLL(200,"Foie gras (stéatose)",0)+lzLL(232,"Très élevé : pancréatite aiguë\n(douleur abdominale intense)",1),pill:"Réduire alcool et sucres rapides",
 cap:"Arrêt de l'alcool, réduction des sucres et des graisses, activité physique, équilibre du diabète ; fibrates ou oméga-3 selon prescription."});
/* articulation du gros orteil */
const lzToe=(o={})=>lzP("M10 120 C40 104 70 98 100 100 C130 102 150 96 176 100 C196 104 202 124 192 138 C180 150 140 150 100 148 C60 146 30 146 10 144 Z","url(#rg-skin)","#B98868",1)
 +lzP("M14 118 C40 112 70 112 90 116 L92 134 C70 136 40 136 14 134 Z","url(#rg-bone)","#C9B88E",1)+lzP("M104 116 C130 112 160 114 176 120 C182 128 178 136 170 138 C150 140 124 138 104 136 Z","url(#rg-bone)","#C9B88E",1)
 +lzE(97,125,14,16,o.red?"rgba(232,80,60,.55)":"rgba(160,200,230,.35)",o.red?"#C8372D":"#8DB3C9",1.4)+(o.ex||"");
lzZF("goutte",{t:"Des cristaux d'acide urique se déposent dans l'articulation",sub:"Goutte : l'acide urique trop élevé forme des aiguilles qui déclenchent une inflammation très douloureuse",pt:[89,121],bg:"#FDF3EE",
 left:()=>`<g transform="translate(0 6) scale(.92)">`+lzToe({red:1,ex:lzDots(88,114,18,22,8,3,(x,y,R)=>lzP(`M${lzN(x)} ${lzN(y)} l${lzN(4+R()*3)} ${lzN(-2-R()*3)}`,"none","#F4F1E8",1.4))})+"</g>"+lzS(40,166,"gros orteil (crise de goutte)","start"),
 inner:()=>lzR(186,34,124,124,0,"#F6DCD6","none")+lzDots(196,46,104,100,30,5,(x,y,R)=>lzP(`M${lzN(x)} ${lzN(y)} l${lzN(6+R()*5)} ${lzN(-3-R()*5)}`,"none","#FFFFFF",2.2)+lzP(`M${lzN(x)} ${lzN(y)} l${lzN(6+R()*5)} ${lzN(-3-R()*5)}`,"none","#B5ADA5",.5))+lzDots(198,50,100,96,8,8,(x,y)=>lzWbc(x,y,4)),
 zt:["Cristaux en aiguilles","+ globules blancs"],
 extra:()=>lzLL(200,"Articulation rouge, chaude, gonflée ;\ndouleur nocturne insupportable",1)+lzLL(232,"Favorisée par alcool, viandes,\nsodas, diurétiques",0),pill:"Crise : glace, repos, colchicine ; puis allopurinol",
 cap:"Colchicine ou AINS pendant la crise (pas d'aspirine) ; traitement de fond hypo-uricémiant (allopurinol) pour dissoudre les cristaux ; boire 2 L/j, réduire alcool et sodas sucrés."});
/* os spongieux : travées épaisses (normal) ou fines (ostéoporose), ostéoïde non minéralisé (ostéomalacie) */
const lzTrab=(x,y,w,h,thin,soft)=>{const R=lzRnd(7);let s=lzR(x,y,w,h,8,soft?"#F6EFE6":"#FBF6EC","#C9B88E",1);
 for(let i=0;i<26;i++){const a=x+6+R()*(w-12),b=y+6+R()*(h-12),ang=R()*Math.PI,L=10+R()*16;if(thin&&R()<.45)continue;
  s+=lzP(`M${lzN(a)} ${lzN(b)} l${lzN(Math.cos(ang)*L)} ${lzN(Math.sin(ang)*L)}`,"none",soft?"#E3D2B4":"url(#rg-bone)",thin?1.6:5.5);
  if(soft)s+=lzP(`M${lzN(a)} ${lzN(b)} l${lzN(Math.cos(ang)*L)} ${lzN(Math.sin(ang)*L)}`,"none","#C9B88E",1.4);}
 return s;};
lzZF("osteoporose",{t:"L'os devient poreux et casse facilement",sub:"Ostéoporose : la masse osseuse diminue (ménopause, âge, corticoïdes) ; fractures du poignet, des vertèbres, du col du fémur",pt:[64,72],bg:"#FBF6EC",
 left:()=>lzOrg("squelette",["rachis","hanche","poignet"],-8,14,.62),
 inner:()=>lzTrab(192,40,54,110,0)+lzTrab(250,40,54,110,1)+lzS(219,148,"normal","middle","st-b")+lzS(277,148,"poreux","middle","st-acc st-b"),zt:["Travées amincies,","moins nombreuses"],
 extra:()=>lzLL(200,"Silencieuse jusqu'à la fracture ;\nperte de taille, dos voûté",0)+lzLL(232,"Fractures : poignet, vertèbres,\ncol du fémur",1),pill:"Prévenir les chutes ; calcium, vitamine D, activité",
 cap:"Ostéodensitométrie ; calcium, vitamine D, activité physique en charge, bisphosphonates ou autres ; prévention des chutes au domicile et à l'hôpital."});
lzZF("osteomalacie",{t:"L'os n'est plus assez minéralisé : il se ramollit",sub:"Ostéomalacie : manque de vitamine D ou de phosphore ; chez l'enfant, c'est le rachitisme",pt:[106,104],bg:"#FBF6EC",
 left:()=>lzOrg("squelette",["bassin","rachis","hanche"],-8,14,.62),
 inner:()=>lzTrab(196,40,104,110,0,1)+lzS(248,148,"travées non calcifiées","middle","st-acc st-b"),zt:["Matrice osseuse molle,","sans calcium"],
 extra:()=>lzLL(200,"Douleurs osseuses diffuses,\nfaiblesse des muscles",1)+lzLL(232,"Fissures, déformations,\ndémarche dandinante",0),pill:"Vitamine D et calcium sur prescription",
 cap:"Traitement : vitamine D, calcium, exposition solaire raisonnable ; rechercher une malabsorption (maladie cœliaque, chirurgie digestive) ou une insuffisance rénale."});
/* ============ Nutrition ============ */
lzZF("carence-vitd",{t:"Sans vitamine D, le calcium n'est plus absorbé",sub:"Carence en vitamine D : peu de soleil, peau foncée, âge, obésité, malabsorption",pt:[96,96],bg:"#FFF8E6",
 left:()=>lzBody(96,24,1.02)+lzC(28,26,13,"#F7D046","#E0A800",1.2)+[...Array(8)].map((_,i)=>{const a=i*Math.PI/4;return lzP(`M${lzN(28+Math.cos(a)*17)} ${lzN(26+Math.sin(a)*17)} l${lzN(Math.cos(a)*6)} ${lzN(Math.sin(a)*6)}`,"none","#E0A800",1.8);}).join("")+lzArr(42,36,74,52,{c:"#E0A800",w:1.6,dash:"3 3"}),
 inner:()=>[["peau (soleil)",248,52],["foie",210,98],["rein :\nactivation",284,94],["intestin : absorbe\nle calcium",248,136]].map(([t,a,b])=>lzS(a,b,t,"middle","st-b")).join("")+lzArr(236,58,214,88,{c:"#E0A800",w:1.6})+lzArr(222,98,262,98,{c:"#E0A800",w:1.6})+lzArr(282,106,262,128,{c:"#E0A800",w:1.6,dash:"3 3"})+lzP("M258 116 l8 8 M266 116 l-8 8","none",LC.acc,2),
 zt:["La chaîne d'activation","s'arrête faute de vitamine"],
 extra:()=>lzLL(200,"Fatigue, douleurs osseuses,\nchutes chez la personne âgée",0)+lzLL(232,"Enfant : rachitisme ;\nadulte : ostéomalacie",1),pill:"Supplémentation en vitamine D sur prescription",
 cap:"Supplémentation (ampoules ou gouttes), alimentation (poissons gras, œufs), exposition solaire raisonnable ; systématique chez le nourrisson, fréquente chez la personne âgée."});
lzZF("renutrition",{t:"Réalimenter trop vite fait chuter le phosphore",sub:"Syndrome de renutrition inappropriée : l'insuline fait entrer brutalement phosphore, potassium et magnésium dans les cellules",pt:[96,96],bg:"#FDF3EE",
 left:()=>lzBody(96,24,1.02,{skin:"#EFD2BD"})+lzP("M150 30 h28 v22 h-28 Z","#FFF","#9AA3AB",1)+lzS(164,46,"repas","middle")+lzArr(150,44,118,60,{c:"#1E5A6D",w:1.6}),
 inner:()=>lzCellIns({ins:3,open:1,gOut:2,gIn:3})+lzDots(200,44,100,30,6,4,(x,y)=>lzC(x,y,2.4,"#7FB2D3","#3D8CC0",.6))+lzArr(214,74,222,104,{c:"#3D8CC0",w:1.4})+lzArr(282,74,274,104,{c:"#3D8CC0",w:1.4}),zt:["Phosphore, K, Mg (bleu)","quittent le sang"],
 extra:()=>lzLL(200,"Personne très dénutrie\n(anorexie, alcool, jeûne)",0)+lzLL(232,"Risque : insuffisance cardiaque,\ntroubles du rythme, confusion",1),pill:"Réalimenter progressivement ; doser phosphore et K",
 cap:"Repérer les personnes à risque ; vitamine B1 avant de réalimenter, apports augmentés progressivement, dosages répétés de phosphore, potassium, magnésium ; surveillance cardiaque et des œdèmes."});
lzZF("cachexie",{t:"Le corps fond, muscles et graisse compris",sub:"Cachexie : cancer, insuffisance d'organe ou infection chronique ; l'inflammation détruit les réserves",pt:[86,90],bg:"#FDF3EE",
 left:()=>`<g transform="translate(96 24) scale(1.02)"><circle cx="0" cy="0" r="10" style="fill:#EFD2BD;stroke:${LC.skinD};stroke-width:1"/><path d="M-4 9 L-17 18 Q-21 22 -22 30 L-25 76 L-21 77 L-17 36 L-14 44 L-13 84 L-11 148 L-4 148 L-1 92 L1 92 L4 148 L11 148 L13 84 L14 44 L17 36 L21 77 L25 76 L22 30 Q21 22 17 18 L4 9 Z" style="fill:#EFD2BD;stroke:${LC.skinD};stroke-width:1"/>${lzP("M-8 26 q8 3 16 0 M-8 32 q8 3 16 0 M-8 38 q8 3 16 0","none","#C99A78",.8)}</g>`,
 inner:()=>lzR(186,34,124,124,0,"#F5DCD6","none")+[0,1,2,3,4,5].map(i=>lzR(192,44+i*18,112,12,6,i%2?"#C9675A":"#D98A7E","#8E3A30",.8)).join("")+lzDots(200,44,100,100,12,5,(x,y)=>lzC(x,y,3,"#B98A7E","none"))+lzDots(196,40,106,110,6,8,(x,y)=>lzWbc(x,y,4)),zt:["Fibres musculaires","qui fondent"],
 extra:()=>lzLL(200,"Perte de poids involontaire,\nfonte des muscles, fatigue",1)+lzLL(232,"Ne se corrige pas seulement\nen mangeant plus",0),pill:"Évaluer : poids, IMC, albumine, alimentation",
 cap:"Pesée régulière, enrichissement des repas, compléments oraux, prise en charge de la douleur, des nausées, de la bouche ; activité physique adaptée ; en fin de vie, priorité au confort."});
