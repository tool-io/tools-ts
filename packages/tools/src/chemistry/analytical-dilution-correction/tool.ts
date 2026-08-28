import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type AnalyticalDilutionCorrectionInput = {
  readonly aliquotVolumeMl: number;
  readonly finalVolumeMl: number;
  readonly measuredConcentrationMgPerL: number;
};

export type AnalyticalDilutionCorrectionOutput = {
  readonly originalConcentrationMgPerL: number;
};

export const analyticalDilutionCorrectionExample = {
  input: {
    aliquotVolumeMl: 10,
    finalVolumeMl: 100,
    measuredConcentrationMgPerL: 2,
  },
  output: { originalConcentrationMgPerL: 20 },
} satisfies ToolExample<
  AnalyticalDilutionCorrectionInput,
  AnalyticalDilutionCorrectionOutput
>;

export const analyticalDilutionCorrectionInputSchema = {
  additionalProperties: false,
  properties: {
    aliquotVolumeMl: {
      description: "Aliquot volume used for dilution in millilitres.",
      exclusiveMinimum: 0,
      type: "number",
    },
    finalVolumeMl: {
      description: "Final diluted volume in millilitres.",
      exclusiveMinimum: 0,
      type: "number",
    },
    measuredConcentrationMgPerL: {
      description: "Measured concentration after dilution in mg/L.",
      minimum: 0,
      type: "number",
    },
  },
  required: ["aliquotVolumeMl", "finalVolumeMl", "measuredConcentrationMgPerL"],
  type: "object",
} as const;

export const analyticalDilutionCorrectionOutputSchema = {
  additionalProperties: false,
  properties: {
    originalConcentrationMgPerL: {
      description: "Concentration before dilution in mg/L.",
      minimum: 0,
      type: "number",
    },
  },
  required: ["originalConcentrationMgPerL"],
  type: "object",
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const nonnegativeFiniteIssue = (value: unknown): ToolIssue | undefined =>
  typeof value === "number" && Number.isFinite(value) && value >= 0
    ? undefined
    : {
        code: "nonnegative_finite_number_required",
        field: "measuredConcentrationMgPerL",
        message:
          "measuredConcentrationMgPerL must be a finite number greater than or equal to zero.",
      };

const positiveFiniteIssue = (
  field: "aliquotVolumeMl" | "finalVolumeMl",
  value: unknown,
): ToolIssue | undefined =>
  typeof value === "number" && Number.isFinite(value) && value > 0
    ? undefined
    : {
        code: "positive_finite_number_required",
        field,
        message: `${field} must be a finite number greater than zero.`,
      };

export const calculateAnalyticalDilutionCorrection = (
  input: unknown,
): ToolResult<AnalyticalDilutionCorrectionOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues = [
    positiveFiniteIssue("aliquotVolumeMl", input.aliquotVolumeMl),
    positiveFiniteIssue("finalVolumeMl", input.finalVolumeMl),
    nonnegativeFiniteIssue(input.measuredConcentrationMgPerL),
    ...Object.keys(input)
      .filter(
        (field) =>
          field !== "aliquotVolumeMl" &&
          field !== "finalVolumeMl" &&
          field !== "measuredConcentrationMgPerL",
      )
      .map<ToolIssue>((field) => ({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      })),
  ].filter((issue): issue is ToolIssue => issue !== undefined);

  if (issues.length > 0) return invalidInput(issues);

  const aliquot = input.aliquotVolumeMl as number;
  const finalVolume = input.finalVolumeMl as number;
  if (finalVolume < aliquot)
    return invalidInput([
      {
        code: "final_volume_below_aliquot",
        field: "finalVolumeMl",
        message:
          "finalVolumeMl must be greater than or equal to aliquotVolumeMl.",
      },
    ]);

  const originalConcentrationMgPerL =
    ((input.measuredConcentrationMgPerL as number) * finalVolume) / aliquot;
  if (
    !Number.isFinite(originalConcentrationMgPerL) ||
    originalConcentrationMgPerL < 0
  )
    return invalidInput([
      {
        code: "invalid_output",
        field: "originalConcentrationMgPerL",
        message:
          "Original concentration could not be calculated as a finite nonnegative number.",
      },
    ]);

  return toolSuccess({ originalConcentrationMgPerL });
};

export const analyticalDilutionCorrectionTool = defineTool<
  AnalyticalDilutionCorrectionInput,
  AnalyticalDilutionCorrectionOutput
>({
  contractVersion: 1,
  description:
    "Correct a diluted analytical concentration using the aliquot and final solution volumes.",
  discovery: {
    aliases: ["dilution correction", "original concentration from dilution"],
    collections: ["chemistry", "analytical chemistry"],
    fields: ["dilution", "concentration correction", "sample preparation"],
    keywords: [
      "aliquot",
      "final volume",
      "measured concentration",
      "dilution factor",
    ],
  },
  execute: calculateAnalyticalDilutionCorrection,
  execution: { kind: "pure" },
  id: "chemistry/analytical-dilution-correction",
  inputSchema: analyticalDilutionCorrectionInputSchema,
  outputSchema: analyticalDilutionCorrectionOutputSchema,
  ports: {
    inputs: [
      {
        id: "aliquotVolumeMl",
        label: "Aliquot volume",
        required: true,
        valueType: { format: "volume", type: "number", unit: "mL" },
      },
      {
        id: "finalVolumeMl",
        label: "Final volume",
        required: true,
        valueType: { format: "volume", type: "number", unit: "mL" },
      },
      {
        id: "measuredConcentrationMgPerL",
        label: "Measured concentration",
        required: true,
        valueType: { format: "concentration", type: "number", unit: "mg/L" },
      },
    ],
    outputs: [
      {
        id: "originalConcentrationMgPerL",
        label: "Original concentration",
        valueType: { format: "concentration", type: "number", unit: "mg/L" },
      },
    ],
  },
  title: "Analytical Dilution Correction Calculator",
});

export default analyticalDilutionCorrectionTool;
