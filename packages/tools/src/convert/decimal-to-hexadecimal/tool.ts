import { createSimpleTool } from "../../core/simple.js";
export const decimalToHexadecimalTool = createSimpleTool({
  id: "convert/decimal-to-hexadecimal",
  title: "Decimal to Hexadecimal Converter",
  description:
    "Convert a safe decimal integer to uppercase hexadecimal notation.",
  inputs: [{ id: "decimal", label: "Decimal integer", kind: "integer" }],
  outputs: [
    { id: "hexadecimal", label: "Hexadecimal integer", kind: "string" },
  ],
  calculate: (input) => {
    const value = input.decimal as number;
    const digits = Math.abs(value).toString(16).toUpperCase();
    return { hexadecimal: value < 0 ? `-${digits}` : digits };
  },
});
export const runDecimalToHexadecimal = decimalToHexadecimalTool.execute;
export default decimalToHexadecimalTool;
