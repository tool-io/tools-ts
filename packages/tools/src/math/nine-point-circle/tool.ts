import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, triangle } from "../batch-shared.js";
export type Input = Readonly<{
  readonly vertices: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly ninePointCircleCenter: readonly number[];
  readonly ninePointCircleRadius: number;
  readonly sideMidpoints: readonly (readonly number[])[];
}>;
const inputFields = [
  { id: "vertices", label: "Vertices", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const t = triangle(input.vertices);
  return {
    ninePointCircleCenter: t.circumcenter.map(
      (v, i) => (v + t.orthocenter[i]) / 2,
    ),
    ninePointCircleRadius: t.circumradius / 2,
    sideMidpoints: input.vertices.map((p, i) =>
      p.map((v, j) => (v + input.vertices[(i + 1) % 3][j]) / 2),
    ),
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
  ninePointCircleCenter: [1, 0.75],
  ninePointCircleRadius: 1.25,
  sideMidpoints: [
    [2, 0],
    [2, 1.5],
    [0, 1.5],
  ],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/nine-point-circle",
  title: "Nine Point Circle Calculator",
  description:
    "Construct nine-point circle and actual triangle side midpoints; center uses circumcenter/orthocenter and radius is half circumradius, not a generic circle from radius.",
  inputs: inputFields,
  outputs: [
    {
      id: "ninePointCircleCenter",
      label: "Nine point circle center",
      kind: "numberList",
    },
    {
      id: "ninePointCircleRadius",
      label: "Nine point circle radius",
      kind: "number",
    },
    { id: "sideMidpoints", label: "Side midpoints", kind: "matrix" },
  ],
  calculate: (value) =>
    calculate({ vertices: value.vertices as readonly (readonly number[])[] }),
});
export const run = tool.execute;
export default tool;
