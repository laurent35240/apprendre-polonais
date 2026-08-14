// @ts-check
/* =====================================================================
   BADGES — récompenses débloquables
   ---------------------------------------------------------------------
   Chaque badge a une condition évaluée dans gamification.js (checkBadges).
   `check(state)` renvoie true quand le badge est mérité.

   Seuils `words-tier*`/`master-tier*` : nombres choisis à la main, pas un
   pourcentage dynamique du total réel d'items (884 aujourd'hui) — calculer
   ce total exigerait d'importer js/exercises.js (buildIndex), ce qui
   casserait le DAG documenté dans CLAUDE.md (badges est en amont
   d'exercises). `halfway`/`graduate`/`all-stories` restent dynamiques car
   ils comptent POLISH_LESSONS/POLISH_STORIES, déjà importés en amont.
   ===================================================================== */

import { POLISH_LESSONS } from "./lessons.js";
import { POLISH_STORIES } from "./stories.js";

/** @param {PersistedState} s */
function completedLessons(s) {
  return s.lessons ? Object.values(s.lessons).filter((l) => l?.status === "completed").length : 0;
}

/** @type {Badge[]} */
export const POLISH_BADGES = [
  {
    id: "first-steps",
    emoji: "🌱",
    title: "Première pousse",
    desc: "Terminer ta toute première leçon.",
    check: (s) =>
      s.lessons && Object.values(s.lessons).some((l) => l?.status === "completed")
  },
  {
    id: "first-trail",
    emoji: "🪧",
    title: "Premier sentier",
    desc: "Terminer les 5 leçons de ton premier sentier.",
    check: (s) => {
      const firstFive = (POLISH_LESSONS || [])
        .slice()
        .sort((a, b) => a.order - b.order)
        .slice(0, 5);
      return (
        firstFive.length === 5 &&
        !!s.lessons &&
        firstFive.every((l) => s.lessons[l.id]?.status === "completed")
      );
    }
  },
  {
    id: "halfway",
    emoji: "🌳",
    title: "À mi-chemin",
    desc: "Terminer la moitié des leçons.",
    check: (s) => {
      const total = (POLISH_LESSONS || []).length;
      return total > 0 && completedLessons(s) >= Math.ceil(total / 2);
    }
  },
  {
    id: "graduate",
    emoji: "🎓",
    title: "Diplômé de Żubr",
    desc: "Terminer toutes les leçons. Gratulacje !",
    check: (s) => {
      const total = (POLISH_LESSONS || []).length;
      return total > 0 && completedLessons(s) >= total;
    }
  },
  {
    id: "streak-3",
    emoji: "🔥",
    title: "En feu (3 jours)",
    desc: "3 jours d'affilée. Żubr est impressionné.",
    check: (s) => s.streak && s.streak.current >= 3
  },
  {
    id: "streak-7",
    emoji: "🕊️",
    title: "Semaine de folie",
    desc: "7 jours d'affilée. Tu deviens dangereux.",
    check: (s) => s.streak && s.streak.current >= 7
  },
  {
    id: "streak-30",
    emoji: "🌕",
    title: "Machine à polonais",
    desc: "30 jours d'affilée. Respect total.",
    check: (s) => s.streak && s.streak.current >= 30
  },
  {
    id: "streak-100",
    emoji: "🦉",
    title: "Légende de la forêt",
    desc: "100 jours d'affilée. Tu es une légende.",
    check: (s) => s.streak && s.streak.current >= 100
  },
  {
    id: "words-tier1",
    emoji: "🌰",
    title: "Collectionneur de mots",
    desc: "Rencontrer 50 mots différents.",
    check: (s) => s.items && Object.keys(s.items).length >= 50
  },
  {
    id: "words-tier2",
    emoji: "🧠",
    title: "Cerveau bilingue",
    desc: "Rencontrer 250 mots différents.",
    check: (s) => s.items && Object.keys(s.items).length >= 250
  },
  {
    id: "words-tier3",
    emoji: "🦅",
    title: "Polyglotte de la forêt",
    desc: "Rencontrer 550 mots différents.",
    check: (s) => s.items && Object.keys(s.items).length >= 550
  },
  {
    id: "master-tier1",
    emoji: "⭐",
    title: "Mémoire d'éléphant",
    desc: "Amener 50 mots au niveau maximum (boîte 5).",
    check: (s) =>
      s.items && Object.values(s.items).filter((i) => (i?.box ?? 0) >= 5).length >= 50
  },
  {
    id: "master-tier2",
    emoji: "🌟",
    title: "Grand sage de la forêt",
    desc: "Amener 200 mots au niveau maximum (boîte 5).",
    check: (s) =>
      s.items && Object.values(s.items).filter((i) => (i?.box ?? 0) >= 5).length >= 200
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
    id: "first-story",
    emoji: "📖",
    title: "Première histoire",
    desc: "Terminer ta première histoire bonus.",
    check: (s) =>
      !!s.lessons &&
      (POLISH_STORIES || []).some((story) => s.lessons[story.id]?.status === "completed")
  },
  {
    id: "all-stories",
    emoji: "🏕️",
    title: "Grand conteur",
    desc: "Terminer toutes les histoires bonus.",
    check: (s) => {
      const total = (POLISH_STORIES || []).length;
      return (
        total > 0 &&
        !!s.lessons &&
        (POLISH_STORIES || []).every((story) => s.lessons[story.id]?.status === "completed")
      );
    }
  }
];
