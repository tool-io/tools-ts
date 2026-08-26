import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RudderAngleRequiredInput = {
  readonly forwardSpeedMs: number;
  readonly lateralDriftMs: number;
};

export type RudderAngleRequiredOutput = {
  readonly correctionAngleDegrees: number;
};

export const rudderAngleRequiredExample = {
  input: { forwardSpeedMs: 5, lateralDriftMs: 5 },
  output: { correctionAngleDegrees: 45 },
} satisfies ToolExample<RudderAngleRequiredInput, RudderAngleRequiredOutput>;

export const calculateRudderAngleRequired = (
  input: RudderAngleRequiredInput,
): RudderAngleRequiredOutput => {
  if (input.forwardSpeedMs <= 0)
    simpleError(
      "forwardSpeedMs",
      "Forward speed must be positive.",
      "invalid_input",
    );
  return {
    correctionAngleDegrees:
      Math.atan(input.lateralDriftMs / input.forwardSpeedMs) * (180 / Math.PI),
  };
};

export const rudderAngleRequiredTool = createSimpleTool({
  calculate: (input) =>
    calculateRudderAngleRequired(input as unknown as RudderAngleRequiredInput),
  description:
    "Compute the rudder correction angle from correctionDeg = degrees(atan(lateralDriftMs / forwardSpeedMs)).",
  id: "sailing/rudder-angle-required",
  inputs: [
    {
      description: "Forward speed through the water.",
      id: "forwardSpeedMs",
      kind: "number",
      label: "Forward speed",
      minimum: 0,
      unit: "m/s",
    },
    {
      description: "Lateral drift speed caused by current or leeway.",
      id: "lateralDriftMs",
      kind: "number",
      label: "Lateral drift",
      minimum: 0,
      unit: "m/s",
    },
  ],
  outputs: [
    {
      description: "Course correction angle to hold the desired track.",
      format: "angle-deg",
      id: "correctionAngleDegrees",
      kind: "number",
      label: "Correction angle",
      unit: "deg",
    },
  ],
  title: "Rudder Correction Angle Calculator",
});
export const runRudderAngleRequired = rudderAngleRequiredTool.execute;
export default rudderAngleRequiredTool;
