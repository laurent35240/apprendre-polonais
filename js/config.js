// @ts-check
/* =====================================================================
   CONFIG — configuration publique Firebase
   ---------------------------------------------------------------------
   Ces valeurs sont PUBLIQUES par conception (elles finissent dans le bundle
   JS servi à tout le monde) : ce sont les Security Rules Firestore qui
   protègent les données, pas le secret de cette config. Sans danger à
   committer, contrairement à une clé d'API serveur.
   ===================================================================== */

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCR4_ukSX1PHvyw2vAlITbuZI8EciRZ8ps",
  authDomain: "apprendre-polonais.firebaseapp.com",
  projectId: "apprendre-polonais",
  storageBucket: "apprendre-polonais.firebasestorage.app",
  messagingSenderId: "779249595021",
  appId: "1:779249595021:web:1d40ee3b07766adef5a8c4"
};
