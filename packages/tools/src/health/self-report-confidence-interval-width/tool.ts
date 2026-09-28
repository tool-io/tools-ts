import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lower: number;
  readonly upper: number;
  readonly estimate: number;
};
export type Output = {
  readonly width: number;
  readonly lowerMargin: number;
  readonly upperMargin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lower: { type: "number" },
    upper: { type: "number" },
    estimate: { type: "number" },
  },
  required: ["lower", "upper", "estimate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "number" },
    lowerMargin: { type: "number" },
    upperMargin: { type: "number" },
  },
  required: ["width", "lowerMargin", "upperMargin"],
} as const;
/** Calculate self report confidence interval width from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lower, upper, estimate } = request;
  const compute = (): Output => {
    H.domain(lower <= estimate && estimate <= upper);
    return {
      width: upper - lower,
      lowerMargin: estimate - lower,
      upperMargin: upper - estimate,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lower: 2, upper: 8, estimate: 5 },
  output: { width: 6, lowerMargin: 3, upperMargin: 3 },
} satisfies ToolExample<Input, Output>;
export const selfReportConfidenceIntervalWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health/self-report-confidence-interval-width",
    title: "Self Report Confidence Interval Width Tool",
    description:
      "Calculate self report confidence interval width from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lower: { type: "number" },
        upper: { type: "number" },
        estimate: { type: "number" },
      },
      required: ["lower", "upper", "estimate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        width: { type: "number" },
        lowerMargin: { type: "number" },
        upperMargin: { type: "number" },
      },
      required: ["width", "lowerMargin", "upperMargin"],
    },
    ports: {
      inputs: [
        {
          id: "lower",
          label: "Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upper",
          label: "Upper",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "estimate",
          label: "Estimate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "width", label: "Width", valueType: { type: "number" } },
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
export const run = selfReportConfidenceIntervalWidthTool.execute;
export default selfReportConfidenceIntervalWidthTool;
