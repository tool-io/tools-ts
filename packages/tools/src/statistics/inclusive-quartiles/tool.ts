import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Quartiles = readonly [
  firstQuartile: number,
  median: number,
  thirdQuartile: number,
];

const median = (sorted: readonly number[]): number => {
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? ((sorted[middle - 1] as number) + (sorted[middle] as number)) / 2
    : (sorted[middle] as number);
};

export const calculateInclusiveQuartiles = (
  values: readonly number[],
): Quartiles | null => {
  if (values.length === 0 || !values.every(Number.isFinite)) return null;

  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  const lower =
    sorted.length % 2 === 0
      ? sorted.slice(0, middle)
      : sorted.slice(0, middle + 1);
  const upper = sorted.slice(middle);

  return [median(lower), median(sorted), median(upper)];
};

export const inclusiveQuartilesExample = {
  input: { values: [1, 2, 3, 4, 5] },
  output: { quartiles: [2, 3, 4] },
} satisfies ToolExample<
  { readonly values: readonly number[] },
  { readonly quartiles: readonly number[] }
>;

export const inclusiveQuartilesTool = createSimpleTool({
  id: "statistics/inclusive-quartiles",
  title: "Inclusive Quartiles Calculator",
  description:
    "Calculate Q1, Q2, and Q3 by including the median in both halves of an odd-sized dataset.",
  inputs: [{ id: "values", label: "Values", kind: "numberList" }],
  outputs: [
    {
      format: "quartiles",
      id: "quartiles",
      kind: "numberList",
      label: "Inclusive quartiles",
    },
  ],
  calculate: (input) => {
    const quartiles = calculateInclusiveQuartiles(input.values as number[]);
    if (quartiles === null)
      simpleError("values", "Enter at least one finite number.");
    return { quartiles };
  },
});

export const runInclusiveQuartiles = inclusiveQuartilesTool.execute;
export default inclusiveQuartilesTool;
