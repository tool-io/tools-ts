import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const bandwidthFromQExample = {
  input: { qFactor: 50, resonantFreqHz: 1000 },
} satisfies ToolExample<{
  readonly qFactor: number;
  readonly resonantFreqHz: number;
}>;

export const bandwidthFromQTool = createSimpleTool({
  id: "electronics/bandwidth-from-q",
  title: "Bandwidth From Q",
  description:
    "Calculate the bandwidth of a resonant circuit from its resonant frequency and quality factor.",
  inputs: [
    {
      id: "resonantFreqHz",
      label: "Resonant frequency",
      kind: "number",
      unit: "Hz",
    },
    { id: "qFactor", label: "Quality factor", kind: "number" },
  ],
  outputs: [
    { id: "bandwidthHz", label: "Bandwidth", kind: "number", unit: "Hz" },
  ],
  calculate: (input) => {
    const resonantFreqHz = input.resonantFreqHz as number;
    const qFactor = input.qFactor as number;
    if (resonantFreqHz <= 0)
      simpleError("resonantFreqHz", "Resonant frequency must be positive.");
    if (qFactor <= 0)
      simpleError("qFactor", "Quality factor must be positive.");
    return { bandwidthHz: resonantFreqHz / qFactor };
  },
});
export const runBandwidthFromQ = bandwidthFromQTool.execute;
export default bandwidthFromQTool;
