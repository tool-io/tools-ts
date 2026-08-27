import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AntennaEffectiveApertureInput = {
  readonly wavelengthMeters: number;
  readonly gainLinear: number;
};

export type AntennaEffectiveApertureOutput = {
  readonly effectiveApertureM2: number;
};

export const antennaEffectiveApertureExample = {
  input: { wavelengthMeters: 0.125, gainLinear: 10 },
  output: { effectiveApertureM2: 0.012433979929054324 },
} satisfies ToolExample<
  AntennaEffectiveApertureInput,
  AntennaEffectiveApertureOutput
>;

export const antennaEffectiveApertureTool = createSimpleTool({
  id: "electronics/antenna-effective-aperture",
  title: "Effective Aperture",
  description:
    "Compute the antenna effective aperture in square meters as Ae = lambda^2 x G / (4 x pi); wavelength and linear gain must be positive.",
  inputs: [
    {
      id: "wavelengthMeters",
      label: "Wavelength",
      kind: "number",
      unit: "m",
    },
    { id: "gainLinear", label: "Gain (linear)", kind: "number", unit: "ratio" },
  ],
  outputs: [
    {
      id: "effectiveApertureM2",
      label: "Effective aperture",
      kind: "number",
      unit: "m²",
    },
  ],
  calculate: (input) => {
    const wavelengthMeters = input.wavelengthMeters as number;
    const gainLinear = input.gainLinear as number;
    if (!(wavelengthMeters > 0))
      simpleError(
        "wavelengthMeters",
        "Wavelength must be positive.",
        "invalid_wavelength",
      );
    if (!(gainLinear > 0))
      simpleError("gainLinear", "Gain must be positive.", "invalid_gain");
    return {
      effectiveApertureM2: (wavelengthMeters ** 2 * gainLinear) / (4 * Math.PI),
    };
  },
});
export const runAntennaEffectiveAperture = antennaEffectiveApertureTool.execute;
export default antennaEffectiveApertureTool;
