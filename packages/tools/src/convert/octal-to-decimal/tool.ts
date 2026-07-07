import { createSimpleTool, simpleError } from "../../core/simple.js";
export const octalToDecimalTool = createSimpleTool({
  id: "convert/octal-to-decimal",
  title: "Octal to Decimal Converter",
  description: "Convert an octal integer string to a safe decimal integer.",
  inputs: [{ id: "octal", label: "Octal integer", kind: "string" }],
  outputs: [{ id: "decimal", label: "Decimal integer", kind: "integer" }],
  calculate: (input) => {
    const text = input.octal as string;
    if (!/^[+-]?[0-7]+$/u.test(text))
      simpleError("octal", "Enter an octal integer.");
    const sign = text.startsWith("-") ? -1 : 1;
    const value = Number.parseInt(text.replace(/^[+-]/u, ""), 8) * sign;
    if (!Number.isSafeInteger(value))
      simpleError("octal", "Result exceeds the safe integer range.");
    return { decimal: value };
  },
});
export const runOctalToDecimal = octalToDecimalTool.execute;
export default octalToDecimalTool;
