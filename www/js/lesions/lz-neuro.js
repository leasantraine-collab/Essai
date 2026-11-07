/* Carnet IFSI — schémas des lésions : neurologie (36 pathologies). */
/* point du schéma « cerveau » réaliste placé en (-6,20) à l'échelle .62 */
const lzMpN=(x,y)=>[lzN(-6+x*.62),lzN(20+y*.62)];
const lzNF=(id,o)=>lz(id,{t:o.t,sub:o.sub,h:o.h||262,ins:false,cap:o.cap,
 draw:()=>{const [px,py]=lzMpN(...o.pt);return lzOrg("cerveau",o.zones||[],-6,20,.62)+(o.over||"")+lzZoom(id,px,py,248,96,62,`<rect x="186" y="34" width="124" height="124" style="fill:${o.bg||"#FBF1EF"}"/>`+o.inner())
  +(o.zt?lzS(248,176,o.zt[0],"middle","st-acc")+lzS(248,187,o.zt[1]||"","middle","st-acc"):"")+(o.extra?o.extra():"")+(o.pill?lzPill(160,(o.h||262)-12,o.pill,LC.acc):"");}});
/* neurone : corps, dendrites, axon ; o.fade (neurone qui meurt), o.lewy, o.tangle, o.dopa (vésicules) */
function lzNeuron(x,y,s=1,o={}){const c=o.fade?"#E3D6E6":"#C9A9D6",k=o.fade?"#B9A6BF":"#8A63B8";
 const den=[0,1,2,3,4].map(i=>{const a=-2.4+i*.6;return lzP(`M${lzN(x+Math.cos(a)*7*s)} ${lzN(y+Math.sin(a)*7*s)} q${lzN(Math.cos(a)*8*s)} ${lzN(Math.sin(a)*8*s-4*s)} ${lzN(Math.cos(a)*15*s)} ${lzN(Math.sin(a)*15*s)}`,"none",k,1.6*s);}).join("");
 return den+lzP(`M${lzN(x+6*s)} ${lzN(y+3*s)} q${lzN(14*s)} ${lzN(6*s)} ${lzN(32*s)} ${lzN(4*s)}`,"none",k,2*s,o.fade?";stroke-dasharray:3 3":"")+lzC(x,y,8*s,c,k,1.2)+lzC(x,y,3*s,o.fade?"#CFC2D3":"#6E4A92","none")
  +(o.lewy?lzC(x+2*s,y-2*s,2.6*s,"#F08A9E","#B04060",.6):"")+(o.tangle?lzP(`M${lzN(x-5*s)} ${lzN(y+1*s)} q2 -4 4 0 t4 0 t4 0`,"none","#5A3D5C",1.4*s):"")
  +(o.dopa?lzDots(x+28*s,y-4*s,10*s,12*s,o.dopa,Math.round(x),(a,b)=>lzC(a,b,1.6*s,"#F2B705","none")):"");}
/* axone horizontal avec gaine de myéline ; o.demy : indices des segments abîmés */
function lzAxon(x,y,L,o={}){const n=Math.floor(L/26),dm=o.demy||[];let s=lzP(`M${x} ${y} H${x+L}`,"none","#B98FCB",3.2);
 for(let i=0;i<n;i++){const cx=x+13+i*26;if(dm.includes(i))s+=lzE(cx,y,11,6.5,"none","#C8372D",1,0,";stroke-dasharray:2 2");else s+=lzE(cx,y,11.5,7,"#FFF8E6","#D9C792",1);}
 return s;}
/* crâne en coupe frontale : o.vent (taille des ventricules), o.swell (cerveau gonflé), o.hed / o.hsd (hématomes), o.men (méninges enflammées), o.ex */
function lzSkull(cx,cy,s,o={}){const v=o.vent||1;
 const hemi=k=>{const pts=[];for(let i=0;i<=12;i++){const a=-Math.PI/2+i*Math.PI/12,r=(o.swell?83:77)+((i%2)?-3.5:2.5);pts.push([k*(2+Math.cos(a)*r*1.06),Math.sin(a)*r*.9]);}pts.push([k*2,62],[k*2,-66]);return lzSmooth(pts);};
 return `<g transform="translate(${cx} ${cy}) scale(${s})">
  <ellipse cx="0" cy="0" rx="98" ry="86" style="fill:${LC.bone};stroke:${LC.boneD};stroke-width:1.4"/><ellipse cx="0" cy="0" rx="90" ry="78" style="fill:${o.men?"#F7C7B8":"#F4ECE6"};stroke:${o.men?LC.acc:"#C9BCD6"};stroke-width:${o.men?3:1.2}"/>
  ${o.hed||""}${o.hsd||""}
  <path d="${hemi(-1)}" style="fill:url(#rg-brain);stroke:#B98579;stroke-width:1"/><path d="${hemi(1)}" style="fill:url(#rg-brain);stroke:#B98579;stroke-width:1"/>
  ${lzP("M0 -70 L0 40","none","#C9A89E",2)}${[-1,1].map(k=>lzP(`M${k*40} -40 q${k*10} 10 ${k*4} 22 M${k*58} -8 q${k*8} 12 0 24 M${k*30} 30 q${k*12} 4 ${k*16} 18`,"none","#D6A59A",1.2)).join("")}
  <g transform="scale(${v})">${lzP("M-6 -16 C-20 -24 -34 -14 -30 0 C-26 10 -12 8 -6 2 Z",LC.fluid,LC.fluidD,1)}${lzP("M6 -16 C20 -24 34 -14 30 0 C26 10 12 8 6 2 Z",LC.fluid,LC.fluidD,1)}</g>
  ${lzP("M-12 56 L-12 90 M12 56 L12 90","none","#E2C2B6",10)}${o.ex||""}</g>`;}
const lzSkullFig=(id,o)=>lz(id,{t:o.t,sub:o.sub,h:o.h||250,ix:226,iy:4,z:o.z,cap:o.cap,draw:()=>lzSkull(120,118,.98,o.sk())+(o.labels||"")+(o.pill?lzPill(160,(o.h||250)-12,o.pill,LC.acc):"")});
/* ============ Vaisseaux du cerveau ============ */
const lzClotArt=(type)=>lzArtL(188,72,124,48,8,{seed:5,rbc:type==="open"?7:3})+(type==="occl"?lzP("M232 80 C246 86 252 104 238 112 C252 104 268 106 276 112 C266 98 270 86 280 80 C266 88 250 86 240 78 Z",LC.clot,"#3E0E0B",.8):"")
 +(type==="partial"?lzP("M240 80 C248 84 252 92 246 96 C254 92 262 92 266 96 C260 88 262 84 268 80 Z",LC.clot,"#3E0E0B",.8):"")+(type==="occl"?lzR(276,80,36,32,0,"#E9E2E0","none",0,";opacity:.7"):lzArr(194,96,226,96,{c:"#1E5A6D",w:1.6}));
lzNF("avc-isch",{t:"Une artère du cerveau se bouche",sub:"Un caillot bloque l'artère : la zone du cerveau qu'elle nourrit manque d'oxygène et meurt",zones:["vaisseaux"],pt:[116,124],
 over:`<path d="M58 54 C80 40 120 44 128 70 C118 92 84 96 62 86 Z" style="fill:#4E3A3A;opacity:.45"/>`,inner:()=>lzClotArt("occl")+lzDots(196,124,110,30,8,4,(x,y)=>lzNeuron(x,y,.55,{fade:1})),zt:["Caillot : l'artère est bouchée,","les neurones en aval meurent"],
 extra:()=>lzLL(196,"Signes brutaux : bouche\nde travers, bras faible,\ntrouble de la parole",1),pill:"Appeler le 15 : chaque minute compte",
 cap:"Noter l'**heure de début** des signes : la thrombolyse ou la thrombectomie ne sont possibles que dans les premières heures. Pas de traitement avant l'imagerie."});
lzNF("ait",{t:"Une artère du cerveau se bouche quelques minutes",sub:"Le caillot se dissout tout seul : les signes disparaissent en moins d'une heure, mais l'alerte est sérieuse",zones:["vaisseaux"],pt:[116,124],
 over:`<path d="M58 54 C80 40 120 44 128 70 C118 92 84 96 62 86 Z" style="fill:#4E3A3A;opacity:.16"/>`,inner:()=>lzClotArt("partial"),zt:["Petit caillot qui se dissout :","l'artère se rouvre"],
 extra:()=>lzLL(196,"Mêmes signes qu'un AVC,\nmais qui régressent",0),pill:"Risque d'AVC dans les jours suivants",
 cap:"Un AIT est une **urgence** : bilan rapide (imagerie, cœur, carotides) et traitement pour éviter l'AVC constitué qui survient souvent dans les 48 heures."});
lzNF("avc-hemo",{t:"Une artère du cerveau se rompt et saigne",sub:"Le sang s'épanche dans le cerveau : l'hématome comprime et abîme les tissus autour",zones:["vaisseaux"],pt:[140,140],
 over:`<ellipse cx="88" cy="104" rx="15" ry="11" style="fill:#B5372D;opacity:.85"/>`,inner:()=>lzArtL(188,62,124,40,7,{seed:3,rbc:5})+lzP("M240 102 C232 130 250 150 262 130 C276 150 296 132 284 112 C300 104 286 90 272 100",LC.clotL,"#7A1F1A",1)+lzRbcs(240,108,44,30,8,6,3.4)+lzArr(280,124,302,140,{c:LC.acc,w:1.6,hl:5}),zt:["Artère rompue : le sang","comprime le cerveau"],
 extra:()=>lzLL(196,"Souvent l'HTA ;\nmaux de tête brutaux,\nvomissements",0),pill:"Urgence : appeler le 15",
 cap:"Contrôler la **tension artérielle** selon la prescription, surveiller la conscience (Glasgow) et les pupilles ; arrêter les anticoagulants sur avis médical."});
lzNF("hemorragie-meningee",{t:"Un anévrisme se rompt : le sang envahit les méninges",sub:"Le sang se répand autour du cerveau, dans l'espace où circule le liquide cérébrospinal",zones:["meninges"],pt:[116,124],
 over:lzP("M46 86 C48 62 80 50 116 52 C146 54 162 64 168 80","none","#B5372D",4,";opacity:.75"),inner:()=>lzP("M188 120 L312 120","none",LC.med,16)+lzP("M188 120 L312 120","none",LC.plasma,10)+lzC(250,96,18,LC.med,"rgba(90,40,35,.5)",1)+lzC(250,96,13,LC.plasma,"none")+lzP("M256 82 L264 70","none",LC.acc,2.6)+lzDots(196,40,110,40,14,6,(x,y)=>lzRbc(x,y,3.4,0)),zt:["Anévrisme rompu : le sang","se répand dans les méninges"],
 extra:()=>lzLL(196,"Céphalée brutale « en coup\nde tonnerre », raideur\nde nuque, vomissements",1),pill:"Urgence vitale",
 cap:"Repos strict, surveillance neurologique rapprochée, contrôle de la douleur et de la tension ; risque de **resaignement** et de vasospasme dans les jours suivants."});
lzNF("demence-vasc",{t:"De multiples petits infarctus abîment le cerveau",sub:"Les petites artères malades (HTA, diabète, tabac) se bouchent : les fonctions déclinent par paliers",zones:["vaisseaux"],pt:[160,100],
 over:lzDots(56,46,84,50,12,5,(x,y)=>lzC(x,y,3,"#4E3A3A","none",0,";opacity:.6")),inner:()=>lzArtX(222,80,26,11,{rbc:2,seed:3})+lzArtX(276,118,20,8,{rbc:1,seed:7})+lzDots(196,110,60,40,5,9,(x,y)=>lzC(x,y,5,"#4E3A3A","none",0,";opacity:.55")),zt:["Petites artères épaissies et","petits infarctus"],
 extra:()=>lzLL(196,"Ralentissement, troubles\nde la marche et de\nl'attention",0),
 cap:"Prévention des facteurs de risque cardiovasculaire : tension, diabète, cholestérol, tabac. Stimulation cognitive et maintien de l'autonomie."});
/* ============ Maladies neurodégénératives ============ */
lzNF("alzheimer-n",{t:"Les neurones de la mémoire meurent peu à peu",sub:"Des plaques et des fibres anormales s'accumulent : le cerveau s'atrophie, d'abord dans la région de la mémoire",zones:["temporal","parietal"],pt:[140,140],
 inner:()=>lzNeuron(214,74,1,{tangle:1})+lzNeuron(254,118,1,{fade:1})+lzNeuron(226,130,.8,{tangle:1})+lzDots(240,52,60,40,5,4,(x,y)=>lzP(`M${lzN(x-6)} ${lzN(y)} C${lzN(x-6)} ${lzN(y-7)} ${lzN(x+6)} ${lzN(y-7)} ${lzN(x+6)} ${lzN(y)} C${lzN(x+6)} ${lzN(y+6)} ${lzN(x-6)} ${lzN(y+6)} ${lzN(x-6)} ${lzN(y)} Z`,"#C9A05A","#8A6A2A",.8)),zt:["Plaques (brunes) et fibres","emmêlées dans les neurones"],
 extra:()=>lzLL(196,"Oublis récents, puis\nlangage, repères, gestes",0),
 cap:"Maintenir l'autonomie, des repères stables (horaires, lieux), une communication simple et bienveillante ; soutenir les **aidants**."});
lzNF("parkinson-n",{t:"Les neurones qui fabriquent la dopamine disparaissent",sub:"Dans une petite zone du tronc cérébral (substance noire), la dopamine manque : les mouvements ralentissent",zones:["tronc"],pt:[180,176],
 inner:()=>lzNeuron(212,70,1,{dopa:6})+lzNeuron(212,112,1,{fade:1})+lzNeuron(258,92,.9,{fade:1,lewy:1})+lzNeuron(254,132,.9,{dopa:2}),zt:["Moins de neurones,","donc moins de dopamine"],
 extra:()=>lzLL(196,"Tremblement de repos,\nlenteur, raideur",1),
 cap:"Les médicaments se prennent à **heures fixes** (sinon blocages). Surveiller les chutes, la déglutition, la constipation, l'humeur ; kinésithérapie et orthophonie."});
lzNF("dcl",{t:"Des dépôts anormaux (corps de Lewy) s'accumulent dans les neurones",sub:"Démence à corps de Lewy : troubles cognitifs fluctuants, hallucinations visuelles, signes parkinsoniens",zones:["occipital","parietal"],pt:[232,106],
 inner:()=>lzNeuron(214,76,1.1,{lewy:1})+lzNeuron(256,112,1.1,{lewy:1})+lzNeuron(226,132,.8,{fade:1,lewy:1}),zt:["Corps de Lewy (roses) dans","les neurones"],
 extra:()=>lzLL(196,"Hallucinations visuelles,\nvigilance qui fluctue",0),pill:"Grande sensibilité aux neuroleptiques",
 cap:"Les neuroleptiques peuvent provoquer des réactions graves : à éviter. Repérer les fluctuations et adapter les soins au moment de la journée."});
lzNF("huntington",{t:"Des neurones profonds du cerveau dégénèrent",sub:"Maladie génétique : le noyau caudé s'atrophie, d'où des mouvements involontaires et des troubles psychiques",zones:["ventricules","frontal"],pt:[160,100],
 over:`<ellipse cx="92" cy="82" rx="9" ry="6" style="fill:${LC.fluid};opacity:.8"/>`,inner:()=>lzNeuron(214,80,1,{fade:1})+lzNeuron(254,110,1)+lzNeuron(228,128,.8,{fade:1})+lzS(250,66,"gène HTT","middle","st-acc"),zt:["Neurones du noyau caudé","qui disparaissent"],
 extra:()=>lzLL(196,"Mouvements brusques\n(chorée), troubles du\ncomportement",0),
 cap:"Transmission autosomique dominante : conseil génétique. Prise en charge pluridisciplinaire : déglutition, nutrition, chutes, soutien psychologique."});
lzNF("sla",{t:"Les neurones qui commandent les muscles meurent",sub:"Sclérose latérale amyotrophique : les motoneurones du cerveau et de la moelle dégénèrent, les muscles fondent",zones:["moelle","frontal"],pt:[181,222],
 inner:()=>lzNeuron(206,72,1,{fade:1})+lzP("M238 76 L276 76","none","#B98FCB",2,";stroke-dasharray:3 3")+lzR(276,60,28,34,6,"#D9A79D","#B07068",1)+lzS(290,104,"muscle","middle")+lzNeuron(206,124,1)+lzP("M238 128 L276 128","none","#B98FCB",2.4)+lzR(276,112,28,34,6,LC.muscle,LC.muscleD,1),zt:["Motoneurone qui meurt :","le muscle s'atrophie"],
 extra:()=>lzLL(196,"Faiblesse, crampes, puis\ntroubles de la parole\net de la déglutition",0),
 cap:"Pas de traitement curatif. Accompagnement : nutrition (gastrostomie), respiration (ventilation non invasive), communication, soins palliatifs, soutien des proches."});
lzNF("sep-n",{t:"Le système immunitaire attaque la gaine des nerfs",sub:"Sclérose en plaques : la myéline est détruite par endroits (plaques), l'influx nerveux passe mal",zones:["ventricules","moelle"],pt:[160,100],
 over:lzDots(70,70,60,30,6,4,(x,y)=>lzC(x,y,3.4,"#FFFFFF","#C9BCD6",.8)),inner:()=>lzAxon(192,96,116,{demy:[1,2]})+lzWbc(226,72,5)+lzWbc(242,118,5)+lzArr(196,82,226,82,{c:LC.elec,w:1.6,hl:5}),zt:["Myéline détruite :","l'influx se ralentit"],
 extra:()=>lzLL(196,"Poussées : troubles de la\nvue, fourmillements,\nfaiblesse, fatigue",0),
 cap:"Évolution par **poussées** puis parfois progressive. Traitements de fond qui réduisent les poussées ; corticoïdes lors des poussées ; fatigue à respecter."});
lzNF("epilepsie-n",{t:"Des neurones se déchargent tous en même temps",sub:"Une décharge électrique anormale part d'une zone du cerveau et peut se propager",zones:["frontal","temporal","parietal","occipital"],pt:[196,64],
 over:lzP("M70 52 l8 8 l-6 4 l10 10 M100 40 l6 10 l-6 2 l8 10","none",LC.elec,2.4),inner:()=>[[214,72],[256,64],[236,104],[278,110],[212,124]].map(([x,y])=>lzNeuron(x,y,.75)+lzP(`M${x+10} ${y-12} l5 7 l-4 2 l6 8`,"none",LC.elecD,1.8)).join(""),zt:["Décharges synchrones :","les neurones s'emballent"],
 extra:()=>lzLL(196,"Crises : absences,\nsecousses, perte de\nconnaissance",0),
 cap:"Traitement antiépileptique régulier, sommeil suffisant, éviter l'alcool. Pendant une crise : protéger la tête, ne rien mettre dans la bouche, PLS ensuite, noter la durée."});
lzNF("crise-convulsive",{t:"Une décharge électrique gagne tout le cerveau",sub:"Crise généralisée : perte de connaissance, raidissement puis secousses des membres",zones:["frontal","temporal","parietal","occipital"],pt:[196,64],
 over:lzP("M56 60 l10 8 l-8 4 l12 10 M92 36 l6 10 l-6 2 l8 10 M134 40 l6 10 l-6 2 l8 10 M150 86 l6 8 l-6 2 l8 10","none",LC.elec,2.4),inner:()=>[[214,72],[256,64],[236,104],[278,110],[212,124],[262,138]].map(([x,y])=>lzNeuron(x,y,.7)+lzP(`M${x+10} ${y-12} l5 7 l-4 2 l6 8`,"none",LC.elecD,1.8)).join(""),zt:["Toute l'écorce","se décharge"],
 extra:()=>lzLL(196,"Ne pas maintenir, protéger,\nchronométrer la crise",1),pill:"Plus de 5 minutes : appeler le 15",
 cap:"Après la crise : **PLS**, surveiller la respiration et la conscience (phase de récupération confuse), rechercher une morsure de langue, une perte d'urine, une cause."});
lzNF("etat-mal",{t:"Les crises ne s'arrêtent plus",sub:"État de mal épileptique : crise de plus de 5 minutes ou crises qui se suivent sans reprise de conscience",zones:["frontal","temporal","parietal","occipital"],pt:[196,64],
 over:lzP("M56 60 l10 8 l-8 4 l12 10 M92 36 l6 10 l-6 2 l8 10 M134 40 l6 10 l-6 2 l8 10 M150 86 l6 8 l-6 2 l8 10","none",LC.acc,2.4),inner:()=>[[214,72],[256,64],[236,104],[278,110],[212,124],[262,138]].map(([x,y])=>lzNeuron(x,y,.7,{fade:x>250})+lzP(`M${x+10} ${y-12} l5 7 l-4 2 l6 8`,"none",LC.acc,1.8)).join(""),zt:["Décharges continues :","les neurones s'épuisent"],
 extra:()=>lzLL(196,"Risque de lésions\ncérébrales définitives",1),pill:"Urgence vitale : traitement immédiat",
 cap:"Benzodiazépine selon le protocole, oxygène, surveillance (SpO₂, glycémie, conscience) ; transfert en réanimation si la crise persiste."});
/* ============ Infections ============ */
const lzMenZoom=(kind)=>lzR(186,34,124,30,0,LC.bone,"none")+lzR(186,64,124,10,0,"#EDE6F2","none")+lzR(186,74,124,34,0,kind==="bact"?"#EEE3A8":"#EAF2F8","none")+lzR(186,108,124,50,0,"url(#rg-brain)","none")
 +lzP("M186 64 H310 M186 74 H310 M186 108 H310","none","#B98579",1)+(kind==="bact"?lzDots(192,78,112,26,16,5,lzCoc)+lzDots(196,80,104,22,5,7,(x,y)=>lzWbc(x,y,3.6)):lzDots(194,80,108,22,7,5,(x,y)=>lzVirus(x,y,3.4))+lzDots(196,80,104,22,4,8,(x,y)=>lzWbc(x,y,3.4)))
 +lzS(292,54,"os","end")+lzS(292,72,"méninges","end")+lzS(292,138,"cerveau","end");
lzNF("meningite-bact",{t:"Des bactéries infectent les enveloppes du cerveau",sub:"Les méninges s'enflamment et le liquide cérébrospinal devient trouble (pus)",zones:["meninges"],pt:[150,30],inner:()=>lzMenZoom("bact"),zt:["Liquide cérébrospinal","envahi de bactéries et de pus"],
 extra:()=>lzLL(196,"Fièvre, céphalées, raideur\nde nuque, vomissements",1),pill:"Taches violacées (purpura) : urgence absolue",
 cap:"Antibiotique **en urgence** après la ponction lombaire (ou avant, si purpura). Isolement « gouttelettes » pour le méningocoque ; traitement préventif de l'entourage."});
lzNF("meningite-vir",{t:"Un virus enflamme les méninges",sub:"Le liquide cérébrospinal reste clair : forme le plus souvent bénigne",zones:["meninges"],pt:[150,30],inner:()=>lzMenZoom("vir"),zt:["Virus dans le liquide","cérébrospinal (clair)"],
 extra:()=>lzLL(196,"Céphalées, fièvre,\nraideur de nuque",0),
 cap:"Guérison spontanée le plus souvent : antalgiques, repos, hydratation. La ponction lombaire distingue la forme virale de la forme bactérienne."});
lzNF("encephalite",{t:"Un virus infecte le tissu du cerveau",sub:"Souvent l'herpès : la région temporale s'enflamme, d'où confusion, fièvre et crises",zones:["temporal","frontal"],pt:[140,140],
 inner:()=>lzR(186,34,124,124,0,"url(#rg-brain)","none")+lzDots(196,46,104,100,9,6,(x,y)=>lzNeuron(x,y,.55))+lzDots(196,46,104,100,10,9,(x,y)=>lzVirus(x,y,3.2))+lzDots(196,46,104,100,6,3,(x,y)=>lzWbc(x,y,3.4)),zt:["Virus et inflammation","dans le cerveau"],
 extra:()=>lzLL(196,"Fièvre + confusion\nou crise convulsive",1),pill:"Aciclovir IV en urgence",
 cap:"Toute fièvre avec troubles de la conscience ou du comportement doit faire penser à une encéphalite : traitement antiviral sans attendre les résultats."});
/* ============ Traumatismes et pression intracrânienne ============ */
lzSkullFig("hed",{t:"Du sang s'accumule entre l'os du crâne et la dure-mère",sub:"Hématome extradural : une artère déchirée par une fracture saigne vite et comprime le cerveau",z:["cerveau","meninges","temporal"],
 sk:()=>({hed:`<path d="M-94 -20 C-86 -50 -70 -62 -56 -64 C-66 -44 -70 -10 -66 16 C-74 12 -92 4 -94 -20 Z" style="fill:#B5372D;stroke:#7A1F1A;stroke-width:1"/>`+lzP("M-98 -30 L-86 -22 L-94 -12","none","#5A4A3A",2)}),
 labels:lzLL(24,"Fracture du crâne",0,32,88)+lzLL(150,"Hématome en lentille,\nentre l'os et la\ndure-mère",1,40,100)+lzLR(208,"Cerveau comprimé",0,150,140),pill:"Intervalle libre puis aggravation brutale",
 cap:"Après un choc, le patient peut aller bien puis s'aggraver en quelques heures : surveiller **conscience (Glasgow), pupilles, déficit** ; urgence neurochirurgicale."});
lzSkullFig("hsd",{t:"Du sang s'accumule sous la dure-mère",sub:"Hématome sous-dural : des veines se déchirent et le sang s'étale en croissant à la surface du cerveau",z:["cerveau","meninges"],
 sk:()=>({hsd:`<path d="M-84 -36 C-72 -68 -30 -82 0 -80 C-30 -72 -60 -56 -70 -22 C-76 0 -76 22 -70 40 C-82 22 -90 -10 -84 -36 Z" style="fill:#9B2C24;opacity:.9"/>`}),
 labels:lzLL(40,"Hématome en croissant\nsous la dure-mère",1,52,92)+lzLR(208,"Cerveau repoussé",0,150,140),pill:"Personne âgée, sous anticoagulant : penser HSD",
 cap:"Forme chronique : chute banale, puis confusion ou céphalées progressives sur des semaines. Forme aiguë après un traumatisme grave : urgence."});
lzSkullFig("tc-n",{t:"Le choc secoue le cerveau dans le crâne",sub:"Traumatisme crânien : contusion au point d'impact, parfois du côté opposé, et risque de saignement",z:["cerveau","meninges","frontal"],
 sk:()=>({ex:`<ellipse cx="-56" cy="-30" rx="14" ry="10" style="fill:#9B4A6A;opacity:.7"/><ellipse cx="56" cy="20" rx="12" ry="8" style="fill:#9B4A6A;opacity:.55"/>`+lzArr(-150,-60,-104,-36,{c:LC.acc,w:4,hl:10})}),
 labels:lzLL(24,"Choc",1,24,60)+lzLL(150,"Contusion au point\nd'impact",1,64,90)+lzLR(208,"Contusion du côté\nopposé (contrecoup)",0,176,138),pill:"Surveiller : Glasgow, pupilles, vomissements",
 cap:"Consignes de surveillance pendant 24 à 48 h : somnolence, vomissements, céphalées qui s'aggravent, confusion ou convulsions doivent faire reconsulter **en urgence**."});
lzSkullFig("htic",{t:"La pression monte dans le crâne",sub:"Le crâne ne peut pas s'agrandir : un œdème, un saignement ou une tumeur comprime le cerveau",z:["cerveau","ventricules"],
 sk:()=>({swell:1,vent:.55,ex:[[-1,-1],[1,-1],[-1,1],[1,1]].map(([a,b])=>lzArr(a*88,b*56,a*64,b*40,{c:LC.acc,w:3,hl:8})).join("")+lzArr(0,56,0,96,{c:LC.acc,w:3,hl:8})}),
 labels:lzLR(116,"Ventricules\nécrasés",1,128,118)+lzLL(150,"Cerveau gonflé\ncontre le crâne",1,56,96)+lzLR(212,"Risque d'engagement\nvers le bas",1,124,214),pill:"Céphalées, vomissements, troubles de la conscience",
 cap:"Tête surélevée à 30°, axe tête-cou-tronc aligné, surveillance neurologique rapprochée ; signes d'alerte : **bradycardie et HTA** (réflexe de Cushing), pupille dilatée."});
lzSkullFig("hydrocephalie",{t:"Le liquide cérébrospinal s'accumule dans les ventricules",sub:"Il est mal évacué : les ventricules se dilatent et compriment le cerveau",z:["cerveau","ventricules"],
 sk:()=>({vent:2.2}),labels:lzLR(116,"Ventricules\ndilatés\n(liquide\nen excès)",1,150,112)+lzLL(150,"Cerveau comprimé",0,46,90),pill:"Enfant : tête qui grossit ; adulte : marche, mémoire, urines",
 cap:"Traitement : dérivation du liquide (valve ventriculo-péritonéale). Surveiller les signes de dysfonctionnement de valve : céphalées, vomissements, somnolence."});
lzSkullFig("tumeur-cerebrale",{t:"Une tumeur se développe dans le cerveau",sub:"Elle comprime et infiltre les tissus voisins, entourée d'un œdème qui augmente la pression",z:["cerveau","frontal","temporal"],
 sk:()=>({vent:.8,ex:`<circle cx="-40" cy="-30" r="26" style="fill:#F6D8C8;opacity:.8"/><path d="M-56 -36 C-56 -54 -30 -56 -24 -40 C-18 -26 -32 -12 -44 -16 C-54 -18 -56 -26 -56 -36 Z" style="fill:#8E6A8F;stroke:#5A3D5C;stroke-width:1.2"/>`}),
 labels:lzLL(24,"Tumeur",1,80,82)+lzLL(150,"Œdème autour\nde la tumeur",1,64,108),pill:"Céphalées, crises, déficit ou changement de comportement",
 cap:"Traitements : chirurgie, radiothérapie, chimiothérapie ; corticoïdes contre l'œdème. Surveiller les signes d'hypertension intracrânienne et les crises."});
/* ============ Conscience, cervelet, migraine ============ */
lzNF("coma",{t:"Le système d'éveil ne stimule plus le cerveau",sub:"Une lésion du tronc cérébral ou une atteinte diffuse du cerveau supprime la conscience",zones:["tronc"],pt:[180,176],
 over:[0,1,2,3].map(i=>lzArr(104,128,52+i*26,60-i%2*8,{c:LC.elec,w:1.8,dash:"4 3",op:.35})).join(""),inner:()=>lzNeuron(220,78,1)+lzNeuron(262,108,1)+lzP("M200 140 L300 140","none",LC.elec,2,";opacity:.35;stroke-dasharray:4 4")+lzP("M244 128 L256 152 M256 128 L244 152","none",LC.acc,3),zt:["Les signaux d'éveil","n'arrivent plus au cortex"],
 extra:()=>lzLL(196,"Causes : AVC, traumatisme,\nintoxication, hypoglycémie,\narrêt cardiaque",0),pill:"Évaluer : score de Glasgow",
 cap:"Libérer les voies aériennes, PLS si respiration présente, **glycémie capillaire** systématique, surveillance continue. Prévenir escarres et complications du décubitus."});
LZ["troubles-conscience"]=Object.assign({},LZ.coma,{t:"La vigilance diminue : de la somnolence au coma",sub:"Le système d'éveil du tronc cérébral et le cortex fonctionnent mal"});
lzNF("cerebelleux",{t:"Le cervelet ne coordonne plus les mouvements",sub:"Syndrome cérébelleux : marche ébrieuse, gestes imprécis, troubles de l'équilibre",zones:["cervelet"],pt:[220,166],
 inner:()=>lzR(186,34,124,124,0,"url(#rg-brain)","none")+[0,1,2,3,4,5].map(i=>lzP(`M186 ${46+i*20} Q248 ${36+i*20} 310 ${46+i*20}`,"none","#D6A59A",3)).join("")+lzDots(200,50,100,90,4,5,(x,y)=>lzNeuron(x,y,.6,{fade:1})),zt:["Cervelet abîmé :","coordination perdue"],
 extra:()=>lzLL(196,"Causes : alcool, AVC,\nSEP, tumeur, médicaments",0),pill:"Risque de chute",
 cap:"Marche à jambes écartées, tremblement intentionnel (en approchant le but), parole saccadée. Sécuriser les déplacements, rééducation."});
lzNF("migraine",{t:"Une vague d'activité traverse le cerveau, les vaisseaux et nerfs s'enflamment",sub:"La crise implique le nerf trijumeau et les vaisseaux des méninges ; l'aura vient d'une onde électrique lente",zones:["meninges","vaisseaux"],pt:[232,106],
 over:lzP("M150 64 C170 70 178 86 172 100","none",LC.elec,3,";stroke-dasharray:6 4"),inner:()=>lzP("M186 96 C220 90 270 104 310 96","none",LC.bloodD,26)+lzP("M186 96 C220 90 270 104 310 96","none","#E9877A",21)+lzP("M190 140 C226 128 262 148 300 132","none",LC.nerveD,5)+lzP("M190 140 C226 128 262 148 300 132","none",LC.nerve,3.4)+lzDots(220,110,70,20,8,6,(x,y)=>lzC(x,y,1.8,LC.inflam,"none")),zt:["Vaisseau dilaté, nerf qui","libère des substances inflammatoires"],
 extra:()=>lzLL(196,"Douleur pulsatile d'un côté,\nnausées, gêne à la lumière",0),
 cap:"Traitement de crise précoce, au calme et dans le noir. Repérer les facteurs déclenchants (sommeil, stress, alimentation, règles) ; traitement de fond si crises fréquentes."});
lzNF("cephalees",{t:"Les muscles du crâne et de la nuque se contractent",sub:"Céphalée de tension : douleur en casque ou en bandeau, souvent liée au stress, à la posture et à la fatigue",zones:["meninges"],pt:[150,30],
 over:lzP("M36 70 C40 36 90 18 130 20 C170 22 196 36 200 70","none",LC.acc,6,";opacity:.45"),inner:()=>[0,1,2,3,4,5].map(i=>lzR(186,40+i*20,124,16,8,i%2?"#C9675A":"#D27869","rgba(90,30,25,.35)",.6)).join("")+lzArr(200,100,230,100,{c:LC.acc,w:1.8})+lzArr(296,100,266,100,{c:LC.acc,w:1.8}),zt:["Muscles contractés","(cuir chevelu, nuque)"],
 extra:()=>lzLL(196,"Douleur en bandeau, sans\nnausées ni vomissements",0),pill:"Céphalée brutale ou inhabituelle : consulter",
 cap:"Signes d'alerte : céphalée **brutale**, fièvre, raideur de nuque, déficit, confusion, après un choc, chez la personne âgée ou sous anticoagulant."});
/* ============ Nerfs et moelle ============ */
const lzSilFig=(id,o)=>lz(id,{t:o.t,sub:o.sub,h:o.h||250,ins:false,cap:o.cap,
 draw:()=>`<defs><clipPath id="lzc-${id}"><circle cx="0" cy="0" r="11" transform="translate(84 40) scale(1.25)"/><path d="${LZ_BODY}" transform="translate(84 40) scale(1.25)"/></clipPath></defs>`+lzBody(84,40,1.25)
  +`<g clip-path="url(#lzc-${id})">${o.shade}</g>`+(o.extra||"")+(o.labels||"")+(o.pill?lzPill(160,(o.h||250)-12,o.pill,LC.acc):"")});
lzSilFig("paraplegie",{t:"La moelle épinière est lésée au niveau du dos",sub:"Les messages ne passent plus vers le bas du corps : paralysie et perte de sensibilité des jambes",
 shade:`<rect x="40" y="132" width="90" height="120" style="fill:#7A8AB8;opacity:.55"/>`,extra:lzP("M84 54 L84 150","none","#E8C34C",3)+lzP("M76 112 L92 120 M92 112 L76 120","none",LC.acc,3),
 labels:lzLR(70,"Lésion de la moelle\n(niveau dorsal)",1,92,116)+lzLR(150,"En dessous : paralysie,\nperte de sensibilité,\ntroubles urinaires",1,120,170),
 cap:"Prévention des complications : **escarres**, rétention urinaire, constipation, phlébite, raideurs. Rééducation et accompagnement vers l'autonomie."});
lzSilFig("tetraplegie",{t:"La moelle épinière est lésée au niveau du cou",sub:"Les quatre membres sont paralysés ; la respiration peut être atteinte si la lésion est haute",
 shade:`<rect x="20" y="62" width="130" height="190" style="fill:#7A8AB8;opacity:.55"/>`,extra:lzP("M84 54 L84 150","none","#E8C34C",3)+lzP("M76 60 L92 68 M92 60 L76 68","none",LC.acc,3),
 labels:lzLR(56,"Lésion de la moelle\ncervicale",1,92,64)+lzLR(140,"Bras et jambes paralysés,\nrespiration parfois\natteinte",1,124,150),
 cap:"Surveillance respiratoire, prévention des escarres et des infections, **hyperréflexie autonome** (poussée d'HTA brutale) à connaître. Rééducation spécialisée."});
lzSilFig("guillain-barre",{t:"Le système immunitaire attaque les nerfs périphériques",sub:"La paralysie commence aux pieds et remonte en quelques jours, parfois jusqu'aux muscles respiratoires",
 shade:`<rect x="30" y="150" width="110" height="110" style="fill:#7A8AB8;opacity:.6"/><rect x="30" y="112" width="110" height="38" style="fill:#7A8AB8;opacity:.3"/>`,
 extra:lzArr(126,226,126,134,{c:LC.acc,w:2.4})+lzAxon(176,40,130,{demy:[2,3]})+lzWbc(240,58,5)+lzS(240,80,"Myéline des nerfs attaquée","middle","st-acc"),
 labels:lzLR(150,"Paralysie qui\nremonte",1,130,180),pill:"Surveiller la respiration et la déglutition",
 cap:"Souvent après une infection. Surveillance en milieu hospitalier (capacité respiratoire, troubles du rythme, tension) ; immunoglobulines ou échanges plasmatiques."});
lzSilFig("neuropathie",{t:"Les fibres nerveuses les plus longues s'abîment",sub:"Neuropathie périphérique : fourmillements et perte de sensibilité, d'abord aux pieds puis aux mains",
 shade:`<rect x="20" y="214" width="130" height="40" style="fill:#7A8AB8;opacity:.55"/><rect x="40" y="132" width="16" height="22" style="fill:#7A8AB8;opacity:.45"/><rect x="112" y="132" width="16" height="22" style="fill:#7A8AB8;opacity:.45"/>`,
 extra:lzAxon(176,40,130,{demy:[3,4]})+lzS(240,64,"Fibres nerveuses abîmées","middle","st-acc"),
 labels:lzLR(130,"« Gants et chaussettes » :\nfourmillements, brûlures,\nperte de sensibilité",1,130,224),pill:"Diabète : examiner les pieds chaque jour",
 cap:"Causes : **diabète**, alcool, chimiothérapies, carences en vitamine B12. Risque de plaies du pied non senties : chaussage adapté, inspection quotidienne."});
lz("myasthenie",{t:"Le message ne passe plus bien entre le nerf et le muscle",sub:"Des anticorps bloquent les récepteurs du muscle : la force diminue à l'effort et se récupère au repos",h:240,ins:false,
 draw:()=>lzP("M20 70 C60 70 90 80 110 96","none","#B98FCB",6)+lzP("M110 96 C120 104 130 104 140 98 L150 112 L118 120 Z","#C9A9D6","#8A63B8",1.2)
  +lzR(40,130,240,64,14,LC.muscle,LC.muscleD,1)+[...Array(8)].map((_,i)=>lzP(`M${60+i*28} 134 v56`,"none","rgba(255,230,225,.35)",1.4)).join("")
  +lzDots(116,118,30,8,7,4,(x,y)=>lzC(x,y,1.6,LC.elec,"none"))+[118,130,142,154].map((x,i)=>i%2?lzP(`M${x} 130 l-3 -6 M${x} 130 l3 -6 M${x} 130 v4`,"none","#C8372D",1.6):lzP(`M${x-3} 130 h6`,"none","#2C7451",2.4)).join("")
  +lzLR(58,"Anticorps (en Y) qui\nbloquent les récepteurs",1,152,124)+lzLL(108,"Fin du nerf : libère\nl'acétylcholine",0,116,104)+lzS(160,214,"Muscle : faiblesse qui s'aggrave à l'effort","middle")
  +lzPill(160,232,"Gêne pour avaler ou respirer : urgence",LC.acc),
 cap:"Paupières qui tombent (ptosis), vision double, voix qui s'éteint. Traitement à **heures fixes** ; certains médicaments sont contre-indiqués (aggravation)."});
lz("nevralgie-v",{t:"Le nerf du visage envoie des décharges douloureuses",sub:"Névralgie du trijumeau : douleurs brèves, très intenses, déclenchées par un effleurement",h:240,ins:false,
 draw:()=>lzOrg("orl",[],-14,6,.82)+lzP("M120 70 L96 54 M120 70 L92 82 M120 70 L100 108","none",LC.nerveD,3.4)+lzP("M120 70 L96 54 M120 70 L92 82 M120 70 L100 108","none",LC.nerve,2.2)
  +[[92,50],[86,82],[94,110]].map(([x,y])=>lzP(`M${x} ${y} l-8 4 l4 3 l-9 5`,"none",LC.acc,2.2)).join("")
  +lzLR(60,"Les trois branches\ndu nerf trijumeau",1,122,72)+lzLR(140,"Décharges électriques\nde quelques secondes",1,96,112)+lzPill(160,228,"Toucher, mâcher, parler peuvent déclencher",LC.acc),
 cap:"Traitement par certains antiépileptiques (carbamazépine), parfois chirurgie. Respecter les zones gâchettes lors des soins (toilette, rasage, soins de bouche)."});
lz("paralysie-faciale",{t:"Le nerf facial ne commande plus la moitié du visage",sub:"Le visage tombe d'un côté : l'œil ferme mal, la bouche est attirée du côté sain",h:236,ins:false,
 draw:()=>`<g transform="translate(110 112)"><ellipse rx="62" ry="80" style="fill:${LC.skin};stroke:${LC.skinD};stroke-width:1.2"/>
  ${lzP("M-40 -26 Q-24 -34 -8 -26","none","#5A4A3A",2)}${lzP("M8 -20 Q26 -24 40 -14","none","#5A4A3A",2)}${lzE(-24,-14,9,5,"#fff","#5A4A3A",1)}${lzC(-24,-14,3,"#3B6893","none")}${lzE(24,-8,9,6.5,"#fff","#5A4A3A",1)}${lzC(24,-8,3,"#3B6893","none")}
  ${lzP("M0 -6 L-4 18 L4 20","none","#C98C73",1.6)}${lzP("M-26 40 Q-6 34 14 44 Q26 50 30 58","none","#B4574B",3)}${lzP("M12 4 Q30 14 42 30","none","#E2AD89",1.2,";stroke-dasharray:3 3")}</g>`
  +lzLR(56,"Côté paralysé :\nl'œil ferme mal",1,140,104)+lzLR(150,"Bouche qui tombe,\nla joue ne se gonfle plus",1,140,166)+lzLL(220,"Nerf facial (VII)",0),
 cap:"Protéger l'œil qui ne ferme plus (collyre, gel, occlusion la nuit). Paralysie centrale (AVC) : seul le bas du visage est touché — alerte AVC."});
lz("tumeur-medullaire",{t:"Une tumeur comprime la moelle épinière",sub:"La compression bloque les messages nerveux sous le niveau atteint",h:236,ins:false,
 draw:()=>lzR(60,10,80,220,14,"#F3EBD7","#C9B88E",1.2)+[0,1,2,3].map(i=>lzR(54,20+i*54,92,40,8,LC.bone,LC.boneD,1)).join("")+lzP("M100 10 L100 230","none","#E8C34C",16)+lzP("M100 10 L100 230","none","#F8E39A",10)
  +lzP("M108 100 C130 92 140 112 128 128 C120 140 106 136 104 122 Z","#8E6A8F","#5A3D5C",1.2)+lzP("M96 112 C94 106 94 128 96 124","none","#D7B24A",2)
  +lzLR(70,"Tumeur qui comprime\nla moelle",1,132,112)+lzLR(150,"Au-dessous : faiblesse,\nsensibilité diminuée,\ntroubles urinaires",0,104,190)+lzLL(232,"Moelle épinière",0),
 cap:"Douleur du dos persistante, faiblesse des jambes, troubles sphinctériens : **compression médullaire** à traiter en urgence (corticoïdes, chirurgie, radiothérapie)."});
