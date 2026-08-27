import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const antennaRadiationResistanceExample = {
  input: { lengthMeters: 1, wavelengthMeters: 100 },
} satisfies ToolExample<{
  readonly lengthMeters: number;
  readonly wavelengthMeters: number;
}>;

export const antennaRadiationResistanceTool = createSimpleTool({
  id: "electronics/antenna-radiation-resistance",
  title: "Short Dipole Rrad",
  description:
    "Compute the radiation resistance of a short dipole from its length and wavelength using Rrad = 80 x pi^2 x (l/lambda)^2.",
  inputs: [
    { id: "lengthMeters", label: "Dipole length", kind: "number", unit: "m" },
    {
      id: "wavelengthMeters",
      label: "Wavelength",
      kind: "number",
      unit: "m",
    },
  ],
  outputs: [
    {
      id: "radiationResistanceOhms",
      label: "Radiation resistance",
      kind: "number",
      unit: "\u03a9",
    },
  ],
  calculate: (input) => {
    const lengthMeters = input.lengthMeters as number;
    const wavelengthMeters = input.wavelengthMeters as number;
    if (!(lengthMeters > 0))
      simpleError("lengthMeters", "Dipole length must be positive.");
    if (!(wavelengthMeters > 0))
      simpleError("wavelengthMeters", "Wavelength must be positive.");
    return {
      radiationResistanceOhms:
        80 * Math.PI ** 2 * (lengthMeters / wavelengthMeters) ** 2,
    };
  },
});
export const runAntennaRadiationResistance =
  antennaRadiationResistanceTool.execute;
export default antennaRadiationResistanceTool;
