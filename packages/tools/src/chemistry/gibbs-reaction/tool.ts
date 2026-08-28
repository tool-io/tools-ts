import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const gibbsReactionTool = createSimpleTool({
  id: "chemistry/gibbs-reaction",
  title: "Gibbs Reaction Calculator",
  description:
    "Compute standard Gibbs free energy of reaction from products minus reactants.",
  inputs: [
    {
      id: "productGibbsKJPerMol",
      label: "Product dGf",
      kind: "numberList",
      unit: "kJ/mol",
    },
    {
      id: "reactantGibbsKJPerMol",
      label: "Reactant dGf",
      kind: "numberList",
      unit: "kJ/mol",
    },
  ],
  outputs: [
    {
      id: "reactionGibbsKJPerMol",
      label: "dG rxn",
      kind: "number",
      unit: "kJ/mol",
    },
  ],
  calculate: (input) => {
    const sum = (v: number[]) => v.reduce((a, b) => a + b, 0);
    return {
      reactionGibbsKJPerMol:
        sum(input.productGibbsKJPerMol as number[]) -
        sum(input.reactantGibbsKJPerMol as number[]),
    };
  },
});
export const runGibbsReaction = gibbsReactionTool.execute;
export default gibbsReactionTool;

export type GibbsReactionInput = {
  readonly productGibbsKJPerMol: readonly number[];
  readonly reactantGibbsKJPerMol: readonly number[];
};

export type GibbsReactionOutput = {
  readonly reactionGibbsKJPerMol: number;
};

export const gibbsReactionExample = {
  input: {
    productGibbsKJPerMol: [1],
    reactantGibbsKJPerMol: [1],
  },
  output: {
    reactionGibbsKJPerMol: 0,
  },
} satisfies ToolExample<GibbsReactionInput, GibbsReactionOutput>;
