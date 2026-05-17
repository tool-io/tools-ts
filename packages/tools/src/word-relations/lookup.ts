import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult
} from '../core/result.js';
import { normalizeDictionaryHeadword } from '../dictionary/lookup.js';
import type {
  WordRelationKind,
  WordRelationsDataset,
  WordRelationsLookupInput,
  WordRelationsLookupOutput
} from './types.js';

const isRecord = (
  value: unknown
): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const relationKinds = new Set<WordRelationKind>([
  'antonym',
  'synonym'
]);

const readInput = (
  value: unknown
): ToolResult<WordRelationsLookupInput> => {
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
  for (const field of ['language', 'query'] as const) {
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
  if (
    typeof value.relation !== 'string' ||
    !relationKinds.has(value.relation as WordRelationKind)
  ) {
    issues.push({
      code: 'unsupported_relation',
      field: 'relation',
      message: 'relation must be synonym or antonym.'
    });
  }
  for (const field of Object.keys(value)) {
    if (
      field !== 'language' &&
      field !== 'query' &&
      field !== 'relation'
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
    language: value.language as string,
    query: value.query as string,
    relation: value.relation as WordRelationKind
  });
};

export const lookupWordRelations = (
  datasets: readonly WordRelationsDataset[],
  input: unknown
): ToolResult<WordRelationsLookupOutput> => {
  const parsed = readInput(input);
  if (!parsed.ok) return parsed;

  const { language, query, relation } = parsed.output;
  const normalizedQuery = normalizeDictionaryHeadword(
    query,
    language
  );
  const matches = datasets
    .filter((dataset) => dataset.language === language)
    .flatMap((dataset) => dataset.entries)
    .filter(
      (entry) =>
        normalizeDictionaryHeadword(
          entry.normalizedHeadword,
          entry.language
        ) === normalizedQuery
    )
    .map((entry) => ({
      attribution: entry.attribution,
      headword: entry.headword,
      id: entry.id,
      partOfSpeech: entry.partOfSpeech,
      words:
        relation === 'synonym' ? entry.synonyms : entry.antonyms
    }));

  return toolSuccess({
    matches,
    normalizedQuery,
    relation
  });
};
