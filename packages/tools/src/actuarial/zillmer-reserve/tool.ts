import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type ZillmerReserveInput = {
  readonly benefitAmount?: number;
  readonly durationYears: number;
  readonly initialDeathProbability: number;
  readonly interestRate: number;
  readonly renewalDeathProbability: number;
  readonly zillmerAllowance?: number;
};

export type ZillmerReserveOutput = {
  readonly zillmerReserve: number;
};

export const zillmerReserveExample = {
  input: {
    benefitAmount: 100,
    durationYears: 1,
    initialDeathProbability: 0.3,
    interestRate: 0,
    renewalDeathProbability: 0.1,
    zillmerAllowance: 0.05,
  },
  output: {
    zillmerReserve: -31.25,
  },
} satisfies ToolExample<ZillmerReserveInput, ZillmerReserveOutput>;

const renewalBasis = (
  interestRate: number,
  renewalDeathProbability: number,
): { annuityDue: number; insurance: number } => {
  const discount = 1 / (1 + interestRate);
  const factor = discount * (1 - renewalDeathProbability);
  if (factor >= 1)
    simpleError(
      "interestRate",
      "The expected payment series diverges; use a positive interest rate or positive mortality.",
      "series_diverges",
    );
  return {
    annuityDue: 1 / (1 - factor),
    insurance: (discount * renewalDeathProbability) / (1 - factor),
  };
};

export const calculateZillmerReserve = (
  input: ZillmerReserveInput,
): ZillmerReserveOutput => {
  const discount = 1 / (1 + input.interestRate);
  const survivalFirst = 1 - input.initialDeathProbability;
  const renewal = renewalBasis(
    input.interestRate,
    input.renewalDeathProbability,
  );
  const benefitAmount = input.benefitAmount ?? 1;
  const allowance = input.zillmerAllowance ?? 0;
  const issueInsurance =
    discount * input.initialDeathProbability +
    discount * survivalFirst * renewal.insurance;
  const issueAnnuityDue = 1 + discount * survivalFirst * renewal.annuityDue;
  const netPremiumPerUnit = issueInsurance / issueAnnuityDue;
  const modifiedPremiumPerUnit =
    netPremiumPerUnit + allowance / issueAnnuityDue;
  const atIssue = input.durationYears < 1;
  const basis = atIssue
    ? { annuityDue: issueAnnuityDue, insurance: issueInsurance }
    : renewal;
  return {
    zillmerReserve: roundStatistic(
      benefitAmount *
        (basis.insurance - modifiedPremiumPerUnit * basis.annuityDue),
    ),
  };
};

export const zillmerReserveTool = createSimpleTool({
  calculate: (input) =>
    calculateZillmerReserve(input as unknown as ZillmerReserveInput),
  description:
    "Calculate the Zillmer reserve, which raises the valuation premium to recover a per-unit first-year expense allowance and values the policy prospectively with that modified premium.",
  id: "actuarial/zillmer-reserve",
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
      description:
        "Years elapsed since issue; durations of zero value on the issue basis.",
      id: "durationYears",
      kind: "integer",
      label: "Duration years",
      maximum: 1200,
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
      description: "Annual effective interest rate used for discounting.",
      id: "interestRate",
      kind: "number",
      label: "Interest rate",
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
    {
      default: 0,
      description:
        "Per-unit first-year expense allowance recovered through the modified premium.",
      id: "zillmerAllowance",
      kind: "number",
      label: "Zillmer allowance",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Zillmer modified reserve at the stated duration.",
      id: "zillmerReserve",
      kind: "number",
      label: "Zillmer reserve",
    },
  ],
  title: "Zillmer Reserve Calculator",
});
export const runZillmerReserve = zillmerReserveTool.execute;
export default zillmerReserveTool;
