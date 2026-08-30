import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, triangle } from "../batch-shared.js";
export type Input = Readonly<{
  readonly vertices: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly originalTriangleArea: number;
  readonly outerNapoleonTriangleArea: number;
  readonly innerNapoleonTriangleArea: number;
}>;
const inputFields = [
  { id: "vertices", label: "Vertices", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const t = triangle(input.vertices),
    s = input.vertices.reduce((v, p, i) => {
      const q = input.vertices[(i + 1) % 3];
      return v + (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2;
    }, 0),
    base = s / (8 * Math.sqrt(3));
  return {
    originalTriangleArea: t.area,
    outerNapoleonTriangleArea: base + t.area / 2,
    innerNapoleonTriangleArea: Math.max(0, base - t.area / 2),
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
  originalTriangleArea: 6,
  outerNapoleonTriangleArea: 6.608439182435161,
  innerNapoleonTriangleArea: 0.6084391824351614,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/napoleon-triangle-area",
  title: "Napoleon Triangle Area Calculator",
  description:
    "Compute outer/inner Napoleon triangle areas from actual noncollinear planar vertices and erected equilateral-triangle centroids; inner construction may degenerate.",
  inputs: inputFields,
  outputs: [
    {
      id: "originalTriangleArea",
      label: "Original triangle area",
      kind: "number",
    },
    {
      id: "outerNapoleonTriangleArea",
      label: "Outer napoleon triangle area",
      kind: "number",
    },
    {
      id: "innerNapoleonTriangleArea",
      label: "Inner napoleon triangle area",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({ vertices: value.vertices as readonly (readonly number[])[] }),
});
export const run = tool.execute;
export default tool;
