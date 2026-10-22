import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ index: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "index", label: "index", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.index, 1, 1e6);
  return H.finish({ token: "$" + i.index });
};
export const example = {
  input: { index: 3 },
  output: { result: { token: "$3" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "SQL Numbered Placeholder Formatter",
      "SQL",
      "database development",
    ],
    collections: ["encode-decode"],
    fields: ["SQL", "database development"],
    keywords: ["SQL", "database development"],
  },
  id: "sql/numbered-placeholder-formatter",
  title: "SQL Numbered Placeholder Formatter",
  description:
    "Format a positive PostgreSQL-style numbered SQL placeholder token; no binding, query parsing or database access.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string" } },
        required: ["token"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
