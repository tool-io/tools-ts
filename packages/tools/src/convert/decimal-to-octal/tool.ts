import { createSimpleTool } from "../../core/simple.js";
export const decimalToOctalTool = createSimpleTool({
  id: "convert/decimal-to-octal",
  title: "Decimal to Octal Converter",
  description: "Convert a safe decimal integer to octal notation.",
  inputs: [{ id: "decimal", label: "Decimal integer", kind: "integer" }],
  outputs: [{ id: "octal", label: "Octal integer", kind: "string" }],
  calculate: (input) => {
    const value = input.decimal as number;
    const digits = Math.abs(value).toString(8);
    return { octal: value < 0 ? `-${digits}` : digits };
  },
});
export const runDecimalToOctal = decimalToOctalTool.execute;
export default decimalToOctalTool;
