import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const lnaGainExample = {
  input: { vInRms: 0.01, vOutRms: 0.1 },
} satisfies ToolExample<{
  readonly vInRms: number;
  readonly vOutRms: number;
}>;

export const lnaGainTool = createSimpleTool({
  id: "electronics/lna-gain",
  title: "LNA Gain dB",
  description:
    "Compute low-noise amplifier voltage gain in decibels as 20 * log10(vOutRms / vInRms).",
  inputs: [
    {
      description: "Input voltage RMS.",
      id: "vInRms",
      kind: "number",
      label: "Input RMS",
      unit: "V",
    },
    {
      description: "Output voltage RMS.",
      id: "vOutRms",
      kind: "number",
      label: "Output RMS",
      unit: "V",
    },
  ],
  outputs: [
    {
      description: "Voltage gain in decibels.",
      id: "lnaGainDb",
      kind: "number",
      label: "Gain",
      unit: "dB",
    },
  ],
  calculate: (input) => {
    const vInRms = input.vInRms as number;
    const vOutRms = input.vOutRms as number;
    if (!(vInRms > 0) || !(vOutRms > 0))
      simpleError("vInRms", "Input and output RMS voltages must be positive.");
    return { lnaGainDb: 20 * Math.log10(vOutRms / vInRms) };
  },
});
export const runLnaGain = lnaGainTool.execute;
export default lnaGainTool;
