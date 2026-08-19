/* =====================================================================
   INVARIANTS DE DONNÉES — data/stories.js (histoires bonus)
   ---------------------------------------------------------------------
   Pendant de tests/data-invariants.test.js pour le contenu des histoires. Ce
   que TypeScript ne peut pas exprimer et qui rendrait une épreuve INSOLUBLE :
     - `answers ⊆ options` (un QCM dont la bonne réponse n'est pas proposée) ;
     - `wordBank ⊇ mots(pl)` (une réplique qu'aucune combinaison de tuiles ne
       peut former) ;
     - `answer ∈ options` et présence du marqueur `_____` pour un trou ;
     - unicité des ids d'épreuve, ET disjonction avec les 816 item-ids des
       leçons : les deux familles cohabitent dans la MÊME map `lessons` /
       `items` de localStorage, une collision écraserait de la progression.

   On vérifie aussi la mécanique de bout en bout (Session → Exercises.check),
   parce qu'un contenu valide mal câblé donne le même symptôme qu'un contenu
   invalide : une épreuve impossible à réussir.
   ===================================================================== */
import { describe, it, expect } from "vitest";
import { POLISH_STORIES } from "../data/stories.js";
import { POLISH_LESSONS } from "../data/lessons.js";
import { Exercises } from "../js/exercises.js";
import { Session } from "../js/session.js";
import { Speech } from "../js/speech.js";
import { UI } from "../js/ui.js";
import ID_SNAPSHOT from "./fixtures/item-ids.json";

const scenes = POLISH_STORIES.flatMap((st) =>
  st.scenes.map((sc, i) => ({ ...sc, _story: st.id, _no: i + 1 }))
);
const steps = scenes.map((sc) => ({ ...sc.step, _story: sc._story, _no: sc._no }));
const lignes = scenes.flatMap((sc) =>
  sc.lines.map((li) => ({ ...li, _story: sc._story, _no: sc._no }))
);
const parKind = (k) => steps.filter((s) => s.kind === k);

// Même fonction de normalisation que la correction : un test qui découperait
// les mots autrement pourrait passer là où l'exercice échoue.
const mots = (s) => Speech.normalize(s).split(/\s+/).filter(Boolean);

/* ------------------------------ structure ---------------------------- */
describe("structure des histoires", () => {
  it("3 histoires, ids uniques", () => {
    expect(POLISH_STORIES).toHaveLength(3);
    expect(new Set(POLISH_STORIES.map((s) => s.id)).size).toBe(POLISH_STORIES.length);
  });

  it("un sentier porte au plus une histoire", () => {
    const idx = POLISH_STORIES.map((s) => s.trailIndex);
    expect(new Set(idx).size).toBe(idx.length);
  });

  it("trailIndex désigne un sentier qui existe vraiment", () => {
    // 51 leçons en paquets de 5 → 11 sentiers (indices 0..10).
    const nbSentiers = Math.ceil(POLISH_LESSONS.length / 5);
    for (const st of POLISH_STORIES) {
      expect(Number.isInteger(st.trailIndex), st.id).toBe(true);
      expect(st.trailIndex, st.id).toBeGreaterThanOrEqual(0);
      expect(st.trailIndex, st.id).toBeLessThan(nbSentiers);
    }
  });

  it("les champs obligatoires d'une histoire sont présents", () => {
    for (const st of POLISH_STORIES) {
      for (const champ of ["id", "icon", "title", "titleFr", "mascotIntro"]) {
        expect(typeof st[champ], st.id + "." + champ).toBe("string");
        expect(st[champ].length, st.id + "." + champ).toBeGreaterThan(0);
      }
      expect(Array.isArray(st.scenes), st.id).toBe(true);
      expect(st.scenes.length, st.id).toBeGreaterThanOrEqual(3);
    }
  });

  it("chaque scène a au moins une réplique et exactement une épreuve", () => {
    for (const sc of scenes) {
      const ou = sc._story + " scène " + sc._no;
      expect(sc.lines.length, ou).toBeGreaterThan(0);
      expect(sc.step, ou).toBeTruthy();
      expect(["quiz", "build", "gap", "match"], ou).toContain(sc.step.kind);
    }
  });

  it("les 4 sortes d'épreuves sont représentées", () => {
    // Le modèle papier prévoit les 4 : si l'une disparaît, son renderer n'est
    // plus jamais exercé et peut pourrir sans que rien ne rougisse.
    for (const k of ["quiz", "build", "gap", "match"]) {
      expect(parKind(k).length, k).toBeGreaterThan(0);
    }
  });
});

/* --------------------------------- ids -------------------------------- */
describe("ids d'épreuve", () => {
  it("uniques", () => {
    const ids = steps.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("disjoints des item-ids des leçons", () => {
    // Collision = écrasement silencieux de progression : les deux familles
    // partagent la même map `items`/`lessons` en localStorage.
    const connus = new Set(ID_SNAPSHOT);
    expect(steps.filter((s) => connus.has(s.id)).map((s) => s.id)).toEqual([]);
  });

  it("disjoints des ids de leçon", () => {
    // Un id d'histoire est stocké dans `lessons[…]`, exactement comme une leçon.
    const idsLecons = new Set(POLISH_LESSONS.map((l) => l.id));
    expect(POLISH_STORIES.filter((s) => idsLecons.has(s.id)).map((s) => s.id)).toEqual([]);
  });
});

/* ------------------------------- répliques ---------------------------- */
describe("répliques", () => {
  it("who ∈ {Ż, B, O, N}", () => {
    for (const li of lignes) {
      expect(
        ["Ż", "B", "O", "N"],
        li._story + " scène " + li._no + " : " + li.pl
      ).toContain(li.who);
    }
  });

  it("pl et fr non vides, trimmés, sans espace double", () => {
    for (const li of lignes) {
      for (const champ of ["pl", "fr"]) {
        const v = li[champ];
        const ou = li._story + " scène " + li._no + "." + champ;
        expect(typeof v, ou).toBe("string");
        expect(v.length, ou).toBeGreaterThan(0);
        expect(v, ou).toBe(v.trim());
        expect(v.includes("  "), ou).toBe(false);
      }
    }
  });

  it("aucune espace insécable (U+00A0)", () => {
    for (const li of lignes) {
      expect(li.pl.includes(" "), li.pl).toBe(false);
      expect(li.fr.includes(" "), li.fr).toBe(false);
    }
  });

  it("chaque locuteur autre que le narrateur a une tête", () => {
    // Sans cet invariant, ajouter un personnage à une future histoire donnerait
    // un avatar de repli (emoji) SANS que rien ne rougisse : le handler `error`
    // de characterImg avale l'échec, et une entrée manquante dans la table
    // CHARACTERS n'affiche même pas d'image du tout.
    for (const who of new Set(lignes.map((l) => l.who))) {
      if (who === "N") continue;
      expect(UI.characterImg(who), "locuteur « " + who + " »").not.toBeNull();
    }
  });

  it("le narrateur n'a PAS de tête", () => {
    // L'autre moitié de l'invariant : sa ligne pleine largeur en dépend.
    expect(UI.characterImg("N")).toBeNull();
  });

  it("chaque réplique finit par une ponctuation", () => {
    for (const li of lignes) {
      expect(/[.!?…]$/.test(li.pl), li._story + " : " + li.pl).toBe(true);
    }
  });
});

/* -------------------------------- quiz ------------------------------- */
describe("épreuves quiz", () => {
  it("answers est un sous-ensemble non vide de options", () => {
    for (const s of parKind("quiz")) {
      expect(s.answers.length, s.id).toBeGreaterThan(0);
      for (const a of s.answers) expect(s.options, s.id).toContain(a);
    }
  });

  it("1 ou 2 bonnes réponses — au-delà, le rendu ne l'annonce pas", () => {
    for (const s of parKind("quiz")) {
      expect(s.answers.length, s.id).toBeLessThanOrEqual(2);
    }
  });

  it("au moins 3 options, toutes distinctes", () => {
    for (const s of parKind("quiz")) {
      expect(s.options.length, s.id).toBeGreaterThanOrEqual(3);
      expect(new Set(s.options).size, s.id).toBe(s.options.length);
    }
  });

  it("il reste au moins un distracteur", () => {
    for (const s of parKind("quiz")) {
      expect(s.options.length - s.answers.length, s.id).toBeGreaterThan(0);
    }
  });

  it("question et questionFr sont renseignées", () => {
    for (const s of parKind("quiz")) {
      expect(s.question.length, s.id).toBeGreaterThan(0);
      expect(s.questionFr.length, s.id).toBeGreaterThan(0);
    }
  });
});

/* -------------------------------- build ------------------------------ */
describe("épreuves build", () => {
  it("wordBank couvre tous les mots normalisés de pl — sinon insoluble", () => {
    for (const s of parKind("build")) {
      const banque = s.wordBank.map((w) => Speech.normalize(w));
      for (const m of mots(s.pl)) {
        expect(banque, s.id + " manque « " + m + " »").toContain(m);
      }
    }
  });

  it("wordBank a au moins autant de jetons que de mots", () => {
    for (const s of parKind("build")) {
      expect(s.wordBank.length, s.id).toBeGreaterThanOrEqual(mots(s.pl).length);
    }
  });

  it("aucun jeton de wordBank n'est ponctué", () => {
    // Une tuile « lat. » ne s'assemblerait jamais en la phrase attendue.
    for (const s of parKind("build")) {
      for (const w of s.wordBank) {
        expect(/[.,!?;:]/.test(w), s.id + " : « " + w + " »").toBe(false);
      }
    }
  });

  it("la banque, remise dans l'ordre de pl, est acceptée par check()", () => {
    // Le test de bout en bout : contenu valide ET câblage correct.
    for (const st of POLISH_STORIES) {
      for (const sc of st.scenes) {
        if (sc.step.kind !== "build") continue;
        const ex = Exercises.makeStoryStep(st, sc);
        expect(Exercises.check(ex, sc.step.pl.split(/\s+/)), sc.step.id).toBe(true);
      }
    }
  });
});

/* --------------------------------- gap ------------------------------- */
describe("épreuves gap", () => {
  it("la phrase porte le marqueur de trou", () => {
    for (const s of parKind("gap")) {
      expect(s.sentence.includes("_____"), s.id).toBe(true);
    }
  });

  it("la traduction garde le trou elle aussi", () => {
    // Sans ça, le sous-titre français donne la réponse (« Je prendrai
    // volontiers une pizza ») et l'épreuve n'en est plus une.
    for (const s of parKind("gap")) {
      expect(s.fr.includes("_____"), s.id + " : « " + s.fr + " »").toBe(true);
    }
  });

  it("answer figure parmi options", () => {
    for (const s of parKind("gap")) {
      expect(s.options, s.id).toContain(s.answer);
    }
  });

  it("au moins 3 options distinctes", () => {
    for (const s of parKind("gap")) {
      expect(s.options.length, s.id).toBeGreaterThanOrEqual(3);
      expect(new Set(s.options).size, s.id).toBe(s.options.length);
    }
  });

  it("le mot attendu apparaît dans la scène", () => {
    // Condition NÉCESSAIRE, pas suffisante : elle attrape le trou dont la
    // réponse ne figure nulle part dans le texte affiché. Elle ne dit PAS que
    // la réponse est la seule plausible — ici « pizzę » et « lasagne » sont
    // tous deux cités par la question de Żubr, et c'est assumé : la réplique
    // qui aurait levé l'ambiguïté a été retirée par choix produit.
    for (const st of POLISH_STORIES) {
      for (const sc of st.scenes) {
        if (sc.step.kind !== "gap") continue;
        const texte = Speech.normalize(sc.lines.map((l) => l.pl).join(" "));
        const attendu = Speech.normalize(sc.step.answer);
        expect(texte.includes(attendu), sc.step.id + " : « " + attendu + " »").toBe(true);
      }
    }
  });
});

/* -------------------------------- match ------------------------------ */
describe("épreuves match", () => {
  it("au moins 3 paires", () => {
    for (const s of parKind("match")) {
      expect(s.pairs.length, s.id).toBeGreaterThanOrEqual(3);
    }
  });

  it("les côtés pl et fr sont uniques chacun", () => {
    // Un doublon rendrait deux appariements corrects indiscernables du mauvais.
    for (const s of parKind("match")) {
      const pl = s.pairs.map((p) => Speech.normalize(p.pl));
      const fr = s.pairs.map((p) => Speech.normalize(p.fr));
      expect(new Set(pl).size, s.id + " côté pl").toBe(pl.length);
      expect(new Set(fr).size, s.id + " côté fr").toBe(fr.length);
    }
  });

  it("aucun côté vide", () => {
    for (const s of parKind("match")) {
      for (const p of s.pairs) {
        expect(p.pl.trim().length, s.id).toBeGreaterThan(0);
        expect(p.fr.trim().length, s.id).toBeGreaterThan(0);
      }
    }
  });
});

/* ------------------------------- session ----------------------------- */
describe("construction de session", () => {
  it("une épreuve par scène, dans l'ordre du récit", () => {
    for (const st of POLISH_STORIES) {
      const exs = Session.buildStorySession(st.id);
      expect(exs).toHaveLength(st.scenes.length);
      expect(exs.map((e) => e.itemId)).toEqual(st.scenes.map((sc) => sc.step.id));
    }
  });

  it("une histoire inconnue rend une liste vide, sans lever", () => {
    expect(Session.buildStorySession("story-inexistante")).toEqual([]);
  });

  it("chaque exercice porte le contexte de SA scène", () => {
    for (const st of POLISH_STORIES) {
      const exs = Session.buildStorySession(st.id);
      exs.forEach((ex, i) => {
        expect(ex.context, ex.itemId).toEqual(st.scenes[i].lines);
        expect(ex.sceneTitle, ex.itemId).toBe(st.title);
      });
    }
  });

  it("aucun exercice n'a d'instruction vide", () => {
    for (const st of POLISH_STORIES) {
      for (const ex of Session.buildStorySession(st.id)) {
        expect(ex.instruction.length, ex.itemId).toBeGreaterThan(0);
      }
    }
  });

  it("l'audio d'un gap prononce la phrase complète, pas les tirets", () => {
    for (const st of POLISH_STORIES) {
      for (const ex of Session.buildStorySession(st.id)) {
        if (ex.type !== "story-gap") continue;
        expect(ex.audioText.includes("_"), ex.itemId).toBe(false);
        expect(ex.audioText, ex.itemId).toContain(ex.answer);
      }
    }
  });

  it("les bonnes réponses de chaque épreuve sont acceptées par check()", () => {
    for (const st of POLISH_STORIES) {
      for (const sc of st.scenes) {
        const ex = Exercises.makeStoryStep(st, sc);
        const step = sc.step;
        let reponse;
        if (step.kind === "quiz") reponse = step.answers.length > 1 ? step.answers : step.answers[0];
        else if (step.kind === "build") reponse = step.pl.split(/\s+/);
        else if (step.kind === "gap") reponse = step.answer;
        else reponse = step.pairs.map((p) => ({ pl: p.pl, fr: p.fr }));
        expect(Exercises.check(ex, reponse), step.id).toBe(true);
      }
    }
  });
});
