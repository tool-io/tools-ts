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
  return H.finish({
    leaves: p.filter((v) => !p.some((x) => x.parent === v.id)).map((v) => v.id),
  });
};
export const example = {
  input: {
    parentsJson:
      '[{"id": "a", "parent": null}, {"id": "b", "parent": "a"}, {"id": "c", "parent": "a"}, {"id": "d", "parent": "b"}]',
  },
  output: { result: { leaves: ["c", "d"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Parent Forest Leaf Inventory",
      "tree data structures",
      "software development",
    ],
    collections: ["data", "learn"],
    fields: ["tree", "tree data structures", "software development"],
    keywords: ["tree data structures", "software development"],
  },
  id: "tree/parent-record-leaf-inventory",
  title: "Parent Forest Leaf Inventory",
  description:
    "Explicit complete acyclic parent forests with exact unique string node IDs and null roots; select nodes with no direct children, including isolated component roots.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { leaves: { type: "array", items: { type: "string" } } },
        required: ["leaves"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
