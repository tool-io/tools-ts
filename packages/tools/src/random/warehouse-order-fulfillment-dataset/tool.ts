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
import { calculateFillRateLineItemPercent } from "../../logistics/fill-rate-line-item-percent/tool.js";
import { calculateBackorderRatePercent } from "../../logistics/backorder-rate-percent/tool.js";
import { calculateOtifOnTimeInFullPercent } from "../../logistics/otif-on-time-in-full-percent/tool.js";
import {
  orderedInstanceRange,
  exactInstanceSum,
  positiveInstanceIntegerSchema,
  nonnegativeInstanceIntegerSchema,
} from "../optimization-instance-integers.js";

export type WarehouseOrderFulfillmentDatasetInput = {
  readonly orderCount: number;
  readonly minimumLines: number;
  readonly maximumLines: number;
  readonly minimumUnits: number;
  readonly maximumUnits: number;
  readonly onTimeProbability: number;
  readonly seed?: number;
};
export type WarehouseOrderFulfillmentDatasetOutput = {
  readonly orders: readonly {
    readonly id: string;
    readonly lines: readonly {
      readonly orderedUnits: number;
      readonly shippedUnits: number;
      readonly onTime: boolean;
    }[];
    readonly delivered: boolean;
    readonly inFull: boolean;
    readonly onTimeInFull: boolean;
  }[];
  readonly totals: {
    readonly lineItemsOrdered: number;
    readonly lineItemsShippedInFull: number;
    readonly lineItemsBackordered: number;
    readonly unitsOrdered: number;
    readonly unitsShipped: number;
    readonly ordersDelivered: number;
    readonly ordersOnTimeInFull: number;
  };
  readonly metrics: {
    readonly fillRatePercent: number;
    readonly backorderRatePercent: number;
    readonly otifPercent: number | null;
    readonly otifUndefinedReason: "no-delivered-orders" | null;
  };
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    orderCount: { type: "integer", minimum: 1, maximum: 128 },
    minimumLines: { type: "integer", minimum: 1, maximum: 16 },
    maximumLines: { type: "integer", minimum: 1, maximum: 16 },
    minimumUnits: positiveInstanceIntegerSchema,
    maximumUnits: positiveInstanceIntegerSchema,
    onTimeProbability: { type: "number", minimum: 0, maximum: 1 },
    seed: generatorSeedSchema,
  },
  required: [
    "orderCount",
    "minimumLines",
    "maximumLines",
    "minimumUnits",
    "maximumUnits",
    "onTimeProbability",
  ],
} as const;
const percentSchema = { type: "number", minimum: 0, maximum: 100 } as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    orders: {
      type: "array",
      minItems: 1,
      maxItems: 128,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          lines: {
            type: "array",
            minItems: 1,
            maxItems: 16,
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                orderedUnits: positiveInstanceIntegerSchema,
                shippedUnits: nonnegativeInstanceIntegerSchema,
                onTime: { type: "boolean" },
              },
              required: ["orderedUnits", "shippedUnits", "onTime"],
            },
          },
          delivered: { type: "boolean" },
          inFull: { type: "boolean" },
          onTimeInFull: { type: "boolean" },
        },
        required: ["id", "lines", "delivered", "inFull", "onTimeInFull"],
      },
    },
    totals: {
      type: "object",
      additionalProperties: false,
      properties: {
        lineItemsOrdered: positiveInstanceIntegerSchema,
        lineItemsShippedInFull: nonnegativeInstanceIntegerSchema,
        lineItemsBackordered: nonnegativeInstanceIntegerSchema,
        unitsOrdered: positiveInstanceIntegerSchema,
        unitsShipped: nonnegativeInstanceIntegerSchema,
        ordersDelivered: nonnegativeInstanceIntegerSchema,
        ordersOnTimeInFull: nonnegativeInstanceIntegerSchema,
      },
      required: [
        "lineItemsOrdered",
        "lineItemsShippedInFull",
        "lineItemsBackordered",
        "unitsOrdered",
        "unitsShipped",
        "ordersDelivered",
        "ordersOnTimeInFull",
      ],
    },
    metrics: {
      type: "object",
      additionalProperties: false,
      properties: {
        fillRatePercent: percentSchema,
        backorderRatePercent: percentSchema,
        otifPercent: { anyOf: [percentSchema, { type: "null" }] },
        otifUndefinedReason: {
          anyOf: [
            { type: "string", const: "no-delivered-orders" },
            { type: "null" },
          ],
        },
      },
      required: [
        "fillRatePercent",
        "backorderRatePercent",
        "otifPercent",
        "otifUndefinedReason",
      ],
    },
    randomness: generatorReplaySchema,
  },
  required: ["orders", "totals", "metrics", "randomness"],
} as const;

const isInput = (
  input: unknown,
): input is WarehouseOrderFulfillmentDatasetInput =>
  matchesModelInput(input, inputSchema);
export const calculateWarehouseOrderFulfillmentDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<WarehouseOrderFulfillmentDatasetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    orderedInstanceRange(
      input.minimumLines,
      input.maximumLines,
      "maximumLines",
    );
    orderedInstanceRange(
      input.minimumUnits,
      input.maximumUnits,
      "maximumUnits",
    );
    orderedInstanceRange(0, input.maximumUnits, "maximumUnits");
    const random = createGeneratorRandom(input.seed, context);
    const orders = Array.from({ length: input.orderCount }, (_, i) => {
      const lineCount = random.integer(input.minimumLines, input.maximumLines),
        lines = Array.from({ length: lineCount }, () => {
          const orderedUnits = random.integer(
              input.minimumUnits,
              input.maximumUnits,
            ),
            shippedUnits = random.integer(0, orderedUnits),
            onTimeDraw = random.unit();
          return {
            orderedUnits,
            shippedUnits,
            onTime: shippedUnits > 0 && onTimeDraw < input.onTimeProbability,
          };
        });
      return {
        id: "order-" + (i + 1),
        lines,
        delivered: lines.some((line) => line.shippedUnits > 0),
        inFull: lines.every((line) => line.shippedUnits === line.orderedUnits),
        onTimeInFull: lines.every(
          (line) => line.shippedUnits === line.orderedUnits && line.onTime,
        ),
      };
    });
    const lines = orders.flatMap((order) => order.lines),
      totals = {
        lineItemsOrdered: lines.length,
        lineItemsShippedInFull: lines.filter(
          (line) => line.shippedUnits === line.orderedUnits,
        ).length,
        lineItemsBackordered: lines.filter(
          (line) => line.shippedUnits < line.orderedUnits,
        ).length,
        unitsOrdered: exactInstanceSum(
          lines.map((line) => line.orderedUnits),
          "maximumUnits",
        ),
        unitsShipped: exactInstanceSum(
          lines.map((line) => line.shippedUnits),
          "maximumUnits",
        ),
        ordersDelivered: orders.filter((order) => order.delivered).length,
        ordersOnTimeInFull: orders.filter((order) => order.onTimeInFull).length,
      };
    const metrics = {
      ...calculateFillRateLineItemPercent(totals),
      ...calculateBackorderRatePercent(totals),
      otifPercent: totals.ordersDelivered
        ? calculateOtifOnTimeInFullPercent(totals).otifPercent
        : null,
      otifUndefinedReason: totals.ordersDelivered
        ? null
        : ("no-delivered-orders" as const),
    };
    return toolSuccess({
      orders,
      totals,
      metrics,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const warehouseOrderFulfillmentDatasetExample = {
  input: {
    orderCount: 3,
    minimumLines: 1,
    maximumLines: 3,
    minimumUnits: 1,
    maximumUnits: 5,
    onTimeProbability: 0.7,
    seed: 42,
  },
  output: {
    orders: [
      {
        id: "order-1",
        lines: [
          {
            orderedUnits: 3,
            shippedUnits: 3,
            onTime: true,
          },
          {
            orderedUnits: 1,
            shippedUnits: 1,
            onTime: true,
          },
        ],
        delivered: true,
        inFull: true,
        onTimeInFull: true,
      },
      {
        id: "order-2",
        lines: [
          {
            orderedUnits: 5,
            shippedUnits: 2,
            onTime: true,
          },
          {
            orderedUnits: 5,
            shippedUnits: 4,
            onTime: true,
          },
        ],
        delivered: true,
        inFull: false,
        onTimeInFull: false,
      },
      {
        id: "order-3",
        lines: [
          {
            orderedUnits: 3,
            shippedUnits: 2,
            onTime: true,
          },
        ],
        delivered: true,
        inFull: false,
        onTimeInFull: false,
      },
    ],
    totals: {
      lineItemsOrdered: 5,
      lineItemsShippedInFull: 2,
      lineItemsBackordered: 3,
      unitsOrdered: 17,
      unitsShipped: 12,
      ordersDelivered: 3,
      ordersOnTimeInFull: 1,
    },
    metrics: {
      fillRatePercent: 40,
      backorderRatePercent: 60,
      otifPercent: 33.33333333333333,
      otifUndefinedReason: null,
    },
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  WarehouseOrderFulfillmentDatasetInput,
  WarehouseOrderFulfillmentDatasetOutput
>;
export const warehouseOrderFulfillmentDatasetTool = createModelDefinition<
  WarehouseOrderFulfillmentDatasetInput,
  WarehouseOrderFulfillmentDatasetOutput
>({
  id: "random/warehouse-order-fulfillment-dataset",
  title: "Random Warehouse Order Fulfillment Dataset Generator",
  description:
    "Construct synthetic orders with actual ordered/shipped line quantities and independent on-time draws, then delegate complete-line fill, backorder and delivered-order OTIF metrics. A delivery means any positive shipment; OTIF requires every line complete and on time, zero shipments are not delivered, and no delivered orders yields an explicit undefined OTIF rather than zero.",
  inputSchema,
  outputSchema,
  execute: calculateWarehouseOrderFulfillmentDataset,
});
export const runWarehouseOrderFulfillmentDataset =
  warehouseOrderFulfillmentDatasetTool.execute;
export default warehouseOrderFulfillmentDatasetTool;
