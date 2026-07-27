import { defineTool } from "../core/definition.js";
import type { ToolExample } from "../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../core/result.js";

export type BodyRoundnessIndexInput = {
  readonly heightCm: number;
  readonly waistCm: number;
};

export type BodyRoundnessIndexOutput = {
  readonly bodyRoundnessIndex: number;
};

export const bodyRoundnessIndexExample = {
  input: {
    heightCm: 180,
    waistCm: 70,
  },
} satisfies ToolExample<BodyRoundnessIndexInput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const calculateBodyRoundnessIndex = (
  input: unknown,
): ToolResult<BodyRoundnessIndexOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues: ToolIssue[] = [];
  for (const field of ["heightCm", "waistCm"] as const) {
    const value = input[field];
    if (typeof value !== "number" || !Number.isFinite(value) || value <= 0)
      issues.push({
        code: "positive_finite_number_required",
        field,
        message: `${field} must be a finite number greater than zero.`,
      });
  }
  for (const field of Object.keys(input))
    if (field !== "heightCm" && field !== "waistCm")
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });
  if (issues.length > 0) return invalidInput(issues);

  const heightCm = input.heightCm as number;
  const waistCm = input.waistCm as number;
  const ratio = waistCm / (Math.PI * heightCm);
  if (ratio > 1)
    return invalidInput([
      {
        code: "outside_real_domain",
        field: "waistCm",
        message:
          "Waist circumference must not exceed pi times height for a real-valued result.",
      },
    ]);

  const bodyRoundnessIndex = 364.2 - 365.5 * Math.sqrt(1 - ratio ** 2);
  if (!Number.isFinite(bodyRoundnessIndex))
    return invalidInput([
      {
        code: "invalid_output",
        field: "bodyRoundnessIndex",
        message: "Body roundness index could not be calculated.",
      },
    ]);

  return toolSuccess({ bodyRoundnessIndex });
};

export const bodyRoundnessIndexTool = defineTool<
  BodyRoundnessIndexInput,
  BodyRoundnessIndexOutput
>({
  contractVersion: 1,
  description:
    "Calculate body roundness index from waist circumference and height measured in the same unit.",
  discovery: {
    aliases: ["BRI", "body roundness calculator"],
    collections: ["data", "learn"],
    fields: ["body measurements", "health"],
    keywords: ["anthropometry", "body shape", "height", "waist"],
  },
  execute: calculateBodyRoundnessIndex,
  execution: { kind: "pure" },
  id: "body-roundness-index",
  inputSchema: {
    additionalProperties: false,
    properties: {
      heightCm: { exclusiveMinimum: 0, type: "number" },
      waistCm: { exclusiveMinimum: 0, type: "number" },
    },
    required: ["waistCm", "heightCm"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: {
      bodyRoundnessIndex: { type: "number" },
    },
    required: ["bodyRoundnessIndex"],
    type: "object",
  },
  ports: {
    inputs: [
      {
        description: "Waist circumference measured in centimeters.",
        id: "waistCm",
        label: "Waist circumference",
        required: true,
        valueType: { format: "length", type: "number", unit: "cm" },
      },
      {
        description: "Standing height measured in centimeters.",
        id: "heightCm",
        label: "Height",
        required: true,
        valueType: { format: "length", type: "number", unit: "cm" },
      },
    ],
    outputs: [
      {
        description: "The calculated dimensionless body roundness index.",
        id: "bodyRoundnessIndex",
        label: "Body roundness index",
        valueType: { format: "body-roundness-index", type: "number" },
      },
    ],
  },
  title: "Body Roundness Index Calculator",
});

export default bodyRoundnessIndexTool;
