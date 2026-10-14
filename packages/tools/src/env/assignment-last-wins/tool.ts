import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ assignmentsJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "assignmentsJson", label: "assignmentsJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = H.assignments(i.assignmentsJson);
  return H.finish({
    assignments: H.groups(r, (v) => v.name).map((g) => {
      const index = g.indexes.at(-1)!;
      return { ...r[index], index };
    }),
  });
};
export const example = {
  input: {
    assignmentsJson:
      '[{"name":"A","value":"1"},{"name":"A","value":"2"},{"name":"B","value":""}]',
  },
  output: {
    result: {
      assignments: [
        { name: "A", value: "2", index: 1 },
        { name: "B", value: "", index: 2 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Environment Assignment Last Wins",
      "environment variables",
      "software development",
    ],
    collections: ["encode-decode"],
    fields: ["env", "environment variables", "software development"],
    keywords: ["environment variables", "software development"],
  },
  id: "env/assignment-last-wins",
  title: "Environment Assignment Last Wins",
  description:
    "Resolve explicit case-sensitive portable environment assignment occurrences under last-wins policy with source indexes; no shell execution or expansion.",
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
          assignments: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                name: { type: "string" },
                value: { type: "string" },
                index: { type: "number" },
              },
              required: ["name", "value", "index"],
            },
          },
        },
        required: ["assignments"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
