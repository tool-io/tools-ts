import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly timesMinutes: readonly number[];
  readonly totalIonIntensities: readonly number[];
}>;
export type Output = Readonly<{
  readonly area: number;
  readonly peakIntensity: number;
}>;
export const calculate = (input: Input): Output => {
  const t = input.timesMinutes,
    y = input.totalIonIntensities,
    n = t.length;
  if (
    n < 2 ||
    n !== y.length ||
    t.some((v, i) => i > 0 && v <= t[i - 1]) ||
    y.some((v) => v < 0)
  )
    simpleError(
      "timesMinutes",
      "Aligned increasing times and nonnegative ion intensities required.",
    );
  let area = 0;
  for (let i = 1; i < n; i++)
    area += ((t[i] - t[i - 1]) * (y[i] + y[i - 1])) / 2;
  return { area, peakIntensity: Math.max(...y) };
};
export const exampleInput = {
  timesMinutes: [0, 1, 2],
  totalIonIntensities: [0, 10, 0],
} satisfies Input;
export const exampleOutput = { area: 10, peakIntensity: 10 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/tic-area",
  title: "TIC Area",
  description: "Integrate a total-ion chromatogram using trapezoidal area.",
  inputs: [
    { id: "timesMinutes", kind: "numberList", label: "Times minutes" },
    {
      id: "totalIonIntensities",
      kind: "numberList",
      label: "Total ion intensities",
    },
  ],
  outputs: [
    { id: "area", kind: "number", label: "Area" },
    { id: "peakIntensity", kind: "number", label: "Peak intensity" },
  ],
  calculate: (value) =>
    calculate({
      timesMinutes: value.timesMinutes as readonly number[],
      totalIonIntensities: value.totalIonIntensities as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
