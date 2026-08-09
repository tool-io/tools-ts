import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const addNumbers = (values: readonly number[]): number | null => {
  if (values.length < 1 || values.some(Number.isNaN)) return null;
  if (values.includes(Infinity) && values.includes(-Infinity)) return null;
  if (values.includes(Infinity)) return Infinity;
  if (values.includes(-Infinity)) return -Infinity;
  let total = 0;
  let compensation = 0;
  for (const value of values) {
    const next = total + value;
    if (!Number.isFinite(next)) return next;
    compensation +=
      Math.abs(total) >= Math.abs(value)
        ? total - next + value
        : value - next + total;
    total = next;
  }
  const result = total + compensation;
  return Number.isNaN(result) ? null : Object.is(result, -0) ? 0 : result;
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
  description: "Add a list of finite or extended-real numbers.",
  inputs: [{ id: "values", kind: "numberList", label: "Numbers" }],
  outputs: [{ id: "sum", kind: "number", label: "Sum" }],
  calculate: (input) => {
    const sum = addNumbers(input.values as number[]);
    if (sum === null)
      simpleError("values", "Enter at least 1 number with a defined sum.");
    return { sum };
  },
});

export const runAddNumbers = addNumbersTool.execute;
export default addNumbersTool;
