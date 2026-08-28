import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const peakCurrentFromRmsExample = {
  input: { rmsCurrentA: 10 },
} satisfies ToolExample<{ readonly rmsCurrentA: number }>;

export const peakCurrentFromRmsTool = createSimpleTool({
  id: "electronics/peak-current-from-rms",
  title: "Peak From RMS",
  description: "Calculate the peak current of a sinusoid from its RMS current.",
  inputs: [
    { id: "rmsCurrentA", label: "RMS current", kind: "number", unit: "A" },
  ],
  outputs: [
    { id: "peakCurrentA", label: "Peak current", kind: "number", unit: "A" },
  ],
  calculate: (input) => ({
    peakCurrentA: (input.rmsCurrentA as number) * Math.SQRT2,
  }),
});
export const runPeakCurrentFromRms = peakCurrentFromRmsTool.execute;
export default peakCurrentFromRmsTool;
