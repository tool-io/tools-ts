import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ records: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "records", kind: "stringList", label: "records" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    encoded: i.records.map((s) => s.length + ":" + s).join(""),
  });
};
export const example = {
  input: { records: ["a:b", ""] },
  output: { result: { encoded: "3:a:b0:" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "table/length-prefixed-text-record-encoder",
  title: "Length Prefixed Text Record Encoder",
  description:
    "Encode concatenated decimal-length-prefixed text records using UTF-16 code-unit lengths, not UTF-8 bytes.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
