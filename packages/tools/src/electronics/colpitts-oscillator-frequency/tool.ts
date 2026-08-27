import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const colpittsOscillatorFrequencyExample = {
  input: { c1Farads: 1e-8, c2Farads: 1e-8, lHenry: 1e-3 },
  output: { oscillationFrequencyHz: 71176.2543417177 },
} satisfies ToolExample<
  {
    readonly c1Farads: number;
    readonly c2Farads: number;
    readonly lHenry: number;
  },
  { readonly oscillationFrequencyHz: number }
>;

export const colpittsOscillatorFrequencyTool = createSimpleTool({
  id: "electronics/colpitts-oscillator-frequency",
  title: "Colpitts Frequency",
  description:
    "Compute the Colpitts tank frequency f = 1 / (2 * pi * sqrt(L * C1 * C2 / (C1 + C2))).",
  inputs: [
    { id: "lHenry", kind: "number", label: "Inductance", unit: "H" },
    { id: "c1Farads", kind: "number", label: "C1", unit: "F" },
    { id: "c2Farads", kind: "number", label: "C2", unit: "F" },
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
    const l = input.lHenry as number;
    if (l <= 0)
      simpleError(
        "lHenry",
        "The inductance must be greater than zero.",
        "invalid_inductance",
      );
    const c1 = input.c1Farads as number;
    const c2 = input.c2Farads as number;
    if (c1 <= 0 || c2 <= 0)
      simpleError(
        "c1Farads",
        "Both capacitances must be greater than zero.",
        "invalid_capacitance",
      );
    const cTotal = (c1 * c2) / (c1 + c2);
    return {
      oscillationFrequencyHz: 1 / (2 * Math.PI * Math.sqrt(l * cTotal)),
    };
  },
});
export const runColpittsOscillatorFrequency =
  colpittsOscillatorFrequencyTool.execute;
export default colpittsOscillatorFrequencyTool;
