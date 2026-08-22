import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BinaryCodedDecimalDecodeInput = {
  readonly bcd: string;
};

export type BinaryCodedDecimalDecodeOutput = {
  readonly decimal: string;
};

export const binaryCodedDecimalDecodeExample = {
  input: { bcd: "0x1234" },
  output: { decimal: "1234" },
} satisfies ToolExample<
  BinaryCodedDecimalDecodeInput,
  BinaryCodedDecimalDecodeOutput
>;

const BCD_PATTERN = /^(?:0x)?([0-9a-f]+)$/i;

export const binaryCodedDecimalDecodeTool = createSimpleTool({
  id: "convert/binary-coded-decimal-decode",
  title: "BCD Decoder",
  description:
    "Decode a binary-coded decimal byte string (optionally 0x-prefixed) into its decimal number.",
  inputs: [
    {
      description: "BCD bytes as hexadecimal text; every nibble must be 0-9.",
      id: "bcd",
      label: "BCD value",
      kind: "string",
    },
  ],
  outputs: [{ id: "decimal", label: "Decimal", kind: "string" }],
  calculate: (input) => {
    const match = BCD_PATTERN.exec((input.bcd as string).trim());
    if (!match)
      simpleError(
        "bcd",
        "Enter a hexadecimal BCD string such as 0x1234.",
        "invalid_bcd_format",
      );
    const hex = match?.[1]?.toLowerCase();
    if (!hex)
      simpleError(
        "bcd",
        "Enter a hexadecimal BCD string such as 0x1234.",
        "invalid_bcd_format",
      );
    let decimal = "";
    for (const character of hex!) {
      const nibble = Number.parseInt(character, 16);
      if (nibble > 9)
        simpleError(
          "bcd",
          `The nibble "${character}" is not a valid BCD digit.`,
          "invalid_bcd_nibble",
        );
      decimal += String(nibble);
    }
    return { decimal: decimal.replace(/^0+(?=\d)/u, "") || "0" };
  },
});
export const runBinaryCodedDecimalDecode = binaryCodedDecimalDecodeTool.execute;
export default binaryCodedDecimalDecodeTool;
