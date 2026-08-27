import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AntennaBeamwidthInput = {
  readonly wavelengthMeters: number;
  readonly dishDiameterMeters: number;
};

export type AntennaBeamwidthOutput = {
  readonly beamwidthDegrees: number;
};

export const antennaBeamwidthExample = {
  input: { wavelengthMeters: 0.03, dishDiameterMeters: 0.45 },
  output: { beamwidthDegrees: 4.666666666666667 },
} satisfies ToolExample<AntennaBeamwidthInput, AntennaBeamwidthOutput>;

export const antennaBeamwidthTool = createSimpleTool({
  id: "electronics/antenna-beamwidth",
  title: "Beamwidth Approx",
  description:
    "Approximate the parabolic dish half-power beamwidth in degrees as 70 x lambda / D; wavelength and dish diameter must be positive.",
  inputs: [
    { id: "wavelengthMeters", label: "Wavelength", kind: "number", unit: "m" },
    {
      id: "dishDiameterMeters",
      label: "Dish diameter",
      kind: "number",
      unit: "m",
    },
  ],
  outputs: [
    {
      id: "beamwidthDegrees",
      label: "Beamwidth",
      kind: "number",
      unit: "°",
    },
  ],
  calculate: (input) => {
    const wavelengthMeters = input.wavelengthMeters as number;
    const dishDiameterMeters = input.dishDiameterMeters as number;
    if (!(wavelengthMeters > 0))
      simpleError(
        "wavelengthMeters",
        "Wavelength must be positive.",
        "invalid_wavelength",
      );
    if (!(dishDiameterMeters > 0))
      simpleError(
        "dishDiameterMeters",
        "Dish diameter must be positive.",
        "invalid_diameter",
      );
    return {
      beamwidthDegrees: (70 * wavelengthMeters) / dishDiameterMeters,
    };
  },
});
export const runAntennaBeamwidth = antennaBeamwidthTool.execute;
export default antennaBeamwidthTool;
