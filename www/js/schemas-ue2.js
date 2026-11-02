/* Carnet IFSI — schémas des cours du Programme (lot 2) : hérédité, modèle 1+2+3 de Bouchon.
   Chargé après schemas-ue.js. */
Object.assign(SCH,{
 heredite:()=>{const cell=(x,y,g,t,c)=>`<rect x="${x}" y="${y}" width="78" height="44" rx="8" style="fill:${c};stroke:#fff;stroke-width:2"/>`+AT(x+39,y+19,g,"st-b st-dark","middle")+AT(x+39,y+33,t,"st-dark","middle");
  const par=(x,lab)=>`<circle cx="${x}" cy="30" r="16" style="fill:#F6E3A8;stroke:#C9A227;stroke-width:1.4"/>`+AT(x,34,"Aa","st-b st-dark","middle")+AT(x,60,lab.split("|")[0],"st-sub","middle")+AT(x,73,lab.split("|")[1],"st-sub","middle");
  return sv(268,`${par(110,"Père|porteur sain")}${par(210,"Mère|porteuse saine")}${AT(160,34,"×","st-b","middle")}
   ${AT(120,92,"A","st-b st-blue","middle")}${AT(200,92,"a","st-b st-acc","middle")}${AT(66,124,"A","st-b st-blue","middle")}${AT(66,172,"a","st-b st-acc","middle")}
   ${cell(81,100,"AA","sain","#CDE7C9")}${cell(161,100,"Aa","porteur sain","#F6E3A8")}${cell(81,148,"Aa","porteur sain","#F6E3A8")}${cell(161,148,"aa","malade","#F3C9B8")}
   ${AT(160,214,"Transmission autosomique récessive : à chaque grossesse,","st-sub","middle")}${AT(160,228,"1 risque sur 4 d'enfant malade, 1 sur 2 d'enfant porteur","st-sub","middle")}
   ${AT(160,250,"A = allèle normal (dominant) · a = allèle muté (récessif)","st-acc","middle")}`,"Le tableau de croisement d'une maladie autosomique récessive");},
 bouchon:()=>{const base=196,lv=[150,112,76,36],loss=[["1","#D9DEE5"],["2","#F6D9A8"],["3","#F3C9B8"]],cols=[["Adulte","jeune"],["Sujet","âgé"],["+ maladie","chronique"],["+ facteur","aigu"]],seuil=base-58;
  let h=`<path d="M30 ${base} L240 ${base}" style="stroke:#8A97A6;stroke-width:1.2"/><path d="M30 ${base} L30 30" style="stroke:#8A97A6;stroke-width:1.2"/>`;
  cols.forEach(([a,b],i)=>{const x=36+i*54,r=lv[i],cx=x+19;
   h+=`<rect x="${x}" y="${base-r}" width="38" height="${r}" rx="4" style="fill:${i===3?"#EBB9AE":"#BFD9EA"}"/>`;
   for(let k=0;k<i;k++){const hi=lv[k],lo=lv[k+1];h+=`<rect x="${x}" y="${base-hi}" width="38" height="${hi-lo}" rx="3" style="fill:${loss[k][1]};stroke:#8A97A6;stroke-width:.8;stroke-dasharray:3 2"/>`+AT(cx,k===2?base-lo-5:base-(hi+lo)/2+4,loss[k][0],"st-b st-dark","middle");}
   h+=AT(cx,base+16,a,"st-sub","middle")+AT(cx,base+29,b,"st-sub","middle");});
  h+=`<path d="M30 ${seuil} L240 ${seuil}" style="stroke:#C8372D;stroke-width:1.6;stroke-dasharray:5 4"/>`+AT(244,seuil-4,"Seuil de","st-b st-acc")+AT(244,seuil+10,"défaillance","st-b st-acc")+AT(38,24,"Réserve fonctionnelle d'un organe","st-sub");
  return sv(262,h+`${AT(160,246,"1 vieillissement + 2 maladie chronique + 3 facteur aigu","st-sub","middle")}${AT(160,259,"(infection, déshydratation, médicament) = décompensation","st-acc","middle")}`,"Le modèle 1 + 2 + 3 de Bouchon");}
});
Object.assign(SCH_T,{
 heredite:["La transmission héréditaire","Le tableau de croisement"],bouchon:["Le modèle 1 + 2 + 3","Pourquoi la personne âgée décompense"]
});
