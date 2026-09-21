import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly litterDryMass: number;
  readonly nutrientFraction: number;
  readonly returnedFraction: number;
};
export type Output = { readonly returnedNutrient: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    litterDryMass: { type: "number", minimum: 0 },
    nutrientFraction: { type: "number", minimum: 0, maximum: 1 },
    returnedFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["litterDryMass", "nutrientFraction", "returnedFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { returnedNutrient: { type: "number" } },
  required: ["returnedNutrient"],
} as const;
/** Calculate tree crop litter nutrient return factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { litterDryMass, nutrientFraction, returnedFraction } = request;
  const compute = (): Output => {
    H.domain(litterDryMass >= 0);
    H.probability(nutrientFraction);
    H.probability(returnedFraction);
    return {
      returnedNutrient: litterDryMass * nutrientFraction * returnedFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { litterDryMass: 100, nutrientFraction: 0.02, returnedFraction: 0.5 },
  output: { returnedNutrient: 1 },
} satisfies ToolExample<Input, Output>;
export const treeCropLitterNutrientReturnFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroforestry/tree-crop-litter-nutrient-return-factor",
    title: "Tree Crop Litter Nutrient Return Factor Tool",
    description:
      "Calculate tree crop litter nutrient return factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        litterDryMass: { type: "number", minimum: 0 },
        nutrientFraction: { type: "number", minimum: 0, maximum: 1 },
        returnedFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["litterDryMass", "nutrientFraction", "returnedFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { returnedNutrient: { type: "number" } },
      required: ["returnedNutrient"],
    },
    ports: {
      inputs: [
        {
          id: "litterDryMass",
          label: "Litter Dry Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nutrientFraction",
          label: "Nutrient Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "returnedFraction",
          label: "Returned Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        {
          id: "returnedNutrient",
          label: "Returned Nutrient",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = treeCropLitterNutrientReturnFactorTool.execute;
export default treeCropLitterNutrientReturnFactorTool;
