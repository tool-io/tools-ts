import { createSimpleTool } from "../../core/simple.js";
export const parityCheckerTool = createSimpleTool({
  id: "number/parity-checker",
  title: "Integer Parity Checker",
  description: "Identify whether a safe integer is even or odd.",
  inputs: [{ id: "value", label: "Integer", kind: "integer" }],
  outputs: [
    { id: "even", label: "Even", kind: "boolean" },
    { id: "parity", label: "Parity", kind: "string" },
  ],
  calculate: (input) => {
    const even = (input.value as number) % 2 === 0;
    return { even, parity: even ? "even" : "odd" };
  },
});
export const runParityChecker = parityCheckerTool.execute;
export default parityCheckerTool;
