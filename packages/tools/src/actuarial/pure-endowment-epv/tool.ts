import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type PureEndowmentEpvInput = {
  readonly annualDeathProbability: number;
  readonly benefitAmount?: number;
  readonly interestRate: number;
  readonly termYears: number;
};

export type PureEndowmentEpvOutput = {
  readonly presentValue: number;
};

export const pureEndowmentEpvExample = {
  input: {
    annualDeathProbability: 0.5,
    benefitAmount: 400,
    interestRate: 0,
    termYears: 2,
  },
  output: {
    presentValue: 100,
  },
} satisfies ToolExample<PureEndowmentEpvInput, PureEndowmentEpvOutput>;

export const calculatePureEndowmentEpv = (
  input: PureEndowmentEpvInput,
): PureEndowmentEpvOutput => {
  const discount = 1 / (1 + input.interestRate);
  const survival = (1 - input.annualDeathProbability) * discount;
  return {
    presentValue: roundStatistic(
      survival ** input.termYears * (input.benefitAmount ?? 1),
    ),
  };
};

export const pureEndowmentEpvTool = createSimpleTool({
  calculate: (input) =>
    calculatePureEndowmentEpv(input as unknown as PureEndowmentEpvInput),
  description:
    "Calculate the expected present value of a pure endowment paying only if the life survives the full term.",
  id: "actuarial/pure-endowment-epv",
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
      description: "Benefit paid on survival to the end of the term.",
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
      description: "Years the life must survive for payment.",
      id: "termYears",
      kind: "integer",
      label: "Term years",
      maximum: 1200,
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Expected present value of the pure endowment.",
      id: "presentValue",
      kind: "number",
      label: "Present value",
    },
  ],
  title: "Pure Endowment EPV Calculator",
});
export const runPureEndowmentEpv = pureEndowmentEpvTool.execute;
export default pureEndowmentEpvTool;
