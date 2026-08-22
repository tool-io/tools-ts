import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const median = (sorted: readonly number[]): number => {
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? ((sorted[middle - 1] as number) + (sorted[middle] as number)) / 2
    : (sorted[middle] as number);
};

export const outlierCountIqrTool = createSimpleTool({
  id: "statistics/outlier-count-iqr",
  title: "Outlier Count IQR Tool",
  description:
    "Count values outside the Tukey fences of one and a half interquartile ranges.",
  inputs: [{ id: "values", label: "Values", kind: "numberList" }],
  outputs: [{ id: "count", label: "Outlier count", kind: "integer" }],
  calculate: (input) => {
    const values = input.values as number[];
    if (values.length < 4)
      simpleError(
        "values",
        "At least four values are required to form quartiles.",
        "insufficient_values",
      );
    const sorted = [...values].sort((left, right) => left - right);
    const middle = Math.floor(sorted.length / 2);
    const lowerHalf = sorted.slice(0, middle);
    const upperHalf =
      sorted.length % 2 === 0 ? sorted.slice(middle) : sorted.slice(middle + 1);
    const q1 = median(lowerHalf);
    const q3 = median(upperHalf);
    const iqr = q3 - q1;
    const lowFence = q1 - 1.5 * iqr;
    const highFence = q3 + 1.5 * iqr;
    return {
      count: values.filter((value) => value < lowFence || value > highFence)
        .length,
    };
  },
});
export const runOutlierCountIqr = outlierCountIqrTool.execute;
export default outlierCountIqrTool;

export type OutlierCountIqrInput = {
  readonly values: readonly number[];
};

export type OutlierCountIqrOutput = {
  readonly count: number;
};

export const outlierCountIqrExample = {
  input: { values: [1, 2, 3, 4, 5, 100] },
  output: { count: 1 },
} satisfies ToolExample<OutlierCountIqrInput, OutlierCountIqrOutput>;
