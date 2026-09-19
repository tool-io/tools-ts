import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ parentsJson: string; id: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "parentsJson", label: "parentsJson", kind: "string" },
  { id: "id", label: "id", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const p = H.parentRecords(i.parentsJson);
  H.forest(p);
  H.check(p.some((v) => v.id === i.id));
  return H.finish({ ancestors: H.ancestorChain(p, i.id).chain.slice(1) });
};
export const example = {
  input: {
    parentsJson:
      '[{"id": "a", "parent": null}, {"id": "b", "parent": "a"}, {"id": "c", "parent": "a"}, {"id": "d", "parent": "b"}]',
    id: "d",
  },
  output: { result: { ancestors: ["b", "a"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "tree/parent-record-ancestor-chain",
  title: "Parent Forest Ancestor Chain",
  description:
    "Explicit complete acyclic parent forests with exact unique string node IDs and null roots; return strict ancestors nearest-first, excluding the query node; unknown IDs reject.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
