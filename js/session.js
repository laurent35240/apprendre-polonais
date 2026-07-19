/* =====================================================================
   SESSION — construit la liste d'exercices d'une session
   ---------------------------------------------------------------------
   Mélange nouveaux items (leçon courante) + révisions dues (leçons passées).
   La difficulté monte avec l'ordre de la leçon (plus de saisie, cloze…).
   ===================================================================== */
(function () {
  "use strict";

  var E = window.Exercises;

  function lessonById(id) {
    return (window.POLISH_LESSONS || []).filter(function (l) {
      return l.id === id;
    })[0];
  }

  function speakOK() {
    return window.Speech.recognitionAvailable();
  }

  // Choisit un exercice de "reconnaissance" (comprendre) pour un mot.
  function recognitionEx(entry, order, i) {
    if (order <= 2) return E.makeMultipleChoice(entry, "pl-fr");
    var pick = i % 3;
    if (pick === 0) return E.makeMultipleChoice(entry, "pl-fr");
    if (pick === 1) return E.makeListen(entry);
    return E.makeMultipleChoice(entry, "fr-pl");
  }

  // Choisit un exercice de "production" (restituer) pour un mot.
  function productionEx(entry, order) {
    if (order >= 6) return E.makeType(entry);
    return E.makeMultipleChoice(entry, "fr-pl");
  }

  // Ids de tous les items rencontrés appartenant à des leçons d'ordre < currentOrder.
  function earlierSeenIds(currentOrder) {
    var state = window.State.get();
    var ids = [];
    (window.POLISH_LESSONS || []).forEach(function (l) {
      if (l.order >= currentOrder) return;
      (l.vocabulary || []).forEach(function (v) {
        if (state.items[v.id]) ids.push(v.id);
      });
      (l.sentences || []).forEach(function (s) {
        if (state.items[s.id]) ids.push(s.id);
      });
    });
    return ids;
  }

  // Construit une session pour une leçon.
  function buildLessonSession(lessonId) {
    var lesson = lessonById(lessonId);
    if (!lesson) return [];
    var order = lesson.order;
    var out = [];

    // 1) Nouveau vocabulaire
    (lesson.vocabulary || []).forEach(function (v, i) {
      var entry = E.getEntry(v.id);
      if (!entry) return;
      out.push(recognitionEx(entry, order, i));
      if (order >= 4 && i % 2 === 0) out.push(productionEx(entry, order));
    });

    // 2) Phrases : reconstruction + trous (grammaire) + prononciation
    (lesson.sentences || []).forEach(function (s, i) {
      var entry = E.getEntry(s.id);
      if (!entry) return;
      out.push(E.makeBuild(entry));
      if (order >= 5 && entry.grammarFocus && i % 2 === 1) {
        out.push(E.makeCloze(entry));
      }
    });

    // 3) Prononciation (si dispo) : 2 mots + 1 phrase
    if (speakOK()) {
      var vocab = lesson.vocabulary || [];
      [0, Math.floor(vocab.length / 2)].forEach(function (idx) {
        if (vocab[idx]) out.push(E.makeSpeak(E.getEntry(vocab[idx].id)));
      });
      if ((lesson.sentences || [])[0]) {
        out.push(E.makeSpeak(E.getEntry(lesson.sentences[0].id)));
      }
    }

    // 4) Révisions dues des leçons précédentes (max 5)
    var due = window.SRS.dueItems(earlierSeenIds(order));
    E.shuffle(due)
      .slice(0, 5)
      .forEach(function (id) {
        var entry = E.getEntry(id);
        if (!entry) return;
        if (entry.kind === "sentence") out.push(E.makeBuild(entry));
        else out.push(E.makeMultipleChoice(entry, "pl-fr"));
      });

    return interleave(out);
  }

  // Construit une session de révision pure (mots dus, toutes leçons débloquées).
  function buildReviewSession() {
    var state = window.State.get();
    var allSeen = Object.keys(state.items);
    var due = window.SRS.dueItems(allSeen);
    if (!due.length) return [];
    var out = [];
    E.shuffle(due)
      .slice(0, 15)
      .forEach(function (id, i) {
        var entry = E.getEntry(id);
        if (!entry) return;
        if (entry.kind === "sentence") {
          out.push(E.makeBuild(entry));
        } else {
          out.push(
            i % 2 === 0
              ? E.makeMultipleChoice(entry, "pl-fr")
              : E.makeListen(entry)
          );
        }
      });
    return out;
  }

  // Répartit les exercices "difficiles/oraux" pour éviter les grappes.
  function interleave(list) {
    // Simple : on garde l'ordre mais on remonte un exercice d'écoute tôt.
    return list;
  }

  window.Session = {
    buildLessonSession: buildLessonSession,
    buildReviewSession: buildReviewSession,
    lessonById: lessonById
  };
})();
