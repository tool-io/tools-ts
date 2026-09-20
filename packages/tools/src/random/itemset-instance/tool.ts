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
import { runFrequency } from "../../list/frequency/tool.js";

export type ItemsetInstanceInput = {
  readonly items: readonly string[];
  readonly transactionCount: number;
  readonly minimumSize: number;
  readonly maximumSize: number;
  readonly seed?: number;
};
export type ItemsetInstanceOutput = {
  readonly items: readonly string[];
  readonly transactions: readonly (readonly string[])[];
  readonly itemCounts: readonly number[];
  readonly randomness: GeneratorReplay;
};
const labels = {
  type: "array",
  minItems: 1,
  maxItems: 64,
  items: { type: "string", minLength: 1, maxLength: 64 },
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    items: labels,
    transactionCount: { type: "integer", minimum: 1, maximum: 512 },
    minimumSize: { type: "integer", minimum: 0, maximum: 64 },
    maximumSize: { type: "integer", minimum: 0, maximum: 64 },
    seed: generatorSeedSchema,
  },
  required: ["items", "transactionCount", "minimumSize", "maximumSize"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    items: labels,
    transactions: {
      type: "array",
      minItems: 1,
      maxItems: 512,
      items: { ...labels, minItems: 0 },
    },
    itemCounts: {
      type: "array",
      minItems: 1,
      maxItems: 64,
      items: { type: "integer", minimum: 0, maximum: 512 },
    },
    randomness: generatorReplaySchema,
  },
  required: ["items", "transactions", "itemCounts", "randomness"],
} as const;

const isInput = (input: unknown): input is ItemsetInstanceInput =>
  matchesModelInput(input, inputSchema);
export const calculateItemsetInstance = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ItemsetInstanceOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (new Set(input.items).size !== input.items.length)
      simpleError("items", "Item labels must be distinct.", "duplicate_items");
    if (
      input.maximumSize < input.minimumSize ||
      input.maximumSize > input.items.length
    )
      simpleError(
        "maximumSize",
        "Subset bounds must be ordered and fit the item bank.",
        "infeasible_subset_size",
      );
    if (input.transactionCount * input.maximumSize > 8192)
      simpleError(
        "transactionCount",
        "At most 8,192 retained item occurrences are supported.",
        "resource_limit",
      );
    const random = createGeneratorRandom(input.seed, context);
    const transactions = Array.from({ length: input.transactionCount }, () => {
      const size = random.integer(input.minimumSize, input.maximumSize);
      return random.shuffle(input.items).slice(0, size).sort();
    });
    const frequency = runFrequency({ values: transactions.flat() });
    if (!frequency.ok)
      throw new Error("Validated string itemsets could not be counted.");
    const itemCounts = input.items.map((item) => {
      const value: unknown = Object.hasOwn(frequency.output.frequencies, item)
        ? frequency.output.frequencies[item]
        : 0;
      if (typeof value !== "number" || !Number.isSafeInteger(value))
        throw new Error("Frequency output violated its numeric contract.");
      return value;
    });
    return toolSuccess({
      items: [...input.items],
      transactions,
      itemCounts,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const itemsetInstanceExample = {
  input: {
    items: ["bread", "milk", "eggs", "tea"],
    transactionCount: 4,
    minimumSize: 1,
    maximumSize: 3,
    seed: 42,
  },
  output: {
    items: ["bread", "milk", "eggs", "tea"],
    transactions: [
      ["bread", "tea"],
      ["tea"],
      ["bread", "eggs", "tea"],
      ["bread", "eggs", "tea"],
    ],
    itemCounts: [3, 0, 2, 4],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<ItemsetInstanceInput, ItemsetInstanceOutput>;
export const itemsetInstanceTool = createModelDefinition<
  ItemsetInstanceInput,
  ItemsetInstanceOutput
>({
  id: "random/itemset-instance",
  title: "Random Transaction Itemset Instance Generator",
  description:
    "Generate exact-count set-valued transactions by choosing a uniform size and a without-replacement subset from distinct supplied item labels; transactions may repeat and imported frequencies count transaction presence.",
  inputSchema,
  outputSchema,
  execute: calculateItemsetInstance,
});
export const runItemsetInstance = itemsetInstanceTool.execute;
export default itemsetInstanceTool;
