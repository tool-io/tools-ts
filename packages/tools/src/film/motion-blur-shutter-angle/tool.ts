import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MotionBlurShutterAngleInput = Readonly<{
  readonly targetBlurPixels: number;
  readonly imageSpeedPixelsPerSecond: number;
  readonly framesPerSecond: number;
}>;
export type MotionBlurShutterAngleOutput = Readonly<{
  readonly shutterAngleDegrees: number;
}>;

export const calculateMotionBlurShutterAngle = (
  x: MotionBlurShutterAngleInput,
): MotionBlurShutterAngleOutput => {
  if (!Number.isFinite(x.targetBlurPixels) || x.targetBlurPixels < 0)
    simpleError("targetBlurPixels", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.imageSpeedPixelsPerSecond) ||
    x.imageSpeedPixelsPerSecond < 0
  )
    simpleError(
      "imageSpeedPixelsPerSecond",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.framesPerSecond) || x.framesPerSecond < 0)
    simpleError("framesPerSecond", "Provide a finite number at least 0.");
  if (x.framesPerSecond * x.targetBlurPixels > x.imageSpeedPixelsPerSecond)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const shutterAngleDegrees =
    (360 * x.framesPerSecond * x.targetBlurPixels) /
    x.imageSpeedPixelsPerSecond;
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
  input: {
    targetBlurPixels: 10,
    imageSpeedPixelsPerSecond: 480,
    framesPerSecond: 24,
  },
  output: { shutterAngleDegrees: 180 },
} satisfies ToolExample<
  MotionBlurShutterAngleInput,
  MotionBlurShutterAngleOutput
>;

export const tool = createSimpleTool({
  id: "film/motion-blur-shutter-angle",
  title: "Motion Blur Shutter Angle",
  description:
    "Shutter angle needed for a target moving-object blur length, from image speed in pixels per second and frame rate.",
  inputs: [
    {
      id: "targetBlurPixels",
      kind: "integer",
      label: "Target Blur Pixels",
      unit: "px",
      minimum: 0,
    },
    {
      id: "imageSpeedPixelsPerSecond",
      kind: "integer",
      label: "Image Speed Pixels Per Second",
      unit: "px/s",
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
    calculateMotionBlurShutterAngle({
      targetBlurPixels: input.targetBlurPixels as number,
      imageSpeedPixelsPerSecond: input.imageSpeedPixelsPerSecond as number,
      framesPerSecond: input.framesPerSecond as number,
    }),
});
export const motionBlurShutterAngleTool = tool;
export const runMotionBlurShutterAngle = tool.execute;
export default tool;
