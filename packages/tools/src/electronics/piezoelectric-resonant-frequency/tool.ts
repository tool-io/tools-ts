import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PiezoelectricResonantFrequencyInput = {
  readonly thicknessMm: number;
};

export type PiezoelectricResonantFrequencyOutput = {
  readonly resonantFrequencyKhz: number;
};

export const piezoelectricResonantFrequencyExample = {
  input: { thicknessMm: 0.5 },
  output: { resonantFrequencyKhz: 5720 },
} satisfies ToolExample<
  PiezoelectricResonantFrequencyInput,
  PiezoelectricResonantFrequencyOutput
>;

export const calculatePiezoelectricResonantFrequency = (
  input: PiezoelectricResonantFrequencyInput,
): PiezoelectricResonantFrequencyOutput => {
  if (!(input.thicknessMm > 0))
    simpleError(
      "thicknessMm",
      "Thickness must be positive.",
      "invalid_thickness",
    );
  return { resonantFrequencyKhz: 2860 / input.thicknessMm };
};

export const piezoelectricResonantFrequencyTool = createSimpleTool({
  calculate: (input) =>
    calculatePiezoelectricResonantFrequency(
      input as unknown as PiezoelectricResonantFrequencyInput,
    ),
  description:
    "Estimate the thickness-mode fundamental resonant frequency of a piezoelectric plate using the documented 2860 kHz·mm k33 constant (frequency in kHz equals 2860 divided by thickness in mm).",
  id: "electronics/piezoelectric-resonant-frequency",
  inputs: [
    {
      description: "Plate thickness along the poling axis.",
      format: "length",
      id: "thicknessMm",
      kind: "number",
      label: "Thickness",
      unit: "mm",
    },
  ],
  outputs: [
    {
      description: "Fundamental thickness-mode resonant frequency.",
      format: "frequency",
      id: "resonantFrequencyKhz",
      kind: "number",
      label: "Resonant frequency",
      unit: "kHz",
    },
  ],
  title: "Piezo Resonant Frequency",
});
export const runPiezoelectricResonantFrequency =
  piezoelectricResonantFrequencyTool.execute;
export default piezoelectricResonantFrequencyTool;
