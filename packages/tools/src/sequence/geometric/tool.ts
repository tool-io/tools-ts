import { createSimpleTool, simpleError } from "../../core/simple.js";
export const geometricTool = createSimpleTool({
  id: "sequence/geometric",
  title: "Geometric Sequence Calculator",
  description: "Calculate a geometric sequence term and finite sum.",
  inputs: [
    { id: "firstTerm", label: "First term", kind: "number" },
    { id: "ratio", label: "Common ratio", kind: "number" },
    { id: "position", label: "Position", kind: "integer", minimum: 1 },
  ],
  outputs: [
    { id: "term", label: "Nth term", kind: "number" },
    { id: "sum", label: "Sum through nth term", kind: "number" },
  ],
  calculate: (input) => {
    const n = input.position as number,
      a = input.firstTerm as number,
      r = input.ratio as number,
      term = a * r ** (n - 1),
      sum = r === 1 ? a * n : (a * (1 - r ** n)) / (1 - r);
    if (!Number.isFinite(term) || !Number.isFinite(sum))
      simpleError("position", "Result exceeds the finite number range.");
    return { term, sum };
  },
});
export const runGeometric = geometricTool.execute;
export default geometricTool;
