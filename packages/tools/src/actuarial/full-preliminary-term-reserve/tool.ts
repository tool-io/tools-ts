import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FullPreliminaryTermReserveInput = {
  readonly benefitAmount?: number;
  readonly initialDeathProbability: number;
  readonly interestRate: number;
  readonly renewalDeathProbability: number;
};

export type FullPreliminaryTermReserveOutput = {
  readonly firstYearTerminalReserve: number;
  readonly renewalValuationPremium: number;
};

export const fullPreliminaryTermReserveExample = {
  input: {
    benefitAmount: 10,
    initialDeathProbability: 0.5,
    interestRate: 0.25,
    renewalDeathProbability: 0.25,
  },
  output: {
    firstYearTerminalReserve: 0,
    renewalValuationPremium: 2,
  },
} satisfies ToolExample<
  FullPreliminaryTermReserveInput,
  FullPreliminaryTermReserveOutput
>;

export const calculateFullPreliminaryTermReserve = (
  input: FullPreliminaryTermReserveInput,
): FullPreliminaryTermReserveOutput => {
  if (!(input.interestRate > -1))
    simpleError(
      "interestRate",
      "The interest rate must be greater than -100 percent.",
      "invalid_interest_rate",
    );
  const discount = 1 / (1 + input.interestRate);
  const survivalFirst = 1 - input.initialDeathProbability;
  if (survivalFirst === 0)
    simpleError(
      "initialDeathProbability",
      "The first-year reserve is undefined when nobody survives the first year.",
      "no_first_year_survivors",
    );
  const benefitAmount = input.benefitAmount ?? 1;
  const oneYearTermCost =
    discount * input.initialDeathProbability * benefitAmount;
  const fundAfterClaims =
    oneYearTermCost * (1 + input.interestRate) -
    input.initialDeathProbability * benefitAmount;
  return {
    firstYearTerminalReserve: fundAfterClaims / survivalFirst,
    renewalValuationPremium:
      discount * input.renewalDeathProbability * benefitAmount,
  };
};

export const fullPreliminaryTermReserveTool = createSimpleTool({
  calculate: (input) =>
    calculateFullPreliminaryTermReserve({
      benefitAmount: input.benefitAmount as number,
      initialDeathProbability: input.initialDeathProbability as number,
      interestRate: input.interestRate as number,
      renewalDeathProbability: input.renewalDeathProbability as number,
    }),
  description:
    "Calculate the full preliminary term valuation: the first year funds only a one-year term cost leaving zero terminal reserve, and later years use the renewal valuation premium.",
  id: "actuarial/full-preliminary-term-reserve",
  inputs: [
    {
      default: 1,
      description: "Benefit insured by the policy.",
      id: "benefitAmount",
      kind: "number",
      label: "Benefit amount",
      minimum: 0,
    },
    {
      description: "Probability of dying in the first policy year.",
      id: "initialDeathProbability",
      kind: "number",
      label: "Initial death probability",
      maximum: 1,
      minimum: 0,
    },
    {
      description:
        "Annual effective interest rate used for discounting; must be greater than -1 because a loss of 100 percent or more leaves the discount factor undefined.",
      id: "interestRate",
      kind: "number",
      label: "Interest rate",
      minimum: -1,
    },
    {
      description: "Constant probability of dying in each renewal year.",
      id: "renewalDeathProbability",
      kind: "number",
      label: "Renewal death probability",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Terminal reserve at the end of the first policy year; always zero under the full preliminary term method.",
      id: "firstYearTerminalReserve",
      kind: "number",
      label: "First year terminal reserve",
    },
    {
      description: "Net premium used for valuation from the second year on.",
      id: "renewalValuationPremium",
      kind: "number",
      label: "Renewal valuation premium",
    },
  ],
  title: "Full Preliminary Term Reserve Calculator",
});
export const runFullPreliminaryTermReserve =
  fullPreliminaryTermReserveTool.execute;
export default fullPreliminaryTermReserveTool;
