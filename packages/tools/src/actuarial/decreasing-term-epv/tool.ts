import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DecreasingTermEpvInput = {
  readonly annualDeathProbability: number;
  readonly benefitAmount?: number;
  readonly interestRate: number;
  readonly termYears: number;
};

export type DecreasingTermEpvOutput = {
  readonly presentValue: number;
};

export const decreasingTermEpvExample = {
  input: {
    annualDeathProbability: 0.1,
    benefitAmount: 100,
    interestRate: 0,
    termYears: 3,
  },
  output: {
    presentValue: 56.099999999999994,
  },
} satisfies ToolExample<DecreasingTermEpvInput, DecreasingTermEpvOutput>;

export const calculateDecreasingTermEpv = (
  input: DecreasingTermEpvInput,
): DecreasingTermEpvOutput => {
  if (!(input.interestRate > -1))
    simpleError(
      "interestRate",
      "The interest rate must be greater than -100 percent.",
      "invalid_interest_rate",
    );
  const discount = 1 / (1 + input.interestRate);
  const factor = discount * (1 - input.annualDeathProbability);
  let sum = 0;
  for (let year = 0; year < input.termYears; year += 1)
    sum += (input.termYears - year) * factor ** year;
  return {
    presentValue:
      sum *
      discount *
      input.annualDeathProbability *
      (input.benefitAmount ?? 1),
  };
};

export const decreasingTermEpvTool = createSimpleTool({
  calculate: (input) =>
    calculateDecreasingTermEpv({
      annualDeathProbability: input.annualDeathProbability as number,
      benefitAmount: input.benefitAmount as number,
      interestRate: input.interestRate as number,
      termYears: input.termYears as number,
    }),
  description:
    "Calculate the expected present value of an n-year decreasing term insurance whose benefit steps down by one each year of the term.",
  id: "actuarial/decreasing-term-epv",
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
        "Value of one unit of the decreasing benefit schedule; the first year pays this amount times the remaining term.",
      id: "benefitAmount",
      kind: "number",
      label: "Benefit unit",
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
      description: "Coverage horizon in years.",
      id: "termYears",
      kind: "integer",
      label: "Term years",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Expected present value of the decreasing term insurance.",
      id: "presentValue",
      kind: "number",
      label: "Present value",
    },
  ],
  title: "Decreasing Term Insurance EPV Calculator",
});
export const runDecreasingTermEpv = decreasingTermEpvTool.execute;
export default decreasingTermEpvTool;
