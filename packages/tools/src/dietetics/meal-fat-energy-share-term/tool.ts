import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fatGrams: number;
  readonly energyPerFatGram: number;
  readonly totalEnergy: number;
};
export type Output = { readonly fatEnergy: number; readonly fraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fatGrams: { type: "number", minimum: 0 },
    energyPerFatGram: { type: "number", minimum: 0 },
    totalEnergy: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["fatGrams", "energyPerFatGram", "totalEnergy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fatEnergy: { type: "number" }, fraction: { type: "number" } },
  required: ["fatEnergy", "fraction"],
} as const;
/** Calculate meal fat energy share term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fatGrams, energyPerFatGram, totalEnergy } = request;
  const compute = (): Output => {
    H.domain(fatGrams >= 0 && energyPerFatGram >= 0);
    H.positive(totalEnergy);
    return {
      fatEnergy: fatGrams * energyPerFatGram,
      fraction: (fatGrams * energyPerFatGram) / totalEnergy,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fatGrams: 20, energyPerFatGram: 9, totalEnergy: 600 },
  output: { fatEnergy: 180, fraction: 0.3 },
} satisfies ToolExample<Input, Output>;
export const mealFatEnergyShareTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dietetics/meal-fat-energy-share-term",
    title: "Meal Fat Energy Share Term Tool",
    description:
      "Calculate meal fat energy share term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fatGrams: { type: "number", minimum: 0 },
        energyPerFatGram: { type: "number", minimum: 0 },
        totalEnergy: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["fatGrams", "energyPerFatGram", "totalEnergy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fatEnergy: { type: "number" },
        fraction: { type: "number" },
      },
      required: ["fatEnergy", "fraction"],
    },
    ports: {
      inputs: [
        {
          id: "fatGrams",
          label: "Fat Grams",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "energyPerFatGram",
          label: "Energy Per Fat Gram",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalEnergy",
          label: "Total Energy",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fatEnergy", label: "Fat Energy", valueType: { type: "number" } },
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = mealFatEnergyShareTermTool.execute;
export default mealFatEnergyShareTermTool;
