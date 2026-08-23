import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type WholeLifeInsuranceEpvInput = {
  readonly annualDeathProbability: number;
  readonly benefitAmount?: number;
  readonly interestRate: number;
};

export type WholeLifeInsuranceEpvOutput = {
  readonly presentValue: number;
};

export const wholeLifeInsuranceEpvExample = {
  input: {
    annualDeathProbability: 0.2,
    benefitAmount: 100,
    interestRate: 0,
  },
  output: {
    presentValue: 100,
  },
} satisfies ToolExample<
  WholeLifeInsuranceEpvInput,
  WholeLifeInsuranceEpvOutput
>;

export const calculateWholeLifeInsuranceEpv = (
  input: WholeLifeInsuranceEpvInput,
): WholeLifeInsuranceEpvOutput => {
  if (input.annualDeathProbability === 0) return { presentValue: 0 };
  const discount = 1 / (1 + input.interestRate);
  const factor = discount * (1 - input.annualDeathProbability);
  if (factor >= 1)
    simpleError(
      "interestRate",
      "The expected payment series diverges; use a positive interest rate or positive mortality.",
      "series_diverges",
    );
  return {
    presentValue: roundStatistic(
      ((discount * input.annualDeathProbability) / (1 - factor)) *
        (input.benefitAmount ?? 1),
    ),
  };
};

export const wholeLifeInsuranceEpvTool = createSimpleTool({
  calculate: (input) =>
    calculateWholeLifeInsuranceEpv(
      input as unknown as WholeLifeInsuranceEpvInput,
    ),
  description:
    "Calculate the expected present value of a whole life insurance paying at the end of the year of death.",
  id: "actuarial/whole-life-insurance-epv",
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
  ],
  outputs: [
    {
      description: "Expected present value of the whole life insurance.",
      id: "presentValue",
      kind: "number",
      label: "Present value",
    },
  ],
  title: "Whole Life Insurance EPV Calculator",
});
export const runWholeLifeInsuranceEpv = wholeLifeInsuranceEpvTool.execute;
export default wholeLifeInsuranceEpvTool;
