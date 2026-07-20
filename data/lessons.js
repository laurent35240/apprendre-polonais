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
    id: "lesson-11",
    order: 9,
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

  /* ================================ 10 =============================== */
  {
    id: "lesson-09",
    order: 10,
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

  /* ================================ 11 =============================== */
  {
    id: "lesson-10",
    order: 11,
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

  /* ================================ 12 =============================== */
  {
    id: "lesson-12",
    order: 12,
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

  /* ================================ 13 =============================== */
  {
    id: "lesson-13",
    order: 13,
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

  /* ================================ 14 =============================== */
  {
    id: "lesson-14",
    order: 14,
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

  /* ================================ 15 =============================== */
  {
    id: "lesson-15",
    order: 15,
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

  /* ================================ 16 =============================== */
  {
    id: "lesson-16",
    order: 16,
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

  /* ================================ 17 =============================== */
  {
    id: "lesson-17",
    order: 17,
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

  /* ================================ 18 =============================== */
  {
    id: "lesson-18",
    order: 18,
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

  /* ================================ 19 =============================== */
  {
    id: "lesson-19",
    order: 19,
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

  /* ================================ 20 =============================== */
  {
    id: "lesson-20",
    order: 20,
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

  /* ================================ 21 =============================== */
  {
    id: "lesson-21",
    order: 21,
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
  }
];
