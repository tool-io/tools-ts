import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ingredientMass: number;
  readonly addedWaterMass: number;
  readonly removedWaterMass: number;
};
export type Output = { readonly finalMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ingredientMass: { type: "number", minimum: 0 },
    addedWaterMass: { type: "number", minimum: 0 },
    removedWaterMass: { type: "number", minimum: 0 },
  },
  required: ["ingredientMass", "addedWaterMass", "removedWaterMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { finalMass: { type: "number" } },
  required: ["finalMass"],
} as const;
/** Reconcile supplied ingredient mass and added/removed water in consistent units without estimating composition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ingredientMass, addedWaterMass, removedWaterMass } = request;
  const compute = (): Output => {
    H.domain(ingredientMass >= 0, "ingredientMass");
    H.domain(addedWaterMass >= 0, "addedWaterMass");
    H.domain(removedWaterMass >= 0, "removedWaterMass");
    return { finalMass: ingredientMass + addedWaterMass - removedWaterMass };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ingredientMass: 100, addedWaterMass: 40, removedWaterMass: 15 },
  output: { finalMass: 125 },
} satisfies ToolExample<Input, Output>;
export const ingredientAddedWaterMassBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dietetics/ingredient-added-water-mass-balance",
    title: "Ingredient Added Water Mass Balance Tool",
    description:
      "Reconcile supplied ingredient mass and added/removed water in consistent units without estimating composition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ingredientMass: { type: "number", minimum: 0 },
        addedWaterMass: { type: "number", minimum: 0 },
        removedWaterMass: { type: "number", minimum: 0 },
      },
      required: ["ingredientMass", "addedWaterMass", "removedWaterMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { finalMass: { type: "number" } },
      required: ["finalMass"],
    },
    ports: {
      inputs: [
        {
          id: "ingredientMass",
          label: "Ingredient Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "addedWaterMass",
          label: "Added Water Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "removedWaterMass",
          label: "Removed Water Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "finalMass", label: "Final Mass", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = ingredientAddedWaterMassBalanceTool.execute;
export default ingredientAddedWaterMassBalanceTool;
