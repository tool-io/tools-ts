import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ChemicalShiftReferenceInput = {
  readonly sampleFrequencyHz: number;
  readonly referenceFrequencyHz: number;
};

export type ChemicalShiftReferenceOutput = {
  readonly chemicalShiftPpm: number;
};

export const chemicalShiftReferenceExample = {
  input: { sampleFrequencyHz: 400000100, referenceFrequencyHz: 400000000 },
  output: { chemicalShiftPpm: 0.25 },
} satisfies ToolExample<
  ChemicalShiftReferenceInput,
  ChemicalShiftReferenceOutput
>;

export const chemicalShiftReferenceTool = createSimpleTool({
  id: "chemistry/nmr-chemical-shift-reference",
  title: "Shift Relative To Reference",
  description:
    "Compute the NMR chemical shift in ppm of a sample frequency relative to a reference frequency.",
  inputs: [
    {
      id: "sampleFrequencyHz",
      label: "Sample frequency",
      kind: "number",
      unit: "Hz",
    },
    {
      id: "referenceFrequencyHz",
      label: "Reference frequency",
      kind: "number",
      unit: "Hz",
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
    const referenceFrequencyHz = input.referenceFrequencyHz as number;
    if (!(referenceFrequencyHz > 0))
      simpleError(
        "referenceFrequencyHz",
        "Reference frequency must be positive.",
      );
    return {
      chemicalShiftPpm:
        ((input.sampleFrequencyHz as number) - referenceFrequencyHz) /
        (referenceFrequencyHz / 1e6),
    };
  },
});
export const runChemicalShiftReference = chemicalShiftReferenceTool.execute;
export default chemicalShiftReferenceTool;
