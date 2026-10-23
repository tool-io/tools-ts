import catalogJson from "#tool-catalog" with { type: "json" };
import type { ToolCatalog, ToolCatalogEntry } from "./core/catalog.js";
import type { ToolExecutionKind } from "./core/definition.js";
import { boundedRank } from "./core/discovery-ranking.js";

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

let sortedEntries: readonly ToolCatalogEntry[] | undefined;
let entryById: Map<string, ToolCatalogEntry> | undefined;
const entries = (): readonly ToolCatalogEntry[] =>
  (sortedEntries ??= [...catalog.entries].sort((left, right) =>
    left.id.localeCompare(right.id, "en"),
  ));

const normalize = (value: string): string => {
  // ASCII cannot contain compatibility characters or combining marks. Avoid
  // Unicode decomposition for the common catalog case, preserving the same
  // normalization for every other script.
  const text = /[^\x00-\x7f]/u.test(value)
    ? value.normalize("NFKD").replace(/\p{Mark}/gu, "")
    : value;
  return text.toLowerCase().trim();
};

const words = (value: string): readonly string[] =>
  normalize(value)
    .split(/[^a-z0-9]+/u)
    .filter(Boolean);

const searchableEntry = (entry: ToolCatalogEntry) => {
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
    // These values are already normalized; do not normalize every token twice.
    words: ` ${[...new Set(values.flatMap((value) => value.split(/[^a-z0-9]+/u).filter(Boolean)))].join(" ")} `,
  };
};
let searchIndex: readonly ReturnType<typeof searchableEntry>[] | undefined;

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
  candidate: ReturnType<typeof searchableEntry>,
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

  score +=
    tokens.filter((token) => candidate.words.includes(` ${token} `)).length *
    100;
  return score;
};

export const toolCatalogFingerprint = catalog.catalogFingerprint;
export const toolCatalogSize = catalog.entries.length;

export const getToolMetadata = (id: string): ToolCatalogEntry | undefined => {
  entryById ??= new Map(catalog.entries.map((entry) => [entry.id, entry]));
  return entryById.get(id);
};

const listing = (
  options: ToolSearchOptions,
  limit: number,
  offset: number,
): ToolSearchPage => {
  const page: ToolCatalogEntry[] = [];
  let total = 0;
  for (const entry of entries()) {
    if (!matchesFilters(entry, options)) continue;
    if (total >= offset && page.length < limit) page.push(entry);
    total++;
  }
  return { entries: page, limit, offset, total };
};

export const searchTools = (
  query: string,
  options: ToolSearchOptions = {},
): ToolSearchPage => {
  // Validate before normalization, filtering, or constructing the optional index.
  const limit = normalizedLimit(options.limit);
  const offset = normalizedOffset(options.offset);
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return listing(options, limit, offset);
  const tokens = words(normalizedQuery);
  searchIndex ??= catalog.entries.map(searchableEntry);
  const capacity = Math.min(toolCatalogSize, offset + limit);
  const matches = boundedRank(
    searchIndex,
    capacity,
    (candidate) =>
      matchesFilters(candidate.entry, options)
        ? relevance(candidate, normalizedQuery, tokens)
        : -1,
    (candidate) => candidate.id,
  );
  return {
    entries: matches.entries
      .slice(offset, offset + limit)
      .map(({ candidate }) => candidate.entry),
    limit,
    offset,
    total: matches.total,
  };
};

export const listTools = (options: ToolSearchOptions = {}): ToolSearchPage =>
  listing(
    options,
    normalizedLimit(options.limit),
    normalizedOffset(options.offset),
  );
