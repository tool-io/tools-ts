import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { deg, wrap, signedAngle, plateMatrix } from "../shared.js";

export type Input = Readonly<{
  readonly cdMatrix: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly firstAxisAngleDegrees: number;
  readonly secondAxisAngleDegrees: number;
  readonly axisSeparationDegrees: number;
}>;
export const calculate = (input: Input): Output => {
  plateMatrix(input.cdMatrix);
  const m = input.cdMatrix,
    a = wrap(deg(Math.atan2(m[1][0], m[0][0]))),
    b = wrap(deg(Math.atan2(m[1][1], m[0][1])));
  return {
    firstAxisAngleDegrees: a,
    secondAxisAngleDegrees: b,
    axisSeparationDegrees: Math.abs(signedAngle(b - a)),
  };
};
export const exampleInput = {
  cdMatrix: [
    [0, -1],
    [1, 0],
  ],
} satisfies Input;
export const exampleOutput = {
  firstAxisAngleDegrees: 90,
  secondAxisAngleDegrees: 180,
  axisSeparationDegrees: 90,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/cd-matrix-image-axis-angles",
  title: "Cd Matrix Image Axis Angles",
  description:
    "Infer both image-axis angles in the WCS tangent plane from CD columns, exposing skew rather than assuming an orthogonal scalar rotation.",
  inputs: [{ id: "cdMatrix", label: "Cd matrix", kind: "matrix" }],
  outputs: [
    {
      id: "firstAxisAngleDegrees",
      label: "First axis angle degrees",
      kind: "number",
    },
    {
      id: "secondAxisAngleDegrees",
      label: "Second axis angle degrees",
      kind: "number",
    },
    {
      id: "axisSeparationDegrees",
      label: "Axis separation degrees",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      cdMatrix: value.cdMatrix as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
