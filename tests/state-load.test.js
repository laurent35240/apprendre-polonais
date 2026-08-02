/* =====================================================================
   CARACTÉRISATION de la couche de persistance
   ---------------------------------------------------------------------
   Ces tests décrivent le comportement ACTUEL de js/state.js et passent sur le
   code tel qu'il est, SANS le modifier. Ils sont la preuve d'équivalence du
   palier 3 : ils doivent rester verts à chaque commit de la refonte.

   S'ils rougissent, c'est qu'un comportement a changé — pas qu'ils sont à
   mettre à jour. Les tests de CORRECTION (rouges avant, verts après) vivent
   dans des fichiers séparés.

   Toute fixture d'état exige une horloge figée : todayStr() est en heure locale
   et dueDate / todayDate y sont comparés. Voir tests/fixtures/README.md.
   ===================================================================== */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { State } from "../js/state.js";
import { SRS } from "../js/srs.js";
import { Gamification } from "../js/gamification.js";
import { POLISH_LESSONS } from "../data/lessons.js";
import { POLISH_BADGES } from "../data/badges.js";
import { ANCHOR, ANCHOR_DAY } from "./fixtures/anchor.js";
import REALISTIC from "./fixtures/state-v1-realistic.json";
import FRESH from "./fixtures/state-v1-fresh.json";
import ID_SNAPSHOT from "./fixtures/item-ids.json";

const KEY = "polski-zubr-v1";

/** Sérialisation à clés triées récursivement : compare la FORME, pas l'ordre. */
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

/**
 * Espionne les écritures localStorage. En happy-dom, le `Storage` global n'est
 * PAS le prototype réel de `localStorage` : spyOn(Storage.prototype) ne
 * capterait rien, et toute assertion « n'écrit pas » passerait à vide.
 * @returns {import("vitest").MockInstance}
 */
function espionnerEcritures() {
  return vi.spyOn(localStorage, "setItem");
}

/** Installe une sauvegarde dans localStorage et charge l'app dessus. */
function chargerAvec(save) {
  localStorage.setItem(KEY, JSON.stringify(save));
  return State.load();
}

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
  vi.setSystemTime(new Date(ANCHOR));
});
afterEach(() => {
  vi.useRealTimers();
});

/* ================== LE test du palier : la forme ne bouge pas ============ */
describe("stabilité de la forme persistée", () => {
  // Si ce test rougit pendant la refonte, la forme persistée a changé — ce que
  // le palier 3 interdit explicitement. C'est sa seule raison d'exister.
  it("un aller-retour load→save préserve la sauvegarde à l'octet près", () => {
    chargerAvec(REALISTIC);
    State.save();
    const relu = JSON.parse(/** @type {string} */ (localStorage.getItem(KEY)));
    expect(canonJSON(relu)).toBe(canonJSON(REALISTIC));
  });

  it("les 9 clés racine, et rien d'autre", () => {
    chargerAvec(REALISTIC);
    State.save();
    const relu = JSON.parse(/** @type {string} */ (localStorage.getItem(KEY)));
    expect(Object.keys(relu).sort()).toEqual([
      "badges", "dailyGoal", "flags", "items", "lessons", "profile", "settings",
      "streak", "version"
    ]);
  });

  it("chaque item garde exactement ses 5 champs", () => {
    chargerAvec(REALISTIC);
    for (const [id, item] of Object.entries(State.get().items)) {
      expect(Object.keys(item).sort(), id).toEqual([
        "box", "correctCount", "dueDate", "lastSeen", "seenCount"
      ]);
    }
  });

  it("chaque leçon garde exactement ses 2 champs", () => {
    chargerAvec(REALISTIC);
    for (const [id, l] of Object.entries(State.get().lessons)) {
      expect(Object.keys(l).sort(), id).toEqual(["bestScore", "status"]);
    }
  });
});

/* ========================== chargement nominal ========================== */
describe("chargement de la fixture réaliste", () => {
  it("restitue la progression en chiffres", () => {
    const s = chargerAvec(REALISTIC);
    expect(Object.keys(s.items)).toHaveLength(463);
    expect(s.profile.totalXP).toBe(10750);
    expect(s.profile.level).toBe(22);
    expect(s.badges).toHaveLength(7);
    expect(s.streak.current).toBe(5);
    expect(s.dailyGoal.secondsToday).toBe(1480);
    expect(s.version).toBe(1);
  });

  it("restitue les statuts de leçons", () => {
    const s = chargerAvec(REALISTIC);
    const parStatut = {};
    for (const l of Object.values(s.lessons)) {
      parStatut[l.status] = (parStatut[l.status] || 0) + 1;
    }
    expect(parStatut).toEqual({ completed: 29, available: 6, locked: 16 });
  });

  it("rolloverDay est un no-op : todayDate vaut déjà l'ancre", () => {
    chargerAvec(REALISTIC);
    const s = State.get();
    expect(s.dailyGoal.todayDate).toBe(ANCHOR_DAY);
    expect(s.dailyGoal.secondsToday).toBe(1480); // non remis à zéro
    expect(s.streak.current).toBe(5); // non cassé
  });
});

describe("premier lancement (localStorage vide)", () => {
  it("crée une entrée par leçon, seule celle d'order 1 est disponible", () => {
    const s = State.load();
    expect(Object.keys(s.lessons)).toHaveLength(POLISH_LESSONS.length);
    const premiere = [...POLISH_LESSONS].sort((a, b) => a.order - b.order)[0];
    expect(s.lessons[premiere.id].status).toBe("available");
    const dispo = Object.values(s.lessons).filter((l) => l.status === "available");
    expect(dispo).toHaveLength(1);
  });

  it("part sur les valeurs par défaut", () => {
    const s = State.load();
    expect(s.profile.totalXP).toBe(0);
    expect(s.profile.level).toBe(1);
    expect(s.items).toEqual({});
    expect(s.badges).toEqual([]);
    expect(s.streak).toEqual({ current: 0, longest: 0, lastActiveDate: null });
    expect(s.settings).toEqual({
      ttsRate: 0.9, voiceName: null, soundOn: true, theme: "auto"
    });
    expect(s.dailyGoal.todayDate).toBe(ANCHOR_DAY);
  });
});

/* ==================== la chaîne de déverrouillage ======================= */
describe("ensureLessonStatuses", () => {
  // LE cas discriminant, choisi pour que le tri par `order` soit la seule
  // implémentation qui passe. `lesson-05` a order 8 ; son successeur par ORDER
  // est `lesson-24` (order 9, position physique 23), alors que son successeur
  // PHYSIQUE est `lesson-06` (order 10). Un déverrouillage fondé sur la position
  // ouvrirait donc lesson-06 — vérifié par mutation : retirer le `.sort()` de
  // ensureLessonStatuses fait bien rougir ce test.
  it("déverrouille par ORDER et non par position dans le tableau", () => {
    const parOrder = [...POLISH_LESSONS].sort((a, b) => a.order - b.order);
    const idx = parOrder.findIndex((l) => l.id === "lesson-05");
    expect(parOrder[idx].order).toBe(8);
    expect(parOrder[idx + 1].id).toBe("lesson-24"); // successeur par order
    expect(POLISH_LESSONS[POLISH_LESSONS.findIndex((l) => l.id === "lesson-05") + 1].id)
      .toBe("lesson-06"); // successeur physique, à NE PAS ouvrir

    const s = chargerAvec(FRESH);
    expect(s.lessons["lesson-24"].status).toBe("available");
    expect(s.lessons["lesson-06"].status).toBe("locked");
  });

  it("complète les leçons absentes de la sauvegarde", () => {
    expect(Object.keys(FRESH.lessons)).toHaveLength(9);
    const s = chargerAvec(FRESH);
    expect(Object.keys(s.lessons)).toHaveLength(POLISH_LESSONS.length);
  });

  it("n'écrase aucune entrée existante", () => {
    const s = chargerAvec(FRESH);
    expect(s.lessons["lesson-01"]).toEqual({ status: "completed", bestScore: 100 });
    expect(s.lessons["lesson-03"]).toEqual({ status: "completed", bestScore: 72 });
  });

  it("ne rétrograde jamais une leçon terminée", () => {
    chargerAvec(REALISTIC);
    State.ensureLessonStatuses();
    State.ensureLessonStatuses();
    const done = Object.values(State.get().lessons)
      .filter((l) => l.status === "completed");
    expect(done).toHaveLength(29);
  });

  // Correction : reproduit le bug observé en prod après l'insertion de 10
  // leçons B1 (commit 9cd127b), qui a réassigné le champ `order` de leçons
  // déjà jouées. Une leçon "available" le reste pour toujours dans l'ancienne
  // implémentation (déverrouillage additif, jamais réévalué), même si son
  // prédécesseur PAR ORDER courant n'est plus `completed`.
  it("reverrouille une leçon 'available' si son prédécesseur actuel n'est plus 'completed'", () => {
    const s = chargerAvec(REALISTIC);
    const parOrder = [...POLISH_LESSONS].sort((a, b) => a.order - b.order);
    const idx = parOrder.findIndex((l) => s.lessons[l.id].status === "available");
    expect(idx).toBeGreaterThan(0); // il existe bien un prédécesseur

    s.lessons[parOrder[idx - 1].id].status = "locked";
    State.ensureLessonStatuses();

    expect(s.lessons[parOrder[idx].id].status).toBe("locked");
  });

  it("ne reverrouille jamais une leçon 'inProgress' même si son prédécesseur n'est plus 'completed'", () => {
    const s = chargerAvec(REALISTIC);
    const parOrder = [...POLISH_LESSONS].sort((a, b) => a.order - b.order);
    const idx = parOrder.findIndex((l) => s.lessons[l.id].status === "available");
    const id = parOrder[idx].id;

    s.lessons[id].status = "inProgress";
    s.lessons[parOrder[idx - 1].id].status = "locked";
    State.ensureLessonStatuses();

    expect(s.lessons[id].status).toBe("inProgress");
  });
});

/* ============================== rolloverDay ============================= */
describe("rolloverDay", () => {
  it("le lendemain : remet le compteur du jour, PRÉSERVE le streak", () => {
    chargerAvec(REALISTIC);
    vi.setSystemTime(new Date("2026-03-03T09:00:00"));
    State.rolloverDay();
    const s = State.get();
    expect(s.dailyGoal.todayDate).toBe("2026-03-03");
    expect(s.dailyGoal.secondsToday).toBe(0);
    expect(s.dailyGoal.goalMetToday).toBe(false);
    expect(s.streak.current).toBe(5); // lastActiveDate = hier → intact
  });

  it("après un trou de plusieurs jours : casse le streak", () => {
    chargerAvec(REALISTIC);
    vi.setSystemTime(new Date("2026-03-10T09:00:00"));
    State.rolloverDay();
    expect(State.get().streak.current).toBe(0);
  });

  it("le même jour : n'écrit pas", () => {
    chargerAvec(REALISTIC);
    const espion = espionnerEcritures();
    State.rolloverDay();
    expect(espion).not.toHaveBeenCalled();
    espion.mockRestore();
  });
});

/* ================== le SRS contre de la vraie donnée ==================== */
describe("SRS sur la fixture réaliste", () => {
  /** Premier id de la fixture dont la boîte vaut `box`. */
  const idEnBoite = (box) =>
    Object.keys(REALISTIC.items).find((id) => REALISTIC.items[id].box === box);

  it("une bonne réponse monte d'une boîte et repousse l'échéance", () => {
    chargerAvec(REALISTIC);
    const id = idEnBoite(3);
    const item = SRS.record(/** @type {string} */ (id), true);
    expect(item.box).toBe(4);
    expect(item.dueDate).toBe("2026-03-09"); // ancre + 7 j (INTERVALS[4])
  });

  it("un item déjà au maximum y reste", () => {
    chargerAvec(REALISTIC);
    const id = idEnBoite(5);
    expect(SRS.record(/** @type {string} */ (id), true).box).toBe(5);
  });

  it("une erreur renvoie en boîte 1 et rend l'item dû le jour même", () => {
    chargerAvec(REALISTIC);
    const id = idEnBoite(4);
    const item = SRS.record(/** @type {string} */ (id), false);
    expect(item.box).toBe(1);
    expect(item.dueDate).toBe(ANCHOR_DAY);
    expect(SRS.isDue(/** @type {string} */ (id))).toBe(true);
  });
});

/* ============================ badges ==================================== */
describe("badges sur la fixture réaliste", () => {
  it("aucun nouveau badge n'est accordé sur un état stabilisé", () => {
    chargerAvec(REALISTIC);
    const espion = espionnerEcritures();
    expect(Gamification.checkBadges()).toEqual([]);
    expect(espion).not.toHaveBeenCalled();
    espion.mockRestore();
  });
});

/* ================== cohérence interne de la fixture ===================== */
describe("cohérence de la fixture", () => {
  it("le niveau persisté est bien celui que dérive levelForXP", () => {
    expect(Gamification.levelForXP(REALISTIC.profile.totalXP))
      .toBe(REALISTIC.profile.level);
  });

  it("les 7 badges sont exactement ceux que les 11 check() accordent", () => {
    const accordes = POLISH_BADGES
      .filter((b) => b.check(/** @type {any} */ (REALISTIC)))
      .map((b) => b.id);
    expect(new Set(accordes)).toEqual(new Set(REALISTIC.badges));
  });

  it("les 463 ids existent tous dans data/lessons.js", () => {
    const connus = new Set(ID_SNAPSHOT);
    const orphelins = Object.keys(REALISTIC.items).filter((id) => !connus.has(id));
    expect(orphelins).toEqual([]);
  });

  it("l'objectif du jour n'est pas atteint : le verrou du bonus est testable", () => {
    expect(REALISTIC.dailyGoal.goalMetToday).toBe(false);
    expect(REALISTIC.dailyGoal.secondsToday)
      .toBeLessThan(REALISTIC.dailyGoal.minutesTarget * 60);
  });

  it("les fixtures sont ancrées sur le même jour", () => {
    expect(REALISTIC.dailyGoal.todayDate).toBe(ANCHOR_DAY);
    expect(REALISTIC.streak.lastActiveDate).toBe(ANCHOR_DAY);
    expect(FRESH.dailyGoal.todayDate).toBe(ANCHOR_DAY);
  });
});

/* ========================= export / import ============================== */
describe("aller-retour export/import", () => {
  it("exportJSON → importJSON → exportJSON est un point fixe", () => {
    chargerAvec(REALISTIC);
    const a = State.exportJSON();
    State.importJSON(a);
    expect(State.exportJSON()).toBe(a);
  });

  it("l'export est du JSON indenté à 2 espaces", () => {
    chargerAvec(REALISTIC);
    const texte = State.exportJSON();
    expect(texte).toContain('\n  "profile": {');
    expect(() => JSON.parse(texte)).not.toThrow();
  });
});

/* ===================== budget d'écritures : la mesure ==================== */
describe("budget d'écritures", () => {
  // Ces deux tests mesuraient le point de départ du palier (2 écritures par
  // bonne réponse, 6 par minute de chronomètre) et ont été mis à jour au commit
  // « écriture différée », qui est précisément ce qui les fait baisser. Les
  // chiffres historiques restent dans les commentaires — c'est la seule raison
  // pour laquelle ces tests ont changé.
  it("une réponse correcte n'écrit plus qu'une fois (contre deux)", () => {
    chargerAvec(REALISTIC);
    State.flush();
    const id = Object.keys(REALISTIC.items)[0];
    const espion = espionnerEcritures();
    SRS.record(id, true);
    State.touch("items." + id);
    Gamification.addXP(Gamification.XP_PER_CORRECT);
    State.scheduleSave();
    State.flush();
    expect(espion).toHaveBeenCalledTimes(1);
    espion.mockRestore();
  });

  it("une minute de chronomètre n'écrit plus qu'une fois (contre six)", () => {
    chargerAvec(REALISTIC);
    State.flush();
    const espion = espionnerEcritures();
    // Le versement passe de 10 s à 30 s, donc 2 appels par minute, et la
    // fenêtre d'absorption les regroupe.
    Gamification.addTime(30);
    Gamification.addTime(30);
    State.flush();
    expect(espion).toHaveBeenCalledTimes(1);
    espion.mockRestore();
  });
});
