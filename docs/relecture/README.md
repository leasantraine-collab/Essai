# Relecture professionnelle des contenus

Ce dossier sert à organiser la relecture de Carnet IFSI par des infirmiers et des formateurs.

## Fichiers

- `liste-contenus.csv` : tous les contenus (fiches, cours, pathologies, soins, médicaments), classés par priorité. Il s'ouvre dans un tableur (séparateur point-virgule). Les colonnes `relu_par`, `date_relecture` et `remarques` sont à remplir.
  - Priorité 1 : sécurité du patient (médicaments, calculs, urgences, perfusions, transfusion, prélèvements).
  - Priorité 2 : soins, pathologies, examens, situations cliniques.
  - Priorité 3 : méthodologie, législation, stage, mémoire, vocabulaire, anatomie.
- Régénérer la liste et les dates de mise à jour après une modification des contenus : `node scripts/contenus-meta.js`.

## Relire depuis l'appli (mode relecteur)

1. Réglages › Qualité des contenus › indiquer son nom et sa fonction, puis activer le mode relecteur.
2. En bas de chaque contenu : « Relu, conforme » ou « À corriger » (avec la correction et sa source).
3. Réglages › Qualité des contenus › « Exporter mes relectures » : un tableur à envoyer à l'éditeur.

## Grille de relecture

Pour chaque contenu, vérifier :

1. **Exactitude** : définitions, valeurs normales, doses, seuils, délais.
2. **Actualité** : conforme aux recommandations en vigueur (HAS, ANSM, SF2H, sociétés savantes) et au RCP pour les médicaments.
3. **Sécurité du patient** : aucune information qui pourrait conduire à une erreur de soin ; vigilances et contre-indications présentes.
4. **Champ de compétence** : rôle propre et rôle prescrit conformes aux articles R4311-1 à R4311-15 du Code de la santé publique.
5. **Clarté** : compréhensible par un étudiant de 1re année, sans ambiguïté.
6. **Référentiel** : UE de rattachement cohérentes (2009 et 2026).

## Intégrer les relectures

Dans `www/js/qualite.js`, compléter `QUAL.relecteurs` (nom, titre, lieu d'exercice, domaines relus) et `QUAL.relu` (clé du contenu → `{par, le}`). Chaque contenu relu affiche alors « Relu par … le … ».

## Avant la mise en vente

Compléter dans `www/js/qualite.js` : `editeur`, `adresse`, `contact` (adresse qui reçoit les signalements), `directeur`, et `siret` si l'activité est déclarée. Les champs vides apparaissent en rouge « à compléter par l'éditeur » dans les mentions légales.
