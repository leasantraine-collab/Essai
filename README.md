# Carnet IFSI

Application de révision pour les étudiants en soins infirmiers (IFSI), disponible sur **Android**, **iPhone** et en **web installable**.

Elle reprend l'intégralité des contenus de l'artefact *Carnet IFSI* :

- **123 fiches** récap, dont 48 fiches complètes illustrées
- **16 cours complets** (chapitres, analogies, pièges, questions de vérification)
- **89 questions de quiz** expliquées
- **8 générateurs de calculs de dose** (énoncés illimités, correction pas à pas)
- **35 schémas** dessinés
- Préparation aux **stages** (check-list, posture, objectifs, 12 services)
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

## Structure

```
www/                 l'application (HTML/CSS/JS sans compilation)
  js/data.js         tous les contenus pédagogiques
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

## Modifier les contenus

Tout est dans `www/js/data.js` (fiches, cours, quiz, stages, UE) et `www/js/render.js` (schémas). Après une modification :

```bash
npx cap sync
```

## Icône et écran de démarrage

Sources dans `resources/`. Pour régénérer : `npm run assets`.

---

Contenus pédagogiques : vérifiez toujours avec vos cours et les protocoles de votre établissement.
