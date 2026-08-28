import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ServoAngleFromPulseWidthInput = {
  readonly pulseWidthUs: number;
};

export type ServoAngleFromPulseWidthOutput = {
  readonly servoAngleDegrees: number;
};

export const servoAngleFromPulseWidthExample = {
  input: { pulseWidthUs: 2000 },
  output: { servoAngleDegrees: 90 },
} satisfies ToolExample<
  ServoAngleFromPulseWidthInput,
  ServoAngleFromPulseWidthOutput
>;

export const calculateServoAngleFromPulseWidth = (
  input: ServoAngleFromPulseWidthInput,
): ServoAngleFromPulseWidthOutput => {
  if (
    !Number.isFinite(input.pulseWidthUs) ||
    input.pulseWidthUs < 500 ||
    input.pulseWidthUs > 2500
  )
    simpleError(
      "pulseWidthUs",
      "Pulse width must be between 500 and 2500 microseconds.",
      "invalid_pulse_width",
    );
  return {
    servoAngleDegrees: Math.max(
      -90,
      Math.min(90, ((input.pulseWidthUs - 1500) * 180) / 1000),
    ),
  };
};

export const servoAngleFromPulseWidthTool = createSimpleTool({
  calculate: (input) =>
    calculateServoAngleFromPulseWidth(
      input as unknown as ServoAngleFromPulseWidthInput,
    ),
  description:
    "Map a hobby servo pulse width between 500 and 2500 microseconds to a signed angle with the documented linear scale of 1000 to 2000 microseconds covering -90 to +90 degrees, clamping extended-range pulses to the endpoints.",
  id: "electronics/servo-angle-from-pulse-width",
  inputs: [
    {
      description: "Servo control pulse width in microseconds.",
      id: "pulseWidthUs",
      kind: "number",
      label: "Pulse width",
      unit: "µs",
    },
  ],
  outputs: [
    {
      description: "Commanded angle clamped to the -90 to 90 degree range.",
      id: "servoAngleDegrees",
      kind: "number",
      label: "Angle",
      unit: "°",
    },
  ],
  title: "Servo Angle From Pulse",
});
export const runServoAngleFromPulseWidth = servoAngleFromPulseWidthTool.execute;
export default servoAngleFromPulseWidthTool;
