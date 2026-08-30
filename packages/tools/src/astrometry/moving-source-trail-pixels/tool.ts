import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, nonnegative, deg, wrap } from "../shared.js";

export type Input = Readonly<{
  readonly eastMotionArcsecPerHour: number;
  readonly northMotionArcsecPerHour: number;
  readonly exposureHours: number;
  readonly pixelScaleArcsecPerPixel: number;
}>;
export type Output = Readonly<{
  readonly trailPixels: number;
  readonly trailAngleDegrees: number;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.exposureHours, "exposureHours");
  positive(input.pixelScaleArcsecPerPixel, "pixelScaleArcsecPerPixel");
  const rate = positive(
    Math.hypot(input.eastMotionArcsecPerHour, input.northMotionArcsecPerHour),
    "eastMotionArcsecPerHour",
  );
  return {
    trailPixels: (rate * input.exposureHours) / input.pixelScaleArcsecPerPixel,
    trailAngleDegrees: wrap(
      deg(
        Math.atan2(
          input.eastMotionArcsecPerHour,
          input.northMotionArcsecPerHour,
        ),
      ),
    ),
  };
};
export const exampleInput = {
  eastMotionArcsecPerHour: 3,
  northMotionArcsecPerHour: 4,
  exposureHours: 0.5,
  pixelScaleArcsecPerPixel: 0.1,
} satisfies Input;
export const exampleOutput = {
  trailPixels: 25,
  trailAngleDegrees: 36.86989764584402,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/moving-source-trail-pixels",
  title: "Moving Source Trail Pixels",
  description:
    "Project tangent-plane motion onto a detector trail length and position angle for a supplied exposure and pixel scale.",
  inputs: [
    {
      id: "eastMotionArcsecPerHour",
      label: "East motion arcsec per hour",
      kind: "number",
    },
    {
      id: "northMotionArcsecPerHour",
      label: "North motion arcsec per hour",
      kind: "number",
    },
    { id: "exposureHours", label: "Exposure hours", kind: "number" },
    {
      id: "pixelScaleArcsecPerPixel",
      label: "Pixel scale arcsec per pixel",
      kind: "number",
    },
  ],
  outputs: [
    { id: "trailPixels", label: "Trail pixels", kind: "number" },
    { id: "trailAngleDegrees", label: "Trail angle degrees", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      eastMotionArcsecPerHour: value.eastMotionArcsecPerHour as number,
      northMotionArcsecPerHour: value.northMotionArcsecPerHour as number,
      exposureHours: value.exposureHours as number,
      pixelScaleArcsecPerPixel: value.pixelScaleArcsecPerPixel as number,
    }),
});
export const run = tool.execute;
export default tool;
