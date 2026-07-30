// @ts-check
/* =====================================================================
   APP — contrôleur : navigation, rendu des écrans, boucle d'exercices
   ===================================================================== */
import { POLISH_LESSONS } from "../data/lessons.js";
import { POLISH_BADGES } from "../data/badges.js";
import { State } from "./state.js";
import { Speech } from "./speech.js";
import { Gamification } from "./gamification.js";
import { Exercises } from "./exercises.js";
import { Progress } from "./progress.js";
import { Session } from "./session.js";
import { UI } from "./ui.js";

// Alias résolus dès l'évaluation du module (et non dans boot()) : l'import est
// hissé et évalué avant ce corps — le graphe est un DAG strict, sans cycle.
// Résoudre ici plutôt que dans boot() rend `el` typé, ce qui propage les types
// d'éléments DOM dans tout le fichier.
var el = UI.el;
var clear = UI.clear;

/** @type {HTMLElement} */ var appRoot;
/** @type {HTMLElement} */ var topbar;
/** @type {SessionState|null} */
var session = null;
// Jeton d'annulation des lectures audio enchaînées (voir speakSequence).
var autoPlayToken = 0;
// Une réponse a déjà été enregistrée pour l'exercice courant. Sert de jeton de
// consommation : empêche le double comptage XP/SRS et le double « Continuer ».
var answered = false;
// Le feedback est affiché : Entrée passe à la suite.
var awaitingContinue = false;
// Reconnaissance vocale en cours, à annuler si on quitte l'exercice.
/** @type {SpeechRecognition|null} */
var activeRec = null;

// Sortie de session. Appelé par TOUS les écrans hors session : sans ça, l'état
// de session survit à la sortie (Entrée depuis l'accueil relançait la boucle
// d'exercices, et pouvait recréditer le bonus de leçon).
function endSession() {
  session = null;
  answered = false;
  awaitingContinue = false;
  autoPlayToken++; // coupe TTS enchaîné + callbacks asynchrones en vol
  stopRecognition();
}

function stopRecognition() {
  if (!activeRec) return;
  try {
    activeRec.abort();
  } catch (e) {
    /* déjà terminée */
  }
  activeRec = null;
}

// Regroupement des leçons en « sentiers » de 5 (purement visuel).
var TRAILS = [
  { name: "Le sentier des débuts", icon: "🌱" },     // 1–5   salutations → nombres
  { name: "Le sentier du quotidien", icon: "🏡" },   // 6–10  commander, s'habiller, modaux
  { name: "Le sentier du temps", icon: "⏰" },        // 11–15 lieux, heure, calendrier
  { name: "Le sentier des envies", icon: "🍽️" },     // 16–20 dates, génitif, cuisine, aspect, adjectif
  { name: "Le sentier des portraits", icon: "🎨" },  // 21–25 pluriel, adjectif décliné, sentiments, passé, się
  { name: "Le sentier de la ville", icon: "🏙️" },    // 26–30 corps, apparence, impératif, ville, transports
  { name: "Le sentier des échanges", icon: "✈️" },   // 31–35 voyage, téléphone, datif, fêtes, pronoms
  { name: "Le sentier des nuances", icon: "🌍" }     // 36–40 comparatif, météo, nature, conditionnel, récit
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

function boot() {
  // required() lève si l'élément manque : un index.html amputé doit produire
  // une erreur bruyante plutôt qu'une page blanche muette.
  appRoot = UI.required("app");
  topbar = UI.required("topbar");

  State.load();
  Exercises.buildIndex();
  applyTheme();

  var st = State.status();
  if (st.mode === "readonly") {
    // Sauvegarde écrite par une version plus récente : rien ne doit muter.
    // Pas de startTimeTracker(), pas de checkBadges() — juste de quoi lire sa
    // progression et l'exporter intacte.
    updateHeader();
    renderReadOnlyNotice(st);
    return;
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
 * @returns {void}
 */
function onHide() {
  flushPendingTime();
  State.flush();
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
      if (!session) updateHeader();
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
    UI.mascotImg("base", "brand-emoji"),
    el("span", { class: "brand-name", text: "Polski z Żubrem" })
  ]);
  var stats = el("div", { class: "topstats" }, [
    stat("🔥", s.streak.current, "jours"),
    stat("⚡", s.profile.totalXP, "XP"),
    stat("🎓", "Niv. " + s.profile.level, "")
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
  topbar.appendChild(brand);
  topbar.appendChild(stats);
  topbar.appendChild(goal);
  topbar.appendChild(settingsBtn);

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
  endSession(); // sortir d'une session réinitialise tout son cycle de vie
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
          startSession(due, { kind: "review", title: "Révisions" });
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
  var node = el(
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
      el("div", { class: "lesson-badge", text: done ? "✅" : String(lesson.order) }),
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
  return node;
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
            text: done ? "✅" : trail.icon
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
  endSession();
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
      startSession(exs, { kind: "lesson", lessonId: lessonId, title: titre });
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

/* ============================ SESSION ============================= */
/**
 * @param {Exercise[]} exercises
 * @param {SessionMeta} meta
 * @returns {void}
 */
function startSession(exercises, meta) {
  if (!exercises || !exercises.length) {
    UI.toast("Rien à faire ici pour l'instant 🤷", "");
    return;
  }
  Gamification.touchActivity();
  session = { exercises: exercises, index: 0, results: [], meta: meta, xp: 0 };
  renderExercise();
}

function renderExercise() {
  if (!session) return; // hors session : rien à afficher (cf. endSession)
  var ex = session.exercises[session.index];
  autoPlayToken++; // invalide toute lecture enchaînée encore en cours
  stopRecognition();
  // Point d'entrée unique de tout affichage d'exercice : c'est ici que
  // l'invariant « pas encore répondu » se réarme.
  answered = false;
  awaitingContinue = false;
  clear(appRoot);
  scrollTop();

  // Barre de progression de la session
  var ratio = session.index / session.exercises.length;
  var quitBtn = el("button", {
    class: "quit-btn",
    text: "✕",
    title: "Quitter",
    onclick: function () {
      if (confirm("Quitter la session ? Ta progression déjà validée est gardée."))
        renderHome();
    }
  });
  var bar = el("div", { class: "session-bar" }, [
    quitBtn,
    el("div", { class: "progress" }, [
      el("div", {
        id: "progress-fill",
        class: "progress-fill",
        style: "width:" + ratio * 100 + "%"
      })
    ])
  ]);
  appRoot.appendChild(bar);

  var card = el("div", { class: "card exercise" });
  card.appendChild(el("div", { class: "instruction", text: ex.instruction || "" }));

  // switch et non if/else : lui seul narrow le discriminant, et le `default`
  // en `never` fait de l'oubli d'un renderer une erreur de compilation.
  switch (ex.type) {
    case "mc-pl-fr":
    case "mc-fr-pl":
      renderMC(card, ex);
      break;
    case "listen":
      renderListen(card, ex);
      break;
    case "type-fr-pl":
    case "cloze":
      renderType(card, ex);
      break;
    case "build":
      renderBuild(card, ex);
      break;
    case "dialogue":
      renderDialogue(card, ex);
      break;
    case "speak":
      renderSpeak(card, ex);
      break;
    default:
      /** @type {never} */ (ex);
  }

  appRoot.appendChild(card);

  // Zone de feedback (remplie après réponse)
  appRoot.appendChild(el("div", { id: "feedback", class: "feedback" }));
}

// Options TTS différenciant les deux voix d'un dialogue (A plus aiguë, B plus grave).
/**
 * @param {string} [speaker]
 * @returns {SpeakOpts}
 */
function ttsOptsFor(speaker) {
  if (!speaker) return {};
  var isB = speaker === "B";
  return { pitch: isB ? 0.82 : 1.1, voiceIndex: isB ? 1 : 0 };
}

/**
 * @param {string} text
 * @param {boolean} [big]
 * @param {string} [speaker]
 * @returns {HTMLElement}
 */
function audioButton(text, big, speaker) {
  return el("button", {
    class: "audio-btn" + (big ? " big" : ""),
    text: "🔊",
    title: "Écouter",
    onclick: function () {
      // Une écoute manuelle interrompt définitivement une lecture enchaînée.
      autoPlayToken++;
      Speech.speak(text, ttsOptsFor(speaker));
    }
  });
}

// Enchaîne la lecture de plusieurs répliques { who, pl }. La séquence s'arrête
// dès que autoPlayToken change (exercice quitté, ou écoute manuelle).
/**
 * @param {DialogueLine[]} lines
 * @param {number} [gapMs]
 * @returns {void}
 */
function speakSequence(lines, gapMs) {
  if (!lines || !lines.length) return;
  if (!Speech.ttsAvailable()) return;
  var token = autoPlayToken;
  var i = 0;

  function next() {
    if (token !== autoPlayToken || i >= lines.length) return;
    var line = lines[i++];
    var opts = ttsOptsFor(line.who);
    var advanced = false;
    opts.onend = function () {
      if (advanced) return;
      advanced = true;
      if (token !== autoPlayToken) return;
      setTimeout(next, gapMs || 400);
    };
    Speech.speak(line.pl, opts);
  }

  next();
}

/* ---- QCM ---- */
/**
 * @param {HTMLElement} card
 * @param {McExercise} ex
 * @returns {void}
 */
function renderMC(card, ex) {
  var promptWrap = el("div", { class: "prompt" });
  if (ex.promptLang === "pl") promptWrap.appendChild(audioButton(ex.audioText));
  promptWrap.appendChild(
    el("span", { class: "prompt-text " + ex.promptLang, text: ex.promptText })
  );
  card.appendChild(promptWrap);

  var opts = el("div", { class: "options" });
  ex.options.forEach(function (opt) {
    opts.appendChild(
      el("button", {
        class: "option " + ex.answerLang,
        text: opt,
        onclick: function (e) {
          handleAnswer(
            ex,
            opt,
            /** @type {HTMLElement} */ (e.currentTarget),
            opts
          );
        }
      })
    );
  });
  card.appendChild(opts);
}

/* ---- Écoute ---- */
/**
 * @param {HTMLElement} card
 * @param {ListenExercise} ex
 * @returns {void}
 */
function renderListen(card, ex) {
  card.appendChild(
    el("div", { class: "prompt listen-prompt" }, [audioButton(ex.audioText, true)])
  );
  card.appendChild(
    el("button", {
      class: "link-btn",
      text: "↻ Réécouter",
      // Réécouter reste possible après réponse (cf. lockExerciseCard).
      "data-keep-enabled": "1",
      onclick: function () {
        Speech.speak(ex.audioText);
      }
    })
  );
  var opts = el("div", { class: "options" });
  ex.options.forEach(function (opt) {
    opts.appendChild(
      el("button", {
        class: "option fr",
        text: opt,
        onclick: function (e) {
          handleAnswer(
            ex,
            opt,
            /** @type {HTMLElement} */ (e.currentTarget),
            opts
          );
        }
      })
    );
  });
  card.appendChild(opts);
  if (ex.autoPlay) {
    var token = autoPlayToken;
    setTimeout(function () {
      if (token !== autoPlayToken) return; // exercice quitté entre-temps
      Speech.speak(ex.audioText);
    }, 350);
  }
}

/* ---- Saisie / trous ---- */
/**
 * @param {HTMLElement} card
 * @param {TypeExercise|ClozeExercise} ex
 * @returns {void}
 */
function renderType(card, ex) {
  var promptWrap = el("div", { class: "prompt" });
  if (ex.promptLang === "pl") promptWrap.appendChild(audioButton(ex.audioText));
  promptWrap.appendChild(
    el("span", { class: "prompt-text " + ex.promptLang, text: ex.promptText })
  );
  card.appendChild(promptWrap);
  // subText n'existe que sur la variante cloze : `in` narrow proprement, sans
  // toucher aux objets produits par exercises.js.
  var subText = "subText" in ex ? ex.subText : null;
  if (subText)
    card.appendChild(el("div", { class: "subtext", text: subText }));

  var input = el("input", {
    class: "text-input",
    type: "text",
    autocomplete: "off",
    autocorrect: "off",
    autocapitalize: "off",
    spellcheck: "false",
    placeholder: "Tape en polonais…"
  });
  var submit = el("button", {
    class: "btn btn-primary",
    text: "Valider",
    onclick: function () {
      handleAnswer(ex, input.value, null, null, input);
    }
  });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation(); // évite que ce même Entrée déclenche « Continuer »
      submit.click();
    }
  });
  card.appendChild(el("div", { class: "type-row" }, [input, submit]));

  var POLISH_CHARS = ['ą','ć','ę','ł','ń','ó','ś','ź','ż'];
  var diacriticBar = el("div", { class: "diacritic-bar" });
  POLISH_CHARS.forEach(function(ch) {
    diacriticBar.appendChild(el("button", {
      class: "diacritic-btn",
      text: ch,
      type: "button",
      onclick: function() {
        // slice(0, null) === slice(0, 0) : ?? 0 est exactement équivalent.
        var start = input.selectionStart ?? 0;
        var end = input.selectionEnd ?? 0;
        input.value = input.value.slice(0, start) + ch + input.value.slice(end);
        input.setSelectionRange(start + 1, start + 1);
        input.focus();
      }
    }));
  });
  card.appendChild(diacriticBar);

  setTimeout(function () {
    input.focus();
  }, 50);
}

/* ---- Sélecteur de mots (partagé par « build » et « dialogue ») ---- */

// Ajoute la zone de réponse, la banque de mots et le bouton Valider. Source de
// vérité unique : `chosen` (indices dans ex.bank). L'état visuel des tuiles en
// est DÉRIVÉ à chaque refresh, au lieu d'être maintenu en parallèle du DOM.
// Indexer par position gère correctement un mot présent deux fois dans la banque.
/**
 * @param {HTMLElement} card
 * @param {WordBankExercise} ex
 * @returns {void}
 */
function appendWordBankPicker(card, ex) {
  var answerZone = el("div", { class: "build-answer" });
  var bankZone = el("div", { class: "build-bank" });
  /** @type {number[]} */
  var chosen = [];
  /** @type {HTMLButtonElement[]} */
  var bankTiles = [];

  function refresh() {
    clear(answerZone);
    chosen.forEach(function (bankIndex, pos) {
      answerZone.appendChild(
        el("button", {
          class: "chip",
          text: ex.bank[bankIndex],
          onclick: function () {
            chosen.splice(pos, 1);
            refresh();
          }
        })
      );
    });
    bankTiles.forEach(function (tile, i) {
      var used = chosen.indexOf(i) !== -1;
      tile.disabled = used;
      tile.classList.toggle("used", used);
    });
  }

  ex.bank.forEach(function (word, i) {
    var tile = el("button", {
      class: "chip bank-chip",
      text: word,
      onclick: function () {
        chosen.push(i);
        refresh();
      }
    });
    bankTiles.push(tile);
    bankZone.appendChild(tile);
  });

  card.appendChild(answerZone);
  card.appendChild(el("div", { class: "divider" }));
  card.appendChild(bankZone);
  card.appendChild(
    el("button", {
      class: "btn btn-primary",
      text: "Valider",
      onclick: function () {
        handleAnswer(
          ex,
          chosen.map(function (i) { return ex.bank[i]; }),
          null,
          null
        );
      }
    })
  );
}

/* ---- Reconstruction de phrase ---- */
/**
 * @param {HTMLElement} card
 * @param {BuildExercise} ex
 * @returns {void}
 */
function renderBuild(card, ex) {
  card.appendChild(
    el("div", { class: "prompt" }, [
      el("span", { class: "prompt-text fr", text: ex.promptText })
    ])
  );
  appendWordBankPicker(card, ex);
}

/* ---- Dialogue ---- */
/**
 * @param {HTMLElement} card
 * @param {DialogueExercise} ex
 * @returns {void}
 */
function renderDialogue(card, ex) {
  if (ex.title)
    card.appendChild(el("div", { class: "dialogue-title", text: ex.title }));

  // Répliques de contexte (bulles alternées). La réplique cible reste masquée
  // (placeholder « … ») tant qu'elle n'est pas reconstituée.
  var convo = el("div", { class: "dialogue" });
  (ex.context || []).forEach(function (line) {
    var side = line.who === "B" ? "who-b" : "who-a";
    var isTarget = !!line.target;
    var bubble = el("div", { class: "dialogue-line " + side + (isTarget ? " target" : "") });
    var head = el("div", { class: "dialogue-pl" });
    if (!isTarget) head.appendChild(audioButton(line.pl, false, line.who));
    head.appendChild(
      el("span", {
        class: "pl",
        text: isTarget ? "…" : line.pl
      })
    );
    bubble.appendChild(head);
    if (line.fr && !isTarget)
      bubble.appendChild(el("div", { class: "dialogue-fr", text: line.fr }));
    convo.appendChild(bubble);
  });
  card.appendChild(convo);

  // Consigne : produire la réplique cible (identique à build)
  card.appendChild(
    el("div", { class: "prompt" }, [
      el("span", { class: "prompt-text fr", text: "→ " + ex.promptText })
    ])
  );

  appendWordBankPicker(card, ex);

  // Lecture automatique enchaînée des répliques de contexte (la cible est
  // masquée : la prononcer donnerait la réponse).
  var toPlay = (ex.context || []).filter(function (l) { return !l.target; });
  var token = autoPlayToken;
  setTimeout(function () {
    if (token !== autoPlayToken) return;
    speakSequence(toPlay, 400);
  }, 350);
}

/* ---- Prononciation ---- */
/**
 * @param {HTMLElement} card
 * @param {SpeakExercise} ex
 * @returns {void}
 */
function renderSpeak(card, ex) {
  card.appendChild(
    el("div", { class: "prompt" }, [
      audioButton(ex.audioText, true),
      el("span", { class: "prompt-text pl", text: ex.promptText })
    ])
  );
  if (ex.subText)
    card.appendChild(el("div", { class: "subtext", text: ex.subText }));

  if (!Speech.recognitionAvailable()) {
    card.appendChild(
      el("p", {
        class: "notice",
        text:
          "🎤 La reconnaissance vocale n'est pas dispo sur ce navigateur. Écoute et répète à voix haute, puis continue."
      })
    );
    card.appendChild(
      el("button", {
        class: "btn btn-secondary",
        text: "J'ai répété — continuer",
        onclick: function () {
          recordAndFeedback(ex, true, null, "Bien répété ! (non noté)");
        }
      })
    );
    return;
  }

  var status = el("div", { class: "mic-status", text: "Clique et prononce…" });
  var micBtn = el("button", {
    class: "mic-btn",
    text: "🎤",
    onclick: function () {
      // Jeton capturé au clic : si l'utilisateur quitte pendant l'écoute, les
      // callbacks ne doivent ni écrire dans un DOM détaché ni créditer d'XP
      // pour un exercice abandonné.
      var token = autoPlayToken;
      micBtn.classList.add("listening");
      status.textContent = "🎙️ J'écoute…";
      activeRec = Speech.listen({
        onResult: function (transcript, _conf, alts) {
          if (token !== autoPlayToken) return;
          var score = Speech.pronunciationScore(ex.answer, alts || [transcript]);
          var ok = score >= 60;
          if (score >= 95) Progress.pronunciationPerfect();
          recordAndFeedback(
            ex,
            ok,
            score,
            "Tu as dit : « " + transcript + " » — score " + score + "%"
          );
        },
        onError: function (err) {
          if (token !== autoPlayToken) return;
          micBtn.classList.remove("listening");
          if (err === "not-allowed" || err === "service-not-allowed") {
            status.textContent = "🚫 Micro refusé. Autorise-le pour cet exercice.";
          } else if (err === "no-speech") {
            status.textContent = "🤫 Rien entendu, réessaie.";
          } else {
            status.textContent = "Souci micro (" + err + "). Réessaie.";
          }
        },
        onEnd: function () {
          activeRec = null;
          if (token !== autoPlayToken) return;
          micBtn.classList.remove("listening");
        }
      });
    }
  });
  card.appendChild(el("div", { class: "mic-wrap" }, [micBtn, status]));
  card.appendChild(
    el("button", {
      class: "link-btn",
      text: "Passer",
      onclick: function () {
        recordAndFeedback(ex, false, null, "Passé — on le reverra plus tard.");
      }
    })
  );
}

/* -------------------- gestion des réponses ------------------------ */

// Grise tous les contrôles de l'exercice après une réponse. Les boutons
// d'écoute (et ceux marqués data-keep-enabled) restent actifs : réécouter
// fait partie de l'apprentissage et n'a aucun effet sur le score.
function lockExerciseCard() {
  var card = appRoot.querySelector(".card.exercise");
  if (!card) return;
  Array.prototype.forEach.call(
    card.querySelectorAll("button, input, select"),
    function (c) {
      if (c.classList.contains("audio-btn")) return;
      if (c.getAttribute("data-keep-enabled")) return;
      c.disabled = true;
    }
  );
}

/**
 * @param {Exercise} ex
 * @param {string|string[]} answer
 * @param {HTMLElement|null} [clickedNode]
 * @param {HTMLElement|null} [optsContainer]
 * @param {HTMLInputElement|null} [input]
 * @returns {void}
 */
function handleAnswer(ex, answer, clickedNode, optsContainer, input) {
  autoPlayToken++; // une réponse validée stoppe la lecture enchaînée en cours
  var correct = Exercises.check(ex, answer);
  // Verrouille les options
  if (optsContainer) {
    // Même clé de comparaison que Exercises.check (normalize) : une comparaison
    // stricte pouvait surligner « wrong » une option que check() acceptait.
    var want = Speech.normalize(ex.answer);
    Array.prototype.forEach.call(optsContainer.children, function (btn) {
      btn.disabled = true;
      if (Speech.normalize(btn.textContent) === want)
        btn.classList.add("correct");
    });
    if (clickedNode && !correct) clickedNode.classList.add("wrong");
  }
  if (input) {
    input.disabled = true;
    input.classList.add(correct ? "correct" : "wrong");
    var card = input.closest(".card");
    if (card) Array.prototype.forEach.call(card.querySelectorAll(".diacritic-btn"), function(b) { b.disabled = true; });
  }
  recordAndFeedback(ex, correct, null, null);
}

// `_score` n'est pas lu : renderSpeak calcule un vrai score de prononciation
// qui est affiché puis jeté. Régression ou bruit — arbitrage produit, pas une
// suppression mécanique. Le préfixe _ documente le constat sans décider.
/**
 * @param {Exercise} ex
 * @param {boolean} correct
 * @param {number|null} _score NON LU (cf. commentaire ci-dessus).
 * @param {string|null} [customMsg]
 * @returns {void}
 */
function recordAndFeedback(ex, correct, _score, customMsg) {
  // Verrou unique du comptage. Placé ici (l'entonnoir par lequel passent TOUS
  // les types d'exercices) plutôt que dans chaque renderer : sans ça, les
  // boutons « Valider » de build/dialogue/type et le micro de speak restaient
  // actifs après réponse, et chaque re-clic recréditait XP + SRS.
  if (!session || answered) return;
  answered = true;
  lockExerciseCard();
  // Une transaction unique. `session.xp` reste ici : c'est un compteur en
  // mémoire, non persisté — le sortir dans progress.js mélangerait les
  // responsabilités.
  var res = Progress.answerRecorded(ex.itemId, correct);
  if (correct) {
    session.xp += res.xpGained;
    UI.soundCorrect();
    if (res.leveledUp) UI.levelUpToast(res.level);
  } else {
    UI.soundWrong();
  }
  session.results.push({ itemId: ex.itemId, correct: correct, type: ex.type });
  showFeedback(ex, correct, customMsg);
}

/**
 * @param {Exercise} ex
 * @param {boolean} correct
 * @param {string|null} [customMsg]
 * @returns {void}
 */
function showFeedback(ex, correct, customMsg) {
  if (!session) return;
  var fb = document.getElementById("feedback");
  if (!fb) return;
  clear(fb);
  fb.className = "feedback show " + (correct ? "ok" : "ko");
  var line = correct ? UI.cheer() : UI.consoleLine();
  // Le locuteur de la réplique cible : sinon le feedback rejoue la réponse
  // du dialogue avec la voix par défaut au lieu de celle du personnage.
  var speaker = ex.type === "dialogue" ? ex.speaker : undefined;
  var content = el("div", { class: "feedback-inner" }, [
    el("div", { class: "feedback-head" }, [
      UI.mascotImg(correct ? "happy" : "sad", "feedback-mascot"),
      el("strong", { text: correct ? "Correct !" : "Presque…" })
    ]),
    el("div", { class: "feedback-msg", text: customMsg || line }),
    correct
      ? null
      : el("div", { class: "feedback-answer" }, [
          el("span", { text: "Réponse : " }),
          el("strong", { class: "pl", text: ex.answer }),
          audioButton(ex.audioText, false, speaker)
        ]),
    el("button", {
      class: "btn " + (correct ? "btn-primary" : "btn-warn"),
      text: session.index + 1 >= session.exercises.length ? "Terminer" : "Continuer",
      onclick: nextExercise
    })
  ]);
  fb.appendChild(content);
  // La barre avance à la réponse, pas au rendu : sinon elle serait pleine
  // AVANT de répondre au dernier exercice, et n'atteignait jamais 100 %.
  var pf = document.getElementById("progress-fill");
  if (pf)
    pf.style.width =
      ((session.index + 1) / session.exercises.length) * 100 + "%";
  updateHeader();
  // Rejoue systématiquement le mot/la phrase en polonais (apprentissage par
  // l'oreille), que la réponse soit bonne ou mauvaise. Léger délai pour ne pas
  // couvrir le petit son de validation/erreur.
  if (ex.audioText) {
    var token = autoPlayToken;
    setTimeout(function () {
      if (token !== autoPlayToken) return; // exercice quitté entre-temps
      Speech.speak(ex.audioText, ttsOptsFor(speaker));
    }, 300);
  }
  // Entrée pour continuer
  awaitingContinue = true;
}

document.addEventListener("keydown", function (e) {
  if (!session || !awaitingContinue || e.key !== "Enter") return;
  nextExercise();
});

function nextExercise() {
  // Gardes : hors session (Entrée depuis l'accueil après avoir quitté), ou
  // avant toute réponse (double-clic sur « Continuer », qui sautait un
  // exercice voire déclenchait finishSession prématurément).
  if (!session || !answered) return;
  answered = false;
  awaitingContinue = false;
  session.index += 1;
  if (session.index >= session.exercises.length) {
    finishSession();
  } else {
    renderExercise();
  }
}

/* ----------------------- fin de session --------------------------- */
function finishSession() {
  if (!session) return;
  var total = session.results.length;
  var correct = session.results.filter(function (r) {
    return r.correct;
  }).length;
  var pct = total ? Math.round((correct / total) * 100) : 0;

  var res = Progress.sessionFinished(
    session.meta.kind === "lesson" ? session.meta.lessonId : null,
    pct
  );
  session.xp += res.xpGained;
  if (res.leveledUp) UI.levelUpToast(res.level);
  renderSummary(
    pct, correct, total, res.lessonJustCompleted, res.newBadges, session.xp
  );
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
 * @returns {void}
 */
function renderSummary(pct, correct, total, lessonDone, newBadges, xpGagne) {
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
  endSession();
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
