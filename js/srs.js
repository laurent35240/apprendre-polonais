/* =====================================================================
   SRS — répétition espacée (système de Leitner)
   ---------------------------------------------------------------------
   Chaque item de vocab/phrase a une "boîte" (1 à 5).
   Bonne réponse -> monte d'une boîte (revu plus tard).
   Erreur       -> retour boîte 1 (revu bientôt).
   Intervalle (jours) par boîte : 1 -> 5 -> ... -> plus long.
   ===================================================================== */
(function () {
  "use strict";

  var MAX_BOX = 5;
  // Intervalle en jours avant nouvelle révision, par boîte.
  var INTERVALS = { 1: 0, 2: 1, 3: 3, 4: 7, 5: 16 };

  function addDaysISO(days) {
    var d = new Date();
    d.setDate(d.getDate() + days);
    return window.State.todayStr(d);
  }

  // Retourne l'entrée SRS d'un item, en la créant si besoin.
  function ensureItem(itemId) {
    var state = window.State.get();
    if (!state.items[itemId]) {
      state.items[itemId] = {
        box: 1,
        dueDate: window.State.todayStr(),
        seenCount: 0,
        correctCount: 0,
        lastSeen: null
      };
    }
    return state.items[itemId];
  }

  // Enregistre une réponse pour un item.
  function record(itemId, correct) {
    var item = ensureItem(itemId);
    item.seenCount += 1;
    item.lastSeen = window.State.todayStr();
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
  function isDue(itemId) {
    var state = window.State.get();
    var item = state.items[itemId];
    if (!item) return false;
    return item.dueDate <= window.State.todayStr();
  }

  // Liste des itemIds dus, parmi un ensemble candidat (déjà rencontrés).
  function dueItems(candidateIds) {
    return (candidateIds || []).filter(isDue);
  }

  // "Force" d'un item (0-1) pour l'affichage de la progression.
  function strength(itemId) {
    var state = window.State.get();
    var item = state.items[itemId];
    if (!item) return 0;
    return (item.box - 1) / (MAX_BOX - 1);
  }

  window.SRS = {
    MAX_BOX: MAX_BOX,
    ensureItem: ensureItem,
    record: record,
    isDue: isDue,
    dueItems: dueItems,
    strength: strength
  };
})();
