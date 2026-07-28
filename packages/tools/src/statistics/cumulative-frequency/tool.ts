import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const cumulativeFrequencyExample = {
  input: { values: [2, 1, 2, 3] },
} satisfies ToolExample<{ readonly values: readonly number[] }>;

export const cumulativeFrequencyTool = createSimpleTool({
  id: "statistics/cumulative-frequency",
  title: "Cumulative Frequency Calculator",
  description:
    "Create sorted values with frequency and cumulative-frequency counts.",
  inputs: [{ id: "values", label: "Values", kind: "numberList" }],
  outputs: [
    { id: "values", label: "Sorted unique values", kind: "numberList" },
    { id: "frequencies", label: "Frequencies", kind: "numberList" },
    {
      id: "cumulativeFrequencies",
      label: "Cumulative frequencies",
      kind: "numberList",
    },
  ],
  calculate: (input) => {
    const values = input.values as number[];
    if (values.length === 0) simpleError("values", "Enter at least one value.");
    const sorted = [...values].sort((a, b) => a - b),
      unique = [] as number[],
      frequencies = [] as number[];
    for (const value of sorted) {
      const last = unique.length - 1;
      if (last >= 0 && unique[last] === value) frequencies[last]! += 1;
      else {
        unique.push(value);
        frequencies.push(1);
      }
    }
    let total = 0;
    return {
      values: unique,
      frequencies,
      cumulativeFrequencies: frequencies.map((value) => (total += value)),
    };
  },
});
export const runCumulativeFrequency = cumulativeFrequencyTool.execute;
export default cumulativeFrequencyTool;
