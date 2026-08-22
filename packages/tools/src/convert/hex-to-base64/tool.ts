import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { bytesToBase64 } from "../../core/encoding.js";

export type HexToBase64Input = {
  readonly hex: string;
};

export type HexToBase64Output = {
  readonly base64: string;
};

export const hexToBase64Example = {
  input: { hex: "546f6f6c2e696f" },
  output: { base64: "VG9vbC5pbw==" },
} satisfies ToolExample<HexToBase64Input, HexToBase64Output>;

export const hexToBase64Tool = createSimpleTool({
  id: "convert/hex-to-base64",
  title: "Hex to Base64 Converter",
  description:
    "Decode a hexadecimal string into bytes and re-encode it as Base64.",
  inputs: [
    {
      description: "Hexadecimal byte string with an even number of digits.",
      id: "hex",
      label: "Hex",
      kind: "string",
    },
  ],
  outputs: [{ id: "base64", label: "Base64", kind: "string" }],
  calculate: (input) => {
    const hex = (input.hex as string).trim().toLowerCase();
    if (hex.length === 0 || hex.length % 2 !== 0 || !/^[0-9a-f]+$/u.test(hex))
      simpleError(
        "hex",
        "Enter a non-empty even-length hexadecimal string.",
        "invalid_hex",
      );
    const bytes: number[] = [];
    for (let index = 0; index < hex.length; index += 2)
      bytes.push(Number.parseInt(hex.slice(index, index + 2), 16));
    return { base64: bytesToBase64(bytes) };
  },
});
export const runHexToBase64 = hexToBase64Tool.execute;
export default hexToBase64Tool;
