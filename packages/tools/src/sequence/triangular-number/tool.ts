import { createSimpleTool, simpleError } from "../../core/simple.js";
export const triangularNumberTool = createSimpleTool({
  id: "sequence/triangular-number",
  title: "Triangular Number Calculator",
  description: "Calculate the nth triangular number.",
  inputs: [{ id: "position", label: "Position", kind: "integer", minimum: 0 }],
  outputs: [
    { id: "triangularNumber", label: "Triangular number", kind: "integer" },
  ],
  calculate: (input) => {
    const n = input.position as number,
      result = (n * (n + 1)) / 2;
    if (!Number.isSafeInteger(result))
      simpleError("position", "Result exceeds the safe integer range.");
    return { triangularNumber: result };
  },
});
export const runTriangularNumber = triangularNumberTool.execute;
export default triangularNumberTool;
