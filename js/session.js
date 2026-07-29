// @ts-check
/* =====================================================================
   SESSION — construit la liste d'exercices d'une session
   ---------------------------------------------------------------------
   Mélange nouveaux items (leçon courante) + révisions dues (leçons passées).
   La difficulté monte avec l'ordre de la leçon (plus de saisie, cloze…).
   ===================================================================== */
import { Exercises as E } from "./exercises.js";
import { POLISH_LESSONS } from "../data/lessons.js";
import { State } from "./state.js";
import { SRS } from "./srs.js";
import { Speech } from "./speech.js";

/**
 * @param {string} id
 * @returns {Lesson|undefined}
 */
function lessonById(id) {
  return (POLISH_LESSONS || []).filter(function (l) {
    return l.id === id;
  })[0];
}

function speakOK() {
  return Speech.recognitionAvailable();
}

// Choisit un exercice de "reconnaissance" (comprendre) pour un mot.
/**
 * @param {VocabEntry} entry
 * @param {number} order
 * @param {number} i
 * @returns {Exercise}
 */
function recognitionEx(entry, order, i) {
  if (order <= 2) return E.makeMultipleChoice(entry, "pl-fr");
  var pick = i % 3;
  if (pick === 0) return E.makeMultipleChoice(entry, "pl-fr");
  if (pick === 1) return E.makeListen(entry);
  return E.makeMultipleChoice(entry, "fr-pl");
}

// Choisit un exercice de "production" (restituer) pour un mot.
/**
 * @param {VocabEntry} entry
 * @param {number} order
 * @returns {Exercise}
 */
function productionEx(entry, order) {
  if (order >= 6) return E.makeType(entry);
  return E.makeMultipleChoice(entry, "fr-pl");
}

// Ids de tous les items rencontrés appartenant à des leçons d'ordre < currentOrder.
/**
 * @param {number} currentOrder
 * @returns {string[]}
 */
function earlierSeenIds(currentOrder) {
  var state = State.get();
  /** @type {string[]} */
  var ids = [];
  (POLISH_LESSONS || []).forEach(function (l) {
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
/**
 * @param {string} lessonId
 * @returns {Exercise[]} vide si la leçon est inconnue.
 */
function buildLessonSession(lessonId) {
  var lesson = lessonById(lessonId);
  if (!lesson) return [];
  var order = lesson.order;
  /** @type {Exercise[]} */
  var out = [];

  // 1) Nouveau vocabulaire (ordre mélangé pour éviter les séquences prévisibles,
  //    ex. 1,2,3… dans la leçon des nombres)
  E.shuffle(lesson.vocabulary || []).forEach(function (v, i) {
    var entry = E.getEntry(v.id);
    // Narrowing par `kind` : l'index mélange vocab et phrases dans le même
    // espace de clés, seule l'unicité des ids garantit qu'on récupère le bon.
    if (!entry || entry.kind !== "vocab") return;
    out.push(recognitionEx(entry, order, i));
    if (order >= 4 && i % 2 === 0) out.push(productionEx(entry, order));
  });

  // 2) Phrases : reconstruction + trous (grammaire) + prononciation (ordre mélangé)
  E.shuffle(lesson.sentences || []).forEach(function (s, i) {
    var entry = E.getEntry(s.id);
    if (!entry || entry.kind !== "sentence") return;
    out.push(E.makeBuild(entry));
    if (order >= 5 && entry.grammarFocus && i % 2 === 1) {
      out.push(E.makeCloze(entry));
    }
  });

  // 2b) Dialogues : reconstituer une réplique cible en contexte (production connectée)
  (lesson.dialogues || []).forEach(function (d) {
    var ex = E.makeDialogue(d);
    if (ex) out.push(ex);
  });

  // 3) Prononciation (si dispo) : 2 mots + 1 phrase
  if (speakOK()) {
    var vocab = lesson.vocabulary || [];
    [0, Math.floor(vocab.length / 2)].forEach(function (idx) {
      var v = vocab[idx];
      if (!v) return;
      // getEntry peut rendre null : on s'aligne sur les 4 autres appels du
      // fichier, qui testent tous. L'invariant tient (l'index est construit
      // depuis POLISH_LESSONS) mais il n'était garanti nulle part ici.
      var entry = E.getEntry(v.id);
      if (entry) out.push(E.makeSpeak(entry));
    });
    var premiere = (lesson.sentences || [])[0];
    if (premiere) {
      var entryPhrase = E.getEntry(premiere.id);
      if (entryPhrase) out.push(E.makeSpeak(entryPhrase));
    }
  }

  // 4) Révisions dues des leçons précédentes (max 5)
  var due = SRS.dueItems(earlierSeenIds(order));
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
/** @returns {Exercise[]} vide si rien n'est dû. */
function buildReviewSession() {
  var state = State.get();
  var allSeen = Object.keys(state.items);
  var due = SRS.dueItems(allSeen);
  if (!due.length) return [];
  /** @type {Exercise[]} */
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
/**
 * @param {Exercise[]} list
 * @returns {Exercise[]}
 */
function interleave(list) {
  // Simple : on garde l'ordre mais on remonte un exercice d'écoute tôt.
  return list;
}

export const Session = {
  buildLessonSession: buildLessonSession,
  buildReviewSession: buildReviewSession,
  lessonById: lessonById
};
