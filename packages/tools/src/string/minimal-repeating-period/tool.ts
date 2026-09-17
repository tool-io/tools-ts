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
  return H.finish({ period: H.period(i.text) });
};
export const example = {
  input: { text: "ababab" },
  output: { result: { period: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "string/minimal-repeating-period",
  title: "Minimal Repeating String Period",
  description:
    "Bounded UTF-16 string minimal repeating string period; exact code-unit matching, no Unicode normalization or grapheme inference.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
