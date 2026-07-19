/* =====================================================================
   STATE — modèle de progression + persistance localStorage
   ===================================================================== */
(function () {
  "use strict";

  var STORAGE_KEY = "polski-zubr-v1";
  var CURRENT_VERSION = 1;

  function todayStr(d) {
    d = d || new Date();
    // Date locale au format YYYY-MM-DD
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + day;
  }

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

  var state = null;

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
        state = migrate(JSON.parse(raw));
      } catch (e) {
        console.warn("Sauvegarde illisible, réinitialisation.", e);
        state = defaultState();
      }
    }
    ensureLessonStatuses();
    rolloverDay();
    return state;
  }

  // Migration douce : complète les champs manquants d'une ancienne sauvegarde.
  function migrate(loaded) {
    var d = defaultState();
    var merged = Object.assign({}, d, loaded);
    merged.profile = Object.assign({}, d.profile, loaded.profile);
    merged.streak = Object.assign({}, d.streak, loaded.streak);
    merged.dailyGoal = Object.assign({}, d.dailyGoal, loaded.dailyGoal);
    merged.flags = Object.assign({}, d.flags, loaded.flags);
    merged.settings = Object.assign({}, d.settings, loaded.settings);
    merged.items = loaded.items || {};
    merged.lessons = loaded.lessons || {};
    merged.badges = loaded.badges || [];
    merged.version = CURRENT_VERSION;
    return merged;
  }

  // La 1re leçon est disponible, les autres verrouillées tant que non atteintes.
  function ensureLessonStatuses() {
    var lessons = window.POLISH_LESSONS || [];
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
      if (l.status === "completed" && lessons[idx + 1]) {
        var next = state.lessons[lessons[idx + 1].id];
        if (next.status === "locked") next.status = "available";
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

  function importJSON(text) {
    var parsed = JSON.parse(text); // laisse remonter l'erreur si invalide
    state = migrate(parsed);
    ensureLessonStatuses();
    rolloverDay();
    save();
    return state;
  }

  window.State = {
    STORAGE_KEY: STORAGE_KEY,
    load: load,
    save: save,
    get: get,
    reset: reset,
    todayStr: todayStr,
    exportJSON: exportJSON,
    importJSON: importJSON,
    ensureLessonStatuses: ensureLessonStatuses,
    rolloverDay: rolloverDay
  };
})();
