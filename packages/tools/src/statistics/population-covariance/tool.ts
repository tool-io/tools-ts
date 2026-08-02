import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const populationCovarianceExample = {
  input: { first: [1, 2, 3], second: [2, 4, 6] },
} satisfies ToolExample<{
  readonly first: readonly number[];
  readonly second: readonly number[];
}>;

export const populationCovarianceTool = createSimpleTool({
  id: "statistics/population-covariance",
  title: "Population Covariance Calculator",
  description:
    "Calculate population covariance for paired numeric observations.",
  inputs: [
    { id: "first", label: "First values", kind: "numberList" },
    { id: "second", label: "Second values", kind: "numberList" },
  ],
  outputs: [
    { id: "covariance", label: "Population covariance", kind: "number" },
  ],
  calculate: (input) => {
    const first = input.first as number[],
      second = input.second as number[];
    if (first.length === 0 || first.length !== second.length)
      simpleError("second", "Lists must have the same nonzero length.");
    const mean1 = first.reduce((a, b) => a + b, 0) / first.length,
      mean2 = second.reduce((a, b) => a + b, 0) / second.length;
    return {
      covariance:
        first.reduce(
          (sum, value, index) =>
            sum + (value - mean1) * (second[index]! - mean2),
          0,
        ) / first.length,
    };
  },
});
export const runPopulationCovariance = populationCovarianceTool.execute;
export default populationCovarianceTool;
