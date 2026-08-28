import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const ppbToMolarityTool = createSimpleTool({
  id: "chemistry/ppb-to-molarity",
  title: "PPB to Molarity Converter",
  description:
    "Convert parts-per-billion (µg/L) aqueous concentration to molarity via M = ppb/(10⁶·Mw).",
  inputs: [
    {
      description:
        "Concentration in parts per billion (µg/L for dilute water).",
      id: "ppb",
      label: "Concentration",
      kind: "number",
      minimum: 0,
      unit: "ppb",
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
    return { molarityMolL: (input.ppb as number) / (1_000_000 * molarMass) };
  },
});
export const runPpbToMolarity = ppbToMolarityTool.execute;
export default ppbToMolarityTool;

export type PpbToMolarityInput = {
  readonly ppb: number;
  readonly molarMassGMol: number;
};

export type PpbToMolarityOutput = {
  readonly molarityMolL: number;
};

export const ppbToMolarityExample = {
  input: {
    ppb: 1,
    molarMassGMol: 1,
  },
  output: {
    molarityMolL: 0.000001,
  },
} satisfies ToolExample<PpbToMolarityInput, PpbToMolarityOutput>;
