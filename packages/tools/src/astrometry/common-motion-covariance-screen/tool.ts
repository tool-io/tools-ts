import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, plateMatrix } from "../shared.js";

export type Input = Readonly<{
  readonly firstMotion: readonly number[];
  readonly secondMotion: readonly number[];
  readonly combinedCovariance: readonly (readonly number[])[];
  readonly maximumChiSquare: number;
}>;
export type Output = Readonly<{
  readonly motionChiSquare: number;
  readonly relativeGaussianLikelihood: number;
  readonly passesSuppliedCriterion: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (input.firstMotion.length !== 2 || input.secondMotion.length !== 2)
    simpleError(
      "firstMotion",
      "Two-component matched east/north motions required.",
    );
  plateMatrix(input.combinedCovariance);
  const m = input.combinedCovariance,
    det = m[0][0] * m[1][1] - m[0][1] * m[1][0];
  if (m[0][0] <= 0 || m[1][1] <= 0 || det <= 0 || m[0][1] !== m[1][0])
    simpleError(
      "combinedCovariance",
      "Symmetric positive-definite combined motion covariance required.",
    );
  positive(input.maximumChiSquare, "maximumChiSquare");
  const x = input.firstMotion[0] - input.secondMotion[0],
    y = input.firstMotion[1] - input.secondMotion[1],
    motionChiSquare =
      (m[1][1] * x * x - 2 * m[0][1] * x * y + m[0][0] * y * y) / det;
  return {
    motionChiSquare,
    relativeGaussianLikelihood: Math.exp(-motionChiSquare / 2),
    passesSuppliedCriterion: motionChiSquare <= input.maximumChiSquare,
  };
};
export const exampleInput = {
  firstMotion: [1, 2],
  secondMotion: [0, 0],
  combinedCovariance: [
    [1, 0],
    [0, 4],
  ],
  maximumChiSquare: 3,
} satisfies Input;
export const exampleOutput = {
  motionChiSquare: 2,
  relativeGaussianLikelihood: 0.36787944117144233,
  passesSuppliedCriterion: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/common-motion-covariance-screen",
  title: "Common Motion Covariance Screen",
  description:
    "Screen common proper motion with a supplied combined two-coordinate covariance; the relative Gaussian likelihood is not a membership probability or prior.",
  inputs: [
    { id: "firstMotion", label: "First motion", kind: "numberList" },
    { id: "secondMotion", label: "Second motion", kind: "numberList" },
    { id: "combinedCovariance", label: "Combined covariance", kind: "matrix" },
    { id: "maximumChiSquare", label: "Maximum chi square", kind: "number" },
  ],
  outputs: [
    { id: "motionChiSquare", label: "Motion chi square", kind: "number" },
    {
      id: "relativeGaussianLikelihood",
      label: "Relative gaussian likelihood",
      kind: "number",
    },
    {
      id: "passesSuppliedCriterion",
      label: "Passes supplied criterion",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      firstMotion: value.firstMotion as readonly number[],
      secondMotion: value.secondMotion as readonly number[],
      combinedCovariance:
        value.combinedCovariance as readonly (readonly number[])[],
      maximumChiSquare: value.maximumChiSquare as number,
    }),
});
export const run = tool.execute;
export default tool;
