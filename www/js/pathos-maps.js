/* Carnet IFSI — schémas d'organes des pathologies (zone atteinte en couleur, numéros pour les exercices). Chargé avant pathos.js. */
const PM_LAB=(x,y,t,on,a="start")=>tx(x,y,t,on?"st-acc st-b":"st-sub",a);
const pmCls=(on,kind)=>kind==="s"?(on?"s-acc":"s-ln"):(on?"f-coral":"f-soft");
const PMAPS={
 coeur:{titre:"Le cœur",zones:{od:"Oreillette droite",og:"Oreillette gauche",vd:"Ventricule droit",vg:"Ventricule gauche",aorte:"Aorte",ap:"Artère pulmonaire",valves:"Valves",coronaires:"Artères coronaires",pericarde:"Péricarde",myocarde:"Muscle cardiaque (myocarde)",conduction:"Système électrique",veines:"Veines caves"},
  pts:{od:[128,100],og:[192,100],vd:[128,152],vg:[192,156],aorte:[232,46],ap:[80,58],valves:[190,125],coronaires:[226,128],pericarde:[262,150],myocarde:[160,196],conduction:[118,90],veines:[98,34]},
  draw(h,num){const on=k=>h.includes(k),lb=!num;
   return sv(232,
    `<path d="M160 214 C 62 166, 52 98, 92 70 C 118 52, 148 58, 160 80 C 172 58, 202 52, 228 70 C 268 98, 258 166, 160 214 Z" class="${on("pericarde")?"s-acc":"s-ln"}" stroke-dasharray="5 4" fill="none" transform="translate(160 132) scale(1.1) translate(-160 -132)"/>`+
    `<path d="M160 206 C 70 160, 60 98, 96 74 C 120 58, 148 64, 160 84 C 172 64, 200 58, 224 74 C 260 98, 250 160, 160 206 Z" class="${on("myocarde")?"f-coral":"f-box"}"/>`+
    `<path d="M112 92 L 96 36" class="${pmCls(on("veines"),"s")}" style="stroke-width:7" stroke-linecap="round" fill="none"/>`+
    `<path d="M132 84 C 126 52, 100 44, 84 56" class="${pmCls(on("ap"),"s")}" style="stroke-width:8" stroke-linecap="round" fill="none"/>`+
    `<path d="M190 84 C 190 38, 244 30, 252 66" class="${pmCls(on("aorte"),"s")}" style="stroke-width:9" stroke-linecap="round" fill="none"/>`+
    `<rect x="106" y="86" width="46" height="34" rx="10" class="${pmCls(on("od"))}"/><rect x="168" y="86" width="46" height="34" rx="10" class="${pmCls(on("og"))}"/>`+
    `<rect x="106" y="128" width="46" height="46" rx="12" class="${pmCls(on("vd"))}"/><rect x="168" y="128" width="48" height="56" rx="14" class="${pmCls(on("vg"))}"/>`+
    `<path d="M112 124 H 146 M174 124 H 210 M184 82 H 198 M126 82 H 140" class="${on("valves")?"s-acc":"s-ln"}" style="stroke-width:3"/>`+
    `<path d="M196 88 C 238 104, 240 152, 210 188 M146 92 C 106 110, 104 150, 126 182" class="${on("coronaires")?"s-acc":"s-ln"}" fill="none" style="stroke-width:${on("coronaires")?3:1.5}"/>`+
    `<circle cx="118" cy="92" r="4.5" class="${on("conduction")?"f-acc":"f-sub"}"/><circle cx="160" cy="124" r="4" class="${on("conduction")?"f-acc":"f-sub"}"/><path d="M160 128 V 184" class="${on("conduction")?"s-acc":"s-ln"}" stroke-dasharray="${on("conduction")?"0":"3 3"}"/>`+
    (lb?PM_LAB(4,104,"Oreillette\ndroite",on("od"))+PM_LAB(316,104,"Oreillette\ngauche",on("og"),"end")+PM_LAB(4,156,"Ventricule\ndroit",on("vd"))+PM_LAB(316,162,"Ventricule\ngauche",on("vg"),"end")+PM_LAB(258,58,"Aorte",on("aorte"))+PM_LAB(40,48,"Artère\npulmonaire",on("ap"))+PM_LAB(104,24,"Veine cave",on("veines"))
     +(on("coronaires")?PM_LAB(232,206,"Coronaires",1):"")+(on("pericarde")?PM_LAB(270,214,"Péricarde",1,"end"):"")+(on("conduction")?PM_LAB(60,80,"Nœud sinusal",1):"")+(on("valves")?PM_LAB(160,226,"Valves",1,"middle"):"")+(on("myocarde")&&!on("valves")?PM_LAB(160,226,"Myocarde",1,"middle"):""):"")+
    (num?pmNums(this,num):""),"Schéma du cœur");}},
 poumons:{titre:"L'appareil respiratoire",zones:{larynx:"Larynx",trachee:"Trachée",bronches:"Bronches",poumons:"Poumons (tissu pulmonaire)",alveoles:"Alvéoles",plevre:"Plèvre",diaphragme:"Diaphragme",vaisseaux:"Vaisseaux pulmonaires"},
  pts:{larynx:[160,22],trachee:[160,56],bronches:[184,92],poumons:[100,140],alveoles:[218,168],plevre:[262,120],diaphragme:[160,212],vaisseaux:[140,116]},
  draw(h,num){const on=k=>h.includes(k),lb=!num;
   return sv(226,
    `<path d="M138 82 C 92 88, 64 142, 72 200 C 96 212, 132 206, 146 194 L 146 96 Z" class="${on("plevre")?"s-acc":"s-ln"}" fill="none" stroke-dasharray="5 4" transform="translate(110 145) scale(1.07) translate(-110 -145)"/>`+
    `<path d="M182 82 C 228 88, 256 142, 248 200 C 224 212, 188 206, 174 194 L 174 96 Z" class="${on("plevre")?"s-acc":"s-ln"}" fill="none" stroke-dasharray="5 4" transform="translate(210 145) scale(1.07) translate(-210 -145)"/>`+
    `<path d="M138 82 C 92 88, 64 142, 72 200 C 96 212, 132 206, 146 194 L 146 96 Z" class="${pmCls(on("poumons"))}"/><path d="M182 82 C 228 88, 256 142, 248 200 C 224 212, 188 206, 174 194 L 174 96 Z" class="${pmCls(on("poumons"))}"/>`+
    `<rect x="150" y="14" width="20" height="16" rx="6" class="${pmCls(on("larynx"))}"/><rect x="154" y="30" width="12" height="44" rx="5" class="${pmCls(on("trachee"))}"/>`+
    `<path d="M160 74 L 128 104 L 112 132 M160 74 L 192 104 L 208 132 M128 104 L 120 150 M192 104 L 200 150" class="${on("bronches")?"s-acc":"s-ln"}" style="stroke-width:${on("bronches")?4:3}" fill="none" stroke-linecap="round"/>`+
    `<path d="M160 104 C 140 112, 118 118, 96 120 M160 104 C 180 112, 202 118, 224 120" class="${on("vaisseaux")?"s-acc":"s-blue"}" fill="none" style="stroke-width:${on("vaisseaux")?3:1.5}"/>`+
    [[206,166],[216,160],[226,166],[211,176],[222,176],[100,170],[90,164],[96,180]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5" class="${on("alveoles")?"f-acc":"f-soft"}" stroke="currentColor" stroke-opacity=".2"/>`).join("")+
    `<path d="M64 210 C 120 192, 200 192, 256 210" class="${on("diaphragme")?"s-acc":"s-ln"}" style="stroke-width:${on("diaphragme")?3.5:2}" fill="none"/>`+
    (lb?PM_LAB(178,24,"Larynx",on("larynx"))+PM_LAB(176,52,"Trachée",on("trachee"))+PM_LAB(214,96,"Bronches",on("bronches"))+PM_LAB(4,120,"Poumon\ndroit",on("poumons"))+PM_LAB(316,96,"Poumon\ngauche",on("poumons"),"end")+PM_LAB(316,196,"Alvéoles",on("alveoles"),"end")+PM_LAB(160,224,"Diaphragme",on("diaphragme"),"middle")
     +(on("plevre")?PM_LAB(4,212,"Plèvre",1):"")+(on("vaisseaux")?PM_LAB(4,150,"Vaisseaux",1):""):"")+
    (num?pmNums(this,num):""),"Schéma de l'appareil respiratoire");}},
 jambe:{titre:"Les vaisseaux de la jambe",zones:{aorte:"Aorte abdominale",arteres:"Artères de la jambe",veinesp:"Veines profondes",veiness:"Veines superficielles (saphène)",mollet:"Mollet",pied:"Pied"},
  pts:{aorte:[160,18],arteres:[140,96],veinesp:[176,120],veiness:[198,150],mollet:[214,176],pied:[186,214]},
  draw(h,num){const on=k=>h.includes(k),lb=!num;
   return sv(230,
    `<path d="M128 26 C 122 70, 126 120, 134 160 C 138 186, 140 200, 138 212 L 196 218 C 196 210, 180 204, 178 196 C 186 160, 196 120, 194 70 L 192 26 Z" class="f-box"/>`+
    `<ellipse cx="180" cy="168" rx="22" ry="26" class="${on("mollet")?"f-coral":"f-soft"}" opacity=".85"/>`+
    `<path d="M138 210 L 198 218 L 206 226 L 136 222 Z" class="${pmCls(on("pied"))}"/>`+
    `<path d="M156 8 V 30 C 150 80, 146 130, 150 200" class="${on("arteres")?"s-acc":"s-ln"}" style="stroke-width:${on("arteres")?4:2.5}" fill="none" stroke-linecap="round"/>`+
    `<path d="M156 8 V 28" class="${on("aorte")?"s-acc":"s-ln"}" style="stroke-width:7" stroke-linecap="round"/>`+
    `<path d="M168 30 C 166 80, 164 130, 166 200" class="${on("veinesp")?"s-acc":"s-blue"}" style="stroke-width:${on("veinesp")?4:2.5}" fill="none" stroke-linecap="round"/>`+
    `<path d="M186 30 C 192 90, 200 130, 192 200" class="${on("veiness")?"s-acc":"s-blue"}" style="stroke-width:${on("veiness")?3.5:1.8}" fill="none" stroke-dasharray="${on("veiness")?"0":"4 3"}"/>`+
    (lb?PM_LAB(170,14,"Aorte",on("aorte"))+PM_LAB(4,96,"Artère\nfémorale",on("arteres"))+PM_LAB(4,150,"Veines\nprofondes",on("veinesp"))+PM_LAB(316,96,"Veine\nsaphène",on("veiness"),"end")+PM_LAB(316,170,"Mollet",on("mollet"),"end")+PM_LAB(220,224,"Pied",on("pied")):"")+
    (num?pmNums(this,num):""),"Schéma des vaisseaux de la jambe");}}
};
function pmNums(map,keys){return keys.map((k,i)=>{const [x,y]=map.pts[k]||[0,0];return `<circle cx="${x}" cy="${y}" r="9" class="f-acc"/><text x="${x}" y="${y+4}" text-anchor="middle" style="fill:#fff;font-weight:700;font-size:11px">${i+1}</text>`;}).join("");}
function pmFig(z,cap){const m=PMAPS[z[0]];if(!m)return "";const zs=z.slice(1);
 return `<figure class="sch-fig"><div class="sch-head"><span class="sch-kick">Où ça se passe</span><strong>${esc(m.titre)}</strong><small>${zs.map(k=>m.zones[k]).filter(Boolean).map(esc).join(" · ")}</small></div>${m.draw(zs)}${cap?`<figcaption>${md(cap)}</figcaption>`:""}</figure>`;}

/* Contour discret des organes, épaisseur de trait réglée en style (les classes CSS l'emportent sur les attributs SVG). */
const PM_OL='style="stroke:var(--fx-sub);stroke-opacity:.45;stroke-width:1.2"';
const pmT=(on,w,off="s-ln")=>`class="${on?"s-acc":off}" style="stroke-width:${w};stroke-linecap:round;fill:none"`;
Object.assign(PMAPS,{
 cerveau:{titre:"Le système nerveux central",zones:{frontal:"Lobe frontal",parietal:"Lobe pariétal",temporal:"Lobe temporal",occipital:"Lobe occipital",cervelet:"Cervelet",tronc:"Tronc cérébral",meninges:"Méninges",ventricules:"Ventricules (LCR)",vaisseaux:"Artères cérébrales",moelle:"Moelle épinière",nerfs:"Nerfs périphériques"},
  pts:{frontal:[108,80],parietal:[196,62],temporal:[156,128],occipital:[238,96],cervelet:[226,160],tronc:[180,170],meninges:[166,19],ventricules:[160,96],vaisseaux:[122,116],moelle:[180,216],nerfs:[216,212]},
  draw(h,num){const on=k=>h.includes(k),lb=!num;
   return sv(236,
    `<path d="M166 31 C 120 30, 82 46, 68 78 C 60 96, 64 114, 76 124 C 90 140, 130 148, 168 146 C 186 146, 206 142, 236 138 C 248 130, 256 118, 258 100 C 260 78, 248 58, 230 46 C 216 36, 196 31, 166 31 Z" class="${on("meninges")?"s-acc":"s-ln"}" stroke-dasharray="5 4" fill="none" transform="translate(163 90) scale(1.08) translate(-163 -90)"/>`+
    `<path d="M172 140 C 182 142, 190 148, 190 160 L 186 196 L 172 196 L 170 160 C 168 150, 168 144, 172 140 Z" class="${pmCls(on("tronc"))}" ${PM_OL}/>`+
    `<path d="M173 202 L 146 210 M173 216 L 144 228 M186 202 L 214 210 M186 216 L 216 228" ${pmT(on("nerfs"),on("nerfs")?2.5:1.2)}/>`+
    `<rect x="172" y="194" width="15" height="36" rx="6" class="${pmCls(on("moelle"))}" ${PM_OL}/>`+
    `<path d="M194 150 C 202 138, 236 136, 252 144 C 262 152, 258 170, 240 174 C 222 178, 200 172, 194 164 Z" class="${pmCls(on("cervelet"))}" ${PM_OL}/>`+
    `<path d="M196 152 C 214 150, 238 150, 252 156 M198 162 C 216 160, 236 162, 248 166" class="s-ln" style="stroke-width:.8;opacity:.6"/>`+
    `<path d="M166 31 C 120 30, 82 46, 68 78 C 60 96, 64 114, 76 124 L 94 124 C 112 112, 132 102, 150 97 Z" class="${pmCls(on("frontal"))}" ${PM_OL}/>`+
    `<path d="M166 31 C 196 31, 216 36, 230 46 L 216 110 C 208 104, 200 100, 194 100 C 178 98, 162 97, 150 97 Z" class="${pmCls(on("parietal"))}" ${PM_OL}/>`+
    `<path d="M230 46 C 248 58, 260 78, 258 100 C 256 118, 248 130, 236 138 L 222 132 L 216 110 Z" class="${pmCls(on("occipital"))}" ${PM_OL}/>`+
    `<path d="M94 124 C 112 112, 132 102, 150 97 C 162 97, 178 98, 194 100 C 200 100, 208 104, 216 110 L 222 132 C 206 142, 186 146, 168 146 C 140 148, 112 146, 98 138 C 92 134, 90 128, 94 124 Z" class="${pmCls(on("temporal"))}" ${PM_OL}/>`+
    `<path d="M118 96 C 132 80, 176 76, 204 90 C 196 96, 182 94, 172 100 C 162 106, 150 114, 138 118 C 134 108, 126 102, 118 96 Z" class="${on("ventricules")?"f-coral":"f-blue"}" opacity="${on("ventricules")?1:.45}"/>`+
    `<path d="M176 150 C 160 132, 140 122, 110 116 M176 150 C 176 120, 186 90, 214 70 M176 150 C 150 104, 140 72, 128 46" ${pmT(on("vaisseaux"),on("vaisseaux")?2.5:1)} opacity="${on("vaisseaux")?1:.55}"/>`+
    (lb?PM_LAB(4,62,"Lobe\nfrontal",on("frontal"))+PM_LAB(316,30,"Lobe\npariétal",on("parietal"),"end")+PM_LAB(316,96,"Lobe\noccipital",on("occipital"),"end")+PM_LAB(4,142,"Lobe\ntemporal",on("temporal"))+PM_LAB(316,168,"Cervelet",on("cervelet"),"end")+PM_LAB(106,184,"Tronc\ncérébral",on("tronc"))+PM_LAB(222,228,"Moelle épinière",on("moelle"))
     +(on("meninges")?PM_LAB(4,22,"Méninges",1):"")+(on("ventricules")?PM_LAB(4,226,"Ventricules (LCR)",1):"")+(on("vaisseaux")?PM_LAB(4,198,"Artères\ncérébrales",1):"")+(on("nerfs")?PM_LAB(226,204,"Nerfs",1):""):"")+
    (num?pmNums(this,num):""),"Schéma du cerveau vu de profil");}},
 digestif:{titre:"L'appareil digestif",zones:{oesophage:"Œsophage",estomac:"Estomac",foie:"Foie",vesicule:"Vésicule et voies biliaires",pancreas:"Pancréas",grele:"Intestin grêle",colon:"Côlon",appendice:"Appendice",rectum:"Rectum et anus",peritoine:"Péritoine"},
  pts:{oesophage:[166,30],foie:[110,78],vesicule:[134,102],estomac:[206,88],pancreas:[194,129],grele:[162,172],colon:[230,172],appendice:[94,224],rectum:[167,226],peritoine:[240,206]},
  draw(h,num){const on=k=>h.includes(k),lb=!num;
   return sv(240,
    `<path d="M88 14 C 70 60, 66 130, 72 196 C 76 224, 104 236, 160 236 C 216 236, 244 224, 248 196 C 254 130, 250 60, 232 14" class="f-box"/>`+
    `<path d="M80 108 C 76 150, 78 190, 90 214 C 116 230, 204 230, 230 214 C 242 190, 244 150, 240 108" class="${on("peritoine")?"s-acc":"s-ln"}" stroke-dasharray="5 4" fill="none"/>`+
    `<path d="M164 6 L 168 66" ${pmT(on("oesophage"),8,"s-tube")}/>`+
    `<path d="M148 126 C 168 120, 212 120, 232 124 C 228 132, 200 134, 176 134 C 160 134, 148 132, 148 126 Z" class="${pmCls(on("pancreas"))}" ${PM_OL}/>`+
    `<path d="M168 62 C 196 56, 234 66, 230 96 C 226 118, 196 124, 176 114 C 168 108, 172 98, 180 94 C 190 88, 178 76, 168 74 Z" class="${pmCls(on("estomac"))}" ${PM_OL}/>`+
    `<path d="M76 70 C 90 54, 150 54, 172 64 C 168 82, 150 96, 122 100 C 98 102, 80 94, 76 70 Z" class="${pmCls(on("foie"))}" ${PM_OL}/>`+
    `<ellipse cx="134" cy="102" rx="9" ry="6" class="${pmCls(on("vesicule"))}" ${PM_OL}/><path d="M140 104 C 146 110, 150 116, 156 122" ${pmT(on("vesicule"),on("vesicule")?2.5:1.2)}/>`+
    `<path d="M100 214 L 98 146 C 98 136, 104 132, 112 132 L 214 136 C 224 136, 232 140, 232 150 L 232 196 C 232 208, 220 212, 206 210 C 190 208, 176 214, 170 222" ${pmT(on("colon"),on("colon")?10:9,"s-tube")}/>`+
    `<path d="M122 152 C 140 144, 160 158, 180 150 C 200 144, 212 158, 200 168 C 186 178, 150 162, 132 172 C 116 182, 130 196, 150 192 C 170 188, 190 198, 208 188" ${pmT(on("grele"),on("grele")?6:5,"s-tube")} opacity="${on("grele")?1:.7}"/>`+
    `<path d="M100 216 L 92 228" ${pmT(on("appendice"),6,"s-tube")}/>`+
    `<path d="M170 222 L 168 236" ${pmT(on("rectum"),9,"s-tube")}/>`+
    (lb?PM_LAB(178,16,"Œsophage",on("oesophage"))+PM_LAB(4,66,"Foie",on("foie"))+PM_LAB(4,104,"Vésicule\nbiliaire",on("vesicule"))+PM_LAB(316,72,"Estomac",on("estomac"),"end")+PM_LAB(316,130,"Pancréas",on("pancreas"),"end")+PM_LAB(316,176,"Côlon",on("colon"),"end")+PM_LAB(4,168,"Intestin\ngrêle",on("grele"))+PM_LAB(4,224,"Appendice",on("appendice"))+PM_LAB(184,236,"Rectum",on("rectum"))
     +(on("peritoine")?PM_LAB(316,226,"Péritoine",1,"end"):""):"")+
    (num?pmNums(this,num):""),"Schéma de l'appareil digestif");}},
 rein:{titre:"L'appareil urinaire",zones:{reins:"Reins",surrenales:"Glandes surrénales",ureteres:"Uretères",vessie:"Vessie",uretre:"Urètre",prostate:"Prostate",vaisseaux:"Aorte et veine cave"},
  pts:{reins:[88,80],surrenales:[92,36],ureteres:[126,140],vessie:[160,186],uretre:[162,226],prostate:[140,213],vaisseaux:[152,42]},
  draw(h,num){const on=k=>h.includes(k),lb=!num;
   return sv(232,
    `<path d="M152 14 V 164" ${pmT(on("vaisseaux"),6)}/><path d="M168 14 V 164" class="${on("vaisseaux")?"s-acc":"s-blue"}" style="stroke-width:6;stroke-linecap:round;fill:none;opacity:${on("vaisseaux")?1:.7}"/>`+
    `<path d="M152 80 H 106 M168 84 H 214" ${pmT(on("vaisseaux"),on("vaisseaux")?3:1.5)}/>`+
    `<path d="M88 46 C 70 50, 66 100, 86 112 C 100 120, 112 108, 108 92 C 104 84, 106 72, 112 66 C 114 54, 102 42, 88 46 Z" class="${pmCls(on("reins"))}" ${PM_OL}/>`+
    `<path d="M232 46 C 250 50, 254 100, 234 112 C 220 120, 208 108, 212 92 C 216 84, 214 72, 208 66 C 206 54, 218 42, 232 46 Z" class="${pmCls(on("reins"))}" ${PM_OL}/>`+
    `<path d="M78 48 L 92 28 L 108 46 Z M242 48 L 228 28 L 212 46 Z" class="${on("surrenales")?"f-coral":"f-amber"}" opacity="${on("surrenales")?1:.6}"/>`+
    `<path d="M104 98 C 120 122, 136 150, 146 174 M216 98 C 200 122, 184 150, 174 174" ${pmT(on("ureteres"),on("ureteres")?3.5:2)}/>`+
    `<path d="M130 174 C 130 162, 190 162, 190 174 C 192 196, 176 206, 160 206 C 144 206, 128 196, 130 174 Z" class="${pmCls(on("vessie"))}" ${PM_OL}/>`+
    `<ellipse cx="160" cy="212" rx="15" ry="8" class="${on("prostate")?"f-coral":"f-soft"}" ${PM_OL}/>`+
    `<path d="M160 206 L 160 230" ${pmT(on("uretre"),on("uretre")?4:3)}/>`+
    (lb?PM_LAB(4,84,"Rein",on("reins"))+PM_LAB(316,84,"Rein",on("reins"),"end")+PM_LAB(4,26,"Glande\nsurrénale",on("surrenales"))+PM_LAB(4,144,"Uretère",on("ureteres"))+PM_LAB(316,190,"Vessie",on("vessie"),"end")+PM_LAB(4,212,"Prostate\n(homme)",on("prostate"))+PM_LAB(174,230,"Urètre",on("uretre"))+PM_LAB(178,24,"Aorte et\nveine cave",on("vaisseaux")):"")+
    (num?pmNums(this,num):""),"Schéma de l'appareil urinaire");}},
 glandes:{titre:"Les glandes endocrines",zones:{hypophyse:"Hypophyse",thyroide:"Thyroïde",parathyroides:"Parathyroïdes",surrenales:"Glandes surrénales",pancreas:"Pancréas (îlots)",gonades:"Ovaires ou testicules"},
  pts:{hypophyse:[160,40],thyroide:[160,63],parathyroides:[179,81],surrenales:[128,127],pancreas:[172,180],gonades:[140,214]},
  draw(h,num){const on=k=>h.includes(k),lb=!num;
   return sv(236,
    `<circle cx="160" cy="34" r="24" class="f-box"/><rect x="150" y="56" width="20" height="36" class="f-box"/>`+
    `<path d="M136 90 C 104 96, 96 120, 98 160 L 104 232 L 216 232 L 222 160 C 224 120, 216 96, 184 90 Z" class="f-box"/>`+
    `<circle cx="160" cy="40" r="5.5" class="${on("hypophyse")?"f-acc":"f-amber"}"/>`+
    `<path d="M160 70 C 156 62, 142 62, 142 72 C 142 82, 154 84, 160 76 C 166 84, 178 82, 178 72 C 178 62, 164 62, 160 70 Z" class="${pmCls(on("thyroide"))}" ${PM_OL}/>`+
    [[146,66],[146,78],[174,66],[174,78]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3" class="${on("parathyroides")?"f-acc":"f-amber"}"/>`).join("")+
    `<ellipse cx="128" cy="152" rx="10" ry="16" class="f-soft" ${PM_OL}/><ellipse cx="192" cy="152" rx="10" ry="16" class="f-soft" ${PM_OL}/>`+
    `<path d="M118 138 L 128 124 L 138 138 Z M182 138 L 192 124 L 202 138 Z" class="${on("surrenales")?"f-coral":"f-amber"}" opacity="${on("surrenales")?1:.7}"/>`+
    `<path d="M136 178 C 150 170, 190 170, 206 176 C 200 184, 176 186, 158 186 C 146 186, 136 184, 136 178 Z" class="${pmCls(on("pancreas"))}" ${PM_OL}/>`+
    `<ellipse cx="140" cy="214" rx="9" ry="6" class="${pmCls(on("gonades"))}" ${PM_OL}/><ellipse cx="180" cy="214" rx="9" ry="6" class="${pmCls(on("gonades"))}" ${PM_OL}/>`+
    (lb?PM_LAB(4,44,"Hypophyse",on("hypophyse"))+PM_LAB(316,66,"Thyroïde",on("thyroide"),"end")+PM_LAB(4,80,"Parathyroïdes",on("parathyroides"))+PM_LAB(316,130,"Surrénales",on("surrenales"),"end")+PM_LAB(4,184,"Pancréas",on("pancreas"))+PM_LAB(316,210,"Ovaires ou\ntesticules",on("gonades"),"end"):"")+
    (num?pmNums(this,num):""),"Schéma des glandes endocrines");}},
 squelette:{titre:"Le squelette",zones:{rachis:"Colonne vertébrale",epaule:"Épaules",poignet:"Poignets",mains:"Mains et doigts",bassin:"Bassin (articulations sacro-iliaques)",hanche:"Hanches",genou:"Genoux",pied:"Pieds (gros orteil)"},
  pts:{rachis:[160,88],epaule:[124,54],poignet:[104,142],mains:[222,160],bassin:[160,124],hanche:[138,142],genou:[186,194],pied:[124,230]},
  draw(h,num){const on=k=>h.includes(k),lb=!num,J=(x,y,k,r=7)=>`<circle cx="${x}" cy="${y}" r="${r}" class="${on(k)?"f-coral":"f-soft"}" ${PM_OL}/>`;
   const bone=(d,w=5)=>`<path d="${d}" class="s-ln" style="stroke-width:${w};stroke-linecap:round;fill:none;opacity:.55"/>`;
   return sv(240,
    `<circle cx="160" cy="22" r="14" class="f-box"/>`+
    `<ellipse cx="160" cy="76" rx="30" ry="25" class="s-ln" style="stroke-width:1.2;fill:none;opacity:.7"/>`+
    bone("M124 54 L 196 54",3)+bone("M124 54 L 112 100 L 104 142")+bone("M196 54 L 208 100 L 216 142")+
    bone("M138 142 L 134 192 L 130 226")+bone("M182 142 L 186 192 L 190 226")+
    [...Array(9).keys()].map(i=>`<rect x="154" y="${40+i*9.5}" width="12" height="7.5" rx="2" class="${on("rachis")?"f-coral":"f-soft"}" ${PM_OL}/>`).join("")+
    `<path d="M128 126 C 132 118, 188 118, 192 126 L 186 146 C 176 140, 144 140, 134 146 Z" class="${on("bassin")?"f-coral":"f-box"}"/>`+
    J(124,54,"epaule")+J(196,54,"epaule")+J(104,142,"poignet",5)+J(216,142,"poignet",5)+J(138,142,"hanche")+J(182,142,"hanche")+J(134,194,"genou")+J(186,194,"genou")+
    `<path d="M96 148 l -6 14 M100 149 l -2 15 M105 149 l 2 15 M109 148 l 5 13 M224 148 l 6 14 M220 149 l 2 15 M215 149 l -2 15 M211 148 l -5 13" ${pmT(on("mains"),on("mains")?3:2)}/>`+
    `<path d="M130 226 L 114 234 M190 226 L 206 234" ${pmT(on("pied"),on("pied")?5:4)}/>`+`<circle cx="114" cy="234" r="4" class="${on("pied")?"f-acc":"f-soft"}" ${PM_OL}/><circle cx="206" cy="234" r="4" class="${on("pied")?"f-acc":"f-soft"}" ${PM_OL}/>`+
    (lb?PM_LAB(186,34,"Rachis",on("rachis"))+PM_LAB(4,50,"Épaule",on("epaule"))+PM_LAB(4,140,"Poignet",on("poignet"))+PM_LAB(316,168,"Mains",on("mains"),"end")+PM_LAB(316,118,"Bassin",on("bassin"),"end")+PM_LAB(316,146,"Hanche",on("hanche"),"end")+PM_LAB(316,198,"Genou",on("genou"),"end")+PM_LAB(4,232,"Gros orteil",on("pied")):"")+
    (num?pmNums(this,num):""),"Schéma du squelette");}},
 sang:{titre:"Le sang et ses usines",zones:{moelle:"Moelle osseuse",gr:"Globules rouges",gb:"Globules blancs",plaquettes:"Plaquettes",coag:"Coagulation (caillot)",ganglions:"Ganglions lymphatiques",rate:"Rate"},
  pts:{moelle:[64,116],gr:[160,80],gb:[128,150],plaquettes:[188,146],coag:[208,166],ganglions:[272,72],rate:[268,172]},
  draw(h,num){const on=k=>h.includes(k),lb=!num;
   return sv(232,
    `<path d="M48 20 C 36 20, 32 36, 44 42 L 46 188 C 34 194, 38 214, 52 210 C 58 218, 72 218, 76 208 C 90 212, 92 192, 80 188 L 78 42 C 90 36, 86 20, 72 22 C 64 14, 56 14, 48 20 Z" class="f-box"/>`+
    `<rect x="53" y="48" width="20" height="136" rx="9" class="${on("moelle")?"f-coral":"f-amber"}" opacity="${on("moelle")?1:.55}"/>`+
    `<rect x="100" y="60" width="122" height="112" rx="22" class="f-soft" ${PM_OL}/>`+
    [[124,86],[160,80],[196,90],[140,114],[184,118]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="13" ry="7.5" class="${on("gr")?"f-acc":"f-coral"}" opacity="${on("gr")?1:.6}"/>`).join("")+
    `<circle cx="128" cy="150" r="12" class="${on("gb")?"f-acc":"f-blue"}" opacity="${on("gb")?1:.7}"/><path d="M122 148 C 126 142, 132 146, 130 150 C 136 152, 132 158, 126 155" class="s-ln" style="stroke-width:1.6;fill:none"/>`+
    [[172,146],[182,153],[192,141],[203,150]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3.4" class="${on("plaquettes")?"f-acc":"f-amber"}"/>`).join("")+
    `<path d="M174 166 L 216 140 M184 170 L 220 154 M170 156 L 212 172" ${pmT(on("coag"),on("coag")?2.2:1)} opacity="${on("coag")?1:.5}"/>`+
    `<path d="M244 30 L 262 50 L 282 70 L 268 92 L 252 120" class="s-ln" style="stroke-width:1.2;fill:none;opacity:.6"/>`+
    [[262,50],[282,70],[268,92]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="8" ry="6" class="${pmCls(on("ganglions"))}" ${PM_OL}/>`).join("")+
    `<path d="M252 160 C 262 146, 290 150, 290 170 C 290 190, 262 196, 252 182 C 258 176, 258 166, 252 160 Z" class="${pmCls(on("rate"))}" ${PM_OL}/>`+
    (lb?PM_LAB(62,228,"Moelle osseuse",on("moelle"),"middle")+PM_LAB(160,52,"Globules rouges",on("gr"),"middle")+PM_LAB(128,182,"Globules\nblancs",on("gb"),"middle")+PM_LAB(196,184,"Plaquettes",on("plaquettes"),"middle")+PM_LAB(316,120,"Ganglions",on("ganglions"),"end")+PM_LAB(316,212,"Rate",on("rate"),"end")
     +(on("coag")?PM_LAB(196,218,"Caillot",1,"middle"):""):"")+
    (num?pmNums(this,num):""),"Schéma du sang, de la moelle et des organes lymphoïdes");}},
 peau:{titre:"La peau en coupe",zones:{epiderme:"Épiderme",derme:"Derme",hypoderme:"Hypoderme",follicule:"Poil et glande sébacée",sudoripare:"Glande sudoripare",vaisseaux:"Vaisseaux de la peau"},
  pts:{epiderme:[46,46],derme:[46,92],hypoderme:[46,162],follicule:[104,94],sudoripare:[186,138],vaisseaux:[150,106]},
  draw(h,num){const on=k=>h.includes(k),lb=!num;
   return sv(224,
    `<rect x="16" y="128" width="210" height="64" class="${on("hypoderme")?"f-coral":"f-amber"}" opacity="${on("hypoderme")?.9:.35}" ${PM_OL}/>`+
    [[44,150],[74,164],[110,150],[150,166],[186,152],[208,172],[60,180],[130,182]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="10" class="f-box" opacity=".6"/>`).join("")+
    `<rect x="16" y="56" width="210" height="72" class="${on("derme")?"f-coral":"f-soft"}" ${PM_OL}/>`+
    `<path d="M16 40 C 44 32, 72 48, 100 40 C 128 32, 156 48, 184 40 C 204 34, 218 40, 226 40 L 226 56 L 16 56 Z" class="${on("epiderme")?"f-acc":"f-coral"}" opacity="${on("epiderme")?1:.55}"/>`+
    `<path d="M16 104 C 60 96, 110 112, 160 102 C 190 96, 210 106, 226 102" class="${on("vaisseaux")?"s-acc":"s-ln"}" style="stroke-width:${on("vaisseaux")?3:1.6};fill:none"/><path d="M16 114 C 60 108, 110 122, 160 112 C 190 106, 210 116, 226 112" class="${on("vaisseaux")?"s-acc":"s-blue"}" style="stroke-width:${on("vaisseaux")?3:1.4};fill:none;opacity:.8"/>`+
    `<path d="M104 6 L 106 112" ${pmT(on("follicule"),on("follicule")?3:2)}/><ellipse cx="106" cy="114" rx="7" ry="9" class="${pmCls(on("follicule"))}" ${PM_OL}/><ellipse cx="120" cy="76" rx="7" ry="5" class="${on("follicule")?"f-coral":"f-amber"}" opacity=".9"/>`+
    `<path d="M184 40 L 184 70 C 178 82, 192 92, 184 104 C 176 116, 196 124, 186 134 C 178 142, 196 146, 190 138" ${pmT(on("sudoripare"),on("sudoripare")?2.6:1.6)}/>`+
    (lb?PM_LAB(236,46,"Épiderme",on("epiderme"))+PM_LAB(236,92,"Derme",on("derme"))+PM_LAB(236,162,"Hypoderme",on("hypoderme"))+PM_LAB(96,218,"Graisse de l'hypoderme",0,"middle")
     +(on("follicule")?PM_LAB(236,20,"Poil",1):"")+(on("sudoripare")?PM_LAB(236,128,"Glande\nsudoripare",1):"")+(on("vaisseaux")?PM_LAB(236,112,"Vaisseaux",1):""):"")+
    (num?pmNums(this,num):""),"Schéma de la peau en coupe");}},
 corps:{titre:"Le corps entier",zones:{tete:"Cerveau et méninges",orl:"Nez, gorge, oreilles",poumons:"Poumons",coeur:"Cœur",abdomen:"Appareil digestif",urinaire:"Voies urinaires",genital:"Organes génitaux",os:"Os",articulations:"Articulations",sang:"Sang (circulation)",peau:"Peau"},
  pts:{tete:[160,22],orl:[180,40],poumons:[138,86],coeur:[170,100],abdomen:[160,132],urinaire:[160,155],genital:[160,178],os:[124,192],articulations:[192,206],sang:[234,124],peau:[106,112]},
  draw(h,num){const on=k=>h.includes(k),lb=!num;
   return sv(240,
    `<path d="M120 54 C 110 56, 104 66, 104 80 L 106 150 C 108 160, 116 166, 126 168 L 194 168 C 204 166, 212 160, 214 150 L 216 80 C 216 66, 210 56, 200 54 Z" class="f-box" ${on("peau")?'style="stroke:var(--fx-coral);stroke-width:3"':""}/>`+
    `<circle cx="160" cy="26" r="17" class="f-box" ${on("peau")?'style="stroke:var(--fx-coral);stroke-width:3"':""}/><rect x="152" y="42" width="16" height="12" class="f-box"/>`+
    `<path d="M112 62 L 90 120 L 82 162 M208 62 L 230 120 L 238 162" class="s-ln" style="stroke-width:9;stroke-linecap:round;fill:none;opacity:.35"/>`+
    `<path d="M134 168 L 130 234 M186 168 L 190 234" class="s-ln" style="stroke-width:11;stroke-linecap:round;fill:none;opacity:.35"/>`+
    `<path d="M208 62 L 230 120 L 238 162" ${pmT(on("sang"),on("sang")?3.5:2,"s-ln")} opacity="${on("sang")?1:.7}"/>`+
    `<circle cx="160" cy="24" r="10" class="${pmCls(on("tete"))}" ${PM_OL}/>`+
    `<circle cx="160" cy="40" r="4.5" class="${pmCls(on("orl"))}" ${PM_OL}/><circle cx="143" cy="27" r="3.5" class="${pmCls(on("orl"))}" ${PM_OL}/><circle cx="177" cy="27" r="3.5" class="${pmCls(on("orl"))}" ${PM_OL}/>`+
    `<ellipse cx="140" cy="86" rx="13" ry="21" class="${pmCls(on("poumons"))}" ${PM_OL}/><ellipse cx="180" cy="86" rx="13" ry="21" class="${pmCls(on("poumons"))}" ${PM_OL}/>`+
    `<path d="M166 92 C 160 84, 150 92, 158 102 L 166 110 L 174 102 C 182 92, 172 84, 166 92 Z" class="${pmCls(on("coeur"))}" ${PM_OL}/>`+
    `<ellipse cx="160" cy="131" rx="30" ry="15" class="${pmCls(on("abdomen"))}" ${PM_OL}/>`+
    `<ellipse cx="160" cy="156" rx="10" ry="6" class="${pmCls(on("urinaire"))}" ${PM_OL}/>`+
    `<circle cx="160" cy="174" r="5" class="${pmCls(on("genital"))}" ${PM_OL}/>`+
    `<path d="M133 172 L 131 200" ${pmT(on("os"),on("os")?6:4)} opacity="${on("os")?1:.6}"/>`+
    `<circle cx="131" cy="204" r="5.5" class="${pmCls(on("articulations"))}" ${PM_OL}/><circle cx="189" cy="204" r="5.5" class="${pmCls(on("articulations"))}" ${PM_OL}/>`+
    (lb?PM_LAB(4,22,"Cerveau,\nméninges",on("tete"))+PM_LAB(4,54,"Nez, gorge,\noreilles",on("orl"))+PM_LAB(4,90,"Poumons",on("poumons"))+PM_LAB(316,98,"Cœur",on("coeur"),"end")+PM_LAB(4,130,"Appareil\ndigestif",on("abdomen"))+PM_LAB(316,148,"Voies\nurinaires",on("urinaire"),"end")+PM_LAB(316,180,"Organes\ngénitaux",on("genital"),"end")+PM_LAB(4,196,"Os",on("os"))+PM_LAB(316,214,"Articulations",on("articulations"),"end")+PM_LAB(316,62,"Sang",on("sang"),"end")
     +(on("peau")?PM_LAB(316,126,"Peau",1,"end"):""):"")+
    (num?pmNums(this,num):""),"Schéma du corps entier");}}
});
