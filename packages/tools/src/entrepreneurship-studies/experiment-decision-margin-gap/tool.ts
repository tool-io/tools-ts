import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly estimate: number;
  readonly decisionThreshold: number;
  readonly lowerUncertainty: number;
  readonly upperUncertainty: number;
};
export type Output = {
  readonly pointMargin: number;
  readonly lowerMargin: number;
  readonly upperMargin: number;
  readonly straddles: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    estimate: { type: "number" },
    decisionThreshold: { type: "number" },
    lowerUncertainty: { type: "number", minimum: 0 },
    upperUncertainty: { type: "number", minimum: 0 },
  },
  required: [
    "estimate",
    "decisionThreshold",
    "lowerUncertainty",
    "upperUncertainty",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pointMargin: { type: "number" },
    lowerMargin: { type: "number" },
    upperMargin: { type: "number" },
    straddles: { type: "boolean" },
  },
  required: ["pointMargin", "lowerMargin", "upperMargin", "straddles"],
} as const;
/** Calculate experiment decision margin gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { estimate, decisionThreshold, lowerUncertainty, upperUncertainty } =
    request;
  const compute = (): Output => {
    H.domain(lowerUncertainty >= 0 && upperUncertainty >= 0);
    return {
      pointMargin: estimate - decisionThreshold,
      lowerMargin: estimate - lowerUncertainty - decisionThreshold,
      upperMargin: estimate + upperUncertainty - decisionThreshold,
      straddles:
        estimate - lowerUncertainty < decisionThreshold &&
        estimate + upperUncertainty > decisionThreshold,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    estimate: 5,
    decisionThreshold: 4,
    lowerUncertainty: 2,
    upperUncertainty: 1,
  },
  output: { pointMargin: 1, lowerMargin: -1, upperMargin: 2, straddles: true },
} satisfies ToolExample<Input, Output>;
export const experimentDecisionMarginGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entrepreneurship-studies/experiment-decision-margin-gap",
    title: "Experiment Decision Margin Gap Tool",
    description:
      "Calculate experiment decision margin gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        estimate: { type: "number" },
        decisionThreshold: { type: "number" },
        lowerUncertainty: { type: "number", minimum: 0 },
        upperUncertainty: { type: "number", minimum: 0 },
      },
      required: [
        "estimate",
        "decisionThreshold",
        "lowerUncertainty",
        "upperUncertainty",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pointMargin: { type: "number" },
        lowerMargin: { type: "number" },
        upperMargin: { type: "number" },
        straddles: { type: "boolean" },
      },
      required: ["pointMargin", "lowerMargin", "upperMargin", "straddles"],
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
          id: "decisionThreshold",
          label: "Decision Threshold",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerUncertainty",
          label: "Lower Uncertainty",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperUncertainty",
          label: "Upper Uncertainty",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "pointMargin",
          label: "Point Margin",
          valueType: { type: "number" },
        },
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
        { id: "straddles", label: "Straddles", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = experimentDecisionMarginGapTool.execute;
export default experimentDecisionMarginGapTool;
