import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ parentsJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "parentsJson", label: "parentsJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const p = H.parentRecords(i.parentsJson);
  H.forest(p);
  return H.finish({
    levels: H.groups(p, (v) =>
      String(H.ancestorChain(p, v.id).chain.length - 1),
    )
      .map((g) => ({
        depth: Number(g.key),
        ids: g.indexes.map((j) => p[j].id),
      }))
      .sort((a, b) => a.depth - b.depth),
  });
};
export const example = {
  input: {
    parentsJson:
      '[{"id": "a", "parent": null}, {"id": "b", "parent": "a"}, {"id": "c", "parent": "a"}, {"id": "d", "parent": "b"}]',
  },
  output: {
    result: {
      levels: [
        { depth: 0, ids: ["a"] },
        { depth: 1, ids: ["b", "c"] },
        { depth: 2, ids: ["d"] },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "tree/parent-record-level-groups",
  title: "Parent Forest Level Groups",
  description:
    "Explicit complete acyclic parent forests with exact unique string node IDs and null roots; group all components by integer depth in ascending depth order with stable IDs within a level.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
