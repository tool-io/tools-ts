import { createSimpleTool, simpleError } from "../../core/simple.js";
export const transposeTool = createSimpleTool({
  id: "matrix/transpose",
  title: "Matrix Transpose Calculator",
  description: "Transpose a nonempty rectangular numeric matrix.",
  inputs: [{ id: "matrix", label: "Matrix", kind: "matrix", format: "matrix" }],
  outputs: [
    {
      id: "matrix",
      label: "Transposed matrix",
      kind: "matrix",
      format: "matrix",
    },
  ],
  calculate: (input) => {
    const matrix = input.matrix as number[][];
    if (
      matrix.length === 0 ||
      matrix[0]!.length === 0 ||
      matrix.some((row) => row.length !== matrix[0]!.length)
    )
      simpleError("matrix", "Matrix must be nonempty and rectangular.");
    return {
      matrix: Array.from({ length: matrix[0]!.length }, (_, column) =>
        matrix.map((row) => row[column]!),
      ),
    };
  },
});
export const runTranspose = transposeTool.execute;
export default transposeTool;
