import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MoleFractionInput = {
  readonly molesA: number;
  readonly molesB: number;
};

export type MoleFractionOutput = {
  readonly moleFraction: number;
};

export const moleFractionExample = {
  input: { molesA: 1, molesB: 3 },
  output: { moleFraction: 0.25 },
} satisfies ToolExample<MoleFractionInput, MoleFractionOutput>;

export const moleFractionTool = createSimpleTool({
  id: "chemistry/mole-fraction",
  title: "Mole Fraction Calculator",
  description:
    "Compute the mole fraction of component A in a binary mixture with component B.",
  inputs: [
    {
      description: "Amount of component A.",
      id: "molesA",
      kind: "number",
      label: "Moles of A",
      unit: "mol",
    },
    {
      description: "Amount of component B.",
      id: "molesB",
      kind: "number",
      label: "Moles of B",
      unit: "mol",
    },
  ],
  outputs: [
    {
      description: "Mole fraction of component A.",
      format: "percent",
      id: "moleFraction",
      kind: "number",
      label: "Mole fraction",
    },
  ],
  calculate: (input) => {
    const molesA = input.molesA as number;
    if (molesA < 0)
      simpleError("molesA", "The amount of component A cannot be negative.");
    const molesB = input.molesB as number;
    if (molesB < 0)
      simpleError("molesB", "The amount of component B cannot be negative.");
    if (molesA + molesB === 0)
      simpleError("molesA", "At least one component amount must be positive.");
    return { moleFraction: molesA / (molesA + molesB) };
  },
});
export const runMoleFraction = moleFractionTool.execute;
export default moleFractionTool;
