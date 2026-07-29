# Fixtures de test

## Pourquoi ce README

JSON n'accepte pas de commentaires, et une clé `_meta` dans une fixture d'état
serait abandonnée par `State.validate()` (qui copie par liste blanche) tout en
faisant échouer le test d'égalité octet. Ce fichier est donc le seul endroit où
documenter les fixtures.

## `item-ids.json` — 647 ids

Instantané trié des ids de `data/lessons.js` (470 vocabulaire + 160 phrases + 17
dialogues). **Ce sont les clés de progression en localStorage** : renommer un id
efface silencieusement l'historique SRS de ce mot chez l'utilisateur. Le test
`tests/data-invariants.test.js` › « aucun id n'a été renommé ni supprimé » rend
l'accident visible en revue.

## `anchor.js` — l'ancre temporelle

`State.todayStr()` est en heure **locale**, et `items[].dueDate` /
`dailyGoal.todayDate` y sont comparés. Tout test qui charge une fixture d'état
**doit** figer l'horloge :

```js
import { ANCHOR } from "./fixtures/anchor.js";
vi.useFakeTimers();
vi.setSystemTime(new Date(ANCHOR));   // AVANT State.load()
```

L'alternative — des dates relatives calculées à l'exécution — transformerait la
fixture en code, la rendrait non-diffable, et l'empêcherait d'être importable
telle quelle dans le navigateur. Les dates absolues ancrées gardent les deux
propriétés.

## `state-v1-realistic.json` — 463 items

Dérivée d'un export **réel** de l'application, anonymisée. C'est la fixture
principale : elle porte les distributions authentiques, que des données
fabriquées n'auraient pas.

### Recette de dérivation

**Δ = 149 jours** : la dernière activité réelle (`2026-07-29`) tombe exactement
sur l'ancre (`2026-03-02`), si bien que `streak.lastActiveDate` et
`dailyGoal.todayDate` valent l'ancre — et donc `rolloverDay()` est un **no-op**
au chargement. Les tests de rollover avancent l'horloge eux-mêmes.

| Champ | Traitement | Pourquoi |
|---|---|---|
| ids des items | verbatim | Données publiques (`data/lessons.js`), et c'est la vraie topologie qu'on veut tester |
| `items[].box` | verbatim | Préserve `{1:32, 2:114, 3:217, 4:93, 5:7}`, d'où découlent les badges |
| `items[].dueDate`, `lastSeen` | **− 149 j** | Étalement conservé : 285 des 463 items sont dus à l'ancre |
| `items[].seenCount`, `correctCount` | verbatim | Champs morts, mais la forme persistée ne change pas |
| `lessons` (40 entrées) | verbatim | 29 `completed`, 4 `available`, 7 `locked`, `bestScore` inclus |
| `profile.totalXP`, `level` | verbatim (10750, 22) | |
| `profile.createdAt` | normalisé | Un horodatage à la milliseconde trahit une habitude |
| `streak`, `dailyGoal`, `badges`, `flags`, `settings` | verbatim, dates décalées | |

### Trois invariants, chacun testé

- **`levelForXP(10750) === 22`** — cohérence interne du profil.
- **Les 7 badges sont exactement ceux que les 11 `check()` accordent.** Les 4
  non accordés le sont pour de bonnes raisons : `master-3` exige 10 items en
  boîte 5 et il y en a **7** ; `graduate` exige 40 leçons et il y en a 29 ;
  `streak-7`/`streak-30` exigent plus que 5. Ce test prouve la cohérence de la
  fixture *et* couvre les 11 `check()` sur un état réaliste.
- **`secondsToday` 1480 / 1800 avec `goalMetToday: false`** — permet de tester le
  verrou d'idempotence du bonus de 100 XP en ajoutant 320 s.

## `state-v1-fresh.json` — état précoce, taillé pour la chaîne de déverrouillage

3 items, 5 entrées `lessons` seulement (les 35 autres doivent être créées au
chargement), `lesson-01` à `lesson-04` terminées.

**Le cas discriminant** : `lesson-04` a `order` 4. `ensureLessonStatuses()` doit
donc ouvrir la leçon d'`order` 5, qui est **`lesson-22`** — et *pas* `lesson-05`,
qui a `order` 7. `POLISH_LESSONS` n'étant pas trié par `order`, une
implémentation fondée sur la position physique passerait un test naïf par
accident. Cette fixture rend l'erreur détectable.

## `state-v2-future.json` — sauvegarde d'une version future

`version: 2`, avec une forme volontairement incompatible : `strength` au lieu de
`box`, `lastSeen` en timestamp complet, `badges` en map, plus une clé racine
inconnue (`avatarUrl`).

Le renommage `box` → `strength` n'est pas gratuit : si un code v1 lisait cette
sauvegarde, `dueDate` existerait mais `box` non, et le SRS **cesserait
silencieusement** de proposer des révisions. C'est le scénario que le garde-fou
de version doit rendre impossible.

## `state-v1-truncated.txt`

Les 1000 premiers octets de la fixture réaliste : `JSON.parse` lève. Extension
`.txt` volontaire, pour qu'aucun outil ne tente de le valider comme du JSON.

## Les corruptions ne sont pas des fichiers

Elles sont construites dans le test en **empoisonnant** la fixture réaliste
(`{...fixture, items: 42}`, `items: []`, `lessons: []`, `badges: 42`…). C'est
plus fort qu'une fixture isolée : sur `items: 42` on peut asserter que les 10750
XP, les 29 leçons et les 7 badges ont **survécu** — la propriété qui compte.
Une fixture autonome ne prouverait que l'absence de crash.

## Ce qui n'est pas dans le dépôt

Le script de dérivation (usage unique — la recette ci-dessus est l'artefact
durable) et l'export réel non anonymisé.
