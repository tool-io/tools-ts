import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EndowmentInsuranceEpvInput = {
  readonly annualDeathProbability: number;
  readonly benefitAmount?: number;
  readonly interestRate: number;
  readonly termYears: number;
};

export type EndowmentInsuranceEpvOutput = {
  readonly presentValue: number;
};

export const endowmentInsuranceEpvExample = {
  input: {
    annualDeathProbability: 0.5,
    benefitAmount: 100,
    interestRate: 0,
    termYears: 2,
  },
  output: {
    presentValue: 100,
  },
} satisfies ToolExample<
  EndowmentInsuranceEpvInput,
  EndowmentInsuranceEpvOutput
>;

export const calculateEndowmentInsuranceEpv = (
  input: EndowmentInsuranceEpvInput,
): EndowmentInsuranceEpvOutput => {
  if (!(input.interestRate > -1))
    simpleError(
      "interestRate",
      "The interest rate must be greater than -100 percent.",
      "invalid_interest_rate",
    );
  const discount = 1 / (1 + input.interestRate);
  const survival = 1 - input.annualDeathProbability;
  const factor = discount * survival;
  const termInsurance =
    factor === 1
      ? input.termYears * (1 - survival)
      : (discount * (1 - survival) * (1 - factor ** input.termYears)) /
        (1 - factor);
  return {
    presentValue:
      (termInsurance + factor ** input.termYears) * (input.benefitAmount ?? 1),
  };
};

export const endowmentInsuranceEpvTool = createSimpleTool({
  calculate: (input) =>
    calculateEndowmentInsuranceEpv({
      annualDeathProbability: input.annualDeathProbability as number,
      benefitAmount: input.benefitAmount as number,
      interestRate: input.interestRate as number,
      termYears: input.termYears as number,
    }),
  description:
    "Calculate the expected present value of an endowment insurance paying on death during the term or on survival to maturity.",
  id: "actuarial/endowment-insurance-epv",
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
      description:
        "Benefit paid at the end of the year of death or at maturity.",
      id: "benefitAmount",
      kind: "number",
      label: "Benefit amount",
      minimum: 0,
    },
    {
      description:
        "Annual effective interest rate used for discounting; must be greater than -1 because a loss of 100 percent or more leaves the discount factor undefined.",
      id: "interestRate",
      kind: "number",
      label: "Interest rate",
      minimum: -1,
    },
    {
      description: "Coverage and survival horizon in years.",
      id: "termYears",
      kind: "integer",
      label: "Term years",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Expected present value of the endowment insurance.",
      id: "presentValue",
      kind: "number",
      label: "Present value",
    },
  ],
  title: "Endowment Insurance EPV Calculator",
});
export const runEndowmentInsuranceEpv = endowmentInsuranceEpvTool.execute;
export default endowmentInsuranceEpvTool;
