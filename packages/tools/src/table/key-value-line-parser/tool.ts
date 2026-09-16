import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ line: string; delimiter: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "line", kind: "string", label: "line" },
  { id: "delimiter", kind: "string", label: "delimiter" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.delimiter.length > 0);
  const at = i.line.indexOf(i.delimiter);
  H.check(at >= 0);
  return H.finish({
    name: i.line.slice(0, at),
    value: i.line.slice(at + i.delimiter.length),
  });
};
export const example = {
  input: { line: "a=b=c", delimiter: "=" },
  output: { result: { name: "a", value: "b=c" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "table/key-value-line-parser",
  title: "Literal Key Value Line Parser",
  description:
    "Split one literal name-value line at its first caller delimiter; does not trim, unquote or interpret escapes.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
