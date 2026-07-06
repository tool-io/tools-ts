import { createSimpleTool, simpleError } from "../../core/simple.js";
export const logarithmTool = createSimpleTool({
  id: "math/logarithm",
  title: "Logarithm with Arbitrary Base",
  description: "Calculate a logarithm using any positive base other than one.",
  inputs: [
    { id: "value", label: "Value", kind: "number" },
    { id: "base", label: "Base", kind: "number" },
  ],
  outputs: [{ id: "logarithm", label: "Logarithm", kind: "number" }],
  calculate: (input) => {
    const value = input.value as number,
      base = input.base as number;
    if (value <= 0) simpleError("value", "Value must be positive.");
    if (base <= 0 || base === 1)
      simpleError("base", "Base must be positive and not equal to one.");
    return { logarithm: Math.log(value) / Math.log(base) };
  },
});
export const runLogarithm = logarithmTool.execute;
export default logarithmTool;
