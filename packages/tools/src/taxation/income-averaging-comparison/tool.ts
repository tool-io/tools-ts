import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly electedFarmIncome: number;
  readonly currentMarginalRatePercent: number;
  readonly priorThreeMarginalRatesPercent: readonly number[];
}>;
export type Output = Readonly<{
  readonly currentRateTax: number;
  readonly averagedRateTax: number;
  readonly estimatedTaxDifference: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.priorThreeMarginalRatesPercent.length !== 3 ||
    input.priorThreeMarginalRatesPercent.some((value) => value < 0)
  )
    simpleError(
      "priorThreeMarginalRatesPercent",
      "Exactly three nonnegative prior rates are required.",
      "invalid_rates",
    );
  const currentRateTax =
    (input.electedFarmIncome * input.currentMarginalRatePercent) / 100;
  const averagedRate =
    input.priorThreeMarginalRatesPercent.reduce((a, b) => a + b, 0) / 3;
  const averagedRateTax = (input.electedFarmIncome * averagedRate) / 100;
  return {
    currentRateTax,
    averagedRateTax,
    estimatedTaxDifference: currentRateTax - averagedRateTax,
  };
};

export const exampleInput = {
  electedFarmIncome: 90000,
  currentMarginalRatePercent: 30,
  priorThreeMarginalRatesPercent: [15, 20, 25],
} satisfies Input;
export const exampleOutput = {
  currentRateTax: 27000,
  averagedRateTax: 18000,
  estimatedTaxDifference: 9000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      electedFarmIncome: input.electedFarmIncome as number,
      currentMarginalRatePercent: input.currentMarginalRatePercent as number,
      priorThreeMarginalRatesPercent:
        input.priorThreeMarginalRatesPercent as readonly number[],
    }),
  description:
    "Compare elected income at a current rate with the average of three caller-supplied prior rates.",
  id: "taxation/income-averaging-comparison",
  inputs: [
    {
      id: "electedFarmIncome",
      label: "Elected farm income",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "currentMarginalRatePercent",
      label: "Current marginal rate",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    {
      id: "priorThreeMarginalRatesPercent",
      label: "Prior three marginal rates",
      kind: "numberList",
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "currentRateTax",
      label: "Tax at current rate",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "averagedRateTax",
      label: "Tax using prior-rate average",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
    {
      id: "estimatedTaxDifference",
      label: "Current-rate tax minus averaged tax",
      kind: "number",
      unit: "currency",
    },
  ],
  title: "Income-Averaging Comparison",
});

export const run = tool.execute;
export default tool;
