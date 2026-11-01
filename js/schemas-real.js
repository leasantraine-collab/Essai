/* Carnet IFSI — schémas anatomiques réalistes (dégradés, couleurs anatomiques, traits de rappel).
   Remplace le dessin des schémas d'organes (PMAPS) et des schémas anatomiques des fiches (SCH). Chargé après pathos-maps.js. */
(function(){
 const G={myo:["#D2685D","#8A2B25"],bloodR:["#EC7B6B","#B5372D"],bloodB:["#8E9BD2","#4C5996"],lung:["#F8C9C2","#D78A82"],liver:["#B9584A","#6F2B21"],
  stomach:["#F4CBBB","#D6937F"],intest:["#F7D4C3","#DCA28D"],colon:["#EBC0A8","#C98C73"],kidney:["#C65E50","#7C2C24"],brain:["#F4D9D1","#D6A59A"],
  bone:["#FCF7EA","#D8C59C"],skin:["#F8DCC5","#E2AD89"],fat:["#FDEDB9","#E9C66A"],gland:["#D97E72","#9C4038"],uterus:["#EFB6AE","#C7736B"],
  placenta:["#C35B51","#80302A"],fetus:["#F8D7BE","#E0A784"],bladder:["#F5D8BE","#D8A57F"],muscle:["#D3705F","#923A30"],eyew:["#FFFFFF","#E4DCD0"],
  iris:["#A9CBE8","#3B6893"],lens:["#F7FAFC","#CDDCE6"],vitre:["#F9FBFD","#E1EBF1"],spleen:["#A85868","#6A2C3A"],pancreas:["#F5D7AA","#D8A86A"],
  gall:["#9BC07A","#5E8240"],cart:["#EAF4F7","#B7D1DB"],nerve:["#F8E39A","#D7B24A"],mucosa:["#F4B4AB","#D2766D"],amnio:["#EAF5FC","#C0DEF0"],
  ovary:["#F4D6C3","#D8A68B"],breast:["#F9DCC7","#E4B08C"],thyroid:["#CD6D63","#913A32"],dura:["#EDE6F2","#C9BCD6"],blood:["#E04F45","#A6261F"],
  gray:["#F1EEEA","#CFC8BF"],steel:["#F2F5F8","#AEB9C3"],plastic:["#FFFFFF","#DCE6EE"],cuff:["#7FA6C9","#4A759E"],plaster:["#FFFFFF","#E3DED4"]};
 const rad=Object.entries(G).map(([k,[a,b]])=>`<radialGradient id="rg-${k}" cx=".38" cy=".32" r=".82"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient>`).join("");
 const extra=`<pattern id="pm-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="#FFE066" fill-opacity=".38"/><rect width="2.4" height="6" fill="#F59F00" fill-opacity=".95"/></pattern>`+
  `<linearGradient id="lg-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--surface);stop-opacity:1"/><stop offset="1" style="stop-color:var(--surface);stop-opacity:0"/></linearGradient><linearGradient id="lg-skinlayer" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3CDB4"/><stop offset="1" stop-color="#E8B394"/></linearGradient>`;
 const put=()=>{if(document.getElementById("pm-defs"))return;const d=document.createElement("div");d.innerHTML=`<svg id="pm-defs" width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true" focusable="false"><defs>${rad}${extra}</defs></svg>`;document.body.appendChild(d.firstChild);};
 if(document.body)put();else document.addEventListener("DOMContentLoaded",put);
})();

/* ---------- Outils de dessin ---------- */
const RC={art:"#C8372D",artD:"#8B1E17",vein:"#4A63AC",veinD:"#2E4079",nerve:"#E8C34C",nerveD:"#A9831B",line:"rgba(70,30,25,.38)",fine:"rgba(90,40,35,.42)"};
/* organe : forme remplie d'un dégradé anatomique ; hachures jaunes par-dessus si la zone est concernée */
const og=(d,g,on,o={})=>`<path d="${d}"${o.fr?' fill-rule="evenodd"':""} style="fill:url(#rg-${g});stroke:${o.s||RC.line};stroke-width:${o.w||.9};stroke-linejoin:round${o.op!=null?`;opacity:${o.op}`:""}"/>`+(on?`<path d="${d}" class="pm-hl"${o.fr?' fill-rule="evenodd"':""}/>`:"");
/* vaisseau ou conduit : tube avec bord sombre et reflet ; halo jaune si concerné */
const vs=(d,w,c,dk,on,o={})=>(on?`<path d="${d}" class="pm-halo" style="stroke-width:${w+8}"/>`:"")+
 `<path d="${d}" style="fill:none;stroke:${dk};stroke-width:${(w+1.4).toFixed(1)};stroke-linecap:${o.cap||"round"};stroke-linejoin:round"/>`+
 `<path d="${d}" style="fill:none;stroke:${c};stroke-width:${w};stroke-linecap:${o.cap||"round"};stroke-linejoin:round"/>`+
 (w>=5?`<path d="${d}" transform="translate(${(-w*.17).toFixed(1)} ${(-w*.17).toFixed(1)})" style="fill:none;stroke:#fff;stroke-opacity:.32;stroke-width:${(w*.26).toFixed(1)};stroke-linecap:round;stroke-linejoin:round"/>`:"");
const art=(d,w,on)=>vs(d,w,RC.art,RC.artD,on),vein=(d,w,on)=>vs(d,w,RC.vein,RC.veinD,on),nerf=(d,w,on)=>vs(d,w,RC.nerve,RC.nerveD,on);
/* trait fin (sillons, plis, contours internes) */
const fl=(d,c=RC.fine,w=.9,o="")=>`<path d="${d}" style="fill:none;stroke:${c};stroke-width:${w};stroke-linecap:round;stroke-linejoin:round${o}"/>`;
/* étiquette avec trait de rappel vers la structure */
const LB=(x,y,t,on,a,px,py)=>{const L=t.split("\n"),w=Math.max(...L.map(l=>l.length))*5.25,yy=y-3.5+(L.length-1)*6.5,sx=a==="end"?x-w-3:a==="middle"?x:x+w+3,sy=a==="middle"?y-12:yy;
 return (px!=null?`<path d="M${sx.toFixed(1)} ${sy} L${px} ${py}" class="pm-lead${on?" on":""}"/><circle cx="${px}" cy="${py}" r="1.7" class="${on?"f-acc":"f-sub"}"/>`:"")+PM_LAB(x,y,t,on,a);};
/* numéros d'exercice : pastille cerclée de blanc, lisible sur les dessins colorés */
pmNums=function(map,keys){return keys.map((k,i)=>{const [x,y]=map.pts[k]||[0,0];return `<circle cx="${x}" cy="${y}" r="9.5" class="f-acc" style="stroke:#fff;stroke-width:1.8"/><text x="${x}" y="${y+4}" text-anchor="middle" style="fill:#fff;font-weight:700;font-size:11px">${i+1}</text>`;}).join("");};
const PMR=(k,pts,fn)=>{PMAPS[k].pts=pts;PMAPS[k].draw=function(h,num){const on=z=>h.includes(z),lb=!num,s=fn(on,lb);return num?s.replace(/<\/svg>$/,pmNums(this,num)+"</svg>"):s;};};

/* ================= LE CŒUR (coupe frontale) ================= */
PMR("coeur",{od:[124,124],og:[204,110],vd:[134,172],vg:[204,168],aorte:[226,32],ap:[140,70],valves:[194,131],coronaires:[238,150],pericarde:[252,198],myocarde:[230,184],conduction:[114,101],veines:[111,36]},(on,lb)=>{
 const OUT="M104 96 C88 104 82 132 90 152 C100 176 150 206 198 214 C214 216 232 196 238 172 C246 140 242 108 226 94 C214 84 196 84 186 90 L150 92 C138 86 118 88 104 96 Z",
  RA="M108 104 C98 112 96 134 104 144 C116 150 138 148 146 140 C150 128 148 110 140 102 C130 96 116 98 108 104 Z",
  RV="M108 153 C112 172 140 192 164 201 C167 182 167 162 161 150 C146 151 124 153 108 153 Z",
  LA="M176 100 C172 108 174 120 182 124 C198 128 218 126 228 118 C232 108 226 98 214 96 C202 94 186 94 176 100 Z",
  LV="M180 137 C176 157 182 182 198 203 C210 201 220 187 224 167 C228 151 226 139 218 133 C206 131 190 131 180 137 Z";
 const sac="M98 88 C76 98 70 136 80 160 C94 190 150 220 200 224 C222 226 244 202 250 172 C258 136 252 100 232 84 C212 72 130 74 98 88 Z";
 return sv(232,
  vein("M112 99 L111 46 C111 36 112 28 114 16",13,on("veines"))+vein("M100 146 C92 164 88 184 87 210",12,on("veines"))+
  vs("M226 104 L254 97 M229 117 L255 120",6,"#D9574A","#9C2A20",false)+
  `<path d="${sac}" style="fill:#F3E6D2;fill-opacity:.55;stroke:#C2A57E;stroke-width:1.1;stroke-dasharray:4 3"/>`+(on("pericarde")?`<path d="${sac}" class="pm-hl" fill-rule="evenodd" style="fill-opacity:.9"/>`+`<path d="${OUT}" style="fill:var(--surface)"/>`:"")+
  og(OUT,"myo",false,{s:"#6E1F1A",w:1})+(on("myocarde")?`<path d="${OUT} ${RA} ${RV} ${LA} ${LV}" fill-rule="evenodd" class="pm-hl"/>`:"")+
  fl("M120 100 C116 120 118 140 126 150 M200 98 C196 112 198 124 206 130",RC.fine,.7)+
  og(RA,"bloodB",on("od"),{s:"#3C4880"})+og(RV,"bloodB",on("vd"),{s:"#3C4880"})+og(LA,"bloodR",on("og"),{s:"#8E241C"})+og(LV,"bloodR",on("vg"),{s:"#8E241C"})+
  (on("valves")?`<path d="M110 150 H146 M184 130 H218 M172 97 H192 M146 96 H162" class="pm-halo" style="stroke-width:9"/>`:"")+
  fl("M111 148 q8 7 15 0 M128 148 q8 7 15 0 M185 129 q8 7 15 0 M202 129 q8 7 15 0 M173 97 q5 6 10 0 M183 97 q5 6 10 0 M147 95 q4 6 8 0 M155 95 q4 6 8 0","#FBEEE4",2.2)+
  (on("coronaires")?"":"")+art("M176 96 C140 96 100 104 93 128 C89 150 104 176 128 192",2.6,on("coronaires"))+art("M192 95 C222 96 241 120 241 150 C239 176 223 200 203 211",2.6,on("coronaires"))+
  fl("M104 132 L96 140 M110 172 L104 182 M236 132 L246 128 M232 170 L242 176",RC.art,1.4)+
  (on("conduction")?`<path d="M114 101 L158 147 L168 158 M170 158 C172 176 180 196 194 206 M166 158 C160 176 152 190 150 198" class="pm-halo" style="stroke-width:7"/>`:"")+
  `<ellipse cx="114" cy="101" rx="4.5" ry="3.2" style="fill:${RC.nerve};stroke:${RC.nerveD};stroke-width:.8"/><ellipse cx="158" cy="147" rx="3.4" ry="2.6" style="fill:${RC.nerve};stroke:${RC.nerveD};stroke-width:.8"/>`+
  fl("M158 147 L168 158 M170 158 C172 176 180 196 194 206 M166 158 C160 176 152 190 150 198",RC.nerve,1.6)+
  vs("M156 102 C154 82 150 68 140 58 C128 50 108 50 92 56",12,"#5D73BB","#33447E",on("ap"))+vs("M140 58 C150 52 160 51 168 56",9,"#5D73BB","#33447E",on("ap"))+
  art("M182 98 C180 70 178 52 192 40 C206 30 236 30 248 44 C256 54 256 70 254 92",15,on("aorte"))+
  art("M199 36 L197 15 M214 31 L214 11 M230 33 L234 13",5,on("aorte"))+
  (lb?LB(4,32,"Veine cave\nsupérieure",on("veines"),"start",110,40)+LB(4,72,"Artère\npulmonaire",on("ap"),"start",98,57)+LB(4,118,"Oreillette\ndroite",on("od"),"start",108,124)+LB(4,182,"Ventricule\ndroit",on("vd"),"start",124,174)+
   LB(316,20,"Aorte",on("aorte"),"end",248,40)+LB(316,98,"Oreillette\ngauche",on("og"),"end",222,108)+LB(316,150,"Ventricule\ngauche",on("vg"),"end",220,164)+
   (on("coronaires")?LB(316,206,"Coronaires",1,"end",238,176):"")+(on("pericarde")?LB(4,224,"Péricarde",1,"start",96,196):"")+(on("conduction")?LB(4,146,"Nœud sinusal\net faisceau de His",1,"start",113,104):"")+
   (on("valves")?LB(160,229,"Valves",1,"middle",194,131):"")+(on("myocarde")&&!on("valves")?LB(160,229,"Myocarde",1,"middle",228,186):""):""),"Schéma du cœur en coupe");});

/* ================= L'APPAREIL RESPIRATOIRE ================= */
PMR("poumons",{larynx:[160,20],trachee:[160,52],bronches:[188,96],poumons:[104,152],alveoles:[268,176],plevre:[78,112],diaphragme:[160,210],vaisseaux:[136,114]},(on,lb)=>{
 const RL="M140 66 C120 66 98 88 86 124 C76 154 74 184 78 204 C92 213 118 214 141 206 C147 190 149 150 147 112 C147 90 147 74 140 66 Z",
  LL="M180 66 C200 66 222 88 234 124 C244 154 246 184 242 204 C228 213 206 214 196 207 C194 197 196 187 190 179 C182 171 178 161 180 151 C181 120 175 82 180 66 Z";
 const pl=d=>`<path d="${d}" style="fill:none;stroke:#8FA9BE;stroke-width:1.2;stroke-dasharray:4 3" transform="translate(${d===RL?110:210} 140) scale(1.06) translate(${d===RL?-110:-210} -140)"/>`;
 const rings=[34,39,44,49,54,59,64,69,74].map(y=>`M154 ${y} H166`).join(" ");
 return sv(226,
  pl(RL)+pl(LL)+(on("plevre")?`<path d="${RL}" class="pm-halo" style="stroke-width:7" transform="translate(110 140) scale(1.06) translate(-110 -140)"/><path d="${LL}" class="pm-halo" style="stroke-width:7" transform="translate(210 140) scale(1.06) translate(-210 -140)"/>`:"")+
  og(RL,"lung",on("poumons"),{s:"#A85A54"})+og(LL,"lung",on("poumons"),{s:"#A85A54"})+
  fl("M146 128 C126 126 106 124 88 121 M143 92 C122 130 106 170 98 207 M182 90 C204 128 222 168 232 207","#A9605A",1.1)+
  fl("M96 150 q6 -3 10 2 M112 178 q6 -4 12 0 M120 100 q5 -3 9 1 M210 150 q6 -3 10 2 M218 112 q5 -3 9 1 M206 186 q6 -4 12 0","#C27A72",.8)+
  vs("M160 96 C150 100 142 104 132 108 M132 108 C120 112 108 120 98 132 M132 108 C126 120 120 136 116 156",3.4,"#5D73BB","#33447E",on("vaisseaux"))+
  vs("M160 96 C170 100 178 104 188 108 M188 108 C200 112 212 120 222 132 M188 108 C194 120 200 136 204 156",3.4,"#5D73BB","#33447E",on("vaisseaux"))+
  vs("M160 104 C150 112 142 118 134 122 M160 104 C170 112 178 118 186 122",2.6,"#D9574A","#9C2A20",on("vaisseaux"))+
  vs("M160 80 C150 86 141 92 133 100 L120 112 L104 128 M133 100 L128 118 L120 146 M120 112 L110 160 M104 128 L94 150 M160 80 C172 86 183 92 192 98 L204 112 L218 128 M192 98 L196 120 L202 148 M204 112 L212 158 M218 128 L228 150",4.2,"#EFE6DA","#9E8E78",on("bronches"))+
  og("M151 33 H169 V78 C169 82 151 82 151 78 Z","cart",on("trachee"),{s:"#7E9AA8"})+fl(rings,"#8EA7B4",1.1)+
  og("M149 11 L171 11 L174 22 L167 31 L153 31 L146 22 Z","cart",on("larynx"),{s:"#7E9AA8"})+fl("M160 12 L160 30 M150 20 L170 20","#8EA7B4",.9)+
  og("M64 214 C92 192 132 196 160 203 C188 196 228 192 256 214 L256 222 C228 205 190 209 160 214 C130 209 92 205 64 222 Z","muscle",on("diaphragme"),{s:"#7C2B23"})+
  `<path d="M226 168 L250 172" class="pm-lead"/><circle cx="268" cy="176" r="21" style="fill:var(--surface);stroke:#B9C7D2;stroke-width:1.2"/>`+
  [[260,170],[270,166],[279,173],[264,181],[275,183],[268,175]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5.6" style="fill:url(#rg-lung);stroke:#A85A54;stroke-width:.8"/>`).join("")+
  fl("M252 190 C262 180 272 186 284 178 M254 162 C262 170 276 160 284 166",RC.art,1.2)+(on("alveoles")?`<circle cx="268" cy="176" r="21" class="pm-hl"/>`:"")+
  (lb?LB(316,18,"Larynx",on("larynx"),"end",172,20)+LB(316,48,"Trachée",on("trachee"),"end",168,52)+LB(316,92,"Bronches",on("bronches"),"end",196,98)+LB(316,128,"Poumon\ngauche",on("poumons"),"end",232,132)+
   LB(4,142,"Poumon\ndroit",on("poumons"),"start",96,148)+LB(296,214,"Alvéoles",on("alveoles"),"end")+LB(160,224,"Diaphragme",on("diaphragme"),"middle")+
   (on("plevre")?LB(4,96,"Plèvre",1,"start",80,106):"")+(on("vaisseaux")?LB(4,186,"Vaisseaux\npulmonaires",1,"start",116,156):""):""),"Schéma de l'appareil respiratoire");});

/* ================= LES VAISSEAUX DE LA JAMBE (vue médiale, pied vers la droite) ================= */
PMR("jambe",{aorte:[161,8],arteres:[166,66],veinesp:[150,110],veiness:[189,82],mollet:[142,156],pied:[208,214]},(on,lb)=>{
 const LEG="M112 26 L200 26 C203 48 200 78 192 104 C194 110 198 114 196 120 C193 126 189 132 188 140 C186 156 183 176 179 194 C186 200 202 206 216 211 C226 214 232 217 231 222 C230 226 226 227 220 227 L160 227 C150 227 142 224 140 216 C139 210 141 206 143 202 C146 196 148 190 147 184 C140 174 131 160 130 144 C130 132 135 124 136 118 C132 106 126 88 122 70 C119 56 113 40 112 26 Z",
  CALF="M140 120 C131 134 131 160 141 178 C148 186 157 182 158 168 C159 148 153 130 140 120 Z",
  FOOT="M179 194 C186 200 202 206 216 211 C226 214 232 217 231 222 C230 226 226 227 220 227 L160 227 C150 227 142 224 140 216 C139 210 141 206 143 202 C156 204 168 202 179 194 Z";
 return sv(230,
  og(LEG,"skin",false,{s:"#B98868"})+og(CALF,"muscle",on("mollet"),{s:"#7C2B23",op:.8})+fl("M148 126 C152 146 152 166 148 180","#8E3A30",.8)+og(FOOT,"skin",on("pied"),{s:"#B98868"})+
  `<ellipse cx="192" cy="118" rx="5" ry="6.5" style="fill:url(#rg-bone);opacity:.7;stroke:#B8A27C;stroke-width:.7"/>`+fl("M222 216 l2 6 M216 214 l2 7 M210 212 l2 8 M152 212 C160 216 170 216 178 212","#B98868",.8)+
  vein("M165 24 C163 50 159 80 151 108 C147 124 147 146 149 168 C151 186 153 198 159 208 C165 214 178 216 192 218",3.6,on("veinesp"))+
  art("M170 24 C168 50 164 80 156 108 C152 124 152 146 154 168 C156 186 158 198 164 208 C170 214 184 216 200 218",3.4,on("arteres"))+
  art("M156 112 C168 126 176 146 178 168 C179 184 182 196 192 204 C200 208 210 210 216 212",2.4,on("arteres"))+
  vs("M182 26 C188 50 190 80 186 102 C182 116 172 126 168 138 C164 158 166 178 174 192 C176 196 178 200 180 206",2.6,"#6E86C8","#3E539A",on("veiness"))+
  fl("M188 66 l6 -3 M185 106 l6 -1 M168 150 l-6 1 M171 176 l-6 3",RC.vein,1.1)+
  `<rect x="96" y="20" width="124" height="22" style="fill:url(#lg-fade)"/>`+
  art("M161 0 V15",10,on("aorte"))+art("M161 15 C152 20 142 24 130 27 M161 15 C166 19 169 22 170 26",6,on("aorte"))+
  (lb?LB(4,10,"Aorte\nabdominale",on("aorte"),"start",158,8)+LB(4,70,"Artère\nfémorale",on("arteres"),"start",166,64)+LB(4,114,"Veines\nprofondes",on("veinesp"),"start",150,110)+
   LB(316,76,"Veine grande\nsaphène",on("veiness"),"end",190,82)+LB(4,168,"Mollet\n(muscles)",on("mollet"),"start",140,160)+LB(316,214,"Pied",on("pied"),"end",210,214):""),"Schéma des vaisseaux de la jambe");});

/* ================= LE SYSTÈME NERVEUX CENTRAL ================= */
PMR("cerveau",{frontal:[100,86],parietal:[196,64],temporal:[140,140],occipital:[232,106],cervelet:[220,166],tronc:[180,176],meninges:[150,30],ventricules:[160,100],vaisseaux:[116,124],moelle:[181,222],nerfs:[222,214]},(on,lb)=>{
 const CB="M70 128 C56 104 66 70 96 54 C126 38 168 34 200 46 C230 58 250 84 248 112 C246 130 236 140 222 144 C210 148 198 146 190 150 C176 162 150 166 128 160 C112 156 100 150 92 146 C82 142 74 138 70 128 Z";
 const FR="M70 128 C56 104 66 70 96 54 C122 40 150 36 170 40 C164 64 160 88 150 112 C132 110 112 114 98 120 C88 124 78 128 70 128 Z",
  PA="M170 40 C186 40 204 48 220 60 C222 72 224 86 228 96 C210 100 190 112 176 118 C166 116 158 114 150 112 C160 88 164 64 170 40 Z",
  OC="M220 60 C236 74 248 92 248 112 C246 130 236 140 222 144 C212 146 202 146 196 146 C192 136 186 126 176 118 C190 112 210 100 228 96 C224 86 222 72 220 60 Z",
  TE="M98 120 C112 114 132 110 150 112 C164 114 178 118 186 126 C192 134 194 142 190 150 C176 162 150 166 128 160 C112 156 100 150 92 146 C82 142 76 136 74 130 C82 126 90 123 98 120 Z";
 const CE="M188 152 C194 140 222 138 238 146 C252 154 252 172 236 180 C218 188 196 182 188 170 Z";
 const gy=fl("M84 92 C96 84 104 90 112 82 M78 110 C92 104 100 112 116 102 M104 66 C112 76 122 70 130 78 M132 52 C134 66 144 70 140 84 M120 92 C128 98 138 92 146 98 M150 52 C154 64 150 78 158 88 M184 52 C186 66 196 70 198 84 M200 60 C206 72 214 70 216 82 M190 92 C200 98 210 94 214 102 M234 90 C230 100 236 108 232 118 M212 120 C220 126 230 122 236 130 M110 132 C122 128 134 136 148 130 M120 146 C134 142 146 150 160 146 M156 124 C164 130 172 126 180 134 M90 76 C98 70 104 74 110 68 M112 58 C118 64 124 60 128 66 M98 100 C106 96 114 100 122 94 M134 102 C142 106 150 100 156 106 M160 70 C166 76 162 84 168 90 M176 64 C180 74 176 82 182 90 M206 82 C214 86 220 82 226 88 M222 108 C228 112 234 108 240 114 M200 104 C206 110 214 106 218 114 M180 106 C186 100 194 102 200 96 M100 140 C108 136 114 140 120 136 M168 140 C176 136 182 142 188 138","#B9857A",1);
 return sv(236,
  `<path d="${CB}" transform="translate(160 110) scale(1.05) translate(-160 -110)" style="fill:url(#rg-dura);fill-opacity:.55;stroke:#9C8CB4;stroke-width:1;stroke-dasharray:4 3"/>`+(on("meninges")?`<path d="${CB}" class="pm-halo" style="stroke-width:7" transform="translate(160 110) scale(1.05) translate(-160 -110)"/>`:"")+
  og(CE,"brain",on("cervelet"),{s:"#9A6E66"})+fl("M196 150 C214 146 232 150 244 158 M192 160 C212 156 232 160 246 168 M196 170 C214 168 230 172 240 176","#B9857A",.9)+
  og("M170 150 C168 166 170 184 173 200 L187 202 C187 186 185 170 188 154 Z","brain",on("tronc"),{s:"#9A6E66"})+fl("M171 160 C164 168 166 178 172 182","#9A6E66",.9)+
  vs("M180 200 L181 234",12,"#F4E7CF","#B59F7A",on("moelle"))+
  nerf("M181 208 C198 211 216 213 236 219 M180 222 C164 225 148 229 132 233",2.2,on("nerfs"))+
  og(FR,"brain",on("frontal"),{s:"#9A6E66"})+og(PA,"brain",on("parietal"),{s:"#9A6E66"})+og(OC,"brain",on("occipital"),{s:"#9A6E66"})+og(TE,"brain",on("temporal"),{s:"#9A6E66"})+gy+
  fl("M170 40 C164 64 160 88 150 112 M98 120 C116 113 138 110 158 113 C172 116 182 120 190 128 M220 60 C222 74 224 86 228 96","#8A5A52",1.6)+
  `<path d="M118 100 C130 88 160 86 186 96 C196 100 200 110 196 118 C186 112 176 108 166 110 C150 112 136 112 124 108 Z M150 112 C146 124 140 132 132 136" style="fill:#9FC3E6;fill-opacity:.5;stroke:#5C88B6;stroke-width:1;stroke-opacity:.8"/>`+(on("ventricules")?`<path d="M118 100 C130 88 160 86 186 96 C196 100 200 110 196 118 C186 112 176 108 166 110 C150 112 136 112 124 108 Z" class="pm-hl"/>`:"")+
  art("M108 128 C116 122 126 120 136 118 M122 121 C126 108 132 98 140 90 M136 118 C148 110 160 104 172 102 M128 120 C126 132 124 142 126 150",1.8,on("vaisseaux"))+
  (lb?LB(4,74,"Lobe\nfrontal",on("frontal"),"start",88,86)+LB(4,154,"Lobe\ntemporal",on("temporal"),"start",112,146)+LB(4,206,"Tronc\ncérébral",on("tronc"),"start",172,188)+
   LB(316,40,"Lobe\npariétal",on("parietal"),"end",204,60)+LB(316,98,"Lobe\noccipital",on("occipital"),"end",240,108)+LB(316,166,"Cervelet",on("cervelet"),"end",244,166)+LB(316,228,"Moelle épinière",on("moelle"),"end",187,228)+
   (on("meninges")?LB(160,10,"Méninges",1,"middle",160,36):"")+(on("ventricules")?LB(4,108,"Ventricules",1,"start",124,104):"")+(on("vaisseaux")?LB(4,128,"Artères",1,"start",108,128):"")+(on("nerfs")?LB(316,200,"Nerfs",1,"end",232,216):""):""),"Schéma du cerveau vu de profil");});

/* ================= L'APPAREIL DIGESTIF ================= */
PMR("digestif",{oesophage:[166,34],foie:[108,80],vesicule:[132,106],estomac:[208,92],pancreas:[184,124],grele:[160,168],colon:[236,168],appendice:[104,214],rectum:[166,224],peritoine:[244,206]},(on,lb)=>{
 const LIV="M76 70 C86 52 130 50 168 58 C186 62 194 70 186 78 C170 86 156 92 136 100 C118 106 100 112 86 108 C74 104 70 86 76 70 Z",
  STO="M168 60 C172 56 176 56 178 62 C182 70 192 70 208 66 C232 62 248 78 244 100 C240 118 224 126 204 124 C190 122 182 116 176 110 C186 104 192 96 190 86 C188 76 178 72 170 72 Z",
  PAN="M150 122 C164 116 190 118 214 114 C226 112 234 116 232 122 C228 128 214 128 200 130 C184 132 166 134 154 132 C146 130 144 126 150 122 Z",
  GB="M124 100 C126 92 136 90 140 96 C144 104 138 114 130 114 C124 112 122 106 124 100 Z",
  COL="M98 202 C92 186 92 164 96 148 C98 138 106 134 116 134 L214 132 C230 132 240 138 242 152 C244 170 242 190 236 206 C232 214 222 216 212 214 L188 214 C182 214 178 218 176 222",
  COLb="M98 202 C92 186 92 164 96 148 C98 138 106 134 116 134 L214 132 C230 132 240 138 242 152 C244 170 242 190 236 206 C232 214 222 216 212 214 L188 214";
 const sm="M118 148 C132 140 160 142 186 140 C202 140 214 146 214 160 C216 176 214 190 206 200 C196 208 176 208 160 206 C140 206 122 204 116 194 C110 182 110 160 118 148 Z";
 return sv(240,
  `<path d="M84 46 C64 70 62 150 72 206 C80 226 120 232 160 232 C200 232 244 226 252 206 C262 150 258 70 238 46 Z" style="fill:#F6E8D8;fill-opacity:.45;stroke:#C9AE8C;stroke-width:1;stroke-dasharray:4 3"/>`+(on("peritoine")?`<path d="M84 46 C64 70 62 150 72 206 C80 226 120 232 160 232 C200 232 244 226 252 206 C262 150 258 70 238 46 Z" class="pm-halo" style="stroke-width:6;fill:none"/>`:"")+
  vs("M168 6 C168 24 168 44 170 62",8,"#E5A592","#A5634F",on("oesophage"))+
  og(sm,"intest",on("grele"),{s:"#B57A66"})+fl("M122 156 C130 148 140 160 150 152 C160 144 170 158 180 150 C190 142 202 152 208 160 M120 170 C128 162 138 174 148 166 C158 158 168 172 178 164 C188 156 200 166 210 172 M120 184 C128 176 138 188 148 180 C158 172 168 186 178 178 C188 170 200 180 210 186 M126 198 C134 190 144 202 154 194 C164 186 174 200 184 192 C192 186 200 192 204 198","#B97A64",1.6)+fl("M122 154 C130 146 140 158 150 150 C160 142 170 156 180 148 C190 140 202 150 208 158 M120 168 C128 160 138 172 148 164 C158 156 168 170 178 162 C188 154 200 164 210 170 M120 182 C128 174 138 186 148 178 C158 170 168 184 178 176 C188 168 200 178 210 184","#FFF4EE",.9,";opacity:.6")+
  vs(COLb,13,"#E2B195","#A97559",on("colon"))+fl("M100 170 h10 M100 156 h10 M130 128 v10 M160 127 v10 M190 127 v10 M228 150 h10 M232 176 h10 M228 198 h10","#B98066",.9)+
  vs("M176 214 C172 222 168 228 166 236",10,"#D99A80","#9B5E46",on("rectum"))+
  vs("M98 202 C98 210 102 216 108 220",4,"#E2B195","#A97559",on("appendice"))+
  og(PAN,"pancreas",on("pancreas"),{s:"#B58848"})+og(STO,"stomach",on("estomac"),{s:"#B06F5C"})+fl("M196 82 C208 92 224 94 236 90 M192 100 C206 108 222 110 236 104","#C3826E",.8)+
  og(LIV,"liver",on("foie"),{s:"#5A2019"})+fl("M140 62 C138 76 136 90 132 100","#7A3226",.9)+og(GB,"gall",on("vesicule"),{s:"#4E6E33"})+vs("M134 112 C140 116 146 118 152 122",2.2,"#8DB06A","#4E6E33",on("vesicule"))+
  (lb?LB(316,20,"Œsophage",on("oesophage"),"end",169,30)+LB(4,62,"Foie",on("foie"),"start",86,72)+LB(4,112,"Vésicule\nbiliaire",on("vesicule"),"start",126,106)+LB(316,64,"Estomac",on("estomac"),"end",232,74)+
   LB(316,118,"Pancréas",on("pancreas"),"end",226,120)+LB(4,168,"Intestin\ngrêle",on("grele"),"start",118,160)+LB(316,160,"Côlon",on("colon"),"end",242,164)+LB(4,214,"Appendice",on("appendice"),"start",104,216)+
   LB(316,234,"Rectum",on("rectum"),"end",170,230)+(on("peritoine")?LB(316,200,"Péritoine",1,"end",254,196):""):""),"Schéma de l'appareil digestif");});

/* ================= L'APPAREIL URINAIRE ================= */
PMR("rein",{reins:[80,92],surrenales:[90,46],ureteres:[126,150],vessie:[160,180],uretre:[160,229],prostate:[174,212],vaisseaux:[160,36]},(on,lb)=>{
 const K="M78 54 C60 58 54 86 58 106 C62 126 80 136 96 130 C106 126 108 116 104 106 C100 98 100 90 106 82 C110 72 104 56 92 52 C88 51 82 52 78 54 Z",
  KIN="M70 72 C66 86 66 104 72 116 M86 64 C80 80 80 102 86 120",PEL="M104 92 C96 90 90 96 92 104 C94 110 100 112 106 110",AD="M70 56 C74 44 88 40 96 48 C100 52 98 56 92 56 C86 56 78 58 70 56 Z";
 const side=(m)=>`<g${m?' transform="translate(320 0) scale(-1 1)"':""}>`+og(K,"kidney",on("reins"),{s:"#5A1F19"})+fl(KIN,"#E9A79C",1.1)+`<path d="${PEL}" style="fill:#F3DCC6;stroke:#B98B6E;stroke-width:.8"/>`+og(AD,"pancreas",on("surrenales"),{s:"#A97C3E"})+
  vs("M100 106 C112 132 128 160 146 180",3,"#F0D2B6","#B48B68",on("ureteres"))+`</g>`;
 return sv(232,
  vein("M150 16 V150",11,on("vaisseaux"))+art("M170 14 V150",11,on("vaisseaux"))+art("M170 92 C150 90 126 90 106 92 M170 92 C190 90 204 90 214 92",3.4,on("vaisseaux"))+vein("M150 100 C134 100 120 100 106 100 M150 100 C176 100 196 100 214 100",3.4,on("vaisseaux"))+
  side(0)+side(1)+
  og("M124 170 C122 148 198 148 196 170 C198 194 182 208 160 208 C138 208 122 194 124 170 Z","bladder",on("vessie"),{s:"#A97B57"})+fl("M134 168 C148 160 172 160 186 168 M132 182 C148 176 172 176 188 182","#C79A78",.8)+
  vs("M160 204 L160 232",4,"#F0C9B0","#B48B68",on("uretre"))+
  og("M146 206 C146 198 174 198 174 206 C176 216 168 222 160 222 C152 222 144 216 146 206 Z","pancreas",on("prostate"),{s:"#A97C3E",op:.92})+vs("M160 206 L160 222",3,"#F0C9B0","#B48B68",false)+
  (lb?LB(4,36,"Glande\nsurrénale",on("surrenales"),"start",86,48)+LB(4,88,"Rein",on("reins"),"start",64,90)+LB(4,154,"Uretère",on("ureteres"),"start",124,152)+LB(4,214,"Prostate\n(homme)",on("prostate"),"start",150,212)+
   LB(316,24,"Veine cave\net aorte",on("vaisseaux"),"end",171,30)+LB(316,88,"Rein",on("reins"),"end",258,90)+LB(316,178,"Vessie",on("vessie"),"end",194,178)+LB(316,226,"Urètre",on("uretre"),"end",162,228):""),"Schéma de l'appareil urinaire");});

/* ================= LES GLANDES ENDOCRINES ================= */
PMR("glandes",{hypophyse:[160,42],thyroide:[151,66],parathyroides:[172,72],surrenales:[132,113],pancreas:[178,150],gonades:[136,206]},(on,lb)=>{
 const BODY="M160 8 C174 8 184 20 184 34 C184 46 178 54 170 57 L171 66 C186 70 204 72 214 80 C222 88 224 104 224 124 L222 236 L98 236 L96 124 C96 104 98 88 106 80 C116 72 134 70 149 66 L150 57 C142 54 136 46 136 34 C136 20 146 8 160 8 Z";
 return sv(236,
  og(BODY,"skin",false,{s:"#C29274",op:.55})+
  `<path d="M142 30 C142 16 178 16 178 30 C178 40 170 44 160 44 C150 44 142 40 142 30 Z" style="fill:url(#rg-brain);opacity:.85;stroke:#9A6E66;stroke-width:.7"/>`+fl("M148 24 C154 20 160 26 166 22 M150 32 C156 28 164 34 172 30","#B9857A",.7)+
  fl("M160 38 L160 42",RC.fine,1.2)+og("M156.5 42.5 a3.5 3 0 1 0 7 0 a3.5 3 0 1 0 -7 0 Z","gland",on("hypophyse"),{s:"#7E2F28"})+
  vs("M160 56 V96",6,"#E7EEF2","#93AAB6",false)+
  og("M150 60 C146 62 146 72 152 74 C156 74 158 70 160 68 C162 70 164 74 168 74 C174 72 174 62 170 60 C166 60 162 64 160 66 C158 64 154 60 150 60 Z","thyroid",on("thyroide"),{s:"#6E241E"})+
  [[151,62],[151,71],[169,62],[169,71]].map(([x,y])=>og(`M${x-2.4} ${y} a2.4 2 0 1 0 4.8 0 a2.4 2 0 1 0 -4.8 0 Z`,"pancreas",on("parathyroides"),{s:"#9C7032"})).join("")+
  `<path d="M120 118 C112 120 110 134 114 144 C118 154 128 154 132 148 C134 142 130 136 134 128 C136 120 128 116 120 118 Z M200 118 C208 120 210 134 206 144 C202 154 192 154 188 148 C186 142 190 136 186 128 C184 120 192 116 200 118 Z" style="fill:url(#rg-kidney);opacity:.55;stroke:#7C2C24;stroke-width:.7"/>`+
  og("M116 118 C120 108 132 106 136 114 C134 118 126 118 116 118 Z","pancreas",on("surrenales"),{s:"#9C7032"})+og("M204 118 C200 108 188 106 184 114 C186 118 194 118 204 118 Z","pancreas",on("surrenales"),{s:"#9C7032"})+
  og("M136 152 C140 144 156 146 172 144 C184 142 196 140 202 146 C204 152 194 154 182 156 C168 158 152 162 142 160 C136 158 134 156 136 152 Z","pancreas",on("pancreas"),{s:"#A97C3E"})+
  [[152,153],[166,150],[180,149],[192,147]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.6" style="fill:#C9665E"/>`).join("")+
  `<path d="M150 196 C150 186 170 186 170 196 C172 208 166 216 160 216 C154 216 148 208 150 196 Z" style="fill:url(#rg-uterus);opacity:.7;stroke:#A05A52;stroke-width:.7"/>`+fl("M150 194 C142 190 134 196 132 202 M170 194 C178 190 186 196 188 202","#C98A80",1.6)+
  og("M128 206 a8 5.5 0 1 0 16 0 a8 5.5 0 1 0 -16 0 Z","ovary",on("gonades"),{s:"#A97B60"})+og("M176 206 a8 5.5 0 1 0 16 0 a8 5.5 0 1 0 -16 0 Z","ovary",on("gonades"),{s:"#A97B60"})+
  (lb?LB(4,38,"Hypophyse",on("hypophyse"),"start",157,42)+LB(4,72,"Thyroïde",on("thyroide"),"start",149,68)+LB(316,64,"Parathyroïdes",on("parathyroides"),"end",171,70)+
   LB(4,118,"Glandes\nsurrénales",on("surrenales"),"start",124,114)+LB(316,144,"Pancréas",on("pancreas"),"end",198,146)+LB(4,210,"Ovaires\nou testicules",on("gonades"),"start",130,206):""),"Schéma des glandes endocrines");});

/* ================= LE SQUELETTE ================= */
PMR("squelette",{rachis:[160,88],epaule:[122,54],poignet:[100,142],mains:[220,168],bassin:[171,140],hanche:[136,160],genou:[178,198],pied:[134,234]},(on,lb)=>{
 const B="#B8A27C",bone=(d,w,o)=>vs(d,w,"#F4EAD3",B,o),ribs=[0,1,2,3,4,5,6,7].map(i=>{const y=60+i*6.5,dx=i<4?0:(i-3)*1.5;return `M158 ${y} C${140+dx} ${y-4} ${122+dx} ${y+6} ${126+dx} ${y+16} M162 ${y} C${180-dx} ${y-4} ${198-dx} ${y+6} ${194-dx} ${y+16}`;}).join(" ");
 const half=m=>`<g${m?' transform="translate(320 0) scale(-1 1)"':""}>`+
  bone("M160 50 C148 48 136 50 124 52",3.4,on("epaule"))+og("M118 54 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0 Z","bone",on("epaule"),{s:B})+
  bone("M122 58 C118 74 114 90 110 104",5.2,false)+bone("M110 106 C106 118 102 130 100 140 M113 106 C110 118 106 130 104 140",2.6,false)+
  og("M96 140 C96 136 108 136 108 140 L108 147 C108 150 96 150 96 147 Z","bone",on("poignet"),{s:B})+
  fl("M98 148 L94 162 L92 172 M101 149 L99 164 L98 176 M104 149 L104 165 L104 177 M107 148 L109 163 L110 173 M96 146 L90 154 L87 160",B,2.3)+fl("M98 148 L94 162 L92 172 M101 149 L99 164 L98 176 M104 149 L104 165 L104 177 M107 148 L109 163 L110 173 M96 146 L90 154 L87 160","#F7EEDB",1.3)+
  (on("mains")&&m?`<path d="M86 144 L112 144 L114 180 L84 180 Z" class="pm-hl" style="fill-opacity:.8"/>`:"")+
  og("M160 128 C146 124 128 126 122 138 C118 150 128 160 140 162 C148 164 154 158 160 156 Z","bone",on("bassin"),{s:B})+fl("M150 134 C144 138 140 146 142 152",B,1)+
  og("M130 160 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0 Z","bone",on("hanche"),{s:B})+
  bone("M138 164 C140 176 141 186 142 194",6,false)+og("M137 199 a5 4.5 0 1 0 10 0 a5 4.5 0 1 0 -10 0 Z","bone",on("genou"),{s:B})+
  bone("M141 204 C141 212 140 220 139 226 M146 204 C146 212 146 220 145 226",3,false)+
  og("M132 228 C132 224 150 224 150 228 L152 236 C152 239 130 239 130 236 Z","bone",on("pied"),{s:B})+`</g>`;
 return sv(240,
  bone(ribs,3,false)+og("M156 56 L164 56 L163 100 L157 100 Z","bone",false,{s:B})+
  [42,49,56,63,70,77,84,91,98,105,112,119].map(y=>og(`M155 ${y} h10 a1.5 1.5 0 0 1 1.5 1.5 v3 a1.5 1.5 0 0 1 -1.5 1.5 h-10 a1.5 1.5 0 0 1 -1.5 -1.5 v-3 a1.5 1.5 0 0 1 1.5 -1.5 Z`,"bone",on("rachis"),{s:B})).join("")+
  half(0)+half(1)+og("M154 128 L166 128 L164 152 L160 158 L156 152 Z","bone",on("rachis"),{s:B})+
  og("M148 8 C150 4 170 4 172 8 C180 12 182 24 178 32 L172 38 L148 38 L142 32 C138 24 140 12 148 8 Z","bone",false,{s:B})+
  `<ellipse cx="154" cy="21" rx="4" ry="3.6" style="fill:#5C4A3A"/><ellipse cx="166" cy="21" rx="4" ry="3.6" style="fill:#5C4A3A"/><path d="M158 29 L160 25 L162 29 Z" style="fill:#5C4A3A"/>`+fl("M150 36 C154 42 166 42 170 36 M152 38 v3 M156 39 v3 M160 39 v3 M164 39 v3 M168 38 v3",B,.9)+
  (lb?LB(316,82,"Colonne\nvertébrale",on("rachis"),"end",166,88)+LB(4,46,"Épaule",on("epaule"),"start",120,54)+LB(4,140,"Poignet",on("poignet"),"start",98,142)+LB(316,168,"Mains\net doigts",on("mains"),"end",222,166)+
   LB(316,128,"Bassin",on("bassin"),"end",176,138)+LB(4,166,"Hanche",on("hanche"),"start",134,160)+LB(316,206,"Genou",on("genou"),"end",180,199)+LB(4,220,"Pied\n(gros orteil)",on("pied"),"start",132,232):""),"Schéma du squelette");});

/* ================= LE SANG ET SES USINES ================= */
PMR("sang",{moelle:[68,120],gr:[150,92],gb:[132,146],plaquettes:[188,142],coag:[218,168],ganglions:[276,62],rate:[278,178]},(on,lb)=>{
 const RBC=(x,y,r)=>`<g transform="translate(${x} ${y}) rotate(${r})"><ellipse rx="9" ry="6" style="fill:url(#rg-blood);stroke:#8E1F17;stroke-width:.7"/><ellipse rx="4.4" ry="2.6" style="fill:#F07C70;opacity:.7"/></g>`;
 const LYN="M0 0 C6 -8 22 -8 26 0 C28 6 22 10 16 8 C12 7 10 10 6 10 C0 10 -2 4 0 0 Z";
 return sv(232,
  og("M50 24 C40 24 36 34 42 42 L46 52 L46 190 L42 200 C36 208 40 218 50 218 C58 218 62 214 64 208 C70 214 78 218 86 218 C96 218 100 208 94 200 L90 190 L90 52 L94 42 C100 34 96 24 86 24 C78 24 70 28 68 34 C64 28 58 24 50 24 Z","bone",false,{s:"#A8916C"})+
  og("M54 46 L82 46 L82 196 L54 196 Z","blood",on("moelle"),{s:"#7E1E18"})+[[60,56],[72,62],[64,74],[76,84],[60,96],[72,108],[64,124],[76,136],[60,150],[72,162],[64,176],[76,188]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3" style="fill:#F2C9B8;opacity:.75"/>`).join("")+
  `<path d="M108 66 C160 60 200 60 244 66 L244 172 C200 178 160 178 108 172 Z" style="fill:#FCEBCB"/>`+
  vs("M108 64 C160 58 200 58 244 64",5,"#E7A596","#A9584C",false)+vs("M108 174 C160 180 196 180 206 179 M226 178 C234 177 240 176 244 175",5,"#E7A596","#A9584C",false)+
  [[126,84,10],[146,96,-20],[170,82,30],[192,100,0],[220,86,-30],[132,118,60],[160,120,-10],[204,124,20],[228,112,40],[176,150,-40],[120,160,10]].map(a=>RBC(...a)).join("")+
  (on("gr")?`<path d="M112 72 L240 72 L240 132 L112 132 Z" class="pm-hl" style="fill-opacity:.55"/>`:"")+
  `<circle cx="132" cy="146" r="11" style="fill:#F3ECF7;stroke:#8A6AA6;stroke-width:.8"/><path d="M126 144 c2 -5 7 -5 8 0 c1 4 6 4 7 0" style="fill:none;stroke:#7B4FA0;stroke-width:3;stroke-linecap:round"/><circle cx="162" cy="140" r="7" style="fill:#F3ECF7;stroke:#8A6AA6;stroke-width:.8"/><circle cx="162" cy="140" r="5" style="fill:#7B4FA0"/>`+
  (on("gb")?`<circle cx="132" cy="146" r="12" class="pm-hl"/><circle cx="162" cy="140" r="8" class="pm-hl"/>`:"")+
  [[184,138],[190,146],[196,138],[182,148],[192,132]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="2.8" ry="1.8" style="fill:#B894D0;stroke:#7A5AA0;stroke-width:.5"/>`).join("")+(on("plaquettes")?`<circle cx="189" cy="141" r="10" class="pm-hl"/>`:"")+
  fl("M206 162 L230 176 M208 172 L232 164 M212 158 L222 180 M204 168 L228 170 M216 160 L210 180","#E2C66A",1.1)+RBC(214,170,20)+RBC(224,166,-30)+[[208,176],[220,176],[228,174]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="2.6" ry="1.7" style="fill:#B894D0"/>`).join("")+(on("coag")?`<path d="M202 156 L234 156 L236 182 L200 182 Z" class="pm-hl"/>`:"")+
  fl("M250 36 C262 46 270 56 278 70 C286 84 292 96 300 108",'#B7D3A6',2.4)+
  [[252,40,20],[268,58,40],[284,84,55]].map(([x,y,r])=>`<g transform="translate(${x} ${y}) rotate(${r})">${og(LYN,"ovary",on("ganglions"),{s:"#A87F68"})}</g>`).join("")+
  og("M252 160 C262 148 290 150 298 166 C304 182 292 200 274 200 C260 200 254 190 258 180 C262 172 252 170 252 160 Z","spleen",on("rate"),{s:"#4E1F2A"})+fl("M266 168 C272 176 280 178 288 176","#C98A98",.9)+
  (lb?LB(150,24,"Globules rouges",on("gr"),"middle",150,90)+LB(4,226,"Moelle osseuse",on("moelle"),"start",68,192)+LB(128,206,"Globules\nblancs",on("gb"),"middle",130,158)+LB(182,206,"Plaquettes",on("plaquettes"),"middle",188,148)+
   LB(238,206,"Caillot",on("coag"),"middle",218,180)+LB(316,22,"Ganglions",on("ganglions"),"end",268,56)+LB(316,224,"Rate",on("rate"),"end",284,196):""),"Schéma du sang et de ses organes");});

/* ================= LA PEAU EN COUPE ================= */
PMR("peau",{epiderme:[52,40],derme:[52,94],hypoderme:[52,170],follicule:[118,96],sudoripare:[186,140],vaisseaux:[150,112]},(on,lb)=>{
 const X0=20,X1=220,EP="M20 32 C60 28 90 34 120 30 C150 26 180 32 220 28 L220 44 C214 50 206 42 198 48 C190 54 182 44 174 50 C166 56 158 46 150 52 C142 58 134 48 126 54 C118 60 110 50 102 56 C94 62 86 52 78 56 C70 62 62 52 54 58 C46 62 38 52 30 56 L20 54 Z";
 const DER="M20 54 L30 56 C38 52 46 62 54 58 C62 52 70 62 78 56 C86 52 94 62 102 56 C110 50 118 60 126 54 C134 48 142 58 150 52 C158 46 166 56 174 50 C182 44 190 54 198 48 C206 42 214 50 220 44 L220 132 L20 132 Z",
  HYP="M20 132 L220 132 L220 204 L20 204 Z";
 const fat=[[34,146],[56,142],[80,148],[104,142],[128,148],[152,142],[176,148],[200,144],[44,170],[68,168],[92,172],[116,168],[140,172],[164,168],[188,172],[210,168],[32,192],[56,194],[80,190],[104,194],[128,190],[152,194],[176,190],[200,194]];
 return sv(224,
  og(HYP,"fat",on("hypoderme"),{s:"#C9A24E"})+fat.map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="11" ry="9.5" style="fill:url(#rg-fat);stroke:#D6B25E;stroke-width:.8"/>`).join("")+
  og(DER,"mucosa",on("derme"),{s:"#B57A6E",op:.85})+fl("M30 76 C50 70 70 82 90 74 C110 66 130 80 150 72 C170 64 190 78 214 70 M28 100 C48 94 68 106 88 98 C108 90 128 104 148 96 C168 88 190 102 214 94 M30 120 C50 114 70 126 90 118 C110 110 130 124 150 116 C170 108 190 122 214 114","#E7B0A2",1)+
  art("M24 112 C70 108 120 116 216 110",2.6,on("vaisseaux"))+vein("M24 120 C70 118 120 124 216 118",2.6,on("vaisseaux"))+fl("M60 110 C58 92 66 74 64 60 M60 60 C66 74 72 92 70 118 M170 112 C168 94 176 76 174 56 M174 56 C180 76 184 94 182 118",RC.art,1)+
  vs("M196 40 C194 64 190 92 186 122",1.6,"#F1D3C4","#B58C77",false)+og(EP,"skin",on("epiderme"),{s:"#B3805F"})+`<ellipse cx="196" cy="30" rx="2" ry="1.2" style="fill:#9C6A4C"/>`+fl("M20 38 C60 34 90 40 120 36 C150 32 180 38 220 34","#D99C78",.8)+
  `<path d="M104 128 C100 110 102 86 106 62 L116 62 C120 86 122 110 118 128 C116 134 106 134 104 128 Z" style="fill:#F1D7C2;stroke:#9C7458;stroke-width:.8"/>`+vs("M110 126 C110 100 110 70 110 6",2.4,"#4A3426","#2A1C14",false)+`<ellipse cx="111" cy="126" rx="7" ry="5" style="fill:#C8977A;stroke:#7A5440;stroke-width:.8"/>`+
  og("M118 74 C126 66 140 70 140 80 C140 90 128 92 122 86 C118 84 116 78 118 74 Z","pancreas",on("follicule"),{s:"#A97C3E"})+(on("follicule")?`<path d="M104 128 C100 110 102 86 106 62 L116 62 C120 86 122 110 118 128 Z" class="pm-hl"/>`:"")+
  vs("M116 100 C126 86 136 74 146 62",1.8,"#C8574C","#8E2D25",false)+
og("M176 128 C172 120 182 114 188 120 C194 114 202 122 196 130 C202 136 194 146 186 142 C180 148 170 140 176 134 C170 132 172 128 176 128 Z","stomach",on("sudoripare"),{s:"#A86F5E"})+fl("M180 126 C184 122 190 126 188 132 C186 138 180 136 182 130","#B57A66",.9)+
  `<path d="M220 28 L234 18 L234 194 L220 204 M220 28 L234 18" style="fill:none;stroke:#C9B49C;stroke-width:.8"/><path d="M220 28 L234 18 L234 32 L220 44 Z" style="fill:#E7B694;opacity:.7"/><path d="M220 44 L234 32 L234 122 L220 132 Z" style="fill:#E9B3A6;opacity:.6"/><path d="M220 132 L234 122 L234 194 L220 204 Z" style="fill:#F2D58A;opacity:.6"/>`+
  (lb?LB(316,30,"Épiderme",on("epiderme"),"end",226,36)+LB(316,62,"Poil et glande\nsébacée",on("follicule"),"end",134,78)+LB(316,94,"Derme",on("derme"),"end",226,90)+LB(316,118,"Vaisseaux",on("vaisseaux"),"end",210,112)+
   LB(316,146,"Glande\nsudoripare",on("sudoripare"),"end",198,136)+LB(316,186,"Hypoderme\n(graisse)",on("hypoderme"),"end",226,176):""),"Coupe de la peau");});

/* ================= LE CORPS ENTIER ================= */
PMR("corps",{tete:[160,16],orl:[168,32],poumons:[139,72],coeur:[168,84],abdomen:[156,112],urinaire:[176,134],genital:[160,148],os:[130,172],articulations:[184,190],sang:[210,118],peau:[103,122]},(on,lb)=>{
 const BODY="M160 4 C171 4 177 12 177 22 C177 31 172 37 167 39 L168 46 C182 48 196 50 204 56 C211 61 212 70 213 82 L218 118 C220 132 222 142 224 152 C225 157 221 159 219 155 L214 140 C210 128 208 118 204 104 L201 90 L200 130 C201 148 198 170 194 190 C192 206 192 220 194 230 C195 236 186 238 182 236 L180 226 C178 212 176 198 174 184 L170 150 C168 146 152 146 150 150 L146 184 C144 198 142 212 140 226 L138 236 C134 238 125 236 126 230 C128 220 128 206 126 190 C122 170 119 148 120 130 L119 90 L116 104 C112 118 110 128 106 140 L101 155 C99 159 95 157 96 152 C98 142 100 132 102 118 L107 82 C108 70 109 61 116 56 C124 50 138 48 152 46 L153 39 C148 37 143 31 143 22 C143 12 149 4 160 4 Z";
 const bn=(d,w)=>vs(d,w,"#F4EAD3","#B8A27C",on("os"));
 return sv(240,
  (on("peau")?`<path d="${BODY}" class="pm-halo" style="stroke-width:7"/>`:"")+og(BODY,"skin",false,{s:"#B98868"})+
  bn("M122 62 C118 76 116 90 113 104 M113 104 C110 118 106 132 102 146 M198 62 C202 76 204 90 207 104 M207 104 C210 118 214 132 218 146 M138 152 C136 168 134 180 133 190 M133 190 C132 206 132 218 132 230 M182 152 C184 168 186 180 187 190 M187 190 C188 206 188 218 188 230",3.2)+
  art("M160 50 V140 M160 140 C152 146 146 150 140 156 C136 176 134 196 133 226 M160 140 C168 146 174 150 180 156 C184 176 186 196 187 226 M160 56 C148 58 136 60 124 64 C118 80 114 100 108 140 M160 56 C172 58 184 60 196 64 C202 80 206 100 212 140",1.6,on("sang"))+
  [[113,104],[207,104],[133,190],[187,190]].map(([x,y])=>og(`M${x-4.5} ${y} a4.5 4.5 0 1 0 9 0 a4.5 4.5 0 1 0 -9 0 Z`,"cart",on("articulations"),{s:"#7E9AA8"})).join("")+
  og("M148 17 C148 9 172 9 172 17 C172 24 166 27 160 27 C154 27 148 24 148 17 Z","brain",on("tete"),{s:"#9A6E66"})+
  vs("M163 28 C165 32 165 38 162 46",3.4,"#EFA59A","#B5655A",on("orl"))+
  og("M146 58 C134 60 128 74 130 90 C132 98 142 98 150 96 C154 84 154 66 146 58 Z","lung",on("poumons"),{s:"#A85A54"})+og("M174 58 C186 60 192 74 190 90 C188 98 178 98 170 96 C166 84 166 66 174 58 Z","lung",on("poumons"),{s:"#A85A54"})+
  og("M160 78 C162 72 172 72 174 78 C176 86 168 94 162 98 C158 92 154 86 156 80 C157 78 158 78 160 78 Z","myo",on("coeur"),{s:"#6E1F1A"})+
  `<g${on("abdomen")?' class="pm-on"':""}>`+og("M132 100 C138 94 156 96 162 100 C160 106 150 110 138 112 C132 110 130 104 132 100 Z","liver",on("abdomen"),{s:"#5A2019"})+og("M164 100 C170 96 184 98 186 106 C186 112 176 114 168 110 Z","stomach",on("abdomen"),{s:"#B06F5C"})+
  og("M138 116 C150 112 172 112 182 118 C186 128 178 136 160 136 C144 136 134 128 138 116 Z","intest",on("abdomen"),{s:"#B57A66"})+fl("M144 120 q6 -4 12 0 q6 4 12 0 q6 -4 12 0 M144 128 q6 -4 12 0 q6 4 12 0 q6 -4 12 0","#B97A64",1)+`</g>`+
  og("M150 134 C150 128 170 128 170 134 C170 142 165 144 160 144 C155 144 150 142 150 134 Z","bladder",on("urinaire"),{s:"#A97B57"})+
  og("M154 146 C154 142 166 142 166 146 C166 152 162 154 160 154 C158 154 154 152 154 146 Z","uterus",on("genital"),{s:"#A05A52"})+
  (lb?LB(4,14,"Cerveau,\nméninges",on("tete"),"start",150,16)+LB(4,40,"Nez, gorge,\noreilles",on("orl"),"start",162,34)+LB(4,74,"Poumons",on("poumons"),"start",132,74)+LB(4,112,"Appareil\ndigestif",on("abdomen"),"start",140,110)+
   LB(4,146,"Peau",on("peau"),"start",103,130)+LB(4,182,"Os",on("os"),"start",133,180)+
   LB(316,76,"Cœur",on("coeur"),"end",170,86)+LB(316,118,"Sang",on("sang"),"end",210,120)+LB(316,140,"Voies\nurinaires",on("urinaire"),"end",170,136)+LB(316,168,"Organes\ngénitaux",on("genital"),"end",165,150)+LB(316,200,"Articulations",on("articulations"),"end",191,192):""),"Schéma du corps humain");});

/* ================= L'APPAREIL GÉNITAL FÉMININ ================= */
PMR("femme",{uterus:[186,100],endometre:[160,98],col:[160,156],vagin:[160,202],trompes:[104,60],ovaires:[90,110],sein:[56,188]},(on,lb)=>{
 const UT="M160 62 C186 60 196 74 194 96 C192 116 180 132 172 140 L172 170 C172 174 148 174 148 170 L148 140 C140 132 128 116 126 96 C124 74 134 60 160 62 Z",
  CAV="M144 80 C152 78 168 78 176 80 C174 96 166 116 162 132 L158 132 C154 116 146 96 144 80 Z",
  VAG="M150 172 C148 190 146 208 146 226 L174 226 C174 208 172 190 170 172 Z";
 const tube=m=>`<g${m?' transform="translate(320 0) scale(-1 1)"':""}>`+vs("M132 78 C120 68 108 56 96 58 C84 60 78 72 80 86",4.2,"#F0B8AE","#B5675C",on("trompes"))+
  fl("M80 86 l-6 4 M80 86 l-3 7 M80 86 l2 7 M80 86 l5 5 M80 86 l-7 0","#B5675C",1.4)+vs("M100 110 C112 104 122 96 130 90",2.4,"#E8C2B0","#A97B60",false)+
  og("M76 110 a14 9 0 1 0 28 0 a14 9 0 1 0 -28 0 Z","ovary",on("ovaires"),{s:"#A97B60"})+[[84,108],[93,113],[97,106]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.6" style="fill:#FBEBD9;stroke:#C99D84;stroke-width:.6"/>`).join("")+`</g>`;
 return sv(232,
  tube(0)+tube(1)+og(VAG,"mucosa",on("vagin"),{s:"#A85E55"})+fl("M154 180 C156 196 156 212 154 224 M166 180 C164 196 164 212 166 224","#C27A70",.8)+
  og(UT,"uterus",on("uterus"),{s:"#8E4A43"})+og(CAV,"blood",on("endometre"),{s:"#8E241C",op:.85})+fl("M146 82 C152 84 168 84 174 82","#F4C2B8",1.4)+
  og("M148 140 L172 140 L172 170 C172 174 148 174 148 170 Z","uterus",on("col"),{s:"#8E4A43"})+vs("M160 132 V172",2.2,"#F6D6CF","#B97A70",false)+
  `<circle cx="56" cy="188" r="30" style="fill:var(--surface);stroke:#D6C2B4;stroke-width:1"/>`+og("M34 166 C54 160 76 172 82 188 C76 204 54 216 34 210 Z","breast",on("sein"),{s:"#B98868"})+
  fl("M42 176 C52 180 64 184 78 188 M42 200 C52 196 64 192 78 188 M46 188 H78",'#D69B84',1.2)+[[44,174],[42,188],[44,202],[54,180],[54,196]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3.4" style="fill:#F2B7A4;stroke:#C27A68;stroke-width:.6"/>`).join("")+`<circle cx="82" cy="188" r="2.6" style="fill:#B9705E"/>`+
  (lb?LB(4,46,"Trompe",on("trompes"),"start",102,60)+LB(4,124,"Ovaire",on("ovaires"),"start",84,114)+LB(316,88,"Utérus",on("uterus"),"end",190,96)+LB(316,118,"Endomètre",on("endometre"),"end",170,104)+
   LB(316,160,"Col de l'utérus",on("col"),"end",172,156)+LB(316,206,"Vagin",on("vagin"),"end",172,204)+LB(56,229,"Sein (coupe)",on("sein"),"middle"):""),"Schéma de l'appareil génital féminin");});

/* ================= LA GROSSESSE ================= */
PMR("grossesse",{uterus:[238,76],placenta:[110,58],foetus:[200,108],cordon:[136,104],liquide:[124,156],col:[165,212]},(on,lb)=>{
 const UT="M165 18 C214 18 246 58 246 110 C246 160 214 198 180 204 L180 222 C180 226 150 226 150 222 L150 204 C116 198 84 160 84 110 C84 58 116 18 165 18 Z",
  SAC="M165 30 C206 30 234 64 234 110 C234 154 206 190 165 192 C124 190 96 154 96 110 C96 64 124 30 165 30 Z",
  PL="M100 74 C106 52 126 34 152 30 C144 44 132 58 124 74 C118 86 110 94 102 96 C99 90 98 82 100 74 Z",
  FB="M162 152 C152 132 152 104 162 88 C172 74 192 66 208 72 C222 80 226 102 220 124 C216 140 204 152 190 156 C180 158 170 157 162 152 Z";
 return sv(232,
  og(UT,"uterus",on("uterus"),{s:"#8E4A43"})+og(SAC,"amnio",on("liquide"),{s:"#7FA9C8"})+
  og(PL,"placenta",on("placenta"),{s:"#5E1F1A"})+fl("M110 80 C118 70 126 58 140 42 M106 70 C114 62 122 52 132 40",'#E07A6E',.9)+
  vs("M118 72 C132 84 126 100 140 108 C150 114 146 124 158 124",4.4,"#F2E8E4","#A8948C",on("cordon"))+fl("M118 72 C132 84 126 100 140 108 C150 114 146 124 158 124",RC.art,1.4,";stroke-dasharray:3 4")+fl("M118 72 C132 84 126 100 140 108 C150 114 146 124 158 124",RC.vein,1.4,";stroke-dasharray:3 4;stroke-dashoffset:3.5")+
  og(FB,"fetus",on("foetus"),{s:"#A86F52"})+
  vs("M206 84 C190 86 172 90 160 98",13,"url(#rg-fetus)","#A86F52",false)+vs("M160 98 C166 106 176 112 188 114",10,"url(#rg-fetus)","#A86F52",false)+og("M186 114 a6 4 0 1 0 12 0 a6 4 0 1 0 -12 0 Z","fetus",false,{s:"#A86F52"})+
  vs("M182 138 C172 134 164 136 160 144 C158 150 160 156 164 158",7,"url(#rg-fetus)","#A86F52",false)+
  og("M155 170 a21 20 0 1 0 42 0 a21 20 0 1 0 -42 0 Z","fetus",on("foetus"),{s:"#A86F52"})+
  fl("M166 178 q4 3 8 0 M163 168 a1.6 1.6 0 1 0 0.1 0 M186 162 C190 160 194 164 192 168 C190 172 186 170 186 166",'#8E5A42',1)+fl("M206 92 C214 108 214 128 206 142",'#C99474',.9)+
  vs("M165 204 V224",3,"#F6D6CF","#B97A70",false)+
  (lb?LB(4,40,"Placenta",on("placenta"),"start",112,56)+LB(4,102,"Cordon\nombilical",on("cordon"),"start",130,98)+LB(4,166,"Liquide\namniotique",on("liquide"),"start",112,160)+LB(4,216,"Col de\nl'utérus",on("col"),"start",152,214)+
   LB(316,40,"Utérus",on("uterus"),"end",232,62)+LB(316,112,"Fœtus",on("foetus"),"end",220,106):""),"Schéma de la grossesse");});

/* ================= L'ŒIL EN COUPE ================= */
PMR("oeil",{cornee:[101,96],chambre:[114,108],iris:[123,82],cristallin:[136,124],vitre:[186,104],retine:[222,50],macula:[245,98],nerf:[282,121],vaisseaux:[218,160],conjonctive:[128,50],paupieres:[110,30]},(on,lb)=>{
 const C=(r)=>`M${180-r} 104 a${r} ${r} 0 1 0 ${2*r} 0 a${r} ${r} 0 1 0 ${-2*r} 0 Z`;
 return sv(204,
  vs("M244 112 C262 114 280 118 304 124",16,"#F6EAD0","#B9A27C",on("nerf"))+fl("M246 108 C264 110 282 114 304 120 M246 116 C264 118 282 122 304 128",'#D8C49C',.8)+
  og(C(66),"eyew",false,{s:"#B8AE9F",w:1.1})+`<path d="${C(60)}" style="fill:#7E3A2E"/>`+og(C(57),"mucosa",on("retine"),{s:"#C46A58"})+og(C(54),"vitre",on("vitre"),{s:"#C9D6DE"})+
  `<path d="M114 62 C130 48 150 40 170 38" style="fill:none;stroke:#F2B3A8;stroke-width:3;stroke-linecap:round"/>`+(on("conjonctive")?`<path d="M114 62 C130 48 150 40 170 38 M114 146 C130 160 150 168 170 170" class="pm-halo" style="stroke-width:8"/>`:"")+`<path d="M114 146 C130 160 150 168 170 170" style="fill:none;stroke:#F2B3A8;stroke-width:3;stroke-linecap:round"/>`+
  `<path d="M120 60 C94 76 94 132 120 148 L126 140 C122 124 122 84 126 68 Z" style="fill:#DDF0FA;stroke:#8FB8D2;stroke-width:1.4"/>`+(on("chambre")?`<path d="M120 60 C94 76 94 132 120 148 L126 140 C122 124 122 84 126 68 Z" class="pm-hl"/>`:"")+
  (on("cornee")?`<path d="M120 60 C94 76 94 132 120 148" class="pm-halo" style="stroke-width:8"/>`:"")+`<path d="M120 60 C94 76 94 132 120 148" style="fill:none;stroke:#7FAACC;stroke-width:2.4"/>`+
  og("M120 72 L127 70 L128 94 L122 95 Z","iris",on("iris"),{s:"#2E5478"})+og("M120 136 L127 138 L128 114 L122 113 Z","iris",on("iris"),{s:"#2E5478"})+
  og("M127 66 L136 72 L129 80 Z M127 142 L136 136 L129 128 Z","myo",false,{s:"#6E1F1A"})+fl("M134 76 L136 84 M134 132 L136 124","#C9B49C",.8)+
  og("M136 82 C146 86 146 122 136 126 C126 122 126 86 136 82 Z","lens",on("cristallin"),{s:"#9DB4C2"})+
  `<ellipse cx="244" cy="100" rx="3.6" ry="7" style="fill:#F2D35C;stroke:#C9A43A;stroke-width:.7"/>`+(on("macula")?`<ellipse cx="244" cy="100" rx="5" ry="9" class="pm-hl"/>`:"")+`<ellipse cx="243" cy="115" rx="3.4" ry="5.5" style="fill:#FBE9C2;stroke:#D9B886;stroke-width:.7"/>`+
  vs("M242 115 C232 90 214 62 186 52 M242 115 C232 140 214 160 190 164",1.6,RC.art,RC.artD,on("vaisseaux"))+vs("M242 117 C230 94 210 70 180 58 M242 117 C230 144 212 164 184 170",1.6,RC.vein,RC.veinD,on("vaisseaux"))+
  og("M94 40 C104 30 132 28 150 34 C142 44 128 54 112 60 C102 60 94 52 94 40 Z","skin",on("paupieres"),{s:"#B98868"})+og("M94 168 C104 178 132 180 150 174 C142 164 128 154 112 148 C102 148 94 156 94 168 Z","skin",on("paupieres"),{s:"#B98868"})+
  fl("M110 60 l-6 6 M116 58 l-4 7 M104 58 l-7 4 M110 148 l-6 -6 M116 150 l-4 -7 M104 150 l-7 -4",'#3A2A20',1.2)+
  (lb?LB(4,26,"Paupière",on("paupieres"),"start",104,38)+LB(4,52,"Conjonctive",on("conjonctive"),"start",126,52)+LB(4,84,"Cornée",on("cornee"),"start",100,88)+LB(4,110,"Chambre\nantérieure",on("chambre"),"start",112,110)+
   LB(4,150,"Iris",on("iris"),"start",124,132)+LB(4,182,"Cristallin",on("cristallin"),"start",136,124)+LB(316,26,"Rétine",on("retine"),"end",218,52)+LB(316,86,"Macula",on("macula"),"end",246,96)+
   LB(316,148,"Nerf optique",on("nerf"),"end",288,122)+LB(316,186,"Vaisseaux",on("vaisseaux"),"end",214,162)+LB(186,202,"Vitré",on("vitre"),"middle",186,140):""),"Schéma de l'œil en coupe");});

/* ================= LA SPHÈRE ORL ================= */
PMR("orl",{sinus:[100,44],nez:[108,84],bouche:[112,124],amygdales:[146,120],larynx:[152,178],tympan:[262,88],oreille_int:[244,96],oreille_ext:[298,94],mastoide:[278,126]},(on,lb)=>{
 const HEAD="M118 10 C92 12 78 32 80 52 C80 62 76 70 70 82 C66 88 70 92 78 92 L80 100 C78 106 82 110 82 114 C80 118 82 122 84 126 C82 132 84 138 88 146 C92 154 100 158 108 160 C110 172 112 196 114 232 L190 232 C188 206 190 184 196 166 C206 150 212 124 212 96 C212 48 176 10 128 10 Z";
 return sv(232,
  og(HEAD,"skin",false,{s:"#B98868"})+`<path d="M96 30 C110 14 170 12 196 36 C206 48 206 66 196 72 C170 64 130 62 104 58 C96 52 92 40 96 30 Z" style="fill:url(#rg-brain);opacity:.6"/>`+
  `<path d="M92 40 C96 34 104 34 108 40 C110 46 106 50 100 50 C94 50 90 46 92 40 Z" style="fill:#DCE7EE;stroke:#A9B9C4;stroke-width:.8"/>`+(on("sinus")?`<path d="M92 40 C96 34 104 34 108 40 C110 46 106 50 100 50 C94 50 90 46 92 40 Z M112 76 C116 70 124 70 126 76 C126 82 118 84 114 82 Z" class="pm-hl"/>`:"")+
  `<path d="M78 90 C90 72 118 64 140 70 L142 98 L84 98 Z" style="fill:#F3D7CF;stroke:#C28C80;stroke-width:.8"/>`+(on("nez")?`<path d="M78 90 C90 72 118 64 140 70 L142 98 L84 98 Z" class="pm-hl"/>`:"")+fl("M92 78 C104 74 118 74 132 78 M90 86 C104 82 120 82 136 86 M92 94 C106 90 122 90 138 94",'#D59A8C',2)+
  vs("M84 100 L136 100",3.2,"#F1E6D2","#B8A27C",false)+vs("M136 100 C142 102 148 108 150 114",4,"#E9A196","#A9584C",false)+
  og("M86 112 C96 102 130 100 146 108 C152 118 150 132 140 142 C126 146 104 140 92 132 C86 126 84 118 86 112 Z","muscle",on("bouche"),{s:"#7C2B23"})+fl("M96 114 C110 110 126 110 140 114",'#E58D7F',.9)+
  `<path d="M140 64 C146 80 150 110 152 140 C154 160 156 176 158 232 L172 232 C170 176 168 150 164 120 C160 92 156 74 150 62 Z" style="fill:#F6D2C8;stroke:#C28C80;stroke-width:.8"/>`+
  og("M144 74 a5 4 0 1 0 10 0 a5 4 0 1 0 -10 0 Z","gland",false,{s:"#9C4038"})+og("M141 120 a5.5 8 0 1 0 11 0 a5.5 8 0 1 0 -11 0 Z","gland",on("amygdales"),{s:"#9C4038"})+(on("amygdales")?`<path d="M140 64 C146 80 150 110 152 140 L164 140 C160 104 156 80 150 62 Z" class="pm-hl" style="fill-opacity:.6"/>`:"")+
  vs("M146 148 C150 142 154 142 156 150",3,"#F2C9A8","#B48B68",false)+
  og("M142 160 L160 158 L162 192 L144 194 Z","cart",on("larynx"),{s:"#7E9AA8"})+fl("M145 176 L159 174",'#E58D7F',1.6)+vs("M152 194 V232",9,"#E7EEF2","#93AAB6",false)+fl("M147 202 h10 M147 210 h10 M147 218 h10 M147 226 h10","#93AAB6",1)+
  `<ellipse cx="204" cy="96" rx="9" ry="14" style="fill:url(#rg-skin);stroke:#B98868;stroke-width:.9"/><path d="M204 96 L258 92" class="pm-lead"/>`+
  `<circle cx="266" cy="96" r="42" style="fill:var(--surface);stroke:#D6C2B4;stroke-width:1"/>`+
  og("M292 64 C306 70 310 92 304 112 C300 124 290 128 286 120 C292 112 294 100 290 92 C288 84 284 76 292 64 Z","skin",on("oreille_ext"),{s:"#B98868"})+vs("M290 96 L266 94",7,"#F2D6C0","#B98868",on("oreille_ext"))+
  `<ellipse cx="264" cy="94" rx="2.4" ry="8" style="fill:#EDE3D6;stroke:#8A7A68;stroke-width:1"/>`+(on("tympan")?`<ellipse cx="260" cy="94" rx="8" ry="11" class="pm-hl"/>`:"")+
  fl("M262 90 L256 86 L250 90 L248 96 M256 86 L256 96",'#B8A27C',2.2)+
  `<path d="M244 100 a6 6 0 1 1 -6 -6 a4 4 0 1 1 4 4 a2 2 0 1 1 -2 -2" style="fill:none;stroke:#C9A87C;stroke-width:3;stroke-linecap:round"/><path d="M240 86 a6 6 0 1 1 8 -6 M236 82 a7 5 0 1 1 6 -8" style="fill:none;stroke:#C9A87C;stroke-width:2.4"/>`+(on("oreille_int")?`<circle cx="241" cy="90" r="12" class="pm-hl"/>`:"")+
  og("M262 118 C270 112 286 114 292 122 C294 132 284 136 274 136 C266 136 260 128 262 118 Z","bone",on("mastoide"),{s:"#B8A27C"})+[[270,124],[278,122],[284,128],[274,130]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.3" style="fill:#E8DCC6;stroke:#B8A27C;stroke-width:.6"/>`).join("")+
  (lb?LB(4,40,"Sinus",on("sinus"),"start",94,42)+LB(4,72,"Fosses\nnasales",on("nez"),"start",100,84)+LB(4,124,"Bouche,\nlangue",on("bouche"),"start",98,122)+LB(4,170,"Pharynx,\namygdales",on("amygdales"),"start",146,122)+LB(4,210,"Larynx",on("larynx"),"start",146,178)+
   LB(316,28,"Tympan",on("tympan"),"end",264,88)+LB(232,158,"Oreille\ninterne",on("oreille_int"),"middle",242,98)+LB(316,160,"Oreille\nexterne",on("oreille_ext"),"end",300,112)+LB(316,198,"Mastoïde",on("mastoide"),"end",282,132):""),"Schéma de la sphère ORL");});

/* =====================================================================
   SCHÉMAS DES FICHES (SCH) — versions réalistes, mêmes textes pédagogiques
   ===================================================================== */
const svIn=s=>s.replace(/^<svg[^>]*>/,"").replace(/<\/svg>$/,"");
const AR=(d,c,w=2.2)=>{const id="ar"+c.replace("#","");return `<path d="${d}" style="fill:none;stroke:${c};stroke-width:${w};stroke-linecap:round;stroke-linejoin:round" marker-end="url(#mk-${c.replace("#","")})"/>`;};
(function(){const put=()=>{const d=document.getElementById("pm-defs");if(!d||d.querySelector("#mk-2E5AAC"))return;const defs=d.querySelector("defs");
 defs.insertAdjacentHTML("beforeend",["2E5AAC","C8372D","B4513A","5C6B7A","2E7D4F"].map(c=>`<marker id="mk-${c}" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="#${c}"/></marker>`).join(""));};
 if(document.body)put();else document.addEventListener("DOMContentLoaded",put);})();
/* silhouette humaine réaliste (même tracé que le schéma « corps ») */
const HBODY="M160 4 C171 4 177 12 177 22 C177 31 172 37 167 39 L168 46 C182 48 196 50 204 56 C211 61 212 70 213 82 L218 118 C220 132 222 142 224 152 C225 157 221 159 219 155 L214 140 C210 128 208 118 204 104 L201 90 L200 130 C201 148 198 170 194 190 C192 206 192 220 194 230 C195 236 186 238 182 236 L180 226 C178 212 176 198 174 184 L170 150 C168 146 152 146 150 150 L146 184 C144 198 142 212 140 226 L138 236 C134 238 125 236 126 230 C128 220 128 206 126 190 C122 170 119 148 120 130 L119 90 L116 104 C112 118 110 128 106 140 L101 155 C99 159 95 157 96 152 C98 142 100 132 102 118 L107 82 C108 70 109 61 116 56 C124 50 138 48 152 46 L153 39 C148 37 143 31 143 22 C143 12 149 4 160 4 Z";
const HB=(cx,y0,s,inner="")=>`<g transform="translate(${cx-160*s} ${y0}) scale(${s})">${og(HBODY,"skin",false,{s:"#B98868",w:.9/s})}${fl("M160 104 a1.6 1.6 0 1 0 0.1 0 M152 118 C156 122 164 122 168 118",'#C9946F',.8/s)}${inner}</g>`;
const HP=(cx,y0,s,x,y)=>[+(cx+(x-160)*s).toFixed(1),+(y0+y*s).toFixed(1)];
const dot=(x,y,c="#C8372D")=>`<circle cx="${x}" cy="${y}" r="5" style="fill:${c};stroke:#fff;stroke-width:1.6"/><circle cx="${x}" cy="${y}" r="9" style="fill:none;stroke:${c};stroke-width:1.2;opacity:.5"/>`;
const LL=(x1,y1,x2,y2)=>`<path d="M${x1} ${y1} L${x2} ${y2}" class="pm-lead"/>`;
/* bloc de peau en coupe (épiderme, derme, hypoderme, muscle) */
const skinBlock=(x,y,w,h1,h2,h3,h4)=>{const y1=y+h1,y2=y1+h2,y3=y2+h3,y4=y3+h4,fat=[];for(let i=0;i<Math.floor(w/22);i++)for(let j=0;j<Math.max(1,Math.floor(h3/18));j++)fat.push(`<ellipse cx="${x+11+i*22+(j%2?11:0)}" cy="${y2+9+j*18}" rx="10.5" ry="8.5" style="fill:url(#rg-fat);stroke:#D6B25E;stroke-width:.7"/>`);
 return `<rect x="${x}" y="${y3}" width="${w}" height="${h4}" style="fill:url(#rg-muscle)"/>`+fl(Array.from({length:Math.floor(w/10)},(_,i)=>`M${x+5+i*10} ${y3+2} L${x+5+i*10} ${y4-2}`).join(" "),"#A84A3E",.7)+
 `<rect x="${x}" y="${y2}" width="${w}" height="${h3}" style="fill:#F4D58A"/><g clip-path="none">${fat.filter(f=>true).join("")}</g>`+
 `<rect x="${x}" y="${y1}" width="${w}" height="${h2}" style="fill:url(#rg-mucosa);opacity:.9"/>`+fl(Array.from({length:3},(_,k)=>`M${x} ${y1+8+k*(h2-12)/2} `+Array.from({length:Math.floor(w/40)},(_,i)=>`q10 -5 20 0 q10 5 20 0`).join(" ")).join(" "),"#E7B0A2",1)+
 `<rect x="${x}" y="${y}" width="${w}" height="${h1}" style="fill:url(#rg-skin)"/>`+fl(`M${x} ${y+1} H${x+w}`,"#C98E6C",1.2)+`<rect x="${x}" y="${y}" width="${w}" height="${y4-y}" style="fill:none;stroke:#B8957A;stroke-width:.8"/>`;};

Object.assign(SCH,{
 /* circulation dans le cœur : vrai cœur en coupe + trajet du sang */
 coeur:()=>{const H=svIn(PMAPS.coeur.draw([],[])).replace(/<circle[^>]*class="f-acc"[^>]*\/><text[\s\S]*?<\/text>/g,"");
  return sv(300,`<g transform="translate(0 40)">${H}</g>`+
   og("M98 6 C82 8 74 22 76 34 L118 34 C118 20 112 8 98 6 Z","lung",false,{s:"#A85A54"})+og("M222 6 C238 8 246 22 244 34 L202 34 C202 20 208 8 222 6 Z","lung",false,{s:"#A85A54"})+tx(160,24,"Poumons","st-b","middle")+
   AR("M118 96 L118 128","#2E5AAC",2.4)+AR("M126 178 L134 200","#2E5AAC",2.4)+AR("M150 186 C150 160 150 130 146 102","#2E5AAC",2.4)+AR("M120 88 C112 70 104 50 104 36","#2E5AAC",2.4)+
   AR("M226 36 C238 70 252 116 236 144","#C8372D",2.4)+AR("M206 166 L206 190","#C8372D",2.4)+AR("M196 212 C186 190 182 160 182 124","#C8372D",2.4)+AR("M258 130 C262 200 250 262 222 284","#C8372D",2.4)+AR("M100 284 C80 270 76 260 80 254","#2E5AAC",2.4)+
   `<rect x="112" y="272" width="96" height="24" rx="8" style="fill:url(#rg-gray);stroke:#B8AE9F;stroke-width:.8"/>`+tx(160,288,"Organes","st-b st-dark","middle")+
   tx(6,56,"CŒUR\nDROIT","st-blue st-b")+tx(6,84,"sang pauvre\nen O₂","st-sub")+tx(314,56,"CŒUR\nGAUCHE","st-acc st-b","end")+tx(314,84,"sang riche\nen O₂","st-sub","end")+
   tx(6,224,"Veines\ncaves","st-sub")+tx(314,236,"Aorte","st-sub","end"),"Circulation dans le cœur droit et le cœur gauche");},
 artere:()=>{const sec=(x,lbl,sub,lumen)=>`<circle cx="${x}" cy="70" r="40" style="fill:url(#rg-skin);stroke:#C99A82;stroke-width:1"/><circle cx="${x}" cy="70" r="34" style="fill:url(#rg-muscle);stroke:#8E3A30;stroke-width:.8"/><circle cx="${x}" cy="70" r="28" style="fill:#F7E3D8;stroke:#E2B9A6;stroke-width:.8"/>${lumen}`+tx(x,130,lbl,"st-b","middle")+tx(x,144,sub,"st-sub","middle");
  const blood=(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r}" style="fill:url(#rg-blood)"/>`,rbc=(x,y)=>`<ellipse cx="${x}" cy="${y}" rx="4" ry="2.6" style="fill:#F07C70;opacity:.75"/>`;
  return sv(165,
   sec(55,"Artère saine","circulation libre",blood(55,70,26)+rbc(48,64)+rbc(62,76)+rbc(58,60))+
   sec(160,"Plaque","rétrécie : angor",`<path d="M133 70 A27 27 0 0 1 187 70 C176 64 170 60 160 60 C150 60 144 64 133 70 Z" style="fill:url(#rg-fat);stroke:#C9A24E;stroke-width:.8"/><path d="M137 66 C146 60 152 58 160 58 C168 58 174 60 183 66" style="fill:none;stroke:#F2E2C0;stroke-width:2"/>`+blood(160,80,15)+rbc(156,80)+rbc(166,84))+
   sec(265,"Plaque + caillot","bouchée : infarctus",`<path d="M238 70 A27 27 0 0 1 292 70 C281 64 275 60 265 60 C255 60 249 64 238 70 Z" style="fill:url(#rg-fat);stroke:#C9A24E;stroke-width:.8"/><path d="M240 72 C246 92 284 92 290 72 C280 66 270 64 265 64 C258 64 248 66 240 72 Z" style="fill:#6E1E1A;stroke:#4A100D;stroke-width:.8"/>`+fl("M246 76 L284 84 M250 86 L280 72 M258 70 L272 90",'#E2C66A',.9))+
   tx(160,12,"Coupe d'une artère coronaire","st-sub","middle"),
   "Coupe d'une artère saine, rétrécie par une plaque, puis bouchée par un caillot");},
 bronche:()=>{const cart=(x,r)=>[0,72,144,216,288].map(a=>`<path d="M${x+r*Math.cos((a-24)*Math.PI/180)} ${72+r*Math.sin((a-24)*Math.PI/180)} A${r} ${r} 0 0 1 ${x+r*Math.cos((a+24)*Math.PI/180)} ${72+r*Math.sin((a+24)*Math.PI/180)}" style="fill:none;stroke:#DCEAF0;stroke-width:6;stroke-linecap:round"/>`).join("");
  const wall=(x,R)=>`<circle cx="${x}" cy="72" r="${R}" style="fill:url(#rg-skin);stroke:#C99A82;stroke-width:1"/>`+cart(x,R-6);
  const folded=(x,r,n,amp)=>{let d="";for(let i=0;i<=n*2;i++){const a=i/(n*2)*Math.PI*2,rr=r+(i%2?amp:-amp);d+=(i?"L":"M")+(x+rr*Math.cos(a)).toFixed(1)+" "+(72+rr*Math.sin(a)).toFixed(1)+" ";}return d+"Z";};
  return sv(175,
   wall(55,36)+`<circle cx="55" cy="72" r="27" style="fill:url(#rg-muscle);stroke:#8E3A30;stroke-width:.6"/><circle cx="55" cy="72" r="24" style="fill:url(#rg-mucosa)"/><circle cx="55" cy="72" r="20" style="fill:#FBF4EE"/>`+
   tx(55,132,"Bronche normale","st-b","middle")+tx(55,146,"paroi fine","st-sub","middle")+
   wall(160,40)+`<circle cx="160" cy="72" r="31" style="fill:url(#rg-muscle);stroke:#8E3A30;stroke-width:.6"/><path d="${folded(160,20,9,4)}" style="fill:url(#rg-mucosa);stroke:#B5675C;stroke-width:.6"/><path d="${folded(160,11,9,3)}" style="fill:#FBF4EE"/><ellipse cx="164" cy="75" rx="5" ry="3.4" style="fill:#E6D27A;stroke:#B9A044;stroke-width:.6"/>`+
   tx(160,132,"Asthme (crise)","st-b","middle")+tx(160,146,"resserrée","st-sub","middle")+tx(160,160,"réversible","st-green","middle")+
   wall(265,40)+`<circle cx="265" cy="72" r="32" style="fill:url(#rg-mucosa);stroke:#B5675C;stroke-width:.6"/><circle cx="265" cy="72" r="18" style="fill:#FBF4EE"/>`+[[256,68,8,5],[272,78,6,4],[262,80,5,3]].map(([x,y,a,b])=>`<ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}" style="fill:#D9C66A;stroke:#A9933E;stroke-width:.6"/>`).join("")+
   tx(265,132,"BPCO","st-b","middle")+tx(265,146,"épaissie + mucus","st-sub","middle")+tx(265,160,"permanente","st-acc","middle")+
   tx(160,12,"Coupe d'une bronche (cartilage, muscle, muqueuse)","st-sub","middle"),
   "Coupe d'une bronche normale, en crise d'asthme et dans la BPCO");},
 avc:()=>{const brain=(dx)=>`<g transform="translate(${dx} 0) scale(.58)">`+og("M70 128 C56 104 66 70 96 54 C126 38 168 34 200 46 C230 58 250 84 248 112 C246 130 236 140 222 144 C210 148 198 146 190 150 C176 162 150 166 128 160 C112 156 100 150 92 146 C82 142 74 138 70 128 Z","brain",false,{s:"#9A6E66"})+
   og("M188 152 C194 140 222 138 238 146 C252 154 252 172 236 180 C218 188 196 182 188 170 Z","brain",false,{s:"#9A6E66"})+og("M170 150 C168 166 170 184 173 200 L187 202 C187 186 185 170 188 154 Z","brain",false,{s:"#9A6E66"})+
   fl("M170 40 C164 64 160 88 150 112 M98 120 C116 113 138 110 158 113 C172 116 182 120 190 128 M84 92 C96 84 104 90 112 82 M78 110 C92 104 100 112 116 102 M104 66 C112 76 122 70 130 78 M132 52 C134 66 144 70 140 84 M184 52 C186 66 196 70 198 84 M200 60 C206 72 214 70 216 82 M190 92 C200 98 210 94 214 102 M212 120 C220 126 230 122 236 130 M110 132 C122 128 134 136 148 130 M196 150 C214 146 232 150 244 158 M192 160 C212 156 232 160 246 168","#B9857A",1.4)+`</g>`;
  const mca=(dx)=>vs(`M${dx+66} 74 C${dx+74} 70 ${dx+80} 66 ${dx+88} 62 M${dx+80} 66 C${dx+82} 56 ${dx+88} 48 ${dx+94} 42 M${dx+88} 62 C${dx+98} 58 ${dx+106} 56 ${dx+114} 56`,2,RC.art,RC.artD,false);
  return sv(185,
   brain(-14)+`<path d="M58 60 C66 46 84 40 96 44 C102 54 98 66 86 72 C74 74 62 70 58 60 Z" style="fill:#8BA6C7;opacity:.55"/>`+mca(-14)+`<ellipse cx="66" cy="66" rx="4.5" ry="3.4" style="fill:#5A1714;stroke:#2E0B09;stroke-width:.7"/>`+
   tx(80,140,"AVC ischémique","st-b","middle")+tx(80,154,"un caillot bouche l'artère","st-sub","middle")+tx(80,168,"≈ 80 % des cas","st-blue st-b","middle")+
   brain(146)+mca(146)+`<path d="M240 56 C252 46 272 50 274 64 C276 78 262 86 250 82 C238 78 232 66 240 56 Z" style="fill:url(#rg-blood);stroke:#7E1E18;stroke-width:.8"/>`+
   tx(240,140,"AVC hémorragique","st-b","middle")+tx(240,154,"une artère se rompt et saigne","st-sub","middle")+tx(240,168,"≈ 20 % des cas","st-acc st-b","middle")+
   tx(160,12,"Seule l'imagerie (scanner, IRM) permet de les distinguer","st-sub","middle"),
   "AVC ischémique et AVC hémorragique");},
 alveole:()=>{const rbc=(x,y,r)=>`<g transform="translate(${x} ${y}) rotate(${r})"><ellipse rx="6" ry="4" style="fill:url(#rg-blood);stroke:#8E1F17;stroke-width:.5"/><ellipse rx="2.8" ry="1.6" style="fill:#F07C70;opacity:.7"/></g>`;
  return sv(210,
   vs("M160 0 V30",20,"#F2D2CC","#B97A70",false)+og("M160 30 C206 30 220 70 214 100 C208 130 186 142 160 142 C134 142 112 130 106 100 C100 70 114 30 160 30 Z","lung",false,{s:"#B5675C"})+
   `<path d="M160 36 C200 36 210 72 206 98 C202 124 184 134 160 134 C136 134 118 124 114 98 C110 72 120 36 160 36 Z" style="fill:#FBF2EF"/>`+tx(160,74,"Alvéole","st-b st-dark","middle")+tx(160,88,"(air inspiré)","st-dark","middle")+
   `<path d="M30 168 C90 136 230 136 290 168" style="fill:none;stroke:url(#rg-bloodB);stroke-width:22;stroke-linecap:round"/><path d="M160 145 C220 146 260 154 290 168" style="fill:none;stroke:#D9574A;stroke-width:22;stroke-linecap:round"/><path d="M30 168 C90 136 230 136 290 168" style="fill:none;stroke:#fff;stroke-width:4;stroke-opacity:.25;stroke-linecap:round" transform="translate(-2 -4)"/>`+
   rbc(60,158,-20)+rbc(96,146,-10)+rbc(130,142,0)+rbc(190,142,5)+rbc(226,148,15)+rbc(262,158,22)+tx(160,206,"Capillaire sanguin","st-b","middle")+tx(22,190,"sang pauvre en O₂","st-blue")+tx(298,190,"sang riche en O₂","st-acc","end")+
   AR("M138 96 L138 140","#2E5AAC",2.4)+fl("M104 118 H134","#2E5AAC",.8)+tx(100,114,"O₂","st-blue st-b","end")+tx(100,128,"vers le sang","st-blue","end")+AR("M182 140 L182 98","#B4513A",2.4)+fl("M186 118 H216","#B4513A",.8)+tx(220,114,"CO₂","st-acc st-b")+tx(220,128,"rejeté","st-acc")+
   tx(8,24,"Paroi très fine :","st-b")+tx(8,38,"les gaz passent","st-sub")+tx(8,52,"par diffusion","st-sub"),
   "Échanges gazeux entre l'alvéole et le capillaire sanguin");},
 nephron:()=>sv(240,
  `<circle cx="46" cy="52" r="22" style="fill:#FBEFE6;stroke:#C99A82;stroke-width:1.4"/>`+art("M30 30 C36 40 34 46 40 50",2.4,false)+`<g>${[[40,48],[48,44],[52,54],[44,58],[38,56],[50,62],[56,48]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5" style="fill:url(#rg-blood);stroke:#8E1F17;stroke-width:.5"/>`).join("")}</g>`+art("M56 60 C62 70 60 78 54 84",2,false)+
  tx(46,92,"Glomérule","st-b","middle")+tx(46,105,"filtration","st-sub","middle")+
  vs("M66 52 C80 40 90 66 104 52 S122 44 126 58 L140 196 C142 214 168 214 170 196 L182 70 C186 54 196 66 202 54 S212 46 216 54",9,"#F3D2B8","#B98B6E",false)+fl("M66 52 C80 40 90 66 104 52 S122 44 126 58 L140 196 C142 214 168 214 170 196 L182 70 C186 54 196 66 202 54 S212 46 216 54",'#FFF6EE',2.2,";opacity:.7")+
  vs("M222 40 L222 218",11,"#E9D9C2","#A99070",false)+AR("M222 214 L222 232","#5C6B7A",2)+tx(230,236,"Urines","st-sub")+
  tx(96,30,"Tube proximal","st-sub","middle")+tx(210,30,"Tube distal","st-sub","middle")+tx(155,230,"Anse de Henle","st-sub","middle")+tx(234,110,"Tube\ncollecteur","st-sub")+
  dot(175,160,"#C8372D")+tx(128,164,"Furosémide","st-acc st-b","end")+dot(208,52,"#D9A23A")+tx(312,84,"Thiazidiques","st-amber st-b","end")+LL(212,58,262,76)+dot(222,140,"#2E5AAC")+tx(234,150,"Spironolactone","st-blue st-b"),
  "Néphron et sites d'action des diurétiques"),
 pac:()=>sv(220,
  skinBlock(0,64,320,10,24,66,26)+tx(8,58,"Peau","st-sub")+
  `<path d="M96 104 C96 92 174 92 174 104 L174 128 C174 136 96 136 96 128 Z" style="fill:url(#rg-steel);stroke:#7D8A96;stroke-width:1"/><ellipse cx="135" cy="98" rx="30" ry="6" style="fill:#E8EEF2;stroke:#9AA7B2;stroke-width:1"/><ellipse cx="135" cy="98" rx="22" ry="4" style="fill:#C9D6E0"/>`+
  `<rect x="80" y="139" width="110" height="26" rx="5" style="fill:#FFF8F0;opacity:.88"/><rect x="200" y="119" width="54" height="16" rx="5" style="fill:#FFF8F0;opacity:.88"/>`+tx(135,149,"Boîtier sous la peau","st-b st-dark","middle")+tx(135,160,"avec son septum","st-dark","middle")+
  `<path d="M116 18 L152 18 L152 30 L144 32 L144 40 L128 40 L128 32 L116 30 Z" style="fill:#3E7CC4;stroke:#2A578C;stroke-width:1"/>`+vs("M136 40 L136 96",2.6,"#D7DEE4","#7D8A96",false)+vs("M136 96 L132 100",2.6,"#D7DEE4","#7D8A96",false)+
  tx(160,24,"Aiguille de Huber","st-acc st-b")+tx(160,38,"(coudée, non traumatique)","st-sub")+
  vs("M174 116 C220 116 250 114 286 100",4,"#F4F6F8","#9AA7B2",false)+tx(206,130,"Cathéter","st-b st-dark")+
  `<rect x="282" y="74" width="28" height="116" rx="13" style="fill:url(#rg-bloodB);stroke:#2E4079;stroke-width:1"/>`+vs("M290 100 L296 150",3.4,"#F4F6F8","#9AA7B2",false)+tx(297,66,"Veine","st-b","middle")+
  tx(150,204,"Extrémité du cathéter : veine cave supérieure","st-sub","middle"),
  "Chambre implantable : boîtier sous la peau, aiguille de Huber et cathéter dans la veine"),
 angles:()=>{const needle=(x,ang,len,lbl,deg,lx,ly,la)=>{const r=ang*Math.PI/180,c=Math.cos(r),s=Math.sin(r),x2=x+c*len,y2=40+s*len,x1=x-c*18,y1=40-s*18,x0=x-c*46,y0=40-s*46;
   return vs(`M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`,1.8,"#DCE3E8","#6E7B86",false)+vs(`M${x0.toFixed(1)} ${y0.toFixed(1)} L${x1.toFixed(1)} ${y1.toFixed(1)}`,7,"#F4F8FB","#9AA7B2",false,{cap:"butt"})+`<circle cx="${x2.toFixed(1)}" cy="${y2.toFixed(1)}" r="2.6" style="fill:#B4513A"/>`+tx(lx,ly,lbl+" "+deg,"st-b",la);};
  return sv(230,skinBlock(10,40,300,16,40,46,56)+art("M254 66 C268 62 290 62 310 66",8,false)+
   needle(96,12,40,"ID","10–15°",84,12,"middle")+needle(150,45,62,"SC","45°",150,16,"start")+needle(204,90,124,"IM","90°",212,14,"start")+needle(250,25,30,"IV","≈ 25°",258,28,"start")+
   tx(14,52,"Épiderme","st-dark")+tx(14,82,"Derme","st-dark")+tx(14,124,"Hypoderme","st-dark")+tx(14,176,"Muscle","st-b")+tx(306,84,"veine","st-dark","end")+
   tx(160,218,"SC : 90° possible avec une aiguille courte ou un pli épais","st-sub","middle"),"Angles et profondeur des quatre voies d'injection");},
 peau:()=>{const bar=(x,h,top,bot,lbl)=>`<rect x="${x}" y="30" width="16" height="${h}" rx="3" style="fill:url(#bg-${lbl})"/>`;
  const g=(id,a,b)=>`<linearGradient id="bg-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  return sv(232,`<defs>${g("1","#F08A6E","#E86F5A")+g("2s","#F6C4A6","#E46A52")+g("2p","#F2E6DC","#C8584A")+g("3","#E9E2D2","#5C3A2C")}</defs>`+
   skinBlock(10,30,190,18,74,64,30)+vs("M70 26 L72 120",2,"#4A3426","#2A1C14",false)+`<ellipse cx="72" cy="122" rx="6" ry="8" style="fill:#C8977A;stroke:#7A5440;stroke-width:.8"/>`+art("M20 112 C70 108 120 114 196 110",2.2,false)+vein("M20 118 C70 116 120 120 196 118",2.2,false)+
   tx(16,43,"Épiderme","st-b st-dark")+tx(16,64,"Derme","st-b st-dark")+tx(16,142,"Hypoderme (graisse)","st-b st-dark")+tx(16,206,"Muscle","st-b","start")+
   `<path d="M218 30 h16 v14 a8 6 0 0 1 -16 0 Z" style="fill:url(#bg-1)"/>`+`<path d="M244 30 h16 v38 h-16 Z" style="fill:url(#bg-2s)"/><ellipse cx="252" cy="28" rx="10" ry="6" style="fill:#FBE9D8;stroke:#D9A98A;stroke-width:.8;opacity:.9"/>`+
   `<path d="M270 30 h16 v92 h-16 Z" style="fill:url(#bg-2p)"/><path d="M296 30 h16 v160 h-16 Z" style="fill:url(#bg-3)"/>`+fl("M298 34 l12 6 M298 48 l12 -4 M298 60 l12 5",'#3A2418',1)+
   tx(225,212,"1er","st-b","middle")+tx(251,212,"2e S","st-b","middle")+tx(277,212,"2e P","st-b","middle")+tx(303,212,"3e","st-b","middle")+
   tx(318,226,"S : superficiel · P : profond","st-sub","end")+tx(160,18,"Plus la brûlure est profonde, moins elle fait mal","st-sub","middle"),
   "Couches de la peau et profondeur des brûlures selon le degré");},
 occlusion:()=>sv(190,
  `<path d="M18 92 C18 60 40 58 70 60 C100 62 124 58 146 70 L146 116 C124 128 100 124 70 126 C40 128 18 124 18 92 Z" style="fill:url(#rg-intest);stroke:#B57A66;stroke-width:1.2"/>`+
  `<path d="M22 100 L142 100 L142 114 C122 124 100 120 70 122 C44 124 26 118 22 100 Z" style="fill:#E1C77A;opacity:.85"/><path d="M22 100 H142" style="stroke:#B49B4E;stroke-width:1.2"/>`+fl("M40 64 C44 78 44 108 40 122 M70 61 C74 78 74 108 70 125 M100 62 C104 78 104 108 100 124 M126 64 C130 80 130 106 126 120",'#C38A74',1.2)+
  og("M146 74 C152 70 166 70 170 76 C174 86 174 100 170 110 C166 116 152 116 146 112 C142 100 142 86 146 74 Z","myo",false,{s:"#6E1F1A"})+
  vs("M170 92 C210 92 250 92 306 92",14,"#E8C3B1","#B57A66",false)+fl("M200 86 v12 M230 86 v12 M260 86 v12 M290 86 v12",'#C38A74',1)+
  tx(80,80,"gaz","st-b st-dark","middle")+tx(80,113,"liquide","st-b st-dark","middle")+
  tx(80,148,"En amont : intestin dilaté","st-b","middle")+tx(80,162,"gaz et liquide s'accumulent","st-sub","middle")+tx(158,58,"Obstacle","st-acc st-b","middle")+
  tx(240,120,"En aval : vide","st-b","middle")+tx(240,134,"arrêt des matières","st-sub","middle")+tx(240,148,"et des gaz","st-sub","middle")+
  tx(160,184,"Vomissements, ventre gonflé, douleurs, plus rien ne passe","st-sub","middle"),
  "Occlusion intestinale : intestin dilaté en amont de l'obstacle"),
 thrombose:()=>{const LEG="M60 150 C58 170 62 190 64 206 C62 216 66 224 72 230 C80 236 104 238 112 234 C116 230 110 226 100 222 C92 218 90 210 92 200 C96 184 98 166 98 150 Z";
  return sv(260,
   og("M120 30 C100 32 88 52 88 78 C88 98 96 112 116 110 C126 108 128 96 128 80 C128 60 128 40 120 30 Z","lung",false,{s:"#A85A54"})+og("M200 30 C220 32 232 52 232 78 C232 98 224 112 204 110 C194 108 192 96 192 80 C192 60 192 40 200 30 Z","lung",false,{s:"#A85A54"})+tx(160,20,"Poumons","st-b","middle")+
   og("M160 92 C164 86 176 86 178 94 C180 104 170 114 162 118 C156 112 150 104 152 96 C154 92 157 92 160 92 Z","myo",false,{s:"#6E1F1A"})+vein("M156 112 C150 130 120 140 84 148",4.4,false)+vs("M156 100 C146 92 136 84 124 80",4,"#5D73BB","#33447E",false)+
   og(LEG,"skin",false,{s:"#B98868"})+vein("M80 150 C80 172 80 196 80 214",4,false)+`<ellipse cx="80" cy="200" rx="5.5" ry="12" style="fill:#6E1E1A;stroke:#4A100D;stroke-width:.8"/>`+
   tx(106,210,"Caillot dans une veine","st-b")+tx(106,224,"du mollet : phlébite","st-sub")+
   AR("M80 184 C80 160 100 150 130 140 C150 132 156 118 152 104 C146 92 136 86 128 82","#B4513A",1.8)+`<circle cx="126" cy="82" r="4.5" style="fill:#6E1E1A"/>`+
   tx(178,150,"Un fragment migre","st-acc st-b")+tx(178,164,"vers les poumons :","st-acc")+tx(178,178,"embolie pulmonaire","st-acc st-b"),
   "Du caillot du mollet à l'embolie pulmonaire");}
});

Object.assign(SCH,{
 sites:()=>{const S=1.12,X=100,Y=4,P=(x,y)=>HP(X,Y,S,x,y);const zone=(x,y,rx,ry,c)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" style="fill:${c};fill-opacity:.42;stroke:${c};stroke-width:1.2;stroke-dasharray:3 2"/>`;
  const [ax,ay]=P(213,84),[bx2,by]=P(178,121),[cx2,cy]=P(186,170);
  return sv(280,HB(X,Y,S,zone(110,84,5.5,14,"#3E7CC4")+zone(210,84,5.5,14,"#3E7CC4")+zone(160,121,19,12,"#C8574A")+`<circle cx="160" cy="118" r="2.4" style="fill:var(--surface);stroke:#B98868;stroke-width:.8"/>`+zone(139,170,7,16,"#D9A23A")+zone(181,170,7,16,"#D9A23A"))+
   LL(ax,ay,182,70)+tx(186,66,"Bras (face externe)","st-b")+tx(186,80,"absorption intermédiaire","st-sub")+
   LL(bx2,by,182,128)+tx(186,124,"Abdomen","st-b")+tx(186,138,"absorption la plus rapide","st-sub")+tx(186,152,"à 2 cm du nombril","st-sub")+
   LL(cx2,cy,182,195)+tx(186,191,"Cuisses","st-b")+tx(186,205,"absorption plus lente","st-sub")+
   tx(186,236,"Fesses : possible aussi","st-sub")+tx(186,252,"Changer de point\nà chaque fois","st-acc st-b"),"Sites d'injection sous-cutanée de l'insuline");},
 pouls:()=>{const S=1.12,X=160,Y=6,P=(x,y)=>HP(X,Y,S,x,y);
  const art2=`<g style="opacity:.75">${art("M160 50 V140 M160 140 C168 146 174 150 180 156 C184 176 186 196 187 226 M160 56 C148 58 136 60 124 64 C118 80 114 100 108 140 M156 46 L154 30",1.4,false)}</g>`;
  const pts=[[153,42,"Carotidien","urgence",66,36,"end"],[111,104,"Huméral","pli du coude",66,90,"end"],[103,141,"Radial","routine",66,144,"end"],[170,84,"Apical","pointe du cœur",240,58,"start"],[174,149,"Fémoral","pli de l'aine",240,146,"start"],[186,229,"Pédieux","dessus du pied",240,234,"start"]];
  return sv(290,HB(X,Y,S,art2)+pts.map(([x,y,l,sub,lx,ly,a])=>{const [px,py]=P(x,y);return LL(a==="end"?lx+4:lx-4,ly+2,px,py)+dot(px,py)+tx(lx,ly,l,"st-b",a)+tx(lx,ly+13,sub,"st-sub",a);}).join(""),"Les sites de prise du pouls sur une silhouette");},
 wallace:()=>{const S=1.12,X=210,Y=6,P=(x,y)=>HP(X,Y,S,x,y);
  const div=fl("M152 46 L168 46 M116 58 L124 90 M204 58 L196 90 M122 146 L198 146 M160 146 L160 236",'#8E5A45',1.1,";stroke-dasharray:3 3");
  const lab=(x,y,t,sub)=>{const [px,py]=P(x,y);return tx(px,py,t,"st-b st-dark","middle")+(sub?tx(px,py+13,sub,"st-dark","middle"):"");};
  return sv(290,HB(X,Y,S,div)+lab(160,28,"9 %")+lab(160,98,"18 %","avant")+(([x1,y1],[x2,y2])=>tx(x1,y1,"9 %","st-b","end")+tx(x2,y2,"9 %","st-b"))(P(92,112),P(228,112))+lab(135,172,"18 %")+lab(185,172,"18 %")+
   tx(10,26,"Tête et cou : 9 %","st-sub")+tx(10,40,"Chaque bras : 9 %","st-sub")+tx(10,54,"Tronc : 18 % avant","st-sub")+tx(10,68,"+ 18 % arrière","st-sub")+tx(10,82,"Chaque jambe : 18 %","st-sub")+tx(10,96,"Périnée : 1 %","st-sub")+
   tx(10,250,"Paume du patient ≈ 1 %","st-acc st-b")+tx(10,264,"pour les petites surfaces","st-sub"),"Règle des 9 de Wallace chez l'adulte");},
 brassard:()=>sv(200,
  `<path d="M0 124 H320 V134 H0 Z" style="fill:url(#rg-gray);stroke:#B8AE9F;stroke-width:.8"/><path d="M40 134 V196 M280 134 V196" style="stroke:#B8AE9F;stroke-width:3"/>`+tx(160,163,"bras posé sur un support","st-sub","middle")+
  og("M20 98 C60 94 130 96 186 100 C214 102 238 104 256 104 C270 104 282 102 292 106 C300 110 300 120 290 122 C270 124 250 122 230 122 C190 122 130 124 60 124 C40 124 24 122 20 116 Z","skin",false,{s:"#B98868"})+
  fl("M282 108 l10 2 M280 114 l12 1 M278 120 l10 0",'#B98868',.8)+fl("M186 104 C190 110 190 116 186 122",'#C9946F',.9)+
  `<path d="M10 110 H316" style="stroke:#B4513A;stroke-width:1.4;stroke-dasharray:5 4"/>`+tx(316,90,"hauteur du cœur","st-acc st-b","end")+
  `<path d="M70 92 C70 90 146 90 146 92 L148 128 C148 130 68 130 68 128 Z" style="fill:url(#rg-cuff);stroke:#2E5478;stroke-width:1"/>`+fl("M74 100 H142 M74 120 H142",'#9DBBD6',1)+tx(108,114,"brassard","st-b","middle")+
  vs("M108 92 C108 66 150 52 206 50",2.6,"#4A4F57","#2A2E33",false)+`<rect x="206" y="30" width="44" height="34" rx="6" style="fill:url(#rg-plastic);stroke:#8E9BA6;stroke-width:1"/><rect x="211" y="35" width="34" height="16" rx="2" style="fill:#2E3A44"/>`+`<text x="228" y="47" text-anchor="middle" style="fill:#9EF0B8;font-size:9px;font-weight:700;font-family:monospace">120/80</text>`+tx(256,44,"tensiomètre","st-sub")+
  tx(160,148,"2 cm au-dessus du pli du coude","st-sub","middle")+tx(12,30,"Patient assis, dos appuyé,","st-sub")+tx(12,44,"jambes décroisées, sans parler","st-sub"),
  "Mesure de la tension : brassard sur le bras soutenu à hauteur du cœur"),
 oxymetre:()=>sv(182,
  og("M10 94 L190 94 C222 94 232 78 228 70 C224 60 212 56 196 56 L10 56 Z","skin",false,{s:"#B98868"})+`<path d="M200 60 C214 60 222 66 222 74 C220 80 210 82 200 80 Z" style="fill:#F6E1D6;stroke:#C9A08A;stroke-width:.8"/>`+fl("M120 60 C124 70 124 82 120 92 M150 60 C154 70 154 82 150 92",'#C9946F',.8)+
  `<path d="M148 30 C148 26 240 26 240 30 L240 56 L148 56 Z" style="fill:url(#rg-plastic);stroke:#8E9BA6;stroke-width:1"/><path d="M148 94 L240 94 L240 120 C240 124 148 124 148 120 Z" style="fill:url(#rg-plastic);stroke:#8E9BA6;stroke-width:1"/><path d="M234 56 L240 56 L240 94 L234 94 Z" style="fill:#AEB9C3"/>`+
  `<circle cx="184" cy="58" r="3" style="fill:#FF3B30"/><path d="M184 60 L180 92 M184 60 L188 92" style="stroke:#FF3B30;stroke-width:1.2;stroke-opacity:.65;stroke-dasharray:3 2"/><rect x="178" y="92" width="12" height="4" rx="1" style="fill:#2E3A44"/>`+
  tx(160,18,"Le capteur fait passer une lumière à travers le doigt","st-sub","middle")+
  `<rect x="226" y="126" width="88" height="40" rx="8" style="fill:#2E3A44;stroke:#1C252C;stroke-width:1"/><text x="244" y="152" style="fill:#9EF0B8;font-size:13px;font-weight:700;font-family:monospace">98 %</text><path d="M282 150 l5 0 3 -8 4 14 3 -6 6 0" style="fill:none;stroke:#9EF0B8;stroke-width:1.8"/>`+
  tx(12,124,"Doigt propre et chaud","st-b")+tx(12,138,"sans vernis","st-sub")+tx(12,158,"Courbe de pouls régulière","st-acc")+tx(12,172,"= valeur fiable","st-acc"),"Oxymètre de pouls sur un doigt"),
 urines:()=>{const jar=(x,col,l,s,dots)=>`<path d="M${x-18} 32 h36 l-2 62 a8 8 0 0 1 -8 8 h-16 a8 8 0 0 1 -8 -8 Z" style="fill:#F4F8FB;fill-opacity:.6;stroke:#9AA7B2;stroke-width:1"/><path d="M${x-17.4} 46 h34.8 l-1.6 48 a7 7 0 0 1 -7 7 h-17.6 a7 7 0 0 1 -7 -7 Z" style="fill:${col};opacity:.92"/><ellipse cx="${x}" cy="46" rx="17.4" ry="2.2" style="fill:#fff;opacity:.35"/><path d="M${x-12} 50 v40" style="stroke:#fff;stroke-width:3;stroke-opacity:.4;stroke-linecap:round"/>`+
   `<rect x="${x-20}" y="22" width="40" height="11" rx="2" style="fill:url(#rg-plastic);stroke:#8E9BA6;stroke-width:.8"/>${fl(`M${x-16} 24 v7 M${x-10} 24 v7 M${x-4} 24 v7 M${x+2} 24 v7 M${x+8} 24 v7 M${x+14} 24 v7`,"#AEB9C3",.8)}${dots?`<circle cx="${x-6}" cy="62" r="2.4" fill="#fff" opacity=".8"/><circle cx="${x+5}" cy="74" r="2" fill="#fff" opacity=".8"/><circle cx="${x-2}" cy="86" r="2.4" fill="#fff" opacity=".8"/><circle cx="${x+7}" cy="58" r="1.6" fill="#fff" opacity=".8"/>`:""}`+tx(x,120,l,"st-b","middle")+tx(x,134,s,"st-sub","middle");
  return sv(150,jar(32,"#F3EBB0","Clair","normal")+jar(95,"#E9C350","Foncé","peu d'eau")+jar(158,"#C47E2E","Ambré","déshydraté")+jar(221,"#C04A3E","Rouge","sang ?")+jar(284,"#D6C578","Trouble","infection ?",true),"Couleurs des urines et leur signification");},
 pupilles:()=>{const E=(x,cy,rI,pr,sc=1)=>{const w=34*sc,h=16*sc;return `<path d="M${x-w} ${cy} C${x-w*.6} ${cy-h*1.5} ${x+w*.6} ${cy-h*1.5} ${x+w} ${cy} C${x+w*.6} ${cy+h*1.4} ${x-w*.6} ${cy+h*1.4} ${x-w} ${cy} Z" style="fill:url(#rg-eyew);stroke:#B98868;stroke-width:1.2"/>`+
   `<circle cx="${x}" cy="${cy}" r="${rI}" style="fill:url(#rg-iris);stroke:#2E5478;stroke-width:.8"/>`+fl(Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return `M${(x+Math.cos(a)*(pr+1)).toFixed(1)} ${(cy+Math.sin(a)*(pr+1)).toFixed(1)} L${(x+Math.cos(a)*(rI-1)).toFixed(1)} ${(cy+Math.sin(a)*(rI-1)).toFixed(1)}`;}).join(" "),"#2E5478",.5)+
   `<circle cx="${x}" cy="${cy}" r="${pr}" style="fill:#14181C"/><circle cx="${x-rI*.35}" cy="${cy-rI*.35}" r="${Math.max(1.4,rI*.14)}" style="fill:#fff;opacity:.85"/>`+fl(`M${x-w} ${cy} C${x-w*.6} ${cy-h*1.5} ${x+w*.6} ${cy-h*1.5} ${x+w} ${cy}`,"#8E5A45",1.6);};
  return sv(130,E(38,50,17,6)+tx(38,100,"Normale","st-b","middle")+tx(38,114,"réactive","st-sub","middle")+E(112,50,17,2.4)+tx(112,100,"Myosis","st-b","middle")+tx(112,114,"petite","st-sub","middle")+E(186,50,17,13)+tx(186,100,"Mydriase","st-b","middle")+tx(186,114,"dilatée","st-sub","middle")+
   E(250,50,9,2.4,.55)+E(292,50,9,7,.55)+tx(271,100,"Anisocorie","st-acc st-b","middle")+tx(271,114,"inégales : alerte","st-acc","middle"),"Taille des pupilles : normale, myosis, mydriase, anisocorie");},
 tubes:()=>{const t=(x,cap,n,l,fill)=>`<path d="M${x-9} 36 V96 a9 9 0 0 0 18 0 V36 Z" style="fill:#F4F8FB;fill-opacity:.7;stroke:#9AA7B2;stroke-width:1"/>${fill?`<path d="M${x-8.4} 70 V96 a8.4 8.4 0 0 0 16.8 0 V70 Z" style="fill:${fill};opacity:.9"/>`:""}<rect x="${x-8.4}" y="52" width="16.8" height="20" style="fill:#fff;opacity:.85"/>${fl(`M${x-6} 57 h12 M${x-6} 62 h9 M${x-6} 67 h11`,"#9AA7B2",.7)}<path d="M${x-6} 40 v52" style="stroke:#fff;stroke-width:2.4;stroke-opacity:.5;stroke-linecap:round"/>`+
   `<path d="M${x-11} 22 h22 v14 h-22 Z" style="fill:${cap};stroke:rgba(0,0,0,.25);stroke-width:.8"/>${fl(`M${x-8} 24 v10 M${x-4} 24 v10 M${x} 24 v10 M${x+4} 24 v10 M${x+8} 24 v10`,"rgba(0,0,0,.18)",1)}`+tx(x,16,String(n),"st-b","middle")+tx(x,122,l,"st-sub","middle");
  return sv(150,`<path d="M18 42 h28 v54 a8 8 0 0 1 -8 8 h-12 a8 8 0 0 1 -8 -8 Z" style="fill:#F4F8FB;fill-opacity:.7;stroke:#9AA7B2;stroke-width:1"/><path d="M19 76 h26 v20 a7 7 0 0 1 -7 7 h-12 a7 7 0 0 1 -7 -7 Z" style="fill:#F2D9A6"/><rect x="20" y="28" width="24" height="14" rx="3" style="fill:#5D7896"/><path d="M50 42 h20 v52 a6 6 0 0 1 -6 6 h-8 a6 6 0 0 1 -6 -6 Z" style="fill:#F4F8FB;fill-opacity:.7;stroke:#9AA7B2;stroke-width:1"/><rect x="51" y="28" width="18" height="14" rx="3" style="fill:#8E5BA6"/>`+tx(44,16,"1","st-b","middle")+tx(44,122,"Hémocultures","st-sub","middle")+
   t(102,"#5B9BD5",2,"Citrate","#A7262A")+t(146,"#D9534F",3,"Sec","#A7262A")+t(190,"#4F9F5E",4,"Héparine","#A7262A")+t(234,"#8E5BB5",5,"EDTA","#A7262A")+t(278,"#9AA3AB",6,"Fluorure","#A7262A")+
   tx(160,142,"Coagulation · Biochimie · Biochimie · NFS · Glycémie","st-sub","middle"),"Ordre de prélèvement des tubes");},
 fistule:()=>sv(190,
  og("M10 72 C80 64 180 58 256 56 C292 54 312 70 312 92 C312 114 292 128 256 126 C180 124 80 120 10 114 Z","skin",false,{s:"#B98868"})+fl("M256 60 C270 70 272 110 256 122",'#C9946F',.9)+
  vs("M14 82 C70 80 120 78 160 80 C180 82 190 86 196 90",8,"#6E86C8","#3E539A",false)+fl("M40 80 q8 -6 16 0 M80 79 q8 -6 16 0 M120 78 q8 -6 16 0",'#3E539A',1)+art("M14 102 C90 100 150 96 196 92",3.6,false)+
  `<circle cx="196" cy="91" r="7" style="fill:url(#rg-nerve);stroke:#A9831B;stroke-width:1"/>`+fl("M206 84 q4 7 0 14 M212 80 q6 11 0 22 M218 76 q8 15 0 30",'#B4513A',1.1)+
  tx(206,30,"Fistule : artère reliée","st-b")+tx(206,44,"à une veine","st-sub")+LL(198,84,212,48)+
  tx(14,140,"Veine (grossit, sert à la dialyse)","st-blue st-b")+tx(14,156,"Artère","st-acc st-b")+
  tx(14,178,"Ce bras : ni tension, ni prise de sang, ni perfusion","st-acc st-b")+tx(232,108,"frémissement","st-dark")+tx(232,122,"à vérifier","st-dark"),"Fistule artério-veineuse au bras"),
 platre:()=>sv(220,
  og("M188 92 C200 88 214 88 224 90 C232 92 234 98 236 100 L266 100 C272 100 274 106 268 108 L240 110 L272 112 C278 112 278 118 272 120 L240 122 L268 124 C274 124 274 130 268 132 L238 134 L262 136 C268 136 268 142 262 142 L232 144 C222 146 206 146 188 142 Z","skin",false,{s:"#B98868"})+
  `<path d="M206 88 C210 78 220 70 232 68 C238 68 240 74 234 78 C226 82 220 88 218 92 Z" style="fill:url(#rg-skin);stroke:#B98868;stroke-width:.9"/>`+[[266,104],[270,116],[266,128],[260,139]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="3" ry="2.2" style="fill:#F9E6DC;stroke:#C9A08A;stroke-width:.6"/>`).join("")+
  `<path d="M20 86 C20 80 26 78 34 78 L192 82 C198 82 200 88 200 112 C200 136 198 144 192 144 L34 148 C26 148 20 146 20 140 Z" style="fill:url(#rg-plaster);stroke:#B9B2A4;stroke-width:1.4"/>`+fl("M40 80 L48 146 M70 80 L78 147 M100 81 L108 147 M130 81 L138 146 M160 82 L168 145",'#DCD5C8',1.2)+`<path d="M186 82 C192 84 196 96 196 112 C196 128 192 140 186 144" style="fill:none;stroke:#E9E4DA;stroke-width:4"/>`+tx(105,117,"plâtre","st-dark st-b","middle")+
  dot(268,104,"#B4513A")+
  tx(10,24,"À vérifier sur les doigts, plusieurs fois par jour :","st-b")+tx(10,44,"Couleur : rosés, pas pâles ni bleus","st-sub")+tx(10,58,"Chaleur : chauds","st-sub")+
  tx(10,166,"Mobilité : le patient bouge les doigts","st-sub")+tx(10,180,"Sensibilité : pas de fourmillements","st-sub")+tx(10,194,"Œdème : pas de gonflement qui augmente","st-sub")+
  tx(10,214,"Douleur qui augmente = urgence (syndrome des loges)","st-acc st-b"),"Surveillance des extrémités sous un plâtre"),
 perfuseur:()=>sv(250,
  `<path d="M70 2 v10" style="stroke:#8E9BA6;stroke-width:2"/><path d="M42 14 C42 10 98 10 98 14 L98 86 C98 94 86 98 70 98 C54 98 42 94 42 86 Z" style="fill:#EAF4FB;fill-opacity:.8;stroke:#8EA9BF;stroke-width:1.2"/><path d="M43 30 L97 30 L97 86 C97 93 85 97 70 97 C55 97 43 93 43 86 Z" style="fill:#CFE6F5;opacity:.85"/>`+fl("M88 40 h8 M90 52 h6 M88 64 h8 M90 76 h6",'#7FA2BD',1)+`<rect x="50" y="44" width="36" height="20" rx="2" style="fill:#fff;opacity:.85"/>`+tx(68,58,"500 mL","st-b st-dark","middle")+`<path d="M47 18 v66" style="stroke:#fff;stroke-width:3;stroke-opacity:.5;stroke-linecap:round"/>`+
  vs("M70 98 L70 112",4,"#F4F8FB","#9AA7B2",false)+`<path d="M58 112 h24 v44 a8 8 0 0 1 -8 8 h-8 a8 8 0 0 1 -8 -8 Z" style="fill:#F4F8FB;fill-opacity:.8;stroke:#9AA7B2;stroke-width:1"/><path d="M59 146 h22 v10 a7 7 0 0 1 -7 7 h-8 a7 7 0 0 1 -7 -7 Z" style="fill:#CFE6F5"/><path d="M70 116 v6" style="stroke:#9AA7B2;stroke-width:2"/><path d="M70 126 c-3 4 -3 8 0 8 c3 0 3 -4 0 -8 Z" style="fill:#9FC9E8;stroke:#5C8DB5;stroke-width:.6"/>`+
  vs("M70 164 L70 232",3,"#F4F8FB","#9AA7B2",false)+`<path d="M58 182 h24 v30 h-24 Z" style="fill:url(#rg-plastic);stroke:#8E9BA6;stroke-width:1"/><circle cx="70" cy="197" r="7" style="fill:#3E7CC4;stroke:#2A578C;stroke-width:1"/>`+fl("M65 193 h10 M64 197 h12 M65 201 h10","#9EC3E6",.8)+AR("M70 228 L70 246","#B4513A",2)+
  LL(100,50,136,50)+tx(140,46,"Poche","st-b")+tx(140,60,"volume à passer (mL)","st-sub")+
  LL(84,134,136,124)+tx(140,120,"Chambre compte-gouttes","st-b")+tx(140,134,"on compte les gouttes","st-sub")+tx(140,148,"pendant 1 minute","st-sub")+
  LL(80,197,136,192)+tx(140,188,"Molette (régulateur)","st-b")+tx(140,202,"règle le débit","st-sub")+
  tx(140,230,"Standard : 20 gouttes = 1 mL","st-acc st-b")+tx(140,244,"Précision : 60 gouttes = 1 mL","st-sub"),"Perfuseur par gravité : poche, chambre compte-gouttes, molette")
});
