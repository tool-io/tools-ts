import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FrameRateToShutterSpeedInput = Readonly<{
  readonly framesPerSecond: number;
}>;
export type FrameRateToShutterSpeedOutput = Readonly<{
  readonly exposureSeconds: number;
}>;

export const calculateFrameRateToShutterSpeed = (
  x: FrameRateToShutterSpeedInput,
): FrameRateToShutterSpeedOutput => {
  if (!Number.isFinite(x.framesPerSecond) || x.framesPerSecond < 0)
    simpleError("framesPerSecond", "Provide a finite number at least 0.");
  const exposureSeconds = 1 / (2 * x.framesPerSecond);
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
  input: { framesPerSecond: 24 },
  output: { exposureSeconds: 0.020833333333333332 },
} satisfies ToolExample<
  FrameRateToShutterSpeedInput,
  FrameRateToShutterSpeedOutput
>;

export const tool = createSimpleTool({
  id: "film/frame-rate-to-shutter-speed",
  title: "Frame Rate To Shutter Speed",
  description:
    "180-degree shutter convention: exposure duration is half a frame period, 1/(2·fps).",
  inputs: [
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
    calculateFrameRateToShutterSpeed({
      framesPerSecond: input.framesPerSecond as number,
    }),
});
export const frameRateToShutterSpeedTool = tool;
export const runFrameRateToShutterSpeed = tool.execute;
export default tool;
