import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PermutationsInput = {
  readonly values: readonly number[];
};

export type PermutationsOutput = {
  readonly permutations: (readonly number[])[];
};

export const calculatePermutations = (
  input: PermutationsInput,
): PermutationsOutput => {
  const values = input.values;
  if (!values.length)
    return simpleError("values", "values must not be empty.", "empty_list");
  if (values.length > 7)
    return simpleError(
      "values",
      "At most 7 values are supported (7! = 5040 permutations).",
      "too_many_values",
    );
  const permute = (items: number[]): number[][] =>
    items.length <= 1
      ? [items]
      : items.flatMap((value, index) =>
          permute([...items.slice(0, index), ...items.slice(index + 1)]).map(
            (tail) => [value, ...tail],
          ),
        );
  return { permutations: permute([...values]) };
};

export const permutationsExample = {
  input: {
    values: [1, 2, 3],
  },
  output: {
    permutations: [
      [1, 2, 3],
      [1, 3, 2],
      [2, 1, 3],
      [2, 3, 1],
      [3, 1, 2],
      [3, 2, 1],
    ],
  },
} satisfies ToolExample<PermutationsInput, PermutationsOutput>;

export const permutationsTool = createSimpleTool({
  id: "list/permutations",
  title: "Permutations Generator",
  description:
    "Generate every ordering of a list in deterministic lexicographic order.",
  inputs: [
    {
      description: "List whose orderings are generated.",
      id: "values",
      kind: "numberList",
      label: "Values",
    },
  ],
  outputs: [
    {
      description:
        "All n! permutations, each preserving multiplicity of repeated values.",
      id: "permutations",
      kind: "matrix",
      label: "Permutations",
      format: "matrix",
    },
  ],
  calculate: (input) =>
    calculatePermutations({ values: input.values as readonly number[] }),
});

export const runPermutations = permutationsTool.execute;
export default permutationsTool;
