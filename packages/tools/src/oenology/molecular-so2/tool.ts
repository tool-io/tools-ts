import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type MolecularSo2Input = {
  readonly freeSo2MgPerL: number;
  readonly ph: number;
};

export type MolecularSo2Output = {
  readonly molecularSo2MgPerL: number;
};

export const molecularSo2Example = {
  input: {
    freeSo2MgPerL: 16,
    ph: 3,
  },
  output: {
    molecularSo2MgPerL: 0.97039293615,
  },
} satisfies ToolExample<MolecularSo2Input, MolecularSo2Output>;

const SO2_PKA = 1.81;

export const calculateMolecularSo2 = (
  input: MolecularSo2Input,
): MolecularSo2Output => {
  const molecularFraction = 1 / (1 + 10 ** (input.ph - SO2_PKA));
  return {
    molecularSo2MgPerL: roundStatistic(input.freeSo2MgPerL * molecularFraction),
  };
};

export const molecularSo2Tool = createSimpleTool({
  calculate: (input) =>
    calculateMolecularSo2(input as unknown as MolecularSo2Input),
  description:
    "Convert free sulfur dioxide to active molecular SO2 at the wine pH using the bisulfite pKa.",
  id: "oenology/molecular-so2",
  inputs: [
    {
      description: "Free SO2 measured in the wine.",
      id: "freeSo2MgPerL",
      kind: "number",
      label: "Free SO2",
      minimum: 0,
      unit: "mg/L",
    },
    {
      description: "Measured pH of the wine.",
      id: "ph",
      label: "pH",
      kind: "number",
      maximum: 14,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Estimated molecular SO2 at the supplied pH.",
      id: "molecularSo2MgPerL",
      kind: "number",
      label: "Molecular SO2",
      unit: "mg/L",
    },
  ],
  title: "Molecular SO2 from Free SO2 Calculator",
});
export const runMolecularSo2 = molecularSo2Tool.execute;
export default molecularSo2Tool;
