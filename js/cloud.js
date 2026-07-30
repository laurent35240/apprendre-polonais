// @ts-check
/* =====================================================================
   CLOUD — synchronisation multi-appareils (palier 4)
   ---------------------------------------------------------------------
   Ce commit ne couvre que l'authentification par lien magique — pas encore
   de push/pull Firestore (viendra dans un commit séparé, vérifiable
   indépendamment). Position dans le DAG : après progress.js (`… →
   gamification → progress → cloud → exercises → …`) — Cloud a besoin de
   State/Progress, jamais l'inverse.

   Comme progress.js, ce module N'IMPORTE PAS ui.js : il renvoie des faits,
   app.js décide des toasts. C'est ce qui le rend testable sans DOM pour sa
   partie pure, et ce qui évite un cycle (cloud est déjà en aval de tout).
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

// Mémorise l'e-mail localement entre l'envoi du lien et son ouverture : requis
// par Firebase pour compléter la connexion, même quand le lien est ouvert sur
// le MÊME appareil/navigateur. Clé distincte de State.STORAGE_KEY : ce n'est
// pas de la progression, juste un jeton de flux d'auth éphémère.
var PENDING_EMAIL_KEY = "polski-zubr-pending-email";

/** @type {import("firebase/app").FirebaseApp|null} */
var app = null;
/** @type {import("firebase/auth").Auth|null} */
var auth = null;
/** @type {{uid: string, email: string|null}|null} */
var currentUser = null;

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
 * Déconnexion. Arrête la synchro (à partir du commit push/pull) mais NE
 * TOUCHE PAS à l'état local : l'utilisateur garde sa progression hors-ligne.
 * @returns {Promise<void>}
 */
async function signOut() {
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

export const Cloud = {
  init: init,
  sendMagicLink: sendMagicLink,
  completeSignInFromUrl: completeSignInFromUrl,
  signOut: signOut,
  isSignedIn: isSignedIn,
  currentUser: getCurrentUser
};
