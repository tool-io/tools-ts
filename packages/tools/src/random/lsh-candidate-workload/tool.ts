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
import {
  localitySensitiveHash,
  minHashComparison,
} from "../../data-structure/hash-sketch.js";
import {
  sketchUniverseSchema,
  sketchUniqueUniverse,
  sketchSetPair,
} from "../sketch-workload-construction.js";

export type LshCandidateWorkloadInput = {
  readonly universe: readonly string[];
  readonly pairCount: number;
  readonly leftCount: number;
  readonly rightCount: number;
  readonly sharedCount: number;
  readonly hashCount: number;
  readonly bandCount: number;
  readonly seed?: number;
};
export type LshCandidateWorkloadOutput = {
  readonly settings: {
    readonly hashCount: number;
    readonly bandCount: number;
    readonly rowsPerBand: number;
  };
  readonly pairs: readonly {
    readonly left: readonly string[];
    readonly right: readonly string[];
    readonly shared: readonly string[];
    readonly exactJaccard: number;
    readonly estimatedJaccard: number;
    readonly leftSignature: readonly number[];
    readonly rightSignature: readonly number[];
    readonly candidate: boolean;
    readonly matchingBands: readonly number[];
  }[];
  readonly candidateCount: number;
  readonly randomness: GeneratorReplay;
};
const setSchema = {
  type: "array",
  maxItems: 128,
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
    pairCount: { type: "integer", minimum: 1, maximum: 32 },
    leftCount: { type: "integer", minimum: 0, maximum: 128 },
    rightCount: { type: "integer", minimum: 0, maximum: 128 },
    sharedCount: { type: "integer", minimum: 0, maximum: 128 },
    hashCount: { type: "integer", minimum: 1, maximum: 256 },
    bandCount: { type: "integer", minimum: 1, maximum: 256 },
    seed: generatorSeedSchema,
  },
  required: [
    "universe",
    "pairCount",
    "leftCount",
    "rightCount",
    "sharedCount",
    "hashCount",
    "bandCount",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    settings: {
      type: "object",
      additionalProperties: false,
      properties: {
        hashCount: { type: "integer", minimum: 1, maximum: 256 },
        bandCount: { type: "integer", minimum: 1, maximum: 256 },
        rowsPerBand: { type: "integer", minimum: 1, maximum: 256 },
      },
      required: ["hashCount", "bandCount", "rowsPerBand"],
    },
    pairs: {
      type: "array",
      minItems: 1,
      maxItems: 32,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          left: setSchema,
          right: setSchema,
          shared: setSchema,
          exactJaccard: { type: "number", minimum: 0, maximum: 1 },
          estimatedJaccard: { type: "number", minimum: 0, maximum: 1 },
          leftSignature: signatureSchema,
          rightSignature: signatureSchema,
          candidate: { type: "boolean" },
          matchingBands: {
            type: "array",
            maxItems: 256,
            items: { type: "integer", minimum: 0, maximum: 255 },
          },
        },
        required: [
          "left",
          "right",
          "shared",
          "exactJaccard",
          "estimatedJaccard",
          "leftSignature",
          "rightSignature",
          "candidate",
          "matchingBands",
        ],
      },
    },
    candidateCount: { type: "integer", minimum: 0, maximum: 32 },
    randomness: generatorReplaySchema,
  },
  required: ["settings", "pairs", "candidateCount", "randomness"],
} as const;

const isInput = (input: unknown): input is LshCandidateWorkloadInput =>
  matchesModelInput(input, inputSchema);
export const calculateLshCandidateWorkload = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<LshCandidateWorkloadOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.hashCount % input.bandCount !== 0)
      simpleError(
        "bandCount",
        "Band count must divide hash count exactly.",
        "invalid_band_count",
      );
    const universe = sketchUniqueUniverse(input.universe);
    if (
      2 *
        input.pairCount *
        (input.leftCount + input.rightCount) *
        input.hashCount *
        Math.max(1, ...universe.map((value) => value.length)) >
      4000000
    )
      simpleError(
        "pairCount",
        "Delegated signatures and candidate checks are limited to four million hash-character work units.",
        "resource_limit",
      );
    const random = createGeneratorRandom(input.seed, context);
    const pairs = Array.from({ length: input.pairCount }, () => {
      const pair = sketchSetPair(
        universe,
        input.leftCount,
        input.rightCount,
        input.sharedCount,
        random,
      );
      const estimate = minHashComparison(
          pair.left,
          pair.right,
          input.hashCount,
        ),
        candidate = localitySensitiveHash(
          pair.left,
          pair.right,
          input.hashCount,
          input.bandCount,
        );
      if (estimate.exactJaccard !== pair.exactJaccard)
        throw new Error("Independent set calculations disagreed on Jaccard.");
      return {
        left: pair.left,
        right: pair.right,
        shared: pair.intersection,
        exactJaccard: pair.exactJaccard,
        estimatedJaccard: estimate.estimatedJaccard,
        leftSignature: estimate.leftSignature,
        rightSignature: estimate.rightSignature,
        ...candidate,
      };
    });
    return toolSuccess({
      settings: {
        hashCount: input.hashCount,
        bandCount: input.bandCount,
        rowsPerBand: input.hashCount / input.bandCount,
      },
      pairs,
      candidateCount: pairs.filter((pair) => pair.candidate).length,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const lshCandidateWorkloadExample = {
  input: {
    universe: ["a", "b", "c", "d"],
    pairCount: 2,
    leftCount: 2,
    rightCount: 2,
    sharedCount: 1,
    hashCount: 4,
    bandCount: 4,
    seed: 42,
  },
  output: {
    settings: {
      hashCount: 4,
      bandCount: 4,
      rowsPerBand: 1,
    },
    pairs: [
      {
        left: ["a", "d"],
        right: ["b", "a"],
        shared: ["a"],
        exactJaccard: 0.3333333333333333,
        estimatedJaccard: 0.5,
        leftSignature: [2111704691, 1185767313, 1377171301, 2111704691],
        rightSignature: [1185767313, 1185767313, 444641715, 2111704691],
        candidate: true,
        matchingBands: [1, 3],
      },
      {
        left: ["d", "b"],
        right: ["a", "d"],
        shared: ["d"],
        exactJaccard: 0.3333333333333333,
        estimatedJaccard: 0,
        leftSignature: [1185767313, 3736780160, 444641715, 3736780160],
        rightSignature: [2111704691, 1185767313, 1377171301, 2111704691],
        candidate: false,
        matchingBands: [],
      },
    ],
    candidateCount: 1,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<LshCandidateWorkloadInput, LshCandidateWorkloadOutput>;
export const lshCandidateWorkloadTool = createModelDefinition<
  LshCandidateWorkloadInput,
  LshCandidateWorkloadOutput
>({
  id: "random/lsh-candidate-workload",
  title: "Random LSH Candidate Workload Generator",
  description:
    "Generate bounded string-set pair batches with exact supplied overlaps, then delegate banded MinHash candidate flags and signatures; retain exact Jaccard, estimated Jaccard, matching bands, and actual candidate counts separately, without interpreting a candidate as semantic similarity or a guaranteed retrieval outcome.",
  inputSchema,
  outputSchema,
  execute: calculateLshCandidateWorkload,
});
export const runLshCandidateWorkload = lshCandidateWorkloadTool.execute;
export default lshCandidateWorkloadTool;
