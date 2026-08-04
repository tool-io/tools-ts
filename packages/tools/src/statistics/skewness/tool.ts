import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const calculateSampleSkewness = (
  values: readonly number[],
): number | null => {
  if (values.length < 3 || !values.every(Number.isFinite)) return null;
  const count = values.length;
  const mean = values.reduce((sum, value) => sum + value, 0) / count;
  if (!Number.isFinite(mean)) return null;
  const secondMoment = values.reduce(
    (sum, value) => sum + (value - mean) ** 2,
    0,
  );
  const standardDeviation = Math.sqrt(secondMoment / (count - 1));
  if (standardDeviation === 0 || !Number.isFinite(standardDeviation))
    return null;
  const thirdMoment = values.reduce(
    (sum, value) => sum + (value - mean) ** 3,
    0,
  );
  const skewness =
    (count * thirdMoment) /
    ((count - 1) * (count - 2) * standardDeviation ** 3);
  if (!Number.isFinite(skewness)) return null;
  return Object.is(skewness, -0) ? 0 : skewness;
};

export const skewnessExample = {
  input: { values: [1, 2, 3, 4, 5] },
  output: { skewness: 0 },
} satisfies ToolExample<
  { readonly values: readonly number[] },
  { readonly skewness: number }
>;

export const skewnessTool = createSimpleTool({
  id: "statistics/skewness",
  title: "Sample Skewness Calculator",
  description:
    "Calculate adjusted Fisher-Pearson sample skewness for a finite numeric dataset.",
  inputs: [{ id: "values", label: "Values", kind: "numberList" }],
  outputs: [
    {
      format: "sample-skewness",
      id: "skewness",
      kind: "number",
      label: "Sample skewness",
    },
  ],
  calculate: (input) => {
    const skewness = calculateSampleSkewness(input.values as number[]);
    if (skewness === null)
      simpleError(
        "values",
        "Enter at least three finite values with nonzero variation.",
      );
    return { skewness };
  },
});

export const runSkewness = skewnessTool.execute;
export default skewnessTool;
