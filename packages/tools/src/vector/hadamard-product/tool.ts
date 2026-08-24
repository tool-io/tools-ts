import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HadamardProductInput = {
  readonly a: readonly number[];
  readonly b: readonly number[];
};

export type HadamardProductOutput = {
  readonly product: readonly number[];
};

export const calculateHadamardProduct = (
  input: HadamardProductInput,
): HadamardProductOutput => {
  if (input.a.length !== input.b.length)
    simpleError("b", "Vectors must have the same length.", "length_mismatch");
  const product = input.a.map((value, index) => value * input.b[index]);
  if (!product.every(Number.isFinite))
    simpleError("a", "The element-wise product exceeds the numeric range.");
  return { product };
};

export const hadamardProductExample = {
  input: {
    a: [1.5, 2, -3],
    b: [2, 0.5, 4],
  },
  output: {
    product: [3, 1, -12],
  },
} satisfies ToolExample<HadamardProductInput, HadamardProductOutput>;

export const hadamardProductTool = createSimpleTool({
  id: "vector/hadamard-product",
  title: "Hadamard Product Calculator",
  description: "Compute the element-wise product of two equally sized vectors.",
  inputs: [
    {
      description: "First operand vector.",
      id: "a",
      kind: "numberList",
      label: "Vector A",
    },
    {
      description: "Second operand vector of equal length.",
      id: "b",
      kind: "numberList",
      label: "Vector B",
    },
  ],
  outputs: [
    {
      description: "Element-wise product a[i] * b[i].",
      id: "product",
      kind: "numberList",
      label: "Product",
    },
  ],
  calculate: (input) =>
    calculateHadamardProduct({
      a: input.a as readonly number[],
      b: input.b as readonly number[],
    }),
});

export const runHadamardProduct = hadamardProductTool.execute;
export default hadamardProductTool;
