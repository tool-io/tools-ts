import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type ProspectiveNetReserveInput = {
  readonly benefitAmount?: number;
  readonly durationYears?: number;
  readonly initialDeathProbability: number;
  readonly interestRate: number;
  readonly netAnnualPremium: number;
  readonly renewalDeathProbability: number;
};

export type ProspectiveNetReserveOutput = {
  readonly prospectiveReserve: number;
};

export const prospectiveNetReserveExample = {
  input: {
    benefitAmount: 100,
    durationYears: 1,
    initialDeathProbability: 0.3,
    interestRate: 0,
    netAnnualPremium: 5,
    renewalDeathProbability: 0.1,
  },
  output: {
    prospectiveReserve: 50,
  },
} satisfies ToolExample<
  ProspectiveNetReserveInput,
  ProspectiveNetReserveOutput
>;

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

const issueBasis = (
  interestRate: number,
  initialDeathProbability: number,
  renewalDeathProbability: number,
): { annuityDue: number; insurance: number } => {
  const renewal = renewalBasis(interestRate, renewalDeathProbability);
  const discount = 1 / (1 + interestRate);
  return {
    annuityDue:
      1 + discount * (1 - initialDeathProbability) * renewal.annuityDue,
    insurance:
      discount * initialDeathProbability +
      discount * (1 - initialDeathProbability) * renewal.insurance,
  };
};

export const calculateProspectiveNetReserve = (
  input: ProspectiveNetReserveInput,
): ProspectiveNetReserveOutput => {
  const atIssue = (input.durationYears ?? 1) < 1;
  const basis = atIssue
    ? issueBasis(
        input.interestRate,
        input.initialDeathProbability,
        input.renewalDeathProbability,
      )
    : renewalBasis(input.interestRate, input.renewalDeathProbability);
  const benefitAmount = input.benefitAmount ?? 1;
  return {
    prospectiveReserve: roundStatistic(
      benefitAmount * basis.insurance -
        input.netAnnualPremium * basis.annuityDue,
    ),
  };
};

export const prospectiveNetReserveTool = createSimpleTool({
  calculate: (input) =>
    calculateProspectiveNetReserve(
      input as unknown as ProspectiveNetReserveInput,
    ),
  description:
    "Calculate the prospective net reserve as the value of future benefits minus future net premiums on the renewal mortality basis.",
  id: "actuarial/prospective-net-reserve",
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
      default: 1,
      description:
        "Years elapsed since issue; the reserve is valued on renewal mortality after the first year.",
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
      description: "Prospective net reserve at the stated duration.",
      id: "prospectiveReserve",
      kind: "number",
      label: "Prospective reserve",
    },
  ],
  title: "Prospective Net Reserve Calculator",
});
export const runProspectiveNetReserve = prospectiveNetReserveTool.execute;
export default prospectiveNetReserveTool;
