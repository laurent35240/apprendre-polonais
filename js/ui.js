/* =====================================================================
   UI — utilitaires de rendu : DOM, mascotte, toasts, confettis, sons
   ===================================================================== */
(function () {
  "use strict";

  // Crée un élément DOM. el('div', {class:'x'}, [child, 'texte'])
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      if (k === "class") node.className = attrs[k];
      else if (k === "html") node.innerHTML = attrs[k];
      else if (k === "text") node.textContent = attrs[k];
      else if (k.indexOf("on") === 0 && typeof attrs[k] === "function") {
        node.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
      } else if (attrs[k] !== null && attrs[k] !== undefined) {
        node.setAttribute(k, attrs[k]);
      }
    });
    if (children != null) {
      (Array.isArray(children) ? children : [children]).forEach(function (c) {
        if (c == null) return;
        node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
      });
    }
    return node;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
    return node;
  }

  /* ------------------------------ mascotte ---------------------------- */
  var MASCOT = "🦬";

  var CHEERS = [
    "Świetnie ! (Génial !)",
    "Brawo ! Żubr est fier de toi.",
    "Bravo, tu chauffes !",
    "Parfait, continue comme ça !",
    "Ça, c'est du polonais ! 💪",
    "Dokładnie ! (Exactement !)",
    "Żubr fait un petit galop de joie."
  ];
  var CONSOLE_LINES = [
    "Pas grave, même Żubr trébuche parfois.",
    "Presque ! On réessaiera plus tard.",
    "Nie szkodzi (c'est rien), on apprend !",
    "Erreur = mémoire qui se muscle. Courage !",
    "Żubr te fait un câlin de consolation. 🤗"
  ];

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  function cheer() {
    return pick(CHEERS);
  }
  function console_() {
    return pick(CONSOLE_LINES);
  }

  /* ---------------------------- images ------------------------------- */
  // <img> de la mascotte, avec repli sur l'emoji si l'image manque.
  // pose: base | hello | happy | sad | celebrate ; cls: classe(s) de taille.
  function mascotImg(pose, cls) {
    var img = el("img", {
      class: "mascot-img " + (cls || ""),
      src: "assets/img/zubr-" + pose + ".png",
      alt: "Żubr",
      draggable: "false"
    });
    img.addEventListener("error", function () {
      var span = el("span", { class: "emoji-fallback " + (cls || ""), text: MASCOT });
      if (img.parentNode) img.parentNode.replaceChild(span, img);
    });
    return img;
  }

  // <img> d'un badge (déduit du id), repli sur son emoji.
  function badgeImg(badgeId, emoji, cls) {
    var img = el("img", {
      class: "badge-img " + (cls || ""),
      src: "assets/img/badge-" + badgeId + ".png",
      alt: "",
      draggable: "false"
    });
    img.addEventListener("error", function () {
      var span = el("span", { class: "emoji-fallback " + (cls || ""), text: emoji || "🏅" });
      if (img.parentNode) img.parentNode.replaceChild(span, img);
    });
    return img;
  }

  /* ------------------------------ toasts ------------------------------ */
  function toast(msg, kind) {
    var host = document.getElementById("toast-host");
    if (!host) return;
    var t = el("div", { class: "toast " + (kind || "") }, msg);
    host.appendChild(t);
    // Force reflow puis anime
    requestAnimationFrame(function () {
      t.classList.add("show");
    });
    setTimeout(function () {
      t.classList.remove("show");
      setTimeout(function () {
        if (t.parentNode) t.parentNode.removeChild(t);
      }, 400);
    }, 2600);
  }

  function badgeToast(badge) {
    var host = document.getElementById("toast-host");
    if (!host) return;
    var t = el("div", { class: "toast badge-toast show" }, [
      badgeImg(badge.id, badge.emoji, "badge-emoji"),
      el("div", {}, [
        el("strong", { text: "Badge débloqué !" }),
        el("div", { class: "small", text: badge.title })
      ])
    ]);
    host.appendChild(t);
    confetti();
    setTimeout(function () {
      t.classList.remove("show");
      setTimeout(function () {
        if (t.parentNode) t.parentNode.removeChild(t);
      }, 400);
    }, 3600);
  }

  /* ---------------------------- confettis ----------------------------- */
  function confetti() {
    var host = document.getElementById("fx-host");
    if (!host) return;
    var colors = ["#ff5e5b", "#ffd166", "#06d6a0", "#4d96ff", "#c77dff"];
    for (var i = 0; i < 40; i++) {
      var p = el("div", { class: "confetti" });
      p.style.left = Math.random() * 100 + "vw";
      p.style.background = colors[i % colors.length];
      p.style.animationDelay = Math.random() * 0.3 + "s";
      p.style.transform = "rotate(" + Math.random() * 360 + "deg)";
      host.appendChild(p);
      (function (node) {
        setTimeout(function () {
          if (node.parentNode) node.parentNode.removeChild(node);
        }, 2500);
      })(p);
    }
  }

  /* ------------------------------- sons ------------------------------- */
  var audioCtx = null;
  function beep(freq, durMs, type) {
    var s = window.State.get();
    if (!s.settings.soundOn) return;
    try {
      if (!audioCtx)
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.type = type || "sine";
      osc.frequency.value = freq;
      gain.gain.value = 0.08;
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioCtx.currentTime + durMs / 1000
      );
      osc.stop(audioCtx.currentTime + durMs / 1000);
    } catch (e) {
      /* silencieux */
    }
  }
  function soundCorrect() {
    beep(660, 120);
    setTimeout(function () {
      beep(880, 160);
    }, 90);
  }
  function soundWrong() {
    beep(200, 220, "sawtooth");
  }

  /* --------------------------- anneau de temps ------------------------ */
  // Renvoie un SVG d'anneau de progression (0..1).
  function ring(ratio, label, sub) {
    var r = 52;
    var c = 2 * Math.PI * r;
    var offset = c * (1 - Math.max(0, Math.min(1, ratio)));
    var svgns = "http://www.w3.org/2000/svg";
    var wrap = el("div", { class: "ring-wrap" });
    var svg = document.createElementNS(svgns, "svg");
    svg.setAttribute("viewBox", "0 0 120 120");
    svg.setAttribute("class", "ring");
    var bg = document.createElementNS(svgns, "circle");
    bg.setAttribute("cx", "60");
    bg.setAttribute("cy", "60");
    bg.setAttribute("r", r);
    bg.setAttribute("class", "ring-bg");
    var fg = document.createElementNS(svgns, "circle");
    fg.setAttribute("cx", "60");
    fg.setAttribute("cy", "60");
    fg.setAttribute("r", r);
    fg.setAttribute("class", "ring-fg");
    fg.setAttribute("stroke-dasharray", c.toFixed(1));
    fg.setAttribute("stroke-dashoffset", offset.toFixed(1));
    svg.appendChild(bg);
    svg.appendChild(fg);
    wrap.appendChild(svg);
    var center = el("div", { class: "ring-center" }, [
      el("div", { class: "ring-label", text: label }),
      sub ? el("div", { class: "ring-sub", text: sub }) : null
    ]);
    wrap.appendChild(center);
    return wrap;
  }

  function formatMinSec(totalSec) {
    var m = Math.floor(totalSec / 60);
    var s = Math.floor(totalSec % 60);
    return m + " min" + (m ? "" : " " + s + "s");
  }

  window.UI = {
    el: el,
    clear: clear,
    MASCOT: MASCOT,
    mascotImg: mascotImg,
    badgeImg: badgeImg,
    cheer: cheer,
    consoleLine: console_,
    toast: toast,
    badgeToast: badgeToast,
    confetti: confetti,
    soundCorrect: soundCorrect,
    soundWrong: soundWrong,
    ring: ring,
    formatMinSec: formatMinSec,
    pick: pick
  };
})();
