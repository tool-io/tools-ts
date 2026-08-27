import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AntennaGainFromApertureInput = {
  readonly areaM2: number;
  readonly wavelengthMeters: number;
  readonly efficiencyFraction?: number;
};

export type AntennaGainFromApertureOutput = {
  readonly antennaGainLinear: number;
};

export const antennaGainFromApertureExample = {
  input: { areaM2: 0.01, wavelengthMeters: 0.03 },
  output: { antennaGainLinear: 76.79448708775053 },
} satisfies ToolExample<
  AntennaGainFromApertureInput,
  AntennaGainFromApertureOutput
>;

export const antennaGainFromApertureTool = createSimpleTool({
  id: "electronics/antenna-gain-from-aperture",
  title: "Gain From Aperture",
  description:
    "Compute the linear antenna gain as G = 4 x pi x A x eta / lambda^2 with aperture efficiency eta between zero and one, defaulting to 0.55.",
  inputs: [
    { id: "areaM2", label: "Aperture area", kind: "number", unit: "m²" },
    { id: "wavelengthMeters", label: "Wavelength", kind: "number", unit: "m" },
    {
      default: 0.55,
      id: "efficiencyFraction",
      label: "Aperture efficiency",
      kind: "number",
      maximum: 1,
      minimum: 0,
      required: false,
    },
  ],
  outputs: [
    {
      id: "antennaGainLinear",
      label: "Antenna gain",
      kind: "number",
      unit: "ratio",
    },
  ],
  calculate: (input) => {
    const areaM2 = input.areaM2 as number;
    const wavelengthMeters = input.wavelengthMeters as number;
    const efficiencyFraction =
      (input.efficiencyFraction as number | undefined) ?? 0.55;
    if (!(areaM2 > 0))
      simpleError("areaM2", "Aperture area must be positive.", "invalid_area");
    if (!(wavelengthMeters > 0))
      simpleError(
        "wavelengthMeters",
        "Wavelength must be positive.",
        "invalid_wavelength",
      );
    if (!(efficiencyFraction > 0) || efficiencyFraction > 1)
      simpleError(
        "efficiencyFraction",
        "Aperture efficiency must lie between zero and one.",
        "invalid_efficiency",
      );
    return {
      antennaGainLinear:
        (4 * Math.PI * areaM2 * efficiencyFraction) / wavelengthMeters ** 2,
    };
  },
});
export const runAntennaGainFromAperture = antennaGainFromApertureTool.execute;
export default antennaGainFromApertureTool;
