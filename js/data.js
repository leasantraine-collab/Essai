/* Carnet IFSI — contenus pédagogiques (catégories, UE, fiches, cours, questions, stages, générateur de calculs).
   Repris tels quels de l'artefact Carnet IFSI. */
const store={get(k,d){try{const v=localStorage.getItem("ifsi_"+k);return v?JSON.parse(v):d}catch(e){return d}},
             set(k,v){try{localStorage.setItem("ifsi_"+k,JSON.stringify(v))}catch(e){}}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

/* ---------- Les 12 catégories ---------- */
const CATS=[
 {id:"thera",nom:"Thérapeutiques",c:"#B5C9A8",desc:"Médicaments, classes, mécanismes, effets indésirables, surveillance"},
 {id:"patho",nom:"Pathologies",c:"#EDC4C7",desc:"Causes, signes, examens, complications, rôle infirmier"},
 {id:"soins",nom:"Soins et techniques",c:"#B9D4EE",desc:"Étapes, matériel, hygiène, asepsie, traçabilité"},
 {id:"voca",nom:"Vocabulaire médical",c:"#F6E3A1",desc:"Préfixes, suffixes, abréviations, terminologie"},
 {id:"stage",nom:"Stage IDE",c:"#CDBFE8",desc:"Préparation, objectifs, posture, analyse de situation"},
 {id:"methode",nom:"Révisions et méthodes",c:"#9FD8D2",desc:"Mémorisation active, répétition espacée, planning"},
 {id:"tfe",nom:"Mémoire (TFE)",c:"#E6AFD8",desc:"Le mémoire de fin d'études étape par étape, de la situation d'appel à la soutenance"},
 {id:"calcul",nom:"Calculs et dosages",c:"#F7C9A9",desc:"Conversions, débits, concentrations, doses"},
 {id:"quiz",nom:"Quiz et exercices",c:"#D6D9DC",desc:"QCM, questions flash, cas cliniques"},
 {id:"exam",nom:"Examens et surveillance",c:"#9DB0C4",desc:"Constantes, biologie, signes d'alerte"},
 {id:"role",nom:"Rôle infirmier et législation",c:"#C8B8A6",desc:"Responsabilité, secret, consentement, transmissions"},
 {id:"anat",nom:"Anatomie et physiologie",c:"#F0A79A",desc:"Organes, systèmes, fonctionnement normal"},
 {id:"situ",nom:"Situations cliniques",c:"#CFCF9A",desc:"Cas fictifs, priorisation, raisonnement"}
];
const CAT=Object.fromEntries(CATS.map(c=>[c.id,c]));
const sticker=id=>`<span class="sticker" style="--c:${CAT[id].c}">${esc(CAT[id].nom)}</span>`;

/* ---------- Unités d'enseignement ---------- */
const UE={
 "2026":{label:"1re année",sub:"Référentiel 2026",note:"Nouveau référentiel entré en vigueur en septembre 2026 : 5 domaines, UE codées A à E. Répartition par semestre d'après la maquette d'un IFSI, elle peut varier légèrement selon votre institut.",
  list:[
   ["A.1","Fondamentaux des sciences infirmières et raisonnement clinique","A",[1,2,3,5]],
   ["A.2","Législation, déontologie, éthique","A",[1,3,5]],
   ["B.1","Sciences biomédicales","B",[1,2,3,4,5]],
   ["B.2","Sciences humaines et sociales","B",[1,2,3]],
   ["B.3","Pratiques et interventions infirmières","B",[1,2,3,4,5]],
   ["B.4","Démarche qualité et gestion des risques","B",[2,6]],
   ["C.1","Santé publique, promotion, prévention, ETP","C",[1,2,3,4]],
   ["C.2","Santé environnementale et transition écologique","C",[1,3,5]],
   ["D.1","Savoir-être, communication et leadership","D",[1,2,5,6]],
   ["D.2","Coordination des activités et gestion d'une structure","D",[5]],
   ["D.3","Formation, développement des compétences et APP","D",[3,6]],
   ["D.4","Numérique en santé","D",[2]],
   ["E.1","Recherche, méthodes et données probantes","E",[2,4,5,6]],
   ["E.2","Langue vivante étrangère","E",[1,2,3,4,5,6]],
   ["E.3","Méthodes de travail et aide à la réussite","E",[1,3]]
  ],
  groups:{A:"Sciences infirmières, droit, éthique",B:"Pratiques cliniques, qualité, risques",C:"Prévention et promotion de la santé",D:"Communication, équipe, leadership",E:"Recherche et méthodologie"}},
 "2009":{label:"2e et 3e année",sub:"Référentiel 2009",note:"Les promotions entrées avant 2026 terminent leur cursus avec le référentiel de 2009.",
  list:[
   ["1.1","Psychologie, sociologie, anthropologie","1",[1,2]],
   ["1.2","Santé publique et économie de la santé","1",[2,3]],
   ["1.3","Législation, éthique, déontologie","1",[1,4]],
   ["2.1","Biologie fondamentale","2",[1]],
   ["2.2","Cycles de la vie et grandes fonctions","2",[1]],
   ["2.3","Santé, maladie, handicap, accidents de la vie","2",[2]],
   ["2.4","Processus traumatiques","2",[1]],
   ["2.5","Processus inflammatoires et infectieux","2",[3]],
   ["2.6","Processus psychopathologiques","2",[2,5]],
   ["2.7","Défaillances organiques et processus dégénératifs","2",[4]],
   ["2.8","Processus obstructifs","2",[3]],
   ["2.9","Processus tumoraux","2",[5]],
   ["2.10","Infectiologie, hygiène","2",[1]],
   ["2.11","Pharmacologie et thérapeutiques","2",[1,3,5]],
   ["3.1","Raisonnement et démarche clinique infirmière","3",[1,2]],
   ["3.2","Projet de soins infirmiers","3",[2,3]],
   ["3.3","Rôles infirmiers, organisation du travail et interprofessionnalité","3",[3,5]],
   ["3.4","Initiation à la démarche de recherche","3",[4,6]],
   ["3.5","Encadrement des professionnels de soins","3",[4]],
   ["4.1","Soins de confort et de bien-être","4",[1]],
   ["4.2","Soins relationnels","4",[2,3,5]],
   ["4.3","Soins d'urgence","4",[2,4]],
   ["4.4","Thérapeutiques et contribution au diagnostic médical","4",[2,4,5]],
   ["4.5","Soins infirmiers et gestion des risques","4",[2,4]],
   ["4.6","Soins éducatifs et préventifs","4",[3,4]],
   ["4.7","Soins palliatifs et fin de vie","4",[5]],
   ["4.8","Qualité des soins, évaluation des pratiques","4",[6]],
   ["5.1","Accompagnement de la personne dans la réalisation de ses soins quotidiens","5",[1]],
   ["5.2","Évaluation d'une situation clinique","5",[2]],
   ["5.3","Communication et conduite de projet","5",[3]],
   ["5.4","Soins éducatifs et formation des professionnels et des stagiaires","5",[4]],
   ["5.5","Mise en œuvre des thérapeutiques et coordination des soins","5",[5]],
   ["5.6","Analyse de la qualité et traitement des données scientifiques et professionnelles","5",[6]],
   ["5.7","Unité optionnelle","5",[5,6]],
   ["6.1","Méthodes de travail","6",[1]],
   ["6.2","Anglais","6",[1,2,3,4,5,6]]
  ],
  groups:{"1":"Sciences humaines, sociales et droit","2":"Sciences biologiques et médicales","3":"Sciences et techniques infirmières : fondements","4":"Sciences et techniques infirmières : interventions","5":"Intégration des savoirs et posture professionnelle","6":"Méthodes de travail"}}
};

/* ---------- Aides de mise en forme ---------- */
const K=(...a)=>`<div class="kv">${a.map(x=>`<span>${x}</span>`).join("")}</div>`;
const U=(...a)=>`<ul class="clean">${a.map(x=>`<li>${x}</li>`).join("")}</ul>`;
const O=(...a)=>`<ol class="clean">${a.map(x=>`<li>${x}</li>`).join("")}</ol>`;
const C=t=>`<div class="callout">${t}</div>`;
const W=t=>`<div class="callout warn">${t}</div>`;
const P=t=>`<p>${t}</p>`;
const R=(q,...a)=>`<details><summary>${q}</summary><div class="det-body">${a.join("")}</div></details>`;
const F=(id,cat,theme,titre,u,body,pro)=>({id,cat,theme,titre,u,body,pro});

/* ---------- Fiches récap ---------- */
const FICHES=[
/* Sciences humaines, relation */
F("maslow","role","Sciences humaines","La pyramide des besoins de Maslow","1.1|B.2",
 O("<b>Besoins physiologiques</b> : respirer, manger, boire, dormir","<b>Sécurité</b> : se sentir protégé, stabilité, absence de douleur","<b>Appartenance</b> : être entouré, aimé, faire partie d'un groupe","<b>Estime</b> : être reconnu, se sentir utile","<b>Accomplissement</b> : se réaliser, donner du sens")+
 C("En soins, on commence par les besoins de la base : un patient qui a mal ou qui a peur n'est pas disponible pour apprendre.")),
F("defense","role","Sciences humaines","Les mécanismes de défense","1.1 4.2|B.2 D.1",
 K("Déni","refuser la réalité","Projection","attribuer à l'autre ses propres émotions","Régression","revenir à un comportement plus enfantin","Rationalisation","justifier par des raisons logiques","Sublimation","transformer une souffrance en activité valorisée","Agressivité","décharger l'angoisse sur l'entourage")+
 C("Ces réactions sont inconscientes. Le soignant les repère sans les juger : un patient agressif est souvent un patient angoissé.")),
F("deuil","role","Sciences humaines","Les étapes du deuil","1.1 4.7|B.2 B.3",
 O("Déni ou choc","Colère","Marchandage","Tristesse, dépression","Acceptation")+
 P("Modèle d'Elisabeth Kübler-Ross, décrit à propos de l'annonce d'une maladie grave.")+
 C("Les étapes ne sont pas linéaires : on peut revenir en arrière ou en vivre deux à la fois.")),
F("rogers","role","Soins relationnels","L'entretien d'aide selon Rogers","4.2|D.1",
 K("Empathie","comprendre le vécu de l'autre sans le vivre","Congruence","être authentique, cohérent","Considération positive","accepter la personne sans jugement")+
 U("<b>Écoute active</b> : silences, regard, posture ouverte","<b>Reformulation</b> : « Si je comprends bien, vous… »","<b>Questions ouvertes</b> : « Comment vivez-vous… ? »")),
F("agressivite","role","Soins relationnels","Faire face à l'agressivité","4.2 4.5|D.1 B.4",
 U("Garder une distance de sécurité, ne pas se placer dos à la porte","Parler calmement, voix basse, phrases courtes","Reconnaître l'émotion : « Je vois que vous êtes en colère »","Ne pas rester seul, prévenir l'équipe","Tracer l'événement et le déclarer")+
 W("Si la situation devient dangereuse, on se met en sécurité d'abord.")),
F("sante-def","role","Santé publique","Santé, maladie, handicap : les définitions","2.3 1.2|C.1",
 P("<b>Santé (OMS, 1946)</b> : un état de complet bien-être physique, mental et social, et pas seulement l'absence de maladie.")+
 P("<b>Handicap (loi du 11 février 2005)</b> : une limitation d'activité ou de participation à la vie en société, due à une altération physique, sensorielle, mentale, cognitive ou psychique.")+
 C("Maladie aiguë : début brutal, durée courte. Maladie chronique : durée longue, évolution lente, impact sur la vie quotidienne.")),
F("prevention","role","Santé publique","Les trois niveaux de prévention","1.2 4.6|C.1",
 K("Primaire","éviter la maladie (vaccin, hygiène)","Secondaire","dépister tôt (mammographie, glycémie)","Tertiaire","limiter les complications et rechutes (rééducation, ETP)")+
 C("Exemple du diabète : alimentation équilibrée (primaire), glycémie à jeun en médecine du travail (secondaire), soin des pieds du diabétique (tertiaire).")),
F("determinants","role","Santé publique","Les déterminants de santé","1.2|C.1 C.2",
 U("<b>Individuels</b> : âge, sexe, génétique","<b>Comportements</b> : alimentation, tabac, alcool, activité physique","<b>Environnement</b> : logement, pollution, travail","<b>Social et économique</b> : revenus, éducation, isolement","<b>Système de santé</b> : accès aux soins, couverture sociale")+
 C("Les inégalités sociales de santé expliquent des écarts d'espérance de vie importants entre catégories sociales.")),
/* Législation */
F("secret","role","Législation","Le secret professionnel","1.3|A.2",
 U("Il couvre tout ce que l'infirmier voit, entend ou comprend dans l'exercice de sa profession","Sa violation est punie par le Code pénal (article 226-13)","Il peut être partagé au sein de l'équipe de soins, dans l'intérêt du patient","Il continue après le décès du patient")+
 W("Attention aux discussions dans l'ascenseur, à la cafétéria et sur les réseaux sociaux.")),
F("consentement","role","Législation","Consentement et personne de confiance","1.3|A.2",
 P("<b>Loi du 4 mars 2002 (loi Kouchner)</b> : aucun acte ni traitement sans le consentement libre et éclairé du patient, qui peut le retirer à tout moment.")+
 U("<b>Personne de confiance</b> : désignée par écrit, révocable à tout moment. Elle accompagne le patient et est consultée s'il ne peut plus s'exprimer","<b>Personne à prévenir</b> : simple contact, elle n'a pas ce rôle","Le patient a droit à l'accès à son dossier médical")+
 C("Pour un mineur ou un majeur protégé, on recherche quand même son avis, selon sa capacité à comprendre.")),
F("responsabilites","role","Législation","Les trois responsabilités de l'infirmier","1.3|A.2",
 K("Civile","réparer un dommage (indemnisation)","Pénale","sanction d'une infraction (amende, prison)","Disciplinaire","sanction professionnelle (Ordre, employeur)")+
 P("L'étudiant est responsable de ses actes. L'infirmier qui l'encadre reste responsable de l'encadrement.")+
 C("La traçabilité protège : un soin non tracé est considéré comme non fait.")),
F("roles","role","Législation","Rôle propre et rôle prescrit","1.3 3.3|A.1 A.2",
 U("<b>Rôle propre</b> : soins décidés et réalisés par l'infirmier (hygiène, confort, surveillance, prévention, éducation)","<b>Rôle prescrit</b> : soins sur prescription médicale écrite, datée et signée (injections, perfusions, prélèvements)","<b>Collaboration avec l'aide-soignant</b> : l'infirmier peut lui confier certains soins relevant de son rôle propre, sous sa responsabilité")+
 W("La loi sur la profession infirmière de juin 2025 fait évoluer les missions : vérifiez la liste des actes en vigueur dans vos cours.")),
F("fin-vie-loi","role","Législation","Fin de vie : loi Claeys-Leonetti","1.3 4.7|A.2 B.3",
 U("Refus de l'obstination déraisonnable","<b>Directives anticipées</b> : volontés écrites du patient, elles s'imposent au médecin sauf urgence vitale ou si elles sont manifestement inappropriées","<b>Sédation profonde et continue</b> jusqu'au décès, possible dans des situations précises, après une procédure collégiale","Rôle renforcé de la personne de confiance")+
 C("Loi du 2 février 2016. Le soulagement de la douleur et l'accompagnement restent toujours dus.")),
/* Biologie, anatomie */
F("cellule","anat","Biologie","La cellule et les tissus","2.1|B.1",
 K("Membrane","limite et échanges","Noyau","contient l'ADN","Mitochondrie","produit l'énergie","Ribosome","fabrique les protéines")+
 P("<b>Quatre types de tissus</b> : épithélial (revêtement), conjonctif (soutien), musculaire (mouvement), nerveux (transmission).")),
F("coeur","anat","Cardiovasculaire","Le trajet du sang","2.2|B.1",
 O("Oreillette droite","Ventricule droit","Artère pulmonaire, vers les poumons","Veines pulmonaires, sang oxygéné","Oreillette gauche","Ventricule gauche","Aorte, vers tous les organes","Veines caves, retour à l'oreillette droite")+
 C("Le cœur droit envoie le sang aux poumons, le cœur gauche l'envoie au reste du corps.")),
F("respi-anat","anat","Respiratoire","Le trajet de l'air","2.2|B.1",
 O("Fosses nasales, bouche","Pharynx, puis larynx","Trachée","Bronches, puis bronchioles","Alvéoles : échanges gazeux avec le sang")+
 P("L'oxygène passe des alvéoles vers le sang, le CO₂ fait le chemin inverse.")+
 C("Le diaphragme est le principal muscle de l'inspiration.")),
F("rein","anat","Urinaire","Le rein et la diurèse","2.2|B.1",
 U("Unité de base : le néphron, qui filtre le sang","Rôles : éliminer les déchets (urée, créatinine), réguler l'eau et les électrolytes, réguler la tension, produire l'EPO","Trajet : rein, uretère, vessie, urètre")+
 K("Diurèse normale adulte","≈ 1,5 L/24 h","Oligurie","< 500 mL/24 h","Anurie","< 100 mL/24 h")),
F("nerveux","anat","Neurologie","Le système nerveux","2.2|B.1",
 U("<b>Central</b> : encéphale (cerveau, cervelet, tronc cérébral) et moelle épinière","<b>Périphérique</b> : nerfs qui relient le système central au corps","<b>Sympathique</b> : situation de stress, accélère le cœur, dilate les pupilles","<b>Parasympathique</b> : repos et digestion, ralentit le cœur")+
 C("Une atteinte de l'hémisphère gauche donne des signes du côté droit du corps, et inversement.")),
F("digestif","anat","Digestif","Le tube digestif","2.2|B.1",
 O("Bouche : mastication, salive","Œsophage","Estomac : brassage, acidité","Intestin grêle : absorption des nutriments","Côlon : absorption de l'eau","Rectum, anus")+
 P("Organes associés : foie (bile, détoxification), pancréas (enzymes digestives, insuline), vésicule biliaire.")),
F("sang","anat","Hématologie","Le sang et ses cellules","2.1 2.2|B.1",
 K("Globules rouges","transport de l'oxygène","Globules blancs","défense contre les infections","Plaquettes","coagulation","Plasma","partie liquide, 55 % du volume")+
 C("Groupes sanguins : système ABO et Rhésus. Le donneur universel en globules rouges est O négatif.")),
/* Vocabulaire */
F("prefixes","voca","Préfixes et suffixes","Décoder un mot médical","2.1|B.1",
 K("hypo- / hyper-","en dessous / au-dessus","tachy- / brady-","rapide / lent","dys-","difficulté","a- / an-","absence","-ite","inflammation","-algie","douleur","-ectomie","ablation","-stomie","abouchement à la peau","-émie","dans le sang","-urie","dans les urines","-pnée","respiration")+
 C("Exemple : <b>dys-pnée</b> = difficulté à respirer. <b>Hyper-kali-émie</b> = trop de potassium dans le sang.")),
F("racines","voca","Racines","Les racines des organes","2.1|B.1",
 K("cardi-","cœur","pneumo- / pulmo-","poumon","néphr- / rén-","rein","hépat-","foie","gastr-","estomac","entér-","intestin","cyst-","vessie","derm-","peau","ostéo-","os","neuro-","nerf","hém- / hémat-","sang")+
 C("Gastro-entér-ite : inflammation de l'estomac et de l'intestin.")),
F("abrev","voca","Abréviations","Abréviations courantes","4.4|B.3",
 K("PO","per os (par la bouche)","SC / IM / IV","sous-cut. / intramusc. / intraveineux","IVD / IVL","IV directe / lente","PSE","pousse-seringue électrique","VVP","voie veineuse périphérique","NFS","numération formule sanguine","ATCD","antécédents","EVA","échelle visuelle analogique","SAD","sonde à demeure","TA / PA","tension, pression artérielle")),
F("anglais","voca","Anglais médical","Les mots anglais du soin","6.2|E.2",
 K("pain","douleur","shortness of breath","essoufflement","chest pain","douleur thoracique","dizziness","vertige","nausea","nausée","rash","éruption cutanée","bleeding","saignement","fever","fièvre","blood pressure","tension artérielle","ward","service","discharge","sortie du patient")+
 C("Phrase utile : « Can you rate your pain from 0 to 10? »")),

/* Processus traumatiques */
F("fracture","patho","Traumatologie","Fractures et surveillance d'un plâtre","2.4|B.1 B.3",
 P("<b>Signes d'une fracture</b> : douleur, impotence fonctionnelle, déformation, œdème, hématome.")+
 U("Surveiller les extrémités : couleur, chaleur, mobilité, sensibilité, pouls","Surélever le membre","Vérifier que le plâtre ne serre pas")+
 W("Douleur qui augmente malgré les antalgiques, doigts froids ou bleus, fourmillements : risque de <b>syndrome des loges</b>. Alerter en urgence.")),
F("brulure","patho","Traumatologie","Brûlures : évaluer la gravité","2.4 4.3|B.1 B.3",
 K("1er degré","rougeur douloureuse (coup de soleil)","2e degré superficiel","phlyctènes, très douloureux","2e degré profond","moins douloureux, peau blanchâtre","3e degré","indolore, cartonné, blanc ou noir")+
 P("<b>Règle des 9 de Wallace</b> (adulte) : tête 9 %, chaque bras 9 %, chaque jambe 18 %, tronc avant 18 %, tronc arrière 18 %, périnée 1 %.")+
 C("Premier geste : refroidir à l'eau tempérée environ 15 minutes, sauf brûlure étendue (risque d'hypothermie).")),
F("tc","patho","Traumatologie","Traumatisme crânien : surveillance","2.4 4.3|B.1 B.3",
 U("Score de Glasgow et pupilles à intervalles réguliers","Céphalées, vomissements, somnolence","Déficit d'un membre, trouble de la parole")+
 W("Sous anticoagulant ou antiagrégant, tout choc à la tête impose d'alerter le médecin, même si le patient semble aller bien.")),
/* Inflammation, infection */
F("inflammation","patho","Infectieux","La réaction inflammatoire","2.5|B.1",
 P("<b>Les quatre signes</b> : rougeur, chaleur, douleur, œdème. Une impotence fonctionnelle peut s'y ajouter.")+
 K("CRP","marqueur d'inflammation","Leucocytes","augmentés en cas d'infection bactérienne","Fièvre","T° > 38 °C")+
 C("L'inflammation n'est pas toujours une infection : une entorse ou une maladie auto-immune donnent aussi une inflammation.")),
F("sepsis","patho","Infectieux","Reconnaître un sepsis","2.5 4.3|B.1 B.3",
 P("Le sepsis est une infection qui provoque une défaillance d'organes. C'est une urgence.")+
 P("<b>Score qSOFA</b> : un point pour chaque critère. Deux points ou plus doivent alerter.")+
 K("Fréquence respiratoire","≥ 22 /min","Pression systolique","≤ 100 mmHg","Conscience","altérée")+
 W("Hémocultures avant l'antibiothérapie, mais l'antibiotique ne doit pas être retardé.")),
F("infections","patho","Infectieux","Infections fréquentes à l'hôpital","2.5 2.10|B.1 B.4",
 U("<b>Infection urinaire</b> : brûlures, envies fréquentes, urines troubles. Risque majoré avec une sonde","<b>Pneumopathie</b> : fièvre, toux, dyspnée, crépitants","<b>Infection de cathéter</b> : rougeur, douleur, écoulement au point de ponction","<b>Infection du site opératoire</b> : cicatrice rouge, chaude, écoulement")+
 C("Une infection associée aux soins apparaît au cours ou au décours d'une prise en charge, sans être présente à l'admission.")),
F("compl-precautions","soins","Hygiène","Précautions complémentaires","2.10|B.4",
 K("Contact","BMR, gale, <i>C. difficile</i> : tablier, gants","Gouttelettes","grippe, Covid : masque chirurgical","Air","tuberculose, rougeole, varicelle : masque FFP2, porte fermée")+
 W("Pour <i>Clostridioides difficile</i> et la gale, lavage des mains au savon puis friction : le gel hydroalcoolique seul ne suffit pas.")),
F("precautions","soins","Hygiène","Précautions standard","2.10 4.5|B.3 B.4",
 U("Friction hydroalcoolique avant et après chaque soin (20 à 30 s)","Gants si contact avec du sang ou des liquides biologiques, changés entre deux patients","Tablier, masque, lunettes si risque de projection","Ne jamais recapuchonner une aiguille, collecteur à portée de main","Avant-bras dégagés, ni bijoux ni vernis")),
F("aes","soins","Hygiène","Accident d'exposition au sang","2.10 4.5|B.4",
 O("<b>Piqûre ou coupure</b> : ne pas faire saigner, nettoyer à l'eau et au savon, rincer, puis désinfecter au moins 5 minutes","<b>Projection sur une muqueuse</b> : rincer abondamment au moins 5 minutes","Contacter rapidement le médecin référent : un traitement préventif se décide idéalement dans les 4 heures","Déclarer l'accident de travail")+
 C("Connaître le statut sérologique du patient source, avec son accord, aide la décision.")),
F("dasri","soins","Hygiène","Le tri des déchets de soins","2.10|C.2 B.4",
 K("DASRI","emballage jaune : piquants, objets souillés de sang","DAOM","sac noir : déchets assimilés ménagers","Collecteur","piquants, coupants, jamais au-delà du trait")+
 C("Bien trier réduit les coûts et l'impact environnemental : un déchet non contaminé n'a rien à faire dans la filière DASRI.")),
/* Psychiatrie */
F("depression","patho","Psychiatrie","Dépression et risque suicidaire","2.6|B.1",
 P("<b>Signes</b> : tristesse, perte d'intérêt et de plaisir, fatigue, troubles du sommeil et de l'appétit, culpabilité, idées de mort.")+
 P("<b>Évaluation RUD</b> du risque suicidaire : Risque (facteurs), Urgence (projet, date), Dangerosité (moyen, accès).")+
 W("Parler du suicide n'augmente pas le risque. Il faut poser la question directement et transmettre. Numéro national de prévention du suicide : 3114.")),
F("schizophrenie","patho","Psychiatrie","La schizophrénie","2.6|B.1",
 K("Signes positifs","délire, hallucinations","Signes négatifs","retrait, émoussement, perte d'élan","Désorganisation","discours et comportement incohérents")+
 C("Face à un délire : ne pas argumenter ni entrer dans le délire. On reconnaît l'émotion et on ramène à la réalité.")),
F("bipolaire","patho","Psychiatrie","Le trouble bipolaire","2.6|B.1",
 P("Alternance d'épisodes dépressifs et d'épisodes maniaques : euphorie ou irritabilité, réduction du sommeil, idées de grandeur, dépenses excessives.")+
 W("Sous lithium : surveiller la lithiémie. Tremblements importants, troubles digestifs, confusion font évoquer un surdosage.")),
F("addictions","patho","Psychiatrie","Addictions et sevrage alcoolique","2.6|B.1 C.1",
 P("<b>Addiction</b> : perte de contrôle, envie irrépressible (craving), poursuite malgré les conséquences.")+
 U("Sevrage alcoolique : sueurs, tremblements, agitation, tachycardie","Surveillance avec un score (par exemple Cushman)","Hydratation, vitamine B1 selon prescription")+
 W("<b>Delirium tremens</b> : confusion, hallucinations, fièvre. C'est une urgence vitale.")),
F("neuroleptiques","thera","Psychiatrie","Neuroleptiques : surveillance","2.6 2.11|B.1",
 U("Effets extrapyramidaux : tremblements, rigidité, mouvements anormaux","Somnolence, prise de poids, constipation","Hypotension orthostatique : lever progressif")+
 W("<b>Syndrome malin</b> : fièvre, rigidité, troubles de conscience. Urgence, arrêt du traitement sur avis médical.")),

/* Défaillances organiques, processus dégénératifs */
F("hypo","patho","Diabète","Hypoglycémie : conduite à tenir","2.7 4.3|B.1 B.3",
 P("Seuil : <span class='mark'>glycémie &lt; 0,70 g/L</span>.")+
 P("<b>Signes</b> : sueurs, tremblements, pâleur, faim, confusion, troubles du comportement.")+
 U("Patient conscient : 15 g de sucre rapide (3 morceaux ou 1 verre de jus)","Contrôle de la glycémie 15 min après","Puis collation avec sucres lents","Patient inconscient : rien par la bouche, appel du médecin, application du protocole")),
F("diabete","patho","Diabète","Diabète de type 1 et de type 2","2.7|B.1",
 K("Type 1","plus de production d'insuline, souvent jeune, insuline obligatoire","Type 2","résistance à l'insuline, souvent après 40 ans, hygiène de vie puis traitements")+
 P("<b>Hyperglycémie</b> : soif intense, urines abondantes, fatigue, amaigrissement.")+
 K("Glycémie à jeun normale","0,70–1,10 g/L","Diabète","≥ 1,26 g/L à jeun, à deux reprises","HbA1c","reflet des 3 derniers mois")+
 W("Pied du diabétique : examen régulier, toute plaie se surveille de près car la sensibilité est diminuée.")),
F("ic","patho","Cardiologie","L'insuffisance cardiaque","2.7|B.1",
 P("<b>Gauche</b> : signes respiratoires. Essoufflement, besoin de dormir assis (orthopnée), jusqu'à l'œdème aigu du poumon.")+
 P("<b>Droite</b> : signes de congestion. Œdèmes des jambes, veines du cou gonflées, douleur du foie.")+
 U("Peser le patient chaque jour, à la même heure","Surveiller la diurèse et les œdèmes","Régime pauvre en sel selon prescription")+
 W("Une prise de poids rapide (environ 2 kg en quelques jours) doit faire alerter.")),
F("irc","patho","Néphrologie","L'insuffisance rénale","2.7|B.1",
 P("Le rein ne filtre plus correctement. On l'évalue par la créatinine et le débit de filtration glomérulaire (DFG).")+
 U("Surveiller diurèse, poids, œdèmes, tension","Surveiller la kaliémie : l'hyperkaliémie peut provoquer des troubles du rythme","Éviter les médicaments toxiques pour le rein (AINS, produits de contraste) sauf avis médical","Préserver le capital veineux d'un bras en vue d'une dialyse")),
F("bpco","patho","Pneumologie","La BPCO","2.7|B.1",
 P("Maladie chronique des bronches, le plus souvent liée au tabac. Essoufflement progressif, toux et crachats.")+
 U("Oxygène uniquement au débit prescrit","Saturation cible souvent plus basse que la normale, fixée par le médecin","Éducation : arrêt du tabac, inhalateurs, activité physique adaptée")+
 W("Trop d'oxygène peut entraîner une hypercapnie : somnolence, confusion, sueurs. Alerter.")),
F("alzheimer","patho","Neurologie","Maladie d'Alzheimer","2.7|B.1",
 P("Troubles de la mémoire récente, désorientation, troubles du langage et du comportement, perte progressive d'autonomie.")+
 U("Phrases courtes, une consigne à la fois","Ne pas contredire ni mettre en échec","Garder des repères : horaires, objets familiers","Prévenir la dénutrition et les chutes")+
 C("Une aggravation brutale de la confusion fait chercher une autre cause : infection, rétention urinaire, douleur, médicament.")),
F("parkinson","patho","Neurologie","Maladie de Parkinson","2.7|B.1",
 K("Tremblement","de repos","Rigidité","raideur des membres","Akinésie","lenteur, difficulté à initier un mouvement")+
 W("Les horaires des traitements doivent être respectés à la minute près : un retard peut bloquer le patient.")),
/* Processus obstructifs */
F("sca","patho","Cardiologie","Infarctus : reconnaître l'urgence","2.8 4.3|B.1 B.3",
 P("Douleur thoracique en barre ou en serrement, qui peut irradier dans le bras gauche, la mâchoire ou le dos, prolongée, ne cédant pas au repos.")+
 U("ECG dans les 10 minutes","Repos strict, surveillance scope, voie veineuse","Appel du médecin ou du 15")+
 W("Chez la femme, le sujet âgé ou le diabétique, les signes peuvent être atypiques : fatigue, nausées, essoufflement.")),
F("avc","patho","Neurologie","AVC : le réflexe VITE","2.8 4.3|B.1 B.3",
 K("V","Visage paralysé","I","Inertie d'un membre","T","Trouble de la parole","E","En urgence, appeler le 15")+
 P("Noter l'heure exacte du début des signes : elle conditionne l'accès aux traitements de désobstruction.")+
 C("AVC ischémique (caillot) dans environ 80 % des cas, hémorragique dans les autres.")),
F("tvp-ep","patho","Vasculaire","Phlébite et embolie pulmonaire","2.8|B.1",
 P("<b>Phlébite (TVP)</b> : mollet douloureux, chaud, gonflé, perte du ballottement.")+
 P("<b>Embolie pulmonaire</b> : essoufflement brutal, douleur thoracique, tachycardie, parfois malaise.")+
 U("Prévention : lever précoce, bas de contention et anticoagulant selon prescription","Mobiliser les jambes au lit")+
 W("Suspicion de phlébite : ne pas masser, garder au repos et alerter.")),
F("occlusion","patho","Digestif","L'occlusion intestinale","2.8|B.1",
 P("Arrêt du transit. Quatre signes : douleurs abdominales, vomissements, arrêt des matières et des gaz, ballonnement.")+
 U("À jeun strict","Pose d'une sonde nasogastrique selon prescription","Surveillance de la douleur, des vomissements et des constantes")),
/* Tumoraux */
F("cancer","patho","Oncologie","Cancer : les notions clés","2.9|B.1",
 K("Tumeur bénigne","limitée, ne s'étend pas","Tumeur maligne","envahit et peut donner des métastases","Stade","étendue de la maladie (TNM)")+
 U("<b>Traitements</b> : chirurgie, chimiothérapie, radiothérapie, immunothérapie, hormonothérapie","<b>Dispositif d'annonce</b> : consultation médicale, temps d'accompagnement soignant, coordination")),
F("chimio","thera","Oncologie","Chimiothérapie : effets secondaires","2.9 2.11|B.1 B.3",
 U("Nausées et vomissements","Mucite : bouche douloureuse, soins de bouche","Fatigue","Chute des cheveux","Aplasie : chute des globules blancs")+
 W("Fièvre pendant une aplasie = urgence. Le patient doit appeler immédiatement.")+
 C("Manipulation des cytotoxiques : gants, protection, élimination dans la filière dédiée.")),
F("pac","soins","Oncologie","La chambre implantable","2.9 4.4|B.3",
 U("Ponction avec une aiguille de Huber, en asepsie stricte","Vérifier le reflux sanguin avant toute injection","Rinçage pulsé au sérum physiologique après chaque utilisation","Surveiller le point de ponction : rougeur, douleur, gonflement")+
 W("Douleur ou gonflement pendant la perfusion : arrêter et alerter, risque d'extravasation.")),

/* Pharmacologie */
F("5b","thera","Administration","Règle des 5B","2.11 4.4|B.3 B.4",
 U("<b>Bon patient</b> : identité vérifiée (bracelet, question ouverte)","<b>Bon médicament</b> : nom, forme, péremption","<b>Bonne dose</b> : calcul vérifié, double contrôle si besoin","<b>Bonne voie</b> : orale, IV, SC, IM…","<b>Bon moment</b> : horaire, à jeun ou pendant le repas")+
 P("Puis on trace l'administration immédiatement dans le dossier.")),
F("adme","thera","Pharmacologie","Le trajet d'un médicament","2.11|B.1",
 K("Absorption","passage dans le sang","Distribution","diffusion vers les organes","Métabolisme","transformation, surtout par le foie","Élimination","surtout par les reins")+
 C("Insuffisance hépatique ou rénale, âge avancé : le médicament s'accumule plus facilement. Les doses sont souvent adaptées.")),
F("galenique","thera","Pharmacologie","Formes et voies d'administration","2.11 4.4|B.1 B.3",
 U("Un comprimé à libération prolongée (LP) ne s'écrase pas","Une gélule gastrorésistante ne s'ouvre pas sans avis du pharmacien","Voie sublinguale : passage rapide dans le sang","Voie IV : action la plus rapide, aucune marge d'erreur")+
 C("En cas de troubles de la déglutition, vérifier avec le pharmacien quelles formes peuvent être écrasées.")),
F("antalgiques","thera","Douleur","Les paliers de l'OMS","2.11 4.4|B.1",
 K("Palier 1","paracétamol, AINS","Palier 2","opioïdes faibles : tramadol, codéine","Palier 3","opioïdes forts : morphine, oxycodone")+
 P("Paracétamol : 4 g par jour au maximum chez l'adulte en général, moins si petit poids ou atteinte du foie.")+
 W("Sous morphine : surveiller la fréquence respiratoire et la sédation, prévenir la constipation. Antidote : naloxone.")),
F("ains","thera","Pharmacologie","AINS et corticoïdes","2.11|B.1",
 P("<b>AINS</b> (ibuprofène, kétoprofène) : risque digestif (ulcère), rénal et hémorragique. Pris pendant le repas.")+
 P("<b>Corticoïdes</b> : hyperglycémie, rétention d'eau et de sel, risque infectieux, troubles du sommeil.")+
 W("Un traitement corticoïde prolongé ne s'arrête jamais brutalement : la diminution est progressive.")),
F("anticoag","thera","Cardiologie","Les anticoagulants","2.11|B.1",
 K("HBPM (voie SC)","surveiller les plaquettes","AVK (voie orale)","surveiller l'INR","AOD (voie orale)","pas d'INR")+
 P("<b>Risque principal</b> : l'hémorragie. Surveiller saignement des gencives, hématomes, sang dans les urines ou les selles.")+
 C("INR cible habituel sous AVK : entre 2 et 3, plus haut pour certaines valves cardiaques.")),
F("diuretiques","thera","Cardiologie","Les diurétiques","2.11|B.1",
 K("Furosémide (de l'anse)","risque d'hypokaliémie","Spironolactone","risque d'hyperkaliémie")+
 U("Surveiller le poids, la diurèse, la tension","Surveiller la kaliémie","Risque de déshydratation, surtout chez la personne âgée","Donner le matin pour éviter les levers nocturnes")),
F("antibio","thera","Infectieux","Les antibiotiques","2.11|B.1",
 U("Rechercher une allergie avant la première administration","Prélèvements (hémocultures, ECBU) avant la première dose si prescrits","Respecter les horaires pour garder une concentration efficace","Surveiller l'efficacité : fièvre, signes locaux")+
 W("Diarrhée sous antibiotiques : penser à <i>Clostridioides difficile</i> et alerter.")),
F("stupefiants","thera","Législation","Les stupéfiants","2.11 1.3|B.1 A.2",
 U("Rangés dans une armoire ou un coffre fermé à clé","Prescription sur ordonnance sécurisée","Traçabilité de chaque administration","Retour des ampoules vides à la pharmacie")+
 C("Toute ampoule cassée ou perdue doit être déclarée et tracée.")),
F("insuline-f","thera","Diabète","Insulines : les repères","2.11 4.4|B.1 B.3",
 K("Rapide","juste avant le repas","Lente","1 fois par jour, à heure fixe")+
 U("Glycémie capillaire avant chaque insuline rapide","Repas non pris : prévenir avant d'injecter une rapide","Rotation des sites d'injection")+
 W("L'insuline fait partie des médicaments à haut risque : double vérification de la dose.")),
/* Soins et techniques */
F("injections","soins","Techniques","Les injections","4.4|B.3",
 K("Sous-cutanée","pli cutané, abdomen, cuisse, bras","Intramusculaire","angle 90°, cuisse, fessier, deltoïde","Intraveineuse","sur prescription, voie la plus rapide")+
 U("Vérifier la prescription et les 5B","Asepsie selon le protocole","Éliminer l'aiguille directement dans le collecteur")),
F("vvp","soins","Techniques","Pose et surveillance d'une VVP","4.4|B.3",
 U("Choisir une veine de distal en proximal, éviter les plis et le bras d'une fistule ou d'un curage ganglionnaire","Garrot, antisepsie en plusieurs temps selon protocole","Pansement transparent stérile, date de pose tracée")+
 W("Rougeur, douleur, induration le long de la veine : phlébite. Retirer le cathéter selon le protocole et tracer.")),
F("tubes","soins","Prélèvements","L'ordre des tubes de prélèvement","4.4|B.3",
 O("Hémocultures","Citrate (bouchon bleu) : coagulation","Tube sec (rouge ou jaune) : biochimie","Héparine (vert) : biochimie","EDTA (violet) : NFS","Fluorure (gris) : glycémie")+
 C("Ce respect de l'ordre évite de contaminer un tube avec l'additif du précédent. Les couleurs peuvent varier selon les fabricants.")),
F("glycemie-cap","soins","Techniques","La glycémie capillaire","4.4|B.3",
 U("Lavage des mains du patient à l'eau et au savon, bien sécher","Piquer sur le côté du doigt, en changeant de doigt","Vérifier la date de péremption des bandelettes","Tracer le résultat et agir selon le protocole")+
 C("Du sucre sur les doigts ou de l'alcool mal séché faussent le résultat.")),
F("ecg-pose","soins","Techniques","Poser un ECG","4.4|B.3",
 K("Rouge","bras droit","Jaune","bras gauche","Vert","jambe gauche","Noir","jambe droite")+
 U("V1 : 4e espace intercostal, à droite du sternum","V2 : 4e espace intercostal, à gauche du sternum","V4 : 5e espace intercostal, ligne médio-claviculaire","V3 : entre V2 et V4","V5 et V6 : même niveau que V4, lignes axillaires antérieure et moyenne")),
F("sondage","soins","Techniques","Sondage urinaire","4.4|B.3",
 U("Sur prescription, en asepsie stricte","Système clos : ne jamais déconnecter la sonde du sac","Sac toujours en dessous du niveau de la vessie, sans toucher le sol","Surveiller la diurèse, l'aspect des urines, la fièvre")+
 C("La sonde à demeure est la première cause d'infection urinaire associée aux soins : on réévalue chaque jour son intérêt.")),
F("o2","soins","Techniques","L'oxygénothérapie","4.4|B.3",
 K("Lunettes","faible débit","Masque simple","débit moyen","Masque haute concentration","débit élevé")+
 U("Débit et cible de saturation fixés par la prescription","Pas de flamme, pas de corps gras sur le visage","Surveiller la saturation, la fréquence respiratoire, la coloration")),
F("toilette","soins","Confort","La toilette","4.1|B.3",
 U("Respecter la pudeur : fermer la porte, couvrir les zones non lavées","Faire participer le patient selon son autonomie","Du plus propre au plus sale","Observer la peau : rougeurs, plaies, points d'appui")+
 C("La toilette est un moment d'observation et d'échange privilégié avec le patient.")),
F("escarres","soins","Plaies","Stades des escarres","4.1|B.3",
 U("<b>Stade 1</b> : rougeur qui ne blanchit pas à la pression, peau intacte","<b>Stade 2</b> : perte partielle de l'épiderme, phlyctène ou abrasion","<b>Stade 3</b> : perte de toute l'épaisseur de la peau, graisse visible","<b>Stade 4</b> : atteinte des muscles, tendons ou os")+
 C("Évaluation du risque avec l'échelle de Braden ou de Norton.")),
F("chutes","soins","Confort","Prévenir les chutes","4.1 4.5|B.3 B.4",
 U("Lit en position basse, sonnette à portée de main","Chaussures fermées, sol dégagé, éclairage la nuit","Lunettes et aides techniques à proximité","Lever progressif si hypotension orthostatique","Revoir les médicaments qui favorisent les chutes (somnifères, antihypertenseurs)")),
F("deglutition","soins","Confort","Troubles de la déglutition","4.1|B.3",
 U("Position assise, tête légèrement penchée en avant","Textures adaptées : mixé, haché, eau gélifiée selon prescription","Petites bouchées, sans précipitation","Rester avec le patient pendant le repas")+
 W("Toux pendant le repas, voix mouillée, fièvre inexpliquée : penser à une fausse route.")),
F("pansement","soins","Plaies","Réaliser un pansement","4.4|B.3",
 U("Du plus propre au plus sale","Nettoyer au sérum physiologique sauf protocole contraire","Choisir le pansement selon l'aspect de la plaie : bourgeonnante, fibrineuse, nécrotique, exsudative","Tracer : taille, aspect, odeur, exsudat, douleur")),

/* Urgences */
F("acr","soins","Urgences","L'arrêt cardiaque chez l'adulte","4.3|B.3",
 O("Vérifier la conscience et la respiration (moins de 10 secondes)","Donner l'alerte, demander le chariot d'urgence et le défibrillateur","Commencer le massage cardiaque")+
 K("Fréquence","100 à 120 /min","Profondeur","5 à 6 cm","Rythme","30 compressions, 2 insufflations")+
 W("Le défibrillateur se pose dès qu'il arrive. On limite au maximum les interruptions du massage.")),
F("anaphylaxie","soins","Urgences","Le choc anaphylactique","4.3|B.3",
 P("Réaction allergique grave : urticaire, gonflement du visage ou de la gorge, gêne respiratoire, chute de tension.")+
 U("Arrêter le produit suspect","Alerter, allonger le patient (ou assis s'il respire mal)","Adrénaline par voie intramusculaire, face externe de la cuisse, selon protocole","Surveillance rapprochée")+
 C("Chez l'adulte, la dose habituelle d'adrénaline IM est de 0,5 mg.")),
F("pls","soins","Urgences","La position latérale de sécurité","4.3|B.3",
 P("Pour une victime inconsciente qui respire : elle protège les voies aériennes en cas de vomissements.")+
 U("Vérifier la respiration régulièrement","Ne pas mettre en PLS si traumatisme suspect de la colonne sans formation adaptée","Couvrir la victime")),
F("detresse","exam","Urgences","Les signes de détresse vitale","4.3|B.3",
 K("Neurologique","troubles de conscience, Glasgow ≤ 8","Respiratoire","FR > 30 ou < 8, tirage, cyanose, SpO₂ basse","Circulatoire","pouls rapide et filant, marbrures, PAS < 90")+
 W("Un seul de ces signes justifie d'appeler à l'aide immédiatement.")),
/* Examens, surveillance */
F("constantes","exam","Surveillance","Constantes normales de l'adulte","2.2 4.4|B.1 B.3",
 K("Fréquence cardiaque","60–100 bpm","Fréquence respiratoire","12–20 /min","Pression artérielle","&lt; 140/90 mmHg","SpO₂","95–100 %","Température","36,5–37,5 °C","Glycémie à jeun","0,70–1,10 g/L","Diurèse","≈ 0,5 mL/kg/h min.")+
 C("Une valeur isolée se compare toujours à l'état habituel du patient et à son traitement.")),
F("bio","exam","Biologie","Bilan sanguin de base","4.4|B.1",
 K("Sodium (Na⁺)","135–145 mmol/L","Potassium (K⁺)","3,5–5,0 mmol/L","Hémoglobine (homme)","13–17 g/dL","Hémoglobine (femme)","12–16 g/dL","Leucocytes","4–10 G/L","Plaquettes","150–400 G/L")+
 C("Les normes varient un peu selon les laboratoires : on se réfère aux valeurs indiquées sur le résultat.")),
F("glasgow","exam","Neurologie","Score de Glasgow","4.3|B.3",
 K("Ouverture des yeux (Y)","1 à 4","Réponse verbale (V)","1 à 5","Réponse motrice (M)","1 à 6","Score total","3 à 15")+
 W("Score ≤ 8 : coma, risque pour les voies aériennes. Alerter immédiatement.")),
F("douleur-echelles","exam","Douleur","Évaluer la douleur","4.4 4.7|B.3",
 K("EVA / EN","patient qui communique, de 0 à 10","EVS","échelle verbale : absente, faible, modérée, intense","Algoplus","personne âgée non communicante, douleur aiguë, douleur probable dès 2/5","Doloplus","personne âgée non communicante, douleur chronique, douleur probable dès 5/30")+
 C("On évalue avant et après chaque antalgique, et on trace.")),
F("ecbu","exam","Biologie","Les prélèvements urinaires et l'hémoculture","4.4|B.3",
 U("<b>ECBU</b> : toilette locale, élimination du premier jet, recueil en milieu de jet dans un flacon stérile, acheminement rapide","<b>Sur sonde</b> : prélèvement sur le site dédié, jamais dans le sac","<b>Hémocultures</b> : avant les antibiotiques, idéalement lors d'un pic de fièvre ou de frissons, flacons aérobie et anaérobie")),
/* Qualité, risques */
F("identito","role","Gestion des risques","L'identitovigilance","4.5|B.4",
 U("Faire dire au patient son nom et sa date de naissance, ne pas les lui proposer","Vérifier le bracelet avant chaque soin","Traits d'identité : nom de naissance, prénom, date de naissance, sexe")+
 W("Deux patients du même nom dans le service : signaler et renforcer les vérifications.")),
F("erreur-med","role","Gestion des risques","L'erreur médicamenteuse","4.5 2.11|B.4",
 P("<b>Médicaments à haut risque</b> : insuline, anticoagulants, potassium injectable, opioïdes, chimiothérapies.")+
 U("Double vérification pour ces médicaments","Ne jamais préparer à l'avance pour plusieurs patients","Ne pas être interrompu pendant la préparation")+
 W("Le chlorure de potassium ne s'injecte jamais en IV directe.")),
F("ei","role","Gestion des risques","Déclarer un événement indésirable","4.5 4.8|B.4",
 P("Un événement indésirable est un incident lié aux soins, avec ou sans conséquence pour le patient.")+
 U("Prendre en charge le patient d'abord","Informer le médecin et le cadre","Déclarer dans l'outil de l'établissement","L'analyse cherche les causes, pas un coupable")),
F("qualite","role","Qualité","La démarche qualité","4.8|B.4",
 U("<b>Certification HAS</b> : évaluation des établissements de santé tous les 4 ans","<b>Évaluation des pratiques</b> : audits, revues de dossiers, analyse des événements indésirables","<b>Indicateurs</b> : par exemple la consommation de gel hydroalcoolique ou la traçabilité de la douleur")+
 C("Le cycle PDCA : planifier, faire, vérifier, ajuster.")),
/* Éducation, prévention */
F("etp","role","Éducation","L'éducation thérapeutique (ETP)","4.6|C.1",
 O("Diagnostic éducatif : besoins, connaissances, projet du patient","Programme personnalisé avec des objectifs négociés","Séances individuelles ou collectives","Évaluation des compétences acquises")+
 C("L'ETP vise l'autonomie du patient dans la gestion de sa maladie chronique.")),
F("vaccins","role","Prévention","Vaccination : l'essentiel","4.6 1.2|C.1",
 U("Le vaccin protège la personne et, par l'immunité collective, ceux qui ne peuvent pas être vaccinés","Vérifier le carnet et les contre-indications","Chaîne du froid : entre 2 et 8 °C","Traçabilité : nom, lot, date, site d'injection")+
 C("Le calendrier vaccinal évolue chaque année : se référer à la version en vigueur.")),
/* Soins palliatifs */
F("palliatif","soins","Fin de vie","Soins palliatifs : les priorités","4.7|B.3",
 U("Soulager la douleur et les symptômes : dyspnée, nausées, angoisse","Soins de bouche réguliers","Confort et prévention des escarres sans soins agressifs","Accompagnement du patient et de ses proches")+
 C("Les soins palliatifs ne sont pas réservés aux derniers jours : ils peuvent commencer tôt dans une maladie grave.")),
/* Démarche, recherche, encadrement */
F("henderson","situ","Démarche","Les 14 besoins de Virginia Henderson","3.1|A.1",
 O("Respirer","Boire et manger","Éliminer","Se mouvoir, garder une bonne posture","Dormir, se reposer","Se vêtir et se dévêtir","Maintenir sa température","Être propre, protéger ses téguments","Éviter les dangers","Communiquer","Agir selon ses croyances et valeurs","S'occuper en vue de se réaliser","Se divertir","Apprendre")),
F("macrocible","situ","Démarche","La macrocible","3.2 3.3|A.1",
 P("Synthèse écrite de la situation du patient, faite à l'entrée et à des moments clés.")+
 U("Motif d'hospitalisation, antécédents, traitements","Mode de vie, entourage, autonomie","Problèmes identifiés et risques","Projet de soins et de sortie")),
F("recherche","role","Recherche","Initiation à la recherche","3.4|E.1",
 P("<b>Question PICO</b> : Patient, Intervention, Comparaison, Outcome (résultat).")+
 K("Essai randomisé","niveau de preuve élevé","Étude de cohorte","niveau intermédiaire","Série de cas, avis d'experts","niveau faible")+
 C("Bases de données utiles : PubMed, Cairn, la base de la HAS. Une revue de littérature commence par des mots clés bien choisis.")),
F("encadrement","role","Encadrement","Encadrer un stagiaire","3.5 5.4|D.3",
 U("Accueil : présentation de l'équipe et du service","Objectifs de stage discutés dès le début","Montrer, faire avec, puis laisser faire en surveillant","Bilan de mi-stage et de fin de stage","Feedback précis : ce qui est réussi, ce qui reste à travailler")),
F("organisation","role","Organisation","Organiser sa journée de soins","3.3 5.5|D.2",
 U("Lire les transmissions et le dossier avant de commencer","Repérer les urgences et les soins à heure fixe","Regrouper les soins pour un même patient quand c'est possible","Anticiper : examens, sorties, entrées","Tracer au fur et à mesure")),
F("numerique","role","Numérique","Le numérique en santé","5.6|D.4",
 U("<b>Mon espace santé</b> : le carnet de santé numérique du patient, avec son dossier médical partagé","<b>Messagerie sécurisée de santé</b> pour échanger des données entre professionnels","<b>Télésoin</b> : soins à distance par vidéo, dans un cadre défini","<b>RGPD</b> : les données de santé sont sensibles et strictement protégées")+
 W("Jamais de photo de patient sur son téléphone personnel.")),
F("ecologie","role","Environnement","Soins écoresponsables","4.8|C.2",
 U("Bien trier les déchets (DASRI ou DAOM)","Éviter le gaspillage de matériel : n'ouvrir que ce qui sert","Limiter les impressions inutiles","Préférer les gestes efficaces aux gestes systématiques (gants seulement quand ils sont indiqués)")+
 C("Le secteur de la santé représente une part importante des émissions de gaz à effet de serre en France.")),
/* Méthodes */
F("espacee","methode","Mémorisation","La répétition espacée","6.1|E.3",
 P("On retient mieux en revoyant une notion juste avant de l'oublier.")+
 K("1re révision","le lendemain","2e révision","3 jours après","3e révision","1 semaine après","4e révision","3 semaines après")+
 C("Se tester (cartes, fiche cachée) est plus efficace que relire. C'est le principe de la mémorisation active.")),
F("planning","methode","Organisation","Construire son planning de révisions","6.1|E.3",
 U("Lister les UE et les dates d'évaluation","Découper en petites séances de 25 à 45 minutes","Mélanger les matières plutôt que tout faire d'un bloc","Garder des créneaux pour les révisions espacées","Prévoir des pauses et du sommeil : la mémoire se consolide la nuit")),
F("fiche-efficace","methode","Méthode","Faire une fiche efficace","6.1|E.3",
 U("Une fiche = une notion","Des mots clés plutôt que des phrases","Une question au recto, la réponse au verso","Des couleurs avec un code constant","Un schéma vaut mieux qu'un paragraphe")),
F("analyse-situ","stage","Stage","L'analyse de situation","5.2 3.1|A.1 D.3",
 O("Décrire la situation de façon factuelle","Dire ce qui a posé question ou surpris","Analyser avec ses connaissances et ses cours","Identifier ce qu'on aurait pu faire autrement","Ce qu'on retient pour la suite")+
 C("On choisit une situation qui a fait réfléchir, pas forcément un soin compliqué.")),
F("portfolio","stage","Stage","Réussir son portfolio","5.1 5.2|A.1",
 U("Le remplir pendant le stage, pas la veille du bilan","Noter les actes réalisés et leur niveau de maîtrise","Faire signer par le tuteur à chaque étape","Garder une trace des situations rencontrées pour les analyses")),
/* Calculs */
F("formules","calcul","Formules","Formules de calcul à connaître","2.11 4.4|B.3",
 `<div class="presc">Débit (gouttes/min) = Volume (mL) × 20 ÷ Durée (min)<br>1 mL = 20 gouttes (perfuseur standard)<br>1 mL = 60 gouttes (perfuseur de précision)<br><br>Débit PSE (mL/h) = Dose/h prescrite ÷ Concentration<br><br>Volume à prélever = Dose prescrite ÷ Concentration<br><br>G5 % = 5 g pour 100 mL · NaCl 0,9 % = 9 g/L</div>`),
F("conversions","calcul","Unités","Conversions d'unités","2.11|B.3",
 K("1 g","1 000 mg","1 mg","1 000 µg","1 L","1 000 mL","1 h","60 min","1 %","1 g pour 100 mL")),
F("produit-croix","calcul","Méthode","Le produit en croix","2.11 4.4|B.3",
 P("Si 50 mg sont dans 10 mL, combien de mL pour 15 mg ?")+
 `<div class="presc">50 mg → 10 mL<br>15 mg → x mL<br><br>x = 15 × 10 ÷ 50 = 3 mL</div>`+
 C("Toujours vérifier si le résultat est cohérent : moins de produit que l'ampoule, donc moins de volume.")),
];

/* ---------- Situations cliniques (cas) ---------- */
const CAS=(id,titre,th,u,enonce,question,...rep)=>F(id,"situ",th,titre,u,P(enonce)+P(`<b>${question}</b>`)+R("Voir la proposition de correction",O(...rep)));
FICHES.push(
 CAS("cas-chute","Cas : Mme L., 84 ans, retrouvée au sol","Gériatrie","3.1 4.3 5.2|A.1 B.3",
  "Mme L. est retrouvée au sol dans sa chambre à 6 h. Elle est consciente mais confuse, ce qui est inhabituel. Elle est sous anticoagulant.","Quelles sont vos priorités ?",
  "Ne pas la relever tout de suite : évaluer la conscience, les constantes, la douleur, une déformation de membre","Glycémie capillaire : la confusion peut venir d'une hypoglycémie","Sous anticoagulant, tout choc à la tête impose d'alerter le médecin, même sans signe visible","Tracer la chute, l'heure, les constats et les mesures prises"),
 CAS("cas-postop","Cas : M. D., 58 ans, J1 d'une colectomie","Chirurgie","3.1 4.4 5.5|A.1 B.3",
  "Il est 14 h. M. D. a une PA à 92/55 alors qu'elle était à 130/80 le matin. Pouls à 112. Il est pâle et dit avoir soif. Son pansement est taché.","Que suspectez-vous et que faites-vous ?",
  "Suspicion d'hémorragie post-opératoire : tachycardie, hypotension, pâleur, soif","Alerter immédiatement le chirurgien ou l'interne","Allonger le patient, vérifier la voie veineuse, surveiller les constantes rapprochées","Évaluer le pansement et les drains, préparer un bilan sanguin selon prescription","Tracer les horaires et les valeurs"),
 CAS("cas-ic","Cas : Mme B., 76 ans, essoufflée la nuit","Cardiologie","2.7 3.1|A.1 B.1",
  "Mme B. est hospitalisée pour insuffisance cardiaque. Cette nuit, elle sonne : elle étouffe, est assise au bord du lit, sueurs, crépitants audibles. SpO₂ 86 %.","Quelle est l'urgence et que faites-vous ?",
  "Suspicion d'œdème aigu du poumon","Installer en position assise, jambes pendantes","Appeler le médecin, oxygène selon protocole ou prescription","Surveillance rapprochée : SpO₂, FR, PA, FC, conscience","Préparer le matériel : voie veineuse, diurétique prescrit, sonde urinaire si demandée"),
 CAS("cas-diab","Cas : M. K., 67 ans, diabétique, ne mange pas","Diabète","2.7 4.4|B.1 B.3",
  "M. K. a 10 unités d'insuline rapide prescrites avant le repas de midi. Sa glycémie est à 1,40 g/L. Il dit qu'il n'a pas faim et ne touchera pas son plateau.","Faites-vous l'injection ?",
  "Ne pas injecter l'insuline rapide prévue pour un repas qui ne sera pas pris : risque d'hypoglycémie","Prévenir le médecin pour adapter la prescription","Rechercher pourquoi il ne mange pas : nausées, douleur, tristesse, troubles de déglutition","Surveiller la glycémie et tracer"),
 CAS("cas-psy","Cas : Léa, 19 ans, « ça ne sert plus à rien »","Psychiatrie","2.6 4.2|B.1 D.1",
  "Pendant un soin, Léa, hospitalisée pour une fracture après une chute de scooter, vous dit : « De toute façon, ça ne sert plus à rien. »","Comment réagissez-vous ?",
  "Ne pas banaliser ni changer de sujet","Poser la question directement : « Est-ce que vous avez des idées de mort ? »","Écouter, reformuler, rester disponible","Transmettre immédiatement à l'infirmier référent et au médecin","Tracer les propos exacts dans le dossier"),
 CAS("cas-morphine","Cas : M. P., somnolent sous morphine","Douleur","2.11 4.4|B.1 B.3",
  "M. P. reçoit de la morphine par pompe PCA depuis son opération. À 22 h, il est difficile à réveiller, sa fréquence respiratoire est à 8 par minute.","Que faites-vous ?",
  "Suspicion de surdosage en morphine","Stimuler le patient, appeler le médecin immédiatement","Suspendre la pompe selon le protocole","Oxygène et naloxone selon prescription ou protocole","Surveillance rapprochée de la FR, de la sédation et de la SpO₂"),
 CAS("cas-domicile","Cas : à domicile, Mme R. a mal au mollet","Domicile","2.8 3.3|A.1 B.1",
  "Vous passez chez Mme R., 71 ans, opérée de la hanche il y a 10 jours. Son mollet droit est chaud, gonflé et douloureux. Elle a arrêté ses injections d'anticoagulant hier, en pensant qu'elle n'en avait plus besoin.","Que faites-vous ?",
  "Suspicion de phlébite : ne pas masser, garder la patiente au repos","Contacter le médecin traitant ou le chirurgien sans attendre","Surveiller l'apparition d'un essoufflement ou d'une douleur thoracique : dans ce cas, appeler le 15","Reprendre avec elle les raisons de son traitement et la durée prescrite","Tracer et transmettre")
);

/* ---------- Cours détaillés ---------- */
const CO=(id,cat,titre,duree,u,sections,pro)=>({id,cat,titre,duree,u,sections,pro});
const COURS=[];   /* rempli par js/contenus/cours.js (généré, voir scripts/premium.js) */

/* ---------- Quiz ---------- */
const Q=(cat,u,q,o,a,e)=>({cat,u,q,o,a,e});
const QUIZ=[
/* Examens et surveillance */
Q("exam","2.2|B.1","Quelle est la fréquence respiratoire normale d'un adulte au repos ?",["6 à 10 /min","12 à 20 /min","22 à 30 /min","30 à 40 /min"],1,"Chez l'adulte au repos, la fréquence respiratoire normale se situe entre 12 et 20 cycles par minute."),
Q("exam","2.2|B.1","Quelle est la fréquence cardiaque normale d'un adulte au repos ?",["40 à 60 bpm","60 à 100 bpm","100 à 140 bpm","140 à 180 bpm"],1,"Sous 60, on parle de bradycardie, au-dessus de 100 de tachycardie."),
Q("exam","4.3|B.3","Quel est le score de Glasgow le plus bas possible ?",["0","1","3","5"],2,"Chaque item vaut au minimum 1 point : Y1 + V1 + M1 = 3."),
Q("exam","4.3|B.3","Un score de Glasgow à 8 doit faire craindre avant tout :",["Une hypothermie","Une atteinte des voies aériennes","Une déshydratation","Une infection urinaire"],1,"À 8 ou moins, le patient risque de ne plus protéger ses voies aériennes. On alerte sans attendre."),
Q("exam","4.4|B.1","Quelle est la kaliémie normale ?",["1,5 à 2,5 mmol/L","3,5 à 5,0 mmol/L","135 à 145 mmol/L","8 à 10 mmol/L"],1,"Le potassium sanguin normal est entre 3,5 et 5,0 mmol/L. 135 à 145 mmol/L, c'est le sodium."),
Q("exam","4.4|B.1","Des plaquettes à 60 G/L, c'est :",["Normal","Une thrombopénie","Une hyperplaquettose","Une anémie"],1,"La normale est de 150 à 400 G/L. En dessous, on parle de thrombopénie, avec un risque de saignement."),
Q("exam","4.4 4.7|B.3","Quelle échelle utiliser chez une personne âgée qui ne communique pas, pour une douleur aiguë ?",["EVA","Algoplus","Échelle de Braden","Score de Glasgow"],1,"Algoplus est conçue pour la douleur aiguë chez la personne âgée non communicante."),
Q("exam","4.3|B.3","Lequel de ces signes est une détresse circulatoire ?",["Marbrures","Bâillements","Prurit","Hoquet"],0,"Marbrures, pouls rapide et filant, hypotension : signes de choc."),
Q("exam","4.4|B.3","Pour un ECBU, on recueille :",["Le premier jet","Le milieu de jet","Le dernier jet","Les urines du sac collecteur"],1,"Après toilette, on élimine le premier jet et on recueille le milieu de jet."),
/* Calculs */
Q("calcul","4.4|B.3","Avec un perfuseur standard, combien de gouttes font 1 mL ?",["10","15","20","60"],2,"1 mL = 20 gouttes. Un perfuseur de précision (microgouttes) donne 60 gouttes par mL."),
Q("calcul","2.11|B.3","Combien de grammes de glucose contient 1 litre de G5 % ?",["5 g","50 g","500 g","0,5 g"],1,"5 % = 5 g pour 100 mL, donc 50 g pour 1 000 mL."),
Q("calcul","2.11|B.3","Combien de grammes de sel contient 1 litre de NaCl 0,9 % ?",["0,9 g","9 g","90 g","0,09 g"],1,"0,9 % = 0,9 g pour 100 mL, donc 9 g par litre."),
Q("calcul","2.11|B.3","1 mg équivaut à :",["10 µg","100 µg","1 000 µg","0,1 g"],2,"1 mg = 1 000 µg. Une erreur d'unité est l'une des causes d'erreur médicamenteuse les plus graves."),
Q("calcul","4.4|B.3","1 000 mL sont prescrits sur 24 h à la pompe volumétrique. Quel débit programmer ?",["24 mL/h","41,7 mL/h","100 mL/h","240 mL/h"],1,"1 000 ÷ 24 ≈ 41,7 mL/h."),
Q("calcul","4.4|B.3","Une ampoule contient 40 mg dans 2 mL. Pour 30 mg, on prélève :",["0,75 mL","1 mL","1,5 mL","3 mL"],2,"Concentration 20 mg/mL. 30 ÷ 20 = 1,5 mL."),
/* Pathologies */
Q("patho","2.7|B.1","À partir de quelle glycémie parle-t-on d'hypoglycémie ?",["< 1,10 g/L","< 0,90 g/L","< 0,70 g/L","< 0,40 g/L"],2,"Le seuil retenu est 0,70 g/L, soit environ 3,9 mmol/L."),
Q("patho","2.7|B.1","Des œdèmes des jambes et des veines du cou gonflées évoquent plutôt :",["Une insuffisance cardiaque gauche","Une insuffisance cardiaque droite","Une hypoglycémie","Une infection urinaire"],1,"Le cœur droit n'arrive plus à faire circuler le sang qui revient du corps : il s'accumule en périphérie."),
Q("patho","2.7|B.1","Chez un patient insuffisant cardiaque, quelle surveillance quotidienne est essentielle ?",["La taille","Le poids","Le périmètre crânien","La glycémie à jeun"],1,"Une prise de poids rapide traduit une rétention d'eau et annonce une décompensation."),
Q("patho","2.8|B.1","Que signifie le « I » de VITE ?",["Infection","Inertie d'un membre","Insuffisance respiratoire","Ictère"],1,"Visage, Inertie d'un membre, Trouble de la parole, En urgence le 15."),
Q("patho","2.8|B.1","Un mollet chaud, gonflé et douloureux après une chirurgie fait penser à :",["Une crampe","Une phlébite","Une entorse","Un hématome sans gravité"],1,"Suspicion de thrombose veineuse profonde : repos, pas de massage, on alerte."),
Q("patho","2.8|B.1","Quels sont les signes d'une occlusion intestinale ?",["Diarrhée et fièvre","Douleur, vomissements, arrêt des matières et des gaz, ballonnement","Brûlures urinaires","Toux et crachats"],1,"Ce sont les quatre signes classiques de l'occlusion."),
Q("patho","2.5|B.1","Quels sont les signes de l'inflammation ?",["Pâleur, froid, raideur","Rougeur, chaleur, douleur, œdème","Fièvre et frissons uniquement","Démangeaisons"],1,"Ce sont les quatre signes cardinaux de l'inflammation."),
Q("patho","2.5|B.1","Dans le score qSOFA, quelle fréquence respiratoire compte un point ?",["≥ 16 /min","≥ 22 /min","≥ 30 /min","≤ 10 /min"],1,"FR ≥ 22, PAS ≤ 100 mmHg, conscience altérée : deux critères ou plus doivent alerter."),
Q("patho","2.4|B.1","Doigts froids et douleur croissante sous un plâtre font craindre :",["Un syndrome des loges","Une allergie au plâtre","Une entorse","Rien, c'est normal"],0,"Le syndrome des loges est une urgence chirurgicale."),
Q("patho","2.4|B.1","Selon la règle des 9, une jambe entière représente chez l'adulte :",["9 %","18 %","27 %","36 %"],1,"Chaque membre inférieur représente 18 % de la surface corporelle."),
Q("patho","2.6|B.1","Parler du suicide avec un patient :",["Augmente le risque","N'augmente pas le risque et permet d'évaluer","Est interdit pour un étudiant","Doit être évité"],1,"Poser la question directement permet d'évaluer et souvent soulage le patient."),
Q("patho","2.6|B.1","Les hallucinations dans la schizophrénie sont des signes :",["Négatifs","Positifs","De désorganisation","Thymiques"],1,"Délire et hallucinations sont des signes positifs."),
Q("patho","2.6|B.1","Le delirium tremens survient lors :",["D'une intoxication au paracétamol","D'un sevrage alcoolique","D'une hypoglycémie","D'une crise d'asthme"],1,"C'est la forme grave du sevrage alcoolique, une urgence vitale."),
Q("patho","2.9|B.1","Une fièvre pendant une aplasie après chimiothérapie est :",["Fréquente et sans gravité","Une urgence","Un effet du traitement à surveiller la semaine suivante","Normale"],1,"Sans globules blancs, une infection peut devenir grave très vite."),
Q("patho","2.7|B.1","Le tremblement de la maladie de Parkinson est typiquement :",["D'action","De repos","Nocturne uniquement","Absent"],1,"Tremblement de repos, rigidité et akinésie forment la triade parkinsonienne."),
/* Thérapeutiques */
Q("thera","2.11|B.1","Quel examen biologique surveille un traitement par AVK ?",["La glycémie","L'INR","La CRP","La kaliémie"],1,"L'INR mesure l'effet des AVK. La cible habituelle est entre 2 et 3, selon l'indication."),
Q("thera","2.11|B.1","Sous HBPM, quelle surveillance permet de dépister une thrombopénie induite ?",["Les plaquettes","Les leucocytes","L'hémoglobine","La créatinine"],0,"La numération des plaquettes dépiste la thrombopénie induite par l'héparine (TIH)."),
Q("thera","2.11|B.1","Le furosémide expose surtout à :",["Une hyperkaliémie","Une hypokaliémie","Une hyperglycémie","Une thrombopénie"],1,"Les diurétiques de l'anse font perdre du potassium."),
Q("thera","2.11|B.1","La morphine appartient au palier :",["1","2","3","Elle n'est pas classée"],2,"Palier 3 : opioïdes forts."),
Q("thera","2.11|B.1","Quel est l'antidote de la morphine ?",["La vitamine K","La naloxone","Le flumazénil","L'adrénaline"],1,"La naloxone antagonise les effets des opioïdes. Le flumazénil est l'antidote des benzodiazépines."),
Q("thera","2.11|B.1","Quel effet indésirable de la morphine faut-il prévenir systématiquement ?",["La diarrhée","La constipation","L'hypertension","L'hyperglycémie"],1,"La constipation est quasi constante : un laxatif est associé."),
Q("thera","2.11|B.1","Dans quel ordre se déroule le parcours d'un médicament ?",["Distribution, absorption, élimination, métabolisme","Absorption, distribution, métabolisme, élimination","Métabolisme, absorption, distribution, élimination","Élimination, métabolisme, distribution, absorption"],1,"ADME : absorption, distribution, métabolisme, élimination."),
Q("thera","2.11|B.1","Un comprimé « LP » :",["Peut toujours être écrasé","Ne doit pas être écrasé","Se prend uniquement le soir","Se dissout sous la langue"],1,"Écraser une forme à libération prolongée libère toute la dose d'un coup."),
Q("thera","2.11|B.1","Un traitement corticoïde prolongé s'arrête :",["Brutalement","Progressivement","Uniquement le matin","Quand le patient le souhaite"],1,"Un arrêt brutal expose à une insuffisance surrénalienne."),
Q("thera","2.11 4.5|B.4","Le chlorure de potassium injectable :",["Peut s'injecter en IV directe","Ne s'injecte jamais en IV directe","Se donne en IM","Se donne en SC"],1,"En IV directe, il peut provoquer un arrêt cardiaque. Il se dilue et se perfuse lentement."),
Q("thera","2.11|B.1","Avant une première dose d'antibiotique, on vérifie d'abord :",["Le poids","Les allergies","La taille","Le groupe sanguin"],1,"Le risque d'allergie grave impose de vérifier les antécédents allergiques."),
/* Soins et techniques */
Q("soins","2.10|B.4","Combien de temps dure une friction hydroalcoolique ?",["5 secondes","20 à 30 secondes","2 minutes","5 minutes"],1,"La friction dure 20 à 30 secondes, jusqu'à ce que les mains soient sèches."),
Q("soins","2.10|B.4","Quel masque pour un patient atteint de tuberculose ?",["Masque chirurgical","Masque FFP2","Aucun masque","Masque en tissu"],1,"La tuberculose se transmet par voie aérienne : masque FFP2 pour le soignant."),
Q("soins","2.10|B.4","Pour <i>Clostridioides difficile</i>, l'hygiène des mains comprend :",["Gel hydroalcoolique seul","Lavage au savon puis friction","Gants seuls","Rien de particulier"],1,"Les spores résistent au gel : le lavage mécanique au savon est indispensable."),
Q("soins","4.1|B.3","Une rougeur qui ne blanchit pas à la pression, sur une peau intacte, correspond à :",["Une escarre de stade 1","Une escarre de stade 2","Une escarre de stade 3","Une simple irritation sans risque"],0,"C'est le stade 1. Il faut mettre en place la prévention immédiatement."),
Q("soins","4.4|B.3","Dans l'ordre des tubes, lequel se prélève en premier ?",["EDTA (violet)","Hémocultures","Tube sec","Fluorure (gris)"],1,"Les hémocultures passent en premier pour éviter toute contamination."),
Q("soins","4.4|B.3","Où se place l'électrode V1 ?",["5e espace intercostal gauche","4e espace intercostal, à droite du sternum","Sous la clavicule gauche","Sur la ligne axillaire moyenne"],1,"V1 : 4e espace intercostal, bord droit du sternum."),
Q("soins","4.4|B.3","Le sac collecteur d'une sonde urinaire doit être :",["Au-dessus de la vessie","En dessous de la vessie, sans toucher le sol","Posé au sol","Déconnecté pour la toilette"],1,"Cela évite le reflux d'urine vers la vessie et la contamination."),
Q("soins","4.3|B.3","Quelle est la fréquence des compressions lors d'un massage cardiaque chez l'adulte ?",["60 à 80 /min","80 à 100 /min","100 à 120 /min","140 à 160 /min"],2,"100 à 120 compressions par minute, sur 5 à 6 cm de profondeur."),
Q("soins","4.3|B.3","Dans un choc anaphylactique, l'adrénaline s'administre d'abord :",["En IM dans la cuisse","Par voie orale","En crème","En inhalation"],0,"La voie intramusculaire dans la face externe de la cuisse est la voie de première intention."),
Q("soins","4.1|B.3","En cas de troubles de la déglutition, la position recommandée pour manger est :",["Allongée à plat","Assise, tête légèrement penchée en avant","Assise, tête en arrière","Sur le côté"],1,"La flexion de la tête protège les voies aériennes."),
Q("soins","2.10 4.5|B.4","Après une piqûre avec une aiguille souillée, il ne faut pas :",["Nettoyer à l'eau et au savon","Faire saigner","Désinfecter","Contacter le médecin référent"],1,"Faire saigner risque de favoriser la pénétration du virus. On nettoie, on désinfecte, on consulte vite."),
Q("soins","4.7|B.3","Les soins palliatifs :",["Sont réservés aux dernières heures de vie","Peuvent commencer tôt dans une maladie grave","Visent à accélérer le décès","Excluent les traitements de la douleur"],1,"Ils peuvent débuter dès l'annonce d'une maladie grave, en parallèle d'autres traitements."),
/* Vocabulaire */
Q("voca","2.1|B.1","Que signifie « bradycardie » ?",["Cœur trop rapide","Cœur trop lent","Douleur cardiaque","Inflammation du cœur"],1,"Brady- = lent. Une bradycardie est une fréquence cardiaque sous 60 bpm chez l'adulte."),
Q("voca","2.1|B.1","Le suffixe « -ectomie » signifie :",["Inflammation","Douleur","Ablation","Ouverture"],2,"-ectomie = ablation chirurgicale. Exemple : appendicectomie."),
Q("voca","2.1|B.1","« Hématurie » signifie :",["Sang dans les urines","Sang dans les selles","Vomissement de sang","Manque de sang"],0,"Hémat- = sang, -urie = dans les urines."),
Q("voca","2.1|B.1","« Dyspnée » signifie :",["Absence de respiration","Difficulté à respirer","Respiration rapide","Toux"],1,"Dys- = difficulté, -pnée = respiration."),
Q("voca","2.1|B.1","Le préfixe « néphr- » désigne :",["Le nerf","Le rein","Le foie","Le poumon"],1,"Néphr- = rein. Exemple : néphrologie."),
Q("voca","6.2|E.2","« Shortness of breath » signifie :",["Douleur thoracique","Essoufflement","Toux","Fièvre"],1,"Shortness of breath = essoufflement, dyspnée."),
/* Anatomie */
Q("anat","2.2|B.1","Quel vaisseau part du ventricule gauche ?",["L'artère pulmonaire","L'aorte","La veine cave","Les veines pulmonaires"],1,"Le ventricule gauche éjecte le sang oxygéné dans l'aorte, vers tout le corps."),
Q("anat","2.2|B.1","Où se font les échanges gazeux ?",["Dans la trachée","Dans les bronches","Dans les alvéoles","Dans le larynx"],2,"Les alvéoles sont au contact des capillaires sanguins."),
Q("anat","2.2|B.1","Quelle est l'unité fonctionnelle du rein ?",["L'alvéole","Le néphron","Le neurone","L'hépatocyte"],1,"Le néphron filtre le sang et forme l'urine."),
Q("anat","2.2|B.1","Une diurèse inférieure à 500 mL par 24 h s'appelle :",["Une polyurie","Une oligurie","Une anurie","Une dysurie"],1,"Oligurie sous 500 mL/24 h, anurie sous 100 mL/24 h."),
Q("anat","2.2|B.1","Où se fait l'essentiel de l'absorption des nutriments ?",["Estomac","Intestin grêle","Côlon","Œsophage"],1,"L'intestin grêle absorbe les nutriments, le côlon surtout l'eau."),
Q("anat","2.2|B.1","Le système parasympathique :",["Accélère le cœur","Ralentit le cœur","Dilate les pupilles","Augmente la tension"],1,"Il correspond au repos et à la digestion."),
Q("anat","2.1|B.1","Quel organite produit l'énergie de la cellule ?",["Le noyau","La mitochondrie","Le ribosome","La membrane"],1,"La mitochondrie produit l'énergie sous forme d'ATP."),
Q("anat","2.2|B.1","Le donneur universel de globules rouges est :",["AB positif","O négatif","A positif","B négatif"],1,"Les globules rouges O négatif n'ont ni antigène A, ni B, ni Rhésus."),
/* Rôle, législation */
Q("role","1.3|A.2","Le secret professionnel s'applique-t-il après le décès du patient ?",["Non, il prend fin au décès","Oui, il continue","Seulement pour la famille","Seulement si le patient l'a demandé"],1,"Le secret professionnel ne s'arrête pas au décès du patient."),
Q("role","3.3|D.1","Dans une transmission ciblée DAR, le « A » correspond à :",["Analyse","Actions","Antécédents","Alerte"],1,"Données, Actions, Résultats."),
Q("role","1.3|A.2","La personne de confiance est désignée :",["Oralement par la famille","Par écrit par le patient","Par le médecin","Automatiquement : c'est le conjoint"],1,"Elle est désignée par écrit et le patient peut la changer à tout moment."),
Q("role","1.3|A.2","Quelle loi a posé le principe du consentement libre et éclairé du patient ?",["Loi du 4 mars 2002","Loi de 1946","Loi du 11 février 2005","Loi de 2016"],0,"La loi Kouchner du 4 mars 2002 relative aux droits des malades."),
Q("role","1.3|A.2","Une sanction prononcée par l'Ordre relève de la responsabilité :",["Civile","Pénale","Disciplinaire","Administrative uniquement"],2,"La responsabilité disciplinaire concerne le respect des règles professionnelles."),
Q("role","1.3 4.7|A.2","Les directives anticipées :",["N'ont aucune valeur","S'imposent au médecin sauf exceptions prévues par la loi","Sont rédigées par la famille","Expirent au bout d'un an"],1,"Depuis 2016, elles s'imposent sauf urgence vitale ou si elles sont manifestement inappropriées."),
Q("role","1.1|B.2","Quel est le premier niveau de la pyramide de Maslow ?",["Estime","Sécurité","Besoins physiologiques","Accomplissement"],2,"La base regroupe les besoins vitaux : respirer, manger, boire, dormir."),
Q("role","1.1|B.2","Un patient qui nie sa maladie utilise un mécanisme de :",["Sublimation","Déni","Projection","Rationalisation"],1,"Le déni protège temporairement d'une réalité trop difficile."),
Q("role","4.2|D.1","La congruence, selon Rogers, c'est :",["Être d'accord avec le patient","Être authentique et cohérent","Donner des conseils","Garder le silence"],1,"Le soignant est en accord entre ce qu'il ressent et ce qu'il montre."),
Q("role","1.2 4.6|C.1","Un dépistage du cancer du sein est une prévention :",["Primaire","Secondaire","Tertiaire","Quaternaire"],1,"Dépister tôt une maladie déjà présente, c'est la prévention secondaire."),
Q("role","4.5|B.4","Pour vérifier l'identité d'un patient, on lui demande :",["« Vous êtes bien M. Martin ? »","« Pouvez-vous me dire votre nom et votre date de naissance ? »","Son numéro de chambre","Rien, le bracelet suffit"],1,"Une question ouverte évite qu'un patient confus réponde « oui » par erreur."),
Q("role","4.6|C.1","Quelle est la première étape de l'éducation thérapeutique ?",["L'évaluation finale","Le diagnostic éducatif","La séance collective","La remise d'une brochure"],1,"On part des besoins, des connaissances et du projet du patient."),
Q("role","4.8|B.4","La certification HAS des établissements a lieu tous les :",["2 ans","4 ans","10 ans","Chaque année"],1,"La certification est renouvelée tous les quatre ans."),
Q("role","3.4|E.1","Dans une question PICO, le « P » désigne :",["Le protocole","Le patient ou la population","La prévention","Le pronostic"],1,"Patient, Intervention, Comparaison, Outcome."),
/* Situations, méthodes, stage */
Q("situ","3.1|A.1","Combien de besoins fondamentaux décrit Virginia Henderson ?",["5","10","14","20"],2,"Quatorze besoins, de « respirer » à « apprendre »."),
Q("situ","3.1|A.1","Un objectif de soins doit être :",["Vague pour s'adapter","Centré sur le patient, mesurable et daté","Fixé par la famille","Identique pour tous les patients"],1,"Exemple : « Le patient marche 20 mètres avec son déambulateur d'ici vendredi »."),
Q("situ","2.7 4.4|B.3","Un patient diabétique refuse son repas, une insuline rapide est prévue. Vous :",["Injectez quand même","N'injectez pas et prévenez le médecin","Doublez la dose du soir","Donnez du sucre"],1,"Sans repas, l'insuline rapide expose à une hypoglycémie."),
Q("situ","2.11|B.3","Patient sous morphine, FR à 8 /min et difficile à réveiller. Priorité :",["Attendre le prochain tour","Stimuler, alerter le médecin, appliquer le protocole","Donner un café","Augmenter la morphine"],1,"Suspicion de surdosage : c'est une urgence."),
Q("methode","6.1|E.3","Quelle méthode de révision est la plus efficace ?",["Relire plusieurs fois","Surligner tout le cours","Se tester régulièrement","Recopier le cours"],2,"Se tester (mémorisation active) ancre mieux que la relecture."),
Q("methode","6.1|E.3","Avec la répétition espacée, on revoit une notion :",["Une seule fois, la veille de l'examen","À intervalles de plus en plus longs","Tous les jours pendant un mois","Seulement si on l'a oubliée"],1,"J+1, J+3, J+7, J+21 : les intervalles s'allongent."),
Q("stage","5.1|A.1","Quand remplir son portfolio ?",["La veille du bilan","Au fil du stage","Après le stage","Jamais, c'est le tuteur qui s'en charge"],1,"Le remplir au fur et à mesure évite les oublis et prépare les bilans."),
Q("stage","5.2|A.1","Une analyse de situation commence par :",["Un jugement sur l'équipe","Une description factuelle","Les conclusions","Les références bibliographiques"],1,"On décrit d'abord, on analyse ensuite.")
];

/* ---------- Stages ---------- */
const STAGES=[
 {nom:"Gériatrie / EHPAD",soins:["Distribution des médicaments","Prévention des chutes et escarres","Aide aux repas, surveillance de l'hydratation","Pansements"],reviser:["Dénutrition et déshydratation","Maladie d'Alzheimer","Anticoagulants","Échelles Algoplus et Doloplus"],pieges:["Les comprimés écrasés : tous ne s'écrasent pas","Une confusion brutale n'est pas « l'âge » : chercher une cause"]},
 {nom:"Médecine interne / pneumologie",soins:["Oxygénothérapie","Aérosols","Bilans sanguins et gaz du sang","Surveillance respiratoire"],reviser:["BPCO","Pneumopathie","Insuffisance cardiaque","Sepsis"],pieges:["Augmenter l'oxygène sans prescription chez un patient BPCO","Ne pas compter la fréquence respiratoire sur une minute entière"]},
 {nom:"Chirurgie",soins:["Préparation préopératoire","Surveillance post-op (douleur, pansement, drains)","Bilan entrées/sorties","Ablation de fils et agrafes"],reviser:["Check-list préopératoire","Échelles de douleur","Signes d'hémorragie et d'infection","Phlébite et embolie pulmonaire"],pieges:["Oublier de vérifier le jeûne","Ne pas tracer la diurèse post-op"]},
 {nom:"Cardiologie",soins:["ECG","Surveillance scope","Bilans sanguins","Gestion des pousse-seringues"],reviser:["Lecture d'ECG de base","Anticoagulants et INR","Insuffisance cardiaque","Douleur thoracique"],pieges:["Ne pas peser le patient tous les jours","Oublier les signes d'hémorragie sous anticoagulant"]},
 {nom:"Oncologie",soins:["Chambre implantable","Administration de chimiothérapie","Soins de bouche","Prévention des nausées"],reviser:["Effets secondaires de la chimiothérapie","Aplasie","Douleur et morphine","Dispositif d'annonce"],pieges:["Banaliser une fièvre en aplasie","Manipuler les cytotoxiques sans protection"]},
 {nom:"Soins palliatifs",soins:["Évaluation et traitement des symptômes","Soins de confort et de bouche","Accompagnement des proches","Pompes et pousse-seringues"],reviser:["Loi Claeys-Leonetti","Échelles de douleur","Les étapes du deuil","Morphine"],pieges:["Vouloir combler les silences à tout prix","Oublier de prendre soin de soi après des situations lourdes"]},
 {nom:"Pédiatrie",soins:["Constantes adaptées à l'âge","Calculs de doses au poids","Accompagnement des parents"],reviser:["Normes selon l'âge","Calculs en mg/kg","Déshydratation de l'enfant","Douleur de l'enfant"],pieges:["Utiliser les normes adultes","Ne pas vérifier le poids du jour"]},
 {nom:"Maternité",soins:["Surveillance du post-partum","Aide à l'allaitement","Soins au nouveau-né","Surveillance des saignements"],reviser:["Hémorragie du post-partum","Allaitement","Soins du cordon","Baby-blues et dépression post-natale"],pieges:["Sous-estimer un saignement","Oublier le vécu de la mère derrière les soins techniques"]},
 {nom:"Urgences",soins:["Accueil et tri","Pose de voies veineuses","ECG, bilans, glycémies","Surveillance rapprochée"],reviser:["Score de Glasgow","Signes de détresse vitale","Arrêt cardiaque","AVC et douleur thoracique"],pieges:["Se taire quand on doute : toujours alerter","Oublier de tracer les horaires"]},
 {nom:"Psychiatrie",soins:["Entretiens","Distribution et observance des traitements","Activités thérapeutiques"],reviser:["Dépression et risque suicidaire","Schizophrénie","Neuroleptiques","Addictions"],pieges:["Vouloir convaincre plutôt qu'écouter","Négliger la surveillance somatique"]},
 {nom:"Soins à domicile / libéral",soins:["Pansements, injections, prises de sang","Préparation des piluliers","Surveillance des patients chroniques","Coordination avec médecin traitant et pharmacie"],reviser:["Diabète et insuline","Plaies chroniques","Anticoagulants","Cotations de base"],pieges:["Oublier de vérifier l'ordonnance en cours","Ne pas repérer l'isolement ou la maltraitance"]},
 {nom:"Bloc opératoire",soins:["Accueil et vérification au bloc","Installation du patient","Comptage des compresses et instruments","Surveillance en salle de réveil"],reviser:["Check-list sécurité du patient","Asepsie chirurgicale","Surveillance post-anesthésie"],pieges:["Toucher une zone stérile","Ne pas oser signaler une faute d'asepsie"]}
];
const CHECKLIST=["Appeler le service quelques jours avant","Connaître les horaires et la tenue demandée","Préparer ses objectifs de stage","Réviser les 3 pathologies les plus fréquentes du service","Avoir un carnet de poche et un stylo 4 couleurs","Prévoir une montre à trotteuse","Relire son portfolio"];
const POSTURE=["Se présenter à chaque patient : prénom, statut d'étudiant, année","Poser ses questions au bon moment, pas devant le patient","Noter ce qu'on ne connaît pas et le chercher le soir","Ne jamais faire un soin qu'on ne maîtrise pas sans encadrement","Demander un bilan de mi-stage si on ne vous le propose pas"];
const OBJECTIFS=["S1 : soins d'hygiène et de confort, constantes, observation","S2 : premiers soins techniques encadrés, recueil de données","S3 : prise en charge de 2 à 3 patients, raisonnement clinique","S4 : soins techniques plus complexes, éducation du patient","S5 : prise en charge d'un secteur, coordination","S6 : autonomie sur un secteur complet, posture de future professionnelle"];


/* ---------- Fiches détaillées ---------- */
const X=(id,cat,theme,titre,u,icon,pages)=>({id,cat,theme,titre,u,icon,pages});
const FX=[
X("fc","exam","Constantes","La fréquence cardiaque","2.2 4.4|B.1 B.3","heart",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"La fréquence cardiaque correspond au **nombre de battements du cœur par minute**, exprimé en ==bpm==. On la mesure en prenant le pouls, qui est l'onde de choc du sang dans une artère à chaque contraction du cœur.",wave:true},
  {t:"valeurs",n:"02",h:"Valeurs de référence",chip:"Valeurs repères",sub:"Chez l'adulte, au repos",rows:[["Bradycardie","Fréquence trop lente","< 60 bpm","blue"],["Normale","Adulte au repos","60–100 bpm","green"],["Tachycardie","Fréquence trop rapide","> 100 bpm","coral"]],note:"À interpréter selon l'âge, l'activité physique, les traitements et l'état clinique."}],
 [{t:"table",n:"03",h:"Repères selon l'âge",chip:"Enfant et sportif",rows:[["Nouveau-né","120–160 bpm"],["Nourrisson","100–160 bpm"],["Enfant de 2 à 6 ans","80–120 bpm"],["Enfant de 6 à 12 ans","70–110 bpm"],["Adolescent et adulte","60–100 bpm"]],note:"Repères indicatifs, qui varient selon les sources. Un sportif entraîné peut avoir un pouls normal autour de 50 bpm."},
  {t:"cols",n:"04",h:"Ce qui la fait varier",chip:"Variations",cols:[{h:"Physiologique",tone:"green",items:["Effort, émotion, stress","Digestion","Sommeil : elle baisse","Fièvre : elle augmente d'environ 10 bpm par degré"]},{h:"Pathologique",tone:"coral",items:["Tachycardie : douleur, hémorragie, déshydratation, infection, anémie, anxiété","Bradycardie : bêtabloquants, trouble de la conduction, hypothermie, hypertension intracrânienne"]}]}],
 [{t:"etapes",n:"05",h:"Mesurer le pouls",chip:"Mesurer le pouls",items:["**Patient au repos** depuis quelques minutes, installé confortablement.","**Deux ou trois doigts** (index, majeur) posés sur l'artère, **jamais le pouce** : il a son propre pouls.","**Pouls radial** au poignet en routine, **carotidien** en urgence, pédieux pour vérifier la circulation d'un membre.","**Compter sur une minute entière**, surtout si le pouls est irrégulier.","Apprécier aussi le **rythme** et l'**amplitude**."]},
  {t:"duo",items:[{tag:"Rythme",tone:"blue",txt:"**Régulier** ou **irrégulier**",sub:"Un pouls irrégulier peut traduire une arythmie"},{tag:"Amplitude",tone:"coral",txt:"**Bien frappé** ou **filant**",sub:"Un pouls filant et rapide évoque un choc"}]},
  {t:"info",ico:"redo",txt:"**Valeur inhabituelle ?** Vérifier le pouls à la main si l'appareil affiche une valeur surprenante, puis comparer avec les mesures précédentes."}],
 [{t:"signes",n:"06",h:"Signes cliniques",chip:"Signes cliniques",items:["Palpitations","Vertiges, malaise","**Douleur thoracique**","Essoufflement","Pâleur, sueurs","Altération de l'état général"]},
  {t:"trace",n:"07",h:"Traçabilité : toujours noter",chip:"Traçabilité",items:["Fréquence en bpm","Heure","Site de mesure","Régularité du pouls","Signes associés","Contexte (effort, fièvre, douleur)"]},
  {t:"retenir",txt:"Une fréquence anormale s'interprète **avec l'état clinique du patient**. Douleur thoracique, malaise important ou détresse respiratoire : **alerter immédiatement** selon le protocole du service."}]
]),
X("ta","exam","Constantes","La tension artérielle","2.2 4.4|B.1 B.3","gauge",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"La tension artérielle correspond à la **pression exercée par le sang sur la paroi des artères**. Elle s'exprime en ==mmHg==."},
  {t:"duo",items:[{tag:"Systolique",tone:"coral",txt:"Pression lors de la **contraction** du cœur",sub:"Le premier chiffre"},{tag:"Diastolique",tone:"blue",txt:"Pression lorsque le cœur se **relâche**",sub:"Le second chiffre"}]},
  {t:"big",n:"02",h:"Repère chez l'adulte",chip:"Repères",a:"120",b:"80",la:"SYSTOLIQUE",lb:"DIASTOLIQUE",unit:"mmHg",note:"Repère usuel autour de 120/80 mmHg. L'interprétation dépend du contexte et des recommandations applicables."}],
 [{t:"valeurs",n:"03",h:"Seuils à connaître",chip:"Seuils",rows:[["Hypotension","Systolique basse","PAS < 90","blue"],["Repère normal","Adulte au repos","≈ 120/80","green"],["Hypertension","Mesure au cabinet ou à l'hôpital","≥ 140/90","coral"],["En automesure","Mesures à domicile","≥ 135/85","amber"]],note:"Le diagnostic d'hypertension repose sur plusieurs mesures, jamais sur une valeur isolée."},
  {t:"text",n:"04",h:"Deux notions utiles",chip:"PAM et orthostatisme",ps:["**Pression artérielle moyenne (PAM)** = (PAS + 2 × PAD) ÷ 3. Elle reflète la perfusion des organes ; en réanimation, on vise souvent plus de 65 mmHg.","**Hypotension orthostatique** : baisse d'au moins 20 mmHg de la systolique ou 10 mmHg de la diastolique dans les 3 minutes après le passage à la station debout. Fréquente chez la personne âgée, elle favorise les chutes."]}],
 [{t:"etapes",n:"05",h:"Comment la mesurer ?",chip:"Mesurer la TA",items:["**Patient au repos** 5 minutes, assis ou allongé selon le contexte, sans parler.","**Brassard adapté** à la taille du bras : trop petit, il surestime la tension.","**Bras soutenu**, à hauteur du cœur, dénudé.","**Jambes non croisées**, dos appuyé.","**Respecter les consignes** du tensiomètre et du protocole."]},
  {t:"info",txt:"**Bras interdits** : côté d'une fistule de dialyse, d'un curage ganglionnaire, d'une perfusion en cours ou d'une paralysie."},
  {t:"info",ico:"redo",txt:"**Valeur inhabituelle ?** Vérifier les conditions de mesure, puis **répéter** selon le protocole, éventuellement à l'autre bras."}],
 [{t:"cols",n:"06",h:"Signes cliniques",chip:"Signes cliniques",cols:[{h:"Tension trop haute",tone:"coral",items:["Céphalées inhabituelles","Bourdonnements d'oreille, mouches devant les yeux","Saignement de nez","**Douleur thoracique**, trouble neurologique"]},{h:"Tension trop basse",tone:"blue",items:["Vertiges, malaise, faiblesse","Pâleur, sueurs","Confusion","Marbrures, extrémités froides"]}]},
  {t:"trace",n:"07",h:"Traçabilité : toujours noter",chip:"Traçabilité",items:["Systolique / diastolique","Heure","Position du patient","Bras utilisé si besoin","Signes associés","Type d'appareil si utile"],note:"Valeurs en mmHg."},
  {t:"retenir",txt:"Une **valeur isolée** ne suffit pas à poser un diagnostic. Douleur thoracique, déficit neurologique soudain, détresse respiratoire ou malaise grave : **alerte immédiate**."}]
]),
X("fr","exam","Constantes","La fréquence respiratoire","2.2 4.4|B.1 B.3","lungs",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"La fréquence respiratoire correspond au **nombre de cycles respiratoires par minute** (une inspiration + une expiration). C'est la constante la plus souvent oubliée, et pourtant l'une des premières à se modifier quand un patient s'aggrave."},
  {t:"valeurs",n:"02",h:"Valeurs de référence",chip:"Valeurs repères",sub:"Chez l'adulte, au repos",rows:[["Bradypnée","Respiration trop lente","< 12 /min","blue"],["Normale","Adulte au repos","12–20 /min","green"],["Tachypnée","Respiration trop rapide","> 20 /min","coral"],["Détresse","Signe de gravité","> 30 /min","coral"]],note:"Chez l'enfant, la fréquence normale est plus élevée : environ 30 à 60 par minute chez le nouveau-né."}],
 [{t:"etapes",n:"03",h:"Comment la mesurer ?",chip:"Mesurer",items:["**Ne pas prévenir le patient** : savoir qu'on le regarde modifie sa respiration. On peut compter en gardant les doigts sur le pouls.","**Observer le thorax ou l'abdomen** qui se soulève.","**Compter sur une minute entière**.","Observer en même temps l'**amplitude**, le **rythme** et les **bruits**."]},
  {t:"liste",n:"04",h:"Ce qu'on observe en plus",chip:"Observation",items:["**Amplitude** : superficielle ou profonde","**Rythme** : régulier, irrégulier, pauses","**Bruits** : sifflements, encombrement, stridor (bruit aigu à l'inspiration)","**Tirage** : creusement entre les côtes ou au-dessus du sternum","**Coloration** : cyanose des lèvres et des ongles","**Capacité à parler** : phrases entières ou mots isolés"]}],
 [{t:"table",n:"05",h:"Le vocabulaire à connaître",chip:"Vocabulaire",rows:[["Dyspnée","difficulté à respirer"],["Orthopnée","dyspnée en position allongée"],["Apnée","arrêt de la respiration"],["Polypnée","respiration rapide et superficielle"],["Cheyne-Stokes","cycles d'amplitude croissante puis décroissante, avec pauses"],["Kussmaul","respiration ample et profonde (acidocétose)"]]},
  {t:"signes",n:"06",h:"Signes de détresse",chip:"Signes de gravité",e:"Alerte",items:["FR > 30 ou < 8 /min","**Tirage**, battement des ailes du nez","Cyanose","Impossible de finir une phrase","Sueurs, agitation","Somnolence, confusion"]}],
 [{t:"trace",n:"07",h:"Traçabilité : toujours noter",chip:"Traçabilité",items:["Fréquence par minute","Heure","Amplitude et rythme","Signes associés","Oxygène en cours (débit)","Position du patient"]},
  {t:"retenir",txt:"Une **tachypnée isolée** est souvent le premier signe d'une aggravation (infection, embolie, insuffisance cardiaque). Une somnolence chez un patient essoufflé peut traduire un épuisement : **alerter sans attendre**."}]
]),
X("spo2","exam","Constantes","La saturation en oxygène","2.2 4.4|B.1 B.3","finger",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"La saturation pulsée en oxygène (==SpO₂==) correspond au **pourcentage d'hémoglobine chargée en oxygène** dans le sang artériel. Elle se mesure avec un oxymètre de pouls, sans piqûre."},
  {t:"valeurs",n:"02",h:"Valeurs de référence",chip:"Valeurs repères",sub:"Chez l'adulte sans pathologie respiratoire",rows:[["Normale","Adulte sain","95–100 %","green"],["À surveiller","Selon le contexte","90–94 %","amber"],["Hypoxémie","Alerter","< 90 %","coral"]],note:"Chez un patient BPCO, la cible est souvent plus basse (par exemple 88 à 92 %) : elle est fixée par le médecin."}],
 [{t:"etapes",n:"03",h:"Comment la mesurer ?",chip:"Mesurer",items:["Choisir un **doigt propre et chaud**, sans vernis ni faux ongle.","Placer le capteur et **attendre une courbe de pouls régulière**.","Lire la valeur **après stabilisation**, en vérifiant que le pouls affiché correspond au pouls réel.","Noter si le patient est **en air ambiant ou sous oxygène**."]},
  {t:"liste",n:"04",h:"Ce qui fausse la mesure",chip:"Pièges",items:["Mains froides, mauvaise circulation","Vernis, faux ongles","Mouvements, frissons","Lumière forte sur le capteur","**Intoxication au monoxyde de carbone** : la saturation peut paraître normale alors que le patient est en danger"]}],
 [{t:"signes",n:"05",h:"Signes d'hypoxie",chip:"Signes cliniques",items:["Cyanose des lèvres et des ongles","Tachycardie","Tachypnée, tirage","Agitation, confusion","Sueurs","Somnolence"]},
  {t:"trace",n:"06",h:"Traçabilité : toujours noter",chip:"Traçabilité",items:["Valeur en %","Heure","Air ambiant ou oxygène","Débit et dispositif d'O₂","Signes associés","FR au même moment"]},
  {t:"retenir",txt:"La saturation se lit **avec la clinique** et la fréquence respiratoire. On ne modifie jamais le débit d'oxygène sans prescription ou protocole, en particulier chez le patient BPCO."}]
]),
X("temp","exam","Constantes","La température","2.2 4.4|B.1 B.3","thermo",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"La température corporelle reflète l'équilibre entre la **production et la perte de chaleur** du corps. Elle s'exprime en ==°C== et varie légèrement au cours de la journée, plus basse le matin que le soir."},
  {t:"valeurs",n:"02",h:"Valeurs de référence",chip:"Valeurs repères",rows:[["Hypothermie","Corps trop froid","< 35 °C","blue"],["Normale","Adulte","36,5–37,5 °C","green"],["Fébricule","Légère élévation","37,5–38 °C","amber"],["Fièvre","Réponse à une infection, le plus souvent","> 38 °C","coral"]],note:"Une fièvre au-delà de 40 °C ou mal tolérée doit faire alerter."}],
 [{t:"table",n:"03",h:"Les sites de mesure",chip:"Sites",rows:[["Tympanique","rapide, technique à soigner"],["Axillaire","simple, un peu moins précise"],["Buccale","sous la langue, bouche fermée"],["Rectale","référence, mais invasive"],["Temporale (front)","rapide, très sensible à l'environnement"]],note:"Pour suivre une évolution, on garde **le même site et le même appareil**."},
  {t:"etapes",n:"04",h:"Comment la mesurer ?",chip:"Mesurer",light:true,items:["Attendre à distance d'une boisson chaude, d'un repas ou de la toilette.","Nettoyer ou protéger le thermomètre (embout à usage unique).","Respecter la technique propre au site choisi.","Noter immédiatement la valeur et le site."]}],
 [{t:"liste",n:"05",h:"En cas de fièvre",chip:"Conduite à tenir",items:["Rechercher les **signes associés** : frissons, sueurs, tachycardie, confusion","**Hydrater** le patient, le découvrir légèrement","Antipyrétique selon prescription","**Hémocultures** si prescrites, idéalement au moment des frissons ou du pic","Prévenir le médecin selon le protocole"]},
  {t:"info",txt:"**Personne âgée** : une infection peut se présenter sans fièvre, avec seulement une confusion ou une chute. Une **hypothermie** peut aussi être un signe de sepsis grave."},
  {t:"trace",n:"06",h:"Traçabilité : toujours noter",chip:"Traçabilité",items:["Valeur en °C","Heure","Site de mesure","Signes associés","Actions réalisées","Réévaluation"]},
  {t:"retenir",txt:"Fièvre + **frissons, chute de tension, confusion ou respiration rapide** : penser au sepsis et **alerter immédiatement**."}]
]),
X("glyc","exam","Biologie","La glycémie capillaire","2.7 4.4|B.1 B.3","drop",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"La glycémie correspond au **taux de sucre (glucose) dans le sang**. La glycémie capillaire se mesure au bout du doigt avec un lecteur, en quelques secondes. Unités : ==g/L== ou ==mmol/L==."},
  {t:"valeurs",n:"02",h:"Valeurs de référence",chip:"Valeurs repères",rows:[["Hypoglycémie","Urgence à traiter","< 0,70 g/L","coral"],["Normale à jeun","Sans diabète","0,70–1,10 g/L","green"],["Après un repas","2 h après, sans diabète","< 1,40 g/L","green"],["Hyperglycémie","Seuil d'alerte selon protocole","> 1,80 g/L","amber"]],note:"Conversion : g/L × 5,5 ≈ mmol/L. Les objectifs d'un patient diabétique sont fixés par son médecin."}],
 [{t:"etapes",n:"03",h:"Comment la mesurer ?",chip:"Mesurer",items:["Faire **laver les mains** du patient à l'eau et au savon, puis bien sécher.","Vérifier la **péremption des bandelettes** et le calibrage du lecteur.","Piquer **sur le côté du doigt**, en changeant de doigt à chaque fois.","Déposer la goutte sur la bandelette et lire le résultat.","Éliminer l'autopiqueur dans le collecteur."]},
  {t:"info",txt:"**Résultat faussé** : sucre sur les doigts (fruit, jus), alcool mal séché, goutte trop petite, doigt trop pressé."}],
 [{t:"cols",n:"04",h:"Reconnaître les signes",chip:"Signes cliniques",cols:[{h:"Hypoglycémie",tone:"coral",items:["Sueurs, tremblements","Pâleur, faim","Palpitations","Confusion, agressivité","Jusqu'au coma"]},{h:"Hyperglycémie",tone:"blue",items:["Soif intense","Urines abondantes","Fatigue","Bouche sèche","Haleine fruitée si acidocétose"]}]},
  {t:"etapes",n:"05",h:"Hypoglycémie : que faire ?",chip:"Resucrage",light:true,items:["Patient conscient : **15 g de sucre rapide** (3 morceaux de sucre ou un verre de jus).","**Contrôler** la glycémie 15 minutes après.","Puis une **collation** avec des sucres lents.","Patient inconscient ou qui ne peut pas avaler : **rien par la bouche**, appel du médecin, protocole (glucagon, glucosé IV)."]}],
 [{t:"trace",n:"06",h:"Traçabilité : toujours noter",chip:"Traçabilité",items:["Valeur et unité","Heure","À jeun ou après le repas","Insuline administrée","Resucrage éventuel","Contrôle après action"]},
  {t:"retenir",txt:"On ne fait **jamais une insuline rapide** prévue pour un repas que le patient ne mangera pas sans avis médical. Toute hypoglycémie se traite **avant** de chercher sa cause."}]
]),
X("diurese","exam","Surveillance","La diurèse et le bilan entrées-sorties","2.2 4.4|B.1 B.3","bladder",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"La diurèse correspond au **volume d'urines émis sur une période donnée**, le plus souvent sur ==24 heures==. C'est un reflet direct de l'hydratation et du fonctionnement des reins."},
  {t:"valeurs",n:"02",h:"Valeurs de référence",chip:"Valeurs repères",sub:"Chez l'adulte",rows:[["Anurie","Quasi absence d'urines","< 100 mL/24 h","coral"],["Oligurie","Diurèse faible","< 500 mL/24 h","amber"],["Normale","Adulte","≈ 1,5 L/24 h","green"],["Polyurie","Diurèse excessive","> 3 L/24 h","blue"]],note:"Repère horaire : au moins 0,5 mL/kg/h. En dessous, on alerte."}],
 [{t:"table",n:"03",h:"L'aspect des urines",chip:"Aspect",rows:[["Jaune clair","normal"],["Jaune foncé, ambré","urines concentrées, déshydratation"],["Rouge, rosé","sang (hématurie) ou certains aliments"],["Troubles, malodorantes","infection possible"],["Brun foncé","bilirubine, atteinte du foie"]]},
  {t:"etapes",n:"04",h:"Mesurer la diurèse",chip:"Mesurer",items:["Expliquer au patient qu'il doit **uriner dans un bocal** ou un urinal, pas dans les toilettes.","Noter le **volume à chaque miction** sur la feuille de surveillance.","Sur sonde : **vider le sac** aux horaires prévus, sans déconnecter le système.","Faire le **total sur 24 h** à heure fixe."]}],
 [{t:"cols",n:"05",h:"Le bilan entrées-sorties",chip:"Bilan E/S",cols:[{h:"Entrées",tone:"blue",items:["Boissons","Perfusions et injections","Nutrition entérale ou parentérale","Eau des aliments"]},{h:"Sorties",tone:"coral",items:["Urines","Drains, redons","Vomissements, aspiration gastrique","Selles liquides","Pertes non mesurées : respiration, transpiration"]}]},
  {t:"signes",n:"06",h:"Rétention urinaire",chip:"Globe vésical",e:"À rechercher",items:["Envie d'uriner sans y arriver","Douleur au-dessus du pubis","Ventre tendu et bombé","Agitation chez la personne âgée","Confirmation au bladder scan"]}],
 [{t:"trace",n:"07",h:"Traçabilité : toujours noter",chip:"Traçabilité",items:["Volume et heure","Aspect des urines","Total sur 24 h","Entrées sur la même période","Bilan positif ou négatif","Poids si prescrit"]},
  {t:"retenir",txt:"Une **oligurie ou une anurie** se signale rapidement : elle peut traduire une déshydratation, un choc, une insuffisance rénale ou… une sonde bouchée. On vérifie d'abord la sonde, puis on **alerte**."}]
]),
X("douleur","exam","Douleur","Évaluer la douleur","4.4 4.7|B.3","face",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"La douleur est une **expérience sensorielle et émotionnelle désagréable**. Elle est subjective : ==c'est le patient qui sait== combien il a mal. Son évaluation est un soin du rôle propre infirmier."},
  {t:"duo",items:[{tag:"Aiguë",tone:"coral",txt:"Signal d'alarme, **récente**",sub:"Fracture, chirurgie, colique"},{tag:"Chronique",tone:"blue",txt:"Dure **plus de 3 mois**",sub:"Retentit sur le moral, le sommeil, la vie sociale"}]}],
 [{t:"table",n:"02",h:"Les échelles d'auto-évaluation",chip:"Auto-évaluation",sub:"Le patient s'évalue lui-même",rows:[["EVA","réglette de 0 à 10"],["EN (numérique)","« De 0 à 10, combien avez-vous mal ? »"],["EVS (verbale)","absente, faible, modérée, intense, extrêmement intense"],["Échelle des visages","enfant à partir d'environ 4 ans"]]},
  {t:"table",n:"03",h:"Les échelles d'hétéro-évaluation",chip:"Hétéro-évaluation",sub:"Quand le patient ne peut pas s'exprimer",rows:[["Algoplus","personne âgée, douleur aiguë, douleur probable dès 2/5"],["Doloplus","personne âgée, douleur chronique, douleur probable dès 5/30"],["ECPA","personne âgée non communicante"],["EVENDOL","enfant de moins de 7 ans"],["FLACC","enfant, douleur post-opératoire"]]}],
 [{t:"table",n:"04",h:"Caractériser la douleur : PQRST",chip:"PQRST",rows:[["**P** — Provoqué","qu'est-ce qui la déclenche, la soulage ?"],["**Q** — Qualité","brûlure, serrement, coup de poignard, décharge"],["**R** — Région","où ? Est-ce qu'elle irradie ?"],["**S** — Sévérité","intensité sur l'échelle"],["**T** — Temps","depuis quand, continue ou par crises ?"]]},
  {t:"liste",n:"05",h:"Les signes indirects",chip:"Signes indirects",two:true,items:["Grimaces, plaintes","Position antalgique","Agitation ou au contraire immobilité","Refus de bouger, de manger","Tachycardie, sueurs","Troubles du sommeil"]}],
 [{t:"etapes",n:"06",h:"La démarche",chip:"Démarche",items:["**Évaluer** avec une échelle adaptée au patient, toujours la même.","**Traiter** selon la prescription ou le protocole, et avec des moyens non médicamenteux.","**Réévaluer** après l'antalgique, dans un délai adapté à la voie d'administration.","**Tracer** chaque évaluation et chaque action."]},
  {t:"trace",n:"07",h:"Traçabilité : toujours noter",chip:"Traçabilité",items:["Score et échelle utilisée","Heure","Localisation","Traitement donné","Réévaluation","Effets indésirables"]},
  {t:"retenir",txt:"Une douleur **non évaluée** est une douleur **non traitée**. On croit le patient. Une douleur nouvelle, brutale ou thoracique n'est pas « juste » à calmer : elle doit être **signalée au médecin**."}]
]),
X("glasgow","exam","Neurologie","Le score de Glasgow","4.3 2.7|B.3","eye",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"Le score de Glasgow évalue le **niveau de conscience** à partir de trois réponses : les yeux, la parole et les mouvements. Il va de ==3== (coma profond) à ==15== (conscience normale)."},
  {t:"valeurs",n:"02",h:"Interprétation",chip:"Interprétation",rows:[["Normal","Conscience normale","15","green"],["Léger","Trouble léger","13–14","amber"],["Modéré","Trouble modéré","9–12","coral"],["Grave","Coma","≤ 8","coral"]],note:"À 8 ou moins, le patient ne protège plus forcément ses voies aériennes."}],
 [{t:"table",n:"03",h:"Ouverture des yeux (Y)",chip:"Yeux",rows:[["Spontanée","4"],["À la demande, au bruit","3"],["À la douleur","2"],["Aucune","1"]]},
  {t:"table",n:"04",h:"Réponse verbale (V)",chip:"Parole",rows:[["Orientée","5"],["Confuse","4"],["Mots inappropriés","3"],["Sons incompréhensibles","2"],["Aucune","1"]]}],
 [{t:"table",n:"05",h:"Réponse motrice (M)",chip:"Mouvements",rows:[["Obéit aux ordres","6"],["Localise la douleur","5"],["Évitement, retrait","4"],["Flexion anormale (décortication)","3"],["Extension anormale (décérébration)","2"],["Aucune","1"]]},
  {t:"etapes",n:"06",h:"Comment évaluer ?",chip:"Méthode",light:true,items:["Observer d'abord **sans stimuler**.","Appeler le patient, puis donner un **ordre simple** (« serrez-moi la main »).","Si pas de réponse : **stimulation douloureuse** selon le protocole (pression sur le lit de l'ongle ou le trapèze).","Retenir la **meilleure réponse** obtenue pour chaque item.","Examiner les **pupilles** : taille, symétrie, réaction à la lumière."]}],
 [{t:"trace",n:"07",h:"Traçabilité : toujours noter",chip:"Traçabilité",items:["Score détaillé : Y, V, M","Total sur 15","Heure","État des pupilles","Déficit d'un côté","Évolution"],note:"Exemple : Glasgow 13 (Y3 V4 M6)."},
  {t:"retenir",txt:"Une **baisse de 2 points**, une **pupille plus grande que l'autre** ou un score à **8 ou moins** : **alerte immédiate**. Le score détaillé est plus utile que le total seul."}]
]),
X("bio","exam","Biologie","Le bilan sanguin","4.4 2.1|B.1 B.3","tube",[
 [{t:"def",n:"01",h:"Pourquoi le connaître",chip:"Enjeux",txt:"L'infirmier **prélève**, mais il doit aussi **repérer un résultat anormal** et prévenir. Les normes ci-dessous sont des repères adulte ; on se fie toujours à celles du laboratoire."},
  {t:"table",n:"02",h:"L'ionogramme",chip:"Ionogramme",rows:[["Sodium (Na⁺)","135–145 mmol/L"],["Potassium (K⁺)","3,5–5,0 mmol/L"],["Chlore (Cl⁻)","95–105 mmol/L"],["Glucose à jeun","3,9–6,1 mmol/L"]],note:"Le potassium est le plus dangereux : trop haut ou trop bas, il provoque des troubles du rythme cardiaque."}],
 [{t:"table",n:"03",h:"La NFS",chip:"NFS",rows:[["Hémoglobine (homme)","13–17 g/dL"],["Hémoglobine (femme)","12–16 g/dL"],["Leucocytes","4–10 G/L"],["Polynucléaires neutrophiles","1,5–7 G/L"],["Plaquettes","150–400 G/L"]]},
  {t:"table",n:"04",h:"Rein, inflammation, coagulation",chip:"Autres dosages",rows:[["Créatinine","≈ 60–110 µmol/L (homme), 45–90 (femme)"],["Urée","2,5–7,5 mmol/L"],["CRP","< 5 mg/L"],["TP","70–100 %"],["INR sans traitement","≈ 1"],["INR sous AVK","2–3 le plus souvent"]]}],
 [{t:"cols",n:"05",h:"Les résultats qui alertent",chip:"Alertes",cols:[{h:"Trop bas",tone:"blue",items:["Potassium < 3 mmol/L","Sodium < 125 mmol/L","Hémoglobine qui chute","Plaquettes < 50 G/L","Neutrophiles < 0,5 G/L"]},{h:"Trop haut",tone:"coral",items:["Potassium > 6 mmol/L","INR très au-dessus de la cible","Créatinine qui double","CRP qui s'envole avec fièvre"]}]},
  {t:"liste",n:"06",h:"Les erreurs pré-analytiques",chip:"Erreurs à éviter",items:["**Garrot trop long** ou poing serré : fausse hyperkaliémie par hémolyse","**Mauvais ordre des tubes** : contamination par les additifs","Prélever **sur le bras d'une perfusion** : résultats dilués","**Étiquetage** loin du patient : erreur d'identité","Tube pas assez rempli, transport trop lent"]}],
 [{t:"trace",n:"07",h:"Traçabilité : toujours noter",chip:"Traçabilité",items:["Heure du prélèvement","Préleveur","À jeun ou non","Difficultés rencontrées","Envoi au laboratoire","Résultat critique transmis"]},
  {t:"retenir",txt:"Un résultat **critique** (potassium, hémoglobine, INR) se transmet **immédiatement** au médecin, oralement, puis on trace à qui et à quelle heure."}]
]),
X("detresse","exam","Urgences","Les signes de détresse vitale","4.3|B.3","alert",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"Une détresse vitale est une **défaillance d'une fonction vitale** : la conscience, la respiration ou la circulation. Sans action rapide, elle peut mener à l'arrêt cardiaque. On les évalue dans l'ordre ==ABC== : voies aériennes, respiration, circulation."},
  {t:"signes",n:"02",h:"Détresse neurologique",chip:"Neurologique",ico:"warn",e:"Conscience",items:["Glasgow ≤ 8 ou qui baisse","Agitation, confusion brutale","Convulsions","Déficit d'un membre, trouble de la parole","Pupilles asymétriques"]}],
 [{t:"signes",n:"03",h:"Détresse respiratoire",chip:"Respiratoire",ico:"warn",e:"Respiration",items:["FR > 30 ou < 8 /min","Tirage, battement des ailes du nez","Cyanose","SpO₂ basse","Impossible de parler","Sueurs"]},
  {t:"signes",n:"04",h:"Détresse circulatoire",chip:"Circulatoire",ico:"warn",e:"Circulation",items:["Pouls rapide et filant","PAS < 90 mmHg","Marbrures des genoux","Extrémités froides, pâleur","Temps de recoloration > 3 s","Oligurie"]}],
 [{t:"etapes",n:"05",h:"Que faire ?",chip:"Conduite à tenir",items:["**Ne pas laisser le patient seul**, appeler à l'aide.","**Alerter** le médecin ou l'équipe d'urgence selon le protocole, avec la méthode SAED.","**Installer** : demi-assis si gêne respiratoire, allongé jambes surélevées si choc, PLS si inconscient qui respire.","Préparer **oxygène, voie veineuse, scope, chariot d'urgence**.","**Surveiller** et tracer les constantes de façon rapprochée."]},
  {t:"retenir",txt:"Un **seul signe** de détresse suffit pour appeler. En cas de doute, on alerte toujours : il vaut mieux déranger pour rien que d'arriver trop tard."}]
]),
X("poids","exam","Surveillance","Poids, IMC et dénutrition","4.1 2.7|B.3 C.1","scale",[
 [{t:"def",n:"01",h:"Définition",chip:"IMC",txt:"L'indice de masse corporelle (==IMC==) se calcule ainsi : **poids (kg) ÷ taille² (m)**. Exemple : 60 kg et 1,65 m donnent 60 ÷ 2,72 ≈ 22."},
  {t:"valeurs",n:"02",h:"Interprétation chez l'adulte",chip:"Valeurs repères",rows:[["Maigreur","IMC bas","< 18,5","blue"],["Normal","Corpulence normale","18,5–25","green"],["Surpoids","Excès de poids","25–30","amber"],["Obésité","Excès important","≥ 30","coral"]],note:"Après 70 ans, un IMC sous 22 fait déjà partie des critères de dénutrition."}],
 [{t:"cols",n:"03",h:"Diagnostiquer une dénutrition",chip:"Dénutrition",cols:[{h:"Un critère physique",tone:"coral",items:["Perte de poids ≥ 5 % en 1 mois ou ≥ 10 % en 6 mois","IMC < 18,5 (< 22 après 70 ans)","Fonte musculaire"]},{h:"Un critère de cause",tone:"blue",items:["Apports alimentaires réduits","Absorption diminuée","Maladie qui augmente les besoins (infection, cancer)"]}]},
  {t:"info",blue:true,txt:"Il faut **au moins un critère de chaque colonne**. La sévérité s'apprécie notamment avec l'albuminémie. Critères issus des recommandations de la HAS."}],
 [{t:"etapes",n:"04",h:"Bien peser",chip:"Pesée",items:["**Même balance**, de préférence le matin.","**À jeun**, après avoir uriné.","**Même tenue** légère.","Comparer avec le **poids habituel** du patient, pas seulement avec la dernière pesée."]},
  {t:"liste",n:"05",h:"Le rôle infirmier",chip:"Rôle infirmier",items:["Peser à l'entrée puis régulièrement","Surveiller les ingesta (fiche alimentaire)","Adapter textures, horaires, aide au repas","Enrichissement et compléments sur prescription","Prendre soin de la bouche et des prothèses dentaires"]},
  {t:"retenir",txt:"La dénutrition est **fréquente et sous-estimée**, surtout chez la personne âgée. Elle retarde la cicatrisation, favorise les infections, les escarres et les chutes. Une perte de poids inexpliquée **se signale**."}]
])
];

FX.push(
X("5b","thera","Administration","Administrer un médicament en sécurité","2.11 4.4 4.5|B.3 B.4","tube",[
 [{t:"def",n:"01",h:"Le circuit du médicament",chip:"Circuit",txt:"Un médicament passe entre plusieurs mains avant d'arriver au patient : **prescription** par le médecin, **dispensation** par la pharmacie, **administration et surveillance** par l'infirmier. Chaque étape est un point de contrôle, et l'infirmier est le ==dernier verrou== avant le patient."},
  {t:"etapes",n:"02",h:"La règle des 5B",chip:"Règle des 5B",items:["**Bon patient** : identité vérifiée par une question ouverte et le bracelet.","**Bon médicament** : nom (DCI), dosage, forme, péremption.","**Bonne dose** : calcul vérifié, double contrôle si médicament à risque.","**Bonne voie** : orale, SC, IM, IV, inhalée…","**Bon moment** : horaire, à jeun ou pendant le repas, intervalle respecté."]}],
 [{t:"liste",n:"03",h:"Une prescription valide",chip:"Prescription",two:true,items:["Nom, prénom, date de naissance du patient","Date et heure","Médicament en DCI","Dosage et forme","Voie d'administration","Posologie et rythme","Durée du traitement","Identification et signature du prescripteur"]},
  {t:"info",txt:"**Prescription illisible, incomplète ou qui vous semble anormale** : on ne l'exécute pas, on demande une clarification au prescripteur. Les prescriptions orales sont réservées à l'urgence et doivent être confirmées par écrit."}],
 [{t:"etapes",n:"04",h:"Préparer",chip:"Préparation",light:true,items:["Au **calme**, sans être interrompu.","**Hygiène des mains** et plan de travail propre.","**Lire l'étiquette trois fois** : en prenant le produit, en le préparant, en le rangeant.","**Préparer pour un seul patient** à la fois, juste avant l'administration.","**Étiqueter** toute seringue ou poche préparée (nom, produit, dose, heure)."]},
  {t:"etapes",n:"05",h:"Administrer",chip:"Administration",items:["**Vérifier l'identité** au lit du patient.","Vérifier les **allergies**.","**Informer** le patient de ce qu'on lui donne.","**Rester présent** pendant la prise des comprimés.","**Surveiller** l'effet attendu et les effets indésirables."]}],
 [{t:"trace",n:"06",h:"Traçabilité : toujours noter",chip:"Traçabilité",items:["Administration réelle","Heure","Produit et dose","Voie","Refus ou non-administration","Motif et médecin prévenu"]},
  {t:"retenir",txt:"On trace **au moment** de l'administration, jamais à l'avance. Un médicament **non tracé** est considéré comme **non donné**. En cas d'erreur : prise en charge du patient d'abord, puis information du médecin et déclaration."}]
]),
X("adme","thera","Pharmacologie","Le parcours du médicament dans le corps","2.11|B.1","flask",[
 [{t:"def",n:"01",h:"Deux notions",chip:"Définitions",txt:"La **pharmacocinétique** décrit ce que ==le corps fait au médicament== (absorption, distribution, transformation, élimination). La **pharmacodynamie** décrit ce que le médicament fait au corps (son effet)."},
  {t:"schema",n:"02",h:"Le trajet ADME",chip:"Schéma ADME",k:"adme",cap:"**A**bsorption, **D**istribution, **M**étabolisme, **É**limination."}],
 [{t:"table",n:"03",h:"Chaque étape en détail",chip:"Les 4 étapes",rows:[["**Absorption**","passage du site d'administration vers le sang"],["**Distribution**","diffusion vers les organes, souvent liée aux protéines du sang (albumine)"],["**Métabolisme**","transformation, surtout par le foie"],["**Élimination**","surtout par les reins (urines), aussi par la bile"]]},
  {t:"table",n:"04",h:"Les mots clés",chip:"Vocabulaire",rows:[["Biodisponibilité","part du médicament qui atteint le sang (100 % en IV)"],["Effet de 1er passage","transformation par le foie avant d'atteindre le sang"],["Demi-vie","temps pour que la concentration baisse de moitié"],["État d'équilibre","atteint après environ 5 demi-vies"]]}],
 [{t:"schema",n:"05",h:"La fenêtre thérapeutique",chip:"Fenêtre thérapeutique",k:"fenetre",cap:"En dessous du seuil d'efficacité, le médicament n'agit pas. Au-dessus du seuil toxique, il devient dangereux."},
  {t:"info",txt:"**Marge étroite** : pour certains médicaments, les deux seuils sont proches (AVK, lithium, digoxine, certains antibiotiques). On les surveille par des **dosages sanguins**."}],
 [{t:"liste",n:"06",h:"Les patients à risque",chip:"Patients à risque",two:true,items:["Personne âgée","Insuffisance rénale","Insuffisance hépatique","Enfant, nourrisson","Grossesse, allaitement","Dénutrition (moins d'albumine)"]},
  {t:"liste",n:"07",h:"Les interactions",chip:"Interactions",items:["Un médicament peut **augmenter ou diminuer** l'effet d'un autre","Certains **aliments** interfèrent : le jus de pamplemousse en est l'exemple classique","L'**automédication** (aspirine, ibuprofène, plantes) doit toujours être recherchée"]},
  {t:"retenir",txt:"Plus un patient prend de médicaments, plus le risque d'interaction et d'effet indésirable augmente. Chez la personne âgée polymédiquée, **toute nouvelle confusion, chute ou fatigue** peut être d'origine médicamenteuse."}]
]),
X("galenique","thera","Pharmacologie","Formes et voies d'administration","2.11 4.4|B.1 B.3","tube",[
 [{t:"def",n:"01",h:"Définitions",chip:"Définitions",txt:"La **forme galénique** est la présentation du médicament (comprimé, gélule, sirop, patch, solution injectable). La **voie d'administration** est le chemin par lequel il entre dans le corps. Les deux déterminent la ==vitesse et la durée de l'effet==."},
  {t:"table",n:"02",h:"Les voies et leur délai",chip:"Voies",rows:[["Intraveineuse","immédiat, aucune marge d'erreur"],["Sublinguale","rapide, évite le 1er passage hépatique"],["Inhalée","rapide, action locale sur les bronches"],["Intramusculaire","assez rapide"],["Sous-cutanée","plus lente et régulière"],["Orale","la plus courante, délai variable"],["Transdermique (patch)","lente et prolongée"]]}],
 [{t:"cols",n:"03",h:"Écraser ou ouvrir ?",chip:"Écrasement",cols:[{h:"Jamais sans avis",tone:"coral",items:["Libération prolongée (LP, LM)","Gastrorésistant","Sublingual, orodispersible","Cytotoxiques"]},{h:"Si nécessaire",tone:"green",items:["Comprimés simples, selon la liste de l'établissement","Toujours avec l'avis du pharmacien en cas de doute"]}]},
  {t:"info",txt:"Écraser une forme **LP** libère toute la dose d'un coup : risque de **surdosage**. Pour un patient avec des troubles de la déglutition, on demande au médecin ou au pharmacien une autre forme."}],
 [{t:"liste",n:"04",h:"Les formes qui demandent une technique",chip:"Techniques",items:["**Patch** : retirer l'ancien, changer de site, peau propre et sans poils, éviter la chaleur (bouillotte, fièvre) qui accélère le passage","**Inhalateur** : expirer, inspirer lentement en déclenchant, retenir sa respiration ; **rincer la bouche** après un corticoïde inhalé","**Collyres** : attendre quelques minutes entre deux collyres, ne pas toucher l'œil avec l'embout","**Suppositoire** : introduire après la défécation si possible","**Sirop** : utiliser le dispositif doseur fourni"]}],
 [{t:"trace",n:"05",h:"Traçabilité : toujours noter",chip:"Traçabilité",items:["Forme et voie réelles","Écrasement validé","Site du patch","Heure de pose et de retrait","Difficulté de prise","Avis du pharmacien"]},
  {t:"retenir",txt:"Changer de voie ou de forme, c'est **changer la prescription** : cela ne se fait jamais sans le médecin. La voie IV ne pardonne aucune erreur de dose ou de dilution."}]
]),
X("antalgiques","thera","Douleur","Les antalgiques","2.11 4.4|B.1 B.3","face",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"Un antalgique est un médicament qui **diminue ou supprime la douleur**. L'OMS les classe en ==trois paliers== selon leur puissance. Le choix dépend de l'intensité et du type de douleur."},
  {t:"schema",n:"02",h:"Les paliers de l'OMS",chip:"Paliers OMS",k:"paliers"}],
 [{t:"table",n:"03",h:"Palier 1 : non opioïdes",chip:"Palier 1",rows:[["Paracétamol","antalgique et antifièvre ; 4 g/24 h au maximum chez l'adulte en général"],["Intervalle","au moins 4 heures entre deux prises"],["AINS","ibuprofène, kétoprofène : aussi anti-inflammatoires"]],note:"Paracétamol : dose maximale réduite si petit poids, atteinte du foie ou alcoolisme. Attention aux associations qui en contiennent déjà."},
  {t:"table",n:"04",h:"Palier 2 : opioïdes faibles",chip:"Palier 2",rows:[["Tramadol","nausées, vertiges, somnolence"],["Codéine","constipation, somnolence"],["Souvent associés","au paracétamol dans un même comprimé"]]}],
 [{t:"table",n:"05",h:"Palier 3 : opioïdes forts",chip:"Palier 3",rows:[["Morphine","référence, voies orale, SC, IV, pompe PCA"],["Oxycodone","orale ou injectable"],["Fentanyl","patch, ou voie IV"]]},
  {t:"liste",n:"06",h:"Surveiller un opioïde fort",chip:"Surveillance",items:["**Sédation** avec une échelle (le patient est-il facile à réveiller ?)","**Fréquence respiratoire** : une FR qui baisse est un signe d'alerte","Douleur avant et après","**Constipation** : laxatif associé dès le début","Nausées, vomissements","Rétention urinaire, prurit, confusion"]}],
 [{t:"signes",n:"07",h:"Signes de surdosage",chip:"Surdosage",e:"Alerte",items:["Somnolence qui augmente","FR basse, pauses","Pupilles en tête d'épingle","Confusion"]},
  {t:"info",txt:"**Antidote** : la naloxone, sur prescription ou protocole. Son effet est plus court que celui de la morphine : la surveillance continue après l'injection."},
  {t:"info",blue:true,txt:"**Douleur neuropathique** (brûlures, décharges électriques) : elle répond mal aux antalgiques classiques. Le médecin prescrit alors d'autres traitements, par exemple certains antiépileptiques ou antidépresseurs."},
  {t:"retenir",txt:"**Évaluer, traiter, réévaluer, tracer.** La somnolence précède souvent la dépression respiratoire : un patient sous morphine **difficile à réveiller** est une urgence."}]
]),
X("ains","thera","Pharmacologie","AINS et corticoïdes","2.11|B.1","flask",[
 [{t:"def",n:"01",h:"Deux familles anti-inflammatoires",chip:"Définitions",txt:"Les **AINS** (anti-inflammatoires non stéroïdiens : ibuprofène, kétoprofène, diclofénac) et les **corticoïdes** (prednisone, méthylprednisolone) réduisent l'inflammation. Les corticoïdes sont ==plus puissants== et agissent aussi sur l'immunité."},
  {t:"cols",n:"02",h:"Les AINS",chip:"AINS",cols:[{h:"Effets indésirables",tone:"coral",items:["Ulcère, saignement digestif","Atteinte des reins","Allergie, crise d'asthme","Rétention d'eau, hypertension"]},{h:"Précautions",tone:"blue",items:["À prendre pendant le repas","Durée la plus courte possible","Éviter chez la personne âgée, l'insuffisant rénal","Contre-indiqués à partir du 6e mois de grossesse"]}]}],
 [{t:"cols",n:"03",h:"Les corticoïdes",chip:"Corticoïdes",cols:[{h:"Effets à court terme",tone:"amber",items:["Hyperglycémie","Insomnie, excitation","Hypertension, rétention d'eau","Baisse du potassium"]},{h:"Effets à long terme",tone:"coral",items:["Infections","Ostéoporose","Fonte musculaire","Prise de poids, visage arrondi","Cataracte"]}]},
  {t:"liste",n:"04",h:"Surveillance infirmière",chip:"Surveillance",two:true,items:["Glycémie, surtout chez le diabétique","Tension, poids","Signes d'infection","Douleurs digestives, selles noires","Sommeil, humeur","Kaliémie"]}],
 [{t:"etapes",n:"05",h:"Les règles de prise",chip:"Bonnes pratiques",light:true,items:["Corticoïde de préférence **le matin**, en une prise, pour respecter le rythme naturel.","Alimentation adaptée selon prescription : **moins de sel et de sucres rapides**, apport suffisant en protéines et en calcium.","Ne **jamais arrêter brutalement** un traitement prolongé.","Pas d'AINS en **automédication** en même temps qu'un anticoagulant."]},
  {t:"retenir",txt:"L'arrêt brutal d'une corticothérapie prolongée expose à une **insuffisance surrénalienne aiguë** (fatigue intense, hypotension, malaise). La diminution est toujours **progressive**, selon le schéma prescrit."}]
]),
X("anticoag","thera","Cardiologie","Les anticoagulants","2.11|B.1","drop",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"Les anticoagulants **empêchent la formation ou l'extension d'un caillot**. Ils sont prescrits pour traiter ou prévenir une phlébite, une embolie pulmonaire, un AVC lié à une fibrillation auriculaire. Leur risque principal : ==l'hémorragie==."},
  {t:"table",n:"02",h:"Les familles",chip:"Familles",rows:[["HBPM (énoxaparine…)","SC · plaquettes, parfois anti-Xa"],["Héparine non fractionnée","IV au PSE ou SC · TCA ou anti-Xa, plaquettes"],["AVK (warfarine)","orale · INR"],["AOD (apixaban, rivaroxaban, dabigatran)","orale · fonction rénale, pas d'INR"]]}],
 [{t:"schema",n:"03",h:"L'INR sous AVK",chip:"INR",k:"inr",cap:"L'INR mesure le temps de coagulation. Sans traitement, il est proche de 1."},
  {t:"table",n:"04",h:"Les antidotes",chip:"Antidotes",rows:[["Héparine non fractionnée","protamine"],["AVK","vitamine K, et concentrés de facteurs si hémorragie grave"],["Dabigatran","idarucizumab"]],note:"L'antidote se donne sur prescription, selon le protocole."}],
 [{t:"etapes",n:"05",h:"Injecter une HBPM",chip:"Injection SC",items:["Vérifier la prescription, le poids, la fonction rénale.","Injection **sous-cutanée** dans l'abdomen, en alternant les côtés.","**Pincer un pli** de peau et piquer perpendiculairement.","**Ne pas purger** la bulle d'air de la seringue préremplie.","**Ne pas masser** après l'injection."]},
  {t:"signes",n:"06",h:"Signes de saignement",chip:"Signes cliniques",items:["Saignement des gencives, du nez","Hématomes inhabituels","Urines rouges","Selles noires ou rouges","**Maux de tête intenses**","Pâleur, tachycardie"]}],
 [{t:"liste",n:"07",h:"Éducation du patient sous AVK",chip:"Éducation",items:["Prise **à heure fixe**, le plus souvent le soir","INR réguliers, notés dans le **carnet de suivi**","**Pas d'automédication** : ni aspirine ni anti-inflammatoire","Alimentation **régulière** en légumes verts, sans les supprimer","Signaler tout saignement et prévenir chaque soignant (dentiste, kiné)"]},
  {t:"retenir",txt:"Sous anticoagulant, **une chute avec choc à la tête** impose d'alerter le médecin même si le patient va bien. Les anticoagulants font partie des **médicaments à haut risque** : double vérification de la dose."}]
])
);
FX.push(
X("diuretiques","thera","Cardiologie","Les diurétiques","2.11|B.1","bladder",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"Les diurétiques **augmentent l'élimination d'eau et de sel par les reins**. Ils sont prescrits dans l'insuffisance cardiaque, l'hypertension et les œdèmes. Ils agissent sur ==différentes parties du néphron==, ce qui explique leurs effets sur le potassium."},
  {t:"schema",n:"02",h:"Où agissent-ils ?",chip:"Schéma",k:"nephron"}],
 [{t:"table",n:"03",h:"Les trois familles",chip:"Familles",rows:[["**De l'anse** (furosémide)","puissants et rapides · font baisser le potassium"],["**Thiazidiques** (hydrochlorothiazide)","modérés, souvent dans l'HTA · font baisser le potassium"],["**Épargneurs de potassium** (spironolactone)","faibles · font monter le potassium"]]},
  {t:"info",txt:"Une **hypokaliémie** donne crampes, faiblesse musculaire et troubles du rythme. Une **hyperkaliémie** est silencieuse mais peut provoquer un arrêt cardiaque."}],
 [{t:"liste",n:"04",h:"Surveillance infirmière",chip:"Surveillance",two:true,items:["**Poids** chaque jour","**Diurèse** et bilan entrées-sorties","Tension, hypotension orthostatique","Ionogramme (K⁺, Na⁺), créatinine","Signes de déshydratation","Crampes, faiblesse"]},
  {t:"signes",n:"05",h:"Signes de déshydratation",chip:"Déshydratation",items:["Soif, bouche sèche","Pli cutané (peu fiable chez l'âgé)","Hypotension, tachycardie","Urines rares et foncées","Confusion","Perte de poids rapide"]}],
 [{t:"etapes",n:"06",h:"Bonnes pratiques",chip:"Bonnes pratiques",light:true,items:["Donner **le matin** pour éviter les levers la nuit et les chutes.","Prévoir un accès facile aux **toilettes** ou un urinal.","Adapter les apports en sel et en eau **selon la prescription**.","Après une injection IV de furosémide, s'attendre à une **diurèse rapide et importante**."]},
  {t:"retenir",txt:"Chez la personne âgée, un diurétique associé à la chaleur, la fièvre ou une diarrhée expose à une **déshydratation** et une **insuffisance rénale**. On alerte avant de donner la dose suivante si le patient ne boit plus."}]
]),
X("antibio","thera","Infectieux","Les antibiotiques","2.11 2.5|B.1","flask",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"Les antibiotiques **détruisent les bactéries ou bloquent leur multiplication**. Ils n'ont ==aucun effet sur les virus==. Leur usage excessif favorise l'apparition de bactéries résistantes (BMR, BHRe)."},
  {t:"table",n:"02",h:"Les grandes familles",chip:"Familles",rows:[["Pénicillines (amoxicilline)","allergie à rechercher"],["Céphalosporines (ceftriaxone)","allergie croisée possible avec les pénicillines"],["Aminosides (gentamicine)","toxiques pour le rein et l'oreille · dosages"],["Glycopeptides (vancomycine)","perfusion lente · dosages"],["Fluoroquinolones (ofloxacine)","tendinites, photosensibilisation"],["Macrolides (azithromycine)","troubles digestifs, interactions"]]}],
 [{t:"etapes",n:"03",h:"Les règles d'administration",chip:"Administration",items:["Rechercher une **allergie** avant la première dose.","Faire les **prélèvements prescrits avant** la première dose (hémocultures, ECBU).","Respecter **strictement les horaires** pour garder une concentration efficace.","Respecter la **dilution et la durée** de perfusion.","Le médecin **réévalue** le traitement à 48–72 h, avec les résultats."]},
  {t:"schema",n:"04",h:"Pic et résiduel",chip:"Dosages",k:"fenetre",cap:"Le **pic** se prélève après la fin de la perfusion, le **résiduel** juste avant la dose suivante, selon le protocole."}],
 [{t:"cols",n:"05",h:"Surveillance",chip:"Surveillance",cols:[{h:"Efficacité",tone:"green",items:["Température","Signes locaux de l'infection","CRP, leucocytes","État général"]},{h:"Tolérance",tone:"coral",items:["Éruption, démangeaisons, gêne respiratoire","Diarrhée","Veinite au point de perfusion","Fonction rénale, audition selon la molécule"]}]},
  {t:"info",txt:"**Diarrhée sous antibiotiques** : penser à *Clostridioides difficile*. On alerte, on met en place les précautions contact et le lavage des mains au savon."},
  {t:"retenir",txt:"Un antibiotique se donne **à l'heure**, pendant **toute la durée prescrite**. Une réaction allergique pendant la perfusion impose d'**arrêter immédiatement** et d'alerter."}]
]),
X("stupefiants","thera","Législation","Les stupéfiants","2.11 1.3|B.1 A.2","tube",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"Les stupéfiants sont des médicaments à fort potentiel de **dépendance et de détournement** : morphine, oxycodone, fentanyl, méthadone… Leur circuit est ==strictement encadré par la loi==, de la prescription à l'élimination."},
  {t:"liste",n:"02",h:"La prescription",chip:"Prescription",items:["Sur **ordonnance sécurisée** (papier filigrané, numéroté)","Dosage et posologie **écrits en toutes lettres**","**Durée maximale** limitée, qui dépend du produit et de sa forme","Chevauchement entre deux ordonnances interdit sauf mention du prescripteur"]}],
 [{t:"etapes",n:"03",h:"Le stockage dans le service",chip:"Stockage",light:true,items:["Rangés dans un **coffre ou une armoire fermée à clé**, séparée des autres médicaments.","La **clé** est détenue par l'infirmier responsable, jamais laissée sur la porte.","Un **registre** ou un logiciel trace chaque entrée et chaque sortie.","**Inventaire** régulier du stock."]},
  {t:"liste",n:"04",h:"La traçabilité de chaque dose",chip:"Traçabilité",items:["Nom du patient, produit, dose, date, heure","Nom de l'infirmier qui administre","**Ampoules vides, entamées ou périmées** rapportées à la pharmacie","**Casse ou perte** : déclarée, avec un témoin, selon la procédure"]}],
 [{t:"trace",n:"05",h:"À vérifier à chaque administration",chip:"Vérifications",items:["Prescription valide","Identité du patient","Dose et voie","Douleur et sédation avant","FR avant","Inscription au registre"]},
  {t:"retenir",txt:"Toute **différence de stock** doit être signalée immédiatement au cadre et au pharmacien. Le stupéfiant engage la **responsabilité pénale** de celui qui le manipule."}]
]),
X("insuline-f","thera","Diabète","Les insulines","2.11 2.7 4.4|B.1 B.3","drop",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"L'insuline est l'hormone qui **fait entrer le sucre dans les cellules** et baisse la glycémie. On l'injecte quand le pancréas n'en produit plus (diabète de type 1) ou plus assez (type 2). C'est un ==médicament à haut risque== : une erreur de dose peut provoquer une hypoglycémie grave."},
  {t:"schema",n:"02",h:"Rapide et lente",chip:"Profils d'action",k:"insuline"}],
 [{t:"table",n:"03",h:"Les types d'insuline",chip:"Types",rows:[["Rapides et ultrarapides","juste avant le repas · action de quelques heures"],["Intermédiaires (NPH)","aspect laiteux, à remettre en suspension"],["Lentes","une injection par jour, à heure fixe · environ 24 h"],["Mélanges","rapide + intermédiaire dans le même stylo"]],note:"Ordres de grandeur : chaque produit a ses délais. Seule une insuline rapide peut s'injecter en IV, au pousse-seringue."},
  {t:"schema",n:"04",h:"Les sites d'injection",chip:"Sites",k:"sites"}],
 [{t:"etapes",n:"05",h:"Injecter au stylo",chip:"Technique",items:["Vérifier la **glycémie**, la prescription et le **repas prévu**.","Vérifier le **type d'insuline** et la **date d'ouverture**.","Remettre en suspension une insuline laiteuse en **roulant le stylo**, sans le secouer.","**Purger** l'aiguille (souvent 2 unités), puis régler la dose.","Injecter en **sous-cutané**, maintenir l'aiguille **une dizaine de secondes**, changer de point."]},
  {t:"liste",n:"06",h:"Conservation",chip:"Conservation",items:["Non entamée : **au réfrigérateur**, entre 2 et 8 °C, jamais congelée","Entamée : à température ambiante, utilisable **environ 4 semaines** selon le produit","Noter la **date d'ouverture** sur le stylo","Stylo personnel : **un patient, un stylo**"]}],
 [{t:"signes",n:"07",h:"Lipodystrophies",chip:"Complications locales",e:"À rechercher",one:true,items:["Boules ou zones dures sous la peau, à force de piquer au même endroit","L'insuline y passe mal : glycémies instables","Prévention : **rotation des sites**"]},
  {t:"retenir",txt:"Pas de repas, pas d'insuline rapide **sans avis médical**. Une insuline lente ne s'arrête pas pour autant : elle couvre les besoins de base. En cas de doute, **glycémie capillaire et appel du médecin**."}]
]),
X("neuroleptiques","thera","Psychiatrie","Les neuroleptiques","2.11 2.6|B.1","eye",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"Les neuroleptiques (ou **antipsychotiques**) traitent les délires et hallucinations de la schizophrénie, les épisodes maniaques et certaines agitations. On distingue les ==classiques== (halopéridol) et les ==atypiques== (rispéridone, olanzapine, aripiprazole, clozapine)."},
  {t:"table",n:"02",h:"Les formes",chip:"Formes",rows:[["Orale","comprimés, gouttes, à surveiller pour l'observance"],["Injectable immédiate","en situation d'agitation, sur prescription"],["Injectable « retard »","IM toutes les 2 à 4 semaines, améliore l'observance"]]}],
 [{t:"cols",n:"03",h:"Effets indésirables",chip:"Effets indésirables",cols:[{h:"Neurologiques",tone:"coral",items:["Contractures soudaines (cou, yeux, mâchoire)","Raideur, tremblements","Besoin de bouger sans arrêt (akathisie)","Mouvements anormaux tardifs"]},{h:"Généraux",tone:"blue",items:["Somnolence","Prise de poids, diabète, cholestérol","Hypotension orthostatique","Constipation, bouche sèche","Troubles du rythme (QT long)"]}]}],
 [{t:"liste",n:"04",h:"Surveillance infirmière",chip:"Surveillance",two:true,items:["Poids, tour de taille","Glycémie, bilan lipidique","Tension couché-debout","Transit","ECG selon prescription","NFS sous clozapine"]},
  {t:"signes",n:"05",h:"Syndrome malin",chip:"Urgence",e:"Urgence vitale",items:["Fièvre élevée inexpliquée","Rigidité musculaire","Sueurs, tachycardie","Troubles de la conscience"]},
  {t:"retenir",txt:"Devant une **fièvre avec rigidité** sous neuroleptique : on ne donne pas la dose suivante et on **alerte immédiatement**. La surveillance somatique fait pleinement partie des soins en psychiatrie."}]
]),
X("chimio","thera","Oncologie","La chimiothérapie","2.9 2.11|B.1 B.3","tube",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"La chimiothérapie utilise des médicaments **cytotoxiques** qui détruisent les cellules qui se divisent vite : les cellules cancéreuses, mais aussi ==celles du sang, de la bouche, du tube digestif et des cheveux==. D'où ses effets indésirables."},
  {t:"liste",n:"02",h:"Les règles de sécurité",chip:"Sécurité",items:["Préparation **centralisée** à la pharmacie, sous hotte","Manipulation avec **gants** et protection","Vérification croisée : patient, protocole, dose, débit","Élimination dans la **filière cytotoxique**","Précautions avec les excreta selon le protocole"]}],
 [{t:"schema",n:"03",h:"Le nadir",chip:"Nadir",k:"nadir",cap:"Les globules blancs chutent après la cure. Le point le plus bas, le **nadir**, expose au risque infectieux maximal."},
  {t:"table",n:"04",h:"Les effets selon le délai",chip:"Effets indésirables",rows:[["Pendant la perfusion","réaction allergique, extravasation"],["Premiers jours","nausées, vomissements, fatigue"],["Vers J7–J14","aplasie, mucite"],["Après 2–3 semaines","chute des cheveux"],["Au long cours","neuropathie, fatigue, atteinte de certains organes"]],note:"Varie beaucoup selon les molécules."}],
 [{t:"schema",n:"05",h:"La chambre implantable",chip:"Chambre implantable",k:"pac"},
  {t:"signes",n:"06",h:"Extravasation",chip:"Extravasation",e:"Pendant la perfusion",items:["Douleur, brûlure au point d'injection","Gonflement","Rougeur","Perfusion qui ralentit"]},
  {t:"etapes",n:"07",h:"En cas d'extravasation",chip:"Conduite à tenir",light:true,items:["**Arrêter** la perfusion immédiatement.","**Laisser l'aiguille** en place et aspirer si possible.","**Alerter** le médecin.","Appliquer le **protocole** propre à la molécule.","**Tracer** et surveiller la zone."]}],
 [{t:"cols",n:"08",h:"Éducation du patient",chip:"Éducation",cols:[{h:"Appeler tout de suite si",tone:"coral",items:["Fièvre ≥ 38 °C ou frissons","Saignements","Diarrhée importante","Impossible de boire ou de manger"]},{h:"Au quotidien",tone:"green",items:["Bains de bouche selon prescription","Brosse à dents souple","Hygiène des mains, éviter les personnes malades","Alimentation fractionnée en cas de nausées"]}]},
  {t:"retenir",txt:"**Fièvre pendant une aplasie = urgence**. Le patient doit le savoir avant de rentrer chez lui, avec le numéro à appeler, de jour comme de nuit."}]
])
);

FX.push(
X("hta","patho","Cardiologie","L'hypertension artérielle","2.7 2.8 4.6|B.1 C.1","gauge",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"L'hypertension artérielle (HTA) est une **pression artérielle durablement trop élevée** : ==≥ 140/90 mmHg== en consultation, confirmée sur plusieurs mesures, ou ≥ 135/85 mmHg en automesure. C'est une maladie silencieuse, et l'un des premiers facteurs de risque d'AVC et d'infarctus."},
  {t:"cols",n:"02",h:"Causes et facteurs de risque",chip:"Causes",cols:[{h:"HTA essentielle (≈ 90 %)",tone:"blue",items:["Âge, hérédité","Excès de sel","Surpoids, sédentarité","Alcool, tabac, stress"]},{h:"HTA secondaire",tone:"coral",items:["Maladie des reins","Causes hormonales","Certains médicaments (AINS, corticoïdes)","Apnées du sommeil"]}]}],
 [{t:"liste",n:"03",h:"Les organes menacés",chip:"Complications",two:true,items:["**Cerveau** : AVC","**Cœur** : infarctus, insuffisance cardiaque","**Reins** : insuffisance rénale","**Yeux** : atteinte de la rétine","**Artères** : artérite des jambes","**Aorte** : anévrisme, dissection"]},
  {t:"signes",n:"04",h:"Signes d'une poussée grave",chip:"Urgence",e:"Alerte",items:["Céphalées violentes","Troubles visuels","Douleur thoracique","Essoufflement","Confusion, déficit","Saignement de nez abondant"]}],
 [{t:"table",n:"05",h:"Les traitements",chip:"Traitements",rows:[["IEC (ramipril…)","toux sèche, hausse du potassium"],["ARA2 (losartan…)","hausse du potassium"],["Inhibiteurs calciques (amlodipine…)","œdèmes des chevilles"],["Diurétiques thiazidiques","baisse du potassium"],["Bêtabloquants","bradycardie, fatigue · jamais d'arrêt brutal"]],note:"Hygiène de vie dans tous les cas : moins de sel, activité physique, perte de poids, moins d'alcool, arrêt du tabac."},
  {t:"etapes",n:"06",h:"L'automesure : la règle des 3",chip:"Automesure",light:true,items:["**3 mesures** le matin, avant le petit-déjeuner et les médicaments.","**3 mesures** le soir, avant le coucher.","Pendant **3 jours** de suite.","Assis, au repos, brassard au bras, en notant chaque valeur."]}],
 [{t:"liste",n:"07",h:"Rôle infirmier",chip:"Rôle infirmier",items:["Mesurer correctement la tension (conditions, brassard adapté)","Repérer l'**hypotension orthostatique** sous traitement","Surveiller kaliémie et créatinine selon le traitement","**Éducation** : observance, sel, activité, automesure","Expliquer qu'on ne s'arrête pas quand les chiffres sont bons"]},
  {t:"retenir",txt:"L'HTA ne fait **pas mal** : c'est pour cela que l'observance est difficile. Une tension très élevée avec **douleur thoracique, trouble neurologique ou essoufflement** est une urgence."}]
]),
X("ic","patho","Cardiologie","L'insuffisance cardiaque","2.7|B.1","heart",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"L'insuffisance cardiaque est l'**incapacité du cœur à pomper assez de sang** pour répondre aux besoins de l'organisme. Le sang s'accumule en amont du cœur défaillant : ==dans les poumons== si c'est le cœur gauche, ==dans le corps== si c'est le cœur droit."},
  {t:"schema",n:"02",h:"Cœur gauche, cœur droit",chip:"Schéma",k:"coeur",cap:"Si le **cœur gauche** faiblit, le sang reflue vers les **poumons** (essoufflement, OAP). Si le **cœur droit** faiblit, il reflue vers le **corps** (œdèmes, foie)."}],
 [{t:"cols",n:"03",h:"Les signes",chip:"Signes cliniques",cols:[{h:"Insuffisance gauche",tone:"coral",items:["Essoufflement à l'effort puis au repos","Orthopnée : besoin de dormir assis","Toux la nuit","Crépitants à l'auscultation"]},{h:"Insuffisance droite",tone:"blue",items:["Œdèmes des chevilles, des jambes","Prise de poids","Veines du cou gonflées","Douleur du foie, ventre gonflé"]}]},
  {t:"table",n:"04",h:"Classification NYHA",chip:"Stades NYHA",rows:[["Stade I","pas de gêne dans la vie courante"],["Stade II","gêne aux efforts importants"],["Stade III","gêne aux efforts modérés"],["Stade IV","gêne au moindre effort ou au repos"]]}],
 [{t:"liste",n:"05",h:"Causes et facteurs de décompensation",chip:"Causes",items:["**Causes** : infarctus, hypertension, maladie des valves, arythmie","**Décompensation** : écart de sel, arrêt du traitement, infection, fibrillation auriculaire, AINS"]},
  {t:"table",n:"06",h:"Les traitements",chip:"Traitements",rows:[["Diurétiques","éliminent l'eau en excès"],["IEC, ARA2 ou sacubitril-valsartan","protègent le cœur"],["Bêtabloquants","ralentissent et protègent le cœur"],["Antialdostérone (spironolactone)","surveiller le potassium"],["Gliflozines","traitement de fond plus récent"]]}],
 [{t:"signes",n:"07",h:"Œdème aigu du poumon",chip:"OAP",e:"Urgence",items:["Étouffement brutal, souvent la nuit","Patient assis, angoissé","Sueurs, crachats mousseux","Crépitants, SpO₂ basse"]},
  {t:"etapes",n:"08",h:"Conduite à tenir face à un OAP",chip:"Conduite à tenir",items:["Installer **assis, jambes pendantes**.","**Alerter** le médecin.","**Oxygène** selon protocole, surveillance SpO₂, FR, PA, FC.","Préparer **voie veineuse** et diurétique IV prescrit.","Surveiller la **diurèse**."]}],
 [{t:"liste",n:"09",h:"Éducation du patient",chip:"Éducation",items:["Se **peser chaque jour**, même heure, même balance","Alimentation **pauvre en sel** selon prescription","Observance du traitement, même sans symptôme","Activité physique adaptée","**Appeler** si prise de 2 kg en quelques jours, essoufflement inhabituel, œdèmes"]},
  {t:"retenir",txt:"Le **poids quotidien** est le meilleur outil de surveillance : il augmente avant les symptômes. Les **AINS** sont à éviter, ils aggravent la rétention d'eau."}]
]),
X("sca","patho","Cardiologie","Le syndrome coronarien aigu","2.8 4.3|B.1 B.3","heart",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"Le syndrome coronarien aigu (SCA) survient quand une **artère coronaire**, qui nourrit le muscle cardiaque, se **bouche brutalement**. Sans oxygène, le muscle cardiaque meurt : c'est l'==infarctus du myocarde==. Chaque minute compte."},
  {t:"schema",n:"02",h:"Ce qui se passe dans l'artère",chip:"Schéma",k:"artere"}],
 [{t:"cols",n:"03",h:"Angor ou infarctus ?",chip:"Angor ou SCA",cols:[{h:"Angor stable",tone:"amber",items:["Douleur à l'effort","Cède au repos ou à la trinitrine","Quelques minutes"]},{h:"SCA",tone:"coral",items:["Douleur au repos ou prolongée","Plus de 20 minutes","Ne cède pas à la trinitrine"]}]},
  {t:"signes",n:"04",h:"Les signes",chip:"Signes cliniques",items:["Douleur **en barre, en serrement**, derrière le sternum","Irradiation : bras gauche, mâchoire, dos","Sueurs, pâleur","Nausées","Essoufflement","Angoisse"]},
  {t:"info",txt:"**Formes atypiques** fréquentes chez la femme, la personne âgée et le diabétique : fatigue, douleur à l'estomac, essoufflement seul."}],
 [{t:"etapes",n:"05",h:"Conduite à tenir",chip:"Conduite à tenir",items:["**Repos strict**, ne pas laisser seul.","**ECG** dans les 10 minutes.","**Alerter** : médecin, ou le **15** hors hôpital.","**Scope**, voie veineuse, bilan dont la **troponine**.","Traitements selon prescription ou protocole (antiagrégants, antalgique, oxygène si SpO₂ basse)."]},
  {t:"table",n:"06",h:"Après l'urgence",chip:"Traitements",rows:[["Angioplastie","on rouvre l'artère et on pose un stent"],["Double antiagrégation","aspirine + un second antiagrégant · risque de saignement"],["Statine","baisse le cholestérol"],["Bêtabloquant, IEC","protègent le cœur"]]}],
 [{t:"liste",n:"07",h:"Facteurs de risque et éducation",chip:"Prévention",two:true,items:["Arrêt du **tabac**","Tension, diabète, cholestérol","Activité physique","Alimentation","**Réadaptation cardiaque**","Ne jamais arrêter seul les antiagrégants"]},
  {t:"retenir",txt:"Toute **douleur thoracique** est un SCA jusqu'à preuve du contraire : **ECG en moins de 10 minutes** et alerte immédiate. Le temps perdu, c'est du muscle cardiaque perdu."}]
]),
X("tvp-ep","patho","Vasculaire","Phlébite et embolie pulmonaire","2.8|B.1","drop",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"La **thrombose veineuse profonde** (TVP, ou phlébite) est un caillot dans une veine profonde, le plus souvent de la jambe. Si un morceau se détache et migre vers les poumons, c'est l'==embolie pulmonaire==, potentiellement mortelle."},
  {t:"table",n:"02",h:"Pourquoi un caillot se forme",chip:"Triade de Virchow",rows:[["Stase du sang","alitement, plâtre, long voyage"],["Lésion de la veine","chirurgie, traumatisme, cathéter"],["Sang qui coagule trop","cancer, grossesse, pilule, maladie de la coagulation"]],note:"Ces trois mécanismes forment la triade de Virchow."}],
 [{t:"cols",n:"03",h:"Reconnaître",chip:"Signes cliniques",cols:[{h:"Phlébite",tone:"blue",items:["Mollet douloureux","Chaud, gonflé","Perte du ballottement","Fièvre légère, pouls qui accélère"]},{h:"Embolie pulmonaire",tone:"coral",items:["Essoufflement brutal","Douleur thoracique","Tachycardie","Toux, parfois crachats de sang","Malaise, angoisse"]}]},
  {t:"table",n:"04",h:"Diagnostic",chip:"Examens",rows:[["Écho-doppler","confirme la phlébite"],["D-dimères","négatifs, ils permettent d'écarter le diagnostic"],["Angioscanner thoracique","confirme l'embolie"]]}],
 [{t:"etapes",n:"05",h:"Conduite à tenir",chip:"Conduite à tenir",items:["**Repos**, ne pas masser la jambe.","**Alerter** le médecin.","Surveiller **FR, SpO₂, pouls, tension**.","**Anticoagulant** selon prescription.","Lever autorisé selon l'avis médical, une fois le traitement débuté."]},
  {t:"liste",n:"06",h:"Prévention",chip:"Prévention",items:["**Lever précoce** après une chirurgie","Mobilisation des jambes au lit","**Bas de contention** selon prescription","**HBPM** préventive selon prescription","Hydratation"]},
  {t:"retenir",txt:"Un **essoufflement brutal** chez un patient opéré ou alité doit faire penser à l'embolie pulmonaire : **alerte immédiate**."}]
]),
X("asthme","patho","Pneumologie","L'asthme","2.8 4.6|B.1 C.1","lungs",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"L'asthme est une **inflammation chronique des bronches** qui provoque des crises de gêne respiratoire. Pendant la crise, les bronches se resserrent : c'est le bronchospasme. Il est ==réversible== avec le traitement, contrairement à la BPCO."},
  {t:"schema",n:"02",h:"La bronche en crise",chip:"Schéma",k:"bronche"}],
 [{t:"liste",n:"03",h:"Les déclencheurs",chip:"Déclencheurs",two:true,items:["Allergènes : acariens, pollens, poils","Infections virales","Tabac, pollution","Effort, air froid","Certains médicaments (aspirine, bêtabloquants)","Stress"]},
  {t:"signes",n:"04",h:"Signes de la crise",chip:"Crise",items:["Sifflements à l'expiration","Essoufflement","Toux, souvent la nuit","Oppression thoracique"]}],
 [{t:"signes",n:"05",h:"Signes de gravité",chip:"Gravité",e:"Urgence",items:["Parle avec difficulté","Tirage, sueurs","FR élevée, pouls rapide","Cyanose","**Silence** à l'auscultation","Agitation ou somnolence"]},
  {t:"etapes",n:"06",h:"Conduite à tenir",chip:"Conduite à tenir",items:["Installer **assis**, rassurer.","**Bronchodilatateur** d'action rapide selon prescription ou plan d'action.","Surveiller **FR, SpO₂, pouls**, débit expiratoire de pointe.","**Alerter** si pas d'amélioration ou signe de gravité.","Oxygène selon prescription."]}],
 [{t:"cols",n:"07",h:"Les deux traitements",chip:"Traitements",cols:[{h:"Traitement de la crise",tone:"coral",items:["Bronchodilatateur d'action rapide","Soulage en quelques minutes"]},{h:"Traitement de fond",tone:"green",items:["Corticoïde inhalé, parfois associé","Pris tous les jours, même sans symptôme","Rincer la bouche après"]}]},
  {t:"liste",n:"08",h:"Éducation",chip:"Éducation",items:["Vérifier la **technique d'inhalation** à chaque fois","Chambre d'inhalation pour l'enfant ou en cas de difficulté","Mesurer son **débit de pointe**","Connaître son **plan d'action écrit**","Éviter les déclencheurs"]},
  {t:"retenir",txt:"Une crise qui ne cède pas au traitement habituel, ou un patient qui **ne peut plus parler**, est une urgence. Un « silence » respiratoire n'est pas une amélioration : c'est un signe de gravité extrême."}]
]),
X("bpco","patho","Pneumologie","La BPCO","2.7 2.8|B.1","lungs",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"La bronchopneumopathie chronique obstructive est une **maladie chronique des bronches et des poumons**, dont l'obstruction n'est ==pas complètement réversible==. Elle est surtout liée au **tabac**. Elle évolue lentement vers l'insuffisance respiratoire."},
  {t:"liste",n:"02",h:"Les signes",chip:"Signes cliniques",two:true,items:["Toux chronique","Crachats, surtout le matin","Essoufflement progressif à l'effort","Infections bronchiques répétées","Thorax distendu","Amaigrissement aux stades avancés"]}],
 [{t:"table",n:"03",h:"Diagnostic",chip:"Diagnostic",rows:[["Spirométrie (EFR)","examen clé"],["Rapport VEMS/CV","< 0,7 après bronchodilatateur"],["Gaz du sang","aux stades avancés"]]},
  {t:"signes",n:"04",h:"Exacerbation",chip:"Exacerbation",e:"À repérer",items:["Essoufflement qui s'aggrave","Crachats plus abondants","Crachats qui changent de couleur","Fièvre","Confusion, somnolence"]}],
 [{t:"table",n:"05",h:"Traitements",chip:"Traitements",rows:[["Arrêt du tabac","seule mesure qui ralentit l'évolution"],["Bronchodilatateurs inhalés","de longue durée d'action"],["Réhabilitation respiratoire","réentraînement à l'effort, kiné"],["Vaccinations","grippe, pneumocoque, Covid"],["Oxygène de longue durée","au moins 15 h par jour, sur prescription"]]},
  {t:"info",txt:"**Oxygène** : on respecte le débit et la cible de saturation prescrits, souvent entre 88 et 92 %. Trop d'oxygène peut provoquer une **hypercapnie** : somnolence, confusion, sueurs, céphalées."}],
 [{t:"liste",n:"06",h:"Rôle infirmier",chip:"Rôle infirmier",items:["Position **demi-assise**","Surveillance FR, SpO₂, conscience","Aide au **drainage** des sécrétions, hydratation","Vérifier la technique d'inhalation","Prévenir la **dénutrition**","Sécurité de l'oxygène à domicile : pas de flamme, pas de tabac"]},
  {t:"retenir",txt:"Chez le patient BPCO, une **somnolence inhabituelle** sous oxygène doit faire penser à l'hypercapnie : **ne pas augmenter l'oxygène**, alerter le médecin."}]
])
);
FX.push(
X("avc","patho","Neurologie","L'accident vasculaire cérébral","2.8 4.3|B.1 B.3","alert",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"Un AVC est l'**interruption brutale de la circulation du sang dans une partie du cerveau**. Les neurones privés d'oxygène meurent en quelques minutes. C'est une ==urgence absolue== : les traitements ne sont possibles que dans les premières heures."},
  {t:"schema",n:"02",h:"Deux types d'AVC",chip:"Types",k:"avc"}],
 [{t:"table",n:"03",h:"Le réflexe VITE",chip:"Reconnaître",rows:[["**V**isage","bouche déviée, paralysie d'un côté"],["**I**nertie","faiblesse d'un bras ou d'une jambe"],["**T**rouble de la parole","mots difficiles, incompréhensibles"],["**E**n urgence","appeler le 15, noter l'heure"]]},
  {t:"liste",n:"04",h:"Autres signes possibles",chip:"Autres signes",two:true,items:["Perte de la vue d'un œil ou d'une moitié du champ visuel","Troubles de l'équilibre","Céphalée brutale et intense","Troubles de la conscience"]},
  {t:"info",txt:"**AIT (accident ischémique transitoire)** : les signes disparaissent en moins d'une heure. C'est une urgence quand même, car le risque d'AVC dans les jours suivants est élevé."}],
 [{t:"etapes",n:"05",h:"Les premières heures",chip:"Urgence",items:["**Noter l'heure** du début des signes, ou l'heure où le patient a été vu normal pour la dernière fois.","**Alerter** : filière AVC, unité neurovasculaire.","**Imagerie** en urgence pour distinguer ischémique et hémorragique.","Si ischémique : **thrombolyse** et/ou **thrombectomie** selon les délais.","Patient **à jeun** jusqu'au test de déglutition."]},
  {t:"liste",n:"06",h:"Surveillance infirmière",chip:"Surveillance",two:true,items:["Conscience, Glasgow","Évolution du déficit","Tension (cibles prescrites)","Glycémie, température","Déglutition avant tout repas","Saturation"]}],
 [{t:"liste",n:"07",h:"Prévenir les complications",chip:"Complications",items:["**Fausses routes** : test de déglutition, textures adaptées","**Escarres** et **phlébite** : mobilisation, matelas, anticoagulant préventif","**Épaule douloureuse** du côté paralysé : bien la positionner","**Chutes**","**Dépression** post-AVC"]},
  {t:"liste",n:"08",h:"Communication et rééducation",chip:"Rééducation",items:["**Aphasie** : phrases courtes, questions fermées, laisser le temps, outils visuels","Se placer **du côté paralysé** pour stimuler, selon le projet de rééducation","Kiné, orthophonie, ergothérapie dès que possible","Prévention secondaire : tension, cholestérol, tabac, antiagrégants"]},
  {t:"retenir",txt:"Face à un déficit brutal : **heure de début, alerte, rien par la bouche**. Pour l'AVC, le temps c'est du cerveau."}]
]),
X("alzheimer","patho","Neurologie","La maladie d'Alzheimer","2.7|B.1 B.2","eye",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"La maladie d'Alzheimer est une **maladie neurodégénérative** : des neurones se détruisent progressivement, d'abord dans les zones de la mémoire. C'est la cause la plus fréquente de ==trouble neurocognitif majeur== (démence) chez la personne âgée."},
  {t:"table",n:"02",h:"Les troubles",chip:"Symptômes",rows:[["Amnésie","mémoire des faits récents d'abord"],["Aphasie","troubles du langage"],["Apraxie","difficulté à faire des gestes (s'habiller)"],["Agnosie","ne plus reconnaître objets ou visages"],["Troubles exécutifs","planifier, organiser"],["Désorientation","dans le temps puis dans l'espace"]]}],
 [{t:"liste",n:"03",h:"Troubles du comportement",chip:"Comportement",two:true,items:["Agitation, agressivité","Déambulation","Apathie","Anxiété, dépression","Troubles du sommeil","Idées délirantes"]},
  {t:"cols",n:"04",h:"Démence ou confusion ?",chip:"Confusion aiguë",cols:[{h:"Maladie d'Alzheimer",tone:"blue",items:["Début progressif","Évolue sur des années","Vigilance normale"]},{h:"Syndrome confusionnel",tone:"coral",items:["Début brutal","Fluctue dans la journée","Cause à chercher : infection, globe, douleur, médicament, déshydratation"]}]}],
 [{t:"etapes",n:"05",h:"Communiquer",chip:"Communication",light:true,items:["Se placer **face à la personne**, à sa hauteur.","**Une consigne à la fois**, phrases courtes.","**Ne pas contredire** ni mettre en échec.","S'appuyer sur le **non-verbal** : sourire, toucher, calme.","Garder des **repères** : horaires, objets familiers, mêmes soignants si possible."]},
  {t:"liste",n:"06",h:"Rôle infirmier",chip:"Rôle infirmier",items:["Évaluation : test MMSE (sur 30) et autonomie","Prévenir **dénutrition, déshydratation, chutes**","Évaluer la **douleur** avec une échelle adaptée (Algoplus, Doloplus)","Sécuriser l'environnement","Limiter la contention, toujours sur prescription et réévaluée"]}],
 [{t:"liste",n:"07",h:"Les aidants",chip:"Aidants",items:["Repérer l'**épuisement** de l'aidant","Orienter vers l'accueil de jour, les plateformes de répit","Informer sur les aides (APA) et les **mesures de protection** : sauvegarde de justice, curatelle, tutelle"]},
  {t:"retenir",txt:"Une **aggravation brutale** du comportement n'est pas « l'évolution de la maladie » tant qu'on n'a pas cherché une **cause aiguë** : douleur, infection, rétention urinaire, constipation, médicament."}]
]),
X("parkinson","patho","Neurologie","La maladie de Parkinson","2.7|B.1","eye",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"La maladie de Parkinson est une **maladie neurodégénérative** liée à la perte des neurones qui produisent la ==dopamine==, un messager chimique indispensable au contrôle des mouvements."},
  {t:"table",n:"02",h:"La triade",chip:"Triade",rows:[["Tremblement","de repos, souvent d'un côté au début"],["Rigidité","raideur des membres"],["Akinésie","lenteur, difficulté à démarrer un mouvement"]]}],
 [{t:"liste",n:"03",h:"Les autres signes",chip:"Autres signes",two:true,items:["Visage peu expressif","Écriture qui rapetisse","Marche à petits pas","Blocages (freezing)","Troubles de l'équilibre, chutes","Troubles de la déglutition","Constipation","Dépression, troubles du sommeil"]},
  {t:"table",n:"04",h:"Les traitements",chip:"Traitements",rows:[["L-dopa (lévodopa)","remplace la dopamine manquante"],["Agonistes dopaminergiques","imitent la dopamine"],["Kiné, orthophonie","indispensables"]],note:"Avec le temps, apparaissent des fluctuations : périodes « on » où le patient bouge bien, périodes « off » où il est bloqué."}],
 [{t:"etapes",n:"05",h:"Bonnes pratiques",chip:"Bonnes pratiques",items:["Donner les traitements **à l'heure exacte**, sans retard.","Ne pas interrompre le traitement, même en cas de jeûne : demander l'avis médical.","Éviter les **neuroleptiques classiques** et certains antinauséeux, qui aggravent la maladie.","Adapter les repas à la **déglutition**.","Prévenir **chutes** et constipation."]},
  {t:"retenir",txt:"Un retard de quelques dizaines de minutes dans le traitement peut **bloquer** le patient (marche, déglutition). Les horaires sont non négociables."}]
]),
X("diabete","patho","Diabète","Le diabète","2.7 4.6|B.1 C.1","drop",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"Le diabète est une **hyperglycémie chronique**, liée à un manque d'insuline ou à une insuline qui agit mal. Diagnostic : glycémie à jeun ==≥ 1,26 g/L== à deux reprises, ou ≥ 2 g/L à tout moment avec des symptômes."},
  {t:"cols",n:"02",h:"Type 1 ou type 2",chip:"Types",cols:[{h:"Type 1",tone:"coral",items:["Destruction du pancréas (auto-immune)","Souvent jeune, début rapide","Insuline obligatoire et vitale"]},{h:"Type 2",tone:"blue",items:["Résistance à l'insuline","Souvent après 40 ans, surpoids","Hygiène de vie, puis comprimés, injectables, parfois insuline"]}]}],
 [{t:"table",n:"03",h:"Le suivi",chip:"Suivi",rows:[["HbA1c","tous les 3 mois · cible fixée par le médecin, souvent autour de 7 %"],["Fond d'œil","chaque année"],["Fonction rénale, urines","chaque année"],["Examen des pieds","à chaque consultation"],["Bilan cardiovasculaire","régulier"]]},
  {t:"table",n:"04",h:"Traitements du type 2",chip:"Traitements",rows:[["Metformine","troubles digestifs · arrêt avant injection d'iode selon protocole"],["Sulfamides","risque d'hypoglycémie"],["Gliflozines","infections urinaires et génitales"],["Analogues du GLP-1","injectables, nausées"],["Insuline","si les autres ne suffisent plus"]]}],
 [{t:"cols",n:"05",h:"Les complications",chip:"Complications",cols:[{h:"Aiguës",tone:"coral",items:["Hypoglycémie","Acidocétose (type 1) : soif, nausées, haleine fruitée, respiration ample","Hyperglycémie majeure chez l'âgé, avec déshydratation"]},{h:"Chroniques",tone:"blue",items:["Yeux : rétinopathie","Reins : néphropathie","Nerfs : neuropathie","Artères : infarctus, AVC, artérite"]}]},
  {t:"etapes",n:"06",h:"Le pied diabétique",chip:"Pied",light:true,items:["**Examiner les pieds** chaque jour : plaie, rougeur, ampoule, mycose.","Laver à l'eau tiède, **bien sécher entre les orteils**.","Chaussures adaptées, jamais pieds nus.","Pas de coricide ni d'objet coupant : **pédicure-podologue**.","**Toute plaie** se signale : elle peut s'aggraver sans douleur."]}],
 [{t:"liste",n:"07",h:"Éducation thérapeutique",chip:"Éducation",items:["Autosurveillance glycémique et carnet","Technique d'injection et rotation des sites","Reconnaître et traiter l'**hypoglycémie**","Alimentation équilibrée, régulière","Activité physique","Conduite à tenir en cas de maladie, de jeûne, de voyage"]},
  {t:"retenir",txt:"Le diabète abîme les vaisseaux **sans faire mal**. Le suivi annuel (yeux, reins, pieds, cœur) et l'éducation sont aussi importants que la glycémie du jour."}]
]),
X("hypo","patho","Diabète","L'hypoglycémie","2.7 4.3|B.1 B.3","drop",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"L'hypoglycémie est une **glycémie trop basse** : ==< 0,70 g/L== (3,9 mmol/L) chez le diabétique traité. Le cerveau, qui ne fonctionne qu'avec du sucre, souffre très vite. C'est une **urgence**."},
  {t:"liste",n:"02",h:"Les causes",chip:"Causes",two:true,items:["Repas sauté ou retardé","Effort inhabituel","Erreur de dose d'insuline","Sulfamides","Alcool","Insuffisance rénale"]}],
 [{t:"cols",n:"03",h:"Les signes",chip:"Signes cliniques",cols:[{h:"Signes d'alerte",tone:"amber",items:["Sueurs, pâleur","Tremblements","Palpitations","Faim brutale","Anxiété"]},{h:"Le cerveau manque de sucre",tone:"coral",items:["Troubles de la concentration","Troubles du comportement, agressivité","Vision trouble","Confusion","Convulsions, coma"]}]},
  {t:"info",txt:"Chez la personne âgée, ou sous bêtabloquant, les signes d'alerte peuvent manquer : l'hypoglycémie se révèle d'emblée par une **confusion** ou une **chute**."}],
 [{t:"etapes",n:"04",h:"Patient conscient",chip:"Resucrage",items:["**Glycémie capillaire** si possible, sans retarder le resucrage.","**15 g de sucre rapide** : 3 morceaux de sucre, un verre de jus ou de soda non light.","**Contrôle** 15 minutes après ; recommencer si toujours bas.","Puis une **collation** avec des sucres lents (pain, biscuits).","Rechercher la **cause** et prévenir le médecin."]},
  {t:"etapes",n:"05",h:"Patient inconscient",chip:"Inconscient",light:true,items:["**Rien par la bouche** : risque de fausse route.","**PLS** et alerte.","**Glucagon** IM ou SC, ou sucre IV, selon prescription ou protocole.","Surveillance rapprochée : l'hypoglycémie peut récidiver, surtout sous sulfamide."]}],
 [{t:"trace",n:"06",h:"Traçabilité : toujours noter",chip:"Traçabilité",items:["Glycémie et heure","Signes observés","Resucrage donné","Glycémie de contrôle","Cause suspectée","Médecin prévenu"]},
  {t:"retenir",txt:"Devant un **comportement inhabituel** chez un diabétique, on fait une **glycémie capillaire** avant toute autre hypothèse. Dans le doute, on resucre."}]
]),
X("irc","patho","Néphrologie","L'insuffisance rénale","2.7|B.1","bladder",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"L'insuffisance rénale est une **diminution de la capacité des reins à filtrer le sang**. Elle peut être ==aiguë== (brutale, souvent réversible) ou ==chronique== (progressive et définitive). On l'évalue avec la créatinine et le débit de filtration glomérulaire (DFG)."},
  {t:"table",n:"02",h:"Insuffisance rénale aiguë : les causes",chip:"IRA",rows:[["Avant le rein","déshydratation, hémorragie, choc"],["Dans le rein","médicaments toxiques, produit de contraste, infection"],["Après le rein","obstacle : globe, calcul, prostate"]],note:"Avant de penser au rein, on vérifie toujours la sonde et la présence d'un globe vésical."}],
 [{t:"table",n:"03",h:"Insuffisance rénale chronique : les stades",chip:"Stades DFG",rows:[["Stade 1–2","DFG ≥ 60 avec signes d'atteinte rénale"],["Stade 3","DFG 30–59 : modérée"],["Stade 4","DFG 15–29 : sévère"],["Stade 5","DFG < 15 : terminale, dialyse ou greffe"]],note:"DFG en mL/min/1,73 m². Causes principales : diabète et hypertension."},
  {t:"liste",n:"04",h:"Les complications",chip:"Complications",two:true,items:["**Hyperkaliémie** : troubles du rythme","Surcharge en eau : œdèmes, OAP","Hypertension","Anémie","Acidose","Fragilité osseuse"]}],
 [{t:"cols",n:"05",h:"Les traitements de suppléance",chip:"Dialyse et greffe",cols:[{h:"Hémodialyse",tone:"blue",items:["Le sang est filtré par une machine","Environ 3 séances par semaine","Accès par une fistule au bras ou un cathéter"]},{h:"Dialyse péritonéale ou greffe",tone:"green",items:["Péritonéale : à domicile, par le ventre","Greffe : le meilleur traitement quand elle est possible"]}]},
  {t:"etapes",n:"06",h:"Protéger la fistule",chip:"Fistule",light:true,items:["**Jamais** de tension, de prise de sang ni de perfusion sur ce bras.","Vérifier chaque jour le **frémissement (thrill)** sous les doigts.","Pas de vêtement ni de montre qui serre.","Signaler toute **rougeur, douleur ou disparition du frémissement**."]}],
 [{t:"liste",n:"07",h:"Rôle infirmier",chip:"Rôle infirmier",items:["**Poids, diurèse**, œdèmes, tension","Surveiller la **kaliémie** et la créatinine","Repérer les médicaments **néphrotoxiques** (AINS, produits de contraste) et les signaler","Préserver le **capital veineux** de l'avant-bras non dominant","Régime adapté selon prescription : sel, potassium, eau"]},
  {t:"retenir",txt:"Chez l'insuffisant rénal, beaucoup de médicaments **s'accumulent** : les doses sont adaptées au DFG. Une **hyperkaliémie** peut tuer sans prévenir : un résultat élevé se transmet immédiatement."}]
])
);

FX.push(
X("inflammation","patho","Infectieux","La réaction inflammatoire","2.5|B.1","thermo",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"L'inflammation est la **réaction de défense de l'organisme** face à une agression : microbe, traumatisme, brûlure, corps étranger. Elle est utile pour réparer, mais peut devenir ==nuisible== si elle est trop intense ou si elle dure."},
  {t:"table",n:"02",h:"Les signes cardinaux",chip:"4 signes",rows:[["Rougeur","afflux de sang (vasodilatation)"],["Chaleur","même mécanisme"],["Œdème","le liquide sort des vaisseaux"],["Douleur","irritation des terminaisons nerveuses"],["Impotence fonctionnelle","difficulté à utiliser la zone touchée"]]}],
 [{t:"etapes",n:"03",h:"Ce qui se passe",chip:"Mécanisme",items:["**Agression** des tissus.","**Vasodilatation** : plus de sang arrive, d'où la rougeur et la chaleur.","Les vaisseaux deviennent **perméables** : œdème.","Les **globules blancs** arrivent pour détruire l'agresseur et nettoyer.","**Réparation** des tissus, parfois avec une cicatrice."]},
  {t:"cols",n:"04",h:"Aiguë ou chronique",chip:"Aiguë ou chronique",cols:[{h:"Aiguë",tone:"coral",items:["Début rapide","Signes francs","Dure quelques jours","Exemple : entorse, abcès"]},{h:"Chronique",tone:"blue",items:["S'installe sur des semaines","Abîme les tissus","Exemple : polyarthrite, maladie de Crohn"]}]}],
 [{t:"table",n:"05",h:"Les marqueurs biologiques",chip:"Biologie",rows:[["CRP","monte en quelques heures, baisse vite à la guérison"],["Leucocytes, neutrophiles","augmentés surtout dans les infections bactériennes"],["VS","plus lente, utile dans les maladies chroniques"],["Fibrinogène","augmente aussi"],["Procalcitonine","plutôt en faveur d'une infection bactérienne"]]},
  {t:"info",txt:"**Inflammation ne veut pas dire infection** : une fracture, une poussée d'arthrite ou un infarctus donnent aussi une inflammation, sans microbe."}],
 [{t:"liste",n:"06",h:"Rôle infirmier",chip:"Rôle infirmier",items:["Observer et décrire les **signes locaux** : étendue, couleur, chaleur, écoulement","Prendre la **température** et les constantes","**Froid local** et surélévation pour un traumatisme, selon prescription","Évaluer et traiter la **douleur**","Suivre l'évolution de la CRP et des leucocytes"]},
  {t:"retenir",txt:"Une rougeur qui **s'étend**, avec fièvre, frissons ou altération de l'état général, n'est plus une simple inflammation locale : **alerter**, l'infection peut se généraliser."}]
]),
X("sepsis","patho","Infectieux","Le sepsis","2.5 4.3|B.1 B.3","alert",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"Le sepsis est une **infection qui entraîne une défaillance d'organes**, parce que la réponse de l'organisme est déréglée. Le ==choc septique== est sa forme la plus grave : la tension reste basse malgré le remplissage. C'est une urgence vitale, où chaque heure compte."},
  {t:"liste",n:"02",h:"Les portes d'entrée",chip:"Origines",two:true,items:["Poumons : pneumopathie","Urines : pyélonéphrite","Ventre : péritonite, voies biliaires","Peau : plaie, escarre, érysipèle","Cathéter, sonde","Site opératoire"]}],
 [{t:"valeurs",n:"03",h:"Le score qSOFA",chip:"qSOFA",sub:"Un point par critère",rows:[["Respiration","Fréquence respiratoire","≥ 22 /min","coral"],["Tension","Pression systolique","≤ 100 mmHg","coral"],["Conscience","Confusion, Glasgow < 15","altérée","coral"]],note:"Deux points ou plus chez un patient infecté : risque élevé, on alerte."},
  {t:"signes",n:"04",h:"Autres signes d'alerte",chip:"Signes",e:"Alerte",items:["Fièvre > 38 °C ou hypothermie < 36 °C","Frissons","Tachycardie","Marbrures","Peau froide","Urines rares","SpO₂ basse"]}],
 [{t:"etapes",n:"05",h:"Dans la première heure",chip:"Conduite à tenir",items:["**Alerter** le médecin sans attendre.","**Hémocultures** et prélèvements selon prescription, **sans retarder** l'antibiotique.","**Lactates** et bilan prescrits.","**Antibiothérapie** prescrite, au plus vite.","**Remplissage** vasculaire, oxygène selon prescription.","**Surveillance** rapprochée : PA, FC, FR, SpO₂, conscience, diurèse horaire."]},
  {t:"info",txt:"Chez la **personne âgée**, le sepsis peut se montrer seulement par une **confusion**, une chute ou une hypothermie, sans fièvre."}],
 [{t:"trace",n:"06",h:"Traçabilité : toujours noter",chip:"Traçabilité",items:["Constantes et heure","Score qSOFA","Heure d'appel du médecin","Heure des hémocultures","Heure de l'antibiotique","Diurèse"]},
  {t:"retenir",txt:"Infection + **respiration rapide, tension basse ou confusion** = sepsis possible. Le pronostic dépend du **délai avant l'antibiotique** : on alerte tout de suite."}]
]),
X("infections","patho","Infectieux","Les infections associées aux soins","2.5 2.10 4.5|B.1 B.4","flask",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"Une infection associée aux soins (IAS) apparaît **au cours ou au décours d'une prise en charge**, sans être présente à l'admission. À l'hôpital, on parle d'infection ==nosocomiale== si elle apparaît plus de 48 h après l'entrée. Une grande partie est **évitable**."},
  {t:"table",n:"02",h:"Délais à retenir",chip:"Délais",rows:[["Après l'admission","plus de 48 h"],["Après une chirurgie","jusqu'à 30 jours"],["Après pose d'une prothèse","jusqu'à 1 an"]]}],
 [{t:"cols",n:"03",h:"Les plus fréquentes",chip:"Types",cols:[{h:"Infections",tone:"coral",items:["Urinaires, souvent sur sonde","Pneumopathies, surtout sous ventilation","Infections du site opératoire","Bactériémies sur cathéter"]},{h:"Facteurs de risque",tone:"blue",items:["Âge, immunodépression","Dispositifs invasifs","Chirurgie","Durée de séjour","Antibiotiques répétés"]}]},
  {t:"table",n:"04",h:"Les bactéries résistantes",chip:"BMR et BHRe",rows:[["SARM","staphylocoque résistant à la méticilline"],["EBLSE","entérobactéries résistantes à de nombreuses bêtalactamines"],["BHRe","très résistantes, émergentes : mesures renforcées"]],note:"Ces patients bénéficient des précautions contact, en plus des précautions standard."}],
 [{t:"cols",n:"05",h:"Prévenir selon le dispositif",chip:"Prévention",cols:[{h:"Sonde urinaire",tone:"blue",items:["Pose seulement si indispensable","Système clos","Réévaluer chaque jour"]},{h:"Cathéter veineux",tone:"coral",items:["Asepsie à la pose","Pansement propre et daté","Retrait dès qu'il ne sert plus"]}]},
  {t:"liste",n:"06",h:"Prévenir l'infection du site opératoire",chip:"Site opératoire",items:["**Douche préopératoire** selon le protocole","Pas de rasage : **tonte** si une dépilation est nécessaire","Préparation cutanée avec un antiseptique","Pansement : réfection en asepsie, seulement si nécessaire","Surveiller la cicatrice : rougeur, chaleur, écoulement, désunion"]}],
 [{t:"retenir",txt:"Le geste qui prévient le plus d'infections est **l'hygiène des mains**, par friction hydroalcoolique, avant et après chaque contact. Tout dispositif invasif doit être **justifié chaque jour**."}]
]),
X("fracture","patho","Traumatologie","Les fractures","2.4|B.1 B.3","alert",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"Une fracture est une **rupture de la continuité d'un os**, le plus souvent après un traumatisme. Elle peut aussi survenir sur un os fragilisé (ostéoporose, métastase) après un choc minime : c'est une ==fracture pathologique==."},
  {t:"table",n:"02",h:"Les types",chip:"Types",rows:[["Fermée","la peau est intacte"],["Ouverte","l'os communique avec l'extérieur : risque infectieux majeur"],["Déplacée ou non","les fragments ont bougé ou non"],["En bois vert","chez l'enfant, os qui plie sans casser entièrement"]]}],
 [{t:"signes",n:"03",h:"Les signes",chip:"Signes cliniques",items:["Douleur vive","Impotence fonctionnelle","Déformation","Œdème, hématome","Craquement au moment du choc"]},
  {t:"info",txt:"**Fracture du col du fémur** chez la personne âgée après une chute : jambe **raccourcie** et pied **tourné vers l'extérieur**, impossible de se relever."},
  {t:"cols",n:"04",h:"Les traitements",chip:"Traitements",cols:[{h:"Orthopédique",tone:"blue",items:["Plâtre, résine, attelle","Immobilisation de quelques semaines"]},{h:"Chirurgical",tone:"coral",items:["Vis, plaque, clou : ostéosynthèse","Prothèse (col du fémur)","Fixateur externe (fracture ouverte)"]}]}],
 [{t:"schema",n:"05",h:"Surveiller sous un plâtre",chip:"Plâtre",k:"platre"},
  {t:"liste",n:"06",h:"Consignes au patient plâtré",chip:"Éducation",items:["**Surélever** le membre les premiers jours","**Bouger les doigts** ou les orteils régulièrement","Ne pas mouiller le plâtre, ne rien glisser dessous","Revenir en urgence si douleur qui augmente, doigts froids, bleus, engourdis","Anticoagulant préventif si prescrit (membre inférieur)"]}],
 [{t:"table",n:"07",h:"Les complications",chip:"Complications",rows:[["Immédiates","atteinte d'un vaisseau ou d'un nerf, hémorragie, choc"],["Premiers jours","syndrome des loges, phlébite, embolie, infection"],["Liées à l'alitement","escarres, pneumopathie, confusion, perte d'autonomie"],["Tardives","cal vicieux, absence de consolidation (pseudarthrose), raideur"]]},
  {t:"retenir",txt:"Une **douleur qui augmente** sous un plâtre, malgré les antalgiques, avec des doigts froids ou engourdis, est un **syndrome des loges** jusqu'à preuve du contraire : alerte immédiate."}]
]),
X("brulure","patho","Traumatologie","Les brûlures","2.4 4.3|B.1 B.3","alert",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"Une brûlure est une **destruction de la peau** et parfois des tissus plus profonds, par la chaleur, un produit chimique, l'électricité ou les radiations. Sa gravité dépend de ==la profondeur, la surface, la localisation et le terrain==."},
  {t:"schema",n:"02",h:"La profondeur",chip:"Profondeur",k:"peau"}],
 [{t:"table",n:"03",h:"Reconnaître le degré",chip:"Degrés",rows:[["1er degré","rougeur douloureuse, guérit seule en quelques jours"],["2e superficiel","phlyctènes (cloques), très douloureux, fond rose"],["2e profond","peu douloureux, fond blanchâtre, cicatrice"],["3e degré","indolore, aspect cartonné, blanc ou noir : greffe souvent nécessaire"]]},
  {t:"schema",n:"04",h:"La surface",chip:"Surface",k:"wallace"}],
 [{t:"signes",n:"05",h:"Signes de gravité",chip:"Gravité",e:"Alerte",items:["Surface étendue (plus de 10 % chez l'adulte)","Visage, mains, pieds, périnée, plis","Brûlure circulaire d'un membre","Inhalation de fumées : voix rauque, toux, suies","Brûlure électrique ou chimique","Enfant, personne âgée"]},
  {t:"etapes",n:"06",h:"Les premiers gestes",chip:"Premiers gestes",items:["**Refroidir** à l'eau tempérée (règle des 15 : eau vers 15 °C, à 15 cm, pendant 15 minutes), sauf brûlure étendue.","Retirer bijoux et vêtements **non collés**.","**Ne rien appliquer** : ni corps gras, ni dentifrice.","**Couvrir** d'un linge propre ou d'un champ stérile.","**Alerter** selon la gravité, prévenir l'hypothermie."]}],
 [{t:"liste",n:"07",h:"Prise en charge et surveillance",chip:"Soins",items:["**Douleur** : évaluation et antalgiques, surtout avant les pansements","**Pansements** en asepsie stricte, selon le protocole","Risque d'**hypovolémie** pour les brûlures étendues : perfusion, diurèse horaire","Risque **infectieux** : surveillance de la température et des plaies","**Nutrition** enrichie : les besoins augmentent beaucoup","Vérifier la **vaccination antitétanique**"]},
  {t:"retenir",txt:"Toute brûlure du **visage avec inhalation de fumées** menace les voies aériennes, même si le patient respire bien au début : **alerte immédiate**."}]
]),
X("tc","patho","Traumatologie","Le traumatisme crânien","2.4 4.3|B.1 B.3","eye",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"Un traumatisme crânien est un **choc sur la tête** qui peut atteindre le cerveau. Le danger vient souvent d'un **saignement à l'intérieur du crâne** qui se constitue en quelques heures et augmente la ==pression intracrânienne==."},
  {t:"valeurs",n:"02",h:"Gravité selon Glasgow",chip:"Gravité",rows:[["Léger","Glasgow","13–15","green"],["Modéré","Glasgow","9–12","amber"],["Grave","Glasgow","≤ 8","coral"]]}],
 [{t:"table",n:"03",h:"Les lésions possibles",chip:"Lésions",rows:[["Hématome extradural","saignement rapide : le patient peut aller bien puis s'aggraver (intervalle libre)"],["Hématome sous-dural","plus lent, fréquent chez l'âgé sous anticoagulant"],["Contusion","« bleu » du cerveau"],["Œdème cérébral","gonflement du cerveau"]]},
  {t:"signes",n:"04",h:"Signes d'hypertension intracrânienne",chip:"HTIC",e:"Urgence",items:["Céphalées qui augmentent","Vomissements en jet","Somnolence, Glasgow qui baisse","Pupilles inégales","Bradycardie avec tension qui monte","Convulsions"]}],
 [{t:"etapes",n:"05",h:"Surveillance infirmière",chip:"Surveillance",items:["**Glasgow et pupilles** à la fréquence prescrite, souvent toutes les heures au début.","**Constantes** : PA, FC, FR, température, SpO₂.","Recherche d'un **déficit** d'un côté.","**Tête surélevée** à 30° si prescrit, axe tête-cou-tronc respecté.","Signaler toute **aggravation**, même légère."]},
  {t:"info",txt:"Si un traumatisme du **rachis cervical** est possible : collier cervical et mobilisation en bloc jusqu'à l'avis médical."}],
 [{t:"liste",n:"06",h:"Consignes de retour à domicile",chip:"Retour à domicile",items:["Une personne doit rester présente les premières 24 h","Revenir aux urgences si : vomissements répétés, maux de tête qui augmentent, somnolence anormale, confusion, faiblesse d'un membre, convulsions","Pas d'alcool ni de somnifères","Repos, retour progressif aux écrans et au sport"]},
  {t:"retenir",txt:"Un patient **sous anticoagulant** qui s'est cogné la tête doit être signalé au médecin même s'il va bien : l'hématome peut apparaître **des heures plus tard**."}]
])
);
FX.push(
X("depression","patho","Psychiatrie","La dépression et le risque suicidaire","2.6 4.2|B.1 D.1","face",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"La dépression (épisode dépressif caractérisé) est un **trouble de l'humeur** qui dure **au moins deux semaines**, avec une ==tristesse ou une perte d'intérêt et de plaisir== presque permanentes, qui retentissent sur la vie quotidienne. Ce n'est ni de la faiblesse ni de la paresse."},
  {t:"liste",n:"02",h:"Les signes",chip:"Signes",two:true,items:["Tristesse, pleurs","Perte de plaisir (anhédonie)","Fatigue, ralentissement","Troubles du sommeil","Perte ou excès d'appétit","Culpabilité, dévalorisation","Difficultés de concentration","Idées de mort, idées suicidaires"]}],
 [{t:"info",txt:"**Chez la personne âgée**, la dépression se cache souvent derrière des plaintes physiques, un repli, un refus de manger ou des troubles de mémoire."},
  {t:"cols",n:"03",h:"Les traitements",chip:"Traitements",cols:[{h:"Antidépresseurs",tone:"blue",items:["Effet après 2 à 4 semaines","Au début, l'énergie revient avant l'humeur : risque suicidaire accru","Ne pas arrêter brutalement"]},{h:"Autres",tone:"green",items:["Psychothérapie","Activité, lien social","Hospitalisation si danger","Électroconvulsivothérapie dans les formes sévères"]}]}],
 [{t:"table",n:"04",h:"Évaluer le risque suicidaire : RUD",chip:"RUD",rows:[["**R**isque","facteurs : antécédents de tentative, isolement, alcool, maladie, deuil"],["**U**rgence","projet précis, date fixée, préparatifs, lettres"],["**D**angerosité","moyen choisi et accès à ce moyen"]]},
  {t:"etapes",n:"05",h:"Face à des idées suicidaires",chip:"Conduite à tenir",items:["**Poser la question directement** : « Avez-vous des idées de mort ? Avez-vous pensé à comment ? »","**Écouter** sans juger ni minimiser.","**Ne pas promettre le secret** : on explique qu'on doit transmettre pour l'aider.","**Transmettre immédiatement** au médecin et à l'équipe.","**Sécuriser** l'environnement selon le protocole : objets dangereux, médicaments, fenêtres."]}],
 [{t:"trace",n:"06",h:"Traçabilité : toujours noter",chip:"Traçabilité",items:["Propos exacts du patient","Heure","Évaluation RUD","Personnes prévenues","Mesures prises","Surveillance prévue"]},
  {t:"retenir",txt:"Parler du suicide **n'augmente pas** le risque, cela le diminue. Le **3114** est le numéro national de prévention du suicide, joignable jour et nuit, pour les patients, les proches et les soignants."}]
]),
X("schizophrenie","patho","Psychiatrie","La schizophrénie","2.6|B.1","eye",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"La schizophrénie est un **trouble psychotique chronique**, qui débute souvent chez l'adulte jeune. Elle modifie la perception de la réalité, la pensée et les relations. Le patient n'a pas toujours conscience d'être malade : c'est l'==anosognosie==."},
  {t:"cols",n:"02",h:"Les trois groupes de symptômes",chip:"Symptômes",cols:[{h:"Positifs",tone:"coral",items:["Idées délirantes (persécution, influence)","Hallucinations, surtout auditives"]},{h:"Négatifs",tone:"blue",items:["Retrait social","Émoussement des émotions","Perte d'élan, apragmatisme","Pauvreté du discours"]}]},
  {t:"info",blue:true,txt:"**Désorganisation** : discours incohérent, comportements bizarres, émotions qui ne correspondent pas à la situation."}],
 [{t:"etapes",n:"03",h:"Face à un patient qui délire",chip:"Attitude",items:["Rester **calme**, à distance respectueuse.","**Ne pas argumenter** contre le délire, ni y adhérer.","Reconnaître l'**émotion** : « Je vois que vous avez peur. »","Ramener doucement à la **réalité** du moment.","Repérer les signes d'**agitation** et le risque de passage à l'acte."]},
  {t:"table",n:"04",h:"Les soins sans consentement",chip:"Cadre légal",rows:[["À la demande d'un tiers","un proche fait la demande, deux certificats médicaux"],["En cas de péril imminent","sans tiers, un certificat médical"],["Sur décision du préfet","quand la sûreté des personnes est compromise"]],note:"Le juge contrôle la mesure. Le patient garde des droits, qui lui sont expliqués."}],
 [{t:"liste",n:"05",h:"Rôle infirmier",chip:"Rôle infirmier",items:["Construire une **relation de confiance** dans la durée","Surveiller l'**observance** et les effets des neuroleptiques","Surveillance **somatique** : poids, glycémie, tension, transit","Évaluer le **risque suicidaire**, plus élevé dans cette maladie","Activités thérapeutiques, réinsertion, lien avec la famille"]},
  {t:"retenir",txt:"Les patients atteints de schizophrénie sont bien plus souvent **victimes** que violents. L'**arrêt du traitement** est la première cause de rechute : l'éducation et la relation sont au cœur des soins."}]
]),
X("bipolaire","patho","Psychiatrie","Le trouble bipolaire","2.6 2.11|B.1","face",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"Le trouble bipolaire est un **trouble de l'humeur** qui alterne des épisodes ==maniaques== (ou hypomaniaques) et des épisodes ==dépressifs==, séparés par des périodes où l'humeur est normale."},
  {t:"cols",n:"02",h:"Les deux pôles",chip:"Manie et dépression",cols:[{h:"Épisode maniaque",tone:"coral",items:["Euphorie ou irritabilité","Besoin de sommeil réduit","Parle vite, idées qui fusent","Idées de grandeur","Dépenses, conduites à risque"]},{h:"Épisode dépressif",tone:"blue",items:["Tristesse, perte de plaisir","Ralentissement","Culpabilité","Idées suicidaires"]}]}],
 [{t:"table",n:"03",h:"Les thymorégulateurs",chip:"Traitements",rows:[["Lithium","efficace mais marge étroite : lithiémie régulière"],["Valproate","contre-indiqué chez la femme en âge de procréer sauf conditions strictes"],["Autres","certains antiépileptiques et antipsychotiques"]]},
  {t:"signes",n:"04",h:"Surdosage en lithium",chip:"Lithium",e:"Alerte",items:["Tremblements importants","Diarrhée, vomissements","Somnolence, confusion","Troubles de la marche"]},
  {t:"info",txt:"**Favorisent le surdosage** : déshydratation, fièvre, régime sans sel, diurétiques, AINS. Le patient doit boire suffisamment et garder une alimentation normalement salée."}],
 [{t:"liste",n:"05",h:"Rôle infirmier en phase maniaque",chip:"Rôle infirmier",items:["Limiter les **stimulations** : chambre calme, peu de visites","Préserver le **sommeil**","Veiller à l'**alimentation et l'hydratation**, souvent négligées","Protéger le patient : dépenses, décisions importantes, conduites à risque","Cadre clair, ton calme, sans entrer en conflit"]},
  {t:"retenir",txt:"Le moment le plus dangereux est souvent le **passage d'une phase à l'autre**, ou la sortie d'une dépression : le risque suicidaire doit être réévalué à chaque changement."}]
]),
X("addictions","patho","Psychiatrie","Les addictions","2.6 4.6|B.1 C.1","alert",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"Une addiction est une **perte de contrôle** de la consommation d'un produit ou d'un comportement, qui continue malgré ses conséquences négatives. Elle associe une envie irrépressible, le ==craving==, et souvent une dépendance physique."},
  {t:"liste",n:"02",h:"Produits et comportements",chip:"Produits",two:true,items:["Alcool","Tabac","Cannabis","Opioïdes (héroïne, médicaments)","Cocaïne, stimulants","Médicaments (benzodiazépines)","Jeux d'argent","Écrans"]}],
 [{t:"signes",n:"03",h:"Sevrage alcoolique",chip:"Sevrage alcool",e:"À surveiller",items:["Sueurs","Tremblements","Agitation, anxiété","Tachycardie, hypertension","Nausées","Insomnie"]},
  {t:"etapes",n:"04",h:"Prévenir les complications du sevrage",chip:"Prévention",items:["Surveiller avec une **échelle** (Cushman, par exemple) à la fréquence prescrite.","**Hydrater** le patient.","**Vitamine B1** selon prescription, avant tout apport de sucre.","**Benzodiazépines** selon le protocole, adaptées au score.","Environnement calme, éclairé, rassurant."]}],
 [{t:"cols",n:"05",h:"Les urgences",chip:"Urgences",cols:[{h:"Delirium tremens",tone:"coral",items:["Confusion, hallucinations","Fièvre, sueurs","Agitation intense","Urgence vitale"]},{h:"Surdose d'opioïdes",tone:"coral",items:["Somnolence, coma","Respiration lente","Pupilles en tête d'épingle","Antidote : naloxone"]}]},
  {t:"table",n:"06",h:"Les aides au sevrage",chip:"Traitements",rows:[["Tabac","substituts nicotiniques : patch, gomme, inhaleur"],["Opioïdes","traitements de substitution : méthadone, buprénorphine"],["Alcool","accompagnement, médicaments pour réduire l'envie"]]}],
 [{t:"liste",n:"07",h:"Posture infirmière",chip:"Posture",items:["Attitude **sans jugement**","**Entretien motivationnel** : faire émerger les raisons de changer","Réduction des risques : matériel stérile, naloxone, informations","Orienter vers une consultation spécialisée (addictologie, CSAPA)"]},
  {t:"retenir",txt:"À l'hôpital, un sevrage alcoolique **non repéré** peut évoluer vers un delirium tremens. Questionner chaque patient sur sa consommation à l'entrée fait partie du recueil de données."}]
]),
X("occlusion","patho","Digestif","L'occlusion intestinale","2.8|B.1 B.3","alert",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"L'occlusion intestinale est un **arrêt du transit** : les matières et les gaz ne progressent plus dans l'intestin. Le contenu s'accumule en amont. C'est une ==urgence médico-chirurgicale==."},
  {t:"schema",n:"02",h:"Ce qui se passe",chip:"Schéma",k:"occlusion"}],
 [{t:"cols",n:"03",h:"Les causes",chip:"Causes",cols:[{h:"Mécanique",tone:"coral",items:["Tumeur du côlon","Bride (adhérence après chirurgie)","Hernie étranglée","Volvulus (torsion)","Fécalome"]},{h:"Fonctionnelle",tone:"blue",items:["Iléus après chirurgie","Médicaments (morphine)","Troubles du potassium","Infection abdominale"]}]},
  {t:"signes",n:"04",h:"Les quatre signes",chip:"Signes",items:["Douleurs abdominales","Vomissements","Arrêt des matières et des gaz","Ventre gonflé (météorisme)"]}],
 [{t:"etapes",n:"05",h:"Prise en charge",chip:"Prise en charge",items:["**À jeun** strict.","Pose d'une **sonde nasogastrique** en aspiration selon prescription.","**Perfusion** pour réhydrater et corriger les ions.","**Antalgiques** selon prescription.","**Scanner** abdominal ; chirurgie si l'intestin souffre (strangulation)."]},
  {t:"liste",n:"06",h:"Surveillance infirmière",chip:"Surveillance",items:["Douleur, aspect du ventre","**Liquide d'aspiration** : volume et aspect, à noter","Constantes, température","**Diurèse** et bilan entrées-sorties","Reprise des **gaz** : signe d'amélioration","Soins de bouche et de narine (sonde)"]}],
 [{t:"signes",n:"07",h:"Signes d'aggravation",chip:"Aggravation",e:"Urgence",items:["Ventre dur comme du bois","Fièvre","Tachycardie, hypotension","Douleur qui change ou s'intensifie"]},
  {t:"retenir",txt:"Un ventre **dur et très douloureux** avec fièvre évoque une **péritonite** : urgence chirurgicale, on alerte immédiatement."}]
]),
X("cancer","patho","Oncologie","Le cancer : les notions clés","2.9 4.6|B.1 C.1","tube",[
 [{t:"def",n:"01",h:"Définition",chip:"Définition",txt:"Un cancer est une **prolifération anarchique de cellules** anormales qui envahissent les tissus voisins et peuvent migrer à distance pour former des ==métastases==. Une tumeur bénigne, elle, reste limitée et ne métastase pas."},
  {t:"table",n:"02",h:"La classification TNM",chip:"TNM",rows:[["**T** (tumeur)","taille et extension de la tumeur"],["**N** (ganglions)","atteinte des ganglions lymphatiques"],["**M** (métastases)","présence ou non de métastases"]],note:"Elle guide le traitement et le pronostic."}],
 [{t:"liste",n:"03",h:"Facteurs de risque",chip:"Facteurs de risque",two:true,items:["Tabac","Alcool","Soleil, UV","Surpoids, sédentarité","Âge","Hérédité","Expositions professionnelles","Certains virus (HPV)"]},
  {t:"table",n:"04",h:"Les dépistages organisés",chip:"Dépistage",rows:[["Sein","mammographie tous les 2 ans, de 50 à 74 ans"],["Côlon-rectum","test de recherche de sang dans les selles tous les 2 ans, de 50 à 74 ans"],["Col de l'utérus","de 25 à 65 ans : frottis puis test HPV"]],note:"Modalités à vérifier, elles évoluent avec les recommandations."}],
 [{t:"table",n:"05",h:"Les traitements",chip:"Traitements",rows:[["Chirurgie","retirer la tumeur"],["Radiothérapie","rayons ciblés ; soins de peau de la zone"],["Chimiothérapie","médicaments cytotoxiques"],["Immunothérapie, thérapies ciblées","agissent sur le système immunitaire ou une anomalie précise"],["Hormonothérapie","certains cancers du sein, de la prostate"]],note:"Les décisions sont prises en réunion de concertation pluridisciplinaire (RCP)."},
  {t:"etapes",n:"06",h:"Le dispositif d'annonce",chip:"Annonce",items:["**Temps médical** : annonce du diagnostic et proposition de traitement.","**Temps d'accompagnement soignant** : l'infirmier reformule, écoute, informe, repère les besoins.","**Soins de support** : douleur, nutrition, psychologue, assistante sociale, activité physique.","**Lien avec la ville** : médecin traitant, infirmier libéral."]}],
 [{t:"retenir",txt:"Après une annonce, le patient retient souvent **peu de chose**. Le temps infirmier sert à **reformuler**, répondre aux questions et repérer la détresse. On peut aussi accueillir un proche."}]
])
);

/* ---------- Cours complets ---------- */
const CV=(id,cat,titre,duree,u,icon,obj,chap,ess)=>({id,cat,titre,duree,u,icon,obj,chap,ess});
/* Les cours complets (CVS) sont dans contenus/cours-data.js ; la version publiée est générée. */


FX.forEach(x=>{const i=FICHES.findIndex(f=>f.id===x.id);if(i>=0)FICHES[i]=x;else FICHES.push(x);});
{const k=FICHES.findIndex(f=>f.id==="douleur-echelles");if(k>=0)FICHES.splice(k,1);}

const norm=it=>{if(it.u){const [x,y]=it.u.split("|");it.ue={"2009":x.trim().split(/\s+/),"2026":(y||"").trim().split(/\s+/).filter(Boolean)};}return it};
[FICHES,COURS,QUIZ].forEach(l=>l.forEach(norm));

/* ---------- Générateur de calculs ---------- */
const pick=a=>a[Math.floor(Math.random()*a.length)];
const r1=x=>Math.round(x*10)/10;
const fr=x=>String(x).replace(".",",");
const GEN={
 gravite:{label:"Débit par gravité",make(){const v=pick([250,500,1000,1500]),h=pick([2,4,6,8,12,24]);const ans=Math.round(v*20/(h*60));
   return {presc:`Prescription : ${v} mL de NaCl 0,9 % sur ${h} h.<br>Perfuseur standard (1 mL = 20 gouttes).`,q:"Quel débit régler ?",unit:"gouttes/min",ans,tol:1,
    steps:[`Durée : ${h} h × 60 = ${h*60} min`,`Nombre de gouttes : ${v} × 20 = ${v*20} gouttes`,`Débit : ${v*20} ÷ ${h*60} ≈ ${fr(r1(v*20/(h*60)))}`,`Arrondi : ${ans} gouttes/min`]}}},
 pse:{label:"Pousse-seringue",make(){const tot=pick([25,50,100]),rate=pick([1,2,3,4,5]);const c=tot/50,ans=r1(rate/c);
   return {presc:`Prescription : médicament X, ${rate} mg/h au pousse-seringue électrique.<br>Seringue préparée : ${tot} mg dans 50 mL.`,q:"Quelle vitesse programmer ?",unit:"mL/h",ans,tol:.1,
    steps:[`Concentration : ${tot} mg ÷ 50 mL = ${fr(c)} mg/mL`,`Vitesse : ${rate} mg/h ÷ ${fr(c)} mg/mL = ${fr(ans)} mL/h`]}}},
 prelever:{label:"Volume à prélever",make(){const amp=pick([[500,5],[1000,10],[40,2],[20,2],[100,2]]),frac=pick([.25,.5,.75,1,.4]);const dose=r1(amp[0]*frac),c=amp[0]/amp[1],ans=r1(dose/c);
   return {presc:`Prescription : ${fr(dose)} mg de médicament Y en IV.<br>Ampoule disponible : ${amp[0]} mg dans ${amp[1]} mL.`,q:"Quel volume prélever ?",unit:"mL",ans,tol:.05,
    steps:[`Concentration : ${amp[0]} ÷ ${amp[1]} = ${fr(c)} mg/mL`,`Volume : ${fr(dose)} ÷ ${fr(c)} = ${fr(ans)} mL`]}}},
 pedia:{label:"Dose au poids",make(){const kg=pick([8,10,12,14,15,18,20,24]),mgkg=pick([10,15,20]),conc=pick([20,25,50]);const dose=kg*mgkg,ans=r1(dose/conc);
   return {presc:`Enfant de ${kg} kg. Prescription : ${mgkg} mg/kg par prise.<br>Solution buvable dosée à ${conc} mg/mL.`,q:"Quel volume administrer par prise ?",unit:"mL",ans,tol:.1,
    steps:[`Dose : ${kg} kg × ${mgkg} mg/kg = ${dose} mg`,`Volume : ${dose} ÷ ${conc} = ${fr(ans)} mL`]}}},
 micro:{label:"Perfuseur de précision",make(){const v=pick([50,100,250,500]),h=pick([1,2,4,6,8,12]);const ans=Math.round(v*60/(h*60));
   return {presc:`Prescription : ${v} mL de G5 % sur ${h} h.<br>Perfuseur de précision (1 mL = 60 gouttes).`,q:"Quel débit régler ?",unit:"gouttes/min",ans,tol:1,
    steps:[`Durée : ${h} h × 60 = ${h*60} min`,`Nombre de gouttes : ${v} × 60 = ${v*60} gouttes`,`Débit : ${v*60} ÷ ${h*60} ≈ ${fr(r1(v*60/(h*60)))}`,`Astuce : avec ce perfuseur, gouttes/min = mL/h. Réponse : ${ans}`]}}},
 duree:{label:"Durée de perfusion",make(){const g=pick([14,21,28,35,42]),v=pick([500,1000]);const min=v*20/g,ans=r1(min/60);
   return {presc:`Une poche de ${v} mL passe à ${g} gouttes/min.<br>Perfuseur standard (1 mL = 20 gouttes).`,q:"Combien d'heures durera la perfusion ? (arrondi au dixième)",unit:"h",ans,tol:.1,
    steps:[`Nombre de gouttes : ${v} × 20 = ${v*20} gouttes`,`Durée : ${v*20} ÷ ${g} ≈ ${fr(r1(min))} min`,`En heures : ${fr(r1(min))} ÷ 60 ≈ ${fr(ans)} h`]}}},
 dilution:{label:"Dilution",make(){const dose=pick([100,200,250,500,1000]),vol=pick([10,20,50]);const c=r1(dose/vol),want=pick([.2,.4,.5]);const wd=r1(dose*want),ans=r1(wd/(dose/vol));
   return {presc:`Vous diluez ${dose} mg de médicament Z dans ${vol} mL de NaCl 0,9 %.<br>Prescription : ${fr(wd)} mg.`,q:"Quel volume de la solution administrer ?",unit:"mL",ans,tol:.1,
    steps:[`Concentration : ${dose} ÷ ${vol} = ${fr(c)} mg/mL`,`Volume : ${fr(wd)} ÷ ${fr(c)} = ${fr(ans)} mL`]}}},
 pourcent:{label:"Pourcentages",make(){const sol=pick([["G5 %",5,"glucose"],["G10 %",10,"glucose"],["NaCl 0,9 %",.9,"NaCl"]]),v=pick([100,250,500,1000]);const ans=r1(sol[1]*v/100);
   return {presc:`Poche de ${sol[0]}, volume ${v} mL.`,q:`Combien de grammes de ${sol[2]} contient-elle ?`,unit:"g",ans,tol:.05,
    steps:[`${sol[0]} = ${fr(sol[1])} g pour 100 mL`,`${fr(sol[1])} × ${v} ÷ 100 = ${fr(ans)} g`]}}}
};
