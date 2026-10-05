import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseMass: number;
  readonly baseFraction: number;
  readonly stockMass: number;
  readonly stockFraction: number;
};
export type Output = { readonly mixtureFraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseMass: { type: "number", minimum: 0 },
    baseFraction: { type: "number", minimum: 0, maximum: 1 },
    stockMass: { type: "number", minimum: 0 },
    stockFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["baseMass", "baseFraction", "stockMass", "stockFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { mixtureFraction: { type: "number" } },
  required: ["mixtureFraction"],
} as const;
/** Mix one stock addition into a base using mass fractions and total-mass conservation, with no reaction or volume-additivity assumption. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseMass, baseFraction, stockMass, stockFraction } = request;
  const compute = (): Output => {
    H.domain(
      baseMass >= 0 && stockMass >= 0 && baseMass + stockMass > 0,
      "baseMass",
    );
    H.finite(baseMass + stockMass);
    (H.domain(baseFraction >= 0 && baseFraction <= 1, "baseFraction"),
      baseFraction);
    (H.domain(stockFraction >= 0 && stockFraction <= 1, "stockFraction"),
      stockFraction);
    return {
      mixtureFraction:
        (baseMass / (baseMass + stockMass)) * baseFraction +
        (stockMass / (baseMass + stockMass)) * stockFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baseMass: 80, baseFraction: 0.1, stockMass: 20, stockFraction: 0.6 },
  output: { mixtureFraction: 0.2 },
} satisfies ToolExample<Input, Output>;
export const recipeSpikeStockMassFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "proportions/recipe-spike-stock-mass-fraction",
    title: "Recipe Spike Stock Mass Fraction Tool",
    description:
      "Mix one stock addition into a base using mass fractions and total-mass conservation, with no reaction or volume-additivity assumption.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseMass: { type: "number", minimum: 0 },
        baseFraction: { type: "number", minimum: 0, maximum: 1 },
        stockMass: { type: "number", minimum: 0 },
        stockFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["baseMass", "baseFraction", "stockMass", "stockFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { mixtureFraction: { type: "number" } },
      required: ["mixtureFraction"],
    },
    ports: {
      inputs: [
        {
          id: "baseMass",
          label: "Base Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "baseFraction",
          label: "Base Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stockMass",
          label: "Stock Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stockFraction",
          label: "Stock Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "mixtureFraction",
          label: "Mixture Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = recipeSpikeStockMassFractionTool.execute;
export default recipeSpikeStockMassFractionTool;
