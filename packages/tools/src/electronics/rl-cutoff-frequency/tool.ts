import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RlCutoffFrequencyInput = {
  readonly inductanceH: number;
  readonly resistanceOhms: number;
};

export type RlCutoffFrequencyOutput = {
  readonly cutoffFrequencyHz: number;
};

export const rlCutoffFrequencyExample = {
  input: { inductanceH: 0.01, resistanceOhms: 1000 },
  output: { cutoffFrequencyHz: 15915.494309189533 },
} satisfies ToolExample<RlCutoffFrequencyInput, RlCutoffFrequencyOutput>;

export const calculateRlCutoffFrequency = (
  input: RlCutoffFrequencyInput,
): RlCutoffFrequencyOutput => {
  if (!(input.resistanceOhms > 0))
    simpleError(
      "resistanceOhms",
      "Resistance must be positive.",
      "invalid_resistance",
    );
  if (!(input.inductanceH > 0))
    simpleError(
      "inductanceH",
      "Inductance must be positive.",
      "invalid_inductance",
    );
  return {
    cutoffFrequencyHz: input.resistanceOhms / (2 * Math.PI * input.inductanceH),
  };
};

export const rlCutoffFrequencyTool = createSimpleTool({
  calculate: (input) =>
    calculateRlCutoffFrequency(input as unknown as RlCutoffFrequencyInput),
  description: "Calculate the cutoff frequency of an RL low-pass filter.",
  id: "electronics/rl-cutoff-frequency",
  inputs: [
    { id: "resistanceOhms", kind: "number", label: "Resistance", unit: "ohm" },
    { id: "inductanceH", kind: "number", label: "Inductance", unit: "H" },
  ],
  outputs: [
    {
      id: "cutoffFrequencyHz",
      kind: "number",
      label: "Cutoff frequency",
      unit: "Hz",
    },
  ],
  title: "RL Cutoff Frequency",
});
export const runRlCutoffFrequency = rlCutoffFrequencyTool.execute;
export default rlCutoffFrequencyTool;
