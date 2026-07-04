import { createSimpleTool, simpleError } from "../../core/simple.js";
export const expectedValueTool = createSimpleTool({
  id: "probability/expected-value",
  title: "Expected Value Calculator",
  description:
    "Calculate the probability-weighted expected value of discrete outcomes.",
  inputs: [
    { id: "values", label: "Values", kind: "numberList" },
    { id: "probabilities", label: "Probabilities", kind: "numberList" },
  ],
  outputs: [{ id: "expectedValue", label: "Expected value", kind: "number" }],
  calculate: (input) => {
    const values = input.values as number[],
      probabilities = input.probabilities as number[];
    if (values.length === 0 || values.length !== probabilities.length)
      simpleError(
        "probabilities",
        "Values and probabilities must have the same nonzero length.",
      );
    if (probabilities.some((value) => value < 0))
      simpleError("probabilities", "Probabilities must be nonnegative.");
    const total = probabilities.reduce((sum, value) => sum + value, 0);
    if (Math.abs(total - 1) > 1e-12)
      simpleError("probabilities", "Probabilities must sum to one.");
    return {
      expectedValue: values.reduce(
        (sum, value, index) => sum + value * probabilities[index]!,
        0,
      ),
    };
  },
});
export const runExpectedValue = expectedValueTool.execute;
export default expectedValueTool;
