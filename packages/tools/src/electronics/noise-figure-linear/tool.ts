import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const noiseFigureLinearExample = {
  input: { noiseFactor: 2 },
} satisfies ToolExample<{
  readonly noiseFactor: number;
}>;

export const noiseFigureLinearTool = createSimpleTool({
  id: "electronics/noise-figure-linear",
  title: "Factor To Noise Figure",
  description:
    "Convert a linear noise factor to an equivalent system noise figure in decibels.",
  inputs: [{ id: "noiseFactor", label: "Noise factor", kind: "number" }],
  outputs: [{ id: "noiseFigureDb", label: "Noise figure", kind: "number" }],
  calculate: (input) => {
    const noiseFactor = input.noiseFactor as number;
    if (noiseFactor < 1)
      simpleError(
        "noiseFactor",
        "Noise factor must be at least one.",
        "below_unity",
      );
    return { noiseFigureDb: 10 * Math.log10(noiseFactor) };
  },
});
export const runNoiseFigureLinear = noiseFigureLinearTool.execute;
export default noiseFigureLinearTool;
