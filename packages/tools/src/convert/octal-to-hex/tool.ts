import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OctalToHexInput = {
  readonly octal: string;
};

export type OctalToHexOutput = {
  readonly hex: string;
};

export const octalToHexExample = {
  input: { octal: "377" },
  output: { hex: "ff" },
} satisfies ToolExample<OctalToHexInput, OctalToHexOutput>;

export const octalToHexTool = createSimpleTool({
  id: "convert/octal-to-hex",
  title: "Octal to Hex Converter",
  description:
    "Convert an octal integer string to its hexadecimal representation using arbitrary precision.",
  inputs: [
    {
      description: "Octal integer without a leading zero prefix.",
      id: "octal",
      label: "Octal",
      kind: "string",
    },
  ],
  outputs: [{ id: "hex", label: "Hex", kind: "string" }],
  calculate: (input) => {
    const octal = (input.octal as string).trim();
    if (octal.length === 0 || !/^[0-7]+$/u.test(octal))
      simpleError(
        "octal",
        "Enter an octal string using digits zero through seven.",
        "invalid_octal",
      );
    return { hex: BigInt(`0o${octal}`).toString(16) };
  },
});
export const runOctalToHex = octalToHexTool.execute;
export default octalToHexTool;
