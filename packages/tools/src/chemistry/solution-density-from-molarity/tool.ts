import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const solutionDensityFromMolarityTool = createSimpleTool({
  id: "chemistry/solution-density-from-molarity",
  title: "Solution Density From Molarity Calculator",
  description:
    "Derive solution density from molarity and molality via rearranged interconversion ρ = M(1 + mMw/1000)/m.",
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
      description: "Molality of the solution; must be greater than zero.",
      id: "molalityMolKg",
      label: "Molality",
      kind: "number",
      minimum: 0,
      unit: "mol/kg",
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
      description: "Solution density in grams per milliliter.",
      id: "densityGML",
      label: "Density",
      kind: "number",
      unit: "g/mL",
    },
  ],
  calculate: (input) => {
    const molality = input.molalityMolKg as number;
    const molarMass = input.soluteMolarMassGMol as number;
    if (molality <= 0 || molarMass <= 0)
      simpleError(
        "molalityMolKg",
        "The molality and molar mass must be greater than zero.",
        "invalid_molality_or_mass",
      );
    return {
      densityGML:
        ((input.molarityMolL as number) * (1 + (molality * molarMass) / 1000)) /
        molality,
    };
  },
});
export const runSolutionDensityFromMolarity =
  solutionDensityFromMolarityTool.execute;
export default solutionDensityFromMolarityTool;

export type SolutionDensityFromMolarityInput = {
  readonly molarityMolL: number;
  readonly molalityMolKg: number;
  readonly soluteMolarMassGMol: number;
};

export type SolutionDensityFromMolarityOutput = {
  readonly densityGML: number;
};

export const solutionDensityFromMolarityExample = {
  input: {
    molarityMolL: 1,
    molalityMolKg: 1,
    soluteMolarMassGMol: 1,
  },
  output: {
    densityGML: 1.001,
  },
} satisfies ToolExample<
  SolutionDensityFromMolarityInput,
  SolutionDensityFromMolarityOutput
>;
