import { defineConfig } from "vitest/config";

// Un seul fichier de config, volontairement : un vitest.config.js séparé
// REMPLACE (et ne fusionne pas) la config Vite. Il faudrait alors dupliquer
// `base`, sinon import.meta.env.BASE_URL vaudrait "/" en test et
// "/apprendre-polonais/" en prod — ce qui rendrait tests/assets-paths.test.js
// faussement vert.
export default defineConfig({
  // Le site est publié sur https://laurent35240.github.io/apprendre-polonais/
  base: "/apprendre-polonais/",

  build: {
    outDir: "dist",
    // Par défaut "assets", ce qui mélangerait index-<hash>.js avec le contenu
    // copié de public/assets/img/. Séparer les deux évite la confusion.
    assetsDir: "bundle",
    target: "es2020",
    sourcemap: true,
    emptyOutDir: true
  },

  test: {
    // js/speech.js lit `window` au niveau module (l.16, 33) : un env DOM est
    // requis, sinon ReferenceError à l'import. happy-dom ne fournit pas
    // speechSynthesis → même comportement qu'un navigateur sans Web Speech,
    // déjà géré par le code.
    environment: "happy-dom",
    include: ["tests/**/*.test.js"],
    // State.todayStr() utilise l'heure LOCALE et la CI tourne en UTC : sans TZ
    // figée, les tests de bascule de jour et d'heure d'été passent en local et
    // échouent en CI.
    env: { TZ: "Europe/Paris" },
    restoreMocks: true
  }
});
