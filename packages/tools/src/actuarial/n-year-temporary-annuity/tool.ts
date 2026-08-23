import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type NYearTemporaryAnnuityInput = {
  readonly annualDeathProbability: number;
  readonly benefitAmount?: number;
  readonly interestRate: number;
  readonly termYears: number;
};

export type NYearTemporaryAnnuityOutput = {
  readonly presentValue: number;
};

export const nYearTemporaryAnnuityExample = {
  input: {
    annualDeathProbability: 0.2,
    benefitAmount: 100,
    interestRate: 0,
    termYears: 3,
  },
  output: {
    presentValue: 244,
  },
} satisfies ToolExample<
  NYearTemporaryAnnuityInput,
  NYearTemporaryAnnuityOutput
>;

export const calculateNYearTemporaryAnnuity = (
  input: NYearTemporaryAnnuityInput,
): NYearTemporaryAnnuityOutput => {
  const discount = 1 / (1 + input.interestRate);
  const survival = 1 - input.annualDeathProbability;
  const factor = discount * survival;
  const growthFactor =
    factor === 1
      ? input.termYears
      : (1 - factor ** input.termYears) / (1 - factor);
  return {
    presentValue: roundStatistic(growthFactor * (input.benefitAmount ?? 1)),
  };
};

export const nYearTemporaryAnnuityTool = createSimpleTool({
  calculate: (input) =>
    calculateNYearTemporaryAnnuity(
      input as unknown as NYearTemporaryAnnuityInput,
    ),
  description:
    "Calculate the present value of an n-year temporary life annuity-due paying at the start of each year while the life survives.",
  id: "actuarial/n-year-temporary-annuity",
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
      description: "Expected present value of the temporary annuity.",
      id: "presentValue",
      kind: "number",
      label: "Present value",
    },
  ],
  title: "N-Year Temporary Life Annuity-Due Calculator",
});
export const runNYearTemporaryAnnuity = nYearTemporaryAnnuityTool.execute;
export default nYearTemporaryAnnuityTool;
