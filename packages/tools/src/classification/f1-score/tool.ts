import { createSimpleTool, simpleError } from "../../core/simple.js";
export const f1ScoreTool = createSimpleTool({
  id: "classification/f1-score",
  title: "F1 Score Calculator",
  description:
    "Calculate the harmonic mean of classification precision and recall.",
  inputs: [
    {
      id: "truePositive",
      label: "True positives",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "falsePositive",
      label: "False positives",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "falseNegative",
      label: "False negatives",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "f1Score", label: "F1 score", kind: "number", format: "probability" },
  ],
  calculate: (input) => {
    const denominator =
      2 * (input.truePositive as number) +
      (input.falsePositive as number) +
      (input.falseNegative as number);
    if (denominator === 0)
      simpleError("truePositive", "The F1 denominator must be positive.");
    return { f1Score: (2 * (input.truePositive as number)) / denominator };
  },
});
export const runF1Score = f1ScoreTool.execute;
export default f1ScoreTool;
