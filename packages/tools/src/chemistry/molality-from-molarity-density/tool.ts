import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const molalityFromMolarityDensityTool = createSimpleTool({
  id: "chemistry/molality-from-molarity-density",
  title: "Molality From Molarity and Density Calculator",
  description:
    "Convert molarity to molality using solution density and solute molar mass via m = M/(ρ − M·Mw/1000).",
  inputs: [
    {
      description: "Molarity of the solution.",
      id: "molarityMolL",
      label: "Molarity",
      kind: "number",
      minimum: 0,
      unit: "mol/L",
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
      description: "Molality of the solution.",
      id: "molalityMolKg",
      label: "Molality",
      kind: "number",
      unit: "mol/kg",
    },
  ],
  calculate: (input) => {
    const molarity = input.molarityMolL as number;
    const density = input.densityGML as number;
    const solventMass =
      density - (molarity * (input.soluteMolarMassGMol as number)) / 1000;
    if (solventMass <= 0)
      simpleError(
        "densityGML",
        "The density must leave positive solvent mass per liter.",
        "invalid_density",
      );
    return { molalityMolKg: molarity / solventMass };
  },
});
export const runMolalityFromMolarityDensity =
  molalityFromMolarityDensityTool.execute;
export default molalityFromMolarityDensityTool;

export type MolalityFromMolarityDensityInput = {
  readonly molarityMolL: number;
  readonly densityGML: number;
  readonly soluteMolarMassGMol: number;
};

export type MolalityFromMolarityDensityOutput = {
  readonly molalityMolKg: number;
};

export const molalityFromMolarityDensityExample = {
  input: {
    molarityMolL: 1,
    densityGML: 1,
    soluteMolarMassGMol: 1,
  },
  output: {
    molalityMolKg: 1.001001001001001,
  },
} satisfies ToolExample<
  MolalityFromMolarityDensityInput,
  MolalityFromMolarityDensityOutput
>;
