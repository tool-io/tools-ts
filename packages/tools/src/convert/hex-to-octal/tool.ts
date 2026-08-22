import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const hexToOctalTool = createSimpleTool({
  id: "convert/hex-to-octal",
  title: "Hex to Octal Converter",
  description:
    "Convert a hexadecimal integer string to its octal representation using arbitrary precision.",
  inputs: [
    {
      description: "Hexadecimal integer without the 0x prefix.",
      id: "hex",
      label: "Hex",
      kind: "string",
    },
  ],
  outputs: [{ id: "octal", label: "Octal", kind: "string" }],
  calculate: (input) => {
    const hex = (input.hex as string).trim().toLowerCase();
    if (hex.length === 0 || !/^[0-9a-f]+$/u.test(hex))
      simpleError(
        "hex",
        "Enter a hexadecimal string using digits and a-f.",
        "invalid_hex",
      );
    return { octal: BigInt(`0x${hex}`).toString(8) };
  },
});
export const runHexToOctal = hexToOctalTool.execute;
export default hexToOctalTool;

export type HexToOctalInput = {
  readonly hex: string;
};

export type HexToOctalOutput = {
  readonly octal: string;
};

export const hexToOctalExample = {
  input: {
    hex: "A",
  },
  output: {
    octal: "12",
  },
} satisfies ToolExample<HexToOctalInput, HexToOctalOutput>;
