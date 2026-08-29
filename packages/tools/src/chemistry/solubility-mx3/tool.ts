import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const solubilityMx3Tool = createSimpleTool({
  id: "chemistry/solubility-mx3",
  title: "Solubility MX3 Calculator",
  description: "Compute molar solubility s of an MX3 salt from Ksp = 27s^4.",
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
    return { solubilityMolL: ((input.ksp as number) / 27) ** (1 / 4) };
  },
});
export const runSolubilityMx3 = solubilityMx3Tool.execute;
export default solubilityMx3Tool;

export type SolubilityMx3Input = {
  readonly ksp: number;
};

export type SolubilityMx3Output = {
  readonly solubilityMolL: number;
};

export const solubilityMx3Example = {
  input: {
    ksp: 1,
  },
  output: {
    solubilityMolL: 0.4386913376508308,
  },
} satisfies ToolExample<SolubilityMx3Input, SolubilityMx3Output>;
