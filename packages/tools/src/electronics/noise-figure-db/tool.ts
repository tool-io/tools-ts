import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const noiseFigureDbExample = {
  input: { noiseFigureDb: 3 },
} satisfies ToolExample<{
  readonly noiseFigureDb: number;
}>;

export const noiseFigureDbTool = createSimpleTool({
  id: "electronics/noise-figure-db",
  title: "Noise Figure To Factor",
  description:
    "Convert a system noise figure in decibels to a linear noise factor.",
  inputs: [{ id: "noiseFigureDb", label: "Noise figure", kind: "number" }],
  outputs: [{ id: "noiseFactor", label: "Noise factor", kind: "number" }],
  calculate: (input) => {
    const noiseFigureDb = input.noiseFigureDb as number;
    return { noiseFactor: Math.pow(10, noiseFigureDb / 10) };
  },
});
export const runNoiseFigureDb = noiseFigureDbTool.execute;
export default noiseFigureDbTool;
