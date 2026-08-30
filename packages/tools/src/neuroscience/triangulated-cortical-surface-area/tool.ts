import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, norm } from "../shared.js";
export type Input = Readonly<{
  readonly verticesMm: readonly (readonly number[])[];
  readonly triangles: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly triangleAreasMm2: readonly number[];
  readonly totalAreaMm2: number;
}>;
const inputFields = [
  { id: "verticesMm", label: "Vertices mm", kind: "matrix" },
  { id: "triangles", label: "Triangles", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    input.verticesMm.length < 3 ||
    input.verticesMm.some((row) => row.length !== 3) ||
    !input.triangles.length
  )
    simpleError(
      "verticesMm",
      "Three-component vertices and nonempty triangle faces required.",
    );
  const seen = new Set<string>();
  const triangleAreasMm2 = input.triangles.map((row) => {
    if (
      row.length !== 3 ||
      new Set(row).size !== 3 ||
      row.some(
        (v) =>
          !Number.isSafeInteger(v) || v < 0 || v >= input.verticesMm.length,
      )
    )
      simpleError(
        "triangles",
        "Three distinct in-range vertex indexes per face required.",
      );
    const key = [...row].sort((a, b) => a - b).join(",");
    if (seen.has(key))
      simpleError("triangles", "Duplicate faces are not allowed.");
    seen.add(key);
    const [a, b, c] = row.map((i) => input.verticesMm[i]),
      u = b.map((v, i) => v - a[i]),
      v = c.map((x, i) => x - a[i]);
    return (
      norm([
        u[1] * v[2] - u[2] * v[1],
        u[2] * v[0] - u[0] * v[2],
        u[0] * v[1] - u[1] * v[0],
      ]) / 2
    );
  });
  return {
    triangleAreasMm2,
    totalAreaMm2: triangleAreasMm2.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  verticesMm: [
    [0, 0, 0],
    [2, 0, 0],
    [0, 3, 0],
  ],
  triangles: [[0, 1, 2]],
} satisfies Input;
export const exampleOutput = {
  triangleAreasMm2: [3],
  totalAreaMm2: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/triangulated-cortical-surface-area",
  title: "Cortical Surface Area",
  description:
    "Sum triangle areas of a supplied cortical mesh with duplicate-face and index auditing; millimetre coordinates yield square millimetres.",
  inputs: inputFields,
  outputs: [
    { id: "triangleAreasMm2", label: "Triangle areas mm2", kind: "numberList" },
    { id: "totalAreaMm2", label: "Total area mm2", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      verticesMm: value.verticesMm as readonly (readonly number[])[],
      triangles: value.triangles as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
