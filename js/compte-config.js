/* Carnet IFSI — connexion au service des comptes (Supabase).
   Ces deux valeurs sont publiques par conception : l'adresse du projet et sa clé « publishable » (ou « anon »),
   visibles dans Supabase › Project Settings › API. Ne jamais mettre ici la clé secrète (« secret » / « service_role »).
   Tant qu'elles sont vides, les comptes sont désactivés et l'appli reste entièrement ouverte. */
var SB_URL="",SB_KEY="";
