/* Carnet IFSI — schémas de pharmacologie : sites d'action des grandes classes thérapeutiques
   (AINS, coagulation, SRAA, synapse, bactérie, sécrétion gastrique, antidiabétiques, récepteurs adrénergiques). Chargé après schemas-anat.js. */
const PXX=(x,y)=>`<circle cx="${x}" cy="${y}" r="7" style="fill:var(--surface);stroke:#C8372D;stroke-width:1.6"/><path d="M${x-3.2} ${y-3.2} L${x+3.2} ${y+3.2} M${x+3.2} ${y-3.2} L${x-3.2} ${y+3.2}" style="stroke:#C8372D;stroke-width:1.8;stroke-linecap:round"/>`;
const PPL=(x,y)=>`<circle cx="${x}" cy="${y}" r="7" style="fill:var(--surface);stroke:#2E7D4F;stroke-width:1.6"/><path d="M${x-3.6} ${y} L${x+3.6} ${y} M${x} ${y-3.6} L${x} ${y+3.6}" style="stroke:#2E7D4F;stroke-width:1.8;stroke-linecap:round"/>`;
const PBX=(x,y,w,h,c,r=8)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" style="fill:var(--surface);stroke:${c};stroke-width:1.4"/>`;
Object.assign(SCH,{
 ains:()=>sv(300,`${PBX(70,4,180,24,"#8A97A6")}${AT(160,20,"Phospholipides des membranes","st-b","middle")}
   ${AR("M160 30 L160 50","#5C6B7A",1.6)}${PXX(160,40)}${AT(148,44,"Corticoïdes","st-b st-acc","end")}${AT(172,44,"phospholipase A2","st-sub")}
   ${PBX(95,54,130,24,"#8A97A6")}${AT(160,70,"Acide arachidonique","st-b","middle")}
   ${AR("M130 80 L86 105","#5C6B7A",1.6)}${AR("M190 80 L234 105","#5C6B7A",1.6)}${PXX(108,92)}${PXX(212,92)}${AT(160,97,"AINS","st-b st-acc","middle")}
   ${PBX(16,108,124,26,"#B4513A")}${AT(78,125,"COX-1 (permanente)","st-b","middle")}${PBX(180,108,124,26,"#C8372D")}${AT(242,125,"COX-2 (induite)","st-b","middle")}
   ${AR("M78 136 L78 147","#5C6B7A",1.4)}${AR("M242 136 L242 147","#5C6B7A",1.4)}
   ${AT(78,160,"Prostaglandines","st-b","middle")}${AT(78,172,"protectrices","st-b","middle")}${AT(78,188,"estomac (mucus)","st-sub","middle")}${AT(78,201,"rein (débit sanguin)","st-sub","middle")}${AT(78,214,"plaquettes (agrégation)","st-sub","middle")}
   ${AT(242,160,"Prostaglandines","st-b","middle")}${AT(242,172,"de l'inflammation","st-b","middle")}${AT(242,188,"inflammation","st-sub","middle")}${AT(242,201,"douleur","st-sub","middle")}${AT(242,214,"fièvre","st-sub","middle")}
   ${PBX(10,226,136,50,"#C8372D",10)}${AT(78,242,"Effets indésirables","st-b st-acc","middle")}${AT(78,255,"ulcère, insuffisance","st-sub","middle")}${AT(78,268,"rénale, saignements","st-sub","middle")}
   ${PBX(174,226,136,50,"#2E7D4F",10)}${AT(242,242,"Effet recherché","st-b st-green","middle")}${AT(242,255,"anti-inflammatoire,","st-sub","middle")}${AT(242,268,"antalgique, antipyrétique","st-sub","middle")}
   ${AT(160,294,"Coxibs : bloquent surtout la COX-2 (moins d'ulcères)","st-sub","middle")}`,"Site d'action des AINS et des corticoïdes"),
 coag:()=>{const clot=`<ellipse cx="138" cy="217" rx="44" ry="17" style="fill:#B3261E;stroke:#7E1A14;stroke-width:1.2"/>${fl("M108 206 L184 228 M110 226 L182 206 M124 201 L168 233 M138 200 L138 234 M104 216 L188 216","#F2C4B8",1.1)}
   ${[[116,212],[156,222],[138,206],[126,226],[164,210]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="5" ry="3.4" style="fill:#E0574A;stroke:#8E1F17;stroke-width:.5"/>`).join("")}${[[108,220],[148,214],[170,220],[130,210]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.6" style="fill:#F2CF5B;stroke:#A9831B;stroke-width:.5"/>`).join("")}`;
  const pl=[[30,128],[44,124],[56,132],[36,140],[50,144],[24,138]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="6" ry="4" style="fill:#F2CF5B;stroke:#A9831B;stroke-width:.7"/>`).join("");
  return sv(292,`${AT(4,18,"Coagulation","st-b")}${AT(4,30,"simplifiée","st-sub")}
   ${PBX(80,6,116,32,"#8A97A6")}${AT(138,19,"Foie + vitamine K","st-b","middle")}${AT(138,32,"fabrique les facteurs","st-sub","middle")}${PXX(196,22)}${AT(207,19,"AVK","st-b st-acc")}${AT(207,32,"bloquent la vit. K","st-sub")}
   ${AR("M138 40 L138 52","#5C6B7A",1.5)}
   ${PBX(80,54,116,32,"#8A97A6")}${AT(138,67,"Facteur Xa","st-b","middle")}${AT(138,80,"accélérateur central","st-sub","middle")}${PXX(196,70)}${AT(207,64,"Anti-Xa","st-b st-acc")}${AT(207,76,"HBPM, fondaparinux,","st-sub")}${AT(207,88,"AOD « xabans »","st-sub")}
   ${AR("M138 88 L138 100","#5C6B7A",1.5)}
   ${PBX(80,102,116,32,"#8A97A6")}${AT(138,115,"Thrombine (IIa)","st-b","middle")}${AT(138,128,"facteur II activé","st-sub","middle")}${PXX(196,118)}${AT(207,112,"Anti-IIa","st-b st-acc")}${AT(207,124,"HNF (+ anti-Xa),","st-sub")}${AT(207,136,"dabigatran (AOD)","st-sub")}
   ${AR("M138 136 L138 148","#5C6B7A",1.5)}
   ${PBX(80,150,116,32,"#8A97A6")}${AT(138,163,"Fibrine","st-b","middle")}${AT(138,176,"filet du caillot","st-sub","middle")}
   ${AR("M138 184 L138 196","#5C6B7A",1.5)}${clot}${AT(138,252,"Caillot (thrombus)","st-b","middle")}
   ${PXX(192,217)}${AT(204,210,"Thrombolytiques","st-b st-acc")}${AT(204,222,"dissolvent la","st-sub")}${AT(204,234,"fibrine (altéplase)","st-sub")}
   ${AT(42,112,"Plaquettes","st-b","middle")}${pl}${AR("M62 142 C80 160 86 186 96 204","#B4513A",1.6)}${PXX(79,166)}
   ${AT(40,200,"Antiagrégants","st-b st-acc","middle")}${AT(40,212,"aspirine,","st-sub","middle")}${AT(40,224,"clopidogrel…","st-sub","middle")}
   ${AT(160,272,"Antidotes : vitamine K (AVK), protamine (HNF),","st-sub","middle")}${AT(160,285,"idarucizumab (dabigatran), andexanet (anti-Xa)","st-sub","middle")}`,"Sites d'action des anticoagulants, antiagrégants et thrombolytiques");},
 sraa:()=>sv(360,`${PBX(76,6,120,30,"#8A97A6")}${AT(136,18,"Rein","st-b","middle")}${AT(136,31,"sécrète la rénine","st-sub","middle")}${PXX(196,21)}${AT(208,17,"Bêtabloquants","st-b st-acc")}${AT(208,29,"freinent la rénine","st-sub")}
   ${AR("M136 38 L136 52","#5C6B7A",1.5)}${AT(126,49,"angiotensinogène (foie)","st-sub","end")}
   ${PBX(76,54,120,30,"#8A97A6")}${AT(136,66,"Angiotensine I","st-b","middle")}${AT(136,79,"inactive","st-sub","middle")}
   ${AR("M136 86 L136 118","#5C6B7A",1.5)}${PXX(136,102)}${AT(124,106,"enzyme de conversion","st-sub","end")}${AT(150,98,"IEC (« -pril »)","st-b st-acc")}${AT(150,110,"bloquent l'enzyme ;","st-sub")}${AT(150,122,"toux sèche possible","st-sub")}
   ${PBX(76,128,120,30,"#8A97A6")}${AT(136,140,"Angiotensine II","st-b","middle")}${AT(136,153,"hormone active","st-sub","middle")}
   ${AR("M136 160 L136 172","#5C6B7A",1.5)}<rect x="96" y="174" width="80" height="16" rx="8" style="fill:#F2D2A6;stroke:#B4813A;stroke-width:1"/>${AT(136,186,"récepteur AT1","st-dark","middle")}
   ${PXX(188,182)}${AT(200,178,"ARA II (« -sartan »)","st-b st-acc")}${AT(200,190,"bloquent AT1","st-sub")}
   ${AR("M120 192 L72 214","#5C6B7A",1.5)}${AR("M152 192 L232 214","#5C6B7A",1.5)}
   ${PBX(8,216,128,40,"#C8372D",10)}${AT(72,232,"Vasoconstriction","st-b","middle")}${AT(72,246,"artères resserrées","st-sub","middle")}
   ${PBX(172,216,140,40,"#B4813A",10)}${AT(242,232,"Aldostérone","st-b","middle")}${AT(242,246,"(glandes surrénales)","st-sub","middle")}
   ${AR("M242 258 L242 272","#5C6B7A",1.5)}${PXX(242,264)}${fl("M164 276 L234 266","#8A97A6",1,";stroke-dasharray:3 3")}${AT(160,276,"Antialdostérone","st-b st-acc","end")}${AT(160,288,"spironolactone,","st-sub","end")}${AT(160,300,"éplérénone","st-sub","end")}
   ${PBX(172,274,140,40,"#B4813A",10)}${AT(242,290,"Rétention de sel","st-b","middle")}${AT(242,304,"et d'eau, perte de K⁺","st-sub","middle")}
   ${AR("M40 258 L40 340 L68 340","#5C6B7A",1.5)}${AR("M280 316 L280 340 L252 340","#5C6B7A",1.5)}
   ${PBX(70,328,180,24,"#C8372D",12)}${AT(160,344,"Pression artérielle ↑","st-b st-acc","middle")}`,"Le système rénine-angiotensine-aldostérone et ses médicaments"),
 synapse:()=>{const ves=(x,y)=>`<circle cx="${x}" cy="${y}" r="10" style="fill:#FBF1E7;stroke:#C98C7A;stroke-width:1"/>${[[-3,-3],[3,-2],[0,3]].map(([a,b])=>`<circle cx="${x+a}" cy="${y+b}" r="1.8" style="fill:#2E5AAC"/>`).join("")}`;
  const nt=[[46,118],[62,126],[80,116],[96,128],[112,118],[70,134],[128,128],[90,120]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.9" style="fill:#2E5AAC"/>`).join("");
  const cup=(x,c)=>`<path d="M${x-8} 141 L${x-8} 131 Q${x} 138 ${x+8} 131 L${x+8} 141 Z" style="fill:${c};stroke:#7A5A2A;stroke-width:.8"/>`;
  return sv(250,`<path d="M70 4 L108 4 L108 28 C148 32 158 60 158 90 L158 108 L22 108 L22 90 C22 60 32 32 70 28 Z" style="fill:#F6D9CC;stroke:#C98C7A;stroke-width:1.4"/>
   ${ves(50,62)}${ves(84,52)}${ves(112,70)}${ves(70,86)}<path d="M52 108 A9 9 0 0 1 70 108" style="fill:#FBF1E7;stroke:#C98C7A;stroke-width:1"/>
   <path d="M128 84 L140 78 A9 9 0 1 0 140 90 Z" style="fill:#B9A5DD;stroke:#6E5196;stroke-width:1"/>
   <rect x="136" y="98" width="16" height="16" rx="4" style="fill:#8FC1A9;stroke:#2E7D4F;stroke-width:1"/>${AR("M144 126 C144 118 144 112 144 104","#2E7D4F",1.3)}${PXX(164,108)}
   ${nt}
   <path d="M14 142 L166 142 L166 190 C166 198 160 204 152 204 L28 204 C20 204 14 198 14 190 Z" style="fill:#DCE9F5;stroke:#7FAFCB;stroke-width:1.4"/>
   <rect x="30" y="128" width="22" height="16" rx="4" style="fill:#8FC1A9;stroke:#2E7D4F;stroke-width:1"/>${PPL(41,120)}${cup(92,"#9DC0E8")}${cup(140,"#E8A13A")}${PXX(140,122)}
   ${AT(90,184,"Neurone postsynaptique","st-b st-dark","middle")}
   ${AT(178,16,"Neurone","st-b")}${AT(178,28,"présynaptique","st-b")}
   ${LL(122,64,176,56)}${AT(178,52,"Vésicules de","st-sub")}${AT(178,64,"neuromédiateurs","st-sub")}
   ${LL(148,84,176,86)}${AT(178,84,"IMAO : bloquent","st-b st-acc")}${AT(178,96,"la dégradation (MAO)","st-sub")}
   ${LL(171,110,176,114)}${AT(178,116,"Antidépresseurs","st-b st-acc")}${AT(178,128,"bloquent la recapture :","st-sub")}${AT(178,140,"plus de sérotonine","st-sub")}
   ${LL(146,124,176,162)}${AT(178,164,"Antipsychotiques","st-b st-acc")}${AT(178,176,"bloquent les","st-sub")}${AT(178,188,"récepteurs D2","st-sub")}
   ${AT(14,228,"Benzodiazépines (+) : renforcent le frein du GABA","st-b st-green")}${AT(14,242,"sur son récepteur (effet calmant, anticonvulsivant)","st-sub")}`,"Sites d'action des psychotropes dans la synapse");},
 bacterie:()=>{const rib=(x,y)=>`<circle cx="${x}" cy="${y}" r="3.2" style="fill:#2E5AAC"/><circle cx="${x+3.6}" cy="${y+2.6}" r="2.2" style="fill:#5C86C8"/>`;
  return sv(262,`<rect x="26" y="16" width="112" height="222" rx="56" style="fill:none;stroke:#C79BB5;stroke-width:7"/><rect x="33" y="23" width="98" height="208" rx="49" style="fill:#F6ECF2;stroke:#8E6F9E;stroke-width:1.6"/>
   ${fl("M30 40 L18 30 M134 40 L146 30 M30 214 L18 224 M134 214 L146 224","#C79BB5",1.4)}
   ${fl("M78 64 C96 74 60 86 80 98 S98 118 76 130 S62 150 84 160 S100 178 78 190","#6E5196",2.2)}
   ${rib(56,92)}${rib(104,120)}${rib(52,150)}${rib(100,80)}${rib(60,196)}${rib(106,168)}
   <path d="M110 198 L118 202 L118 211 L110 215 L102 211 L102 202 Z" style="fill:#E8C34C;stroke:#A9831B;stroke-width:1"/>
   ${LL(140,44,156,38)}${AT(158,30,"Paroi","st-b")}${AT(158,42,"bêtalactamines,","st-sub")}${AT(158,54,"glycopeptides","st-sub")}
   ${LL(131,90,156,86)}${AT(158,80,"Membrane","st-b")}${AT(158,92,"polymyxines (colistine)","st-sub")}
   ${LL(110,122,156,122)}${AT(158,114,"Ribosomes","st-b")}${AT(158,126,"macrolides, aminosides,","st-sub")}${AT(158,138,"cyclines, linézolide","st-sub")}
   ${LL(90,160,156,166)}${AT(158,162,"ADN","st-b")}${AT(158,174,"fluoroquinolones,","st-sub")}${AT(158,186,"métronidazole","st-sub")}
   ${LL(120,207,156,212)}${AT(158,206,"Folates","st-b")}${AT(158,218,"sulfamides +","st-sub")}${AT(158,230,"triméthoprime","st-sub")}
   ${AT(160,256,"Prélever avant de traiter · réévaluer à 48-72 h","st-acc","middle")}`,"Les cibles des antibiotiques dans la bactérie");},
 ipp:()=>{const cup=(x,c)=>`<path d="M${x-8} 166 L${x-8} 176 Q${x} 170 ${x+8} 176 L${x+8} 166 Z" style="fill:${c};stroke:#7A5A2A;stroke-width:.8"/>`;
  return sv(246,`<rect x="8" y="8" width="180" height="48" rx="8" style="fill:#FBEFC8;stroke:#D8B85A;stroke-width:1.2"/>${AT(98,27,"Estomac : acide","st-b st-dark","middle")}${AT(98,41,"(pH 1 à 2)","st-dark","middle")}
   ${[[24,24],[166,22],[30,46],[160,46]].map(([x,y])=>AT(x,y,"H⁺","st-b st-dark","middle")).join("")}
   <rect x="8" y="56" width="180" height="10" style="fill:#CFE6F2"/>
   <rect x="24" y="70" width="148" height="96" rx="14" style="fill:#F6D2C4;stroke:#C98C7A;stroke-width:1.2"/><ellipse cx="62" cy="116" rx="17" ry="12" style="fill:#B9A5DD;stroke:#7A62A8"/>${AT(112,122,"Cellule","st-b st-dark","middle")}${AT(112,135,"pariétale","st-b st-dark","middle")}
   <circle cx="120" cy="72" r="9" style="fill:#8FC1A9;stroke:#2E7D4F;stroke-width:1.2"/>${AR("M120 62 L120 48","#C8372D",1.8)}${PXX(138,64)}
   ${cup(80,"#9DC0E8")}${cup(140,"#E8A13A")}${PXX(158,178)}<path d="M136 190 L144 190 L140 182 Z" style="fill:#B4513A"/>
   <rect x="8" y="192" width="180" height="26" rx="8" style="fill:#F7D6D1;stroke:#C8372D;stroke-width:1.2"/>${AT(98,209,"Sang : histamine, gastrine","st-dark","middle")}
   ${AT(198,18,"Antiacides","st-b st-blue")}${AT(198,30,"neutralisent l'acide","st-sub")}${AT(198,44,"Alginates : radeau","st-sub")}${AT(198,56,"contre le reflux","st-sub")}
   ${LL(146,66,196,98)}${AT(198,100,"IPP","st-b st-acc")}${AT(198,112,"bloquent la pompe","st-sub")}${AT(198,124,"à protons (H⁺/K⁺)","st-sub")}
   ${LL(166,176,196,160)}${AT(198,156,"Anti-H2","st-b st-acc")}${AT(198,168,"bloquent l'histamine","st-sub")}
   ${AT(160,238,"Moins d'acide : l'ulcère cicatrise, le reflux brûle moins","st-sub","middle")}`,"Sites d'action des médicaments de l'acidité gastrique");},
 antidiab:()=>{const bx=(x,y,w,t,l1,l2,c)=>`${PBX(x,y,w,56,c,10)}${AT(x+10,y+18,t,"st-b")}${AT(x+10,y+32,l1,"st-sub")}${AT(x+10,y+46,l2,"st-sub")}`;
  return sv(308,`<circle cx="160" cy="147" r="30" style="fill:#FBE7C2;stroke:#D9A43A;stroke-width:1.6"/>${AT(160,145,"Glucose","st-b st-dark","middle")}${AT(160,158,"sanguin","st-dark","middle")}
   ${bx(8,8,140,"Pancréas","↑ sécrétion d'insuline :","sulfamides, glinides","#2E5AAC")}${bx(172,8,140,"Foie","↓ glucose produit :","metformine","#B4513A")}
   ${bx(8,119,118,"Intestin","GLP-1 naturel,","prolongé : gliptines","#2E7D4F")}${bx(194,119,118,"Muscles, graisse","captent le glucose :","insuline, metformine","#2E5AAC")}
   ${bx(8,230,140,"Rein","glucose éliminé dans","les urines : gliflozines","#B4513A")}${bx(172,230,140,"Cerveau, estomac","satiété, vidange lente :","analogues du GLP-1","#2E7D4F")}
   ${AR("M100 66 L138 122","#5C6B7A",1.4)}${AR("M220 66 L182 122","#5C6B7A",1.4)}${AR("M100 228 L138 172","#5C6B7A",1.4)}${AR("M220 228 L182 172","#5C6B7A",1.4)}
   ${AT(160,302,"L'insuline remplace l'hormone manquante (type 1)","st-acc","middle")}`,"Sites d'action des antidiabétiques");},
 recepteurs:()=>{const cx=[60,160,260],pill=(x,t,c)=>`<rect x="${x-40}" y="8" width="80" height="22" rx="11" style="fill:${c};stroke:none"/>${AT(x,23,t,"st-b st-dark","middle")}`;
  const col=(i,y,lines,cls)=>lines.map((l,j)=>AT(cx[i],y+j*12,l,cls||"st-sub","middle")).join("");
  const cap=(y,t)=>AT(8,y,t,"st-b st-sub");
  return sv(292,`${pill(60,"Alpha 1","#F4C3B5")}${pill(160,"Bêta 1","#F2B8C6")}${pill(260,"Bêta 2","#C5D9F1")}
   ${fl("M110 36 L110 284 M210 36 L210 284","#C9C2B6",1,";stroke-dasharray:3 4")}
   ${cap(46,"ORGANES")}${col(0,60,["vaisseaux","(artérioles)"])}${col(1,60,["cœur"])}${col(2,60,["bronches, utérus,","vaisseaux"])}
   <circle cx="60" cy="102" r="15" style="fill:#F2C4B8;stroke:#B5675C;stroke-width:1.2"/><circle cx="60" cy="102" r="5" style="fill:#B3261E"/>${AR("M36 102 L46 102","#C8372D",1.4)}${AR("M84 102 L74 102","#C8372D",1.4)}
   <path d="M160 118 C140 104 140 88 152 88 C157 88 160 92 160 95 C160 92 163 88 168 88 C180 88 180 104 160 118 Z" style="fill:#D9584B;stroke:#8E1F17;stroke-width:1"/>${AT(184,96,"+","st-b st-acc")}
   ${fl("M246 86 C252 96 252 108 244 120 M274 86 C268 96 268 108 276 120","#B5675C",2.4)}${AR("M252 102 L240 102","#2E5AAC",1.2)}${AR("M268 102 L280 102","#2E5AAC",1.2)}
   ${cap(138,"EFFET")}${col(0,152,["vasoconstriction,","pression ↑"],"st-n")}${col(1,152,["cœur plus rapide","et plus fort"],"st-n")}${col(2,152,["bronchodilatation,","relâchement"],"st-n")}
   ${cap(184,"LES STIMULENT")}${col(0,198,["noradrénaline,","adrénaline,","phényléphrine"])}${col(1,198,["dobutamine,","adrénaline"])}${col(2,198,["salbutamol,","terbutaline,","adrénaline"])}
   ${cap(244,"LES BLOQUENT")}${col(0,258,["alpha-bloquants","(tamsulosine,","urapidil)"])}${col(1,258,["bêtabloquants","(bisoprolol…)"])}${col(2,258,["bêtabloquants non","sélectifs :"])}${AT(260,282,"bronchospasme","st-b st-acc","middle")}`,"Les récepteurs adrénergiques et les médicaments qui agissent dessus");}
});
Object.assign(SCH_T,{
 ains:["Comment agissent les AINS","Les cyclo-oxygénases et les prostaglandines"],coag:["Où agissent les anticoagulants","Cascade de la coagulation simplifiée"],
 sraa:["Le système rénine-angiotensine-aldostérone","Où agissent IEC, ARA II, bêtabloquants et antialdostérone"],synapse:["Les psychotropes dans la synapse","Antidépresseurs, antipsychotiques, benzodiazépines"],
 bacterie:["Les cibles des antibiotiques","Paroi, membrane, ribosomes, ADN, folates"],ipp:["L'acidité gastrique et ses médicaments","IPP, anti-H2, antiacides, alginates"],
 antidiab:["Où agissent les antidiabétiques","Pancréas, foie, intestin, muscles, rein, cerveau"],recepteurs:["Les récepteurs adrénergiques","Alpha 1, bêta 1, bêta 2 : effets et médicaments"]
});
