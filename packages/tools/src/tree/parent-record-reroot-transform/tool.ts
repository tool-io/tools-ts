import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ parentsJson: string; root: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "parentsJson", label: "parentsJson", kind: "string" },
  { id: "root", label: "root", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const p = H.parentRecords(i.parentsJson);
  H.forest(p);
  H.check(p.some((v) => v.id === i.root));
  const chain = H.ancestorChain(p, i.root).chain,
    map = new Map(p.map((v) => [v.id, v.parent]));
  chain.forEach((id, j) => map.set(id, j ? chain[j - 1] : null));
  return H.finish({
    parents: p.map((v) => ({ id: v.id, parent: map.get(v.id)! })),
  });
};
export const example = {
  input: {
    parentsJson:
      '[{"id": "a", "parent": null}, {"id": "b", "parent": "a"}, {"id": "c", "parent": "a"}, {"id": "d", "parent": "b"}]',
    root: "d",
  },
  output: {
    result: {
      parents: [
        { id: "a", parent: "b" },
        { id: "b", parent: "d" },
        { id: "c", parent: "a" },
        { id: "d", parent: null },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "tree/parent-record-reroot-transform",
  title: "Parent Tree Reroot Transform",
  description:
    "Explicit complete acyclic parent forests with exact unique string node IDs and null roots; reroot only the queried tree by reversing its old ancestor chain, preserving every off-path edge and other component.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
