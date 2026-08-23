import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type TermLifeAnnuityEpvInput = {
  readonly annualDeathProbability: number;
  readonly benefitAmount?: number;
  readonly interestRate: number;
  readonly termYears: number;
};

export type TermLifeAnnuityEpvOutput = {
  readonly presentValue: number;
};

export const termLifeAnnuityEpvExample = {
  input: {
    annualDeathProbability: 0.2,
    benefitAmount: 100,
    interestRate: 0,
    termYears: 3,
  },
  output: {
    presentValue: 195.2,
  },
} satisfies ToolExample<TermLifeAnnuityEpvInput, TermLifeAnnuityEpvOutput>;

export const calculateTermLifeAnnuityEpv = (
  input: TermLifeAnnuityEpvInput,
): TermLifeAnnuityEpvOutput => {
  const discount = 1 / (1 + input.interestRate);
  const factor = discount * (1 - input.annualDeathProbability);
  const growthFactor =
    factor === 1
      ? input.termYears
      : (factor * (1 - factor ** input.termYears)) / (1 - factor);
  return {
    presentValue: roundStatistic(growthFactor * (input.benefitAmount ?? 1)),
  };
};

export const termLifeAnnuityEpvTool = createSimpleTool({
  calculate: (input) =>
    calculateTermLifeAnnuityEpv(input as unknown as TermLifeAnnuityEpvInput),
  description:
    "Calculate the expected present value of an n-year temporary life annuity-immediate paying at the end of each survived year.",
  id: "actuarial/term-life-annuity-epv",
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
      description: "Payment made at the end of each survived year.",
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
    {
      description: "Maximum number of annual payments.",
      id: "termYears",
      kind: "integer",
      label: "Term years",
      maximum: 1200,
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Expected present value of the term life annuity-immediate.",
      id: "presentValue",
      kind: "number",
      label: "Present value",
    },
  ],
  title: "Term Life Annuity EPV Calculator",
});
export const runTermLifeAnnuityEpv = termLifeAnnuityEpvTool.execute;
export default termLifeAnnuityEpvTool;
