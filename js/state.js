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

/**
 * Aucune écriture n'est permise. Le drapeau est lu au sommet de save(), et NON
 * testé aux sites d'appel : sinon la première chose que ferait load() (via
 * rolloverDay) serait d'écraser la sauvegarde qu'on cherche à protéger.
 */
var readOnly = false;

/**
 * Texte brut d'une sauvegarde du futur, conservé intact pour l'export. Le faire
 * passer par JSON.stringify(state) la rétrograderait — c'est exactement ce
 * qu'on veut éviter.
 * @type {string|null}
 */
var rawFuture = null;

/** @returns {LoadStatus} */
function getStatus() {
  return status;
}

function load() {
  // L'état du module ne doit pas fuir d'un chargement au suivant.
  readOnly = false;
  rawFuture = null;
  var raw = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    raw = null;
  }
  if (!raw) {
    state = defaultState();
    status = { mode: "normal", loadedVersion: CURRENT_VERSION, repairs: [] };
  } else {
    try {
      var m = migrate(JSON.parse(raw));
      state = m.state;
      status = { mode: "normal", loadedVersion: m.from, repairs: m.repairs };
      if (m.repairs.length) {
        console.warn("Sauvegarde réparée au chargement :", m.repairs);
      }
    } catch (e) {
      if (e instanceof FutureVersionError) {
        // LECTURE SEULE. On garde le texte brut pour l'export, et on affiche
        // une vue best-effort de la progression réelle : save() étant
        // neutralisé, aucune réparation approximative ne peut abîmer le
        // stockage.
        readOnly = true;
        rawFuture = raw;
        status = {
          mode: "readonly",
          reason: "future-version",
          loadedVersion: e.loadedVersion,
          repairs: []
        };
        try {
          state = validate(JSON.parse(raw)).state;
        } catch (e2) {
          state = defaultState();
        }
        console.warn(e.message + " — progression en lecture seule.");
      } else {
        console.warn("Sauvegarde illisible, réinitialisation.", e);
        state = defaultState();
        status = {
          mode: "normal",
          reason: "unreadable",
          loadedVersion: CURRENT_VERSION,
          repairs: []
        };
      }
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
 * Levée quand la sauvegarde vient d'une version PLUS RÉCENTE que ce code.
 * On ne peut ni la lire correctement ni la réécrire sans la détruire : elle
 * déclenche donc le mode lecture seule.
 */
class FutureVersionError extends Error {
  /** @param {number} loadedVersion */
  constructor(loadedVersion) {
    super(
      "Sauvegarde en version " + loadedVersion + ", ce code lit la version " +
        CURRENT_VERSION
    );
    this.name = "FutureVersionError";
    this.loadedVersion = loadedVersion;
  }
}

/**
 * Chaîne de migrations. Chaque entrée transforme un état de la version `to - 1`
 * vers `to`, en place ou en renvoyant un nouvel objet.
 *
 * VIDE tant que CURRENT_VERSION vaut 1 : la forme persistée n'a jamais changé.
 * La mécanique est néanmoins testée, avec des migrations factices — c'est tout
 * l'intérêt d'avoir rendu `runMigrations` pure et paramétrée.
 *
 * Discipline : TOUTE évolution de la forme persistée incrémente
 * CURRENT_VERSION et ajoute son entrée ici. C'est ce que le garde-fou de
 * version rend auto-appliqué.
 * @type {Migration[]}
 */
var MIGRATIONS = [];

/**
 * Version d'une sauvegarde, tolérante : absente, non numérique, non finie, non
 * entière ou < 1 → traitée comme 1. Toutes les sauvegardes écrites avant ce
 * palier valent 1, et une version poubelle ne doit pas enfermer l'utilisateur
 * en lecture seule.
 * @param {any} loaded
 * @returns {number}
 */
function readVersion(loaded) {
  var v = loaded && loaded.version;
  if (typeof v !== "number" || !Number.isFinite(v)) return 1;
  v = Math.floor(v);
  return v < 1 ? 1 : v;
}

/**
 * Applique les migrations nécessaires. PURE et paramétrée : ne lit ni
 * CURRENT_VERSION ni MIGRATIONS, donc testable avec des migrations factices.
 * @param {any} loaded
 * @param {Migration[]} migrations
 * @param {number} target
 * @returns {{state: any, from: number, applied: number[]}}
 */
function runMigrations(loaded, migrations, target) {
  var from = readVersion(loaded);
  var cur = loaded;
  /** @type {number[]} */
  var applied = [];
  for (var i = 0; i < migrations.length; i++) {
    var m = migrations[i];
    if (m.to > from && m.to <= target) {
      cur = m.up(cur) || cur;
      applied.push(m.to);
    }
  }
  return { state: cur, from: from, applied: applied };
}

/**
 * Amène une sauvegarde brute au schéma courant.
 * `any` est le type HONNÊTE en entrée : le JSON vient de localStorage ou d'un
 * import utilisateur. C'est précisément `validate()` qui referme ce trou.
 * Ordre imposé : version → migrations → validation. Une migration doit
 * recevoir la forme de SA version d'origine, pas une forme déjà normalisée vers
 * le schéma courant — sinon la validation détruirait les champs anciens qu'elle
 * doit lire.
 * @param {any} loaded
 * @returns {{state: PersistedState, from: number, applied: number[], repairs: string[]}}
 * @throws {FutureVersionError} si la sauvegarde vient d'une version future.
 */
function migrate(loaded) {
  var from = readVersion(loaded);
  if (from > CURRENT_VERSION) throw new FutureVersionError(from);
  var r = runMigrations(loaded, MIGRATIONS, CURRENT_VERSION);
  var v = validate(r.state);
  return {
    state: v.state,
    from: from,
    applied: r.applied,
    repairs: v.repairs
  };
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

/**
 * Écrit l'état. Le garde de lecture seule est ICI et non aux sites d'appel :
 * sinon le premier `rolloverDay()` de `load()` écraserait la sauvegarde qu'on
 * cherche à protéger.
 * @returns {boolean} true si l'écriture a eu lieu.
 */
function save() {
  if (readOnly) {
    console.warn("Écriture refusée : sauvegarde en lecture seule.");
    return false;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (e) {
    console.warn("Impossible de sauvegarder.", e);
    return false;
  }
}

function get() {
  return state;
}

/**
 * Repart de zéro. Lève le mode lecture seule : c'est un écrasement INTENTIONNEL,
 * seule sortie qui permette de réutiliser l'app après une sauvegarde du futur.
 * @returns {PersistedState}
 */
function reset() {
  readOnly = false;
  rawFuture = null;
  status = { mode: "normal", loadedVersion: CURRENT_VERSION, repairs: [] };
  state = defaultState();
  ensureLessonStatuses();
  save();
  return state;
}

// Export / import de la sauvegarde (backup manuel).
/**
 * @returns {string} En lecture seule, le texte brut ORIGINAL octet pour octet :
 *   le faire passer par JSON.stringify(state) rétrograderait la sauvegarde,
 *   c'est-à-dire exactement ce que le mode cherche à empêcher.
 */
function exportJSON() {
  if (rawFuture !== null) return rawFuture;
  return JSON.stringify(state, null, 2);
}

/**
 * Levée quand un fichier importé ne ressemble pas à une sauvegarde. Distincte de
 * SyntaxError (JSON illisible) et de FutureVersionError (version trop récente).
 */
class InvalidSaveError extends Error {
  /** @param {string} raison */
  constructor(raison) {
    super("Ce fichier ne ressemble pas à une sauvegarde : " + raison);
    this.name = "InvalidSaveError";
  }
}

/**
 * Un import doit RESSEMBLER à une sauvegarde. Critère volontairement laxiste —
 * on ne veut pas refuser un fichier légitime, même ancien — mais suffisant pour
 * attraper `{}`, `[]`, `"abc"`, `0`, `null`, qui passaient tous et détruisaient
 * la progression en silence.
 *
 * Asymétrie ASSUMÉE avec load() : au boot, réparer est le bon réflexe puisqu'on
 * n'a rien d'autre ; à l'import, l'utilisateur a une donnée existante à protéger
 * et une action à réessayer, donc refuser est le bon réflexe.
 * @param {any} loaded
 * @returns {void}
 * @throws {InvalidSaveError}
 */
function assertPlausibleSave(loaded) {
  if (!isPlainObject(loaded)) {
    throw new InvalidSaveError("racine " + describe(loaded));
  }
  var connues = ROOT_KEYS.filter(function (k) {
    return loaded[k] !== undefined;
  });
  if (!isPlainObject(loaded.profile) || connues.length < 3) {
    throw new InvalidSaveError(connues.length + " clé(s) connue(s) sur 9");
  }
}

/**
 * Valide un texte d'import SANS RIEN MODIFIER, pour que l'appelant puisse
 * chiffrer les deux côtés dans sa confirmation. Impossible aujourd'hui : on ne
 * pouvait pas savoir ce qu'on allait importer sans l'avoir déjà importé.
 * @param {string} text
 * @returns {ImportPreview}
 * @throws {SyntaxError|InvalidSaveError|FutureVersionError}
 */
function previewImport(text) {
  var parsed = JSON.parse(text);
  assertPlausibleSave(parsed);
  var from = readVersion(parsed);
  if (from > CURRENT_VERSION) throw new FutureVersionError(from);
  var v = validate(runMigrations(parsed, MIGRATIONS, CURRENT_VERSION).state);
  return {
    version: from,
    totalXP: v.state.profile.totalXP,
    level: v.state.profile.level,
    itemCount: Object.keys(v.state.items).length,
    lessonsCompleted: Object.keys(v.state.lessons).filter(function (id) {
      var l = v.state.lessons[id];
      return !!l && l.status === "completed";
    }).length,
    repairs: v.repairs
  };
}

/**
 * @param {string} text
 * @returns {{state: PersistedState, repairs: string[]}}
 * @throws {SyntaxError|InvalidSaveError|FutureVersionError} tous propagés :
 *   l'appelant doit pouvoir distinguer « illisible » de « trop récent ».
 */
function importJSON(text) {
  var parsed = JSON.parse(text); // laisse remonter l'erreur si invalide
  assertPlausibleSave(parsed);
  var m = migrate(parsed); // lève FutureVersionError sur une v2
  // Un import est un écrasement INTENTIONNEL : il lève le mode lecture seule.
  readOnly = false;
  rawFuture = null;
  state = m.state;
  status = { mode: "normal", loadedVersion: m.from, repairs: m.repairs };
  ensureLessonStatuses();
  rolloverDay();
  save();
  return { state: state, repairs: m.repairs };
}

export const State = {
  STORAGE_KEY: STORAGE_KEY,
  load: load,
  status: getStatus,
  FutureVersionError: FutureVersionError,
  InvalidSaveError: InvalidSaveError,
  previewImport: previewImport,
  // Exposés pour les tests d'invariants ; aucun appelant applicatif.
  _validate: validate,
  _runMigrations: runMigrations,
  _readVersion: readVersion,
  _migrations: MIGRATIONS,
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
