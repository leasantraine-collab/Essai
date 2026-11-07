/* Carnet IFSI — fiche « Préparer son stage efficacement » : calendrier, appel au service, affaires à préparer,
   révisions ciblées, objectifs, premier jour, posture, pendant le stage, prendre soin de soi (UE 6.1 | E.3 D.1).
   La check-list interactive « Mon sac de stage » est sur la page Stages (stages-hist.js). Chargé après guides-stage.js. */
(()=>{const L=[
X("preparer-stage","stage","Préparation","Préparer son stage efficacement","6.1 3.5|E.3 D.1","sheet",[
 [{t:"def",n:"01",h:"Pourquoi bien se préparer ?",chip:"Pourquoi",txt:"Un stage bien préparé, c'est un **premier jour serein**, des **objectifs clairs** et un tuteur qui comprend vite ce que vous savez faire. La préparation commence **deux à trois semaines avant** : elle ne demande pas beaucoup de temps, mais elle change tout le stage."},
  {t:"table",n:"02",h:"Le calendrier de préparation",chip:"Calendrier",rows:[
   ["J-21 à J-15","découvrir le service : spécialité, patients accueillis, pathologies fréquentes ; relire le **portfolio** et le bilan du stage précédent"],
   ["J-15 à J-7","**appeler le service** : horaires du premier jour, lieu de rendez-vous, tenue, vestiaire, repas, nom du tuteur"],
   ["J-7","**réviser de façon ciblée**, écrire ses **objectifs**, préparer les documents et les tenues, repérer le trajet"],
   ["La veille","préparer le **sac**, régler le réveil, dormir suffisamment"],
   ["Le jour J","arriver **10 minutes avant**, se présenter, observer, poser des questions"]],
   note:"Dans l'appli : Stages › Infos du stage lance le compte à rebours ; la check-list « Mon sac de stage » se coche et s'imprime."}],
 [{t:"liste",n:"03",h:"Appeler le service",chip:"Appeler",items:[
   "Se présenter : nom, prénom, IFSI, **semestre**, dates du stage",
   "Demander l'**heure et le lieu** de rendez-vous du premier jour",
   "La **tenue** : fournie ou non, chaussures, vestiaire et casier",
   "Le **repas** : self, réfrigérateur, temps de pause",
   "Le nom du **tuteur** ou du cadre, les documents à apporter",
   "Noter les réponses tout de suite (Stages › Infos du stage) et remercier"]},
  {t:"info",ico:"say",txt:"**Exemple** : « Bonjour, je m'appelle Camille Martin, étudiante infirmière en semestre 2 à l'IFSI de Lyon. Je viens en stage dans votre service du 4 au 29 mars : à quelle heure et où dois-je me présenter le premier jour, et quelle tenue faut-il prévoir ? »"},
  {t:"cols",n:"04",h:"Les affaires à préparer",chip:"Le sac",cols:[
   {h:"Tenue",tone:"green",items:["Tenues professionnelles si elles ne sont pas fournies (une par jour + une de rechange)","Chaussures **fermées**, lavables, antidérapantes et silencieuses","Élastiques ou pinces : **cheveux attachés**","Chaussettes de rechange"]},
   {h:"Dans la poche",tone:"blue",items:["**Montre à trotteuse** accrochée à la tunique","Stylo 4 couleurs et un stylo de secours","Petit **carnet** (jamais de nom de patient)","Badge ou carte d'étudiant","Petits ciseaux, stéthoscope : selon le service"]}]},
  {t:"cols",cols:[
   {h:"Documents",tone:"amber",items:["**Convention de stage** signée","**Portfolio** et feuilles d'évaluation","Feuille de présence ou d'horaires","**Objectifs de stage** écrits","Carnet de **vaccination** à jour (hépatite B notamment)","Attestation AFGSU si elle est demandée"]},
   {h:"Pratique",tone:"coral",items:["**Cadenas** pour le casier","Repas, gourde et encas","Sac pour ramener la tenue","Trajet repéré : transports, parking, temps de trajet","Téléphone chargé, rangé pendant les soins"]}]},
  {t:"text",ps:["**À laisser à la maison** : rien aux mains ni aux poignets, pour une hygiène des mains efficace."]},
  {t:"signes",e:"alerte",items:["Bagues et alliance","Montre-bracelet et bracelets","Vernis et faux ongles","Objets de valeur","Parfum fort"]}],
 [{t:"liste",n:"05",h:"Réviser de façon ciblée",chip:"Réviser",items:[
   "Les **3 à 5 pathologies** les plus fréquentes du service",
   "Les **médicaments** les plus utilisés et ce qu'il faut surveiller",
   "Les **soins techniques** du service : fiches de soins et vidéos des gestes",
   "Les **calculs de dose** et de débit (S'entraîner › Calculs)",
   "L'**anatomie et la physiologie** de base de la spécialité"]},
  {t:"info",ico:"bulb",txt:"Dans l'appli : **Stages › Par lieu de stage** liste pour 19 services les pathologies, les traitements, les soins rencontrés et des objectifs prêts à reprendre."},
  {t:"etapes",n:"06",h:"Écrire ses objectifs",chip:"Objectifs",items:[
   "Relire le bilan du stage précédent et ses **axes d'amélioration**",
   "Choisir **3 à 5 objectifs** adaptés au semestre et au service",
   "Les formuler avec un **verbe d'action** et un moyen de vérifier : « préparer et poser une perfusion chez 2 patients, sous le regard de l'infirmier »",
   "Les relier aux **compétences** du portfolio",
   "Les présenter au tuteur dès les premiers jours, les réajuster au **bilan de mi-stage**"]}],
 [{t:"table",n:"07",h:"Le premier jour",chip:"Jour J",rows:[
   ["Arriver","**10 minutes avant**, en tenue, cheveux attachés, mains et poignets nus"],
   ["Se présenter","à l'équipe et aux patients : prénom, étudiant·e infirmier·ère, semestre"],
   ["Repérer","chariot d'urgence et défibrillateur, issues de secours, salle de soins, protocoles, dossiers"],
   ["Demander","le tuteur, le planning, le livret d'accueil, les dates des bilans"],
   ["Observer","le déroulement de la journée, les transmissions, l'organisation de l'équipe"]]},
  {t:"duo",n:"08",h:"La bonne posture",chip:"Posture",items:[
   {tag:"À faire",tone:"green",txt:"Ponctualité, discrétion, **hygiène des mains**, vérifier l'**identité** avant chaque soin, demander quand on ne sait pas",sub:"« Je ne sais pas, pouvez-vous me montrer ? » est une preuve de sérieux, pas de faiblesse."},
   {tag:"À éviter",tone:"coral",txt:"Réaliser **seul·e** un soin qu'on ne maîtrise pas, le téléphone pendant les soins, parler des patients hors du service",sub:"Le secret professionnel s'applique aussi aux réseaux sociaux."}]},
  {t:"liste",n:"09",h:"Pendant le stage",chip:"Pendant",items:[
   "Remplir le **journal de bord** chaque jour (Stages › Carnet de suivi) : soins réalisés, situations, questions",
   "Demander des **retours** régulièrement, pas seulement au bilan",
   "Préparer le **bilan de mi-stage** : auto-évaluation des compétences, objectifs atteints ou à travailler",
   "Noter ses **heures** et faire signer la feuille de présence",
   "Repérer une situation pour l'**analyse de pratique**"]},
  {t:"cols",n:"10",h:"Prendre soin de soi",chip:"Soi",cols:[
   {h:"Santé",tone:"blue",items:["Sommeil, vrais repas, hydratation","Pauses prises, même courtes","Trajets et horaires anticipés"]},
   {h:"Soutien",tone:"green",items:["Parler d'une situation difficile au tuteur, au formateur référent ou entre étudiants","Accident d'exposition au sang : protocole AES **immédiat**","Difficulté avec l'encadrement : prévenir l'IFSI sans attendre"]}]},
  {t:"retenir",txt:"Un stage se prépare **en amont** : appeler le service, réviser de façon **ciblée**, écrire **3 à 5 objectifs**, préparer son **sac** la veille. Le jour J : arriver en avance, se présenter, observer, demander. Pendant le stage : journal de bord, retours réguliers, et jamais de soin non maîtrisé réalisé seul·e."}]
])
];
L.forEach(norm);
L.forEach(x=>{const list=x.chap?COURS:FICHES,i=list.findIndex(f=>f.id===x.id);if(i>=0)list[i]=x;else list.push(x);});})();
