import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leftSecond: number;
  readonly rightSecond: number;
  readonly span: number;
};
export type Output = {
  readonly leftSlopeContribution: number;
  readonly rightSlopeContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftSecond: { type: "number" },
    rightSecond: { type: "number" },
    span: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["leftSecond", "rightSecond", "span"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftSlopeContribution: { type: "number" },
    rightSlopeContribution: { type: "number" },
  },
  required: ["leftSlopeContribution", "rightSlopeContribution"],
} as const;
/** Return the endpoint slope corrections to a secant from cubic-spline endpoint second derivatives. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { leftSecond, rightSecond, span } = input;
  const compute = (): Output => {
    H.positive(span);
    return {
      leftSlopeContribution: (-span * (2 * leftSecond + rightSecond)) / 6,
      rightSlopeContribution: (span * (leftSecond + 2 * rightSecond)) / 6,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { leftSecond: 3, rightSecond: 6, span: 2 },
  output: { leftSlopeContribution: -4, rightSlopeContribution: 5 },
} satisfies ToolExample<Input, Output>;
export const splineEndpointClampedWeightPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "interpolation/spline-endpoint-clamped-weight-pair",
    title: "Spline Endpoint Clamped Weight Pair Tool",
    description:
      "Return the endpoint slope corrections to a secant from cubic-spline endpoint second derivatives.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftSecond: { type: "number" },
        rightSecond: { type: "number" },
        span: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["leftSecond", "rightSecond", "span"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftSlopeContribution: { type: "number" },
        rightSlopeContribution: { type: "number" },
      },
      required: ["leftSlopeContribution", "rightSlopeContribution"],
    },
    ports: {
      inputs: [
        {
          id: "leftSecond",
          label: "Left Second",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightSecond",
          label: "Right Second",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "span",
          label: "Span",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "leftSlopeContribution",
          label: "Left Slope Contribution",
          valueType: { type: "number" },
        },
        {
          id: "rightSlopeContribution",
          label: "Right Slope Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = splineEndpointClampedWeightPairTool.execute;
export default splineEndpointClampedWeightPairTool;
