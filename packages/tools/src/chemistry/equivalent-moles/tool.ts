import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const equivalentMolesTool = createSimpleTool({
  id: "chemistry/equivalent-moles",
  title: "Equivalent Moles Calculator",
  description:
    "Compute equivalents of a substance as moles times its valence (protons, hydroxides, or electrons transferred).",
  inputs: [
    {
      description: "Moles of solute.",
      id: "moles",
      label: "Moles",
      kind: "number",
      minimum: 0,
      unit: "mol",
    },
    {
      description: "Valence: equivalents contributed per mole.",
      id: "valence",
      label: "Valence",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Equivalents of the substance.",
      id: "equivalents",
      label: "Equivalents",
      kind: "number",
      unit: "eq",
    },
  ],
  calculate: (input) => {
    if (!((input.valence as number) > 0))
      simpleError("valence", "Equivalents per mole must be greater than zero.");
    return {
      equivalents: (input.moles as number) * (input.valence as number),
    };
  },
});
export const runEquivalentMoles = equivalentMolesTool.execute;
export default equivalentMolesTool;

export type EquivalentMolesInput = {
  readonly moles: number;
  readonly valence: number;
};

export type EquivalentMolesOutput = {
  readonly equivalents: number;
};

export const equivalentMolesExample = {
  input: {
    moles: 1,
    valence: 1,
  },
  output: {
    equivalents: 1,
  },
} satisfies ToolExample<EquivalentMolesInput, EquivalentMolesOutput>;
