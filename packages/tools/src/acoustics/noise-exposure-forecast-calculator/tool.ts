import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { matchesToolJsonSchema } from "../../core/contract.js";
import { SimpleToolError, simpleError } from "../../core/simple.js";

export type NefLegacyMethod = "us-nef";

export type NefNoiseExposureForecastLegacyMethodLookupInput = Readonly<{
  readonly daytimeOperations: number;
  readonly effectivePerceivedNoiseLevelDecibels: number;
  readonly method: NefLegacyMethod;
  readonly nighttimeOperations: number;
}>;

export type NefNoiseExposureForecastLegacyMethodLookupOutput = Readonly<{
  readonly caveat: string;
  readonly daytimeOperations: number;
  readonly formula: string;
  readonly method: NefLegacyMethod;
  readonly nefDecibels: number;
  readonly nightPenaltyDecibels: number;
  readonly nightWeightingFactor: number;
  readonly nighttimeOperations: number;
  readonly sourceNote: string;
  readonly weightedOperationTerm: number;
}>;

export const nefNoiseExposureForecastLegacyMethodLookupInputSchema = {
  additionalProperties: false,
  properties: {
    daytimeOperations: {
      description:
        "Average number of daytime operations in the legacy planning scenario, not a modern annual average.",
      minimum: 0,
      type: "number",
    },
    effectivePerceivedNoiseLevelDecibels: {
      description:
        "Energy-averaged effective perceived noise level for the supplied event set, in EPNdB.",
      type: "number",
    },
    method: {
      description: "Legacy NEF method variant.",
      enum: ["us-nef"],
      type: "string",
    },
    nighttimeOperations: {
      description:
        "Average number of nighttime operations in the legacy planning scenario.",
      minimum: 0,
      type: "number",
    },
  },
  required: [
    "daytimeOperations",
    "effectivePerceivedNoiseLevelDecibels",
    "method",
    "nighttimeOperations",
  ],
  type: "object",
} satisfies ToolJsonSchema;

export const nefNoiseExposureForecastLegacyMethodLookupOutputSchema = {
  additionalProperties: false,
  properties: {
    caveat: {
      description:
        "Limitations of the legacy metric and the supplied event aggregation.",
      type: "string",
    },
    daytimeOperations: { minimum: 0, type: "number" },
    formula: { type: "string" },
    method: { enum: ["us-nef"], type: "string" },
    nefDecibels: { type: "number" },
    nightPenaltyDecibels: { type: "number" },
    nightWeightingFactor: { type: "number" },
    nighttimeOperations: { minimum: 0, type: "number" },
    sourceNote: { type: "string" },
    weightedOperationTerm: { minimum: 0, type: "number" },
  },
  required: [
    "caveat",
    "daytimeOperations",
    "formula",
    "method",
    "nefDecibels",
    "nightPenaltyDecibels",
    "nightWeightingFactor",
    "nighttimeOperations",
    "sourceNote",
    "weightedOperationTerm",
  ],
  type: "object",
} satisfies ToolJsonSchema;

const formula = "NEF = EPNL + 10 log10(ND + 16.7 NN) - 88";
const sourceNote =
  "Legacy NEF method described by Bishop and Horonjeff; FAA and Canadian sources now use DNL for most current airport studies.";
const caveat =
  "NEF is a legacy perceived-noise metric, not DNL. The input EPNL must already be energy-averaged over the represented event set, and the operation counts, flight paths, aircraft mix, and planning-day assumptions must be documented.";

const assertInput = (
  value: unknown,
): NefNoiseExposureForecastLegacyMethodLookupInput => {
  if (
    !matchesToolJsonSchema(
      value,
      nefNoiseExposureForecastLegacyMethodLookupInputSchema,
    )
  )
    simpleError(
      "input",
      "Input does not match the NEF lookup schema.",
      "schema_invalid",
    );
  return value as NefNoiseExposureForecastLegacyMethodLookupInput;
};

export const calculateNefNoiseExposureForecastLegacyMethodLookup = (
  input: NefNoiseExposureForecastLegacyMethodLookupInput,
): NefNoiseExposureForecastLegacyMethodLookupOutput => {
  if (!Number.isFinite(input.effectivePerceivedNoiseLevelDecibels))
    simpleError(
      "effectivePerceivedNoiseLevelDecibels",
      "Provide a finite EPNL in decibels.",
      "invalid_epnl",
    );
  if (
    !Number.isFinite(input.daytimeOperations) ||
    !Number.isFinite(input.nighttimeOperations) ||
    input.daytimeOperations < 0 ||
    input.nighttimeOperations < 0
  )
    simpleError(
      "daytimeOperations",
      "Provide finite nonnegative daytime and nighttime operation counts.",
      "invalid_operation_count",
    );
  const weightedOperationTerm =
    input.daytimeOperations + 16.7 * input.nighttimeOperations;
  if (!(weightedOperationTerm > 0))
    simpleError(
      "daytimeOperations",
      "At least one daytime or nighttime operation is required.",
      "empty_operation_set",
    );
  const nefDecibels =
    input.effectivePerceivedNoiseLevelDecibels +
    10 * Math.log10(weightedOperationTerm) -
    88;
  const nightPenaltyDecibels = 10 * Math.log10(16.7);
  if (!Number.isFinite(nefDecibels) || !Number.isFinite(nightPenaltyDecibels))
    simpleError(
      "nefDecibels",
      "Inputs produce an undefined or out-of-range result.",
      "calculation_failed",
    );
  return {
    caveat,
    daytimeOperations: input.daytimeOperations,
    formula,
    method: input.method,
    nefDecibels,
    nightPenaltyDecibels,
    nightWeightingFactor: 16.7,
    nighttimeOperations: input.nighttimeOperations,
    sourceNote,
    weightedOperationTerm,
  };
};

const execute = (
  input: unknown,
): ToolResult<NefNoiseExposureForecastLegacyMethodLookupOutput> => {
  try {
    return toolSuccess(
      calculateNefNoiseExposureForecastLegacyMethodLookup(assertInput(input)),
    );
  } catch (error) {
    if (error instanceof SimpleToolError)
      return invalidInput([
        { code: error.code, field: error.field, message: error.message },
      ]);
    return invalidInput([
      {
        code: "calculation_failed",
        field: "",
        message: "The NEF calculation could not be completed.",
      },
    ]);
  }
};

export const example = {
  input: {
    daytimeOperations: 10,
    effectivePerceivedNoiseLevelDecibels: 100,
    method: "us-nef",
    nighttimeOperations: 1,
  },
  output: {
    caveat,
    daytimeOperations: 10,
    formula,
    method: "us-nef",
    nefDecibels: 26.265112613645755,
    nightPenaltyDecibels: 12.227164711475833,
    nightWeightingFactor: 16.7,
    nighttimeOperations: 1,
    sourceNote,
    weightedOperationTerm: 26.7,
  },
} satisfies ToolExample<
  NefNoiseExposureForecastLegacyMethodLookupInput,
  NefNoiseExposureForecastLegacyMethodLookupOutput
>;

export const nefNoiseExposureForecastLegacyMethodLookupTool = defineTool<
  NefNoiseExposureForecastLegacyMethodLookupInput,
  NefNoiseExposureForecastLegacyMethodLookupOutput
>({
  contractVersion: 1,
  description:
    "Calculate the legacy U.S. Noise Exposure Forecast from an energy-averaged EPNL and caller-supplied daytime and nighttime operation counts, with the historical 16.7 night weighting and an 88 dB offset.",
  execute,
  execution: { kind: "pure" },
  id: "acoustics/noise-exposure-forecast-calculator",
  inputSchema: nefNoiseExposureForecastLegacyMethodLookupInputSchema,
  outputSchema: nefNoiseExposureForecastLegacyMethodLookupOutputSchema,
  ports: {
    inputs: [
      {
        id: "daytimeOperations",
        label: "Daytime operations",
        required: true,
        valueType: { type: "number", format: "aircraft-operations/day" },
      },
      {
        id: "effectivePerceivedNoiseLevelDecibels",
        label: "Energy-averaged EPNL",
        required: true,
        valueType: { type: "number", format: "epnl", unit: "EPNdB" },
      },
      {
        id: "method",
        label: "Legacy method",
        required: true,
        valueType: { type: "string", format: "nef-method" },
      },
      {
        id: "nighttimeOperations",
        label: "Nighttime operations",
        required: true,
        valueType: { type: "number", format: "aircraft-operations/day" },
      },
    ],
    outputs: [
      {
        id: "nefDecibels",
        label: "NEF",
        valueType: { type: "number", format: "nef", unit: "NEF" },
      },
      {
        id: "weightedOperationTerm",
        label: "Weighted operation term",
        valueType: { type: "number", format: "weighted-operation-count" },
      },
    ],
  },
  title: "Noise Exposure Forecast Calculator",
});

export const runNefNoiseExposureForecastLegacyMethodLookup =
  nefNoiseExposureForecastLegacyMethodLookupTool.execute;

export default nefNoiseExposureForecastLegacyMethodLookupTool;
