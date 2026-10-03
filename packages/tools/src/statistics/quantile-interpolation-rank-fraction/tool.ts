import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly count: number; readonly probability: number };
export type Output = {
  readonly lowerIndex: number;
  readonly upperIndex: number;
  readonly fraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 1 },
    probability: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["count", "probability"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerIndex: { type: "integer" },
    upperIndex: { type: "integer" },
    fraction: { type: "number" },
  },
  required: ["lowerIndex", "upperIndex", "fraction"],
} as const;
/** Return zero-based Type-7 linear quantile indexes and interpolation fraction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { count, probability } = request;
  const compute = (): Output => {
    H.integer(count, 1);
    H.probability(probability);
    const rank = (count - 1) * probability;
    return {
      lowerIndex: Math.floor(rank),
      upperIndex: Math.ceil(rank),
      fraction: rank - Math.floor(rank),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { count: 6, probability: 0.25 },
  output: { lowerIndex: 1, upperIndex: 2, fraction: 0.25 },
} satisfies ToolExample<Input, Output>;
export const quantileInterpolationRankFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "statistics/quantile-interpolation-rank-fraction",
    title: "Quantile Interpolation Rank Fraction Tool",
    description:
      "Return zero-based Type-7 linear quantile indexes and interpolation fraction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        count: { type: "integer", minimum: 1 },
        probability: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["count", "probability"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerIndex: { type: "integer" },
        upperIndex: { type: "integer" },
        fraction: { type: "number" },
      },
      required: ["lowerIndex", "upperIndex", "fraction"],
    },
    ports: {
      inputs: [
        {
          id: "count",
          label: "Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "probability",
          label: "Probability",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "lowerIndex",
          label: "Lower Index",
          valueType: { type: "integer" },
        },
        {
          id: "upperIndex",
          label: "Upper Index",
          valueType: { type: "integer" },
        },
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = quantileInterpolationRankFractionTool.execute;
export default quantileInterpolationRankFractionTool;
