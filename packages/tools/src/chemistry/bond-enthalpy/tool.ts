import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const bondEnthalpyTool = createSimpleTool({
  id: "chemistry/bond-enthalpy",
  title: "Bond Enthalpy Calculator",
  description: "Calculate bond enthalpy calculator.",
  inputs: [
    {
      description: "Bonds broken.",
      id: "bondsBrokenKJPerMol",
      kind: "number",
      label: "Broken",
      minimum: 0,
    },
    {
      description: "Bonds formed.",
      id: "bondsFormedKJPerMol",
      kind: "number",
      label: "Formed",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Reaction enthalpy from bond energies.",
      id: "reactionEnthalpyKJPerMol",
      kind: "number",
      label: "dH rxn",
    },
  ],
  calculate: (input) => {
    return {
      reactionEnthalpyKJPerMol:
        (input.bondsBrokenKJPerMol as number) -
        (input.bondsFormedKJPerMol as number),
    };
  },
});
export default bondEnthalpyTool;
export const runBondEnthalpy = bondEnthalpyTool.execute;

export type BondEnthalpyInput = {
  readonly bondsBrokenKJPerMol: number;
  readonly bondsFormedKJPerMol: number;
};

export type BondEnthalpyOutput = {
  readonly reactionEnthalpyKJPerMol: number;
};

export const bondEnthalpyExample = {
  input: {
    bondsBrokenKJPerMol: 1,
    bondsFormedKJPerMol: 1,
  },
  output: {
    reactionEnthalpyKJPerMol: 0,
  },
} satisfies ToolExample<BondEnthalpyInput, BondEnthalpyOutput>;
