import { createSimpleTool, simpleError } from "../../core/simple.js";
export const precisionTool = createSimpleTool({
  id: "classification/precision",
  title: "Precision Calculator",
  description:
    "Calculate positive predictive value from true and false positive counts.",
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
  ],
  outputs: [
    {
      id: "precision",
      label: "Precision",
      kind: "number",
      format: "probability",
    },
  ],
  calculate: (input) => {
    const denominator =
      (input.truePositive as number) + (input.falsePositive as number);
    if (denominator === 0)
      simpleError("truePositive", "Predicted positives must be nonzero.");
    return { precision: (input.truePositive as number) / denominator };
  },
});
export const runPrecision = precisionTool.execute;
export default precisionTool;
