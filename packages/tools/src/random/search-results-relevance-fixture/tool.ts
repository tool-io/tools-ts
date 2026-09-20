import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import { invalidInput, type ToolResult } from "../../core/result.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorRandom,
  type GeneratorReplay,
} from "../generator-random.js";
import { runContainsChecker } from "../../text/contains-checker/tool.js";
import { calculateWordFrequency } from "../../text/word-frequency/tool.js";
import { simpleError } from "../../core/simple.js";
import {
  mocksArray,
  mocksObject,
  mocksLabel,
  mocksText,
  mocksInteger,
  mocksBoolean,
  mocksNullable,
  mocksDistinct,
  mocksPick,
  mocksCore,
  mocksFinish,
} from "../m250-parser-mocks-support.js";
export type SearchResultsRelevanceFixtureInput = {
  readonly documents: readonly { readonly id: string; readonly text: string }[];
  readonly queries: readonly string[];
  readonly count: number;
  readonly duplicateCount: number;
  readonly rule: {
    readonly mode: "substring" | "token-occurrences";
    readonly caseSensitive: boolean;
    readonly minimumScore: number;
  };
  readonly seed?: number;
};
export type RelevanceFixtureResult = {
  readonly id: string;
  readonly documentId: string;
  readonly text: string;
  readonly containsQuery: boolean;
  readonly score: number;
  readonly relevant: boolean;
  readonly duplicateOf: string | null;
};
export type SearchResultsRelevanceFixtureOutput = {
  readonly query: string;
  readonly results: readonly RelevanceFixtureResult[];
  readonly tieGroups: readonly {
    readonly score: number;
    readonly resultIds: readonly string[];
  }[];
  readonly randomness: GeneratorReplay;
};
const resultSchema = mocksObject({
  id: mocksLabel,
  documentId: mocksLabel,
  text: mocksText,
  containsQuery: mocksBoolean,
  score: { type: "integer", minimum: 0 },
  relevant: mocksBoolean,
  duplicateOf: mocksNullable(mocksLabel),
});
export const inputSchema = mocksObject(
  {
    documents: mocksArray(
      mocksObject({ id: mocksLabel, text: mocksText }),
      128,
      1,
    ),
    queries: mocksArray({ ...mocksText, minLength: 1 }, 32, 1),
    count: { type: "integer", minimum: 1, maximum: 128 },
    duplicateCount: { type: "integer", minimum: 0, maximum: 127 },
    rule: mocksObject({
      mode: { type: "string", enum: ["substring", "token-occurrences"] },
      caseSensitive: mocksBoolean,
      minimumScore: { type: "integer", minimum: 0 },
    }),
    seed: generatorSeedSchema,
  },
  ["documents", "queries", "count", "duplicateCount", "rule"],
);
export const outputSchema = mocksObject({
  query: mocksText,
  results: mocksArray(resultSchema, 128, 1),
  tieGroups: mocksArray(
    mocksObject({
      score: mocksInteger,
      resultIds: mocksArray(mocksLabel, 128, 2),
    }),
    64,
  ),
  randomness: generatorReplaySchema,
});
const generate = (
  input: SearchResultsRelevanceFixtureInput,
  random: GeneratorRandom,
): Omit<SearchResultsRelevanceFixtureOutput, "randomness"> => {
  mocksDistinct(
    input.documents.map((document) => document.id),
    "documents",
  );
  if (input.count > input.documents.length)
    simpleError(
      "count",
      "Base results sample distinct supplied documents without replacement.",
      "infeasible_document_count",
    );
  if (input.count + input.duplicateCount > 128)
    simpleError(
      "duplicateCount",
      "At most 128 total results can be materialized.",
      "resource_limit_exceeded",
    );
  if (
    input.rule.mode === "token-occurrences" &&
    input.queries.some((query) => !/[\p{L}\p{N}']/u.test(query))
  )
    simpleError(
      "queries",
      "Token-occurrence rules require queries containing at least one word.",
      "empty_query_tokens",
    );
  const query = mocksPick(input.queries, random),
    sourceQuery = input.rule.caseSensitive ? query : query.toLowerCase();
  const queryWords =
    input.rule.mode === "token-occurrences"
      ? Object.keys(
          calculateWordFrequency({
            text: query,
            caseSensitive: input.rule.caseSensitive,
          }).frequencies,
        )
      : [];
  const bank = [...input.documents],
    results: RelevanceFixtureResult[] = [];
  for (let i = 0; i < input.count; i += 1) {
    const document = mocksPick(bank, random);
    bank.splice(bank.indexOf(document), 1);
    const text = input.rule.caseSensitive
      ? document.text
      : document.text.toLowerCase();
    const containsQuery = mocksCore(
      runContainsChecker({ text, value: sourceQuery }),
      "documents",
    ).contains;
    let score = containsQuery ? 1 : 0;
    if (input.rule.mode === "token-occurrences") {
      const frequencies = /[\p{L}\p{N}']/u.test(document.text)
        ? calculateWordFrequency({
            text: document.text,
            caseSensitive: input.rule.caseSensitive,
          }).frequencies
        : {};
      score = queryWords.reduce((sum, word) => {
        const value = Object.hasOwn(frequencies, word) ? frequencies[word] : 0;
        if (typeof value !== "number")
          throw new Error("Word frequency core returned a nonnumeric count.");
        return sum + value;
      }, 0);
    }
    results.push({
      id: "result-" + (i + 1),
      documentId: document.id,
      text: document.text,
      containsQuery,
      score,
      relevant: score >= input.rule.minimumScore,
      duplicateOf: null,
    });
  }
  const originals = [...results];
  for (let i = 0; i < input.duplicateCount; i += 1) {
    const original = mocksPick(originals, random);
    results.push({
      ...original,
      id: "result-" + (input.count + i + 1),
      duplicateOf: original.id,
    });
  }
  results.sort((a, b) => b.score - a.score);
  const groups = new Map<number, string[]>();
  for (const result of results) {
    const group = groups.get(result.score) ?? [];
    group.push(result.id);
    groups.set(result.score, group);
  }
  return {
    query,
    results,
    tieGroups: [...groups]
      .filter(([, ids]) => ids.length > 1)
      .map(([score, resultIds]) => ({ score, resultIds })),
  };
};
export const searchResultsRelevanceFixtureExample = {
  input: {
    documents: [
      { id: "a", text: "red blue" },
      { id: "b", text: "blue blue" },
      { id: "c", text: "green" },
    ],
    queries: ["red", "blue"],
    count: 2,
    duplicateCount: 1,
    rule: { mode: "token-occurrences", caseSensitive: false, minimumScore: 1 },
    seed: 42,
  },
  output: {
    query: "blue",
    results: [
      {
        id: "result-1",
        documentId: "b",
        text: "blue blue",
        containsQuery: true,
        score: 2,
        relevant: true,
        duplicateOf: null,
      },
      {
        id: "result-2",
        documentId: "c",
        text: "green",
        containsQuery: false,
        score: 0,
        relevant: false,
        duplicateOf: null,
      },
      {
        id: "result-3",
        documentId: "c",
        text: "green",
        containsQuery: false,
        score: 0,
        relevant: false,
        duplicateOf: "result-2",
      },
    ],
    tieGroups: [{ score: 0, resultIds: ["result-2", "result-3"] }],
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  SearchResultsRelevanceFixtureInput,
  SearchResultsRelevanceFixtureOutput
>;

const isInput = (input: unknown): input is SearchResultsRelevanceFixtureInput =>
  matchesModelInput(input, inputSchema);
export const calculateSearchResultsRelevanceFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<SearchResultsRelevanceFixtureOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const random = createGeneratorRandom(input.seed, context);
    return mocksFinish(
      {
        ...generate(input, random),
        randomness: generatorReplay(input.seed, context),
      },
      outputSchema,
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const searchResultsRelevanceFixtureTool = createModelDefinition<
  SearchResultsRelevanceFixtureInput,
  SearchResultsRelevanceFixtureOutput
>({
  id: "random/search-results-relevance-fixture",
  title: "Random Search Results Relevance Fixture Generator",
  description:
    "Sample supplied documents and queries into rule-labeled search fixtures with explicit duplicate controls, stable score ties, and no semantic relevance claim.",
  inputSchema,
  outputSchema,
  execute: calculateSearchResultsRelevanceFixture,
});
export const runSearchResultsRelevanceFixture =
  searchResultsRelevanceFixtureTool.execute;
export default searchResultsRelevanceFixtureTool;
