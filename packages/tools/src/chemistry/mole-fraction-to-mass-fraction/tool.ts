import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const moleFractionToMassFractionTool = createSimpleTool({
  id: "chemistry/mole-fraction-to-mass-fraction",
  title: "Mole Fraction to Mass Fraction Converter",
  description:
    "Convert component mole fractions to mass fractions for a binary mixture via w₁ = x₁M₁/(x₁M₁ + x₂M₂).",
  inputs: [
    {
      description: "Mole fraction of component one.",
      id: "moleFraction1",
      label: "Mole fraction 1",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
    {
      description: "Molar mass of component one; must be greater than zero.",
      id: "molarMass1GMol",
      label: "Molar mass 1",
      kind: "number",
      unit: "g/mol",
    },
    {
      description: "Mole fraction of component two.",
      id: "moleFraction2",
      label: "Mole fraction 2",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
    {
      description: "Molar mass of component two; must be greater than zero.",
      id: "molarMass2GMol",
      label: "Molar mass 2",
      kind: "number",
      unit: "g/mol",
    },
  ],
  outputs: [
    {
      description: "Mass fraction of component one.",
      id: "massFraction1",
      label: "Mass fraction 1",
      kind: "number",
    },
    {
      description: "Mass fraction of component two.",
      id: "massFraction2",
      label: "Mass fraction 2",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const m1 = input.molarMass1GMol as number;
    const m2 = input.molarMass2GMol as number;
    if (m1 <= 0 || m2 <= 0)
      simpleError(
        "molarMass1GMol",
        "Both molar masses must be greater than zero.",
        "invalid_molar_mass",
      );
    const part1 = (input.moleFraction1 as number) * m1;
    const part2 = (input.moleFraction2 as number) * m2;
    const total = part1 + part2;
    if (total === 0)
      simpleError(
        "moleFraction1",
        "At least one mole fraction must be greater than zero.",
        "invalid_fractions",
      );
    return { massFraction1: part1 / total, massFraction2: part2 / total };
  },
});
export const runMoleFractionToMassFraction =
  moleFractionToMassFractionTool.execute;
export default moleFractionToMassFractionTool;

export type MoleFractionToMassFractionInput = {
  readonly moleFraction1: number;
  readonly molarMass1GMol: number;
  readonly moleFraction2: number;
  readonly molarMass2GMol: number;
};

export type MoleFractionToMassFractionOutput = {
  readonly massFraction1: number;
  readonly massFraction2: number;
};

export const moleFractionToMassFractionExample = {
  input: {
    moleFraction1: 1,
    molarMass1GMol: 1,
    moleFraction2: 1,
    molarMass2GMol: 1,
  },
  output: {
    massFraction1: 0.5,
    massFraction2: 0.5,
  },
} satisfies ToolExample<
  MoleFractionToMassFractionInput,
  MoleFractionToMassFractionOutput
>;
