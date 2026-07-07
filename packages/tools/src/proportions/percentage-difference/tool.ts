import { createSimpleTool } from "../../core/simple.js";
export const percentageDifferenceTool = createSimpleTool({
  id: "proportions/percentage-difference",
  title: "Percentage Difference Calculator",
  description: "Calculate symmetric percentage difference between two values.",
  inputs: [
    { id: "first", label: "First value", kind: "number" },
    { id: "second", label: "Second value", kind: "number" },
  ],
  outputs: [
    {
      id: "percentDifference",
      label: "Percentage difference",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const first = input.first as number,
      second = input.second as number,
      mean = (Math.abs(first) + Math.abs(second)) / 2;
    if (mean === 0) return { percentDifference: 0 };
    return { percentDifference: (Math.abs(first - second) / mean) * 100 };
  },
});
export const runPercentageDifference = percentageDifferenceTool.execute;
export default percentageDifferenceTool;
