import { createSimpleTool } from "../../core/simple.js";
export const arithmeticTool = createSimpleTool({
  id: "sequence/arithmetic",
  title: "Arithmetic Sequence Calculator",
  description: "Calculate an arithmetic sequence term and finite sum.",
  inputs: [
    { id: "firstTerm", label: "First term", kind: "number" },
    { id: "difference", label: "Common difference", kind: "number" },
    { id: "position", label: "Position", kind: "integer", minimum: 1 },
  ],
  outputs: [
    { id: "term", label: "Nth term", kind: "number" },
    { id: "sum", label: "Sum through nth term", kind: "number" },
  ],
  calculate: (input) => {
    const n = input.position as number,
      a = input.firstTerm as number,
      d = input.difference as number;
    return { term: a + (n - 1) * d, sum: (n / 2) * (2 * a + (n - 1) * d) };
  },
});
export const runArithmetic = arithmeticTool.execute;
export default arithmeticTool;
