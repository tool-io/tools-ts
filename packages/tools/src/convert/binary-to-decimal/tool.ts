import { createSimpleTool, simpleError } from "../../core/simple.js";
export const binaryToDecimalTool = createSimpleTool({
  id: "convert/binary-to-decimal",
  title: "Binary to Decimal Converter",
  description: "Convert a binary integer string to a safe decimal integer.",
  inputs: [{ id: "binary", label: "Binary integer", kind: "string" }],
  outputs: [{ id: "decimal", label: "Decimal integer", kind: "integer" }],
  calculate: (input) => {
    const text = input.binary as string;
    if (!/^[+-]?[01]+$/u.test(text))
      simpleError("binary", "Enter a binary integer.");
    const sign = text.startsWith("-") ? -1 : 1;
    const digits = text.replace(/^[+-]/u, "");
    const value = Number.parseInt(digits, 2) * sign;
    if (!Number.isSafeInteger(value))
      simpleError("binary", "Result exceeds the safe integer range.");
    return { decimal: value };
  },
});
export const runBinaryToDecimal = binaryToDecimalTool.execute;
export default binaryToDecimalTool;
