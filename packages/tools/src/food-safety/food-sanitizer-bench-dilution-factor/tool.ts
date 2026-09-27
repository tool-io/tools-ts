import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stockFraction: number;
  readonly stockVolume: number;
  readonly addedVolume: number;
};
export type Output = {
  readonly totalVolume: number;
  readonly finalFraction: number;
  readonly dilutionFactor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stockFraction: { type: "number", minimum: 0, maximum: 1 },
    stockVolume: { type: "number", exclusiveMinimum: 0 },
    addedVolume: { type: "number", minimum: 0 },
  },
  required: ["stockFraction", "stockVolume", "addedVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalVolume: { type: "number" },
    finalFraction: { type: "number" },
    dilutionFactor: { type: "number" },
  },
  required: ["totalVolume", "finalFraction", "dilutionFactor"],
} as const;
/** Ideal additive-volume arithmetic from caller-supplied bench values; no operating concentration is supplied. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stockFraction, stockVolume, addedVolume } = request;
  const compute = (): Output => {
    H.probability(stockFraction);
    H.positive(stockVolume);
    H.domain(addedVolume >= 0);
    return {
      totalVolume: stockVolume + addedVolume,
      finalFraction:
        (stockFraction * stockVolume) / (stockVolume + addedVolume),
      dilutionFactor: (stockVolume + addedVolume) / stockVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stockFraction: 0.1, stockVolume: 10, addedVolume: 90 },
  output: { totalVolume: 100, finalFraction: 0.01, dilutionFactor: 10 },
} satisfies ToolExample<Input, Output>;
export const foodSanitizerBenchDilutionFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-safety/food-sanitizer-bench-dilution-factor",
    title: "Food Sanitizer Bench Dilution Factor Tool",
    description:
      "Ideal additive-volume arithmetic from caller-supplied bench values; no operating concentration is supplied.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stockFraction: { type: "number", minimum: 0, maximum: 1 },
        stockVolume: { type: "number", exclusiveMinimum: 0 },
        addedVolume: { type: "number", minimum: 0 },
      },
      required: ["stockFraction", "stockVolume", "addedVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalVolume: { type: "number" },
        finalFraction: { type: "number" },
        dilutionFactor: { type: "number" },
      },
      required: ["totalVolume", "finalFraction", "dilutionFactor"],
    },
    ports: {
      inputs: [
        {
          id: "stockFraction",
          label: "Stock Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "stockVolume",
          label: "Stock Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "addedVolume",
          label: "Added Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "totalVolume",
          label: "Total Volume",
          valueType: { type: "number" },
        },
        {
          id: "finalFraction",
          label: "Final Fraction",
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "dilutionFactor",
          label: "Dilution Factor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodSanitizerBenchDilutionFactorTool.execute;
export default foodSanitizerBenchDilutionFactorTool;
