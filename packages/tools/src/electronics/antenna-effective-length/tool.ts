import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const antennaEffectiveLengthExample = {
  input: { wavelengthMeters: 2 },
} satisfies ToolExample<{
  readonly wavelengthMeters: number;
}>;

export const antennaEffectiveLengthTool = createSimpleTool({
  id: "electronics/antenna-effective-length",
  title: "Effective Length Dipole",
  description:
    "Compute the effective length of a half-wave dipole as lambda divided by pi.",
  inputs: [
    {
      id: "wavelengthMeters",
      label: "Wavelength",
      kind: "number",
      unit: "m",
    },
  ],
  outputs: [
    {
      id: "effectiveLengthMeters",
      label: "Effective length",
      kind: "number",
      unit: "m",
    },
  ],
  calculate: (input) => {
    const wavelengthMeters = input.wavelengthMeters as number;
    if (!(wavelengthMeters > 0))
      simpleError("wavelengthMeters", "Wavelength must be positive.");
    return { effectiveLengthMeters: wavelengthMeters / Math.PI };
  },
});
export const runAntennaEffectiveLength = antennaEffectiveLengthTool.execute;
export default antennaEffectiveLengthTool;
