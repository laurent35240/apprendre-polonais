/* =====================================================================
   FUSION PAR ITEM — palier 4 (préparation Firebase)
   ---------------------------------------------------------------------
   La propriété centrale, testée en premier : mergeStates(s, s) === s pour
   tout SAUF `settings`/`dailyGoal`, où `local` gagne toujours par design.
   C'est cette idempotence qui rend un écho Firestore inoffensif PAR
   CONSTRUCTION plutôt que par détection (cf. js/state.js, commentaire de
   section au-dessus de mergeStates).

   Les deux états divergents sont dérivés de la fixture réaliste, sur le
   modèle des poisons de tests/state-corruption.test.js : on n'abîme/ne
   modifie qu'un endroit à la fois, pour pouvoir asserter que le reste a
   traversé la fusion intact.
   ===================================================================== */
import { describe, it, expect } from "vitest";
import { State } from "../js/state.js";
import { Gamification } from "../js/gamification.js";
import REALISTIC from "./fixtures/state-v1-realistic.json";

/** Copie profonde, pour ne jamais muter la fixture partagée. */
const clone = (v) => JSON.parse(JSON.stringify(v));

/** Sérialisation à clés triées récursivement : compare la forme, pas l'ordre. */
function canon(value) {
  if (Array.isArray(value)) return value.map(canon);
  if (value && typeof value === "object") {
    /** @type {Record<string, unknown>} */
    const out = {};
    for (const k of Object.keys(value).sort()) out[k] = canon(value[k]);
    return out;
  }
  return value;
}
const canonJSON = (v) => JSON.stringify(canon(v));

const ITEM_A = "v-01-czesc"; // box 3 dans la fixture
const ITEM_B = "v-01-dziendobry"; // box 4 dans la fixture

describe("mergeStates — idempotence et commutativité", () => {
  it("merge(s, s) === s (les 9 clés, à l'octet près)", () => {
    const merged = State._merge(REALISTIC, REALISTIC);
    // level est recalculé par l'appelant (Gamification.addXP(0)) ; sur un
    // merge(s, s) il vaut déjà local.level, donc rien à corriger ici.
    expect(canonJSON(merged)).toBe(canonJSON(REALISTIC));
  });

  it("est commutatif sur tout sauf settings/dailyGoal", () => {
    const a = clone(REALISTIC);
    const b = clone(REALISTIC);
    a.items[ITEM_A].box = 5;
    a.items[ITEM_A].dueDate = "2026-04-01";
    b.items[ITEM_B].box = 5;
    b.profile.totalXP = 20000; // b devient le "gagnant" XP
    b.lessons["lesson-10"] = { status: "completed", bestScore: 90 };

    const ab = State._merge(a, b);
    const ba = State._merge(b, a);

    const sansAsymetrie = (s) => {
      const c = clone(s);
      delete c.settings;
      delete c.dailyGoal;
      return c;
    };
    expect(canonJSON(sansAsymetrie(ab))).toBe(canonJSON(sansAsymetrie(ba)));

    // L'asymétrie documentée : `local` gagne toujours pour settings/dailyGoal.
    expect(ab.settings).toEqual(a.settings);
    expect(ba.settings).toEqual(b.settings);
  });
});

describe("mergeStates — règles de champ", () => {
  it("items : union des ids, box/dueDate/seenCount/correctCount/lastSeen au max", () => {
    const a = clone(REALISTIC);
    const b = clone(REALISTIC);
    a.items[ITEM_A] = {
      box: 2, dueDate: "2026-03-01", seenCount: 3, correctCount: 1, lastSeen: "2026-02-25"
    };
    b.items[ITEM_A] = {
      box: 4, dueDate: "2026-02-20", seenCount: 1, correctCount: 5, lastSeen: "2026-02-28"
    };
    // Item présent uniquement côté b.
    delete a.items[ITEM_B];

    const merged = State._merge(a, b);
    expect(merged.items[ITEM_A]).toEqual({
      box: 4, // max(2,4)
      dueDate: "2026-03-01", // max
      seenCount: 3, // max(3,1)
      correctCount: 5, // max(1,5)
      lastSeen: "2026-02-28" // max
    });
    expect(merged.items[ITEM_B]).toEqual(b.items[ITEM_B]); // union, présent d'un seul côté
    expect(Object.keys(merged.items).length).toBe(Object.keys(REALISTIC.items).length);
  });

  it("lessons : statut au rang max, bestScore au max, union des ids", () => {
    const a = clone(REALISTIC);
    const b = clone(REALISTIC);
    a.lessons["lesson-30"] = { status: "inProgress", bestScore: 40 };
    b.lessons["lesson-30"] = { status: "completed", bestScore: 30 };
    b.lessons["lesson-31"] = { status: "available", bestScore: 0 };
    delete a.lessons["lesson-31"];

    const merged = State._merge(a, b);
    expect(merged.lessons["lesson-30"]).toEqual({ status: "completed", bestScore: 40 });
    expect(merged.lessons["lesson-31"]).toEqual(b.lessons["lesson-31"]);
  });

  it("badges : union dédupliquée, ne retire jamais un badge existant", () => {
    const a = clone(REALISTIC);
    const b = clone(REALISTIC);
    a.badges = ["first-steps", "streak-3"];
    b.badges = ["streak-3", "words-25"];

    const merged = State._merge(a, b);
    expect(new Set(merged.badges)).toEqual(new Set(["first-steps", "streak-3", "words-25"]));
  });

  it("flags : OR logique", () => {
    const a = clone(REALISTIC);
    const b = clone(REALISTIC);
    a.flags = { perfectPronunciation: true, everMetDailyGoal: false };
    b.flags = { perfectPronunciation: false, everMetDailyGoal: true };

    const merged = State._merge(a, b);
    expect(merged.flags).toEqual({ perfectPronunciation: true, everMetDailyGoal: true });
  });

  it("profile.totalXP : max des deux totaux, plus le bonus des leçons rattrapées côté gagnant", () => {
    const a = clone(REALISTIC);
    const b = clone(REALISTIC);
    a.profile.totalXP = 5000; // a est le "perdant" XP
    b.profile.totalXP = 8000; // b est le "gagnant" XP
    // Leçon complétée côté a (perdant), pas côté b (gagnant) : rattrapée.
    a.lessons["lesson-35"] = { status: "completed", bestScore: 70 };
    b.lessons["lesson-35"] = { status: "available", bestScore: 0 };
    // Leçon complétée des deux côtés : pas de double bonus.
    a.lessons["lesson-01"].status = "completed";
    b.lessons["lesson-01"].status = "completed";

    const merged = State._merge(a, b);
    expect(merged.profile.totalXP).toBe(8000 + State._xpLessonBonus);
  });

  it("profile.level : recalculable depuis le totalXP fusionné via Gamification.addXP(0)", () => {
    const a = clone(REALISTIC);
    const b = clone(REALISTIC);
    a.profile.totalXP = 100;
    a.profile.level = 1;
    b.profile.totalXP = 20000;
    b.profile.level = 41;

    const merged = State._merge(a, b);
    expect(merged.profile.totalXP).toBe(20000); // aucune leçon rattrapée ici
    expect(Gamification.levelForXP(merged.profile.totalXP)).toBe(41);
  });

  it("profile.createdAt : le plus ancien des deux", () => {
    const a = clone(REALISTIC);
    const b = clone(REALISTIC);
    a.profile.createdAt = "2026-02-20T12:00:00.000Z";
    b.profile.createdAt = "2026-01-01T12:00:00.000Z";

    const merged = State._merge(a, b);
    expect(merged.profile.createdAt).toBe("2026-01-01T12:00:00.000Z");
  });

  it("streak : current/longest au max, jamais de régression visible", () => {
    const a = clone(REALISTIC);
    const b = clone(REALISTIC);
    a.streak = { current: 3, longest: 10, lastActiveDate: "2026-03-01" };
    b.streak = { current: 7, longest: 7, lastActiveDate: "2026-03-02" };

    const merged = State._merge(a, b);
    expect(merged.streak).toEqual({ current: 7, longest: 10, lastActiveDate: "2026-03-02" });
  });

  it("dailyGoal : local gagne toujours, sauf goalMetToday en OR", () => {
    const a = clone(REALISTIC);
    const b = clone(REALISTIC);
    a.dailyGoal = {
      minutesTarget: 30, todayDate: "2026-03-02", secondsToday: 500, goalMetToday: false
    };
    b.dailyGoal = {
      minutesTarget: 60, todayDate: "2026-03-02", secondsToday: 9999, goalMetToday: true
    };

    const merged = State._merge(a, b);
    expect(merged.dailyGoal).toEqual({
      minutesTarget: 30, todayDate: "2026-03-02", secondsToday: 500, goalMetToday: true
    });
  });

  it("settings : local gagne toujours, pas de fusion de préférences d'appareil", () => {
    const a = clone(REALISTIC);
    const b = clone(REALISTIC);
    a.settings.theme = "dark";
    b.settings.theme = "light";

    const merged = State._merge(a, b);
    expect(merged.settings).toEqual(a.settings);
  });

  it("version : toujours CURRENT_VERSION", () => {
    const merged = State._merge(REALISTIC, REALISTIC);
    expect(merged.version).toBe(State._currentVersion);
  });
});
