import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  money,
  share,
  rating,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedAnnualHouseholdIncomeMinor: number;
  readonly callerIncomeLowerEdgesMinor: readonly number[];
  readonly callerExpectedContributionBasisPoints: readonly number[];
  readonly callerBenchmarkAnnualPremiumMinor: number;
  readonly callerEnrolledAnnualPremiumMinor: number;
}>;
export type Output = Readonly<{
  readonly callerExpectedAnnualContributionMinor: number;
  readonly callerModeledAnnualPremiumCreditMinor: number;
}>;
const inputFields = [
  {
    id: "observedAnnualHouseholdIncomeMinor",
    label: "Observed annual household income minor",
    kind: "number",
  },
  {
    id: "callerIncomeLowerEdgesMinor",
    label: "Caller income lower edges minor",
    kind: "numberList",
  },
  {
    id: "callerExpectedContributionBasisPoints",
    label: "Caller expected contribution basis points",
    kind: "numberList",
  },
  {
    id: "callerBenchmarkAnnualPremiumMinor",
    label: "Caller benchmark annual premium minor",
    kind: "number",
  },
  {
    id: "callerEnrolledAnnualPremiumMinor",
    label: "Caller enrolled annual premium minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.observedAnnualHouseholdIncomeMinor);
  money(input.callerBenchmarkAnnualPremiumMinor);
  money(input.callerEnrolledAnnualPremiumMinor);
  input.callerExpectedContributionBasisPoints.forEach((v) =>
    bounded(v, "bps", 0, 10000),
  );
  const rate = rating(
      input.observedAnnualHouseholdIncomeMinor,
      input.callerIncomeLowerEdgesMinor,
      input.callerExpectedContributionBasisPoints,
    ),
    contribution = share(input.observedAnnualHouseholdIncomeMinor, rate);
  return {
    callerExpectedAnnualContributionMinor: contribution,
    callerModeledAnnualPremiumCreditMinor: Math.min(
      input.callerEnrolledAnnualPremiumMinor,
      Math.max(0, input.callerBenchmarkAnnualPremiumMinor - contribution),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAnnualHouseholdIncomeMinor: 500000,
  callerIncomeLowerEdgesMinor: [0, 400000, 800000],
  callerExpectedContributionBasisPoints: [0, 1000, 2000],
  callerBenchmarkAnnualPremiumMinor: 80000,
  callerEnrolledAnnualPremiumMinor: 60000,
} satisfies Input;
export const exampleOutput = {
  callerExpectedAnnualContributionMinor: 50000,
  callerModeledAnnualPremiumCreditMinor: 30000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/premium-tax-credit-subsidy-percent-lookup",
  title: "Premium Tax Credit Subsidy Percent Lookup",
  description:
    "Evaluate actual income/premium evidence under caller independently verified contribution tiers; no fabricated subsidy tables, FPL family adjustments, eligibility or tax reconciliation.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerExpectedAnnualContributionMinor",
      label: "Caller expected annual contribution minor",
      kind: "number",
    },
    {
      id: "callerModeledAnnualPremiumCreditMinor",
      label: "Caller modeled annual premium credit minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAnnualHouseholdIncomeMinor:
        value.observedAnnualHouseholdIncomeMinor as number,
      callerIncomeLowerEdgesMinor:
        value.callerIncomeLowerEdgesMinor as readonly number[],
      callerExpectedContributionBasisPoints:
        value.callerExpectedContributionBasisPoints as readonly number[],
      callerBenchmarkAnnualPremiumMinor:
        value.callerBenchmarkAnnualPremiumMinor as number,
      callerEnrolledAnnualPremiumMinor:
        value.callerEnrolledAnnualPremiumMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
