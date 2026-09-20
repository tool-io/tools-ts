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

export type CuttingStockInstanceInput = {
  readonly typeCount: number;
  readonly stockLength: number;
  readonly minimumLength: number;
  readonly maximumLength: number;
  readonly minimumDemand: number;
  readonly maximumDemand: number;
  readonly seed?: number;
};
export type CuttingStockInstanceOutput = {
  readonly stockLength: number;
  readonly pieceTypes: readonly {
    readonly length: number;
    readonly demand: number;
  }[];
  readonly stocks: readonly {
    readonly pieces: readonly number[];
    readonly used: number;
    readonly waste: number;
  }[];
  readonly stockCount: number;
  readonly randomness: GeneratorReplay;
};
const demand = { type: "integer", minimum: 1, maximum: 64 } as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    typeCount: { type: "integer", minimum: 1, maximum: 32 },
    stockLength: positive,
    minimumLength: positive,
    maximumLength: positive,
    minimumDemand: demand,
    maximumDemand: demand,
    seed: generatorSeedSchema,
  },
  required: [
    "typeCount",
    "stockLength",
    "minimumLength",
    "maximumLength",
    "minimumDemand",
    "maximumDemand",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stockLength: positive,
    pieceTypes: {
      type: "array",
      minItems: 1,
      maxItems: 32,
      items: {
        type: "object",
        additionalProperties: false,
        properties: { length: positive, demand },
        required: ["length", "demand"],
      },
    },
    stocks: {
      type: "array",
      minItems: 1,
      maxItems: 512,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          pieces: {
            type: "array",
            minItems: 1,
            maxItems: 512,
            items: { type: "integer", minimum: 0, maximum: 31 },
          },
          used: positive,
          waste: nonnegative,
        },
        required: ["pieces", "used", "waste"],
      },
    },
    stockCount: { type: "integer", minimum: 1, maximum: 512 },
    randomness: generatorReplaySchema,
  },
  required: ["stockLength", "pieceTypes", "stocks", "stockCount", "randomness"],
} as const;

const isInput = (input: unknown): input is CuttingStockInstanceInput =>
  matchesModelInput(input, inputSchema);
export const calculateCuttingStockInstance = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<CuttingStockInstanceOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    orderedInstanceRange(
      input.minimumLength,
      input.maximumLength,
      "maximumLength",
    );
    orderedInstanceRange(
      input.minimumDemand,
      input.maximumDemand,
      "maximumDemand",
    );
    if (input.maximumLength > input.stockLength)
      simpleError(
        "maximumLength",
        "Every piece must fit the stock length.",
        "piece_exceeds_stock",
      );
    if (input.typeCount * input.maximumDemand > 512)
      simpleError(
        "maximumDemand",
        "At most 512 requested pieces are supported.",
        "resource_limit",
      );
    const random = createGeneratorRandom(input.seed, context);
    const pieceTypes = Array.from({ length: input.typeCount }, () => ({
      length: random.integer(input.minimumLength, input.maximumLength),
      demand: random.integer(input.minimumDemand, input.maximumDemand),
    }));
    const stocks: { pieces: number[]; used: number; waste: number }[] = [];
    pieceTypes.forEach((piece, type) => {
      for (let count = 0; count < piece.demand; count += 1) {
        let stock = stocks.find((candidate) => piece.length <= candidate.waste);
        if (!stock) {
          stock = { pieces: [], used: 0, waste: input.stockLength };
          stocks.push(stock);
        }
        stock.pieces.push(type);
        stock.used += piece.length;
        stock.waste -= piece.length;
      }
    });
    return toolSuccess({
      stockLength: input.stockLength,
      pieceTypes,
      stocks,
      stockCount: stocks.length,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const cuttingStockInstanceExample = {
  input: {
    typeCount: 3,
    stockLength: 20,
    minimumLength: 3,
    maximumLength: 9,
    minimumDemand: 1,
    maximumDemand: 3,
    seed: 42,
  },
  output: {
    stockLength: 20,
    pieceTypes: [
      {
        length: 7,
        demand: 2,
      },
      {
        length: 8,
        demand: 3,
      },
      {
        length: 4,
        demand: 2,
      },
    ],
    stocks: [
      {
        pieces: [0, 0, 2],
        used: 18,
        waste: 2,
      },
      {
        pieces: [1, 1, 2],
        used: 20,
        waste: 0,
      },
      {
        pieces: [1],
        used: 8,
        waste: 12,
      },
    ],
    stockCount: 3,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<CuttingStockInstanceInput, CuttingStockInstanceOutput>;
export const cuttingStockInstanceTool = createModelDefinition<
  CuttingStockInstanceInput,
  CuttingStockInstanceOutput
>({
  id: "random/cutting-stock-instance",
  title: "Random One-Dimensional Cutting Stock Instance Generator",
  description:
    "Generate integer piece lengths and demands for unlimited identical stock lengths, with an exact-demand first-fit cutting witness; zero kerf and no stock-count optimality claim.",
  inputSchema,
  outputSchema,
  execute: calculateCuttingStockInstance,
});
export const runCuttingStockInstance = cuttingStockInstanceTool.execute;
export default cuttingStockInstanceTool;
