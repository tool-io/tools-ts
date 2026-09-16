import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ records: readonly string[]; separator: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "records", kind: "stringList", label: "records" },
  { id: "separator", kind: "string", label: "separator" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.separator.length > 0 && i.records.every((s) => !s.includes(i.separator)),
  );
  return H.finish({ text: i.records.join(i.separator) });
};
export const example = {
  input: { records: ["a", "", "b"], separator: "|" },
  output: { result: { text: "a||b" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "table/record-separator-text-joiner",
  title: "Record Separator Text Joiner",
  description:
    "Join unescaped text records with a nonempty separator; separator occurrences in records are rejected for reversibility.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
