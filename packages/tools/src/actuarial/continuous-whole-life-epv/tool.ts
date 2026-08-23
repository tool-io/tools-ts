import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ContinuousWholeLifeEpvInput = {
  readonly annualDeathProbability: number;
  readonly benefitAmount?: number;
  readonly interestRate: number;
};

export type ContinuousWholeLifeEpvOutput = {
  readonly presentValue: number;
};

export const continuousWholeLifeEpvExample = {
  input: {
    annualDeathProbability: 0.02,
    benefitAmount: 100000,
    interestRate: 0.04,
  },
  output: {
    presentValue: 33997.88695678765,
  },
} satisfies ToolExample<
  ContinuousWholeLifeEpvInput,
  ContinuousWholeLifeEpvOutput
>;

export const calculateContinuousWholeLifeEpv = (
  input: ContinuousWholeLifeEpvInput,
): ContinuousWholeLifeEpvOutput => {
  if (input.annualDeathProbability < 0 || input.annualDeathProbability >= 1)
    simpleError(
      "annualDeathProbability",
      "Annual death probability must be at least zero and less than one.",
      "invalid_probability",
    );
  if (input.interestRate <= -1)
    simpleError(
      "interestRate",
      "The annual effective interest rate must be greater than -100%.",
      "invalid_interest_rate",
    );
  const benefitAmount = input.benefitAmount ?? 1;
  if (!Number.isFinite(benefitAmount) || benefitAmount < 0)
    simpleError(
      "benefitAmount",
      "Benefit amount must be finite and nonnegative.",
      "invalid_benefit",
    );
  if (benefitAmount === 0 || input.annualDeathProbability === 0)
    return { presentValue: 0 };
  const forceOfMortality = -Math.log(1 - input.annualDeathProbability);
  const forceOfInterest = Math.log(1 + input.interestRate);
  const totalForce = forceOfMortality + forceOfInterest;
  if (totalForce <= 0)
    simpleError(
      "interestRate",
      "The expected payment integral diverges because the combined mortality and interest force is not positive.",
      "series_diverges",
    );
  const presentValue = (forceOfMortality / totalForce) * benefitAmount;
  if (!Number.isFinite(presentValue))
    simpleError(
      "benefitAmount",
      "The present value is outside the finite numeric range.",
      "result_not_finite",
    );
  return { presentValue };
};

export const continuousWholeLifeEpvTool = createSimpleTool({
  calculate: (input) =>
    calculateContinuousWholeLifeEpv({
      annualDeathProbability: input.annualDeathProbability as number,
      benefitAmount: input.benefitAmount as number,
      interestRate: input.interestRate as number,
    }),
  description:
    "Calculate the expected present value of a continuously paying whole life insurance under a constant force of mortality derived from the annual death probability.",
  id: "actuarial/continuous-whole-life-epv",
  inputs: [
    {
      description: "Constant probability of dying within one year.",
      id: "annualDeathProbability",
      kind: "number",
      label: "Annual death probability",
      maximum: 0.9999999999999999,
      minimum: 0,
    },
    {
      default: 1,
      description: "Benefit paid at the moment of death.",
      id: "benefitAmount",
      kind: "number",
      label: "Benefit amount",
      minimum: 0,
    },
    {
      description:
        "Annual effective interest rate as a decimal; the combined mortality and interest force must remain positive.",
      id: "interestRate",
      kind: "number",
      label: "Interest rate",
      minimum: -0.9999999999999999,
    },
  ],
  outputs: [
    {
      description:
        "Expected present value of the continuous whole life insurance.",
      id: "presentValue",
      kind: "number",
      label: "Present value",
    },
  ],
  title: "Continuous Whole Life EPV Calculator",
});
export const runContinuousWholeLifeEpv = continuousWholeLifeEpvTool.execute;
export default continuousWholeLifeEpvTool;
