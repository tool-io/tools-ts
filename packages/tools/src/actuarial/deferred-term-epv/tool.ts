import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DeferredTermEpvInput = {
  readonly annualDeathProbability: number;
  readonly benefitAmount?: number;
  readonly deferYears: number;
  readonly interestRate: number;
  readonly termYears: number;
};

export type DeferredTermEpvOutput = {
  readonly presentValue: number;
};

export const deferredTermEpvExample = {
  input: {
    annualDeathProbability: 0.2,
    benefitAmount: 100,
    deferYears: 1,
    interestRate: 0,
    termYears: 2,
  },
  output: {
    presentValue: 28.800000000000004,
  },
} satisfies ToolExample<DeferredTermEpvInput, DeferredTermEpvOutput>;

export const calculateDeferredTermEpv = (
  input: DeferredTermEpvInput,
): DeferredTermEpvOutput => {
  if (!(input.interestRate > -1))
    simpleError(
      "interestRate",
      "The interest rate must be greater than -100 percent.",
      "invalid_interest_rate",
    );
  const discount = 1 / (1 + input.interestRate);
  const factor = discount * (1 - input.annualDeathProbability);
  const deathDiscount = discount * input.annualDeathProbability;
  const growthFactor =
    factor === 1
      ? input.termYears
      : (1 - factor ** input.termYears) / (1 - factor);
  return {
    presentValue:
      factor ** input.deferYears *
      deathDiscount *
      growthFactor *
      (input.benefitAmount ?? 1),
  };
};

export const deferredTermEpvTool = createSimpleTool({
  calculate: (input) =>
    calculateDeferredTermEpv({
      annualDeathProbability: input.annualDeathProbability as number,
      benefitAmount: input.benefitAmount as number,
      deferYears: input.deferYears as number,
      interestRate: input.interestRate as number,
      termYears: input.termYears as number,
    }),
  description:
    "Calculate the expected present value of an n-year term insurance whose coverage starts after the deferment period.",
  id: "actuarial/deferred-term-epv",
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
        "Benefit paid at the end of the year of death within the covered term.",
      id: "benefitAmount",
      kind: "number",
      label: "Benefit amount",
      minimum: 0,
    },
    {
      description: "Years the life must survive before coverage begins.",
      id: "deferYears",
      kind: "integer",
      label: "Defer years",
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
      description: "Length of the covered term in years.",
      id: "termYears",
      kind: "integer",
      label: "Term years",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Expected present value of the deferred term insurance.",
      id: "presentValue",
      kind: "number",
      label: "Present value",
    },
  ],
  title: "Deferred Term Insurance EPV Calculator",
});
export const runDeferredTermEpv = deferredTermEpvTool.execute;
export default deferredTermEpvTool;
