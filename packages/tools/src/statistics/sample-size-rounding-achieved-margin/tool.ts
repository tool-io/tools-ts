import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly unroundedSize: number; readonly margin: number };
export type Output = {
  readonly sampleSize: number;
  readonly achievedMargin: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unroundedSize: { type: "number", exclusiveMinimum: 0 },
    margin: { type: "number", minimum: 0 },
  },
  required: ["unroundedSize", "margin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleSize: { type: "integer" },
    achievedMargin: { type: "number" },
  },
  required: ["sampleSize", "achievedMargin"],
} as const;
/** Calculate sample size rounding achieved margin from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { unroundedSize, margin } = request;
  const compute = (): Output => {
    H.positive(unroundedSize);
    H.domain(margin >= 0);
    const sampleSize = Math.ceil(unroundedSize);
    return {
      sampleSize,
      achievedMargin: margin * Math.sqrt(unroundedSize / sampleSize),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { unroundedSize: 90.25, margin: 0.1 },
  output: { sampleSize: 91, achievedMargin: 0.09958705948858225 },
} satisfies ToolExample<Input, Output>;
export const sampleSizeRoundingAchievedMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "statistics/sample-size-rounding-achieved-margin",
    title: "Sample Size Rounding Achieved Margin Tool",
    description:
      "Calculate sample size rounding achieved margin from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unroundedSize: { type: "number", exclusiveMinimum: 0 },
        margin: { type: "number", minimum: 0 },
      },
      required: ["unroundedSize", "margin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleSize: { type: "integer" },
        achievedMargin: { type: "number" },
      },
      required: ["sampleSize", "achievedMargin"],
    },
    ports: {
      inputs: [
        {
          id: "unroundedSize",
          label: "Unrounded Size",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "margin",
          label: "Margin",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "sampleSize",
          label: "Sample Size",
          valueType: { type: "integer" },
        },
        {
          id: "achievedMargin",
          label: "Achieved Margin",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sampleSizeRoundingAchievedMarginTool.execute;
export default sampleSizeRoundingAchievedMarginTool;
