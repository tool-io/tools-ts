import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const hartleyOscillatorFrequencyExample = {
  input: { cFarads: 1e-9, l1Henry: 1e-6, l2Henry: 1e-6 },
  output: { oscillationFrequencyHz: 3558812.7170858853 },
} satisfies ToolExample<
  {
    readonly cFarads: number;
    readonly l1Henry: number;
    readonly l2Henry: number;
    readonly mutualH?: number;
  },
  { readonly oscillationFrequencyHz: number }
>;

export const hartleyOscillatorFrequencyTool = createSimpleTool({
  id: "electronics/hartley-oscillator-frequency",
  title: "Hartley Frequency",
  description:
    "Compute the Hartley tank frequency f = 1 / (2 * pi * sqrt((L1 + L2 + 2M) * C)).",
  inputs: [
    { id: "l1Henry", kind: "number", label: "L1", unit: "H" },
    { id: "l2Henry", kind: "number", label: "L2", unit: "H" },
    {
      default: 0,
      id: "mutualH",
      kind: "number",
      label: "Mutual inductance",
      minimum: 0,
      unit: "H",
    },
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
    const l1 = input.l1Henry as number;
    const l2 = input.l2Henry as number;
    if (l1 <= 0 || l2 <= 0)
      simpleError(
        "l1Henry",
        "Both coil inductances must be greater than zero.",
        "invalid_inductance",
      );
    const c = input.cFarads as number;
    if (c <= 0)
      simpleError(
        "cFarads",
        "The capacitance must be greater than zero.",
        "invalid_capacitance",
      );
    const mutual = input.mutualH as number;
    const lTotal = l1 + l2 + 2 * mutual;
    return {
      oscillationFrequencyHz: 1 / (2 * Math.PI * Math.sqrt(lTotal * c)),
    };
  },
});
export const runHartleyOscillatorFrequency =
  hartleyOscillatorFrequencyTool.execute;
export default hartleyOscillatorFrequencyTool;
