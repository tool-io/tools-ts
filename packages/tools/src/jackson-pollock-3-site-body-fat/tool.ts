import { defineTool } from "../core/definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../core/result.js";

export type JacksonPollock3SiteBodyFatInput = {
  readonly ageYears: number;
  readonly sex: "female" | "male";
  readonly skinfoldsMm: readonly [number, number, number];
};

export type JacksonPollock3SiteBodyFatOutput = {
  readonly bodyDensityGPerCm3: number;
  readonly bodyFatPercent: number;
  readonly skinfoldSumMm: number;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const calculateJacksonPollock3SiteBodyFat = (
  input: unknown,
): ToolResult<JacksonPollock3SiteBodyFatOutput> => {
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
      message: "sex must be female or male for this equation.",
    });
  if (
    typeof input.ageYears !== "number" ||
    !Number.isFinite(input.ageYears) ||
    input.ageYears <= 0
  )
    issues.push({
      code: "positive_finite_number_required",
      field: "ageYears",
      message: "ageYears must be a finite number greater than zero.",
    });
  if (
    !Array.isArray(input.skinfoldsMm) ||
    input.skinfoldsMm.length !== 3 ||
    !input.skinfoldsMm.every(
      (value) =>
        typeof value === "number" && Number.isFinite(value) && value > 0,
    )
  )
    issues.push({
      code: "three_positive_skinfolds_required",
      field: "skinfoldsMm",
      message:
        "skinfoldsMm must contain exactly three positive finite measurements.",
    });
  for (const field of Object.keys(input))
    if (field !== "ageYears" && field !== "sex" && field !== "skinfoldsMm")
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });
  if (issues.length > 0) return invalidInput(issues);

  const ageYears = input.ageYears as number;
  const sex = input.sex as JacksonPollock3SiteBodyFatInput["sex"];
  const skinfoldSumMm = (input.skinfoldsMm as number[]).reduce(
    (total, value) => total + value,
    0,
  );
  const bodyDensityGPerCm3 =
    sex === "male"
      ? 1.10938 -
        0.0008267 * skinfoldSumMm +
        0.0000016 * skinfoldSumMm ** 2 -
        0.0002574 * ageYears
      : 1.0994921 -
        0.0009929 * skinfoldSumMm +
        0.0000023 * skinfoldSumMm ** 2 -
        0.0001392 * ageYears;
  if (!Number.isFinite(bodyDensityGPerCm3) || bodyDensityGPerCm3 <= 0)
    return invalidInput([
      {
        code: "equation_out_of_range",
        field: "skinfoldsMm",
        message: "These measurements produce an invalid body-density estimate.",
      },
    ]);
  return toolSuccess({
    bodyDensityGPerCm3,
    bodyFatPercent: 495 / bodyDensityGPerCm3 - 450,
    skinfoldSumMm,
  });
};

export const jacksonPollock3SiteBodyFatTool = defineTool<
  JacksonPollock3SiteBodyFatInput,
  JacksonPollock3SiteBodyFatOutput
>({
  contractVersion: 1,
  description:
    "Estimate body density and body-fat percentage from the sex-specific Jackson–Pollock three-site skinfold equation and Siri conversion.",
  discovery: {
    aliases: ["3-site skinfold", "skinfold body fat"],
    collections: ["data", "learn"],
    fields: ["body composition", "health"],
    keywords: ["body fat", "Jackson Pollock", "skinfold"],
  },
  execute: calculateJacksonPollock3SiteBodyFat,
  execution: { kind: "pure" },
  id: "jackson-pollock-3-site-body-fat",
  inputSchema: {
    additionalProperties: false,
    properties: {
      ageYears: { exclusiveMinimum: 0, type: "number" },
      sex: { enum: ["female", "male"], type: "string" },
      skinfoldsMm: {
        items: { exclusiveMinimum: 0, type: "number" },
        maxItems: 3,
        minItems: 3,
        type: "array",
      },
    },
    required: ["ageYears", "sex", "skinfoldsMm"],
    type: "object",
  },
  outputSchema: {
    additionalProperties: false,
    properties: {
      bodyDensityGPerCm3: { exclusiveMinimum: 0, type: "number" },
      bodyFatPercent: { type: "number" },
      skinfoldSumMm: { exclusiveMinimum: 0, type: "number" },
    },
    required: ["bodyDensityGPerCm3", "bodyFatPercent", "skinfoldSumMm"],
    type: "object",
  },
  ports: {
    inputs: [
      {
        id: "sex",
        label: "Sex used by the equation",
        required: true,
        valueType: { format: "biological-sex", type: "string" },
      },
      {
        id: "ageYears",
        label: "Age",
        required: true,
        valueType: { format: "age", type: "number", unit: "year" },
      },
      {
        id: "skinfoldsMm",
        label: "Three protocol-specific skinfold measurements",
        required: true,
        valueType: {
          format: "skinfold-measurements",
          items: { format: "length", type: "number", unit: "mm" },
          type: "list",
        },
      },
    ],
    outputs: [
      {
        id: "bodyFatPercent",
        label: "Estimated body fat",
        valueType: { format: "percentage", type: "number", unit: "%" },
      },
      {
        id: "bodyDensityGPerCm3",
        label: "Estimated body density",
        valueType: { format: "body-density", type: "number", unit: "g/cm3" },
      },
    ],
  },
  title: "Jackson–Pollock 3-Site Body Fat Calculator",
});

export default jacksonPollock3SiteBodyFatTool;
