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
import { calculateAbcAnalysisCumulativeValueClassifier } from "../../logistics/abc-analysis-cumulative-value-classifier/tool.js";
import { calculateSlottingVelocityAbcClassifier } from "../../logistics/slotting-velocity-abc-classifier/tool.js";
import {
  orderedInstanceRange,
  exactInstanceSum,
  positiveInstanceIntegerSchema,
} from "../optimization-instance-integers.js";

export type InventoryAbcClassificationDatasetInput = {
  readonly itemCount: number;
  readonly minimumDemand: number;
  readonly maximumDemand: number;
  readonly minimumUnitValue: number;
  readonly maximumUnitValue: number;
  readonly valueUnit: string;
  readonly fastBoundaryPercent: number;
  readonly slowBoundaryPercent: number;
  readonly seed?: number;
};
export type InventoryAbcClassificationDatasetOutput = {
  readonly items: readonly {
    readonly id: string;
    readonly demandUnits: number;
    readonly unitValue: number;
    readonly annualUsageValue: number;
    readonly valueCumulativeSharePercent: number;
    readonly abcClass: "A" | "B" | "C";
    readonly throughputCumulativeSharePercent: number;
    readonly velocityClass: "A" | "B" | "C";
  }[];
  readonly valueOrderIds: readonly string[];
  readonly throughputOrderIds: readonly string[];
  readonly totalAnnualUsageValue: number;
  readonly totalDemandUnits: number;
  readonly valueUnit: string;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemCount: { type: "integer", minimum: 1, maximum: 128 },
    minimumDemand: positiveInstanceIntegerSchema,
    maximumDemand: positiveInstanceIntegerSchema,
    minimumUnitValue: positiveInstanceIntegerSchema,
    maximumUnitValue: positiveInstanceIntegerSchema,
    valueUnit: { type: "string", minLength: 1, maxLength: 64 },
    fastBoundaryPercent: {
      type: "number",
      exclusiveMinimum: 0,
      exclusiveMaximum: 100,
    },
    slowBoundaryPercent: { type: "number", exclusiveMinimum: 0, maximum: 100 },
    seed: generatorSeedSchema,
  },
  required: [
    "itemCount",
    "minimumDemand",
    "maximumDemand",
    "minimumUnitValue",
    "maximumUnitValue",
    "valueUnit",
    "fastBoundaryPercent",
    "slowBoundaryPercent",
  ],
} as const;
const percentSchema = {
    type: "number",
    exclusiveMinimum: 0,
    maximum: 100,
  } as const,
  classSchema = { type: "string", enum: ["A", "B", "C"] } as const,
  idsSchema = {
    type: "array",
    minItems: 1,
    maxItems: 128,
    items: { type: "string" },
  } as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    items: {
      type: "array",
      minItems: 1,
      maxItems: 128,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          demandUnits: positiveInstanceIntegerSchema,
          unitValue: positiveInstanceIntegerSchema,
          annualUsageValue: positiveInstanceIntegerSchema,
          valueCumulativeSharePercent: percentSchema,
          abcClass: classSchema,
          throughputCumulativeSharePercent: percentSchema,
          velocityClass: classSchema,
        },
        required: [
          "id",
          "demandUnits",
          "unitValue",
          "annualUsageValue",
          "valueCumulativeSharePercent",
          "abcClass",
          "throughputCumulativeSharePercent",
          "velocityClass",
        ],
      },
    },
    valueOrderIds: idsSchema,
    throughputOrderIds: idsSchema,
    totalAnnualUsageValue: positiveInstanceIntegerSchema,
    totalDemandUnits: positiveInstanceIntegerSchema,
    valueUnit: { type: "string", minLength: 1, maxLength: 64 },
    randomness: generatorReplaySchema,
  },
  required: [
    "items",
    "valueOrderIds",
    "throughputOrderIds",
    "totalAnnualUsageValue",
    "totalDemandUnits",
    "valueUnit",
    "randomness",
  ],
} as const;

const isInput = (
  input: unknown,
): input is InventoryAbcClassificationDatasetInput =>
  matchesModelInput(input, inputSchema);
export const calculateInventoryAbcClassificationDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<InventoryAbcClassificationDatasetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    orderedInstanceRange(
      input.minimumDemand,
      input.maximumDemand,
      "maximumDemand",
    );
    orderedInstanceRange(
      input.minimumUnitValue,
      input.maximumUnitValue,
      "maximumUnitValue",
    );
    if (input.fastBoundaryPercent >= input.slowBoundaryPercent)
      simpleError(
        "slowBoundaryPercent",
        "The slow boundary must exceed the fast boundary.",
        "invalid_threshold",
      );
    const random = createGeneratorRandom(input.seed, context),
      base = Array.from({ length: input.itemCount }, (_, i) => {
        const demandUnits = random.integer(
            input.minimumDemand,
            input.maximumDemand,
          ),
          unitValue = random.integer(
            input.minimumUnitValue,
            input.maximumUnitValue,
          ),
          value = BigInt(demandUnits) * BigInt(unitValue);
        if (value > BigInt(Number.MAX_SAFE_INTEGER))
          simpleError(
            "maximumUnitValue",
            "Synthetic item usage values must remain exact safe integers.",
            "unsafe_item_value",
          );
        return {
          id: "item-" + (i + 1),
          index: i,
          demandUnits,
          unitValue,
          annualUsageValue: Number(value),
        };
      });
    const totalAnnualUsageValue = exactInstanceSum(
        base.map((item) => item.annualUsageValue),
        "maximumUnitValue",
      ),
      totalDemandUnits = exactInstanceSum(
        base.map((item) => item.demandUnits),
        "maximumDemand",
      );
    const valueOrder = [...base].sort(
        (a, b) => b.annualUsageValue - a.annualUsageValue || a.index - b.index,
      ),
      throughputOrder = [...base].sort(
        (a, b) => b.demandUnits - a.demandUnits || a.index - b.index,
      );
    let cumulativeValue = 0,
      cumulativeDemand = 0;
    const valueResults = new Map(
      valueOrder.map((item) => {
        cumulativeValue += item.annualUsageValue;
        const valueCumulativeSharePercent =
          (cumulativeValue / totalAnnualUsageValue) * 100;
        return [
          item.id,
          {
            valueCumulativeSharePercent,
            ...calculateAbcAnalysisCumulativeValueClassifier({
              cumulativeValueSharePercent: valueCumulativeSharePercent,
            }),
          },
        ] as const;
      }),
    );
    const throughputResults = new Map(
      throughputOrder.map((item) => {
        cumulativeDemand += item.demandUnits;
        const throughputCumulativeSharePercent =
          (cumulativeDemand / totalDemandUnits) * 100;
        return [
          item.id,
          {
            throughputCumulativeSharePercent,
            ...calculateSlottingVelocityAbcClassifier({
              cumulativeThroughputSharePercent:
                throughputCumulativeSharePercent,
              fastMovingBoundaryPercent: input.fastBoundaryPercent,
              slowMovingBoundaryPercent: input.slowBoundaryPercent,
            }),
          },
        ] as const;
      }),
    );
    const items = base.map(({ index, ...item }) => {
      const value = valueResults.get(item.id),
        throughput = throughputResults.get(item.id);
      if (!value || !throughput)
        throw new Error("Ranked synthetic item was lost.");
      return { ...item, ...value, ...throughput };
    });
    return toolSuccess({
      items,
      valueOrderIds: valueOrder.map((item) => item.id),
      throughputOrderIds: throughputOrder.map((item) => item.id),
      totalAnnualUsageValue,
      totalDemandUnits,
      valueUnit: input.valueUnit,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const inventoryAbcClassificationDatasetExample = {
  input: {
    itemCount: 4,
    minimumDemand: 1,
    maximumDemand: 10,
    minimumUnitValue: 1,
    maximumUnitValue: 5,
    valueUnit: "synthetic credits",
    fastBoundaryPercent: 70,
    slowBoundaryPercent: 90,
    seed: 42,
  },
  output: {
    items: [
      {
        id: "item-1",
        demandUnits: 7,
        unitValue: 3,
        annualUsageValue: 21,
        valueCumulativeSharePercent: 76,
        abcClass: "A",
        throughputCumulativeSharePercent: 76.19047619047619,
        velocityClass: "B",
      },
      {
        id: "item-2",
        demandUnits: 9,
        unitValue: 4,
        annualUsageValue: 36,
        valueCumulativeSharePercent: 48,
        abcClass: "A",
        throughputCumulativeSharePercent: 42.857142857142854,
        velocityClass: "A",
      },
      {
        id: "item-3",
        demandUnits: 2,
        unitValue: 3,
        annualUsageValue: 6,
        valueCumulativeSharePercent: 100,
        abcClass: "C",
        throughputCumulativeSharePercent: 100,
        velocityClass: "C",
      },
      {
        id: "item-4",
        demandUnits: 3,
        unitValue: 4,
        annualUsageValue: 12,
        valueCumulativeSharePercent: 92,
        abcClass: "B",
        throughputCumulativeSharePercent: 90.47619047619048,
        velocityClass: "C",
      },
    ],
    valueOrderIds: ["item-2", "item-1", "item-4", "item-3"],
    throughputOrderIds: ["item-2", "item-1", "item-4", "item-3"],
    totalAnnualUsageValue: 75,
    totalDemandUnits: 21,
    valueUnit: "synthetic credits",
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  InventoryAbcClassificationDatasetInput,
  InventoryAbcClassificationDatasetOutput
>;
export const inventoryAbcClassificationDatasetTool = createModelDefinition<
  InventoryAbcClassificationDatasetInput,
  InventoryAbcClassificationDatasetOutput
>({
  id: "random/inventory-abc-classification-dataset",
  title: "Random Inventory ABC Classification Dataset Generator",
  description:
    "Generate positive synthetic demand and unit values in one caller-labeled value unit, rank independently by annual usage value and demand throughput, and delegate cumulative-share ABC classifications. Value policy remains the existing fixed 80/95 boundaries, velocity boundaries are explicit, ties retain item order, and classification uses the cumulative share including the current item—not a forced A class for the largest item.",
  inputSchema,
  outputSchema,
  execute: calculateInventoryAbcClassificationDataset,
});
export const runInventoryAbcClassificationDataset =
  inventoryAbcClassificationDatasetTool.execute;
export default inventoryAbcClassificationDatasetTool;
