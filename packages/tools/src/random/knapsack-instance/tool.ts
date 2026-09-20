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
  positiveInstanceIntegerSchema as positive,
  nonnegativeInstanceIntegerSchema as nonnegative,
  exactInstanceSum,
  orderedInstanceRange,
} from "../optimization-instance-integers.js";

export type KnapsackInstanceInput = {
  readonly itemCount: number;
  readonly capacity: number;
  readonly minimumWeight: number;
  readonly maximumWeight: number;
  readonly minimumValue: number;
  readonly maximumValue: number;
  readonly seed?: number;
};
export type KnapsackInstanceOutput = {
  readonly items: readonly {
    readonly id: number;
    readonly weight: number;
    readonly value: number;
  }[];
  readonly capacity: number;
  readonly selected: readonly number[];
  readonly totalWeight: number;
  readonly totalValue: number;
  readonly randomness: GeneratorReplay;
};
const ids = {
  type: "array",
  maxItems: 512,
  items: { type: "integer", minimum: 0, maximum: 511 },
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemCount: { type: "integer", minimum: 1, maximum: 512 },
    capacity: positive,
    minimumWeight: positive,
    maximumWeight: positive,
    minimumValue: nonnegative,
    maximumValue: nonnegative,
    seed: generatorSeedSchema,
  },
  required: [
    "itemCount",
    "capacity",
    "minimumWeight",
    "maximumWeight",
    "minimumValue",
    "maximumValue",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    items: {
      type: "array",
      minItems: 1,
      maxItems: 512,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "integer", minimum: 0, maximum: 511 },
          weight: positive,
          value: nonnegative,
        },
        required: ["id", "weight", "value"],
      },
    },
    capacity: positive,
    selected: ids,
    totalWeight: nonnegative,
    totalValue: nonnegative,
    randomness: generatorReplaySchema,
  },
  required: [
    "items",
    "capacity",
    "selected",
    "totalWeight",
    "totalValue",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is KnapsackInstanceInput =>
  matchesModelInput(input, inputSchema);
export const calculateKnapsackInstance = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<KnapsackInstanceOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    orderedInstanceRange(
      input.minimumWeight,
      input.maximumWeight,
      "maximumWeight",
    );
    orderedInstanceRange(
      input.minimumValue,
      input.maximumValue,
      "maximumValue",
    );
    if (input.maximumWeight > input.capacity)
      simpleError(
        "maximumWeight",
        "Every generated item must fit individually.",
        "item_exceeds_capacity",
      );
    const random = createGeneratorRandom(input.seed, context);
    const items = Array.from({ length: input.itemCount }, (_, id) => ({
      id,
      weight: random.integer(input.minimumWeight, input.maximumWeight),
      value: random.integer(input.minimumValue, input.maximumValue),
    }));
    const selected: number[] = [];
    let totalWeight = 0;
    for (const item of items)
      if (item.weight <= input.capacity - totalWeight) {
        selected.push(item.id);
        totalWeight += item.weight;
      }
    const totalValue = exactInstanceSum(
      selected.map((id) => items[id].value),
      "maximumValue",
    );
    return toolSuccess({
      items,
      capacity: input.capacity,
      selected,
      totalWeight,
      totalValue,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const knapsackInstanceExample = {
  input: {
    itemCount: 5,
    capacity: 12,
    minimumWeight: 1,
    maximumWeight: 8,
    minimumValue: 10,
    maximumValue: 50,
    seed: 42,
  },
  output: {
    items: [
      {
        id: 0,
        weight: 5,
        value: 28,
      },
      {
        id: 1,
        weight: 7,
        value: 37,
      },
      {
        id: 2,
        weight: 2,
        value: 31,
      },
      {
        id: 3,
        weight: 3,
        value: 35,
      },
      {
        id: 4,
        weight: 7,
        value: 29,
      },
    ],
    capacity: 12,
    selected: [0, 1],
    totalWeight: 12,
    totalValue: 65,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<KnapsackInstanceInput, KnapsackInstanceOutput>;
export const knapsackInstanceTool = createModelDefinition<
  KnapsackInstanceInput,
  KnapsackInstanceOutput
>({
  id: "random/knapsack-instance",
  title: "Random 0/1 Knapsack Instance Generator",
  description:
    "Generate integer weights and values for a single-capacity 0/1 knapsack, with an input-order feasible selection witness, not an optimum; weight and value units are caller-defined.",
  inputSchema,
  outputSchema,
  execute: calculateKnapsackInstance,
});
export const runKnapsackInstance = knapsackInstanceTool.execute;
export default knapsackInstanceTool;
