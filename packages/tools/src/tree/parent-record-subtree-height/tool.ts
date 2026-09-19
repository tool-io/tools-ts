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
    heights: p.map((v) => ({
      id: v.id,
      height: Math.max(
        0,
        ...H.descendants(p, v.id).map((id) =>
          H.ancestorChain(p, id).chain.indexOf(v.id),
        ),
      ),
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
      heights: [
        { id: "a", height: 2 },
        { id: "b", height: 1 },
        { id: "c", height: 0 },
        { id: "d", height: 0 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "tree/parent-record-subtree-height",
  title: "Parent Forest Subtree Height",
  description:
    "Explicit complete acyclic parent forests with exact unique string node IDs and null roots; compute longest descendant edge distance for every subtree; leaves have zero height.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
