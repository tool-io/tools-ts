import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const excessReagentMassRemainingTool = createSimpleTool({
  id: "chemistry/excess-reagent-mass-remaining",
  title: "Excess Reagent Mass Remaining Calculator",
  description:
    "Convert the leftover moles of an excess reagent into mass using its molar mass.",
  inputs: [
    {
      description: "Moles of the excess reagent remaining after reaction.",
      id: "remainingMoles",
      label: "Remaining moles",
      kind: "number",
      minimum: 0,
      unit: "mol",
    },
    {
      description:
        "Molar mass of the excess reagent; must be greater than zero.",
      id: "molarMassGMol",
      label: "Molar mass",
      kind: "number",
      unit: "g/mol",
    },
  ],
  outputs: [
    {
      description: "Remaining mass of the excess reagent.",
      id: "remainingMassG",
      label: "Remaining mass",
      kind: "number",
      unit: "g",
    },
  ],
  calculate: (input) => {
    return {
      remainingMassG:
        (input.remainingMoles as number) * (input.molarMassGMol as number),
    };
  },
});
export const runExcessReagentMassRemaining =
  excessReagentMassRemainingTool.execute;
export default excessReagentMassRemainingTool;

export type ExcessReagentMassRemainingInput = {
  readonly remainingMoles: number;
  readonly molarMassGMol: number;
};

export type ExcessReagentMassRemainingOutput = {
  readonly remainingMassG: number;
};

export const excessReagentMassRemainingExample = {
  input: {
    remainingMoles: 1,
    molarMassGMol: 1,
  },
  output: {
    remainingMassG: 1,
  },
} satisfies ToolExample<
  ExcessReagentMassRemainingInput,
  ExcessReagentMassRemainingOutput
>;
