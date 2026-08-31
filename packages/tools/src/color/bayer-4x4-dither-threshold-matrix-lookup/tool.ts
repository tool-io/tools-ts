import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  integer,
  fraction,
  shape,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly normalizedGrayPixels: readonly (readonly number[])[];
  readonly originPixelX: number;
  readonly originPixelY: number;
}>;
export type Output = Readonly<{
  readonly binaryDitherPixels: readonly (readonly number[])[];
}>;
const inputFields = [
  {
    id: "normalizedGrayPixels",
    label: "Normalized gray pixels",
    kind: "matrix",
  },
  { id: "originPixelX", label: "Origin pixel x", kind: "number" },
  { id: "originPixelY", label: "Origin pixel y", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  integer(input.originPixelX, "originPixelX");
  integer(input.originPixelY, "originPixelY");
  shape(input.normalizedGrayPixels, "pixels");
  if (input.originPixelX < 0 || input.originPixelY < 0)
    simpleError("origin", "Nonnegative safe integer tile origin required.");
  const matrix = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
  ];
  return {
    binaryDitherPixels: input.normalizedGrayPixels.map((r, y) =>
      r.map((v, x) => {
        fraction(v, "gray");
        return v >
          (matrix[((input.originPixelY % 4) + y) % 4][
            ((input.originPixelX % 4) + x) % 4
          ] +
            0.5) /
            16
          ? 1
          : 0;
      }),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  normalizedGrayPixels: [
    [0.5, 0.5],
    [0.5, 0.5],
  ],
  originPixelX: 0,
  originPixelY: 0,
} satisfies Input;
export const exampleOutput = {
  binaryDitherPixels: [
    [1, 0],
    [0, 1],
  ],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/bayer-4x4-dither-threshold-matrix-lookup",
  title: "Bayer 4×4 Dither Threshold Matrix Lookup",
  description:
    "Apply Bayer 4×4 ordered thresholds (rank+0.5)/16 to actual normalized gray image using explicit tile origin; strict greater-than threshold, no error diffusion, printer dot-gain model or luminance conversion implied.",
  inputs: inputFields,
  outputs: [
    { id: "binaryDitherPixels", label: "Binary dither pixels", kind: "matrix" },
  ],
  calculate: (value) =>
    calculate({
      normalizedGrayPixels:
        value.normalizedGrayPixels as readonly (readonly number[])[],
      originPixelX: value.originPixelX as number,
      originPixelY: value.originPixelY as number,
    }),
});
export const run = tool.execute;
export default tool;
