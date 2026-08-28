import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MolalityInput = {
  readonly molesSolute: number;
  readonly solventMassKg: number;
};

export type MolalityOutput = {
  readonly molality: number;
};

export const molalityExample = {
  input: { molesSolute: 0.75, solventMassKg: 0.5 },
  output: { molality: 1.5 },
} satisfies ToolExample<MolalityInput, MolalityOutput>;

export const molalityTool = createSimpleTool({
  id: "chemistry/molality",
  title: "Molality Calculator",
  description: "Compute molality from solute moles and solvent mass.",
  inputs: [
    {
      description: "Amount of dissolved solute.",
      id: "molesSolute",
      kind: "number",
      label: "Moles of solute",
      unit: "mol",
    },
    {
      description: "Mass of the solvent.",
      id: "solventMassKg",
      kind: "number",
      label: "Solvent mass",
      unit: "kg",
    },
  ],
  outputs: [
    {
      description: "Molal concentration of the solution.",
      id: "molality",
      kind: "number",
      label: "Molality",
      unit: "mol/kg",
    },
  ],
  calculate: (input) => {
    const molesSolute = input.molesSolute as number;
    if (molesSolute < 0)
      simpleError("molesSolute", "The solute amount cannot be negative.");
    const solventMassKg = input.solventMassKg as number;
    if (!(solventMassKg > 0))
      simpleError(
        "solventMassKg",
        "The solvent mass must be greater than zero.",
      );
    return { molality: molesSolute / solventMassKg };
  },
});
export const runMolality = molalityTool.execute;
export default molalityTool;
