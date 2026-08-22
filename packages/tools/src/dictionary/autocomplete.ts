import { normalizeDictionaryHeadword } from "./lookup.js";

export const dictionaryAutocompleteFormat =
  "toolio.dictionary-autocomplete-index" as const;
export const dictionaryAutocompleteFormatVersion = 1 as const;

export type DictionaryAutocompleteCapability =
  "antonym" | "synonym" | "translation";

export type DictionaryAutocompleteTerm = readonly [
  normalizedTerm: string,
  term: string,
];

export type DictionaryAutocompleteIndex = {
  readonly capability: DictionaryAutocompleteCapability;
  readonly datasetId: string;
  readonly datasetVersion: string;
  readonly format: typeof dictionaryAutocompleteFormat;
  readonly formatVersion: typeof dictionaryAutocompleteFormatVersion;
  readonly sourceLanguage: string;
  readonly targetLanguage?: string;
  readonly terms: readonly DictionaryAutocompleteTerm[];
};

export type CreateDictionaryAutocompleteIndexInput = Omit<
  DictionaryAutocompleteIndex,
  "format" | "formatVersion" | "terms"
> & {
  readonly terms: Iterable<
    | string
    | {
        readonly normalizedTerm?: string;
        readonly term: string;
      }
  >;
};

const capabilities = new Set<DictionaryAutocompleteCapability>([
  "antonym",
  "synonym",
  "translation",
]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const compareTerms = (
  left: DictionaryAutocompleteTerm,
  right: DictionaryAutocompleteTerm,
): number => {
  if (left[0] < right[0]) return -1;
  if (left[0] > right[0]) return 1;
  if (left[1] < right[1]) return -1;
  if (left[1] > right[1]) return 1;
  return 0;
};

export const createDictionaryAutocompleteIndex = (
  input: CreateDictionaryAutocompleteIndexInput,
): DictionaryAutocompleteIndex => {
  const uniqueTerms = new Map<string, DictionaryAutocompleteTerm>();

  for (const candidate of input.terms) {
    const term = typeof candidate === "string" ? candidate : candidate.term;
    const normalizedTerm = normalizeDictionaryHeadword(
      typeof candidate === "string"
        ? candidate
        : (candidate.normalizedTerm ?? candidate.term),
      input.sourceLanguage,
    );

    if (normalizedTerm.length === 0 || term.trim().length === 0) {
      continue;
    }

    const current = uniqueTerms.get(normalizedTerm);
    const next = [normalizedTerm, term.trim()] as const;
    if (!current || compareTerms(next, current) < 0) {
      uniqueTerms.set(normalizedTerm, next);
    }
  }

  return {
    capability: input.capability,
    datasetId: input.datasetId,
    datasetVersion: input.datasetVersion,
    format: dictionaryAutocompleteFormat,
    formatVersion: dictionaryAutocompleteFormatVersion,
    sourceLanguage: input.sourceLanguage,
    ...(input.targetLanguage ? { targetLanguage: input.targetLanguage } : {}),
    terms: [...uniqueTerms.values()].sort(compareTerms),
  };
};

export const parseDictionaryAutocompleteIndex = (
  value: unknown,
): DictionaryAutocompleteIndex | null => {
  if (
    !isRecord(value) ||
    value.format !== dictionaryAutocompleteFormat ||
    value.formatVersion !== dictionaryAutocompleteFormatVersion ||
    typeof value.datasetId !== "string" ||
    value.datasetId.length === 0 ||
    typeof value.datasetVersion !== "string" ||
    value.datasetVersion.length === 0 ||
    typeof value.capability !== "string" ||
    !capabilities.has(value.capability as DictionaryAutocompleteCapability) ||
    typeof value.sourceLanguage !== "string" ||
    value.sourceLanguage.length === 0 ||
    !Array.isArray(value.terms)
  ) {
    return null;
  }

  const capability = value.capability as DictionaryAutocompleteCapability;
  if (
    (capability === "translation" &&
      (typeof value.targetLanguage !== "string" ||
        value.targetLanguage.length === 0)) ||
    (capability !== "translation" && value.targetLanguage !== undefined)
  ) {
    return null;
  }

  let previous = "";
  for (const term of value.terms) {
    if (
      !Array.isArray(term) ||
      term.length !== 2 ||
      typeof term[0] !== "string" ||
      term[0].length === 0 ||
      typeof term[1] !== "string" ||
      term[1].length === 0 ||
      term[0] < previous
    ) {
      return null;
    }
    previous = term[0];
  }

  return value as DictionaryAutocompleteIndex;
};

const lowerBound = (
  terms: readonly DictionaryAutocompleteTerm[],
  query: string,
): number => {
  let low = 0;
  let high = terms.length;

  while (low < high) {
    const middle = low + Math.floor((high - low) / 2);
    if (terms[middle]![0] < query) low = middle + 1;
    else high = middle;
  }

  return low;
};

export const suggestDictionaryTerms = (
  index: DictionaryAutocompleteIndex,
  query: string,
  limit = 8,
): readonly string[] => {
  const normalizedQuery = normalizeDictionaryHeadword(
    query,
    index.sourceLanguage,
  );
  if (normalizedQuery.length === 0 || limit <= 0) return [];

  const suggestions: string[] = [];
  const maximum = Math.min(Math.floor(limit), 50);

  for (
    let position = lowerBound(index.terms, normalizedQuery);
    position < index.terms.length && suggestions.length < maximum;
    position += 1
  ) {
    const candidate = index.terms[position]!;
    if (!candidate[0].startsWith(normalizedQuery)) break;
    suggestions.push(candidate[1]);
  }

  return suggestions;
};
