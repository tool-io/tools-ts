import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const rangeExample = {
  input: { values: [7, -2, 4] },
} satisfies ToolExample<{ readonly values: readonly number[] }>;

export const rangeTool = createSimpleTool({
  id: "statistics/range",
  title: "Range Calculator",
  description:
    "Calculate the minimum, maximum, and range of a finite numeric list.",
  inputs: [{ id: "values", label: "Values", kind: "numberList" }],
  outputs: [
    { id: "minimum", label: "Minimum", kind: "number" },
    { id: "maximum", label: "Maximum", kind: "number" },
    { id: "range", label: "Range", kind: "number" },
  ],
  calculate: (input) => {
    const values = input.values as number[];
    if (values.length === 0) simpleError("values", "Enter at least one value.");
    const minimum = Math.min(...values);
    const maximum = Math.max(...values);
    const range = maximum - minimum;
    if (!Number.isFinite(range))
      simpleError("values", "The range exceeds the finite number range.");
    return { maximum, minimum, range };
  },
});

export const runRange = rangeTool.execute;
export default rangeTool;
