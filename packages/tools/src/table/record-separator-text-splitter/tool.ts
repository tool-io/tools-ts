import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ text: string; separator: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", kind: "string", label: "text" },
  { id: "separator", kind: "string", label: "separator" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.separator.length > 0);
  const records = i.text.split(i.separator);
  H.check(records.length <= 128);
  return H.finish({ records });
};
export const example = {
  input: { text: "a||b|", separator: "|" },
  output: { result: { records: ["a", "", "b", ""] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "table/record-separator-text-splitter",
  title: "Record Separator Text Splitter",
  description:
    "Split literal nonempty record separators preserving empty text records; no quoting or escaping.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
