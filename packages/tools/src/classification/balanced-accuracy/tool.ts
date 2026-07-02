import { createSimpleTool, simpleError } from "../../core/simple.js";
export const balancedAccuracyTool = createSimpleTool({
  id: "classification/balanced-accuracy",
  title: "Balanced Accuracy Calculator",
  description: "Calculate the mean of sensitivity and specificity.",
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
      id: "balancedAccuracy",
      label: "Balanced accuracy",
      kind: "number",
      format: "probability",
    },
  ],
  calculate: (input) => {
    const positive =
        (input.truePositive as number) + (input.falseNegative as number),
      negative =
        (input.trueNegative as number) + (input.falsePositive as number);
    if (positive === 0 || negative === 0)
      simpleError("truePositive", "Both actual classes need observations.");
    return {
      balancedAccuracy:
        ((input.truePositive as number) / positive +
          (input.trueNegative as number) / negative) /
        2,
    };
  },
});
export const runBalancedAccuracy = balancedAccuracyTool.execute;
export default balancedAccuracyTool;
