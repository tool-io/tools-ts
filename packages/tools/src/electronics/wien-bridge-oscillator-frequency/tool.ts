import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const wienBridgeOscillatorFrequencyExample = {
  input: { cFarads: 1e-9, rOhms: 10000 },
  output: { oscillationFrequencyHz: 15915.494309189533 },
} satisfies ToolExample<
  { readonly cFarads: number; readonly rOhms: number },
  { readonly oscillationFrequencyHz: number }
>;

export const wienBridgeOscillatorFrequencyTool = createSimpleTool({
  id: "electronics/wien-bridge-oscillator-frequency",
  title: "Wien Bridge Frequency",
  description:
    "Compute the oscillation frequency of a Wien bridge oscillator f = 1 / (2 * pi * R * C).",
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
    return { oscillationFrequencyHz: 1 / (2 * Math.PI * r * c) };
  },
});
export const runWienBridgeOscillatorFrequency =
  wienBridgeOscillatorFrequencyTool.execute;
export default wienBridgeOscillatorFrequencyTool;
