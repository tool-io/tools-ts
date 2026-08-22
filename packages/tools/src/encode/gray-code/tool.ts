import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const grayCodeEncodeExample = {
  input: { value: 5 },
  output: { grayCode: "111" },
} satisfies ToolExample<
  { readonly value: number },
  { readonly grayCode: string }
>;

export const calculateGrayCodeEncode = (input: {
  readonly value: number;
}): { readonly grayCode: string } => {
  if (input.value < 0)
    simpleError("value", "The value must be non-negative.", "invalid_value");
  return { grayCode: (input.value ^ (input.value >> 1)).toString(2) };
};

export const grayCodeEncodeTool = createSimpleTool({
  calculate: (input) =>
    calculateGrayCodeEncode(input as unknown as { readonly value: number }),
  description:
    "Convert a non-negative integer to its reflected binary Gray code.",
  id: "encode/gray-code",
  inputs: [
    {
      id: "value",
      kind: "integer",
      label: "Value",
      maximum: 0xffff_ffff,
      minimum: 0,
    },
  ],
  outputs: [{ id: "grayCode", kind: "string", label: "Gray code" }],
  title: "Gray Code Encoder",
});
export const runGrayCodeEncode = grayCodeEncodeTool.execute;
export default grayCodeEncodeTool;
