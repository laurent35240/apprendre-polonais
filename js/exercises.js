/* =====================================================================
   EXERCISES — génération et correction des exercices
   ---------------------------------------------------------------------
   Les exercices sont GÉNÉRÉS à partir des données de leçon (vocab/phrases),
   pas écrits à la main. Types :
     mc-pl-fr   QCM : mot polonais -> choisir le français
     mc-fr-pl   QCM : mot français -> choisir le polonais
     type-fr-pl saisie : français -> écrire le polonais
     listen     écoute : audio polonais -> choisir ce qu'on a entendu
     speak      prononciation : lire le polonais à voix haute (score vocal)
     build      reconstruire une phrase depuis une banque de mots
     cloze      texte à trous ciblant la grammaire
   ===================================================================== */
(function () {
  "use strict";

  var _index = null; // itemId -> { id, pl, fr, kind, lessonId, category, wordBank }
  var _vocabPool = null; // array de toutes les entrées vocab (pour distracteurs)

  function buildIndex() {
    if (_index) return _index;
    _index = {};
    _vocabPool = [];
    (window.POLISH_LESSONS || []).forEach(function (lesson) {
      (lesson.vocabulary || []).forEach(function (v) {
        var entry = {
          id: v.id,
          pl: v.pl,
          fr: v.fr,
          kind: "vocab",
          lessonId: lesson.id,
          category: v.category || "divers",
          example: v.example || null
        };
        _index[v.id] = entry;
        _vocabPool.push(entry);
      });
      (lesson.sentences || []).forEach(function (s) {
        _index[s.id] = {
          id: s.id,
          pl: s.pl,
          fr: s.fr,
          kind: "sentence",
          lessonId: lesson.id,
          wordBank: s.wordBank || s.pl.split(/\s+/),
          grammarFocus: s.grammarFocus || null
        };
      });
    });
    return _index;
  }

  function getEntry(itemId) {
    buildIndex();
    return _index[itemId] || null;
  }

  /* --------------------------- utilitaires ---------------------------- */

  // Mélange (Fisher-Yates) — déterministe pas requis ici.
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  // Distracteurs : n autres valeurs (champ 'fr' ou 'pl'), même catégorie de préf.
  function distractors(field, correctEntry, n) {
    buildIndex();
    var correctVal = correctEntry[field];
    var sameCat = _vocabPool.filter(function (e) {
      return (
        e.id !== correctEntry.id &&
        e.category === correctEntry.category &&
        e[field] !== correctVal
      );
    });
    var others = _vocabPool.filter(function (e) {
      return e.id !== correctEntry.id && e[field] !== correctVal;
    });
    var pool = shuffle(sameCat).concat(shuffle(others));
    var seen = {};
    var out = [];
    for (var i = 0; i < pool.length && out.length < n; i++) {
      var val = pool[i][field];
      if (!seen[val] && val !== correctVal) {
        seen[val] = true;
        out.push(val);
      }
    }
    return out;
  }

  /* ------------------------ générateurs d'exos ------------------------ */

  function makeMultipleChoice(entry, direction) {
    // direction: 'pl-fr' (montre pl, choisir fr) ou 'fr-pl'
    var showField = direction === "pl-fr" ? "pl" : "fr";
    var answerField = direction === "pl-fr" ? "fr" : "pl";
    var answer = entry[answerField];
    var opts = shuffle(distractors(answerField, entry, 3).concat([answer]));
    return {
      type: "mc-" + direction,
      itemId: entry.id,
      promptText: entry[showField],
      promptLang: direction === "pl-fr" ? "pl" : "fr",
      answer: answer,
      answerLang: direction === "pl-fr" ? "fr" : "pl",
      options: opts,
      audioText: entry.pl,
      instruction:
        direction === "pl-fr"
          ? "Que signifie ce mot ?"
          : "Choisis la bonne traduction en polonais"
    };
  }

  function makeType(entry) {
    return {
      type: "type-fr-pl",
      itemId: entry.id,
      promptText: entry.fr,
      promptLang: "fr",
      answer: entry.pl,
      answerLang: "pl",
      audioText: entry.pl,
      instruction: "Écris ce mot en polonais"
    };
  }

  function makeListen(entry) {
    // On joue le polonais ; choisir la bonne traduction française.
    var answer = entry.fr;
    var opts = shuffle(distractors("fr", entry, 3).concat([answer]));
    return {
      type: "listen",
      itemId: entry.id,
      promptText: "🔊 Écoute et choisis la bonne traduction",
      promptLang: "fr",
      answer: answer,
      answerLang: "fr",
      audioText: entry.pl,
      revealText: entry.pl,
      options: opts,
      autoPlay: true,
      instruction: "Qu'as-tu entendu ?"
    };
  }

  function makeSpeak(entry) {
    return {
      type: "speak",
      itemId: entry.id,
      promptText: entry.pl,
      promptLang: "pl",
      subText: entry.fr,
      answer: entry.pl,
      answerLang: "pl",
      audioText: entry.pl,
      instruction: "Prononce à voix haute (clique sur le micro)"
    };
  }

  function makeBuild(entry) {
    // entry est une "sentence"
    var bank = entry.wordBank || entry.pl.split(/\s+/);
    return {
      type: "build",
      itemId: entry.id,
      promptText: entry.fr,
      promptLang: "fr",
      answer: entry.pl,
      answerLang: "pl",
      audioText: entry.pl,
      bank: shuffle(bank),
      instruction: "Reconstitue la phrase en polonais"
    };
  }

  function makeCloze(entry) {
    // Cache un mot "intéressant" de la phrase (le plus long, souvent porteur de grammaire).
    var words = (entry.wordBank || entry.pl.split(/\s+/)).slice();
    var idx = 0;
    var maxLen = -1;
    words.forEach(function (w, i) {
      var clean = w.replace(/[.,!?]/g, "");
      if (clean.length > maxLen) {
        maxLen = clean.length;
        idx = i;
      }
    });
    var missing = words[idx].replace(/[.,!?]/g, "");
    var display = words
      .map(function (w, i) {
        return i === idx ? "_____" : w;
      })
      .join(" ");
    return {
      type: "cloze",
      itemId: entry.id,
      promptText: display,
      promptLang: "pl",
      subText: entry.fr,
      answer: missing,
      answerLang: "pl",
      audioText: entry.pl,
      instruction: "Complète le mot manquant"
    };
  }

  /* ---------------------------- correction ---------------------------- */

  function normalize(str) {
    return window.Speech.normalize(str);
  }

  // Vérifie une réponse (hors 'speak' qui est géré par le score vocal).
  function check(exercise, userAnswer) {
    if (exercise.type === "build") {
      // userAnswer est un tableau de mots dans l'ordre choisi
      var got = (userAnswer || []).join(" ");
      return normalize(got) === normalize(exercise.answer);
    }
    return normalize(userAnswer) === normalize(exercise.answer);
  }

  window.Exercises = {
    buildIndex: buildIndex,
    getEntry: getEntry,
    makeMultipleChoice: makeMultipleChoice,
    makeType: makeType,
    makeListen: makeListen,
    makeSpeak: makeSpeak,
    makeBuild: makeBuild,
    makeCloze: makeCloze,
    check: check,
    shuffle: shuffle
  };
})();
