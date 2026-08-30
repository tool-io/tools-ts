import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly projectedMonthlyRevenue: readonly number[];
  readonly maximumMonthlyGrowthFraction: number;
}>;
export type Output = Readonly<{
  readonly monthsAboveLimit: readonly number[];
  readonly peakGrowthFraction: number;
}>;
export const calculate = (input: Input): Output => {
  const v = input.projectedMonthlyRevenue;
  if (
    v.length < 2 ||
    v.some((x) => x <= 0) ||
    input.maximumMonthlyGrowthFraction < 0
  )
    simpleError(
      "projectedMonthlyRevenue",
      "At least two positive projected monthly revenues and growth limit required.",
    );
  const growth = v.slice(1).map((x, i) => x / v[i] - 1);
  return {
    monthsAboveLimit: growth.flatMap((x, i) =>
      x > input.maximumMonthlyGrowthFraction ? [i + 1] : [],
    ),
    peakGrowthFraction: Math.max(...growth),
  };
};
export const exampleInput = {
  projectedMonthlyRevenue: [100, 200, 300],
  maximumMonthlyGrowthFraction: 0.6,
} satisfies Input;
export const exampleOutput = {
  monthsAboveLimit: [1],
  peakGrowthFraction: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/revenue-projection-growth-screen",
  title: "Revenue Projection Growth Screen",
  description:
    "Flag forecast months whose month-over-month revenue growth exceeds a chosen limit.",
  inputs: [
    {
      id: "projectedMonthlyRevenue",
      label: "Projected monthly revenue",
      kind: "numberList",
    },
    {
      id: "maximumMonthlyGrowthFraction",
      label: "Maximum monthly growth fraction",
      kind: "number",
    },
  ],
  outputs: [
    { id: "monthsAboveLimit", label: "Months above limit", kind: "numberList" },
    { id: "peakGrowthFraction", label: "Peak growth fraction", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      projectedMonthlyRevenue:
        value.projectedMonthlyRevenue as readonly number[],
      maximumMonthlyGrowthFraction:
        value.maximumMonthlyGrowthFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
