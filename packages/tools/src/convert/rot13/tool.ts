import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { rotateLatinText } from "../caesar-cipher/tool.js";

export const applyRot13 = (text: string): string | null =>
  rotateLatinText(text, 13);

export const rot13Example = {
  input: { text: "Tool.io is awesome!" },
  output: { text: "Gbby.vb vf njrfbzr!" },
} satisfies ToolExample<{ readonly text: string }, { readonly text: string }>;

export const rot13Tool = createSimpleTool({
  id: "convert/rot13",
  title: "ROT13 Converter",
  description:
    "Apply the reversible ROT13 substitution to English letters while preserving case and other characters.",
  inputs: [{ id: "text", kind: "string", label: "Text" }],
  outputs: [{ id: "text", kind: "string", label: "ROT13 text" }],
  calculate: (input) => {
    const text = applyRot13(input.text as string);
    if (text === null) simpleError("text", "Enter nonempty text.");
    return { text };
  },
});

export const runRot13 = rot13Tool.execute;
export default rot13Tool;
