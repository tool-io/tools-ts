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
    empty: r.flatMap((v, index) =>
      v.value === "" ? [{ name: v.name, index }] : [],
    ),
    whitespaceOnly: r.flatMap((v, index) =>
      v.value !== "" && v.value.trim() === "" ? [{ name: v.name, index }] : [],
    ),
  });
};
export const example = {
  input: {
    assignmentsJson:
      '[{"name":"A","value":"1"},{"name":"A","value":"2"},{"name":"B","value":""}]',
  },
  output: { result: { empty: [{ name: "B", index: 2 }], whitespaceOnly: [] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Environment Empty Value Audit",
      "environment variables",
      "software development",
    ],
    collections: ["encode-decode"],
    fields: ["env", "environment variables", "software development"],
    keywords: ["environment variables", "software development"],
  },
  id: "env/assignment-empty-value-audit",
  title: "Environment Empty Value Audit",
  description:
    "Distinguish empty from nonempty whitespace-only portable environment values, retaining source occurrences; does not conflate missing variables with present empty values.",
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
          empty: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                name: { type: "string" },
                index: { type: "number" },
              },
              required: ["name", "index"],
            },
          },
          whitespaceOnly: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                name: { type: "string" },
                index: { type: "number" },
              },
              required: ["name", "index"],
            },
          },
        },
        required: ["empty", "whitespaceOnly"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
