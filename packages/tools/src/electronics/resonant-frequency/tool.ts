import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ResonantFrequencyInput = {
  readonly capacitanceF: number;
  readonly inductanceH: number;
};

export type ResonantFrequencyOutput = {
  readonly resonantFrequencyHz: number;
};

export const resonantFrequencyExample = {
  input: {
    capacitanceF: 1e-6,
    inductanceH: 0.01,
  },
  output: { resonantFrequencyHz: 1591.5494309189535 },
} satisfies ToolExample<ResonantFrequencyInput, ResonantFrequencyOutput>;

export const calculateResonantFrequency = (
  input: ResonantFrequencyInput,
): ResonantFrequencyOutput => {
  if (input.capacitanceF <= 0 || input.inductanceH <= 0)
    simpleError(
      "capacitanceF",
      "Inductance and capacitance must be positive.",
      "invalid_input",
    );
  return {
    resonantFrequencyHz:
      1 / (2 * Math.PI * Math.sqrt(input.inductanceH * input.capacitanceF)),
  };
};

export const resonantFrequencyTool = createSimpleTool({
  calculate: (input) =>
    calculateResonantFrequency(input as unknown as ResonantFrequencyInput),
  description:
    "Compute the LC tank resonant frequency f0 = 1 / (2 * pi * sqrt(L * C)), where inductive and capacitive reactances cancel.",
  id: "electronics/resonant-frequency",
  inputs: [
    {
      description: "Tank capacitance.",
      id: "capacitanceF",
      kind: "number",
      label: "Capacitance",
      unit: "F",
    },
    {
      description: "Tank inductance.",
      id: "inductanceH",
      kind: "number",
      label: "Inductance",
      unit: "H",
    },
  ],
  outputs: [
    {
      description: "Frequency at which the tank resonance occurs.",
      format: "frequency-hz",
      id: "resonantFrequencyHz",
      kind: "number",
      label: "f0",
      unit: "Hz",
    },
  ],
  title: "Resonant Frequency Calculator",
});
export const runResonantFrequency = resonantFrequencyTool.execute;
export default resonantFrequencyTool;
