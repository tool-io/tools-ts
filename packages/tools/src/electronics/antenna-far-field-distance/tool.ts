import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AntennaFarFieldDistanceInput = {
  readonly apertureMeters: number;
  readonly wavelengthMeters: number;
};

export type AntennaFarFieldDistanceOutput = {
  readonly farFieldDistanceM: number;
};

export const antennaFarFieldDistanceExample = {
  input: { apertureMeters: 0.5, wavelengthMeters: 0.06 },
  output: { farFieldDistanceM: 8.333333333333334 },
} satisfies ToolExample<
  AntennaFarFieldDistanceInput,
  AntennaFarFieldDistanceOutput
>;

export const antennaFarFieldDistanceTool = createSimpleTool({
  id: "electronics/antenna-far-field-distance",
  title: "Far Field Boundary",
  description:
    "Compute the far-field boundary of an aperture as Rf = 2 x D^2 / lambda; aperture size and wavelength must be positive.",
  inputs: [
    { id: "apertureMeters", label: "Aperture size", kind: "number", unit: "m" },
    { id: "wavelengthMeters", label: "Wavelength", kind: "number", unit: "m" },
  ],
  outputs: [
    {
      id: "farFieldDistanceM",
      label: "Far-field distance",
      kind: "number",
      unit: "m",
    },
  ],
  calculate: (input) => {
    const apertureMeters = input.apertureMeters as number;
    const wavelengthMeters = input.wavelengthMeters as number;
    if (!(apertureMeters > 0))
      simpleError(
        "apertureMeters",
        "Aperture size must be positive.",
        "invalid_aperture",
      );
    if (!(wavelengthMeters > 0))
      simpleError(
        "wavelengthMeters",
        "Wavelength must be positive.",
        "invalid_wavelength",
      );
    return {
      farFieldDistanceM: (2 * apertureMeters ** 2) / wavelengthMeters,
    };
  },
});
export const runAntennaFarFieldDistance = antennaFarFieldDistanceTool.execute;
export default antennaFarFieldDistanceTool;
