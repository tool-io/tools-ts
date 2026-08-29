import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { encodeGradeOneBraille } from "../../braille/grade-one.js";

export const example = {
  input: { text: "Hi 123" },
  output: { braille: "⠠⠓⠊ ⠼⠁⠃⠉" },
} satisfies ToolExample<
  { readonly text: string },
  { readonly braille: string }
>;
export const tool = createSimpleTool({
  id: "encode/braille",
  title: "Grade 1 Braille Encoder",
  description:
    "Encode uncontracted English letters, ASCII digits, and common punctuation as Unicode Braille. Capital and numeric indicators are included; this is not contracted literary or language-specific Braille.",
  inputs: [{ id: "text", kind: "string", label: "Text" }],
  outputs: [{ id: "braille", kind: "string", label: "Braille" }],
  calculate: (input) => ({
    braille: encodeGradeOneBraille(input.text as string),
  }),
});
export type BrailleInput = Readonly<typeof example.input>;
export type BrailleOutput = Readonly<typeof example.output>;
export const brailleTool = tool;
export const runBraille = tool.execute;
export default tool;
