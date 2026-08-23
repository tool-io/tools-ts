import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type UnearnedPremiumProRataInput = {
  readonly daysElapsed: number;
  readonly policyTermDays?: number;
  readonly writtenPremium: number;
};

export type UnearnedPremiumProRataOutput = {
  readonly unearnedPremium: number;
};

export const unearnedPremiumProRataExample = {
  input: {
    daysElapsed: 73,
    policyTermDays: 365,
    writtenPremium: 3650,
  },
  output: {
    unearnedPremium: 2920,
  },
} satisfies ToolExample<
  UnearnedPremiumProRataInput,
  UnearnedPremiumProRataOutput
>;

export const calculateUnearnedPremiumProRata = (
  input: UnearnedPremiumProRataInput,
): UnearnedPremiumProRataOutput => {
  const term = input.policyTermDays ?? 365;
  if (input.daysElapsed > term)
    simpleError(
      "daysElapsed",
      "Days elapsed cannot exceed the policy term.",
      "invalid_value",
    );
  return {
    unearnedPremium: roundStatistic(
      (input.writtenPremium * (term - input.daysElapsed)) / term,
    ),
  };
};

export const unearnedPremiumProRataTool = createSimpleTool({
  calculate: (input) =>
    calculateUnearnedPremiumProRata(
      input as unknown as UnearnedPremiumProRataInput,
    ),
  description:
    "Split a written premium into the unearned portion on a straight-line pro rata temporis basis.",
  id: "actuarial/unearned-premium-pro-rata",
  inputs: [
    {
      description: "Days of coverage already provided.",
      id: "daysElapsed",
      kind: "integer",
      label: "Days elapsed",
      maximum: 36500,
      minimum: 0,
    },
    {
      default: 365,
      description: "Total length of the policy term in days.",
      id: "policyTermDays",
      kind: "integer",
      label: "Policy term days",
      maximum: 36500,
      minimum: 1,
    },
    {
      description: "Premium written for the full policy term.",
      id: "writtenPremium",
      kind: "number",
      label: "Written premium",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Premium covering the remaining unexpired term.",
      id: "unearnedPremium",
      kind: "number",
      label: "Unearned premium",
    },
  ],
  title: "Unearned Premium Pro Rata Calculator",
});
export const runUnearnedPremiumProRata = unearnedPremiumProRataTool.execute;
export default unearnedPremiumProRataTool;
