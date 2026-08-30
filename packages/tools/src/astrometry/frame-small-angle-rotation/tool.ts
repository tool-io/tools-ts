import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { vector, norm, cross, rotate } from "../shared.js";

export type Input = Readonly<{
  readonly inputVector: readonly number[];
  readonly rotationVectorRadians: readonly number[];
}>;
export type Output = Readonly<{
  readonly exactRotatedVector: readonly number[];
  readonly linearizedRotatedVector: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  vector(input.inputVector, "inputVector");
  vector(input.rotationVectorRadians, "rotationVectorRadians");
  const angle = norm(input.rotationVectorRadians);
  if (angle > 0.01)
    simpleError(
      "rotationVectorRadians",
      "Small-angle frame comparison is limited to 0.01 radians.",
    );
  const exactRotatedVector =
      angle === 0
        ? [...input.inputVector]
        : rotate(input.inputVector, input.rotationVectorRadians, angle),
    delta = cross(input.rotationVectorRadians, input.inputVector);
  return {
    exactRotatedVector,
    linearizedRotatedVector: input.inputVector.map((v, i) => v + delta[i]),
  };
};
export const exampleInput = {
  inputVector: [1, 0, 0],
  rotationVectorRadians: [0, 0, 0.001],
} satisfies Input;
export const exampleOutput = {
  exactRotatedVector: [0.9999995000000417, 0.0009999998333333417, 0],
  linearizedRotatedVector: [1, 0.001, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/frame-small-angle-rotation",
  title: "Frame Small Angle Rotation",
  description:
    "Compare exact Rodrigues and first-order active frame rotations for a supplied small rotation vector; passive coordinate transformations require the opposite sign.",
  inputs: [
    { id: "inputVector", label: "Input vector", kind: "numberList" },
    {
      id: "rotationVectorRadians",
      label: "Rotation vector radians",
      kind: "numberList",
    },
  ],
  outputs: [
    {
      id: "exactRotatedVector",
      label: "Exact rotated vector",
      kind: "numberList",
    },
    {
      id: "linearizedRotatedVector",
      label: "Linearized rotated vector",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      inputVector: value.inputVector as readonly number[],
      rotationVectorRadians: value.rotationVectorRadians as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
