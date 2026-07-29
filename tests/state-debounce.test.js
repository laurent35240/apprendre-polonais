/* =====================================================================
   ÉCRITURE DIFFÉRÉE et flush de sortie
   ---------------------------------------------------------------------
   Le budget de départ, mesuré dans tests/state-load.test.js : une bonne réponse
   écrivait DEUX fois, et le chronomètre 6 fois par minute. Ces tests vérifient
   la coalescence et, surtout, qu'aucune écriture ne peut rester en attente
   indéfiniment ni être perdue à la fermeture de l'onglet.
   ===================================================================== */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { State } from "../js/state.js";
import { SRS } from "../js/srs.js";
import { Gamification } from "../js/gamification.js";
import { ANCHOR } from "./fixtures/anchor.js";
import REALISTIC from "./fixtures/state-v1-realistic.json";

const KEY = "polski-zubr-v1";

/** En happy-dom, le Storage global n'est pas le prototype de localStorage. */
function espionnerEcritures() {
  return vi.spyOn(localStorage, "setItem");
}

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
  vi.setSystemTime(new Date(ANCHOR));
  vi.spyOn(console, "warn").mockImplementation(() => {});
  localStorage.setItem(KEY, JSON.stringify(REALISTIC));
  State.load();
});
afterEach(() => {
  State.flush();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("coalescence", () => {
  it("20 mutations rapprochées ne font qu'UNE écriture", () => {
    const espion = espionnerEcritures();
    const ids = Object.keys(REALISTIC.items).slice(0, 20);
    for (const id of ids) {
      SRS.record(id, true);
      State.touch("items." + id);
      State.scheduleSave();
    }
    expect(espion).not.toHaveBeenCalled(); // rien encore
    vi.advanceTimersByTime(3000);
    expect(espion).toHaveBeenCalledTimes(1);
  });

  it("sans avancer les timers, rien n'est écrit — le debounce est réel", () => {
    const espion = espionnerEcritures();
    State.touch("profile");
    State.scheduleSave();
    vi.advanceTimersByTime(2999);
    expect(espion).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(espion).toHaveBeenCalledTimes(1);
  });

  it("une bonne réponse n'écrit plus qu'une fois", () => {
    // Elle en écrivait DEUX : addXP puis recordAndFeedback.
    const espion = espionnerEcritures();
    const id = Object.keys(REALISTIC.items)[0];
    SRS.record(id, true);
    State.touch("items." + id);
    Gamification.addXP(Gamification.XP_PER_CORRECT);
    State.scheduleSave();
    vi.advanceTimersByTime(3000);
    expect(espion).toHaveBeenCalledTimes(1);
  });
});

describe("fenêtre d'absorption", () => {
  // Le throttle ne RÉARME pas : toute mutation survenant pendant que le timer
  // court est absorbée sans repousser l'écriture. C'est ce qui borne le volume,
  // là où un debounce classique se serait contenté de grouper les rafales.
  it("des mutations continues sur 30 s tiennent en ~10 écritures", () => {
    const espion = espionnerEcritures();
    for (let i = 0; i < 30; i++) {
      State.touch("profile");
      State.scheduleSave();
      vi.advanceTimersByTime(1000); // une mutation par seconde
    }
    expect(espion.mock.calls.length).toBeGreaterThan(0);
    expect(espion.mock.calls.length).toBeLessThanOrEqual(11);
  });

  it("une mutation pendant le timer ne repousse pas l'écriture", () => {
    const espion = espionnerEcritures();
    State.touch("profile");
    State.scheduleSave();
    vi.advanceTimersByTime(2000);
    State.touch("streak"); // arrive après 2 s
    State.scheduleSave();
    vi.advanceTimersByTime(1000); // 3 s depuis la PREMIÈRE
    expect(espion).toHaveBeenCalledTimes(1);
  });

  it("aucune modification n'attend plus que la fenêtre", () => {
    const espion = espionnerEcritures();
    State.touch("profile");
    State.scheduleSave();
    vi.advanceTimersByTime(3000);
    expect(espion).toHaveBeenCalledTimes(1);
    expect(State.isDirty()).toBe(false);
  });
});

describe("flush", () => {
  it("écrit immédiatement ce qui est en attente", () => {
    const espion = espionnerEcritures();
    State.touch("profile");
    State.scheduleSave();
    expect(espion).not.toHaveBeenCalled();
    expect(State.flush()).toBe(true);
    expect(espion).toHaveBeenCalledTimes(1);
  });

  it("est un no-op quand rien n'est sale : pas d'écriture gratuite", () => {
    State.flush(); // vide l'ensemble
    const espion = espionnerEcritures();
    expect(State.flush()).toBe(false);
    expect(espion).not.toHaveBeenCalled();
  });

  it("appelé trois fois de suite, n'écrit qu'une fois", () => {
    State.touch("profile");
    State.scheduleSave();
    const espion = espionnerEcritures();
    State.flush();
    State.flush();
    State.flush();
    expect(espion).toHaveBeenCalledTimes(1);
  });

  it("annule le timer : pas de double écriture après un flush", () => {
    State.touch("profile");
    State.scheduleSave();
    const espion = espionnerEcritures();
    State.flush();
    vi.advanceTimersByTime(5000);
    expect(espion).toHaveBeenCalledTimes(1);
  });
});

describe("isolation entre chargements", () => {
  it("load() annule une écriture en attente", () => {
    // Sinon le timer d'un test écrirait l'état du test précédent.
    State.touch("profile");
    State.scheduleSave();
    const espion = espionnerEcritures();
    State.load();
    vi.advanceTimersByTime(5000);
    expect(espion).not.toHaveBeenCalled();
    expect(State.isDirty()).toBe(false);
  });
});

describe("rolloverDay écrit sans attendre", () => {
  it("franchir minuit est persisté immédiatement", () => {
    // Un crash à 00 h 00 min 05 s ne doit pas ressusciter les secondes de la
    // veille ni faire perdre un jour de streak.
    vi.setSystemTime(new Date("2026-03-03T00:00:05"));
    const espion = espionnerEcritures();
    State.rolloverDay();
    expect(espion).toHaveBeenCalledTimes(1); // sans avancer aucun timer
    expect(JSON.parse(/** @type {string} */ (localStorage.getItem(KEY)))
      .dailyGoal.todayDate).toBe("2026-03-03");
  });
});

describe("suivi des chemins modifiés", () => {
  it("nomme précisément ce qui a bougé", () => {
    State.flush();
    const id = Object.keys(REALISTIC.items)[0];
    SRS.record(id, true);
    State.touch("items." + id);
    Gamification.addXP(10);
    expect(State.dirtyPaths()).toEqual(["items." + id, "profile"]);
  });

  it("un réglage ne touche pas aux items — spécification exécutable", () => {
    State.flush();
    State.get().settings.theme = "dark";
    State.touch("settings");
    expect(State.dirtyPaths()).toEqual(["settings"]);
  });

  it("save() remet le compteur à zéro", () => {
    State.touch("profile");
    expect(State.isDirty()).toBe(true);
    State.save();
    expect(State.isDirty()).toBe(false);
    expect(State.dirtyPaths()).toEqual([]);
  });
});

describe("lecture seule", () => {
  it("scheduleSave ne programme rien", () => {
    localStorage.setItem(KEY, JSON.stringify({ ...REALISTIC, version: 99 }));
    State.load();
    expect(State.status().mode).toBe("readonly");
    const espion = espionnerEcritures();
    State.touch("profile");
    State.scheduleSave();
    vi.advanceTimersByTime(60000);
    expect(espion).not.toHaveBeenCalled();
  });
});

describe("budget d'une session de référence", () => {
  // 20 exercices, 15 bonnes réponses, 5 minutes d'activité.
  // AVANT : ~70 écritures (2 par bonne réponse + 6/min de chronomètre + 4 en
  // fin de session + 1 gratuite par touchActivity).
  // APRÈS : 21 mesurées. Le plancher est d'une écriture par réponse, et c'est
  // sémantiquement juste — une réponse est une unité de progression, et la
  // fenêtre de 3 s ne peut pas fusionner des réponses espacées de 15 s. Les
  // fusionner exigerait une fenêtre ≥ 15 s, donc jusqu'à 15 s de perte sur
  // crash : mauvais échange.
  it("reste sous 25 écritures (contre ~70 avant)", () => {
    State.flush();
    const espion = espionnerEcritures();
    const ids = Object.keys(REALISTIC.items).slice(0, 20);

    Gamification.touchActivity();
    ids.forEach((id, i) => {
      const correct = i < 15;
      SRS.record(id, correct);
      State.touch("items." + id);
      if (correct) Gamification.addXP(Gamification.XP_PER_CORRECT);
      State.scheduleSave();
      // ~15 s entre deux réponses, comme dans une session réelle
      vi.advanceTimersByTime(15000);
      if (i % 2 === 0) Gamification.addTime(10);
    });
    State.flush();

    expect(espion.mock.calls.length).toBeLessThanOrEqual(25);
    expect(espion.mock.calls.length).toBeGreaterThan(0);
  });
});
