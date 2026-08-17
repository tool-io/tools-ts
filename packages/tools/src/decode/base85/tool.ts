import { utf8Decode } from "../../core/encoding.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const BASE85_ALPHABET_START = 33; // "!"
export const BASE85_ALPHABET_END = 117; // "u"
const ZERO_GROUP_CHAR = "z";
const PADDING_CHAR = "u";

export const base85DecoderExample = {
  input: { base85: "87cURD_*#TDfTZ)+T" },
  output: { text: "Hello, world!" },
} satisfies ToolExample<{ readonly base85: string }, { readonly text: string }>;

const isAscii85Char = (character: string): boolean => {
  const code = character.charCodeAt(0);
  return code >= BASE85_ALPHABET_START && code <= BASE85_ALPHABET_END;
};

/** Expands standalone zero groups and validates the Ascii85 alphabet. */
export const ascii85ToChars = (value: string, field: string): string[] => {
  const chars: string[] = [];
  let groupPosition = 0;
  for (const character of value) {
    if (character === ZERO_GROUP_CHAR) {
      if (groupPosition !== 0)
        simpleError(
          field,
          'The zero-group character "z" must stand alone in its group.',
          "z_misplaced",
        );
      chars.push("!", "!", "!", "!", "!");
      continue;
    }
    if (!isAscii85Char(character))
      simpleError(
        field,
        "Value contains characters outside the Ascii85 alphabet.",
        "alphabet_invalid",
      );
    chars.push(character);
    groupPosition = (groupPosition + 1) % 5;
  }
  return chars;
};

/** Decodes Ascii85 text into UTF-8 bytes. */
export const decodeAscii85Bytes = (
  value: string,
  field = "base85",
): number[] => {
  const chars = ascii85ToChars(value.trim(), field);
  if (chars.length % 5 === 1)
    simpleError(
      field,
      "An Ascii85 group cannot consist of a single character.",
      "length_invalid",
    );
  const bytes: number[] = [];
  for (let index = 0; index < chars.length; index += 5) {
    const group = chars.slice(index, index + 5);
    let value32 = 0;
    for (let position = 0; position < 5; position += 1) {
      const character =
        position < group.length ? group[position]! : PADDING_CHAR;
      value32 =
        value32 * 85 +
        (character.charCodeAt(0) - BASE85_ALPHABET_START);
    }
    if (group.length === 5 && value32 > 0xffffffff)
      simpleError(
        field,
        "A group encodes a value beyond 32 bits.",
        "group_overflow",
      );
    const emitted = group.length === 5 ? 4 : group.length - 1;
    // Partial groups may exceed 32 bits after u-padding; the >>> operators
    // below mask to 32 bits, which is the standard Ascii85 behavior.
    bytes.push(
      (value32 >>> 24) & 0xff,
      (value32 >>> 16) & 0xff,
      (value32 >>> 8) & 0xff,
      value32 & 0xff,
    );
    bytes.length -= 4 - emitted;
  }
  return bytes;
};

export const base85DecodeTool = createSimpleTool({
  calculate: (input) => {
    const bytes = decodeAscii85Bytes(String(input.base85 ?? ""));
    return { text: utf8Decode(bytes, "base85") };
  },
  description:
    "Decode Ascii85 (base85) text into its UTF-8 source text.",
  id: "decode/base85",
  inputs: [
    {
      description:
        "Ascii85 text; accepts the standalone zero-group character z.",
      id: "base85",
      kind: "string",
      label: "Base85",
    },
  ],
  outputs: [
    {
      description: "Decoded UTF-8 text.",
      id: "text",
      kind: "string",
      label: "Text",
    },
  ],
  title: "Base85 Decoder",
});
export const runBase85Decoder = base85DecodeTool.execute;
export default base85DecodeTool;
