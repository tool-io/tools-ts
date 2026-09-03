import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly pointX: number;
  readonly pointY: number;
  readonly originX: number;
  readonly originY: number;
  readonly rotationRadians: number;
}>;
export type Output = Readonly<{ readonly rotatedPoint: readonly number[] }>;
const inputFields = [
  { id: "pointX", label: "Point x", kind: "number" },
  { id: "pointY", label: "Point y", kind: "number" },
  { id: "originX", label: "Origin x", kind: "number" },
  { id: "originY", label: "Origin y", kind: "number" },
  { id: "rotationRadians", label: "Rotation radians", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const x = input.pointX - input.originX,
    y = input.pointY - input.originY,
    c = Math.cos(input.rotationRadians),
    s = Math.sin(input.rotationRadians);
  return {
    rotatedPoint: [
      input.originX + c * x - s * y,
      input.originY + s * x + c * y,
    ],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  pointX: 2,
  pointY: 0,
  originX: 1,
  originY: 0,
  rotationRadians: 3.141592653589793,
} satisfies Input;
export const exampleOutput = { rotatedPoint: [0, 0] } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/rotate-origin-offset-effect-note",
  title: "Rotate Origin Offset Effect Note",
  description:
    "Actual2D rotation about independently resolved transform-origin coordinates (radians), not center assumed from element dimensions. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [{ id: "rotatedPoint", label: "Rotated point", kind: "numberList" }],
  calculate: (value) =>
    calculate({
      pointX: value.pointX as number,
      pointY: value.pointY as number,
      originX: value.originX as number,
      originY: value.originY as number,
      rotationRadians: value.rotationRadians as number,
    }),
});
export const run = tool.execute;
export default tool;
