import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { parseNumericMatrix } from "../../parse/matrix/tool.js";

export const matrixAsCsv = (text: string): string | null => {
  const matrix = parseNumericMatrix(text);
  return matrix ? matrix.values.map((row) => row.join(",")).join("\n") : null;
};

export const matrixAsCsvExample = {
  input: { matrix: "[[1,2],[3,4]]" },
  output: { csv: "1,2\n3,4" },
} satisfies ToolExample<{ readonly matrix: string }, { readonly csv: string }>;

export const matrixAsCsvTool = createSimpleTool({
  id: "matrix/as-csv",
  title: "Matrix as CSV",
  description: "Convert a numeric matrix into comma-separated rows.",
  inputs: [
    { format: "matrix/number", id: "matrix", kind: "string", label: "Matrix" },
  ],
  outputs: [{ format: "text/csv", id: "csv", kind: "string", label: "CSV" }],
  calculate: (input) => {
    const csv = matrixAsCsv(input.matrix as string);
    if (csv === null)
      return simpleError("matrix", "Enter a valid numeric matrix.");
    return { csv };
  },
});

export const runMatrixAsCsv = matrixAsCsvTool.execute;
export default matrixAsCsvTool;
