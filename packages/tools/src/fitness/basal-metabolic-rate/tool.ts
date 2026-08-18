import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type BasalMetabolicRateInput = {
  readonly ageYears: number;
  readonly heightCm: number;
  readonly sex: "female" | "male";
  readonly weightKg: number;
};

export type BasalMetabolicRateOutput = {
  readonly caloriesPerDay: number;
};

export const basalMetabolicRateInputSchema = {
  additionalProperties: false,
  properties: {
    ageYears: {
      description: "Age in years.",
      maximum: 120,
      minimum: 2,
      type: "integer",
    },
    heightCm: {
      description: "Height in centimeters.",
      exclusiveMinimum: 0,
      type: "number",
    },
    sex: {
      description: "Sex used by the Mifflin-St Jeor equation.",
      enum: ["female", "male"],
      type: "string",
    },
    weightKg: {
      description: "Weight in kilograms.",
      exclusiveMinimum: 0,
      type: "number",
    },
  },
  required: ["sex", "ageYears", "weightKg", "heightCm"],
  type: "object",
} as const;

export const basalMetabolicRateOutputSchema = {
  additionalProperties: false,
  properties: {
    caloriesPerDay: {
      description: "Basal metabolic rate in kilocalories per day.",
      exclusiveMinimum: 0,
      type: "number",
    },
  },
  required: ["caloriesPerDay"],
  type: "object",
} as const;

export const basalMetabolicRateExample = {
  input: { ageYears: 30, heightCm: 180, sex: "male", weightKg: 70 },
  output: { caloriesPerDay: 1680 },
} satisfies ToolExample<BasalMetabolicRateInput, BasalMetabolicRateOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const isBasalMetabolicRateOutput = (
  value: unknown,
): value is BasalMetabolicRateOutput =>
  isRecord(value) &&
  typeof value.caloriesPerDay === "number" &&
  Number.isFinite(value.caloriesPerDay);

export const calculateBasalMetabolicRate = (
  input: unknown,
): ToolResult<BasalMetabolicRateOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const knownFields = new Set([
    "ageYears",
    "heightCm",
    "sex",
    "weightKg",
  ]);
  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (!knownFields.has(field))
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  const sex = input.sex;
  if (sex !== undefined && sex !== "male" && sex !== "female")
    issues.push({
      code: "sex_invalid",
      field: "sex",
      message: "sex must be male or female.",
    });

  for (const [field, code] of [
    ["ageYears", "age_years"],
    ["weightKg", "weight_kg"],
    ["heightCm", "height_cm"],
  ] as const)
    if (input[field] === undefined)
      issues.push({
        code: `${code}_required`,
        field,
        message: `${field} is required.`,
      });
    else if (
      typeof input[field] !== "number" ||
      !Number.isFinite(input[field]) ||
      (input[field] as number) <= 0
    )
      issues.push({
        code: `${code}_invalid`,
        field,
        message: `${field} must be a positive finite number.`,
      });

  const ageYears = input.ageYears;
  if (
    ageYears !== undefined &&
    typeof ageYears === "number" &&
    Number.isFinite(ageYears)
  ) {
    if (!Number.isSafeInteger(ageYears))
      issues.push({
        code: "age_years_invalid",
        field: "ageYears",
        message: "ageYears must be an integer.",
      });
    else if ((ageYears as number) < 2 || (ageYears as number) > 120)
      issues.push({
        code: "age_years_out_of_range",
        field: "ageYears",
        message: "ageYears must be between 2 and 120.",
      });
  }

  if (issues.length > 0) return invalidInput(issues);

  const weightKg = input.weightKg as number;
  const heightCm = input.heightCm as number;
  const caloriesPerDay =
    10 * weightKg +
    6.25 * heightCm -
    5 * (ageYears as number) +
    (sex === "male" ? 5 : -161);
  return toolSuccess({ caloriesPerDay });
};

export const basalMetabolicRateTool = defineTool<
  BasalMetabolicRateInput,
  BasalMetabolicRateOutput
>({
  contractVersion: 1,
  description:
    "Estimate daily resting energy expenditure with the Mifflin-St Jeor equation.",
  discovery: {
    aliases: ["bmr-calculator", "resting-metabolic-rate"],
    keywords: ["bmr", "calories", "metabolism", "nutrition"],
  },
  execute: calculateBasalMetabolicRate,
  execution: { kind: "pure" },
  id: "fitness/basal-metabolic-rate",
  inputSchema: basalMetabolicRateInputSchema,
  outputSchema: basalMetabolicRateOutputSchema,
  ports: {
    inputs: [
      {
        description: "Age in years.",
        id: "ageYears",
        label: "Age",
        required: true,
        valueType: { format: "duration", type: "integer", unit: "years" },
      },
      {
        description: "Height in centimeters.",
        id: "heightCm",
        label: "Height",
        required: true,
        valueType: { format: "length", type: "number", unit: "cm" },
      },
      {
        description: "Weight in kilograms.",
        id: "weightKg",
        label: "Weight",
        required: true,
        valueType: { format: "mass", type: "number", unit: "kg" },
      },
      {
        description: "Sex used by the equation.",
        id: "sex",
        label: "Sex",
        required: true,
        valueType: { format: "sex", type: "string" },
      },
    ],
    outputs: [
      {
        description: "Resting energy expenditure per day.",
        id: "caloriesPerDay",
        label: "Calories per day",
        valueType: { format: "energy-rate", type: "number", unit: "kcal/day" },
      },
    ],
  },
  title: "Basal Metabolic Rate",
});

export const runBasalMetabolicRate = basalMetabolicRateTool.execute;
export default basalMetabolicRateTool;
