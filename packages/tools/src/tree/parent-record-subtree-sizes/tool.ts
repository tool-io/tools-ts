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
    sizes: p.map((v) => ({
      id: v.id,
      size: H.descendants(p, v.id).length + 1,
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
      sizes: [
        { id: "a", size: 4 },
        { id: "b", size: 2 },
        { id: "c", size: 1 },
        { id: "d", size: 1 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "tree/parent-record-subtree-sizes",
  title: "Parent Forest Subtree Sizes",
  description:
    "Explicit complete acyclic parent forests with exact unique string node IDs and null roots; count each subtree including its root, preserving source node order.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
