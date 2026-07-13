import { createSimpleTool, simpleError } from "../../core/simple.js";

export const divideTwoNumbersTool = createSimpleTool({
  id: "arithmetic/divide-two-numbers",
  title: "Divide Two Numbers Calculator",
  description: "Divide one finite number by another nonzero number.",
  inputs: [
    { id: "dividend", label: "Number to divide", kind: "number" },
    { id: "divisor", label: "Number to divide by", kind: "number" },
  ],
  outputs: [{ id: "quotient", label: "Quotient", kind: "number" }],
  calculate: (input) => {
    const divisor = input.divisor as number;
    if (divisor === 0)
      simpleError(
        "divisor",
        "The divisor must not be zero.",
        "division_by_zero",
      );
    const quotient = (input.dividend as number) / divisor;
    if (!Number.isFinite(quotient))
      simpleError("dividend", "The quotient exceeds the finite number range.");
    return { quotient };
  },
});

export const runDivideTwoNumbers = divideTwoNumbersTool.execute;
export default divideTwoNumbersTool;
