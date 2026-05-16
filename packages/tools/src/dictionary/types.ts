export const dictionaryChunkFormat = 'toolio.dictionary-chunk' as const;
export const dictionaryChunkFormatVersion = 1 as const;

export type DictionaryAttribution = {
  readonly license: string;
  readonly licenseUrl: string;
  readonly sourceTitle: string;
  readonly sourceUrl: string;
};

export type DictionaryTranslation = {
  readonly language: string;
  readonly qualifier?: string;
  readonly reading?: string;
  readonly romanization?: string;
  readonly text: string;
};

export type DictionaryEntry = {
  readonly attribution: DictionaryAttribution;
  readonly headword: string;
  readonly id: string;
  readonly language: string;
  readonly normalizedHeadword: string;
  readonly partOfSpeech: string;
  readonly translations: readonly DictionaryTranslation[];
};

export type DictionaryChunk = {
  readonly datasetId: string;
  readonly datasetVersion: string;
  readonly entries: readonly DictionaryEntry[];
  readonly format: typeof dictionaryChunkFormat;
  readonly formatVersion: typeof dictionaryChunkFormatVersion;
  readonly sourceLanguage: string;
  readonly targetLanguage: string;
};

export type DictionaryLookupInput = {
  readonly query: string;
  readonly sourceLanguage: string;
  readonly targetLanguage: string;
};

export type DictionaryLookupOutput = {
  readonly matches: readonly DictionaryEntry[];
  readonly normalizedQuery: string;
  readonly sourceLanguage: string;
  readonly targetLanguage: string;
};
