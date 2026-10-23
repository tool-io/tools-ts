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
  discovery: {
    aliases: [
      "Parent Forest Node Depths",
      "tree data structures",
      "software development",
    ],
    collections: ["data", "learn"],
    fields: ["tree", "tree data structures", "software development"],
    keywords: ["tree data structures", "software development"],
  },
  id: "tree/parent-record-node-depths",
  title: "Parent Forest Node Depths",
  description:
    "Explicit complete acyclic parent forests with exact unique string node IDs and null roots; compute edge depth from each component root without equating different roots.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          depths: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: { id: { type: "string" }, depth: { type: "number" } },
              required: ["id", "depth"],
            },
          },
        },
        required: ["depths"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
