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
  H.check(H.unique(p.map((v) => v.id)).length === p.length);
  return H.finish({
    witnesses: p.flatMap((v) => {
      const a = H.ancestorChain(p, v.id);
      return a.cycle !== null ? [{ start: v.id, ...a }] : [];
    }),
  });
};
export const example = {
  input: {
    parentsJson:
      '[{"id": "a", "parent": null}, {"id": "b", "parent": "a"}, {"id": "c", "parent": "a"}, {"id": "d", "parent": "b"}]',
  },
  output: { result: { witnesses: [] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Parent Forest Cycle Witness",
      "tree data structures",
      "software development",
    ],
    collections: ["data", "learn"],
    fields: ["tree", "tree data structures", "software development"],
    keywords: ["tree data structures", "software development"],
  },
  id: "tree/parent-record-cycle-witness",
  title: "Parent Forest Cycle Witness",
  description:
    "Find explicit parent-pointer cycle witnesses in a unique-ID record bank; incomplete references terminate safely and are not invented cycles.",
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
          witnesses: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                chain: { type: "array", items: { type: "string" } },
                cycle: { anyOf: [{ type: "string" }, { type: "null" }] },
                missing: { anyOf: [{ type: "string" }, { type: "null" }] },
                start: { type: "string" },
              },
              required: ["chain", "cycle", "missing", "start"],
            },
          },
        },
        required: ["witnesses"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
