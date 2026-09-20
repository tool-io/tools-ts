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
import { calculateCountingBloomFilter } from "../../data-structure/counting-bloom-filter/tool.js";
import { runFrequency } from "../../list/frequency/tool.js";
import {
  sketchUniverseSchema,
  sketchUniqueUniverse,
} from "../sketch-workload-construction.js";

export type CountingBloomFilterWorkloadInput = {
  readonly universe: readonly string[];
  readonly insertCount: number;
  readonly removalCount: number;
  readonly queryCount: number;
  readonly counterCount: number;
  readonly hashCount: number;
  readonly seed?: number;
};
export type CountingBloomFilterWorkloadOutput = {
  readonly inserted: readonly string[];
  readonly removed: readonly string[];
  readonly remainingMultiplicities: readonly {
    readonly value: string;
    readonly count: number;
  }[];
  readonly queries: readonly {
    readonly query: string;
    readonly exactMultiplicity: number;
    readonly possiblyPresent: boolean;
    readonly estimatedMultiplicity: number;
  }[];
  readonly filter: {
    readonly counterCount: number;
    readonly hashCount: number;
    readonly nonzeroCounters: number;
    readonly successfulRemovals: number;
  };
  readonly summary: {
    readonly positiveQueryCount: number;
    readonly negativeQueryCount: number;
    readonly falsePositiveCount: number;
  };
  readonly randomness: GeneratorReplay;
};
const valuesSchema = {
  type: "array",
  maxItems: 512,
  items: { type: "string", maxLength: 64 },
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    universe: sketchUniverseSchema,
    insertCount: { type: "integer", minimum: 0, maximum: 512 },
    removalCount: { type: "integer", minimum: 0, maximum: 512 },
    queryCount: { type: "integer", minimum: 1, maximum: 128 },
    counterCount: { type: "integer", minimum: 8, maximum: 65536 },
    hashCount: { type: "integer", minimum: 1, maximum: 16 },
    seed: generatorSeedSchema,
  },
  required: [
    "universe",
    "insertCount",
    "removalCount",
    "queryCount",
    "counterCount",
    "hashCount",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inserted: valuesSchema,
    removed: valuesSchema,
    remainingMultiplicities: {
      type: "array",
      maxItems: 512,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          value: { type: "string", maxLength: 64 },
          count: { type: "integer", minimum: 1, maximum: 512 },
        },
        required: ["value", "count"],
      },
    },
    queries: {
      type: "array",
      minItems: 1,
      maxItems: 128,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          query: { type: "string", maxLength: 64 },
          exactMultiplicity: { type: "integer", minimum: 0, maximum: 512 },
          possiblyPresent: { type: "boolean" },
          estimatedMultiplicity: { type: "integer", minimum: 0, maximum: 8192 },
        },
        required: [
          "query",
          "exactMultiplicity",
          "possiblyPresent",
          "estimatedMultiplicity",
        ],
      },
    },
    filter: {
      type: "object",
      additionalProperties: false,
      properties: {
        counterCount: { type: "integer", minimum: 8, maximum: 65536 },
        hashCount: { type: "integer", minimum: 1, maximum: 16 },
        nonzeroCounters: { type: "integer", minimum: 0, maximum: 65536 },
        successfulRemovals: { type: "integer", minimum: 0, maximum: 512 },
      },
      required: [
        "counterCount",
        "hashCount",
        "nonzeroCounters",
        "successfulRemovals",
      ],
    },
    summary: {
      type: "object",
      additionalProperties: false,
      properties: {
        positiveQueryCount: { type: "integer", minimum: 0, maximum: 128 },
        negativeQueryCount: { type: "integer", minimum: 0, maximum: 128 },
        falsePositiveCount: { type: "integer", minimum: 0, maximum: 128 },
      },
      required: [
        "positiveQueryCount",
        "negativeQueryCount",
        "falsePositiveCount",
      ],
    },
    randomness: generatorReplaySchema,
  },
  required: [
    "inserted",
    "removed",
    "remainingMultiplicities",
    "queries",
    "filter",
    "summary",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is CountingBloomFilterWorkloadInput =>
  matchesModelInput(input, inputSchema);
export const calculateCountingBloomFilterWorkload = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CountingBloomFilterWorkloadOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.removalCount > input.insertCount)
      simpleError(
        "removalCount",
        "Eligible-occurrence removals cannot exceed insertion count.",
        "infeasible_removal_count",
      );
    const universe = sketchUniqueUniverse(input.universe),
      characterCost = Math.max(1, ...universe.map((value) => value.length));
    if (
      input.queryCount *
        (input.counterCount +
          (input.insertCount + input.removalCount + 1) *
            input.hashCount *
            characterCost) >
      10000000
    )
      simpleError(
        "queryCount",
        "Stateless delegated queries are limited to ten million counter/hash-character work units.",
        "resource_limit",
      );
    const random = createGeneratorRandom(input.seed, context),
      inserted = Array.from({ length: input.insertCount }, () =>
        random.pick(universe),
      ),
      remaining = [...inserted],
      removed: string[] = [];
    for (let i = 0; i < input.removalCount; i += 1)
      removed.push(
        remaining.splice(random.integer(0, remaining.length - 1), 1)[0],
      );
    const frequency = runFrequency({ values: remaining });
    if (!frequency.ok)
      throw new Error(
        "Generated string occurrences were rejected by the frequency core.",
      );
    const counts = frequency.output.frequencies as Readonly<
        Record<string, number>
      >,
      remainingMultiplicities = Object.entries(counts).map(
        ([value, count]) => ({ value, count }),
      );
    const results = Array.from({ length: input.queryCount }, () =>
      calculateCountingBloomFilter(
        inserted,
        removed,
        random.pick(universe),
        input.counterCount,
        input.hashCount,
      ),
    );
    const queries = results.map((result) => {
      const exactMultiplicity = Object.hasOwn(counts, result.query)
        ? counts[result.query]
        : 0;
      if (
        result.successfulRemovals !== input.removalCount ||
        result.estimatedQueryMultiplicity < exactMultiplicity
      )
        throw new Error("Eligible-deletion counting Bloom invariants failed.");
      return {
        query: result.query,
        exactMultiplicity,
        possiblyPresent: result.possiblyPresent,
        estimatedMultiplicity: result.estimatedQueryMultiplicity,
      };
    });
    const positiveQueryCount = queries.filter(
      (query) => query.exactMultiplicity > 0,
    ).length;
    return toolSuccess({
      inserted,
      removed,
      remainingMultiplicities,
      queries,
      filter: {
        counterCount: input.counterCount,
        hashCount: input.hashCount,
        nonzeroCounters: results[0].nonzeroCounters,
        successfulRemovals: results[0].successfulRemovals,
      },
      summary: {
        positiveQueryCount,
        negativeQueryCount: queries.length - positiveQueryCount,
        falsePositiveCount: queries.filter(
          (query) => query.exactMultiplicity === 0 && query.possiblyPresent,
        ).length,
      },
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const countingBloomFilterWorkloadExample = {
  input: {
    universe: ["a", "b", "c"],
    insertCount: 5,
    removalCount: 2,
    queryCount: 4,
    counterCount: 8,
    hashCount: 2,
    seed: 42,
  },
  output: {
    inserted: ["b", "b", "c", "c", "a"],
    removed: ["c", "b"],
    remainingMultiplicities: [
      {
        value: "b",
        count: 1,
      },
      {
        value: "c",
        count: 1,
      },
      {
        value: "a",
        count: 1,
      },
    ],
    queries: [
      {
        query: "b",
        exactMultiplicity: 1,
        possiblyPresent: true,
        estimatedMultiplicity: 2,
      },
      {
        query: "c",
        exactMultiplicity: 1,
        possiblyPresent: true,
        estimatedMultiplicity: 1,
      },
      {
        query: "b",
        exactMultiplicity: 1,
        possiblyPresent: true,
        estimatedMultiplicity: 2,
      },
      {
        query: "a",
        exactMultiplicity: 1,
        possiblyPresent: true,
        estimatedMultiplicity: 2,
      },
    ],
    filter: {
      counterCount: 8,
      hashCount: 2,
      nonzeroCounters: 4,
      successfulRemovals: 2,
    },
    summary: {
      positiveQueryCount: 4,
      negativeQueryCount: 0,
      falsePositiveCount: 0,
    },
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  CountingBloomFilterWorkloadInput,
  CountingBloomFilterWorkloadOutput
>;
export const countingBloomFilterWorkloadTool = createModelDefinition<
  CountingBloomFilterWorkloadInput,
  CountingBloomFilterWorkloadOutput
>({
  id: "random/counting-bloom-filter-workload",
  title: "Random Counting Bloom Filter Workload Generator",
  description:
    "Generate with-replacement string insertions, remove only eligible remaining occurrences, and query a delegated counting Bloom filter against exact retained multiplicities; query estimates may overcount through collisions, and the fixed batch is not an arbitrary interleaved deletion trace.",
  inputSchema,
  outputSchema,
  execute: calculateCountingBloomFilterWorkload,
});
export const runCountingBloomFilterWorkload =
  countingBloomFilterWorkloadTool.execute;
export default countingBloomFilterWorkloadTool;
