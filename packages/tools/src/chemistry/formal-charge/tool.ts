import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const formalChargeTool = createSimpleTool({
  id: "chemistry/formal-charge",
  title: "Formal Charge Calculator",
  description:
    "Compute the formal charge as valence electrons minus nonbonding electrons minus half of the bonding electrons.",
  inputs: [
    {
      description: "Valence electrons of the free neutral atom.",
      id: "valenceElectrons",
      label: "Valence electrons",
      kind: "integer",
      minimum: 0,
    },
    {
      description: "Lone-pair (nonbonding) electrons on the atom.",
      id: "nonbondingElectrons",
      label: "Nonbonding electrons",
      kind: "integer",
      minimum: 0,
    },
    {
      description: "Total electrons in bonds shared by the atom.",
      id: "bondingElectrons",
      label: "Bonding electrons",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [{ id: "formalCharge", label: "Formal charge", kind: "integer" }],
  calculate: (input) => {
    return {
      formalCharge:
        (input.valenceElectrons as number) -
        (input.nonbondingElectrons as number) -
        (input.bondingElectrons as number) / 2,
    };
  },
});
export const runFormalCharge = formalChargeTool.execute;
export default formalChargeTool;

export type FormalChargeInput = {
  readonly valenceElectrons: number;
  readonly nonbondingElectrons: number;
  readonly bondingElectrons: number;
};

export type FormalChargeOutput = {
  readonly formalCharge: number;
};

export const formalChargeExample = {
  input: {
    valenceElectrons: 1,
    nonbondingElectrons: 1,
    bondingElectrons: 2,
  },
  output: {
    formalCharge: -1,
  },
} satisfies ToolExample<FormalChargeInput, FormalChargeOutput>;
