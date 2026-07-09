import { createSimpleTool, simpleError } from "../../core/simple.js";
export const specificityTool = createSimpleTool({
  id: "classification/specificity",
  title: "Specificity Calculator",
  description:
    "Calculate true negative rate from true negative and false positive counts.",
  inputs: [
    {
      id: "trueNegative",
      label: "True negatives",
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
      id: "specificity",
      label: "Specificity",
      kind: "number",
      format: "probability",
    },
  ],
  calculate: (input) => {
    const denominator =
      (input.trueNegative as number) + (input.falsePositive as number);
    if (denominator === 0)
      simpleError("trueNegative", "Actual negatives must be nonzero.");
    return { specificity: (input.trueNegative as number) / denominator };
  },
});
export const runSpecificity = specificityTool.execute;
export default specificityTool;
