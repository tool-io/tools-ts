import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ShutterSpeedToShutterAngleInput = Readonly<{
  readonly exposureSeconds: number;
  readonly framesPerSecond: number;
}>;
export type ShutterSpeedToShutterAngleOutput = Readonly<{
  readonly shutterAngleDegrees: number;
}>;

export const calculateShutterSpeedToShutterAngle = (
  x: ShutterSpeedToShutterAngleInput,
): ShutterSpeedToShutterAngleOutput => {
  if (!Number.isFinite(x.exposureSeconds) || x.exposureSeconds < 0)
    simpleError("exposureSeconds", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.framesPerSecond) || x.framesPerSecond < 0)
    simpleError("framesPerSecond", "Provide a finite number at least 0.");
  if (x.framesPerSecond * x.exposureSeconds > 1)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const shutterAngleDegrees = 360 * x.framesPerSecond * x.exposureSeconds;
  if (!Number.isFinite(shutterAngleDegrees))
    simpleError(
      "shutterAngleDegrees",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    shutterAngleDegrees: Object.is(shutterAngleDegrees, -0)
      ? 0
      : shutterAngleDegrees,
  };
};

export const example = {
  input: { exposureSeconds: 0.020833333333333332, framesPerSecond: 24 },
  output: { shutterAngleDegrees: 180 },
} satisfies ToolExample<
  ShutterSpeedToShutterAngleInput,
  ShutterSpeedToShutterAngleOutput
>;

export const tool = createSimpleTool({
  id: "film/shutter-speed-to-shutter-angle",
  title: "Shutter Speed To Shutter Angle",
  description:
    "Rotary shutter angle from exposure duration and frame rate: angle=360·fps·t; rejects exposure longer than a frame.",
  inputs: [
    {
      id: "exposureSeconds",
      kind: "number",
      label: "Exposure Seconds",
      unit: "s",
      minimum: 0,
    },
    {
      id: "framesPerSecond",
      kind: "number",
      label: "Frames Per Second",
      unit: "fps",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "shutterAngleDegrees",
      kind: "number",
      label: "Shutter Angle Degrees",
      unit: "°",
    },
  ],
  calculate: (input) =>
    calculateShutterSpeedToShutterAngle({
      exposureSeconds: input.exposureSeconds as number,
      framesPerSecond: input.framesPerSecond as number,
    }),
});
export const shutterSpeedToShutterAngleTool = tool;
export const runShutterSpeedToShutterAngle = tool.execute;
export default tool;
