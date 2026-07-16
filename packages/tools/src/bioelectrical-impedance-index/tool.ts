import { defineTool } from "../core/definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../core/result.js";

export type BioelectricalImpedanceIndexInput = {
  readonly heightCm: number;
  readonly resistanceOhms: number;
};

export type BioelectricalImpedanceIndexOutput = {
  readonly impedanceIndexCm2PerOhm: number;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const calculateBioelectricalImpedanceIndex = (
  input: unknown,
): ToolResult<BioelectricalImpedanceIndexOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);
  const issues: ToolIssue[] = [];
  for (const field of ["heightCm", "resistanceOhms"] as const) {
    const value = input[field];
    if (typeof value !== "number" || !Number.isFinite(value) || value <= 0)
      issues.push({
        code: "positive_finite_number_required",
        field,
        message: `${field} must be a finite number greater than zero.`,
      });
  }
  for (const field of Object.keys(input))
    if (field !== "heightCm" && field !== "resistanceOhms")
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });
  if (issues.length > 0) return invalidInput(issues);

  const heightCm = input.heightCm as number;
  const resistanceOhms = input.resistanceOhms as number;
  return toolSuccess({
    impedanceIndexCm2PerOhm: (heightCm * heightCm) / resistanceOhms,
  });
};

export const bioelectricalImpedanceIndexTool = defineTool<
  BioelectricalImpedanceIndexInput,
  BioelectricalImpedanceIndexOutput
>({
  contractVersion: 1,
  description:
    "Calculate height squared divided by measured electrical resistance; this is an impedance index, not a body-fat estimate.",
  discovery: {
    aliases: ["BIA index", "bioimpedance index"],
    collections: ["data", "learn"],
    fields: ["body composition", "health"],
    keywords: ["BIA", "bioelectrical impedance", "resistance"],
  },
  execute: calculateBioelectricalImpedanceIndex,
  execution: { kind: "pure" },
  id: "bioelectrical-impedance-index",
  inputSchema: {
    additionalProperties: false,
    properties: {
      heightCm: { exclusiveMinimum: 0, type: "number" },
      resistanceOhms: { exclusiveMinimum: 0, type: "number" },
    },
    required: ["heightCm", "resistanceOhms"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: {
      impedanceIndexCm2PerOhm: { exclusiveMinimum: 0, type: "number" },
    },
    required: ["impedanceIndexCm2PerOhm"],
    type: "object",
  },
  ports: {
    inputs: [
      {
        id: "heightCm",
        label: "Height",
        required: true,
        valueType: { format: "length", type: "number", unit: "cm" },
      },
      {
        id: "resistanceOhms",
        label: "Measured resistance",
        required: true,
        valueType: {
          format: "electrical-resistance",
          type: "number",
          unit: "ohm",
        },
      },
    ],
    outputs: [
      {
        id: "impedanceIndexCm2PerOhm",
        label: "Impedance index",
        valueType: {
          format: "bioelectrical-impedance-index",
          type: "number",
          unit: "cm2/ohm",
        },
      },
    ],
  },
  title: "Bioelectrical Impedance Index Calculator",
});

export default bioelectricalImpedanceIndexTool;
