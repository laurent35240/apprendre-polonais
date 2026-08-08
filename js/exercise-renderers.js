// @ts-check
/* =====================================================================
   EXERCISE RENDERERS — boucle d'exercice : rendu par type, réponse,
   feedback, progression dans la session, fin de session.
   Extrait de app.js : ce module possède tout le cycle de vie de la
   session (session/answered/awaitingContinue/activeRec/autoPlayToken)
   et ne connaît app.js qu'à travers les callbacks reçus par `init()` —
   jamais par import, pour rester en aval dans le DAG (app.js reste le
   seul module que rien n'importe).
   ===================================================================== */
import { Speech } from "./speech.js";
import { Gamification } from "./gamification.js";
import { Exercises } from "./exercises.js";
import { Progress } from "./progress.js";
import { UI } from "./ui.js";

var el = UI.el;
var clear = UI.clear;

/** @type {HTMLElement} */ var appRoot;
/** @type {() => void} */ var renderHomeCb = function () {};
/** @type {() => void} */ var updateHeaderCb = function () {};
/** @type {(pct: number, correct: number, total: number, lessonDone: boolean, newBadges: Badge[], xpGagne: number, storyDone?: boolean) => void} */
var renderSummaryCb = function () {};

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

/**
 * Branche ce module sur le DOM et les écrans de app.js. Appelé une seule
 * fois depuis boot(), juste après que appRoot soit résolu — jamais à
 * l'évaluation du module, pour ne pas dépendre du DOM à l'import.
 * @param {HTMLElement} root
 * @param {{ renderHome: () => void, updateHeader: () => void, renderSummary: typeof renderSummaryCb }} callbacks
 * @returns {void}
 */
function init(root, callbacks) {
  appRoot = root;
  renderHomeCb = callbacks.renderHome;
  updateHeaderCb = callbacks.updateHeader;
  renderSummaryCb = callbacks.renderSummary;
}

/**
 * @returns {boolean} vrai si une session d'exercices est en cours.
 */
function isActive() {
  return session !== null;
}

// Coupe aussi la synthèse vocale (feedback en cours de relecture) : les deux
// audios "en vol" sont ce qu'on veut annuler ensemble à la sortie d'exercice.
function stopRecognition() {
  Speech.cancelSpeak();
  if (!activeRec) return;
  try {
    activeRec.abort();
  } catch (e) {
    /* déjà terminée */
  }
  activeRec = null;
}

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
  window.scrollTo(0, 0);

  // Barre de progression de la session
  var ratio = session.index / session.exercises.length;
  var quitBtn = el("button", {
    class: "quit-btn",
    text: "✕",
    title: "Quitter",
    onclick: function () {
      if (confirm("Quitter la session ? Ta progression déjà validée est gardée."))
        renderHomeCb();
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
    case "reading":
      renderReading(card, ex);
      break;
    case "write":
      renderWrite(card, ex);
      break;
    case "story-quiz":
      renderStoryQuiz(card, ex);
      break;
    case "story-build":
      renderStoryBuild(card, ex);
      break;
    case "story-gap":
      renderStoryGap(card, ex);
      break;
    case "story-match":
      renderStoryMatch(card, ex);
      break;
    default:
      /** @type {never} */ (ex);
  }

  appRoot.appendChild(card);

  // Zone de feedback (remplie après réponse)
  appRoot.appendChild(el("div", { id: "feedback", class: "feedback" }));
}

// Options TTS différenciant les voix d'un échange.
// Dialogues de leçon : "A" plus aiguë, "B" plus grave.
// Histoires bonus : "Ż" (Żubr) prend la voix aiguë, "B" (Bocian) la grave, et
// "N" (le narrateur) reste sur la voix par défaut — sans ce cas, le narrateur
// tomberait dans la même voix que Żubr et on ne distinguerait plus le récit des
// répliques.
/**
 * @param {string} [speaker]
 * @returns {SpeakOpts}
 */
function ttsOptsFor(speaker) {
  if (!speaker) return {};
  if (speaker === "N") return {};
  var grave = speaker === "B";
  return { pitch: grave ? 0.82 : 1.1, voiceIndex: grave ? 1 : 0 };
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

/* ---- Compréhension de texte ---- */
/**
 * @param {HTMLElement} card
 * @param {ReadingExercise} ex
 * @returns {void}
 */
function renderReading(card, ex) {
  var textZone = el(
    "div",
    { class: "reading-text" },
    ex.passage.map(function (p) { return el("p", { text: p }); })
  );
  var passage = el("div", { class: "reading-passage" }, [
    audioButton(ex.audioText, false),
    textZone
  ]);
  card.appendChild(passage);

  var promptWrap = el("div", { class: "prompt" });
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

/* ---- Production libre ---- */
/**
 * @param {HTMLElement} card
 * @param {WriteExercise} ex
 * @returns {void}
 */
function renderWrite(card, ex) {
  var promptWrap = el("div", { class: "prompt" });
  promptWrap.appendChild(
    el("span", { class: "prompt-text " + ex.promptLang, text: ex.promptText })
  );
  card.appendChild(promptWrap);
  if (ex.hint) card.appendChild(el("div", { class: "write-hint", text: "💡 " + ex.hint }));

  var input = el("input", {
    class: "text-input",
    type: "text",
    autocomplete: "off",
    autocorrect: "off",
    autocapitalize: "off",
    spellcheck: "false",
    placeholder: "Écris ta phrase en polonais…"
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
      e.stopPropagation();
      submit.click();
    }
  });
  card.appendChild(el("div", { class: "type-row" }, [input, submit]));

  var POLISH_CHARS_W = ['ą','ć','ę','ł','ń','ó','ś','ź','ż'];
  var diacriticBar = el("div", { class: "diacritic-bar" });
  POLISH_CHARS_W.forEach(function (ch) {
    diacriticBar.appendChild(el("button", {
      class: "diacritic-btn",
      text: ch,
      type: "button",
      onclick: function () {
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

/* ---- Histoires bonus : contexte de scène partagé par les 4 épreuves ---- */

// Affiche le titre de l'histoire puis les répliques de la scène, et lance leur
// lecture enchaînée. Rien n'est masqué ici, contrairement à renderDialogue : la
// scène est le TEXTE qu'on vient de lire, l'épreuve porte dessus.
/**
 * @param {HTMLElement} card
 * @param {StoryQuizExercise|StoryBuildExercise|StoryGapExercise|StoryMatchExercise} ex
 * @returns {void}
 */
function appendSceneContext(card, ex) {
  if (ex.sceneTitle)
    card.appendChild(el("div", { class: "dialogue-title", text: ex.sceneTitle }));

  var convo = el("div", { class: "dialogue story-scene" });
  (ex.context || []).forEach(function (line) {
    // Le narrateur n'est pas un interlocuteur : sa ligne traverse toute la
    // largeur au lieu de prendre un côté.
    var isNarrator = line.who === "N";
    var side = isNarrator ? "story-narrator" : line.who === "B" ? "who-b" : "who-a";
    var bubble = el("div", { class: "dialogue-line " + side });
    var head = el("div", { class: "dialogue-pl" });
    head.appendChild(audioButton(line.pl, false, line.who));
    head.appendChild(el("span", { class: "pl", text: line.pl }));
    bubble.appendChild(head);
    if (line.fr) bubble.appendChild(el("div", { class: "dialogue-fr", text: line.fr }));

    // Avatar HORS de la bulle (façon messagerie). `characterImg` rend null pour
    // le narrateur : c'est ce null — et non un test sur "N" — qui lui laisse sa
    // ligne pleine largeur sans emballage.
    var avatar = UI.characterImg(line.who, "story-avatar");
    if (!avatar) {
      convo.appendChild(bubble);
    } else {
      // Ordre du DOM toujours avatar-puis-bulle, y compris à droite : c'est le
      // CSS (row-reverse) qui inverse le rendu, pour que l'ordre d'annonce d'un
      // lecteur d'écran reste « qui parle », puis « ce qu'il dit ».
      convo.appendChild(el("div", { class: "story-row " + side }, [avatar, bubble]));
    }
  });
  card.appendChild(convo);

  var token = autoPlayToken;
  setTimeout(function () {
    if (token !== autoPlayToken) return;
    speakSequence(ex.context || [], 400);
  }, 350);
}

/* ---- Histoire : QCM (1 ou 2 bonnes réponses) ---- */
/**
 * @param {HTMLElement} card
 * @param {StoryQuizExercise} ex
 * @returns {void}
 */
function renderStoryQuiz(card, ex) {
  appendSceneContext(card, ex);

  card.appendChild(
    el("div", { class: "prompt" }, [
      audioButton(ex.audioText),
      el("span", { class: "prompt-text pl", text: ex.promptText })
    ])
  );
  card.appendChild(el("div", { class: "subtext", text: ex.subText }));

  var opts = el("div", { class: "options" });

  if (!ex.multi) {
    // Cas simple : strictement le motif de renderMC / renderReading.
    ex.options.forEach(function (opt) {
      opts.appendChild(
        el("button", {
          class: "option pl",
          text: opt,
          onclick: function (e) {
            handleAnswer(ex, opt, /** @type {HTMLElement} */ (e.currentTarget), opts);
          }
        })
      );
    });
    card.appendChild(opts);
    return;
  }

  // Cas multiple : les options deviennent des bascules. Source de vérité unique
  // = `chosen` (indices dans ex.options) ; l'état visuel en est DÉRIVÉ à chaque
  // refresh, jamais maintenu en parallèle du DOM (même discipline que
  // appendWordBankPicker).
  /** @type {number[]} */
  var chosen = [];
  /** @type {HTMLButtonElement[]} */
  var tiles = [];

  function refresh() {
    tiles.forEach(function (tile, i) {
      tile.classList.toggle("selected", chosen.indexOf(i) !== -1);
    });
  }

  ex.options.forEach(function (opt, i) {
    var tile = el("button", {
      class: "option pl",
      text: opt,
      onclick: function () {
        var at = chosen.indexOf(i);
        if (at === -1) chosen.push(i);
        else chosen.splice(at, 1);
        refresh();
      }
    });
    tiles.push(tile);
    opts.appendChild(tile);
  });
  card.appendChild(opts);

  card.appendChild(
    el("button", {
      class: "btn btn-primary",
      text: "Valider",
      onclick: function () {
        handleAnswer(
          ex,
          chosen.map(function (i) { return ex.options[i]; }),
          null,
          opts
        );
      }
    })
  );
}

/* ---- Histoire : reconstituer la réplique suivante ---- */
/**
 * @param {HTMLElement} card
 * @param {StoryBuildExercise} ex
 * @returns {void}
 */
function renderStoryBuild(card, ex) {
  appendSceneContext(card, ex);
  card.appendChild(
    el("div", { class: "prompt" }, [
      el("span", { class: "prompt-text fr", text: "→ " + ex.promptText })
    ])
  );
  appendWordBankPicker(card, ex);
}

/* ---- Histoire : mot manquant à choisir ---- */
/**
 * @param {HTMLElement} card
 * @param {StoryGapExercise} ex
 * @returns {void}
 */
function renderStoryGap(card, ex) {
  appendSceneContext(card, ex);

  card.appendChild(
    el("div", { class: "prompt" }, [
      el("span", { class: "prompt-text pl", text: ex.promptText })
    ])
  );
  card.appendChild(el("div", { class: "subtext", text: ex.subText }));

  // Tuiles et non boutons d'option : c'est un mot qu'on pose dans un trou, la
  // forme visuelle doit le dire (mêmes classes que la banque de mots).
  var opts = el("div", { class: "build-bank" });
  ex.options.forEach(function (opt) {
    opts.appendChild(
      el("button", {
        class: "chip bank-chip",
        text: opt,
        onclick: function (e) {
          handleAnswer(ex, opt, /** @type {HTMLElement} */ (e.currentTarget), opts);
        }
      })
    );
  });
  card.appendChild(opts);
}

/* ---- Histoire : relier polonais ↔ français ---- */
/**
 * @param {HTMLElement} card
 * @param {StoryMatchExercise} ex
 * @returns {void}
 */
function renderStoryMatch(card, ex) {
  appendSceneContext(card, ex);
  card.appendChild(
    el("div", { class: "prompt" }, [
      el("span", { class: "prompt-text fr", text: ex.promptText })
    ])
  );

  // Colonne de droite mélangée : alignée sur la gauche, l'exercice serait
  // résoluble sans lire un seul mot.
  var gauche = ex.pairs.map(function (p) { return p.pl; });
  var droite = Exercises.shuffle(
    ex.pairs.map(function (p) { return p.fr; })
  );

  // SOURCE DE VÉRITÉ UNIQUE : `paires` (indices [gauche, droite]) et
  // `enAttente` (index de gauche sélectionné, ou null). Tout l'affichage en est
  // dérivé par refresh() — aucun état visuel maintenu en parallèle du DOM.
  /** @type {number[][]} */
  var paires = [];
  /** @type {number|null} */
  var enAttente = null;

  /** @type {HTMLButtonElement[]} */
  var tuilesG = [];
  /** @type {HTMLButtonElement[]} */
  var tuilesD = [];

  /**
   * @param {number} i index dans `gauche`
   * @returns {number} rang de la paire (1-based), ou 0 si non appariée
   */
  function rangGauche(i) {
    for (var k = 0; k < paires.length; k++) if (paires[k][0] === i) return k + 1;
    return 0;
  }
  /**
   * @param {number} j index dans `droite`
   * @returns {number}
   */
  function rangDroite(j) {
    for (var k = 0; k < paires.length; k++) if (paires[k][1] === j) return k + 1;
    return 0;
  }

  var valider = el("button", {
    class: "btn btn-primary",
    text: "Valider",
    onclick: function () {
      handleAnswer(
        ex,
        paires.map(function (p) {
          return { pl: gauche[p[0]], fr: droite[p[1]] };
        }),
        null,
        null
      );
    }
  });

  function refresh() {
    tuilesG.forEach(function (tile, i) {
      var rang = rangGauche(i);
      tile.classList.toggle("paired", rang > 0);
      tile.classList.toggle("selected", enAttente === i);
      tile.setAttribute("data-pair", rang ? String(rang) : "");
    });
    tuilesD.forEach(function (tile, j) {
      var rang = rangDroite(j);
      tile.classList.toggle("paired", rang > 0);
      tile.setAttribute("data-pair", rang ? String(rang) : "");
    });
    // Valider n'a de sens que si TOUTES les paires sont faites : la correction
    // est en tout-ou-rien, un envoi partiel serait un faux garanti.
    valider.disabled = paires.length !== ex.pairs.length;
  }

  /**
   * Retire la paire contenant cet index, s'il y en a une.
   * @param {0|1} cote 0 = gauche, 1 = droite
   * @param {number} idx
   * @returns {boolean} vrai si une paire a été défaite
   */
  function defaire(cote, idx) {
    for (var k = 0; k < paires.length; k++) {
      if (paires[k][cote] === idx) {
        paires.splice(k, 1);
        return true;
      }
    }
    return false;
  }

  var colG = el("div", { class: "match-col" });
  gauche.forEach(function (mot, i) {
    var tile = el("button", {
      class: "match-tile pl",
      text: mot,
      onclick: function () {
        // Un re-clic sur une tuile appariée défait la paire.
        if (defaire(0, i)) {
          enAttente = null;
        } else {
          enAttente = enAttente === i ? null : i;
        }
        refresh();
      }
    });
    tuilesG.push(tile);
    colG.appendChild(tile);
  });

  var colD = el("div", { class: "match-col" });
  droite.forEach(function (mot, j) {
    var tile = el("button", {
      class: "match-tile fr",
      text: mot,
      onclick: function () {
        if (defaire(1, j)) {
          refresh();
          return;
        }
        // Sans mot polonais sélectionné, un clic à droite n'a rien à relier.
        if (enAttente === null) return;
        paires.push([enAttente, j]);
        enAttente = null;
        refresh();
      }
    });
    tuilesD.push(tile);
    colD.appendChild(tile);
  });

  card.appendChild(el("div", { class: "story-match" }, [colG, colD]));
  card.appendChild(valider);
  refresh();
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
      // Coupe une éventuelle relecture TTS encore en cours (ex. feedback de
      // l'exercice précédent) : sur mobile elle se mélangerait sinon au son
      // natif de démarrage du micro.
      Speech.cancelSpeak();
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
 * @param {UserAnswer} answer
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
    // `answers` et non `answer` quand il existe : sur un QCM à deux bonnes
    // réponses, ne surligner que la première laisserait croire que l'autre
    // était fausse.
    var want = ("answers" in ex ? ex.answers : [ex.answer]).map(Speech.normalize);
    Array.prototype.forEach.call(optsContainer.children, function (btn) {
      btn.disabled = true;
      if (want.indexOf(Speech.normalize(btn.textContent)) !== -1)
        btn.classList.add("correct");
      else if (btn.classList.contains("selected")) btn.classList.add("wrong");
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
  // Les épreuves d'histoire passent par une intention distincte : leurs ids ne
  // sont pas des clés SRS (cf. Progress.storyAnswerRecorded).
  var res =
    session.meta.kind === "story"
      ? Progress.storyAnswerRecorded(correct)
      : Progress.answerRecorded(ex.itemId, correct);
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
  // avec la voix par défaut au lieu de celle du personnage. `in` plutôt qu'un
  // test sur `type` : dialogue, story-build et story-gap portent tous un
  // `speaker`, et un futur type qui en porte un sera couvert d'office.
  var speaker = "speaker" in ex ? ex.speaker : undefined;
  var content = el("div", { class: "feedback-inner" }, [
    el("div", { class: "feedback-head" }, [
      UI.mascotImg(correct ? "happy" : "sad", "feedback-mascot"),
      el("strong", { text: correct ? "Correct !" : "Presque…" })
    ]),
    el("div", { class: "feedback-msg", text: customMsg || line }),
    ex.type === "listen"
      ? el("div", { class: "feedback-answer" }, [
          el("span", { text: "Mot entendu : " }),
          el("strong", { class: "pl", text: ex.audioText }),
          audioButton(ex.audioText, false)
        ])
      : null,
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
  updateHeaderCb();
  // Rejoue systématiquement le mot/la phrase en polonais (apprentissage par
  // l'oreille), que la réponse soit bonne ou mauvaise. Léger délai pour ne pas
  // couvrir le petit son de validation/erreur. Exclu pour `reading` : son
  // `audioText` est le passage entier, pas un mot/une phrase — la lecture
  // automatique unique en tête d'exercice (et le bouton 🔊 manuel) suffit.
  if (ex.audioText && ex.type !== "reading") {
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

  // Une histoire ne déverrouille rien : elle a sa propre intention, qui ne
  // touche pas la chaîne des leçons (cf. Progress.storyFinished).
  var res =
    session.meta.kind === "story"
      ? Progress.storyFinished(session.meta.storyId, pct)
      : Progress.sessionFinished(
          session.meta.kind === "lesson" ? session.meta.lessonId : null,
          pct
        );
  session.xp += res.xpGained;
  if (res.leveledUp) UI.levelUpToast(res.level);
  renderSummaryCb(
    pct,
    correct,
    total,
    "lessonJustCompleted" in res ? res.lessonJustCompleted : false,
    res.newBadges,
    session.xp,
    "storyJustCompleted" in res && res.storyJustCompleted
  );
}

export const ExerciseRenderers = {
  init: init,
  startSession: startSession,
  endSession: endSession,
  isActive: isActive
};
