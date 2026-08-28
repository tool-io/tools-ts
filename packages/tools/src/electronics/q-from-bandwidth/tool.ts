import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type QFromBandwidthInput = {
  readonly bandwidthHz: number;
  readonly resonantFreqHz: number;
};

export type QFromBandwidthOutput = {
  readonly qFactor: number;
};

export const qFromBandwidthExample = {
  input: { bandwidthHz: 100, resonantFreqHz: 1000 },
  output: { qFactor: 10 },
} satisfies ToolExample<QFromBandwidthInput, QFromBandwidthOutput>;

export const qFromBandwidthTool = createSimpleTool({
  calculate: (input) => {
    const { bandwidthHz, resonantFreqHz } =
      input as unknown as QFromBandwidthInput;
    if (resonantFreqHz <= 0)
      simpleError(
        "resonantFreqHz",
        "Resonant frequency must be positive.",
        "degenerate_input",
      );
    if (bandwidthHz <= 0)
      simpleError(
        "bandwidthHz",
        "Bandwidth must be positive.",
        "degenerate_input",
      );
    return { qFactor: resonantFreqHz / bandwidthHz };
  },
  description:
    "Compute the quality factor of a resonant circuit from its resonant frequency and bandwidth.",
  id: "electronics/q-from-bandwidth",
  inputs: [
    {
      id: "resonantFreqHz",
      kind: "number",
      label: "Resonant frequency",
      unit: "Hz",
    },
    { id: "bandwidthHz", kind: "number", label: "Bandwidth", unit: "Hz" },
  ],
  outputs: [{ id: "qFactor", kind: "number", label: "Quality factor" }],
  title: "Q From Bandwidth",
});
export const runQFromBandwidth = qFromBandwidthTool.execute;
export default qFromBandwidthTool;
