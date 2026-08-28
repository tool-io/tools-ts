import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const molarityFromMolalityDensityTool = createSimpleTool({
  id: "chemistry/molarity-from-molality-density",
  title: "Molarity From Molality and Density Calculator",
  description:
    "Convert molality to molarity using solution density and solute molar mass via M = mρ/(1 + m·Mw/1000).",
  inputs: [
    {
      description: "Molality of the solution.",
      id: "molalityMolKg",
      label: "Molality",
      kind: "number",
      minimum: 0,
      unit: "mol/kg",
    },
    {
      description: "Solution density in grams per milliliter.",
      id: "densityGML",
      label: "Density",
      kind: "number",
      unit: "g/mL",
    },
    {
      description: "Solute molar mass; must be greater than zero.",
      id: "soluteMolarMassGMol",
      label: "Solute molar mass",
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
    const molality = input.molalityMolKg as number;
    const density = input.densityGML as number;
    const molarMass = input.soluteMolarMassGMol as number;
    if (molarMass <= 0)
      simpleError(
        "soluteMolarMassGMol",
        "The solute molar mass must be greater than zero.",
        "invalid_molar_mass",
      );
    const denominator = 1 + (molality * molarMass) / 1000;
    return { molarityMolL: (molality * density) / denominator };
  },
});
export const runMolarityFromMolalityDensity =
  molarityFromMolalityDensityTool.execute;
export default molarityFromMolalityDensityTool;

export type MolarityFromMolalityDensityInput = {
  readonly molalityMolKg: number;
  readonly densityGML: number;
  readonly soluteMolarMassGMol: number;
};

export type MolarityFromMolalityDensityOutput = {
  readonly molarityMolL: number;
};

export const molarityFromMolalityDensityExample = {
  input: {
    molalityMolKg: 1,
    densityGML: 1,
    soluteMolarMassGMol: 1,
  },
  output: {
    molarityMolL: 0.9990009990009991,
  },
} satisfies ToolExample<
  MolarityFromMolalityDensityInput,
  MolarityFromMolalityDensityOutput
>;
