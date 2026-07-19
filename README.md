# 🦬 Polski z Żubrem — apprendre le polonais (FR → PL)

Une petite app web perso pour apprendre le polonais façon Assimil + Duolingo,
avec Żubr le bison comme mascotte. Vocabulaire **et** grammaire, exercices
d'écoute et de prononciation, progression sauvegardée, difficulté croissante et
gamification (streak, XP, objectif 30 min/jour, badges).

## ▶️ Lancer l'app

**Le plus simple : double-clique sur `index.html`.** Ça marche direct dans le
navigateur, sans rien installer.

👉 **Utilise Google Chrome** pour profiter de tout :
- **Écoute** (synthèse vocale polonaise) : marche partout où une voix `pl-PL`
  est installée (Chrome en fournit une).
- **Prononciation** (reconnaissance vocale) : **Chrome uniquement**, avec micro
  autorisé et une connexion internet. Sur les autres navigateurs, ces exercices
  sont masqués (dégradation propre).

*Option avancée (facultatif)* : servir le dossier via un petit serveur local
puis ouvrir http://localhost:8000 :
```bash
python3 -m http.server 8000
```

## 🎯 Comment ça marche

- **Parcours de 10 leçons** qui se débloquent l'une après l'autre. Chaque leçon
  commence par une intro type Assimil (dialogue, notes de grammaire, vocabulaire
  avec audio), puis une session d'exercices.
- **Types d'exercices** : QCM (mot → sens), écoute, saisie, reconstruction de
  phrase (banque de mots), texte à trous (grammaire), prononciation (micro).
- **Répétition espacée** (système de Leitner) : les mots reviennent en révision
  au bon moment pour ne pas les oublier. Un bouton « Révisions du jour »
  apparaît sur l'accueil quand des mots sont dus.
- **Difficulté croissante** : les premières leçons privilégient la
  reconnaissance (QCM/écoute), les suivantes demandent de plus en plus de
  production (saisie, phrases, cas grammaticaux).
- **Gamification** : streak quotidien 🔥, XP ⚡ et niveaux 🎓, objectif de
  30 min/jour (anneau + bonus XP), et badges 🏆.
- **Progression sauvegardée** localement (localStorage du navigateur). Pense à
  toujours ouvrir l'app de la **même façon** (même double-clic, ou toujours via
  le serveur local) : la sauvegarde est liée à l'adresse d'ouverture.

## 💾 Sauvegarde

Dans ⚙️ **Réglages** tu peux **exporter** ta progression en fichier `.json`
(backup) et la **réimporter** ensuite — pratique pour changer d'ordinateur ou de
mode d'ouverture. Il y a aussi un bouton pour tout réinitialiser.

## ✏️ Ajouter ou corriger du contenu

Tout le contenu pédagogique est dans **`data/lessons.js`** — c'est le seul
fichier à toucher pour la langue, aucun code à modifier.

- **Corriger** un mot / une traduction : édite les champs `pl` (polonais) et
  `fr` (français) directement.
- **Ajouter une leçon** : copie un bloc `{ id: "lesson-XX", order: XX, ... }`,
  donne-lui un `id` et un `order` uniques, et remplis `vocabulary` / `sentences`
  / `grammarNotes`.
- **Important** : garde les `id` **uniques et stables** (ex. `v-11-...`). C'est
  eux qui servent au suivi de progression ; renommer un `id` = perdre l'historique
  de ce mot.

> ⚠️ Le contenu des 10 leçons de départ a été rédigé automatiquement et **mérite
> une relecture** (idéalement avec une personne polonophone) : la grammaire
> polonaise est riche (cas, aspect…) et quelques formulations peuvent être
> ajustées. Le format est fait pour corriger vite.

Les badges sont dans **`data/badges.js`** (emoji, titre, description, condition).

## 🗂️ Structure du projet

```
index.html            page + ordre de chargement des scripts
css/styles.css         thème fun, responsive, clair/sombre
data/lessons.js        ← LE CONTENU des leçons (à éditer)
data/badges.js         définition des badges
js/state.js            progression + sauvegarde (localStorage)
js/srs.js              répétition espacée (Leitner)
js/speech.js           synthèse + reconnaissance vocale
js/gamification.js     XP, niveaux, streak, objectif, badges
js/exercises.js        génération + correction des exercices
js/session.js          construction d'une session (nouveaux + révisions)
js/ui.js               rendu, mascotte, toasts, confettis, sons
js/app.js              contrôleur : écrans et navigation
```

Powodzenia ! (Bonne chance !) 🦬
