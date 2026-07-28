/* =====================================================================
   SRS — répétition espacée. Module quasi pur : on utilise le VRAI State
   (aucune dépendance externe sur ce chemin), un mock masquerait le couplage
   réel entre todayStr() et dueDate.
   ===================================================================== */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { State } from "../js/state.js";
import { SRS } from "../js/srs.js";

const ID = "v-01-czesc";

beforeEach(() => {
  localStorage.clear();
  State.load();
});
afterEach(() => {
  vi.useRealTimers();
});

describe("progression des boîtes", () => {
  it("un item neuf démarre en boîte 1", () => {
    const item = SRS.ensureItem(ID);
    expect(item.box).toBe(1);
    expect(item.seenCount).toBe(0);
    expect(item.dueDate).toBe(State.todayStr());
  });

  it("une bonne réponse monte d'une boîte", () => {
    const item = SRS.record(ID, true);
    expect(item.box).toBe(2);
    expect(item.seenCount).toBe(1);
    expect(item.correctCount).toBe(1);
  });

  it("plafonne à MAX_BOX (5), pas au-delà", () => {
    const boites = [];
    for (let i = 0; i < 6; i++) boites.push(SRS.record(ID, true).box);
    expect(boites).toEqual([2, 3, 4, 5, 5, 5]);
    expect(SRS.MAX_BOX).toBe(5);
  });

  it("une erreur renvoie en boîte 1 depuis n'importe quelle boîte", () => {
    for (let i = 0; i < 4; i++) SRS.record(ID, true); // → boîte 5
    expect(SRS.record(ID, false).box).toBe(1);
  });

  it("seenCount compte tout, correctCount seulement les réussites", () => {
    SRS.record(ID, true);
    SRS.record(ID, false);
    SRS.record(ID, true);
    const item = SRS.ensureItem(ID);
    expect(item.seenCount).toBe(3);
    expect(item.correctCount).toBe(2);
  });
});

describe("échéances", () => {
  // INTERVALS n'a PAS de clé 0 et box démarre à 1, donc INTERVALS[1] === 0.
  // Conséquence à figer : un item RATÉ retombe en boîte 1 et redevient dû
  // le jour même. C'est voulu (on le revoit tout de suite).
  it("un item raté est dû immédiatement", () => {
    SRS.record(ID, true);
    SRS.record(ID, false);
    expect(SRS.ensureItem(ID).dueDate).toBe(State.todayStr());
    expect(SRS.isDue(ID)).toBe(true);
  });

  it("les intervalles suivent 0, 1, 3, 7, 16 jours selon la boîte", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-02T12:00:00"));
    const attendus = ["2026-03-03", "2026-03-05", "2026-03-09", "2026-03-18"];
    for (const attendu of attendus)
      expect(SRS.record(ID, true).dueDate).toBe(attendu);
  });

  it("isDue est faux pour un id inconnu, sans le créer", () => {
    expect(SRS.isDue("id-inexistant")).toBe(false);
    expect(State.get().items["id-inexistant"]).toBeUndefined();
  });

  it("dueItems tolère undefined et filtre les non-dus", () => {
    expect(SRS.dueItems(undefined)).toEqual([]);
    expect(SRS.dueItems([])).toEqual([]);
    SRS.record(ID, true); // dû demain
    expect(SRS.dueItems([ID])).toEqual([]);
    SRS.record(ID, false); // dû aujourd'hui
    expect(SRS.dueItems([ID])).toEqual([ID]);
  });
});

describe("arithmétique de dates", () => {
  // addDaysISO utilise setDate, donc de l'arithmétique CALENDAIRE et non
  // « +86400 s ». Ces cas verrouillent précisément cette différence.
  const cas = [
    ["fin de mois", "2026-01-31T12:00:00", "2026-02-01"],
    ["année bissextile", "2028-02-28T12:00:00", "2028-02-29"],
    ["fin d'année", "2026-12-31T12:00:00", "2027-01-01"],
    ["passage à l'heure d'été", "2026-03-28T23:30:00", "2026-03-29"],
    ["passage à l'heure d'hiver", "2026-10-24T23:30:00", "2026-10-25"]
  ];

  it.each(cas)("%s", (_nom, maintenant, attendu) => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(maintenant));
    localStorage.clear();
    State.load();
    // boîte 1 → 2 donne un intervalle de 1 jour
    expect(SRS.record(ID, true).dueDate).toBe(attendu);
  });
});

describe("strength", () => {
  it("vaut 0 en boîte 1 et 1 en boîte 5", () => {
    expect(SRS.strength("inconnu")).toBe(0);
    SRS.ensureItem(ID);
    expect(SRS.strength(ID)).toBe(0);
    for (let i = 0; i < 4; i++) SRS.record(ID, true);
    expect(SRS.ensureItem(ID).box).toBe(5);
    expect(SRS.strength(ID)).toBe(1);
  });
});
