import { describe, expect, it } from 'vitest';
import { parseDictionaryChunk } from './chunk.js';
import {
  lookupDictionary,
  normalizeDictionaryHeadword
} from './lookup.js';
import type { DictionaryChunk } from './types.js';

const chunk: DictionaryChunk = {
  datasetId: 'dictionary/test',
  datasetVersion: '1',
  entries: [
    {
      attribution: {
        license: 'CC-BY-SA-4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
        sourceTitle: 'Cat',
        sourceUrl: 'https://en.wiktionary.org/wiki/cat'
      },
      headword: 'Cat',
      id: 'en:cat:noun',
      language: 'en',
      normalizedHeadword: 'cat',
      partOfSpeech: 'noun',
      translations: [{ language: 'de', text: 'Katze' }]
    }
  ],
  format: 'toolio.dictionary-chunk',
  formatVersion: 1,
  sourceLanguage: 'en',
  targetLanguage: 'de'
};

describe('dictionary lookup', () => {
  it('normalizes Unicode, whitespace, and locale casing', () => {
    expect(normalizeDictionaryHeadword('  ＣＡＴ ', 'en')).toBe(
      'cat'
    );
  });

  it('finds exact normalized entries for a language pair', () => {
    const result = lookupDictionary([chunk], {
      query: ' CAT ',
      sourceLanguage: 'en',
      targetLanguage: 'de'
    });

    expect(result).toMatchObject({
      ok: true,
      output: {
        matches: [{ id: 'en:cat:noun' }],
        normalizedQuery: 'cat'
      }
    });
  });

  it('returns an empty match list instead of undefined', () => {
    const result = lookupDictionary([chunk], {
      query: 'dog',
      sourceLanguage: 'en',
      targetLanguage: 'de'
    });

    expect(result).toMatchObject({
      ok: true,
      output: { matches: [] }
    });
  });

  it('rejects malformed input without throwing', () => {
    expect(lookupDictionary([chunk], undefined)).toMatchObject({
      error: { code: 'invalid_input' },
      ok: false
    });
  });

  it('validates dictionary chunks at a data boundary', () => {
    expect(parseDictionaryChunk(chunk)).toEqual(chunk);
    expect(
      parseDictionaryChunk({ ...chunk, formatVersion: 2 })
    ).toBeNull();
  });
});
