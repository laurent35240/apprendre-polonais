// @ts-check
/* =====================================================================
   UI — utilitaires de rendu : DOM, mascotte, toasts, confettis, sons
   ===================================================================== */
import { State } from "./state.js";

// Insécable avant ! ? ; : — typographie française : ces signes ne doivent
// jamais se retrouver seuls en début de ligne. Sans risque pour le polonais,
// qui n'espace jamais ces signes (donc rien à remplacer dans ce cas).
/**
 * @param {string} s
 * @returns {string}
 */
function frenchTypo(s) {
  return s.replace(/ ([!?;:])/g, " $1");
}

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
    else if (k === "text") node.textContent = frenchTypo(/** @type {string} */ (v));
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
      node.appendChild(typeof c === "string" ? document.createTextNode(frenchTypo(c)) : c);
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
// slash final.
var IMG_BASE = import.meta.env.BASE_URL + "assets/img/";

// <img> de la mascotte.
// pose: base | happy | sad | celebrate | levelup ; cls: classe(s) de taille.
/**
 * @param {"base"|"happy"|"sad"|"celebrate"|"levelup"|"head"} pose
 * @param {string} [cls]
 * @returns {HTMLImageElement}
 */
function mascotImg(pose, cls) {
  return el("img", {
    class: "mascot-img " + (cls || ""),
    src: IMG_BASE + "zubr-" + pose + ".png",
    alt: "Żubr",
    draggable: "false"
  });
}

// Personnages des histoires bonus (data/stories.js) : `who` -> fichier. Table
// locale et non paramètre d'appel : qui existe est un fait du contenu, pas une
// décision du site d'appel.
// Convention de nommage : <personnage>-head.png dans public/assets/img/.
// Żubr réutilise l'image qui sert déjà d'icône PWA — même style, rien à ajouter.
// `| undefined` volontaire : `who` vient des données de contenu, non validé par
// le typeur. C'est ce qui donne son sens à la garde de characterImg — sans ça
// elle serait typée comme du code mort.
/** @type {Record<string, {file: string, alt: string}|undefined>} */
var CHARACTERS = {
  "Ż": { file: "zubr-head", alt: "Żubr" },
  B: { file: "bocian-head", alt: "Bocian" },
  O: { file: "orzel-head", alt: "Orzeł" }
};

// <img> de la tête d'un personnage, ou NULL si `who` n'en désigne pas un.
// Le `null` n'est pas un cas d'échec, c'est le mécanisme : le narrateur ("N")
// n'a pas de visage, et c'est ce retour — combiné au fait que `el()` ignore les
// enfants null — qui lui évite un avatar sans qu'aucun renderer ait à tester
// "N". Ajouter un personnage se fait donc ici, et nulle part ailleurs.
/**
 * @param {string} who
 * @param {string} [cls]
 * @returns {HTMLImageElement|null}
 */
function characterImg(who, cls) {
  var perso = CHARACTERS[who];
  if (!perso) return null;
  return el("img", {
    class: "mascot-img " + (cls || ""),
    src: IMG_BASE + perso.file + ".png",
    alt: perso.alt,
    draggable: "false"
  });
}

// <img> d'un badge (déduit du id).
/**
 * @param {string} badgeId
 * @param {string} [cls]
 * @returns {HTMLImageElement}
 */
function badgeImg(badgeId, cls) {
  return el("img", {
    class: "badge-img " + (cls || ""),
    src: IMG_BASE + "badge-" + badgeId + ".png",
    alt: "",
    draggable: "false"
  });
}

// Décor forestier (sapins, feuille) : purement cosmétique, aucune sémantique
// de personnage ou de badge — d'où une table et une fonction séparées de
// CHARACTERS/badgeImg plutôt qu'un détournement de l'une d'elles.
/** @type {Record<string, {file: string}>} */
var DECOR = {
  "sapin-1": { file: "sapin-1" },
  "sapin-2": { file: "sapin-2" },
  feuille: { file: "feuille" },
  "foret-bandeau": { file: "foret-bandeau" }
};

// <img> de décor forestier. `aria-hidden` : purement cosmétique, rien à
// annoncer à un lecteur d'écran.
/**
 * @param {"sapin-1"|"sapin-2"|"feuille"|"foret-bandeau"} name
 * @param {string} [cls]
 * @returns {HTMLImageElement}
 */
function decorImg(name, cls) {
  var deco = DECOR[name];
  return el("img", {
    class: "decor-img " + (cls || ""),
    src: IMG_BASE + deco.file + ".png",
    alt: "",
    "aria-hidden": "true",
    draggable: "false"
  });
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
    badgeImg(badge.id, "badge-emoji"),
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
    if (audioCtx.state !== "running") audioCtx.resume();
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
// Sur Android, avoir un AudioContext actif en même temps que la session audio
// du micro (SpeechRecognition) provoque un pop/grésillement à l'activation du
// micro. À appeler avant de démarrer la reconnaissance vocale ; `beep()`
// réactive le contexte au besoin, donc les bips continuent de fonctionner.
function suspendAudio() {
  if (audioCtx && audioCtx.state === "running") audioCtx.suspend();
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
  mascotImg: mascotImg,
  characterImg: characterImg,
  badgeImg: badgeImg,
  decorImg: decorImg,
  cheer: cheer,
  consoleLine: console_,
  toast: toast,
  badgeToast: badgeToast,
  levelUpToast: levelUpToast,
  confetti: confetti,
  soundCorrect: soundCorrect,
  soundWrong: soundWrong,
  suspendAudio: suspendAudio,
  ring: ring,
  formatMinSec: formatMinSec,
  pick: pick
};
