import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ value: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "value", label: "value", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({ token: H.sqlQuote(i.value, "double") });
};
export const example = {
  input: { value: 'a"b' },
  output: { result: { token: '"a""b"' } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sql/double-quote-identifier-formatter",
  title: "SQL Double Quote Identifier Formatter",
  description:
    "Restricted SQL double quote formatter using doubled closing quotes only; NUL rejects, no backslash mode, database execution or SQL-injection safety guarantee.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
