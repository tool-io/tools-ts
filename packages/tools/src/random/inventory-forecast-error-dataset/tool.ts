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
  calculateWmapeForecastAccuracyLogistics,
  type WmapeForecastAccuracyLogisticsOutput,
} from "../../logistics/wmape-forecast-accuracy-logistics/tool.js";
import { runMeanAbsoluteError } from "../../metrics/mean-absolute-error/tool.js";
import {
  orderedInstanceRange,
  nonnegativeInstanceIntegerSchema,
} from "../optimization-instance-integers.js";

export type ForecastErrorPattern = "additive" | "multiplicative" | "perfect";
export type InventoryForecastErrorDatasetInput = {
  readonly minimumActual: number;
  readonly maximumActual: number;
  readonly patterns: readonly ForecastErrorPattern[];
  readonly minimumDelta: number;
  readonly maximumDelta: number;
  readonly factors: readonly number[];
  readonly count: number;
  readonly seed?: number;
};
export type InventoryForecastErrorDatasetOutput = {
  readonly rows: readonly {
    readonly index: number;
    readonly pattern: ForecastErrorPattern;
    readonly parameter: number | null;
    readonly actualUnits: number;
    readonly rawForecast: number;
    readonly forecastUnits: number;
    readonly clampedAtZero: boolean;
  }[];
  readonly meanAbsoluteError: number;
  readonly wmape: WmapeForecastAccuracyLogisticsOutput | null;
  readonly wmapeUndefinedReason: "zero-actual-demand" | null;
  readonly randomness: GeneratorReplay;
};
const patterns = ["additive", "multiplicative", "perfect"] as const,
  signedSchema = {
    type: "integer",
    minimum: -Number.MAX_SAFE_INTEGER,
    maximum: Number.MAX_SAFE_INTEGER,
  } as const,
  nonnegative = { type: "number", minimum: 0 } as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minimumActual: nonnegativeInstanceIntegerSchema,
    maximumActual: nonnegativeInstanceIntegerSchema,
    patterns: {
      type: "array",
      minItems: 1,
      maxItems: 3,
      items: { type: "string", enum: patterns },
    },
    minimumDelta: signedSchema,
    maximumDelta: signedSchema,
    factors: { type: "array", minItems: 1, maxItems: 32, items: nonnegative },
    count: { type: "integer", minimum: 1, maximum: 128 },
    seed: generatorSeedSchema,
  },
  required: [
    "minimumActual",
    "maximumActual",
    "patterns",
    "minimumDelta",
    "maximumDelta",
    "factors",
    "count",
  ],
} as const;
const wmapeSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    absoluteErrorTotal: nonnegative,
    actualTotal: { type: "number", exclusiveMinimum: 0 },
    biasPercent: { type: "number" },
    wmapePercent: nonnegative,
  },
  required: [
    "absoluteErrorTotal",
    "actualTotal",
    "biasPercent",
    "wmapePercent",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rows: {
      type: "array",
      minItems: 1,
      maxItems: 128,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          index: { type: "integer", minimum: 1, maximum: 128 },
          pattern: { type: "string", enum: patterns },
          parameter: { anyOf: [{ type: "number" }, { type: "null" }] },
          actualUnits: nonnegativeInstanceIntegerSchema,
          rawForecast: { type: "number" },
          forecastUnits: nonnegative,
          clampedAtZero: { type: "boolean" },
        },
        required: [
          "index",
          "pattern",
          "parameter",
          "actualUnits",
          "rawForecast",
          "forecastUnits",
          "clampedAtZero",
        ],
      },
    },
    meanAbsoluteError: nonnegative,
    wmape: { anyOf: [wmapeSchema, { type: "null" }] },
    wmapeUndefinedReason: {
      anyOf: [
        { type: "string", const: "zero-actual-demand" },
        { type: "null" },
      ],
    },
    randomness: generatorReplaySchema,
  },
  required: [
    "rows",
    "meanAbsoluteError",
    "wmape",
    "wmapeUndefinedReason",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is InventoryForecastErrorDatasetInput =>
  matchesModelInput(input, inputSchema);
export const calculateInventoryForecastErrorDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<InventoryForecastErrorDatasetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (new Set(input.patterns).size !== input.patterns.length)
      simpleError("patterns", "Entries must be distinct.", "duplicate_entries");
    orderedInstanceRange(
      input.minimumActual,
      input.maximumActual,
      "maximumActual",
    );
    orderedInstanceRange(
      input.minimumDelta,
      input.maximumDelta,
      "maximumDelta",
    );
    const random = createGeneratorRandom(input.seed, context),
      rows = Array.from({ length: input.count }, (_, i) => {
        const actualUnits = random.integer(
            input.minimumActual,
            input.maximumActual,
          ),
          pattern = random.pick(input.patterns);
        let parameter: number | null = null,
          rawForecast = actualUnits;
        if (pattern === "additive") {
          const delta = random.integer(input.minimumDelta, input.maximumDelta);
          parameter = delta;
          const sum = BigInt(actualUnits) + BigInt(delta);
          if (
            sum < -BigInt(Number.MAX_SAFE_INTEGER) ||
            sum > BigInt(Number.MAX_SAFE_INTEGER)
          )
            simpleError(
              "maximumDelta",
              "Additive forecasts must remain exact safe integers before clamping.",
              "forecast_overflow",
            );
          rawForecast = Number(sum);
        } else if (pattern === "multiplicative") {
          const factor = random.pick(input.factors);
          parameter = factor;
          rawForecast = actualUnits * factor;
        }
        if (!Number.isFinite(rawForecast))
          simpleError(
            "factors",
            "Generated forecast exceeds the finite numeric domain.",
            "forecast_overflow",
          );
        const forecastUnits = Math.max(0, rawForecast);
        return {
          index: i + 1,
          pattern,
          parameter,
          actualUnits,
          rawForecast: rawForecast === 0 ? 0 : rawForecast,
          forecastUnits,
          clampedAtZero: rawForecast < 0,
        };
      });
    const actual = rows.map((row) => row.actualUnits),
      predicted = rows.map((row) => row.forecastUnits),
      mae = runMeanAbsoluteError({ actual, predicted });
    if (!mae.ok)
      return simpleError(
        "factors",
        "Absolute-error arithmetic exceeds the finite numeric domain.",
        "metric_overflow",
      );
    const hasDemand = actual.some((value) => value > 0),
      wmape = hasDemand
        ? calculateWmapeForecastAccuracyLogistics({
            actualUnits: actual,
            forecastUnits: predicted,
          })
        : null;
    return toolSuccess({
      rows,
      meanAbsoluteError: mae.output.meanAbsoluteError,
      wmape,
      wmapeUndefinedReason: hasDemand ? null : ("zero-actual-demand" as const),
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const inventoryForecastErrorDatasetExample = {
  input: {
    minimumActual: 0,
    maximumActual: 10,
    patterns: ["additive", "multiplicative", "perfect"],
    minimumDelta: -4,
    maximumDelta: 4,
    factors: [0.5, 1.5],
    count: 5,
    seed: 42,
  },
  output: {
    rows: [
      {
        index: 1,
        pattern: "multiplicative",
        parameter: 1.5,
        actualUnits: 6,
        rawForecast: 9,
        forecastUnits: 9,
        clampedAtZero: false,
      },
      {
        index: 2,
        pattern: "additive",
        parameter: 0,
        actualUnits: 7,
        rawForecast: 7,
        forecastUnits: 7,
        clampedAtZero: false,
      },
      {
        index: 3,
        pattern: "multiplicative",
        parameter: 1.5,
        actualUnits: 3,
        rawForecast: 4.5,
        forecastUnits: 4.5,
        clampedAtZero: false,
      },
      {
        index: 4,
        pattern: "additive",
        parameter: 3,
        actualUnits: 5,
        rawForecast: 8,
        forecastUnits: 8,
        clampedAtZero: false,
      },
      {
        index: 5,
        pattern: "additive",
        parameter: -3,
        actualUnits: 8,
        rawForecast: 5,
        forecastUnits: 5,
        clampedAtZero: false,
      },
    ],
    meanAbsoluteError: 2.1,
    wmape: {
      absoluteErrorTotal: 10.5,
      actualTotal: 29,
      biasPercent: 15.517241379310345,
      wmapePercent: 36.206896551724135,
    },
    wmapeUndefinedReason: null,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  InventoryForecastErrorDatasetInput,
  InventoryForecastErrorDatasetOutput
>;
export const inventoryForecastErrorDatasetTool = createModelDefinition<
  InventoryForecastErrorDatasetInput,
  InventoryForecastErrorDatasetOutput
>({
  id: "random/inventory-forecast-error-dataset",
  title: "Random Inventory Forecast Error Dataset Generator",
  description:
    "Construct nonnegative synthetic demand with selected perfect, signed-additive or multiplicative forecast patterns, retain parameters and zero-clamping, and delegate MAE plus logistics WMAPE/bias. All-zero actual demand makes WMAPE explicitly undefined, not zero; outputs preserve existing floating arithmetic and are controlled fixtures rather than forecast-quality guarantees.",
  inputSchema,
  outputSchema,
  execute: calculateInventoryForecastErrorDataset,
});
export const runInventoryForecastErrorDataset =
  inventoryForecastErrorDatasetTool.execute;
export default inventoryForecastErrorDatasetTool;
