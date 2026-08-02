import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const sampleCovarianceExample = {
  input: { first: [1, 2, 3], second: [2, 4, 6] },
} satisfies ToolExample<{
  readonly first: readonly number[];
  readonly second: readonly number[];
}>;

export const sampleCovarianceTool = createSimpleTool({
  id: "statistics/sample-covariance",
  title: "Sample Covariance Calculator",
  description:
    "Calculate unbiased sample covariance for paired numeric observations.",
  inputs: [
    { id: "first", label: "First values", kind: "numberList" },
    { id: "second", label: "Second values", kind: "numberList" },
  ],
  outputs: [{ id: "covariance", label: "Sample covariance", kind: "number" }],
  calculate: (input) => {
    const first = input.first as number[],
      second = input.second as number[];
    if (first.length < 2 || first.length !== second.length)
      simpleError("second", "Lists must have the same length of at least two.");
    const mean1 = first.reduce((a, b) => a + b, 0) / first.length,
      mean2 = second.reduce((a, b) => a + b, 0) / second.length;
    return {
      covariance:
        first.reduce(
          (sum, value, index) =>
            sum + (value - mean1) * (second[index]! - mean2),
          0,
        ) /
        (first.length - 1),
    };
  },
});
export const runSampleCovariance = sampleCovarianceTool.execute;
export default sampleCovarianceTool;
