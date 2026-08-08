// @ts-check
/* =====================================================================
   APP — contrôleur : navigation, rendu des écrans, boucle d'exercices
   ===================================================================== */
import { POLISH_LESSONS } from "../data/lessons.js";
import { POLISH_STORIES } from "../data/stories.js";
import { POLISH_BADGES } from "../data/badges.js";
import { State } from "./state.js";
import { Speech } from "./speech.js";
import { Gamification } from "./gamification.js";
import { Exercises } from "./exercises.js";
import { Progress } from "./progress.js";
import { Cloud } from "./cloud.js";
import { FIREBASE_CONFIG } from "./config.js";
import { Session } from "./session.js";
import { UI } from "./ui.js";
import { ExerciseRenderers } from "./exercise-renderers.js";

// Alias résolus dès l'évaluation du module (et non dans boot()) : l'import est
// hissé et évalué avant ce corps — le graphe est un DAG strict, sans cycle.
// Résoudre ici plutôt que dans boot() rend `el` typé, ce qui propage les types
// d'éléments DOM dans tout le fichier.
var el = UI.el;
var clear = UI.clear;

/** @type {HTMLElement} */ var appRoot;
/** @type {HTMLElement} */ var topbar;

// Regroupement des leçons en « sentiers » de 5 (purement visuel).
var TRAILS = [
  { name: "Le sentier des débuts", icon: "🌱" },     // 1–5   salutations, présentation, pays/nationalités, famille, nombres
  { name: "Le sentier du quotidien", icon: "🏡" },   // 6–10  nombres, restaurant, shopping, verbes du quotidien
  { name: "Le sentier du foyer", icon: "🐾" },       // 11–15 modaux, loisirs, maison/locatif, ANIMAUX DE COMPAGNIE, routine
  { name: "Le sentier du calendrier", icon: "⏰" },   // 16–20 heure, calendrier, dates, génitif, cuisine
  { name: "Le sentier de la ferme", icon: "🐄" },    // 21–25 aspect/futur, couleurs/adjectif, pluriel, ANIMAUX DE LA FERME, adjectif au pluriel
  { name: "Le sentier du miroir", icon: "🪞" },      // 26–30 adjectif tous cas, sentiments, passé, aspect approfondi, routine/się
  { name: "Le sentier de la ville", icon: "🏙️" },    // 31–35 corps, apparence, impératif, ville, transports
  { name: "Le sentier des rencontres", icon: "🌍" }, // 36–40 voyage, téléphone/internet, datif, fêtes, vocatif
  { name: "Le sentier des grands horizons", icon: "🌄" }, // 41–45 pronoms déclinés (x2), comparatif, ANIMAUX DU MONDE, météo
  { name: "Le sentier de la forêt", icon: "🌲" },    // 46–50 nature, ANIMAUX DE LA FORÊT, conditionnel poli, relatives, opinion
  { name: "Le sentier du récit", icon: "📖" }        // 51–55 cause/but, concession, discours indirect, récit, compréhension (capstone)
];
var TRAIL_SIZE = 5;
// Ouverture forcée par l'utilisateur (en mémoire, non persistée) : index -> bool
/** @type {Record<number, boolean>} */
var trailOpenOverride = {};

/**
 * @param {Lesson} a
 * @param {Lesson} b
 * @returns {number}
 */
function byOrder(a, b) {
  return a.order - b.order;
}
function sortedLessons() {
  return (POLISH_LESSONS || []).slice().sort(byOrder);
}

// Un <script type="module"> est différé : DOMContentLoaded est émis APRÈS
// l'exécution des modules non-async, donc l'écouteur est bien posé à temps et la
// branche `else` est morte en pratique. On la garde parce que le mode de
// défaillance qu'elle couvre est le pire possible (page blanche, boot jamais
// appelé, aucune erreur en console) et qu'elle survit à un futur `async`, à un
// import() dynamique ou à une injection par un bundle.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}

async function boot() {
  // required() lève si l'élément manque : un index.html amputé doit produire
  // une erreur bruyante plutôt qu'une page blanche muette.
  appRoot = UI.required("app");
  topbar = UI.required("topbar");
  ExerciseRenderers.init(appRoot, {
    renderHome: renderHome,
    updateHeader: updateHeader,
    renderSummary: renderSummary
  });

  State.load();
  Exercises.buildIndex();
  applyTheme();

  var st = State.status();
  if (st.mode === "readonly") {
    // Sauvegarde écrite par une version plus récente : rien ne doit muter.
    // Pas de startTimeTracker(), pas de checkBadges() — juste de quoi lire sa
    // progression et l'exporter intacte. Pas de Cloud.init() non plus : rien
    // ne doit pouvoir écrire, y compris vers Firestore.
    updateHeader();
    renderReadOnlyNotice(st);
    return;
  }

  // Synchro : init tôt, puis termine une connexion en cours si l'URL est un
  // lien magique (cas peu fréquent — la grande majorité des chargements n'en
  // sont pas, d'où le early-return silencieux dans completeSignInFromUrl).
  // Cloud.ready() attend la relecture d'une session déjà persistée (sinon un
  // utilisateur déjà connecté semblerait déconnecté jusqu'à ce que le
  // callback asynchrone de Firebase ait fini de s'exécuter) ; unique pull
  // avant le premier rendu, puis l'écoute temps réel démarre en tâche de fond.
  Cloud.init(FIREBASE_CONFIG);
  try {
    var signedIn = await Cloud.completeSignInFromUrl();
    if (signedIn) UI.toast("Connecté ✅", "success");
    await Cloud.ready();
    if (Cloud.isSignedIn()) {
      var pulled = await Cloud.pull();
      if (pulled.merged) UI.toast("Progression synchronisée ☁️", "success");
      Cloud.startSync();
    }
  } catch (e) {
    console.warn("Synchro cloud impossible.", e);
    UI.toast("Synchro impossible 😕", "error");
  }

  startTimeTracker();
  updateHeader();
  // Vérifie les badges d'entrée (ex: streak au chargement)
  Gamification.checkBadges();
  if (st.repairs.length) {
    UI.toast(
      "Sauvegarde réparée (" + st.repairs.length +
        " champ(s)). Ta progression est intacte.",
      ""
    );
  }
  renderHome();
}

/* ==================== ÉCRAN DE LECTURE SEULE ========================= */
/**
 * Affiché quand la sauvegarde vient d'une version future. Trois obligations :
 * montrer la progression réellement lue (pour ne pas alarmer), permettre de
 * l'EXPORTER intacte, et ne pas enfermer l'utilisateur dehors.
 * @param {LoadStatus} st
 * @returns {void}
 */
function renderReadOnlyNotice(st) {
  clear(appRoot);
  scrollTop();
  var s = State.get();

  var card = el("div", { class: "card settings" }, [
    el("h1", { text: "🔒 Progression en lecture seule" }),
    el("p", {
      text:
        "Cette sauvegarde a été écrite par une version plus récente de " +
        "l'application (version " + st.loadedVersion + " ; cette version lit la " +
        "version " + State._currentVersion + "). Pour ne pas l'abîmer, rien " +
        "n'est enregistré tant que tu es sur cette version."
    }),
    el("div", { class: "summary-stats" }, [
      summaryStat(s.profile.totalXP, "XP lus"),
      summaryStat("Niv. " + s.profile.level, "niveau"),
      summaryStat(Object.keys(s.items).length, "mots suivis")
    ]),
    el("p", {
      class: "notice",
      text:
        "Le plus souvent, un onglet ou un cache contient une version périmée : " +
        "recharger suffit. Sinon, exporte ta sauvegarde avant toute chose."
    }),
    el("div", { class: "settings-buttons" }, [
      el("button", {
        class: "btn btn-primary",
        text: "⬇️ Exporter la sauvegarde",
        // Rend le texte brut ORIGINAL : c'est la sortie de secours.
        onclick: function () {
          exportSave();
        }
      }),
      el("button", {
        class: "btn btn-secondary",
        text: "🔄 Réessayer",
        onclick: function () {
          location.reload();
        }
      }),
      el("button", {
        class: "btn btn-warn",
        text: "🗑️ Repartir de zéro",
        onclick: function () {
          if (
            !confirm(
              "Effacer cette sauvegarde et repartir de zéro ?\n\n" +
                "Ta progression actuelle (" + s.profile.totalXP + " XP) sera " +
                "PERDUE. Exporte-la d'abord si tu veux la garder."
            )
          )
            return;
          Progress.progressReset();
          applyTheme();
          startTimeTracker();
          updateHeader();
          renderHome();
        }
      })
    ])
  ]);
  appRoot.appendChild(card);
}

/* ============== SORTIE DE PAGE : verser puis écrire ==================
   `pendingSec` accumule le temps HORS de l'état, et n'est versé que par paliers
   de 10 s : fermer l'onglet perdait jusqu'à 9 secondes. Le problème existait
   AVANT l'écriture différée, et débouncer sans drainer l'aurait aggravé.

   Événements : visibilitychange/hidden est le seul fiable sur iOS (fermeture
   d'onglet, bascule d'app, verrouillage d'écran, et le swipe vers l'accueil
   d'une PWA installée) ; pagehide couvre la navigation sortante et le bfcache ;
   freeze est un filet Chrome Android. PAS `beforeunload` : non fiable sur
   mobile, et il DÉSACTIVE le bfcache.

   localStorage.setItem étant synchrone, ces handlers écrivent correctement.
   ===================================================================== */

/**
 * Verse le temps accumulé en mémoire dans l'état.
 * @returns {void}
 */
function flushPendingTime() {
  if (pendingSec <= 0) return;
  var sec = pendingSec;
  // Remis à zéro AVANT l'appel : si addTime lève, on ne comptera pas deux fois.
  pendingSec = 0;
  Progress.timeSpent(sec);
}

/**
 * Ordre imposé : verser le temps, PUIS écrire. Idempotent — appelé jusqu'à trois
 * fois pour un même départ, sans effet (pendingSec est à zéro et flush() est un
 * no-op si rien n'est sale).
 *
 * Le push cloud est un BEST-EFFORT explicite, hors du throttle réseau de 30 s
 * (`Cloud.push()` directement, pas `schedulePush()`) : ce throttle ne
 * tournera jamais si l'onglet ferme avant son échéance. `Cloud.push()` est un
 * no-op silencieux si non connecté ; son échec (page déjà en train de se
 * fermer) ne doit bloquer ni le flush local ni la fermeture elle-même.
 * @returns {void}
 */
function onHide() {
  flushPendingTime();
  State.flush();
  Cloud.push().catch(function () {});
}

document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "hidden") onHide();
});
window.addEventListener("pagehide", onHide);
window.addEventListener("freeze", onHide);

// Remonte en haut de la page à chaque changement d'écran (sinon on reste
// à la position de défilement précédente).
function scrollTop() {
  window.scrollTo(0, 0);
}

/* ============================== THÈME ============================== */
function applyTheme() {
  var s = State.get();
  var t = s.settings.theme;
  if (t === "light" || t === "dark") {
    document.documentElement.setAttribute("data-theme", t);
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

/* =========================== SUIVI DU TEMPS ======================== */
var lastActivity = Date.now();
var pendingSec = 0;
/** @type {ReturnType<typeof setInterval>|null} */
var timeTrackerId = null;
function startTimeTracker() {
  if (timeTrackerId) return; // idempotent : n'empile pas les listeners
  ["click", "keydown", "mousemove", "touchstart"].forEach(function (ev) {
    document.addEventListener(
      ev,
      function () {
        lastActivity = Date.now();
      },
      { passive: true }
    );
  });
  timeTrackerId = setInterval(function () {
    var active =
      document.visibilityState === "visible" &&
      Date.now() - lastActivity < 90000;
    if (active) pendingSec += 1;
    // 30 s et non 10 : verser le temps écrit l'état entier, et le faire 6 fois
    // par minute pour incrémenter un compteur était le premier poste
    // d'écritures. La détection de l'objectif quotidien peut donc arriver
    // jusqu'à 30 s plus tard — immatériel pour un objectif de 30 minutes. Le
    // flush de sortie garantit qu'on ne perd rien à la fermeture.
    if (pendingSec >= 30) {
      var res = Progress.timeSpent(pendingSec);
      pendingSec = 0;
      // En session, le header est déjà rafraîchi à chaque réponse (showFeedback) :
      // inutile de reconstruire tout le topbar sous les doigts de l'utilisateur.
      if (!ExerciseRenderers.isActive()) updateHeader();
      if (res.goalJustMet) {
        UI.confetti();
        UI.toast(
          "🎉 Objectif du jour atteint ! +100 XP. Żubr danse la polka.",
          "success"
        );
        notifyBadges(res.newBadges);
      }
    }
  }, 1000);
}

/* ============================== HEADER ============================= */
function updateHeader() {
  var s = State.get();
  var prog = Gamification.levelProgress(s.profile.totalXP);
  clear(topbar);
  var brand = el("div", { class: "brand", onclick: function () { renderHome(); } }, [
    UI.mascotImg("head", "brand-emoji"),
    el("span", { class: "brand-name", text: "Polski z Żubrem" })
  ]);
  var stats = el("div", { class: "topstats" }, [
    stat("🔥", s.streak.current, "jours"),
    stat("⚡", s.profile.totalXP, "XP"),
    stat("🎓", s.profile.level, "niv.")
  ]);
  var goalRatio = Gamification.dailyGoalRatio();
  var mins = Math.floor(s.dailyGoal.secondsToday / 60);
  var goal = el(
    "div",
    {
      class: "topgoal",
      title: "Objectif quotidien",
      onclick: function () { renderHome(); }
    },
    UI.ring(
      goalRatio,
      mins + "′",
      "/ " + s.dailyGoal.minutesTarget
    )
  );
  var settingsBtn = el("button", {
    class: "icon-btn",
    title: "Réglages",
    text: "⚙️",
    onclick: renderSettings
  });
  var right = el("div", { class: "topbar-right" }, [stats, goal, settingsBtn]);
  topbar.appendChild(brand);
  topbar.appendChild(right);

  // En lecture seule, rien de ce que fait l'app ne doit avoir l'air enregistré.
  if (State.status().mode === "readonly") {
    topbar.appendChild(
      el("div", {
        class: "readonly-banner",
        title: "Sauvegarde d'une version plus récente : rien n'est enregistré.",
        text: "🔒 lecture seule"
      })
    );
  }

  // Barre de niveau
  var xpbar = document.getElementById("xpbar-fill");
  if (xpbar) xpbar.style.width = (prog.ratio * 100).toFixed(1) + "%";
}

/**
 * @param {string} emoji
 * @param {string|number} value
 * @param {string} unit
 * @returns {HTMLElement}
 */
function stat(emoji, value, unit) {
  return el("div", { class: "stat" }, [
    el("span", { class: "stat-emoji", text: emoji }),
    el("span", { class: "stat-val", text: String(value) }),
    unit ? el("span", { class: "stat-unit", text: unit }) : null
  ]);
}

/* ============================ ÉCRAN ACCUEIL ======================== */
/**
 * @param {boolean} [keepScroll] true pour conserver la position de défilement
 *   (dépliage d'un sentier). Voir la note sur les handlers dans le corps.
 * @returns {void}
 */
function renderHome(keepScroll) {
  ExerciseRenderers.endSession(); // sortir d'une session réinitialise tout son cycle de vie
  updateHeader();
  var s = State.get();
  // Déplier/replier un sentier ne doit pas renvoyer en haut de page :
  // on mémorise la position AVANT de vider le DOM, puis on la restaure
  // après reconstruction (rAF), sinon le scroll serait tronqué pendant
  // que la page est momentanément courte.
  var prevScroll = keepScroll === true ? window.scrollY : 0;
  clear(appRoot);
  if (keepScroll === true) {
    requestAnimationFrame(function () {
      window.scrollTo(0, prevScroll);
    });
  } else {
    scrollTop();
  }

  // Bandeau mascotte
  var mins = Math.floor(s.dailyGoal.secondsToday / 60);
  var goalMsg = s.dailyGoal.goalMetToday
    ? "Objectif du jour plié ! Tu peux te la couler douce (ou en refaire 😏)."
    : "Objectif du jour : " +
      s.dailyGoal.minutesTarget +
      " min (tu en es à " +
      mins +
      "). En avant !";
  var hero = el("div", { class: "hero card" }, [
    UI.decorImg("sapin-2", "hero-decor"),
    UI.mascotImg("base", "hero-mascot"),
    el("div", { class: "hero-text" }, [
      el("h1", { text: "Cześć, Laurent !" }),
      el("p", { text: goalMsg })
    ])
  ]);
  appRoot.appendChild(hero);

  // Bouton révision si des items sont dus
  var due = Session.buildReviewSession();
  if (due.length) {
    var reviewCard = el("div", { class: "card review-card" }, [
      el("div", {}, [
        el("strong", { text: "🔁 Révisions du jour" }),
        el("div", {
          class: "small",
          text: due.length + " mot(s) à revoir pour ne pas oublier."
        })
      ]),
      el("button", {
        class: "btn btn-secondary",
        text: "Réviser",
        onclick: function () {
          ExerciseRenderers.startSession(due, { kind: "review", title: "Révisions" });
        }
      })
    ]);
    appRoot.appendChild(reviewCard);
  }

  // Carte des leçons, regroupées par sentiers de 5
  appRoot.appendChild(el("h2", { class: "section-title", text: "Ton parcours" }));

  // Actions rapides côte à côte : reprendre / rejouer une leçon terminée.
  var actions = el("div", { class: "home-actions" });

  var cid = currentLessonId(s);
  // `cid` vient de l'état persisté : une leçon retirée du code mais restée dans
  // une sauvegarde utilisateur rendrait `cur` undefined, et l'accueil entier
  // serait blanc. Le garde n'est donc pas décoratif.
  var cur = cid ? Session.lessonById(cid) : undefined;
  if (cid && cur) {
    var ordreCourant = cur.order;
    actions.appendChild(
      el("button", {
        class: "btn btn-primary home-action",
        text: "Reprendre : leçon " + ordreCourant + " →",
        onclick: function () {
          if (cid) jumpToCurrent(cid);
        }
      })
    );
  }

  var doneLessons = completedLessons(s);
  if (doneLessons.length) {
    actions.appendChild(
      el("button", {
        class: "btn btn-secondary home-action",
        text: "🎲 Une leçon au hasard",
        onclick: function () {
          var pick = doneLessons[Math.floor(Math.random() * doneLessons.length)];
          renderLessonIntro(pick.id);
        }
      })
    );
  }
  if (actions.childNodes.length) appRoot.appendChild(actions);

  var lessons = sortedLessons();
  var path = el("div", { class: "lesson-path" });
  for (var i = 0; i < lessons.length; i += TRAIL_SIZE) {
    var group = lessons.slice(i, i + TRAIL_SIZE);
    path.appendChild(trailNode(i / TRAIL_SIZE, group, s));
  }
  appRoot.appendChild(path);

  // Badges
  appRoot.appendChild(renderBadges(s));

  // Bandeau forestier pleine largeur en pied de page
  appRoot.appendChild(UI.decorImg("foret-bandeau", "forest-banner"));
}

/**
 * @param {Lesson} lesson
 * @param {PersistedState} s
 * @returns {HTMLElement}
 */
function lessonNode(lesson, s) {
  // Repli complet plutôt que partiel : `bestScore` était absent, si bien que
  // l'affichage du score aurait rendu « undefined% » sur une leçon absente de
  // la sauvegarde.
  /** @type {LessonProgress} */
  var st = s.lessons[lesson.id] || { status: "locked", bestScore: 0 };
  var locked = st.status === "locked";
  var done = st.status === "completed";
  return  el(
    "div",
    {
      class:
        "lesson-node " +
        (locked ? "locked" : "") +
        (done ? " done" : ""),
      "data-lesson-id": lesson.id,
      onclick: locked
        ? null
        : function () {
            renderLessonIntro(lesson.id);
          }
    },
    [
      el("div", { class: "lesson-badge", text: String(lesson.order) }),
      el("div", { class: "lesson-info" }, [
        el("div", { class: "lesson-title", text: lesson.title }),
        el("div", {
          class: "lesson-sub",
          text: locked
            ? "🔒 Termine la leçon précédente"
            : done
            ? "Terminée — score " + (st.bestScore ?? 0) + "%"
            : (lesson.vocabulary || []).length + " mots · grammaire"
        })
      ]),
      locked ? null : el("div", { class: "lesson-chevron", text: "›" })
    ]
  );
}

/* ---- Histoires bonus : nœud d'accueil en fin de sentier ---- */

/**
 * @param {number} trailIndex index 0-based dans TRAILS
 * @returns {Story|undefined}
 */
function storyForTrail(trailIndex) {
  return (POLISH_STORIES || []).filter(function (st) {
    return st.trailIndex === trailIndex;
  })[0];
}

// Le déverrouillage est CALCULÉ (les 5 leçons du sentier sont-elles terminées ?)
// et non lu dans l'état : rien ne crée d'entrée `lessons[storyId]` au
// chargement, sinon toute sauvegarde existante gagnerait une clé au premier
// `save()` (cf. Progress.storyFinished et CLAUDE.md § Histoires bonus). Seule la
// COMPLÉTION est persistée.
/**
 * @param {Story} story
 * @param {boolean} trailDone les 5 leçons du sentier sont terminées.
 * @param {PersistedState} s
 * @returns {HTMLElement}
 */
function storyNode(story, trailDone, s) {
  var st = s.lessons[story.id];
  var done = !!st && st.status === "completed";
  // Une histoire déjà terminée reste ouverte même si `order` a changé depuis :
  // le travail réel de l'utilisateur ne se reverrouille pas.
  var locked = !trailDone && !done;

  return el(
    "div",
    {
      class: "lesson-node story-node " + (locked ? "locked" : "") + (done ? " done" : ""),
      "data-story-id": story.id,
      onclick: locked
        ? null
        : function () {
            renderStoryIntro(story.id);
          }
    },
    [
      el("div", { class: "lesson-badge", text: story.icon }),
      el("div", { class: "lesson-info" }, [
        el("div", { class: "lesson-title", text: story.title }),
        el("div", {
          class: "lesson-sub",
          text: locked
            ? "🔒 Termine les 5 leçons du sentier"
            : done
            ? "Histoire terminée — score " + (st ? st.bestScore ?? 0 : 0) + "%"
            : "Histoire bonus · " + (story.scenes || []).length + " épreuves"
        })
      ]),
      locked ? null : el("div", { class: "lesson-chevron", text: "›" })
    ]
  );
}

// Un « sentier » = un paquet de 5 leçons, dépliable/repliable.
/**
 * @param {number} index
 * @param {Lesson[]} lessons
 * @param {PersistedState} s
 * @returns {HTMLElement}
 */
function trailNode(index, lessons, s) {
  var doneCount = lessons.filter(function (l) {
    var st = s.lessons[l.id];
    return st && st.status === "completed";
  }).length;
  var done = doneCount === lessons.length;
  // Par défaut : seul le sentier contenant la leçon en cours est déplié.
  // L'utilisateur peut forcer l'ouverture/fermeture manuellement.
  var open = trailOpenOverride.hasOwnProperty(index)
    ? trailOpenOverride[index]
    : index === currentTrailIndex(s);

  var trail = TRAILS[index] || { name: "Sentier " + (index + 1), icon: "🌲" };

  var body = el("div", { class: "trail-body" });
  lessons.forEach(function (l) {
    body.appendChild(lessonNode(l, s));
  });
  // Histoire bonus du sentier, en dernière position. Elle ne compte NI dans
  // `doneCount` NI dans `done` : elle est optionnelle, un sentier reste
  // « Terminé 🎉 » sans elle.
  var story = storyForTrail(index);
  if (story) body.appendChild(storyNode(story, done, s));

  return el(
    "div",
    {
      class: "trail" + (done ? " done" : "") + (open ? " open" : ""),
      "data-trail-index": index
    },
    [
      el(
        "button",
        {
          class: "trail-header",
          onclick: function () {
            trailOpenOverride[index] = !open;
            renderHome(true);
          }
        },
        [
          el("span", {
            class: "trail-badge",
            text: trail.icon
          }),
          el("div", { class: "trail-info" }, [
            el("div", { class: "trail-title", text: trail.name }),
            el("div", {
              class: "trail-sub",
              text: done
                ? "Terminé 🎉"
                : doneCount + "/" + lessons.length + " leçons terminées"
            })
          ]),
          el("span", { class: "trail-chevron", text: "▾" })
        ]
      ),
      body
    ]
  );
}

// Première leçon débloquée et non terminée (= available ou inProgress).
/**
 * @param {PersistedState} s
 * @returns {string|null}
 */
function currentLessonId(s) {
  var lessons = sortedLessons();
  for (var i = 0; i < lessons.length; i++) {
    var st = s.lessons[lessons[i].id];
    if (!st || st.status === "locked") continue;
    if (st.status !== "completed") return lessons[i].id;
  }
  return null;
}

// Leçons déjà bouclées (rejouables à volonté : buildLessonSession ignore le statut).
/**
 * @param {PersistedState} s
 * @returns {Lesson[]}
 */
function completedLessons(s) {
  return sortedLessons().filter(function (l) {
    var st = s.lessons[l.id];
    return st && st.status === "completed";
  });
}

// Index du sentier contenant la leçon en cours (null si tout est terminé).
/**
 * @param {PersistedState} s
 * @returns {number|null} null si aucune leçon courante.
 */
function currentTrailIndex(s) {
  var cid = currentLessonId(s);
  if (!cid) return null;
  var pos = sortedLessons().findIndex(function (l) {
    return l.id === cid;
  });
  return pos === -1 ? null : Math.floor(pos / TRAIL_SIZE);
}

// Déplie le sentier de la leçon en cours, défile jusqu'à sa carte et la surligne.
/**
 * @param {string} lessonId
 * @returns {void}
 */
function jumpToCurrent(lessonId) {
  var lessons = sortedLessons();
  var pos = lessons.findIndex(function (l) {
    return l.id === lessonId;
  });
  if (pos === -1) return;
  trailOpenOverride[Math.floor(pos / TRAIL_SIZE)] = true;
  renderHome();
  const node = appRoot.querySelector('[data-lesson-id="' + lessonId + '"]');
  if (!node) return;
  node.scrollIntoView({ behavior: "smooth", block: "center" });
  node.classList.add("lesson-node--highlight");
  setTimeout(function () {
    node.classList.remove("lesson-node--highlight");
  }, 1600);
}

/**
 * @param {PersistedState} s
 * @returns {HTMLElement}
 */
function renderBadges(s) {
  var wrap = el("div", { class: "badges-section" }, [
    el("h2", { class: "section-title", text: "Tes trophées" })
  ]);
  var grid = el("div", { class: "badge-grid" });
  (POLISH_BADGES || []).forEach(function (b) {
    var earned = s.badges.indexOf(b.id) !== -1;
    grid.appendChild(
      el(
        "div",
        {
          class: "badge-chip " + (earned ? "earned" : "locked"),
          title: b.desc
        },
        [
          earned
            ? UI.badgeImg(b.id, b.emoji, "badge-chip-emoji")
            : el("div", { class: "badge-chip-emoji locked-lock", text: "🔒" }),
          el("div", { class: "badge-chip-title", text: b.title })
        ]
      )
    );
  });
  wrap.appendChild(grid);
  return wrap;
}

/* ========================= ÉCRAN INTRO LEÇON ======================= */
/**
 * @param {string} lessonId
 * @returns {void}
 */
function renderLessonIntro(lessonId) {
  var lesson = Session.lessonById(lessonId);
  if (!lesson) return;
  // Capturé ici : le narrowing de `lesson` (un `var`) ne survit pas aux
  // closures des handlers plus bas.
  var titre = lesson.title;
  ExerciseRenderers.endSession();
  clear(appRoot);
  scrollTop();

  var back = el("button", {
    class: "link-btn",
    text: "‹ Retour",
    onclick: function () { renderHome(); }
  });
  appRoot.appendChild(back);

  var intro = el("div", { class: "card lesson-intro" }, [
    el("div", { class: "intro-head" }, [
      UI.mascotImg("base", "intro-mascot"),
      el("div", {}, [
        el("h1", { text: lesson.title }),
        el("p", { class: "mascot-line", text: lesson.mascotIntro })
      ])
    ])
  ]);

  // Notes de grammaire (Assimil)
  (lesson.grammarNotes || []).forEach(function (g) {
    var note = el("div", { class: "grammar-note" }, [
      el("h3", { text: "📘 " + g.title }),
      el("p", { text: g.explanationFr })
    ]);
    (g.examples || []).forEach(function (ex) {
      note.appendChild(exampleRow(ex));
    });
    intro.appendChild(note);
  });

  // Aperçu du vocabulaire
  var vocabWrap = el("div", { class: "vocab-preview" }, [
    el("h3", { text: "🗂️ Vocabulaire de la leçon" })
  ]);
  (lesson.vocabulary || []).forEach(function (v) {
    vocabWrap.appendChild(
      el("div", { class: "vocab-row" }, [
        el("button", {
          class: "audio-btn small",
          text: "🔊",
          title: "Écouter",
          onclick: function () {
            Speech.speak(v.pl);
          }
        }),
        el("span", { class: "vocab-pl", text: v.pl }),
        el("span", { class: "vocab-fr", text: v.fr }),
        v.ipa ? el("span", { class: "vocab-ipa", text: "[" + v.ipa + "]" }) : null
      ])
    );
  });
  intro.appendChild(vocabWrap);

  appRoot.appendChild(intro);

  var startBtn = el("button", {
    class: "btn btn-primary btn-big",
    text: "C'est parti ! 🚀",
    onclick: function () {
      var exs = Session.buildLessonSession(lessonId);
      ExerciseRenderers.startSession(exs, { kind: "lesson", lessonId: lessonId, title: titre });
    }
  });
  appRoot.appendChild(startBtn);

  if (!Speech.recognitionAvailable()) {
    appRoot.appendChild(
      el("p", {
        class: "notice",
        html:
          "🎤 Les exercices de <em>prononciation</em> nécessitent Google Chrome (micro + connexion). Ils seront masqués dans les autres navigateurs."
      })
    );
  }
}

/* ---- Écran d'accueil d'une histoire bonus ---- */

// Volontairement plus léger que renderLessonIntro : pas de notes de grammaire ni
// d'aperçu de vocabulaire. Une histoire ne présente rien de nouveau, elle fait
// rejouer ce qui est déjà acquis dans le sentier.
/**
 * @param {string} storyId
 * @returns {void}
 */
function renderStoryIntro(storyId) {
  var story = Session.storyById(storyId);
  if (!story) return;
  // Capturés ici : le narrowing d'un `var` ne survit pas aux closures des
  // handlers ci-dessous (même piège que renderLessonIntro).
  var titre = story.title;
  ExerciseRenderers.endSession();
  clear(appRoot);
  scrollTop();

  appRoot.appendChild(
    el("button", {
      class: "link-btn",
      text: "‹ Retour",
      onclick: function () { renderHome(); }
    })
  );

  appRoot.appendChild(
    el("div", { class: "card lesson-intro story-intro" }, [
      el("div", { class: "intro-head" }, [
        UI.mascotImg("celebrate", "intro-mascot"),
        el("div", {}, [
          el("div", { class: "story-kicker", text: story.icon + " Histoire bonus" }),
          el("h1", { text: story.title }),
          el("p", { class: "story-subtitle", text: story.titleFr }),
          el("p", { class: "mascot-line", text: story.mascotIntro })
        ])
      ])
    ])
  );

  appRoot.appendChild(
    el("button", {
      class: "btn btn-primary btn-big",
      text: "Commencer l'histoire 📖",
      onclick: function () {
        ExerciseRenderers.startSession(Session.buildStorySession(storyId), {
          kind: "story",
          storyId: storyId,
          title: titre
        });
      }
    })
  );
}

/**
 * @param {GrammarExample} ex
 * @returns {HTMLElement}
 */
function exampleRow(ex) {
  return el("div", { class: "example-row" }, [
    el("button", {
      class: "audio-btn small",
      text: "🔊",
      onclick: function () {
        Speech.speak(ex.pl);
      }
    }),
    el("div", {}, [
      el("span", { class: "ex-pl", text: ex.pl }),
      el("span", { class: "ex-fr", text: " — " + ex.fr }),
      ex.note ? el("div", { class: "ex-note", text: "💡 " + ex.note }) : null
    ])
  ]);
}

/**
 * Fonction PURE de ses arguments : `xpGagne` est passé plutôt que lu sur
 * `session`, ce qui rend l'écran testable en isolation.
 * @param {number} pct
 * @param {number} correct
 * @param {number} total
 * @param {boolean} lessonDone
 * @param {Badge[]} newBadges
 * @param {number} xpGagne
 * @param {boolean} [storyDone] histoire bonus terminée : message différent, car
 *   elle ne déverrouille rien.
 * @returns {void}
 */
function renderSummary(pct, correct, total, lessonDone, newBadges, xpGagne, storyDone) {
  clear(appRoot);
  scrollTop();
  updateHeader();
  if (pct >= 60) UI.confetti();

  /** @type {"celebrate"|"happy"|"sad"} */
  var pose = pct >= 90 ? "celebrate" : pct >= 60 ? "happy" : "sad";
  var headline =
    pct >= 90
      ? "Wspaniale ! (Magnifique !)"
      : pct >= 60
      ? "Dobra robota ! (Bon boulot !)"
      : "On continue à s'entraîner !";

  var card = el("div", { class: "card summary" }, [
    UI.mascotImg(pose, "summary-emoji"),
    el("h1", { text: headline }),
    lessonDone
      ? el("p", { class: "summary-unlock", text: "🔓 Leçon terminée, la suivante est débloquée !" })
      : null,
    storyDone
      ? el("p", { class: "summary-unlock", text: "📖 Histoire terminée ! Tu as lu un vrai récit en polonais." })
      : null,
    el("div", { class: "summary-stats" }, [
      summaryStat(correct + "/" + total, "bonnes réponses"),
      summaryStat(pct + "%", "score"),
      summaryStat("+" + xpGagne, "XP gagnés")
    ])
  ]);
  appRoot.appendChild(card);

  if (newBadges && newBadges.length) {
    var bwrap = el("div", { class: "card newbadges" }, [
      el("h3", { text: "🎖️ Nouveaux trophées !" })
    ]);
    newBadges.forEach(function (b) {
      bwrap.appendChild(
        el("div", { class: "newbadge-row" }, [
          UI.badgeImg(b.id, b.emoji, "badge-chip-emoji"),
          el("div", {}, [
            el("strong", { text: b.title }),
            el("div", { class: "small", text: b.desc })
          ])
        ])
      );
    });
    appRoot.appendChild(bwrap);
  }

  appRoot.appendChild(
    el("div", { class: "summary-actions" }, [
      el("button", {
        class: "btn btn-primary btn-big",
        text: "Retour à l'accueil",
        onclick: function () { renderHome(); }
      })
    ])
  );
}

/**
 * @param {string|number} value
 * @param {string} label
 * @returns {HTMLElement}
 */
function summaryStat(value, label) {
  return el("div", { class: "summary-stat" }, [
    el("div", { class: "summary-stat-val", text: String(value) }),
    el("div", { class: "summary-stat-label", text: label })
  ]);
}

/**
 * @param {Badge[]} list
 * @returns {void}
 */
function notifyBadges(list) {
  (list || []).forEach(function (b) {
    UI.badgeToast(b);
  });
}

/* ============================ RÉGLAGES ============================= */
function renderSettings() {
  // L'engrenage ⚙️ du topbar est cliquable EN PLEINE SESSION : sans ça on
  // sortait de session sans réinitialiser son cycle de vie, comme le ✕.
  ExerciseRenderers.endSession();
  var s = State.get();
  clear(appRoot);
  scrollTop();
  appRoot.appendChild(
    el("button", {
      class: "link-btn",
      text: "‹ Retour",
      onclick: function () { renderHome(); }
    })
  );

  var card = el("div", { class: "card settings" }, [
    el("h1", { text: "⚙️ Réglages" })
  ]);

  // Thème
  card.appendChild(el("h3", { text: "Apparence" }));
  var themeSel = el("select", { class: "select" });
  [
    ["auto", "Automatique"],
    ["light", "Clair"],
    ["dark", "Sombre"]
  ].forEach(function (o) {
    var opt = el("option", { value: o[0], text: o[1] });
    if (s.settings.theme === o[0]) opt.selected = true;
    themeSel.appendChild(opt);
  });
  // Les mutations relisent l'état : State.reset()/importJSON() REMPLACENT
  // l'objet, donc `s` capturé au rendu peut être orphelin (écriture perdue).
  themeSel.addEventListener("change", function () {
    // La validation vit dans Progress.settingChanged : le handler transmet, et
    // le piège d'alias devient structurellement impossible.
    if (!Progress.settingChanged("theme", themeSel.value).applied) return;
    applyTheme();
  });
  card.appendChild(row("Thème", themeSel));

  // Son
  var soundChk = el("input", { type: "checkbox" });
  soundChk.checked = s.settings.soundOn;
  soundChk.addEventListener("change", function () {
    Progress.settingChanged("soundOn", soundChk.checked);
  });
  card.appendChild(row("Effets sonores", soundChk));

  // Vitesse voix
  var rate = el("input", {
    type: "range",
    min: "0.5",
    max: "1.2",
    step: "0.05",
    value: String(s.settings.ttsRate)
  });
  var rateVal = el("span", { class: "small", text: s.settings.ttsRate + "×" });
  rate.addEventListener("input", function () {
    if (!Progress.settingChanged("ttsRate", parseFloat(rate.value)).applied) return;
    rateVal.textContent = State.get().settings.ttsRate + "×";
  });
  card.appendChild(row("Vitesse de la voix", el("div", { class: "rate-row" }, [rate, rateVal])));
  card.appendChild(
    el("button", {
      class: "btn btn-secondary",
      text: "🔊 Tester la voix",
      onclick: function () {
        Speech.speak("Dzień dobry, uczę się polskiego!");
      }
    })
  );
  if (!Speech.hasPolishVoice()) {
    card.appendChild(
      el("p", {
        class: "notice",
        text:
          "Aucune voix polonaise détectée par ton navigateur. Chrome en fournit une ; sinon installe un pack voix polonais dans ton OS."
      })
    );
  }

  // Objectif quotidien
  card.appendChild(el("h3", { text: "Objectif quotidien" }));
  var goalSel = el("select", { class: "select" });
  [10, 15, 20, 30, 45, 60].forEach(function (m) {
    var opt = el("option", { value: String(m), text: m + " min" });
    if (s.dailyGoal.minutesTarget === m) opt.selected = true;
    goalSel.appendChild(opt);
  });
  goalSel.addEventListener("change", function () {
    if (!Progress.settingChanged("minutesTarget", parseInt(goalSel.value, 10)).applied)
      return;
    updateHeader();
  });
  card.appendChild(row("Minutes par jour", goalSel));

  // Synchronisation (palier 4).
  card.appendChild(el("h3", { text: "Synchronisation" }));
  if (Cloud.isSignedIn()) {
    var user = Cloud.currentUser();
    var sync = Cloud.status();
    card.appendChild(
      el("p", { class: "notice", text: "Connecté en tant que " + (user ? user.email : "") })
    );
    card.appendChild(
      el("p", {
        class: "small",
        text: sync.lastError
          ? "Erreur de synchro : " + sync.lastError
          : sync.lastPushAt
            ? "Synchronisé à " + heureLocale(sync.lastPushAt)
            : "En attente de la première synchro…"
      })
    );
    card.appendChild(
      el("div", { class: "settings-buttons" }, [
        el("button", {
          class: "btn btn-secondary",
          text: "Se déconnecter",
          onclick: function () {
            Cloud.signOut().then(function () {
              UI.toast("Déconnecté", "");
              renderSettings();
            });
          }
        })
      ])
    );
  } else {
    var emailInput = el("input", {
      type: "email",
      class: "select email-input",
      placeholder: "ton@email.com"
    });
    card.appendChild(row("E-mail", emailInput));
    card.appendChild(
      el("div", { class: "settings-buttons" }, [
        el("button", {
          class: "btn btn-secondary",
          text: "📧 Recevoir mon lien de connexion",
          onclick: function () {
            var email = emailInput.value.trim();
            if (!email) return;
            Cloud.sendMagicLink(email)
              .then(function () {
                UI.toast("Lien envoyé, vérifie ta boîte mail 📬", "success");
              })
              .catch(function (e) {
                console.warn("Envoi du lien impossible.", e);
                UI.toast("Envoi impossible 😕", "error");
              });
          }
        })
      ])
    );
  }

  // Sauvegarde
  card.appendChild(el("h3", { text: "Sauvegarde" }));
  card.appendChild(
    el("div", { class: "settings-buttons" }, [
      el("button", {
        class: "btn btn-secondary",
        text: "⬇️ Exporter",
        // Lambda et non `onclick: exportSave` : le handler recevrait le
        // MouseEvent comme objet d'options. Même classe de bug que renderHome.
        onclick: function () {
          exportSave();
        }
      }),
      el("button", {
        class: "btn btn-secondary",
        text: "⬆️ Importer",
        onclick: importSave
      }),
      el("button", {
        class: "btn btn-danger",
        text: "🗑️ Réinitialiser",
        onclick: function () {
          if (
            confirm(
              "Tout effacer et repartir de zéro ? (Pense à exporter d'abord !)"
            )
          ) {
            Progress.progressReset();
            UI.toast("Remis à zéro. Nowy początek !", "");
            renderHome();
          }
        }
      })
    ])
  );

  appRoot.appendChild(card);
}

/**
 * @param {string} label
 * @param {HTMLElement} control
 * @returns {HTMLElement}
 */
function row(label, control) {
  return el("div", { class: "setting-row" }, [
    el("label", { class: "setting-label", text: label }),
    control
  ]);
}

/**
 * "HH:MM" en heure locale, pour l'affichage du statut de synchro.
 * @param {number} ms
 * @returns {string}
 */
function heureLocale(ms) {
  var d = new Date(ms);
  var p2 = function (/** @type {number} */ n) {
    return String(n).padStart(2, "0");
  };
  return p2(d.getHours()) + ":" + p2(d.getMinutes());
}

/**
 * Horodatage compact pour les noms de fichiers : "2026-07-30-0042".
 * @returns {string}
 */
function horodatage() {
  var d = new Date();
  var p2 = function (/** @type {number} */ n) {
    return String(n).padStart(2, "0");
  };
  return (
    d.getFullYear() + "-" + p2(d.getMonth() + 1) + "-" + p2(d.getDate()) + "-" +
    p2(d.getHours()) + p2(d.getMinutes())
  );
}

/**
 * @param {{silencieux?: boolean, suffixe?: string}} [opts]
 * @returns {boolean} false si le téléchargement n'a pas pu être déclenché.
 */
function exportSave(opts) {
  var o = opts || {};
  try {
    // Écrit d'abord : sinon le fichier exporté serait PLUS RÉCENT que le
    // localStorage, et une fermeture brutale juste après créerait un écart.
    State.flush();
    var data = State.exportJSON();
    var blob = new Blob([data], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    // Nom horodaté : le nom fixe produisait des « (1) », « (2) » et rendait
    // ambigu lequel était le plus récent — précisément un risque à l'import.
    var nom =
      "polski-zubr-" + (o.suffixe ? o.suffixe + "-" : "") + horodatage() + ".json";
    var a = el("a", { href: url, download: nom });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (!o.silencieux) UI.toast("Sauvegarde exportée 📁", "success");
    return true;
  } catch (e) {
    console.warn("Export impossible.", e);
    if (!o.silencieux) UI.toast("Export impossible 😕", "error");
    return false;
  }
}

function importSave() {
  var input = el("input", { type: "file", accept: "application/json" });
  input.addEventListener("change", function () {
    var file = input.files && input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      // readAsText garantit une chaîne, mais le type ne le sait pas.
      var texte = String(reader.result);

      // 1) Valider SANS RIEN MODIFIER, pour pouvoir chiffrer la confirmation.
      /** @type {ImportPreview} */
      var apercu;
      try {
        apercu = State.previewImport(texte);
      } catch (e) {
        if (e instanceof State.FutureVersionError) {
          UI.toast(
            "Cette sauvegarde vient d'une version plus récente de l'app 🔒",
            "error"
          );
        } else if (e instanceof State.InvalidSaveError) {
          UI.toast("Ce fichier n'est pas une sauvegarde 😕", "error");
        } else {
          UI.toast("Fichier illisible 😕", "error");
        }
        return;
      }

      // 2) Confirmer, en montrant les DEUX côtés : c'est la seule information
      // qui permette de décider. L'import est la seule opération irréversible
      // de l'app — le reset, lui, part d'un état qu'on a choisi d'abandonner.
      var actuel = State.get();
      var ok = confirm(
        "Remplacer ta progression actuelle ?\n\n" +
          "ACTUELLE  : " + actuel.profile.totalXP + " XP, niveau " +
          actuel.profile.level + ", " + Object.keys(actuel.items).length + " mots\n" +
          "IMPORTÉE  : " + apercu.totalXP + " XP, niveau " + apercu.level + ", " +
          apercu.itemCount + " mots\n\n" +
          "Une copie de ta progression actuelle sera téléchargée avant le " +
          "remplacement."
      );
      if (!ok) return;

      // 3) Filet de secours. Ce n'est PAS une garantie : un navigateur peut
      // refuser deux téléchargements rapprochés. D'où « sera téléchargée » et
      // non « a été sauvegardée » dans la confirmation, et un échec qui ne
      // bloque pas l'import.
      exportSave({ silencieux: true, suffixe: "avant-import" });

      try {
        var res = Progress.progressImported(texte);
        UI.toast(
          res.repairs.length
            ? "Importée, avec " + res.repairs.length + " champ(s) réparé(s)."
            : "Sauvegarde importée ✅",
          "success"
        );
        applyTheme();
        renderHome();
      } catch (e) {
        // previewImport a déjà validé : arriver ici est anormal.
        console.warn("Import échoué après validation.", e);
        UI.toast("Import échoué 😕", "error");
      }
    };
    reader.readAsText(file);
  });
  input.click();
}
