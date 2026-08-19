import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type MacronutrientSplitInput = {
  readonly calories: number;
  readonly carbohydratePercent: number;
  readonly fatPercent: number;
  readonly proteinPercent: number;
};

export type MacronutrientSplitOutput = {
  readonly carbohydrateGrams: number;
  readonly fatGrams: number;
  readonly proteinGrams: number;
};

export const macronutrientSplitInputSchema = {
  additionalProperties: false,
  properties: {
    calories: {
      description: "Daily calories to distribute.",
      exclusiveMinimum: 0,
      type: "number",
    },
    carbohydratePercent: {
      description: "Share of calories from carbohydrates.",
      exclusiveMinimum: 0,
      maximum: 100,
      type: "number",
    },
    fatPercent: {
      description: "Share of calories from fat.",
      exclusiveMinimum: 0,
      maximum: 100,
      type: "number",
    },
    proteinPercent: {
      description: "Share of calories from protein.",
      exclusiveMinimum: 0,
      maximum: 100,
      type: "number",
    },
  },
  required: [
    "calories",
    "proteinPercent",
    "carbohydratePercent",
    "fatPercent",
  ],
  type: "object",
} as const;

export const macronutrientSplitOutputSchema = {
  additionalProperties: false,
  properties: {
    carbohydrateGrams: {
      description: "Carbohydrate grams (4 kcal per gram).",
      minimum: 0,
      type: "number",
    },
    fatGrams: {
      description: "Fat grams (9 kcal per gram).",
      minimum: 0,
      type: "number",
    },
    proteinGrams: {
      description: "Protein grams (4 kcal per gram).",
      minimum: 0,
      type: "number",
    },
  },
  required: ["proteinGrams", "carbohydrateGrams", "fatGrams"],
  type: "object",
} as const;

export const macronutrientSplitExample = {
  input: {
    calories: 2000,
    carbohydratePercent: 50,
    fatPercent: 18,
    proteinPercent: 32,
  },
  output: {
    carbohydrateGrams: 250,
    fatGrams: 40,
    proteinGrams: 160,
  },
} satisfies ToolExample<MacronutrientSplitInput, MacronutrientSplitOutput>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const KCAL_PER_GRAM_PROTEIN = 4;
const KCAL_PER_GRAM_CARB = 4;
const KCAL_PER_GRAM_FAT = 9;

export const isMacronutrientSplitOutput = (
  value: unknown,
): value is MacronutrientSplitOutput =>
  isRecord(value) &&
  typeof value.proteinGrams === "number" &&
  typeof value.fatGrams === "number";

export const calculateMacronutrientSplit = (
  input: unknown,
): ToolResult<MacronutrientSplitOutput> => {
  if (!isRecord(input))
    return invalidInput([
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ]);

  const knownFields = new Set([
    "calories",
    "carbohydratePercent",
    "fatPercent",
    "proteinPercent",
  ]);
  const issues: ToolIssue[] = [];
  for (const field of Object.keys(input))
    if (!knownFields.has(field))
      issues.push({
        code: "unknown_field",
        field,
        message: `${field} is not a supported input field.`,
      });

  for (const [field, value] of [
    ["calories", input.calories],
    ["proteinPercent", input.proteinPercent],
    ["carbohydratePercent", input.carbohydratePercent],
    ["fatPercent", input.fatPercent],
  ] as const)
    if (value === undefined)
      issues.push({
        code: `${field}_required`,
        field,
        message: `${field} is required.`,
      });
    else if (
      typeof value !== "number" ||
      !Number.isFinite(value) ||
      (value as number) <= 0 ||
      (field !== "calories" && (value as number) > 100)
    )
      issues.push({
        code: `${field}_invalid`,
        field,
        message:
          field === "calories"
            ? "calories must be a positive finite number."
            : `${field} must be a percentage between 0 and 100.`,
      });

  if (
    typeof input.calories === "number" &&
    typeof input.proteinPercent === "number" &&
    typeof input.carbohydratePercent === "number" &&
    typeof input.fatPercent === "number"
  ) {
    const total =
      input.proteinPercent + input.carbohydratePercent + input.fatPercent;
    if (Math.round(total) !== 100)
      issues.push({
        code: "percent_sum_invalid",
        field: "fatPercent",
        message: "The three percentages must sum to 100.",
      });
  }
  if (issues.length > 0) return invalidInput(issues);

  const calories = input.calories as number;
  return toolSuccess({
    carbohydrateGrams:
      ((calories * (input.carbohydratePercent as number)) / 100) /
      KCAL_PER_GRAM_CARB,
    fatGrams:
      ((calories * (input.fatPercent as number)) / 100) / KCAL_PER_GRAM_FAT,
    proteinGrams:
      ((calories * (input.proteinPercent as number)) / 100) /
      KCAL_PER_GRAM_PROTEIN,
  });
};

export const macronutrientSplitTool = defineTool<
  MacronutrientSplitInput,
  MacronutrientSplitOutput
>({
  contractVersion: 1,
  description:
    "Convert daily calories into protein, carbohydrate, and fat gram targets by percentage split.",
  discovery: {
    aliases: ["macro-calculator", "macro-split"],
    keywords: ["diet", "macros", "nutrition", "protein"],
  },
  execute: calculateMacronutrientSplit,
  execution: { kind: "pure" },
  id: "nutrition/macronutrient-split",
  inputSchema: macronutrientSplitInputSchema,
  outputSchema: macronutrientSplitOutputSchema,
  ports: {
    inputs: [
      {
        description: "Daily calories to distribute.",
        id: "calories",
        label: "Calories",
        required: true,
        valueType: { format: "energy", type: "number", unit: "kcal" },
      },
      {
        description: "Calorie share from protein.",
        id: "proteinPercent",
        label: "Protein percent",
        required: true,
        valueType: { format: "ratio-percent", type: "number", unit: "%" },
      },
      {
        description: "Calorie share from carbohydrates.",
        id: "carbohydratePercent",
        label: "Carbohydrate percent",
        required: true,
        valueType: { format: "ratio-percent", type: "number", unit: "%" },
      },
      {
        description: "Calorie share from fat.",
        id: "fatPercent",
        label: "Fat percent",
        required: true,
        valueType: { format: "ratio-percent", type: "number", unit: "%" },
      },
    ],
    outputs: [
      {
        description: "Protein grams per day.",
        id: "proteinGrams",
        label: "Protein",
        valueType: { format: "mass", type: "number", unit: "g" },
      },
      {
        description: "Carbohydrate grams per day.",
        id: "carbohydrateGrams",
        label: "Carbohydrates",
        valueType: { format: "mass", type: "number", unit: "g" },
      },
      {
        description: "Fat grams per day.",
        id: "fatGrams",
        label: "Fat",
        valueType: { format: "mass", type: "number", unit: "g" },
      },
    ],
  },
  title: "Macronutrient Split",
});

export const runMacronutrientSplit = macronutrientSplitTool.execute;
export default macronutrientSplitTool;
