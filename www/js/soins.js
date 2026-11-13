/* Carnet IFSI — fiches de soins : fiche récap et cours détaillé, checklist interactive, mise en situation (questions de validation en cartes),
   et vue Réviser › Soins et techniques / Examens et surveillance (menu déroulant des catégories). Chargé après pathos.js, avant app.js. */
const soK=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[’]/g,"'").replace(/\s+/g," ").trim();
const SONAME={};SOINS.forEach(o=>[o.n,...o.nn].forEach(x=>{const k=soK(x);if(!SONAME[k])SONAME[k]=o;}));
/* Fiches d'une catégorie : soins de la liste fournie qui ont une fiche (sans doublon), puis fiches propres à la catégorie. */
const SO_SF={};
function soSecFiches(s){if(SO_SF[s])return SO_SF[s];const seen=new Set(),out=[];
 SO_SEC[s].names.forEach(n=>{const o=SONAME[soK(n)];if(o&&!seen.has(o.i)){seen.add(o.i);out.push(o);}});
 SOINS.filter(o=>o.s===s&&!seen.has(o.i)).forEach(o=>{seen.add(o.i);out.push(o);});return SO_SF[s]=out;}
const soCatSecs=cat=>SO_SECS.filter(x=>x[2]===cat).map(x=>x[0]).filter(s=>soSecFiches(s).length);
const soCatN=cat=>new Set(soCatSecs(cat).flatMap(s=>soSecFiches(s).map(o=>o.i))).size;
const soDone=()=>store.get("sodone",[]);
const SO_COL=s=>`hsl(${(SO_SEC[s].n*67)%360} 55% 78%)`;
const SO_ICO={hyg:"drop",surv:"gauge",asep:"drop",med:"tube",perf:"drop",prel:"flask",pans:"peau",drain:"tube",resp:"lungs",uri:"bladder",dig:"gut",nutri:"scale",mob:"bone",periop:"heart",urg:"alert",diab:"finger",geria:"face",pedia:"baby",psy:"brain",pallia:"face",onco:"tube",dial:"kidney",stom:"gut",vacc:"tube",dom:"sheet",transf:"drop",exam:"flask",rel:"face",qual:"sheet",spec:"gauge"};
const SO_ST={rp:"Rôle propre",pm:"Sur prescription médicale",pr:"Selon protocole écrit",hab:"Habilitation ou formation spécifique",col:"En collaboration avec le médecin",urg:"Situation d'urgence"};
const soStLabel=o=>o.st.map(s=>SO_ST[s]||s).join(" · ");

/* ---------- Matériel illustré : pictogramme choisi d'après le nom du matériel ---------- */
const SOMAT={
 gants:'<path d="M7.5 21v-5.5L5 11.4a1.4 1.4 0 0 1 2.4-1.4L8.6 12V4.6a1.3 1.3 0 0 1 2.6 0V11V3.4a1.3 1.3 0 0 1 2.6 0V11V4.4a1.3 1.3 0 0 1 2.6 0v7V7a1.3 1.3 0 0 1 2.6 0v7c0 4-2.2 7-6.2 7z"/>',
 compresse:'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 12h16M12 4v16M4 8h16M4 16h16"/>',
 flacon:'<path d="M9.5 3h5M10.5 3v3L7.5 9v11a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V9l-3-3V3"/><path d="M7.5 13h9"/>',
 savon:'<path d="M10 2.5h4M12 2.5v3.5M9 6h6v3l2 2v10H7V11l2-2z"/>',
 seringue:'<path d="M18 2.5l3.5 3.5M15.5 5l3.5 3.5M17.2 6.8l-9.7 9.7H5v-2.5l9.7-9.7M7.5 12.5l4 4M3 21l2.5-2.5"/>',
 aiguille:'<path d="M3 21l10-10"/><path d="M12 8.5l3.5 3.5M14 6.5l3.5 3.5"/><rect x="15" y="2.5" width="6.5" height="6.5" rx="1.2"/>',
 garrot:'<rect x="2.5" y="9.5" width="19" height="5" rx="1.5"/><path d="M14 9.5v5M17 9.5v5"/>',
 perfuseur:'<path d="M9 2.5h6v5H9zM12 7.5v2.5M10 10h4v5h-4zM12 15v6.5"/><path d="M11.3 12.5h1.4"/>',
 poche:'<path d="M7 3h10v11.5a5 5 0 0 1-10 0z"/><path d="M12 19.5v2.5M9.5 8h5M9.5 11h5"/>',
 catheter:'<path d="M3 21l9-9"/><path d="M12 12l3-3M10.5 7.5l6 6"/><rect x="15" y="3" width="6" height="6" rx="1.5"/>',
 pansement:'<rect x="2.5" y="8" width="19" height="8" rx="4"/><rect x="9" y="9.5" width="6" height="5" rx="1"/>',
 adhesif:'<circle cx="10" cy="12" r="6.5"/><circle cx="10" cy="12" r="2.5"/><path d="M16.5 12h5v4h-5"/>',
 ciseaux:'<circle cx="6" cy="18" r="2.6"/><circle cx="18" cy="18" r="2.6"/><path d="M7.6 16L17 3.5M16.4 16L7 3.5"/>',
 pince:'<path d="M5 3l7 12 7-12M12 15v6.5M9 21.5h6"/>',
 haricot:'<path d="M2.5 11c0-3.2 3.2-4.2 6.2-3.2s4.2 1.2 6.4 0 6.4-.4 6.4 3.2-3.4 6.2-9.5 6.2S2.5 14 2.5 11z"/>',
 collecteur:'<path d="M5 9h14l-1.2 12H6.2z"/><path d="M4 9h16V5.5H4zM10 7.2h4"/><path d="M10 13l4 4M14 13l-4 4"/>',
 dechets:'<path d="M6 8h12l-1.2 13H7.2z"/><path d="M9 8V5.5a3 3 0 0 1 6 0V8"/>',
 champ:'<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M3 9.5h18M9 5v14"/>',
 masque:'<path d="M4 9c4.5-2.2 11.5-2.2 16 0v5.2c-4.5 4.2-11.5 4.2-16 0z"/><path d="M4 10.5H2M20 10.5h2M7.5 12h9M8 14.5h8"/>',
 blouse:'<path d="M9 3h6l4.5 4.5L17 10v11H7V10L4.5 7.5z"/><path d="M12 6v15"/>',
 lunettes:'<circle cx="6.5" cy="13.5" r="3.5"/><circle cx="17.5" cy="13.5" r="3.5"/><path d="M10 13.5h4M3 13.5L2 10M21 13.5l1-3.5"/>',
 thermo:'<path d="M10 4a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0z"/><path d="M12 8.5v7.5"/>',
 tensio:'<rect x="2.5" y="6" width="11.5" height="8" rx="2"/><path d="M14 10h3a3 3 0 0 1 3 3v2.5"/><circle cx="20" cy="18.5" r="2.5"/><path d="M5.5 10h5"/>',
 stetho:'<path d="M6 3v6a5 5 0 0 0 10 0V3"/><path d="M11 14v2a4 4 0 0 0 8 0v-2"/><circle cx="19" cy="12" r="2"/>',
 oxy:'<rect x="3.5" y="7.5" width="17" height="9.5" rx="3.5"/><path d="M7.5 12.3h3l1-2 1.3 4 1-2h2.7"/>',
 montre:'<circle cx="12" cy="13.5" r="7"/><path d="M12 9.5v4l3 2M10 2.5h4M12 2.5v4"/>',
 balance:'<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M8 10.5a4 4 0 0 1 8 0zM12 10.5l1.5-2"/>',
 metre:'<circle cx="9" cy="12" r="6"/><circle cx="9" cy="12" r="2"/><path d="M15 12h7M17 12v2.2M19 12v2.2M21 12v2.2"/>',
 bassin:'<path d="M3 10h18c0 5-4 8.5-9 8.5S3 15 3 10z"/><path d="M7.5 10V8h9v2"/>',
 sonde:'<path d="M3.5 4c8 0 8 6 3 8s-5 8 3 8H21"/><circle cx="3.5" cy="4" r="1"/>',
 pocheuri:'<path d="M6 3.5h12v12.5a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z"/><path d="M12 19v3M9 8.5h6M9 11.5h6M12 3.5V1.5"/>',
 tube:'<path d="M9 2.5h6M10 2.5v16a2 2 0 0 0 4 0v-16"/><path d="M10 11h4"/>',
 hemoc:'<rect x="7" y="7" width="10" height="14" rx="2.5"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M7 14h10"/>',
 etiquette:'<path d="M3 12V3.5h8.5L21 13l-8 8z"/><circle cx="7.5" cy="8" r="1.5"/>',
 linge:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M5 15h14M5 17.5h14"/>',
 cuvette:'<path d="M3.5 9h17l-2 9H5.5z"/><path d="M2 9h20"/>',
 brosse:'<path d="M4 20L15 9"/><path d="M14 3.5h7v4.5h-7z"/><path d="M15.5 3.5V2M17.5 3.5V2M19.5 3.5V2"/>',
 creme:'<path d="M8 21h8l-1.2-14H9.2z"/><path d="M10 7V3.5h4V7"/>',
 lit:'<path d="M3 18.5V6.5M3 14h18v4.5M21 18.5V14"/><path d="M7.5 14v-3h6v3"/><circle cx="6" cy="11.2" r="1.5"/>',
 fauteuil:'<circle cx="10" cy="16.5" r="4.5"/><path d="M8 3v8h7l3 7M8 7h6"/>',
 oxygene:'<rect x="8" y="7" width="8" height="15" rx="3"/><path d="M10 7V4h4v3M12 4V2.5M10 12h4"/>',
 lunO2:'<path d="M3 20c0-6 3.5-9 9-9s9 3 9 9"/><path d="M10 11V8.5M14 11V8.5"/>',
 nebu:'<path d="M8 21h8l-1.2-8H9.2z"/><path d="M12 13V8.5M8.5 5.5c1.2-2.2 5.8-2.2 7 0"/>',
 inhal:'<path d="M9 2.5h5v9.5H9z"/><path d="M9 12h8.5v5H11a2 2 0 0 1-2-2z"/>',
 glucometre:'<rect x="5" y="3" width="12" height="18" rx="3"/><rect x="8" y="6" width="6" height="5" rx="1"/><path d="M17 15.5h4"/>',
 stylo:'<rect x="2.5" y="10" width="16" height="4" rx="2"/><path d="M18.5 12h3M7 10v4M12 10v4"/>',
 pompe:'<rect x="2.5" y="6" width="19" height="12" rx="2"/><path d="M5.5 12h9M14.5 9v6M18 10v4"/>',
 plateau:'<path d="M2 15h20l-2 4H4z"/><path d="M6 15V9h4v6M13 15v-4h5v4"/>',
 chariot:'<rect x="4" y="4" width="16" height="12" rx="1"/><path d="M4 10h16"/><circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/>',
 dae:'<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M12.8 7.5L9 13h4l-1.8 4.5"/>',
 bavu:'<ellipse cx="9" cy="12" rx="6" ry="4.2"/><path d="M15 12h3M18 8.5v7h3"/>',
 tel:'<path d="M5 3h4l2 5-2.5 1.8a11 11 0 0 0 5.7 5.7L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
 dossier:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3v3h6V3M9 11h6M9 15h4"/>',
 verre:'<path d="M6 3h12l-2 18H8z"/><path d="M7 9h10"/>',
 cuillere:'<ellipse cx="12" cy="7" rx="4" ry="5"/><path d="M12 12v9.5"/>',
 pilule:'<path d="M5.2 13.8l8.6-8.6a3.9 3.9 0 0 1 5.5 5.5l-8.6 8.6a3.9 3.9 0 0 1-5.5-5.5zM9.5 9.5l5 5"/>',
 pilulier:'<rect x="2.5" y="7" width="19" height="10" rx="2"/><path d="M8.8 7v10M15.2 7v10"/>',
 protection:'<path d="M3 6h18v3c0 6-4 10-9 10S3 15 3 9z"/>',
 ecg:'<path d="M2 12h4l2-4.5 3 9.5 3-11.5 2 6.5h6"/>',
 lampe:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z"/>',
 ecouvillon:'<path d="M5 19L18 6"/><ellipse cx="19" cy="5" rx="2.4" ry="1.4" transform="rotate(-45 19 5)"/>',
 froid:'<path d="M12 2.5v19M3.8 7.2l16.4 9.6M3.8 16.8l16.4-9.6"/>',
 canule:'<path d="M5 8h14M9 8v4.5a3 3 0 0 0 6 0V8"/><path d="M12 15.5v5"/>',
 bandelette:'<rect x="9" y="2.5" width="6" height="19" rx="1"/><path d="M9 8h6M9 11.5h6M9 15h6"/>',
 leve:'<path d="M4 21h16M6 21V5h10l2 3"/><path d="M18 8v4M15 12h6l-1 5h-4z"/>',
 poubelle:'<path d="M4 7h16M10 3.5h4M6 7l1 14h10l1-14"/>',
 contention:'<path d="M9 2.5h6v9l3 6.5a2.5 2.5 0 0 1-2.3 3.5H11a3 3 0 0 1-3-3v-7z"/><path d="M9 7h6"/>',
 ecran:'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
 calc:'<rect x="5" y="2.5" width="14" height="19" rx="2"/><rect x="8" y="5.5" width="8" height="4" rx="1"/><path d="M8.5 13h.01M12 13h.01M15.5 13h.01M8.5 16.5h.01M12 16.5h.01M15.5 16.5h.01"/>',
 coffre:'<rect x="3.5" y="4" width="17" height="15" rx="2"/><circle cx="12" cy="11.5" r="3"/><path d="M12 9.5v2l1.2 1M6 19v1.5M18 19v1.5"/>',
 kit:'<rect x="4" y="6.5" width="16" height="13" rx="2"/><path d="M9 6.5V4.5h6v2M12 10v6M9 13h6"/>'};
const SOMAT_RE=[["calc","calculatrice"],["coffre","coffre|armoire securisee"],["froid","glaciere"],["perfuseur","pied a perfusion"],["catheter","unite de prelevement|ailettes"],["sonde","aspiration"],["lunO2","oxygenotherapie"],["tensio","constantes"],["pocheuri","diurese"],
 ["creme","baume|corps gras"],["flacon","dissolvant|produits d.entretien"],["linge","essuie-mains|mouchoir"],["etiquette","signaletique|bracelet"],["tel","numero"],["dossier","schema corporel|outil|livret|bons de|saed"],["pilule","naloxone|antidote"],["lit","chambre individuelle"],
 ["linge","gant de toilette|serviette|drap|alese|linge|chemise|vetement|pyjama|change propre"],["oxygene","bouteille|source d.oxygene|prise murale|manodetendeur|debitmetre"],["lunO2","lunettes (a oxygene|nasales)|masque (a oxygene|simple|a haute|haute concentration|venturi)|o2"],
 ["nebu","nebuli|aerosol"],["inhal","inhalateur|chambre d.inhalation|spray|poudre seche"],["gants","gants?"],["masque","masque|ffp2"],["blouse","surblouse|tablier|blouse|casaque|charlotte|coiffe|surchaussure"],["lunettes","lunettes|ecran facial|visiere"],
 ["collecteur","collecteur|opct|conteneur"],["dechets","dasri|sac a dechets|sac jaune|dechets|sac noir"],["champ","champ"],["compresse","compresse|gaze|meche|coton"],["savon","savon|solution hydro|sha|friction|gel"],
 ["flacon","antiseptique|chlorhexidine|povidone|betadine|alcool|serum phy|nacl|eau sterile|solute|solution|desinfectant|detergent|flacon|ampoule|diluant|eau pour"],["garrot","garrot"],["hemoc","hemoculture"],["tube","tube|ecouvillon a|pot |pot$|flacon sterile|recipient|bocal|seringue a gaz"],["bandelette","bandelette"],["glucometre","lecteur de glycemie|glucometre|lecteur|capteur|autopiqueur|lancette"],
 ["stylo","stylo"],["pompe","pse|pousse-seringue|pompe|regulateur|perfuseur electrique"],["perfuseur","perfuseur|tubulure|prolongateur|robinet|rampe|valve|bouchon|connecteur|raccord"],["poche","poche de solute|poche de|soluté|ccp|cgr|concentre|plasma|poche de perfusion|soluté"],
 ["catheter","catheter|aiguille de huber|picc|cvc|microperfuseur|epicranienne"],["seringue","seringue"],["aiguille","aiguille|trocart|lame|bistouri"],["pocheuri","poche a urine|poche de recueil|sac collecteur|poche de stomie|appareillage|support|protecteur cutane"],["sonde","sonde|canule de rectal|tuyau|tubulure d.aspiration"],
 ["canule","canule"],["pansement","pansement|hydrocolloide|alginate|hydrocellulaire|hydrofibre|interface|charbon|argent|film|bande|filet|steri"],["adhesif","adhesif|sparadrap|fixation"],["ciseaux","ciseaux|coupe-fil|ote-agrafe|retire-agrafe"],["pince","pince|curette"],["haricot","haricot|cupule|bassin reniforme"],
 ["thermo","thermometre"],["tensio","tensiometre|brassard"],["stetho","stethoscope"],["oxy","oxymetre|saturometre|capteur de spo2"],["montre","montre|chronometre|trotteuse|minuteur"],["balance","balance|pese"],["metre","metre|toise|ruban|reglette"],
 ["bassin","bassin|urinal|chaise percee"],["cuvette","cuvette|bassine|haricot d.eau"],["brosse","brosse|bâtonnet|batonnet|dentifrice"],["creme","creme|pommade|emollient|lubrifiant|vaseline|gel echo|gel de contact|huile"],["lit","lit|matelas|coussin|oreiller"],["fauteuil","fauteuil"],
 ["leve","leve-personne|verticalisateur"],["etiquette","etiquette|bon de demande|feuille de demande"],["dossier","dossier|feuille|fiche|support de tracabilite|logiciel|prescription|protocole|bon |carte|planning|grille|echelle|registre|cahier|formulaire|check-list|reglette|document"],
 ["pilulier","pilulier"],["pilule","medicament|comprime|gelule|traitement|patch|collyre|suppositoire|ovule|vaccin|insuline|antalgique|adrenaline|morphine"],["verre","verre|eau|boisson|gobelet|biberon"],["cuillere","cuillere|couvert|paille"],["protection","protection|change complet|couche"],
 ["ecg","ecg|electrode|scope|moniteur|holter|electrocardio"],["dae","defibrillateur|dae"],["bavu","ballon|bavu|insufflateur"],["tel","telephone|appel|bip"],["chariot","chariot|plan de travail|plateau de soins"],["plateau","plateau|bac"],["lampe","lampe|lumiere|eclairage"],
 ["ecouvillon","ecouvillon|ecouvillonnage|abaisse-langue"],["froid","glace|froid|vessie de glace|caisson"],["contention","contention|bas de|ceinture|attache"],["poubelle","poubelle|sac a linge"],["ecran","ordinateur|ecran|tablette|logiciel"]].map(([k,r])=>[new RegExp(r),k]);
function soMatKey(t){const f=soK(t);for(const [re,k] of SOMAT_RE)if(re.test(f))return k;return "kit";}
const soMatSvg=k=>`<svg viewBox="0 0 24 24" aria-hidden="true">${SOMAT[k]||SOMAT.kit}</svg>`;
const soMatGrid=a=>a.length?`<div class="so-mat">${a.map(x=>`<div>${soMatSvg(soMatKey(x))}<span>${pmd(x)}</span></div>`).join("")}</div>`:"";

/* ---------- Blocs du cours ---------- */
const soList=(a,cls="fv-list")=>a&&a.length?`<div class="fv-panel"><ul class="${cls}">${a.map(x=>`<li>${pmd(x)}</li>`).join("")}</ul></div>`:"";
const soSplit=x=>{const m=String(x).match(/^([^:]{2,28}?)\s*:\s*(.+)$/);return m?[m[1],m[2]]:["",x];};
const soTbl=a=>a.length?`<div class="fv-panel"><div class="fv-tbl so-tbl">${a.map(x=>{const [l,v]=soSplit(x);return `<div><span>${esc(l)}</span><span>${pmd(v)}</span></div>`;}).join("")}</div></div>`:"";
/* Surveillance : regroupée en Avant / Pendant / Après quand les lignes commencent ainsi. */
function soSurv(a){if(!a.length)return "";const G=[];a.forEach(x=>{const [l,v]=soSplit(x),key=/^(avant|pendant|apres|après|a distance|à distance|immediate|immédiate|j\d|dans les)/i.test(l)?l:"";
  const g=G.length&&G[G.length-1][0]===key?G[G.length-1]:null;if(g)g[1].push(key?v:x);else G.push([key,[key?v:x]]);});
 if(G.every(g=>!g[0]))return soList(a);
 return `<div class="fv-panel so-grp">${G.map(([l,its])=>`${l?`<h4>${esc(l)}</h4>`:""}<ul class="fv-list">${its.map(x=>`<li>${pmd(x)}</li>`).join("")}</ul>`).join("")}</div>`;}
const soChk=id=>{const M=state.soChkM||(state.soChkM={});return M[id]||(M[id]=new Set());};
function soChkBar(id){const o=SOBY[id],c=soChk(id),n=o.et.length,k=c.size,t=document.getElementById("so-chk-t"),b=document.getElementById("so-chk-b");
 if(t)t.textContent=k===n?`Toutes les étapes sont cochées`:`${k} / ${n} étapes cochées`;if(b)b.style.width=Math.round(k/n*100)+"%";}
function soSteps(o){const c=soChk(o.i),n=o.et.length;
 return `<div class="so-chkbar"><span id="so-chk-t">${c.size===n?"Toutes les étapes sont cochées":`${c.size} / ${n} étapes cochées`}</span><span class="so-prog"><i id="so-chk-b" style="width:${Math.round(c.size/n*100)}%"></i></span><button data-act="so-chk-reset">Effacer</button></div>
  <ol class="so-steps">${o.et.map((e,i)=>`<li><button class="so-step${c.has(i)?" on":""}" data-act="so-chk" data-k="${i}" aria-pressed="${c.has(i)}"><span class="so-n">${i+1}</span><span>${pmd(e)}</span></button></li>`).join("")}</ol>`;}
function soTrans(T){if(!T)return "";const lab={cible:"Cible",c:"Cible",d:"Données",a:"Actions",r:"Résultats"};
 return `<div class="fv-panel"><span class="cv-lab">Exemple de transmission ciblée</span><div class="fv-tbl so-tbl">${T.map(x=>{const [l,v]=soSplit(x);return `<div><span>${esc(lab[soK(l)]||l)}</span><span>${pmd(v)}</span></div>`;}).join("")}</div></div>`;}
const soQ=(q,k,lab)=>`<div class="cv-verif so-q" data-a="${q.a}"><span class="cv-lab">${lab}</span>${q.s?`<p class="so-sit">${pmd(q.s)}</p>`:""}<p class="so-qq">${pmd(q.q)}</p>
 <div class="so-opts">${q.o.map((x,j)=>`<button class="so-opt" data-act="so-ans" data-k="${k}|${j}">${pmd(x)}</button>`).join("")}</div><div class="so-ex" hidden>${pmd(q.e||"")}</div><div class="so-fb"></div></div>`;
/* Exercice : remettre les étapes dans l'ordre (6 étapes au plus, réparties sur tout le protocole). */
function soOrdIdx(o){const n=o.et.length;if(n<4)return [];if(n<=6)return [...Array(n).keys()];return [...new Set([...Array(6).keys()].map(i=>Math.round(i*(n-1)/5)))];}
function soOrdEx(o){const idx=soOrdIdx(o);if(!idx.length)return "";const opts=pxShuffle(idx.map((x,j)=>j),pxRand(o.i+"ord")),st=idx.map(i=>plainTxt(o.et[i]));
 return `<div class="cv-verif px-fex" id="so-ord"><span class="cv-lab">${SVG.check}Remettre les étapes dans l'ordre</span><p class="muted">Sans regarder le protocole, retrouvez l'ordre de ces étapes.</p>
  <div class="px-exo">${idx.map((x,i)=>`<label class="px-ex"><span class="px-n">${i+1}</span><select data-so="${i}" aria-label="Étape ${i+1}"><option value="">Choisir…</option>${opts.map(j=>`<option value="${j}">${esc(st[j].length>110?st[j].slice(0,108)+"…":st[j])}</option>`).join("")}</select></label>`).join("")}</div>
  <div class="pf-fb"></div><button class="btn block" data-act="so-ord-check" data-k="${o.i}">Vérifier</button></div>`;}

/* ---------- Vue d'une fiche de soin ---------- */
function vSoin(id){
 const o=SOBY[id];if(!o)return notFound();
 const S=SO_SEC[o.s],C=CAT[S.cat],mode=state.soMode||"recap",done=soDone().includes(id);
 const list=soSecFiches(o.s),k=list.indexOf(o),next=list[k+1],col=SO_COL(o.s);
 const badges=`<div class="so-badges">${o.st.map(s=>`<span class="so-st so-${s}">${SO_ST[s]||esc(s)}</span>`).join("")}</div>`;
 const links=ctChips(o.f);
 const secs=[["Définition",o.d.map(x=>`<p class="fv-lead">${pmd(x)}</p>`).join("")],["Indications",soList(o.ind)],["Contre-indications et précautions",soList(o.ci)],
  ["Rôle IDE et cadre réglementaire",`${badges}${o.r.map(x=>`<p class="cv-p">${pmd(x)}</p>`).join("")}`],["Matériel",soMatGrid(o.mat)],["Préparation",soTbl(o.prep)],
  ["Réalisation pas à pas",o.et.length?`<p class="muted so-hint">Touchez chaque étape pour la cocher au fur et à mesure.</p>${soSteps(o)}`:""],["Surveillance",soSurv(o.surv)],["Risques et complications",soList(o.ri)],
  ["Erreurs fréquentes",o.err.length?`<div class="cv-box cv-trap"><span class="cv-lab">${SVG.warn}À ne surtout pas faire</span><ul>${o.err.map(x=>`<li>${pmd(x)}</li>`).join("")}</ul></div>`:""],
  ["Traçabilité",`${soList(o.tr)}${soTrans(o.T)}`],["Éducation du patient",soList(o.edu)]].filter(x=>x[1]);
 const hero=`<div class="fv-progress" aria-hidden="true"><i id="fv-bar"></i></div><header class="fv-hero"><div class="fv-top"><button class="fv-back" data-act="back">${SVG.back}Retour</button>${done?'<span class="fv-done-badge">Étudié</span>':""}</div>
  <span class="fv-kicker">${esc(C.nom)} · ${esc(S.nom)}</span><h1>${esc(o.n)}</h1><div class="fv-ico" aria-hidden="true">${ICO[SO_ICO[o.s]]||ICO.drop}</div>
  <div class="fv-meta">${o.st.map(s=>`<span>${SO_ST[s]||esc(s)}</span>`).join("")}${o.et.length?`<span>${o.et.length} étapes</span>`:""}${o.cas?"<span>Mise en situation</span>":""}</div></header>`;
 const seg=`<div class="seg px-seg" role="group" aria-label="Mode de lecture"><button data-act="so-mode" data-k="recap" aria-pressed="${mode==="recap"}">Fiche récap</button><button data-act="so-mode" data-k="cours" aria-pressed="${mode==="cours"}">Cours détaillé</button></div>`;
 let body,toc="";
 if(mode==="recap"){
  const box=(t,a,n)=>a.length?`<div class="px-r"><span class="cv-lab">${t}</span><ul>${a.slice(0,n).map(x=>`<li>${pmd(x)}</li>`).join("")}</ul></div>`:"";
  body=`<div class="px-recap">
   ${typeof VID!=="undefined"&&VID[id]&&!premLocked(o)?vdHtml(id,{steps:false}):""}
   ${typeof rvBlock==="function"?rvBlock(id):""}
   ${a4Cta("s",id,"Ce soin en une page : étapes, surveillance, pièges")}
   <div class="px-r def"><span class="cv-lab">${SVG.info}Définition</span><p>${pmd(o.d[0]||"")}</p>${badges}</div>
   ${o.mat.length?`<div class="px-r"><span class="cv-lab">Matériel</span>${soMatGrid(o.mat)}</div>`:""}
   ${o.et.length?`<div class="px-r"><span class="cv-lab">Les étapes</span><ol class="so-mini">${o.et.map(x=>`<li>${pmd(x)}</li>`).join("")}</ol></div>`:""}
   <div class="px-grid">${box("Surveillance",o.surv.map(x=>soSplit(x)[0]&&/^(avant|pendant|apr)/i.test(soSplit(x)[0])?`**${soSplit(x)[0]}** : ${soSplit(x)[1]}`:x),5)}${box("Risques",o.ri,4)}${box("Erreurs à éviter",o.err,3)}${box("Traçabilité",o.tr,3)}</div>
   <button class="btn block" data-act="so-mode" data-k="cours">Lire le cours détaillé</button></div>`;
 }else if(premLocked(o)){body=premCoursWall("de ce soin","so-mode");
 }else{
  toc=`<nav class="fv-toc" aria-label="Parties du cours">${secs.map((s,i)=>`<a href="#soin" data-sec="s-${i+1}"><b>${i+1}</b>${esc(s[0])}</a>`).join("")}</nav>`;
  body=(typeof VID!=="undefined"&&VID[id]?vdHtml(id):"")+(typeof rvBlock==="function"?rvBlock(id):"")+secs.map((s,i)=>`<section class="fv-sec" id="s-${i+1}"><div class="fv-sh"><span class="fv-num">${String(i+1).padStart(2,"0")}</span><h2>${s[0]}</h2></div>${s[1]}</section>`).join("")+
   (o.cas?soQ(o.cas,"cas",`${SVG.bulb}Mise en situation`):"")+
   soOrdEx(o);
 }
 return `<article class="fv px so" style="--c:${col}">${hero}${toc}<div class="fv-body"><div class="px-head">${seg}</div>${body}
  ${links?`<section class="stack-sm"><h3 class="cn-g">Pour aller plus loin dans l'appli</h3><div class="chips wrapchips">${links}</div></section>`:""}
  <div class="fv-end"><h3>${done?"Soin étudié":"Vous avez terminé"}</h3><p class="muted">Marquez-le comme étudié, puis testez-vous avec les cartes, juste en dessous.</p>
   <div class="row2"><button class="btn ${done?"ghost":"ok"}" data-act="so-done" data-k="${id}">${done?"Retirer des étudiés":"J'ai étudié ce soin"}</button></div>
   ${next?`<a class="card cat fv-next" style="--c:${col}" href="#soin/${next.i}" data-act="so-open" data-k="${mode}"><span class="eyebrow">Soin suivant</span><h3>${esc(next.n)}</h3></a>`:""}</div></div></article>`;
}

/* ---------- Réviser › Soins et techniques / Examens et surveillance ---------- */
const soSecCur=cat=>{const s=(state.soSec||{})[cat]||store.get("sosec_"+cat,"all");return soCatSecs(cat).includes(s)?s:"all";};
const soRow=(o,isF,dn)=>`<a class="li" href="#soin/${o.i}" data-act="so-open" data-k="${isF?"recap":"cours"}"><span class="bar"></span><span><span class="t">${esc(o.n)}</span><span class="s">${esc(isF?pxCut(o.d[0]||""):`${soStLabel(o)}${o.et.length?` · ${o.et.length} étapes`:""}${o.cas?" · mise en situation":""}`)}</span></span><span class="end">${typeof rvOf==="function"&&rvOf(o.i).length?'<span class="tag vd-tag">Ma vidéo</span>':typeof VID!=="undefined"&&VID[o.i]?'<span class="tag vd-tag">Vidéo</span>':""}${dn.includes(o.i)?'<span class="tag done">Étudié</span>':""}${chev}</span></a>`;
function soRevList(cat,isF){const s=soSecCur(cat),q=soK(state.soq||""),dn=soDone();let h="";
 (s==="all"?soCatSecs(cat):[s]).forEach(sec=>{const S=SO_SEC[sec],l=soSecFiches(sec).filter(o=>!q||soK(o.n).includes(q)||o.nn.some(x=>soK(x).includes(q)));
  if(l.length)h+=pxSec(SO_COL(sec),s==="all"?esc(S.nom):(isF?"Fiches récap":"Cours détaillés"),l.length,l.map(o=>soRow(o,isF,dn)).join(""));});
 return h||`<div class="empty">Aucun soin ne correspond à « ${esc(state.soq)} ».</div>`;}
function soRev(cat,isF){
 const s=soSecCur(cat),S=s==="all"?null:SO_SEC[s],n=S?soSecFiches(s).length:soCatN(cat),dn=soDone();
 const tools=S?(()=>{const ids=new Set(soSecFiches(s).map(o=>o.i)),nq=srsKeysCards([...ids].map(i=>"s:"+i)).length,d=[...ids].filter(i=>dn.includes(i)).length;
   return nq||d?`<div class="px-spebtns">${nq?`<button class="btn sm" data-act="so-sec-cards" data-k="${s}">${SRS_IC.cards}Cartes · ${nq}</button>`:""}${d?`<span class="muted px-spedone">${d} étudié${d>1?"s":""}</span>`:""}</div>`:"";})():"";

 return `<span class="eyebrow px-revlab" id="px-top">Catégorie</span>
  <div class="px-revbar"><label class="px-sel" style="--c:${S?SO_COL(s):"var(--brand)"}"><span class="dot"></span><b>${esc(S?S.nom:"Toutes les catégories")}</b><small>${n}</small><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
   <select id="sosec" aria-label="Choisir une catégorie de soins"><option value="all"${s==="all"?" selected":""}>Toutes les catégories (${soCatN(cat)})</option>${soCatSecs(cat).map(id=>`<option value="${id}"${s===id?" selected":""}>${esc(SO_SEC[id].nom)} (${soSecFiches(id).length})</option>`).join("")}</select></label></div>
  ${tools}
  ${cat==="soins"&&typeof vdEntry==="function"?vdEntry():""}
  <label class="search-field">${IC.search}<input id="soq" type="search" placeholder="Filtrer les soins" value="${esc(state.soq||"")}" autocomplete="off" aria-label="Filtrer les soins"></label>
  <div class="stack-lg" id="so-list">${soRevList(cat,isF)}</div>`;
}
const soEntry=(c,isF)=>`<a class="li px-entry" role="button" tabindex="0" data-act="so-go" data-k="${c.id}" style="--c:${c.c}"><span class="bar"></span><span><span class="t">Toutes les fiches de ${c.id==="exam"?"surveillance et d'examens":"soins"} par catégorie</span><span class="s">${soCatN(c.id)} ${isF?"fiches récap":"cours détaillés"} · réalisation pas à pas, checklist, mise en situation</span></span><span class="end">${chev}</span></a>`;

/* ---------- Recherche et questions (partiels blancs) ---------- */
function soIdx(){return SOINS.map(o=>({t:"s",it:{id:o.i,titre:o.n,cat:SO_SEC[o.s].cat,theme:SO_SEC[o.s].nom},txt:plainTxt([o.nn.join(" "),o.d.join(" "),o.ind.join(" "),o.mat.join(" "),o.et.join(" "),o.surv.join(" "),o.ri.join(" ")].join(" "))}));}
function soMakeQuiz(){SOINS.forEach(o=>{const S=SO_SEC[o.s],add=(q,opts,a,e)=>{if(opts.length<3)return;const x=norm(Q(S.cat,S.u,q,opts,a,e));x.sid=o.i;QUIZ.push(x);};
 if(o.cas&&o.cas.o.length)add(`${o.n} — ${plainTxt(o.cas.s)} ${plainTxt(o.cas.q)}`,o.cas.o.map(plainTxt),o.cas.a,plainTxt(o.cas.e));
 o.q.forEach(q=>add(`${o.n} : ${plainTxt(q.q)}`,q.o.map(plainTxt),q.a,plainTxt(q.e)));
 const st=o.et.map(plainTxt);if(st.length>=5&&st.every(x=>x.length<130)){const r=pxRand(o.i+"q"),k=Math.floor(r()*(st.length-2));const bads=pxShuffle(st.filter((x,j)=>j!==k&&j!==k+1),r).slice(0,3),opts=pxShuffle([st[k+1],...bads],r);
  add(`${o.n} : quelle étape vient juste après « ${st[k]} » ?`,opts,opts.indexOf(st[k+1]),`L'ordre du protocole : ${st.map((x,i)=>`${i+1}. ${x}`).join(" ")}`);}
});}
soMakeQuiz();

/* ---------- Actions ---------- */
function soAct(b,a){const k=b.dataset.k;
 if(a==="so-open"){state.soMode=k;return;}
 if(a==="so-go"){nav("reviser/"+(k==="exam"?"surveillance":"soins"));return;}
 if(a==="so-mode"){state.soMode=k;render();const t=document.querySelector(".px-head");if(t)t.scrollIntoView();return;}
 if(a==="so-chk"){const id=route().arg,c=soChk(id),i=+k;if(c.has(i))c.delete(i);else c.add(i);b.classList.toggle("on",c.has(i));b.setAttribute("aria-pressed",c.has(i));soChkBar(id);haptic();return;}
 if(a==="so-chk-reset"){soChk(route().arg).clear();document.querySelectorAll(".so-step.on").forEach(x=>{x.classList.remove("on");x.setAttribute("aria-pressed","false");});soChkBar(route().arg);return;}
 if(a==="so-ans"){const box=b.closest(".so-q");if(!box||box.classList.contains("done"))return;const j=+k.split("|")[1],good=+box.dataset.a,ok=j===good;box.classList.add("done");
  box.querySelectorAll(".so-opt").forEach((x,n)=>{x.disabled=true;if(n===good)x.classList.add("good");else if(n===j)x.classList.add("bad");});
  box.querySelector(".so-fb").innerHTML=`<div class="feedback ${ok?"ok":"ko"}"><b>${ok?"Bonne réponse":"Pas tout à fait"}</b><span>${box.querySelector(".so-ex").innerHTML}</span></div>`;haptic();return;}
 if(a==="so-ord-check"){const o=SOBY[k],box=document.getElementById("so-ord");if(!o||!box)return;const sel=[...box.querySelectorAll("select")],idx=soOrdIdx(o);
  if(sel.some(x=>!x.value)){toast("Complétez toutes les étapes");return;}let sc=0;
  sel.forEach((x,i)=>{const ok=+x.value===i,l=x.closest(".px-ex");if(ok)sc++;l.classList.add(ok?"good":"wrong");x.disabled=true;if(!ok)l.insertAdjacentHTML("beforeend",`<small>Réponse : ${esc(plainTxt(o.et[idx[i]]))}</small>`);});
  box.querySelector(".pf-fb").innerHTML=`<div class="feedback ${sc===sel.length?"ok":"ko"}"><b>${sc===sel.length?"Parfait !":`${sc} bonne${sc>1?"s":""} réponse${sc>1?"s":""} sur ${sel.length}`}</b><span>${sc===sel.length?"Vous connaissez l'enchaînement du soin.":"Relisez la réalisation pas à pas, puis recommencez."}</span></div>`;
  b.textContent="Recommencer";b.dataset.act="so-ord-reset";haptic();return;}
 if(a==="so-ord-reset"){render();return;}
 if(a==="so-done"){let d=soDone();const on=!d.includes(k);d=on?[...d,k]:d.filter(x=>x!==k);store.set("sodone",d);haptic();if(on)toast("Soin marqué comme étudié");render();return;}
 if(a==="so-sec-cards"){srsKeysGo(soSecFiches(k).map(o=>"s:"+o.i),SO_SEC[k].nom);return;}
}
function soInput(t){const cat=state.filter;
 if(t.id==="sosec"){if(soSecCur(cat)!==t.value){(state.soSec=state.soSec||{})[cat]=t.value;store.set("sosec_"+cat,t.value);render();pxBind(true);}return true;}
 if(t.id==="soq"){state.soq=t.value;const ol=document.getElementById("so-list");if(ol)ol.innerHTML=soRevList(cat,state.rev==="fiches");return true;}
 return false;
}
