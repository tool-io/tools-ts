import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const bondDissociationEnthalpyExample = {
  input: { bondCountInt: 4, totalBondEnergyKJ: 1652 },
  output: { averageBondEnthalpyKJPerMol: 413 },
} satisfies ToolExample<
  {
    readonly bondCountInt: number;
    readonly totalBondEnergyKJ: number;
  },
  { readonly averageBondEnthalpyKJPerMol: number }
>;

export const bondDissociationEnthalpyTool = createSimpleTool({
  id: "chemistry/bond-dissociation-enthalpy",
  title: "BDE Average",
  description:
    "Compute the average bond dissociation enthalpy by dividing a total bond energy over the number of bonds.",
  inputs: [
    {
      id: "totalBondEnergyKJ",
      label: "Total bond energy",
      kind: "number",
      unit: "kJ",
    },
    {
      id: "bondCountInt",
      label: "Number of bonds",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "averageBondEnthalpyKJPerMol",
      label: "Average bond enthalpy",
      kind: "number",
      unit: "kJ/mol",
    },
  ],
  calculate: (input) => {
    const totalBondEnergyKJ = input.totalBondEnergyKJ as number;
    const bondCountInt = input.bondCountInt as number;
    if (!(totalBondEnergyKJ > 0))
      simpleError("totalBondEnergyKJ", "Total bond energy must be positive.");
    return { averageBondEnthalpyKJPerMol: totalBondEnergyKJ / bondCountInt };
  },
});
export const runBondDissociationEnthalpy = bondDissociationEnthalpyTool.execute;
export default bondDissociationEnthalpyTool;
