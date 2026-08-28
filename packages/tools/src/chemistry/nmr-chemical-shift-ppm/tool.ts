import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const nmrChemicalShiftPpmExample = {
  input: {
    referenceFreqHz: 600000000,
    sampleFreqHz: 600002000,
    spectrometerMHz: 600,
  },
  output: { chemicalShiftPpm: 3.3333333333333335 },
} satisfies ToolExample<
  {
    readonly referenceFreqHz: number;
    readonly sampleFreqHz: number;
    readonly spectrometerMHz: number;
  },
  { readonly chemicalShiftPpm: number }
>;

export const nmrChemicalShiftPpmTool = createSimpleTool({
  id: "chemistry/nmr-chemical-shift-ppm",
  title: "Chemical Shift ppm",
  description:
    "Compute the chemical shift in ppm from a sample frequency relative to a reference frequency at a given spectrometer frequency.",
  inputs: [
    {
      id: "sampleFreqHz",
      label: "Sample frequency",
      kind: "number",
      unit: "Hz",
    },
    {
      id: "referenceFreqHz",
      label: "Reference frequency",
      kind: "number",
      unit: "Hz",
    },
    {
      id: "spectrometerMHz",
      label: "Spectrometer frequency",
      kind: "number",
      unit: "MHz",
    },
  ],
  outputs: [
    {
      id: "chemicalShiftPpm",
      label: "Chemical shift",
      kind: "number",
      unit: "ppm",
    },
  ],
  calculate: (input) => {
    const sampleFreqHz = input.sampleFreqHz as number;
    const referenceFreqHz = input.referenceFreqHz as number;
    const spectrometerMHz = input.spectrometerMHz as number;
    if (!(spectrometerMHz > 0))
      simpleError(
        "spectrometerMHz",
        "Spectrometer frequency must be positive.",
      );
    return {
      chemicalShiftPpm: (sampleFreqHz - referenceFreqHz) / spectrometerMHz,
    };
  },
});
export const runNmrChemicalShiftPpm = nmrChemicalShiftPpmTool.execute;
export default nmrChemicalShiftPpmTool;
