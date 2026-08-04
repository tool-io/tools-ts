import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const calculatePearsonCorrelation = (
  first: readonly number[],
  second: readonly number[],
): number | null => {
  if (
    first.length < 2 ||
    first.length !== second.length ||
    !first.every(Number.isFinite) ||
    !second.every(Number.isFinite)
  )
    return null;

  const firstMean = first.reduce((sum, value) => sum + value, 0) / first.length;
  const secondMean =
    second.reduce((sum, value) => sum + value, 0) / second.length;
  if (!Number.isFinite(firstMean) || !Number.isFinite(secondMean)) return null;

  let covariance = 0;
  let firstSquares = 0;
  let secondSquares = 0;
  for (let index = 0; index < first.length; index += 1) {
    const firstDifference = first[index]! - firstMean;
    const secondDifference = second[index]! - secondMean;
    covariance += firstDifference * secondDifference;
    firstSquares += firstDifference ** 2;
    secondSquares += secondDifference ** 2;
  }

  const denominator = Math.sqrt(firstSquares * secondSquares);
  if (denominator === 0 || !Number.isFinite(denominator)) return null;
  const correlation = covariance / denominator;
  return Number.isFinite(correlation)
    ? Number(correlation.toPrecision(15))
    : null;
};

export const pearsonCorrelationExample = {
  input: {
    first: [1, 2, 3, 4, 5],
    second: [2, 4, 5, 8, 10],
  },
  output: { correlation: 0.990147542976674 },
} satisfies ToolExample<
  {
    readonly first: readonly number[];
    readonly second: readonly number[];
  },
  { readonly correlation: number }
>;

export const pearsonCorrelationTool = createSimpleTool({
  id: "statistics/pearson-correlation",
  title: "Pearson Correlation Calculator",
  description:
    "Calculate Pearson's linear correlation coefficient for two paired numeric series.",
  inputs: [
    { id: "first", label: "X values", kind: "numberList" },
    { id: "second", label: "Y values", kind: "numberList" },
  ],
  outputs: [
    {
      format: "correlation-coefficient",
      id: "correlation",
      kind: "number",
      label: "Pearson correlation",
    },
  ],
  calculate: (input) => {
    const correlation = calculatePearsonCorrelation(
      input.first as number[],
      input.second as number[],
    );
    if (correlation === null)
      simpleError(
        "second",
        "Enter equal-length finite lists of at least two values with nonzero variation.",
      );
    return { correlation };
  },
});

export const runPearsonCorrelation = pearsonCorrelationTool.execute;
export default pearsonCorrelationTool;
