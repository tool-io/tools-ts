import { defineTool } from "../core/definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../core/result.js";

export type DxaBodyCompositionSummaryInput = {
  readonly boneMineralContentKg: number;
  readonly fatMassKg: number;
  readonly leanMassKg: number;
};

export type DxaBodyCompositionSummaryOutput = {
  readonly boneMineralContentPercent: number;
  readonly fatMassPercent: number;
  readonly leanMassPercent: number;
  readonly totalMeasuredMassKg: number;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const calculateDxaBodyCompositionSummary = (
  input: unknown,
): ToolResult<DxaBodyCompositionSummaryOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);
  const supportedFields = [
    "boneMineralContentKg",
    "fatMassKg",
    "leanMassKg",
  ] as const;
  const issues: ToolIssue[] = [];
  for (const field of supportedFields) {
    const value = input[field];
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0)
      issues.push({
        code: "nonnegative_finite_number_required",
        field,
        message: `${field} must be a nonnegative finite number.`,
      });
  }
  for (const field of Object.keys(input))
    if (!supportedFields.includes(field as (typeof supportedFields)[number]))
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });
  if (issues.length > 0) return invalidInput(issues);

  const boneMineralContentKg = input.boneMineralContentKg as number;
  const fatMassKg = input.fatMassKg as number;
  const leanMassKg = input.leanMassKg as number;
  const totalMeasuredMassKg = boneMineralContentKg + fatMassKg + leanMassKg;
  if (totalMeasuredMassKg === 0)
    return invalidInput([
      {
        code: "positive_total_required",
        field: "fatMassKg",
        message:
          "The measured component masses must have a total greater than zero.",
      },
    ]);
  return toolSuccess({
    boneMineralContentPercent:
      (boneMineralContentKg / totalMeasuredMassKg) * 100,
    fatMassPercent: (fatMassKg / totalMeasuredMassKg) * 100,
    leanMassPercent: (leanMassKg / totalMeasuredMassKg) * 100,
    totalMeasuredMassKg,
  });
};

export const dxaBodyCompositionSummaryTool = defineTool<
  DxaBodyCompositionSummaryInput,
  DxaBodyCompositionSummaryOutput
>({
  contractVersion: 1,
  description:
    "Summarize fat mass, lean mass, and bone mineral content copied from a DXA body-composition report.",
  discovery: {
    aliases: ["DEXA body composition", "DXA report summary"],
    collections: ["data", "learn"],
    fields: ["body composition", "health"],
    keywords: ["bone mineral content", "DXA", "fat mass", "lean mass"],
  },
  execute: calculateDxaBodyCompositionSummary,
  execution: { kind: "pure" },
  id: "dxa-body-composition-summary",
  inputSchema: {
    additionalProperties: false,
    properties: {
      boneMineralContentKg: { minimum: 0, type: "number" },
      fatMassKg: { minimum: 0, type: "number" },
      leanMassKg: { minimum: 0, type: "number" },
    },
    required: ["boneMineralContentKg", "fatMassKg", "leanMassKg"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: {
      boneMineralContentPercent: { type: "number" },
      fatMassPercent: { type: "number" },
      leanMassPercent: { type: "number" },
      totalMeasuredMassKg: { exclusiveMinimum: 0, type: "number" },
    },
    required: [
      "boneMineralContentPercent",
      "fatMassPercent",
      "leanMassPercent",
      "totalMeasuredMassKg",
    ],
    type: "object",
  },
  ports: {
    inputs: [
      {
        id: "fatMassKg",
        label: "DXA fat mass",
        required: true,
        valueType: { format: "mass", type: "number", unit: "kg" },
      },
      {
        id: "leanMassKg",
        label: "DXA lean mass",
        required: true,
        valueType: { format: "mass", type: "number", unit: "kg" },
      },
      {
        id: "boneMineralContentKg",
        label: "DXA bone mineral content",
        required: true,
        valueType: { format: "mass", type: "number", unit: "kg" },
      },
    ],
    outputs: [
      {
        id: "fatMassPercent",
        label: "Fat mass",
        valueType: { format: "percentage", type: "number", unit: "%" },
      },
      {
        id: "leanMassPercent",
        label: "Lean mass",
        valueType: { format: "percentage", type: "number", unit: "%" },
      },
      {
        id: "boneMineralContentPercent",
        label: "Bone mineral content",
        valueType: { format: "percentage", type: "number", unit: "%" },
      },
    ],
  },
  title: "DXA Body Composition Summary",
});

export default dxaBodyCompositionSummaryTool;
