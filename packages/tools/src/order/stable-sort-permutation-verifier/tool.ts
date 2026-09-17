import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  values: readonly number[];
  permutation: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "values", kind: "numberList", label: "values" },
  { id: "permutation", kind: "numberList", label: "permutation" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.permutation(i.permutation);
  H.check(i.values.length === i.permutation.length);
  return H.finish({
    valid: i.permutation.every((x, j) => x === H.sortedIndexes(i.values)[j]),
  });
};
export const example = {
  input: { values: [30, 10, 10, 20], permutation: [2, 1, 3, 0] },
  output: { result: { valid: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "order/stable-sort-permutation-verifier",
  title: "Stable Sort Permutation Verifier",
  description:
    "Verify an explicit complete output-to-input sort permutation against stable ascending numeric argsort, rather than silently producing a replacement.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
