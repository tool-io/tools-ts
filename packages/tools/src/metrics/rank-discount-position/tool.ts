import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ rank: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "rank", label: "Rank", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.rank, 1, 1000000000);
  return H.finish({ discount: 1 / Math.log2(i.rank + 1) });
};
export const example = {
  input: { rank: 3 },
  output: { result: { discount: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metrics/rank-discount-position",
  title: "Metrics: Rank Discount Position Tool",
  description:
    "Return a single DCG logarithmic position discount under one-based rank indexing; no relevance gains or ranking metric aggregation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { discount: { type: "number" } },
        required: ["discount"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
