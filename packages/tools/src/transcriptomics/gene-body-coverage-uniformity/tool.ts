import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly decileReadCounts: readonly number[];
  readonly maximumCvPercent: number;
}>;
export type Output = Readonly<{
  readonly meanDecileReads: number;
  readonly coefficientOfVariationPercent: number;
  readonly uniform: boolean;
}>;

export const calculate = (input: Input): Output => {
  const x = input.decileReadCounts;
  if (x.length < 2 || x.some((v) => v < 0))
    simpleError(
      "decileReadCounts",
      "At least two nonnegative coverage bins required.",
    );
  const meanDecileReads = x.reduce((a, b) => a + b, 0) / x.length;
  if (meanDecileReads <= 0)
    simpleError("decileReadCounts", "Mean coverage must be positive.");
  const sd = Math.sqrt(
      x.reduce((s, v) => s + (v - meanDecileReads) ** 2, 0) / x.length,
    ),
    coefficientOfVariationPercent = (sd / meanDecileReads) * 100;
  return {
    meanDecileReads,
    coefficientOfVariationPercent,
    uniform: coefficientOfVariationPercent <= input.maximumCvPercent,
  };
};

export const exampleInput = {
  decileReadCounts: [10, 10, 10, 10],
  maximumCvPercent: 5,
} satisfies Input;
export const exampleOutput = {
  meanDecileReads: 10,
  coefficientOfVariationPercent: 0,
  uniform: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/gene-body-coverage-uniformity",
  title: "Gene Body Coverage Uniformity",
  description:
    "Rate gene-body coverage uniformity using decile coefficient of variation.",
  inputs: [
    { id: "decileReadCounts", kind: "numberList", label: "Decile read counts" },
    { id: "maximumCvPercent", kind: "number", label: "Maximum cv percent" },
  ],
  outputs: [
    { id: "meanDecileReads", kind: "number", label: "Mean decile reads" },
    {
      id: "coefficientOfVariationPercent",
      kind: "number",
      label: "Coefficient of variation percent",
    },
    { id: "uniform", kind: "boolean", label: "Uniform" },
  ],
  calculate: (value) =>
    calculate({
      decileReadCounts: value.decileReadCounts as readonly number[],
      maximumCvPercent: value.maximumCvPercent as number,
    }),
});
export const run = tool.execute;
export default tool;
