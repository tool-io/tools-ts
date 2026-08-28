import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const phaseShiftOscillatorFrequencyExample = {
  input: { cFarads: 1e-8, rOhms: 10000 },
  output: { oscillationFrequencyHz: 649.7473343613968 },
} satisfies ToolExample<
  { readonly cFarads: number; readonly rOhms: number },
  { readonly oscillationFrequencyHz: number }
>;

export const phaseShiftOscillatorFrequencyTool = createSimpleTool({
  id: "electronics/phase-shift-oscillator-frequency",
  title: "Phase Shift Oscillator",
  description:
    "Compute the oscillation frequency of an RC phase-shift oscillator f = 1 / (2 * pi * sqrt(6) * R * C).",
  inputs: [
    { id: "rOhms", kind: "number", label: "Resistance", unit: "Ω" },
    { id: "cFarads", kind: "number", label: "Capacitance", unit: "F" },
  ],
  outputs: [
    {
      format: "frequency-hz",
      id: "oscillationFrequencyHz",
      kind: "number",
      label: "Oscillation frequency",
      unit: "Hz",
    },
  ],
  calculate: (input) => {
    const r = input.rOhms as number;
    if (r <= 0)
      simpleError(
        "rOhms",
        "The resistance must be greater than zero.",
        "invalid_resistance",
      );
    const c = input.cFarads as number;
    if (c <= 0)
      simpleError(
        "cFarads",
        "The capacitance must be greater than zero.",
        "invalid_capacitance",
      );
    return {
      oscillationFrequencyHz: 1 / (2 * Math.PI * Math.sqrt(6) * r * c),
    };
  },
});
export const runPhaseShiftOscillatorFrequency =
  phaseShiftOscillatorFrequencyTool.execute;
export default phaseShiftOscillatorFrequencyTool;
