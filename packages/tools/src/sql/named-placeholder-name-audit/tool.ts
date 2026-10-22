import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ names: readonly string[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "names", label: "names", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  return H.finish({
    invalid: i.names.flatMap((name, index) =>
      /^[A-Za-z_][A-Za-z0-9_]*(?![\s\S])/.test(name) ? [] : [{ index, name }],
    ),
    repeated: H.duplicates(i.names, (x) => x),
  });
};
export const example = {
  input: { names: ["x", "x", "2x"] },
  output: {
    result: {
      invalid: [{ index: 2, name: "2x" }],
      repeated: [{ key: "x", indexes: [0, 1] }],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "SQL Named Placeholder Name Audit",
      "SQL",
      "database development",
    ],
    collections: ["encode-decode"],
    fields: ["SQL", "database development"],
    keywords: ["SQL", "database development"],
  },
  id: "sql/named-placeholder-name-audit",
  title: "SQL Named Placeholder Name Audit",
  description:
    "Audit already-extracted SQL named placeholder identifiers under a portable ASCII grammar and exact duplicate policy; no SQL lexical discovery or dialect claim.",
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
          invalid: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                index: { type: "number" },
                name: { type: "string" },
              },
              required: ["index", "name"],
            },
          },
          repeated: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                key: { type: "string" },
                indexes: { type: "array", items: { type: "number" } },
              },
              required: ["key", "indexes"],
            },
          },
        },
        required: ["invalid", "repeated"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
