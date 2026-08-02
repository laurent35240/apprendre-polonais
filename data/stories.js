// @ts-check
/* =====================================================================
   HISTOIRES BONUS — un « niveau bonus » par sentier
   ---------------------------------------------------------------------
   Format imaginé sur papier : un court récit dialogué découpé en SCÈNES.
   Chaque scène = quelques répliques, puis UNE épreuve qui porte sur ce qui
   vient d'être lu. On avance dans l'histoire en réussissant les épreuves.

   Une histoire n'est PAS une leçon (cf. CLAUDE.md § Histoires bonus) :
   - elle n'a pas d'`order` et n'entre pas dans la chaîne de déverrouillage,
     donc elle ne bloque jamais l'accès au sentier suivant ;
   - elle est rattachée à un sentier par `trailIndex` (0-based, index dans
     le tableau TRAILS de js/app.js) et se débloque quand les 5 leçons de ce
     sentier sont terminées ;
   - ses ids ne sont PAS des clés SRS : rien n'est planifié en révision.

   `who` sur une réplique :
     "Ż"  Żubr (le bison, la mascotte)
     "B"  Bocian (la cigogne)
     "N"  le narrateur

   Les 4 sortes d'épreuves (`step.kind`) :
     quiz   question à choix multiple, 1 OU 2 bonnes réponses (`answers`)
     build  reconstituer une réplique depuis des tuiles de mots
     gap    choisir le mot manquant d'une phrase parmi des tuiles
     match  relier des mots polonais à leur traduction française
   ===================================================================== */

/** @type {Story[]} */
export const POLISH_STORIES = [
  /* ====================== Sentier 2 — le quotidien ==================== */
  {
    id: "story-2-restauracja",
    trailIndex: 1,
    icon: "🍽️",
    title: "Spotkanie w restauracji",
    titleFr: "Rencontre au restaurant",
    mascotIntro:
      "Une histoire bonus ! Żubr s'installe dans un restaurant et fait une rencontre. Lis chaque passage, écoute les voix, puis relève l'épreuve. 🍽️",
    scenes: [
      /* -------------------------------- 1 ------------------------------ */
      {
        lines: [
          {
            who: "Ż",
            pl: "Jaka fajna restauracja! Może kogoś poznam.",
            fr: "Quel chouette restaurant ! Peut-être que je vais rencontrer quelqu'un."
          },
          {
            who: "B",
            pl: "Czy mogę się dosiąść?",
            fr: "Est-ce que je peux m'asseoir avec toi ?"
          },
          {
            who: "Ż",
            pl: "Oczywiście! A jak się nazywasz?",
            fr: "Bien sûr ! Et comment t'appelles-tu ?"
          },
          {
            who: "B",
            pl: "Dzięki! Nazywam się Bocian.",
            fr: "Merci ! Je m'appelle Bocian."
          }
        ],
        step: {
          kind: "quiz",
          id: "st-2-q1",
          question: "Co się stało?",
          questionFr: "Que s'est-il passé ?",
          options: [
            "Żubr poszedł do kina.",
            "Żubr poznał nową osobę.",
            "Żubr chce być sam."
          ],
          answers: ["Żubr poznał nową osobę."]
        }
      },
      /* -------------------------------- 2 ------------------------------ */
      {
        lines: [
          {
            who: "Ż",
            pl: "Zjemy coś razem?",
            fr: "On mange quelque chose ensemble ?"
          },
          {
            who: "B",
            pl: "Tak! A ty, jak się nazywasz?",
            fr: "Oui ! Et toi, comment t'appelles-tu ?"
          }
        ],
        step: {
          kind: "build",
          id: "st-2-b1",
          who: "Ż",
          pl: "Nazywam się Żubr i mam dziesięć lat.",
          fr: "Je m'appelle Żubr et j'ai dix ans.",
          wordBank: ["nazywam", "się", "Żubr", "i", "mam", "dziesięć", "lat"]
        }
      },
      /* -------------------------------- 3 ------------------------------ */
      {
        lines: [
          {
            who: "B",
            pl: "Zamówimy coś?",
            fr: "On commande quelque chose ?"
          },
          {
            who: "Ż",
            pl: "Czemu nie? Wolisz pizzę czy lasagne?",
            fr: "Pourquoi pas ? Tu préfères une pizza ou des lasagnes ?"
          }
          /* La scène s'arrête ici, sur la question : c'est l'épreuve ci-dessous
             qui porte la réponse de Bocian. Ne pas ajouter de réplique
             intermédiaire — le trou EST sa réponse. */
        ],
        step: {
          kind: "gap",
          id: "st-2-gap1",
          who: "B",
          sentence: "Chętnie wezmę _____, dzięki.",
          // Le trou est gardé côté français AUSSI : « une pizza » ici donnerait
          // la réponse et l'épreuve n'en serait plus une.
          fr: "Je prendrai volontiers _____, merci.",
          answer: "pizzę",
          options: ["pizzę", "dzięki", "lasagne"]
        }
      },
      /* -------------------------------- 4 ------------------------------ */
      {
        lines: [
          {
            who: "N",
            pl: "Zamawiają i gadają.",
            fr: "Ils commandent et bavardent."
          },
          {
            who: "Ż",
            pl: "Skąd pochodzisz?",
            fr: "D'où viens-tu ?"
          },
          {
            who: "B",
            pl: "Jestem z Polski, a ty?",
            fr: "Je viens de Pologne, et toi ?"
          },
          {
            who: "Ż",
            pl: "Ja też jestem z Polski.",
            fr: "Moi aussi je viens de Pologne."
          }
        ],
        step: {
          kind: "quiz",
          id: "st-2-q2",
          question: "Które dwa zdania są prawdziwe?",
          questionFr: "Quelles deux phrases sont vraies ?",
          options: [
            "Bocian jest Polakiem.",
            "Żubr jest Francuzem.",
            "Bocian ma psa.",
            "Oboje pochodzą z tego samego kraju."
          ],
          answers: [
            "Bocian jest Polakiem.",
            "Oboje pochodzą z tego samego kraju."
          ]
        }
      },
      /* -------------------------------- 5 ------------------------------ */
      {
        lines: [
          {
            who: "N",
            pl: "Przychodzą dania. Jedzą.",
            fr: "Les plats arrivent. Ils mangent."
          },
          {
            who: "B",
            pl: "Muszę już iść. Do zobaczenia!",
            fr: "Je dois déjà partir. À bientôt !"
          },
          {
            who: "Ż",
            pl: "Cześć!",
            fr: "Salut !"
          }
        ],
        step: {
          kind: "match",
          id: "st-2-match1",
          pairs: [
            { pl: "Bocian", fr: "la cigogne" },
            { pl: "Restauracja", fr: "le restaurant" },
            { pl: "Do zobaczenia", fr: "au revoir" },
            { pl: "Jestem z…", fr: "je viens de…" },
            { pl: "Nazywam się…", fr: "je m'appelle…" }
          ]
        }
      }
    ]
  }
];
