import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const antennaBeamwidthFromDiameterExample = {
  input: { dishDiameterMeters: 0.5, wavelengthMeters: 0.03 },
} satisfies ToolExample<{
  readonly dishDiameterMeters: number;
  readonly wavelengthMeters: number;
}>;

export const antennaBeamwidthFromDiameterTool = createSimpleTool({
  id: "electronics/antenna-beamwidth-from-diameter",
  title: "Beamwidth From Diameter",
  description:
    "Approximate parabolic dish half-power beamwidth in degrees as bwDegrees = 70 * wavelengthMeters / dishDiameterMeters.",
  inputs: [
    {
      description: "Operating wavelength.",
      id: "wavelengthMeters",
      kind: "number",
      label: "Wavelength",
      unit: "m",
    },
    {
      description: "Reflector diameter.",
      id: "dishDiameterMeters",
      kind: "number",
      label: "Dish Diameter",
      unit: "m",
    },
  ],
  outputs: [
    {
      description: "Half-power beamwidth between the -3 dB points.",
      id: "beamwidthFromDiameterDeg",
      kind: "number",
      label: "Beamwidth",
      unit: "°",
    },
  ],
  calculate: (input) => {
    const wavelengthMeters = input.wavelengthMeters as number;
    const dishDiameterMeters = input.dishDiameterMeters as number;
    if (!(wavelengthMeters > 0) || !(dishDiameterMeters > 0))
      simpleError(
        "wavelengthMeters",
        "Wavelength and diameter must be positive.",
      );
    return {
      beamwidthFromDiameterDeg: (70 * wavelengthMeters) / dishDiameterMeters,
    };
  },
});
export const runAntennaBeamwidthFromDiameter =
  antennaBeamwidthFromDiameterTool.execute;
export default antennaBeamwidthFromDiameterTool;
