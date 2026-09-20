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
  calculateCartonsPerPalletTiHiCalculator,
  type CartonsPerPalletTiHiCalculatorOutput,
} from "../../logistics/cartons-per-pallet-ti-hi-calculator/tool.js";
import {
  calculatePalletLoadHeightWithBaseTotal,
  type PalletLoadHeightWithBaseTotalOutput,
} from "../../logistics/pallet-load-height-with-base-total/tool.js";
import {
  calculatePalletLoadedWeightTotal,
  type PalletLoadedWeightTotalOutput,
} from "../../logistics/pallet-loaded-weight-total/tool.js";
import { SimpleToolError } from "../../core/simple.js";
import {
  orderedInstanceRange,
  positiveInstanceIntegerSchema,
} from "../optimization-instance-integers.js";

export type PalletIntegerRange = {
  readonly minimum: number;
  readonly maximum: number;
};
export type PalletPackingMeasurementDatasetInput = {
  readonly pallet: {
    readonly lengthCm: number;
    readonly widthCm: number;
    readonly usableStackHeightCm: number;
    readonly baseHeightCm: number;
    readonly tareWeightKg: number;
  };
  readonly cartonLength: PalletIntegerRange;
  readonly cartonWidth: PalletIntegerRange;
  readonly cartonHeight: PalletIntegerRange;
  readonly cartonWeightGrams: PalletIntegerRange;
  readonly count: number;
  readonly seed?: number;
};
export type PalletPackingMeasurementDatasetOutput = {
  readonly cases: readonly {
    readonly carton: {
      readonly lengthCm: number;
      readonly widthCm: number;
      readonly heightCm: number;
      readonly weightGrams: number;
    };
    readonly capacity: CartonsPerPalletTiHiCalculatorOutput | null;
    readonly height: PalletLoadHeightWithBaseTotalOutput | null;
    readonly weight: PalletLoadedWeightTotalOutput | null;
    readonly error: {
      readonly field: string;
      readonly code: string;
      readonly message: string;
    } | null;
  }[];
  readonly randomness: GeneratorReplay;
};
const positive = { type: "number", exclusiveMinimum: 0 } as const,
  nonnegative = { type: "number", minimum: 0 } as const,
  rangeSchema = {
    type: "object",
    additionalProperties: false,
    properties: {
      minimum: positiveInstanceIntegerSchema,
      maximum: positiveInstanceIntegerSchema,
    },
    required: ["minimum", "maximum"],
  } as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pallet: {
      type: "object",
      additionalProperties: false,
      properties: {
        lengthCm: positive,
        widthCm: positive,
        usableStackHeightCm: positive,
        baseHeightCm: nonnegative,
        tareWeightKg: nonnegative,
      },
      required: [
        "lengthCm",
        "widthCm",
        "usableStackHeightCm",
        "baseHeightCm",
        "tareWeightKg",
      ],
    },
    cartonLength: rangeSchema,
    cartonWidth: rangeSchema,
    cartonHeight: rangeSchema,
    cartonWeightGrams: rangeSchema,
    count: { type: "integer", minimum: 1, maximum: 64 },
    seed: generatorSeedSchema,
  },
  required: [
    "pallet",
    "cartonLength",
    "cartonWidth",
    "cartonHeight",
    "cartonWeightGrams",
    "count",
  ],
} as const;
const capacitySchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tiCartonsPerLayer: positiveInstanceIntegerSchema,
    hiLayers: positiveInstanceIntegerSchema,
    totalCartonsPerPallet: positiveInstanceIntegerSchema,
    chosenOrientation: {
      type: "string",
      enum: ["cartonLengthAlongPalletLength", "cartonLengthAlongPalletWidth"],
    },
  },
  required: [
    "tiCartonsPerLayer",
    "hiLayers",
    "totalCartonsPerPallet",
    "chosenOrientation",
  ],
} as const;
const heightSchema = {
  type: "object",
  additionalProperties: false,
  properties: { loadHeightAboveDeckCm: positive, totalStackHeightCm: positive },
  required: ["loadHeightAboveDeckCm", "totalStackHeightCm"],
} as const;
const weightSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cargoNetWeightKg: positive, totalGrossWeightKg: positive },
  required: ["cargoNetWeightKg", "totalGrossWeightKg"],
} as const;
const issueSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    field: { type: "string" },
    code: { type: "string" },
    message: { type: "string" },
  },
  required: ["field", "code", "message"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cases: {
      type: "array",
      minItems: 1,
      maxItems: 64,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          carton: {
            type: "object",
            additionalProperties: false,
            properties: {
              lengthCm: positiveInstanceIntegerSchema,
              widthCm: positiveInstanceIntegerSchema,
              heightCm: positiveInstanceIntegerSchema,
              weightGrams: positiveInstanceIntegerSchema,
            },
            required: ["lengthCm", "widthCm", "heightCm", "weightGrams"],
          },
          capacity: { anyOf: [capacitySchema, { type: "null" }] },
          height: { anyOf: [heightSchema, { type: "null" }] },
          weight: { anyOf: [weightSchema, { type: "null" }] },
          error: { anyOf: [issueSchema, { type: "null" }] },
        },
        required: ["carton", "capacity", "height", "weight", "error"],
      },
    },
    randomness: generatorReplaySchema,
  },
  required: ["cases", "randomness"],
} as const;

const isInput = (
  input: unknown,
): input is PalletPackingMeasurementDatasetInput =>
  matchesModelInput(input, inputSchema);
export const calculatePalletPackingMeasurementDataset = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<PalletPackingMeasurementDatasetOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    for (const [field, range] of [
      ["cartonLength", input.cartonLength],
      ["cartonWidth", input.cartonWidth],
      ["cartonHeight", input.cartonHeight],
      ["cartonWeightGrams", input.cartonWeightGrams],
    ] as const)
      orderedInstanceRange(range.minimum, range.maximum, field);
    const random = createGeneratorRandom(input.seed, context),
      draw = (range: PalletIntegerRange): number =>
        random.integer(range.minimum, range.maximum);
    const cases = Array.from(
      { length: input.count },
      (): PalletPackingMeasurementDatasetOutput["cases"][number] => {
        const carton = {
          lengthCm: draw(input.cartonLength),
          widthCm: draw(input.cartonWidth),
          heightCm: draw(input.cartonHeight),
          weightGrams: draw(input.cartonWeightGrams),
        };
        try {
          const capacity = calculateCartonsPerPalletTiHiCalculator({
            palletDeckLengthCm: input.pallet.lengthCm,
            palletDeckWidthCm: input.pallet.widthCm,
            usableStackHeightCm: input.pallet.usableStackHeightCm,
            cartonLengthCm: carton.lengthCm,
            cartonWidthCm: carton.widthCm,
            cartonHeightCm: carton.heightCm,
          });
          const height = calculatePalletLoadHeightWithBaseTotal({
              palletBaseHeightCm: input.pallet.baseHeightCm,
              cartonHeightCm: carton.heightCm,
              layerCount: capacity.hiLayers,
            }),
            weight = calculatePalletLoadedWeightTotal({
              palletTareWeightKg: input.pallet.tareWeightKg,
              cartonCount: capacity.totalCartonsPerPallet,
              weightPerCartonKg: carton.weightGrams / 1000,
            });
          return { carton, capacity, height, weight, error: null };
        } catch (error) {
          if (!(error instanceof SimpleToolError)) throw error;
          return {
            carton,
            capacity: null,
            height: null,
            weight: null,
            error: {
              field: error.field,
              code: error.code,
              message: error.message,
            },
          };
        }
      },
    );
    return toolSuccess({
      cases,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const palletPackingMeasurementDatasetExample = {
  input: {
    pallet: {
      lengthCm: 120,
      widthCm: 100,
      usableStackHeightCm: 180,
      baseHeightCm: 15,
      tareWeightKg: 20,
    },
    cartonLength: {
      minimum: 10,
      maximum: 80,
    },
    cartonWidth: {
      minimum: 10,
      maximum: 70,
    },
    cartonHeight: {
      minimum: 10,
      maximum: 100,
    },
    cartonWeightGrams: {
      minimum: 100,
      maximum: 2000,
    },
    count: 3,
    seed: 42,
  },
  output: {
    cases: [
      {
        carton: {
          lengthCm: 52,
          widthCm: 37,
          heightCm: 87,
          weightGrams: 1373,
        },
        capacity: {
          tiCartonsPerLayer: 4,
          hiLayers: 2,
          totalCartonsPerPallet: 8,
          chosenOrientation: "cartonLengthAlongPalletLength",
        },
        height: {
          loadHeightAboveDeckCm: 174,
          totalStackHeightCm: 189,
        },
        weight: {
          cargoNetWeightKg: 10.984,
          totalGrossWeightKg: 30.984,
        },
        error: null,
      },
      {
        carton: {
          lengthCm: 22,
          widthCm: 42,
          heightCm: 34,
          weightGrams: 1287,
        },
        capacity: {
          tiCartonsPerLayer: 10,
          hiLayers: 5,
          totalCartonsPerPallet: 50,
          chosenOrientation: "cartonLengthAlongPalletLength",
        },
        height: {
          loadHeightAboveDeckCm: 170,
          totalStackHeightCm: 185,
        },
        weight: {
          cargoNetWeightKg: 64.35,
          totalGrossWeightKg: 84.35,
        },
        error: null,
      },
      {
        carton: {
          lengthCm: 71,
          widthCm: 38,
          heightCm: 32,
          weightGrams: 1776,
        },
        capacity: {
          tiCartonsPerLayer: 3,
          hiLayers: 5,
          totalCartonsPerPallet: 15,
          chosenOrientation: "cartonLengthAlongPalletWidth",
        },
        height: {
          loadHeightAboveDeckCm: 160,
          totalStackHeightCm: 175,
        },
        weight: {
          cargoNetWeightKg: 26.64,
          totalGrossWeightKg: 46.64,
        },
        error: null,
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  PalletPackingMeasurementDatasetInput,
  PalletPackingMeasurementDatasetOutput
>;
export const palletPackingMeasurementDatasetTool = createModelDefinition<
  PalletPackingMeasurementDatasetInput,
  PalletPackingMeasurementDatasetOutput
>({
  id: "random/pallet-packing-measurement-dataset",
  title: "Random Pallet Packing Measurement Dataset Generator",
  description:
    "Draw integer carton dimensions in centimeters and masses in grams, delegate the better of two uniform grid pallet orientations and whole-layer capacity, then calculate loaded height and mass. Per-case no-fit and representability errors remain labeled instead of discarded. This excludes mixed-orientation optimization, structural limits, stability, overhang and handling-safety approval.",
  inputSchema,
  outputSchema,
  execute: calculatePalletPackingMeasurementDataset,
});
export const runPalletPackingMeasurementDataset =
  palletPackingMeasurementDatasetTool.execute;
export default palletPackingMeasurementDatasetTool;
