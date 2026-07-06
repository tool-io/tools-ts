import { createSimpleTool, simpleError } from "../../core/simple.js";
export const traceTool = createSimpleTool({
  id: "matrix/trace",
  title: "Matrix Trace Calculator",
  description:
    "Calculate the sum of the main diagonal of a square numeric matrix.",
  inputs: [{ id: "matrix", label: "Matrix", kind: "matrix", format: "matrix" }],
  outputs: [{ id: "trace", label: "Trace", kind: "number" }],
  calculate: (input) => {
    const matrix = input.matrix as number[][];
    if (
      matrix.length === 0 ||
      matrix.some((row) => row.length !== matrix.length)
    )
      simpleError("matrix", "Matrix must be nonempty and square.");
    return { trace: matrix.reduce((sum, row, index) => sum + row[index]!, 0) };
  },
});
export const runTrace = traceTool.execute;
export default traceTool;
