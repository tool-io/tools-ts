import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CrystalFrequencyTolerancePpmInput = {
  readonly nominalHz: number;
  readonly tolerancePpm: number;
};

export type CrystalFrequencyTolerancePpmOutput = {
  readonly toleranceWindowHz: number;
};

export const crystalFrequencyTolerancePpmExample = {
  input: { nominalHz: 20000000, tolerancePpm: 50 },
  output: { toleranceWindowHz: 1000 },
} satisfies ToolExample<
  CrystalFrequencyTolerancePpmInput,
  CrystalFrequencyTolerancePpmOutput
>;

export const calculateCrystalFrequencyTolerancePpm = (
  input: CrystalFrequencyTolerancePpmInput,
): CrystalFrequencyTolerancePpmOutput => {
  if (!(input.nominalHz > 0))
    simpleError(
      "nominalHz",
      "Nominal frequency must be positive.",
      "invalid_frequency",
    );
  if (!(input.tolerancePpm >= 0))
    simpleError(
      "tolerancePpm",
      "Tolerance must not be negative.",
      "invalid_tolerance",
    );
  return {
    toleranceWindowHz: (input.nominalHz * input.tolerancePpm) / 1000000,
  };
};

export const crystalFrequencyTolerancePpmTool = createSimpleTool({
  calculate: (input) =>
    calculateCrystalFrequencyTolerancePpm(
      input as unknown as CrystalFrequencyTolerancePpmInput,
    ),
  description:
    "Convert a crystal or oscillator tolerance in parts per million into an absolute frequency window in hertz.",
  id: "electronics/crystal-frequency-tolerance-ppm",
  inputs: [
    {
      description: "Nominal resonant frequency of the crystal.",
      format: "frequency",
      id: "nominalHz",
      kind: "number",
      label: "Nominal frequency",
      unit: "Hz",
    },
    {
      description: "Total allowed deviation in parts per million.",
      format: "ratio",
      id: "tolerancePpm",
      kind: "number",
      label: "Tolerance",
      unit: "ppm",
    },
  ],
  outputs: [
    {
      description:
        "Half-width of the allowed frequency window around the nominal value.",
      format: "frequency",
      id: "toleranceWindowHz",
      kind: "number",
      label: "Tolerance window",
      unit: "Hz",
    },
  ],
  title: "Crystal Tolerance Window",
});
export const runCrystalFrequencyTolerancePpm =
  crystalFrequencyTolerancePpmTool.execute;
export default crystalFrequencyTolerancePpmTool;
