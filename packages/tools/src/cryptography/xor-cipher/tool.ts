import type { ToolExample } from "../../core/example.js";
import { utf8Encode } from "../../core/encoding.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type XorCipherInput = {
  readonly keyCharacter: string;
  readonly text: string;
};

export type XorCipherOutput = {
  readonly encodedHex: string;
};

export const encodeXorHex = (text: string, keyCharacter: string): string =>
  utf8Encode(text)
    .map((byte) =>
      (byte ^ keyCharacter.charCodeAt(0))
        .toString(16)
        .toUpperCase()
        .padStart(2, "0"),
    )
    .join("");

export const xorCipherExample = {
  input: { keyCharacter: "K", text: "Hello" },
  output: { encodedHex: "032E272724" },
} satisfies ToolExample<XorCipherInput, XorCipherOutput>;

export const xorCipherTool = createSimpleTool({
  id: "cryptography/xor-cipher",
  title: "XOR Cipher Encoder",
  description:
    "XOR every UTF-8 byte of the text against one ASCII key byte and return two uppercase hexadecimal digits per output byte. This is an encoding demonstration, not secure encryption.",
  inputs: [
    { id: "text", kind: "string", label: "Text" },
    { id: "keyCharacter", kind: "string", label: "Key character" },
  ],
  outputs: [{ id: "encodedHex", kind: "string", label: "Encoded hex" }],
  calculate: (input) => {
    const keyCharacter = input.keyCharacter as string;
    if (keyCharacter.length !== 1 || keyCharacter.charCodeAt(0) > 0x7f)
      simpleError(
        "keyCharacter",
        "Key must be exactly one ASCII character.",
        "invalid_key",
      );
    return {
      encodedHex: encodeXorHex(input.text as string, keyCharacter),
    };
  },
});
export const runXorCipher = xorCipherTool.execute;
export default xorCipherTool;
