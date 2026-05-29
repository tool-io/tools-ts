import { describe, expect, it } from 'vitest';
import fixture from '../../../../fixtures/flashcards/basic-deck.json' with {
  type: 'json'
};
import { generateFlashcards, validateFlashcardDeck } from './deck.js';
import {
  createFlashcardState,
  reviewFlashcard
} from './scheduler.js';
import { summarizeFlashcardLibrary } from './statistics.js';

describe('flashcard statistics', () => {
  it('summarizes daily activity, learning states, and due cards', () => {
    const validated = validateFlashcardDeck(fixture);
    expect(validated.ok).toBe(true);
    if (!validated.ok) return;

    const cards = generateFlashcards(validated.output);
    const first = createFlashcardState(
      validated.output.id,
      cards[0]?.id ?? '',
      new Date('2026-07-29T09:00:00.000Z')
    );
    const introduced = reviewFlashcard({
      deviceId: 'device-1',
      eventId: 'review-1',
      rating: 'good',
      reviewedAt: new Date('2026-07-29T09:00:00.000Z'),
      state: first
    });
    const learned = reviewFlashcard({
      deviceId: 'device-1',
      eventId: 'review-2',
      parentReviewId: introduced.event.id,
      rating: 'good',
      reviewedAt: new Date('2026-07-29T09:10:00.000Z'),
      state: introduced.state
    });

    const statistics = summarizeFlashcardLibrary({
      dayEnd: new Date('2026-07-30T00:00:00.000Z'),
      dayStart: new Date('2026-07-29T00:00:00.000Z'),
      decks: [validated.output],
      now: new Date('2026-07-29T12:00:00.000Z'),
      reviews: [introduced.event, learned.event],
      states: [
        learned.state,
        createFlashcardState(
          validated.output.id,
          cards[1]?.id ?? '',
          new Date('2026-07-30T08:00:00.000Z')
        )
      ]
    });

    expect(statistics).toMatchObject({
      cardCount: 3,
      deckCount: 1,
      dueNowCount: 1,
      introducedCardCount: 1,
      learnedCardCount: 1,
      noteCount: 2,
      today: {
        cardCount: 1,
        learnedCardCount: 1,
        newCardCount: 1,
        reviewCount: 2,
        successRate: 1
      }
    });
    expect(statistics.today.ratingCounts.good).toBe(2);
    expect(statistics.decks[0]?.stateCounts).toEqual({
      learning: 0,
      new: 2,
      relearning: 0,
      review: 1
    });
  });

  it('counts an again rating as an unsuccessful review', () => {
    const validated = validateFlashcardDeck(fixture);
    expect(validated.ok).toBe(true);
    if (!validated.ok) return;
    const card = generateFlashcards(validated.output)[0];
    const state = createFlashcardState(
      validated.output.id,
      card?.id ?? '',
      new Date('2026-07-29T10:00:00.000Z')
    );
    const review = reviewFlashcard({
      deviceId: 'device-1',
      eventId: 'review-again',
      rating: 'again',
      reviewedAt: new Date('2026-07-29T10:00:00.000Z'),
      state
    });

    const statistics = summarizeFlashcardLibrary({
      dayEnd: new Date('2026-07-30T00:00:00.000Z'),
      dayStart: new Date('2026-07-29T00:00:00.000Z'),
      decks: [validated.output],
      now: new Date('2026-07-29T12:00:00.000Z'),
      reviews: [review.event],
      states: [review.state]
    });

    expect(statistics.today.successRate).toBe(0);
    expect(statistics.today.ratingCounts.again).toBe(1);
  });
});
