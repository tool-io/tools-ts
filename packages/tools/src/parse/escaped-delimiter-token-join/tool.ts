import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ tokens: readonly string[]; delimiter: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "tokens", kind: "stringList", label: "tokens" },
  { id: "delimiter", kind: "string", label: "delimiter" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    text: i.tokens.map((s) => H.escapeCell(s, i.delimiter)).join(i.delimiter),
  });
};
export const example = {
  input: { tokens: ["a,b", "c"], delimiter: "," },
  output: { result: { text: "a\\,b,c" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parse/escaped-delimiter-token-join",
  title: "Escaped Delimiter Token Joiner",
  description:
    "Split or join an explicit backslash-escaped single-character delimiter dialect with control escapes; not CSV, shell or programming-language syntax.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
