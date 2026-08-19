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
     reading    compréhension : lire un texte suivi, répondre à une question
     write      production libre : traduire ou transformer une phrase (plusieurs
                réponses acceptées)

   Les 4 épreuves des histoires bonus (data/stories.js) sont, elles, écrites à
   la main dans les données — un récit ne se génère pas :
     story-quiz  QCM sur la scène, 1 OU 2 bonnes réponses
     story-build reconstituer la réplique suivante depuis des tuiles
     story-gap   choisir le mot manquant d'une réplique parmi des tuiles
     story-match relier des mots polonais à leur traduction
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

/**
 * @param {Reading} reading
 * @param {ReadingQuestion} question
 * @param {boolean} [autoPlay]
 * @returns {ReadingExercise}
 */
function makeReading(reading, question, autoPlay) {
  // Le passage est toujours en polonais (avec écoute). La langue de la question
  // et des options, elle, appartient à la donnée : `questionLang: "fr"` (le
  // défaut) évalue la compréhension du texte sans y ajouter une difficulté de
  // lecture, façon épreuve de compréhension écrite classique ; `"pl"` fait de la
  // question une partie de l'épreuve, ce qu'exige le niveau B1/B2.
  var qLang = reading.questionLang || "fr";
  /** @type {ReadingExercise} */
  var ex = {
    type: "reading",
    itemId: question.id,
    passage: reading.paragraphs,
    promptText: question.question,
    promptLang: qLang,
    answer: question.answer,
    answerLang: qLang,
    audioText: reading.paragraphs.join(" "),
    options: shuffle(question.options),
    instruction: reading.title
  };
  if (autoPlay) ex.autoPlay = true;
  return ex;
}

/**
 * @param {Production} production
 * @returns {WriteExercise}
 */
function makeWrite(production) {
  return {
    type: "write",
    itemId: production.id,
    promptText: production.prompt,
    promptLang: "fr",
    answer: production.answers[0],
    answerLang: "pl",
    audioText: production.answers[0],
    acceptedAnswers: production.answers,
    hint: production.hint,
    instruction: "Écris ta phrase en polonais"
  };
}

/* ------------------- épreuves d'histoire (data/stories.js) ----------- */

// `sceneTitle` et `context` sont communs aux 4 épreuves : elles s'affichent
// toutes au-dessus des répliques de leur scène.
/**
 * @param {Story} story
 * @param {StoryScene} scene
 * @returns {{ context: StoryLine[], sceneTitle: string }}
 */
function storyShell(story, scene) {
  return { context: scene.lines, sceneTitle: story.title };
}

/**
 * @param {Story} story
 * @param {StoryScene} scene
 * @param {StoryQuizStep} step
 * @returns {StoryQuizExercise}
 */
function makeStoryQuiz(story, scene, step) {
  var shell = storyShell(story, scene);
  return {
    type: "story-quiz",
    itemId: step.id,
    context: shell.context,
    sceneTitle: shell.sceneTitle,
    promptText: step.question,
    promptLang: "pl",
    subText: step.questionFr,
    // `answer` n'est ici qu'un libellé d'AFFICHAGE (le « Réponse : … » du
    // feedback) : la vérité est `answers`, que check() lit dans le cas multiple.
    // D'où la jonction quand il y en a deux — n'en montrer qu'une laisserait
    // croire que l'autre était fausse.
    answer: step.answers.join(" · "),
    answerLang: "pl",
    audioText: step.question,
    options: shuffle(step.options),
    answers: step.answers,
    multi: step.answers.length > 1,
    instruction:
      step.answers.length > 1
        ? "Choisis les DEUX bonnes réponses"
        : "Réponds à la question"
  };
}

/**
 * @param {Story} story
 * @param {StoryScene} scene
 * @param {StoryBuildStep} step
 * @returns {StoryBuildExercise}
 */
function makeStoryBuild(story, scene, step) {
  var shell = storyShell(story, scene);
  return {
    type: "story-build",
    itemId: step.id,
    context: shell.context,
    sceneTitle: shell.sceneTitle,
    promptText: step.fr,
    promptLang: "fr",
    answer: step.pl,
    answerLang: "pl",
    audioText: step.pl,
    bank: shuffle(step.wordBank),
    speaker: step.who,
    instruction: "Reconstitue la réplique qui suit"
  };
}

/**
 * @param {Story} story
 * @param {StoryScene} scene
 * @param {StoryGapStep} step
 * @returns {StoryGapExercise}
 */
function makeStoryGap(story, scene, step) {
  var shell = storyShell(story, scene);
  return {
    type: "story-gap",
    itemId: step.id,
    context: shell.context,
    sceneTitle: shell.sceneTitle,
    promptText: step.sentence,
    promptLang: "pl",
    subText: step.fr,
    answer: step.answer,
    answerLang: "pl",
    // La phrase complète, trou rempli : c'est elle qu'on écoute au feedback,
    // pas la version à trou (« _____ » ne se prononce pas).
    audioText: step.sentence.replace(/_+/, step.answer),
    options: shuffle(step.options),
    speaker: step.who,
    instruction: "Choisis le mot manquant"
  };
}

/**
 * @param {Story} story
 * @param {StoryScene} scene
 * @param {StoryMatchStep} step
 * @returns {StoryMatchExercise}
 */
function makeStoryMatch(story, scene, step) {
  var shell = storyShell(story, scene);
  return {
    type: "story-match",
    itemId: step.id,
    context: shell.context,
    sceneTitle: shell.sceneTitle,
    promptText: "Relie chaque mot polonais à sa traduction.",
    promptLang: "fr",
    // Pas de réponse unique à afficher : `answer` sert le feedback textuel.
    answer: step.pairs
      .map(function (p) {
        return p.pl + " = " + p.fr;
      })
      .join(" · "),
    answerLang: "pl",
    audioText: step.pairs
      .map(function (p) {
        return p.pl;
      })
      .join(", "),
    pairs: step.pairs,
    instruction: "Relie les mots"
  };
}

// Fabrique la bonne épreuve selon `step.kind`. Le `default` en `never` fait
// d'un nouveau `kind` sans fabrique une erreur de compilation, exactement comme
// le switch de renderExercise.
/**
 * @param {Story} story
 * @param {StoryScene} scene
 * @returns {Exercise}
 */
function makeStoryStep(story, scene) {
  var step = scene.step;
  switch (step.kind) {
    case "quiz":
      return makeStoryQuiz(story, scene, step);
    case "build":
      return makeStoryBuild(story, scene, step);
    case "gap":
      return makeStoryGap(story, scene, step);
    case "match":
      return makeStoryMatch(story, scene, step);
    default:
      /** @type {never} */ (step);
      throw new Error("Épreuve d'histoire inconnue");
  }
}

/* ---------------------------- correction ---------------------------- */

/**
 * @param {string|null} [str]
 * @returns {string}
 */
function normalize(str) {
  return Speech.normalize(str);
}

// Égalité d'ENSEMBLES après normalisation : l'ordre de sélection ne compte pas,
// mais ni un sous-ensemble ni un sur-ensemble ne passent.
/**
 * @param {string[]} got
 * @param {string[]} want
 * @returns {boolean}
 */
function sameSet(got, want) {
  var a = got.map(normalize).filter(Boolean);
  var b = want.map(normalize);
  // Dédoublonne `a` : deux clics sur la même option ne doivent pas compenser
  // une réponse manquante.
  var uniques = a.filter(function (x, i) {
    return a.indexOf(x) === i;
  });
  if (uniques.length !== b.length) return false;
  return uniques.every(function (x) {
    return b.indexOf(x) !== -1;
  });
}

// Vérifie une réponse (hors 'speak' qui est géré par le score vocal).
/**
 * @param {Exercise} exercise
 * @param {UserAnswer} userAnswer forme dictée par le type d'exercice (cf. UserAnswer).
 * @returns {boolean}
 */
function check(exercise, userAnswer) {
  if (
    exercise.type === "build" ||
    exercise.type === "dialogue" ||
    exercise.type === "story-build"
  ) {
    // userAnswer est un tableau de mots dans l'ordre choisi
    var mots = Array.isArray(userAnswer) ? userAnswer.map(String) : [];
    return normalize(mots.join(" ")) === normalize(exercise.answer);
  }
  if (exercise.type === "story-quiz" && exercise.multi) {
    /** @type {string[]} */
    var choix = Array.isArray(userAnswer) ? userAnswer.map(String) : [];
    return sameSet(choix, exercise.answers);
  }
  if (exercise.type === "story-match") {
    // Tout ou rien : les 5 paires justes, ou faux. Cohérent avec le `correct`
    // binaire du reste de l'app — il n'existe pas de score partiel.
    var faites = Array.isArray(userAnswer) ? userAnswer : [];
    if (faites.length !== exercise.pairs.length) return false;
    return faites.every(function (/** @type {any} */ p) {
      if (!p || typeof p !== "object") return false;
      return exercise.pairs.some(function (attendue) {
        return (
          normalize(attendue.pl) === normalize(p.pl) &&
          normalize(attendue.fr) === normalize(p.fr)
        );
      });
    });
  }
  var saisie = typeof userAnswer === "string" ? userAnswer : "";
  if (exercise.type === "write") {
    var voulue = normalize(saisie);
    return exercise.acceptedAnswers.some(function (a) {
      return normalize(a) === voulue;
    });
  }
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
  makeReading: makeReading,
  makeWrite: makeWrite,
  makeStoryStep: makeStoryStep,
  check: check,
  shuffle: shuffle
};
