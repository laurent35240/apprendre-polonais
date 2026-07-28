/* =====================================================================
   INVARIANTS DE DONNÉES — data/lessons.js et data/badges.js
   ---------------------------------------------------------------------
   Ces contraintes ne sont PAS exprimables en TypeScript (unicité sur 647 ids,
   « exactement une ligne target », wordBank ⊇ mots(pl), clés étrangères…) :
   ce fichier est donc le seul filet possible.

   Les `it.skip` en fin de fichier documentent 10 invariants qui ÉCHOUENT
   aujourd'hui. Ils sont volontairement laissés rouges-mais-ignorés : c'est la
   dette rendue visible, pas un oubli. Chacun dit quoi échoue, avec le chiffre
   exact, et pourquoi on ne corrige pas maintenant.
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
  it("40 leçons, ids uniques", () => {
    expect(POLISH_LESSONS).toHaveLength(40);
    expect(new Set(POLISH_LESSONS.map((l) => l.id)).size).toBe(40);
  });

  it("647 item-ids au total, tous uniques", () => {
    expect(vocab).toHaveLength(470);
    expect(sentences).toHaveLength(160);
    expect(dialogues).toHaveLength(17);
    expect(tousLesIds).toHaveLength(647);
    expect(new Set(tousLesIds).size).toBe(647);
  });

  it("order est exactement [1..40]", () => {
    const ordres = POLISH_LESSONS.map((l) => l.order).sort((a, b) => a - b);
    expect(ordres).toEqual(Array.from({ length: 40 }, (_, i) => i + 1));
  });

  it("chaque leçon a 4 phrases et 2 notes de grammaire", () => {
    for (const l of POLISH_LESSONS) {
      expect(l.sentences, l.id).toHaveLength(4);
      expect(l.grammarNotes, l.id).toHaveLength(2);
    }
    expect(sentences).toHaveLength(160);
    expect(grammarNotes).toHaveLength(80);
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
    expect(dialogues).toHaveLength(17);
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
  // 177 exercices « build » : 160 phrases + 17 répliques cibles.
  const casBuild = [
    ...sentences.map((s) => ({ id: s.id, pl: s.pl, bank: s.wordBank })),
    ...dialogues.map((d) => {
      const t = d.lines.find((li) => li.target);
      return { id: d.id, pl: t.pl, bank: t.wordBank };
    })
  ];

  it("couvre tous les mots normalisés de pl (177 cas) — sinon l'exercice est insoluble", () => {
    expect(casBuild).toHaveLength(177);
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
    expect(n).toBe(160);
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
  it("11 badges, ids uniques, check() est une fonction, emoji non vide", () => {
    expect(POLISH_BADGES).toHaveLength(11);
    expect(new Set(POLISH_BADGES.map((b) => b.id)).size).toBe(11);
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

/* =====================================================================
   DETTE — invariants qui ÉCHOUENT aujourd'hui
   Chacun est mesuré et expliqué. Ne pas « réparer » sans décision produit.
   ===================================================================== */
describe("dette connue", () => {
  // [VOULU] POLISH_LESSONS n'est pas trié par `order` : les leçons 1→23 sont
  // physiquement d'abord (avec des order troués), puis 24→40 comblent les
  // trous. C'est documenté dans CLAUDE.md : `order` est la SEULE source de
  // vérité du séquencement (app.js sortedLessons, state.js
  // ensureLessonStatuses trient dessus), la position physique est sans
  // importance — c'est ce qui permet d'ajouter une leçon n'importe où.
  // Ce test existe pour figer l'intention, pas pour être réparé.
  it.skip("[VOULU] le tableau est trié par order", () => {
    const o = POLISH_LESSONS.map((l) => l.order);
    expect(o).toEqual([...o].sort((a, b) => a - b));
  });

  // 27 violations, TOUTES dans lesson-11, qui utilise le préfixe `cal` au lieu
  // du numéro de leçon : v-cal-poniedzialek… (21), s-cal-1..4, g-cal-1..2.
  // Renommer casserait l'historique SRS de 27 items (les ids sont les clés
  // localStorage) : à ne faire qu'avec une migration.
  it.skip("[DETTE] id préfixé par le numéro de sa leçon", () => {
    for (const l of POLISH_LESSONS) {
      const n = l.id.replace("lesson-", "");
      for (const v of l.vocabulary || []) expect(v.id).toMatch(new RegExp(`^v-${n}-`));
    }
  });

  // 1 seul cas : `v-25-muszę` porte un diacritique alors que tous les autres
  // ids sont dé-diacrités (v-25-moge, v-25-powinienem…). Même contrainte SRS.
  it.skip("[DETTE] les ids sont en ASCII pur", () => {
    for (const id of tousLesIds) expect(id).toMatch(/^[a-z0-9-]+$/);
  });

  // 15 catégories ont moins de 4 entrées, dont 7 une seule (mesure, argent,
  // lieu, personne, expression, grammaire, récit). Le QCM veut 1 réponse + 3
  // distracteurs de MÊME catégorie (exercises.js distractors) : pour ces 15,
  // le fallback pioche hors catégorie. Pas cassé — moins pertinent.
  it.skip("[DETTE] toute catégorie utilisée a >= 4 entrées", () => {
    const parCat = {};
    for (const v of vocab) (parCat[v.category] ||= []).push(v.id);
    for (const [cat, ids] of Object.entries(parCat))
      expect(ids.length, cat).toBeGreaterThanOrEqual(4);
  });

  // 1 cas : s-36-1 « Zadzwonię do ciebie wieczorem. » a "ciebie" deux fois dans
  // son wordBank alors que le mot n'apparaît qu'une fois dans la phrase — un
  // distracteur raté (un doublon strict n'ajoute aucune difficulté).
  it.skip("[DETTE] pas de doublon inutile dans un wordBank", () => {
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

  // 5 doublons (catégorie, pl). Le plus notable est pédagogique :
  // lesson-11 (v-cal-*) réintroduit poniedziałek, sobota et niedziela déjà
  // enseignés en lesson-08, dans la même catégorie `jour`. Conséquence
  // concrète : un QCM peut proposer DEUX options identiques. S'y ajoutent
  // `godzina` (v-08 / v-27) et `rezerwacja` (v-21 / v-35).
  it.skip("[DETTE] (catégorie, pl) est unique", () => {
    const vus = new Map();
    for (const v of vocab) {
      const k = v.category + "|" + v.pl;
      expect(vus.has(k), `${k} : ${vus.get(k)} et ${v.id}`).toBe(false);
      vus.set(k, v.id);
    }
  });

  // 9 doublons `pl` et 7 `fr` au global (mêmes paires que ci-dessus, plus
  // potem, wysoki, niski, historia répartis sur des catégories différentes —
  // ceux-là sont légitimes : même mot, sens ou emploi différent).
  it.skip("[DETTE] pl est globalement unique", () => {
    const vus = new Map();
    for (const v of vocab) {
      expect(vus.has(v.pl), `${v.pl} : ${vus.get(v.pl)} et ${v.id}`).toBe(false);
      vus.set(v.pl, v.id);
    }
  });

  it.skip("[DETTE] fr est globalement unique", () => {
    const vus = new Map();
    for (const v of vocab) {
      expect(vus.has(v.fr), `${v.fr} : ${vus.get(v.fr)} et ${v.id}`).toBe(false);
      vus.set(v.fr, v.id);
    }
  });

  // 37 thèmes distincts pour 40 leçons : `nombres` ×3, `adjectifs` ×2.
  // `theme` est un libellé d'affichage, pas une clé — le test documente
  // seulement qu'on ne peut PAS s'en servir comme identifiant.
  it.skip("[DETTE] theme est unique par leçon", () => {
    expect(new Set(POLISH_LESSONS.map((l) => l.theme)).size).toBe(40);
  });

  // 5 badges (first-steps, words-25, words-100, master-3, halfway, graduate)
  // font Object.values(s.lessons) / Object.keys(s.items) SANS garde, donc
  // lèvent sur un état partiel. Non bloquant en prod : checkBadges ne passe
  // que State.get() complet, et gamification.js avale l'erreur dans un
  // try/catch — ce qui est le vrai défaut, à traiter au palier 3.
  it.skip("[DETTE] check({}) ne lève jamais", () => {
    for (const b of POLISH_BADGES) expect(() => b.check({}), b.id).not.toThrow();
  });
});
