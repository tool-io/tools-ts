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
  snId,
  snInteger,
  snObject,
  snProbability,
  snWeightedIndex,
} from "../m250-sampling-narrative-support.js";

export type WeightedShuffleInput = {
  readonly candidates: readonly {
    readonly value: string;
    readonly weight: number;
  }[];
  readonly uniqueness: "position" | "value";
  readonly zeroWeightPolicy: "append" | "omit";
  readonly seed?: number;
};
export type WeightedShuffleOutput = {
  readonly order: readonly {
    readonly sourceIndex: number;
    readonly value: string;
    readonly weight: number;
    readonly selection: {
      readonly probability: number | null;
      readonly kind: "weighted" | "zero-tail";
    };
  }[];
  readonly omittedIndices: readonly number[];
  readonly randomness: GeneratorReplay;
};
export const inputSchema = snObject(
  {
    candidates: snArray(
      snObject({ value: snId, weight: { type: "number", minimum: 0 } }),
      512,
    ),
    uniqueness: {
      type: "string",
      enum: ["position", "value"],
      description:
        "Value mode removes every equal-valued position after a draw; duplicate weights contribute separate draw mass.",
    },
    zeroWeightPolicy: {
      type: "string",
      enum: ["append", "omit"],
      description:
        "Zero-weight remnants are appended in supplied order or omitted after every positive-weight draw.",
    },
    seed: generatorSeedSchema,
  },
  ["candidates", "uniqueness", "zeroWeightPolicy"],
);
export const outputSchema = snObject({
  order: snArray(
    snObject({
      sourceIndex: snInteger,
      value: snId,
      weight: { type: "number", minimum: 0 },
      selection: snObject({
        probability: {
          anyOf: [snProbability, { type: "null" }],
          description:
            "Conditional probability of the selected source POSITION, not the aggregate probability of its value. Equal-valued positions have separate mass; zero-tail entries have null probability.",
        },
        kind: { type: "string", enum: ["weighted", "zero-tail"] },
      }),
    }),
    512,
  ),
  omittedIndices: snArray(snInteger, 512),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is WeightedShuffleInput =>
  matchesModelInput(input, inputSchema);
export const calculateWeightedShuffle = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<WeightedShuffleOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (
      !Number.isFinite(
        input.candidates.reduce((sum, item) => sum + item.weight, 0),
      )
    )
      simpleError(
        "candidates",
        "The weight sum must remain finite.",
        "invalid_weight_total",
      );
    const random = createGeneratorRandom(input.seed, context),
      order: WeightedShuffleOutput["order"][number][] = [];
    let remaining = input.candidates.map((item, sourceIndex) => ({
      ...item,
      sourceIndex,
    }));
    while (remaining.some((item) => item.weight > 0)) {
      const weights = remaining.map((item) => item.weight),
        total = weights.reduce((sum, value) => sum + value, 0);
      const selected = remaining[snWeightedIndex(weights, random)];
      order.push({
        ...selected,
        selection: { probability: selected.weight / total, kind: "weighted" },
      });
      remaining = remaining.filter((item) =>
        input.uniqueness === "value"
          ? item.value !== selected.value
          : item.sourceIndex !== selected.sourceIndex,
      );
    }
    if (input.zeroWeightPolicy === "append") {
      const seen = new Set(order.map((item) => item.value));
      for (const item of remaining) {
        if (input.uniqueness === "value" && seen.has(item.value)) continue;
        order.push({
          ...item,
          selection: { probability: null, kind: "zero-tail" },
        });
        seen.add(item.value);
      }
    }
    const included = new Set(order.map((item) => item.sourceIndex));
    return toolSuccess(
      snBoundOutput({
        order,
        omittedIndices: input.candidates.flatMap((_, i) =>
          included.has(i) ? [] : [i],
        ),
        randomness: generatorReplay(input.seed, context),
      }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const weightedShuffleExample = {
  input: {
    candidates: [
      { value: "red", weight: 1 },
      { value: "blue", weight: 3 },
      { value: "gray", weight: 0 },
    ],
    uniqueness: "position",
    zeroWeightPolicy: "append",
    seed: 42,
  },
  output: {
    order: [
      {
        sourceIndex: 1,
        value: "blue",
        weight: 3,
        selection: { probability: 0.75, kind: "weighted" },
      },
      {
        sourceIndex: 0,
        value: "red",
        weight: 1,
        selection: { probability: 1, kind: "weighted" },
      },
      {
        sourceIndex: 2,
        value: "gray",
        weight: 0,
        selection: { probability: null, kind: "zero-tail" },
      },
    ],
    omittedIndices: [],
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<WeightedShuffleInput, WeightedShuffleOutput>;
export const weightedShuffleTool = createModelDefinition<
  WeightedShuffleInput,
  WeightedShuffleOutput
>({
  id: "random/weighted-shuffle",
  title: "Random Weighted Shuffle Generator",
  description:
    "Order supplied positions by sequential delegated weighted draws, with explicit equal-value removal and original-order zero-weight tails.",
  inputSchema,
  outputSchema,
  execute: calculateWeightedShuffle,
});
export const runWeightedShuffle = weightedShuffleTool.execute;
export default weightedShuffleTool;
