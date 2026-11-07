# Carnet IFSI

Application de révision pour les étudiants en soins infirmiers (IFSI), disponible sur **Android**, **iPhone** et en **web installable**.

Elle reprend l'intégralité des contenus de l'artefact *Carnet IFSI* et les complète pour couvrir toutes les UE des référentiels 2009 et 2026 :

- **197 fiches** récap, dont 116 fiches complètes illustrées
- **32 cours complets** (chapitres, analogies, pièges, questions de vérification)
- **195 questions de quiz** expliquées et 15 cas cliniques
- **11 générateurs de calculs de dose** (débits, PSE, insuline, mg/kg/h, dilutions…)
- **35 schémas** dessinés
- Préparation aux **stages** : check-list, posture, objectifs, **18 services**
- **Carnet de suivi de stage** personnalisé selon le lieu : journal de bord, pathologies et traitements du service à cocher, mémo (médicaments, sigles), soins réalisés (observé, avec aide, seul), objectifs, auto-évaluation des compétences, points d'étape, bilans, situations, feuille d'heures, impression (carnet rempli ou vierge, fiches patient)
- **Comptes à rebours** des partiels et du stage, **sauvegarde et restauration** des données
- Programme par **UE** : référentiels 2026 (1re année) et 2009 (2e et 3e années), S1 à S6

## Ce qui change par rapport à l'artefact

- Design sobre : palette bleu pétrole / papier, titres en Source Serif, texte en Inter, mode sombre soigné
- Navigation en 5 onglets : Accueil, Réviser, S'entraîner, Stages, Programme
- Tableau de bord de progression, reprise du dernier contenu ouvert
- Recherche plein texte dans toutes les fiches et tous les cours
- Favoris, quiz express (10 questions), révision de ses erreurs
- Réglages : thème auto/clair/sombre, taille du texte, référentiel
- Fonctionne **hors ligne**, polices embarquées, aucune donnée envoyée
- Retour matériel Android, retour haptique, barre d'état adaptée au thème
- Notifications de rappel (planning, tâches, partiels, stage, mémoire, résumé du jour, minuteur), voir plus bas
- Cartes de révision à répétition espacée (plus de 8 500 cartes créées automatiquement à partir des contenus)
- Partiels blancs chronométrés et notés sur 20, niveaux de calculs de doses et épreuve blanche « 10 calculs en 30 min »
- Progression par UE, par compétence (2009) ou par domaine (2026)
- Export PDF du carnet de stage, du parcours et des feuilles de travail ; exemples rédigés (recueil, projet de soins, analyse de pratique)
- Confiance : date de mise à jour et références officielles sur chaque contenu, signalement d'erreur, mode relecteur, mentions légales, CGU, confidentialité

## Structure

```
www/                 l'application (HTML/CSS/JS sans compilation)
  js/data.js         contenus d'origine de l'artefact
  js/contenus/       contenus ajoutés (anatomie, pathologies, soins, médicaments,
                     sciences humaines, quiz et cas, stages, calculs)
  js/render.js       rendu des fiches, cours et schémas
  js/app.js          navigation, vues, progression, réglages
  css/content.css    styles des contenus
  css/app.css        système visuel de l'appli
android/  ios/       projets natifs Capacitor
resources/           sources de l'icône et de l'écran de démarrage
```

## Essayer dans le navigateur

```bash
npm install
npm run serve        # puis ouvrir http://localhost:8080
```

## Android

Prérequis : Android Studio.

```bash
npm install
npx cap sync android
npx cap open android   # puis Run ▶ sur un téléphone ou un émulateur
```

Un APK de test est aussi construit automatiquement par GitHub Actions (onglet *Actions* → *Android APK* → artefact `carnet-ifsi-debug-apk`).
Pour publier sur le Play Store : *Build → Generate Signed App Bundle* dans Android Studio, puis envoi de l'`.aab` dans la Play Console (compte développeur : 25 $ une fois).

## iPhone

Prérequis : un Mac avec Xcode.

```bash
npm install
npx cap sync ios
npx cap open ios       # choisir son équipe dans Signing & Capabilities, puis Run ▶
```

Pour l'App Store : *Product → Archive* puis envoi via l'Organizer (compte Apple Developer : 99 $/an).

Sans Mac, la version web s'installe sur l'iPhone : ouvrir le site dans Safari → Partager → *Sur l'écran d'accueil*.

## Notifications

Les rappels sont calculés sur l'appareil par `www/js/notifs.js` (Réglages › Notifications).

- **Android et iPhone** : notifications locales programmées avec `@capacitor/local-notifications` ; elles arrivent même appli fermée. Au plus 60 rappels sont programmés à l'avance (limite d'iOS), reprogrammés à chaque ouverture et à chaque modification. Sur Android 13 et plus, l'autorisation est demandée au premier « Activer » ; deux canaux sont créés (*Rappels*, *Minuteur*), avec la petite icône `android/app/src/main/res/drawable/ic_stat_carnet.xml`. Après une mise à jour du dépôt : `npm install` puis `npx cap sync`.
- **Web** : le navigateur ne peut pas réveiller une page à heure fixe sans serveur d'envoi. Les rappels s'affichent quand l'appli est ouverte ou en arrière-plan, ceux manqués à la réouverture, et via la synchronisation périodique du service worker quand le navigateur la propose (Chrome Android, appli installée). Sur iPhone, il faut d'abord ajouter le site à l'écran d'accueil.
- L'export `.ics` du planning contient les mêmes alarmes : l'agenda du téléphone prévient alors même sans l'appli.

## Avant la mise en vente

- Compléter l'éditeur, l'adresse, le contact et le directeur de publication dans `www/js/qualite.js` (objet `QUAL`) : les champs vides apparaissent en rouge dans les mentions légales.
- Faire relire les contenus : voir `docs/relecture/README.md` (liste priorisée, grille de relecture, mode relecteur dans l'appli).
- Après une modification des contenus : `node scripts/contenus-meta.js` (dates de mise à jour et liste de relecture).

## Modifier les contenus

Les contenus sont dans `www/js/data.js` et `www/js/contenus/*.js` (fiches, cours, quiz, stages, UE), les schémas dans `www/js/render.js`. Un nouveau fichier de contenus doit être ajouté dans `www/index.html` et `www/sw.js`. Après une modification :

```bash
npx cap sync
```

## Icône et écran de démarrage

Sources dans `resources/`. Pour régénérer : `npm run assets`.

---

Contenus pédagogiques : vérifiez toujours avec vos cours et les protocoles de votre établissement.
