import { createSimpleTool } from "../../core/simple.js";
export const decimalToBinaryTool = createSimpleTool({
  id: "convert/decimal-to-binary",
  title: "Decimal to Binary Converter",
  description: "Convert a safe decimal integer to binary notation.",
  inputs: [{ id: "decimal", label: "Decimal integer", kind: "integer" }],
  outputs: [{ id: "binary", label: "Binary integer", kind: "string" }],
  calculate: (input) => {
    const value = input.decimal as number;
    return {
      binary: value < 0 ? `-${Math.abs(value).toString(2)}` : value.toString(2),
    };
  },
});
export const runDecimalToBinary = decimalToBinaryTool.execute;
export default decimalToBinaryTool;
