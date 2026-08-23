import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { utf8Encode } from "../../core/encoding.js";

export type TextToHexAsciiInput = {
  readonly text: string;
};

export type TextToHexAsciiOutput = {
  readonly hex: string;
};

export const calculateTextToHexAscii = (
  input: TextToHexAsciiInput,
): TextToHexAsciiOutput => {
  const bytes = utf8Encode(input.text);
  if (bytes.length === 0)
    simpleError("text", "Provide at least one character.", "empty_text");
  return {
    hex: bytes.map((byte) => byte.toString(16).padStart(2, "0")).join(" "),
  };
};

export const textToHexAsciiTool = createSimpleTool({
  id: "convert/text-to-hex-ascii",
  title: "Text to Hex ASCII Converter",
  description:
    "Convert text into space-separated hexadecimal ASCII byte values using UTF-8.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [{ id: "hex", label: "Hex bytes", kind: "string" }],
  calculate: (input) => calculateTextToHexAscii({ text: input.text as string }),
});
export const runTextToHexAscii = textToHexAsciiTool.execute;
export default textToHexAsciiTool;

export const textToHexAsciiExample = {
  input: {
    text: "example",
  },
  output: {
    hex: "65 78 61 6d 70 6c 65",
  },
} satisfies ToolExample<TextToHexAsciiInput, TextToHexAsciiOutput>;
