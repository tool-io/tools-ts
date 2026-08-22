import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const recipeScaleTool = createSimpleTool({
  id: "cooking/recipe-scale",
  title: "Recipe Scale Calculator",
  description:
    "Scale an ingredient amount from one serving count to another proportionally.",
  inputs: [
    { id: "amount", label: "Ingredient amount", kind: "number", minimum: 0 },
    {
      id: "originalServings",
      label: "Original servings",
      kind: "number",
      minimum: 1,
    },
    { id: "newServings", label: "New servings", kind: "number", minimum: 0 },
  ],
  outputs: [{ id: "scaledAmount", label: "Scaled amount", kind: "number" }],
  calculate: (input) => {
    return {
      scaledAmount:
        ((input.amount as number) * (input.newServings as number)) /
        (input.originalServings as number),
    };
  },
});
export const runRecipeScale = recipeScaleTool.execute;
export default recipeScaleTool;

export type RecipeScaleInput = {
  readonly amount: number;
  readonly originalServings: number;
  readonly newServings: number;
};

export type RecipeScaleOutput = {
  readonly scaledAmount: number;
};

export const recipeScaleExample = {
  input: {
    amount: 1,
    originalServings: 1,
    newServings: 1,
  },
  output: {
    scaledAmount: 1,
  },
} satisfies ToolExample<RecipeScaleInput, RecipeScaleOutput>;
