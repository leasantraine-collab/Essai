/* Carnet IFSI — cours complets de soins : chirurgie, transfusion, urgences de l'enfant, gériatrie (UE 4.4, 4.3, 2.3 | B.3). */
(()=>{const L=[
CV("chirurgie-c","soins","Le patient opéré : avant, pendant, après","50 min","4.4 4.5 2.4|B.3 B.4","alert",
 ["Préparer un patient à une intervention chirurgicale","Connaître la **check-list** de sécurité au bloc","Surveiller un patient en **post-opératoire** immédiat et à distance","Repérer les **complications** post-opératoires","Préparer la sortie"],
 [
 {h:"La préparation préopératoire",chip:"Avant",b:[
  {t:"p",ps:["La préparation commence dès la **consultation d'anesthésie**, au moins 48 h avant une intervention programmée. Elle vise à réduire les risques liés à l'anesthésie et le risque infectieux."]},
  {t:"liste",items:["**Identité** vérifiée, bracelet en place, dossier complet (consentement, consultation d'anesthésie, bilans, groupe sanguin et RAI si prescrits)","**Jeûne** : en général 6 h pour les solides, 2 h pour les liquides clairs, selon le protocole de l'établissement","**Douche préopératoire** selon protocole, ongles courts et sans vernis, pas de bijoux ni maquillage","**Dépilation** seulement si nécessaire, à la tondeuse, jamais au rasoir","Retrait des **prothèses** (dentaires, auditives, lunettes, lentilles) au dernier moment","Traitements personnels : poursuivis ou arrêtés selon la prescription (**anticoagulants**, antidiabétiques)","Prémédication si prescrite, **miction** avant le départ","Constantes, glycémie si diabétique, poids"]},
  {t:"pieges",items:["Oublier de vérifier l'**arrêt des anticoagulants** ou des antiagrégants selon la consigne de l'anesthésiste","Raser la zone opératoire : les micro-coupures augmentent le risque d'infection"]}]},
 {h:"Au bloc opératoire",chip:"Bloc",b:[
  {t:"p",ps:["La **check-list « Sécurité du patient au bloc opératoire »** de la HAS est vérifiée à trois temps : avant l'induction anesthésique, avant l'incision (« time out »), après l'intervention. Elle contrôle l'identité, le site opératoire, le matériel, les risques allergiques et hémorragiques."]},
  {t:"table",rows:[["Anesthésie générale","perte de conscience, ventilation assistée"],["Rachianesthésie, péridurale","anesthésie de la moitié inférieure du corps"],["Anesthésie locorégionale","bloc d'un nerf ou d'un membre"]]}]},
 {h:"La surveillance post-opératoire",chip:"Après",b:[
  {t:"p",ps:["En **salle de surveillance post-interventionnelle** (SSPI), le patient est surveillé jusqu'au réveil complet. Le retour en chambre se fait sur critères (score d'Aldrete). Dans le service, la surveillance est rapprochée les premières heures, puis espacée selon la prescription."]},
  {t:"table",rows:[["Conscience","réveil, orientation"],["Constantes","pouls, TA, FR, SpO₂, température"],["Douleur","EVA/EN régulière, efficacité des antalgiques"],["Pansement","propre, sec ; saignement, écoulement"],["Drains, redons","quantité, aspect, perméabilité"],["Diurèse","**première miction** dans les 6 à 8 h, sinon bladder scan"],["Perfusion","débit, point de ponction"],["Nausées, vomissements","fréquents après anesthésie"],["Membres","après rachianesthésie : retour de la motricité et de la sensibilité"]]},
  {t:"exemple",h:"Signes d'hémorragie",ps:["Pouls qui accélère, TA qui baisse, pâleur, sueurs, pansement ou redon qui se remplit de sang rouge, agitation. On alerte immédiatement, on surveille rapprochée et on prépare une voie veineuse et un bilan."]}]},
 {h:"Les complications",chip:"Complications",b:[
  {t:"table",rows:[["J0-J1","hémorragie, douleur, nausées, rétention urinaire, hypothermie"],["J2-J5","fièvre précoce, encombrement, **pneumopathie**, phlébite, iléus"],["J5-J10","**infection du site opératoire**, lâchage de suture (fistule), embolie pulmonaire"]]},
  {t:"liste",items:["**Lever précoce** : prévient phlébite, encombrement, escarres, constipation","**Kinésithérapie respiratoire**, spirométrie incitative","**Anticoagulant préventif** et contention selon prescription","Reprise alimentaire progressive selon la chirurgie","Surveiller la reprise du **transit** (gaz, selles)"]},
  {t:"verif",items:[["Un patient opéré il y a 6 jours a 38,8 °C et une cicatrice rouge et douloureuse. Que suspecter ?","Une infection du site opératoire : on surveille, on alerte et on prépare un éventuel prélèvement."],["Pourquoi le lever précoce est-il prescrit ?","Pour prévenir la thrombose veineuse, l'encombrement pulmonaire, les escarres, l'iléus et la perte d'autonomie."]]}]},
 {h:"Préparer la sortie",chip:"Sortie",b:[
  {t:"liste",items:["Ordonnances : antalgiques, anticoagulant, soins infirmiers à domicile","Rendez-vous de consultation, date d'ablation des fils ou agrafes","Conseils : signes d'infection, douleur, fièvre, saignement à signaler","Reprise des activités, douche, conduite","Lettre de liaison"]},
  {t:"retenir",txt:"Après une chirurgie : **douleur, saignement, constantes, diurèse, pansement, drains**. Le **lever précoce** est un soin à part entière."}]}
 ],
 ["Avant : identité, jeûne, douche, dossier, traitements, check-list","Check-list HAS : avant induction, avant incision, après","Après : conscience, constantes, douleur, pansement, drains, diurèse","Hémorragie : tachycardie avant hypotension","Lever précoce, kinésithérapie respiratoire, anticoagulant préventif"]),

CV("transfusion","soins","La transfusion sanguine","35 min","4.4 4.5|B.3 B.4","tube",
 ["Connaître les **produits sanguins labiles** et leurs indications","Maîtriser la **sécurité transfusionnelle** : documents, contrôles","Réaliser le **contrôle ultime pré-transfusionnel** au lit du patient","Surveiller une transfusion et reconnaître un **accident**","Assurer la traçabilité et l'hémovigilance"],
 [
 {h:"Les produits sanguins",chip:"Produits",b:[
  {t:"table",rows:[["Concentré de globules rouges (CGR)","anémie mal tolérée, hémorragie ; conservé au frais ; à transfuser **dans les 6 h** après réception"],["Concentré plaquettaire","thrombopénie avec saignement ou avant un geste ; conservé à température ambiante, sous agitation"],["Plasma frais congelé","troubles de la coagulation graves, hémorragie massive"]],note:"La transfusion est un acte sur **prescription médicale**, réalisé par l'infirmier avec un médecin joignable et pouvant intervenir rapidement."},
  {t:"p",ps:["Le patient doit être **informé** des bénéfices et des risques, et une information post-transfusionnelle lui est remise. Un bilan (groupe, RAI) est réalisé avant."]}]},
 {h:"Les documents et contrôles",chip:"Documents",b:[
  {t:"liste",items:["**Deux déterminations** de groupe sanguin sur deux prélèvements distincts","**RAI** (recherche d'agglutinines irrégulières) de moins de 72 h, selon les règles","**Prescription** nominative","**Fiche de délivrance**","Réception des produits : vérifier l'**intégrité** des poches, la concordance avec la fiche de délivrance, la date de péremption"]},
  {t:"pieges",items:["Prélever deux groupes au même moment par la même personne : les deux déterminations doivent être **indépendantes**","Stocker une poche dans un réfrigérateur du service : c'est interdit"]}]},
 {h:"Le contrôle ultime pré-transfusionnel",chip:"Contrôle ultime",b:[
  {t:"p",ps:["Il est réalisé **au lit du patient**, pour **chaque poche** de globules rouges, par la personne qui transfuse, juste avant la pose."]},
  {t:"etapes",items:["**Identité** : faire décliner nom, prénom, date de naissance au patient ; vérifier le bracelet.","**Concordance** entre identité, prescription, carte de groupe, fiche de délivrance et étiquette de la poche.","**Compatibilité** : test biologique au lit avec la carte de contrôle (sang du patient et sang de la poche) pour les CGR.","Interpréter le test et le conserver selon le protocole."]},
  {t:"verif",items:[["Le contrôle ultime est-il fait une fois pour toutes les poches ?","Non : il est fait pour chaque poche de globules rouges, au lit du patient."]]}]},
 {h:"Pose et surveillance",chip:"Surveillance",b:[
  {t:"etapes",items:["Constantes **avant** : TA, pouls, température, état clinique.","Voie veineuse dédiée, transfuseur avec filtre.","Débit **lent les 15 premières minutes**, en restant auprès du patient.","Constantes à 15 min puis régulièrement selon le protocole, et en fin de transfusion.","Surveillance clinique jusqu'à 2 h après."]},
  {t:"signes",e:"Alerte",h:"Signes d'accident transfusionnel",items:["Frissons, fièvre","Douleurs lombaires ou thoraciques","Malaise, hypotension, état de choc","Urticaire, dyspnée","Urines foncées, saignement"]},
  {t:"info",txt:"**Devant un signe anormal** : arrêter la transfusion, garder la voie veineuse avec du NaCl 0,9 %, prévenir le médecin, surveiller, conserver la poche et la tubulure, déclarer à l'**hémovigilance**."}]},
 {h:"Traçabilité",chip:"Traçabilité",b:[
  {t:"trace",items:["Numéro de chaque poche","Heure de début et de fin","Identité du transfuseur","Constantes et tolérance","Résultat du contrôle ultime","Incident éventuel déclaré"]},
  {t:"retenir",txt:"La sécurité transfusionnelle repose sur l'**identité**, la **concordance** des documents et le **contrôle ultime** au lit, pour **chaque poche**. Au moindre signe anormal : **stop**, voie gardée, alerte."}]}
 ],
 ["CGR à transfuser dans les 6 h après réception","Deux déterminations de groupe indépendantes + RAI valide","Contrôle ultime au lit, pour chaque poche de CGR","Débit lent et présence les 15 premières minutes","Accident : arrêter, garder la voie, alerter, conserver la poche, déclarer"]),

CV("pediatrie-c","patho","L'enfant malade et ses urgences","40 min","2.3 4.3|B.1 B.3","baby",
 ["Connaître les **normes de constantes** selon l'âge","Évaluer la **douleur** de l'enfant","Prendre en charge la **fièvre** et les convulsions fébriles","Reconnaître la **déshydratation** et la **bronchiolite** graves","Adapter la relation à l'enfant et aux parents"],
 [
 {h:"Les repères selon l'âge",chip:"Normes",b:[
  {t:"table",rows:[["Nouveau-né","FC 120–160 ; FR 30–60"],["Nourrisson (1 à 12 mois)","FC 100–160 ; FR 30–50"],["Enfant de 1 à 5 ans","FC 90–140 ; FR 20–40"],["Enfant de 6 à 12 ans","FC 70–120 ; FR 18–30"]],note:"Repères indicatifs qui varient selon les sources. Les doses de médicaments se calculent **au poids** : on pèse toujours l'enfant."},
  {t:"info",txt:"L'enfant se **déshydrate** et se **refroidit** plus vite que l'adulte : il a moins de réserves."}]},
 {h:"La douleur de l'enfant",chip:"Douleur",b:[
  {t:"table",rows:[["Avant 4 ans","échelles d'hétéro-évaluation : EVENDOL, FLACC"],["À partir de 4 ans","échelle des visages (FPS-R)"],["À partir de 6-8 ans","EVA, échelle numérique"]]},
  {t:"schema",k:"visages"},
  {t:"liste",items:["Prévenir la douleur des soins : **crème anesthésiante**, MEOPA, solution sucrée chez le nourrisson","Présence des parents, **distraction**","Expliquer avec des mots adaptés, ne pas mentir (« ça ne fera pas mal »)"]}]},
 {h:"Fièvre et convulsions",chip:"Fièvre",b:[
  {t:"p",ps:["La fièvre est définie par une température ≥ **38 °C**. Elle n'est pas dangereuse en soi : on traite surtout l'**inconfort** (paracétamol au poids, 15 mg/kg toutes les 6 h), on découvre l'enfant, on fait boire."]},
  {t:"signes",e:"Alerte",h:"Fièvre : signes de gravité",items:["Nourrisson **de moins de 3 mois** fébrile","**Purpura**","Enfant geignard, hypotonique, difficile à réveiller","Teint gris, marbrures","Détresse respiratoire","Refus de boire"]},
  {t:"p",ps:["La **convulsion fébrile** touche l'enfant de 6 mois à 5 ans. Elle est souvent brève et bénigne. Conduite : protéger, noter l'heure, PLS, rien dans la bouche ; si elle dure plus de 5 minutes, traitement par benzodiazépine selon prescription."]}]},
 {h:"La déshydratation",chip:"Déshydratation",b:[
  {t:"p",ps:["La **gastro-entérite** est la cause principale. La gravité se mesure par la **perte de poids** : au-delà de 10 %, c'est une urgence."]},
  {t:"signes",h:"Signes de déshydratation",items:["Perte de poids","Fontanelle déprimée","Yeux creux, cernés","Pli cutané","Muqueuses sèches, pas de larmes","Diminution des urines (couches sèches)","Somnolence, tachycardie"]},
  {t:"info",blue:true,txt:"Traitement de première intention : **solution de réhydratation orale** (SRO), par petites quantités très fréquentes, et poursuite de l'alimentation."}]},
 {h:"La bronchiolite",chip:"Bronchiolite",b:[
  {t:"p",ps:["Infection virale (souvent VRS) des petites bronches du **nourrisson de moins de 2 ans**, en épidémie l'hiver. Toux, gêne respiratoire, sifflements."]},
  {t:"liste",items:["**Désobstruction rhinopharyngée** au sérum physiologique, avant les repas","Fractionner les biberons","Position proclive","Surveiller FR, SpO₂, signes de lutte, prise alimentaire"]},
  {t:"signes",e:"Alerte",h:"Bronchiolite grave",items:["Âge < 6 semaines ou prématurité","FR > 60 /min ou pauses respiratoires","Tirage important","SpO₂ < 92 %","Alimentation < 50 % des apports habituels"]}]},
 {h:"L'enfant et ses parents",chip:"Relation",b:[
  {t:"liste",items:["Les **parents** sont des partenaires : ils connaissent leur enfant","Respecter le doudou, les rituels, le jeu","Information adaptée à l'âge, consentement des titulaires de l'autorité parentale","Charte de l'enfant hospitalisé : présence des parents 24 h/24"]},
  {t:"retenir",txt:"Chez l'enfant : **peser**, doser **au poids**, évaluer la douleur avec une **échelle adaptée à l'âge**. Moins de 3 mois fébrile, purpura, déshydratation > 10 % ou détresse respiratoire : **urgence**."}]}
 ],
 ["Normes de constantes selon l'âge ; doses au poids","Douleur : EVENDOL/FLACC, visages, EVA selon l'âge","Paracétamol 15 mg/kg toutes les 6 h","Déshydratation : perte de poids, SRO","Bronchiolite : DRP, fractionnement, surveillance FR et SpO₂"]),

CV("geriatrie-c","patho","La personne âgée et la gériatrie","40 min","2.3 2.7 4.1|B.1 B.3","scale",
 ["Comprendre le **vieillissement normal** et la **fragilité**","Repérer les grands **syndromes gériatriques**","Prévenir la **iatrogénie** médicamenteuse","Évaluer l'autonomie","Connaître les structures d'accueil et d'aide"],
 [
 {h:"Vieillissement et fragilité",chip:"Fragilité",b:[
  {t:"p",ps:["Le vieillissement normal diminue les **réserves** de chaque organe : le rein filtre moins, le cœur s'adapte moins vite, la masse musculaire diminue, la sensation de soif s'émousse. La personne âgée va bien au repos, mais **décompense vite** face à un stress (infection, chirurgie, déshydratation).","La **fragilité** est un état intermédiaire entre robustesse et dépendance : perte de poids, fatigue, lenteur de marche, faiblesse, activité réduite. Elle est réversible si on la repère tôt."]},
  {t:"analogie",txt:"Un organisme âgé fonctionne comme une **voiture sans roue de secours** : elle roule bien sur une route plate, mais la moindre crevaison l'immobilise."}]},
 {h:"Les syndromes gériatriques",chip:"Syndromes",b:[
  {t:"table",rows:[["Chutes","cause et conséquence de la fragilité ; syndrome post-chute"],["Confusion aiguë","toujours une cause à chercher"],["Dénutrition","pesée régulière"],["Incontinence","à explorer, pas une fatalité"],["Escarres","prévention dès l'entrée"],["Dépression","souvent masquée (plaintes physiques, repli)"],["Syndrome de glissement","refus de s'alimenter, repli, désintérêt après un événement : urgence gériatrique"]]},
  {t:"verif",items:[["Une patiente de 88 ans hospitalisée pour une fracture refuse de manger et se replie depuis 3 jours. Que craindre ?","Un syndrome de glissement : on alerte, on évalue, on recherche une cause, on stimule et on associe les proches."]]}]},
 {h:"Les médicaments chez la personne âgée",chip:"Iatrogénie",b:[
  {t:"p",ps:["La **iatrogénie** médicamenteuse provoque une part importante des hospitalisations des plus de 75 ans. Causes : **polymédication**, élimination rénale diminuée, sensibilité accrue du cerveau, erreurs de prise."]},
  {t:"pieges",items:["Les **benzodiazépines** à demi-vie longue favorisent chutes et confusion","Les **anticholinergiques** favorisent confusion, rétention urinaire, constipation","Adapter les doses à la **fonction rénale**","Un nouveau symptôme peut être un **effet indésirable** : y penser avant d'ajouter un médicament"]}]},
 {h:"Évaluer l'autonomie",chip:"Autonomie",b:[
  {t:"table",rows:[["ADL (Katz)","activités de base : toilette, habillage, toilettes, transferts, continence, repas"],["IADL","activités instrumentales : téléphone, courses, médicaments, argent"],["AGGIR","grille qui classe en GIR 1 (très dépendant) à 6 ; ouvre droit à l'**APA** pour les GIR 1 à 4"],["MMSE","évaluation cognitive sur 30"]]},
  {t:"table",rows:[["EHPAD","établissement d'hébergement pour personnes âgées dépendantes"],["SSIAD","soins infirmiers à domicile"],["Accueil de jour, hébergement temporaire","répit des aidants"],["Équipe mobile de gériatrie","conseil dans les services"]]},
  {t:"retenir",txt:"Chez la personne âgée, une maladie aiguë se présente souvent de façon **atypique** (chute, confusion, refus alimentaire). Prévenir la **perte d'autonomie** guide chaque soin."}]}
 ],
 ["Réserves diminuées : décompensation rapide","Fragilité repérable et réversible","Syndromes gériatriques : chutes, confusion, dénutrition, glissement","Iatrogénie : polymédication, rein, benzodiazépines, anticholinergiques","AGGIR : GIR 1 à 6 ; APA pour GIR 1 à 4"])
];
L.forEach(norm);L.forEach(c=>{const i=COURS.findIndex(x=>x.id===c.id);if(i>=0)COURS[i]=c;else COURS.push(c);});})();
