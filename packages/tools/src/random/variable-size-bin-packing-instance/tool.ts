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

export type VariableSizeBinPackingInstanceInput = {
  readonly itemCount: number;
  readonly minimumSize: number;
  readonly maximumSize: number;
  readonly binTypes: readonly {
    readonly capacity: number;
    readonly cost: number;
  }[];
  readonly seed?: number;
};
export type VariableSizeBinPackingInstanceOutput = {
  readonly sizes: readonly number[];
  readonly binTypes: readonly {
    readonly capacity: number;
    readonly cost: number;
  }[];
  readonly bins: readonly {
    readonly type: number;
    readonly items: readonly number[];
    readonly load: number;
  }[];
  readonly totalCost: number;
  readonly randomness: GeneratorReplay;
};
const binTypes = {
  type: "array",
  minItems: 1,
  maxItems: 16,
  items: {
    type: "object",
    additionalProperties: false,
    properties: { capacity: positive, cost: positive },
    required: ["capacity", "cost"],
  },
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemCount: { type: "integer", minimum: 1, maximum: 128 },
    minimumSize: positive,
    maximumSize: positive,
    binTypes,
    seed: generatorSeedSchema,
  },
  required: ["itemCount", "minimumSize", "maximumSize", "binTypes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sizes: { type: "array", minItems: 1, maxItems: 128, items: positive },
    binTypes,
    bins: {
      type: "array",
      minItems: 1,
      maxItems: 128,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          type: { type: "integer", minimum: 0, maximum: 15 },
          items: {
            type: "array",
            minItems: 1,
            maxItems: 128,
            items: { type: "integer", minimum: 0, maximum: 127 },
          },
          load: positive,
        },
        required: ["type", "items", "load"],
      },
    },
    totalCost: positive,
    randomness: generatorReplaySchema,
  },
  required: ["sizes", "binTypes", "bins", "totalCost", "randomness"],
} as const;

const isInput = (
  input: unknown,
): input is VariableSizeBinPackingInstanceInput =>
  matchesModelInput(input, inputSchema);
export const calculateVariableSizeBinPackingInstance = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<VariableSizeBinPackingInstanceOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    orderedInstanceRange(input.minimumSize, input.maximumSize, "maximumSize");
    if (
      input.maximumSize >
      Math.max(...input.binTypes.map((type) => type.capacity))
    )
      simpleError(
        "maximumSize",
        "Every size must fit at least one supplied bin type.",
        "item_exceeds_capacity",
      );
    const random = createGeneratorRandom(input.seed, context);
    const sizes = Array.from({ length: input.itemCount }, () =>
      random.integer(input.minimumSize, input.maximumSize),
    );
    const bins: { type: number; items: number[]; load: number }[] = [];
    sizes.forEach((size, item) => {
      let bin = bins.find(
        (b) => size <= input.binTypes[b.type].capacity - b.load,
      );
      if (!bin) {
        let type = -1;
        input.binTypes.forEach((candidate, index) => {
          if (
            candidate.capacity >= size &&
            (type < 0 || candidate.cost < input.binTypes[type].cost)
          )
            type = index;
        });
        if (type < 0)
          throw new Error("Validated item size has no fitting type.");
        bin = { type, items: [], load: 0 };
        bins.push(bin);
      }
      bin.items.push(item);
      bin.load += size;
    });
    const totalCost = exactInstanceSum(
      bins.map((bin) => input.binTypes[bin.type].cost),
      "binTypes",
    );
    return toolSuccess({
      sizes,
      binTypes: input.binTypes.map((type) => ({ ...type })),
      bins,
      totalCost,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const variableSizeBinPackingInstanceExample = {
  input: {
    itemCount: 5,
    minimumSize: 1,
    maximumSize: 5,
    binTypes: [
      {
        capacity: 4,
        cost: 3,
      },
      {
        capacity: 8,
        cost: 5,
      },
    ],
    seed: 42,
  },
  output: {
    sizes: [4, 3, 5, 4, 1],
    binTypes: [
      {
        capacity: 4,
        cost: 3,
      },
      {
        capacity: 8,
        cost: 5,
      },
    ],
    bins: [
      {
        type: 0,
        items: [0],
        load: 4,
      },
      {
        type: 0,
        items: [1, 4],
        load: 4,
      },
      {
        type: 1,
        items: [2],
        load: 5,
      },
      {
        type: 0,
        items: [3],
        load: 4,
      },
    ],
    totalCost: 14,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  VariableSizeBinPackingInstanceInput,
  VariableSizeBinPackingInstanceOutput
>;
export const variableSizeBinPackingInstanceTool = createModelDefinition<
  VariableSizeBinPackingInstanceInput,
  VariableSizeBinPackingInstanceOutput
>({
  id: "random/variable-size-bin-packing-instance",
  title: "Random Variable-Size Bin Packing Instance Generator",
  description:
    "Generate integer item sizes for unlimited caller-defined capacity/cost bin types, with first-fit reuse and the cheapest fitting type for each new bin; no minimum-total-cost claim.",
  inputSchema,
  outputSchema,
  execute: calculateVariableSizeBinPackingInstance,
});
export const runVariableSizeBinPackingInstance =
  variableSizeBinPackingInstanceTool.execute;
export default variableSizeBinPackingInstanceTool;
