import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { calculateInclusiveQuartiles } from "../inclusive-quartiles/tool.js";

export const calculateInterquartileRange = (
  values: readonly number[],
): number | null => {
  const quartiles = calculateInclusiveQuartiles(values);
  if (quartiles === null) return null;
  const result = quartiles[2] - quartiles[0];
  return Number.isFinite(result) ? result : null;
};

export const interquartileRangeExample = {
  input: { values: [1, 2, 3, 4, 5, 6, 7, 8] },
  output: { interquartileRange: 4 },
} satisfies ToolExample<
  { readonly values: readonly number[] },
  { readonly interquartileRange: number }
>;

export const interquartileRangeTool = createSimpleTool({
  id: "statistics/interquartile-range",
  title: "Interquartile Range Calculator",
  description:
    "Calculate Q3 minus Q1 with the inclusive median-of-halves quartile method.",
  inputs: [{ id: "values", label: "Values", kind: "numberList" }],
  outputs: [
    {
      format: "interquartile-range",
      id: "interquartileRange",
      kind: "number",
      label: "Interquartile range",
    },
  ],
  calculate: (input) => {
    const interquartileRange = calculateInterquartileRange(
      input.values as number[],
    );
    if (interquartileRange === null)
      simpleError("values", "Enter at least one finite number.");
    return { interquartileRange };
  },
});

export const runInterquartileRange = interquartileRangeTool.execute;
export default interquartileRangeTool;
