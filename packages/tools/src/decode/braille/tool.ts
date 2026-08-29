import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { decodeGradeOneBraille } from "../../braille/grade-one.js";

export const example = {
  input: { braille: "⠠⠓⠊ ⠼⠁⠃⠉" },
  output: { text: "Hi 123" },
} satisfies ToolExample<
  { readonly braille: string },
  { readonly text: string }
>;
export const tool = createSimpleTool({
  id: "decode/braille",
  title: "Grade 1 Braille Decoder",
  description:
    "Decode uncontracted English Unicode Braille letters, digits, and common punctuation. Numeric and capital indicators are interpreted; contracted Braille is not supported.",
  inputs: [{ id: "braille", kind: "string", label: "Braille" }],
  outputs: [{ id: "text", kind: "string", label: "Text" }],
  calculate: (input) => ({
    text: decodeGradeOneBraille(input.braille as string),
  }),
});
export type BrailleInput = Readonly<typeof example.input>;
export type BrailleOutput = Readonly<typeof example.output>;
export const brailleTool = tool;
export const runBraille = tool.execute;
export default tool;
