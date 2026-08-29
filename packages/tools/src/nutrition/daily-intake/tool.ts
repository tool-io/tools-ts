import { defineTool } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  invalidInput,
  toolSuccess,
  type ToolIssue,
  type ToolResult,
} from "../../core/result.js";

export type DailyIntakeNutrient = {
  readonly amountPer100g: number;
  readonly id: string;
  readonly label: string;
  readonly unit: "g" | "kcal" | "kJ" | "mg" | "ug";
};

export type DailyIntakeFood = {
  readonly grams: number;
  readonly id: string;
  readonly name: string;
  readonly nutrients: readonly DailyIntakeNutrient[];
  readonly selectionId?: string;
};

export type DailyIntakeReferenceValue = {
  readonly amount: number;
  readonly comparison:
    "energy-estimate" | "maximum" | "minimum" | "range" | "target";
  readonly id: string;
  readonly label: string;
  readonly referenceType: string;
  readonly unit: "g" | "kcal" | "kJ" | "mg" | "ug";
  readonly upperAmount?: number;
};

export type DailyIntakeInput = {
  readonly foods: readonly DailyIntakeFood[];
  readonly referenceProfileId?: string;
  readonly referenceValues?: readonly DailyIntakeReferenceValue[];
};

export type DailyIntakeOutput = {
  readonly foodCount: number;
  readonly nutrients: readonly {
    readonly complete: boolean;
    readonly contributions: readonly {
      readonly amount: number;
      readonly foodId: string;
      readonly foodName: string;
      readonly selectionId: string;
    }[];
    readonly id: string;
    readonly label: string;
    readonly reference?: {
      readonly amount: number;
      readonly comparison: DailyIntakeReferenceValue["comparison"];
      readonly percentage: number;
      readonly referenceType: string;
      readonly upperAmount?: number;
      readonly upperPercentage?: number;
    };
    readonly total: number;
    readonly unit: DailyIntakeNutrient["unit"];
  }[];
  readonly referenceProfileId?: string;
  readonly totalGrams: number;
};

const nutrientSchema = {
  additionalProperties: false,
  properties: {
    amountPer100g: { minimum: 0, type: "number" },
    id: { minLength: 1, type: "string" },
    label: { minLength: 1, type: "string" },
    unit: { enum: ["g", "kcal", "kJ", "mg", "ug"] },
  },
  required: ["amountPer100g", "id", "label", "unit"],
  type: "object",
} as const;

export const dailyIntakeInputSchema = {
  additionalProperties: false,
  properties: {
    foods: {
      items: {
        additionalProperties: false,
        properties: {
          grams: { exclusiveMinimum: 0, type: "number" },
          id: { minLength: 1, type: "string" },
          name: { minLength: 1, type: "string" },
          nutrients: { items: nutrientSchema, type: "array" },
          selectionId: { minLength: 1, type: "string" },
        },
        required: ["grams", "id", "name", "nutrients"],
        type: "object",
      },
      minItems: 1,
      type: "array",
    },
    referenceProfileId: { minLength: 1, type: "string" },
    referenceValues: {
      items: {
        additionalProperties: false,
        properties: {
          amount: { exclusiveMinimum: 0, type: "number" },
          comparison: {
            enum: ["energy-estimate", "maximum", "minimum", "range", "target"],
          },
          id: { minLength: 1, type: "string" },
          label: { minLength: 1, type: "string" },
          referenceType: { minLength: 1, type: "string" },
          unit: { enum: ["g", "kcal", "kJ", "mg", "ug"] },
          upperAmount: { exclusiveMinimum: 0, type: "number" },
        },
        required: [
          "amount",
          "comparison",
          "id",
          "label",
          "referenceType",
          "unit",
        ],
        type: "object",
      },
      minItems: 1,
      type: "array",
    },
  },
  required: ["foods"],
  type: "object",
} as const;

const contributionSchema = {
  additionalProperties: false,
  properties: {
    amount: { minimum: 0, type: "number" },
    foodId: { minLength: 1, type: "string" },
    foodName: { minLength: 1, type: "string" },
    selectionId: { minLength: 1, type: "string" },
  },
  required: ["amount", "foodId", "foodName", "selectionId"],
  type: "object",
} as const;

export const dailyIntakeOutputSchema = {
  additionalProperties: false,
  properties: {
    foodCount: { minimum: 1, type: "integer" },
    nutrients: {
      items: {
        additionalProperties: false,
        properties: {
          complete: { type: "boolean" },
          contributions: { items: contributionSchema, type: "array" },
          id: { minLength: 1, type: "string" },
          label: { minLength: 1, type: "string" },
          reference: {
            additionalProperties: false,
            properties: {
              amount: { exclusiveMinimum: 0, type: "number" },
              comparison: {
                enum: [
                  "energy-estimate",
                  "maximum",
                  "minimum",
                  "range",
                  "target",
                ],
              },
              percentage: { minimum: 0, type: "number" },
              referenceType: { minLength: 1, type: "string" },
              upperAmount: { exclusiveMinimum: 0, type: "number" },
              upperPercentage: { minimum: 0, type: "number" },
            },
            required: ["amount", "comparison", "percentage", "referenceType"],
            type: "object",
          },
          total: { minimum: 0, type: "number" },
          unit: { enum: ["g", "kcal", "kJ", "mg", "ug"] },
        },
        required: ["complete", "contributions", "id", "label", "total", "unit"],
        type: "object",
      },
      type: "array",
    },
    referenceProfileId: { minLength: 1, type: "string" },
    totalGrams: { exclusiveMinimum: 0, type: "number" },
  },
  required: ["foodCount", "nutrients", "totalGrams"],
  type: "object",
} as const;

const units = new Set(["g", "kcal", "kJ", "mg", "ug"]);
const comparisons = new Set([
  "energy-estimate",
  "maximum",
  "minimum",
  "range",
  "target",
]);
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const isPositiveFinite = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value > 0;
const isNonnegativeFinite = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0;
const isText = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;
const rejectUnknownFields = (
  value: Record<string, unknown>,
  allowed: readonly string[],
  path: string,
  issues: ToolIssue[],
) => {
  for (const field of Object.keys(value))
    if (!allowed.includes(field))
      issues.push({
        code: "unknown_field",
        field: path ? `${path}.${field}` : field,
        message: `${field} is not supported.`,
      });
};

const unitFamily = (unit: string) => {
  if (unit === "g" || unit === "mg" || unit === "ug") return "mass";
  if (unit === "kcal" || unit === "kJ") return "energy";
  return null;
};

const convert = (amount: number, from: string, to: string): number | null => {
  if (from === to) return amount;
  if (unitFamily(from) !== unitFamily(to)) return null;
  if (unitFamily(from) === "mass") {
    const milligrams =
      from === "g" ? amount * 1_000 : from === "ug" ? amount / 1_000 : amount;
    return to === "g"
      ? milligrams / 1_000
      : to === "ug"
        ? milligrams * 1_000
        : milligrams;
  }
  const kilojoules = from === "kcal" ? amount * 4.184 : amount;
  return to === "kcal" ? kilojoules / 4.184 : kilojoules;
};

const validateInput = (input: unknown): ToolIssue[] => {
  if (!isRecord(input))
    return [
      {
        code: "object_required",
        field: "",
        message: "Input must be an object.",
      },
    ];
  const issues: ToolIssue[] = [];
  const nutrientFamilies = new Map<string, string>();
  const registerNutrientUnit = (id: unknown, unit: unknown, field: string) => {
    if (!isText(id) || typeof unit !== "string" || !units.has(unit)) return;
    const family = unitFamily(unit);
    const established = nutrientFamilies.get(id);
    if (established !== undefined && established !== family) {
      issues.push({
        code: "nutrient_unit_incompatible",
        field,
        message: `${id} cannot mix mass and energy units.`,
      });
    } else if (family !== null) {
      nutrientFamilies.set(id, family);
    }
  };
  rejectUnknownFields(
    input,
    ["foods", "referenceProfileId", "referenceValues"],
    "",
    issues,
  );
  if (!Array.isArray(input.foods) || input.foods.length === 0) {
    issues.push({
      code: "foods_required",
      field: "foods",
      message: "At least one food is required.",
    });
  } else {
    const selectionIds = new Set<string>();
    input.foods.forEach((food, foodIndex) => {
      const path = `foods.${foodIndex}`;
      if (!isRecord(food)) {
        issues.push({
          code: "food_invalid",
          field: path,
          message: "Food must be an object.",
        });
        return;
      }
      rejectUnknownFields(
        food,
        ["grams", "id", "name", "nutrients", "selectionId"],
        path,
        issues,
      );
      if (!isText(food.id))
        issues.push({
          code: "food_id_required",
          field: `${path}.id`,
          message: "Food ID is required.",
        });
      const selectionId = isText(food.selectionId)
        ? food.selectionId
        : isText(food.id)
          ? food.id
          : null;
      if (food.selectionId !== undefined && !isText(food.selectionId))
        issues.push({
          code: "selection_id_invalid",
          field: `${path}.selectionId`,
          message: "Selection ID must be nonempty.",
        });
      else if (selectionId !== null && selectionIds.has(selectionId))
        issues.push({
          code: "duplicate_selection",
          field: `${path}.selectionId`,
          message: "Food selection IDs must be unique.",
        });
      else if (selectionId !== null) selectionIds.add(selectionId);
      if (!isText(food.name))
        issues.push({
          code: "food_name_required",
          field: `${path}.name`,
          message: "Food name is required.",
        });
      if (!isPositiveFinite(food.grams))
        issues.push({
          code: "grams_invalid",
          field: `${path}.grams`,
          message: "Food mass must be greater than zero.",
        });
      if (!Array.isArray(food.nutrients)) {
        issues.push({
          code: "nutrients_required",
          field: `${path}.nutrients`,
          message: "Food nutrients must be an array.",
        });
        return;
      }
      const nutrientIds = new Set<string>();
      food.nutrients.forEach((nutrient, nutrientIndex) => {
        const nutrientPath = `${path}.nutrients.${nutrientIndex}`;
        if (!isRecord(nutrient)) {
          issues.push({
            code: "nutrient_invalid",
            field: nutrientPath,
            message: "Nutrient must be an object.",
          });
          return;
        }
        rejectUnknownFields(
          nutrient,
          ["amountPer100g", "id", "label", "unit"],
          nutrientPath,
          issues,
        );
        if (!isText(nutrient.id))
          issues.push({
            code: "nutrient_id_required",
            field: `${nutrientPath}.id`,
            message: "Nutrient ID is required.",
          });
        else if (nutrientIds.has(nutrient.id))
          issues.push({
            code: "duplicate_nutrient",
            field: `${nutrientPath}.id`,
            message: "A food may contain each nutrient only once.",
          });
        else nutrientIds.add(nutrient.id);
        if (!isText(nutrient.label))
          issues.push({
            code: "nutrient_label_required",
            field: `${nutrientPath}.label`,
            message: "Nutrient label is required.",
          });
        if (!isNonnegativeFinite(nutrient.amountPer100g))
          issues.push({
            code: "nutrient_amount_invalid",
            field: `${nutrientPath}.amountPer100g`,
            message: "Nutrient amount must be a nonnegative finite number.",
          });
        if (typeof nutrient.unit !== "string" || !units.has(nutrient.unit))
          issues.push({
            code: "nutrient_unit_invalid",
            field: `${nutrientPath}.unit`,
            message: "Nutrient unit is not supported.",
          });
        registerNutrientUnit(
          nutrient.id,
          nutrient.unit,
          `${nutrientPath}.unit`,
        );
      });
    });
  }
  if (
    input.referenceProfileId !== undefined &&
    !isText(input.referenceProfileId)
  )
    issues.push({
      code: "reference_profile_id_invalid",
      field: "referenceProfileId",
      message: "Reference profile ID must be nonempty.",
    });
  if (
    (input.referenceProfileId === undefined) !==
    (input.referenceValues === undefined)
  )
    issues.push({
      code: "reference_profile_incomplete",
      field: "referenceProfileId",
      message:
        "Reference profile ID and reference values must be supplied together.",
    });
  if (input.referenceValues !== undefined) {
    if (!Array.isArray(input.referenceValues))
      issues.push({
        code: "reference_values_invalid",
        field: "referenceValues",
        message: "Reference values must be an array.",
      });
    else {
      if (input.referenceValues.length === 0)
        issues.push({
          code: "reference_values_empty",
          field: "referenceValues",
          message: "A reference profile needs at least one value.",
        });
      const ids = new Set<string>();
      input.referenceValues.forEach((reference, index) => {
        const path = `referenceValues.${index}`;
        if (!isRecord(reference)) {
          issues.push({
            code: "reference_invalid",
            field: path,
            message: "Reference value must be an object.",
          });
          return;
        }
        rejectUnknownFields(
          reference,
          [
            "amount",
            "comparison",
            "id",
            "label",
            "referenceType",
            "unit",
            "upperAmount",
          ],
          path,
          issues,
        );
        if (!isText(reference.id))
          issues.push({
            code: "reference_id_required",
            field: `${path}.id`,
            message: "Reference nutrient ID is required.",
          });
        else if (ids.has(reference.id))
          issues.push({
            code: "duplicate_reference",
            field: `${path}.id`,
            message: "Reference nutrient IDs must be unique.",
          });
        else ids.add(reference.id);
        if (!isText(reference.label) || !isText(reference.referenceType))
          issues.push({
            code: "reference_label_invalid",
            field: path,
            message: "Reference label and type are required.",
          });
        if (!isPositiveFinite(reference.amount))
          issues.push({
            code: "reference_amount_invalid",
            field: `${path}.amount`,
            message: "Reference amount must be greater than zero.",
          });
        if (typeof reference.unit !== "string" || !units.has(reference.unit))
          issues.push({
            code: "reference_unit_invalid",
            field: `${path}.unit`,
            message: "Reference unit is not supported.",
          });
        if (
          typeof reference.comparison !== "string" ||
          !comparisons.has(reference.comparison)
        )
          issues.push({
            code: "reference_comparison_invalid",
            field: `${path}.comparison`,
            message: "Reference comparison is not supported.",
          });
        registerNutrientUnit(reference.id, reference.unit, `${path}.unit`);
        if (reference.comparison === "range") {
          if (
            !isPositiveFinite(reference.upperAmount) ||
            (isPositiveFinite(reference.amount) &&
              reference.upperAmount <= reference.amount)
          )
            issues.push({
              code: "reference_range_invalid",
              field: `${path}.upperAmount`,
              message:
                "A range upper amount must be greater than its lower amount.",
            });
        } else if (reference.upperAmount !== undefined) {
          issues.push({
            code: "reference_upper_amount_unexpected",
            field: `${path}.upperAmount`,
            message: "Only range references may have an upper amount.",
          });
        }
      });
    }
  }
  if (
    Array.isArray(input.foods) &&
    input.foods.every(
      (food) =>
        isRecord(food) &&
        Array.isArray(food.nutrients) &&
        food.nutrients.length === 0,
    ) &&
    (!Array.isArray(input.referenceValues) ||
      input.referenceValues.length === 0)
  )
    issues.push({
      code: "nutrients_empty",
      field: "foods",
      message: "At least one nutrient or reference value is required.",
    });
  return issues;
};

export const calculateDailyIntake = (
  input: unknown,
): ToolResult<DailyIntakeOutput> => {
  const issues = validateInput(input);
  if (issues.length > 0) return invalidInput(issues);
  const value = input as DailyIntakeInput;
  const references = new Map(
    (value.referenceValues ?? []).map((item) => [item.id, item]),
  );
  const nutrientIds = new Set([
    ...references.keys(),
    ...value.foods.flatMap((food) =>
      food.nutrients.map((nutrient) => nutrient.id),
    ),
  ]);
  const nutrients = Array.from(nutrientIds, (id) => {
    const reference = references.get(id);
    const occurrences = value.foods.flatMap((food) => {
      const nutrient = food.nutrients.find((candidate) => candidate.id === id);
      return nutrient ? [{ food, nutrient }] : [];
    });
    const unit = reference?.unit ?? occurrences[0]?.nutrient.unit ?? "g";
    const contributions = occurrences.map(({ food, nutrient }) => {
      const amount = convert(
        (nutrient.amountPer100g * food.grams) / 100,
        nutrient.unit,
        unit,
      );
      return {
        amount: amount ?? 0,
        foodId: food.id,
        foodName: food.name,
        selectionId: food.selectionId ?? food.id,
      };
    });
    const total = contributions.reduce(
      (sum, contribution) => sum + contribution.amount,
      0,
    );
    return {
      complete: occurrences.length === value.foods.length,
      contributions,
      id,
      label: reference?.label ?? occurrences[0]?.nutrient.label ?? id,
      ...(reference
        ? {
            reference: {
              amount: reference.amount,
              comparison: reference.comparison,
              percentage: (total / reference.amount) * 100,
              referenceType: reference.referenceType,
              ...(reference.upperAmount === undefined
                ? {}
                : {
                    upperAmount: reference.upperAmount,
                    upperPercentage: (total / reference.upperAmount) * 100,
                  }),
            },
          }
        : {}),
      total,
      unit,
    };
  }).sort(
    (left, right) =>
      left.label.localeCompare(right.label, "en-US") ||
      left.id.localeCompare(right.id, "en-US"),
  );

  return toolSuccess({
    foodCount: value.foods.length,
    nutrients,
    ...(value.referenceProfileId === undefined
      ? {}
      : { referenceProfileId: value.referenceProfileId }),
    totalGrams: value.foods.reduce((sum, food) => sum + food.grams, 0),
  });
};

export const isDailyIntakeOutput = (
  value: unknown,
): value is DailyIntakeOutput =>
  isRecord(value) &&
  Number.isSafeInteger(value.foodCount) &&
  (value.foodCount as number) > 0 &&
  isPositiveFinite(value.totalGrams) &&
  Array.isArray(value.nutrients);

export const dailyIntakeExample = {
  input: {
    foods: [
      {
        grams: 200,
        id: "yogurt",
        name: "Plain yogurt",
        nutrients: [
          {
            amountPer100g: 61,
            id: "nutrient.energy",
            label: "Energy",
            unit: "kcal",
          },
          {
            amountPer100g: 4,
            id: "nutrient.protein",
            label: "Protein",
            unit: "g",
          },
        ],
      },
      {
        grams: 40,
        id: "brie",
        name: "Brie",
        nutrients: [
          {
            amountPer100g: 334,
            id: "nutrient.energy",
            label: "Energy",
            unit: "kcal",
          },
          {
            amountPer100g: 20.8,
            id: "nutrient.protein",
            label: "Protein",
            unit: "g",
          },
        ],
      },
      {
        grams: 80,
        id: "bread",
        name: "Bread",
        nutrients: [
          {
            amountPer100g: 272,
            id: "nutrient.energy",
            label: "Energy",
            unit: "kcal",
          },
          {
            amountPer100g: 10.8,
            id: "nutrient.protein",
            label: "Protein",
            unit: "g",
          },
        ],
      },
    ],
    referenceProfileId: "us-fda-daily-values-adults-and-children-4-plus",
    referenceValues: [
      {
        amount: 2_000,
        comparison: "target",
        id: "nutrient.energy",
        label: "Energy",
        referenceType: "Daily Value basis",
        unit: "kcal",
      },
      {
        amount: 50,
        comparison: "target",
        id: "nutrient.protein",
        label: "Protein",
        referenceType: "Daily Value",
        unit: "g",
      },
    ],
  },
  output: {
    foodCount: 3,
    nutrients: [
      {
        complete: true,
        contributions: [
          {
            amount: 122,
            foodId: "yogurt",
            foodName: "Plain yogurt",
            selectionId: "yogurt",
          },
          {
            amount: 133.6,
            foodId: "brie",
            foodName: "Brie",
            selectionId: "brie",
          },
          {
            amount: 217.6,
            foodId: "bread",
            foodName: "Bread",
            selectionId: "bread",
          },
        ],
        id: "nutrient.energy",
        label: "Energy",
        reference: {
          amount: 2_000,
          comparison: "target",
          percentage: 23.66,
          referenceType: "Daily Value basis",
        },
        total: 473.2,
        unit: "kcal",
      },
      {
        complete: true,
        contributions: [
          {
            amount: 8,
            foodId: "yogurt",
            foodName: "Plain yogurt",
            selectionId: "yogurt",
          },
          {
            amount: 8.32,
            foodId: "brie",
            foodName: "Brie",
            selectionId: "brie",
          },
          {
            amount: 8.64,
            foodId: "bread",
            foodName: "Bread",
            selectionId: "bread",
          },
        ],
        id: "nutrient.protein",
        label: "Protein",
        reference: {
          amount: 50,
          comparison: "target",
          percentage: 49.92,
          referenceType: "Daily Value",
        },
        total: 24.96,
        unit: "g",
      },
    ],
    referenceProfileId: "us-fda-daily-values-adults-and-children-4-plus",
    totalGrams: 320,
  },
} satisfies ToolExample<DailyIntakeInput, DailyIntakeOutput>;

export const dailyIntakeTool = defineTool<DailyIntakeInput, DailyIntakeOutput>({
  contractVersion: 1,
  description:
    "Calculate combined nutrients for weighed foods and compare the totals with an explicitly supplied dietary reference profile.",
  discovery: {
    aliases: [
      "daily nutrition calculator",
      "food nutrient calculator",
      "nutrition intake",
    ],
    keywords: ["calories", "food", "minerals", "nutrients", "vitamins"],
  },
  execute: calculateDailyIntake,
  execution: { kind: "pure" },
  id: "nutrition/daily-intake",
  inputSchema: dailyIntakeInputSchema,
  outputSchema: dailyIntakeOutputSchema,
  ports: {
    inputs: [
      {
        id: "foods",
        label: "Foods",
        required: true,
        valueType: {
          format: "food-composition-list",
          items: { type: "object" },
          type: "list",
        },
      },
    ],
    outputs: [
      {
        id: "nutrients",
        label: "Nutrient totals",
        valueType: {
          format: "nutrient-total-list",
          items: { type: "object" },
          type: "list",
        },
      },
    ],
  },
  title: "Daily Nutrition Intake",
});

export default dailyIntakeTool;
