import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult
} from '../core/result.js';
import type {
  DictionaryChunk,
  DictionaryEntry,
  DictionaryLookupInput,
  DictionaryLookupOutput
} from './types.js';

export const normalizeDictionaryHeadword = (
  value: string,
  language?: string
): string => {
  const normalized = value.normalize('NFKC').trim();
  try {
    return language
      ? normalized.toLocaleLowerCase(language)
      : normalized.toLocaleLowerCase();
  } catch {
    return normalized.toLocaleLowerCase();
  }
};

const isRecord = (
  value: unknown
): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const readLookupInput = (
  value: unknown
): ToolResult<DictionaryLookupInput> => {
  if (!isRecord(value)) {
    return invalidInput([
      {
        code: 'object_required',
        field: '',
        message: 'Input must be an object.'
      }
    ]);
  }

  const issues: ToolIssue[] = [];
  for (const field of [
    'query',
    'sourceLanguage',
    'targetLanguage'
  ] as const) {
    if (
      typeof value[field] !== 'string' ||
      value[field].trim().length === 0
    ) {
      issues.push({
        code: 'non_empty_string_required',
        field,
        message: `${field} must be a non-empty string.`
      });
    }
  }
  for (const field of Object.keys(value)) {
    if (
      field !== 'query' &&
      field !== 'sourceLanguage' &&
      field !== 'targetLanguage'
    ) {
      issues.push({
        code: 'unknown_field',
        field,
        message: `${field} is not a supported input field.`
      });
    }
  }
  if (issues.length > 0) return invalidInput(issues);

  return toolSuccess({
    query: value.query as string,
    sourceLanguage: value.sourceLanguage as string,
    targetLanguage: value.targetLanguage as string
  });
};

export const lookupDictionary = (
  chunks: readonly DictionaryChunk[],
  input: unknown
): ToolResult<DictionaryLookupOutput> => {
  const parsed = readLookupInput(input);
  if (!parsed.ok) return parsed;

  const { query, sourceLanguage, targetLanguage } = parsed.output;
  const normalizedQuery = normalizeDictionaryHeadword(
    query,
    sourceLanguage
  );
  const matches: DictionaryEntry[] = [];
  const seen = new Set<string>();

  for (const chunk of chunks) {
    if (
      chunk.sourceLanguage !== sourceLanguage ||
      chunk.targetLanguage !== targetLanguage
    ) {
      continue;
    }
    for (const entry of chunk.entries) {
      if (
        normalizeDictionaryHeadword(
          entry.normalizedHeadword,
          entry.language
        ) !== normalizedQuery ||
        seen.has(entry.id)
      ) {
        continue;
      }
      seen.add(entry.id);
      matches.push(entry);
    }
  }

  return toolSuccess({
    matches,
    normalizedQuery,
    sourceLanguage,
    targetLanguage
  });
};
