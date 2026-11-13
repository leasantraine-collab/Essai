# Comptes, abonnements et contenus réservés

Carnet IFSI a deux versions dans la même appli :

- **Gratuite**, sans compte :
  - les fiches récap de toutes les pathologies, de tous les soins et de toutes les classes de médicaments ;
  - un contenu complet par spécialité ou catégorie ;
  - 10 cartes de révision par jour et des partiels de 10 questions ;
  - le niveau 1 des calculs et un schéma à compléter par spécialité ;
  - les outils Repères et normes, Projet de soins guidé, Bloc-notes et Chrono ;
  - pour le stage : compte à rebours, infos du stage, check-list, sac, posture, objectifs et 2 guides de services.
- **Abonnés** (abonnement mensuel par carte, ou code d'accès) : tout le reste (cours détaillés, « Comprendre en images », vidéos, cartes et partiels sans limite, tous les calculs, carnet de suivi, feuilles de travail, tous les outils, fiches A4).

La répartition se règle dans deux fichiers :
- `www/js/premium.js`, objet `PR` : outils gratuits, nombre de cartes par jour, etc.
- `scripts/premium.js`, objet `KEEP` : ce que garde une fiche récap gratuite.

## Comment les contenus sont protégés

- Les sources complètes sont dans `contenus/`, hors du site publié.
- `node scripts/premium.js` génère deux choses :
  - les fichiers publiés de `www/js/contenus/`, qui ne contiennent que la partie gratuite ;
  - `www/premium/pack.js`, qui contient le reste, compressé puis chiffré.
- La clé de déchiffrement est stockée dans Supabase. Elle n'est remise qu'aux comptes dont l'abonnement est en cours, puis gardée sur l'appareil jusqu'à la fin de l'abonnement. Les contenus restent donc lisibles hors ligne.
- Le dépôt GitHub étant public, les sources de `contenus/` restent lisibles sur GitHub.

**Phase de lancement (état actuel)** :
- la clé est fournie à tout le monde, donc tout est ouvert ;
- `www/js/compte-config.js` est vide, donc les comptes sont désactivés.

## Mettre en route (une seule fois)

1. **Créer le projet** sur [supabase.com](https://supabase.com) :
   - cliquer sur *New project* ;
   - choisir une **région en Europe** (Paris ou Francfort) ;
   - noter le mot de passe de la base.
2. **Exécuter le script** :
   - ouvrir *SQL Editor* puis *New query* ;
   - coller tout le fichier `supabase/schema.sql` et cliquer sur *Run* ;
   - cela crée les abonnements, les codes d'accès et la clé des contenus.
3. **Régler l'authentification** dans *Authentication* :
   - *Sign In / Providers*, rubrique *Email* : activer l'option, laisser *Confirm email* coché et mettre la longueur minimale du mot de passe à 8.
   - *Email Templates*, modèle *Confirm signup* : remplacer le lien par le code, par exemple :
     `Votre code de confirmation Carnet IFSI : {{ .Token }}`
   - *Email Templates*, modèle *Reset password* :
     `Votre code pour choisir un nouveau mot de passe : {{ .Token }}`
   - L'appli demande ce code à 6 chiffres : il n'y a aucun lien à ouvrir, ce qui fonctionne aussi dans l'appli Android et sur iPhone.
   - *SMTP Settings* : le service d'e-mail fourni par Supabase n'envoie que quelques messages par heure et sert aux essais. Pour le lancement, brancher un service d'envoi, par exemple Brevo, dont l'offre gratuite permet environ 300 e-mails par jour.
4. **Transmettre l'adresse du projet et la clé publique** :
   - les trouver dans *Project Settings*, puis *API* : *Project URL* et clé *publishable* (ou *anon*) ;
   - ces deux valeurs sont publiques et vont dans `www/js/compte-config.js` ;
   - **ne jamais transmettre la clé secrète** (*secret* ou *service_role*) dans un message.
5. **Fermer les contenus réservés** :
   - `scripts/premium.js` chiffre le paquet avec la clé stockée dans Supabase, par exemple :
     `node scripts/premium.js --cle-fichier ~/cle-carnet.txt`
   - pour récupérer cette clé, lancer dans *SQL Editor* :
     `select valeur from public.secrets where nom = 'cle_contenus';`
   - la garder hors du dépôt, par exemple dans un gestionnaire de mots de passe ;
   - à partir de ce moment, seuls les abonnés ouvrent les contenus réservés.
6. Dans `www/js/qualite.js`, changer `QUAL_CGU_V` : le message d'accueil, avec les nouvelles conditions, réapparaît alors à chaque utilisateur.

## Abonnement mensuel par carte (Stripe)

L'abonnement se renouvelle automatiquement chaque mois, jusqu'à ce que l'abonné le résilie.
- **Résiliation :** en quelques clics, depuis Réglages › Mon compte › Gérer mon abonnement. Elle prend effet à la fin du mois payé.
- **Paiement :** sur la page sécurisée de Stripe. La carte, les factures et la résiliation passent par l'espace client Stripe.
- **Le serveur :** deux fonctions Supabase.
  - `supabase/functions/paiement` ouvre la page de paiement ou l'espace client.
  - `supabase/functions/stripe-webhook` reçoit de Stripe les paiements, renouvellements, échecs et résiliations, et met à jour la date de fin d'accès.
- **Paiement refusé :** l'accès est gardé 3 jours de plus, le temps que Stripe retente le prélèvement.
- **Applis Android et iPhone :** l'achat se fait sur le site web, car les boutiques interdisent d'y vendre un abonnement payé ailleurs. Dans les applis, l'abonné se connecte simplement avec son compte, et les contenus s'ouvrent.

### Mise en place (une fois)

1. **Compte Stripe** sur [stripe.com](https://stripe.com) :
   - activer le compte : identité, SIRET, IBAN pour recevoir les paiements ;
   - tout tester d'abord en **mode test**, avec la carte 4242 4242 4242 4242.
2. **Produit et prix**, dans *Catalogue de produits* :
   - créer le produit « Carnet IFSI » avec un **prix récurrent mensuel**, par exemple 4,99 € ;
   - noter l'identifiant du prix (`price_…`).
3. **Conditions de vente**, dans *Paramètres*, puis *Informations publiques* : renseigner l'adresse des conditions d'utilisation, `https://…/Essai/#legal/cgu`. La page de paiement demande de les accepter, avec la demande d'accès immédiat.
4. **Espace client**, dans *Paramètres*, puis *Billing*, puis *Portail client* :
   - autoriser la résiliation, **« à la fin de la période de facturation »** ;
   - autoriser la mise à jour du moyen de paiement et l'historique des factures.
5. **Factures** :
   - en micro-entreprise sans TVA, ajouter dans le pied de facture la mention « TVA non applicable, art. 293 B du CGI » ;
   - activer l'envoi des reçus par e-mail.
6. **Fonctions Supabase**, dans *Edge Functions*, puis *Deploy a new function*, puis *Via Editor* :
   - créer `paiement` et y coller `supabase/functions/paiement/index.ts` ;
   - créer `stripe-webhook` et y coller `supabase/functions/stripe-webhook/index.ts` ;
   - pour `stripe-webhook`, **désactiver « Enforce JWT verification »** : Stripe n'a pas de compte, il signe ses envois et la fonction vérifie cette signature.
7. **Webhook**, dans Stripe, *Développeurs*, puis *Webhooks*, puis *Ajouter une destination* :
   - adresse : `https://<projet>.supabase.co/functions/v1/stripe-webhook` ;
   - événements : `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed` ;
   - noter le **secret de signature** (`whsec_…`).
8. **Secrets**, dans Supabase, *Edge Functions*, puis *Secrets* :

   | Nom | Valeur |
   |---|---|
   | `STRIPE_SECRET_KEY` | clé secrète Stripe (`sk_test_…`, puis `sk_live_…`) |
   | `STRIPE_PRICE_ID` | `price_…` |
   | `STRIPE_WEBHOOK_SECRET` | `whsec_…` |
   | `SITE_URL` | adresse du site web, par exemple `https://leasantraine-collab.github.io/Essai` |

9. **Dans l'appli** :
   - dans `www/js/compte-config.js`, mettre le prix affiché, identique à celui de Stripe : `var ABO_PRIX="4,99 €";` ;
   - dans `www/js/qualite.js`, objet `QUAL`, renseigner le **médiateur de la consommation**, obligatoire pour vendre à des particuliers.
10. **Essai complet en mode test**, avant de passer Stripe en mode réel avec les clés `live` :
    - s'abonner sur le site avec la carte 4242… : les contenus s'ouvrent ;
    - résilier dans « Gérer mon abonnement » : l'accès reste jusqu'à la fin du mois ;
    - avec la carte 4000 0000 0000 0341 : le paiement est refusé.

### Suivi

```sql
-- Abonnés mensuels et état
select u.email, a.stripe_statut, a.stripe_resilie, a.stripe_jusqu_au
from public.abonnements a join auth.users u on u.id = a.user_id
where a.stripe_abonnement is not null order by a.stripe_jusqu_au desc;
```

## Codes d'accès

Les commandes se lancent dans *SQL Editor*, avec les droits du propriétaire du projet. L'appli, elle, ne peut ni créer de codes ni les voir.

```sql
-- 20 codes d'un an, un compte chacun
select * from public.creer_codes(20, 365, 1, 'Rentrée 2027');

-- 1 code de 30 jours utilisable par 50 comptes, valable 60 jours (essai pour une promotion)
select * from public.creer_codes(1, 30, 50, 'Essai IFSI de Lyon', 60);

-- Offrir ou prolonger un abonnement directement
select public.offrir_jours('etudiante@exemple.fr', 30);

-- Suivi
select code, jours, utilisations, utilisations_max, note from public.codes order by cree_le desc;
select u.email, a.jusqu_au from public.abonnements a join auth.users u on u.id = a.user_id order by a.jusqu_au desc;
```

Un code utilisé ajoute ses jours à la fin de l'abonnement en cours, ou à partir d'aujourd'hui s'il n'y en a pas. Un même compte ne peut pas utiliser deux fois le même code.

## Modifier un contenu

1. Modifier la source dans `contenus/` (les cours, pathologies, soins, médicaments et images) ou dans `www/js/contenus/` pour les fichiers qui ne sont pas générés. Ne pas modifier à la main un fichier qui commence par « version publiée, générée par scripts/premium.js ».
2. Relancer le script, avec la même option que la dernière fois :
   - `node scripts/premium.js --ouvert` en phase de lancement ;
   - `node scripts/premium.js --cle-fichier …` une fois les contenus fermés.
   Le script vérifie qu'une fois le paquet ouvert, les données sont identiques aux sources ; il s'arrête en cas d'écart.
3. Relancer `node scripts/contenus-meta.js` (dates de mise à jour), puis `npx cap sync`.
