import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type ActivityLevel =
  | "active"
  | "lightly-active"
  | "sedentary"
  | "very-active"
  | "very-lightly-active";

export type TotalDailyEnergyExpenditureInput = {
  readonly activityLevel: ActivityLevel;
  readonly basalMetabolicRate: number;
};

export type TotalDailyEnergyExpenditureOutput = {
  readonly caloriesPerDay: number;
};

const MULTIPLIERS: Readonly<Record<ActivityLevel, number>> = {
  active: 1.725,
  "lightly-active": 1.375,
  sedentary: 1.2,
  "very-active": 1.9,
  "very-lightly-active": 1.55,
};

export const totalDailyEnergyExpenditureInputSchema = {
  additionalProperties: false,
  properties: {
    activityLevel: {
      description: "Weekly activity pattern used to scale the BMR.",
      enum: [
        "active",
        "lightly-active",
        "sedentary",
        "very-active",
        "very-lightly-active",
      ],
      type: "string",
    },
    basalMetabolicRate: {
      description: "Basal metabolic rate in kilocalories per day.",
      exclusiveMinimum: 0,
      type: "number",
    },
  },
  required: ["activityLevel", "basalMetabolicRate"],
  type: "object",
} as const;

export const totalDailyEnergyExpenditureOutputSchema = {
  additionalProperties: false,
  properties: {
    caloriesPerDay: {
      description: "Estimated maintenance calories per day.",
      exclusiveMinimum: 0,
      type: "number",
    },
  },
  required: ["caloriesPerDay"],
  type: "object",
} as const;

export const totalDailyEnergyExpenditureExample = {
  input: { activityLevel: "lightly-active", basalMetabolicRate: 1680 },
  output: { caloriesPerDay: 2310 },
} satisfies ToolExample<
  TotalDailyEnergyExpenditureInput,
  TotalDailyEnergyExpenditureOutput
>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const isTotalDailyEnergyExpenditureOutput = (
  value: unknown,
): value is TotalDailyEnergyExpenditureOutput =>
  isRecord(value) &&
  typeof value.caloriesPerDay === "number" &&
  Number.isFinite(value.caloriesPerDay);

export const calculateTotalDailyEnergyExpenditure = (
  input: unknown,
): ToolResult<TotalDailyEnergyExpenditureOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (field !== "activityLevel" && field !== "basalMetabolicRate")
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  const level = input.activityLevel as ActivityLevel | undefined;
  if (level === undefined)
    return invalidInput([
      ...issues,
      {
        code: "activity_level_required",
        field: "activityLevel",
        message: "activityLevel is required.",
      },
    ]);
  if (!(level in MULTIPLIERS))
    return invalidInput([
      ...issues,
      {
        code: "activity_level_invalid",
        field: "activityLevel",
        message: "activityLevel must be a supported activity level.",
      },
    ]);

  const bmr = input.basalMetabolicRate;
  if (bmr === undefined)
    return invalidInput([
      ...issues,
      {
        code: "basal_metabolic_rate_required",
        field: "basalMetabolicRate",
        message: "basalMetabolicRate is required.",
      },
    ]);
  if (
    typeof bmr !== "number" ||
    !Number.isFinite(bmr) ||
    bmr <= 0
  )
    return invalidInput([
      ...issues,
      {
        code: "basal_metabolic_rate_invalid",
        field: "basalMetabolicRate",
        message:
          "basalMetabolicRate must be a positive finite number.",
      },
    ]);
  if (issues.length > 0) return invalidInput(issues);

  return toolSuccess({
    caloriesPerDay: bmr * MULTIPLIERS[level],
  });
};

export const totalDailyEnergyExpenditureTool = defineTool<
  TotalDailyEnergyExpenditureInput,
  TotalDailyEnergyExpenditureOutput
>({
  contractVersion: 1,
  description:
    "Scale a basal metabolic rate into daily maintenance calories by activity level.",
  discovery: {
    aliases: ["tdee-calculator", "maintenance-calories"],
    keywords: ["calories", "energy", "metabolism", "tdee"],
  },
  execute: calculateTotalDailyEnergyExpenditure,
  execution: { kind: "pure" },
  id: "fitness/total-daily-energy-expenditure",
  inputSchema: totalDailyEnergyExpenditureInputSchema,
  outputSchema: totalDailyEnergyExpenditureOutputSchema,
  ports: {
    inputs: [
      {
        description: "Basal metabolic rate in kilocalories per day.",
        id: "basalMetabolicRate",
        label: "Basal metabolic rate",
        required: true,
        valueType: {
          format: "energy-rate",
          type: "number",
          unit: "kcal/day",
        },
      },
      {
        description: "Weekly activity pattern.",
        id: "activityLevel",
        label: "Activity level",
        required: true,
        valueType: { format: "activity-level", type: "string" },
      },
    ],
    outputs: [
      {
        description: "Estimated maintenance calories per day.",
        id: "caloriesPerDay",
        label: "Maintenance calories",
        valueType: {
          format: "energy-rate",
          type: "number",
          unit: "kcal/day",
        },
      },
    ],
  },
  title: "Total Daily Energy Expenditure",
});

export const runTotalDailyEnergyExpenditure =
  totalDailyEnergyExpenditureTool.execute;
export default totalDailyEnergyExpenditureTool;
