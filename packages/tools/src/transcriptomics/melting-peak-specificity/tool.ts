import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly peakTemperaturesC: readonly number[];
  readonly peakHeights: readonly number[];
  readonly minimumRelativePeakHeight: number;
}>;
export type Output = Readonly<{
  readonly significantPeakCount: number;
  readonly primaryPeakC: number;
  readonly specific: boolean;
}>;

export const calculate = (input: Input): Output => {
  const n = input.peakTemperaturesC.length;
  if (
    n === 0 ||
    input.peakHeights.length !== n ||
    input.peakHeights.some((v) => v < 0) ||
    input.minimumRelativePeakHeight < 0 ||
    input.minimumRelativePeakHeight > 1
  )
    simpleError(
      "peakHeights",
      "Aligned peak positions and nonnegative heights required.",
    );
  const max = Math.max(...input.peakHeights);
  if (max <= 0)
    simpleError("peakHeights", "At least one positive peak required.");
  const significantPeakCount = input.peakHeights.filter(
    (v) => v >= max * input.minimumRelativePeakHeight,
  ).length;
  return {
    significantPeakCount,
    primaryPeakC: input.peakTemperaturesC[input.peakHeights.indexOf(max)],
    specific: significantPeakCount === 1,
  };
};

export const exampleInput = {
  peakTemperaturesC: [80, 85, 95],
  peakHeights: [5, 100, 4],
  minimumRelativePeakHeight: 0.1,
} satisfies Input;
export const exampleOutput = {
  significantPeakCount: 1,
  primaryPeakC: 85,
  specific: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "transcriptomics/melting-peak-specificity",
  title: "Melting Peak Specificity",
  description:
    "Gate amplicon specificity by significant melting-curve peak count.",
  inputs: [
    {
      id: "peakTemperaturesC",
      kind: "numberList",
      label: "Peak temperatures c",
    },
    { id: "peakHeights", kind: "numberList", label: "Peak heights" },
    {
      id: "minimumRelativePeakHeight",
      kind: "number",
      label: "Minimum relative peak height",
    },
  ],
  outputs: [
    {
      id: "significantPeakCount",
      kind: "number",
      label: "Significant peak count",
    },
    { id: "primaryPeakC", kind: "number", label: "Primary peak c" },
    { id: "specific", kind: "boolean", label: "Specific" },
  ],
  calculate: (value) =>
    calculate({
      peakTemperaturesC: value.peakTemperaturesC as readonly number[],
      peakHeights: value.peakHeights as readonly number[],
      minimumRelativePeakHeight: value.minimumRelativePeakHeight as number,
    }),
});
export const run = tool.execute;
export default tool;
