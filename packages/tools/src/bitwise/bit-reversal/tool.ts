import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const bitReversalExample = {
  input: { bitWidth: 4, value: 6 },
  output: { reversed: 6 },
} satisfies ToolExample<BitReversalInput, BitReversalOutput>;

export type BitReversalInput = {
  readonly bitWidth: number;
  readonly value: number;
};
export type BitReversalOutput = { readonly reversed: number };

export const calculateBitReversal = (
  input: BitReversalInput,
): BitReversalOutput => {
  const width = input.bitWidth;
  if (width < 1 || width > 32)
    simpleError(
      "bitWidth",
      "The bit width must be between 1 and 32.",
      "invalid_width",
    );
  let r = 0;
  for (let i = 0; i < width; i++)
    r |= ((input.value >>> i) & 1) << (width - 1 - i);
  return { reversed: r >>> 0 };
};

export const bitReversalTool = createSimpleTool({
  calculate: (input) =>
    calculateBitReversal(input as unknown as BitReversalInput),
  description: "Reverse the bits of an integer within a specified bit width.",
  id: "bitwise/bit-reversal",
  inputs: [
    {
      id: "value",
      kind: "integer",
      label: "Value",
      maximum: 0xffff_ffff,
      minimum: 0,
    },
    {
      id: "bitWidth",
      kind: "integer",
      label: "Bit width",
      maximum: 32,
      minimum: 1,
    },
  ],
  outputs: [{ id: "reversed", kind: "integer", label: "Reversed value" }],
  title: "Bit Reversal Calculator",
});
export const runBitReversal = bitReversalTool.execute;
export default bitReversalTool;
