import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  parentsJson: string;
  left: string;
  right: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "parentsJson", label: "parentsJson", kind: "string" },
  { id: "left", label: "left", kind: "string" },
  { id: "right", label: "right", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const p = H.parentRecords(i.parentsJson);
  H.forest(p);
  H.check(p.some((v) => v.id === i.left) && p.some((v) => v.id === i.right));
  const a = H.ancestorChain(p, i.left).chain,
    b = H.ancestorChain(p, i.right).chain,
    common = a.find((x) => b.includes(x)) ?? null;
  return H.finish({ ancestor: common });
};
export const example = {
  input: {
    parentsJson:
      '[{"id": "a", "parent": null}, {"id": "b", "parent": "a"}, {"id": "c", "parent": "a"}, {"id": "d", "parent": "b"}]',
    left: "d",
    right: "c",
  },
  output: { result: { ancestor: "a" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "tree/parent-record-lowest-common-ancestor",
  title: "Parent Forest Lowest Common Ancestor",
  description:
    "Explicit complete acyclic parent forests with exact unique string node IDs and null roots; find the lowest common ancestor including self; different components return null, not a fabricated shared root.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
