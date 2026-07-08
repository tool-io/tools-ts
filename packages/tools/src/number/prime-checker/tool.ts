import { createSimpleTool } from "../../core/simple.js";
export const primeCheckerTool = createSimpleTool({
  id: "number/prime-checker",
  title: "Prime Number Checker",
  description:
    "Check whether a safe integer is prime using deterministic trial division.",
  inputs: [{ id: "value", label: "Integer", kind: "integer" }],
  outputs: [{ id: "prime", label: "Prime", kind: "boolean" }],
  calculate: (input) => {
    const value = input.value as number;
    if (value < 2) return { prime: false };
    if (value % 2 === 0) return { prime: value === 2 };
    for (let factor = 3; factor <= Math.sqrt(value); factor += 2)
      if (value % factor === 0) return { prime: false };
    return { prime: true };
  },
});
export const runPrimeChecker = primeCheckerTool.execute;
export default primeCheckerTool;
