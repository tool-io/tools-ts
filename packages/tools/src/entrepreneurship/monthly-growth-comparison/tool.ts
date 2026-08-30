import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive } from "../shared.js";

export type Input = Readonly<{
  readonly monthlyValues: readonly number[];
}>;
export type Output = Readonly<{
  readonly monthlyGrowthFractions: readonly number[];
  readonly arithmeticMeanGrowth: number;
  readonly compoundMeanGrowth: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.monthlyValues.length < 2)
    simpleError(
      "monthlyValues",
      "At least two positive observations required.",
    );
  input.monthlyValues.forEach((v) => positive(v, "monthlyValues"));
  const x = input.monthlyValues,
    monthlyGrowthFractions = x.slice(1).map((v, i) => v / x[i] - 1);
  return {
    monthlyGrowthFractions,
    arithmeticMeanGrowth:
      monthlyGrowthFractions.reduce((a, b) => a + b, 0) /
      monthlyGrowthFractions.length,
    compoundMeanGrowth: (x[x.length - 1] / x[0]) ** (1 / (x.length - 1)) - 1,
  };
};
export const exampleInput = { monthlyValues: [100, 200, 400] } satisfies Input;
export const exampleOutput = {
  monthlyGrowthFractions: [1, 1],
  arithmeticMeanGrowth: 1,
  compoundMeanGrowth: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/monthly-growth-comparison",
  title: "Monthly Growth Comparison",
  description:
    "Compare arithmetic mean monthly growth with compounded average growth.",
  inputs: [
    { id: "monthlyValues", label: "Monthly values", kind: "numberList" },
  ],
  outputs: [
    {
      id: "monthlyGrowthFractions",
      label: "Monthly growth fractions",
      kind: "numberList",
    },
    {
      id: "arithmeticMeanGrowth",
      label: "Arithmetic mean growth",
      kind: "number",
    },
    { id: "compoundMeanGrowth", label: "Compound mean growth", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      monthlyValues: value.monthlyValues as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
