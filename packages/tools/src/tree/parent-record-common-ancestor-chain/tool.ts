import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ parentsJson: string; ids: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "parentsJson", label: "parentsJson", kind: "string" },
  { id: "ids", label: "ids", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const p = H.parentRecords(i.parentsJson);
  H.forest(p);
  H.check(i.ids.every((x) => p.some((v) => v.id === x)));
  const chains = i.ids.map((id) => H.ancestorChain(p, id).chain);
  return H.finish({
    ancestors: chains.length
      ? chains[0].filter((x) => chains.every((c) => c.includes(x)))
      : [],
  });
};
export const example = {
  input: {
    parentsJson:
      '[{"id": "a", "parent": null}, {"id": "b", "parent": "a"}, {"id": "c", "parent": "a"}, {"id": "d", "parent": "b"}]',
    ids: ["b", "d"],
  },
  output: { result: { ancestors: ["b", "a"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "tree/parent-record-common-ancestor-chain",
  title: "Parent Forest Common Ancestor Chain",
  description:
    "Explicit complete acyclic parent forests with exact unique string node IDs and null roots; intersect inclusive ancestor chains for an explicit node set in nearest-first order from its first node; empty query has empty common evidence.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
