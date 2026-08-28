import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const limitingReagentExcessAmountTool = createSimpleTool({
  id: "chemistry/limiting-reagent-excess-amount",
  title: "Limiting Reagent Excess Amount Calculator",
  description:
    "Compute the leftover moles of an excess reagent after complete consumption of the limiting reagent.",
  inputs: [
    {
      description: "Moles of the limiting reagent consumed.",
      id: "limitingMoles",
      label: "Limiting reagent",
      kind: "number",
      minimum: 0,
      unit: "mol",
    },
    {
      description:
        "Stoichiometric coefficient of the limiting reagent; must be nonzero.",
      id: "limitingCoeff",
      label: "Limiting coefficient",
      kind: "number",
    },
    {
      description:
        "Stoichiometric coefficient of the excess reagent; must be nonzero.",
      id: "excessCoeff",
      label: "Excess coefficient",
      kind: "number",
    },
    {
      description: "Starting moles of the excess reagent.",
      id: "excessAvailableMoles",
      label: "Excess available",
      kind: "number",
      minimum: 0,
      unit: "mol",
    },
  ],
  outputs: [
    {
      description: "Moles of the excess reagent remaining after reaction.",
      id: "excessRemainingMoles",
      label: "Excess remaining",
      kind: "number",
      unit: "mol",
    },
  ],
  calculate: (input) => {
    const limitingCoeff = input.limitingCoeff as number;
    if (limitingCoeff === 0)
      simpleError(
        "limitingCoeff",
        "The limiting coefficient must be nonzero.",
        "invalid_coefficient",
      );
    const consumed =
      ((input.limitingMoles as number) * (input.excessCoeff as number)) /
      limitingCoeff;
    const excessRemainingMoles =
      (input.excessAvailableMoles as number) - consumed;
    if (excessRemainingMoles < 0)
      simpleError(
        "excessAvailableMoles",
        "The stated excess reagent is actually limiting for these amounts.",
        "not_excess_reagent",
      );
    return { excessRemainingMoles };
  },
});
export const runLimitingReagentExcessAmount =
  limitingReagentExcessAmountTool.execute;
export default limitingReagentExcessAmountTool;

export type LimitingReagentExcessAmountInput = {
  readonly limitingMoles: number;
  readonly limitingCoeff: number;
  readonly excessCoeff: number;
  readonly excessAvailableMoles: number;
};

export type LimitingReagentExcessAmountOutput = {
  readonly excessRemainingMoles: number;
};

export const limitingReagentExcessAmountExample = {
  input: {
    limitingMoles: 1,
    limitingCoeff: 1,
    excessCoeff: 1,
    excessAvailableMoles: 1,
  },
  output: {
    excessRemainingMoles: 0,
  },
} satisfies ToolExample<
  LimitingReagentExcessAmountInput,
  LimitingReagentExcessAmountOutput
>;
