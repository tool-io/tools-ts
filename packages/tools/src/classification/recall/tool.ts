import { createSimpleTool, simpleError } from "../../core/simple.js";
export const recallTool = createSimpleTool({
  id: "classification/recall",
  title: "Recall Calculator",
  description:
    "Calculate sensitivity from true positive and false negative counts.",
  inputs: [
    {
      id: "truePositive",
      label: "True positives",
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
    { id: "recall", label: "Recall", kind: "number", format: "probability" },
  ],
  calculate: (input) => {
    const denominator =
      (input.truePositive as number) + (input.falseNegative as number);
    if (denominator === 0)
      simpleError("truePositive", "Actual positives must be nonzero.");
    return { recall: (input.truePositive as number) / denominator };
  },
});
export const runRecall = recallTool.execute;
export default recallTool;
