/* =====================================================================
   EXERCISES — génération et correction. Le test le plus précieux du fichier
   sont ceux de « résolubilité du corpus » : ils vérifient que les 310 exercices
   « build », les 35 questions de lecture et les 28 productions du corpus sont
   RÉSOLUBLES, à travers le vrai code de correction — donc immunisé contre une
   divergence entre la logique du test et celle de la prod.
   ===================================================================== */
import { describe, it, expect, beforeAll } from "vitest";
import { POLISH_LESSONS } from "../data/lessons.js";
import { Exercises } from "../js/exercises.js";
import { Speech } from "../js/speech.js";

beforeAll(() => {
  Exercises.buildIndex();
});

const vocab = POLISH_LESSONS.flatMap((l) => l.vocabulary || []);
const sentences = POLISH_LESSONS.flatMap((l) => l.sentences || []);
const entree = (id) => Exercises.getEntry(id);

describe("index", () => {
  it("getEntry retrouve vocab, phrases, et null sinon", () => {
    expect(entree("v-01-czesc").pl).toBe("cześć");
    expect(entree("s-01-1").kind).toBe("sentence");
    expect(entree("v-01-czesc").kind).toBe("vocab");
    expect(entree("id-inexistant")).toBeNull();
  });
});

describe("distracteurs", () => {
  // 7 catégories n'ont qu'UNE entrée (mesure, argent, lieu, personne,
  // expression, grammaire, récit). distractors() complète alors avec le pool
  // global via .concat(others) : ce test verrouille ce filet, dont la
  // suppression donnerait des QCM à 2 options au lieu de 4.
  it("rend toujours 3 valeurs distinctes, même pour une catégorie à 1 entrée", () => {
    const parCat = {};
    for (const v of vocab) (parCat[v.category] ||= []).push(v);
    const solitaires = Object.values(parCat).filter((g) => g.length === 1);
    expect(solitaires.length).toBeGreaterThan(0); // le cas existe bien

    for (const [v] of solitaires) {
      const ex = Exercises.makeMultipleChoice(entree(v.id), "pl-fr");
      expect(ex.options, v.id).toHaveLength(4);
      expect(new Set(ex.options).size, v.id).toBe(4);
      expect(ex.options, v.id).toContain(ex.answer);
    }
  });

  it("un QCM a 4 options distinctes contenant la réponse, dans les 2 sens", () => {
    for (const sens of ["pl-fr", "fr-pl"])
      for (const id of ["v-01-czesc", "v-03-mama", "v-20-deszcz"]) {
        const ex = Exercises.makeMultipleChoice(entree(id), sens);
        expect(ex.options, `${id}/${sens}`).toHaveLength(4);
        expect(new Set(ex.options).size, `${id}/${sens}`).toBe(4);
        expect(ex.options, `${id}/${sens}`).toContain(ex.answer);
      }
  });
});

describe("cloze", () => {
  it("masque le mot le plus long et pose un seul trou", () => {
    const ex = Exercises.makeCloze(entree("s-01-1"));
    const attendu = entree("s-01-1")
      .pl.split(/\s+/)
      .map((w) => w.replace(/[.,!?;:"'()»«]/g, ""))
      .reduce((a, b) => (b.length > a.length ? b : a));
    expect(ex.answer).toBe(attendu);
    expect(ex.promptText.match(/_____/g)).toHaveLength(1);
  });

  it("dérive de sentence.pl et ignore wordBank (distracteurs compris)", () => {
    // Documenté dans CLAUDE.md : les distracteurs de wordBank ne servent qu'au
    // build. Vérifié sur une phrase dont le wordBank est plus long que pl.
    const s = sentences.find((x) => x.wordBank.length > x.pl.split(/\s+/).length);
    const ex = Exercises.makeCloze(entree(s.id));
    expect(s.pl).toContain(ex.answer);
  });
});

describe("dialogue", () => {
  it("retourne null s'il n'y a aucune ligne cible", () => {
    expect(Exercises.makeDialogue({ id: "x", title: "", lines: [] })).toBeNull();
    expect(
      Exercises.makeDialogue({ id: "x", lines: [{ who: "A", pl: "a", fr: "a" }] })
    ).toBeNull();
  });

  it("sur les 30 dialogues réels : answer = pl de la cible, bank non vide", () => {
    const dialogues = POLISH_LESSONS.flatMap((l) => l.dialogues || []);
    expect(dialogues).toHaveLength(30);
    for (const d of dialogues) {
      const ex = Exercises.makeDialogue(d);
      const cible = d.lines.find((li) => li.target);
      expect(ex, d.id).not.toBeNull();
      expect(ex.answer, d.id).toBe(cible.pl);
      expect(ex.bank.length, d.id).toBeGreaterThan(0);
    }
  });
});

describe("build", () => {
  it("la banque est un mélange de wordBank, sans perte ni ajout", () => {
    for (const s of sentences.slice(0, 20)) {
      const ex = Exercises.makeBuild(entree(s.id));
      // Comparer des MULTISETS triés, pas des Set : un wordBank peut contenir
      // un doublon légitime (cf. s-36-1), qu'un Set masquerait.
      expect(ex.bank.slice().sort(), s.id).toEqual(s.wordBank.slice().sort());
    }
  });
});

describe("check", () => {
  it("accepte un tableau de mots dans le bon ordre, ponctuation comprise", () => {
    const ex = { type: "build", answer: "Jak się masz?" };
    expect(Exercises.check(ex, ["Jak", "się", "masz"])).toBe(true);
    expect(Exercises.check(ex, ["masz", "się", "Jak"])).toBe(false);
  });

  it("refuse une réponse vide ou absente", () => {
    const ex = { type: "build", answer: "Cześć" };
    expect(Exercises.check(ex, [])).toBe(false);
    expect(Exercises.check(ex, null)).toBe(false);
    expect(Exercises.check(ex, "")).toBe(false);
  });

  it("compare via normalize : insensible à la casse et à la ponctuation", () => {
    const ex = { type: "type-fr-pl", answer: "Dzień dobry!" };
    expect(Exercises.check(ex, "dzień dobry")).toBe(true);
    expect(Exercises.check(ex, "  DZIEŃ DOBRY  ")).toBe(true);
    // mais PAS aux diacritiques (cf. speech-normalize.test.js)
    expect(Exercises.check(ex, "dzien dobry")).toBe(false);
  });
});

/* ------------------------------------------------------------------ */
describe("résolubilité du corpus", () => {
  // Le test à plus forte valeur : pour CHACUN des 285 exercices build du jeu,
  // reconstituer la phrase dans l'ordre depuis wordBank doit être accepté par
  // le vrai check(). Un wordBank incomplet rendrait l'exercice impossible à
  // valider, sans qu'aucune erreur ne soit levée en production.
  it("les 310 exercices build/dialogue sont tous résolubles", () => {
    const cas = [
      ...sentences.map((s) => ({ id: s.id, type: "build", pl: s.pl, bank: s.wordBank })),
      ...POLISH_LESSONS.flatMap((l) => l.dialogues || []).map((d) => {
        const t = d.lines.find((li) => li.target);
        return { id: d.id, type: "dialogue", pl: t.pl, bank: t.wordBank };
      })
    ];
    expect(cas).toHaveLength(310);

    const insolubles = [];
    for (const c of cas) {
      // On rejoue ce que fait l'utilisateur : cliquer les tuiles dans l'ordre
      // des mots de la phrase.
      const attendus = Speech.normalize(c.pl).split(/\s+/).filter(Boolean);
      const dispo = c.bank.slice();
      const clique = [];
      for (const m of attendus) {
        const i = dispo.findIndex((w) => Speech.normalize(w) === m);
        if (i === -1) break;
        clique.push(dispo.splice(i, 1)[0]);
      }
      if (!Exercises.check({ type: c.type, answer: c.pl }, clique))
        insolubles.push(c.id);
    }
    expect(insolubles).toEqual([]);
  });

  it("les 35 questions de lecture sont toutes résolubles", () => {
    // Même principe : la bonne réponse déclarée doit être acceptée par le vrai
    // check(), à travers makeReading — qui mélange les options et, depuis
    // `questionLang`, peut les servir en polonais.
    const insolubles = [];
    let n = 0;
    for (const l of POLISH_LESSONS)
      for (const r of l.readings || [])
        for (const q of r.questions) {
          n++;
          const ex = Exercises.makeReading(r, q);
          if (!Exercises.check(ex, q.answer)) insolubles.push(q.id);
          // La langue déclarée doit se propager jusqu'à l'exercice, sinon la
          // question polonaise s'afficherait avec la typographie française.
          if (ex.promptLang !== (r.questionLang || "fr")) insolubles.push(q.id + "/lang");
        }
    expect(n).toBe(35);
    expect(insolubles).toEqual([]);
  });

  it("les 28 productions libres sont toutes résolubles, sur chaque variante", () => {
    const insolubles = [];
    let n = 0;
    for (const l of POLISH_LESSONS)
      for (const pr of l.productions || []) {
        n++;
        const ex = Exercises.makeWrite(pr);
        for (const a of pr.answers)
          if (!Exercises.check(ex, a)) insolubles.push(pr.id + " ← " + a);
      }
    expect(n).toBe(28);
    expect(insolubles).toEqual([]);
  });
});

/* ================= correction des épreuves d'histoire ================= */
/* Les objets sont construits À LA MAIN et non via makeStoryStep : on teste ici
   la règle de correction seule, pas la fabrique (couverte par stories.test.js).
   C'est aussi ce qui permet d'exprimer les cas que les données ne contiennent
   pas — un QCM multiple à 3 réponses, une paire inventée… */

describe("check — story-quiz (une seule bonne réponse)", () => {
  const ex = {
    type: "story-quiz",
    multi: false,
    answer: "Żubr poznał nową osobę.",
    answers: ["Żubr poznał nową osobę."]
  };

  it("accepte la bonne option", () => {
    expect(Exercises.check(ex, "Żubr poznał nową osobę.")).toBe(true);
  });

  it("refuse une autre option", () => {
    expect(Exercises.check(ex, "Żubr poszedł do kina.")).toBe(false);
  });

  it("passe par normalize (casse, ponctuation)", () => {
    expect(Exercises.check(ex, "  żubr poznał nową osobę  ")).toBe(true);
  });

  it("refuse une réponse vide ou absente", () => {
    expect(Exercises.check(ex, "")).toBe(false);
    expect(Exercises.check(ex, null)).toBe(false);
  });
});

describe("check — story-quiz (deux bonnes réponses)", () => {
  const ex = {
    type: "story-quiz",
    multi: true,
    answer: "A",
    answers: ["A", "B"]
  };

  it("accepte les deux bonnes, dans n'importe quel ordre", () => {
    expect(Exercises.check(ex, ["A", "B"])).toBe(true);
    expect(Exercises.check(ex, ["B", "A"])).toBe(true);
  });

  it("refuse un sous-ensemble", () => {
    expect(Exercises.check(ex, ["A"])).toBe(false);
    expect(Exercises.check(ex, [])).toBe(false);
  });

  it("refuse un sur-ensemble", () => {
    expect(Exercises.check(ex, ["A", "B", "C"])).toBe(false);
  });

  it("refuse deux fois la même bonne réponse", () => {
    // Sinon un double clic compenserait la réponse manquante.
    expect(Exercises.check(ex, ["A", "A"])).toBe(false);
  });

  it("refuse le bon nombre de réponses mais les mauvaises", () => {
    expect(Exercises.check(ex, ["C", "D"])).toBe(false);
    expect(Exercises.check(ex, ["A", "C"])).toBe(false);
  });

  it("refuse une chaîne là où un tableau est attendu", () => {
    expect(Exercises.check(ex, "A")).toBe(false);
  });
});

describe("check — story-gap", () => {
  const ex = { type: "story-gap", answer: "pizzę" };

  it("accepte le bon mot, refuse les distracteurs", () => {
    expect(Exercises.check(ex, "pizzę")).toBe(true);
    expect(Exercises.check(ex, "lasagne")).toBe(false);
    expect(Exercises.check(ex, "dzięki")).toBe(false);
  });
});

describe("check — story-match", () => {
  const paires = [
    { pl: "Bocian", fr: "la cigogne" },
    { pl: "Restauracja", fr: "le restaurant" },
    { pl: "Do zobaczenia", fr: "au revoir" }
  ];
  const ex = { type: "story-match", pairs: paires, answer: "…" };

  it("accepte les paires justes, dans n'importe quel ordre", () => {
    expect(Exercises.check(ex, paires)).toBe(true);
    expect(Exercises.check(ex, paires.slice().reverse())).toBe(true);
  });

  it("refuse dès qu'une seule paire est fausse — tout ou rien", () => {
    const presque = [
      { pl: "Bocian", fr: "la cigogne" },
      { pl: "Restauracja", fr: "au revoir" },
      { pl: "Do zobaczenia", fr: "le restaurant" }
    ];
    expect(Exercises.check(ex, presque)).toBe(false);
  });

  it("refuse un appariement incomplet", () => {
    expect(Exercises.check(ex, paires.slice(0, 2))).toBe(false);
    expect(Exercises.check(ex, [])).toBe(false);
  });

  it("refuse une forme inattendue au lieu de l'interpréter de travers", () => {
    expect(Exercises.check(ex, "Bocian")).toBe(false);
    expect(Exercises.check(ex, null)).toBe(false);
    expect(Exercises.check(ex, [null, null, null])).toBe(false);
  });
});

describe("check — story-build", () => {
  const ex = { type: "story-build", answer: "Nazywam się Żubr i mam dziesięć lat." };

  it("accepte les mots dans le bon ordre", () => {
    expect(
      Exercises.check(ex, ["Nazywam", "się", "Żubr", "i", "mam", "dziesięć", "lat"])
    ).toBe(true);
  });

  it("refuse un ordre incorrect", () => {
    expect(
      Exercises.check(ex, ["Żubr", "się", "Nazywam", "i", "mam", "dziesięć", "lat"])
    ).toBe(false);
  });
});
