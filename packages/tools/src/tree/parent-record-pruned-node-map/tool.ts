import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  parentsJson: string;
  remove: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "parentsJson", label: "parentsJson", kind: "string" },
  { id: "remove", label: "remove", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const p = H.parentRecords(i.parentsJson);
  H.forest(p);
  H.check(i.remove.every((x) => p.some((v) => v.id === x)));
  const removed = new Set(
    i.remove.flatMap((id) => [id, ...H.descendants(p, id)]),
  );
  return H.finish({
    parents: p.filter((v) => !removed.has(v.id)),
    removed: p.filter((v) => removed.has(v.id)).map((v) => v.id),
  });
};
export const example = {
  input: {
    parentsJson:
      '[{"id": "a", "parent": null}, {"id": "b", "parent": "a"}, {"id": "c", "parent": "a"}, {"id": "d", "parent": "b"}]',
    remove: ["b"],
  },
  output: {
    result: {
      parents: [
        { id: "a", parent: null },
        { id: "c", parent: "a" },
      ],
      removed: ["b", "d"],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "tree/parent-record-pruned-node-map",
  title: "Parent Forest Pruned Node Map",
  description:
    "Explicit complete acyclic parent forests with exact unique string node IDs and null roots; prune selected nodes and their entire descendant subtrees, retaining untouched source order and explicit removed identities.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
