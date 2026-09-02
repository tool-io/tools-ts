import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, shape } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerWcsCdDegreesPerPixel: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly imageColumnPixelScaleArcsec: number;
  readonly imageRowPixelScaleArcsec: number;
}>;
const inputFields = [
  {
    id: "callerWcsCdDegreesPerPixel",
    label: "Caller wcs cd degrees per pixel",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    input.callerWcsCdDegreesPerPixel.length !== 2 ||
    shape(input.callerWcsCdDegreesPerPixel, "CD") !== 2
  )
    simpleError("matrix", "2×2CDmatrix.");
  const [[a, b], [c, d]] = input.callerWcsCdDegreesPerPixel;
  return {
    imageColumnPixelScaleArcsec: 3600 * Math.hypot(a, c),
    imageRowPixelScaleArcsec: 3600 * Math.hypot(b, d),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerWcsCdDegreesPerPixel: [
    [3, 0],
    [4, 2],
  ],
} satisfies Input;
export const exampleOutput = {
  imageColumnPixelScaleArcsec: 18000,
  imageRowPixelScaleArcsec: 7200,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/pixel-scale-from-cdmatrix-derivation-calculator",
  title: "Pixel Scale from CD Matrix Elements Derivation Calculator",
  description:
    "Both WCS CD column norms separately, anisotropic/skewed matrices retained; not determinant-area square root substituted for both pixel axes. Caller independently establishes frames, units, epoch, covariance and instrument context; not an identity, association or astrometric quality certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "imageColumnPixelScaleArcsec",
      label: "Image column pixel scale arcsec",
      kind: "number",
    },
    {
      id: "imageRowPixelScaleArcsec",
      label: "Image row pixel scale arcsec",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerWcsCdDegreesPerPixel:
        value.callerWcsCdDegreesPerPixel as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
