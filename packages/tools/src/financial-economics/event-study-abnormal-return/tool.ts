import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedReturnFraction: number;
  readonly benchmarkReturnFraction: number;
};
export type Output = { readonly abnormalReturn: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedReturnFraction: { type: "number" },
    benchmarkReturnFraction: { type: "number" },
  },
  required: ["observedReturnFraction", "benchmarkReturnFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { abnormalReturn: { type: "number" } },
  required: ["abnormalReturn"],
} as const;
/** Subtract an explicit benchmark return from an observed return without estimating the benchmark or statistical significance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedReturnFraction, benchmarkReturnFraction } = request;
  const compute = (): Output => {
    return { abnormalReturn: observedReturnFraction - benchmarkReturnFraction };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedReturnFraction: 0.05, benchmarkReturnFraction: 0.02 },
  output: { abnormalReturn: 0.030000000000000002 },
} satisfies ToolExample<Input, Output>;
export const eventStudyAbnormalReturnTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "trading"],
      fields: ["financial-economics", "financial economics", "economics"],
      keywords: ["financial economics", "economics"],
    },
    id: "financial-economics/event-study-abnormal-return",
    title: "Event Study Abnormal Return",
    description:
      "Subtract an explicit benchmark return from an observed return without estimating the benchmark or statistical significance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedReturnFraction: { type: "number" },
        benchmarkReturnFraction: { type: "number" },
      },
      required: ["observedReturnFraction", "benchmarkReturnFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { abnormalReturn: { type: "number" } },
      required: ["abnormalReturn"],
    },
    ports: {
      inputs: [
        {
          id: "observedReturnFraction",
          label: "Observed Return Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "benchmarkReturnFraction",
          label: "Benchmark Return Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "abnormalReturn",
          label: "Abnormal Return",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = eventStudyAbnormalReturnTool.execute;
export default eventStudyAbnormalReturnTool;
