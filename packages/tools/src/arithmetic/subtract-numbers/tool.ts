import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const subtractNumbers = (values: readonly number[]): number | null => {
  if (values.length < 2 || !values.every(Number.isFinite)) return null;
  const result = values
    .slice(1)
    .reduce((difference, value) => difference - value, values[0]!);
  return Number.isFinite(result) ? (Object.is(result, -0) ? 0 : result) : null;
};

export const subtractNumbersExample = {
  input: { values: [10, 3, 2] },
  output: { difference: 5 },
} satisfies ToolExample<
  { readonly values: readonly number[] },
  { readonly difference: number }
>;

export const subtractNumbersTool = createSimpleTool({
  id: "arithmetic/subtract-numbers",
  title: "Subtract N Numbers",
  description: "Subtract each subsequent finite number from the first number.",
  inputs: [{ id: "values", kind: "numberList", label: "Numbers" }],
  outputs: [{ id: "difference", kind: "number", label: "Difference" }],
  calculate: (input) => {
    const difference = subtractNumbers(input.values as number[]);
    if (difference === null)
      simpleError("values", "Enter at least 2 finite numbers.");
    return { difference };
  },
});

export const runSubtractNumbers = subtractNumbersTool.execute;
export default subtractNumbersTool;
