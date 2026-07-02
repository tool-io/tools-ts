import { createSimpleTool, simpleError } from "../../core/simple.js";
export const accuracyTool = createSimpleTool({
  id: "classification/accuracy",
  title: "Accuracy Calculator",
  description:
    "Calculate classification accuracy from true and false outcome counts.",
  inputs: [
    {
      id: "truePositive",
      label: "True positives",
      kind: "integer",
      minimum: 0,
    },
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
    {
      id: "falseNegative",
      label: "False negatives",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "accuracy",
      label: "Accuracy",
      kind: "number",
      format: "probability",
    },
  ],
  calculate: (input) => {
    const total =
      (input.truePositive as number) +
      (input.trueNegative as number) +
      (input.falsePositive as number) +
      (input.falseNegative as number);
    if (total === 0)
      simpleError("truePositive", "At least one observation is required.");
    return {
      accuracy:
        ((input.truePositive as number) + (input.trueNegative as number)) /
        total,
    };
  },
});
export const runAccuracy = accuracyTool.execute;
export default accuracyTool;
