import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ values: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "values", kind: "numberList", label: "values" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const blocks = H.rankBlocks(i.values),
    ranks = i.values.map(() => 0);
  blocks.forEach((b, j) =>
    b.indexes.forEach((x, k) => (ranks[x] = (b.start + b.end + 1) / 2)),
  );
  return H.finish({ ranks });
};
export const example = {
  input: { values: [30, 10, 10, 20] },
  output: { result: { ranks: [4, 1.5, 1.5, 3] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "order/fractional-rank-tie-table",
  title: "Fractional Rank Tie Table",
  description:
    "Assign one-based ascending fractional average numeric ranks; exact numeric ties are preserved according to the stated policy.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
