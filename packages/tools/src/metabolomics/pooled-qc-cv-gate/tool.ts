import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly pooledQcMeasurements: readonly number[];
  readonly maximumCvPercent: number;
}>;
export type Output = Readonly<{
  readonly cvPercent: number;
  readonly passes: boolean;
}>;
export const calculate = (input: Input): Output => {
  const x = input.pooledQcMeasurements;
  if (x.length < 2 || x.some((v) => v < 0))
    simpleError(
      "pooledQcMeasurements",
      "At least two nonnegative QC measurements required.",
    );
  const mean = x.reduce((a, b) => a + b, 0) / x.length;
  if (mean <= 0)
    simpleError("pooledQcMeasurements", "QC mean must be positive.");
  const cvPercent =
    (Math.sqrt(x.reduce((s, v) => s + (v - mean) ** 2, 0) / x.length) / mean) *
    100;
  return { cvPercent, passes: cvPercent <= input.maximumCvPercent };
};
export const exampleInput = {
  pooledQcMeasurements: [9, 10, 11],
  maximumCvPercent: 10,
} satisfies Input;
export const exampleOutput = {
  cvPercent: 8.16496580927726,
  passes: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/pooled-qc-cv-gate",
  title: "Pooled QC Cv Gate",
  description: "Gate pooled metabolomics QC by coefficient of variation.",
  inputs: [
    {
      id: "pooledQcMeasurements",
      kind: "numberList",
      label: "Pooled qc measurements",
    },
    { id: "maximumCvPercent", kind: "number", label: "Maximum cv percent" },
  ],
  outputs: [
    { id: "cvPercent", kind: "number", label: "Cv percent" },
    { id: "passes", kind: "boolean", label: "Passes" },
  ],
  calculate: (value) =>
    calculate({
      pooledQcMeasurements: value.pooledQcMeasurements as readonly number[],
      maximumCvPercent: value.maximumCvPercent as number,
    }),
});
export const run = tool.execute;
export default tool;
