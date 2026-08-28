import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const ppmToMolarityTool = createSimpleTool({
  id: "chemistry/ppm-to-molarity",
  title: "PPM to Molarity Converter",
  description:
    "Convert parts-per-million (mg/L) aqueous concentration to molarity via M = ppm/(1000·Mw).",
  inputs: [
    {
      description:
        "Concentration in parts per million (mg/L for dilute water).",
      id: "ppm",
      label: "Concentration",
      kind: "number",
      minimum: 0,
      unit: "ppm",
    },
    {
      description: "Molar mass of the solute; must be greater than zero.",
      id: "molarMassGMol",
      label: "Molar mass",
      kind: "number",
      unit: "g/mol",
    },
  ],
  outputs: [
    {
      description: "Molarity of the solution.",
      id: "molarityMolL",
      label: "Molarity",
      kind: "number",
      unit: "mol/L",
    },
  ],
  calculate: (input) => {
    const molarMass = input.molarMassGMol as number;
    if (molarMass <= 0)
      simpleError(
        "molarMassGMol",
        "The molar mass must be greater than zero.",
        "invalid_molar_mass",
      );
    return { molarityMolL: (input.ppm as number) / (1000 * molarMass) };
  },
});
export const runPpmToMolarity = ppmToMolarityTool.execute;
export default ppmToMolarityTool;

export type PpmToMolarityInput = {
  readonly ppm: number;
  readonly molarMassGMol: number;
};

export type PpmToMolarityOutput = {
  readonly molarityMolL: number;
};

export const ppmToMolarityExample = {
  input: {
    ppm: 1,
    molarMassGMol: 1,
  },
  output: {
    molarityMolL: 0.001,
  },
} satisfies ToolExample<PpmToMolarityInput, PpmToMolarityOutput>;
