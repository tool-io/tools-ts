import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly peakAreas: readonly number[];
  readonly targetTotal: number;
}>;
export type Output = Readonly<{
  readonly normalizedAreas: readonly number[];
  readonly scalingFactor: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.peakAreas.length === 0 ||
    input.peakAreas.some((v) => v < 0) ||
    input.targetTotal <= 0
  )
    simpleError(
      "peakAreas",
      "Nonnegative areas and positive target TIC required.",
    );
  const total = input.peakAreas.reduce((a, b) => a + b, 0);
  if (total <= 0)
    simpleError("peakAreas", "Total ion current must be positive.");
  const scalingFactor = input.targetTotal / total;
  return {
    normalizedAreas: input.peakAreas.map((v) => v * scalingFactor),
    scalingFactor,
  };
};
export const exampleInput = {
  peakAreas: [10, 20],
  targetTotal: 100,
} satisfies Input;
export const exampleOutput = {
  normalizedAreas: [33.333333333333336, 66.66666666666667],
  scalingFactor: 3.3333333333333335,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/tic-signal-normalization",
  title: "TIC Signal Normalization",
  description: "Scale a peak-area vector to a supplied total ion current.",
  inputs: [
    { id: "peakAreas", kind: "numberList", label: "Peak areas" },
    { id: "targetTotal", kind: "number", label: "Target total" },
  ],
  outputs: [
    { id: "normalizedAreas", kind: "numberList", label: "Normalized areas" },
    { id: "scalingFactor", kind: "number", label: "Scaling factor" },
  ],
  calculate: (value) =>
    calculate({
      peakAreas: value.peakAreas as readonly number[],
      targetTotal: value.targetTotal as number,
    }),
});
export const run = tool.execute;
export default tool;
