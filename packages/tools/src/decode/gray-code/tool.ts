import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const grayCodeDecodeExample = {
  input: { grayCode: "111" },
  output: { value: 5 },
} satisfies ToolExample<
  { readonly grayCode: string },
  { readonly value: number }
>;

export const calculateGrayCodeDecode = (input: {
  readonly grayCode: string;
}): { readonly value: number } => {
  const gc = (input.grayCode as string).trim();
  if (!/^[01]+$/.test(gc) || gc.length === 0 || gc.length > 32)
    simpleError(
      "grayCode",
      "Provide a valid binary Gray code.",
      "invalid_gray_code",
    );
  let value = parseInt(gc[0], 2);
  for (let i = 1; i < gc.length; i++)
    value = (value << 1) | ((value & 1) ^ Number(gc[i]));
  return { value };
};

export const grayCodeDecodeTool = createSimpleTool({
  calculate: (input) =>
    calculateGrayCodeDecode(input as unknown as { readonly grayCode: string }),
  description: "Decode a reflected binary Gray code back to its integer value.",
  id: "decode/gray-code",
  inputs: [{ id: "grayCode", kind: "string", label: "Gray code" }],
  outputs: [{ id: "value", kind: "integer", label: "Value" }],
  title: "Gray Code Decoder",
});
export const runGrayCodeDecode = grayCodeDecodeTool.execute;
export default grayCodeDecodeTool;
