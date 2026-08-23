import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type RetrospectiveNetReserveInput = {
  readonly benefitAmount?: number;
  readonly durationYears: number;
  readonly initialDeathProbability: number;
  readonly interestRate: number;
  readonly netAnnualPremium: number;
  readonly renewalDeathProbability: number;
};

export type RetrospectiveNetReserveOutput = {
  readonly retrospectiveReserve: number;
};

export const retrospectiveNetReserveExample = {
  input: {
    benefitAmount: 100,
    durationYears: 2,
    initialDeathProbability: 0.3,
    interestRate: 0,
    netAnnualPremium: 40,
    renewalDeathProbability: 0.1,
  },
  output: {
    retrospectiveReserve: 49.2063492063,
  },
} satisfies ToolExample<
  RetrospectiveNetReserveInput,
  RetrospectiveNetReserveOutput
>;

export const calculateRetrospectiveNetReserve = (
  input: RetrospectiveNetReserveInput,
): RetrospectiveNetReserveOutput => {
  const discount = 1 / (1 + input.interestRate);
  const benefitAmount = input.benefitAmount ?? 1;
  const survivalFirst = 1 - input.initialDeathProbability;
  if (survivalFirst === 0)
    simpleError(
      "initialDeathProbability",
      "The retrospective reserve is undefined when nobody survives the first year.",
      "invalid_value",
    );
  const survivalRenewal = 1 - input.renewalDeathProbability;
  let annuityDueValue = 0;
  let termInsuranceValue = 0;
  let survivalToPeriodStart = 1;
  for (let year = 0; year < input.durationYears; year += 1) {
    const deathProbability =
      year === 0
        ? input.initialDeathProbability
        : input.renewalDeathProbability;
    annuityDueValue += discount ** year * survivalToPeriodStart;
    termInsuranceValue +=
      discount ** (year + 1) * survivalToPeriodStart * deathProbability;
    survivalToPeriodStart *= year === 0 ? survivalFirst : survivalRenewal;
  }
  const survivorDiscount =
    discount ** input.durationYears * survivalToPeriodStart;
  if (survivorDiscount === 0)
    simpleError(
      "renewalDeathProbability",
      "The retrospective reserve is undefined when nobody survives to the valuation duration.",
      "no_survivors_at_duration",
    );
  return {
    retrospectiveReserve: roundStatistic(
      (input.netAnnualPremium * annuityDueValue -
        benefitAmount * termInsuranceValue) /
        survivorDiscount,
    ),
  };
};

export const retrospectiveNetReserveTool = createSimpleTool({
  calculate: (input) =>
    calculateRetrospectiveNetReserve(
      input as unknown as RetrospectiveNetReserveInput,
    ),
  description:
    "Calculate the retrospective net reserve as accumulated net premiums minus the accumulated cost of insurance, shared among survivors at the stated duration.",
  id: "actuarial/retrospective-net-reserve",
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
      description: "Years elapsed since policy issue.",
      id: "durationYears",
      kind: "integer",
      label: "Duration years",
      maximum: 1200,
      minimum: 1,
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
      description: "Annual effective interest rate used for accumulation.",
      id: "interestRate",
      kind: "number",
      label: "Interest rate",
      minimum: 0,
    },
    {
      description: "Net level annual premium payable each year.",
      id: "netAnnualPremium",
      kind: "number",
      label: "Net annual premium",
      minimum: 0,
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
      description: "Retrospective net reserve at the stated duration.",
      id: "retrospectiveReserve",
      kind: "number",
      label: "Retrospective reserve",
    },
  ],
  title: "Retrospective Net Reserve Calculator",
});
export const runRetrospectiveNetReserve = retrospectiveNetReserveTool.execute;
export default retrospectiveNetReserveTool;
