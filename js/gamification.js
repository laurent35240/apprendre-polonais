// @ts-check
/* =====================================================================
   GAMIFICATION — XP, niveaux, streak, objectif quotidien, badges
   ===================================================================== */
import { State } from "./state.js";
import { POLISH_BADGES } from "../data/badges.js";

var XP_PER_CORRECT = 10;
var XP_LESSON_BONUS = 50;
var XP_DAILY_GOAL_BONUS = 100;
var XP_PER_LEVEL = 500; // XP nécessaire par niveau

/**
 * @param {number} xp
 * @returns {number} niveau, à partir de 1.
 */
function levelForXP(xp) {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

/**
 * @param {number} xp
 * @returns {{into: number, need: number, ratio: number}}
 */
function levelProgress(xp) {
  var into = xp % XP_PER_LEVEL;
  return { into: into, need: XP_PER_LEVEL, ratio: into / XP_PER_LEVEL };
}

// Ajoute des XP et recalcule le niveau. Renvoie true si niveau gagné.
/**
 * @param {number} amount
 * @returns {boolean} true si le niveau a augmenté.
 */
function addXP(amount) {
  var s = State.get();
  var before = s.profile.level;
  s.profile.totalXP += amount;
  s.profile.level = levelForXP(s.profile.totalXP);
  State.save();
  return s.profile.level > before;
}

// Marque une activité aujourd'hui : met à jour le streak.
function touchActivity() {
  var s = State.get();
  var today = State.todayStr();
  var last = s.streak.lastActiveDate;
  if (last === today) {
    // déjà compté aujourd'hui
  } else {
    var yesterday = State.todayStr(new Date(Date.now() - 86400000));
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
  State.save();
}

// Ajoute du temps passé (en secondes) et gère le bonus d'objectif quotidien.
// Renvoie { goalJustMet: bool }.
/**
 * @param {number} seconds
 * @returns {{goalJustMet: boolean}}
 */
function addTime(seconds) {
  var s = State.get();
  State.rolloverDay();
  s.dailyGoal.secondsToday += seconds;
  var goalJustMet = false;
  var targetSec = s.dailyGoal.minutesTarget * 60;
  if (!s.dailyGoal.goalMetToday && s.dailyGoal.secondsToday >= targetSec) {
    s.dailyGoal.goalMetToday = true;
    s.flags.everMetDailyGoal = true;
    addXP(XP_DAILY_GOAL_BONUS);
    goalJustMet = true;
  }
  State.save();
  return { goalJustMet: goalJustMet };
}

function dailyGoalRatio() {
  var s = State.get();
  var targetSec = s.dailyGoal.minutesTarget * 60;
  return Math.min(1, s.dailyGoal.secondsToday / targetSec);
}

// Marque le flag de prononciation parfaite (pour le badge).
function markPerfectPronunciation() {
  var s = State.get();
  s.flags.perfectPronunciation = true;
  State.save();
}

// Vérifie tous les badges ; renvoie la liste des badges NOUVELLEMENT gagnés.
/** @returns {Badge[]} */
function checkBadges() {
  var s = State.get();
  /** @type {Badge[]} */
  var newly = [];
  (POLISH_BADGES || []).forEach(function (badge) {
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
  if (newly.length) State.save();
  return newly;
}

export const Gamification = {
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
