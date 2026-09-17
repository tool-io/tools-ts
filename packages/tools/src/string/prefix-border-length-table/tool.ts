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
    lengths: Array.from(
      { length: i.text.length },
      (_, j) => H.borders(i.text.slice(0, j + 1)).at(-1) ?? 0,
    ),
  });
};
export const example = {
  input: { text: "ababa" },
  output: { result: { lengths: [0, 0, 1, 2, 3] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "string/prefix-border-length-table",
  title: "String Prefix Border Length Table",
  description:
    "Bounded UTF-16 string string prefix border length table; exact code-unit matching, no Unicode normalization or grapheme inference.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
