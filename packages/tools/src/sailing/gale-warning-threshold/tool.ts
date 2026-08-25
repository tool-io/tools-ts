import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type GaleWarningThresholdInput = {
  readonly windSpeedKt: number;
};

export type GaleWarningThresholdOutput = {
  readonly isGaleForce: boolean;
};

export const galeWarningThresholdExample = {
  input: { windSpeedKt: 36 },
  output: { isGaleForce: true },
} satisfies ToolExample<GaleWarningThresholdInput, GaleWarningThresholdOutput>;

export const calculateGaleWarningThreshold = (
  input: GaleWarningThresholdInput,
): GaleWarningThresholdOutput => ({
  isGaleForce: input.windSpeedKt >= 34 && input.windSpeedKt < 48,
});

export const galeWarningThresholdTool = createSimpleTool({
  calculate: (input) =>
    calculateGaleWarningThreshold(
      input as unknown as GaleWarningThresholdInput,
    ),
  description:
    "Check whether a wind speed in knots reaches gale force, meaning Beaufort force eight to nine between thirty-four and forty-eight knots.",
  id: "sailing/gale-warning-threshold",
  inputs: [
    {
      description: "Sustained wind speed to test against the gale threshold.",
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
        "True when the wind speed is gale force but below storm force.",
      id: "isGaleForce",
      kind: "boolean",
      label: "Gale force",
    },
  ],
  title: "Gale Warning Check",
});
export const runGaleWarningThreshold = galeWarningThresholdTool.execute;
export default galeWarningThresholdTool;
