/* Carnet IFSI — démarche de soins guidée et exemples rédigés.
   · Un exemple complet et fictif pour le recueil de données, le projet de soins et l'analyse de pratique :
     consultable, exportable en PDF, et utilisable comme point de départ.
   · Sous chaque champ d'une feuille, « Voir un exemple » montre la façon de le rédiger.
   · Le parcours « La démarche de soins en 4 étapes » relie recueil, problèmes, projet et évaluation ;
     le projet de soins peut importer les problèmes identifiés dans un recueil.
   Chargé après feuilles.js, avant app.js. */
const FS_DEMO={
 recueil:{chambre:"12",initiales:"Mme D.",age:"82 ans",sexe:"F",sources:"Patiente, sa fille, dossier de soins, transmissions de l'équipe de nuit",
  motif:"Chute à domicile avec fracture du col du fémur droit, opérée hier (prothèse intermédiaire de hanche).",diag:"Fracture du col du fémur droit, J1 d'une arthroplastie",
  histoire:"Chute de sa hauteur dans la cuisine en se levant la nuit. Retrouvée au sol par sa fille le matin, environ 6 heures plus tard. Admise aux urgences, opérée le lendemain sous rachianesthésie.",
  atcdm:"Hypertension artérielle, fibrillation atriale sous anticoagulant, arthrose des genoux, cataracte opérée des deux yeux.",atcdc:"Cholécystectomie (1995).",allergies:"Pénicilline (urticaire)",
  ttth:"Anticoagulant oral (suspendu pour l'intervention), bêtabloquant le matin, paracétamol si besoin.",
  entourage:"Veuve. Sa fille habite à 10 km et passe chaque jour ; elle est sa personne de confiance.",domicile:"Maison de plain-pied, salle de bains avec baignoire, aide-ménagère 2 h par semaine, pas de téléassistance.",
  profession:"Institutrice retraitée, club de lecture le mardi.",habitudes:"Non fumeuse, pas d'alcool, marche chaque jour avec une canne.",
  b1:"Eupnéique, FR 18/min, SpO₂ 95 % en air ambiant. Pas de toux. Spirométrie incitative à encourager.",
  b2:"Appétit diminué depuis l'intervention (moitié du plateau). Boit 800 mL par jour : à stimuler. Dentier du haut. Pas de trouble de la déglutition.",
  b3:"Sonde urinaire retirée ce matin : surveiller la reprise mictionnelle (globe ?). Pas de selles depuis 3 jours, sous antalgique opioïde.",
  b4:"Lever au fauteuil prévu aujourd'hui avec le kinésithérapeute. Appui autorisé. Risque de luxation : pas de flexion de hanche au-delà de 90°, pas de croisement des jambes.",
  b5:"A peu dormi : douleur et bruit. Somnifère refusé.",b6:"Aide partielle pour le bas du corps ; s'habille seule en haut.",b7:"T° 37,6 °C à J1, sans frisson.",
  b8:"Toilette au lit avec aide pour le bas. Pansement sec et propre. Talons rougis qui blanchissent à la pression ; Braden 14.",
  b9:"Risque de chute (antécédent, douleur, opioïde, nuit), de luxation, thromboembolique et de confusion post-opératoire. Bien orientée ce matin.",
  b10:"Lunettes portées, entend bien. S'exprime clairement, inquiète pour son retour à domicile.",b11:"Catholique, souhaite la visite de l'aumônerie le dimanche.",
  b12:"Se sent « inutile » de ne pas pouvoir se lever. Veut redevenir autonome.",b13:"Aime lire : a demandé ses livres à sa fille.",b14:"Pose des questions sur la prothèse et les gestes à éviter : demande d'information.",
  constantes:"TA 128/74 mmHg, FC 88/min irrégulière, FR 18/min, SpO₂ 95 %, T° 37,6 °C, douleur EN 6/10 à la mobilisation et 2/10 au repos, poids 58 kg, taille 1,60 m.",
  examens:"Hémoglobine 10,2 g/dL après l'intervention (11,8 à l'entrée), créatinine normale, radiographie de contrôle satisfaisante.",
  tttc:"Paracétamol systématique, antalgique de palier 2 si EN > 4, anticoagulant préventif injectable, bêtabloquant, hydratation IV 500 mL sur 24 h, réfection du pansement à J2.",
  ressources:"Lucide et motivée pour remarcher. Fille présente et aidante. Bonne compréhension des consignes.",
  problemes:"Douleur aiguë à la mobilisation\nRisque de chute\nRisque d'escarre des talons et du sacrum\nRisque de constipation\nRisque de confusion post-opératoire\nRisque de luxation de la prothèse",
  attentes:"Rentrer chez elle « le plus vite possible » et remarcher sans aide."},
 projet:{chambre:"12",initiales:"Mme D.",age:"82 ans",
  contexte:"Mme D., 82 ans, vit seule, opérée hier d'une fracture du col du fémur droit (prothèse intermédiaire). Lucide, motivée, très soutenue par sa fille. Enjeux : soulager la douleur pour permettre le lever, prévenir les complications du décubitus et préparer un retour à domicile en sécurité.",
  pb:[{id:"d1",type:"Diagnostic infirmier réel",probleme:"Douleur aiguë liée à la fracture opérée, se manifestant par une EN à 6/10 à la mobilisation, un faciès crispé et une appréhension du lever.",
    objectif:"Mme D. exprimera une douleur inférieure ou égale à 3/10 lors des mobilisations d'ici 48 heures.",
    actions:"Évaluer la douleur (EN) avant, pendant et après chaque mobilisation et la tracer.\nAdministrer les antalgiques prescrits 45 min avant le lever, la toilette et la kinésithérapie.\nInstaller avec un coussin d'abduction, mobiliser lentement en expliquant chaque geste.\nSurveiller les effets indésirables du palier 2 : nausées, somnolence, constipation.",
    evaluation:"J2 : EN 3/10 au lever après antalgique. Objectif en bonne voie, poursuivre. Si EN > 3 malgré le traitement, en informer le médecin."},
   {id:"d2",type:"Diagnostic infirmier de risque",probleme:"Risque d'escarre lié à l'alitement, à l'âge et à une alimentation diminuée (Braden 14, talons rougis qui blanchissent à la pression).",
    objectif:"La peau de Mme D. restera intacte pendant toute l'hospitalisation.",
    actions:"Matelas à air, décharge des talons par un coussin sous les mollets.\nChangements de position toutes les 3 heures, sans flexion de hanche à plus de 90°.\nObserver les points d'appui à chaque soin ; pas de massage des rougeurs.\nStimuler l'hydratation (1,5 L par jour) et l'alimentation ; peser deux fois par semaine.",
    evaluation:"J3 : talons sans rougeur persistante, Braden 16. Poursuivre jusqu'à la reprise complète de la marche."},
   {id:"d3",type:"Problème en collaboration",probleme:"Risque de complication thromboembolique lié à l'intervention et à l'immobilité.",
    objectif:"Mme D. ne présentera pas de signe de phlébite ni d'embolie pulmonaire.",
    actions:"Administrer l'anticoagulant préventif prescrit à heure fixe ; surveiller les plaquettes selon la prescription.\nRechercher chaque jour douleur du mollet, chaleur, œdème, dyspnée.\nLever précoce et mobilisation des chevilles ; bas de contention si prescrits.",
    evaluation:"Aucun signe clinique à J3. Plaquettes stables. Poursuivre la surveillance."}],
  vie:"Retourner vivre chez elle, reprendre ses promenades et son club de lecture.",
  sortie:"Évaluer avec l'ergothérapeute : rehausseur de toilettes, siège de douche, retrait des tapis. Proposer une téléassistance. Éducation aux gestes à éviter avec la prothèse. Lien avec l'infirmier libéral pour l'anticoagulant et le kinésithérapeute de ville."},
 analyse:{titre:"Refus de la toilette par une patiente âgée",lieu:"Service de gériatrie, matin",acteurs:"Une patiente de 89 ans, une aide-soignante, moi (étudiante de 1re année)",
  description:"Ce matin, j'ai proposé la toilette au lit à Mme R., 89 ans, hospitalisée pour une pneumopathie. Elle a répondu « Pas maintenant, laissez-moi tranquille ». L'aide-soignante m'a dit qu'il fallait la faire avant 10 h pour l'organisation du service. J'ai insisté une deuxième fois ; Mme R. a tiré son drap et s'est tournée vers le mur. Je suis sortie de la chambre sans faire le soin et j'en ai parlé à l'infirmière.",
  ressenti:"J'ai été mal à l'aise, partagée entre le respect de son refus et la peur de « mal faire » mon travail.",
  questions:"Avais-je le droit de différer la toilette ? Pourquoi a-t-elle refusé ? Ai-je bien fait d'insister ? Comment concilier l'organisation du service et le rythme de la patiente ?",
  question:"Comment respecter le refus de soin d'une personne âgée tout en assurant les soins nécessaires à son confort et à sa santé ?",
  concepts:"Consentement et refus de soin, autonomie, bientraitance, relation soignant-soigné, organisation des soins.",
  liens:"La loi du 4 mars 2002 pose le principe du consentement libre et éclairé : un refus doit être entendu, compris et tracé. La recommandation de la HAS sur la bientraitance invite à adapter les soins au rythme de la personne. Le cours sur la relation d'aide (UE 4.2) rappelle l'importance de reformuler et de rechercher le sens d'un refus.",
  points:"La patiente : fatiguée, douloureuse, peut-être gênée par un soin intime réalisé par une inconnue. L'aide-soignante : contrainte par l'organisation du service. L'infirmière : m'a expliqué qu'on pouvait reproposer plus tard et proposer une toilette partielle.",
  autrement:"Me présenter et expliquer le soin, demander ce qui la gêne, évaluer la douleur, proposer de revenir après le petit-déjeuner ou de faire seulement le visage et les mains, puis tracer le refus et l'organisation choisie.",
  retiens:"Un refus est une information, pas un obstacle : il faut en chercher la cause et négocier. L'organisation du service peut s'adapter. Je vais travailler la reformulation et je proposerai des alternatives avant d'insister.",
  refs:"Loi n° 2002-303 du 4 mars 2002 relative aux droits des malades et à la qualité du système de santé.\nHAS. La bientraitance : définition et repères pour la mise en œuvre."}};
/* Exemple sous un champ : la valeur de l'exemple complet pour ce champ */
function fsExHint(path,f){
 const [type]=path.split("|"),D=FS_DEMO[type];if(!D||f.t==="date"||f.t==="select")return "";
 const parts=path.split("|");let v;
 if(parts.length>=5){const g=D[parts[2]];v=Array.isArray(g)&&g[0]?g[0][f.k]:null;}else v=D[f.k];
 if(!v)return "";return `<details class="fs-ex"><summary>Voir un exemple</summary><p>${esc(v).replace(/\n/g,"<br>")}</p></details>`;}
/* Vue de l'exemple complet, en lecture */
function fsDemoView(type){
 const S=SHEETS[type],d=FS_DEMO[type];if(!S||!d)return notFound();
 const val=v=>v?`<p>${esc(v).replace(/\n/g,"<br>")}</p>`:`<p class="muted">—</p>`;
 const secs=S.sections.map(sec=>{let b;
  if(sec.g)b=(d[sec.g.k]||[]).map((it,i)=>`<div class="fs-demo-g"><h4>${esc(sec.g.label)} ${i+1}${it.type?` · ${esc(it.type)}`:""}</h4>${sec.g.f.filter(f=>f.k!=="type").map(f=>`<div class="fs-demo-f"><span>${esc(f.l)}</span>${val(it[f.k])}</div>`).join("")}</div>`).join("");
  else b=sec.f.filter(f=>d[f.k]).map(f=>`<div class="fs-demo-f"><span>${esc(f.l)}</span>${val(d[f.k])}</div>`).join("");
  return b?`<section class="stack-sm"><h3 class="cn-g">${esc(sec.h)}</h3><div class="sheet-body fs-demo">${b}</div></section>`:"";}).join("");
 return `<div class="stack-lg"><a class="back" href="#feuille/${type}">${IC.back}${esc(S.titre)}</a>
  ${vh("Exemple rédigé",esc(S.titre),"Une situation fictive, rédigée comme on l'attend en stage. Inspirez-vous de la forme, pas du contenu : chaque patient est différent.")}
  <div class="btn-row"><button class="btn" data-act="fs-demo-copy" data-k="${type}">${IC.plus}Partir de cet exemple</button><button class="btn ghost" data-act="pdf-fs" data-k="${type}" data-id="exemple">${IC.sheet}Exporter en PDF</button></div>
  ${secs}
  <a class="cd-card cn-entry" href="#cours/${S.guide}"><span class="cd-ic">${IC.book}</span><span><b>Mode d'emploi</b><small>Le cours pas à pas : but, étapes, astuces</small></span>${chev}</a></div>`;}
/* Parcours : la démarche de soins en 4 étapes */
function fsDemarche(){
 const F=feuilles(),n=t=>(F[t]||[]).length;
 const step=(i,t,d,links)=>`<li class="dm-step"><span class="dm-n">${i}</span><div><b>${t}</b><small>${d}</small><div class="dm-links">${links}</div></div></li>`;
 return `<section class="stack-sm"><div class="section-title"><h2>La démarche de soins en 4 étapes</h2></div>
  <ol class="dm-steps sheet-body">
   ${step(1,"Recueillir les données","Les 14 besoins de V. Henderson, les antécédents, les traitements, ce que dit le patient.",`<a class="chip" href="#feuille/recueil">Recueil${n("recueil")?` · ${n("recueil")}`:""}</a><a class="chip" href="#feuille/recueil/exemple">Exemple</a>`)}
   ${step(2,"Analyser et identifier les problèmes","Besoins perturbés, risques, ressources : la synthèse en fin de recueil. L'assistant propose les problèmes selon la situation.",`<a class="chip" href="#outil/projet">Assistant guidé</a><a class="chip" href="#cours/guide-recueil">Comment faire</a>`)}
   ${step(3,"Planifier : objectifs et actions","Un problème formulé, un objectif mesurable et daté, des actions concrètes. Les problèmes du recueil s'importent en un geste.",`<a class="chip" href="#feuille/projet">Projet de soins${n("projet")?` · ${n("projet")}`:""}</a><a class="chip" href="#feuille/projet/exemple">Exemple</a>`)}
   ${step(4,"Évaluer et réajuster","Objectif atteint ? Ce qui a marché, ce qui change. Puis prendre du recul sur une situation vécue.",`<a class="chip" href="#feuille/analyse">Analyse de pratique${n("analyse")?` · ${n("analyse")}`:""}</a><a class="chip" href="#feuille/analyse/exemple">Exemple</a>`)}
  </ol></section>`;}
/* Projet de soins : importer les problèmes d'un recueil */
function fsImportBlock(inst){
 const R=fsSorted("recueil").filter(r=>(r.data||{}).problemes);if(!R.length)return "";
 return `<details class="ot-det fs-imp"><summary>Importer les problèmes d'un recueil</summary><div class="stack-sm"><p class="muted">Chaque ligne de la synthèse « Problèmes identifiés » devient un problème à formuler.</p>
  <div class="chips wrapchips">${R.map(r=>`<button class="chip" data-act="fs-import" data-k="${r.id}" data-id="${inst.id}">${esc(fsTitle("recueil",r))} · ${plural(r.data.problemes.split("\n").filter(x=>x.trim()).length,"problème")}</button>`).join("")}</div></div></details>`;}
function demAct(b,a){
 if(a==="fs-demo-copy"){const type=b.dataset.k,F=feuilles(),d=JSON.parse(JSON.stringify(FS_DEMO[type]||{}));(d.pb||[]).forEach(x=>{x.id=cnId();});
  const it={id:cnId(),created:todayISO(),updated:todayISO(),data:Object.assign(d,{date:todayISO()})};F[type]=[it,...(F[type]||[])];saveFeuilles(F);haptic();toast("Copie créée : adaptez-la à votre patient");nav("feuille/"+type+"/"+it.id);return true;}
 if(a==="fs-import"){const F=feuilles(),r=(F.recueil||[]).find(x=>x.id===b.dataset.k),p=(F.projet||[]).find(x=>x.id===b.dataset.id);if(!r||!p)return true;
  const d=p.data=p.data||{},L=r.data.problemes.split("\n").map(x=>x.replace(/^[\s•\-–*]+/,"").trim()).filter(Boolean),have=new Set((d.pb||[]).map(x=>(x.probleme||"").trim()));
  d.pb=[...(d.pb||[]).filter(x=>x.probleme||x.objectif||x.actions),...L.filter(x=>!have.has(x)).map(x=>({id:cnId(),type:/^risque/i.test(x)?"Diagnostic infirmier de risque":"Diagnostic infirmier réel",probleme:x}))];
  ["chambre","initiales","age"].forEach(k=>{if(!d[k]&&r.data[k])d[k]=r.data[k];});p.updated=todayISO();saveFeuilles(F);haptic();toast(`${plural(L.length,"problème")} importé${L.length>1?"s":""}`);render();return true;}
 return false;}
