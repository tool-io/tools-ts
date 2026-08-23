import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type WholeLifeAnnuityDueEpvInput = {
  readonly annualDeathProbability: number;
  readonly benefitAmount?: number;
  readonly interestRate: number;
};

export type WholeLifeAnnuityDueEpvOutput = {
  readonly presentValue: number;
};

export const wholeLifeAnnuityDueEpvExample = {
  input: {
    annualDeathProbability: 0.2,
    benefitAmount: 10,
    interestRate: 0,
  },
  output: {
    presentValue: 50,
  },
} satisfies ToolExample<
  WholeLifeAnnuityDueEpvInput,
  WholeLifeAnnuityDueEpvOutput
>;

export const calculateWholeLifeAnnuityDueEpv = (
  input: WholeLifeAnnuityDueEpvInput,
): WholeLifeAnnuityDueEpvOutput => {
  const discount = 1 / (1 + input.interestRate);
  const factor = discount * (1 - input.annualDeathProbability);
  if (factor >= 1)
    simpleError(
      "interestRate",
      "The expected payment series diverges; use a positive interest rate or positive mortality.",
      "series_diverges",
    );
  return {
    presentValue: roundStatistic((input.benefitAmount ?? 1) / (1 - factor)),
  };
};

export const wholeLifeAnnuityDueEpvTool = createSimpleTool({
  calculate: (input) =>
    calculateWholeLifeAnnuityDueEpv(
      input as unknown as WholeLifeAnnuityDueEpvInput,
    ),
  description:
    "Calculate the expected present value of a whole life annuity-due paying at the start of every survived year.",
  id: "actuarial/whole-life-annuity-due-epv",
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
      description: "Payment made at the start of each survived year.",
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
      description: "Expected present value of the whole life annuity-due.",
      id: "presentValue",
      kind: "number",
      label: "Present value",
    },
  ],
  title: "Whole Life Annuity Due EPV Calculator",
});
export const runWholeLifeAnnuityDueEpv = wholeLifeAnnuityDueEpvTool.execute;
export default wholeLifeAnnuityDueEpvTool;
