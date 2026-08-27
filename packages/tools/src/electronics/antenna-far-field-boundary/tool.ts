import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const antennaFarFieldBoundaryExample = {
  input: { diameterMeters: 0.5, wavelengthMeters: 0.03 },
} satisfies ToolExample<{
  readonly diameterMeters: number;
  readonly wavelengthMeters: number;
}>;

export const antennaFarFieldBoundaryTool = createSimpleTool({
  id: "electronics/antenna-far-field-boundary",
  title: "Far Field Boundary 2",
  description:
    "Compute the Fraunhofer far-field distance boundaryMeters = 2 * diameterMeters^2 / wavelengthMeters.",
  inputs: [
    {
      description: "Largest aperture dimension.",
      id: "diameterMeters",
      kind: "number",
      label: "Diameter",
      unit: "m",
    },
    {
      description: "Operating wavelength.",
      id: "wavelengthMeters",
      kind: "number",
      label: "Wavelength",
      unit: "m",
    },
  ],
  outputs: [
    {
      description: "Far-field boundary distance from the aperture.",
      id: "farFieldBoundaryMeters",
      kind: "number",
      label: "Far-Field Boundary",
      unit: "m",
    },
  ],
  calculate: (input) => {
    const diameterMeters = input.diameterMeters as number;
    const wavelengthMeters = input.wavelengthMeters as number;
    if (!(diameterMeters > 0) || !(wavelengthMeters > 0))
      simpleError(
        "diameterMeters",
        "Diameter and wavelength must be positive.",
      );
    return {
      farFieldBoundaryMeters:
        (2 * diameterMeters * diameterMeters) / wavelengthMeters,
    };
  },
});
export const runAntennaFarFieldBoundary = antennaFarFieldBoundaryTool.execute;
export default antennaFarFieldBoundaryTool;
