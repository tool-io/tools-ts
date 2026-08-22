import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { calculateInclusiveQuartiles } from "../inclusive-quartiles/tool.js";

export const calculateInterquartileMean = (
  values: readonly number[],
): number | null => {
  const quartiles = calculateInclusiveQuartiles(values);
  if (quartiles === null) return null;
  const sorted = [...values].sort((left, right) => left - right);
  const inside = sorted.filter(
    (value) => value >= quartiles[0] && value <= quartiles[2],
  );
  if (inside.length === 0) return null;
  return inside.reduce((total, value) => total + value, 0) / inside.length;
};

export type InterquartileMeanInput = {
  readonly values: readonly number[];
};

export type InterquartileMeanOutput = {
  readonly interquartileMean: number;
};

export const interquartileMeanExample = {
  input: { values: [1, 2, 3, 4, 5, 6, 7, 8] },
  output: { interquartileMean: 4.5 },
} satisfies ToolExample<InterquartileMeanInput, InterquartileMeanOutput>;

export const interquartileMeanTool = createSimpleTool({
  id: "statistics/interquartile-mean",
  title: "Interquartile Mean Calculator",
  description:
    "Calculate the mean of the values between the inclusive first and third quartiles, ignoring outside extremes.",
  inputs: [{ id: "values", label: "Values", kind: "numberList" }],
  outputs: [
    {
      format: "interquartile-mean",
      id: "interquartileMean",
      kind: "number",
      label: "Interquartile mean",
    },
  ],
  calculate: (input) => {
    const interquartileMean = calculateInterquartileMean(
      input.values as number[],
    );
    if (interquartileMean === null)
      simpleError(
        "values",
        "Enter at least one finite number.",
        "empty_values",
      );
    return { interquartileMean };
  },
});

export const runInterquartileMean = interquartileMeanTool.execute;
export default interquartileMeanTool;
