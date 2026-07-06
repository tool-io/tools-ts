import { createSimpleTool, simpleError } from "../../core/simple.js";
export const symmetryCheckerTool = createSimpleTool({
  id: "matrix/symmetry-checker",
  title: "Matrix Symmetry Checker",
  description: "Check whether a square numeric matrix equals its transpose.",
  inputs: [{ id: "matrix", label: "Matrix", kind: "matrix", format: "matrix" }],
  outputs: [{ id: "symmetric", label: "Symmetric", kind: "boolean" }],
  calculate: (input) => {
    const matrix = input.matrix as number[][];
    if (
      matrix.length === 0 ||
      matrix.some((row) => row.length !== matrix.length)
    )
      simpleError("matrix", "Matrix must be nonempty and square.");
    for (let row = 0; row < matrix.length; row++)
      for (let column = 0; column < row; column++)
        if (matrix[row]![column] !== matrix[column]![row])
          return { symmetric: false };
    return { symmetric: true };
  },
});
export const runSymmetryChecker = symmetryCheckerTool.execute;
export default symmetryCheckerTool;
