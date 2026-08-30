import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly cumulativePremiums: readonly number[];
  readonly cumulativeSevenPayLimits: readonly number[];
}>;
export type Output = Readonly<{
  readonly firstBreachYear: number;
  readonly breachDetected: boolean;
  readonly maximumExcess: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.cumulativePremiums.length === 0 ||
    input.cumulativePremiums.length !== input.cumulativeSevenPayLimits.length
  )
    simpleError(
      "cumulativePremiums",
      "Premium and limit lists must be nonempty and equal length.",
      "length_mismatch",
    );
  let firstBreachYear = 0;
  let maximumExcess = 0;
  input.cumulativePremiums.forEach((value, index) => {
    const excess = value - input.cumulativeSevenPayLimits[index];
    if (excess > 0 && firstBreachYear === 0) firstBreachYear = index + 1;
    if (excess > maximumExcess) maximumExcess = excess;
  });
  return {
    firstBreachYear,
    breachDetected: firstBreachYear > 0,
    maximumExcess,
  };
};

export const exampleInput = {
  cumulativePremiums: [5000, 11000, 18000],
  cumulativeSevenPayLimits: [6000, 12000, 17500],
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  cumulativePremiums: [5000, 10000],
  cumulativeSevenPayLimits: [6000, 12000],
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      cumulativePremiums: input.cumulativePremiums as readonly number[],
      cumulativeSevenPayLimits:
        input.cumulativeSevenPayLimits as readonly number[],
    }),
  description:
    "Compare cumulative premiums with caller-supplied seven-pay limits.",
  id: "insurance/seven-pay-limit-screen",
  inputs: [
    {
      id: "cumulativePremiums",
      label: "Cumulative premiums",
      kind: "numberList",
      unit: "currency",
    },
    {
      id: "cumulativeSevenPayLimits",
      label: "Cumulative seven-pay limits",
      kind: "numberList",
      unit: "currency",
    },
  ],
  outputs: [
    {
      id: "firstBreachYear",
      label: "First breach year",
      kind: "integer",
      minimum: 0,
    },
    { id: "breachDetected", label: "Breach detected", kind: "boolean" },
    {
      id: "maximumExcess",
      label: "Maximum excess",
      kind: "number",
      minimum: 0,
      unit: "currency",
    },
  ],
  title: "Seven-Pay Limit Screen",
});

export const run = tool.execute;
export default tool;
