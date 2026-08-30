import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RollingShutterSkewPixelsInput = Readonly<{
  readonly horizontalPixelsPerSecond: number;
  readonly readoutMilliseconds: number;
}>;
export type RollingShutterSkewPixelsOutput = Readonly<{
  readonly skewPixels: number;
}>;

export const calculateRollingShutterSkewPixels = (
  x: RollingShutterSkewPixelsInput,
): RollingShutterSkewPixelsOutput => {
  if (!Number.isFinite(x.horizontalPixelsPerSecond))
    simpleError("horizontalPixelsPerSecond", "Provide a finite number.");
  if (!Number.isFinite(x.readoutMilliseconds) || x.readoutMilliseconds < 0)
    simpleError("readoutMilliseconds", "Provide a finite number at least 0.");
  const skewPixels =
    (x.horizontalPixelsPerSecond * x.readoutMilliseconds) / 1000;
  if (!Number.isFinite(skewPixels))
    simpleError(
      "skewPixels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { skewPixels: Object.is(skewPixels, -0) ? 0 : skewPixels };
};

export const example = {
  input: { horizontalPixelsPerSecond: 1000, readoutMilliseconds: 20 },
  output: { skewPixels: 20 },
} satisfies ToolExample<
  RollingShutterSkewPixelsInput,
  RollingShutterSkewPixelsOutput
>;

export const tool = createSimpleTool({
  id: "film/rolling-shutter-skew-pixels",
  title: "Rolling Shutter Skew Pixels",
  description:
    "Horizontal rolling-shutter displacement of an object moving at constant image speed during full sensor readout.",
  inputs: [
    {
      id: "horizontalPixelsPerSecond",
      kind: "integer",
      label: "Horizontal Pixels Per Second",
      unit: "px/s",
    },
    {
      id: "readoutMilliseconds",
      kind: "number",
      label: "Readout Milliseconds",
      unit: "ms",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "skewPixels", kind: "number", label: "Skew Pixels", unit: "px" },
  ],
  calculate: (input) =>
    calculateRollingShutterSkewPixels({
      horizontalPixelsPerSecond: input.horizontalPixelsPerSecond as number,
      readoutMilliseconds: input.readoutMilliseconds as number,
    }),
});
export const rollingShutterSkewPixelsTool = tool;
export const runRollingShutterSkewPixels = tool.execute;
export default tool;
