import { createSimpleTool, simpleError } from "../../core/simple.js";
export const dimensionsTool = createSimpleTool({
  id: "matrix/dimensions",
  title: "Matrix Dimensions Tool",
  description: "Return row and column counts for a rectangular numeric matrix.",
  inputs: [{ id: "matrix", label: "Matrix", kind: "matrix", format: "matrix" }],
  outputs: [
    { id: "rows", label: "Rows", kind: "integer" },
    { id: "columns", label: "Columns", kind: "integer" },
  ],
  calculate: (input) => {
    const matrix = input.matrix as number[][];
    if (matrix.length === 0) simpleError("matrix", "Enter a nonempty matrix.");
    const columns = matrix[0]!.length;
    if (columns === 0 || matrix.some((row) => row.length !== columns))
      simpleError("matrix", "Matrix must be nonempty and rectangular.");
    return { rows: matrix.length, columns };
  },
});
export const runDimensions = dimensionsTool.execute;
export default dimensionsTool;
