// @ts-check
/* =====================================================================
   STATE — modèle de progression + persistance localStorage
   ===================================================================== */
import { POLISH_LESSONS } from "../data/lessons.js";

var STORAGE_KEY = "polski-zubr-v1";
var CURRENT_VERSION = 1;

/* ===================== validation de la sauvegarde =====================
   Le JSON vient de localStorage ou d'un import utilisateur : rien ne garantit
   sa forme. Politique retenue : RÉPARER champ par champ en journalisant, et non
   rejeter en bloc — sur un seul champ abîmé, rejeter détruirait toute la
   progression. C'était déjà la politique de fait de l'ancien migrate(), en
   incomplet et en muet ; elle devient correcte et observable via status().

   La copie se fait par LISTE BLANCHE des 9 clés connues, jamais par
   Object.assign sur la source. Ça règle d'un seul geste trois problèmes :
   - un tableau à la place d'un objet (`items: []` est truthy, accepte les clés
     string, et l'app fonctionne — puis JSON.stringify ignore les propriétés
     non-indicielles, donc chaque save() réécrit [] : perte totale SANS le
     moindre symptôme) ;
   - les clés parasites (`Object.assign({}, d, "abc")` injecte {0:"a",1:"b"…}) ;
   - un `__proto__` dans le JSON, qui remplacerait le prototype de l'objet
     d'état (localement — Object.prototype n'est pas touché).
   ===================================================================== */

var ROOT_KEYS = [
  "version", "profile", "streak", "dailyGoal", "items", "lessons", "badges",
  "flags", "settings"
];
var LESSON_STATUSES = ["locked", "available", "inProgress", "completed"];
var THEMES = ["auto", "light", "dark"];
// Dupliqué depuis SRS.MAX_BOX : le DAG va state → srs, l'importer créerait un
// cycle. Un test d'invariant verrouille l'égalité des deux constantes.
var MAX_BOX_PERSISTED = 5;

/** @param {any} v @returns {boolean} objet ordinaire — les TABLEAUX sont exclus. */
function isPlainObject(v) {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** @param {any} v @returns {string} étiquette courte pour le journal. */
function describe(v) {
  if (v === null) return "null";
  if (Array.isArray(v)) return "tableau(" + v.length + ")";
  return typeof v;
}

/**
 * @param {any} v @param {number} def @param {number} min @param {number} max
 * @returns {number}
 */
function num(v, def, min, max) {
  if (typeof v !== "number" || !Number.isFinite(v)) return def;
  return Math.min(max, Math.max(min, v));
}

/**
 * @param {any} v @param {number} def @param {number} min @param {number} max
 * @returns {number}
 */
function int(v, def, min, max) {
  return Math.round(num(v, def, min, max));
}

/** @param {any} v @param {boolean} def @returns {boolean} */
function bool(v, def) {
  return typeof v === "boolean" ? v : def;
}

var DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * @template {string|null} T
 * @param {any} v @param {T} def
 * @returns {string|T}
 */
function dateStr(v, def) {
  return typeof v === "string" && DATE_RE.test(v) ? v : def;
}

/**
 * Normalise un JSON non fiable vers un PersistedState valide, en préservant le
 * maximum de progression. Ne lève jamais, n'écrit rien.
 * @param {any} loaded
 * @returns {{state: PersistedState, repairs: string[]}}
 */
function validate(loaded) {
  /** @type {string[]} */
  var rep = [];
  var out = defaultState();

  // Seul rejet en bloc : une racine qui n'est pas un objet ordinaire ne
  // contient rien à sauver. C'est ce qui neutralise `"abc"`, `[]`, `null`, `0`.
  if (!isPlainObject(loaded)) {
    rep.push("racine: " + describe(loaded) + " → état par défaut");
    return { state: out, repairs: rep };
  }

  Object.keys(loaded).forEach(function (k) {
    if (ROOT_KEYS.indexOf(k) === -1) {
      rep.push("clé racine inconnue abandonnée: " + k);
    }
  });

  /** @param {string} nom @returns {any} */
  function sousObjet(nom) {
    var v = loaded[nom];
    if (isPlainObject(v)) return v;
    if (v !== undefined) rep.push(nom + ": " + describe(v) + " → défauts");
    return {};
  }

  var p = sousObjet("profile");
  if (typeof p.createdAt === "string") out.profile.createdAt = p.createdAt;
  out.profile.totalXP = int(p.totalXP, 0, 0, Number.MAX_SAFE_INTEGER);
  out.profile.level = int(p.level, 1, 1, Number.MAX_SAFE_INTEGER);

  var st = sousObjet("streak");
  out.streak.current = int(st.current, 0, 0, 100000);
  out.streak.longest = int(st.longest, 0, 0, 100000);
  out.streak.lastActiveDate = dateStr(st.lastActiveDate, null);

  var g = sousObjet("dailyGoal");
  out.dailyGoal.minutesTarget = int(g.minutesTarget, 30, 1, 1440);
  out.dailyGoal.todayDate = dateStr(g.todayDate, todayStr());
  out.dailyGoal.secondsToday = int(g.secondsToday, 0, 0, 86400);
  out.dailyGoal.goalMetToday = bool(g.goalMetToday, false);

  var f = sousObjet("flags");
  out.flags.perfectPronunciation = bool(f.perfectPronunciation, false);
  out.flags.everMetDailyGoal = bool(f.everMetDailyGoal, false);

  var se = sousObjet("settings");
  out.settings.ttsRate = num(se.ttsRate, 0.9, 0.5, 1.2);
  out.settings.voiceName =
    typeof se.voiceName === "string" && se.voiceName ? se.voiceName : null;
  out.settings.soundOn = bool(se.soundOn, true);
  out.settings.theme =
    THEMES.indexOf(se.theme) !== -1 ? se.theme : "auto";

  // items : le cœur de la progression. Les ids inconnus du code sont CONSERVÉS
  // — un id absent aujourd'hui peut revenir, l'abandonner serait une perte.
  out.items = {};
  if (isPlainObject(loaded.items)) {
    Object.keys(loaded.items).forEach(function (id) {
      var it = loaded.items[id];
      if (!isPlainObject(it)) {
        rep.push("items[" + id + "]: " + describe(it) + " → abandonné");
        return;
      }
      out.items[id] = {
        box: int(it.box, 1, 1, MAX_BOX_PERSISTED),
        dueDate: dateStr(it.dueDate, todayStr()),
        seenCount: int(it.seenCount, 0, 0, Number.MAX_SAFE_INTEGER),
        correctCount: int(it.correctCount, 0, 0, Number.MAX_SAFE_INTEGER),
        lastSeen: dateStr(it.lastSeen, null)
      };
    });
  } else if (loaded.items !== undefined) {
    rep.push("items: " + describe(loaded.items) + " → vidé");
  }

  // lessons : une entrée invalide est ABANDONNÉE et non rustinée —
  // ensureLessonStatuses() la recréera avec la règle standard, ce qui est
  // toujours plus juste que de deviner un statut.
  out.lessons = {};
  if (isPlainObject(loaded.lessons)) {
    Object.keys(loaded.lessons).forEach(function (id) {
      var l = loaded.lessons[id];
      if (!isPlainObject(l)) {
        rep.push("lessons[" + id + "]: " + describe(l) + " → abandonné");
        return;
      }
      if (LESSON_STATUSES.indexOf(l.status) === -1) {
        rep.push(
          "lessons[" + id + "].status invalide (" + describe(l.status) + ") → abandonné"
        );
        return;
      }
      out.lessons[id] = { status: l.status, bestScore: int(l.bestScore, 0, 0, 100) };
    });
  } else if (loaded.lessons !== undefined) {
    rep.push("lessons: " + describe(loaded.lessons) + " → vidé");
  }

  // badges : tableau de chaînes uniques. Les ids inconnus sont gardés, pour
  // qu'un badge retiré puis remis ne soit pas re-notifié.
  out.badges = [];
  if (Array.isArray(loaded.badges)) {
    loaded.badges.forEach(function (/** @type {any} */ b) {
      if (typeof b === "string" && b && out.badges.indexOf(b) === -1) {
        out.badges.push(b);
      } else {
        rep.push("badges: entrée ignorée (" + describe(b) + ")");
      }
    });
  } else if (loaded.badges !== undefined) {
    rep.push("badges: " + describe(loaded.badges) + " → vidé");
  }

  out.version = CURRENT_VERSION;
  return { state: out, repairs: rep };
}

/**
 * Date au format "YYYY-MM-DD", en heure LOCALE (choix assumé : c'est ce que
 * l'utilisateur perçoit comme « aujourd'hui »).
 * @param {Date} [d]
 * @returns {string}
 */
function todayStr(d) {
  d = d || new Date();
  // Date locale au format YYYY-MM-DD
  var y = d.getFullYear();
  var m = String(d.getMonth() + 1).padStart(2, "0");
  var day = String(d.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + day;
}

/** @returns {PersistedState} */
function defaultState() {
  return {
    version: CURRENT_VERSION,
    profile: { createdAt: new Date().toISOString(), totalXP: 0, level: 1 },
    streak: { current: 0, longest: 0, lastActiveDate: null },
    dailyGoal: {
      minutesTarget: 30,
      todayDate: todayStr(),
      secondsToday: 0,
      goalMetToday: false
    },
    items: {}, // itemId -> { box, dueDate, seenCount, correctCount, lastSeen }
    lessons: {}, // lessonId -> { status, bestScore }
    badges: [], // badgeId[]
    flags: {
      perfectPronunciation: false,
      everMetDailyGoal: false
    },
    settings: {
      ttsRate: 0.9,
      voiceName: null,
      soundOn: true,
      theme: "auto" // auto | light | dark
    }
  };
}

// Initialisé dès l'évaluation du module plutôt qu'à `null` : `get()` ne peut
// donc jamais renvoyer null, ce qui évite ~70 gardes mortes chez les
// appelants. load() écrase aussitôt cette valeur, elle n'est jamais observée.
var state = defaultState();

/**
 * Résultat du dernier chargement : ce qui a été réparé, et depuis quelle
 * version. Consommé par app.js pour informer l'utilisateur.
 * @type {LoadStatus}
 */
var status = { mode: "normal", loadedVersion: CURRENT_VERSION, repairs: [] };

/** @returns {LoadStatus} */
function getStatus() {
  return status;
}

function load() {
  var raw = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    raw = null;
  }
  if (!raw) {
    state = defaultState();
  } else {
    try {
      var m = migrate(JSON.parse(raw));
      state = m.state;
      status = {
        mode: "normal",
        loadedVersion: CURRENT_VERSION,
        repairs: m.repairs
      };
      if (m.repairs.length) {
        console.warn("Sauvegarde réparée au chargement :", m.repairs);
      }
    } catch (e) {
      console.warn("Sauvegarde illisible, réinitialisation.", e);
      state = defaultState();
    }
  }
  // DANS un try : ces deux appels écrivent dans `state`, et sur une sauvegarde
  // corrompue (`lessons` ou `badges` d'un type inattendu) ils lèvent un
  // TypeError — les modules ES étant toujours en mode strict, affecter une
  // propriété sur un primitif est fatal. L'exception remontait jusqu'à boot(),
  // donc `renderHome()` n'était jamais appelé : PAGE BLANCHE, et l'utilisateur
  // enfermé dehors sans accès à l'export ni au bouton de réinitialisation.
  // Les deux lignes ci-dessous suppriment ce mode de défaillance.
  try {
    ensureLessonStatuses();
    rolloverDay();
  } catch (e) {
    console.warn("Post-traitement du chargement échoué.", e);
  }
  return state;
}

/**
 * Amène une sauvegarde brute au schéma courant.
 * `any` est le type HONNÊTE en entrée : le JSON vient de localStorage ou d'un
 * import utilisateur. C'est précisément `validate()` qui referme ce trou.
 * @param {any} loaded
 * @returns {{state: PersistedState, repairs: string[]}}
 */
function migrate(loaded) {
  return validate(loaded);
}

// La 1re leçon est disponible, les autres verrouillées tant que non atteintes.
function ensureLessonStatuses() {
  // Trié par `order` : c'est l'ordre pédagogique qui régit le déverrouillage,
  // indépendamment de l'ordre physique du tableau POLISH_LESSONS.
  var lessons = (POLISH_LESSONS || []).slice().sort(function (a, b) {
    return a.order - b.order;
  });
  lessons.forEach(function (lesson, idx) {
    if (!state.lessons[lesson.id]) {
      state.lessons[lesson.id] = {
        status: idx === 0 ? "available" : "locked",
        bestScore: 0
      };
    }
  });
  // Déverrouille la leçon suivant chaque leçon complétée.
  lessons.forEach(function (lesson, idx) {
    var l = state.lessons[lesson.id];
    var suivante = lessons[idx + 1];
    if (l && l.status === "completed" && suivante) {
      var next = state.lessons[suivante.id];
      if (next && next.status === "locked") next.status = "available";
    }
  });
}

// Gère le passage d'un nouveau jour (reset compteur temps + streak).
function rolloverDay() {
  var today = todayStr();
  if (state.dailyGoal.todayDate !== today) {
    state.dailyGoal.todayDate = today;
    state.dailyGoal.secondsToday = 0;
    state.dailyGoal.goalMetToday = false;
    // Streak : si le dernier jour actif n'est ni aujourd'hui ni hier -> cassé.
    var last = state.streak.lastActiveDate;
    if (last) {
      var yesterday = todayStr(new Date(Date.now() - 86400000));
      if (last !== today && last !== yesterday) {
        state.streak.current = 0;
      }
    }
    save();
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Impossible de sauvegarder.", e);
  }
}

function get() {
  return state;
}

function reset() {
  state = defaultState();
  ensureLessonStatuses();
  save();
  return state;
}

// Export / import de la sauvegarde (backup manuel).
function exportJSON() {
  return JSON.stringify(state, null, 2);
}

/**
 * @param {string} text
 * @returns {PersistedState}
 * @throws {SyntaxError} si le JSON est invalide — volontairement propagé.
 */
function importJSON(text) {
  var parsed = JSON.parse(text); // laisse remonter l'erreur si invalide
  var m = migrate(parsed);
  state = m.state;
  status = { mode: "normal", loadedVersion: CURRENT_VERSION, repairs: m.repairs };
  ensureLessonStatuses();
  rolloverDay();
  save();
  return state;
}

export const State = {
  STORAGE_KEY: STORAGE_KEY,
  load: load,
  status: getStatus,
  // Exposés pour les tests d'invariants ; aucun appelant applicatif.
  _validate: validate,
  _maxBox: MAX_BOX_PERSISTED,
  _currentVersion: CURRENT_VERSION,
  save: save,
  get: get,
  reset: reset,
  todayStr: todayStr,
  exportJSON: exportJSON,
  importJSON: importJSON,
  ensureLessonStatuses: ensureLessonStatuses,
  rolloverDay: rolloverDay
};
