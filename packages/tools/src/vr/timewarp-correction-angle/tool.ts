import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TimewarpCorrectionAngleInput = Readonly<{
  readonly angularVelocityDegreesPerSecond: number;
  readonly latencyMilliseconds: number;
}>;
export type TimewarpCorrectionAngleOutput = Readonly<{
  readonly correctionDegrees: number;
}>;

export const calculateTimewarpCorrectionAngle = (
  x: TimewarpCorrectionAngleInput,
): TimewarpCorrectionAngleOutput => {
  if (!Number.isFinite(x.angularVelocityDegreesPerSecond))
    simpleError("angularVelocityDegreesPerSecond", "Provide a finite number.");
  if (!Number.isFinite(x.latencyMilliseconds) || x.latencyMilliseconds < 0)
    simpleError("latencyMilliseconds", "Provide a finite nonnegative number.");
  const correctionDegrees =
    (x.angularVelocityDegreesPerSecond * x.latencyMilliseconds) / 1000;
  if (!Number.isFinite(correctionDegrees))
    simpleError(
      "correctionDegrees",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    correctionDegrees: Object.is(correctionDegrees, -0) ? 0 : correctionDegrees,
  };
};

export const example = {
  input: {
    angularVelocityDegreesPerSecond: 90,
    latencyMilliseconds: 10,
  },
  output: { correctionDegrees: 0.9 },
} satisfies ToolExample<
  TimewarpCorrectionAngleInput,
  TimewarpCorrectionAngleOutput
>;

export const tool = createSimpleTool({
  id: "vr/timewarp-correction-angle",
  title: "Timewarp Correction Angle",
  description:
    "Approximate angular pose correction from angular velocity times late-update latency.",
  inputs: [
    {
      id: "angularVelocityDegreesPerSecond",
      kind: "number",
      label: "Angular Velocity Degrees Per Second",
      unit: "deg/s",
    },
    {
      id: "latencyMilliseconds",
      kind: "number",
      label: "Latency Milliseconds",
      unit: "ms",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "correctionDegrees",
      kind: "number",
      label: "Correction Degrees",
      unit: "deg",
    },
  ],
  calculate: (input) =>
    calculateTimewarpCorrectionAngle({
      angularVelocityDegreesPerSecond:
        input.angularVelocityDegreesPerSecond as number,
      latencyMilliseconds: input.latencyMilliseconds as number,
    }),
});
export const timewarpCorrectionAngleTool = tool;
export const runTimewarpCorrectionAngle = tool.execute;
export default tool;
