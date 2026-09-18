import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ token: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "token", label: "token", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({ value: H.sqlUnquote(i.token, "backtick") });
};
export const example = {
  input: { token: "`a``b`" },
  output: { result: { value: "a`b" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sql/backtick-identifier-parser",
  title: "SQL Backtick Identifier Parser",
  description:
    "Restricted SQL backtick quote parser using doubled closing quotes only; NUL rejects, no backslash mode, database execution or SQL-injection safety guarantee.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
