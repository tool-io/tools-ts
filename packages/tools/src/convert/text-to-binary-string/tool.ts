import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TextToBinaryStringInput = {
  readonly text: string;
};

export type TextToBinaryStringOutput = {
  readonly binary: string;
};

export const textToBinaryStringExample = {
  input: { text: "Hi" },
  output: { binary: "01001000 01101001" },
} satisfies ToolExample<TextToBinaryStringInput, TextToBinaryStringOutput>;

export const calculateTextToBinaryString = (
  input: TextToBinaryStringInput,
): TextToBinaryStringOutput => {
  if (input.text.length === 0)
    simpleError("text", "Text must not be empty.", "empty_text");
  const groups: string[] = [];
  for (let index = 0; index < input.text.length; index += 1) {
    const codeUnit = input.text.charCodeAt(index);
    if (codeUnit > 255)
      simpleError(
        "text",
        "Only Latin-1 characters are supported.",
        "unsupported_character",
      );
    groups.push(codeUnit.toString(2).padStart(8, "0"));
  }
  return { binary: groups.join(" ") };
};

export const textToBinaryStringTool = createSimpleTool({
  id: "convert/text-to-binary-string",
  title: "Text to Binary String Converter",
  description:
    "Convert Latin-1 text to space-separated 8-bit binary byte groups.",
  inputs: [{ id: "text", kind: "string", label: "Text" }],
  outputs: [{ id: "binary", kind: "string", label: "Binary" }],
  calculate: (input) =>
    calculateTextToBinaryString({ text: input.text as string }),
});

export const runTextToBinaryString = textToBinaryStringTool.execute;
export default textToBinaryStringTool;
