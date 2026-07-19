/* =====================================================================
   SPEECH — synthèse vocale (TTS) + reconnaissance vocale (pl-PL)
   ---------------------------------------------------------------------
   TTS         : window.speechSynthesis (large support).
   Reconnaissance : webkitSpeechRecognition (Chrome, nécessite micro + net).
   Dégradation gracieuse si indisponible.
   ===================================================================== */
(function () {
  "use strict";

  var voices = [];
  var plVoice = null;

  function loadVoices() {
    if (!("speechSynthesis" in window)) return;
    voices = window.speechSynthesis.getVoices() || [];
    // Cherche une voix polonaise.
    plVoice =
      voices.filter(function (v) {
        return /pl(-|_)?/i.test(v.lang);
      })[0] || null;
    // Respecte le choix éventuel de l'utilisateur.
    var state = window.State && window.State.get();
    if (state && state.settings.voiceName) {
      var chosen = voices.filter(function (v) {
        return v.name === state.settings.voiceName;
      })[0];
      if (chosen) plVoice = chosen;
    }
  }

  if ("speechSynthesis" in window) {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  function ttsAvailable() {
    return "speechSynthesis" in window;
  }

  function hasPolishVoice() {
    return !!plVoice;
  }

  // Prononce un texte polonais.
  function speak(text, opts) {
    opts = opts || {};
    if (!ttsAvailable()) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      if (plVoice) u.voice = plVoice;
      u.lang = plVoice ? plVoice.lang : "pl-PL";
      var state = window.State && window.State.get();
      u.rate = opts.rate || (state ? state.settings.ttsRate : 0.9) || 0.9;
      u.pitch = 1;
      if (opts.onend) u.onend = opts.onend;
      window.speechSynthesis.speak(u);
    } catch (e) {
      console.warn("TTS a échoué.", e);
    }
  }

  function listVoices() {
    return voices.slice();
  }

  /* ----------------------- Reconnaissance vocale ----------------------- */

  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;

  function recognitionAvailable() {
    return !!SR;
  }

  // Écoute une phrase et renvoie la transcription via callbacks.
  // onResult(transcript, confidence), onError(err), onEnd()
  function listen(callbacks) {
    callbacks = callbacks || {};
    if (!recognitionAvailable()) {
      if (callbacks.onError) callbacks.onError("unsupported");
      return null;
    }
    var rec = new SR();
    rec.lang = "pl-PL";
    rec.interimResults = false;
    rec.maxAlternatives = 3;
    rec.continuous = false;

    var got = false;
    rec.onresult = function (event) {
      got = true;
      var res = event.results[0];
      var best = res[0];
      var alts = [];
      for (var i = 0; i < res.length; i++) alts.push(res[i].transcript);
      if (callbacks.onResult)
        callbacks.onResult(best.transcript, best.confidence, alts);
    };
    rec.onerror = function (e) {
      if (callbacks.onError) callbacks.onError(e.error || "error");
    };
    rec.onend = function () {
      if (!got && callbacks.onNoSpeech) callbacks.onNoSpeech();
      if (callbacks.onEnd) callbacks.onEnd();
    };
    try {
      rec.start();
    } catch (e) {
      if (callbacks.onError) callbacks.onError("start-failed");
    }
    return rec;
  }

  /* ----------------- Comparaison prononciation (score) ----------------- */

  // Normalise : minuscule, sans ponctuation, sans accents parasites d'espace.
  function normalize(str) {
    return (str || "")
      .toLowerCase()
      .replace(/[.,!?;:"'()»«]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  // Distance de Levenshtein.
  function levenshtein(a, b) {
    a = a || "";
    b = b || "";
    var m = a.length,
      n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;
    var prev = [];
    for (var j = 0; j <= n; j++) prev[j] = j;
    for (var i = 1; i <= m; i++) {
      var cur = [i];
      for (var k = 1; k <= n; k++) {
        var cost = a.charAt(i - 1) === b.charAt(k - 1) ? 0 : 1;
        cur[k] = Math.min(prev[k] + 1, cur[k - 1] + 1, prev[k - 1] + cost);
      }
      prev = cur;
    }
    return prev[n];
  }

  // Score 0-100 de similarité entre la cible et la transcription.
  // Teste plusieurs alternatives et garde la meilleure.
  function pronunciationScore(target, alternatives) {
    var t = normalize(target);
    if (!t) return 0;
    var best = 0;
    (alternatives || []).forEach(function (alt) {
      var a = normalize(alt);
      var dist = levenshtein(t, a);
      var maxLen = Math.max(t.length, a.length) || 1;
      var sim = Math.round((1 - dist / maxLen) * 100);
      if (sim > best) best = sim;
    });
    return Math.max(0, best);
  }

  window.Speech = {
    ttsAvailable: ttsAvailable,
    hasPolishVoice: hasPolishVoice,
    speak: speak,
    listVoices: listVoices,
    reloadVoices: loadVoices,
    recognitionAvailable: recognitionAvailable,
    listen: listen,
    pronunciationScore: pronunciationScore,
    normalize: normalize
  };
})();
