import catalogJson from "../catalog.generated.json" with { type: "json" };
import type { ToolCatalog, ToolCatalogEntry } from "./core/catalog.js";
import type { ToolExecutionKind } from "./core/definition.js";

export type ToolSearchOptions = {
  readonly collections?: readonly string[];
  readonly executionKinds?: readonly ToolExecutionKind[];
  readonly limit?: number;
  readonly offset?: number;
};

export type ToolSearchPage = {
  readonly entries: readonly ToolCatalogEntry[];
  readonly limit: number;
  readonly offset: number;
  readonly total: number;
};

const catalog = catalogJson as unknown as ToolCatalog;
if (
  catalog.schemaVersion !== 1 ||
  !/^[0-9a-f]{64}$/.test(catalog.catalogFingerprint) ||
  !Array.isArray(catalog.entries)
)
  throw new Error("The generated tool catalog is invalid or stale.");

const entries: ToolCatalogEntry[] = [...catalog.entries].sort((left, right) =>
  left.id.localeCompare(right.id, "en"),
);
const entryById = new Map(entries.map((entry) => [entry.id, entry]));

const normalize = (value: string): string =>
  value
    .normalize("NFKD")
    .replace(/\p{Mark}/gu, "")
    .toLocaleLowerCase("en-US")
    .trim();

const words = (value: string): readonly string[] =>
  normalize(value)
    .split(/[^a-z0-9]+/u)
    .filter(Boolean);

const searchableEntries = entries.map((entry) => {
  const aliases = entry.aliases.map(normalize);
  const title = normalize(entry.title);
  const id = normalize(entry.id);
  const values = [
    id,
    title,
    normalize(entry.description),
    ...aliases,
    ...entry.collections.map(normalize),
    ...entry.fields.map(normalize),
    ...entry.keywords.map(normalize),
    ...entry.ports.inputs.flatMap((port) => [
      normalize(port.id),
      normalize(port.label),
    ]),
    ...entry.ports.outputs.flatMap((port) => [
      normalize(port.id),
      normalize(port.label),
    ]),
  ];
  return {
    aliases,
    entry,
    id,
    searchable: values.join(" "),
    title,
    words: new Set(values.flatMap(words)),
  };
});

const normalizedLimit = (limit: number | undefined): number => {
  if (limit === undefined) return 20;
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100)
    throw new RangeError("Tool search limit must be an integer from 1 to 100.");
  return limit;
};

const normalizedOffset = (offset: number | undefined): number => {
  if (offset === undefined) return 0;
  if (!Number.isSafeInteger(offset) || offset < 0)
    throw new RangeError("Tool search offset must be a nonnegative integer.");
  return offset;
};

const matchesFilters = (
  entry: ToolCatalogEntry,
  options: ToolSearchOptions,
): boolean =>
  (!options.collections?.length ||
    options.collections.some((collection) =>
      entry.collections.includes(collection),
    )) &&
  (!options.executionKinds?.length ||
    options.executionKinds.includes(entry.execution.kind));

const relevance = (
  candidate: (typeof searchableEntries)[number],
  query: string,
  tokens: readonly string[],
): number => {
  if (!query) return 0;
  if (!tokens.every((token) => candidate.searchable.includes(token))) return -1;

  let score = 0;
  if (candidate.id === query) score += 10_000;
  else if (candidate.title === query) score += 9_000;
  else if (candidate.aliases.includes(query)) score += 8_000;
  else if (candidate.id.startsWith(query)) score += 7_000;
  else if (candidate.title.startsWith(query)) score += 6_000;
  else if (candidate.aliases.some((alias) => alias.startsWith(query)))
    score += 5_000;
  else if (candidate.id.includes(query)) score += 4_000;
  else if (candidate.title.includes(query)) score += 3_000;
  else if (candidate.aliases.some((alias) => alias.includes(query)))
    score += 2_000;

  score += tokens.filter((token) => candidate.words.has(token)).length * 100;
  return score;
};

export const toolCatalogFingerprint = catalog.catalogFingerprint;
export const toolCatalogSize = entries.length;

export const getToolMetadata = (id: string): ToolCatalogEntry | undefined =>
  entryById.get(id);

export const searchTools = (
  query: string,
  options: ToolSearchOptions = {},
): ToolSearchPage => {
  const normalizedQuery = normalize(query);
  const tokens = words(normalizedQuery);
  const matches = searchableEntries
    .filter(({ entry }) => matchesFilters(entry, options))
    .map((candidate) => ({
      candidate,
      score: relevance(candidate, normalizedQuery, tokens),
    }))
    .filter(({ score }) => score >= 0)
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.candidate.id.localeCompare(right.candidate.id, "en"),
    );
  const limit = normalizedLimit(options.limit);
  const offset = normalizedOffset(options.offset);
  return {
    entries: matches
      .slice(offset, offset + limit)
      .map(({ candidate }) => candidate.entry),
    limit,
    offset,
    total: matches.length,
  };
};

export const listTools = (options: ToolSearchOptions = {}): ToolSearchPage =>
  searchTools("", options);
