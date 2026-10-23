import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ parentsJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "parentsJson", label: "parentsJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const p = H.parentRecords(i.parentsJson);
  H.forest(p);
  return H.finish({ order: H.treeOrder(p, true) });
};
export const example = {
  input: {
    parentsJson:
      '[{"id": "a", "parent": null}, {"id": "b", "parent": "a"}, {"id": "c", "parent": "a"}, {"id": "d", "parent": "b"}]',
  },
  output: { result: { order: ["d", "b", "c", "a"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Parent Forest Postorder Index",
      "tree data structures",
      "software development",
    ],
    collections: ["data", "learn"],
    fields: ["tree", "tree data structures", "software development"],
    keywords: ["tree data structures", "software development"],
  },
  id: "tree/parent-record-postorder-index",
  title: "Parent Forest Postorder Index",
  description:
    "Explicit complete acyclic parent forests with exact unique string node IDs and null roots; produce stable postorder traversal, with roots and child order determined by input record order.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { order: { type: "array", items: { type: "string" } } },
        required: ["order"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
