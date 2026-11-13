/* Carnet IFSI — ouverture des contenus réservés aux abonnés.
   Le paquet (premium/pack.js) est compressé (fflate) puis chiffré avec tweetnacl (secretbox) ; une fois ouvert, chaque fiche gratuite (marquée _l)
   reçoit son contenu complet. Utilisé aussi par scripts/premium.js pour vérifier le paquet. */
function premMerge(P){
 var by=function(L,k){var m={};L.forEach(function(r){m[r[k]]=r;});return m;};
 var put=function(t,src){if(!t)return;Object.assign(t,src);delete t._l;};
 var C=by(COURS,"id"),X=by(PATHOS,"i");
 Object.keys(P.c||{}).forEach(function(id){put(C[id],P.c[id]);});
 Object.keys(P.p||{}).forEach(function(i){put(X[i],P.p[i]);});
 Object.keys(P.s||{}).forEach(function(i){put(SOBY[i],P.s[i]);});
 Object.keys(P.m||{}).forEach(function(i){put(MDBY[i],P.m[i]);});
 /* Images : mêmes clés, dans l'ordre d'origine */
 var all=Object.assign({},PIMG,P.im||{});Object.keys(PIMG).forEach(function(k){delete PIMG[k];});
 (P.imk||Object.keys(all)).forEach(function(k){if(k in all)PIMG[k]=all[k];});
}
function premB64(s){var b=atob(s),u=new Uint8Array(b.length);for(var i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u;}
function premOpen(){
 try{
  if(typeof PREM_PACK==="undefined"||typeof nacl==="undefined"||typeof fflate==="undefined")throw new Error("paquet absent");
  if(typeof PREM_KID!=="undefined"&&PREM_KID!==PREM_KID_APP)throw new Error("paquet d'une autre version");
  var raw=premB64(PREM_PACK),o=nacl.secretbox.open(raw.subarray(24),raw.subarray(0,24),premB64(PREM.k));
  if(!o)throw new Error("clé refusée");
  premMerge(JSON.parse(new TextDecoder().decode(fflate.unzlibSync(o))));PREM.on=true;
 }catch(e){PREM.err=e.message;}
 delete PREM.k;
}
