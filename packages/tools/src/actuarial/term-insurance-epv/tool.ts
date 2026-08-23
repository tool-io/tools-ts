import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type TermInsuranceEpvInput = {
  readonly annualDeathProbability: number;
  readonly benefitAmount?: number;
  readonly interestRate: number;
  readonly termYears: number;
};

export type TermInsuranceEpvOutput = {
  readonly presentValue: number;
};

export const termInsuranceEpvExample = {
  input: {
    annualDeathProbability: 0.2,
    benefitAmount: 100,
    interestRate: 0,
    termYears: 3,
  },
  output: {
    presentValue: 48.8,
  },
} satisfies ToolExample<TermInsuranceEpvInput, TermInsuranceEpvOutput>;

export const calculateTermInsuranceEpv = (
  input: TermInsuranceEpvInput,
): TermInsuranceEpvOutput => {
  const discount = 1 / (1 + input.interestRate);
  const factor = discount * (1 - input.annualDeathProbability);
  const deathDiscount = discount * input.annualDeathProbability;
  const growthFactor =
    factor === 1
      ? input.termYears
      : (1 - factor ** input.termYears) / (1 - factor);
  return {
    presentValue: roundStatistic(
      deathDiscount * growthFactor * (input.benefitAmount ?? 1),
    ),
  };
};

export const termInsuranceEpvTool = createSimpleTool({
  calculate: (input) =>
    calculateTermInsuranceEpv(input as unknown as TermInsuranceEpvInput),
  description:
    "Calculate the expected present value of an n-year term life insurance paying at the end of the year of death within the term.",
  id: "actuarial/term-insurance-epv",
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
      description: "Benefit paid at the end of the year of death.",
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
      description: "Coverage horizon in years.",
      id: "termYears",
      kind: "integer",
      label: "Term years",
      maximum: 1200,
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Expected present value of the term insurance.",
      id: "presentValue",
      kind: "number",
      label: "Present value",
    },
  ],
  title: "Term Insurance EPV Calculator",
});
export const runTermInsuranceEpv = termInsuranceEpvTool.execute;
export default termInsuranceEpvTool;
