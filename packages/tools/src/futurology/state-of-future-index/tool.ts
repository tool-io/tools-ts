import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly baselineValues: readonly number[];
  readonly currentValues: readonly number[];
  readonly weights: readonly number[];
}>;
export type Output = Readonly<{
  readonly weightedIndex: number;
  readonly indicatorCount: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.baselineValues.length === 0 ||
    input.baselineValues.length !== input.currentValues.length ||
    input.baselineValues.length !== input.weights.length
  )
    simpleError(
      "baselineValues",
      "Value and weight lists must be nonempty and equal length.",
      "length_mismatch",
    );
  if (input.baselineValues.some((v) => v === 0))
    simpleError(
      "baselineValues",
      "Baseline values must not be zero.",
      "zero_baseline",
    );
  const totalWeight = input.weights.reduce((a, b) => a + b, 0);
  if (totalWeight === 0)
    simpleError("weights", "Total weight must not be zero.", "zero_weight");
  const weightedIndex =
    (input.baselineValues.reduce(
      (sum, base, index) =>
        sum +
        ((input.currentValues[index] - base) / Math.abs(base)) *
          input.weights[index],
      0,
    ) /
      totalWeight) *
    100;
  return { weightedIndex, indicatorCount: input.weights.length };
};

export const exampleInput = {
  baselineValues: [100, 50],
  currentValues: [110, 45],
  weights: [2, 1],
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  baselineValues: [100],
  currentValues: [100],
  weights: [1],
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      baselineValues: input.baselineValues as readonly number[],
      currentValues: input.currentValues as readonly number[],
      weights: input.weights as readonly number[],
    }),
  description:
    "Calculate a caller-defined weighted percent-change index from aligned indicators.",
  id: "futurology/state-of-future-index",
  inputs: [
    {
      id: "baselineValues",
      label: "Baseline indicator values",
      kind: "numberList",
    },
    {
      id: "currentValues",
      label: "Current indicator values",
      kind: "numberList",
    },
    { id: "weights", label: "Indicator weights", kind: "numberList" },
  ],
  outputs: [
    { id: "weightedIndex", label: "Weighted change index", kind: "number" },
    {
      id: "indicatorCount",
      label: "Indicator count",
      kind: "integer",
      minimum: 1,
    },
  ],
  title: "State of the Future Index",
});

export const run = tool.execute;
export default tool;
