// @ts-check
/* =====================================================================
   PROGRESS — les intentions de progression
   ---------------------------------------------------------------------
   Une couche de TRANSACTION au-dessus des moteurs de règles. Chaque fonction
   représente une intention utilisateur : elle applique la mutation complète,
   déclare les chemins modifiés et programme l'écriture. Les 32 sites d'écriture
   dispersés dans app.js, gamification.js et srs.js se ramènent à 7 intentions.

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
 * @param {string} remoteText
 * @returns {{repairs: string[], leveledUp: boolean, newBadges: Badge[]}}
 * @throws {SyntaxError|InvalidSaveError|FutureVersionError} propagés depuis
 *   State.mergeRemote, à traiter comme importSave() le fait déjà pour
 *   progressImported.
 */
function cloudMerged(remoteText) {
  var xpAvant = State.get().profile.totalXP;
  var m = State.mergeRemote(remoteText);
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
  timeSpent: timeSpent,
  dayRolledOver: dayRolledOver,
  pronunciationPerfect: pronunciationPerfect,
  settingChanged: settingChanged,
  progressImported: progressImported,
  progressReset: progressReset,
  cloudMerged: cloudMerged
};
