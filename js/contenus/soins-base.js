/* Carnet IFSI — encyclopédie des soins et techniques infirmiers : 30 catégories, une fiche de cours par soin.
   Les fiches sont écrites dans un format texte compact (une ligne = une information, préfixée par une clé) et lues par SO().
   Clés : =Nom|id|statut (rp rôle propre, pm prescription, pr protocole, hab habilitation, col collaboration, urg urgence)
   a alias · d définition · i indication · ci contre-indication/précaution · r rôle IDE et cadre · m matériel · p préparation
   e étape · s surveillance · k risque · x erreur fréquente · t traçabilité · T transmission ciblée (Cible | D | A | R)
   u éducation · C situation clinique · Q question · o option (* = bonne réponse) · ex explication · q question de quiz · f fiches liées */
const SO_SECS=[
 ["hyg","Hygiène et confort","soins","4.1|B.3"],
 ["surv","Surveillance clinique et constantes","exam","4.4 3.1|B.3"],
 ["asep","Hygiène, asepsie et prévention des infections","soins","2.10 4.5|B.4"],
 ["med","Injections et administration des médicaments","soins","4.4 2.11|B.3"],
 ["perf","Perfusions et voies veineuses","soins","4.4|B.3"],
 ["prel","Prélèvements biologiques","exam","4.4|B.3"],
 ["pans","Pansements et soins des plaies","soins","4.4|B.3"],
 ["drain","Drains et dispositifs chirurgicaux","soins","4.4|B.3"],
 ["resp","Soins respiratoires","soins","4.4|B.3"],
 ["uri","Soins urinaires et élimination","soins","4.4|B.3"],
 ["dig","Soins digestifs et élimination intestinale","soins","4.4|B.3"],
 ["nutri","Nutrition et hydratation","soins","4.1 4.4|B.3"],
 ["mob","Mobilisation, ergonomie et prévention des chutes","soins","4.1|B.3"],
 ["periop","Soins préopératoires et postopératoires","soins","4.4 4.3|B.3"],
 ["urg","Urgences et gestes de premiers secours","soins","4.3|B.3"],
 ["diab","Soins en diabétologie","soins","4.4 4.6|B.3 C.1"],
 ["geria","Soins en gériatrie","soins","4.1 2.3|B.3"],
 ["pedia","Soins en pédiatrie et néonatologie","soins","4.4 2.2|B.3"],
 ["psy","Soins en psychiatrie","soins","4.2 2.6|B.3 D.1"],
 ["pallia","Soins palliatifs et fin de vie","soins","4.7|B.3"],
 ["onco","Soins en oncologie","soins","4.4 2.9|B.3"],
 ["dial","Soins en dialyse et néphrologie","soins","4.4|B.3"],
 ["stom","Stomies et dispositifs médicaux","soins","4.4|B.3"],
 ["vacc","Vaccination et prévention","soins","4.6|C.1"],
 ["dom","Soins à domicile et coordination","soins","3.3 4.6|B.3"],
 ["transf","Transfusion et produits sanguins","soins","4.4 4.5|B.3 B.4"],
 ["exam","Examens et explorations","exam","4.4|B.3"],
 ["rel","Soins relationnels et éducation thérapeutique","soins","4.2 4.6|D.1 C.1"],
 ["qual","Organisation, sécurité et qualité des soins","soins","4.5 4.8|B.4"],
 ["spec","Soins spécifiques et techniques complémentaires","soins","4.4|B.3"]
];
/* Liste des soins par catégorie, telle que fournie (une même fiche peut figurer dans plusieurs catégories). */
const SO_LISTE=`1. SOINS D'HYGIÈNE ET DE CONFORT
- Toilette complète au lit
- Toilette partielle au lit
- Toilette au lavabo
- Douche thérapeutique
- Aide à la toilette
- Toilette intime
- Toilette génitale
- Toilette périnéale
- Soins d'hygiène bucco-dentaire
- Soins de bouche chez le patient dépendant
- Soins de bouche chez le patient inconscient
- Soins des prothèses dentaires
- Soins des yeux
- Soins des oreilles
- Soins des cheveux
- Shampooing au lit
- Soins des ongles
- Soins des pieds
- Prévention des mycoses
- Habillage et déshabillage
- Réfection du lit occupé
- Réfection du lit inoccupé
- Installation au lit
- Installation au fauteuil
- Aide au lever et au coucher
- Aide à la marche
- Installation en position demi-assise
- Installation en décubitus dorsal
- Installation en décubitus latéral
- Installation en position ventrale
- Installation en position de Fowler
- Installation en position déclive
- Installation en position gynécologique
- Installation en position de sécurité
- Prévention de l'inconfort et des douleurs
- Respect de l'intimité et de la pudeur
2. SURVEILLANCE CLINIQUE ET CONSTANTES
- Prise de température
- Mesure de la fréquence cardiaque
- Mesure de la fréquence respiratoire
- Mesure de la pression artérielle
- Mesure de la saturation en oxygène (SpO2)
- Mesure de la douleur avec EVA
- Évaluation de la douleur avec EN
- Évaluation de la douleur avec EVS
- Évaluation de la douleur chez le patient non communicant
- Surveillance de l'état de conscience
- Score de Glasgow
- Surveillance neurologique
- Surveillance pupillaire
- Surveillance de la coloration cutanée
- Surveillance des téguments
- Surveillance des œdèmes
- Surveillance des marbrures
- Surveillance de la diurèse
- Surveillance des entrées et sorties hydriques
- Bilan hydrique
- Surveillance du poids
- Surveillance de la taille et de l'IMC
- Surveillance de la glycémie
- Surveillance de la fréquence des selles
- Surveillance du transit intestinal
- Surveillance des vomissements
- Surveillance des expectorations
- Surveillance des drains
- Surveillance des pertes sanguines
- Surveillance des signes de déshydratation
- Surveillance des signes infectieux
- Surveillance des signes de détresse respiratoire
- Surveillance des signes de choc
- Surveillance des signes d'aggravation clinique
- Surveillance des effets indésirables médicamenteux
- Évaluation de l'autonomie
- Évaluation du risque de chute
- Évaluation du risque d'escarre
- Échelles de surveillance clinique
3. HYGIÈNE, ASEPSIE ET PRÉVENTION DES INFECTIONS
- Hygiène des mains
- Friction hydroalcoolique
- Lavage simple des mains
- Lavage antiseptique des mains
- Port des équipements de protection individuelle (EPI)
- Utilisation des gants non stériles
- Utilisation des gants stériles
- Port du masque chirurgical
- Port du masque FFP2
- Port de la surblouse
- Préparation d'un champ stérile
- Technique aseptique
- Technique non stérile
- Antisepsie cutanée
- Désinfection des surfaces
- Gestion du matériel souillé
- Tri des déchets d'activités de soins à risques infectieux (DASRI)
- Gestion des objets piquants, coupants et tranchants (OPCT)
- Prévention des infections associées aux soins (IAS)
- Précautions standard
- Précautions complémentaires contact
- Précautions complémentaires gouttelettes
- Précautions complémentaires air
- Isolement septique
- Isolement protecteur
- Gestion d'une exposition au sang (AES)
- Nettoyage et désinfection du matériel
- Stérilisation et circuit du matériel
- Prévention des infections liées aux dispositifs invasifs
4. INJECTIONS ET ADMINISTRATION DES MÉDICAMENTS
- Préparation d'un traitement médicamenteux
- Vérification de la prescription
- Préparation d'un pilulier
- Administration par voie orale
- Administration par voie sublinguale
- Administration par voie buccale
- Administration par voie rectale
- Administration par voie vaginale
- Administration par voie cutanée
- Administration par voie transdermique
- Administration par voie oculaire
- Administration par voie auriculaire
- Administration par voie nasale
- Administration par voie inhalée
- Administration par voie sous-cutanée (SC)
- Administration par voie intramusculaire (IM)
- Administration par voie intradermique (ID)
- Injection intraveineuse directe (IVD)
- Injection intraveineuse lente
- Injection intraveineuse en bolus
- Injection dans une chambre implantable selon protocole et compétence
- Préparation d'une seringue
- Reconstitution d'un médicament injectable
- Dilution d'un médicament injectable
- Calcul de dose
- Calcul de débit
- Administration d'insuline
- Injection d'anticoagulant
- Injection d'adrénaline selon protocole
- Administration de morphiniques
- Administration de médicaments à risque
- Administration de médicaments écrasables
- Vérification de la compatibilité médicamenteuse
- Surveillance après administration
- Gestion d'un refus de traitement
- Gestion d'un oubli de traitement
- Traçabilité de l'administration
- Gestion des stupéfiants
5. PERFUSIONS ET VOIES VEINEUSES
- Pose d'un cathéter veineux périphérique (VVP)
- Préparation du matériel de perfusion
- Préparation d'une perfusion
- Branchement d'une perfusion
- Débranchement d'une perfusion
- Surveillance d'une perfusion
- Calcul du débit de perfusion
- Calcul du débit en gouttes/minute
- Calcul du débit en mL/heure
- Programmation d'un pousse-seringue électrique (PSE)
- Programmation d'une pompe à perfusion
- Administration de médicaments sur perfusion
- Administration de solutés de remplissage
- Administration de solutés glucosés
- Rinçage de voie veineuse selon protocole
- Verrouillage d'une voie veineuse selon protocole
- Réfection du pansement de VVP
- Surveillance du point de ponction
- Prévention des infections liées aux cathéters
- Surveillance d'une extravasation
- Surveillance d'une infiltration
- Surveillance d'une phlébite sur cathéter
- Gestion d'une obstruction de cathéter
- Ablation d'une VVP
- Pose et surveillance d'un cathéter veineux central selon habilitation
- Surveillance d'un cathéter central
- Réfection du pansement d'un cathéter central
- Manipulation d'un PICC line
- Surveillance d'un PICC line
- Manipulation d'une chambre implantable
- Accès à une chambre implantable selon compétence
- Retrait d'une aiguille de Huber selon compétence
- Prélèvement sur voie veineuse centrale selon protocole
6. PRÉLÈVEMENTS BIOLOGIQUES
- Prélèvement sanguin veineux
- Prélèvement sanguin capillaire
- Prélèvement artériel selon habilitation
- Gaz du sang artériel
- Glycémie capillaire
- Hémocultures
- Prélèvement urinaire
- Recueil d'urines de 24 heures
- Bandelette urinaire
- ECBU
- Prélèvement de selles
- Coproculture
- Recherche de sang dans les selles
- Prélèvement de crachats
- Examen cytobactériologique des crachats
- Prélèvement de gorge
- Prélèvement nasal
- Prélèvement nasopharyngé
- Prélèvement cutané
- Prélèvement de plaie
- Prélèvement mycologique
- Prélèvement vaginal
- Prélèvement de liquide de drainage
- Prélèvement de liquide de dialyse
- Recueil et identification des échantillons
- Étiquetage des prélèvements
- Conditionnement et acheminement au laboratoire
- Gestion des prélèvements urgents
7. PANSEMENTS ET SOINS DES PLAIES
- Pansement simple
- Pansement stérile
- Pansement complexe
- Pansement postopératoire
- Pansement de plaie aiguë
- Pansement de plaie chronique
- Pansement de plaie infectée
- Pansement de plaie cavitaire
- Pansement de plaie exsudative
- Pansement de plaie nécrotique
- Pansement de plaie hémorragique
- Pansement de plaie traumatique
- Pansement de plaie chirurgicale
- Pansement de plaie diabétique
- Pansement d'escarre
- Pansement d'ulcère veineux
- Pansement d'ulcère artériel
- Pansement de brûlure
- Pansement de greffe cutanée
- Pansement de site de prélèvement cutané
- Pansement de drain
- Pansement de cathéter
- Pansement avec hydrocolloïde
- Pansement avec hydrocellulaire
- Pansement avec alginate
- Pansement avec hydrofibre
- Pansement avec interface
- Pansement au charbon actif
- Pansement à l'argent
- Pansement par pression négative (TPN)
- Détersion mécanique
- Détersion autolytique
- Détersion enzymatique
- Nettoyage et irrigation d'une plaie
- Évaluation d'une plaie
- Mesure de la profondeur d'une plaie
- Évaluation de l'exsudat
- Évaluation de la cicatrisation
- Surveillance des signes d'infection
- Ablation de fils
- Ablation d'agrafes
- Surveillance d'une cicatrice
- Prévention des escarres
- Classification des escarres
- Évaluation du risque d'escarre
- Utilisation des supports de prévention
8. DRAINS ET DISPOSITIFS CHIRURGICAUX
- Surveillance d'un drain de Redon
- Surveillance d'un drain de Blake
- Surveillance d'un drain de Penrose
- Surveillance d'un drain de Kehr
- Surveillance d'un drain thoracique
- Surveillance d'un drain abdominal
- Surveillance d'un drain biliaire
- Surveillance d'un drain aspiratif
- Surveillance d'un drain gravitaire
- Mesure des quantités drainées
- Surveillance de l'aspect des liquides drainés
- Vidange d'un réservoir de drainage
- Maintien de l'aspiration
- Surveillance de l'étanchéité
- Prévention de l'arrachement des drains
- Ablation d'un drain selon prescription et compétence
- Surveillance des dispositifs postopératoires
9. SOINS RESPIRATOIRES
- Administration d'oxygène
- Installation d'une oxygénothérapie
- Surveillance de l'oxygénothérapie
- Réglage du débit d'oxygène selon prescription
- Pose de lunettes à oxygène
- Pose de masque à oxygène
- Masque à haute concentration
- Aérosolthérapie
- Nébulisation
- Administration de bronchodilatateurs inhalés
- Utilisation d'une chambre d'inhalation
- Utilisation d'un inhalateur doseur
- Utilisation d'un inhalateur de poudre sèche
- Éducation à l'utilisation des inhalateurs
- Surveillance d'une ventilation non invasive (VNI)
- Surveillance d'une ventilation mécanique
- Surveillance d'une trachéotomie
- Soins de trachéotomie
- Changement de canule selon compétence
- Nettoyage de canule
- Aspiration trachéale selon protocole et compétence
- Aspiration des sécrétions bronchiques
- Soins de stomie respiratoire
- Surveillance de la fréquence respiratoire
- Surveillance des expectorations
- Installation en position facilitant la respiration
- Kinésithérapie respiratoire
- Surveillance d'une détresse respiratoire
- Préparation à une fibroscopie bronchique
10. SOINS URINAIRES ET ÉLIMINATION
- Pose d'une sonde urinaire à demeure
- Pose d'une sonde urinaire évacuatrice
- Sondage urinaire intermittent
- Sondage urinaire chez la femme
- Sondage urinaire chez l'homme
- Ablation d'une sonde urinaire
- Surveillance d'une sonde vésicale
- Entretien d'une sonde urinaire
- Vidange d'une poche à urines
- Changement de poche à urines
- Surveillance de la diurèse
- Mesure de la diurèse horaire
- Surveillance des urines
- Lavage vésical selon prescription et protocole
- Irrigation vésicale
- Gestion d'une rétention aiguë d'urine
- Gestion d'une incontinence urinaire
- Pose et surveillance d'un étui pénien
- Réalisation d'un bladder scan
- Surveillance d'une néphrostomie
- Soins d'une néphrostomie
- Surveillance d'une cystostomie
- Soins d'une urostomie
- Soins d'une stomie urinaire
11. SOINS DIGESTIFS ET ÉLIMINATION INTESTINALE
- Pose d'une sonde nasogastrique
- Vérification de la position d'une sonde selon protocole
- Surveillance d'une sonde nasogastrique
- Ablation d'une sonde nasogastrique
- Aspiration gastrique
- Administration par sonde nasogastrique
- Nutrition entérale
- Surveillance d'une nutrition entérale
- Pose et surveillance d'une sonde de gastrostomie
- Soins de gastrostomie
- Administration par gastrostomie
- Soins de jéjunostomie
- Lavement évacuateur
- Lavement médicamenteux
- Extraction manuelle d'un fécalome selon prescription
- Surveillance du transit intestinal
- Surveillance des selles
- Recueil des selles
- Soins de stomie digestive
- Soins de colostomie
- Soins d'iléostomie
- Changement d'appareillage de stomie
- Irrigation d'une colostomie selon prescription
- Surveillance du débit d'une stomie
- Surveillance des complications de stomie
- Éducation du patient stomisé
12. NUTRITION ET HYDRATATION
- Évaluation de l'état nutritionnel
- Calcul de l'IMC
- Évaluation de la perte de poids
- Surveillance des apports alimentaires
- Surveillance des apports hydriques
- Aide à la prise des repas
- Installation pour le repas
- Prévention des fausses routes
- Alimentation à texture modifiée
- Alimentation mixée
- Alimentation enrichie
- Administration de compléments nutritionnels oraux (CNO)
- Surveillance de la nutrition entérale
- Surveillance de la nutrition parentérale
- Gestion d'une pompe de nutrition
- Prévention de la déshydratation
- Surveillance du syndrome de renutrition inappropriée
- Éducation nutritionnelle
13. MOBILISATION, ERGONOMIE ET PRÉVENTION DES CHUTES
- Mobilisation au lit
- Retournement du patient
- Repositionnement régulier
- Transfert lit-fauteuil
- Transfert fauteuil-lit
- Aide au lever
- Aide au coucher
- Aide à la marche
- Utilisation du déambulateur
- Utilisation des cannes
- Utilisation des béquilles
- Utilisation du fauteuil roulant
- Utilisation du verticalisateur
- Utilisation du lève-personne
- Mobilisation d'un patient hémiplégique
- Mobilisation d'un patient paraplégique
- Mobilisation postopératoire
- Prévention des chutes
- Évaluation du risque de chute
- Prévention des complications de l'immobilisation
- Prévention des rétractions articulaires
- Prévention des thromboses liées à l'immobilisation
- Installation avec coussins de positionnement
- Utilisation des barrières de lit selon indication
- Respect des règles d'ergonomie soignante
- Gestes et postures professionnelles
14. SOINS PRÉOPÉRATOIRES ET POSTOPÉRATOIRES
- Préparation cutanée préopératoire
- Douche préopératoire selon protocole
- Préparation du patient au bloc opératoire
- Vérification de l'identité
- Vérification du dossier opératoire
- Vérification du jeûne préopératoire
- Vérification des allergies
- Préparation des dispositifs médicaux
- Surveillance préopératoire
- Accueil du patient en SSPI
- Surveillance au retour de SSPI
- Surveillance postopératoire immédiate
- Surveillance des constantes postopératoires
- Surveillance de la douleur postopératoire
- Surveillance des saignements
- Surveillance de la cicatrice
- Surveillance des drains
- Surveillance de la reprise du transit
- Surveillance de la reprise de la diurèse
- Surveillance de la reprise alimentaire
- Prévention des complications thromboemboliques
- Prévention des complications respiratoires
- Mobilisation précoce
- Réfection du pansement postopératoire
- Ablation des fils et agrafes
- Préparation à la sortie
- Éducation postopératoire
15. URGENCES ET GESTES DE PREMIERS SECOURS
- Évaluation initiale du patient
- Approche ABCDE
- Reconnaissance d'un arrêt cardiorespiratoire
- Alerte et organisation des secours
- Réanimation cardiopulmonaire (RCP)
- Massage cardiaque externe
- Ventilation au ballon autoremplisseur
- Utilisation du défibrillateur automatisé externe (DAE)
- Défibrillation manuelle selon habilitation
- Surveillance après réanimation
- Prise en charge d'une obstruction des voies aériennes
- Prise en charge d'une fausse route
- Prise en charge d'une détresse respiratoire
- Prise en charge d'un malaise
- Prise en charge d'une syncope
- Prise en charge d'une hypoglycémie
- Prise en charge d'une hyperglycémie
- Prise en charge d'une crise convulsive
- Prise en charge d'une douleur thoracique
- Prise en charge d'un AVC suspecté
- Prise en charge d'une hémorragie externe
- Compression manuelle d'une hémorragie
- Pose d'un garrot selon indications et formation
- Prise en charge d'un choc anaphylactique
- Prise en charge d'un choc hémorragique
- Prise en charge d'un sepsis
- Prise en charge d'une brûlure
- Prise en charge d'une plaie traumatique
- Prise en charge d'un traumatisme
- Prise en charge d'une intoxication
- Prise en charge d'une hypothermie
- Prise en charge d'un coup de chaleur
- Prise en charge d'un patient polytraumatisé
- Préparation du matériel d'urgence
16. SOINS EN DIABÉTOLOGIE
- Glycémie capillaire
- Surveillance glycémique
- Injection d'insuline
- Utilisation d'un stylo à insuline
- Utilisation d'une pompe à insuline
- Surveillance d'une pompe à insuline
- Pose et surveillance d'un capteur de glucose
- Lecture d'un système de mesure continue du glucose
- Gestion d'une hypoglycémie
- Gestion d'une hyperglycémie
- Surveillance d'une acidocétose
- Surveillance d'un pied diabétique
- Soins des pieds diabétiques
- Dépistage des lésions du pied
- Éducation à l'insulinothérapie
- Éducation à l'autosurveillance glycémique
- Prévention des complications du diabète
17. SOINS EN GÉRIATRIE
- Évaluation de l'autonomie
- Évaluation de la dépendance
- Évaluation du risque de chute
- Prévention des escarres
- Prévention de la dénutrition
- Prévention de la déshydratation
- Prévention des troubles de la marche
- Accompagnement d'un patient désorienté
- Prise en charge d'un patient atteint de démence
- Prévention du syndrome confusionnel
- Surveillance du comportement
- Prévention de la perte d'autonomie
- Aide aux activités de la vie quotidienne
- Soins de confort
- Accompagnement des aidants
- Prévention de la contention
- Surveillance d'une contention lorsqu'elle est légalement indiquée
- Prévention de la iatrogénie
- Évaluation de la douleur chez la personne âgée
18. SOINS EN PÉDIATRIE ET NÉONATALOGIE
- Accueil d'un enfant hospitalisé
- Évaluation de la douleur pédiatrique
- Prise de constantes chez l'enfant
- Prise de température chez le nourrisson
- Pesée du nourrisson
- Mesure de la taille
- Mesure du périmètre crânien
- Administration de médicaments pédiatriques
- Calcul de dose pédiatrique
- Administration de traitements liquides
- Surveillance d'une perfusion pédiatrique
- Surveillance d'une bronchiolite
- Surveillance d'une déshydratation
- Prévention des fausses routes
- Soins du cordon ombilical
- Soins du nouveau-né
- Soins de développement du prématuré
- Surveillance de l'ictère néonatal
- Photothérapie néonatale
- Surveillance de l'alimentation du nourrisson
- Accompagnement de l'allaitement
- Préparation des biberons selon protocole
- Soins de siège
- Éducation des parents
- Prévention des accidents domestiques
19. SOINS EN PSYCHIATRIE
- Accueil d'un patient en psychiatrie
- Entretien infirmier
- Observation clinique psychiatrique
- Évaluation de l'état psychique
- Évaluation du risque suicidaire
- Prévention du passage à l'acte suicidaire
- Surveillance d'un patient en crise
- Gestion d'une situation d'agitation
- Désescalade verbale
- Gestion de l'agressivité
- Accompagnement d'un patient délirant
- Accompagnement d'un patient halluciné
- Surveillance des effets indésirables des psychotropes
- Surveillance d'un traitement neuroleptique
- Surveillance d'un traitement par lithium
- Surveillance d'un syndrome malin des neuroleptiques
- Surveillance d'un syndrome sérotoninergique
- Accompagnement du sevrage alcoolique
- Accompagnement des addictions
- Prévention des conduites à risque
- Mise en place d'une relation thérapeutique
- Gestion d'une crise d'angoisse
- Accompagnement des troubles du comportement alimentaire
- Soins en chambre d'isolement selon cadre légal
- Surveillance d'une mesure d'isolement
- Surveillance d'une mesure de contention
- Respect des droits du patient en psychiatrie
20. SOINS PALLIATIFS ET ACCOMPAGNEMENT DE FIN DE VIE
- Évaluation de la douleur
- Évaluation de la dyspnée
- Soins de bouche
- Soins de confort
- Installation du patient
- Prévention des escarres
- Accompagnement de l'alimentation et de l'hydratation
- Surveillance des symptômes
- Administration des traitements antalgiques
- Surveillance d'une PCA morphinique
- Utilisation d'une pompe à morphine selon prescription
- Surveillance d'une sédation
- Accompagnement de l'agonie
- Soins de fin de vie
- Soins après décès
- Accompagnement des proches
- Soutien psychologique
- Respect des directives anticipées
- Accompagnement du deuil
- Coordination des soins palliatifs à domicile
21. SOINS EN ONCOLOGIE
- Accueil d'un patient en oncologie
- Surveillance d'une chimiothérapie
- Préparation à une chimiothérapie
- Administration de chimiothérapie selon habilitation
- Surveillance d'une perfusion de chimiothérapie
- Manipulation sécurisée des cytotoxiques
- Prévention des risques liés aux cytotoxiques
- Surveillance d'une immunothérapie
- Surveillance d'une hormonothérapie
- Surveillance d'une radiothérapie
- Soins de bouche en oncologie
- Prévention des mucites
- Surveillance des nausées et vomissements
- Surveillance d'une neutropénie
- Surveillance d'une neutropénie fébrile
- Surveillance des thrombopénies
- Surveillance de l'anémie
- Soins de chambre implantable
- Surveillance d'une extravasation
- Surveillance des effets secondaires des traitements
- Accompagnement nutritionnel
- Accompagnement psychologique
22. SOINS EN DIALYSE ET NÉPHROLOGIE
- Accueil du patient dialysé
- Préparation à une séance d'hémodialyse
- Surveillance pendant l'hémodialyse
- Surveillance après hémodialyse
- Surveillance du poids sec
- Surveillance de la fistule artérioveineuse (FAV)
- Surveillance du thrill et du souffle
- Protection du bras porteur de FAV
- Compression après ponction de FAV
- Surveillance d'un cathéter de dialyse
- Surveillance d'une dialyse péritonéale
- Réalisation des échanges de dialyse péritonéale selon compétence
- Prévention des infections liées à la dialyse
- Surveillance du bilan hydrique
- Surveillance des troubles électrolytiques
- Éducation du patient insuffisant rénal
23. SOINS DE STOMIES ET DISPOSITIFS MÉDICAUX
- Soins de colostomie
- Soins d'iléostomie
- Soins d'urostomie
- Changement de poche de stomie
- Mesure du diamètre de stomie
- Surveillance de la peau péristomiale
- Prévention des irritations péristomiales
- Gestion des fuites
- Éducation du patient stomisé
- Surveillance d'une gastrostomie
- Surveillance d'une trachéotomie
- Surveillance d'une sonde urinaire
- Surveillance d'une sonde nasogastrique
- Surveillance d'un drain
- Surveillance d'une voie veineuse
- Surveillance d'un cathéter central
- Surveillance d'une chambre implantable
- Entretien des dispositifs médicaux
- Prévention des infections associées aux dispositifs
24. VACCINATION ET PRÉVENTION
- Préparation d'une vaccination
- Vérification du statut vaccinal
- Administration d'un vaccin selon compétences
- Injection intramusculaire vaccinale
- Injection sous-cutanée vaccinale
- Surveillance après vaccination
- Gestion d'un malaise post-vaccinal
- Gestion d'une réaction allergique
- Traçabilité vaccinale
- Éducation à la vaccination
- Dépistage des infections
- Dépistage du diabète
- Dépistage de l'hypertension
- Dépistage de la dénutrition
- Dépistage des troubles cognitifs
- Prévention des infections
- Prévention des maladies cardiovasculaires
- Prévention des chutes
- Prévention des escarres
- Éducation à la santé
- Actions de prévention et promotion de la santé
25. SOINS À DOMICILE ET COORDINATION DES SOINS
- Première visite infirmière à domicile
- Évaluation de l'environnement du patient
- Évaluation des besoins en soins
- Organisation d'une tournée infirmière
- Préparation du matériel de soins à domicile
- Gestion du matériel stérile et non stérile
- Gestion des déchets de soins à domicile
- Soins d'hygiène à domicile
- Pansements à domicile
- Injections à domicile
- Perfusions à domicile
- Surveillance des traitements
- Administration des traitements préparés
- Surveillance des constantes à domicile
- Surveillance d'un patient chronique
- Surveillance d'un patient en perte d'autonomie
- Éducation thérapeutique à domicile
- Coordination avec le médecin traitant
- Coordination avec les professionnels paramédicaux
- Coordination avec les services d'aide à domicile
- Transmissions avec les structures de soins
- Préparation d'une hospitalisation
- Préparation d'un retour à domicile
- Prévention des risques au domicile
- Gestion des urgences à domicile
- Accompagnement des aidants
- Suivi des patients en soins palliatifs à domicile
26. TRANSFUSION ET PRODUITS SANGUINS
- Vérification de la prescription transfusionnelle
- Vérification de l'identité du patient
- Contrôle des documents transfusionnels
- Réalisation du contrôle ultime prétransfusionnel
- Pose d'une voie veineuse adaptée
- Administration d'un concentré de globules rouges
- Administration d'un concentré plaquettaire
- Administration de plasma thérapeutique
- Surveillance d'une transfusion
- Surveillance des constantes pendant transfusion
- Reconnaissance d'un accident transfusionnel
- Conduite à tenir devant une réaction transfusionnelle
- Traçabilité transfusionnelle
- Hémovigilance
27. SOINS LIÉS AUX EXAMENS ET EXPLORATIONS
- Préparation à une prise de sang
- Préparation à un ECG
- Réalisation d'un électrocardiogramme (ECG) selon formation et organisation
- Pose d'un Holter ECG
- Pose d'un Holter tensionnel
- Préparation à une radiographie
- Préparation à un scanner
- Préparation à une IRM
- Préparation à une échographie
- Préparation à une échographie cardiaque
- Préparation à une endoscopie digestive
- Préparation à une coloscopie
- Préparation à une fibroscopie bronchique
- Préparation à une cystoscopie
- Préparation à une ponction lombaire
- Préparation à une ponction pleurale
- Préparation à une ponction d'ascite
- Surveillance après une ponction lombaire
- Surveillance après une ponction pleurale
- Surveillance après une ponction d'ascite
- Préparation à une biopsie
- Surveillance après biopsie
- Préparation à une scintigraphie
- Préparation à un examen avec produit de contraste
- Surveillance d'une réaction au produit de contraste
28. SOINS RELATIONNELS ET ÉDUCATION THÉRAPEUTIQUE
- Accueil et installation du patient
- Recueil de données
- Entretien infirmier
- Écoute active
- Communication thérapeutique
- Relation d'aide
- Information du patient
- Recueil du consentement
- Respect du refus de soins
- Éducation thérapeutique du patient (ETP)
- Accompagnement d'une maladie chronique
- Accompagnement de l'observance thérapeutique
- Éducation à la prise des médicaments
- Éducation à l'autosurveillance
- Préparation à la sortie
- Accompagnement des proches
- Gestion d'une situation conflictuelle
- Gestion d'une annonce difficile en équipe
- Transmissions orales
- Transmissions écrites
- Transmissions ciblées
- Dossier de soins infirmiers
29. ORGANISATION, SÉCURITÉ ET QUALITÉ DES SOINS
- Identification du patient
- Vérification de l'identitovigilance
- Gestion des risques liés aux soins
- Déclaration d'un événement indésirable
- Gestion d'une erreur médicamenteuse
- Prévention des erreurs de soins
- Gestion des médicaments à risque
- Gestion des stupéfiants
- Traçabilité des actes
- Planification des soins
- Priorisation des soins
- Coordination interprofessionnelle
- Transmissions ciblées
- Démarche de soins
- Raisonnement clinique infirmier
- Projet de soins infirmiers
- Évaluation des résultats des soins
- Gestion du matériel d'urgence
- Vérification du chariot d'urgence
- Gestion des stocks de matériel
- Contrôle des dates de péremption
- Prévention des accidents d'exposition au sang
- Prévention des risques professionnels
- Respect du secret professionnel
- Respect de la confidentialité
- Gestion de la sécurité du patient
30. SOINS SPÉCIFIQUES ET TECHNIQUES COMPLÉMENTAIRES
- Prélèvement de sang sur fistule selon cadre de compétence
- Surveillance d'une pompe PCA
- Surveillance d'une pompe à insuline
- Surveillance d'une pompe à nutrition
- Surveillance d'un dispositif de pression négative
- Surveillance d'une stomie complexe
- Surveillance d'une plaie par pression négative
- Surveillance d'un drain thoracique
- Surveillance d'une sonde gastrique en aspiration
- Surveillance d'une perfusion sous-cutanée (hypodermoclyse)
- Pose et surveillance d'une perfusion sous-cutanée selon compétence
- Surveillance d'un patient sous contention
- Surveillance d'un patient porteur d'une sonde de gastrostomie
- Surveillance d'un patient porteur d'une trachéotomie
- Surveillance d'un patient porteur d'une ventilation à domicile
- Surveillance d'un patient sous oxygénothérapie à domicile
- Surveillance d'un patient porteur d'un pacemaker
- Surveillance d'un patient porteur d'un défibrillateur implantable
- Surveillance d'un patient porteur d'une prothèse
- Surveillance d'un patient porteur d'un dispositif médical implantable`;
const SO_SEC={},SO_IDX={};SO_SECS.forEach(([id,nom,cat,u],k)=>{SO_SEC[id]={id,nom,cat,u,n:k+1,names:[]};SO_IDX[k+1]=id;});
(()=>{let cur=null;SO_LISTE.split("\n").forEach(l=>{const m=l.match(/^(\d+)\. /);if(m){cur=SO_SEC[SO_IDX[+m[1]]];return;}if(cur&&l.startsWith("- "))cur.names.push(l.slice(2).trim());});})();
const SOINS=[],SOBY={};
function SO(sec,txt){
 txt.split(/\n(?==)/).forEach(b=>{b=b.trim();if(!b.startsWith("="))return;const L=b.split("\n"),h=L[0].slice(1).split("|").map(x=>x.trim());
  const o={n:h[0],i:h[1],s:sec,st:(h[2]||"rp").split(/\s+/),nn:[],d:[],ind:[],ci:[],r:[],mat:[],prep:[],et:[],surv:[],ri:[],err:[],tr:[],T:null,edu:[],cas:null,q:[],f:[]};
  let cq=null;
  L.slice(1).forEach(l=>{l=l.trim();if(!l)return;let sp=l.indexOf(" "),k=sp<0?l:l.slice(0,sp),v=sp<0?"":l.slice(sp+1).trim();
   switch(k){
    case"a":o.nn.push(v);break;case"d":o.d.push(v);break;case"i":o.ind.push(v);break;case"ci":o.ci.push(v);break;case"r":o.r.push(v);break;
    case"m":o.mat.push(v);break;case"p":o.prep.push(v);break;case"e":o.et.push(v);break;case"s":o.surv.push(v);break;case"k":o.ri.push(v);break;
    case"x":o.err.push(v);break;case"t":o.tr.push(v);break;case"T":o.T=v.split(/\s*\|\s*/);break;case"u":o.edu.push(v);break;
    case"C":o.cas={s:v,q:"",o:[],a:0,e:""};cq=o.cas;break;case"Q":if(o.cas)o.cas.q=v;break;
    case"q":cq={q:v,o:[],a:0,e:""};o.q.push(cq);break;
    case"o":if(cq){if(v.startsWith("*")){cq.a=cq.o.length;v=v.slice(1).trim();}cq.o.push(v);}break;
    case"ex":if(cq)cq.e=v;break;case"f":o.f.push(...v.split(/\s+/));break;
    default:console.warn("Soins : clé inconnue",k,"dans",o.n);}
  });
  if(SOBY[o.i])console.warn("Soins : identifiant en double",o.i);SOINS.push(o);SOBY[o.i]=o;});
}
