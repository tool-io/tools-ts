import { describe, expect, it } from 'vitest';
import { lookupWordRelations } from './lookup.js';
import type { WordRelationsDataset } from './types.js';

const dataset: WordRelationsDataset = {
  datasetId: 'dictionary/test-relations',
  datasetVersion: '1',
  entries: [
    {
      antonyms: [{ text: 'sad' }],
      attribution: {
        license: 'CC-BY-SA-4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
        sourceTitle: 'happy',
        sourceUrl: 'https://en.wiktionary.org/wiki/happy'
      },
      headword: 'happy',
      id: 'en:happy:adjective',
      language: 'en',
      normalizedHeadword: 'happy',
      partOfSpeech: 'adjective',
      synonyms: [{ text: 'glad' }, { text: 'joyful' }]
    }
  ],
  format: 'toolio.word-relations',
  formatVersion: 1,
  language: 'en'
};

describe('word relation lookup', () => {
  it.each([
    ['synonym', ['glad', 'joyful']],
    ['antonym', ['sad']]
  ] as const)('returns %ss independently', (relation, expected) => {
    const result = lookupWordRelations([dataset], {
      language: 'en',
      query: ' HAPPY ',
      relation
    });

    expect(
      result.ok
        ? result.output.matches[0]?.words.map(({ text }) => text)
        : []
    ).toEqual(expected);
  });

  it('returns an empty match list rather than undefined', () => {
    const result = lookupWordRelations([dataset], {
      language: 'en',
      query: 'missing',
      relation: 'synonym'
    });

    expect(result).toMatchObject({
      ok: true,
      output: { matches: [] }
    });
  });

  it('rejects unsupported relation names', () => {
    expect(
      lookupWordRelations([dataset], {
        language: 'en',
        query: 'happy',
        relation: 'related'
      })
    ).toMatchObject({
      error: { code: 'invalid_input' },
      ok: false
    });
  });
});
