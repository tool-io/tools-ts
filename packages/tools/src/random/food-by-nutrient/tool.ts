import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import { calculateRandomFood } from "../food/tool.js";

export type NormalizedFoodNutrient = {
  readonly amountPer100g: number;
  readonly derivationCode: string | null;
  readonly id: string;
  readonly label: string;
  readonly sourceNutrientId: number;
  readonly unit: "g" | "kcal" | "kJ" | "mg" | "ug";
};
export type NormalizedFood = {
  readonly aliases: readonly string[];
  readonly category: string;
  readonly dataType: string;
  readonly description: string;
  readonly fdcId: number;
  readonly id: string;
  readonly name: string;
  readonly nutrients: readonly NormalizedFoodNutrient[];
  readonly portions: readonly {
    readonly description: string;
    readonly grams: number;
  }[];
  readonly publicationDate: string | null;
  readonly source: string;
};
export type FoodByNutrientInput = {
  readonly foods: readonly NormalizedFood[];
  readonly nutrientId: string;
  readonly unit: NormalizedFoodNutrient["unit"];
  readonly minimumPer100g: number;
  readonly maximumPer100g: number;
  readonly datasetId: string;
  readonly datasetVersion: string;
  readonly sourceId: string;
  readonly selectionCount: number;
  readonly withReplacement: boolean;
  readonly seed?: number;
};
export type FoodByNutrientOutput = {
  readonly selectedFoods: readonly NormalizedFood[];
  readonly eligibleCount: number;
  readonly datasetId: string;
  readonly datasetVersion: string;
  readonly sourceId: string;
  readonly randomness: GeneratorReplay;
};
const text = { type: "string", minLength: 1, maxLength: 128 } as const;
const unitSchema = {
  type: "string",
  enum: ["g", "kcal", "kJ", "mg", "ug"],
} as const;
const nullableText = {
  anyOf: [{ type: "string", maxLength: 128 }, { type: "null" }],
} as const;
const nutrientSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amountPer100g: { type: "number", minimum: 0 },
    derivationCode: nullableText,
    id: {
      type: "string",
      pattern: "^nutrient\\.[a-z0-9-]+$",
      minLength: 10,
      maxLength: 128,
    },
    label: text,
    sourceNutrientId: { type: "integer", minimum: 1 },
    unit: unitSchema,
  },
  required: [
    "amountPer100g",
    "derivationCode",
    "id",
    "label",
    "sourceNutrientId",
    "unit",
  ],
} as const;
export const foodSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    aliases: { type: "array", maxItems: 32, items: text },
    category: { type: "string", maxLength: 256 },
    dataType: text,
    description: { type: "string", minLength: 1, maxLength: 2048 },
    fdcId: { type: "integer", minimum: 1 },
    id: { type: "string", pattern: "^usda-fdc-[1-9][0-9]*$", maxLength: 64 },
    name: { type: "string", minLength: 1, maxLength: 512 },
    nutrients: {
      type: "array",
      minItems: 1,
      maxItems: 64,
      items: nutrientSchema,
    },
    portions: {
      type: "array",
      maxItems: 24,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          description: { type: "string", minLength: 1, maxLength: 512 },
          grams: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["description", "grams"],
      },
    },
    publicationDate: nullableText,
    source: text,
  },
  required: [
    "aliases",
    "category",
    "dataType",
    "description",
    "fdcId",
    "id",
    "name",
    "nutrients",
    "portions",
    "publicationDate",
    "source",
  ],
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    foods: { type: "array", maxItems: 128, items: foodSchema },
    nutrientId: {
      type: "string",
      pattern: "^nutrient\\.[a-z0-9-]+$",
      minLength: 10,
      maxLength: 128,
    },
    unit: unitSchema,
    minimumPer100g: { type: "number", minimum: 0 },
    maximumPer100g: { type: "number", minimum: 0 },
    datasetId: text,
    datasetVersion: text,
    sourceId: text,
    selectionCount: { type: "integer", minimum: 1, maximum: 128 },
    withReplacement: { type: "boolean" },
    seed: generatorSeedSchema,
  },
  required: [
    "foods",
    "nutrientId",
    "unit",
    "minimumPer100g",
    "maximumPer100g",
    "datasetId",
    "datasetVersion",
    "sourceId",
    "selectionCount",
    "withReplacement",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    selectedFoods: {
      type: "array",
      minItems: 1,
      maxItems: 128,
      items: foodSchema,
    },
    eligibleCount: { type: "integer", minimum: 1, maximum: 128 },
    datasetId: text,
    datasetVersion: text,
    sourceId: text,
    randomness: generatorReplaySchema,
  },
  required: [
    "selectedFoods",
    "eligibleCount",
    "datasetId",
    "datasetVersion",
    "sourceId",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is FoodByNutrientInput =>
  matchesModelInput(input, inputSchema);
export const calculateFoodByNutrient = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<FoodByNutrientOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (input.maximumPer100g < input.minimumPer100g)
      simpleError(
        "maximumPer100g",
        "Nutrient bounds must be ordered.",
        "invalid_nutrient_range",
      );
    if (
      [input.datasetId, input.datasetVersion, input.sourceId].some(
        (value) => !value.trim(),
      )
    )
      simpleError(
        "datasetId",
        "Dataset and source provenance must be nonblank.",
        "invalid_provenance",
      );
    if (new Set(input.foods.map((food) => food.id)).size !== input.foods.length)
      simpleError("foods", "Food IDs must be distinct.", "duplicate_food_ids");
    if (
      input.foods.reduce((sum, food) => sum + food.nutrients.length, 0) > 2048
    )
      simpleError(
        "foods",
        "At most 2,048 supplied nutrient entries are supported.",
        "resource_limit",
      );
    const eligible: NormalizedFood[] = [];
    for (const food of input.foods) {
      if (
        food.source !== input.sourceId ||
        food.id !== "usda-fdc-" + food.fdcId
      )
        simpleError(
          "foods",
          "Each food must retain matching source and canonical FDC identity.",
          "invalid_food_provenance",
        );
      if (
        new Set(food.aliases).size !== food.aliases.length ||
        new Set(food.nutrients.map((nutrient) => nutrient.id)).size !==
          food.nutrients.length
      )
        simpleError(
          "foods",
          "Aliases and nutrient IDs must not repeat within a record.",
          "duplicate_food_fields",
        );
      const nutrient = food.nutrients.find(
        (entry) => entry.id === input.nutrientId,
      );
      if (!nutrient) continue;
      if (nutrient.unit !== input.unit)
        simpleError(
          "unit",
          "Matching nutrient entries must already use the explicitly selected unit.",
          "nutrient_unit_mismatch",
        );
      if (
        nutrient.amountPer100g >= input.minimumPer100g &&
        nutrient.amountPer100g <= input.maximumPer100g
      )
        eligible.push(food);
    }
    if (!eligible.length)
      simpleError(
        "foods",
        "No food has a known matching nutrient value within the selected range.",
        "no_matching_foods",
      );
    if (!input.withReplacement && input.selectionCount > eligible.length)
      simpleError(
        "selectionCount",
        "The without-replacement count exceeds eligible foods.",
        "insufficient_eligible_foods",
      );
    const random = createGeneratorRandom(input.seed, context);
    const selected = calculateRandomFood(
      {
        candidateIds: eligible.map((food) => food.id),
        datasetId: input.datasetId,
        datasetVersion: input.datasetVersion,
        sourceId: input.sourceId,
        selectionCount: input.selectionCount,
        withReplacement: input.withReplacement,
      },
      random.unit,
    );
    if (selected === null)
      throw new Error(
        "Validated food selection was rejected by the existing selector.",
      );
    const byId = new Map(eligible.map((food) => [food.id, food]));
    const selectedFoods = selected.selectedIds.map((id) => {
      const food = byId.get(id);
      if (!food) throw new Error("Food selector returned an unknown ID.");
      return food;
    });
    return toolSuccess({
      selectedFoods,
      eligibleCount: eligible.length,
      datasetId: selected.datasetId,
      datasetVersion: selected.datasetVersion,
      sourceId: selected.sourceId,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const foodByNutrientExample = {
  input: {
    foods: [
      {
        aliases: ["Synthetic pulse A"],
        category: "Synthetic fixtures",
        dataType: "Synthetic",
        description:
          "Synthetic food-composition fixture A, not a published USDA record.",
        fdcId: 1,
        id: "usda-fdc-1",
        name: "Synthetic pulse A",
        nutrients: [
          {
            amountPer100g: 21,
            derivationCode: null,
            id: "nutrient.protein",
            label: "Protein",
            sourceNutrientId: 1003,
            unit: "g",
          },
        ],
        portions: [
          {
            description: "Synthetic 150 g portion",
            grams: 150,
          },
        ],
        publicationDate: null,
        source: "synthetic-fixtures-v1",
      },
      {
        aliases: [],
        category: "Synthetic fixtures",
        dataType: "Synthetic",
        description:
          "Synthetic food-composition fixture B, not a published USDA record.",
        fdcId: 2,
        id: "usda-fdc-2",
        name: "Synthetic grain B",
        nutrients: [
          {
            amountPer100g: 12,
            derivationCode: null,
            id: "nutrient.protein",
            label: "Protein",
            sourceNutrientId: 1003,
            unit: "g",
          },
        ],
        portions: [],
        publicationDate: null,
        source: "synthetic-fixtures-v1",
      },
      {
        aliases: [],
        category: "Synthetic fixtures",
        dataType: "Synthetic",
        description:
          "Synthetic food-composition fixture C, not a published USDA record.",
        fdcId: 3,
        id: "usda-fdc-3",
        name: "Synthetic seed C",
        nutrients: [
          {
            amountPer100g: 28,
            derivationCode: null,
            id: "nutrient.protein",
            label: "Protein",
            sourceNutrientId: 1003,
            unit: "g",
          },
        ],
        portions: [],
        publicationDate: null,
        source: "synthetic-fixtures-v1",
      },
    ],
    nutrientId: "nutrient.protein",
    unit: "g",
    minimumPer100g: 15,
    maximumPer100g: 30,
    datasetId: "nutrition/synthetic-food-fixtures",
    datasetVersion: "1",
    sourceId: "synthetic-fixtures-v1",
    selectionCount: 2,
    withReplacement: false,
    seed: 42,
  },
  output: {
    selectedFoods: [
      {
        aliases: [],
        category: "Synthetic fixtures",
        dataType: "Synthetic",
        description:
          "Synthetic food-composition fixture C, not a published USDA record.",
        fdcId: 3,
        id: "usda-fdc-3",
        name: "Synthetic seed C",
        nutrients: [
          {
            amountPer100g: 28,
            derivationCode: null,
            id: "nutrient.protein",
            label: "Protein",
            sourceNutrientId: 1003,
            unit: "g",
          },
        ],
        portions: [],
        publicationDate: null,
        source: "synthetic-fixtures-v1",
      },
      {
        aliases: ["Synthetic pulse A"],
        category: "Synthetic fixtures",
        dataType: "Synthetic",
        description:
          "Synthetic food-composition fixture A, not a published USDA record.",
        fdcId: 1,
        id: "usda-fdc-1",
        name: "Synthetic pulse A",
        nutrients: [
          {
            amountPer100g: 21,
            derivationCode: null,
            id: "nutrient.protein",
            label: "Protein",
            sourceNutrientId: 1003,
            unit: "g",
          },
        ],
        portions: [
          {
            description: "Synthetic 150 g portion",
            grams: 150,
          },
        ],
        publicationDate: null,
        source: "synthetic-fixtures-v1",
      },
    ],
    eligibleCount: 2,
    datasetId: "nutrition/synthetic-food-fixtures",
    datasetVersion: "1",
    sourceId: "synthetic-fixtures-v1",
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<FoodByNutrientInput, FoodByNutrientOutput>;
export const foodByNutrientTool = createModelDefinition<
  FoodByNutrientInput,
  FoodByNutrientOutput
>({
  id: "random/food-by-nutrient",
  title: "Random Food by Nutrient Picker",
  description:
    "Filter supplied normalized food-composition records by an inclusive per-100-gram nutrient range in one explicit unit, then reuse the food catalog selector and return full selected records with provenance; missing nutrients are unknown, not zero, and no dietary recommendation is implied.",
  inputSchema,
  outputSchema,
  execution: {
    kind: "data",
    datasets: [{ id: "nutrition/food-composition", schemaVersion: 1 }],
  },
  execute: calculateFoodByNutrient,
});
export const runFoodByNutrient = foodByNutrientTool.execute;
export default foodByNutrientTool;
