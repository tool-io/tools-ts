import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly estimate: number;
  readonly lowerBound: number;
  readonly upperBound: number;
};
export type Output = {
  readonly lowerMargin: number;
  readonly upperMargin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    estimate: { type: "number" },
    lowerBound: { type: "number" },
    upperBound: { type: "number" },
  },
  required: ["estimate", "lowerBound", "upperBound"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerMargin: { type: "number" },
    upperMargin: { type: "number" },
  },
  required: ["lowerMargin", "upperMargin"],
} as const;
/** Split a supplied interval around an estimate into separate lower and upper margins; no confidence level is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { estimate, lowerBound, upperBound } = request;
  const compute = (): Output => {
    H.domain(lowerBound <= estimate && estimate <= upperBound, "lowerBound");
    return {
      lowerMargin: estimate - lowerBound,
      upperMargin: upperBound - estimate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { estimate: 10, lowerBound: 7, upperBound: 15 },
  output: { lowerMargin: 3, upperMargin: 5 },
} satisfies ToolExample<Input, Output>;
export const confidenceIntervalAsymmetricMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "statistics/confidence-interval-asymmetric-margin",
    title: "Confidence Interval Asymmetric Margin Tool",
    description:
      "Split a supplied interval around an estimate into separate lower and upper margins; no confidence level is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        estimate: { type: "number" },
        lowerBound: { type: "number" },
        upperBound: { type: "number" },
      },
      required: ["estimate", "lowerBound", "upperBound"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerMargin: { type: "number" },
        upperMargin: { type: "number" },
      },
      required: ["lowerMargin", "upperMargin"],
    },
    ports: {
      inputs: [
        {
          id: "estimate",
          label: "Estimate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerBound",
          label: "Lower Bound",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperBound",
          label: "Upper Bound",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "lowerMargin",
          label: "Lower Margin",
          valueType: { type: "number" },
        },
        {
          id: "upperMargin",
          label: "Upper Margin",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = confidenceIntervalAsymmetricMarginTool.execute;
export default confidenceIntervalAsymmetricMarginTool;
