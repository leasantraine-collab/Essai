/* Carnet IFSI — compléments : services de stage, types de calculs, méthodes de révision (UE 6.1, 5.x | E.3). */
(()=>{
STAGES.push(
 {nom:"Réanimation / soins intensifs",soins:["Surveillance continue (scope, PA invasive)","Gestion des pousse-seringues et des voies centrales","Soins au patient intubé ou ventilé","Prévention des escarres et des infections"],reviser:["Sepsis et état de choc","Gaz du sang","Calculs de débits au PSE","Score de Glasgow et sédation"],pieges:["Les alarmes ne remplacent pas l'observation clinique","Une erreur de débit au PSE peut être immédiatement grave : double vérification"]},
 {nom:"Néphrologie / dialyse",soins:["Surveillance des séances d'hémodialyse","Soins de la fistule artério-veineuse","Bilans entrées-sorties, pesée","Éducation diététique"],reviser:["Insuffisance rénale aiguë et chronique","Hyperkaliémie","Fistule artério-veineuse","Médicaments néphrotoxiques"],pieges:["Jamais de TA ni de prise de sang sur le bras de la fistule","Restriction hydrique et potassium à respecter"]},
 {nom:"Neurologie",soins:["Surveillance neurologique (Glasgow, pupilles, déficit)","Prévention des fausses routes","Mobilisation, prévention des complications de l'immobilité","Accompagnement des troubles cognitifs"],reviser:["AVC et thrombolyse","Épilepsie","Sclérose en plaques","Maladie de Parkinson"],pieges:["Test de déglutition avant toute alimentation après un AVC","Horaires stricts des traitements antiparkinsoniens"]},
 {nom:"SMR / soins de suite",soins:["Rééducation et reprise d'autonomie","Pansements, plaies chroniques","Éducation thérapeutique","Préparation du retour à domicile"],reviser:["Prothèse de hanche et de genou","Escarres","Dénutrition","Coordination ville-hôpital"],pieges:["Faire à la place du patient freine sa récupération","La sortie se prépare dès l'entrée"]},
 {nom:"Gastro-entérologie / chirurgie digestive",soins:["Préparation aux endoscopies","Surveillance post-opératoire","Soins de stomie","Nutrition entérale et parentérale"],reviser:["Occlusion","Cirrhose","Cancer colorectal","Stomies"],pieges:["Un patient à jeun garde des besoins : hydratation, soins de bouche","Méléna et hématémèse : alerte immédiate"]},
 {nom:"Orthopédie / traumatologie",soins:["Surveillance des plâtres et des membres opérés","Prévention thrombo-embolique","Mobilisation selon les consignes d'appui","Gestion de la douleur"],reviser:["Fractures et syndrome des loges","Prothèse de hanche (luxation)","Anticoagulants préventifs","Ostéoporose"],pieges:["Douleur croissante sous plâtre = syndrome des loges jusqu'à preuve du contraire","Respecter les positions interdites après prothèse de hanche"]}
);
Object.assign(GEN,{
 mlh:{label:"Débit en mL/h",make(){const v=pick([250,500,1000,1500,2000]),h=pick([4,6,8,10,12,24]);const ans=r1(v/h);
  return {presc:`Prescription : ${v} mL de Ringer lactate sur ${h} h.<br>Administration à la pompe volumétrique.`,q:"Quel débit programmer ?",unit:"mL/h",ans,tol:.1,
   steps:[`Débit = volume ÷ durée`,`${v} ÷ ${h} = ${fr(ans)} mL/h`]}}},
 insuline:{label:"Insuline au PSE",make(){const ui=pick([50]),vol=50,rate=pick([1,1.5,2,2.5,3,4]);const c=ui/vol,ans=r1(rate/c);
  return {presc:`Prescription : insuline rapide ${fr(rate)} UI/h au pousse-seringue.<br>Seringue préparée : ${ui} UI dans ${vol} mL de NaCl 0,9 %.`,q:"Quelle vitesse programmer ?",unit:"mL/h",ans,tol:.05,
   steps:[`Concentration : ${ui} UI ÷ ${vol} mL = ${fr(c)} UI/mL`,`Vitesse : ${fr(rate)} UI/h ÷ ${fr(c)} UI/mL = ${fr(ans)} mL/h`]}}},
 mgkgh:{label:"Dose en mg/kg/h",make(){const kg=pick([50,60,70,80]),dose=pick([.5,1,2]),tot=pick([100,200,250]),vol=50;const mgh=r1(kg*dose),c=tot/vol,ans=r1(mgh/c);
  return {presc:`Patient de ${kg} kg. Prescription : ${fr(dose)} mg/kg/h au pousse-seringue.<br>Seringue : ${tot} mg dans ${vol} mL.`,q:"Quelle vitesse programmer ?",unit:"mL/h",ans,tol:.1,
   steps:[`Dose horaire : ${kg} kg × ${fr(dose)} mg/kg/h = ${fr(mgh)} mg/h`,`Concentration : ${tot} ÷ ${vol} = ${fr(c)} mg/mL`,`Vitesse : ${fr(mgh)} ÷ ${fr(c)} = ${fr(ans)} mL/h`]}}}
});
const L=[
X("evaluations","methode","Réussir","Préparer les évaluations en IFSI","6.1 5.2|E.3","sheet",[
 [{t:"table",n:"01",h:"Les types d'évaluations",chip:"Types",rows:[["Partiels écrits","QCM, questions rédactionnelles, cas cliniques"],["Calculs de doses","seuil d'exigence élevé : zéro erreur souvent attendue"],["Analyse de situation","raisonnement clinique à partir d'un cas, à l'écrit ou à l'oral"],["Mise en situation (MSP, simulation)","réaliser un soin devant un formateur, en justifiant"],["Travaux de groupe, oraux","santé publique, éducation, recherche"],["Mémoire","travail d'initiation à la recherche en 3e année"]]}],
 [{t:"etapes",n:"02",h:"Avant l'épreuve",chip:"Avant",items:["Planifier les révisions **sur plusieurs semaines** avec des sessions courtes.","Se **tester** (quiz, cartes, cas) plutôt que relire.","Refaire les **calculs** tous les jours, en posant l'unité à chaque ligne.","Pour une MSP : réciter les étapes du soin à voix haute, avec la **justification** de chaque geste.","Dormir : la mémoire se consolide pendant le sommeil."]},
  {t:"liste",n:"03",h:"Pendant l'épreuve",chip:"Pendant",items:["Lire toute la consigne, souligner les mots-clés","Pour un cas : **hiérarchiser** (urgence vitale d'abord), justifier","Vérifier l'ordre de grandeur d'un résultat de calcul","Écrire lisiblement, structurer (introduction, parties, conclusion)","Garder du temps pour relire"]}],
 [{t:"retenir",txt:"Se tester régulièrement vaut mieux que relire longtemps. En MSP comme en analyse de situation, on attend surtout la **justification** : « je fais ceci parce que… »."}]
])
];
L.forEach(norm);FICHES.push(...L);
})();
