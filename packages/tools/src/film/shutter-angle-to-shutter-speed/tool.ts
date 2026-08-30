import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ShutterAngleToShutterSpeedInput = Readonly<{
  readonly shutterAngleDegrees: number;
  readonly framesPerSecond: number;
}>;
export type ShutterAngleToShutterSpeedOutput = Readonly<{
  readonly exposureSeconds: number;
}>;

export const calculateShutterAngleToShutterSpeed = (
  x: ShutterAngleToShutterSpeedInput,
): ShutterAngleToShutterSpeedOutput => {
  if (!Number.isFinite(x.shutterAngleDegrees) || x.shutterAngleDegrees < 0)
    simpleError("shutterAngleDegrees", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.framesPerSecond) || x.framesPerSecond < 0)
    simpleError("framesPerSecond", "Provide a finite number at least 0.");
  if (x.shutterAngleDegrees > 360)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const exposureSeconds = x.shutterAngleDegrees / (360 * x.framesPerSecond);
  if (!Number.isFinite(exposureSeconds))
    simpleError(
      "exposureSeconds",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    exposureSeconds: Object.is(exposureSeconds, -0) ? 0 : exposureSeconds,
  };
};

export const example = {
  input: { shutterAngleDegrees: 180, framesPerSecond: 24 },
  output: { exposureSeconds: 0.020833333333333332 },
} satisfies ToolExample<
  ShutterAngleToShutterSpeedInput,
  ShutterAngleToShutterSpeedOutput
>;

export const tool = createSimpleTool({
  id: "film/shutter-angle-to-shutter-speed",
  title: "Shutter Angle To Shutter Speed",
  description:
    "Exposure duration from rotary shutter angle and frame rate: t=angle/(360·fps); valid for a 0–360° shutter.",
  inputs: [
    {
      id: "shutterAngleDegrees",
      kind: "number",
      label: "Shutter Angle Degrees",
      unit: "°",
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
      id: "exposureSeconds",
      kind: "number",
      label: "Exposure Seconds",
      unit: "s",
    },
  ],
  calculate: (input) =>
    calculateShutterAngleToShutterSpeed({
      shutterAngleDegrees: input.shutterAngleDegrees as number,
      framesPerSecond: input.framesPerSecond as number,
    }),
});
export const shutterAngleToShutterSpeedTool = tool;
export const runShutterAngleToShutterSpeed = tool.execute;
export default tool;
