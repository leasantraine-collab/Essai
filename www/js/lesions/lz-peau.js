/* Carnet IFSI — schémas des lésions : dermatologie, plaies chroniques et infections de la peau (31 pathologies).
   Base commune : un bloc de peau en coupe (épiderme, derme, hypoderme, muscle si besoin) que chaque pathologie modifie. */
const SKN={x:10,w:188,y0:58,e:16,d:74,hh:54,dx:12,dy:-10};
const lzBell=(X,b)=>{const t=(X-b.x)/(b.w/2);return Math.abs(t)>=1?0:b.h*(1+Math.cos(Math.PI*t))/2;};
/* o : e (épaisseur de l'épiderme), bump (reliefs [{x,w,h}]), thick (épaississement), ridge (crêtes), bulla {x,w,h,lvl:"sous"|"intra"},
   dc / ec / hc (couleurs derme, épiderme, hypoderme), capD (capillaires dilatés), vess, foll, fx, sweat, corn (couche cornée),
   cut {x0,x1,d} (plaie creusée), deep (muscle), ex(g) dessin superposé, over(g) au premier plan */
function lzSkin(id,o={}){
 const {x,y0,dx,dy}=SKN,w=o.w||SKN.w,X1=x+w,e=o.e||SKN.e,y2=y0+SKN.e+SKN.d,y3=y2+SKN.hh,yM=y3+(o.deep?22:0);
 const B=(o.bump||[]).concat(o.bulla?[o.bulla]:[]),T=o.thick||[],rid=o.ridge==null?2.4:o.ridge;
 const top0=X=>y0-(o.bump||[]).reduce((s,b)=>s+lzBell(X,b),0),top=X=>y0-B.reduce((s,b)=>s+lzBell(X,b),0);
 const wav=X=>T.reduce((s,b)=>s+lzBell(X,b),0)+Math.sin(X*.45)*(rid+T.reduce((s,b)=>s+lzBell(X,b)*.4,0));
 const eb0=X=>top0(X)+e+wav(X),eb=o.bulla&&o.bulla.lvl!=="intra"?eb0:X=>top(X)+e+wav(X);
 const xs=[];for(let X=x;X<=X1+.01;X+=2.5)xs.push(X);
 const line=(f,a=xs)=>a.map((X,i)=>`${i?"L":"M"}${lzN(X)} ${lzN(f(X))}`).join(" "),back=(f,a=xs)=>a.slice().reverse().map(X=>`L${lzN(X)} ${lzN(f(X))}`).join(" ");
 const g={x,X1,y0,y2,y3,yM,top,eb,eb0,e};const call=v=>typeof v==="function"?v(g):(v||"");
 let s=`<path d="M${x} ${y0} L${X1} ${y0} L${X1+dx} ${y0+dy} L${x+dx} ${y0+dy} Z" style="fill:${o.tf||"#F8DCC5"};stroke:rgba(90,40,35,.35);stroke-width:.8"/>`;
 const sf=(ya,yb,c)=>`<path d="M${X1} ${lzN(ya)} L${X1+dx} ${lzN(ya+dy)} L${X1+dx} ${lzN(yb+dy)} L${X1} ${lzN(yb)} Z" style="fill:${c};stroke:rgba(90,40,35,.3);stroke-width:.6"/>`;
 s+=sf(top(X1),eb(X1),"#E9BFA3")+sf(eb(X1),y2,o.dSide||"#E2A994")+sf(y2,y3,o.hSide||"#EBD38A")+(o.deep?sf(y3,yM,"#A9544A"):"");
 let L="";
 if(o.deep)L+=lzR(x,y3,w,yM-y3,0,o.mc||LC.muscle,"none")+[0,1,2,3].map(i=>lzP(`M${x} ${y3+5+i*5} H${X1}`,"none","rgba(110,35,28,.3)",.7)).join("")+lzP(`M${x} ${y3+1} H${X1}`,"none","#F4E6DA",1.6);
 L+=lzR(x,y2,w,y3-y2,0,o.hc||LC.hypo,"none");
 for(let i=0;i<Math.ceil(w/22)+1;i++)for(let j=0;j<2;j++){const cx=x+12+i*22+(j?11:0),cy=y2+14+j*24;if(cx<X1-6)L+=lzE(cx,cy,10.5,9.5,o.hFat||"url(#rg-fat)","#D6B25E",.8);}
 L+=`<path d="${line(eb0)} L${X1} ${y2} L${x} ${y2} Z" style="fill:${o.dc||LC.derm}"/>`;
 L+=[0,1,2].map(i=>lzP(xs.filter((_,k)=>k%4===0).map((X,k)=>`${k?"L":"M"}${lzN(X)} ${lzN(y2-44+i*13+Math.sin(X*.12+i)*2.2)}`).join(" "),"none","rgba(150,70,55,.16)",1.1)).join("");
 if(o.vess!==false){const ya=y2-15,yv=y2-7;
  L+=lzP(`M${x} ${ya} H${X1}`,"none",LC.bloodD,4.2)+lzP(`M${x} ${ya} H${X1}`,"none",LC.blood,2.8)+lzP(`M${x} ${yv} H${X1}`,"none",LC.veinD,4.6)+lzP(`M${x} ${yv} H${X1}`,"none",LC.vein,3.2);
  [40,96,140,190].forEach(X=>{L+=lzP(`M${X} ${ya} C${X-2} ${ya-20} ${X+4} ${lzN(eb0(X)+24)} ${X+1} ${lzN(eb0(X)+12)}`,"none","#C8473D",1);});}
 if(o.caps!==false){for(let X=10.47+Math.ceil((x-10.47)/13.96)*13.96;X<X1-3;X+=13.96){const yb=eb0(X),r=o.capD?2.6:1.6;
  L+=lzP(`M${lzN(X-r)} ${lzN(yb+9)} L${lzN(X-r)} ${lzN(yb+3)} Q${lzN(X)} ${lzN(yb-r+1)} ${lzN(X+r)} ${lzN(yb+3)} L${lzN(X+r)} ${lzN(yb+9)}`,"none",o.capD?"#D0342A":"#D9594C",o.capD?1.8:1.1);}}
 L+=call(o.under);
 L+=`<path d="${line(top)} ${back(eb)} Z" style="fill:${o.ec||LC.skin}"/>`;
 if(o.bulla){const b=o.bulla,bx=xs.filter(X=>Math.abs(X-b.x)<b.w/2),roof=b.lvl==="intra"?e*.42:e*.92,fl=b.lvl==="intra"?X=>top0(X)+e*.42:X=>eb0(X)-1;
  L+=`<path d="${line(X=>Math.min(fl(X),top(X)+roof),bx)} ${back(fl,bx)} Z" style="fill:${b.c||"#E3F1F9"};stroke:#8DB8D3;stroke-width:.8"/>`;}
 L+=`<path d="${line(top)} ${back(X=>top(X)+(o.corn||2.6))} Z" style="fill:${o.cc||"#FCEFE4"}"/>`+lzP(line(top),"none","#C98E6C",1);
 if(o.basal!==false)L+=xs.filter((_,k)=>k%2===0).map(X=>lzC(X,eb0(X)-1.6,1.3,"#C68B68","none")).join("");
 L+=lzP(line(eb0),"none","rgba(150,80,60,.45)",.7);
 if(o.foll!==false){const fx=o.fx||62,fb=y2+8,ft=top(fx+3);
  L+=lzP(`M${fx-8} ${fb} L${fx+3} ${lzN(ft+1)}`,"none","#D9A588",12)+lzP(`M${fx-8} ${fb} L${fx+3} ${lzN(ft+1)}`,"none",o.ec||LC.skin,9)+lzE(fx-8,fb+2,6,5,"#D9A588","#B27A5C",1)
   +[[8,24],[13,30],[7,33]].map(([a,b])=>lzC(fx+a,eb0(fx)+b,4.6,o.seb||"#F6E3A1","#C9A24E",.8)).join("")+lzP(`M${fx-8} ${fb-2} L${fx+3} ${lzN(ft)} L${fx+9} ${lzN(ft-15)}`,"none","#5B3A24",2.4);}
 if(o.sweat!==false){const gx=o.gx||170,gy=y2+2;L+=lzP(`M${gx} ${gy} C${gx+4} ${gy-30} ${gx-5} ${lzN(eb0(gx)+18)} ${gx} ${lzN(top(gx))}`,"none","#D9A588",2.2)+[[0,0],[5,2],[-4,3],[2,6],[-2,-3]].map(([a,b])=>lzC(gx+a,gy+b,3.4,"#F2D2C4","#C98E6C",.8)).join("");}
 L+=call(o.ex);L=`<defs><clipPath id="lzq-${id}"><rect x="${x}" y="-40" width="${w}" height="${yM+40}"/></clipPath></defs><g clip-path="url(#lzq-${id})">${L}</g>`;
 if(o.cut){const c=o.cut,t0=top(c.x0),t1=top(c.x1),k=1.33,q=(c.x1-c.x0)*(c.r==null?.12:c.r),crat=`M${c.x0} ${lzN(t0)} C${lzN(c.x0+q)} ${lzN(t0+(c.d-t0)*k)} ${lzN(c.x1-q)} ${lzN(t1+(c.d-t1)*k)} ${c.x1} ${lzN(t1)}`;
  s+=`<defs><mask id="lzk-${id}"><rect x="0" y="0" width="320" height="320" fill="#fff"/><path d="${crat} Z" fill="#000"/></mask></defs><g mask="url(#lzk-${id})">${L}</g>`
   +lzE((c.x0+c.x1)/2+dx*.45,y0+dy*.45,(c.x1-c.x0)/2,3.4,c.top||"#B9473C","rgba(90,40,35,.4)",.6)+lzP(crat,"none",c.bed||"#C9473D",7)+lzP(crat,"none",c.film||"none",4.2,";stroke-dasharray:1.5 7");
 }else s+=L;
 s+=lzP(`M${x} ${lzN(top(x))} L${x} ${yM} L${X1} ${yM} L${X1} ${lzN(top(X1))}`,"none","rgba(90,40,35,.45)",.9)+call(o.over);
 return s;}
/* médaillon « Où ? » : silhouette et zones touchées (coordonnées de lzBody) */
function lzWhere(m,t){const mk=typeof m==="string"?m:m.map(([a,b,r])=>lzC(a,b,r||5,"rgba(200,55,45,.5)","#C8372D",2.4)).join("");
 return `<rect x="252" y="4" width="64" height="${t?100:90}" rx="10" style="fill:var(--surface);stroke:var(--fx-line);stroke-width:1"/><text x="259" y="16" class="st-sub st-b" style="font-size:8.5px;letter-spacing:.06em">OÙ ?</text>`
  +lzBody(284,27,.4,{ex:mk})+(t?`<text x="284" y="99" text-anchor="middle" class="st-sub" style="font-size:7.5px">${esc(t)}</text>`:"");}
const lzSK=(id,o)=>{const H=o.h||(o.deep?262:248);lz(id,{t:o.t,sub:o.sub,h:H,ins:false,cap:o.cap,leg:o.leg,sk:1,
 draw:()=>(o.custom?o.custom():lzSkin(id,o))+(o.where?lzWhere(o.where,o.whereT):"")+(o.lab||[]).map(a=>lzLR(...a)).join("")+(o.labT||"")+(o.pill?lzPill(160,H-10,o.pill,o.pc||LC.acc):"")});};
/* petits éléments */
const lzY=(x,y,c="#7A4FB5")=>lzP(`M${lzN(x)} ${lzN(y+4)} V${lzN(y)} L${lzN(x-3)} ${lzN(y-3.6)} M${lzN(x)} ${lzN(y)} L${lzN(x+3)} ${lzN(y-3.6)}`,"none",c,1.3);
const lzLang=(x,y)=>[0,1,2,3,4].map(i=>{const a=i*1.26+.3;return lzP(`M${x} ${y} l${lzN(Math.cos(a)*7)} ${lzN(Math.sin(a)*7)}`,"none","#8A63B8",1.4);}).join("")+lzC(x,y,3.2,"#C9B3E6","#8A63B8",1);
const lzFlake=(x,y,a,c="#F4F6F8",s="#AAB5C0")=>lzE(x,y,5.2,1.9,c,s,.7,a);
const lzStrep=(x,y,a=0)=>`<g transform="rotate(${a} ${x} ${y})">${[0,1,2,3,4].map(i=>lzC(x+i*3.6,y+Math.sin(i)*1,1.7,LC.bact,"#225A2B",.4)).join("")}</g>`;
const lzStaph=(x,y)=>[[0,0],[3.4,.6],[1.6,3],[-1.8,2.6],[-2.6,-.8],[.8,-3],[4,-2.4]].map(([a,b])=>lzC(x+a,y+b,1.7,"#D8A21E","#8C6608",.4)).join("");
const lzMite=(x,y)=>[-1,1].map(sd=>[0,1,2,3].map(i=>lzP(`M${x+(i-1.5)*3} ${y} l${(i-1.5)*1.6} ${sd*5.2}`,"none","#6B4A2E",1)).join("")).join("")+lzE(x,y,6.4,4.4,"#E9DCC4","#6B4A2E",1)+lzC(x+6.6,y,1.8,"#8B6440","none");
const lzLouse=(x,y,a=0)=>`<g transform="rotate(${a} ${x} ${y})">${[-1,1].map(sd=>[0,1,2].map(i=>lzP(`M${x-1+i*3} ${y} l${-2+i*2} ${sd*6} l${-1.4} ${sd*1.6}`,"none","#5A4030",1)).join("")).join("")}${lzE(x-3,y,6.6,3.6,"#B89371","#5A4030",1)}${lzE(x+5.4,y,3,2.4,"#A88363","#5A4030",.9)}</g>`;
const lzVes=(x,y,rx=3.4,ry=2.4)=>lzE(x,y,rx,ry,"#DCEFFA","#7FB2D3",.8);
/* ============ Eczémas, psoriasis, urticaire ============ */
lzSK("eczema-atopique",{t:"La barrière de la peau est abîmée et s'enflamme",sub:"Eczéma atopique : peau sèche et perméable, qui réagit aux allergènes et démange",dc:"#F2AC98",capD:1,
 ex:g=>lzDots(84,0,112,1,11,5,(X,Y,R)=>lzVes(X,g.top(X)+6+R()*4,2.2+R()*1.8,1.6+R()*.8))+lzDots(80,0,118,1,8,7,(X,Y,R)=>lzWbc(X,g.eb0(X)+10+R()*16,3.2))
  +lzP("M148 58 l3 9 l3 -9","#C98E6C","#8E5A3E",.8)+lzP("M106 58 l2.4 7 l2.4 -7","#C98E6C","#8E5A3E",.8),
 over:()=>lzDots(138,24,26,12,7,3,(X,Y)=>lzC(X,Y,1.8,"#9C7BC4","none"))+lzArr(151,36,151,54,{c:"#8A63B8",w:1.4}),
 labT:LB(10,20,"Peau sèche, fissurée :\nles allergènes entrent",1,"start",138,30),
 lab:[[120,"Vésicules dans\nl'épiderme",1,176,66],[160,"Inflammation :\nrougeur, prurit",0,150,92]],
 where:[[-27,50,5],[27,50,5],[-9.5,116,5],[9.5,116,5],[0,2,6]],whereT:"plis, visage",pill:"Émollient tous les jours, même sans poussée",
 cap:"Hydrater la peau matin et soir (émollients), toilette rapide à l'eau tiède sans savon, ongles courts, dermocorticoïdes sur les poussées. Ce n'est pas contagieux."});
lzSK("eczema-contact",{t:"La peau fait une allergie à ce qui la touche",sub:"Eczéma de contact : une substance (nickel, parfum, latex, colorant) déclenche une réaction retardée",dc:"#F2AC98",capD:1,
 ex:g=>lzDots(42,60,42,10,9,3,(X,Y)=>lzC(X,Y,1.4,"#7D8A96","none"))+lzLang(98,67)+lzArr(102,76,118,96,{c:"#8A63B8",w:1.3})+lzDots(118,90,76,26,8,9,(X,Y)=>lzWbc(X,Y,3.3))
  +lzDots(122,0,76,1,10,4,(X,Y,R)=>lzVes(X,g.top(X)+6+R()*4,2.4+R()*1.6,1.8+R()*.7)),
 over:()=>lzR(38,40,50,13,6,"url(#rg-steel)","#7D8A96",1)+`<text x="63" y="50" text-anchor="middle" style="font-size:8.5px;font-weight:700;fill:#56626E">Ni</text>`,
 labT:LB(206,22,"Allergène\n(nickel, parfum…)",1,"end",86,42),
 lab:[[116,"Cellule qui capte\nl'allergène",0,98,67],[150,"Lymphocytes :\nréaction 24 à\n72 h après",1,150,100],[198,"Vésicules qui\nsuintent",0,184,64]],
 where:[[-28,76,5],[28,76,5],[-9,0,3.5],[9,0,3.5]],whereT:"mains, oreilles",pill:"Repérer l'allergène (patch-tests) et l'éviter",
 cap:"Supprimer le contact (gants adaptés, bijoux sans nickel), dermocorticoïdes, émollients. Penser aux allergies professionnelles des soignants (latex, produits hydroalcooliques, savons)."});
lzSK("psoriasis",{t:"La peau se renouvelle beaucoup trop vite",sub:"Psoriasis : l'épiderme s'épaissit en plaques rouges recouvertes de squames blanches",thick:[{x:124,w:150,h:14}],bump:[{x:124,w:150,h:8}],capD:1,dc:"#F2B3A2",
 ex:g=>lzDots(60,0,130,1,9,4,(X,Y,R)=>lzArr(X,g.eb(X)-2,X,g.top(X)+5,{c:"rgba(200,55,45,.55)",w:1,hl:4})),
 over:g=>lzDots(56,0,138,1,22,4,(X,Y,R)=>lzFlake(X,g.top(X)-1.5-R()*4,R()*30-15)),
 labT:LB(10,22,"Squames blanches\nqui se détachent",1,"start",122,44),
 lab:[[122,"Épiderme épaissi\nrenouvelé en 4 j\nau lieu de 28 j",1,150,76],[180,"Petits vaisseaux\ndilatés",0,152,94]],
 where:[[-28,50,5],[28,50,5],[-9.5,116,5],[9.5,116,5],[0,-8,5]],whereT:"coudes, genoux",pill:"Maladie inflammatoire chronique, pas contagieuse",
 cap:"Traitements locaux (dermocorticoïdes, dérivés de la vitamine D), photothérapie, traitements généraux si les plaques sont étendues. Retentissement psychologique fréquent ; parfois rhumatisme associé."});
lzSK("urticaire",{t:"L'histamine fait gonfler le derme",sub:"Urticaire : des mastocytes libèrent de l'histamine, le plasma sort des petits vaisseaux et forme des papules",bump:[{x:112,w:110,h:16}],dc:"#F7D2C6",capD:1,
 ex:g=>lzDots(64,0,96,1,26,5,(X,Y,R)=>lzC(X,g.eb0(X)+5+R()*34,1.6+R(),"#BFE0F4","#7FB2D3",.5))+lzE(80,114,9,7,"#F3D9E9","#9C5C86",1)+lzDots(72,108,16,12,9,6,(X,Y)=>lzC(X,Y,1.1,"#9C5C86","none"))
  +lzDots(90,98,26,22,10,8,(X,Y)=>lzC(X,Y,1,"#B5578C","none"))+lzArr(126,112,140,104,{c:LC.fluidD,w:1.3})+lzArr(126,112,112,100,{c:LC.fluidD,w:1.3}),
 labT:LB(10,20,"Papule rose, gonflée, qui\ndémange et change de place",1,"start",152,51),
 lab:[[120,"Mastocyte :\nlibère l'histamine",1,80,114],[164,"Le plasma sort\ndes vaisseaux :\nœdème du derme",0,128,96]],
 where:[[-26,46,4.5],[14,36,4.5],[-6,64,4.5],[10,100,4.5],[-12,128,4.5]],whereT:"n'importe où",pill:"Lèvres ou gorge qui gonflent : appeler le 15",
 cap:"Antihistaminiques, recherche d'une cause (médicament, aliment, infection) ; surveiller l'apparition d'un **angiœdème** ou de signes d'anaphylaxie (gêne respiratoire, malaise)."});
lzSK("acne",{t:"Le pore se bouche et s'infecte",sub:"Acné : trop de sébum, pore obstrué, bactéries qui prolifèrent et inflammation",fx:110,bump:[{x:114,w:44,h:6}],seb:"#F3D27A",
 ex:()=>lzC(114,88,26,"rgba(240,120,80,.22)","none")+lzE(111,86,10,19,"#F6E3A1","#C9A24E",1.1)+lzDots(103,74,16,26,9,5,lzBact)+lzDots(92,70,44,40,7,9,(X,Y)=>lzWbc(X,Y,3))
  +[[124,96],[130,104],[121,106],[128,90]].map(([a,b])=>lzC(a,b,5.4,"#F3D27A","#C9A24E",.8)).join(""),
 over:()=>lzE(113,54,5,3.4,"#3A2A20","none"),
 labT:LB(244,22,"Point noir :\nle pore bouché",1,"end",116,52),
 lab:[[118,"Glande sébacée :\ntrop de sébum",0,128,100],[156,"Bactéries qui\nprolifèrent",1,108,82],[192,"Inflammation :\nbouton rouge,\npustule",0,134,78]],
 where:[[0,1,6],[0,30,5]],whereT:"visage, dos",pill:"Ne pas percer les boutons : risque de cicatrice",
 cap:"Nettoyant doux, pas de gommage agressif ; traitements locaux (peroxyde de benzoyle, rétinoïdes), parfois antibiotiques ou isotrétinoïne (contraception obligatoire et suivi). Retentissement sur l'estime de soi."});
lzSK("rosacee",{t:"Les petits vaisseaux du visage se dilatent",sub:"Rosacée : rougeurs, vaisseaux visibles et parfois boutons au centre du visage",dc:"#F2A694",capD:1,tf:"#F6C2B2",bump:[{x:160,w:26,h:5}],
 ex:()=>[78,86,94].map((Y,i)=>lzP(`M${20+i*14} ${Y} C${50+i*10} ${Y-6} ${70+i*8} ${Y+6} ${100+i*10} ${Y} S${150} ${Y+5} ${196-i*6} ${Y-2}`,"none","#C8372D",2.4)).join("")+lzDots(150,70,22,14,4,5,(X,Y)=>lzWbc(X,Y,2.8)),
 labT:LB(10,22,"Déclenchée par la chaleur,\nl'alcool, les épices, le soleil",0,"start"),
 lab:[[116,"Vaisseaux\ndilatés\n(couperose)",1,96,86],[182,"Rougeur et\npapules",0,160,60]],
 where:[[0,2,6.5]],whereT:"visage",pill:"Eau tiède, pas de gommage, protection solaire",
 cap:"Soins doux, éviter les facteurs déclenchants, traitements locaux (métronidazole, ivermectine) ou par voie orale ; laser sur les vaisseaux visibles."});
lzSK("dermite-seborrheique",{t:"Une levure de la peau irrite les zones grasses",sub:"Dermatite séborrhéique : rougeurs et squames grasses là où les glandes sébacées sont nombreuses",dc:"#F3B8A6",seb:"#F3D27A",
 ex:g=>lzDots(30,0,150,1,22,6,(X,Y,R)=>lzE(X,g.top(X)+1.2,1.8,1.1,"#B58CC7","#7A5FAE",.5,R()*180)),
 over:g=>lzDots(28,0,140,1,14,3,(X,Y,R)=>lzFlake(X,g.top(X)-1.6-R()*2.6,R()*30-15,"#F5E3A6","#C9A24E")),
 labT:LB(10,22,"Squames grasses,\njaunâtres",1,"start",112,52),
 lab:[[116,"Levure\n(Malassezia)",1,120,59],[160,"Zones riches en\nglandes sébacées",0,72,96]],
 where:[[0,-8,5],[0,2,4.5],[0,30,4.5]],whereT:"cuir chevelu",pill:"Revient par poussées (stress, fatigue, hiver)",
 cap:"Shampoings et crèmes antifongiques (kétoconazole), toilette douce ; fréquente chez le nourrisson (croûtes de lait) et chez les personnes atteintes de Parkinson ou de VIH."});
lzSK("mycose-cutanee",{t:"Un champignon colonise la couche cornée",sub:"Mycose cutanée (dermatophyte, candida) : favorisée par la chaleur, l'humidité et la macération",corn:6,dc:"#F3B8A6",
 ex:g=>{let s="";const R=lzRnd(5);for(let i=0;i<9;i++){const X=40+i*16,Y=g.top(X)+3;s+=lzP(`M${X} ${Y} q5 ${-1.5} 10 1 q4 ${1.8} 8 -.5 M${X+5} ${Y-.6} l3 2.6`,"none","#7A5FAE",1.1);}
  return s+lzDots(40,0,140,1,10,8,(X,Y,R)=>lzC(X,g.top(X)+3.4,1.2,"#7A5FAE","none"));},
 over:()=>lzE(46,24,22,11,"#F6CDBE","#D5473C",2.6)+lzE(46,24,13,6,"#F8DCC5","none")+lzDots(150,38,40,8,6,3,(X,Y)=>lzP(`M${X} ${Y} q2 4 0 6 q-2 -2 0 -6`,"#9CCDEB","#3D8CC0",.6)),
 labT:LB(206,20,"Vue de dessus :\nbord rouge qui s'étend",1,"end",69,23),
 lab:[[118,"Champignon\ndans la couche\ncornée",1,100,61],[178,"Plis humides,\nmacération",0,176,46]],
 where:[[-9.5,148,4.5],[9.5,148,4.5],[-7,86,4.5],[7,86,4.5]],whereT:"plis, orteils",pill:"Bien sécher les plis et entre les orteils",
 cap:"Antifongique local, assez longtemps (2 à 4 semaines), sur la lésion et autour ; séchage soigneux, linge en coton, ne pas partager serviettes et chaussures."});
/* ongle en coupe (orteil) */
lzSK("onychomycose",{t:"Le champignon envahit l'ongle par son bord libre",sub:"Onychomycose : l'ongle s'épaissit, jaunit et s'effrite, le plus souvent au gros orteil",
 custom:()=>`<g transform="translate(0 16) scale(.86)">`+(()=>{const skin="M14 82 C80 76 150 70 196 72 C228 74 246 96 244 118 C242 140 220 154 190 156 L14 158 Z";
  return lzP(skin,"url(#rg-skin)","#B98868",1.1)+lzP("M14 100 C60 98 90 100 108 104 C114 98 124 96 132 100 C160 104 196 104 214 114 C220 124 206 132 180 132 C150 132 136 130 130 126 C122 132 112 132 106 126 C86 128 50 128 14 128 Z","url(#rg-bone)","#C9B88E",1)
   +lzP("M108 104 C112 112 112 120 106 126","none","#C9B88E",1)+lzP("M120 82 C150 76 196 72 214 76","none","#F2B8A6",6)
   +lzP("M116 80 C150 72 196 68 214 72 C224 74 232 80 236 88","none","#F4EBDD",5)+lzP("M112 84 C114 78 118 76 124 76","none","#D9A588",4)
   +lzP("M170 70 C196 64 214 64 226 70 C236 76 242 86 240 96 C230 90 214 84 196 82 C186 80 176 78 170 76 Z","#D8B760","#9C7A24",1)
   +lzDots(176,66,58,24,14,7,(X,Y,R)=>lzC(X,Y,1.4+R(),"#B8952E","none"))+lzDots(180,76,50,10,8,5,(X,Y,R)=>lzP(`M${X} ${Y} q4 -1.6 8 .6`,"none","#7A5FAE",1.1))
   ;})()+"</g>",
 labT:LB(14,40,"Matrice : l'ongle\npousse d'ici",0,"start",100,83),
 lab:[[24,"Ongle épaissi,\njaune, friable",1,180,70],[118,"Le champignon\nentre par le\nbord libre",1,222,94],[186,"Os de la phalange",0,140,116]],
 pill:"Traitement long : 6 mois (mains) à 12 mois (pieds)",
 cap:"Prélèvement avant traitement ; vernis ou traitement oral selon l'atteinte ; traiter aussi une mycose des pieds associée ; chez le diabétique, surveiller les pieds et confier la coupe des ongles au pédicure-podologue."});
/* ============ Plaies chroniques ============ */
lzSK("escarre",{t:"La peau est écrasée entre l'os et le support",sub:"Escarre : l'appui prolongé coupe la circulation ; la nécrose part de la profondeur, au contact de l'os",deep:1,dc:"#F0B4A2",tf:"#E6A3A5",
 ex:g=>lzP("M58 224 L170 224 L138 76 L96 76 Z","rgba(78,38,34,.42)","none")+lzP("M96 76 L138 76 L170 224 L58 224 Z","none","#4E2622",1,";stroke-dasharray:4 3")
  +lzR(102,129,30,8,1,"#F4E8E4","#9E2219",.6)+lzP("M44 224 C50 194 180 194 186 224 Z","url(#rg-bone)","#C9B88E",1.2),
 over:()=>[70,108,146].map(X=>lzArr(X,24,X,44,{c:"#56626E",w:2.2})).join("")+lzArr(115,214,115,190,{c:"#56626E",w:2.2}),
 labT:LB(10,16,"Appui prolongé (lit, fauteuil)",1,"start"),
 lab:[[112,"Vaisseaux\nécrasés : plus\nd'oxygène",0,132,133],[166,"Nécrose qui part\nde la profondeur",1,148,170],[206,"Os saillant\n(sacrum, talon)",0,170,214]],
 where:[[0,80,6],[-9.5,148,4.5],[9.5,148,4.5],[0,-9,4]],whereT:"sacrum, talons",pill:"Changer de position toutes les 2 à 3 heures",
 cap:"Évaluer le risque (échelle de **Braden** ou de Norton), matelas adapté, changements de position, ne pas masser une rougeur, nutrition et hydratation, peau propre et sèche ; stades 1 (rougeur qui ne blanchit pas) à 4 (atteinte du muscle ou de l'os)."});
const lzVaric=(y)=>lzP(`M10 ${y} C40 ${y-10} 60 ${y+10} 90 ${y} S140 ${y-10} 170 ${y} S190 ${y+6} 198 ${y}`,"none",LC.veinD,19)+lzP(`M10 ${y} C40 ${y-10} 60 ${y+10} 90 ${y} S140 ${y-10} 170 ${y} S190 ${y+6} 198 ${y}`,"none","#7486C9",16)+lzDots(16,y-6,178,12,17,4,(X,Y,R)=>lzRbcV(X,Y,3,R()*180));
const lzAthero=(y)=>lzR(10,y-7,188,14,0,LC.med,"rgba(90,40,35,.5)",.8)+lzR(10,y-4.5,188,9,0,LC.plasma,"none")+lzP(`M70 ${y-4.5} C90 ${y+3} 130 ${y+3} 150 ${y-4.5} Z`,LC.fat,LC.fatD,.8)+lzP(`M70 ${y+4.5} C95 ${y-1} 125 ${y-1} 150 ${y+4.5} Z`,LC.fat,LC.fatD,.8)+lzRbcs(14,y-3,50,6,4,3,2.6)+lzRbcs(160,y-3,34,6,2,5,2.6);
lzSK("ulcere-veineux",{t:"Le sang stagne dans les veines de la jambe",sub:"Ulcère veineux : les valvules ne ferment plus, la pression monte, la peau s'abîme puis s'ouvre",vess:false,dc:"#EBB09C",
 cut:{x0:62,x1:158,d:96,r:.2,bed:"#C9473D",film:"#E8D27A"},
 ex:()=>lzVaric(176)+lzDots(20,80,180,56,30,6,(X,Y)=>lzC(X,Y,1.5,"#BFE0F4","#7FB2D3",.4))+lzDots(160,78,46,30,14,4,(X,Y)=>lzC(X,Y,1.5,"#9A6A3A","none"))+lzDots(16,78,46,30,10,9,(X,Y)=>lzC(X,Y,1.5,"#9A6A3A","none")),
 over:()=>lzDots(84,58,50,6,5,3,(X,Y)=>lzP(`M${X} ${Y} q2 4 0 6 q-2 -2 0 -6`,"#E8D27A","#B8952E",.6)),
 labT:LB(10,18,"Jambe lourde, œdème, souvent\nprès de la cheville (malléole)",0,"start"),
 lab:[[112,"Plaie large,\npeu profonde,\nqui suinte",1,120,96],[164,"Dermite ocre\n(sang sorti)",0,180,92],[200,"Veine dilatée :\nle sang stagne",1,200,176]],
 where:[[-6,140,4.5]],whereT:"cheville",pill:"La compression est le traitement de base",
 cap:"Bandes ou bas de compression (après mesure de l'IPS), jambes surélevées, marche, soins locaux selon l'aspect de la plaie (détersion, pansement humide) ; cicatrisation lente."});
lzSK("ulcere-arteriel",{t:"Le sang n'arrive plus assez jusqu'à la peau",sub:"Ulcère artériel : une artère rétrécie par l'athérome prive la peau d'oxygène",vess:false,dc:"#EED7CE",ec:"#F3E1D4",tf:"#F1E2D8",foll:false,
 cut:{x0:82,x1:152,d:154,r:.24,bed:"#4E2622",film:"#9A8C88"},
 ex:()=>lzAthero(140),
 labT:LB(10,18,"Peau pâle, froide, sans poils ;\ndouleur la nuit, jambes surélevées",0,"start"),
 lab:[[112,"Plaie creusée,\nbords nets, très\ndouloureuse",1,132,150],[172,"Artère bouchée\npar l'athérome",1,110,140]],
 where:[[-9.5,147,4.5],[9.5,120,4.5]],whereT:"pied, tibia",pill:"Pas de compression sans avis médical (IPS)",
 cap:"Mesure de l'IPS (< 0,9 = artériopathie), avis vasculaire pour revasculariser, arrêt du tabac, antalgiques, soins locaux doux ; ne pas surélever les jambes."});
lzSK("ulcere-mixte",{t:"Veines et artères sont toutes les deux en cause",sub:"Ulcère mixte : stase veineuse et apport artériel insuffisant à la fois",vess:false,dc:"#EBC0B0",
 cut:{x0:70,x1:150,d:116,r:.18,bed:"#A9473D",film:"#E8D27A"},
 ex:()=>lzAthero(140)+lzVaric(182)+lzDots(160,78,46,30,12,4,(X,Y)=>lzC(X,Y,1.5,"#9A6A3A","none")),
 labT:LB(10,18,"Plaie qui ne cicatrise pas,\nœdème et douleur",0,"start"),
 lab:[[112,"Plaie assez\nprofonde",1,118,118],[156,"Artère rétrécie",0,170,140],[196,"Veine dilatée",0,192,180]],
 where:[[-6,138,4.5]],whereT:"jambe",pill:"IPS 0,7 à 0,9 : compression allégée sur avis",
 cap:"Bilan vasculaire complet (IPS, écho-doppler) ; compression adaptée selon l'IPS ; traitement des deux composantes ; soins locaux et lutte contre la douleur."});
lzSK("pied-diabetique",{t:"Le pied s'abîme sans que la personne le sente",sub:"Mal perforant plantaire : nerfs abîmés (plus de douleur), artères rétrécies, plaie sous une zone d'appui",deep:1,vess:false,corn:12,thick:[{x:110,w:110,h:6}],bump:[{x:110,w:110,h:5}],
 cut:{x0:88,x1:136,d:158,r:.2,bed:"#A9473D",film:"#E8D27A"},cc:"#E3C98E",
 ex:()=>lzAthero(132)+lzP("M10 112 C40 110 60 116 80 112 M88 111 C110 108 120 116 140 112 M150 112 C170 110 190 114 210 112","none","#C9A31F",3.2)+lzP("M84 106 l-6 12 M146 106 l-6 12","none",LC.acc,1.6)
  +lzP("M50 224 C56 196 176 196 182 224 Z","url(#rg-bone)","#C9B88E",1.2)+lzDots(100,150,24,38,9,5,lzBact),
 labT:LB(10,22,"Durillon épais sur la zone d'appui",0,"start",150,52),
 lab:[[118,"Nerfs abîmés :\nplaie indolore",1,146,113],[154,"Artères abîmées :\ncicatrise mal",0,170,132],[190,"Infection, os\ntout proche",1,124,180]],
 where:[[-9.5,148,4.5],[9.5,148,4.5]],whereT:"plante du pied",pill:"Examiner les pieds tous les jours",
 cap:"Mise en décharge de la plaie (chaussure adaptée), équilibre du diabète, recherche d'une infection ou d'une ostéite, soins par une équipe spécialisée ; éducation : ne jamais marcher pieds nus, vérifier les chaussures."});
/* ============ Tumeurs ============ */
lzSK("melanome",{t:"Les cellules pigmentaires deviennent cancéreuses",sub:"Mélanome : les mélanocytes prolifèrent, s'étendent en surface puis s'enfoncent dans le derme",tf:"#E3BFA3",
 ex:g=>lzDots(60,0,110,1,30,4,(X,Y,R)=>lzC(X,g.eb0(X)-2-R()*5,2.4+R(),"#4A2C20","#2A1810",.4))+lzP("M80 76 C84 92 92 104 100 112 C110 104 118 96 124 90 C130 98 136 104 142 98 C148 90 150 80 152 74","rgba(74,44,32,.35)","none")
  +lzDots(84,78,64,30,24,7,(X,Y,R)=>lzC(X,Y,2.3+R(),"#4A2C20","#2A1810",.4)),
 over:()=>lzP("M58 54 C66 46 86 44 104 47 C120 43 140 48 160 46 C172 50 170 56 160 58 L60 58 Z","#5A3426","#2A1810",.8)+lzP("M42 58 V112","none","#1E5A6D",1.2)+lzP("M38 58 H46 M38 112 H46","none","#1E5A6D",1.2),
 labT:LB(10,22,"Tache qui change : asymétrique,\nbords irréguliers, plusieurs couleurs",1,"start"),
 lab:[[112,"Mélanocytes\nqui prolifèrent",1,104,70],[150,"Envahit le derme :\nrisque de\nmétastases",1,118,100],[204,"Épaisseur\n(indice de Breslow)",0,42,96]],
 where:[[0,40,5],[-10,120,4.5]],whereT:"dos, jambes",pill:"ABCDE : montrer toute tache qui change",
 cap:"Dépistage : **A**symétrie, **B**ords irréguliers, **C**ouleur inhomogène, **D**iamètre > 6 mm, **É**volution. Exérèse large ; l'épaisseur guide la suite. Protection solaire, surtout enfants et peaux claires."});
lzSK("basocellulaire",{t:"Les cellules de la base de l'épiderme forment un nodule",sub:"Carcinome basocellulaire : le cancer de la peau le plus fréquent, lié au soleil, qui s'étend localement",bump:[{x:112,w:84,h:12}],
 ex:g=>lzP("M78 78 C80 98 92 112 106 112 C120 112 128 100 132 90 C136 100 142 108 150 104 C156 98 150 84 146 76","rgba(120,90,170,.25)","none")
  +[[96,92,11,9],[124,100,10,8],[146,90,7,7],[108,80,8,6]].map(([a,b,rx,ry])=>lzE(a,b,rx,ry,"#9E8CC9","#5E4A96",1.1)+lzE(a,b,rx-3,ry-3,"#C3B6E0","none")).join(""),
 over:g=>lzP(`M76 ${lzN(g.top(76))} Q112 ${lzN(g.top(112)-6)} 148 ${lzN(g.top(148))}`,"none","rgba(255,255,255,.85)",2.6)+lzP("M98 48 q6 3 10 -1 q5 -4 10 0 M118 50 q4 2 7 -1","none","#C8372D",1),
 labT:LB(10,22,"Bordure perlée,\npetits vaisseaux",1,"start",96,48),
 lab:[[114,"Amas de cellules\nbasales dans\nle derme",1,124,100],[178,"S'étend localement,\nmétastase rare",0,146,90]],
 where:[[0,1,5.5],[-24,74,4]],whereT:"visage",pill:"Se protéger du soleil dès l'enfance",
 cap:"Exérèse chirurgicale avec marges ; surveillance de la peau ensuite (autres lésions possibles). Protection solaire : vêtements, chapeau, crème, éviter 12 h – 16 h."});
lzSK("epidermoide",{t:"Les cellules de l'épiderme envahissent le derme",sub:"Carcinome épidermoïde : sur peau abîmée par le soleil ou une plaie chronique, il peut donner des métastases",bump:[{x:112,w:70,h:8}],
 ex:()=>lzP("M84 74 C80 92 86 104 92 116 C96 106 100 100 104 112 C108 124 116 120 118 108 C122 116 130 118 134 104 C138 94 140 84 140 74 Z","#F0C8B2","#B27A5C",1)
  +[[98,98],[118,96],[128,90]].map(([a,b])=>lzC(a,b,4.4,"#F7EFD0","#C9A24E",1)+lzC(a,b,1.8,"#E8D27A","none")).join(""),
 over:g=>lzP(`M92 ${lzN(g.top(92))} C96 40 104 34 112 32 C120 34 128 40 132 ${lzN(g.top(132))} Z`,"#D8B98A","#8E6A3E",1)+lzP("M100 46 l8 -2 M114 40 l6 4","none","#8E6A3E",1),
 labT:LB(10,22,"Lésion croûteuse,\nqui saigne",1,"start",98,38),
 lab:[[114,"Cellules de\nl'épiderme qui\nenvahissent",1,96,110],[178,"Peut donner\ndes métastases",0,136,96]],
 where:[[0,1,5],[-28,78,4],[28,78,4]],whereT:"visage, mains",pill:"Plaie qui ne cicatrise pas : avis médical",
 cap:"Exérèse chirurgicale ; surveillance des ganglions ; terrain : exposition solaire, immunodépression (greffés), cicatrices de brûlure ou ulcères anciens."});
/* ============ Brûlures, nécrose, bulles, purpura, angiœdème ============ */
lzSK("brulures",{t:"La profondeur de la brûlure décide de la cicatrisation",sub:"Du 1er degré (épiderme) au 3e degré (toute la peau détruite), sur une même brûlure",h:262,w:240,bulla:{x:100,w:52,h:15,lvl:"sous",c:"#EAF4FA"},
 ex:g=>{const col=(x0,x1,f0,f1,c)=>{const a=[];for(let X=x0;X<=x1+.01;X+=2.5)a.push(X);return `<path d="${a.map((X,i)=>`${i?"L":"M"}${lzN(X)} ${lzN(f0(X))}`).join(" ")} ${a.slice().reverse().map(X=>`L${lzN(X)} ${lzN(f1(X))}`).join(" ")} Z" style="fill:${c}"/>`;};
  return col(10,70,g.top,g.eb0,"rgba(232,80,60,.42)")+col(130,190,g.top,X=>g.eb0(X)+38,"rgba(236,226,222,.82)")+col(130,190,X=>g.eb0(X)+38,X=>g.eb0(X)+48,"rgba(232,80,60,.35)")
   +col(190,250,g.top,()=>148,"#5E3B2A")+col(190,250,g.top,()=>66,"#2E1F18")+lzDots(193,70,54,74,18,5,(X,Y)=>lzP(`M${X} ${Y} l5 -3`,"none","#8A6A50",1))
   +[70,130,190].map(X=>lzP(`M${X} 40 V202`,"none","#56626E",1,";stroke-dasharray:3 3")).join("");},
 over:()=>[["1er",40],["2e\nsuperficiel",100],["2e\nprofond",160],["3e",220]].map(([t,X])=>lzS(X,t.includes("\n")?22:33,t,"middle","st-acc st-b")).join("")
  +[["rouge,\ndouloureux",40],["cloque\n(phlyctène)",100],["rose-blanc,\npeu sensible",160],["cartonné,\nindolore",220]].map(([t,X])=>lzS(X,214,t,"middle")).join(""),
 lab:[[60,"Épiderme",0,258,58],[112,"Derme",0,258,104],[170,"Hypoderme",0,258,170]],
 pill:"Refroidir : eau à 15 °C pendant 15 minutes",
 cap:"Évaluer la surface (règle des 9 de Wallace, paume de la main = 1 %) et la profondeur ; retirer bijoux et vêtements non collés ; ne pas percer les phlyctènes ; antalgie, prévention de l'infection, apports hydriques si brûlure étendue."});
lzSK("necrose-cutanee",{t:"La peau meurt quand ses vaisseaux se bouchent",sub:"Nécrose cutanée : plaque noire et sèche, entourée d'un liseré rouge inflammatoire",ec:"#3A2620",cc:"#2A1A14",tf:"#3A2620",
 ex:g=>lzP("M60 60 C62 100 80 128 112 132 C144 128 160 100 164 60 Z","#4E2622","none")+lzP("M50 60 C52 104 76 140 112 144 C148 140 172 104 174 60","none","rgba(232,80,60,.5)",6)
  +lzR(14,84,44,3,1,"#C8372D","none")+[[96,133],[128,133]].map(([a,b])=>lzC(a,b,4.4,LC.clot,"#3A0E0B",.8)).join(""),
 lab:[[112,"Plaque noire,\nsèche (escarre)",1,112,100],[152,"Petits vaisseaux\nbouchés",1,128,133],[192,"Liseré rouge :\nla peau saine\nréagit",0,170,84]],
 pill:"Avis pour la détersion, surveiller l'infection",
 cap:"Rechercher la cause (artériopathie, embolie, vascularite, extravasation, compression) ; ne pas laisser une nécrose humide s'infecter ; détersion sur prescription, antalgie avant les soins."});
lzSK("pemphigoide",{t:"Des anticorps décollent l'épiderme du derme",sub:"Pemphigoïde bulleuse : grosses bulles tendues, surtout après 70 ans, avec de fortes démangeaisons",bulla:{x:112,w:96,h:22,lvl:"sous"},
 ex:g=>lzDots(70,0,84,1,13,4,(X,Y,R)=>lzY(X,g.eb0(X)+4)),
 over:g=>lzDots(74,0,76,1,6,8,(X,Y,R)=>lzC(X,g.eb0(X)-7-R()*7,2.2,"#F2C94C","#B98B14",.5)),
 labT:LB(10,22,"Bulle tendue, sur\npeau rouge, qui démange",1,"start",104,44),
 lab:[[114,"Bulle sous\nl'épiderme",1,124,62],[156,"Anticorps contre\nla jonction",1,110,80]],
 where:[[0,34,5],[-27,52,4.5],[-9,96,4.5],[9,96,4.5]],whereT:"tronc, membres",pill:"Ne pas arracher le toit des bulles",
 cap:"Dermocorticoïdes très puissants sur prescription ; percer les bulles de façon aseptique en laissant le toit, pansements non adhésifs, surveiller l'infection et l'état général."});
lzSK("pemphigus",{t:"Des anticorps séparent les cellules de l'épiderme",sub:"Pemphigus : bulles fragiles dans l'épiderme qui laissent vite des érosions, souvent dans la bouche",bulla:{x:86,w:84,h:12,lvl:"intra"},
 cut:{x0:142,x1:186,d:66,bed:"#D9594C",film:"none"},
 ex:g=>lzDots(60,0,56,1,9,4,(X,Y,R)=>lzY(X,g.top(X)+10+R()*3,"#7A4FB5"))+lzDots(62,0,46,1,5,7,(X,Y,R)=>lzC(X,g.top(X)+4+R()*3,2.2,"#F6D3BB","#C98E6C",.6)),
 labT:LB(10,22,"Bulle molle, qui\nse rompt vite",1,"start",84,48),
 lab:[[114,"Anticorps qui\ndécollent les\ncellules",1,88,70],[170,"Érosions, aussi\ndans la bouche",0,164,64]],
 where:[[0,6,5],[0,32,5]],whereT:"bouche, tronc",pill:"Soins des érosions : risque d'infection et de déshydratation",
 cap:"Corticoïdes et immunosuppresseurs ; bains de bouche, alimentation adaptée si atteinte buccale ; soins cutanés comme une brûlure étendue (asepsie, pansements gras, bilan hydrique)."});
lzSK("purpura",{t:"Le sang sort des petits vaisseaux de la peau",sub:"Purpura : taches rouges ou violacées qui ne s'effacent pas à la pression",
 ex:g=>lzDots(70,0,110,1,26,5,(X,Y,R)=>lzRbc(X,g.eb0(X)+6+R()*22,2.6,R()*180))+lzP("M118 84 l4 -2","none","#FFF",2),
 over:()=>lzDots(60,49,120,8,14,7,(X,Y,R)=>lzE(X,Y,2+R()*2,1.2+R(),"#9E2219","none"))+lzR(128,38,58,9,2,"rgba(210,235,250,.55)","#7FB2D3",1.2)+lzArr(157,18,157,36,{c:"#56626E",w:1.8}),
 labT:LB(10,20,"Vitropression :\nla tache reste\nvisible sous le verre",1,"start",128,42),
 lab:[[112,"Globules rouges\nsortis des\nvaisseaux",1,96,86],[168,"Plaquettes basses\nou vaisseaux\nfragiles",0,120,84]],
 where:[[-9.5,120,4.5],[9.5,128,4.5],[-9.5,136,3.5]],whereT:"jambes",pill:"Purpura + fièvre : urgence, appeler le 15",
 cap:"Toujours rechercher la cause : numération des plaquettes, bilan de coagulation, infection (méningocoque : purpura fulminans), vascularite, anticoagulants. Surveiller les autres saignements."});
lzSK("angioedeme",{t:"Le gonflement se fait en profondeur",sub:"Angiœdème : l'œdème touche le derme profond et l'hypoderme du visage, des lèvres, de la gorge",bump:[{x:112,w:180,h:18}],dc:"#F4CDBF",hc:"#EFEACB",
 ex:g=>lzDots(20,110,186,90,60,5,(X,Y,R)=>lzC(X,Y,1.6+R(),"#BFE0F4","#7FB2D3",.5)),
 labT:LB(10,20,"Lèvres, paupières, langue,\nlarynx qui gonflent",1,"start",104,44),
 lab:[[116,"Gonflement blanc,\npeu de prurit",0,150,70],[156,"Œdème profond :\nderme et\nhypoderme",1,170,150]],
 where:[[0,4,5],[0,13,4]],whereT:"visage, gorge",pill:"Voix rauque, gêne pour respirer : appeler le 15",
 cap:"Allergique (histaminique, avec urticaire) : adrénaline si gravité ; bradykinique (IEC, héréditaire) : ne répond pas aux antihistaminiques, traitement spécifique. Surveiller la respiration et la voix."});
/* ============ Infections de la peau ============ */
const lzGang=(x,y)=>lzE(x,y,16,11,"url(#rg-nerve)","#A9831B",1)+lzDots(x-10,y-6,20,12,5,3,(X,Y)=>lzC(X,Y,2.4,"#FBEFC6","#A9831B",.6));
lzSK("herpes",{t:"Le virus dort dans un nerf et se réveille",sub:"Herpès : après la première infection, le virus reste dans un ganglion nerveux ; il remonte le nerf lors des récidives",bump:[{x:128,w:16,h:7},{x:146,w:16,h:8},{x:163,w:14,h:6}],foll:false,
 ex:g=>lzP("M40 182 C80 176 110 160 128 140 C140 120 144 100 146 72","none","#C9A31F",3.4)+lzP("M40 182 C80 176 110 160 128 140 C140 120 144 100 146 72","none","#F2D46E",1.6)
  +lzGang(40,182)+lzP("M66 172 l4 10 M72 170 l4 10","none","#56626E",1.2)+[[110,156],[130,134],[141,108],[146,86]].map(([a,b])=>lzVirus(a,b,2.6)).join("")
  +[128,146,163].map(X=>lzVes(X,g.top(X)+6,6,4)).join("")+lzDots(124,0,44,1,6,4,(X,Y)=>lzVirus(X,g.top(X)+5,1.6)),
 labT:LB(10,22,"Vésicules en bouquet,\nbrûlures avant",1,"start",128,46),
 lab:[[112,"Le virus remonte\nle nerf",1,138,120],[172,"Virus endormi\ndans un ganglion\nnerveux",0,40,182]],
 where:[[0,6,4.5],[0,86,4.5]],whereT:"lèvres, génital",pill:"Contagieux : ne pas toucher, se laver les mains",
 cap:"Récidives favorisées par la fièvre, le soleil, le stress, les règles ; antiviral si poussée importante ; éviter les contacts bouche-peau, surtout avec un nouveau-né ou une personne immunodéprimée."});
lzSK("zona",{t:"Le virus de la varicelle se réveille le long d'un nerf",sub:"Zona : réactivation du virus resté dans un ganglion ; éruption en bande, d'un seul côté, très douloureuse",bump:[{x:110,w:16,h:7},{x:128,w:16,h:8},{x:146,w:14,h:6},{x:164,w:14,h:7}],foll:false,dc:"#F2AC98",
 ex:g=>lzP("M40 182 C80 176 110 160 124 140 C134 120 136 100 138 72","none","rgba(232,80,60,.35)",10)+lzP("M40 182 C80 176 110 160 124 140 C134 120 136 100 138 72","none","#C9A31F",3.4)+lzP("M40 182 C80 176 110 160 124 140 C134 120 136 100 138 72","none","#F2D46E",1.6)
  +lzGang(40,182)+lzP("M66 172 l4 10 M72 170 l4 10","none","#56626E",1.2)+[[104,158],[124,138],[134,110]].map(([a,b])=>lzVirus(a,b,2.6)).join("")+[110,128,146,164].map(X=>lzVes(X,g.top(X)+6,6,4)).join(""),
 labT:LB(10,22,"Vésicules en bande,\nd'un seul côté",1,"start",110,46),
 lab:[[112,"Nerf enflammé :\ndouleurs vives",1,128,132],[166,"Virus endormi\ndepuis la\nvaricelle",0,40,182]],
 where:lzP("M0 30 C-8 30 -18 34 -22 40","none","rgba(200,55,45,.6)",6),whereT:"thorax, un côté",pill:"Antiviral dans les 72 h, traiter la douleur",
 cap:"Antalgiques adaptés (douleurs neuropathiques possibles longtemps après), antiviral précoce, soins locaux propres ; zona ophtalmique : avis ophtalmologique urgent. Vaccin possible après 65 ans."});
lzSK("varicelle",{t:"Une éruption qui évolue par vagues",sub:"Varicelle : primo-infection par le virus VZV ; des lésions de tous les âges se côtoient",bump:[{x:85,w:14,h:4},{x:135,w:18,h:9},{x:185,w:20,h:5}],foll:false,
 ex:g=>lzE(35,g.top(35)+8,12,5,"rgba(232,80,60,.35)","none")+lzE(85,g.top(85)+8,9,5,"rgba(232,80,60,.4)","none")+lzVes(135,g.top(135)+6,7,5)+lzE(135,g.eb0(135)+6,14,5,"rgba(232,80,60,.3)","none"),
 over:g=>lzE(185,g.top(185)+1,10,3.6,"#8E5A2E","#5A3418",.8)+[["tache",35],["bouton",85],["vésicule",135],["croûte",185]].map(([t,X])=>lzS(X,22,t,"middle","st-acc st-b")).join("")+lzArr(20,30,192,30,{c:"#56626E",w:1.2}),
 lab:[[112,"Lésions d'âges\ndifférents",1,135,60],[156,"Contagieux\njusqu'aux croûtes",0,185,58]],
 where:lzDots(-24,-6,48,150,26,3,(X,Y)=>lzC(X,Y,2.4,"rgba(200,55,45,.7)","none")),whereT:"tout le corps",pill:"Ne pas gratter ; ni aspirine ni anti-inflammatoire",
 cap:"Paracétamol (l'aspirine expose au syndrome de Reye, les AINS aux surinfections graves), ongles courts, douche tiède ; éviter le contact avec femmes enceintes et immunodéprimés."});
lzSK("erysipele",{t:"Un streptocoque infecte le derme",sub:"Érysipèle : grosse jambe rouge, chaude, douloureuse, avec fièvre ; porte d'entrée souvent entre les orteils",dc:"#F09A86",tf:"#F2A697",bump:[{x:96,w:180,h:5}],
 ex:g=>lzDots(30,82,140,50,14,5,(X,Y,R)=>lzStrep(X,Y,R()*180))+lzDots(20,80,170,60,24,7,(X,Y)=>lzC(X,Y,1.5,"#BFE0F4","#7FB2D3",.4))+lzP("M186 58 V150","none","#C8372D",1.6,";stroke-dasharray:4 3"),
 over:()=>lzP("M30 56 l4 5 l4 -5","#C8372D","#8E2A22",1)+lzArr(34,32,34,52,{c:LC.bact,w:1.6}),
 labT:LB(150,24,"Porte d'entrée :\nplaie, intertrigo",1,"end",38,50),
 lab:[[114,"Streptocoques\ndans le derme",1,90,104],[156,"Placard rouge,\nchaud, gonflé",0,150,80],[196,"Bord net\n(bourrelet)",0,186,96]],
 where:[[-9.5,120,6],[-9.5,138,5]],whereT:"jambe",pill:"Délimiter la rougeur au feutre",
 cap:"Antibiotique (amoxicilline), repos jambe surélevée, antalgiques, traitement de la porte d'entrée (mycose entre les orteils) ; pas d'AINS. Surveiller l'extension et les signes de gravité."});
lzSK("cellulite",{t:"L'infection gagne l'hypoderme, parfois le fascia",sub:"Cellulite infectieuse : plus profonde que l'érysipèle ; la forme nécrosante est une urgence chirurgicale",deep:1,dc:"#F2AC98",hc:"#F5C9A2",hFat:"#F3B98A",tf:"#E7A2A0",
 ex:()=>lzDots(20,152,186,46,22,5,(X,Y,R)=>R()<.5?lzStrep(X,Y,R()*180):lzBact(X,Y,R))+lzP("M10 203 H198","none","rgba(78,38,34,.7)",3)+lzDots(30,200,150,6,7,3,(X,Y)=>lzC(X,Y,2.4,"#FFFFFF","#56626E",.6))
  +lzArr(60,176,22,176,{c:LC.acc,w:1.6})+lzArr(150,176,188,176,{c:LC.acc,w:1.6}),
 labT:LB(10,22,"Peau rouge, chaude, très douloureuse,\nparfois violacée ou bulleuse",1,"start"),
 lab:[[120,"Infection de\nl'hypoderme",1,120,170],[170,"Fascia atteint :\nnécrosante\n(bulles de gaz)",1,150,203]],
 where:[[-9.5,124,6]],whereT:"souvent jambe",pill:"Douleur intense, peau violacée : urgence chirurgicale",
 cap:"Antibiotiques intraveineux ; la forme nécrosante (fasciite) nécessite une chirurgie en urgence. Surveiller l'extension, la douleur, les signes de choc ; pas d'AINS."});
lzSK("abces-cutane",{t:"Une poche de pus se forme dans le derme",sub:"Abcès cutané (souvent un furoncle) : le staphylocoque infecte un follicule, le pus s'entoure d'une coque",fx:108,bump:[{x:110,w:70,h:12}],dc:"#F2AC98",
 ex:()=>lzE(110,100,30,24,"#E9877A","#B83A2E",3)+lzE(110,100,25,19,"#F2DE8A","#B8952E",1)+lzDots(92,86,36,28,8,4,(X,Y)=>lzWbc(X,Y,3.2))+lzDots(94,88,32,24,6,6,(X,Y)=>lzStaph(X,Y)),
 over:g=>lzE(112,g.top(112)+2,5,3,"#F7EFD0","#C9A24E",.8),
 labT:LB(10,22,"Rouge, chaud, douloureux,\npoint blanc au sommet",1,"start",112,46),
 lab:[[112,"Poche de pus\nentourée d'une\ncoque",1,136,100],[170,"Staphylocoque\ndoré",0,116,96]],
 pill:"Ne pas presser : incision et drainage",
 cap:"Incision et drainage par le médecin, pansement, hygiène des mains ; antibiotique si fièvre, abcès étendu ou terrain fragile. Ne jamais manipuler un furoncle du visage."});
lzSK("gale",{t:"Un acarien creuse un tunnel dans la peau",sub:"Gale : la femelle sarcopte creuse un sillon dans la couche cornée et y pond ses œufs",corn:7,foll:false,
 ex:g=>lzP(`M30 ${lzN(g.top(30)+3)} C60 ${lzN(g.top(60)+6)} 90 ${lzN(g.top(90))} 120 ${lzN(g.top(120)+5)} S150 ${lzN(g.top(150)+3)} 156 ${lzN(g.top(156)+4)}`,"none","#C9A88C",4)
  +[44,62,80,98,114].map(X=>lzE(X,g.top(X)+4,2.2,1.4,"#F7F0DC","#B8952E",.6)).join("")+lzMite(162,g.top(160)+5)+lzVes(184,g.top(184)+7,4,3)+lzDots(60,90,120,30,6,5,(X,Y)=>lzWbc(X,Y,3)),
 labT:LB(10,22,"Sillon : petite ligne\nsinueuse sous la peau",1,"start",80,58),
 lab:[[112,"Sarcopte femelle\nqui creuse",1,164,64],[150,"Œufs pondus\ndans le sillon",0,98,62],[188,"Démangeaisons,\nsurtout la nuit",0,120,100]],
 where:[[-28,78,4.5],[28,78,4.5],[-27,50,4],[27,50,4],[0,46,4]],whereT:"mains, poignets",pill:"Traiter l'entourage le même jour, linge à 60 °C",
 cap:"Traitement local ou oral (ivermectine) de la personne et de tout l'entourage en même temps, à renouveler ; linge et literie lavés à 60 °C ou isolés en sac 72 h ; précautions contact en établissement."});
lzSK("pediculose",{t:"Des poux vivent dans les cheveux et y collent leurs œufs",sub:"Pédiculose du cuir chevelu : le pou pique pour se nourrir de sang, les lentes sont collées près de la racine",foll:false,sweat:false,
 ex:()=>[30,60,90,120,150,180].map((X,i)=>lzP(`M${X-6} ${120} L${X+2} 58`,"none","#D9A588",8)+lzP(`M${X-6} ${120} L${X+2} 58`,"none",LC.skin,5)).join(""),
 over:()=>[30,60,90,120,150,180].map((X,i)=>lzP(`M${X-6} 122 L${X+2} 58 C${X+8} 30 ${X+22} 14 ${X+34} 4`,"none","#5B3A24",2.2)).join("")
  +[[34,46],[64,40],[96,50],[154,42],[184,48]].map(([a,b])=>lzE(a,b,2.6,1.6,"#F4EFE0","#A8902A",.7,-60)).join("")+lzLouse(112,36,-55)+lzDots(92,62,30,12,3,4,(X,Y)=>lzC(X,Y,1.8,"#C8372D","none")),
 lab:[[30,"Pou adulte\n(3 mm)",1,118,30],[70,"Lentes (œufs)\ncollées au cheveu",0,154,42],[150,"Piqûres :\ndémangeaisons",0,104,66]],
 pill:"Peigne fin + traitement, à refaire 7 à 10 jours après",
 cap:"Traitement local (diméticone), peigne fin sur cheveux mouillés, à renouveler pour tuer les poux sortis des lentes ; examiner toute la famille ; laver bonnets, taies et peluches."});
