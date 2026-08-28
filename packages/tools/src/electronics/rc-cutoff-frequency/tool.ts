import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RcCutoffFrequencyInput = {
  readonly capacitanceF: number;
  readonly resistanceOhms: number;
};

export type RcCutoffFrequencyOutput = {
  readonly cutoffFrequencyHz: number;
};

export const rcCutoffFrequencyExample = {
  input: {
    capacitanceF: 1e-6,
    resistanceOhms: 1000,
  },
  output: { cutoffFrequencyHz: 159.15494309189535 },
} satisfies ToolExample<RcCutoffFrequencyInput, RcCutoffFrequencyOutput>;

export const calculateRcCutoffFrequency = (
  input: RcCutoffFrequencyInput,
): RcCutoffFrequencyOutput => {
  if (input.resistanceOhms <= 0 || input.capacitanceF <= 0)
    simpleError(
      "resistanceOhms",
      "Resistance and capacitance must be positive.",
      "invalid_input",
    );
  return {
    cutoffFrequencyHz:
      1 / (2 * Math.PI * input.resistanceOhms * input.capacitanceF),
  };
};

export const rcCutoffFrequencyTool = createSimpleTool({
  calculate: (input) =>
    calculateRcCutoffFrequency(input as unknown as RcCutoffFrequencyInput),
  description:
    "Compute the first-order RC low-pass cutoff frequency fc = 1 / (2 * pi * R * C), where the output falls 3 dB.",
  id: "electronics/rc-cutoff-frequency",
  inputs: [
    {
      description: "Filter capacitance.",
      id: "capacitanceF",
      kind: "number",
      label: "Capacitance",
      unit: "F",
    },
    {
      description: "Filter resistance.",
      id: "resistanceOhms",
      kind: "number",
      label: "Resistance",
      unit: "Ω",
    },
  ],
  outputs: [
    {
      description: "Frequency at which the response is down 3 dB.",
      format: "frequency-hz",
      id: "cutoffFrequencyHz",
      kind: "number",
      label: "fc",
      unit: "Hz",
    },
  ],
  title: "RC Cutoff Frequency Calculator",
});
export const runRcCutoffFrequency = rcCutoffFrequencyTool.execute;
export default rcCutoffFrequencyTool;
