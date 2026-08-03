/* =====================================================================
   CHEMINS D'IMAGES — indispensable à cause du repli emoji.
   ---------------------------------------------------------------------
   Chaque <img> de ui.js a un handler `error` qui le remplace par un emoji.
   Un chemin cassé n'émet donc AUCUNE erreur en console : la régression est
   invisible en production (on voit 🦬 au lieu du bison). Ce fichier la rend
   détectable en CI, en 5 ms.
   ===================================================================== */
import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { POLISH_BADGES } from "../data/badges.js";
import { UI } from "../js/ui.js";

// Les poses réellement passées à mascotImg (5 depuis app.js, `levelup`
// depuis ui.js lui-même). Le commentaire d'origine mentionnait `hello`, qui
// n'existe pas : ne pas l'ajouter ici.
const POSES = ["base", "happy", "sad", "celebrate", "levelup", "head"];
// Les `who` des histoires bonus qui ont un visage. "N" (le narrateur) n'en est
// PAS et ne doit pas y être : son absence d'avatar est un invariant testé plus bas.
const PERSOS = [
  { who: "Ż", file: "zubr-head" },
  { who: "B", file: "bocian-head" }
];
// Décor forestier (js/ui.js decorImg) : mêmes clés que la table DECOR.
const DECORS = ["sapin-1", "sapin-2", "feuille", "foret-bandeau"];
const IMG_DIR = resolve(import.meta.dirname, "../public/assets/img");
const BASE = "/apprendre-polonais/assets/img/";

describe("fichiers présents sur disque", () => {
  it.each(POSES)("zubr-%s.png existe", (pose) => {
    expect(existsSync(`${IMG_DIR}/zubr-${pose}.png`)).toBe(true);
  });

  it.each(PERSOS.map((p) => p.file))("%s.png existe", (file) => {
    expect(existsSync(`${IMG_DIR}/${file}.png`)).toBe(true);
  });

  it.each(POLISH_BADGES.map((b) => b.id))("badge-%s.png existe", (id) => {
    expect(existsSync(`${IMG_DIR}/badge-${id}.png`)).toBe(true);
  });

  it("favicon.png existe", () => {
    expect(existsSync(`${IMG_DIR}/favicon.png`)).toBe(true);
  });

  it.each(DECORS)("%s.png existe", (name) => {
    expect(existsSync(`${IMG_DIR}/${name}.png`)).toBe(true);
  });
});

describe("chemins produits par UI", () => {
  // On lit getAttribute("src") et NON .src : ce dernier serait résolu en URL
  // absolue par le DOM, ce qui masquerait la chaîne réellement écrite.
  it("mascotImg préfixe par le base et pointe le bon fichier", () => {
    for (const pose of POSES)
      expect(UI.mascotImg(pose).getAttribute("src")).toBe(`${BASE}zubr-${pose}.png`);
  });

  it("characterImg pointe la tête de chaque personnage", () => {
    for (const p of PERSOS)
      expect(UI.characterImg(p.who).getAttribute("src")).toBe(`${BASE}${p.file}.png`);
  });

  it("characterImg rend null pour un `who` sans visage", () => {
    // C'EST le mécanisme d'absence d'avatar du narrateur : appendSceneContext ne
    // teste jamais "N", il se contente de ce null. S'il devenait une <img>, le
    // narrateur récupérerait un avatar (ou un repli emoji) sans rien casser
    // d'autre — donc en silence.
    expect(UI.characterImg("N")).toBeNull();
    expect(UI.characterImg("A")).toBeNull();
    expect(UI.characterImg("")).toBeNull();
  });

  it("badgeImg préfixe par le base pour les 11 badges", () => {
    for (const b of POLISH_BADGES)
      expect(UI.badgeImg(b.id, b.emoji).getAttribute("src")).toBe(
        `${BASE}badge-${b.id}.png`
      );
  });

  it("decorImg préfixe par le base pour chaque décor", () => {
    for (const name of DECORS)
      expect(UI.decorImg(name).getAttribute("src")).toBe(`${BASE}${name}.png`);
  });

  it("tout chemin produit est absolu — un relatif casserait sans slash final", () => {
    const srcs = [
      ...POSES.map((p) => UI.mascotImg(p).getAttribute("src")),
      ...PERSOS.map((p) => UI.characterImg(p.who).getAttribute("src")),
      ...POLISH_BADGES.map((b) => UI.badgeImg(b.id, b.emoji).getAttribute("src")),
      ...DECORS.map((name) => UI.decorImg(name).getAttribute("src"))
    ];
    for (const s of srcs) expect(s.startsWith("/")).toBe(true);
  });

  it("chaque chemin produit correspond à un fichier réel", () => {
    const srcs = [
      ...POSES.map((p) => UI.mascotImg(p).getAttribute("src")),
      ...PERSOS.map((p) => UI.characterImg(p.who).getAttribute("src")),
      ...POLISH_BADGES.map((b) => UI.badgeImg(b.id, b.emoji).getAttribute("src")),
      ...DECORS.map((name) => UI.decorImg(name).getAttribute("src")),
      `${BASE}favicon.png`
    ];
    // 6 poses + 2 personnages + 11 badges + 4 décors + favicon. `zubr-head` y
    // figure deux fois (pose `head` ET personnage Ż) : c'est voulu, l'image
    // est partagée.
    expect(srcs).toHaveLength(24);
    for (const s of srcs) {
      const nom = s.slice(BASE.length);
      expect(existsSync(`${IMG_DIR}/${nom}`), s).toBe(true);
    }
  });
});
