import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IncreasingWholeLifeEpvInput = {
  readonly annualDeathProbability: number;
  readonly benefitUnit?: number;
  readonly interestRate: number;
};

export type IncreasingWholeLifeEpvOutput = {
  readonly presentValue: number;
};

export const increasingWholeLifeEpvExample = {
  input: {
    annualDeathProbability: 0.25,
    benefitUnit: 10,
    interestRate: 0,
  },
  output: {
    presentValue: 40,
  },
} satisfies ToolExample<
  IncreasingWholeLifeEpvInput,
  IncreasingWholeLifeEpvOutput
>;

export const calculateIncreasingWholeLifeEpv = (
  input: IncreasingWholeLifeEpvInput,
): IncreasingWholeLifeEpvOutput => {
  if (
    !Number.isFinite(input.annualDeathProbability) ||
    input.annualDeathProbability < 0 ||
    input.annualDeathProbability > 1
  )
    simpleError(
      "annualDeathProbability",
      "Annual death probability must be between zero and one.",
      "invalid_death_probability",
    );
  const benefitUnit = input.benefitUnit ?? 1;
  if (!Number.isFinite(benefitUnit) || benefitUnit < 0)
    simpleError(
      "benefitUnit",
      "The benefit unit must be finite and nonnegative.",
      "invalid_benefit_unit",
    );
  if (!Number.isFinite(input.interestRate) || !(input.interestRate > -1))
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
  const increasingAnnuityValue =
    (discount * input.annualDeathProbability) / (1 - factor) ** 2;
  const presentValue = increasingAnnuityValue * benefitUnit;
  if (!Number.isFinite(presentValue))
    simpleError(
      "benefitUnit",
      "The present value is outside the finite numeric range.",
      "result_not_finite",
    );
  return {
    presentValue,
  };
};

export const increasingWholeLifeEpvTool = createSimpleTool({
  calculate: (input) =>
    calculateIncreasingWholeLifeEpv({
      annualDeathProbability: input.annualDeathProbability as number,
      benefitUnit: input.benefitUnit as number,
      interestRate: input.interestRate as number,
    }),
  description:
    "Calculate the expected present value of a whole life insurance whose death benefit steps up by one unit each year.",
  id: "actuarial/increasing-whole-life-epv",
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
        "Value of one benefit unit; the first year pays this amount times one and each later year steps up by one more unit.",
      id: "benefitUnit",
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
  ],
  outputs: [
    {
      description:
        "Expected present value of the increasing whole life insurance.",
      id: "presentValue",
      kind: "number",
      label: "Present value",
    },
  ],
  title: "Increasing Whole Life EPV Calculator",
});
export const runIncreasingWholeLifeEpv = increasingWholeLifeEpvTool.execute;
export default increasingWholeLifeEpvTool;
