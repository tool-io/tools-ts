import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SchmittTriggerLowerThresholdInput = {
  readonly thresholdBaseVolts: number;
  readonly feedbackRatioNumber?: number;
};

export type SchmittTriggerLowerThresholdOutput = {
  readonly lowerThresholdV: number;
};

export const schmittTriggerLowerThresholdExample = {
  input: { thresholdBaseVolts: 10 },
  output: { lowerThresholdV: 5 },
} satisfies ToolExample<
  SchmittTriggerLowerThresholdInput,
  SchmittTriggerLowerThresholdOutput
>;

export const calculateSchmittTriggerLowerThreshold = (
  input: SchmittTriggerLowerThresholdInput,
): SchmittTriggerLowerThresholdOutput => {
  const feedbackRatioNumber = input.feedbackRatioNumber ?? 0.5;
  if (!(input.thresholdBaseVolts > 0))
    simpleError(
      "thresholdBaseVolts",
      "Threshold base voltage must be positive.",
      "invalid_threshold_base",
    );
  if (!(feedbackRatioNumber > 0))
    simpleError(
      "feedbackRatioNumber",
      "Feedback ratio must be positive.",
      "invalid_feedback_ratio",
    );
  if (feedbackRatioNumber > 0.9)
    simpleError(
      "feedbackRatioNumber",
      "Feedback ratio must be at most 0.9.",
      "ratio_too_large",
    );
  return {
    lowerThresholdV: input.thresholdBaseVolts * (1 - feedbackRatioNumber),
  };
};

export const schmittTriggerLowerThresholdTool = createSimpleTool({
  calculate: (input) =>
    calculateSchmittTriggerLowerThreshold(
      input as unknown as SchmittTriggerLowerThresholdInput,
    ),
  description:
    "Compute the Schmitt trigger lower threshold as thresholdBaseVolts x (1 - feedback ratio), with ratio between zero and one exclusive of one, defaulting to 0.5.",
  id: "electronics/schmitt-trigger-lower-threshold",
  inputs: [
    {
      id: "thresholdBaseVolts",
      kind: "number",
      label: "Threshold base voltage",
      unit: "V",
    },
    {
      default: 0.5,
      id: "feedbackRatioNumber",
      kind: "number",
      label: "Feedback ratio",
      required: false,
    },
  ],
  outputs: [
    {
      id: "lowerThresholdV",
      kind: "number",
      label: "Lower threshold",
      unit: "V",
    },
  ],
  title: "Schmitt Lower Threshold",
});
export const runSchmittTriggerLowerThreshold =
  schmittTriggerLowerThresholdTool.execute;
export default schmittTriggerLowerThresholdTool;
