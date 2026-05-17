export const wordRelationsFormat = 'toolio.word-relations' as const;
export const wordRelationsFormatVersion = 1 as const;

export type WordRelationKind = 'antonym' | 'synonym';

export type WordRelationAttribution = {
  readonly license: string;
  readonly licenseUrl: string;
  readonly sourceTitle: string;
  readonly sourceUrl: string;
};

export type RelatedWord = {
  readonly qualifier?: string;
  readonly text: string;
};

export type WordRelationsEntry = {
  readonly antonyms: readonly RelatedWord[];
  readonly attribution: WordRelationAttribution;
  readonly headword: string;
  readonly id: string;
  readonly language: string;
  readonly normalizedHeadword: string;
  readonly partOfSpeech: string;
  readonly synonyms: readonly RelatedWord[];
};

export type WordRelationsDataset = {
  readonly datasetId: string;
  readonly datasetVersion: string;
  readonly entries: readonly WordRelationsEntry[];
  readonly format: typeof wordRelationsFormat;
  readonly formatVersion: typeof wordRelationsFormatVersion;
  readonly language: string;
};

export type WordRelationsLookupInput = {
  readonly language: string;
  readonly query: string;
  readonly relation: WordRelationKind;
};

export type WordRelationsLookupOutput = {
  readonly matches: readonly {
    readonly attribution: WordRelationAttribution;
    readonly headword: string;
    readonly id: string;
    readonly partOfSpeech: string;
    readonly words: readonly RelatedWord[];
  }[];
  readonly normalizedQuery: string;
  readonly relation: WordRelationKind;
};
