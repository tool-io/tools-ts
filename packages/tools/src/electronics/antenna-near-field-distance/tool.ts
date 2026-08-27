import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AntennaNearFieldDistanceInput = {
  readonly dishDiameterMeters: number;
  readonly wavelengthMeters: number;
};

export type AntennaNearFieldDistanceOutput = {
  readonly nearFieldDistanceM: number;
};

export const antennaNearFieldDistanceExample = {
  input: { dishDiameterMeters: 0.45, wavelengthMeters: 0.03 },
  output: { nearFieldDistanceM: 1.0805623535918694 },
} satisfies ToolExample<
  AntennaNearFieldDistanceInput,
  AntennaNearFieldDistanceOutput
>;

export const antennaNearFieldDistanceTool = createSimpleTool({
  id: "electronics/antenna-near-field-distance",
  title: "Near Field Distance",
  description:
    "Compute the outer boundary of an aperture antenna's reactive near field as Rn = 0.62 x sqrt(D^3 / lambda); dish diameter and wavelength must be positive.",
  inputs: [
    {
      id: "dishDiameterMeters",
      label: "Dish diameter",
      kind: "number",
      unit: "m",
    },
    { id: "wavelengthMeters", label: "Wavelength", kind: "number", unit: "m" },
  ],
  outputs: [
    {
      id: "nearFieldDistanceM",
      label: "Near-field distance",
      kind: "number",
      unit: "m",
    },
  ],
  calculate: (input) => {
    const dishDiameterMeters = input.dishDiameterMeters as number;
    const wavelengthMeters = input.wavelengthMeters as number;
    if (!(dishDiameterMeters > 0))
      simpleError(
        "dishDiameterMeters",
        "Dish diameter must be positive.",
        "invalid_diameter",
      );
    if (!(wavelengthMeters > 0))
      simpleError(
        "wavelengthMeters",
        "Wavelength must be positive.",
        "invalid_wavelength",
      );
    return {
      nearFieldDistanceM:
        0.62 * Math.sqrt(dishDiameterMeters ** 3 / wavelengthMeters),
    };
  },
});
export const runAntennaNearFieldDistance = antennaNearFieldDistanceTool.execute;
export default antennaNearFieldDistanceTool;
