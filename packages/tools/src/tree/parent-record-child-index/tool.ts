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
    children: p.map((v) => ({
      id: v.id,
      children: p.filter((x) => x.parent === v.id).map((x) => x.id),
    })),
  });
};
export const example = {
  input: {
    parentsJson:
      '[{"id": "a", "parent": null}, {"id": "b", "parent": "a"}, {"id": "c", "parent": "a"}, {"id": "d", "parent": "b"}]',
  },
  output: {
    result: {
      children: [
        { id: "a", children: ["b", "c"] },
        { id: "b", children: ["d"] },
        { id: "c", children: [] },
        { id: "d", children: [] },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "tree/parent-record-child-index",
  title: "Parent Forest Child Index",
  description:
    "Explicit complete acyclic parent forests with exact unique string node IDs and null roots; index every node\u2019s direct children in source order, retaining leaf nodes with empty lists.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
