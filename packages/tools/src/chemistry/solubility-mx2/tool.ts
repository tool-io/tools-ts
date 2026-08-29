import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const solubilityMx2Tool = createSimpleTool({
  id: "chemistry/solubility-mx2",
  title: "Solubility MX2 Calculator",
  description: "Compute molar solubility s of an MX2 salt from Ksp = 4s^3.",
  inputs: [
    {
      id: "ksp",
      label: "Ksp",
      kind: "number",
      description: "Solubility product constant.",
    },
  ],
  outputs: [
    {
      id: "solubilityMolL",
      label: "Solubility",
      kind: "number",
      unit: "mol/L",
      description: "Molar solubility.",
    },
  ],
  calculate: (input) => {
    if (!((input.ksp as number) > 0))
      simpleError("ksp", "Ksp must be greater than zero.", "invalid_ksp");
    return { solubilityMolL: ((input.ksp as number) / 4) ** (1 / 3) };
  },
});
export const runSolubilityMx2 = solubilityMx2Tool.execute;
export default solubilityMx2Tool;

export type SolubilityMx2Input = {
  readonly ksp: number;
};

export type SolubilityMx2Output = {
  readonly solubilityMolL: number;
};

export const solubilityMx2Example = {
  input: {
    ksp: 1,
  },
  output: {
    solubilityMolL: 0.6299605249474366,
  },
} satisfies ToolExample<SolubilityMx2Input, SolubilityMx2Output>;
