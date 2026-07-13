import { createSimpleTool, simpleError } from "../../core/simple.js";

export const multiplyTwoNumbersTool = createSimpleTool({
  id: "arithmetic/multiply-two-numbers",
  title: "Multiply Two Numbers Calculator",
  description: "Multiply two finite numbers.",
  inputs: [
    { id: "first", label: "First number", kind: "number" },
    { id: "second", label: "Second number", kind: "number" },
  ],
  outputs: [{ id: "product", label: "Product", kind: "number" }],
  calculate: (input) => {
    const product = (input.first as number) * (input.second as number);
    if (!Number.isFinite(product))
      simpleError("first", "The product exceeds the finite number range.");
    return { product };
  },
});

export const runMultiplyTwoNumbers = multiplyTwoNumbersTool.execute;
export default multiplyTwoNumbersTool;
