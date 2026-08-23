import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CombinationsInput = {
  readonly values: readonly number[];
  readonly size: number;
};

export type CombinationsOutput = {
  readonly combinations: (readonly number[])[];
};

export const calculateCombinations = (
  input: CombinationsInput,
): CombinationsOutput => {
  const values = input.values;
  const size = input.size;
  if (!Number.isSafeInteger(size) || size < 0)
    return simpleError(
      "size",
      "size must be a non-negative integer.",
      "invalid_size",
    );
  if (!values.length)
    return simpleError("values", "values must not be empty.", "empty_list");
  if (size > values.length)
    return simpleError(
      "size",
      "size must not exceed the number of available values.",
      "invalid_size",
    );
  const combinations: number[][] = [];
  const current: number[] = [];
  const walk = (start: number): void => {
    if (current.length === size) {
      combinations.push([...current]);
      return;
    }
    for (let index = start; index < values.length; index += 1) {
      current.push(values[index]);
      walk(index + 1);
      current.pop();
    }
  };
  walk(0);
  return { combinations };
};

export const combinationsExample = {
  input: {
    values: [1, 2, 3],
    size: 2,
  },
  output: {
    combinations: [
      [1, 2],
      [1, 3],
      [2, 3],
    ],
  },
} satisfies ToolExample<CombinationsInput, CombinationsOutput>;

export const combinationsTool = createSimpleTool({
  id: "list/combinations",
  title: "Combinations Generator",
  description:
    "Generate all k-sized combinations of a list in deterministic lexicographic order.",
  inputs: [
    {
      description: "List to draw combinations from.",
      id: "values",
      kind: "numberList",
      label: "Values",
    },
    {
      description: "Number of elements per combination.",
      id: "size",
      kind: "integer",
      label: "Combination size",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Every size-k subset, in deterministic order.",
      id: "combinations",
      kind: "matrix",
      label: "Combinations",
      format: "matrix",
    },
  ],
  calculate: (input) =>
    calculateCombinations({
      size: input.size as number,
      values: input.values as readonly number[],
    }),
});

export const runCombinations = combinationsTool.execute;
export default combinationsTool;
