// @ts-check
/* =====================================================================
   CONTENU DES LEÇONS — Français → Polonais (style Assimil)
   ---------------------------------------------------------------------
   ⚠️  À RELIRE (idéalement avec une personne polonophone).
   Pour AJOUTER une leçon : copie un bloc { ... } et incrémente `order`.
   Pour CORRIGER : édite le texte, les champs `pl` / `fr`. Aucun code à toucher.

   Schéma d'un item :
     id            identifiant unique (sert au suivi de progression)
     pl            polonais
     fr            français
     ipa           (optionnel) aide de prononciation
     example       (optionnel) { pl, fr }
   ===================================================================== */

/** @type {Lesson[]} */
export const POLISH_LESSONS = [
  /* ================================ 1 ================================ */
  {
    id: "lesson-01",
    order: 1,
    title: "Cześć ! Les premiers mots",
    theme: "salutations",
    mascotIntro:
      "Żubr le bison te souhaite la bienvenue ! On commence tout doux : dire bonjour sans se mordre la langue. 🦬",
    grammarNotes: [
      {
        id: "g-01-1",
        title: "Pas d'articles en polonais",
        explanationFr:
          "Bonne nouvelle : le polonais n'a NI « le/la/les » NI « un/une ». « kot » veut dire aussi bien « un chat » que « le chat ». Un souci de moins !",
        examples: [
          { pl: "kot", fr: "un chat / le chat", note: "aucun article" },
          { pl: "dom", fr: "une maison / la maison" }
        ]
      },
      {
        id: "g-01-2",
        title: "Les sons qui piquent : cz, sz, ć, ś",
        explanationFr:
          "cz = « tch » (dur), ć/ci = « tch » (mou, mouillé). sz = « ch » (dur), ś/si = « ch » (mou). Le « ł » se prononce comme le « w » anglais (well).",
        examples: [
          { pl: "cześć", fr: "salut", note: "≈ « tchechtch »" },
          { pl: "dobrze", fr: "bien", note: "« rz » ≈ « j » de jour" }
        ]
      }
    ],
    vocabulary: [
      { id: "v-01-czesc", pl: "cześć", fr: "salut", ipa: "tchèchtch", category: "salutation",
        example: { pl: "Cześć, jak się masz?", fr: "Salut, comment vas-tu ?" } },
      { id: "v-01-dziendobry", pl: "dzień dobry", fr: "bonjour", ipa: "djègne dobri", category: "salutation" },
      { id: "v-01-dobrywieczor", pl: "dobry wieczór", fr: "bonsoir", category: "salutation" },
      { id: "v-01-dobranoc", pl: "dobranoc", fr: "bonne nuit", category: "salutation" },
      { id: "v-01-dowidzenia", pl: "do widzenia", fr: "au revoir", category: "salutation" },
      { id: "v-01-tak", pl: "tak", fr: "oui", category: "base" },
      { id: "v-01-nie", pl: "nie", fr: "non", category: "base" },
      { id: "v-01-dziekuje", pl: "dziękuję", fr: "merci", ipa: "djènkouyè", category: "politesse" },
      { id: "v-01-prosze", pl: "proszę", fr: "s'il te/vous plaît / je t'en prie", category: "politesse" },
      { id: "v-01-przepraszam", pl: "przepraszam", fr: "pardon / excuse-moi", category: "politesse" }
    ],
    sentences: [
      { id: "s-01-1", pl: "Cześć, jak się masz?", fr: "Salut, comment vas-tu ?", grammarFocus: "g-01-2",
        wordBank: ["Cześć", "jak", "się", "masz"] },
      { id: "s-01-2", pl: "Dzień dobry, dziękuję.", fr: "Bonjour, merci.", grammarFocus: "g-01-1",
        wordBank: ["Dzień", "dobry", "dziękuję"] },
      { id: "s-01-3", pl: "Tak, proszę.", fr: "Oui, s'il te plaît.", grammarFocus: "g-01-1",
        wordBank: ["Tak", "proszę"] },
      { id: "s-01-4", pl: "Przepraszam, do widzenia.", fr: "Pardon, au revoir.", grammarFocus: "g-01-2",
        wordBank: ["Przepraszam", "do", "widzenia"] }
    ]
  },

  /* ================================ 2 ================================ */
  {
    id: "lesson-02",
    order: 2,
    title: "Se présenter — le verbe być (être)",
    theme: "présentation",
    mascotIntro:
      "« Qui es-tu, humain ? » demande Żubr. Aujourd'hui : dire qui on est. Spoiler : le verbe « być » va devenir ton meilleur ami.",
    grammarNotes: [
      {
        id: "g-02-1",
        title: "Le verbe być (être) au présent",
        explanationFr:
          "ja jestem (je suis), ty jesteś (tu es), on/ona jest (il/elle est), my jesteśmy (nous sommes), wy jesteście (vous êtes), oni/one są (ils/elles sont).",
        examples: [
          { pl: "Jestem Francuzem.", fr: "Je suis français.", note: "homme" },
          { pl: "Jestem Francuzką.", fr: "Je suis française.", note: "femme" }
        ]
      },
      {
        id: "g-02-2",
        title: "On omet souvent le pronom",
        explanationFr:
          "La terminaison du verbe indique déjà la personne, donc « ja », « ty »… sont souvent omis. « Jestem » suffit pour dire « je suis ».",
        examples: [
          { pl: "Nazywam się Laurent.", fr: "Je m'appelle Laurent." },
          { pl: "Mam trzydzieści lat.", fr: "J'ai trente ans." }
        ]
      }
    ],
    vocabulary: [
      { id: "v-02-jestem", pl: "jestem", fr: "je suis", category: "verbe" },
      { id: "v-02-jestes", pl: "jesteś", fr: "tu es", category: "verbe" },
      { id: "v-02-jest", pl: "jest", fr: "il/elle est", category: "verbe" },
      { id: "v-02-nazywamsie", pl: "nazywam się", fr: "je m'appelle", category: "présentation" },
      { id: "v-02-jakmaszimie", pl: "Jak masz na imię?", fr: "Comment t'appelles-tu ?", category: "présentation" },
      { id: "v-02-milomi", pl: "miło mi", fr: "enchanté(e)", category: "présentation" },
      { id: "v-02-skadjestes", pl: "Skąd jesteś?", fr: "D'où viens-tu ?", category: "présentation" },
      { id: "v-02-francja", pl: "Francja", fr: "la France", category: "pays" },
      { id: "v-02-polska", pl: "Polska", fr: "la Pologne", category: "pays" },
      { id: "v-02-mowie", pl: "mówię", fr: "je parle", category: "verbe",
        example: { pl: "Mówię trochę po polsku.", fr: "Je parle un peu polonais." } }
    ],
    sentences: [
      { id: "s-02-1", pl: "Cześć, jestem Laurent.", fr: "Salut, je suis Laurent.", grammarFocus: "g-02-1",
        wordBank: ["Cześć", "jestem", "Laurent"] },
      { id: "s-02-2", pl: "Jak masz na imię?", fr: "Comment t'appelles-tu ?", grammarFocus: "g-02-2",
        wordBank: ["Jak", "masz", "na", "imię"] },
      { id: "s-02-3", pl: "Miło mi, jestem z Francji.", fr: "Enchanté, je viens de France.", grammarFocus: "g-02-1",
        wordBank: ["Miło", "mi", "jestem", "z", "Francji"] },
      { id: "s-02-4", pl: "Mówię trochę po polsku.", fr: "Je parle un peu polonais.", grammarFocus: "g-02-2",
        wordBank: ["Mówię", "trochę", "po", "polsku"] }
    ]
  },

  /* ======================= order 3 — Pays et nationalités ============ */
  {
    id: "lesson-51",
    order: 3,
    title: "Les pays et les nationalités",
    theme: "pays",
    mascotIntro:
      "Żubr est né en Pologne, mais il a des amis dans plein de pays. D'où viens-tu, toi ? 🌍",
    grammarNotes: [
      {
        id: "g-51-1",
        title: "D'où viens-tu ? « z » + le pays",
        explanationFr:
          "« Skąd jesteś? » (d'où viens-tu ?) se répond avec « z » + le pays dans une forme spéciale : z Polski, z Francji, z Niemiec, z Włoch. Retiens ces formes telles quelles pour l'instant — la règle complète (le génitif) est expliquée plus loin dans le parcours.",
        examples: [
          { pl: "Jestem z Polski.", fr: "Je viens de Pologne." },
          { pl: "Ona jest z Niemiec.", fr: "Elle vient d'Allemagne." }
        ]
      },
      {
        id: "g-51-2",
        title: "La nationalité s'accorde en genre",
        explanationFr:
          "Le nom de nationalité change selon qu'on parle d'un homme ou d'une femme : Polak/Polka, Niemiec/Niemka, Włoch/Włoszka, Amerykanin/Amerykanka (et Francuz/Francuzka, déjà vu).",
        examples: [
          { pl: "Mój kolega jest Włochem.", fr: "Mon copain est italien.", note: "Włoch → Włochem" },
          { pl: "Moja siostra jest Amerykanką.", fr: "Ma sœur est américaine.", note: "Amerykanka → Amerykanką" }
        ]
      }
    ],
    vocabulary: [
      { id: "v-51-niemcy", pl: "Niemcy", fr: "l'Allemagne", category: "pays" },
      { id: "v-51-wlochy", pl: "Włochy", fr: "l'Italie", category: "pays" },
      { id: "v-51-hiszpania", pl: "Hiszpania", fr: "l'Espagne", category: "pays" },
      { id: "v-51-anglia", pl: "Anglia", fr: "l'Angleterre", category: "pays" },
      { id: "v-51-stanyzjednoczone", pl: "Stany Zjednoczone", fr: "les États-Unis", category: "pays" },
      { id: "v-51-polak", pl: "Polak", fr: "le Polonais", category: "nationalité" },
      { id: "v-51-polka", pl: "Polka", fr: "la Polonaise", category: "nationalité" },
      { id: "v-51-niemiec", pl: "Niemiec", fr: "l'Allemand", category: "nationalité" },
      { id: "v-51-niemka", pl: "Niemka", fr: "l'Allemande", category: "nationalité" },
      { id: "v-51-wloch", pl: "Włoch", fr: "l'Italien", category: "nationalité" },
      { id: "v-51-wloszka", pl: "Włoszka", fr: "l'Italienne", category: "nationalité" },
      { id: "v-51-amerykanin", pl: "Amerykanin", fr: "l'Américain", category: "nationalité" }
    ],
    sentences: [
      { id: "s-51-1", pl: "Jestem z Polski.", fr: "Je viens de Pologne.", grammarFocus: "g-51-1",
        wordBank: ["Jestem", "z", "Polski", "Polska"] },
      { id: "s-51-2", pl: "Ona jest z Niemiec.", fr: "Elle vient d'Allemagne.", grammarFocus: "g-51-1",
        wordBank: ["Ona", "jest", "z", "Niemiec", "Niemcy"] },
      { id: "s-51-3", pl: "Mój kolega jest Włochem.", fr: "Mon copain est italien.", grammarFocus: "g-51-2",
        wordBank: ["Mój", "kolega", "jest", "Włochem", "Włoch"] },
      { id: "s-51-4", pl: "Moja siostra jest Amerykanką.", fr: "Ma sœur est américaine.", grammarFocus: "g-51-2",
        wordBank: ["Moja", "siostra", "jest", "Amerykanką", "Amerykanin"] }
    ],
    dialogues: [
      {
        id: "d-51-1",
        title: "D'où viens-tu ?",
        lines: [
          { who: "A", pl: "Skąd jesteś?", fr: "D'où viens-tu ?" },
          { who: "B", pl: "Jestem z Niemiec.", fr: "Je viens d'Allemagne." },
          { who: "A", pl: "Czy jesteś Niemcem?", fr: "Es-tu allemand ?" },
          { who: "B", pl: "Tak, jestem Niemcem.", fr: "Oui, je suis allemand.",
            target: true, wordBank: ["Tak", "jestem", "Niemcem", "Niemiec"] }
        ]
      }
    ]
  },

  /* ================================ 3 ================================ */
  {
    id: "lesson-03",
    order: 4,
    title: "La famille — rodzina",
    theme: "famille",
    mascotIntro:
      "Żubr adore sa grande famille de bisons. Présente-lui la tienne : mama, tata, et toute la tribu !",
    grammarNotes: [
      {
        id: "g-03-1",
        title: "Les possessifs mój / moja / moje",
        explanationFr:
          "L'adjectif possessif s'accorde avec le genre du mot : mój (masculin), moja (féminin), moje (neutre). Ex : mój brat, moja siostra.",
        examples: [
          { pl: "mój brat", fr: "mon frère", note: "masculin → mój" },
          { pl: "moja siostra", fr: "ma sœur", note: "féminin → moja" }
        ]
      },
      {
        id: "g-03-2",
        title: "Genre des noms : le nerf de la guerre",
        explanationFr:
          "En général : consonne finale → masculin (brat), -a final → féminin (mama, siostra), -o/-e final → neutre (dziecko). Ça guide tout le reste !",
        examples: [
          { pl: "tata", fr: "papa", note: "en -a mais… masculin (exception !)" },
          { pl: "dziecko", fr: "enfant", note: "neutre" }
        ]
      }
    ],
    vocabulary: [
      { id: "v-03-rodzina", pl: "rodzina", fr: "la famille", category: "famille" },
      { id: "v-03-mama", pl: "mama", fr: "maman", category: "famille" },
      { id: "v-03-tata", pl: "tata", fr: "papa", category: "famille" },
      { id: "v-03-brat", pl: "brat", fr: "le frère", category: "famille" },
      { id: "v-03-siostra", pl: "siostra", fr: "la sœur", category: "famille" },
      { id: "v-03-syn", pl: "syn", fr: "le fils", category: "famille" },
      { id: "v-03-corka", pl: "córka", fr: "la fille (enfant)", category: "famille" },
      { id: "v-03-dziecko", pl: "dziecko", fr: "l'enfant", category: "famille" },
      { id: "v-03-zona", pl: "żona", fr: "l'épouse", category: "famille" },
      { id: "v-03-maz", pl: "mąż", fr: "le mari", category: "famille" },
      { id: "v-03-babcia", pl: "babcia", fr: "la grand-mère", category: "famille" },
      { id: "v-03-dziadek", pl: "dziadek", fr: "le grand-père", category: "famille" }
    ],
    sentences: [
      { id: "s-03-1", pl: "To jest moja rodzina.", fr: "Voici ma famille.", grammarFocus: "g-03-1",
        wordBank: ["To", "jest", "moja", "rodzina"] },
      { id: "s-03-2", pl: "Mój brat ma na imię Piotr.", fr: "Mon frère s'appelle Piotr.", grammarFocus: "g-03-1",
        wordBank: ["Mój", "brat", "ma", "na", "imię", "Piotr"] },
      { id: "s-03-3", pl: "Moja żona jest Polką.", fr: "Ma femme est polonaise.", grammarFocus: "g-03-2",
        wordBank: ["Moja", "żona", "jest", "Polką"] },
      { id: "s-03-4", pl: "Mam dwoje dzieci.", fr: "J'ai deux enfants.", grammarFocus: "g-03-2",
        wordBank: ["Mam", "dwoje", "dzieci"] }
    ]
  },

  /* ================================ 4 ================================ */
  {
    id: "lesson-04",
    order: 5,
    title: "Les nombres et l'âge — liczby",
    theme: "nombres",
    mascotIntro:
      "Żubr compte ses sabots : jeden, dwa… puis il s'emmêle. Aide-le à compter jusqu'à dix (et au-delà) !",
    grammarNotes: [
      {
        id: "g-04-1",
        title: "Compter de 1 à 10",
        explanationFr:
          "jeden (1), dwa (2), trzy (3), cztery (4), pięć (5), sześć (6), siedem (7), osiem (8), dziewięć (9), dziesięć (10).",
        examples: [
          { pl: "pięć kotów", fr: "cinq chats" },
          { pl: "dziesięć złotych", fr: "dix zlotys" }
        ]
      },
      {
        id: "g-04-2",
        title: "Dire son âge : mam … lat / lata",
        explanationFr:
          "On utilise « mam » (j'ai) + le nombre. Attention : « rok » (1 an), « lata » (2-4 ans : dwa/trzy/cztery lata), « lat » (5 ans et +, et 11-14).",
        examples: [
          { pl: "Mam trzy lata.", fr: "J'ai trois ans." },
          { pl: "Mam pięć lat.", fr: "J'ai cinq ans." }
        ]
      }
    ],
    vocabulary: [
      { id: "v-04-jeden", pl: "jeden", fr: "un (1)", category: "nombre" },
      { id: "v-04-dwa", pl: "dwa", fr: "deux (2)", category: "nombre" },
      { id: "v-04-trzy", pl: "trzy", fr: "trois (3)", category: "nombre" },
      { id: "v-04-cztery", pl: "cztery", fr: "quatre (4)", category: "nombre" },
      { id: "v-04-piec", pl: "pięć", fr: "cinq (5)", category: "nombre" },
      { id: "v-04-szesc", pl: "sześć", fr: "six (6)", category: "nombre" },
      { id: "v-04-siedem", pl: "siedem", fr: "sept (7)", category: "nombre" },
      { id: "v-04-osiem", pl: "osiem", fr: "huit (8)", category: "nombre" },
      { id: "v-04-dziewiec", pl: "dziewięć", fr: "neuf (9)", category: "nombre" },
      { id: "v-04-dziesiec", pl: "dziesięć", fr: "dix (10)", category: "nombre" },
      { id: "v-04-ile", pl: "ile", fr: "combien", category: "question" },
      { id: "v-04-rok", pl: "rok", fr: "an / année", category: "temps" }
    ],
    sentences: [
      { id: "s-04-1", pl: "Ile masz lat?", fr: "Quel âge as-tu ?", grammarFocus: "g-04-2",
        wordBank: ["Ile", "masz", "lat"] },
      { id: "s-04-2", pl: "Mam czterdzieści lat.", fr: "J'ai quarante ans.", grammarFocus: "g-04-2",
        wordBank: ["Mam", "czterdzieści", "lat"] },
      { id: "s-04-3", pl: "Mam troje dzieci.", fr: "J'ai trois enfants.", grammarFocus: "g-04-1",
        wordBank: ["Mam", "troje", "dzieci"] },
      { id: "s-04-4", pl: "Moja córka ma pięć lat.", fr: "Ma fille a cinq ans.", grammarFocus: "g-04-2",
        wordBank: ["Moja", "córka", "ma", "pięć", "lat"] }
    ]
  },

  /* ================================ 5 ================================ */
  {
    id: "lesson-22",
    order: 6,
    title: "Les nombres de 11 à 20 — jedenaście do dwadzieścia",
    theme: "nombres",
    mascotIntro:
      "Żubr a appris à compter jusqu'à dix… mais voilà un troupeau de onze bisons ! Il faut continuer !",
    grammarNotes: [
      {
        id: "g-22-1",
        title: "Compter de 11 à 19",
        explanationFr:
          "En polonais, 11 se dit jedenaście (forme spéciale). De 12 à 19, on ajoute -naście à la racine : dwanaście (12), trzynaście (13), czternaście (14), piętnaście (15), szesnaście (16), siedemnaście (17), osiemnaście (18), dziewiętnaście (19).",
        examples: [
          { pl: "Mam piętnaście lat.", fr: "J'ai quinze ans." },
          { pl: "Jest szesnaście stopni.", fr: "Il fait seize degrés." }
        ]
      },
      {
        id: "g-22-2",
        title: "Rok / lata / lat avec 11-20",
        explanationFr:
          "Les nombres 11 à 20 utilisent toujours la forme « lat » (génitif pluriel). Mam jedenaście lat, mam dwadzieścia lat. Seules les dizaines + 2/3/4 reprennent « lata » (ex: dwadzieścia dwa lata).",
        examples: [
          { pl: "Mam osiemnaście lat.", fr: "J'ai dix-huit ans." },
          { pl: "Ma dwanaście lat.", fr: "Il/elle a douze ans." }
        ]
      }
    ],
    vocabulary: [
      { id: "v-22-jedenascie", pl: "jedenaście", fr: "onze (11)", ipa: "yèdènaçtché", category: "nombre" },
      { id: "v-22-dwanascie", pl: "dwanaście", fr: "douze (12)", ipa: "dvanàçtché", category: "nombre" },
      { id: "v-22-trzynascie", pl: "trzynaście", fr: "treize (13)", ipa: "tchinaçtché", category: "nombre" },
      { id: "v-22-czternascie", pl: "czternaście", fr: "quatorze (14)", ipa: "tchternaçtché", category: "nombre" },
      { id: "v-22-pietnascie", pl: "piętnaście", fr: "quinze (15)", ipa: "pyètnaçtché", category: "nombre" },
      { id: "v-22-szesnascie", pl: "szesnaście", fr: "seize (16)", ipa: "chèsnaçtché", category: "nombre" },
      { id: "v-22-siedemnascie", pl: "siedemnaście", fr: "dix-sept (17)", ipa: "chèdèmnaçtché", category: "nombre" },
      { id: "v-22-osiemnascie", pl: "osiemnaście", fr: "dix-huit (18)", ipa: "ochèmnaçtché", category: "nombre" },
      { id: "v-22-dziewietnascie", pl: "dziewiętnaście", fr: "dix-neuf (19)", ipa: "djèvyètnaçtché", category: "nombre" },
      { id: "v-22-dwadziescia", pl: "dwadzieścia", fr: "vingt (20)", ipa: "dvàdjèchtcha", category: "nombre" },
      { id: "v-22-stopni", pl: "stopni", fr: "degrés", category: "mesure",
        example: { pl: "Jest pięć stopni.", fr: "Il fait cinq degrés." } },
      { id: "v-22-zlotych", pl: "złotych", fr: "zlotys (devise polonaise)", category: "argent",
        example: { pl: "To kosztuje dziesięć złotych.", fr: "Ça coûte dix zlotys." } }
    ],
    sentences: [
      { id: "s-22-1", pl: "Mam osiemnaście lat.", fr: "J'ai dix-huit ans.", grammarFocus: "g-22-2",
        wordBank: ["Mam", "osiemnaście", "lat", "lata"] },
      { id: "s-22-2", pl: "Ile masz lat?", fr: "Quel âge as-tu ?", grammarFocus: "g-22-2",
        wordBank: ["Ile", "masz", "lat", "rok"] },
      { id: "s-22-3", pl: "To kosztuje piętnaście złotych.", fr: "Ça coûte quinze zlotys.", grammarFocus: "g-22-1",
        wordBank: ["To", "kosztuje", "piętnaście", "szesnaście", "złotych"] },
      { id: "s-22-4", pl: "Jest dwadzieścia stopni.", fr: "Il fait vingt degrés.", grammarFocus: "g-22-1",
        wordBank: ["Jest", "dwadzieścia", "dwanaście", "stopni"] }
    ]
  },

  /* ================================ 6 ================================ */
  {
    id: "lesson-23",
    order: 7,
    title: "Les dizaines et grands nombres — od dwudziestu do stu",
    theme: "nombres",
    mascotIntro:
      "Żubr veut savoir combien de personnes vivent à Varsovie. Un, deux… Il faut apprendre à compter plus grand !",
    grammarNotes: [
      {
        id: "g-23-1",
        title: "Les dizaines de 30 à 100",
        explanationFr:
          "trzydzieści (30), czterdzieści (40), pięćdziesiąt (50), sześćdziesiąt (60), siedemdziesiąt (70), osiemdziesiąt (80), dziewięćdziesiąt (90), sto (100). Terminaisons variables : -dzieści pour 30 et 40, -dziesiąt pour 50 à 90.",
        examples: [
          { pl: "Mam czterdzieści lat.", fr: "J'ai quarante ans." },
          { pl: "To kosztuje pięćdziesiąt złotych.", fr: "Ça coûte cinquante zlotys." }
        ]
      },
      {
        id: "g-23-2",
        title: "Nombres composés (21, 35, 47…)",
        explanationFr:
          "On juxtapose la dizaine et le chiffre : dwadzieścia dwa (22), trzydzieści pięć (35). La règle rok/lata/lat s'applique au dernier chiffre : 21 → dwadzieścia jeden rok, 22 → dwadzieścia dwa lata, 25 → dwadzieścia pięć lat.",
        examples: [
          { pl: "Mam trzydzieści dwa lata.", fr: "J'ai trente-deux ans." },
          { pl: "Mam sześćdziesiąt pięć lat.", fr: "J'ai soixante-cinq ans." }
        ]
      }
    ],
    vocabulary: [
      { id: "v-23-trzydziesci", pl: "trzydzieści", fr: "trente (30)", ipa: "tchidjèchti", category: "nombre" },
      { id: "v-23-czterdziesci", pl: "czterdzieści", fr: "quarante (40)", ipa: "tchterdjèchti", category: "nombre" },
      { id: "v-23-piecdziesiat", pl: "pięćdziesiąt", fr: "cinquante (50)", ipa: "pyètchdjèchyont", category: "nombre" },
      { id: "v-23-szescdziesiat", pl: "sześćdziesiąt", fr: "soixante (60)", ipa: "chèchtchdjèchyont", category: "nombre" },
      { id: "v-23-siedemdziesiat", pl: "siedemdziesiąt", fr: "soixante-dix (70)", ipa: "chèdèmdjèchyont", category: "nombre" },
      { id: "v-23-osiemdziesiat", pl: "osiemdziesiąt", fr: "quatre-vingts (80)", ipa: "ochèmdjèchyont", category: "nombre" },
      { id: "v-23-dziewiecdziesiat", pl: "dziewięćdziesiąt", fr: "quatre-vingt-dix (90)", ipa: "djèvyètchdjèchyont", category: "nombre" },
      { id: "v-23-sto", pl: "sto", fr: "cent (100)", ipa: "sto", category: "nombre" },
      { id: "v-23-pol", pl: "pół", fr: "demi / moitié", category: "quantité",
        example: { pl: "Pół godziny.", fr: "Une demi-heure." } },
      { id: "v-23-okolo", pl: "około", fr: "environ / à peu près", category: "quantité",
        example: { pl: "Około trzydziestu minut.", fr: "Environ trente minutes." } }
    ],
    sentences: [
      { id: "s-23-1", pl: "Mam trzydzieści pięć lat.", fr: "J'ai trente-cinq ans.", grammarFocus: "g-23-2",
        wordBank: ["Mam", "trzydzieści", "pięć", "cztery", "lat", "lata"] },
      { id: "s-23-2", pl: "To kosztuje czterdzieści złotych.", fr: "Ça coûte quarante zlotys.", grammarFocus: "g-23-1",
        wordBank: ["To", "kosztuje", "czterdzieści", "pięćdziesiąt", "złotych"] },
      { id: "s-23-3", pl: "Mieszka tu około stu osób.", fr: "Environ cent personnes habitent ici.", grammarFocus: "g-23-1",
        wordBank: ["Mieszka", "tu", "około", "stu", "dziesięciu", "osób"] },
      { id: "s-23-4", pl: "Mam dwadzieścia dwa lata.", fr: "J'ai vingt-deux ans.", grammarFocus: "g-23-2",
        wordBank: ["Mam", "dwadzieścia", "dwa", "dwie", "lata", "lat"] }
    ]
  },

  /* ================================ 7 ================================ */
  {
    id: "lesson-05",
    order: 8,
    title: "Au restaurant — l'accusatif",
    theme: "nourriture",
    mascotIntro:
      "Żubr a faim ! Mais pour commander, il faut « transformer » les mots. Bienvenue dans le monde magique de l'accusatif. 🍽️",
    grammarNotes: [
      {
        id: "g-05-1",
        title: "L'accusatif : le cas du complément d'objet",
        explanationFr:
          "Quand un nom est l'objet direct (ce qu'on veut / mange / voit), il change de forme. Pour les noms féminins en -a → -ę. Ex : kawa → poproszę kawę.",
        examples: [
          { pl: "Poproszę kawę.", fr: "Un café, s'il vous plaît.", note: "kawa → kawę" },
          { pl: "Poproszę herbatę.", fr: "Un thé, s'il vous plaît.", note: "herbata → herbatę" }
        ]
      },
      {
        id: "g-05-2",
        title: "Masculin inanimé : pas de changement",
        explanationFr:
          "Les noms masculins d'objets (inanimés) ne changent PAS à l'accusatif. Ex : chleb (le pain) reste chleb. Ouf.",
        examples: [
          { pl: "Poproszę chleb.", fr: "Du pain, s'il vous plaît.", note: "chleb inchangé" },
          { pl: "Poproszę sok.", fr: "Un jus, s'il vous plaît.", note: "sok inchangé" }
        ]
      }
    ],
    vocabulary: [
      { id: "v-05-poprosze", pl: "poproszę", fr: "je voudrais (pour commander)", category: "restaurant" },
      { id: "v-05-woda", pl: "woda", fr: "l'eau", category: "nourriture" },
      { id: "v-05-kawa", pl: "kawa", fr: "le café", category: "nourriture" },
      { id: "v-05-herbata", pl: "herbata", fr: "le thé", category: "nourriture" },
      { id: "v-05-piwo", pl: "piwo", fr: "la bière", category: "nourriture" },
      { id: "v-05-chleb", pl: "chleb", fr: "le pain", category: "nourriture" },
      { id: "v-05-zupa", pl: "zupa", fr: "la soupe", category: "nourriture" },
      { id: "v-05-pierogi", pl: "pierogi", fr: "les pierogi", category: "nourriture" },
      { id: "v-05-rachunek", pl: "rachunek", fr: "l'addition", category: "restaurant" },
      { id: "v-05-smacznego", pl: "smacznego", fr: "bon appétit", category: "restaurant" }
    ],
    sentences: [
      { id: "s-05-1", pl: "Poproszę kawę.", fr: "Un café, s'il vous plaît.", grammarFocus: "g-05-1",
        wordBank: ["Poproszę", "kawę"] },
      { id: "s-05-2", pl: "Poproszę wodę i chleb.", fr: "De l'eau et du pain, s'il vous plaît.", grammarFocus: "g-05-1",
        wordBank: ["Poproszę", "wodę", "i", "chleb"] },
      { id: "s-05-3", pl: "Poproszę rachunek.", fr: "L'addition, s'il vous plaît.", grammarFocus: "g-05-2",
        wordBank: ["Poproszę", "rachunek"] },
      { id: "s-05-4", pl: "Smacznego!", fr: "Bon appétit !", grammarFocus: "g-05-2",
        wordBank: ["Smacznego"] }
    ]
  },

  /* ================================ 8 ================================ */
  {
    id: "lesson-06",
    order: 10,
    title: "Les verbes du quotidien",
    theme: "verbes",
    mascotIntro:
      "Que fait Żubr de ses journées ? Il mange, il boit, il broute… Apprenons à conjuguer les verbes utiles !",
    grammarNotes: [
      {
        id: "g-06-1",
        title: "Conjuguer au présent : le modèle -ę / -isz",
        explanationFr:
          "Beaucoup de verbes suivent : ja robię, ty robisz, on/ona robi, my robimy, wy robicie, oni robią. (robić = faire)",
        examples: [
          { pl: "Co robisz?", fr: "Qu'est-ce que tu fais ?" },
          { pl: "Nic nie robię.", fr: "Je ne fais rien.", note: "double négation obligatoire !" }
        ]
      },
      {
        id: "g-06-2",
        title: "La double négation",
        explanationFr:
          "En polonais, la double négation est normale et obligatoire : « nic nie robię » (littéralement « rien ne fais »). On ne s'excuse pas, c'est la règle.",
        examples: [
          { pl: "Nic nie wiem.", fr: "Je ne sais rien." },
          { pl: "Nikt nie je.", fr: "Personne ne mange." }
        ]
      }
    ],
    vocabulary: [
      { id: "v-06-robic", pl: "robić", fr: "faire", category: "verbe" },
      { id: "v-06-miec", pl: "mieć", fr: "avoir", category: "verbe" },
      { id: "v-06-chciec", pl: "chcieć", fr: "vouloir", category: "verbe" },
      { id: "v-06-jesc", pl: "jeść", fr: "manger", category: "verbe" },
      { id: "v-06-pic", pl: "pić", fr: "boire", category: "verbe" },
      { id: "v-06-isc", pl: "iść", fr: "aller (à pied)", category: "verbe" },
      { id: "v-06-czytac", pl: "czytać", fr: "lire", category: "verbe" },
      { id: "v-06-pracowac", pl: "pracować", fr: "travailler", category: "verbe" },
      { id: "v-06-lubic", pl: "lubić", fr: "aimer bien", category: "verbe",
        example: { pl: "Lubię kawę.", fr: "J'aime le café." } },
      { id: "v-06-wiedziec", pl: "wiedzieć", fr: "savoir", category: "verbe" }
    ],
    sentences: [
      { id: "s-06-1", pl: "Co robisz dzisiaj?", fr: "Qu'est-ce que tu fais aujourd'hui ?", grammarFocus: "g-06-1",
        wordBank: ["Co", "robisz", "dzisiaj"] },
      { id: "s-06-2", pl: "Chcę pić kawę.", fr: "Je veux boire un café.", grammarFocus: "g-06-1",
        wordBank: ["Chcę", "pić", "kawę"] },
      { id: "s-06-3", pl: "Nic nie robię.", fr: "Je ne fais rien.", grammarFocus: "g-06-2",
        wordBank: ["Nic", "nie", "robię"] },
      { id: "s-06-4", pl: "Lubię czytać książki.", fr: "J'aime lire des livres.", grammarFocus: "g-06-1",
        wordBank: ["Lubię", "czytać", "książki"] }
    ]
  },

  /* ================================ 9 ================================ */
  {
    id: "lesson-07",
    order: 13,
    title: "La maison et le lieu — le locatif",
    theme: "maison",
    mascotIntro:
      "Où est Żubr ? Dans la forêt, dans la maison, dans la cuisine… Le cas « locatif » répond à « où ? ». 🏠",
    grammarNotes: [
      {
        id: "g-07-1",
        title: "Le locatif après « w » (dans) et « na » (sur/à)",
        explanationFr:
          "Pour dire OÙ on est, on utilise « w » ou « na » + le locatif. Féminins : -a → -ie (kuchnia → w kuchni). Souvent terminaison -e/-ie.",
        examples: [
          { pl: "w domu", fr: "à la maison", note: "dom → domu" },
          { pl: "w Polsce", fr: "en Pologne", note: "Polska → Polsce" }
        ]
      },
      {
        id: "g-07-2",
        title: "gdzie ? — où ?",
        explanationFr:
          "« gdzie » = où. La réponse utilise presque toujours le locatif avec w/na. « Gdzie jesteś? — W domu. »",
        examples: [
          { pl: "Gdzie jesteś?", fr: "Où es-tu ?" },
          { pl: "Jestem w pracy.", fr: "Je suis au travail.", note: "praca → pracy" }
        ]
      }
    ],
    vocabulary: [
      { id: "v-07-dom", pl: "dom", fr: "la maison", category: "maison" },
      { id: "v-07-mieszkanie", pl: "mieszkanie", fr: "l'appartement", category: "maison" },
      { id: "v-07-kuchnia", pl: "kuchnia", fr: "la cuisine", category: "maison" },
      { id: "v-07-lazienka", pl: "łazienka", fr: "la salle de bain", category: "maison" },
      { id: "v-07-pokoj", pl: "pokój", fr: "la pièce / chambre", category: "maison" },
      { id: "v-07-stol", pl: "stół", fr: "la table", category: "maison" },
      { id: "v-07-okno", pl: "okno", fr: "la fenêtre", category: "maison" },
      { id: "v-07-drzwi", pl: "drzwi", fr: "la porte", category: "maison" },
      { id: "v-07-gdzie", pl: "gdzie", fr: "où", category: "question" },
      { id: "v-07-tutaj", pl: "tutaj", fr: "ici", category: "lieu" }
    ],
    sentences: [
      { id: "s-07-1", pl: "Gdzie jesteś?", fr: "Où es-tu ?", grammarFocus: "g-07-2",
        wordBank: ["Gdzie", "jesteś"] },
      { id: "s-07-2", pl: "Jestem w domu.", fr: "Je suis à la maison.", grammarFocus: "g-07-1",
        wordBank: ["Jestem", "w", "domu"] },
      { id: "s-07-3", pl: "Mama jest w kuchni.", fr: "Maman est dans la cuisine.", grammarFocus: "g-07-1",
        wordBank: ["Mama", "jest", "w", "kuchni"] },
      { id: "s-07-4", pl: "Mieszkam w Polsce.", fr: "J'habite en Pologne.", grammarFocus: "g-07-1",
        wordBank: ["Mieszkam", "w", "Polsce"] }
    ]
  },

  /* ================================ 10 =============================== */
  {
    id: "lesson-08",
    order: 15,
    title: "Le temps et la routine",
    theme: "temps",
    mascotIntro:
      "Lundi, Żubr broute. Mardi, Żubr broute. La routine, quoi. Apprenons les jours et l'heure !",
    grammarNotes: [
      {
        id: "g-08-1",
        title: "Les jours de la semaine",
        explanationFr:
          "poniedziałek (lundi), wtorek (mardi), środa (mercredi), czwartek (jeudi), piątek (vendredi), sobota (samedi), niedziela (dimanche).",
        examples: [
          { pl: "Dzisiaj jest poniedziałek.", fr: "Aujourd'hui c'est lundi." },
          { pl: "w sobotę", fr: "samedi (le samedi)", note: "accusatif pour un jour précis" }
        ]
      },
      {
        id: "g-08-2",
        title: "Quelle heure est-il ?",
        explanationFr:
          "« Która godzina? » = quelle heure est-il ? Réponse simple : « Jest pierwsza » (il est une heure), « Jest druga » (deux heures)…",
        examples: [
          { pl: "Która godzina?", fr: "Quelle heure est-il ?" },
          { pl: "Jest dziesiąta.", fr: "Il est dix heures." }
        ]
      }
    ],
    vocabulary: [
      { id: "v-08-dzisiaj", pl: "dzisiaj", fr: "aujourd'hui", category: "temps" },
      { id: "v-08-jutro", pl: "jutro", fr: "demain", category: "temps" },
      { id: "v-08-wczoraj", pl: "wczoraj", fr: "hier", category: "temps" },
      { id: "v-08-teraz", pl: "teraz", fr: "maintenant", category: "temps" },
      { id: "v-08-rano", pl: "rano", fr: "le matin", category: "temps" },
      { id: "v-08-wieczorem", pl: "wieczorem", fr: "le soir", category: "temps" },
      { id: "v-08-poniedzialek", pl: "poniedziałek", fr: "lundi", category: "jour" },
      { id: "v-08-sobota", pl: "sobota", fr: "samedi", category: "jour" },
      { id: "v-08-niedziela", pl: "niedziela", fr: "dimanche", category: "jour" },
      { id: "v-08-godzina", pl: "godzina", fr: "l'heure", category: "temps" },
      { id: "v-08-tydzien", pl: "tydzień", fr: "la semaine", category: "temps" }
    ],
    sentences: [
      { id: "s-08-1", pl: "Która godzina?", fr: "Quelle heure est-il ?", grammarFocus: "g-08-2",
        wordBank: ["Która", "godzina"] },
      { id: "s-08-2", pl: "Dzisiaj jest sobota.", fr: "Aujourd'hui c'est samedi.", grammarFocus: "g-08-1",
        wordBank: ["Dzisiaj", "jest", "sobota"] },
      { id: "s-08-3", pl: "Jutro pracuję rano.", fr: "Demain je travaille le matin.", grammarFocus: "g-08-1",
        wordBank: ["Jutro", "pracuję", "rano"] },
      { id: "s-08-4", pl: "Teraz jest dziesiąta.", fr: "Il est dix heures maintenant.", grammarFocus: "g-08-2",
        wordBank: ["Teraz", "jest", "dziesiąta"] }
    ]
  },

  /* ================================ 11 =============================== */
  {
    id: "lesson-11",
    order: 17,
    title: "Le calendrier — jours et mois",
    theme: "calendrier",
    mascotIntro:
      "Żubr n'a jamais retenu quel jour on est : « On broute lundi ? Ou en juillet ? » Aide-le à maîtriser le calendrier polonais ! 📅",
    grammarNotes: [
      {
        id: "g-cal-1",
        title: "Les mois et « w + locatif » (en tel mois)",
        explanationFr:
          "Les mois sont tous masculins. Pour dire « en janvier », on utilise « w » + le locatif : styczeń → w styczniu, luty → w lutym, marzec → w marcu. Devant « wrzesień » on écrit « we wrześniu » (we pour faciliter la prononciation).",
        examples: [
          { pl: "w styczniu", fr: "en janvier", note: "styczeń → w styczniu" },
          { pl: "we wrześniu", fr: "en septembre", note: "we + wrzesień → wrześniu" }
        ]
      },
      {
        id: "g-cal-2",
        title: "Dire quel jour : « w + accusatif »",
        explanationFr:
          "Pour « le lundi / mardi… » on dit « w » + le jour à l'accusatif. Les jours masculins ne changent pas (w poniedziałek), les féminins en -a font -ę : środa → w środę, sobota → w sobotę, niedziela → w niedzielę. La date chiffrée complète (le 3 mai…) viendra plus tard.",
        examples: [
          { pl: "w poniedziałek", fr: "lundi (le lundi)", note: "masculin, inchangé" },
          { pl: "w sobotę", fr: "samedi (le samedi)", note: "sobota → sobotę" }
        ]
      }
    ],
    vocabulary: [
      { id: "v-cal-poniedzialek", pl: "poniedziałek", fr: "lundi", ipa: "poniedjawek", category: "jour" },
      { id: "v-cal-wtorek", pl: "wtorek", fr: "mardi", category: "jour" },
      { id: "v-cal-sroda", pl: "środa", fr: "mercredi", category: "jour" },
      { id: "v-cal-czwartek", pl: "czwartek", fr: "jeudi", category: "jour" },
      { id: "v-cal-piatek", pl: "piątek", fr: "vendredi", category: "jour" },
      { id: "v-cal-sobota", pl: "sobota", fr: "samedi", category: "jour" },
      { id: "v-cal-niedziela", pl: "niedziela", fr: "dimanche", category: "jour" },
      { id: "v-cal-styczen", pl: "styczeń", fr: "janvier", category: "mois" },
      { id: "v-cal-luty", pl: "luty", fr: "février", category: "mois" },
      { id: "v-cal-marzec", pl: "marzec", fr: "mars", category: "mois" },
      { id: "v-cal-kwiecien", pl: "kwiecień", fr: "avril", category: "mois" },
      { id: "v-cal-maj", pl: "maj", fr: "mai", category: "mois" },
      { id: "v-cal-czerwiec", pl: "czerwiec", fr: "juin", category: "mois" },
      { id: "v-cal-lipiec", pl: "lipiec", fr: "juillet", category: "mois" },
      { id: "v-cal-sierpien", pl: "sierpień", fr: "août", category: "mois" },
      { id: "v-cal-wrzesien", pl: "wrzesień", fr: "septembre", category: "mois" },
      { id: "v-cal-pazdziernik", pl: "październik", fr: "octobre", category: "mois" },
      { id: "v-cal-listopad", pl: "listopad", fr: "novembre", category: "mois" },
      { id: "v-cal-grudzien", pl: "grudzień", fr: "décembre", category: "mois" },
      { id: "v-cal-miesiac", pl: "miesiąc", fr: "le mois", category: "temps" },
      { id: "v-cal-kalendarz", pl: "kalendarz", fr: "le calendrier", category: "temps" }
    ],
    sentences: [
      { id: "s-cal-1", pl: "Dzisiaj jest środa.", fr: "Aujourd'hui c'est mercredi.", grammarFocus: "g-cal-2",
        wordBank: ["Dzisiaj", "jest", "środa"] },
      { id: "s-cal-2", pl: "Moje urodziny są w maju.", fr: "Mon anniversaire est en mai.", grammarFocus: "g-cal-1",
        wordBank: ["Moje", "urodziny", "są", "w", "maju"] },
      { id: "s-cal-3", pl: "W sobotę idę do sklepu.", fr: "Samedi je vais au magasin.", grammarFocus: "g-cal-2",
        wordBank: ["W", "sobotę", "idę", "do", "sklepu"] },
      { id: "s-cal-4", pl: "Styczeń jest pierwszym miesiącem.", fr: "Janvier est le premier mois.", grammarFocus: "g-cal-1",
        wordBank: ["Styczeń", "jest", "pierwszym", "miesiącem"] }
    ]
  },

  /* ================================ 12 =============================== */
  {
    id: "lesson-09",
    order: 19,
    title: "Les courses et les quantités — le génitif",
    theme: "courses",
    mascotIntro:
      "Żubr fait ses courses : « Je n'ai pas de foin ! » La négation et les quantités adorent le génitif. 🛒",
    grammarNotes: [
      {
        id: "g-09-1",
        title: "Le génitif après « nie ma » (il n'y a pas)",
        explanationFr:
          "Après une négation d'existence, le nom passe au génitif. Masculin → souvent -a/-u, féminin -a → -y/-i. « Nie ma chleba » (il n'y a pas de pain).",
        examples: [
          { pl: "Nie ma chleba.", fr: "Il n'y a pas de pain.", note: "chleb → chleba" },
          { pl: "Nie ma wody.", fr: "Il n'y a pas d'eau.", note: "woda → wody" }
        ]
      },
      {
        id: "g-09-2",
        title: "Le génitif après les quantités",
        explanationFr:
          "Après « dużo » (beaucoup), « mało » (peu), « kilo », on met le génitif pluriel/singulier. « Kilo jabłek », « dużo mleka ».",
        examples: [
          { pl: "dużo cukru", fr: "beaucoup de sucre" },
          { pl: "kilogram jabłek", fr: "un kilo de pommes" }
        ]
      }
    ],
    vocabulary: [
      { id: "v-09-sklep", pl: "sklep", fr: "le magasin", category: "courses" },
      { id: "v-09-mleko", pl: "mleko", fr: "le lait", category: "nourriture" },
      { id: "v-09-jajko", pl: "jajko", fr: "l'œuf", category: "nourriture" },
      { id: "v-09-jablko", pl: "jabłko", fr: "la pomme", category: "nourriture" },
      { id: "v-09-ser", pl: "ser", fr: "le fromage", category: "nourriture" },
      { id: "v-09-cukier", pl: "cukier", fr: "le sucre", category: "nourriture" },
      { id: "v-09-duzo", pl: "dużo", fr: "beaucoup", category: "quantité" },
      { id: "v-09-malo", pl: "mało", fr: "peu", category: "quantité" },
      { id: "v-09-ile-kosztuje", pl: "ile kosztuje", fr: "combien ça coûte", category: "courses" },
      { id: "v-09-pieniadze", pl: "pieniądze", fr: "l'argent", category: "courses" }
    ],
    sentences: [
      { id: "s-09-1", pl: "Ile to kosztuje?", fr: "Combien ça coûte ?", grammarFocus: "g-09-2",
        wordBank: ["Ile", "to", "kosztuje"] },
      { id: "s-09-2", pl: "Nie ma chleba.", fr: "Il n'y a pas de pain.", grammarFocus: "g-09-1",
        wordBank: ["Nie", "ma", "chleba"] },
      { id: "s-09-3", pl: "Poproszę kilogram jabłek.", fr: "Un kilo de pommes, s'il vous plaît.", grammarFocus: "g-09-2",
        wordBank: ["Poproszę", "kilogram", "jabłek"] },
      { id: "s-09-4", pl: "Kupuję dużo mleka.", fr: "J'achète beaucoup de lait.", grammarFocus: "g-09-2",
        wordBank: ["Kupuję", "dużo", "mleka"] }
    ]
  },

  /* ================================ 13 =============================== */
  {
    id: "lesson-10",
    order: 21,
    title: "Projets et futur — l'aspect verbal",
    theme: "futur",
    mascotIntro:
      "Que fera Żubr demain ? Le polonais a DEUX versions de chaque verbe selon qu'on finit l'action ou pas. Le fameux « aspect ». Courage, tu y es presque ! 🎉",
    grammarNotes: [
      {
        id: "g-10-1",
        title: "Aspect imperfectif vs perfectif",
        explanationFr:
          "Imperfectif = action en cours / répétée (robić, pić). Perfectif = action achevée, vue comme un tout (zrobić, wypić). Deux verbes pour une idée !",
        examples: [
          { pl: "Piję kawę.", fr: "Je bois un café (en train).", note: "imperfectif" },
          { pl: "Wypiję kawę.", fr: "Je (vais) boire mon café (jusqu'au bout).", note: "perfectif" }
        ]
      },
      {
        id: "g-10-2",
        title: "Le futur avec « będę » (imperfectif)",
        explanationFr:
          "Futur imperfectif : będę + infinitif. będę robić (je ferai), będziesz pić (tu boiras). Le perfectif, lui, se conjugue au présent mais a un sens futur.",
        examples: [
          { pl: "Będę pracować jutro.", fr: "Je travaillerai demain." },
          { pl: "Zrobię to jutro.", fr: "Je le ferai demain.", note: "perfectif = présent, sens futur" }
        ]
      }
    ],
    vocabulary: [
      { id: "v-10-bede", pl: "będę", fr: "je serai / je vais (futur)", category: "verbe" },
      { id: "v-10-jutro2", pl: "plan", fr: "le projet / plan", category: "futur" },
      { id: "v-10-wakacje", pl: "wakacje", fr: "les vacances", category: "futur" },
      { id: "v-10-podroz", pl: "podróż", fr: "le voyage", category: "futur" },
      { id: "v-10-kupic", pl: "kupić", fr: "acheter (perfectif)", category: "verbe" },
      { id: "v-10-zrobic", pl: "zrobić", fr: "faire (perfectif)", category: "verbe" },
      { id: "v-10-spotkanie", pl: "spotkanie", fr: "le rendez-vous / la rencontre", category: "futur" },
      { id: "v-10-moze", pl: "może", fr: "peut-être", category: "adverbe" },
      { id: "v-10-napewno", pl: "na pewno", fr: "à coup sûr", category: "adverbe" },
      { id: "v-10-razem", pl: "razem", fr: "ensemble", category: "adverbe" }
    ],
    sentences: [
      { id: "s-10-1", pl: "Jutro będę pracować.", fr: "Demain je travaillerai.", grammarFocus: "g-10-2",
        wordBank: ["Jutro", "będę", "pracować"] },
      { id: "s-10-2", pl: "Zrobię to na pewno.", fr: "Je le ferai à coup sûr.", grammarFocus: "g-10-1",
        wordBank: ["Zrobię", "to", "na", "pewno"] },
      { id: "s-10-3", pl: "Może pojedziemy razem.", fr: "Peut-être qu'on ira ensemble.", grammarFocus: "g-10-2",
        wordBank: ["Może", "pojedziemy", "razem"] },
      { id: "s-10-4", pl: "Będę pić mniej kawy.", fr: "Je boirai moins de café.", grammarFocus: "g-10-1",
        wordBank: ["Będę", "pić", "mniej", "kawy"] }
    ]
  },

  /* ================================ 14 =============================== */
  {
    id: "lesson-12",
    order: 22,
    title: "Les couleurs et les descriptions — l'adjectif",
    theme: "adjectifs",
    mascotIntro:
      "Żubr est brun, la forêt est verte, son humeur est… variable. Apprenons à décrire le monde : place aux adjectifs et aux couleurs ! 🎨",
    grammarNotes: [
      {
        id: "g-12-1",
        title: "L'adjectif s'accorde en genre (nominatif)",
        explanationFr:
          "L'adjectif prend la terminaison du genre du nom : masculin -y/-i (czerwony), féminin -a (czerwona), neutre -e (czerwone). Il se place normalement AVANT le nom.",
        examples: [
          { pl: "czerwony samochód", fr: "une voiture rouge", note: "masculin → -y" },
          { pl: "zielone jabłko", fr: "une pomme verte", note: "neutre → -e (jabłko)" }
        ]
      },
      {
        id: "g-12-2",
        title: "Demander : jaki / jaka / jakie ?",
        explanationFr:
          "Pour demander « quel / comment est … ? » on accorde aussi : jaki (masc.), jaka (fém.), jakie (neutre). « Jaki to kolor? » = c'est quelle couleur ?",
        examples: [
          { pl: "Jaki to kolor?", fr: "C'est quelle couleur ?" },
          { pl: "Jaka jest pogoda?", fr: "Quel temps fait-il ?" }
        ]
      }
    ],
    vocabulary: [
      { id: "v-12-kolor", pl: "kolor", fr: "la couleur", category: "description" },
      { id: "v-12-czerwony", pl: "czerwony", fr: "rouge", category: "couleur" },
      { id: "v-12-niebieski", pl: "niebieski", fr: "bleu", ipa: "niébieski", category: "couleur" },
      { id: "v-12-zielony", pl: "zielony", fr: "vert", category: "couleur" },
      { id: "v-12-zolty", pl: "żółty", fr: "jaune", ipa: "jouwti", category: "couleur" },
      { id: "v-12-czarny", pl: "czarny", fr: "noir", category: "couleur" },
      { id: "v-12-bialy", pl: "biały", fr: "blanc", category: "couleur" },
      { id: "v-12-duzy", pl: "duży", fr: "grand", category: "description" },
      { id: "v-12-maly", pl: "mały", fr: "petit", category: "description" },
      { id: "v-12-nowy", pl: "nowy", fr: "nouveau / neuf", category: "description" },
      { id: "v-12-stary", pl: "stary", fr: "vieux", category: "description" },
      { id: "v-12-ladny", pl: "ładny", fr: "joli", ipa: "wadni", category: "description" }
    ],
    sentences: [
      { id: "s-12-1", pl: "To jest czerwony samochód.", fr: "C'est une voiture rouge.", grammarFocus: "g-12-1",
        wordBank: ["To", "jest", "czerwony", "samochód"] },
      { id: "s-12-2", pl: "Moja sukienka jest niebieska.", fr: "Ma robe est bleue.", grammarFocus: "g-12-1",
        wordBank: ["Moja", "sukienka", "jest", "niebieska"] },
      { id: "s-12-3", pl: "Zielone jabłko jest małe.", fr: "La pomme verte est petite.", grammarFocus: "g-12-1",
        wordBank: ["Zielone", "jabłko", "jest", "małe"] },
      { id: "s-12-4", pl: "Jaki to kolor?", fr: "C'est quelle couleur ?", grammarFocus: "g-12-2",
        wordBank: ["Jaki", "to", "kolor"] }
    ]
  },

  /* ================================ 15 =============================== */
  {
    id: "lesson-13",
    order: 28,
    title: "Parler d'hier — le passé",
    theme: "passé",
    mascotIntro:
      "Hier, Żubr a brouté, s'est baigné, puis a dormi. Pour raconter tout ça, il faut le passé — et il change selon qu'on est un bison ou une bisonne ! 🕰️",
    grammarNotes: [
      {
        id: "g-13-1",
        title: "Le passé se marque au genre",
        explanationFr:
          "On part du radical + -ł- + terminaison, et la forme change selon le genre du sujet. Homme : byłem, robiłem. Femme : byłam, robiłam. Il/elle : był / była.",
        examples: [
          { pl: "Byłem w pracy.", fr: "J'étais au travail.", note: "homme → -łem" },
          { pl: "Byłam w domu.", fr: "J'étais à la maison.", note: "femme → -łam" }
        ]
      },
      {
        id: "g-13-2",
        title: "Situer dans le passé",
        explanationFr:
          "Le passé se combine avec des marqueurs : wczoraj (hier), … temu (il y a …), potem (ensuite). Au pluriel « nous » : byliśmy. « Rok temu byłem w Polsce. »",
        examples: [
          { pl: "Rok temu byłem w Polsce.", fr: "Il y a un an j'étais en Pologne." },
          { pl: "Potem byliśmy w domu.", fr: "Ensuite nous étions à la maison." }
        ]
      }
    ],
    vocabulary: [
      { id: "v-13-bylem", pl: "byłem", fr: "j'étais (homme)", category: "verbe" },
      { id: "v-13-bylam", pl: "byłam", fr: "j'étais (femme)", category: "verbe" },
      { id: "v-13-byl", pl: "był", fr: "il était", category: "verbe" },
      { id: "v-13-byla", pl: "była", fr: "elle était", category: "verbe" },
      { id: "v-13-mialem", pl: "miałem", fr: "j'avais (homme)", category: "verbe" },
      { id: "v-13-robilem", pl: "robiłem", fr: "je faisais / j'ai fait (homme)", category: "verbe" },
      { id: "v-13-zeszlytydzien", pl: "zeszły tydzień", fr: "la semaine dernière", category: "temps" },
      { id: "v-13-temu", pl: "temu", fr: "il y a (ex. rok temu)", category: "temps" },
      { id: "v-13-juz", pl: "już", fr: "déjà", category: "temps" },
      { id: "v-13-potem", pl: "potem", fr: "ensuite", category: "temps" },
      { id: "v-13-wycieczka", pl: "wycieczka", fr: "l'excursion", category: "voyage" }
    ],
    sentences: [
      { id: "s-13-1", pl: "Wczoraj byłem w Krakowie.", fr: "Hier j'étais à Cracovie.", grammarFocus: "g-13-1",
        wordBank: ["Wczoraj", "byłem", "w", "Krakowie"] },
      { id: "s-13-2", pl: "Ona była w pracy.", fr: "Elle était au travail.", grammarFocus: "g-13-1",
        wordBank: ["Ona", "była", "w", "pracy"] },
      { id: "s-13-3", pl: "Rok temu byłem w Polsce.", fr: "Il y a un an j'étais en Pologne.", grammarFocus: "g-13-2",
        wordBank: ["Rok", "temu", "byłem", "w", "Polsce"] },
      { id: "s-13-4", pl: "Potem byliśmy w domu.", fr: "Ensuite nous étions à la maison.", grammarFocus: "g-13-2",
        wordBank: ["Potem", "byliśmy", "w", "domu"] }
    ]
  },

  /* ================================ 16 =============================== */
  {
    id: "lesson-14",
    order: 30,
    title: "La routine du matin — les verbes réfléchis (się)",
    theme: "routine",
    mascotIntro:
      "Żubr se réveille, se lave (un peu), s'habille (pas besoin) et se dépêche. Le petit mot magique de la routine : « się ». 🌅",
    grammarNotes: [
      {
        id: "g-14-1",
        title: "Les verbes avec « się »",
        explanationFr:
          "Beaucoup de verbes du quotidien s'accompagnent de « się » (équivalent de « se »). « się » ne change JAMAIS de forme : myję się, ubieram się, uczę się.",
        examples: [
          { pl: "Myję się rano.", fr: "Je me lave le matin." },
          { pl: "Uczę się polskiego.", fr: "J'apprends le polonais.", note: "uczyć się + génitif" }
        ]
      },
      {
        id: "g-14-2",
        title: "Où placer « się » ?",
        explanationFr:
          "« się » se met en général juste après le verbe, mais on évite de le laisser en tout début ou toute fin de phrase. Il peut glisser avant le verbe : « Jak się nazywasz? ».",
        examples: [
          { pl: "Jak się nazywasz?", fr: "Comment t'appelles-tu ?" },
          { pl: "Muszę się spieszyć.", fr: "Je dois me dépêcher." }
        ]
      }
    ],
    vocabulary: [
      { id: "v-14-budzicsie", pl: "budzić się", fr: "se réveiller", category: "routine" },
      { id: "v-14-wstawac", pl: "wstawać", fr: "se lever", category: "routine" },
      { id: "v-14-mycsie", pl: "myć się", fr: "se laver", category: "routine" },
      { id: "v-14-ubieracsie", pl: "ubierać się", fr: "s'habiller", category: "routine" },
      { id: "v-14-spieszycsie", pl: "spieszyć się", fr: "se dépêcher", category: "routine" },
      { id: "v-14-klascsie", pl: "kłaść się", fr: "se coucher", category: "routine" },
      { id: "v-14-uczycsie", pl: "uczyć się", fr: "apprendre / étudier", category: "routine" },
      { id: "v-14-odpoczywac", pl: "odpoczywać", fr: "se reposer", category: "routine" },
      { id: "v-14-golicsie", pl: "golić się", fr: "se raser", category: "routine" },
      { id: "v-14-czucsie", pl: "czuć się", fr: "se sentir", category: "routine" },
      { id: "v-14-codziennie", pl: "codziennie", fr: "tous les jours", category: "temps" }
    ],
    sentences: [
      { id: "s-14-1", pl: "Budzę się o siódmej.", fr: "Je me réveille à sept heures.", grammarFocus: "g-14-1",
        wordBank: ["Budzę", "się", "o", "siódmej"] },
      { id: "s-14-2", pl: "Uczę się polskiego codziennie.", fr: "J'apprends le polonais tous les jours.", grammarFocus: "g-14-1",
        wordBank: ["Uczę", "się", "polskiego", "codziennie"] },
      { id: "s-14-3", pl: "Jak się nazywasz?", fr: "Comment t'appelles-tu ?", grammarFocus: "g-14-2",
        wordBank: ["Jak", "się", "nazywasz"] },
      { id: "s-14-4", pl: "Muszę się spieszyć.", fr: "Je dois me dépêcher.", grammarFocus: "g-14-2",
        wordBank: ["Muszę", "się", "spieszyć"] }
    ]
  },

  /* ================================ 17 =============================== */
  {
    id: "lesson-15",
    order: 31,
    title: "Le corps et la santé — chez le médecin",
    theme: "santé",
    mascotIntro:
      "« Aïe, Żubr a mal à la corne ! » Chez le médecin, il faut savoir dire où on a mal. Apprenons le corps et la santé. 🩺",
    grammarNotes: [
      {
        id: "g-15-1",
        title: "Dire où on a mal : « boli mnie … »",
        explanationFr:
          "La partie du corps est le SUJET (au nominatif) et « mnie » = « me » (accusatif). « Boli mnie głowa » = j'ai mal à la tête. Au pluriel, le verbe devient « bolą » : « Bolą mnie nogi ».",
        examples: [
          { pl: "Boli mnie głowa.", fr: "J'ai mal à la tête.", note: "singulier → boli" },
          { pl: "Bolą mnie nogi.", fr: "J'ai mal aux jambes.", note: "pluriel → bolą" }
        ]
      },
      {
        id: "g-15-2",
        title: "Chez quelqu'un : « u » + génitif",
        explanationFr:
          "Pour « chez le médecin » on utilise « u » + génitif (lekarz → u lekarza). Pour aller quelque part : « do » + génitif (do lekarza, do apteki).",
        examples: [
          { pl: "Idę do lekarza.", fr: "Je vais chez le médecin.", note: "do + génitif" },
          { pl: "Jestem u lekarza.", fr: "Je suis chez le médecin.", note: "u + génitif" }
        ]
      }
    ],
    vocabulary: [
      { id: "v-15-glowa", pl: "głowa", fr: "la tête", category: "corps" },
      { id: "v-15-gardlo", pl: "gardło", fr: "la gorge", category: "corps" },
      { id: "v-15-reka", pl: "ręka", fr: "la main / le bras", category: "corps" },
      { id: "v-15-noga", pl: "noga", fr: "la jambe / le pied", category: "corps" },
      { id: "v-15-brzuch", pl: "brzuch", fr: "le ventre", category: "corps" },
      { id: "v-15-zab", pl: "ząb", fr: "la dent", category: "corps" },
      { id: "v-15-oko", pl: "oko", fr: "l'œil", category: "corps" },
      { id: "v-15-lekarz", pl: "lekarz", fr: "le médecin", category: "santé" },
      { id: "v-15-apteka", pl: "apteka", fr: "la pharmacie", category: "santé" },
      { id: "v-15-chory", pl: "chory", fr: "malade", category: "santé" },
      { id: "v-15-zdrowy", pl: "zdrowy", fr: "en bonne santé", category: "santé" },
      { id: "v-15-lek", pl: "lek", fr: "le médicament", category: "santé" }
    ],
    sentences: [
      { id: "s-15-1", pl: "Boli mnie głowa.", fr: "J'ai mal à la tête.", grammarFocus: "g-15-1",
        wordBank: ["Boli", "mnie", "głowa"] },
      { id: "s-15-2", pl: "Bolą mnie nogi.", fr: "J'ai mal aux jambes.", grammarFocus: "g-15-1",
        wordBank: ["Bolą", "mnie", "nogi"] },
      { id: "s-15-3", pl: "Idę do lekarza.", fr: "Je vais chez le médecin.", grammarFocus: "g-15-2",
        wordBank: ["Idę", "do", "lekarza"] },
      { id: "s-15-4", pl: "Gdzie jest apteka?", fr: "Où est la pharmacie ?", grammarFocus: "g-15-2",
        wordBank: ["Gdzie", "jest", "apteka"] }
    ]
  },

  /* ================================ 18 =============================== */
  {
    id: "lesson-16",
    order: 34,
    title: "En ville — trouver son chemin",
    theme: "ville",
    mascotIntro:
      "Żubr est perdu en ville : la gare, à droite ? tout droit ? Apprenons à demander et indiquer le chemin. 🗺️",
    grammarNotes: [
      {
        id: "g-16-1",
        title: "Aller à pied ou en véhicule : iść vs jechać",
        explanationFr:
          "« iść » = aller à pied (idę, idziesz…). « jechać » = aller en véhicule (jadę, jedziesz…). On choisit selon le moyen ! Destination : « do » + génitif.",
        examples: [
          { pl: "Idę do sklepu.", fr: "Je vais au magasin (à pied).", note: "iść → idę" },
          { pl: "Jadę do Warszawy.", fr: "Je vais à Varsovie (en véhicule).", note: "jechać → jadę" }
        ]
      },
      {
        id: "g-16-2",
        title: "Indiquer la direction",
        explanationFr:
          "« prosto » = tout droit, « w prawo » = à droite, « w lewo » = à gauche, « skręcić » = tourner. « blisko » = près, « daleko » = loin.",
        examples: [
          { pl: "Skręć w prawo.", fr: "Tourne à droite." },
          { pl: "Idź prosto.", fr: "Va tout droit." }
        ]
      }
    ],
    vocabulary: [
      { id: "v-16-miasto", pl: "miasto", fr: "la ville", category: "ville" },
      { id: "v-16-ulica", pl: "ulica", fr: "la rue", category: "ville" },
      { id: "v-16-dworzec", pl: "dworzec", fr: "la gare", category: "ville" },
      { id: "v-16-przystanek", pl: "przystanek", fr: "l'arrêt", category: "ville" },
      { id: "v-16-most", pl: "most", fr: "le pont", category: "ville" },
      { id: "v-16-skrecic", pl: "skręcić", fr: "tourner", category: "direction" },
      { id: "v-16-prosto", pl: "prosto", fr: "tout droit", category: "direction" },
      { id: "v-16-wprawo", pl: "w prawo", fr: "à droite", category: "direction" },
      { id: "v-16-wlewo", pl: "w lewo", fr: "à gauche", category: "direction" },
      { id: "v-16-blisko", pl: "blisko", fr: "près", category: "direction" },
      { id: "v-16-daleko", pl: "daleko", fr: "loin", category: "direction" },
      { id: "v-16-mapa", pl: "mapa", fr: "la carte", category: "ville" }
    ],
    sentences: [
      { id: "s-16-1", pl: "Idę do dworca.", fr: "Je vais à la gare.", grammarFocus: "g-16-1",
        wordBank: ["Idę", "do", "dworca"] },
      { id: "s-16-2", pl: "Jadę do Warszawy.", fr: "Je vais à Varsovie.", grammarFocus: "g-16-1",
        wordBank: ["Jadę", "do", "Warszawy"] },
      { id: "s-16-3", pl: "Skręć w prawo.", fr: "Tourne à droite.", grammarFocus: "g-16-2",
        wordBank: ["Skręć", "w", "prawo"] },
      { id: "s-16-4", pl: "Przystanek jest blisko.", fr: "L'arrêt est près.", grammarFocus: "g-16-2",
        wordBank: ["Przystanek", "jest", "blisko"] }
    ]
  },

  /* ================================ 19 =============================== */
  {
    id: "lesson-17",
    order: 35,
    title: "Les transports — l'instrumental",
    theme: "instrumental",
    mascotIntro:
      "Żubr voyage : en bus, en train, avec un copain… Le cas « instrumental » sert au moyen de transport ET à dire son métier. 🚋",
    grammarNotes: [
      {
        id: "g-17-1",
        title: "Le moyen de transport : instrumental",
        explanationFr:
          "« comment ? / par quel moyen ? » → instrumental. Masculin/neutre → -em : autobus → autobusem, pociąg → pociągiem, samochód → samochodem. « Jadę autobusem. »",
        examples: [
          { pl: "Jadę autobusem.", fr: "Je vais en bus.", note: "autobus → autobusem" },
          { pl: "Jadę pociągiem.", fr: "Je vais en train.", note: "pociąg → pociągiem" }
        ]
      },
      {
        id: "g-17-2",
        title: "« avec » et le métier : instrumental aussi",
        explanationFr:
          "« z » + instrumental = avec (z kolegą). Et le métier après « być » se met à l'instrumental : « Jestem nauczycielem » (masc. -em), « Jestem lekarką » (fém. -ą).",
        examples: [
          { pl: "Jestem nauczycielem.", fr: "Je suis enseignant.", note: "métier → instrumental" },
          { pl: "Idę z kolegą.", fr: "Je vais avec un copain.", note: "kolega → z kolegą" }
        ]
      }
    ],
    vocabulary: [
      { id: "v-17-autobus", pl: "autobus", fr: "le bus", category: "transport" },
      { id: "v-17-pociag", pl: "pociąg", fr: "le train", category: "transport" },
      { id: "v-17-samochod", pl: "samochód", fr: "la voiture", category: "transport" },
      { id: "v-17-rower", pl: "rower", fr: "le vélo", category: "transport" },
      { id: "v-17-samolot", pl: "samolot", fr: "l'avion", category: "transport" },
      { id: "v-17-nauczyciel", pl: "nauczyciel", fr: "l'enseignant", category: "métier" },
      { id: "v-17-inzynier", pl: "inżynier", fr: "l'ingénieur", category: "métier" },
      { id: "v-17-kierowca", pl: "kierowca", fr: "le chauffeur", category: "métier" },
      { id: "v-17-kolega", pl: "kolega", fr: "le copain / collègue", category: "personne" },
      { id: "v-17-bilet", pl: "bilet", fr: "le billet", category: "transport" },
      { id: "v-17-peron", pl: "peron", fr: "le quai", category: "transport" },
      { id: "v-17-lotnisko", pl: "lotnisko", fr: "l'aéroport", category: "transport" }
    ],
    sentences: [
      { id: "s-17-1", pl: "Jadę autobusem do pracy.", fr: "Je vais au travail en bus.", grammarFocus: "g-17-1",
        wordBank: ["Jadę", "autobusem", "do", "pracy"] },
      { id: "s-17-2", pl: "Jadę do Krakowa pociągiem.", fr: "Je vais à Cracovie en train.", grammarFocus: "g-17-1",
        wordBank: ["Jadę", "do", "Krakowa", "pociągiem"] },
      { id: "s-17-3", pl: "Jestem nauczycielem.", fr: "Je suis enseignant.", grammarFocus: "g-17-2",
        wordBank: ["Jestem", "nauczycielem"] },
      { id: "s-17-4", pl: "Idę z kolegą.", fr: "Je vais avec un copain.", grammarFocus: "g-17-2",
        wordBank: ["Idę", "z", "kolegą"] }
    ]
  },

  /* ================================ 20 =============================== */
  {
    id: "lesson-18",
    order: 38,
    title: "Au marché et à table — le datif",
    theme: "datif",
    mascotIntro:
      "Żubr adore le marché : « Ce chou me plaît ! » Pour dire « à qui » et « ça me plaît », voici le datif. 🥕",
    grammarNotes: [
      {
        id: "g-18-1",
        title: "« ça me plaît » : podoba mi się / smakuje mi",
        explanationFr:
          "Le datif répond à « à qui ? ». Pronoms : mi (à moi), ci (à toi), mu (à lui), jej (à elle), nam (à nous). « Podoba mi się » = ça me plaît ; « smakuje mi » = c'est bon (au goût) pour moi.",
        examples: [
          { pl: "Podoba mi się Kraków.", fr: "Cracovie me plaît." },
          { pl: "Smakuje mi ta zupa.", fr: "Cette soupe me plaît (est bonne)." }
        ]
      },
      {
        id: "g-18-2",
        title: "Donner / aider à quelqu'un",
        explanationFr:
          "Les verbes dawać (donner), pomagać (aider), dziękować (remercier) demandent le datif. Le nom change : mama → mamie, kolega → koledze.",
        examples: [
          { pl: "Daję prezent mamie.", fr: "Je donne un cadeau à maman.", note: "mama → mamie" },
          { pl: "Pomagam koledze.", fr: "J'aide un copain.", note: "kolega → koledze" }
        ]
      }
    ],
    vocabulary: [
      { id: "v-18-targ", pl: "targ", fr: "le marché", category: "courses" },
      { id: "v-18-warzywa", pl: "warzywa", fr: "les légumes", category: "nourriture" },
      { id: "v-18-owoce", pl: "owoce", fr: "les fruits", category: "nourriture" },
      { id: "v-18-pomidor", pl: "pomidor", fr: "la tomate", category: "nourriture" },
      { id: "v-18-marchewka", pl: "marchewka", fr: "la carotte", category: "nourriture" },
      { id: "v-18-cebula", pl: "cebula", fr: "l'oignon", category: "nourriture" },
      { id: "v-18-smaczny", pl: "smaczny", fr: "savoureux / bon", category: "description" },
      { id: "v-18-swiezy", pl: "świeży", fr: "frais", category: "description" },
      { id: "v-18-prezent", pl: "prezent", fr: "le cadeau", category: "objet" },
      { id: "v-18-dawac", pl: "dawać", fr: "donner", category: "verbe" },
      { id: "v-18-pomagac", pl: "pomagać", fr: "aider", category: "verbe" },
      { id: "v-18-podobamisie", pl: "podoba mi się", fr: "ça me plaît", category: "expression" }
    ],
    sentences: [
      { id: "s-18-1", pl: "Podoba mi się Kraków.", fr: "Cracovie me plaît.", grammarFocus: "g-18-1",
        wordBank: ["Podoba", "mi", "się", "Kraków"] },
      { id: "s-18-2", pl: "Smakuje mi ta zupa.", fr: "Cette soupe me plaît.", grammarFocus: "g-18-1",
        wordBank: ["Smakuje", "mi", "ta", "zupa"] },
      { id: "s-18-3", pl: "Daję prezent mamie.", fr: "Je donne un cadeau à maman.", grammarFocus: "g-18-2",
        wordBank: ["Daję", "prezent", "mamie"] },
      { id: "s-18-4", pl: "Pomagam koledze.", fr: "J'aide un copain.", grammarFocus: "g-18-2",
        wordBank: ["Pomagam", "koledze"] }
    ]
  },

  /* ================================ 21 =============================== */
  {
    id: "lesson-19",
    order: 43,
    title: "Comparer — le comparatif et le superlatif",
    theme: "comparaisons",
    mascotIntro:
      "Żubr est le plus grand, le plus fort, le plus modeste aussi… Apprenons à comparer : plus grand, moins cher, le meilleur ! 🏅",
    grammarNotes: [
      {
        id: "g-19-1",
        title: "Le comparatif : -szy ou bardziej + « niż »",
        explanationFr:
          "Adjectifs courts : + -szy (tani → tańszy, duży → większy). Irréguliers : dobry → lepszy, zły → gorszy. On compare avec « niż » : « większy niż … ».",
        examples: [
          { pl: "Warszawa jest większa niż Kraków.", fr: "Varsovie est plus grande que Cracovie." },
          { pl: "Ten hotel jest tańszy.", fr: "Cet hôtel est moins cher.", note: "tani → tańszy" }
        ]
      },
      {
        id: "g-19-2",
        title: "Le superlatif : naj- + comparatif",
        explanationFr:
          "On ajoute « naj- » devant le comparatif : lepszy → najlepszy, większy → największy, tańszy → najtańszy. « To jest najlepszy hotel. »",
        examples: [
          { pl: "To jest najlepszy hotel.", fr: "C'est le meilleur hôtel." },
          { pl: "To najtańszy bilet.", fr: "C'est le billet le moins cher." }
        ]
      }
    ],
    vocabulary: [
      { id: "v-19-tani", pl: "tani", fr: "bon marché", category: "description" },
      { id: "v-19-drogi", pl: "drogi", fr: "cher", category: "description" },
      { id: "v-19-tanszy", pl: "tańszy", fr: "moins cher", category: "comparaison" },
      { id: "v-19-drozszy", pl: "droższy", fr: "plus cher", category: "comparaison" },
      { id: "v-19-lepszy", pl: "lepszy", fr: "meilleur", category: "comparaison" },
      { id: "v-19-gorszy", pl: "gorszy", fr: "pire", category: "comparaison" },
      { id: "v-19-wiekszy", pl: "większy", fr: "plus grand", category: "comparaison" },
      { id: "v-19-mniejszy", pl: "mniejszy", fr: "plus petit", category: "comparaison" },
      { id: "v-19-szybki", pl: "szybki", fr: "rapide", category: "description" },
      { id: "v-19-wolny", pl: "wolny", fr: "lent / libre", category: "description" },
      { id: "v-19-niz", pl: "niż", fr: "que (comparaison)", category: "grammaire" },
      { id: "v-19-najlepszy", pl: "najlepszy", fr: "le meilleur", category: "comparaison" }
    ],
    sentences: [
      { id: "s-19-1", pl: "Ten hotel jest tańszy.", fr: "Cet hôtel est moins cher.", grammarFocus: "g-19-1",
        wordBank: ["Ten", "hotel", "jest", "tańszy"] },
      { id: "s-19-2", pl: "Warszawa jest większa niż Kraków.", fr: "Varsovie est plus grande que Cracovie.", grammarFocus: "g-19-1",
        wordBank: ["Warszawa", "jest", "większa", "niż", "Kraków"] },
      { id: "s-19-3", pl: "To jest najlepszy hotel.", fr: "C'est le meilleur hôtel.", grammarFocus: "g-19-2",
        wordBank: ["To", "jest", "najlepszy", "hotel"] },
      { id: "s-19-4", pl: "Pociąg jest szybszy niż autobus.", fr: "Le train est plus rapide que le bus.", grammarFocus: "g-19-1",
        wordBank: ["Pociąg", "jest", "szybszy", "niż", "autobus"] }
    ]
  },

  /* ================================ 22 =============================== */
  {
    id: "lesson-20",
    order: 45,
    title: "La météo et les saisons",
    theme: "météo",
    mascotIntro:
      "Pluie, neige, soleil : Żubr broute par tous les temps. Parlons météo et saisons ! ☀️🌧️❄️",
    grammarNotes: [
      {
        id: "g-20-1",
        title: "Le temps qu'il fait : tournures impersonnelles",
        explanationFr:
          "Pas de sujet : « jest » + adverbe (jest zimno = il fait froid, jest ciepło = il fait chaud). Pour la pluie/neige : « pada deszcz » (il pleut), « pada śnieg » (il neige).",
        examples: [
          { pl: "Dziś jest zimno.", fr: "Aujourd'hui il fait froid." },
          { pl: "Pada deszcz.", fr: "Il pleut." }
        ]
      },
      {
        id: "g-20-2",
        title: "« en été, en hiver… » : les saisons à l'instrumental",
        explanationFr:
          "Pour dire « en telle saison », la saison passe à l'instrumental : wiosna → wiosną, lato → latem, jesień → jesienią, zima → zimą.",
        examples: [
          { pl: "Latem jest gorąco.", fr: "En été il fait chaud.", note: "lato → latem" },
          { pl: "Zimą pada śnieg.", fr: "En hiver il neige.", note: "zima → zimą" }
        ]
      }
    ],
    vocabulary: [
      { id: "v-20-pogoda", pl: "pogoda", fr: "le temps (météo)", category: "météo" },
      { id: "v-20-slonce", pl: "słońce", fr: "le soleil", category: "météo" },
      { id: "v-20-deszcz", pl: "deszcz", fr: "la pluie", category: "météo" },
      { id: "v-20-snieg", pl: "śnieg", fr: "la neige", category: "météo" },
      { id: "v-20-wiatr", pl: "wiatr", fr: "le vent", category: "météo" },
      { id: "v-20-chmura", pl: "chmura", fr: "le nuage", category: "météo" },
      { id: "v-20-wiosna", pl: "wiosna", fr: "le printemps", category: "saison" },
      { id: "v-20-lato", pl: "lato", fr: "l'été", category: "saison" },
      { id: "v-20-jesien", pl: "jesień", fr: "l'automne", category: "saison" },
      { id: "v-20-zima", pl: "zima", fr: "l'hiver", category: "saison" },
      { id: "v-20-cieplo", pl: "ciepło", fr: "chaud (il fait)", category: "météo" },
      { id: "v-20-zimno", pl: "zimno", fr: "froid (il fait)", category: "météo" }
    ],
    sentences: [
      { id: "s-20-1", pl: "Dziś jest zimno.", fr: "Aujourd'hui il fait froid.", grammarFocus: "g-20-1",
        wordBank: ["Dziś", "jest", "zimno"] },
      { id: "s-20-2", pl: "Pada deszcz.", fr: "Il pleut.", grammarFocus: "g-20-1",
        wordBank: ["Pada", "deszcz"] },
      { id: "s-20-3", pl: "Latem jest gorąco.", fr: "En été il fait chaud.", grammarFocus: "g-20-2",
        wordBank: ["Latem", "jest", "gorąco"] },
      { id: "s-20-4", pl: "Zimą pada śnieg.", fr: "En hiver il neige.", grammarFocus: "g-20-2",
        wordBank: ["Zimą", "pada", "śnieg"] }
    ]
  },

  /* ================================ 23 =============================== */
  {
    id: "lesson-21",
    order: 48,
    title: "Au bureau et projets polis — le conditionnel",
    theme: "conditionnel",
    mascotIntro:
      "Żubr voudrait un café, pourrait aider, préférerait une sieste… Le conditionnel, c'est la politesse à la polonaise. Dernière ligne droite ! 🎉",
    grammarNotes: [
      {
        id: "g-21-1",
        title: "« je voudrais » : chciałbym / chciałabym",
        explanationFr:
          "Le conditionnel rend une demande polie. Homme : chciałbym (je voudrais), mógłbym (je pourrais), wolałbym (je préférerais). Femme : chciałabym, mogłabym, wolałabym.",
        examples: [
          { pl: "Chciałbym kawę.", fr: "Je voudrais un café.", note: "homme" },
          { pl: "Chciałabym zarezerwować stolik.", fr: "Je voudrais réserver une table.", note: "femme" }
        ]
      },
      {
        id: "g-21-2",
        title: "Demander poliment : « Czy mógłbyś…? »",
        explanationFr:
          "Pour « pourrais-tu…? » : « Czy mógłbyś…? » (à un homme) / « Czy mogłabyś…? » (à une femme). La particule -bym/-byś/-by porte le conditionnel.",
        examples: [
          { pl: "Czy mógłbyś mi pomóc?", fr: "Pourrais-tu m'aider ?" },
          { pl: "Wolałbym jechać pociągiem.", fr: "Je préférerais aller en train." }
        ]
      }
    ],
    vocabulary: [
      { id: "v-21-biuro", pl: "biuro", fr: "le bureau", category: "travail" },
      { id: "v-21-komputer", pl: "komputer", fr: "l'ordinateur", category: "travail" },
      { id: "v-21-email", pl: "e-mail", fr: "l'e-mail", category: "travail" },
      { id: "v-21-telefon", pl: "telefon", fr: "le téléphone", category: "travail" },
      { id: "v-21-projekt", pl: "projekt", fr: "le projet", category: "travail" },
      { id: "v-21-szef", pl: "szef", fr: "le chef / le patron", category: "travail" },
      { id: "v-21-zebranie", pl: "zebranie", fr: "la réunion", category: "travail" },
      { id: "v-21-chcialbym", pl: "chciałbym", fr: "je voudrais (homme)", category: "conditionnel" },
      { id: "v-21-chcialabym", pl: "chciałabym", fr: "je voudrais (femme)", category: "conditionnel" },
      { id: "v-21-moglbym", pl: "mógłbym", fr: "je pourrais (homme)", category: "conditionnel" },
      { id: "v-21-wolalbym", pl: "wolałbym", fr: "je préférerais (homme)", category: "conditionnel" },
      { id: "v-21-rezerwacja", pl: "rezerwacja", fr: "la réservation", category: "voyage" }
    ],
    sentences: [
      { id: "s-21-1", pl: "Chciałbym zarezerwować stolik.", fr: "Je voudrais réserver une table.", grammarFocus: "g-21-1",
        wordBank: ["Chciałbym", "zarezerwować", "stolik"] },
      { id: "s-21-2", pl: "Chciałabym kawę.", fr: "Je voudrais un café.", grammarFocus: "g-21-1",
        wordBank: ["Chciałabym", "kawę"] },
      { id: "s-21-3", pl: "Czy mógłbyś mi pomóc?", fr: "Pourrais-tu m'aider ?", grammarFocus: "g-21-2",
        wordBank: ["Czy", "mógłbyś", "mi", "pomóc"] },
      { id: "s-21-4", pl: "Wolałbym jechać pociągiem.", fr: "Je préférerais aller en train.", grammarFocus: "g-21-2",
        wordBank: ["Wolałbym", "jechać", "pociągiem"] }
    ]
  },

  /* =====================================================================
     LEÇONS A2 — intercalées via le champ `order` (l'ordre physique du
     tableau n'importe pas : state.js trie par `order`).
     ⚠️ Contenu à faire relire par une personne polonophone.
     ===================================================================== */

  /* ======================= order 8 — Vêtements ====================== */
  {
    id: "lesson-24",
    order: 9,
    title: "Vêtements et shopping — ubrania",
    theme: "vêtements",
    mascotIntro:
      "Żubr n'a jamais froid grâce à sa fourrure, mais il veut quand même un joli bonnet. Allons faire du shopping ! 🧣",
    grammarNotes: [
      {
        id: "g-24-1",
        title: "Acheter / porter + accusatif",
        explanationFr:
          "Les verbes kupować (acheter) et nosić (porter) prennent l'accusatif. Féminin -a → -ę (sukienka → sukienkę), et l'adjectif suit (nowa → nową). Le masculin d'objet ne change pas (sweter reste sweter).",
        examples: [
          { pl: "Kupuję nową sukienkę.", fr: "J'achète une nouvelle robe.", note: "sukienka → sukienkę" },
          { pl: "Noszę czarny sweter.", fr: "Je porte un pull noir.", note: "masculin inchangé" }
        ]
      },
      {
        id: "g-24-2",
        title: "Essayer et demander la taille",
        explanationFr:
          "« Czy mogę przymierzyć…? » = puis-je essayer… ? « Jaki rozmiar? » = quelle taille ? On répond « Noszę rozmiar M/L ».",
        examples: [
          { pl: "Czy mogę to przymierzyć?", fr: "Puis-je essayer ça ?" },
          { pl: "Jaki rozmiar pan nosi?", fr: "Quelle taille portez-vous ?" }
        ]
      }
    ],
    vocabulary: [
      { id: "v-24-ubranie", pl: "ubranie", fr: "le vêtement", category: "vêtements" },
      { id: "v-24-koszula", pl: "koszula", fr: "la chemise", category: "vêtements" },
      { id: "v-24-spodnie", pl: "spodnie", fr: "le pantalon", category: "vêtements" },
      { id: "v-24-sukienka", pl: "sukienka", fr: "la robe", category: "vêtements" },
      { id: "v-24-buty", pl: "buty", fr: "les chaussures", category: "vêtements" },
      { id: "v-24-kurtka", pl: "kurtka", fr: "la veste / le blouson", category: "vêtements" },
      { id: "v-24-sweter", pl: "sweter", fr: "le pull", category: "vêtements" },
      { id: "v-24-czapka", pl: "czapka", fr: "le bonnet", category: "vêtements" },
      { id: "v-24-rozmiar", pl: "rozmiar", fr: "la taille", category: "vêtements" },
      { id: "v-24-przymierzyc", pl: "przymierzyć", fr: "essayer (un vêtement)", category: "verbe" },
      { id: "v-24-nosic", pl: "nosić", fr: "porter", category: "verbe" },
      { id: "v-24-kupowac", pl: "kupować", fr: "acheter", category: "verbe" }
    ],
    sentences: [
      { id: "s-24-1", pl: "Kupuję nową sukienkę.", fr: "J'achète une nouvelle robe.", grammarFocus: "g-24-1",
        wordBank: ["Kupuję", "nową", "sukienkę", "nowa", "sukienka"] },
      { id: "s-24-2", pl: "Czy mogę przymierzyć te buty?", fr: "Puis-je essayer ces chaussures ?", grammarFocus: "g-24-2",
        wordBank: ["Czy", "mogę", "przymierzyć", "te", "buty"] },
      { id: "s-24-3", pl: "Noszę czarną kurtkę.", fr: "Je porte une veste noire.", grammarFocus: "g-24-1",
        wordBank: ["Noszę", "czarną", "kurtkę", "czarna", "kurtka"] },
      { id: "s-24-4", pl: "Jaki rozmiar pan nosi?", fr: "Quelle taille portez-vous ?", grammarFocus: "g-24-2",
        wordBank: ["Jaki", "rozmiar", "pan", "nosi"] }
    ],
    dialogues: [
      {
        id: "d-24-1",
        title: "Au magasin de vêtements",
        lines: [
          { who: "A", pl: "Dzień dobry! W czym mogę pomóc?", fr: "Bonjour ! Je peux vous aider ?" },
          { who: "B", pl: "Szukam ciepłej kurtki.", fr: "Je cherche une veste chaude." },
          { who: "A", pl: "Jaki rozmiar pan nosi?", fr: "Quelle taille portez-vous ?" },
          { who: "B", pl: "Noszę rozmiar L.", fr: "Je porte du L.",
            target: true, wordBank: ["Noszę", "rozmiar", "L", "duży", "M"] }
        ]
      }
    ]
  },

  /* ======================= order 10 — Modaux ======================== */
  {
    id: "lesson-25",
    order: 11,
    title: "Devoir, pouvoir, falloir — les modaux",
    theme: "modaux",
    mascotIntro:
      "« Je dois brouter, je peux dormir, il faut se dépêcher… » Żubr adore les verbes modaux : ils suivent presque toujours un infinitif. 💪",
    grammarNotes: [
      {
        id: "g-25-1",
        title: "musieć (devoir) et móc (pouvoir) + infinitif",
        explanationFr:
          "musieć : muszę, musisz, musi… Le « je peux » de móc : mogę, możesz, może… Ces verbes sont suivis d'un infinitif. « Muszę iść », « Czy mogę pomóc? ».",
        examples: [
          { pl: "Muszę iść do pracy.", fr: "Je dois aller au travail." },
          { pl: "Czy mogę tu usiąść?", fr: "Puis-je m'asseoir ici ?" }
        ]
      },
      {
        id: "g-25-2",
        title: "Tournures impersonnelles : trzeba, można, wolno",
        explanationFr:
          "Sans sujet : « trzeba » = il faut, « można » = on peut / c'est permis, « (nie) wolno » = c'est (inter)dit. Toujours + infinitif. « powinienem / powinnam » = je devrais (homme / femme).",
        examples: [
          { pl: "Trzeba kupić chleb.", fr: "Il faut acheter du pain." },
          { pl: "Tu nie wolno palić.", fr: "Ici il est interdit de fumer." }
        ]
      }
    ],
    vocabulary: [
      { id: "v-25-musiec", pl: "musieć", fr: "devoir", category: "modaux" },
      { id: "v-25-moc", pl: "móc", fr: "pouvoir", category: "modaux" },
      { id: "v-25-trzeba", pl: "trzeba", fr: "il faut", category: "modaux" },
      { id: "v-25-mozna", pl: "można", fr: "on peut / c'est permis", category: "modaux" },
      { id: "v-25-wolno", pl: "wolno", fr: "c'est permis", category: "modaux" },
      { id: "v-25-niewolno", pl: "nie wolno", fr: "c'est interdit", category: "modaux" },
      { id: "v-25-powinienem", pl: "powinienem", fr: "je devrais (homme)", category: "modaux" },
      { id: "v-25-powinnam", pl: "powinnam", fr: "je devrais (femme)", category: "modaux" },
      { id: "v-25-muszę", pl: "muszę", fr: "je dois", category: "modaux" },
      { id: "v-25-moge", pl: "mogę", fr: "je peux", category: "modaux" },
      { id: "v-25-pomoc", pl: "pomóc", fr: "aider (perfectif)", category: "verbe" },
      { id: "v-25-odpoczac", pl: "odpocząć", fr: "se reposer (perfectif)", category: "verbe" }
    ],
    sentences: [
      { id: "s-25-1", pl: "Muszę iść do pracy.", fr: "Je dois aller au travail.", grammarFocus: "g-25-1",
        wordBank: ["Muszę", "iść", "do", "pracy", "mogę"] },
      { id: "s-25-2", pl: "Czy mogę tu usiąść?", fr: "Puis-je m'asseoir ici ?", grammarFocus: "g-25-1",
        wordBank: ["Czy", "mogę", "tu", "usiąść", "muszę"] },
      { id: "s-25-3", pl: "Tu nie wolno palić.", fr: "Ici il est interdit de fumer.", grammarFocus: "g-25-2",
        wordBank: ["Tu", "nie", "wolno", "palić", "można"] },
      { id: "s-25-4", pl: "Trzeba kupić chleb.", fr: "Il faut acheter du pain.", grammarFocus: "g-25-2",
        wordBank: ["Trzeba", "kupić", "chleb", "trzeba"] }
    ],
    dialogues: [
      {
        id: "d-25-1",
        title: "Au bureau",
        lines: [
          { who: "A", pl: "Czy mogę otworzyć okno?", fr: "Puis-je ouvrir la fenêtre ?" },
          { who: "B", pl: "Tak, można.", fr: "Oui, c'est permis." },
          { who: "A", pl: "Dziękuję. Muszę już iść.", fr: "Merci. Je dois déjà y aller." },
          { who: "B", pl: "Powinieneś odpocząć.", fr: "Tu devrais te reposer.",
            target: true, wordBank: ["Powinieneś", "odpocząć", "musisz", "spać"] }
        ]
      }
    ]
  },

  /* ======================= order 11 — Loisirs ======================= */
  {
    id: "lesson-26",
    order: 12,
    title: "Le temps libre et les loisirs — czas wolny",
    theme: "loisirs",
    mascotIntro:
      "Le week-end, Żubr nage dans la rivière et gratte sa guitare (mal). Et toi, que fais-tu de ton temps libre ? 🎸",
    grammarNotes: [
      {
        id: "g-26-1",
        title: "grać w (jeux/sports) vs grać na (instruments)",
        explanationFr:
          "« grać w » + accusatif pour un jeu ou un sport : grać w piłkę, grać w szachy. « grać na » + locatif pour un instrument : grać na gitarze, grać na pianinie.",
        examples: [
          { pl: "Gram w piłkę nożną.", fr: "Je joue au football.", note: "w + accusatif" },
          { pl: "Ona gra na gitarze.", fr: "Elle joue de la guitare.", note: "na + locatif" }
        ]
      },
      {
        id: "g-26-2",
        title: "lubić + infinitif",
        explanationFr:
          "Pour dire ce qu'on aime faire : lubić + infinitif. « Lubię pływać », « Lubię czytać ».",
        examples: [
          { pl: "Lubię pływać w weekend.", fr: "J'aime nager le week-end." },
          { pl: "Lubię tańczyć.", fr: "J'aime danser." }
        ]
      }
    ],
    vocabulary: [
      { id: "v-26-hobby", pl: "hobby", fr: "le hobby", category: "loisirs" },
      { id: "v-26-czaswolny", pl: "czas wolny", fr: "le temps libre", category: "loisirs" },
      { id: "v-26-grac", pl: "grać", fr: "jouer", category: "verbe" },
      { id: "v-26-pilkanozna", pl: "piłka nożna", fr: "le football", category: "loisirs" },
      { id: "v-26-plywac", pl: "pływać", fr: "nager", category: "verbe" },
      { id: "v-26-biegac", pl: "biegać", fr: "courir", category: "verbe" },
      { id: "v-26-gitara", pl: "gitara", fr: "la guitare", category: "loisirs" },
      { id: "v-26-muzyka", pl: "muzyka", fr: "la musique", category: "loisirs" },
      { id: "v-26-film", pl: "film", fr: "le film", category: "loisirs" },
      { id: "v-26-tanczyc", pl: "tańczyć", fr: "danser", category: "verbe" },
      { id: "v-26-koncert", pl: "koncert", fr: "le concert", category: "loisirs" },
      { id: "v-26-weekend", pl: "weekend", fr: "le week-end", category: "temps" }
    ],
    sentences: [
      { id: "s-26-1", pl: "Gram w piłkę nożną.", fr: "Je joue au football.", grammarFocus: "g-26-1",
        wordBank: ["Gram", "w", "piłkę", "nożną", "na"] },
      { id: "s-26-2", pl: "Ona gra na gitarze.", fr: "Elle joue de la guitare.", grammarFocus: "g-26-1",
        wordBank: ["Ona", "gra", "na", "gitarze", "w"] },
      { id: "s-26-3", pl: "Lubię pływać w weekend.", fr: "J'aime nager le week-end.", grammarFocus: "g-26-2",
        wordBank: ["Lubię", "pływać", "w", "weekend", "biegać"] },
      { id: "s-26-4", pl: "Co robisz w czasie wolnym?", fr: "Que fais-tu pendant ton temps libre ?", grammarFocus: "g-26-2",
        wordBank: ["Co", "robisz", "w", "czasie", "wolnym"] }
    ],
    dialogues: [
      {
        id: "d-26-1",
        title: "Parler de ses loisirs",
        lines: [
          { who: "A", pl: "Masz jakieś hobby?", fr: "Tu as un hobby ?" },
          { who: "B", pl: "Tak, gram na gitarze.", fr: "Oui, je joue de la guitare." },
          { who: "A", pl: "A uprawiasz jakiś sport?", fr: "Et tu fais un sport ?" },
          { who: "B", pl: "Biegam w każdą sobotę.", fr: "Je cours tous les samedis.",
            target: true, wordBank: ["Biegam", "w", "każdą", "sobotę", "niedzielę"] }
        ]
      }
    ]
  },

  /* ======================= order 14 — Heure ========================= */
  {
    id: "lesson-27",
    order: 16,
    title: "L'heure précise — która godzina",
    theme: "heure",
    mascotIntro:
      "« Il est sept heures et demie ! » Żubr veut être à l'heure pour le petit-déjeuner. Apprenons à dire l'heure exacte. ⏰",
    grammarNotes: [
      {
        id: "g-27-1",
        title: "L'heure : pełna, wpół do, po, za",
        explanationFr:
          "Heure pleine : « Jest piąta » (5h). Et demie : « wpół do szóstej » = 5h30 (littéralement « moitié vers la 6e »). Minutes passées : « pięć po piątej » (5h05). Presque : « za pięć szósta » (5h55).",
        examples: [
          { pl: "Jest wpół do ósmej.", fr: "Il est sept heures et demie." },
          { pl: "Za kwadrans będzie południe.", fr: "Dans un quart d'heure il sera midi." }
        ]
      },
      {
        id: "g-27-2",
        title: "À quelle heure ? o + locatif",
        explanationFr:
          "« O której godzinie? » = à quelle heure ? On répond avec « o » + l'ordinal au locatif : o piątej (à 5h), o wpół do ósmej (à 7h30).",
        examples: [
          { pl: "Spotkajmy się o piątej.", fr: "Retrouvons-nous à cinq heures." },
          { pl: "Pociąg jest o wpół do dziewiątej.", fr: "Le train est à huit heures et demie." }
        ]
      }
    ],
    vocabulary: [
      { id: "v-27-godzina", pl: "godzina", fr: "l'heure", category: "temps" },
      { id: "v-27-wpoldo", pl: "wpół do", fr: "et demie (moitié vers)", category: "temps" },
      { id: "v-27-kwadrans", pl: "kwadrans", fr: "le quart d'heure", category: "temps" },
      { id: "v-27-za", pl: "za", fr: "dans / moins (heure)", category: "temps" },
      { id: "v-27-po", pl: "po", fr: "après / passées", category: "temps" },
      { id: "v-27-minuta", pl: "minuta", fr: "la minute", category: "temps" },
      { id: "v-27-poludnie", pl: "południe", fr: "midi", category: "temps" },
      { id: "v-27-polnoc", pl: "północ", fr: "minuit", category: "temps" },
      { id: "v-27-spoznicsie", pl: "spóźnić się", fr: "être en retard", category: "verbe" },
      { id: "v-27-wczesnie", pl: "wcześnie", fr: "tôt", category: "temps" },
      { id: "v-27-pozno", pl: "późno", fr: "tard", category: "temps" },
      { id: "v-27-punktualnie", pl: "punktualnie", fr: "à l'heure / ponctuellement", category: "temps" }
    ],
    sentences: [
      { id: "s-27-1", pl: "Która jest godzina?", fr: "Quelle heure est-il ?", grammarFocus: "g-27-1",
        wordBank: ["Która", "jest", "godzina"] },
      { id: "s-27-2", pl: "Jest wpół do ósmej.", fr: "Il est sept heures et demie.", grammarFocus: "g-27-1",
        wordBank: ["Jest", "wpół", "do", "ósmej", "piątej"] },
      { id: "s-27-3", pl: "Spotkajmy się o piątej.", fr: "Retrouvons-nous à cinq heures.", grammarFocus: "g-27-2",
        wordBank: ["Spotkajmy", "się", "o", "piątej", "piąta"] },
      { id: "s-27-4", pl: "Za kwadrans będzie południe.", fr: "Dans un quart d'heure il sera midi.", grammarFocus: "g-27-1",
        wordBank: ["Za", "kwadrans", "będzie", "południe", "północ"] }
    ],
    dialogues: [
      {
        id: "d-27-1",
        title: "Attraper le train",
        lines: [
          { who: "A", pl: "O której godzinie masz pociąg?", fr: "À quelle heure as-tu ton train ?" },
          { who: "B", pl: "O wpół do dziewiątej.", fr: "À huit heures et demie." },
          { who: "A", pl: "To już za dziesięć minut!", fr: "C'est dans dix minutes !" },
          { who: "B", pl: "Muszę się spieszyć.", fr: "Je dois me dépêcher.",
            target: true, wordBank: ["Muszę", "się", "spieszyć", "spać"] }
        ]
      }
    ]
  },

  /* ======================= order 16 — Dates ========================= */
  {
    id: "lesson-28",
    order: 18,
    title: "Nombres ordinaux et dates — daty",
    theme: "dates",
    mascotIntro:
      "« C'est mon premier hiver ! » se souvient Żubr. Premier, deuxième, troisième… et les dates : voici les nombres ordinaux. 📅",
    grammarNotes: [
      {
        id: "g-28-1",
        title: "Les nombres ordinaux (1er à 10e)",
        explanationFr:
          "Ils s'accordent comme des adjectifs : pierwszy, drugi, trzeci, czwarty, piąty, szósty, siódmy, ósmy, dziewiąty, dziesiąty. « pierwszy dzień », « trzecie piętro ».",
        examples: [
          { pl: "To mój pierwszy dzień.", fr: "C'est mon premier jour." },
          { pl: "Ona mieszka na trzecim piętrze.", fr: "Elle habite au troisième étage.", note: "locatif" }
        ]
      },
      {
        id: "g-28-2",
        title: "Les dates : le combien ? (génitif)",
        explanationFr:
          "Le jour de la date se met au génitif : « piątego lipca » (le 5 juillet). Question : « Którego dzisiaj mamy? » (le combien sommes-nous ?).",
        examples: [
          { pl: "Moje urodziny są piątego lipca.", fr: "Mon anniversaire est le 5 juillet." },
          { pl: "Którego dzisiaj mamy?", fr: "Le combien sommes-nous aujourd'hui ?" }
        ]
      }
    ],
    vocabulary: [
      { id: "v-28-pierwszy", pl: "pierwszy", fr: "premier", category: "ordinal" },
      { id: "v-28-drugi", pl: "drugi", fr: "deuxième", category: "ordinal" },
      { id: "v-28-trzeci", pl: "trzeci", fr: "troisième", category: "ordinal" },
      { id: "v-28-czwarty", pl: "czwarty", fr: "quatrième", category: "ordinal" },
      { id: "v-28-piaty", pl: "piąty", fr: "cinquième", category: "ordinal" },
      { id: "v-28-szosty", pl: "szósty", fr: "sixième", category: "ordinal" },
      { id: "v-28-siodmy", pl: "siódmy", fr: "septième", category: "ordinal" },
      { id: "v-28-osmy", pl: "ósmy", fr: "huitième", category: "ordinal" },
      { id: "v-28-dziewiaty", pl: "dziewiąty", fr: "neuvième", category: "ordinal" },
      { id: "v-28-dziesiaty", pl: "dziesiąty", fr: "dixième", category: "ordinal" },
      { id: "v-28-data", pl: "data", fr: "la date", category: "temps" },
      { id: "v-28-pietro", pl: "piętro", fr: "l'étage", category: "maison" }
    ],
    sentences: [
      { id: "s-28-1", pl: "To jest mój pierwszy dzień w pracy.", fr: "C'est mon premier jour au travail.", grammarFocus: "g-28-1",
        wordBank: ["To", "jest", "mój", "pierwszy", "dzień", "w", "pracy"] },
      { id: "s-28-2", pl: "Ona mieszka na trzecim piętrze.", fr: "Elle habite au troisième étage.", grammarFocus: "g-28-1",
        wordBank: ["Ona", "mieszka", "na", "trzecim", "piętrze", "trzeci"] },
      { id: "s-28-3", pl: "Moje urodziny są piątego lipca.", fr: "Mon anniversaire est le 5 juillet.", grammarFocus: "g-28-2",
        wordBank: ["Moje", "urodziny", "są", "piątego", "lipca", "piąty"] },
      { id: "s-28-4", pl: "Którego dzisiaj mamy?", fr: "Le combien sommes-nous aujourd'hui ?", grammarFocus: "g-28-2",
        wordBank: ["Którego", "dzisiaj", "mamy"] }
    ],
    dialogues: [
      {
        id: "d-28-1",
        title: "Quelle est la date ?",
        lines: [
          { who: "A", pl: "Którego dzisiaj mamy?", fr: "Le combien sommes-nous ?" },
          { who: "B", pl: "Dzisiaj jest dziesiąty marca.", fr: "Aujourd'hui c'est le 10 mars." },
          { who: "A", pl: "A kiedy masz urodziny?", fr: "Et quand est ton anniversaire ?" },
          { who: "B", pl: "Moje urodziny są drugiego maja.", fr: "Mon anniversaire est le 2 mai.",
            target: true, wordBank: ["Moje", "urodziny", "są", "drugiego", "maja", "drugi"] }
        ]
      }
    ]
  },

  /* ======================= order 18 — Cuisine ======================= */
  {
    id: "lesson-29",
    order: 20,
    title: "Cuisiner et manger — w kuchni",
    theme: "cuisine",
    mascotIntro:
      "Żubr ne cuisine pas vraiment (il broute), mais il adore regarder. Mettons la table et préparons un bon repas ! 🍲",
    grammarNotes: [
      {
        id: "g-29-1",
        title: "Les repas : na + accusatif",
        explanationFr:
          "Pour dire « au petit-déjeuner / au déjeuner / au dîner » : « na » + accusatif. « Co jesz na śniadanie? », « na obiad », « na kolację » (kolacja → kolację).",
        examples: [
          { pl: "Co jesz na śniadanie?", fr: "Que manges-tu au petit-déjeuner ?" },
          { pl: "Na obiad jem zupę.", fr: "Au déjeuner je mange de la soupe." }
        ]
      },
      {
        id: "g-29-2",
        title: "gotować dla + génitif",
        explanationFr:
          "« pour quelqu'un » = « dla » + génitif. « Gotuję dla rodziny » (rodzina → rodziny), « dla dzieci ».",
        examples: [
          { pl: "Gotuję obiad dla rodziny.", fr: "Je cuisine le déjeuner pour la famille." },
          { pl: "To jest prezent dla mamy.", fr: "C'est un cadeau pour maman." }
        ]
      }
    ],
    vocabulary: [
      { id: "v-29-gotowac", pl: "gotować", fr: "cuisiner", category: "cuisine" },
      { id: "v-29-przepis", pl: "przepis", fr: "la recette", category: "cuisine" },
      { id: "v-29-skladniki", pl: "składniki", fr: "les ingrédients", category: "cuisine" },
      { id: "v-29-talerz", pl: "talerz", fr: "l'assiette", category: "cuisine" },
      { id: "v-29-noz", pl: "nóż", fr: "le couteau", category: "cuisine" },
      { id: "v-29-widelec", pl: "widelec", fr: "la fourchette", category: "cuisine" },
      { id: "v-29-lyzka", pl: "łyżka", fr: "la cuillère", category: "cuisine" },
      { id: "v-29-sniadanie", pl: "śniadanie", fr: "le petit-déjeuner", category: "cuisine" },
      { id: "v-29-obiad", pl: "obiad", fr: "le déjeuner", category: "cuisine" },
      { id: "v-29-kolacja", pl: "kolacja", fr: "le dîner", category: "cuisine" },
      { id: "v-29-piec", pl: "piec", fr: "cuire (au four)", category: "verbe" },
      { id: "v-29-kroic", pl: "kroić", fr: "couper", category: "verbe" }
    ],
    sentences: [
      { id: "s-29-1", pl: "Co jesz na śniadanie?", fr: "Que manges-tu au petit-déjeuner ?", grammarFocus: "g-29-1",
        wordBank: ["Co", "jesz", "na", "śniadanie", "obiad"] },
      { id: "s-29-2", pl: "Gotuję obiad dla rodziny.", fr: "Je cuisine le déjeuner pour la famille.", grammarFocus: "g-29-2",
        wordBank: ["Gotuję", "obiad", "dla", "rodziny", "rodzina"] },
      { id: "s-29-3", pl: "Ten przepis jest bardzo prosty.", fr: "Cette recette est très simple.", grammarFocus: "g-29-1",
        wordBank: ["Ten", "przepis", "jest", "bardzo", "prosty"] },
      { id: "s-29-4", pl: "Potrzebuję nóż i widelec.", fr: "J'ai besoin d'un couteau et d'une fourchette.", grammarFocus: "g-29-2",
        wordBank: ["Potrzebuję", "nóż", "i", "widelec", "łyżkę"] }
    ],
    dialogues: [
      {
        id: "d-29-1",
        title: "En cuisine",
        lines: [
          { who: "A", pl: "Co robisz?", fr: "Qu'est-ce que tu fais ?" },
          { who: "B", pl: "Gotuję zupę pomidorową.", fr: "Je prépare une soupe de tomates." },
          { who: "A", pl: "Jakie składniki są potrzebne?", fr: "Quels ingrédients faut-il ?" },
          { who: "B", pl: "Potrzebuję pomidory i cebulę.", fr: "J'ai besoin de tomates et d'un oignon.",
            target: true, wordBank: ["Potrzebuję", "pomidory", "i", "cebulę", "cebula"] }
        ]
      }
    ]
  },

  /* ======================= order 21 — Pluriel ======================= */
  {
    id: "lesson-30",
    order: 23,
    title: "Le pluriel des noms — liczba mnoga",
    theme: "pluriel",
    mascotIntro:
      "Un bison, c'est bien. Un troupeau de bisons, c'est mieux ! Apprenons à mettre les noms au pluriel. 🦬🦬🦬",
    grammarNotes: [
      {
        id: "g-30-1",
        title: "Le pluriel des choses (non-personnel)",
        explanationFr:
          "Féminin -a → -y/-i (książka → książki, kobieta → kobiety). Neutre -o → -a (okno → okna, miasto → miasta). Masculin d'objet → -y/-i/-e (dom → domy, kot → koty).",
        examples: [
          { pl: "To są moje książki.", fr: "Ce sont mes livres.", note: "książka → książki" },
          { pl: "Te miasta są duże.", fr: "Ces villes sont grandes.", note: "miasto → miasta" }
        ]
      },
      {
        id: "g-30-2",
        title: "Le pluriel masculin personnel (à part !)",
        explanationFr:
          "Quand il s'agit d'hommes, le pluriel est spécial : mężczyzna → mężczyźni, student → studenci, Polak → Polacy. Certains sont irréguliers : człowiek → ludzie, dziecko → dzieci.",
        examples: [
          { pl: "Mężczyźni czytają gazety.", fr: "Les hommes lisent les journaux." },
          { pl: "W parku są ludzie.", fr: "Il y a des gens dans le parc." }
        ]
      }
    ],
    vocabulary: [
      { id: "v-30-koty", pl: "koty", fr: "les chats", category: "pluriel" },
      { id: "v-30-psy", pl: "psy", fr: "les chiens", category: "pluriel" },
      { id: "v-30-domy", pl: "domy", fr: "les maisons", category: "pluriel" },
      { id: "v-30-okna", pl: "okna", fr: "les fenêtres", category: "pluriel" },
      { id: "v-30-ksiazki", pl: "książki", fr: "les livres", category: "pluriel" },
      { id: "v-30-kobiety", pl: "kobiety", fr: "les femmes", category: "pluriel" },
      { id: "v-30-mezczyzni", pl: "mężczyźni", fr: "les hommes", category: "pluriel" },
      { id: "v-30-dzieci", pl: "dzieci", fr: "les enfants", category: "pluriel" },
      { id: "v-30-ludzie", pl: "ludzie", fr: "les gens", category: "pluriel" },
      { id: "v-30-samochody", pl: "samochody", fr: "les voitures", category: "pluriel" },
      { id: "v-30-miasta", pl: "miasta", fr: "les villes", category: "pluriel" },
      { id: "v-30-gazety", pl: "gazety", fr: "les journaux", category: "pluriel" }
    ],
    sentences: [
      { id: "s-30-1", pl: "To są moje książki.", fr: "Ce sont mes livres.", grammarFocus: "g-30-1",
        wordBank: ["To", "są", "moje", "książki", "książka"] },
      { id: "s-30-2", pl: "W parku są psy i koty.", fr: "Dans le parc il y a des chiens et des chats.", grammarFocus: "g-30-1",
        wordBank: ["W", "parku", "są", "psy", "i", "koty"] },
      { id: "s-30-3", pl: "Te miasta są bardzo duże.", fr: "Ces villes sont très grandes.", grammarFocus: "g-30-1",
        wordBank: ["Te", "miasta", "są", "bardzo", "duże", "miasto"] },
      { id: "s-30-4", pl: "Mężczyźni czytają gazety.", fr: "Les hommes lisent les journaux.", grammarFocus: "g-30-2",
        wordBank: ["Mężczyźni", "czytają", "gazety", "mężczyzna"] }
    ],
    dialogues: [
      {
        id: "d-30-1",
        title: "Décrire une photo",
        lines: [
          { who: "A", pl: "Co widzisz na zdjęciu?", fr: "Que vois-tu sur la photo ?" },
          { who: "B", pl: "Widzę dwa duże domy.", fr: "Je vois deux grandes maisons." },
          { who: "A", pl: "A co jeszcze?", fr: "Et quoi d'autre ?" },
          { who: "B", pl: "Tam są trzy samochody.", fr: "Il y a trois voitures là.",
            target: true, wordBank: ["Tam", "są", "trzy", "samochody", "samochód"] }
        ]
      }
    ]
  },

  /* ================== order 22 — Adjectif décliné =================== */
  {
    id: "lesson-31",
    order: 25,
    title: "L'adjectif décliné et au pluriel",
    theme: "adjectifs",
    mascotIntro:
      "Une grande forêt verte, de longs jours d'été… Żubr veut tout décrire précisément. L'adjectif s'accorde partout ! 🌲",
    grammarNotes: [
      {
        id: "g-31-1",
        title: "L'adjectif à l'accusatif",
        explanationFr:
          "Quand le nom est complément d'objet, l'adjectif suit. Féminin -a → -ą (nowa → nową), s'accordant avec le nom (sukienkę). Masculin d'objet inchangé (nowy sweter).",
        examples: [
          { pl: "Mam nową czerwoną sukienkę.", fr: "J'ai une nouvelle robe rouge.", note: "accusatif fém." },
          { pl: "Czytam ciekawą książkę.", fr: "Je lis un livre intéressant." }
        ]
      },
      {
        id: "g-31-2",
        title: "L'adjectif au pluriel",
        explanationFr:
          "Pour les choses et les femmes : terminaison -e (małe domy, ciekawe książki, młode kobiety). Pour un groupe d'hommes : -i/-y (mili panowie).",
        examples: [
          { pl: "To są ciekawe książki.", fr: "Ce sont des livres intéressants." },
          { pl: "Lubię trudne pytania.", fr: "J'aime les questions difficiles." }
        ]
      }
    ],
    vocabulary: [
      { id: "v-31-ciekawy", pl: "ciekawy", fr: "intéressant", category: "description" },
      { id: "v-31-nudny", pl: "nudny", fr: "ennuyeux", category: "description" },
      { id: "v-31-trudny", pl: "trudny", fr: "difficile", category: "description" },
      { id: "v-31-latwy", pl: "łatwy", fr: "facile", category: "description" },
      { id: "v-31-wysoki", pl: "wysoki", fr: "haut / grand", category: "description" },
      { id: "v-31-niski", pl: "niski", fr: "bas / petit", category: "description" },
      { id: "v-31-mlody", pl: "młody", fr: "jeune", category: "description" },
      { id: "v-31-wazny", pl: "ważny", fr: "important", category: "description" },
      { id: "v-31-dlugi", pl: "długi", fr: "long", category: "description" },
      { id: "v-31-krotki", pl: "krótki", fr: "court", category: "description" },
      { id: "v-31-pytanie", pl: "pytanie", fr: "la question", category: "objet" },
      { id: "v-31-historia", pl: "historia", fr: "l'histoire", category: "objet" }
    ],
    sentences: [
      { id: "s-31-1", pl: "Mam nową czerwoną sukienkę.", fr: "J'ai une nouvelle robe rouge.", grammarFocus: "g-31-1",
        wordBank: ["Mam", "nową", "czerwoną", "sukienkę", "nowa"] },
      { id: "s-31-2", pl: "To są ciekawe książki.", fr: "Ce sont des livres intéressants.", grammarFocus: "g-31-2",
        wordBank: ["To", "są", "ciekawe", "książki", "ciekawa"] },
      { id: "s-31-3", pl: "Lubię trudne pytania.", fr: "J'aime les questions difficiles.", grammarFocus: "g-31-2",
        wordBank: ["Lubię", "trudne", "pytania", "trudny"] },
      { id: "s-31-4", pl: "Czytam bardzo ciekawą książkę.", fr: "Je lis un livre très intéressant.", grammarFocus: "g-31-1",
        wordBank: ["Czytam", "bardzo", "ciekawą", "książkę", "ciekawa"] }
    ],
    dialogues: [
      {
        id: "d-31-1",
        title: "De quoi parle ton livre ?",
        lines: [
          { who: "A", pl: "Jaką książkę czytasz?", fr: "Quel livre lis-tu ?" },
          { who: "B", pl: "Czytam bardzo ciekawą książkę.", fr: "Je lis un livre très intéressant." },
          { who: "A", pl: "O czym ona jest?", fr: "De quoi parle-t-il ?" },
          { who: "B", pl: "To jest długa historia.", fr: "C'est une longue histoire.",
            target: true, wordBank: ["To", "jest", "długa", "historia", "długi"] }
        ]
      }
    ]
  },

  /* ======================= order 23 — Sentiments ==================== */
  {
    id: "lesson-32",
    order: 27,
    title: "Les sentiments et le caractère — uczucia",
    theme: "sentiments",
    mascotIntro:
      "Heureux, fatigué, un peu inquiet avant l'hiver… Żubr a plein d'émotions. Apprenons à dire comment on se sent. 😊",
    grammarNotes: [
      {
        id: "g-32-1",
        title: "être + adjectif d'état (accord en genre)",
        explanationFr:
          "Avec « być » l'adjectif s'accorde : homme « Jestem szczęśliwy / zmęczony », femme « Jestem szczęśliwa / zmęczona ».",
        examples: [
          { pl: "Jestem bardzo szczęśliwy.", fr: "Je suis très heureux.", note: "homme" },
          { pl: "Ona jest dzisiaj smutna.", fr: "Elle est triste aujourd'hui.", note: "femme" }
        ]
      },
      {
        id: "g-32-2",
        title: "Les verbes d'émotion en « się »",
        explanationFr:
          "cieszyć się (se réjouir), martwić się (s'inquiéter), denerwować się (s'énerver), bać się + génitif (avoir peur de). « Boję się psów », « Cieszę się ».",
        examples: [
          { pl: "Cieszę się, że jesteś.", fr: "Je suis content que tu sois là." },
          { pl: "Boję się psów.", fr: "J'ai peur des chiens.", note: "bać się + génitif" }
        ]
      }
    ],
    vocabulary: [
      { id: "v-32-szczesliwy", pl: "szczęśliwy", fr: "heureux", category: "sentiment" },
      { id: "v-32-smutny", pl: "smutny", fr: "triste", category: "sentiment" },
      { id: "v-32-zmeczony", pl: "zmęczony", fr: "fatigué", category: "sentiment" },
      { id: "v-32-zly", pl: "zły", fr: "fâché / méchant", category: "sentiment" },
      { id: "v-32-zadowolony", pl: "zadowolony", fr: "content / satisfait", category: "sentiment" },
      { id: "v-32-spokojny", pl: "spokojny", fr: "calme", category: "sentiment" },
      { id: "v-32-mily", pl: "miły", fr: "gentil / agréable", category: "caractère" },
      { id: "v-32-wesoly", pl: "wesoły", fr: "joyeux", category: "caractère" },
      { id: "v-32-cieszycsie", pl: "cieszyć się", fr: "se réjouir", category: "verbe" },
      { id: "v-32-bacsie", pl: "bać się", fr: "avoir peur", category: "verbe" },
      { id: "v-32-martwicsie", pl: "martwić się", fr: "s'inquiéter", category: "verbe" },
      { id: "v-32-denerwowacsie", pl: "denerwować się", fr: "s'énerver", category: "verbe" }
    ],
    sentences: [
      { id: "s-32-1", pl: "Jestem bardzo szczęśliwy.", fr: "Je suis très heureux.", grammarFocus: "g-32-1",
        wordBank: ["Jestem", "bardzo", "szczęśliwy", "szczęśliwa"] },
      { id: "s-32-2", pl: "Ona jest dzisiaj smutna.", fr: "Elle est triste aujourd'hui.", grammarFocus: "g-32-1",
        wordBank: ["Ona", "jest", "dzisiaj", "smutna", "smutny"] },
      { id: "s-32-3", pl: "Cieszę się, że jesteś.", fr: "Je suis content que tu sois là.", grammarFocus: "g-32-2",
        wordBank: ["Cieszę", "się", "że", "jesteś"] },
      { id: "s-32-4", pl: "Boję się psów.", fr: "J'ai peur des chiens.", grammarFocus: "g-32-2",
        wordBank: ["Boję", "się", "psów", "koty"] }
    ],
    dialogues: [
      {
        id: "d-32-1",
        title: "Comment ça va ?",
        lines: [
          { who: "A", pl: "Jak się dzisiaj czujesz?", fr: "Comment te sens-tu aujourd'hui ?" },
          { who: "B", pl: "Jestem trochę zmęczony.", fr: "Je suis un peu fatigué." },
          { who: "A", pl: "Dlaczego?", fr: "Pourquoi ?" },
          { who: "B", pl: "Martwię się o egzamin.", fr: "Je m'inquiète pour l'examen.",
            target: true, wordBank: ["Martwię", "się", "o", "egzamin", "cieszę"] }
        ]
      }
    ]
  },

  /* ======================= order 27 — Apparence ===================== */
  {
    id: "lesson-33",
    order: 32,
    title: "Décrire les gens — l'apparence",
    theme: "apparence",
    mascotIntro:
      "Grand, poilu, avec deux belles cornes : c'est Żubr ! Apprenons à décrire l'apparence des gens. 👀",
    grammarNotes: [
      {
        id: "g-33-1",
        title: "mieć + partie du corps (accord de l'adjectif)",
        explanationFr:
          "Pour décrire, on utilise « mieć » + adjectif + nom au pluriel : « Ma długie włosy » (des cheveux longs), « Ma niebieskie oczy » (des yeux bleus).",
        examples: [
          { pl: "Ona ma długie włosy.", fr: "Elle a les cheveux longs." },
          { pl: "On ma niebieskie oczy.", fr: "Il a les yeux bleus." }
        ]
      },
      {
        id: "g-33-2",
        title: "wyglądać — avoir l'air",
        explanationFr:
          "« Jak on wygląda? » = à quoi ressemble-t-il ? On décrit avec « jest » + adjectif : wysoki, niski, szczupły, przystojny.",
        examples: [
          { pl: "Jak wygląda twoja siostra?", fr: "À quoi ressemble ta sœur ?" },
          { pl: "Mój brat jest wysoki i szczupły.", fr: "Mon frère est grand et mince." }
        ]
      }
    ],
    vocabulary: [
      { id: "v-33-wygladac", pl: "wyglądać", fr: "avoir l'air / ressembler", category: "apparence" },
      { id: "v-33-wlosy", pl: "włosy", fr: "les cheveux", category: "apparence" },
      { id: "v-33-oczy", pl: "oczy", fr: "les yeux", category: "apparence" },
      { id: "v-33-wysoki", pl: "wysoki", fr: "grand (taille)", category: "apparence" },
      { id: "v-33-niski", pl: "niski", fr: "petit (taille)", category: "apparence" },
      { id: "v-33-szczuply", pl: "szczupły", fr: "mince", category: "apparence" },
      { id: "v-33-przystojny", pl: "przystojny", fr: "beau (homme)", category: "apparence" },
      { id: "v-33-ladna", pl: "ładna", fr: "jolie", category: "apparence" },
      { id: "v-33-broda", pl: "broda", fr: "la barbe", category: "apparence" },
      { id: "v-33-okulary", pl: "okulary", fr: "les lunettes", category: "apparence" },
      { id: "v-33-blond", pl: "blond", fr: "blond", category: "apparence" },
      { id: "v-33-siwy", pl: "siwy", fr: "gris (cheveux)", category: "apparence" }
    ],
    sentences: [
      { id: "s-33-1", pl: "Ona ma długie włosy.", fr: "Elle a les cheveux longs.", grammarFocus: "g-33-1",
        wordBank: ["Ona", "ma", "długie", "włosy", "krótkie"] },
      { id: "s-33-2", pl: "Mój brat jest wysoki i szczupły.", fr: "Mon frère est grand et mince.", grammarFocus: "g-33-2",
        wordBank: ["Mój", "brat", "jest", "wysoki", "i", "szczupły"] },
      { id: "s-33-3", pl: "On nosi okulary.", fr: "Il porte des lunettes.", grammarFocus: "g-33-1",
        wordBank: ["On", "nosi", "okulary"] },
      { id: "s-33-4", pl: "Jak on wygląda?", fr: "À quoi ressemble-t-il ?", grammarFocus: "g-33-2",
        wordBank: ["Jak", "on", "wygląda"] }
    ],
    dialogues: [
      {
        id: "d-33-1",
        title: "Reconnaître quelqu'un",
        lines: [
          { who: "A", pl: "Jak wygląda twoja siostra?", fr: "À quoi ressemble ta sœur ?" },
          { who: "B", pl: "Jest wysoka i ma blond włosy.", fr: "Elle est grande et a les cheveux blonds." },
          { who: "A", pl: "A oczy?", fr: "Et ses yeux ?" },
          { who: "B", pl: "Ma niebieskie oczy.", fr: "Elle a les yeux bleus.",
            target: true, wordBank: ["Ma", "niebieskie", "oczy", "zielone"] }
        ]
      }
    ]
  },

  /* ======================= order 28 — Impératif ===================== */
  {
    id: "lesson-34",
    order: 33,
    title: "Ordres et conseils — l'impératif",
    theme: "impératif",
    mascotIntro:
      "« Viens ! Prends ! Écoute ! » Żubr donne (gentiment) des ordres. Voici l'impératif, très utile au quotidien. ✋",
    grammarNotes: [
      {
        id: "g-34-1",
        title: "L'impératif (tu)",
        explanationFr:
          "On le forme souvent sur le radical du présent : robić → rób!, pisać → pisz!, słuchać → słuchaj!. Perfectif pour une action précise : zrobić → zrób!, wziąć → weź!. Irréguliers utiles : chodź! (viens), bądź! (sois).",
        examples: [
          { pl: "Chodź tutaj!", fr: "Viens ici !" },
          { pl: "Weź parasol, pada deszcz.", fr: "Prends un parapluie, il pleut." }
        ]
      },
      {
        id: "g-34-2",
        title: "Interdire et adoucir",
        explanationFr:
          "Défense : « nie » + impératif imperfectif : « Nie martw się! » (ne t'inquiète pas). Pour être poli, on ajoute « proszę » : « Zamknij okno, proszę ».",
        examples: [
          { pl: "Nie martw się!", fr: "Ne t'inquiète pas !" },
          { pl: "Zamknij okno, proszę.", fr: "Ferme la fenêtre, s'il te plaît." }
        ]
      }
    ],
    vocabulary: [
      { id: "v-34-chodz", pl: "chodź", fr: "viens", category: "impératif" },
      { id: "v-34-wez", pl: "weź", fr: "prends", category: "impératif" },
      { id: "v-34-poczekaj", pl: "poczekaj", fr: "attends", category: "impératif" },
      { id: "v-34-sluchaj", pl: "słuchaj", fr: "écoute", category: "impératif" },
      { id: "v-34-powiedz", pl: "powiedz", fr: "dis", category: "impératif" },
      { id: "v-34-otworz", pl: "otwórz", fr: "ouvre", category: "impératif" },
      { id: "v-34-zamknij", pl: "zamknij", fr: "ferme", category: "impératif" },
      { id: "v-34-pomoz", pl: "pomóż", fr: "aide", category: "impératif" },
      { id: "v-34-pospieszsie", pl: "pospiesz się", fr: "dépêche-toi", category: "impératif" },
      { id: "v-34-uwazaj", pl: "uważaj", fr: "fais attention", category: "impératif" },
      { id: "v-34-zrob", pl: "zrób", fr: "fais (une fois)", category: "impératif" },
      { id: "v-34-parasol", pl: "parasol", fr: "le parapluie", category: "objet" }
    ],
    sentences: [
      { id: "s-34-1", pl: "Chodź tutaj!", fr: "Viens ici !", grammarFocus: "g-34-1",
        wordBank: ["Chodź", "tutaj"] },
      { id: "s-34-2", pl: "Zamknij okno, proszę.", fr: "Ferme la fenêtre, s'il te plaît.", grammarFocus: "g-34-2",
        wordBank: ["Zamknij", "okno", "proszę", "otwórz"] },
      { id: "s-34-3", pl: "Nie martw się!", fr: "Ne t'inquiète pas !", grammarFocus: "g-34-2",
        wordBank: ["Nie", "martw", "się"] },
      { id: "s-34-4", pl: "Weź parasol, pada deszcz.", fr: "Prends un parapluie, il pleut.", grammarFocus: "g-34-1",
        wordBank: ["Weź", "parasol", "pada", "deszcz", "chodź"] }
    ],
    dialogues: [
      {
        id: "d-34-1",
        title: "En retard !",
        lines: [
          { who: "A", pl: "Spóźnimy się na pociąg!", fr: "On va rater le train !" },
          { who: "B", pl: "Pospiesz się!", fr: "Dépêche-toi !" },
          { who: "A", pl: "Gdzie są bilety?", fr: "Où sont les billets ?" },
          { who: "B", pl: "Weź bilety ze stołu.", fr: "Prends les billets sur la table.",
            target: true, wordBank: ["Weź", "bilety", "ze", "stołu", "stół"] }
        ]
      }
    ]
  },

  /* ======================= order 31 — Voyage ======================== */
  {
    id: "lesson-35",
    order: 36,
    title: "Voyage et hébergement — podróże",
    theme: "voyage",
    mascotIntro:
      "Żubr rêve de voir la mer. Valise bouclée, réservation faite : en route pour l'aventure ! 🧳",
    grammarNotes: [
      {
        id: "g-35-1",
        title: "Réserver et demander",
        explanationFr:
          "« Chcę zarezerwować pokój » = je veux réserver une chambre. « Mamy rezerwację na dwie noce » (na + accusatif pour la durée).",
        examples: [
          { pl: "Chcę zarezerwować pokój.", fr: "Je veux réserver une chambre." },
          { pl: "Mamy rezerwację na dwie noce.", fr: "Nous avons une réservation pour deux nuits." }
        ]
      },
      {
        id: "g-35-2",
        title: "zwiedzać — visiter (tourisme)",
        explanationFr:
          "« zwiedzać » (visiter un lieu) + accusatif : zwiedzać miasto, zwiedzać muzeum. À ne pas confondre avec « odwiedzać » (rendre visite à une personne).",
        examples: [
          { pl: "Lubię zwiedzać stare miasta.", fr: "J'aime visiter les vieilles villes." },
          { pl: "Jutro zwiedzamy muzeum.", fr: "Demain nous visitons le musée." }
        ]
      }
    ],
    vocabulary: [
      { id: "v-35-hotel", pl: "hotel", fr: "l'hôtel", category: "voyage" },
      { id: "v-35-rezerwacja", pl: "rezerwacja", fr: "la réservation", category: "voyage" },
      { id: "v-35-walizka", pl: "walizka", fr: "la valise", category: "voyage" },
      { id: "v-35-paszport", pl: "paszport", fr: "le passeport", category: "voyage" },
      { id: "v-35-nocleg", pl: "nocleg", fr: "l'hébergement / la nuitée", category: "voyage" },
      { id: "v-35-recepcja", pl: "recepcja", fr: "la réception", category: "voyage" },
      { id: "v-35-klucz", pl: "klucz", fr: "la clé", category: "voyage" },
      { id: "v-35-bagaz", pl: "bagaż", fr: "le bagage", category: "voyage" },
      { id: "v-35-zwiedzac", pl: "zwiedzać", fr: "visiter (un lieu)", category: "verbe" },
      { id: "v-35-pamiatka", pl: "pamiątka", fr: "le souvenir (objet)", category: "voyage" },
      { id: "v-35-plaza", pl: "plaża", fr: "la plage", category: "voyage" },
      { id: "v-35-noc", pl: "noc", fr: "la nuit", category: "temps" }
    ],
    sentences: [
      { id: "s-35-1", pl: "Chcę zarezerwować pokój.", fr: "Je veux réserver une chambre.", grammarFocus: "g-35-1",
        wordBank: ["Chcę", "zarezerwować", "pokój"] },
      { id: "s-35-2", pl: "Gdzie jest moja walizka?", fr: "Où est ma valise ?", grammarFocus: "g-35-2",
        wordBank: ["Gdzie", "jest", "moja", "walizka"] },
      { id: "s-35-3", pl: "Mamy rezerwację na dwie noce.", fr: "Nous avons une réservation pour deux nuits.", grammarFocus: "g-35-1",
        wordBank: ["Mamy", "rezerwację", "na", "dwie", "noce"] },
      { id: "s-35-4", pl: "Lubię zwiedzać stare miasta.", fr: "J'aime visiter les vieilles villes.", grammarFocus: "g-35-2",
        wordBank: ["Lubię", "zwiedzać", "stare", "miasta", "miasto"] }
    ],
    dialogues: [
      {
        id: "d-35-1",
        title: "À la réception",
        lines: [
          { who: "A", pl: "Dzień dobry, mam rezerwację.", fr: "Bonjour, j'ai une réservation." },
          { who: "B", pl: "Na jakie nazwisko?", fr: "À quel nom ?" },
          { who: "A", pl: "Na nazwisko Kowalski.", fr: "Au nom de Kowalski." },
          { who: "B", pl: "Oto klucz do pokoju.", fr: "Voici la clé de la chambre.",
            target: true, wordBank: ["Oto", "klucz", "do", "pokoju", "pokój"] }
        ]
      }
    ]
  },

  /* ======================= order 32 — Téléphone ===================== */
  {
    id: "lesson-36",
    order: 37,
    title: "Au téléphone et en ligne — telefon i internet",
    theme: "communication",
    mascotIntro:
      "Żubr n'a pas de pouce pour taper, mais il adore les appels vidéo. Apprenons à communiquer par téléphone et en ligne ! 📱",
    grammarNotes: [
      {
        id: "g-36-1",
        title: "dzwonić do + génitif",
        explanationFr:
          "« Téléphoner à quelqu'un » = « dzwonić do » + génitif. « Dzwonię do mamy », « Zadzwonię do ciebie » (ty → ciebie).",
        examples: [
          { pl: "Zadzwonię do ciebie wieczorem.", fr: "Je t'appellerai ce soir." },
          { pl: "Dzwonię do lekarza.", fr: "J'appelle le médecin." }
        ]
      },
      {
        id: "g-36-2",
        title: "Envoyer, écrire, se connecter",
        explanationFr:
          "wysłać wiadomość (envoyer un message), napisać e-mail (écrire un mail). En négation, l'objet passe au génitif : « Nie pamiętam hasła » (hasło → hasła).",
        examples: [
          { pl: "Wysłałem ci wiadomość.", fr: "Je t'ai envoyé un message." },
          { pl: "Nie pamiętam hasła.", fr: "Je ne me souviens pas du mot de passe." }
        ]
      }
    ],
    vocabulary: [
      { id: "v-36-dzwonic", pl: "dzwonić", fr: "téléphoner", category: "communication" },
      { id: "v-36-zadzwonic", pl: "zadzwonić", fr: "appeler (une fois)", category: "communication" },
      { id: "v-36-wiadomosc", pl: "wiadomość", fr: "le message", category: "communication" },
      { id: "v-36-rozmowa", pl: "rozmowa", fr: "la conversation", category: "communication" },
      { id: "v-36-internet", pl: "internet", fr: "internet", category: "communication" },
      { id: "v-36-strona", pl: "strona internetowa", fr: "le site web", category: "communication" },
      { id: "v-36-haslo", pl: "hasło", fr: "le mot de passe", category: "communication" },
      { id: "v-36-aplikacja", pl: "aplikacja", fr: "l'application", category: "communication" },
      { id: "v-36-wyslac", pl: "wysłać", fr: "envoyer", category: "verbe" },
      { id: "v-36-odebrac", pl: "odebrać", fr: "décrocher / répondre", category: "verbe" },
      { id: "v-36-numer", pl: "numer", fr: "le numéro", category: "communication" },
      { id: "v-36-polaczenie", pl: "połączenie", fr: "la connexion / l'appel", category: "communication" }
    ],
    sentences: [
      { id: "s-36-1", pl: "Zadzwonię do ciebie wieczorem.", fr: "Je t'appellerai ce soir.", grammarFocus: "g-36-1",
        wordBank: ["Zadzwonię", "do", "ciebie", "wieczorem", "ciebie"] },
      { id: "s-36-2", pl: "Wysłałem ci wiadomość.", fr: "Je t'ai envoyé un message.", grammarFocus: "g-36-2",
        wordBank: ["Wysłałem", "ci", "wiadomość"] },
      { id: "s-36-3", pl: "Nie pamiętam hasła.", fr: "Je ne me souviens pas du mot de passe.", grammarFocus: "g-36-2",
        wordBank: ["Nie", "pamiętam", "hasła", "hasło"] },
      { id: "s-36-4", pl: "Jaki masz numer telefonu?", fr: "Quel est ton numéro de téléphone ?", grammarFocus: "g-36-1",
        wordBank: ["Jaki", "masz", "numer", "telefonu", "telefon"] }
    ],
    dialogues: [
      {
        id: "d-36-1",
        title: "Un appel difficile",
        lines: [
          { who: "A", pl: "Halo? Kto mówi?", fr: "Allô ? Qui est-ce ?" },
          { who: "B", pl: "Cześć, tu Marek.", fr: "Salut, c'est Marek." },
          { who: "A", pl: "Nie słyszę cię dobrze.", fr: "Je ne t'entends pas bien." },
          { who: "B", pl: "Zadzwonię do ciebie później.", fr: "Je te rappellerai plus tard.",
            target: true, wordBank: ["Zadzwonię", "do", "ciebie", "później", "teraz"] }
        ]
      }
    ]
  },

  /* ======================= order 34 — Fêtes ========================= */
  {
    id: "lesson-37",
    order: 39,
    title: "Fêtes et traditions — święta",
    theme: "fêtes",
    mascotIntro:
      "Gâteau, cadeaux, vœux : Żubr adore faire la fête (surtout le gâteau). Apprenons à souhaiter et à célébrer ! 🎂",
    grammarNotes: [
      {
        id: "g-37-1",
        title: "Souhaiter : życzyć + datif + génitif",
        explanationFr:
          "« Życzę ci… » = je te souhaite… La personne est au datif (ci, wam), la chose souhaitée au génitif : « Życzę ci zdrowia i szczęścia ». Le classique : « Wszystkiego najlepszego! ».",
        examples: [
          { pl: "Wszystkiego najlepszego!", fr: "Tous mes vœux ! / Joyeux anniversaire !" },
          { pl: "Życzę ci zdrowia i szczęścia.", fr: "Je te souhaite santé et bonheur." }
        ]
      },
      {
        id: "g-37-2",
        title: "Remercier : dziękować za + accusatif",
        explanationFr:
          "« Merci pour… » = « dziękuję za » + accusatif. « Dziękuję za prezent », « Dziękuję za zaproszenie ».",
        examples: [
          { pl: "Dziękuję za prezent.", fr: "Merci pour le cadeau." },
          { pl: "Dziękuję za zaproszenie.", fr: "Merci pour l'invitation." }
        ]
      }
    ],
    vocabulary: [
      { id: "v-37-swieto", pl: "święto", fr: "la fête / le jour férié", category: "fêtes" },
      { id: "v-37-urodziny", pl: "urodziny", fr: "l'anniversaire", category: "fêtes" },
      { id: "v-37-bozenarodzenie", pl: "Boże Narodzenie", fr: "Noël", category: "fêtes" },
      { id: "v-37-wielkanoc", pl: "Wielkanoc", fr: "Pâques", category: "fêtes" },
      { id: "v-37-zyczenia", pl: "życzenia", fr: "les vœux", category: "fêtes" },
      { id: "v-37-tort", pl: "tort", fr: "le gâteau (d'anniversaire)", category: "fêtes" },
      { id: "v-37-swietowac", pl: "świętować", fr: "fêter", category: "verbe" },
      { id: "v-37-zaprosic", pl: "zaprosić", fr: "inviter", category: "verbe" },
      { id: "v-37-zaproszenie", pl: "zaproszenie", fr: "l'invitation", category: "fêtes" },
      { id: "v-37-choinka", pl: "choinka", fr: "le sapin de Noël", category: "fêtes" },
      { id: "v-37-zdrowie", pl: "zdrowie", fr: "la santé", category: "fêtes" },
      { id: "v-37-szczescie", pl: "szczęście", fr: "le bonheur / la chance", category: "fêtes" }
    ],
    sentences: [
      { id: "s-37-1", pl: "Wszystkiego najlepszego!", fr: "Tous mes vœux !", grammarFocus: "g-37-1",
        wordBank: ["Wszystkiego", "najlepszego"] },
      { id: "s-37-2", pl: "Życzę ci zdrowia i szczęścia.", fr: "Je te souhaite santé et bonheur.", grammarFocus: "g-37-1",
        wordBank: ["Życzę", "ci", "zdrowia", "i", "szczęścia"] },
      { id: "s-37-3", pl: "W grudniu świętujemy Boże Narodzenie.", fr: "En décembre nous fêtons Noël.", grammarFocus: "g-37-2",
        wordBank: ["W", "grudniu", "świętujemy", "Boże", "Narodzenie"] },
      { id: "s-37-4", pl: "Dziękuję za prezent.", fr: "Merci pour le cadeau.", grammarFocus: "g-37-2",
        wordBank: ["Dziękuję", "za", "prezent"] }
    ],
    dialogues: [
      {
        id: "d-37-1",
        title: "Joyeux anniversaire !",
        lines: [
          { who: "A", pl: "Wszystkiego najlepszego z okazji urodzin!", fr: "Joyeux anniversaire !" },
          { who: "B", pl: "Dziękuję bardzo!", fr: "Merci beaucoup !" },
          { who: "A", pl: "Mam dla ciebie prezent.", fr: "J'ai un cadeau pour toi." },
          { who: "B", pl: "Życzę ci dużo szczęścia.", fr: "Je te souhaite beaucoup de bonheur.",
            target: true, wordBank: ["Życzę", "ci", "dużo", "szczęścia", "tobie"] }
        ]
      }
    ]
  },

  /* ======================= order 35 — Pronoms ======================= */
  {
    id: "lesson-38",
    order: 41,
    title: "Les pronoms déclinés — mnie, cię, go, ją",
    theme: "pronoms",
    mascotIntro:
      "« Tu me vois ? Je te vois ! » Pour ne pas répéter les noms, on utilise des pronoms — qui changent de forme selon le cas. 🔁",
    grammarNotes: [
      {
        id: "g-38-1",
        title: "Les pronoms à l'accusatif (COD)",
        explanationFr:
          "me/te/le/la… : mnie (me), cię/ciebie (te), go (le), ją (la), nas (nous), was (vous), ich/je (les). « Znam go », « Widzę ją ».",
        examples: [
          { pl: "Znam go dobrze.", fr: "Je le connais bien." },
          { pl: "Czy widzisz ją?", fr: "La vois-tu ?" }
        ]
      },
      {
        id: "g-38-2",
        title: "Les pronoms au datif (à qui)",
        explanationFr:
          "à moi/toi/lui… : mi (me), ci (te), mu (lui), jej (à elle), nam (nous), wam (vous), im (leur). « Daj mi to », « Pomogę wam ».",
        examples: [
          { pl: "Daj mi to.", fr: "Donne-moi ça." },
          { pl: "Pomogę wam jutro.", fr: "Je vous aiderai demain." }
        ]
      }
    ],
    vocabulary: [
      { id: "v-38-mnie", pl: "mnie", fr: "me / moi (accusatif)", category: "pronom" },
      { id: "v-38-cie", pl: "cię", fr: "te (accusatif)", category: "pronom" },
      { id: "v-38-go", pl: "go", fr: "le (accusatif)", category: "pronom" },
      { id: "v-38-ja", pl: "ją", fr: "la (accusatif)", category: "pronom" },
      { id: "v-38-nas", pl: "nas", fr: "nous (accusatif)", category: "pronom" },
      { id: "v-38-was", pl: "was", fr: "vous (accusatif)", category: "pronom" },
      { id: "v-38-mi", pl: "mi", fr: "me / à moi (datif)", category: "pronom" },
      { id: "v-38-ci", pl: "ci", fr: "te / à toi (datif)", category: "pronom" },
      { id: "v-38-mu", pl: "mu", fr: "lui / à lui (datif)", category: "pronom" },
      { id: "v-38-jej", pl: "jej", fr: "à elle (datif)", category: "pronom" },
      { id: "v-38-nam", pl: "nam", fr: "nous / à nous (datif)", category: "pronom" },
      { id: "v-38-im", pl: "im", fr: "leur / à eux (datif)", category: "pronom" }
    ],
    sentences: [
      { id: "s-38-1", pl: "Znam go dobrze.", fr: "Je le connais bien.", grammarFocus: "g-38-1",
        wordBank: ["Znam", "go", "dobrze", "ją"] },
      { id: "s-38-2", pl: "Czy widzisz ją?", fr: "La vois-tu ?", grammarFocus: "g-38-1",
        wordBank: ["Czy", "widzisz", "ją", "go"] },
      { id: "s-38-3", pl: "Daj mi to.", fr: "Donne-moi ça.", grammarFocus: "g-38-2",
        wordBank: ["Daj", "mi", "to", "ci"] },
      { id: "s-38-4", pl: "Pomogę wam jutro.", fr: "Je vous aiderai demain.", grammarFocus: "g-38-2",
        wordBank: ["Pomogę", "wam", "jutro", "nam"] }
    ],
    dialogues: [
      {
        id: "d-38-1",
        title: "Où est Anna ?",
        lines: [
          { who: "A", pl: "Gdzie jest Anna? Szukam jej.", fr: "Où est Anna ? Je la cherche." },
          { who: "B", pl: "Widziałem ją w parku.", fr: "Je l'ai vue dans le parc." },
          { who: "A", pl: "Możesz do niej zadzwonić?", fr: "Tu peux l'appeler ?" },
          { who: "B", pl: "Tak, zadzwonię do niej teraz.", fr: "Oui, je l'appelle tout de suite.",
            target: true, wordBank: ["Tak", "zadzwonię", "do", "niej", "teraz", "nich"] }
        ]
      }
    ]
  },

  /* ======================= order 38 — Nature ======================== */
  {
    id: "lesson-39",
    order: 46,
    title: "La nature et les animaux — przyroda",
    theme: "nature",
    mascotIntro:
      "La forêt, c'est la maison de Żubr ! Arbres, lacs, oiseaux… et bien sûr, le roi des lieux : le bison. 🌳🦬",
    grammarNotes: [
      {
        id: "g-39-1",
        title: "Où l'on est : w / nad + locatif",
        explanationFr:
          "Lieu : « w lesie » (dans la forêt), « nad jeziorem » (au bord du lac, nad + instrumental), « w górach » (à la montagne, pluriel).",
        examples: [
          { pl: "Nad jeziorem rosną wysokie drzewa.", fr: "De grands arbres poussent au bord du lac." },
          { pl: "W lesie mieszkają dzikie zwierzęta.", fr: "Des animaux sauvages vivent dans la forêt." }
        ]
      },
      {
        id: "g-39-2",
        title: "Où l'on va : nad / w + accusatif",
        explanationFr:
          "Direction : « nad morze » (à la mer), « w góry » (à la montagne). Le lieu prend l'accusatif quand on s'y rend.",
        examples: [
          { pl: "Latem jeżdżę nad morze.", fr: "En été je vais à la mer." },
          { pl: "Jadę w góry.", fr: "Je vais à la montagne." }
        ]
      }
    ],
    vocabulary: [
      { id: "v-39-przyroda", pl: "przyroda", fr: "la nature", category: "nature" },
      { id: "v-39-las", pl: "las", fr: "la forêt", category: "nature" },
      { id: "v-39-jezioro", pl: "jezioro", fr: "le lac", category: "nature" },
      { id: "v-39-gora", pl: "góra", fr: "la montagne", category: "nature" },
      { id: "v-39-rzeka", pl: "rzeka", fr: "la rivière", category: "nature" },
      { id: "v-39-morze", pl: "morze", fr: "la mer", category: "nature" },
      { id: "v-39-drzewo", pl: "drzewo", fr: "l'arbre", category: "nature" },
      { id: "v-39-kwiat", pl: "kwiat", fr: "la fleur", category: "nature" },
      { id: "v-39-ptak", pl: "ptak", fr: "l'oiseau", category: "animaux" },
      { id: "v-39-ryba", pl: "ryba", fr: "le poisson", category: "animaux" },
      { id: "v-39-niedzwiedz", pl: "niedźwiedź", fr: "l'ours", category: "animaux" },
      { id: "v-39-zubr", pl: "żubr", fr: "le bison", category: "animaux" }
    ],
    sentences: [
      { id: "s-39-1", pl: "W lesie mieszkają dzikie zwierzęta.", fr: "Des animaux sauvages vivent dans la forêt.", grammarFocus: "g-39-1",
        wordBank: ["W", "lesie", "mieszkają", "dzikie", "zwierzęta", "lasie"] },
      { id: "s-39-2", pl: "Latem jeżdżę nad morze.", fr: "En été je vais à la mer.", grammarFocus: "g-39-2",
        wordBank: ["Latem", "jeżdżę", "nad", "morze", "morzem"] },
      { id: "s-39-3", pl: "Żubr to symbol Polski.", fr: "Le bison est un symbole de la Pologne.", grammarFocus: "g-39-1",
        wordBank: ["Żubr", "to", "symbol", "Polski"] },
      { id: "s-39-4", pl: "Nad jeziorem rosną wysokie drzewa.", fr: "De grands arbres poussent au bord du lac.", grammarFocus: "g-39-1",
        wordBank: ["Nad", "jeziorem", "rosną", "wysokie", "drzewa", "jezioro"] }
    ],
    dialogues: [
      {
        id: "d-39-1",
        title: "Projets de vacances",
        lines: [
          { who: "A", pl: "Dokąd jedziesz na wakacje?", fr: "Où pars-tu en vacances ?" },
          { who: "B", pl: "Jadę w góry.", fr: "Je vais à la montagne." },
          { who: "A", pl: "Co tam będziesz robić?", fr: "Qu'est-ce que tu vas y faire ?" },
          { who: "B", pl: "Będę chodzić po lesie.", fr: "Je vais me promener en forêt.",
            target: true, wordBank: ["Będę", "chodzić", "po", "lesie", "lasie"] }
        ]
      }
    ]
  },

  /* ======================= order 40 — Récit ========================= */
  {
    id: "lesson-40",
    order: 54,
    title: "Raconter une histoire — récit au passé",
    theme: "récit",
    mascotIntro:
      "« D'abord j'ai brouté, ensuite j'ai dormi, et finalement… encore brouté. » Żubr raconte sa journée. À toi de relier les événements ! 📖",
    grammarNotes: [
      {
        id: "g-40-1",
        title: "Les connecteurs du récit",
        explanationFr:
          "Pour enchaîner : najpierw (d'abord), potem (ensuite), później (plus tard), nagle (soudain), w końcu (finalement), dlatego (c'est pourquoi).",
        examples: [
          { pl: "Najpierw zjadłem śniadanie.", fr: "D'abord j'ai mangé le petit-déjeuner." },
          { pl: "W końcu wróciłem do domu.", fr: "Finalement je suis rentré à la maison." }
        ]
      },
      {
        id: "g-40-2",
        title: "Enchaîner le passé",
        explanationFr:
          "On combine les verbes au passé (accord en genre) avec ces connecteurs pour raconter une suite d'actions. « Potem poszedłem… nagle zaczął padać deszcz… ».",
        examples: [
          { pl: "Potem poszedłem do pracy.", fr: "Ensuite je suis allé au travail." },
          { pl: "Nagle zaczął padać deszcz.", fr: "Soudain il s'est mis à pleuvoir." }
        ]
      }
    ],
    vocabulary: [
      { id: "v-40-najpierw", pl: "najpierw", fr: "d'abord", category: "connecteur" },
      { id: "v-40-potem", pl: "potem", fr: "ensuite", category: "connecteur" },
      { id: "v-40-pozniej", pl: "później", fr: "plus tard", category: "connecteur" },
      { id: "v-40-wkoncu", pl: "w końcu", fr: "finalement", category: "connecteur" },
      { id: "v-40-nagle", pl: "nagle", fr: "soudain", category: "connecteur" },
      { id: "v-40-dlatego", pl: "dlatego", fr: "c'est pourquoi", category: "connecteur" },
      { id: "v-40-wtedy", pl: "wtedy", fr: "alors / à ce moment-là", category: "connecteur" },
      { id: "v-40-kiedys", pl: "kiedyś", fr: "un jour / autrefois", category: "connecteur" },
      { id: "v-40-zawsze", pl: "zawsze", fr: "toujours", category: "temps" },
      { id: "v-40-nigdy", pl: "nigdy", fr: "jamais", category: "temps" },
      { id: "v-40-opowiadac", pl: "opowiadać", fr: "raconter", category: "verbe" },
      { id: "v-40-historia", pl: "historia", fr: "l'histoire", category: "récit" }
    ],
    sentences: [
      { id: "s-40-1", pl: "Najpierw zjadłem śniadanie.", fr: "D'abord j'ai mangé le petit-déjeuner.", grammarFocus: "g-40-1",
        wordBank: ["Najpierw", "zjadłem", "śniadanie", "potem"] },
      { id: "s-40-2", pl: "Potem poszedłem do pracy.", fr: "Ensuite je suis allé au travail.", grammarFocus: "g-40-2",
        wordBank: ["Potem", "poszedłem", "do", "pracy", "najpierw"] },
      { id: "s-40-3", pl: "Nagle zaczął padać deszcz.", fr: "Soudain il s'est mis à pleuvoir.", grammarFocus: "g-40-2",
        wordBank: ["Nagle", "zaczął", "padać", "deszcz"] },
      { id: "s-40-4", pl: "W końcu wróciłem do domu.", fr: "Finalement je suis rentré à la maison.", grammarFocus: "g-40-1",
        wordBank: ["W", "końcu", "wróciłem", "do", "domu", "później"] }
    ],
    dialogues: [
      {
        id: "d-40-1",
        title: "Raconte-moi ta journée",
        lines: [
          { who: "A", pl: "Jak minął twój dzień?", fr: "Comment s'est passée ta journée ?" },
          { who: "B", pl: "Najpierw byłem w pracy.", fr: "D'abord j'étais au travail." },
          { who: "A", pl: "A potem?", fr: "Et ensuite ?" },
          { who: "B", pl: "Potem spotkałem się z przyjaciółmi.", fr: "Ensuite j'ai retrouvé des amis." },
          { who: "A", pl: "I co dalej?", fr: "Et après ?" },
          { who: "B", pl: "W końcu wróciłem do domu.", fr: "Finalement je suis rentré à la maison.",
            target: true, wordBank: ["W", "końcu", "wróciłem", "do", "domu", "potem"] }
        ]
      }
    ]
  },

  /* =====================================================================
     LEÇONS B1 — intercalées via `order`, comme le bloc A2 ci-dessus.
     ⚠️ Contenu à faire relire par une personne polonophone.
     Référence de calibrage : "Z językiem polskim każdego dnia" (Mandziej,
     2020), niveau annoncé "A2 z elementami B1" — cf. plan.
     ===================================================================== */

  /* ======================= order 23 — Adjectif (cas) ================= */
  {
    id: "lesson-43",
    order: 26,
    title: "L'adjectif décliné à tous les cas",
    theme: "adjectifs",
    mascotIntro:
      "Żubr veut décrire son voisin sympathique, sa décision difficile, son ami curieux — dans tous les cas, pas seulement au nominatif et à l'accusatif. 🧩",
    grammarNotes: [
      {
        id: "g-43-1",
        title: "L'adjectif au génitif",
        explanationFr:
          "Après « nie ma » et les verbes qui demandent le génitif (szukać, potrzebować) : féminin -a → -ej (miła → miłej), masculin/neutre -y/-i/-e → -ego (miły → miłego, gotowe → gotowego).",
        examples: [
          { pl: "Szukam miłego sąsiada.", fr: "Je cherche un voisin sympathique.", note: "génitif masc." },
          { pl: "Nie mam gotowego rozwiązania.", fr: "Je n'ai pas de solution toute prête." }
        ]
      },
      {
        id: "g-43-2",
        title: "L'adjectif à l'instrumental et au locatif",
        explanationFr:
          "Instrumental (z, przez) : -ym (masc./neutre), -ą (fém.). Locatif (o, w, na) : -ym (masc./neutre), -ej (fém.). « Rozmawiam z miłym sąsiadem », « Myślę o trudnej decyzji ».",
        examples: [
          { pl: "Rozmawiam z zajętym kolegą.", fr: "Je parle avec un collègue occupé.", note: "instrumental" },
          { pl: "Myślę o trudnej decyzji.", fr: "Je pense à une décision difficile.", note: "locatif" }
        ]
      }
    ],
    vocabulary: [
      { id: "v-43-sasiad", pl: "sąsiad", fr: "le voisin", category: "personne" },
      { id: "v-43-rozwiazanie", pl: "rozwiązanie", fr: "la solution", category: "objet" },
      { id: "v-43-decyzja", pl: "decyzja", fr: "la décision", category: "objet" },
      { id: "v-43-problem", pl: "problem", fr: "le problème", category: "objet" },
      { id: "v-43-zajety", pl: "zajęty", fr: "occupé", category: "description" },
      { id: "v-43-pewny", pl: "pewny", fr: "sûr / certain", category: "description" },
      { id: "v-43-gotowy", pl: "gotowy", fr: "prêt", category: "description" },
      { id: "v-43-znany", pl: "znany", fr: "connu / célèbre", category: "description" },
      { id: "v-43-szukac", pl: "szukać", fr: "chercher (+ génitif)", category: "verbe" },
      { id: "v-43-potrzebowac", pl: "potrzebować", fr: "avoir besoin de (+ génitif)", category: "verbe" },
      { id: "v-43-rozmawiac", pl: "rozmawiać", fr: "discuter / parler avec", category: "verbe" }
    ],
    sentences: [
      { id: "s-43-1", pl: "Szukam miłego sąsiada.", fr: "Je cherche un voisin sympathique.", grammarFocus: "g-43-1",
        wordBank: ["Szukam", "miłego", "sąsiada", "miły", "sąsiad"] },
      { id: "s-43-2", pl: "Nie mam gotowego rozwiązania.", fr: "Je n'ai pas de solution toute prête.", grammarFocus: "g-43-1",
        wordBank: ["Nie", "mam", "gotowego", "rozwiązania", "gotowe", "rozwiązanie"] },
      { id: "s-43-3", pl: "Rozmawiam z zajętym kolegą.", fr: "Je parle avec un collègue occupé.", grammarFocus: "g-43-2",
        wordBank: ["Rozmawiam", "z", "zajętym", "kolegą", "zajęty", "kolega"] },
      { id: "s-43-4", pl: "Myślę o trudnej decyzji.", fr: "Je pense à une décision difficile.", grammarFocus: "g-43-2",
        wordBank: ["Myślę", "o", "trudnej", "decyzji", "trudna", "decyzja"] }
    ]
  },

  /* ==================== order 26 — Aspect approfondi ================== */
  {
    id: "lesson-41",
    order: 29,
    title: "Aspect approfondi : perfectif et imperfectif à l'usage",
    theme: "aspect",
    mascotIntro:
      "Żubr sait déjà qu'il existe deux verbes pour une même action. Il est temps de vraiment s'en servir — au passé, au futur, sans « będę ». 🔁",
    grammarNotes: [
      {
        id: "g-41-1",
        title: "Le futur perfectif, sans « będę »",
        explanationFr:
          "Le perfectif se conjugue comme le présent mais désigne un futur ponctuel et achevé : przeczytam (je lirai), napiszę (j'écrirai), skończę (je finirai). Jamais de « będę » avec un verbe perfectif.",
        examples: [
          { pl: "Przeczytam tę książkę do piątku.", fr: "Je lirai ce livre avant vendredi.", note: "perfectif" },
          { pl: "Napiszę ci wiadomość, jak tylko skończę.", fr: "Je t'écrirai un message dès que j'aurai fini." }
        ]
      },
      {
        id: "g-41-2",
        title: "Paires aspectuelles courantes",
        explanationFr:
          "Beaucoup de paires changent de radical : iść/pójść (aller à pied), jechać/pojechać (aller en véhicule), widzieć/zobaczyć (voir). Le perfectif marque un résultat ponctuel, pas une habitude.",
        examples: [
          { pl: "Codziennie idę do pracy, ale dziś pójdę wcześniej.", fr: "Chaque jour je vais au travail, mais aujourd'hui j'irai plus tôt.", note: "imperfectif puis perfectif" },
          { pl: "Wczoraj zobaczyłem coś dziwnego.", fr: "Hier j'ai vu quelque chose de bizarre.", note: "perfectif, passé ponctuel" }
        ]
      }
    ],
    vocabulary: [
      { id: "v-41-przeczytac", pl: "przeczytać", fr: "lire (perfectif)", category: "verbe" },
      { id: "v-41-napisac", pl: "napisać", fr: "écrire (perfectif)", category: "verbe" },
      { id: "v-41-zobaczyc", pl: "zobaczyć", fr: "voir (perfectif)", category: "verbe" },
      { id: "v-41-powiedziec", pl: "powiedzieć", fr: "dire (perfectif)", category: "verbe" },
      { id: "v-41-pojsc", pl: "pójść", fr: "aller à pied (perfectif)", category: "verbe" },
      { id: "v-41-pojechac", pl: "pojechać", fr: "aller en véhicule (perfectif)", category: "verbe" },
      { id: "v-41-skonczyc", pl: "skończyć", fr: "finir / terminer (perfectif)", category: "verbe" },
      { id: "v-41-zaczac", pl: "zacząć", fr: "commencer (perfectif)", category: "verbe" },
      { id: "v-41-czasami", pl: "czasami", fr: "parfois", category: "adverbe" },
      { id: "v-41-znowu", pl: "znowu", fr: "encore une fois / à nouveau", category: "adverbe" },
      { id: "v-41-wreszcie", pl: "wreszcie", fr: "enfin", category: "adverbe" }
    ],
    sentences: [
      { id: "s-41-1", pl: "Codziennie idę do pracy, ale dziś pójdę wcześniej.", fr: "Chaque jour je vais au travail, mais aujourd'hui j'irai plus tôt.", grammarFocus: "g-41-2",
        wordBank: ["Codziennie", "idę", "do", "pracy", "ale", "dziś", "pójdę", "wcześniej"] },
      { id: "s-41-2", pl: "Przeczytam tę książkę do piątku.", fr: "Je lirai ce livre avant vendredi.", grammarFocus: "g-41-1",
        wordBank: ["Przeczytam", "tę", "książkę", "do", "piątku", "czytam"] },
      { id: "s-41-3", pl: "Wczoraj zobaczyłem coś dziwnego.", fr: "Hier j'ai vu quelque chose de bizarre.", grammarFocus: "g-41-2",
        wordBank: ["Wczoraj", "zobaczyłem", "coś", "dziwnego", "widziałem"] },
      { id: "s-41-4", pl: "Napiszę ci wiadomość, jak tylko skończę.", fr: "Je t'écrirai un message dès que j'aurai fini.", grammarFocus: "g-41-1",
        wordBank: ["Napiszę", "ci", "wiadomość", "jak", "tylko", "skończę", "piszę"] }
    ],
    productions: [
      { id: "p-41-1", prompt: "Transforme au perfectif : tu es en train d'écrire une lettre (« Piszę list. ») → dis que tu l'AURAS TERMINÉE ce soir.",
        answers: ["Napiszę list wieczorem.", "Napiszę ten list wieczorem."], grammarFocus: "g-41-1", hint: "napisać = perfectif de pisać" },
      { id: "p-41-2", prompt: "Transforme au passé perfectif : « Codziennie idę do szkoły. » → dis qu'hier, pour une fois, tu ES ALLÉ à l'école en retard.",
        answers: ["Wczoraj poszedłem do szkoły późno.", "Wczoraj poszłam do szkoły późno."], grammarFocus: "g-41-2", hint: "pójść = perfectif de iść" },
      { id: "p-41-3", prompt: "Dis, sans « będę » : « Je le finirai demain. »",
        answers: ["Skończę to jutro."], grammarFocus: "g-41-1" }
    ]
  },

  /* ========================= order 37 — Vocatif ======================= */
  {
    id: "lesson-42",
    order: 40,
    title: "Le vocatif : s'adresser à quelqu'un",
    theme: "vocatif",
    mascotIntro:
      "« Mamo! Tato! Kochanie! » — pour interpeller quelqu'un directement, le polonais a un cas à part : le vocatif. Żubr t'apprend à appeler ses amis ! 📣",
    grammarNotes: [
      {
        id: "g-42-1",
        title: "Le vocatif des noms et prénoms féminins",
        explanationFr:
          "Pour appeler quelqu'un, on utilise le vocatif. Les noms féminins en -a prennent -o : mama → mamo!, Anna → Anno!. Le titre « Pani » ne change pas.",
        examples: [
          { pl: "Mamo, gdzie jesteś?", fr: "Maman, où es-tu ?" },
          { pl: "Anno, chodź tutaj!", fr: "Anna, viens ici !" }
        ]
      },
      {
        id: "g-42-2",
        title: "Le vocatif masculin et les formules de politesse",
        explanationFr:
          "Les prénoms masculins prennent -u ou -e selon la consonne finale : Tomek → Tomku!, Piotr → Piotrze!. « Pan » devient « Panie! » (Panie Piotrze! = Monsieur Piotr !).",
        examples: [
          { pl: "Panie Piotrze, ma Pan chwilę?", fr: "Monsieur Piotr, avez-vous un instant ?" },
          { pl: "Tomku, wszystkiego najlepszego!", fr: "Tomek, tous mes vœux !" }
        ]
      }
    ],
    vocabulary: [
      { id: "v-42-mamo", pl: "mamo", fr: "maman ! (en l'appelant)", category: "vocatif" },
      { id: "v-42-tato", pl: "tato", fr: "papa ! (en l'appelant)", category: "vocatif" },
      { id: "v-42-kochanie", pl: "kochanie", fr: "mon/ma chéri(e) (en l'appelant)", category: "vocatif" },
      { id: "v-42-anno", pl: "Anno", fr: "Anna ! (vocatif du prénom)", category: "vocatif" },
      { id: "v-42-panie", pl: "Panie", fr: "Monsieur ! (vocatif de Pan)", category: "vocatif" },
      { id: "v-42-pani", pl: "Pani", fr: "Madame ! (vocatif de Pani, invariable)", category: "vocatif" },
      { id: "v-42-przyjacielu", pl: "przyjacielu", fr: "mon ami ! (vocatif de przyjaciel)", category: "vocatif" },
      { id: "v-42-kolego", pl: "kolego", fr: "collègue / copain ! (vocatif de kolega)", category: "vocatif" },
      { id: "v-42-boze", pl: "Boże", fr: "mon Dieu ! (vocatif irrégulier de Bóg, très courant)", category: "vocatif" },
      { id: "v-42-chwila", pl: "chwila", fr: "l'instant / le moment", category: "objet" },
      { id: "v-42-przyjaciel", pl: "przyjaciel", fr: "l'ami", category: "personne" }
    ],
    sentences: [
      { id: "s-42-1", pl: "Mamo, gdzie jesteś?", fr: "Maman, où es-tu ?", grammarFocus: "g-42-1",
        wordBank: ["Mamo", "gdzie", "jesteś"] },
      { id: "s-42-2", pl: "Anno, chodź tutaj!", fr: "Anna, viens ici !", grammarFocus: "g-42-1",
        wordBank: ["Anno", "chodź", "tutaj"] },
      { id: "s-42-3", pl: "Panie Piotrze, ma Pan chwilę?", fr: "Monsieur Piotr, avez-vous un instant ?", grammarFocus: "g-42-2",
        wordBank: ["Panie", "Piotrze", "ma", "Pan", "chwilę", "Pani"] },
      { id: "s-42-4", pl: "Tomku, wszystkiego najlepszego!", fr: "Tomek, tous mes vœux !", grammarFocus: "g-42-2",
        wordBank: ["Tomku", "wszystkiego", "najlepszego"] }
    ],
    dialogues: [
      {
        id: "d-42-1",
        title: "Salutation formelle",
        lines: [
          { who: "A", pl: "Panie Piotrze, dzień dobry!", fr: "Monsieur Piotr, bonjour !" },
          { who: "B", pl: "Dzień dobry! Co słychać?", fr: "Bonjour ! Quoi de neuf ?" },
          { who: "A", pl: "Wszystko dobrze, dziękuję. A u Pana?", fr: "Tout va bien, merci. Et vous ?" },
          { who: "B", pl: "Też dobrze, dziękuję Panie.", fr: "Bien aussi, merci Monsieur.",
            target: true, wordBank: ["Też", "dobrze", "dziękuję", "Panie", "Pani"] }
        ]
      }
    ]
  },

  /* ================== order 39 — Pronoms déclinés (cas) ================ */
  {
    id: "lesson-44",
    order: 42,
    title: "Les pronoms déclinés à tous les cas",
    theme: "pronoms",
    mascotIntro:
      "« Chez moi, sans toi, avec lui, à propos d'elle » — après une préposition, les pronoms prennent encore d'autres formes. Dernière étape ! 🔗",
    grammarNotes: [
      {
        id: "g-44-1",
        title: "Les pronoms au génitif : u, bez, od + pronom",
        explanationFr:
          "Après u (chez), bez (sans), od (de, depuis) : u mnie (chez moi), bez ciebie (sans toi), od niego (de lui). Après une préposition, il/elle/eux prennent une forme en -n- (niego, niej, nich).",
        examples: [
          { pl: "Zostanę u niej na obiad.", fr: "Je resterai chez elle pour le déjeuner.", note: "génitif" },
          { pl: "Nie mogę żyć bez ciebie.", fr: "Je ne peux pas vivre sans toi." }
        ]
      },
      {
        id: "g-44-2",
        title: "Les pronoms à l'instrumental et au locatif : z, o + pronom",
        explanationFr:
          "Avec (z) : ze mną, z tobą, z nim, z nią (instrumental). À propos de (o) : o mnie, o tobie, o nim, o niej (locatif).",
        examples: [
          { pl: "Chcę iść z tobą.", fr: "Je veux aller avec toi.", note: "instrumental" },
          { pl: "Myślę o nim cały czas.", fr: "Je pense à lui tout le temps.", note: "locatif" }
        ]
      }
    ],
    vocabulary: [
      { id: "v-44-mna", pl: "mną", fr: "moi (instrumental, après « z »)", category: "pronom" },
      { id: "v-44-toba", pl: "tobą", fr: "toi (instrumental)", category: "pronom" },
      { id: "v-44-nim", pl: "nim", fr: "lui (instrumental/locatif)", category: "pronom" },
      { id: "v-44-nia", pl: "nią", fr: "elle (instrumental)", category: "pronom" },
      { id: "v-44-niego", pl: "niego", fr: "lui (génitif, après préposition)", category: "pronom" },
      { id: "v-44-niej", pl: "niej", fr: "elle (génitif/locatif, après préposition)", category: "pronom" },
      { id: "v-44-nami", pl: "nami", fr: "nous (instrumental)", category: "pronom" },
      { id: "v-44-wami", pl: "wami", fr: "vous (instrumental)", category: "pronom" },
      { id: "v-44-nich", pl: "nich", fr: "eux/elles (génitif/locatif, après préposition)", category: "pronom" },
      { id: "v-44-ciebie", pl: "ciebie", fr: "toi (génitif, forme longue)", category: "pronom" },
      { id: "v-44-bez", pl: "bez", fr: "sans (+ génitif)", category: "préposition" },
      { id: "v-44-u", pl: "u", fr: "chez (+ génitif)", category: "préposition" }
    ],
    sentences: [
      { id: "s-44-1", pl: "Zostanę u niej na obiad.", fr: "Je resterai chez elle pour le déjeuner.", grammarFocus: "g-44-1",
        wordBank: ["Zostanę", "u", "niej", "na", "obiad"] },
      { id: "s-44-2", pl: "Nie mogę żyć bez ciebie.", fr: "Je ne peux pas vivre sans toi.", grammarFocus: "g-44-1",
        wordBank: ["Nie", "mogę", "żyć", "bez", "ciebie"] },
      { id: "s-44-3", pl: "Chcę iść z tobą.", fr: "Je veux aller avec toi.", grammarFocus: "g-44-2",
        wordBank: ["Chcę", "iść", "z", "tobą"] },
      { id: "s-44-4", pl: "Myślę o nim cały czas.", fr: "Je pense à lui tout le temps.", grammarFocus: "g-44-2",
        wordBank: ["Myślę", "o", "nim", "cały", "czas"] }
    ]
  },

  /* ================== order 44 — Subordonnées relatives ================ */
  {
    id: "lesson-45",
    order: 49,
    title: "Subordonnées relatives : który / która / które",
    theme: "relatives",
    mascotIntro:
      "« Znam osobę, KTÓRA mówi po polsku. » Żubr relie enfin deux phrases en une seule grâce au pronom relatif ! 🔗",
    grammarNotes: [
      {
        id: "g-45-1",
        title: "Który/która/które : accord avec le nom",
        explanationFr:
          "« który » (masc.), « która » (fém.), « które » (neutre/pluriel) s'accordent avec le nom qu'ils remplacent, pas avec le sujet de la phrase. « Kobieta, KTÓRA śpiewa » (la femme qui chante).",
        examples: [
          { pl: "To jest kobieta, która śpiewa.", fr: "C'est la femme qui chante." },
          { pl: "Znam mężczyznę, który tam stoi.", fr: "Je connais l'homme qui se tient là." }
        ]
      },
      {
        id: "g-45-2",
        title: "Który se décline selon sa fonction dans la relative",
        explanationFr:
          "« który » prend le cas exigé par son rôle DANS la relative, pas dans la phrase principale : sujet → który/która, complément d'objet → którego/którą, avec préposition → le cas demandé par la préposition.",
        examples: [
          { pl: "To jest serial, który oglądam.", fr: "C'est la série que je regarde.", note: "accusatif" },
          { pl: "To jest dom, w którym mieszkam.", fr: "C'est la maison dans laquelle j'habite.", note: "locatif" }
        ]
      }
    ],
    vocabulary: [
      { id: "v-45-ktory", pl: "który", fr: "qui / que (masc., sujet)", category: "pronom" },
      { id: "v-45-ktora", pl: "która", fr: "qui / que (fém., sujet)", category: "pronom" },
      { id: "v-45-ktore", pl: "które", fr: "qui / que (neutre/pluriel, sujet)", category: "pronom" },
      { id: "v-45-ktorego", pl: "którego", fr: "que (masc./neutre, complément)", category: "pronom" },
      { id: "v-45-ktora-comp", pl: "którą", fr: "que (fém., complément)", category: "pronom" },
      { id: "v-45-ktorym", pl: "którym", fr: "lequel (locatif/instrumental, masc./neutre)", category: "pronom" },
      { id: "v-45-mezczyzna", pl: "mężczyzna", fr: "l'homme", category: "personne" },
      { id: "v-45-kobieta", pl: "kobieta", fr: "la femme", category: "personne" },
      { id: "v-45-serial", pl: "serial", fr: "la série (TV)", category: "objet" },
      { id: "v-45-ogladac", pl: "oglądać", fr: "regarder", category: "verbe" },
      { id: "v-45-stac", pl: "stać", fr: "se tenir (debout)", category: "verbe" },
      { id: "v-45-spiewac", pl: "śpiewać", fr: "chanter", category: "verbe" }
    ],
    sentences: [
      { id: "s-45-1", pl: "To jest kobieta, która śpiewa.", fr: "C'est la femme qui chante.", grammarFocus: "g-45-1",
        wordBank: ["To", "jest", "kobieta", "która", "śpiewa", "który"] },
      { id: "s-45-2", pl: "Znam mężczyznę, który tam stoi.", fr: "Je connais l'homme qui se tient là.", grammarFocus: "g-45-1",
        wordBank: ["Znam", "mężczyznę", "który", "tam", "stoi", "która"] },
      { id: "s-45-3", pl: "To jest serial, który oglądam.", fr: "C'est la série que je regarde.", grammarFocus: "g-45-2",
        wordBank: ["To", "jest", "serial", "który", "oglądam", "którego"] },
      { id: "s-45-4", pl: "To jest dom, w którym mieszkam.", fr: "C'est la maison dans laquelle j'habite.", grammarFocus: "g-45-2",
        wordBank: ["To", "jest", "dom", "w", "którym", "mieszkam", "której"] }
    ],
    readings: [
      {
        id: "r-45-1",
        title: "Mój sąsiad",
        paragraphs: [
          "Mam sąsiada, który nazywa się Marek.",
          "Marek jest mężczyzną, który zawsze wstaje bardzo wcześnie.",
          "To jest osoba, którą bardzo lubię, ponieważ jest zawsze uśmiechnięta.",
          "Wieczorem oglądamy razem serial, który oglądamy już od miesiąca."
        ],
        questions: [
          { id: "rq-45-1", question: "Comment s'appelle le voisin ?", options: ["Marek", "Piotr", "Tomek"], answer: "Marek" },
          { id: "rq-45-2", question: "Que fait Marek chaque matin ?", options: ["Il se lève très tôt", "Il dort tard", "Il part en voyage"], answer: "Il se lève très tôt" },
          { id: "rq-45-3", question: "Pourquoi l'auteur aime bien Marek ?", options: ["Parce qu'il est toujours souriant", "Parce qu'il est riche", "Parce qu'il chante bien"], answer: "Parce qu'il est toujours souriant" }
        ]
      }
    ]
  },

  /* ==================== order 45 — Complétives et opinion ============== */
  {
    id: "lesson-46",
    order: 50,
    title: "Donner son avis : complétives en « że »",
    theme: "opinion",
    mascotIntro:
      "« Myślę, że… », « Uważam, że… » — Żubr a un avis sur tout, et il sait enfin comment le dire correctement ! 🗣️",
    grammarNotes: [
      {
        id: "g-46-1",
        title: "Les complétives avec « że »",
        explanationFr:
          "« że » (que) introduit une proposition complétive après des verbes d'opinion : myślę, że… (je pense que…), wiem, że… (je sais que…). La virgule avant « że » est obligatoire.",
        examples: [
          { pl: "Myślę, że to dobry plan.", fr: "Je pense que c'est un bon plan." },
          { pl: "Wiem, że masz rację.", fr: "Je sais que tu as raison." }
        ]
      },
      {
        id: "g-46-2",
        title: "Donner et nuancer son opinion",
        explanationFr:
          "« Moim zdaniem » (à mon avis), « uważam, że » (je considère que), « zgadzam się / nie zgadzam się » (je suis / ne suis pas d'accord).",
        examples: [
          { pl: "Moim zdaniem to świetny film.", fr: "À mon avis, c'est un excellent film." },
          { pl: "Nie zgadzam się z tobą.", fr: "Je ne suis pas d'accord avec toi." }
        ]
      }
    ],
    vocabulary: [
      { id: "v-46-myslec", pl: "myśleć", fr: "penser", category: "verbe" },
      { id: "v-46-sadzic", pl: "sądzić", fr: "croire / juger", category: "verbe" },
      { id: "v-46-uwazac", pl: "uważać", fr: "considérer / estimer", category: "verbe" },
      { id: "v-46-zgadzac", pl: "zgadzać się", fr: "être d'accord", category: "verbe" },
      { id: "v-46-dyskutowac", pl: "dyskutować", fr: "discuter / débattre", category: "verbe" },
      { id: "v-46-moim-zdaniem", pl: "moim zdaniem", fr: "à mon avis", category: "opinion" },
      { id: "v-46-zdanie", pl: "zdanie", fr: "la phrase / l'avis", category: "opinion" },
      { id: "v-46-opinia", pl: "opinia", fr: "l'opinion", category: "opinion" },
      { id: "v-46-racja", pl: "racja", fr: "la raison / le bon droit", category: "opinion" },
      { id: "v-46-chyba", pl: "chyba", fr: "je crois / peut-être", category: "adverbe" },
      { id: "v-46-ze", pl: "że", fr: "que (conjonction)", category: "grammaire" }
    ],
    sentences: [
      { id: "s-46-1", pl: "Myślę, że to dobry plan.", fr: "Je pense que c'est un bon plan.", grammarFocus: "g-46-1",
        wordBank: ["Myślę", "że", "to", "dobry", "plan"] },
      { id: "s-46-2", pl: "Wiem, że masz rację.", fr: "Je sais que tu as raison.", grammarFocus: "g-46-1",
        wordBank: ["Wiem", "że", "masz", "rację", "racja"] },
      { id: "s-46-3", pl: "Moim zdaniem to świetny film.", fr: "À mon avis, c'est un excellent film.", grammarFocus: "g-46-2",
        wordBank: ["Moim", "zdaniem", "to", "świetny", "film"] },
      { id: "s-46-4", pl: "Nie zgadzam się z tobą.", fr: "Je ne suis pas d'accord avec toi.", grammarFocus: "g-46-2",
        wordBank: ["Nie", "zgadzam", "się", "z", "tobą"] }
    ],
    dialogues: [
      {
        id: "d-46-1",
        title: "Un petit débat",
        lines: [
          { who: "A", pl: "Moim zdaniem ten serial jest nudny.", fr: "À mon avis, cette série est ennuyeuse." },
          { who: "B", pl: "Nie zgadzam się z tobą, jest świetny!", fr: "Je ne suis pas d'accord avec toi, elle est excellente !" },
          { who: "A", pl: "Może masz rację.", fr: "Peut-être que tu as raison." },
          { who: "B", pl: "Myślę, że powinniśmy obejrzeć jeszcze jeden odcinek.", fr: "Je pense qu'on devrait regarder encore un épisode.",
            target: true, wordBank: ["Myślę", "że", "powinniśmy", "obejrzeć", "jeszcze", "jeden", "odcinek", "sądzę"] }
        ]
      }
    ],
    productions: [
      { id: "p-46-1", prompt: "Donne ton avis : à ton avis, le café est délicieux.",
        answers: ["Moim zdaniem kawa jest smaczna.", "Uważam, że kawa jest smaczna.", "Myślę, że kawa jest dobra."], grammarFocus: "g-46-2", hint: "moim zdaniem / uważam, że…" },
      { id: "p-46-2", prompt: "Dis que tu es d'accord avec quelqu'un : « Je suis d'accord avec toi. »",
        answers: ["Zgadzam się z tobą."], grammarFocus: "g-46-2" },
      { id: "p-46-3", prompt: "Complète : « Je sais que tu as raison. »",
        answers: ["Wiem, że masz rację."], grammarFocus: "g-46-1" }
    ]
  },

  /* ======================= order 46 — Cause et but ===================== */
  {
    id: "lesson-47",
    order: 51,
    title: "Cause et but : ponieważ, bo, żeby",
    theme: "cause",
    mascotIntro:
      "« Ponieważ jest zimno… » Żubr explique enfin POURQUOI il fait les choses, et POUR QUOI il les fait. 🎯",
    grammarNotes: [
      {
        id: "g-47-1",
        title: "Exprimer la cause : bo, ponieważ",
        explanationFr:
          "« bo » (car, familier) et « ponieważ » (parce que, plus formel) introduisent une cause, placées après la conséquence.",
        examples: [
          { pl: "Nie idę, bo jestem chory.", fr: "Je n'y vais pas car je suis malade." },
          { pl: "Zostałem w domu, ponieważ padał deszcz.", fr: "Je suis resté à la maison parce qu'il pleuvait." }
        ]
      },
      {
        id: "g-47-2",
        title: "Exprimer le but : żeby",
        explanationFr:
          "« żeby » (pour que / afin de) introduit un but. Même sujet dans les deux propositions : żeby + infinitif. Sujets différents : żeby + forme spéciale (żebyś, żebym…).",
        examples: [
          { pl: "Pracuję, żeby zarobić pieniądze.", fr: "Je travaille pour gagner de l'argent.", note: "même sujet : żeby + infinitif" },
          { pl: "Mówię głośno, żebyś mnie usłyszał.", fr: "Je parle fort pour que tu m'entendes.", note: "sujets différents" }
        ]
      }
    ],
    vocabulary: [
      { id: "v-47-bo", pl: "bo", fr: "car (familier)", category: "connecteur" },
      { id: "v-47-poniewaz", pl: "ponieważ", fr: "parce que", category: "connecteur" },
      { id: "v-47-dlatego-ze", pl: "dlatego że", fr: "parce que (formel)", category: "connecteur" },
      { id: "v-47-zeby", pl: "żeby", fr: "pour que / afin de", category: "connecteur" },
      { id: "v-47-zarobic", pl: "zarobić", fr: "gagner (de l'argent)", category: "verbe" },
      { id: "v-47-usłyszec", pl: "usłyszeć", fr: "entendre (perfectif)", category: "verbe" },
      { id: "v-47-padac", pl: "padać", fr: "tomber (pluie/neige)", category: "verbe" },
      { id: "v-47-glosno", pl: "głośno", fr: "fort / à voix haute", category: "adverbe" },
      { id: "v-47-cicho", pl: "cicho", fr: "doucement / silencieusement", category: "adverbe" },
      { id: "v-47-powod", pl: "powód", fr: "la raison / la cause", category: "objet" },
      { id: "v-47-cel", pl: "cel", fr: "le but", category: "objet" }
    ],
    sentences: [
      { id: "s-47-1", pl: "Nie idę, bo jestem chory.", fr: "Je n'y vais pas car je suis malade.", grammarFocus: "g-47-1",
        wordBank: ["Nie", "idę", "bo", "jestem", "chory", "ponieważ"] },
      { id: "s-47-2", pl: "Zostałem w domu, ponieważ padał deszcz.", fr: "Je suis resté à la maison parce qu'il pleuvait.", grammarFocus: "g-47-1",
        wordBank: ["Zostałem", "w", "domu", "ponieważ", "padał", "deszcz", "bo"] },
      { id: "s-47-3", pl: "Pracuję, żeby zarobić pieniądze.", fr: "Je travaille pour gagner de l'argent.", grammarFocus: "g-47-2",
        wordBank: ["Pracuję", "żeby", "zarobić", "pieniądze"] },
      { id: "s-47-4", pl: "Mówię głośno, żebyś mnie usłyszał.", fr: "Je parle fort pour que tu m'entendes.", grammarFocus: "g-47-2",
        wordBank: ["Mówię", "głośno", "żebyś", "mnie", "usłyszał"] }
    ],
    productions: [
      { id: "p-47-1", prompt: "Explique pourquoi tu restes à la maison (cause : il fait froid, « zimno »).",
        answers: ["Zostaję w domu, bo jest zimno.", "Zostaję w domu, ponieważ jest zimno."], grammarFocus: "g-47-1" },
      { id: "p-47-2", prompt: "Exprime un but : « J'apprends le polonais pour parler avec ma famille. »",
        answers: ["Uczę się polskiego, żeby rozmawiać z rodziną."], grammarFocus: "g-47-2", hint: "żeby + infinitif si le sujet est le même" },
      { id: "p-47-3", prompt: "Dis : « Je ne viens pas car je suis occupé. »",
        answers: ["Nie przychodzę, bo jestem zajęty.", "Nie przyjdę, bo jestem zajęty."], grammarFocus: "g-47-1" }
    ]
  },

  /* =================== order 47 — Concession et opposition ============= */
  {
    id: "lesson-48",
    order: 52,
    title: "Concession et opposition : mimo że, chociaż, jednak",
    theme: "concession",
    mascotIntro:
      "« Chociaż pada deszcz, idę na spacer. » Żubr sort quand même sous la pluie — grâce à la concession ! ☔",
    grammarNotes: [
      {
        id: "g-48-1",
        title: "Chociaż / mimo że : bien que",
        explanationFr:
          "« chociaż » et « mimo że » (bien que, malgré le fait que) introduisent une opposition : l'action a lieu MALGRÉ la circonstance.",
        examples: [
          { pl: "Chociaż jestem zmęczony, idę na siłownię.", fr: "Bien que je sois fatigué, je vais à la salle de sport." },
          { pl: "Mimo że pada deszcz, wychodzę na spacer.", fr: "Malgré la pluie, je sors me promener." }
        ]
      },
      {
        id: "g-48-2",
        title: "Jednak / ale : mais pourtant",
        explanationFr:
          "« jednak » (pourtant, cependant) nuance ou contredit ce qui précède, souvent en milieu ou fin de phrase. « ale » (mais) est plus neutre et se place en tête de la seconde proposition.",
        examples: [
          { pl: "To jest drogie, jednak warto.", fr: "C'est cher, pourtant ça vaut le coup." },
          { pl: "Chcę iść, ale jestem chory.", fr: "Je veux y aller, mais je suis malade." }
        ]
      }
    ],
    vocabulary: [
      { id: "v-48-chociaz", pl: "chociaż", fr: "bien que / même si", category: "connecteur" },
      { id: "v-48-mimo-ze", pl: "mimo że", fr: "bien que / malgré le fait que", category: "connecteur" },
      { id: "v-48-jednak", pl: "jednak", fr: "pourtant / cependant", category: "connecteur" },
      { id: "v-48-ale", pl: "ale", fr: "mais", category: "connecteur" },
      { id: "v-48-silownia", pl: "siłownia", fr: "la salle de sport", category: "loisirs" },
      { id: "v-48-warto", pl: "warto", fr: "ça vaut le coup", category: "expression" },
      { id: "v-48-wychodzic", pl: "wychodzić", fr: "sortir", category: "verbe" },
      { id: "v-48-spacer", pl: "spacer", fr: "la promenade", category: "loisirs" },
      { id: "v-48-silny", pl: "silny", fr: "fort", category: "description" },
      { id: "v-48-slaby", pl: "słaby", fr: "faible", category: "description" }
    ],
    sentences: [
      { id: "s-48-1", pl: "Chociaż jestem zmęczony, idę na siłownię.", fr: "Bien que je sois fatigué, je vais à la salle de sport.", grammarFocus: "g-48-1",
        wordBank: ["Chociaż", "jestem", "zmęczony", "idę", "na", "siłownię"] },
      { id: "s-48-2", pl: "Mimo że pada deszcz, wychodzę na spacer.", fr: "Malgré la pluie, je sors me promener.", grammarFocus: "g-48-1",
        wordBank: ["Mimo", "że", "pada", "deszcz", "wychodzę", "na", "spacer"] },
      { id: "s-48-3", pl: "To jest drogie, jednak warto.", fr: "C'est cher, pourtant ça vaut le coup.", grammarFocus: "g-48-2",
        wordBank: ["To", "jest", "drogie", "jednak", "warto"] },
      { id: "s-48-4", pl: "Chcę iść, ale jestem chory.", fr: "Je veux y aller, mais je suis malade.", grammarFocus: "g-48-2",
        wordBank: ["Chcę", "iść", "ale", "jestem", "chory"] }
    ],
    productions: [
      { id: "p-48-1", prompt: "Exprime une concession : « Bien qu'il fasse froid, je sors. »",
        answers: ["Chociaż jest zimno, wychodzę.", "Mimo że jest zimno, wychodzę."], grammarFocus: "g-48-1" },
      { id: "p-48-2", prompt: "Dis : « C'est difficile, pourtant j'aime ça. »",
        answers: ["To jest trudne, jednak to lubię.", "Jest trudne, jednak lubię to."], grammarFocus: "g-48-2", hint: "jednak se place après la première proposition" }
    ]
  },

  /* ===================== order 48 — Discours indirect =================== */
  {
    id: "lesson-49",
    order: 53,
    title: "Discours indirect : rapporter les paroles de quelqu'un",
    theme: "discours indirect",
    mascotIntro:
      "« Powiedział, że… » Żubr rapporte enfin ce que ses amis lui ont dit, sans les citer mot pour mot ! 💬",
    grammarNotes: [
      {
        id: "g-49-1",
        title: "Rapporter des paroles : powiedział, że…",
        explanationFr:
          "Discours direct « Jestem zajęty » → discours indirect « Powiedział, że jest zajęty » (il a dit qu'il était occupé). On garde le TEMPS d'origine, mais on change la personne.",
        examples: [
          { pl: "Powiedział, że jest zajęty.", fr: "Il a dit qu'il était occupé.", note: "discours direct : « Jestem zajęty »" },
          { pl: "Powiedziała, że przyjdzie później.", fr: "Elle a dit qu'elle viendrait plus tard." }
        ]
      },
      {
        id: "g-49-2",
        title: "Rapporter une question : zapytał, czy…",
        explanationFr:
          "Une question directe (oui/non) devient « czy » (si) au discours indirect. Avec un mot interrogatif (kiedy, gdzie, co…), on le garde tel quel.",
        examples: [
          { pl: "Zapytał, czy przyjdę.", fr: "Il a demandé si je viendrais.", note: "discours direct : « Czy przyjdziesz? »" },
          { pl: "Zapytała, gdzie jestem.", fr: "Elle a demandé où j'étais." }
        ]
      }
    ],
    vocabulary: [
      { id: "v-49-zapytac", pl: "zapytać", fr: "demander (poser une question)", category: "verbe" },
      { id: "v-49-odpowiedziec", pl: "odpowiedzieć", fr: "répondre", category: "verbe" },
      { id: "v-49-czy", pl: "czy", fr: "si (dans une question rapportée)", category: "grammaire" },
      { id: "v-49-cytat", pl: "cytat", fr: "la citation", category: "objet" },
      { id: "v-49-slowa", pl: "słowa", fr: "les mots / les paroles", category: "objet" },
      { id: "v-49-twierdzic", pl: "twierdzić", fr: "affirmer / prétendre", category: "verbe" },
      { id: "v-49-zaprzeczyc", pl: "zaprzeczyć", fr: "nier / démentir", category: "verbe" },
      { id: "v-49-kiedy", pl: "kiedy", fr: "quand", category: "grammaire" },
      { id: "v-49-prawda", pl: "prawda", fr: "la vérité", category: "objet" },
      { id: "v-49-klamac", pl: "kłamać", fr: "mentir", category: "verbe" }
    ],
    sentences: [
      { id: "s-49-1", pl: "Powiedział, że jest zajęty.", fr: "Il a dit qu'il était occupé.", grammarFocus: "g-49-1",
        wordBank: ["Powiedział", "że", "jest", "zajęty", "powiedziała"] },
      { id: "s-49-2", pl: "Powiedziała, że przyjdzie później.", fr: "Elle a dit qu'elle viendrait plus tard.", grammarFocus: "g-49-1",
        wordBank: ["Powiedziała", "że", "przyjdzie", "później", "powiedział"] },
      { id: "s-49-3", pl: "Zapytał, czy przyjdę.", fr: "Il a demandé si je viendrais.", grammarFocus: "g-49-2",
        wordBank: ["Zapytał", "czy", "przyjdę", "zapytała"] },
      { id: "s-49-4", pl: "Zapytała, gdzie jestem.", fr: "Elle a demandé où j'étais.", grammarFocus: "g-49-2",
        wordBank: ["Zapytała", "gdzie", "jestem", "zapytał"] }
    ],
    dialogues: [
      {
        id: "d-49-1",
        title: "Il a dit quoi ?",
        lines: [
          { who: "A", pl: "Co powiedział Marek?", fr: "Qu'a dit Marek ?" },
          { who: "B", pl: "Powiedział, że jest bardzo zajęty.", fr: "Il a dit qu'il était très occupé." },
          { who: "A", pl: "A czy zapytał o mnie?", fr: "Et a-t-il demandé de mes nouvelles ?" },
          { who: "B", pl: "Tak, zapytał, kiedy przyjedziesz.", fr: "Oui, il a demandé quand tu arriverais.",
            target: true, wordBank: ["Tak", "zapytał", "kiedy", "przyjedziesz", "powiedział"] }
        ]
      }
    ],
    readings: [
      {
        id: "r-49-1",
        title: "Co powiedziała Ania?",
        paragraphs: [
          "Ania zadzwoniła do mnie wczoraj wieczorem.",
          "Powiedziała, że jest bardzo zmęczona po pracy.",
          "Zapytała, czy mogę pomóc jej w sobotę.",
          "Odpowiedziałem, że oczywiście mogę."
        ],
        questions: [
          { id: "rq-49-1", question: "Quand Ania a-t-elle appelé ?", options: ["Hier soir", "Ce matin", "La semaine dernière"], answer: "Hier soir" },
          { id: "rq-49-2", question: "Qu'a dit Ania sur son état ?", options: ["Qu'elle était très fatiguée", "Qu'elle était malade", "Qu'elle était en vacances"], answer: "Qu'elle était très fatiguée" },
          { id: "rq-49-3", question: "Qu'a demandé Ania ?", options: ["Si je pouvais l'aider samedi", "Si je voulais dîner", "Si j'avais de l'argent"], answer: "Si je pouvais l'aider samedi" }
        ]
      }
    ],
    productions: [
      { id: "p-49-1", prompt: "Rapporte cette phrase de Tomek : « Jestem chory. » → « Tomek a dit qu'il était malade. »",
        answers: ["Tomek powiedział, że jest chory.", "Tomek powiedział, że był chory."], grammarFocus: "g-49-1" },
      { id: "p-49-2", prompt: "Rapporte cette question : « Czy masz czas? » → « Il a demandé si j'avais du temps. »",
        answers: ["Zapytał, czy mam czas."], grammarFocus: "g-49-2" }
    ]
  },

  /* ================ order 50 — Compréhension de texte (capstone) ======= */
  {
    id: "lesson-50",
    order: 55,
    title: "Compréhension d'un texte suivi",
    theme: "récit suivi",
    mascotIntro:
      "Dernière étape (pour l'instant) : un vrai petit texte à lire, du début à la fin, comme un(e) vrai(e) polonophone. Bravo d'être arrivé jusque là ! 🏆",
    grammarNotes: [
      {
        id: "g-50-1",
        title: "Repérer les connecteurs pour suivre un récit",
        explanationFr:
          "Un texte suivi enchaîne les idées avec des connecteurs déjà vus : najpierw, potem, ponieważ, mimo że… Les repérer aide à suivre la logique sans tout traduire mot à mot.",
        examples: [
          { pl: "Najpierw szukałem spokoju, potem zobaczyłem księżyc.", fr: "D'abord je cherchais la tranquillité, ensuite j'ai vu la lune." },
          { pl: "Mimo że było ciemno, nie bałem się.", fr: "Bien qu'il fasse sombre, je n'avais pas peur." }
        ]
      },
      {
        id: "g-50-2",
        title: "Deviner le sens d'un mot inconnu par le contexte",
        explanationFr:
          "Pas besoin de connaître chaque mot : le contexte (verbe, connecteur, sujet) donne souvent le sens général. C'est la compétence clé de la lecture B1 — comprendre l'essentiel, pas tout traduire.",
        examples: [
          { pl: "Zgubiłem się w lesie, lecz wreszcie znalazłem drogę.", fr: "Je me suis perdu dans la forêt, mais j'ai enfin trouvé le chemin." },
          { pl: "Byłem przestraszony, jednak szedłem dalej.", fr: "J'étais effrayé, pourtant je continuais à marcher." }
        ]
      }
    ],
    vocabulary: [
      { id: "v-50-zgubic", pl: "zgubić się", fr: "se perdre", category: "récit" },
      { id: "v-50-znalezc", pl: "znaleźć", fr: "trouver (perfectif)", category: "verbe" },
      { id: "v-50-droga", pl: "droga", fr: "le chemin / la route", category: "objet" },
      { id: "v-50-przestraszony", pl: "przestraszony", fr: "effrayé", category: "description" },
      { id: "v-50-spokoj", pl: "spokój", fr: "la tranquillité / le calme", category: "objet" },
      { id: "v-50-cisza", pl: "cisza", fr: "le silence", category: "objet" },
      { id: "v-50-wracac", pl: "wracać", fr: "revenir / rentrer", category: "verbe" },
      { id: "v-50-ksiezyc", pl: "księżyc", fr: "la lune", category: "nature" },
      { id: "v-50-ciemno", pl: "ciemno", fr: "sombre / il fait noir", category: "description" },
      { id: "v-50-gwiazda", pl: "gwiazda", fr: "l'étoile", category: "nature" }
    ],
    sentences: [
      { id: "s-50-1", pl: "Zgubiłem się w lesie, lecz wreszcie znalazłem drogę.", fr: "Je me suis perdu dans la forêt, mais j'ai enfin trouvé le chemin.", grammarFocus: "g-50-2",
        wordBank: ["Zgubiłem", "się", "w", "lesie", "lecz", "wreszcie", "znalazłem", "drogę"] },
      { id: "s-50-2", pl: "Najpierw szukałem spokoju, potem zobaczyłem księżyc.", fr: "D'abord je cherchais la tranquillité, ensuite j'ai vu la lune.", grammarFocus: "g-50-1",
        wordBank: ["Najpierw", "szukałem", "spokoju", "potem", "zobaczyłem", "księżyc"] },
      { id: "s-50-3", pl: "Mimo że było ciemno, nie bałem się.", fr: "Bien qu'il fasse sombre, je n'avais pas peur.", grammarFocus: "g-50-1",
        wordBank: ["Mimo", "że", "było", "ciemno", "nie", "bałem", "się"] },
      { id: "s-50-4", pl: "Byłem przestraszony, jednak szedłem dalej.", fr: "J'étais effrayé, pourtant je continuais à marcher.", grammarFocus: "g-50-2",
        wordBank: ["Byłem", "przestraszony", "jednak", "szedłem", "dalej"] }
    ],
    readings: [
      {
        id: "r-50-1",
        title: "Noc w lesie",
        paragraphs: [
          "Pewnego wieczoru Żubr postanowił pojechać do lasu, ponieważ szukał spokoju.",
          "Najpierw szedł wzdłuż rzeki, potem zgubił się między drzewami.",
          "Mimo że było ciemno, nie bał się, bo widział księżyc i gwiazdy.",
          "Nagle usłyszał jakiś dźwięk, ale to był tylko wiatr.",
          "W końcu znalazł drogę i wrócił do domu, szczęśliwy i spokojny."
        ],
        questions: [
          { id: "rq-50-1", question: "Pourquoi Żubr est-il allé dans la forêt ?", options: ["Il cherchait la tranquillité", "Il cherchait de la nourriture", "Il rendait visite à un ami"], answer: "Il cherchait la tranquillité" },
          { id: "rq-50-2", question: "Qu'est-ce qui lui est arrivé entre les arbres ?", options: ["Il s'est perdu", "Il s'est endormi", "Il a rencontré un ours"], answer: "Il s'est perdu" },
          { id: "rq-50-3", question: "Pourquoi n'avait-il pas peur malgré l'obscurité ?", options: ["Il voyait la lune et les étoiles", "Il avait une lampe", "Il connaissait bien la forêt"], answer: "Il voyait la lune et les étoiles" },
          { id: "rq-50-4", question: "Qu'était le bruit soudain qu'il a entendu ?", options: ["Le vent", "Un animal", "Une voiture"], answer: "Le vent" }
        ]
      }
    ]
  },

  /* ================= order 14 — Animaux de compagnie ================== */
  {
    id: "lesson-52",
    order: 14,
    title: "Zwierzęta domowe — les animaux de compagnie",
    theme: "animaux domestiques",
    mascotIntro:
      "Żubr n'a pas d'animal de compagnie (il EST l'animal), mais il adore les présentations. Chien, chat, hamster : on apprend à dire qui vit chez toi. 🐕🐈",
    grammarNotes: [
      {
        id: "g-52-1",
        title: "L'accusatif des animés masculins : pies → psa",
        explanationFr:
          "Un nom masculin qui désigne un être vivant prend à l'accusatif la forme du génitif : pies → psa, kot → kota, chomik → chomika, królik → królika. Les féminins en -a font -ę (rybka → rybkę) et les neutres ne changent pas (zwierzę → zwierzę).",
        examples: [
          { pl: "Mam psa i kota.", fr: "J'ai un chien et un chat.", note: "psa, kota : accusatif animé" },
          { pl: "Widzę małego chomika.", fr: "Je vois un petit hamster.", note: "l'adjectif suit : małego" }
        ]
      },
      {
        id: "g-52-2",
        title: "lubić et karmić se construisent aussi avec l'accusatif",
        explanationFr:
          "Comme « mieć », les verbes « lubić » (aimer) et « karmić » (nourrir) demandent l'accusatif. Au pluriel, l'accusatif des animaux est identique au nominatif : psy, koty, rybki.",
        examples: [
          { pl: "Lubię zwierzęta domowe.", fr: "J'aime les animaux domestiques." },
          { pl: "Codziennie karmię rybki.", fr: "Je nourris les poissons chaque jour." }
        ]
      }
    ],
    vocabulary: [
      { id: "v-52-pies", pl: "pies", fr: "le chien", category: "animaux domestiques",
        example: { pl: "Mój pies ma czarny ogon.", fr: "Mon chien a la queue noire." } },
      { id: "v-52-kot", pl: "kot", fr: "le chat", category: "animaux domestiques" },
      { id: "v-52-chomik", pl: "chomik", fr: "le hamster", category: "animaux domestiques" },
      { id: "v-52-krolik", pl: "królik", fr: "le lapin", category: "animaux domestiques" },
      { id: "v-52-rybka", pl: "rybka", fr: "le poisson d'aquarium", category: "animaux domestiques" },
      { id: "v-52-papuga", pl: "papuga", fr: "le perroquet", category: "animaux domestiques" },
      { id: "v-52-zolw", pl: "żółw", fr: "la tortue", category: "animaux domestiques" },
      { id: "v-52-zwierze", pl: "zwierzę", fr: "l'animal", category: "animaux domestiques" },
      { id: "v-52-ogon", pl: "ogon", fr: "la queue", category: "animaux domestiques" },
      { id: "v-52-lapa", pl: "łapa", fr: "la patte", category: "animaux domestiques" },
      { id: "v-52-karmic", pl: "karmić", fr: "nourrir", category: "verbe",
        example: { pl: "Karmię psa dwa razy dziennie.", fr: "Je nourris le chien deux fois par jour." } },
      { id: "v-52-glaskac", pl: "głaskać", fr: "caresser", category: "verbe" }
    ],
    sentences: [
      { id: "s-52-1", pl: "Mam psa i kota.", fr: "J'ai un chien et un chat.", grammarFocus: "g-52-1",
        wordBank: ["Mam", "psa", "i", "kota", "pies", "kot"] },
      { id: "s-52-2", pl: "Lubię zwierzęta domowe.", fr: "J'aime les animaux domestiques.", grammarFocus: "g-52-2",
        wordBank: ["Lubię", "zwierzęta", "domowe", "zwierzę"] },
      { id: "s-52-3", pl: "Codziennie karmię rybki.", fr: "Je nourris les poissons chaque jour.", grammarFocus: "g-52-2",
        wordBank: ["Codziennie", "karmię", "rybki", "rybka"] },
      { id: "s-52-4", pl: "Widzę małego chomika.", fr: "Je vois un petit hamster.", grammarFocus: "g-52-1",
        wordBank: ["Widzę", "małego", "chomika", "chomik"] }
    ],
    dialogues: [
      {
        id: "d-52-1",
        title: "Masz jakieś zwierzę?",
        lines: [
          { who: "A", pl: "Masz jakieś zwierzę w domu?", fr: "Tu as un animal à la maison ?" },
          { who: "B", pl: "Tak, mam kota i królika.", fr: "Oui, j'ai un chat et un lapin." },
          { who: "A", pl: "Czy lubisz też psy?", fr: "Aimes-tu aussi les chiens ?" },
          { who: "B", pl: "Tak, bardzo lubię psy.", fr: "Oui, j'aime beaucoup les chiens.",
            target: true, wordBank: ["Tak", "bardzo", "lubię", "psy", "pies"] }
        ]
      }
    ]
  },

  /* ==================== order 24 — Animaux de la ferme ================= */
  {
    id: "lesson-53",
    order: 24,
    title: "Na wsi — les animaux de la ferme",
    theme: "ferme",
    mascotIntro:
      "Direction la campagne polonaise ! Vaches, chevaux, poules… et l'occasion parfaite de compter des animaux, ce qui en polonais réserve une surprise. 🐄🐓",
    grammarNotes: [
      {
        id: "g-53-1",
        title: "Le pluriel des noms d'animaux",
        explanationFr:
          "Les animaux ne sont pas des personnes : leur pluriel se forme comme celui des objets. Féminins en -a → -y / -i : krowa → krowy, koza → kozy, kura → kury. Masculins → -y / -i / -e : kogut → koguty, koń → konie.",
        examples: [
          { pl: "Na wsi są krowy i konie.", fr: "À la campagne il y a des vaches et des chevaux." },
          { pl: "Kury chodzą po podwórku.", fr: "Les poules se promènent dans la cour." }
        ]
      },
      {
        id: "g-53-2",
        title: "Compter les animaux : dwa konie, pięć krów",
        explanationFr:
          "Après 2, 3 et 4, le nom reste au nominatif pluriel : dwa konie, trzy kozy. À partir de 5, il passe au génitif pluriel : pięć krów, sześć kur, dziesięć kóz. C'est la règle la plus surprenante du polonais — et la plus utile au marché.",
        examples: [
          { pl: "Mamy dwa konie i pięć krów.", fr: "Nous avons deux chevaux et cinq vaches.", note: "konie (nominatif) mais krów (génitif)" },
          { pl: "W stodole jest sześć kur.", fr: "Il y a six poules dans la grange." }
        ]
      }
    ],
    vocabulary: [
      { id: "v-53-krowa", pl: "krowa", fr: "la vache", category: "ferme" },
      { id: "v-53-kon", pl: "koń", fr: "le cheval", category: "ferme",
        example: { pl: "Mamy dwa konie.", fr: "Nous avons deux chevaux." } },
      { id: "v-53-swinia", pl: "świnia", fr: "le cochon", category: "ferme" },
      { id: "v-53-owca", pl: "owca", fr: "le mouton", category: "ferme" },
      { id: "v-53-koza", pl: "koza", fr: "la chèvre", category: "ferme" },
      { id: "v-53-kura", pl: "kura", fr: "la poule", category: "ferme" },
      { id: "v-53-kogut", pl: "kogut", fr: "le coq", category: "ferme" },
      { id: "v-53-kaczka", pl: "kaczka", fr: "le canard", category: "ferme" },
      { id: "v-53-ges", pl: "gęś", fr: "l'oie", category: "ferme" },
      { id: "v-53-stodola", pl: "stodoła", fr: "la grange", category: "ferme" },
      { id: "v-53-wies", pl: "wieś", fr: "le village / la campagne", category: "ferme" },
      { id: "v-53-podworko", pl: "podwórko", fr: "la cour", category: "ferme" }
    ],
    sentences: [
      { id: "s-53-1", pl: "Na wsi są krowy i konie.", fr: "À la campagne il y a des vaches et des chevaux.", grammarFocus: "g-53-1",
        wordBank: ["Na", "wsi", "są", "krowy", "i", "konie", "krowa"] },
      { id: "s-53-2", pl: "Mamy dwa konie i pięć krów.", fr: "Nous avons deux chevaux et cinq vaches.", grammarFocus: "g-53-2",
        wordBank: ["Mamy", "dwa", "konie", "i", "pięć", "krów", "krowy"] },
      { id: "s-53-3", pl: "Kury chodzą po podwórku.", fr: "Les poules se promènent dans la cour.", grammarFocus: "g-53-1",
        wordBank: ["Kury", "chodzą", "po", "podwórku", "podwórko"] },
      { id: "s-53-4", pl: "W stodole jest sześć kur.", fr: "Il y a six poules dans la grange.", grammarFocus: "g-53-2",
        wordBank: ["W", "stodole", "jest", "sześć", "kur", "kury"] }
    ],
    dialogues: [
      {
        id: "d-53-1",
        title: "Weekend na wsi",
        lines: [
          { who: "A", pl: "Co robisz w weekend?", fr: "Que fais-tu ce week-end ?" },
          { who: "B", pl: "Jadę na wieś do dziadków.", fr: "Je vais à la campagne chez mes grands-parents." },
          { who: "A", pl: "Czy oni mają zwierzęta?", fr: "Ont-ils des animaux ?" },
          { who: "B", pl: "Tak, mają kury i dwa konie.", fr: "Oui, ils ont des poules et deux chevaux.",
            target: true, wordBank: ["Tak", "mają", "kury", "i", "dwa", "konie", "koń"] }
        ]
      }
    ]
  },

  /* ==================== order 44 — Animaux du monde =================== */
  {
    id: "lesson-54",
    order: 44,
    title: "Zwierzęta świata — les animaux du monde",
    theme: "monde animal",
    mascotIntro:
      "Żubr est le plus imposant d'Europe… mais que vaut-il face à un éléphant ? On compare, on classe, on exagère un peu. 🦁🐘",
    grammarNotes: [
      {
        id: "g-54-1",
        title: "Comparer les animaux : większy niż, wyższy od",
        explanationFr:
          "Le comparatif se forme en -szy / -ejszy, souvent avec une consonne modifiée : duży → większy, mały → mniejszy, wysoki → wyższy, szybki → szybszy. On compare avec « niż + nominatif » ou « od + génitif ».",
        examples: [
          { pl: "Słoń jest większy niż lew.", fr: "L'éléphant est plus grand que le lion." },
          { pl: "Żyrafa jest wyższa od słonia.", fr: "La girafe est plus haute que l'éléphant.", note: "od + génitif : słonia" }
        ]
      },
      {
        id: "g-54-2",
        title: "Classer un animal : być + instrumental",
        explanationFr:
          "Pour dire ce QU'EST un animal (sa catégorie), le complément de « być » passe à l'instrumental : drapieżnik → drapieżnikiem, zwierzę → zwierzęciem. Avec un adjectif, lui aussi se décline : najszybszym zwierzęciem.",
        examples: [
          { pl: "Lew jest drapieżnikiem.", fr: "Le lion est un prédateur." },
          { pl: "Gepard jest najszybszym zwierzęciem na świecie.", fr: "Le guépard est l'animal le plus rapide du monde." }
        ]
      }
    ],
    vocabulary: [
      { id: "v-54-lew", pl: "lew", fr: "le lion", category: "monde animal" },
      { id: "v-54-tygrys", pl: "tygrys", fr: "le tigre", category: "monde animal" },
      { id: "v-54-slon", pl: "słoń", fr: "l'éléphant", category: "monde animal" },
      { id: "v-54-zyrafa", pl: "żyrafa", fr: "la girafe", category: "monde animal" },
      { id: "v-54-malpa", pl: "małpa", fr: "le singe", category: "monde animal" },
      { id: "v-54-wielblad", pl: "wielbłąd", fr: "le chameau", category: "monde animal" },
      { id: "v-54-krokodyl", pl: "krokodyl", fr: "le crocodile", category: "monde animal" },
      { id: "v-54-waz", pl: "wąż", fr: "le serpent", category: "monde animal" },
      { id: "v-54-rekin", pl: "rekin", fr: "le requin", category: "monde animal" },
      { id: "v-54-pingwin", pl: "pingwin", fr: "le pingouin", category: "monde animal" },
      { id: "v-54-gepard", pl: "gepard", fr: "le guépard", category: "monde animal",
        example: { pl: "Gepard biega bardzo szybko.", fr: "Le guépard court très vite." } },
      { id: "v-54-drapieznik", pl: "drapieżnik", fr: "le prédateur", category: "monde animal" }
    ],
    sentences: [
      { id: "s-54-1", pl: "Słoń jest większy niż lew.", fr: "L'éléphant est plus grand que le lion.", grammarFocus: "g-54-1",
        wordBank: ["Słoń", "jest", "większy", "niż", "lew", "mniejszy"] },
      { id: "s-54-2", pl: "Lew jest drapieżnikiem.", fr: "Le lion est un prédateur.", grammarFocus: "g-54-2",
        wordBank: ["Lew", "jest", "drapieżnikiem", "drapieżnik"] },
      { id: "s-54-3", pl: "Żyrafa jest wyższa od słonia.", fr: "La girafe est plus haute que l'éléphant.", grammarFocus: "g-54-1",
        wordBank: ["Żyrafa", "jest", "wyższa", "od", "słonia", "słoń"] },
      { id: "s-54-4", pl: "Gepard jest najszybszym zwierzęciem na świecie.", fr: "Le guépard est l'animal le plus rapide du monde.", grammarFocus: "g-54-2",
        wordBank: ["Gepard", "jest", "najszybszym", "zwierzęciem", "na", "świecie", "szybszym"] }
    ],
    dialogues: [
      {
        id: "d-54-1",
        title: "W zoo",
        lines: [
          { who: "A", pl: "Które zwierzę lubisz najbardziej?", fr: "Quel animal préfères-tu ?" },
          { who: "B", pl: "Bardzo lubię żyrafy, bo są wysokie.", fr: "J'aime beaucoup les girafes, parce qu'elles sont hautes." },
          { who: "A", pl: "A które zwierzę jest najgroźniejsze?", fr: "Et quel animal est le plus dangereux ?" },
          { who: "B", pl: "Krokodyl jest najgroźniejszy.", fr: "Le crocodile est le plus dangereux.",
            target: true, wordBank: ["Krokodyl", "jest", "najgroźniejszy", "groźny"] }
        ]
      }
    ]
  },

  /* =================== order 47 — Animaux de la forêt ================= */
  {
    id: "lesson-55",
    order: 47,
    title: "W lesie — les animaux de la forêt",
    theme: "forêt",
    mascotIntro:
      "Retour chez Żubr : la forêt polonaise. Loups, renards, chevreuils — et les diminutifs, cette manie polonaise de tout rendre attendrissant. 🌲🦌",
    grammarNotes: [
      {
        id: "g-55-1",
        title: "Génitif pluriel après une négation ou une quantité",
        explanationFr:
          "Après « nie ma » et après les mots de quantité (dużo, mało, kilka), le nom passe au génitif pluriel : wilk → wilków, lis → lisów, sarna → saren, jeż → jeży, mysz → myszy.",
        examples: [
          { pl: "W tym lesie nie ma wilków.", fr: "Il n'y a pas de loups dans cette forêt." },
          { pl: "Nad rzeką jest dużo saren.", fr: "Il y a beaucoup de chevreuils au bord de la rivière." }
        ]
      },
      {
        id: "g-55-2",
        title: "Les diminutifs affectueux en -ek / -ka",
        explanationFr:
          "Le polonais adore les diminutifs : lis → lisek, zając → zajączek, sowa → sówka, kot → kotek. Ils n'indiquent pas seulement la petite taille, mais surtout la tendresse — on les emploie constamment dans la vie quotidienne.",
        examples: [
          { pl: "Mały zajączek biegnie przez las.", fr: "Un petit levraut court à travers la forêt." },
          { pl: "Lisek śpi pod drzewem.", fr: "Le petit renard dort sous l'arbre." }
        ]
      }
    ],
    vocabulary: [
      { id: "v-55-wilk", pl: "wilk", fr: "le loup", category: "forêt" },
      { id: "v-55-lis", pl: "lis", fr: "le renard", category: "forêt",
        example: { pl: "Lisek śpi pod drzewem.", fr: "Le petit renard dort sous l'arbre." } },
      { id: "v-55-sarna", pl: "sarna", fr: "le chevreuil", category: "forêt" },
      { id: "v-55-jelen", pl: "jeleń", fr: "le cerf", category: "forêt" },
      { id: "v-55-dzik", pl: "dzik", fr: "le sanglier", category: "forêt" },
      { id: "v-55-zajac", pl: "zając", fr: "le lièvre", category: "forêt" },
      { id: "v-55-wiewiorka", pl: "wiewiórka", fr: "l'écureuil", category: "forêt" },
      { id: "v-55-sowa", pl: "sowa", fr: "la chouette", category: "forêt" },
      { id: "v-55-jez", pl: "jeż", fr: "le hérisson", category: "forêt" },
      { id: "v-55-mysz", pl: "mysz", fr: "la souris", category: "forêt" },
      { id: "v-55-gniazdo", pl: "gniazdo", fr: "le nid", category: "forêt" },
      { id: "v-55-slad", pl: "ślad", fr: "la trace / l'empreinte", category: "forêt" }
    ],
    sentences: [
      { id: "s-55-1", pl: "W tym lesie nie ma wilków.", fr: "Il n'y a pas de loups dans cette forêt.", grammarFocus: "g-55-1",
        wordBank: ["W", "tym", "lesie", "nie", "ma", "wilków", "wilki"] },
      { id: "s-55-2", pl: "Nad rzeką jest dużo saren.", fr: "Il y a beaucoup de chevreuils au bord de la rivière.", grammarFocus: "g-55-1",
        wordBank: ["Nad", "rzeką", "jest", "dużo", "saren", "sarny"] },
      { id: "s-55-3", pl: "Mały zajączek biegnie przez las.", fr: "Un petit levraut court à travers la forêt.", grammarFocus: "g-55-2",
        wordBank: ["Mały", "zajączek", "biegnie", "przez", "las", "zając"] },
      { id: "s-55-4", pl: "Lisek śpi pod drzewem.", fr: "Le petit renard dort sous l'arbre.", grammarFocus: "g-55-2",
        wordBank: ["Lisek", "śpi", "pod", "drzewem", "lis"] }
    ],
    dialogues: [
      {
        id: "d-55-1",
        title: "Spacer po lesie",
        lines: [
          { who: "A", pl: "Widziałeś jakieś zwierzęta w lesie?", fr: "As-tu vu des animaux dans la forêt ?" },
          { who: "B", pl: "Tak, widziałem sarnę i wiewiórkę.", fr: "Oui, j'ai vu un chevreuil et un écureuil." },
          { who: "A", pl: "A czy są tam wilki?", fr: "Et y a-t-il des loups là-bas ?" },
          { who: "B", pl: "Nie, tutaj nie ma wilków.", fr: "Non, il n'y a pas de loups ici.",
            target: true, wordBank: ["Nie", "tutaj", "nie", "ma", "wilków", "wilki"] }
        ]
      }
    ]
  }
];
