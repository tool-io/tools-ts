import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type AcidityInput = {
  readonly baseNormalityEqPerL: number;
  readonly baseVolumeMl: number;
  readonly sampleVolumeMl: number;
};

export type AcidityOutput = {
  readonly acidityMgPerLAsCaCO3: number;
};

export const acidityExample = {
  input: { baseNormalityEqPerL: 0.02, baseVolumeMl: 5, sampleVolumeMl: 100 },
  output: { acidityMgPerLAsCaCO3: 50 },
} satisfies ToolExample<AcidityInput, AcidityOutput>;

export const acidityInputSchema = {
  additionalProperties: false,
  properties: {
    baseNormalityEqPerL: {
      description: "Standard base normality in equivalents per litre.",
      exclusiveMinimum: 0,
      type: "number",
    },
    baseVolumeMl: {
      description: "Base titrant volume in millilitres.",
      minimum: 0,
      type: "number",
    },
    sampleVolumeMl: {
      description: "Sample volume in millilitres.",
      exclusiveMinimum: 0,
      type: "number",
    },
  },
  required: ["baseNormalityEqPerL", "baseVolumeMl", "sampleVolumeMl"],
  type: "object",
} as const;

export const acidityOutputSchema = {
  additionalProperties: false,
  properties: {
    acidityMgPerLAsCaCO3: {
      description: "Acidity expressed as mg/L CaCO3.",
      minimum: 0,
      type: "number",
    },
  },
  required: ["acidityMgPerLAsCaCO3"],
  type: "object",
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const nonnegativeFiniteIssue = (value: unknown): ToolIssue | undefined =>
  typeof value === "number" && Number.isFinite(value) && value >= 0
    ? undefined
    : {
        code: "nonnegative_finite_number_required",
        field: "baseVolumeMl",
        message:
          "baseVolumeMl must be a finite number greater than or equal to zero.",
      };

const positiveFiniteIssue = (
  field: "baseNormalityEqPerL" | "sampleVolumeMl",
  value: unknown,
): ToolIssue | undefined =>
  typeof value === "number" && Number.isFinite(value) && value > 0
    ? undefined
    : {
        code: "positive_finite_number_required",
        field,
        message: `${field} must be a finite number greater than zero.`,
      };

export const calculateAcidity = (input: unknown): ToolResult<AcidityOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues = [
    positiveFiniteIssue("baseNormalityEqPerL", input.baseNormalityEqPerL),
    nonnegativeFiniteIssue(input.baseVolumeMl),
    positiveFiniteIssue("sampleVolumeMl", input.sampleVolumeMl),
    ...Object.keys(input)
      .filter(
        (field) =>
          field !== "baseNormalityEqPerL" &&
          field !== "baseVolumeMl" &&
          field !== "sampleVolumeMl",
      )
      .map<ToolIssue>((field) => ({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      })),
  ].filter((issue): issue is ToolIssue => issue !== undefined);

  if (issues.length > 0) return invalidInput(issues);

  const acidityMgPerLAsCaCO3 =
    ((input.baseVolumeMl as number) *
      (input.baseNormalityEqPerL as number) *
      50_000) /
    (input.sampleVolumeMl as number);
  if (!Number.isFinite(acidityMgPerLAsCaCO3) || acidityMgPerLAsCaCO3 < 0)
    return invalidInput([
      {
        code: "invalid_output",
        field: "acidityMgPerLAsCaCO3",
        message:
          "Acidity could not be calculated as a finite nonnegative number.",
      },
    ]);

  return toolSuccess({ acidityMgPerLAsCaCO3 });
};

export const acidityTool = defineTool<AcidityInput, AcidityOutput>({
  contractVersion: 1,
  description:
    "Calculate acidity as calcium carbonate equivalent from base titrant volume, normality, and sample volume.",
  discovery: {
    aliases: ["acidity as CaCO3", "water acidity"],
    collections: ["chemistry", "environmental chemistry"],
    fields: ["water quality", "acid-base titration", "acidity"],
    keywords: ["acidity", "CaCO3", "base normality", "titration"],
  },
  execute: calculateAcidity,
  execution: { kind: "pure" },
  id: "chemistry/environmental-acidity",
  inputSchema: acidityInputSchema,
  outputSchema: acidityOutputSchema,
  ports: {
    inputs: [
      {
        id: "baseNormalityEqPerL",
        label: "Base normality",
        required: true,
        valueType: {
          format: "equivalent-concentration",
          type: "number",
          unit: "eq/L",
        },
      },
      {
        id: "baseVolumeMl",
        label: "Base volume",
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
        id: "acidityMgPerLAsCaCO3",
        label: "Acidity as CaCO3",
        valueType: {
          format: "concentration",
          type: "number",
          unit: "mg/L as CaCO3",
        },
      },
    ],
  },
  title: "Acidity Calculator",
});

export default acidityTool;
