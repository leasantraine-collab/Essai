/* Carnet IFSI — grandes fiches des classes thérapeutiques (Réviser › Thérapeutiques).
   Liste triée et dédoublonnée : une classe = une fiche, même si elle figure dans plusieurs spécialités (les autres intitulés deviennent des alias).
   Format texte compact lu par MD() : =Nom|id puis une ligne par information, préfixée par une clé.
   a alias · d présentation de la classe · ma mécanisme d'action · sch schéma (clé | légende) · m médicament (DCI | noms commerciaux | précision)
   i indication · ci contre-indication ou précaution · e effet indésirable fréquent · g effet indésirable grave · n interaction
   v voie et modalité d'administration · s surveillance clinique · b surveillance biologique · p précaution spécifique (Public : texte)
   u éducation du patient · c conduite à tenir · r point essentiel · x erreur fréquente · q question · o option (* = bonne réponse) · ex explication
   f liens (id de fiche ou cours, s:id de soin, p:id de pathologie) */
const MD_SECS=[
 ["dou","Antalgiques et douleur","2.11 2.4|B.1 B.3","gauge"],
 ["anes","Anesthésie, réanimation et urgences","2.11 4.3|B.1 B.3","alert"],
 ["atb","Antibiotiques","2.11 2.5 2.10|B.1 B.3","thermo"],
 ["avir","Antiviraux, antifongiques et antiparasitaires","2.11 2.5 2.10|B.1 B.3","flask"],
 ["coag","Anticoagulants, antiagrégants et hémostase","2.11 2.8|B.1 B.3","drop"],
 ["cardio","Cardiologie et vasculaire","2.11 2.8|B.1 B.3","heart"],
 ["hydro","Solutés et équilibre hydroélectrolytique","2.11 4.4|B.1 B.3","drop"],
 ["pneumo","Pneumologie et allergologie","2.11 2.8|B.1 B.3","lungs"],
 ["gastro","Gastro-entérologie et hépatologie","2.11 2.8|B.1 B.3","gut"],
 ["diab","Diabétologie","2.11 2.7|B.1 B.3","finger"],
 ["endo","Endocrinologie et os","2.11 2.7|B.1 B.3","gland"],
 ["neuro","Neurologie","2.11 2.7|B.1 B.3","brain"],
 ["psy","Psychiatrie et addictologie","2.11 2.6|B.1 B.3","face"],
 ["hemato","Hématologie","2.11 2.5|B.1 B.3","drop"],
 ["immuno","Immunologie, rhumatologie et vaccins","2.11 2.5|B.1 B.3","flask"],
 ["onco","Oncologie","2.11 2.9|B.1 B.3","tube"],
 ["uro","Urologie et néphrologie","2.11 2.8|B.1 B.3","kidney"],
 ["gyneco","Gynécologie et obstétrique","2.11 2.2|B.1 B.3","baby"],
 ["pedia","Pédiatrie et néonatalogie","2.11 2.4|B.1 B.3","baby"],
 ["dermato","Dermatologie et plaies","2.11 4.4|B.1 B.3","peau"],
 ["ophorl","Ophtalmologie et ORL","2.11|B.1 B.3","eye"]
];
const MD_SEC={};MD_SECS.forEach(([id,nom,u,ico],n)=>{MD_SEC[id]={id,nom,u,ico,n};});
const MEDS=[],MDBY={};
/* Version publiée générée par scripts/premium.js : fiches déjà découpées (objets). */
function MDJ(L){L.forEach(o=>{MEDS.push(o);MDBY[o.i]=o;});}
function MD(sec,txt){
 txt.split(/\n(?==)/).forEach(b=>{b=b.trim();if(!b.startsWith("="))return;const L=b.split("\n"),h=L[0].slice(1).split("|").map(x=>x.trim());
  const o={n:h[0],i:h[1],s:sec,nn:[],d:[],ma:[],sch:null,m:[],ind:[],ci:[],ef:[],eg:[],it:[],v:[],sc:[],sb:[],p:[],edu:[],cat:[],r:[],err:[],q:[],f:[]};
  let cq=null;
  L.slice(1).forEach(l=>{l=l.trim();if(!l)return;const sp=l.indexOf(" "),k=sp<0?l:l.slice(0,sp),v=sp<0?"":l.slice(sp+1).trim();
   switch(k){
    case"a":o.nn.push(v);break;case"d":o.d.push(v);break;case"ma":o.ma.push(v);break;
    case"sch":{const [kk,...c]=v.split("|");o.sch={k:kk.trim(),cap:c.join("|").trim()};break;}
    case"m":{const [dci,br,pr]=v.split("|").map(x=>(x||"").trim());o.m.push({dci,br,pr});break;}
    case"i":o.ind.push(v);break;case"ci":o.ci.push(v);break;case"e":o.ef.push(v);break;case"g":o.eg.push(v);break;case"n":o.it.push(v);break;
    case"v":o.v.push(v);break;case"s":o.sc.push(v);break;case"b":o.sb.push(v);break;case"p":o.p.push(v);break;case"u":o.edu.push(v);break;
    case"c":o.cat.push(v);break;case"r":o.r.push(v);break;case"x":o.err.push(v);break;
    case"q":cq={q:v,o:[],a:0,e:""};o.q.push(cq);break;
    case"o":if(cq){let w=v;if(w.startsWith("*")){cq.a=cq.o.length;w=w.slice(1).trim();}cq.o.push(w);}break;
    case"ex":if(cq)cq.e=v;break;case"f":o.f.push(...v.split(/\s+/));break;
    default:console.warn("Médicaments : clé inconnue",k,"dans",o.n);}
  });
  if(MDBY[o.i])console.warn("Médicaments : identifiant en double",o.i);MEDS.push(o);MDBY[o.i]=o;});
}
