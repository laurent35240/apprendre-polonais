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
}

type Exercise =
  | McExercise
  | ListenExercise
  | TypeExercise
  | ClozeExercise
  | SpeakExercise
  | BuildExercise
  | DialogueExercise;

/* Les deux variantes qui se reconstruisent depuis une banque de mots :
   c'est le paramètre légitime d'appendWordBankPicker. */
type WordBankExercise = BuildExercise | DialogueExercise;

/* ============ 6. Session ============================================= */

type SessionMeta =
  | { kind: "lesson"; lessonId: string; title: string }
  | { kind: "review"; title: string };

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
