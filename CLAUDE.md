# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Langue** : réponds toujours en français dans ce projet, sauf demande explicite contraire de l'utilisateur.

## Running the app

```bash
npm install
npm run dev        # http://localhost:5173/apprendre-polonais/  (PAS la racine /)
npm test           # 353 tests (+ 10 it.skip volontaires), ~1,8 s
npm run typecheck  # tsc --noEmit, DOIT valoir 0
npm run build      # dist/
npm run preview    # http://localhost:4173/apprendre-polonais/
```

Le `base` de `vite.config.js` vaut `/apprendre-polonais/` (chemin de
déploiement) : `http://localhost:5173/` renvoie donc un 404, c'est normal.
Le double-clic sur `index.html` ne fonctionne pas : l'app est en modules ES,
il faut le serveur `npm run dev`.

Chrome is required for speech recognition. TTS works anywhere with a `pl-PL` voice installed.

Déployé sur https://laurent-clouet.fr/apprendre-polonais/ par
`.github/workflows/deploy.yml` à chaque push sur `main`, si les tests passent.
Pages est configuré en **Source = GitHub Actions** (et non « deploy from a
branch » : la racine du repo n'est plus servable directement).

## Architecture

Vanilla JS en **modules ES**, bundlé par Vite. **Une dépendance runtime** —
`firebase` (palier 4, synchro multi-appareils) — plus 4 devDependencies (vite,
vitest, happy-dom, typescript). Chaque module exporte une façade nommée
(`export const State = {…}`), et `js/app.js` est le point d'entrée unique
déclaré dans `index.html` — **l'ordre de dépendances est porté par le graphe
d'imports**, plus par l'ordre des balises `<script>`.

Le graphe est un DAG strict : `lessons → stories → badges → state → srs →
speech → gamification → progress → cloud → exercises → session → ui →
exercise-renderers → app`. `js/config.js` (secrets Firebase) n'a aucune
dépendance et n'est importé que par `app.js`. Il n'y a **pas** de cycle State
⇄ Gamification (Gamification → State : 14 références, l'inverse : 0), et
`js/progress.js` est un module séparé **précisément pour ne pas en créer un**
(il doit créditer l'XP et toucher les badges, ce que `state.js` ne peut pas) ;
la logique de streak est dupliquée entre `state.js rolloverDay()` et
`gamification.js touchActivity()`, ce qui peut donner l'illusion d'un cycle.
`js/cloud.js` obéit à la même contrainte de DAG que `progress.js` : il a
besoin de `State`/`Progress`, jamais l'inverse, et n'importe pas `ui.js` (il
renvoie des faits, `app.js` décide des toasts). `js/exercise-renderers.js`
porte tout le cycle de vie d'une session d'exercices (déroulé
question→réponse→feedback→suite et les 19 renderers par type) ; il reçoit
`renderHome`/`updateHeader`/`renderSummary` via un `init()` plutôt que par
import pour rester en aval du DAG, `app.js` restant l'unique module qui
importe dans les deux sens.

**Assets** : `public/assets/img/` est copié verbatim par Vite (pas de hachage),
parce que `js/ui.js` construit ses chemins d'images par concaténation — donc
invisibles à l'analyse statique. Ils sont préfixés par `import.meta.env.BASE_URL`
pour rester absolus. `tests/assets-paths.test.js` vérifie que chaque chemin
produit correspond à un fichier réel sur disque. `assets/gen/` (15 Mo de
sources brutes, gitignoré, un nom par image finale) reste volontairement hors
de `public/`.

Les images sont des stickers kawaii générés (Gemini, plugin `google-image-gen`)
sur fond vert chroma, puis détourés en PNG transparents par **`tools/detourer.py`**
— le seul Python du dépôt, et il y est parce qu'il a été perdu deux fois en
vivant dans un dossier temporaire. Il n'entre **ni dans le build ni dans la CI**
(outil d'atelier, lancé à la main), et s'exécute avec l'interpréteur du plugin,
qui embarque Pillow : `cd $PLUGIN && uv run python tools/detourer.py <src> <dst>
512`. Son en-tête documente pourquoi un floodfill nu ne suffit pas (le liseré
vert d'anti-aliasing, encore visible sur `zubr-head.png`).

## Tests

`npm test` — Vitest, environnement `happy-dom` (nécessaire : `js/speech.js` lit
`window` au niveau module). `TZ` est figée à `Europe/Paris` dans la config car
`State.todayStr()` utilise l'heure locale et la CI tourne en UTC.

`tests/data-invariants.test.js` vérifie ce que TypeScript ne peut pas exprimer
(unicité des 947 ids, « exactement une ligne `target` » par dialogue,
`wordBank ⊇ mots(pl)`, clés étrangères `grammarFocus`…). Ses **10 `it.skip`**
documentent des invariants qui échouent aujourd'hui : c'est de la dette
assumée, avec le chiffre exact et la raison en commentaire. Ne pas les
« réparer » sans décision produit — notamment `[VOULU] le tableau est trié par
order`, qui doit rester rouge.

`tests/fixtures/item-ids.json` fige les 947 ids. Ce sont les **clés SRS en
localStorage** : renommer un id efface la progression de l'utilisateur sur ce
mot, et ce fichier rend l'accident visible en revue.

## Typage

**Aucun fichier `.ts`** : le typage se fait par JSDoc, avec les déclarations
ambiantes de `types/app.d.ts` (référençables sans `import`) et `tsc --noEmit`
comme porte de revue. `checkJs` est **faux** dans `tsconfig.json` : le typage est
en **opt-in** par `// @ts-check` en tête de fichier. Les 10 fichiers de `js/` et
`data/` l'ont ; les tests non (26 erreurs de la famille `.find()` → `T |
undefined`, et JSDoc n'a pas d'opérateur `!` — chaque site coûterait un cast
illisible).

`npm run typecheck` **doit valoir 0** en permanence et tourne en CI.
`npm run typecheck:preview` force `checkJs` partout : c'est le tableau de bord du
reste à faire, jamais bloquant.

⚠️ **`tsc` ne doit JAMAIS entrer dans le chemin du build ni du déploiement.**
`noEmit` est actif, il n'y a aucun hook `prebuild`, et `typecheck` est absent de
`deploy.yml` : le typage bloque la PR, pas la livraison d'un site statique. Ne
jamais écrire `"build": "tsc --noEmit && vite build"`.

Deux points de conception à ne pas « simplifier » :
- `UI.el` est **génériqué sur le nom de balise** (`@template K extends keyof
  HTMLElementTagNameMap`), donc `el("input", …)` rend un `HTMLInputElement` et
  `.value` est typé chez l'appelant sans cast. C'est ce qui a supprimé 18 erreurs
  sans toucher un seul site d'appel.
- `ListenExercise` **omet volontairement `revealText`**, et `PersistedState` type
  `items`/`lessons` en `Record<string, T | undefined>` (ça vient d'un JSON
  utilisateur non validé). Ces deux omissions sont des mécanismes de détection,
  pas des oublis.

Le dispatch de `renderExercise` est un `switch` avec un `default` en `never` :
**ajouter un type d'exercice sans écrire son renderer est une erreur de
compilation**. Ne pas le retransformer en `if/else`, qui ne narrow pas.

## Persistance

Tout l'état utilisateur vit sous **une seule clé** `polski-zubr-v1` dans
`localStorage`. `js/state.js` en est le seul propriétaire.

**Le contrat, en un test** : `tests/state-load.test.js` fait `load()` → `save()`
→ relit et exige l'**égalité octet pour octet** après tri des clés, sur une
fixture dérivée d'une vraie sauvegarde. Un champ ajouté, retiré, réordonné,
arrondi ou re-typé le fait rougir. C'est un test de **caractérisation** : il
était vert avant le durcissement et n'a jamais été modifié. S'il rougit, ce
n'est presque jamais la fixture qui a tort.

**Chaîne de lecture, dans cet ordre imposé** : `readVersion` → `runMigrations` →
`validate`. Une migration doit recevoir la forme de *sa* version d'origine, pas
une forme déjà « réparée » vers le schéma courant — sinon la validation
détruirait les champs anciens qu'elle est censée lire.

- `readVersion` est **tolérante** : absente, non numérique, non finie ou < 1 →
  1. Toutes les sauvegardes existantes valent 1, et une version poubelle ne doit
  pas enfermer l'utilisateur en lecture seule.
- `runMigrations(loaded, migrations, target)` est **pure et paramétrée** : elle
  ne lit ni `CURRENT_VERSION` ni `MIGRATIONS`, ce qui permet de tester la
  mécanique avec des migrations factices alors que `MIGRATIONS` est **vide** et
  que `CURRENT_VERSION` vaut **1**. Ne pas incrémenter « pour tester » :
  ça invaliderait les exports existants.
- `validate()` **copie par liste blanche** les 9 clés connues et **répare champ
  par champ** en journalisant dans `State.status().repairs`. Réparer et non
  rejeter : sur un seul champ corrompu, rejeter en bloc détruirait 10 750 XP et
  29 leçons. Une seule exception où le rejet est juste — racine non-objet
  ordinaire, où il n'y a rien à sauver.
  ⚠️ **`typeof x === "object"` ne suffit pas, il faut exclure les tableaux**
  (`isPlainObject`). `{"items": []}` était une perte totale *sans aucun
  symptôme* : un tableau est truthy, il accepte les clés string, l'app se
  comportait normalement — mais `JSON.stringify` ignore les propriétés
  non-indicielles, donc chaque `save()` réécrivait `{"items":[]}`.
- `repairs` doit être **vide** sur une sauvegarde saine. C'est le test qui
  garantit qu'on ne « répare » pas de la donnée valide.

**Version future → lecture seule.** `version > CURRENT_VERSION` lève
`FutureVersionError` : `readOnly` passe à vrai et est lu **au sommet de
`save()`**, pas aux sites d'appel — sinon la première chose que fait `load()`
(via `rolloverDay()`) serait d'écraser. `exportJSON()` renvoie alors le **texte
brut original**, octet pour octet : seule façon de ne pas rétrograder la
sauvegarde en la faisant passer par la sérialisation. L'écran dédié doit garder
ses trois issues (exporter, recharger, repartir de zéro) — ne jamais enfermer
l'utilisateur dehors.

**Écritures.** `scheduleSave()` est un **throttle et non un debounce** : il ne
**réarme jamais** un timer en vol (fenêtre 3 s). Un debounce ne réduirait rien
sur le chronomètre, dont les ticks sont espacés bien au-delà de la fenêtre.
Budget mesuré : **21 écritures** pour une session de 20 exercices, contre ~70
avant. Le plancher est d'une écriture par réponse et c'est sémantiquement juste
— les fusionner exigerait une fenêtre ≥ 15 s, donc jusqu'à 15 s de perte sur
crash. Deux exceptions qui `flush()` immédiatement : `rolloverDay()` (un crash à
00 h 00 min 05 s ferait perdre un jour de streak) et la fin d'une leçon.

Flush de sortie sur **`visibilitychange`/hidden, `pagehide` et `freeze`** — il
doit d'abord **verser `pendingSec`** dans l'état, *puis* écrire. **Ne pas ajouter
`beforeunload`** : pas fiable sur mobile, et il désactive le bfcache.
⚠️ Corollaire à connaître en débogage : `localStorage.clear()` suivi d'un
`location.reload()` **ne remet pas à zéro** — le flush de sortie réécrit l'état
encore en mémoire. Injecter un état propre, ou recharger deux fois.

**Écrire dans l'état passe par `js/progress.js`**, jamais par `State.get()`.
Les 9 intentions (`answerRecorded`, `sessionFinished`, `storyAnswerRecorded`,
`storyFinished`, `timeSpent`, `dayRolledOver`, `pronunciationPerfect`,
`settingChanged`, `progressImported` /
`progressReset`) appliquent la mutation, déclarent les chemins via
`State.touch()` et programment l'écriture. `State.get()` reste pour les
**lectures**. L'invariant est verrouillé par un grep sur `app.js` dans
`tests/progress.test.js`, pas par convention.

Chaque intention **relit `State.get()`** au lieu de capturer une référence :
`reset()` et `importJSON()` **remplacent** l'objet d'état, donc un `var s =
State.get()` capturé au rendu deviendrait orphelin. C'est structurel, pas une
précaution.

`State.dirtyPaths()` fait de l'ensemble d'écriture une **spécification
exécutable** : `expect(State.dirtyPaths()).toEqual(["settings"])` dit « un
réglage ne touche jamais aux items ».

**Import : refuser, pas réparer** — asymétrie assumée avec `load()`, où réparer
est le bon réflexe puisqu'on n'a rien d'autre, alors qu'à l'import
l'utilisateur a une donnée à protéger et une action à réessayer.
`previewImport()` valide **sans rien modifier**, pour que la confirmation puisse
chiffrer les deux côtés.

**Champs morts, conservés volontairement** (annotés dans `types/app.d.ts`) :
`version` hors lecture initiale, `profile.createdAt`, `streak.longest`, et
`items[].seenCount` / `correctCount` / `lastSeen` — ces trois derniers pèsent
~60 % de `items`. Les retirer changerait la forme persistée ; c'est le prix
assumé de la sûreté.

⚠️ **Ne pas retirer `var state = defaultState()`** (`state.js`) : `js/speech.js`
appelle `loadVoices()` au **niveau module**, donc avant `State.load()`, et lit
`settings.voiceName`. Ce n'est pas une élégance, c'est ce qui empêche un crash
au chargement.

Les fixtures sont ancrées sur **`2026-03-02T12:00:00`** (la même date que
`tests/srs.test.js` — une seule date magique dans le dépôt), midi local parce
que `todayStr()` est local. Les corruptions ne sont **pas** des fichiers
séparés : `tests/state-corruption.test.js` **empoisonne la fixture réaliste**,
ce qui permet d'asserter que les sous-arbres sains ont *survécu*.
`tests/fixtures/README.md` porte la recette de dérivation. La vraie sauvegarde
n'est **pas** commitée (dépôt public) ; `.gitignore` couvre
`polski-zubr-sauvegarde*.json` et `*.local.test.js`.

**Data flow**: `data/lessons.js`, `data/stories.js` and `data/badges.js` export `POLISH_LESSONS` / `POLISH_STORIES` / `POLISH_BADGES` → les modules JS les importent → `app.js` is the top-level controller.

**Module responsibilities:**
- `js/state.js` — all user progression, persisted to `localStorage` under key `polski-zubr-v1` (cf. § Persistance)
- `js/progress.js` — les 9 **intentions** de progression : le seul chemin d'écriture dans l'état
- `js/cloud.js` — synchro multi-appareils (Firebase, cf. § Synchronisation) : auth par lien magique, push/pull Firestore
- `js/srs.js` — Leitner spaced-repetition scheduling (box 0–5, due dates)
- `js/speech.js` — Web Speech API wrappers (TTS + recognition)
- `js/gamification.js` — XP, levels, streak, daily goal (30 min), badge checks
- `js/exercises.js` — exercise generation and answer checking for all types (MCQ, listen, type, word-bank/build, fill-in/cloze, pronunciation, dialogue) + les 4 épreuves d'histoire (cf. § Histoires bonus)
- `js/session.js` — builds a session array mixing new items + due SRS reviews ; `buildStorySession` pour les histoires (ordre du récit, sans révisions)
- `js/ui.js` — DOM helpers, mascotte, toasts, confetti, sounds
- `js/exercise-renderers.js` — le cycle de vie complet d'une session d'exercice (state machine + les 19 renderers par type, cf. § Architecture)
- `js/config.js` — clés de config Firebase (`FIREBASE_CONFIG`), aucune dépendance
- `js/app.js` — screen navigation, home screen (sentiers, recherche de leçons), DOMContentLoaded boot

**Home screen — lesson grouping (`js/app.js`):** the home path groups lessons into "sentiers" (packs of 5) via `trailNode()`. Lessons are iterated **sorted by `order`** (`sortedLessons()` / `byOrder`), not array order — `order` is the display sequence and does not match `id`. **`order` is the single source of truth for sequencing**: both the home display (`app.js`) and the unlock chain (`js/state.js` `ensureLessonStatuses`) sort by `order`, so the physical position of a lesson block in the `POLISH_LESSONS` array is irrelevant — new lessons can be appended anywhere and just need a unique `order`. `order` values must be unique; they need not be contiguous. Trail names + emojis live in the `TRAILS` array. By default only the trail holding the current lesson is expanded (`currentTrailIndex()` / `currentLessonId()` = first non-`completed`, non-`locked` lesson); manual expand/collapse is kept in the in-memory `trailOpenOverride` map (not persisted). The "Reprendre" button calls `jumpToCurrent()`, which opens the right trail, re-renders, then scrolls to the lesson node (`[data-lesson-id]`) and briefly adds `.lesson-node--highlight`. The connecting trail line is pure CSS (`.trail-body::before`, `css/styles.css`): it sits above card backgrounds but below the lesson badges (z-index), so badges must stay opaque — avoid `opacity` on the whole `.lesson-node` and avoid `transform` on hover (both would let the line show through / over the badge). Une **histoire bonus**
(`data/stories.js`) s'ajoute en dernière position du sentier qu'elle vise
(`storyForTrail` / `storyNode`) : elle ne compte **ni** dans le `doneCount`
affiché **ni** dans `currentTrailIndex` / `jumpToCurrent`, puisqu'elle est
optionnelle — un sentier reste « Terminé 🎉 » sans elle. Cf. § Histoires bonus.

**Recherche de leçons (`js/app.js`)** : barre de recherche sous « Ton
parcours », index mémoïsé (`buildLessonSearchIndex`, invalidé jamais car
`POLISH_LESSONS` est statique) sur titre, thème, vocabulaire (pl/fr) et
titres de `grammarNotes`. Le pliage diacritique (`foldText`) est
**volontairement séparé** de `Speech.normalize` (`js/speech.js`), qui
conserve les diacritiques polonais pour la correction de prononciation — un
contrat différent, pas une duplication accidentelle. Les leçons verrouillées
apparaissent dans les résultats (grisées, 🔒) mais un clic ne fait que
localiser la carte via `jumpToCurrent`, jamais ne l'ouvre.

## Synchronisation multi-appareils (palier 4)

Login par lien magique (Firebase Authentication, e-mail sans mot de passe) +
progression synchronisée via Firestore, un document par utilisateur (id =
`uid`), dans la collection `progress` — ou `progress-dev` en local
(`import.meta.env.DEV`, choisi par `app.js` et passé à `Cloud.init()`), pour
qu'un test en `npm run dev` ne pollue jamais les documents de prod. **Fusion
par item**, jamais « dernier qui
écrit gagne » sur le blob entier : chaque champ racine se fusionne par sa
propre règle, individuellement idempotente et commutative (`max`, union, OR),
sauf `settings`/`dailyGoal` où **`local` gagne toujours** par design —
préférences et compteurs propres à l'appareil, pas de la progression
partagée.

**La propriété qui fait tenir tout le reste** : `State._merge(s, s) === s`
pour tout champ hors `settings`/`dailyGoal`. C'est elle, combinée à la garde
de `Progress.cloudMerged` (ne `touch`/`flush` QUE si la fusion a réellement
changé quelque chose — comparaison par valeur avant/après), qui arrête la
boucle push→pull→push : un appareil qui reçoit sa propre écriture en retour
depuis Firestore la fusionne avec elle-même, ce qui ne change rien et ne
déclenche donc aucune nouvelle écriture ni aucun nouveau push. Le `writerId`
(identifiant d'onglet, dans chaque document poussé) et la fenêtre de grâce de
5 s dans `js/cloud.js` ne sont qu'une **économie** de calcul et de réseau
(reconnaître son propre écho pour l'ignorer sans même appeler `merge`) — leur
absence ne casserait rien, l'idempotence suffit à la correction.

| Champ | Règle |
|---|---|
| `items[id].box`, `.dueDate`, `.seenCount`, `.correctCount`, `.lastSeen` | `max`, champ par champ (pas l'objet gagnant en bloc) ; union des ids |
| `lessons[id].status` | rang max (`locked < available < inProgress < completed`) ; `ensureLessonStatuses()` ré-ouvre la suite après fusion |
| `lessons[id].bestScore` | `max` |
| `badges` | union dédupliquée |
| `flags.*` | OR logique |
| `profile.totalXP` | `max` des deux totaux + `XP_LESSON_BONUS` par leçon rattrapée côté gagnant (traçable et exact) |
| `profile.level` | recalculé après coup via `Gamification.addXP(0)`, jamais fusionné directement |
| `profile.createdAt` | `min` |
| `streak.current`/`.longest`/`.lastActiveDate` | `max` — ne régresse jamais visiblement |
| `dailyGoal.*`, `settings.*` | **`local` gagne toujours**, sauf `dailyGoal.goalMetToday` en OR |

**Limites acceptées, documentées plutôt que résolues** : l'XP de simples
bonnes réponses gagné sur l'appareil non retenu, sans compléter de leçon,
n'est pas récupéré par la fusion (aucune trace individuelle des réponses
n'existe — `seenCount`/`correctCount` sont déjà des champs morts, cf. §
Persistance). Le streak sous-estime la continuité réelle si l'usage alterne
d'un appareil à l'autre sans jamais synchroniser entre les deux. Reconstruire
l'un ou l'autre exigerait un historique d'événements que la forme persistée
ne porte pas — hors périmètre de ce palier, même sûreté qu'avec les champs
morts : on documente la dette plutôt que de complexifier pour la refermer
(un vector-clock à la place de `max`/union/OR a été explicitement écarté :
complexité disproportionnée pour un usage personnel à faible fréquence
d'écriture concurrente).

`mergeStates`/`State._merge` **ne tourne que sur deux états déjà validés à
`CURRENT_VERSION`** des deux côtés — jamais sur une forme non passée par
`validate()`. `State.mergeRemote(text)` est le miroir exact de `importJSON`
(même pipeline parse → plausibilité → migrate/validate) mais fusionne au lieu
d'écraser, et **ne sauvegarde pas elle-même** : c'est `Progress.cloudMerged`
qui décide du moment (jalon, flush immédiat comme `sessionFinished`).

`State.onSaved(callback)` est un petit registre d'observateurs, appelé après
chaque écriture locale réussie (jamais en lecture seule) : `js/cloud.js` s'y
abonne pour programmer un push Firestore débouncé, sans connaître le
mécanisme interne du throttle `localStorage`. Débounce réseau **séparé** du
débounce local — 30 s contre 3 s, un `setDoc` Firestore n'étant pas gratuit
comme un `setItem` — même discipline « jamais réarmé ». `onHide()` pousse en
plus un `Cloud.push()` best-effort **direct** (hors throttle) : ce dernier ne
tournerait jamais si l'onglet ferme avant son échéance.

Import manuel (`js/state.js importJSON`) et synchro cloud (`mergeRemote`) ne
doivent jamais être confondus dans le code : le premier REMPLACE
intentionnellement (l'utilisateur choisit d'écraser), le second FUSIONNE
toujours.

## Histoires bonus (niveaux de fin de sentier)

`data/stories.js` (`POLISH_STORIES`) porte un format distinct des leçons : un
court récit dialogué découpé en **scènes**, chaque scène étant suivie d'**une
épreuve** qui porte sur ce qui vient d'être lu. Une histoire est un **bonus
optionnel** rattaché à un sentier par `trailIndex` (index 0-based dans `TRAILS`)
et affichée en dernière position de ce sentier.

**Pourquoi un concept séparé et non une leçon de plus.** Trois contraintes
existantes l'imposent — ne pas essayer de les contourner :
1. `js/app.js` découpe les leçons triées en paquets **rigides de 5**
   (`TRAIL_SIZE`) : une leçon insérée décale tous les sentiers suivants et
   désynchronise les libellés du tableau `TRAILS`.
2. `tests/data-invariants.test.js` verrouille « 60 leçons », « `order` est
   exactement [1..60] » et « 947 item-ids, aucun renommé ».
3. `State.ensureLessonStatuses()` est une chaîne de déverrouillage **linéaire** :
   une histoire dedans bloquerait le sentier suivant.

Ces trois contraintes rendent une histoire impossible à modéliser en leçon,
mais elles ne rendent pas les leçons figées : **`order` est renumérotable**.
Le § « Ajouter une leçon » ci-dessous décrit la manœuvre.

**Le déverrouillage est CALCULÉ, jamais persisté.** `storyNode` (`js/app.js`)
regarde si les 5 leçons du sentier sont `completed`. Seule la **complétion** est
persistée, dans `state.lessons[storyId]` — la même map que les leçons, donc
**aucun changement de forme persistée** : `validate()` recopie les entrées par
`status`/`bestScore` sans connaître les ids, et la fusion cloud (rang max +
`max` sur `bestScore`) fonctionne déjà telle quelle.

⚠️ **L'entrée `lessons[storyId]` est créée PARESSEUSEMENT**, par
`Progress.storyFinished` uniquement — il n'existe volontairement pas
d'`ensureStoryStatuses()` appelée depuis `load()`. Sinon `load()` → `save()`
ajouterait une clé à toute sauvegarde existante et le test d'égalité **octet pour
octet** de `tests/state-load.test.js` rougirait à juste titre.

⚠️ **Les ids d'épreuve ne sont PAS des clés SRS.** `Exercises.buildIndex()` ne
parcourt que `POLISH_LESSONS`, donc `getEntry()` ne les résout pas et
`buildReviewSession` les ignorerait pour toujours : les enregistrer ne créerait
que du poids mort dans `localStorage` **et** dans le document Firestore. D'où
l'intention dédiée `Progress.storyAnswerRecorded` (XP seul), et
`Progress.storyFinished` qui n'appelle **pas** `ensureLessonStatuses()`. Les deux
choix sont verrouillés par `tests/progress.test.js`.

**Les 4 épreuves** (`step.kind` dans les données → `type` de l'exercice) :
`quiz` → `story-quiz` (QCM à **1 ou 2** bonnes réponses ; `answers` porte la
vérité, pas `answer`), `build` → `story-build` (reconstituer la réplique suivante
depuis des tuiles, réutilise `appendWordBankPicker`), `gap` → `story-gap`
(choisir le mot manquant parmi des tuiles — distinct du `cloze` des leçons, qui
est en saisie libre et choisit lui-même le mot caché), `match` → `story-match`
(relier PL↔FR, correction en **tout ou rien**). Les quatre partagent
`appendSceneContext` (`js/app.js`), qui affiche les répliques de la scène et les
lit à voix haute. `who` ∈ `{"Ż", "B", "N"}` — `"N"` est le **narrateur**, rendu
en pleine largeur (`.story-narrator`) et laissé sur la voix par défaut par
`ttsOptsFor`, sans quoi il parlerait comme Żubr.

`story-build` ne réutilise **pas** le type `dialogue` : dans un dialogue de leçon
la réplique cible est masquée *au sein* du contexte (`target: true`), alors qu'ici
la scène est entièrement visible et la réplique à produire s'y ajoute. Fusionner
les deux chargerait le renderer des leçons de cas qu'elles n'ont pas.

**Têtes de personnages.** `UI.characterImg(who, cls)` rend l'avatar d'un locuteur
depuis la table `CHARACTERS` de `js/ui.js` — convention de nommage
`<personnage>-head.png` dans `public/assets/img/`. Żubr **réutilise
`zubr-head.png`**, qui sert déjà d'icône PWA (même style, rien à dupliquer) ;
`bocian-head.png` a été généré avec Gemini en prenant le premier comme référence
de style. Ajouter un personnage se fait dans cette table, et nulle part ailleurs.

⚠️ `characterImg` rend **`null`** pour un `who` inconnu, donc pour le narrateur
`"N"`. Ce n'est pas un cas d'échec, c'est le mécanisme : combiné au fait que
`UI.el` ignore les enfants `null`, il donne au narrateur sa ligne pleine largeur
**sans qu'aucun renderer ait à tester `"N"`**. `tests/assets-paths.test.js` et
`tests/stories.test.js` verrouillent les deux moitiés de l'invariant (tout
locuteur ≠ `"N"` a une image, et `"N"` n'en a pas).

Dans le rendu, l'avatar est **hors** de la bulle, façon messagerie : un wrapper
`.story-row` porte le placement (`align-self`) et la largeur utile, la bulle ne
garde que sa couleur et son coin cassé. Deux pièges dans `css/styles.css` :
`align-self` **doit** être neutralisé sur la bulle à l'intérieur d'une row (il y
pilote l'axe vertical et décollerait la bulle de son avatar), et `.mascot-img`
n'ayant aucune dimension propre, `img.story-avatar` est ce qui empêche l'image de
s'afficher en 512 px. L'ordre du DOM reste toujours avatar-puis-bulle, y compris
à droite où seul `flex-direction: row-reverse` inverse le rendu : un lecteur
d'écran annonce ainsi « qui parle » avant « ce qu'il dit ».

Invariants de contenu dans `tests/stories.test.js` : `answers ⊆ options`,
`wordBank ⊇ mots(pl)`, `answer ∈ options` + marqueur `_____`, ids **disjoints**
des 947 item-ids (ils cohabitent dans la même map `localStorage`), et un test de
bout en bout qui vérifie que la bonne réponse de chaque épreuve est bien acceptée
par `Exercises.check`.

## Content editing

All pedagogical content lives in `data/lessons.js`. To add or fix vocabulary/grammar, edit only that file. Item `id` values (e.g. `v-11-...`) must remain stable — they are the SRS keys in localStorage.

**`wordBank` field on sentences:** used by the `build` exercise (reconstruct the sentence from tiles). It should contain the real sentence words **plus optional distractors** (wrong but plausible alternatives). The `cloze` exercise (fill-in-the-blank) always derives its words from `sentence.pl` directly — distractors in `wordBank` are ignored there.

**`dialogues` field on a lesson (optional):** powers the `dialogue` exercise (reconstruct one reply of a mini-dialogue in context). Shape: `{ id, title, lines: [{ who: "A"|"B", pl, fr, target?, wordBank? }] }`. Exactly **one** line must have `target: true` — that's the reply the learner rebuilds from a tile bank (`wordBank` follows the same real-words-plus-distractors rule as `build`; the correct tiles in order must equal the target `pl` after `normalize`). The other lines are shown as context bubbles with audio. Reuses the `build` answer-checking path (`js/exercises.js` `check`). Rendered by `renderDialogue` (`js/app.js`), styled `.dialogue*` (`css/styles.css`).

**Speech recognition and numbers:** `js/speech.js` `normalize()` converts Arabic digits to Polish words before scoring (e.g. "18" → "osiemnaście"), because the Web Speech API often returns digits for spoken numbers.

**Badges** sont définis dans `data/badges.js` (17 entrées : `id`, `emoji`, `title`,
`desc`, `check(state)`). Ils sont **thématiques forêt kawaii** — pas d'emoji
générique, chaque badge a un sticker dédié (`public/assets/img/badge-<id>.png`,
même pipeline de génération que les personnages, cf. § plus haut) et sa propre
condition. Les seuils `words-tier*`/`master-tier*` (mots rencontrés / mots en
boîte 5) sont des **nombres choisis à la main**, pas un pourcentage dynamique
du total réel d'items (884 aujourd'hui) : le calculer exigerait d'importer
`js/exercises.js` (`buildIndex`) dans `data/badges.js`, ce qui casserait le DAG
(`badges` est en amont d'`exercises`). À l'inverse, `halfway`/`graduate`
(moitié / totalité des leçons) et `all-stories` (toutes les histoires bonus)
**restent dynamiques** — ils comptent `POLISH_LESSONS.length`/
`POLISH_STORIES.length`, déjà importables sans violer le DAG — précisément pour
ne pas se re-dater comme `halfway` l'avait fait (seuil resté figé à 10 leçons
pendant que le total montait à 60). `first-trail`/`first-story`/`all-stories`
ne créent aucun nouveau champ persisté : ils lisent `s.lessons`/
`s.lessons[storyId]`, la même map que les leçons (cf. § Histoires bonus).
Renommer ou retirer un badge est sans risque : `s.badges` n'est qu'un tableau
d'ids, un id orphelin devient simplement inerte.

### Ajouter une leçon

Une leçon s'**insère** à sa place pédagogique, elle ne s'appende pas. La
manœuvre est mécanique mais touche plusieurs fichiers — c'est la
**renumérotation de `order`** qui fait tout le travail, le tableau
`POLISH_LESSONS` restant dans son désordre physique (la nouvelle leçon va en
fin de tableau).

1. **Écrire le bloc** : `order` cible, **exactement 4** `sentences` et **2**
   `grammarNotes` (les deux référencées par un `grammarFocus`), vocabulaire avec
   `category` non vide. Vérifier que le point de grammaire employé est **déjà
   enseigné** à cet `order` — c'est la seule chose qu'aucun test ne détecte.
2. **Renuméroter** l'`order` des leçons suivantes (+1 par leçon insérée avant
   elles). Ne pas toucher aux `id`.
3. **Préférer un total multiple de 5** : `TRAIL_SIZE` découpe en paquets rigides,
   et un reste laisse un sentier dépareillé dont l'histoire bonus afficherait
   « Termine les 5 leçons » à tort.
4. **Relire `TRAILS`** (`js/app.js`) : ses noms, icônes et commentaires de plage
   sont **positionnels**, donc faux dès qu'une insertion décale les paquets.
   Revérifier aussi le `trailIndex` de chaque histoire de `data/stories.js`.
5. **Régénérer `tests/fixtures/item-ids.json`** (recette dans
   `tests/fixtures/README.md`) et **ajouter les nouvelles clés à
   `tests/fixtures/state-v1-realistic.json`** avec le statut que
   `ensureLessonStatuses()` calcule (`available` si le prédécesseur par `order`
   est `completed`, sinon `locked`) — sinon le test d'égalité **octet pour
   octet** rougit, `load()` ajoutant la clé manquante.
6. **Mettre à jour les compteurs codés en dur** : `data-invariants.test.js`
   (leçons, vocab, phrases, dialogues, ids, notes, cas `build`),
   `exercises.test.js`, `state-corruption.test.js`, et la répartition des
   statuts dans `state-load.test.js`.

⚠️ Insérer une leçon **reverrouille** la leçon `available` non commencée qui la
suit désormais (`ensureLessonStatuses` recalcule sur l'`order` courant). C'est
voulu : la progression reste linéaire. Les leçons `completed` et `inProgress`
ne sont, elles, **jamais** rétrogradées.
