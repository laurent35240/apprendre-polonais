/* =====================================================================
   APP — contrôleur : navigation, rendu des écrans, boucle d'exercices
   ===================================================================== */
(function () {
  "use strict";

  var el, clear;
  var appRoot, topbar;
  var session = null; // { exercises, index, results, meta }

  document.addEventListener("DOMContentLoaded", boot);

  function boot() {
    el = window.UI.el;
    clear = window.UI.clear;
    appRoot = document.getElementById("app");
    topbar = document.getElementById("topbar");

    window.State.load();
    window.Exercises.buildIndex();
    applyTheme();
    startTimeTracker();
    updateHeader();
    // Vérifie les badges d'entrée (ex: streak au chargement)
    window.Gamification.checkBadges();
    renderHome();
  }

  // Remonte en haut de la page à chaque changement d'écran (sinon on reste
  // à la position de défilement précédente).
  function scrollTop() {
    window.scrollTo(0, 0);
  }

  /* ============================== THÈME ============================== */
  function applyTheme() {
    var s = window.State.get();
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
  function startTimeTracker() {
    ["click", "keydown", "mousemove", "touchstart"].forEach(function (ev) {
      document.addEventListener(
        ev,
        function () {
          lastActivity = Date.now();
        },
        { passive: true }
      );
    });
    setInterval(function () {
      var active =
        document.visibilityState === "visible" &&
        Date.now() - lastActivity < 90000;
      if (active) pendingSec += 1;
      if (pendingSec >= 10) {
        var res = window.Gamification.addTime(pendingSec);
        pendingSec = 0;
        updateHeader();
        if (res.goalJustMet) {
          window.UI.confetti();
          window.UI.toast(
            "🎉 Objectif du jour atteint ! +100 XP. Żubr danse la polka.",
            "success"
          );
          notifyBadges(window.Gamification.checkBadges());
        }
      }
    }, 1000);
  }

  /* ============================== HEADER ============================= */
  function updateHeader() {
    var s = window.State.get();
    var prog = window.Gamification.levelProgress(s.profile.totalXP);
    clear(topbar);
    var brand = el("div", { class: "brand", onclick: renderHome }, [
      window.UI.mascotImg("base", "brand-emoji"),
      el("span", { class: "brand-name", text: "Polski z Żubrem" })
    ]);
    var stats = el("div", { class: "topstats" }, [
      stat("🔥", s.streak.current, "jours"),
      stat("⚡", s.profile.totalXP, "XP"),
      stat("🎓", "Niv. " + s.profile.level, "")
    ]);
    var goalRatio = window.Gamification.dailyGoalRatio();
    var mins = Math.floor(s.dailyGoal.secondsToday / 60);
    var goal = el(
      "div",
      { class: "topgoal", title: "Objectif quotidien", onclick: renderHome },
      window.UI.ring(
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

    // Barre de niveau
    var xpbar = document.getElementById("xpbar-fill");
    if (xpbar) xpbar.style.width = (prog.ratio * 100).toFixed(1) + "%";
  }

  function stat(emoji, value, unit) {
    return el("div", { class: "stat" }, [
      el("span", { class: "stat-emoji", text: emoji }),
      el("span", { class: "stat-val", text: String(value) }),
      unit ? el("span", { class: "stat-unit", text: unit }) : null
    ]);
  }

  /* ============================ ÉCRAN ACCUEIL ======================== */
  function renderHome() {
    updateHeader();
    var s = window.State.get();
    clear(appRoot);
    scrollTop();

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
      window.UI.mascotImg("base", "hero-mascot"),
      el("div", { class: "hero-text" }, [
        el("h1", { text: "Cześć, Laurent !" }),
        el("p", { text: goalMsg })
      ])
    ]);
    appRoot.appendChild(hero);

    // Bouton révision si des items sont dus
    var due = window.Session.buildReviewSession();
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

    // Carte des leçons
    var path = el("div", { class: "lesson-path" });
    (window.POLISH_LESSONS || []).forEach(function (lesson) {
      path.appendChild(lessonNode(lesson, s));
    });
    appRoot.appendChild(el("h2", { class: "section-title", text: "Ton parcours" }));
    appRoot.appendChild(path);

    // Badges
    appRoot.appendChild(renderBadges(s));
  }

  function lessonNode(lesson, s) {
    var st = s.lessons[lesson.id] || { status: "locked" };
    var locked = st.status === "locked";
    var done = st.status === "completed";
    var node = el(
      "div",
      {
        class:
          "lesson-node " +
          (locked ? "locked" : "") +
          (done ? " done" : ""),
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
              ? "Terminée — score " + st.bestScore + "%"
              : (lesson.vocabulary || []).length + " mots · grammaire"
          })
        ]),
        locked ? null : el("div", { class: "lesson-chevron", text: "›" })
      ]
    );
    return node;
  }

  function renderBadges(s) {
    var wrap = el("div", { class: "badges-section" }, [
      el("h2", { class: "section-title", text: "Tes trophées" })
    ]);
    var grid = el("div", { class: "badge-grid" });
    (window.POLISH_BADGES || []).forEach(function (b) {
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
              ? window.UI.badgeImg(b.id, b.emoji, "badge-chip-emoji")
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
  function renderLessonIntro(lessonId) {
    var lesson = window.Session.lessonById(lessonId);
    if (!lesson) return;
    clear(appRoot);
    scrollTop();

    var back = el("button", {
      class: "link-btn",
      text: "‹ Retour",
      onclick: renderHome
    });
    appRoot.appendChild(back);

    var intro = el("div", { class: "card lesson-intro" }, [
      el("div", { class: "intro-head" }, [
        window.UI.mascotImg("base", "intro-mascot"),
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
              window.Speech.speak(v.pl);
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
        var exs = window.Session.buildLessonSession(lessonId);
        startSession(exs, { kind: "lesson", lessonId: lessonId, title: lesson.title });
      }
    });
    appRoot.appendChild(startBtn);

    if (!window.Speech.recognitionAvailable()) {
      appRoot.appendChild(
        el("p", {
          class: "notice",
          html:
            "🎤 Les exercices de <em>prononciation</em> nécessitent Google Chrome (micro + connexion). Ils seront masqués dans les autres navigateurs."
        })
      );
    }
  }

  function exampleRow(ex) {
    return el("div", { class: "example-row" }, [
      el("button", {
        class: "audio-btn small",
        text: "🔊",
        onclick: function () {
          window.Speech.speak(ex.pl);
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
  function startSession(exercises, meta) {
    if (!exercises || !exercises.length) {
      window.UI.toast("Rien à faire ici pour l'instant 🤷", "");
      return;
    }
    window.Gamification.touchActivity();
    session = { exercises: exercises, index: 0, results: [], meta: meta, xp: 0 };
    renderExercise();
  }

  function renderExercise() {
    var ex = session.exercises[session.index];
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
          class: "progress-fill",
          style: "width:" + ratio * 100 + "%"
        })
      ])
    ]);
    appRoot.appendChild(bar);

    var card = el("div", { class: "card exercise" });
    card.appendChild(el("div", { class: "instruction", text: ex.instruction || "" }));

    if (ex.type.indexOf("mc-") === 0) renderMC(card, ex);
    else if (ex.type === "listen") renderListen(card, ex);
    else if (ex.type === "type-fr-pl" || ex.type === "cloze") renderType(card, ex);
    else if (ex.type === "build") renderBuild(card, ex);
    else if (ex.type === "speak") renderSpeak(card, ex);

    appRoot.appendChild(card);

    // Zone de feedback (remplie après réponse)
    appRoot.appendChild(el("div", { id: "feedback", class: "feedback" }));
  }

  function audioButton(text, big) {
    return el("button", {
      class: "audio-btn" + (big ? " big" : ""),
      text: "🔊",
      title: "Écouter",
      onclick: function () {
        window.Speech.speak(text);
      }
    });
  }

  /* ---- QCM ---- */
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
            handleAnswer(ex, opt, e.currentTarget, opts);
          }
        })
      );
    });
    card.appendChild(opts);
  }

  /* ---- Écoute ---- */
  function renderListen(card, ex) {
    card.appendChild(
      el("div", { class: "prompt listen-prompt" }, [audioButton(ex.audioText, true)])
    );
    card.appendChild(
      el("button", {
        class: "link-btn",
        text: "↻ Réécouter",
        onclick: function () {
          window.Speech.speak(ex.audioText);
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
            handleAnswer(ex, opt, e.currentTarget, opts);
          }
        })
      );
    });
    card.appendChild(opts);
    if (ex.autoPlay) setTimeout(function () {
      window.Speech.speak(ex.audioText);
    }, 350);
  }

  /* ---- Saisie / trous ---- */
  function renderType(card, ex) {
    var promptWrap = el("div", { class: "prompt" });
    if (ex.promptLang === "pl") promptWrap.appendChild(audioButton(ex.audioText));
    promptWrap.appendChild(
      el("span", { class: "prompt-text " + ex.promptLang, text: ex.promptText })
    );
    card.appendChild(promptWrap);
    if (ex.subText)
      card.appendChild(el("div", { class: "subtext", text: ex.subText }));

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
    setTimeout(function () {
      input.focus();
    }, 50);
  }

  /* ---- Reconstruction de phrase ---- */
  function renderBuild(card, ex) {
    card.appendChild(
      el("div", { class: "prompt" }, [
        el("span", { class: "prompt-text fr", text: ex.promptText })
      ])
    );
    var answerZone = el("div", { class: "build-answer" });
    var bankZone = el("div", { class: "build-bank" });
    var chosen = [];

    function refresh() {
      clear(answerZone);
      chosen.forEach(function (word, i) {
        answerZone.appendChild(
          el("button", {
            class: "chip",
            text: word,
            onclick: function () {
              chosen.splice(i, 1);
              refresh();
            }
          })
        );
      });
    }

    ex.bank.forEach(function (word) {
      bankZone.appendChild(
        el("button", {
          class: "chip bank-chip",
          text: word,
          onclick: function (e) {
            chosen.push(word);
            e.currentTarget.classList.add("used");
            e.currentTarget.disabled = true;
            refresh();
          }
        })
      );
    });

    card.appendChild(answerZone);
    card.appendChild(el("div", { class: "divider" }));
    card.appendChild(bankZone);
    card.appendChild(
      el("button", {
        class: "btn btn-primary",
        text: "Valider",
        onclick: function () {
          handleAnswer(ex, chosen, null, null);
        }
      })
    );
  }

  /* ---- Prononciation ---- */
  function renderSpeak(card, ex) {
    card.appendChild(
      el("div", { class: "prompt" }, [
        audioButton(ex.audioText, true),
        el("span", { class: "prompt-text pl", text: ex.promptText })
      ])
    );
    if (ex.subText)
      card.appendChild(el("div", { class: "subtext", text: ex.subText }));

    if (!window.Speech.recognitionAvailable()) {
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
        micBtn.classList.add("listening");
        status.textContent = "🎙️ J'écoute…";
        window.Speech.listen({
          onResult: function (transcript, conf, alts) {
            var score = window.Speech.pronunciationScore(ex.answer, alts || [transcript]);
            var ok = score >= 60;
            if (score >= 95) window.Gamification.markPerfectPronunciation();
            recordAndFeedback(
              ex,
              ok,
              score,
              "Tu as dit : « " + transcript + " » — score " + score + "%"
            );
          },
          onError: function (err) {
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
  function handleAnswer(ex, answer, clickedNode, optsContainer, input) {
    var correct = window.Exercises.check(ex, answer);
    // Verrouille les options
    if (optsContainer) {
      Array.prototype.forEach.call(optsContainer.children, function (btn) {
        btn.disabled = true;
        if (btn.textContent === ex.answer) btn.classList.add("correct");
      });
      if (clickedNode && !correct) clickedNode.classList.add("wrong");
    }
    if (input) {
      input.disabled = true;
      input.classList.add(correct ? "correct" : "wrong");
    }
    recordAndFeedback(ex, correct, null, null);
  }

  function recordAndFeedback(ex, correct, score, customMsg) {
    // SRS + XP
    window.SRS.record(ex.itemId, correct);
    if (correct) {
      session.xp += window.Gamification.XP_PER_CORRECT;
      window.Gamification.addXP(window.Gamification.XP_PER_CORRECT);
      window.UI.soundCorrect();
    } else {
      window.UI.soundWrong();
    }
    session.results.push({ itemId: ex.itemId, correct: correct, type: ex.type });
    window.State.save();
    showFeedback(ex, correct, customMsg);
  }

  function showFeedback(ex, correct, customMsg) {
    var fb = document.getElementById("feedback");
    if (!fb) return;
    clear(fb);
    fb.className = "feedback show " + (correct ? "ok" : "ko");
    var line = correct ? window.UI.cheer() : window.UI.consoleLine();
    var content = el("div", { class: "feedback-inner" }, [
      el("div", { class: "feedback-head" }, [
        window.UI.mascotImg(correct ? "happy" : "sad", "feedback-mascot"),
        el("strong", { text: correct ? "Correct !" : "Presque…" })
      ]),
      el("div", { class: "feedback-msg", text: customMsg || line }),
      correct
        ? null
        : el("div", { class: "feedback-answer" }, [
            el("span", { text: "Réponse : " }),
            el("strong", { class: "pl", text: ex.answer }),
            audioButton(ex.audioText)
          ]),
      el("button", {
        class: "btn " + (correct ? "btn-primary" : "btn-warn"),
        text: session.index + 1 >= session.exercises.length ? "Terminer" : "Continuer",
        onclick: nextExercise
      })
    ]);
    fb.appendChild(content);
    updateHeader();
    // Rejoue systématiquement le mot/la phrase en polonais (apprentissage par
    // l'oreille), que la réponse soit bonne ou mauvaise. Léger délai pour ne pas
    // couvrir le petit son de validation/erreur.
    if (ex.audioText) setTimeout(function () {
      window.Speech.speak(ex.audioText);
    }, 300);
    // Entrée pour continuer
    awaitingContinue = true;
  }

  var awaitingContinue = false;
  document.addEventListener("keydown", function (e) {
    if (awaitingContinue && e.key === "Enter") {
      awaitingContinue = false;
      nextExercise();
    }
  });

  function nextExercise() {
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
    var total = session.results.length;
    var correct = session.results.filter(function (r) {
      return r.correct;
    }).length;
    var pct = total ? Math.round((correct / total) * 100) : 0;

    window.Gamification.touchActivity();

    // Complétion de leçon
    var lessonJustCompleted = false;
    if (session.meta.kind === "lesson") {
      var s = window.State.get();
      var lst = s.lessons[session.meta.lessonId];
      if (lst) {
        lst.bestScore = Math.max(lst.bestScore || 0, pct);
        if (pct >= 60) {
          if (lst.status !== "completed") lessonJustCompleted = true;
          lst.status = "completed";
          window.Gamification.addXP(window.Gamification.XP_LESSON_BONUS);
          session.xp += window.Gamification.XP_LESSON_BONUS;
        } else if (lst.status === "available") {
          lst.status = "inProgress";
        }
        window.State.ensureLessonStatuses();
        window.State.save();
      }
    }

    var newBadges = window.Gamification.checkBadges();
    renderSummary(pct, correct, total, lessonJustCompleted, newBadges);
  }

  function renderSummary(pct, correct, total, lessonDone, newBadges) {
    clear(appRoot);
    scrollTop();
    updateHeader();
    if (pct >= 60) window.UI.confetti();

    var pose = pct >= 90 ? "celebrate" : pct >= 60 ? "happy" : "sad";
    var headline =
      pct >= 90
        ? "Wspaniale ! (Magnifique !)"
        : pct >= 60
        ? "Dobra robota ! (Bon boulot !)"
        : "On continue à s'entraîner !";

    var card = el("div", { class: "card summary" }, [
      window.UI.mascotImg(pose, "summary-emoji"),
      el("h1", { text: headline }),
      lessonDone
        ? el("p", { class: "summary-unlock", text: "🔓 Leçon terminée, la suivante est débloquée !" })
        : null,
      el("div", { class: "summary-stats" }, [
        summaryStat(correct + "/" + total, "bonnes réponses"),
        summaryStat(pct + "%", "score"),
        summaryStat("+" + session.xp, "XP gagnés")
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
            window.UI.badgeImg(b.id, b.emoji, "badge-chip-emoji"),
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
          onclick: renderHome
        })
      ])
    );
  }

  function summaryStat(value, label) {
    return el("div", { class: "summary-stat" }, [
      el("div", { class: "summary-stat-val", text: value }),
      el("div", { class: "summary-stat-label", text: label })
    ]);
  }

  function notifyBadges(list) {
    (list || []).forEach(function (b) {
      window.UI.badgeToast(b);
    });
  }

  /* ============================ RÉGLAGES ============================= */
  function renderSettings() {
    var s = window.State.get();
    clear(appRoot);
    scrollTop();
    appRoot.appendChild(
      el("button", { class: "link-btn", text: "‹ Retour", onclick: renderHome })
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
    themeSel.addEventListener("change", function () {
      s.settings.theme = themeSel.value;
      window.State.save();
      applyTheme();
    });
    card.appendChild(row("Thème", themeSel));

    // Son
    var soundChk = el("input", { type: "checkbox" });
    soundChk.checked = s.settings.soundOn;
    soundChk.addEventListener("change", function () {
      s.settings.soundOn = soundChk.checked;
      window.State.save();
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
      s.settings.ttsRate = parseFloat(rate.value);
      rateVal.textContent = s.settings.ttsRate + "×";
      window.State.save();
    });
    card.appendChild(row("Vitesse de la voix", el("div", { class: "rate-row" }, [rate, rateVal])));
    card.appendChild(
      el("button", {
        class: "btn btn-secondary",
        text: "🔊 Tester la voix",
        onclick: function () {
          window.Speech.speak("Dzień dobry, uczę się polskiego!");
        }
      })
    );
    if (!window.Speech.hasPolishVoice()) {
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
      s.dailyGoal.minutesTarget = parseInt(goalSel.value, 10);
      window.State.save();
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
          onclick: exportSave
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
              window.State.reset();
              window.UI.toast("Remis à zéro. Nowy początek !", "");
              renderHome();
            }
          }
        })
      ])
    );

    appRoot.appendChild(card);
  }

  function row(label, control) {
    return el("div", { class: "setting-row" }, [
      el("label", { class: "setting-label", text: label }),
      control
    ]);
  }

  function exportSave() {
    var data = window.State.exportJSON();
    var blob = new Blob([data], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = el("a", {
      href: url,
      download: "polski-zubr-sauvegarde.json"
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    window.UI.toast("Sauvegarde exportée 📁", "success");
  }

  function importSave() {
    var input = el("input", { type: "file", accept: "application/json" });
    input.addEventListener("change", function () {
      var file = input.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          window.State.importJSON(reader.result);
          window.UI.toast("Sauvegarde importée ✅", "success");
          applyTheme();
          renderHome();
        } catch (e) {
          window.UI.toast("Fichier invalide 😕", "error");
        }
      };
      reader.readAsText(file);
    });
    input.click();
  }
})();
