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
  return H.finish({ count: H.unique(H.rotations(i.text)).length });
};
export const example = {
  input: { text: "abab" },
  output: { result: { count: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "string/cyclic-string-distinct-rotation-count",
  title: "Distinct String Rotation Count",
  description:
    "Bounded UTF-16 string distinct string rotation count; exact code-unit matching, no Unicode normalization or grapheme inference.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
