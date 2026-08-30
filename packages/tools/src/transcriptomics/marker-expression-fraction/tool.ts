import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly markerCounts: readonly number[];
  readonly minimumDetectedCount: number;
}>;
export type Output = Readonly<{
  readonly detectedCells: number;
  readonly expressionPercent: number;
  readonly meanExpression: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.markerCounts.length === 0 ||
    input.markerCounts.some((v) => v < 0) ||
    input.minimumDetectedCount < 0
  )
    simpleError(
      "markerCounts",
      "Nonnegative per-cell marker counts are required.",
    );
  const detectedCells = input.markerCounts.filter(
    (v) => v >= input.minimumDetectedCount,
  ).length;
  return {
    detectedCells,
    expressionPercent: (detectedCells / input.markerCounts.length) * 100,
    meanExpression:
      input.markerCounts.reduce((a, b) => a + b, 0) / input.markerCounts.length,
  };
};

export const exampleInput = {
  markerCounts: [0, 2, 4, 0],
  minimumDetectedCount: 1,
} satisfies Input;
export const exampleOutput = {
  detectedCells: 2,
  expressionPercent: 50,
  meanExpression: 1.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/marker-expression-fraction",
  title: "Marker Expression Fraction",
  description:
    "Summarize a marker dot plot’s detection share and mean expression.",
  inputs: [
    { id: "markerCounts", kind: "numberList", label: "Marker counts" },
    {
      id: "minimumDetectedCount",
      kind: "number",
      label: "Minimum detected count",
    },
  ],
  outputs: [
    { id: "detectedCells", kind: "number", label: "Detected cells" },
    { id: "expressionPercent", kind: "number", label: "Expression percent" },
    { id: "meanExpression", kind: "number", label: "Mean expression" },
  ],
  calculate: (value) =>
    calculate({
      markerCounts: value.markerCounts as readonly number[],
      minimumDetectedCount: value.minimumDetectedCount as number,
    }),
});
export const run = tool.execute;
export default tool;
