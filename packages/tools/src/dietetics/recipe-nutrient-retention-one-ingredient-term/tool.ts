import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rawMass: number;
  readonly nutrientPerMass: number;
  readonly retainedFraction: number;
  readonly recipeServings: number;
};
export type Output = {
  readonly retainedNutrient: number;
  readonly perServing: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawMass: { type: "number", minimum: 0 },
    nutrientPerMass: { type: "number", minimum: 0 },
    retainedFraction: { type: "number", minimum: 0, maximum: 1 },
    recipeServings: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "rawMass",
    "nutrientPerMass",
    "retainedFraction",
    "recipeServings",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retainedNutrient: { type: "number" },
    perServing: { type: "number" },
  },
  required: ["retainedNutrient", "perServing"],
} as const;
/** One ingredient contribution using a supplied retention factor, without a food-composition lookup or dietary recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rawMass, nutrientPerMass, retainedFraction, recipeServings } =
    request;
  const compute = (): Output => {
    H.domain(rawMass >= 0 && nutrientPerMass >= 0);
    H.probability(retainedFraction);
    H.positive(recipeServings);
    return {
      retainedNutrient: rawMass * nutrientPerMass * retainedFraction,
      perServing:
        (rawMass * nutrientPerMass * retainedFraction) / recipeServings,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    rawMass: 200,
    nutrientPerMass: 0.1,
    retainedFraction: 0.8,
    recipeServings: 4,
  },
  output: { retainedNutrient: 16, perServing: 4 },
} satisfies ToolExample<Input, Output>;
export const recipeNutrientRetentionOneIngredientTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "dietetics/recipe-nutrient-retention-one-ingredient-term",
      title: "Recipe Nutrient Retention One Ingredient Term Tool",
      description:
        "One ingredient contribution using a supplied retention factor, without a food-composition lookup or dietary recommendation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          rawMass: { type: "number", minimum: 0 },
          nutrientPerMass: { type: "number", minimum: 0 },
          retainedFraction: { type: "number", minimum: 0, maximum: 1 },
          recipeServings: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "rawMass",
          "nutrientPerMass",
          "retainedFraction",
          "recipeServings",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          retainedNutrient: { type: "number" },
          perServing: { type: "number" },
        },
        required: ["retainedNutrient", "perServing"],
      },
      ports: {
        inputs: [
          {
            id: "rawMass",
            label: "Raw Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "nutrientPerMass",
            label: "Nutrient Per Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "retainedFraction",
            label: "Retained Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "recipeServings",
            label: "Recipe Servings",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "retainedNutrient",
            label: "Retained Nutrient",
            valueType: { type: "number" },
          },
          {
            id: "perServing",
            label: "Per Serving",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = recipeNutrientRetentionOneIngredientTermTool.execute;
export default recipeNutrientRetentionOneIngredientTermTool;
