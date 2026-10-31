/* Carnet IFSI — contenus pédagogiques (catégories, UE, fiches, cours, quiz, stages, générateur de calculs).
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
 C("Se tester (quiz, fiche cachée) est plus efficace que relire. C'est le principe de la mémorisation active.")),
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
const COURS=[
 CO("raisonnement","situ","Le raisonnement clinique","12 min","3.1 5.2|A.1",[
  ["Pourquoi c'est central","Le raisonnement clinique permet de passer d'une liste de soins à une prise en charge pensée pour un patient précis. C'est ce qui est évalué en stage et dans les analyses de situation."],
  ["1. Recueil de données","Rassembler les informations utiles : dossier, transmissions, entretien, observation. Le modèle des 14 besoins fondamentaux de Virginia Henderson aide à ne rien oublier."],
  ["2. Analyse","Repérer les besoins perturbés et relier les données entre elles. On distingue ce qui relève du rôle propre de l'infirmier de ce qui relève du rôle prescrit."],
  ["3. Problèmes et diagnostics","Formuler les problèmes de santé réels ou potentiels, avec leurs causes et leurs signes. Un risque (de chute, d'escarre, d'infection) est aussi un problème à traiter."],
  ["4. Objectifs","Pour chaque problème, un objectif centré sur le patient, mesurable et daté. Exemple : « Le patient évalue sa douleur à 3/10 ou moins d'ici 24 h »."],
  ["5. Actions","Les soins et surveillances qui répondent aux objectifs, en précisant qui, quoi, quand et comment."],
  ["6. Évaluation","Vérifier si l'objectif est atteint, puis ajuster. La démarche est un cycle, pas un document figé."]]),
 CO("projet-soins","situ","Le projet de soins","9 min","3.2|A.1",[
  ["Définition","Le projet de soins rassemble les objectifs et les actions de soins pour un patient, en tenant compte de son projet de vie. Il est construit avec le patient et l'équipe."],
  ["Les sources","Le recueil de données, la macrocible, les prescriptions, l'avis des autres professionnels (kiné, diététicien, assistante sociale) et surtout les souhaits du patient."],
  ["La planification","Le plan de soins fixe qui fait quoi et quand. Il évite les oublis et répartit le travail entre infirmier et aide-soignant."],
  ["Le projet de sortie","Il commence dès l'entrée : qui sera à domicile, quelles aides, quel matériel, quel suivi. Une sortie mal préparée augmente le risque de réhospitalisation."]]),
 CO("transmissions","role","Les transmissions ciblées","7 min","3.3 5.3|D.1",[
  ["À quoi elles servent","Assurer la continuité des soins entre équipes et garder une trace écrite qui engage la responsabilité de l'infirmier."],
  ["La méthode DAR","Une cible (le problème), puis les Données observées, les Actions réalisées et les Résultats obtenus."],
  ["Exemple","Cible : douleur. D : patient grimaçant, EVA 7/10 au niveau de la cicatrice. A : antalgique administré selon prescription, installation au calme. R : EVA 3/10 une heure après."],
  ["Les transmissions orales","La méthode SAED (Situation, Antécédents, Évaluation, Demande) structure un appel au médecin et évite les oublis."],
  ["Les pièges","Écrire des jugements (« patient pénible ») au lieu de faits observables, oublier l'heure, ne pas tracer le résultat."]]),
 CO("insuline","thera","L'insulinothérapie","10 min","2.11 4.4|B.1 B.3",[
  ["Les grandes familles","Les insulines rapides couvrent les repas, les insulines lentes couvrent les besoins de base sur environ 24 h. Certains patients ont un schéma basal-bolus combinant les deux.",{k:"insuline",cap:"La lente couvre les besoins de base, les rapides couvrent chaque repas."}],
  ["Avant l'injection","Contrôler la glycémie capillaire, vérifier la prescription et l'horaire par rapport au repas. Vérifier le type d'insuline et la date d'ouverture du stylo."],
  ["L'injection","Voie sous-cutanée. Sites : abdomen, cuisses, bras, fesses. Faire tourner les points d'injection pour éviter les lipodystrophies, qui perturbent l'absorption.",{k:"sites"}],
  ["Surveillance","Signes d'hypoglycémie et d'hyperglycémie, état des sites d'injection, prise alimentaire. Tout repas non pris doit être signalé avant une insuline rapide."],
  ["Éducation du patient","Autonomie sur les injections, adaptation des doses selon le protocole, resucrage, conduite à tenir en cas de maladie."]]),
 CO("antalgie","thera","Douleur et antalgiques","11 min","2.11 4.4|B.1 B.3",[
  ["Types de douleur","La douleur par excès de nociception (fracture, plaie) répond bien aux antalgiques classiques. La douleur neuropathique (brûlures, décharges électriques) nécessite d'autres traitements."],
  ["Évaluer","Échelle adaptée au patient : EVA ou EN s'il communique, Algoplus ou Doloplus chez la personne âgée qui ne peut pas s'exprimer. On évalue avant et après chaque traitement.",{k:"eva"}],
  ["Les paliers de l'OMS","Palier 1 : paracétamol, AINS. Palier 2 : tramadol, codéine. Palier 3 : morphine et opioïdes forts. On peut associer un palier 1 à un palier 2 ou 3.",{k:"paliers"}],
  ["Surveiller la morphine","Fréquence respiratoire, niveau de sédation, nausées, constipation (laxatif associé), rétention urinaire. Une somnolence qui augmente précède souvent la dépression respiratoire."],
  ["Moyens non médicamenteux","Installation, froid ou chaud selon l'indication, distraction, relaxation, présence rassurante."]]),
 CO("pharmaco-c","thera","Les bases de la pharmacologie","14 min","2.11|B.1",[
  ["Pourquoi c'est essentiel","L'infirmier administre et surveille les médicaments. Comprendre comment ils agissent permet d'anticiper leurs effets, de repérer un surdosage et d'expliquer le traitement au patient."],
  ["Le trajet du médicament","Une fois administré, le médicament est absorbé, distribué dans l'organisme, transformé (surtout par le foie) puis éliminé (surtout par les reins). C'est la pharmacocinétique, résumée par le sigle ADME.",{k:"adme"}],
  ["La voie change tout","En IV, la totalité de la dose arrive directement dans le sang : l'effet est immédiat. Par voie orale, une partie est transformée par le foie avant d'atteindre le sang : c'est l'effet de premier passage. C'est pour cela qu'une dose orale et une dose IV d'un même médicament sont souvent différentes."],
  ["La demi-vie","C'est le temps nécessaire pour que la concentration du médicament dans le sang diminue de moitié. Elle conditionne le rythme des prises : un médicament à demi-vie courte se donne plusieurs fois par jour. Il faut environ cinq demi-vies pour atteindre un état d'équilibre, ou pour éliminer presque totalement le produit après l'arrêt."],
  ["La fenêtre thérapeutique","Entre la dose qui n'agit pas et la dose toxique se trouve la zone efficace. Pour certains médicaments, cette zone est étroite : AVK, lithium, digoxine, aminosides, vancomycine. On les surveille par des dosages sanguins, prélevés à des moments précis.",{k:"fenetre",cap:"Pic après l'administration, résiduel juste avant la dose suivante."}],
  ["Effets indésirables et pharmacovigilance","Tout médicament peut avoir des effets indésirables. L'infirmier les repère, les signale au médecin et les trace. Les effets graves ou inattendus se déclarent à la pharmacovigilance, ce que tout professionnel de santé peut faire."],
  ["Les patients fragiles","La personne âgée, l'insuffisant rénal ou hépatique, l'enfant et la femme enceinte éliminent ou tolèrent différemment les médicaments. Les doses sont souvent adaptées, et la surveillance renforcée."]]),
 CO("diabete-c","patho","Le diabète","13 min","2.7 4.6|B.1 C.1",[
  ["Deux maladies différentes","Dans le diabète de type 1, le pancréas ne produit plus d'insuline : le traitement par insuline est vital. Dans le type 2, l'insuline agit mal ; le traitement commence par l'hygiène de vie, puis des médicaments, parfois l'insuline."],
  ["Les complications aiguës","Hypoglycémie (sous 0,70 g/L) et décompensations hyperglycémiques, comme l'acidocétose dans le type 1."],
  ["Les complications chroniques","Atteinte des yeux (rétinopathie), des reins (néphropathie), des nerfs (neuropathie), des artères (infarctus, AVC, artérite). Le pied diabétique combine neuropathie et mauvaise circulation."],
  ["Le suivi","HbA1c tous les 3 mois, fond d'œil, bilan rénal, examen des pieds, suivi cardiovasculaire."],
  ["Le rôle infirmier","Glycémies capillaires, administration des traitements, surveillance des pieds, éducation thérapeutique : alimentation, activité, gestion des hypoglycémies."]]),
 CO("avc-c","patho","L'AVC","10 min","2.8 4.3|B.1 B.3",[
  ["Deux mécanismes","L'AVC ischémique est dû à un caillot qui bouche une artère du cerveau. L'AVC hémorragique est dû à un saignement. Seule l'imagerie permet de les distinguer.",{k:"avc"}],
  ["Reconnaître","Le réflexe VITE : Visage, Inertie d'un membre, Trouble de la parole, En urgence le 15. Noter l'heure du début des signes."],
  ["Les premières heures","Une désobstruction de l'artère est possible dans un délai court, d'où l'urgence. Le patient est à jeun jusqu'à l'évaluation de la déglutition."],
  ["Surveillance infirmière","Conscience, déficit, constantes, glycémie, déglutition. Prévention des escarres, des fausses routes et des chutes."],
  ["Rééducation","Kinésithérapie, orthophonie, ergothérapie commencent tôt. L'infirmier favorise l'autonomie dans les gestes du quotidien."]]),
 CO("sca-c","patho","La douleur thoracique","9 min","2.8 4.3|B.1 B.3",[
  ["Les causes graves à éliminer","Infarctus du myocarde, embolie pulmonaire, dissection aortique. Toute douleur thoracique est grave jusqu'à preuve du contraire.",{k:"artere",cap:"L'infarctus : une plaque d'athérome se rompt et un caillot bouche l'artère coronaire."}],
  ["Les premiers gestes","Repos strict, ECG dans les 10 minutes, constantes, appel du médecin. Ne pas laisser le patient seul."],
  ["Ce qu'on recherche","Type de douleur, heure de début, irradiation, facteurs de risque (tabac, diabète, hypertension, cholestérol, hérédité)."],
  ["Après l'infarctus","Surveillance scope, traitement antiagrégant et anticoagulant, éducation : arrêt du tabac, activité physique adaptée, observance."]]),
 CO("ecg-c","exam","Lire un ECG simplement","15 min","4.4 2.2|B.3 B.1",[
  ["Ce que montre l'ECG","L'activité électrique du cœur. L'onde P correspond aux oreillettes, le QRS aux ventricules, l'onde T à leur récupération."],
  ["Le rythme","Rythme sinusal : chaque QRS est précédé d'une onde P, à intervalles réguliers."],
  ["La fréquence","Sur un tracé à 25 mm/s, on divise 300 par le nombre de grands carreaux entre deux QRS."],
  ["Ce qui doit alerter","Rythme irrégulier, fréquence très lente ou très rapide, modification du segment ST chez un patient qui a mal à la poitrine. L'infirmier alerte, le médecin interprète."]]),
 CO("chimio-c","thera","Accompagner une chimiothérapie","12 min","2.9 2.11|B.1 B.3",[
  ["Avant la cure","Vérifier le bilan sanguin et le feu vert médical, l'état général, la voie veineuse (souvent une chambre implantable).",{k:"pac"}],
  ["Pendant","Respect strict du protocole et des débits, surveillance du point de ponction pour éviter l'extravasation, prévention des nausées."],
  ["Après","Le patient doit connaître les signes qui imposent d'appeler : fièvre, saignements, diarrhée importante, impossibilité de boire.",{k:"nadir",cap:"Le risque infectieux est maximal au nadir, souvent entre J7 et J14."}],
  ["Accompagner","Fatigue, image de soi, peur de la récidive : l'écoute et l'orientation (psychologue, socio-esthétique, associations) font partie du soin."]]),
 CO("palliatif-c","soins","Soins palliatifs et fin de vie","14 min","4.7 1.3|B.3 A.2",[
  ["La philosophie","Soulager, accompagner, respecter la dignité. Il ne s'agit ni d'accélérer ni de retarder la mort."],
  ["Les symptômes","Douleur, dyspnée, encombrement, nausées, angoisse, confusion. Chaque symptôme est évalué et traité."],
  ["Le confort","Soins de bouche, changements de position doux, soins de peau. On arrête les soins qui n'apportent plus de confort."],
  ["Le cadre légal","Loi Claeys-Leonetti de 2016 : refus de l'obstination déraisonnable, directives anticipées, sédation profonde et continue dans certaines situations."],
  ["Les proches","Les informer, les accueillir, leur proposer de participer aux soins s'ils le souhaitent. Le deuil commence souvent avant le décès."]]),
 CO("relation-c","role","La relation soignant-soigné","10 min","4.2 1.1|D.1 B.2",[
  ["Les bases","La relation de soin est asymétrique : le patient est vulnérable. Le soignant garde une juste distance, ni trop froide ni trop proche."],
  ["Les outils","Écoute active, reformulation, questions ouvertes, silences, attention au non-verbal."],
  ["L'entretien d'aide","Selon Carl Rogers : empathie, congruence, considération positive inconditionnelle. Le but est d'aider la personne à trouver ses propres ressources."],
  ["Les situations difficiles","Agressivité, refus de soin, annonce d'une mauvaise nouvelle. On reconnaît l'émotion, on ne la combat pas."]]),
 CO("escarres-c","soins","Prévenir et soigner les escarres","9 min","4.1|B.3",[
  ["Facteurs de risque","Immobilité, dénutrition, incontinence, troubles de la sensibilité, âge avancé. L'évaluation se fait avec une échelle validée, comme Braden ou Norton."],
  ["Prévention","Changements de position réguliers, matelas adapté, protection des zones d'appui (talons, sacrum, ischions), hydratation de la peau, apport nutritionnel suffisant."],
  ["Stades","Du stade 1 (rougeur persistante, peau intacte) au stade 4 (atteinte des muscles ou de l'os). Le stade guide le choix du pansement."],
  ["Traçabilité","Décrire la plaie à chaque réfection : taille, aspect, exsudat, odeur, douleur."]]),
 CO("respi-c","anat","Le système respiratoire","10 min","2.2|B.1",[
  ["Le trajet de l'air","Fosses nasales, pharynx, larynx, trachée, bronches, bronchioles puis alvéoles, où se font les échanges gazeux."],
  ["La mécanique","À l'inspiration, le diaphragme se contracte et descend : l'air entre. L'expiration au repos est passive."],
  ["Les échanges","L'oxygène passe des alvéoles vers le sang, le CO₂ passe du sang vers les alvéoles pour être rejeté."],
  ["Les repères cliniques","FR normale de 12 à 20 par minute, SpO₂ de 95 à 100 %. Tirage, cyanose ou difficulté à parler sont des signes de détresse."]]),
 CO("hygiene-c","soins","Prévenir les infections associées aux soins","11 min","2.10 4.5|B.4",[
  ["L'enjeu","Une partie importante des infections associées aux soins est évitable. Les mains des soignants sont le premier vecteur de transmission."],
  ["Les précautions standard","Pour tous les patients : hygiène des mains, gants si contact avec du sang ou des liquides biologiques, protection en cas de projection, gestion des piquants."],
  ["Les précautions complémentaires","Selon le germe : contact, gouttelettes ou air. Elles s'ajoutent aux précautions standard."],
  ["Les dispositifs invasifs","Sondes, cathéters, drains : on les pose seulement si nécessaire et on réévalue chaque jour leur maintien."]]),
 CO("transfusion","soins","La transfusion sanguine","14 min","4.4|B.3",[],true),
 CO("pediatrie-c","patho","Les urgences de l'enfant","12 min","2.3 4.3|B.1 B.3",[],true)
];

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
const CVS=[
CV("raisonnement","situ","Le raisonnement clinique et la démarche de soins","45 min","3.1 3.2 5.2|A.1","eye",
 ["Expliquer la différence entre **raisonnement clinique** et **démarche de soins**","Réaliser un **recueil de données** structuré","Organiser ses données avec les **14 besoins** de Henderson","Formuler un **diagnostic infirmier** au format PES","Fixer des **objectifs** et planifier des actions","**Évaluer**, transmettre et présenter une situation à l'oral"],
 [
 {h:"Pourquoi raisonner ?",chip:"Pourquoi",b:[
  {t:"p",ps:["Deux patients hospitalisés pour la même pneumopathie n'ont pas les mêmes besoins. L'un vit seul, l'autre est entouré ; l'un est autonome, l'autre se déplace avec un déambulateur ; l'un a peur, l'autre veut rentrer chez lui. Le **raisonnement clinique** permet de passer d'un diagnostic médical identique à une **prise en charge infirmière personnalisée**.","Le **raisonnement clinique** est le processus mental par lequel l'infirmier recueille des informations, les interprète, en tire des hypothèses et décide des soins. La **démarche de soins** est la méthode écrite et structurée qui rend ce raisonnement visible, transmissible et évaluable."]},
  {t:"analogie",txt:"Le raisonnement clinique ressemble à une **enquête** : on rassemble des indices (les données), on les relie, on formule des hypothèses (les problèmes), on agit, puis on vérifie si l'hypothèse était juste. Un bon enquêteur ne s'arrête jamais au premier indice."},
  {t:"schema",k:"cycle",cap:"La démarche est un **cycle** : l'évaluation relance un nouveau recueil de données."},
  {t:"verif",items:[["Quelle différence entre raisonnement clinique et démarche de soins ?","Le raisonnement est le processus de pensée ; la démarche de soins est sa formalisation écrite en étapes (recueil, analyse, objectifs, actions, évaluation)."]]}]},
 {h:"Le recueil de données",chip:"Recueil",b:[
  {t:"p",ps:["Le recueil est la base de tout : un problème mal repéré sera mal traité. Il rassemble des informations **sur la personne** (et pas seulement sur sa maladie), à partir de plusieurs sources, de façon **organisée** et **objective**."]},
  {t:"table",rows:[["Le patient","source principale : entretien, observation"],["L'entourage","famille, aidants, surtout si le patient ne peut pas s'exprimer"],["Le dossier","antécédents, traitements, comptes rendus, résultats"],["L'équipe","transmissions orales et écrites, aide-soignant, médecin, kiné"],["L'examen clinique","constantes, observation de la peau, de la respiration, de la mobilité"]]},
  {t:"duo",items:[{tag:"Données objectives",tone:"blue",txt:"Ce qu'on **observe ou mesure**",sub:"« PA 92/55 », « œdème des chevilles », « mange un quart du plateau »"},{tag:"Données subjectives",tone:"coral",txt:"Ce que le patient **dit ou ressent**",sub:"« J'ai peur de ne pas rentrer chez moi », « Je n'ai pas faim »"}]},
  {t:"liste",items:["Questions **ouvertes** pour laisser parler : « Comment vous sentez-vous depuis hier ? »","Questions **fermées** pour préciser : « Avez-vous mal en respirant ? »","**Reformulation** pour vérifier qu'on a bien compris","Noter les **propos entre guillemets** plutôt que les interpréter","Observer le **non-verbal** : posture, visage, gestes"]},
  {t:"pieges",items:["Recopier le dossier médical sans rencontrer le patient","Écrire des jugements (« patient pénible », « peu coopérant ») au lieu de faits","Oublier les données **sociales** : logement, entourage, aides, projet de vie","Oublier ce qui va **bien** : les ressources du patient comptent autant que ses difficultés"]}]},
 {h:"Organiser les données avec Henderson",chip:"Henderson",b:[
  {t:"p",ps:["Pour ne rien oublier, on range les données selon un modèle. Le plus utilisé en France est celui de **Virginia Henderson**, qui décrit **14 besoins fondamentaux**. Pour chaque besoin, on cherche s'il est satisfait (**indépendance**) ou non (**dépendance**), et pourquoi.","Henderson décrit trois **sources de difficulté** : le manque de **force** (physique ou psychique), le manque de **volonté**, le manque de **connaissance**. Identifier la source oriente l'action : on ne répond pas de la même façon à un patient qui ne sait pas, qui ne peut pas ou qui ne veut pas."]},
  {t:"table",rows:[["1. Respirer","FR, SpO₂, dyspnée, toux, tabac"],["2. Boire et manger","appétit, poids, déglutition, régime, dentition"],["3. Éliminer","diurèse, transit, continence, sonde"],["4. Se mouvoir","marche, aides techniques, risque de chute"],["5. Dormir, se reposer","sommeil, fatigue, somnifères"],["6. Se vêtir","autonomie pour s'habiller"],["7. Température","fièvre, frissons, hypothermie"],["8. Être propre, protéger ses téguments","toilette, état cutané, escarres"],["9. Éviter les dangers","douleur, confusion, risque infectieux, anxiété"],["10. Communiquer","langue, audition, vision, entourage"],["11. Croyances et valeurs","religion, souhaits, directives anticipées"],["12. S'occuper, se réaliser","travail, rôle familial, estime de soi"],["13. Se recréer","loisirs, ennui à l'hôpital"],["14. Apprendre","connaissance de sa maladie, de son traitement"]]},
  {t:"exemple",h:"Un besoin analysé",ps:["**Se mouvoir** : M. R., 81 ans, marche habituellement seul avec une canne. Depuis son hospitalisation, il reste au fauteuil, dit avoir « peur de tomber » et a eu un malaise au lever hier (PA couchée 135/80, debout 105/65).","→ **Dépendance**. Sources de difficulté : **manque de force** (hypotension orthostatique, fatigue) et composante psychique (peur de chuter)."]}]},
 {h:"Analyser et poser les problèmes",chip:"Analyse",b:[
  {t:"p",ps:["Analyser, c'est **relier les données entre elles** pour leur donner un sens. Une donnée isolée (« mange peu ») ne dit pas grand-chose ; reliée à d'autres (« prothèse dentaire mal adaptée », « a perdu 4 kg en un mois », « vit seul »), elle révèle un problème et sa cause.","On distingue ensuite ce qui relève du **rôle propre** infirmier de ce qui relève de la **collaboration** avec le médecin."]},
  {t:"table",rows:[["Diagnostic infirmier réel","problème présent, que l'infirmier peut traiter de façon autonome"],["Diagnostic de risque","problème qui n'est pas encore là, mais que des facteurs rendent probable"],["Problème traité en collaboration (PTC)","complication d'une pathologie ou d'un traitement, surveillée par l'infirmier et traitée avec le médecin"]]},
  {t:"p",ps:["Un diagnostic infirmier s'écrit au format **PES** : le **P**roblème, l'**É**tiologie (« lié à ») et les **S**ignes (« se manifestant par »). Pour un risque, il n'y a pas encore de signes : on écrit seulement les facteurs de risque."]},
  {t:"exemple",h:"Formuler en PES",ps:["**Diagnostic réel** : Mobilité physique réduite **liée à** une hypotension orthostatique et à la peur de chuter, **se manifestant par** un refus de marcher et un malaise au lever.","**Diagnostic de risque** : Risque de chute **lié à** l'hypotension orthostatique, à l'âge et à l'environnement inconnu.","**PTC** : Risque de complication : hémorragie, lié au traitement anticoagulant."]},
  {t:"pieges",items:["Écrire un diagnostic médical (« pneumopathie ») à la place d'un problème infirmier","Confondre la cause et le problème","Lister vingt problèmes sans les **hiérarchiser** : on commence par ce qui menace la vie ou la sécurité"]}]},
 {h:"Fixer des objectifs",chip:"Objectifs",b:[
  {t:"p",ps:["Un objectif décrit **le résultat attendu pour le patient**, pas l'action du soignant. Il doit être centré sur le patient, **observable ou mesurable**, **réaliste**, et assorti d'un **délai**. Il est idéalement négocié avec lui."]},
  {t:"duo",items:[{tag:"Mal formulé",tone:"coral",txt:"« Surveiller la tension »",sub:"c'est une action, pas un résultat, sans délai"},{tag:"Bien formulé",tone:"green",txt:"« M. R. marche jusqu'à la salle de bains avec sa canne, sans malaise, d'ici 3 jours »",sub:"centré patient, observable, daté"}]},
  {t:"analogie",txt:"L'objectif est la **destination** sur un GPS : sans adresse précise, impossible de savoir si on est arrivé. « Aller mieux » n'est pas une adresse."}]},
 {h:"Planifier et agir",chip:"Actions",b:[
  {t:"p",ps:["Les actions sont les soins qui permettent d'atteindre l'objectif. Elles précisent **qui, quoi, quand et comment**, pour que n'importe quel collègue puisse les réaliser. Elles relèvent du rôle propre, de la prescription médicale, ou de la collaboration avec d'autres professionnels."]},
  {t:"exemple",h:"Actions pour M. R.",ps:["- Mesurer la PA couché puis debout à 1 et 3 minutes, matin et soir (IDE).","- Lever progressif : assis au bord du lit 1 minute avant de se lever (IDE, AS).","- Accompagner la marche jusqu'à la salle de bains 3 fois par jour (AS).","- Chaussures fermées, sonnette à portée, lit en position basse (équipe).","- Signaler l'hypotension au médecin pour réévaluer le traitement antihypertenseur (IDE).","- Demander l'avis du kinésithérapeute pour la peur de chuter."]}]},
 {h:"Évaluer et réajuster",chip:"Évaluation",b:[
  {t:"p",ps:["Au délai fixé, on compare la situation à l'objectif. S'il est atteint, le problème est résolu ou on fixe un nouvel objectif. S'il ne l'est pas, on cherche **pourquoi** : le problème était-il mal posé ? l'objectif irréaliste ? les actions mal adaptées ou mal réalisées ? On réajuste."]},
  {t:"exemple",h:"Évaluation à J3",ps:["M. R. marche jusqu'à la salle de bains avec sa canne et une aide, sans malaise. Il dit avoir « moins peur ». La PA debout est à 120/70 depuis l'adaptation du traitement.","→ Objectif **partiellement atteint** (aide encore nécessaire). Nouvel objectif : marcher seul avec sa canne d'ici la sortie."]}]},
 {h:"Transmettre : DAR et SAED",chip:"Transmissions",b:[
  {t:"p",ps:["Le raisonnement ne sert à rien s'il n'est pas **transmis**. À l'écrit, on utilise les **transmissions ciblées** ; à l'oral, en particulier pour appeler un médecin, la méthode **SAED**."]},
  {t:"table",rows:[["**Cible**","le problème ou l'événement (douleur, chute, refus de soin)"],["**D**onnées","ce qu'on a observé, mesuré, entendu"],["**A**ctions","ce qu'on a fait"],["**R**ésultats","l'effet obtenu, avec l'heure"]]},
  {t:"table",rows:[["**S**ituation","qui je suis, quel patient, quel problème maintenant"],["**A**ntécédents","contexte utile : motif d'hospitalisation, traitements"],["**É**valuation","ce que j'ai constaté et ce que j'en pense"],["**D**emande","ce que j'attends : venir, prescrire, conseiller"]]},
  {t:"expliquer",qui:"au téléphone",txt:"« Bonjour, je suis Léa, étudiante infirmière en médecine B, j'appelle avec l'infirmière pour M. R., chambre 12. Il a fait un malaise au lever il y a 10 minutes. Il est hospitalisé pour une pneumopathie et prend un antihypertenseur. Sa tension est à 98/60 debout contre 135/80 couché, il est pâle mais conscient. Je pense à une hypotension orthostatique. Pouvez-vous passer le voir et réévaluer son traitement ? »"}]},
 {h:"Cas complet : Mme D.",chip:"Cas complet",b:[
  {t:"exemple",h:"La situation",ps:["Mme D., 78 ans, veuve, vit seule au 3e étage sans ascenseur. Elle est hospitalisée depuis 2 jours pour une **pneumopathie**, sous antibiotiques IV. Ce matin : T° 38,2 °C, FR 24/min, SpO₂ 92 % sous 2 L/min d'oxygène. Elle tousse et crache, dit être « épuisée », a mangé deux cuillères de son petit-déjeuner et n'a bu qu'un demi-verre depuis hier soir. Elle demande sans cesse quand elle pourra rentrer « nourrir son chat »."]},
  {t:"table",rows:[["Respirer","dépendance : dyspnée, encombrement, SpO₂ basse"],["Boire et manger","dépendance : apports très faibles, fatigue"],["Température","fièvre"],["Éviter les dangers","anxiété liée au chat, risque de chute (fatigue, O₂)"],["Apprendre / social","vit seule, retour à domicile à préparer"]]},
  {t:"liste",items:["**PTC** : risque d'aggravation respiratoire lié à la pneumopathie → surveillance FR, SpO₂, conscience, alerte selon seuils","**Diagnostic** : dégagement inefficace des voies respiratoires lié à l'encombrement et à la fatigue, se manifestant par une toux peu efficace et des crachats","**Diagnostic** : risque de déshydratation lié à la fièvre et à des apports insuffisants","**Diagnostic** : anxiété liée à la séparation de son animal, se manifestant par des questions répétées","**Risque** de chute lié à la fatigue, à l'oxygène et à l'environnement"]},
  {t:"exemple",h:"Objectifs et actions",ps:["**Hydratation** : Mme D. boit au moins 1,2 L par jour dès aujourd'hui. → Proposer à boire à chaque passage, boissons qu'elle aime à portée de main, feuille de surveillance, signaler si apports insuffisants (perfusion possible sur prescription).","**Anxiété** : Mme D. dit être rassurée sur son chat d'ici ce soir. → Avec son accord, contacter une voisine ou la famille ; informer l'assistante sociale pour préparer la sortie.","**Respiration** : position demi-assise, kiné respiratoire, aide à la toux, oxygène selon prescription, constantes toutes les 4 h."]},
  {t:"verif",items:[["Pourquoi le chat de Mme D. est-il un vrai problème infirmier ?","Parce que son anxiété l'empêche de se reposer et peut la pousser à vouloir sortir trop tôt. Prendre en compte ce qui compte pour le patient fait partie du soin."],["Quel problème est prioritaire ?","Le risque d'aggravation respiratoire : il menace la vie. On hiérarchise toujours selon la gravité et l'urgence."]]}]},
 {h:"Présenter une situation à l'oral",chip:"À l'oral",b:[
  {t:"etapes",items:["**Présenter le patient** : âge, mode de vie, motif d'hospitalisation, antécédents utiles.","**Décrire la situation** actuelle de façon factuelle : constantes, observations, propos du patient.","**Exposer les problèmes** retenus, hiérarchisés, en justifiant chacun par des données.","**Objectifs et actions** pour les principaux problèmes.","**Évaluation** et ce que vous en retenez pour votre pratique."]},
  {t:"expliquer",qui:"devant un formateur",txt:"« J'ai retenu trois problèmes, par ordre de priorité. Le premier est un risque d'aggravation respiratoire, car Mme D. a une fréquence respiratoire à 24 et une saturation à 92 % sous oxygène. Le deuxième… »"},
  {t:"pieges",items:["Raconter tout le dossier sans hiérarchiser","Annoncer un problème sans les données qui le justifient","Oublier l'évaluation : c'est elle qui montre que vous avez raisonné"]},
  {t:"verif",items:[["Que signifie PES ?","Problème, Étiologie (lié à), Signes (se manifestant par)."],["Que signifie SAED ?","Situation, Antécédents, Évaluation, Demande."],["Un objectif doit-il décrire l'action de l'infirmier ?","Non : il décrit le résultat attendu chez le patient, de façon mesurable et datée."]]}]}
 ],
 ["Le raisonnement clinique transforme un diagnostic médical en **soins personnalisés**","Recueil → analyse → objectifs → actions → évaluation : un **cycle**, pas une liste","Les **14 besoins** de Henderson structurent le recueil ; on cherche la **source de difficulté**","Diagnostic infirmier au format **PES** ; les complications médicales sont des **PTC**","Un objectif est **centré patient, mesurable et daté**","On transmet en **DAR** à l'écrit et en **SAED** à l'oral"]),

CV("pharmaco-c","thera","Les bases de la pharmacologie","50 min","2.11|B.1","flask",
 ["Définir un médicament, une **DCI**, un générique et une AMM","Expliquer le parcours du médicament (**ADME**) et la demi-vie","Comprendre l'action sur les **récepteurs** et la fenêtre thérapeutique","Choisir et justifier une **voie d'administration**","Repérer les effets indésirables, les interactions et les patients à risque","Administrer et surveiller un traitement en **sécurité**"],
 [
 {h:"Qu'est-ce qu'un médicament ?",chip:"Définitions",b:[
  {t:"p",ps:["Un **médicament** est une substance présentée comme ayant des propriétés pour prévenir, traiter ou diagnostiquer une maladie, ou pour restaurer, corriger ou modifier une fonction de l'organisme. Il contient un **principe actif**, qui agit, et des **excipients**, qui lui donnent sa forme et son goût.","Avant d'être commercialisé, il obtient une **AMM** (autorisation de mise sur le marché), qui fixe ses indications, ses doses et ses contre-indications. Ces informations figurent dans le **RCP** (résumé des caractéristiques du produit) et dans la notice."]},
  {t:"table",rows:[["DCI","nom international du principe actif : paracétamol"],["Nom commercial","nom de marque : Doliprane®, Dafalgan®"],["Princeps","médicament d'origine"],["Générique","même principe actif, même dose, même forme, même efficacité"]]},
  {t:"analogie",txt:"La **DCI**, c'est le nom de la recette ; le **nom commercial**, c'est le nom du restaurant qui la sert. Deux restaurants peuvent servir exactement la même recette sous deux noms différents."},
  {t:"pieges",items:["Donner deux médicaments de noms différents qui contiennent la **même DCI** : surdosage (paracétamol dans plusieurs spécialités)","Ne pas reconnaître un générique et croire à une erreur de la pharmacie"]}]},
 {h:"Le parcours du médicament : ADME",chip:"ADME",b:[
  {t:"p",ps:["La **pharmacocinétique** décrit ce que l'organisme fait au médicament, en quatre étapes : **A**bsorption, **D**istribution, **M**étabolisme, **É**limination."]},
  {t:"schema",k:"adme"},
  {t:"p",ps:["**Absorption** : passage du lieu d'administration vers le sang. Elle dépend de la voie, de la forme, de l'estomac plein ou vide. Par voie orale, une partie du médicament passe d'abord par le foie, qui la transforme avant qu'elle n'atteigne la circulation : c'est l'**effet de premier passage hépatique**. La part qui atteint le sang s'appelle la **biodisponibilité** (100 % en IV).","**Distribution** : le médicament circule, souvent accroché à des protéines du sang comme l'**albumine**. Seule la partie libre agit. Chez un patient dénutri, qui a peu d'albumine, la partie libre augmente : l'effet est plus fort.","**Métabolisme** : surtout dans le **foie**, qui transforme le médicament pour faciliter son élimination. Certains médicaments ne deviennent actifs qu'après cette transformation.","**Élimination** : surtout par les **reins** (urines), aussi par la bile. Si les reins fonctionnent mal, le médicament s'accumule."]},
  {t:"analogie",txt:"Imaginez une **baignoire** : le robinet est l'absorption, l'eau dans la baignoire est la concentration dans le sang, la bonde est l'élimination. Si la bonde est à moitié bouchée (insuffisance rénale), la baignoire déborde à dose égale."},
  {t:"p",ps:["La **demi-vie** est le temps nécessaire pour que la concentration sanguine diminue de moitié. Elle conditionne le rythme des prises. Il faut environ **5 demi-vies** pour atteindre l'état d'équilibre, ou pour éliminer presque complètement un médicament après son arrêt."]},
  {t:"verif",items:[["Pourquoi une dose orale est-elle souvent plus élevée qu'une dose IV ?","À cause de l'effet de premier passage hépatique et d'une absorption incomplète : une partie de la dose orale n'atteint jamais le sang."],["Un médicament a une demi-vie de 6 h. Combien de temps faut-il pour l'éliminer presque totalement ?","Environ 5 demi-vies, soit environ 30 heures."]]}]},
 {h:"Comment agit un médicament",chip:"Action",b:[
  {t:"p",ps:["La **pharmacodynamie** décrit ce que le médicament fait à l'organisme. La plupart agissent en se fixant sur des **récepteurs**, des structures à la surface ou à l'intérieur des cellules."]},
  {t:"duo",items:[{tag:"Agoniste",tone:"green",txt:"**Active** le récepteur, comme la substance naturelle",sub:"la morphine active les récepteurs opioïdes"},{tag:"Antagoniste",tone:"coral",txt:"**Bloque** le récepteur sans l'activer",sub:"la naloxone bloque ces mêmes récepteurs"}]},
  {t:"analogie",txt:"Le récepteur est une **serrure**. L'agoniste est une clé qui ouvre la porte ; l'antagoniste est une clé qui entre dans la serrure mais ne tourne pas : elle empêche les autres clés d'entrer. C'est ainsi qu'un antidote fonctionne."},
  {t:"schema",k:"fenetre"},
  {t:"p",ps:["Entre la concentration qui n'agit pas et celle qui devient toxique se trouve la **zone thérapeutique**. Quand cette zone est étroite (AVK, lithium, digoxine, certains antibiotiques), une petite variation peut provoquer un surdosage : on surveille par des **dosages sanguins**."]}]},
 {h:"Les voies d'administration",chip:"Voies",b:[
  {t:"table",rows:[["Orale","simple et confortable ; délai variable, effet de premier passage"],["Sublinguale","rapide, évite le foie"],["Sous-cutanée","lente et régulière ; insuline, HBPM"],["Intramusculaire","plus rapide que la SC ; contre-indiquée sous anticoagulant"],["Intraveineuse","immédiate, dose exacte ; aucune marge d'erreur"],["Inhalée","action locale sur les bronches, peu d'effets généraux"],["Transdermique","lente et prolongée ; patch"],["Rectale","si voie orale impossible ; absorption irrégulière"]]},
  {t:"expliquer",qui:"au patient",txt:"« Ce patch libère le médicament doucement à travers la peau pendant trois jours. Il ne faut pas le couper, ni mettre de bouillotte dessus, car la chaleur ferait passer le produit trop vite. »"}]},
 {h:"Effets indésirables et iatrogénie",chip:"Effets indésirables",b:[
  {t:"p",ps:["Un **effet indésirable** est une réaction nocive et non voulue. Il peut être lié à la dose (surdosage), à une sensibilité particulière (allergie), à une interaction ou à une mauvaise utilisation. La **iatrogénie** médicamenteuse désigne l'ensemble des problèmes causés par les médicaments : elle est une cause importante d'hospitalisation chez la personne âgée."]},
  {t:"liste",items:["**Allergie** : urticaire, gonflement, gêne respiratoire, jusqu'au choc anaphylactique","**Effets attendus** liés au mécanisme : somnolence d'un somnifère, saignement d'un anticoagulant","**Toxicité** d'organe : rein, foie, oreille, sang","**Effets à long terme** : ostéoporose sous corticoïdes"]},
  {t:"p",ps:["La **pharmacovigilance** surveille les effets indésirables après la commercialisation. Tout professionnel de santé, et même le patient, peut déclarer un effet indésirable sur le portail national de signalement."]},
  {t:"table",rows:[["Personne âgée","reins moins efficaces, polymédication, risque de chute et de confusion"],["Insuffisant rénal","accumulation : doses adaptées"],["Insuffisant hépatique","métabolisme ralenti"],["Enfant","doses au poids, organes immatures"],["Grossesse, allaitement","passage au fœtus ou dans le lait"]]}]},
 {h:"Les interactions",chip:"Interactions",b:[
  {t:"p",ps:["Deux médicaments peuvent se **renforcer** ou s'**affaiblir**. Certains aliments ou plantes interfèrent aussi. Le risque augmente avec le nombre de traitements."]},
  {t:"exemple",h:"Interactions classiques",ps:["**Anticoagulant + AINS ou aspirine** : risque hémorragique majoré.","**Plusieurs sédatifs** (somnifère + opioïde + alcool) : somnolence, dépression respiratoire, chutes.","**Diurétique + AINS** chez l'âgé déshydraté : insuffisance rénale.","**Jus de pamplemousse** : modifie le métabolisme de certains médicaments."]},
  {t:"pieges",items:["Ne pas demander l'**automédication** : ibuprofène, plantes, compléments","Considérer qu'un médicament « naturel » est sans risque"]}]},
 {h:"Administrer en sécurité",chip:"Sécurité",b:[
  {t:"schema",k:"circuit"},
  {t:"p",ps:["L'infirmier est le **dernier maillon** avant le patient. Il vérifie la prescription, prépare, administre, surveille et trace. La règle des **5B** (bon patient, bon médicament, bonne dose, bonne voie, bon moment) guide chaque administration.","Certains médicaments sont dits **à haut risque** : une erreur peut être grave. Ils imposent une vigilance particulière, souvent une double vérification : insuline, anticoagulants, potassium injectable, opioïdes, chimiothérapies."]},
  {t:"pieges",items:["Préparer les médicaments de plusieurs patients en même temps","Être interrompu pendant la préparation","Tracer à l'avance","Exécuter une prescription illisible ou incomplète"]}]},
 {h:"Surveiller un traitement",chip:"Surveillance",b:[
  {t:"cols",cols:[{h:"Efficacité",tone:"green",items:["Le symptôme diminue-t-il ?","Douleur, fièvre, tension, glycémie","Résultats biologiques"]},{h:"Tolérance",tone:"coral",items:["Effets indésirables attendus","Signes d'allergie","Bilans de surveillance"]}]},
  {t:"p",ps:["La troisième dimension est l'**observance** : le patient prend-il son traitement comme prescrit ? Une mauvaise observance s'explique souvent par un manque de compréhension, des effets indésirables, un coût ou un schéma trop compliqué."]},
  {t:"expliquer",qui:"au patient",txt:"« Ce médicament protège votre cœur sur le long terme. Vous ne sentirez pas de différence chaque jour, c'est normal. Si vous avez des vertiges en vous levant, dites-le-nous : on pourra ajuster la dose, mais ne l'arrêtez pas de vous-même. »"},
  {t:"verif",items:[["Qu'est-ce qu'un antagoniste ?","Une substance qui se fixe sur un récepteur sans l'activer et empêche l'action de l'agoniste. Exemple : la naloxone face à la morphine."],["Citez trois médicaments à haut risque.","Insuline, anticoagulants, potassium injectable (aussi : opioïdes, chimiothérapies)."],["Pourquoi les personnes âgées sont-elles plus exposées à la iatrogénie ?","Élimination rénale diminuée, polymédication, sensibilité accrue au système nerveux (chutes, confusion)."]]}]}
 ],
 ["La **DCI** identifie le principe actif ; plusieurs noms commerciaux peuvent cacher la même molécule","**ADME** : absorption, distribution, métabolisme (foie), élimination (rein)","Environ **5 demi-vies** pour atteindre l'équilibre ou éliminer un médicament","Agoniste = active, antagoniste = bloque : c'est le principe des **antidotes**","Marge thérapeutique étroite = **dosages sanguins**","Surveiller **efficacité, tolérance, observance** ; l'infirmier est le **dernier verrou**"])
];

CVS.push(
CV("calculs-c","calcul","Les calculs de doses : la méthode complète","55 min","2.11 4.4|B.3","flask",
 ["Appliquer une **méthode en 5 étapes** à tout calcul","Convertir sans erreur g, mg, µg, L, mL, h, min","Utiliser le **produit en croix**","Calculer un **volume à prélever**, une **dilution**, un **pourcentage**","Calculer un **débit** en gouttes/min et en mL/h","Calculer une **dose au poids** et vérifier la cohérence d'un résultat"],
 [
 {h:"Une méthode pour tous les calculs",chip:"Méthode",b:[
  {t:"p",ps:["En stage comme à l'évaluation, les erreurs de calcul viennent rarement des mathématiques : elles viennent d'une **lecture trop rapide**, d'une **unité oubliée** ou d'un résultat qu'on n'a pas vérifié. Une méthode toujours identique protège de ces erreurs."]},
  {t:"etapes",items:["**Lire** la prescription et le produit disponible, en soulignant chaque nombre et son unité.","**Convertir** pour que tout soit dans la même unité (mg avec mg, min avec min).","**Poser** le calcul : produit en croix ou formule.","**Calculer**, en gardant les unités à chaque ligne.","**Vérifier la cohérence** : le résultat est-il plausible ? (une ampoule de 2 mL ne donne pas 15 mL)"]},
  {t:"analogie",txt:"Un calcul de dose, c'est comme une **recette de cuisine** : si la recette est en grammes et que votre balance est en kilos, vous devez convertir avant de cuisiner, sinon le gâteau est raté."}]},
 {h:"Les unités et les conversions",chip:"Conversions",b:[
  {t:"table",rows:[["1 g","1 000 mg"],["1 mg","1 000 µg (microgrammes)"],["1 L","1 000 mL"],["1 mL","1 cm³"],["1 h","60 min"],["24 h","1 440 min"]]},
  {t:"p",ps:["Pour passer d'une unité à l'unité **plus petite** juste en dessous (g → mg, mg → µg, L → mL), on **multiplie par 1 000**. Pour remonter, on **divise par 1 000**."]},
  {t:"exemple",h:"Conversions",ps:["0,25 mg = 0,25 × 1 000 = **250 µg**","1,5 g = 1,5 × 1 000 = **1 500 mg**","750 mL = 750 ÷ 1 000 = **0,75 L**","3 h 30 = 3 × 60 + 30 = **210 min**"]},
  {t:"pieges",items:["Confondre **mg** et **µg** : erreur d'un facteur 1 000","Oublier de convertir les heures en minutes pour un débit en gouttes/min","Écrire « ,5 mg » : on écrit toujours **0,5 mg**, sinon la virgule disparaît à la lecture"]}]},
 {h:"Le produit en croix",chip:"Produit en croix",b:[
  {t:"p",ps:["C'est l'outil universel. On écrit ce qu'on **connaît** sur une ligne, ce qu'on **cherche** sur la ligne du dessous, en gardant les mêmes unités dans chaque colonne. Puis on multiplie en diagonale et on divise par le nombre restant."]},
  {t:"calc",q:"Une ampoule contient **50 mg dans 10 mL**. Quel volume pour **15 mg** ?",steps:["50 mg → 10 mL","15 mg → x mL","x = 15 × 10 ÷ 50","x = 150 ÷ 50 = 3"],r:"Réponse : 3 mL"},
  {t:"p",ps:["**Vérification** : 15 mg est moins d'un tiers de 50 mg ; il faut donc moins d'un tiers des 10 mL. 3 mL est cohérent."]}]},
 {h:"Concentrations et pourcentages",chip:"Concentrations",b:[
  {t:"p",ps:["La **concentration** indique la quantité de produit dans un volume : en **mg/mL**, en **g/L** ou en **%**. Un pourcentage en soins signifie toujours **grammes pour 100 mL**."]},
  {t:"table",rows:[["G5 %","5 g de glucose pour 100 mL → 50 g/L"],["G10 %","10 g pour 100 mL → 100 g/L"],["NaCl 0,9 %","0,9 g pour 100 mL → 9 g/L"],["Ampoule 40 mg/2 mL","20 mg/mL"]]},
  {t:"calc",q:"Combien de grammes de glucose dans **250 mL de G10 %** ?",steps:["10 % = 10 g pour 100 mL","10 g → 100 mL","x g → 250 mL","x = 10 × 250 ÷ 100 = 25"],r:"Réponse : 25 g"}]},
 {h:"Le volume à prélever",chip:"Volume à prélever",b:[
  {t:"p",ps:["Formule : **Volume = Dose prescrite ÷ Concentration**. On calcule d'abord la concentration en mg/mL, puis on divise."]},
  {t:"calc",q:"Prescription : **60 mg**. Ampoule : **80 mg dans 2 mL**.",steps:["Concentration = 80 ÷ 2 = 40 mg/mL","Volume = 60 ÷ 40 = 1,5"],r:"Réponse : 1,5 mL"},
  {t:"calc",h:"Avec une dilution",q:"Ampoule de **500 mg dans 5 mL**, diluée pour obtenir **50 mL** au total. Prescription : **150 mg**.",steps:["Après dilution : 500 mg dans 50 mL","Concentration = 500 ÷ 50 = 10 mg/mL","Volume = 150 ÷ 10 = 15"],r:"Réponse : 15 mL de la solution diluée"},
  {t:"pieges",items:["Oublier que la dilution **change la concentration** : on calcule sur le volume final","Calculer sur le volume de l'ampoule au lieu de la solution réellement préparée"]}]},
 {h:"Le débit en gouttes par minute",chip:"Gouttes/min",b:[
  {t:"schema",k:"perfuseur"},
  {t:"p",ps:["Formule : **Débit (gouttes/min) = Volume (mL) × nombre de gouttes par mL ÷ Durée (min)**. Avec un perfuseur standard, 1 mL = **20 gouttes**. Avec un perfuseur de précision, 1 mL = **60 gouttes**. On arrondit à l'unité : on ne compte pas une demi-goutte."]},
  {t:"calc",q:"**1 500 mL** de NaCl 0,9 % sur **24 h**, perfuseur standard.",steps:["Durée : 24 × 60 = 1 440 min","Gouttes : 1 500 × 20 = 30 000 gouttes","Débit : 30 000 ÷ 1 440 ≈ 20,8"],r:"Réponse : 21 gouttes/min"},
  {t:"calc",h:"Retrouver une durée",q:"Une poche de **1 000 mL** coule à **40 gouttes/min** (standard). Combien de temps va-t-elle durer ?",steps:["Gouttes : 1 000 × 20 = 20 000 gouttes","Durée : 20 000 ÷ 40 = 500 min","500 min = 8 h 20 min"],r:"Réponse : 8 h 20"},
  {t:"analogie",txt:"Avec un perfuseur de **précision** (60 gouttes/mL), le nombre de gouttes par minute est **égal** au nombre de mL par heure : 60 gouttes/mL ÷ 60 min. 25 mL/h = 25 gouttes/min."}]},
 {h:"Le débit en mL/h : pompe et pousse-seringue",chip:"mL/h",b:[
  {t:"p",ps:["Sur une **pompe volumétrique**, on programme des mL/h : **Débit = Volume ÷ Durée (h)**. Sur un **pousse-seringue électrique** (PSE), la prescription est souvent en dose par heure (mg/h) : on calcule la concentration de la seringue, puis **Débit (mL/h) = Dose/h ÷ Concentration**."]},
  {t:"calc",q:"**500 mL** à passer en **6 h** à la pompe.",steps:["Débit = 500 ÷ 6 ≈ 83,3"],r:"Réponse : 83,3 mL/h"},
  {t:"calc",q:"Seringue de **100 mg dans 50 mL**. Prescription : **4 mg/h**.",steps:["Concentration = 100 ÷ 50 = 2 mg/mL","Débit = 4 ÷ 2 = 2"],r:"Réponse : 2 mL/h"},
  {t:"pieges",items:["Inverser dose et concentration","Oublier de **purger** la tubulure : le débit réel commence en retard","Ne pas **étiqueter** la seringue : produit, dose, volume, date, heure"]}]},
 {h:"Les doses au poids",chip:"Au poids",b:[
  {t:"p",ps:["En pédiatrie et pour certains médicaments, la dose est prescrite **par kilo** : en mg/kg par prise ou en **mg/kg/jour**, à répartir en plusieurs prises. On utilise toujours le **poids du jour**."]},
  {t:"calc",q:"Enfant de **15 kg**. Prescription : **50 mg/kg/jour en 3 prises**. Suspension à **250 mg pour 5 mL**.",steps:["Dose par jour : 15 × 50 = 750 mg","Dose par prise : 750 ÷ 3 = 250 mg","Concentration : 250 ÷ 5 = 50 mg/mL","Volume par prise : 250 ÷ 50 = 5"],r:"Réponse : 5 mL trois fois par jour"},
  {t:"pieges",items:["Donner la dose **journalière** en une seule prise","Utiliser un poids ancien ou estimé","Utiliser une cuillère de cuisine au lieu de la **pipette** ou du dispositif doseur fourni"]}]},
 {h:"Arrondis, vérification et sécurité",chip:"Sécurité",b:[
  {t:"liste",items:["**Gouttes/min** : arrondi à l'unité","**mL/h** : souvent au dixième, selon ce que l'appareil accepte","**Volume à prélever** : à la graduation de la seringue utilisée","**Toujours vérifier l'ordre de grandeur** avant d'administrer","**Double vérification** pour les médicaments à haut risque et en pédiatrie","Un résultat qui vous surprend ? On **recalcule** et on demande un second avis"]},
  {t:"verif",items:[["250 mL de NaCl 0,9 % en 2 h, perfuseur standard : quel débit ?","250 × 20 = 5 000 gouttes ; 5 000 ÷ 120 ≈ 41,7 → **42 gouttes/min**."],["Ampoule de 40 mg dans 4 mL, prescription de 30 mg : quel volume ?","Concentration 10 mg/mL ; 30 ÷ 10 = **3 mL**."],["Enfant de 20 kg, 10 mg/kg par prise, sirop à 20 mg/mL : quel volume par prise ?","200 mg ÷ 20 = **10 mL**."],["Combien de µg dans 0,1 mg ?","0,1 × 1 000 = **100 µg**."]]}]}
 ],
 ["Méthode : **lire, convertir, poser, calculer, vérifier**","% = **grammes pour 100 mL**","Volume = **dose ÷ concentration**","Gouttes/min = **mL × 20 ÷ minutes** (perfuseur standard)","PSE : mL/h = **dose par heure ÷ concentration**","Toujours le **poids du jour** et la **cohérence** du résultat"]),

CV("cardio-c","anat","Le système cardiovasculaire","55 min","2.2 2.7 2.8|B.1","heart",
 ["Décrire l'anatomie du **cœur** et ses quatre cavités","Expliquer la **petite** et la **grande circulation**","Comprendre le **cycle cardiaque** et la conduction électrique","Expliquer le **débit cardiaque** et la **pression artérielle**","Relier la physiologie aux pathologies : HTA, insuffisance cardiaque, infarctus","Expliquer simplement le fonctionnement du cœur à un patient"],
 [
 {h:"À quoi sert le système cardiovasculaire ?",chip:"Rôle",b:[
  {t:"p",ps:["Chaque cellule du corps a besoin d'**oxygène** et de **nutriments**, et doit se débarrasser de ses **déchets** (CO₂, urée). Le système cardiovasculaire assure ce transport en permanence. Il est composé d'une **pompe**, le cœur, et d'un réseau de **tuyaux**, les vaisseaux, dans lequel circule le **sang** (environ 5 litres chez l'adulte)."]},
  {t:"analogie",txt:"Le cœur est une **double pompe** reliée à deux circuits : un petit circuit vers les poumons pour « recharger » le sang en oxygène, et un grand circuit pour le distribuer à tout le corps."}]},
 {h:"L'anatomie du cœur",chip:"Anatomie",b:[
  {t:"p",ps:["Le cœur est un **muscle creux** (le **myocarde**), de la taille d'un poing, situé dans le thorax entre les deux poumons, pointe orientée vers la gauche. Il est entouré d'une enveloppe, le **péricarde**, et tapissé à l'intérieur par l'**endocarde**.","Il comporte **4 cavités** : deux **oreillettes** en haut, qui reçoivent le sang, et deux **ventricules** en bas, qui l'éjectent. Une cloison sépare le cœur droit du cœur gauche : le sang ne passe jamais directement de l'un à l'autre chez l'adulte."]},
  {t:"schema",k:"coeur"},
  {t:"table",rows:[["Valve tricuspide","entre oreillette et ventricule droits"],["Valve mitrale","entre oreillette et ventricule gauches"],["Valve pulmonaire","sortie du ventricule droit vers l'artère pulmonaire"],["Valve aortique","sortie du ventricule gauche vers l'aorte"]],note:"Les valves fonctionnent comme des clapets anti-retour. Leur fermeture produit les bruits du cœur entendus au stéthoscope."},
  {t:"p",ps:["Le **ventricule gauche** a la paroi la plus épaisse : il doit envoyer le sang dans tout le corps, contre une pression élevée."]}]},
 {h:"La petite et la grande circulation",chip:"Circulations",b:[
  {t:"duo",items:[{tag:"Petite circulation",tone:"blue",txt:"Ventricule droit → **artère pulmonaire** → poumons → **veines pulmonaires** → oreillette gauche",sub:"le sang se charge en O₂ et se débarrasse du CO₂"},{tag:"Grande circulation",tone:"coral",txt:"Ventricule gauche → **aorte** → artères → capillaires des organes → veines → **veines caves** → oreillette droite",sub:"le sang distribue l'O₂ et récupère les déchets"}]},
  {t:"table",rows:[["Artères","partent du cœur ; paroi épaisse et élastique ; pression élevée"],["Capillaires","très fins ; c'est là que se font les échanges avec les cellules"],["Veines","reviennent au cœur ; paroi fine ; valvules qui empêchent le reflux"]]},
  {t:"pieges",items:["Croire qu'une artère transporte toujours du sang oxygéné : l'**artère pulmonaire** transporte du sang pauvre en O₂","Les **veines pulmonaires** transportent du sang riche en O₂"]},
  {t:"p",ps:["Le retour veineux des jambes est aidé par la **contraction des muscles du mollet** et les valvules. C'est pourquoi l'immobilité favorise la stase et la **phlébite**."]}]},
 {h:"Le cycle cardiaque et l'électricité du cœur",chip:"Cycle et conduction",b:[
  {t:"p",ps:["Chaque battement comporte deux temps : la **systole**, contraction qui éjecte le sang, et la **diastole**, relâchement pendant lequel les cavités se remplissent. Les artères coronaires se remplissent surtout pendant la diastole.","Le cœur possède son **propre système électrique**, qui le fait battre sans commande du cerveau. Le système nerveux ne fait qu'accélérer ou ralentir le rythme."]},
  {t:"etapes",items:["Le **nœud sinusal**, dans l'oreillette droite, émet l'impulsion : c'est le chef d'orchestre (60 à 100 fois par minute).","L'impulsion parcourt les oreillettes, qui se contractent.","Elle est freinée un instant au **nœud auriculo-ventriculaire**, pour laisser les ventricules se remplir.","Elle descend par le **faisceau de His** puis le **réseau de Purkinje**.","Les **ventricules** se contractent."]},
  {t:"table",rows:[["Onde P","contraction des oreillettes"],["Complexe QRS","contraction des ventricules"],["Onde T","récupération électrique des ventricules"]],note:"Sur l'ECG, un rythme **sinusal** est un rythme où chaque QRS est précédé d'une onde P, à intervalles réguliers."}]},
 {h:"Débit cardiaque et pression artérielle",chip:"Débit et PA",b:[
  {t:"p",ps:["Le **débit cardiaque** est le volume de sang éjecté par minute : **Débit = fréquence cardiaque × volume d'éjection systolique**. Au repos : environ 70 battements × 70 mL ≈ **5 litres par minute**.","La **pression artérielle** dépend du débit et de la **résistance** des artères : PA = débit × résistances. Elle augmente si le cœur pompe plus, ou si les artères se resserrent ou se rigidifient."]},
  {t:"analogie",txt:"Pensez à un **tuyau d'arrosage** : si vous ouvrez plus le robinet (débit), ou si vous pincez le bout du tuyau (résistance), la pression monte. Avec l'âge, le tuyau devient plus rigide : la pression monte aussi."},
  {t:"p",ps:["La pression est régulée en permanence. Des capteurs, les **barorécepteurs**, situés dans la crosse de l'aorte et les artères carotides, détectent les variations. Si la tension baisse (lever brusque, hémorragie), le cœur accélère et les vaisseaux se resserrent. C'est pourquoi une **tachycardie** est souvent le premier signe d'une hémorragie, avant la chute de tension."]},
  {t:"verif",items:[["Un patient saigne. Quel signe apparaît souvent en premier : la tachycardie ou l'hypotension ?","La tachycardie : l'organisme compense en accélérant le cœur. L'hypotension apparaît quand la compensation est dépassée."]]}]},
 {h:"Les coronaires et l'athérome",chip:"Coronaires",b:[
  {t:"p",ps:["Le cœur lui-même est nourri par les **artères coronaires**, qui partent de l'aorte. Si l'une d'elles se rétrécit, le muscle manque d'oxygène à l'effort : c'est l'**angor**. Si elle se bouche, le muscle meurt : c'est l'**infarctus**."]},
  {t:"schema",k:"artere"},
  {t:"p",ps:["La cause principale est l'**athérosclérose** : des dépôts de graisse (plaques d'athérome) se forment dans la paroi des artères. Facteurs de risque : **tabac**, hypertension, diabète, cholestérol, sédentarité, surpoids, âge, hérédité. Le même mécanisme touche le cerveau (AVC) et les jambes (artérite)."]}]},
 {h:"Explorer et surveiller",chip:"Surveillance",b:[
  {t:"schema",k:"pouls"},
  {t:"table",rows:[["Pouls, PA","examen de base, à chaque surveillance"],["ECG","rythme, signes d'infarctus"],["Troponine","marqueur de souffrance du muscle cardiaque"],["BNP / NT-proBNP","augmentés dans l'insuffisance cardiaque"],["Échographie cardiaque","contraction, valves, fraction d'éjection"],["Coronarographie","visualise les coronaires, permet de les déboucher"]]}]},
 {h:"Du normal au pathologique",chip:"Pathologies",b:[
  {t:"table",rows:[["Hypertension","résistance artérielle élevée → le cœur force, les artères s'abîment"],["Insuffisance cardiaque","la pompe faiblit → le sang stagne en amont (poumons ou corps)"],["Infarctus","une coronaire se bouche → le muscle meurt"],["Fibrillation auriculaire","oreillettes désorganisées → rythme irrégulier, risque de caillot et d'AVC"],["Phlébite","stase dans une veine → caillot → risque d'embolie"]]},
  {t:"expliquer",qui:"au patient insuffisant cardiaque",txt:"« Votre cœur est une pompe un peu fatiguée. Quand il n'arrive pas à tout envoyer, l'eau s'accumule dans les jambes ou dans les poumons. Le diurétique aide les reins à éliminer cette eau. Se peser tous les matins permet de voir l'eau s'accumuler avant même d'être essoufflé. »"},
  {t:"verif",items:[["Quelle cavité a la paroi la plus épaisse et pourquoi ?","Le ventricule gauche, car il éjecte le sang dans toute la grande circulation, contre une pression élevée."],["Que représente le complexe QRS ?","La contraction (dépolarisation) des ventricules."],["Où se font les échanges entre le sang et les cellules ?","Dans les capillaires."],["Quelle structure donne le rythme normal du cœur ?","Le nœud sinusal, dans l'oreillette droite."]]}]}
 ],
 ["Le cœur est une **double pompe** : petite circulation (poumons) et grande circulation (corps)","4 cavités, 4 valves anti-retour ; le **ventricule gauche** est le plus puissant","Le **nœud sinusal** donne le rythme ; ECG : P = oreillettes, QRS = ventricules","Débit = **FC × volume d'éjection** ≈ 5 L/min ; PA = débit × résistances","**Tachycardie** = premier signe de compensation d'une hémorragie","L'**athérome** relie infarctus, AVC et artérite : mêmes facteurs de risque"])
);

CVS.push(
CV("respi-c","anat","Le système respiratoire et l'oxygénation","50 min","2.2 2.7 4.4|B.1 B.3","lungs",
 ["Décrire les **voies aériennes** et les poumons","Expliquer la **mécanique** de l'inspiration et de l'expiration","Comprendre les **échanges gazeux** et le transport de l'oxygène","Interpréter une **SpO₂** et les grandes valeurs d'un **gaz du sang**","Reconnaître une **détresse respiratoire**","Administrer et surveiller une **oxygénothérapie**"],
 [
 {h:"À quoi sert la respiration ?",chip:"Rôle",b:[
  {t:"p",ps:["La respiration apporte de l'**oxygène** (O₂) au sang et élimine le **dioxyde de carbone** (CO₂), un déchet produit par les cellules. Elle participe aussi à l'équilibre **acide-base** du sang : garder trop de CO₂ rend le sang acide."]}]},
 {h:"Les voies aériennes et les poumons",chip:"Anatomie",b:[
  {t:"table",rows:[["Voies aériennes supérieures","nez, bouche, pharynx, larynx : réchauffent, humidifient, filtrent l'air"],["Larynx","contient les cordes vocales ; l'épiglotte le ferme pendant la déglutition"],["Trachée","tube rigide renforcé d'anneaux de cartilage"],["Bronches et bronchioles","se divisent comme les branches d'un arbre"],["Alvéoles","petits sacs où se font les échanges gazeux ; des centaines de millions"]]},
  {t:"p",ps:["Les poumons sont entourés par la **plèvre**, une double enveloppe qui leur permet de glisser contre la paroi thoracique. De l'air entre les deux feuillets, c'est un **pneumothorax** ; du liquide, un **épanchement pleural**.","La bronche souche droite est plus verticale que la gauche : un corps étranger ou une fausse route va plus souvent dans le **poumon droit**."]},
  {t:"pieges",items:["Penser que la toux pendant le repas est banale : c'est le signe d'une **fausse route**, l'aliment est passé vers la trachée"]}]},
 {h:"La mécanique ventilatoire",chip:"Mécanique",b:[
  {t:"p",ps:["L'air entre dans les poumons parce que le thorax s'agrandit. À l'**inspiration**, le **diaphragme** se contracte et descend, les muscles intercostaux soulèvent les côtes : le volume augmente, la pression baisse, l'air entre. L'inspiration est **active**.","À l'**expiration** au repos, les muscles se relâchent et les poumons, élastiques, reviennent sur eux-mêmes : l'air sort. L'expiration est **passive**. Elle devient active à l'effort ou quand les bronches sont rétrécies (asthme, BPCO)."]},
  {t:"analogie",txt:"Les poumons fonctionnent comme un **soufflet de cheminée** : on écarte les poignées, l'air entre ; on relâche, l'air sort."},
  {t:"p",ps:["Au repos, on mobilise environ **500 mL d'air** à chaque respiration (le volume courant), 12 à 20 fois par minute. Quand le patient s'épuise, il respire vite et superficiellement : la ventilation devient moins efficace."]},
  {t:"table",rows:[["Signes de lutte","muscles du cou qui travaillent, tirage entre les côtes ou au-dessus du sternum, battement des ailes du nez"],["Signes d'épuisement","respiration paradoxale (le ventre rentre quand le thorax monte), somnolence, FR qui ralentit brutalement"]]}]},
 {h:"Les échanges gazeux",chip:"Échanges",b:[
  {t:"schema",k:"alveole"},
  {t:"p",ps:["Dans l'alvéole, l'air est séparé du sang par une paroi extrêmement fine. Les gaz passent par **diffusion**, de la zone où ils sont le plus concentrés vers celle où ils le sont moins : l'O₂ de l'air vers le sang, le CO₂ du sang vers l'air.","Les échanges sont perturbés si les alvéoles sont remplies de liquide (OAP, pneumopathie), si la paroi est épaissie (fibrose), détruite (emphysème) ou si le sang n'arrive plus (embolie pulmonaire)."]}]},
 {h:"Le transport de l'oxygène",chip:"Transport",b:[
  {t:"p",ps:["Dans le sang, l'oxygène est transporté surtout par l'**hémoglobine** des globules rouges. La **saturation** (SaO₂, ou SpO₂ quand elle est mesurée au doigt) est le pourcentage d'hémoglobine chargée en oxygène.","La **PaO₂** (pression artérielle en oxygène) se mesure par un **gaz du sang** artériel. Les deux sont liées, mais pas de façon proportionnelle : au-dessus de 90 % de saturation, la marge est faible ; en dessous, la PaO₂ chute vite."]},
  {t:"schema",k:"oxymetre"},
  {t:"pieges",items:["Se fier à une SpO₂ normale chez un patient **anémié** : l'hémoglobine est saturée, mais il y en a peu","Oublier qu'une **intoxication au monoxyde de carbone** donne une SpO₂ faussement normale","Lire la valeur sans vérifier la **courbe de pouls**"]}]},
 {h:"La régulation de la respiration",chip:"Régulation",b:[
  {t:"p",ps:["La respiration est commandée par des **centres nerveux** situés dans le tronc cérébral (bulbe). Le principal signal qui fait respirer est l'augmentation du **CO₂** dans le sang, plus que le manque d'oxygène.","Chez certains patients BPCO, habitués à un CO₂ élevé, le **manque d'oxygène** devient un stimulus important. Trop d'oxygène peut alors réduire leur ventilation et faire monter le CO₂ : c'est l'**hypercapnie**, avec somnolence, céphalées, sueurs, confusion."]},
  {t:"p",ps:["Les **opioïdes**, les benzodiazépines et l'alcool dépriment ces centres : la fréquence respiratoire baisse. C'est pourquoi on surveille la FR sous morphine."]}]},
 {h:"Le gaz du sang",chip:"Gaz du sang",b:[
  {t:"table",rows:[["pH","7,38 – 7,42"],["PaO₂","80 – 100 mmHg"],["PaCO₂","35 – 45 mmHg"],["Bicarbonates (HCO₃⁻)","22 – 26 mmol/L"],["SaO₂","95 – 100 %"]],note:"Repères adulte en air ambiant ; ils varient légèrement selon les laboratoires et l'âge."},
  {t:"table",rows:[["Hypoxémie","PaO₂ basse : l'oxygène manque"],["Hypercapnie","PaCO₂ élevée : le CO₂ n'est pas éliminé"],["Acidose respiratoire","pH bas + PaCO₂ élevée : hypoventilation"],["Alcalose respiratoire","pH élevé + PaCO₂ basse : hyperventilation (anxiété, douleur)"]]},
  {t:"liste",items:["Prélèvement **artériel**, le plus souvent radial, après un **test d'Allen** selon le protocole","Noter si le patient est en **air ambiant** ou sous O₂, et à quel débit","**Compression** prolongée du point de ponction (au moins 5 minutes, plus sous anticoagulant)","Acheminement **rapide** au laboratoire"]}]},
 {h:"Reconnaître une détresse respiratoire",chip:"Détresse",b:[
  {t:"signes",e:"Urgence",items:["FR > 30 ou < 8 /min","SpO₂ basse malgré l'oxygène","Tirage, battement des ailes du nez","Cyanose","Impossible de finir une phrase","Sueurs, agitation","Somnolence, confusion"]},
  {t:"etapes",items:["**Installer** en position demi-assise ou assise.","**Alerter** sans attendre.","**Oxygène** selon prescription ou protocole d'urgence.","**Surveiller** FR, SpO₂, pouls, conscience.","Préparer le matériel : aspiration, chariot d'urgence."]}]},
 {h:"L'oxygénothérapie",chip:"Oxygène",b:[
  {t:"p",ps:["L'oxygène est un **médicament** : il se donne sur **prescription** (ou protocole), avec un **débit** ou une **cible de saturation**. Le dispositif dépend du besoin."]},
  {t:"table",rows:[["Lunettes nasales","faibles débits, jusqu'à environ 5–6 L/min ; confortables, le patient peut parler et manger"],["Masque simple","débits moyens, environ 5–10 L/min"],["Masque à haute concentration","avec réservoir, 10–15 L/min ; urgence, hypoxémie sévère"],["Oxygénothérapie à haut débit","dispositifs spécifiques en soins critiques"]],note:"Repères indicatifs : le débit et la cible sont toujours ceux de la prescription."},
  {t:"liste",items:["**Sécurité** : pas de flamme, pas de cigarette, pas de corps gras sur le visage ; bouteille arrimée","Vérifier la **quantité restante** dans la bouteille avant un transport","Surveiller la peau derrière les oreilles et sur le nez (points d'appui)","Soins de bouche : l'oxygène assèche les muqueuses","Réévaluer : on vise la **cible**, pas 100 % à tout prix"]},
  {t:"expliquer",qui:"au patient",txt:"« Cet oxygène aide vos poumons pendant qu'ils guérissent. Gardez les lunettes bien en place dans le nez, et appelez-moi si vous vous sentez plus essoufflé. Surtout, aucune flamme ni cigarette dans la chambre : l'oxygène fait brûler très vite. »"},
  {t:"verif",items:[["Pourquoi l'expiration au repos est-elle passive ?","Parce que les poumons, élastiques, reviennent seuls sur eux-mêmes quand les muscles se relâchent."],["Quel est le principal stimulus de la respiration ?","L'augmentation du CO₂ dans le sang."],["Un pH à 7,30 avec une PaCO₂ à 60 mmHg, c'est quoi ?","Une acidose respiratoire, par hypoventilation."],["Pourquoi une SpO₂ normale peut-elle être trompeuse ?","En cas d'anémie ou d'intoxication au monoxyde de carbone, ou si la mesure est faussée (mains froides, vernis)."]]}]}
 ],
 ["Inspiration **active** (diaphragme), expiration **passive** au repos","Les échanges gazeux se font par **diffusion** dans les alvéoles","SpO₂ = % d'hémoglobine chargée en O₂ ; à interpréter avec la **clinique**","Le **CO₂** est le principal moteur de la respiration ; opioïdes et sédatifs la dépriment","Gaz du sang : pH 7,38–7,42 ; PaO₂ 80–100 ; PaCO₂ 35–45 mmHg","L'oxygène est un **médicament** : débit ou cible prescrits, sécurité incendie"]),

CV("hygiene-c","soins","L'hygiène et la prévention des infections","50 min","2.10 4.5|B.4","flask",
 ["Expliquer ce qu'est une **infection associée aux soins**","Décrire la **chaîne de transmission** et comment la rompre","Réaliser une **hygiène des mains** aux bons moments","Appliquer les **précautions standard** et **complémentaires**","Distinguer **asepsie**, **antisepsie** et désinfection","Réagir à un **accident d'exposition au sang**"],
 [
 {h:"Pourquoi l'hygiène est un soin",chip:"Enjeux",b:[
  {t:"p",ps:["En France, environ **un patient hospitalisé sur vingt** présente une infection associée aux soins (IAS). Elles allongent les séjours, favorisent les résistances aux antibiotiques et peuvent être mortelles. Une grande partie est **évitable** par des gestes simples, appliqués à chaque patient, à chaque soin.","L'hygiène n'est donc pas une contrainte administrative : c'est un **soin à part entière**, qui protège le patient, le soignant et les autres patients."]}]},
 {h:"Les micro-organismes",chip:"Micro-organismes",b:[
  {t:"table",rows:[["Bactéries","staphylocoque, entérobactéries ; traitées par antibiotiques"],["Virus","grippe, Covid, hépatites, VIH ; insensibles aux antibiotiques"],["Champignons","Candida, Aspergillus"],["Parasites","gale, poux"],["Prions","agents très résistants, procédures spécifiques"]]},
  {t:"duo",items:[{tag:"Flore résidente",tone:"blue",txt:"Vit en permanence sur notre peau",sub:"peu pathogène, utile ; difficile à éliminer"},{tag:"Flore transitoire",tone:"coral",txt:"Acquise par contact, en soignant",sub:"responsable des transmissions ; éliminée par l'hygiène des mains"}]}]},
 {h:"La chaîne de transmission",chip:"Transmission",b:[
  {t:"schema",k:"chaine"},
  {t:"p",ps:["Pour qu'une infection se transmette, il faut un **agent infectieux**, un **réservoir** où il vit (un patient, un soignant, l'environnement), une **porte de sortie**, un **mode de transmission**, une **porte d'entrée** et un **hôte réceptif**. Il suffit de rompre **un seul maillon** pour stopper la transmission."]},
  {t:"table",rows:[["Contact","direct (mains) ou indirect (matériel, surfaces) : le plus fréquent à l'hôpital"],["Gouttelettes","grosses particules émises en parlant, toussant ; portée d'environ 1 à 2 mètres"],["Air","fines particules qui restent en suspension : tuberculose, rougeole, varicelle"],["Sang","piqûre, coupure, projection"]]},
  {t:"analogie",txt:"Les mains du soignant sont comme un **taxi** : elles prennent les microbes chez un patient et les déposent chez le suivant, si on ne « nettoie pas le taxi » entre deux courses."}]},
 {h:"L'hygiène des mains",chip:"Mains",b:[
  {t:"p",ps:["C'est la mesure la plus efficace. La **friction hydroalcoolique** (FHA) est la technique de référence : plus rapide, plus efficace et mieux tolérée que le lavage, sur des mains **visiblement propres et sèches**."]},
  {t:"table",rows:[["1","avant de toucher un patient"],["2","avant un geste aseptique"],["3","après un risque d'exposition à un liquide biologique"],["4","après avoir touché un patient"],["5","après avoir touché l'environnement du patient"]],note:"Les 5 moments de l'hygiène des mains selon l'OMS."},
  {t:"etapes",items:["Une **dose suffisante** pour mouiller les deux mains.","Paume contre paume, puis dos des mains.","Entre les doigts, doigts entrelacés.","Dos des doigts, pouces en rotation.","**Bout des doigts** et ongles dans le creux de la main.","Poignets.","Frotter **jusqu'à séchage complet** (environ 20 à 30 secondes)."]},
  {t:"liste",items:["**Prérequis** : avant-bras dégagés, ongles courts sans vernis ni faux ongles, **aucun bijou** (ni alliance ni montre)","**Lavage au savon** quand les mains sont visiblement souillées, et face à *Clostridioides difficile* ou la gale (le gel n'agit pas sur leurs spores et sur les parasites), puis friction après séchage","Les **gants ne remplacent pas** l'hygiène des mains : FHA avant de les mettre et après les avoir retirés"]},
  {t:"pieges",items:["Oublier le **bout des doigts** et les pouces, les zones les plus touchées","S'essuyer les mains avant que le produit ait séché","Garder les mêmes gants pour deux patients ou deux soins"]}]},
 {h:"Les précautions standard",chip:"Précautions standard",b:[
  {t:"p",ps:["Elles s'appliquent **à tous les patients**, quel que soit leur statut infectieux connu, pour **tout soin**. On part du principe que tout liquide biologique peut être contaminant."]},
  {t:"liste",items:["**Hygiène des mains** aux 5 moments","**Gants** uniquement s'il y a un risque de contact avec du sang, des liquides biologiques, une muqueuse ou une peau lésée ; un soin, une paire","**Tablier** ou surblouse si risque de projection ou soin mouillant, salissant","**Masque et lunettes** si risque de projection au visage","**Hygiène respiratoire** : le patient qui tousse porte un masque","**Gestion des excreta** : protection, lave-bassin, pas de vidange à la douchette","**Environnement** : matériel et surfaces nettoyés entre deux patients","**Prévention des AES** : pas de recapuchonnage, collecteur à proximité"]}]},
 {h:"Les précautions complémentaires",chip:"Complémentaires",b:[
  {t:"p",ps:["Elles **s'ajoutent** aux précautions standard pour certains micro-organismes, sur prescription ou protocole, avec une signalétique sur la porte."]},
  {t:"table",rows:[["Contact","BMR, BHRe, gale, *C. difficile* : chambre seule si possible, tablier, matériel dédié"],["Gouttelettes","grippe, Covid, coqueluche, méningocoque : masque chirurgical pour le soignant et pour le patient qui sort"],["Air","tuberculose, rougeole, varicelle : masque **FFP2** ajusté (test d'étanchéité), porte fermée"]]},
  {t:"pieges",items:["Mettre un masque chirurgical pour une tuberculose","Toucher l'extérieur du masque, ou le porter sous le nez","Sortir le matériel de la chambre sans le nettoyer"]}]},
 {h:"Asepsie, antisepsie, désinfection",chip:"Asepsie",b:[
  {t:"table",rows:[["Asepsie","ensemble des mesures qui **empêchent** l'apport de micro-organismes (matériel stérile, technique sans contact)"],["Antisepsie","élimination des micro-organismes sur un **tissu vivant** (peau, muqueuse) par un antiseptique"],["Désinfection","même principe sur une **surface inerte** ou un dispositif médical"],["Stérilisation","destruction de tous les micro-organismes sur un dispositif"]]},
  {t:"p",ps:["Avant un geste invasif, la peau est préparée avec un **antiseptique**, de préférence **alcoolique** sur peau saine, en respectant son **temps de séchage**. Si la peau est souillée, on fait d'abord une **détersion** (nettoyage au savon), un rinçage et un séchage, selon le protocole de l'établissement. On ne mélange pas deux familles d'antiseptiques différentes."]},
  {t:"analogie",txt:"L'antisepsie, c'est **nettoyer le terrain** avant de construire ; l'asepsie, c'est **ne rien salir** pendant la construction."}]},
 {h:"L'environnement, le linge et les déchets",chip:"Environnement",b:[
  {t:"liste",items:["**Bionettoyage** quotidien de la chambre, du plus propre au plus sale, du haut vers le bas","Nettoyage-désinfection du matériel partagé (tensiomètre, stéthoscope) **entre deux patients**","**Linge sale** directement dans le sac, sans le poser au sol ni le plaquer contre sa tenue","**DASRI** (emballage jaune) pour les déchets à risque infectieux ; **DAOM** (sac noir) pour les autres","**Collecteur à aiguilles** fermé au trait de remplissage, jamais rempli à ras bord"]}]},
 {h:"L'accident d'exposition au sang",chip:"AES",b:[
  {t:"etapes",items:["**Piqûre ou coupure** : ne pas faire saigner. Nettoyer à l'eau et au savon, rincer, puis tremper ou appliquer un antiseptique au moins **5 minutes**.","**Projection sur une muqueuse** (œil, bouche) : rincer abondamment au sérum physiologique ou à l'eau au moins **5 minutes**.","Contacter **immédiatement** le médecin référent ou les urgences : un traitement préventif se discute idéalement **dans les 4 heures**, et au plus tard dans les 48 heures.","Avec son accord, rechercher le **statut sérologique** du patient source (VIH, hépatites B et C).","**Déclarer** l'accident du travail et faire le suivi sérologique."]},
  {t:"verif",items:[["Quels sont les 5 moments de l'hygiène des mains ?","Avant le contact patient, avant un geste aseptique, après un risque d'exposition à un liquide biologique, après le contact patient, après le contact avec l'environnement du patient."],["Pourquoi le gel ne suffit-il pas face à Clostridioides difficile ?","Parce que ses spores résistent à l'alcool : il faut un lavage mécanique au savon."],["Quel masque pour une tuberculose ?","Un masque FFP2, ajusté, avec un test d'étanchéité."],["Après une piqûre, faut-il faire saigner ?","Non : on nettoie, on rince, on désinfecte au moins 5 minutes, et on consulte rapidement."]]}]}
 ],
 ["Environ **1 patient hospitalisé sur 20** a une IAS, souvent évitable","Rompre **un maillon** de la chaîne suffit à stopper la transmission","**FHA** aux 5 moments, sur mains nues, sans bijou, jusqu'au séchage","Précautions **standard** pour tous ; **complémentaires** en plus selon le germe (contact, gouttelettes, air)","Asepsie = ne pas apporter de germes ; antisepsie = les éliminer sur la peau","AES : nettoyer, désinfecter 5 min, **consulter dans les 4 heures**, déclarer"])
);

CVS.push(
CV("antalgie","exam","La douleur : comprendre, évaluer, soulager","50 min","2.11 4.4 4.7|B.1 B.3","face",
 ["Définir la douleur et ses **composantes**","Expliquer le **trajet** du message douloureux","Distinguer douleur **nociceptive**, **neuropathique**, aiguë et chronique","**Évaluer** la douleur avec l'outil adapté à chaque patient","Connaître les **antalgiques** et surveiller un opioïde","Utiliser les moyens **non médicamenteux** et connaître le cadre légal"],
 [
 {h:"Qu'est-ce que la douleur ?",chip:"Définition",b:[
  {t:"p",ps:["Selon l'Association internationale pour l'étude de la douleur (IASP, 2020), la douleur est **une expérience sensorielle et émotionnelle désagréable, associée ou ressemblant à celle associée à une lésion tissulaire réelle ou potentielle**.","Cette définition dit deux choses essentielles : la douleur n'est pas seulement une sensation, elle a aussi une **dimension émotionnelle** ; et elle peut exister **sans lésion visible**. La douleur est toujours **subjective** : c'est le patient qui sait ce qu'il ressent."]},
  {t:"table",rows:[["Sensorielle","intensité, localisation, type (brûlure, serrement)"],["Émotionnelle","anxiété, tristesse, peur"],["Cognitive","ce que le patient en comprend, ses souvenirs, ses croyances"],["Comportementale","plaintes, grimaces, immobilité, repli"]]},
  {t:"analogie",txt:"La douleur aiguë est une **alarme incendie** : utile, elle signale un danger. La douleur chronique est une alarme **qui continue de sonner** alors que l'incendie est éteint : elle devient une maladie à part entière."}]},
 {h:"Le trajet du message douloureux",chip:"Physiologie",b:[
  {t:"etapes",items:["**Les nocicepteurs**, terminaisons nerveuses de la peau, des muscles et des organes, détectent l'agression (chaleur, pression, inflammation).","Le message voyage par des **fibres nerveuses** : les fibres **Aδ**, rapides, transmettent la douleur vive et localisée (la piqûre) ; les fibres **C**, lentes, la douleur sourde et diffuse (la brûlure qui suit).","Il arrive dans la **moelle épinière** (corne dorsale), où il peut être amplifié ou freiné.","Il monte jusqu'au **thalamus**, puis au **cortex**, où il devient une douleur consciente, avec ses composantes émotionnelles."]},
  {t:"p",ps:["Le corps possède ses propres systèmes de **contrôle**. Le **gate control** (théorie du portillon) explique pourquoi frotter une zone qu'on vient de cogner soulage : le toucher « ferme la porte » au message douloureux dans la moelle. Le cerveau libère aussi des **endorphines**, des morphines naturelles, sous l'effet du stress, de l'effort ou du rire."]},
  {t:"verif",items:[["Pourquoi frotter une zone douloureuse soulage-t-il ?","Selon le gate control, les messages tactiles transmis par de grosses fibres freinent le passage du message douloureux dans la moelle épinière."]]}]},
 {h:"Les types de douleur",chip:"Types",b:[
  {t:"table",rows:[["Nociceptive","lésion des tissus : fracture, plaie, inflammation ; répond aux antalgiques classiques"],["Neuropathique","lésion du système nerveux : zona, diabète, sciatique ; brûlures, décharges électriques, fourmillements"],["Nociplastique","système de la douleur déréglé sans lésion évidente : fibromyalgie"],["Mixte","association : douleur du cancer souvent"]]},
  {t:"p",ps:["Le questionnaire **DN4** aide à repérer une douleur neuropathique : un score **≥ 4/10** est en faveur. Ce type de douleur répond mal au paracétamol et aux opioïdes ; le médecin prescrit des traitements spécifiques (certains antiépileptiques ou antidépresseurs)."]},
  {t:"duo",items:[{tag:"Aiguë",tone:"coral",txt:"Récente, liée à une cause, **signal d'alarme**",sub:"s'accompagne souvent de tachycardie, sueurs, anxiété"},{tag:"Chronique",tone:"blue",txt:"Évolue depuis **plus de 3 mois**",sub:"retentit sur le sommeil, l'humeur, le travail, la vie sociale"}]}]},
 {h:"Évaluer la douleur",chip:"Évaluation",b:[
  {t:"p",ps:["Évaluer la douleur fait partie du **rôle propre** de l'infirmier. On choisit l'outil selon la capacité du patient à communiquer, on utilise **toujours le même** pour suivre l'évolution, et on évalue **avant et après** chaque traitement."]},
  {t:"schema",k:"eva"},
  {t:"schema",k:"visages"},
  {t:"table",rows:[["Adulte qui communique","EVA, EN (0 à 10), EVS"],["Enfant à partir de 4–6 ans","échelle des visages, EVA adaptée"],["Enfant plus jeune","EVENDOL, FLACC"],["Personne âgée non communicante","Algoplus (aiguë), Doloplus ou ECPA (chronique)"],["Douleur neuropathique","DN4"]]},
  {t:"table",rows:[["**P**rovoqué","qu'est-ce qui la déclenche ou la soulage ?"],["**Q**ualité","brûlure, serrement, coup de couteau, décharge"],["**R**égion","où, et irradie-t-elle ?"],["**S**évérité","score sur l'échelle"],["**T**emps","depuis quand, continue ou par crises"]]},
  {t:"expliquer",qui:"au patient",txt:"« Sur une échelle de 0 à 10, où 0 c'est pas de douleur du tout et 10 la pire douleur que vous puissiez imaginer, combien avez-vous mal en ce moment ? »"},
  {t:"pieges",items:["Évaluer la douleur « à l'œil » sans échelle","Changer d'échelle d'une évaluation à l'autre","Croire qu'un patient qui dort ou rit n'a pas mal","Ne pas réévaluer après l'antalgique"]}]},
 {h:"Les traitements médicamenteux",chip:"Antalgiques",b:[
  {t:"schema",k:"paliers"},
  {t:"table",rows:[["Palier 1","paracétamol (4 g/24 h au maximum chez l'adulte en général), AINS"],["Palier 2","tramadol, codéine, souvent associés au paracétamol"],["Palier 3","morphine, oxycodone, fentanyl"],["Co-antalgiques","antispasmodiques, corticoïdes, antiépileptiques, anesthésiques locaux"]]},
  {t:"p",ps:["On peut associer un palier 1 à un palier 2 ou 3, mais **jamais deux opioïdes** entre eux sans avis spécialisé. Pour une douleur intense, on peut commencer directement au palier 3.","La **PCA** (analgésie contrôlée par le patient) est une pompe qui permet au patient de s'injecter lui-même de petites doses de morphine, avec une **période réfractaire** qui empêche le surdosage. Seul le patient appuie sur le bouton."]},
  {t:"analogie",txt:"La **titration** de la morphine, c'est remplir un verre **goutte à goutte** jusqu'au trait : on donne de petites doses répétées en réévaluant à chaque fois, jusqu'au soulagement, sans déborder."}]},
 {h:"Surveiller un opioïde fort",chip:"Opioïdes",b:[
  {t:"table",rows:[["0","éveillé"],["1","somnolent par moments, facile à réveiller"],["2","somnolent la plupart du temps, réveillable par la voix"],["3","difficile à réveiller, ne répond qu'à la stimulation physique"]],note:"Exemple d'échelle de sédation. Un score de 2 ou plus impose d'alerter selon le protocole."},
  {t:"liste",items:["**Sédation** et **fréquence respiratoire** à chaque passage : la somnolence précède la dépression respiratoire","Douleur avant et après","**Constipation** : laxatif prescrit dès le début, quasi systématique","Nausées, vomissements, prurit, rétention urinaire, confusion","**Antidote** : naloxone, sur prescription ou protocole"]},
  {t:"expliquer",qui:"au patient qui craint la morphine",txt:"« La morphine est le meilleur médicament pour une douleur forte comme la vôtre. Prise pour soulager une douleur et bien surveillée, elle ne rend pas dépendant de la même façon qu'une drogue. On va commencer doucement et vérifier régulièrement que vous êtes soulagé et bien réveillé. »"}]},
 {h:"Les moyens non médicamenteux",chip:"Non médicamenteux",b:[
  {t:"table",rows:[["Installation","position antalgique, coussins, soutien d'un membre"],["Froid","entorse, contusion, après certaines chirurgies (jamais directement sur la peau)"],["Chaleur","contractures, douleurs musculaires (pas en cas d'inflammation aiguë)"],["Distraction","conversation, musique, écran pour l'enfant"],["Relaxation, respiration","diminuent la composante anxieuse"],["Hypnose, TENS","selon les formations et les services"],["Présence, information","expliquer un soin à l'avance réduit la douleur ressentie"]]},
  {t:"p",ps:["Avant un soin douloureux (pansement, mobilisation, ponction), on **anticipe** : antalgique au bon délai, crème anesthésiante prescrite, mélange gazeux (MEOPA) selon protocole, explication du déroulement."]}]},
 {h:"Le cadre légal et le rôle infirmier",chip:"Cadre légal",b:[
  {t:"p",ps:["Le **Code de la santé publique** affirme que toute personne a le droit de recevoir des soins visant à **soulager sa douleur**, et que celle-ci doit être prévenue, évaluée, prise en compte et traitée. La prise en charge de la douleur est aussi un critère de la **certification HAS** des établissements.","L'infirmier évalue et trace la douleur dans son **rôle propre**. Il administre les antalgiques sur **prescription** ou dans le cadre d'un **protocole** écrit, daté et signé. Il peut mettre en œuvre de lui-même les moyens non médicamenteux."]},
  {t:"exemple",h:"Situation",ps:["M. L., 62 ans, J1 d'une prothèse de hanche. À 8 h, EN 7/10 au repos, 9/10 à la mobilisation. Il est crispé et refuse de bouger. Il a reçu du paracétamol à 6 h.","**Actions** : évaluation complète (PQRST), application du protocole antalgique prescrit, installation avec coussin entre les jambes, glace sur la hanche selon prescription, information sur l'intérêt du lever. **Réévaluation** à 9 h : EN 3/10 au repos. Le lever avec le kiné est programmé 30 minutes après la dose suivante. **Traçabilité** de chaque score et de chaque action."]},
  {t:"verif",items:[["Que mesure le DN4 ?","La probabilité d'une douleur neuropathique ; un score ≥ 4/10 est en faveur."],["Quel est le signe d'alerte qui précède la dépression respiratoire sous morphine ?","La somnolence croissante (sédation)."],["Quelle échelle chez une personne âgée non communicante avec une douleur aiguë ?","Algoplus."],["L'infirmier peut-il appliquer seul un moyen non médicamenteux ?","Oui, cela relève de son rôle propre."]]}]}
 ],
 ["La douleur est **subjective** : on croit le patient et on l'**évalue** avec une échelle","Message : nocicepteurs → fibres Aδ et C → moelle → thalamus → cortex","Nociceptive ou **neuropathique** (DN4 ≥ 4) : les traitements diffèrent","Évaluer → traiter → **réévaluer** → tracer","Sous opioïde : **sédation et FR**, laxatif systématique, naloxone en antidote","Soulager la douleur est un **droit** du patient"]),

CV("diabete-c","patho","Le diabète","55 min","2.7 4.6|B.1 C.1","drop",
 ["Expliquer la **régulation de la glycémie**","Définir et diagnostiquer le diabète","Distinguer **type 1**, **type 2** et diabète gestationnel","Reconnaître et traiter les **complications aiguës**","Comprendre les **complications chroniques** et le pied diabétique","Connaître les traitements et mener une **éducation thérapeutique**"],
 [
 {h:"La régulation normale de la glycémie",chip:"Physiologie",b:[
  {t:"p",ps:["Le **glucose** est le carburant principal des cellules, et le seul du cerveau dans les conditions habituelles. Sa concentration dans le sang, la **glycémie**, reste normalement entre **0,70 et 1,40 g/L** environ, grâce à deux hormones du **pancréas**, produites par les îlots de Langerhans."]},
  {t:"duo",items:[{tag:"Insuline",tone:"blue",txt:"**Fait baisser** la glycémie",sub:"fait entrer le glucose dans les cellules ; stocke le sucre dans le foie et les muscles"},{tag:"Glucagon",tone:"coral",txt:"**Fait monter** la glycémie",sub:"libère le sucre stocké dans le foie entre les repas"}]},
  {t:"analogie",txt:"L'insuline est la **clé** qui ouvre la porte des cellules au sucre. Dans le diabète de type 1, il n'y a plus de clé. Dans le type 2, la clé existe mais la **serrure est rouillée** : elle tourne mal (insulinorésistance)."}]},
 {h:"Définition et diagnostic",chip:"Diagnostic",b:[
  {t:"p",ps:["Le diabète est une **hyperglycémie chronique**. Avec le temps, l'excès de sucre abîme les petits et les gros vaisseaux, et les nerfs."]},
  {t:"table",rows:[["Glycémie à jeun","≥ 1,26 g/L (7 mmol/L) à deux reprises"],["Glycémie à tout moment","≥ 2 g/L (11 mmol/L) avec des symptômes"],["HbA1c","reflet de la glycémie moyenne des 2–3 derniers mois"],["Prédiabète","glycémie à jeun entre 1,10 et 1,25 g/L"]]},
  {t:"liste",items:["**Polyurie** : urines abondantes (le rein élimine le sucre en excès, et l'eau avec)","**Polydipsie** : soif intense, conséquence de la polyurie","**Amaigrissement** malgré un appétit conservé (type 1)","Fatigue, infections à répétition, cicatrisation lente","Souvent **aucun symptôme** dans le type 2 : découverte sur une prise de sang"]}]},
 {h:"Les différents diabètes",chip:"Types",b:[
  {t:"table",rows:[["Type 1","destruction auto-immune des cellules qui produisent l'insuline ; souvent jeune, début rapide ; insuline indispensable à vie"],["Type 2","insulinorésistance puis épuisement du pancréas ; souvent après 40 ans, surpoids, sédentarité, hérédité ; le plus fréquent (environ 9 cas sur 10)"],["Gestationnel","découvert pendant la grossesse ; dépisté au 2e trimestre chez les femmes à risque ; risque de type 2 plus tard"],["Secondaires","corticoïdes, maladie du pancréas"]]},
  {t:"pieges",items:["Croire que le diabète de type 2 est « moins grave » : ses complications sont les mêmes","Croire que passer à l'insuline dans le type 2 est un échec du patient : c'est l'évolution naturelle de la maladie"]}]},
 {h:"Les complications aiguës",chip:"Complications aiguës",b:[
  {t:"cols",cols:[{h:"Hypoglycémie (< 0,70 g/L)",tone:"coral",items:["Sueurs, tremblements, faim, pâleur","Troubles du comportement, confusion","Coma","Causes : repas sauté, effort, erreur d'insuline, sulfamides, alcool"]},{h:"Acidocétose (type 1 surtout)",tone:"amber",items:["Soif, polyurie, déshydratation","Nausées, vomissements, douleurs abdominales","Haleine qui sent la pomme","Respiration ample et rapide (Kussmaul)","Cétones dans le sang ou les urines"]}]},
  {t:"p",ps:["Le **syndrome hyperosmolaire** touche surtout la personne âgée diabétique de type 2 : glycémie très élevée, **déshydratation majeure**, troubles de la conscience, souvent déclenché par une infection ou un manque d'accès à l'eau."]},
  {t:"calc",h:"Resucrage",q:"Patient conscient, glycémie à **0,52 g/L**, sueurs et tremblements.",steps:["15 g de sucre rapide : 3 morceaux ou un verre de jus","Contrôle à 15 min : 0,85 g/L","Collation avec sucres lents","Recherche de la cause, information du médecin, traçabilité"],r:"Le patient inconscient ne reçoit rien par la bouche : glucagon ou sucre IV"}]},
 {h:"Les complications chroniques",chip:"Complications chroniques",b:[
  {t:"table",rows:[["Yeux : rétinopathie","fond d'œil chaque année ; première cause de cécité évitable"],["Reins : néphropathie","créatinine et albumine dans les urines chaque année"],["Nerfs : neuropathie","pieds insensibles, douleurs, troubles digestifs ou urinaires"],["Cœur et artères","infarctus (parfois indolore), AVC, artérite des jambes"]],note:"Les trois premières touchent les petits vaisseaux (microangiopathie), la dernière les gros (macroangiopathie)."},
  {t:"p",ps:["Le **pied diabétique** associe une **neuropathie** (le patient ne sent pas la blessure) et une **artérite** (la plaie cicatrise mal). Une simple ampoule peut évoluer vers une infection grave, jusqu'à l'amputation."]},
  {t:"etapes",items:["**Examiner** les pieds chaque jour, avec un miroir si besoin.","Laver à l'eau tiède (vérifier la température avec le coude), **sécher entre les orteils**.","Hydrater la peau, sauf entre les orteils.","Chaussures adaptées, chaussettes sans couture, **jamais pieds nus**.","Ongles coupés droits ; cors et durillons confiés au **pédicure-podologue**.","**Toute plaie se signale**, même indolore."]}]},
 {h:"Les traitements",chip:"Traitements",b:[
  {t:"p",ps:["La base est toujours l'**hygiène de vie** : alimentation équilibrée et régulière, activité physique adaptée (au moins 30 minutes la plupart des jours), perte de poids si nécessaire, arrêt du tabac."]},
  {t:"table",rows:[["Metformine","en première intention dans le type 2 ; troubles digestifs ; arrêt temporaire autour d'une injection d'iode selon protocole"],["Sulfamides","stimulent l'insuline ; risque d'hypoglycémie"],["Gliflozines","éliminent le sucre par les urines ; infections urinaires et génitales, déshydratation"],["Analogues du GLP-1","injectables ; nausées ; perte de poids"],["Insuline","type 1 toujours, type 2 si nécessaire"]]},
  {t:"schema",k:"insuline"},
  {t:"schema",k:"sites"},
  {t:"liste",items:["Vérifier la **glycémie** et le **repas** avant une insuline rapide","Rotation des sites pour éviter les **lipodystrophies**","Stylo entamé à température ambiante, non entamé au **réfrigérateur**","Un stylo par patient"]}]},
 {h:"Surveillance et éducation thérapeutique",chip:"Éducation",b:[
  {t:"p",ps:["Le diabète est une maladie chronique que le patient gère **lui-même au quotidien**. L'éducation thérapeutique (ETP) vise à le rendre **autonome** : comprendre sa maladie, surveiller sa glycémie, adapter son traitement selon le protocole, réagir à une hypoglycémie."]},
  {t:"etapes",items:["**Diagnostic éducatif** : ce que le patient sait, ce qu'il vit, ce qu'il souhaite.","**Objectifs** négociés avec lui (savoir se resucrer, réaliser son injection seul…).","**Séances** individuelles ou collectives, avec manipulation du matériel.","**Évaluation** : le patient montre et explique."]},
  {t:"expliquer",qui:"au patient qui découvre son diabète",txt:"« Votre corps a du mal à utiliser le sucre, alors il reste dans le sang. Ça ne fait pas mal, mais avec les années, ça abîme les petits vaisseaux des yeux, des reins et des pieds. Le traitement, l'alimentation et l'activité permettent d'éviter ces complications. On va apprendre ensemble, pas à pas, à surveiller votre glycémie. »"},
  {t:"exemple",h:"Situation",ps:["Mme S., 58 ans, diabétique de type 2 sous metformine, hospitalisée pour une infection urinaire. Glycémies entre 2,4 et 3 g/L depuis l'admission. Elle dit : « Je ne mange presque rien, je ne comprends pas. »","**Analyse** : l'infection fait monter la glycémie ; une insuline temporaire peut être prescrite. **Rôle infirmier** : glycémies capillaires selon prescription, hydratation, surveillance des signes de déshydratation, explication du lien entre infection et glycémie, vérification des pieds, préparation de l'éducation à la sortie."]},
  {t:"verif",items:[["Quelle hormone fait baisser la glycémie ?","L'insuline."],["Quels sont les critères diagnostiques du diabète ?","Glycémie à jeun ≥ 1,26 g/L à deux reprises, ou ≥ 2 g/L à tout moment avec des symptômes."],["Pourquoi le pied du diabétique est-il fragile ?","Neuropathie (il ne sent pas la blessure) et artérite (la plaie cicatrise mal)."],["Que reflète l'HbA1c ?","La glycémie moyenne des 2 à 3 derniers mois."],["Quel signe respiratoire évoque une acidocétose ?","Une respiration ample et rapide (dyspnée de Kussmaul), avec une haleine fruitée."]]}]}
 ],
 ["**Insuline** = baisse la glycémie ; **glucagon** = l'augmente","Diabète : glycémie à jeun **≥ 1,26 g/L** deux fois, ou ≥ 2 g/L avec symptômes","Type 1 : plus d'insuline ; type 2 : **insulinorésistance**","Hypoglycémie < 0,70 g/L : **15 g de sucre**, contrôle à 15 min ; inconscient = rien par la bouche","Complications : yeux, reins, nerfs, cœur et artères ; **pied** à surveiller chaque jour","L'**ETP** rend le patient autonome dans sa maladie"])
);
CVS.forEach(c=>{const i=COURS.findIndex(x=>x.id===c.id);if(i>=0)COURS[i]=c;else COURS.unshift(c);});


CVS.length=0;
CVS.push(
CV("droit-c","role","Le droit de la profession infirmière","50 min","1.3 3.3|A.2","alert",
 ["Situer les **textes** qui encadrent l'exercice infirmier","Distinguer **rôle propre**, rôle sur **prescription** et **collaboration**","Expliquer les trois **responsabilités** : civile, pénale, disciplinaire","Connaître le rôle de l'**Ordre** et du code de déontologie","Situer la responsabilité de l'**étudiant** en stage","Réagir face à une **prescription** douteuse ou à un glissement de tâches"],
 [
 {h:"Les textes qui encadrent la profession",chip:"Textes",b:[
  {t:"p",ps:["L'infirmier est une **profession de santé réglementée** : on ne peut l'exercer qu'avec le **diplôme d'État** (ou un diplôme reconnu équivalent) et après **inscription à l'Ordre national des infirmiers**. Exercer sans remplir ces conditions constitue un **exercice illégal**, puni par la loi.","L'essentiel des règles se trouve dans le **Code de la santé publique** (CSP) : la partie législative (articles L.) définit la profession, la partie réglementaire (articles R.) précise les actes autorisés et la déontologie."]},
  {t:"table",rows:[["Définition de la profession","CSP, articles L4311-1 et suivants"],["Actes professionnels","CSP, articles R4311-1 à R4311-15 (le « décret d'actes »)"],["Code de déontologie","CSP, articles R4312-1 et suivants (2016)"],["Loi sur la profession d'infirmier","27 juin 2025 : missions redéfinies, consultation et diagnostic infirmiers reconnus"]],note:"La loi de 2025 est mise en œuvre par des décrets d'application : vérifiez dans vos cours la liste des actes en vigueur."},
  {t:"analogie",txt:"Le Code de la santé publique est le **règlement du jeu** : il dit ce que vous avez le droit de faire, dans quelles conditions, et ce qui se passe si vous sortez du cadre."}]},
 {h:"Le rôle propre",chip:"Rôle propre",b:[
  {t:"p",ps:["Le **rôle propre** regroupe les soins que l'infirmier **décide et réalise de sa propre initiative**, sans prescription médicale. Il en est pleinement responsable. Il comprend notamment les soins liés aux fonctions d'entretien et de continuité de la vie, la surveillance, l'évaluation, la prévention et l'éducation.","Pour ces soins, l'infirmier peut élaborer des **protocoles de soins infirmiers**, et il **identifie les besoins** de la personne, pose un **diagnostic infirmier**, formule des objectifs et met en œuvre les actions."]},
  {t:"liste",items:["Soins d'hygiène, de confort, aide à l'alimentation et à l'élimination","Prévention et soins d'escarres","Surveillance des constantes, de l'hydratation, de l'élimination","Évaluation de la douleur","Recueil de données, entretien d'accueil, relation d'aide","Éducation à la santé, aide à la prise des médicaments présentés en forme non injectable"]},
  {t:"p",ps:["L'infirmier peut confier certains de ces soins à un **aide-soignant**, un auxiliaire de puériculture ou un accompagnant éducatif et social, **dans la limite de leur formation**, sous sa responsabilité : c'est la **collaboration**. Il reste responsable de l'organisation et du contrôle."]}]},
 {h:"Le rôle sur prescription",chip:"Rôle prescrit",b:[
  {t:"p",ps:["Certains actes ne peuvent être réalisés que sur **prescription médicale** : injections, perfusions, prélèvements, pose de sonde urinaire, pansements complexes, administration de la plupart des médicaments. La prescription doit être **écrite, qualitative et quantitative, datée et signée**.","D'autres actes se font **en application d'un protocole** écrit, daté et signé par un médecin (par exemple en urgence), ou **en présence d'un médecin** pouvant intervenir à tout moment."]},
  {t:"etapes",items:["**Lire** la prescription en entier et vérifier qu'elle est complète.","**Vérifier** sa cohérence : dose, voie, allergie connue, interaction évidente.","En cas de doute, **demander une précision** au prescripteur.","Si la prescription paraît **dangereuse**, ne pas l'exécuter, en informer le prescripteur et tracer.","Exécuter, **surveiller**, **tracer**."]},
  {t:"pieges",items:["Exécuter une prescription orale hors urgence, sans confirmation écrite","Penser que la responsabilité est entièrement celle du médecin : l'infirmier répond de l'**exécution** et de la **vérification**"]}]},
 {h:"La responsabilité civile",chip:"Civile",b:[
  {t:"p",ps:["La responsabilité civile vise à **réparer un dommage** causé à autrui, le plus souvent par une **indemnisation**. Elle suppose trois éléments : une **faute**, un **dommage** et un **lien de causalité** entre les deux."]},
  {t:"table",rows:[["Établissement public","l'hôpital indemnise la victime (responsabilité administrative), sauf faute personnelle détachable du service"],["Établissement privé, salarié","l'employeur répond des fautes du salarié agissant dans le cadre de ses fonctions"],["Exercice libéral","l'infirmier est personnellement responsable ; assurance en responsabilité civile professionnelle obligatoire"]]},
  {t:"analogie",txt:"La responsabilité civile, c'est **réparer** : comme un conducteur dont l'assurance paie la carrosserie de la voiture qu'il a abîmée."}]},
 {h:"La responsabilité pénale",chip:"Pénale",b:[
  {t:"p",ps:["La responsabilité pénale vise à **sanctionner** une infraction prévue par le Code pénal : amende, prison, interdiction d'exercer. Elle est **personnelle** : personne ne peut être condamné à la place d'un autre, et l'assurance ne la couvre pas."]},
  {t:"table",rows:[["Homicide ou blessures involontaires","erreur, imprudence, négligence ayant causé un décès ou des blessures"],["Non-assistance à personne en danger","Code pénal, art. 223-6"],["Violation du secret professionnel","Code pénal, art. 226-13"],["Mise en danger de la vie d'autrui","violation délibérée d'une obligation de sécurité"],["Faux en écriture","tracer un soin non réalisé, modifier un dossier"],["Exercice illégal","pratiquer sans diplôme ou sans inscription"]]},
  {t:"exemple",h:"Situation",ps:["Une infirmière administre du chlorure de potassium en IV directe au lieu d'une perfusion lente, après une lecture trop rapide. Le patient fait un arrêt cardiaque.","→ Responsabilité **pénale** possible (homicide ou blessures involontaires), **civile** (indemnisation, ici prise en charge par l'établissement), **disciplinaire** (Ordre, employeur)."]}]},
 {h:"La responsabilité disciplinaire et l'Ordre",chip:"Disciplinaire",b:[
  {t:"p",ps:["La responsabilité disciplinaire sanctionne un **manquement aux règles professionnelles** ou à la déontologie. Elle peut être engagée devant la **chambre disciplinaire de l'Ordre** et, pour un salarié, par l'**employeur**. Les trois responsabilités peuvent se cumuler pour les mêmes faits."]},
  {t:"table",rows:[["Avertissement","sanction la plus légère"],["Blâme","réprimande inscrite au dossier"],["Interdiction temporaire d'exercer","pour une durée fixée"],["Radiation du tableau","interdiction définitive d'exercer"]],note:"Sanctions prononcées par la chambre disciplinaire de l'Ordre."},
  {t:"liste",items:["**Ordre national des infirmiers** : inscription obligatoire, respect de la déontologie, conciliation, discipline","**Code de déontologie** : respect de la personne, secret, indépendance, compétence, confraternité, interdiction de la publicité pour son activité de soins","**Développement professionnel continu** : obligation de se former tout au long de sa carrière"]}]},
 {h:"L'étudiant infirmier en stage",chip:"Étudiant",b:[
  {t:"p",ps:["L'étudiant réalise des actes **dans le cadre de sa formation**, sous la responsabilité et le contrôle d'un **infirmier** ou d'un professionnel qui l'encadre. Il reste **personnellement responsable de ses fautes** : il ne doit jamais réaliser un acte qu'il ne maîtrise pas, ni hors de la présence de l'encadrant quand celle-ci est requise.","L'infirmier encadrant est responsable de l'**encadrement** : choisir les actes adaptés au niveau de l'étudiant, vérifier, superviser."]},
  {t:"expliquer",qui:"à son tuteur",txt:"« Je n'ai encore jamais posé de sonde urinaire. Je préfère vous regarder faire cette fois-ci, puis le faire avec vous la prochaine fois. »"},
  {t:"pieges",items:["Accepter seul un soin non maîtrisé par peur de mal paraître","Signer ou tracer un soin réalisé par un autre","Utiliser les identifiants informatiques d'un infirmier"]}]},
 {h:"La traçabilité et le dossier de soins",chip:"Traçabilité",b:[
  {t:"p",ps:["Le **dossier de soins infirmiers** fait partie du dossier patient. Il prouve ce qui a été fait, assure la **continuité des soins** et protège le soignant. En cas de litige, un soin non tracé est considéré comme **non réalisé**."]},
  {t:"liste",items:["Écrire des **faits** datés et horodatés, signés","Tracer **au moment** du soin, jamais à l'avance","Ne jamais effacer ni modifier une transmission : on ajoute une rectification datée","Respecter la confidentialité : sessions informatiques fermées"]},
  {t:"verif",items:[["Quels sont les trois éléments de la responsabilité civile ?","Une faute, un dommage et un lien de causalité entre les deux."],["L'assurance peut-elle payer une condamnation pénale ?","Non : la responsabilité pénale est personnelle."],["Que faire face à une prescription qui paraît dangereuse ?","Ne pas l'exécuter, demander des précisions au prescripteur, l'informer et tracer."],["Un aide-soignant peut-il réaliser une injection ?","Non : il collabore aux soins du rôle propre dans la limite de sa formation ; les injections relèvent de l'infirmier."]]}]}
 ],
 ["Exercer suppose le **diplôme** et l'**inscription à l'Ordre**","**Rôle propre** = initiative infirmière ; **rôle prescrit** = prescription écrite, datée, signée","Civile = **réparer** ; pénale = **sanctionner** (personnelle) ; disciplinaire = **règles professionnelles**","Prescription douteuse : **vérifier, questionner, ne pas exécuter** si dangereuse","L'étudiant est responsable de ses fautes : **ne jamais faire ce qu'on ne maîtrise pas**","Ce qui n'est pas tracé n'est **pas fait**"]),

CV("patients-c","role","Les droits des patients","45 min","1.3|A.2","eye",
 ["Citer les grands textes : **loi du 4 mars 2002**, loi de 2005, loi de 2016","Expliquer le droit à l'**information** et au **consentement**","Distinguer **personne de confiance** et personne à prévenir","Appliquer le **secret professionnel** et le secret partagé","Connaître les règles pour les **mineurs** et les **majeurs protégés**","Savoir réagir face à un **refus de soin** ou une suspicion de maltraitance"],
 [
 {h:"Les grands textes",chip:"Textes",b:[
  {t:"table",rows:[["Loi du 4 mars 2002 (Kouchner)","droits des malades : information, consentement, accès au dossier, personne de confiance"],["Loi du 22 avril 2005 (Leonetti)","refus de l'obstination déraisonnable, directives anticipées"],["Loi du 11 février 2005","droits des personnes handicapées"],["Loi du 2 février 2016 (Claeys-Leonetti)","directives anticipées contraignantes, sédation profonde et continue"],["Charte de la personne hospitalisée","résume les droits ; affichée dans les établissements"]]},
  {t:"p",ps:["Le principe commun est de faire du patient un **acteur** de ses soins, et non plus un sujet passif : il est informé, il décide, il peut refuser."]}]},
 {h:"Le droit à l'information",chip:"Information",b:[
  {t:"p",ps:["Toute personne a le droit d'être informée sur son état de santé : examens, traitements, leurs bénéfices, leurs **risques fréquents ou graves**, les alternatives, et les conséquences d'un refus. L'information est délivrée lors d'un **entretien individuel**, de façon **claire, loyale et adaptée**.","Chaque professionnel informe **dans son domaine de compétence** : le médecin pour le diagnostic et le traitement, l'infirmier pour les soins qu'il réalise. Le patient peut aussi demander à **ne pas être informé** d'un diagnostic, sauf si des tiers sont exposés à un risque de transmission."]},
  {t:"expliquer",qui:"avant un soin",txt:"« Je vais vous poser une sonde pour vider votre vessie. Ça peut être un peu désagréable mais ça dure quelques minutes. Le risque principal, c'est l'infection, c'est pour ça que je travaille de façon stérile. Avez-vous des questions avant que je commence ? »"}]},
 {h:"Le consentement",chip:"Consentement",b:[
  {t:"p",ps:["Aucun acte ni traitement ne peut être pratiqué **sans le consentement libre et éclairé** de la personne. **Libre** : sans pression. **Éclairé** : après une information compréhensible. Il peut être **retiré à tout moment**.","Le consentement est le plus souvent **oral**. Il est **écrit** dans certains cas prévus par la loi (don d'organes de son vivant, recherche, assistance médicale à la procréation…)."]},
  {t:"cols",cols:[{h:"Exceptions",tone:"amber",items:["Urgence vitale avec patient hors d'état de consentir","Soins psychiatriques sans consentement, dans le cadre légal","Certaines obligations de santé publique"]},{h:"Patient hors d'état de s'exprimer",tone:"blue",items:["On consulte la personne de confiance","À défaut la famille ou les proches","On tient compte des directives anticipées"]}]}]},
 {h:"Le refus de soin",chip:"Refus",b:[
  {t:"p",ps:["Un patient majeur et capable a le droit de **refuser un soin**, même vital. Le soignant doit alors s'assurer que la décision est **éclairée** : il informe des conséquences, cherche à comprendre les **raisons** du refus, propose un autre moment ou une alternative, et laisse un **délai de réflexion** quand c'est possible."]},
  {t:"etapes",items:["**Écouter** : peur, douleur, incompréhension, croyance ?","**Réexpliquer** le soin et ses enjeux, avec des mots simples.","Proposer de **reporter** ou de faire autrement.","**Informer** le médecin si le refus a des conséquences.","**Tracer** le refus, les informations données et les personnes prévenues."]},
  {t:"pieges",items:["Forcer un soin au motif que « c'est pour son bien »","Considérer un refus comme définitif sans en chercher la cause"]}]},
 {h:"Personne de confiance et directives anticipées",chip:"Confiance",b:[
  {t:"duo",items:[{tag:"Personne de confiance",tone:"green",txt:"Désignée **par écrit** par le patient majeur, **révocable** à tout moment",sub:"accompagne le patient, assiste aux entretiens s'il le souhaite, est consultée en priorité s'il ne peut plus s'exprimer"},{tag:"Personne à prévenir",tone:"blue",txt:"Simple **contact** en cas de besoin",sub:"n'a aucun rôle dans les décisions médicales"}]},
  {t:"p",ps:["Les **directives anticipées** sont les volontés écrites d'une personne sur sa fin de vie, pour le cas où elle ne pourrait plus s'exprimer. Elles sont **sans limite de durée**, modifiables à tout moment, et **s'imposent au médecin**, sauf urgence vitale le temps d'évaluer la situation, ou si elles sont manifestement inappropriées (décision collégiale)."]}]},
 {h:"Le secret professionnel",chip:"Secret",b:[
  {t:"p",ps:["Le secret couvre **tout ce qui est venu à la connaissance** du professionnel : ce qu'on lui a confié, mais aussi ce qu'il a **vu, entendu ou compris**. Sa violation est punie par l'article **226-13 du Code pénal**. Il s'applique aussi aux étudiants et survit au décès du patient."]},
  {t:"table",rows:[["Secret partagé","entre professionnels de la **même équipe de soins**, pour la prise en charge, sauf opposition du patient"],["Famille","pas d'information sans l'accord du patient ; en cas de pronostic grave, elle peut recevoir les informations utiles pour soutenir le patient, sauf s'il s'y oppose"],["Après le décès","les ayants droit peuvent accéder à certaines informations, pour des motifs précis"]]},
  {t:"table",rows:[["Obligations","déclaration de naissance, de décès, maladies à déclaration obligatoire"],["Permissions","signalement de sévices sur mineur ou personne vulnérable (Code pénal, art. 226-14)"]],note:"Dérogations au secret prévues par la loi."},
  {t:"pieges",items:["Parler d'un patient dans l'ascenseur ou au self","Donner des nouvelles par téléphone à quelqu'un qu'on ne peut pas identifier","Publier une photo du service sur les réseaux sociaux"]}]},
 {h:"Le dossier médical",chip:"Dossier",b:[
  {t:"p",ps:["Le patient peut accéder **directement** à son dossier, sans passer par un médecin. L'établissement doit le communiquer dans un délai de **8 jours**, ou de **2 mois** si les informations ont plus de 5 ans. Il peut aussi être consulté sur place, avec un accompagnement proposé."]}]},
 {h:"Mineurs et majeurs protégés",chip:"Personnes protégées",b:[
  {t:"p",ps:["Pour un **mineur**, les décisions sont prises par les **titulaires de l'autorité parentale**. Mais le mineur doit être **informé** à son niveau, et son **avis recherché**. Dans certains cas, un mineur peut s'opposer à ce que ses parents soient informés (par exemple pour une contraception ou une IVG) : il se fait alors accompagner d'un majeur de son choix.","Pour un **majeur protégé**, la mesure dépend du degré d'altération de ses facultés. Depuis 2020, la personne protégée **prend seule les décisions** relatives à sa santé dès qu'elle est en état de le faire ; sinon, la personne chargée de sa protection l'assiste ou la représente, selon la mesure."]},
  {t:"table",rows:[["Sauvegarde de justice","mesure temporaire, la personne conserve ses droits"],["Curatelle","la personne est **assistée** pour certains actes"],["Tutelle","la personne est **représentée** pour les actes de la vie civile"],["Habilitation familiale","un proche est autorisé par le juge à représenter ou assister"]]}]},
 {h:"Dignité, bientraitance et recours",chip:"Bientraitance",b:[
  {t:"liste",items:["Respect de la **dignité**, de l'**intimité**, de la **pudeur** et de la vie privée","Non-discrimination, respect des croyances dans la limite du bon fonctionnement du service","Droit au **soulagement de la douleur**","**Bientraitance** : culture de soins respectueuse, au-delà de l'absence de maltraitance","**Maltraitance** : physique, psychologique, financière, négligence ; on la signale"]},
  {t:"p",ps:["Le patient peut exprimer une réclamation auprès de l'établissement ; la **Commission des usagers** (CDU) veille au respect de ses droits. En cas de dommage, il peut saisir la commission de conciliation et d'indemnisation ou la justice."]},
  {t:"verif",items:[["Quelle différence entre personne de confiance et personne à prévenir ?","La personne de confiance, désignée par écrit, est consultée dans les décisions si le patient ne peut s'exprimer ; la personne à prévenir n'est qu'un contact."],["Un patient majeur peut-il refuser un soin vital ?","Oui, s'il est capable et informé des conséquences. Le soignant cherche à comprendre, réexplique et trace."],["Dans quel délai le dossier doit-il être communiqué ?","8 jours, ou 2 mois pour des informations de plus de 5 ans."],["Le secret s'applique-t-il aux étudiants ?","Oui, dans les mêmes conditions que pour les professionnels."]]}]}
 ],
 ["Loi du **4 mars 2002** : information, consentement, accès au dossier, personne de confiance","Consentement **libre et éclairé**, révocable ; le refus d'un patient capable se respecte","**Personne de confiance** écrite et consultée ; directives anticipées **sans limite de durée**","Secret : tout ce qui a été vu, entendu, compris ; **partagé** seulement dans l'équipe de soins","Mineur : avis recherché ; majeur protégé : décide seul **s'il en est capable**","Dignité, douleur, bientraitance : des **droits**, pas des options"])
);

CVS.push(
CV("relation-c","role","La relation soignant-soigné et la communication","50 min","4.2 1.1|D.1 B.2","face",
 ["Décrire les trois dimensions de la **communication**","Pratiquer l'**écoute active** et la **reformulation**","Expliquer les attitudes de **Rogers** et de **Porter**","Trouver la **juste distance** professionnelle","Conduire un **entretien infirmier**","Faire face aux **situations difficiles** : agressivité, pleurs, refus, annonce"],
 [
 {h:"Communiquer, c'est soigner",chip:"Enjeux",b:[
  {t:"p",ps:["La relation n'est pas un « plus » à côté des soins techniques : elle **fait partie du soin**. Un patient écouté exprime mieux sa douleur, comprend mieux son traitement, est moins anxieux et coopère davantage. La relation est aussi un outil d'**observation** : ce que dit et montre le patient est une donnée clinique.","La relation de soin est **asymétrique** : le patient est vulnérable, souvent dépendant, parfois en souffrance ; le soignant détient un savoir et un pouvoir. Cette asymétrie impose respect, prudence et éthique."]},
  {t:"analogie",txt:"Selon l'école de Palo Alto (Watzlawick), « **on ne peut pas ne pas communiquer** » : un soignant qui entre sans regarder le patient lui dit déjà quelque chose."}]},
 {h:"Les trois dimensions de la communication",chip:"Dimensions",b:[
  {t:"table",rows:[["Verbal","les mots choisis, le vocabulaire, la clarté"],["Paraverbal","le ton, le volume, le débit, les silences"],["Non-verbal","le regard, le visage, la posture, les gestes, la distance, le toucher"]]},
  {t:"p",ps:["Quand le verbal et le non-verbal se contredisent (« Je vous écoute » en regardant sa montre), c'est le **non-verbal** que le patient retient. Le soignant observe aussi le non-verbal du patient : un « ça va » accompagné d'un visage crispé n'est pas un « ça va »."]},
  {t:"liste",items:["Se placer **à hauteur** du patient, face à lui","Se présenter : prénom, fonction, raison de la venue","Un **toucher** respectueux et annoncé peut rassurer, il ne s'impose pas","Respecter la **distance** que le patient semble souhaiter"]}]},
 {h:"L'écoute active",chip:"Écoute active",b:[
  {t:"p",ps:["Écouter activement, c'est montrer au patient qu'on cherche **vraiment** à comprendre ce qu'il vit, sans juger, sans l'interrompre, sans plaquer ses propres solutions."]},
  {t:"table",rows:[["Questions ouvertes","« Comment vivez-vous l'hospitalisation ? » : le patient s'exprime librement"],["Questions fermées","« Avez-vous mal ? » : pour préciser une information"],["Reformulation reflet","« Vous dites que vous avez peur de l'opération… »"],["Reformulation écho","répéter un mot clé : « Inquiet ? »"],["Synthèse","« Si je résume, ce qui vous préoccupe, c'est… »"],["Silence","laisser le temps de réfléchir ou de pleurer"]]},
  {t:"exemple",h:"Reformuler",ps:["Patiente : « De toute façon, personne ne me dit rien ici. »","Réponse peu aidante : « Mais si, le médecin est passé ce matin ! » (on contredit)","Réponse aidante : « Vous avez l'impression de ne pas avoir assez d'informations sur ce qui vous arrive ? » (on reformule le ressenti)"]}]},
 {h:"Les attitudes de Rogers et de Porter",chip:"Rogers et Porter",b:[
  {t:"p",ps:["Le psychologue **Carl Rogers** a défini trois attitudes qui rendent une relation aidante. Elles sont à la base de la **relation d'aide**."]},
  {t:"table",rows:[["Empathie","comprendre ce que l'autre ressent, comme si on était à sa place, sans se confondre avec lui"],["Congruence","être authentique : ce qu'on dit correspond à ce qu'on ressent"],["Considération positive inconditionnelle","accepter la personne telle qu'elle est, sans jugement"]]},
  {t:"duo",items:[{tag:"Empathie",tone:"green",txt:"« Je comprends que vous soyez triste »",sub:"je reste soignant, je peux aider"},{tag:"Sympathie",tone:"coral",txt:"« Je suis triste avec vous »",sub:"je partage l'émotion, je risque de m'y perdre"}]},
  {t:"table",rows:[["Évaluation","juger : « Ce n'est pas raisonnable »"],["Interprétation","expliquer à sa place : « C'est parce que vous avez peur »"],["Soutien","rassurer : « Ne vous en faites pas »"],["Investigation","questionner pour en savoir plus"],["Solution","donner un conseil : « Vous devriez… »"],["Compréhension","reformuler pour vérifier qu'on a compris"]],note:"Les six attitudes spontanées décrites par Elias Porter. L'attitude de compréhension est la plus aidante dans un entretien d'aide."}]},
 {h:"La juste distance",chip:"Juste distance",b:[
  {t:"p",ps:["La **juste distance** se situe entre deux excès : trop **loin**, le soignant devient froid et technique ; trop **près**, il s'implique affectivement, perd son objectivité et s'épuise. Elle n'est pas fixe : elle s'ajuste à chaque patient et à chaque situation."]},
  {t:"liste",items:["Vouvoyer par défaut ; le tutoiement n'est pas une marque de proximité professionnelle","Ne pas donner son numéro personnel ni ajouter le patient sur les réseaux","Repérer ce qu'un patient réveille en nous (**contre-transfert**) et en parler en équipe","Savoir passer le relais quand une situation nous touche trop"]}]},
 {h:"L'entretien infirmier",chip:"Entretien",b:[
  {t:"table",rows:[["Entretien d'accueil","premier contact, recueil de données, présentation du service"],["Entretien de recueil","explorer un problème précis"],["Entretien d'aide","accompagner une souffrance, aider la personne à trouver ses ressources"],["Entretien d'éducation","transmettre des savoirs et des savoir-faire au patient"]]},
  {t:"etapes",items:["**Préparer** : objectif, lieu calme, temps disponible, dossier lu.","**Ouvrir** : se présenter, annoncer le but et la durée.","**Explorer** : questions ouvertes, écoute, reformulation.","**Conclure** : synthèse, suite prévue, questions du patient.","**Transmettre** ce qui est utile à l'équipe, dans le respect du secret."]}]},
 {h:"Les situations difficiles",chip:"Situations difficiles",b:[
  {t:"cols",cols:[{h:"Agressivité",tone:"coral",items:["Rester calme, voix posée","Garder une distance de sécurité, une sortie accessible","Reconnaître l'émotion : « Je vois que vous êtes en colère »","Ne pas rester seul, prévenir l'équipe","Tracer et déclarer"]},{h:"Pleurs, détresse",tone:"blue",items:["S'asseoir, rester présent","Accepter le silence","Proposer un mouchoir, pas une solution","« Voulez-vous m'en parler ? »"]}]},
  {t:"p",ps:["Après une **annonce** de diagnostic grave par le médecin, le patient retient souvent peu de chose. L'infirmier reprend avec lui, reformule, répond à ses questions dans son champ de compétence, et repère les réactions (sidération, colère, déni) qui sont des **mécanismes de défense** normaux."]},
  {t:"expliquer",qui:"à un patient agressif",txt:"« Je comprends que l'attente vous paraisse insupportable. Je ne peux pas vous laisser me crier dessus, mais je veux vous aider. Expliquez-moi ce qui se passe, on va voir ensemble ce qui est possible. »"}]},
 {h:"Adapter la communication",chip:"Adapter",b:[
  {t:"table",rows:[["Personne malentendante","se placer face à elle, articuler, ne pas crier, écrire si besoin, vérifier l'appareil"],["Personne âgée désorientée","phrases courtes, une information à la fois, repères, ne pas mettre en échec"],["Patient non francophone","interprète professionnel plutôt qu'un enfant ou un proche"],["Enfant","mots adaptés à son âge, jeu, présence des parents"],["Patient aphasique","questions fermées, pictogrammes, laisser le temps"]]},
  {t:"p",ps:["La communication **en équipe** compte autant : transmissions structurées (SAED), respect mutuel, droit de dire qu'on n'est pas sûr. Beaucoup d'événements indésirables graves ont une **erreur de communication** parmi leurs causes."]},
  {t:"pieges",items:["Parler du patient devant lui comme s'il n'était pas là","Utiliser un jargon médical","Rassurer trop vite (« Tout va bien se passer ») : le patient se sent incompris"]},
  {t:"verif",items:[["Quelles sont les trois attitudes de Rogers ?","Empathie, congruence, considération positive inconditionnelle."],["Quelle attitude de Porter est la plus aidante ?","L'attitude de compréhension, qui passe par la reformulation."],["Différence entre empathie et sympathie ?","L'empathie comprend le ressenti de l'autre sans le partager ; la sympathie partage l'émotion."],["Qui doit traduire pour un patient non francophone ?","De préférence un interprète professionnel."]]}]}
 ],
 ["La relation **fait partie du soin** et fournit des données cliniques","Verbal, paraverbal, **non-verbal** : c'est le non-verbal qui est retenu","Écoute active : questions ouvertes, **reformulation**, silence","Rogers : **empathie, congruence, considération positive**","**Juste distance** : ni froideur, ni fusion ; on en parle en équipe","Face à l'agressivité : calme, distance, reconnaissance de l'émotion, jamais seul"]),

CV("urgence-c","soins","Les soins d'urgence","55 min","4.3|B.3","alert",
 ["Donner une **alerte** efficace","Réaliser un bilan **ABCDE**","Reconnaître et prendre en charge un **arrêt cardiaque**","Agir face à une **obstruction** des voies aériennes et une **hémorragie**","Reconnaître un **choc**, une anaphylaxie, une convulsion, un malaise","Préparer et vérifier le **chariot d'urgence**"],
 [
 {h:"L'urgence : le cadre",chip:"Cadre",b:[
  {t:"p",ps:["Une **urgence vitale** est une situation où la vie est menacée à court terme. Face à elle, l'infirmier doit **reconnaître**, **alerter**, **agir** avec les gestes adaptés et **transmettre**. Ces gestes s'apprennent et s'entretiennent par l'**AFGSU** (attestation de formation aux gestes et soins d'urgence), niveaux 1 et 2, à renouveler tous les 4 ans.","À l'hôpital, l'infirmier peut, en urgence et en l'absence de médecin, mettre en œuvre des **protocoles de soins d'urgence** écrits, datés et signés, et réaliser les gestes conservatoires nécessaires."]},
  {t:"table",rows:[["15","SAMU, urgence médicale"],["18","pompiers"],["112","numéro d'urgence européen"],["114","urgence par SMS, pour les personnes sourdes ou ne pouvant parler"],["Numéro interne","équipe d'urgence vitale de l'établissement"]]}]},
 {h:"La chaîne de survie",chip:"Chaîne de survie",b:[
  {t:"schema",k:"survie"},
  {t:"p",ps:["Chaque maillon augmente les chances de survie. Sans massage, les chances diminuent de **10 % environ par minute** d'arrêt. Le massage et la défibrillation précoces sont les deux gestes qui sauvent le plus de vies."]}]},
 {h:"Le bilan ABCDE",chip:"ABCDE",b:[
  {t:"schema",k:"abcd"},
  {t:"p",ps:["On ajoute **E** pour **Exposition** : déshabiller pour chercher une hémorragie, une plaie, une éruption, et mesurer la température, en prévenant l'hypothermie. On traite chaque problème **avant de passer au suivant** : une voie aérienne obstruée tue avant une fracture."]},
  {t:"table",rows:[["A","voies aériennes : parle-t-il ? bruits, corps étranger, vomissements"],["B","respiration : FR, SpO₂, tirage, cyanose, symétrie"],["C","circulation : pouls, PA, recoloration, marbrures, saignement"],["D","neurologique : conscience (AVPU ou Glasgow), pupilles, glycémie"],["E","exposition : examen complet, température"]]}]},
 {h:"L'arrêt cardio-respiratoire",chip:"Arrêt cardiaque",b:[
  {t:"p",ps:["On reconnaît l'arrêt cardiaque à deux signes : la victime est **inconsciente** et **ne respire pas**, ou respire de façon anormale (**gasps**, respirations bruyantes et rares). On ne perd pas de temps à chercher le pouls si l'on n'est pas entraîné."]},
  {t:"etapes",items:["**Sécuriser** et vérifier la conscience (stimuler, parler).","Libérer les voies aériennes, **vérifier la respiration** moins de 10 secondes.","**Alerter** et demander le **défibrillateur** et le chariot d'urgence.","**Masser** : talon de la main au centre du thorax, bras tendus, **100 à 120 compressions/min**, **5 à 6 cm** de profondeur, relâchement complet.","**30 compressions, 2 insufflations** (avec un ballon et un masque à l'hôpital, oxygène dès que possible).","**Défibrillateur** posé dès son arrivée, suivre ses instructions, ne pas toucher la victime pendant l'analyse et le choc.","Se **relayer** toutes les 2 minutes pour garder un massage efficace."]},
  {t:"p",ps:["L'équipe médicale prend ensuite le relais : voie veineuse, adrénaline selon les recommandations, recherche de la cause. L'infirmier prépare le matériel, administre sur prescription et **note les heures** : début de l'arrêt, chocs, médicaments."]},
  {t:"pieges",items:["Interrompre le massage trop longtemps","Masser sur un matelas mou sans plan dur","Oublier de noter les horaires"]}]},
 {h:"Obstruction des voies aériennes",chip:"Étouffement",b:[
  {t:"cols",cols:[{h:"Obstruction partielle",tone:"amber",items:["La victime tousse, parle, respire","**Encourager à tousser**","Ne pas taper dans le dos","Surveiller, alerter si ça persiste"]},{h:"Obstruction totale",tone:"coral",items:["Ne peut ni parler, ni tousser, ni respirer","**5 claques dans le dos**, entre les omoplates","Puis **5 compressions abdominales** (Heimlich)","Alterner jusqu'à désobstruction","Si inconsciente : RCP"]}]},
  {t:"info",txt:"**Femme enceinte ou personne obèse** : compressions **thoraciques** au lieu d'abdominales. **Nourrisson** : claques dans le dos sur l'avant-bras, tête plus basse, puis compressions thoraciques avec deux doigts."}]},
 {h:"L'hémorragie externe",chip:"Hémorragie",b:[
  {t:"etapes",items:["**Comprimer** directement la plaie avec la main, protégée par des gants ou un pansement.","Allonger la victime, **alerter**.","Remplacer la main par un **pansement compressif** si possible.","Si la compression est inefficace ou impossible sur un membre : **garrot** au-dessus de la plaie, et **noter l'heure** de pose.","Surveiller : pouls, PA, conscience, signes de choc ; couvrir la victime."]},
  {t:"pieges",items:["Retirer un garrot posé : seul un médecin le fait","Retirer un objet planté dans une plaie"]}]},
 {h:"Le choc",chip:"Choc",b:[
  {t:"p",ps:["Le **choc** est une défaillance circulatoire : les organes ne reçoivent plus assez de sang et d'oxygène. Les signes sont communs, quelle que soit la cause : **tachycardie**, pouls filant, **hypotension**, **marbrures**, extrémités froides, sueurs, oligurie, angoisse puis troubles de conscience."]},
  {t:"table",rows:[["Hypovolémique","perte de sang ou d'eau : hémorragie, déshydratation, brûlure"],["Cardiogénique","la pompe défaille : infarctus, trouble du rythme"],["Septique","infection grave"],["Anaphylactique","allergie grave"]]},
  {t:"p",ps:["**Anaphylaxie** : urticaire, gonflement du visage ou de la gorge, gêne respiratoire, chute de tension après un médicament, un aliment ou une piqûre. Traitement de première ligne : **adrénaline intramusculaire** dans la face externe de la cuisse (chez l'adulte, 0,5 mg en général), selon protocole, et arrêt du produit en cause."]}]},
 {h:"Convulsions, malaise, hypoglycémie",chip:"Autres urgences",b:[
  {t:"cols",cols:[{h:"Convulsions",tone:"blue",items:["Protéger la tête, écarter les objets","**Ne rien mettre dans la bouche**","Ne pas contenir les mouvements","**Chronométrer** la crise","PLS après la crise","Au-delà de 5 minutes : état de mal, urgence"]},{h:"Malaise",tone:"amber",items:["Mettre au repos, allongé ou assis","Questionner : douleur, antécédents, traitements","Constantes et **glycémie capillaire**","ECG si douleur thoracique","Alerter, ne pas laisser seul"]}]},
  {t:"expliquer",qui:"à l'équipe d'urgence",txt:"« M. B., 67 ans, chambre 8, retrouvé inconscient à 14 h 10. Ne respire pas, massage débuté à 14 h 11, défibrillateur posé à 14 h 13, un choc délivré. Il est diabétique, hospitalisé pour une pneumopathie. »"}]},
 {h:"Le chariot d'urgence",chip:"Chariot",b:[
  {t:"liste",items:["Défibrillateur, scope, électrodes","Matériel de ventilation : ballon autoremplisseur, masques, canules, aspiration","Oxygène","Matériel de perfusion et de prélèvement","Médicaments d'urgence selon la liste de l'établissement","Planche à masser"]},
  {t:"liste",items:["**Vérification** régulière selon la procédure (souvent chaque semaine et après chaque utilisation)","**Scellé** numéroté qui garantit que rien n'a été utilisé","Contrôle des **péremptions** et du fonctionnement du défibrillateur","**Traçabilité** de chaque vérification"]},
  {t:"verif",items:[["Quels sont les deux signes d'un arrêt cardiaque ?","Victime inconsciente qui ne respire pas, ou respire anormalement (gasps)."],["Fréquence et profondeur du massage chez l'adulte ?","100 à 120 compressions par minute, 5 à 6 cm."],["Que fait-on face à une obstruction totale chez l'adulte ?","5 claques dans le dos, puis 5 compressions abdominales, en alternance."],["Que doit-on noter après la pose d'un garrot ?","L'heure de pose."],["Quelle voie pour l'adrénaline dans l'anaphylaxie ?","La voie intramusculaire, face externe de la cuisse."]]}]}
 ],
 ["**Reconnaître, alerter, agir, transmettre** ; AFGSU tous les 4 ans","Bilan **ABCDE** : on traite chaque étape avant la suivante","Arrêt : **30/2**, 100–120/min, 5–6 cm, **défibrillateur au plus tôt**","Obstruction totale : **5 claques + 5 compressions**","Hémorragie : **compression**, garrot si besoin avec l'heure","Choc : tachycardie, hypotension, marbrures ; anaphylaxie = **adrénaline IM**"])
);

CVS.push(
CV("injections-c","soins","Injections et perfusions","55 min","4.4 2.11|B.3","tube",
 ["Préparer une injection en **sécurité**","Réaliser une injection **intradermique**, **sous-cutanée**, **intramusculaire** et **intraveineuse**","Poser et surveiller une **voie veineuse périphérique**","Installer une perfusion par **gravité**, **pompe** ou **pousse-seringue**","Utiliser une **voie veineuse centrale** et une chambre implantable","Repérer et prévenir les **complications**"],
 [
 {h:"Avant toute injection",chip:"Préparation",b:[
  {t:"etapes",items:["**Prescription** complète et vérifiée ; règle des **5B**.","**Allergies** recherchées.","**Information** du patient et recueil de son consentement.","**Hygiène des mains**, plan de travail désinfecté, matériel réuni.","Préparation **sans interruption**, juste avant l'administration, pour un seul patient.","**Collecteur** à aiguilles à portée de main."]},
  {t:"liste",items:["Vérifier la **péremption** et l'aspect du produit (couleur, particules)","Ampoule en verre : utiliser une aiguille filtre si le protocole l'exige","Flacon multidose : date d'ouverture notée, désinfection du bouchon","Purger l'air de la seringue, sauf pour les seringues préremplies d'HBPM"]}]},
 {h:"Les quatre voies d'injection",chip:"Voies",b:[
  {t:"schema",k:"angles"},
  {t:"table",rows:[["Intradermique (ID)","angle 10–15°, biseau vers le haut ; petite papule ; tests tuberculiniques, allergologiques, BCG"],["Sous-cutanée (SC)","angle 45° à 90° selon le pli et l'aiguille ; insuline, HBPM, vaccins"],["Intramusculaire (IM)","angle 90° ; certains vaccins, antibiotiques, neuroleptiques retard"],["Intraveineuse (IV)","dans une veine ou sur une voie veineuse ; action immédiate"]]}]},
 {h:"L'injection sous-cutanée",chip:"SC",b:[
  {t:"etapes",items:["Choisir le site : **abdomen** (à distance du nombril), face externe des **bras**, **cuisses**.","Désinfecter selon le protocole et laisser sécher.","**Pincer un pli** cutané entre le pouce et l'index.","Piquer d'un geste franc, injecter **lentement**.","Retirer l'aiguille, relâcher le pli, **ne pas masser**.","Éliminer l'aiguille dans le collecteur, **changer de site** à chaque fois."]},
  {t:"schema",k:"sites"}]},
 {h:"L'injection intramusculaire",chip:"IM",b:[
  {t:"table",rows:[["Deltoïde","bras ; petits volumes (environ 1 à 2 mL), vaccins"],["Vaste latéral","face antéro-externe de la cuisse ; site de choix chez le nourrisson"],["Ventro-glutéal","hanche ; site recommandé chez l'adulte pour de plus grands volumes"],["Dorso-glutéal","quadrant supéro-externe de la fesse ; risque d'atteinte du nerf sciatique, de moins en moins utilisé"]]},
  {t:"etapes",items:["Repérer précisément le site, patient **détendu**.","Tendre la peau, piquer à **90°** d'un geste franc.","Aspirer si le protocole ou le produit l'exige (vérifier l'absence de sang).","Injecter **lentement**.","Retirer et comprimer quelques secondes."]},
  {t:"info",txt:"**Contre-indications** : traitement **anticoagulant** ou trouble de la coagulation (risque d'hématome profond), zone lésée ou paralysée, choc (absorption imprévisible)."}]},
 {h:"L'injection intraveineuse directe",chip:"IV directe",b:[
  {t:"p",ps:["L'IV directe (IVD) se fait le plus souvent sur une **voie veineuse en place**, par un robinet ou un site d'injection désinfecté. On vérifie d'abord que la voie est **perméable** (reflux sanguin, injection de sérum sans douleur ni gonflement)."]},
  {t:"liste",items:["**IV directe** : en quelques secondes à quelques minutes selon le produit","**IV lente** : sur plusieurs minutes, selon la prescription ou le RCP","**Rinçage** au sérum physiologique après l'injection","Surveillance du patient pendant et après : malaise, allergie, douleur au point d'injection"]},
  {t:"pieges",items:["Injecter trop vite un produit qui doit passer lentement","Injecter du **chlorure de potassium** en IV directe : jamais, risque d'arrêt cardiaque"]}]},
 {h:"La voie veineuse périphérique",chip:"VVP",b:[
  {t:"table",rows:[["14 G orange","gros débit, urgence vitale, transfusion massive"],["16 G gris","gros débit"],["18 G vert","transfusion, chirurgie"],["20 G rose","usage courant adulte"],["22 G bleu","veines fines, personne âgée"],["24 G jaune","enfant, nourrisson"]],note:"Plus le chiffre (en gauges) est grand, plus le cathéter est fin. Les couleurs sont normalisées."},
  {t:"etapes",items:["Choisir une veine du **membre supérieur**, de préférence l'avant-bras, en évitant les plis, le bras d'une fistule, d'un curage ganglionnaire ou d'une paralysie.","**Garrot** à environ 10 cm au-dessus, pas trop longtemps.","**Antisepsie** selon le protocole, sans repalper ensuite.","Piquer biseau vers le haut, voir le **reflux**, avancer le cathéter en retirant le mandrin.","**Desserrer le garrot**, connecter, rincer, fixer avec un **pansement transparent stérile**.","**Tracer** : date, heure, site, calibre, opérateur."]},
  {t:"cols",cols:[{h:"Complications",tone:"coral",items:["Phlébite : rougeur, chaleur, cordon induré","Diffusion : gonflement, peau froide","Infection","Hématome"]},{h:"Prévention",tone:"green",items:["Surveiller le point de ponction **plusieurs fois par jour**","**Réévaluer chaque jour** l'utilité du cathéter","Retirer dès qu'il ne sert plus","Changer selon le protocole de l'établissement"]}]}]},
 {h:"Les perfusions",chip:"Perfusions",b:[
  {t:"table",rows:[["Gravité","débit en gouttes/min réglé par la molette ; simple mais imprécis"],["Pompe volumétrique","débit en mL/h programmé ; précis ; alarmes"],["Pousse-seringue électrique","petits volumes, débits faibles et précis (mL/h)"]]},
  {t:"schema",k:"perfuseur"},
  {t:"etapes",items:["Vérifier la prescription : produit, volume, durée, débit.","Préparer la poche, ajouter les médicaments éventuels en asepsie, **étiqueter**.","**Purger** la tubulure entièrement, sans bulle d'air.","Connecter, régler le débit, vérifier l'écoulement.","**Surveiller** : débit, point de ponction, tolérance, volume restant.","Changer les tubulures selon le protocole (plus souvent pour les produits sanguins et lipidiques)."]},
  {t:"pieges",items:["Mélanger des produits **incompatibles** sur la même voie sans vérifier","Laisser une poche se vider complètement : risque d'obstruction ou d'entrée d'air","Ne pas étiqueter une seringue de PSE"]}]},
 {h:"Les voies veineuses centrales",chip:"Voies centrales",b:[
  {t:"table",rows:[["Cathéter veineux central","posé par un médecin dans une veine profonde (jugulaire, sous-clavière, fémorale)"],["PICC line","cathéter central inséré au bras ; plusieurs semaines à mois"],["Chambre implantable","boîtier sous la peau ; longue durée, chimiothérapie"]]},
  {t:"schema",k:"pac"},
  {t:"liste",items:["**Asepsie stricte** à chaque manipulation : masque, gants stériles selon le protocole","**Aiguille de Huber** pour une chambre implantable, changée selon le protocole","Vérifier le **reflux** avant toute injection","**Rinçage pulsé** au sérum physiologique (seringue de 10 mL au minimum pour ne pas abîmer le cathéter)","Surveiller : point de ponction, fièvre, frissons pendant le rinçage (infection), gonflement du bras ou du cou (thrombose)"]}]},
 {h:"Surveiller et tracer",chip:"Traçabilité",b:[
  {t:"trace",items:["Produit, dose, voie, heure","Site d'injection","Calibre et date de pose du cathéter","Débit et volume","Réactions observées","Retrait du cathéter"]},
  {t:"verif",items:[["Quel angle pour une IM ?","90°."],["Que signifie un cathéter vert ?","18 G, utilisé notamment pour la transfusion."],["Pourquoi ne pas faire d'IM sous anticoagulant ?","Risque d'hématome profond dans le muscle."],["Pourquoi une seringue d'au moins 10 mL pour rincer une voie centrale ?","Une petite seringue génère une pression trop élevée qui peut abîmer le cathéter."],["Faut-il purger la bulle d'une seringue préremplie d'HBPM ?","Non, selon les recommandations du fabricant."]]}]}
 ],
 ["Toujours : **prescription, 5B, allergie, hygiène, collecteur**","ID 10–15°, SC 45–90° avec pli, **IM 90°**, IV sur voie perméable","Pas d'IM sous **anticoagulant** ; jamais de **KCl en IV directe**","VVP : bon calibre, pansement transparent, **réévaluation quotidienne**","Voie centrale : **asepsie stricte**, reflux, rinçage pulsé","Tracer site, heure, débit, réactions"]),

CV("obstructifs-c","patho","Les processus obstructifs","55 min","2.8|B.1","alert",
 ["Expliquer le **mécanisme commun** à toutes les obstructions","Relier l'**athérosclérose** à l'infarctus, l'AVC et l'artériopathie","Prendre en charge un **syndrome coronarien aigu** et un **AVC**","Reconnaître une **ischémie aiguë** de membre, une **phlébite**, une **embolie pulmonaire**","Comprendre les obstructions **digestives**, **biliaires** et **urinaires**","Hiérarchiser les **urgences** liées à une obstruction"],
 [
 {h:"Le mécanisme commun",chip:"Mécanisme",b:[
  {t:"p",ps:["Le corps est traversé de **conduits** : artères, veines, bronches, intestin, voies biliaires, voies urinaires. Quand l'un d'eux se bouche, les conséquences suivent toujours la même logique : **en amont**, ce qui ne peut plus passer s'accumule et le conduit se distend ; **en aval**, les tissus ne reçoivent plus ce dont ils ont besoin.","Pour une **artère**, l'aval manque d'oxygène : c'est l'**ischémie**, puis la **nécrose** (mort des tissus). Pour un conduit d'évacuation (intestin, uretère), l'amont se distend et devient douloureux : c'est la **colique**."]},
  {t:"analogie",txt:"Une obstruction, c'est un **embouteillage** : derrière le bouchon, les voitures s'accumulent ; devant, la route est vide et les livraisons n'arrivent plus."},
  {t:"table",rows:[["Artère coronaire","infarctus du myocarde"],["Artère cérébrale","AVC ischémique"],["Artère d'un membre","ischémie aiguë, artériopathie"],["Veine profonde","phlébite, puis embolie pulmonaire"],["Intestin","occlusion"],["Voies biliaires","colique hépatique, cholécystite, angiocholite"],["Voies urinaires","colique néphrétique, rétention urinaire"],["Bronches","asthme, BPCO, corps étranger"]]}]},
 {h:"L'athérosclérose",chip:"Athérome",b:[
  {t:"schema",k:"artere"},
  {t:"p",ps:["L'athérosclérose est le dépôt progressif de **lipides** dans la paroi des artères, formant des **plaques d'athérome**. La plaque rétrécit l'artère (sténose) ; si elle se **rompt**, un caillot se forme dessus et peut boucher l'artère d'un coup. C'est le mécanisme commun de l'infarctus, de nombreux AVC et de l'artériopathie des membres."]},
  {t:"cols",cols:[{h:"Facteurs non modifiables",tone:"blue",items:["Âge","Sexe masculin (le risque augmente chez la femme après la ménopause)","Hérédité"]},{h:"Facteurs modifiables",tone:"coral",items:["**Tabac**","Hypertension","Diabète","Cholestérol (LDL)","Sédentarité, surpoids","Alcool, stress"]}]}]},
 {h:"Le syndrome coronarien aigu",chip:"Infarctus",b:[
  {t:"p",ps:["Une coronaire se bouche, le muscle cardiaque souffre puis meurt. La douleur typique est **rétrosternale**, en **serrement** ou en barre, prolongée (plus de 20 minutes), irradiant vers le bras gauche, la mâchoire ou le dos, non soulagée par le repos ni la trinitrine."]},
  {t:"table",rows:[["SCA avec sus-décalage du ST","artère complètement bouchée : désobstruction en urgence (angioplastie, ou thrombolyse si délai trop long)"],["SCA sans sus-décalage","obstruction partielle ou intermittente : traitement médical, coronarographie selon le risque"],["Troponine","marqueur sanguin de la nécrose ; dosée à l'arrivée puis répétée"]]},
  {t:"etapes",items:["**Repos strict**, ne pas laisser seul, rassurer.","**ECG** dans les 10 minutes.","**Alerter** le médecin (le 15 hors hôpital).","**Scope**, voie veineuse, bilan avec troponine.","Traitements prescrits : antiagrégants, anticoagulant, antalgique ; oxygène seulement si la saturation est basse.","Surveillance : douleur, constantes, rythme, signes d'insuffisance cardiaque."]}]},
 {h:"L'AVC ischémique",chip:"AVC",b:[
  {t:"schema",k:"avc"},
  {t:"p",ps:["Une artère cérébrale est bouchée par un caillot, venu d'une plaque d'athérome ou du cœur (fibrillation auriculaire). Le réflexe **VITE** permet de le reconnaître : Visage, Inertie d'un membre, Trouble de la parole, En urgence le 15.","Le pronostic dépend du délai : la **thrombolyse** (médicament qui dissout le caillot) est possible dans les premières heures, en général jusqu'à 4 h 30 après le début des signes ; la **thrombectomie** (retrait mécanique du caillot) peut être réalisée plus tard selon l'imagerie. D'où l'importance de **l'heure de début**."]},
  {t:"liste",items:["Patient **à jeun** jusqu'au test de déglutition","Surveillance neurologique, tension, glycémie, température","Prévention des fausses routes, des escarres, de la phlébite","Prévention secondaire : antiagrégants ou anticoagulants, statine, contrôle des facteurs de risque"]}]},
 {h:"L'ischémie aiguë des membres",chip:"Membres",b:[
  {t:"p",ps:["L'**artériopathie oblitérante des membres inférieurs** (AOMI) est un rétrécissement progressif des artères des jambes. Son signe typique est la **claudication intermittente** : douleur au mollet à la marche, qui oblige à s'arrêter et disparaît au repos.","L'**ischémie aiguë** survient quand l'artère se bouche brutalement : c'est une **urgence chirurgicale**, car le membre peut être perdu en quelques heures."]},
  {t:"signes",e:"Urgence",items:["Douleur brutale et intense","Pâleur","Froideur du membre","Absence de pouls","Fourmillements, engourdissement","Paralysie"]},
  {t:"info",txt:"Devant une jambe froide et douloureuse : **ne pas surélever** le membre, ne pas réchauffer avec une bouillotte, alerter en urgence."}]},
 {h:"Phlébite et embolie pulmonaire",chip:"Veines",b:[
  {t:"schema",k:"thrombose"},
  {t:"p",ps:["Ici, ce n'est pas une artère mais une **veine profonde** qui se bouche, le plus souvent au mollet. Le caillot peut se fragmenter et migrer jusqu'aux artères pulmonaires : c'est l'**embolie pulmonaire**. Les facteurs favorisants sont résumés par la **triade de Virchow** : stase sanguine, lésion de la paroi, hypercoagulabilité."]},
  {t:"cols",cols:[{h:"Phlébite",tone:"blue",items:["Mollet douloureux, chaud, gonflé","Perte du ballottement du mollet","Fébricule, pouls qui accélère","Écho-doppler pour confirmer"]},{h:"Embolie pulmonaire",tone:"coral",items:["Essoufflement brutal","Douleur thoracique","Tachycardie","Malaise, parfois crachats de sang","Angioscanner pour confirmer"]}]},
  {t:"liste",items:["Traitement : **anticoagulant** pendant plusieurs mois","Prévention : **lever précoce**, mobilisation, bas de contention et HBPM préventive selon prescription","Phlébite suspectée : **ne pas masser** la jambe, alerter"]}]},
 {h:"Les obstructions digestives et biliaires",chip:"Digestif",b:[
  {t:"schema",k:"occlusion"},
  {t:"p",ps:["L'**occlusion intestinale** associe douleurs, vomissements, arrêt des matières et des gaz et ballonnement. Causes : bride après chirurgie, tumeur, hernie étranglée, volvulus, ou iléus (intestin paralysé après une chirurgie ou sous morphine). Prise en charge : à jeun, sonde nasogastrique en aspiration, perfusion, parfois chirurgie."]},
  {t:"table",rows:[["Colique hépatique","calcul coincé dans les voies biliaires : douleur sous les côtes à droite, souvent après un repas gras"],["Cholécystite","inflammation de la vésicule : douleur + fièvre"],["Angiocholite","infection des voies biliaires : **douleur, puis fièvre, puis ictère** (triade de Charcot) ; urgence"],["Pancréatite","peut être provoquée par un calcul ; douleur intense en barre"]]}]},
 {h:"Les obstructions urinaires",chip:"Urinaire",b:[
  {t:"cols",cols:[{h:"Colique néphrétique",tone:"amber",items:["Calcul dans l'uretère","Douleur lombaire très intense, irradiant vers les organes génitaux","Agitation, le patient ne trouve pas de position","Sang dans les urines","Antalgiques, anti-inflammatoires selon prescription, filtrer les urines"]},{h:"Rétention aiguë d'urine",tone:"coral",items:["La vessie ne se vide plus : **globe vésical**","Douleur sus-pubienne, envie d'uriner sans y arriver","Agitation, confusion chez l'âgé","Bladder scan, sondage sur prescription"]}]},
  {t:"info",txt:"**Colique néphrétique avec fièvre**, ou chez un patient n'ayant qu'un rein, ou sans urines : c'est une **forme compliquée**, urgence urologique."}]},
 {h:"Hiérarchiser",chip:"Priorités",b:[
  {t:"table",rows:[["Urgence immédiate","arrêt de la circulation d'un organe vital : infarctus, AVC, embolie pulmonaire, ischémie aiguë de membre"],["Urgence dans les heures","occlusion avec signes de gravité, angiocholite, colique néphrétique compliquée"],["À surveiller de près","phlébite traitée, colique simple, rétention sondée"]]},
  {t:"expliquer",qui:"au patient après un infarctus",txt:"« Une des artères qui nourrissent votre cœur s'est bouchée. On l'a rouverte en posant un petit ressort, le stent. Les médicaments que vous prenez empêchent un nouveau caillot de se former : c'est pour ça qu'il ne faut jamais les arrêter sans l'avis du cardiologue. »"},
  {t:"verif",items:[["Que se passe-t-il en aval d'une artère bouchée ?","Une ischémie (manque d'oxygène), puis une nécrose si l'obstruction persiste."],["Qu'est-ce que la claudication intermittente ?","Une douleur du mollet à la marche, qui cède au repos, signe d'artériopathie."],["Quelle est la triade de Charcot ?","Douleur, fièvre, ictère, dans cet ordre : angiocholite."],["Pourquoi noter l'heure de début d'un AVC ?","Parce que les traitements de désobstruction ne sont possibles que dans un délai limité."],["Quels sont les éléments de la triade de Virchow ?","Stase sanguine, lésion de la paroi veineuse, hypercoagulabilité."]]}]}
 ],
 ["Toute obstruction : **accumulation en amont**, **manque en aval**","**Athérome** : cause commune de l'infarctus, de nombreux AVC et de l'artériopathie","Douleur thoracique : **ECG en 10 minutes** ; AVC : **heure de début** et VITE","Jambe froide, pâle, sans pouls : **ischémie aiguë**, urgence","Phlébite → embolie : **lever précoce**, anticoagulant, ne pas masser","Douleur + fièvre + ictère : **angiocholite** ; globe : bladder scan et sondage prescrit"])
);

CVS.push(
CV("psy1-c","patho","Psychiatrie 1 : anxiété, humeur et crise suicidaire","55 min","2.6 4.2|B.1 D.1","face",
 ["Décrire l'**examen** de l'état mental et le vocabulaire de base","Reconnaître les **troubles anxieux** et l'attaque de panique","Reconnaître une **dépression** et la distinguer du deuil","Comprendre le **trouble bipolaire**","Évaluer et prendre en charge une **crise suicidaire**","Connaître les **psychotropes** et le rôle infirmier"],
 [
 {h:"Les bases de la psychiatrie",chip:"Bases",b:[
  {t:"p",ps:["La **santé mentale** est un état de bien-être qui permet de faire face aux difficultés de la vie, de travailler et de participer à la vie sociale. Un trouble psychique se caractérise par une **souffrance** et une **altération du fonctionnement** qui durent dans le temps.","Les classifications internationales (**DSM-5** de l'Association américaine de psychiatrie, **CIM-11** de l'OMS) décrivent les troubles à partir de critères précis. On utilise encore parfois l'ancienne distinction **névrose** (le patient a conscience de son trouble) / **psychose** (perte de contact avec la réalité)."]},
  {t:"table",rows:[["Présentation","tenue, hygiène, contact, comportement"],["Humeur","tristesse, euphorie, irritabilité"],["Pensée","rythme (ralenti, accéléré), contenu (idées délirantes, idées suicidaires)"],["Perception","hallucinations"],["Conscience et vigilance","orientation, attention"],["Conscience des troubles","le patient se sait-il malade ?"]],note:"Ce qu'on observe lors de l'examen de l'état mental."}]},
 {h:"Les troubles anxieux",chip:"Anxiété",b:[
  {t:"p",ps:["L'anxiété est une émotion normale face à un danger. Elle devient un **trouble** quand elle est excessive, durable et qu'elle gêne la vie quotidienne."]},
  {t:"table",rows:[["Anxiété généralisée","inquiétude permanente, sur tout, depuis au moins 6 mois"],["Trouble panique","attaques de panique répétées et peur d'en refaire"],["Phobies","peur intense d'un objet ou d'une situation, évitement"],["Trouble obsessionnel compulsif","pensées intrusives (obsessions) et rituels pour les calmer (compulsions)"],["Stress post-traumatique","après un traumatisme : reviviscences, cauchemars, évitement, hypervigilance"]]},
  {t:"signes",e:"Attaque de panique",items:["Palpitations","Oppression thoracique","Sensation d'étouffer","Sueurs, tremblements","Vertiges","Peur de mourir ou de devenir fou"]},
  {t:"etapes",items:["Éliminer une **cause organique** : une douleur thoracique impose un ECG.","Rester **calme** et présent, parler doucement.","Isoler du bruit et de l'agitation.","Guider une **respiration lente** : inspirer par le nez, expirer longuement par la bouche.","Rassurer sur le caractère passager de la crise, transmettre."]}]},
 {h:"La dépression",chip:"Dépression",b:[
  {t:"p",ps:["L'épisode dépressif caractérisé associe, presque tous les jours pendant **au moins deux semaines**, une **humeur triste** ou une **perte d'intérêt et de plaisir** (anhédonie), avec d'autres symptômes, et un retentissement sur la vie quotidienne."]},
  {t:"liste",items:["Fatigue, ralentissement de la pensée et des gestes","Troubles du sommeil, souvent réveil précoce","Perte ou augmentation de l'appétit, du poids","Culpabilité, dévalorisation","Difficultés de concentration","**Idées de mort ou idées suicidaires**"]},
  {t:"duo",items:[{tag:"Deuil",tone:"blue",txt:"Tristesse liée à la **perte**, par vagues",sub:"l'estime de soi est préservée ; s'atténue avec le temps"},{tag:"Dépression",tone:"coral",txt:"Tristesse **envahissante**, constante",sub:"dévalorisation, culpabilité, idées suicidaires"}]},
  {t:"info",txt:"**Chez la personne âgée**, la dépression peut se présenter par des plaintes physiques, un repli, une perte d'appétit ou des troubles de mémoire : on parle parfois de « pseudo-démence »."}]},
 {h:"Le trouble bipolaire",chip:"Bipolarité",b:[
  {t:"p",ps:["Le trouble bipolaire alterne des épisodes **dépressifs** et des épisodes **maniaques** (ou hypomaniaques, moins intenses), séparés de périodes normales. Il débute souvent chez l'adulte jeune."]},
  {t:"signes",e:"Épisode maniaque",items:["Euphorie ou irritabilité","Besoin de sommeil très réduit","Parle vite, sans s'arrêter","Fuite des idées","Idées de grandeur","Dépenses, conduites à risque","Désinhibition"]},
  {t:"liste",items:["Traitement de fond : **thymorégulateurs** (lithium, certains antiépileptiques ou antipsychotiques)","Sous **lithium** : lithiémie régulière ; surdosage favorisé par la déshydratation, la fièvre, le régime sans sel, certains médicaments (diurétiques, AINS)","En phase maniaque : environnement calme, peu de stimulations, sommeil, alimentation, protection du patient (dépenses, décisions)"]}]},
 {h:"La crise suicidaire",chip:"Suicide",b:[
  {t:"p",ps:["En France, le suicide cause **près de 9 000 décès par an**, et les tentatives sont bien plus nombreuses. La **crise suicidaire** est un état de souffrance où la personne ne voit plus d'autre issue que la mort. C'est une crise **temporaire** : bien prise en charge, elle se résout."]},
  {t:"table",rows:[["**R**isque","facteurs : antécédent de tentative, trouble psychique, isolement, alcool, maladie, deuil, perte d'emploi, violences"],["**U**rgence","projet précis, date fixée, lettres, mise en ordre des affaires"],["**D**angerosité","moyen envisagé, accès à ce moyen (médicaments, arme, hauteur)"]],note:"La grille RUD permet d'évaluer le risque suicidaire."},
  {t:"etapes",items:["**Poser la question directement** : « Avez-vous pensé à vous donner la mort ? »","Explorer sans juger : depuis quand, comment, quand ?","**Ne jamais promettre le secret** : on explique qu'on doit en parler à l'équipe pour l'aider.","**Transmettre immédiatement** au médecin et à l'équipe.","**Sécuriser** l'environnement selon le protocole : médicaments, objets dangereux, fenêtres.","Assurer une **présence** et une surveillance adaptées ; mobiliser l'entourage avec son accord."]},
  {t:"analogie",txt:"Parler du suicide ne « donne pas l'idée » : c'est comme ouvrir une fenêtre dans une pièce où l'on étouffe. La personne se sent enfin entendue."},
  {t:"info",blue:true,txt:"Le **3114** est le numéro national de prévention du suicide, gratuit, joignable 24 h/24, pour les personnes en souffrance, leurs proches et les professionnels."}]},
 {h:"Les traitements",chip:"Traitements",b:[
  {t:"table",rows:[["Antidépresseurs (ISRS…)","effet après **2 à 4 semaines** ; au début, l'énergie revient avant l'humeur : risque suicidaire à surveiller ; ne pas arrêter brutalement"],["Anxiolytiques (benzodiazépines)","effet rapide ; somnolence, chutes, **dépendance** ; durée limitée (en général 12 semaines au maximum pour l'anxiété)"],["Hypnotiques","4 semaines au maximum en général"],["Thymorégulateurs","lithium, valproate… ; surveillance biologique"]]},
  {t:"liste",items:["**Psychothérapies** : thérapies cognitives et comportementales (TCC), psychodynamiques, systémiques (familiales)","Électroconvulsivothérapie dans certaines dépressions sévères","Activité physique, rythme de vie régulier, lien social"]},
  {t:"info",txt:"**Syndrome sérotoninergique** (surdosage ou association d'antidépresseurs) : agitation, tremblements, sueurs, fièvre, diarrhée, tachycardie. C'est une urgence."}]},
 {h:"Le rôle infirmier",chip:"Rôle infirmier",b:[
  {t:"liste",items:["**Accueil** et construction d'une relation de confiance","**Observation** : humeur, sommeil, alimentation, comportement, propos","**Entretiens** infirmiers, relation d'aide","Surveillance de l'**observance** et des **effets indésirables**","Évaluation **répétée** du risque suicidaire","Surveillance **somatique** : poids, tension, transit, douleur","Activités thérapeutiques, éducation du patient et de sa famille"]},
  {t:"expliquer",qui:"à un patient sous antidépresseur",txt:"« Ce médicament met deux à quatre semaines à agir sur le moral. Au début, vous pourriez vous sentir plus d'énergie avant de vous sentir mieux : si des idées noires reviennent, il est très important de nous en parler tout de suite. »"},
  {t:"verif",items:[["Combien de temps dure au minimum un épisode dépressif caractérisé ?","Au moins deux semaines."],["Que signifie RUD ?","Risque, Urgence, Dangerosité."],["Quel est le délai d'action d'un antidépresseur ?","Environ 2 à 4 semaines."],["Peut-on promettre le secret à un patient qui confie des idées suicidaires ?","Non : on lui explique qu'on doit transmettre à l'équipe pour l'aider."],["Citez trois signes d'attaque de panique.","Palpitations, sensation d'étouffer, peur de mourir (aussi : sueurs, vertiges, tremblements)."]]}]}
 ],
 ["Trouble psychique = **souffrance + altération du fonctionnement** qui durent","Attaque de panique : éliminer une cause organique, calme, **respiration lente**","Dépression : **2 semaines**, tristesse ou perte de plaisir, idées de mort à rechercher","Bipolarité : manie et dépression ; **lithium** = surveillance de la lithiémie","Suicide : **poser la question**, RUD, transmettre, sécuriser ; **3114**","Antidépresseur : **2–4 semaines** ; benzodiazépines : durée limitée, risque de dépendance"]),

CV("psy2-c","patho","Psychiatrie 2 : psychoses, addictions et soins sans consentement","55 min","2.6 1.3|B.1 A.2","eye",
 ["Reconnaître une **schizophrénie** et ses symptômes","Adopter la bonne **attitude** face à un délire ou une agitation","Connaître les **troubles de la personnalité** les plus fréquents","Comprendre les **addictions** et prendre en charge un **sevrage**","Reconnaître les **troubles du comportement alimentaire**","Expliquer le **cadre légal** des soins sans consentement, de l'isolement et de la contention"],
 [
 {h:"Les psychoses",chip:"Psychoses",b:[
  {t:"p",ps:["Une **psychose** est une perte de contact avec la réalité : idées délirantes, hallucinations, désorganisation. Le patient n'a pas toujours conscience d'être malade (**anosognosie**), ce qui complique l'adhésion aux soins."]},
  {t:"table",rows:[["Idée délirante","conviction fausse, inébranlable : persécution, grandeur, influence, jalousie"],["Hallucination","perception sans objet : surtout auditive (voix), aussi visuelle, tactile"],["Bouffée délirante aiguë","délire d'apparition brutale, souvent chez le jeune ; peut guérir sans récidive"],["Trouble délirant chronique","délire organisé, durable, sans désorganisation"]]}]},
 {h:"La schizophrénie",chip:"Schizophrénie",b:[
  {t:"p",ps:["La schizophrénie touche **environ 1 % de la population**. Elle débute le plus souvent entre **15 et 25 ans**, parfois de façon progressive (repli, baisse des résultats scolaires), parfois brutale. Son évolution est chronique, par phases, mais de nombreux patients se stabilisent avec un traitement et un accompagnement."]},
  {t:"cols",cols:[{h:"Symptômes positifs",tone:"coral",items:["Idées délirantes","Hallucinations"]},{h:"Symptômes négatifs",tone:"blue",items:["Retrait social","Émoussement des émotions","Perte d'élan (apragmatisme)","Pauvreté du discours"]}]},
  {t:"p",ps:["S'y ajoutent la **désorganisation** (discours incohérent, comportements bizarres) et des **troubles cognitifs** (attention, mémoire). Le risque **suicidaire** est élevé, ainsi que les problèmes de santé physique (tabac, surpoids, diabète)."]},
  {t:"liste",items:["**Antipsychotiques** : traitement de base, oraux ou injectables d'action prolongée ; surveillance du poids, de la glycémie, des lipides, de l'ECG, des effets neurologiques","**Réhabilitation psychosociale** : remédiation cognitive, éducation thérapeutique, logement, travail","Suivi en **secteur** : centre médico-psychologique (CMP), hôpital de jour, CATTP"]}]},
 {h:"Face au délire et à l'agitation",chip:"Attitude",b:[
  {t:"etapes",items:["Rester **calme**, à distance respectueuse, sans geste brusque.","**Ne pas argumenter** contre le délire, ni faire semblant d'y croire.","Reconnaître l'**émotion** : « Je vois que vous avez peur. »","Ramener à la **réalité** présente : où il est, qui vous êtes, ce qui va se passer.","Évaluer le **risque de passage à l'acte** : menaces, agitation croissante.","**Ne pas rester seul** ; prévenir l'équipe ; traitement selon prescription."]},
  {t:"expliquer",qui:"à un patient qui entend des voix",txt:"« Je n'entends pas ces voix, mais je crois que vous, vous les entendez, et que ça doit être très difficile. Qu'est-ce qu'elles vous disent ? Est-ce qu'elles vous demandent de faire quelque chose ? »"},
  {t:"pieges",items:["Se moquer ou contredire frontalement","Promettre ce qu'on ne pourra pas tenir pour calmer","Oublier la surveillance somatique : une confusion peut avoir une cause organique"]}]},
 {h:"Les troubles de la personnalité",chip:"Personnalité",b:[
  {t:"p",ps:["Un trouble de la personnalité est une façon **durable et rigide** de penser, ressentir et se comporter, qui provoque une souffrance ou des difficultés relationnelles importantes."]},
  {t:"table",rows:[["Borderline (état limite)","instabilité des émotions et des relations, peur de l'abandon, impulsivité, automutilations"],["Antisociale","mépris des règles et des autres, impulsivité, absence de culpabilité"],["Paranoïaque","méfiance, rigidité, sentiment d'être persécuté"],["Histrionique","besoin d'attirer l'attention, dramatisation"],["Évitante","grande sensibilité au rejet, timidité extrême"]]},
  {t:"p",ps:["Avec ces patients, l'équipe garde un **cadre clair et cohérent** : les mêmes règles appliquées par tous, des limites posées sans rejet."]}]},
 {h:"Les addictions",chip:"Addictions",b:[
  {t:"p",ps:["L'addiction est une **perte de contrôle** de la consommation d'un produit ou d'un comportement, malgré ses conséquences. Elle associe l'envie irrépressible (**craving**), la **tolérance** (il en faut plus pour le même effet) et souvent un **syndrome de sevrage** à l'arrêt."]},
  {t:"table",rows:[["Alcool","sevrage dangereux : risque de convulsions et de delirium tremens"],["Tabac","première cause de mortalité évitable ; substituts nicotiniques"],["Cannabis","troubles de la mémoire, de la motivation ; peut déclencher une psychose"],["Opioïdes","risque de surdose ; traitements de substitution (méthadone, buprénorphine) ; naloxone"],["Cocaïne, stimulants","risque cardiovasculaire (infarctus, AVC)"],["Benzodiazépines","dépendance ; sevrage progressif"],["Jeux, écrans","addictions comportementales"]]},
  {t:"etapes",items:["**Repérer** à l'entrée : consommation d'alcool et de produits, sans jugement.","**Surveiller** les signes de sevrage avec une échelle (Cushman par exemple) à la fréquence prescrite.","**Hydrater**, apporter de la **vitamine B1** selon prescription (prévention de l'encéphalopathie de Wernicke).","**Benzodiazépines** selon le protocole, adaptées au score.","Repérer le **delirium tremens** : confusion, hallucinations, fièvre, agitation intense : urgence."]},
  {t:"p",ps:["La posture infirmière repose sur l'**entretien motivationnel** : faire émerger les raisons de changer chez la personne, plutôt que de la convaincre ; et sur la **réduction des risques** : matériel stérile, information, naloxone, orientation vers les structures spécialisées (CSAPA, consultations d'addictologie)."]}]},
 {h:"Les troubles du comportement alimentaire",chip:"TCA",b:[
  {t:"cols",cols:[{h:"Anorexie mentale",tone:"coral",items:["Restriction alimentaire","Peur intense de grossir","Perception déformée de son corps","Souvent adolescente ou jeune femme","Risque vital : la mortalité est l'une des plus élevées en psychiatrie"]},{h:"Boulimie, hyperphagie",tone:"blue",items:["Crises de suralimentation avec perte de contrôle","Boulimie : comportements compensatoires (vomissements, laxatifs)","Hyperphagie : sans compensation","Honte, souvent cachée"]}]},
  {t:"liste",items:["Prise en charge **pluridisciplinaire** : psychiatre, somaticien, diététicien, psychologue, famille","Surveillance **somatique** : poids, fréquence cardiaque, tension, ionogramme (notamment le potassium après des vomissements)","La renutrition se fait **progressivement**, sous surveillance médicale : une renutrition trop rapide est dangereuse","Attitude : sans jugement, sans commentaire sur le corps, cadre de soins négocié"]}]},
 {h:"Les soins sans consentement",chip:"Cadre légal",b:[
  {t:"p",ps:["En psychiatrie, un patient peut être soigné **sans son consentement** lorsque ses troubles rendent impossible ce consentement et imposent des soins immédiats. Le cadre est fixé par le Code de la santé publique et contrôlé par le **juge**."]},
  {t:"table",rows:[["Soins à la demande d'un tiers (SDT)","un proche fait la demande ; deux certificats médicaux"],["SDT en urgence","risque grave d'atteinte à l'intégrité du malade ; un seul certificat"],["Soins pour péril imminent (SPI)","sans tiers disponible ; un certificat d'un médecin extérieur à l'établissement"],["Soins sur décision du représentant de l'État (SDRE)","arrêté du préfet quand la sûreté des personnes ou l'ordre public sont menacés"]]},
  {t:"liste",items:["Période d'**observation** de 72 heures avec certificats à 24 h et 72 h","Contrôle systématique par le **juge** avant le 12e jour","Possibilité de **programme de soins** en dehors de l'hôpital","Le patient est **informé** de ses droits et de ses voies de recours"]},
  {t:"p",ps:["**L'isolement et la contention** sont des pratiques de **dernier recours**, pour prévenir un dommage immédiat ou imminent. Ils sont décidés par un psychiatre, pour une durée limitée (en principe 12 heures pour l'isolement et 6 heures pour la contention, renouvelables dans des limites fixées par la loi, avec information du juge au-delà). Ils imposent une **surveillance rapprochée** et sont **tracés** dans un registre."]},
  {t:"verif",items:[["Différence entre symptômes positifs et négatifs ?","Positifs : ce qui s'ajoute (délire, hallucinations) ; négatifs : ce qui manque (retrait, émoussement, perte d'élan)."],["Pourquoi donner de la vitamine B1 lors d'un sevrage alcoolique ?","Pour prévenir l'encéphalopathie de Gayet-Wernicke, liée à une carence en vitamine B1."],["Combien de certificats pour des soins à la demande d'un tiers ?","Deux, sauf en urgence où un seul suffit."],["Qui contrôle une hospitalisation sans consentement ?","Le juge, avant le 12e jour puis régulièrement."],["Quelle attitude face à un délire ?","Ne pas argumenter ni y adhérer, reconnaître l'émotion, ramener à la réalité, évaluer le risque."]]}]}
 ],
 ["Psychose = **perte de contact avec la réalité**, souvent sans conscience du trouble","Schizophrénie : ~1 %, début **15–25 ans** ; symptômes positifs, négatifs, désorganisation","Délire : **ni contredire, ni adhérer** ; reconnaître l'émotion, évaluer le risque","Sevrage alcoolique : échelle, hydratation, **vitamine B1**, benzodiazépines ; delirium = urgence","TCA : prise en charge pluridisciplinaire, **renutrition progressive**","Soins sans consentement : SDT, SPI, SDRE ; **contrôle du juge** ; isolement et contention en dernier recours"])
);
CVS.forEach(c=>{const i=COURS.findIndex(x=>x.id===c.id);if(i>=0)COURS[i]=c;else COURS.unshift(c);});


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
