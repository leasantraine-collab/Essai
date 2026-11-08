/* Carnet IFSI — schémas des lésions : rhumatologie, orthopédie, infections des os et des articulations (32 pathologies). */
const lzMpS=(x,y)=>[lzN(-8+x*.62),lzN(14+y*.62)];
const lzSF=(id,o)=>lzZF(id,Object.assign({left:()=>lzOrg("squelette",o.zones||[],-8,14,.62),pt:lzMpS(...(o.spt||[178,198])),bg:"#FBF3EC"},o));
/* ---------- articulation dans la loupe ----------
   o : worn (arthrose), pannus (polyarthrite), pus (arthrite septique), crystals, ero (érosions), fluid (épanchement), red (inflammation) */
function lzJoint(o={}){const up="M216 78 Q216 98 248 98 Q280 98 280 78",lo=`M216 ${o.worn?90:94} Q216 ${o.worn?108:114} 248 ${o.worn?108:114} Q280 ${o.worn?108:114} 280 ${o.worn?90:94}`;
 let s=lzE(248,106,o.fluid?52:44,o.fluid?28:20,o.pus?"#EFD98A":o.fluid?"#C9E2F0":"#DCEBF3","none");
 s+=lzP("M216 60 C194 80 194 130 216 146 M280 60 C302 80 302 130 280 146","none",o.red||o.pus?"#E07A6C":"#D9B7A8",4)
  +lzP("M217 68 C202 86 202 124 217 136 M279 68 C294 86 294 124 279 136","none",o.pannus?"#C8372D":"#F2A79D",o.pannus?7:2,o.pannus?";stroke-dasharray:3 2":"");
 s+=lzP(up+" V34 H216 Z","url(#rg-bone)","#C9B88E",1)+lzP(`M216 158 V${o.worn?90:94} Q216 ${o.worn?108:114} 248 ${o.worn?108:114} Q280 ${o.worn?108:114} 280 ${o.worn?90:94} V158 Z`,"url(#rg-bone)","#C9B88E",1);
 const cart=(d,dy)=>lzP(d.replace(/(\d+) (\d+)/g,(m,a,b)=>`${a} ${+b+dy}`),"none","#CFE6EE",o.worn?1.6:6);
 s+=cart(up,-3)+cart(lo,3);
 if(o.worn)s+=lzP("M240 94 l3 4 l3 -4 M256 96 l2 4","none","#7FAEC0",1)+lzP("M216 76 l-10 6 l10 2 M280 76 l10 6 l-10 2 M216 92 l-9 -4 l9 8 M280 92 l9 -4 l-9 8","url(#rg-bone)","#C9B88E",1)+lzP("M222 90 Q248 100 274 90","none","rgba(150,120,60,.5)",3);
 if(o.ero)s+=[[216,84],[280,84],[216,104],[280,104]].map(([a,b])=>lzC(a,b,5,o.pannus?"#C8372D":"#F6EDE0","none")).join("");
 if(o.pannus)s+=lzDots(204,92,88,26,6,5,(x,y)=>lzWbc(x,y,3.2));
 if(o.pus)s+=lzDots(206,94,84,22,8,4,(x,y)=>lzWbc(x,y,3.4))+lzDots(206,94,84,22,12,7,lzCoc);
 if(o.crystals)s+=lzDots(210,96,76,18,14,3,(x,y,R)=>lzP(`M${lzN(x)} ${lzN(y)} l${lzN(5+R()*3)} ${lzN(-2-R()*3)}`,"none","#FFFFFF",2));
 return s+(o.ex||"");}
/* ---------- rachis en profil dans la loupe (avant à gauche, arrière à droite) ----------
   o : hernia, worn (disque usé), wedge (tassement), infect (spondylodiscite), spasm (muscles contractés), bridge (syndesmophytes), cerv (cervical) */
function lzSpine(o={}){let s=lzR(186,34,124,124,0,o.bg||"#FBF3EC","none");
 const body=(y,h,wedge)=>wedge?lzP(`M198 ${y+14} L250 ${y} L250 ${y+h} L198 ${y+h} Z`,"url(#rg-bone)","#C9B88E",1)+lzP(`M206 ${y+20} l12 6 l-4 6 M230 ${y+10} l6 10`,"none","#8E6A3E",1.2):lzR(198,y,52,h,7,"url(#rg-bone)","#C9B88E",1);
 if(o.spasm)s+=lzP("M290 34 C300 60 300 130 290 158 L310 158 L310 34 Z","#D9584C","#8E2A22",1)+lzP("M296 50 l8 0 M296 70 l8 0 M296 90 l8 0 M296 110 l8 0 M296 130 l8 0","none","#8E2A22",1.4);
 s+=lzR(258,34,18,124,4,"#F6E7AE","#C9A31F",1)+lzP("M262 40 V152 M267 40 V152 M272 40 V152","none","#E0C35A",1);
 s+=[[40,"spin"],[106,"spin"]].map(([y])=>lzP(`M276 ${y+4} L290 ${y} L306 ${y+16} L298 ${y+28} L276 ${y+24} Z`,"url(#rg-bone)","#C9B88E",1)).join("");
 s+=body(34,44,o.wedge)+body(108,44);
 const dc=o.infect?"#E8C9B4":o.worn?"#9DB3BF":"#BFD8E4";
 s+=lzR(200,80,48,26,9,dc,o.infect?"#C8372D":"#6F97AB",1.2)+(o.worn||o.infect?"":lzE(226,93,12,7,"#EEF6FA","#9CC0D2",1));
 const root=o.hernia?"#E05A4C":"#E8C34C";
 s+=lzP("M270 96 C284 98 292 108 304 124","none",root,o.hernia?5:4)+lzP("M270 96 C284 98 292 108 304 124","none","#FFF3C8",1.4);
 if(o.hernia)s+=lzP("M236 86 C254 84 266 90 268 98 C266 104 254 106 240 102 Z","#EEF6FA","#6F97AB",1.2)+lzC(268,96,9,"none",LC.acc,1.6,";stroke-dasharray:3 2");
 if(o.infect)s+=lzDots(204,82,40,22,10,5,lzCoc)+lzDots(204,80,40,26,4,3,(x,y)=>lzWbc(x,y,3))+lzP("M200 80 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4 l6 -4 M200 106 l6 4 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4","none","#C8372D",1.2);
 if(o.bridge)s+=lzP("M200 74 C192 84 192 102 200 112","none","url(#rg-bone)",6)+lzP("M200 74 C192 84 192 102 200 112","none","#C9B88E",1);
 return s;}
/* ---------- os long et fracture dans la loupe ---------- */
const lzFracBone=(o={})=>lzR(186,34,124,124,0,"#F6E3DA","none")+(o.hem?lzE(o.hx||250,o.hy||96,40,26,"rgba(180,40,30,.35)","none"):"")
 +lzP(o.a||"M200 46 L238 84 L230 94 L192 56 Z","url(#rg-bone)","#C9B88E",1)+lzP(o.b||"M244 92 L302 150 L294 158 L236 100 Z","url(#rg-bone)","#C9B88E",1)
 +lzP(o.line||"M236 86 l6 4 l-4 6 l8 2","none","#5E3B2A",1.6);
/* ============ Articulations ============ */
lzSF("arthrose",{t:"Le cartilage s'use et l'os réagit",sub:"Arthrose : le cartilage s'amincit et se fissure, l'os se densifie et forme des becs (ostéophytes)",zones:["genou","hanche","mains"],spt:[178,198],
 inner:()=>lzJoint({worn:1}),zt:["Cartilage aminci, os qui","forme des ostéophytes"],
 extra:()=>lzLL(200,"Douleur mécanique : à l'effort,\ncalmée par le repos",1)+lzLL(232,"Raideur courte le matin\n(< 15 min)",0),pill:"Bouger, perdre du poids, adapter l'effort",
 cap:"Activité physique adaptée, perte de poids, kinésithérapie, antalgiques, infiltrations ; prothèse si la douleur et le handicap deviennent importants. Distinguer d'une douleur inflammatoire."});
lzSF("pr",{t:"La membrane de l'articulation s'enflamme et ronge l'os",sub:"Polyarthrite rhumatoïde : maladie auto-immune ; la synoviale épaissie (pannus) détruit cartilage et os",zones:["mains","poignet","pied"],spt:[220,168],
 inner:()=>lzJoint({pannus:1,ero:1,fluid:1}),zt:["Pannus (rouge) qui ronge","cartilage et os"],
 extra:()=>lzLL(200,"Petites articulations des mains\net des poignets, symétrique",1)+lzLL(232,"Raideur matinale > 30 min,\ngonflement, fatigue",0),pill:"Traitement de fond précoce (méthotrexate)",
 cap:"Méthotrexate (surveillance NFS et transaminases, contraception, acide folique), biothérapies (risque infectieux), corticoïdes à petite dose ; préserver la fonction : ergothérapie, orthèses."});
lzSF("rhumatisme-psoriasique",{t:"Le psoriasis touche aussi les articulations",sub:"Rhumatisme psoriasique : inflammation des articulations et des points d'attache des tendons",zones:["mains","pied"],spt:[220,168],
 inner:()=>lzJoint({pannus:1,fluid:1,ex:lzP("M216 46 C204 50 196 56 192 62","none","#C8372D",5)}),zt:["Synovite et inflammation","des attaches tendineuses"],
 extra:()=>lzLL(200,"Doigt ou orteil « en saucisse »,\natteinte des ongles",1)+lzLL(232,"Psoriasis cutané souvent connu",0),pill:"Rechercher les plaques de psoriasis",
 cap:"Anti-inflammatoires, méthotrexate, biothérapies ; soins de la peau ; activité physique ; surveiller les infections sous traitement immunosuppresseur."});
lzSF("arthrite-septique",{t:"Des bactéries infectent l'articulation",sub:"Arthrite septique : le germe arrive par le sang, une plaie ou une infiltration ; urgence, le cartilage se détruit vite",zones:["genou"],spt:[178,198],
 inner:()=>lzJoint({pus:1,fluid:1,red:1}),zt:["Liquide trouble : pus,","bactéries, globules blancs"],
 extra:()=>lzLL(200,"Articulation rouge, chaude,\ntrès douloureuse, fièvre",1)+lzLL(232,"Ponction articulaire avant\nles antibiotiques",0),pill:"Urgence : ponction, antibiotiques, lavage",
 cap:"Ponction (examen bactériologique), hémocultures, antibiotiques intraveineux, lavage chirurgical, immobilisation antalgique puis rééducation ; risque de destruction articulaire."});
lzSF("bursite",{t:"La petite poche de glissement s'enflamme",sub:"Bursite : la bourse séreuse (genou, coude, épaule) se remplit de liquide après frottements, choc ou infection",zones:["genou","epaule"],spt:[178,198],
 inner:()=>lzJoint({ex:lzE(214,60,22,16,"#C9E2F0","#E07A6C",2.4)+lzP("M190 40 C200 52 210 60 236 76","none","#F4F1E8",6)+lzP("M190 40 C200 52 210 60 236 76","none","#D8CDB8",1)}),zt:["Bourse séreuse gonflée","de liquide"],
 extra:()=>lzLL(200,"Gonflement mou, localisé\n(genou de carreleur, coude)",1)+lzLL(232,"Rouge et chaud : penser\nà une infection",0),pill:"Repos, glace, protéger des appuis",
 cap:"Éviter l'appui ou le frottement, glace, anti-inflammatoires ; ponction si volumineuse ; antibiotiques si bursite infectée (fièvre, rougeur)."});
lzSF("tendinite",{t:"Le tendon s'enflamme à force d'être sollicité",sub:"Tendinite (tendinopathie) : gestes répétés, effort inhabituel ou âge ; douleur à l'étirement et à la contraction",zones:["epaule","poignet"],spt:[122,54],
 inner:()=>lzR(186,34,124,124,0,"#F6DCD6","none")+lzP("M186 74 C220 70 250 72 270 84 L310 104 L310 116 L266 98 C246 88 218 86 186 90 Z","#F4F1E8","#B9A58A",1.2)+lzP("M186 78 h80 M186 84 h80","none","#D8CDB8",1)
  +lzE(236,82,26,12,"rgba(232,80,60,.35)","#C8372D",1.4)+lzR(186,110,124,48,0,"url(#rg-bone)","none")+lzP("M186 110 H310","none","#C9B88E",1.2)+lzP("M186 50 C230 44 270 52 310 60","none","#C9675A",16),
 zt:["Tendon épaissi","et enflammé"],
 extra:()=>lzLL(200,"Douleur au mouvement contrarié,\nau toucher",1)+lzLL(232,"Épaule, coude, poignet,\ntendon d'Achille",0),pill:"Repos relatif, glace, puis rééducation",
 cap:"Mettre le tendon au repos sans immobiliser complètement, glace, antalgiques, kinésithérapie (étirements, renforcement) ; adapter le poste de travail ; attention aux fluoroquinolones (tendon d'Achille)."});
lzSF("capsulite",{t:"La capsule de l'épaule s'épaissit et se rétracte",sub:"Capsulite rétractile : l'épaule devient raide et douloureuse ; évolue sur 12 à 24 mois",zones:["epaule"],spt:[122,54],
 inner:()=>lzR(186,34,124,124,0,"#FBF3EC","none")+lzC(252,100,34,"url(#rg-bone)","#C9B88E",1)+lzP("M262 158 V120","none","url(#rg-bone)",30)+lzP("M210 60 C196 80 196 120 214 140","none","url(#rg-bone)",14)
  +lzC(252,100,42,"none","#C8372D",6)+lzC(252,100,42,"none","#E9B7A8",2)+lzArr(300,62,284,76,{c:LC.acc,w:1.6})+lzArr(300,140,284,126,{c:LC.acc,w:1.6}),
 zt:["Capsule épaisse qui","serre la tête de l'humérus"],
 extra:()=>lzLL(200,"Raideur dans tous les sens,\ndouleur nocturne",1)+lzLL(232,"Après un traumatisme, chez\nle diabétique, sans cause",0),pill:"Rééducation douce et régulière",
 cap:"Antalgiques, infiltrations, kinésithérapie douce et progressive (sans forcer en phase douloureuse) ; récupération lente ; rassurer sur l'évolution."});
lzSF("canal-carpien",{t:"Le nerf médian est comprimé au poignet",sub:"Syndrome du canal carpien : le nerf passe sous un ligament avec les tendons ; le moindre gonflement l'écrase",zones:["poignet","mains"],spt:[100,142],
 inner:()=>lzR(186,34,124,124,0,"#F6DCD6","none")+lzP("M196 132 C210 96 286 96 300 132 Z","url(#rg-bone)","#C9B88E",1)+[[214,122],[236,112],[260,112],[282,122]].map(([a,b])=>lzC(a,b,9,"url(#rg-bone)","#C9B88E",1)).join("")
  +lzP("M200 76 C230 66 266 66 296 76","none","#C9B88E",7)+lzP("M200 76 C230 66 266 66 296 76","none","#F4F1E8",4)
  +[[222,92],[240,96],[258,96],[276,92],[232,104],[266,104]].map(([a,b])=>lzC(a,b,6,"#F4F1E8","#B9A58A",1)).join("")+lzE(248,82,14,4.6,"#F2D46E","#C8372D",1.6),
 zt:["Nerf médian (jaune) aplati","sous le ligament"],
 extra:()=>lzLL(200,"Fourmillements du pouce à l'annulaire,\nla nuit surtout",1)+lzLL(232,"Grossesse, diabète, gestes\nrépétés, hypothyroïdie",0),pill:"Attelle de nuit ; chirurgie si déficit",
 cap:"Attelle de repos nocturne, infiltration, chirurgie (section du ligament) si gêne importante ou perte de force ; après l'opération, surveiller pansement, œdème, mobilité des doigts."});
lzSF("algodystrophie",{t:"Le système nerveux s'emballe après un traumatisme",sub:"Algodystrophie (syndrome douloureux régional complexe) : douleur, gonflement, peau et os perturbés",zones:["poignet","pied"],spt:[100,142],
 inner:()=>lzR(186,34,124,124,0,"#F3C9C0","none")+lzTrabL(196,92,104,60)+lzR(186,34,124,40,0,"rgba(232,80,60,.35)","none")+lzDots(196,40,104,30,14,5,(x,y)=>lzC(x,y,1.8,"#BFE0F4","#7FB2D3",.5))+lzP("M190 60 C220 40 240 80 270 54 S300 70 310 50","none","#E8C34C",3)+lzP("M190 60 C220 40 240 80 270 54 S300 70 310 50","none",LC.acc,1,";stroke-dasharray:3 3"),
 zt:["Peau gonflée, rouge ou froide,","os qui se déminéralise"],
 extra:()=>lzLL(200,"Douleur disproportionnée,\ntrès sensible au toucher",1)+lzLL(232,"Après fracture, plâtre,\nchirurgie de la main ou du pied",0),pill:"Bouger tôt, sans forcer la douleur",
 cap:"Antalgiques, kinésithérapie douce, balnéothérapie, mobilisation précoce après un plâtre ; évolution longue mais souvent favorable ; soutien psychologique."});
const lzTrabL=(x,y,w,h)=>lzR(x,y,w,h,6,"#F6EFE6","#C9B88E",1)+lzDots(x+6,y+6,w-12,h-12,14,4,(a,b,R)=>lzP(`M${lzN(a)} ${lzN(b)} l${lzN(6+R()*8)} ${lzN(-3+R()*6)}`,"none","#E3D2B4",2));
lzSF("osteonecrose",{t:"Une partie de l'os meurt faute de sang",sub:"Ostéonécrose de la tête fémorale : corticoïdes, alcool, drépanocytose, fracture ; la tête finit par s'effondrer",zones:["hanche"],spt:[136,160],
 inner:()=>lzR(186,34,124,124,0,"#FBF3EC","none")+lzC(232,78,34,"url(#rg-bone)","#C9B88E",1)+lzP("M244 104 L290 158 L250 158 L222 112 Z","url(#rg-bone)","#C9B88E",1)+lzP("M210 62 C220 48 244 46 256 58 C248 74 226 78 210 62 Z","#C9B9A2","#8E7A5E",1)+lzP("M210 62 C220 48 244 46 256 58","none","#5E3B2A",1.4,";stroke-dasharray:3 2")+lzP("M232 112 l8 -10","none",LC.acc,2),
 zt:["Zone morte au sommet","de la tête du fémur"],
 extra:()=>lzLL(200,"Douleur de l'aine à la marche,\nboiterie",1)+lzLL(232,"IRM pour le diagnostic précoce",0),pill:"Décharge (cannes) au début ; prothèse si effondrement",
 cap:"Mise en décharge, antalgiques, arrêt des facteurs (alcool, corticoïdes si possible) ; prothèse totale de hanche si la tête s'est effondrée."});
/* ============ Os : fractures et infections ============ */
lzSF("fracture-col",{t:"Le col du fémur casse, souvent après une chute",sub:"Fracture du col du fémur : personne âgée, ostéoporose ; jambe raccourcie et tournée en dehors",zones:["hanche"],spt:[136,160],
 inner:()=>lzR(186,34,124,124,0,"#F6E3DA","none")+lzE(254,108,32,20,"rgba(180,40,30,.3)","none")+lzC(220,70,26,"url(#rg-bone)","#C9B88E",1)+lzP("M238 84 C246 90 252 96 256 104 L244 112 C236 102 230 96 226 92 Z","url(#rg-bone)","#C9B88E",1)
  +lzP("M262 104 L300 158 L262 158 L248 120 Z","url(#rg-bone)","#C9B88E",1)+lzP("M244 96 l6 6 l-4 4 l8 6","none","#5E3B2A",2)+lzP("M190 46 C200 36 220 34 236 40","none","#D9B7A8",4),
 zt:["Trait de fracture","sur le col"],
 extra:()=>lzLL(200,"Impossible de se relever,\njambe raccourcie, en rotation",1)+lzLL(232,"Chirurgie rapide : vis\nou prothèse",0),pill:"Lever tôt ; prévenir escarre, phlébite, confusion",
 cap:"Antalgie, chirurgie dans les 48 h, lever précoce, anticoagulant préventif, prévention des escarres, de la confusion et de la dénutrition ; rééducation ; prévention des chutes et de l'ostéoporose."});
lzSF("fractures-vertebrales",{t:"La vertèbre s'écrase sur elle-même",sub:"Fracture-tassement vertébrale : ostéoporose le plus souvent, parfois traumatisme ou métastase",zones:["rachis"],spt:[160,88],
 inner:()=>lzSpine({wedge:1}),zt:["Corps vertébral tassé","en coin vers l'avant"],
 extra:()=>lzLL(200,"Douleur brutale du dos,\nperte de taille, dos voûté",1)+lzLL(232,"Rechercher un déficit\nneurologique (traumatisme)",0),pill:"Antalgie, corset si besoin, traiter l'ostéoporose",
 cap:"Repos antalgique court, corset selon prescription, lever progressif, kinésithérapie ; traitement de l'ostéoporose ; en traumatologie : immobilisation stricte jusqu'au bilan."});
lzSF("fracture-poignet",{t:"L'extrémité du radius casse en tombant sur la main",sub:"Fracture du poignet (Pouteau-Colles) : chute main en avant, ostéoporose ; déformation « en dos de fourchette »",zones:["poignet","mains"],spt:[100,142],
 inner:()=>lzFracBone({hem:1,a:"M186 70 L262 70 L262 96 L186 96 Z",b:"M268 64 L310 58 L310 86 L270 92 Z",line:"M262 68 l4 6 l-3 6 l5 6 l-3 8",hx:262,hy:82})+lzP("M186 110 H300","none","url(#rg-bone)",18)+lzS(200,140,"cubitus","start")+lzS(200,62,"radius","start"),
 zt:["Radius cassé, fragment","déplacé vers le dos"],
 extra:()=>lzLL(200,"Poignet déformé, gonflé,\ndouloureux",1)+lzLL(232,"Plâtre ou chirurgie (broches,\nplaque)",0),pill:"Plâtre : surveiller couleur, chaleur, doigts",
 cap:"Surveillance sous plâtre : couleur, chaleur, sensibilité et mobilité des doigts, douleur anormale (syndrome des loges) ; surélever la main, bouger les doigts ; rechercher une ostéoporose."});
lzSF("fracture-cheville",{t:"Les malléoles cassent quand la cheville se tord",sub:"Fracture de la cheville : torsion du pied ; une ou deux malléoles (péroné, tibia) peuvent céder",zones:["pied"],spt:[134,234],
 inner:()=>lzR(186,34,124,124,0,"#F6E3DA","none")+lzE(248,120,44,22,"rgba(180,40,30,.3)","none")+lzR(222,34,40,82,6,"url(#rg-bone)","#C9B88E",1)+lzP("M270 34 L284 34 L286 98 L272 104 Z","url(#rg-bone)","#C9B88E",1)+lzP("M274 108 L290 104 L292 126 L280 130 Z","url(#rg-bone)","#C9B88E",1)
  +lzP("M214 122 C224 112 272 112 290 128 C300 140 290 150 270 150 L216 150 C206 146 206 132 214 122 Z","url(#rg-bone)","#C9B88E",1)+lzP("M272 104 l6 2 l4 -3 l6 3","none","#5E3B2A",2),
 zt:["Malléole externe","(péroné) fracturée"],
 extra:()=>lzLL(200,"Gonflement, hématome,\nappui impossible",1)+lzLL(232,"Botte plâtrée ou chirurgie",0),pill:"Surélever la jambe ; anticoagulant si immobilisée",
 cap:"Glace, surélévation, immobilisation ; surveiller orteils (couleur, chaleur, mobilité) et douleur du mollet (phlébite) ; anticoagulant préventif sur prescription ; décharge selon consignes."});
lzSF("osteite",{t:"L'os est infecté, souvent au contact d'une plaie",sub:"Ostéite : infection de l'os après une fracture ouverte, une chirurgie ou une plaie chronique (pied diabétique)",zones:["pied"],spt:[134,234],
 inner:()=>lzR(186,34,124,124,0,"#F6DCD6","none")+lzR(196,70,108,52,10,"url(#rg-bone)","#C9B88E",1.2)+lzR(208,82,84,28,8,"#F3DCD0","none")+lzP("M232 70 C236 84 246 86 252 78 C258 92 270 92 276 82 L276 122 L232 122 Z","#E8D27A","#B8952E",1)
  +lzDots(234,84,40,30,12,4,lzCoc)+lzDots(234,84,40,30,5,6,(x,y)=>lzWbc(x,y,3.4))+lzP("M246 34 C248 50 250 60 252 70","none","#C9473D",6),
 zt:["Os rongé, pus,","bactéries"],
 extra:()=>lzLL(200,"Plaie qui ne guérit pas,\nos visible ou palpable",1)+lzLL(232,"Imagerie, biopsie osseuse",0),pill:"Antibiotiques longs (6 semaines et plus)",
 cap:"Prélèvements (biopsie) avant antibiotiques, antibiothérapie prolongée, parfois chirurgie (nettoyage, ablation du matériel) ; soins de plaie et décharge."});
lzSF("osteomyelite",{t:"Une infection de l'os arrive par le sang",sub:"Ostéomyélite : surtout l'enfant ; le germe (staphylocoque) se fixe près du cartilage de croissance",zones:["genou"],spt:[178,198],
 inner:()=>lzR(186,34,124,124,0,"#F6DCD6","none")+lzP("M218 34 L218 108 C218 128 230 140 248 140 C266 140 278 128 278 108 L278 34 Z","url(#rg-bone)","#C9B88E",1.2)+lzP("M218 118 Q248 126 278 118","none","#CFE6EE",4)
  +lzE(248,98,18,14,"#E8D27A","#B8952E",1)+lzDots(234,88,28,20,8,4,lzCoc)+lzP("M248 34 V84","none",LC.blood,4)+lzArr(248,40,248,80,{c:LC.bact,w:1.6}),
 zt:["Abcès dans l'os près","du cartilage de croissance"],
 extra:()=>lzLL(200,"Enfant : fièvre, boiterie,\ndouleur près du genou",1)+lzLL(232,"Hémocultures, IRM",0),pill:"Urgence : antibiotiques IV rapides",
 cap:"Hémocultures, antibiotiques intraveineux puis oraux, antalgiques, immobilisation antalgique ; surveillance de la fièvre et de la douleur ; chirurgie si abcès."});
lzSF("spondylodiscite",{t:"Le disque et les vertèbres voisines sont infectés",sub:"Spondylodiscite : un germe arrive par le sang (staphylocoque, tuberculose) ou après un geste sur le rachis",zones:["rachis"],spt:[160,88],
 inner:()=>lzSpine({infect:1}),zt:["Disque détruit, plateaux","vertébraux rongés"],
 extra:()=>lzLL(200,"Douleur du dos qui ne cède pas,\nmême la nuit, fièvre",1)+lzLL(232,"IRM, hémocultures, biopsie",0),pill:"Antibiotiques longs, corset, repos",
 cap:"Antibiothérapie prolongée (6 à 12 semaines), immobilisation par corset, antalgiques, surveillance neurologique (abcès comprimant la moelle)."});
/* ============ Rachis ============ */
lzSF("hernie-discale",{t:"Le noyau du disque sort et écrase une racine nerveuse",sub:"Hernie discale : l'anneau du disque se fissure, le noyau gélatineux fait saillie en arrière",zones:["rachis"],spt:[160,88],
 inner:()=>lzSpine({hernia:1}),zt:["Noyau sorti qui comprime","la racine (rouge)"],
 extra:()=>lzLL(200,"Douleur qui descend dans la jambe,\nfourmillements",1)+lzLL(232,"Faiblesse, troubles urinaires :\nurgence (queue de cheval)",0),pill:"Troubles urinaires ou périnée insensible : urgence",
 cap:"Antalgiques, anti-inflammatoires, rester actif selon la douleur, kinésithérapie ; chirurgie si déficit moteur, douleur rebelle ou syndrome de la queue de cheval (urgence)."});
lzSF("sciatique",{t:"La racine du nerf sciatique est irritée",sub:"Sciatique : le plus souvent une hernie discale lombaire (L5 ou S1) ; douleur de la fesse au pied",zones:["rachis"],spt:[160,88],
 inner:()=>lzSpine({hernia:1}),zt:["Racine L5 ou S1","comprimée"],
 extra:()=>lzLL(200,"Douleur de la fesse à l'arrière\nde la jambe, jusqu'au pied",1)+lzLL(232,"Signe de Lasègue positif",0),pill:"Paralysie ou troubles urinaires : urgence",
 cap:"Antalgiques, rester actif, éviter l'alitement prolongé ; surveiller la force du pied (marche sur talons et pointes) et la fonction urinaire."});
lzSF("cruralgie",{t:"Une racine lombaire haute est comprimée",sub:"Cruralgie : atteinte de la racine L3 ou L4 ; douleur de la face avant de la cuisse",zones:["rachis"],spt:[160,88],
 inner:()=>lzSpine({hernia:1}),zt:["Racine L3-L4","comprimée"],
 extra:()=>lzLL(200,"Douleur à l'avant de la cuisse\njusqu'au genou",1)+lzLL(232,"Parfois le genou se dérobe",0),pill:"Antalgie et surveillance de la force",
 cap:"Prise en charge comme une sciatique ; rechercher une faiblesse du quadriceps (risque de chute)."});
lzSF("lombalgie",{t:"Le bas du dos fait mal, souvent sans lésion grave",sub:"Lombalgie : disques et articulations usés, muscles tendus ; devient chronique après 3 mois",zones:["rachis"],spt:[160,88],
 inner:()=>lzSpine({worn:1}),zt:["Disque usé, aminci","et articulations sollicitées"],
 extra:()=>lzLL(200,"Douleur du bas du dos,\nraideur",1)+lzLL(232,"Signes d'alerte : fièvre, perte\nde poids, déficit, nuit",0),pill:"Rester actif : le repos au lit aggrave",
 cap:"Activité maintenue, antalgiques, kinésithérapie active, ergonomie (postures, port de charges) ; rechercher les drapeaux rouges (fracture, infection, cancer)."});
lzSF("lumbago",{t:"Les muscles du dos se bloquent d'un coup",sub:"Lumbago : douleur aiguë du bas du dos après un effort ou un faux mouvement ; contracture réflexe",zones:["rachis"],spt:[160,88],
 inner:()=>lzSpine({spasm:1}),zt:["Muscles du dos","contractés (rouge)"],
 extra:()=>lzLL(200,"Dos bloqué, penché,\ndouleur vive",1)+lzLL(232,"Guérit le plus souvent\nen quelques jours",0),pill:"Antalgiques, chaleur, reprendre l'activité vite",
 cap:"Antalgiques, décontracturants si besoin, chaleur ; reprise rapide des activités ; apprendre les bons gestes pour porter."});
lzSF("cervicalgie",{t:"Le cou est raide et douloureux",sub:"Cervicalgie : postures prolongées, stress, arthrose cervicale ou traumatisme (coup du lapin)",zones:["rachis"],spt:[160,40],
 inner:()=>lzSpine({spasm:1,worn:1}),zt:["Disque cervical usé,","muscles contractés"],
 extra:()=>lzLL(200,"Raideur, maux de tête,\ndouleur vers l'épaule",1)+lzLL(232,"Après un choc : immobiliser\njusqu'au bilan",0),pill:"Écran à hauteur des yeux, pauses",
 cap:"Antalgiques, chaleur, kinésithérapie, ergonomie du poste ; collier seulement de courte durée ; traumatisme : immobilisation et imagerie avant toute mobilisation."});
lzSF("spa",{t:"Les vertèbres s'enflamment puis se soudent",sub:"Spondylarthrite ankylosante : inflammation des sacro-iliaques et du rachis, ponts osseux entre les vertèbres",zones:["bassin","rachis"],spt:[171,140],
 inner:()=>lzSpine({bridge:1})+lzR(196,34,58,124,0,"rgba(232,80,60,.12)","none"),zt:["Pont osseux qui soude","deux vertèbres"],
 extra:()=>lzLL(200,"Douleur des fesses et du dos\nla nuit, raideur le matin",1)+lzLL(232,"Homme jeune ; améliorée\npar le mouvement",0),pill:"Exercices quotidiens pour garder la souplesse",
 cap:"Anti-inflammatoires, biothérapies (anti-TNF), kinésithérapie et exercices quotidiens, posture ; surveiller uvéite (œil rouge douloureux) et infections sous traitement."});
/* courbures du rachis : vue de dos (scoliose) ou de profil (cyphose) */
const lzBackFig=(id,o)=>lz(id,{t:o.t,sub:o.sub,h:o.h||262,ins:false,cap:o.cap,
 draw:()=>{const sp=o.curve,vert=sp.map(([x,y],i)=>lzR(x-7,y-5,14,10,3,"url(#rg-bone)","#C9B88E",.8)).join("");
  return `<g transform="translate(${o.x||84} 20) scale(1.1)">${o.body}</g>`+vert+(o.extra||"")+(o.labels||"")+(o.pill?lzPill(160,(o.h||262)-12,o.pill,LC.acc):"");}});
lzBackFig("scoliose",{t:"La colonne se tord sur le côté",sub:"Scoliose : courbure latérale avec rotation des vertèbres ; souvent à l'adolescence",
 body:`<path d="M0 0 C-18 2 -36 10 -42 22 L-44 120 C-40 136 -20 142 0 142 C20 142 40 136 44 120 L42 22 C36 10 18 2 0 0 Z" style="fill:${LC.skin};stroke:${LC.skinD};stroke-width:1"/><path d="M-30 12 q8 10 6 24 M30 12 q-8 10 -6 24" style="fill:none;stroke:${LC.skinD};stroke-width:1"/>`,
 curve:[[84,32],[87,44],[92,56],[97,68],[99,80],[97,92],[91,104],[84,116],[78,128],[76,140],[78,152],[82,164]],
 extra:lzP("M50 40 L120 34","none","#56626E",1,";stroke-dasharray:3 3")+lzP("M60 160 L110 160","none","#56626E",1,";stroke-dasharray:3 3")+lzE(110,64,12,8,"rgba(200,55,45,.25)","#C8372D",1),
 labels:lzLR(48,"Épaules à des\nhauteurs différentes",0,120,36)+lzLR(84,"Courbure en S\nde la colonne",1,100,80)+lzLR(128,"Gibbosité : bosse\nen se penchant",1,122,64)+lzLR(174,"Test : se pencher\nen avant (Adams)",0),
 pill:"Dépistage à l'adolescence ; corset si évolutive",
 cap:"Surveillance de la croissance, corset ou chirurgie selon l'angle et l'évolution ; activité physique encouragée ; impact sur l'image de soi."});
lzBackFig("cyphose",{t:"Le dos s'arrondit vers l'avant",sub:"Cyphose : courbure exagérée du haut du dos (posture, maladie de Scheuermann, tassements ostéoporotiques)",x:80,
 body:`<path d="M10 0 C28 4 34 20 30 34 C40 50 42 80 34 104 C30 124 20 140 12 150 L-14 150 C-20 130 -22 110 -18 90 C-14 70 -10 46 -14 30 C-16 14 -6 2 10 0 Z" style="fill:${LC.skin};stroke:${LC.skinD};stroke-width:1"/>`,
 curve:[[96,34],[104,44],[110,56],[113,68],[113,80],[110,92],[106,104],[104,116],[104,128],[106,140],[108,152]],
 extra:lzP("M120 50 C136 64 136 96 122 112","none",LC.acc,2.4,";stroke-dasharray:4 3"),
 labels:lzLR(70,"Dos voûté,\ntête en avant",1,128,80)+lzLR(120,"Tassements de\nvertèbres possibles",0,112,92)+lzLR(170,"Douleurs, gêne\nrespiratoire si sévère",0),
 pill:"Kinésithérapie, posture, traiter l'ostéoporose",
 cap:"Renforcement des muscles du dos, correction posturale, corset chez l'adolescent ; chez la personne âgée, rechercher et traiter les fractures-tassements."});
/* ============ Maladies générales ============ */
lzSilFig("lupus",{t:"Le système immunitaire attaque de nombreux organes",sub:"Lupus érythémateux systémique : maladie auto-immune, surtout chez la femme jeune ; évolue par poussées",
 shade:lzR(30,40,110,200,0,"rgba(0,0,0,0)","none"),
 extra:lzP("M74 40 q5 -6 10 0 q5 -6 10 0 q-5 8 -10 4 q-5 4 -10 -4 Z","rgba(200,55,45,.6)","#C8372D",1)+[[60,120],[108,120],[60,172],[108,172]].map(([a,b])=>lzC(a,b,4.4,"rgba(200,55,45,.4)","#C8372D",1.2)).join("")+lzE(84,138,10,7,"rgba(200,55,45,.35)","#C8372D",1)+lzC(92,86,7,"rgba(200,55,45,.3)","#C8372D",1),
 labels:lzLR(40,"Éruption en ailes de\npapillon sur le visage",1,96,40)+lzLR(86,"Cœur, poumons\n(péricardite, pleurésie)",0,100,86)+lzLR(130,"Reins (protéines\ndans les urines)",1,94,138)+lzLR(174,"Articulations\ndouloureuses",0,112,172),
 pill:"Protection solaire ; surveiller urines et tension",
 cap:"Hydroxychloroquine (fond d'œil régulier), corticoïdes, immunosuppresseurs ; photoprotection, surveillance rénale (bandelette, protéinurie), grossesse à programmer."});
lzSilFig("fibromyalgie",{t:"Le cerveau amplifie les messages de douleur",sub:"Fibromyalgie : douleurs diffuses chroniques, fatigue, sommeil non réparateur, sans lésion visible",
 shade:"",
 extra:[[70,62],[98,62],[60,92],[108,92],[74,110],[94,110],[68,150],[100,150],[76,198],[92,198]].map(([a,b])=>lzC(a,b,4.4,"rgba(200,55,45,.4)","#C8372D",1.2)).join("")+lzP("M84 20 C70 12 64 24 72 28","none","#E8C34C",2.4),
 labels:lzLR(40,"Sensibilité accrue\nà la douleur",1,96,30)+lzLR(96,"Points douloureux\nsur tout le corps",1,108,92)+lzLR(150,"Fatigue, sommeil\nperturbé, anxiété",0)+lzLR(196,"Examens normaux",0),
 pill:"Bouger régulièrement : le traitement le plus utile",
 cap:"Écoute et reconnaissance de la douleur, activité physique progressive, thérapies cognitives et corporelles, gestion du sommeil ; peu d'efficacité des antalgiques classiques."});
/* ============ Chirurgie orthopédique ============ */
lzSF("lca",{t:"Le ligament croisé du genou se rompt",sub:"Rupture du ligament croisé antérieur : torsion du genou pied bloqué (ski, football) ; craquement, gonflement",zones:["genou"],spt:[178,198],
 inner:()=>lzR(186,34,124,124,0,"#FBF3EC","none")+lzP("M214 34 L214 82 C214 98 230 100 248 96 C266 100 282 98 282 82 L282 34 Z","url(#rg-bone)","#C9B88E",1)+lzP("M210 158 L210 116 C230 110 266 110 286 116 L286 158 Z","url(#rg-bone)","#C9B88E",1)
  +lzE(248,106,36,8,"rgba(160,200,230,.5)","none")+lzP("M236 90 L246 104","none","#F4F1E8",6)+lzP("M254 110 L262 98","none","#F4F1E8",6)+lzP("M244 101 l4 -2 l2 4","none",LC.acc,1.4)+lzP("M262 92 L232 114","none","#F4F1E8",5)+lzE(248,104,30,14,"rgba(180,40,30,.25)","none"),
 zt:["Ligament croisé antérieur","rompu, sang dans le genou"],
 extra:()=>lzLL(200,"Genou instable qui se dérobe,\ngonflement rapide",1)+lzLL(232,"Rééducation, ligamentoplastie\nselon l'activité",0),pill:"Glace, repos, attelle ; rééducation longue",
 cap:"Glace, surélévation, antalgiques, cannes ; IRM ; ligamentoplastie selon l'âge et l'activité, puis rééducation de plusieurs mois (reprise du sport vers 6 à 9 mois)."});
lzSF("coiffe",{t:"Les tendons qui entourent l'épaule se déchirent",sub:"Rupture de la coiffe des rotateurs : usure avec l'âge ou traumatisme ; le tendon sus-épineux est le plus touché",zones:["epaule"],spt:[122,54],
 inner:()=>lzR(186,34,124,124,0,"#FBF3EC","none")+lzC(252,104,32,"url(#rg-bone)","#C9B88E",1)+lzP("M264 158 V124","none","url(#rg-bone)",30)+lzP("M196 50 C214 40 250 40 270 56","none","url(#rg-bone)",12)
  +lzP("M196 68 C214 62 234 64 244 72","none","#F4F1E8",8)+lzP("M262 76 C272 80 282 90 286 104","none","#F4F1E8",8)+lzP("M244 72 l6 -2 l4 4 l6 0","none",LC.acc,1.6)+lzP("M190 92 C200 82 214 78 228 80","none","#C9675A",14),
 zt:["Tendon sus-épineux","déchiré"],
 extra:()=>lzLL(200,"Douleur, difficulté à lever\nle bras, nuits difficiles",1)+lzLL(232,"Rééducation ou réparation\nchirurgicale",0),pill:"Après chirurgie : attelle et rééducation douce",
 cap:"Antalgiques, kinésithérapie, infiltrations ; chirurgie de réparation chez le sujet actif : attelle 4 à 6 semaines, rééducation progressive, surveillance de la douleur."});
lzSF("pth",{t:"La hanche usée est remplacée par une prothèse",sub:"Prothèse totale de hanche : une cupule dans le bassin, une tige et une tête dans le fémur",zones:["hanche","bassin"],spt:[136,160],
 inner:()=>lzR(186,34,124,124,0,"#FBF3EC","none")+lzP("M186 40 C220 38 252 46 268 64 L268 80 C252 70 226 66 200 70 Z","url(#rg-bone)","#C9B88E",1)+lzC(236,82,22,"url(#rg-plastic)","#7D8A96",1.2)+lzC(236,84,15,"url(#rg-steel)","#56626E",1.2)
  +lzP("M246 96 L286 158 L246 158 L236 110 Z","url(#rg-bone)","#C9B88E",1)+lzP("M244 96 L276 154 L262 158 L238 104 Z","url(#rg-steel)","#56626E",1),
 zt:["Cupule, tête et tige","métalliques"],
 extra:()=>lzLL(200,"Risque de luxation : éviter\ncertains mouvements",1)+lzLL(232,"Phlébite, infection,\nhématome",0),pill:"Lever J0-J1 ; anticoagulant ; positions interdites",
 cap:"Après l'opération : surveillance du pansement, de la douleur, du membre (couleur, sensibilité, mobilité) ; lever précoce, anticoagulant préventif ; éviter flexion forte, croiser les jambes ou rotation selon la voie d'abord."});
lzSF("ptg",{t:"Le genou usé est recouvert de pièces métalliques",sub:"Prothèse totale de genou : le fémur et le tibia reçoivent un implant, avec un insert en polyéthylène",zones:["genou"],spt:[178,198],
 inner:()=>lzR(186,34,124,124,0,"#FBF3EC","none")+lzP("M214 34 L214 78 L282 78 L282 34 Z","url(#rg-bone)","#C9B88E",1)+lzP("M210 78 C210 100 236 104 248 98 C260 104 286 100 286 78 Z","url(#rg-steel)","#56626E",1.2)
  +lzR(212,104,72,10,3,"url(#rg-plastic)","#7D8A96",1)+lzR(210,114,76,6,2,"url(#rg-steel)","#56626E",1)+lzP("M244 120 L244 140 L252 140 L252 120 Z","url(#rg-steel)","#56626E",1)+lzP("M210 120 L210 158 L286 158 L286 120 Z","url(#rg-bone)","#C9B88E",1),
 zt:["Implant fémoral, insert","et plateau tibial"],
 extra:()=>lzLL(200,"Douleur importante au début :\nantalgie avant la rééducation",1)+lzLL(232,"Objectif : flexion à 90°\nrapidement",0),pill:"Glace, rééducation précoce, prévention phlébite",
 cap:"Antalgie efficace, cryothérapie, attelle de mobilisation selon le protocole, lever précoce, anticoagulant ; surveiller pansement, température, mollet ; la rééducation conditionne le résultat."});
