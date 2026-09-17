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
  return H.finish({ blocks: H.rankBlocks(i.values) });
};
export const example = {
  input: { values: [30, 10, 10, 20] },
  output: {
    result: {
      blocks: [
        { value: 10, indexes: [1, 2], start: 0, end: 2 },
        { value: 20, indexes: [3], start: 2, end: 3 },
        { value: 30, indexes: [0], start: 3, end: 4 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "order/rank-tie-block-inventory",
  title: "Rank Tie Block Inventory",
  description:
    "Inventory exact numeric tie blocks in a stable ascending sort with original indexes and zero-based half-open sorted positions.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
