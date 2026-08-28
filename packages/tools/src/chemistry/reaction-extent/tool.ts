import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const reactionExtentTool = createSimpleTool({
  id: "chemistry/reaction-extent",
  title: "Reaction Extent Calculator",
  description:
    "Compute the extent of reaction ξ = (initial − remaining) / stoichiometric coefficient for a reactant.",
  inputs: [
    {
      description: "Initial moles of the tracked reactant.",
      id: "initialMoles",
      label: "Initial moles",
      kind: "number",
      minimum: 0,
      unit: "mol",
    },
    {
      description: "Moles of the reactant still present.",
      id: "remainingMoles",
      label: "Remaining moles",
      kind: "number",
      minimum: 0,
      unit: "mol",
    },
    {
      description:
        "Stoichiometric coefficient of the reactant; must be nonzero.",
      id: "coefficient",
      label: "Coefficient",
      kind: "number",
    },
  ],
  outputs: [
    {
      description: "Extent of reaction in moles of reaction events.",
      id: "extentMol",
      label: "Extent",
      kind: "number",
      unit: "mol",
    },
  ],
  calculate: (input) => {
    const coefficient = input.coefficient as number;
    if (!(coefficient > 0))
      simpleError(
        "coefficient",
        "The reactant stoichiometric coefficient must be greater than zero.",
        "invalid_coefficient",
      );
    if ((input.remainingMoles as number) > (input.initialMoles as number))
      simpleError(
        "remainingMoles",
        "Remaining reactant cannot exceed its initial amount.",
        "invalid_remaining_amount",
      );
    return {
      extentMol:
        ((input.initialMoles as number) - (input.remainingMoles as number)) /
        coefficient,
    };
  },
});
export const runReactionExtent = reactionExtentTool.execute;
export default reactionExtentTool;

export type ReactionExtentInput = {
  readonly initialMoles: number;
  readonly remainingMoles: number;
  readonly coefficient: number;
};

export type ReactionExtentOutput = {
  readonly extentMol: number;
};

export const reactionExtentExample = {
  input: {
    initialMoles: 1,
    remainingMoles: 1,
    coefficient: 1,
  },
  output: {
    extentMol: 0,
  },
} satisfies ToolExample<ReactionExtentInput, ReactionExtentOutput>;
