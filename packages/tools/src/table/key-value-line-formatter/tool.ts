import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  name: string;
  value: string;
  delimiter: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "name", kind: "string", label: "name" },
  { id: "value", kind: "string", label: "value" },
  { id: "delimiter", kind: "string", label: "delimiter" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.delimiter.length > 0 && !i.name.includes(i.delimiter));
  return H.finish({ line: i.name + i.delimiter + i.value });
};
export const example = {
  input: { name: "a", value: "b=c", delimiter: "=" },
  output: { result: { line: "a=b=c" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "table/key-value-line-formatter",
  title: "Literal Key Value Line Formatter",
  description:
    "Format a literal name-value line while rejecting delimiters inside its name to retain first-split reversibility.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
