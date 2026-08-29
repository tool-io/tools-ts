import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const benfordCounts = (values: readonly number[]): number[] => {
  if (!values.length)
    simpleError("values", "Provide at least one observation.");
  const counts = Array<number>(9).fill(0);
  for (const value of values) {
    if (value === 0)
      simpleError("values", "Benford's law excludes zero observations.");
    const mantissa =
      Math.abs(value) / 10 ** Math.floor(Math.log10(Math.abs(value)));
    const digit = Math.min(9, Math.max(1, Math.floor(mantissa)));
    counts[digit - 1]! += 1;
  }
  return counts;
};

export const example = {
  input: { values: [1, 2, 10, 20] },
  output: { counts: [2, 2, 0, 0, 0, 0, 0, 0, 0], total: 4 },
} satisfies ToolExample<
  { readonly values: number[] },
  { readonly counts: number[]; readonly total: number }
>;

export const tool = createSimpleTool({
  id: "statistics/benford-law-checker",
  title: "Benford's Law First-Digit Checker",
  description:
    "Count leading nonzero decimal digits 1–9 in nonzero observations for comparison with Benford's logarithmic proportions. A small or range-restricted sample alone is not evidence of fraud.",
  inputs: [{ id: "values", kind: "numberList", label: "Observations" }],
  outputs: [
    { id: "counts", kind: "numberList", label: "Counts for digits 1–9" },
    { id: "total", kind: "integer", label: "Observation count" },
  ],
  calculate: (input) => {
    const values = input.values as number[];
    return { counts: benfordCounts(values), total: values.length };
  },
});
export type BenfordLawCheckerInput = Readonly<typeof example.input>;
export type BenfordLawCheckerOutput = Readonly<typeof example.output>;
export const benfordLawCheckerTool = tool;
export const runBenfordLawChecker = tool.execute;
export default tool;
