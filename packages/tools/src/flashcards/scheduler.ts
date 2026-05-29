import {
  Rating,
  State,
  fsrs,
  type Card,
  type CardInput,
  type Grade
} from 'ts-fsrs';
import type {
  FlashcardLearningState,
  FlashcardRating,
  FlashcardRatingPreview,
  FlashcardReviewTransition,
  FlashcardSchedulerSettings,
  FlashcardState
} from './types.js';

export const defaultFlashcardSchedulerSettings: FlashcardSchedulerSettings = {
  desiredRetention: 0.9,
  enableFuzz: false,
  learningSteps: ['1m', '10m'],
  maximumIntervalDays: 36_500,
  relearningSteps: ['10m']
};

const stateToFsrs: Record<FlashcardLearningState, State> = {
  learning: State.Learning,
  new: State.New,
  relearning: State.Relearning,
  review: State.Review
};

const stateFromFsrs: Record<State, FlashcardLearningState> = {
  [State.New]: 'new',
  [State.Learning]: 'learning',
  [State.Review]: 'review',
  [State.Relearning]: 'relearning'
};

const ratingToFsrs: Record<FlashcardRating, Grade> = {
  again: Rating.Again,
  easy: Rating.Easy,
  good: Rating.Good,
  hard: Rating.Hard
};

const ratingOrder: readonly FlashcardRating[] = [
  'again',
  'hard',
  'good',
  'easy'
];

const toFsrsCard = (state: FlashcardState): CardInput => ({
  difficulty: state.difficulty,
  due: new Date(state.due),
  elapsed_days: state.elapsedDays,
  lapses: state.lapses,
  last_review:
    state.lastReview === null ? undefined : new Date(state.lastReview),
  learning_steps: state.learningSteps,
  reps: state.repetitions,
  scheduled_days: state.scheduledDays,
  stability: state.stability,
  state: stateToFsrs[state.state]
});

const fromFsrsCard = (
  deckId: string,
  cardId: string,
  card: Card
): FlashcardState => ({
  cardId,
  deckId,
  difficulty: card.difficulty,
  due: card.due.toISOString(),
  elapsedDays: card.elapsed_days,
  lapses: card.lapses,
  lastReview: card.last_review?.toISOString() ?? null,
  learningSteps: card.learning_steps,
  repetitions: card.reps,
  scheduledDays: card.scheduled_days,
  stability: card.stability,
  state: stateFromFsrs[card.state]
});

const createScheduler = (settings: FlashcardSchedulerSettings) =>
  fsrs({
    enable_fuzz: settings.enableFuzz,
    learning_steps: settings.learningSteps,
    maximum_interval: settings.maximumIntervalDays,
    relearning_steps: settings.relearningSteps,
    request_retention: settings.desiredRetention,
    ...(settings.parameters === undefined ? {} : { w: settings.parameters })
  });

export const createFlashcardState = (
  deckId: string,
  cardId: string,
  now: Date
): FlashcardState => ({
  cardId,
  deckId,
  difficulty: 0,
  due: now.toISOString(),
  elapsedDays: 0,
  lapses: 0,
  lastReview: null,
  learningSteps: 0,
  repetitions: 0,
  scheduledDays: 0,
  stability: 0,
  state: 'new'
});

export const previewFlashcardRatings = (
  state: FlashcardState,
  reviewedAt: Date,
  settings = defaultFlashcardSchedulerSettings
): readonly FlashcardRatingPreview[] => {
  const previews = createScheduler(settings).repeat(
    toFsrsCard(state),
    reviewedAt
  );
  return ratingOrder.map((rating) => {
    const next = previews[ratingToFsrs[rating]].card;
    return {
      due: next.due.toISOString(),
      rating,
      scheduledDays: next.scheduled_days,
      state: fromFsrsCard(state.deckId, state.cardId, next)
    };
  });
};

export type ReviewFlashcardInput = {
  readonly deviceId: string;
  readonly eventId: string;
  readonly parentReviewId?: string | null;
  readonly rating: FlashcardRating;
  readonly reviewedAt: Date;
  readonly state: FlashcardState;
};

export const reviewFlashcard = (
  input: ReviewFlashcardInput,
  settings = defaultFlashcardSchedulerSettings
): FlashcardReviewTransition => {
  const next = createScheduler(settings).next(
    toFsrsCard(input.state),
    input.reviewedAt,
    ratingToFsrs[input.rating]
  ).card;
  const state = fromFsrsCard(
    input.state.deckId,
    input.state.cardId,
    next
  );
  return {
    event: {
      cardId: input.state.cardId,
      deviceId: input.deviceId,
      id: input.eventId,
      nextState: state,
      parentReviewId: input.parentReviewId ?? null,
      previousState: input.state,
      rating: input.rating,
      reviewedAt: input.reviewedAt.toISOString(),
      scheduler: {
        algorithm: 'fsrs-6',
        implementation: 'ts-fsrs',
        implementationVersion: '5.4.1',
        settings: {
          ...settings,
          learningSteps: [...settings.learningSteps],
          ...(settings.parameters === undefined
            ? {}
            : { parameters: [...settings.parameters] }),
          relearningSteps: [...settings.relearningSteps]
        }
      }
    },
    state
  };
};

export const createStudyQueue = (
  states: readonly FlashcardState[],
  now: Date
): readonly string[] =>
  states
    .filter((state) => new Date(state.due).getTime() <= now.getTime())
    .sort(
      (left, right) =>
        new Date(left.due).getTime() - new Date(right.due).getTime() ||
        left.cardId.localeCompare(right.cardId)
    )
    .map((state) => state.cardId);
