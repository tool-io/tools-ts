import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, triangle } from "../batch-shared.js";
export type Input = Readonly<{
  readonly vertices: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly circumcenter: readonly number[];
  readonly centroid: readonly number[];
  readonly orthocenter: readonly number[];
  readonly eulerLineDirection: readonly number[];
  readonly eulerLineDeterminate: boolean;
}>;
const inputFields = [
  { id: "vertices", label: "Vertices", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const t = triangle(input.vertices),
    d = t.orthocenter.map((x, i) => x - t.circumcenter[i]);
  return {
    circumcenter: t.circumcenter,
    centroid: t.centroid,
    orthocenter: t.orthocenter,
    eulerLineDirection: d,
    eulerLineDeterminate: Math.hypot(...d) > 1e-12 * t.circumradius,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  vertices: [
    [0, 0],
    [4, 0],
    [0, 3],
  ],
} satisfies Input;
export const exampleOutput = {
  circumcenter: [2, 1.5],
  centroid: [1.3333333333333333, 1],
  orthocenter: [0, 0],
  eulerLineDirection: [-2, -1.5],
  eulerLineDeterminate: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/euler-line",
  title: "Euler Line Calculator",
  description:
    "Construct circumcenter, centroid, orthocenter and Euler-line direction from planar vertices; equilateral coincident centers leave no unique Euler line.",
  inputs: inputFields,
  outputs: [
    { id: "circumcenter", label: "Circumcenter", kind: "numberList" },
    { id: "centroid", label: "Centroid", kind: "numberList" },
    { id: "orthocenter", label: "Orthocenter", kind: "numberList" },
    {
      id: "eulerLineDirection",
      label: "Euler line direction",
      kind: "numberList",
    },
    {
      id: "eulerLineDeterminate",
      label: "Euler line determinate",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({ vertices: value.vertices as readonly (readonly number[])[] }),
});
export const run = tool.execute;
export default tool;
