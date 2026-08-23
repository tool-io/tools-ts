import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FacklerReserveStepInput = {
  readonly annualDeathProbability: number;
  readonly beginningReserve?: number;
  readonly benefitAmount?: number;
  readonly interestRate: number;
  readonly netAnnualPremium: number;
};

export type FacklerReserveStepOutput = {
  readonly nextReserve: number;
};

export const facklerReserveStepExample = {
  input: {
    annualDeathProbability: 0.2,
    beginningReserve: 0,
    benefitAmount: 100,
    interestRate: 0,
    netAnnualPremium: 25,
  },
  output: {
    nextReserve: 6.25,
  },
} satisfies ToolExample<FacklerReserveStepInput, FacklerReserveStepOutput>;

export const calculateFacklerReserveStep = (
  input: FacklerReserveStepInput,
): FacklerReserveStepOutput => {
  if (
    !Number.isFinite(input.annualDeathProbability) ||
    input.annualDeathProbability < 0 ||
    input.annualDeathProbability > 1
  )
    simpleError(
      "annualDeathProbability",
      "Annual death probability must be between zero and one.",
      "invalid_death_probability",
    );
  const beginningReserve = input.beginningReserve ?? 0;
  if (!Number.isFinite(beginningReserve))
    simpleError(
      "beginningReserve",
      "The beginning reserve must be finite.",
      "invalid_beginning_reserve",
    );
  const benefitAmount = input.benefitAmount ?? 1;
  if (!Number.isFinite(benefitAmount) || benefitAmount < 0)
    simpleError(
      "benefitAmount",
      "The benefit amount must be finite and nonnegative.",
      "invalid_benefit_amount",
    );
  if (!Number.isFinite(input.interestRate) || !(input.interestRate > -1))
    simpleError(
      "interestRate",
      "The interest rate must be greater than -100 percent.",
      "invalid_interest_rate",
    );
  if (!Number.isFinite(input.netAnnualPremium) || input.netAnnualPremium < 0)
    simpleError(
      "netAnnualPremium",
      "The net annual premium must be finite and nonnegative.",
      "invalid_net_annual_premium",
    );
  const survival = 1 - input.annualDeathProbability;
  if (survival === 0)
    simpleError(
      "annualDeathProbability",
      "The terminal reserve is undefined when nobody survives the policy year.",
      "no_survivors",
    );
  const fundAfterClaims =
    (beginningReserve + input.netAnnualPremium) * (1 + input.interestRate) -
    input.annualDeathProbability * benefitAmount;
  const nextReserve = fundAfterClaims / survival;
  if (!Number.isFinite(nextReserve))
    simpleError(
      "beginningReserve",
      "The next reserve is outside the finite numeric range.",
      "result_not_finite",
    );
  return {
    nextReserve,
  };
};

export const facklerReserveStepTool = createSimpleTool({
  calculate: (input) =>
    calculateFacklerReserveStep({
      annualDeathProbability: input.annualDeathProbability as number,
      beginningReserve: input.beginningReserve as number,
      benefitAmount: input.benefitAmount as number,
      interestRate: input.interestRate as number,
      netAnnualPremium: input.netAnnualPremium as number,
    }),
  description:
    "Advance a policy reserve one year with the Fackler step: accumulate reserve plus premium at interest, pay expected claims, and share the fund among survivors.",
  id: "actuarial/fackler-reserve-step",
  inputs: [
    {
      description: "Probability of dying within the policy year.",
      id: "annualDeathProbability",
      kind: "number",
      label: "Annual death probability",
      maximum: 1,
      minimum: 0,
    },
    {
      default: 0,
      description:
        "Reserve held at the start of the policy year; may be negative for early policy years.",
      id: "beginningReserve",
      kind: "number",
      label: "Beginning reserve",
    },
    {
      default: 1,
      description: "Benefit paid at the end of the year of death.",
      id: "benefitAmount",
      kind: "number",
      label: "Benefit amount",
      minimum: 0,
    },
    {
      description:
        "Annual effective interest rate for accumulation; must be greater than -1 because a loss of 100 percent or more leaves the accumulation factor undefined.",
      id: "interestRate",
      kind: "number",
      label: "Interest rate",
      minimum: -1,
    },
    {
      description: "Premium received at the start of the policy year.",
      id: "netAnnualPremium",
      kind: "number",
      label: "Net annual premium",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Terminal reserve shared by survivors at year end.",
      id: "nextReserve",
      kind: "number",
      label: "Next reserve",
    },
  ],
  title: "Fackler Reserve Step Calculator",
});
export const runFacklerReserveStep = facklerReserveStepTool.execute;
export default facklerReserveStepTool;
