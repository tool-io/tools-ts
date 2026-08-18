import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AdjacencyMatrixToListInput = {
  readonly matrix: readonly (readonly number[])[];
  readonly nodes?: readonly string[];
};

export type AdjacencyMatrixToListOutput = {
  readonly table: Record<string, string[]>;
};

export const adjacencyMatrixToListExample = {
  input: { matrix: [[0, 1], [1, 0]] },
  output: { table: { "0": ["1"], "1": ["0"] } },
} satisfies ToolExample<AdjacencyMatrixToListInput, AdjacencyMatrixToListOutput>;

const compareStrings = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

export const calculateAdjacencyMatrixToList = (
  input: AdjacencyMatrixToListInput,
): AdjacencyMatrixToListOutput => {
  const matrix = input.matrix as readonly (readonly number[])[];
  const size = matrix.length;
  if (
    size === 0 ||
    matrix.some((row) => row.length !== size)
  )
    simpleError(
      "matrix",
      "The adjacency matrix must be a non-empty square matrix.",
      "not_square",
    );
  for (const row of matrix)
    for (const cell of row)
      if (cell !== 0 && cell !== 1)
        simpleError(
          "matrix",
          "Adjacency cells must be zero or one.",
          "invalid_matrix_cell",
        );
  let names: string[];
  if (input.nodes === undefined)
    names = matrix.map((_, index) => String(index));
  else {
    names = [...new Set(input.nodes as readonly string[])];
    if (names.length !== input.nodes!.length)
      simpleError(
        "nodes",
        "Node names must be unique.",
        "duplicate_node",
      );
    if (names.length !== size)
      simpleError(
        "nodes",
        "Provide exactly one name per matrix row.",
        "node_count_mismatch",
      );
  }
  const table: Record<string, string[]> = {};
  for (let row = 0; row < size; row += 1) {
    const targets: string[] = [];
    for (let column = 0; column < size; column += 1)
      if (matrix[row]![column] === 1) targets.push(names[column]!);
    targets.sort(compareStrings);
    table[names[row]!] = targets;
  }
  return { table };
};

export const adjacencyMatrixToListTool = createSimpleTool({
  calculate: (input) =>
    calculateAdjacencyMatrixToList(
      input as unknown as AdjacencyMatrixToListInput,
    ),
  description:
    "Convert a square 0/1 adjacency matrix into an adjacency map of sorted neighbor lists.",
  id: "graph/adjacency-matrix-to-list",
  inputs: [
    {
      description:
        "Square matrix of zeros and ones; entry [i][j]=1 marks the edge i to j.",
      id: "matrix",
      kind: "matrix",
      label: "Adjacency matrix",
    },
    {
      description:
        "One name per row; defaults to zero-based positional names.",
      id: "nodes",
      kind: "stringList",
      label: "Node names",
      required: false,
    },
  ],
  outputs: [
    {
      description: "Adjacency map with sorted neighbor arrays.",
      id: "table",
      kind: "object",
      label: "Adjacency map",
    },
  ],
  title: "Graph Adjacency Matrix to List Converter",
});
export const runAdjacencyMatrixToList = adjacencyMatrixToListTool.execute;
export default adjacencyMatrixToListTool;
