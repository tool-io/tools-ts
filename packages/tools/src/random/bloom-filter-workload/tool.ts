import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import { calculateBloomFilter } from "../../data-structure/bloom-filter/tool.js";
import {
  sketchUniverseSchema,
  sketchUniqueUniverse,
  sketchMembershipQueries,
} from "../sketch-workload-construction.js";

export type BloomFilterWorkloadInput = {
  readonly universe: readonly string[];
  readonly insertCount: number;
  readonly queryCount: number;
  readonly presentQueryProbability: number;
  readonly bitCount: number;
  readonly hashCount: number;
  readonly seed?: number;
};
export type BloomFilterWorkloadOutput = {
  readonly inserted: readonly string[];
  readonly queries: readonly {
    readonly query: string;
    readonly exactlyPresent: boolean;
    readonly possiblyPresent: boolean;
    readonly falsePositive: boolean;
  }[];
  readonly filter: {
    readonly bitCount: number;
    readonly hashCount: number;
    readonly setBits: number;
    readonly estimatedFalsePositiveProbability: number;
  };
  readonly summary: {
    readonly truePositiveCount: number;
    readonly negativeQueryCount: number;
    readonly falsePositiveCount: number;
    readonly observedFalsePositiveFraction: number | null;
  };
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    universe: sketchUniverseSchema,
    insertCount: { type: "integer", minimum: 0, maximum: 512 },
    queryCount: { type: "integer", minimum: 1, maximum: 128 },
    presentQueryProbability: { type: "number", minimum: 0, maximum: 1 },
    bitCount: { type: "integer", minimum: 8, maximum: 65536 },
    hashCount: { type: "integer", minimum: 1, maximum: 16 },
    seed: generatorSeedSchema,
  },
  required: [
    "universe",
    "insertCount",
    "queryCount",
    "presentQueryProbability",
    "bitCount",
    "hashCount",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inserted: { ...sketchUniverseSchema, minItems: 0 },
    queries: {
      type: "array",
      minItems: 1,
      maxItems: 128,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          query: { type: "string", maxLength: 64 },
          exactlyPresent: { type: "boolean" },
          possiblyPresent: { type: "boolean" },
          falsePositive: { type: "boolean" },
        },
        required: [
          "query",
          "exactlyPresent",
          "possiblyPresent",
          "falsePositive",
        ],
      },
    },
    filter: {
      type: "object",
      additionalProperties: false,
      properties: {
        bitCount: { type: "integer", minimum: 8, maximum: 65536 },
        hashCount: { type: "integer", minimum: 1, maximum: 16 },
        setBits: { type: "integer", minimum: 0, maximum: 65536 },
        estimatedFalsePositiveProbability: {
          type: "number",
          minimum: 0,
          maximum: 1,
        },
      },
      required: [
        "bitCount",
        "hashCount",
        "setBits",
        "estimatedFalsePositiveProbability",
      ],
    },
    summary: {
      type: "object",
      additionalProperties: false,
      properties: {
        truePositiveCount: { type: "integer", minimum: 0, maximum: 128 },
        negativeQueryCount: { type: "integer", minimum: 0, maximum: 128 },
        falsePositiveCount: { type: "integer", minimum: 0, maximum: 128 },
        observedFalsePositiveFraction: {
          anyOf: [{ type: "number", minimum: 0, maximum: 1 }, { type: "null" }],
        },
      },
      required: [
        "truePositiveCount",
        "negativeQueryCount",
        "falsePositiveCount",
        "observedFalsePositiveFraction",
      ],
    },
    randomness: generatorReplaySchema,
  },
  required: ["inserted", "queries", "filter", "summary", "randomness"],
} as const;

const isInput = (input: unknown): input is BloomFilterWorkloadInput =>
  matchesModelInput(input, inputSchema);
export const calculateBloomFilterWorkload = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<BloomFilterWorkloadOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const universe = sketchUniqueUniverse(input.universe);
    if (input.insertCount > universe.length)
      simpleError(
        "insertCount",
        "The insertion set cannot exceed the deduplicated universe.",
        "insufficient_universe",
      );
    const characterCost = Math.max(1, ...universe.map((value) => value.length));
    if (
      input.queryCount *
        (input.bitCount +
          (input.insertCount + 1) * input.hashCount * characterCost) >
      10000000
    )
      simpleError(
        "queryCount",
        "Stateless delegated Bloom queries are limited to ten million bit/hash-character work units.",
        "resource_limit",
      );
    const random = createGeneratorRandom(input.seed, context),
      order = random.shuffle(universe),
      inserted = order.slice(0, input.insertCount),
      absent = order.slice(input.insertCount);
    const selections = sketchMembershipQueries(
        inserted,
        absent,
        input.queryCount,
        input.presentQueryProbability,
        random,
      ),
      present = new Set(inserted);
    const results = selections.map((query) =>
      calculateBloomFilter(inserted, query, input.bitCount, input.hashCount),
    );
    const queries = results.map((result) => {
      const exactlyPresent = present.has(result.query);
      if (exactlyPresent && !result.possiblyPresent)
        throw new Error(
          "A delegated insertion-only Bloom filter produced a false negative.",
        );
      return {
        query: result.query,
        exactlyPresent,
        possiblyPresent: result.possiblyPresent,
        falsePositive: !exactlyPresent && result.possiblyPresent,
      };
    });
    const truePositiveCount = queries.filter(
        (query) => query.exactlyPresent,
      ).length,
      negativeQueryCount = queries.length - truePositiveCount,
      falsePositiveCount = queries.filter(
        (query) => query.falsePositive,
      ).length;
    return toolSuccess({
      inserted,
      queries,
      filter: {
        bitCount: input.bitCount,
        hashCount: input.hashCount,
        setBits: results[0].setBits,
        estimatedFalsePositiveProbability: results[0].falsePositiveProbability,
      },
      summary: {
        truePositiveCount,
        negativeQueryCount,
        falsePositiveCount,
        observedFalsePositiveFraction:
          negativeQueryCount === 0
            ? null
            : falsePositiveCount / negativeQueryCount,
      },
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const bloomFilterWorkloadExample = {
  input: {
    universe: ["a", "b", "c", "d"],
    insertCount: 2,
    queryCount: 4,
    presentQueryProbability: 0.5,
    bitCount: 8,
    hashCount: 2,
    seed: 42,
  },
  output: {
    inserted: ["a", "d"],
    queries: [
      {
        query: "b",
        exactlyPresent: false,
        possiblyPresent: true,
        falsePositive: true,
      },
      {
        query: "b",
        exactlyPresent: false,
        possiblyPresent: true,
        falsePositive: true,
      },
      {
        query: "c",
        exactlyPresent: false,
        possiblyPresent: false,
        falsePositive: false,
      },
      {
        query: "a",
        exactlyPresent: true,
        possiblyPresent: true,
        falsePositive: false,
      },
    ],
    filter: {
      bitCount: 8,
      hashCount: 2,
      setBits: 4,
      estimatedFalsePositiveProbability: 0.15481812,
    },
    summary: {
      truePositiveCount: 1,
      negativeQueryCount: 3,
      falsePositiveCount: 2,
      observedFalsePositiveFraction: 0.6666666666666666,
    },
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<BloomFilterWorkloadInput, BloomFilterWorkloadOutput>;
export const bloomFilterWorkloadTool = createModelDefinition<
  BloomFilterWorkloadInput,
  BloomFilterWorkloadOutput
>({
  id: "random/bloom-filter-workload",
  title: "Random Bloom Filter Workload Generator",
  description:
    "Deduplicate a supplied string universe, sample a distinct insertion set and controlled present/absent query pools, and delegate deterministic Bloom responses; report exact labels and observed false positives separately from the core's 8-significant-digit ideal-hash probability approximation, not a guaranteed error rate.",
  inputSchema,
  outputSchema,
  execute: calculateBloomFilterWorkload,
});
export const runBloomFilterWorkload = bloomFilterWorkloadTool.execute;
export default bloomFilterWorkloadTool;
