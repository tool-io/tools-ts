import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const bondEnergyTool = createSimpleTool({
  id: "chemistry/bond-energy",
  title: "Bond Energy Calculator",
  description:
    "Compute total bond energy from number of bonds and energy per bond.",
  inputs: [
    {
      description: "Number of bonds.",
      id: "numBonds",
      kind: "integer",
      label: "Number of bonds",
      minimum: 0,
    },
    {
      description: "Energy per individual bond.",
      id: "energyPerBondKJPerMol",
      kind: "number",
      label: "Energy per bond",
      minimum: 0,
      unit: "kJ/mol",
    },
  ],
  outputs: [
    {
      description: "Total bond energy.",
      id: "totalEnergyKJPerMol",
      kind: "number",
      label: "Total bond energy",
      unit: "kJ/mol",
    },
  ],
  calculate: (input) => {
    return {
      totalEnergyKJPerMol:
        (input.numBonds as number) * (input.energyPerBondKJPerMol as number),
    };
  },
});
export const runBondEnergy = bondEnergyTool.execute;
export default bondEnergyTool;

export type BondEnergyInput = {
  readonly numBonds: number;
  readonly energyPerBondKJPerMol: number;
};

export type BondEnergyOutput = {
  readonly totalEnergyKJPerMol: number;
};

export const bondEnergyExample = {
  input: {
    numBonds: 1,
    energyPerBondKJPerMol: 1,
  },
  output: {
    totalEnergyKJPerMol: 1,
  },
} satisfies ToolExample<BondEnergyInput, BondEnergyOutput>;
