import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, shape, finite } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerWcsCdDegreesPerPixel: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly determinantDegreesSquaredPerPixelSquared: number;
  readonly orientationParity: number;
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
  const [[a, b], [c, d]] = input.callerWcsCdDegreesPerPixel,
    det = finite(a * d - b * c);
  return {
    determinantDegreesSquaredPerPixelSquared: det,
    orientationParity: Math.sign(det),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerWcsCdDegreesPerPixel: [
    [1, 0],
    [0, -1],
  ],
} satisfies Input;
export const exampleOutput = {
  determinantDegreesSquaredPerPixelSquared: -1,
  orientationParity: -1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/wcs-cd-matrix-orientation-sign-checker",
  title: "WCS CD Matrix Determinant Orientation Sign Checker",
  description:
    "Supplied tangent-plane WCS CD determinant parity, singular zero retained explicitly; no celestial orientation from determinant alone. Caller independently establishes frames, units, epoch, covariance and instrument context; not an identity, association or astrometric quality certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "determinantDegreesSquaredPerPixelSquared",
      label: "Determinant degrees squared per pixel squared",
      kind: "number",
    },
    { id: "orientationParity", label: "Orientation parity", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      callerWcsCdDegreesPerPixel:
        value.callerWcsCdDegreesPerPixel as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
