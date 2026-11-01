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
