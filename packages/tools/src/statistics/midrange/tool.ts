import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const midrangeExample = {
  input: { values: [1, 3, 9] },
} satisfies ToolExample<{ readonly values: readonly number[] }>;

export const midrangeTool = createSimpleTool({
  id: "statistics/midrange",
  title: "Midrange Calculator",
  description:
    "Calculate the midpoint between a dataset's minimum and maximum.",
  inputs: [{ id: "values", label: "Values", kind: "numberList" }],
  outputs: [{ id: "midrange", label: "Midrange", kind: "number" }],
  calculate: (input) => {
    const values = input.values as number[];
    if (values.length === 0) simpleError("values", "Enter at least one value.");
    return { midrange: (Math.min(...values) + Math.max(...values)) / 2 };
  },
});
export const runMidrange = midrangeTool.execute;
export default midrangeTool;
