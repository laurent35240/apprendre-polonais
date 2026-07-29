/* =====================================================================
   MIGRATIONS VERSIONNÉES et refus des sauvegardes du futur
   ---------------------------------------------------------------------
   La mécanique est testée À VIDE : le schéma reste en v1 et MIGRATIONS est
   vide, donc les tests de chaînage utilisent des migrations FACTICES. C'est
   possible parce que runMigrations est pure et paramétrée — elle ne lit ni
   CURRENT_VERSION ni MIGRATIONS.

   Le jour où une vraie v2 sera écrite, ces tests couvriront déjà le chaînage.
   ===================================================================== */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { State } from "../js/state.js";
import { SRS } from "../js/srs.js";
import { ANCHOR } from "./fixtures/anchor.js";
import REALISTIC from "./fixtures/state-v1-realistic.json";
import FUTURE from "./fixtures/state-v2-future.json";

const KEY = "polski-zubr-v1";

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
  vi.setSystemTime(new Date(ANCHOR));
  vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

/* ===================== chaînage, avec des migrations factices ============ */
describe("runMigrations", () => {
  /** @type {any[]} */
  const FACTICES = [
    { to: 2, up: (s) => ({ ...s, b: (s.a ?? 0) * 2 }) },
    { to: 3, up: (s) => ({ ...s, c: (s.b ?? 0) + 1 }) }
  ];

  it("applique toute la chaîne depuis la v1", () => {
    const r = State._runMigrations({ version: 1, a: 5 }, FACTICES, 3);
    expect(r.from).toBe(1);
    expect(r.applied).toEqual([2, 3]);
    expect(r.state).toMatchObject({ b: 10, c: 11 });
  });

  it("n'applique que ce qui manque", () => {
    const r = State._runMigrations({ version: 2, b: 4 }, FACTICES, 3);
    expect(r.applied).toEqual([3]);
    expect(r.state).toMatchObject({ c: 5 });
  });

  it("n'applique rien sur un état déjà à jour", () => {
    expect(State._runMigrations({ version: 3 }, FACTICES, 3).applied).toEqual([]);
  });

  it("s'arrête à la cible même si la chaîne va plus loin", () => {
    const r = State._runMigrations({ version: 1, a: 1 }, FACTICES, 2);
    expect(r.applied).toEqual([2]);
    expect(r.state.c).toBeUndefined();
  });

  it("propage l'erreur d'une migration : le repli est l'affaire de load()", () => {
    const casse = [{ to: 2, up: () => { throw new Error("boum"); } }];
    expect(() => State._runMigrations({ version: 1 }, casse, 2)).toThrow("boum");
  });

  it("une migration qui ne renvoie rien mute en place", () => {
    const enPlace = [{ to: 2, up: (s) => { s.touche = true; } }];
    expect(State._runMigrations({ version: 1 }, enPlace, 2).state.touche).toBe(true);
  });
});

describe("readVersion : tolérante", () => {
  // Toutes les sauvegardes écrites avant ce palier valent 1, et une version
  // poubelle ne doit pas enfermer l'utilisateur en lecture seule.
  it.each([
    ["absente", {}],
    ["null", { version: null }],
    ["chaîne", { version: "2" }],
    ["NaN", { version: NaN }],
    ["Infinity", { version: Infinity }],
    ["zéro", { version: 0 }],
    ["négative", { version: -7 }],
    ["fractionnaire", { version: 1.9 }],
    ["racine non-objet", null]
  ])("%s → traitée comme 1", (_nom, entree) => {
    expect(State._readVersion(entree)).toBe(1);
  });

  it("une version entière supérieure est lue telle quelle", () => {
    expect(State._readVersion({ version: 2 })).toBe(2);
    expect(State._readVersion({ version: 17 })).toBe(17);
  });
});

describe("invariants du tableau MIGRATIONS réel", () => {
  it("est vide tant que CURRENT_VERSION vaut 1", () => {
    if (State._currentVersion === 1) {
      expect(State._migrations).toEqual([]);
    }
  });

  it("serait trié, contigu, et atteindrait CURRENT_VERSION", () => {
    const tos = State._migrations.map((m) => m.to);
    expect(tos).toEqual([...tos].sort((a, b) => a - b));
    expect(new Set(tos).size).toBe(tos.length);
    if (tos.length) {
      expect(tos).toEqual(tos.map((_, i) => i + 2));
      expect(tos[tos.length - 1]).toBe(State._currentVersion);
    }
    for (const m of State._migrations) expect(typeof m.up).toBe("function");
  });

  it("MAX_BOX_PERSISTED reste aligné sur SRS.MAX_BOX", () => {
    // Dupliqué pour éviter un cycle d'imports : ce test verrouille l'égalité.
    expect(State._maxBox).toBe(SRS.MAX_BOX);
  });
});

/* ================= le garde-fou : sauvegarde du futur ==================== */
describe("sauvegarde d'une version future", () => {
  beforeEach(() => {
    localStorage.setItem(KEY, JSON.stringify(FUTURE));
  });

  it("passe en lecture seule au lieu de rétrograder", () => {
    State.load();
    const st = State.status();
    expect(st.mode).toBe("readonly");
    expect(st.reason).toBe("future-version");
    expect(st.loadedVersion).toBe(2);
  });

  it("affiche quand même la progression lue, pour ne pas alarmer", () => {
    const s = State.load();
    expect(s.profile.totalXP).toBe(12000);
    expect(s.profile.level).toBe(25);
  });

  // LE test du garde-fou : une session entière ne doit pas déplacer un octet.
  it("une session complète ne modifie pas le localStorage", () => {
    const avant = /** @type {string} */ (localStorage.getItem(KEY));
    State.load();
    const ids = Object.keys(FUTURE.items);
    for (const id of ids.slice(0, 5)) SRS.record(id, true);
    State.save();
    State.rolloverDay();
    State.ensureLessonStatuses();
    State.save();
    expect(localStorage.getItem(KEY)).toBe(avant);
  });

  it("save() refuse d'écrire et le signale", () => {
    State.load();
    expect(State.save()).toBe(false);
  });

  it("exportJSON rend le texte brut ORIGINAL, octet pour octet", () => {
    const brut = /** @type {string} */ (localStorage.getItem(KEY));
    State.load();
    expect(State.exportJSON()).toBe(brut);
  });

  it("importJSON d'une v2 lève et ne touche à rien", () => {
    localStorage.clear();
    localStorage.setItem(KEY, JSON.stringify(REALISTIC));
    State.load();
    const avant = /** @type {string} */ (localStorage.getItem(KEY));
    expect(() => State.importJSON(JSON.stringify(FUTURE))).toThrow();
    expect(localStorage.getItem(KEY)).toBe(avant);
    expect(State.get().profile.totalXP).toBe(10750);
  });

  it("reset() lève le mode lecture seule : c'est un écrasement intentionnel", () => {
    State.load();
    expect(State.status().mode).toBe("readonly");
    State.reset();
    expect(State.status().mode).toBe("normal");
    expect(State.save()).toBe(true);
    expect(JSON.parse(/** @type {string} */ (localStorage.getItem(KEY))).version).toBe(1);
  });

  it("recharger une v1 ensuite remet le mode normal", () => {
    State.load();
    expect(State.status().mode).toBe("readonly");
    localStorage.setItem(KEY, JSON.stringify(REALISTIC));
    State.load();
    expect(State.status().mode).toBe("normal");
    expect(State.save()).toBe(true);
  });

  it("le renommage box→strength ne fait pas taire le SRS en silence", () => {
    // Sur une v2 où `box` devient `strength`, un code v1 comparerait
    // `undefined <= aujourd'hui` → false, et AUCUN item ne serait plus dû.
    // Le garde-fou rend la question sans objet : on n'écrit rien.
    State.load();
    expect(State.status().mode).toBe("readonly");
    expect(FUTURE.items[Object.keys(FUTURE.items)[0]].box).toBeUndefined();
  });
});
