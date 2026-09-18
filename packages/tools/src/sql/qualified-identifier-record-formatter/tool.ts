import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ parts: readonly string[]; style: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "parts", label: "parts", kind: "stringList" },
  { id: "style", label: "style", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.parts.length > 0 && i.parts.every((s) => s.length > 0));
  H.check(["double", "backtick", "bracket"].includes(i.style));
  return H.finish({
    identifier: i.parts.map((s) => H.sqlQuote(s, i.style)).join("."),
  });
};
export const example = {
  input: { parts: ["a", "b.c"], style: "double" },
  output: { result: { identifier: '"a"."b.c"' } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sql/qualified-identifier-record-formatter",
  title: "SQL Qualified Identifier Record Formatter",
  description:
    "Format separately quoted qualified SQL identifier components; literal dots inside components remain data, not qualification, and no schema lookup is performed.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
