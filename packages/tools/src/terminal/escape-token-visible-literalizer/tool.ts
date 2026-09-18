import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ text: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "text", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    visible: i.text.replace(
      /[\u0000-\u001f\u007f]/g,
      (c) =>
        String.fromCharCode(92) +
        "x" +
        c.charCodeAt(0).toString(16).padStart(2, "0"),
    ),
  });
};
export const example = {
  input: { text: "a\u001b[31m" },
  output: { result: { visible: "a\\x1b[31m" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "terminal/escape-token-visible-literalizer",
  title: "Terminal Escape Token Visible Literalizer",
  description:
    "Literalize ASCII controls in terminal text to visible backslash-x hexadecimal spellings, preserving printable Unicode; output is diagnostic text, not a terminal sanitizer for other protocols.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
