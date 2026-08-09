import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const multiplyNumbers = (values: readonly number[]): number | null => {
  if (values.length < 1 || values.some(Number.isNaN)) return null;
  const result = values.reduce((product, value) => product * value, 1);
  return Number.isNaN(result) ? null : Object.is(result, -0) ? 0 : result;
};

export const multiplyNumbersExample = {
  input: { values: [2, 3, 4] },
  output: { product: 24 },
} satisfies ToolExample<
  { readonly values: readonly number[] },
  { readonly product: number }
>;

export const multiplyNumbersTool = createSimpleTool({
  id: "arithmetic/multiply-numbers",
  title: "Multiply N Numbers",
  description: "Multiply a list of finite or extended-real numbers.",
  inputs: [{ id: "values", kind: "numberList", label: "Numbers" }],
  outputs: [{ id: "product", kind: "number", label: "Product" }],
  calculate: (input) => {
    const product = multiplyNumbers(input.values as number[]);
    if (product === null)
      simpleError("values", "Enter at least 1 number with a defined product.");
    return { product };
  },
});

export const runMultiplyNumbers = multiplyNumbersTool.execute;
export default multiplyNumbersTool;
