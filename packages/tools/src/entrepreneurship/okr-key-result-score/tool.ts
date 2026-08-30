import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { nonnegative, positive, fraction, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly keyResults: readonly string[];
  readonly progressFractions: readonly number[];
  readonly weights: readonly number[];
}>;
export type Output = Readonly<{
  readonly weightedScore: number;
  readonly incompleteResults: readonly string[];
}>;
export const calculate = (input: Input): Output => {
  aligned(input.keyResults, input.progressFractions, "keyResults");
  if (input.weights.length !== input.keyResults.length)
    simpleError("weights", "One weight per key result required.");
  input.progressFractions.forEach((v) => fraction(v, "progressFractions"));
  input.weights.forEach((v) => nonnegative(v, "weights"));
  const total = input.weights.reduce((a, b) => a + b, 0);
  positive(total, "weights");
  return {
    weightedScore:
      input.progressFractions.reduce(
        (sum, v, i) => sum + v * input.weights[i],
        0,
      ) / total,
    incompleteResults: input.keyResults.filter(
      (_, i) => input.progressFractions[i] < 1,
    ),
  };
};
export const exampleInput = {
  keyResults: ["ship", "retention"],
  progressFractions: [0.8, 0.6],
  weights: [1, 1],
} satisfies Input;
export const exampleOutput = {
  weightedScore: 0.7,
  incompleteResults: ["ship", "retention"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/okr-key-result-score",
  title: "OKR Key Result Score",
  description:
    "Grade objective key results by caller-supplied progress and importance weights.",
  inputs: [
    { id: "keyResults", label: "Key results", kind: "stringList" },
    {
      id: "progressFractions",
      label: "Progress fractions",
      kind: "numberList",
    },
    { id: "weights", label: "Weights", kind: "numberList" },
  ],
  outputs: [
    { id: "weightedScore", label: "Weighted score", kind: "number" },
    {
      id: "incompleteResults",
      label: "Incomplete results",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      keyResults: value.keyResults as readonly string[],
      progressFractions: value.progressFractions as readonly number[],
      weights: value.weights as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
