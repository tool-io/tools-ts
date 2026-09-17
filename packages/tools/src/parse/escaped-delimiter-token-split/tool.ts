import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ text: string; delimiter: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", kind: "string", label: "text" },
  { id: "delimiter", kind: "string", label: "delimiter" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({ tokens: H.splitEscaped(i.text, i.delimiter) });
};
export const example = {
  input: { text: "a\\,b,c", delimiter: "," },
  output: { result: { tokens: ["a,b", "c"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parse/escaped-delimiter-token-split",
  title: "Escaped Delimiter Token Splitter",
  description:
    "Split or join an explicit backslash-escaped single-character delimiter dialect with control escapes; not CSV, shell or programming-language syntax.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
