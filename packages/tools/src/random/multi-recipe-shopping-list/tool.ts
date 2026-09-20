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
import { runRecipeScale } from "../../cooking/recipe-scale/tool.js";
import { convertMass } from "../../convert/mass/tool.js";
import { convertVolume } from "../../convert/volume/tool.js";
import { measureFactors as massFactors } from "../../convert/mass/factors.js";
import { measureFactors as volumeFactors } from "../../convert/volume/factors.js";
import { addNumbers } from "../../arithmetic/add-numbers/tool.js";
import { generatorSampleIndices } from "../generator-random.js";

export type ShoppingIngredient = {
  readonly ingredientId: string;
  readonly amount: number;
  readonly dimension: "mass" | "volume" | "count";
  readonly unit: string;
};
export type ShoppingRecipe = {
  readonly id: string;
  readonly originalServings: number;
  readonly ingredients: readonly ShoppingIngredient[];
};
export type MultiRecipeShoppingListInput = {
  readonly recipes: readonly ShoppingRecipe[];
  readonly selectionCount: number;
  readonly withoutReplacement: boolean;
  readonly targetServings: readonly number[];
  readonly densities: readonly {
    readonly ingredientId: string;
    readonly gramsPerMilliliter: number;
  }[];
  readonly seed?: number;
};
export type ShoppingNormalizedIngredient = {
  readonly ingredientId: string;
  readonly originalAmount: number;
  readonly originalUnit: string;
  readonly scaledAmount: number;
  readonly normalizedAmount: number;
  readonly normalizedUnit: "g" | "ml" | "each";
};
export type MultiRecipeShoppingListOutput = {
  readonly selections: readonly {
    readonly recipeId: string;
    readonly originalServings: number;
    readonly targetServings: number;
    readonly ingredients: readonly ShoppingNormalizedIngredient[];
  }[];
  readonly shoppingList: readonly {
    readonly ingredientId: string;
    readonly unit: "g" | "ml" | "each";
    readonly amount: number;
  }[];
  readonly randomness: GeneratorReplay;
};
const idSchema = { type: "string", minLength: 1, maxLength: 128 } as const,
  amountSchema = { type: "number", minimum: 0 } as const,
  unitSchema = { type: "string", minLength: 1, maxLength: 64 } as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recipes: {
      type: "array",
      minItems: 1,
      maxItems: 64,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: idSchema,
          originalServings: { type: "number", minimum: 1 },
          ingredients: {
            type: "array",
            minItems: 1,
            maxItems: 32,
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                ingredientId: idSchema,
                amount: amountSchema,
                dimension: {
                  type: "string",
                  enum: ["mass", "volume", "count"],
                },
                unit: unitSchema,
              },
              required: ["ingredientId", "amount", "dimension", "unit"],
            },
          },
        },
        required: ["id", "originalServings", "ingredients"],
      },
    },
    selectionCount: { type: "integer", minimum: 1, maximum: 16 },
    withoutReplacement: { type: "boolean" },
    targetServings: {
      type: "array",
      minItems: 1,
      maxItems: 32,
      items: amountSchema,
    },
    densities: {
      type: "array",
      maxItems: 128,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          ingredientId: idSchema,
          gramsPerMilliliter: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["ingredientId", "gramsPerMilliliter"],
      },
    },
    seed: generatorSeedSchema,
  },
  required: [
    "recipes",
    "selectionCount",
    "withoutReplacement",
    "targetServings",
    "densities",
  ],
} as const;
const normalizedUnitSchema = {
  type: "string",
  enum: ["g", "ml", "each"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    selections: {
      type: "array",
      minItems: 1,
      maxItems: 16,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          recipeId: idSchema,
          originalServings: { type: "number", minimum: 1 },
          targetServings: amountSchema,
          ingredients: {
            type: "array",
            minItems: 1,
            maxItems: 32,
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                ingredientId: idSchema,
                originalAmount: amountSchema,
                originalUnit: unitSchema,
                scaledAmount: amountSchema,
                normalizedAmount: amountSchema,
                normalizedUnit: normalizedUnitSchema,
              },
              required: [
                "ingredientId",
                "originalAmount",
                "originalUnit",
                "scaledAmount",
                "normalizedAmount",
                "normalizedUnit",
              ],
            },
          },
        },
        required: [
          "recipeId",
          "originalServings",
          "targetServings",
          "ingredients",
        ],
      },
    },
    shoppingList: {
      type: "array",
      minItems: 1,
      maxItems: 512,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          ingredientId: idSchema,
          unit: normalizedUnitSchema,
          amount: amountSchema,
        },
        required: ["ingredientId", "unit", "amount"],
      },
    },
    randomness: generatorReplaySchema,
  },
  required: ["selections", "shoppingList", "randomness"],
} as const;

const isInput = (input: unknown): input is MultiRecipeShoppingListInput =>
  matchesModelInput(input, inputSchema);
export const calculateMultiRecipeShoppingList = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<MultiRecipeShoppingListOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (
      new Set(input.recipes.map((recipe) => recipe.id)).size !==
      input.recipes.length
    )
      simpleError(
        "recipes",
        "Recipe IDs must be distinct.",
        "duplicate_recipe",
      );
    if (
      new Set(input.densities.map((density) => density.ingredientId)).size !==
      input.densities.length
    )
      simpleError(
        "densities",
        "Each ingredient may have only one supplied density.",
        "duplicate_density",
      );
    if (input.withoutReplacement && input.selectionCount > input.recipes.length)
      simpleError(
        "selectionCount",
        "The distinct selection exceeds the supplied recipe bank.",
        "insufficient_recipes",
      );
    for (const recipe of input.recipes)
      for (const ingredient of recipe.ingredients) {
        const valid =
          ingredient.dimension === "count"
            ? ingredient.unit === "each"
            : Object.hasOwn(
                ingredient.dimension === "mass" ? massFactors : volumeFactors,
                ingredient.unit,
              );
        if (!valid)
          simpleError(
            "recipes",
            "Each ingredient must use a unit supported for its explicit dimension.",
            "unsupported_ingredient_unit",
          );
      }
    const random = createGeneratorRandom(input.seed, context),
      densities = new Map(
        input.densities.map((density) => [
          density.ingredientId,
          density.gramsPerMilliliter,
        ]),
      );
    const indices = input.withoutReplacement
      ? generatorSampleIndices(
          input.recipes.length,
          input.selectionCount,
          random,
        )
      : Array.from({ length: input.selectionCount }, () =>
          random.integer(0, input.recipes.length - 1),
        );
    const selections = indices.map((index) => {
      const recipe = input.recipes[index],
        targetServings = random.pick(input.targetServings);
      const ingredients = recipe.ingredients.map(
        (ingredient): ShoppingNormalizedIngredient => {
          const result = runRecipeScale({
            amount: ingredient.amount,
            originalServings: recipe.originalServings,
            newServings: targetServings,
          });
          if (!result.ok)
            return simpleError(
              "recipes",
              "Ingredient scaling produced a nonfinite amount.",
              "scaling_overflow",
            );
          const scaledAmount = result.output.scaledAmount,
            density = densities.get(ingredient.ingredientId);
          const converted =
            ingredient.dimension === "mass"
              ? convertMass(scaledAmount, ingredient.unit, "g")
              : ingredient.dimension === "volume"
                ? convertVolume(scaledAmount, ingredient.unit, "ml")
                : scaledAmount;
          if (converted === null)
            return simpleError(
              "recipes",
              "Compatible unit conversion produced a nonfinite amount.",
              "conversion_overflow",
            );
          const normalizedAmount =
            ingredient.dimension === "volume" && density !== undefined
              ? converted * density
              : converted;
          if (!Number.isFinite(normalizedAmount))
            simpleError(
              "densities",
              "Supplied density conversion exceeds the finite numeric domain.",
              "density_conversion_overflow",
            );
          const normalizedUnit =
            ingredient.dimension === "count"
              ? "each"
              : ingredient.dimension === "mass" || density !== undefined
                ? "g"
                : "ml";
          return {
            ingredientId: ingredient.ingredientId,
            originalAmount: ingredient.amount,
            originalUnit: ingredient.unit,
            scaledAmount,
            normalizedAmount,
            normalizedUnit,
          };
        },
      );
      return {
        recipeId: recipe.id,
        originalServings: recipe.originalServings,
        targetServings,
        ingredients,
      };
    });
    const groups = new Map<
      string,
      { ingredientId: string; unit: "g" | "ml" | "each"; amounts: number[] }
    >();
    for (const selection of selections)
      for (const ingredient of selection.ingredients) {
        const key = JSON.stringify([
            ingredient.ingredientId,
            ingredient.normalizedUnit,
          ]),
          group = groups.get(key) ?? {
            ingredientId: ingredient.ingredientId,
            unit: ingredient.normalizedUnit,
            amounts: [],
          };
        group.amounts.push(ingredient.normalizedAmount);
        groups.set(key, group);
      }
    const shoppingList = [...groups.values()].map((group) => {
      const amount = addNumbers(group.amounts);
      if (amount === null || !Number.isFinite(amount))
        return simpleError(
          "recipes",
          "Combined ingredient amount exceeds the finite numeric domain.",
          "total_overflow",
        );
      return { ingredientId: group.ingredientId, unit: group.unit, amount };
    });
    return toolSuccess({
      selections,
      shoppingList,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const multiRecipeShoppingListExample = {
  input: {
    recipes: [
      {
        id: "R1",
        originalServings: 2,
        ingredients: [
          {
            ingredientId: "flour",
            amount: 0.25,
            dimension: "mass",
            unit: "kg",
          },
          {
            ingredientId: "milk",
            amount: 100,
            dimension: "volume",
            unit: "ml",
          },
        ],
      },
      {
        id: "R2",
        originalServings: 1,
        ingredients: [
          {
            ingredientId: "flour",
            amount: 50,
            dimension: "mass",
            unit: "g",
          },
          {
            ingredientId: "milk",
            amount: 0.2,
            dimension: "volume",
            unit: "l",
          },
          {
            ingredientId: "eggs",
            amount: 1,
            dimension: "count",
            unit: "each",
          },
        ],
      },
    ],
    selectionCount: 2,
    withoutReplacement: true,
    targetServings: [2, 4],
    densities: [
      {
        ingredientId: "milk",
        gramsPerMilliliter: 1.03,
      },
    ],
    seed: 42,
  },
  output: {
    selections: [
      {
        recipeId: "R2",
        originalServings: 1,
        targetServings: 4,
        ingredients: [
          {
            ingredientId: "flour",
            originalAmount: 50,
            originalUnit: "g",
            scaledAmount: 200,
            normalizedAmount: 200,
            normalizedUnit: "g",
          },
          {
            ingredientId: "milk",
            originalAmount: 0.2,
            originalUnit: "l",
            scaledAmount: 0.8,
            normalizedAmount: 824,
            normalizedUnit: "g",
          },
          {
            ingredientId: "eggs",
            originalAmount: 1,
            originalUnit: "each",
            scaledAmount: 4,
            normalizedAmount: 4,
            normalizedUnit: "each",
          },
        ],
      },
      {
        recipeId: "R1",
        originalServings: 2,
        targetServings: 4,
        ingredients: [
          {
            ingredientId: "flour",
            originalAmount: 0.25,
            originalUnit: "kg",
            scaledAmount: 0.5,
            normalizedAmount: 500,
            normalizedUnit: "g",
          },
          {
            ingredientId: "milk",
            originalAmount: 100,
            originalUnit: "ml",
            scaledAmount: 200,
            normalizedAmount: 206,
            normalizedUnit: "g",
          },
        ],
      },
    ],
    shoppingList: [
      {
        ingredientId: "flour",
        unit: "g",
        amount: 700,
      },
      {
        ingredientId: "milk",
        unit: "g",
        amount: 1030,
      },
      {
        ingredientId: "eggs",
        unit: "each",
        amount: 4,
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  MultiRecipeShoppingListInput,
  MultiRecipeShoppingListOutput
>;
export const multiRecipeShoppingListTool = createModelDefinition<
  MultiRecipeShoppingListInput,
  MultiRecipeShoppingListOutput
>({
  id: "random/multi-recipe-shopping-list",
  title: "Random Multi-Recipe Shopping List Generator",
  description:
    "Sample supplied recipes, draw target servings, delegate ingredient scaling and compatible mass/volume conversions, and combine matching ingredient IDs in grams, milliliters or each. Only supplied grams-per-milliliter densities convert volume to mass; otherwise dimensions stay separate. Count amounts may be fractional, repeats are explicit, and nothing implies nutrition or food safety.",
  inputSchema,
  outputSchema,
  execute: calculateMultiRecipeShoppingList,
});
export const runMultiRecipeShoppingList = multiRecipeShoppingListTool.execute;
export default multiRecipeShoppingListTool;
