import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ text: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", kind: "string", label: "text" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.text.length <= 128);
  return H.finish({
    indexes: i.text
      .split("")
      .flatMap((_, j) =>
        H.palindrome(i.text.slice(0, j) + i.text.slice(j + 1)) ? [j] : [],
      ),
  });
};
export const example = {
  input: { text: "abca" },
  output: { result: { indexes: [1, 2] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "string/palindrome-single-deletion-indexes",
  title: "Palindrome Single Deletion Indexes",
  description:
    "Bounded UTF-16 string palindrome single deletion indexes; exact code-unit matching, no Unicode normalization or grapheme inference.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
