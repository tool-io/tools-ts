import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MolarityInput = {
  readonly molesSolute: number;
  readonly volumeLiters: number;
};

export type MolarityOutput = {
  readonly molarity: number;
};

export const molarityExample = {
  input: { molesSolute: 0.5, volumeLiters: 2 },
  output: { molarity: 0.25 },
} satisfies ToolExample<MolarityInput, MolarityOutput>;

export const molarityTool = createSimpleTool({
  id: "chemistry/molarity",
  title: "Molarity Calculator",
  description: "Compute solution molarity from solute moles and volume.",
  inputs: [
    {
      description: "Amount of dissolved solute.",
      id: "molesSolute",
      kind: "number",
      label: "Moles of solute",
      unit: "mol",
    },
    {
      description: "Total volume of the solution.",
      id: "volumeLiters",
      kind: "number",
      label: "Volume",
      unit: "L",
    },
  ],
  outputs: [
    {
      description: "Molar concentration of the solution.",
      id: "molarity",
      kind: "number",
      label: "Molarity",
      unit: "mol/L",
    },
  ],
  calculate: (input) => {
    const molesSolute = input.molesSolute as number;
    if (molesSolute < 0)
      simpleError("molesSolute", "The solute amount cannot be negative.");
    const volumeLiters = input.volumeLiters as number;
    if (!(volumeLiters > 0))
      simpleError("volumeLiters", "The volume must be greater than zero.");
    return { molarity: molesSolute / volumeLiters };
  },
});
export const runMolarity = molarityTool.execute;
export default molarityTool;
