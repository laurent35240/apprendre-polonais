/**
 * Ancre temporelle de toutes les fixtures d'état.
 *
 * `State.todayStr()` utilise l'heure LOCALE, et `items[].dueDate` /
 * `dailyGoal.todayDate` y sont comparés : sans horloge figée, un test qui
 * charge une fixture dépendrait du jour où il tourne. Tout test qui charge une
 * fixture d'état DOIT donc appeler `vi.setSystemTime(new Date(ANCHOR))` avant
 * `State.load()`.
 *
 * Même date que les tests de bascule de `tests/srs.test.js` : une seule date
 * magique dans le dépôt.
 *
 * Midi en heure locale, et non minuit ni un `Z` : `TZ` est figée à
 * `Europe/Paris` dans `vite.config.js`, et une ancre à minuit UTC tomberait la
 * veille à 01 h à Paris — exactement le piège que les cas « heure d'été » de
 * `srs.test.js` prennent soin d'éviter.
 */
export const ANCHOR_DAY = "2026-03-02";
export const ANCHOR = "2026-03-02T12:00:00";
