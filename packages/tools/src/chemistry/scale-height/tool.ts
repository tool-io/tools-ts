import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const R_GAS = 8.314462618;
const EARTH_G = 9.80665;

export const scaleHeightExample = {
  input: { molarMassKgPerMol: 0.0289644, temperatureK: 288.15 },
} satisfies ToolExample<{
  readonly molarMassKgPerMol: number;
  readonly temperatureK: number;
}>;

export const scaleHeightTool = createSimpleTool({
  id: "chemistry/scale-height",
  title: "Scale Height Calculator",
  description:
    "Compute the atmospheric scale height over which pressure falls by a factor of e.",
  inputs: [
    { id: "temperatureK", label: "Temperature", kind: "number", unit: "K" },
    {
      id: "molarMassKgPerMol",
      label: "Molar mass",
      kind: "number",
      unit: "kg/mol",
    },
  ],
  outputs: [
    {
      id: "scaleHeightMeters",
      label: "Scale height",
      kind: "number",
      unit: "m",
    },
  ],
  calculate: (input) => {
    const temperatureK = input.temperatureK as number;
    const molarMassKgPerMol = input.molarMassKgPerMol as number;
    if (!(temperatureK > 0))
      simpleError("temperatureK", "Temperature must be positive.");
    if (!(molarMassKgPerMol > 0))
      simpleError("molarMassKgPerMol", "Molar mass must be positive.");
    return {
      scaleHeightMeters: (R_GAS * temperatureK) / (EARTH_G * molarMassKgPerMol),
    };
  },
});
export const runScaleHeight = scaleHeightTool.execute;
export default scaleHeightTool;
