import { createSimpleTool, simpleError } from "../../core/simple.js";

export const subtractTwoNumbersTool = createSimpleTool({
  id: "arithmetic/subtract-two-numbers",
  title: "Subtract Two Numbers Calculator",
  description: "Subtract the second finite number from the first.",
  inputs: [
    { id: "minuend", label: "Number to subtract from", kind: "number" },
    { id: "subtrahend", label: "Number to subtract", kind: "number" },
  ],
  outputs: [{ id: "difference", label: "Difference", kind: "number" }],
  calculate: (input) => {
    const difference = (input.minuend as number) - (input.subtrahend as number);
    if (!Number.isFinite(difference))
      simpleError("minuend", "The difference exceeds the finite number range.");
    return { difference };
  },
});

export const runSubtractTwoNumbers = subtractTwoNumbersTool.execute;
export default subtractTwoNumbersTool;
