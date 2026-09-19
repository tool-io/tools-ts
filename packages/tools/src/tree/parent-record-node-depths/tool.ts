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
    depths: p.map((v) => ({
      id: v.id,
      depth: H.ancestorChain(p, v.id).chain.length - 1,
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
      depths: [
        { id: "a", depth: 0 },
        { id: "b", depth: 1 },
        { id: "c", depth: 1 },
        { id: "d", depth: 2 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "tree/parent-record-node-depths",
  title: "Parent Forest Node Depths",
  description:
    "Explicit complete acyclic parent forests with exact unique string node IDs and null roots; compute edge depth from each component root without equating different roots.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
