import { createSimpleTool, simpleError } from "../../core/simple.js";
export const doubleFactorialTool = createSimpleTool({
  id: "combinatorics/double-factorial",
  title: "Double Factorial Calculator",
  description: "Calculate the double factorial of a nonnegative integer.",
  inputs: [{ id: "n", label: "N", kind: "integer", minimum: 0, maximum: 30 }],
  outputs: [
    { id: "doubleFactorial", label: "Double factorial", kind: "integer" },
  ],
  calculate: (input) => {
    let doubleFactorial = 1;
    for (let value = input.n as number; value > 1; value -= 2)
      doubleFactorial *= value;
    if (!Number.isSafeInteger(doubleFactorial))
      simpleError("n", "The result exceeds the safe integer range.");
    return { doubleFactorial };
  },
});
export const runDoubleFactorial = doubleFactorialTool.execute;
export default doubleFactorialTool;
