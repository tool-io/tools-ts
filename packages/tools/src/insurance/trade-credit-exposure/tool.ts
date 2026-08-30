import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly buyerReceivables: readonly number[];
  readonly buyerDefaultProbabilities: readonly number[];
  readonly coveragePercent: number;
  readonly policyLimit: number;
}>;
export type Output = Readonly<{
  readonly grossReceivables: number;
  readonly expectedCreditLoss: number;
  readonly coveredExpectedLoss: number;
  readonly uncoveredExpectedLoss: number;
}>;

export const calculate = (input: Input): Output => {
  const n = input.buyerReceivables.length;
  if (
    n === 0 ||
    input.buyerDefaultProbabilities.length !== n ||
    input.buyerReceivables.some((value) => value < 0) ||
    input.buyerDefaultProbabilities.some((value) => value < 0 || value > 1)
  )
    simpleError(
      "buyerReceivables",
      "Aligned nonnegative receivables and probabilities are required.",
      "invalid_portfolio",
    );
  const grossReceivables = input.buyerReceivables.reduce((a, b) => a + b, 0),
    expectedCreditLoss = input.buyerReceivables.reduce(
      (sum, value, index) =>
        sum + value * input.buyerDefaultProbabilities[index],
      0,
    ),
    coveredExpectedLoss = Math.min(
      input.policyLimit,
      (expectedCreditLoss * input.coveragePercent) / 100,
    );
  return {
    grossReceivables,
    expectedCreditLoss,
    coveredExpectedLoss,
    uncoveredExpectedLoss: expectedCreditLoss - coveredExpectedLoss,
  };
};

export const exampleInput = {
  buyerReceivables: [1000, 2000],
  buyerDefaultProbabilities: [0.1, 0.2],
  coveragePercent: 80,
  policyLimit: 1000,
} satisfies Input;
export const exampleOutput = {
  grossReceivables: 3000,
  expectedCreditLoss: 500,
  coveredExpectedLoss: 400,
  uncoveredExpectedLoss: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      buyerReceivables: input.buyerReceivables as readonly number[],
      buyerDefaultProbabilities:
        input.buyerDefaultProbabilities as readonly number[],
      coveragePercent: input.coveragePercent as number,
      policyLimit: input.policyLimit as number,
    }),
  description:
    "Estimate trade-credit portfolio exposure and covered expected loss.",
  id: "insurance/trade-credit-exposure",
  inputs: [
    { id: "buyerReceivables", label: "Buyer receivables", kind: "numberList" },
    {
      id: "buyerDefaultProbabilities",
      label: "Buyer default probabilities",
      kind: "numberList",
    },
    {
      id: "coveragePercent",
      label: "Trade-credit coverage",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    { id: "policyLimit", label: "Policy limit", kind: "number", minimum: 0 },
  ],
  outputs: [
    {
      id: "grossReceivables",
      label: "Gross receivables",
      kind: "number",
      minimum: 0,
    },
    {
      id: "expectedCreditLoss",
      label: "Expected credit loss",
      kind: "number",
      minimum: 0,
    },
    {
      id: "coveredExpectedLoss",
      label: "Covered expected loss",
      kind: "number",
      minimum: 0,
    },
    {
      id: "uncoveredExpectedLoss",
      label: "Uncovered expected loss",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Trade-Credit Exposure",
});

export const run = tool.execute;
export default tool;
