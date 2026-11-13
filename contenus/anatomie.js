/* Carnet IFSI — cours complets d'anatomie et physiologie (UE 2.1, 2.2 | B.1). */
(()=>{const L=[
CV("nerveux-c","anat","Le système nerveux","50 min","2.2 2.6 2.7|B.1","brain",
 ["Distinguer **système nerveux central** et **périphérique**","Décrire le **neurone** et la transmission de l'influx","Situer les grandes fonctions des **lobes cérébraux**","Expliquer le rôle du **système nerveux autonome** (sympathique, parasympathique)","Relier l'anatomie aux signes d'un AVC, d'un traumatisme crânien ou d'une compression médullaire"],
 [
 {h:"Organisation générale",chip:"Organisation",b:[
  {t:"p",ps:["Le système nerveux reçoit les informations (sensibilité), les analyse, puis commande une réponse (motricité, sécrétion). On distingue le **système nerveux central** (SNC), formé de l'**encéphale** et de la **moelle épinière**, protégés par le crâne, la colonne vertébrale et les **méninges**, et le **système nerveux périphérique** (SNP), formé des **nerfs** crâniens et rachidiens qui relient le SNC au reste du corps.","Le **liquide céphalo-rachidien** (LCR), produit dans les ventricules cérébraux, circule autour du SNC : il amortit les chocs et assure des échanges. On le prélève par **ponction lombaire**."]},
  {t:"table",rows:[["Dure-mère","méninge externe, épaisse, collée au crâne"],["Arachnoïde","méninge intermédiaire ; le LCR circule dessous"],["Pie-mère","méninge interne, collée au cerveau"]],note:"Une inflammation des méninges est une **méningite** : fièvre, céphalées, raideur de nuque, photophobie."}]},
 {h:"Le neurone et la synapse",chip:"Neurone",b:[
  {t:"p",ps:["Le **neurone** est la cellule nerveuse. Il comporte un **corps cellulaire**, des **dendrites** qui reçoivent l'information et un **axone** qui la transmet, souvent entouré d'une gaine de **myéline** qui accélère la conduction. Les neurones ne se renouvellent presque pas : une lésion est souvent définitive.","L'influx nerveux est électrique le long de l'axone, puis chimique à la **synapse** : l'axone libère un **neurotransmetteur** (acétylcholine, dopamine, sérotonine, noradrénaline, GABA) qui se fixe sur la cellule suivante."]},
  {t:"analogie",txt:"Le neurone fonctionne comme un **câble électrique** relié à un relais : le courant parcourt le fil (axone), puis un messager chimique traverse le petit espace du relais (synapse) pour transmettre le signal."},
  {t:"table",rows:[["Dopamine","mouvement, motivation ; manque dans la **maladie de Parkinson**"],["Sérotonine","humeur, sommeil ; cible des antidépresseurs"],["Acétylcholine","mémoire, contraction musculaire ; diminuée dans **Alzheimer**"],["GABA","frein du cerveau ; renforcé par les benzodiazépines"]]},
  {t:"pieges",items:["La **sclérose en plaques** détruit la myéline, pas le neurone lui-même au début : la conduction devient lente et irrégulière"]}]},
 {h:"L'encéphale",chip:"Encéphale",b:[
  {t:"p",ps:["L'encéphale comprend le **cerveau** (deux hémisphères), le **cervelet** (équilibre, coordination) et le **tronc cérébral** (centres vitaux : respiration, rythme cardiaque, vigilance). Chaque hémisphère commande la **moitié opposée du corps** : les voies nerveuses se croisent."]},
  {t:"table",rows:[["Lobe frontal","motricité volontaire, langage parlé (aire de Broca), jugement, comportement"],["Lobe pariétal","sensibilité, perception de l'espace"],["Lobe temporal","audition, mémoire, compréhension du langage (aire de Wernicke)"],["Lobe occipital","vision"],["Cervelet","équilibre, coordination des gestes"],["Tronc cérébral","respiration, fréquence cardiaque, vigilance, déglutition"]]},
  {t:"schema",k:"avc"},
  {t:"exemple",h:"Relier à la clinique",ps:["Un AVC de l'hémisphère **gauche** donne une paralysie du côté **droit** et souvent une **aphasie**, car le langage est le plus souvent situé à gauche.","Une atteinte du **tronc cérébral** peut menacer la respiration et la conscience : c'est une urgence vitale."]},
  {t:"verif",items:[["Un patient a une hémiplégie gauche. Quel hémisphère est atteint ?","L'hémisphère droit, car les voies motrices se croisent."]]}]},
 {h:"La moelle épinière et les nerfs",chip:"Moelle et nerfs",b:[
  {t:"p",ps:["La **moelle épinière** descend dans le canal vertébral jusqu'à la 2e vertèbre lombaire. Elle conduit les messages entre le cerveau et le corps et gère les **réflexes**. Elle donne naissance à **31 paires de nerfs rachidiens**.","Les **12 paires de nerfs crâniens** partent du tronc cérébral : nerf optique (vision), nerf facial (mimique), nerf vague (cœur, digestion)…"]},
  {t:"duo",items:[{tag:"Paraplégie",tone:"blue",txt:"Paralysie des **deux membres inférieurs**",sub:"lésion de la moelle dorsale ou lombaire"},{tag:"Tétraplégie",tone:"coral",txt:"Paralysie des **quatre membres**",sub:"lésion de la moelle cervicale"}]},
  {t:"info",txt:"Tout traumatisé suspect d'atteinte du rachis est mobilisé **en bloc**, tête-cou-tronc alignés, avec un collier cervical si indiqué."}]},
 {h:"Le système nerveux autonome",chip:"Sympathique",b:[
  {t:"p",ps:["Le **système nerveux autonome** (ou végétatif) règle les fonctions involontaires : cœur, vaisseaux, digestion, vessie, pupilles. Il a deux branches aux effets opposés."]},
  {t:"cols",cols:[{h:"Sympathique : « fuir ou combattre »",tone:"coral",items:["Accélère le cœur, élève la tension","Dilate les bronches et les pupilles","Freine la digestion","Médiateurs : adrénaline, noradrénaline"]},{h:"Parasympathique : « repos et digestion »",tone:"blue",items:["Ralentit le cœur","Resserre les pupilles","Stimule la digestion et la salivation","Médiateur : acétylcholine"]}]},
  {t:"expliquer",qui:"à un patient anxieux",txt:"« Quand on a peur, le corps se met en mode alerte : le cœur bat plus vite, on respire plus vite, on a la bouche sèche. C'est normal, et ça redescend quand on se calme. Respirer lentement aide à activer le système qui apaise. »"},
  {t:"verif",items:[["Pourquoi un patient en choc hémorragique est-il tachycarde, pâle et en sueur ?","Le système sympathique est activé pour compenser : il accélère le cœur et resserre les vaisseaux de la peau."]]}]},
 {h:"Évaluer l'état neurologique",chip:"Surveillance",b:[
  {t:"liste",items:["**Conscience** : score de Glasgow (3 à 15)","**Pupilles** : taille, symétrie, réactivité à la lumière","**Motricité** : force des 4 membres, symétrie","**Sensibilité**, langage, orientation dans le temps et l'espace","**Constantes** : une HTA avec bradycardie peut traduire une hypertension intracrânienne"]},
  {t:"schema",k:"pupilles"},
  {t:"retenir",txt:"Toute **aggravation neurologique** (baisse du Glasgow de 2 points, pupille qui se dilate, déficit qui apparaît) est une **alerte immédiate**. On note l'heure : le temps compte, surtout dans l'AVC."}]}
 ],
 ["SNC = encéphale + moelle, protégés par les méninges et le LCR ; SNP = nerfs","Le neurone transmet l'influx électriquement, puis chimiquement à la synapse","Chaque hémisphère commande la moitié **opposée** du corps","Tronc cérébral = centres vitaux ; cervelet = équilibre","Sympathique = alerte ; parasympathique = repos","Surveillance : Glasgow, pupilles, motricité, constantes, toujours datés"]),

CV("digestif-c","anat","L'appareil digestif","45 min","2.2 2.8|B.1","drop",
 ["Décrire le trajet du **tube digestif** et les **glandes annexes**","Expliquer la **digestion** mécanique et chimique et l'**absorption**","Comprendre les rôles du **foie** et du **pancréas**","Relier la physiologie aux troubles : constipation, diarrhée, occlusion, cirrhose","Savoir observer et noter les selles et les vomissements"],
 [
 {h:"Le trajet des aliments",chip:"Trajet",b:[
  {t:"etapes",items:["**Bouche** : mastication, salive (amylase) qui commence la digestion de l'amidon.","**Pharynx puis œsophage** : déglutition ; le péristaltisme pousse le bol vers l'estomac.","**Estomac** : brassage, acide chlorhydrique et pepsine ; le bol devient le **chyme**.","**Intestin grêle** (duodénum, jéjunum, iléon, environ 6 m) : digestion finale et **absorption** des nutriments.","**Côlon** : réabsorption de l'eau et des sels, formation des selles.","**Rectum et anus** : stockage puis défécation."]},
  {t:"analogie",txt:"Le tube digestif est une **chaîne de transformation** : chaque poste découpe un peu plus les aliments, jusqu'à ce que les morceaux soient assez petits pour passer dans le sang au niveau de l'intestin grêle."}]},
 {h:"Les glandes annexes",chip:"Foie et pancréas",b:[
  {t:"cols",cols:[{h:"Le foie",tone:"amber",items:["Fabrique la **bile** (digestion des graisses), stockée dans la vésicule","Stocke le glucose sous forme de glycogène","Fabrique les **protéines** du sang (albumine) et les **facteurs de coagulation**","**Détoxifie** : médicaments, alcool, ammoniac","Élimine la bilirubine : si elle s'accumule, **ictère**"]},{h:"Le pancréas",tone:"blue",items:["**Exocrine** : suc pancréatique (enzymes) versé dans le duodénum","**Endocrine** : **insuline** (fait baisser la glycémie) et **glucagon** (la fait monter), produits par les îlots de Langerhans"]}]},
  {t:"exemple",h:"Relier à la clinique",ps:["Dans la **cirrhose**, le foie ne fabrique plus assez de facteurs de coagulation et d'albumine : risque de saignement (TP bas) et d'œdèmes, d'ascite.","Une **pancréatite aiguë** donne une douleur épigastrique violente en barre ; la lipase est très élevée."]}]},
 {h:"Digestion et absorption",chip:"Absorption",b:[
  {t:"table",rows:[["Glucides","découpés en glucose ; début dans la bouche, fin dans l'intestin grêle"],["Protéines","découpées en acides aminés ; estomac puis intestin"],["Lipides","émulsionnés par la bile, découpés par la lipase pancréatique"],["Eau","absorbée surtout dans l'intestin grêle, puis le côlon"],["Vitamine B12","absorbée à la fin de l'iléon, grâce au facteur intrinsèque de l'estomac"]]},
  {t:"p",ps:["Les nutriments absorbés passent par la **veine porte** jusqu'au foie avant d'atteindre la circulation générale. C'est l'**effet de premier passage** : certains médicaments pris par la bouche sont en partie détruits par le foie."]},
  {t:"pieges",items:["Après une gastrectomie ou une résection de l'iléon, le patient peut manquer de **vitamine B12** : anémie à surveiller","La bouche fait déjà partie de la digestion : une mauvaise dentition favorise la dénutrition chez la personne âgée"]}]},
 {h:"Observer l'élimination",chip:"Selles",b:[
  {t:"table",rows:[["Méléna","selles noires, poisseuses, nauséabondes : saignement digestif haut"],["Rectorragie","sang rouge par l'anus : saignement bas"],["Hématémèse","vomissement de sang"],["Selles décolorées","obstruction des voies biliaires (avec urines foncées)"],["Stéatorrhée","selles grasses : défaut de digestion des graisses"]],note:"Le fer et certains aliments (betterave, myrtilles) colorent les selles : toujours replacer dans le contexte."},
  {t:"duo",items:[{tag:"Constipation",tone:"blue",txt:"Moins de **3 selles par semaine**, dures",sub:"immobilité, opioïdes, manque d'eau et de fibres"},{tag:"Diarrhée",tone:"coral",txt:"Plus de **3 selles liquides par jour**",sub:"risque de déshydratation, surtout enfant et sujet âgé"}]},
  {t:"verif",items:[["Un patient sous morphine depuis 3 jours n'a pas eu de selles. Que faire ?","Le signaler, surveiller l'abdomen et le transit ; un laxatif est en général prescrit dès le début d'un traitement opioïde."]]}]},
 {h:"Signes d'alerte",chip:"Alerte",b:[
  {t:"signes",e:"Alerte",h:"À signaler sans attendre",items:["Douleur abdominale intense ou ventre dur (défense, contracture)","**Arrêt des matières et des gaz** avec vomissements","Hématémèse, méléna, rectorragie abondante","Ictère d'apparition récente","Fièvre avec douleur abdominale"]},
  {t:"retenir",txt:"Arrêt des gaz + vomissements + ballonnement = suspicion d'**occlusion** : patient **à jeun**, on alerte. Un saignement digestif se surveille comme un risque d'hémorragie : pouls, tension, coloration."}]}
 ],
 ["Bouche → œsophage → estomac → grêle (absorption) → côlon (eau) → rectum","Le foie fabrique bile, albumine, facteurs de coagulation ; il détoxifie","Le pancréas produit enzymes digestives et insuline/glucagon","Méléna = saignement haut ; rectorragie = saignement bas","Opioïdes et immobilité constipent : prévenir"]),

CV("urinaire-c","anat","Le rein et l'appareil urinaire","40 min","2.2 2.7|B.1","bladder",
 ["Décrire les organes de l'**appareil urinaire**","Expliquer la formation de l'urine dans le **néphron**","Comprendre les rôles du rein : eau, ions, pH, tension, globules rouges","Interpréter **créatinine**, **débit de filtration glomérulaire** et **diurèse**","Repérer une rétention et une insuffisance rénale"],
 [
 {h:"Les organes",chip:"Organes",b:[
  {t:"p",ps:["Deux **reins** situés en arrière de l'abdomen, de part et d'autre de la colonne, filtrent le sang. L'urine descend par les deux **uretères** jusqu'à la **vessie**, réservoir d'environ 300 à 500 mL, puis est évacuée par l'**urètre**. Chez l'homme, l'urètre traverse la **prostate** : son augmentation de volume gêne la miction."]},
  {t:"analogie",txt:"Les reins sont la **station d'épuration** du corps : ils filtrent environ 180 litres de plasma par jour, puis récupèrent presque tout, pour ne garder qu'environ 1,5 litre d'urine chargée de déchets."}]},
 {h:"Le néphron",chip:"Néphron",b:[
  {t:"p",ps:["Chaque rein contient environ un million de **néphrons**, les unités de filtration."]},
  {t:"schema",k:"nephron"},
  {t:"etapes",items:["**Filtration** dans le **glomérule** : l'eau et les petites molécules passent, les cellules et les grosses protéines restent dans le sang.","**Réabsorption** dans les tubules : le corps récupère eau, glucose, sodium, bicarbonates.","**Sécrétion** : le tubule ajoute certains déchets et médicaments.","L'urine finale rejoint le bassinet puis l'uretère."]},
  {t:"pieges",items:["Du **glucose** dans les urines signifie que la glycémie dépasse la capacité de réabsorption (environ 1,8 g/L) : on y pense dans le diabète","Des **protéines** dans les urines traduisent souvent une lésion du glomérule"]}]},
 {h:"Les rôles du rein",chip:"Rôles",b:[
  {t:"liste",items:["Éliminer les **déchets** : urée, créatinine, acide urique, médicaments","Régler le volume d'**eau** et les **ions** (sodium, potassium)","Maintenir le **pH** du sang","Participer à la régulation de la **tension** (système rénine-angiotensine-aldostérone)","Produire l'**érythropoïétine** (EPO), qui stimule la fabrication des globules rouges","Activer la **vitamine D**, utile à l'absorption du calcium"]},
  {t:"exemple",h:"Relier à la clinique",ps:["L'insuffisant rénal chronique est souvent **anémié** (moins d'EPO), **hypertendu** et a des troubles du calcium. Son **potassium** monte : risque de troubles du rythme cardiaque."]}]},
 {h:"Explorer la fonction rénale",chip:"Bilan",b:[
  {t:"table",rows:[["Créatinine","déchet musculaire ; elle **augmente** quand le rein filtre mal"],["DFG (débit de filtration glomérulaire)","calculé à partir de la créatinine ; normal ≥ 90 mL/min ; IRC si < 60 pendant plus de 3 mois"],["Urée","augmente en cas d'insuffisance rénale ou de déshydratation"],["Kaliémie","3,5 à 5 mmol/L ; dangereuse au-dessus de 6"],["Bandelette urinaire","sang, protéines, glucose, leucocytes, nitrites"]],note:"Le DFG sert aussi à **adapter la dose** de nombreux médicaments éliminés par le rein."},
  {t:"schema",k:"urines"},
  {t:"verif",items:[["Quelle diurèse minimale surveille-t-on chez l'adulte ?","Au moins 0,5 mL/kg/h, soit environ 500 mL par 24 h ; en dessous on parle d'oligurie."]]}]},
 {h:"Troubles de la miction",chip:"Miction",b:[
  {t:"table",rows:[["Oligurie","moins de 500 mL/24 h"],["Anurie","moins de 100 mL/24 h"],["Polyurie","plus de 3 L/24 h"],["Dysurie","difficulté à uriner"],["Pollakiurie","mictions fréquentes"],["Rétention urinaire","vessie pleine qui ne se vide pas"]]},
  {t:"duo",items:[{tag:"Anurie",tone:"coral",txt:"Les reins **ne produisent pas** d'urine",sub:"vessie vide au bladder scan"},{tag:"Rétention",tone:"blue",txt:"L'urine est produite mais **reste dans la vessie**",sub:"globe vésical, douleur, agitation"}]},
  {t:"retenir",txt:"Chez la personne âgée, une **agitation inexpliquée** peut être due à un globe vésical : on palpe le bas-ventre et on fait un **bladder scan** avant tout sédatif."}]}
 ],
 ["Rein → uretère → vessie → urètre","Le néphron filtre, réabsorbe, sécrète","Rôles : déchets, eau, ions, pH, tension, EPO, vitamine D","Créatinine ↑ et DFG ↓ = insuffisance rénale","Oligurie < 500 mL/24 h ; ne pas confondre anurie et rétention"]),

CV("endocrino-c","anat","Le système endocrinien","40 min","2.2 2.7|B.1","flask",
 ["Définir une **hormone** et le principe du **rétrocontrôle**","Situer les principales **glandes endocrines**","Expliquer la régulation de la **glycémie**","Connaître les rôles de la **thyroïde** et des **surrénales**","Reconnaître les signes d'hypo- et d'hyperfonctionnement"],
 [
 {h:"Hormones et rétrocontrôle",chip:"Principe",b:[
  {t:"p",ps:["Une **hormone** est une substance produite par une glande et transportée par le **sang** jusqu'à un organe cible, sur lequel elle agit. Le système endocrinien agit plus lentement que le système nerveux, mais de façon durable.","La plupart des hormones sont réglées par **rétrocontrôle négatif** : quand le taux d'une hormone augmente, il freine sa propre production."]},
  {t:"analogie",txt:"C'est le principe du **thermostat** : quand la pièce est assez chaude, le chauffage s'arrête ; quand elle refroidit, il repart."},
  {t:"p",ps:["Le chef d'orchestre est le couple **hypothalamus - hypophyse**, à la base du cerveau. L'hypophyse commande la thyroïde (TSH), les surrénales (ACTH), les glandes sexuelles, la croissance, et fabrique l'hormone antidiurétique (ADH) qui retient l'eau."]}]},
 {h:"Les glandes et leurs hormones",chip:"Glandes",b:[
  {t:"table",rows:[["Hypophyse","TSH, ACTH, hormone de croissance, prolactine, ADH, ocytocine"],["Thyroïde","T3 et T4 : métabolisme, température, rythme cardiaque"],["Parathyroïdes","parathormone : augmente le calcium sanguin"],["Surrénales","cortisol (stress, glycémie), aldostérone (sodium, tension), adrénaline"],["Pancréas","insuline, glucagon"],["Ovaires, testicules","œstrogènes, progestérone, testostérone"]]}]},
 {h:"La régulation de la glycémie",chip:"Glycémie",b:[
  {t:"duo",items:[{tag:"Insuline",tone:"blue",txt:"Fait **baisser** la glycémie",sub:"fait entrer le glucose dans les cellules, stocke en glycogène"},{tag:"Glucagon",tone:"coral",txt:"Fait **monter** la glycémie",sub:"libère le glucose stocké dans le foie"}]},
  {t:"schema",k:"insuline"},
  {t:"p",ps:["La glycémie normale à jeun est de **0,70 à 1,10 g/L**. Le cortisol et l'adrénaline font aussi monter la glycémie : c'est pourquoi un stress, une infection ou une corticothérapie déséquilibrent un diabète."]},
  {t:"verif",items:[["Pourquoi la glycémie d'un diabétique monte-t-elle lors d'une infection ?","L'infection est un stress : le cortisol et l'adrénaline augmentent et s'opposent à l'insuline."]]}]},
 {h:"La thyroïde",chip:"Thyroïde",b:[
  {t:"cols",cols:[{h:"Hypothyroïdie",tone:"blue",items:["Fatigue, frilosité","Prise de poids, constipation","Bradycardie","Peau sèche, ralentissement","TSH **élevée**"]},{h:"Hyperthyroïdie",tone:"coral",items:["Nervosité, insomnie","Amaigrissement malgré l'appétit","Tachycardie, palpitations","Thermophobie, sueurs","TSH **basse**"]}]},
  {t:"info",txt:"La **lévothyroxine** se prend le matin **à jeun**, à heure fixe, à distance du fer et du calcium qui diminuent son absorption."}]},
 {h:"Les surrénales et la corticothérapie",chip:"Surrénales",b:[
  {t:"p",ps:["Le **cortisol** aide à faire face au stress, élève la glycémie et calme l'inflammation. Les **corticoïdes** médicaments l'imitent. Pris longtemps, ils mettent les surrénales au repos : un **arrêt brutal** peut provoquer une **insuffisance surrénalienne aiguë** (malaise, hypotension, douleurs abdominales), qui est une urgence."]},
  {t:"pieges",items:["Ne jamais arrêter brutalement une corticothérapie prolongée : la décroissance est progressive et prescrite","Sous corticoïdes : surveiller glycémie, tension, poids, sommeil, risque infectieux"]},
  {t:"retenir",txt:"Une hormone agit à distance par le sang et se règle par **rétrocontrôle**. Insuline et glucagon s'opposent ; stress, infection et corticoïdes **montent la glycémie**."}]}
 ],
 ["Hormone = messager sanguin vers un organe cible","Hypothalamus-hypophyse = chef d'orchestre","Insuline ↓ glycémie ; glucagon ↑","Hypothyroïdie : TSH haute ; hyperthyroïdie : TSH basse","Jamais d'arrêt brutal d'une corticothérapie prolongée"]),

CV("locomoteur-c","anat","L'appareil locomoteur","35 min","2.2 2.4|B.1","bone",
 ["Décrire la structure de l'**os** et son renouvellement","Distinguer les types d'**articulations**","Expliquer la **contraction musculaire**","Comprendre la consolidation d'une fracture","Prévenir les conséquences de l'immobilité"],
 [
 {h:"Le squelette et l'os",chip:"Os",b:[
  {t:"p",ps:["Le squelette adulte compte **206 os**. Il soutient le corps, protège les organes (crâne, cage thoracique), permet le mouvement, stocke le **calcium** et fabrique les cellules du sang dans la **moelle osseuse**.","L'os est un tissu vivant, renouvelé en permanence : les **ostéoclastes** le détruisent, les **ostéoblastes** le reconstruisent. Avec l'âge et la ménopause, la destruction l'emporte : c'est l'**ostéoporose**, qui favorise les fractures (col du fémur, poignet, vertèbres)."]},
  {t:"table",rows:[["Os longs","fémur, humérus, tibia"],["Os courts","os du poignet et de la cheville"],["Os plats","crâne, sternum, omoplate, bassin"]]}]},
 {h:"Les articulations",chip:"Articulations",b:[
  {t:"p",ps:["Une articulation relie deux os. Les plus mobiles (épaule, hanche, genou) sont des **articulations synoviales** : les surfaces sont couvertes de **cartilage**, entourées d'une capsule et de **ligaments**, et lubrifiées par le **liquide synovial**."]},
  {t:"duo",items:[{tag:"Arthrose",tone:"blue",txt:"**Usure** du cartilage",sub:"douleur mécanique, à l'effort, le soir"},{tag:"Arthrite",tone:"coral",txt:"**Inflammation** de l'articulation",sub:"douleur la nuit, raideur matinale, articulation chaude"}]},
  {t:"table",rows:[["Entorse","étirement ou rupture d'un ligament"],["Luxation","déboîtement des surfaces articulaires"],["Fracture","rupture de l'os"]]}]},
 {h:"Les muscles",chip:"Muscles",b:[
  {t:"table",rows:[["Muscle squelettique","volontaire, strié ; relié aux os par les **tendons**"],["Muscle lisse","involontaire ; paroi des vaisseaux, du tube digestif, de la vessie"],["Muscle cardiaque","involontaire, strié, automatique"]]},
  {t:"p",ps:["La contraction nécessite de l'**énergie**, du **calcium** et un ordre nerveux. Sans mouvement, le muscle fond vite : on perd jusqu'à 1 à 2 % de masse musculaire par jour d'alitement chez la personne âgée."]}]},
 {h:"La consolidation d'une fracture",chip:"Consolidation",b:[
  {t:"etapes",items:["**Hématome** autour du foyer de fracture.","Formation d'un **cal** mou, fibreux.","Le cal devient osseux (environ 4 à 6 semaines chez l'adulte).","**Remodelage** pendant plusieurs mois."]},
  {t:"schema",k:"platre"},
  {t:"info",txt:"Tabac, dénutrition, diabète et âge ralentissent la consolidation. Sous plâtre, on surveille en priorité la **circulation** et la **sensibilité** des extrémités."}]},
 {h:"Les dangers de l'immobilité",chip:"Immobilité",b:[
  {t:"liste",items:["**Escarres** : changements de position, matelas adapté","**Thrombose veineuse** : lever précoce, contention, anticoagulant si prescrit","**Fonte musculaire** et perte d'autonomie","**Constipation**, rétention urinaire","**Encombrement bronchique**, pneumopathie","**Syndrome de glissement** chez la personne âgée"]},
  {t:"retenir",txt:"Chez la personne âgée, **chaque jour au lit compte** : le lever et la marche, même courts, préviennent une cascade de complications."}]}
 ],
 ["206 os, renouvelés en permanence ; ostéoporose = fragilité","Arthrose = usure ; arthrite = inflammation","Entorse = ligament ; luxation = déboîtement ; fracture = os","Consolidation : hématome, cal, remodelage","L'immobilité est dangereuse : bouger tôt"]),

CV("sang-c","anat","Le sang et l'immunité","45 min","2.1 2.2 2.5|B.1","tube",
 ["Décrire la composition du **sang**","Interpréter les grandes valeurs de la **numération formule sanguine**","Expliquer l'**hémostase** et la coagulation","Comprendre les **groupes sanguins** et la compatibilité","Distinguer immunité **innée** et **adaptative**"],
 [
 {h:"La composition du sang",chip:"Composition",b:[
  {t:"p",ps:["Un adulte possède environ **5 litres** de sang. Il se compose de **plasma** (55 %, eau, protéines, sels, nutriments, hormones) et d'**éléments figurés** fabriqués dans la moelle osseuse."]},
  {t:"table",rows:[["Globules rouges (hématies)","transport de l'O₂ grâce à l'**hémoglobine** ; vie d'environ 120 jours"],["Globules blancs (leucocytes)","défense contre les infections"],["Plaquettes","arrêt des saignements"]]},
  {t:"valeurs",h:"Repères de la NFS",rows:[["Hémoglobine","Femme / homme","12–16 / 13–17 g/dL","green"],["Leucocytes","Adulte","4 000–10 000 /mm³","blue"],["Plaquettes","Adulte","150 000–400 000 /mm³","amber"],["Neutrophiles","Seuil d'aplasie","< 500 /mm³","coral"]],note:"Normes indicatives : se référer à celles du laboratoire."}]},
 {h:"Les troubles des lignées",chip:"NFS",b:[
  {t:"table",rows:[["Anémie","hémoglobine basse : fatigue, pâleur, essoufflement, tachycardie"],["Polyglobulie","trop de globules rouges : risque de thrombose"],["Leucopénie / neutropénie","risque infectieux"],["Hyperleucocytose","infection, inflammation, leucémie"],["Thrombopénie","risque hémorragique : pétéchies, gencives qui saignent"]]},
  {t:"exemple",h:"Relier à la clinique",ps:["Après une chimiothérapie, le **nadir** (point le plus bas des cellules) survient vers le 7e à 14e jour : une fièvre à ce moment est une urgence (**aplasie fébrile**)."]}]},
 {h:"L'hémostase",chip:"Coagulation",b:[
  {t:"etapes",items:["**Vasoconstriction** : le vaisseau lésé se resserre.","**Clou plaquettaire** : les plaquettes s'agglutinent sur la brèche (hémostase primaire).","**Coagulation** : une cascade de facteurs aboutit à la **fibrine**, qui consolide le caillot.","**Fibrinolyse** : le caillot est dissous une fois la réparation faite."]},
  {t:"table",rows:[["TP / INR","voie de la coagulation suivie sous **AVK** ; INR cible souvent 2 à 3"],["TCA","suivi de l'héparine non fractionnée"],["Anti-Xa","suivi de certaines héparines"],["Plaquettes","surveillées sous héparine (risque de thrombopénie induite)"]]},
  {t:"schema",k:"inr"}]},
 {h:"Les groupes sanguins",chip:"Groupes",b:[
  {t:"p",ps:["Les globules rouges portent des **antigènes** A et/ou B (système ABO) et l'antigène D (Rhésus). Le plasma contient les **anticorps** contre les antigènes absents. Une transfusion incompatible provoque une destruction brutale des globules rouges : c'est un accident grave."]},
  {t:"table",rows:[["Groupe O","donneur universel de **globules rouges**"],["Groupe AB","receveur universel de globules rouges"],["Plasma AB","plasma universel"],["Rhésus négatif","ne reçoit que du Rhésus négatif (surtout la femme jeune)"]],note:"En pratique, la sécurité repose sur la **double détermination** du groupe, la RAI et le **contrôle ultime au lit du patient**."}]},
 {h:"L'immunité",chip:"Immunité",b:[
  {t:"cols",cols:[{h:"Immunité innée",tone:"amber",items:["Immédiate, non spécifique","Barrières : peau, muqueuses, acidité gastrique","Inflammation, fièvre","Phagocytose par les neutrophiles et macrophages"]},{h:"Immunité adaptative",tone:"blue",items:["Plus lente, spécifique d'un microbe","**Lymphocytes B** : fabriquent les **anticorps**","**Lymphocytes T** : détruisent les cellules infectées (CD4 = chefs d'orchestre)","**Mémoire** : base de la vaccination"]}]},
  {t:"analogie",txt:"L'immunité innée est le **vigile** à l'entrée, qui arrête tout ce qui semble suspect. L'immunité adaptative est l'**enquêteur** qui identifie précisément le coupable et garde sa photo pour le reconnaître la fois suivante."},
  {t:"verif",items:[["Pourquoi un patient sous corticoïdes au long cours est-il plus fragile face aux infections ?","Les corticoïdes freinent l'inflammation et l'immunité : les infections sont plus fréquentes et parfois moins bruyantes (peu de fièvre)."]]},
  {t:"retenir",txt:"Hémoglobine = transport d'O₂ ; leucocytes = défense ; plaquettes = hémostase. Le **contrôle ultime** au lit du patient est obligatoire avant toute transfusion de globules rouges."}]}
 ],
 ["Plasma + globules rouges, blancs, plaquettes","Anémie, neutropénie, thrombopénie : savoir les risques associés","Hémostase : vasoconstriction, plaquettes, fibrine, fibrinolyse","INR = AVK ; TCA ou anti-Xa = héparines","O = donneur universel de globules rouges","Immunité innée immédiate ; adaptative spécifique avec mémoire"]),

CV("peau-sens-c","anat","La peau et les organes des sens","30 min","2.2|B.1","eye",
 ["Décrire les **couches de la peau** et ses fonctions","Comprendre la **cicatrisation**","Décrire l'œil et l'oreille","Adapter la communication aux troubles sensoriels"],
 [
 {h:"La peau",chip:"Peau",b:[
  {t:"schema",k:"peau"},
  {t:"table",rows:[["Épiderme","couche superficielle, sans vaisseaux, renouvelée en environ 4 semaines"],["Derme","vaisseaux, nerfs, glandes sudorales, follicules pileux"],["Hypoderme","graisse : isolant et réserve ; lieu des injections SC"]]},
  {t:"liste",items:["**Barrière** contre les microbes et la perte d'eau","**Thermorégulation** : sueur, dilatation des vaisseaux","**Sensibilité** : toucher, douleur, chaleur","Synthèse de la **vitamine D** au soleil"]},
  {t:"info",txt:"Chez la personne âgée, la peau est plus fine et moins vascularisée : elle se lèse plus vite (escarres, déchirures cutanées) et cicatrise plus lentement."}]},
 {h:"La cicatrisation",chip:"Cicatrisation",b:[
  {t:"etapes",items:["**Phase vasculaire et inflammatoire** (0 à 4 jours) : caillot, nettoyage de la plaie.","**Bourgeonnement** : tissu rouge, granuleux, qui comble la plaie.","**Épidermisation** : la peau se referme depuis les bords.","**Maturation** : la cicatrice se renforce pendant des mois."]},
  {t:"table",rows:[["Nécrose (noire)","tissu mort à retirer"],["Fibrine (jaune)","à déterger"],["Bourgeon (rouge)","plaie qui se comble, à protéger"],["Épidermisation (rose)","presque fermée"]],note:"Dénutrition, diabète, tabac, infection et appui ralentissent la cicatrisation."}]},
 {h:"L'œil et l'oreille",chip:"Sens",b:[
  {t:"cols",cols:[{h:"L'œil",tone:"blue",items:["Cornée, cristallin : focalisent la lumière","Rétine : capte l'image","Nerf optique vers le lobe occipital","**Cataracte** : cristallin opaque","**Glaucome** : pression oculaire élevée, abîme le nerf optique"]},{h:"L'oreille",tone:"amber",items:["Externe : conduit auditif","Moyenne : tympan, osselets","Interne : cochlée (audition) et **vestibule** (équilibre)","**Presbyacousie** : baisse auditive liée à l'âge"]}]},
  {t:"liste",items:["Se placer **face** à la personne malentendante, bien éclairé, parler lentement sans crier","Vérifier les **lunettes** et les **appareils auditifs** (piles, propreté) : un déficit sensoriel non corrigé favorise confusion et chutes","Présenter les objets dans le champ visuel conservé"]},
  {t:"retenir",txt:"La peau protège, règle la température et sent. Un déficit visuel ou auditif non compensé **isole** et **désoriente** : vérifier lunettes et appareils fait partie du soin."}]}
 ],
 ["Épiderme, derme, hypoderme","Cicatrisation : inflammation, bourgeonnement, épidermisation, maturation","Nécrose noire, fibrine jaune, bourgeon rouge","Lunettes et appareils auditifs : partie intégrante du soin"]),

CV("reproduction-c","anat","Reproduction, grossesse et naissance","40 min","2.2|B.1","baby",
 ["Décrire l'appareil génital féminin et masculin","Comprendre le **cycle menstruel**","Connaître les grandes étapes de la **grossesse**","Repérer les signes d'alerte de la grossesse et du post-partum","Connaître les soins de base au nouveau-né"],
 [
 {h:"Les appareils génitaux",chip:"Anatomie",b:[
  {t:"cols",cols:[{h:"Féminin",tone:"coral",items:["Ovaires : ovules, œstrogènes, progestérone","Trompes : lieu de la fécondation","Utérus : accueille l'embryon","Col de l'utérus, vagin","Seins : lactation"]},{h:"Masculin",tone:"blue",items:["Testicules : spermatozoïdes, testostérone","Épididyme, canal déférent","Prostate, vésicules séminales : liquide séminal","Urètre, verge"]}]}]},
 {h:"Le cycle menstruel",chip:"Cycle",b:[
  {t:"etapes",items:["**J1** : premier jour des règles.","**Phase folliculaire** : un follicule mûrit, les œstrogènes épaississent la muqueuse utérine.","**Ovulation** vers **J14** d'un cycle de 28 jours.","**Phase lutéale** : la progestérone prépare l'utérus à la nidation.","Sans fécondation, les hormones chutent : la muqueuse se détache, ce sont les règles."]},
  {t:"info",blue:true,txt:"La date des dernières règles permet d'estimer le terme : la grossesse dure environ **41 semaines d'aménorrhée** (SA)."}]},
 {h:"La grossesse",chip:"Grossesse",b:[
  {t:"table",rows:[["1er trimestre","organogenèse ; nausées ; échographie vers 12 SA"],["2e trimestre","mouvements fœtaux perçus ; échographie vers 22 SA"],["3e trimestre","croissance ; échographie vers 32 SA"],["Terme","à partir de 37 SA ; prématurité avant 37 SA"]]},
  {t:"signes",e:"Alerte",h:"Signes à faire consulter",items:["Saignements","Contractions avant 37 SA","Perte de liquide","**Diminution des mouvements** du bébé","Céphalées, troubles visuels, œdèmes brutaux (pré-éclampsie)","Fièvre"]},
  {t:"pieges",items:["Pas d'anti-inflammatoires (AINS) à partir du 6e mois : toxiques pour le fœtus","Pas de vaccin vivant pendant la grossesse ; la vaccination contre la grippe et la coqueluche est recommandée"]}]},
 {h:"Accouchement et post-partum",chip:"Post-partum",b:[
  {t:"p",ps:["L'accouchement comporte trois phases : **dilatation** du col, **expulsion** du bébé, **délivrance** du placenta. Le post-partum dure 6 semaines."]},
  {t:"liste",items:["**Saignements** : l'hémorragie du post-partum est la première cause de mortalité maternelle ; surveiller l'utérus (bien contracté, « globe de sécurité ») et les pertes","Tension, température, douleur, cicatrice","**Mictions** et transit","Seins et allaitement","Humeur : baby blues fréquent (J3-J5) ; dépression du post-partum à repérer"]}]},
 {h:"Le nouveau-né",chip:"Nouveau-né",b:[
  {t:"table",rows:[["Score d'Apgar","à 1, 5 et 10 min : cœur, respiration, tonus, réactivité, couleur (sur 10)"],["Fréquence cardiaque","120–160 bpm"],["Température","36,5–37,5 °C ; il se refroidit vite"],["Poids","perte physiologique jusqu'à 10 %, repris vers J10"]]},
  {t:"liste",items:["Couchage **sur le dos**, dans son propre lit, sans couverture ni oreiller","Vitamine K, dépistage néonatal (test de Guthrie à J3)","Surveiller ictère, alimentation, selles (méconium dans les 48 h)"]},
  {t:"retenir",txt:"Après un accouchement, la surveillance prioritaire est le **saignement** et la **tonicité de l'utérus**. Chez le nouveau-né : couchage sur le dos, température, alimentation."}]}
 ],
 ["Ovulation vers J14 ; grossesse ≈ 41 SA","Prématurité avant 37 SA","Pas d'AINS au 3e trimestre","Hémorragie du post-partum : surveiller utérus et pertes","Nouveau-né : Apgar, température, couchage sur le dos"])
];
L.forEach(norm);L.forEach(c=>{const i=COURS.findIndex(x=>x.id===c.id);if(i>=0)COURS[i]=c;else COURS.push(c);});})();
