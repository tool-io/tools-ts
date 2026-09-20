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
import { minHashComparison } from "../../data-structure/hash-sketch.js";
import {
  sketchUniverseSchema,
  sketchUniqueUniverse,
  sketchSetPair,
} from "../sketch-workload-construction.js";

export type MinHashSimilarityWorkloadInput = {
  readonly universe: readonly string[];
  readonly leftCount: number;
  readonly rightCount: number;
  readonly sharedCount: number;
  readonly hashCount: number;
  readonly seed?: number;
};
export type MinHashSimilarityWorkloadOutput = {
  readonly sets: {
    readonly left: readonly string[];
    readonly right: readonly string[];
    readonly intersection: readonly string[];
    readonly union: readonly string[];
  };
  readonly similarity: {
    readonly exactJaccard: number;
    readonly estimatedJaccard: number;
  };
  readonly signatures: {
    readonly left: readonly number[];
    readonly right: readonly number[];
  };
  readonly randomness: GeneratorReplay;
};
const setSchema = {
  type: "array",
  maxItems: 256,
  items: { type: "string", maxLength: 64 },
} as const;
const signatureSchema = {
  type: "array",
  minItems: 1,
  maxItems: 256,
  items: { type: "integer", minimum: 0, maximum: 4294967295 },
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    universe: sketchUniverseSchema,
    leftCount: { type: "integer", minimum: 0, maximum: 128 },
    rightCount: { type: "integer", minimum: 0, maximum: 128 },
    sharedCount: { type: "integer", minimum: 0, maximum: 128 },
    hashCount: { type: "integer", minimum: 1, maximum: 256 },
    seed: generatorSeedSchema,
  },
  required: ["universe", "leftCount", "rightCount", "sharedCount", "hashCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sets: {
      type: "object",
      additionalProperties: false,
      properties: {
        left: setSchema,
        right: setSchema,
        intersection: setSchema,
        union: setSchema,
      },
      required: ["left", "right", "intersection", "union"],
    },
    similarity: {
      type: "object",
      additionalProperties: false,
      properties: {
        exactJaccard: { type: "number", minimum: 0, maximum: 1 },
        estimatedJaccard: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["exactJaccard", "estimatedJaccard"],
    },
    signatures: {
      type: "object",
      additionalProperties: false,
      properties: { left: signatureSchema, right: signatureSchema },
      required: ["left", "right"],
    },
    randomness: generatorReplaySchema,
  },
  required: ["sets", "similarity", "signatures", "randomness"],
} as const;

const isInput = (input: unknown): input is MinHashSimilarityWorkloadInput =>
  matchesModelInput(input, inputSchema);
export const calculateMinHashSimilarityWorkload = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<MinHashSimilarityWorkloadOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    const universe = sketchUniqueUniverse(input.universe);
    if (
      (input.leftCount + input.rightCount) *
        input.hashCount *
        Math.max(1, ...universe.map((value) => value.length)) >
      4000000
    )
      simpleError(
        "hashCount",
        "MinHash construction is limited to four million hash-character work units.",
        "resource_limit",
      );
    const random = createGeneratorRandom(input.seed, context),
      pair = sketchSetPair(
        universe,
        input.leftCount,
        input.rightCount,
        input.sharedCount,
        random,
      );
    const result = minHashComparison(pair.left, pair.right, input.hashCount);
    if (result.exactJaccard !== pair.exactJaccard)
      throw new Error(
        "Independent exact set calculations disagreed on Jaccard.",
      );
    return toolSuccess({
      sets: {
        left: pair.left,
        right: pair.right,
        intersection: pair.intersection,
        union: pair.union,
      },
      similarity: {
        exactJaccard: pair.exactJaccard,
        estimatedJaccard: result.estimatedJaccard,
      },
      signatures: { left: result.leftSignature, right: result.rightSignature },
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const minHashSimilarityWorkloadExample = {
  input: {
    universe: ["a", "b", "c", "d"],
    leftCount: 2,
    rightCount: 2,
    sharedCount: 1,
    hashCount: 4,
    seed: 42,
  },
  output: {
    sets: {
      left: ["a", "d"],
      right: ["b", "a"],
      intersection: ["a"],
      union: ["a", "d", "b"],
    },
    similarity: {
      exactJaccard: 0.3333333333333333,
      estimatedJaccard: 0.5,
    },
    signatures: {
      left: [2111704691, 1185767313, 1377171301, 2111704691],
      right: [1185767313, 1185767313, 444641715, 2111704691],
    },
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  MinHashSimilarityWorkloadInput,
  MinHashSimilarityWorkloadOutput
>;
export const minHashSimilarityWorkloadTool = createModelDefinition<
  MinHashSimilarityWorkloadInput,
  MinHashSimilarityWorkloadOutput
>({
  id: "random/minhash-similarity-workload",
  title: "Random MinHash Similarity Workload Generator",
  description:
    "Generate seeded string sets with exact supplied left/right/shared cardinalities, reuse exact intersection/union and deterministic 32-bit MinHash signatures, and retain exact versus estimated Jaccard separately; empty-union Jaccard is one, and estimates are not guarantees or semantic-similarity judgments.",
  inputSchema,
  outputSchema,
  execute: calculateMinHashSimilarityWorkload,
});
export const runMinHashSimilarityWorkload =
  minHashSimilarityWorkloadTool.execute;
export default minHashSimilarityWorkloadTool;
