import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ingredientMass: number;
  readonly measuredWaterFraction: number;
  readonly massUnit: string;
};
export type Output = {
  readonly waterMass: number;
  readonly solidMass: number;
  readonly unit: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ingredientMass: { type: "number", minimum: 0 },
    measuredWaterFraction: { type: "number", minimum: 0, maximum: 1 },
    massUnit: { type: "string", maxLength: 8192 },
  },
  required: ["ingredientMass", "measuredWaterFraction", "massUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    waterMass: { type: "number" },
    solidMass: { type: "number" },
    unit: { type: "string", maxLength: 8192 },
  },
  required: ["waterMass", "solidMass", "unit"],
} as const;
/** Split one explicitly measured ingredient into water/solid mass on a declared basis; not a formulation ledger. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ingredientMass, measuredWaterFraction, massUnit } = request;
  const compute = (): Output => {
    H.domain(ingredientMass >= 0 && massUnit.length > 0);
    H.probability(measuredWaterFraction);
    return {
      waterMass: ingredientMass * measuredWaterFraction,
      solidMass: ingredientMass * (1 - measuredWaterFraction),
      unit: massUnit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ingredientMass: 100, measuredWaterFraction: 0.2, massUnit: "g" },
  output: { waterMass: 20, solidMass: 80, unit: "g" },
} satisfies ToolExample<Input, Output>;
export const ingredientSolidWaterFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-technology/ingredient-solid-water-fraction",
    title: "Ingredient Solid Water Fraction Tool",
    description:
      "Split one explicitly measured ingredient into water/solid mass on a declared basis; not a formulation ledger.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ingredientMass: { type: "number", minimum: 0 },
        measuredWaterFraction: { type: "number", minimum: 0, maximum: 1 },
        massUnit: { type: "string", maxLength: 8192 },
      },
      required: ["ingredientMass", "measuredWaterFraction", "massUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        waterMass: { type: "number" },
        solidMass: { type: "number" },
        unit: { type: "string", maxLength: 8192 },
      },
      required: ["waterMass", "solidMass", "unit"],
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
          id: "measuredWaterFraction",
          label: "Measured Water Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "massUnit",
          label: "Mass Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "waterMass", label: "Water Mass", valueType: { type: "number" } },
        { id: "solidMass", label: "Solid Mass", valueType: { type: "number" } },
        { id: "unit", label: "Unit", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = ingredientSolidWaterFractionTool.execute;
export default ingredientSolidWaterFractionTool;
