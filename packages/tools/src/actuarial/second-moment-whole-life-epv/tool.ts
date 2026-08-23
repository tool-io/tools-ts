import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type SecondMomentWholeLifeEpvInput = {
  readonly annualDeathProbability: number;
  readonly benefitAmount?: number;
  readonly interestRate: number;
};

export type SecondMomentWholeLifeEpvOutput = {
  readonly secondMoment: number;
};

export const secondMomentWholeLifeEpvExample = {
  input: {
    annualDeathProbability: 0.5,
    benefitAmount: 200,
    interestRate: 3,
  },
  output: {
    secondMoment: 8000,
  },
} satisfies ToolExample<
  SecondMomentWholeLifeEpvInput,
  SecondMomentWholeLifeEpvOutput
>;

export const calculateSecondMomentWholeLifeEpv = (
  input: SecondMomentWholeLifeEpvInput,
): SecondMomentWholeLifeEpvOutput => {
  if (input.annualDeathProbability === 0) return { secondMoment: 0 };
  const forceOfMortality = -Math.log(1 - input.annualDeathProbability);
  const forceOfInterest = Math.log(1 + input.interestRate);
  const totalForce = forceOfMortality + 2 * forceOfInterest;
  if (totalForce === 0)
    simpleError(
      "interestRate",
      "The expected payment integral diverges; use a positive interest rate or positive mortality.",
      "series_diverges",
    );
  return {
    secondMoment: roundStatistic(
      (forceOfMortality / totalForce) * (input.benefitAmount ?? 1) ** 2,
    ),
  };
};

export const secondMomentWholeLifeEpvTool = createSimpleTool({
  calculate: (input) =>
    calculateSecondMomentWholeLifeEpv(
      input as unknown as SecondMomentWholeLifeEpvInput,
    ),
  description:
    "Calculate the second moment of a continuous whole-life insurance present value under constant forces of mortality and interest.",
  id: "actuarial/second-moment-whole-life-epv",
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
      description: "Benefit paid at the moment of death.",
      id: "benefitAmount",
      kind: "number",
      label: "Benefit amount",
      minimum: 0,
    },
    {
      description:
        "Annual effective interest rate; the second moment doubles its equivalent force of interest.",
      id: "interestRate",
      kind: "number",
      label: "Interest rate",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Second moment of the present value of the whole life insurance.",
      id: "secondMoment",
      kind: "number",
      label: "Second moment",
    },
  ],
  title: "Continuous Whole Life Present Value Second Moment Calculator",
});
export const runSecondMomentWholeLifeEpv = secondMomentWholeLifeEpvTool.execute;
export default secondMomentWholeLifeEpvTool;
