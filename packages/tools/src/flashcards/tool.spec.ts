import { describe, expect, it } from 'vitest';
import fixture from '../../../../fixtures/flashcards/basic-deck.json' with {
  type: 'json'
};
import {
  exportFlashcardDeck,
  generateFlashcards,
  parseFlashcardDeck,
  validateFlashcardDeck
} from './deck.js';
import {
  exportFlashcardDeckMarkdown,
  parseFlashcardDeckMarkdown
} from './markdown.js';
import {
  createFlashcardState,
  createStudyQueue,
  previewFlashcardRatings,
  reviewFlashcard
} from './scheduler.js';

describe('flashcard decks', () => {
  it('validates the portable conformance fixture', () => {
    const result = validateFlashcardDeck(fixture);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(generateFlashcards(result.output)).toHaveLength(3);
    }
  });

  it('round-trips canonical JSON', () => {
    const validated = validateFlashcardDeck(fixture);
    expect(validated.ok).toBe(true);
    if (validated.ok) {
      expect(parseFlashcardDeck(exportFlashcardDeck(validated.output))).toEqual(
        validated
      );
    }
  });

  it('namespaces generated card ids by deck', () => {
    const validated = validateFlashcardDeck(fixture);
    expect(validated.ok).toBe(true);
    if (validated.ok) {
      const firstId = generateFlashcards(validated.output)[0]?.id;
      const secondId = generateFlashcards({
        ...validated.output,
        id: 'another-deck'
      })[0]?.id;
      expect(firstId).not.toBe(secondId);
    }
  });

  it('reports malformed JSON and duplicate note ids', () => {
    expect(parseFlashcardDeck('{')).toMatchObject({
      error: { code: 'invalid_input' },
      ok: false
    });
    expect(
      validateFlashcardDeck({
        ...fixture,
        notes: [fixture.notes[0], fixture.notes[0]]
      })
    ).toMatchObject({
      error: {
        issues: expect.arrayContaining([
          expect.objectContaining({ code: 'duplicate_note_id' })
        ])
      },
      ok: false
    });
  });
});

describe('Markdown flashcard decks', () => {
  const markdown = `# 1s answers to common Dev and System Design questions

Quick answers for review.

## Kafka in 1 second

distributed queue

## Load balancer in 1 second

request distribution

## Redis in 1 second

in-memory kv-store
`;

  it('imports a simple Markdown deck into the canonical model', () => {
    const parsed = parseFlashcardDeckMarkdown(markdown);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.output).toMatchObject({
        description: 'Quick answers for review.',
        format: 'toolio.flashcards',
        formatVersion: 1,
        slug: '1s-answers-to-common-dev-and-system-design-questions',
        title: '1s answers to common Dev and System Design questions'
      });
      expect(parsed.output.notes).toHaveLength(3);
      expect(parsed.output.notes[0]).toMatchObject({
        fields: {
          back: 'distributed queue',
          front: 'Kafka in 1 second'
        },
        noteType: 'basic',
        tags: []
      });
    }
  });

  it('preserves nested Markdown and ignores headings in fenced code', () => {
    const parsed = parseFlashcardDeckMarkdown(`# Tool.io Example Deck

## What does the logo of Tool.io look like?

Similar to a robot cat
![Tool.io logo](https://tool.io/favicon.png)

### Details

\`\`\`md
## This remains part of the answer
\`\`\`
`);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.output.notes[0]?.fields.back).toContain(
        '![Tool.io logo](https://tool.io/favicon.png)'
      );
      expect(parsed.output.notes[0]?.fields.back).toContain('### Details');
      expect(parsed.output.notes[0]?.fields.back).toContain(
        '## This remains part of the answer'
      );
    }
  });

  it('creates stable ids and adds ordinals to duplicate fronts', () => {
    const source = `# Repeated cards

## Same

First

## Same

Second
`;
    const first = parseFlashcardDeckMarkdown(source);
    const second = parseFlashcardDeckMarkdown(source);
    expect(second).toEqual(first);
    if (first.ok) {
      expect(first.output.notes[0]?.id).not.toBe(
        first.output.notes[1]?.id
      );
    }
  });

  it('exports a canonical deck as simple Markdown', () => {
    const parsed = parseFlashcardDeckMarkdown(markdown);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(exportFlashcardDeckMarkdown(parsed.output)).toBe(markdown);
    }
  });

  it('rejects missing titles, additional titles, and empty cards', () => {
    expect(parseFlashcardDeckMarkdown('## Front\n\nBack')).toMatchObject({
      error: {
        issues: expect.arrayContaining([
          expect.objectContaining({ code: 'missing_deck_title' })
        ])
      },
      ok: false
    });
    expect(
      parseFlashcardDeckMarkdown(
        '# First\n\n# Second\n\n## Front\n\nBack'
      )
    ).toMatchObject({
      error: {
        issues: expect.arrayContaining([
          expect.objectContaining({ code: 'multiple_deck_titles' })
        ])
      },
      ok: false
    });
    expect(
      parseFlashcardDeckMarkdown('# Deck\n\n## Front\n\n## No answer\n')
    ).toMatchObject({
      error: {
        issues: expect.arrayContaining([
          expect.objectContaining({ code: 'empty_back' })
        ])
      },
      ok: false
    });
  });
});

describe('FSRS flashcard scheduling', () => {
  const now = new Date('2026-07-29T10:00:00.000Z');

  it('previews all four ratings', () => {
    const state = createFlashcardState('deck-1', 'card-1', now);
    expect(
      previewFlashcardRatings(state, now).map((preview) => preview.rating)
    ).toEqual(['again', 'hard', 'good', 'easy']);
  });

  it('creates an immutable, reproducible review event', () => {
    const previous = createFlashcardState('deck-1', 'card-1', now);
    const transition = reviewFlashcard({
      deviceId: 'device-1',
      eventId: 'review-1',
      rating: 'good',
      reviewedAt: now,
      state: previous
    });
    expect(previous.state).toBe('new');
    expect(transition.state).not.toBe(previous);
    expect(transition.event).toMatchObject({
      cardId: 'card-1',
      previousState: previous,
      rating: 'good',
      scheduler: {
        algorithm: 'fsrs-6',
        implementationVersion: '5.4.1'
      }
    });
    expect(transition.state.due).not.toBe(previous.due);
  });

  it('queues due cards and excludes future cards', () => {
    const due = createFlashcardState('deck-1', 'due', now);
    const future = {
      ...createFlashcardState('deck-1', 'future', now),
      due: '2026-07-30T10:00:00.000Z'
    };
    expect(createStudyQueue([future, due], now)).toEqual(['due']);
  });
});
