import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CartesianProductInput = {
  readonly first: readonly number[];
  readonly second: readonly number[];
};

export type CartesianProductOutput = {
  readonly pairs: (readonly number[])[];
};

export const calculateCartesianProduct = (
  input: CartesianProductInput,
): CartesianProductOutput => {
  const first = input.first;
  const second = input.second;
  if (!first.length || !second.length)
    return simpleError(
      first.length ? "second" : "first",
      "Input lists must not be empty.",
      "empty_list",
    );
  return {
    pairs: first.flatMap((value) => second.map((other) => [value, other])),
  };
};

export const cartesianProductExample = {
  input: {
    first: [1, 2],
    second: [3, 4],
  },
  output: {
    pairs: [
      [1, 3],
      [1, 4],
      [2, 3],
      [2, 4],
    ],
  },
} satisfies ToolExample<CartesianProductInput, CartesianProductOutput>;

export const cartesianProductTool = createSimpleTool({
  id: "list/cartesian-product",
  title: "Cartesian Product",
  description:
    "Build every ordered pair picking one element from each of two lists.",
  inputs: [
    {
      description: "Values chosen for the first coordinate.",
      id: "first",
      kind: "numberList",
      label: "First list",
    },
    {
      description: "Values chosen for the second coordinate.",
      id: "second",
      kind: "numberList",
      label: "Second list",
    },
  ],
  outputs: [
    {
      description:
        "Matrix in which each row is one [first[i], second[j]] pair, ordered by first then second.",
      id: "pairs",
      kind: "matrix",
      label: "Pairs",
      format: "matrix",
    },
  ],
  calculate: (input) =>
    calculateCartesianProduct({
      first: input.first as readonly number[],
      second: input.second as readonly number[],
    }),
});

export const runCartesianProduct = cartesianProductTool.execute;
export default cartesianProductTool;
