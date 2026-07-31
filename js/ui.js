// @ts-check
/* =====================================================================
   UI — utilitaires de rendu : DOM, mascotte, toasts, confettis, sons
   ===================================================================== */
import { State } from "./state.js";

// Crée un élément DOM. el('div', {class:'x'}, [child, 'texte'])
// Génériqué sur le nom de balise : el("input", …) rend un HTMLInputElement,
// donc `.value` / `.checked` / `.disabled` sont typés chez l'appelant sans
// aucun cast. document.createElement fait déjà cette correspondance.
/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} tag
 * @param {ElAttrs} [attrs]
 * @param {ElChild|ElChild[]} [children]
 * @returns {HTMLElementTagNameMap[K]}
 */
function el(tag, attrs, children) {
  var node = document.createElement(tag);
  var a = attrs || {};
  Object.keys(a).forEach(function (k) {
    var v = a[k];
    // Les 4 casts qui suivent sont le prix de la signature d'index d'ElAttrs :
    // a[k] avec k générique s'élargit à l'union de toutes les propriétés.
    if (k === "class") node.className = /** @type {string} */ (v);
    else if (k === "html") node.innerHTML = /** @type {string} */ (v);
    else if (k === "text") node.textContent = /** @type {string} */ (v);
    else if (k.indexOf("on") === 0 && typeof v === "function") {
      node.addEventListener(
        k.slice(2).toLowerCase(),
        /** @type {EventListener} */ (v)
      );
    } else if (v !== null && v !== undefined) {
      node.setAttribute(k, String(v));
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

/**
 * @template {Node} T
 * @param {T} node
 * @returns {T}
 */
function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
  return node;
}

/**
 * Récupère un élément requis du document, et LÈVE s'il est absent. Un
 * index.html amputé doit produire une erreur bruyante, pas la page blanche
 * silencieuse qu'on obtiendrait en propageant un null.
 * @param {string} id
 * @returns {HTMLElement}
 */
function required(id) {
  var node = document.getElementById(id);
  if (!node) throw new Error("Élément #" + id + " absent de index.html");
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

/**
 * @template T
 * @param {T[]} arr
 * @returns {T}
 */
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
// Les images vivent dans public/assets/img/ et leurs chemins sont construits par
// concaténation, donc invisibles à l'analyse statique de Vite : elles ne sont ni
// hachées ni réécrites. BASE_URL (remplacé à la compilation, slash de tête ET de
// queue garantis) rend le chemin ABSOLU, donc indépendant de l'URL du document.
// Indispensable et non cosmétique : un chemin relatif casserait sur une URL sans
// slash final, et l'échec serait INVISIBLE — chaque <img> a un repli emoji sur
// l'événement `error`, donc aucune erreur ne remonterait en console.
var IMG_BASE = import.meta.env.BASE_URL + "assets/img/";

// <img> de la mascotte, avec repli sur l'emoji si l'image manque.
// pose: base | happy | sad | celebrate | levelup ; cls: classe(s) de taille.
/**
 * @param {"base"|"happy"|"sad"|"celebrate"|"levelup"|"head"} pose
 * @param {string} [cls]
 * @returns {HTMLImageElement}
 */
function mascotImg(pose, cls) {
  var img = el("img", {
    class: "mascot-img " + (cls || ""),
    src: IMG_BASE + "zubr-" + pose + ".png",
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
/**
 * @param {string} badgeId
 * @param {string} [emoji]
 * @param {string} [cls]
 * @returns {HTMLImageElement}
 */
function badgeImg(badgeId, emoji, cls) {
  var img = el("img", {
    class: "badge-img " + (cls || ""),
    src: IMG_BASE + "badge-" + badgeId + ".png",
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
/**
 * @param {string|HTMLElement} msg
 * @param {string} [kind]
 * @returns {void} no-op si #toast-host est absent.
 */
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

/**
 * @param {Badge} badge
 * @returns {void}
 */
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

/**
 * @param {number|string} newLevel
 * @returns {void}
 */
function levelUpToast(newLevel) {
  var host = document.getElementById("toast-host");
  if (!host) return;
  var t = el("div", { class: "toast badge-toast show" }, [
    mascotImg("levelup", "badge-emoji"),
    el("div", {}, [
      el("strong", { text: "Niveau " + newLevel + " atteint !" }),
      el("div", { class: "small", text: "Continue comme ça, tu es fantastique !" })
    ])
  ]);
  host.appendChild(t);
  confetti();
  beep(523, 120, "sine");
  setTimeout(function () { beep(659, 120, "sine"); }, 130);
  setTimeout(function () { beep(784, 200, "sine"); }, 260);
  setTimeout(function () {
    t.classList.remove("show");
    setTimeout(function () {
      if (t.parentNode) t.parentNode.removeChild(t);
    }, 400);
  }, 4000);
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
/** @type {AudioContext|null} */
var audioCtx = null;
/**
 * @param {number} freq
 * @param {number} durMs
 * @param {OscillatorType} [type]
 * @returns {void}
 */
function beep(freq, durMs, type) {
  var s = State.get();
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
/**
 * @param {number} ratio 0 à 1 (clampé).
 * @param {string} label
 * @param {string} [sub]
 * @returns {HTMLElement}
 */
function ring(ratio, label, sub) {
  var r = "52";  // chaîne : setAttribute n'accepte pas de nombre
  var c = 2 * Math.PI * Number(r);
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

/**
 * @param {number} totalSec
 * @returns {string}
 */
function formatMinSec(totalSec) {
  var m = Math.floor(totalSec / 60);
  var s = Math.floor(totalSec % 60);
  return m + " min" + (m ? "" : " " + s + "s");
}

export const UI = {
  el: el,
  clear: clear,
  required: required,
  MASCOT: MASCOT,
  mascotImg: mascotImg,
  badgeImg: badgeImg,
  cheer: cheer,
  consoleLine: console_,
  toast: toast,
  badgeToast: badgeToast,
  levelUpToast: levelUpToast,
  confetti: confetti,
  soundCorrect: soundCorrect,
  soundWrong: soundWrong,
  ring: ring,
  formatMinSec: formatMinSec,
  pick: pick
};
