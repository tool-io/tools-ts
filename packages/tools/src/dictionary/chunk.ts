import {
  dictionaryChunkFormat,
  dictionaryChunkFormatVersion,
  type DictionaryAttribution,
  type DictionaryChunk,
  type DictionaryEntry,
  type DictionaryTranslation
} from './types.js';

const isRecord = (
  value: unknown
): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const readAttribution = (
  value: unknown
): DictionaryAttribution | null => {
  if (
    !isRecord(value) ||
    !isString(value.license) ||
    !isString(value.licenseUrl) ||
    !isString(value.sourceTitle) ||
    !isString(value.sourceUrl)
  ) {
    return null;
  }
  return {
    license: value.license,
    licenseUrl: value.licenseUrl,
    sourceTitle: value.sourceTitle,
    sourceUrl: value.sourceUrl
  };
};

const readTranslation = (
  value: unknown
): DictionaryTranslation | null => {
  if (
    !isRecord(value) ||
    !isString(value.language) ||
    !isString(value.text)
  ) {
    return null;
  }
  for (const field of [
    'qualifier',
    'reading',
    'romanization'
  ] as const) {
    if (value[field] !== undefined && !isString(value[field])) {
      return null;
    }
  }
  return {
    language: value.language,
    ...(isString(value.qualifier)
      ? { qualifier: value.qualifier }
      : {}),
    ...(isString(value.reading) ? { reading: value.reading } : {}),
    ...(isString(value.romanization)
      ? { romanization: value.romanization }
      : {}),
    text: value.text
  };
};

const readEntry = (value: unknown): DictionaryEntry | null => {
  if (
    !isRecord(value) ||
    !isString(value.headword) ||
    !isString(value.id) ||
    !isString(value.language) ||
    !isString(value.normalizedHeadword) ||
    !isString(value.partOfSpeech) ||
    !Array.isArray(value.translations)
  ) {
    return null;
  }
  const attribution = readAttribution(value.attribution);
  const translations = value.translations.map(readTranslation);
  if (
    !attribution ||
    translations.length === 0 ||
    translations.some((translation) => translation === null)
  ) {
    return null;
  }
  return {
    attribution,
    headword: value.headword,
    id: value.id,
    language: value.language,
    normalizedHeadword: value.normalizedHeadword,
    partOfSpeech: value.partOfSpeech,
    translations: translations as DictionaryTranslation[]
  };
};

export const parseDictionaryChunk = (
  value: unknown
): DictionaryChunk | null => {
  if (
    !isRecord(value) ||
    value.format !== dictionaryChunkFormat ||
    value.formatVersion !== dictionaryChunkFormatVersion ||
    !isString(value.datasetId) ||
    !isString(value.datasetVersion) ||
    !isString(value.sourceLanguage) ||
    !isString(value.targetLanguage) ||
    !Array.isArray(value.entries)
  ) {
    return null;
  }
  const entries = value.entries.map(readEntry);
  if (entries.some((entry) => entry === null)) return null;

  return {
    datasetId: value.datasetId,
    datasetVersion: value.datasetVersion,
    entries: entries as DictionaryEntry[],
    format: dictionaryChunkFormat,
    formatVersion: dictionaryChunkFormatVersion,
    sourceLanguage: value.sourceLanguage,
    targetLanguage: value.targetLanguage
  };
};
