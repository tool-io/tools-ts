import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type StormWarningThresholdInput = {
  readonly windSpeedKt: number;
};

export type StormWarningThresholdOutput = {
  readonly isStormForce: boolean;
};

export const stormWarningThresholdExample = {
  input: { windSpeedKt: 50 },
  output: { isStormForce: true },
} satisfies ToolExample<
  StormWarningThresholdInput,
  StormWarningThresholdOutput
>;

export const calculateStormWarningThreshold = (
  input: StormWarningThresholdInput,
): StormWarningThresholdOutput => ({
  isStormForce: input.windSpeedKt >= 48 && input.windSpeedKt < 64,
});

export const stormWarningThresholdTool = createSimpleTool({
  calculate: (input) =>
    calculateStormWarningThreshold(
      input as unknown as StormWarningThresholdInput,
    ),
  description:
    "Check whether a wind speed in knots reaches storm force, meaning Beaufort force ten to eleven between forty-eight and sixty-four knots.",
  id: "sailing/storm-warning-threshold",
  inputs: [
    {
      description: "Sustained wind speed to test against the storm threshold.",
      format: "speed-kt",
      id: "windSpeedKt",
      kind: "number",
      label: "Wind speed",
      minimum: 0,
      unit: "kt",
    },
  ],
  outputs: [
    {
      description:
        "True when the wind speed is storm force but below hurricane force.",
      id: "isStormForce",
      kind: "boolean",
      label: "Storm force",
    },
  ],
  title: "Storm Warning Check",
});
export const runStormWarningThreshold = stormWarningThresholdTool.execute;
export default stormWarningThresholdTool;
