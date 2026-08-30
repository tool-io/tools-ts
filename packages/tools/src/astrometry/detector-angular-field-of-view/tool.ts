import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, deg } from "../shared.js";

export type Input = Readonly<{
  readonly detectorWidthMm: number;
  readonly detectorHeightMm: number;
  readonly focalLengthMm: number;
}>;
export type Output = Readonly<{
  readonly widthDegrees: number;
  readonly heightDegrees: number;
}>;
export const calculate = (input: Input): Output => {
  positive(input.detectorWidthMm, "detectorWidthMm");
  positive(input.detectorHeightMm, "detectorHeightMm");
  positive(input.focalLengthMm, "focalLengthMm");
  return {
    widthDegrees: deg(
      2 * Math.atan(input.detectorWidthMm / (2 * input.focalLengthMm)),
    ),
    heightDegrees: deg(
      2 * Math.atan(input.detectorHeightMm / (2 * input.focalLengthMm)),
    ),
  };
};
export const exampleInput = {
  detectorWidthMm: 2,
  detectorHeightMm: 1,
  focalLengthMm: 10,
} satisfies Input;
export const exampleOutput = {
  widthDegrees: 11.421186274999286,
  heightDegrees: 5.724810452223495,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/detector-angular-field-of-view",
  title: "Detector Angular Field Of View",
  description:
    "Compute centered rectilinear detector field of view using exact pinhole angles, rather than a small-angle plate-scale product.",
  inputs: [
    { id: "detectorWidthMm", label: "Detector width mm", kind: "number" },
    { id: "detectorHeightMm", label: "Detector height mm", kind: "number" },
    { id: "focalLengthMm", label: "Focal length mm", kind: "number" },
  ],
  outputs: [
    { id: "widthDegrees", label: "Width degrees", kind: "number" },
    { id: "heightDegrees", label: "Height degrees", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      detectorWidthMm: value.detectorWidthMm as number,
      detectorHeightMm: value.detectorHeightMm as number,
      focalLengthMm: value.focalLengthMm as number,
    }),
});
export const run = tool.execute;
export default tool;
