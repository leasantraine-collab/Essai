/* Carnet IFSI — assistant « Projet de soins guidé » (outil de la boîte à outils).
   1. Situation (patient, pathologies, contexte, recueil) → 2. problèmes proposés et justifiés →
   3. formulation (lié à… / se manifestant par…), objectif, actions, évaluation → 4. vérification et création de la feuille « Projet de soins ».
   Chargé après feuilles.js et outils.js, avant app.js (actions « ps- », champs data-ps). Le brouillon est enregistré sur l'appareil. */

/* ---------- Bibliothèque des problèmes ----------
   t : r = diagnostic infirmier réel, x = diagnostic infirmier de risque, c = problème en collaboration (risque de complication)
   b : besoin de Virginia Henderson (1 à 14) ; p : priorité (1 = vitale) ; g : accord de « lié » (f, p) ; kw : mots repérés dans les fiches pathologies
   fl : facteurs liés ; mf : manifestations ; ob : objectifs types ; ac : actions [texte, rôle] (p = rôle propre, s = sur prescription, c = collaboration) ; ev : critères d'évaluation */
const PS_LIB=[
 {id:"respi",l:"Respiration inefficace",t:"r",b:1,p:1,g:"f",kw:/dyspn|essouffl|polypn|orthopn|détresse respiratoire|insuffisance respiratoire|hypox|désaturation|SpO2 basse|bronchospasme/,
  fl:["l'atteinte pulmonaire (infection, inflammation)","la bronchoconstriction","l'œdème pulmonaire (insuffisance cardiaque)","l'encombrement bronchique","la douleur thoracique qui limite l'ampliation","l'anxiété","la position allongée","l'anémie"],
  mf:["une FR > 22/min","une SpO₂ < 92 % en air ambiant","des signes de lutte (tirage, battement des ailes du nez)","une respiration superficielle","une cyanose des lèvres ou des extrémités","une parole entrecoupée","une orthopnée (ne supporte pas d'être allongé)","une sensation de manque d'air"],
  ob:["Le patient retrouvera une FR entre 12 et 20/min et une SpO₂ ≥ 94 % (≥ 88 % si BPCO) d'ici 24 h.","Le patient exprimera une diminution de sa gêne respiratoire dans l'heure suivant l'installation et l'oxygénothérapie.","Le patient ne présentera pas de signes de lutte respiratoire pendant son hospitalisation."],
  ac:[["Surveiller FR, SpO₂, signes de lutte, coloration et conscience toutes les … h","p"],["Installer en position demi-assise, jambes légèrement fléchies","p"],["Administrer l'oxygène au débit prescrit (lunettes, masque) et en surveiller l'efficacité","s"],["Administrer les aérosols et traitements prescrits, évaluer leur effet","s"],["Planifier les soins pour limiter les efforts, laisser des temps de repos","p"],["Rassurer, rester présent, expliquer chaque soin","p"],["Alerter le médecin si FR > 25, SpO₂ < seuil, troubles de conscience","p"]],
  ev:["FR et SpO₂ dans les objectifs","Disparition des signes de lutte","Ressenti du patient (échelle de dyspnée)","Gaz du sang si prescrits"]},
 {id:"encomb",l:"Dégagement inefficace des voies respiratoires",t:"r",b:1,p:1,kw:/encombr|crachat|expector|sécrétion|bronchorr|toux grasse|râles|mucovisc/,
  fl:["des sécrétions abondantes et épaisses","une toux inefficace (faiblesse, douleur)","l'infection bronchique","une hydratation insuffisante","l'alitement","des troubles de conscience"],
  mf:["des râles bronchiques à l'auscultation","une toux grasse inefficace","des crachats abondants (couleur, aspect)","une respiration bruyante","une désaturation qui s'améliore après la toux"],
  ob:["Le patient expectorera efficacement ses sécrétions d'ici 48 h.","Le patient aura une respiration silencieuse, sans râles, d'ici la fin de la semaine."],
  ac:[["Surveiller l'aspect et la quantité des crachats, l'auscultation, la SpO₂","p"],["Aider à tousser efficacement (position assise, toux dirigée, maintien de la cicatrice)","p"],["Hydrater suffisamment (sauf restriction) pour fluidifier les sécrétions","p"],["Réaliser les aérosols prescrits","s"],["Lever et mobiliser le patient le plus tôt possible","p"],["Aspirer les sécrétions si nécessaire, de façon aseptique","s"],["Travailler avec le kinésithérapeute (drainage, désencombrement)","c"]],
  ev:["Expectorations efficaces","Auscultation, bruits respiratoires","SpO₂","Aspect des crachats"]},
 {id:"fausse-route",l:"Risque de fausse route",t:"x",b:2,p:1,kw:/fausses? routes?|déglutition|dysphagie|inhalation|pneumopathie d'inhalation/,
  fl:["des troubles de la déglutition (AVC, maladie neurologique)","des troubles de la vigilance","un âge avancé","une mauvaise position pendant le repas","une sonde nasogastrique","une sécheresse buccale"],
  ob:["Le patient s'alimentera et boira sans fausse route pendant toute l'hospitalisation."],
  ac:[["Réaliser ou faire réaliser un test de déglutition avant de faire boire ou manger","p"],["Installer assis à 90°, tête légèrement fléchie, pendant et 30 min après le repas","p"],["Adapter les textures (mixé, haché, eau gélifiée) selon l'évaluation","c"],["Rester présent, proposer de petites bouchées, sans distraction","p"],["Surveiller toux au repas, voix mouillée, fièvre, encombrement","p"],["Réaliser les soins de bouche","p"],["Avoir le matériel d'aspiration prêt","p"]],
  ev:["Absence de toux ou d'étouffement au repas","Absence de fièvre et d'encombrement","Quantités consommées"]},
 {id:"denutri",l:"Dénutrition",t:"r",b:2,p:3,g:"f",kw:/dénutri|amaigr|perte de poids|cachex|anorexie|malabsorption|albumine basse|IMC bas/,
  fl:["une perte d'appétit (anorexie)","des nausées ou des troubles du goût","des besoins augmentés (infection, cancer, plaie)","des difficultés à mâcher ou à avaler","l'isolement ou la dépendance pour les repas","des troubles digestifs (diarrhée, malabsorption)","un état dépressif"],
  mf:["une perte de poids de … kg en … mois","un IMC < 18,5 (< 21 après 70 ans)","une albumine basse","une fonte musculaire, une fatigue","des repas consommés à moins de la moitié"],
  ob:["Le patient consommera au moins les trois quarts de ses repas d'ici une semaine.","Le patient stabilisera son poids (pesée hebdomadaire) d'ici la sortie."],
  ac:[["Peser le patient chaque semaine à la même heure, calculer l'IMC","p"],["Remplir une fiche alimentaire sur 3 jours","p"],["Adapter les menus aux goûts et aux textures, fractionner, enrichir","c"],["Proposer les compléments nutritionnels prescrits, entre les repas","s"],["Installer confortablement pour les repas, aider si besoin","p"],["Réaliser les soins de bouche, vérifier les prothèses dentaires","p"],["Demander l'avis de la diététicienne","c"]],
  ev:["Poids et IMC","Quantités consommées (fiche alimentaire)","Albumine si prescrite"]},
 {id:"denutri-r",l:"Risque de dénutrition",t:"x",b:2,p:3,kw:/anorexie|perte d'appétit|chimiothérapie|mucite|nausées/,
  fl:["une perte d'appétit","un âge avancé","une maladie chronique ou un cancer","la dépendance pour les repas","des troubles de la déglutition","une hospitalisation prolongée"],
  ob:["Le patient maintiendra son poids pendant l'hospitalisation."],
  ac:[["Peser à l'entrée puis chaque semaine","p"],["Surveiller les quantités consommées","p"],["Adapter les repas (goûts, textures, fractionnement)","c"],["Aider à l'installation et à la prise des repas","p"]],
  ev:["Poids stable","Repas consommés"]},
 {id:"deshydra",l:"Risque de déshydratation",t:"x",b:2,p:2,kw:/déshydrat|diarrh|vomiss|polyurie|fièvre|canicule|diurétique/,
  fl:["des pertes digestives (diarrhée, vomissements)","la fièvre","une diminution de la sensation de soif (âge)","la dépendance pour boire","un traitement diurétique","une forte chaleur"],
  ob:["Le patient boira au moins 1,5 L par jour (sauf restriction) pendant l'hospitalisation.","Le patient ne présentera pas de signes de déshydratation (pli cutané, muqueuses sèches, oligurie) pendant l'hospitalisation."],
  ac:[["Proposer à boire régulièrement, laisser l'eau à portée de main","p"],["Surveiller la diurèse, la couleur des urines, le poids","p"],["Surveiller les signes de déshydratation (pli cutané, muqueuses, TA, confusion)","p"],["Tenir un bilan entrées-sorties","p"],["Poser et surveiller la perfusion prescrite","s"]],
  ev:["Quantités bues","Diurèse et poids","Absence de signes de déshydratation","Ionogramme si prescrit"]},
 {id:"nausees",l:"Nausées et vomissements",t:"r",b:2,p:2,g:"p",kw:/nausée|vomiss/,
  fl:["la chimiothérapie ou les opioïdes","l'anesthésie (post-opératoire)","une occlusion ou une gastro-entérite","l'hypertension intracrânienne","l'anxiété"],
  mf:["des vomissements (nombre, aspect, horaires)","une sensation de nausée exprimée","un refus de manger","une pâleur, des sueurs"],
  ob:["Le patient exprimera une diminution de ses nausées dans les 2 h suivant l'antiémétique.","Le patient ne vomira plus d'ici 24 h."],
  ac:[["Évaluer nausées et vomissements (fréquence, aspect, quantité)","p"],["Administrer l'antiémétique prescrit, si possible avant le facteur déclenchant","s"],["Installer en position demi-assise ou latérale, à distance des odeurs","p"],["Proposer de petites quantités, froides, fractionnées","p"],["Réaliser les soins de bouche après chaque vomissement","p"],["Surveiller l'hydratation et le ionogramme","p"]],
  ev:["Nombre de vomissements","Nausées exprimées","Alimentation reprise","Hydratation"]},
 {id:"glycemie",l:"Risque de complication : déséquilibre glycémique",t:"c",b:2,p:2,kw:/diabèt|glycém|insulin|hypoglyc|hyperglyc|acidocét|corticoïde/,
  fl:["le diabète et son traitement (insuline, sulfamides)","une infection ou une chirurgie","une alimentation irrégulière","un traitement par corticoïdes","l'effort ou le jeûne"],
  ob:["Le patient aura des glycémies entre … et … g/L pendant l'hospitalisation.","Le patient ne présentera pas d'hypoglycémie pendant l'hospitalisation."],
  ac:[["Contrôler la glycémie capillaire aux horaires prescrits","s"],["Administrer l'insuline selon la prescription et le protocole","s"],["Surveiller les signes d'hypoglycémie (sueurs, tremblements, confusion) et resucrer selon le protocole","p"],["Vérifier la prise des repas avant l'insuline rapide","p"],["Rechercher la cétonurie si glycémie > 2,5 g/L","s"],["Éduquer à l'autosurveillance et aux signes d'alerte","p"]],
  ev:["Glycémies dans l'objectif","Absence d'hypoglycémie","Autonomie pour l'autosurveillance"]},
 {id:"deglut",l:"Trouble de la déglutition",t:"r",b:2,p:1,kw:/dysphagie|trouble de la déglutition|déglutition difficile/,
  fl:["une atteinte neurologique (AVC, Parkinson, SLA, démence)","une tumeur ORL ou de l'œsophage","une sécheresse ou une mucite buccale"],
  mf:["une toux pendant ou après le repas","une voix mouillée","des repas longs, des aliments gardés en bouche","une perte de poids"],
  ob:["Le patient s'alimentera sans fausse route avec une texture adaptée d'ici 48 h."],
  ac:[["Faire évaluer la déglutition (orthophoniste)","c"],["Adapter textures et liquides (eau gélifiée)","c"],["Installer assis, tête fléchie, rester présent pendant le repas","p"],["Surveiller la toux, la voix, la température","p"]],
  ev:["Absence de fausse route","Repas consommés","Poids"]},
 {id:"constip",l:"Constipation",t:"r",b:3,p:3,g:"f",kw:/constip|fécalome/,
  fl:["l'alitement et la diminution de l'activité","un traitement par opioïdes","une alimentation pauvre en fibres","une hydratation insuffisante","le manque d'intimité","une maladie neurologique"],
  mf:["l'absence de selles depuis … jours","des selles dures, des efforts de poussée","un ballonnement, des douleurs abdominales","une fausse diarrhée (fécalome)"],
  ob:["Le patient retrouvera un transit régulier (selle au moins tous les 2 jours) d'ici 3 jours."],
  ac:[["Surveiller le transit chaque jour (fréquence, aspect des selles)","p"],["Encourager l'hydratation et une alimentation riche en fibres","p"],["Favoriser le lever et la marche","p"],["Respecter l'intimité, proposer la chaise percée ou les toilettes","p"],["Administrer les laxatifs prescrits (systématiques sous opioïdes)","s"],["Rechercher un fécalome si fausse diarrhée","p"]],
  ev:["Fréquence et aspect des selles","Confort abdominal"]},
 {id:"constip-r",l:"Risque de constipation",t:"x",b:3,p:4,kw:/opioïde|morphin|immobil|alit/,
  fl:["un traitement par opioïdes","l'alitement","une hydratation insuffisante","un changement d'habitudes (hôpital)"],
  ob:["Le patient conservera un transit régulier pendant l'hospitalisation."],
  ac:[["Surveiller le transit chaque jour","p"],["Encourager hydratation, fibres et mobilisation","p"],["Administrer le laxatif prescrit avec les opioïdes","s"]],
  ev:["Selles au moins tous les 2 jours"]},
 {id:"diarrhee",l:"Diarrhée",t:"r",b:3,p:2,g:"f",kw:/diarrh|selles liquides|clostridi/,
  fl:["une infection digestive","un traitement antibiotique","une chimiothérapie ou une radiothérapie","une alimentation entérale","une maladie inflammatoire du tube digestif"],
  mf:["… selles liquides par jour","des douleurs abdominales, des crampes","une irritation de la peau du siège","des signes de déshydratation"],
  ob:["Le patient aura moins de 3 selles par jour d'ici 48 h, sans signe de déshydratation."],
  ac:[["Noter fréquence, aspect et volume des selles","p"],["Surveiller les signes de déshydratation, le poids, le ionogramme","p"],["Hydrater, proposer un soluté de réhydratation","p"],["Protéger la peau du siège (toilette douce, crème barrière)","p"],["Appliquer les précautions contact si infection (Clostridioides : savon puis friction)","p"],["Prélever une coproculture si prescrite","s"]],
  ev:["Nombre de selles","Hydratation","État de la peau"]},
 {id:"incont",l:"Incontinence urinaire",t:"r",b:3,p:4,g:"f",kw:/incontinen|fuites? urinaire/,
  fl:["une faiblesse du périnée","une vessie hyperactive","des troubles cognitifs","une mobilité réduite (accès aux toilettes)","un traitement diurétique","une infection urinaire"],
  mf:["des fuites à l'effort ou par envies pressantes","des protections mouillées","une irritation de la peau","une gêne, une honte exprimée"],
  ob:["Le patient diminuera le nombre de fuites grâce aux mictions programmées d'ici une semaine.","La peau du siège restera saine pendant l'hospitalisation."],
  ac:[["Évaluer le type et la fréquence des fuites (calendrier mictionnel)","p"],["Proposer les toilettes à heures régulières","p"],["Faciliter l'accès (sonnette, urinal, chaise percée)","p"],["Adapter les protections, réaliser une toilette douce, protéger la peau","p"],["Rechercher une infection urinaire (bandelette)","p"],["Respecter la pudeur et la dignité","p"]],
  ev:["Nombre de fuites","État cutané","Ressenti du patient"]},
 {id:"retention",l:"Risque de complication : rétention urinaire",t:"c",b:3,p:2,kw:/rétention|globe|prostat|anesthésie rachidienne/,
  fl:["l'anesthésie ou l'analgésie (morphiniques)","une hypertrophie de la prostate","une constipation, un fécalome","des médicaments anticholinergiques","une vessie neurologique"],
  ob:["Le patient urinera spontanément dans les 6 h suivant l'intervention, sans globe vésical."],
  ac:[["Surveiller la reprise des mictions et la diurèse","p"],["Rechercher un globe (palpation, bladder scan)","p"],["Faciliter la miction (intimité, position, eau qui coule)","p"],["Réaliser un sondage évacuateur sur prescription","s"]],
  ev:["Mictions spontanées","Résidu post-mictionnel","Absence de globe"]},
 {id:"inf-uri",l:"Risque d'infection urinaire",t:"x",b:3,p:3,kw:/sonde urinaire|sondage|infection urinaire|cystite|pyélonéphrite/,
  fl:["la présence d'une sonde urinaire","une hydratation insuffisante","une rétention ou un résidu","un âge avancé, le diabète"],
  ob:["Le patient ne présentera pas d'infection urinaire pendant la durée du sondage."],
  ac:[["Maintenir le système clos, sac sous le niveau de la vessie, sans contact avec le sol","p"],["Réaliser la toilette génitale quotidienne et l'hygiène des mains","p"],["Surveiller aspect et odeur des urines, température","p"],["Encourager l'hydratation","p"],["Réévaluer chaque jour l'utilité de la sonde avec le médecin","c"]],
  ev:["Urines claires","Absence de fièvre","Durée du sondage"]},
 {id:"mobilite",l:"Mobilité physique réduite",t:"r",b:4,p:4,g:"f",kw:/paralys|hémiplég|parapl|fracture|immobilis|plâtre|arthrose|polyarthrite|rigidité|parkinson|amputation|prothèse|alit/,
  fl:["une paralysie ou une faiblesse musculaire","une douleur à la mobilisation","une immobilisation (plâtre, attelle, consigne d'alitement)","la fatigue","la peur de tomber","une raideur articulaire"],
  mf:["une difficulté à se lever ou à marcher","un besoin d'aide pour les transferts","une marche avec aide technique","une diminution de l'amplitude des mouvements"],
  ob:["Le patient réalisera ses transferts lit-fauteuil avec l'aide d'une personne d'ici J3.","Le patient marchera … mètres avec son déambulateur d'ici la sortie."],
  ac:[["Évaluer l'autonomie et les capacités chaque jour","p"],["Lever précocement selon la prescription, aider aux transferts","p"],["Installer en bonne position, prévenir les attitudes vicieuses","p"],["Prévenir la douleur avant la mobilisation (antalgique prescrit)","s"],["Mettre les aides techniques à portée","p"],["Travailler avec le kinésithérapeute","c"]],
  ev:["Distance parcourue","Niveau d'aide pour les transferts","Douleur à la mobilisation"]},
 {id:"chute",l:"Risque de chute",t:"x",b:4,p:3,kw:/chute|vertige|hypotension orthostatique|confus|trouble de l'équilibre|instabilité|somnifère|benzodiazépine|démence|parkinson|neuropathie/,
  fl:["un âge avancé","des troubles de l'équilibre ou de la marche","des vertiges, une hypotension orthostatique","des troubles cognitifs ou une confusion","des médicaments (somnifères, antihypertenseurs, diurétiques)","des troubles de la vision","un environnement inconnu","des chutes antérieures"],
  ob:["Le patient ne chutera pas pendant son hospitalisation.","Le patient utilisera la sonnette pour se lever la nuit pendant l'hospitalisation."],
  ac:[["Évaluer le risque à l'entrée (antécédents, marche, médicaments)","p"],["Laisser la sonnette, les lunettes et les objets utiles à portée de main","p"],["Lit en position basse, freins mis, éclairage la nuit, sol dégagé","p"],["Vérifier le chaussage (chaussures fermées)","p"],["Accompagner le premier lever, rechercher une hypotension orthostatique","p"],["Programmer les passages aux toilettes","p"],["Signaler toute chute et rechercher une lésion","p"]],
  ev:["Absence de chute","Utilisation de la sonnette","TA couché-debout"]},
 {id:"thrombo",l:"Risque de complication : thrombose veineuse et embolie",t:"c",b:4,p:3,kw:/phlébite|thrombo|embolie|alit|immobil|post-opératoire|prothèse de hanche|plâtre/,
  fl:["l'alitement ou l'immobilisation","une chirurgie (orthopédie, abdomen, pelvis)","un cancer","une grossesse ou le post-partum","des antécédents de phlébite","un plâtre du membre inférieur"],
  ob:["Le patient ne présentera pas de signes de thrombose veineuse pendant l'hospitalisation."],
  ac:[["Administrer l'anticoagulant préventif prescrit, surveiller les plaquettes","s"],["Surveiller les mollets (douleur, chaleur, œdème) et la respiration","p"],["Lever et faire marcher précocement","p"],["Mettre en place la contention prescrite","s"],["Encourager les mouvements des pieds au lit et l'hydratation","p"]],
  ev:["Mollets souples et indolores","Absence de dyspnée brutale","Plaquettes"]},
 {id:"fatigue",l:"Intolérance à l'activité",t:"r",b:4,p:4,g:"f",kw:/fatigue|asthénie|anémie|insuffisance cardiaque|essoufflement à l'effort/,
  fl:["l'anémie","une insuffisance cardiaque ou respiratoire","une dénutrition","les traitements (chimiothérapie)","un alitement prolongé"],
  mf:["une fatigue exprimée","un essoufflement ou une tachycardie à l'effort","une difficulté à réaliser les activités de la vie quotidienne"],
  ob:["Le patient réalisera sa toilette au lavabo sans essoufflement d'ici la sortie."],
  ac:[["Évaluer la tolérance à l'effort (FC, SpO₂, essoufflement)","p"],["Alterner activités et repos, planifier les soins","p"],["Reprendre l'activité progressivement","p"],["Installer confortablement, mettre les objets à portée","p"]],
  ev:["Tolérance à l'effort","Autonomie dans les activités"]},
 {id:"sommeil",l:"Perturbation du sommeil",t:"r",b:5,p:4,g:"f",kw:/insomnie|sommeil|réveils? nocturne|douleur nocturne|apnée/,
  fl:["la douleur","l'anxiété","l'environnement hospitalier (bruit, lumière, soins de nuit)","une dyspnée","des mictions nocturnes","un changement de rythme"],
  mf:["des difficultés d'endormissement","des réveils nocturnes","une fatigue au réveil exprimée","une somnolence dans la journée"],
  ob:["Le patient dira avoir dormi d'une traite au moins 5 h d'ici 3 nuits."],
  ac:[["Évaluer le sommeil (questionner le patient, observer la nuit)","p"],["Regrouper les soins de nuit, limiter bruit et lumière","p"],["Traiter la douleur avant le coucher","s"],["Respecter les habitudes de coucher","p"],["Limiter les siestes longues et les excitants le soir","p"],["Administrer le traitement prescrit si besoin, surveiller la somnolence","s"]],
  ev:["Durée et qualité du sommeil rapportées","Somnolence diurne"]},
 {id:"habillage",l:"Déficit de soins personnels : habillage",t:"r",b:6,p:5,kw:/hémiplég|parkinson|démence|fracture du poignet|arthrose|polyarthrite/,
  fl:["une paralysie ou une douleur d'un membre","des troubles cognitifs","une fatigue","une perfusion ou un plâtre"],
  mf:["un besoin d'aide pour s'habiller","une tenue inadaptée"],
  ob:["Le patient s'habillera seul avec des vêtements adaptés, en commençant par le côté atteint, d'ici la sortie."],
  ac:[["Évaluer ce que le patient peut faire seul","p"],["Stimuler, laisser le temps, aider seulement pour ce qu'il ne peut pas faire","p"],["Conseiller des vêtements amples, faciles à enfiler","p"],["Habiller en commençant par le côté atteint","p"]],
  ev:["Niveau d'autonomie pour l'habillage"]},
 {id:"hyperthermie",l:"Hyperthermie",t:"r",b:7,p:2,g:"f",kw:/fièvre|hyperthermie|fébrile|sepsis|frissons/,
  fl:["une infection","un état inflammatoire","une réaction transfusionnelle ou médicamenteuse","une exposition à la chaleur"],
  mf:["une température > 38 °C","des frissons, des sueurs","une tachycardie","une sensation de malaise"],
  ob:["Le patient retrouvera une température < 38 °C d'ici 48 h.","Le patient exprimera un confort thermique dans l'heure suivant le traitement."],
  ac:[["Surveiller la température, la FC, la TA, la conscience toutes les … h","p"],["Réaliser les hémocultures prescrites lors des frissons ou du pic","s"],["Administrer l'antipyrétique prescrit et en évaluer l'effet","s"],["Découvrir, rafraîchir la chambre, changer le linge humide","p"],["Hydrater abondamment","p"],["Rechercher la source (cathéter, urines, plaie, poumons)","p"]],
  ev:["Courbe de température","Confort","Hydratation"]},
 {id:"hypotherm",l:"Risque d'hypothermie",t:"x",b:7,p:3,kw:/hypothermie|nouveau-né|prématur|bloc opératoire/,
  fl:["la chirurgie et l'anesthésie","un âge extrême (nouveau-né, personne âgée)","une exposition au froid","une dénutrition"],
  ob:["Le patient maintiendra une température ≥ 36 °C pendant les 24 premières heures."],
  ac:[["Surveiller la température","p"],["Couvrir, réchauffer (couverture, réchauffeur à air pulsé)","p"],["Limiter les découvertes pendant les soins","p"]],
  ev:["Température ≥ 36 °C"]},
 {id:"hygiene",l:"Déficit de soins personnels : toilette",t:"r",b:8,p:4,kw:/hémiplég|démence|parkinson|grabataire|dépendan|alit|fracture/,
  fl:["une mobilité réduite","des troubles cognitifs","une fatigue intense","une douleur","des troubles visuels"],
  mf:["un besoin d'aide partielle ou totale pour la toilette","une hygiène insuffisante"],
  ob:["Le patient réalisera seul la toilette du haut du corps au lavabo d'ici une semaine."],
  ac:[["Évaluer ce que le patient peut faire seul","p"],["Stimuler et aider pour le reste, en respectant pudeur et habitudes","p"],["Profiter de la toilette pour surveiller la peau et les points d'appui","p"],["Réaliser les soins de bouche, des pieds, des ongles","p"]],
  ev:["Niveau d'autonomie","Hygiène, état cutané"]},
 {id:"escarre",l:"Risque d'escarre (atteinte de l'intégrité de la peau)",t:"x",b:8,p:3,kw:/escarre|alit|immobil|grabataire|dénutri|incontinen|paralys|sédation|coma/,
  fl:["l'immobilité ou l'alitement","une dénutrition","une incontinence (macération)","une diminution de la sensibilité","un âge avancé","la fièvre, une mauvaise perfusion"],
  ob:["Le patient ne présentera pas d'escarre pendant son hospitalisation.","La peau des points d'appui restera saine (rougeur qui blanchit à la pression) pendant l'hospitalisation."],
  ac:[["Évaluer le risque (échelle de Braden) à l'entrée et régulièrement","p"],["Changer de position toutes les 2 à 3 h (30° latéral), tracer","p"],["Installer un support adapté (matelas à air), mettre les talons en décharge","p"],["Observer les points d'appui à chaque change ou soin, ne pas masser une rougeur","p"],["Maintenir la peau propre et sèche, protéger de l'humidité","p"],["Veiller à la nutrition et à l'hydratation","p"]],
  ev:["Score de Braden","État des points d'appui","Absence d'escarre"]},
 {id:"plaie",l:"Atteinte de l'intégrité tissulaire (plaie)",t:"r",b:8,p:3,g:"f",kw:/plaie|ulcère|escarre constituée|brûlure|cicatri|pied diabétique|nécrose|abcès/,
  fl:["une chirurgie","une pression prolongée (escarre)","une insuffisance veineuse ou artérielle","le diabète et la neuropathie","une brûlure, un traumatisme","une dénutrition qui freine la cicatrisation"],
  mf:["une plaie de … cm (localisation, stade)","un fond fibrineux, nécrotique ou bourgeonnant","un exsudat (quantité, aspect)","une douleur au soin"],
  ob:["La plaie diminuera de surface (mesure hebdomadaire) d'ici 15 jours.","La plaie ne présentera pas de signe d'infection pendant l'hospitalisation."],
  ac:[["Évaluer la plaie à chaque réfection (dimensions, fond, exsudat, berges, douleur, photo)","p"],["Réaliser le pansement prescrit ou selon le protocole, de façon aseptique","s"],["Prévenir la douleur avant le soin","s"],["Traiter la cause (décharge, compression, équilibre du diabète)","c"],["Veiller à la nutrition (protéines)","p"]],
  ev:["Surface et aspect de la plaie","Douleur au soin","Signes d'infection"]},
 {id:"inf-so",l:"Risque d'infection du site opératoire",t:"x",b:9,p:3,kw:/post-opératoire|cicatrice|chirurgi|opér/,
  fl:["la plaie opératoire","un drain","une dénutrition, un diabète, le tabac","une durée opératoire longue"],
  ob:["Le patient ne présentera pas de signe d'infection du site opératoire pendant l'hospitalisation."],
  ac:[["Surveiller la cicatrice (rougeur, chaleur, écoulement, douleur) et la température","p"],["Réaliser les pansements de façon aseptique, selon le protocole","s"],["Surveiller les drains (quantité, aspect)","p"],["Hygiène des mains avant et après tout contact","p"]],
  ev:["Cicatrice propre","Température","Aspect des drains"]},
 {id:"inf-kt",l:"Risque d'infection liée au cathéter",t:"x",b:9,p:3,kw:/cathéter|perfusion|voie veineuse|PICC|chambre implantable/,
  fl:["la présence d'un cathéter veineux (VVP, PICC, chambre implantable)","une durée de pose prolongée","une immunodépression"],
  ob:["Le patient ne présentera pas de signe d'infection au point de ponction pendant la durée de la perfusion."],
  ac:[["Surveiller le point de ponction (rougeur, induration, douleur, écoulement) au moins une fois par équipe","p"],["Changer pansement et tubulures selon le protocole, de façon aseptique","p"],["Tracer la date de pose et réévaluer chaque jour l'utilité du cathéter","p"],["Retirer le cathéter au moindre signe d'infection et prévenir","p"]],
  ev:["Point de ponction propre","Absence de fièvre","Durée de pose"]},
 {id:"inf-immuno",l:"Risque d'infection",t:"x",b:9,p:2,kw:/immunodépr|neutropén|aplasie|chimiothérapie|corticoïde|greffe|VIH|leucémie/,
  fl:["une neutropénie (chimiothérapie, maladie du sang)","un traitement immunosuppresseur ou corticoïde","une dénutrition","des dispositifs invasifs"],
  ob:["Le patient ne présentera pas d'infection pendant la période d'aplasie."],
  ac:[["Appliquer l'isolement protecteur selon le protocole","p"],["Surveiller la température et les signes d'infection","p"],["Hygiène des mains renforcée, éducation du patient et des visiteurs","p"],["Réaliser les soins de bouche","p"],["Alerter immédiatement en cas de fièvre (hémocultures, antibiotiques)","s"]],
  ev:["Température","Signes d'infection","NFS"]},
 {id:"hemo",l:"Risque de complication : hémorragie",t:"c",b:9,p:1,kw:/hémorrag|saign|anticoag|thrombopén|hémophilie|varices|ulcère hémorragique|post-partum/,
  fl:["une chirurgie récente","un traitement anticoagulant ou antiagrégant","une thrombopénie, un trouble de la coagulation","des varices œsophagiennes, un ulcère"],
  ob:["Le patient ne présentera pas de saignement pendant l'hospitalisation, ou il sera détecté et signalé immédiatement."],
  ac:[["Surveiller pouls, TA, coloration, conscience","p"],["Surveiller pansements, drains, urines, selles, vomissements","p"],["Administrer l'anticoagulant prescrit, surveiller les examens (INR, anti-Xa, plaquettes)","s"],["Éviter les injections intramusculaires et les traumatismes","p"],["Alerter devant tout saignement, pouls qui accélère ou TA qui baisse","p"]],
  ev:["Constantes stables","Absence de saignement","Hémoglobine, hémostase"]},
 {id:"hemodyn",l:"Risque de complication : instabilité hémodynamique (choc)",t:"c",b:9,p:1,kw:/choc|hypotension|tachycard|sepsis|hypovolém|infarctus|insuffisance cardiaque|troubles du rythme/,
  fl:["une hémorragie ou une déshydratation","un sepsis","une atteinte cardiaque","une réaction allergique"],
  ob:["Le patient gardera une PAS ≥ 100 mmHg et une FC < 100/min pendant l'hospitalisation."],
  ac:[["Surveiller TA, FC, FR, SpO₂, conscience, marbrures, diurèse","p"],["Calculer les scores d'alerte (NEWS2, qSOFA) selon le service","p"],["Poser une voie veineuse, administrer le remplissage prescrit","s"],["Alerter selon les seuils (SAED)","p"]],
  ev:["Constantes","Diurèse","Scores d'alerte"]},
 {id:"neuro",l:"Risque de complication : aggravation neurologique",t:"c",b:9,p:1,kw:/AVC|hématome|traumatisme crânien|HTIC|hypertension intracrânienne|méningite|tumeur cérébrale|convuls|épilep|glasgow/,
  fl:["l'atteinte cérébrale (AVC, traumatisme, tumeur, infection)","un œdème cérébral","une hypertension intracrânienne"],
  ob:["Toute aggravation neurologique sera détectée et signalée immédiatement pendant les 72 premières heures."],
  ac:[["Surveiller conscience (Glasgow), pupilles, motricité, parole aux horaires prescrits","p"],["Surveiller TA, température, glycémie","p"],["Installer la tête à 30°, dans l'axe","p"],["Assurer la sécurité en cas de convulsion","p"],["Alerter devant toute modification (céphalées, vomissements, somnolence)","p"]],
  ev:["Score de Glasgow","Déficits stables ou en régression"]},
 {id:"electro",l:"Risque de complication : déséquilibre hydroélectrolytique",t:"c",b:2,p:2,kw:/kaliémie|potassium|natrémie|ionogramme|insuffisance rénale|dialyse|diurétique|lyse/,
  fl:["une insuffisance rénale","un traitement diurétique","des pertes digestives","une perfusion"],
  ob:["Le patient aura un ionogramme dans les normes pendant l'hospitalisation."],
  ac:[["Surveiller ionogramme, poids, diurèse, bilan entrées-sorties","p"],["Surveiller les signes cliniques (crampes, faiblesse, troubles du rythme, confusion)","p"],["Administrer les corrections prescrites (potassium toujours dilué)","s"],["Réaliser un ECG si prescrit ou si troubles","s"]],
  ev:["Ionogramme","ECG","Poids et diurèse"]},
 {id:"douleur",l:"Douleur aiguë",t:"r",b:9,p:2,g:"f",kw:/douleur|douloureu|colique|céphalée|brûlure|fracture|mal (?:à|au|aux) |a mal|\bEN ?\d|\bEVA\b|\d ?\/ ?10/,
  fl:["la chirurgie","l'inflammation","la fracture","la distension (colique, occlusion)","l'ischémie","les soins (pansement, mobilisation)"],
  mf:["une douleur évaluée à …/10 (EN ou EVA)","un faciès crispé, des gémissements","une position antalgique","une tachycardie, une agitation","une limitation des mouvements"],
  ob:["Le patient exprimera une douleur ≤ 3/10 à l'EN dans l'heure suivant l'antalgique.","Le patient pourra se mobiliser avec une douleur ≤ 3/10 d'ici 24 h."],
  ac:[["Évaluer la douleur (EN, EVA, Algoplus si non communicant) : intensité, type, localisation","p"],["Administrer les antalgiques prescrits, à heure fixe, et anticiper les soins douloureux","s"],["Réévaluer 30 à 60 min après l'antalgique et tracer","p"],["Installer confortablement, appliquer froid ou chaleur selon le cas","p"],["Surveiller les effets indésirables (somnolence, FR, nausées, constipation sous morphine)","p"],["Proposer des moyens non médicamenteux (distraction, respiration, relaxation)","p"]],
  ev:["Score de douleur","Mobilisation possible","Sommeil","Effets indésirables"]},
 {id:"douleur-c",l:"Douleur chronique",t:"r",b:9,p:3,g:"f",kw:/douleur chronique|arthrose|polyarthrite|fibromyalgie|neuropathi|métastase|lombalgie|cancer/,
  fl:["une maladie chronique (arthrose, cancer, neuropathie)","une sensibilisation du système nerveux","l'anxiété, la dépression"],
  mf:["une douleur depuis plus de 3 mois","un retentissement sur le sommeil, l'humeur, les activités","une limitation des activités"],
  ob:["Le patient décrira une douleur compatible avec ses activités (objectif fixé avec lui) d'ici la sortie."],
  ac:[["Évaluer la douleur et son retentissement (sommeil, moral, activités)","p"],["Administrer le traitement de fond prescrit, à heures fixes","s"],["Proposer des moyens non médicamenteux","p"],["Fixer avec le patient des objectifs réalistes","p"],["Travailler avec l'équipe douleur","c"]],
  ev:["Score de douleur","Activités réalisées","Sommeil"]},
 {id:"anxiete",l:"Anxiété",t:"r",b:9,p:3,g:"f",kw:/anxi|angoiss|peur|stress|attaque de panique|inquiet|pleure/,
  fl:["l'hospitalisation et l'environnement inconnu","l'annonce du diagnostic","l'attente d'une intervention ou d'un examen","la douleur ou la dyspnée","l'inquiétude pour les proches"],
  mf:["une inquiétude exprimée","des questions répétées","une agitation, des pleurs","des troubles du sommeil","une tachycardie"],
  ob:["Le patient exprimera une diminution de son anxiété (échelle de 0 à 10) d'ici 24 h.","Le patient pourra nommer ses inquiétudes et poser ses questions avant l'intervention."],
  ac:[["Écouter, laisser exprimer les craintes, reformuler","p"],["Informer simplement sur les soins, les examens, le déroulement","p"],["Proposer la présence d'un proche, des repères","p"],["Proposer des techniques de relaxation et de respiration","p"],["Administrer l'anxiolytique prescrit si besoin, en évaluer l'effet","s"]],
  ev:["Anxiété exprimée","Sommeil","Comportement"]},
 {id:"confusion",l:"Confusion aiguë",t:"r",b:9,p:2,g:"f",kw:/confus|délire|delirium|désorient|agitation/,
  fl:["une infection","une déshydratation","des médicaments","une douleur","une rétention urinaire ou un fécalome","un sevrage","un changement d'environnement"],
  mf:["une désorientation dans le temps et l'espace","une inattention, des propos incohérents","une agitation ou une somnolence","des fluctuations dans la journée"],
  ob:["Le patient retrouvera son état cognitif antérieur d'ici 72 h.","Le patient restera en sécurité, sans chute ni arrachement de dispositif, pendant la confusion."],
  ac:[["Rechercher et signaler les causes (fièvre, globe, fécalome, douleur, glycémie, médicaments)","p"],["Donner des repères (horloge, calendrier, lunettes, appareils auditifs)","p"],["Parler calmement, phrases courtes, présence d'un proche","p"],["Assurer la sécurité (lit bas, éclairage, surveillance rapprochée), éviter la contention","p"],["Hydrater, maintenir le rythme jour-nuit","p"]],
  ev:["Orientation","Comportement","Sécurité"]},
 {id:"suicide",l:"Risque suicidaire",t:"x",b:9,p:1,kw:/suicid|idées de mort|dépressi|tentative de suicide/,
  fl:["un épisode dépressif","une tentative de suicide antérieure","un isolement social","une consommation d'alcool","une annonce difficile, une perte"],
  ob:["Le patient restera en sécurité et pourra parler de ses idées avec un soignant pendant l'hospitalisation."],
  ac:[["Évaluer le risque suicidaire en parlant directement des idées de mort","p"],["Sécuriser l'environnement (objets dangereux, médicaments)","p"],["Surveiller selon le protocole, sans relâcher en cas d'amélioration brutale","p"],["Transmettre et alerter le psychiatre","c"],["Maintenir le lien, proposer une présence","p"]],
  ev:["Idées exprimées","Sécurité","Lien avec l'équipe"]},
 {id:"sevrage",l:"Risque de complication : syndrome de sevrage",t:"c",b:9,p:2,kw:/sevrage|alcool|delirium tremens|benzodiazépine/,
  fl:["une consommation régulière d'alcool","l'arrêt brutal de benzodiazépines ou d'opioïdes"],
  ob:["Le patient ne présentera pas de complication du sevrage (convulsions, delirium) pendant l'hospitalisation."],
  ac:[["Surveiller avec le score de Cushman (pouls, TA, tremblements, sueurs, agitation)","p"],["Administrer les benzodiazépines et la vitamine B1 prescrites","s"],["Hydrater, environnement calme et éclairé","p"],["Proposer un accompagnement en addictologie","c"]],
  ev:["Score de Cushman","Absence de convulsion ou de delirium"]},
 {id:"communic",l:"Communication verbale altérée",t:"r",b:10,p:4,g:"f",kw:/aphasie|dysarthrie|surdi|trachéotomie|intubation|laryngectomie|démence|autisme/,
  fl:["une aphasie ou une dysarthrie (AVC)","une surdité","une trachéotomie ou une intubation","des troubles cognitifs","une langue différente"],
  mf:["une difficulté à trouver ses mots ou à se faire comprendre","des mots déformés","une frustration, un repli"],
  ob:["Le patient pourra exprimer ses besoins essentiels (oui/non, pictogrammes) d'ici 48 h."],
  ac:[["Se placer face au patient, parler lentement, phrases courtes","p"],["Poser des questions fermées, laisser le temps de répondre","p"],["Proposer des outils (ardoise, pictogrammes, appareil auditif, interprète)","p"],["Associer les proches, travailler avec l'orthophoniste","c"]],
  ev:["Besoins exprimés","Moyen de communication utilisé","Frustration"]},
 {id:"isolement",l:"Isolement social",t:"r",b:10,p:5,kw:/isolement|contagieu|précautions? (air|contact|gouttelettes)|veuf|vit seul/,
  fl:["un isolement septique ou protecteur","une hospitalisation prolongée","l'éloignement des proches","des troubles de la communication"],
  mf:["un sentiment de solitude exprimé","peu de visites","un repli, une tristesse"],
  ob:["Le patient maintiendra un contact quotidien avec ses proches (visites, téléphone) pendant l'isolement."],
  ac:[["Expliquer les raisons et la durée de l'isolement","p"],["Prévoir des temps de présence et d'échange","p"],["Favoriser les visites et le téléphone dans le respect des précautions","p"],["Proposer des occupations","p"]],
  ev:["Contacts maintenus","Moral exprimé"]},
 {id:"spirituel",l:"Détresse spirituelle",t:"r",b:11,p:5,g:"f",kw:/fin de vie|palliati|deuil|annonce/,
  fl:["la maladie grave et la fin de vie","une perte de sens","l'impossibilité de pratiquer ses rites"],
  mf:["des questions sur le sens de la vie, de la maladie","une colère, une révolte","une demande de rencontre avec un représentant du culte"],
  ob:["Le patient pourra exprimer ses besoins spirituels et les voir respectés pendant l'hospitalisation."],
  ac:[["Écouter sans juger, respecter les croyances","p"],["Proposer l'aumônerie ou un représentant du culte souhaité","p"],["Adapter les soins aux rites (alimentation, toilette, prière)","p"]],
  ev:["Besoins exprimés et respectés"]},
 {id:"image",l:"Perturbation de l'image corporelle",t:"r",b:12,p:4,g:"f",kw:/stomie|amputation|mastectomie|alopécie|cicatrice|brûlure|laryngectomie|défigur/,
  fl:["une stomie","une amputation ou une mastectomie","la chute des cheveux (chimiothérapie)","une cicatrice visible"],
  mf:["un refus de regarder ou de toucher la zone","des propos négatifs sur son corps","un repli social"],
  ob:["Le patient regardera et participera aux soins de sa stomie d'ici la sortie."],
  ac:[["Écouter, permettre l'expression des émotions","p"],["Accompagner progressivement (regarder, toucher, participer)","p"],["Proposer des aides (prothèse capillaire, appareillage adapté, socio-esthétique)","c"],["Orienter vers une association, un psychologue si besoin","c"]],
  ev:["Participation aux soins","Propos du patient"]},
 {id:"ennui",l:"Manque d'activités de loisirs",t:"r",b:13,p:5,kw:/hospitalisation prolongée|isolement|alit/,
  fl:["une hospitalisation prolongée","un isolement","une mobilité réduite"],
  mf:["un ennui exprimé","un sommeil excessif dans la journée"],
  ob:["Le patient aura au moins une activité choisie par jour pendant l'hospitalisation."],
  ac:[["Rechercher les goûts et habitudes","p"],["Proposer lecture, musique, jeux, sorties si possible","p"],["Associer l'animation, les bénévoles","c"]],
  ev:["Activités réalisées","Moral"]},
 {id:"connaissances",l:"Manque de connaissances sur la maladie et le traitement",t:"r",b:14,p:5,kw:/éducation|autosurveillance|observance|régime|traitement à vie|chronique|diabète|insuffisance cardiaque|asthme|anticoagulant|stomie|BPCO|épilepsie/,
  fl:["une maladie récemment découverte","un nouveau traitement","des informations mal comprises","des difficultés de lecture ou de langue"],
  mf:["des questions sur la maladie ou le traitement","des erreurs dans la prise du traitement","une incapacité à expliquer les signes d'alerte"],
  ob:["Le patient expliquera son traitement et les signes qui doivent le faire consulter d'ici la sortie.","Le patient réalisera seul … (injection, autosurveillance, soin de stomie) d'ici la sortie."],
  ac:[["Évaluer ce que le patient sait déjà et ce qu'il souhaite savoir","p"],["Expliquer avec des mots simples, un support écrit, en plusieurs fois","p"],["Faire faire le geste au patient et le corriger","p"],["Vérifier la compréhension (faire reformuler)","p"],["Associer un proche si le patient le souhaite","p"],["Orienter vers un programme d'éducation thérapeutique","c"]],
  ev:["Reformulation correcte","Geste réalisé seul","Signes d'alerte connus"]},
 {id:"observance",l:"Risque de mauvaise gestion du traitement",t:"x",b:14,p:5,kw:/observance|polymédication|traitement complexe|troubles cognitifs|anticoagulant/,
  fl:["un traitement complexe (nombreux médicaments, horaires)","des troubles cognitifs ou visuels","des effets indésirables","un isolement"],
  ob:["Le patient prendra son traitement correctement (pilulier, horaires) d'ici la sortie."],
  ac:[["Simplifier le plan de prise avec le médecin et le pharmacien","c"],["Proposer un pilulier, un plan de prise écrit","p"],["Organiser l'aide à domicile (IDE libéral) si besoin","c"],["Vérifier la compréhension","p"]],
  ev:["Plan de prise compris","Aide organisée"]},
 {id:"inconfort",l:"Inconfort en fin de vie",t:"r",b:9,p:2,kw:/fin de vie|palliati|agonie|terminale/,
  fl:["l'évolution de la maladie","la douleur, la dyspnée, l'encombrement","la bouche sèche","l'anxiété"],
  mf:["des signes d'inconfort (grimace, agitation, gémissements)","une bouche sèche","une respiration bruyante"],
  ob:["Le patient paraîtra apaisé (pas de signe d'inconfort à l'observation) à chaque passage."],
  ac:[["Évaluer régulièrement le confort (douleur, dyspnée, encombrement, agitation)","p"],["Réaliser des soins de bouche fréquents","p"],["Installer confortablement, changer de position doucement","p"],["Administrer les traitements de confort prescrits (si besoin anticipés)","s"],["Accompagner les proches, respecter les souhaits du patient","p"]],
  ev:["Signes de confort","Ressenti des proches"]}
];
const PS_BY=Object.fromEntries(PS_LIB.map(x=>[x.id,x]));
const PS_TYPE={r:"Diagnostic infirmier réel",x:"Diagnostic infirmier de risque",c:"Problème en collaboration"};
const PS_TYPE_S={r:"Réel",x:"Risque",c:"En collaboration"};
const PS_ROLE={p:"rôle propre",s:"sur prescription",c:"en collaboration"};
/* contexte rapide : [clé, libellé, problèmes proposés] */
const PS_CTX=[["postop","Opéré (post-opératoire)",["douleur","inf-so","thrombo","hemo","retention","nausees"]],["alite","Alité, peu mobile",["escarre","thrombo","constip-r","mobilite"]],
 ["age","Plus de 75 ans",["chute","deshydra","denutri-r","escarre"]],["cogn","Troubles cognitifs, confusion",["confusion","chute","communic","fausse-route"]],["vvp","Perfusion, cathéter",["inf-kt"]],
 ["sonde","Sonde urinaire",["inf-uri"]],["o2","Sous oxygène",["respi"]],["diab","Diabète",["glycemie","connaissances"]],["anticoag","Anticoagulant",["hemo","connaissances"]],
 ["deglut","Troubles de la déglutition",["fausse-route","deglut","denutri-r"]],["douleur","Douleur",["douleur"]],["anx","Anxieux, inquiet",["anxiete","sommeil"]],
 ["denut","Perte de poids, peu d'appétit",["denutri"]],["immuno","Immunodéprimé",["inf-immuno"]],["isol","En isolement",["isolement","ennui","anxiete"]],
 ["chron","Maladie chronique, nouveau traitement",["connaissances","observance"]],["pallia","Soins palliatifs",["inconfort","douleur","anxiete","spirituel"]],
 ["dep","Dépendant pour la toilette",["hygiene","habillage"]],["fievre","Fièvre",["hyperthermie","deshydra"]],["stomie","Stomie, amputation, mastectomie",["image","connaissances"]],
 ["alcool","Consommation d'alcool",["sevrage"]],["chute","Chute récente, vertiges",["chute"]],["incont","Incontinence",["incont","escarre"]]];
const PS_ECH=["dans l'heure","d'ici 24 h","d'ici 48 h","d'ici 72 h","à J3","d'ici une semaine","d'ici la sortie","pendant toute l'hospitalisation"];

/* ---------- Brouillon ---------- */
const psNew=()=>({step:1,pat:{},path:[],ctx:[],rec:"",sel:[],pb:{},cust:[]});
const psD=()=>{const d=store.get("psDraft",null);return d&&d.pat?Object.assign(psNew(),d):psNew();};
const psSave=d=>store.set("psDraft",d);
const psPb=id=>PS_BY[id]||null;
const psClean=s=>String(s||"").replace(/\*\*/g,"").replace(/\s+/g," ");
const psArr=v=>{if(Array.isArray(v))return v;try{const a=JSON.parse(v);return Array.isArray(a)?a:[];}catch(e){return v?[String(v)]:[];}};

/* ---------- Suggestions : pathologies, contexte, recueil, observations ---------- */
function psSuggest(d){const S={};
 const add=(id,pts,why)=>{const p=PS_BY[id];if(!p)return;const s=S[id]=S[id]||{id,score:0,why:[]};s.score+=pts;if(why&&!s.why.includes(why)&&s.why.length<3)s.why.push(why);};
 const scan=(text,pts,label)=>{const T=psClean(text);if(!T)return;PS_LIB.forEach(p=>{const m=T.match(new RegExp("[^.;]*(?:"+p.kw.source+")[^.;]*","i"));if(m)add(p.id,pts,label+" : « "+m[0].trim().slice(0,90)+(m[0].trim().length>90?"…":"")+" »");});};
 d.path.forEach(pid=>{const P=PBY[pid];if(!P)return;
  psArr(P.sg).forEach(x=>scan(x,2,P.n+", signes"));psArr(P.co).forEach(x=>scan(x,2,P.n+", complications"));psArr(P.al).forEach(x=>scan(x,2,P.n+", alertes"));psArr(P.ri).forEach(x=>scan(x,1,P.n+", rôle infirmier"));});
 d.ctx.forEach(k=>{const c=PS_CTX.find(x=>x[0]===k);if(c)c[2].forEach(id=>add(id,3,"Contexte : "+c[1].toLowerCase()));});
 if(d.pat.obs)scan(d.pat.obs,3,"Vos observations");
 if(d.rec){const r=(feuilles().recueil||[]).find(x=>x.id===d.rec);if(r){const R=r.data||{};
  for(let i=1;i<=14;i++)if(R["b"+i])scan(R["b"+i],2,"Recueil, besoin "+i);
  ["problemes","motif","diag","histoire"].forEach(k=>R[k]&&scan(R[k],2,"Recueil"));}}
 return Object.values(S).sort((a,b)=>b.score-a.score||PS_BY[a.id].p-PS_BY[b.id].p);}

/* ---------- Formulation et vérifications ---------- */
const psList=a=>a.length<2?a.join(""):a.slice(0,-1).join(", ")+" et "+a[a.length-1];
function psForm(id,d){const p=PS_BY[id]||psCust(id,d),e=d.pb[id]||{},fl=[...(e.fl||[]),...(e.flx?[e.flx]:[])].filter(Boolean),mf=[...(e.mf||[]),...(e.mfx?[e.mfx]:[])].filter(Boolean);
 if(!p)return "";const lie=p.g==="f"?"liée":p.g==="p"?"liés":"lié";
 const au=x=>/^(à|au|aux) /i.test(x)?x:/^les /i.test(x)?"aux "+x.slice(4):/^le /i.test(x)?"au "+x.slice(3):"à "+x;
 let s=p.l+(fl.length?` ${lie} ${psList(fl.map(au))}`:` ${lie} à …`);
 if(p.t==="r")s+=mf.length?`, se manifestant par ${psList(mf)}`:", se manifestant par …";
 return /…$/.test(s)?s:s+".";}
const psCust=(id,d)=>(d.cust||[]).find(x=>x.id===id)||null;
const psAll=(id,d)=>PS_BY[id]||psCust(id,d);
function psCheck(id,d){const p=psAll(id,d),e=d.pb[id]||{},W=[],ok=[];if(!p)return {W,ok};
 const fl=(e.fl||[]).length||e.flx,mf=(e.mf||[]).length||e.mfx,ob=(e.obj||"").trim(),acts=(e.act||[]).length+((e.actx||"").split("\n").filter(x=>x.trim()).length),ev=(e.ev||[]).length||(e.evx||"").trim();
 (fl?ok:W).push(fl?"Facteur lié indiqué (« lié à… »)":"Ajoutez au moins un facteur lié (la cause : « lié à… »).");
 if(p.t==="r")(mf?ok:W).push(mf?"Signes indiqués (« se manifestant par… »)":"Un problème réel s'appuie sur des signes observés : « se manifestant par… ».");
 if(!ob)W.push("Formulez un objectif.");
 else{if(/^(le patient|la patiente|l'enfant|le bébé|la personne|le résident|la résidente|mme|m\.|madame|monsieur|toute aggravation|la plaie|la peau)/i.test(ob))ok.push("L'objectif a le patient pour sujet");else W.push("L'objectif s'écrit avec le patient pour sujet : « Le patient… ».");
  if(/\d|absence|pas de|aucun|sans |ne présentera|ne chutera|exprimera|expliquera|réalisera|pourra|retrouvera|consommera|stabilisera|maintiendra|marchera|urinera|dira|regardera|paraîtra|restera|aura|sera détectée/i.test(ob))ok.push("Objectif observable");else W.push("Rendez l'objectif observable ou mesurable (un chiffre, un comportement visible).");
  if(/d'ici|dans l'heure|dans les|avant |à J\d|à la sortie|pendant|chaque|à chaque|jour|semaine|\d+ ?h\b/i.test(ob))ok.push("Échéance précisée");else W.push("Ajoutez une échéance (dans l'heure, d'ici 48 h, à J3, à la sortie…).");}
 if(/…/.test(psForm(id,d)+ob))W.push("Complétez les « … » avec ce que vous avez observé (chiffres, durée, localisation).");
 if(acts<3)W.push("Prévoyez au moins 3 actions : surveiller, agir, informer ou éduquer.");else ok.push(acts+" actions prévues");
 const allA=[...(e.act||[]),...(e.actx||"").split("\n")].join(" ");
 if(!/surveill|évaluer|évaluation|contrôl|mesur|observer/i.test(allA))W.push("Ajoutez une action de surveillance ou d'évaluation.");
 if(!ev)W.push("Indiquez comment vous évaluerez l'atteinte de l'objectif (critères).");else ok.push("Critères d'évaluation choisis");
 return {W,ok};}
const psOrder=d=>d.sel.slice();
function psText(d){const o=psOrder(d);return o.map((id,i)=>{const p=psAll(id,d),e=d.pb[id]||{};
 const acts=[...(e.act||[]).map(a=>{const A=(p.ac||[]).find(x=>x[0]===a);return "• "+a+(A?` (${PS_ROLE[A[1]]})`:"");}),...(e.actx||"").split("\n").filter(x=>x.trim()).map(x=>"• "+x.trim())];
 return `${i+1}. ${PS_TYPE[p.t]}\nProblème : ${psForm(id,d)}\nObjectif : ${(e.obj||"").trim()||"…"}\nActions :\n${acts.join("\n")||"…"}\nÉvaluation : ${[...(e.ev||[]),...((e.evx||"").trim()?[e.evx.trim()]:[])].join(" ; ")||"…"}`;}).join("\n\n");}

/* ---------- Vues ---------- */
const psStepNames=["Situation","Problèmes","Construire","Vérifier"];
function otProjet(arg){
 const d=psD();
 if(arg&&PBY[arg]&&!d.path.includes(arg)){d.path.push(arg);if(d.step>2)d.step=1;psSave(d);}
 const step=d.step||1;
 const nav_=`<nav class="ps-steps" aria-label="Étapes">${psStepNames.map((n,i)=>`<button type="button" class="ps-st" data-act="ps-step" data-k="${i+1}" aria-current="${step===i+1?"step":"false"}"${i+1>2&&!d.sel.length?" disabled":""}><span>${i+1}</span>${n}</button>`).join("")}</nav>`;
 const body=step===1?psStep1(d):step===2?psStep2(d):step===3?psStep3(d):psStep4(d);
 const foot=`<div class="btn-row ps-foot">${step>1?`<button class="btn ghost" data-act="ps-step" data-k="${step-1}">${IC.back}Précédent</button>`:""}${step<4?`<button class="btn" data-act="ps-step" data-k="${step+1}"${step>=2&&!d.sel.length?" disabled":""}>Suivant : ${psStepNames[step]}</button>`:""}</div>`;
 return `<div class="stack-lg ps">${nav_}${body}${foot}
  <p class="ot-hint">Les propositions s'appuient sur les fiches de l'appli et sur votre saisie : c'est à vous de les choisir, de les adapter à la personne et de les valider avec votre tuteur. Brouillon enregistré sur cet appareil. <button class="link" data-act="ps-reset">Recommencer</button></p>
  <div class="list"><a class="li" href="#cours/guide-projet"><span class="ic tb-ic" style="--c:#2A6F5E">${OT_IC.projet}</span><span><span class="t">Mode d'emploi du projet de soins</span><span class="s">Problème, objectif, actions, évaluation</span></span>${chev}</a>
   <a class="li" href="#feuille/projet/exemple"><span class="ic tb-ic" style="--c:#2A6F5E">${OT_IC.projet}</span><span><span class="t">Voir un projet de soins rédigé</span><span class="s">Exemple complet commenté</span></span>${chev}</a></div></div>`;
}
function psStep1(d){const P=d.pat,R=fsSorted("recueil");
 const f=(k,l,ph)=>`<label>${l}<input data-ps="pat.${k}" value="${esc(P[k]||"")}" placeholder="${esc(ph||"")}" autocomplete="off"></label>`;
 return `<section class="stack-sm"><h2 class="cn-g">1. La situation du patient</h2>
  ${R.length?`<div class="sheet-body stack-sm"><b>Partir d'un recueil de données</b><p class="ot-hint">Les besoins perturbés et la synthèse du recueil servent aussi aux propositions.</p>
   <div class="chips wrapchips">${R.map(r=>`<button class="chip" data-act="ps-rec" data-k="${r.id}" aria-pressed="${d.rec===r.id}">${esc(fsTitle("recueil",r))}</button>`).join("")}</div></div>`:""}
  <div class="sheet-body cd-form"><div class="cd-row">${f("chambre","Chambre","")}${f("initiales","Initiales","Ex. M. D.")}</div><div class="cd-row">${f("age","Âge","")}${f("jour","Jour d'hospitalisation","Ex. J2 post-op")}</div></div>
  <div class="sheet-body stack-sm"><b>Pathologies et motif</b><p class="ot-hint">Tapez le début d'une pathologie, puis ajoutez-la. Plusieurs pathologies possibles (motif, antécédents).</p>
   <div class="cd-form"><input id="ps-q" data-ps="q" placeholder="Ex. AVC, pneumonie, fracture du col…" autocomplete="off"></div><div id="ps-res" class="chips wrapchips"></div>
   ${d.path.length?`<div class="chips wrapchips ps-sel">${d.path.map(id=>PBY[id]?`<button class="chip" data-act="ps-path-del" data-k="${id}" aria-pressed="true" aria-label="Retirer ${esc(PBY[id].n)}">${esc(PBY[id].n)} ✕</button>`:"").join("")}</div>`:`<p class="muted">Aucune pathologie ajoutée.</p>`}</div>
  <div class="sheet-body stack-sm"><b>Le contexte</b><p class="ot-hint">Touchez tout ce qui s'applique.</p>
   <div class="chips wrapchips">${PS_CTX.map(([k,l])=>`<button class="chip" data-act="ps-ctx" data-k="${k}" aria-pressed="${d.ctx.includes(k)}">${esc(l)}</button>`).join("")}</div></div>
  <div class="sheet-body cd-form"><label>Ce que vous avez observé ou recueilli (facultatif)<textarea data-ps="pat.obs" rows="3" placeholder="Ex. dit avoir mal à 6/10 au lever, tousse au repas, ne mange que la moitié du plateau">${esc(P.obs||"")}</textarea></label></div></section>`;}
function psCard(id,d,s){const p=psAll(id,d),on=d.sel.includes(id);
 return `<button type="button" class="ps-card" data-act="ps-sel" data-k="${id}" aria-pressed="${on}"><span class="ps-ck" aria-hidden="true">${on?"✓":""}</span><span class="ps-cbody"><b>${esc(p.l)}</b>
  <span class="ps-tags"><i class="ps-t ps-t-${p.t}">${PS_TYPE_S[p.t]}</i>${p.b?`<i>Besoin ${p.b} · ${esc(HENDERSON[p.b-1])}</i>`:""}</span>${s&&s.why.length?`<small>${s.why.map(esc).join("<br>")}</small>`:""}</span></button>`;}
function psStep2(d){const S=psSuggest(d),top=S.slice(0,14),shown=new Set(top.map(x=>x.id));
 const grp=t=>{const L=top.filter(s=>PS_BY[s.id].t===t);return L.length?`<div class="stack-sm"><h3>${t==="r"?"Problèmes réels (diagnostics infirmiers)":t==="x"?"Risques (diagnostics infirmiers de risque)":"Problèmes en collaboration (risques de complication)"}</h3>${L.map(s=>psCard(s.id,d,s)).join("")}</div>`:"";};
 const others=PS_LIB.filter(p=>!shown.has(p.id));
 return `<section class="stack-sm"><h2 class="cn-g">2. Les problèmes de santé</h2>
  <div class="callout"><b>${d.sel.length?plural(d.sel.length,"problème retenu"):"Choisissez 3 à 5 problèmes prioritaires"}</b><p>Chaque proposition indique d'où elle vient. Gardez ce qui est réel pour <em>cette</em> personne : un problème réel se voit, un risque se prévient.</p></div>
  ${top.length?grp("r")+grp("x")+grp("c"):`<p class="muted">Ajoutez une pathologie ou des éléments de contexte à l'étape 1 pour obtenir des propositions, ou choisissez dans la liste complète ci-dessous.</p>`}
  ${(d.cust||[]).length?`<div class="stack-sm"><h3>Vos problèmes</h3>${d.cust.map(c=>psCard(c.id,d,null)).join("")}</div>`:""}
  <details class="ot-det"${top.length?"":" open"}><summary>Tous les problèmes, par besoin de Henderson</summary><div class="stack-sm">${HENDERSON.map((h,i)=>{const L=others.filter(p=>p.b===i+1);return L.length?`<h4 class="ps-h4">${i+1}. ${esc(h)}</h4>${L.map(p=>psCard(p.id,d,null)).join("")}`:"";}).join("")}</div></details>
  <details class="ot-det"><summary>Ajouter un problème qui n'est pas dans la liste</summary><div class="cd-form stack-sm"><label>Intitulé<input id="ps-cl" placeholder="Ex. Risque d'arrachement de la sonde"></label>
   <label>Type<select id="ps-ct"><option value="r">Diagnostic infirmier réel</option><option value="x">Diagnostic infirmier de risque</option><option value="c">Problème en collaboration</option></select></label>
   <button class="btn" data-act="ps-cust">Ajouter</button></div></details></section>`;}
function psBlock(id,d){const p=psAll(id,d),e=d.pb[id]||{},open=state.psOpen?state.psOpen===id:d.sel[0]===id,ch=psCheck(id,d);
 const chip=(act,v,on,extra="")=>`<button type="button" class="chip" data-act="${act}" data-k="${id}" data-v="${esc(v)}" aria-pressed="${on}">${esc(v)}${extra}</button>`;
 const ta=(k,l,v,ph,r=2)=>`<label>${l}<textarea data-ps="pb.${id}.${k}" rows="${r}" placeholder="${esc(ph||"")}">${esc(v||"")}</textarea></label>`;
 return `<details class="ps-blk" id="ps-b-${id}"${open?" open":""} data-ps-open="${id}"><summary><span class="ps-t ps-t-${p.t}">${PS_TYPE_S[p.t]}</span><b>${esc(p.l)}</b><span class="ps-badge ${ch.W.length?"warn":"ok"}">${ch.W.length?ch.W.length+" à revoir":"Complet"}</span></summary>
  <div class="stack-sm ps-in">
   <div class="ps-form" aria-live="polite"><span class="eyebrow">Formulation</span><p id="ps-f-${id}">${esc(psForm(id,d))}</p></div>
   <h4 class="ps-h4">Lié à… <small>la cause, ce sur quoi vous pouvez agir</small></h4>
   <div class="chips wrapchips">${(p.fl||[]).map(v=>chip("ps-fl",v,(e.fl||[]).includes(v))).join("")}</div>
   <div class="cd-form"><input data-ps="pb.${id}.flx" value="${esc(e.flx||"")}" placeholder="Autre facteur, avec vos mots"></div>
   ${p.t==="r"?`<h4 class="ps-h4">Se manifestant par… <small>les signes que vous avez observés</small></h4>
   <div class="chips wrapchips">${(p.mf||[]).map(v=>chip("ps-mf",v,(e.mf||[]).includes(v))).join("")}</div>
   <div class="cd-form"><input data-ps="pb.${id}.mfx" value="${esc(e.mfx||"")}" placeholder="Autre signe, avec les chiffres (EN 6/10, FR 26/min…)"></div>`:`<p class="ot-hint">${p.t==="x"?"Un risque n'a pas encore de signes : on ne met pas « se manifestant par ».":"Problème en collaboration : vous surveillez, prévenez et alertez ; le traitement est médical."}</p>`}
   <h4 class="ps-h4">Objectif <small>le patient pour sujet, mesurable, avec une échéance</small></h4>
   ${(p.ob||[]).length?`<div class="stack-sm ps-obs">${p.ob.map((o,i)=>`<button type="button" class="ps-ob" data-act="ps-ob" data-k="${id}" data-v="${i}">${esc(o)}</button>`).join("")}</div>`:""}
   <div class="cd-form">${ta("obj","Mon objectif",e.obj,"Le patient… (que verra-t-on ?) … d'ici …")}</div>
   <div class="chips wrapchips ps-ech">${PS_ECH.map(x=>`<button type="button" class="chip" data-act="ps-ech" data-k="${id}" data-v="${esc(x)}">${esc(x)}</button>`).join("")}</div>
   <h4 class="ps-h4">Actions infirmières <small>touchez pour ajouter</small></h4>
   <div class="ps-acts">${(p.ac||[]).map(([v,r])=>`<button type="button" class="ps-ac" data-act="ps-ac" data-k="${id}" data-v="${esc(v)}" aria-pressed="${(e.act||[]).includes(v)}"><span class="ps-ck" aria-hidden="true">${(e.act||[]).includes(v)?"✓":""}</span><span>${esc(v)}<i class="ps-role ps-role-${r}">${PS_ROLE[r]}</i></span></button>`).join("")}</div>
   <div class="cd-form">${ta("actx","Autres actions (une par ligne, avec les horaires si besoin)",e.actx,"Ex. Peser chaque lundi à 7 h",2)}</div>
   <h4 class="ps-h4">Évaluation <small>ce que vous regarderez pour savoir si l'objectif est atteint</small></h4>
   <div class="chips wrapchips">${(p.ev||[]).map(v=>chip("ps-ev",v,(e.ev||[]).includes(v))).join("")}</div>
   <div class="cd-form">${ta("evx","Autre critère ou résultat de l'évaluation",e.evx,"Ex. 12/11 : EN 2/10 au lever, objectif atteint",2)}</div>
   ${ch.W.length?`<div class="callout warn"><b>À revoir</b><ul class="clean">${ch.W.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>`:`<div class="callout"><b>Ce problème est complet.</b></div>`}
  </div></details>`;}
function psStep3(d){if(!d.sel.length)return `<p class="muted">Choisissez d'abord des problèmes à l'étape 2.</p>`;
 return `<section class="stack-sm"><h2 class="cn-g">3. Construire chaque problème</h2><p class="ot-hint">Pour chaque problème : cochez les causes et les signes qui correspondent à votre patient, choisissez ou écrivez l'objectif, retenez les actions et les critères d'évaluation.</p>
  ${d.sel.map(id=>psBlock(id,d)).join("")}</section>`;}
function psStep4(d){if(!d.sel.length)return `<p class="muted">Choisissez d'abord des problèmes à l'étape 2.</p>`;
 const all=d.sel.map(id=>({id,c:psCheck(id,d)})),warn=all.filter(x=>x.c.W.length).length,G=[];
 const prio=d.sel.map(id=>psAll(id,d).p||3);if(prio.some((x,i)=>i>0&&x<prio[0]))G.push("Un problème plus urgent (respiration, hémorragie, aggravation neurologique) n'est pas en tête : classez par priorité vitale d'abord.");
 if(d.sel.length>6)G.push("Plus de 6 problèmes : gardez les plus importants pour ce patient, aujourd'hui.");
 if(!d.sel.some(id=>psAll(id,d).t==="r"))G.push("Aucun problème réel : vérifiez si le patient présente déjà des difficultés observables.");
 if(!d.sel.some(id=>psAll(id,d).b>=10))G.push("Pensez aux besoins relationnels et éducatifs (communiquer, apprendre), souvent oubliés.");
 return `<section class="stack-sm"><h2 class="cn-g">4. Vérifier, hiérarchiser, créer</h2>
  <div class="callout${warn||G.length?" warn":""}"><b>${warn?plural(warn,"problème")+" à compléter":"Tous les problèmes sont complets"}</b>${G.length?`<ul class="clean">${G.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:""}</div>
  <p class="ot-hint">Classez du plus prioritaire au moins prioritaire : ce qui menace la vie, puis le confort et la sécurité, puis l'autonomie et l'éducation.</p>
  <div class="list">${all.map(({id,c},i)=>{const p=psAll(id,d);return `<div class="li ps-row"><span class="fs-rank">${i+1}</span><span><span class="t">${esc(psForm(id,d))}</span><span class="s">${PS_TYPE[p.t]} · ${c.W.length?`<b class="ps-w">${plural(c.W.length,"point")} à revoir</b>`:"complet"}</span></span>
   <span class="fs-arrows"><button class="del" data-act="ps-move" data-k="${id}" data-v="-1" ${i?"":"disabled"} aria-label="Monter">↑</button><button class="del" data-act="ps-move" data-k="${id}" data-v="1" ${i<all.length-1?"":"disabled"} aria-label="Descendre">↓</button><button class="del" data-act="ps-edit" data-k="${id}" aria-label="Modifier">✎</button></span></div>`;}).join("")}</div>
  <details class="ot-det"><summary>Aperçu du texte</summary><pre class="ps-pre">${esc(psText(d))}</pre></details>
  <div class="btn-row"><button class="btn" data-act="ps-create">${IC.plus}Créer la feuille « Projet de soins »</button><button class="btn ghost" data-act="ps-copy">${OT_IC.copy}Copier le texte</button></div>
  <p class="ot-hint">La feuille créée se modifie, s'imprime et s'exporte en PDF comme les autres feuilles de travail.</p></section>`;}
/* lien depuis une fiche pathologie */
const psCta=id=>`<a class="a4-cta" href="#outil/projet/${encodeURIComponent(id)}"><span class="a4-cta-ic">${OT_IC.projet}</span><span><b>Projet de soins</b><small>Problèmes proposés, à adapter</small></span></a>`;

/* ---------- Saisie et actions ---------- */
function psRefreshBlock(id,d){const el=document.getElementById("ps-b-"+id);if(!el)return;const open=el.open;el.outerHTML=psBlock(id,d);const n=document.getElementById("ps-b-"+id);if(n)n.open=open;}
function psSearch(q){const box=document.getElementById("ps-res");if(!box)return;const Q=fold(q.trim());if(Q.length<2){box.innerHTML="";return;}const d=psD();
 const L=PATHOS.filter(p=>fold(p.n).includes(Q)&&!d.path.includes(p.i)).sort((a,b)=>fold(a.n).indexOf(Q)-fold(b.n).indexOf(Q)).slice(0,8);
 box.innerHTML=L.length?L.map(p=>`<button class="chip" data-act="ps-path" data-k="${p.i}">+ ${esc(p.n)}</button>`).join(""):`<span class="muted">Aucune pathologie trouvée.</span>`;}
function psInput(t){const k=t.dataset.ps;if(k==="q"){psSearch(t.value);return;}const d=psD(),parts=k.split(".");
 if(parts[0]==="pat")d.pat[parts[1]]=t.value;
 else if(parts[0]==="pb"){const e=d.pb[parts[1]]=d.pb[parts[1]]||{};e[parts[2]]=t.value;psSave(d);
  const f=document.getElementById("ps-f-"+parts[1]);if(f&&(parts[2]==="flx"||parts[2]==="mfx"))f.textContent=psForm(parts[1],d);return;}
 psSave(d);}
function psAct(b,a){const d=psD(),k=b.dataset.k,v=b.dataset.v;
 const tog=(arr,x)=>arr.includes(x)?arr.filter(y=>y!==x):[...arr,x];
 const E=id=>d.pb[id]=d.pb[id]||{fl:[],mf:[],act:[],ev:[]};
 if(a==="ps-step"){const n=+k;if(n>2&&!d.sel.length){toast("Choisissez au moins un problème");return;}d.step=n;psSave(d);render();window.scrollTo(0,0);return;}
 if(a==="ps-reset"){if(!b.dataset.armed){b.dataset.armed="1";b.textContent="Confirmer : tout effacer";setTimeout(()=>{if(b.isConnected){delete b.dataset.armed;b.textContent="Recommencer";}},3500);return;}
  psSave(psNew());state.psOpen=null;toast("Nouveau projet");render();window.scrollTo(0,0);return;}
 if(a==="ps-rec"){d.rec=d.rec===k?"":k;if(d.rec){const r=(feuilles().recueil||[]).find(x=>x.id===k);if(r){const R=r.data||{};["chambre","initiales","age"].forEach(x=>{if(R[x]&&!d.pat[x])d.pat[x]=R[x];});
  const T=fold([R.diag,R.motif].join(" "));PATHOS.forEach(p=>{if(T&&fold(p.n).length>3&&T.includes(fold(p.n))&&!d.path.includes(p.i))d.path.push(p.i);});}}
  psSave(d);haptic();render();return;}
 if(a==="ps-path"){if(!d.path.includes(k))d.path.push(k);psSave(d);haptic();render();setTimeout(()=>{const q=document.getElementById("ps-q");q&&q.focus();},30);return;}
 if(a==="ps-path-del"){d.path=d.path.filter(x=>x!==k);psSave(d);render();return;}
 if(a==="ps-ctx"){d.ctx=tog(d.ctx,k);psSave(d);b.setAttribute("aria-pressed",d.ctx.includes(k));haptic();return;}
 if(a==="ps-sel"){const on=!d.sel.includes(k);d.sel=on?[...d.sel,k]:d.sel.filter(x=>x!==k);
  if(on&&!d.pb[k]){const p=psAll(k,d);d.pb[k]={fl:[],mf:[],act:(p.ac||[]).slice(0,3).map(x=>x[0]),ev:(p.ev||[]).slice(0,1),obj:(p.ob||[])[0]||""};}
  if(on)d.sel.sort((x,y)=>(psAll(x,d).p||3)-(psAll(y,d).p||3));psSave(d);haptic();render();return;}
 if(a==="ps-cust"){const l=(document.getElementById("ps-cl")||{}).value||"",t=(document.getElementById("ps-ct")||{}).value||"r";if(!l.trim()){toast("Écrivez l'intitulé du problème");return;}
  const id="c"+cnId();d.cust=[...(d.cust||[]),{id,l:l.trim(),t,p:3,fl:[],mf:[],ob:[],ac:[],ev:[]}];d.sel.push(id);d.pb[id]={fl:[],mf:[],act:[],ev:[]};psSave(d);toast("Problème ajouté");render();return;}
 if(["ps-fl","ps-mf","ps-ev","ps-ac"].includes(a)){const e=E(k),key={"ps-fl":"fl","ps-mf":"mf","ps-ev":"ev","ps-ac":"act"}[a];e[key]=tog(e[key]||[],v);psSave(d);state.psOpen=k;haptic();psRefreshBlock(k,d);return;}
 if(a==="ps-ob"){const e=E(k),p=psAll(k,d);e.obj=(p.ob||[])[+v]||"";psSave(d);state.psOpen=k;psRefreshBlock(k,d);return;}
 if(a==="ps-ech"){const e=E(k);let o=(e.obj||"").trim().replace(/\s*(dans l'heure|d'ici [^.]*|à J\d+|à la sortie|pendant toute l'hospitalisation|pendant l'hospitalisation)\s*\.?$/i,"").replace(/\.$/,"");e.obj=(o||"Le patient …")+" "+v+".";psSave(d);state.psOpen=k;psRefreshBlock(k,d);return;}
 if(a==="ps-move"){const i=d.sel.indexOf(k),j=i+(+v);if(i>=0&&j>=0&&j<d.sel.length){[d.sel[i],d.sel[j]]=[d.sel[j],d.sel[i]];psSave(d);haptic();}render();return;}
 if(a==="ps-edit"){d.step=3;state.psOpen=k;psSave(d);render();setTimeout(()=>{const el=document.getElementById("ps-b-"+k);el&&el.scrollIntoView({block:"start"});},40);return;}
 if(a==="ps-copy"){otCopy(psText(d));return;}
 if(a==="ps-create"){const F=feuilles(),P=d.pat,ctxL=d.ctx.map(c=>(PS_CTX.find(x=>x[0]===c)||[])[1]).filter(Boolean);
  const contexte=[d.path.map(id=>PBY[id]&&PBY[id].n).filter(Boolean).join(", "),P.jour,ctxL.join(", "),P.obs].filter(Boolean).join(". ");
  const pb=d.sel.map(id=>{const p=psAll(id,d),e=d.pb[id]||{};
   const acts=[...(e.act||[]).map(x=>{const A=(p.ac||[]).find(y=>y[0]===x);return "• "+x+(A?` (${PS_ROLE[A[1]]})`:"");}),...(e.actx||"").split("\n").filter(x=>x.trim()).map(x=>"• "+x.trim())].join("\n");
   return {id:cnId(),type:PS_TYPE[p.t],probleme:psForm(id,d),objectif:(e.obj||"").trim(),actions:acts,evaluation:[...(e.ev||[]),...((e.evx||"").trim()?[e.evx.trim()]:[])].join(" ; ")};});
  const it={id:cnId(),created:todayISO(),updated:todayISO(),data:{chambre:P.chambre||"",initiales:P.initiales||"",age:P.age||"",date:todayISO(),contexte,pb}};
  F.projet=[it,...(F.projet||[])];saveFeuilles(F);haptic();toast("Feuille « Projet de soins » créée");nav("feuille/projet/"+it.id);return;}
}
/* garder l'état ouvert/fermé des blocs */
document.addEventListener("toggle",ev=>{const el=ev.target;if(el&&el.dataset&&el.dataset.psOpen&&el.open)state.psOpen=el.dataset.psOpen;},true);
