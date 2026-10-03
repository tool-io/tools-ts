import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly lower: number; readonly upper: number };
export type Output = {
  readonly median: number;
  readonly intervalWidth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lower: { type: "number" }, upper: { type: "number" } },
  required: ["lower", "upper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { median: { type: "number" }, intervalWidth: { type: "number" } },
  required: ["median", "intervalWidth"],
} as const;
/** Calculate sample median two middle average range from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { lower, upper } = input;
  const compute = (): Output => {
    H.domain(lower <= upper);
    return { median: lower / 2 + upper / 2, intervalWidth: upper - lower };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { lower: 2, upper: 8 },
  output: { median: 5, intervalWidth: 6 },
} satisfies ToolExample<Input, Output>;
export const sampleMedianTwoMiddleAverageRangeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "statistics/sample-median-two-middle-average-range",
    title: "Sample Median Two Middle Average Range Tool",
    description:
      "Calculate sample median two middle average range from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { lower: { type: "number" }, upper: { type: "number" } },
      required: ["lower", "upper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        median: { type: "number" },
        intervalWidth: { type: "number" },
      },
      required: ["median", "intervalWidth"],
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
      ],
      outputs: [
        { id: "median", label: "Median", valueType: { type: "number" } },
        {
          id: "intervalWidth",
          label: "Interval Width",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sampleMedianTwoMiddleAverageRangeTool.execute;
export default sampleMedianTwoMiddleAverageRangeTool;
