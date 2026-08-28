import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MolesFromMassInput = {
  readonly massGrams: number;
  readonly molarMassGPerMol: number;
};

export type MolesFromMassOutput = {
  readonly moles: number;
};

export const molesFromMassExample = {
  input: { massGrams: 20, molarMassGPerMol: 4 },
  output: { moles: 5 },
} satisfies ToolExample<MolesFromMassInput, MolesFromMassOutput>;

export const molesFromMassTool = createSimpleTool({
  id: "chemistry/moles-from-mass",
  title: "Moles From Mass",
  description: "Compute the amount of substance from mass and molar mass.",
  inputs: [
    {
      description: "Mass of the substance sample.",
      id: "massGrams",
      kind: "number",
      label: "Mass",
      unit: "g",
    },
    {
      description: "Molar mass of the substance.",
      id: "molarMassGPerMol",
      kind: "number",
      label: "Molar mass",
      unit: "g/mol",
    },
  ],
  outputs: [
    {
      description: "Amount of substance in moles.",
      id: "moles",
      kind: "number",
      label: "Moles",
      unit: "mol",
    },
  ],
  calculate: (input) => {
    const massGrams = input.massGrams as number;
    if (massGrams < 0) simpleError("massGrams", "The mass cannot be negative.");
    const molarMassGPerMol = input.molarMassGPerMol as number;
    if (!(molarMassGPerMol > 0))
      simpleError(
        "molarMassGPerMol",
        "The molar mass must be greater than zero.",
      );
    return { moles: massGrams / molarMassGPerMol };
  },
});
export const runMolesFromMass = molesFromMassTool.execute;
export default molesFromMassTool;
