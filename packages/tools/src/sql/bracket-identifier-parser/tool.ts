import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ token: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "token", label: "token", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  return H.finish({ value: H.sqlUnquote(i.token, "bracket") });
};
export const example = {
  input: { token: "[a]]b]" },
  output: { result: { value: "a]b" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["SQL Bracket Identifier Parser", "SQL", "database development"],
    collections: ["encode-decode"],
    fields: ["SQL", "database development"],
    keywords: ["SQL", "database development"],
  },
  id: "sql/bracket-identifier-parser",
  title: "SQL Bracket Identifier Parser",
  description:
    "Restricted SQL bracket quote parser using doubled closing quotes only; NUL rejects, no backslash mode, database execution or SQL-injection safety guarantee.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "string" } },
        required: ["value"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
