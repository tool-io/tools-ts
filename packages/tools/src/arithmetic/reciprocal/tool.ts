import { createSimpleTool, simpleError } from "../../core/simple.js";
export const reciprocalTool = createSimpleTool({
  id: "arithmetic/reciprocal",
  title: "Reciprocal Calculator",
  description:
    "Calculate the multiplicative inverse of a nonzero finite number.",
  inputs: [{ id: "value", label: "Value", kind: "number" }],
  outputs: [{ id: "reciprocal", label: "Reciprocal", kind: "number" }],
  calculate: (input) => {
    const value = input.value as number;
    if (value === 0) simpleError("value", "Value must not be zero.");
    return { reciprocal: 1 / value };
  },
});
export const runReciprocal = reciprocalTool.execute;
export default reciprocalTool;
