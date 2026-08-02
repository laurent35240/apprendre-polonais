// @ts-check
/* =====================================================================
   PROGRESS — les intentions de progression
   ---------------------------------------------------------------------
   Une couche de TRANSACTION au-dessus des moteurs de règles. Chaque fonction
   représente une intention utilisateur : elle applique la mutation complète,
   déclare les chemins modifiés et programme l'écriture. Les 32 sites d'écriture
   dispersés dans app.js, gamification.js et srs.js se ramènent à 9 intentions
   (7 à l'origine, plus les 2 des histoires bonus).

   Pourquoi un module SÉPARÉ et non state.js : `answerRecorded` doit créditer
   l'XP et `sessionFinished` toucher le streak et les badges. Les mettre dans
   state.js créerait le cycle State ⇄ Gamification que CLAUDE.md documente comme
   absent. Position dans le DAG : gamification → progress → exercises.

   Ce module n'importe PAS UI : il renvoie des FAITS (`leveledUp`, `goalJustMet`,
   `newBadges`) et app.js décide des toasts et des confettis. C'est ce qui le
   rend testable sans DOM.

   Ce que ça règle dès maintenant, hors préparation Firebase :
   - le piège d'alias (State.reset()/importJSON() REMPLACENT l'objet, donc un
     `var s = State.get()` capturé au rendu devient orphelin) devient
     structurellement impossible : chaque intention relit State.get() ;
   - les 4 réglages sont validés, contre un seul auparavant — parseFloat et
     parseInt pouvaient écrire NaN dans l'état sans que rien ne l'arrête ;
   - l'ensemble d'écriture devient une spécification exécutable, via dirtyPaths.
   ===================================================================== */
import { State } from "./state.js";
import { SRS } from "./srs.js";
import { Gamification } from "./gamification.js";

/**
 * Une réponse à un exercice. UNE transaction : SRS + XP + niveau.
 * @param {string} itemId
 * @param {boolean} correct
 * @returns {{item: SrsItem, xpGained: number, leveledUp: boolean, level: number}}
 */
function answerRecorded(itemId, correct) {
  var item = SRS.record(itemId, correct);
  State.touch("items." + itemId);
  var xpGained = 0;
  var leveledUp = false;
  if (correct) {
    xpGained = Gamification.XP_PER_CORRECT;
    // addXP touche `profile` et programme déjà une écriture ; les deux se
    // coalescent dans la même fenêtre. C'est ce qui a fait tomber les 2 setItem
    // par bonne réponse à 1.
    leveledUp = Gamification.addXP(xpGained);
  }
  State.scheduleSave();
  return {
    item: item,
    xpGained: xpGained,
    leveledUp: leveledUp,
    level: State.get().profile.level
  };
}

/**
 * Fin de session : streak, puis — si c'est une leçon — meilleur score, statut,
 * bonus d'XP et déverrouillage de la suivante.
 * @param {string|null} lessonId null pour une session de révision.
 * @param {number} pct score 0-100.
 * @returns {{lessonJustCompleted: boolean, xpGained: number, leveledUp: boolean, level: number, newBadges: Badge[]}}
 */
function sessionFinished(lessonId, pct) {
  Gamification.touchActivity();

  var lessonJustCompleted = false;
  var xpGained = 0;
  var leveledUp = false;

  if (lessonId) {
    var lst = State.get().lessons[lessonId];
    // La garde est conservée bien qu'ensureLessonStatuses garantisse une entrée
    // par leçon connue : ce palier ne change aucun comportement, même devenu
    // inatteignable.
    if (lst) {
      lst.bestScore = Math.max(lst.bestScore || 0, pct);
      if (pct >= 60) {
        if (lst.status !== "completed") lessonJustCompleted = true;
        lst.status = "completed";
        xpGained = Gamification.XP_LESSON_BONUS;
        leveledUp = Gamification.addXP(xpGained);
      } else if (lst.status === "available") {
        lst.status = "inProgress";
      }
      State.ensureLessonStatuses();
      State.touch("lessons");
      // La fin d'une leçon est un jalon : on ne la laisse pas en attente.
      State.flush();
    }
  }

  return {
    lessonJustCompleted: lessonJustCompleted,
    xpGained: xpGained,
    leveledUp: leveledUp,
    level: State.get().profile.level,
    newBadges: Gamification.checkBadges()
  };
}

/* --------------------- histoires bonus (data/stories.js) --------------- */

/**
 * Une réponse dans une histoire bonus. Crédite l'XP, et RIEN d'autre.
 *
 * Pas de `SRS.record` ni de `State.touch("items.…")`, contrairement à
 * `answerRecorded` : les ids d'épreuve n'existent pas dans l'index d'exercices
 * (`Exercises.buildIndex` ne parcourt que POLISH_LESSONS), donc
 * `buildReviewSession` les ignorerait silencieusement pour toujours. Les
 * enregistrer ne créerait que du poids mort — dans localStorage ET dans le
 * document Firestore. C'est `tests/progress.test.js` qui verrouille l'absence
 * d'`items` dans l'ensemble d'écriture.
 * @param {boolean} correct
 * @returns {{xpGained: number, leveledUp: boolean, level: number}}
 */
function storyAnswerRecorded(correct) {
  var xpGained = 0;
  var leveledUp = false;
  if (correct) {
    xpGained = Gamification.XP_PER_CORRECT;
    leveledUp = Gamification.addXP(xpGained);
  }
  State.scheduleSave();
  return {
    xpGained: xpGained,
    leveledUp: leveledUp,
    level: State.get().profile.level
  };
}

/**
 * Fin d'une histoire bonus. Miroir de `sessionFinished` avec deux différences
 * assumées :
 *
 * 1. L'entrée `lessons[storyId]` est CRÉÉE ICI si elle manque — c'est le seul
 *    endroit du code qui la crée. Rien ne la crée au chargement (pas
 *    d'`ensureStoryStatuses`), sinon `load()` → `save()` ajouterait une clé à
 *    toute sauvegarde existante et le test d'égalité octet de
 *    `tests/state-load.test.js` rougirait à juste titre.
 * 2. Pas d'appel à `ensureLessonStatuses()` : une histoire est un bonus, elle
 *    ne doit RIEN déverrouiller. C'est aussi pourquoi elle n'est pas dans
 *    POLISH_LESSONS (cf. CLAUDE.md § Histoires bonus).
 * @param {string} storyId
 * @param {number} pct score 0-100.
 * @returns {{storyJustCompleted: boolean, xpGained: number, leveledUp: boolean, level: number, newBadges: Badge[]}}
 */
function storyFinished(storyId, pct) {
  Gamification.touchActivity();

  var lessons = State.get().lessons;
  var st = lessons[storyId];
  if (!st) {
    st = { status: "available", bestScore: 0 };
    lessons[storyId] = st;
  }

  var storyJustCompleted = false;
  var xpGained = 0;
  var leveledUp = false;

  st.bestScore = Math.max(st.bestScore || 0, pct);
  if (pct >= 60) {
    if (st.status !== "completed") storyJustCompleted = true;
    st.status = "completed";
    xpGained = Gamification.XP_LESSON_BONUS;
    leveledUp = Gamification.addXP(xpGained);
  } else if (st.status !== "completed") {
    st.status = "inProgress";
  }

  State.touch("lessons");
  // Jalon, comme la fin d'une leçon : on ne laisse pas l'écriture en attente.
  State.flush();

  return {
    storyJustCompleted: storyJustCompleted,
    xpGained: xpGained,
    leveledUp: leveledUp,
    level: State.get().profile.level,
    newBadges: Gamification.checkBadges()
  };
}

/**
 * Temps passé sur l'app. Gère le bonus d'objectif quotidien, dont
 * `goalMetToday` est le verrou d'idempotence — et non un cache.
 * @param {number} seconds
 * @returns {{goalJustMet: boolean, newBadges: Badge[]}}
 */
function timeSpent(seconds) {
  var res = Gamification.addTime(seconds);
  return {
    goalJustMet: res.goalJustMet,
    newBadges: res.goalJustMet ? Gamification.checkBadges() : []
  };
}

/**
 * Passage de jour explicite. Écrit immédiatement (cf. State.rolloverDay).
 * @returns {void}
 */
function dayRolledOver() {
  State.rolloverDay();
}

/**
 * Prononciation parfaite : lève le drapeau du badge.
 * @returns {{newBadges: Badge[]}}
 */
function pronunciationPerfect() {
  Gamification.markPerfectPronunciation();
  return { newBadges: Gamification.checkBadges() };
}

/* --------------------------- réglages --------------------------------- */

var THEMES = ["auto", "light", "dark"];

/**
 * Un réglage. La validation vit ICI et non dans le listener DOM : c'est ce qui
 * supprime le piège d'alias, et ce qui étend la validation aux 4 réglages alors
 * que seul le thème était contrôlé (parseFloat et parseInt peuvent rendre NaN).
 * @param {"theme"|"soundOn"|"ttsRate"|"minutesTarget"} key
 * @param {unknown} value
 * @returns {{applied: boolean}} false si la valeur a été refusée.
 */
function settingChanged(key, value) {
  var s = State.get();
  switch (key) {
    case "theme":
      if (typeof value !== "string" || THEMES.indexOf(value) === -1) {
        return { applied: false };
      }
      s.settings.theme = /** @type {Theme} */ (value);
      State.touch("settings");
      break;
    case "soundOn":
      if (typeof value !== "boolean") return { applied: false };
      s.settings.soundOn = value;
      State.touch("settings");
      break;
    case "ttsRate": {
      var r = typeof value === "number" ? value : Number(value);
      if (!Number.isFinite(r) || r < 0.5 || r > 1.2) return { applied: false };
      s.settings.ttsRate = r;
      State.touch("settings");
      break;
    }
    case "minutesTarget": {
      var m = typeof value === "number" ? value : Number(value);
      if (!Number.isFinite(m) || m < 1 || m > 1440) return { applied: false };
      s.dailyGoal.minutesTarget = Math.round(m);
      State.touch("dailyGoal");
      break;
    }
    default:
      /** @type {never} */ (key);
      return { applied: false };
  }
  State.scheduleSave();
  return { applied: true };
}

/* ----------------------- sauvegarde manuelle -------------------------- */

/**
 * Remplace la progression par un fichier importé. Écrasement intentionnel :
 * lève le mode lecture seule. Propage les erreurs pour que l'appelant puisse
 * distinguer « illisible » de « trop récent ».
 * @param {string} text
 * @returns {{state: PersistedState, repairs: string[]}}
 */
function progressImported(text) {
  return State.importJSON(text);
}

/** @returns {PersistedState} */
function progressReset() {
  return State.reset();
}

/* ----------------------- synchro multi-appareils ----------------------- */

/**
 * Fusionne une sauvegarde distante (palier 4, Firebase) dans l'état local, au
 * lieu de le REMPLACER comme progressImported. State.mergeRemote fait le gros
 * du travail (parse, validation, fusion par champ) mais laisse `level`
 * provisoire et ne vérifie pas les badges — ce sont des préoccupations de
 * Gamification, que state.js ne doit pas importer (même contrainte de DAG que
 * pour answerRecorded/sessionFinished, cf. l'en-tête du module).
 *
 * `Gamification.addXP(0)` recalcule `level` depuis le `totalXP` fusionné sans
 * nouvelle API : ajouter zéro ne change pas le total, mais la fonction
 * recalcule quand même le niveau à partir de lui.
 *
 * Une fusion est un JALON, comme sessionFinished : flush immédiat, pas de
 * throttle — l'appareil distant doit voir le résultat sans attendre 3 s.
 *
 * ⚠️ Ne touche/flush QUE si la fusion a RÉELLEMENT changé quelque chose
 * (comparaison par valeur avant/après). C'est cette garde, et non la seule
 * idempotence de State._merge, qui arrête la boucle push→pull→push : sans
 * elle, un écho Firestore (un appareil qui reçoit sa propre écriture en
 * retour) fusionnerait un état avec lui-même — un no-op en VALEUR — mais
 * déclencherait quand même un save() puis un nouveau push, indéfiniment.
 * La comparaison JSON brute est sûre ici (pas besoin de trier les clés) :
 * tout état de cette app est construit par defaultState()/validate()/
 * mergeStates, qui posent toujours les clés dans le même ordre.
 * @param {string} remoteText
 * @returns {{repairs: string[], leveledUp: boolean, newBadges: Badge[]}}
 * @throws {SyntaxError|InvalidSaveError|FutureVersionError} propagés depuis
 *   State.mergeRemote, à traiter comme importSave() le fait déjà pour
 *   progressImported.
 */
function cloudMerged(remoteText) {
  var avant = JSON.stringify(State.get());
  var xpAvant = State.get().profile.totalXP;
  var m = State.mergeRemote(remoteText);
  if (JSON.stringify(State.get()) === avant) {
    return { repairs: m.repairs, leveledUp: false, newBadges: [] };
  }
  var leveledUp = Gamification.addXP(0);
  var newBadges = Gamification.checkBadges();
  State.touch("profile");
  State.touch("streak");
  State.touch("dailyGoal");
  State.touch("items");
  State.touch("lessons");
  State.touch("badges");
  State.touch("flags");
  State.flush();
  return {
    repairs: m.repairs,
    // leveledUp ne peut être vrai que si le total a effectivement bougé ;
    // sur un merge(s, s) (écho), addXP(0) ne change rien et renvoie false.
    leveledUp: leveledUp && State.get().profile.totalXP > xpAvant,
    newBadges: newBadges
  };
}

export const Progress = {
  answerRecorded: answerRecorded,
  sessionFinished: sessionFinished,
  storyAnswerRecorded: storyAnswerRecorded,
  storyFinished: storyFinished,
  timeSpent: timeSpent,
  dayRolledOver: dayRolledOver,
  pronunciationPerfect: pronunciationPerfect,
  settingChanged: settingChanged,
  progressImported: progressImported,
  progressReset: progressReset,
  cloudMerged: cloudMerged
};
