import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ParabolicAntennaGainInput = {
  readonly dishDiameterMeters: number;
  readonly efficiencyFraction?: number;
  readonly wavelengthMeters: number;
};

export type ParabolicAntennaGainOutput = {
  readonly parabolicGainDbi: number;
};

export const parabolicAntennaGainExample = {
  input: { dishDiameterMeters: 1, wavelengthMeters: 0.1 },
  output: { parabolicGainDbi: 27.346624348825117 },
} satisfies ToolExample<ParabolicAntennaGainInput, ParabolicAntennaGainOutput>;

export const calculateParabolicAntennaGain = (
  input: ParabolicAntennaGainInput,
): ParabolicAntennaGainOutput => {
  const efficiencyFraction = input.efficiencyFraction ?? 0.55;
  if (!(input.dishDiameterMeters > 0))
    simpleError(
      "dishDiameterMeters",
      "Dish diameter must be positive.",
      "invalid_diameter",
    );
  if (!(input.wavelengthMeters > 0))
    simpleError(
      "wavelengthMeters",
      "Wavelength must be positive.",
      "invalid_wavelength",
    );
  if (!(efficiencyFraction > 0) || !(efficiencyFraction < 1))
    simpleError(
      "efficiencyFraction",
      "Efficiency must lie strictly between zero and one.",
      "invalid_efficiency",
    );
  return {
    parabolicGainDbi:
      10 *
      Math.log10(
        efficiencyFraction *
          ((Math.PI * input.dishDiameterMeters) / input.wavelengthMeters) ** 2,
      ),
  };
};

export const parabolicAntennaGainTool = createSimpleTool({
  calculate: (input) =>
    calculateParabolicAntennaGain(
      input as unknown as ParabolicAntennaGainInput,
    ),
  description:
    "Compute parabolic dish gain in dBi as 10 x log10(eta x (pi x D / lambda)^2); eta defaults to 0.55.",
  id: "electronics/parabolic-antenna-gain",
  inputs: [
    {
      id: "dishDiameterMeters",
      kind: "number",
      label: "Dish diameter",
      unit: "m",
    },
    {
      default: 0.55,
      id: "efficiencyFraction",
      kind: "number",
      label: "Aperture efficiency",
      maximum: 1,
      minimum: 0,
      required: false,
    },
    { id: "wavelengthMeters", kind: "number", label: "Wavelength", unit: "m" },
  ],
  outputs: [
    {
      id: "parabolicGainDbi",
      kind: "number",
      label: "Parabolic gain",
      unit: "dBi",
    },
  ],
  title: "Parabolic Dish Gain dBi",
});
export const runParabolicAntennaGain = parabolicAntennaGainTool.execute;
export default parabolicAntennaGainTool;
