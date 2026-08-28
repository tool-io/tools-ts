import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const massFractionToMoleFractionTool = createSimpleTool({
  id: "chemistry/mass-fraction-to-mole-fraction",
  title: "Mass Fraction to Mole Fraction Converter",
  description:
    "Convert component mass fractions to mole fractions for a binary mixture via x₁ = (w₁/M₁)/(w₁/M₁ + w₂/M₂).",
  inputs: [
    {
      description: "Mass fraction of component one.",
      id: "massFraction1",
      label: "Mass fraction 1",
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
      description: "Mass fraction of component two.",
      id: "massFraction2",
      label: "Mass fraction 2",
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
      description: "Mole fraction of component one.",
      id: "moleFraction1",
      label: "Mole fraction 1",
      kind: "number",
    },
    {
      description: "Mole fraction of component two.",
      id: "moleFraction2",
      label: "Mole fraction 2",
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
    const moles1 = (input.massFraction1 as number) / m1;
    const moles2 = (input.massFraction2 as number) / m2;
    const total = moles1 + moles2;
    if (total === 0)
      simpleError(
        "massFraction1",
        "At least one mass fraction must be greater than zero.",
        "invalid_fractions",
      );
    return { moleFraction1: moles1 / total, moleFraction2: moles2 / total };
  },
});
export const runMassFractionToMoleFraction =
  massFractionToMoleFractionTool.execute;
export default massFractionToMoleFractionTool;

export type MassFractionToMoleFractionInput = {
  readonly massFraction1: number;
  readonly molarMass1GMol: number;
  readonly massFraction2: number;
  readonly molarMass2GMol: number;
};

export type MassFractionToMoleFractionOutput = {
  readonly moleFraction1: number;
  readonly moleFraction2: number;
};

export const massFractionToMoleFractionExample = {
  input: {
    massFraction1: 1,
    molarMass1GMol: 1,
    massFraction2: 1,
    molarMass2GMol: 1,
  },
  output: {
    moleFraction1: 0.5,
    moleFraction2: 0.5,
  },
} satisfies ToolExample<
  MassFractionToMoleFractionInput,
  MassFractionToMoleFractionOutput
>;
