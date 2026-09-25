import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recipeNutrient: number;
  readonly preparedMass: number;
  readonly consumedMass: number;
};
export type Output = {
  readonly consumedFraction: number;
  readonly consumedNutrient: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recipeNutrient: { type: "number", minimum: 0 },
    preparedMass: { type: "number", exclusiveMinimum: 0 },
    consumedMass: { type: "number", minimum: 0 },
  },
  required: ["recipeNutrient", "preparedMass", "consumedMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    consumedFraction: { type: "number" },
    consumedNutrient: { type: "number" },
  },
  required: ["consumedFraction", "consumedNutrient"],
} as const;
/** Calculate dietary recall recipe share term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recipeNutrient, preparedMass, consumedMass } = request;
  const compute = (): Output => {
    H.domain(
      recipeNutrient >= 0 && consumedMass >= 0 && consumedMass <= preparedMass,
    );
    H.positive(preparedMass);
    return {
      consumedFraction: consumedMass / preparedMass,
      consumedNutrient: (recipeNutrient * consumedMass) / preparedMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recipeNutrient: 80, preparedMass: 1000, consumedMass: 250 },
  output: { consumedFraction: 0.25, consumedNutrient: 20 },
} satisfies ToolExample<Input, Output>;
export const dietaryRecallRecipeShareTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dietetics/dietary-recall-recipe-share-term",
    title: "Dietary Recall Recipe Share Term Tool",
    description:
      "Calculate dietary recall recipe share term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recipeNutrient: { type: "number", minimum: 0 },
        preparedMass: { type: "number", exclusiveMinimum: 0 },
        consumedMass: { type: "number", minimum: 0 },
      },
      required: ["recipeNutrient", "preparedMass", "consumedMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        consumedFraction: { type: "number" },
        consumedNutrient: { type: "number" },
      },
      required: ["consumedFraction", "consumedNutrient"],
    },
    ports: {
      inputs: [
        {
          id: "recipeNutrient",
          label: "Recipe Nutrient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "preparedMass",
          label: "Prepared Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "consumedMass",
          label: "Consumed Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "consumedFraction",
          label: "Consumed Fraction",
          valueType: { type: "number" },
        },
        {
          id: "consumedNutrient",
          label: "Consumed Nutrient",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dietaryRecallRecipeShareTermTool.execute;
export default dietaryRecallRecipeShareTermTool;
