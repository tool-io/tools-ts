import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const addNumbers = (values: readonly number[]): number | null => {
  if (values.length < 1 || !values.every(Number.isFinite)) return null;
  let total = 0;
  let compensation = 0;
  for (const value of values) {
    const next = total + value;
    compensation +=
      Math.abs(total) >= Math.abs(value)
        ? total - next + value
        : value - next + total;
    total = next;
  }
  const result = total + compensation;
  return Number.isFinite(result) ? (Object.is(result, -0) ? 0 : result) : null;
};

export const addNumbersExample = {
  input: { values: [1, 2, 3] },
  output: { sum: 6 },
} satisfies ToolExample<
  { readonly values: readonly number[] },
  { readonly sum: number }
>;

export const addNumbersTool = createSimpleTool({
  id: "arithmetic/add-numbers",
  title: "Add N Numbers",
  description: "Add a finite list of numbers.",
  inputs: [{ id: "values", kind: "numberList", label: "Numbers" }],
  outputs: [{ id: "sum", kind: "number", label: "Sum" }],
  calculate: (input) => {
    const sum = addNumbers(input.values as number[]);
    if (sum === null) simpleError("values", "Enter at least 1 finite number.");
    return { sum };
  },
});

export const runAddNumbers = addNumbersTool.execute;
export default addNumbersTool;
