/* =====================================================================
   GAMIFICATION — XP, niveaux, streak, objectif quotidien, badges
   ===================================================================== */
(function () {
  "use strict";

  var XP_PER_CORRECT = 10;
  var XP_LESSON_BONUS = 50;
  var XP_DAILY_GOAL_BONUS = 100;
  var XP_PER_LEVEL = 500; // XP nécessaire par niveau

  function levelForXP(xp) {
    return Math.floor(xp / XP_PER_LEVEL) + 1;
  }

  function levelProgress(xp) {
    var into = xp % XP_PER_LEVEL;
    return { into: into, need: XP_PER_LEVEL, ratio: into / XP_PER_LEVEL };
  }

  // Ajoute des XP et recalcule le niveau. Renvoie true si niveau gagné.
  function addXP(amount) {
    var s = window.State.get();
    var before = s.profile.level;
    s.profile.totalXP += amount;
    s.profile.level = levelForXP(s.profile.totalXP);
    window.State.save();
    return s.profile.level > before;
  }

  // Marque une activité aujourd'hui : met à jour le streak.
  function touchActivity() {
    var s = window.State.get();
    var today = window.State.todayStr();
    var last = s.streak.lastActiveDate;
    if (last === today) {
      // déjà compté aujourd'hui
    } else {
      var yesterday = window.State.todayStr(new Date(Date.now() - 86400000));
      if (last === yesterday) {
        s.streak.current += 1;
      } else {
        s.streak.current = 1;
      }
      s.streak.lastActiveDate = today;
      if (s.streak.current > s.streak.longest) {
        s.streak.longest = s.streak.current;
      }
    }
    window.State.save();
  }

  // Ajoute du temps passé (en secondes) et gère le bonus d'objectif quotidien.
  // Renvoie { goalJustMet: bool }.
  function addTime(seconds) {
    var s = window.State.get();
    window.State.rolloverDay();
    s.dailyGoal.secondsToday += seconds;
    var goalJustMet = false;
    var targetSec = s.dailyGoal.minutesTarget * 60;
    if (!s.dailyGoal.goalMetToday && s.dailyGoal.secondsToday >= targetSec) {
      s.dailyGoal.goalMetToday = true;
      s.flags.everMetDailyGoal = true;
      addXP(XP_DAILY_GOAL_BONUS);
      goalJustMet = true;
    }
    window.State.save();
    return { goalJustMet: goalJustMet };
  }

  function dailyGoalRatio() {
    var s = window.State.get();
    var targetSec = s.dailyGoal.minutesTarget * 60;
    return Math.min(1, s.dailyGoal.secondsToday / targetSec);
  }

  // Marque le flag de prononciation parfaite (pour le badge).
  function markPerfectPronunciation() {
    var s = window.State.get();
    s.flags.perfectPronunciation = true;
    window.State.save();
  }

  // Vérifie tous les badges ; renvoie la liste des badges NOUVELLEMENT gagnés.
  function checkBadges() {
    var s = window.State.get();
    var newly = [];
    (window.POLISH_BADGES || []).forEach(function (badge) {
      if (s.badges.indexOf(badge.id) !== -1) return;
      var earned = false;
      try {
        earned = badge.check(s);
      } catch (e) {
        earned = false;
      }
      if (earned) {
        s.badges.push(badge.id);
        newly.push(badge);
      }
    });
    if (newly.length) window.State.save();
    return newly;
  }

  window.Gamification = {
    XP_PER_CORRECT: XP_PER_CORRECT,
    XP_LESSON_BONUS: XP_LESSON_BONUS,
    XP_DAILY_GOAL_BONUS: XP_DAILY_GOAL_BONUS,
    XP_PER_LEVEL: XP_PER_LEVEL,
    levelForXP: levelForXP,
    levelProgress: levelProgress,
    addXP: addXP,
    touchActivity: touchActivity,
    addTime: addTime,
    dailyGoalRatio: dailyGoalRatio,
    markPerfectPronunciation: markPerfectPronunciation,
    checkBadges: checkBadges
  };
})();
