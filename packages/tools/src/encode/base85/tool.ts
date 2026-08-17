import { utf8Encode } from "../../core/encoding.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

const ZERO_GROUP_CHAR = "z";
const BASE85_ALPHABET_START = 33; // "!"

export type Base85EncoderInput = {
  readonly text: string;
};

export type Base85EncoderOutput = {
  readonly encoded: string;
};

export const base85EncoderExample = {
  input: { text: "Hello, world!" },
  output: { encoded: "87cURD_*#TDfTZ)+T" },
} satisfies ToolExample<Base85EncoderInput, Base85EncoderOutput>;

/** Encodes UTF-8 bytes as Ascii85, emitting z for full zero groups. */
export const encodeAscii85 = (bytes: readonly number[]): string => {
  let output = "";
  for (let index = 0; index < bytes.length; index += 4) {
    const first = bytes[index]!;
    const second = bytes[index + 1];
    const third = bytes[index + 2];
    const fourth = bytes[index + 3];
    const value32 =
      ((first << 24) |
        ((second ?? 0) << 16) |
        ((third ?? 0) << 8) |
        (fourth ?? 0)) >>>
      0;
    if (value32 === 0 && fourth !== undefined) {
      output += ZERO_GROUP_CHAR;
      continue;
    }
    const present =
      fourth !== undefined ? 4 : third !== undefined ? 3 : second !== undefined ? 2 : 1;
    let remaining = value32;
    const chars: string[] = [];
    for (let position = 0; position < 5; position += 1) {
      chars.push(
        String.fromCharCode(BASE85_ALPHABET_START + (remaining % 85)),
      );
      remaining = Math.floor(remaining / 85);
    }
    output += chars.reverse().slice(0, present + 1).join("");
  }
  return output;
};

export const calculateBase85Encode = (
  input: Base85EncoderInput,
): Base85EncoderOutput => ({
  encoded: encodeAscii85(utf8Encode(input.text as string)),
});

export const base85EncoderTool = createSimpleTool({
  calculate: (input) =>
    calculateBase85Encode(input as unknown as Base85EncoderInput),
  description:
    "Encode UTF-8 text as Ascii85 (base85), using z for zero groups.",
  id: "encode/base85",
  inputs: [
    {
      description: "Text to encode.",
      id: "text",
      kind: "string",
      label: "Text",
    },
  ],
  outputs: [
    {
      description: "Ascii85 representation.",
      id: "encoded",
      kind: "string",
      label: "Base85",
    },
  ],
  title: "Base85 Encoder",
});
export const runBase85Encoder = base85EncoderTool.execute;
export default base85EncoderTool;
