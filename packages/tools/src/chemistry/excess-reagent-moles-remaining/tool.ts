import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const excessReagentMolesRemainingTool = createSimpleTool({
  id: "chemistry/excess-reagent-moles-remaining",
  title: "Excess Reagent Moles Remaining Calculator",
  description:
    "Compute the moles of excess reagent left over after the limiting reagent is fully consumed.",
  inputs: [
    {
      description: "Moles of the limiting reagent consumed.",
      id: "limitingMoles",
      label: "Limiting moles",
      kind: "number",
      minimum: 0,
      unit: "mol",
    },
    {
      description: "Coefficient of the limiting reagent; must be nonzero.",
      id: "limitingCoeff",
      label: "Limiting coefficient",
      kind: "number",
    },
    {
      description: "Coefficient of the excess reagent; must be nonzero.",
      id: "excessCoeff",
      label: "Excess coefficient",
      kind: "number",
    },
    {
      description: "Starting moles of the excess reagent.",
      id: "availableMoles",
      label: "Available moles",
      kind: "number",
      minimum: 0,
      unit: "mol",
    },
  ],
  outputs: [
    {
      description: "Moles of excess reagent left after reaction.",
      id: "remainingMoles",
      label: "Remaining moles",
      kind: "number",
      unit: "mol",
    },
  ],
  calculate: (input) => {
    const limitingCoeff = input.limitingCoeff as number;
    const excessCoeff = input.excessCoeff as number;
    if (limitingCoeff === 0 || excessCoeff === 0)
      simpleError(
        "limitingCoeff",
        "Stoichiometric coefficients must be nonzero.",
        "invalid_coefficient",
      );
    const remainingMoles =
      (input.availableMoles as number) -
      ((input.limitingMoles as number) * excessCoeff) / limitingCoeff;
    if (remainingMoles < 0)
      simpleError(
        "availableMoles",
        "Available excess reagent is insufficient for the stated limiting amount.",
        "not_excess_reagent",
      );
    return { remainingMoles };
  },
});
export const runExcessReagentMolesRemaining =
  excessReagentMolesRemainingTool.execute;
export default excessReagentMolesRemainingTool;

export type ExcessReagentMolesRemainingInput = {
  readonly limitingMoles: number;
  readonly limitingCoeff: number;
  readonly excessCoeff: number;
  readonly availableMoles: number;
};

export type ExcessReagentMolesRemainingOutput = {
  readonly remainingMoles: number;
};

export const excessReagentMolesRemainingExample = {
  input: {
    limitingMoles: 1,
    limitingCoeff: 1,
    excessCoeff: 1,
    availableMoles: 1,
  },
  output: {
    remainingMoles: 0,
  },
} satisfies ToolExample<
  ExcessReagentMolesRemainingInput,
  ExcessReagentMolesRemainingOutput
>;
