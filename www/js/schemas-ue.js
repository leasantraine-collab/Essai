/* Carnet IFSI — schémas des cours du Programme : pyramide des besoins, modèle de Reason, roue de Deming,
   étapes du cancer, réaction inflammatoire. Chargé après schemas-pharma.js. */
Object.assign(SCH,{
 maslow:()=>{const lv=[["Physiologiques","respirer, boire, manger, dormir","#F6D9A8"],["Sécurité","abri, santé, stabilité","#F3C9B8"],["Appartenance","liens, famille, groupe","#E8C6DA"],["Estime","reconnaissance","#CFC6EA"],["Réalisation","de soi","#BFD9EA"]];
  const cx=120,H=44,y0=232;let h="";
  lv.forEach(([t,s,c],i)=>{const yb=y0-i*H,yt=yb-H,wb=230-i*34,wt=wb-34;
   h+=`<path d="M${cx-wb/2} ${yb} L${cx+wb/2} ${yb} L${cx+wt/2} ${yt} L${cx-wt/2} ${yt} Z" style="fill:${c};stroke:#fff;stroke-width:2"/>`+AT(cx,yt+19,t,"st-b st-dark","middle")+AT(cx,yt+33,s,"st-dark","middle");});
  return sv(262,h+`${AR("M250 226 L250 26","#5C6B7A",1.6)}${AT(258,120,"On répond","st-sub")}${AT(258,133,"d'abord aux","st-sub")}${AT(258,146,"besoins","st-sub")}${AT(258,159,"de base","st-sub")}
   ${AT(160,254,"Henderson : 14 besoins fondamentaux pour le soin infirmier","st-acc","middle")}`,"La pyramide des besoins de Maslow");},
 reason:()=>{const sl=(x,holes)=>`<g transform="rotate(-8 ${x+17} 100)"><rect x="${x}" y="38" width="34" height="124" rx="10" style="fill:#F7D774;stroke:#C9A227;stroke-width:1.4"/>${holes.map(([dx,dy,r])=>`<circle cx="${x+dx}" cy="${dy}" r="${r}" style="fill:var(--surface);stroke:#C9A227;stroke-width:.8"/>`).join("")}</g>`;
  return sv(232,`${sl(58,[[17,62,6],[12,100,7],[22,138,5]])}${sl(122,[[20,56,5],[17,101,7],[12,142,6]])}${sl(186,[[14,70,6],[17,102,7],[22,134,5]])}${sl(250,[[18,60,5],[16,103,7],[14,140,6]])}
   ${AR("M8 100 L306 100","#C8372D",2.6)}${AT(6,88,"Danger","st-b st-acc")}${AT(316,26,"Dommage","st-b st-acc","end")}
   ${[[75,"Décisions","de direction"],[139,"Conditions","de travail"],[203,"Équipe,","soignant"],[267,"Dernière","barrière"]].map(([x,a,b])=>AT(x,186,a,"st-b","middle")+AT(x,198,b,"st-sub","middle")).join("")}
   ${AT(160,216,"Un accident = plusieurs défaillances alignées :","st-sub","middle")}${AT(160,229,"on analyse le système, pas la faute d'une personne","st-acc","middle")}`,"Le modèle de Reason (fromage suisse)");},
 pdca:()=>{const cx=150,cy=110,r=86,q=[["Planifier","Plan","#BFD9EA",0],["Faire","Do","#CDE7C9",90],["Vérifier","Check","#F6D9A8",180],["Ajuster","Act","#F3C9B8",270]];
  const pt=a=>[cx+r*Math.sin(a*Math.PI/180),cy-r*Math.cos(a*Math.PI/180)];let h="";
  q.forEach(([t,e,c,a])=>{const [x1,y1]=pt(a),[x2,y2]=pt(a+90),[tx_,ty_]=[cx+52*Math.sin((a+45)*Math.PI/180),cy-52*Math.cos((a+45)*Math.PI/180)];
   h+=`<path d="M${cx} ${cy} L${x1.toFixed(1)} ${y1.toFixed(1)} A${r} ${r} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z" style="fill:${c};stroke:#fff;stroke-width:2.5"/>`+AT(tx_,ty_-2,t,"st-b st-dark","middle")+AT(tx_,ty_+11,e,"st-dark","middle");});
  return sv(262,h+`<circle cx="${cx}" cy="${cy}" r="20" style="fill:var(--surface);stroke:#8A97A6;stroke-width:1.2"/>${AT(cx,cy+4,"PDCA","st-b","middle")}
   <path d="M${cx+r+10} ${cy-30} A${r+10} ${r+10} 0 0 1 ${cx+r+10} ${cy+30}" style="fill:none;stroke:#5C6B7A;stroke-width:1.6" marker-end="url(#mk-5C6B7A)"/><path d="M${cx-r-10} ${cy+30} A${r+10} ${r+10} 0 0 1 ${cx-r-10} ${cy-30}" style="fill:none;stroke:#5C6B7A;stroke-width:1.6" marker-end="url(#mk-5C6B7A)"/>
   ${AT(160,222,"Roue de Deming : on planifie, on agit, on mesure,","st-sub","middle")}${AT(160,235,"on ajuste… puis on recommence","st-sub","middle")}${AT(160,254,"Amélioration continue de la qualité","st-acc","middle")}`,"La roue de Deming (PDCA)");},
 entonnoir:()=>{const st=[["Situation d'appel","vécue en stage, qui étonne ou dérange","#BFD9EA",300],["Question de départ","claire, faisable, pertinente","#CFC6EA",262],["Exploration","lectures + entretiens exploratoires","#CDE7C9",224],["Problématique","ce qui fait problème","#F6D9A8",186],["Question de recherche","ou hypothèse à vérifier","#F3C9B8",148]];
  const cx=160;let h="";
  st.forEach(([t,s,c,w],i)=>{const y=14+i*44,w2=w-38;
   h+=`<path d="M${cx-w/2} ${y} L${cx+w/2} ${y} L${cx+w2/2} ${y+40} L${cx-w2/2} ${y+40} Z" style="fill:${c};stroke:#fff;stroke-width:2"/>`+AT(cx,y+18,t,"st-b st-dark","middle")+AT(cx,y+31,s,"st-dark","middle");});
  return sv(268,h+`${AR("M160 236 L160 252","#C8372D",2)}${AT(160,264,"Enquête de terrain → analyse → discussion","st-acc","middle")}`,"L'entonnoir du mémoire : du thème à la question de recherche");},
 preuves:()=>{const lv=[["Méta-analyses, revues","systématiques d'essais","#B9DDB3","A"],["Essais contrôlés","randomisés","#CDE7C9","A"],["Études de cohorte","essais non randomisés","#F6E3A8","B"],["Études cas-témoins","facteurs de risque","#F6D9A8","C"],["Séries de cas,","études descriptives","#F3C9B8","C"],["Avis d'experts,","consensus","#EBB9AE","AE"]];
  const cx=70,H=36,yb0=230;let h="";
  lv.slice().reverse().forEach(([a,b,c,g],j)=>{const yb=yb0-j*H,yt=yb-H,wb=132-j*20,wt=wb-20;
   h+=`<path d="M${cx-wb/2} ${yb} L${cx+wb/2} ${yb} L${cx+wt/2} ${yt} L${cx-wt/2} ${yt} Z" style="fill:${c};stroke:#fff;stroke-width:2"/>`+AT(cx,yt+23,g,"st-b st-dark","middle");
   h+=`<path d="M${cx+wb/2-6} ${yt+18} L146 ${yt+18}" class="pm-lead"/>`+AT(150,yt+15,a,"st-b")+AT(150,yt+28,b,"st-sub");});
  return sv(272,h+`${AT(160,250,"Plus on monte, plus la preuve est solide","st-sub","middle")}${AT(160,263,"Grades HAS : A établie · B présomption · C faible","st-acc","middle")}`,"La pyramide des niveaux de preuve");},
 cancer:()=>{const cell=(x,y,bad)=>`<rect x="${x}" y="${y}" width="12" height="14" rx="2" style="fill:${bad?"#E6A3B0":"#F6DCCB"};stroke:${bad?"#A33D55":"#C98C7A"};stroke-width:.8"/><circle cx="${x+6}" cy="${y+7}" r="${bad?3.4:2.4}" style="fill:${bad?"#6B1E33":"#9C84C8"}"/>`;
  const row=(x0,bads)=>[0,1,2,3,4].map(i=>cell(x0+2+i*14,80,bads.includes(i))).join("");
  const mem=x0=>`<path d="M${x0} 96 L${x0+74} 96" style="stroke:#7FAFCB;stroke-width:2"/>`;
  const ves=x0=>`<rect x="${x0}" y="128" width="74" height="14" rx="7" style="fill:#F3B9B0;stroke:#C8372D;stroke-width:1"/>`;
  return sv(232,`${AT(160,14,"De la cellule normale au cancer","st-b","middle")}
   ${row(4,[2])}${mem(4)}${ves(4)}
   ${row(84,[1,2,3])}${cell(98,66,1)}${cell(112,66,1)}${cell(126,66,1)}${cell(112,52,1)}${mem(84)}${ves(84)}
   ${row(164,[1,2,3])}${cell(178,66,1)}${cell(192,66,1)}${cell(206,66,1)}${mem(164)}${cell(186,100,1)}${cell(200,108,1)}${ves(164)}
   ${row(244,[2])}${mem(244)}${ves(244)}<circle cx="262" cy="135" r="4" style="fill:#6B1E33"/><circle cx="280" cy="135" r="4" style="fill:#6B1E33"/><ellipse cx="300" cy="44" rx="16" ry="12" style="fill:#F2D2A6;stroke:#B4813A"/>${cell(294,38,1)}${AR("M286 130 C296 110 300 80 300 60","#C8372D",1.4)}
   ${AT(41,172,"1. Mutation","st-b","middle")}${AT(41,185,"une cellule","st-sub","middle")}${AT(41,197,"altère son ADN","st-sub","middle")}
   ${AT(121,172,"2. Tumeur","st-b","middle")}${AT(121,185,"multiplication","st-sub","middle")}${AT(121,197,"incontrôlée","st-sub","middle")}
   ${AT(201,172,"3. Invasion","st-b","middle")}${AT(201,185,"franchit la","st-sub","middle")}${AT(201,197,"membrane","st-sub","middle")}
   ${AT(281,172,"4. Métastase","st-b","middle")}${AT(281,185,"migration","st-sub","middle")}${AT(281,197,"à distance","st-sub","middle")}
   ${AT(4,108,"membrane","st-sub")}${AT(4,154,"vaisseau","st-sub")}${AT(160,224,"Tumeur in situ (étapes 1-2) : pas encore d'invasion","st-acc","middle")}`,"Les étapes du développement d'un cancer");},
 inflammation:()=>{const wbc=(x,y)=>`<circle cx="${x}" cy="${y}" r="6" style="fill:#C9B8E8;stroke:#6E5196;stroke-width:.9"/><circle cx="${x+1}" cy="${y}" r="2.4" style="fill:#6E5196"/>`;
  const bact=(x,y,r)=>`<rect x="${x}" y="${y}" width="12" height="5" rx="2.5" transform="rotate(${r} ${x+6} ${y+2.5})" style="fill:#7FB77E;stroke:#3F7A3E;stroke-width:.7"/>`;
  const box=(x,y,t,a,b,c)=>`${PBX(x,y,148,46,c,9)}${AT(x+10,y+16,t,"st-b")}${AT(x+10,y+29,a,"st-sub")}${AT(x+10,y+41,b,"st-sub")}`;
  return sv(274,`<rect x="10" y="30" width="300" height="32" rx="16" style="fill:#F3B9B0;stroke:#C8372D;stroke-width:1.2"/>${AT(16,22,"Capillaire dilaté (plus de sang)","st-sub")}
   ${wbc(60,46)}${wbc(110,46)}${wbc(200,46)}${wbc(150,64)}${wbc(150,84)}${wbc(232,92)}
   ${[[90,68],[180,70],[260,68]].map(([x,y])=>`<path d="M${x} ${y} q3 6 0 10 q-3 -4 0 -10 Z" style="fill:#7FAFCB"/>`).join("")}
   <path d="M10 104 L310 104" style="stroke:none"/>${bact(200,110,20)}${bact(222,118,-15)}${bact(246,108,40)}${bact(214,98,-30)}${AT(232,140,"Microbes, lésion","st-sub","middle")}
   ${AT(142,104,"diapédèse","st-sub","end")}${AT(84,88,"plasma","st-sub","end")}
   ${box(8,152,"Rougeur, chaleur","vasodilatation, afflux","de sang","#C8372D")}${box(164,152,"Œdème (gonflement)","les capillaires laissent","passer le plasma","#2E5AAC")}
   ${box(8,206,"Douleur","médiateurs (histamine,","prostaglandines)","#B4813A")}${box(164,206,"Défense","les globules blancs","détruisent les microbes","#6E5196")}
   ${AT(160,270,"+ impotence fonctionnelle de la zone atteinte","st-acc","middle")}`,"La réaction inflammatoire aiguë");}
});
Object.assign(SCH_T,{
 maslow:["La pyramide des besoins","Selon Abraham Maslow"],reason:["Le modèle de Reason","Comment survient un événement indésirable grave"],pdca:["La roue de Deming","Planifier, faire, vérifier, ajuster"],
 entonnoir:["L'entonnoir du mémoire","Du thème à la question de recherche"],preuves:["Les niveaux de preuve","Quelle confiance accorder à une étude ?"],
 cancer:["Comment naît un cancer","Mutation, prolifération, invasion, métastases"],inflammation:["La réaction inflammatoire","Les signes cardinaux et leur mécanisme"]
});
