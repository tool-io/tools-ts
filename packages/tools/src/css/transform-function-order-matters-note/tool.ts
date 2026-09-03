import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly pointX: number;
  readonly pointY: number;
  readonly translateX: number;
  readonly translateY: number;
  readonly rotationRadians: number;
}>;
export type Output = Readonly<{
  readonly translateThenRotatePoint: readonly number[];
  readonly rotateThenTranslatePoint: readonly number[];
}>;
const inputFields = [
  { id: "pointX", label: "Point x", kind: "number" },
  { id: "pointY", label: "Point y", kind: "number" },
  { id: "translateX", label: "Translate x", kind: "number" },
  { id: "translateY", label: "Translate y", kind: "number" },
  { id: "rotationRadians", label: "Rotation radians", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const c = Math.cos(input.rotationRadians),
    s = Math.sin(input.rotationRadians),
    x = input.pointX,
    y = input.pointY,
    tx = input.translateX,
    ty = input.translateY;
  return {
    translateThenRotatePoint: [
      c * (x + tx) - s * (y + ty),
      s * (x + tx) + c * (y + ty),
    ],
    rotateThenTranslatePoint: [c * x - s * y + tx, s * x + c * y + ty],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  pointX: 1,
  pointY: 0,
  translateX: 10,
  translateY: 0,
  rotationRadians: 1.5707963267948966,
} satisfies Input;
export const exampleOutput = {
  translateThenRotatePoint: [0, 11],
  rotateThenTranslatePoint: [10, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/transform-function-order-matters-note",
  title: "Transform Function Order Matters Note",
  description:
    "Compare geometric translate-then-rotate vs rotate-then-translate about origin, input radians and common units; CSS transform-list composition acts rightmost first. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "translateThenRotatePoint",
      label: "Translate then rotate point",
      kind: "numberList",
    },
    {
      id: "rotateThenTranslatePoint",
      label: "Rotate then translate point",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      pointX: value.pointX as number,
      pointY: value.pointY as number,
      translateX: value.translateX as number,
      translateY: value.translateY as number,
      rotationRadians: value.rotationRadians as number,
    }),
});
export const run = tool.execute;
export default tool;
