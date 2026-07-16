import { defineTool } from "../core/definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../core/result.js";

export type AirDisplacementBodyCompositionInput = {
  readonly bodyMassKg: number;
  readonly correctedBodyVolumeL: number;
  readonly equation?: "brozek" | "siri";
};

export type AirDisplacementBodyCompositionOutput = {
  readonly bodyDensityGPerCm3: number;
  readonly bodyFatPercent: number;
  readonly equation: "brozek" | "siri";
  readonly estimatedFatFreeMassKg: number;
  readonly estimatedFatMassKg: number;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const calculateAirDisplacementBodyComposition = (
  input: unknown,
): ToolResult<AirDisplacementBodyCompositionOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);
  const issues: ToolIssue[] = [];
  for (const field of ["bodyMassKg", "correctedBodyVolumeL"] as const) {
    const value = input[field];
    if (typeof value !== "number" || !Number.isFinite(value) || value <= 0)
      issues.push({
        code: "positive_finite_number_required",
        field,
        message: `${field} must be a finite number greater than zero.`,
      });
  }
  if (
    input.equation !== undefined &&
    input.equation !== "brozek" &&
    input.equation !== "siri"
  )
    issues.push({
      code: "supported_equation_required",
      field: "equation",
      message: "equation must be siri or brozek.",
    });
  for (const field of Object.keys(input))
    if (
      field !== "bodyMassKg" &&
      field !== "correctedBodyVolumeL" &&
      field !== "equation"
    )
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });
  if (issues.length > 0) return invalidInput(issues);

  const bodyMassKg = input.bodyMassKg as number;
  const correctedBodyVolumeL = input.correctedBodyVolumeL as number;
  const equation = (input.equation ?? "siri") as "brozek" | "siri";
  const bodyDensityGPerCm3 = bodyMassKg / correctedBodyVolumeL;
  const bodyFatPercent =
    equation === "siri"
      ? 495 / bodyDensityGPerCm3 - 450
      : 457 / bodyDensityGPerCm3 - 414.2;
  const estimatedFatMassKg = bodyMassKg * (bodyFatPercent / 100);
  return toolSuccess({
    bodyDensityGPerCm3,
    bodyFatPercent,
    equation,
    estimatedFatFreeMassKg: bodyMassKg - estimatedFatMassKg,
    estimatedFatMassKg,
  });
};

export const airDisplacementBodyCompositionTool = defineTool<
  AirDisplacementBodyCompositionInput,
  AirDisplacementBodyCompositionOutput
>({
  contractVersion: 1,
  description:
    "Calculate density and estimated body composition from body mass and a corrected body volume measured by air-displacement equipment.",
  discovery: {
    aliases: ["air displacement plethysmography", "Bod Pod calculator"],
    collections: ["data", "learn"],
    fields: ["body composition", "health"],
    keywords: [
      "air displacement",
      "body density",
      "body fat",
      "plethysmography",
    ],
  },
  execute: calculateAirDisplacementBodyComposition,
  execution: { kind: "pure" },
  id: "air-displacement-body-composition",
  inputSchema: {
    additionalProperties: false,
    properties: {
      bodyMassKg: { exclusiveMinimum: 0, type: "number" },
      correctedBodyVolumeL: { exclusiveMinimum: 0, type: "number" },
      equation: { enum: ["brozek", "siri"], type: "string" },
    },
    required: ["bodyMassKg", "correctedBodyVolumeL"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: {
      bodyDensityGPerCm3: { exclusiveMinimum: 0, type: "number" },
      bodyFatPercent: { type: "number" },
      equation: { enum: ["brozek", "siri"], type: "string" },
      estimatedFatFreeMassKg: { type: "number" },
      estimatedFatMassKg: { type: "number" },
    },
    required: [
      "bodyDensityGPerCm3",
      "bodyFatPercent",
      "equation",
      "estimatedFatFreeMassKg",
      "estimatedFatMassKg",
    ],
    type: "object",
  },
  ports: {
    inputs: [
      {
        id: "bodyMassKg",
        label: "Body mass",
        required: true,
        valueType: { format: "mass", type: "number", unit: "kg" },
      },
      {
        id: "correctedBodyVolumeL",
        label: "Corrected measured body volume",
        required: true,
        valueType: { format: "body-volume", type: "number", unit: "L" },
      },
      {
        id: "equation",
        label: "Conversion equation",
        required: false,
        valueType: { format: "body-fat-equation", type: "string" },
      },
    ],
    outputs: [
      {
        id: "bodyFatPercent",
        label: "Estimated body fat",
        valueType: { format: "percentage", type: "number", unit: "%" },
      },
      {
        id: "estimatedFatMassKg",
        label: "Estimated fat mass",
        valueType: { format: "mass", type: "number", unit: "kg" },
      },
      {
        id: "estimatedFatFreeMassKg",
        label: "Estimated fat-free mass",
        valueType: { format: "mass", type: "number", unit: "kg" },
      },
    ],
  },
  title: "Air-Displacement Body Composition Calculator",
});

export default airDisplacementBodyCompositionTool;
