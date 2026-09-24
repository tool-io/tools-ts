import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  coordinate: readonly number[];
  shape: readonly number[];
  displacement: readonly number[];
  boundary: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "coordinate", label: "Coordinate", kind: "numberList" },
  { id: "shape", label: "Shape", kind: "numberList" },
  { id: "displacement", label: "Displacement", kind: "numberList" },
  {
    id: "boundary",
    label: "Boundary",
    kind: "string",
    enum: ["periodic", "reject"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.coordinate.length > 0 &&
      i.coordinate.length === i.shape.length &&
      i.coordinate.length === i.displacement.length,
  );
  i.shape.forEach((n, j) => {
    H.int(n, 1, 1000000);
    H.int(i.coordinate[j], 0, n - 1);
    H.int(i.displacement[j], -1000000, 1000000);
  });
  H.choice(i.boundary, ["periodic", "reject"]);
  const next = i.coordinate.map((x, j) => x + i.displacement[j]);
  return H.finish({
    neighbor: next.map((x, j) =>
      i.boundary === "periodic" ? H.mod(x, i.shape[j]) : x,
    ),
    inside: next.every((x, j) => x >= 0 && x < i.shape[j]),
    valid:
      i.boundary === "periodic" ||
      next.every((x, j) => x >= 0 && x < i.shape[j]),
  });
};
export const example = {
  input: {
    coordinate: [0, 1],
    shape: [3, 4],
    displacement: [-1, 0],
    boundary: "periodic",
  },
  output: { result: { neighbor: [2, 1], inside: false, valid: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "computational-physics/lattice-periodic-neighbor",
  title: "Computational Physics: Lattice Periodic Neighbor Tool",
  description:
    "Resolve one explicit integer lattice displacement under periodic or rejecting boundary rules, retaining whether the unwrapped neighbor was inside.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          inside: { type: "boolean" },
          neighbor: { type: "array", items: { type: "number" } },
          valid: { type: "boolean" },
        },
        required: ["inside", "neighbor", "valid"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
