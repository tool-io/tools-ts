import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type NetLevelAnnualPremiumInput = {
  readonly annualDeathProbability: number;
  readonly benefitAmount?: number;
  readonly interestRate: number;
};

export type NetLevelAnnualPremiumOutput = {
  readonly annualPremium: number;
};

export const netLevelAnnualPremiumExample = {
  input: {
    annualDeathProbability: 0.25,
    benefitAmount: 10,
    interestRate: 0.25,
  },
  output: {
    annualPremium: 2,
  },
} satisfies ToolExample<
  NetLevelAnnualPremiumInput,
  NetLevelAnnualPremiumOutput
>;

export const calculateNetLevelAnnualPremium = (
  input: NetLevelAnnualPremiumInput,
): NetLevelAnnualPremiumOutput => {
  const discount = 1 / (1 + input.interestRate);
  return {
    annualPremium: roundStatistic(
      discount * input.annualDeathProbability * (input.benefitAmount ?? 1),
    ),
  };
};

export const netLevelAnnualPremiumTool = createSimpleTool({
  calculate: (input) =>
    calculateNetLevelAnnualPremium(
      input as unknown as NetLevelAnnualPremiumInput,
    ),
  description:
    "Calculate the net level annual premium whose expected present value funds a whole life benefit paid at the end of the year of death.",
  id: "actuarial/net-level-annual-premium",
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
      description: "Benefit funded by the premium.",
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
      description:
        "Net level annual premium payable at the start of each year.",
      id: "annualPremium",
      kind: "number",
      label: "Annual premium",
    },
  ],
  title: "Net Level Annual Premium Calculator",
});
export const runNetLevelAnnualPremium = netLevelAnnualPremiumTool.execute;
export default netLevelAnnualPremiumTool;
