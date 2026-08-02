/* =====================================================================
   DÉCLARATIONS DE TYPES — app entière
   ---------------------------------------------------------------------
   Fichier AMBIANT : aucun import ni export au niveau racine, donc tous les
   types ci-dessous sont référençables depuis les JSDoc de n'importe quel
   fichier, sans `@typedef {import(...)}`. C'est aussi la condition pour que
   `interface Window` fusionne avec le Window global.
   ===================================================================== */

/* ============ 1. Augmentations de l'environnement ==================== */

/* lib.dom fournit SpeechRecognitionResult / ResultList / Alternative, mais
   NI SpeechRecognition, NI ses deux events : l'API n'est pas standardisée. */
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}
interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
};

interface Window {
  /* Préfixes webkit : Safari et les Chromium anciens. */
  webkitAudioContext?: typeof AudioContext;
  SpeechRecognition?: typeof SpeechRecognition;
  webkitSpeechRecognition?: typeof SpeechRecognition;
}

/* ============ 2. Données pédagogiques (data/) ======================== */

interface GrammarExample {
  pl: string;
  fr: string;
  note?: string;
}

interface GrammarNote {
  id: string;
  title: string;
  explanationFr: string;
  examples: GrammarExample[];
}

interface Vocab {
  id: string;
  pl: string;
  fr: string;
  category: string;
  ipa?: string;
  example?: { pl: string; fr: string };
}

interface Sentence {
  id: string;
  pl: string;
  fr: string;
  /** Mots de `pl` + distracteurs optionnels. Voir tests/data-invariants. */
  wordBank: string[];
  /** Clé étrangère vers un GrammarNote.id de la MÊME leçon. */
  grammarFocus: string;
}

interface DialogueLine {
  who: string;
  pl: string;
  fr: string;
  /** Exactement une ligne par dialogue la porte : c'est la réplique à reconstruire. */
  target?: true;
  /** Co-occurrent avec `target`. */
  wordBank?: string[];
}

interface Dialogue {
  id: string;
  title: string;
  lines: DialogueLine[];
}

interface ReadingQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string;
}

interface Reading {
  id: string;
  title: string;
  paragraphs: string[];
  questions: ReadingQuestion[];
}

interface Production {
  id: string;
  /** Indice en français, ou phrase polonaise source pour une transformation. */
  prompt: string;
  /** Plusieurs formulations acceptées — vérifiées par normalize(), pas une seule chaîne figée. */
  answers: string[];
  /** Clé étrangère vers un GrammarNote.id de la MÊME leçon. */
  grammarFocus: string;
  hint?: string;
}

interface Lesson {
  id: string;
  /** Seule source de vérité du séquencement — indépendant de l'ordre du tableau. */
  order: number;
  title: string;
  theme: string;
  mascotIntro: string;
  grammarNotes: GrammarNote[];
  vocabulary: Vocab[];
  sentences: Sentence[];
  dialogues?: Dialogue[];
  readings?: Reading[];
  productions?: Production[];
}

/* ---- Histoires bonus (un « niveau bonus » par sentier) --------------
   Volontairement HORS de `Lesson` : une histoire n'a pas d'`order`, n'entre
   pas dans la chaîne de déverrouillage et ses ids ne sont pas des clés SRS.
   Cf. CLAUDE.md § Histoires bonus. */

/** "Ż" = Żubr, "B" = Bocian, "N" = narrateur. */
type StoryWho = "Ż" | "B" | "N";

interface StoryLine {
  who: StoryWho;
  pl: string;
  fr: string;
}

/** QCM à 1 OU 2 bonnes réponses — `answers` porte la vérité, pas une chaîne. */
interface StoryQuizStep {
  kind: "quiz";
  id: string;
  /** Énoncé en polonais (l'histoire se lit en polonais). */
  question: string;
  /** Traduction de l'énoncé, affichée en sous-titre. */
  questionFr: string;
  options: string[];
  /** Sous-ensemble de `options`. 1 ou 2 entrées. */
  answers: string[];
}

/** Reconstituer une réplique depuis des tuiles. Même règle que Sentence.wordBank. */
interface StoryBuildStep {
  kind: "build";
  id: string;
  who: StoryWho;
  pl: string;
  fr: string;
  /** Mots de `pl` + distracteurs optionnels. */
  wordBank: string[];
}

interface StoryGapStep {
  kind: "gap";
  id: string;
  who: StoryWho;
  /** Contient le marqueur de trou `_____`. */
  sentence: string;
  fr: string;
  /** Doit appartenir à `options`. */
  answer: string;
  options: string[];
}

interface StoryMatchStep {
  kind: "match";
  id: string;
  pairs: { pl: string; fr: string }[];
}

type StoryStep = StoryQuizStep | StoryBuildStep | StoryGapStep | StoryMatchStep;

interface StoryScene {
  lines: StoryLine[];
  step: StoryStep;
}

interface Story {
  id: string;
  /** Index 0-based dans le tableau TRAILS de js/app.js. Un sentier au plus. */
  trailIndex: number;
  icon: string;
  title: string;
  titleFr: string;
  mascotIntro: string;
  scenes: StoryScene[];
}

interface Badge {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  check: (s: PersistedState) => boolean;
}

/* ============ 3. État persisté (localStorage) ======================== */

interface SrsItem {
  /* `number` et non 1|2|3|4|5 : Math.min(MAX_BOX, box + 1) ne se prouve pas
     par le typeur, et un cast pour lui faire plaisir serait un mensonge. */
  box: number;
  /** "YYYY-MM-DD", heure LOCALE (cf. State.todayStr). */
  dueDate: string;
  /* MORTS : écrits par SRS.record, jamais relus. Ils représentent ~60 % du
     poids de `items`. Conservés — les retirer changerait la forme persistée,
     ce que le palier 3 s'est interdit (cf. CLAUDE.md § Persistance). */
  seenCount: number;
  correctCount: number;
  lastSeen: string | null;
}

type LessonStatus = "locked" | "available" | "inProgress" | "completed";

interface LessonProgress {
  status: LessonStatus;
  bestScore: number;
}

type Theme = "auto" | "light" | "dark";

/** Résultat du dernier chargement de la sauvegarde. */
interface LoadStatus {
  /** `readonly` = sauvegarde d'une version future, rien ne sera écrit. */
  mode: "normal" | "readonly";
  /** Pourquoi le mode dégradé, quand il y en a un. */
  reason?: "future-version" | "unreadable";
  loadedVersion: number;
  /**
   * Champs réparés à la lecture, un libellé par réparation. VIDE sur une
   * sauvegarde saine — c'est ce qui garantit qu'on ne « répare » pas de la
   * donnée valide.
   */
  repairs: string[];
}

interface PersistedState {
  /** Lu par State.readVersion au chargement ; jamais lu par le reste du code. */
  version: number;
  /** `createdAt` est MORT : écrit une fois, jamais relu. */
  profile: { createdAt: string; totalXP: number; level: number };
  /** `longest` est MORT : entretenu par touchActivity, affiché nulle part. */
  streak: { current: number; longest: number; lastActiveDate: string | null };
  dailyGoal: {
    minutesTarget: number;
    todayDate: string;
    secondsToday: number;
    /**
     * VERROU D'IDEMPOTENCE, et non un cache de `secondsToday >= cible`. Il
     * existe pour que le bonus de 100 XP ne soit crédité qu'une fois par jour.
     * Le recalculer depuis `secondsToday` recréditerait à chaque tick de 30 s.
     * Remis à `false` par rolloverDay, jamais autrement.
     */
    goalMetToday: boolean;
  };
  /* `| undefined` volontaire : le contenu vient d'un JSON utilisateur non
     validé. C'est ce qui rend leur sens aux gardes déjà présentes
     (srs.js `if (!item)`, app.js `|| { status: "locked" }`) — sans ça elles
     seraient typées comme du code mort. */
  items: Record<string, SrsItem | undefined>;
  lessons: Record<string, LessonProgress | undefined>;
  badges: string[];
  flags: { perfectPronunciation: boolean; everMetDailyGoal: boolean };
  settings: {
    ttsRate: number;
    voiceName: string | null;
    soundOn: boolean;
    theme: Theme;
  };
}

/* ============ 4. Index d'exercices — couche DÉRIVÉE ==================
   Distincte des types de données : buildIndex() ajoute `kind` et `lessonId`
   (absents des données) et NORMALISE l'optionalité en `| null`. Ne pas
   réutiliser Vocab/Sentence ici, les deux couches ne sont pas
   interchangeables. */

interface VocabEntry {
  kind: "vocab";
  id: string;
  pl: string;
  fr: string;
  lessonId: string;
  category: string;
  example: { pl: string; fr: string } | null;
}

interface SentenceEntry {
  kind: "sentence";
  id: string;
  pl: string;
  fr: string;
  lessonId: string;
  wordBank: string[];
  grammarFocus: string | null;
}

type IndexEntry = VocabEntry | SentenceEntry;

/* ============ 5. Exercices — union discriminée par `type` ============ */

interface ExerciseBase {
  itemId: string;
  promptText: string;
  promptLang: "pl" | "fr";
  answer: string;
  answerLang: "pl" | "fr";
  audioText: string;
  instruction: string;
}

interface McExercise extends ExerciseBase {
  type: "mc-pl-fr" | "mc-fr-pl";
  options: string[];
}

/* `revealText` est volontairement NON déclaré : makeListen l'écrit mais
   personne ne le lit. L'omettre fait attraper le champ mort par le contrôle
   de propriété excédentaire. */
interface ListenExercise extends ExerciseBase {
  type: "listen";
  options: string[];
  autoPlay: true;
}

interface TypeExercise extends ExerciseBase {
  type: "type-fr-pl";
}

interface ClozeExercise extends ExerciseBase {
  type: "cloze";
  subText: string;
}

interface SpeakExercise extends ExerciseBase {
  type: "speak";
  subText: string;
}

interface BuildExercise extends ExerciseBase {
  type: "build";
  bank: string[];
}

interface DialogueExercise extends ExerciseBase {
  type: "dialogue";
  bank: string[];
  context: DialogueLine[];
  title: string;
  /** `who` de la ligne cible : la voix jouée au feedback doit correspondre au locuteur. */
  speaker: string;
}

interface ReadingExercise extends ExerciseBase {
  type: "reading";
  /** Paragraphes du texte, affichés au-dessus de la question. */
  passage: string[];
  options: string[];
}

interface WriteExercise extends ExerciseBase {
  type: "write";
  /** Toutes les formulations acceptées ; `answer` porte la première (affichage seulement). */
  acceptedAnswers: string[];
  hint?: string;
}

/* ---- Les 4 épreuves d'une histoire bonus ----------------------------
   Toutes portent `context` : les répliques de la scène, affichées au-dessus de
   l'épreuve et lues à voix haute. C'est ce champ commun qui justifie un
   renderer de contexte partagé (appendSceneContext, js/app.js).

   `story-build` est un type À PART et ne réutilise PAS `dialogue` : dans un
   dialogue de leçon la réplique cible est MASQUÉE au sein du contexte
   (`target: true`), alors qu'ici la scène est entièrement visible et la
   réplique à produire vient s'ajouter à la fin. Fusionner les deux aurait
   chargé le renderer des leçons de cas qu'elles n'ont pas. */

interface StoryExerciseBase extends ExerciseBase {
  /** Répliques de la scène. Aucune n'est masquée. */
  context: StoryLine[];
  /** Titre de l'histoire, affiché en tête de carte. */
  sceneTitle: string;
}

interface StoryQuizExercise extends StoryExerciseBase {
  type: "story-quiz";
  options: string[];
  /** 1 ou 2 entrées. `answer` porte la 1re (affichage seulement). */
  answers: string[];
  /** Dérivé de `answers.length > 1` : conditionne le mode bascule du rendu. */
  multi: boolean;
  /** Traduction de l'énoncé. */
  subText: string;
}

interface StoryBuildExercise extends StoryExerciseBase {
  type: "story-build";
  bank: string[];
  /** `who` de la réplique à produire : sélectionne la voix du feedback. */
  speaker: StoryWho;
}

interface StoryGapExercise extends StoryExerciseBase {
  type: "story-gap";
  options: string[];
  subText: string;
  speaker: StoryWho;
}

interface StoryMatchExercise extends StoryExerciseBase {
  type: "story-match";
  pairs: { pl: string; fr: string }[];
}

type Exercise =
  | McExercise
  | ListenExercise
  | TypeExercise
  | ClozeExercise
  | SpeakExercise
  | BuildExercise
  | DialogueExercise
  | ReadingExercise
  | WriteExercise
  | StoryQuizExercise
  | StoryBuildExercise
  | StoryGapExercise
  | StoryMatchExercise;

/**
 * Ce que l'utilisateur soumet, toutes formes confondues. Le TYPE d'exercice
 * dicte la forme attendue et `Exercises.check` la restreint par narrowing :
 *   - `string[]` de mots ordonnés    → build / dialogue / story-build
 *   - `string[]` d'options cochées   → story-quiz multiple
 *   - `{pl, fr}[]` de paires formées → story-match
 *   - `string`                       → tous les autres
 * Une union plutôt qu'un `any` : une forme inattendue est refusée (donc comptée
 * fausse), jamais interprétée de travers.
 */
type UserAnswer = string | string[] | { pl: string; fr: string }[] | null;

/* Les variantes qui se reconstruisent depuis une banque de mots : c'est le
   paramètre légitime d'appendWordBankPicker. */
type WordBankExercise = BuildExercise | DialogueExercise | StoryBuildExercise;

/* ============ 6. Session ============================================= */

type SessionMeta =
  | { kind: "lesson"; lessonId: string; title: string }
  | { kind: "review"; title: string }
  /* Distincte de "lesson" : une histoire ne crédite pas de SRS et ne
     déverrouille rien (cf. Progress.storyFinished). */
  | { kind: "story"; storyId: string; title: string };

interface SessionResult {
  itemId: string;
  correct: boolean;
  type: Exercise["type"];
}

interface SessionState {
  exercises: Exercise[];
  index: number;
  results: SessionResult[];
  meta: SessionMeta;
  xp: number;
}

/* ============ 7. Speech ============================================== */

interface SpeakOpts {
  /** Index dans les voix polonaises : différencie les 2 voix d'un dialogue. */
  voiceIndex?: 0 | 1 | null;
  pitch?: number | null;
  rate?: number;
  onend?: () => void;
}

interface ListenCallbacks {
  onResult?: (transcript: string, confidence: number, alts: string[]) => void;
  onError?: (err: string) => void;
  onEnd?: () => void;
  /** Appelé seulement si aucun résultat n'est arrivé, avant onEnd. */
  onNoSpeech?: () => void;
}

/* ============ 8. Helper de rendu UI.el =============================== */

type ElChild = HTMLElement | SVGElement | string | null | undefined;

/* Les `on*` sont déclarés explicitement pour deux raisons : ça type
   contextuellement les handlers inline, et ça attrape le passage d'une
   fonction de signature incompatible (par contravariance). `| null` est
   indispensable : le motif `cond ? null : function(){}` est courant, et
   el() ignore explicitement null. */
interface ElAttrs {
  class?: string;
  text?: string;
  html?: string;
  onclick?: ((this: HTMLElement, ev: MouseEvent) => void) | null;
  onchange?: ((this: HTMLElement, ev: Event) => void) | null;
  oninput?: ((this: HTMLElement, ev: Event) => void) | null;
  onkeydown?: ((this: HTMLElement, ev: KeyboardEvent) => void) | null;
  onerror?: ((this: HTMLElement, ev: Event) => void) | null;
  /* Tout le reste part en setAttribute ; null/undefined sont ignorés. */
  [k: string]: unknown;
}

/** Une étape de migration du schéma persisté : version `to - 1` → `to`. */
interface Migration {
  to: number;
  up: (s: any) => any;
}

/** Aperçu d'un fichier d'import, calculé SANS modifier l'état courant. */
interface ImportPreview {
  version: number;
  totalXP: number;
  level: number;
  itemCount: number;
  lessonsCompleted: number;
  repairs: string[];
}

/**
 * Forme du document Firestore `progress/{uid}` (palier 4). `state` n'est PAS
 * typé `PersistedState` ici : il vient du réseau, aussi peu fiable qu'un JSON
 * importé — `State.mergeRemote` le fait passer par le même pipeline
 * migrate/validate qu'un fichier d'import avant de le fusionner. `writerId`
 * et `updatedAt` sont hors du schéma `PersistedState` : jamais lus par
 * `validate()`, ils servent uniquement à l'anti-écho de `js/cloud.js`.
 */
interface CloudProgressDoc {
  state: unknown;
  writerId: string;
  updatedAt: unknown; // FieldValue à l'écriture (serverTimestamp()), Timestamp à la lecture
}
