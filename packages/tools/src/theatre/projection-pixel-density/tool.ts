import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly horizontalPixels: number;
  readonly imageWidthMeters: number;
  readonly viewerDistanceMeters: number;
}>;
export type Output = Readonly<{
  readonly pixelsPerMeter: number;
  readonly pixelPitchMillimeters: number;
  readonly pixelsPerDegree: number;
}>;

export const calculate = (input: Input): Output => {
  if (input.imageWidthMeters <= 0 || input.viewerDistanceMeters <= 0)
    simpleError(
      "imageWidthMeters",
      "Image width and viewer distance must be positive.",
      "invalid_geometry",
    );
  const pixelsPerMeter = input.horizontalPixels / input.imageWidthMeters;
  const pixelPitchMillimeters = 1000 / pixelsPerMeter;
  const angularWidthDegrees =
    (2 *
      Math.atan(input.imageWidthMeters / (2 * input.viewerDistanceMeters)) *
      180) /
    Math.PI;
  return {
    pixelsPerMeter,
    pixelPitchMillimeters,
    pixelsPerDegree: input.horizontalPixels / angularWidthDegrees,
  };
};

export const exampleInput = {
  horizontalPixels: 3840,
  imageWidthMeters: 8,
  viewerDistanceMeters: 12,
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  horizontalPixels: 1920,
  imageWidthMeters: 4,
  viewerDistanceMeters: 8,
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      horizontalPixels: input.horizontalPixels as number,
      imageWidthMeters: input.imageWidthMeters as number,
      viewerDistanceMeters: input.viewerDistanceMeters as number,
    }),
  description:
    "Calculate linear and angular pixel density for a projected image.",
  id: "theatre/projection-pixel-density",
  inputs: [
    {
      id: "horizontalPixels",
      label: "Horizontal resolution",
      kind: "integer",
      minimum: 1,
      unit: "px",
    },
    {
      id: "imageWidthMeters",
      label: "Projected image width",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "viewerDistanceMeters",
      label: "Viewer distance",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
  ],
  outputs: [
    {
      id: "pixelsPerMeter",
      label: "Pixel density",
      kind: "number",
      minimum: 0,
      unit: "px/m",
    },
    {
      id: "pixelPitchMillimeters",
      label: "Projected pixel pitch",
      kind: "number",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "pixelsPerDegree",
      label: "Angular pixel density",
      kind: "number",
      minimum: 0,
      unit: "px/°",
    },
  ],
  title: "Projection Pixel Density",
});

export const run = tool.execute;
export default tool;
