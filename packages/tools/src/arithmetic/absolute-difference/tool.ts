import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const absoluteDifferenceExample = {
  input: { first: 9, second: 4 },
} satisfies ToolExample<{ readonly first: number; readonly second: number }>;

export const absoluteDifferenceTool = createSimpleTool({
  id: "arithmetic/absolute-difference",
  title: "Absolute Difference Calculator",
  description:
    "Calculate the nonnegative absolute difference between two finite numbers.",
  inputs: [
    { id: "first", label: "First value", kind: "number" },
    { id: "second", label: "Second value", kind: "number" },
  ],
  outputs: [{ id: "difference", label: "Absolute difference", kind: "number" }],
  calculate: (input) => {
    return {
      difference: Math.abs((input.first as number) - (input.second as number)),
    };
  },
});
export const runAbsoluteDifference = absoluteDifferenceTool.execute;
export default absoluteDifferenceTool;
