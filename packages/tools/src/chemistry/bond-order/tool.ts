import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const bondOrderTool = createSimpleTool({
  id: "chemistry/bond-order",
  title: "Bond Order Calculator",
  description:
    "Compute molecular orbital bond order as (bonding electrons − antibonding electrons) / 2.",
  inputs: [
    {
      description: "Electrons occupying bonding MOs.",
      id: "bondingElectrons",
      label: "Bonding electrons",
      kind: "integer",
      minimum: 0,
    },
    {
      description: "Electrons occupying antibonding MOs.",
      id: "antibondingElectrons",
      label: "Antibonding electrons",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [{ id: "bondOrder", label: "Bond order", kind: "number" }],
  calculate: (input) => {
    return {
      bondOrder:
        ((input.bondingElectrons as number) -
          (input.antibondingElectrons as number)) /
        2,
    };
  },
});
export const runBondOrder = bondOrderTool.execute;
export default bondOrderTool;

export type BondOrderInput = {
  readonly bondingElectrons: number;
  readonly antibondingElectrons: number;
};

export type BondOrderOutput = {
  readonly bondOrder: number;
};

export const bondOrderExample = {
  input: {
    bondingElectrons: 1,
    antibondingElectrons: 1,
  },
  output: {
    bondOrder: 0,
  },
} satisfies ToolExample<BondOrderInput, BondOrderOutput>;
