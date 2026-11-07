/* Carnet IFSI — schémas des lésions : cardiologie et vaisseaux (35 pathologies). */
/* ============ Artères et pression ============ */
lz("hta",{t:"Le sang pousse trop fort sur la paroi des artères",sub:"Avec le temps, la paroi s'épaissit et durcit, et le cœur doit forcer",h:262,ix:226,iy:150,
 draw:()=>{const pr=[46,86,126,166];
  return lzT(12,16,"Une artère en HTA","st-b")+lzArtL(12,30,196,78,20,{seed:4})
   +pr.map(x=>lzArr(x,69,x,52,{c:LC.acc,w:2.4})+lzArr(x+6,69,x+6,86,{c:LC.acc,w:2.4})).join("")
   +lzLR(40,"Paroi épaissie\net rigide",1,206,40)+lzLR(84,"Pression élevée\nsur la paroi",1,180,72)
   +lzT(12,132,"Coupe de l'artère","st-b")
   +lzArtX(52,182,34,7,{seed:2})+lzS(52,230,"Normale : paroi fine,\nlumière large","middle")
   +lzArtX(150,182,34,15,{seed:9,rbc:4})+[0,60,120,180,240,300].map(a=>{const r=Math.PI*a/180;return lzArr(150+Math.cos(r)*8,182+Math.sin(r)*8,150+Math.cos(r)*17,182+Math.sin(r)*17,{c:LC.acc,w:1.8,hl:6});}).join("")
   +lzS(150,230,"HTA : paroi épaisse,\nlumière plus étroite","middle","st-acc");},
 cap:"Sans douleur, cette surpression use les petites artères du **cerveau**, des **yeux** et des **reins**, et fait épaissir le **ventricule gauche** : d'où les AVC, l'insuffisance rénale et cardiaque."});
lz("hypotension",{t:"La pression du sang chute",sub:"Trois causes possibles, un même résultat : les organes sont moins bien irrigués",h:246,ins:false,
 draw:()=>lzBox(6,6,100,150,"Moins de sang")+lzArtL(14,46,84,40,7,{rbc:2,seed:3})+lzS(56,112,"Hémorragie,\ndéshydratation","middle")
  +lzBox(110,6,100,150,"Trop dilatés")+lzArtL(118,38,84,58,4,{rbc:4,seed:8})+lzArr(140,40,140,26,{c:"#3D6E8C",w:1.6,hl:5})+lzArr(140,94,140,108,{c:"#3D6E8C",w:1.6,hl:5})+lzArr(180,40,180,26,{c:"#3D6E8C",w:1.6,hl:5})+lzArr(180,94,180,108,{c:"#3D6E8C",w:1.6,hl:5})+lzS(160,128,"Infection grave,\nallergie, médicaments","middle")
  +lzBox(214,6,100,150,"Cœur faible")+lzHeart(264,74,.38,{vx:false,vg:1.25,pale:"vg"})+lzArr(264,104,264,116,{c:LC.acc,w:1.4,hl:4})+lzS(264,128,"Infarctus, insuffisance\ncardiaque, arythmie","middle")
  +lzArr(56,160,140,186,{c:"var(--fx-sub)",w:1.4})+lzArr(160,160,160,184,{c:"var(--fx-sub)",w:1.4})+lzArr(264,160,180,186,{c:"var(--fx-sub)",w:1.4})
  +lzPill(160,202,"La tension artérielle baisse",LC.acc)+lzS(160,224,"Cerveau, reins et cœur moins irrigués :\nmalaise, confusion, urines rares, pâleur","middle"),
 cap:"Pour compenser, le cœur accélère (tachycardie) et la peau se resserre (pâleur, extrémités froides). Une chute brutale peut évoluer vers l'**état de choc**."});
lz("hypo-ortho",{t:"En se levant, le sang descend dans les jambes",sub:"Le réflexe qui doit resserrer les vaisseaux et accélérer le cœur est trop lent",h:250,ins:false,
 draw:()=>`<defs><clipPath id="lzc-ortho"><path d="${LZ_BODY}" transform="translate(196 44) scale(.84)"/></clipPath></defs>`
  +lzBody(22,118,.6,{rot:-90})+lzS(64,154,"Couché : le sang\nest bien réparti","middle")
  +lzArr(116,118,156,118,{c:"#1E5A6D",w:2.4})+lzS(136,108,"se lever","middle")
  +lzBody(196,44,.84)+`<g clip-path="url(#lzc-ortho)"><rect x="170" y="114" width="52" height="60" style="fill:#7A2E5A;opacity:.55"/></g>`
  +lzC(196,44,6.5,"#EDE6E3","#B9A6A2",1)+lzC(199,54,2.4,LC.elec,LC.elecD,.8)
  +lzArr(226,120,226,166,{c:LC.acc,w:2})+lzLR(140,"Le sang\ns'accumule\ndans les\njambes",1,214,150)
  +lzLR(34,"Cerveau\nmoins irrigué :\nvertiges,\nvoile noir",1,204,42)
  +lzLL(40,"Capteurs de pression\ndu cou : réponse lente",0,197,56)
  +lzPill(160,240,"Risque de malaise et de chute",LC.acc),
 cap:"Chute de la tension de plus de **20 mmHg** (systolique) dans les 3 minutes après le lever. Lever **progressif** : s'asseoir au bord du lit, attendre, puis se lever."});
/* ============ Insuffisance cardiaque ============ */
lz("icg",{t:"Le ventricule gauche pompe mal : le sang reflue vers les poumons",sub:"La pression monte dans les vaisseaux pulmonaires et du liquide passe dans les alvéoles",h:262,ins:false,
 draw:()=>lzLungs(102,64,.72,{ex:lzDots(-56,0,40,30,9,4,(x,y)=>lzC(x,y,2.6,LC.fluid,LC.fluidD,.6))+lzDots(16,0,40,30,9,9,(x,y)=>lzC(x,y,2.6,LC.fluid,LC.fluidD,.6))})
  +lzHeart(102,196,.56,{vg:1.28,pale:"vg"})
  +lzQ(132,206,152,180,128,174,{c:LC.acc,w:2})+lzQ(128,166,150,130,118,96,{c:LC.acc,w:2,dash:"5 4"})
  +lzZoom("icg",128,78,262,84,52,`<rect x="210" y="32" width="104" height="104" style="fill:#FBEDEA"/>`+lzAlv(240,70,17,"eau",3)+lzAlv(282,74,17,"eau",5)+lzAlv(262,108,17,"plein",7))
  +lzLL(250,"Ventricule gauche qui pompe mal",1,124,214)
  +lzS(262,150,"Liquide dans les alvéoles :","middle","st-acc")+lzS(262,161,"l'oxygène passe mal","middle","st-acc")
  +lzLR(196,"Le sang reflue\nvers les poumons",1,150,150),
 cap:"Essoufflement à l'effort puis allongé (**orthopnée** : le patient dort assis), crépitants à l'auscultation. Forme aiguë : l'**œdème aigu du poumon**."});
const lzLegEdema=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})">${lzP("M4 0 L30 0 L32 62 C36 74 42 80 56 84 C66 86 66 96 54 98 L6 98 C-4 96 -6 86 -4 74 Z",LC.skin,LC.skinD,1)}${lzP("M-6 56 C-12 70 -10 86 -4 96 L8 96 L8 58 Z M30 54 C40 60 46 70 44 82 L32 84 Z","#F2C4A9",LC.skinD,.8)}${lzDots(-4,58,40,34,10,6,(x,y)=>lzC(x,y,1.8,LC.fluid,"none"))}${lzE(20,74,6,4,"#E9B49B","#B98466",.8)}</g>`;
lz("icd",{t:"Le ventricule droit pompe mal : le sang stagne dans les veines",sub:"Le sang revient mal vers le cœur : veines du cou gonflées, gros foie, œdèmes",h:262,ins:false,
 draw:()=>lzP("M126 72 L126 14 M140 72 L140 14","none",LC.veinD,13)+lzP("M126 72 L126 14 M140 72 L140 14","none",LC.vein,10.5)
  +lzHeart(150,126,.58,{vd:1.3,od:1.2,pale:"vd"})
  +lzP("M60 212 C56 186 94 172 132 178 C158 182 168 198 150 214 C128 232 80 236 60 212 Z","url(#rg-liver)","rgba(80,30,25,.5)",1)
  +lzLegEdema(236,150,.95)
  +lzArr(118,86,118,40,{c:LC.vein,w:2})+lzArr(120,160,104,184,{c:LC.vein,w:2})+lzArr(176,170,226,192,{c:LC.vein,w:2,dash:"4 3"})
  +lzLL(28,"Veines du cou\ngonflées",1,124,30)+lzLL(248,"Foie gros et douloureux",1,96,214)+lzLR(126,"Œdèmes des\nchevilles\n(godet)",1,256,222)
  +lzLR(68,"Ventricule droit\nqui pompe mal",1,170,140),
 cap:"Souvent la suite d'une insuffisance cardiaque gauche ou d'une maladie pulmonaire. Surveiller le **poids** chaque jour : une prise rapide signale une rétention d'eau."});
lz("icglob",{t:"Les deux ventricules s'épuisent",sub:"Le cumul des deux tableaux : poumons engorgés et œdèmes dans le corps",h:252,ins:false,
 draw:()=>lzLungs(96,62,.6,{ex:lzDots(-56,0,40,30,8,4,(x,y)=>lzC(x,y,2.8,LC.fluid,LC.fluidD,.6))+lzDots(16,0,40,30,8,9,(x,y)=>lzC(x,y,2.8,LC.fluid,LC.fluidD,.6))})
  +lzHeart(96,182,.56,{vg:1.25,vd:1.25,pale:"vg"})+lzLegEdema(232,140,1)
  +lzQ(120,166,142,130,112,92,{c:LC.acc,w:2,dash:"5 4"})+lzArr(150,196,218,206,{c:LC.vein,w:2,dash:"4 3"})
  +lzLR(40,"Côté gauche : liquide\ndans les poumons\n(essoufflement)",1,140,62)+lzLL(244,"Deux ventricules dilatés",1,96,214)+lzLR(104,"Côté droit :\nœdèmes,\ngros foie",1,248,206),
 cap:"Évolution fréquente des insuffisances cardiaques anciennes. Décompensations répétées : surveiller **poids, essoufflement, œdèmes**, et le respect du régime pauvre en sel."});
lz("oap",{t:"Les alvéoles se remplissent de liquide",sub:"La pression dans les capillaires pousse l'eau du sang dans les poumons : l'oxygène ne passe plus",h:246,ix:226,iy:4,
 draw:()=>lzBox(6,6,104,150,"Alvéole normale")+lzAlv(58,78,34,"air",3)+lzArr(58,52,58,70,{c:LC.o2,w:1.8,hl:5})+lzS(58,132,"L'oxygène passe\ndans le sang","middle")
  +lzBox(114,6,104,150,"Œdème du poumon",1)+lzAlv(166,78,34,"eau",5)+lzP("M140 116 Q166 128 192 116","none","#D8473A",5)
  +[148,166,184].map(x=>lzArr(x,118,x,100,{c:LC.fluidD,w:1.8,hl:5})).join("")+lzS(166,132,"L'eau sort des\ncapillaires","middle","st-acc")
  +lzPill(160,182,"Détresse respiratoire : urgence",LC.acc)
  +lzS(160,206,"Mousse rosée, crépitants « en marée montante »,\nsueurs, angoisse ; souvent l'insuffisance\ncardiaque gauche qui décompense","middle"),
 cap:"Installer **assis, jambes pendantes**, oxygène, appeler le médecin ; diurétiques et dérivés nitrés sur prescription. Surveiller SpO₂, FR, diurèse."});
/* ============ Coronaires ============ */
function lzCoro(id,type){const inner=lzArtL(196,96,120,56,10,{seed:7,rbc:type==="occl"?3:8})
  +lzP("M226 106 C236 122 262 124 276 106 Z",LC.fat,LC.fatD,1)+lzP("M226 142 C240 128 262 128 280 142 Z",LC.fat,LC.fatD,1)
  +(type==="occl"?lzP("M232 112 C244 118 250 132 238 140 C250 132 264 132 272 140 C262 128 266 116 276 110 C264 118 252 116 242 108 Z",LC.clot,"#3E0E0B",.8)+lzP("M250 112 L258 136 M244 120 L268 126","none","#B04A40",.6):"")
  +(type==="fiss"?lzP("M248 110 L252 116 L250 120 M252 116 C258 120 262 124 266 118 C266 126 258 130 250 128 Z",LC.clot,"#3E0E0B",.8):"")
  +(type==="occl"?"":lzArr(204,124,300,124,{c:"#1E5A6D",w:1.6}));
 return lzZoom(id,150,127,262,124,54,inner);}
const lzCoroFig=(id,o)=>lz(id,{t:o.t,sub:o.sub,h:250,ins:false,cap:o.cap,
 draw:()=>lzOrg("coeur",["coronaires"],2,34,.62)+(o.zone?`<ellipse cx="132" cy="150" rx="18" ry="13" transform="rotate(-25 132 150)" style="fill:${o.zone};opacity:${o.op||.78}"/>`:"")
  +lzC(150,127,3.8,o.type==="occl"?LC.clot:LC.fat,"#fff",1.2)+lzCoro(id,o.type)+lzLL(218,o.zl,1,126,156)
  +lzS(262,190,o.zz[0],"middle","st-acc")+lzS(262,201,o.zz[1],"middle","st-acc")+(o.pill?lzPill(160,18,o.pill,LC.acc):"")});
lzCoroFig("idm",{t:"Une artère coronaire se bouche : le muscle cardiaque meurt",sub:"Une plaque d'athérome se rompt, un caillot ferme l'artère, le muscle en aval manque d'oxygène",type:"occl",zone:LC.necro,zl:"Zone privée d'oxygène :\nle muscle se nécrose",zz:["Plaque rompue + caillot :","l'artère est bouchée"],pill:"Chaque minute compte",
 cap:"Douleur thoracique serrée, prolongée, qui ne cède pas au repos ni à la trinitrine : **appeler le 15**, ECG immédiat. Plus l'artère est rouverte tôt, plus on sauve de muscle."});
lzCoroFig("sca",{t:"La plaque d'une coronaire se fissure : un caillot se forme",sub:"Syndrome coronarien aigu : de l'angor instable à l'infarctus selon que l'artère est en partie ou complètement bouchée",type:"fiss",zone:"#7E3B36",op:.55,zl:"Muscle cardiaque\nen manque d'oxygène",zz:["Plaque fissurée :","un caillot rétrécit l'artère"],pill:"Urgence : appeler le 15",
 cap:"Toute douleur thoracique suspecte est une urgence : **ECG dans les 10 minutes**, dosage de la troponine, surveillance continue."});
lzCoroFig("angor-stable",{t:"Une coronaire rétrécie ne suffit plus à l'effort",sub:"Au repos le débit suffit ; à l'effort le cœur demande plus d'oxygène que l'artère ne peut en apporter",type:"plaque",zone:"#E9A79D",op:.7,zl:"À l'effort, ce muscle manque\nd'oxygène : douleur",zz:["Plaque d'athérome :","l'artère est rétrécie"],pill:"Douleur qui cède au repos",
 cap:"Douleur d'effort, brève, calmée en quelques minutes par le **repos** ou la **trinitrine**. Signe d'alerte : une douleur au repos ou qui s'aggrave."});
lzCoroFig("angor-instable",{t:"La plaque se fissure : la douleur survient au repos",sub:"Un petit caillot rétrécit brutalement la coronaire, sans encore la boucher complètement",type:"fiss",zone:"#B8574D",op:.6,zl:"Muscle en manque d'oxygène,\nmême au repos",zz:["Plaque fissurée +","petit caillot"],pill:"Risque d'infarctus : urgence",
 cap:"Douleur de repos, prolongée ou de plus en plus fréquente : c'est un **syndrome coronarien aigu**, à prendre en charge comme un infarctus."});
lz("atherosclerose",{t:"Le cholestérol s'accumule dans la paroi des artères",sub:"De la strie graisseuse à la plaque qui se rompt : trois étapes sur des années",h:246,ins:false,
 draw:()=>lzArtL(8,34,304,78,10,{seed:12,rbc:20})
  +lzP("M30 44 Q60 47 92 44 L92 46 Q60 49 30 46 Z",LC.fat,"none")
  +lzP("M118 44 C130 70 182 72 198 44 Z",LC.fat,LC.fatD,1)+lzP("M122 46 C136 66 178 66 194 46","none","#FFF4E6",2.4)+lzP("M140 102 C150 92 170 92 180 102 Z",LC.fat,LC.fatD,1)
  +lzP("M222 44 C230 82 288 84 300 44 Z",LC.fat,LC.fatD,1)+lzP("M228 102 C244 84 280 84 296 102 Z",LC.fat,LC.fatD,1)
  +lzP("M236 64 C252 72 262 86 248 96 C262 88 276 90 286 96 C276 84 280 72 290 62 C278 70 262 70 252 60 Z",LC.clot,"#3E0E0B",.8)
  +[[60,"1"],[158,"2"],[260,"3"]].map(([x,n])=>lzC(x,20,9,LC.acc,"#fff",1.5)+`<text x="${x}" y="24" text-anchor="middle" style="fill:#fff;font-weight:700;font-size:11px">${n}</text>`).join("")
  +lzS(60,140,"Le cholestérol\ns'infiltre sous\nla paroi interne","middle")+lzS(158,140,"La plaque grossit\net rétrécit\nl'artère","middle")+lzS(260,140,"Elle se rompt :\nun caillot\nbouche l'artère","middle","st-acc")
  +lzS(160,196,"Facteurs aggravants : tabac, cholestérol, HTA, diabète,\nsédentarité, surpoids, hérédité, âge","middle")
  +lzPill(160,232,"Conséquences : infarctus, AVC, artérite des jambes",LC.acc),
 cap:"L'athérosclérose ne fait pas mal tant que l'artère n'est pas très rétrécie ou bouchée : la **prévention** (arrêt du tabac, activité physique, alimentation) est le premier traitement."});
lz("aomi",{t:"Les artères des jambes se rétrécissent",sub:"À la marche, les muscles du mollet manquent d'oxygène : c'est la claudication",h:250,ins:false,
 draw:()=>lzOrg("jambe",["arteres","mollet"],-24,20,.8)
  +lzZoom("aomi",109,73,262,92,54,lzArtL(206,64,112,56,9,{seed:3,rbc:5})+lzP("M226 73 C236 92 270 96 286 73 Z",LC.fat,LC.fatD,1)+lzP("M232 111 C244 98 266 98 280 111 Z",LC.fat,LC.fatD,1)+lzArr(210,92,236,92,{c:"#1E5A6D",w:1.6}))
  +lzS(262,162,"Plaque d'athérome :","middle","st-acc")+lzS(262,173,"le sang passe mal","middle","st-acc")
  +lzLL(236,"Mollet : crampe à la marche\nqui cède à l'arrêt",1,90,145)+lzLR(214,"Stade avancé : douleur\nde repos, plaie qui\nne cicatrise pas",0,170,198),
 cap:"Mesure de l'**IPS** (index de pression systolique) : en dessous de 0,9, l'artérite est confirmée. Pied à surveiller chaque jour, surtout chez le diabétique."});
lz("anevrisme-aorte",{t:"L'aorte se dilate comme un ballon",sub:"La paroi s'amincit sous la pression : le risque est la rupture",h:262,ix:226,iy:168,
 draw:()=>{const T="M150 10 L150 92 M150 172 L150 196 L112 254 M150 196 L188 254";
  return lzP(T,"none","rgba(90,40,35,.55)",28)+lzP(T,"none",LC.med,26)+lzP(T,"none",LC.plasma,19)
   +lzP("M150 58 L100 58 M150 58 L200 58","none",LC.med,8)+lzE(88,58,13,19,"url(#rg-kidney)","rgba(80,30,25,.5)",1)+lzE(212,58,13,19,"url(#rg-kidney)","rgba(80,30,25,.5)",1)
   +lzP("M136 88 C98 102 96 160 136 176 L164 176 C204 160 202 102 164 88 Z",LC.med,"rgba(90,40,35,.6)",1)
   +lzP("M139 92 C104 106 103 158 139 172 L161 172 C196 158 196 106 161 92 Z",LC.plasma,"none")
   +lzP("M139 94 C108 108 107 156 139 170 C126 156 124 110 139 94 Z",LC.clotL,"#6E1A16",.6)
   +lzRbcs(136,100,40,62,8,4,3.4)+lzRbcs(140,16,20,64,4,6,3)
   +[[1,108],[1,132],[1,156],[-1,132]].map(([d,y])=>lzArr(150+d*20,y,150+d*42,y,{c:LC.acc,w:1.8,hl:5})).join("")
   +lzLL(28,"Aorte normale :\nenviron 2 cm",0,140,30)
   +lzLR(112,"Paroi amincie,\ndistendue",1,196,112)+lzLL(150,"Caillot collé\nà la paroi",0,118,150)
   +lzPill(150,240,"Rupture : douleur brutale, choc",LC.acc);},
 cap:"Souvent découvert par hasard (échographie). Surveillance du diamètre ; au-delà de **5 à 5,5 cm**, une opération est proposée. Contrôler la **tension**, arrêter le tabac."});
lz("dissection-aortique",{t:"La paroi de l'aorte se déchire et se décolle",sub:"Le sang s'engouffre entre les couches de la paroi : un faux chenal se forme",h:262,ix:226,iy:4,
 draw:()=>{const C=`M96 196 L96 110 A50 50 0 0 1 196 110 L196 252`;
  return lzHeart(96,222,.5,{vx:false})
   +lzP(C,"none","rgba(90,40,35,.55)",34)+lzP(C,"none",LC.adv,32.5)+lzP(C,"none",LC.med,27)+lzP(C,"none",LC.plasma,21)
   +`<path d="M90 168 L90 110 A56 56 0 0 1 202 110 L202 236" style="fill:none;stroke:${LC.clotL};stroke-width:9;opacity:.92"/>`
   +lzP(`M94.5 166 L94.5 110 A51.5 51.5 0 0 1 197.5 110 L197.5 238`,"none",LC.intima,2.4)
   +lzRbcs(84,180,20,14,3,5,3.2)+lzRbcs(184,150,16,80,6,8,3.2)+lzRbcs(120,64,50,14,4,3,3.2)
   +lzArr(97,186,97,150,{c:"#1E5A6D",w:1.8})+lzQ(98,152,92,144,89,140,{c:LC.acc,w:2.2,hl:6})
   +lzLL(70,"Faux chenal :\nle sang\ndécolle\nla paroi",1,86,100)+lzLL(140,"Déchirure\nde la paroi\ninterne",1,90,146)
   +lzLL(240,"Cœur",0,70,228)+lzLR(240,"Vrai chenal",0,198,226)
   +`<circle cx="268" cy="150" r="30" style="fill:${LC.adv};stroke:rgba(90,40,35,.5);stroke-width:.8"/><circle cx="268" cy="150" r="26" style="fill:${LC.med}"/><circle cx="268" cy="150" r="21" style="fill:${LC.clotL}"/>
     <path d="M250 136 C262 154 274 156 288 142 L288 164 C276 172 258 170 250 160 Z" style="fill:${LC.plasma}"/><path d="M250 136 C262 154 274 156 288 142" style="fill:none;stroke:${LC.intima};stroke-width:2.4"/>${lzRbcs(256,152,24,10,3,6,2.8)}`
   +lzS(268,192,"En coupe :\ndeux chenaux","middle")
   +lzPill(110,20,"Douleur brutale, déchirante",LC.acc);},
 cap:"Urgence vitale : risque de **rupture** de l'aorte et de mauvaise irrigation des organes (cerveau, reins, intestin, membres). Mesurer la **tension aux deux bras**."});
/* ============ Veines et embolie ============ */
lz("tvp",{t:"Un caillot se forme dans une veine profonde de la jambe",sub:"Il peut grossir, boucher la veine, ou se détacher et partir vers les poumons",h:256,ins:false,
 draw:()=>lzOrg("jambe",["veinesp","mollet"],-24,20,.8)
  +lzZoom("tvp",96,108,250,118,62,`<rect x="188" y="56" width="124" height="124" style="fill:#FBF3F1"/>`+lzVeinV(224,50,140,52,{valves:[98,152],seed:3,rbc:8})
   +lzP("M238 150 C234 126 236 104 244 92 C250 84 256 88 256 96 C258 110 258 130 262 150 C254 154 244 154 238 150 Z",LC.clot,"#3E0E0B",.8)+lzP("M244 120 L256 132 M242 108 L254 116","none","#B04A40",.7)
   +lzArr(250,86,250,64,{c:LC.acc,w:1.8,dash:"3 3"}))
  +lzS(250,196,"Caillot accroché à une valvule :","middle","st-acc")+lzS(250,207,"un fragment peut migrer","middle","st-acc")
  +lzLL(236,"Mollet gonflé, chaud,\ndouloureux",1,86,150),
 cap:"Trois causes (triade de Virchow) : sang qui **stagne**, paroi **abîmée**, sang qui **coagule trop**. Prévention : **lever précoce**, mobilisation, bas de contention, **anticoagulant préventif** prescrit. Complication redoutée : l'**embolie pulmonaire**."});
lz("ep",{t:"Un caillot bouche une artère du poumon",sub:"Venu le plus souvent d'une veine des jambes, il bloque la circulation dans une partie du poumon",h:256,ins:false,
 draw:()=>lzOrg("poumons",["vaisseaux"],-18,18,.74)+`<ellipse cx="74" cy="150" rx="28" ry="22" style="fill:#7E8A93;opacity:.45"/>`+lzC(86,104,4,LC.clot,"#fff",1.2)
  +lzQ(40,250,20,200,62,162,{c:LC.acc,w:2,dash:"5 4"})
  +lzZoom("ep",86,104,256,96,58,`<rect x="198" y="38" width="116" height="116" style="fill:#FBF3F1"/>`
   +lzP("M200 96 L246 96 M246 96 L300 62 M246 96 L300 132","none","#2E4079",22)+lzP("M200 96 L246 96 M246 96 L300 62 M246 96 L300 132","none","#C9D2EE",16)
   +lzRbcs(204,90,34,12,4,3,3)+lzP("M238 88 C250 84 262 90 262 98 C262 106 252 110 240 106 C232 102 230 92 238 88 Z",LC.clot,"#3E0E0B",.8)
   +lzArr(206,96,226,96,{c:"#1E5A6D",w:1.6}))
  +lzS(256,170,"Caillot coincé :","middle","st-acc")+lzS(256,181,"le sang ne passe plus","middle","st-acc")
  +lzLR(216,"Zone du poumon\nnon irriguée",1,98,150)+lzLL(246,"Caillot venu des jambes",0,36,236),
 cap:"Essoufflement brutal, douleur thoracique, tachycardie, parfois malaise : **urgence**. Le traitement est anticoagulant ; prévenir par la prévention de la phlébite."});
const lzVarice=(id,o)=>lz(id,{t:o.t,sub:o.sub,h:250,ins:false,cap:o.cap,
 draw:()=>lzBox(6,6,148,184,"Veine normale")+lzVeinV(62,30,150,36,{valves:[76,136],seed:2,rbc:9})+[56,112,164].map(y=>lzArr(48,y+14,48,y-6,{c:"#1E5A6D",w:1.6,hl:5})).join("")
  +lzS(80,206,"Les valvules se ferment :\nle sang remonte","middle")
  +lzBox(166,6,148,184,o.right,1)+`<path d="M212 30 C196 60 236 80 214 110 C196 136 236 150 220 180" style="fill:none;stroke:${LC.veinD};stroke-width:42"/><path d="M212 30 C196 60 236 80 214 110 C196 136 236 150 220 180" style="fill:none;stroke:${LC.veinL};stroke-width:35"/>`
  +lzRbcs(196,40,40,130,14,5,3.4).replace(/#E0503F/g,"#A8423C")+lzP("M198 72 Q206 70 212 60 M232 72 Q224 70 218 62 M196 130 Q204 126 210 118 M236 130 Q228 128 220 120","none","#8DA0DA",2.4)
  +[70,130].map(y=>lzArr(254,y-18,254,y+12,{c:LC.acc,w:1.8,hl:5})).join("")+lzS(240,206,o.rs,"middle","st-acc")
  +(o.extra||"")});
lzVarice("varices",{t:"Les veines superficielles se dilatent",sub:"Les valvules ne ferment plus : le sang redescend et la veine se distend",right:"Varice",rs:"Valvules qui fuient :\nle sang reflue",
 cap:"Jambes lourdes le soir, en position debout prolongée. Conseils : marcher, surélever les jambes, éviter la chaleur, **bas de contention**."});
lzVarice("ivc",{t:"Le sang remonte mal vers le cœur",sub:"Valvules abîmées : le sang stagne dans les jambes, l'eau passe dans les tissus",right:"Insuffisance veineuse",rs:"Le sang stagne :\nœdèmes, peau brune",
 cap:"Évolue vers l'œdème, la dermite ocre, puis l'**ulcère veineux** de la cheville. Traitement : **compression**, marche, surélévation des jambes."});
/* ============ Valves, muscle, péricarde ============ */
lz("endocardite",{t:"Des bactéries se fixent sur une valve du cœur",sub:"Elles forment des « végétations » qui abîment la valve et peuvent se détacher",h:250,ins:false,
 draw:()=>lzHeart(104,150,.8,{ex:lzP("M20 -10 C16 -16 22 -22 28 -18 C34 -24 40 -16 36 -10 C40 -4 30 0 26 -6 C22 -2 16 -4 20 -10 Z","#C7D47A","#6E8A2E",1)+lzDots(18,-20,20,14,6,4,lzCoc)})
  +lzZoom("endo",126,141,262,86,52,`<rect x="210" y="34" width="104" height="104" style="fill:#F7CBC3"/>`+lzP("M214 70 C236 84 248 100 252 118 M310 70 C288 84 276 100 272 118","none","#F4D3CC",9)
   +lzP("M244 96 C236 84 248 74 258 82 C266 74 278 82 272 94 C280 104 266 112 258 104 C250 112 236 106 244 96 Z","#C7D47A","#6E8A2E",1.2)+lzDots(244,80,30,26,12,7,lzCoc)
   +lzC(298,118,3.4,"#C7D47A","#6E8A2E",.8)+lzArr(282,108,302,128,{c:LC.acc,w:1.4,hl:4}))
  +lzS(262,152,"Végétation : bactéries","middle","st-acc")+lzS(262,163,"collées sur la valve","middle","st-acc")
  +lzLR(196,"Des fragments partent :\ncerveau, reins, rate",1)+lzLL(236,"Porte d'entrée : dents,\ncathéter, injections",0),
 cap:"Fièvre inexpliquée chez un porteur de valve ou de cathéter : penser à l'endocardite. **Hémocultures** répétées avant l'antibiothérapie, prolongée (plusieurs semaines)."});
lz("myocardite",{t:"Le muscle du cœur est enflammé",sub:"Le plus souvent après un virus : le muscle se contracte moins bien",h:246,ins:false,
 draw:()=>lzHeart(100,140,.78,{ex:lzDots(-60,-4,118,64,9,5,(x,y)=>lzE(x,y,9,6,LC.inflam,"none",0,0,";opacity:.55"))})
  +lzZoom("myo",134,150,260,96,54,`<rect x="206" y="42" width="108" height="108" style="fill:#F3D8D2"/>`
   +[50,68,86,104,122,140].map((y,i)=>lzR(206,y,108,12,6,i%2?"#C9675A":"#D27869","rgba(90,30,25,.35)",.6)+[...Array(9)].map((_,k)=>lzP(`M${212+k*12} ${y+2} v8`,"none","rgba(255,230,225,.45)",1)).join("")).join("")
   +lzDots(214,52,92,92,10,6,(x,y)=>lzWbc(x,y,4.2)))
  +lzS(260,164,"Cellules de l'inflammation","middle","st-acc")+lzS(260,175,"entre les fibres musculaires","middle","st-acc")
  +lzLL(226,"Douleur, essoufflement,\npalpitations après un virus",0),
 cap:"Repos et surveillance (ECG, troponine, échographie) ; risque de troubles du rythme et d'insuffisance cardiaque. Pas de sport intense pendant plusieurs mois."});
lz("pericardite",{t:"L'enveloppe du cœur est enflammée",sub:"Le péricarde s'épaissit et du liquide peut s'accumuler entre ses deux feuillets",h:246,ins:false,
 draw:()=>`<g transform="translate(130 128) scale(1.18)"><path d="M0 76 C-34 56 -74 20 -74 -16 C-74 -50 -48 -66 -24 -62 C-12 -60 -4 -54 0 -48 C4 -54 12 -60 24 -62 C48 -66 74 -50 74 -16 C74 20 34 56 0 76 Z" transform="scale(.92)" style="fill:#CFE6F5;stroke:${LC.acc};stroke-width:4.5;opacity:.95"/></g>`
  +lzHeart(130,126,.86,{vx:false})+lzLR(40,"Péricarde enflammé\n(épaissi, douloureux)",1,190,72)+lzLR(176,"Liquide entre\nles deux feuillets",1,202,150)
  +lzPill(130,232,"S'il comprime le cœur : tamponnade",LC.acc),
 cap:"Douleur thoracique **soulagée penché en avant**, aggravée à l'inspiration ; frottement péricardique. Surveiller les signes de tamponnade : hypotension, veines du cou gonflées."});
lz("cardiomyopathies",{t:"Le muscle cardiaque se déforme",sub:"Deux grandes formes : cœur dilaté qui pompe mal, ou cœur épaissi qui se remplit mal",h:216,ins:false,
 draw:()=>lzHeart(56,96,.48,{})+lzHeart(160,96,.56,{vg:1.32,vd:1.22,og:1.1})+lzHeart(264,96,.48,{vg:.55,vd:.8})
  +lzS(56,158,"Cœur normal","middle","st-b")+lzS(160,166,"Dilatée : cavités\ngrandes, parois fines","middle","st-acc")+lzS(264,158,"Hypertrophique :\nparois épaisses,\ncavités petites","middle","st-acc")
  +lzS(160,208,"Les deux mènent à l'insuffisance cardiaque","middle"),
 cap:"Causes : génétique, alcool, infarctus anciens, chimiothérapies… La forme hypertrophique peut causer une **mort subite à l'effort** chez le jeune."});
lz("stenose-aortique",{t:"La valve aortique calcifiée s'ouvre mal",sub:"Le sang sort difficilement du cœur : le ventricule gauche force et s'épaissit",h:250,ins:false,
 draw:()=>lzHeart(100,150,.8,{vg:.66,ex:lzP("M1 -52 L15 -52","none","#F4F1E8",5)+lzDots(0,-56,16,8,5,3,(x,y)=>lzC(x,y,2.2,"#F4F1E8","#B9AE94",.6))+lzArr(8,-44,8,-78,{c:LC.acc,w:2.4,hl:6})})
  +lzZoom("sa",106,108,262,96,52,`<rect x="210" y="44" width="104" height="104" style="fill:#F6E3DE"/>`+lzC(262,96,32,"#E9B3A9","#B05D52",1.4)
   +lzP("M262 96 L262 66 M262 96 L236 112 M262 96 L288 112","none","#F7F3EA",9)+lzDots(240,72,46,44,14,5,(x,y)=>lzC(x,y,2.6,"#F7F3EA","#B9AE94",.6))+lzE(262,96,6,3,"#7A1F1A","none"))
  +lzS(262,160,"Valve vue du dessus :","middle")+lzS(262,171,"calcifiée, presque fermée","middle","st-acc")
  +lzLL(236,"Ventricule gauche épaissi",1,128,176)+lzLR(206,"Essoufflement, douleur,\nmalaise à l'effort",0),
 cap:"Maladie du sujet âgé. Les trois signes d'alerte : **essoufflement, angor, syncope d'effort**. Traitement : remplacement de la valve (chirurgie ou TAVI)."});
lz("insuffisance-mitrale",{t:"La valve mitrale ne se ferme plus",sub:"À chaque contraction, une partie du sang repart en arrière vers l'oreillette gauche",h:250,ins:false,
 draw:()=>lzHeart(110,144,.82,{og:1.3,ex:lzQ(34,30,40,-6,36,-36,{c:LC.acc,w:3,hl:7})+lzP("M12 -10 L26 -2 M56 -10 L44 -2","none","#FFF6F2",2.4)})
  +lzLR(40,"Oreillette gauche\ndilatée",1,160,100)+lzLR(132,"Le sang reflue\nà chaque battement",1,142,118)+lzLR(196,"Ventricule gauche\nqui se fatigue",0,150,176)
  +lzLL(236,"Puis vers les poumons : essoufflement",0),
 cap:"Souffle à l'auscultation ; complications : **fibrillation atriale**, insuffisance cardiaque. Traitement selon la gravité : surveillance, médicaments, réparation de la valve."});
/* ============ Rythme cardiaque (cœur électrique + tracé ECG) ============ */
const lzRhythm=(id,o)=>lz(id,{t:o.t,sub:o.sub,h:262,ins:false,cap:o.cap,
 draw:()=>lzHeart(100,112,.82,Object.assign({cond:1},o.h||{}))+(o.labels||[]).map(a=>lzLR(...a)).join("")+(o.pill?lzPill(230,20,o.pill,LC.acc):"")
  +lzT(12,214,o.ecgL,"st-b")+lzEcg(12,222,296,34,o.ecg)});
lzRhythm("fa",{t:"Les oreillettes s'agitent dans tous les sens",sub:"Des centaines d'influx désordonnés : les oreillettes ne se contractent plus, le pouls devient irrégulier",ecg:"fa",ecgL:"ECG : pas d'onde P, QRS irréguliers",
 h:{sinus:"#F7E2A0",ex:(()=>{const R=lzRnd(21);let s="";for(let i=0;i<16;i++){const x=-58+R()*112,y=-46+R()*30;if(Math.abs(x)<8)continue;s+=lzP(`M${lzN(x)} ${lzN(y)} q3 -4 6 0 t6 0`,"none",LC.elec,1.6);}return s+lzC(-7,-13,6,"rgba(242,183,5,.35)",LC.elecD,1);})()},
 labels:[[58,"Oreillettes : activité\nélectrique anarchique",1,140,82],[110,"Le nœud auriculo-\nventriculaire filtre\nau hasard",0,96,100],[164,"Ventricules : battements\nirréguliers",0,140,140]],
 cap:"Le sang stagne dans les oreillettes et peut former un **caillot** : risque d'**AVC**. D'où le traitement anticoagulant et la surveillance du pouls (irrégulier)."});
lzRhythm("flutter",{t:"Un influx tourne en boucle dans l'oreillette droite",sub:"Un circuit électrique rapide et régulier : l'oreillette bat environ 300 fois par minute",ecg:"flutter",ecgL:"ECG : aspect en « dents de scie »",
 h:{ex:`<circle cx="-34" cy="-31" r="13" style="fill:none;stroke:${LC.elec};stroke-width:2.6;stroke-dasharray:60 22"/>`+lzArr(-46,-26,-44,-34,{c:LC.elecD,w:2,hl:5})},
 labels:[[58,"Circuit électrique en\nboucle (oreillette droite)",1,80,86],[150,"Le nœud laisse passer\n1 influx sur 2 ou sur 3",0,96,100]],
 cap:"Fréquence ventriculaire souvent autour de **150/min**. Même risque d'AVC que la fibrillation atriale : anticoagulation ; traitement possible par ablation."});
lzRhythm("tsv",{t:"Un court-circuit près du nœud auriculo-ventriculaire",sub:"L'influx tourne très vite entre oreillettes et ventricules : le cœur s'emballe d'un coup",ecg:"tsv",ecgL:"ECG : QRS fins, rapides et réguliers",
 h:{ex:`<circle cx="-7" cy="-13" r="9" style="fill:none;stroke:${LC.acc};stroke-width:2.6;stroke-dasharray:40 14"/>`+lzArr(-16,-10,-14,-18,{c:LC.acc,w:2,hl:5})},
 labels:[[58,"Boucle électrique autour\ndu nœud AV",1,96,100],[150,"Palpitations brutales,\nqui s'arrêtent d'un coup",0,140,140]],
 cap:"Souvent chez le sujet jeune au cœur sain. Manœuvres vagales (souffler dans une seringue), puis médicament sur prescription médicale (adénosine) sous scope."});
lzRhythm("tv",{t:"Un foyer électrique s'emballe dans un ventricule",sub:"Les ventricules battent très vite, sans l'aide des oreillettes : le cœur se remplit mal",ecg:"tv",ecgL:"ECG : QRS larges, rapides et réguliers",
 h:{sinus:"#F7E2A0",ex:lzC(38,30,5,LC.acc,"#fff",1.2)+[10,16,22].map(r=>`<circle cx="38" cy="30" r="${r}" style="fill:none;stroke:${LC.acc};stroke-width:1.4;opacity:${1.2-r/22}"/>`).join("")},
 labels:[[110,"Foyer anormal dans\nle ventricule",1,132,138]],pill:"Peut évoluer en arrêt cardiaque",
 cap:"Urgence : vérifier la **conscience et le pouls**. Sans pouls, c'est un arrêt cardiaque : massage et **défibrillation**. Avec pouls : scope, médecin, chariot d'urgence."});
lzRhythm("fv",{t:"Les ventricules ne font plus que trembler",sub:"Activité électrique totalement anarchique : le cœur ne pompe plus, c'est l'arrêt cardiaque",ecg:"fv",ecgL:"ECG : tracé anarchique, aucun QRS",
 h:{pale:"vg",ex:(()=>{const R=lzRnd(8);let s="";for(let i=0;i<18;i++){const x=-54+R()*104,y=-2+R()*56;s+=lzP(`M${lzN(x)} ${lzN(y)} q3 -4 6 0 t6 0`,"none",LC.acc,1.8);}return s;})()},
 labels:[[110,"Ventricules : trémulation\nsans contraction",1,140,140]],pill:"Arrêt cardiaque : choc électrique",
 cap:"Pas de pouls, pas de respiration normale : **appeler, masser, défibriller**. Chaque minute sans massage fait baisser fortement les chances de survie."});
lzRhythm("bradycardie",{t:"Le cœur bat trop lentement",sub:"Le nœud sinusal envoie peu d'influx, ou ils passent mal : moins de 50 à 60 battements par minute",ecg:"brady",ecgL:"ECG : complexes normaux mais très espacés",
 h:{sinus:"#E8DDBF",condC:"#E8D28A"},labels:[[58,"Nœud sinusal :\ninflux trop lents",1,62,76],[150,"Fatigue, vertiges,\nmalaise si très lent",0,140,140]],
 cap:"Normale chez le sportif. Causes : médicaments (bêtabloquants, digitaliques), hypothyroïdie, hypothermie, vieillissement du tissu de conduction."});
lzRhythm("bav",{t:"L'influx est bloqué entre oreillettes et ventricules",sub:"Bloc auriculo-ventriculaire : les ondes P ne sont pas toutes suivies d'une contraction des ventricules",ecg:"bav",ecgL:"ECG : ondes P non suivies de QRS",
 h:{ex:lzP("M-15 -21 L1 -5 M1 -21 L-15 -5","none",LC.acc,4)},labels:[[58,"Blocage au niveau\ndu nœud AV",1,90,100],[150,"Ventricules lents :\nmalaise, syncope",0,140,140]],
 cap:"Le bloc complet (3e degré) est une urgence : risque de syncope et d'arrêt. Traitement : **stimulateur cardiaque** (pacemaker)."});
lzRhythm("acr",{t:"Le cœur ne pompe plus : plus de circulation",sub:"Le plus souvent une fibrillation ventriculaire, parfois une asystolie (aucune activité)",ecg:"fv",ecgL:"ECG : fibrillation ventriculaire (ou tracé plat)",
 h:{pale:"vg",valves:false,ex:lzP("M-30 10 L30 10","none","rgba(255,255,255,0)",1)},labels:[[58,"Plus de pouls,\nplus de respiration\nnormale",1,140,100],[150,"Le cerveau souffre\nen 3 à 5 minutes",0,96,140]],pill:"Masser, défibriller",
 cap:"Chaîne de survie : **reconnaître, alerter (15 ou 112), masser** 100 à 120 fois par minute, **défibriller** dès que possible."});
lz("choc-cardio",{t:"Le cœur ne pompe plus assez : la pression s'effondre",sub:"Choc cardiogénique : les organes ne reçoivent plus assez de sang",h:246,ins:false,
 draw:()=>lzHeart(92,112,.78,{vg:1.2,pale:"vg"})
  +[["Cerveau","confusion, agitation",44],["Reins","urines rares",104],["Peau","marbrures, froide",164]].map(([t,d,y])=>lzR(180,y-18,134,40,10,"var(--fx-bg)","var(--fx-line)",1)+lzT(192,y-1,t,"st-b")+lzS(192,y+12,d)).join("")
  +lzArr(150,80,176,50,{c:"var(--fx-sub)",w:1.2})+lzArr(150,112,176,106,{c:"var(--fx-sub)",w:1.2})+lzArr(150,144,176,162,{c:"var(--fx-sub)",w:1.2})
  +lzPill(160,226,"Tension basse + signes de mauvaise perfusion",LC.acc),
 cap:"Souvent après un infarctus étendu. Surveillance rapprochée : **TA, FC, diurèse, conscience, marbrures, lactates**. Prise en charge en réanimation."});
lz("cardio-cong",{t:"Un défaut de formation du cœur",sub:"Exemple fréquent : une communication entre les deux ventricules",h:236,ins:false,
 draw:()=>lzHeart(110,124,.84,{ex:lzE(0,22,5,9,"#F7CBC3","rgba(90,40,35,.6)",1)+lzArr(10,24,-14,24,{c:LC.acc,w:2.4,hl:6})})
  +lzLR(52,"Trou dans la cloison\nentre les ventricules",1,110,140)+lzLR(140,"Le sang passe du cœur\ngauche au cœur droit",1,100,144)
  +lzLL(226,"Trop de sang vers les poumons",0,80,90),
 cap:"Découvertes à l'échographie prénatale ou devant un souffle. Certaines se ferment seules ; d'autres sont opérées ou fermées par cathétérisme."});
