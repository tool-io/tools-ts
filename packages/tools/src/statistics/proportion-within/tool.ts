import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ProportionWithinInput = {
  readonly lower: number;
  readonly upper: number;
  readonly values: readonly number[];
};

export type ProportionWithinOutput = {
  readonly proportion: number;
};

export const calculateProportionWithin = (
  input: ProportionWithinInput,
): ProportionWithinOutput => {
  if (input.upper < input.lower)
    simpleError(
      "upper",
      "The upper bound must be at least the lower bound.",
      "invalid_range",
    );
  if (input.values.length === 0) return { proportion: 0 };
  const within = input.values.filter(
    (value) => value >= input.lower && value <= input.upper,
  ).length;
  return { proportion: within / input.values.length };
};

export const proportionWithinExample = {
  input: { lower: 10, upper: 20, values: [5, 10, 15, 20, 25] },
  output: { proportion: 0.6 },
} satisfies ToolExample<ProportionWithinInput, ProportionWithinOutput>;

export const proportionWithinTool = createSimpleTool({
  id: "statistics/proportion-within",
  title: "Proportion Within Range Calculator",
  description:
    "Calculate the fraction of values inside an inclusive lower and upper bound.",
  inputs: [
    { id: "lower", label: "Lower bound", kind: "number" },
    {
      description: "Must be greater than or equal to the lower bound.",
      id: "upper",
      label: "Upper bound",
      kind: "number",
    },
    { id: "values", label: "Values", kind: "numberList" },
  ],
  outputs: [
    {
      description: "Fraction between zero and one.",
      id: "proportion",
      label: "Proportion within range",
      kind: "number",
    },
  ],
  calculate: (input) =>
    calculateProportionWithin(input as ProportionWithinInput),
});
export const runProportionWithin = proportionWithinTool.execute;
export default proportionWithinTool;
