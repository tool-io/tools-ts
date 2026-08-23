import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { utf8Encode } from "../../core/encoding.js";
const toHex = (byte: number): string => byte.toString(16).padStart(2, "0");

export type AsciiHexEncodeInput = {
  readonly text: string;
};

export type AsciiHexEncodeOutput = {
  readonly hex: string;
};

export const calculateAsciiHexEncode = (
  input: AsciiHexEncodeInput,
): AsciiHexEncodeOutput => {
  const bytes = utf8Encode(input.text);
  if (bytes.length === 0)
    simpleError("text", "Provide at least one character.", "empty_text");
  return { hex: bytes.map(toHex).join("") };
};

export const asciiHexEncodeTool = createSimpleTool({
  id: "convert/ascii-hex-encode",
  title: "ASCII Hex Encoder",
  description:
    "Encode text into a continuous lowercase hexadecimal byte string using UTF-8.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [{ id: "hex", label: "Hex", kind: "string" }],
  calculate: (input) => calculateAsciiHexEncode({ text: input.text as string }),
});
export const runAsciiHexEncode = asciiHexEncodeTool.execute;
export default asciiHexEncodeTool;

export const asciiHexEncodeExample = {
  input: {
    text: "example",
  },
  output: {
    hex: "6578616d706c65",
  },
} satisfies ToolExample<AsciiHexEncodeInput, AsciiHexEncodeOutput>;
