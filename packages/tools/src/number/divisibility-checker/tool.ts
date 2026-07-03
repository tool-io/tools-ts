import { createSimpleTool, simpleError } from "../../core/simple.js";
export const divisibilityCheckerTool = createSimpleTool({
  id: "number/divisibility-checker",
  title: "Divisibility Checker",
  description: "Check whether one safe integer is evenly divisible by another.",
  inputs: [
    { id: "dividend", label: "Dividend", kind: "integer" },
    { id: "divisor", label: "Divisor", kind: "integer" },
  ],
  outputs: [{ id: "divisible", label: "Divisible", kind: "boolean" }],
  calculate: (input) => {
    const divisor = input.divisor as number;
    if (divisor === 0) simpleError("divisor", "Divisor must not be zero.");
    return { divisible: (input.dividend as number) % divisor === 0 };
  },
});
export const runDivisibilityChecker = divisibilityCheckerTool.execute;
export default divisibilityCheckerTool;
