import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ pattern: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "pattern", kind: "string", label: "pattern" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({ codes: H.asciiClass(i.pattern) });
};
export const example = {
  input: { pattern: "[a-c\\x2d]" },
  output: { result: { codes: [45, 97, 98, 99] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "regex/ascii-character-class-parser",
  title: "ASCII Character Class Parser",
  description:
    "Parse bounded ASCII bracket classes with literal characters, ordered ranges and \\xHH escapes only; complements are relative to 0\u2013127.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
