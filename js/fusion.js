/* Carnet IFSI — fusion des fiches récap en doublon.
   Une fiche dont le sujet est traité plus complètement ailleurs (pathologie, soin, médicament ou cours) est retirée des listes,
   de la recherche, des UE et des cartes ; son adresse, ses favoris et sa progression mènent au contenu complet.
   Chargé après les contenus (maj.js) et avant render.js. */
const FICHE_GO={
 /* anatomie : les mini-fiches sont reprises en entier dans les cours */
 cellule:"cours/cellule-c",coeur:"cours/cardio-c","respi-anat":"cours/respi-c",rein:"cours/urinaire-c",nerveux:"cours/nerveux-c",digestif:"cours/digestif-c",sang:"cours/sang-c",
 "anglais-2":"cours/anglais-2-c",
 /* pathologies */
 fracture:"cours/traumato-c",brulure:"patho/brulures",tc:"patho/tc-n",inflammation:"cours/inflammation-c",sepsis:"patho/sepsis-i",infections:"cours/infectio-c",
 depression:"cours/psy1-c",anxieux:"cours/psy1-c",schizophrenie:"patho/schizophrenie",bipolaire:"patho/bipolaire-1",addictions:"cours/psy2-c",suicide:"patho/crise-suicidaire",tca:"patho/tca",
 hypo:"patho/hypoglycemie",diabete:"cours/diabete-c",ic:"patho/icglob",irc:"patho/irc",ira:"patho/ira",bpco:"patho/bpco",asthme:"patho/asthme",pneumopathie:"patho/pneumonie-com",
 alzheimer:"patho/alzheimer-n",parkinson:"patho/parkinson-n",sep:"patho/sep-n",epilepsie:"patho/epilepsie-n",confusion:"patho/confusion-aigue",
 sca:"cours/sca-c",avc:"cours/avc-c","tvp-ep":"patho/tvp",hta:"patho/hta",aomi:"patho/aomi",occlusion:"patho/occlusion-g",cirrhose:"patho/cirrhose-g",
 cancer:"cours/cancero-c","cancer-sein":"patho/cancer-sein","cancer-colon":"patho/cancer-colorectal","cancer-poumon":"patho/cancer-bp","cancer-prostate":"patho/cancer-prostate",
 pyelo:"patho/pna",meningite:"patho/meningite-bact",tuberculose:"patho/tuberculose-p",vih:"patho/vih",hepatites:"cours/ist-vih-c",pr:"patho/pr",
 denutrition:"patho/denutrition-ag",adenome:"patho/hbp",
 /* thérapeutiques */
 neuroleptiques:"med/antipsychotiques",chimio:"cours/chimio-c",adme:"cours/pharmaco-c",antibio:"med/atb-principes",stupefiants:"soin/stupefiants","insuline-f":"cours/insuline",
 antiarythmiques:"med/antiarythmiques",corticoides:"med/corticoides",antiagregants:"med/antiagregants",solutes:"med/solutes",antiepileptiques:"med/antiepileptiques",
 /* soins */
 precautions:"soin/precautions-standard",aes:"soin/aes",dasri:"soin/dasri",pac:"soin/chambre-implantable",injections:"cours/injections-c",vvp:"soin/pose-vvp",
 "glycemie-cap":"soin/glycemie-capillaire",glyc:"soin/glycemie-capillaire","ecg-pose":"soin/ecg",sondage:"soin/sondage-demeure",o2:"soin/oxygenotherapie",toilette:"soin/toilette-lit",
 escarres:"soin/classification-escarres",chutes:"soin/risque-chute",pansement:"soin/pansement-simple",acr:"soin/rcp",anaphylaxie:"soin/anaphylaxie",palliatif:"cours/palliatif-c",
 prelevement:"soin/prelevement-veineux",sng:"soin/pose-sng",drains:"soin/surveillance-drains",stomie:"cours/sondes-drainages-c","fils-agrafes":"soin/ablation-fils",
 aspiration:"soin/tracheotomie",aerosol:"soin/aerosol","assist-examens":"cours/imagerie-c","hygiene-mains":"cours/hygiene-c","ias-bmr":"cours/infectio-c",manutention:"cours/ergonomie-c",
 bouche:"soin/soins-bouche","post-mortem":"soin/soins-apres-deces",
 /* surveillance */
 fc:"soin/pouls",ta:"soin/pression-arterielle",fr:"soin/frequence-respiratoire",spo2:"soin/spo2",temp:"soin/temperature",douleur:"cours/antalgie",ecbu:"soin/ecbu",
 /* rôle infirmier, méthodes */
 rogers:"cours/relation-aide-c",secret:"soin/secret-professionnel","fin-vie-loi":"cours/bioethique-c",qualite:"cours/qualite-c",etp:"cours/education-c",vaccins:"cours/vaccination-c",
 encadrement:"cours/encadrement-c",organisation:"cours/guide-planif",numerique:"cours/numerique-c",ecologie:"cours/environnement-c",handicap:"cours/sante-handicap-c",
 "sante-def":"cours/sante-handicap-c","socio-anthropo":"cours/psycho-socio-c",recherche:"cours/recherche-c"
};
const FICHE_OLD={};
for(let i=FICHES.length-1;i>=0;i--){const f=FICHES[i];if(FICHE_GO[f.id]){FICHE_OLD[f.id]=f;FICHES.splice(i,1);}}
/* contenu visé par une adresse « type/id » : titre et clé de favori */
const CT_KEY={fiche:"f",cours:"c",patho:"p",soin:"s",med:"m"};
function ctTarget(g){const [k,id]=String(g||"").split("/");
 const o=k==="fiche"?FICHES.find(x=>x.id===id):k==="cours"?COURS.find(x=>x.id===id&&!x.pro):k==="patho"?PATHOS.find(x=>x.i===id):k==="soin"?SOINS.find(x=>x.i===id):k==="med"?MEDS.find(x=>x.i===id):null;
 return o?{h:k+"/"+id,t:o.titre||o.n,key:CT_KEY[k]+":"+id}:null;}
/* lien vers un contenu cité par son identifiant (fiche, cours ou fiche fusionnée) */
function ctLink(id){if(FICHE_GO[id])return ctTarget(FICHE_GO[id]);
 return FICHES.some(x=>x.id===id)?ctTarget("fiche/"+id):ctTarget("cours/"+id);}
/* rangée de puces vers des contenus liés, sans doublon */
function ctChips(ids){const seen=new Set();return (ids||[]).map(ctLink).filter(x=>x&&!seen.has(x.h)&&seen.add(x.h)).map(x=>`<a class="chip" href="#${x.h}">${esc(x.t)}</a>`).join("");}
/* migration unique des données de l'utilisateur : favoris, progression et dernière lecture vers le contenu complet */
(function fusionMigrate(){try{
 const KD={cours:"studied",patho:"pxdone",soin:"sodone",med:"mddone"};
 let favs=store.get("favs",[]),chg=false;
 favs=favs.map(k=>{const [t,id]=k.split(":");if(t==="f"&&FICHE_GO[id]){const x=ctTarget(FICHE_GO[id]);chg=true;return x?x.key:k;}return k;});
 if(chg)store.set("favs",[...new Set(favs)]);
 const rev=store.get("reviewed",[]),add={};
 rev.forEach(id=>{const g=FICHE_GO[id];if(!g)return;const [k,t]=g.split("/");(add[KD[k]]=add[KD[k]]||[]).push(t);});
 Object.entries(add).forEach(([key,L])=>{const cur=store.get(key,[]);const nx=[...new Set([...cur,...L])];if(nx.length!==cur.length)store.set(key,nx);});
 const last=store.get("last",null);if(last&&last.t==="f"&&FICHE_GO[last.id]){const [k,id]=FICHE_GO[last.id].split("/");if(k==="cours")store.set("last",{t:"c",id});}
}catch(e){}})();
