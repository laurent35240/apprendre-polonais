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
     "O"  Orzeł (l'aigle)
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
            pl: "Czemu nie? Wolisz pizzę czy zapiekanka ?",
            fr: "Pourquoi pas ? Tu préfères une pizza ou des zapiekanka ?"
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
          options: ["pizzę", "dzięki", "zapiekanka"]
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
  },
  /* ======================== Sentier 3 — le foyer ======================= */
  {
    id: "story-3-wizyta",
    trailIndex: 2,
    icon: "🦅",
    title: "Wizyta u Żubra",
    titleFr: "La visite chez Żubr",
    mascotIntro:
      "Une histoire bonus ! Orzeł, un nouvel ami, vient visiter le foyer de Żubr. Lis chaque passage, écoute les voix, puis relève l'épreuve. 🦅",
    scenes: [
      /* -------------------------------- 1 ------------------------------ */
      {
        lines: [
          {
            who: "N",
            pl: "Orzeł przylatuje z gór, żeby odwiedzić Żubra w jego domu.",
            fr: "Orzeł arrive des montagnes pour visiter Żubr chez lui."
          },
          {
            who: "O",
            pl: "Cześć Żubr! Mam na imię Orzeł, miło cię poznać.",
            fr: "Salut Żubr ! Je m'appelle Orzeł, ravi de te rencontrer."
          },
          {
            who: "Ż",
            pl: "Cześć Orzeł! Bardzo mi miło. Ile masz lat?",
            fr: "Salut Orzeł ! Ravi aussi. Quel âge as-tu ?"
          },
          {
            who: "O",
            pl: "Mam osiem lat, a ty?",
            fr: "J'ai huit ans, et toi ?"
          },
          {
            who: "Ż",
            pl: "Ja mam dziesięć lat. Wejdź, proszę!",
            fr: "Moi j'ai dix ans. Entre, je t'en prie !"
          }
        ],
        step: {
          kind: "quiz",
          id: "st-3-q1",
          question: "Ile lat ma Orzeł?",
          questionFr: "Quel âge a Orzeł ?",
          options: ["dziesięć lat", "osiem lat", "dwadzieścia lat"],
          answers: ["osiem lat"]
        }
      },
      /* -------------------------------- 2 ------------------------------ */
      {
        lines: [
          {
            who: "N",
            pl: "Żubr zaprasza Orła do domu.",
            fr: "Żubr invite Orzeł à entrer."
          },
          {
            who: "O",
            pl: "Jaki ładny dom! Co robicie rano?",
            fr: "Quelle belle maison ! Que faites-vous le matin ?"
          },
          {
            who: "Ż",
            pl: "Zwykle wstajemy bardzo wcześnie.",
            fr: "D'habitude, on se lève très tôt."
          }
          /* La phrase de l'épreuve ci-dessous n'apparaît pas ici : elle
             continue naturellement la scène plutôt que de la répéter. */
        ],
        step: {
          kind: "build",
          id: "st-3-b1",
          who: "Ż",
          pl: "Jemy śniadanie w kuchni.",
          fr: "Nous prenons le petit-déjeuner dans la cuisine.",
          wordBank: ["Jemy", "śniadanie", "w", "kuchni", "łazience"]
        }
      },
      /* -------------------------------- 3 ------------------------------ */
      {
        lines: [
          {
            who: "N",
            pl: "Po śniadaniu Orzeł pyta o plany na dzień.",
            fr: "Après le petit-déjeuner, Orzeł demande les plans du jour."
          },
          {
            who: "O",
            pl: "Co robisz w tym tygodniu?",
            fr: "Que fais-tu cette semaine ?"
          },
          {
            who: "Ż",
            pl: "Mam dużo pracy, więc muszę być w biurze rano.",
            fr: "J'ai beaucoup de travail, donc je dois être au bureau le matin."
          }
          /* « muszę » est déjà entendu ici, mais pas la phrase complète du
             trou ci-dessous : l'épreuve reste une vraie épreuve. */
        ],
        step: {
          kind: "gap",
          id: "st-3-gap1",
          who: "Ż",
          sentence: "Dzisiaj _____ skończyć pracę wcześnie.",
          // Le trou est gardé côté français AUSSI, même règle que st-2-gap1.
          fr: "Aujourd'hui, je _____ finir le travail tôt.",
          answer: "muszę",
          options: ["muszę", "chcę", "umiem"]
        }
      },
      /* -------------------------------- 4 ------------------------------ */
      {
        lines: [
          {
            who: "N",
            pl: "Orzeł zauważa zwierzęta domowe Żubra.",
            fr: "Orzeł remarque les animaux de compagnie de Żubr."
          },
          {
            who: "O",
            pl: "Jakie masz zwierzęta?",
            fr: "Quels animaux as-tu ?"
          },
          {
            who: "Ż",
            pl: "Mam psa i kota. Kota nazywam Mruczek, a psa Reksio.",
            fr: "J'ai un chien et un chat. J'appelle le chat Mruczek, et le chien Reksio."
          },
          {
            who: "O",
            pl: "Czy głaskasz je codziennie?",
            fr: "Tu les caresses tous les jours ?"
          },
          {
            who: "Ż",
            pl: "Tak, i karmię je rano.",
            fr: "Oui, et je les nourris le matin."
          }
        ],
        step: {
          kind: "quiz",
          id: "st-3-q2",
          question: "Jakie zwierzęta ma Żubr?",
          questionFr: "Quels animaux Żubr a-t-il ?",
          options: ["pies", "kot", "chomik", "rybka"],
          answers: ["pies", "kot"]
        }
      },
      /* -------------------------------- 5 ------------------------------ */
      {
        lines: [
          {
            who: "N",
            pl: "Zbliża się wieczór, Orzeł musi wracać do gór.",
            fr: "Le soir approche, Orzeł doit rentrer dans les montagnes."
          },
          {
            who: "O",
            pl: "Która jest godzina?",
            fr: "Quelle heure est-il ?"
          },
          {
            who: "Ż",
            pl: "Jest już wieczór, szósta godzina.",
            fr: "C'est déjà le soir, six heures."
          },
          {
            who: "O",
            pl: "Muszę już iść. Do zobaczenia w sobotę!",
            fr: "Je dois y aller. À samedi !"
          },
          {
            who: "Ż",
            pl: "Do zobaczenia! Miłego wieczoru.",
            fr: "À bientôt ! Bonne soirée."
          }
        ],
        step: {
          kind: "match",
          id: "st-3-match1",
          pairs: [
            { pl: "rano", fr: "le matin" },
            { pl: "wieczorem", fr: "le soir" },
            { pl: "sobota", fr: "samedi" },
            { pl: "do zobaczenia", fr: "à bientôt" },
            { pl: "godzina", fr: "l'heure" }
          ]
        }
      }
    ]
  }
];
