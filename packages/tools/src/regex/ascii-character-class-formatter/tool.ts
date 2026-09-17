import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ codes: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "codes", kind: "numberList", label: "codes" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  i.codes.forEach((x) => H.int(x, 0, 127));
  return H.finish({
    pattern:
      "[" +
      H.unique(i.codes)
        .sort((a, b) => a - b)
        .map(H.classEscape)
        .join("") +
      "]",
  });
};
export const example = {
  input: { codes: [65, 45, 65] },
  output: { result: { pattern: "[\\x2d\\x41]" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "regex/ascii-character-class-formatter",
  title: "ASCII Character Class Formatter",
  description:
    "Format a positive ASCII character class using explicit two-digit hexadecimal escapes, avoiding metacharacter ambiguity.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
