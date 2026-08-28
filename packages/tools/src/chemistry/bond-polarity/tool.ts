import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const bondPolarityExample = {
  input: {
    enA: 2.2,
    enB: 3.44,
  },
  output: {
    deltaEn: 1.2399999999999998,
  },
};

export const calculateBondPolarity = (input: {
  readonly enA: number;
  readonly enB: number;
}): { readonly deltaEn: number } => ({
  deltaEn: Math.abs(input.enA - input.enB),
});

export const bondPolarityTool = createSimpleTool({
  id: "chemistry/bond-polarity",
  title: "Bond Polarity Calculator",
  description: "Compute electronegativity difference between two bonded atoms.",
  inputs: [
    {
      description: "Electronegativity of atom A (Pauling scale).",
      id: "enA",
      kind: "number",
      label: "EN A",
      maximum: 4,
      minimum: 0,
    },
    {
      description: "Electronegativity of atom B (Pauling scale).",
      id: "enB",
      kind: "number",
      label: "EN B",
      maximum: 4,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Absolute electronegativity difference.",
      id: "deltaEn",
      kind: "number",
      label: "Delta EN",
    },
  ],
  calculate: (input) => ({
    deltaEn: Math.abs((input.enA as number) - (input.enB as number)),
  }),
});
export const runBondPolarity = bondPolarityTool.execute;
export default bondPolarityTool;

export type BondPolarityInput = {
  readonly enA: number;
  readonly enB: number;
};

export type BondPolarityOutput = {
  readonly deltaEn: number;
};
