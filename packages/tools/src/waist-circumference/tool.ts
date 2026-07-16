import { defineTool } from "../core/definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../core/result.js";

export type WaistCircumferenceInput = {
  readonly sex: "female" | "male";
  readonly waistCm: number;
};

export type WaistCircumferenceOutput = {
  readonly atOrAboveIncreasedRiskThreshold: boolean;
  readonly classification:
    "at_or_above_increased_risk_threshold" | "below_increased_risk_threshold";
  readonly guideline: "NIDDK_US_ADULT";
  readonly thresholdCm: number;
  readonly waistCm: number;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const checkWaistCircumference = (
  input: unknown,
): ToolResult<WaistCircumferenceOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues: ToolIssue[] = [];
  if (input.sex !== "female" && input.sex !== "male")
    issues.push({
      code: "supported_sex_required",
      field: "sex",
      message: "sex must be female or male for this guideline.",
    });
  if (
    typeof input.waistCm !== "number" ||
    !Number.isFinite(input.waistCm) ||
    input.waistCm <= 0
  )
    issues.push({
      code: "positive_finite_number_required",
      field: "waistCm",
      message: "waistCm must be a finite number greater than zero.",
    });
  for (const field of Object.keys(input))
    if (field !== "sex" && field !== "waistCm")
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });
  if (issues.length > 0) return invalidInput(issues);

  const sex = input.sex as WaistCircumferenceInput["sex"];
  const waistCm = input.waistCm as number;
  const thresholdCm = sex === "female" ? 88.9 : 101.6;
  const atOrAboveIncreasedRiskThreshold = waistCm >= thresholdCm;
  return toolSuccess({
    atOrAboveIncreasedRiskThreshold,
    classification: atOrAboveIncreasedRiskThreshold
      ? "at_or_above_increased_risk_threshold"
      : "below_increased_risk_threshold",
    guideline: "NIDDK_US_ADULT",
    thresholdCm,
    waistCm,
  });
};

export const waistCircumferenceTool = defineTool<
  WaistCircumferenceInput,
  WaistCircumferenceOutput
>({
  contractVersion: 1,
  description:
    "Compare an adult waist measurement with the sex-specific NIDDK US screening threshold.",
  discovery: {
    aliases: ["waist measurement", "waist size risk"],
    collections: ["data", "learn"],
    fields: ["health", "body measurements"],
    keywords: ["abdominal", "circumference", "screening", "waist"],
  },
  execute: checkWaistCircumference,
  execution: { kind: "pure" },
  id: "waist-circumference",
  inputSchema: {
    additionalProperties: false,
    properties: {
      sex: { enum: ["female", "male"], type: "string" },
      waistCm: { exclusiveMinimum: 0, type: "number" },
    },
    required: ["sex", "waistCm"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: {
      atOrAboveIncreasedRiskThreshold: { type: "boolean" },
      classification: {
        enum: [
          "at_or_above_increased_risk_threshold",
          "below_increased_risk_threshold",
        ],
        type: "string",
      },
      guideline: { const: "NIDDK_US_ADULT", type: "string" },
      thresholdCm: { exclusiveMinimum: 0, type: "number" },
      waistCm: { exclusiveMinimum: 0, type: "number" },
    },
    required: [
      "atOrAboveIncreasedRiskThreshold",
      "classification",
      "guideline",
      "thresholdCm",
      "waistCm",
    ],
    type: "object",
  },
  ports: {
    inputs: [
      {
        id: "sex",
        label: "Sex used by the guideline",
        required: true,
        valueType: { format: "biological-sex", type: "string" },
      },
      {
        id: "waistCm",
        label: "Waist circumference",
        required: true,
        valueType: { format: "length", type: "number", unit: "cm" },
      },
    ],
    outputs: [
      {
        id: "classification",
        label: "Screening classification",
        valueType: { format: "waist-risk-classification", type: "string" },
      },
      {
        id: "thresholdCm",
        label: "Guideline threshold",
        valueType: { format: "length", type: "number", unit: "cm" },
      },
    ],
  },
  title: "Waist Circumference Risk Checker",
});

export default waistCircumferenceTool;
