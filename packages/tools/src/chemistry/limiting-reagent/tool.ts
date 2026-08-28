import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LimitingReagentInput = {
  readonly ratioAB: number;
  readonly reactantAMoles: number;
  readonly reactantBMoles: number;
};

export type LimitingReagentOutput = {
  readonly limitingReagent: string;
  readonly productMoles: number;
};

export const limitingReagentExample = {
  input: { reactantAMoles: 2, reactantBMoles: 6, ratioAB: 2 },
  output: { limitingReagent: "reactant-a", productMoles: 2 },
} satisfies ToolExample<LimitingReagentInput, LimitingReagentOutput>;

export const limitingReagentTool = createSimpleTool({
  id: "chemistry/limiting-reagent",
  title: "Limiting Reagent Finder",
  description:
    "Identify the limiting reagent and the product amount for a reaction needing ratioAB moles of B per mole of A.",
  inputs: [
    {
      description: "Available amount of reactant A.",
      id: "reactantAMoles",
      kind: "number",
      label: "Reactant A moles",
      unit: "mol",
    },
    {
      description: "Available amount of reactant B.",
      id: "reactantBMoles",
      kind: "number",
      label: "Reactant B moles",
      unit: "mol",
    },
    {
      description: "Moles of B required per mole of A.",
      id: "ratioAB",
      kind: "number",
      label: "Stoichiometric ratio B:A",
    },
  ],
  outputs: [
    {
      description: "Which reactant limits the reaction.",
      id: "limitingReagent",
      kind: "string",
      label: "Limiting reagent",
    },
    {
      description: "Maximum producible amount of product.",
      id: "productMoles",
      kind: "number",
      label: "Product moles",
      unit: "mol",
    },
  ],
  calculate: (input) => {
    const reactantAMoles = input.reactantAMoles as number;
    if (!(reactantAMoles > 0))
      simpleError(
        "reactantAMoles",
        "Reactant A amount must be greater than zero.",
      );
    const reactantBMoles = input.reactantBMoles as number;
    if (!(reactantBMoles > 0))
      simpleError(
        "reactantBMoles",
        "Reactant B amount must be greater than zero.",
      );
    const ratioAB = input.ratioAB as number;
    if (!(ratioAB > 0))
      simpleError(
        "ratioAB",
        "The stoichiometric ratio must be greater than zero.",
      );
    const possibleFromA = reactantAMoles;
    const possibleFromB = reactantBMoles / ratioAB;
    const limitingReagent =
      possibleFromA <= possibleFromB ? "reactant-a" : "reactant-b";
    return {
      limitingReagent,
      productMoles: Math.min(possibleFromA, possibleFromB),
    };
  },
});
export const runLimitingReagent = limitingReagentTool.execute;
export default limitingReagentTool;
