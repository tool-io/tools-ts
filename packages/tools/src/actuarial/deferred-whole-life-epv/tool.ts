import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DeferredWholeLifeEpvInput = {
  readonly annualDeathProbability: number;
  readonly benefitAmount?: number;
  readonly deferYears: number;
  readonly interestRate: number;
};

export type DeferredWholeLifeEpvOutput = {
  readonly presentValue: number;
};

export const deferredWholeLifeEpvExample = {
  input: {
    annualDeathProbability: 0.2,
    benefitAmount: 100,
    deferYears: 1,
    interestRate: 0,
  },
  output: {
    presentValue: 80.00000000000003,
  },
} satisfies ToolExample<DeferredWholeLifeEpvInput, DeferredWholeLifeEpvOutput>;

export const calculateDeferredWholeLifeEpv = (
  input: DeferredWholeLifeEpvInput,
): DeferredWholeLifeEpvOutput => {
  if (!(input.interestRate > -1))
    simpleError(
      "interestRate",
      "The interest rate must be greater than -100 percent.",
      "invalid_interest_rate",
    );
  if (input.annualDeathProbability === 0) return { presentValue: 0 };
  const discount = 1 / (1 + input.interestRate);
  const factor = discount * (1 - input.annualDeathProbability);
  if (factor >= 1)
    simpleError(
      "interestRate",
      "The expected payment series diverges; use a positive interest rate or positive mortality.",
      "series_diverges",
    );
  const wholeLife = (discount * input.annualDeathProbability) / (1 - factor);
  return {
    presentValue:
      factor ** input.deferYears * wholeLife * (input.benefitAmount ?? 1),
  };
};

export const deferredWholeLifeEpvTool = createSimpleTool({
  calculate: (input) =>
    calculateDeferredWholeLifeEpv({
      annualDeathProbability: input.annualDeathProbability as number,
      benefitAmount: input.benefitAmount as number,
      deferYears: input.deferYears as number,
      interestRate: input.interestRate as number,
    }),
  description:
    "Calculate the expected present value of a whole life insurance whose death benefit applies only after the deferment period.",
  id: "actuarial/deferred-whole-life-epv",
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
        "Benefit paid at the end of the year of death after the deferment.",
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
  ],
  outputs: [
    {
      description:
        "Expected present value of the deferred whole life insurance.",
      id: "presentValue",
      kind: "number",
      label: "Present value",
    },
  ],
  title: "Deferred Whole Life EPV Calculator",
});
export const runDeferredWholeLifeEpv = deferredWholeLifeEpvTool.execute;
export default deferredWholeLifeEpvTool;
