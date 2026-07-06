import { createSimpleTool, simpleError } from "../../core/simple.js";
export const scalarMultiplyTool = createSimpleTool({
  id: "matrix/scalar-multiply",
  title: "Matrix Scalar Multiplication Calculator",
  description: "Multiply every numeric matrix entry by a scalar.",
  inputs: [
    { id: "matrix", label: "Matrix", kind: "matrix", format: "matrix" },
    { id: "scalar", label: "Scalar", kind: "number" },
  ],
  outputs: [
    { id: "matrix", label: "Scaled matrix", kind: "matrix", format: "matrix" },
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
      matrix: matrix.map((row) =>
        row.map((value) => value * (input.scalar as number)),
      ),
    };
  },
});
export const runScalarMultiply = scalarMultiplyTool.execute;
export default scalarMultiplyTool;
