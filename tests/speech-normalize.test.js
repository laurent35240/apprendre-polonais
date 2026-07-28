/* =====================================================================
   Speech.normalize — fonction pure, et cœur de la notation : c'est elle que
   Exercises.check utilise pour comparer la réponse de l'utilisateur. Ces tests
   FIGENT le comportement actuel, y compris ses trous connus.
   ===================================================================== */
import { describe, it, expect } from "vitest";
import { Speech } from "../js/speech.js";

const n = Speech.normalize;

describe("chiffres → mots polonais", () => {
  // L'API de reconnaissance vocale rend souvent des chiffres arabes là où
  // l'utilisateur a prononcé un mot : la conversion précède la comparaison.
  it("convertit les nombres de la table", () => {
    expect(n("18")).toBe("osiemnaście");
    expect(n("5")).toBe("pięć");
    expect(n("100")).toBe("sto");
    expect(n("21")).toBe("dwadzieścia jeden");
  });

  it("convertit un nombre au milieu d'une phrase", () => {
    expect(n("Jest 7 godzina")).toBe("jest siedem godzina");
    expect(n("Mam 20 lat")).toBe("mam dwadzieścia lat");
  });

  // Trou connu et assumé : la table est lacunaire (33, 34, 36-39, 41-44…).
  // Ce test documente le trou au lieu de le masquer.
  it("laisse tel quel un nombre absent de la table", () => {
    expect(n("33")).toBe("33");
    expect(n("57")).toBe("57");
  });

  it("ne convertit pas un chiffre collé à des lettres", () => {
    expect(n("mp3")).toBe("mp3");
  });
});

describe("normalisation du texte", () => {
  it("passe en minuscules", () => {
    expect(n("DZIEŃ DOBRY")).toBe("dzień dobry");
  });

  // Point IMPORTANT à verrouiller : les diacritiques sont CONSERVÉS. C'est ce
  // qui fait que la reconnaissance vocale doit rendre les accents exacts.
  it("conserve les diacritiques polonais", () => {
    expect(n("Cześć!")).toBe("cześć");
    expect(n("Zażółć gęślą jaźń")).toBe("zażółć gęślą jaźń");
    expect(n("Cześć")).not.toBe("czesc");
  });

  it("retire la ponctuation listée", () => {
    expect(n("Dzień dobry!")).toBe("dzień dobry");
    expect(n("Jak się masz?")).toBe("jak się masz");
    // La réduction des espaces s'applique APRÈS le retrait de la ponctuation :
    // les blancs laissés par les caractères supprimés sont donc recollés.
    expect(n('« Tak », (proszę); nie: ok.')).toBe("tak proszę nie ok");
  });

  // Le tiret n'est PAS dans la classe de caractères retirés.
  it("ne retire pas le tiret", () => {
    expect(n("nie-nie")).toBe("nie-nie");
  });

  it("réduit les espaces multiples et trime", () => {
    expect(n("  dzień    dobry  ")).toBe("dzień dobry");
    expect(n("a\n\tb")).toBe("a b");
  });

  it("tolère null, undefined et la chaîne vide", () => {
    expect(n(null)).toBe("");
    expect(n(undefined)).toBe("");
    expect(n("")).toBe("");
    expect(n("   ")).toBe("");
  });
});

describe("idempotence", () => {
  it("normaliser deux fois donne le même résultat", () => {
    for (const s of ["Cześć!", "Jest 7 godzina", "  DZIEŃ   dobry  "])
      expect(n(n(s))).toBe(n(s));
  });
});
