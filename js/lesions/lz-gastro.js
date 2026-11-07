/* Carnet IFSI — schémas des lésions : gastro-entérologie et hépatologie (45 pathologies). */
const lzMpG=(x,y)=>[lzN(-8+x*.62),lzN(18+y*.62)];
const lzGF=(id,o)=>lz(id,{t:o.t,sub:o.sub,h:o.h||262,ins:false,cap:o.cap,
 draw:()=>{const [px,py]=lzMpG(...o.pt);return lzOrg("digestif",o.zones||[],-8,18,.62)+(o.over||"")+lzZoom(id,px,py,248,96,62,`<rect x="186" y="34" width="124" height="124" style="fill:${o.bg||"#FBF1EF"}"/>`+o.inner())
  +(o.zt?lzS(248,176,o.zt[0],"middle","st-acc")+lzS(248,187,o.zt[1]||"","middle","st-acc"):"")+(o.extra?o.extra():"")+(o.pill?lzPill(160,(o.h||262)-12,o.pill,LC.acc):"");}});
/* paroi digestive en coupe (lumière en haut) : muqueuse, sous-muqueuse, musculeuse, séreuse
   o.villi (villosités), o.flat (villosités atrophiées), o.red (inflammation), o.ulcer (profondeur 0-1), o.trans (fissure profonde), o.tumor, o.divert, o.polyp */
function lzWall(x,y,w,o={}){const top=y+(o.lumH||34),mu=14,sm=16,ms=22,R=lzRnd(o.seed||5);
 let s=lzR(x,y,w,o.lumH||34,0,o.lum||"#FFF6E8","none")+lzR(x,top,w,mu,0,o.red?"#E9877A":LC.mucosa,"none")+lzR(x,top+mu,w,sm,0,"#F7DCD2","none")+lzR(x,top+mu+sm,w,ms,0,LC.muscle,"none")+lzR(x,top+mu+sm+ms,w,5,0,"#F3E6DA","none");
 s+=[...Array(Math.floor(w/9))].map((_,i)=>lzP(`M${x+i*9+4} ${top+mu+sm+3} v${ms-6}`,"none","rgba(255,230,225,.35)",1.2)).join("");
 if(o.villi||o.flat)s+=[...Array(Math.floor(w/11))].map((_,i)=>{const vx=x+5+i*11,hh=o.flat&&i>=Math.floor(w/22)?3:14+R()*4;return lzP(`M${vx-3.5} ${top} L${vx-3} ${top-hh} Q${vx} ${top-hh-3} ${vx+3} ${top-hh} L${vx+3.5} ${top} Z`,o.red?"#E9877A":LC.mucosa,LC.mucosaD,.6);}).join("");
 if(o.ulcer)s+=lzP(`M${x+w*.36} ${top} C${x+w*.4} ${top+mu+sm*o.ulcer} ${x+w*.6} ${top+mu+sm*o.ulcer} ${x+w*.64} ${top} Z`,"#F7EFE0","#B04A40",1.2)+lzP(`M${x+w*.4} ${top+mu*.6} q${w*.1} ${sm*o.ulcer} ${w*.2} 0`,"none","#C8372D",1.4,";stroke-dasharray:2 2");
 if(o.trans)s+=lzP(`M${x+w*.48} ${top} L${x+w*.45} ${top+mu+sm+ms*.8} L${x+w*.52} ${top+mu+sm+ms*.8} L${x+w*.55} ${top} Z`,"#F7EFE0","#B04A40",1)+lzC(x+w*.3,top+mu+sm*.5,4,"#E7D3A0","#A88A40",.8)+lzC(x+w*.72,top+mu+sm*.5,4,"#E7D3A0","#A88A40",.8);
 if(o.tumor)s+=lzP(`M${x+w*.3} ${top+2} C${x+w*.32} ${top-22} ${x+w*.68} ${top-24} ${x+w*.7} ${top+2} L${x+w*.66} ${top+mu+sm+ms*.7} C${x+w*.56} ${top+mu+sm+ms} ${x+w*.42} ${top+mu+sm+ms} ${x+w*.34} ${top+mu+sm+ms*.7} Z`,"#8E6A8F","#5A3D5C",1.2);
 if(o.polyp)s+=lzP(`M${x+w*.46} ${top} L${x+w*.47} ${top-10} C${x+w*.38} ${top-14} ${x+w*.4} ${top-30} ${x+w*.5} ${top-30} C${x+w*.6} ${top-30} ${x+w*.62} ${top-14} ${x+w*.53} ${top-10} L${x+w*.54} ${top} Z`,"#D98A86","#A5524D",1);
 if(o.divert)s+=lzP(`M${x+w*.42} ${top} L${x+w*.42} ${top+mu+sm+ms} C${x+w*.38} ${top+mu+sm+ms+20} ${x+w*.62} ${top+mu+sm+ms+20} ${x+w*.58} ${top+mu+sm+ms} L${x+w*.58} ${top} Z`,o.red?"#E9877A":LC.mucosa,LC.mucosaD,1)+(o.red?lzC(x+w*.5,top+mu+sm+ms+4,6,"#E8D27A","#A8902A",.8):lzC(x+w*.5,top+mu+sm+ms+4,4.5,"#A07A50","#6A4A2A",.6));
 return s;}
const lzHp=(x,y,R)=>{const a=Math.round(R()*180);return `<path d="M${lzN(x-4)} ${lzN(y)} q2 -3 4 0 t4 0" transform="rotate(${a} ${lzN(x)} ${lzN(y)})" style="fill:none;stroke:${LC.bact};stroke-width:1.8;stroke-linecap:round"/>`;};
const lzStone=(x,y,r,R)=>lzP(lzSmooth([...Array(7)].map((_,i)=>{const a=i*Math.PI*2/7,k=r*(.8+(R?R():.5)*.35);return [x+Math.cos(a)*k,y+Math.sin(a)*k];})),"#C9A05A","#7A5A2A",1);
/* ============ Œsophage et estomac ============ */
const lzJunction=(o={})=>lzP("M240 36 L240 96","none",LC.mucosaD,26)+lzP("M240 36 L240 96","none",o.red?"#E9877A":LC.mucosa,20)
 +lzP("M226 92 C196 104 196 150 236 156 C276 160 306 138 300 110 C296 96 276 90 254 92 Z","#F2B6A8",LC.mucosaD,1.4)+lzP("M226 96 L254 96","none",o.open?"#E6B8B0":LC.muscleD,o.open?3:6)
 +lzP("M214 132 Q250 124 290 132 L292 150 Q250 158 212 148 Z","#C9D46A","none",0,";opacity:.75")+(o.ex||"");
lzGF("rgo",{t:"Le contenu acide de l'estomac remonte dans l'œsophage",sub:"Le sphincter entre l'œsophage et l'estomac ferme mal : l'acide irrite l'œsophage",zones:["oesophage","estomac"],pt:[166,34],
 inner:()=>lzJunction({open:1,ex:lzArr(232,130,236,70,{c:"#9AA52A",w:2.4})+lzArr(246,130,244,60,{c:"#9AA52A",w:2.4})}),zt:["Sphincter qui ferme mal :","l'acide remonte"],
 extra:()=>lzLL(196,"Brûlures qui remontent,\nsurtout allongé ou penché\naprès les repas",0),
 cap:"Conseils : surélever la tête du lit, éviter de se coucher juste après le repas, repas légers le soir, moins d'alcool, de tabac, de graisses ; perdre du poids si besoin."});
lzGF("oesophagite",{t:"La paroi de l'œsophage est enflammée et ulcérée",sub:"Le plus souvent à cause du reflux acide : la muqueuse rougit et s'érode",zones:["oesophage"],pt:[166,34],
 inner:()=>lzWall(186,40,124,{red:1,ulcer:.6,lumH:30,lum:"#F4F2D8"}),zt:["Muqueuse rouge et érodée","par l'acide"],
 extra:()=>lzLL(196,"Brûlures, douleur pour\navaler, parfois saignement",0),
 cap:"Traitement : inhibiteurs de la pompe à protons. Une œsophagite qui récidive doit être surveillée (endoscopie) : risque d'endobrachyœsophage."});
lzGF("hernie-hiatale",{t:"Une partie de l'estomac remonte au-dessus du diaphragme",sub:"Le haut de l'estomac glisse dans le thorax par l'orifice de l'œsophage : le reflux est favorisé",zones:["estomac","oesophage"],pt:[208,92],
 inner:()=>lzP("M186 104 L224 104 M258 104 L310 104","none","#C9675A",8)+lzP("M240 36 L240 64","none",LC.mucosaD,22)+lzP("M240 36 L240 64","none",LC.mucosa,16)+lzP("M228 64 C214 74 216 98 230 104 L250 104 C266 96 266 74 252 64 Z","#F2B6A8",LC.mucosaD,1.4)+lzP("M230 104 C200 116 204 152 240 156 C278 158 300 136 292 112 C288 104 270 102 250 104 Z","#F2B6A8",LC.mucosaD,1.4),zt:["Estomac en partie","au-dessus du diaphragme"],
 extra:()=>lzLL(196,"Diaphragme",0)+lzLL(220,"Reflux, gêne après\nles repas",0),
 cap:"Souvent associée au reflux : mêmes conseils hygiéno-diététiques. Chirurgie rarement nécessaire."});
lzGF("ulcere-gastrique",{t:"Un « trou » se creuse dans la paroi de l'estomac",sub:"L'acide attaque une muqueuse fragilisée (bactérie Helicobacter pylori, anti-inflammatoires)",zones:["estomac"],pt:[208,92],
 inner:()=>lzWall(186,40,124,{ulcer:.9,seed:3})+lzDots(200,60,90,14,9,4,lzHp),zt:["Ulcère : la paroi est creusée,","bactéries Helicobacter (vertes)"],
 extra:()=>lzLL(196,"Douleur au creux de l'estomac,\nrythmée par les repas",0),pill:"Perforation, hémorragie : urgence",
 cap:"Traitement : IPP et éradication d'Helicobacter (antibiotiques). Éviter AINS, aspirine, tabac. Signes d'alerte : vomissement de sang, selles noires, douleur brutale."});
lzGF("ulcere-duodenal",{t:"Un ulcère se creuse dans la paroi du duodénum",sub:"Juste après l'estomac : l'acide en excès et Helicobacter pylori abîment la muqueuse",zones:["grele","estomac"],pt:[184,124],
 inner:()=>lzWall(186,40,124,{ulcer:1,villi:1,seed:6})+lzDots(200,56,90,14,8,7,lzHp),zt:["Ulcère du duodénum","et Helicobacter pylori"],
 extra:()=>lzLL(196,"Douleur à distance des\nrepas, calmée en mangeant",0),pill:"Selles noires (méléna) : alerter",
 cap:"Même traitement que l'ulcère gastrique. Surveiller les signes d'hémorragie digestive : pâleur, tachycardie, malaise, méléna."});
lzGF("gastrite",{t:"La muqueuse de l'estomac est enflammée",sub:"Alcool, anti-inflammatoires, Helicobacter pylori, stress : la paroi rougit et devient sensible",zones:["estomac"],pt:[208,92],
 inner:()=>lzWall(186,40,124,{red:1,seed:4})+lzDots(196,58,110,14,6,3,lzHp)+lzDots(196,74,110,10,6,8,(x,y)=>lzWbc(x,y,3)),zt:["Muqueuse rouge et","inflammatoire"],
 extra:()=>lzLL(196,"Brûlures, nausées,\nlourdeur après les repas",0),
 cap:"Supprimer la cause (alcool, AINS), traitement d'Helicobacter s'il est présent, IPP. Repas fractionnés et légers."});
lzGF("dysphagie",{t:"Les aliments passent mal dans l'œsophage",sub:"Un rétrécissement ou un mauvais fonctionnement des muscles bloque le bol alimentaire",zones:["oesophage"],pt:[166,34],
 inner:()=>lzP("M248 36 L248 160","none",LC.mucosaD,40)+lzP("M248 36 L248 160","none",LC.mucosa,32)+lzP("M248 36 L248 90 M248 120 L248 160","none","#FFF6E8",20)+lzP("M232 92 C240 104 256 104 264 92 L264 118 C256 106 240 106 232 118 Z","#8E6A8F","#5A3D5C",1)+lzC(248,78,10,"#E8C9A0","#B08A60",1),zt:["Rétrécissement :","le bol alimentaire bloque"],
 extra:()=>lzLL(196,"Personne âgée, AVC,\nmaladie neurologique :\nrisque de fausse route",1),pill:"Adapter les textures, installation assise",
 cap:"Une dysphagie nouvelle chez l'adulte doit être explorée (endoscopie). Évaluer la déglutition, textures adaptées, position assise, surveillance des fausses routes."});
/* ============ Intestin ============ */
lzGF("gea",{t:"Un virus fait perdre beaucoup d'eau à l'intestin",sub:"L'intestin enflammé n'absorbe plus l'eau et en sécrète : diarrhée et vomissements",zones:["grele","colon"],pt:[160,168],
 inner:()=>lzWall(186,40,124,{villi:1,red:1,seed:5})+lzDots(196,46,110,18,6,4,(x,y)=>lzVirus(x,y,3.2))+[206,236,266,294].map(x=>lzArr(x,86,x,54,{c:LC.fluidD,w:1.8,hl:5})).join(""),zt:["Eau et sels qui sortent","dans l'intestin"],
 extra:()=>lzLL(196,"Danger : déshydratation,\nsurtout enfant et\npersonne âgée",1),pill:"Réhydrater : petites quantités souvent",
 cap:"Soluté de réhydratation orale, surveillance du **poids**, de la diurèse et des signes de déshydratation. Hygiène des mains stricte (très contagieux)."});
lzGF("diarrhee-aigue",{t:"L'intestin évacue trop d'eau",sub:"Infection, toxine ou médicament : l'eau n'est plus absorbée et le transit s'accélère",zones:["grele","colon"],pt:[160,168],
 inner:()=>lzWall(186,40,124,{villi:1,seed:8})+[206,236,266,294].map(x=>lzArr(x,86,x,54,{c:LC.fluidD,w:1.8,hl:5})).join("")+lzArr(196,46,300,46,{c:"#8A6A3A",w:2}),zt:["Eau sécrétée et","transit accéléré"],
 extra:()=>lzLL(196,"Plus de 3 selles liquides\npar jour",0),pill:"Sang, fièvre élevée, déshydratation : consulter",
 cap:"Réhydratation, alimentation adaptée, surveillance du poids et de la diurèse ; coproculture si fièvre, sang ou retour de voyage ; précautions contact."});
lzGF("diarrhee-chronique",{t:"L'intestin absorbe mal depuis des semaines",sub:"Villosités abîmées, inflammation ou intolérance : les aliments et l'eau ne sont plus bien absorbés",zones:["grele","colon"],pt:[160,168],
 inner:()=>lzWall(186,40,124,{flat:1,seed:3})+[220,260].map(x=>lzArr(x,86,x,54,{c:LC.fluidD,w:1.6,hl:5})).join(""),zt:["Muqueuse abîmée :","malabsorption"],
 extra:()=>lzLL(196,"Plus de 4 semaines :\namaigrissement, carences",0),
 cap:"Rechercher la cause (maladie cœliaque, MICI, intolérance, médicaments, cancer). Surveiller le poids, l'état nutritionnel et les carences."});
lzGF("coeliaque",{t:"Le gluten déclenche une réaction qui détruit les villosités",sub:"Maladie cœliaque : la muqueuse de l'intestin s'aplatit et absorbe mal les nutriments",zones:["grele"],pt:[160,168],
 inner:()=>lzWall(186,40,124,{flat:1,seed:6})+lzDots(196,60,110,10,6,5,(x,y)=>lzWbc(x,y,3)),zt:["Villosités normales (à gauche)","puis atrophiées par le gluten"],
 extra:()=>lzLL(196,"Diarrhée, ballonnements,\nfatigue, anémie",0),pill:"Régime sans gluten à vie",
 cap:"Seul traitement : le **régime strict sans gluten** (blé, seigle, orge). Accompagnement diététique ; les villosités repoussent en quelques mois."});
lzGF("constipation",{t:"Les selles stagnent et durcissent dans le côlon",sub:"Plus elles restent longtemps, plus le côlon réabsorbe leur eau : elles deviennent dures et difficiles à évacuer",zones:["colon","rectum"],pt:[236,168],
 inner:()=>lzP("M186 96 L310 96","none","#C98C73",72)+lzP("M186 96 L310 96","none","#F7DCCB",62)+[[210,96,14],[240,92,12],[268,100,13],[294,94,11]].map(([x,y,r],i)=>lzStone(x,y,r,lzRnd(i+3)).replace(/#C9A05A/,"#9A6A3A")).join("")+[220,256,286].map(x=>lzArr(x,118,x,138,{c:LC.fluidD,w:1.6,hl:5})).join(""),zt:["Selles dures : l'eau est","réabsorbée"],
 extra:()=>lzLL(196,"Causes : peu d'eau, de fibres,\nd'activité ; médicaments\n(morphiniques)",0),
 cap:"Hydratation, fibres, activité physique, horaires réguliers ; laxatif prescrit avec les morphiniques. Chez la personne âgée, penser au **fécalome**."});
lzGF("fecalome",{t:"Une masse de selles dures bloque le rectum",sub:"Fréquent chez la personne âgée alitée : la masse ne peut plus être évacuée",zones:["rectum"],pt:[166,224],
 inner:()=>lzP("M248 36 L248 160","none","#C98C73",64)+lzP("M248 36 L248 160","none","#F7DCCB",54)+lzP(lzSmooth([[228,70],[268,66],[274,104],[264,140],[232,142],[222,104]]),"#7A5230","#4A3018",1.2)+lzP("M236 100 h20 M240 120 h16","none","#A07A50",1.2),zt:["Selles durcies qui","obstruent le rectum"],
 extra:()=>lzLL(196,"Fausse diarrhée, douleurs,\nconfusion, rétention urinaire",1),
 cap:"Penser au fécalome devant une **fausse diarrhée** ou une confusion chez la personne âgée. Prévention de la constipation ; évacuation sur prescription."});
lzGF("occlusion-g",{t:"Le contenu de l'intestin ne passe plus",sub:"Un obstacle (bride, tumeur, hernie) ou une paralysie : en amont, l'intestin se distend de gaz et de liquide",zones:["grele","colon"],pt:[160,168],
 inner:()=>lzP("M186 90 C214 60 238 60 252 92","none","#C98C73",46)+lzP("M186 90 C214 60 238 60 252 92","none","#F7DCCB",38)+lzP("M196 82 C214 70 230 70 242 88","none","#EAF5FC",14)+lzP("M190 100 Q216 106 246 100","none",LC.fluid,10)
  +lzP("M252 92 L262 104","none","#5A4A3A",4)+lzP("M262 104 C276 124 292 126 310 120","none","#C98C73",16)+lzP("M262 104 C276 124 292 126 310 120","none","#F7DCCB",8),zt:["En amont : anse distendue (gaz,","liquide) ; en aval : vide"],
 extra:()=>lzLL(196,"Arrêt des gaz et des selles,\nvomissements, ventre gonflé",1),pill:"Urgence chirurgicale possible",
 cap:"À jeun, sonde gastrique en aspiration, perfusion, surveillance (douleur, vomissements, diurèse, signes de choc). La cause guide le traitement."});
lzGF("sii",{t:"L'intestin est trop sensible et se contracte mal",sub:"Syndrome de l'intestin irritable : spasmes, ballonnements et transit irrégulier, sans lésion visible",zones:["colon"],pt:[236,168],
 inner:()=>lzP("M186 96 C210 70 226 120 248 96 C270 72 286 120 310 96","none","#C98C73",46)+lzP("M186 96 C210 70 226 120 248 96 C270 72 286 120 310 96","none","#F7DCCB",38)+lzDots(196,82,110,24,7,4,(x,y)=>lzC(x,y,4,"#EAF5FC","#9CC3D8",.8))+lzP("M200 140 l6 -8 l6 8 M260 140 l6 -8 l6 8","none",LC.elec,2),zt:["Spasmes, gaz et nerfs","hypersensibles"],
 extra:()=>lzLL(196,"Douleurs soulagées par\nles selles, stress\naggravant",0),
 cap:"Pas de gravité mais retentissement important. Alimentation adaptée (parfois pauvre en FODMAP), gestion du stress, antispasmodiques."});
lzGF("crohn",{t:"Une inflammation qui traverse toute la paroi de l'intestin",sub:"Maladie de Crohn : des zones atteintes en profondeur, séparées par des zones saines, de la bouche à l'anus",zones:["grele","colon"],pt:[160,168],
 inner:()=>lzWall(186,40,124,{villi:1,red:1,trans:1,seed:7}),zt:["Fissure profonde et granulomes","dans toute la paroi"],
 extra:()=>lzLL(196,"Diarrhée, douleurs, fièvre,\namaigrissement, fistules",0),pill:"Tabac : aggrave la maladie",
 cap:"Évolution par **poussées**. Traitements anti-inflammatoires et immunosuppresseurs ; surveillance nutritionnelle ; risque de fistules, d'abcès et de sténoses."});
lzGF("rch",{t:"Une inflammation superficielle qui part du rectum",sub:"Rectocolite hémorragique : la muqueuse du rectum et du côlon est atteinte de façon continue",zones:["rectum","colon"],pt:[166,224],
 inner:()=>lzWall(186,40,124,{red:1,seed:2})+lzDots(196,72,110,6,7,6,(x,y)=>lzE(x,y,5,2,"#F7EFE0","#B04A40",.8))+lzDots(196,58,110,10,6,8,(x,y)=>lzRbc(x,y,3)),zt:["Muqueuse rouge, ulcérée,","qui saigne"],
 extra:()=>lzLL(196,"Diarrhée glairo-\nsanglante, envies\nimpérieuses",0),
 cap:"Traitement par poussées et d'entretien (dérivés salicylés, corticoïdes, immunosuppresseurs). Surveillance du risque de cancer colorectal par coloscopie."});
lzGF("diverticulose",{t:"De petites poches se forment dans la paroi du côlon",sub:"Avec l'âge, la muqueuse fait hernie à travers les zones fragiles du muscle",zones:["colon"],pt:[236,168],
 inner:()=>lzWall(186,40,124,{divert:1,seed:4})+lzWall(186,40,124,{seed:4}).slice(0,0),zt:["Diverticule : poche","de muqueuse"],
 extra:()=>lzLL(196,"Le plus souvent sans\naucun symptôme",0),
 cap:"Prévention des complications : alimentation riche en fibres, hydratation, activité physique. Complications : diverticulite, saignement."});
lzGF("diverticulite",{t:"Un diverticule du côlon s'infecte",sub:"Des selles s'y coincent, la poche s'enflamme et peut former un abcès ou se perforer",zones:["colon"],pt:[236,168],
 inner:()=>lzWall(186,40,124,{divert:1,red:1,seed:5})+lzDots(232,140,30,14,6,4,lzBact),zt:["Diverticule enflammé,","rempli de pus"],
 extra:()=>lzLL(196,"Douleur en bas à gauche\ndu ventre, fièvre",1),pill:"Défense abdominale : risque de péritonite",
 cap:"Repos digestif, antibiotiques selon la gravité ; surveillance de la douleur, de la fièvre et des signes de péritonite."});
lzGF("appendicite",{t:"L'appendice s'enflamme et s'infecte",sub:"Souvent bouché par un petit amas de selles (stercolithe) : il gonfle, s'infecte et peut se rompre",zones:["appendice"],pt:[104,214],
 inner:()=>lzP("M200 60 C230 80 252 110 262 146","none","#B4574B",34)+lzP("M200 60 C230 80 252 110 262 146","none","#E9877A",26)+lzC(214,72,7,"#7A5230","#4A3018",1)+lzDots(226,92,30,40,8,5,lzBact)+lzP("M262 146 C266 150 270 150 274 146","none","#E8D27A",4),zt:["Appendice gonflé, rouge,","infecté"],
 extra:()=>lzLL(196,"Douleur en bas à droite,\nfièvre, nausées",1),pill:"Urgence chirurgicale",
 cap:"À jeun, ne pas appliquer de chaleur, pas de laxatif. Surveillance de la douleur et de la température jusqu'à l'intervention (appendicectomie)."});
lzGF("peritonite",{t:"L'infection gagne l'enveloppe des organes du ventre",sub:"Un organe se perfore (ulcère, appendice, diverticule) : bactéries et pus se répandent dans la cavité",zones:["peritoine"],pt:[244,206],
 inner:()=>lzR(186,34,124,124,0,"#F6E9C8","none")+lzP("M200 70 C230 54 262 64 270 90 C280 120 240 140 210 128 C190 118 186 88 200 70 Z","#F2B6A8",LC.mucosaD,1.4)+lzP("M262 86 l12 -6","none","#7A1F1A",3)+lzDots(196,40,110,110,22,7,lzBact)+lzDots(196,40,110,110,6,4,(x,y)=>lzWbc(x,y,3.4)),zt:["Bactéries et pus dans","la cavité abdominale"],
 extra:()=>lzLL(196,"Ventre dur « en bois »,\nfièvre, douleur intense",1),pill:"Urgence chirurgicale vitale",
 cap:"Risque de **choc septique**. À jeun, perfusion, antibiotiques, surveillance hémodynamique rapprochée jusqu'à la chirurgie."});
/* ============ Pancréas ============ */
lzGF("pancreatite-aigue",{t:"Le pancréas s'enflamme et commence à se digérer lui-même",sub:"Souvent un calcul biliaire bloque le canal ou l'alcool : les enzymes s'activent dans la glande",zones:["pancreas"],pt:[184,124],
 inner:()=>lzP("M192 110 C206 82 262 76 296 92 C312 100 308 124 290 128 C252 138 214 140 196 128 Z","#E9877A","#B4574B",1.4)+lzP("M200 112 C236 106 268 104 300 108","none","#F2D58A",4)+lzStone(208,112,6,lzRnd(4))+[232,258,282].map(x=>lzP(`M${x} 90 l3 8 l-3 4 l3 8`,"none",LC.acc,2)).join(""),zt:["Pancréas gonflé, enzymes","qui l'attaquent"],
 extra:()=>lzLL(196,"Douleur violente du\nhaut du ventre, irradiant\ndans le dos",1),pill:"À jeun, antalgie, surveillance",
 cap:"Surveillance : douleur, constantes, diurèse, glycémie, signes de choc. Mise à jeun initiale puis réalimentation progressive ; arrêt de l'alcool."});
lzGF("pancreatite-chronique",{t:"Le pancréas se détruit petit à petit",sub:"Le plus souvent l'alcool : la glande se fibrose et se calcifie, elle produit moins d'enzymes et d'insuline",zones:["pancreas"],pt:[184,124],
 inner:()=>lzP("M192 110 C206 88 262 84 296 96 C312 104 306 122 290 124 C252 132 214 134 196 124 Z","#E6CDB0","#A88A6A",1.4)+lzDots(204,96,94,26,14,5,(x,y)=>lzC(x,y,2.4,"#F7F3EA","#B9AE94",.6)),zt:["Glande fibrosée et","calcifiée"],
 extra:()=>lzLL(196,"Douleurs, diarrhée grasse,\namaigrissement, diabète",0),
 cap:"Arrêt de l'alcool et du tabac, enzymes pancréatiques aux repas, prise en charge de la douleur et du diabète."});
lzGF("cancer-pancreas",{t:"Une tumeur se développe dans le pancréas",sub:"Souvent dans la tête du pancréas : elle comprime le canal de la bile, d'où la jaunisse",zones:["pancreas"],pt:[184,124],
 inner:()=>lzP("M192 110 C206 82 262 76 296 92 C312 100 308 124 290 128 C252 138 214 140 196 128 Z","#F5D7AA","#B88A5A",1.4)+lzC(214,112,16,"#8E6A8F","#5A3D5C",1.2)+lzP("M214 36 L214 96","none","#7A9A3A",8)+lzP("M214 36 L214 96","none","#B5CF6A",5),zt:["Tumeur de la tête : le canal","de la bile est comprimé"],
 extra:()=>lzLL(196,"Jaunisse sans douleur,\namaigrissement, diabète\nrécent",0),
 cap:"Diagnostic souvent tardif. Prise en charge de la douleur, de la nutrition, du diabète ; prothèse biliaire si jaunisse ; soins de support."});
/* ============ Cancers digestifs ============ */
lzGF("cancer-colorectal",{t:"Un polype du côlon se transforme en cancer",sub:"En plusieurs années, une petite excroissance bénigne peut devenir une tumeur qui envahit la paroi",zones:["colon","rectum"],pt:[236,168],
 inner:()=>lzWall(186,40,62,{polyp:1,seed:3})+lzWall(248,40,62,{tumor:1,seed:4})+lzP("M248 40 L248 132","none","#fff",2),zt:["Polype (à gauche),","puis cancer qui envahit"],
 extra:()=>lzLL(196,"Sang dans les selles, transit\nqui change, anémie",0),pill:"Dépistage dès 50 ans : test immunologique",
 cap:"Le dépistage permet d'enlever les polypes avant qu'ils ne deviennent cancéreux (coloscopie). Après chirurgie : soins de stomie éventuels, nutrition, soutien."});
lzGF("cancer-gastrique",{t:"Une tumeur se développe dans la paroi de l'estomac",sub:"Favorisé par Helicobacter pylori, le tabac, l'alimentation salée ou fumée",zones:["estomac"],pt:[208,92],
 inner:()=>lzWall(186,40,124,{tumor:1,seed:6})+lzDots(196,54,40,10,4,3,lzHp),zt:["Tumeur qui infiltre","la paroi"],
 extra:()=>lzLL(196,"Douleurs, perte d'appétit,\namaigrissement, anémie",0),
 cap:"Chirurgie (gastrectomie), chimiothérapie. Après gastrectomie : repas fractionnés, surveillance du syndrome de chasse (dumping) et des carences (B12, fer)."});
lzGF("cancer-oesophage",{t:"Une tumeur rétrécit l'œsophage",sub:"Favorisé par l'alcool et le tabac, ou le reflux ancien : la tumeur bloque le passage des aliments",zones:["oesophage"],pt:[166,34],
 inner:()=>lzP("M248 36 L248 160","none",LC.mucosaD,40)+lzP("M248 36 L248 160","none",LC.mucosa,32)+lzP("M248 36 L248 160","none","#FFF6E8",20)+lzP("M230 80 C240 72 258 72 268 80 L268 124 C258 132 240 132 230 124 Z","#8E6A8F","#5A3D5C",1.2)+lzE(248,102,4,16,"#FFF6E8","none"),zt:["Tumeur qui rétrécit","l'œsophage"],
 extra:()=>lzLL(196,"Difficulté pour avaler,\nd'abord les solides",1),
 cap:"Dénutrition fréquente : alimentation adaptée, parfois nutrition entérale (sonde, gastrostomie). Traitements : chirurgie, radio-chimiothérapie."});
/* ============ Anus et rectum ============ */
const lzAnal=(ex)=>lzR(186,34,124,124,0,"#F6D3BB","none")+lzP("M218 34 L218 158 M278 34 L278 158","none",LC.muscleD,18)+lzP("M218 34 L218 158 M278 34 L278 158","none",LC.muscle,12)+lzR(228,34,40,124,0,"#F2A79D","none")+lzR(236,34,24,124,0,"#FFF6E8","none")+(ex||"");
lzGF("hemorroides",{t:"Les veines de l'anus se dilatent",sub:"Les coussinets veineux du canal anal gonflent, saignent ou sortent (prolapsus)",zones:["rectum"],pt:[166,224],
 inner:()=>lzAnal(lzC(232,76,8,"#7A4A8A","#4A2A5A",1)+lzC(264,92,8,"#7A4A8A","#4A2A5A",1)+lzC(246,150,10,"#8A5A9A","#4A2A5A",1)),zt:["Veines dilatées","(internes et externes)"],
 extra:()=>lzLL(196,"Sang rouge sur le papier,\ndouleurs, gêne",0),
 cap:"Régulariser le transit (fibres, eau), éviter les efforts de poussée ; traitements locaux, parfois ligature ou chirurgie."});
lzGF("fissure-anale",{t:"Une petite déchirure de la peau du canal anal",sub:"Souvent après une selle dure : la fissure fait contracter le sphincter, ce qui entretient la douleur",zones:["rectum"],pt:[166,224],
 inner:()=>lzAnal(lzP("M238 120 L246 140 L240 150","none",LC.acc,3)+lzP("M218 110 L218 150 M278 110 L278 150","none",LC.acc,4,";opacity:.6")),zt:["Déchirure + sphincter","contracté"],
 extra:()=>lzLL(196,"Douleur intense pendant\net après les selles",0),
 cap:"Ramollir les selles (fibres, eau, laxatifs doux), bains de siège, antalgiques, traitement local qui relâche le sphincter."});
lzGF("fistule-anale",{t:"Un petit tunnel relie le canal anal à la peau",sub:"Souvent après un abcès d'une glande anale : du pus s'écoule près de l'anus",zones:["rectum"],pt:[166,224],
 inner:()=>lzAnal(lzP("M236 96 C210 104 200 130 196 152","none","#E8D27A",5)+lzP("M236 96 C210 104 200 130 196 152","none","#A8902A",1,";stroke-dasharray:2 2")+lzC(196,152,4,"#E8D27A","#A8902A",1)),zt:["Trajet entre le canal","anal et la peau"],
 extra:()=>lzLL(196,"Écoulement de pus,\ndouleur, abcès répétés",0),
 cap:"Traitement chirurgical. Penser à la maladie de Crohn devant des fistules multiples ou récidivantes."});
/* ============ Hémorragies digestives ============ */
lzGF("hdh",{t:"Un saignement dans l'œsophage, l'estomac ou le duodénum",sub:"Ulcère qui saigne ou varices de l'œsophage (cirrhose) : le sang est vomi ou noircit les selles",zones:["estomac","oesophage"],pt:[208,92],
 inner:()=>lzWall(186,40,124,{ulcer:1,seed:5})+lzP("M240 76 C236 60 252 52 260 64 C262 70 256 76 250 76 Z",LC.blood,LC.bloodD,1)+lzRbcs(200,46,100,26,10,4,3.4),zt:["Ulcère qui saigne dans","l'estomac"],
 extra:()=>lzLL(196,"Vomissement de sang\n(hématémèse), selles\nnoires (méléna)",1),pill:"Pâleur, tachycardie, malaise : urgence",
 cap:"Deux voies veineuses, bilan sanguin, groupe, à jeun, surveillance TA/FC rapprochée ; endoscopie en urgence. IPP ou traitement des varices selon la cause."});
lzGF("hdb",{t:"Un saignement dans le côlon ou le rectum",sub:"Diverticule, tumeur, hémorroïdes, MICI : du sang rouge passe dans les selles",zones:["colon","rectum"],pt:[236,168],
 inner:()=>lzWall(186,40,124,{divert:1,seed:3})+lzRbcs(196,44,110,26,12,6,3.4),zt:["Diverticule qui saigne","dans le côlon"],
 extra:()=>lzLL(196,"Sang rouge dans\nles selles (rectorragie)",1),pill:"Quantifier, surveiller TA et FC",
 cap:"Évaluer l'abondance et la tolérance (pouls, tension, pâleur). Coloscopie pour trouver la cause ; transfusion si besoin."});
/* ============ Foie et voies biliaires ============ */
const lzLobule=(o={})=>lzR(186,34,124,124,0,o.bg||"#E8B9A9","none")+lzDots(190,38,116,116,34,o.seed||4,(x,y,R)=>lzP(lzSmooth([[x-6,y-4],[x+5,y-6],[x+7,y+3],[x-1,y+7],[x-7,y+3]]),o.cell||"#D9907E","#A65A4A",.6)+(o.fat&&R()<.7?lzC(x+1,y,3.4,LC.fat,LC.fatD,.5):"")+(o.virus&&R()<.3?lzVirus(x,y,2.6):"")+(o.inflam&&R()<.25?lzWbc(x,y,2.8):""))+(o.ex||"");
lzGF("cirrhose-g",{t:"Le foie se transforme en cicatrices et en nodules",sub:"Alcool, hépatites virales, stéatose : le foie durcit, fonctionne mal et le sang passe difficilement",zones:["foie"],pt:[108,80],
 inner:()=>lzR(186,34,124,124,0,"#C9A486","none")+lzDots(190,38,116,116,14,7,(x,y)=>lzC(x,y,10,"#B86E4E","#7A3A26",1))+lzP("M186 70 Q248 60 310 74 M186 120 Q248 112 310 126 M220 34 Q230 96 214 158 M276 34 Q268 96 284 158","none","#EDE0CF",3),zt:["Nodules entourés de","cicatrices (fibrose)"],
 extra:()=>lzLL(196,"Complications : ascite,\nvarices de l'œsophage,\njaunisse, encéphalopathie",1),pill:"Arrêt complet de l'alcool",
 cap:"Surveiller le poids et le périmètre abdominal (ascite), la conscience (encéphalopathie), les saignements. Dépistage du cancer du foie tous les 6 mois."});
lzGF("hepatite-a",{t:"Un virus infecte les cellules du foie (hépatite A)",sub:"Transmis par l'eau ou les aliments souillés : hépatite aiguë qui guérit le plus souvent",zones:["foie"],pt:[108,80],
 inner:()=>lzLobule({virus:1,inflam:1,seed:3}),zt:["Virus et inflammation","dans le foie"],extra:()=>lzLL(196,"Fatigue, jaunisse, nausées ;\nne devient pas chronique",0),pill:"Vaccin et hygiène des mains",
 cap:"Transmission féco-orale : hygiène des mains, de l'eau et des aliments. Repos, pas d'alcool ni de médicaments toxiques pour le foie."});
lzGF("hepatite-b",{t:"Un virus infecte le foie et peut y rester (hépatite B)",sub:"Transmis par le sang, les relations sexuelles et de la mère à l'enfant : risque de cirrhose et de cancer",zones:["foie"],pt:[108,80],
 inner:()=>lzLobule({virus:1,inflam:1,seed:6}),zt:["Virus B dans les cellules","du foie"],extra:()=>lzLL(196,"Souvent sans symptôme ;\npeut devenir chronique",0),pill:"Vaccination : soignants obligatoire",
 cap:"Prévention : **vaccination**, préservatif, matériel à usage unique ; conduite à tenir après accident d'exposition au sang. Traitement antiviral des formes chroniques."});
lzGF("hepatite-c",{t:"Un virus infecte le foie de façon souvent silencieuse (hépatite C)",sub:"Transmis par le sang : il évolue souvent vers une hépatite chronique, puis une cirrhose",zones:["foie"],pt:[108,80],
 inner:()=>lzLobule({virus:1,inflam:1,seed:9,ex:lzP("M186 80 Q248 70 310 84","none","#EDE0CF",3)}),zt:["Virus C et début","de fibrose"],extra:()=>lzLL(196,"Pas de vaccin, mais un\ntraitement qui guérit",0),pill:"Dépistage : test sanguin",
 cap:"Transmission par le sang (matériel d'injection, tatouage, transfusion ancienne). Les antiviraux actuels guérissent la grande majorité des patients en quelques semaines."});
lzGF("steatose",{t:"La graisse s'accumule dans les cellules du foie",sub:"Surpoids, diabète, alcool : le foie devient « gras », puis peut s'enflammer et se fibroser",zones:["foie"],pt:[108,80],
 inner:()=>lzLobule({fat:1,seed:5,bg:"#EFD3B0",cell:"#E0A98E"}),zt:["Gouttelettes de graisse","dans les cellules"],extra:()=>lzLL(196,"Silencieuse longtemps ;\nréversible au début",0),
 cap:"Perte de poids progressive, activité physique, équilibre du diabète, arrêt de l'alcool : la stéatose peut régresser."});
lzGF("insuffisance-hepatique",{t:"Le foie ne remplit plus ses fonctions",sub:"Il ne fabrique plus assez de facteurs de coagulation, d'albumine, et ne détoxifie plus le sang",zones:["foie"],pt:[108,80],
 inner:()=>lzLobule({seed:8,bg:"#D9C2A8",cell:"#C9A08E",ex:lzDots(190,38,116,116,10,3,(x,y)=>lzC(x,y,4,"#BFB2A8","none",0,";opacity:.8"))}),zt:["Cellules du foie détruites","ou épuisées"],
 extra:()=>lzLL(196,"Jaunisse, saignements,\nœdèmes, confusion",1),pill:"Surveiller conscience et coagulation",
 cap:"Risques : hémorragies, infections, encéphalopathie, insuffisance rénale. Surveillance rapprochée ; la greffe de foie est parfois la seule solution."});
lz("encephalopathie-hep",{t:"Les toxines non éliminées par le foie atteignent le cerveau",sub:"L'ammoniac et d'autres déchets s'accumulent dans le sang et perturbent le fonctionnement du cerveau",h:246,ins:false,
 draw:()=>lzOrg("digestif",["foie"],-30,60,.55)+lzOrg("cerveau",[],168,4,.42)+lzQ(80,96,140,40,210,48,{c:LC.acc,w:2.4,dash:"5 4"})+lzS(150,40,"NH₃ (ammoniac)","middle","st-acc")
  +lzLR(130,"Confusion, somnolence,\ntremblement des mains\n(astérixis), coma",1,232,72)+lzLL(232,"Foie défaillant",0,46,104),
 cap:"Déclenchée par une hémorragie digestive, une infection, une constipation, certains médicaments. Traitement : lactulose (évacuer les toxines), traitement de la cause."});
const lzGall=(o={})=>lzP("M214 64 C206 96 220 136 250 140 C282 142 294 108 282 80 C272 60 240 46 214 64 Z",o.red?"#9FC07A":"#B5CF6A","#5E8240",1.6)+(o.wall?lzP("M214 64 C206 96 220 136 250 140 C282 142 294 108 282 80 C272 60 240 46 214 64 Z","none",LC.acc,3,";opacity:.6"):"")
 +lzP("M218 60 C210 46 216 36 230 36 L300 36","none","#7A9A3A",8)+lzP("M218 60 C210 46 216 36 230 36 L300 36","none","#B5CF6A",5)+(o.ex||"");
lzGF("lithiase-biliaire",{t:"Des calculs se forment dans la vésicule biliaire",sub:"La bile trop concentrée cristallise : les calculs peuvent bloquer l'évacuation de la bile",zones:["vesicule"],pt:[132,106],
 inner:()=>lzGall({ex:[[234,110,9],[256,118,8],[262,94,7],[242,90,6]].map(([x,y,r],i)=>lzStone(x,y,r,lzRnd(i+2))).join("")}),zt:["Calculs dans la vésicule"],
 extra:()=>lzLL(196,"Colique hépatique : douleur\nsous les côtes à droite\naprès un repas gras",0),
 cap:"Souvent sans symptôme. En cas de coliques répétées : ablation de la vésicule (cholécystectomie). Complications : cholécystite, angiocholite, pancréatite."});
lzGF("cholecystite",{t:"La vésicule biliaire bouchée par un calcul s'infecte",sub:"Le calcul bloque la sortie : la vésicule se distend, s'enflamme et s'infecte",zones:["vesicule"],pt:[132,106],
 inner:()=>lzGall({red:1,wall:1,ex:lzStone(220,62,8,lzRnd(3))+lzDots(226,86,50,40,10,4,lzBact)}),zt:["Calcul coincé + vésicule","enflammée et infectée"],
 extra:()=>lzLL(196,"Douleur à droite qui dure,\nfièvre",1),pill:"Antibiotiques puis chirurgie",
 cap:"À jeun, antalgiques, antibiotiques, surveillance de la douleur et de la fièvre ; cholécystectomie le plus souvent rapide."});
lzGF("angiocholite",{t:"Le canal de la bile est bouché et infecté",sub:"Un calcul bloque le canal cholédoque : la bile stagne, s'infecte, et l'infection passe dans le sang",zones:["vesicule","foie"],pt:[132,106],
 inner:()=>lzGall({ex:lzP("M250 36 L250 160","none","#7A9A3A",14)+lzP("M250 36 L250 160","none","#B5CF6A",10)+lzStone(250,118,8,lzRnd(5))+lzDots(242,50,16,60,8,6,lzBact)}),zt:["Calcul dans le cholédoque,","bile infectée"],
 extra:()=>lzLL(196,"Douleur, puis fièvre et\nfrissons, puis jaunisse\n(triade de Charcot)",1),pill:"Risque de choc septique : urgence",
 cap:"Hémocultures, antibiotiques, surveillance hémodynamique ; drainage de la bile en urgence (endoscopie)."});
lz("ictere",{t:"La bilirubine s'accumule dans le sang et colore la peau en jaune",sub:"Le foie ne l'élimine plus (hépatite, cirrhose) ou la bile ne s'écoule plus (calcul, tumeur)",h:246,ins:false,
 draw:()=>lzOrg("digestif",["foie","vesicule"],-26,30,.6)+lzBody(250,40,1.05,{skin:"#F2DC8A"})+lzQ(110,90,170,40,218,74,{c:"#B98A14",w:2.4,dash:"5 4"})+lzS(168,44,"bilirubine","middle","st-amber")
  +lzLR(214,"Peau et yeux jaunes,\nurines foncées, selles\ndécolorées, démangeaisons",1),
 cap:"Rechercher la cause (bilan sanguin, échographie). Soins de peau (démangeaisons), surveillance de la coagulation ; urines foncées et selles décolorées orientent vers un obstacle."});
lz("ascite",{t:"Du liquide s'accumule dans le ventre",sub:"Souvent la cirrhose : la pression dans les veines du foie monte et l'albumine manque, l'eau sort dans la cavité",h:246,ins:false,
 draw:()=>`<g><path d="M56 40 C30 100 30 190 80 226 L240 226 C290 190 290 100 264 40 Z" style="fill:${LC.fluid};opacity:.55;stroke:${LC.fluidD};stroke-width:1.4"/></g>`+lzOrg("digestif",["peritoine"],44,36,.72)
  +lzLR(120,"Liquide dans la\ncavité abdominale",1,250,150)+lzLL(232,"Ventre gonflé, prise\nde poids, essoufflement",0),
 cap:"Surveiller **poids et périmètre abdominal** chaque jour, régime pauvre en sel, diurétiques ; ponction d'ascite si gêne (surveiller tension et pansement après)."});
LZ["malabsorption"]=Object.assign({},LZ["diarrhee-chronique"],{t:"L'intestin n'absorbe plus bien les nutriments",sub:"Villosités abîmées, manque d'enzymes ou de bile : graisses, vitamines et minéraux passent dans les selles",
 cap:"Signes : diarrhée graisseuse, amaigrissement, carences (fer, vitamines B12, D, folates). Rechercher la cause ; compléments et suivi diététique."});
