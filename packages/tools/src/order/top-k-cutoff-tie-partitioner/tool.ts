import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ values: readonly number[]; k: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "values", kind: "numberList", label: "values" },
  { id: "k", kind: "integer", label: "k" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.k, 0, i.values.length);
  const sorted = [...i.values].sort((a, b) => b - a),
    cutoff = i.k ? sorted[i.k - 1] : null;
  return H.finish({
    cutoff,
    strict: i.values.flatMap((x, j) =>
      cutoff !== null && x > cutoff ? [j] : [],
    ),
    ties: i.values.flatMap((x, j) => (x === cutoff ? [j] : [])),
    neededFromTies:
      i.k - (cutoff === null ? 0 : i.values.filter((x) => x > cutoff).length),
  });
};
export const example = {
  input: { values: [3, 2, 2, 1], k: 2 },
  output: {
    result: { cutoff: 2, strict: [0], ties: [1, 2], neededFromTies: 1 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "order/top-k-cutoff-tie-partitioner",
  title: "Top K Cutoff Tie Partitioner",
  description:
    "Partition a numeric top-K cutoff into strict selections and all tied candidates, reporting how many ties are needed without arbitrarily breaking them.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
