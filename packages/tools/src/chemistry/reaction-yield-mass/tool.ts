import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const reactionYieldMassTool = createSimpleTool({
  id: "chemistry/reaction-yield-mass",
  title: "Reaction Yield Mass Calculator",
  description:
    "Compute the actual product mass from product moles, molar mass, and a percent yield.",
  inputs: [
    {
      description: "Moles of product formed at full conversion.",
      id: "productMoles",
      label: "Product moles",
      kind: "number",
      minimum: 0,
      unit: "mol",
    },
    {
      description: "Molar mass of the product.",
      id: "molarMassGMol",
      label: "Molar mass",
      kind: "number",
      minimum: 0,
      unit: "g/mol",
    },
    {
      description: "Percent yield between zero and one hundred.",
      id: "percentYield",
      label: "Percent yield",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      description: "Actual mass of collected product.",
      id: "actualMassG",
      label: "Actual mass",
      kind: "number",
      unit: "g",
    },
  ],
  calculate: (input) => {
    return {
      actualMassG:
        ((input.productMoles as number) *
          (input.molarMassGMol as number) *
          (input.percentYield as number)) /
        100,
    };
  },
});
export const runReactionYieldMass = reactionYieldMassTool.execute;
export default reactionYieldMassTool;

export type ReactionYieldMassInput = {
  readonly productMoles: number;
  readonly molarMassGMol: number;
  readonly percentYield: number;
};

export type ReactionYieldMassOutput = {
  readonly actualMassG: number;
};

export const reactionYieldMassExample = {
  input: {
    productMoles: 1,
    molarMassGMol: 1,
    percentYield: 1,
  },
  output: {
    actualMassG: 0.01,
  },
} satisfies ToolExample<ReactionYieldMassInput, ReactionYieldMassOutput>;
