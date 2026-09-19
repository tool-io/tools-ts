import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  parentsJson: string;
  selected: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "parentsJson", label: "parentsJson", kind: "string" },
  { id: "selected", label: "selected", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const p = H.parentRecords(i.parentsJson);
  H.forest(p);
  H.check(
    H.unique(i.selected).length === i.selected.length &&
      i.selected.every((x) => p.some((v) => v.id === x)),
  );
  return H.finish({
    parents: p
      .filter((v) => i.selected.includes(v.id))
      .map((v) => ({
        id: v.id,
        parent:
          H.ancestorChain(p, v.id)
            .chain.slice(1)
            .find((x) => i.selected.includes(x)) ?? null,
      })),
  });
};
export const example = {
  input: {
    parentsJson:
      '[{"id": "a", "parent": null}, {"id": "b", "parent": "a"}, {"id": "c", "parent": "a"}, {"id": "d", "parent": "b"}]',
    selected: ["a", "d"],
  },
  output: {
    result: {
      parents: [
        { id: "a", parent: null },
        { id: "d", parent: "a" },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "tree/parent-record-collapse-ancestors",
  title: "Parent Forest Selected Node Ancestor Collapse",
  description:
    "Explicit complete acyclic parent forests with exact unique string node IDs and null roots; retain only caller-selected nodes, connecting each to its nearest retained ancestor or null root; no invented IDs or edge paths.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
