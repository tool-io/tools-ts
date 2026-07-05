import { createSimpleTool, simpleError } from "../../core/simple.js";
export const hexadecimalToDecimalTool = createSimpleTool({
  id: "convert/hexadecimal-to-decimal",
  title: "Hexadecimal to Decimal Converter",
  description:
    "Convert a hexadecimal integer string to a safe decimal integer.",
  inputs: [{ id: "hexadecimal", label: "Hexadecimal integer", kind: "string" }],
  outputs: [{ id: "decimal", label: "Decimal integer", kind: "integer" }],
  calculate: (input) => {
    const text = input.hexadecimal as string;
    if (!/^[+-]?[0-9a-f]+$/iu.test(text))
      simpleError("hexadecimal", "Enter a hexadecimal integer.");
    const sign = text.startsWith("-") ? -1 : 1;
    const value = Number.parseInt(text.replace(/^[+-]/u, ""), 16) * sign;
    if (!Number.isSafeInteger(value))
      simpleError("hexadecimal", "Result exceeds the safe integer range.");
    return { decimal: value };
  },
});
export const runHexadecimalToDecimal = hexadecimalToDecimalTool.execute;
export default hexadecimalToDecimalTool;
