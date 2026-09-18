import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  pointers: readonly number[];
  indexes: readonly number[];
  values: readonly number[];
  major: number;
  minor: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "pointers", label: "pointers", kind: "numberList" },
  { id: "indexes", label: "indexes", kind: "numberList" },
  { id: "values", label: "values", kind: "numberList" },
  { id: "major", label: "major", kind: "integer" },
  { id: "minor", label: "minor", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.compressed(i.pointers, i.indexes, i.values, i.major, i.minor);
  return H.finish({
    triplets: i.pointers.slice(0, -1).flatMap((start, j) =>
      Array.from({ length: i.pointers[j + 1] - start }, (_, k) => ({
        row: i.indexes[start + k],
        column: j,
        value: i.values[start + k],
      })),
    ),
  });
};
export const example = {
  input: {
    pointers: [0, 2, 3],
    indexes: [1, 1, 0],
    values: [2, 3, 0],
    major: 2,
    minor: 2,
  },
  output: {
    result: {
      triplets: [
        { row: 1, column: 0, value: 2 },
        { row: 1, column: 0, value: 3 },
        { row: 0, column: 1, value: 0 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sparse/column-pointer-triplet-expander",
  title: "Sparse Column Pointer Triplet Expander",
  description:
    "Expand validated CSC compressed pointer arrays to occurrence-preserving COO records with explicit dimensions; duplicate entries and zeros remain.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
