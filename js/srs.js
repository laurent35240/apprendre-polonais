// @ts-check
/* =====================================================================
   SRS — répétition espacée (système de Leitner)
   ---------------------------------------------------------------------
   Chaque item de vocab/phrase a une "boîte" (1 à 5).
   Bonne réponse -> monte d'une boîte (revu plus tard).
   Erreur       -> retour boîte 1 (revu bientôt).
   Intervalle (jours) par boîte : 1 -> 5 -> ... -> plus long.
   ===================================================================== */
import { State } from "./state.js";

var MAX_BOX = 5;
// Intervalle en jours avant nouvelle révision, par boîte.
/** @type {Record<number, number>} */
var INTERVALS = { 1: 0, 2: 1, 3: 3, 4: 7, 5: 16 };

/**
 * @param {number} days
 * @returns {string}
 */
function addDaysISO(days) {
  var d = new Date();
  d.setDate(d.getDate() + days);
  return State.todayStr(d);
}

// Retourne l'entrée SRS d'un item, en la créant si besoin.
/**
 * @param {string} itemId
 * @returns {SrsItem}
 */
function ensureItem(itemId) {
  var state = State.get();
  if (!state.items[itemId]) {
    state.items[itemId] = {
      box: 1,
      dueDate: State.todayStr(),
      seenCount: 0,
      correctCount: 0,
      lastSeen: null
    };
  }
  return state.items[itemId];
}

// Enregistre une réponse pour un item.
/**
 * @param {string} itemId
 * @param {boolean} correct
 * @returns {SrsItem} la référence mutée, pas une copie.
 */
function record(itemId, correct) {
  var item = ensureItem(itemId);
  item.seenCount += 1;
  item.lastSeen = State.todayStr();
  if (correct) {
    item.correctCount += 1;
    item.box = Math.min(MAX_BOX, item.box + 1);
  } else {
    item.box = 1;
  }
  item.dueDate = addDaysISO(INTERVALS[item.box] || 0);
  return item;
}

// Item dû pour révision aujourd'hui ?
/**
 * @param {string} itemId
 * @returns {boolean} false si l'item est inconnu (aucune création implicite).
 */
function isDue(itemId) {
  var state = State.get();
  var item = state.items[itemId];
  if (!item) return false;
  return item.dueDate <= State.todayStr();
}

// Liste des itemIds dus, parmi un ensemble candidat (déjà rencontrés).
/**
 * @param {string[]} [candidateIds]
 * @returns {string[]}
 */
function dueItems(candidateIds) {
  return (candidateIds || []).filter(isDue);
}

// "Force" d'un item (0-1) pour l'affichage de la progression.
/**
 * @param {string} itemId
 * @returns {number} 0 (boîte 1) à 1 (boîte MAX_BOX) ; 0 si inconnu.
 */
function strength(itemId) {
  var state = State.get();
  var item = state.items[itemId];
  if (!item) return 0;
  return (item.box - 1) / (MAX_BOX - 1);
}

export const SRS = {
  MAX_BOX: MAX_BOX,
  ensureItem: ensureItem,
  record: record,
  isDue: isDue,
  dueItems: dueItems,
  strength: strength
};
