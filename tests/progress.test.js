/* =====================================================================
   PROGRESS — les intentions de progression
   ---------------------------------------------------------------------
   Le test le plus important est celui d'ÉQUIVALENCE : partant du même état,
   `Progress.answerRecorded` doit produire exactement l'état que produisait la
   séquence dispersée qu'il remplace. C'est la preuve de non-régression du
   chemin le plus chaud de l'app.

   Chaque intention est ensuite vérifiée sur trois plans : le delta d'état, les
   chemins déclarés modifiés, et le nombre d'écritures.
   ===================================================================== */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { State } from "../js/state.js";
import { SRS } from "../js/srs.js";
import { Gamification } from "../js/gamification.js";
import { Progress } from "../js/progress.js";
import { ANCHOR } from "./fixtures/anchor.js";
import REALISTIC from "./fixtures/state-v1-realistic.json";

const KEY = "polski-zubr-v1";

function espionnerEcritures() {
  return vi.spyOn(localStorage, "setItem");
}

/** Sérialisation à clés triées : compare l'état, pas l'ordre des clés. */
function canon(v) {
  if (Array.isArray(v)) return v.map(canon);
  if (v && typeof v === "object") {
    const o = {};
    for (const k of Object.keys(v).sort()) o[k] = canon(v[k]);
    return o;
  }
  return v;
}

function charger() {
  localStorage.setItem(KEY, JSON.stringify(REALISTIC));
  State.load();
  State.flush();
}

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
  vi.setSystemTime(new Date(ANCHOR));
  vi.spyOn(console, "warn").mockImplementation(() => {});
  charger();
});
afterEach(() => {
  State.flush();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

/* ==================== LE test : équivalence ============================= */
describe("équivalence avec la séquence remplacée", () => {
  const id = Object.keys(REALISTIC.items)[0];

  it("answerRecorded(id, true) produit le même état que SRS.record + addXP", () => {
    // Chemin A : l'intention
    Progress.answerRecorded(id, true);
    const apresIntention = canon(JSON.parse(JSON.stringify(State.get())));

    // Chemin B : la séquence dispersée d'origine
    charger();
    SRS.record(id, true);
    Gamification.addXP(Gamification.XP_PER_CORRECT);
    const apresSequence = canon(JSON.parse(JSON.stringify(State.get())));

    expect(JSON.stringify(apresIntention)).toBe(JSON.stringify(apresSequence));
  });

  it("answerRecorded(id, false) aussi", () => {
    Progress.answerRecorded(id, false);
    const a = canon(JSON.parse(JSON.stringify(State.get())));
    charger();
    SRS.record(id, false);
    const b = canon(JSON.parse(JSON.stringify(State.get())));
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it("renvoie les faits nécessaires à l'UI, sans la toucher", () => {
    const r = Progress.answerRecorded(id, true);
    expect(r.xpGained).toBe(Gamification.XP_PER_CORRECT);
    expect(typeof r.leveledUp).toBe("boolean");
    expect(r.level).toBe(State.get().profile.level);
    expect(r.item.box).toBeGreaterThanOrEqual(1);
  });
});

describe("answerRecorded", () => {
  const id = Object.keys(REALISTIC.items)[0];

  it("déclare exactement les chemins modifiés", () => {
    Progress.answerRecorded(id, true);
    expect(State.dirtyPaths()).toEqual(["items." + id, "profile"]);
  });

  it("une réponse fausse ne touche pas au profil", () => {
    Progress.answerRecorded(id, false);
    expect(State.dirtyPaths()).toEqual(["items." + id]);
  });

  it("n'écrit qu'une fois après la fenêtre", () => {
    const espion = espionnerEcritures();
    Progress.answerRecorded(id, true);
    vi.advanceTimersByTime(3000);
    expect(espion).toHaveBeenCalledTimes(1);
  });
});

describe("sessionFinished", () => {
  it("marque une leçon réussie comme terminée et crédite le bonus", () => {
    const s = State.get();
    s.lessons["lesson-06"] = { status: "available", bestScore: 0 };
    const xpAvant = s.profile.totalXP;
    const r = Progress.sessionFinished("lesson-06", 80);
    expect(r.lessonJustCompleted).toBe(true);
    expect(r.xpGained).toBe(Gamification.XP_LESSON_BONUS);
    expect(State.get().lessons["lesson-06"].status).toBe("completed");
    expect(State.get().profile.totalXP).toBe(xpAvant + Gamification.XP_LESSON_BONUS);
  });

  it("un score insuffisant passe en inProgress, sans bonus", () => {
    State.get().lessons["lesson-06"] = { status: "available", bestScore: 0 };
    const xpAvant = State.get().profile.totalXP;
    const r = Progress.sessionFinished("lesson-06", 30);
    expect(r.lessonJustCompleted).toBe(false);
    expect(r.xpGained).toBe(0);
    expect(State.get().lessons["lesson-06"].status).toBe("inProgress");
    expect(State.get().profile.totalXP).toBe(xpAvant);
  });

  it("ne rétrograde pas une leçon déjà terminée et garde le meilleur score", () => {
    State.get().lessons["lesson-01"] = { status: "completed", bestScore: 95 };
    const r = Progress.sessionFinished("lesson-01", 40);
    expect(r.lessonJustCompleted).toBe(false);
    expect(State.get().lessons["lesson-01"].status).toBe("completed");
    expect(State.get().lessons["lesson-01"].bestScore).toBe(95);
  });

  it("une session de révision (lessonId null) ne touche à aucune leçon", () => {
    const avant = JSON.stringify(canon(State.get().lessons));
    const r = Progress.sessionFinished(null, 100);
    expect(r.lessonJustCompleted).toBe(false);
    expect(JSON.stringify(canon(State.get().lessons))).toBe(avant);
  });

  it("écrit immédiatement : la fin d'une leçon est un jalon", () => {
    State.get().lessons["lesson-06"] = { status: "available", bestScore: 0 };
    const espion = espionnerEcritures();
    Progress.sessionFinished("lesson-06", 80);
    expect(espion).toHaveBeenCalled(); // sans avancer les timers
  });
});

describe("timeSpent", () => {
  it("cumule le temps du jour", () => {
    const avant = State.get().dailyGoal.secondsToday;
    Progress.timeSpent(30);
    expect(State.get().dailyGoal.secondsToday).toBe(avant + 30);
  });

  it("signale l'objectif atteint et ne le crédite qu'UNE fois", () => {
    // La fixture est à 1480 s sur 1800 : 320 s suffisent.
    const xpAvant = State.get().profile.totalXP;
    const r1 = Progress.timeSpent(320);
    expect(r1.goalJustMet).toBe(true);
    expect(State.get().profile.totalXP).toBe(
      xpAvant + Gamification.XP_DAILY_GOAL_BONUS
    );
    // goalMetToday est un VERROU d'idempotence, pas un cache.
    const r2 = Progress.timeSpent(600);
    expect(r2.goalJustMet).toBe(false);
    expect(State.get().profile.totalXP).toBe(
      xpAvant + Gamification.XP_DAILY_GOAL_BONUS
    );
  });

  it("ne vérifie les badges que lorsque l'objectif vient d'être atteint", () => {
    expect(Progress.timeSpent(10).newBadges).toEqual([]);
  });
});

describe("pronunciationPerfect", () => {
  it("lève le drapeau du badge", () => {
    State.get().flags.perfectPronunciation = false;
    Progress.pronunciationPerfect();
    expect(State.get().flags.perfectPronunciation).toBe(true);
  });
});

describe("settingChanged", () => {
  it("applique les valeurs valides", () => {
    expect(Progress.settingChanged("theme", "dark").applied).toBe(true);
    expect(State.get().settings.theme).toBe("dark");
    expect(Progress.settingChanged("soundOn", false).applied).toBe(true);
    expect(State.get().settings.soundOn).toBe(false);
    expect(Progress.settingChanged("ttsRate", 1.1).applied).toBe(true);
    expect(State.get().settings.ttsRate).toBe(1.1);
    expect(Progress.settingChanged("minutesTarget", 45).applied).toBe(true);
    expect(State.get().dailyGoal.minutesTarget).toBe(45);
  });

  // La validation ne portait QUE sur le thème avant ce module : parseFloat et
  // parseInt pouvaient écrire NaN dans l'état sans que rien ne l'arrête.
  it.each([
    ["theme", "néon"],
    ["theme", 42],
    ["soundOn", "oui"],
    ["ttsRate", NaN],
    ["ttsRate", 99],
    ["ttsRate", 0.1],
    ["minutesTarget", NaN],
    ["minutesTarget", 0],
    ["minutesTarget", 99999]
  ])("refuse %s = %s sans rien modifier", (key, value) => {
    const avant = JSON.stringify(canon(State.get()));
    expect(
      Progress.settingChanged(/** @type {any} */ (key), value).applied
    ).toBe(false);
    expect(JSON.stringify(canon(State.get()))).toBe(avant);
  });

  it("un réglage ne touche jamais aux items — spécification exécutable", () => {
    Progress.settingChanged("theme", "light");
    expect(State.dirtyPaths()).toEqual(["settings"]);
  });

  it("relit l'état à chaque appel : le piège d'alias est impossible", () => {
    // State.reset() REMPLACE l'objet. Un handler qui aurait capturé `s` au
    // rendu écrirait dans un objet orphelin ; l'intention, elle, relit.
    Progress.progressReset();
    expect(Progress.settingChanged("theme", "dark").applied).toBe(true);
    // flush : settingChanged programme l'écriture, il ne l'exécute pas.
    State.flush();
    expect(
      JSON.parse(/** @type {string} */ (localStorage.getItem(KEY))).settings.theme
    ).toBe("dark");
  });
});

describe("import / reset", () => {
  it("progressImported remplace l'état", () => {
    const autre = {
      ...REALISTIC,
      profile: { createdAt: "2026-01-01T00:00:00.000Z", totalXP: 42, level: 1 }
    };
    const r = Progress.progressImported(JSON.stringify(autre));
    expect(r.repairs).toEqual([]);
    expect(State.get().profile.totalXP).toBe(42);
  });

  it("progressReset repart de zéro", () => {
    Progress.progressReset();
    expect(State.get().profile.totalXP).toBe(0);
    expect(State.get().items).toEqual({});
  });
});

describe("cloudMerged", () => {
  it("fusionne au lieu de remplacer, recalcule niveau et badges", () => {
    const distant = {
      ...REALISTIC,
      profile: { ...REALISTIC.profile, totalXP: REALISTIC.profile.totalXP + 5000, level: 32 },
      items: {
        ...REALISTIC.items,
        [Object.keys(REALISTIC.items)[0]]: {
          ...REALISTIC.items[Object.keys(REALISTIC.items)[0]],
          box: 5
        }
      }
    };
    const r = Progress.cloudMerged(JSON.stringify(distant));
    expect(r.repairs).toEqual([]);
    // Le distant est le "gagnant" XP : son totalXP est retenu tel quel (pas
    // de leçon rattrapée dans ce scénario), et le niveau recalculé le reflète.
    expect(State.get().profile.totalXP).toBe(REALISTIC.profile.totalXP + 5000);
    expect(State.get().profile.level).toBe(Gamification.levelForXP(State.get().profile.totalXP));
    // L'item monté côté distant l'est resté après fusion (max des box).
    expect(State.get().items[Object.keys(REALISTIC.items)[0]].box).toBe(5);
  });

  it("une fusion avec soi-même (écho) ne signale ni montée de niveau ni nouveau badge", () => {
    const r = Progress.cloudMerged(JSON.stringify(State.get()));
    expect(r.leveledUp).toBe(false);
    expect(r.newBadges).toEqual([]);
  });

  it("un écho Firestore (fusion avec soi-même) ne programme AUCUNE écriture", () => {
    // C'est ce qui arrête la boucle push→pull→push : sans cette garde, un
    // appareil qui reçoit sa propre écriture en retour la fusionnerait avec
    // elle-même (no-op en valeur) mais écrirait quand même, indéfiniment.
    const espion = espionnerEcritures();
    Progress.cloudMerged(JSON.stringify(State.get()));
    expect(espion).not.toHaveBeenCalled();
    expect(State.isDirty()).toBe(false);
  });

  it("écrit immédiatement quand la fusion change réellement quelque chose : c'est un jalon", () => {
    const distant = {
      ...REALISTIC,
      profile: { ...REALISTIC.profile, totalXP: REALISTIC.profile.totalXP + 100 }
    };
    const espion = espionnerEcritures();
    Progress.cloudMerged(JSON.stringify(distant));
    expect(espion).toHaveBeenCalled(); // sans avancer les timers
  });
});

/* ============ l'invariant, verrouillé mécaniquement ===================== */
describe("app.js n'écrit plus dans l'état", () => {
  const src = readFileSync(resolve(import.meta.dirname, "../js/app.js"), "utf8");

  it("aucun State.save / touch / scheduleSave", () => {
    expect(src).not.toMatch(/State\.(save|touch|scheduleSave)\(/);
  });

  it("aucune mutation via State.get()", () => {
    // `State.get().settings.theme = …` et compagnie.
    expect(src).not.toMatch(/State\.get\(\)(\s*\.[A-Za-z]+)+\s*=[^=]/);
  });

  it("mais State.get() reste pour les lectures", () => {
    expect(src).toMatch(/State\.get\(\)/);
  });
});
