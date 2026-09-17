import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  matrix: readonly (readonly number[])[];
  universe: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "matrix", kind: "matrix", label: "matrix" },
  { id: "universe", kind: "stringList", label: "universe" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    H.unique(i.universe).length === i.universe.length &&
      i.matrix.length === i.universe.length &&
      i.matrix.every(
        (r) =>
          r.length === i.universe.length && r.every((x) => x === 0 || x === 1),
      ),
  );
  return H.finish({
    pairs: i.matrix.flatMap((r, j) =>
      r.flatMap((x, k) => (x === 1 ? [[i.universe[j], i.universe[k]]] : [])),
    ),
  });
};
export const example = {
  input: {
    matrix: [
      [0, 1],
      [1, 0],
    ],
    universe: ["a", "b"],
  },
  output: {
    result: {
      pairs: [
        ["a", "b"],
        ["b", "a"],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "relation/membership-table-pair-list",
  title: "Finite Relation Membership Pair List",
  description:
    "Decode a square binary finite relation membership matrix into unique ordered pairs with explicit universe labels.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
