export const flashcardDeckFormat = 'toolio.flashcards' as const;
export const flashcardDeckFormatVersion = 1 as const;

export type FlashcardNoteType = 'basic' | 'basic-and-reversed';

export type FlashcardNote = {
  readonly fields: {
    readonly back: string;
    readonly front: string;
  };
  readonly id: string;
  readonly noteType: FlashcardNoteType;
  readonly tags: readonly string[];
};

export type FlashcardDeck = {
  readonly contentLanguage?: string;
  readonly description?: string;
  readonly format: typeof flashcardDeckFormat;
  readonly formatVersion: typeof flashcardDeckFormatVersion;
  readonly id: string;
  readonly language?: string;
  readonly license?: string;
  readonly notes: readonly FlashcardNote[];
  readonly slug: string;
  readonly title: string;
};

export type FlashcardDirection = 'forward' | 'reverse';

export type Flashcard = {
  readonly answer: string;
  readonly deckId: string;
  readonly direction: FlashcardDirection;
  readonly id: string;
  readonly noteId: string;
  readonly prompt: string;
  readonly tags: readonly string[];
};

export type FlashcardRating = 'again' | 'easy' | 'good' | 'hard';

export type FlashcardLearningState =
  | 'learning'
  | 'new'
  | 'relearning'
  | 'review';

export type FlashcardState = {
  readonly cardId: string;
  readonly deckId: string;
  readonly difficulty: number;
  readonly due: string;
  readonly elapsedDays: number;
  readonly lapses: number;
  readonly lastReview: string | null;
  readonly learningSteps: number;
  readonly repetitions: number;
  readonly scheduledDays: number;
  readonly stability: number;
  readonly state: FlashcardLearningState;
};

export type FlashcardSchedulerSettings = {
  readonly desiredRetention: number;
  readonly enableFuzz: boolean;
  readonly learningSteps: readonly `${number}${'d' | 'h' | 'm'}`[];
  readonly maximumIntervalDays: number;
  readonly parameters?: readonly number[];
  readonly relearningSteps: readonly `${number}${'d' | 'h' | 'm'}`[];
};

export type FlashcardRatingPreview = {
  readonly due: string;
  readonly rating: FlashcardRating;
  readonly scheduledDays: number;
  readonly state: FlashcardState;
};

export type FlashcardReviewEvent = {
  readonly cardId: string;
  readonly deviceId: string;
  readonly id: string;
  readonly nextState: FlashcardState;
  readonly parentReviewId: string | null;
  readonly previousState: FlashcardState;
  readonly rating: FlashcardRating;
  readonly reviewedAt: string;
  readonly scheduler: {
    readonly algorithm: 'fsrs-6';
    readonly implementation: 'ts-fsrs';
    readonly implementationVersion: '5.4.1';
    readonly settings: FlashcardSchedulerSettings;
  };
};

export type FlashcardReviewTransition = {
  readonly event: FlashcardReviewEvent;
  readonly state: FlashcardState;
};

export type FlashcardStore = {
  appendReview(event: FlashcardReviewEvent): Promise<void>;
  commitReview(
    event: FlashcardReviewEvent,
    state: FlashcardState
  ): Promise<void>;
  getCardState(cardId: string): Promise<FlashcardState | null>;
  getDeck(id: string): Promise<FlashcardDeck | null>;
  getDueCardIds(deckId: string, before: string): Promise<readonly string[]>;
  getReviews(cardId: string): Promise<readonly FlashcardReviewEvent[]>;
  listCardStates(): Promise<readonly FlashcardState[]>;
  listDecks(): Promise<readonly FlashcardDeck[]>;
  listReviewEvents(): Promise<readonly FlashcardReviewEvent[]>;
  putCardState(state: FlashcardState): Promise<void>;
  putDeck(deck: FlashcardDeck): Promise<void>;
};
