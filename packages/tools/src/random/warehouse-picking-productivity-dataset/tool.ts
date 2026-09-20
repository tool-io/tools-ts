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
import { calculateOrdersPerHourPickerThroughput } from "../../logistics/orders-per-hour-picker-throughput/tool.js";
import { calculateLinesPerHourPackStation } from "../../logistics/lines-per-hour-pack-station/tool.js";
import {
  orderedInstanceRange,
  exactInstanceSum,
  positiveInstanceIntegerSchema,
  nonnegativeInstanceIntegerSchema,
} from "../optimization-instance-integers.js";

export type WarehousePickingProductivityDatasetInput = {
  readonly shiftCount: number;
  readonly minimumOrders: number;
  readonly maximumOrders: number;
  readonly minimumLinesPerOrder: number;
  readonly maximumLinesPerOrder: number;
  readonly minimumMinutes: number;
  readonly maximumMinutes: number;
  readonly seed?: number;
};
export type ProductivityTotals = {
  readonly ordersPicked: number;
  readonly linesPacked: number;
  readonly pickerMinutes: number;
  readonly stationMinutes: number;
  readonly pickerHours: number;
  readonly stationHours: number;
  readonly ordersPerHour: number;
  readonly linesPerHour: number;
};
export type WarehousePickingProductivityDatasetOutput = {
  readonly shifts: readonly (ProductivityTotals & {
    readonly id: string;
    readonly linesPerOrder: number;
  })[];
  readonly totals: ProductivityTotals;
  readonly randomness: GeneratorReplay;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shiftCount: { type: "integer", minimum: 1, maximum: 128 },
    minimumOrders: nonnegativeInstanceIntegerSchema,
    maximumOrders: nonnegativeInstanceIntegerSchema,
    minimumLinesPerOrder: positiveInstanceIntegerSchema,
    maximumLinesPerOrder: positiveInstanceIntegerSchema,
    minimumMinutes: positiveInstanceIntegerSchema,
    maximumMinutes: positiveInstanceIntegerSchema,
    seed: generatorSeedSchema,
  },
  required: [
    "shiftCount",
    "minimumOrders",
    "maximumOrders",
    "minimumLinesPerOrder",
    "maximumLinesPerOrder",
    "minimumMinutes",
    "maximumMinutes",
  ],
} as const;
const throughputProperties = {
  ordersPicked: nonnegativeInstanceIntegerSchema,
  linesPacked: nonnegativeInstanceIntegerSchema,
  pickerMinutes: positiveInstanceIntegerSchema,
  stationMinutes: positiveInstanceIntegerSchema,
  pickerHours: { type: "number", exclusiveMinimum: 0 },
  stationHours: { type: "number", exclusiveMinimum: 0 },
  ordersPerHour: { type: "number", minimum: 0 },
  linesPerHour: { type: "number", minimum: 0 },
} as const;
const totalsSchema = {
  type: "object",
  additionalProperties: false,
  properties: throughputProperties,
  required: [
    "ordersPicked",
    "linesPacked",
    "pickerMinutes",
    "stationMinutes",
    "pickerHours",
    "stationHours",
    "ordersPerHour",
    "linesPerHour",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shifts: {
      type: "array",
      minItems: 1,
      maxItems: 128,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          ...throughputProperties,
          id: { type: "string" },
          linesPerOrder: positiveInstanceIntegerSchema,
        },
        required: [...totalsSchema.required, "id", "linesPerOrder"],
      },
    },
    totals: totalsSchema,
    randomness: generatorReplaySchema,
  },
  required: ["shifts", "totals", "randomness"],
} as const;
const throughputRates = (
  ordersPicked: number,
  linesPacked: number,
  pickerMinutes: number,
  stationMinutes: number,
): ProductivityTotals => {
  const pickerHours = pickerMinutes / 60,
    stationHours = stationMinutes / 60;
  return {
    ordersPicked,
    linesPacked,
    pickerMinutes,
    stationMinutes,
    pickerHours,
    stationHours,
    ...calculateOrdersPerHourPickerThroughput({ ordersPicked, pickerHours }),
    ...calculateLinesPerHourPackStation({ linesPacked, stationHours }),
  };
};
const isInput = (
  input: unknown,
): input is WarehousePickingProductivityDatasetInput =>
  matchesModelInput(input, inputSchema);
export const calculateWarehousePickingProductivityDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<WarehousePickingProductivityDatasetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    orderedInstanceRange(
      input.minimumOrders,
      input.maximumOrders,
      "maximumOrders",
    );
    orderedInstanceRange(
      input.minimumLinesPerOrder,
      input.maximumLinesPerOrder,
      "maximumLinesPerOrder",
    );
    orderedInstanceRange(
      input.minimumMinutes,
      input.maximumMinutes,
      "maximumMinutes",
    );
    const random = createGeneratorRandom(input.seed, context),
      shifts = Array.from({ length: input.shiftCount }, (_, i) => {
        const ordersPicked = random.integer(
            input.minimumOrders,
            input.maximumOrders,
          ),
          linesPerOrder = random.integer(
            input.minimumLinesPerOrder,
            input.maximumLinesPerOrder,
          ),
          product = BigInt(ordersPicked) * BigInt(linesPerOrder);
        if (product > BigInt(Number.MAX_SAFE_INTEGER))
          simpleError(
            "maximumLinesPerOrder",
            "Generated packed-line quantities must remain safe integers.",
            "unsafe_line_count",
          );
        const linesPacked = Number(product),
          pickerMinutes = random.integer(
            input.minimumMinutes,
            input.maximumMinutes,
          ),
          stationMinutes = random.integer(
            input.minimumMinutes,
            input.maximumMinutes,
          );
        return {
          id: "shift-" + (i + 1),
          linesPerOrder,
          ...throughputRates(
            ordersPicked,
            linesPacked,
            pickerMinutes,
            stationMinutes,
          ),
        };
      });
    const totals = throughputRates(
      exactInstanceSum(
        shifts.map((s) => s.ordersPicked),
        "maximumOrders",
      ),
      exactInstanceSum(
        shifts.map((s) => s.linesPacked),
        "maximumLinesPerOrder",
      ),
      exactInstanceSum(
        shifts.map((s) => s.pickerMinutes),
        "maximumMinutes",
      ),
      exactInstanceSum(
        shifts.map((s) => s.stationMinutes),
        "maximumMinutes",
      ),
    );
    return toolSuccess({
      shifts,
      totals,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const warehousePickingProductivityDatasetExample = {
  input: {
    shiftCount: 3,
    minimumOrders: 0,
    maximumOrders: 20,
    minimumLinesPerOrder: 1,
    maximumLinesPerOrder: 4,
    minimumMinutes: 30,
    maximumMinutes: 120,
    seed: 42,
  },
  output: {
    shifts: [
      {
        id: "shift-1",
        ordersPicked: 12,
        linesPerOrder: 2,
        linesPacked: 24,
        pickerMinutes: 107,
        stationMinutes: 90,
        pickerHours: 1.7833333333333334,
        stationHours: 1.5,
        ordersPerHour: 6.728971962616822,
        linesPerHour: 16,
      },
      {
        id: "shift-2",
        ordersPicked: 3,
        linesPerOrder: 3,
        linesPacked: 9,
        pickerMinutes: 54,
        stationMinutes: 86,
        pickerHours: 0.9,
        stationHours: 1.4333333333333333,
        ordersPerHour: 3.333333333333333,
        linesPerHour: 6.27906976744186,
      },
      {
        id: "shift-3",
        ordersPicked: 18,
        linesPerOrder: 2,
        linesPacked: 36,
        pickerMinutes: 52,
        stationMinutes: 110,
        pickerHours: 0.8666666666666667,
        stationHours: 1.8333333333333333,
        ordersPerHour: 20.76923076923077,
        linesPerHour: 19.636363636363637,
      },
    ],
    totals: {
      ordersPicked: 33,
      linesPacked: 69,
      pickerMinutes: 213,
      stationMinutes: 286,
      pickerHours: 3.55,
      stationHours: 4.766666666666667,
      ordersPerHour: 9.295774647887324,
      linesPerHour: 14.475524475524475,
    },
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  WarehousePickingProductivityDatasetInput,
  WarehousePickingProductivityDatasetOutput
>;
export const warehousePickingProductivityDatasetTool = createModelDefinition<
  WarehousePickingProductivityDatasetInput,
  WarehousePickingProductivityDatasetOutput
>({
  id: "random/warehouse-picking-productivity-dataset",
  title: "Random Warehouse Picking Productivity Dataset Generator",
  description:
    "Generate synthetic shift order counts, integer lines per order, and separate positive picker/packing labor minutes; delegate orders/hour and lines/hour per shift and from aggregate work divided by aggregate hours. Totals are not an unweighted average of shift rates, and no real worker profiles, targets or performance judgments are inferred.",
  inputSchema,
  outputSchema,
  execute: calculateWarehousePickingProductivityDataset,
});
export const runWarehousePickingProductivityDataset =
  warehousePickingProductivityDatasetTool.execute;
export default warehousePickingProductivityDatasetTool;
