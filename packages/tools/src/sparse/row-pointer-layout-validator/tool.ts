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
    valid: true,
    entries: i.values.length,
    emptyMajorIndexes: i.pointers
      .slice(0, -1)
      .flatMap((x, j) => (x === i.pointers[j + 1] ? [j] : [])),
  });
};
export const example = {
  input: { pointers: [0, 0, 1], indexes: [1], values: [2], major: 2, minor: 2 },
  output: { result: { valid: true, entries: 1, emptyMajorIndexes: [0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sparse/row-pointer-layout-validator",
  title: "Sparse Row Pointer Layout Validator",
  description:
    "Validate CSR pointer arity, monotonicity, final entry count and minor bounds; duplicates/unsorted minor indexes remain legal observations.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
