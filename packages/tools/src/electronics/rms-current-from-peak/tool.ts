import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const rmsCurrentFromPeakExample = {
  input: { peakCurrentA: 10 },
} satisfies ToolExample<{ readonly peakCurrentA: number }>;

export const rmsCurrentFromPeakTool = createSimpleTool({
  id: "electronics/rms-current-from-peak",
  title: "RMS From Peak",
  description: "Calculate the RMS current of a sinusoid from its peak current.",
  inputs: [
    {
      id: "peakCurrentA",
      label: "Peak current",
      kind: "number",
      minimum: 0,
      unit: "A",
    },
  ],
  outputs: [
    { id: "rmsCurrentA", label: "RMS current", kind: "number", unit: "A" },
  ],
  calculate: (input) => ({
    rmsCurrentA: (input.peakCurrentA as number) / Math.SQRT2,
  }),
});
export const runRmsCurrentFromPeak = rmsCurrentFromPeakTool.execute;
export default rmsCurrentFromPeakTool;
