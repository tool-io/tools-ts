import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type AlkalinityInput = {
  readonly acidNormalityEqPerL: number;
  readonly acidVolumeMl: number;
  readonly sampleVolumeMl: number;
};

export type AlkalinityOutput = {
  readonly alkalinityMgPerLAsCaCO3: number;
};

export const alkalinityExample = {
  input: { acidNormalityEqPerL: 0.02, acidVolumeMl: 5, sampleVolumeMl: 100 },
  output: { alkalinityMgPerLAsCaCO3: 50 },
} satisfies ToolExample<AlkalinityInput, AlkalinityOutput>;

export const alkalinityInputSchema = {
  additionalProperties: false,
  properties: {
    acidNormalityEqPerL: {
      description: "Standard acid normality in equivalents per litre.",
      exclusiveMinimum: 0,
      type: "number",
    },
    acidVolumeMl: {
      description: "Acid titrant volume in millilitres.",
      minimum: 0,
      type: "number",
    },
    sampleVolumeMl: {
      description: "Sample volume in millilitres.",
      exclusiveMinimum: 0,
      type: "number",
    },
  },
  required: ["acidNormalityEqPerL", "acidVolumeMl", "sampleVolumeMl"],
  type: "object",
} as const;

export const alkalinityOutputSchema = {
  additionalProperties: false,
  properties: {
    alkalinityMgPerLAsCaCO3: {
      description: "Alkalinity expressed as mg/L CaCO3.",
      minimum: 0,
      type: "number",
    },
  },
  required: ["alkalinityMgPerLAsCaCO3"],
  type: "object",
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const nonnegativeFiniteIssue = (value: unknown): ToolIssue | undefined =>
  typeof value === "number" && Number.isFinite(value) && value >= 0
    ? undefined
    : {
        code: "nonnegative_finite_number_required",
        field: "acidVolumeMl",
        message:
          "acidVolumeMl must be a finite number greater than or equal to zero.",
      };

const positiveFiniteIssue = (
  field: "acidNormalityEqPerL" | "sampleVolumeMl",
  value: unknown,
): ToolIssue | undefined =>
  typeof value === "number" && Number.isFinite(value) && value > 0
    ? undefined
    : {
        code: "positive_finite_number_required",
        field,
        message: `${field} must be a finite number greater than zero.`,
      };

export const calculateAlkalinity = (
  input: unknown,
): ToolResult<AlkalinityOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues = [
    positiveFiniteIssue("acidNormalityEqPerL", input.acidNormalityEqPerL),
    nonnegativeFiniteIssue(input.acidVolumeMl),
    positiveFiniteIssue("sampleVolumeMl", input.sampleVolumeMl),
    ...Object.keys(input)
      .filter(
        (field) =>
          field !== "acidNormalityEqPerL" &&
          field !== "acidVolumeMl" &&
          field !== "sampleVolumeMl",
      )
      .map<ToolIssue>((field) => ({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      })),
  ].filter((issue): issue is ToolIssue => issue !== undefined);

  if (issues.length > 0) return invalidInput(issues);

  const alkalinityMgPerLAsCaCO3 =
    ((input.acidVolumeMl as number) *
      (input.acidNormalityEqPerL as number) *
      50_000) /
    (input.sampleVolumeMl as number);
  if (!Number.isFinite(alkalinityMgPerLAsCaCO3) || alkalinityMgPerLAsCaCO3 < 0)
    return invalidInput([
      {
        code: "invalid_output",
        field: "alkalinityMgPerLAsCaCO3",
        message:
          "Alkalinity could not be calculated as a finite nonnegative number.",
      },
    ]);

  return toolSuccess({ alkalinityMgPerLAsCaCO3 });
};

export const alkalinityTool = defineTool<AlkalinityInput, AlkalinityOutput>({
  contractVersion: 1,
  description:
    "Calculate alkalinity as calcium carbonate equivalent from acid titrant volume, normality, and sample volume.",
  discovery: {
    aliases: ["alkalinity as CaCO3", "water alkalinity"],
    collections: ["chemistry", "environmental chemistry"],
    fields: ["water quality", "acid-base titration", "alkalinity"],
    keywords: ["alkalinity", "CaCO3", "acid normality", "titration"],
  },
  execute: calculateAlkalinity,
  execution: { kind: "pure" },
  id: "chemistry/environmental-alkalinity",
  inputSchema: alkalinityInputSchema,
  outputSchema: alkalinityOutputSchema,
  ports: {
    inputs: [
      {
        id: "acidNormalityEqPerL",
        label: "Acid normality",
        required: true,
        valueType: {
          format: "equivalent-concentration",
          type: "number",
          unit: "eq/L",
        },
      },
      {
        id: "acidVolumeMl",
        label: "Acid volume",
        required: true,
        valueType: { format: "volume", type: "number", unit: "mL" },
      },
      {
        id: "sampleVolumeMl",
        label: "Sample volume",
        required: true,
        valueType: { format: "volume", type: "number", unit: "mL" },
      },
    ],
    outputs: [
      {
        id: "alkalinityMgPerLAsCaCO3",
        label: "Alkalinity as CaCO3",
        valueType: {
          format: "concentration",
          type: "number",
          unit: "mg/L as CaCO3",
        },
      },
    ],
  },
  title: "Alkalinity Calculator",
});

export default alkalinityTool;
