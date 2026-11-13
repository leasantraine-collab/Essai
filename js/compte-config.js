/* Carnet IFSI — connexion au service des comptes (Supabase).
   Ces deux valeurs sont publiques par conception : l'adresse du projet et sa clé « publishable » (ou « anon »),
   visibles dans Supabase › Project Settings › API. Ne jamais mettre ici la clé secrète (« secret » / « service_role »).
   Tant qu'elles sont vides, les comptes sont désactivés et l'appli reste entièrement ouverte. */
var SB_URL="",SB_KEY="";
/* Abonnement mensuel par carte (Stripe) : prix affiché, identique au prix créé dans Stripe, ex. "4,99 €".
   Vide : pas d'abonnement mensuel (codes d'accès seulement). L'achat se fait sur le site web, pas dans les applis
   Android et iPhone (règles des boutiques) : un abonné s'y connecte simplement avec son compte. */
var ABO_PRIX="";
