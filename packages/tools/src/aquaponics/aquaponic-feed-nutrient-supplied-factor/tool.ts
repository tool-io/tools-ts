import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly feedMass: number;
  readonly dryFraction: number;
  readonly nutrientFraction: number;
  readonly exportedFraction: number;
};
export type Output = {
  readonly nutrientInventory: number;
  readonly retainedInventory: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    feedMass: { type: "number", minimum: 0 },
    dryFraction: { type: "number", minimum: 0, maximum: 1 },
    nutrientFraction: { type: "number", minimum: 0, maximum: 1 },
    exportedFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["feedMass", "dryFraction", "nutrientFraction", "exportedFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nutrientInventory: { type: "number" },
    retainedInventory: { type: "number" },
  },
  required: ["nutrientInventory", "retainedInventory"],
} as const;
/** Formal nutrient inventory from supplied fractions without a feeding prescription. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { feedMass, dryFraction, nutrientFraction, exportedFraction } = request;
  const compute = (): Output => {
    H.domain(feedMass >= 0);
    H.probability(dryFraction);
    H.probability(nutrientFraction);
    H.probability(exportedFraction);
    return {
      nutrientInventory: feedMass * dryFraction * nutrientFraction,
      retainedInventory:
        feedMass * dryFraction * nutrientFraction * (1 - exportedFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    feedMass: 100,
    dryFraction: 0.9,
    nutrientFraction: 0.1,
    exportedFraction: 0.2,
  },
  output: { nutrientInventory: 9, retainedInventory: 7.2 },
} satisfies ToolExample<Input, Output>;
export const aquaponicFeedNutrientSuppliedFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "aquaponics/aquaponic-feed-nutrient-supplied-factor",
      title: "Aquaponic Feed Nutrient Supplied Factor Tool",
      description:
        "Formal nutrient inventory from supplied fractions without a feeding prescription.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          feedMass: { type: "number", minimum: 0 },
          dryFraction: { type: "number", minimum: 0, maximum: 1 },
          nutrientFraction: { type: "number", minimum: 0, maximum: 1 },
          exportedFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: [
          "feedMass",
          "dryFraction",
          "nutrientFraction",
          "exportedFraction",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          nutrientInventory: { type: "number" },
          retainedInventory: { type: "number" },
        },
        required: ["nutrientInventory", "retainedInventory"],
      },
      ports: {
        inputs: [
          {
            id: "feedMass",
            label: "Feed Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "dryFraction",
            label: "Dry Fraction",
            required: true,
            valueType: { type: "number", unit: "1" },
          },
          {
            id: "nutrientFraction",
            label: "Nutrient Fraction",
            required: true,
            valueType: { type: "number", unit: "1" },
          },
          {
            id: "exportedFraction",
            label: "Exported Fraction",
            required: true,
            valueType: { type: "number", unit: "1" },
          },
        ],
        outputs: [
          {
            id: "nutrientInventory",
            label: "Nutrient Inventory",
            valueType: { type: "number" },
          },
          {
            id: "retainedInventory",
            label: "Retained Inventory",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = aquaponicFeedNutrientSuppliedFactorTool.execute;
export default aquaponicFeedNutrientSuppliedFactorTool;
