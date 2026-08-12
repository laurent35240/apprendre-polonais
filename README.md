# 🦬 Polski z Żubrem — apprendre le polonais (FR → PL)

Une petite app web perso pour apprendre le polonais façon Assimil + Duolingo,
avec Żubr le bison comme mascotte. Vocabulaire **et** grammaire, exercices
d'écoute et de prononciation, histoires bonus, progression sauvegardée et
synchronisée entre appareils, difficulté croissante et gamification (streak,
XP, objectif 30 min/jour, badges).

## ▶️ Lancer l'app

En ligne : **https://laurent-clouet.fr/apprendre-polonais/** (déployé
automatiquement à chaque push sur `main`, si les tests passent).

En local :

```bash
npm install
npm run dev      # → http://localhost:5173/apprendre-polonais/
```

⚠️ Note l'URL : à cause du `base` configuré pour le déploiement, la racine
`http://localhost:5173/` renvoie un 404. Vite affiche la bonne adresse au
démarrage. L'app est en modules ES : ouvrir `index.html` directement dans le
navigateur ne fonctionne pas, il faut passer par le serveur `npm run dev`.

```bash
npm test           # 353 tests (+ 10 it.skip volontaires), ~1,8 s
npm run typecheck  # vérification de types (JSDoc + tsc), doit valoir 0
npm run build      # → dist/
npm run preview    # sert dist/ sur http://localhost:4173/apprendre-polonais/
```

👉 **Utilise Google Chrome** pour profiter de tout :
- **Écoute** (synthèse vocale polonaise) : marche partout où une voix `pl-PL`
  est installée (Chrome en fournit une).
- **Prononciation** (reconnaissance vocale) : **Chrome uniquement**, avec micro
  autorisé et une connexion internet. Sur les autres navigateurs, ces exercices
  sont masqués (dégradation propre).

### 💾 Où vit ta progression

Elle est stockée dans le `localStorage` du navigateur (par origine), et
**synchronisée entre appareils** via un compte (lien magique par e-mail, sans
mot de passe) : une fois connecté, ta progression se fusionne automatiquement
entre tous les appareils où tu te connectes avec le même compte.

Sans compte, la progression reste locale à l'appareil et à l'origine
(`https://laurent-clouet.fr` ≠ `http://localhost:...`) ; l'export/import JSON
dans ⚙️ Réglages reste alors la seule façon de la transporter.

## 🎯 Comment ça marche

- **Parcours de 60 leçons** regroupées en **12 sentiers** de 5 leçons
  (chacun avec son nom et son emoji), qui se débloquent l'un après l'autre.
  Chaque leçon commence par une intro type Assimil (dialogue, notes de
  grammaire, vocabulaire avec audio), puis une session d'exercices.
- **Barre de recherche** sur l'accueil : retrouve une leçon par titre, thème,
  mot appris ou point de grammaire — y compris parmi les leçons pas encore
  déverrouillées.
- **Histoires bonus** : à la fin de certains sentiers, un court récit dialogué
  en scènes, chacune suivie d'une épreuve (QCM, reconstruction de phrase, mot
  manquant, appariement PL↔FR). Optionnelles — un sentier reste « Terminé »
  sans elles.
- **Types d'exercices** : QCM, écoute, saisie, reconstruction de phrase
  (banque de mots), texte à trous (grammaire), dialogue en contexte,
  prononciation (micro).
- **Répétition espacée** (système de Leitner) : les mots reviennent en révision
  au bon moment pour ne pas les oublier. Un bouton « Révisions du jour »
  apparaît sur l'accueil quand des mots sont dus.
- **Difficulté croissante** : les premières leçons privilégient la
  reconnaissance (QCM/écoute), les suivantes demandent de plus en plus de
  production (saisie, phrases, cas grammaticaux).
- **Gamification** : streak quotidien 🔥, XP ⚡ et niveaux 🎓, objectif de
  30 min/jour (anneau + bonus XP), et badges 🏆.

## 💾 Sauvegarde

Dans ⚙️ **Réglages** tu peux **exporter** ta progression en fichier `.json`
(backup) et la **réimporter** ensuite, te connecter pour activer la synchro
multi-appareils, ou tout réinitialiser.

## ✏️ Ajouter ou corriger du contenu

Tout le contenu pédagogique est dans **`data/lessons.js`** — c'est le seul
fichier à toucher pour la langue, aucun code à modifier.

- **Corriger** un mot / une traduction : édite les champs `pl` (polonais) et
  `fr` (français) directement.
- **Ajouter une leçon** : voir la procédure détaillée dans `CLAUDE.md`
  (§ Ajouter une leçon) — une leçon s'insère à sa place pédagogique, ce qui
  demande de renuméroter les `order` suivants.
- **Important** : garde les `id` **uniques et stables** (ex. `v-11-...`). C'est
  eux qui servent au suivi de progression ; renommer un `id` = perdre l'historique
  de ce mot.

Les histoires bonus sont dans **`data/stories.js`**, les badges dans
**`data/badges.js`** (emoji, titre, description, condition).

## 🎨 Images (mascotte, personnages & badges)

Les illustrations kawaii de Żubr, des autres personnages et des badges sont
des PNG transparents dans **`public/assets/img/`**. Elles ont été générées via
le plugin `google-image-gen` (Gemini) puis détourées par `tools/detourer.py`.
Si une image est absente, l'app **retombe automatiquement sur l'emoji**
correspondant — rien ne casse.

## 🗂️ Structure du projet

```
index.html                page + point d'entrée unique (module ES)
css/styles.css             thème fun, responsive, clair/sombre
public/assets/img/         illustrations kawaii (mascotte, personnages, badges, favicon)
public/manifest.json       « ajouter à l'écran d'accueil » sur téléphone
types/app.d.ts             déclarations de types (JSDoc, aucun fichier .ts)
tests/                      suite Vitest + instantané des ids (SRS keys)
data/lessons.js             ← LE CONTENU des leçons (à éditer)
data/stories.js             histoires bonus de fin de sentier
data/badges.js              définition des badges (emoji = repli si image absente)
js/state.js                 progression + sauvegarde (localStorage)
js/srs.js                   répétition espacée (Leitner)
js/speech.js                synthèse + reconnaissance vocale
js/gamification.js          XP, niveaux, streak, objectif, badges
js/progress.js              intentions de progression (seul chemin d'écriture)
js/cloud.js                 synchro multi-appareils (Firebase Auth + Firestore)
js/exercises.js             génération + correction des exercices
js/session.js               construction d'une session (nouveaux + révisions)
js/ui.js                    rendu, mascotte, toasts, confettis, sons
js/exercise-renderers.js    cycle de vie d'une session d'exercices, 19 renderers
js/config.js                clés de config Firebase
js/app.js                   contrôleur : écrans, navigation, accueil
```

L'ordre de chargement est porté par le **graphe d'imports ES**, pas par
l'ordre des balises `<script>` — voir `CLAUDE.md` § Architecture pour le DAG
complet.

Powodzenia ! (Bonne chance !) 🦬
