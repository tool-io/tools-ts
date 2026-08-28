import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const speakerCrossoverFrequencyExample = {
  input: { capacitanceUf: 10, zohmsOhms: 8 },
} satisfies ToolExample<{
  readonly capacitanceUf: number;
  readonly zohmsOhms: number;
}>;

export const speakerCrossoverFrequencyTool = createSimpleTool({
  id: "electronics/speaker-crossover-frequency",
  title: "Crossover Frequency",
  description:
    "Compute first-order crossover corner frequency fcHz = 1 / (2 * pi * zohmsOhms * capacitanceUf * 1e-6).",
  inputs: [
    {
      description: "Driver nominal impedance.",
      id: "zohmsOhms",
      kind: "number",
      label: "Impedance",
      unit: "Ω",
    },
    {
      description: "Series capacitor value in microfarads.",
      id: "capacitanceUf",
      kind: "number",
      label: "Capacitance",
      unit: "µF",
    },
  ],
  outputs: [
    {
      description: "-3 dB corner frequency of the RC network.",
      id: "crossoverFrequencyHz",
      kind: "number",
      label: "Crossover",
      unit: "Hz",
    },
  ],
  calculate: (input) => {
    const zohmsOhms = input.zohmsOhms as number;
    const capacitanceUf = input.capacitanceUf as number;
    if (!(zohmsOhms > 0) || !(capacitanceUf > 0))
      simpleError("zohmsOhms", "Impedance and capacitance must be positive.");
    return {
      crossoverFrequencyHz:
        1 / (2 * Math.PI * zohmsOhms * capacitanceUf * 1e-6),
    };
  },
});
export const runSpeakerCrossoverFrequency =
  speakerCrossoverFrequencyTool.execute;
export default speakerCrossoverFrequencyTool;
