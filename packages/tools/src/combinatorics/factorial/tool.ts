import { createSimpleTool } from "../../core/simple.js";
export const factorialTool = createSimpleTool({
  id: "combinatorics/factorial",
  title: "Factorial Calculator",
  description:
    "Calculate n factorial for a nonnegative integer whose result is safely representable.",
  inputs: [{ id: "n", label: "N", kind: "integer", minimum: 0, maximum: 18 }],
  outputs: [{ id: "factorial", label: "Factorial", kind: "integer" }],
  calculate: (input) => {
    let factorial = 1;
    for (let value = 2; value <= (input.n as number); value += 1)
      factorial *= value;
    return { factorial };
  },
});
export const runFactorial = factorialTool.execute;
export default factorialTool;
