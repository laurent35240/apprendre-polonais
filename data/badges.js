/* =====================================================================
   BADGES — récompenses débloquables
   ---------------------------------------------------------------------
   Chaque badge a une condition évaluée dans gamification.js (checkBadges).
   `check(state)` renvoie true quand le badge est mérité.
   ===================================================================== */

window.POLISH_BADGES = [
  {
    id: "first-steps",
    emoji: "🐣",
    title: "Premiers pas",
    desc: "Terminer ta toute première leçon.",
    check: (s) =>
      Object.values(s.lessons).some((l) => l.status === "completed")
  },
  {
    id: "streak-3",
    emoji: "🔥",
    title: "En feu (3 jours)",
    desc: "3 jours d'affilée. Żubr est impressionné.",
    check: (s) => s.streak.current >= 3
  },
  {
    id: "streak-7",
    emoji: "🌶️",
    title: "Semaine de folie",
    desc: "7 jours d'affilée. Tu deviens dangereux.",
    check: (s) => s.streak.current >= 7
  },
  {
    id: "streak-30",
    emoji: "🏆",
    title: "Machine à polonais",
    desc: "30 jours d'affilée. Respect total.",
    check: (s) => s.streak.current >= 30
  },
  {
    id: "words-25",
    emoji: "📚",
    title: "Collectionneur de mots",
    desc: "Rencontrer 25 mots différents.",
    check: (s) => Object.keys(s.items).length >= 25
  },
  {
    id: "words-100",
    emoji: "🧠",
    title: "Cerveau bilingue",
    desc: "Rencontrer 100 mots différents.",
    check: (s) => Object.keys(s.items).length >= 100
  },
  {
    id: "perfect-pronunciation",
    emoji: "🎤",
    title: "Accent parfait",
    desc: "Réussir un exercice de prononciation à 100%.",
    check: (s) => s.flags && s.flags.perfectPronunciation === true
  },
  {
    id: "daily-goal",
    emoji: "⏱️",
    title: "Objectif atteint",
    desc: "Atteindre 30 minutes en une journée.",
    check: (s) => s.flags && s.flags.everMetDailyGoal === true
  },
  {
    id: "master-3",
    emoji: "⭐",
    title: "Mémoire d'éléphant",
    desc: "Amener 10 mots au niveau maximum (boîte 5).",
    check: (s) =>
      Object.values(s.items).filter((i) => i.box >= 5).length >= 10
  },
  {
    id: "halfway",
    emoji: "🚀",
    title: "À mi-chemin",
    desc: "Terminer 10 leçons.",
    check: (s) =>
      Object.values(s.lessons).filter((l) => l.status === "completed").length >= 10
  },
  {
    id: "graduate",
    emoji: "🎓",
    title: "Diplômé de Żubr",
    desc: "Terminer toutes les leçons. Gratulacje !",
    check: (s) =>
      Object.values(s.lessons).filter((l) => l.status === "completed").length >= 21
  }
];
