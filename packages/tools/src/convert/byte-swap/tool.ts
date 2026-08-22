import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const byteSwapExample = {
  input: { value: 305419896 },
  output: { swapped: 2018915346 },
} satisfies ToolExample<
  { readonly value: number },
  { readonly swapped: number }
>;

export const calculateByteSwap = (input: {
  readonly value: number;
}): { readonly swapped: number } => {
  const v = input.value;
  if (v < 0 || v > 4294967295)
    simpleError(
      "value",
      "The value must fit in a 32-bit unsigned integer.",
      "invalid_value",
    );
  return {
    swapped:
      ((v & 255) << 24) |
      (((v >>> 8) & 255) << 16) |
      (((v >>> 16) & 255) << 8) |
      (v >>> 24),
  };
};

export const byteSwapTool = createSimpleTool({
  calculate: (input) =>
    calculateByteSwap(input as unknown as { readonly value: number }),
  description: "Reverse the byte order within a 32-bit unsigned integer.",
  id: "convert/byte-swap",
  inputs: [
    {
      id: "value",
      kind: "integer",
      label: "Value",
      maximum: 4294967295,
      minimum: 0,
    },
  ],
  outputs: [{ id: "swapped", kind: "integer", label: "Swapped value" }],
  title: "Byte Swap Converter",
});
export const runByteSwap = byteSwapTool.execute;
export default byteSwapTool;
