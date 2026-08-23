import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type NetSinglePremiumInput = {
  readonly annualDeathProbability: number;
  readonly benefitAmount?: number;
  readonly interestRate: number;
};

export type NetSinglePremiumOutput = {
  readonly netSinglePremium: number;
};

export const netSinglePremiumExample = {
  input: {
    annualDeathProbability: 0.25,
    benefitAmount: 10,
    interestRate: 0.25,
  },
  output: {
    netSinglePremium: 5,
  },
} satisfies ToolExample<NetSinglePremiumInput, NetSinglePremiumOutput>;

export const calculateNetSinglePremium = (
  input: NetSinglePremiumInput,
): NetSinglePremiumOutput => {
  if (input.annualDeathProbability === 0) return { netSinglePremium: 0 };
  const discount = 1 / (1 + input.interestRate);
  const factor = discount * (1 - input.annualDeathProbability);
  if (factor >= 1)
    simpleError(
      "interestRate",
      "The expected payment series diverges; use a positive interest rate or positive mortality.",
      "series_diverges",
    );
  return {
    netSinglePremium: roundStatistic(
      ((discount * input.annualDeathProbability) / (1 - factor)) *
        (input.benefitAmount ?? 1),
    ),
  };
};

export const netSinglePremiumTool = createSimpleTool({
  calculate: (input) =>
    calculateNetSinglePremium(input as unknown as NetSinglePremiumInput),
  description:
    "Calculate the net single premium that funds a whole life benefit paid at the end of the year of death.",
  id: "actuarial/net-single-premium",
  inputs: [
    {
      description: "Constant probability of dying within one year.",
      id: "annualDeathProbability",
      kind: "number",
      label: "Annual death probability",
      maximum: 1,
      minimum: 0,
    },
    {
      default: 1,
      description: "Benefit funded by the single premium.",
      id: "benefitAmount",
      kind: "number",
      label: "Benefit amount",
      minimum: 0,
    },
    {
      description: "Annual effective interest rate used for discounting.",
      id: "interestRate",
      kind: "number",
      label: "Interest rate",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Net single premium due at policy issue.",
      id: "netSinglePremium",
      kind: "number",
      label: "Net single premium",
    },
  ],
  title: "Net Single Premium Calculator",
});
export const runNetSinglePremium = netSinglePremiumTool.execute;
export default netSinglePremiumTool;
