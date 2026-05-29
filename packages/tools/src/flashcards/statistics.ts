import { generateFlashcards } from './deck.js';
import type {
  FlashcardDeck,
  FlashcardLearningState,
  FlashcardRating,
  FlashcardReviewEvent,
  FlashcardState
} from './types.js';

export type FlashcardRatingCounts = Readonly<Record<FlashcardRating, number>>;

export type FlashcardActivityStatistics = {
  readonly cardCount: number;
  readonly learnedCardCount: number;
  readonly newCardCount: number;
  readonly ratingCounts: FlashcardRatingCounts;
  readonly reviewCount: number;
  readonly successRate: number | null;
};

export type FlashcardStateCounts = Readonly<
  Record<FlashcardLearningState, number>
>;

export type FlashcardDeckStatistics = {
  readonly cardCount: number;
  readonly deckId: string;
  readonly dueLaterTodayCount: number;
  readonly dueNowCount: number;
  readonly introducedCardCount: number;
  readonly learnedCardCount: number;
  readonly nextDue: string | null;
  readonly noteCount: number;
  readonly stateCounts: FlashcardStateCounts;
  readonly title: string;
  readonly today: FlashcardActivityStatistics;
};

export type FlashcardLibraryStatistics = {
  readonly cardCount: number;
  readonly deckCount: number;
  readonly decks: readonly FlashcardDeckStatistics[];
  readonly dueLaterTodayCount: number;
  readonly dueNowCount: number;
  readonly introducedCardCount: number;
  readonly learnedCardCount: number;
  readonly noteCount: number;
  readonly today: FlashcardActivityStatistics;
};

export type SummarizeFlashcardLibraryInput = {
  readonly dayEnd?: Date;
  readonly dayStart?: Date;
  readonly decks: readonly FlashcardDeck[];
  readonly now: Date;
  readonly reviews: readonly FlashcardReviewEvent[];
  readonly states: readonly FlashcardState[];
};

const emptyRatingCounts = (): Record<FlashcardRating, number> => ({
  again: 0,
  easy: 0,
  good: 0,
  hard: 0
});

const emptyStateCounts = (): Record<FlashcardLearningState, number> => ({
  learning: 0,
  new: 0,
  relearning: 0,
  review: 0
});

const localDayBounds = (
  now: Date
): { readonly end: Date; readonly start: Date } => {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { end, start };
};

const eventDeckId = (event: FlashcardReviewEvent): string =>
  event.nextState.deckId;

const summarizeActivity = (
  allReviews: readonly FlashcardReviewEvent[],
  start: Date,
  end: Date
): FlashcardActivityStatistics => {
  const startTime = start.getTime();
  const endTime = end.getTime();
  const ordered = [...allReviews].sort((left, right) =>
    left.reviewedAt.localeCompare(right.reviewedAt)
  );
  const firstReviewByCard = new Map<string, FlashcardReviewEvent>();
  const firstLearnedByCard = new Map<string, FlashcardReviewEvent>();

  for (const review of ordered) {
    if (!firstReviewByCard.has(review.cardId)) {
      firstReviewByCard.set(review.cardId, review);
    }
    if (
      review.nextState.state === 'review' &&
      !firstLearnedByCard.has(review.cardId)
    ) {
      firstLearnedByCard.set(review.cardId, review);
    }
  }

  const reviews = ordered.filter((review) => {
    const reviewedAt = new Date(review.reviewedAt).getTime();
    return reviewedAt >= startTime && reviewedAt < endTime;
  });
  const ratingCounts = emptyRatingCounts();
  for (const review of reviews) ratingCounts[review.rating] += 1;

  const inPeriod = (event: FlashcardReviewEvent): boolean => {
    const reviewedAt = new Date(event.reviewedAt).getTime();
    return reviewedAt >= startTime && reviewedAt < endTime;
  };
  const cardCount = new Set(reviews.map((review) => review.cardId)).size;
  const reviewCount = reviews.length;

  return {
    cardCount,
    learnedCardCount: [...firstLearnedByCard.values()].filter(inPeriod)
      .length,
    newCardCount: [...firstReviewByCard.values()].filter(inPeriod).length,
    ratingCounts,
    reviewCount,
    successRate:
      reviewCount === 0
        ? null
        : (reviewCount - ratingCounts.again) / reviewCount
  };
};

const summarizeDeck = (
  deck: FlashcardDeck,
  states: readonly FlashcardState[],
  reviews: readonly FlashcardReviewEvent[],
  now: Date,
  dayStart: Date,
  dayEnd: Date
): FlashcardDeckStatistics => {
  const cards = generateFlashcards(deck);
  const cardIds = new Set(cards.map((card) => card.id));
  const deckStates = states.filter(
    (state) => state.deckId === deck.id && cardIds.has(state.cardId)
  );
  const stateByCard = new Map(
    deckStates.map((state) => [state.cardId, state])
  );
  const deckReviews = reviews.filter(
    (review) =>
      eventDeckId(review) === deck.id && cardIds.has(review.cardId)
  );
  const reviewedCards = new Set(
    deckReviews.map((review) => review.cardId)
  );
  const learnedCards = new Set(
    deckReviews
      .filter((review) => review.nextState.state === 'review')
      .map((review) => review.cardId)
  );
  const stateCounts = emptyStateCounts();
  let dueLaterTodayCount = 0;
  let dueNowCount = 0;
  let introducedCardCount = 0;
  let learnedCardCount = 0;
  let nextDue: string | null = null;
  const nowTime = now.getTime();
  const dayEndTime = dayEnd.getTime();

  for (const card of cards) {
    const state = stateByCard.get(card.id);
    if (!state) {
      stateCounts.new += 1;
      dueNowCount += 1;
      continue;
    }

    stateCounts[state.state] += 1;
    if (state.repetitions > 0 || reviewedCards.has(card.id)) {
      introducedCardCount += 1;
    }
    if (state.state === 'review' || learnedCards.has(card.id)) {
      learnedCardCount += 1;
    }

    const dueTime = new Date(state.due).getTime();
    if (dueTime <= nowTime) {
      dueNowCount += 1;
    } else {
      if (dueTime < dayEndTime) dueLaterTodayCount += 1;
      if (
        nextDue === null ||
        dueTime < new Date(nextDue).getTime()
      ) {
        nextDue = state.due;
      }
    }
  }

  return {
    cardCount: cards.length,
    deckId: deck.id,
    dueLaterTodayCount,
    dueNowCount,
    introducedCardCount,
    learnedCardCount,
    nextDue,
    noteCount: deck.notes.length,
    stateCounts,
    title: deck.title,
    today: summarizeActivity(deckReviews, dayStart, dayEnd)
  };
};

export const summarizeFlashcardLibrary = (
  input: SummarizeFlashcardLibraryInput
): FlashcardLibraryStatistics => {
  const defaultBounds = localDayBounds(input.now);
  const dayStart = input.dayStart ?? defaultBounds.start;
  const dayEnd = input.dayEnd ?? defaultBounds.end;
  const decks = input.decks
    .map((deck) =>
      summarizeDeck(
        deck,
        input.states,
        input.reviews,
        input.now,
        dayStart,
        dayEnd
      )
    )
    .sort((left, right) => left.title.localeCompare(right.title));

  return {
    cardCount: decks.reduce((total, deck) => total + deck.cardCount, 0),
    deckCount: decks.length,
    decks,
    dueLaterTodayCount: decks.reduce(
      (total, deck) => total + deck.dueLaterTodayCount,
      0
    ),
    dueNowCount: decks.reduce(
      (total, deck) => total + deck.dueNowCount,
      0
    ),
    introducedCardCount: decks.reduce(
      (total, deck) => total + deck.introducedCardCount,
      0
    ),
    learnedCardCount: decks.reduce(
      (total, deck) => total + deck.learnedCardCount,
      0
    ),
    noteCount: decks.reduce((total, deck) => total + deck.noteCount, 0),
    today: summarizeActivity(input.reviews, dayStart, dayEnd)
  };
};
