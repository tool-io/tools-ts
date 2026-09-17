import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ permutation: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "permutation", kind: "numberList", label: "permutation" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.permutation(i.permutation);
  return H.finish({
    breakpoints: i.permutation
      .slice(1)
      .flatMap((x, j) => (x !== i.permutation[j] + 1 ? [j + 1] : [])),
  });
};
export const example = {
  input: { permutation: [0, 2, 1, 3] },
  output: { result: { breakpoints: [1, 2, 3] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "order/rank-permutation-breakpoint-count",
  title: "Rank Permutation Breakpoint Count",
  description:
    "Count forward unit-adjacency breakpoints inside an explicit index permutation; endpoints are not padded with sentinel values.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
