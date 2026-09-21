import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetMass: number;
  readonly dryFraction: number;
  readonly nutrientFraction: number;
  readonly suppliedAvailableFraction: number;
};
export type Output = {
  readonly totalNutrient: number;
  readonly availableInventory: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetMass: { type: "number", minimum: 0 },
    dryFraction: { type: "number", minimum: 0, maximum: 1 },
    nutrientFraction: { type: "number", minimum: 0, maximum: 1 },
    suppliedAvailableFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "wetMass",
    "dryFraction",
    "nutrientFraction",
    "suppliedAvailableFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalNutrient: { type: "number" },
    availableInventory: { type: "number" },
  },
  required: ["totalNutrient", "availableInventory"],
} as const;
/** Calculate compost nutrient available supplied factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetMass, dryFraction, nutrientFraction, suppliedAvailableFraction } =
    request;
  const compute = (): Output => {
    H.domain(wetMass >= 0);
    H.probability(dryFraction);
    H.probability(nutrientFraction);
    H.probability(suppliedAvailableFraction);
    return {
      totalNutrient: wetMass * dryFraction * nutrientFraction,
      availableInventory:
        wetMass * dryFraction * nutrientFraction * suppliedAvailableFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    wetMass: 1000,
    dryFraction: 0.5,
    nutrientFraction: 0.02,
    suppliedAvailableFraction: 0.3,
  },
  output: { totalNutrient: 10, availableInventory: 3 },
} satisfies ToolExample<Input, Output>;
export const compostNutrientAvailableSuppliedFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agrochemistry/compost-nutrient-available-supplied-factor",
      title: "Compost Nutrient Available Supplied Factor Tool",
      description:
        "Calculate compost nutrient available supplied factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          wetMass: { type: "number", minimum: 0 },
          dryFraction: { type: "number", minimum: 0, maximum: 1 },
          nutrientFraction: { type: "number", minimum: 0, maximum: 1 },
          suppliedAvailableFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: [
          "wetMass",
          "dryFraction",
          "nutrientFraction",
          "suppliedAvailableFraction",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          totalNutrient: { type: "number" },
          availableInventory: { type: "number" },
        },
        required: ["totalNutrient", "availableInventory"],
      },
      ports: {
        inputs: [
          {
            id: "wetMass",
            label: "Wet Mass",
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
            id: "suppliedAvailableFraction",
            label: "Supplied Available Fraction",
            required: true,
            valueType: { type: "number", unit: "1" },
          },
        ],
        outputs: [
          {
            id: "totalNutrient",
            label: "Total Nutrient",
            valueType: { type: "number" },
          },
          {
            id: "availableInventory",
            label: "Available Inventory",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = compostNutrientAvailableSuppliedFactorTool.execute;
export default compostNutrientAvailableSuppliedFactorTool;
