/* Carnet IFSI — compte et abonnement (Supabase).
   · Inscription par e-mail et mot de passe, confirmée par un code à 6 chiffres reçu par e-mail (pas de lien à ouvrir :
     fonctionne pareil dans l'appli Android, sur iPhone et sur le web).
   · Connexion, mot de passe oublié (code par e-mail), déconnexion, suppression du compte.
   · Code d'accès : ajoute des jours d'abonnement (fonction utiliser_code, voir supabase/schema.sql).
   · Clé des contenus réservés : remise par le serveur aux comptes abonnés, gardée sur l'appareil jusqu'à la fin de
     l'abonnement (carnet_pk) ; js/premium-boot.js s'en sert au démarrage pour ouvrir premium/pack.js.
   La bibliothèque Supabase (js/vendor/supabase.js) n'est chargée qu'au besoin. Les jetons de session et la clé sont
   rangés hors du préfixe ifsi_ : ils ne partent pas dans les sauvegardes. */
const AC_ON=()=>!!(typeof SB_URL!=="undefined"&&SB_URL&&SB_KEY);
const AC_PK="carnet_pk",AC_SESS="carnet-sb",AC_ABO="carnet_abo";
/* Jours de grâce ajoutés par le serveur après la fin d'une période payée (voir supabase/functions/stripe-webhook) */
const AC_GRACE=3*864e5;
const acInfo=()=>{try{return JSON.parse(localStorage.getItem(AC_ABO)||"null");}catch(e){return null;}};
const acWebPay=()=>!!(typeof ABO_PRIX!=="undefined"&&ABO_PRIX&&!(typeof isNative!=="undefined"&&isNative));
let acSb=null,acUser=null,acWait=null;
const acSt=()=>state.ac||(state.ac={mode:"login",email:"",busy:false,msg:"",err:""});
const acPk=()=>{try{return JSON.parse(localStorage.getItem(AC_PK)||"null");}catch(e){return null;}};
const acUntil=()=>{const o=acPk();return o&&o.u?o.u:null;};
const acActive=()=>{const u=acUntil();return !!(u&&Date.parse(u)>Date.now());};
const acHasSession=()=>{try{return !!localStorage.getItem(AC_SESS);}catch(e){return false;}};
const acDate=iso=>new Date(iso).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"});

/* ---------- Chargement de la bibliothèque et du client ---------- */
function acLoad(){
 if(!AC_ON())return Promise.reject(new Error("off"));
 if(acSb)return Promise.resolve(acSb);
 if(acWait)return acWait;
 acWait=new Promise((ok,ko)=>{
  const go=()=>{try{acSb=supabase.createClient(SB_URL,SB_KEY,{auth:{storageKey:AC_SESS,persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});
   acSb.auth.onAuthStateChange((ev,s)=>{acUser=s&&s.user||null;});
   acSb.auth.getSession().then(r=>{acUser=r.data.session&&r.data.session.user||null;ok(acSb);});}catch(e){ko(e);}};
  if(typeof supabase!=="undefined")return go();
  const sc=document.createElement("script");sc.src="js/vendor/supabase.js";sc.onload=go;sc.onerror=()=>{acWait=null;ko(new Error("réseau"));};document.head.appendChild(sc);
 });
 return acWait;
}

/* ---------- Messages d'erreur en français ---------- */
function acErr(e){const m=String(e&&(e.message||e.error_description||e)||"");
 const T=[[/invalid login credentials/i,"Adresse e-mail ou mot de passe incorrect."],[/email not confirmed/i,"Adresse e-mail pas encore confirmée : saisissez le code reçu par e-mail."],
  [/already registered|already exists/i,"Un compte existe déjà avec cette adresse : connectez-vous."],[/password should be at least|weak password|password is too/i,"Mot de passe trop faible : au moins 8 caractères, avec des lettres et des chiffres."],
  [/token has expired|invalid.*(token|otp)|otp.*(expired|invalid)/i,"Code incorrect ou expiré. Demandez-en un nouveau si besoin."],[/rate limit|too many|security purposes/i,"Trop de tentatives : réessayez dans quelques minutes."],
  [/unable to validate email|invalid email|email address .* is invalid/i,"Adresse e-mail invalide."],[/failed to fetch|network|réseau|load failed/i,"Pas de connexion internet : réessayez une fois connecté·e."],
  [/code_inconnu/,"Ce code n'existe pas. Vérifiez-le (lettres et chiffres, tirets compris)."],[/code_expire/,"Ce code n'est plus valable."],[/code_deja_utilise/,"Vous avez déjà utilisé ce code sur ce compte."],
  [/code_epuise/,"Ce code a déjà été utilisé le nombre de fois prévu."],[/non_connecte|jwt|not authenticated/i,"Session expirée : reconnectez-vous."],[/pas_abonne/,"Pas d'abonnement en cours sur ce compte."],
  [/abonnement_actif/,"Résiliez d'abord votre abonnement mensuel (Gérer mon abonnement) : vous pourrez supprimer le compte une fois la période payée terminée."],
  [/non-2xx|FunctionsHttpError|FunctionsFetchError|edge function|paiement_indisponible/i,"Le paiement n'est pas disponible pour le moment. Réessayez dans un instant."]];
 const f=T.find(([r])=>r.test(m));return f?f[1]:"Une erreur est survenue. Réessayez dans un instant.";}

/* ---------- Clé des contenus réservés ---------- */
async function acKid(k){try{const b=Uint8Array.from(atob(k),c=>c.charCodeAt(0)),h=new Uint8Array(await crypto.subtle.digest("SHA-256",b));
 return Array.from(h).map(x=>x.toString(16).padStart(2,"0")).join("").slice(0,12);}catch(e){return PREM_KID_APP;}}
/* Demande la clé au serveur. Renvoie "on" (abonnement en cours, clé gardée), "off" (pas d'abonnement) ou lève une erreur réseau. */
async function acRefresh(){
 const sb=await acLoad();const {data:{session}}=await sb.auth.getSession();if(!session){localStorage.removeItem(AC_PK);return "off";}
 try{const r=await sb.rpc("mon_abonnement");if(!r.error)localStorage.setItem(AC_ABO,JSON.stringify(r.data||null));}catch(e){}
 const {data,error}=await sb.rpc("cle_contenus");
 if(error){if(/pas_abonne/.test(error.message)){localStorage.removeItem(AC_PK);return "off";}throw error;}
 localStorage.setItem(AC_PK,JSON.stringify({k:data.k,u:data.u,kid:await acKid(data.k),uid:session.user.id}));return "on";}
/* Après un changement d'accès : recharge l'appli pour ouvrir ou refermer les contenus réservés. */
function acReload(msg){toast(msg);setTimeout(()=>location.reload(),900);}

/* Au démarrage : met à jour l'accès en arrière-plan (fin d'abonnement, nouvelle clé). */
function acBoot(){
 if(!AC_ON())return;
 /* Retour de la page de paiement Stripe : le serveur reçoit la confirmation en quelques secondes */
 if(/[?&]paiement=ok/.test(location.search)){try{history.replaceState(null,"",location.pathname+location.hash);}catch(e){}
  toast("Paiement reçu : activation de votre abonnement…");let n=0;
  const poll=()=>acRefresh().then(r=>{if(r==="on"&&acActive()){if(!PREM.on)acReload("Abonnement actif : bienvenue !");else render();}else if(++n<12)setTimeout(poll,2500);else toast("Activation plus longue que prévu : touchez « Mettre à jour mon accès » dans un instant");}).catch(()=>{if(++n<12)setTimeout(poll,2500);});
  setTimeout(poll,1500);return;}
 /* Appli Android ou iPhone : au retour au premier plan (après un abonnement pris sur le site, par exemple) */
 try{const A=typeof plug==="function"&&plug("App");if(A)A.addListener("appStateChange",s=>{if(s&&s.isActive&&acHasSession()&&navigator.onLine)acRefresh().then(r=>{if(r==="on"&&!PREM.on&&acActive())acReload("Abonnement actif : ouverture des contenus");}).catch(()=>{});});}catch(e){}
 if(!acHasSession()||!navigator.onLine)return;
 setTimeout(()=>{acRefresh().then(r=>{
  if(r==="on"&&!PREM.on&&acActive())acReload("Abonnement actif : ouverture des contenus");
  else if(r==="off"&&PREM.on&&PREM.src==="compte")toast("Votre abonnement est terminé : les contenus réservés se fermeront au prochain lancement");
 }).catch(()=>{});},2500);
}

/* ---------- Écran Mon compte ---------- */
function acStatusCard(){
 const on=PREM.on||acActive(),u=acUntil(),i=acInfo(),m=i&&i.mensuel,fin=m&&i.periode_fin?new Date(Date.parse(i.periode_fin)-AC_GRACE).toISOString():null;
 const t=PREM.src==="ouvert"?"Phase de lancement : tout est ouvert":m&&i.statut==="past_due"?"Paiement refusé":m&&i.resilie?"Abonnement résilié":m?"Abonnement mensuel actif":on?"Abonnement actif":"Version gratuite";
 const s=PREM.src==="ouvert"?"Pendant le lancement, tous les contenus sont accessibles sans abonnement."
  :m&&i.statut==="past_due"?"Le dernier prélèvement n'a pas abouti : mettez à jour votre carte dans « Gérer mon abonnement » pour garder l'accès."
  :m&&i.resilie&&fin?`Aucun nouveau prélèvement. Accès à tous les contenus jusqu'au ${esc(acDate(fin))}.`
  :m&&fin?`Renouvelé automatiquement chaque mois · prochain prélèvement vers le ${esc(acDate(fin))}. Résiliable à tout moment.`
  :on&&u?`Accès à tous les contenus jusqu'au ${esc(acDate(u))}.`:"Fiches récap, un contenu complet par rubrique, quelques cartes par jour, outils et stage de base.";
 return `<section class="ac-status ${on&&!(m&&i.statut==="past_due")?"on":""}"><span class="ac-ic">${on?IC.check:QIC.shield}</span><div><b>${t}</b><small>${s}</small></div></section>`;}
/* Abonnement mensuel : souscrire (site web) ou gérer (carte, factures, résiliation) */
function acSubBlock(logged){
 const i=acInfo(),m=i&&i.mensuel,st=acSt(),em=st.where==="abo"&&(st.err||st.msg)?`<p class="ac-msg${st.err?" err":""}" role="${st.err?"alert":"status"}">${esc(st.err||st.msg)}</p>`:"";
 if(logged&&m)return `<section class="stack-sm"><h2>Abonnement mensuel</h2>${!(typeof isNative!=="undefined"&&isNative)
  ?`<div class="list"><button class="li" data-act="ac-gerer" style="grid-template-columns:minmax(0,1fr)"><span><span class="t" style="color:var(--brand)">Gérer mon abonnement</span><span class="s">Carte bancaire, factures, résiliation</span></span></button></div>
   ${em}<p class="muted">La résiliation prend effet à la fin du mois en cours : vous gardez l'accès jusque-là, sans nouveau prélèvement.</p>`
  :`<p class="muted">Pour changer de carte, voir vos factures ou résilier : connectez-vous sur le site web de Carnet IFSI, Réglages › Mon compte.</p>`}</section>`;
 if(!acWebPay()||PREM.src==="ouvert")return "";
 return `<section class="ac-offer"><span class="eyebrow">Abonnement mensuel</span><b class="ac-price">${esc(ABO_PRIX)}<small> par mois</small></b>
  <p>Tous les contenus et outils, sans limite. Sans engagement : résiliable à tout moment, en quelques clics.</p>
  ${logged?`<button class="btn block" data-act="ac-sub" ${st.busy?"disabled":""}>${st.busy?"Ouverture du paiement…":"S'abonner"}</button>
  ${em}${i&&i.client?`<button class="link" data-act="ac-gerer">Mes factures et paiements</button>`:""}<small class="muted">Paiement sécurisé par Stripe. Renouvelé chaque mois jusqu'à résiliation.</small>`
  :`<small class="muted">Créez un compte ou connectez-vous ci-dessous pour vous abonner.</small>`}</section>`;}
function acPerks(){
 const L=[["Tous les cours détaillés","pathologies, soins, médicaments, cours d'UE, anatomie, mémoire"],["« Comprendre en images » et vidéos des gestes",""],
  ["Cartes de révision sans limite","et partiels blancs de 20 à 40 questions"],["Tous les niveaux de calculs","et l'épreuve « 10 calculs en 30 min »"],
  ["Stage complet","carnet de suivi, feuilles de travail, guides des 19 services, parcours"],["Tous les outils","urgences AFGSU, calculs, scores, pansements, planning, aide au mémoire…"],["Fiches A4","à lire ou à imprimer"]];
 return `<section class="stack-sm"><h2>Avec l'abonnement</h2><ul class="ac-perks">${L.map(([t,s])=>`<li>${IC.check}<span><b>${t}</b>${s?` <small>${s}</small>`:""}</span></li>`).join("")}</ul></section>`;}
function vCompte(){
 const st=acSt(),head=`${backBtn("Réglages")}${vh("Réglages","Mon compte",AC_ON()?"Votre compte sert seulement à l'abonnement : votre progression, votre carnet et vos notes restent sur cet appareil.":"")}`;
 if(!AC_ON())return `<div class="stack-lg">${head}${acStatusCard()}<div class="callout"><b>Les comptes arrivent bientôt.</b><p>Vous pourrez créer un compte et vous abonner${typeof ABO_PRIX!=="undefined"&&ABO_PRIX?` pour ${esc(ABO_PRIX)} par mois, sans engagement,`:""} ou activer un code d'accès.</p></div>${acPerks()}</div>`;
 const msgAll=st.err?`<p class="ac-msg err" role="alert">${esc(st.err)}</p>`:st.msg?`<p class="ac-msg" role="status">${esc(st.msg)}</p>`:"";
 const msgAt=w=>(st.where||"form")===w?msgAll:"",msg=msgAt("form");
 const dis=st.busy?"disabled":"";
 if(acUser){
  return `<div class="stack-lg">${head}${acStatusCard()}${acSubBlock(true)}
   <section class="stack-sm"><h2>${acWebPay()?"Vous avez un code d'accès ?":"Code d'accès"}</h2><form id="ac-code-form" class="cd-form sheet-body" autocomplete="off">
    <label for="ac-code">Saisissez votre code<input id="ac-code" placeholder="IFSI-XXXX-XXXX" autocapitalize="characters" spellcheck="false" maxlength="24" required></label>
    ${msg}<button class="btn block" ${dis}>${st.busy?"Vérification…":"Activer le code"}</button></form>
    <p class="muted">Un code ajoute des jours d'abonnement à ce compte. Il s'utilise une seule fois par compte.</p></section>
   ${PREM.on||acActive()?"":acPerks()}
   <section class="stack-sm"><h2>Compte</h2><div class="list">
    <div class="set-row"><span>Adresse e-mail</span><span class="muted ac-mail">${esc(acUser.email||"")}</span></div>
    <button class="li" data-act="ac-refresh" style="grid-template-columns:minmax(0,1fr)"><span><span class="t" style="color:var(--brand)">Mettre à jour mon accès</span><span class="s">Après un achat ou un code activé sur un autre appareil</span></span></button>
    <button class="li" data-act="ac-out" style="grid-template-columns:minmax(0,1fr)"><span><span class="t" style="color:var(--brand)">Se déconnecter</span><span class="s">Les contenus réservés se ferment sur cet appareil</span></span></button>
    <button class="li" data-act="ac-del" style="grid-template-columns:minmax(0,1fr)"><span><span class="t" style="color:var(--bad)">Supprimer mon compte</span><span class="s">Efface le compte et l'accès restant ; un abonnement mensuel se résilie d'abord. Vos données sur l'appareil ne bougent pas</span></span></button></div>${msgAt("compte")}</section>
   <p class="disclaimer">Voir les <a href="#legal/cgu">conditions d'utilisation</a> et la <a href="#legal/confidentialite">confidentialité</a>.</p></div>`;
 }
 const seg=`<div class="seg" role="group" aria-label="Compte"><button data-act="ac-mode" data-k="login" aria-pressed="${["login","forgot","reset"].includes(st.mode)}">Se connecter</button><button data-act="ac-mode" data-k="signup" aria-pressed="${["signup","verify"].includes(st.mode)}">Créer un compte</button></div>`;
 const em=`<label for="ac-email">Adresse e-mail<input id="ac-email" type="email" autocomplete="email" inputmode="email" value="${esc(st.email||"")}" required></label>`;
 let form="";
 if(st.mode==="login")form=`<form id="ac-login-form" class="cd-form sheet-body">${em}<label for="ac-pw">Mot de passe<input id="ac-pw" type="password" autocomplete="current-password" required></label>${msg}
  <button class="btn block" ${dis}>${st.busy?"Connexion…":"Se connecter"}</button><button type="button" class="link" data-act="ac-mode" data-k="forgot">Mot de passe oublié ?</button></form>`;
 else if(st.mode==="signup")form=`<form id="ac-signup-form" class="cd-form sheet-body">${em}<label for="ac-pw">Mot de passe (8 caractères minimum)<input id="ac-pw" type="password" autocomplete="new-password" minlength="8" required></label>
  <label class="ac-ok"><input type="checkbox" id="ac-cgu" required><span>J'accepte les <a href="#legal/cgu">conditions d'utilisation</a> et j'ai lu la <a href="#legal/confidentialite">politique de confidentialité</a>.</span></label>${msg}
  <button class="btn block" ${dis}>${st.busy?"Création…":"Créer mon compte"}</button></form>`;
 else if(st.mode==="verify")form=`<form id="ac-verify-form" class="cd-form sheet-body"><p>Un code à 6 chiffres a été envoyé à <b>${esc(st.email)}</b>. Pensez à regarder dans les courriers indésirables.</p>
  <label for="ac-otp">Code reçu par e-mail<input id="ac-otp" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9 ]{6,8}" maxlength="8" required></label>${msg}
  <button class="btn block" ${dis}>${st.busy?"Vérification…":"Confirmer mon adresse"}</button><button type="button" class="link" data-act="ac-resend">Renvoyer le code</button></form>`;
 else if(st.mode==="forgot")form=`<form id="ac-forgot-form" class="cd-form sheet-body"><p>Indiquez l'adresse de votre compte : vous recevrez un code pour choisir un nouveau mot de passe.</p>${em}${msg}
  <button class="btn block" ${dis}>${st.busy?"Envoi…":"Recevoir un code"}</button><button type="button" class="link" data-act="ac-mode" data-k="login">Retour à la connexion</button></form>`;
 else if(st.mode==="reset")form=`<form id="ac-reset-form" class="cd-form sheet-body"><p>Code envoyé à <b>${esc(st.email)}</b>.</p>
  <label for="ac-otp">Code reçu par e-mail<input id="ac-otp" inputmode="numeric" autocomplete="one-time-code" maxlength="8" required></label>
  <label for="ac-pw">Nouveau mot de passe (8 caractères minimum)<input id="ac-pw" type="password" autocomplete="new-password" minlength="8" required></label>${msg}
  <button class="btn block" ${dis}>${st.busy?"Enregistrement…":"Changer le mot de passe"}</button></form>`;
 return `<div class="stack-lg">${head}${acStatusCard()}${acSubBlock(false)}${seg}${form}${acPerks()}</div>`;
}

/* ---------- Actions ---------- */
async function acRun(fn,ok,where="form"){const st=acSt();st.busy=true;st.err="";st.msg="";st.where=where;render();
 try{await fn(await acLoad());if(ok)ok();}catch(e){st.err=acErr(e);}finally{st.busy=false;render();}}
function acSubmit(f){
 const st=acSt(),v=id=>{const e=document.getElementById(id);return e?e.value.trim():"";};
 if(f.id!=="ac-code-form"){const e=v("ac-email");if(e)st.email=e.toLowerCase();}
 /* Lire les champs avant de réafficher l'écran (le réaffichage les vide) */
 const pw=(document.getElementById("ac-pw")||{}).value||"",otp=v("ac-otp").replace(/\s/g,""),code=v("ac-code");
 if(f.id==="ac-login-form")acRun(async sb=>{const {error}=await sb.auth.signInWithPassword({email:st.email,password:pw});
   if(error){if(/not confirmed/i.test(error.message)){st.mode="verify";await sb.auth.resend({type:"signup",email:st.email}).catch(()=>{});}throw error;}
   acUser=(await sb.auth.getUser()).data.user;const r=await acRefresh().catch(()=>"off");
   if(r==="on"&&!PREM.on)acReload("Connecté·e : ouverture des contenus");else toast("Connecté·e");});
 else if(f.id==="ac-signup-form")acRun(async sb=>{const {data,error}=await sb.auth.signUp({email:st.email,password:pw});if(error)throw error;
   if(data.session){acUser=data.user;toast("Compte créé");}else{st.mode="verify";st.msg="";}});
 else if(f.id==="ac-verify-form")acRun(async sb=>{const token=otp;
   let r=await sb.auth.verifyOtp({email:st.email,token,type:"email"});if(r.error)r=await sb.auth.verifyOtp({email:st.email,token,type:"signup"});if(r.error)throw r.error;
   acUser=r.data.user;st.mode="login";toast("Adresse confirmée : bienvenue !");});
 else if(f.id==="ac-forgot-form")acRun(async sb=>{const {error}=await sb.auth.resetPasswordForEmail(st.email);if(error)throw error;st.mode="reset";});
 else if(f.id==="ac-reset-form")acRun(async sb=>{const token=otp;
   const r=await sb.auth.verifyOtp({email:st.email,token,type:"recovery"});if(r.error)throw r.error;
   const u=await sb.auth.updateUser({password:pw});if(u.error)throw u.error;acUser=u.data.user;st.mode="login";
   const k=await acRefresh().catch(()=>"off");if(k==="on"&&!PREM.on)acReload("Mot de passe changé : ouverture des contenus");else toast("Mot de passe changé");});
 else if(f.id==="ac-code-form")acRun(async sb=>{const {data,error}=await sb.rpc("utiliser_code",{p_code:code});if(error)throw error;
   await acRefresh();acReload(`Code activé : accès jusqu'au ${acDate(data)}`);});
}
function acAct(b,a){
 const st=acSt();
 if(a==="ac-sub"||a==="ac-gerer")return acRun(async sb=>{const {data,error}=await sb.functions.invoke("paiement",{body:{action:a==="ac-sub"?"abonner":"gerer"}});
   if(error)throw error;if(!data||!data.url)throw new Error("paiement_indisponible");location.href=data.url;},null,"abo");
 if(a==="ac-mode"){st.mode=b.dataset.k;st.err="";st.msg="";render();setTimeout(()=>{const i=document.querySelector("#app form input");i&&i.focus();},50);}
 else if(a==="ac-resend")acRun(async sb=>{const {error}=await sb.auth.resend({type:"signup",email:st.email});if(error)throw error;st.msg="Nouveau code envoyé.";});
 else if(a==="ac-refresh")acRun(async()=>{const r=await acRefresh();if(r==="on"&&!PREM.on)acReload("Abonnement actif : ouverture des contenus");else st.msg=r==="on"?"Accès à jour.":"Pas d'abonnement en cours sur ce compte.";},null,"compte");
 else if(a==="ac-out")acRun(async sb=>{await sb.auth.signOut().catch(()=>{});acUser=null;const was=PREM.on&&PREM.src==="compte";localStorage.removeItem(AC_PK);localStorage.removeItem(AC_ABO);
   if(was)acReload("Déconnecté·e");else toast("Déconnecté·e");},null,"compte");
 else if(a==="ac-del"){if(!b.dataset.armed){b.dataset.armed="1";b.querySelector(".t").textContent="Toucher à nouveau pour supprimer définitivement";setTimeout(()=>{if(b.isConnected){delete b.dataset.armed;b.querySelector(".t").textContent="Supprimer mon compte";}},4000);return;}
  acRun(async sb=>{const {error}=await sb.rpc("supprimer_mon_compte");if(error)throw error;await sb.auth.signOut().catch(()=>{});acUser=null;
   const was=PREM.on&&PREM.src==="compte";localStorage.removeItem(AC_PK);localStorage.removeItem(AC_ABO);if(was)acReload("Compte supprimé");else toast("Compte supprimé");},null,"compte");}
}
/* Ligne de l'écran Réglages */
function acSetRow(){const on=PREM.on||acActive(),u=acUntil();
 const s=PREM.src==="ouvert"?"Phase de lancement : tout est ouvert":on&&u?`Abonnement actif jusqu'au ${acDate(u)}`:AC_ON()?(acHasSession()?"Version gratuite · code d'accès, abonnement":"Se connecter ou créer un compte"):"Bientôt : compte et abonnement";
 return `<div class="set-group"><span class="eyebrow">Compte</span><div class="list"><a class="li" href="#compte"><span class="ic tb-ic" style="--c:#123B4A">${QIC.shield}</span><span><span class="t">Mon compte</span><span class="s">${esc(s)}</span></span>${chev}</a></div></div>`;}
/* Prépare le client si une session existe (pour afficher l'adresse dans Mon compte) */
function acWarm(){if(AC_ON()&&acHasSession()&&!acSb)acLoad().then(()=>{if(route().v==="compte")render();}).catch(()=>{});}
