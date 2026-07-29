# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the app

```bash
npm install
npm run dev        # http://localhost:5173/apprendre-polonais/  (PAS la racine /)
npm test           # 80 assertions, ~1 s
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

Vanilla JS en **modules ES**, bundlé par Vite. Zéro dépendance runtime ; 3
devDependencies (vite, vitest, happy-dom, typescript). Chaque module exporte une façade
nommée (`export const State = {…}`), et `js/app.js` est le point d'entrée unique
déclaré dans `index.html` — **l'ordre de dépendances est porté par le graphe
d'imports**, plus par l'ordre des balises `<script>`.

Le graphe est un DAG strict : `lessons → badges → state → srs → speech →
gamification → exercises → session → ui → app`. Il n'y a **pas** de cycle
State ⇄ Gamification (Gamification → State : 14 références, l'inverse : 0) ; la
logique de streak est dupliquée entre `state.js rolloverDay()` et
`gamification.js touchActivity()`, ce qui peut donner l'illusion d'un cycle.

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

**Data flow**: `data/lessons.js` and `data/badges.js` export `POLISH_LESSONS` / `POLISH_BADGES` → les modules JS les importent → `app.js` is the top-level controller.

**Module responsibilities:**
- `js/state.js` — all user progression, persisted to `localStorage` under key `polski-zubr-v1`
- `js/srs.js` — Leitner spaced-repetition scheduling (box 0–5, due dates)
- `js/speech.js` — Web Speech API wrappers (TTS + recognition)
- `js/gamification.js` — XP, levels, streak, daily goal (30 min), badge checks
- `js/exercises.js` — exercise generation and answer checking for all types (MCQ, listen, type, word-bank/build, fill-in/cloze, pronunciation, dialogue)
- `js/session.js` — builds a session array mixing new items + due SRS reviews
- `js/ui.js` — DOM helpers, mascotte, toasts, confetti, sounds
- `js/app.js` — screen navigation, exercise loop, DOMContentLoaded boot

**Home screen — lesson grouping (`js/app.js`):** the home path groups lessons into "sentiers" (packs of 5) via `trailNode()`. Lessons are iterated **sorted by `order`** (`sortedLessons()` / `byOrder`), not array order — `order` is the display sequence and does not match `id`. **`order` is the single source of truth for sequencing**: both the home display (`app.js`) and the unlock chain (`js/state.js` `ensureLessonStatuses`) sort by `order`, so the physical position of a lesson block in the `POLISH_LESSONS` array is irrelevant — new lessons can be appended anywhere and just need a unique `order`. `order` values must be unique; they need not be contiguous. Trail names + emojis live in the `TRAILS` array. By default only the trail holding the current lesson is expanded (`currentTrailIndex()` / `currentLessonId()` = first non-`completed`, non-`locked` lesson); manual expand/collapse is kept in the in-memory `trailOpenOverride` map (not persisted). The "Reprendre" button calls `jumpToCurrent()`, which opens the right trail, re-renders, then scrolls to the lesson node (`[data-lesson-id]`) and briefly adds `.lesson-node--highlight`. The connecting trail line is pure CSS (`.trail-body::before`, `css/styles.css`): it sits above card backgrounds but below the lesson badges (z-index), so badges must stay opaque — avoid `opacity` on the whole `.lesson-node` and avoid `transform` on hover (both would let the line show through / over the badge).

## Content editing

All pedagogical content lives in `data/lessons.js`. To add or fix vocabulary/grammar, edit only that file. Item `id` values (e.g. `v-11-...`) must remain stable — they are the SRS keys in localStorage.

**`wordBank` field on sentences:** used by the `build` exercise (reconstruct the sentence from tiles). It should contain the real sentence words **plus optional distractors** (wrong but plausible alternatives). The `cloze` exercise (fill-in-the-blank) always derives its words from `sentence.pl` directly — distractors in `wordBank` are ignored there.

**`dialogues` field on a lesson (optional):** powers the `dialogue` exercise (reconstruct one reply of a mini-dialogue in context). Shape: `{ id, title, lines: [{ who: "A"|"B", pl, fr, target?, wordBank? }] }`. Exactly **one** line must have `target: true` — that's the reply the learner rebuilds from a tile bank (`wordBank` follows the same real-words-plus-distractors rule as `build`; the correct tiles in order must equal the target `pl` after `normalize`). The other lines are shown as context bubbles with audio. Reuses the `build` answer-checking path (`js/exercises.js` `check`). Rendered by `renderDialogue` (`js/app.js`), styled `.dialogue*` (`css/styles.css`).

**Speech recognition and numbers:** `js/speech.js` `normalize()` converts Arabic digits to Polish words before scoring (e.g. "18" → "osiemnaście"), because the Web Speech API often returns digits for spoken numbers.

Badges are defined in `data/badges.js` (emoji, title, description, unlock condition).
