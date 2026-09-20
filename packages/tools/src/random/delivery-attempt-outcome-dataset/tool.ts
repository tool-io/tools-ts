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
import { calculateFirstAttemptDeliverySuccessPercent } from "../../logistics/first-attempt-delivery-success-percent/tool.js";
import { calculateCostPerDropLastMile } from "../../logistics/cost-per-drop-last-mile/tool.js";
import {
  orderedInstanceRange,
  exactInstanceSum,
  positiveInstanceIntegerSchema,
  nonnegativeInstanceIntegerSchema,
} from "../optimization-instance-integers.js";

export type DeliveryAttemptOutcomeDatasetInput = {
  readonly stopCount: number;
  readonly maximumAttempts: number;
  readonly firstSuccessProbability: number;
  readonly laterSuccessProbability: number;
  readonly minimumCostMinorUnits: number;
  readonly maximumCostMinorUnits: number;
  readonly currency: string;
  readonly minorUnitsPerUnit: number;
  readonly seed?: number;
};
export type DeliveryAttemptOutcomeDatasetOutput = {
  readonly stops: readonly {
    readonly id: string;
    readonly attempts: readonly {
      readonly number: number;
      readonly costMinorUnits: number;
      readonly success: boolean;
    }[];
    readonly completed: boolean;
    readonly firstAttemptSuccess: boolean;
  }[];
  readonly summary: {
    readonly totalStops: number;
    readonly completedDrops: number;
    readonly failedDrops: number;
    readonly firstAttemptDeliveries: number;
    readonly firstAttemptSuccessPercent: number;
    readonly totalCostMinorUnits: number;
    readonly totalDeliveryCost: number;
    readonly costPerDrop: number | null;
    readonly costUndefinedReason: "no-completed-drops" | null;
    readonly currency: string;
    readonly minorUnitsPerUnit: number;
  };
  readonly randomness: GeneratorReplay;
};
const probability = { type: "number", minimum: 0, maximum: 1 } as const,
  currency = { type: "string", minLength: 1, maxLength: 64 } as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stopCount: { type: "integer", minimum: 1, maximum: 128 },
    maximumAttempts: { type: "integer", minimum: 1, maximum: 16 },
    firstSuccessProbability: probability,
    laterSuccessProbability: probability,
    minimumCostMinorUnits: nonnegativeInstanceIntegerSchema,
    maximumCostMinorUnits: nonnegativeInstanceIntegerSchema,
    currency,
    minorUnitsPerUnit: positiveInstanceIntegerSchema,
    seed: generatorSeedSchema,
  },
  required: [
    "stopCount",
    "maximumAttempts",
    "firstSuccessProbability",
    "laterSuccessProbability",
    "minimumCostMinorUnits",
    "maximumCostMinorUnits",
    "currency",
    "minorUnitsPerUnit",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stops: {
      type: "array",
      minItems: 1,
      maxItems: 128,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          attempts: {
            type: "array",
            minItems: 1,
            maxItems: 16,
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                number: { type: "integer", minimum: 1, maximum: 16 },
                costMinorUnits: nonnegativeInstanceIntegerSchema,
                success: { type: "boolean" },
              },
              required: ["number", "costMinorUnits", "success"],
            },
          },
          completed: { type: "boolean" },
          firstAttemptSuccess: { type: "boolean" },
        },
        required: ["id", "attempts", "completed", "firstAttemptSuccess"],
      },
    },
    summary: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalStops: positiveInstanceIntegerSchema,
        completedDrops: nonnegativeInstanceIntegerSchema,
        failedDrops: nonnegativeInstanceIntegerSchema,
        firstAttemptDeliveries: nonnegativeInstanceIntegerSchema,
        firstAttemptSuccessPercent: {
          type: "number",
          minimum: 0,
          maximum: 100,
        },
        totalCostMinorUnits: nonnegativeInstanceIntegerSchema,
        totalDeliveryCost: { type: "number", minimum: 0 },
        costPerDrop: {
          anyOf: [{ type: "number", minimum: 0 }, { type: "null" }],
        },
        costUndefinedReason: {
          anyOf: [
            { type: "string", const: "no-completed-drops" },
            { type: "null" },
          ],
        },
        currency,
        minorUnitsPerUnit: positiveInstanceIntegerSchema,
      },
      required: [
        "totalStops",
        "completedDrops",
        "failedDrops",
        "firstAttemptDeliveries",
        "firstAttemptSuccessPercent",
        "totalCostMinorUnits",
        "totalDeliveryCost",
        "costPerDrop",
        "costUndefinedReason",
        "currency",
        "minorUnitsPerUnit",
      ],
    },
    randomness: generatorReplaySchema,
  },
  required: ["stops", "summary", "randomness"],
} as const;

const isInput = (input: unknown): input is DeliveryAttemptOutcomeDatasetInput =>
  matchesModelInput(input, inputSchema);
export const calculateDeliveryAttemptOutcomeDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<DeliveryAttemptOutcomeDatasetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    orderedInstanceRange(
      input.minimumCostMinorUnits,
      input.maximumCostMinorUnits,
      "maximumCostMinorUnits",
    );
    const random = createGeneratorRandom(input.seed, context),
      stops = Array.from({ length: input.stopCount }, (_, i) => {
        const attempts: {
          number: number;
          costMinorUnits: number;
          success: boolean;
        }[] = [];
        for (let j = 0; j < input.maximumAttempts; j += 1) {
          const costMinorUnits = random.integer(
              input.minimumCostMinorUnits,
              input.maximumCostMinorUnits,
            ),
            success =
              random.unit() <
              (j === 0
                ? input.firstSuccessProbability
                : input.laterSuccessProbability);
          attempts.push({ number: j + 1, costMinorUnits, success });
          if (success) break;
        }
        return {
          id: "stop-" + (i + 1),
          attempts,
          completed: attempts[attempts.length - 1].success,
          firstAttemptSuccess: attempts[0].success,
        };
      });
    const totalCostMinorUnits = exactInstanceSum(
        stops.flatMap((stop) =>
          stop.attempts.map((attempt) => attempt.costMinorUnits),
        ),
        "maximumCostMinorUnits",
      ),
      totalDeliveryCost = totalCostMinorUnits / input.minorUnitsPerUnit,
      completedDrops = stops.filter((stop) => stop.completed).length,
      firstAttemptDeliveries = stops.filter(
        (stop) => stop.firstAttemptSuccess,
      ).length;
    const summary = {
      totalStops: input.stopCount,
      completedDrops,
      failedDrops: input.stopCount - completedDrops,
      firstAttemptDeliveries,
      ...calculateFirstAttemptDeliverySuccessPercent({
        firstAttemptDeliveries,
        totalDeliveryStops: input.stopCount,
      }),
      totalCostMinorUnits,
      totalDeliveryCost,
      costPerDrop: completedDrops
        ? calculateCostPerDropLastMile({ completedDrops, totalDeliveryCost })
            .costPerDrop
        : null,
      costUndefinedReason: completedDrops
        ? null
        : ("no-completed-drops" as const),
      currency: input.currency,
      minorUnitsPerUnit: input.minorUnitsPerUnit,
    };
    return toolSuccess({
      stops,
      summary,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const deliveryAttemptOutcomeDatasetExample = {
  input: {
    stopCount: 3,
    maximumAttempts: 3,
    firstSuccessProbability: 0.5,
    laterSuccessProbability: 0.8,
    minimumCostMinorUnits: 100,
    maximumCostMinorUnits: 300,
    currency: "synthetic credits",
    minorUnitsPerUnit: 100,
    seed: 42,
  },
  output: {
    stops: [
      {
        id: "stop-1",
        attempts: [
          {
            number: 1,
            costMinorUnits: 220,
            success: true,
          },
        ],
        completed: true,
        firstAttemptSuccess: true,
      },
      {
        id: "stop-2",
        attempts: [
          {
            number: 1,
            costMinorUnits: 271,
            success: false,
          },
          {
            number: 2,
            costMinorUnits: 135,
            success: true,
          },
        ],
        completed: true,
        firstAttemptSuccess: false,
      },
      {
        id: "stop-3",
        attempts: [
          {
            number: 1,
            costMinorUnits: 154,
            success: false,
          },
          {
            number: 2,
            costMinorUnits: 273,
            success: true,
          },
        ],
        completed: true,
        firstAttemptSuccess: false,
      },
    ],
    summary: {
      totalStops: 3,
      completedDrops: 3,
      failedDrops: 0,
      firstAttemptDeliveries: 1,
      firstAttemptSuccessPercent: 33.33333333333333,
      totalCostMinorUnits: 1053,
      totalDeliveryCost: 10.53,
      costPerDrop: 3.51,
      costUndefinedReason: null,
      currency: "synthetic credits",
      minorUnitsPerUnit: 100,
    },
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  DeliveryAttemptOutcomeDatasetInput,
  DeliveryAttemptOutcomeDatasetOutput
>;
export const deliveryAttemptOutcomeDatasetTool = createModelDefinition<
  DeliveryAttemptOutcomeDatasetInput,
  DeliveryAttemptOutcomeDatasetOutput
>({
  id: "random/delivery-attempt-outcome-dataset",
  title: "Random Delivery Attempt Outcome Dataset Generator",
  description:
    "Generate synthetic stops with capped retry attempts, explicit first/later success probabilities and integer minor-unit attempt costs; stop attempts after success and delegate first-attempt rate and cost per completed drop. Cost includes failed attempts and failed stops, uses one supplied currency/unit convention, and is undefined when no drops complete; no real-route prediction is implied.",
  inputSchema,
  outputSchema,
  execute: calculateDeliveryAttemptOutcomeDataset,
});
export const runDeliveryAttemptOutcomeDataset =
  deliveryAttemptOutcomeDatasetTool.execute;
export default deliveryAttemptOutcomeDatasetTool;
