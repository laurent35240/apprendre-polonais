# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the app

```bash
npm install
npm run dev        # http://localhost:5173/apprendre-polonais/  (PAS la racine /)
npm test           # 280 assertions, ~1,5 s
npm run typecheck  # tsc --noEmit, DOIT valoir 0
npm run build      # dist/
npm run preview    # http://localhost:4173/apprendre-polonais/
```

Le `base` de `vite.config.js` vaut `/apprendre-polonais/` (chemin de
déploiement) : `http://localhost:5173/` renvoie donc un 404, c'est normal.
Le double-clic sur `index.html` **ne fonctionne plus** depuis le passage aux
modules ES.

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

Le graphe est un DAG strict : `lessons → badges → state → srs → speech →
gamification → progress → cloud → exercises → session → ui → app`. Il n'y a
**pas** de cycle State ⇄ Gamification (Gamification → State : 14 références,
l'inverse : 0), et `js/progress.js` est un module séparé **précisément pour ne
pas en créer un** (il doit créditer l'XP et toucher les badges, ce que
`state.js` ne peut pas) ; la logique de streak est dupliquée entre `state.js
rolloverDay()` et `gamification.js touchActivity()`, ce qui peut donner
l'illusion d'un cycle. `js/cloud.js` obéit à la même contrainte de DAG que
`progress.js` : il a besoin de `State`/`Progress`, jamais l'inverse, et
n'importe pas `ui.js` (il renvoie des faits, `app.js` décide des toasts).

**Assets** : `public/assets/img/` est copié verbatim par Vite (pas de hachage),
parce que `js/ui.js` construit ses chemins d'images par concaténation — donc
invisibles à l'analyse statique. Ils sont préfixés par `import.meta.env.BASE_URL`
pour rester absolus. ⚠️ Chaque `<img>` a un **repli emoji** sur l'événement
`error` : un chemin cassé n'émet aucune erreur en console, on voit juste 🦬 au
lieu du bison. C'est `tests/assets-paths.test.js` qui rend cette régression
détectable. `assets/gen/` (15 Mo de sources brutes) reste volontairement hors de
`public/`.

## Tests

`npm test` — Vitest, environnement `happy-dom` (nécessaire : `js/speech.js` lit
`window` au niveau module). `TZ` est figée à `Europe/Paris` dans la config car
`State.todayStr()` utilise l'heure locale et la CI tourne en UTC.

`tests/data-invariants.test.js` vérifie ce que TypeScript ne peut pas exprimer
(unicité des 647 ids, « exactement une ligne `target` » par dialogue,
`wordBank ⊇ mots(pl)`, clés étrangères `grammarFocus`…). Ses **10 `it.skip`**
documentent des invariants qui échouent aujourd'hui : c'est de la dette
assumée, avec le chiffre exact et la raison en commentaire. Ne pas les
« réparer » sans décision produit — notamment `[VOULU] le tableau est trié par
order`, qui doit rester rouge.

`tests/fixtures/item-ids.json` fige les 647 ids. Ce sont les **clés SRS en
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
Les 7 intentions (`answerRecorded`, `sessionFinished`, `timeSpent`,
`dayRolledOver`, `pronunciationPerfect`, `settingChanged`, `progressImported` /
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

**Data flow**: `data/lessons.js` and `data/badges.js` export `POLISH_LESSONS` / `POLISH_BADGES` → les modules JS les importent → `app.js` is the top-level controller.

**Module responsibilities:**
- `js/state.js` — all user progression, persisted to `localStorage` under key `polski-zubr-v1` (cf. § Persistance)
- `js/progress.js` — les 7 **intentions** de progression : le seul chemin d'écriture dans l'état
- `js/cloud.js` — synchro multi-appareils (Firebase, cf. § Synchronisation) : auth par lien magique, push/pull Firestore
- `js/srs.js` — Leitner spaced-repetition scheduling (box 0–5, due dates)
- `js/speech.js` — Web Speech API wrappers (TTS + recognition)
- `js/gamification.js` — XP, levels, streak, daily goal (30 min), badge checks
- `js/exercises.js` — exercise generation and answer checking for all types (MCQ, listen, type, word-bank/build, fill-in/cloze, pronunciation, dialogue)
- `js/session.js` — builds a session array mixing new items + due SRS reviews
- `js/ui.js` — DOM helpers, mascotte, toasts, confetti, sounds
- `js/app.js` — screen navigation, exercise loop, DOMContentLoaded boot

**Home screen — lesson grouping (`js/app.js`):** the home path groups lessons into "sentiers" (packs of 5) via `trailNode()`. Lessons are iterated **sorted by `order`** (`sortedLessons()` / `byOrder`), not array order — `order` is the display sequence and does not match `id`. **`order` is the single source of truth for sequencing**: both the home display (`app.js`) and the unlock chain (`js/state.js` `ensureLessonStatuses`) sort by `order`, so the physical position of a lesson block in the `POLISH_LESSONS` array is irrelevant — new lessons can be appended anywhere and just need a unique `order`. `order` values must be unique; they need not be contiguous. Trail names + emojis live in the `TRAILS` array. By default only the trail holding the current lesson is expanded (`currentTrailIndex()` / `currentLessonId()` = first non-`completed`, non-`locked` lesson); manual expand/collapse is kept in the in-memory `trailOpenOverride` map (not persisted). The "Reprendre" button calls `jumpToCurrent()`, which opens the right trail, re-renders, then scrolls to the lesson node (`[data-lesson-id]`) and briefly adds `.lesson-node--highlight`. The connecting trail line is pure CSS (`.trail-body::before`, `css/styles.css`): it sits above card backgrounds but below the lesson badges (z-index), so badges must stay opaque — avoid `opacity` on the whole `.lesson-node` and avoid `transform` on hover (both would let the line show through / over the badge).

## Synchronisation multi-appareils (palier 4)

Login par lien magique (Firebase Authentication, e-mail sans mot de passe) +
progression synchronisée via Firestore, un document par utilisateur
(collection `progress`, id = `uid`). **Fusion par item**, jamais « dernier qui
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

## Content editing

All pedagogical content lives in `data/lessons.js`. To add or fix vocabulary/grammar, edit only that file. Item `id` values (e.g. `v-11-...`) must remain stable — they are the SRS keys in localStorage.

**`wordBank` field on sentences:** used by the `build` exercise (reconstruct the sentence from tiles). It should contain the real sentence words **plus optional distractors** (wrong but plausible alternatives). The `cloze` exercise (fill-in-the-blank) always derives its words from `sentence.pl` directly — distractors in `wordBank` are ignored there.

**`dialogues` field on a lesson (optional):** powers the `dialogue` exercise (reconstruct one reply of a mini-dialogue in context). Shape: `{ id, title, lines: [{ who: "A"|"B", pl, fr, target?, wordBank? }] }`. Exactly **one** line must have `target: true` — that's the reply the learner rebuilds from a tile bank (`wordBank` follows the same real-words-plus-distractors rule as `build`; the correct tiles in order must equal the target `pl` after `normalize`). The other lines are shown as context bubbles with audio. Reuses the `build` answer-checking path (`js/exercises.js` `check`). Rendered by `renderDialogue` (`js/app.js`), styled `.dialogue*` (`css/styles.css`).

**Speech recognition and numbers:** `js/speech.js` `normalize()` converts Arabic digits to Polish words before scoring (e.g. "18" → "osiemnaście"), because the Web Speech API often returns digits for spoken numbers.

Badges are defined in `data/badges.js` (emoji, title, description, unlock condition).
