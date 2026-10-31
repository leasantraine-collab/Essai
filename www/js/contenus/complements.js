/* Carnet IFSI — compléments : types de calculs, méthodes de révision (UE 6.1, 5.x | E.3). Les services de stage sont dans stages.js. */
(()=>{
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
