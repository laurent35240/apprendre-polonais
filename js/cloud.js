// @ts-check
/* =====================================================================
   CLOUD — synchronisation multi-appareils (palier 4)
   ---------------------------------------------------------------------
   Position dans le DAG : après progress.js (`… → gamification → progress →
   cloud → exercises → …`) — Cloud a besoin de State/Progress, jamais
   l'inverse. Comme progress.js, ce module N'IMPORTE PAS ui.js : il renvoie
   des faits, app.js décide des toasts.

   La correction, ici, vient de State._merge (idempotent) ET de la garde
   ajoutée à Progress.cloudMerged (ne touche/flush QUE si la fusion a
   réellement changé quelque chose) : un écho Firestore ne déclenche jamais
   de nouvelle écriture, donc jamais de nouveau push — la boucle
   push→pull→push s'arrête d'elle-même. Le `writerId` + la fenêtre de grâce
   ci-dessous ne sont qu'une optimisation d'EFFICACITÉ (éviter un aller-retour
   réseau et un recalcul inutiles) : leur absence ne casserait rien.
   ===================================================================== */
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut as firebaseSignOut
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  serverTimestamp
} from "firebase/firestore";
import { State } from "./state.js";
import { Progress } from "./progress.js";

// Mémorise l'e-mail localement entre l'envoi du lien et son ouverture : requis
// par Firebase pour compléter la connexion, même quand le lien est ouvert sur
// le MÊME appareil/navigateur. Clé distincte de State.STORAGE_KEY : ce n'est
// pas de la progression, juste un jeton de flux d'auth éphémère.
var PENDING_EMAIL_KEY = "polski-zubr-pending-email";

// Throttle réseau séparé du throttle localStorage (state.js: 3 s) : un
// setDoc Firestore n'est pas gratuit comme un setItem. Même discipline —
// jamais réarmé — pour la même raison : borner le volume plutôt que
// simplement grouper les rafales.
var CLOUD_PUSH_WINDOW_MS = 30000;

// Fenêtre pendant laquelle un événement Firestore reçu juste après NOTRE
// PROPRE push est ignoré sans même appeler merge — l'écho direct de
// l'écriture qu'on vient de faire. Purement une économie de calcul/réseau
// (cf. commentaire d'en-tête) : 5 s couvre largement la latence d'écho
// observée en pratique.
var ECHO_GRACE_MS = 5000;

// Identifiant d'onglet, généré une fois par chargement de page : permet à
// chaque appareil de reconnaître SA PROPRE écriture dans l'écoute temps réel.
var writerId =
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : "w-" + Math.random().toString(36).slice(2) + Date.now().toString(36);

/** @type {import("firebase/app").FirebaseApp|null} */
var app = null;
/** @type {import("firebase/auth").Auth|null} */
var auth = null;
/** @type {import("firebase/firestore").Firestore|null} */
var db = null;
/** @type {{uid: string, email: string|null}|null} */
var currentUser = null;
/** @type {(() => void)|null} */
var unsubscribeSnapshot = null;
/** @type {ReturnType<typeof setTimeout>|null} */
var pushTimer = null;
/** @type {number|null} */
var lastPushAt = null;
/** @type {number|null} */
var lastPullAt = null;
/** @type {string|null} */
var lastError = null;

/**
 * @param {import("firebase/app").FirebaseOptions} firebaseConfig
 * @returns {void}
 */
function init(firebaseConfig) {
  // Idempotent : un double appel (ex. re-render qui rappellerait boot) ne
  // recrée pas une seconde app Firebase.
  if (app) return;
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  onAuthStateChanged(auth, function (user) {
    currentUser = user ? { uid: user.uid, email: user.email } : null;
  });
}

/** @returns {import("firebase/auth").Auth} @throws {Error} si init() n'a pas tourné. */
function requireAuth() {
  if (!auth) throw new Error("Cloud.init() n'a pas été appelé.");
  return auth;
}

/**
 * Envoie un lien de connexion à l'adresse donnée.
 * @param {string} email
 * @returns {Promise<void>}
 */
async function sendMagicLink(email) {
  var a = requireAuth();
  /** @type {import("firebase/auth").ActionCodeSettings} */
  var actionCodeSettings = { url: window.location.href, handleCodeInApp: true };
  await sendSignInLinkToEmail(a, email, actionCodeSettings);
  localStorage.setItem(PENDING_EMAIL_KEY, email);
}

/**
 * Résout une fois l'état d'authentification INITIAL déterminé (session
 * persistée relue depuis IndexedDB). À attendre avant de lire isSignedIn()
 * au boot : `onAuthStateChanged` (dans init()) est asynchrone, donc sans ce
 * garde-fou, un utilisateur déjà connecté lors d'une précédente visite
 * semblerait déconnecté jusqu'à ce que ce callback ait fini de s'exécuter.
 * @returns {Promise<void>}
 */
async function ready() {
  var a = requireAuth();
  await a.authStateReady();
}

/**
 * À appeler au boot, avant tout rendu : détecte si l'URL courante EST un
 * lien magique, et termine la connexion si oui. No-op silencieux sinon —
 * c'est le cas de loin le plus fréquent (chaque chargement normal de l'app).
 * @returns {Promise<{uid: string, email: string|null}|null>}
 */
async function completeSignInFromUrl() {
  var a = requireAuth();
  if (!isSignInWithEmailLink(a, window.location.href)) return null;
  var email = localStorage.getItem(PENDING_EMAIL_KEY);
  if (!email) {
    // Lien ouvert sur un AUTRE appareil/navigateur que celui où il a été
    // demandé : Firebase autorise ce cas en redemandant l'e-mail plutôt
    // qu'en refusant la connexion.
    email = window.prompt("Confirme ton e-mail pour terminer la connexion :");
  }
  if (!email) return null;
  var result = await signInWithEmailLink(a, email, window.location.href);
  localStorage.removeItem(PENDING_EMAIL_KEY);
  // Nettoie l'URL : sinon le paramètre de lien magique reste visible, et un
  // rechargement retenterait une connexion déjà consommée (Firebase la
  // rejette, mais autant ne pas laisser un lien à un seul usage dans l'URL).
  window.history.replaceState(null, "", window.location.pathname);
  currentUser = { uid: result.user.uid, email: result.user.email };
  return currentUser;
}

/**
 * Déconnexion. Arrête la synchro mais NE TOUCHE PAS à l'état local :
 * l'utilisateur garde sa progression hors-ligne.
 * @returns {Promise<void>}
 */
async function signOut() {
  stopSync();
  if (!auth) return;
  await firebaseSignOut(auth);
  currentUser = null;
}

/** @returns {boolean} */
function isSignedIn() {
  return currentUser !== null;
}

/** @returns {{uid: string, email: string|null}|null} */
function getCurrentUser() {
  return currentUser;
}

/**
 * Écrit l'état local vers Firestore. No-op silencieux si non connecté, sans
 * base, ou en lecture seule (même garde que save() local — rien ne doit
 * partir vers Firestore non plus quand la sauvegarde vient du futur).
 * @returns {Promise<void>}
 */
async function push() {
  var user = currentUser;
  if (!user || !db) return;
  if (State.status().mode === "readonly") return;
  await setDoc(doc(db, "progress", user.uid), {
    state: State.get(),
    writerId: writerId,
    updatedAt: serverTimestamp()
  });
  lastPushAt = Date.now();
  lastError = null;
}

/** Programme un push, jamais réarmé (throttle, cf. commentaire d'en-tête). */
function schedulePush() {
  if (!isSignedIn() || pushTimer) return;
  pushTimer = setTimeout(function () {
    pushTimer = null;
    push().catch(function (e) {
      lastError = String(e);
      console.warn("Push cloud impossible.", e);
    });
  }, CLOUD_PUSH_WINDOW_MS);
}

/**
 * Lit le document distant et le fusionne dans l'état local (State._merge via
 * Progress.cloudMerged). Ne PUSH pas elle-même : si la fusion a changé
 * quelque chose, elle flush() → save() → onSaved() → schedulePush() —
 * le résultat fusionné republie tout seul, via le même chemin qu'une
 * mutation locale normale.
 * @returns {Promise<{merged: boolean, repairs: string[]}>}
 */
async function pull() {
  var user = currentUser;
  if (!user || !db) return { merged: false, repairs: [] };
  var snap = await getDoc(doc(db, "progress", user.uid));
  lastPullAt = Date.now();
  if (!snap.exists()) return { merged: false, repairs: [] };
  /** @type {CloudProgressDoc} */
  var data = /** @type {any} */ (snap.data());
  var r = Progress.cloudMerged(JSON.stringify(data.state));
  return { merged: true, repairs: r.repairs };
}

/**
 * Démarre l'écoute temps réel du document distant, et s'abonne à chaque
 * écriture locale réussie pour la répercuter (débouncée) vers Firestore.
 * Idempotent : un second appel sans stopSync() entre les deux est un no-op.
 * @returns {void}
 */
function startSync() {
  var user = currentUser;
  if (!user || !db || unsubscribeSnapshot) return;
  unsubscribeSnapshot = onSnapshot(
    doc(db, "progress", user.uid),
    function (snap) {
      if (!snap.exists()) return;
      /** @type {CloudProgressDoc} */
      var data = /** @type {any} */ (snap.data());
      // Anti-écho : purement une économie (cf. en-tête du fichier) — sans
      // cette garde, fusionner son propre état avec lui-même serait déjà un
      // no-op inoffensif grâce à l'idempotence de State._merge.
      if (data.writerId === writerId) return;
      if (lastPushAt !== null && Date.now() - lastPushAt < ECHO_GRACE_MS) return;
      try {
        Progress.cloudMerged(JSON.stringify(data.state));
      } catch (e) {
        lastError = String(e);
        console.warn("Fusion d'une mise à jour distante impossible.", e);
      }
    },
    function (e) {
      lastError = String(e);
      console.warn("Écoute Firestore interrompue.", e);
    }
  );
  State.onSaved(schedulePush);
}

/** Arrête l'écoute temps réel et annule un push en attente. @returns {void} */
function stopSync() {
  if (unsubscribeSnapshot) {
    unsubscribeSnapshot();
    unsubscribeSnapshot = null;
  }
  if (pushTimer) {
    clearTimeout(pushTimer);
    pushTimer = null;
  }
}

/**
 * @returns {{connected: boolean, lastPushAt: number|null, lastPullAt: number|null, lastError: string|null}}
 */
function getStatus() {
  return {
    connected: isSignedIn(),
    lastPushAt: lastPushAt,
    lastPullAt: lastPullAt,
    lastError: lastError
  };
}

export const Cloud = {
  init: init,
  sendMagicLink: sendMagicLink,
  ready: ready,
  completeSignInFromUrl: completeSignInFromUrl,
  signOut: signOut,
  isSignedIn: isSignedIn,
  currentUser: getCurrentUser,
  push: push,
  pull: pull,
  startSync: startSync,
  stopSync: stopSync,
  status: getStatus
};
