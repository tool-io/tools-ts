import { createSimpleTool, simpleError } from "../../core/simple.js";
export const moduloTool = createSimpleTool({
  id: "arithmetic/modulo",
  title: "Positive Modulo Calculator",
  description: "Calculate a normalized nonnegative modulo result.",
  inputs: [
    { id: "dividend", label: "Dividend", kind: "number" },
    { id: "modulus", label: "Modulus", kind: "number" },
  ],
  outputs: [{ id: "remainder", label: "Remainder", kind: "number" }],
  calculate: (input) => {
    const modulus = input.modulus as number;
    if (modulus === 0) simpleError("modulus", "Modulus must not be zero.");
    const positive = Math.abs(modulus);
    return {
      remainder:
        (((input.dividend as number) % positive) + positive) % positive,
    };
  },
});
export const runModulo = moduloTool.execute;
export default moduloTool;
