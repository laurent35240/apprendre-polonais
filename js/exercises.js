// @ts-check
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
     dialogue   reconstituer la réplique cible d'un mini-dialogue en contexte
   ===================================================================== */
import { POLISH_LESSONS } from "../data/lessons.js";
import { Speech } from "./speech.js";

/** @type {Record<string, IndexEntry|undefined>|null} */
var _index = null; // itemId -> { id, pl, fr, kind, lessonId, category, wordBank }
/** @type {VocabEntry[]|null} */
var _vocabPool = null; // array de toutes les entrées vocab (pour distracteurs)

/** @returns {Record<string, IndexEntry|undefined>} */
function buildIndex() {
  if (_index) return _index;
  // On construit dans des locales avant de publier dans les variables de
  // module : le narrowing de `_index` ne survivrait pas aux closures ci-dessous.
  /** @type {Record<string, IndexEntry|undefined>} */
  var idx = {};
  /** @type {VocabEntry[]} */
  var pool = [];
  (POLISH_LESSONS || []).forEach(function (lesson) {
    (lesson.vocabulary || []).forEach(function (v) {
      /** @type {VocabEntry} */
      var entry = {
        id: v.id,
        pl: v.pl,
        fr: v.fr,
        kind: "vocab",
        lessonId: lesson.id,
        category: v.category || "divers",
        example: v.example || null
      };
      idx[v.id] = entry;
      pool.push(entry);
    });
    (lesson.sentences || []).forEach(function (s) {
      /** @type {SentenceEntry} */
      var entry = {
        id: s.id,
        pl: s.pl,
        fr: s.fr,
        kind: "sentence",
        lessonId: lesson.id,
        wordBank: s.wordBank || s.pl.split(/\s+/),
        grammarFocus: s.grammarFocus || null
      };
      idx[s.id] = entry;
    });
  });
  _index = idx;
  _vocabPool = pool;
  return _index;
}

/**
 * @param {string} itemId
 * @returns {IndexEntry|null}
 */
function getEntry(itemId) {
  return buildIndex()[itemId] || null;
}

/* --------------------------- utilitaires ---------------------------- */

// Mélange (Fisher-Yates) — déterministe pas requis ici.
/**
 * @template T
 * @param {T[]} arr
 * @returns {T[]}
 */
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
/**
 * @param {"pl"|"fr"} field
 * @param {VocabEntry} correctEntry
 * @param {number} n
 * @returns {string[]}
 */
function distractors(field, correctEntry, n) {
  buildIndex();
  var vocabPool = _vocabPool || [];
  var correctVal = correctEntry[field];
  var sameCat = vocabPool.filter(function (e) {
    return (
      e.id !== correctEntry.id &&
      e.category === correctEntry.category &&
      e[field] !== correctVal
    );
  });
  var others = vocabPool.filter(function (e) {
    return e.id !== correctEntry.id && e[field] !== correctVal;
  });
  var pool = shuffle(sameCat).concat(shuffle(others));
  /** @type {Record<string, boolean>} */
  var seen = {};
  /** @type {string[]} */
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

/**
 * @param {VocabEntry} entry
 * @param {"pl-fr"|"fr-pl"} direction
 * @returns {McExercise}
 */
function makeMultipleChoice(entry, direction) {
  // direction: 'pl-fr' (montre pl, choisir fr) ou 'fr-pl'
  /** @type {"pl"|"fr"} */
  var showField = direction === "pl-fr" ? "pl" : "fr";
  /** @type {"pl"|"fr"} */
  var answerField = direction === "pl-fr" ? "fr" : "pl";
  var answer = entry[answerField];
  var opts = shuffle(distractors(answerField, entry, 3).concat([answer]));
  return {
    type: direction === "pl-fr" ? "mc-pl-fr" : "mc-fr-pl",
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

/**
 * @param {VocabEntry} entry
 * @returns {TypeExercise}
 */
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

/**
 * @param {VocabEntry} entry
 * @returns {ListenExercise}
 */
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
    options: opts,
    autoPlay: true,
    instruction: "Qu'as-tu entendu ?"
  };
}

/**
 * @param {IndexEntry} entry
 * @returns {SpeakExercise}
 */
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

/**
 * @param {SentenceEntry} entry
 * @returns {BuildExercise}
 */
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

/**
 * @param {Dialogue} dlg
 * @returns {DialogueExercise|null} null si aucune ligne `target`.
 */
function makeDialogue(dlg) {
  // Mini-dialogue : une réplique "cible" à reconstituer depuis une banque de mots,
  // les autres répliques servent de contexte (affichées, non notées).
  var target = (dlg.lines || []).filter(function (l) { return l.target; })[0];
  if (!target) return null;
  var bank = target.wordBank || target.pl.split(/\s+/);
  return {
    type: "dialogue",
    itemId: dlg.id,
    context: dlg.lines,
    title: dlg.title || "",
    promptText: target.fr,
    promptLang: "fr",
    answer: target.pl,
    answerLang: "pl",
    audioText: target.pl,
    bank: shuffle(bank),
    instruction: "Complète la réplique manquante du dialogue",
    speaker: target.who
  };
}

/**
 * @param {SentenceEntry} entry
 * @returns {ClozeExercise}
 */
function makeCloze(entry) {
  // Cache un mot "intéressant" de la phrase (le plus long, souvent porteur de grammaire).
  // On utilise toujours la phrase réelle (entry.pl), jamais le wordBank qui peut
  // contenir des distracteurs destinés uniquement à l'exercice "build".
  var words = entry.pl.split(/\s+/);
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

/**
 * @param {string|null} [str]
 * @returns {string}
 */
function normalize(str) {
  return Speech.normalize(str);
}

// Vérifie une réponse (hors 'speak' qui est géré par le score vocal).
/**
 * @param {Exercise} exercise
 * @param {string|string[]|null} userAnswer tableau pour build/dialogue, chaîne sinon.
 * @returns {boolean}
 */
function check(exercise, userAnswer) {
  if (exercise.type === "build" || exercise.type === "dialogue") {
    // userAnswer est un tableau de mots dans l'ordre choisi
    var mots = Array.isArray(userAnswer) ? userAnswer : [];
    return normalize(mots.join(" ")) === normalize(exercise.answer);
  }
  var saisie = typeof userAnswer === "string" ? userAnswer : "";
  return normalize(saisie) === normalize(exercise.answer);
}

export const Exercises = {
  buildIndex: buildIndex,
  getEntry: getEntry,
  makeMultipleChoice: makeMultipleChoice,
  makeType: makeType,
  makeListen: makeListen,
  makeSpeak: makeSpeak,
  makeBuild: makeBuild,
  makeCloze: makeCloze,
  makeDialogue: makeDialogue,
  check: check,
  shuffle: shuffle
};
