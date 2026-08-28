import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const chargeBalanceTool = createSimpleTool({
  id: "chemistry/charge-balance",
  title: "Charge Balance Checker",
  description:
    "Sum signed ionic charges and check electroneutrality of a species or solution.",
  inputs: [
    {
      description: "Signed charges of cations and anions (anions negative).",
      id: "cationCharges",
      label: "Ion charges",
      kind: "numberList",
    },
    {
      description: "Additional signed charges to include in the balance.",
      id: "anionCharges",
      label: "Extra ion charges",
      kind: "numberList",
    },
  ],
  outputs: [
    {
      description: "Net charge after summing all ions.",
      id: "netCharge",
      label: "Net charge",
      kind: "number",
    },
    {
      description: "Whether the net charge is exactly zero.",
      id: "balanced",
      label: "Balanced",
      kind: "boolean",
    },
  ],
  calculate: (input) => {
    const all = [
      ...(input.cationCharges as number[]),
      ...(input.anionCharges as number[]),
    ];
    const netCharge = all.reduce((sum, charge) => sum + charge, 0);
    return { netCharge, balanced: netCharge === 0 };
  },
});
export const runChargeBalance = chargeBalanceTool.execute;
export default chargeBalanceTool;

export type ChargeBalanceInput = {
  readonly cationCharges: readonly number[];
  readonly anionCharges: readonly number[];
};

export type ChargeBalanceOutput = {
  readonly netCharge: number;
  readonly balanced: boolean;
};

export const chargeBalanceExample = {
  input: {
    cationCharges: [1],
    anionCharges: [1],
  },
  output: {
    netCharge: 2,
    balanced: false,
  },
} satisfies ToolExample<ChargeBalanceInput, ChargeBalanceOutput>;
