# Simulateur de moyenne universitaire

Petit outil local pour suivre une moyenne pondérée et estimer la note nécessaire à une prochaine évaluation. Le calcul utilise uniquement les notes et coefficients saisis ; il ne suppose aucune règle de compensation universitaire.

## Fonctionnalités

- Ajouter, modifier et supprimer des matières.
- Saisir une note sur 20 et un coefficient strictement positif.
- Calculer la moyenne pondérée et le total des coefficients.
- Simuler la note nécessaire pour atteindre une moyenne cible, avec indication si elle dépasse 20.
- Conserver les matières dans le stockage local du navigateur.
- Afficher les erreurs de saisie dans l’interface.

## Technologies

HTML, CSS et JavaScript, sans dépendance de compilation.

## Installation et lancement

La démonstration publiée est disponible à l’adresse [7amzvv.github.io/simulateur-moyenne](https://7amzvv.github.io/simulateur-moyenne/).

Pour l’utiliser localement, cloner le dépôt puis ouvrir `index.html` dans un navigateur récent. Les données restent dans le stockage local de ce navigateur.

Pour vérifier les calculs avec Node.js :

```sh
node tests/calculs.test.js
```

## Exemple

Ajoutez une matière avec 10/20 et coefficient 1, puis une autre avec 16/20 et coefficient 3. La moyenne pondérée obtenue est 14,5/20. Avec une prochaine évaluation de coefficient 2 et une cible de 15/20, la note nécessaire est 16/20.

## Organisation des fichiers

- `index.html` : structure de l’interface.
- `styles.css` : mise en page et adaptation aux petits écrans.
- `calculs.js` : fonctions de moyenne pondérée et de simulation.
- `app.js` : formulaires, affichage, validation et sauvegarde locale.
- `tests/calculs.test.js` : vérifications des calculs.

## Notions travaillées

Formulaires HTML, validation de saisies, événements JavaScript, DOM, stockage local, moyenne pondérée et tests de fonctions.

## Vérifications et limites

Les tests automatisés des calculs couvrent la moyenne pondérée, la liste vide, une cible atteignable, une cible déjà atteinte et une cible impossible. Sur la démonstration, l’ajout d’une matière, le calcul, la simulation d’une note nécessaire, l’objectif impossible et la persistance après rechargement ont été vérifiés. Le rendu desktop a été contrôlé. Le contrôle sur téléphone reste à faire. Le stockage est propre au navigateur et à l’appareil ; aucune synchronisation n’est fournie. La simulation traite la prochaine note comme une évaluation supplémentaire pondérée par son coefficient.

## Crédit

Projet réalisé par Hamza FADLI.

