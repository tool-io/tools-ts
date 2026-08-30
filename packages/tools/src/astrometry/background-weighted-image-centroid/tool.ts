import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly pixelValues: readonly (readonly number[])[];
  readonly backgroundPerPixel: number;
}>;
export type Output = Readonly<{
  readonly centroidX: number;
  readonly centroidY: number;
  readonly positiveFlux: number;
}>;
export const calculate = (input: Input): Output => {
  nonnegative(input.backgroundPerPixel, "backgroundPerPixel");
  const rows = input.pixelValues.length,
    cols = input.pixelValues[0]?.length ?? 0;
  if (
    !rows ||
    !cols ||
    rows > 128 ||
    cols > 128 ||
    input.pixelValues.some(
      (row) =>
        row.length !== cols || row.some((v) => !Number.isFinite(v) || v < 0),
    )
  )
    simpleError(
      "pixelValues",
      "A nonempty rectangular nonnegative image no larger than 128×128 required.",
    );
  let positiveFlux = 0,
    xSum = 0,
    ySum = 0;
  input.pixelValues.forEach((row, y) =>
    row.forEach((value, x) => {
      const w = Math.max(0, value - input.backgroundPerPixel);
      positiveFlux += w;
      xSum += x * w;
      ySum += y * w;
    }),
  );
  positive(positiveFlux, "pixelValues");
  return {
    centroidX: xSum / positiveFlux,
    centroidY: ySum / positiveFlux,
    positiveFlux,
  };
};
export const exampleInput = {
  pixelValues: [
    [1, 1],
    [1, 5],
  ],
  backgroundPerPixel: 1,
} satisfies Input;
export const exampleOutput = {
  centroidX: 1,
  centroidY: 1,
  positiveFlux: 4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/background-weighted-image-centroid",
  title: "Background Weighted Image Centroid",
  description:
    "Compute zero-based pixel-center weighted moments after constant background subtraction and nonnegative flux clipping; not a PSF fit.",
  inputs: [
    { id: "pixelValues", label: "Pixel values", kind: "matrix" },
    { id: "backgroundPerPixel", label: "Background per pixel", kind: "number" },
  ],
  outputs: [
    { id: "centroidX", label: "Centroid x", kind: "number" },
    { id: "centroidY", label: "Centroid y", kind: "number" },
    { id: "positiveFlux", label: "Positive flux", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      pixelValues: value.pixelValues as readonly (readonly number[])[],
      backgroundPerPixel: value.backgroundPerPixel as number,
    }),
});
export const run = tool.execute;
export default tool;
