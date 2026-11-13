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
const AC_PK="carnet_pk",AC_SESS="carnet-sb";
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
  [/code_epuise/,"Ce code a déjà été utilisé le nombre de fois prévu."],[/non_connecte|jwt|not authenticated/i,"Session expirée : reconnectez-vous."],[/pas_abonne/,"Pas d'abonnement en cours sur ce compte."]];
 const f=T.find(([r])=>r.test(m));return f?f[1]:"Une erreur est survenue. Réessayez dans un instant.";}

/* ---------- Clé des contenus réservés ---------- */
async function acKid(k){try{const b=Uint8Array.from(atob(k),c=>c.charCodeAt(0)),h=new Uint8Array(await crypto.subtle.digest("SHA-256",b));
 return Array.from(h).map(x=>x.toString(16).padStart(2,"0")).join("").slice(0,12);}catch(e){return PREM_KID_APP;}}
/* Demande la clé au serveur. Renvoie "on" (abonnement en cours, clé gardée), "off" (pas d'abonnement) ou lève une erreur réseau. */
async function acRefresh(){
 const sb=await acLoad();const {data:{session}}=await sb.auth.getSession();if(!session){localStorage.removeItem(AC_PK);return "off";}
 const {data,error}=await sb.rpc("cle_contenus");
 if(error){if(/pas_abonne/.test(error.message)){localStorage.removeItem(AC_PK);return "off";}throw error;}
 localStorage.setItem(AC_PK,JSON.stringify({k:data.k,u:data.u,kid:await acKid(data.k),uid:session.user.id}));return "on";}
/* Après un changement d'accès : recharge l'appli pour ouvrir ou refermer les contenus réservés. */
function acReload(msg){toast(msg);setTimeout(()=>location.reload(),900);}

/* Au démarrage : met à jour l'accès en arrière-plan (fin d'abonnement, nouvelle clé). */
function acBoot(){
 if(!AC_ON()||!acHasSession()||!navigator.onLine)return;
 setTimeout(()=>{acRefresh().then(r=>{
  if(r==="on"&&!PREM.on&&acActive())acReload("Abonnement actif : ouverture des contenus");
  else if(r==="off"&&PREM.on&&PREM.src==="compte")toast("Votre abonnement est terminé : les contenus réservés se fermeront au prochain lancement");
 }).catch(()=>{});},2500);
}

/* ---------- Écran Mon compte ---------- */
function acStatusCard(){
 const on=PREM.on||acActive(),u=acUntil();
 return `<section class="ac-status ${on?"on":""}"><span class="ac-ic">${on?IC.check:QIC.shield}</span><div>
  <b>${PREM.src==="ouvert"?"Phase de lancement : tout est ouvert":on?"Abonnement actif":"Version gratuite"}</b>
  <small>${PREM.src==="ouvert"?"Pendant le lancement, tous les contenus sont accessibles sans abonnement.":on&&u?`Accès à tous les contenus jusqu'au ${esc(acDate(u))}.`:"Fiches récap, un contenu complet par rubrique, quelques cartes par jour, outils et stage de base."}</small></div></section>`;}
function acPerks(){
 const L=[["Tous les cours détaillés","pathologies, soins, médicaments, cours d'UE, anatomie, mémoire"],["« Comprendre en images » et vidéos des gestes",""],
  ["Cartes de révision sans limite","et partiels blancs de 20 à 40 questions"],["Tous les niveaux de calculs","et l'épreuve « 10 calculs en 30 min »"],
  ["Stage complet","carnet de suivi, feuilles de travail, guides des 19 services, parcours"],["Tous les outils","urgences AFGSU, calculs, scores, pansements, planning, aide au mémoire…"],["Fiches A4","à lire ou à imprimer"]];
 return `<section class="stack-sm"><h2>Avec l'abonnement</h2><ul class="ac-perks">${L.map(([t,s])=>`<li>${IC.check}<span><b>${t}</b>${s?` <small>${s}</small>`:""}</span></li>`).join("")}</ul></section>`;}
function vCompte(){
 const st=acSt(),head=`${backBtn("Réglages")}${vh("Réglages","Mon compte",AC_ON()?"Votre compte sert seulement à l'abonnement : votre progression, votre carnet et vos notes restent sur cet appareil.":"")}`;
 if(!AC_ON())return `<div class="stack-lg">${head}${acStatusCard()}<div class="callout"><b>Les comptes arrivent bientôt.</b><p>Vous pourrez créer un compte et activer un abonnement avec un code d'accès.</p></div>${acPerks()}</div>`;
 const msg=st.err?`<p class="ac-msg err" role="alert">${esc(st.err)}</p>`:st.msg?`<p class="ac-msg" role="status">${esc(st.msg)}</p>`:"";
 const dis=st.busy?"disabled":"";
 if(acUser){
  return `<div class="stack-lg">${head}${acStatusCard()}
   <section class="stack-sm"><h2>Code d'accès</h2><form id="ac-code-form" class="cd-form sheet-body" autocomplete="off">
    <label for="ac-code">Saisissez votre code<input id="ac-code" placeholder="IFSI-XXXX-XXXX" autocapitalize="characters" spellcheck="false" maxlength="24" required></label>
    ${msg}<button class="btn block" ${dis}>${st.busy?"Vérification…":"Activer le code"}</button></form>
    <p class="muted">Un code ajoute des jours d'abonnement à ce compte. Il s'utilise une seule fois par compte.</p></section>
   ${PREM.on||acActive()?"":acPerks()}
   <section class="stack-sm"><h2>Compte</h2><div class="list">
    <div class="set-row"><span>Adresse e-mail</span><span class="muted ac-mail">${esc(acUser.email||"")}</span></div>
    <button class="li" data-act="ac-refresh" style="grid-template-columns:minmax(0,1fr)"><span><span class="t" style="color:var(--brand)">Mettre à jour mon accès</span><span class="s">Après un achat ou un code activé sur un autre appareil</span></span></button>
    <button class="li" data-act="ac-out" style="grid-template-columns:minmax(0,1fr)"><span><span class="t" style="color:var(--brand)">Se déconnecter</span><span class="s">Les contenus réservés se ferment sur cet appareil</span></span></button>
    <button class="li" data-act="ac-del" style="grid-template-columns:minmax(0,1fr)"><span><span class="t" style="color:var(--bad)">Supprimer mon compte</span><span class="s">Efface le compte et l'abonnement restant ; vos données sur l'appareil ne bougent pas</span></span></button></div></section>
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
 return `<div class="stack-lg">${head}${acStatusCard()}${seg}${form}${acPerks()}</div>`;
}

/* ---------- Actions ---------- */
async function acRun(fn,ok){const st=acSt();st.busy=true;st.err="";st.msg="";render();
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
 if(a==="ac-mode"){st.mode=b.dataset.k;st.err="";st.msg="";render();setTimeout(()=>{const i=document.querySelector("#app form input");i&&i.focus();},50);}
 else if(a==="ac-resend")acRun(async sb=>{const {error}=await sb.auth.resend({type:"signup",email:st.email});if(error)throw error;st.msg="Nouveau code envoyé.";});
 else if(a==="ac-refresh")acRun(async()=>{const r=await acRefresh();if(r==="on"&&!PREM.on)acReload("Abonnement actif : ouverture des contenus");else st.msg=r==="on"?"Accès à jour.":"Pas d'abonnement en cours sur ce compte.";});
 else if(a==="ac-out")acRun(async sb=>{await sb.auth.signOut().catch(()=>{});acUser=null;const was=PREM.on&&PREM.src==="compte";localStorage.removeItem(AC_PK);
   if(was)acReload("Déconnecté·e");else toast("Déconnecté·e");});
 else if(a==="ac-del"){if(!b.dataset.armed){b.dataset.armed="1";b.querySelector(".t").textContent="Toucher à nouveau pour supprimer définitivement";setTimeout(()=>{if(b.isConnected){delete b.dataset.armed;b.querySelector(".t").textContent="Supprimer mon compte";}},4000);return;}
  acRun(async sb=>{const {error}=await sb.rpc("supprimer_mon_compte");if(error)throw error;await sb.auth.signOut().catch(()=>{});acUser=null;
   const was=PREM.on&&PREM.src==="compte";localStorage.removeItem(AC_PK);if(was)acReload("Compte supprimé");else toast("Compte supprimé");});}
}
/* Ligne de l'écran Réglages */
function acSetRow(){const on=PREM.on||acActive(),u=acUntil();
 const s=PREM.src==="ouvert"?"Phase de lancement : tout est ouvert":on&&u?`Abonnement actif jusqu'au ${acDate(u)}`:AC_ON()?(acHasSession()?"Version gratuite · code d'accès, abonnement":"Se connecter ou créer un compte"):"Bientôt : compte et abonnement";
 return `<div class="set-group"><span class="eyebrow">Compte</span><div class="list"><a class="li" href="#compte"><span class="ic tb-ic" style="--c:#123B4A">${QIC.shield}</span><span><span class="t">Mon compte</span><span class="s">${esc(s)}</span></span>${chev}</a></div></div>`;}
/* Prépare le client si une session existe (pour afficher l'adresse dans Mon compte) */
function acWarm(){if(AC_ON()&&acHasSession()&&!acSb)acLoad().then(()=>{if(route().v==="compte")render();}).catch(()=>{});}
