import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly hex: string; readonly allowSpaces: boolean };
export type Output = { readonly nibbles: number; readonly odd: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hex: { type: "string", maxLength: 8192 },
    allowSpaces: { type: "boolean" },
  },
  required: ["hex", "allowSpaces"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { nibbles: { type: "integer" }, odd: { type: "boolean" } },
  required: ["nibbles", "odd"],
} as const;
/** Inspect one explicitly space-tolerant or strict hexadecimal nibble stream without silently removing other characters. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { hex, allowSpaces } = request;
  const compute = (): Output => {
    H.domain(
      (allowSpaces
        ? /^[0-9A-Fa-f ]*(?![\s\S])/
        : /^[0-9A-Fa-f]*(?![\s\S])/
      ).test(hex),
      "hex",
    );
    const nibbles = (allowSpaces ? hex.replaceAll(" ", "") : hex).length;
    return { nibbles, odd: nibbles % 2 === 1 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { hex: "A B C", allowSpaces: true },
  output: { nibbles: 3, odd: true },
} satisfies ToolExample<Input, Output>;
export const hexStreamOddNibbleFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "decode/hex-stream-odd-nibble-flag",
    title: "Hex Stream Odd Nibble Flag Tool",
    description:
      "Inspect one explicitly space-tolerant or strict hexadecimal nibble stream without silently removing other characters.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hex: { type: "string", maxLength: 8192 },
        allowSpaces: { type: "boolean" },
      },
      required: ["hex", "allowSpaces"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { nibbles: { type: "integer" }, odd: { type: "boolean" } },
      required: ["nibbles", "odd"],
    },
    ports: {
      inputs: [
        {
          id: "hex",
          label: "Hex",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "allowSpaces",
          label: "Allow Spaces",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "nibbles", label: "Nibbles", valueType: { type: "integer" } },
        { id: "odd", label: "Odd", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = hexStreamOddNibbleFlagTool.execute;
export default hexStreamOddNibbleFlagTool;
