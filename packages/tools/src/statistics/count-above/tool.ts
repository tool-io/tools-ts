import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type CountAboveInput = {
  readonly threshold: number;
  readonly values: readonly number[];
};

export type CountAboveOutput = {
  readonly count: number;
};

export const calculateCountAbove = (
  input: CountAboveInput,
): CountAboveOutput => ({
  count: input.values.filter((value) => value > input.threshold).length,
});

export const countAboveExample = {
  input: { threshold: 10, values: [4, 10, 11, 18, 3] },
  output: { count: 2 },
} satisfies ToolExample<CountAboveInput, CountAboveOutput>;

export const countAboveTool = createSimpleTool({
  id: "statistics/count-above",
  title: "Count Above Threshold Tool",
  description:
    "Count how many values in a list are strictly greater than a threshold.",
  inputs: [
    {
      description: "Values are counted when strictly greater than this number.",
      id: "threshold",
      label: "Threshold",
      kind: "number",
    },
    { id: "values", label: "Values", kind: "numberList" },
  ],
  outputs: [{ id: "count", label: "Count", kind: "integer" }],
  calculate: (input) => calculateCountAbove(input as CountAboveInput),
});
export const runCountAbove = countAboveTool.execute;
export default countAboveTool;
