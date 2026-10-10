import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lowerPrediction: number;
  readonly upperPrediction: number;
  readonly actual: number;
};
export type Output = {
  readonly midpoint: number;
  readonly midpointMinusActual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerPrediction: { type: "number" },
    upperPrediction: { type: "number" },
    actual: { type: "number" },
  },
  required: ["lowerPrediction", "upperPrediction", "actual"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    midpoint: { type: "number" },
    midpointMinusActual: { type: "number" },
  },
  required: ["midpoint", "midpointMinusActual"],
} as const;
/** Compare the explicit midpoint of an ordered prediction interval with an actual observation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lowerPrediction, upperPrediction, actual } = request;
  const compute = (): Output => {
    H.domain(upperPrediction >= lowerPrediction, "upperPrediction");
    return {
      midpoint: lowerPrediction / 2 + upperPrediction / 2,
      midpointMinusActual: lowerPrediction / 2 + upperPrediction / 2 - actual,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lowerPrediction: 8, upperPrediction: 12, actual: 9 },
  output: { midpoint: 10, midpointMinusActual: 1 },
} satisfies ToolExample<Input, Output>;
export const intervalMidpointBiasContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["ai", "data"],
      fields: ["metrics", "evaluation metrics", "computer science"],
      keywords: ["evaluation metrics", "computer science"],
    },
    id: "metrics/interval-midpoint-bias-contribution",
    title: "Interval Midpoint Bias Contribution",
    description:
      "Compare the explicit midpoint of an ordered prediction interval with an actual observation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerPrediction: { type: "number" },
        upperPrediction: { type: "number" },
        actual: { type: "number" },
      },
      required: ["lowerPrediction", "upperPrediction", "actual"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        midpoint: { type: "number" },
        midpointMinusActual: { type: "number" },
      },
      required: ["midpoint", "midpointMinusActual"],
    },
    ports: {
      inputs: [
        {
          id: "lowerPrediction",
          label: "Lower Prediction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperPrediction",
          label: "Upper Prediction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "actual",
          label: "Actual",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "midpoint", label: "Midpoint", valueType: { type: "number" } },
        {
          id: "midpointMinusActual",
          label: "Midpoint Minus Actual",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = intervalMidpointBiasContributionTool.execute;
export default intervalMidpointBiasContributionTool;
