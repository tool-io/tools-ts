import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const schmittTriggerUpperThresholdExample = {
  input: { thresholdBaseVolts: 2 },
  output: { upperThresholdV: 3 },
} satisfies ToolExample<
  {
    readonly feedbackRatioNumber?: number;
    readonly thresholdBaseVolts: number;
  },
  { readonly upperThresholdV: number }
>;

export const schmittTriggerUpperThresholdTool = createSimpleTool({
  id: "electronics/schmitt-trigger-upper-threshold",
  title: "Schmitt Upper Threshold",
  description:
    "Compute the Schmitt trigger upper switching threshold upper = base * (1 + feedbackRatio).",
  inputs: [
    {
      id: "thresholdBaseVolts",
      kind: "number",
      label: "Threshold base",
      unit: "V",
    },
    {
      default: 0.5,
      id: "feedbackRatioNumber",
      kind: "number",
      label: "Feedback ratio",
    },
  ],
  outputs: [
    {
      id: "upperThresholdV",
      kind: "number",
      label: "Upper threshold",
      unit: "V",
    },
  ],
  calculate: (input) => {
    const base = input.thresholdBaseVolts as number;
    if (base <= 0)
      simpleError(
        "thresholdBaseVolts",
        "The threshold base must be greater than zero.",
        "invalid_threshold",
      );
    const ratio = input.feedbackRatioNumber as number;
    if (ratio <= 0)
      simpleError(
        "feedbackRatioNumber",
        "The feedback ratio must be greater than zero.",
        "invalid_ratio",
      );
    return { upperThresholdV: base * (1 + ratio) };
  },
});
export const runSchmittTriggerUpperThreshold =
  schmittTriggerUpperThresholdTool.execute;
export default schmittTriggerUpperThresholdTool;
