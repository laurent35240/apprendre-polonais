/* =====================================================================
   CORRUPTION de la sauvegarde — tests de CORRECTION
   ---------------------------------------------------------------------
   Contrairement à tests/state-load.test.js (caractérisation, vert avant et
   après), ces tests sont rouges au départ et deviennent verts au fil du palier.
   Ils décrivent le comportement VOULU, pas l'actuel.

   Les corruptions sont construites en empoisonnant la fixture réaliste plutôt
   que stockées en fichiers : ça permet d'asserter que la progression des
   sous-arbres SAINS a survécu, ce qu'une fixture isolée ne prouverait pas.
   ===================================================================== */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { State } from "../js/state.js";
import { SRS } from "../js/srs.js";
import { Gamification } from "../js/gamification.js";
import { ANCHOR } from "./fixtures/anchor.js";
import REALISTIC from "./fixtures/state-v1-realistic.json";

const KEY = "polski-zubr-v1";

/** @param {unknown} save */
function poser(save) {
  localStorage.setItem(KEY, JSON.stringify(save));
}

/**
 * Les 13 poisons. Chacun part de la fixture réaliste et n'abîme qu'un endroit :
 * on peut donc vérifier que le reste de la progression survit.
 * @type {[string, () => unknown][]}
 */
const POISONS = [
  ["items primitif", () => ({ ...REALISTIC, items: 42 })],
  // Le pire de tous : un tableau est truthy, accepte les clés string, et l'app
  // fonctionne — puis JSON.stringify ignore les propriétés non-indicielles, si
  // bien que chaque save() réécrit []. Perte totale sans aucun symptôme.
  ["items tableau", () => ({ ...REALISTIC, items: [] })],
  ["lessons primitif", () => ({ ...REALISTIC, lessons: 42 })],
  ["lessons tableau", () => ({ ...REALISTIC, lessons: [] })],
  ["badges primitif", () => ({ ...REALISTIC, badges: 42 })],
  ["badges objet", () => ({ ...REALISTIC, badges: {} })],
  ["profile primitif", () => ({ ...REALISTIC, profile: 42 })],
  ["settings null", () => ({ ...REALISTIC, settings: null })],
  ["streak chaîne", () => ({ ...REALISTIC, streak: "abc" })],
  [
    "item malformé",
    () => ({ ...REALISTIC, items: { ...REALISTIC.items, "v-01-czesc": "boum" } })
  ],
  [
    "champs d'item hors bornes",
    () => ({
      ...REALISTIC,
      items: {
        ...REALISTIC.items,
        "v-01-czesc": { box: 99, dueDate: "pas-une-date", seenCount: -5 }
      }
    })
  ],
  [
    "statut de leçon inconnu",
    () => ({
      ...REALISTIC,
      lessons: { ...REALISTIC.lessons, "lesson-01": { status: "zzz", bestScore: 90 } }
    })
  ],
  ["clé racine inconnue", () => ({ ...REALISTIC, avatarUrl: "x" })]
];

/** Racines qui ne sont pas un objet ordinaire : rien à sauver. */
const RACINES_INVALIDES = [
  ["null", "null"],
  ["tableau", "[]"],
  ["chaîne", '"abc"'],
  ["nombre", "0"],
  ["booléen", "true"]
];

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

describe("aucune corruption ne fait lever le chargement", () => {
  it.each(POISONS)("%s", (_nom, empoisonner) => {
    poser(empoisonner());
    expect(() => State.load()).not.toThrow();
  });

  it.each(RACINES_INVALIDES)("racine %s", (_nom, brut) => {
    localStorage.setItem(KEY, brut);
    expect(() => State.load()).not.toThrow();
  });
});

describe("la progression des sous-arbres sains survit", () => {
  /** Poisons qui n'abîment qu'un sous-arbre : le reste doit être intact. */
  const CIBLES = POISONS.filter(([nom]) =>
    /^(items|lessons|badges|settings|streak|profile)/.test(nom) === false ||
    /primitif|tableau|objet|null|chaîne/.test(nom)
  );

  it.each(CIBLES)("%s : l'XP et le niveau survivent", (nom, empoisonner) => {
    if (/^profile/.test(nom)) return; // le poison cible justement le profil
    poser(empoisonner());
    const s = State.load();
    expect(s.profile.totalXP).toBe(10750);
    expect(s.profile.level).toBe(22);
  });

  it("items corrompu : les 29 leçons et les 7 badges survivent", () => {
    poser({ ...REALISTIC, items: 42 });
    const s = State.load();
    expect(s.badges).toHaveLength(7);
    expect(
      Object.values(s.lessons).filter((l) => l.status === "completed")
    ).toHaveLength(29);
  });

  it("badges corrompu : les 463 items et les 29 leçons survivent", () => {
    poser({ ...REALISTIC, badges: 42 });
    const s = State.load();
    expect(Object.keys(s.items)).toHaveLength(463);
    expect(
      Object.values(s.lessons).filter((l) => l.status === "completed")
    ).toHaveLength(29);
  });

  it("lessons corrompu : les 463 items et les 7 badges survivent", () => {
    poser({ ...REALISTIC, lessons: 42 });
    const s = State.load();
    expect(Object.keys(s.items)).toHaveLength(463);
    expect(s.badges).toHaveLength(7);
  });
});

describe("l'état reste utilisable après corruption", () => {
  it("items corrompu : répondre à un exercice ne lève pas", () => {
    // Le mode « exercice figé » : aujourd'hui SRS.record lève sur un primitif,
    // après que la carte a été verrouillée mais avant le feedback.
    poser({ ...REALISTIC, items: 42 });
    State.load();
    expect(() => SRS.record("v-01-czesc", true)).not.toThrow();
  });

  it("badges corrompu : vérifier les badges ne lève pas", () => {
    // Le mode « page blanche » : s.badges.indexOf est hors du try/catch de
    // checkBadges, donc l'exception remonte jusqu'à boot().
    poser({ ...REALISTIC, badges: 42 });
    State.load();
    expect(() => Gamification.checkBadges()).not.toThrow();
  });

  it("lessons corrompu : le chargement reconstruit les 40 leçons", () => {
    poser({ ...REALISTIC, lessons: 42 });
    const s = State.load();
    expect(Object.keys(s.lessons)).toHaveLength(40);
  });
});

describe("items n'est JAMAIS persisté comme un tableau", () => {
  // Sans rejet explicite des tableaux, ce cycle perd tout en silence.
  it("un tableau est remplacé par un objet, et un item écrit survit au cycle", () => {
    poser({ ...REALISTIC, items: [] });
    State.load();
    SRS.record("v-01-czesc", true);
    State.save();
    const relu = JSON.parse(/** @type {string} */ (localStorage.getItem(KEY)));
    expect(Array.isArray(relu.items)).toBe(false);
    expect(relu.items["v-01-czesc"]).toBeDefined();
  });

  it("lessons non plus", () => {
    poser({ ...REALISTIC, lessons: [] });
    State.load();
    State.save();
    const relu = JSON.parse(/** @type {string} */ (localStorage.getItem(KEY)));
    expect(Array.isArray(relu.lessons)).toBe(false);
    expect(Object.keys(relu.lessons)).toHaveLength(40);
  });
});

describe("le localStorage ne contient jamais que les 9 clés connues", () => {
  const CLES = [
    "badges", "dailyGoal", "flags", "items", "lessons", "profile", "settings",
    "streak", "version"
  ];

  it("une clé racine inconnue n'est pas re-persistée", () => {
    poser({ ...REALISTIC, avatarUrl: "x", 0: "a" });
    State.load();
    State.save();
    const relu = JSON.parse(/** @type {string} */ (localStorage.getItem(KEY)));
    expect(Object.keys(relu).sort()).toEqual(CLES);
  });

  it.each(RACINES_INVALIDES)("une racine %s ne pollue pas la forme", (_nom, brut) => {
    localStorage.setItem(KEY, brut);
    State.load();
    State.save();
    const relu = JSON.parse(/** @type {string} */ (localStorage.getItem(KEY)));
    expect(Object.keys(relu).sort()).toEqual(CLES);
  });
});

describe("bornes et types des champs réparés", () => {
  /** Charge un état empoisonné et rend l'item ciblé. */
  function itemApres(champs) {
    poser({ ...REALISTIC, items: { "v-01-czesc": champs } });
    return State.load().items["v-01-czesc"];
  }

  it("box est ramenée dans 1..5", () => {
    expect(itemApres({ box: 99 }).box).toBe(5);
    expect(itemApres({ box: 0 }).box).toBe(1);
    expect(itemApres({ box: "3" }).box).toBe(1);
  });

  it("une date invalide devient aujourd'hui", () => {
    expect(itemApres({ box: 2, dueDate: "hier" }).dueDate).toBe("2026-03-02");
  });

  it("bestScore est ramené dans 0..100", () => {
    poser({ ...REALISTIC, lessons: { "lesson-01": { status: "completed", bestScore: 5000 } } });
    expect(State.load().lessons["lesson-01"].bestScore).toBe(100);
  });

  it("les réglages invalides retombent sur leurs défauts", () => {
    poser({
      ...REALISTIC,
      settings: { ttsRate: NaN, theme: "néon", soundOn: "oui", voiceName: "" }
    });
    const s = State.load().settings;
    expect(s.ttsRate).toBe(0.9);
    expect(s.theme).toBe("auto");
    expect(s.soundOn).toBe(true);
    expect(s.voiceName).toBeNull();
  });
});

describe("journal des réparations", () => {
  it("est VIDE sur la fixture saine", () => {
    // Le test qui garantit qu'on ne « répare » pas la vraie donnée.
    poser(REALISTIC);
    State.load();
    expect(State.status().repairs).toEqual([]);
  });

  it("nomme le champ réparé", () => {
    poser({ ...REALISTIC, items: 42 });
    State.load();
    const r = State.status().repairs;
    expect(r.length).toBeGreaterThan(0);
    expect(r.join(" ")).toMatch(/items/);
  });
});

describe("sauvegarde illisible", () => {
  it("un JSON tronqué retombe sur l'état par défaut sans lever", () => {
    localStorage.setItem(KEY, '{"version":1,"profile":{"totalXP":10');
    expect(() => State.load()).not.toThrow();
    expect(State.get().profile.totalXP).toBe(0);
  });
});
