import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BinaryToHexInput = {
  readonly binary: string;
};

export type BinaryToHexOutput = {
  readonly hex: string;
};

const NIBBLES: Readonly<Record<string, string>> = {
  "0000": "0",
  "0001": "1",
  "0010": "2",
  "0011": "3",
  "0100": "4",
  "0101": "5",
  "0110": "6",
  "0111": "7",
  "1000": "8",
  "1001": "9",
  "1010": "A",
  "1011": "B",
  "1100": "C",
  "1101": "D",
  "1110": "E",
  "1111": "F",
};

export const binaryToHexExample = {
  input: { binary: "11010111 00001111" },
  output: { hex: "D70F" },
} satisfies ToolExample<BinaryToHexInput, BinaryToHexOutput>;

export const binaryToHexTool = createSimpleTool({
  id: "convert/binary-to-hex",
  title: "Binary to Hex Converter",
  description:
    "Convert a binary string, optionally grouped with spaces, into an uppercase hexadecimal string.",
  inputs: [{ id: "binary", kind: "string", label: "Binary" }],
  outputs: [{ id: "hex", kind: "string", label: "Hexadecimal" }],
  calculate: (input) => {
    const binary = (input.binary as string).replace(/\s+/g, "");
    if (binary === "")
      simpleError(
        "binary",
        "Provide at least one binary digit.",
        "empty_binary",
      );
    if (!/^[01]+$/.test(binary))
      simpleError(
        "binary",
        "Only the digits 0 and 1 are allowed.",
        "invalid_binary",
      );
    const padded = binary.padStart(Math.ceil(binary.length / 4) * 4, "0");
    return { hex: padded.replace(/[01]{4}/g, (nibble) => NIBBLES[nibble]!) };
  },
});
export const runBinaryToHex = binaryToHexTool.execute;
export default binaryToHexTool;
