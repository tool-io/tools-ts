import { createSimpleTool, simpleError } from "../../core/simple.js";
export const diagonalTool = createSimpleTool({
  id: "matrix/diagonal",
  title: "Matrix Diagonal Extractor",
  description:
    "Extract the main diagonal from a nonempty rectangular numeric matrix.",
  inputs: [{ id: "matrix", label: "Matrix", kind: "matrix", format: "matrix" }],
  outputs: [{ id: "diagonal", label: "Main diagonal", kind: "numberList" }],
  calculate: (input) => {
    const matrix = input.matrix as number[][];
    if (
      matrix.length === 0 ||
      matrix[0]!.length === 0 ||
      matrix.some((row) => row.length !== matrix[0]!.length)
    )
      simpleError("matrix", "Matrix must be nonempty and rectangular.");
    return {
      diagonal: Array.from(
        { length: Math.min(matrix.length, matrix[0]!.length) },
        (_, index) => matrix[index]![index]!,
      ),
    };
  },
});
export const runDiagonal = diagonalTool.execute;
export default diagonalTool;
