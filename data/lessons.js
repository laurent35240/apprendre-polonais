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

window.POLISH_LESSONS = [
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

  /* ================================ 3 ================================ */
  {
    id: "lesson-03",
    order: 3,
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
    order: 4,
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
    id: "lesson-05",
    order: 5,
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

  /* ================================ 6 ================================ */
  {
    id: "lesson-06",
    order: 6,
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

  /* ================================ 7 ================================ */
  {
    id: "lesson-07",
    order: 7,
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

  /* ================================ 8 ================================ */
  {
    id: "lesson-08",
    order: 8,
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

  /* ================================ 9 ================================ */
  {
    id: "lesson-09",
    order: 9,
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

  /* ================================ 10 =============================== */
  {
    id: "lesson-10",
    order: 10,
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
  }
];
