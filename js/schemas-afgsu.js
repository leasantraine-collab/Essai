/* Carnet IFSI — schémas des fiches réflexes d'urgence (AFGSU) : compressions thoraciques, position latérale de
   sécurité, garrot, désobstruction des voies aériennes. Chargé après schemas-ue2.js. */
Object.assign(SCH,{
 rcp:()=>{const skin="#EBC2A4",line="#B98366",hand="#D9A27E";
  const big=(x,y,t,c)=>`<text x="${x}" y="${y}" class="st-b ${c||""}" style="font-size:19px">${t}</text>`;
  return sv(236,`<rect x="62" y="10" width="36" height="22" rx="8" fill="${skin}" stroke="${line}"/>
   <path d="M30 40Q80 22 130 40L140 196Q80 212 20 196Z" fill="${skin}" stroke="${line}" stroke-width="1.4"/>
   <path d="M80 44V146" stroke="${line}" stroke-width="2" stroke-dasharray="3 3"/><circle cx="56" cy="92" r="3" fill="${line}"/><circle cx="104" cy="92" r="3" fill="${line}"/>
   <ellipse cx="80" cy="128" rx="25" ry="15" fill="${hand}" stroke="#A86F4E" stroke-width="1.4"/><ellipse cx="80" cy="120" rx="22" ry="13" fill="#E3B08E" stroke="#A86F4E" stroke-width="1.4"/>
   <path d="M64 116q16 -8 32 0" stroke="#A86F4E" fill="none"/>
   ${AR("M150 128L102 126","#C8372D",1.8)}${AT(154,120,"Talon de la main au","st-sub")}${AT(154,133,"centre de la poitrine","st-sub")}${AT(154,146,"(moitié inférieure du sternum)","st-sub")}
   ${big(160,40,"5 à 6 cm","st-acc")}${AT(160,54,"profondeur, bras tendus","st-sub")}
   ${big(160,84,"100 à 120 /min","st-acc")}${AT(160,98,"relâcher complètement","st-sub")}
   ${big(160,178,"30 : 2","st-acc")}${AT(160,192,"compressions : insufflations","st-sub")}
   ${AT(160,212,"Relais toutes les 2 minutes","st-b")}${AT(160,226,"DAE dès qu'il arrive","st-b")}`,"Les compressions thoraciques chez l'adulte");},
 pls:()=>{const sk="#E3B08E",cl="#8DB4D6",st="stroke-linecap:round;stroke-linejoin:round;fill:none";
  const head=(x,y)=>`<circle cx="${x}" cy="${y}" r="11" fill="${sk}" stroke="#A86F4E"/>`;
  const limb=(d,c=sk)=>`<path d="${d}" style="${st};stroke:${c};stroke-width:9"/>`;
  const torso=(x,w=30)=>`<rect x="${x-w/2}" y="44" width="${w}" height="56" rx="11" fill="${cl}" stroke="#5E87AE"/>`;
  const p1=55,p2=162,p3=268;
  return sv(232,`
   ${limb(`M${p1-7} 98L${p1-9} 158`,"#5E7488")}${limb(`M${p1+7} 98L${p1+9} 158`,"#5E7488")}${limb(`M${p1-14} 52L${p1-20} 98`)}${limb(`M${p1+14} 52L${p1+42} 52L${p1+42} 30`)}${torso(p1)}${head(p1,30)}
   ${limb(`M${p2-7} 98L${p2-2} 126L${p2-12} 152`,"#5E7488")}${limb(`M${p2+7} 98L${p2+9} 158`,"#5E7488")}${limb(`M${p2+14} 52L${p2+42} 52L${p2+42} 30`)}${limb(`M${p2-14} 52L${p2+4} 62L${p2+13} 33`)}${torso(p2)}${head(p2,28)}
   ${AR(`M${p2} 126L${p2+34} 128`,"#C8372D",1.8)}
   ${limb(`M${p3-2} 98L${p3-4} 160`,"#5E7488")}${limb(`M${p3+4} 96L${p3+34} 104L${p3+34} 140`,"#4D6377")}${limb(`M${p3-8} 52L${p3-34} 56L${p3-34} 36`)}${limb(`M${p3+6} 50L${p3+16} 38L${p3+8} 30`)}${torso(p3,20)}${head(p3,28)}
   <path d="M${p3+18} 22q8 -6 14 0" stroke="#2E5AAC" stroke-width="1.6" fill="none"/>
   ${[[p1,"1. Bras à angle droit","côté sauveteur,","paume vers le haut"],[p2,"2. Main à l'oreille","genou opposé relevé,","tirer sur le genou"],[p3,"3. Sur le côté","jambe à angle droit,","bouche ouverte"]].map(([x,a,b,c])=>AT(x,180,a,"st-b","middle")+AT(x,194,b,"st-sub","middle")+AT(x,207,c,"st-sub","middle")).join("")}
   ${AT(160,226,"Victime allongée vue de dessus, sauveteur à sa droite","st-acc","middle")}`,"Les trois temps de la position latérale de sécurité");},
 garrot:()=>{const sk="#E3B08E",ln="#A86F4E";
  return sv(200,`<path d="M18 70Q60 58 110 64L160 70Q200 68 248 78L282 82Q300 84 302 96Q300 110 282 110L248 112Q200 120 160 118L110 122Q60 128 18 116Z" fill="${sk}" stroke="${ln}" stroke-width="1.4"/>
   <path d="M150 68Q156 94 150 120" stroke="${ln}" stroke-dasharray="3 3" fill="none"/>${AT(150,140,"coude","st-sub","middle")}
   <path d="M214 84q10 -4 22 2q-6 10 -22 8z" fill="#B3261E"/><path d="M220 96q2 10 0 18" stroke="#B3261E" stroke-width="3" stroke-linecap="round"/>
   <rect x="182" y="70" width="12" height="52" rx="3" fill="#2F3A45"/><rect x="176" y="60" width="24" height="10" rx="2" fill="#50606E"/><path d="M188 60V44" stroke="#50606E" stroke-width="4" stroke-linecap="round"/>
   ${AR("M188 160L188 128","#C8372D",1.6)}${AT(188,172,"Garrot : quelques centimètres","st-b","middle")}${AT(188,186,"au-dessus de la plaie, côté cœur","st-sub","middle")}
   ${AT(232,58,"plaie","st-b st-acc","middle")}
   <rect x="14" y="12" width="156" height="38" rx="6" fill="#FFF6D6" stroke="#C9A227"/><text x="92" y="28" class="st-b st-dark" text-anchor="middle">T  14 h 32</text>${AT(92,43,"heure de pose, bien visible","st-dark","middle")}
   ${AR("M64 92L28 92","#2E5AAC",1.6)}${AT(40,84,"vers le cœur","st-sub")}`,"Où poser un garrot sur un membre");},
 heimlich:()=>{const sk="#E3B08E",ln="#A86F4E";
  const torso=(x)=>`<path d="M${x-48} 52Q${x} 34 ${x+48} 52L${x+40} 176Q${x} 186 ${x-40} 176Z" fill="${sk}" stroke="${ln}" stroke-width="1.4"/><rect x="${x-14}" y="24" width="28" height="22" rx="8" fill="${sk}" stroke="${ln}"/>`;
  const L=80,R=240;
  return sv(240,`${torso(L)}<path d="M${L-30} 66q12 22 4 44M${L+30} 66q-12 22 -4 44" stroke="${ln}" fill="none" stroke-width="1.4"/><path d="M${L} 52V170" stroke="${ln}" stroke-dasharray="3 3"/>
   <ellipse cx="${L}" cy="86" rx="15" ry="10" fill="#C98A64" stroke="#8C5A3E"/>${[[-26,-8],[26,-8],[0,-22]].map(([dx,dy])=>`<path d="M${L+dx*0.5} ${86+dy*0.5}L${L+dx} ${86+dy}" stroke="#C8372D" stroke-width="2" stroke-linecap="round"/>`).join("")}
   ${torso(R)}<path d="M${R} 52V104" stroke="${ln}" stroke-dasharray="3 3"/><path d="M${R-10} 104L${R} 112L${R+10} 104" stroke="${ln}" fill="none"/><circle cx="${R}" cy="146" r="3" fill="${ln}"/>
   <rect x="${R-14}" y="118" width="28" height="18" rx="7" fill="#C98A64" stroke="#8C5A3E"/>${AR(`M${R+26} 140Q${R+30} 118 ${R+18} 106`,"#C8372D",1.8)}
   ${AT(L,12,"Vue de dos","st-sub","middle")}${AT(R,12,"Vue de face","st-sub","middle")}
   ${AT(L,200,"1. Cinq claques dans le dos","st-b","middle")}${AT(L,214,"entre les omoplates,","st-sub","middle")}${AT(L,227,"personne penchée en avant","st-sub","middle")}
   ${AT(R,200,"2. Cinq compressions","st-b","middle")}${AT(R,214,"poing au creux de l'estomac,","st-sub","middle")}${AT(R,227,"vers soi et vers le haut","st-sub","middle")}`,"Désobstruer les voies aériennes de l'adulte");}
});
Object.assign(SCH_T,{
 rcp:["Les compressions thoraciques","Adulte : où, à quelle profondeur, à quel rythme"],pls:["La position latérale de sécurité","Personne inconsciente qui respire"],
 garrot:["Le garrot","Quand la compression ne suffit pas sur un membre"],heimlich:["Claques dans le dos et compressions abdominales","Obstruction totale chez l'adulte"]
});
