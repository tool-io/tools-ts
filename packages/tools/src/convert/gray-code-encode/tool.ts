import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type GrayCodeEncodeInput = {
  readonly value: number;
};

export type GrayCodeEncodeOutput = {
  readonly grayCode: number;
};

export const grayCodeEncodeExample = {
  input: { value: 13 },
  output: { grayCode: 11 },
} satisfies ToolExample<GrayCodeEncodeInput, GrayCodeEncodeOutput>;

export const calculateGrayCodeEncode = (
  input: GrayCodeEncodeInput,
): GrayCodeEncodeOutput => ({
  grayCode: input.value ^ (input.value >>> 1),
});

export const grayCodeEncodeTool = createSimpleTool({
  id: "convert/gray-code-encode",
  title: "Gray Code Encoder",
  description:
    "Encode a nonnegative integer to its reflected binary Gray code using value XOR (value >>> 1).",
  inputs: [
    {
      id: "value",
      kind: "integer",
      label: "Value",
      maximum: 2147483647,
      minimum: 0,
    },
  ],
  outputs: [{ id: "grayCode", kind: "integer", label: "Gray code" }],
  calculate: (input) =>
    calculateGrayCodeEncode({ value: input.value as number }),
});

export const runGrayCodeEncode = grayCodeEncodeTool.execute;
export default grayCodeEncodeTool;
