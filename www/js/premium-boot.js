/* Carnet IFSI — au démarrage, juste après les contenus gratuits : si une clé valide est disponible (abonnement en cours,
   gardée par js/compte.js, ou phase de lancement où tout est ouvert), charge le paquet chiffré des contenus réservés
   et l'ouvre avant le reste de l'appli. Sans clé, rien n'est téléchargé : l'appli fonctionne en version gratuite. */
var PREM={on:false,src:null,err:null};
(function(){
 var k=null;
 try{var o=JSON.parse(localStorage.getItem("carnet_pk")||"null");
  if(o&&o.k&&o.kid===PREM_KID_APP&&(!o.u||Date.parse(o.u)>Date.now())){k=o.k;PREM.src="compte";}}catch(e){}
 if(!k&&typeof PREM_OPEN!=="undefined"&&PREM_OPEN){k=PREM_OPEN;PREM.src="ouvert";}
 if(!k)return;
 PREM.k=k;
 document.write('<script src="js/vendor/nacl-fast.min.js"><\/script><script src="js/vendor/fflate.min.js"><\/script><script src="premium/pack.js"><\/script><script src="js/premium-apply-core.js"><\/script><script>premOpen()<\/script>');
})();
