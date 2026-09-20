import type { ToolExecutionContext } from "../../core/definition.js";
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
import { calculateCartesianProduct } from "../../list/cartesian-product/tool.js";
import { runDifference } from "../../set/difference/tool.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  snArray,
  snBoundOutput,
  snDistinct,
  snId,
  snInteger,
  snObject,
  snPick,
  snProbability,
} from "../m250-sampling-narrative-support.js";

export type NegativePair = { readonly first: string; readonly second: string };
export type NegativePairSamplerInput = {
  readonly itemIds: readonly string[];
  readonly positives: readonly NegativePair[];
  readonly convention: "ordered" | "unordered";
  readonly allowSelfPairs: boolean;
  readonly count: number;
  readonly replacement: boolean;
  readonly seed?: number;
};
export type NegativePairSamplerOutput = {
  readonly pairs: readonly (NegativePair & {
    readonly conditionalProbability: number;
  })[];
  readonly eligiblePairCount: number;
  readonly excludedPairCount: number;
  readonly randomness: GeneratorReplay;
};
const pairSchema = snObject({ first: snId, second: snId });
export const inputSchema = snObject(
  {
    itemIds: snArray(snId, 128),
    positives: snArray(pairSchema, 16384),
    convention: {
      type: "string",
      enum: ["ordered", "unordered"],
      description:
        "Unordered pairs use the supplied item order as their canonical endpoint order.",
    },
    allowSelfPairs: { type: "boolean" },
    count: { type: "integer", minimum: 0, maximum: 4096 },
    replacement: { type: "boolean" },
    seed: generatorSeedSchema,
  },
  [
    "itemIds",
    "positives",
    "convention",
    "allowSelfPairs",
    "count",
    "replacement",
  ],
);
export const outputSchema = snObject({
  pairs: snArray(
    snObject({
      first: snId,
      second: snId,
      conditionalProbability: snProbability,
    }),
    4096,
  ),
  eligiblePairCount: snInteger,
  excludedPairCount: {
    ...snInteger,
    description:
      "Distinct positive pairs removed from the convention's space after the self-pair policy; repeated or self-disallowed positives do not add exclusions.",
  },
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is NegativePairSamplerInput =>
  matchesModelInput(input, inputSchema);
export const calculateNegativePairSampler = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<NegativePairSamplerOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    snDistinct(input.itemIds, "itemIds");
    const indices = new Map(input.itemIds.map((id, i) => [id, i]));
    const key = (first: number, second: number): string =>
      input.convention === "unordered" && first > second
        ? `${second}:${first}`
        : `${first}:${second}`;
    const positiveKeys = input.positives.map((pair) => {
      const a = indices.get(pair.first),
        b = indices.get(pair.second);
      if (a === undefined || b === undefined)
        return simpleError(
          "positives",
          "Every positive endpoint must name a supplied item.",
          "unknown_pair_item",
        );
      return key(a, b);
    });
    const tokens = input.itemIds.map((_, i) => i);
    const all = tokens.length
      ? calculateCartesianProduct({ first: tokens, second: tokens })
          .pairs.filter(
            ([a, b]) =>
              (input.allowSelfPairs || a !== b) &&
              (input.convention === "ordered" || a <= b),
          )
          .map(([a, b]) => key(a, b))
      : [];
    const difference = runDifference({ first: all, second: positiveKeys });
    if (!difference.ok)
      throw new Error("Validated pair tokens failed the difference core.");
    const pool = [...difference.output.values],
      eligiblePairCount = pool.length;
    if (
      input.count > 0 &&
      (!eligiblePairCount ||
        (!input.replacement && input.count > eligiblePairCount))
    )
      simpleError(
        "count",
        "The eligible negative-pair space cannot satisfy the sample.",
        "exhausted_pair_space",
      );
    const random = createGeneratorRandom(input.seed, context),
      pairs: NegativePairSamplerOutput["pairs"][number][] = [];
    for (let i = 0; i < input.count; i += 1) {
      const token = snPick(pool, random),
        slot = pool.indexOf(token),
        [a, b] = token.split(":").map(Number);
      pairs.push({
        first: input.itemIds[a],
        second: input.itemIds[b],
        conditionalProbability: 1 / pool.length,
      });
      if (!input.replacement) pool.splice(slot, 1);
    }
    return toolSuccess(
      snBoundOutput({
        pairs,
        eligiblePairCount,
        excludedPairCount: all.length - eligiblePairCount,
        randomness: generatorReplay(input.seed, context),
      }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const negativePairSamplerExample = {
  input: {
    itemIds: ["A", "B", "C"],
    positives: [{ first: "A", second: "B" }],
    convention: "unordered",
    allowSelfPairs: false,
    count: 2,
    replacement: false,
    seed: 42,
  },
  output: {
    pairs: [
      { first: "B", second: "C", conditionalProbability: 0.5 },
      { first: "A", second: "C", conditionalProbability: 1 },
    ],
    eligiblePairCount: 2,
    excludedPairCount: 1,
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  NegativePairSamplerInput,
  NegativePairSamplerOutput
>;
export const negativePairSamplerTool = createModelDefinition<
  NegativePairSamplerInput,
  NegativePairSamplerOutput
>({
  id: "random/negative-pair-sampler",
  title: "Random Negative Pair Sampler Generator",
  description:
    "Sample uniformly among supplied-item pairs after positive and self exclusions, with explicit endpoint ordering, replacement, and conditional weights.",
  inputSchema,
  outputSchema,
  execute: calculateNegativePairSampler,
});
export const runNegativePairSampler = negativePairSamplerTool.execute;
export default negativePairSamplerTool;
