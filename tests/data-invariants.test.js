/* =====================================================================
   INVARIANTS DE DONNÉES — data/lessons.js et data/badges.js
   ---------------------------------------------------------------------
   Ces contraintes ne sont PAS exprimables en TypeScript (unicité sur 947 ids,
   « exactement une ligne target », wordBank ⊇ mots(pl), clés étrangères…) :
   ce fichier est donc le seul filet possible.
   ===================================================================== */
import { describe, it, expect } from "vitest";
import { POLISH_LESSONS } from "../data/lessons.js";
import { POLISH_BADGES } from "../data/badges.js";
import { Speech } from "../js/speech.js";
import ID_SNAPSHOT from "./fixtures/item-ids.json";

const vocab = POLISH_LESSONS.flatMap((l) =>
  (l.vocabulary || []).map((v) => ({ ...v, _lesson: l.id }))
);
const sentences = POLISH_LESSONS.flatMap((l) =>
  (l.sentences || []).map((s) => ({ ...s, _lesson: l.id }))
);
const dialogues = POLISH_LESSONS.flatMap((l) =>
  (l.dialogues || []).map((d) => ({ ...d, _lesson: l.id }))
);
const lignesDialogue = dialogues.flatMap((d) =>
  d.lines.map((li) => ({ ...li, _dialogue: d.id }))
);
const grammarNotes = POLISH_LESSONS.flatMap((l) =>
  (l.grammarNotes || []).map((g) => ({ ...g, _lesson: l.id }))
);
const tousLesIds = [
  ...vocab.map((v) => v.id),
  ...sentences.map((s) => s.id),
  ...dialogues.map((d) => d.id)
];

// Les mots d'une phrase, normalisés avec la MÊME fonction que la correction.
const mots = (s) => Speech.normalize(s).split(/\s+/).filter(Boolean);

/* ------------------------------ structure ---------------------------- */
describe("structure", () => {
  it("65 leçons, ids uniques", () => {
    expect(POLISH_LESSONS).toHaveLength(65);
    expect(new Set(POLISH_LESSONS.map((l) => l.id)).size).toBe(65);
  });

  it("1011 item-ids au total, tous uniques", () => {
    expect(vocab).toHaveLength(726);
    expect(sentences).toHaveLength(260);
    expect(dialogues).toHaveLength(25);
    expect(tousLesIds).toHaveLength(1011);
    expect(new Set(tousLesIds).size).toBe(1011);
  });

  it("order est exactement [1..65]", () => {
    const ordres = POLISH_LESSONS.map((l) => l.order).sort((a, b) => a - b);
    expect(ordres).toEqual(Array.from({ length: 65 }, (_, i) => i + 1));
  });

  it("chaque leçon a 4 phrases et 2 notes de grammaire", () => {
    for (const l of POLISH_LESSONS) {
      expect(l.sentences, l.id).toHaveLength(4);
      expect(l.grammarNotes, l.id).toHaveLength(2);
    }
    expect(sentences).toHaveLength(260);
    expect(grammarNotes).toHaveLength(130);
  });

  it("les champs obligatoires sont présents partout", () => {
    for (const l of POLISH_LESSONS)
      for (const k of ["id", "order", "title", "theme", "mascotIntro"])
        expect(l[k], `${l.id}.${k}`).toBeTruthy();
    for (const v of vocab)
      for (const k of ["id", "pl", "fr", "category"])
        expect(v[k], `${v.id}.${k}`).toBeTruthy();
    for (const s of sentences)
      for (const k of ["id", "pl", "fr", "grammarFocus", "wordBank"])
        expect(s[k], `${s.id}.${k}`).toBeTruthy();
  });
});

/* --------------------- instantané des ids (clés SRS) ----------------- */
describe("instantané des ids", () => {
  // Les ids sont les CLÉS de progression en localStorage : renommer un id
  // efface silencieusement l'historique SRS de ce mot chez l'utilisateur.
  it("aucun id n'a été renommé ni supprimé", () => {
    expect(tousLesIds.slice().sort()).toEqual(ID_SNAPSHOT.slice().sort());
  });
});

/* ------------------------------ dialogues ---------------------------- */
describe("dialogues", () => {
  it("exactement 1 ligne target par dialogue, et elle a un wordBank", () => {
    for (const d of dialogues) {
      const cibles = d.lines.filter((li) => li.target);
      expect(cibles, d.id).toHaveLength(1);
      expect(cibles[0].wordBank, d.id).toBeTruthy();
    }
    // makeDialogue retourne null sans cible, et session.js l'ignore en silence.
    expect(dialogues).toHaveLength(25);
  });

  it("la cible est la dernière ligne, et c'est B qui parle", () => {
    for (const d of dialogues) {
      const i = d.lines.findIndex((li) => li.target);
      expect(i, d.id).toBe(d.lines.length - 1);
      expect(d.lines[i].who, d.id).toBe("B");
    }
  });

  it("who ∈ {A,B} et l'alternance est stricte", () => {
    expect(new Set(lignesDialogue.map((li) => li.who))).toEqual(new Set(["A", "B"]));
    for (const d of dialogues)
      d.lines.forEach((li, i) => {
        expect(li.who, `${d.id} ligne ${i}`).toBe(i % 2 === 0 ? "A" : "B");
      });
  });
});

/* ------------------------------- wordBank ---------------------------- */
describe("wordBank", () => {
  // 269 exercices « build » : 244 phrases + 25 répliques cibles.
  const casBuild = [
    ...sentences.map((s) => ({ id: s.id, pl: s.pl, bank: s.wordBank })),
    ...dialogues.map((d) => {
      const t = d.lines.find((li) => li.target);
      return { id: d.id, pl: t.pl, bank: t.wordBank };
    })
  ];

  it("couvre tous les mots normalisés de pl (285 cas) — sinon l'exercice est insoluble", () => {
    expect(casBuild).toHaveLength(285);
    for (const c of casBuild) {
      const banque = c.bank.map((w) => Speech.normalize(w));
      for (const m of mots(c.pl))
        expect(banque, `${c.id} : « ${m} » absent de la banque`).toContain(m);
    }
  });

  it("wordBank contient au moins autant de jetons que de mots", () => {
    for (const c of casBuild)
      expect(c.bank.length, c.id).toBeGreaterThanOrEqual(mots(c.pl).length);
  });

  it("aucun jeton de wordBank n'est ponctué", () => {
    for (const c of casBuild)
      for (const w of c.bank)
        expect(w, `${c.id} : « ${w} »`).not.toMatch(/[.,!?;:"'()»«]/);
  });
});

/* ------------------------------ grammaire ---------------------------- */
describe("grammaire", () => {
  it("chaque grammarFocus résout vers une note de la MÊME leçon", () => {
    let n = 0;
    for (const l of POLISH_LESSONS) {
      const ids = new Set((l.grammarNotes || []).map((g) => g.id));
      for (const s of l.sentences || []) {
        expect(ids, `${s.id} → ${s.grammarFocus}`).toContain(s.grammarFocus);
        n++;
      }
    }
    expect(n).toBe(260);
  });

  it("toutes les notes de grammaire sont référencées (réciproque)", () => {
    const utilisees = new Set(sentences.map((s) => s.grammarFocus));
    const orphelines = grammarNotes.filter((g) => !utilisees.has(g.id));
    expect(orphelines.map((g) => g.id)).toEqual([]);
  });
});

/* -------------------------- hygiène textuelle ------------------------ */
describe("hygiène textuelle", () => {
  const champs = [
    ...vocab.flatMap((v) => [[v.id, "pl", v.pl], [v.id, "fr", v.fr]]),
    ...sentences.flatMap((s) => [[s.id, "pl", s.pl], [s.id, "fr", s.fr]]),
    ...lignesDialogue.flatMap((li) => [
      [li._dialogue, "pl", li.pl],
      [li._dialogue, "fr", li.fr]
    ]),
    ...grammarNotes.map((g) => [g.id, "explanationFr", g.explanationFr])
  ];

  it("aucune chaîne vide, aucun bord non trimmé, aucun espace double", () => {
    for (const [id, champ, val] of champs) {
      expect(val, `${id}.${champ}`).toBeTruthy();
      expect(val, `${id}.${champ}`).toBe(val.trim());
      expect(val, `${id}.${champ}`).not.toMatch(/ {2}/);
    }
  });

  it("aucune espace insécable (U+00A0)", () => {
    for (const [id, champ, val] of champs)
      expect(val, `${id}.${champ}`).not.toMatch(/ /);
  });

  it("les phrases et répliques finissent par une ponctuation", () => {
    for (const s of sentences) expect(s.pl, s.id).toMatch(/[.!?]$/);
    for (const li of lignesDialogue) expect(li.pl, li._dialogue).toMatch(/[.!?]$/);
  });
});

/* -------------------------------- badges ----------------------------- */
describe("badges", () => {
  it("17 badges, ids uniques, check() est une fonction, emoji non vide", () => {
    expect(POLISH_BADGES).toHaveLength(17);
    expect(new Set(POLISH_BADGES.map((b) => b.id)).size).toBe(17);
    for (const b of POLISH_BADGES) {
      expect(typeof b.check, b.id).toBe("function");
      expect(b.emoji, b.id).toBeTruthy();
      expect(b.title, b.id).toBeTruthy();
      expect(b.desc, b.id).toBeTruthy();
    }
  });

  it("chaque check() s'évalue sans lever sur un état complet", () => {
    const etat = {
      lessons: { "lesson-01": { status: "completed", bestScore: 100 } },
      items: { "v-01-czesc": { box: 5 } },
      streak: { current: 3, longest: 3 },
      flags: { perfectPronunciation: true, everMetDailyGoal: true }
    };
    for (const b of POLISH_BADGES)
      expect(() => b.check(etat), b.id).not.toThrow();
  });

  it("un badge à image existe pour chaque id (public/assets/img)", async () => {
    const { existsSync } = await import("node:fs");
    const { resolve } = await import("node:path");
    const dir = resolve(import.meta.dirname, "../public/assets/img");
    for (const b of POLISH_BADGES)
      expect(existsSync(`${dir}/badge-${b.id}.png`), b.id).toBe(true);
  });
});

/* ------------------------------ catégories --------------------------- */
describe("catégories", () => {
  it("aucune entrée sans catégorie", () => {
    for (const v of vocab) expect(v.category, v.id).toBeTruthy();
  });
});

describe("robustesse", () => {
  // s-36-1 et s-25-4 avaient un mot dupliqué dans leur wordBank (« ciebie »,
  // « trzeba »/« Trzeba ») alors qu'il n'apparaît qu'une fois dans la phrase —
  // un distracteur raté (un doublon strict n'ajoute aucune difficulté).
  // Corrigé dans data/lessons.js.
  it("pas de doublon inutile dans un wordBank", () => {
    for (const s of sentences) {
      const attendus = mots(s.pl);
      const compte = {};
      for (const w of s.wordBank) {
        const k = Speech.normalize(w);
        compte[k] = (compte[k] || 0) + 1;
      }
      for (const [w, n] of Object.entries(compte)) {
        const dansLaPhrase = attendus.filter((m) => m === w).length;
        if (n > 1) expect(n, `${s.id} : « ${w} »`).toBeLessThanOrEqual(Math.max(1, dansLaPhrase));
      }
    }
  });

  // streak-3/7/30/100, first-steps, first-trail, words-tier*, master-tier*,
  // halfway, graduate, first-story et all-stories lisent s.streak / s.lessons /
  // s.items sans garde, contrairement au motif déjà en place pour s.flags
  // (perfect-pronunciation, daily-goal). Toujours vrai après la refonte du
  // catalogue : chaque check() doit tolérer un état vide.
  it("check({}) ne lève jamais", () => {
    for (const b of POLISH_BADGES) expect(() => b.check({}), b.id).not.toThrow();
  });
});
