# 🦬 Polski z Żubrem — apprendre le polonais (FR → PL)

Une petite app web perso pour apprendre le polonais façon Assimil + Duolingo,
avec Żubr le bison comme mascotte. Vocabulaire **et** grammaire, exercices
d'écoute et de prononciation, progression sauvegardée, difficulté croissante et
gamification (streak, XP, objectif 30 min/jour, badges).

## ▶️ Lancer l'app

En ligne : **https://laurent-clouet.fr/apprendre-polonais/** (déployé
automatiquement à chaque push sur `main`, si les tests passent).

En local, il faut désormais un build — le double-clic sur `index.html` ne
fonctionne plus, les scripts sont des modules ES chargés par Vite :

```bash
npm install
npm run dev      # → http://localhost:5173/apprendre-polonais/
```

⚠️ Note l'URL : à cause du `base` configuré pour le déploiement, la racine
`http://localhost:5173/` renvoie un 404. Vite affiche la bonne adresse au
démarrage.

```bash
npm test         # 80 assertions, ~1 s
npm run typecheck  # vérification de types (JSDoc + tsc), doit valoir 0
npm run build    # → dist/
npm run preview  # sert dist/ sur http://localhost:4173/apprendre-polonais/
```

👉 **Utilise Google Chrome** pour profiter de tout :
- **Écoute** (synthèse vocale polonaise) : marche partout où une voix `pl-PL`
  est installée (Chrome en fournit une).
- **Prononciation** (reconnaissance vocale) : **Chrome uniquement**, avec micro
  autorisé et une connexion internet. Sur les autres navigateurs, ces exercices
  sont masqués (dégradation propre).

### 💾 Où vit ta progression

Elle est stockée dans le `localStorage` du navigateur, **par origine**. Or
`file://`, `http://localhost:5173`, `http://localhost:4173` et
`https://laurent-clouet.fr` sont **quatre origines distinctes** : une
progression faite en local n'apparaîtra pas en ligne, et inversement.

Le chemin de migration est l'export/import JSON dans ⚙️ Réglages. C'est aussi
la seule sauvegarde qui existe aujourd'hui — une synchro multi-appareils
(Firebase) est prévue plus tard.

## 🎯 Comment ça marche

- **Parcours de 40 leçons** qui se débloquent l'une après l'autre. Chaque leçon
  commence par une intro type Assimil (dialogue, notes de grammaire, vocabulaire
  avec audio), puis une session d'exercices.
- **Parcours en « sentiers »** : les leçons sont regroupées par paquets de 5
  (chacun avec son nom et son emoji 🌱🏡🍂🏙️🎓), repliables/dépliables. Seul le
  sentier de la leçon en cours est ouvert par défaut (les autres sont repliés),
  et une ligne de sentier relie visuellement les leçons. Un bouton **« Reprendre »**
  en haut du parcours déplie le bon sentier et t'amène directement à ta leçon
  en cours.
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
- **Progression sauvegardée** localement (localStorage du navigateur), liée à
  l'origine — voir « Où vit ta progression » plus haut.

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

## 🎨 Images (mascotte & badges)

Les illustrations kawaii de Żubr et des badges sont des PNG dans
**`public/assets/img/`**
(`zubr-base/happy/sad/celebrate.png`, `badge-<id>.png`, `favicon.png`). Elles ont
été générées via le plugin `google-image-gen` (Gemini). Si une image est absente,
l'app **retombe automatiquement sur l'emoji** correspondant — rien ne casse. Pour
changer une illustration, remplace simplement le PNG (fond transparent, carré).

## 🗂️ Structure du projet

```
index.html             page + point d'entrée unique (module ES)
css/styles.css         thème fun, responsive, clair/sombre
public/assets/img/     illustrations kawaii (mascotte Żubr + badges + favicon)
public/manifest.json   « ajouter à l'écran d'accueil » sur téléphone
types/app.d.ts         déclarations de types (JSDoc, aucun fichier .ts)
tests/                 80 assertions Vitest + instantané des 647 ids
data/lessons.js        ← LE CONTENU des leçons (à éditer)
data/badges.js         définition des badges (emoji = repli si image absente)
js/state.js            progression + sauvegarde (localStorage)
js/srs.js              répétition espacée (Leitner)
js/speech.js           synthèse + reconnaissance vocale
js/gamification.js     XP, niveaux, streak, objectif, badges
js/exercises.js        génération + correction des exercices
js/session.js          construction d'une session (nouveaux + révisions)
js/ui.js               rendu, mascotte, toasts, confettis, sons
js/app.js              contrôleur : écrans et navigation
```

L'ordre de chargement n'est plus porté par `index.html` mais par le **graphe
d'imports ES** : `lessons → badges → state → srs → speech → gamification →
exercises → session → ui → app`.

Powodzenia ! (Bonne chance !) 🦬
